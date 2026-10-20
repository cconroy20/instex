// Physics checks for web/interf.js (the Interferometer mode):  node validate_int.js
// Relations: data/interf/formulas.md (TMS 3rd ed. Eqs. 4.1, 4.4, 4.5, A4.1; Briggs robust weighting in CASA's form).
// 1. Geometry: the local-to-equatorial turn, east-west baselines tracing ellipses of axis ratio sin(dec) (circles
//    of radius B / lambda at the pole), the elevation at transit, the baseline count N (N - 1) / 2.
// 2. The transforms: the dirty beam of two antennas is the fringe cos(2 pi u l) (spacing lambda / B), the beam is
//    real and symmetric, a point source's dirty image is the beam, a double's is the sum of two shifted beams.
// 3. The beam fit recovers a Gaussian's FWHMs and position angle; weighting limits (robust +5 = natural, -5 = uniform).
// 4. The sky models' visibilities: J1 against its series, the closed forms against the FFT of the models' images.
// 4b. Made-up layouts: the counts, the longest baselines of the shapes, the random layout's disc and seed, the
//    grid's redundant baselines, the spreading of a crowded layout.
// 5. The arrays (web/rpresets.js) against their records (data/interf/*.json): antenna counts, longest baselines vs
//    the published tables; the VLA's beam ratios (natural / uniform, snapshot / full) against the OSS notes, and
//    the OSS beam table as INFO lines (the uniform beam depends on the uv cell, which the OSS does not state); ALMA's
//    baseline statistics, largest scale and robust-0.5 beam against its Technical Handbook, sidelobes as INFO.
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
  const ext = c.bmax * nu / C, w = RI.weigh(S, wt, rob, Math.max(ext / 250, 1.5 * 0.2618 * S.step * ext));
  for (let k = 0, pix = 0.05 / ext; k < 3; k++, pix *= 3) {
    const G = RI.grid(S, w, 512, 1 / (512 * pix)), D = RI.dirty(G.g, null, 512), f = RI.fitBeam(D.beam, 512, pix);
    if (f) return Math.sqrt(f.maj * f.min) * RAD;
  }
  return NaN;
}
{
  const a = ARRS.find(q => q.id === "vla"), j = require("./data/interf/vla.json");
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

console.log(`\n${npass} pass, ${nfail} fail`);
process.exit(nfail ? 1 : 0);
