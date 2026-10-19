/* The entrance pupil of a telescope as a mask, and the image of a star it makes (window.TP; node: module.exports).
   The pupil is sampled on an N x N grid spanning Q times its diameter, each cell supersampled 4 x 4 for its edges;
   the image is |FFT|^2 of the mask, so one image pixel is lambda / (Q D).  Pupils: a circle, or hexagonal segments
   in rings around a missing center; less a central obstruction (eps D across), spider vanes ({ ang, w, full, from,
   x0, y0 }: a bar through (x0, y0) when full, else a ray from (x0, y0) outward along ang; (x0, y0) defaults to the
   center) and pads ({ r, ang, d }).  Also the long-exposure image through the atmosphere (seeingPSF). */
(function (root) {
"use strict";
const N = 1024, Q = 8, DEG = Math.PI / 180;
function inPupil(pu, eps, x, y, noVanes) {
  const r = Math.hypot(x, y), R = pu.D / 2;
  if (pu.kind === "hex") {
    // segments: pointy-topped hexagons on a lattice of the flat-to-flat size, rings 1 ... n around a missing center
    const s = pu.flat, a = s / 2 - (pu.gap || 0) / 2;
    const rf = (2 * y) / (Math.sqrt(3) * s), qf = x / s - rf / 2;      // lattice coordinates of the point
    let hit = false;
    const q0 = Math.round(qf), r0 = Math.round(rf);
    for (let dq = -1; dq <= 1 && !hit; dq++) for (let dr = -1; dr <= 1 && !hit; dr++) {
      const qq = q0 + dq, rr = r0 + dr, ring = Math.max(Math.abs(qq), Math.abs(rr), Math.abs(qq + rr));
      if (ring < 1 || ring > pu.rings) continue;
      const cx = s * (qq + rr / 2), cy = s * Math.sqrt(3) / 2 * rr, px = x - cx, py = y - cy;
      let ok = true;
      for (const t of [0, 60, 120]) { const c = Math.cos(t * DEG), sn = Math.sin(t * DEG); if (Math.abs(px * c + py * sn) > a) { ok = false; break; } }
      if (ok) hit = true;
    }
    if (!hit) return false;
  } else if (r > R) return false;
  if (pu.clip && r > pu.clip / 2) return false;                      // a circular stop (an undersized secondary)
  if (r < eps * pu.D / 2) return false;
  if (!noVanes) for (const v of pu.vanes || []) {
    const c = Math.cos(v.ang * DEG), sn = Math.sin(v.ang * DEG), X = x - (v.x0 || 0), Y = y - (v.y0 || 0), along = X * c + Y * sn, across = -X * sn + Y * c;
    if (Math.abs(across) < v.w / 2 && (v.full ? Math.abs(along) >= (v.from || 0) : along >= (v.from || 0))) return false;
  }
  for (const p of pu.pads || []) { const px = p.r * Math.cos(p.ang * DEG), py = p.r * Math.sin(p.ang * DEG); if (Math.hypot(x - px, y - py) < p.d / 2) return false; }
  return true;
}
// the mask on an n x n grid of cells dx wide, centered on the pupil: each cell's covered fraction, the edges
// supersampled sub x sub, and the vanes' coverage found exactly (sampling would quantize a thin vane)
function raster(pu, eps, n, dx, sub = 4) {
  const m = new Float64Array(n * n), half = Math.min(n / 2, Math.ceil(pu.D / 2 / dx) + 2);
  let area = 0;
  for (let j = n / 2 - half; j < n / 2 + half; j++) for (let i = n / 2 - half; i < n / 2 + half; i++) {
    let k = 0;
    for (let a = 0; a < sub; a++) for (let b = 0; b < sub; b++) if (inPupil(pu, eps, (i - n / 2 + (a + 0.5) / sub) * dx, (j - n / 2 + (b + 0.5) / sub) * dx, true)) k++;
    let v = k / (sub * sub);
    // the vanes: each covers the part of the pixel within its strip, from the overlap of the pixel's extent across
    // the vane (a box of width dx (|cos| + |sin|)) with the vane's width
    if (v > 0) for (const vn of pu.vanes || []) {
      const xc = (i - n / 2 + 0.5) * dx - (vn.x0 || 0), yc = (j - n / 2 + 0.5) * dx - (vn.y0 || 0), c = Math.cos(vn.ang * DEG), sn = Math.sin(vn.ang * DEG);
      const along = xc * c + yc * sn, across = -xc * sn + yc * c;
      if (!(vn.full ? Math.abs(along) >= (vn.from || 0) : along >= (vn.from || 0))) continue;
      const pw = dx * (Math.abs(c) + Math.abs(sn)), lo = Math.max(across - pw / 2, -vn.w / 2), hi = Math.min(across + pw / 2, vn.w / 2);
      if (hi > lo) v *= 1 - (hi - lo) / pw;
    }
    m[j * n + i] = v; area += v;
  }
  return { m, area: area * dx * dx };
}
// the core's FWHM (pixels) along x and y through the peak at (n/2, n/2), by interpolating the half-maximum
// crossings (a quadratic through the three samples around the crossing: the core is curved on the scale of a pixel)
function fwhmPix(psf, n) {
  const c = n / 2, cross = get => {
    let k = 0; while (get(k + 1) > 0.5 && k < n / 2 - 3) k++;
    const k0 = Math.max(0, k - 1), y0 = get(k0), y1 = get(k0 + 1), y2 = get(k0 + 2);
    const A = (y0 - 2 * y1 + y2) / 2, B = (y2 - y0) / 2, C = y1 - 0.5;           // y(t) - 0.5 = A t^2 + B t + C, t from k0 + 1
    const disc = B * B - 4 * A * C;
    if (Math.abs(A) < 1e-12 || disc < 0) { const a = get(k), b = get(k + 1); return k + (a - 0.5) / (a - b); }
    const r1 = (-B - Math.sqrt(disc)) / (2 * A), r2 = (-B + Math.sqrt(disc)) / (2 * A), lo = k - (k0 + 1), hi = lo + 1;
    const t = r1 >= lo - 1e-9 && r1 <= hi + 1e-9 ? r1 : r2;
    return k0 + 1 + t;
  };
  return (cross(k => psf[c * n + c + k]) + cross(k => psf[c * n + c - k]) + cross(k => psf[(c + k) * n + c]) + cross(k => psf[(c - k) * n + c])) / 2;
}
// |FFT|^2 of re + i im, shifted so the center is at (n/2, n/2) and scaled to a peak of 1
function centered(re, im, n, power) {
  const out = new Float32Array(n * n);
  let mx = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const k = ((j + n / 2) % n) * n + (i + n / 2) % n, v = power ? re[k] ** 2 + im[k] ** 2 : Math.max(0, Math.hypot(re[k], im[k]));
    out[j * n + i] = v; if (v > mx) mx = v;
  }
  for (let k = 0; k < out.length; k++) out[k] /= mx;
  return out;
}
function pupilAndPSF(pu, eps) {
  const dx = Q * pu.D / N, { m: re, area } = raster(pu, eps, N, dx), im = new Float64Array(N * N);
  const mask = Float32Array.from(re);
  fft2(re, im, N);
  const psf = centered(re, im, N, true);
  return { mask, psf, area, dx, fwPix: fwhmPix(psf, N) };
}
// the pupil for drawing: n x n cells over a square ext (m) across
function pupilImage(pu, eps, n, ext) { return Float32Array.from(raster(pu, eps, n, ext / n, 3).m); }
// The long-exposure image of a star through the atmosphere: the telescope's transfer function (the pupil's
// autocorrelation, the transform of its diffraction-limited image) times the atmosphere's, exp[-K_OTF (s / r0)^(5/3)]
// at a separation s in the pupil (Kolmogorov turbulence), transformed back; r0 = K_FWHM lam / seeing FWHM, so the
// seeing alone gives the FWHM set.  K_OTF: half of the structure function's 6.88 (Sarazin & Roddier 1990 Eqs. 7, 22;
// Tokovinin 2002 Eqs. 15, 16), printed as 3.44 by Coulman 1985 Eq. 5.2 after Fried 1966.  K_FWHM: 0.976 (Martinez et
// al. 2010, The Messenger 141, note 1), the FWHM of that transfer function's image (0.9755 by transform; Sarazin &
// Roddier and Tokovinin round to 0.98).  Sources: data/telescopes/seeing.md.  lam in m, the seeing FWHM in radians.
// The grid: N cells of dx, the pupil `across` cells wide (at most N / 2, so the autocorrelation does not wrap), the
// image pixel lam / (N dx).  Also returned: the peak relative to the diffraction-limited image of the same flux
// (the sum of the transfer function with and without the atmosphere).
const K_OTF = 3.44, K_FWHM = 0.976;
function seeingPSF(pu, eps, lam, see) {
  const ld = lam / pu.D, r0 = K_FWHM * lam / see, fw = Math.hypot(see, 1.03 * ld);
  const across = Math.round(Math.min(N / 2, Math.max(128, 12 * fw / ld)));
  const dx = pu.D / across, { m: re } = raster(pu, eps, N, dx, 2), im = new Float64Array(N * N);
  fft2(re, im, N);
  for (let k = 0; k < re.length; k++) { re[k] = re[k] ** 2 + im[k] ** 2; im[k] = 0; }
  fft2(re, im, N);                                                   // the transfer function (even: the sign of s does not matter)
  let s0 = 0, s1 = 0;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, sx = (i < N / 2 ? i : i - N) * dx, sy = (j < N / 2 ? j : j - N) * dx;
    const a = Math.exp(-K_OTF * Math.pow(Math.hypot(sx, sy) / r0, 5 / 3));
    s0 += re[k]; re[k] *= a; im[k] *= a; s1 += re[k];
  }
  fft2(re, im, N);
  const psf = centered(re, im, N, false);
  return { psf, pix: lam / (N * dx), fwPix: fwhmPix(psf, N), r0, peak: s1 / s0, across };
}
// radix-2 FFT in place (re, im of length n, contiguous), with the bit reversal and twiddles tabulated once per n;
// the 2-D transform by rows, then by columns copied out to a contiguous buffer (strided access is slow)
const PLANS = {};
function plan(n) {
  if (PLANS[n]) return PLANS[n];
  const rev = new Uint32Array(n), cs = new Float64Array(n / 2), sn = new Float64Array(n / 2), bits = Math.round(Math.log2(n));
  for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b); rev[i] = r; }
  for (let k = 0; k < n / 2; k++) { cs[k] = Math.cos(-2 * Math.PI * k / n); sn[k] = Math.sin(-2 * Math.PI * k / n); }
  return (PLANS[n] = { rev, cs, sn, tr: new Float64Array(n), ti: new Float64Array(n) });
}
function fft1(re, im, n, off, P) {
  const { rev, cs, sn } = P;
  for (let i = 0; i < n; i++) {
    const j = rev[i];
    if (i < j) { const a = off + i, b = off + j; let t = re[a]; re[a] = re[b]; re[b] = t; t = im[a]; im[a] = im[b]; im[b] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const h = len >> 1, step = n / len;
    for (let i = 0; i < n; i += len) for (let k = 0; k < h; k++) {
      const wr = cs[k * step], wi = sn[k * step], a = off + i + k, b = a + h;
      const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
      re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
    }
  }
}
function fft2(re, im, n) {
  const P = plan(n), { tr, ti } = P;
  for (let j = 0; j < n; j++) fft1(re, im, n, j * n, P);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) { tr[j] = re[j * n + i]; ti[j] = im[j * n + i]; }
    fft1(tr, ti, n, 0, P);
    for (let j = 0; j < n; j++) { re[j * n + i] = tr[j]; im[j * n + i] = ti[j]; }
  }
}


const API = { N, Q, K_OTF, K_FWHM, inPupil, raster, pupilAndPSF, pupilImage, seeingPSF, fft2 };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.TP = API;
})(typeof window !== "undefined" ? window : globalThis);
