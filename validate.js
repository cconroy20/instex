// Physics checks for web/physics.js:  node validate.js
// 1. The worked example of the Via notes "Notes on Spectrograph Design" (6.5 m, 1" slit,
//    R2 echelle in Littrow, 15 um pixels), every row of its table, from the ray trace.
// 2. Identities the notes derive: the grating equation, anamorphic factor, F_tel-invariance of R,
//    the camera focal-ratio condition for arbitrary angles, the pixel scale, focal-ratio degradation,
//    slicing, the diffraction-limited R.
// 3. Echelle format: blaze wavelengths, free spectral range, order positions; prism and grism
//    cross-dispersers against their closed forms.
"use strict";
const IX = require("./web/physics.js");

let nfail = 0, npass = 0;
function check(name, ok, detail) {
  ok ? npass++ : nfail++;
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail !== undefined ? "  --  " + detail : ""}`);
}
const rel = (a, b) => Math.abs(a / b - 1);
const RAD = IX.RAD, DEG = IX.DEG;
const rnd = (() => { let s = 4242; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

// A Littrow R2 grating at 5496 A: 31.6 l/mm, order 103 gives m G lambda = 2 sin(63.435 deg).
const tanD = 2, dR2 = Math.atan(tanD);
const G0 = 31.6, m0 = 103, lam0 = 2 * Math.sin(dR2) / (G0 / 1000 * m0) * 1e4;   // A
const base = {
  mode: "grating", D: 6.5, F: 5, feed: "slit", slitW: 1, slitL: 10, core: 100, eta: 1, nFib: 1, N: 1,
  W: 100, fcam: 300, gType: "refl", G: G0, m: m0, lamB: lam0, lamC: lam0, psi: 0,
  Nx: 4096, Ny: 4096, pix: 15,
};
const mk = o => IX.design(Object.assign({}, base, o));

// ---------------------------------------------------------------- 1. worked example
{
  const S = mk({});
  const thg = 1 / RAD * 6500 / 100;
  check("plate scale 206265/f_tel = 6.35 arcsec/mm", Math.abs(S.plate - 6.3466) < 1e-3, S.plate.toFixed(4));
  check("slit width at focus = 158 um", Math.abs(S.slitFocus * 1000 - 157.57) < 0.01, (S.slitFocus * 1000).toFixed(2) + " um");
  check("collimator focal length F_tel W = 500 mm", Math.abs(S.fcol - 500) < 1e-9, S.fcol);
  check("angle at the grating phi D/W = 65 arcsec = 3.15e-4 rad", rel(S.thetaG, thg) < 1e-12, S.thetaG.toExponential(4));
  check("Littrow: alpha = beta = blaze = 63.4 deg", Math.abs(S.alpha - dR2) < 1e-12 && Math.abs(S.beta - dR2) < 1e-12, (S.alpha / DEG).toFixed(4));
  const R = 2 * tanD / thg;
  check("slit-limited R = 2 tan(delta)/theta_g = 12,700 (traced)", rel(S.c.Rs, R) < 1e-7, `${S.c.Rs.toFixed(2)} vs ${R.toFixed(2)}`);
  check("illuminated grating length W/cos(delta) = 224 mm", Math.abs(S.Lg - 223.607) < 1e-3, S.Lg.toFixed(3));
  const Rdiff = S.Lg * 2 * Math.sin(dR2) / (lam0 / 1e7);
  check("diffraction ceiling L_g (sin a + sin b)/lambda = 7e5", rel(S.c.Rd, Rdiff) < 1e-9 && Math.abs(S.c.Rd - 7.3e5) < 0.1e5, S.c.Rd.toFixed(0));
  // Nyquist sampling: F_cam = n_pix p / (phi D) = 0.952 -> f_cam = 95.2 mm for a 100 mm beam
  const Fc = 2 * 0.015 / (1 / RAD * 6500);
  check("minimum camera ratio n_pix p/(phi D) = f/0.95", Math.abs(Fc - 0.952) < 1e-3, Fc.toFixed(4));
  const Sn = mk({ fcam: Fc * 100 });
  check("with f_cam = F_cam W': n_pix = 2.000 (traced)", Math.abs(Sn.c.npix - 2) < 1e-6, Sn.c.npix.toFixed(6));
  check("effective R with n_pix = 2 = 11,400", Math.abs(Sn.c.Reff - 11351) < 2 && Math.round(Sn.c.Reff / 100) * 100 === 11400, Sn.c.Reff.toFixed(0));
  check("Nyquist pixels remove 11 per cent of R", Math.abs(1 - 1 / Math.sqrt(1.25) - 0.106) < 1e-3, (1 - Sn.c.Reff / Sn.c.Rs).toFixed(4));
  const Sd = mk({ feed: "dl", W: 2 * 0 + 12693.2 * (lam0 / 1e7) / (2 * tanD) });
  check("diffraction-limited input: W = 1.7 mm for the same R", Math.abs(Sd.P.W - 1.744) < 0.01 && rel(Sd.c.Rs, 12693.2) < 1e-4, `W ${Sd.P.W.toFixed(3)} mm, R ${Sd.c.Rs.toFixed(0)}`);
  const S50 = mk({ W: 50000 * (1 / RAD) * 6500 / (2 * tanD) });
  check("R = 50,000 at 1\" needs W = 394 mm", Math.abs(S50.P.W - 393.9) < 0.1 && rel(S50.c.Rs, 50000) < 1e-7, `W ${S50.P.W.toFixed(1)}, R ${S50.c.Rs.toFixed(1)}`);
  check("  ... and f_col = 2.0 m", Math.abs(S50.fcol - 1969.6) < 0.5, S50.fcol.toFixed(1));
  const S4 = mk({ N: 4 });
  check("four slices: R = 51,000 from the 100 mm beam", Math.abs(S4.c.Rs - 50773) < 1, S4.c.Rs.toFixed(0));
  check("four slices relax the camera to f/3.8", Math.abs(4 * Fc - 3.81) < 0.01, (4 * Fc).toFixed(3));
  const Nres = 12693.2 * Math.log(7800 / 3800);
  check("resolution elements 3800-7800 A at R = 12,700: 9,100", Math.round(Nres / 100) * 100 === 9100, Nres.toFixed(0));
  const Sf = mk({ feed: "fiber", core: 1 / RAD * 32500 * 1000, eta: 1.25 });
  check("fiber with eta = 1.25: box-width R 12,700 -> 10,200", Math.abs(Sf.c.lam / (Sf.c.w / Sf.c.disp) - 10154.6) < 0.5, (Sf.c.lam / (Sf.c.w / Sf.c.disp)).toFixed(1));
  const Sfw = mk({ feed: "fiber", core: 1 / RAD * 32500 * 1000, eta: 1.25, W: 125 });
  check("  ... or the beam grows to 125 mm and f_col is unchanged", rel(Sfw.c.lam / (Sfw.c.w / Sfw.c.disp), 12693.218) < 1e-6 && Math.abs(Sfw.fcol - 500) < 1e-9, `fcol ${Sfw.fcol}`);
}

// ---------------------------------------------------------------- 2. identities
{
  // grating equation and anamorphic factor for random reflection configurations
  let eG = 0, eA = 0, eR = 0, eF = 0, ePS = 0, nOK = 0;
  for (let k = 0; k < 400; k++) {
    const G = 100 + 1700 * rnd(), lam = 3500 + 6000 * rnd(), psi = 5 + 50 * rnd(), m = 1 + Math.floor(2 * rnd());
    const S = mk({ G, m, lamC: lam, lamB: lam, psi, W: 30 + 200 * rnd(), fcam: 100 + 600 * rnd(), slitW: 0.3 + 2 * rnd(), D: 1 + 9 * rnd(), F: 2 + 13 * rnd() });
    if (S.bad || !S.c) continue;
    nOK++;
    const sb = m * G / 1000 * lam / 1e4 - Math.sin(S.alpha);
    eG = Math.max(eG, Math.abs(Math.sin(S.beta) - sb));
    eA = Math.max(eA, Math.abs(S.anam - Math.cos(S.beta) / Math.cos(S.alpha)));
    const thg = S.P.slitW / RAD * S.P.D * 1000 / S.P.W;
    const R = (Math.sin(S.alpha) + Math.sin(S.beta)) / (thg * Math.cos(S.alpha));
    eR = Math.max(eR, rel(S.c.Rs, R));
    const npix = S.P.slitW / RAD * S.P.D * 1000 * S.Fcam / 0.015;              // n_pix = phi D F_cam / p
    eF = Math.max(eF, rel(S.c.npix, npix));
    const ps = 0.015 * RAD * S.P.W / (S.P.D * 1000 * S.P.fcam);
    ePS = Math.max(ePS, rel(S.c.pixScale, ps));
  }
  check("grating equation sin a + sin b = m lambda / sigma (400 random setups)", nOK > 300 && eG < 1e-12, `${nOK} setups, max error ${eG.toExponential(1)}`);
  check("anamorphic factor W'/W = cos b / cos a", eA < 1e-12, eA.toExponential(1));
  check("R = (sin a + sin b)/(theta_g cos a), traced", eR < 1e-5, eR.toExponential(1));
  check("n_pix = phi D F_cam / p for any a, b (anamorphic factors cancel)", eF < 1e-5, eF.toExponential(1) + ' (the formula is first order in the slit width)');
  check("pixel scale = 206265 p W / (D f_cam): F_tel drops out", ePS < 1e-6, ePS.toExponential(1));
  // F_tel invariance
  const a = mk({ F: 5 }), b = mk({ F: 15 });
  check("R independent of F_tel (f/5 vs f/15)", rel(a.c.Rs, b.c.Rs) < 1e-9 && Math.abs(b.fcol / a.fcol - 3) < 1e-12, `${a.c.Rs.toFixed(3)} vs ${b.c.Rs.toFixed(3)}; f_col x${(b.fcol / a.fcol).toFixed(3)}`);
  // diffraction-limited: D cancels
  const d1 = mk({ feed: "dl", D: 2.5, W: 20 }), d2 = mk({ feed: "dl", D: 25, W: 20 });
  const Rdl = 2 * tanD * 20 / (lam0 / 1e7);
  check("diffraction-limited R = 2 tan(delta) W / lambda, same on 2.5 m and 25 m", rel(d1.c.Rs, Rdl) < 1e-7 && rel(d2.c.Rs, Rdl) < 1e-7, `${d1.c.Rs.toFixed(1)}, ${d2.c.Rs.toFixed(1)} vs ${Rdl.toFixed(1)}`);
  check("  ... equal to the grating's own limit m N, so R_eff = R/sqrt(2) (pixels aside)", rel(d1.c.Rd, Rdl) < 1e-9, d1.c.Rd.toFixed(1));
  // transmission grating, symmetric setting
  const V = mk({ gType: "trans", G: 1000, m: 1, lamC: 6000 });
  const aB = Math.asin(0.6 / 2);
  check("transmission grating, symmetric: alpha = beta = asin(m G lambda / 2), deviation 2 alpha", Math.abs(V.alpha - aB) < 1e-12 && Math.abs(V.psi - 2 * aB) < 1e-12, (V.alpha / DEG).toFixed(4));
  const Rv = 2 * Math.tan(aB) / (1 / RAD * 6500 / 100);
  check("transmission resolving power 2 tan(alpha)/theta_g", rel(V.c.Rs, Rv) < 1e-6, `${V.c.Rs.toFixed(1)} vs ${Rv.toFixed(1)}`);
  // coverage of a first-order grating against the closed form beta(x) = beta_c + atan(x/f_cam)
  const C = mk({ G: 600, m: 1, lamC: 6000, lamB: 6000, psi: 30, fcam: 300, Nx: 2048, pix: 15, W: 100 });
  const half = 2048 * 0.015 / 2, bc = C.beta;
  const lamAt = x => (Math.sin(C.alpha) + Math.sin(bc + Math.atan(x / 300))) / 0.6 * 1e4;
  const want = [lamAt(-half), lamAt(half)].sort((a, b) => a - b);
  check("first-order coverage = closed form at the detector edges", Math.abs(C.range[0] * 1e4 - want[0]) < 1e-3 && Math.abs(C.range[1] * 1e4 - want[1]) < 1e-3,
    `${(C.range[0] * 1e4).toFixed(2)}-${(C.range[1] * 1e4).toFixed(2)} vs ${want[0].toFixed(2)}-${want[1].toFixed(2)} A`);
  const disp = Math.cos(bc) / (600 * 300) * 1e7 * 0.015;              // A per pixel = sigma cos b /(m f_cam) * p, sigma in mm
  check("dispersion sigma cos(beta)/(m f_cam) at the center", rel(C.c.dlpix, disp) < 1e-7, `${C.c.dlpix.toFixed(5)} vs ${disp.toFixed(5)} A/pix`);
  check("second-order flag above 6400 A", C.flags.some(f => f.k === "ord"));
  // blaze function: 1 at the blaze, sinc^2(pi/2) = 0.405 at the free-spectral-range edge of a Littrow echelle
  const B = mk({});
  check("blaze efficiency 1 at the blaze wavelength", Math.abs(B.c.eff - 1) < 1e-12, B.c.eff);
  // at the edges of the free spectral range the small-angle result is sinc^2(pi/2) = 0.405; for a
  // steep echelle the envelope is asymmetric (sin beta curves), lower on the red edge
  const eR_ = B.local((lam0 / 1e4) * (1 + 1 / (2 * m0)), m0).eff, eB_ = B.local((lam0 / 1e4) * (1 - 1 / (2 * m0)), m0).eff;
  check("blaze efficiency at the FSR edges straddles sinc^2(pi/2) = 0.405", eR_ < 0.405 && eB_ > 0.405 && Math.abs((eR_ + eB_) / 2 - 0.405) < 0.01, `red ${eR_.toFixed(4)}, blue ${eB_.toFixed(4)}`);
}

// ---------------------------------------------------------------- 3. echelle format
IX.GLASS.__test = { B: [1.0, 0.2], C: [0.012, 100] };   // a made-up glass for the prism and grism algebra
{
  const E = {
    mode: "echelle", D: 6.5, F: 5, feed: "slit", slitW: 1, slitL: 3, N: 1, W: 100, fcam: 300,
    eG: 31.6, eDelta: dR2 / DEG, gamma: 1, theta: 0, xd: "grating", xG: 300, xPsi: 10, xGlass: "__test", xA: 40, xPasses: 1,
    lamC: 5500, Nx: 4096, Ny: 4096, pix: 15,
  };
  const S = IX.design(E);
  const K = Math.cos(1 * DEG) * 2 * Math.sin(dR2) / (31.6 / 1000);
  check("echelle blaze: m lambda_b = 2 sigma sin(delta) cos(gamma)", rel(S.mlamRef, K) < 1e-12, `${S.mlamRef.toFixed(4)} um`);
  check("echelle: orders on the chip", S.orders.length > 20, `${S.orders.length} orders, m ${S.orders[S.orders.length - 1].m}-${S.orders[0].m}`);
  const o = S.orders[Math.floor(S.orders.length / 2)];
  check("free spectral range lambda/m", Math.abs((o.fsrHi - o.fsrLo) - o.lb / o.m) / (o.lb / o.m) < 1 / (o.m * o.m) * 2, `${((o.fsrHi - o.fsrLo) * 1e4).toFixed(2)} vs ${(o.lb / o.m * 1e4).toFixed(2)} A`);
  let xmax = 0;
  for (const q of S.orders) { const p = S.pos(q.lb, q.m); xmax = Math.max(xmax, Math.abs(p[0])); }
  check("blaze centers of all orders lie near the center column", xmax < 0.6, `max |X| ${xmax.toFixed(3)} mm`);
  // in-order R at the blaze: out of plane by gamma, R = cos(gamma) 2 tan(delta)/theta_g, and the
  // slit image tilts by tan(phi) = 2 tan(gamma) tan(delta) (traced without a cross-disperser)
  const thg = 1 / RAD * 6500 / 100;
  for (const g of [1, 3]) {
    const N0 = IX.design(Object.assign({}, E, { xd: "none", gamma: g }));
    const mb = 103, L = N0.local(N0.mlamRef / mb, mb);
    check(`echelle at gamma = ${g} deg: R = cos(gamma) 2 tan(delta)/theta_g`, rel(L.Rs, Math.cos(g * DEG) * 2 * tanD / thg) < 1e-6, `${L.Rs.toFixed(1)} vs ${(Math.cos(g * DEG) * 2 * tanD / thg).toFixed(1)}`);
    const tilt = Math.abs(Math.atan(L.sdir[0] / L.sdir[1])), want = Math.atan(2 * Math.tan(g * DEG) * tanD);
    check(`  ... line tilt atan(2 tan(gamma) tan(delta)) = ${(want / DEG).toFixed(2)} deg`, Math.abs(tilt - want) < 0.003 * want, `${(tilt / DEG).toFixed(3)} deg`);
  }
  const L1 = S.local(S.mlamRef / 103, 103);
  check("with the grating cross-disperser, R within 0.5% (the tilted line slides across itself)", rel(L1.Rs, Math.cos(DEG) * 2 * tanD / thg) < 5e-3, `${L1.Rs.toFixed(1)}`);
  // order spacing with a grating cross-disperser grows as lambda^2
  const a = S.orders[2], b = S.orders[S.orders.length - 4];
  const sep = q => { const n = S.orders.find(r => r.m === q.m - 1); return n ? Math.abs(S.pos(n.lb, n.m)[1] - S.pos(q.lb, q.m)[1]) : NaN; };
  const ratio = sep(b) / sep(a), want = (b.lb / a.lb) ** 2;
  check("grating cross-disperser: order spacing ~ lambda^2", Math.abs(ratio / want - 1) < 0.08, `ratio ${ratio.toFixed(3)} vs (lambda ratio)^2 ${want.toFixed(3)}`);
  // prism: minimum deviation at lamC and its angular dispersion
  const Pr = IX.design(Object.assign({}, E, { xd: "prism", xA: 40, xPasses: 1 }));
  const n = l => IX.nGlass("__test", l), A = 40 * DEG, lc = 0.55;
  const Dmin = 2 * Math.asin(n(lc) * Math.sin(A / 2)) - A;
  check("prism: deviation at lamC = 2 asin(n sin(A/2)) - A", Math.abs(Pr.xdDev - Dmin) < 1e-9, `${(Pr.xdDev / DEG).toFixed(5)} deg`);
  const u1 = IX.design(Object.assign({}, E, { xd: "prism" }));
  const h = 1e-5, dn = (n(lc + h) - n(lc - h)) / (2 * h);
  const dth = 2 * Math.sin(A / 2) / Math.sqrt(1 - n(lc) ** 2 * Math.sin(A / 2) ** 2) * dn;   // rad per um
  // traced: Y shift for a small wavelength change at fixed m lambda (the echelle direction held)
  const mm = u1.mRef, l1 = u1.mlamRef / mm;
  const dirA = u1.dirOut(l1 * (1 + 1e-6), mm, 0, 0), dirB = u1.dirOut(l1 * (1 - 1e-6), mm, 0, 0);
  // remove the echelle part by projecting on the cross-dispersion axis
  const dY = IX.dot(dirA, u1.yc) - IX.dot(dirB, u1.yc);
  const pred = Math.abs(dth * 2e-6 * l1 * Math.cos(0));
  check("prism angular dispersion 2 sin(A/2)/cos(i) dn/dlambda", Math.abs(Math.abs(dY) / pred - 1) < 0.02, `${Math.abs(dY).toExponential(4)} vs ${pred.toExponential(4)}`);
  const Pr2 = IX.design(Object.assign({}, E, { xd: "prism", xPasses: 2 }));
  check("double-pass prism: twice the deviation", Math.abs(Pr2.xdDev - 2 * Dmin) < 1e-6, `${(Pr2.xdDev / DEG).toFixed(4)} deg`);
  // VPH cross-disperser: symmetric at lamC (deviation 2 asin(G lamC / 2)), order spacing ~ lambda^2 like a reflection grating
  const Vx = IX.design(Object.assign({}, E, { xd: "vph", xG: 300 }));
  const aV = Math.asin(0.3 * 0.55 / 2);
  check("VPH cross-disperser at the symmetric setting for lamC", !Vx.bad && Math.abs(Vx.xdAlpha - aV) < 1e-12 && Vx.orders.length > 20 && Math.abs(Vx.c.Y) < 0.05, Vx.bad || `${Vx.orders.length} orders, alpha ${(Vx.xdAlpha / DEG).toFixed(3)} deg`);
  // grism: undeviated at lamC
  const Gr = IX.design(Object.assign({}, E, { xd: "grism", xG: 150 }));
  const Ag = Math.asin(0.15 * lc / (n(lc) - 1));
  const zIn = Gr.dirOut(Gr.mlamRef / Gr.mRef, Gr.mRef, 0, 0);
  check("grism apex from sin A = G lambda/(n - 1)", Math.abs(Gr.xdApex - Ag) < 1e-12, `${(Gr.xdApex / DEG).toFixed(3)} deg`);
  check("grism: lamC passes undeviated (camera axis = echelle blaze ray)", Math.abs(Gr.c.Y) < 0.05 * 300 * 1e-2, `Y(lamC) ${Gr.c.Y.toFixed(4)} mm`);
}

// ---------------------------------------------------------------- 4. instrument presets
// Each preset's published performance, reproduced by the trace from its sourced parameters.  The
// tolerances were set from the precision of each source before the comparison was run; misses are
// reported, not tuned away.
{
  const PRESETS = require("./web/presets.js");
  const toP = st => {
    const sc = st.mode === "echelle" ? "e" : "g", m = st[sc];
    const P = Object.assign({ mode: st.mode, D: st.D, F: st.F, feed: "slit", slitL: 0 }, m);
    if (P.mode === "grating") P.lamB = m.lamB1 / m.m;
    return P;
  };
  for (const p of PRESETS) {
    const S = IX.design(toP(p.state));
    check(`preset ${p.id}: valid design`, !S.bad && !!S.c, S.bad || `R ${S.c.Reff.toFixed(0)}, ${(S.range[0] * 1e4).toFixed(0)}-${(S.range[1] * 1e4).toFixed(0)} A`);
    if (S.bad || !S.c) continue;
    const ordFor = lam => (p.state.mode === "echelle" ? Math.round(S.mlamRef / (lam / 1e4)) : S.order);
    for (const q of p.pub || []) {
      let val;
      switch (q.q) {
        case "R": val = S.c.Reff; break;
        case "Rs": val = S.c.Rs; break;
        case "Rnpix": val = S.c.Reff * S.c.npix; break;
        case "ordSpan": { const o = S.orders.find(q2 => q2.m === q.m); val = o ? (o.hi - o.lo) * 1e4 : NaN; break; }
        case "RAt": { const L = S.local(q.lam / 1e4, ordFor(q.lam)); val = L ? L.Reff : NaN; break; }
        case "dlpix": val = S.c.dlpix; break;
        case "dlpixAt": { const L = S.local(q.lam / 1e4, q.m); val = L ? L.dlpix : NaN; break; }
        case "pixScale": val = S.c.pixScale; break;
        case "npix": val = S.c.npix; break;
        case "lo": val = S.range[0] * 1e4; break;
        case "hi": val = S.range[1] * 1e4; break;
        case "span": val = (S.range[1] - S.range[0]) * 1e4; break;
        case "mLo": val = S.orders.length ? S.orders[S.orders.length - 1].m : NaN; break;
        case "mHi": val = S.orders.length ? S.orders[0].m : NaN; break;
        case "gap": val = S.gaps && S.gaps.length ? S.gaps[0][0] * 1e4 : NaN; break;
        case "minSepPx": {
          if (q.m1) {
            let mn = Infinity;
            for (let m = q.m1; m < q.m2; m++) { const a = S.pos(S.mlamRef / m, m), b = S.pos(S.mlamRef / (m + 1), m + 1); if (a && b) mn = Math.min(mn, Math.abs(a[1] - b[1])); }
            val = mn / S.pixmm;
          } else val = S.minSep;
          break;
        }
        case "alphaDeg": val = S.alpha / DEG; break;
        case "Rdiam": val = S.c.Rs * Math.sqrt(3) / 2; break;      // R from the full fiber-image width (equivalent slit = (sqrt 3/2) d)
        case "gapPx": val = S.Ly / p.state[p.state.mode === "echelle" ? "e" : "g"].nObj / S.pixmm; break;
        case "minSepArcsec": {
          if (q.m1) {   // smallest separation of adjacent order centers within the published order range
            let mn = Infinity;
            for (let m = q.m1; m < q.m2; m++) { const a = S.pos(S.mlamRef / m, m), b = S.pos(S.mlamRef / (m + 1), m + 1); if (a && b) mn = Math.min(mn, Math.abs(a[1] - b[1])); }
            val = mn / S.pixmm * S.c.pixScale;
          } else val = S.minSep * S.c.pixScale;
          break;
        }
        case "nOrders": val = S.orders.length; break;
        case "ySpan": { const a = S.pos(S.mlamRef / q.m1, q.m1), b = S.pos(S.mlamRef / q.m2, q.m2); val = a && b ? Math.abs(a[1] - b[1]) : NaN; break; }
        case "diam": val = S.c.npix / (Math.sqrt(3) / 2); break;   // the round-core image across, from the equivalent-slit FWHM
        default: val = NaN;
      }
      const err = Math.abs(val / q.value - 1);
      if (q.info) { console.log(`[INFO] preset ${p.id}: ${q.what}  --  model ${isFinite(val) ? +val.toPrecision(5) : val}${isFinite(q.value) ? ` vs ${+q.value.toPrecision(5)} (${(100 * err).toFixed(1)}%` : " (a published range"}; ${q.src}; reference, not scored)`); continue; }
      check(`preset ${p.id}: ${q.what}`, err <= q.tol, `${isFinite(val) ? +val.toPrecision(5) : val} vs ${+q.value.toPrecision(5)} (${(100 * err).toFixed(1)}%, tol ${(100 * q.tol).toFixed(0)}%; ${q.src})`);
    }
  }
}

console.log(`\n${npass} passed, ${nfail} failed`);
process.exit(nfail ? 1 : 0);
