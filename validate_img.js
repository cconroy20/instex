// Physics checks for web/imager.js (the Imager mode):  node validate_img.js
// 1. Ideal imaging: every ray from one star meets at one point; the image height is f_eff tan(theta).
// 2. Plate and pixel scale against 206265 / f_eff, direct (f_eff = F D) and reimaged (f_eff = F_cam D).
// 3. The Cassegrain: secondary placement, magnification and exit pupil against the closed forms.
// 4. The reimager: pupil position f_col + f_col^2 / L, beam field angle tan(phi) = (D / W) tan(theta), beam W.
// 5. The mosaic: chip counts, the corrected-field cut, the solid angle against small-angle area and a brute sum.
// 6. The PSF: Airy FWHM 1.029 lambda / D unobstructed and its fall with obstruction; the Moffat width.
"use strict";
const IM = require("./web/imager.js");

let nfail = 0, npass = 0;
function check(name, ok, detail) {
  ok ? npass++ : nfail++;
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail !== undefined ? "  --  " + detail : ""}`);
}
const rel = (a, b) => Math.abs(a / b - 1);
const RAD = IM.RAD, DEG = IM.DEG;
const base = { D: 4, eps: 0.3, F: 3, tel: "prime", field: 120, optics: "direct", W: 100, Fc: 2, lam: 0.6,
  psf: "seeing", seeing: 0.8, Nx: 4096, Ny: 4096, pix: 15, nCol: 3, nRow: 3, gapX: 1, gapY: 1 };
const mk = o => IM.design(Object.assign({}, base, o));

// ---------------------------------------------------------------- 1, 2. imaging and scales
for (const [lab, o] of [["prime direct", {}], ["cass direct", { tel: "cass", F: 15, F1: 1.75 }],
                        ["prime reimaged", { optics: "reimaged" }], ["cass reimaged", { tel: "cass", F: 15, F1: 1.75, optics: "reimaged", W: 150, Fc: 1.5 }]]) {
  const S = mk(o), Dmm = S.Dmm;
  // rays across the aperture for an off-axis star meet at one point
  const t = Math.tan(0.3 * DEG);
  const hs = [-1, -0.6, 0.4, 0.95].map(a => { const p = S.trace(a * Dmm / 2, t); return p[p.length - 1].h; });
  const spread = Math.max(...hs) - Math.min(...hs);
  check(`${lab}: one star, one image point`, spread < 1e-9 * Dmm, spread.toExponential(2) + " mm");
  check(`${lab}: image height = f_eff tan(theta)`, rel(Math.abs(hs[0]), S.feff * t) < 1e-12, (hs[0]).toFixed(4) + " mm");
  const feff = S.reim ? S.P.Fc * Dmm : S.P.F * Dmm;
  check(`${lab}: f_eff = ${S.reim ? "F_cam" : "F"} D`, rel(S.feff, feff) < 1e-12, S.feff.toFixed(3) + " mm");
  check(`${lab}: pixel scale 206265 p / f_eff`, rel(S.pixScale, RAD * S.P.pix * 1e-3 / feff) < 1e-12, S.pixScale.toFixed(5) + "″/px");
  if (S.reim) check(`${lab}: image inverted by the reimager`, S.feffSigned * (S.P.tel === "cass" ? 1 : 1) !== 0 && Math.sign(S.feffSigned) !== Math.sign(mk(Object.assign({}, o, { optics: "direct" })).feffSigned));
}
{
  const S = mk({});
  check("plate scale at the telescope focus 206265 / (F D)", rel(S.plateTel, RAD / 12000) < 1e-12, S.plateTel.toFixed(4) + "″/mm");
  check("default: 0.258″/px (206265 x 0.015 / 12000)", Math.abs(S.pixScale - 0.25783) < 1e-4, S.pixScale.toFixed(5));
}

// ---------------------------------------------------------------- 3. Cassegrain
{
  const S = mk({ tel: "cass", F: 15, F1: 1.75, back: 0.2 }), D = S.Dmm;
  check("Cassegrain magnification m = F / F1", rel(S.m, 15 / 1.75) < 1e-12, S.m.toFixed(4));
  check("focus lies b behind the primary: s + q = s + ... = b + s", Math.abs(S.zF - S.s - S.q) < 1e-9 && Math.abs(S.zF - 2 * S.s - 0.2 * D) < 1e-6, (S.zF - 2 * S.s).toFixed(3) + " mm");
  // the secondary images the prime focus: 1/q = 1/f2 + 1/p (converging beam onto a lens)
  check("secondary images the prime focus (1/q = 1/p + 1/f2)", rel(1 / S.q, 1 / S.p + 1 / S.f2) < 1e-12);
  // exit pupil by Gaussian optics: the primary (object at distance s in front of the secondary) imaged by f2
  const vi = 1 / (1 / S.f2 - 1 / S.s);                            // image distance (negative: virtual, before the secondary)
  check("exit pupil = the primary imaged by the secondary", Math.abs((S.s + vi) - S.zXP) < 1e-6 * D, (S.zXP / 1000).toFixed(3) + " m");
  check("the obstructed center is blocked geometrically by a secondary of p / f1 of D", S.p / S.f1 > 0 && S.p / S.f1 < 0.5, (S.p / S.f1).toFixed(3));
}

// ---------------------------------------------------------------- 4. reimager
for (const o of [{ optics: "reimaged" }, { optics: "reimaged", tel: "cass", F: 11, F1: 2, W: 120, Fc: 2.5 }]) {
  const S = mk(o);
  check(`reimager (${S.P.tel}): pupil at f_col + f_col^2 / L past the collimator`, rel(S.zPtraced - S.zC, S.fcol + S.fcol * S.fcol / S.Lp) < 1e-9, ((S.zPtraced - S.zC)).toFixed(2) + " mm");
  check(`reimager (${S.P.tel}): tan(phi) = (D / W) tan(theta)`, rel(Math.tan(S.phiMax), S.beamMag * Math.tan(S.thetaMax)) < 1e-9, (S.phiMax / DEG).toFixed(3) + "°");
  // the beam: rays from one star after the collimator are parallel and W wide (on axis)
  const z = S.zC + 1;
  const hAt = a => { let zz = 0, h = a * S.Dmm / 2, u = 0; for (const e of S.el) { h += u * (e.z - zz); zz = e.z; u -= h / e.f; if (e.kind === "collimator") break; } return [h + u * (z - zz), u]; };
  const [hp, up] = hAt(1), [hm, um] = hAt(-1);
  check(`reimager (${S.P.tel}): collimated beam W wide`, rel(Math.abs(hp - hm), S.P.W) < 1e-9 && Math.abs(up) < 1e-12 && Math.abs(um) < 1e-12, Math.abs(hp - hm).toFixed(4) + " mm");
  check(`reimager (${S.P.tel}): f_cam / f_col = F_cam / F`, rel(S.red, S.P.Fc / S.P.F) < 1e-12, S.red.toFixed(4));
}

// ---------------------------------------------------------------- 5. mosaic and field
{
  const S = mk({});
  check("3 x 3 mosaic: 9 chips, 151 Mpix", S.nChips === 9 && S.nActive === 9 && S.npix === 9 * 4096 * 4096, S.npix);
  const ar = S.cw * S.ch * 9 / (S.feff * S.feff) / (DEG * DEG);
  check("solid angle ≈ small-angle area for a 0.9° field", rel(S.areaDeg2, ar) < 3e-4, S.areaDeg2.toFixed(5) + " vs " + ar.toFixed(5));
  // a brute-force sum of cos^3 over a wide chip
  const f = 1000, a0 = -300, a1 = 500, b0 = -100, b1 = 400, n = 800;
  let s = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = a0 + (i + 0.5) * (a1 - a0) / n, y = b0 + (j + 0.5) * (b1 - b0) / n; s += f / Math.pow(f * f + x * x + y * y, 1.5) * f; }
  s *= (a1 - a0) * (b1 - b0) / (n * n) / f;
  const ex = IM.omegaRect(a0, a1, b0, b1, f);
  check("rectangle solid angle (exact) vs brute sum", rel(ex, s) < 1e-5, ex.toFixed(6) + " sr");
  const R = mk({ rows: [9, 9, 9, 15, 15, 15, 15, 15, 15, 15, 15, 15, 9, 9, 9], gapX: 0.5 });
  check("rows 9,9,9,15x9,9,9,9 = 189 chips", R.nChips === 189, R.nChips);
  // a 40′ field circle on the 0.88° mosaic: only the center chip is whole; the field is the mosaic inside the circle
  const C = mk({ field: 40 });
  {
    const f = C.feff, R = C.Rcorr, n = 1500;
    let om = 0, inPix = 0;
    for (const c of C.chips) {
      const dx = c.w / n, dy = c.h / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = c.x - c.w / 2 + (i + 0.5) * dx, y = c.y - c.h / 2 + (j + 0.5) * dy, r2 = x * x + y * y;
        if (r2 <= R * R) { om += f * dx * dy / Math.pow(f * f + r2, 1.5); inPix += 1; }
      }
    }
    const a = om / (DEG * DEG);
    check("field circle 40′ on a 3 x 3 mosaic: 1 whole chip, 9 cut", C.nWhole === 1 && C.nActive === 9, C.nWhole + " whole");
    check("field area = the mosaic inside the circle (brute sum)", rel(C.areaDeg2, a) < 2e-3, C.areaDeg2.toFixed(5) + " vs " + a.toFixed(5) + " deg²");
    check("pixels inside the circle (brute count)", rel(C.npix, inPix / (n * n) * 4096 * 4096) < 3e-3, C.npix);
    check("field across = the circle's diameter when the circle cuts the mosaic", Math.abs(C.fieldX * 60 - 40) < 0.1, (C.fieldX * 60).toFixed(3) + "′");
  }
  // gaps by column and row, a column shift and hand-placed chips
  {
    const G = mk({ nCol: 4, nRow: 2, gapsX: [1, 10, 1], gapsY: [5] });
    const xs = G.chips.filter(c => c.row === 0).map(c => c.x), w = G.cw;
    check("gapsX: a wide gap between the two halves", Math.abs((xs[2] - xs[1]) - (w + 10)) < 1e-9 && Math.abs((xs[1] - xs[0]) - (w + 1)) < 1e-9 && Math.abs(xs[0] + xs[3]) < 1e-9);
    check("gapsY: rows 5 mm apart, centered", Math.abs((G.chips[0].y - G.chips[4].y) - (G.ch + 5)) < 1e-9 && Math.abs(G.chips[0].y + G.chips[4].y) < 1e-9);
    const E = mk({ nCol: 1, nRow: 1, extra: [{ x: 100, y: 0, rot: true }], Nx: 2048, Ny: 4096 });
    check("extra chip turned by 90°", E.nChips === 2 && Math.abs(E.chips[1].w - 4096 * 0.015) < 1e-9 && Math.abs(E.chips[1].h - 2048 * 0.015) < 1e-9);
  }
  check("field across (x) = 2 atan(half width / f_eff)", rel(S.fieldX, 2 * Math.atan(S.ext.x1 / S.feff) / DEG) < 1e-12, S.fieldX.toFixed(4) + "°");
  check("étendue = area x field", rel(S.etendue, Math.PI / 4 * 16 * (1 - 0.09) * S.areaDeg2) < 1e-12, S.etendue.toFixed(3) + " m² deg²");
}

// ---------------------------------------------------------------- 6. PSF
{
  check("J1 at its first zero 3.8317", Math.abs(IM.J1(3.831706)) < 1e-6, IM.J1(3.831706).toExponential(2));
  check("J1(1) = 0.440051", Math.abs(IM.J1(1) - 0.4400505857) < 1e-9);
  check("J1(20) = 0.066833", Math.abs(IM.J1(20) - 0.0668331242) < 1e-9);
  check("Airy FWHM = 1.029 lambda / D (unobstructed)", Math.abs(IM.airyFWHM(0) - 1.029) < 5e-4, IM.airyFWHM(0).toFixed(4));
  check("first dark ring at 1.22 lambda / D", IM.airy(1.2197 * Math.PI, 0) < 1e-8);
  const f3 = IM.airyFWHM(0.3), f5 = IM.airyFWHM(0.5);
  // an independent calculation (data/imaging/constants.md, checked against Mahajan's first-dark-ring radii)
  const ref = [[0.2, 1.007], [0.3, 0.981], [0.4, 0.949], [0.5, 0.912]];
  check("annular Airy FWHM vs the constants table (eps 0.2-0.5)", ref.every(([e, v]) => Math.abs(IM.airyFWHM(e) - v) < 6e-4), ref.map(([e]) => IM.airyFWHM(e).toFixed(4)).join(", "));
  check("obstruction narrows the core (eps 0.3, 0.5)", f3 < IM.airyFWHM(0) && f5 < f3, f3.toFixed(4) + ", " + f5.toFixed(4));
  const S = mk({ psf: "diff", lam: 2.2, D: 10, eps: 0 });
  check("10 m at 2.2 µm: diffraction FWHM 46.7 mas", Math.abs(S.fwhmDiff - 1.029 * 2.2e-6 / 10 * RAD) < 0.05e-3, (S.fwhmDiff * 1000).toFixed(2) + " mas");
  const Q = mk({ seeing: 0.8 });
  check("seeing and diffraction add in quadrature", rel(Q.fwhm, Math.hypot(0.8, Q.fwhmDiff)) < 1e-12, Q.fwhm.toFixed(4) + "″");
  check("sampling = FWHM / pixel scale", rel(Q.sampling, Q.fwhm / Q.pixScale) < 1e-12, Q.sampling.toFixed(3));
  const al = IM.moffatAlpha(1, 4.765), half = Math.pow(1 + Math.pow(0.5 / al, 2), -4.765);
  check("Moffat alpha gives the FWHM", Math.abs(half - 0.5) < 1e-12);
}

// ---------------------------------------------------------------- 7. presets against their published values
{
  global.window = global;
  require("./web/ipresets.js");
  const band = k => window.IX_BANDS.find(b => b.k === k).lam;
  const Q = {
    pixScale: S => S.pixScale, fieldX: S => S.fieldX * 60, fieldY: S => S.fieldY * 60, area: S => S.areaDeg2,
    npix: S => S.npix, etendue: S => S.etendue,
  };
  const ids = new Set();
  for (const p of window.IX_IPRESETS) {
    check(`${p.id}: unique id, group, name`, !ids.has(p.id) && p.tel && p.name.includes(" / ")); ids.add(p.id);
    const P = Object.assign(JSON.parse(JSON.stringify(IM.DEF)), p.state);
    P.lam = band(P.band);
    const S = IM.design(P);
    check(`${p.id}: designs without error, every chip in the field circle at least in part`, !S.bad && S.nActive === S.nChips, S.bad || `${S.nWhole}/${S.nChips} whole`);
    for (const e of p.pub || []) {
      const v = Q[e.q](S), r = v / e.value - 1, fmt = x => (Math.abs(x) >= 1e5 ? x.toExponential(4) : +x.toPrecision(5));
      if (e.info) console.log(`[INFO] ${p.id}: ${e.what}: model ${fmt(v)} (${(100 * r).toFixed(2)}%) -- ${e.src}`);
      else check(`${p.id}: ${e.what}`, Math.abs(r) <= e.tol, `model ${fmt(v)}, ${(100 * r).toFixed(2)}% (tol ${(100 * e.tol).toFixed(1)}%)`);
    }
  }
}

console.log(`\n${npass} pass, ${nfail} fail`);
if (nfail) process.exit(1);
