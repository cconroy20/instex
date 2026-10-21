// Physics checks for web/interf.js (the Interferometer mode):  node validate_int.js
// Relations: data/interf/formulas.md (TMS 3rd ed. Eqs. 4.1, 4.4, 4.5, A4.1; Briggs robust weighting in CASA's form).
// 1. Geometry: the local-to-equatorial turn, east-west baselines tracing ellipses of axis ratio sin(dec) (circles
//    of radius B / lambda at the pole), the elevation at transit, the baseline count N (N - 1) / 2.
// 2. The transforms: the dirty beam of two antennas is the fringe cos(2 pi u l) (spacing lambda / B), the beam is
//    real and symmetric, a point source's dirty image is the beam, a double's is the sum of two shifted beams.
// 3. The beam fit recovers a Gaussian's FWHMs and position angle; weighting limits (robust +5 = natural, -5 = uniform).
// 4. The sky models' visibilities: J1 against its series, the closed forms against the FFT of the models' images.
// 3b. A single dish: the filled aperture's beam is the Airy pattern (FWHM 1.029 lambda / D, first ring 1.75% of the
//     peak), an elliptical aperture's beam elliptical in the inverse ratio.
// 4a. Image skies: the flux kept, east and north the right way round, an image of a Gaussian matching the closed
//    form, the pyramid's levels averaging the image, the level chosen for a grid.
// 4b. Made-up layouts: the counts, the longest baselines of the shapes, the random layout's disc and seed, the
//    grid's redundant baselines, the spreading of a crowded layout.
// 5. The arrays (web/rpresets.js) against their records (data/interf/*.json): antenna counts, longest baselines vs
//    the published tables; the VLA's beam ratios (natural / uniform, snapshot / full) against the OSS notes, and
//    the OSS beam table as INFO lines (the uniform beam depends on the uv cell, which the OSS does not state); ALMA's
//    baseline statistics, largest scale and robust-0.5 beam against its Technical Handbook, sidelobes as INFO;
//    DSA-2000's baselines and zenith-snapshot beams against its sensitivity calculator, and the random draw of
//    baselines (beyond 100,000) against the full set.
"use strict";
const RI = require("./web/interf.js");

let nfail = 0, npass = 0;
function check(name, ok, detail) {
  ok ? npass++ : nfail++;
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail !== undefined ? "  --  " + detail : ""}`);
}
const rel = (a, b) => Math.abs(a / b - 1);
const DEG = RI.DEG, RAD = RI.RAD, C = RI.C;

// ---------------------------------------------------------------- 1. geometry
{
  const lat = 34 * DEG;
  const [X, Y, Z] = RI.toXYZ(1000, 0, 0, lat);
  check("an east-west baseline lies along Y at any latitude", Math.abs(X) < 1e-9 && Math.abs(Y - 1000) < 1e-9 && Math.abs(Z) < 1e-9);
  const [X2, , Z2] = RI.toXYZ(0, 1000, 0, 0);
  check("a north-south baseline on the equator lies along Z", Math.abs(X2) < 1e-9 && Math.abs(Z2 - 1000) < 1e-9);
  const [X3, , Z3] = RI.toXYZ(0, 0, 1000, 90 * DEG);
  check("a vertical baseline at the pole lies along Z", Math.abs(X3) < 1e-9 && Math.abs(Z3 - 1000) < 1e-9);
  const b = { X: 0, Y: 1000, Z: 0 };
  let rmin = 1e9, rmax = 0;
  for (let h = -12; h <= 12; h += 0.5) { const [u, v] = RI.uvAt(b, h * 15 * DEG, 90 * DEG); const r = Math.hypot(u, v); rmin = Math.min(rmin, r); rmax = Math.max(rmax, r); }
  check("an east-west baseline at the pole traces a circle of radius B", rmax - rmin < 1e-9 && Math.abs(rmax - 1000) < 1e-9, `${rmin} to ${rmax}`);
  for (const d of [10, 30, 60]) {
    let um = 0, vm = 0;
    for (let h = -12; h <= 12; h += 0.05) { const [u, v] = RI.uvAt(b, h * 15 * DEG, d * DEG); um = Math.max(um, Math.abs(u)); vm = Math.max(vm, Math.abs(v)); }
    check(`east-west baseline at dec ${d}: ellipse axis ratio sin(dec)`, rel(vm / um, Math.sin(d * DEG)) < 1e-4, (vm / um).toFixed(5) + " vs " + Math.sin(d * DEG).toFixed(5));
  }
  for (const [L, d] of [[34, 30], [34, -40], [-23, -60]]) {
    const el = RI.elevation(0, d * DEG, L * DEG) / DEG;
    check(`elevation at transit 90 - |lat - dec| (lat ${L}, dec ${d})`, Math.abs(el - (90 - Math.abs(L - d))) < 1e-9, el.toFixed(6));
  }
  check("a source that never rises is never up", RI.hoursUp(24, -70 * DEG, 34 * DEG, 0) === 0);
  check("a circumpolar source is up all 24 h", Math.abs(RI.hoursUp(24, 80 * DEG, 34 * DEG, 0) - 24) < 1e-9);
  check("the hour angle runs at the Earth's sidereal rate: 360° in 23.934 h of time (IERS 7.2921150e-5 rad/s)", Math.abs(2 * Math.PI / RI.HA_PER_H - 23.9345) < 1e-3, (2 * Math.PI / RI.HA_PER_H).toFixed(5) + " h");
  {
    // a source on the equator seen from the equator sets 6 sidereal hours after transit: 5.984 h of time
    let h = 0; while (RI.elevation((h + 1e-4) * RI.HA_PER_H, 0, 0) > 0) h += 1e-4;
    check("from the equator, an equatorial source sets 5.984 h (6 sidereal h) after transit", Math.abs(h - 5.9836) < 2e-3, h.toFixed(4) + " h");
  }
  // a baseline with a north-south part (Z != 0): TMS Eq. 4.5, the track is the ellipse u^2 + ((v - Z cos dec) / sin dec)^2
  // = X^2 + Y^2, centered at (0, Z cos dec) (data/interf/formulas.md G6)
  {
    const [Xb, Yb, Zb] = RI.toXYZ(300, 800, 5, 34 * DEG), d = 25 * DEG;
    let worst = 0;
    for (let h = -12; h <= 12; h += 0.25) { const [u, v] = RI.uvAt({ X: Xb, Y: Yb, Z: Zb }, h * 15 * DEG, d); worst = Math.max(worst, Math.abs(u * u + Math.pow((v - Zb * Math.cos(d)) / Math.sin(d), 2) - (Xb * Xb + Yb * Yb))); }
    check("a tilted baseline's track is TMS Eq. 4.5's ellipse about (0, Z cos dec)", worst < 1e-6 * (Xb * Xb + Yb * Yb), worst.toExponential(2));
    // a baseline pointing at the source projects to a point at the center (formulas.md G10)
    const L = 34 * DEG, H = 1.3, dd = 20 * DEG, sE = Math.sin(L) * Math.sin(dd) + Math.cos(L) * Math.cos(dd) * Math.cos(H), E = Math.asin(sE);
    const A = Math.atan2(-Math.cos(dd) * Math.sin(H), Math.cos(L) * Math.sin(dd) - Math.sin(L) * Math.cos(dd) * Math.cos(H));
    const [Xp, Yp, Zp] = RI.toXYZ(Math.cos(E) * Math.sin(A), Math.cos(E) * Math.cos(A), Math.sin(E), L), [up, vp] = RI.uvAt({ X: Xp, Y: Yp, Z: Zp }, H, dd);
    check("a baseline pointing at the source (TMS Eq. A4.1) projects to u = v = 0", Math.hypot(up, vp) < 1e-12, Math.hypot(up, vp).toExponential(2));
  }
  const ants = Array.from({ length: 12 }, (_, k) => ({ e: 100 * Math.cos(k), n: 100 * Math.sin(2 * k), u: 0 }));
  check("N antennas give N (N - 1) / 2 baselines", RI.baselines(ants, lat).length === 66);
  ants[3].on = false;
  check("an antenna switched off leaves (N - 1) (N - 2) / 2", RI.baselines(ants, lat).length === 55);
}

// ---------------------------------------------------------------- 2. transforms
{
  // two antennas 1 km apart east-west, a snapshot at transit, 1.5 GHz: the beam is cos(2 pi u l) with u = B / lambda
  const nu = 1.5e9, lam = C / nu, B = 1000;
  const ants = [{ e: 0, n: 0, u: 0 }, { e: B, n: 0, u: 0 }];
  const S = RI.sample({ ants, lat: 34 * DEG, dec: 30 * DEG, elMin: 0, dur: 0, nu, bw: 0 });
  check("a two-antenna snapshot: one sample", S.n === 1);
  const uB = B / lam, n = 256, pix = 1 / (8 * uB), du = 1 / (n * pix);
  const G = RI.grid(S, RI.weigh(S, "natural"), n, du), D = RI.dirty(G.g, null, n);
  const ug = Math.round(uB / du) * du;                             // the gridded u
  let err = 0;
  for (let i = -n / 2 + 1; i < n / 2; i++) err = Math.max(err, Math.abs(D.beam[(i + n) % n] - Math.cos(2 * Math.PI * ug * i * pix)));
  check("two antennas: the dirty beam is the fringe cos(2 pi u l)", err < 1e-6, err.toExponential(2));
  // the fringe's period, from the zero crossings (interpolated) on a grid of 10.3 pixels per fringe
  {
    const px = 1 / (10.3 * uB), Gp = RI.grid(S, RI.weigh(S, "natural"), n, 1 / (n * px)), Dp = RI.dirty(Gp.g, null, n), z = [];
    for (let i = 1; i < n / 2; i++) { const a = Dp.beam[i - 1], b = Dp.beam[i]; if (a > 0 !== b > 0) z.push(i - 1 + a / (a - b)); }
    const per = 2 * (z[z.length - 1] - z[0]) / (z.length - 1) * px;
    check("the fringe spacing is lambda / B (to the grid's rounding of u)", rel(per, lam / B) < 0.01, (per * RAD).toFixed(3) + "″ vs " + (lam / B * RAD).toFixed(3) + "″");
  }
  // a real array: symmetry b(-x, -y) = b(x, y)
  const ants2 = Array.from({ length: 9 }, (_, k) => ({ e: 300 * Math.cos(1.7 * k) + 40 * k, n: 250 * Math.sin(2.3 * k), u: 3 * k }));
  const S2 = RI.sample({ ants: ants2, lat: 34 * DEG, dec: 20 * DEG, elMin: 10 * DEG, dur: 6, nu, bw: 0, step: 0.1 });
  const um = 600 * 1.5 / lam, pix2 = 1 / (6 * um), du2 = 1 / (n * pix2);
  const G2 = RI.grid(S2, RI.weigh(S2, "natural"), n, du2), D2 = RI.dirty(G2.g, null, n);
  let asym = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) asym = Math.max(asym, Math.abs(D2.beam[j * n + i] - D2.beam[((n - j) % n) * n + (n - i) % n]));
  check("the dirty beam is symmetric, b(-l, -m) = b(l, m)", asym < 1e-9, asym.toExponential(2) + `, ${G2.drop} dropped`);
  // a point source's dirty image is the beam; a double's is the sum of two shifted half beams
  const pt = RI.visibilities(RI.skyImage("point", 0, n, pix2, 0), n), DP = RI.dirty(G2.g, pt, n);
  let e1 = 0; for (let k = 0; k < n * n; k++) e1 = Math.max(e1, Math.abs(DP.img[k] - DP.beam[k]));
  check("a point source's dirty image is the dirty beam", e1 < 1e-6, e1.toExponential(2));
  const sep = 20 * pix2, dbl = RI.visibilities(RI.skyImage("double", sep, n, pix2, 0), n), DD = RI.dirty(G2.g, dbl, n);
  let e2 = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const want = 0.5 * DD.beam[j * n + (i - 10 + n) % n] + 0.5 * DD.beam[j * n + (i + 10) % n];
    e2 = Math.max(e2, Math.abs(DD.img[j * n + i] - want));
  }
  check("a double's dirty image is the sum of two shifted half beams", e2 < 1e-6, e2.toExponential(2));
  // the primary beam: a point at the half-power radius comes through at half its flux
  const pb = 30 * pix2, s = RI.skyImage("double", 2 * 15 * pix2, n, pix2, pb);
  check("the primary beam halves a source at its half-power radius", Math.abs(s[15] - 0.25) < 1e-9 && Math.abs(s[n - 15] - 0.25) < 1e-9, s[15]);
}

// an asymmetric sky (one point east of the center, one north of it, one at the center): the dirty image's peaks fall
// where the sky's points are (east at l > 0, north at m > 0), so no axis is mirrored
{
  const n = 256, pix = 1e-6, W = 101, img = new Float32Array(W * W);
  img[50 * W + 50] = 1; img[50 * W + 30] = 1; img[15 * W + 50] = 1;        // the center; 20 columns left (east); 35 rows up (north)
  const ants = Array.from({ length: 24 }, (_, k) => ({ e: 900 * Math.cos(2.4 * k) * Math.sqrt(k / 24), n: 900 * Math.sin(2.4 * k) * Math.sqrt(k / 24), u: 0 }));
  const S = RI.sample({ ants, lat: 34 * DEG, dec: 60 * DEG, elMin: 0, dur: 10, nu: 30e9, bw: 0, step: 0.05 });
  const G = RI.grid(S, RI.weigh(S, "natural"), n, 1 / (n * pix)), sky = RI.skyImage("image", W * pix, n, pix, 0, { w: W, h: W, v: img });
  const D = RI.dirty(G.g, RI.visibilities(sky, n), n), at = (i, j) => D.img[((j + n) % n) * n + ((i + n) % n)];
  const east = at(20, 0), north = at(0, 35), west = at(-20, 0), south = at(0, -35);
  check("an asymmetric sky: the dirty image's peaks east (l > 0) and north (m > 0), where the sky's points are, and not mirrored", east > 0.8 * at(0, 0) && north > 0.8 * at(0, 0) && Math.abs(west) < 0.4 * east && Math.abs(south) < 0.4 * north, `E ${east.toFixed(3)} N ${north.toFixed(3)} W ${west.toFixed(3)} S ${south.toFixed(3)}`);
  // the point skies' exact visibilities against their images' FFT and the closed forms
  const pv = RI.pointVis("double", 30e-6, n, 1 / (n * pix), 0), du = 1 / (n * pix);
  let e2 = 0; for (const p of [3, 40, 90, -77]) e2 = Math.max(e2, Math.abs(pv.re[(p + n) % n] - Math.cos(Math.PI * p * du * 30e-6)));
  check("two points: the exact visibility cos(π u s) on the grid (no loss at long spacings)", e2 < 1e-12, e2.toExponential(2));
  // the random draw of baselines: distinct pairs
  const big = Array.from({ length: 600 }, (_, k) => ({ e: 5000 * Math.cos(2.4 * k) * Math.sqrt(k / 600), n: 5000 * Math.sin(2.4 * k) * Math.sqrt(k / 600), u: 0 }));
  const Bd = RI.baselines(big, 0.6, 50000), keys = new Set();
  for (let k = 0; k < Bd.length; k++) keys.add(Bd.X[k].toFixed(6) + "," + Bd.Y[k].toFixed(6));
  check("a random draw of 50,000 of 179,700 baselines: 50,000 distinct pairs", Bd.sub && Bd.length === 50000 && keys.size === 50000, keys.size);
  // the channels: the centers of equal slices of the band
  const Sc = RI.sample({ ants: [{ e: 0, n: 0 }, { e: 1000, n: 0 }], lat: 0.6, dec: 0.6, elMin: 0, dur: 0, nu: 1.5e9, bw: 1e9, nCh: 4 });
  check("four channels across 1.0-2.0 GHz at 1.125, 1.375, 1.625, 1.875 GHz", Sc.nus.map(x => x / 1e9).join(",") === "1.125,1.375,1.625,1.875", Sc.nus.join(","));
}

// ---------------------------------------------------------------- 3. beam fit and weighting
{
  const n = 256, pix = 1;
  for (const [fa, fb, pa] of [[12, 12, 0], [20, 10, 30], [16, 9, 120], [30, 14, 90]]) {
    const b = new Float32Array(n * n), t = pa * DEG, sa = fa / 2.3548, sb = fb / 2.3548;
    for (let k = 0; k < n * n; k++) {
      let i = k % n, j = Math.floor(k / n); if (i >= n / 2) i -= n; if (j >= n / 2) j -= n;
      const along = i * Math.sin(t) + j * Math.cos(t), across = i * Math.cos(t) - j * Math.sin(t);
      b[k] = Math.exp(-along * along / (2 * sa * sa) - across * across / (2 * sb * sb));
    }
    const f = RI.fitBeam(b, n, pix);
    const dpa = Math.min(Math.abs(f.pa - pa), 180 - Math.abs(f.pa - pa));
    check(`beam fit: ${fa} x ${fb} px at PA ${pa}`, rel(f.maj, fa * 2.3548 / 2.3548) < 0.01 && rel(f.min, fb) < 0.01 && (fa === fb || dpa < 0.5), `${f.maj.toFixed(3)} x ${f.min.toFixed(3)}, PA ${f.pa.toFixed(2)}`);
  }
  const ants = Array.from({ length: 10 }, (_, k) => ({ e: 200 * Math.cos(2.1 * k) * (1 + k / 3), n: 200 * Math.sin(2.1 * k) * (1 + k / 3), u: 0 }));
  const S = RI.sample({ ants, lat: 34 * DEG, dec: 50 * DEG, elMin: 0, dur: 8, nu: 5e9, bw: 0, step: 0.05 });
  const cell = 50;
  const wn = RI.weigh(S, "natural", 0, cell), wu = RI.weigh(S, "uniform", 0, cell), wp = RI.weigh(S, "robust", 5, cell), wm = RI.weigh(S, "robust", -5, cell);
  let a = 0, b2 = 0;
  const kp = wp[0], km = wm[0] / wu[0];
  for (let k = 0; k < S.n; k++) { a = Math.max(a, Math.abs(wp[k] / kp - wn[k])); b2 = Math.max(b2, Math.abs(wm[k] / km - wu[k]) / wu[k]); }
  check("robust +5 weights are natural (to 1e-3)", a < 1e-3, a.toExponential(2));
  check("robust -5 weights are uniform (to 1e-3)", b2 < 1e-3, b2.toExponential(2));
  // uniform: each occupied cell's weights (with the mirror points) sum to 1 (2 for the cells holding both a sample
  // and its own mirror: the origin)
  const sums = new Map();
  for (let k = 0; k < S.n; k++) { for (const s of [1, -1]) { const key = Math.round(s * S.u[k] / cell) + "," + Math.round(s * S.v[k] / cell); sums.set(key, (sums.get(key) || 0) + wu[k]); } }
  let worst = 0; for (const v of sums.values()) worst = Math.max(worst, Math.abs(v - 1));
  check("uniform weighting: each cell's weights sum to 1", worst < 1e-5, worst.toExponential(2));
}

// ---------------------------------------------------------------- 4. sky models
{
  const series = x => { let s = 0, t = x / 2; for (let k = 0; k < 60; k++) { s += t; t *= -(x / 2) * (x / 2) / ((k + 1) * (k + 2)); } return s; };
  let e = 0; for (const x of [0.1, 0.5, 1, 2, 3.8317, 5, 7.3, 10, 15, 22, 29.9]) e = Math.max(e, Math.abs(RI.J1(x) - series(x)));
  check("J1 against its power series (x to 30)", e < 2e-5, e.toExponential(2));
  // the first null of the disc's visibility, 2 J1(x) / x, at x = 3.8317 (the first zero of J1)
  let z = 0; for (let x = 3; x < 4.5; x += 1e-5) if (RI.J1(x) <= 0) { z = x; break; }
  check("J1's first zero at 3.8317", Math.abs(z - 3.8317) < 2e-4, z.toFixed(5));
  const as = 31.6, eta = Math.abs(RI.J1(as) - Math.sqrt(2 / (Math.PI * as)) * (Math.cos(as - 0.75 * Math.PI) - 3 / (8 * as) * Math.sin(as - 0.75 * Math.PI)));
  check("J1: the asymptotic form beyond 30 joins the series", Math.abs(RI.J1(30.0001) - series(30.0001)) < 2e-4, (RI.J1(30.0001) - series(30.0001)).toExponential(2));
  const n = 512, pix = 1e-6;
  for (const [model, size] of [["gaussian", 12e-6], ["disc", 40e-6], ["ring", 60e-6], ["double", 30e-6]]) {
    const V = RI.visibilities(RI.skyImage(model, size, n, pix, 0), n), du = 1 / (n * pix);
    let worst = 0;
    for (const [p, q] of [[3, 0], [0, 5], [7, 4], [12, -9], [20, 3], [-16, 16]]) {
      const k = ((q + n) % n) * n + (p + n) % n, want = RI.vis(model, size, p * du, q * du);
      worst = Math.max(worst, Math.abs(V.re[k] - want));
    }
    check(`${model}: the closed-form visibility matches the FFT of the model's image`, worst < 0.01, worst.toExponential(2));
  }
}

// ---------------------------------------------------------------- 3b. a single dish
{
  const nu = 1.4e9, lam = C / nu, D = 200, S = RI.aperture(D, D, nu), w = RI.weigh(S, "natural");
  const pix = lam / D / 12, n = 512, G = RI.apertureGrid(S.single, n, 1 / (n * pix)), Db = RI.dirty(G.g, null, n), f = RI.fitBeam(Db.beam, n, pix);
  // the first ring: the largest value beyond the first null along a cut
  let ring = 0, past = false; for (let i = 1; i < n / 2; i++) { const b = Db.beam[i]; if (b < 0.001) past = true; if (past) ring = Math.max(ring, b); if (past && i * pix > 3 * lam / D) break; }
  check("a filled circular aperture: the beam's FWHM is the Airy pattern's 1.029 λ / D (to 2%)", rel(f.maj, 1.029 * lam / D) < 0.02 && rel(f.min, 1.029 * lam / D) < 0.02, `${(f.maj / (lam / D)).toFixed(4)} λ / D`);
  let bmin = Infinity; for (const x of Db.beam) bmin = Math.min(bmin, x);
  check("a filled circular aperture: the first ring 1.75% of the peak, no negative sidelobes", Math.abs(ring - 0.0175) < 0.002 && bmin > -0.003, `${(100 * ring).toFixed(2)}%, min ${bmin.toExponential(1)}`);
  const E = RI.aperture(240, 160, nu), Ge = RI.apertureGrid(E.single, n, 1 / (n * pix)), De = RI.dirty(Ge.g, null, n), fe = RI.fitBeam(De.beam, n, pix);
  check("an elliptical aperture 240 x 160 m: the beam 1.5 times longer north-south, PA 0", rel(fe.maj / fe.min, 1.5) < 0.03 && Math.min(fe.pa, 180 - fe.pa) < 1, `${(fe.maj / fe.min).toFixed(3)}, PA ${fe.pa.toFixed(1)}`);
}

// ---------------------------------------------------------------- 4a. image skies
{
  const W = 200, Hh = 120, v = new Float32Array(W * Hh);
  // one bright pixel at the image's left (east) edge, halfway down, and one at the top (north) edge, in the middle
  v[60 * W + 0] = 1; v[0 * W + 100] = 1;
  const size = 200e-6, n = 512, pix = 1e-6, sI = RI.skyImage("image", size, n, pix, 0, { w: W, h: Hh, v });
  let tot = 0, ce = 0, cn = 0;
  for (let k = 0; k < n * n; k++) if (sI[k]) { tot += sI[k]; let i = k % n, j = Math.floor(k / n); if (i >= n / 2) i -= n; if (j >= n / 2) j -= n; if (i > 50) ce += sI[k]; if (j > 30) cn += sI[k]; }
  check("an image sky: the flux sums to 1; the left column lies east (l > 0), the top row north (m > 0)", Math.abs(tot - 1) < 1e-9 && Math.abs(ce - 0.5) < 1e-6 && Math.abs(cn - 0.5) < 1e-6, `${tot.toFixed(6)}, east ${ce.toFixed(3)}, north ${cn.toFixed(3)}`);
  // an image of a Gaussian (FWHM 20 image pixels) against the closed form
  const G = 256, gv = new Float32Array(G * G), fw = 20;
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) gv[y * G + x] = Math.exp(-4 * Math.LN2 * ((x - G / 2 + 0.5) ** 2 + (y - G / 2 + 0.5) ** 2) / (fw * fw));
  const gsz = 300e-6, Vg = RI.visibilities(RI.skyImage("image", gsz, 512, 1.3e-6, 0, { w: G, h: G, v: gv }), 512), du = 1 / (512 * 1.3e-6);
  let worst = 0;
  for (const [pp, qq] of [[2, 0], [0, 4], [5, 3], [9, -6]]) { const k = ((qq + 512) % 512) * 512 + (pp + 512) % 512; worst = Math.max(worst, Math.abs(Math.hypot(Vg.re[k], Vg.im[k]) - RI.vis("gaussian", fw * gsz / G, pp * du, qq * du))); }
  check("an image of a Gaussian: its visibility matches the closed form", worst < 0.01, worst.toExponential(2));
  // the pyramid: each level halves the image and keeps its mean brightness; the level for a grid pixel
  const u8 = new Uint8Array(1024 * 768); for (let k = 0; k < u8.length; k++) u8[k] = (k * 37) % 256;
  const L = RI.pyramid({ w: 1024, h: 768, v: u8, scale: 1 / 255 }), mean = q => { let a = 0; for (const x of q.v) a += x * q.scale; return a / q.v.length; };
  check("the pyramid: levels 1024, 512, 256 wide, each keeping the mean brightness", L.map(q => q.w).join(",") === "1024,512,256" && L.every(q => Math.abs(mean(q) - mean(L[0])) < 1e-4), L.map(q => q.w + ":" + mean(q).toFixed(5)).join(" "));
  check("the level for a grid: pixels just below half the grid's", RI.level(L, 1024, 0.5).w === 1024 && RI.level(L, 1024, 2).w === 1024 && RI.level(L, 1024, 4).w === 512 && RI.level(L, 1024, 100).w === 256);
}

// ---------------------------------------------------------------- 4b. made-up layouts
{
  const ok = [];
  for (const kind of RI.LAYOUTS) for (const N of [2, 27, 100]) if (RI.layout(kind, N, 5000, 25, 3).length !== N) ok.push(kind + " " + N);
  check("every layout holds the antennas asked for (2, 27, 100)", ok.length === 0, ok.join(", "));
  const span = P => { let m = 0; for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) m = Math.max(m, Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1])); return m; };
  for (const [kind, N] of [["line", 27], ["ring", 28], ["Y", 28], ["cross", 29], ["L", 27], ["T", 28]]) {
    const b = span(RI.layout(kind, N, 5000, 25));
    check(`${kind}: the longest baseline is the size (5 km)`, rel(b, 5000) < 1e-9, b.toFixed(3) + " m");
  }
  const R1 = RI.layout("random", 60, 4000, 25, 7), R2 = RI.layout("random", 60, 4000, 25, 7), R3 = RI.layout("random", 60, 4000, 25, 8);
  let rmax = 0, dmin = Infinity;
  for (let i = 0; i < R1.length; i++) { rmax = Math.max(rmax, Math.hypot(R1[i][0], R1[i][1])); for (let j = i + 1; j < R1.length; j++) dmin = Math.min(dmin, Math.hypot(R1[i][0] - R1[j][0], R1[i][1] - R1[j][1])); }
  check("random: inside the disc, no two dishes closer than 1.2 diameters", rmax <= 2000 + 1e-9 && dmin >= 1.2 * 25 - 1e-9, `r max ${rmax.toFixed(1)} m, closest ${dmin.toFixed(1)} m`);
  check("random: the same seed gives the same layout, another seed another", JSON.stringify(R1) === JSON.stringify(R2) && JSON.stringify(R1) !== JSON.stringify(R3));
  const G = RI.layout("grid", 36, 5000, 25), vec = new Set();
  for (let i = 0; i < 36; i++) for (let j = i + 1; j < 36; j++) { let de = G[j][0] - G[i][0], dn = G[j][1] - G[i][1]; if (dn < -1e-6 || (Math.abs(dn) < 1e-6 && de < 0)) { de = -de; dn = -dn; } vec.add(Math.round(de) + "," + Math.round(dn)); }
  check("a 6 x 6 grid: 630 baselines but only ((2 x 6 - 1)^2 - 1) / 2 = 60 different ones", vec.size === 60, vec.size);
  // concentration: the n-th of m antennas along an arm at (n / m)^p of the arm, the longest baseline unchanged
  {
    const P = RI.layout("Y", 28, 5000, 25, 1, 2), a = 5000 / Math.sqrt(3);
    const north = P.filter(q => Math.abs(q[0]) < 1e-6 && q[1] > 0).map(q => q[1]).sort((x, y) => x - y);
    let e = 0; north.forEach((r, k) => { e = Math.max(e, Math.abs(r - a * Math.pow((k + 1) / 9, 2))); });
    check("concentration 2: a Y's 9 antennas per arm at (n / 9)^2 of the arm, the longest baseline still the size", north.length === 9 && e < 1e-9 && rel(span(P), 5000) < 1e-9, `${e.toExponential(2)}, ${span(P).toFixed(1)} m`);
    const Pc = RI.layout("line", 40, 2000, 25, 1, 3);
    let gm = Infinity; for (let i = 1; i < Pc.length; i++) gm = Math.min(gm, Pc[i][0] - Pc[i - 1][0]);
    check("concentration 3 on a line: crowded antennas pushed apart to 1.2 dishes, the ends kept", Math.abs(gm - 30) < 1e-9 && Math.abs(Pc[0][0] + 1000) < 1e-9 && Math.abs(Pc[39][0] - 1000) < 1e-9, `closest ${gm.toFixed(2)} m`);
    const med = q => { const r = q.map(x => Math.hypot(x[0], x[1])).sort((x, y) => x - y); return r[Math.floor(r.length / 2)]; };
    const m1 = med(RI.layout("random", 400, 20000, 12, 4, 1)), m2 = med(RI.layout("random", 400, 20000, 12, 4, 2));
    check("random: uniform over the disc at 1 (median radius R / √2), crowded to the center at 2 (median R / 2)", rel(m1, 10000 / Math.SQRT2) < 0.08 && rel(m2, 5000) < 0.1, `${m1.toFixed(0)} m, ${m2.toFixed(0)} m`);
  }
  const crowd = RI.layout("grid", 49, 60, 25);
  let cm = Infinity; for (let i = 0; i < 49; i++) for (let j = i + 1; j < 49; j++) cm = Math.min(cm, Math.hypot(crowd[i][0] - crowd[j][0], crowd[i][1] - crowd[j][1]));
  check("a layout too crowded for its dishes is spread to 1.2 diameters", Math.abs(cm - 30) < 1e-9, cm.toFixed(3) + " m");
}

// ---------------------------------------------------------------- 5. the arrays
global.window = global.window || {};
require("./web/rpresets.js");
const ARRS = window.IX_ARRAYS;
const info = (name, detail) => console.log(`[INFO] ${name}  --  ${detail}`);
// the beam of a configuration, as the page measures it (30 s steps, the page's uv cell for uniform weighting)
function beamOf(a, cfg, nuG, wt, dec, dur, rob = 0.5) {
  const c = a.configs.find(q => q.id === cfg), ants = c.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), nu = nuG * 1e9;
  const S = RI.sample({ ants, lat: a.lat * DEG, dec: dec * DEG, elMin: a.elLimit * DEG, dur, nu, bw: 0, step: 1 / 120 });
  const ext = c.bmax * nu / C, w = RI.weigh(S, wt, rob, Math.max(ext / 250, 1.5 * RI.HA_PER_H * S.step * ext));
  for (let k = 0, pix = 0.05 / ext; k < 3; k++, pix *= 3) {
    const G = RI.grid(S, w, 512, 1 / (512 * pix)), D = RI.dirty(G.g, null, 512), f = RI.fitBeam(D.beam, 512, pix);
    if (f) return Math.sqrt(f.maj * f.min) * RAD;
  }
  return NaN;
}
{
  const a = ARRS.find(q => q.id === "vla"), j = require("./data/interf/vla.json");
  // the arms' power law, fitted to the pads (W and E arms, pads 2 to 72; pad 1 sits off the law): the tooltip's 1.716
  {
    const pads = {};
    for (const c of ["A", "B", "C", "D"]) for (const q of j.configs[c].antennas) pads[q.pad] = Math.hypot(q.e, q.n);
    for (const arm of ["W", "E"]) {
      const L = Object.entries(pads).map(([k, r]) => [k.match(new RegExp("^" + arm + "0*(\\d+)$")), r]).filter(q => q[0] && +q[0][1] >= 2).map(q => [Math.log(+q[0][1]), Math.log(q[1])]);
      const n = L.length, mx = L.reduce((a, q) => a + q[0], 0) / n, my = L.reduce((a, q) => a + q[1], 0) / n;
      let sxy = 0, sxx = 0; for (const [x, y] of L) { sxy += (x - mx) * (y - my); sxx += (x - mx) * (x - mx); }
      check(`VLA ${arm} arm: the pads follow r ∝ n^1.716 (fitted over ${n} pads)`, n === 23 && Math.abs(sxy / sxx - 1.716) < 0.003, (sxy / sxx).toFixed(4));
    }
  }
  // the lesson: a snapshot of 27 antennas on a Y the size of the C configuration, even and concentrated
  {
    const snap = P => { const ants = P.map(q => ({ e: q[0], n: q[1], u: 0 })), S = RI.sample({ ants, lat: a.lat * DEG, dec: 40 * DEG, elMin: 0, dur: 0, nu: 1.5e9, bw: 0 }), ext = 3387 * 1.5e9 / C, w = RI.weigh(S, "natural");
      for (let k = 0, pix = 0.05 / ext; k < 3; k++, pix *= 3) { const G = RI.grid(S, w, 512, 1 / (512 * pix)), D = RI.dirty(G.g, null, 512), f = RI.fitBeam(D.beam, 512, pix); if (f) return Math.abs(RI.sidelobe(D.beam, 512, 1.5 * f.maj / pix)); } };
    const ev = snap(RI.layout("Y", 27, 3387, 25, 1, 1)), cc = snap(RI.layout("Y", 27, 3387, 25, 1, 1.716));
    check("a Y snapshot: the VLA's concentration (1.716) lowers the peak sidelobe below even spacing's", cc < ev, `${(100 * cc).toFixed(0)}% vs ${(100 * ev).toFixed(0)}%`);
  }
  check("VLA: 27 antennas in each of A, B, C, D", a.configs.length === 4 && a.configs.every(c => c.ants.length === 27));
  for (const c of a.configs) {
    const L = RI.lengths(c.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), a.lat * DEG), oss = j.configs[c.id].published;
    const Bo = j.params.bmax_km.value[c.id] * 1000;
    check(`VLA ${c.id}: the longest baseline from the pads within 1% of the OSS's ${Bo / 1000} km`, rel(L[L.length - 1], Bo) < 0.01, (L[L.length - 1] / 1000).toFixed(3) + " km");
  }
  const L = a.bands.find(b => b.k === "L");
  check("VLA: the primary beam 42′ / ν(GHz) (OSS), so 28′ at 1.5 GHz", a.pb.arcminGHz === 42 && Math.abs(a.pb.arcminGHz / 1.5 - 28) < 1e-9 && L.lo === 1 && L.hi === 2);
  const un = beamOf(a, "C", 1.5, "uniform", 34, 12), na = beamOf(a, "C", 1.5, "natural", 34, 12), sn = beamOf(a, "C", 1.5, "uniform", 34, 0);
  check("VLA C, 1.5 GHz, 12 h near the zenith: natural / uniform beam near the OSS's ~1.5", na / un > 1.35 && na / un < 1.65, (na / un).toFixed(3));
  check("VLA C: snapshot / full-synthesis uniform beam near the OSS's ~1.3", sn / un > 1.15 && sn / un < 1.45, (sn / un).toFixed(3));
  const T = j.beam_table;
  for (const band of ["L", "C", "K"]) {
    const k = T.bands.indexOf(band), nuG = T.freq_GHz[k];
    info(`VLA ${band} (${nuG} GHz) uniform beam vs the OSS table (A, B, C, D)`, ["A", "B", "C", "D"].map((cf, i) => `${cf} ${beamOf(a, cf, nuG, "uniform", 34, 12).toPrecision(3)}″ vs ${T.values[band][i]}″`).join(", "));
  }
}

{
  const a = ARRS.find(q => q.id === "alma"), j = require("./data/interf/alma.json"), lam = C / 100e9;
  check(`ALMA: ten configurations of ${j.n_ant_cfg} antennas (Cycle ${j.cycle})`, a.configs.length === 10 && a.configs.every(c => c.ants.length === j.n_ant_cfg));
  check("ALMA: the primary beam 1.13 λ / D, 58″ at 100 GHz (Technical Handbook)", a.pb.k === 1.13 && Math.abs(1.13 * lam / 12 * RAD - 58) < 0.5, (1.13 * lam / 12 * RAD).toFixed(2) + "″");
  const bad = { max: [], l5: [], l80: [], mrs: [], beam: [] }, sl = [];
  for (const c of a.configs) {
    const ants = c.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), L = RI.lengths(ants, a.lat * DEG), T = j.th_table73.configs["C43-" + c.id.slice(2)];
    const L5 = RI.pctile(L, 5), L80 = RI.pctile(L, 80), mrs = j.mrs_table.rows[c.id].theta_mrs_arcsec[2];
    if (rel(L[L.length - 1], T.max) > 1e-3) bad.max.push(c.id);
    if (rel(L5, T.l05) > 0.02) bad.l5.push(`${c.id} ${L5.toFixed(1)}/${T.l05}`);
    if (rel(L80, T.l80) > 0.01) bad.l80.push(`${c.id} ${L80.toFixed(1)}/${T.l80}`);
    if (rel(0.983 * lam / L5 * RAD, mrs) > 0.03) bad.mrs.push(`${c.id} ${(0.983 * lam / L5 * RAD).toFixed(2)}/${mrs}`);
    const b = beamOf(a, c.id, 100, "robust", -23, 1), want = 0.574 * lam / T.l80 * RAD;
    if (rel(b, want) > 0.08) bad.beam.push(`${c.id} ${b.toFixed(3)}/${want.toFixed(3)}`);
  }
  check("ALMA: the longest baselines from the pads match the Handbook's Table 7.3 (0.1%)", bad.max.length === 0, bad.max.join(", "));
  check("ALMA: the 5th-percentile baselines within 2% of Table 7.3", bad.l5.length === 0, bad.l5.join(", "));
  check("ALMA: the 80th-percentile baselines within 1% of Table 7.3", bad.l80.length === 0, bad.l80.join(", "));
  check("ALMA: 0.983 λ / L5 within 3% of the Handbook's maximum recoverable scales at 100 GHz", bad.mrs.length === 0, bad.mrs.join(", "));
  check("ALMA: the robust-0.5 beam (1 h at dec −23°, 100 GHz) within 8% of the Handbook's 0.574 λ / L80", bad.beam.length === 0, bad.beam.join(", "));
  info("ALMA: the Cycle 13 resolution table describes the 50-antenna configurations", "its beams are 12-24% wider than 0.574 λ / L80 for C-2 to C-10 (the record's Conflicts); the pads here are the 43-antenna sets");
}

{
  const a = ARRS.find(q => q.id === "dsa2000"), j = require("./data/interf/dsa2000.json"), P = j.configs.FDR.published;
  const ants = a.configs[0].ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), ex = RI.extremes(ants);
  check(`DSA-2000: ${j.n_antennas} dishes of ${j.dish_m} m; baselines ${P.bmin_m} m to ${P.bmax_m / 1000} km (the calculator)`, ants.length === 1650 && Math.abs(ex.bmin - P.bmin_m) < 0.05 && rel(ex.bmax, P.bmax_m) < 0.001, `${ex.bmin.toFixed(2)} m to ${(ex.bmax / 1000).toFixed(3)} km`);
  const snap = (wt, maxP) => {
    const nu = P.beam_freq_GHz * 1e9, B = RI.baselines(ants, a.lat * DEG, maxP), S = RI.sample({ ants, lat: a.lat * DEG, dec: a.lat * DEG, elMin: 0, dur: 0, nu, bw: 0, B });
    const ext = ex.bmax * nu / C, w = RI.weigh(S, wt, 0, ext / 250 * (B.sub ? Math.sqrt(B.total / B.length) : 1));
    for (let k = 0, pix = 0.05 / ext; k < 3; k++, pix *= 3) { const G = RI.grid(S, w, 512, 1 / (512 * pix)), D = RI.dirty(G.g, null, 512), f = RI.fitBeam(D.beam, 512, pix); if (f) return f; }
  };
  const nat = snap("natural", 1e5), uniD = snap("uniform", 1e5), uniA = snap("uniform", Infinity);
  check(`DSA-2000: the natural zenith snapshot beam at ${P.beam_freq_GHz} GHz within 3% of the calculator's ${P.beam_natural_arcsec.join(" x ")}″, PA ${P.beam_natural_pa_deg}°`, rel(nat.maj * RAD, P.beam_natural_arcsec[0]) < 0.03 && rel(nat.min * RAD, P.beam_natural_arcsec[1]) < 0.03 && Math.abs(nat.pa - P.beam_natural_pa_deg) < 2, `${(nat.maj * RAD).toFixed(3)} x ${(nat.min * RAD).toFixed(3)}″, PA ${nat.pa.toFixed(1)}°`);
  check("DSA-2000: the uniform beam from a 100,000-pair draw matches all 1,360,425 pairs (1%)", rel(uniD.maj, uniA.maj) < 0.01 && rel(uniD.min, uniA.min) < 0.01, `${(uniD.maj * RAD).toFixed(3)} x ${(uniD.min * RAD).toFixed(3)} vs ${(uniA.maj * RAD).toFixed(3)} x ${(uniA.min * RAD).toFixed(3)}″`);
  check(`DSA-2000: the uniform beam within 10% of the project's PSF ${P.beam_uniform_arcsec.join(" x ")}″ (the uv cell is not stated)`, rel(uniA.maj * RAD, P.beam_uniform_arcsec[0]) < 0.1 && rel(uniA.min * RAD, P.beam_uniform_arcsec[1]) < 0.1, `${(uniA.maj * RAD).toFixed(3)} x ${(uniA.min * RAD).toFixed(3)}″`);
}

{
  const a = ARRS.find(q => q.id === "arecibo"), j = require("./data/interf/arecibo.json");
  check(`Arecibo: a ${a.single.ew} x ${a.single.ns} m illuminated aperture of the ${a.dish} m dish; within ${a.zenLimit}° of the zenith, so declinations ${(a.lat - a.zenLimit).toFixed(2)}° to ${(a.lat + a.zenLimit).toFixed(2)}° (the guide's ${j.dec_range_deg.map(x => x.toFixed(2)).join(" to ")}°)`, Math.abs(a.lat - a.zenLimit - j.dec_range_deg[0]) < 0.05 && Math.abs(a.lat + a.zenLimit - j.dec_range_deg[1]) < 0.05);
  const bad = [];
  for (const b of j.beam.filter(q => ["327", "430", "lbw", "sbw", "sbn", "sbh", "cb", "xb"].includes(q.receiver))) {
    const nu = b.freq_GHz * 1e9, lam = C / nu, S = RI.aperture(a.single.ew, a.single.ns, nu), pix = lam / a.single.ew / 12, n = 512;
    const f = RI.fitBeam(RI.dirty(RI.apertureGrid(S.single, n, 1 / (n * pix)).g, null, n).beam, n, pix);
    const ew = f.pa > 45 && f.pa < 135 ? f.maj : f.min, ns = f.pa > 45 && f.pa < 135 ? f.min : f.maj;
    const ok = rel(ew * RAD / 60, b.fwhm_az_arcmin) < 0.12 && rel(ns * RAD / 60, b.fwhm_za_arcmin) < 0.12;
    if (!ok) bad.push(`${b.receiver}: ${(ew * RAD / 60).toFixed(2)} x ${(ns * RAD / 60).toFixed(2)}′ vs ${b.fwhm_az_arcmin} x ${b.fwhm_za_arcmin}′`);
    if (b.receiver === "lbw") info("Arecibo L-wide at 1.42 GHz, uniform illumination of the illuminated ellipse", `${(ew * RAD / 60).toFixed(2)}′ x ${(ns * RAD / 60).toFixed(2)}′ (east-west x north-south) vs the guide's ${b.fwhm_az_arcmin}′ x ${b.fwhm_za_arcmin}′`);
  }
  check("Arecibo: the uniformly lit aperture's beam within 12% of the guide's measured beam for each Gregorian receiver (azimuth = east-west, zenith angle = north-south on the meridian)", bad.length === 0, bad.join("; "));
}

console.log(`\n${npass} pass, ${nfail} fail`);
process.exit(nfail ? 1 : 0);
