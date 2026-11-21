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
  // the effective R: the slit image and the diffraction limit in quadrature, with no pixel term (a measured line is
  // not widened by the pixel: McLean et al. 2012); the fitted-width R: a Gaussian fitted to a top-hat line spanning
  // 3 px or more has 0.841 of the line's width
  check("effective R = slit and diffraction in quadrature, no pixel term (n_pix = 2)", rel(Sn.c.Reff, 1 / Math.sqrt(1 / Sn.c.Rs ** 2 + 1 / Sn.c.Rd ** 2)) < 1e-12, Sn.c.Reff.toFixed(0));
  check("fitted-width R = (slit / 0.841) and diffraction in quadrature", rel(Sn.c.Rfit, 1 / Math.sqrt((0.841 / Sn.c.Rs) ** 2 + 1 / Sn.c.Rd ** 2)) < 1e-12 && Sn.c.Rfit / Sn.c.Reff > 1.18 && Sn.c.Rfit / Sn.c.Reff < 1.19, (Sn.c.Rfit / Sn.c.Reff).toFixed(4));
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
  check("first order: no order-sorting warning (the second-order warning was removed)", !C.flags.some(f => f.k === "ord"));
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

// ---------------------------------------------------------------- 3b. the grism as the main disperser
// Ruled: m G lam0 = (n - 1) sin A, and at lam0 the exit ray makes the angle A with the hypotenuse normal, so
// d(beta)/d(lambda) = (m G - sin A dn/dlambda) / cos A.  VPH (layer square to the beam between two prisms of
// apex A): m G lam0 = 2 n sin(A - t), sin t = sin A / n, straight through by symmetry.
{
  const g0 = { mode: "grating", feed: "slit", slitL: 0, D: 8.2, F: 13.6, slitW: 1, W: 90, fcam: 280, gType: "grism", m: 1, lamB: 5000, lamC: 5500, psi: 0, tAlpha: null, Nx: 4096, Ny: 4096, pix: 15 };
  const nn = (g, l) => IX.nGlass(g, l), dn = (g, l) => (nn(g, l + 1e-5) - nn(g, l - 1e-5)) / 2e-5;
  for (const [G, Adeg, glass] of [[300, 25, "silica"], [600, 30, "N-BK7"], [1200, 45, "N-BK7"]]) {
    const Gr = IX.design(Object.assign({}, g0, { G, gA: Adeg, gGlass: glass, gKind: "ruled" }));
    const A = Adeg * DEG, l0 = Gr.grism && Gr.grism.lam0;
    const res0 = l0 ? Math.abs(G / 1000 * l0 - (nn(glass, l0) - 1) * Math.sin(A)) : NaN;
    check(`ruled grism ${G}/mm, A = ${Adeg} deg, ${glass}: m G lam0 = (n - 1) sin A`, !Gr.bad && res0 < 1e-10, Gr.bad || `lam0 ${(l0 * 1e4).toFixed(2)} A`);
    const u = Gr.mainOut(l0, 1);
    check(`  ... lam0 leaves along the collimator axis`, Math.hypot(u[0], u[1]) < 1e-10, `${Math.hypot(u[0], u[1]).toExponential(1)}`);
    const dbdl = (G / 1000 - Math.sin(A) * dn(glass, l0)) / Math.cos(A);       // rad per um
    const want = 0.015 / (280 * dbdl) * 1e4;                                   // A per pixel at the center
    check(`  ... dispersion (m G - sin A dn/dlambda) / cos A`, rel(Gr.c.dlpix, want) < 1e-6, `${Gr.c.dlpix.toFixed(5)} vs ${want.toFixed(5)} A/px`);
  }
  for (const [G, Adeg, glass] of [[600, 20, "N-BK7"], [1200, 30, "silica"]]) {
    const Gr = IX.design(Object.assign({}, g0, { G, gA: Adeg, gGlass: glass, gKind: "vph" }));
    const A = Adeg * DEG, l0 = Gr.grism && Gr.grism.lam0, n0 = l0 && nn(glass, l0);
    const res0 = l0 ? Math.abs(G / 1000 * l0 - 2 * n0 * Math.sin(A - Math.asin(Math.sin(A) / n0))) : NaN;
    const u = !Gr.bad && Gr.mainOut(l0, 1);
    check(`VPH grism ${G}/mm, A = ${Adeg} deg, ${glass}: m G lam0 = 2 n sin(A - t), straight through`, !Gr.bad && res0 < 1e-10 && Math.hypot(u[0], u[1]) < 1e-10, Gr.bad || `lam0 ${(l0 * 1e4).toFixed(2)} A`);
  }
}

// ---------------------------------------------------------------- 3c. edge cases found by the 2026-10-17 audit
{
  const base = { mode: "grating", feed: "slit", slitL: 0, D: 6.5, F: 5, slitW: 1, W: 100, Fc: 1.6, fcam: null, gType: "trans", m: 1, lamB: 5000, lamC: 5500, psi: 35, tAlpha: null, Nx: 4096, Ny: 2048, pix: 15 };
  // coverage stops at the atmospheric cutoff (3200 A) and at 6 um (the M band's red end), never at an arbitrary search step
  for (const [G, Fc, W] of [[300, 1.6, 100], [30, 0.5, 100], [30, 0.5, 5]]) {
    const S = IX.design(Object.assign({}, base, { G, Fc, W }));
    const ok = !S.bad && S.range[0] >= 0.32 - 1e-9 && S.range[1] <= 6.0 + 1e-9 && S.range[0] < S.range[1];
    check(`coverage bounded by 3200 A and 6 um (${G}/mm, f/${Fc}, W ${W})`, ok, S.bad || `${(S.range[0] * 1e4).toFixed(0)}-${(S.range[1] * 1e4).toFixed(0)} A`);
  }
  // a slit narrower than its own diffraction lights the central lobe of its diffraction pattern, 2 f_col lambda / w
  // across, which sets the grooves lit (up to the ruled length); a seeing-limited slit keeps the beam
  {
    const p0 = Object.assign({}, base, { gType: "refl", G: 600, lamB: 22000, lamC: 22000, psi: 30, D: 8, F: 300, W: 10, fcam: 300, Nx: 4096, Ny: 4096 });
    const S1 = IX.design(Object.assign({}, p0, { slitW: 0.025 })), S2 = IX.design(Object.assign({}, p0, { slitW: 1 }));
    const w = 0.025 / RAD * 8000 * 300, lit = 2 * S1.fcol * 2.2e-3 / w;              // mm: the slit at the focus, the lobe on the collimator
    check("a diffraction-narrow slit lights its diffraction lobe (2 f_col lambda / w), a wide slit the beam", rel(S1.c.LgLit, S1.Lg * lit / 10) < 1e-9 && S2.c.fDif === 1 && rel(S2.c.LgLit, S2.Lg) < 1e-12,
      `lit ${S1.c.LgLit.toFixed(2)} mm (beam footprint ${S1.Lg.toFixed(2)}), fDif ${S1.c.fDif.toFixed(3)}; wide slit fDif ${S2.c.fDif}`);
    const S3c = IX.design(Object.assign({}, p0, { slitW: 0.025, gLen: 30 }));
    check("the lit length stops at the ruled length (gLen)", rel(S3c.c.LgLit, 30) < 1e-12, `${S3c.c.LgLit} mm`);
  }
  // the edge found is where the trace leaves the chip (or a limit), not a step past it
  {
    const S = IX.design(Object.assign({}, base, { G: 1200 }));
    const inside = S.onChip(S.pos(S.range[0] * 1.0001, 1)) && S.onChip(S.pos(S.range[1] * 0.9999, 1));
    const outside = !S.onChip(S.pos(S.range[0] * 0.999, 1)) && !S.onChip(S.pos(S.range[1] * 1.001, 1));
    check("coverage edges are where the trace crosses the chip edge", inside && outside, `${(S.range[0] * 1e4).toFixed(1)}-${(S.range[1] * 1e4).toFixed(1)} A`);
  }
  // overlapping orders are flagged (orders closer than one trace width), and not at the default
  const E0 = { mode: "echelle", feed: "slit", slitL: 0, D: 6.5, F: 5, slitW: 0.5, W: 150, Fc: 3, fcam: null, eG: 31.6, eDelta: 63.435, gamma: 1, theta: 0, xd: "grating", xG: 300, xPsi: 10, xGlass: "silica", xA: 40, xPasses: 1, lamC: 5500, Nx: 4096, Ny: 4096, pix: 15 };
  const Eok = IX.design(E0), Eov = IX.design(Object.assign({}, E0, { xG: 30, slitW: 3 }));
  check("echelle: orders closer than one trace width are flagged", !Eok.flags.some(f => f.k === "ovl") && Eov.flags.some(f => f.k === "ovl"), `min gap ${Eov.minSep.toFixed(1)} px`);
  // glasses have no index outside their data sheets' range
  const nan = [["SF6", 0.30], ["LF5", 0.20], ["N-BK7", 0.30], ["PBM2R", 0.30], ["BSL7Y", 1.2], ["F2", 0.33]].filter(([g, l]) => !isNaN(IX.nGlass(g, l)));
  check("glasses: no index outside the tabulated range", nan.length === 0, nan.map(x => x.join(" ")).join(", "));
  // SCHOTT F2 against the indices its data sheet tabulates (nC, nd, nF, ni, n2325.4)
  { const tab = [[0.6563, 1.61503], [0.5876, 1.62004], [0.4861, 1.63208], [0.3650, 1.66623], [2.3254, 1.58465]], dev = tab.map(([l, n]) => IX.nGlass("F2", l) - n);
    check("SCHOTT F2 reproduces its data-sheet indices to 2e-5", dev.every(d => Math.abs(d) < 2e-5), dev.map(d => d.toExponential(1)).join(" ")); }
  // grism: lam0 near a glass's range edge is found; a grism with no in-range solution is rejected, not approximated
  const g0 = Object.assign({}, base, { gType: "grism", fcam: 280, gKind: "ruled", m: 1 });
  const Gedge = IX.design(Object.assign({}, g0, { G: 30, gA: 8, gGlass: "N-BK7" }));
  check("grism: lam0 near the glass's red limit is found", !Gedge.bad && Math.abs(Gedge.grism.lam0 - 2.274) < 0.01, Gedge.bad || `${(Gedge.grism.lam0 * 1e4).toFixed(0)} A`);
  const Gbad = IX.design(Object.assign({}, g0, { G: 1200, gA: 30, gGlass: "N-BK7" }));
  check("grism: no solution inside the glass's range is rejected", !!Gbad.bad, Gbad.bad || `lam0 ${(Gbad.grism.lam0 * 1e4).toFixed(0)} A`);
  for (const [G, A, gl] of [[60, 54, "PBM2R"], [86, 9, "PBM2Y"], [300, 21, "FK5HTi"]]) {
    const Gx = IX.design(Object.assign({}, g0, { G, gA: A, gGlass: gl, gTilt: 7.5 }));
    const u = !Gx.bad && Gx.mainOut(Gx.grism.lam0, 1);
    check(`grism ${G}/mm A=${A} ${gl} (tilted 7.5 deg): rejected, or lam0 truly straight through`, !!Gx.bad || Math.hypot(u[0], u[1]) < 1e-9, Gx.bad || `${(Gx.grism.lam0 * 1e4).toFixed(0)} A`);
  }
  // a tilted ruled grism: the entrance face refracts the beam, which sets the lit length and the beam leaving it
  {
    const Gt = IX.design(Object.assign({}, g0, { G: 300, gA: 21, gGlass: "FK5HTi", gTilt: 7.5, W: 92.8 }));
    const e = 7.5 * DEG, A = 21 * DEG, n = Gt.grism.n0, ep = Math.asin(Math.sin(e) / n);
    const Lg = 92.8 * Math.cos(ep) / (Math.cos(e) * Math.cos(A - ep)), Wp = Lg * Math.cos(A - e);
    check("tilted grism: lit length W cos e'/(cos e cos(A - e')) and beam W' = Lg cos(A - e)", rel(Gt.Lg, Lg) < 1e-9 && rel(Gt.Wp, Wp) < 1e-9, `${Gt.Lg.toFixed(2)} / ${Gt.Wp.toFixed(2)} mm`);
  }
  // a prism spectrograph (gType "prism"): N identical prisms at minimum deviation for lambda_c turn the beam by
  // N (2i - A), sin i = n sin(A/2), keep its width, and give dtheta/dlambda = N 2 sin(A/2) / cos i |dn/dlambda| and the
  // diffraction limit R = b |dn/dlambda|, b = N 2 W sin(A/2) / cos i (the glass base); lambda_c lands at the center
  for (const [N, A, gl] of [[1, 60, "F2"], [3, 60, "F2"], [1, 45, "N-BK7"]]) {
    const Pp = { mode: "grating", D: 0.61, F: 16, feed: "slit", slitL: 0, slitW: 2, W: 50, Fc: 2.5, gType: "prism", gGlass: gl, pA: A, pN: N,
      G: 600, m: 1, lamB: 5000, psi: 30, lamC: 4500, Nx: 2000, Ny: 500, pix: 20 };
    const Sp = IX.design(Pp), l = 0.45, n = IX.nGlass(gl, l), dn = (IX.nGlass(gl, l + 1e-5) - IX.nGlass(gl, l - 1e-5)) / 2e-5;
    const a = A * DEG, i = Math.asin(n * Math.sin(a / 2)), b = N * 2 * 50 * Math.sin(a / 2) / Math.cos(i);
    const ok = !Sp.bad && rel(Sp.prism.dev, N * (2 * i - a)) < 1e-9 && rel(Sp.Wp, 50) < 1e-9 && rel(Sp.Lg, b) < 1e-9 && rel(Sp.c.Rd, b * 1000 * Math.abs(dn)) < 1e-4
      && rel(Sp.c.disp, Sp.fcam * N * 2 * Math.sin(a / 2) / Math.cos(i) * Math.abs(dn)) < 1e-4 && Math.abs(Sp.c.X) < 1e-9;
    check(`prism: ${N} x ${A} deg ${gl} at minimum deviation (deviation, width, base, R = b dn/dlambda, dispersion, lambda_c centered)`, ok,
      Sp.bad || `dev ${(Sp.prism.dev / DEG).toFixed(3)} deg, Rd ${Sp.c.Rd.toFixed(0)}`);
  }
  // an echelle order whose blaze center lies outside the prism glass's range is kept if part of it is on the chip
  {
    const Mk = IX.design({ mode: "echelle", feed: "slit", slitL: 0, D: 6.5, F: 500 / 150, slitW: 1, W: 150, fcam: 500, eG: 52.6, eDelta: 63.5, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10, xGlass: "PBM2Y", xA: 47, xPasses: 2, lamC: 10500, Nx: 4096, Ny: 2048, pix: 15 });
    check("echelle: an order with its blaze outside the prism glass's range is kept (MIKE red, order 30 at 10500 A)", Mk.orders.some(o => o.m === 30), Mk.orders.map(o => o.m).slice(0, 4).join(","));
  }
}

// ---------------------------------------------------------------- 4. instrument presets
// Each preset's published performance, reproduced by the trace from its sourced parameters.  The
// tolerances were set from the precision of each source before the comparison was run; misses are
// reported, not tuned away.  Lines marked info (circular, duplicated, unlike quantities, or misses)
// are printed as references and not scored; the q types are listed in the header of web/presets.js.
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
        case "Rnpix": val = S.c.lam * 1e4 / S.c.dlpix; break;   // R x sampling = lambda / (A per pixel), the dispersion (= Rs x npix)
        case "kmspx": val = 299792.458 * S.c.dlpix / (S.c.lam * 1e4); break;   // km/s per pixel at the central wavelength
        case "specScale": val = p.state[p.state.mode === "echelle" ? "e" : "g"].slitW / S.c.npix; break;   // arcsec per pixel along the dispersion
        case "pixScaleAt": { const L = S.local(q.lam / 1e4, q.m); val = L ? L.pixScale : NaN; break; }   // along the slit, at lam in order m
        case "ordSpan": { const o = S.orders.find(q2 => q2.m === q.m); val = o ? (o.hi - o.lo) * 1e4 : NaN; break; }
        case "ordLo": { const o = S.orders.find(q2 => q2.m === q.m); val = o ? o.lo * 1e4 : NaN; break; }   // order m's blue end on the chip
        case "ordHi": { const o = S.orders.find(q2 => q2.m === q.m); val = o ? o.hi * 1e4 : NaN; break; }   // and its red end
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
        case "devDeg": val = S.prism ? S.prism.dev / DEG : S.xdDev ? S.xdDev / DEG : NaN; break;   // a prism train's deviation of the central wavelength (main or cross-disperser)
        case "Rdiam": val = S.c.Rs * Math.sqrt(3) / 2; break;      // R from the full fiber-image width (equivalent slit = (sqrt 3/2) d)
        case "gapPx": { const m = p.state[p.state.mode === "echelle" ? "e" : "g"];   // fibers in groups: the pitch within a group
          val = Array.isArray(m.fgroups) ? m.fgroups[1] / 1000 / S.pixmm : S.Ly / m.nObj / S.pixmm; break; }
        case "minSepArcsec": {
          if (q.m1) {   // smallest separation of adjacent order centers within the published order range
            let mn = Infinity;
            for (let m = q.m1; m < q.m2; m++) { const a = S.pos(S.mlamRef / m, m), b = S.pos(S.mlamRef / (m + 1), m + 1); if (a && b) mn = Math.min(mn, Math.abs(a[1] - b[1])); }
            val = mn / S.pixmm * S.c.pixScale / Math.abs(S.c.sdir[1]);
          } else val = S.minSep * S.c.pixScale / Math.abs(S.c.sdir[1]);
          break;
        }
        case "nOrders": val = S.orders.length; break;
        case "lam0": val = S.grism ? S.grism.lam0 * 1e4 : NaN; break;
        case "ySpan": { const a = S.pos(S.mlamRef / q.m1, q.m1), b = S.pos(S.mlamRef / q.m2, q.m2); val = a && b ? Math.abs(a[1] - b[1]) : NaN; break; }
        case "diam": val = S.c.npix / (Math.sqrt(3) / 2); break;   // the round-core image across, from the equivalent-slit FWHM
        default: val = NaN;
      }
      const err = Math.abs(val / q.value - 1);
      if (q.info) { console.log(`[INFO] preset ${p.id}: ${q.what}  --  model ${isFinite(val) ? +val.toPrecision(5) : val}${isFinite(q.value) ? ` vs ${+q.value.toPrecision(5)} (${(100 * err).toFixed(1)}%` : " (a published range"}; ${q.src}; reference, not scored)`); continue; }
      check(`preset ${p.id}: ${q.what}`, err <= q.tol, `${isFinite(val) ? +val.toPrecision(5) : val} vs ${+q.value.toPrecision(5)} (${(100 * err).toFixed(1)}%, tol ${+(100 * q.tol).toPrecision(2)}%; ${q.src})`);
    }
  }
}

// ---- Mirror collimators: on the axis or off it.  Left unset, a mirror collimator is drawn with the automatic off-axis
// tilt; an on-axis collimator (the slit standing in the returning beam) needs colTilt 0, which the All-arms view also
// reads.  Every preset with a mirror collimator must be classified here from its sources, so that no preset takes the
// automatic tilt unchecked.  "off*" = inferred from the design type; "unverified" = the sources do not say.
{
  const PRESETS = require("./web/presets.js");
  const COL_AXIS = [
    [/^(hectospec|hectochelle)$/, "on", "Fabricant et al. 2005 (hardware manual); Szentgyorgyi et al. 2011"],
    [/^llamas/, "on", "LLAMAS pocket guide 2017 Sec. 3.3: \"simple on-axis f = 200mm sphere\""],
    [/^apogee$/, "on", "Wilson et al. 2019 Sec. 4: \"an on-axis uncorrected Schmidt camera for a collimator\""],
    [/^pfs/, "on", "Vives et al. 2012, 2014 Fig. 2; Pascal et al. 2014: Schmidt collimator with the central obscuration"],
    [/^desi/, "on", "DESI 2022 Sec. 7.1: \"reflected directly back toward the fiber slit array\""],
    [/^via$/, "on", "Via technical document, Zemax layout (the slit in the returning beam)"],
    [/^dbsp[br]$/, "on", "Oke & Gunn 1982 Sec. III.A and Fig. 1; Palomar DBSP overview Sec. 4.b: the light enters \"through holes in the collimator primaries\" (coaxial folded Cassegrain; data/round7/dbsp.md, INFERRED)"],
    [/^(boss|sdss)[br]$/, "on", "Smee et al. 2013: \"The slitplates are in the beam\" (a one-dimensional Schmidt collimator)"],
    [/^fast/, "off", "Fabricant et al. 1998 Sec. 3.4: an off-axis parabolic collimator, 8.5 deg off axis"],
    [/^medusa$/, "off", "Hubbard et al. 1979 p. 1075: the spectrograph's \"normal off-axis collimator mirror for an f/9 beam\"; Medusa used it \"in its normal configuration\" (Hill et al. 1980)"],
    [/^jwnirspec/, "off", "Jakobsen et al. 2022 Fig. 1 (the ray trace: nothing in the returning beam; INFERRED, his call 2026-11-18)"],
    [/^aao\d/, "on", "Sharp et al. 2006; Saunders et al. 2014, 2016: obstruction losses from the detector and spider in the beam (INFERRED, his call 2026-11-18; data/round12/aaomega.md)"],
    [/^virus$/, "on", "Hill et al. 2021 Fig. 8 caption: \"The slits of the IFU assembly protrude into slots in the fold mirrors, to minimize obstruction\""],
    [/^stis/, "off", "Woodgate et al. 1998 Sec. 3.2: \"the light is collimated by an off-axis elliptical mirror\""],
    [/^bc\d/, "off", "Angel, Hilliard & Weymann 1979 p. 90 (Fig. 1): \"off axis parabolic collimator\", \"off-axis 6-inch collimator\""],
    [/^kast[br]$/, "off", "Miller & Stone, Lick TR 66: \"The off-axis paraboloid is silvered and overcoated\" (red; the blue aluminized)"],
    [/^halecoude/, "off", "Bowen 1952 p. 5: \"a focal length of ... 30 feet is required for the off-axis mirror collimator\""],
    [/^mwcoude/, "off", "Adams 1941 p. 12: \"a concave collimating mirror corrected to operate off its axis\""],
    [/^crires/, "off", "Dorn et al. 2023 Fig. 2; Oliva et al. 2014 Fig. 2: the field stop and the 52 x 12 mm Spec-Flat1 stand beside the 200 mm beam of the TMA (data/round10/crires.md, INFERRED: no source says on- or off-axis)"],
    [/^sinfoni/, "off", "Eisenhauer et al. 2000 Sec. 2.4: \"The optics is operated 11.5\u00b0 off-axis\"; Gr\u00e4ff 2016: \"unobscured\""],
    [/^kmos/, "off", "ESO KMOS user manual Sec. 2.2.3: \"a single off-axis toroidal mirror\"; Tecza et al. 2006: tilted 4.5 deg to the incoming beam"],
    [/^hds/, "off", "HDS user manual Table 1: \"collimator red off-axis parabola blue off-axis parabola\""],
    [/^mods[br]$/, "off", "MODS PDR Sec. 2.4.3: \"a single reflection off a decentered paraboloidal surface\"; the Code V files: 342.65 mm off axis"],
    [/^kpf[gr]$/, "off", "Gibson et al. 2024 Table 1: \"Primary Collimator Off-axis paraboloid\", decenter 237 mm; Gibson et al. 2018: the off-axis angle increased from 7.5 to 8 deg"],
    [/^neid/, "off", "Schwab et al. 2020 Sec. 3: \"We use an off-axis portion of this mirror as OAP (off-axis parabola) collimator. The off-axis angle is 5 degrees in cross dispersion direction\""],
    [/^carmenes/, "off", "Seifert et al. 2012 Table 1: \"Off-axis collimator\", cut from a parent paraboloid of ~850 mm"],
    [/^hpf$/, "off", "Mahadevan et al. 2014 Sec. 3: \"a monolithic off-axis parabolic collimator\""],
    [/^nirspec/, "off", "McLean et al. 1998: \"an off-axis paraboloid mirror (called the OAPC) which acts as the collimator\", \"with no central obscurations\""],
    [/^tull/, "on", "Tull et al. 1995: a Cassegrain collimator, the slit in its primary's housing, a central occulting disk the size of its secondary (data/round8/tull.md, INFERRED)"],
    [/^lamost[br]$/, "on", "Cui et al. 2012 Fig. 30(b), to scale: the slit on the axis 800 mm before the concave mirror, the returning beam on the same axis (data/round8/lamost.md, MEASURED)"],
    [/^weave/, "off", "Jin et al. 2024 Sec. 2.3: \"an off-axis catadioptric f/3.1 collimator\""],
    [/^moons/, "on", "Oliva et al. 2014 Sec. 3: \"The collimator consists of a single spherical mirror working on-axis\""],
    [/^elodie$/, "off", "Baranne et al. 1996: \"the off-axis illumination of M1 and M2\" (separate collimator mirrors, Fig. 1)"],
    [/^hamilton/, "off", "Vogt 1987: \"The collimator is an off-axis parabolic mirror\"; the beam turned 11 deg"],
    [/^lris$/, "off", "Oke et al. 1995 Sec. 2: off-axis parabola"],
    [/^hires$/, "off", "Vogt et al. 1994: spherical, tilted 1.75 deg"],
    [/^mage$/, "off", "Marshall et al. 2008: off-axis paraboloid"],
    [/^fire$/, "off", "Simcoe et al. 2013 Sec. 3.2.2: off-axis paraboloid"],
    [/^esi$/, "off", "Sheinis et al. 2002; 1996 design report: used off axis"],
    [/^deimos$/, "off", "data/layout/deimos.md: the beam arrives 5.1 deg off the axis (tilt -2.8 deg)"],
    [/^gclef$/, "off", "Ben-Ami et al. 2016 Table 5: off-axis parabola"],
    [/^espresso/, "off", "Santana Tschudi et al. 2014 Table 1: off-axis parabola"],
    [/^uves/, "off", "UVES user manual Sec. 2.2.2: off-axis parabolas"],
    [/^xsh/, "off", "Vernet et al. 2011 Secs. 2.3-2.5: off-axis Maksutov-type collimators"],
    [/^feros$/, "off", "FEROS Final Design Report Sec. 3.4: off-axis paraboloids"],
    [/^4most/, "off", "Laurent et al. 2020, 2026 (LRS); Hansen et al. 2015 (HRS concept): off-axis Schmidt collimators"],
    [/^harps$/, "off", "Pepe et al. 2002: f/2.1 parabola in triple pass; HARPS User Manual 2.4 Fig. 2.1 draws the tilted mirror (a triple pass cannot be on the axis)"],
    [/^zsh/, "off*", "ZShooter optical-design page: parabolic collimator feeding a white-pupil relay"],
    [/^(kcwib|kcrm)$/, "off", "Morrissey et al. 2018 Sec. 2 and Fig. 8: the sphere used at a working angle that the cylindrical fold FM1 corrects; the 9.4 deg tilt MEASURED from Fig. 8"],
  ];
  for (const p of PRESETS) for (const k of ["g", "e"]) {
    const m = p.state && p.state[k];
    if (!m || m.col !== "mirror") continue;
    const row = COL_AXIS.find(([re]) => re.test(p.id)), on = m.colTilt === 0;
    if (!row) { check(`preset ${p.id}: mirror collimator on or off the axis`, false, "not classified: find the collimator's geometry in the sources and add the preset to COL_AXIS (colTilt 0 if on the axis)"); continue; }
    if (row[1] === "unverified") { console.log(`[INFO] preset ${p.id}: mirror collimator drawn off the axis, UNVERIFIED  --  ${row[2]}`); continue; }
    check(`preset ${p.id}: mirror collimator ${row[1] === "on" ? "on" : "off"} the axis`, on === (row[1] === "on"), `colTilt ${m.colTilt === undefined ? "auto" : m.colTilt}; ${row[2]}`);
  }
}

// ---------------------------------------------------------------- 5. a bench as designed (IX.planLayout; the 3D drawing)
// G-CLEF's bench (data/layout/gclef.md): the folded layout from the published numbers and the anchors measured from
// Ben-Ami et al. 2016 Fig. 1, traced through real mirrors.  The checks compare the layout with what the paper states
// or draws, the red arm's foci with the model's, and the drawn bundles with each element's clear aperture.
{
  const PRESETS = require("./web/presets.js");
  const p = PRESETS.find(q => q.id === "gclef"), PL = PRESETS.plans[p.state.e.plan];
  const P = Object.assign({ mode: "echelle", D: p.state.D, F: p.state.F, feed: "slit", slitL: 0 }, p.state.e);
  const L = IX.planLayout(PL, P), D = IX.design(P), DEGR = Math.PI / 180;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dist = (a, b) => Math.hypot(...sub(a, b));
  const dotp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const rot90 = v => [-v[2], v[1], v[0]];                  // a quarter turn in the bench plane
  check("plan gclef: laid out for the preset's state", !!L, L ? `reference order ${L.mR}, ${L.parts.length} elements, ${Object.keys(L.cams).length} cameras` : "planLayout returned null");
  check("plan gclef: no bench for another state (W = 250 mm)", IX.planLayout(PL, Object.assign({}, P, { W: 250 })) === null, "the schematic drawing takes over");
  if (L) {
    const part = k => L.parts.find(q => q.k === k), Mg = part("mangin"), M2 = part("parab"), Dc = part("dichroic"), gr = part("grism2"), red = L.cams.red, blue = L.cams.blue;
    const fz = L.f * Math.tan(2 * P.gamma * DEGR);
    check("plan gclef: the returning focus 2 gamma f from the fiber, toward the grating", Math.abs(L.Q0[2] + fz) < 1, `z = ${L.Q0[2].toFixed(2)} mm, 2 gamma f = ${fz.toFixed(2)} (Ben-Ami et al. 2016 Sec. 2.2: "the refocused beam clears the slit converging to a point in-between the fiber input and the grating")`);
    const dM2 = dist(M2.c, [PL.path[1].at[0], 0, PL.path[1].at[1]]);
    check("plan gclef: M2's face, 1600 mm from the folded focus, at the place Fig. 1 draws", dM2 < 25, `${dM2.toFixed(0)} mm from the measured face center`);
    check("plan gclef: the Mangin mirror at the place Fig. 1 draws", dist(Mg.c, [49.9, 0, -71.7]) < 25, `${dist(Mg.c, [49.9, 0, -71.7]).toFixed(0)} mm from the drawn box's center (40 mm before the focus, Sec. 2.2)`);
    const dR = dist(red.det, [-625, 0, 499]), dB = dist(blue.det, [1676, 0, 836]);
    check("plan gclef: the detectors at the places Fig. 1 draws", dR < 50 && dB < 50, `red ${dR.toFixed(0)} mm, blue ${dB.toFixed(0)} mm from the drawn positions, over a 3.5 m bench`);
    // the red arm's foci against the tracer's (the drawing maps the tracer's (X, Y) onto the plate, signs fitted)
    const ords = D.orders, acr = rot90(red.axis), refQ = L.chief(red.m, L.mlamB / red.m, "red", red.lam), o0 = ords[0], pq0 = D.pos(o0.lo, o0.m), q0 = sub(L.chief(o0.m, o0.lo, "red"), refQ);
    const sX = Math.sign(q0[1] * pq0[0]) || 1, sY = Math.sign(dotp(q0, acr) * pq0[1]) || 1;
    let mis = 0, nmis = 0;
    for (const o of ords) for (const l of [o.lo, Math.min(o.hi, Math.max(o.lo, o.lb)), o.hi]) {
      const pq = D.pos(l, o.m), q = L.chief(o.m, l, "red");
      if (!pq || !q) continue;
      const d = sub(q, refQ); mis = Math.max(mis, Math.hypot(d[1] - sX * pq[0], dotp(d, acr) - sY * pq[1])); nmis++;
    }
    check("plan gclef: the red arm's foci agree with the model's", nmis > 0 && mis < 2, `largest difference ${mis.toFixed(2)} mm over ${nmis} points on the ${(D.Lx).toFixed(1)} mm detector (the VPH's 3.25 deg fringe tilt, which the model leaves out)`);
    // the blue grism and format
    const bl = blue.range, mlo = Math.ceil(L.mlamB / bl[1]), mhi = Math.floor(L.mlamB / bl[0]);
    let across = [Infinity, -Infinity], off = 0;
    const acrB = rot90(blue.axis);
    const fsr = (lb, m, lo, hi) => [Math.max(lo, lb * (1 - 0.5 / m)), Math.min(hi, Math.max(lo, lb)), Math.min(hi, lb * (1 + 0.5 / m))];
    for (let m = mlo; m <= mhi; m++) { const lb = L.mlamB / m; for (const l of fsr(lb, m, bl[0], bl[1])) {
      const q = L.chief(m, l, "blue"); if (!q) { off++; continue; }
      const d = sub(q, blue.det), a = dotp(d, acrB); across = [Math.min(across[0], a), Math.max(across[1], a)];
      if (Math.abs(a) > 1.02 * D.Ly / 2 || Math.abs(d[1]) > 1.02 * D.Lx / 2) off++;
    } }
    // (within 2% of the chip's half-width: the grism's orientation is inferred, and the reddest order's 5400 A end lies at
    // the dichroic's 540 nm transition; the paper gives the format on a 95.04 mm STA chip as well as the 92.4 mm e2v one)
    check("plan gclef: the blue grism's orders fill the detector (its prisms set to pass 4386 A undeviated)", off === 0 && across[1] - across[0] > 0.85 * D.Ly, `orders ${mlo}-${mhi} span ${across[0].toFixed(1)} to ${across[1].toFixed(1)} mm across a ${D.Ly.toFixed(1)} mm chip (95.04 mm on the STA chip), ${off} points more than 2% past its edge; VPH plane ${(gr.pv / DEGR).toFixed(2)} deg from square to the beam`);
    // the camera prescriptions: each lens has a positive edge and clears the next at the rim (R > 0 convex as seen from outside)
    const sagR = (R, h) => Math.abs(R) - Math.sqrt(R * R - h * h);
    let worstEdge = Infinity, worstGap = Infinity;
    for (const c of [PL.path[2].transmit[1], PL.path[2].reflect[1]]) c.lenses.forEach(([R1, R2, t, air, ca1, ca2], i) => {
      const r = Math.max(ca1, ca2) / 2, zF = (R1 > 0 ? 1 : -1) * sagR(R1, r), zB = t - (R2 > 0 ? 1 : -1) * sagR(R2, r);
      worstEdge = Math.min(worstEdge, zB - zF);
      const nx = c.lenses[i + 1];
      if (nx) { const rr = Math.min(r, Math.max(nx[4], nx[5]) / 2); worstGap = Math.min(worstGap, air - (R2 > 0 ? -1 : 1) * sagR(R2, rr) + (nx[0] > 0 ? 1 : -1) * sagR(nx[0], rr)); }
    });
    check("plan gclef: the camera lenses (Tables 7-8) have positive edges and clear one another", worstEdge > 0 && worstGap > 0, `thinnest edge ${worstEdge.toFixed(1)} mm, smallest gap at a rim ${worstGap.toFixed(1)} mm`);
    // the drawn bundles (each order's free spectral range, within the chip and the arm's band) inside the clear apertures
    // of M1, the Mangin mirror, M2, the dichroic and each camera's first lens
    const inCA = (pts, c, n, w, h) => { const u = [-n[2], 0, n[0]], uu = Math.hypot(...u); return Math.max(...pts.map(q => Math.max(Math.abs(dotp(sub(q, c), u)) / uu / (w / 2), Math.abs(q[1] - c[1]) / (h / 2)))); };
    let worst = { M1: 0, Mangin: 0, M2: 0, dichroic: 0, "red camera": 0, "blue camera": 0 };
    const bundles = [...ords.flatMap(o => fsr(o.lb, o.m, o.lo, o.hi).map(l => [o.m, l, "red"])), ...Array.from({ length: mhi - mlo + 1 }, (_, k) => mlo + k).flatMap(m => fsr(L.mlamB / m, m, bl[0], bl[1]).map(l => [m, l, "blue"]))];
    for (const [m, l, arm] of bundles) {
      const t = L.trace(m, l, arm); if (!t) continue;
      const st = t.st, cam = L.cams[arm], c0 = arm === "red" ? PL.path[2].transmit[1] : PL.path[2].reflect[1], ca = Math.max(c0.lenses[0][4], c0.lenses[0][5]);
      worst.M1 = Math.max(worst.M1, inCA(st[1], L.M1.at, L.M1.n, PL.m1.w, PL.m1.h));
      worst.Mangin = Math.max(worst.Mangin, inCA(st[2], Mg.c, Mg.n, Mg.w, Mg.h));
      worst.M2 = Math.max(worst.M2, inCA(st[4], M2.c, M2.n, M2.w, M2.h));
      worst.dichroic = Math.max(worst.dichroic, inCA(st[5], Dc.c, Dc.n, Dc.w, Dc.h));
      const rl = Math.max(...st[st.length - 2].map(q => Math.hypot(...sub(sub(q, cam.L1), [0, 0, 0].map((_, i) => cam.axis[i] * dotp(sub(q, cam.L1), cam.axis))))));
      worst[arm + " camera"] = Math.max(worst[arm + " camera"], rl / (ca / 2));
    }
    // (a 5% margin: the anchors measured from Fig. 1 to +-25 mm move a footprint by up to 5% of M2's half-aperture)
    const wmax = Math.max(...Object.values(worst));
    check("plan gclef: each order's free spectral range inside the clear apertures", wmax <= 1.05, Object.entries(worst).map(([k, v]) => `${k} ${(100 * v).toFixed(0)}%`).join(", ") + " of the half-aperture at the widest");
  }
}

// FEROS's bench (data/layout/feros.md): the poses DERIVED from the Zemax prescription of the Final Design Report (App. A),
// so the checks compare the traced layout with that prescription, the model's foci, the camera's prescription and the
// clear apertures (as above for G-CLEF)
{
  const PRESETS = require("./web/presets.js");
  const p = PRESETS.find(q => q.id === "feros"), PL = PRESETS.plans[p.state.e.plan];
  const P = Object.assign({ mode: "echelle", D: p.state.D, F: p.state.F, feed: "slit", slitL: 0 }, p.state.e);
  const L = IX.planLayout(PL, P), D = IX.design(P), DEGR = Math.PI / 180;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dotp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const d2 = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]);       // in the bench plane
  check("plan feros: laid out for the preset's state", !!L, L ? `reference order ${L.mR}, ${L.parts.length} elements` : "planLayout returned null");
  if (L) {
    const cam = L.cams.main, TC = L.parts.find(q => q.k === "parab"), fl = L.parts.find(q => q.k === "flat");
    // the second pass on M1: the echelle's gamma sends the returning light 2 gamma farther from the axis (Zemax surface 16: 205.9 mm)
    const r2 = L.trace(L.mR, L.mlamB / L.mR, "main").st[1], z2 = r2.reduce((s, q) => s + q[2], 0) / r2.length;
    check("plan feros: M1's second zone where the prescription puts it", Math.abs(z2 - 205.9) < 3, `${z2.toFixed(1)} mm from the axis (surface 16's aperture: 205.9 mm; the first pass 170.3 mm)`);
    check("plan feros: the transfer collimator's zone where the prescription puts it", d2(TC.c, [1700, 0, -142.5]) < 6, `${d2(TC.c, [1700, 0, -142.5]).toFixed(1)} mm from surface 18's aperture center (vertex 200 mm behind M1's, zone 142.5 mm on the other side)`);
    const ang = Math.atan2(cam.axis[2], cam.axis[0]) / DEGR + 360;
    check("plan feros: the camera where the prescription puts it", d2(cam.L1, [158.3, 0, -307.4]) < 3 && Math.abs(ang - 221.1) < 0.3 && d2(cam.det, [-297.8, 0, -705.3]) < 3,
      `first vertex ${d2(cam.L1, [158.3, 0, -307.4]).toFixed(1)} mm, axis ${(ang - 221.1).toFixed(2)} deg, CCD ${d2(cam.det, [-297.8, 0, -705.3]).toFixed(1)} mm from surfaces 24 and IMA`);
    // the model's foci: the model enters the prism as an effective 56 deg, the drawing traces the design's 55 deg
    const acr = [-cam.axis[2], 0, cam.axis[0]], refQ = L.chief(cam.m, L.mlamB / cam.m, "main", cam.lam), o0 = D.orders[0], pq0 = D.pos(o0.lo, o0.m), q0 = sub(L.chief(o0.m, o0.lo, "main"), refQ);
    const sX = Math.sign(q0[1] * pq0[0]) || 1, sY = Math.sign(dotp(q0, acr) * pq0[1]) || 1;
    let mis = 0, nmis = 0, rel = 0;
    for (const o of D.orders) for (const l of [o.lo, o.lb, o.hi]) {
      const pq = D.pos(l, o.m), q = L.chief(o.m, l, "main"); if (!pq || !q) continue;
      const d = sub(q, refQ), ex = d[1] - sX * pq[0], ey = dotp(d, acr) - sY * pq[1];
      mis = Math.max(mis, Math.hypot(ex, ey)); if (Math.abs(pq[1]) > 10) rel = Math.max(rel, Math.abs(dotp(d, acr) / (sY * pq[1]) - 1)); nmis++;
    }
    check("plan feros: the traced foci agree with the model's", nmis > 0 && mis < 1.5, `largest difference ${mis.toFixed(2)} mm over ${nmis} points; the cross-dispersion ${(100 * rel).toFixed(1)}% smaller, the design's 55 deg prism against the model's effective 56 deg (the as-built format)`);
    // the camera prescription (App. A): positive edges, and gaps at the rims (the cemented pairs at zero)
    const sagR = (R, h) => Math.abs(R) > 1e8 ? 0 : Math.abs(R) - Math.sqrt(R * R - h * h);
    const cl = PL.path[3].lenses;
    let worstEdge = Infinity, worstGap = Infinity;
    cl.forEach(([R1, R2, t, air, ca1, ca2], i) => {
      const r = Math.max(ca1, ca2) / 2, zF = (R1 > 0 ? 1 : -1) * sagR(R1, r), zB = t - (R2 > 0 ? 1 : -1) * sagR(R2, r);
      worstEdge = Math.min(worstEdge, zB - zF);
      const nx = cl[i + 1];
      if (nx) { const rr = Math.min(r, Math.max(nx[4], nx[5]) / 2); worstGap = Math.min(worstGap, air - (R2 > 0 ? -1 : 1) * sagR(R2, rr) + (nx[0] > 0 ? 1 : -1) * sagR(nx[0], rr)); }
    });
    check("plan feros: the camera lenses (App. A) have positive edges and clear one another", worstEdge > 0 && worstGap > -0.01, `thinnest edge ${worstEdge.toFixed(1)} mm, smallest gap at a rim ${worstGap.toFixed(2)} mm (the cemented pairs PSK3/FK54 and LAK16A/silica at zero)`);
    // the drawn bundles over each order's free spectral range inside the clear apertures
    const inCA = (pts, c, n, w, h) => { const u = [-n[2], 0, n[0]], uu = Math.hypot(...u); return Math.max(...pts.map(q => Math.max(Math.abs(dotp(sub(q, c), u)) / uu / (w / 2), Math.abs(q[1] - c[1]) / (h / 2)))); };
    const fsr = (lb, m, lo, hi) => [Math.max(lo, lb * (1 - 0.5 / m)), Math.min(hi, Math.max(lo, lb)), Math.min(hi, lb * (1 + 0.5 / m))];
    const worst = { "main collimator": 0, flat: 0, "transfer collimator": 0, camera: 0 };
    for (const o of D.orders) for (const l of fsr(o.lb, o.m, o.lo, o.hi)) {
      const t = L.trace(o.m, l, "main"); if (!t) continue;
      const st = t.st;
      worst["main collimator"] = Math.max(worst["main collimator"], inCA(st[1], L.M1.at, L.M1.n, PL.m1.w, PL.m1.h));
      worst.flat = Math.max(worst.flat, inCA(st[2], fl.c, fl.n, fl.w, fl.h));
      worst["transfer collimator"] = Math.max(worst["transfer collimator"], inCA(st[4], TC.c, TC.n, TC.w, TC.h));
      const rl = Math.max(...st[st.length - 2].map(q => { const v = sub(q, cam.L1), a = dotp(v, cam.axis); return Math.hypot(v[0] - a * cam.axis[0], v[1] - a * cam.axis[1], v[2] - a * cam.axis[2]); }));
      worst.camera = Math.max(worst.camera, rl / (cl[0][4] / 2));
    }
    // (the camera reported, not scored: at the chip's long edges the R2 echelle widens the returning beam by cos(beta)/cos(alpha)
    // ~ 1.14, and 250 mm past the white pupil at the prism's entrance the bundle overfills the first lens's 77.5 mm Zemax radius;
    // the report gives a 155 mm entrance aperture, Kaufer & Pasquini 1998 a 178 mm clear aperture)
    const wcam = worst.camera; delete worst.camera;
    const wmax = Math.max(...Object.values(worst));
    check("plan feros: each order's free spectral range inside the mirrors' clear apertures", wmax <= 1.05, Object.entries(worst).map(([k, v]) => `${k} ${(100 * v).toFixed(0)}%`).join(", ") + " of the half-aperture at the widest");
    console.log(`[INFO] plan feros: the camera's first lens  --  the chip's long edges at ${(100 * wcam).toFixed(0)}% of the 77.5 mm Zemax radius (${(100 * wcam * 77.5 / 89).toFixed(0)}% of the 178 mm clear aperture of Kaufer & Pasquini 1998): the ideal trace vignettes there`);
  }
}

// The benches MEASURED from published figures (data/layout/*.md): the same checks for each.  pos: [name, the layout's point,
// the figure's [x, z] (mm, the bench frame), tolerance]; angle: the camera's axis in the figure (deg from M1's axis,
// reported); misfit: the largest difference allowed between the traced foci and the model's.
// (xdScale: the bench's cross-disperser is the published one and the model's an equivalent, and the bench's transfer
// magnifies the angles at the cross-disperser; the traced foci are compared after fitting the model's spread across the
// orders with a scale and an order curvature, which are reported)
// (caInfo: mirrors whose fill is reported, not scored, with the reason)
function benchChecks(id, { pos = [], angle = null, misfit = 1, note = "", xdScale = false, caInfo = null }) {
  const PRESETS = require("./web/presets.js");
  const p = PRESETS.find(q => q.id === id), PL = PRESETS.plans[p.state.e.plan];
  const P = Object.assign({ mode: "echelle", D: p.state.D, F: p.state.F, feed: "slit", slitL: 0 }, p.state.e);
  const L = IX.planLayout(PL, P), D = IX.design(P), DEGR = Math.PI / 180;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dotp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const d2 = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]);
  check(`plan ${id}: laid out for the preset's state`, !!L, L ? `reference order ${L.mR}, ${L.parts.length} elements` : "planLayout returned null");
  if (!L) return;
  const cam = Object.values(L.cams).find(c => c.model), camSpec = (function find(list) { for (const e of list) { if (e.k === "camera" && e.model) return e; for (const b of ["transmit", "reflect"]) if (e[b]) { const r = find(e[b]); if (r) return r; } } return null; })(PL.path);
  for (const [name, get, xz, tol] of pos) {
    const q = get(L), d = d2(q, [xz[0], 0, xz[1]]);
    check(`plan ${id}: ${name} where the figure draws it`, d < tol, `${d.toFixed(0)} mm from the figure's position (tolerance ${tol} mm, the measurement's)`);
  }
  if (angle !== null) {
    const a = Math.atan2(cam.axis[2], cam.axis[0]) / DEGR;
    console.log(`[INFO] plan ${id}: the camera's axis  --  ${a.toFixed(1)} deg from M1's axis; the figure shows ${angle} deg${note ? " (" + note + ")" : ""}`);
  }
  // the model's foci, from the tracer's origin (the echelle's blaze direction in the reference order, cross-dispersed as the central wavelength)
  const acr = [-cam.axis[2], 0, cam.axis[0]], refQ = L.chief(cam.m, L.mlamB / cam.m, cam.id, cam.lam), o0 = D.orders[0], pq0 = D.pos(o0.lo, o0.m), q0 = sub(L.chief(o0.m, o0.lo, cam.id), refQ);
  const sX = Math.sign(q0[1] * pq0[0]) || 1, sY = Math.sign(dotp(q0, acr) * pq0[1]) || 1;
  const pts = [];
  for (const o of D.orders) for (const l of [o.lo, o.lb, o.hi]) {
    const pq = D.pos(l, o.m), q = L.chief(o.m, l, cam.id); if (!pq || !q) continue;
    const d = sub(q, refQ); pts.push([d[1] - sX * pq[0], dotp(d, acr), sY * pq[1], pq[0]]);
  }
  // (the across-order offset fitted as (k - 1) Y + c X^2, X along the orders and Y across; least squares, 2 x 2)
  let kx = 1, cx = 0;
  if (xdScale) {
    const a11 = pts.reduce((s, p) => s + p[2] * p[2], 0), a12 = pts.reduce((s, p) => s + p[2] * p[3] * p[3], 0), a22 = pts.reduce((s, p) => s + p[3] ** 4, 0);
    const b1 = pts.reduce((s, p) => s + p[2] * p[1], 0), b2 = pts.reduce((s, p) => s + p[3] * p[3] * (p[1] - p[2]), 0), b1r = b1 - a11, det = a11 * a22 - a12 * a12;
    const km1 = (b1r * a22 - b2 * a12) / det; cx = (a11 * b2 - a12 * b1r) / det; kx = 1 + km1;
  }
  const mis = Math.max(...pts.map(p => Math.hypot(p[0], p[1] - kx * p[2] - cx * p[3] * p[3]))), nmis = pts.length;
  if (xdScale) console.log(`[INFO] plan ${id}: the published cross-disperser  --  spreads the orders ${kx.toFixed(4)} times as far as the model's equivalent one, and the bench curves each order ${(cx * D.Lx * D.Lx / 4).toFixed(1)} mm more at the chip's ends (the transfer doubles the angles at the cross-disperser); unfitted, the foci differ by up to ${Math.max(...pts.map(p => Math.hypot(p[0], p[1] - p[2]))).toFixed(2)} mm`);
  check(`plan ${id}: the traced foci agree with the model's${xdScale ? " (the spread and curvature across the orders fitted)" : ""}`, nmis > 0 && mis < misfit, `largest difference ${mis.toFixed(2)} mm over ${nmis} points`);
  // the camera prescription: positive edges, and gaps at the rims (a cemented pair at zero)
  const sagR = (R, h) => Math.abs(R) > 1e8 ? 0 : Math.abs(R) - Math.sqrt(R * R - h * h), cl = camSpec.lenses;
  let worstEdge = Infinity, worstGap = Infinity;
  cl.forEach(([R1, R2, t, air, ca1, ca2], i) => {
    const r = Math.max(ca1, ca2) / 2, zF = (R1 > 0 ? 1 : -1) * sagR(R1, r), zB = t - (R2 > 0 ? 1 : -1) * sagR(R2, r);
    worstEdge = Math.min(worstEdge, zB - zF);
    const nx = cl[i + 1];
    if (nx) { const rr = Math.min(r, Math.max(nx[4], nx[5]) / 2); worstGap = Math.min(worstGap, air - (R2 > 0 ? -1 : 1) * sagR(R2, rr) + (nx[0] > 0 ? 1 : -1) * sagR(nx[0], rr)); }
  });
  check(`plan ${id}: the camera lenses have positive edges and clear one another`, worstEdge > 0 && worstGap > -0.01, `thinnest edge ${worstEdge.toFixed(1)} mm, smallest gap at a rim ${worstGap.toFixed(2)} mm`);
  // each order's free spectral range inside the mirrors' clear apertures (the camera's first lens reported)
  const inCA = (pts, c, n, w, h) => { const u = [-n[2], 0, n[0]], uu = Math.hypot(...u); return Math.max(...pts.map(q => Math.max(Math.abs(dotp(sub(q, c), u)) / uu / (w / 2), Math.abs(q[1] - c[1]) / (h / 2)))); };
  const fsr = (lb, m, lo, hi) => [Math.max(lo, lb * (1 - 0.5 / m)), Math.min(hi, Math.max(lo, lb)), Math.min(hi, lb * (1 + 0.5 / m))];
  const worst = {}; let wcam = 0;
  for (const o of D.orders) for (const l of fsr(o.lb, o.m, o.lo, o.hi)) {
    const t = L.trace(o.m, l, cam.id); if (!t) continue;
    for (const h of t.hits) {
      if (!h.part) { worst.M1 = Math.max(worst.M1 || 0, inCA(h.ring, L.M1.at, L.M1.n, PL.m1.w, PL.m1.h)); continue; }
      if (h.part === cam) { const r = Math.max(...h.ring.map(q => { const v = sub(q, cam.L1), a = dotp(v, cam.axis); return Math.hypot(v[0] - a * cam.axis[0], v[1] - a * cam.axis[1], v[2] - a * cam.axis[2]); })); wcam = Math.max(wcam, r / (Math.max(cl[0][4], cl[0][5]) / 2)); continue; }
      if (!h.part.w || !h.part.h || !["flat", "mangin", "field", "parab", "dichroic", "grating"].includes(h.part.k)) continue;
      const nm = h.part.label || h.part.k; worst[nm] = Math.max(worst[nm] || 0, inCA(h.ring, h.part.c, h.part.n, h.part.w, h.part.h));
    }
  }
  const info = caInfo ? Object.entries(worst).filter(([k]) => caInfo.names.includes(k)) : [];
  for (const [k] of info) delete worst[k];
  const wmax = Math.max(...Object.values(worst));
  check(`plan ${id}: each order's free spectral range inside the mirrors' clear apertures`, wmax <= 1.05, Object.entries(worst).map(([k, v]) => `${k} ${(100 * v).toFixed(0)}%`).join(", ") + " of the half-aperture at the widest");
  if (info.length) console.log(`[INFO] plan ${id}: ${info.map(([k, v]) => `the ${k} filled to ${(100 * v).toFixed(0)}%`).join(", ")} of the half-aperture  --  ${caInfo.why}`);
  console.log(`[INFO] plan ${id}: the camera's first lens  --  the bundles reach ${(100 * wcam).toFixed(0)}% of its clear radius`);
}
// UVES (data/layout/uves.md): blue from the ESO ray trace (2.94 mm per pixel), red from Dekker et al. Fig. 4 (1.953 mm per pixel)
benchChecks("uvesb", { pos: [["the transfer collimator's footprint", L => L.parts.find(q => q.k === "parab").c, [1796, 259], 35],
                             ["the cross-disperser", L => L.parts.find(q => q.k === "grating").c, [-306, 197], 35]],
                       angle: 45.3, note: "the pipeline's cdbeam, 46.0 deg from the arriving beam, is drawn" });
benchChecks("uvesr", { pos: [["the transfer collimator's footprint", L => L.parts.find(q => q.k === "parab").c, [1803, -227], 60],
                             ["the cross-disperser", L => L.parts.find(q => q.k === "grating").c, [-369, -215], 60]],
                       angle: -40.8, note: "the pipeline's cdbeam, 45.336 deg from the arriving beam, is drawn" });
// HARPS (data/layout/harps.md): the HARPS3 ray trace of the HARPS-N copy, 3.48 mm per pixel (turned 180 deg); the camera schematic
// (the figure is an oblique render, so the detector, 930 mm along the camera, is reported, not scored)
benchChecks("harps", { pos: [["the flat fold", L => L.parts.find(q => q.k === "flat").c, [0, 70], 45],
                             ["the grism", L => L.parts.find(q => q.k === "grism").c, [0, -191], 45]], angle: -180 });
{
  const PRESETS = require("./web/presets.js"), p = PRESETS.find(q => q.id === "harps");
  const L = IX.planLayout(PRESETS.plans.harps, Object.assign({ mode: "echelle", D: p.state.D, F: p.state.F, feed: "slit", slitL: 0 }, p.state.e));
  const d = L && L.cams.main.det;
  if (d) console.log(`[INFO] plan harps: the detector  --  at (${d[0].toFixed(0)}, ${d[2].toFixed(0)}) mm; the figure shows it near (-929, -157), ${Math.hypot(d[0] + 929, d[2] + 157).toFixed(0)} mm away: the third pass leaves the collimator 1.4 deg off its axis, the flat lying 2 gamma f from its focus`);
}
// ESPRESSO (data/layout/espresso.md): Spano et al. 2012 Fig. 2 at 2.176 mm per pixel; the cross-dispersers the published gratings on the
// as-built prisms, at the Bragg angle
for (const [id, ang] of [["espressob", 131.6], ["espressor", 139.5]])
  benchChecks(id, { pos: [["the red transfer mirror", L => L.parts.find(q => q.label === "red transfer mirror").c, [1593, 185], 30],
                          ["the blue transfer mirror", L => L.parts.find(q => q.label === "blue transfer mirror").c, [2894, 159], 30]],
                    angle: ang, note: "the published gratings on the as-built prisms at the Bragg angle turn the beam 56 deg (blue) and 48 deg (red); the 2012 figure, drawn with FK5 prisms, shows 47 and 41 deg", xdScale: true,
                    // (the order curvature grows with the wavelength, which one curvature term does not follow: 1.4 mm at the chip's corner, in order 162)
                    misfit: 1.5,
                    caInfo: { names: ["blue transfer mirror", "red transfer mirror"], why: "along the dispersion, at the reddest order; the field lens's and field mirror's power, which turns the chief rays toward the white pupil, is not traced" } });
{
  const PRESETS = require("./web/presets.js"), p = PRESETS.find(q => q.id === "espressob");
  const L = IX.planLayout(PRESETS.plans.espressob, Object.assign({ mode: "echelle", D: p.state.D, F: p.state.F, feed: "slit", slitL: 0 }, p.state.e));
  if (L) {
    const fig = { blue: [[2091, 269], [1625, 790]], red: [[762, 261], [252, 696]] }, dd = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[1]).toFixed(0);
    check("plan espressob: the intermediate focus 2 gamma f beside the slit, as the figure draws it", Math.abs(Math.hypot(L.Q0[0], L.Q0[2]) - 120) < 10, `${Math.hypot(L.Q0[0], L.Q0[2]).toFixed(0)} mm (the figure: 120 mm)`);
    for (const k of ["blue", "red"]) { const c = L.cams[k]; console.log(`[INFO] plan espressob: the ${k} camera  --  the first lens ${dd(c.L1, fig[k][0])} mm and the detector ${dd(c.det, fig[k][1])} mm from the figure's (the camera's axis turned as above)`); }
    const g = L.parts.filter(q => q.k === "grism2").map(q => `${q.label.split(" ")[0]} ${(Math.acos(Math.abs(IX.dot(q.b, q.n1))) / DEG).toFixed(1)} deg`);
    console.log(`[INFO] plan espressob: the grisms' entrance faces  --  met at ${g.join(", ")} (the prisms widen the beam 1.5 times, Spano et al. Table 1)`);
  }
}

console.log(`\n${npass} passed, ${nfail} failed`);
process.exit(nfail ? 1 : 0);
