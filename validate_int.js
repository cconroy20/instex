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
  {
    const jv = require("./data/interf/vla.json"), cC = ARRS.find(q => q.id === "vla").configs.find(q => q.id === "C"), exC = RI.extremes(cC.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })));
    check(`VLA C: an antenna on the central pad N1 (the OSS's note 5; moved from N10, the middle of the north arm, INFERRED), the shortest baseline ${jv.configs.C.with_N1_variant.bmin_m} m`, cC.names.includes("N01") && !cC.names.includes("N10") && Math.abs(exC.bmin - jv.configs.C.with_N1_variant.bmin_m) < 0.01, `${exC.bmin.toFixed(2)} m`);
    // shadowing against the Guide to Observing with the VLA (OGS): "to guarantee no more than a single shadowed
    // antenna, restrict the elevations ... to >40° for D-configuration and >25° for C-configuration"
    const mostShadowed = (cfg, elLo, elHi) => {
      const c = ARRS.find(q => q.id === "vla").configs.find(q => q.id === cfg), an = c.ants.map(p => ({ e: p[0], n: p[1], u: p[2] }));
      let mx = 0;
      for (let dec = -45; dec <= 90; dec += 1.5) { const f = RI.shadowOf(an, a.lat * DEG, dec * DEG, a.dish);
        for (let h = -12; h < 12; h += 0.025) { const H = h * 15 * DEG, el = RI.elevation(H, dec * DEG, a.lat * DEG) / DEG; if (el < elLo || el >= elHi) continue; let n = 0; for (const x of f(H)) n += x; mx = Math.max(mx, n); } }
      return mx;
    };
    const sD = [mostShadowed("D", 40, 90), mostShadowed("D", 30, 40)], sC = [mostShadowed("C", 25, 90), mostShadowed("C", 8, 25)];
    check("VLA shadowing (OGS): at most one antenna shadowed above 40° in D and above 25° in C, at any hour angle and declination; more below", sD[0] <= 1 && sC[0] <= 1 && sD[1] > 1 && sC[1] > 1, `D: ${sD[0]} above 40°, ${sD[1]} at 30–40°; C: ${sC[0]} above 25°, ${sC[1]} at 8–25°`);
  }
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
  check(`DSA-2000: tracks end ${j.tracking.max_abs_ha_h} h of hour angle either side of the transit (the calculator), carried to the page`, a.haMax === j.tracking.max_abs_ha_h && a.haMax === 2, a.haMax);
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

// ---------------------------------------------------------------- 5b. the Earth-scale and transit arrays
// stations as the page builds them: geodetic positions in the frame of the array's reference meridian, each with its
// hour-angle offset, own limit and horizon mask
function geoStations(a, elFloor = a.elLimit) {
  const c = a.configs[0];
  return c.ants.map((p, k) => ({ xyz: RI.geoXYZ(p[0] * DEG, p[1] * DEG, p[2], a.geo.lon0 * DEG), name: c.names[k], sefd: c.sefd ? c.sefd[k] : 0,
    sta: { lat: p[0] * DEG, dlon: (p[1] - a.geo.lon0) * DEG, elMin: Math.max(elFloor, c.elMin ? c.elMin[k] : 0) * DEG, mask: c.masks ? { az: c.masks[k].az.map(x => x * DEG), el: c.masks[k].el.map(x => x * DEG) } : null } }));
}
const chord3 = (P, i, j) => Math.hypot(P[i].xyz[0] - P[j].xyz[0], P[i].xyz[1] - P[j].xyz[1], P[i].xyz[2] - P[j].xyz[2]);
{
  const a = ARRS.find(q => q.id === "vlba"), j = require("./data/interf/vlba.json"), P = geoStations(a), ix = n => P.findIndex(q => q.name === n);
  check(`VLBA: ten stations; SC–MK ${(chord3(P, ix("SC"), ix("MK")) / 1e3).toFixed(1)} km and LA–PT ${(chord3(P, ix("LA"), ix("PT")) / 1e3).toFixed(1)} km from the WGS84 positions, within 0.1 km of the record's ${j.baselines.longest_km} and ${j.baselines.shortest_km} km (CASA's X, Y, Z)`,
    P.length === 10 && Math.abs(chord3(P, ix("SC"), ix("MK")) / 1e3 - j.baselines.longest_km) < 0.1 && Math.abs(chord3(P, ix("LA"), ix("PT")) / 1e3 - j.baselines.shortest_km) < 0.1);
  // NRAO's table of hours a day with at least N stations up, for southern declinations: the stations' horizon masks
  // and positions with a 3-degree floor (the record's reading of the table), over one sidereal day
  const T = j.declination_visibility, Ps = geoStations(a, 3), H = Array.from({ length: 2880 }, (_, k) => -Math.PI + 2 * Math.PI * (k + 0.5) / 2880);
  let ok = 0, n = 0, worst = 0;
  for (const d of Object.keys(T.hours)) {
    const up = H.map(h => Ps.filter(q => RI.staSees(q.sta, h, +d * DEG)).length);
    T.n_stations.forEach((N, i) => { const hrs = up.filter(c => c >= N).length / H.length * 24 / 1.0027379, e = Math.abs(hrs - T.hours[d][i]); n++; if (e <= 0.2) ok++; worst = Math.max(worst, e); });
  }
  check(`VLBA: the horizon masks reproduce NRAO's hours with at least N stations up (dec −20° to −50°, N = 4 to 10; NRAO's table counts a station up above 3° and its horizon, so the check tests the masks and positions, not the page's 10° limit) within 0.2 h in at least 44 of the ${n} cells (45 at the time of writing)`, ok >= 44, `${ok} of ${n}, worst ${worst.toFixed(1)} h`);
  check("VLBA: the 3 mm band at the eight stations with the receiver (not St. Croix or Hancock)", a.bands.find(b => b.k === "W").stations.length === 8 && !a.bands.find(b => b.k === "W").stations.includes("SC") && !a.bands.find(b => b.k === "W").stations.includes("HN"));
}
{
  const a = ARRS.find(q => q.id === "eht2017"), j = require("./data/interf/eht2017.json"), P = geoStations(a), ix = n => P.findIndex(q => q.name === n);
  check(`EHT 2017: eight stations; JCMT–SMA ${chord3(P, ix("JCMT"), ix("SMA")).toFixed(1)} m and JCMT–IRAM 30 m ${(chord3(P, ix("JCMT"), ix("IRAM 30 m")) / 1e3).toFixed(1)} km, as Paper II's positions give (${j.baselines.shortest_m} m, ${j.baselines.m87_longest_km} km)`,
    P.length === 8 && Math.abs(chord3(P, ix("JCMT"), ix("SMA")) - j.baselines.shortest_m) < 0.5 && Math.abs(chord3(P, ix("JCMT"), ix("IRAM 30 m")) / 1e3 - j.baselines.m87_longest_km) < 0.1);
  // the April 11 track: the default observation, centered on the reference meridian's transit, as the page samples it
  const d = a.defaults, nu = d.nu * 1e9, dec = d.dec * DEG, ants = P.map(q => ({ xyz: q.xyz })), sta = P.map(q => q.sta), B = RI.baselines(ants, 0);
  const wq = new Float32Array(B.length); for (let k = 0; k < B.length; k++) wq[k] = 1 / (P[B.I[k]].sefd * P[B.J[k]].sefd);
  const S = RI.sample({ ants, lat: 0, dec, elMin: 0, dur: d.dur, nu, bw: 0, step: 1 / 120, B, sta, wq });
  let um = 0; for (let k = 0; k < S.n; k++) um = Math.max(um, Math.hypot(S.u[k], S.v[k]));
  const uSR1 = j.observing.sr1_tracks["11"].max_uv_glambda * 1e9;
  check(`EHT 2017: on the April 11 track the longest projected spacing ${(um / 1e9).toFixed(3)} Gλ, within 0.5% of the released data's ${uSR1 / 1e9} Gλ (JCMT–IRAM 30 m)`, rel(um, uSR1) < 0.005);
  const seen = sta.map(q => RI.hourAngles(d.dur, 1 / 60).some(h => RI.staSees(q, h * RI.HA_PER_H, dec)));
  check("EHT 2017: M87 never rises at the SPT; the other seven stations see M87 on the April 11 track", !seen[ix("SPT")] && seen.filter(Boolean).length === 7);
  // the uniform beam on that track against the EHT's CLEAN beam of April 11 (Paper IV Table 1; the page's uv cell)
  const ext = a.configs[0].bmax * nu / C, gap = 1.5 * RI.HA_PER_H * S.step * ext, fill = ext * Math.sqrt(2 * Math.PI / S.n);
  const w = RI.weigh(S, "uniform", 0, Math.max(ext / 250, Math.min(gap, fill)));
  let f = null; for (let k = 0, pix = 0.05 / ext; k < 3 && !f; k++, pix *= 3) { const G = RI.grid(S, w, 512, 1 / (512 * pix)); f = RI.fitBeam(RI.dirty(G.g, null, 512).beam, 512, pix); }
  const cb = j.resolution.clean_beam_apr11_uas, pa = ((f.pa - j.resolution.clean_beam_apr11_pa_deg) % 180 + 270) % 180 - 90;
  check(`EHT 2017: the uniform beam ${(f.maj * RAD * 1e6).toFixed(1)} × ${(f.min * RAD * 1e6).toFixed(1)} µas, PA ${f.pa.toFixed(0)}°, within 15% and 10° of Paper IV's April 11 CLEAN beam ${cb.join(" × ")} µas, PA ${j.resolution.clean_beam_apr11_pa_deg}°`,
    rel(f.maj * RAD * 1e6, cb[0]) < 0.15 && rel(f.min * RAD * 1e6, cb[1]) < 0.15 && Math.abs(pa) < 10);
  // the crescent: total flux 1, the ring's peak at position angle 150 degrees (east of north), 44 uas across
  const n = 256, pix = 1e-6 / RAD, s = RI.skyImage("crescent", 44e-6 / RAD, n, pix, 0);
  let tot = 0, best = 0, bk = 0; for (let k = 0; k < n * n; k++) { tot += s[k]; if (s[k] > best) { best = s[k]; bk = k; } }
  const i = bk % n, jj = Math.floor(bk / n), l = (i >= n / 2 ? i - n : i) * pix, m = (jj >= n / 2 ? jj - n : jj) * pix, pk = (Math.atan2(l, m) / DEG + 360) % 360, rr = Math.hypot(l, m) * RAD * 1e6;
  check(`the crescent sky: flux 1, the brightest pixel at PA ${pk.toFixed(0)}° (Paper IV's 150°) on the ring (radius ${rr.toFixed(1)} µas, 22 µas)`, Math.abs(tot - 1) < 1e-9 && Math.abs(pk - 150) < 8 && Math.abs(rr - 22) < 1.5);
}
{
  const a = ARRS.find(q => q.id === "chime"), j = require("./data/interf/chime.json");
  const ants = a.configs[0].ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), ex = RI.extremes(ants);
  check(`CHIME: 960 feeds (1,024 less the 64 end feeds masked) on four cylinders 22 m apart; the feeds ${j.feeds.spacing_m} m apart`, ants.length === 960 && a.cyl.length === 4 && Math.abs(a.cyl[1][0] - a.cyl[0][0] - 22) < 1e-9 && Math.abs(ex.bmin - j.feeds.spacing_m) < 1e-6, `${ex.bmin.toFixed(4)} m to ${ex.bmax.toFixed(2)} m`);
  // the time to drift through the east-west beam, theta / (15.04 deg/h cos dec), against CHIME/FRB 2018's table
  const t = (nuG, dec) => a.pb.ew.arcminGHz / nuG / 60 * DEG / (RI.HA_PER_H * Math.cos(dec * DEG)) * 60, T = j.drift.transit_min;
  const got = [[0.4, 0], [0.8, 0], [0.4, 45], [0.8, 45]].map(([nu, d]) => t(nu, d)), want = [T.equator[0], T.equator[1], T.dec45[0], T.dec45[1]];
  check(`CHIME: the transit through the beam ${got.map(x => x.toFixed(1)).join(", ")} min (400 and 800 MHz, dec 0° and 45°) within 0.6 min of CHIME/FRB 2018's ${want.join(", ")} (arithmetic only: the relation comes from the same paper's field of view)`, got.every((x, k) => Math.abs(x - want[k]) < 0.6));
  // the field: north of -11 deg (the CHIME/FRB catalog, 2021), about 60% of the sphere
  const fr = (1 - Math.sin(a.decRange[0] * DEG)) / 2;
  check(`CHIME: the field north of ${String(a.decRange[0]).replace("-", "−")}° (CHIME/FRB 2021: "the entire sky north of declination −11◦"), ${(100 * fr).toFixed(1)}% of the sphere; CHIME + outriggers the same`, a.decRange[0] === -11 && j.drift.dec_south_limit_deg === -11 && Math.abs(fr - 0.595) < 0.001 && ARRS.find(q => q.id === "chimeout").decRange[0] === -11);
  // CHIME + outriggers (audit X, 2026-11-16): CHIME and each outrigger phased into one station, as the VLBI forms one
  // beam at the CHIME core and at each outrigger (Andrew et al. 2026); the SEFDs from the radiometer equation
  const o = ARRS.find(q => q.id === "chimeout"), P = geoStations(o), ix = n => P.findIndex(q => q.name === n), c0 = ix("CHIME"), St = j.outriggers.stations;
  const dd = ["KKO", "HCO", "GBO"].map(k => [k, chord3(P, c0, ix(k)) / 1e3, St[k].chord_km]);
  check(`CHIME + outriggers: four stations, six baselines; from CHIME to KKO, HCO, GBO ${dd.map(q => q[1].toFixed(1)).join(", ")} km, within 0.2 km of the fitted positions' ${dd.map(q => q[2]).join(", ")} km`, P.length === 4 && RI.baselines(P.map(q => ({ xyz: q.xyz })), 0).length === 6 && dd.every(q => Math.abs(q[1] - q[2]) < 0.2));
  const sf = j.sensitivity.sefd_per_feed_Jy, bf = N => sf / Math.sqrt(N * (N - 1)), se = o.configs[0].sefd, want2 = [bf(960), bf(64), bf(128), bf(128)];
  check(`CHIME + outriggers: the stations' SEFDs ${se.map(x => x.toFixed(1)).join(", ")} Jy, one feed's ${sf} Jy / √(N (N − 1)) for 960, 64, 128 and 128 phased feeds (Lazda et al. 2026, the radiometer equation)`, se.length === 4 && se.every((x, k) => Math.abs(x - want2[k]) < 1e-6));
  {
    // The map's beam of a transit array (RI.gridEnv): the synthesized beam times each channel's east-west envelope.
    // A zenith-ish snapshot at dec 40 deg, natural weights, 2 x 10^4 baselines drawn; the image grid 16 deg across.
    const lat = a.lat * DEG, B = RI.baselines(ants.map(p => Object.assign({ on: true }, p)), lat, 2e4), ew = nu => a.pb.ew.arcminGHz / 60 * DEG / (nu / 1e9);
    const n = 512, pix = 16 * DEG / n, du = 1 / (n * pix), cut = (b, i) => b[i < 0 ? i + n : i];
    const S1 = RI.sample({ ants, lat, dec: 40 * DEG, elMin: 0, dur: 0, nu: 0.6e9, bw: 0, B }), w1 = RI.weigh(S1, "natural", 0, 1);
    const b0 = RI.dirty(RI.grid(S1, w1, n, du).g, null, n).beam, b1 = RI.dirty(RI.gridEnv(S1, w1, n, du, ew).g, null, n).beam;
    let md = 0;
    for (let q = -n / 2; q < n / 2; q += 7) for (let p = -n / 2; p < n / 2; p++) { const k = ((q + n) % n) * n + ((p + n) % n), l = p * pix; md = Math.max(md, Math.abs(b0[k] * Math.exp(-4 * Math.LN2 * l * l / (ew(0.6e9) ** 2)) - b1[k])); }
    check("a transit array's map beam at one frequency: the synthesized beam times the east-west envelope exactly on the grid (CHIME, 600 MHz)", md < 1e-6, md.toExponential(2));
    // the first east-west alias, at λ / 22 m = 1.30° at 600 MHz: the strongest pixel 1.0°-1.6° east of the center
    const al = b => { let best = 0, at = 0; for (let p = Math.round(1.0 * DEG / pix); p <= Math.round(1.6 * DEG / pix); p++) if (cut(b, p) > best) { best = cut(b, p); at = p * pix / DEG; } return [at, best]; };
    // (in the map's beam the sloping envelope pulls the alias's peak a little toward the center)
    const [x0, h0] = al(b0), [x1, h1] = al(b1), A0 = Math.exp(-4 * Math.LN2 * (x0 * DEG) ** 2 / (ew(0.6e9) ** 2));
    check(`CHIME at 600 MHz: the first east-west alias at ${x0.toFixed(2)}° (λ / 22 m = 1.30°), +${(100 * h0).toFixed(0)}% in the synthesized beam; +${(100 * h1).toFixed(0)}% at ${x1.toFixed(2)}° in the map's beam, within 15% of the alias times the envelope at 1.30° (${(100 * A0).toFixed(1)}%)`,
      Math.abs(x0 - 1.30) < 0.05 && h0 > 0.9 && Math.abs(h1 / (h0 * A0) - 1) < 0.15);
    // across the band, each channel's own envelope and the alias moving with λ: the copies spread out and fade
    const S2 = RI.sample({ ants, lat, dec: 40 * DEG, elMin: 0, dur: 0, nu: 0.6e9, bw: 0.4e9, nCh: 32, B }), w2 = RI.weigh(S2, "natural", 0, 1);
    const b2 = RI.dirty(RI.grid(S2, w2, n, du).g, null, n).beam, b3 = RI.dirty(RI.gridEnv(S2, w2, n, du, ew).g, null, n).beam;
    const far = b => { let best = 0; for (let p = Math.round(0.8 * DEG / pix); p < n / 2; p++) best = Math.max(best, cut(b, p)); return best; };
    check(`CHIME over 400-800 MHz: the strongest east-west lobe beyond 0.8°, +${(100 * far(b2)).toFixed(0)}% in the synthesized beam and +${(100 * far(b3)).toFixed(0)}% in the map's beam`, far(b2) > 0.3 && far(b3) < 0.12);
  }
}
{
  const a = ARRS.find(q => q.id === "chord"), j = require("./data/interf/chord.json");
  const core = a.configs.find(c => c.id === "core"), pf = a.configs.find(c => c.id === "pathfinder"), ex = RI.extremes(core.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })));
  check(`CHORD: ${core.ants.length} dishes in the core (the 22 × 24 grid less 16), ${pf.ants.length} in the pathfinder; the closest ${ex.bmin.toFixed(2)} m apart (the grid's ${j.grid.de_m} m), the farthest ${ex.bmax.toFixed(1)} m (the record's ${j.configs.core.bmax_m} m)`,
    core.ants.length === 512 && pf.ants.length === 64 && Math.abs(ex.bmin - j.grid.de_m) < 0.02 && Math.abs(ex.bmax - j.configs.core.bmax_m) < 0.05);
  {
    // a transit array's samples carry the beam's power toward the drifting source: 1 at transit, 1/2 at the ends of the
    // half-power crossing
    const ants = pf.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), nu = 0.6e9, th = 1.2 * C / nu / ARRS.find(q => q.id === "chord").dish, dec = 40 * DEG, dur = th / (RI.HA_PER_H * Math.cos(dec));
    const S = RI.sample({ ants, lat: ARRS.find(q => q.id === "chord").lat * DEG, dec, elMin: 0, dur, nu, bw: 0, nCh: 1, step: dur / 40, drift: th });
    const first = S.wb[0], mid = S.wb[S.tOff[20]], last = S.wb[S.n - 1];
    check("CHORD pathfinder drifting through the beam (600 MHz, dec 40°): each sample weighted by the beam, 1 at transit, 1/2 at the half-power edges", Math.abs(mid - 1) < 1e-6 && Math.abs(first - 0.5) < 0.005 && Math.abs(last - 0.5) < 0.005, `${first.toFixed(4)}, ${mid.toFixed(4)}, ${last.toFixed(4)}`);
  }
  check(`CHORD: the primary beam 1.2 λ / D = ${(a.pb.arcminGHz / 60).toFixed(3)}° / ν(GHz), 2.4° at 1420 MHz (Bij et al. 2026; arithmetic of the relation)`, Math.abs(a.pb.arcminGHz / 60 / 1.42 - 2.42) < 0.02);
  {
    // the grid's grating lobes (Hopkins et al. 2026 Fig. 2 caption, at 21 cm: "The north alias is about 1.4 degrees
    // away, and the east alias is about 1.9 degrees away"): a zenith snapshot of the core at 1.42 GHz, natural weights;
    // the strongest lobe beyond 0.5° along the north-south and the east-west axes (independent of the digitization's
    // counts: tests the axes the 6.3 and 8.5 m spacings run along)
    const ants = core.ants.map(p => ({ e: p[0], n: p[1], u: p[2] })), lat = a.lat * DEG, nu = 1.42e9;
    const S = RI.sample({ ants, lat, dec: lat, elMin: 0, dur: 0, nu, bw: 0, B: RI.baselines(ants, lat) });
    const n2 = 1024, pix2 = 6 * DEG / n2, W = RI.weigh(S, "natural", 0, 1), G = RI.grid(S, W, n2, 1 / (n2 * pix2)), bm = RI.dirty(G.g, null, n2).beam;
    // (the strongest pixel 0.5°-2.8° from the center within 15° of the axis: the grid is turned 2°, so a lobe sits off the
    // exact axis)
    const along = ax => { let best = 0, at = 0; for (let q = -n2 / 2 + 1; q < n2 / 2; q++) for (let p = -n2 / 2 + 1; p < n2 / 2; p++) { const r = Math.hypot(p, q) * pix2 / DEG; if (r < 0.5 || r > 2.8) continue; const t = Math.abs(Math.atan2(ax ? q : p, ax ? p : q)) / DEG; if (Math.min(t, 180 - t) > 15) continue; const v = bm[((q + n2) % n2) * n2 + ((p + n2) % n2)]; if (v > best) { best = v; at = r; } } return [at, best]; };
    const ns = along(0), ew = along(1);
    check(`CHORD: the grating lobes of a zenith snapshot at 1.42 GHz at ${ns[0].toFixed(2)}° north-south (+${(100 * ns[1]).toFixed(0)}%) and ${ew[0].toFixed(2)}° east-west (+${(100 * ew[1]).toFixed(0)}%), within 0.1° of Hopkins et al. 2026's "about 1.4" and "about 1.9" degrees`, Math.abs(ns[0] - 1.4) < 0.1 && Math.abs(ew[0] - 1.9) < 0.1 && ns[1] > 0.5 && ew[1] > 0.5);
    const f = RI.fitBeam(bm, n2, pix2);
    info(`CHORD: the natural zenith beam at 1.42 GHz`, `${(f.maj * RAD / 60).toFixed(2)}′ × ${(f.min * RAD / 60).toFixed(2)}′, PA ${f.pa.toFixed(0)}° (the published 4′ N-S × 6′ E-W of Bij et al. 2026 Table 1 and 3.1′ × 7.0′ of Hopkins et al. 2026 Table 1 disagree with each other, so no threshold)`);
  }
}
{
  // the Bessel functions behind the crescent: J0 and the scaled I0, I1 against their power series
  const J0s = x => { let s = 0, t = 1; for (let k = 0; k < 80; k++) { if (k) t *= -(x * x / 4) / (k * k); s += t; } return s; };
  const In = (n, z) => { let t = Math.pow(z / 2, n), s = 0; for (let k = 0; k < 400; k++) { if (k) t *= (z * z / 4) / (k * (k + n)); s += t; } return s; };
  let eJ = 0, eI = 0;
  for (const x of [0, 0.5, 2.4048, 5, 12, 25]) eJ = Math.max(eJ, Math.abs(RI.J0(x) - J0s(x)));
  for (const z of [0.3, 2, 10, 40, 59.9, 60, 80, 200]) for (const n of [0, 1]) eI = Math.max(eI, Math.abs(RI.Ine(n, z) / (Math.exp(-z) * In(n, z)) - 1));
  check("J0 to 1e-5 against its series (0 to 25); e^-z I0(z) and e^-z I1(z) to 1e-6 (relative) against theirs (0.3 to 200)", eJ < 1e-5 && eI < 1e-6, `${eJ.toExponential(1)}, ${eI.toExponential(1)}`);
  // the crescent's image (the closed-form convolution) and the core-jet's against their visibilities (the closed form,
  // the sum of the components), through the FFT
  const n = 512, F = 300e-6 / RAD, pix = 2 * F / n, du = 1 / (2 * F);
  for (const [model, size] of [["crescent", 44e-6 / RAD], ["corejet", 200e-6 / RAD]]) {
    const V = RI.visibilities(RI.skyImage(model, size, n, pix, 0), n);
    let worst = 0;
    for (let q = -40; q <= 40; q += 2) for (let p = -40; p <= 40; p += 2) { const k = ((q + n) % n) * n + (p + n) % n; worst = Math.max(worst, Math.abs(Math.hypot(V.re[k], V.im[k]) - RI.vis(model, size, p * du, q * du))); }
    check(`the ${model} sky: the transform of its image matches its visibility formula to 0.002 (out to ${(40 * du / 1e9).toFixed(1)} Gλ)`, worst < 0.002, worst.toExponential(2));
  }
  // M87* with its jet (Paper IV: the 0.55 Jy crescent and Table 10's 0.6 Jy jet): the transform of the image on a grid
  // that holds the jet matches m87Vis; the whole flux at the intra-site spacings, and between sites (>= 1.4 Glambda,
  // LMT-SMT the shortest) only the crescent's share, the jet resolved out; on the page's default grid (320 uas) the
  // jet beyond the grid is dropped and the crescent keeps its share
  {
    const d = 44e-6 / RAD, n2 = 2048, F2 = 3000e-6 / RAD, pix2 = 2 * F2 / n2, du2 = 1 / (2 * F2), sk = RI.skyImage("m87", d, n2, pix2, 0), V = RI.visibilities(sk, n2);
    let tot = 0; for (const x of sk) tot += x;
    let worst = 0;
    for (let q = -60; q <= 60; q += 3) for (let p = -60; p <= 60; p += 3) { const k = ((q + n2) % n2) * n2 + (p + n2) % n2; worst = Math.max(worst, Math.abs(Math.hypot(V.re[k], V.im[k]) - RI.vis("m87", d, p * du2, q * du2))); }
    check(`M87* with its jet: flux 1 on a 6000 µas grid; the transform of the image matches m87Vis to 0.003 (out to ${(60 * du2 / 1e9).toFixed(1)} Gλ)`, Math.abs(tot - 1) < 1e-5 && worst < 0.003, `flux ${tot.toFixed(6)}, worst ${worst.toExponential(2)}`);
    const w = RI.M87.ring / RI.M87.total;
    let jetLong = 0; for (let k = 0; k < 72; k++) { const a = k * 5 * DEG; for (const q of [1.4e9, 3e9, 8e9]) jetLong = Math.max(jetLong, Math.abs(RI.vis("m87", d, q * Math.sin(a), q * Math.cos(a)) - w * RI.vis("crescent", d, q * Math.sin(a), q * Math.cos(a)))); }
    const intra = Math.min(RI.vis("m87", d, 1.25e5, 0), RI.vis("m87", d, 0, 2.0e6));
    const sk0 = RI.skyImage("m87", d, 512, 320e-6 / RAD / 512, 0); let t0 = 0; for (const x of sk0) t0 += x;
    check(`M87* with its jet: ${RI.M87.ring} + ${(RI.M87.total - RI.M87.ring).toFixed(1)} Jy; the intra-site spacings see it all (${intra.toFixed(4)}), between sites the jet adds < 0.001 to the crescent's share ${w.toFixed(3)}; the 320 µas grid holds ${t0.toFixed(3)}`, Math.abs(RI.M87.total - 1.15) < 1e-9 && intra > 0.999 && jetLong < 1e-3 && t0 > w && t0 < 0.6, `jet between sites ${jetLong.toExponential(1)}`);
  }
  // the crescent's visibility has the ring's first null near J0's first zero, 2.405 / (pi d), across the dipole axis
  const d = 44e-6 / RAD, u0 = 2.405 / (Math.PI * d), pa = RI.CRESCENT.pa * DEG + Math.PI / 2;
  let best = Infinity, ub = 0; for (let k = 0; k < 400; k++) { const u = u0 * (0.8 + 0.4 * k / 400), A = RI.vis("crescent", d, u * Math.sin(pa), u * Math.cos(pa)); if (A < best) { best = A; ub = u; } }
  check(`the crescent (44 µas): the first null across the dipole axis at ${(ub / 1e9).toFixed(2)} Gλ, J0's ${(u0 / 1e9).toFixed(2)} Gλ`, Math.abs(ub / u0 - 1) < 0.01 && best < 1e-3, best.toExponential(1));
  // the Smoothed view: a point source smoothed by a beam is that beam
  const beam = { maj: 25e-6 / RAD, min: 15e-6 / RAD, pa: 30 }, img = RI.smoothed(RI.pointVis("point", 0, n, du, 0), beam, n, du), f = RI.fitBeam(img, n, pix);
  let mx = 0; for (const x of img) mx = Math.max(mx, x);
  check("the Smoothed view of a point source is the fitted beam: peak 1, 25 × 15 µas at PA 30°", Math.abs(mx - 1) < 1e-6 && rel(f.maj, beam.maj) < 1e-3 && rel(f.min, beam.min) < 1e-3 && Math.abs(f.pa - 30) < 0.1, `${(f.maj * RAD * 1e6).toFixed(3)} × ${(f.min * RAD * 1e6).toFixed(3)} µas, PA ${f.pa.toFixed(2)}°`);
}
{
  // a horizon mask: a station sees a source above the limit only where the terrain lies lower
  const s = { lat: 30 * DEG, dlon: 0, elMin: 0, mask: { az: [0, 180 * DEG, 360 * DEG], el: [0, 40 * DEG, 0] } };
  check("a horizon mask: a source due south at 35° elevation hidden behind a 40° ridge, due north at 35° seen", !RI.staSees(s, 0, (30 - 55) * DEG) && RI.staSees(s, 180 * DEG, (180 - 35 - 30 - 90) * DEG) === RI.elevation(180 * DEG, 25 * DEG, 30 * DEG) >= 0);
  const pts = RI.pointsList(1e-3); let mx = 0, mn = Infinity; for (const q of pts) { mx = Math.max(mx, q[2]); mn = Math.min(mn, q[2]); }
  check(`the point-source sky: ${RI.POINTS_N} sources drawn from 1 to 100 (N(>S) ~ S^-1.5), the seeded field's brightest ${(mx / mn).toFixed(1)} times its faintest (beyond the 21.5 the old draw could reach), all within the spread`, pts.length === RI.POINTS_N && mx / mn > 21.5 && mx / mn <= 100 + 1e-9 && pts.every(q => Math.hypot(q[0], q[1]) <= 0.5e-3 + 1e-15));
}

console.log(`\n${npass} pass, ${nfail} fail`);
process.exit(nfail ? 1 : 0);
