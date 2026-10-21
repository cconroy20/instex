/* Imager physics for the Instrument Explorer (window.IM).  A telescope (prime focus or Cassegrain) feeds a
   detector mosaic either directly or through a reimager: an ideal collimator, a collimated beam whose pupil
   holds the filter, and an ideal camera.

   Every optic is an ideal thin element acting on the ray slope t = tan(angle): t' = t - h / f.  A chain of such
   elements images exactly (no aberrations) and maps a sky angle theta to the height f_eff tan(theta) on the
   detector.  The numbers are measured by tracing rays through the chain; validate.js checks them against the
   closed forms (plate scale 206265 / f_eff, pupil position f_col + f_col^2 / L, beam angle tan(phi) =
   (D / W) tan(theta), and the rest).

   Inputs (P): D (m), eps (linear central obstruction), F (focal ratio at the instrument focus), tel ("prime" |
   "cass" | "schmidt" | "refr"), F1 ... (a Schmidt: the aperture stop at the corrector plate, at the mirror's center
   of curvature 2 f in front of the mirror, the focus halfway; a refractor: the objective acts as the prime-focus
   mirror does, unfolded), F1 (primary focal ratio, Cassegrain drawing only), back (Cassegrain focus behind the primary, in
   units of D, drawing only), field (corrected field diameter, arcmin), optics ("direct" | "reimaged"), W (beam
   diameter, mm), Fc (camera focal ratio), lam (um), psf ("seeing" | "diff"), seeing (FWHM, arcsec), Nx, Ny
   (pixels per chip), pix (um), rows (chips per row, top to bottom, centered) or nCol x nRow, gapX, gapY (mm). */
(function (root) {
"use strict";
const RAD = 206264.80624709636, DEG = Math.PI / 180;

// ---- the Airy pattern of an annular aperture, I(v) with v = pi D theta / lambda, unit peak
// J1(x) = (1/pi) int_0^pi cos(tau - x sin tau) dtau: the trapezoid rule on this periodic integrand converges
// exponentially once the number of points exceeds x by a margin.
function J1(x) {
  const n = Math.max(48, Math.ceil(Math.abs(x)) + 40);
  let s = 0;
  for (let k = 0; k <= n; k++) {
    const t = Math.PI * k / n, w = k === 0 || k === n ? 0.5 : 1;
    s += w * Math.cos(t - x * Math.sin(t));
  }
  return s / n;
}
const jinc = x => (Math.abs(x) < 1e-8 ? 1 : 2 * J1(x) / x);
function airy(v, eps) {
  const e = eps || 0;
  const a = (jinc(v) - e * e * jinc(e * v)) / (1 - e * e);
  return a * a;
}
// FWHM of the annular Airy pattern in units of lambda / D (bisection on the central peak)
function airyFWHM(eps) {
  let a = 0.5, b = 2.5;
  for (let k = 0; k < 60; k++) { const c = 0.5 * (a + b); if (airy(c, eps) > 0.5) a = c; else b = c; }
  return 2 * 0.5 * (a + b) / Math.PI;
}
// tabulated profile for rendering: I(v), v = 0 ... vmax in steps dv
function airyTable(eps, vmax = 60, dv = 0.01) {
  const n = Math.ceil(vmax / dv) + 1, T = new Float32Array(n);
  for (let i = 0; i < n; i++) T[i] = airy(i * dv, eps);
  return { T, dv, vmax };
}

// Moffat profile [1 + (r/alpha)^2]^-beta with the given FWHM
const moffatAlpha = (fwhm, beta) => fwhm / (2 * Math.sqrt(Math.pow(2, 1 / beta) - 1));

// solid angle of the rectangle [0, a] x [0, b] in a plane at distance f (a corner on the axis)
const omegaCorner = (a, b, f) => Math.sign(a) * Math.sign(b) * Math.atan(Math.abs(a * b) / (f * Math.sqrt(f * f + a * a + b * b)));
// ... and of any axis-aligned rectangle, by inclusion-exclusion over its corners (exact for a flat detector
// behind an ideal f tan(theta) camera)
const omegaRect = (x0, x1, y0, y1, f) => omegaCorner(x1, y1, f) - omegaCorner(x0, y1, f) - omegaCorner(x1, y0, f) + omegaCorner(x0, y0, f);

function design(P) {
  const S = { P, flags: [] };
  const flag = (k, txt) => S.flags.push({ k, txt });
  const Dmm = P.D * 1000, eps = Math.min(0.9, Math.max(0, P.eps || 0));
  S.Dmm = Dmm; S.eps = eps;
  S.area = Math.PI / 4 * P.D * P.D * (1 - eps * eps);            // collecting area, m^2

  // ---- telescope, unfolded along z (mm): elements are { z, f, kind }
  const el = [];
  let zF, zXP, zStop = 0;                                        // the telescope focus, its exit pupil, the aperture stop
  if (P.tel === "cass" || P.tel === "greg") {
    // Two mirrors: a primary of focal length f1 = F1 D and a secondary at s that sends the light back past the
    // primary to a focus b behind its vertex, magnifying by m = F / F1.  Cassegrain: a convex secondary inside the
    // prime focus (its object, the prime focus, lies p = f1 - s beyond it; the image q = m p), so
    // s = (m f1 - b) / (m + 1).  Gregorian: a concave secondary beyond the prime focus (p = s - f1 in front of it),
    // so s = (m f1 + b) / (m - 1).  Nasmyth: a flat tertiary on the axis, a3 in front of the primary, turns the beam
    // to the side; the focus then lies backN D from the axis (b = backN D - a3).  A flat fold changes no number.
    const greg = P.tel === "greg";
    const F1 = Math.min(P.F1 || 2, P.F / 1.02), f1 = F1 * Dmm, m = P.F / F1;   // the secondary must slow the beam (m > 1)
    const a3 = P.a3 !== undefined && P.a3 !== null ? P.a3 * 1000 : 0.2 * Dmm;   // (a3 < 0: behind the primary, through its hole)
    const b = P.nasmyth ? (P.backN === undefined || P.backN === null ? 0.8 : P.backN) * Dmm - a3
                        : (P.back === undefined || P.back === null ? 0.2 : P.back) * Dmm;
    const s = greg ? (m * f1 + b) / (m - 1) : (m * f1 - b) / (m + 1);
    const p = greg ? s - f1 : f1 - s, q = m * p;
    const f2 = greg ? p * q / (p + q) : m * p / (1 - m);
    el.push({ z: 0, f: f1, kind: "primary" }, { z: s, f: f2, kind: "secondary" });
    zF = s + q;
    // the exit pupil: the image of the primary formed by the secondary (a chief ray from the primary's center)
    const u2 = 1 - s / f2;
    zXP = s - s / u2;
    Object.assign(S, { F1, f1, m, s, p, q, f2, back: b, secD: 0, greg });
    if (P.nasmyth) { S.nasmyth = true; S.a3 = a3; S.zM3 = 2 * s - a3; }   // the tertiary, along the light's path
  } else if (P.tel === "korsch" || P.tel === "pb") {
    // Three mirrors.  The drawing fixes where the mirrors and the focus sit; the secondary's and tertiary's focal
    // lengths are then the two that give the focal ratio F and put the image at that focus (paraxial: a unit ray
    // from infinity leaves the tertiary with slope u3 = -/+ 1 / (F D) and reaches the axis at the focus).
    //   Paul-Baker (Rubin): secondary at 0.62 f1, a concave tertiary at the primary's center (0.02 D in front of
    //     the vertex), the light sent back up to a focus at 0.85 of the way to the secondary (in the secondary's
    //     shadow, where the camera sits); no intermediate image.
    //   Korsch (Euclid, Roman, JWST): secondary at 0.9 f1, an intermediate image, the light through the primary's
    //     hole to a concave tertiary 0.35 D behind the primary, back to a flat 0.12 D behind the primary (with a
    //     hole for the light passing to the tertiary) that turns the beam 90 degrees, the focus 0.6 D past the flat.
    const pb = P.tel === "pb", F1 = P.F1 || (pb ? 1.2 : 1.2), f1 = F1 * Dmm;
    const s = (pb ? 0.62 : 0.9) * f1;
    let z3, zFoc, x3, xFold = null, zFold = null;
    if (pb) { x3 = -0.02 * Dmm; z3 = 2 * s + x3; const xFoc = -0.85 * s; zFoc = z3 + (x3 - xFoc); }
    else { x3 = 0.35 * Dmm; z3 = 2 * s + x3; xFold = 0.12 * Dmm; zFold = z3 + (x3 - xFold); zFoc = zFold + 0.6 * Dmm; }
    const h2 = 1 - s / f1, u3 = (pb ? -1 : 1) / (P.F * Dmm), h3 = -u3 * (zFoc - z3);
    const u2 = (h3 - h2) / (z3 - s), f2 = -h2 / (u2 + 1 / f1), f3 = h3 / (u2 - u3);
    el.push({ z: 0, f: f1, kind: "primary" }, { z: s, f: f2, kind: "secondary" }, { z: z3, f: f3, kind: "tertiary" });
    zF = zFoc;
    Object.assign(S, { F1, f1, s, f2, f3, z3, x3, xFold, zFold, tma: pb ? "pb" : "korsch", m: P.F / F1 });
    zXP = null;                                                   // found below by tracing the chief ray
  } else if (P.tel === "schmidt") {
    // the stop (the corrector, ideal: no power) at the center of curvature; a chief ray through the stop's center
    // meets the mirror at 2 f t and leaves with slope -t, so the exit pupil is the stop's own image, at 2 f
    const f1 = P.F * Dmm;
    zStop = -2 * f1;
    el.push({ z: 0, f: f1, kind: "primary" });
    zF = f1; zXP = 2 * f1;
    Object.assign(S, { F1: P.F, f1, m: 1 });
  } else if (P.tel === "prime" && P.corrector && P.F1 && Math.abs(P.F / P.F1 - 1) > 1e-6) {
    // a prime-focus corrector that changes the focal length (Subaru's, HET's): drawn as one thin lens a distance d
    // (m) before the primary's own focus, of the power that takes the primary's f/F1 cone to f/F (a Barlow lens when
    // F > F1: the image q = m d past it, m = F / F1, so 1/m = 1 + d/f_c)
    const F1 = P.F1, f1 = F1 * Dmm, m = P.F / F1, d = P.corrector.d * 1000, zC = f1 - d, fC = d / (1 / m - 1);
    el.push({ z: 0, f: f1, kind: "primary" }, { z: zC, f: fC, kind: "corrector" });
    zF = zC + m * d; zXP = null;
    Object.assign(S, { F1, f1, m, corr: { z: zC, f: fC, d } });
  } else {
    const f1 = P.F * Dmm;
    el.push({ z: 0, f: f1, kind: P.tel === "refr" ? "objective" : "primary" });
    zF = f1; zXP = 0;
    Object.assign(S, { F1: P.F, f1, m: 1 });
  }
  S.zStop = zStop;
  if (zXP === null) {
    // the exit pupil: where a chief ray (from the primary's center) crosses the axis after the last mirror
    let z = 0, h = 0, u = 1e-4;
    for (const e of el) { h += u * (e.z - z); z = e.z; u -= h / e.f; }
    zXP = z - h / u;
  }
  S.ftel = P.F * Dmm;
  S.plateTel = RAD / S.ftel;                                     // arcsec per mm at the telescope focus
  S.zF = zF; S.zXP = zXP; S.Lp = zF - zXP;                       // the exit pupil lies Lp before the focus

  // ---- reimager: collimator f_col = F W one focal length past the focus, pupil, camera f_cam = Fc W
  const reim = P.optics === "reimaged";
  S.reim = reim;
  let zDet;
  if (reim) {
    const fcol = P.F * P.W, fcam = P.Fc * P.W;
    const zC = zF + fcol;
    const zP = zC + fcol + fcol * fcol / S.Lp;                   // the pupil image (where the bundles cross)
    const zCam = zP + 0.3 * P.W;                                 // the camera just past the pupil (drawing)
    el.push({ z: zC, f: fcol, kind: "collimator" }, { z: zCam, f: fcam, kind: "camera" });
    zDet = zCam + fcam;
    Object.assign(S, { fcol, fcam, zC, zP, zCam, red: fcam / fcol });
  } else zDet = zF;
  S.zDet = zDet; S.el = el;

  // ---- the ray trace: a ray enters at the primary at height h0 with slope t; returns its (z, h) at each element
  // and at the detector
  // (the ray enters at the aperture stop, at the primary except in a Schmidt)
  const trace = (h0, t) => {
    const pts = [{ z: zStop, h: h0 }];
    let z = zStop, h = h0, u = t;
    for (const e of el) {
      h += u * (e.z - z); z = e.z;
      if (e.z !== zStop) pts.push({ z, h });
      u = u - h / e.f;
    }
    h += u * (zDet - z);
    pts.push({ z: zDet, h, u });
    return pts;
  };
  S.trace = trace;
  // measured: the effective focal length (image height per unit tan(theta), sign kept: a reimager inverts)
  const t0 = 1e-4;
  const yA = trace(0.3 * Dmm / 2, t0), yB = trace(-0.3 * Dmm / 2, t0);
  S.feffSigned = yA[yA.length - 1].h / t0;
  S.feff = Math.abs(S.feffSigned);
  S.imageSpread = Math.abs(yA[yA.length - 1].h - yB[yB.length - 1].h);   // ~0: every ray from one star meets
  S.Feff = S.feff / Dmm;
  S.plate = RAD / S.feff;                                        // arcsec per mm at the detector
  // a photographic plate: one square of emulsion with no pixels; the pixel-based numbers use the step at which the
  // plate was later scanned, and the emulsion's own spread (grain, um on the plate) adds to the image's width
  if (P.det === "plate") {
    S.isPlate = true;
    S.plateMM = P.plateMM || 355.6; S.scan = P.scan || 25; S.grain = P.grain || 25;
    P = Object.assign({}, P, { pix: S.scan, Nx: Math.round(S.plateMM * 1000 / S.scan), Ny: Math.round(S.plateMM * 1000 / S.scan), rows: [1], gapsX: null, gapsY: null, shiftY: null, extra: null });
    S.P = P;
  }
  S.pixmm = P.pix / 1000;
  S.pixScale = S.plate * S.pixmm;                                // arcsec per pixel (on axis)

  // ---- mosaic: chip centers in detector mm, rows from top to bottom, each row centered.  Optional: gapsX (the gap
  // after each column), gapsY (after each row), shiftY (a shift up the chip for each column, mm: a curved layout),
  // extra (chips placed by hand: { x, y, rot } in mm, rot turning the chip by 90 degrees)
  const cw = P.Nx * S.pixmm, ch = P.Ny * S.pixmm;
  const gx = P.gapX === undefined ? 1 : P.gapX, gy = P.gapY === undefined ? gx : P.gapY;
  const rows = P.rows && P.rows.length ? P.rows.map(n => Math.max(0, Math.round(n))) : Array(Math.max(1, Math.round(P.nRow || 1))).fill(Math.max(1, Math.round(P.nCol || 1)));
  const nR = rows.length;
  const gapX = i => (P.gapsX && P.gapsX[i] !== undefined ? P.gapsX[i] : gx), gapY = j => (P.gapsY && P.gapsY[j] !== undefined ? P.gapsY[j] : gy);
  const rowY = [0];
  for (let j = 1; j < nR; j++) rowY.push(rowY[j - 1] - ch - gapY(j - 1));
  const yMid = (rowY[0] + rowY[nR - 1]) / 2;
  const chips = [];
  rows.forEach((n, j) => {
    const xs = [0];
    for (let i = 1; i < n; i++) xs.push(xs[i - 1] + cw + gapX(i - 1));
    const xMid = (xs[0] + xs[n - 1]) / 2;
    for (let i = 0; i < n; i++) chips.push({ x: xs[i] - xMid, y: rowY[j] - yMid + (P.shiftY && P.shiftY[i] ? P.shiftY[i] : 0), w: cw, h: ch, row: j, col: i });
  });
  for (const e of P.extra || []) chips.push({ x: e.x, y: e.y, w: e.rot ? ch : cw, h: e.rot ? cw : ch, row: -1, col: -1, rot: !!e.rot });
  // the usable field, a circle on the detector (the telescope's corrected field, or an instrument's field stop):
  // the field is the part of each chip inside it, its solid angle exact for a whole chip and summed on a grid for a
  // chip the circle cuts
  S.Rcorr = S.feff * Math.tan(P.field / 60 * DEG / 2);
  const R = S.Rcorr, f = S.feff;
  let nAct = 0, om = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, rMax = 0, pixIn = 0;
  for (const c of chips) {
    const a0 = c.x - c.w / 2, a1 = c.x + c.w / 2, b0 = c.y - c.h / 2, b1 = c.y + c.h / 2;
    const near = Math.hypot(Math.max(a0, Math.min(0, a1)), Math.max(b0, Math.min(0, b1)));
    const far = Math.max(...[[a0, b0], [a0, b1], [a1, b0], [a1, b1]].map(([a, b]) => Math.hypot(a, b)));
    c.frac = 0;
    if (near >= R) { c.active = false; continue; }
    c.active = true; nAct++;
    if (far <= R) {
      c.frac = 1; om += omegaRect(a0, a1, b0, b1, f);
      x0 = Math.min(x0, a0); x1 = Math.max(x1, a1); y0 = Math.min(y0, b0); y1 = Math.max(y1, b1); rMax = Math.max(rMax, far);
    } else {
      const n = 96, dx = (a1 - a0) / n, dy = (b1 - b0) / n;
      let k = 0;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = a0 + (i + 0.5) * dx, y = b0 + (j + 0.5) * dy, r2 = x * x + y * y;
        if (r2 > R * R) continue;
        k++; om += f * dx * dy / Math.pow(f * f + r2, 1.5);
      }
      // the extent of the chip inside the circle, exactly: within the chip's rows the circle is widest at the
      // height nearest the axis (and likewise in height)
      const yc = Math.max(b0, Math.min(0, b1)), xc = Math.max(a0, Math.min(0, a1));
      const hx = Math.sqrt(Math.max(0, R * R - yc * yc)), hy = Math.sqrt(Math.max(0, R * R - xc * xc));
      x0 = Math.min(x0, Math.max(a0, -hx)); x1 = Math.max(x1, Math.min(a1, hx)); y0 = Math.min(y0, Math.max(b0, -hy)); y1 = Math.max(y1, Math.min(b1, hy));
      c.frac = k / (n * n); rMax = Math.max(rMax, Math.min(R, far));
    }
    pixIn += c.frac;
  }
  S.chips = chips; S.cw = cw; S.ch = ch; S.gapX = gx; S.gapY = gy; S.rows = rows;
  S.nChips = chips.length; S.nActive = nAct; S.nWhole = chips.filter(c => c.frac === 1).length;
  S.mosaic = { x0: Math.min(...chips.map(c => c.x - c.w / 2)), x1: Math.max(...chips.map(c => c.x + c.w / 2)),
               y0: Math.min(...chips.map(c => c.y - c.h / 2)), y1: Math.max(...chips.map(c => c.y + c.h / 2)) };
  if (!nAct) { S.bad = "No chip lies inside the field"; return S; }
  S.ext = { x0, x1, y0, y1 };                                    // the extent of the field on the chips (mm)
  S.rMax = rMax;                                                 // the farthest point of the field from the axis (mm)
  S.omega = om;                                                  // sr
  S.areaDeg2 = om / (DEG * DEG);
  // field across, as angles: through the axis in x and in y (exact under f tan(theta))
  const ang = (a, b) => Math.atan(b / S.feff) - Math.atan(a / S.feff);
  S.fieldX = ang(x0, x1) / DEG; S.fieldY = ang(y0, y1) / DEG;    // deg
  S.thetaMax = Math.atan(rMax / S.feff);                         // field radius to the farthest corner (rad)
  S.npix = Math.round(pixIn * P.Nx * P.Ny);                     // pixels inside the field
  S.etendue = S.area * S.areaDeg2;                               // m^2 deg^2

  // ---- reimager: field angles in the collimated beam, measured by tracing the chief ray of the corner
  if (reim) {
    const tc = Math.tan(S.thetaMax), pts = trace(0, tc);
    // the chief ray after the collimator: its slope, and where it crosses the axis
    let z = zStop, h = 0, u = tc;
    for (const e of el) { h += u * (e.z - z); z = e.z; u = u - h / e.f; if (e.kind === "collimator") break; }
    S.phiMax = Math.atan(Math.abs(u));                           // half-angle of the field in the beam (rad)
    // a pyramid at the focus sends each quadrant to its own camera, centered on that quadrant: each camera takes the
    // half-diagonal of one chip (the farthest point from its own axis), not the whole field
    if (P.split === "pyramid") {
      S.split = true;
      let r = 0;
      for (const c of chips) if (c.active) r = Math.max(r, Math.hypot(c.w / 2, c.h / 2));
      S.phiMax = Math.atan(r / S.fcam);
      S.quad = r;
    }
    S.zPtraced = z - h / u;                                      // where the chief ray crosses the axis
    S.focalField = 2 * S.ftel * tc;                              // the field's diameter at the telescope focus (mm)
    S.beamMag = P.D * 1000 / P.W;                                // the angular magnification D / W
    void pts;
  }

  // ---- PSF: diffraction (annular Airy) and seeing (Moffat); lambda only enters the diffraction width
  S.fwhmDiff = airyFWHM(eps) * P.lam * 1e-3 / Dmm * RAD;          // arcsec
  // seeing (from the ground), the optics' own blur (a camera whose aberrations set the image, as TESS's lenses do),
  // or diffraction alone; the first two drawn as Moffat profiles with the diffraction width added in quadrature
  const blur = P.psf === "optics" ? (P.blur || 1) : P.seeing;
  S.fwhm = P.psf === "diff" ? S.fwhmDiff : Math.sqrt(blur * blur + S.fwhmDiff * S.fwhmDiff);
  if (S.isPlate) { S.fwhmEmul = S.grain / 1000 * S.plate; S.fwhm = Math.sqrt(S.fwhm * S.fwhm + S.fwhmEmul * S.fwhmEmul); }
  S.sampling = S.fwhm / S.pixScale;                              // pixels per FWHM
  S.nyquistPix = P.lam * 1e-3 / (2 * Dmm) * RAD;                 // the pixel that Nyquist-samples the optics' cutoff, lambda / 2D

  // ---- flags
  if (S.sampling < 2) flag("samp", S.isPlate ? "the scan undersamples the image" : "undersampled");
  return S;
}

// the default imager (the page's Reset all): a 4 m f/3 prime-focus telescope with a 3 x 3 mosaic of 4k x 4k chips
const DEF = {
  D: 4, F: 3, eps: 0.3, field: 120, tel: "prime", F1: 2, back: 0.2,
  nasmyth: false, backN: 0.8, nasSide: "down", det: "ccd", plateMM: 355.6, scan: 25, grain: 25, split: "none",
  band: "r", psf: "seeing", seeing: 0.8, blur: 1,
  optics: "direct", W: 100, Fc: 2,
  Nx: 4096, Ny: 4096, pix: 15, rows: null, nCol: 3, nRow: 3, gapX: 1, gapY: 1, gapsX: null, gapsY: null, shiftY: null, extra: null,
};
const API = { RAD, DEG, DEF, J1, airy, airyFWHM, airyTable, moffatAlpha, omegaRect, design };
if (typeof module !== "undefined" && module.exports) module.exports = API;
root.IM = API;
})(typeof window !== "undefined" ? window : globalThis);
