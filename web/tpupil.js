/* The entrance pupil of a telescope as a mask, and the image of a star it makes (window.TP; node: module.exports).
   The pupil is sampled on an N x N grid spanning Q times its diameter, each cell supersampled 4 x 4 for its edges;
   the image is |FFT|^2 of the mask, so one image pixel is lambda / (Q D).  Pupils: a circle, or hexagonal segments
   in rings around a missing center; less a central obstruction (eps D across), spider vanes ({ ang, w, full, from,
   x0, y0 }: a bar through (x0, y0) when full, else a ray from (x0, y0) outward along ang; (x0, y0) defaults to the
   center) and pads ({ r, ang, d }). */
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
function pupilAndPSF(pu, eps) {
  const L = Q * pu.D, dx = L / N, re = new Float64Array(N * N), im = new Float64Array(N * N);
  const half = Math.ceil(pu.D / 2 / dx) + 2, sub = 4;
  let area = 0;
  for (let j = N / 2 - half; j < N / 2 + half; j++) for (let i = N / 2 - half; i < N / 2 + half; i++) {
    let k = 0;
    for (let a = 0; a < sub; a++) for (let b = 0; b < sub; b++) if (inPupil(pu, eps, (i - N / 2 + (a + 0.5) / sub) * dx, (j - N / 2 + (b + 0.5) / sub) * dx, true)) k++;
    let v = k / (sub * sub);
    // the vanes: each covers the part of the pixel within its strip, found exactly from the overlap of the pixel's
    // extent across the vane (a box of width dx (|cos| + |sin|)) with the vane's width (samples quantize a thin vane)
    if (v > 0) for (const vn of pu.vanes || []) {
      const xc = (i - N / 2 + 0.5) * dx - (vn.x0 || 0), yc = (j - N / 2 + 0.5) * dx - (vn.y0 || 0), c = Math.cos(vn.ang * DEG), sn = Math.sin(vn.ang * DEG);
      const along = xc * c + yc * sn, across = -xc * sn + yc * c;
      if (!(vn.full ? Math.abs(along) >= (vn.from || 0) : along >= (vn.from || 0))) continue;
      const pw = dx * (Math.abs(c) + Math.abs(sn)), lo = Math.max(across - pw / 2, -vn.w / 2), hi = Math.min(across + pw / 2, vn.w / 2);
      if (hi > lo) v *= 1 - (hi - lo) / pw;
    }
    re[j * N + i] = v; area += v;
  }
  const mask = Float32Array.from(re);
  fft2(re, im, N);
  const psf = new Float32Array(N * N);
  let mx = 0;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const ii = (i + N / 2) % N, jj = (j + N / 2) % N, v = re[jj * N + ii] ** 2 + im[jj * N + ii] ** 2;
    psf[j * N + i] = v; if (v > mx) mx = v;
  }
  for (let k = 0; k < psf.length; k++) psf[k] /= mx;
  // the core's FWHM, along x and y through the peak (pixels), by interpolating the half-maximum crossings
  // (a quadratic through the three samples around the crossing: the core is curved on the scale of a pixel)
  const c = N / 2, cross = get => {
    let k = 0; while (get(k + 1) > 0.5 && k < N / 4) k++;
    const k0 = Math.max(0, k - 1), y0 = get(k0), y1 = get(k0 + 1), y2 = get(k0 + 2);
    const A = (y0 - 2 * y1 + y2) / 2, B = (y2 - y0) / 2, C = y1 - 0.5;           // y(t) - 0.5 = A t^2 + B t + C, t from k0 + 1
    const disc = B * B - 4 * A * C;
    if (Math.abs(A) < 1e-12 || disc < 0) { const a = get(k), b = get(k + 1); return k + (a - 0.5) / (a - b); }
    const r1 = (-B - Math.sqrt(disc)) / (2 * A), r2 = (-B + Math.sqrt(disc)) / (2 * A), lo = k - (k0 + 1), hi = lo + 1;
    const t = r1 >= lo - 1e-9 && r1 <= hi + 1e-9 ? r1 : r2;
    return k0 + 1 + t;
  };
  const fw = (cross(k => psf[c * N + c + k]) + cross(k => psf[c * N + c - k]) + cross(k => psf[(c + k) * N + c]) + cross(k => psf[(c - k) * N + c])) / 2;
  return { mask, psf, area: area * dx * dx, dx, fwPix: fw };
}
// radix-2 FFT in place (re, im of length n), and the 2-D transform by rows then columns
function fft1(re, im, n, off, stride) {
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
    if (i < j) { const a = off + i * stride, b = off + j * stride; [re[a], re[b]] = [re[b], re[a]]; [im[a], im[b]] = [im[b], im[a]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = off + (i + k) * stride, b = off + (i + k + len / 2) * stride;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}
function fft2(re, im, n) {
  for (let j = 0; j < n; j++) fft1(re, im, n, j * n, 1);
  for (let i = 0; i < n; i++) fft1(re, im, n, i, n);
}


const API = { N, Q, inPupil, pupilAndPSF, fft2 };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.TP = API;
})(typeof window !== "undefined" ? window : globalThis);
