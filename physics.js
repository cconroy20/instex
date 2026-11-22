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
// the shortest to the longest wavelength each data sheet tabulates an index for (SCHOTT: N-BK7 312.6 nm,
// N-FK5 and FK5HTi 280.4 nm, N-BAK2 296.7 nm, LF5 and F2 334.1 nm, SF6 365.0 nm, all to 2325.4 nm); OHARA PBM 2Y:
// 326-1129 nm with these constants; OHARA's formula otherwise 365-2325 nm; CHARMS fits and Malitson as fitted.
// Outside its range a glass has no index (NaN), and rays through it are dropped.
const GLASS = {
  // Malitson 1965, JOSA 55, 1205 (publisher's abstract): fused silica, 20 C, 0.21-3.71 um
  silica: { label: "fused silica", range: [0.21, 3.71], B: [0.6961663, 0.4079426, 0.8974794], C: [0.0684043 ** 2, 0.1162414 ** 2, 9.896161 ** 2] },
  // SCHOTT datasheets (N-BK7 as of 01-Dec-2023; N-FK5 and FK5HTi from the optical glass collection)
  "N-BK7": { label: "N-BK7", range: [0.3126, 2.3254], B: [1.03961212, 0.231792344, 1.01046945], C: [0.006000699, 0.0200179144, 103.560653] },
  "N-FK5": { label: "N-FK5", range: [0.2804, 2.3254], B: [0.844309338, 0.344147824, 0.910790213], C: [0.00475112, 0.0149814849, 97.8600293] },
  FK5HTi: { label: "FK5HTi (FK5)", range: [0.2804, 2.3254], B: [0.90936218, 0.279077054, 0.891813298], C: [0.005201425, 0.0158938446, 95.9109448] },
  // OHARA datasheets (OHARA 25-04); PBM 2Y valid 326-1129 nm with these constants
  PBM2Y: { label: "PBM 2Y (PBM2)", range: [0.326, 1.129], B: [1.39446503, 0.159230985, 0.245470216], C: [0.0110571872, 0.0507194882, 31.4440142] },
  PBM2R: { label: "PBM 2R", range: [0.365, 2.325], B: [1.34139422, 0.21318551, 0.983288016], C: [0.00980301669, 0.0470587088, 117.45827] },
  // OHARA BSL7Y (ESI's cross-disperser prisms), OHARA data sheet 10/2018; the coefficients reproduce the sheet's
  // indices to 5e-6 from 0.326 to 1.129 um and drift beyond 1.5 um, so the range stops at the sheet's 1.129 um
  BSL7Y: { label: "BSL7Y (OHARA)", range: [0.326, 1.129], B: [1.13329383, 0.136897201, 0.703456004], C: [0.00669407868, 0.023739176, 70.7030316] },
  // OHARA S-LAL7 (LDSS-3 VPH-Blue and VPH-Red grism prisms), OHARA formula (same form), catalogue range 365-2325 nm
  "S-LAL7": { label: "S-LAL7 (OHARA)", range: [0.365, 2.325], B: [0.916121247, 0.765948319, 1.27745023], C: [0.00395889743, 0.0167547425, 110.762706] },
  // SCHOTT LF5 and N-BAK2 (FORS2 grisms 300I and 150I), SCHOTT data sheets
  LF5: { label: "LF5", range: [0.3341, 2.3254], B: [1.28035628, 0.163505973, 0.893930112], C: [0.009298544, 0.0449135769, 110.493685] },
  "N-BAK2": { label: "N-BAK2", range: [0.2967, 2.3254], B: [1.01662154, 0.319903051, 0.937232995], C: [0.005923838, 0.0203828415, 113.118417] },
  // SCHOTT F2 (the M2FS cross-dispersing prism; no preset uses it), SCHOTT data sheet (Stand 01.02.2014), data/round6/m2fs_ifum.md
  F2: { label: "F2", range: [0.3341, 2.3254], B: [1.34533359, 0.209073176, 0.937357162], C: [0.00997743871, 0.0470450767, 111.886764] },
  // SCHOTT SF6 datasheet (as of 01-Dec-2023): the X-Shooter VIS prism
  SF6: { label: "SF6", range: [0.365, 2.3254], B: [1.72448482, 0.390104889, 1.04572858], C: [0.013487195, 0.0569318095, 118.557185] },
  // SCHOTT Optical Glass Data Sheets (English collection; N-SF15 PDF p. 107, SF2 p. 116), data/round7/slipher.md: modern
  // stand-ins for Slipher's prisms, whose glasses have no dispersion formula (INFERRED there): SF2 for the Jena O 102 of
  // the three-prism train (the 1904 measured indices less a constant 0.0015, rms 7e-5), N-SF15 for the unnamed "very
  // dense" 64 deg prism of the nebular work.  Ranges: the sheets' tabulated indices, SF2 to n_i (365.0 nm), N-SF15 to
  // n_h (404.7 nm; no n_i given)
  SF2: { label: "SF2", range: [0.365, 2.3254], B: [1.40301821, 0.231767504, 0.939056586], C: [0.010579547, 0.0493226978, 112.405955] },
  "N-SF15": { label: "N-SF15", range: [0.4047, 2.3254], B: [1.57055634, 0.218987094, 1.50824017], C: [0.011650701, 0.0597856897, 132.709339] },
  // NASA CHARMS temperature-dependent Sellmeier fits, evaluated at 105 K (the X-Shooter NIR optics):
  // Infrasil 301 (Leviton, Frey & Madison 2008, Table 10; 0.5-3.6 um), ZnSe (Leviton, Frey & Kvamme 2005,
  // Table 13; 0.55-5.6 um).  B_i = S_i(105 K), C_i = lambda_i(105 K)^2; n(1 um) = 1.44972 and 2.47697.
  "Infrasil-105K": { label: "Infrasil 301 at 105 K", range: [0.50, 3.6], B: [0.107564209, 0.994487421, 0.885481151], C: [4.23631939e-06, 0.00880726271, 97.1509408] },
  "ZnSe-105K": { label: "ZnSe at 105 K", range: [0.55, 5.6], B: [4.42987482, 0.445970784, 2.55574186], C: [0.0398515278, 0.14716685, 2020.75143] },
  // CaF2 at 37 K, JWST NIRSpec's prism (Leviton, Frey & Madison 2008, Table 5, the same CHARMS form; 0.40-5.6 um, valid 25-300 K;
  // the fit reproduces the paper's measured indices to 5.5e-6; data/round12/jwnirspec.md): n(0.6 um) = 1.43579, n(5.3 um) = 1.39730
  "CaF2-37K": { label: "CaF\u2082 at 37 K", range: [0.40, 5.6], B: [1.0316274142205948, 0.0136399791696703, 4.106142512392021], C: [0.0054248106608752, 0.037740879165790525, 1267.833942847983] },
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
     grating mode: gType 'refl' | 'trans' | 'grism' | 'prism', G (l/mm), m, gA (deg, grism apex), gGlass, gKind 'ruled' | 'vph', gTilt (deg, ruled: entrance-face tilt), lamB (A, Littrow blaze wavelength in
                   order m), lamC (A), psi (deg, camera-collimator angle; reflection only),
                   tAlpha (deg, optional: fixed incidence on a transmission grating; else symmetric)
                   prism: pA (deg, apex), pN (number of identical prisms of glass gGlass), or pPrisms [{ glass, A, dI }]
     echelle mode: eG (l/mm), eDelta (deg), gamma (deg), theta (deg, in-plane offset), eTilt (deg, the echelle
                   turned from the blaze-symmetric setting),
                   xd 'grating' | 'vph' | 'prism' | 'grism', xG (l/mm), xPsi (deg), xGlass, xA (deg),
                   xPasses, xPrisms [{ glass, A, dI }], xGrism { G, A, glass } (a grism after the prisms),
                   xGrA (an echelle grism's apex, deg; else set by lamC), lamC (A)
     gLen (mm, optional)                   the grating's ruled length along the dispersion: a beam whose footprint
                                           is longer overfills it, and the ruled length sets the diffraction limit
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
    // theta: half the in-plane angle between the beams; eTilt: the echelle turned by that angle from the setting
    // symmetric about the blaze (M2FS: the beams at 73.2 and 66.6 deg on a 69 deg blaze), the facets keeping delta
    const th = (P.theta || 0) * DEG, gam = (P.gamma || 0) * DEG, tilt = (P.eTilt || 0) * DEG;
    alpha = delta + th + tilt; betaRef = delta - th + tilt;
    mlamRef = Math.cos(gam) * (Math.sin(alpha) + Math.sin(betaRef)) / Gm;     // m lambda at the blaze center
    S.gamma = gam;
  } else {
    Gm = P.G / 1000; order = Math.max(1, Math.round(P.m || 1));
    const x = order * Gm * lamC;
    if (P.gType === "prism") {
      // A prism spectrograph (Slipher's on the Lowell 24-inch refractor; the NIRSpec prism): no grooves and no orders.
      // The prisms (pPrisms, or pN copies of one prism of glass gGlass and apex pA) stand at minimum deviation for
      // lamC, each bending the beam the same way; the camera follows the deviated beam, so lamC lands at the detector
      // center.  The surfaces are set up below, once the beam's frame is known.
      reflect = false; order = 1; Gm = 0;
      const train = Array.isArray(P.pPrisms) && P.pPrisms.length ? P.pPrisms
        : Array(Math.max(1, Math.round(P.pN || 1))).fill({ glass: P.gGlass, A: P.pA });
      S.prism = { train };
      alpha = 0; betaRef = 0;
    } else if (P.gType === "grism") {
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
      // lam0 solves f(lam) = lam: scan the glass's range (within 0.3-2.6 um) for a sign change of f(lam) - lam and
      // bisect it; with several roots, take the one nearest the requested central wavelength
      const gr = (GLASS[P.gGlass] && GLASS[P.gGlass].range) || [0.3, 2.6];
      const lo = Math.max(0.3, gr[0] + 1e-9), hi = Math.min(2.6, gr[1] - 1e-9), g = l => f(l) - l, roots = [];
      let pl = lo, pg = g(lo);
      for (let k = 1; k <= 400; k++) {
        const l = lo + (hi - lo) * k / 400, gl = g(l);
        if (isFinite(pg) && isFinite(gl) && pg * gl <= 0) roots.push(bisect(g, pl, l, pg, gl, 1e-13));
        pl = l; pg = gl;
      }
      let l0 = NaN;
      for (const r of roots) if (!(Math.abs(r - lamC) >= Math.abs(l0 - lamC))) l0 = r;
      if (!(l0 > 0) || !(Math.abs(g(l0)) < 1e-9)) { S.bad = "This grism passes no wavelength straight through inside the glass's valid range: change the apex angle or the groove density."; return S; }
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
  if (S.prism) {
    // the prisms in turn, bending in the dispersion plane (x-z), each at minimum deviation for lamC (dI, degrees: a
    // prism turned from it, a larger angle of incidence for dI > 0).  The beam's width changes at each face by
    // cos(refracted) / cos(incident), which cancels through a prism at minimum deviation.  base: the difference in
    // glass path between the beam's two edges, summed over the prisms (the base of a prism the beam just fills),
    // which with dn/dlambda sets the diffraction limit, R = sum b dn/dlambda (Rayleigh).
    const st = [], dirs = [cAx];
    let r = cAx, b = ex, wc = W, base = 0;
    for (const pr of S.prism.train) {
      const A = pr.A * DEG, nC = nGlass(pr.glass, lamC);
      if (!isFinite(nC)) { S.bad = "No refractive index for the glass '" + pr.glass + "' at the central wavelength."; return S; }
      const sA = nC * Math.sin(A / 2);
      if (sA >= 1) { S.bad = "The prism apex is too large for this glass (total internal reflection)."; return S; }
      const i = Math.asin(sA) + (pr.dI || 0) * DEG;
      const m1 = add(mul(r, Math.cos(i)), mul(b, Math.sin(i)));
      const m2 = add(mul(r, Math.cos(i - A)), mul(b, Math.sin(i - A)));
      const f1 = { kind: "face", nrm: m1, from: 1, to: pr.glass }, f2 = { kind: "face", nrm: m2, from: pr.glass, to: 1 };
      const rin = traceXd(r, lamC, [f1]), rout = rin && traceXd(rin, lamC, [f2]);
      if (!rout) { S.bad = "The beam cannot leave the prism (total internal reflection at the exit face)."; return S; }
      const c1 = Math.abs(dot(rin, m1)), c2 = Math.abs(dot(rin, m2));
      const wIn = wc * c1 / Math.abs(dot(r, m1));
      base += wIn * (Math.sqrt(1 - c1 * c1) / c1 + Math.sqrt(1 - c2 * c2) / c2);
      wc = wIn * Math.abs(dot(rout, m2)) / c2;
      st.push(f1, f2); dirs.push(rin, rout);
      b = unit(perp(b, rout)); r = rout;
    }
    main = (u, mlam) => traceXd(u, mlam, st);       // order 1: m lambda is the wavelength
    Object.assign(S.prism, { stages: st, dirs, Wout: wc, base, dev: Math.acos(Math.min(1, dot(r, cAx))) });
    S.psi = S.prism.dev;
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
        // (pr.dI, degrees: the prism turned from minimum deviation, a larger angle of incidence for dI > 0; ESI's
        // prisms sit "near" minimum deviation, which spreads the orders more and varies the anamorphic magnification)
        const i = Math.asin(sA) + (pr.dI || 0) * DEG;
        const m1 = add(mul(r, Math.cos(i)), mul(b, Math.sin(i)));
        const m2 = add(mul(r, Math.cos(i - A)), mul(b, Math.sin(i - A)));
        xdStages.push({ kind: "face", nrm: m1, from: 1, to: pr.glass });
        xdStages.push({ kind: "face", nrm: m2, from: pr.glass, to: 1 });
        const rr = traceXd(r, lamC, xdStages.slice(-2));
        b = unit(perp(b, rr)); r = rr;
      }
      S.xdDev = Math.acos(Math.min(1, dot(r, u1ref)));
      // a grism after the prisms (P.xGrism { G, A, glass }: ELODIE's crown grism behind its F2 prism, Baranne et al.
      // 1996), entered square to the beam with its ruled face at the apex A; its first order disperses the same way as
      // the prisms (red toward the side the prisms bend least), so the two dispersions add
      if (P.xGrism && P.xGrism.G > 0 && P.xGrism.A > 0) {
        const g = P.xGrism, Gx = g.G / 1000, A = g.A * DEG;
        if (!isFinite(nGlass(g.glass, lamC))) { S.bad = "No refractive index for the grism's glass '" + g.glass + "' at the central wavelength."; return S; }
        const m2 = add(mul(r, Math.cos(A)), mul(b, -Math.sin(A)));
        const s2 = sub(mul(r, Math.sin(A)), mul(b, -Math.cos(A)));
        xdStages.push({ kind: "face", nrm: r, from: 1, to: g.glass });
        xdStages.push({ kind: "gface", nrm: m2, g: mul(s2, -Gx), from: g.glass, to: 1 });
        S.xdGrism = { G: g.G, A, glass: g.glass };
      }
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
      // the apex: given (xGrA, degrees: HARPS's, from its blaze wavelength), or set so that lamC passes undeviated
      const Gx = P.xG / 1000, nC = nGlass(P.xGlass, lamC), sA = Gx * lamC / (nC - 1);
      if (!(P.xGrA > 0) && sA >= 1) { S.bad = "The grism ruling is too fine for this glass at λc."; return S; }
      const A = P.xGrA > 0 ? P.xGrA * DEG : Math.asin(sA);
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
  S.xdStages = xdStages;                           // the cross-disperser's surfaces (directions only), for the 3D view
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
    else if (S.grism.eps) {
      // the tilted entrance face (eps) refracts the beam to eps' and changes its width by cos eps' / cos eps; it meets
      // the ruled face at A - eps' and leaves it at A - eps (lam0, back on the axis)
      const e = S.grism.eps, ep = Math.asin(Math.sin(e) / S.grism.n0), A = S.grism.A;
      S.Lg = W * Math.cos(ep) / (Math.cos(e) * Math.cos(A - ep));
      S.Wp = S.Lg * Math.cos(A - e);
    }
  }
  if (S.prism) { S.Lg = S.prism.base; S.Wp = S.prism.Wout; }
  // a beam that overfills the grating (gLen: the ruled length; UHRF, Hamilton and the Tull coude overfill their 408 mm
  // echelles): the light beyond the ruling is lost, and the grooves actually lit set the diffraction limit
  S.LgLit = P.gLen > 0 && !S.prism ? Math.min(S.Lg, P.gLen) : S.Lg;
  if (S.LgLit < S.Lg) flag("fill", "the beam overfills the grating (" + Math.round(S.Lg) + " mm footprint on " + Math.round(P.gLen) + " mm)");
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
    // the diffraction limit: m N for a grating (Lg in mm); for prisms W' dtheta/dlambda, the beam's width times the
    // angular dispersion (= sum b dn/dlambda), from the traced directions
    // A slit narrower than its own diffraction lights more of the grating than the geometric beam: the central lobe of
    // the slit's diffraction pattern, between its first zeros (2 lambda / w across), spans 2 f_col lambda / w on the
    // collimator.  The grating is lit over the larger of that and the beam W (up to its ruled length, gLen), and those
    // grooves set the diffraction limit (SINFONI's 25 mas slices: a 9.5 mm beam, 42 mm lit at 2.2 um).  A slit many
    // times lambda / D wide (every seeing-limited slit) keeps the beam W; the "dl" feed's beam is already the diffracted one
    const fDif = P.feed === "dl" ? 1 : Math.max(1, 2 * S.fcol * lam * 1e-3 / ws / W);
    const LgLit = fDif > 1 ? (P.gLen > 0 && !S.prism ? Math.min(S.Lg * fDif, P.gLen) : S.Lg * fDif) : S.LgLit;
    let RdN = Math.abs(m) * (Gm * 1000) * LgLit;
    if (S.prism) {
      const ui = inDir(0, 0), ua = main(ui, lam + h), ub = main(ui, lam - h);
      RdN = ua && ub ? fDif * S.Wp * 1000 * norm(sub(ua, ub)) / (2 * h) : NaN;
    }
    // The effective R: the slit image and the grating's diffraction limit in quadrature. The pixel does not widen a
    // measured line (McLean et al. 2012 measure MOSFIRE's lines at the geometric slit width), so no pixel term
    // (Charlie's call, 2026-11-16, after the preset audit). Rfit: the R a pipeline reports from a Gaussian fitted to
    // the line, whose FWHM is 0.841 of a top-hat line's width when the line spans 3 px or more (sampled in pixels).
    const Reff = 1 / Math.sqrt(1 / (Rs * Rs) + 1 / (RdN * RdN));
    const Rfit = 1 / Math.sqrt((0.841 / Rs) * (0.841 / Rs) + 1 / (RdN * RdN));
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
      w, fw, npix, Rs, Rd: RdN, Rp, Reff, Rfit, fDif, LgLit,
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
  const LAM_MIN = 0.30, LAM_MAX = 6.0, ATMO = 0.32;   // um; ATMO: atmospheric cutoff; LAM_MAX: the M band's red end (CRIRES+, NIRSPEC)
  function orderRange(m, lamGuess) {
    // walk outward from lamGuess (on the chip) in both directions until off the chip, then refine.  Nothing
    // shorter than the atmospheric cutoff (ATMO) arrives, and nothing longer than LAM_MAX is followed: where the
    // trace is still on the chip at either limit, the limit is the edge of the coverage.
    if (lamGuess < ATMO || lamGuess > LAM_MAX) {
      const l = lamGuess < ATMO ? ATMO * (1 + 1e-9) : LAM_MAX * (1 - 1e-9);
      if (!onChip(pos(l, m))) return null;
      lamGuess = l;
    }
    const loc = local(lamGuess, m);
    if (!loc) return null;
    const half = 1.15 * (Lx / 2 + Math.abs(loc.X)) / loc.disp;                // um, generous
    const out = [];
    for (const dir of [-1, 1]) {
      const lim = dir < 0 ? ATMO : LAM_MAX;
      let a = lamGuess, n = 64, edge = null;
      for (let k = 1; k <= n; k++) {
        let b = lamGuess + dir * half * k / (n / 2);
        const past = dir < 0 ? b <= lim : b >= lim;
        if (past) b = lim;
        if (!onChip(pos(b, m))) {
          edge = bisect(l => (onChip(pos(l, m)) ? -1 : 1), a, b, -1, 1, lamGuess * 1e-9);
          break;
        }
        if (past) { edge = lim; break; }
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
    let r = orderRange(order, lamC);
    // an order-isolating filter (P.filt, [lo, hi] in Å; M2FS, Hectochelle): only the filter's band reaches the
    // detector, and the neighboring orders are blocked. A band that misses the order is ignored (and the warning returns)
    const fb = Array.isArray(P.filt) && P.filt.length === 2 ? [P.filt[0] / 1e4, P.filt[1] / 1e4] : null;
    if (fb && Math.min(r[1], fb[1]) > Math.max(r[0], fb[0])) { r = [Math.max(r[0], fb[0]), Math.min(r[1], fb[1])]; S.filt = fb; }
    S.range = r;
    S.lo = local(r[0], order); S.hi = local(r[1], order);
    S.orders = [{ m: order, lo: r[0], hi: r[1] }];
    // overlap with neighboring orders (order-sorting filter); first order carries no warning (second-order light
    // removed at Charlie's request, 2026-10-17)
    if (order > 1 && !S.filt) flag("ord", fb ? "the filter's band misses this order: orders " + (order - 1) + " and " + (order + 1) + " overlap" : "orders " + (order - 1) + " and " + (order + 1) + " overlap: needs a filter");
  } else {
    // ---- echelle format
    const K = mlamRef;                             // m lambda at the blaze center
    const mLo = Math.max(1, Math.ceil(K / LAM_MAX)), mHi = Math.floor(K / LAM_MIN);
    const orders = [];
    for (let m = mLo; m <= mHi; m++) {
      const lb = K / m;
      const p = pos(lb, m);
      if (p && Math.abs(p[1]) > Ly / 2 + 0.02 * Ly) continue;
      // the blaze center may lie just off the chip in Y, or outside a prism glass's range (no position), while part
      // of the order is on the chip: look for an on-chip starting point along the order
      let start = p && onChip(p) ? lb : null;
      if (start === null) {
        for (const f of [-0.3, 0.3, -0.15, 0.15, -0.45, 0.45, -0.6, 0.6]) { const l = lb * (1 + f / m); if (onChip(pos(l, m))) { start = l; break; } }
      }
      if (start === null) continue;
      const r = orderRange(m, start);
      if (!r) continue;
      orders.push({ m, lb, lo: r[0], hi: r[1], fsrLo: lb * m / (m + 0.5), fsrHi: lb * m / (m - 0.5) });
    }
    orders.sort((a, b) => a.lb - b.lb);
    // the arm's band (P.filt, [lo, hi] in Å: the dichroics and filters that bound an echelle arm, X-Shooter): orders
    // outside the band receive no light and are dropped, the rest clipped to the band
    if (Array.isArray(P.filt) && P.filt.length === 2) {
      const fb = [P.filt[0] / 1e4, P.filt[1] / 1e4], kept = [];
      for (const o of orders) if (o.hi > fb[0] && o.lo < fb[1]) kept.push(Object.assign(o, { lo: Math.max(o.lo, fb[0]), hi: Math.min(o.hi, fb[1]) }));
      if (kept.length) { orders.length = 0; orders.push(...kept); S.filt = fb; }
    }
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
      // order separation at the blaze center against one trace's width: the slit (or fiber) width imaged along
      // the slit, measured vertically (a tilted slit image is spread over more rows)
      let minClear = Infinity, minSep = Infinity;
      const wTr = P.traceW > 0 ? P.traceW : P.slitW;
      for (let k = 0; k + 1 < orders.length; k++) {
        if (orders[k].lb < ATMO) continue;                 // below the atmospheric cutoff nothing arrives
        const a = pos(orders[k].lb, orders[k].m), b = pos(orders[k + 1].lb, orders[k + 1].m);
        if (!a || !b) continue;
        const sep = Math.abs(a[1] - b[1]) / pix;
        const la = local(orders[k].lb, orders[k].m);
        const tw = la && wTr > 0 ? wTr / la.pixScale * Math.abs(la.sdir[1]) : 0;
        minSep = Math.min(minSep, sep);
        minClear = Math.min(minClear, sep - tw);
      }
      S.minSep = minSep; S.minClear = minClear;
      if (minClear < 0) flag("ovl", "adjacent orders closer than one trace width");
    } else {
      S.range = null;
      flag("none", "no orders fall on the detector");
    }
  }

  // ---- general flags
  if (S.c.npix < 2) flag("samp", "undersampled");
  if (S.c.Rd < S.c.Rs) flag("diff", (S.prism ? "prism" : "grating") + " diffraction-limited");
  return S;
}

// ------------------------------------------------------------------ an as-built bench (drawing only)
/* planLayout(PL, P): the bench of a folded white-pupil echelle as designed or built (PL is the preset's bench, IX_PLANS in
   presets.js), for the 3D view.  Each ray is traced through real mirrors with surface(), as in the model.  Frame: x along
   the main collimator M1's axis (its focus, where the slit or fiber images sit, at the origin; its vertex at x = f_col),
   y across the bench (the echelle's dispersion), z in the bench plane, positive on the side of the transferred beam: the
   plane of the paper's layout figure, seen from -y with x to the right and z up.  Angles in the bench plane (rotP) are
   counterclockwise as the figure is seen (x toward z).
   The bench: the slit at M1's focus (PL.feedFold: through a flat d mm along the chief ray, the slit at the flat's mirror
   image of the focus), the chief rays PL.chief degrees from M1's axis; M1 a paraboloid; the echelle PL.echDist from M1's
   vertex, in Littrow in its own plane (x-y) and turned by gamma in the bench plane; then PL.path, the elements met after
   M1's second pass, in order:
     fold      a plane mirror (type "flat", "mangin" or "field"), "before" mm ahead of the focus or at a measured point,
               turned to send the light to the next element's measured point (or "to")
     parab     a collimator: a paraboloid of focal length f (or "wpT") whose focus is the folded focus, its face at a
               measured point, its axis toward the next element's point (or "to")
     m1pass    M1 again (a third pass, HARPS)
     dichroic  a plate at a measured point, tilted "tilt" degrees to the beam toward "reflectTo"; the path splits into
               "transmit" and "reflect"
     lens      a field lens at the focus (drawn; the chief ray passes undeviated)
     vph       a transmission grating "dist" mm on, set symmetric at lamD and turned by its fringe tilt toward "turn"
     grism2    a VPH between two prisms (apexes A1, A2), set so that lam0 passes undeviated
     grating   a reflection grating "dist" mm on, set so that lamD leaves toward "camTo"
     prism     a prism "dist" mm on, at minimum deviation for lamD, turning toward "turn"
     camera    an ideal lens of focal length f, its axis the arm's reference ray leaving the cross-disperser, its first
               vertex "l1" mm on (from the cross-disperser, or from the split with l1Ref "split"), the detector behind
               the lenses (a prescription [R1, R2, t, air, ca1, ca2], R > 0 convex as seen from outside the lens)
   Positions follow the main reference ray (the central wavelength in the order whose blaze is nearest); each camera's
   axis follows its arm's reference ray (lamRef, else the central wavelength).  The collimators are paraboloids (a
   conic near -1 is drawn as the paraboloid of its focal length); folds are plane (a Mangin mirror's or field mirror's
   power is left out); each camera is an ideal lens.  Returns null unless the model's state is the one the bench is drawn
   for (PL.fits). */
function planLayout(PL, P, NS) {
  if (!PL || !P || P.mode !== "echelle") return null;
  for (const [k, v] of Object.entries(PL.fits || {})) {
    const p = P[k];
    if (typeof v === "number" ? !(Math.abs(p - v) <= 1e-6 * Math.max(1, Math.abs(v))) : p !== v) return null;
  }
  NS = NS || 20;
  // (the echelle in Littrow at delta + eTilt, as the model sets it: the facets keep delta, the reference ray returns on itself;
  // PL.gamma, where given, is the bench's own off-plane angle, measured from its layout, where the model's differs)
  const f = P.W * P.F, dl = (P.eDelta + (P.eTilt || 0)) * DEG, gm = (PL.gamma !== undefined ? PL.gamma : P.gamma) * DEG, Ge = P.eG * 1e-3;
  const X = [1, 0, 0], Y = [0, 1, 0];
  const rotP = (v, t) => [v[0] * Math.cos(t) - v[2] * Math.sin(t), v[1], v[0] * Math.sin(t) + v[2] * Math.cos(t)];
  const ang = v => Math.atan2(v[2], v[0]);
  const turnOf = (u, w) => Math.sign(-cross(u, w)[1]);            // +1 counterclockwise in the bench plane
  const refl = (u, n) => surface(u, n, null, 0, 1, 1, true);
  const hitPl = (p, u, c, n) => { const den = dot(u, n); return Math.abs(den) < 1e-12 ? null : add(p, mul(u, dot(sub(c, p), n) / den)); };
  const mirrorPt = (q, c, n) => sub(q, mul(n, 2 * dot(sub(q, c), n)));
  const pt = a => [a[0], 0, a[1]];
  // a paraboloid: focus Fp, unit axis a (vertex toward focus), focal length fl
  const parab = (Fp, a, fl) => ({ F: Fp, a, f: fl, V: add(Fp, mul(a, -fl)) });
  const pNormal = (M, q) => { const e = sub(q, M.V), ep = perp(e, M.a); return unit(sub(mul(ep, 1 / (2 * M.f)), M.a)); };
  const hitPar = (M, p, u) => {
    const d = sub(p, M.V), dw = dot(d, M.a), uw = dot(u, M.a), dp = perp(d, M.a), up = perp(u, M.a);
    const A = dot(up, up), B = 2 * dot(dp, up) - 4 * M.f * uw, C = dot(dp, dp) - 4 * M.f * dw;
    let t;
    if (Math.abs(A) < 1e-14) t = -C / B;
    else { const ds = B * B - 4 * A * C; if (ds < 0) return null; const s = Math.sqrt(ds); t = [(-B - s) / (2 * A), (-B + s) / (2 * A)].filter(x => x > 1e-6).sort((a, b) => a - b)[0]; }
    if (!(t > 1e-6)) return null;
    const q = add(p, mul(u, t));
    return { q, u: refl(u, pNormal(M, q)) };
  };
  // the point nearest a bundle of rays (least squares): where the bundle focuses
  const focusOf = rays => {
    const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], b = [0, 0, 0];
    for (const { q, u } of rays) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const m = (i === j ? 1 : 0) - u[i] * u[j]; A[i][j] += m; b[i] += m * q[j]; }
    const det = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    const D0 = det(A);
    return [0, 1, 2].map(k => det(A.map((r, i) => r.map((v, j) => (j === k ? b[i] : v)))) / D0);
  };
  // (a cone of half-angle ta in the bench plane and tb across it, along the echelle's dispersion)
  const ringDirs = (c, ta, tb = ta) => { const p1 = unit(cross(c, Y)), p2 = cross(p1, c); return Array.from({ length: NS }, (_, k) => unit(add(c, add(mul(p1, ta * Math.cos(2 * Math.PI * k / NS)), mul(p2, tb * Math.sin(2 * Math.PI * k / NS)))))); };
  // ---- the arriving light: from the slit image at M1's focus, the chief rays tilted PL.chief from M1's axis; the beam
  // round (W) or, with PL.beam [along the dispersion, in the bench plane], rectangular, drawn as the ellipse inside it
  const M1 = parab([0, 0, 0], [-1, 0, 0], f);
  const c0 = rotP(X, -PL.chief * DEG), cone = PL.beam ? ringDirs(c0, PL.beam[1] / (2 * f), PL.beam[0] / (2 * f)) : ringDirs(c0, 1 / (2 * P.F));
  const h0 = hitPar(M1, [0, 0, 0], c0), uIn = h0.u;
  const E = add(h0.q, mul(uIn, (h0.q[0] - (f - PL.echDist)) / -uIn[0]));
  // a flat between the slit and M1 (UVES): the slit at its mirror image of the focus
  let feed = { S: [0, 0, 0], fold: null, ring: null };
  if (PL.feedFold) {
    const FFc = mul(c0, PL.feedFold.d), vin = mul(rotP(X, PL.feedFold.from * DEG), -1), nF = unit(sub(c0, vin));
    feed = { S: sub(FFc, mul(vin, PL.feedFold.d)), fold: { k: "flat", c: FFc, n: nF, w: PL.feedFold.w, h: PL.feedFold.h, t: PL.feedFold.t || 20, label: PL.feedFold.label, sub: PL.feedFold.sub, lab: PL.feedFold.lab },
             ring: cone.map(c => hitPl([0, 0, 0], c, FFc, nF)), vin };
  }
  // ---- the echelle: in Littrow in its own plane (x-y) at the blaze angle, its ruled face toward -y (the side the figure
  // is seen from), turned by gamma in the bench plane, the way that sends the returning light 2 gamma farther from M1's
  // axis (PL.gammaSide -1: nearer)
  const ech = s => ({ n: rotP([Math.cos(dl), -Math.sin(dl), 0], s * gm), g: rotP([Math.sin(dl), Math.cos(dl), 0], s * gm) });
  const mlamB = 2 * Math.sin(dl) * Math.cos(gm) / Ge;
  let EC = ech(1);
  { const u = surface(uIn, EC.n, mul(EC.g, Ge), mlamB, 1, 1, true); if (u && Math.sign(u[2]) !== (PL.gammaSide || 1) * Math.sign(E[2])) EC = ech(-1); }
  const nE = EC.n, gE = EC.g, eOut = (m, lam) => surface(uIn, nE, mul(gE, Ge), m * lam, 1, 1, true);
  const foot = cone.map(c => { const h = hitPar(M1, [0, 0, 0], c); return h && hitPl(h.q, h.u, E, nE); });
  const atM1in = cone.map(c => { const h = hitPar(M1, [0, 0, 0], c); return h && h.q; });
  // ---- the returning light of the main reference ray (the central wavelength, in the order whose blaze is nearest)
  const lamC = P.lamC / 1e4, mR = Math.max(1, Math.round(mlamB / lamC));
  const back1 = (m, lam, pts) => { const u = eOut(m, lam); if (!u) return null; return pts.map(q => hitPar(M1, q, u)); };
  // (placed along the blaze ray of the reference order, which returns in the bench plane; the central wavelength off the
  // blaze leaves the plane by the echelle's dispersion)
  const lamB = mlamB / mR, rR = back1(mR, lamB, foot), chR = back1(mR, lamB, [E])[0];
  const Q0 = focusOf(rR);
  // ---- place the elements along the main reference ray; each camera is set up once its arm's route is known
  const parts = [], camQ = [], m1zones = [h0.q, chR.q];
  const lensSum = L => L.reduce((s, q) => s + q[2] + q[3], 0);
  const place = (list, st, route, split) => {
    for (let i = 0; i < list.length; i++) {
      const e = list[i], nx = list[i + 1], aim = e.to ? pt(e.to) : nx && nx.at ? pt(nx.at) : null;
      const proj = q => add(st.p, mul(st.u, dot(sub(q, st.p), st.u)));
      const base = { label: e.label, sub: e.sub, lab: e.lab, w: e.w, h: e.h, t: e.t };
      if (e.k === "fold" && e.normal) {
        // a pose from a prescription: the plane through "at" with the given normal
        const n = unit(pt(e.normal)), c = hitPl(st.p, st.u, pt(e.at), n);
        const part = { ...base, k: e.type || "flat", c: pt(e.at), n };
        parts.push(part); route = [...route, { part, act: "reflect" }];
        st = { p: c, u: refl(st.u, n), F: st.F ? mirrorPt(st.F, c, n) : null };
      } else if (e.k === "fold") {
        const uin = st.F ? unit(sub(st.F, st.p)) : st.u;
        const c = e.before !== undefined ? sub(st.F, mul(uin, e.before)) : proj(pt(e.at));
        let dOut = unit(sub(aim, c)), F2 = null;
        if (st.F) { const dF = norm(sub(st.F, c)); F2 = c; for (let k = 0; k < 6; k++) { F2 = add(c, mul(dOut, dF)); dOut = unit(sub(aim, F2)); } }
        const part = { ...base, k: e.type || "flat", c, n: unit(sub(dOut, uin)) };
        parts.push(part); route = [...route, { part, act: "reflect" }]; st = { p: c, u: dOut, F: F2 };
      } else if (e.k === "parab" || e.k === "m1pass") {
        const fl = e.f === "wpT" ? P.wpT : e.f;
        const M = e.k === "m1pass" ? M1 : e.focusAt ? parab(pt(e.focusAt), unit(pt(e.axis)), fl) : parab(st.F, unit(sub(aim, pt(e.at))), fl);
        const h = hitPar(M, st.F || st.p, st.u);
        if (!h) return false;
        const part = { ...base, k: e.k, c: h.q, n: pNormal(M, h.q), M };
        if (e.k === "m1pass") m1zones.push(h.q); else parts.push(part);
        route = [...route, { part, act: "parab" }]; st = { p: h.q, u: h.u, F: null };
      } else if (e.k === "dichroic") {
        const c = e.at ? proj(pt(e.at)) : add(st.p, mul(st.u, e.dist));
        const tgt = unit(sub(pt(e.reflectTo), c)), cand = [1, -1].map(s => rotP(mul(st.u, -1), s * e.tilt * DEG));
        const n = dot(refl(st.u, cand[0]), tgt) >= dot(refl(st.u, cand[1]), tgt) ? cand[0] : cand[1];
        const part = { ...base, k: "dichroic", c, n };
        parts.push(part);
        if (place(e.transmit, { p: c, u: st.u, F: st.F }, [...route, { part, act: "transmit" }], c) === false) return false;
        return place(e.reflect, { p: c, u: refl(st.u, n), F: st.F ? mirrorPt(st.F, c, n) : null }, [...route, { part, act: "reflect" }], c);
      } else if (e.k === "lens") {
        const c = st.F && e.atFocus !== false ? st.F : proj(pt(e.at)), n = st.u;
        const part = { ...base, k: "lens", c, n };
        parts.push(part); route = [...route, { part, act: "pass" }]; st = { p: c, u: st.u, F: st.F };
      } else if (e.k === "vph") {
        const c = e.at ? proj(pt(e.at)) : add(st.p, mul(st.u, e.dist));
        const th = Math.asin(e.lamD * e.G * 1e-3 * (e.m || 1) / 2) + (e.fringe || 0) * DEG, n = rotP(st.u, e.turn * th);
        let g = unit(cross(Y, n));
        { const o = surface(st.u, n, mul(g, e.G * 1e-3), (e.m || 1) * e.lamD, 1, 1, false); if (!o || turnOf(st.u, o) !== e.turn) g = mul(g, -1); }
        const part = { ...base, k: "vph", c, n, g, G: e.G, m: e.m || 1 };
        parts.push(part); route = [...route, { part, act: "vph" }];
        st = { p: c, u: surface(st.u, n, mul(g, e.G * 1e-3), (e.m || 1) * e.lamD, 1, 1, false), F: null };
      } else if (e.k === "grism2") {
        const b = st.u, gB = e.G * 1e-3;
        const at = pv => ({ n1: rotP(b, (e.sense || 1) * (pv + e.A1 * DEG)), nV: rotP(b, (e.sense || 1) * pv), n2: rotP(b, (e.sense || 1) * (pv - e.A2 * DEG)), gV: rotP(b, (e.sense || 1) * (pv + Math.PI / 2)) });
        const thru = (g, u, lam) => {
          const n = nGlass(e.glass, lam);
          let w = surface(u, g.n1, null, 0, 1, n, false); if (!w) return null;
          w = surface(w, g.nV, mul(g.gV, gB), e.m * lam, n, n, false); if (!w) return null;
          return surface(w, g.n2, null, 0, n, 1, false);
        };
        // the condition that sets the prisms' turn pv: lam0 undeviated (the default); "dev" degrees of deviation toward
        // "turn"; or "bragg", the VPH symmetric inside the glass for lam0 (the rays leave the fringes at the angle they
        // meet them).  Of several settings, the first in the scan, or with "expand" the one that widens the beam most at
        // the entrance face (the largest angle of incidence there)
        const dev = pv => { const w = thru(at(pv), b, e.lam0); if (!w) return NaN; const d = ang(w) - ang(b) - (e.dev ? (e.turn || 1) * e.dev * DEG : 0); return Math.atan2(Math.sin(d), Math.cos(d)); };
        const bragg = pv => {
          const g = at(pv), n = nGlass(e.glass, e.lam0), w1 = surface(b, g.n1, null, 0, 1, n, false); if (!w1) return NaN;
          const w2 = surface(w1, g.nV, mul(g.gV, gB), e.m * e.lam0, n, n, false); return w2 ? dot(w1, g.gV) + dot(w2, g.gV) : NaN;
        };
        const cond = e.bragg ? bragg : dev, [s0, s1] = e.scan ? e.scan.map(v => v * DEG) : [-10 * DEG, 30 * DEG], roots = [];
        for (let a = s0; a < s1 && !(roots.length && !e.expand); a += 0.25 * DEG) { const fa = cond(a), fb = cond(a + 0.25 * DEG); if (isFinite(fa) && isFinite(fb) && (fa < 0) !== (fb < 0)) roots.push(bisect(cond, a, a + 0.25 * DEG, fa, fb, 1e-10)); }
        const inc = pv => Math.abs(dot(b, at(pv).n1));
        const pv = !roots.length ? null : e.expand ? roots.reduce((p, q) => (inc(q) < inc(p) ? q : p)) : roots[0];
        const G1 = e.at ? proj(pt(e.at)) : add(st.p, mul(b, e.dist));
        const GR = at(pv === null ? 0 : pv), GV = add(G1, mul(b, e.t1)), G2 = add(GV, mul(b, e.t2));
        const part = { ...base, k: "grism2", ...GR, G1, GV, G2, pv, b, hw: e.hw, hy: e.hy, glass: e.glass, G: e.G, m: e.m };
        parts.push(part); route = [...route, { part, act: "grism2" }];
        st = { p: G2, u: thru(GR, b, e.lam0) || b, F: null };
      } else if (e.k === "grating") {
        // (the camera "dev" degrees from the arriving beam, turned toward "turn", or toward the point camTo)
        const c = e.at ? proj(pt(e.at)) : add(st.p, mul(st.u, e.dist)), out = e.dev ? rotP(mul(st.u, -1), e.turn * e.dev * DEG) : unit(sub(pt(e.camTo), c));
        // the normal: the bisector of the arriving and leaving beams, turned by tau, sin(tau) = m lam G / (2 cos K)
        const K = Math.acos(Math.max(-1, Math.min(1, dot(mul(st.u, -1), out)))) / 2, bis = unit(sub(out, st.u));
        const lamD = e.lamD || lamC, tau = Math.asin((e.m || 1) * lamD * e.G * 1e-3 / (2 * Math.cos(K)));
        // (of the two settings that send lamD toward the camera, the model's: the larger angle of incidence, alpha = t + psi/2)
        let best = null;
        for (const s of [1, -1]) {
          const n = rotP(bis, s * tau);
          for (const gs of [1, -1]) {
            const g = mul(unit(cross(Y, n)), gs), o = surface(st.u, n, mul(g, e.G * 1e-3), (e.m || 1) * lamD, 1, 1, true);
            if (!o || dot(o, out) < 1 - 1e-6) continue;
            const inc = Math.abs(dot(mul(st.u, -1), n));                 // cos(alpha): the smaller, the larger the incidence
            if (!best || inc < best.inc) best = { n, g, o, inc };
          }
        }
        const part = { ...base, k: "grating", c, n: best.n, g: best.g, G: e.G, m: e.m || 1 };
        parts.push(part); route = [...route, { part, act: "grating" }]; st = { p: c, u: best.o, F: null };
      } else if (e.k === "prism") {
        // two faces from a prescription (a point and a normal each); the apex where the face planes meet in the bench plane
        const c = pt(e.face1.at), n1 = unit(pt(e.face1.normal)), c2 = pt(e.face2.at), n2 = unit(pt(e.face2.normal));
        const part = { ...base, k: "prism", c, c2, n1, n2, glass: e.glass, A: e.A, faceLen: e.faceLen, hy: e.hy, uIn: st.u };
        parts.push(part); route = [...route, { part, act: "prism" }];
        const n0 = nGlass(e.glass, e.lamD || lamC), q1 = hitPl(st.p, st.u, c, n1), w1 = surface(st.u, n1, null, 0, 1, n0, false);
        const q2 = w1 && hitPl(q1, w1, c2, n2), w2 = q2 && surface(w1, n2, null, 0, n0, 1, false);
        st = { p: q2 || c2, u: w2 || st.u, F: null };
      } else if (e.k === "grism") {
        // a ruled grism as the model sets one: the entrance face square to the beam, the exit face tilted A toward b (in
        // the bench plane, on the side "sense"), carrying the grating in first order; t mm thick on the beam's axis
        const c = e.at ? proj(pt(e.at)) : add(st.p, mul(st.u, e.dist)), A = e.A * DEG, r = st.u, b = rotP(r, (e.sense || 1) * Math.PI / 2);
        const n1 = r, n2 = add(mul(r, Math.cos(A)), mul(b, Math.sin(A))), g = mul(sub(mul(r, Math.sin(A)), mul(b, Math.cos(A))), -1), c2 = add(c, mul(r, e.t));
        const part = { ...base, k: "grism", c, c2, n1, n2, g, G: e.G, glass: e.glass, A: e.A, hw: e.hw, hy: e.hy, uIn: r, b, G1: c, GV: c2, nV: n2 };
        parts.push(part); route = [...route, { part, act: "grism" }];
        const n0 = nGlass(e.glass, lamC), w1 = surface(r, n1, null, 0, 1, n0, false), w2 = w1 && surface(w1, n2, mul(g, e.G * 1e-3), lamC, n0, 1, false);
        st = { p: c2, u: w2 || r, F: null };
      } else if (e.k === "camera") {
        camQ.push({ e, route, split });
      }
    }
    return true;
  };
  const st0 = { p: chR.q, u: chR.u, F: Q0 };
  if (place(PL.path, st0, [], null) === false) return null;
  // ---- one bundle through a route: rays [{q, u}] -> station rings; an apex wherever the bundle focuses between surfaces
  const actOn = (step, rays, lam0, lamX) => {
    const P0 = step.part, out = [], lam = lamX && (P0.k === "vph" || P0.k === "grism2" || P0.k === "grating" || P0.k === "prism" || P0.k === "grism") ? lamX : lam0;
    if (step.act === "parab") { const h = rays.map(r => hitPar(P0.M, r.q, r.u)); if (h.some(x => !x)) return null; return { rays: h, st: [h.map(x => x.q)] }; }
    if (P0.k === "grism2") {
      const n = nGlass(P0.glass, lam), gB = P0.G * 1e-3;
      const s1 = rays.map(r => hitPl(r.q, r.u, P0.G1, P0.n1)), w1 = rays.map(r => surface(r.u, P0.n1, null, 0, 1, n, false)); if (w1.some(x => !x)) return null;
      const sV = s1.map((q, i) => hitPl(q, w1[i], P0.GV, P0.nV)), w2 = w1.map(u => surface(u, P0.nV, mul(P0.gV, gB), P0.m * lam, n, n, false)); if (w2.some(x => !x)) return null;
      const s2 = sV.map((q, i) => hitPl(q, w2[i], P0.G2, P0.n2)), w3 = w2.map(u => surface(u, P0.n2, null, 0, n, 1, false)); if (w3.some(x => !x)) return null;
      return { rays: s2.map((q, i) => ({ q, u: w3[i] })), st: [s1, sV, s2] };
    }
    if (P0.k === "grism") {
      const n = nGlass(P0.glass, lam); if (!isFinite(n)) return null;
      const s1 = rays.map(r => hitPl(r.q, r.u, P0.c, P0.n1)), w1 = rays.map(r => surface(r.u, P0.n1, null, 0, 1, n, false)); if (w1.some(x => !x)) return null;
      const s2 = s1.map((q, i) => hitPl(q, w1[i], P0.c2, P0.n2)), w2 = w1.map(u => surface(u, P0.n2, mul(P0.g, P0.G * 1e-3), lam, n, 1, false)); if (w2.some(x => !x)) return null;
      return { rays: s2.map((q, i) => ({ q, u: w2[i] })), st: [s1, s2] };
    }
    if (P0.k === "prism") {
      const n = nGlass(P0.glass, lam); if (!isFinite(n)) return null;
      const s1 = rays.map(r => hitPl(r.q, r.u, P0.c, P0.n1)), w1 = rays.map(r => surface(r.u, P0.n1, null, 0, 1, n, false)); if (w1.some(x => !x)) return null;
      const s2 = s1.map((q, i) => hitPl(q, w1[i], P0.c2, P0.n2)), w2 = w1.map(u => surface(u, P0.n2, null, 0, n, 1, false)); if (w2.some(x => !x)) return null;
      return { rays: s2.map((q, i) => ({ q, u: w2[i] })), st: [s1, s2] };
    }
    for (const r of rays) {
      const q = hitPl(r.q, r.u, P0.c, P0.n); if (!q) return null;
      let u = r.u;
      if (step.act === "reflect") u = refl(r.u, P0.n);
      else if (step.act === "vph") u = surface(r.u, P0.n, mul(P0.g, P0.G * 1e-3), P0.m * lam, 1, 1, false);
      else if (step.act === "grating") u = surface(r.u, P0.n, mul(P0.g, P0.G * 1e-3), P0.m * lam, 1, 1, true);
      if (!u) return null;
      out.push({ q, u });
    }
    return { rays: out, st: [out.map(r => r.q)] };
  };
  // (lamX: the wavelength the cross-disperser sees, where it differs: the tracer's origin is the blaze direction of the
  // reference order cross-dispersed as the central wavelength)
  const runRoute = (m, lam, pts, route, lamX) => {
    const u = eOut(m, lam); if (!u) return null;
    let rays = pts.map(q => hitPar(M1, q, u)); if (rays.some(r => !r)) return null;
    const st = [pts, rays.map(r => r.q)], hits = [{ part: null, ring: rays.map(r => r.q) }];   // (hits: each surface's footprint, M1 first)
    let fade = null;
    for (let k = 0; k < route.length; k++) {
      const a = actOn(route[k], rays, lam, lamX); if (!a) return null;
      // the focus between the previous surface and this one, if the bundle passes one
      if (rays.length > 2) {
        const F = focusOf(rays), c0 = rays.reduce((s, r) => add(s, mul(r.q, 1 / rays.length)), [0, 0, 0]), u0 = unit(rays.reduce((s, r) => add(s, r.u), [0, 0, 0]));
        const c1 = a.st[0].reduce((s, q) => add(s, mul(q, 1 / rays.length)), [0, 0, 0]), sF = dot(sub(F, c0), u0), sN = dot(sub(c1, c0), u0);
        if (F.every(isFinite) && sF > 0 && sF < sN) st.push([F]);
      }
      if (fade === null && (["vph", "grism2", "grating", "prism", "grism"].includes(route[k].part.k) || (k > 0 && route[k - 1].part.k === "dichroic"))) fade = st.length;
      st.push(...a.st); rays = a.rays; hits.push({ part: route[k].part, ring: a.st[0] });
    }
    return { st, rays, fade, hits };
  };
  // ---- the cameras: each arm's reference ray leaving the cross-disperser sets the axis
  const cams = {};
  for (const { e, route, split } of camQ) {
    const lamR = e.lamRef || lamC, mA = Math.max(1, Math.round(mlamB / lamR));
    const r = runRoute(mA, mlamB / mA, [E], route, lamR); if (!r) return null;
    // (the axis in the bench plane, as the cameras are mounted, unless the spec says otherwise; a reference wavelength off
    // the blaze of its order leaves the plane by the echelle's dispersion)
    const last = r.rays[0].q, u0 = r.rays[0].u, ax = e.inPlane === false ? u0 : unit([u0[0], 0, u0[2]]);
    const L1 = e.l1Ref === "split" && split ? add(last, mul(ax, e.l1 - dot(sub(last, split), ax))) : add(last, mul(ax, e.l1));
    const det = add(L1, mul(ax, e.lenses ? lensSum(e.lenses) : e.back));
    let z0 = 0;
    const lenses = (e.lenses || []).map(([R1, R2, t, air, ca1, ca2]) => { const o = { z0, R1, R2, t, r: Math.max(ca1, ca2) / 2 * 1.03 }; z0 += t + air; return o; });
    cams[e.arm] = { id: e.arm, axis: ax, L1, det, f: e.f, lenses, m: mA, lam: lamR, route, model: !!e.model, range: e.range || null, label: e.label, sub: e.sub, lab: e.lab, detLab: e.detLab, det2: e.det || null };
  }
  // the focus on the detector of a beam leaving the cross-disperser along w: an ideal camera of focal length f
  const onDet = (c, w) => { const k = dot(w, c.axis); return k > 0 ? add(c.det, mul(perp(w, c.axis), c.f / k)) : null; };
  const trace = (m, lam, arm) => {
    const cam = cams[arm]; if (!cam) return null;
    const r = runRoute(m, lam, foot, cam.route); if (!r) return null;
    const atL = r.rays.map(x => hitPl(x.q, x.u, cam.L1, cam.axis)), Q = onDet(cam, r.rays[0].u);
    if (!Q || atL.some(q => !q)) return null;
    return { st: [...r.st, atL, [Q]], Q, fade: r.fade, hits: [...r.hits, { part: cam, ring: atL }] };
  };
  const chief = (m, lam, arm, lamX) => {
    const cam = cams[arm]; if (!cam) return null;
    const r = runRoute(m, lam, [E], cam.route, lamX); return r ? onDet(cam, r.rays[0].u) : null;
  };
  const m1c0 = m1zones.reduce((s, q) => add(s, mul(q, 1 / m1zones.length)), [0, 0, 0]), m1c = [m1c0[0], 0, m1c0[2]];   // (centered on the bench's mid-plane)
  return {
    // (mlamB as the model has it, so that a bench drawn with its own gamma is referred to the model's blaze wavelengths)
    f, mlamB: PL.gamma !== undefined ? 2 * Math.sin(dl) * Math.cos(P.gamma * DEG) / Ge : mlamB, mR, lamC, uIn, E, nE, gE, foot, atM1in, cone, Q0, feed, parts, cams,
    M1: { ...M1, at: m1c, n: pNormal(M1, m1c) },
    trace, chief,
  };
}

const API = { RAD, DEG, GLASS, nGlass, surface, design, dot, unit, cross, norm, planLayout };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.IX = API;
})(typeof window !== "undefined" ? window : globalThis);
