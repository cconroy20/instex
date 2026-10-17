/* Spectrograph optics for the Instrument Explorer.  No drawing here.

   Units: lengths in mm, wavelengths in micrometers internally (Angstrom at the page), groove
   densities in lines per micrometer internally (lines per mm at the page), angles in radians
   internally (arcsec on the sky, degrees for instrument angles, at the page).

   Model.  Ideal (aberration-free) collimator and camera, plane dispersers, in the notation of
   the Via notes "Notes on Spectrograph Design" (via/docs/spectro_design):
     D telescope aperture, F_tel its focal ratio, W the collimated beam diameter,
     phi the slit (or fiber core) width on the sky, eta = F_tel / F_out the focal-ratio
     degradation of a fiber, N the number of image slices.
   A point on the (pseudo-)slit at (xi, zeta) mm leaves the collimator (focal length
   f_col = W F_tel / eta, beam-matched) as a plane wave traveling along
       u = normalize(c + (xi / f_col) e_x + (zeta / f_col) e_y),
   which is the optical invariant theta_g = eta phi D / W of the notes.  Each disperser surface
   changes the direction by the vector grating equation (tangential components)
       n2 u2_t = n1 u1_t + m lambda G_vec,
   with |u2| = 1 fixing the normal component: kept on the same side for refraction and
   transmission, reversed for reflection.  For an in-plane ray this is
   m lambda / sigma = sin(alpha) + sin(beta).  A prism is two refracting faces, a grism a prism
   whose exit face carries a transmission grating.  The camera is an ideal f tan(theta) lens:
       (X, Y) = f_cam (u.x_c, u.y_c) / (u.z_c)
   about the axis z_c, the direction of the reference ray (the central wavelength at the slit
   center).  Every output -- dispersion, resolving power, sampling, pixel scale, coverage, the
   echelle format -- is measured by tracing rays.  The closed forms of the notes are checked
   against these traces in validate.js.
*/
(function (root) {
"use strict";

const RAD = 206264.80624709636;           // arcsec per radian
const DEG = Math.PI / 180;

// ------------------------------------------------------------------ vectors
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => Math.hypot(a[0], a[1], a[2]);
const unit = a => mul(a, 1 / norm(a));
const perp = (a, u) => sub(a, mul(u, dot(a, u)));          // component of a normal to unit u

// One plane surface.  u: unit direction of travel; nrm: unit normal (either sign);
// gvec: grating vector in the surface plane (lines per micrometer, along the groove normal),
// or null; mlam: order times wavelength (micrometers); n1, n2: refractive indices before and
// after; reflect: true for a mirror or reflection grating.  Returns the new direction, or null
// when the wave is evanescent (no propagating order).
function surface(u, nrm, gvec, mlam, n1, n2, reflect) {
  const un = dot(u, nrm);
  let t = mul(sub(u, mul(nrm, un)), n1);
  if (gvec) t = add(t, mul(gvec, mlam));
  t = mul(t, 1 / n2);
  const t2 = dot(t, t);
  if (t2 >= 1) return null;
  const s = (reflect ? -1 : 1) * (un >= 0 ? 1 : -1);
  return add(t, mul(nrm, s * Math.sqrt(1 - t2)));
}

// ------------------------------------------------------------------ glass
// Sellmeier coefficients n^2 - 1 = sum B_i lam^2 / (lam^2 - C_i), lam in micrometers, C_i in
// micrometers^2.  Sources, with quotes, in data/presets_research.md (glass sections); the documents
// are in rawdata/presets/glass/ and glass2/.  range: wavelengths the formula is valid for (SCHOTT:
// "from the near UV to 2.3 um"; OHARA PBM 2Y: 326-1129 nm with these constants; CHARMS fits and
// Malitson as fitted; PBM 2R not stated).
const GLASS = {
  // Malitson 1965, JOSA 55, 1205 (publisher's abstract): fused silica, 20 C, 0.21-3.71 um
  silica: { label: "fused silica", range: [0.21, 3.71], B: [0.6961663, 0.4079426, 0.8974794], C: [0.0684043 ** 2, 0.1162414 ** 2, 9.896161 ** 2] },
  // SCHOTT datasheets (N-BK7 as of 01-Dec-2023; N-FK5 and FK5HTi from the optical glass collection)
  "N-BK7": { label: "N-BK7", range: [0, 2.3], B: [1.03961212, 0.231792344, 1.01046945], C: [0.006000699, 0.0200179144, 103.560653] },
  "N-FK5": { label: "N-FK5", range: [0, 2.3], B: [0.844309338, 0.344147824, 0.910790213], C: [0.00475112, 0.0149814849, 97.8600293] },
  FK5HTi: { label: "FK5HTi (FK5)", range: [0, 2.3], B: [0.90936218, 0.279077054, 0.891813298], C: [0.005201425, 0.0158938446, 95.9109448] },
  // OHARA datasheets (OHARA 25-04); PBM 2Y valid 326-1129 nm with these constants
  PBM2Y: { label: "PBM 2Y (PBM2)", range: [0.326, 1.129], B: [1.39446503, 0.159230985, 0.245470216], C: [0.0110571872, 0.0507194882, 31.4440142] },
  PBM2R: { label: "PBM 2R", B: [1.34139422, 0.21318551, 0.983288016], C: [0.00980301669, 0.0470587088, 117.45827] },
  // SCHOTT SF6 datasheet (as of 01-Dec-2023): the X-Shooter VIS prism
  // OHARA BSL7Y (ESI's cross-disperser prisms), OHARA data sheet 10/2018; the coefficients reproduce the sheet's
  // indices to 5e-6 from 0.326 to 1.129 um and drift beyond 1.5 um, so the range stops at the sheet's 1.129 um
  BSL7Y: { label: "BSL7Y (OHARA)", range: [0.32, 1.13], B: [1.13329383, 0.136897201, 0.703456004], C: [0.00669407868, 0.023739176, 70.7030316] },
  // OHARA S-LAL7 (LDSS-3 VPH-Blue and VPH-Red grism prisms), OHARA formula (same form), catalogue range 365-2325 nm
  "S-LAL7": { label: "S-LAL7 (OHARA)", range: [0.365, 2.325], B: [0.916121247, 0.765948319, 1.27745023], C: [0.00395889743, 0.0167547425, 110.762706] },
  // SCHOTT LF5 and N-BAK2 (FORS2 grisms 300I and 150I), SCHOTT data sheets
  LF5: { label: "LF5", range: [0, 2.3], B: [1.28035628, 0.163505973, 0.893930112], C: [0.009298544, 0.0449135769, 110.493685] },
  "N-BAK2": { label: "N-BAK2", range: [0, 2.3], B: [1.01662154, 0.319903051, 0.937232995], C: [0.005923838, 0.0203828415, 113.118417] },
  SF6: { label: "SF6", range: [0, 2.3], B: [1.72448482, 0.390104889, 1.04572858], C: [0.013487195, 0.0569318095, 118.557185] },
  // NASA CHARMS temperature-dependent Sellmeier fits, evaluated at 105 K (the X-Shooter NIR optics):
  // Infrasil 301 (Leviton, Frey & Madison 2008, Table 10; 0.5-3.6 um), ZnSe (Leviton, Frey & Kvamme 2005,
  // Table 13; 0.55-5.6 um).  B_i = S_i(105 K), C_i = lambda_i(105 K)^2; n(1 um) = 1.44972 and 2.47697.
  "Infrasil-105K": { label: "Infrasil 301 at 105 K", range: [0.50, 3.6], B: [0.107564209, 0.994487421, 0.885481151], C: [4.23631939e-06, 0.00880726271, 97.1509408] },
  "ZnSe-105K": { label: "ZnSe at 105 K", range: [0.55, 5.6], B: [4.42987482, 0.445970784, 2.55574186], C: [0.0398515278, 0.14716685, 2020.75143] },
};
// Outside the range over which a formula was fitted (from its source) the index is undefined: rays
// at those wavelengths do not reach the detector, rather than being traced through an extrapolation.
function nGlass(name, lam) {
  const g = GLASS[name];
  if (!g) return NaN;
  if (g.range && (lam < g.range[0] || lam > g.range[1])) return NaN;
  const l2 = lam * lam;
  let s = 1;
  for (let i = 0; i < g.B.length; i++) s += g.B[i] * l2 / (l2 - g.C[i]);
  return Math.sqrt(s);
}

// ------------------------------------------------------------------ helpers
const sinc2 = v => { if (Math.abs(v) < 1e-9) return 1; const s = Math.sin(v) / v; return s * s; };

// Bisection for f(x) = 0 on [a, b] with f(a), f(b) of opposite sign.
function bisect(f, a, b, fa, fb, tol) {
  if (fa === undefined) fa = f(a);
  if (fb === undefined) fb = f(b);
  for (let k = 0; k < 80 && Math.abs(b - a) > tol; k++) {
    const c = 0.5 * (a + b), fc = f(c);
    if (!isFinite(fc)) { b = c; continue; }
    if ((fc < 0) === (fa < 0)) { a = c; fa = fc; } else { b = c; fb = fc; }
  }
  return 0.5 * (a + b);
}

// ------------------------------------------------------------------ the instrument
/* P (the page's parameters):
     mode   'grating' | 'echelle'
     D (m), F
     feed   'slit' | 'fiber' | 'dl'      slitW, slitL (arcsec); core (um), eta, nFib; slices N
     W (mm), Fc (camera focal ratio on the diffracted beam) or fcam (mm, takes precedence)
     grating mode: gType 'refl' | 'trans' | 'grism', G (l/mm), m, gA (deg, grism apex), gGlass, gKind 'ruled' | 'vph', gTilt (deg, ruled: entrance-face tilt), lamB (A, Littrow blaze wavelength in
                   order m), lamC (A), psi (deg, camera-collimator angle; reflection only),
                   tAlpha (deg, optional: fixed incidence on a transmission grating; else symmetric)
     echelle mode: eG (l/mm), eDelta (deg), gamma (deg), theta (deg, in-plane offset),
                   xd 'grating' | 'vph' | 'prism' | 'grism', xG (l/mm), xPsi (deg), xGlass, xA (deg),
                   xPasses, lamC (A)
     Nx, Ny, pix (um)                      detector, Nx along the dispersion                */
function design(P) {
  const S = { P, flags: [] };
  const flag = (k, txt) => S.flags.push({ k, txt });
  let lamC = P.lamC / 1e4;                         // um (a grism replaces it with its undeviated wavelength)

  // ---- telescope and entrance
  const Dmm = P.D * 1000, ftel = P.F * Dmm;
  S.ftel = ftel;
  S.plate = RAD / ftel;                            // arcsec per mm at the focus
  const slices = P.feed === "dl" ? 1 : Math.max(1, Math.round(P.N || 1));
  let eta = 1, phi;                                // phi: input aperture width on the sky (arcsec)
  if (P.feed === "fiber") { phi = P.core * 1e-3 / ftel * RAD; eta = Math.max(1, P.eta); }
  else if (P.feed === "dl") phi = lamC * 1e-3 / Dmm * RAD;
  else phi = P.slitW;
  S.eta = eta; S.phi = phi; S.slices = slices;
  S.phiEff = phi / slices;
  // pseudo-slit at the spectrograph entrance (mm): width and length
  const wSlit = lam => (P.feed === "dl" ? lam * 1e-3 / Dmm : phi / RAD) * ftel / slices;
  S.wS = wSlit(lamC);
  S.slitFocus = phi / RAD * ftel;                  // mm, before slicing
  if (P.feed === "fiber") {
    const core = P.core * 1e-3, nF = Math.max(1, Math.round(P.nFib || 1));
    S.pitch = 2 * core;
    S.Lps = slices * (core + (nF - 1) * S.pitch);
  } else {
    S.Lps = slices * P.slitL / RAD * ftel;
  }

  // ---- collimator
  S.Fcol = P.F / eta;
  S.fcol = S.Fcol * P.W;
  S.thetaG = S.wS / S.fcol;                        // angle of the (sliced) slit width in the beam

  // ---- main disperser: grooves along y, normal in the x-z plane
  const W = P.W;
  let alpha, betaRef, Gm, mlamRef, delta = null, reflect = true, order;
  const ghat = [0, 1, 0];
  if (P.mode === "echelle") {
    Gm = P.eG / 1000;
    delta = P.eDelta * DEG;
    const th = (P.theta || 0) * DEG, gam = (P.gamma || 0) * DEG;
    alpha = delta + th; betaRef = delta - th;
    mlamRef = Math.cos(gam) * (Math.sin(alpha) + Math.sin(betaRef)) / Gm;     // m lambda at the blaze center
    S.gamma = gam;
  } else {
    Gm = P.G / 1000; order = Math.max(1, Math.round(P.m || 1));
    const x = order * Gm * lamC;
    if (P.gType === "grism") {
      // A grism: the camera sits on the collimator axis, so the wavelength at the detector center is the
      // undeviated one, fixed by the grism.  Ruled: a prism of apex A entered square to the beam, the grating on
      // the hypotenuse, m G lam0 = (n - 1) sin A.  VPH: the grating layer square to the beam between two prisms
      // of apex A whose outer faces refract the beam to the Bragg angle and back, m G lam0 = 2 n sin(A - asin(sin A / n)).
      reflect = false;
      // a ruled grism's entrance face may be tilted by eps in the dispersion plane (FORS: 7.5 deg), turning the
      // ruled face to (A - eps) from the axis: m G lam0 = n sin(A - eps') - sin(A - eps), sin eps' = sin eps / n
      const A = (P.gA || 0) * DEG, vph = P.gKind === "vph", eps = vph ? 0 : (P.gTilt || 0) * DEG;
      const f = l => {
        const n = nGlass(P.gGlass, l);
        return (vph ? 2 * n * Math.sin(A - Math.asin(Math.sin(A) / n)) : n * Math.sin(A - Math.asin(Math.sin(eps) / n)) - Math.sin(A - eps)) / (order * Gm);
      };
      let l0 = 0.6;
      for (let k = 0; k < 60; k++) { const l1 = f(l0); if (!isFinite(l1) || l1 <= 0) { l0 = NaN; break; } if (Math.abs(l1 - l0) < 1e-12) { l0 = l1; break; } l0 = l1; }
      if (!(l0 > 0) || !isFinite(nGlass(P.gGlass, l0))) { S.bad = "This grism passes no wavelength straight through inside the glass's valid range."; return S; }
      lamC = l0;
      const n0 = nGlass(P.gGlass, l0), tt = Math.asin(Math.sin(A) / n0);
      S.grism = { A, vph, eps, n0, lam0: l0, inner: vph ? A - tt : A };
      alpha = A; betaRef = A;
      S.psi = 0;
    } else if (P.gType === "trans") {
      reflect = false;
      if (P.tAlpha !== null && P.tAlpha !== undefined && isFinite(P.tAlpha)) {
        // a fixed angle of incidence (presets: an as-built transmission spectrograph); beta follows lamC
        alpha = P.tAlpha * DEG;
        const sb = x - Math.sin(alpha);
        if (Math.abs(sb) >= 1) { S.bad = "No order " + order + " at this wavelength for this angle of incidence."; return S; }
        betaRef = Math.asin(sb);
      } else {
        if (x / 2 >= 1) { S.bad = "No order " + order + " at this wavelength: the grating is too finely ruled."; return S; }
        alpha = Math.asin(x / 2); betaRef = alpha;                           // symmetric (Littrow/Bragg) for lamC
      }
      S.psi = alpha + betaRef;
    } else {
      const psi = P.psi * DEG, q = x / (2 * Math.cos(psi / 2));
      if (q >= 1) { S.bad = "The grating cannot send λc into the camera at this camera–collimator angle (the grating equation has no solution)."; return S; }
      const t = Math.asin(q);
      alpha = t + psi / 2; betaRef = t - psi / 2;
      S.psi = psi;
      const xb = order * Gm * (P.lamB / 1e4) / 2;
      delta = xb < 1 ? Math.asin(xb) : null;
    }
    mlamRef = order * lamC;
    S.gamma = 0;
  }
  if (!(alpha < Math.PI / 2 - 1e-6) || !(Math.abs(betaRef) < Math.PI / 2 - 1e-6)) {
    S.bad = "The grating would have to be lit or viewed at more than 90° from its normal: lower the camera–collimator angle or the groove density.";
    return S;
  }
  let nhat = [Math.sin(alpha), 0, -Math.cos(alpha)];
  let shat = [-Math.cos(alpha), 0, -Math.sin(alpha)];
  let gvec = mul(shat, Gm);
  const gam = S.gamma;
  // collimated beam axis (out of the dispersion plane by gamma for an echelle)
  const cAx = [0, -Math.sin(gam), Math.cos(gam)];
  const ey = unit(perp(ghat, cAx));                // along the slit (parallel to the grooves)
  const ex = cross(ey, cAx);                       // across the slit
  S.alpha = alpha; S.beta = betaRef; S.delta = delta; S.reflect = reflect;
  S.Gm = Gm; S.mlamRef = mlamRef; S.order = order;

  let main = (u, mlam) => surface(u, nhat, gvec, mlam, 1, 1, reflect);
  if (S.grism) {
    // the grism's surfaces in turn; the glass index follows the wavelength (order fixed in grating mode)
    const A = S.grism.A, gl = P.gGlass;
    if (!S.grism.vph) {
      const e = S.grism.eps, ent = [-Math.sin(e), 0, Math.cos(e)];             // the entrance face, tilted by eps
      nhat = [Math.sin(A - e), 0, Math.cos(A - e)];             // the ruled hypotenuse, facing out of the glass
      shat = [Math.cos(A - e), 0, -Math.sin(A - e)];
      gvec = mul(shat, Gm);
      main = (u, mlam) => {
        const n = nGlass(gl, mlam / order), v = surface(u, ent, null, 0, 1, n, false);
        return v && surface(v, nhat, gvec, mlam, n, 1, false);
      };
    } else {
      const f1 = [-Math.sin(A), 0, Math.cos(A)], f3 = [Math.sin(A), 0, Math.cos(A)];
      nhat = [0, 0, 1]; shat = [1, 0, 0]; gvec = mul(shat, Gm);  // the VPH layer, square to the beam
      main = (u, mlam) => {
        const n = nGlass(gl, mlam / order);
        let v = surface(u, f1, null, 0, 1, n, false);
        v = v && surface(v, nhat, gvec, mlam, n, n, false);
        return v && surface(v, f3, null, 0, n, 1, false);
      };
    }
  }
  const inDir = (xi, zeta) => unit(add(cAx, add(mul(ex, xi / S.fcol), mul(ey, zeta / S.fcol))));

  // ---- cross-disperser (echelle mode): its dispersion plane holds the reference ray and the
  // direction normal to the echelle dispersion; set for the central wavelength lamC
  let xdStages = [];
  const u1ref = main(cAx, mlamRef);
  if (!u1ref) { S.bad = "No propagating order at the blaze."; return S; }
  if (P.mode === "echelle") {
    const h = mlamRef * 1e-6;
    const d1 = unit(perp(sub(main(cAx, mlamRef + h), main(cAx, mlamRef - h)), u1ref));
    let r = u1ref, b = unit(cross(u1ref, d1));
    if (P.xd === "prism" || P.xd === "grism") {
      const nC = nGlass(P.xGlass, lamC);
      if (!isFinite(nC)) { S.bad = "No refractive index for the glass '" + P.xGlass + "'."; return S; }
    }
    if (P.xd === "grating") {
      const Gx = P.xG / 1000, psi = (P.xPsi || 0) * DEG, q = Gx * lamC / (2 * Math.cos(psi / 2));
      if (q >= 1) { S.bad = "The cross-disperser grating is too finely ruled for λc."; return S; }
      const t = Math.asin(q), ax = t + psi / 2, a = mul(r, -1);
      const nx = add(mul(a, Math.cos(ax)), mul(b, Math.sin(ax)));
      const sx = sub(mul(a, Math.sin(ax)), mul(b, Math.cos(ax)));
      xdStages.push({ kind: "grating", nrm: nx, g: mul(sx, Gx) });
      S.xdAlpha = ax; S.xdBeta = t - psi / 2;
    } else if (P.xd === "prism") {
      // a train of prisms (presets may give one, e.g. X-Shooter NIR: Infrasil + 2 ZnSe in double pass),
      // or N passes through one prism; each set at minimum deviation for lamC, bending the same way
      const train = Array.isArray(P.xPrisms) && P.xPrisms.length ? P.xPrisms
        : Array(Math.max(1, Math.round(P.xPasses || 1))).fill({ glass: P.xGlass, A: P.xA });
      for (const pr of train) {
        const A = pr.A * DEG, nC = nGlass(pr.glass, lamC);
        if (!isFinite(nC)) { S.bad = "No refractive index for the glass '" + pr.glass + "'."; return S; }
        const sA = nC * Math.sin(A / 2);
        if (sA >= 1) { S.bad = "The prism apex is too large for this glass (total internal reflection)."; return S; }
        const i = Math.asin(sA);
        const m1 = add(mul(r, Math.cos(i)), mul(b, Math.sin(i)));
        const m2 = add(mul(r, Math.cos(i - A)), mul(b, Math.sin(i - A)));
        xdStages.push({ kind: "face", nrm: m1, from: 1, to: pr.glass });
        xdStages.push({ kind: "face", nrm: m2, from: pr.glass, to: 1 });
        const rr = traceXd(r, lamC, xdStages.slice(-2));
        b = unit(perp(b, rr)); r = rr;
      }
      S.xdDev = Math.acos(Math.min(1, dot(r, u1ref)));
    } else if (P.xd === "vph") {
      // a transmission (VPH) grating in first order, at the symmetric (Bragg) setting for lamC
      const Gx = P.xG / 1000, q = Gx * lamC / 2;
      if (q >= 1) { S.bad = "The cross-disperser grating is too finely ruled for λc."; return S; }
      const ax = Math.asin(q);
      const nx = sub(mul(r, Math.cos(ax)), mul(b, Math.sin(ax)));        // grating normal, the beam at ax to it
      const sx = add(mul(r, Math.sin(ax)), mul(b, Math.cos(ax)));        // in the surface, normal to the grooves
      xdStages.push({ kind: "tgrating", nrm: nx, g: mul(sx, -Gx) });
      S.xdAlpha = ax;
    } else if (P.xd === "grism") {
      const Gx = P.xG / 1000, nC = nGlass(P.xGlass, lamC), sA = Gx * lamC / (nC - 1);
      if (sA >= 1) { S.bad = "The grism ruling is too fine for this glass at λc."; return S; }
      const A = Math.asin(sA);
      const m2 = add(mul(r, Math.cos(A)), mul(b, Math.sin(A)));
      const s2 = sub(mul(r, Math.sin(A)), mul(b, Math.cos(A)));
      xdStages.push({ kind: "face", nrm: r, from: 1, to: P.xGlass });
      xdStages.push({ kind: "gface", nrm: m2, g: mul(s2, -Gx), from: P.xGlass, to: 1 });
      S.xdApex = A;
    }
  }
  function traceXd(u, lam, stages) {
    for (const st of stages) {
      if (!u) return null;
      if (st.kind === "grating") u = surface(u, st.nrm, st.g, lam, 1, 1, true);
      else if (st.kind === "tgrating") u = surface(u, st.nrm, st.g, lam, 1, 1, false);
      else {
        const n1 = st.from === 1 ? 1 : nGlass(st.from, lam), n2 = st.to === 1 ? 1 : nGlass(st.to, lam);
        u = surface(u, st.nrm, st.g || null, st.g ? lam : 0, n1, n2, false);
      }
    }
    return u;
  }
  // full trace: wavelength lam (um), order m, slit position (xi, zeta) in mm -> direction
  const dirOut = (lam, m, xi, zeta) => {
    const u = main(inDir(xi, zeta), m * lam);
    return u && xdStages.length ? traceXd(u, lam, xdStages) : u;
  };

  // ---- camera frame
  let zc, mRef = order;
  if (P.mode === "echelle") {
    mRef = Math.max(1, Math.round(mlamRef / lamC));
    // axis: the echelle blaze direction, cross-dispersed as lamC
    zc = xdStages.length ? traceXd(u1ref, lamC, xdStages) : u1ref;
  } else zc = dirOut(lamC, order, 0, 0);
  if (!zc) { S.bad = "The reference ray does not reach the camera."; return S; }
  S.mRef = mRef;
  const hh = lamC * 1e-6;
  let xc;
  if (P.mode === "echelle") {
    const a = traceXd(main(cAx, mlamRef + mlamRef * 1e-6), lamC, xdStages), b2 = traceXd(main(cAx, mlamRef - mlamRef * 1e-6), lamC, xdStages);
    xc = unit(perp(sub(a, b2), zc));
  } else xc = unit(perp(sub(dirOut(lamC + hh, order, 0, 0), dirOut(lamC - hh, order, 0, 0)), zc));
  let yc = unit(cross(zc, xc));
  // orientation: echelle -- redder orders up; grating -- +zeta (slit top) up
  if (P.mode === "echelle") {
    const ua = traceXd(u1ref, lamC * 1.001, xdStages), ub = traceXd(u1ref, lamC * 0.999, xdStages);
    if (ua && ub && dot(sub(ua, ub), yc) < 0) yc = mul(yc, -1);
  } else {
    const ua = dirOut(lamC, order, 0, 1e-3), ub = dirOut(lamC, order, 0, -1e-3);
    if (ua && ub && dot(sub(ua, ub), yc) < 0) yc = mul(yc, -1);
  }
  S.zc = zc; S.xc = xc; S.yc = yc;
  // camera focal length: given directly (presets, the notes' checks), or as a focal ratio on the
  // diffracted beam, f_cam = Fc W' -- set below, once W' is known, before any position is computed
  let fcam = P.fcam > 0 ? P.fcam : NaN;
  const proj = u => {
    if (!u) return null;
    const z = dot(u, zc);
    if (!(z >= 0.05)) return null;                // also NaN: a ray outside a glass's valid range
    return [fcam * dot(u, xc) / z, fcam * dot(u, yc) / z];
  };
  const pos = (lam, m, xi = 0, zeta = 0) => proj(dirOut(lam, m, xi, zeta));
  S.pos = pos;
  S.dirOut = dirOut;
  S.mainOut = (lam, m) => main(inDir(0, 0), m * lam);   // after the main disperser only
  S.nhat = nhat; S.cAx = cAx;

  // ---- detector
  const pix = P.pix * 1e-3;                        // mm
  const Lx = P.Nx * pix, Ly = P.Ny * pix;
  S.pixmm = pix; S.Lx = Lx; S.Ly = Ly;

  // ---- grating footprint, camera beam, diffraction limit
  const cn = Math.abs(dot(cAx, nhat)), cg = dot(cAx, ghat);
  S.Lg = W * Math.sqrt(1 - cg * cg) / cn;          // illuminated length along the groove normal
  const uo = u1ref, on = Math.abs(dot(uo, nhat)), og = dot(uo, ghat);
  S.Wp = S.Lg * on / Math.sqrt(1 - og * og);       // diffracted beam width in the dispersion plane
  if (S.grism) {
    // straight through at lam0, the grism leaves the beam width unchanged; a VPH grism's layer is lit over the
    // refracted beam width (W cos t / cos A, t the refraction angle at the first face) spread by 1 / cos(A - t)
    S.Wp = W;
    if (S.grism.vph) { const tt = S.grism.A - S.grism.inner; S.Lg = W * Math.cos(tt) / Math.cos(S.grism.A) / Math.cos(S.grism.inner); }
  }
  if (!(fcam > 0)) fcam = P.Fc * S.Wp;
  S.fcam = fcam;
  S.Fcam = fcam / S.Wp;
  S.camField = Math.atan(Math.hypot(Lx, Ly) / 2 / fcam);
  S.anam = S.Wp / W;

  // ---- local quantities at (lam, m): dispersion, sampling, resolving power, pixel scale
  const lsfFac = P.feed === "fiber" ? Math.sqrt(3) / 2 : 1;   // FWHM of a uniformly lit round core = (sqrt 3 / 2) d
  S.lsfFac = lsfFac;
  function local(lam, m) {
    const p0 = pos(lam, m), h = lam * 1e-6;
    const pp = pos(lam + h, m), pm = pos(lam - h, m);
    if (!p0 || !pp || !pm) return null;
    const dv = [(pp[0] - pm[0]) / (2 * h), (pp[1] - pm[1]) / (2 * h)];       // mm per um
    const disp = Math.hypot(dv[0], dv[1]), dl = [dv[0] / disp, dv[1] / disp];
    // the monochromatic slit image: a band along the slit direction s, its width set by the
    // slit edges.  A wavelength change resolves when it moves the band by its own width, both
    // measured normal to s, so tilted orders and tilted lines are handled alike.
    const ws = wSlit(lam), dz0 = 1e-3;
    const ea = pos(lam, m, ws / 2, 0), eb = pos(lam, m, -ws / 2, 0);
    const za = pos(lam, m, 0, dz0), zb = pos(lam, m, 0, -dz0);
    if (!ea || !eb || !za || !zb) return null;
    const sv = [za[0] - zb[0], za[1] - zb[1]], sn = Math.hypot(sv[0], sv[1]), s = [sv[0] / sn, sv[1] / sn];
    const crs = (a, b) => Math.abs(a[0] * b[1] - a[1] * b[0]);
    const ev = [ea[0] - eb[0], ea[1] - eb[1]];
    const dlamBox = crs(ev, s) / crs(dv, s);                                  // um, slit-width box
    const dlamS = lsfFac * dlamBox;
    const Rs = lam / dlamS;
    const w = dlamBox * Math.abs(dv[0]);                                      // box width along X (mm)
    const fw = lsfFac * w;
    const npix = fw / pix;
    const Rp = npix * Rs;
    const RdN = Math.abs(m) * (Gm * 1000) * S.Lg;                             // m N_grooves (Lg in mm)
    const Reff = 1 / Math.sqrt(1 / (Rs * Rs) + 1 / (RdN * RdN) + 1 / (Rp * Rp));
    // spatial scale along the slit: mm on the detector per arcsec on the sky
    const mmPerMmSlit = sn / (2 * dz0);
    const mmPerArcsec = mmPerMmSlit * ftel / RAD;
    // relative blaze efficiency (scalar theory, facets fully lit)
    let eff = null;
    if (reflect && delta !== null) {
      const ui = inDir(0, 0), uo2 = main(ui, m * lam);
      const sinA = -dot(ui, shat) / Math.sqrt(1 - dot(ui, ghat) ** 2);
      const sinB = dot(uo2, shat) / Math.sqrt(1 - dot(uo2, ghat) ** 2);
      const cg2 = Math.sqrt(1 - dot(ui, ghat) ** 2);
      const a = Math.asin(sinA), bb = Math.asin(sinB);
      const nu = Math.PI / Gm * cg2 * Math.cos(delta) / lam * (Math.sin(a - delta) + Math.sin(bb - delta));
      eff = sinc2(nu);
    }
    return {
      lam, m, X: p0[0], Y: p0[1], disp, dirl: dl, sdir: s,
      dlpix: pix / Math.abs(dv[0]) * 1e4,          // A per pixel along X
      w, fw, npix, Rs, Rd: RdN, Rp, Reff,
      dlamRes: lam / Reff * 1e4,                   // A per resolution element (effective)
      dv: 299792.458 / Reff,                       // km/s
      pixScale: pix / mmPerArcsec,                 // arcsec per pixel along the slit
      slitPix: S.Lps * mmPerMmSlit / pix,          // slit length on the detector (pixels)
      eff
    };
  }
  S.local = local;

  const onChip = p => p && Math.abs(p[0]) <= Lx / 2 && Math.abs(p[1]) <= Ly / 2;
  S.onChip = onChip;

  // ---- wavelength range on the detector for one order (slit center)
  const LAM_MIN = 0.30, LAM_MAX = 2.60, ATMO = 0.32;   // um; ATMO: atmospheric cutoff
  function orderRange(m, lamGuess) {
    // walk outward from lamGuess (on the chip) in both directions until off the chip, then refine
    const loc = local(lamGuess, m);
    if (!loc) return null;
    const half = 1.15 * (Lx / 2 + Math.abs(loc.X)) / loc.disp;                // um, generous
    const out = [];
    for (const dir of [-1, 1]) {
      let a = lamGuess, n = 64, edge = null;
      for (let k = 1; k <= n; k++) {
        const b = lamGuess + dir * half * k / (n / 2);
        if (b < LAM_MIN * 0.5 || b > LAM_MAX * 1.5) { edge = b; break; }
        if (!onChip(pos(b, m))) {
          edge = bisect(l => (onChip(pos(l, m)) ? -1 : 1), a, b, -1, 1, lamGuess * 1e-9);
          break;
        }
        a = b;
      }
      out.push(edge === null ? a : edge);
    }
    return [Math.min(out[0], out[1]), Math.max(out[0], out[1])];
  }

  // ---- results at the central wavelength
  if (P.mode === "echelle") {
    S.c = local(lamC, mRef);
  } else {
    S.c = local(lamC, order);
  }
  if (!S.c) { S.bad = "The central wavelength does not reach the detector."; return S; }

  if (P.mode === "grating") {
    const r = orderRange(order, lamC);
    S.range = r;
    S.lo = local(r[0], order); S.hi = local(r[1], order);
    S.orders = [{ m: order, lo: r[0], hi: r[1] }];
    // overlap with neighboring orders (order-sorting filter); first order carries no warning (second-order light
    // removed at Charlie's request, 2026-10-17)
    if (order > 1) flag("ord", "orders " + (order - 1) + " and " + (order + 1) + " overlap: needs a filter");
    if (S.c.slitPix > P.Ny) flag("long", "slit longer than the detector");
  } else {
    // ---- echelle format
    const K = mlamRef;                             // m lambda at the blaze center
    const mLo = Math.max(1, Math.ceil(K / LAM_MAX)), mHi = Math.floor(K / LAM_MIN);
    const orders = [];
    for (let m = mLo; m <= mHi; m++) {
      const lb = K / m;
      const p = pos(lb, m);
      if (!p || Math.abs(p[1]) > Ly / 2 + 0.02 * Ly) continue;
      // the blaze center may lie just off the chip in Y while part of the order is on it;
      // find an on-chip starting point along the order
      let start = onChip(p) ? lb : null;
      if (start === null) {
        for (const f of [-0.3, 0.3, -0.15, 0.15]) { const l = lb * (1 + f / m); if (onChip(pos(l, m))) { start = l; break; } }
      }
      if (start === null) continue;
      const r = orderRange(m, start);
      if (!r) continue;
      orders.push({ m, lb, lo: r[0], hi: r[1], fsrLo: lb * m / (m + 0.5), fsrHi: lb * m / (m - 0.5) });
    }
    orders.sort((a, b) => a.lb - b.lb);
    S.orders = orders;
    if (orders.length) {
      S.range = [Math.min(...orders.map(o => o.lo)), Math.max(...orders.map(o => o.hi))];
      // gaps: union of on-chip intervals
      const iv = orders.map(o => [o.lo, o.hi]).sort((a, b) => a[0] - b[0]);
      let cur = iv[0].slice(), cov = 0, gaps = [];
      for (let k = 1; k < iv.length; k++) {
        if (iv[k][0] <= cur[1]) cur[1] = Math.max(cur[1], iv[k][1]);
        else { cov += cur[1] - cur[0]; gaps.push([cur[1], iv[k][0]]); cur = iv[k].slice(); }
      }
      cov += cur[1] - cur[0];
      S.gaps = gaps;
      S.covFrac = cov / (S.range[1] - S.range[0]);
      if (gaps.length) flag("gap", "coverage gaps above " + Math.round(gaps[0][0] * 1e4) + " Å");
      // order separation at the blaze center against the slit image length
      let minClear = Infinity, minSep = Infinity;
      for (let k = 0; k + 1 < orders.length; k++) {
        if (orders[k].lb < ATMO) continue;                 // below the atmospheric cutoff nothing arrives
        const a = pos(orders[k].lb, orders[k].m), b = pos(orders[k + 1].lb, orders[k + 1].m);
        if (!a || !b) continue;
        const sep = Math.abs(a[1] - b[1]) / pix;
        const la = local(orders[k].lb, orders[k].m), lb2 = local(orders[k + 1].lb, orders[k + 1].m);
        const sl = 0.5 * ((la ? la.slitPix : 0) + (lb2 ? lb2.slitPix : 0));
        minSep = Math.min(minSep, sep);
        minClear = Math.min(minClear, sep - sl);
      }
      S.minSep = minSep; S.minClear = minClear;
      if (minClear < 0) flag("ovl", "adjacent orders overlap");
    } else {
      S.range = null;
      flag("none", "no orders fall on the detector");
    }
  }

  // ---- general flags
  if (S.c.npix < 2) flag("samp", "undersampled");
  if (S.c.Rd < S.c.Rs) flag("diff", "grating diffraction-limited");
  return S;
}

const API = { RAD, DEG, GLASS, nGlass, surface, design, dot, unit, cross, norm };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.IX = API;
})(typeof window !== "undefined" ? window : globalThis);
