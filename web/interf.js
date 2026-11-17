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
// the hour angle's advance per hour of time (radians): the Earth's mean rotation rate against the stars,
// 7.2921150e-5 rad/s (IERS; data/interf/formulas.md G12), times 3600 s; 15.041 degrees, not 15
const HA_PER_H = 7.2921150e-5 * 3600;

// ------------------------------------------------------------------ geometry
// a baseline from local east, north, up (m) at latitude lat to the equatorial X, Y, Z (m)
function toXYZ(e, n, u, lat) {
  const sl = Math.sin(lat), cl = Math.cos(lat);
  return [-n * sl + u * cl, e, n * cl + u * sl];
}
// An Earth-scale array (VLBI): a station's WGS84 geodetic latitude, longitude (radians) and height (m) to the
// equatorial frame of the array's reference meridian lon0 (X toward that meridian on the equator, Y 90 degrees east of
// it, Z toward the pole), m; the same frame as toXYZ's for a local array at lon0
function geoXYZ(lat, lon, h, lon0) {
  const a = 6378137, f = 1 / 298.257223563, e2 = f * (2 - f), sl = Math.sin(lat), N = a / Math.sqrt(1 - e2 * sl * sl);
  const X = (N + h) * Math.cos(lat) * Math.cos(lon), Y = (N + h) * Math.cos(lat) * Math.sin(lon), Z = (N * (1 - e2) + h) * sl;
  const c = Math.cos(lon0), s = Math.sin(lon0);
  return [X * c + Y * s, -X * s + Y * c, Z];
}
// the baselines between the antennas switched on (on !== false): X, Y, Z (m) and the length on the ground (m), as
// typed arrays. An array with more than maxPairs baselines (10,000 antennas make 50 million) gets a random draw of
// maxPairs distinct pairs (seeded, so the draw is the same each time); total is the full count.
function baselines(ants, lat, maxPairs = Infinity, seed = 7) {
  const on = ants.filter(a => a.on !== false), N = on.length, total = N * (N - 1) / 2, sub = total > maxPairs, nb = sub ? maxPairs : total;
  const X = new Float64Array(nb), Y = new Float64Array(nb), Z = new Float64Array(nb), len = new Float64Array(nb);
  const I = new Int32Array(nb), J = new Int32Array(nb);
  const sl = Math.sin(lat), cl = Math.cos(lat);
  // (an Earth-scale array's antennas carry xyz, in the equatorial frame already: geoXYZ)
  const put = (k, i, j) => {
    I[k] = i; J[k] = j;
    if (on[i].xyz) { const p = on[i].xyz, q = on[j].xyz; X[k] = q[0] - p[0]; Y[k] = q[1] - p[1]; Z[k] = q[2] - p[2]; len[k] = Math.hypot(X[k], Y[k], Z[k]); return; }
    const de = on[j].e - on[i].e, dn = on[j].n - on[i].n, du = (on[j].u || 0) - (on[i].u || 0);
    X[k] = -dn * sl + du * cl; Y[k] = de; Z[k] = dn * cl + du * sl; len[k] = Math.hypot(de, dn, du);
  };
  if (sub) {
    const rnd = rng(seed), seen = new Set();
    let k = 0;
    // (every pair with an antenna marked keep comes first: an outrigger's few long baselines, which a random draw
    // from a million short ones would mostly miss)
    for (let i = 0; i < N; i++) if (on[i].keep) for (let j = 0; j < N && k < nb; j++) {
      if (j === i) continue;
      const a = Math.min(i, j), b = Math.max(i, j), key = a * N + b;
      if (!seen.has(key)) { seen.add(key); put(k++, a, b); }
    }
    while (k < nb) {
      const i = Math.floor(rnd() * N); let j = Math.floor(rnd() * (N - 1)); if (j >= i) j++;
      const a = Math.min(i, j), b = Math.max(i, j), key = a * N + b;
      if (seen.has(key)) continue;
      seen.add(key); put(k++, a, b);
    }
  } else {
    let k = 0;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) put(k++, i, j);
  }
  return { X, Y, Z, len, I, J, length: nb, total, sub };
}
// the shortest and longest baselines on the ground over all pairs (exact, without keeping the pairs)
function extremes(ants) {
  const on = ants.filter(a => a.on !== false), N = on.length;
  let lo = Infinity, hi = 0;
  for (let i = 0; i < N; i++) { const a = on[i]; for (let j = i + 1; j < N; j++) { const b = on[j], de = a.xyz ? b.xyz[0] - a.xyz[0] : b.e - a.e, dn = a.xyz ? b.xyz[1] - a.xyz[1] : b.n - a.n, du = a.xyz ? b.xyz[2] - a.xyz[2] : (b.u || 0) - (a.u || 0), d2 = de * de + dn * dn + du * du; if (d2 < lo) lo = d2; if (d2 > hi) hi = d2; } }
  return N > 1 ? { bmin: Math.sqrt(lo), bmax: Math.sqrt(hi) } : { bmin: 0, bmax: 0 };
}
// (u, v) in the baseline's units for hour angle H and declination dec (radians)
function uvAt(b, H, dec) {
  const sh = Math.sin(H), ch = Math.cos(H), sd = Math.sin(dec), cd = Math.cos(dec);
  return [sh * b.X + ch * b.Y, -sd * ch * b.X + sd * sh * b.Y + cd * b.Z];
}
// the source's elevation (radians) at hour angle H from latitude lat
const elevation = (H, dec, lat) => Math.asin(Math.max(-1, Math.min(1, Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H))));
// the times of an observation dur hours long centered on the meridian, step hours apart (one for a snapshot), in
// hours of time from the transit (the hour angle is HA_PER_H times the time)
function hourAngles(dur, step) {
  if (!(dur > 0)) return [0];
  const n = Math.max(2, Math.round(dur / step) + 1);
  return Array.from({ length: n }, (_, k) => -dur / 2 + dur * k / (n - 1));
}
// the hours of the observation with the source above the elevation limit
function hoursUp(dur, dec, lat, elMin) {
  if (!(dur > 0)) return elevation(0, dec, lat) >= elMin ? 0 : -1;
  const Hs = hourAngles(dur, 1 / 120);
  let k = 0; for (const h of Hs) if (elevation(h * HA_PER_H, dec, lat) >= elMin) k++;
  return dur * k / Hs.length;
}

// the source's azimuth (radians, east of north) at hour angle H from latitude lat
const azimuth = (H, dec, lat) => Math.atan2(-Math.cos(dec) * Math.sin(H), Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.cos(H) * Math.sin(lat));
// An Earth-scale array: each station sees the source at its own hour angle (the reference meridian's plus the
// station's longitude east of it, dlon) and latitude, above its own limit and above its horizon mask (the terrain's
// elevation by azimuth, linear between the points); sta[i] = { lat, dlon, elMin, mask: { az, el } } (radians)
function staSees(s, H, dec) {
  const H1 = H + s.dlon, el = elevation(H1, dec, s.lat);
  if (el < s.elMin) return false;
  if (!s.mask) return true;
  const A = s.mask.az, E = s.mask.el, az = (azimuth(H1, dec, s.lat) + 2 * Math.PI) % (2 * Math.PI);
  let k = 0; while (k < A.length - 2 && A[k + 1] < az) k++;
  const f = A[k + 1] > A[k] ? Math.max(0, Math.min(1, (az - A[k]) / (A[k + 1] - A[k]))) : 0;
  return el >= E[k] + (E[k + 1] - E[k]) * f;
}
// the hours of the observation with at least one baseline (two stations) up
function hoursUpSta(dur, dec, sta) {
  const Hs = dur > 0 ? hourAngles(dur, 1 / 120) : [0];
  let k = 0;
  for (const h of Hs) { let n = 0; for (const s of sta) if (staSees(s, h * HA_PER_H, dec)) n++; if (n >= 2) k++; }
  return dur > 0 ? dur * k / Hs.length : k ? 0 : -1;
}
// ------------------------------------------------------------------ the samples
// o: { ants, lat, dec, elMin (radians), dur (h), nu, bw (Hz), nCh, step (h), budget, hMax (h, or undefined for the
// whole observation) }. The samples (wavelengths) run over the hour angles above the elevation limit, then the
// baselines, then the frequencies; the time step coarsens to keep the count within the budget.
function sample(o) {
  const B = o.B || baselines(o.ants, o.lat, o.maxPairs), nb = B.length, BX = B.X, BY = B.Y, BZ = B.Z;
  const nCh = o.bw > 0 ? Math.max(2, o.nCh || 8) : 1;
  // the channels: the centers of nCh equal slices of the band
  const nus = nCh === 1 ? [o.nu] : Array.from({ length: nCh }, (_, k) => o.nu + o.bw * ((k + 0.5) / nCh - 0.5));
  let step = o.step || 1 / 60;
  if (o.dur > 0 && o.budget && nb * nCh * (o.dur / step + 1) > o.budget) step = o.dur / Math.max(1, Math.floor(o.budget / Math.max(1, nb * nCh)) - 1);
  const Hs = hourAngles(o.dur, step);
  // (an Earth-scale array, o.sta: a baseline samples only while the source is above both its stations' limits; the
  // array-wide limit does not apply)
  const sta = o.sta, upS = sta ? new Uint8Array(sta.length) : null;
  const up = Hs.filter(h => (o.hMax === undefined || h <= o.hMax + 1e-9) && (sta || elevation(h * HA_PER_H, o.dec, o.lat) >= o.elMin));
  // (o.shadow: the dish diameter (m) of an array whose dishes track the source. At each time an antenna is shadowed
  // when another antenna nearer the source stands within a dish diameter of the first one's line of sight, their
  // separation projected on the sky; the shadowed antenna's baselines give no sample at that time, as the
  // observatories flag them)
  const shadow = o.shadow > 0 && !sta ? shadowOf(o.ants, o.lat, o.dec, o.shadow) : null;
  let nShadow = 0;
  const cap = nb * nCh * up.length, u = new Float32Array(cap), v = new Float32Array(cap);
  // (o.wq: each baseline's weight, 1 / (SEFD_i SEFD_j) for stations of different sensitivity, carried by its samples;
  // o.drift: a transit array's half-power beam width east-west (radians): the source drifts across the fixed beam, so
  // each sample also carries the beam's power toward the source at that moment, exp(-4 ln 2 x^2 / drift^2) with x =
  // cos(dec) sin(H) the source's offset east-west, 1 at transit and 1/2 at the half-power edges)
  const wb = o.wq || o.drift > 0 ? new Float32Array(cap) : null, tOff = new Int32Array(up.length + 1);
  const sd = Math.sin(o.dec), cd = Math.cos(o.dec), f = nus.map(nu => nu / C);
  let k = 0, t = 0;
  for (const h of up) {
    const H = h * HA_PER_H, sh = Math.sin(H), ch = Math.cos(H), xd = cd * sh, aD = o.drift > 0 ? Math.exp(-4 * Math.LN2 * xd * xd / (o.drift * o.drift)) : 1;
    if (sta) for (let i = 0; i < sta.length; i++) upS[i] = staSees(sta[i], H, o.dec) ? 1 : 0;
    const shd = shadow ? shadow(H) : null;
    for (let q = 0; q < nb; q++) {
      if (sta && !(upS[B.I[q]] && upS[B.J[q]])) continue;
      if (shd && (shd[B.I[q]] || shd[B.J[q]])) { nShadow += nCh; continue; }
      const u0 = sh * BX[q] + ch * BY[q], v0 = -sd * ch * BX[q] + sd * sh * BY[q] + cd * BZ[q];
      for (let c = 0; c < nCh; c++) { u[k] = u0 * f[c]; v[k] = v0 * f[c]; if (wb) wb[k] = (o.wq ? o.wq[q] : 1) * aD; k++; }
    }
    tOff[++t] = k;
  }
  // tOff[t]: the samples before the t-th time up (a time-ordered prefix, for the page's Play)
  return { u: u.subarray(0, k), v: v.subarray(0, k), wb: wb ? wb.subarray(0, k) : null, n: k, nb, nCh, nus, Hs, up, step, B, tOff, shadowed: nShadow / Math.max(1, nShadow + k) };
}
// The shadowing of an array of dishes of diameter D (m) tracking a source at declination dec from latitude lat: a
// function of the hour angle H (radians) giving, for each antenna switched on (in the order of baselines()), 1 when
// shadowed. Each antenna's position projected on the sky (u, v) and toward the source (w); antennas within D of each
// other in (u, v), found through a hash of cells D wide, shadow the one farther from the source.
function shadowOf(ants, lat, dec, D) {
  const on = ants.filter(a => a.on !== false), N = on.length, sl = Math.sin(lat), cl = Math.cos(lat);
  const X = new Float64Array(N), Y = new Float64Array(N), Z = new Float64Array(N);
  for (let i = 0; i < N; i++) { const a = on[i], u = a.u || 0; X[i] = -a.n * sl + u * cl; Y[i] = a.e; Z[i] = a.n * cl + u * sl; }
  const pu = new Float64Array(N), pv = new Float64Array(N), pw = new Float64Array(N), out = new Uint8Array(N), sd = Math.sin(dec), cd = Math.cos(dec), D2 = D * D;
  return H => {
    const sh = Math.sin(H), ch = Math.cos(H), cells = new Map();
    out.fill(0);
    for (let i = 0; i < N; i++) {
      pu[i] = sh * X[i] + ch * Y[i]; pv[i] = -sd * ch * X[i] + sd * sh * Y[i] + cd * Z[i]; pw[i] = cd * ch * X[i] - cd * sh * Y[i] + sd * Z[i];
      const key = Math.floor(pu[i] / D) * 1048576 + Math.floor(pv[i] / D), c = cells.get(key);
      if (c) c.push(i); else cells.set(key, [i]);
    }
    for (let i = 0; i < N; i++) {
      const cx = Math.floor(pu[i] / D), cy = Math.floor(pv[i] / D);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const c = cells.get((cx + dx) * 1048576 + cy + dy);
        if (c) for (const j of c) { if (j <= i) continue; const du = pu[j] - pu[i], dv = pv[j] - pv[i]; if (du * du + dv * dv < D2) out[pw[j] > pw[i] ? i : j] = 1; }
      }
    }
    return out;
  };
}

// ------------------------------------------------------------------ a single dish
// A filled aperture, an ellipse ew x ns (m) uniformly illuminated, at frequency nu (Hz): the dish measures every
// spacing within the aperture at once, each with the weight of the aperture's autocorrelation (the overlap of two
// copies of the ellipse that far apart, the "Chinese hat" (2 / pi) (acos x - x sqrt(1 - x^2)) of the scaled spacing
// x), so the synthesized beam is the diffraction pattern (the Airy pattern's power). Samples on a lattice over half
// the uv plane (the grid adds the mirror points; the center counts half), with the weights in w0.
function aperture(ew, ns, nu, R = 72) {
  const lam = C / nu, au = ew / lam, av = ns / lam, uu = [], vv = [], ww = [];
  for (let j = 0; j <= R; j++) for (let i = -R; i <= R; i++) {
    if (j === 0 && i < 0) continue;
    const u = i / R * au, v = j / R * av, x = Math.hypot(i / R, j / R);
    if (x >= 1) continue;
    uu.push(u); vv.push(v); ww.push((i === 0 && j === 0 ? 0.5 : 1) * (2 / Math.PI) * (Math.acos(x) - x * Math.sqrt(1 - x * x)));
  }
  return { u: Float32Array.from(uu), v: Float32Array.from(vv), w0: Float32Array.from(ww), n: uu.length, nb: 0, nCh: 1, nus: [nu], Hs: [0], up: [0], step: 0, single: { ew, ns, nu } };
}
// the aperture's weights put straight onto an n x n grid of cells du wide (the lattice of samples above, gridded,
// would alias against the grid's cells): each cell the autocorrelation at the cell's center
function apertureGrid(ap, n, du) {
  const g = new Float64Array(n * n), lam = C / ap.nu, au = ap.ew / lam, av = ap.ns / lam, h = n / 2;
  const P = Math.min(h - 1, Math.ceil(au / du)), Q = Math.min(h - 1, Math.ceil(av / du));
  for (let q = -Q; q <= Q; q++) for (let p = -P; p <= P; p++) {
    const x = Math.hypot(p * du / au, q * du / av);
    if (x < 1) g[((q + n) % n) * n + ((p + n) % n)] = (2 / Math.PI) * (Math.acos(x) - x * Math.sqrt(1 - x * x));
  }
  return { g, drop: au > (h - 1) * du || av > (h - 1) * du ? 1 : 0 };
}

// ------------------------------------------------------------------ weighting
// Each sample's weight: natural (all 1), uniform (1 / W, with W the count of samples and mirror points in the
// sample's cell, cell wavelengths wide) or Briggs robust R (1 / (1 + W f^2), f^2 = (5 x 10^-R)^2 / (sum W^2 / sum w)).
function weigh(S, scheme, R, cell) {
  if (S.w0) return Float32Array.from(S.w0);                          // a single dish: the aperture's own weights
  // each sample's own weight (S.wb: 1 / (SEFD_i SEFD_j) for stations of unequal sensitivity), 1 otherwise
  const w0 = S.wb, w = w0 ? Float32Array.from(w0.subarray(0, S.n)) : new Float32Array(S.n).fill(1);
  if (scheme === "natural" || !S.n) return w;
  let M = 0;
  for (let k = 0; k < S.n; k++) M = Math.max(M, Math.abs(S.u[k]), Math.abs(S.v[k]));
  const h = Math.ceil(M / cell) + 1, side = 2 * h + 1, G = new Float32Array(side * side), idx = new Int32Array(S.n);
  let sw = 0;
  for (let k = 0; k < S.n; k++) {
    const p = Math.round(S.u[k] / cell), q = Math.round(S.v[k] / cell), a = w0 ? w0[k] : 1;
    idx[k] = (q + h) * side + (p + h);
    G[idx[k]] += a; G[(h - q) * side + (h - p)] += a; sw += 2 * a;
  }
  if (scheme === "uniform") { for (let k = 0; k < S.n; k++) w[k] = w[k] / G[idx[k]]; return w; }
  let s2 = 0;
  for (let k = 0; k < G.length; k++) s2 += G[k] * G[k];
  const f2 = Math.pow(5 * Math.pow(10, -R), 2) / (s2 / sw);
  for (let k = 0; k < S.n; k++) w[k] = w[k] / (1 + G[idx[k]] * f2);
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
// The sky smoothed by the fitted beam (no sidelobes): the weights replaced by the transform of the beam's Gaussian,
// exp(-pi^2 (maj^2 k1^2 + min^2 k2^2) / 4 ln 2), k1 and k2 the spacing along and across the major axis (pa east of
// north), so that the image is the sky (times the primary beam) convolved with the Gaussian, in flux per beam
function smoothed(V, beam, n, du) {
  const W = new Float64Array(n * n), sp = Math.sin(beam.pa * DEG), cp = Math.cos(beam.pa * DEG), c = Math.PI * Math.PI / (4 * Math.LN2);
  for (let q = 0; q < n; q++) for (let p = 0; p < n; p++) {
    const u = (p >= n / 2 ? p - n : p) * du, v = (q >= n / 2 ? q - n : q) * du, k1 = u * sp + v * cp, k2 = u * cp - v * sp;
    W[q * n + p] = Math.exp(-c * (beam.maj * beam.maj * k1 * k1 + beam.min * beam.min * k2 * k2));
  }
  return dirty(W, V, n).img;
}
// The visibilities of the point skies on an n x n grid of cells du wide, exactly (a point between pixels shared among
// them would lose amplitude at long spacings): a point at the center, V = A(0); two points at l = +-size / 2,
// V = A(size / 2) cos(pi u size); A the Gaussian primary beam of FWHM pb (0 for none). Null for the other models.
function pointVis(model, size, n, du, pb) {
  if (model !== "point" && model !== "double") return null;
  const A0 = beamFn(pb), A = l => A0(l, 0), re = new Float64Array(n * n), im = new Float64Array(n * n);
  for (let q = 0; q < n; q++) for (let p = 0; p < n; p++) {
    const u = (p >= n / 2 ? p - n : p) * du;
    re[q * n + p] = model === "point" ? A(0) : A(size / 2) * Math.cos(Math.PI * u * size);
  }
  return { re, im };
}
// the forward transform of a real image (wrapped, origin at index 0): its visibilities on the grid
function visibilities(s, n) {
  const re = Float64Array.from(s), im = new Float64Array(n * n);
  TP.fft2(re, im, n);
  return { re, im };
}

// The primary beam's power at (l, m) (radians east and north of the pointing): a circular Gaussian of FWHM pb, or
// pb = { ew, ns }, an elliptical one (a cylinder's beam, narrow east-west and wide north-south); none for 0
function beamFn(pb) {
  if (pb && typeof pb === "object") { const a = 4 * Math.LN2 / (pb.ew * pb.ew), b = 4 * Math.LN2 / (pb.ns * pb.ns); return (l, m) => Math.exp(-a * l * l - b * m * m); }
  return pb > 0 ? (l, m) => Math.exp(-4 * Math.LN2 * (l * l + m * m) / (pb * pb)) : () => 1;
}
// ------------------------------------------------------------------ the sky
// Sky models, all centered on the phase center and of total flux 1: a point; a double (two halves of the flux size
// apart, east-west); a circular Gaussian of FWHM size; a uniform disc of diameter size; a ring (a thin annulus,
// RING_IN to 1 of the radius) of diameter size.
const RING_IN = 0.9;
// The model on a wrapped n x n grid of pixels pix (radians) wide, each pixel's flux (sub-sampled over the pixel),
// times a Gaussian primary beam of FWHM pb (radians; 0 for none).
// An image model: img = { w, h, v, scale } (brightness v * scale, row 0 at the top = north, column 0 at the left =
// east; scale 1 when absent), size = the
// image's width (radians), centered; each grid pixel takes the image's mean over the pixel (sub-sampled
// bilinearly), so the flux follows the brightness times the area.
function skyImage(model, size, n, pix, pb, img) {
  const s = new Float64Array(n * n), h = n / 2;
  const put = (i, j, f) => { if (i <= -h || i >= h || j <= -h || j >= h) return; s[((j + n) % n) * n + ((i + n) % n)] += f; };
  const A = beamFn(pb);
  if (model === "crescent" || model === "m87" || model === "corejet" || model === "points") return skyModel2(model, size, n, pix, A, put, s);
  if (model === "image") {
    if (!img) return s;
    const ip = size / img.w, hw = img.w * ip / 2, hh = img.h * ip / 2, sc = img.scale || 1;
    const at = (l, m) => {
      const x = (hw - l) / ip - 0.5, y = (hh - m) / ip - 0.5, i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
      const v = (a, b) => (a < 0 || b < 0 || a >= img.w || b >= img.h ? 0 : img.v[b * img.w + a] * sc);
      return v(i, j) * (1 - fx) * (1 - fy) + v(i + 1, j) * fx * (1 - fy) + v(i, j + 1) * (1 - fx) * fy + v(i + 1, j + 1) * fx * fy;
    };
    const Ki = Math.min(h - 1, Math.ceil(hw / pix) + 1), Kj = Math.min(h - 1, Math.ceil(hh / pix) + 1), sub = Math.max(1, Math.min(6, Math.ceil(pix / ip)));
    let tot = 0;
    const vals = [];
    for (let j = -Kj; j <= Kj; j++) for (let i = -Ki; i <= Ki; i++) {
      let a = 0;
      for (let b = 0; b < sub; b++) for (let c = 0; c < sub; c++) a += at((i + (c + 0.5) / sub - 0.5) * pix, (j + (b + 0.5) / sub - 0.5) * pix);
      if (a > 0) { vals.push([i, j, a]); tot += a; }
    }
    if (tot > 0) for (const [i, j, a] of vals) put(i, j, a / tot * A(i * pix, j * pix));
    return s;
  }
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
// The models made for the Earth-scale and transit arrays, each of total flux 1 (before the primary beam):
// - crescent (the EHT's M87*): the EHT Collaboration's synthetic crescent (2019 Paper IV, Appendix C.1): a thin ring
//   of diameter size with the brightness 1 + 2A cos(phi - pa) around the ring (A = 0.23, brightest at position angle
//   pa = 150 degrees east of north), convolved with a circular Gaussian of FWHM 10 uas on the 44 uas ring
//   (CRESCENT.blur x size). The convolution in closed form: with sigma the Gaussian's width and z = r r0 / sigma^2,
//   I(r, phi) ~ exp(-(r - r0)^2 / 2 sigma^2) [I0e(z) + 2A cos(phi - pa) I1e(z)] (I0e, I1e the scaled modified Bessel
//   functions e^-z I_n(z)); its visibility is crescentVis;
// - m87 (M87* with its jet): the EHT Collaboration's synthetic M87 (2019 Paper IV): the crescent above with
//   I0 = 0.55 Jy (Appendix C.1) and the large-scale jet, three elliptical Gaussians of 0.6 Jy in all (Table 10:
//   flux, FWHM major x minor, the major axis's position angle, offset east and north), the whole scaled by size / 44
//   uas; each part normalized by its own flux, so that the parts of the jet beyond the grid are dropped and the rest
//   keeps its true share (the jet is resolved out on every baseline between sites; its visibility is m87Vis);
// - corejet (a VLBI quasar, illustrative): a compact core (FWHM 0.06 size, a quarter of the flux) and a jet of six
//   fading Gaussian knots out to size along position angle JET_PA;
// - points (a transit array's field): POINTS_N point sources, seeded, scattered over a disc of diameter size, with a
//   power-law spread of flux (N(>S) ~ S^-1.5, the faintest a hundredth of the brightest).
const CRESCENT = { blur: 10 / 44, A: 0.23, pa: 150 }, JET_PA = 290, POINTS_N = 60;
const M87 = { d: 44, ring: 0.55, jet: [[0.3, 1000, 600, 140, -688.77, 80.86], [0.2, 400, 200, 93, -295.44, -52.09], [0.1, 400, 200, 115, -215.80, 208.40]] };
M87.total = M87.ring + M87.jet.reduce((a, c) => a + c[0], 0);
// the jet's components at a crescent of diameter size (radians): [flux fraction, sigma major, sigma minor, sin pa,
// cos pa, l, m] (radians east and north)
const m87Jet = size => { const k = size / M87.d; return M87.jet.map(([f, a, b, pa, dl, dm]) => [f / M87.total, a * k / 2.3548, b * k / 2.3548, Math.sin(pa * DEG), Math.cos(pa * DEG), dl * k, dm * k]); };
// the core-jet's components, [distance along the jet / size, FWHM / size, flux]: the core a quarter of the flux, the
// knots the rest, each 0.75 of the one before and wider, so that the jet's surface brightness fades along the jet from
// about the core's (an illustration, not a particular quasar)
const KNOTS = [[0, 0.06, 0.25]].concat([0.15, 0.3, 0.45, 0.6, 0.78, 1].map((d, k) => [d, 0.05 + 0.02 * k, 0.75 * Math.pow(0.75, k) * 0.25 / (1 - Math.pow(0.75, 6))]));
function skyModel2(model, size, n, pix, A, put, s) {
  const h = n / 2, vals = [];
  let tot = 0;
  const add = (l, m, f) => { const x = l / pix, y = m / pix, i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;   // bilinear
    vals.push([i, j, f * (1 - fx) * (1 - fy), l, m], [i + 1, j, f * fx * (1 - fy), l, m], [i, j + 1, f * (1 - fx) * fy, l, m], [i + 1, j + 1, f * fx * fy, l, m]); tot += f; };
  // a smooth brightness b(l, m) summed over the pixels within reach K, sub-sampled
  const smooth = (b, reach, sub) => {
    const K = Math.min(h - 1, Math.ceil(reach / pix) + 1);
    for (let j = -K; j <= K; j++) for (let i = -K; i <= K; i++) {
      let a = 0;
      for (let q = 0; q < sub; q++) for (let c = 0; c < sub; c++) a += b((i + (c + 0.5) / sub - 0.5) * pix, (j + (q + 0.5) / sub - 0.5) * pix);
      if (a > 0) { vals.push([i, j, a, i * pix, j * pix]); tot += a; }
    }
  };
  if (model === "crescent" || model === "m87") {
    const r0 = size / 2, sg = CRESCENT.blur * size / 2.3548, pa = CRESCENT.pa * DEG;
    smooth((l, m) => { const r = Math.hypot(l, m), ph = Math.atan2(l, m), z = r * r0 / (sg * sg); return Math.exp(-(r - r0) * (r - r0) / (2 * sg * sg)) * (Ine(0, z) + 2 * CRESCENT.A * Math.cos(ph - pa) * Ine(1, z)); }, r0 + 5 * sg, size / pix < 8 ? 6 : 3);
    if (model === "m87" && tot > 0) {
      // the crescent at its share of the flux, then the jet's Gaussians from their profiles (flux per pixel), each
      // over the pixels within 5 sigma of its center that lie on the grid
      for (const q of vals) q[2] *= M87.ring / M87.total / tot;
      for (const [f, sa, sb, sp, cp, l0, m0] of m87Jet(size)) {
        const pk = f * pix * pix / (2 * Math.PI * sa * sb), R = 5 * sa;
        const i0 = Math.max(1 - h, Math.floor((l0 - R) / pix)), i1 = Math.min(h - 1, Math.ceil((l0 + R) / pix));
        const j0 = Math.max(1 - h, Math.floor((m0 - R) / pix)), j1 = Math.min(h - 1, Math.ceil((m0 + R) / pix));
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
          const dl = i * pix - l0, dm = j * pix - m0, x = dl * sp + dm * cp, y = dl * cp - dm * sp;
          const a = pk * Math.exp(-0.5 * (x * x / (sa * sa) + y * y / (sb * sb)));
          if (a > 0) vals.push([i, j, a, i * pix, j * pix]);
        }
      }
      tot = 1;
    }
  } else if (model === "corejet") {
    const pa = JET_PA * DEG, el = Math.sin(pa), em = Math.cos(pa), g = (l, m, l0, m0, fw) => Math.exp(-4 * Math.LN2 * ((l - l0) * (l - l0) + (m - m0) * (m - m0)) / (fw * fw));
    const knots = KNOTS;
    smooth((l, m) => knots.reduce((a, [d, fw, f]) => a + f / (fw * fw) * g(l, m, d * size * el, d * size * em, fw * size), 0), 1.3 * size, size / pix < 8 ? 6 : 2);
  } else for (const [l, m, f] of pointsList(size)) add(l, m, f);
  if (!(tot > 0)) { put(0, 0, A(0, 0)); return s; }
  for (const [i, j, a, l, m] of vals) put(i, j, a / tot * A(l, m));
  return s;
}
// the point sources of the points model: [l, m, flux] (radians east and north; the brightest 100, the faintest 1)
function pointsList(size) {
  const rnd = rng(29), out = [];
  for (let k = 0; k < POINTS_N; k++) {
    // (fluxes from 1 to 100: u uniform, S = (1 - 0.999 u)^(-1/1.5) spans 1 to 0.001^(-1/1.5) = 100; with 0.99 the draw
    // stopped at 21.5, audit X, 2026-11-16)
    const r = size / 2 * Math.sqrt(rnd()), ph = 2 * Math.PI * rnd(), f = Math.min(100, Math.pow(1 - rnd() * 0.999, -1 / 1.5));
    out.push([r * Math.sin(ph), r * Math.cos(ph), f]);
  }
  return out;
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
// J0 the same way, J0(x) = (1 / 2 pi) int cos(x sin t) dt
const J0T = (() => {
  const M = 96, t = new Float64Array(3001);
  for (let k = 0; k <= 3000; k++) { const x = k / 100; let a = 0; for (let q = 0; q < M; q++) a += Math.cos(x * Math.sin(2 * Math.PI * q / M)); t[k] = a / M; }
  return t;
})();
function J0(x) {
  const ax = Math.abs(x);
  if (ax < 30) { const u = ax * 100, k = Math.floor(u), f = u - k; return J0T[k] + (J0T[Math.min(3000, k + 1)] - J0T[k]) * f; }
  const w = ax - 0.25 * Math.PI;
  return Math.sqrt(2 / (Math.PI * ax)) * (Math.cos(w) + 1 / (8 * ax) * Math.sin(w));
}
// the scaled modified Bessel functions e^-z I_n(z), n = 0, 1, z >= 0: by the integral (1 / pi) int_0^pi e^(z (cos t -
// 1)) cos(n t) dt (the trapezoid rule, exact to rounding for a periodic integrand this smooth), tabulated to z = 60
// when first needed; beyond, the asymptotic series 1 / sqrt(2 pi z) (1 - (4n^2 - 1) / 8z - (4n^2 - 1)(4n^2 - 9) / 2(8z)^2)
let INE = null;
function Ine(n, z) {
  if (z >= 60) { const m = 4 * n * n, y = 8 * z; return (1 - (m - 1) / y + (m - 1) * (m - 9) / (2 * y * y)) / Math.sqrt(2 * Math.PI * z); }
  if (!INE) {
    INE = [new Float64Array(12001), new Float64Array(12001)];
    const M = 400;
    for (let k = 0; k <= 12000; k++) {
      const zz = k / 200; let a0 = 0, a1 = 0;
      for (let q = 0; q <= M; q++) { const t = Math.PI * q / M, e = Math.exp(zz * (Math.cos(t) - 1)) * (q === 0 || q === M ? 0.5 : 1); a0 += e; a1 += e * Math.cos(t); }
      INE[0][k] = a0 / M; INE[1][k] = a1 / M;
    }
  }
  const u = z * 200, k = Math.floor(u), f = u - k, T = INE[n];
  return T[k] + (T[Math.min(12000, k + 1)] - T[k]) * f;
}
// The visibilities of the crescent, the core-jet and the point sources at (u, v) wavelengths (total flux 1, without
// the primary beam), as { re, im }: the crescent's in closed form, exp(-2 pi^2 sigma^2 q^2) [J0(2 pi q r0) - 2iA
// cos(phi_uv - pa) J1(2 pi q r0)]; the core-jet's and the points' as the sums of their components
function crescentVis(size, u, v) {
  const r0 = size / 2, sg = CRESCENT.blur * size / 2.3548, q = Math.hypot(u, v), x = 2 * Math.PI * q * r0, t = Math.exp(-2 * Math.PI * Math.PI * sg * sg * q * q);
  const c = q > 0 ? Math.cos(Math.atan2(u, v) - CRESCENT.pa * DEG) : 0;
  return { re: t * J0(x), im: -2 * CRESCENT.A * c * t * J1(x) };
}
// M87* with its jet: the crescent's share times crescentVis plus the jet's Gaussians, each exp(-2 pi^2 (sigma_maj^2
// k1^2 + sigma_min^2 k2^2)) at its offset (k1, k2 the spacing along and across the major axis)
function m87Vis(size, u, v) {
  const c = crescentVis(size, u, v), w = M87.ring / M87.total;
  let re = w * c.re, im = w * c.im;
  for (const [f, sa, sb, sp, cp, l, m] of m87Jet(size)) {
    const k1 = u * sp + v * cp, k2 = u * cp - v * sp, a = f * Math.exp(-2 * Math.PI * Math.PI * (sa * sa * k1 * k1 + sb * sb * k2 * k2)), ph = -2 * Math.PI * (u * l + v * m);
    re += a * Math.cos(ph); im += a * Math.sin(ph);
  }
  return { re, im };
}
let PCACHE = { size: NaN };
function compVis(model, size, u, v) {
  let comps;
  if (model === "corejet") { const el = Math.sin(JET_PA * DEG), em = Math.cos(JET_PA * DEG); comps = KNOTS.map(([d, fw, f]) => [d * size * el, d * size * em, f, fw * size]); }
  else { if (PCACHE.size !== size) PCACHE = { size, c: pointsList(size).map(([l, m, f]) => [l, m, f, 0]) }; comps = PCACHE.c; }
  let re = 0, im = 0, tot = 0;
  for (const [l, m, f, fw] of comps) { const a = f * (fw ? Math.exp(-Math.PI * Math.PI * fw * fw * (u * u + v * v) / (4 * Math.LN2)) : 1), ph = -2 * Math.PI * (u * l + v * m); re += a * Math.cos(ph); im += a * Math.sin(ph); tot += f; }
  return { re: re / tot, im: im / tot };
}
// the model's visibility at (u, v) wavelengths, without the primary beam: real for the symmetric models; the size
// |V| for the crescent, the core-jet and the point sources
function vis(model, size, u, v) {
  if (model === "crescent" || model === "m87" || model === "corejet" || model === "points") { const V = model === "crescent" ? crescentVis(size, u, v) : model === "m87" ? m87Vis(size, u, v) : compVis(model, size, u, v); return Math.hypot(V.re, V.im); }
  const q = Math.hypot(u, v);
  if (model === "point") return 1;
  if (model === "double") return Math.cos(Math.PI * u * size);
  if (model === "gaussian") return Math.exp(-Math.PI * Math.PI * size * size * q * q / (4 * Math.LN2));
  if (model === "disc") return Lam(Math.PI * size * q);
  const r2 = size / 2, r1 = RING_IN * r2;
  return (r2 * r2 * Lam(2 * Math.PI * q * r2) - r1 * r1 * Lam(2 * Math.PI * q * r1)) / (r2 * r2 - r1 * r1);
}

// An image's pyramid: each level the one before averaged 2 x 2 (kept as 16-bit, scaled), down to 256 pixels across;
// level 0 is the image itself ({ w, h, v, scale }). The page images the sky from the level whose pixels are just
// below half the grid's, so that the sampling in skyImage averages the image over each grid pixel.
function pyramid(img0) {
  const L = [img0];
  while (L[L.length - 1].w > 256 && L[L.length - 1].h > 256) {
    const a = L[L.length - 1], w = Math.floor(a.w / 2), h = Math.floor(a.h / 2), v = new Uint16Array(w * h), f = (a.scale || 1) / 4 * 65535;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = 2 * y * a.w + 2 * x;
      v[y * w + x] = Math.min(65535, Math.round((a.v[k] + a.v[k + 1] + a.v[k + a.w] + a.v[k + a.w + 1]) * f));
    }
    L.push({ w, h, v, scale: 1 / 65535, factor: (a.factor || 1) * 2 });
  }
  return L;
}
// the level for a grid pixel pix, an image of width size (same units)
function level(L, size, pix) {
  let best = L[0];
  for (const q of L) if (size / q.w <= pix / 2) best = q;
  return best;
}

// ------------------------------------------------------------------ the beam's size and sidelobes
const cen = (k, n) => { const i = k % n, j = Math.floor(k / n); return [i >= n / 2 ? i - n : i, j >= n / 2 ? j - n : j]; };
// the pixels connected to the center with b above lo (4-neighbors on the wrapped grid); null if they reach the edge.
// With down set, each step goes downhill only (b no higher than the pixel it comes from): the main lobe's own slope,
// which stops at the saddle between the main lobe and a sidelobe above lo (a sparse array's, the EHT's)
function lobe(b, n, lo, down) {
  const seen = new Uint8Array(n * n), out = [0], h = n / 2;
  seen[0] = 1;
  for (let q = 0; q < out.length; q++) {
    const [i, j] = cen(out[q], n);
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = i + di, c = j + dj;
      if (a <= -h || a >= h - 1 || c <= -h || c >= h - 1) return null;
      const k = ((c + n) % n) * n + ((a + n) % n);
      if (!seen[k] && b[k] > lo && (!down || b[k] <= b[out[q]])) { seen[k] = 1; out.push(k); }
    }
  }
  return { list: out, mask: seen };
}
// The fitted beam: an elliptical Gaussian through the main lobe's pixels above half the peak (reached downhill from
// the peak), by least squares on ln b = -(a x^2 + 2 c x y + d y^2). FWHMs in radians, the major axis's position angle
// in degrees east of north.
function fitBeam(b, n, pix) {
  const L = lobe(b, n, 0.5, true);
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
// the shapes L, T, Y and a cross (one antenna at the junction, the rest along the arms), or a ring. The
// concentration p places the n-th of m antennas out along an arm at (n / m)^p of the arm's length (1 = even
// spacing; the VLA's arms follow p = 1.716), and does the same to the line's and the grid's coordinates from the
// center; a random layout's radii go as u^(p / 2) of the disc's (u uniform: 1 = uniform over the area). Antennas
// closer than DISH_GAP dishes are pushed apart: outward along an arm, a line or a grid axis; a layout still too
// crowded (a ring) is spread out as a whole.
const LAYOUTS = ["random", "grid", "line", "L", "T", "Y", "cross", "ring"], DISH_GAP = 1.2;
// a seeded random number generator (mulberry32), so that a random layout comes back the same from a link
function rng(seed) {
  let a = (seed >>> 0) || 1;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// coordinates t in [-1, 1] (sorted) warped to half * sign(t) |t|^p, then pushed apart from the middle outward to at
// least gap
function axis(ts, half, p, gap) {
  const x = ts.map(t => half * Math.sign(t) * Math.pow(Math.abs(t), p));
  let mid = 0; x.forEach((v, i) => { if (Math.abs(v) < Math.abs(x[mid])) mid = i; });
  for (let i = mid + 1; i < x.length; i++) x[i] = Math.max(x[i], x[i - 1] + gap);
  for (let i = mid - 1; i >= 0; i--) x[i] = Math.min(x[i], x[i + 1] - gap);
  return x;
}
function layout(kind, N, size, dish, seed = 1, p = 1) {
  const P = [], gap = DISH_GAP * dish;
  // arms: [azimuth (degrees east of north), length (m)]
  const arms = list => {
    P.push([0, 0]);
    const m = list.map(() => 0);
    for (let k = 0; k < N - 1; k++) m[k % list.length]++;
    list.forEach(([az, len], j) => {
      let r0 = 0;
      for (let k = 1; k <= m[j]; k++) { const r = Math.max(len * Math.pow(k / m[j], p), r0 + gap); P.push([r * Math.sin(az * DEG), r * Math.cos(az * DEG)]); r0 = r; }
    });
  };
  if (kind === "random") {
    // each antenna the best of up to 500 tries: the first clear of the others, else the one farthest from them
    // (the neighbors found through a hash of cells gap wide: only an antenna within the 3 x 3 cells can be too close)
    const R = size / 2, rnd = rng(seed), cells = new Map(), key = (i, j) => i * 1048576 + j;
    const near = (e, n) => {
      const ci = Math.floor(e / gap), cj = Math.floor(n / gap);
      let d = Infinity;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const q of cells.get(key(ci + a, cj + b)) || []) d = Math.min(d, Math.hypot(q[0] - e, q[1] - n));
      return d;
    };
    for (let k = 0; k < N; k++) {
      let best = null, bd = -1;
      for (let t = 0; t < 500; t++) {
        const r = R * Math.pow(rnd(), p / 2), th = 2 * Math.PI * rnd(), e = r * Math.cos(th), n = r * Math.sin(th), d = near(e, n);
        if (d > bd) { bd = d; best = [e, n]; }
        if (d >= gap) break;
      }
      P.push(best);
      const kk = key(Math.floor(best[0] / gap), Math.floor(best[1] / gap));
      if (!cells.has(kk)) cells.set(kk, []);
      cells.get(kk).push(best);
    }
  } else if (kind === "grid") {
    const k = Math.ceil(Math.sqrt(N)), rowsN = Math.ceil(N / k), h = (k - 1) / 2 || 1, half = size / (2 * Math.SQRT2);
    const xs = axis(Array.from({ length: k }, (_, j) => (j - (k - 1) / 2) / h), half, p, gap);
    const ys = axis(Array.from({ length: rowsN }, (_, j) => (j - (rowsN - 1) / 2) / h), half, p, gap);
    for (let i = 0; i < N; i++) P.push([xs[i % k], ys[Math.floor(i / k)]]);
  } else if (kind === "line") {
    const xs = axis(Array.from({ length: N }, (_, i) => (N > 1 ? 2 * i / (N - 1) - 1 : 0)), size / 2, p, gap);
    for (const x of xs) P.push([x, 0]);
  } else if (kind === "ring") for (let i = 0; i < N; i++) { const th = 2 * Math.PI * i / N; P.push([size / 2 * Math.sin(th), size / 2 * Math.cos(th)]); }
  else if (kind === "L") arms([[90, size / Math.SQRT2], [0, size / Math.SQRT2]]);
  else if (kind === "T") arms([[270, size / 2], [90, size / 2], [180, size / 2]]);
  else if (kind === "Y") arms([[0, size / Math.sqrt(3)], [120, size / Math.sqrt(3)], [240, size / Math.sqrt(3)]]);
  else if (kind === "cross") arms([[0, size / 2], [90, size / 2], [180, size / 2], [270, size / 2]]);
  const dmin = closest(P, gap);
  const f = dmin > 0 && dmin < gap * (1 - 1e-9) ? gap / dmin : 1;
  return P.map(q => [q[0] * f, q[1] * f, 0]);
}
// the closest pair's separation if under gap (else Infinity), through a hash of cells gap wide
function closest(P, gap) {
  const cells = new Map(), key = (i, j) => i * 1048576 + j;
  P.forEach((q, k) => { const kk = key(Math.floor(q[0] / gap), Math.floor(q[1] / gap)); if (!cells.has(kk)) cells.set(kk, []); cells.get(kk).push(k); });
  let d = Infinity;
  P.forEach((q, k) => {
    const ci = Math.floor(q[0] / gap), cj = Math.floor(q[1] / gap);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const m of cells.get(key(ci + a, cj + b)) || []) if (m > k) d = Math.min(d, Math.hypot(P[m][0] - q[0], P[m][1] - q[1]));
  });
  return d < gap ? d : Infinity;
}

// ------------------------------------------------------------------ scales
// the ground baselines' lengths (m), sorted
const lengths = (ants, lat, maxPairs) => baselines(ants, lat, maxPairs).len.sort();
// a percentile of a sorted list (linear between ranks)
function pctile(sorted, p) {
  if (!sorted.length) return NaN;
  const r = p / 100 * (sorted.length - 1), k = Math.floor(r), f = r - k;
  return sorted[k] + (sorted[Math.min(sorted.length - 1, k + 1)] - sorted[k]) * f;
}

const API = { J0, Ine, crescentVis, m87Vis, M87, shadowOf, compVis, smoothed, KNOTS, azimuth, staSees, CRESCENT, JET_PA, POINTS_N, pointsList, geoXYZ, hoursUpSta, beamFn, DEG, RAD, C, HA_PER_H, RING_IN, LAYOUTS, DISH_GAP, rng, layout, pyramid, level, aperture, apertureGrid, toXYZ, baselines, extremes, uvAt, elevation, hourAngles, hoursUp, sample, weigh, grid, dirty, visibilities, pointVis, skyImage, J1, Lam, vis, lobe, fitBeam, sidelobe, lengths, pctile };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.RI = API;
})(typeof window !== "undefined" ? window : globalThis);
