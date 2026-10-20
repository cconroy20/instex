/* The radio interferometer of the Interferometer mode (window.RI; node: module.exports).
   An array of antennas at one site, at local east, north, up positions (m). Each pair of antennas is a baseline;
   turned into the equatorial frame (X toward the meridian on the equator, Y toward the east, Z toward the pole), a
   baseline seen from a source at hour angle H and declination dec samples the sky's visibility at (u, v), the
   baseline's projection on the plane facing the source, in wavelengths. As the Earth turns, each sample runs along
   an ellipse in the uv plane; a real sky's visibility is Hermitian, so each sample also gives its mirror point
   (-u, -v). The samples are weighted (natural, uniform or Briggs robust), gridded and Fourier transformed: the
   weights alone give the synthesized (dirty) beam, and the weights times the sky's visibilities give the dirty
   image, the sky (times the primary beam) convolved with the dirty beam. Grids are n x n with the origin at index
   0 (wrapped), x along u and l (east), y along v and m (north). */
(function (root) {
"use strict";
const TP = root.TP || require("./tpupil.js");
const DEG = Math.PI / 180, RAD = 180 / Math.PI * 3600, C = 299792458;

// ------------------------------------------------------------------ geometry
// a baseline from local east, north, up (m) at latitude lat to the equatorial X, Y, Z (m)
function toXYZ(e, n, u, lat) {
  const sl = Math.sin(lat), cl = Math.cos(lat);
  return [-n * sl + u * cl, e, n * cl + u * sl];
}
// the baselines between the antennas switched on (on !== false): X, Y, Z (m) and the length on the ground (m)
function baselines(ants, lat) {
  const on = ants.filter(a => a.on !== false), out = [];
  for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) {
    const de = on[j].e - on[i].e, dn = on[j].n - on[i].n, du = (on[j].u || 0) - (on[i].u || 0);
    const [X, Y, Z] = toXYZ(de, dn, du, lat);
    out.push({ i, j, X, Y, Z, len: Math.hypot(de, dn, du) });
  }
  return out;
}
// (u, v) in the baseline's units for hour angle H and declination dec (radians)
function uvAt(b, H, dec) {
  const sh = Math.sin(H), ch = Math.cos(H), sd = Math.sin(dec), cd = Math.cos(dec);
  return [sh * b.X + ch * b.Y, -sd * ch * b.X + sd * sh * b.Y + cd * b.Z];
}
// the source's elevation (radians) at hour angle H from latitude lat
const elevation = (H, dec, lat) => Math.asin(Math.max(-1, Math.min(1, Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H))));
// the hour angles of an observation dur hours long centered on the meridian, step hours apart (one for a snapshot)
function hourAngles(dur, step) {
  if (!(dur > 0)) return [0];
  const n = Math.max(2, Math.round(dur / step) + 1);
  return Array.from({ length: n }, (_, k) => -dur / 2 + dur * k / (n - 1));
}
// the hours of the observation with the source above the elevation limit
function hoursUp(dur, dec, lat, elMin) {
  if (!(dur > 0)) return elevation(0, dec, lat) >= elMin ? 0 : -1;
  const Hs = hourAngles(dur, 1 / 120);
  let k = 0; for (const h of Hs) if (elevation(h * 15 * DEG, dec, lat) >= elMin) k++;
  return dur * k / Hs.length;
}

// ------------------------------------------------------------------ the samples
// o: { ants, lat, dec, elMin (radians), dur (h), nu, bw (Hz), nCh, step (h), budget, hMax (h, or undefined for the
// whole observation) }. The samples (wavelengths) run over the hour angles above the elevation limit, then the
// baselines, then the frequencies; the time step coarsens to keep the count within the budget.
function sample(o) {
  const B = baselines(o.ants, o.lat), nb = B.length;
  const nCh = o.bw > 0 ? Math.max(2, o.nCh || 8) : 1;
  const nus = nCh === 1 ? [o.nu] : Array.from({ length: nCh }, (_, k) => o.nu - o.bw / 2 + o.bw * k / (nCh - 1));
  let step = o.step || 1 / 60;
  if (o.dur > 0 && o.budget && nb * nCh * (o.dur / step + 1) > o.budget) step = o.dur / Math.max(1, Math.floor(o.budget / Math.max(1, nb * nCh)) - 1);
  const Hs = hourAngles(o.dur, step);
  const up = Hs.filter(h => (o.hMax === undefined || h <= o.hMax + 1e-9) && elevation(h * 15 * DEG, o.dec, o.lat) >= o.elMin);
  const m = nb * nCh * up.length, u = new Float32Array(m), v = new Float32Array(m);
  const sd = Math.sin(o.dec), cd = Math.cos(o.dec), f = nus.map(nu => nu / C);
  let k = 0;
  for (const h of up) {
    const H = h * 15 * DEG, sh = Math.sin(H), ch = Math.cos(H);
    for (const b of B) {
      const u0 = sh * b.X + ch * b.Y, v0 = -sd * ch * b.X + sd * sh * b.Y + cd * b.Z;
      for (let c = 0; c < nCh; c++) { u[k] = u0 * f[c]; v[k] = v0 * f[c]; k++; }
    }
  }
  return { u, v, n: m, nb, nCh, nus, Hs, up, step, B };
}

// ------------------------------------------------------------------ weighting
// Each sample's weight: natural (all 1), uniform (1 / W, with W the count of samples and mirror points in the
// sample's cell, cell wavelengths wide) or Briggs robust R (1 / (1 + W f^2), f^2 = (5 x 10^-R)^2 / (sum W^2 / sum w)).
function weigh(S, scheme, R, cell) {
  const w = new Float32Array(S.n).fill(1);
  if (scheme === "natural" || !S.n) return w;
  let M = 0;
  for (let k = 0; k < S.n; k++) M = Math.max(M, Math.abs(S.u[k]), Math.abs(S.v[k]));
  const h = Math.ceil(M / cell) + 1, side = 2 * h + 1, G = new Float32Array(side * side), idx = new Int32Array(S.n);
  for (let k = 0; k < S.n; k++) {
    const p = Math.round(S.u[k] / cell), q = Math.round(S.v[k] / cell);
    idx[k] = (q + h) * side + (p + h);
    G[idx[k]]++; G[(h - q) * side + (h - p)]++;
  }
  if (scheme === "uniform") { for (let k = 0; k < S.n; k++) w[k] = 1 / G[idx[k]]; return w; }
  let s2 = 0;
  for (let k = 0; k < G.length; k++) s2 += G[k] * G[k];
  const f2 = Math.pow(5 * Math.pow(10, -R), 2) / (s2 / (2 * S.n));
  for (let k = 0; k < S.n; k++) w[k] = 1 / (1 + G[idx[k]] * f2);
  return w;
}

// ------------------------------------------------------------------ gridding and transforms
// The weights on an n x n grid of cells du wide (wavelengths), each sample in its nearest cell and its mirror in the
// mirror cell; samples beyond the grid are dropped (and counted).
function grid(S, w, n, du) {
  const g = new Float64Array(n * n), h = n / 2;
  let drop = 0;
  for (let k = 0; k < S.n; k++) {
    const p = Math.round(S.u[k] / du), q = Math.round(S.v[k] / du);
    if (p >= h || p <= -h || q >= h || q <= -h) { drop++; continue; }
    g[((q + n) % n) * n + ((p + n) % n)] += w[k];
    g[((n - q) % n) * n + ((n - p) % n)] += w[k];
  }
  return { g, drop };
}
// The dirty beam and the dirty image by one complex FFT: the beam is the transform of the gridded weights W, the
// image the transform of W V (V the sky's visibilities on the grid, { re, im }), both real because W and W V are
// Hermitian, so W + i W V transforms to beam + i image. The inverse transform comes from the forward one,
// ifft(z) = conj(fft(conj(z))) / n^2. The beam is scaled to 1 at its center; the image then reads in flux per beam.
function dirty(W, V, n) {
  const re = new Float64Array(n * n), im = new Float64Array(n * n);
  for (let k = 0; k < n * n; k++) {
    const w = W[k];
    if (!w) continue;
    if (V) { re[k] = w - w * V.im[k]; im[k] = -w * V.re[k]; } else re[k] = w;
  }
  TP.fft2(re, im, n);
  const b0 = re[0], beam = new Float32Array(n * n), img = V ? new Float32Array(n * n) : null;
  if (!(b0 > 0)) return { beam, img };
  for (let k = 0; k < n * n; k++) { beam[k] = re[k] / b0; if (img) img[k] = -im[k] / b0; }
  return { beam, img };
}
// the forward transform of a real image (wrapped, origin at index 0): its visibilities on the grid
function visibilities(s, n) {
  const re = Float64Array.from(s), im = new Float64Array(n * n);
  TP.fft2(re, im, n);
  return { re, im };
}

// ------------------------------------------------------------------ the sky
// Sky models, all centered on the phase center and of total flux 1: a point; a double (two halves of the flux size
// apart, east-west); a circular Gaussian of FWHM size; a uniform disc of diameter size; a ring (a thin annulus,
// RING_IN to 1 of the radius) of diameter size.
const RING_IN = 0.9;
// The model on a wrapped n x n grid of pixels pix (radians) wide, each pixel's flux (sub-sampled over the pixel),
// times a Gaussian primary beam of FWHM pb (radians; 0 for none).
function skyImage(model, size, n, pix, pb) {
  const s = new Float64Array(n * n), h = n / 2;
  const put = (i, j, f) => { if (i <= -h || i >= h || j <= -h || j >= h) return; s[((j + n) % n) * n + ((i + n) % n)] += f; };
  const A = (l, m) => (pb > 0 ? Math.exp(-4 * Math.LN2 * (l * l + m * m) / (pb * pb)) : 1);
  if (model === "point") { put(0, 0, A(0, 0)); return s; }
  if (model === "double") {
    // each point shared among its four nearest pixels (bilinear)
    for (const sx of [-1, 1]) {
      const x = sx * size / 2 / pix, i = Math.floor(x), fx = x - i, f = 0.5 * A(sx * size / 2, 0);
      put(i, 0, f * (1 - fx)); put(i + 1, 0, f * fx);
    }
    return s;
  }
  const r2 = size / 2, R = model === "gaussian" ? 1.5 * size : r2, K = Math.min(h - 1, Math.ceil(R / pix) + 1);
  const sub = size / pix < 4 ? 8 : size / pix < 32 ? 4 : 2;
  const prof = model === "gaussian" ? r => Math.exp(-4 * Math.LN2 * r * r / (size * size))
    : model === "disc" ? r => (r <= r2 ? 1 : 0) : r => (r <= r2 && r >= RING_IN * r2 ? 1 : 0);
  let tot = 0;
  const vals = [];
  for (let j = -K; j <= K; j++) for (let i = -K; i <= K; i++) {
    let a = 0;
    for (let b = 0; b < sub; b++) for (let c = 0; c < sub; c++) a += prof(Math.hypot((i + (c + 0.5) / sub - 0.5) * pix, (j + (b + 0.5) / sub - 0.5) * pix));
    if (a > 0) { vals.push([i, j, a]); tot += a; }
  }
  if (!(tot > 0)) { put(0, 0, A(0, 0)); return s; }                // smaller than a sub-pixel: a point
  for (const [i, j, a] of vals) put(i, j, a / tot * A(i * pix, j * pix));
  return s;
}
// J1 by its integral over one period, J1(x) = (1 / 2 pi) int cos(t - x sin t) dt, which the trapezoid rule
// integrates to rounding error for x below about M / 2; tabulated to 30 and interpolated, with the asymptotic form
// beyond
const J1T = (() => {
  const M = 96, t = new Float64Array(3001);
  for (let k = 0; k <= 3000; k++) { const x = k / 100; let a = 0; for (let q = 0; q < M; q++) { const tau = 2 * Math.PI * q / M; a += Math.cos(tau - x * Math.sin(tau)); } t[k] = a / M; }
  return t;
})();
function J1(x) {
  const ax = Math.abs(x), sg = x < 0 ? -1 : 1;
  if (ax < 30) { const u = ax * 100, k = Math.floor(u), f = u - k; return sg * (J1T[k] + (J1T[Math.min(3000, k + 1)] - J1T[k]) * f); }
  const w = ax - 0.75 * Math.PI;
  return sg * Math.sqrt(2 / (Math.PI * ax)) * (Math.cos(w) - 3 / (8 * ax) * Math.sin(w));
}
const Lam = x => (Math.abs(x) < 1e-8 ? 1 : 2 * J1(x) / x);          // 2 J1(x) / x, 1 at 0
// the model's visibility (real: every model is symmetric about the center) at (u, v) wavelengths, without the
// primary beam
function vis(model, size, u, v) {
  const q = Math.hypot(u, v);
  if (model === "point") return 1;
  if (model === "double") return Math.cos(Math.PI * u * size);
  if (model === "gaussian") return Math.exp(-Math.PI * Math.PI * size * size * q * q / (4 * Math.LN2));
  if (model === "disc") return Lam(Math.PI * size * q);
  const r2 = size / 2, r1 = RING_IN * r2;
  return (r2 * r2 * Lam(2 * Math.PI * q * r2) - r1 * r1 * Lam(2 * Math.PI * q * r1)) / (r2 * r2 - r1 * r1);
}

// ------------------------------------------------------------------ the beam's size and sidelobes
const cen = (k, n) => { const i = k % n, j = Math.floor(k / n); return [i >= n / 2 ? i - n : i, j >= n / 2 ? j - n : j]; };
// the pixels connected to the center with b above lo (4-neighbors on the wrapped grid); null if they reach the edge
function lobe(b, n, lo) {
  const seen = new Uint8Array(n * n), out = [0], h = n / 2;
  seen[0] = 1;
  for (let q = 0; q < out.length; q++) {
    const [i, j] = cen(out[q], n);
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = i + di, c = j + dj;
      if (a <= -h || a >= h - 1 || c <= -h || c >= h - 1) return null;
      const k = ((c + n) % n) * n + ((a + n) % n);
      if (!seen[k] && b[k] > lo) { seen[k] = 1; out.push(k); }
    }
  }
  return { list: out, mask: seen };
}
// The fitted beam: an elliptical Gaussian through the main lobe's pixels above half the peak, by least squares on
// ln b = -(a x^2 + 2 c x y + d y^2). FWHMs in radians, the major axis's position angle in degrees east of north.
function fitBeam(b, n, pix) {
  const L = lobe(b, n, 0.5);
  if (!L || L.list.length < 5) return null;
  let s11 = 0, s12 = 0, s13 = 0, s22 = 0, s23 = 0, s33 = 0, t1 = 0, t2 = 0, t3 = 0;
  for (const k of L.list) {
    const [x, y] = cen(k, n), r1 = x * x, r2 = 2 * x * y, r3 = y * y, z = -Math.log(Math.max(1e-6, b[k]));
    s11 += r1 * r1; s12 += r1 * r2; s13 += r1 * r3; s22 += r2 * r2; s23 += r2 * r3; s33 += r3 * r3;
    t1 += r1 * z; t2 += r2 * z; t3 += r3 * z;
  }
  // solve the 3 x 3 normal equations by Cramer's rule
  const det = (a, b2, c, d, e, f, g, h2, i) => a * (e * i - f * h2) - b2 * (d * i - f * g) + c * (d * h2 - e * g);
  const D0 = det(s11, s12, s13, s12, s22, s23, s13, s23, s33);
  if (!(Math.abs(D0) > 0)) return null;
  const a = det(t1, s12, s13, t2, s22, s23, t3, s23, s33) / D0, c = det(s11, t1, s13, s12, t2, s23, s13, t3, s33) / D0, d = det(s11, s12, t1, s12, s22, t2, s13, s23, t3) / D0;
  const tr = a + d, dif = Math.sqrt(Math.max(0, (a - d) * (a - d) / 4 + c * c)), l1 = tr / 2 - dif, l2 = tr / 2 + dif;
  if (!(l1 > 0 && l2 > 0)) return null;
  // the major axis: the eigenvector of the smaller eigenvalue
  let ex = c, ey = l1 - a;
  if (Math.hypot(ex, ey) < 1e-12 * (Math.abs(a) + Math.abs(d))) { ex = a <= d ? 1 : 0; ey = a <= d ? 0 : 1; }
  let pa = Math.atan2(ex, ey) / DEG; pa = ((pa % 180) + 180) % 180;
  return { maj: 2 * Math.sqrt(Math.LN2 / l1) * pix, min: 2 * Math.sqrt(Math.LN2 / l2) * pix, pa, npix: L.list.length };
}
// the largest sidelobe beyond the main lobe, relative to the peak, with its sign: the main lobe is the region
// around the center where b > 0 (out to its first null), but no further than rmax pixels (a snapshot's positive
// ridges run far out, and count as sidelobes)
function sidelobe(b, n, rmax) {
  const seen = new Uint8Array(n * n), out = [0], h = n / 2, r2 = rmax * rmax;
  seen[0] = 1;
  for (let q = 0; q < out.length; q++) {
    const [i, j] = cen(out[q], n);
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = i + di, c = j + dj;
      if (a <= -h || a >= h || c <= -h || c >= h || a * a + c * c > r2) continue;
      const k = ((c + n) % n) * n + ((a + n) % n);
      if (!seen[k] && b[k] > 0) { seen[k] = 1; out.push(k); }
    }
  }
  let best = 0;
  for (let k = 0; k < n * n; k++) if (!seen[k] && Math.abs(b[k]) > Math.abs(best)) best = b[k];
  return best;
}

// ------------------------------------------------------------------ made-up layouts
// N antennas spanning about size (m, the longest baseline): random over a disc, a square grid, an east-west line,
// the shapes L, T, Y and a cross (one antenna at the junction, the rest spaced evenly along the arms), or a ring.
// A layout whose antennas would stand closer than DISH_GAP dishes is spread out (scaled up as a whole).
const LAYOUTS = ["random", "grid", "line", "L", "T", "Y", "cross", "ring"], DISH_GAP = 1.2;
// a seeded random number generator (mulberry32), so that a random layout comes back the same from a link
function rng(seed) {
  let a = (seed >>> 0) || 1;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function layout(kind, N, size, dish, seed = 1) {
  const P = [];
  // arms: [azimuth (degrees east of north), length (m)]
  const arms = list => {
    P.push([0, 0]);
    const m = list.map(() => 0);
    for (let k = 0; k < N - 1; k++) m[k % list.length]++;
    list.forEach(([az, len], j) => { for (let k = 1; k <= m[j]; k++) { const r = len * k / m[j]; P.push([r * Math.sin(az * DEG), r * Math.cos(az * DEG)]); } });
  };
  if (kind === "random") {
    const R = size / 2, rnd = rng(seed);
    for (let k = 0; k < N; k++) {
      let e = 0, n = 0;
      for (let t = 0; t < 500; t++) {
        const r = R * Math.sqrt(rnd()), th = 2 * Math.PI * rnd();
        e = r * Math.cos(th); n = r * Math.sin(th);
        if (P.every(p => Math.hypot(p[0] - e, p[1] - n) >= DISH_GAP * dish)) break;
      }
      P.push([e, n]);
    }
  } else if (kind === "grid") {
    const k = Math.ceil(Math.sqrt(N)), rowsN = Math.ceil(N / k), s = size / Math.SQRT2 / Math.max(1, k - 1);
    for (let i = 0; i < N; i++) P.push([((i % k) - (k - 1) / 2) * s, (Math.floor(i / k) - (rowsN - 1) / 2) * s]);
  } else if (kind === "line") for (let i = 0; i < N; i++) P.push([N > 1 ? (i / (N - 1) - 0.5) * size : 0, 0]);
  else if (kind === "ring") for (let i = 0; i < N; i++) { const th = 2 * Math.PI * i / N; P.push([size / 2 * Math.sin(th), size / 2 * Math.cos(th)]); }
  else if (kind === "L") arms([[90, size / Math.SQRT2], [0, size / Math.SQRT2]]);
  else if (kind === "T") arms([[270, size / 2], [90, size / 2], [180, size / 2]]);
  else if (kind === "Y") arms([[0, size / Math.sqrt(3)], [120, size / Math.sqrt(3)], [240, size / Math.sqrt(3)]]);
  else if (kind === "cross") arms([[0, size / 2], [90, size / 2], [180, size / 2], [270, size / 2]]);
  let dmin = Infinity;
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) dmin = Math.min(dmin, Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]));
  const f = dmin > 0 && dmin < DISH_GAP * dish ? DISH_GAP * dish / dmin : 1;
  return P.map(p => [p[0] * f, p[1] * f, 0]);
}

// ------------------------------------------------------------------ scales
// the ground baselines' lengths (m), sorted
const lengths = (ants, lat) => baselines(ants, lat).map(b => b.len).sort((x, y) => x - y);
// a percentile of a sorted list (linear between ranks)
function pctile(sorted, p) {
  if (!sorted.length) return NaN;
  const r = p / 100 * (sorted.length - 1), k = Math.floor(r), f = r - k;
  return sorted[k] + (sorted[Math.min(sorted.length - 1, k + 1)] - sorted[k]) * f;
}

const API = { DEG, RAD, C, RING_IN, LAYOUTS, DISH_GAP, rng, layout, toXYZ, baselines, uvAt, elevation, hourAngles, hoursUp, sample, weigh, grid, dirty, visibilities, skyImage, J1, Lam, vis, lobe, fitBeam, sidelobe, lengths, pctile };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.RI = API;
})(typeof window !== "undefined" ? window : globalThis);
