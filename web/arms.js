/* The multi-arm instruments in one view (window.ARMSAPP): every arm of an instrument at once, with the dichroics that
   split the light between the arms.  The page's Setting menu offers "All arms" for the instruments listed in GROUPS;
   app.js then designs each arm (the arm being edited from the page's state, the others from their presets or their
   own earlier edits) and hands the designs here.  Drawn: the layout (the shared slit and collimator, or the telescope's
   beam for an instrument split ahead of its slits; the dichroics; and each arm's disperser, camera and detector, all to
   one scale), the detectors (every chip to one scale with its spectra, and a strip of the arms' wavelength coverage
   with the dichroics' crossovers), and a stats strip with each arm's range and resolution.

   GROUPS: the dichroic tree of each instrument, from the research records (data/presets_research.md, data/round4/,
   data/round5/): a node { cut (A), w (transition width, A), aoi (deg), R: branch reflected, T: branch transmitted, src };
   a branch is a preset id (an arm) or another node.  split: "collimated" -- the dichroics stand in the collimated beam
   after one slit and collimator; "telescope" -- in the telescope's converging beam, each arm with its own slit.

   The layout is schematic in one respect, stated in its caption: the angles at the dichroics (180 - 2 AOI) and at the
   gratings are true, but which way each element turns the light and the distances between the elements are chosen
   to keep the arms clear of one another.  The choice is a small search: every combination of the turning senses, then
   the branch lengths one at a time, scored by how far the parts overlap (convex pieces, separating-axis depth) and by
   how large the drawing can be in the panel.  The result is kept while the design stays in the same coarse bin, so the
   drawing does not jump while a slider moves. */
(function (root) {
"use strict";
const GROUPS = {
  // DESI (D22 Sec. 7.2): the NIR-pass dichroic (>95% R 360-757 nm, >95% T 772-980 nm, mean AOI 25.4 deg) sends the NIR
  // straight on and reflects the rest to the red-pass dichroic (>95% R 360-566 nm, >95% T 593-772 nm, AOI 32.1 deg);
  // crossovers DERIVED as the middle of each specification gap
  "DESI": { split: "collimated", tree: { cut: 7645, w: 150, aoi: 25.4, src: "D22 Sec. 7.2 (NIR-pass; crossover DERIVED)",
    R: { cut: 5795, w: 270, aoi: 32.1, src: "D22 Sec. 7.2 (red-pass; crossover DERIVED)", R: "desib", T: "desir" }, T: "desiz" } },
  // Boombox: the bands 3600-5900 and 5700-10100 A (Via Science Book) overlap at 5700-5900 A: one dichroic there (INFERRED;
  // which side it reflects is not published)
  "Boombox (partly inferred)": { split: "collimated", tree: { cut: 5800, w: 200, aoi: 45, inferred: true, src: "the bands' overlap (INFERRED)", R: "boomboxb", T: "boomboxr" } },
  // PFS (V14 Sec. 3): "the first dichroic reflects the Blue part of the spectrum and the second reflects the Red while the
  // NIR is transmitted"; splits at the channel edges 640 and 955 nm (SM16), transitions ~20 nm (T16); angles not published
  "PFS": { split: "collimated", tree: { cut: 6400, w: 200, aoi: 45, noAoi: true, src: "V14; SM16 channel edges", R: "pfsb",
    T: { cut: 9550, w: 200, aoi: 45, noAoi: true, src: "V14; SM16 channel edges", R: "pfsr", T: "pfsn" } } },
  // 4MOST LRS (L20 Sec. 4.2): the red dichroic 706 nm at 35.35 deg, the blue dichroic 539 nm at 43.58 deg, transitions
  // 30 nm (measured 524-554 and 691-721 nm, D22); the order of the two is INFERRED
  "4MOST LRS": { split: "collimated", tree: { cut: 7060, w: 300, aoi: 35.35, src: "L20 Sec. 4.2 (red dichroic)",
    R: { cut: 5390, w: 300, aoi: 43.58, src: "L20 Sec. 4.2 (blue dichroic)", R: "4mostlb", T: "4mostlg" }, T: "4mostlr" } },
  // 4MOST HRS: only the arm bands are published (392.6-435.5, 516-573, 610-679 nm); the splits are INFERRED in the gaps
  "4MOST HRS (effective optics)": { split: "collimated", tree: { cut: 5915, w: 300, aoi: 45, inferred: true, noAoi: true, src: "INFERRED in the band gap",
    R: { cut: 4758, w: 300, aoi: 45, inferred: true, noAoi: true, src: "INFERRED in the band gap", R: "4mosthb", T: "4mosthg" }, T: "4mosthr" } },
  // LLAMAS (F20): two dichroics at 475 and 690 nm; the first is split in two halves and carries the fiber slit plate;
  // the order of the reflections is INFERRED
  "LLAMAS (gratings fitted)": { split: "collimated", tree: { cut: 6900, w: 200, aoi: 45, noAoi: true, src: "F20 (690 nm)",
    R: { cut: 4750, w: 200, aoi: 45, noAoi: true, src: "F20 (475 nm)", R: "llamasb", T: "llamasg" }, T: "llamasr" } },
  // KCWI + KCRM (KSPEC; M18 Fig. 2): a 560 nm dichroic takes the place of the blue arm's fold mirror
  "KCWI": { split: "collimated", tree: { cut: 5600, w: 200, aoi: 45, noAoi: true, src: "KSPEC Table 1 (560 nm)", R: "kcwib", T: "kcrm" } },
  // X-Shooter (V11 Secs. 2.2.5, 3.2): two dichroics at 15 deg in the telescope's beam, crossovers 559.5 and 1024 nm; the
  // first reflects the UVB, the second the VIS; each arm has its own slit
  "X-Shooter": { split: "telescope", tree: { cut: 5595, w: 300, aoi: 15, src: "V11 Secs. 2.2.5, 3.2", R: "xshuvb",
    T: { cut: 10240, w: 400, aoi: 15, src: "V11 Secs. 2.2.5, 3.2", R: "xshvis", T: "xshnir" } } },
  // MIKE (LCO manual, May 2004): a dichroic of ~495 nm crossover ahead of the two slits (B03: the original 455 nm one
  // reflected the blue, "80% reflectance by 440nm and 80% transmission by 480nm"); its angle is not published
  "MIKE": { split: "telescope", tree: { cut: 4950, w: 400, aoi: 45, noAoi: true, src: "LCO manual (May 2004)", R: "mikeblue", T: "mikered" } },
  // UVES (UM117 Sec. 2.1): the standard DIC1 390+580 setting, dichroic DIC1 at 450 nm ahead of the two slits; its
  // angle is not published
  "UVES": { split: "telescope", tree: { cut: 4500, w: 300, aoi: 45, noAoi: true, src: "UVES manual Sec. 2.1 (DIC1)", R: "uvesb", T: "uvesr" } },
};
const leaves = n => (typeof n === "string" ? [n] : [...leaves(n.R), ...leaves(n.T)]);
const nodes = n => (typeof n === "string" ? [] : [n, ...nodes(n.R), ...nodes(n.T)]);
// the controls that one arm's edit sets for every arm: the telescope always; for a split in the collimated beam also
// the slit, the fibers and the collimator, which the arms share (top-level keys, and keys of the mode's scope)
const SHARED_COLL = { top: ["D", "F"], m: ["slitW", "nObj", "W", "col", "telF", "fibAp"] }, SHARED_TEL = { top: ["D"], m: [] };

root.ARMSAPP = function (H) {
  const { fitCanvas, lamRGB, rgba, sig, grp, mm, FONT, INK, MUTED, message, makeTraces, splatTraces } = H;
  const DEG = Math.PI / 180, ACCENT = "#1f4e79";
  const group = inst => GROUPS[inst] || null;
  const armIds = inst => (GROUPS[inst] ? leaves(GROUPS[inst].tree) : []);
  const cuts = inst => (GROUPS[inst] ? nodes(GROUPS[inst].tree) : []);
  const shared = inst => (GROUPS[inst] && GROUPS[inst].split === "telescope" ? SHARED_TEL : SHARED_COLL);
  const v = (x, y) => [x, y], ad = (p, q) => [p[0] + q[0], p[1] + q[1]], sub = (p, q) => [p[0] - q[0], p[1] - q[1]], sc = (p, s) => [p[0] * s, p[1] * s];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
  const rot = (p, t) => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];
  const nrm = p => { const n = Math.hypot(p[0], p[1]) || 1; return [p[0] / n, p[1] / n]; };
  const perp = p => [-p[1], p[0]];
  const GLASS = "rgba(150,196,232,0.35)", GLASS_E = "#3f6d96", STEEL = "#5f6872", DICH = "rgba(230,190,90,0.55)", DICH_E = "#9a7a2c";
  const WHITE_F = "rgba(104,98,92,0.07)", WHITE_S = "rgba(104,98,92,0.32)";
  const ECH_ANG = 34 * DEG;                       // an echelle's camera arm, drawn this far off the returning beam
  const RET = 36 * DEG;                           // a mirror collimator returns the beam this far off the slit's axis

  // the convex hull (Andrew's monotone chain), counterclockwise
  function hull(P) {
    const p = P.filter(q => isFinite(q[0]) && isFinite(q[1])).slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // how deep two convex pieces overlap (the separating-axis test), counting a clearance gap as overlap; 0 if apart
  function depth(A, B, gap) {
    let best = Infinity;
    for (const Pg of [A, B]) for (let i = 0; i < Pg.length; i++) {
      const n = nrm(perp(sub(Pg[(i + 1) % Pg.length], Pg[i])));
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (const q of A) { const d = dot(q, n); a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
      for (const q of B) { const d = dot(q, n); b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
      const o = Math.min(a1 - b0, b1 - a0) + gap;
      if (o <= 0) return 0;
      best = Math.min(best, o);
    }
    return best;
  }
  const bandRGB = (lo, hi) => lamRGB((lo + hi) / 2 * 1e4);

  // ---- one arm's optics in its own frame: the light arrives along +x at the origin (the disperser, or for an arm with
  // its own slit, the slit); flip mirrors the arm about its axis.  Returns the primitives, the labels, and the convex
  // pieces that the layout keeps apart
  function unit(a, flip, tele) {
    const P = a.P, D = a.D, prims = [], labs = [], pieces = [];
    if (D.bad || !D.c) return { prims, labs, pieces: [[v(0, -1), v(1, 0), v(0, 1)]], bad: true };
    const ech = P.mode === "echelle", W = P.W, Wp = Math.max(W, D.Wp || W), fK = D.fcam, tint = bandRGB(D.range[0], D.range[1]);
    const bf = rgba(tint, 0.1), bs = rgba(tint, 0.4);
    // the arm's own slit and collimator (an instrument split in the telescope's beam): the disperser then sits at O,
    // the collimated beam arriving along dIn; cs picks the side the camera turns to
    let O = v(0, 0), dIn = v(1, 0), cs = 1;
    const chain = [];
    if (tele) {
      const fCa = D.fcol || P.F * W;
      prims.push({ k: "slit", p: v(0, 0), ax: v(1, 0), h: 0.05 * W + 6 });
      labs.push({ at: v(0, 0), txt: "slit", sub: sig(P.slitW, 2) + "″", pri: 1, dir: v(0, -1), optional: true });
      if (P.col === "mirror") {
        // a mirror collimator folds the beam back RET off the slit's axis, to the disperser beside the arriving cone;
        // the camera then turns away from the cone
        const M = v(fCa, 0), r = rot(v(-1, 0), RET), nM = nrm(sub(r, v(1, 0))), tM = perp(nM), hf = 0.5 * W / Math.cos(RET / 2), hm = 1.12 * hf;
        const gapC = Math.max(1.3 * W + 40, 1.7 * W / Math.sin(RET));
        O = ad(M, sc(r, gapC)); dIn = r; cs = -1;
        prims.push({ k: "poly", p: [v(0, 0), ad(M, sc(tM, hf)), ad(M, sc(tM, -hf))], fill: bf, stroke: bs });
        const n = perp(r);
        prims.push({ k: "poly", p: [ad(M, sc(tM, hf)), ad(O, sc(n, -W / 2)), ad(O, sc(n, W / 2)), ad(M, sc(tM, -hf))], fill: bf, stroke: bs });
        prims.push({ k: "mirror", c: M, t: tM, n: nM, h: hm });
        chain.push(v(0, 0.08 * W), v(0, -0.08 * W), ad(M, sc(tM, hm)), ad(M, sc(tM, -hm)), ad(ad(M, sc(tM, hm)), sc(nM, -0.1 * W)), ad(ad(M, sc(tM, -hm)), sc(nM, -0.1 * W)));
      } else {
        const gapC = (ech ? 1.7 : 1.3) * W + 40;
        prims.push({ k: "poly", p: [v(0, 0), v(fCa, W / 2), v(fCa, -W / 2)], fill: bf, stroke: bs });
        prims.push({ k: "poly", p: [v(fCa, W / 2), v(fCa + gapC, W / 2), v(fCa + gapC, -W / 2), v(fCa, -W / 2)], fill: bf, stroke: bs });
        prims.push({ k: "lens", c: v(fCa, 0), ax: v(1, 0), h: 0.56 * W });
        chain.push(v(0, 0.08 * W), v(0, -0.08 * W), v(fCa, 0.6 * W), v(fCa, -0.6 * W));
        O = v(fCa + gapC, 0);
      }
    }
    // the disperser, in a frame where the beam arrives along +x at the origin, then turned and moved to O.  The
    // camera's direction: a reflection grating turns the beam back by the camera-collimator angle, an echelle (drawn
    // with its camera arm off the returning beam, as in the Spectral view) back by ECH_ANG, a transmission or VPH
    // grating deviates it forward by alpha + beta, a grism passes it straight
    const th = Math.atan2(dIn[1], dIn[0]), X = q => ad(O, rot(q, th)), XD = q => rot(q, th);
    const inc = v(1, 0);
    let e, nG;
    if (ech) { e = rot(v(-1, 0), -cs * ECH_ANG); nG = nrm(sub(e, inc)); }
    else if (P.gType === "refl") { e = rot(v(-1, 0), -cs * (D.psi || 0)); nG = nrm(sub(e, inc)); }
    else if (P.gType === "grism") { e = inc; nG = inc; }
    else { e = rot(inc, cs * ((D.alpha || 0) + (D.beta || 0))); nG = rot(inc, cs * (D.alpha || 0)); }
    const refl = ech || P.gType === "refl", tG = perp(nG);
    const gHalf = 0.55 * W / Math.max(0.25, Math.abs(dot(nG, inc)));
    const dC = 0.55 * Wp + 0.12 * fK + (ech ? 0.5 * Wp : 0), C = sc(e, dC), Dc = ad(C, sc(e, fK)), t = perp(e);
    // the rays: the chip's range in the central order (grating) or the reference order (echelle), and its middle
    const o = ech ? (D.orders.find(q => q.m === D.mRef) || D.orders[Math.floor(D.orders.length / 2)]) : null;
    const m = ech ? (o ? o.m : D.mRef) : D.order, lo = ech ? (o ? o.lo : P.lamC / 1e4) : D.range[0], hi = ech ? (o ? o.hi : P.lamC / 1e4) : D.range[1];
    const camHalf = [0.6 * Wp], focus = [];
    const g0 = sc(tG, gHalf * 0.85), g1 = sc(tG, -gHalf * 0.85);
    for (const l of [lo, (lo + hi) / 2, hi]) {
      const pq = D.pos(l, m);
      if (!pq) continue;
      const b = nrm(rot(e, cs * Math.atan(pq[0] / fK))), Q = ad(Dc, sc(t, cs * pq[0]));
      const toCam = p => { const s = dot(sub(C, p), e) / dot(b, e); return ad(p, sc(b, s)); };
      const c0 = toCam(g0), c1 = toCam(g1);
      camHalf.push(Math.abs(dot(sub(c0, C), t)), Math.abs(dot(sub(c1, C), t)));
      const col = lamRGB(l * 1e4);
      prims.push({ k: "poly", p: [g0, c0, Q, c1, g1].map(X), fill: rgba(col, 0.16), stroke: rgba(col, 0.55) });
      focus.push(Q);
    }
    const ch = 1.08 * Math.max(...camHalf);
    prims.push({ k: "line", p: [X(sc(tG, gHalf)), X(sc(tG, -gHalf))], col: refl ? STEEL : GLASS_E, lw: refl ? 4 : 3 });
    prims.push({ k: "lens", c: X(C), ax: XD(e), h: ch });
    prims.push({ k: "line", p: [X(ad(Dc, sc(t, D.Lx / 2))), X(ad(Dc, sc(t, -D.Lx / 2)))], col: "#33373d", lw: 5 });
    const gName = ech ? "echelle" : P.gType === "grism" ? "grism" : P.gType === "refl" ? "grating" : P.gKind === "vph" || /VPH/i.test(a.name) ? "VPH" : "grating";
    const gSub = ech ? sig(P.eG, 3) + " /mm" : sig(P.G, 4) + " /mm";
    // the grating's label beyond its end on the side away from the camera, the arm's beyond its detector
    const far = dot(tG, e) <= 0 ? tG : sc(tG, -1);
    labs.push({ at: X(sc(far, gHalf)), txt: gName, sub: gSub, pri: 3, dir: XD(far) });
    labs.push({ at: X(ad(Dc, sc(e, 6))), txt: a.name, sub: grp(D.range[0] * 1e4) + "–" + grp(D.range[1] * 1e4) + " Å", pri: 5, dir: XD(e), arm: a.id });
    const gEnds = [X(sc(tG, gHalf)), X(sc(tG, -gHalf))];
    if (tele) pieces.push(hull([...chain, ...gEnds, X(v(0, 0.55 * W)), X(v(0, -0.55 * W))]));
    pieces.push(hull([...gEnds, ...[ad(C, sc(t, ch)), ad(C, sc(t, -ch)), ad(Dc, sc(t, D.Lx / 2)), ad(Dc, sc(t, -D.Lx / 2)), ad(Dc, sc(e, 0.08 * fK)), ...focus].map(X)]));
    if (flip < 0) {
      const F = p => [p[0], -p[1]];
      for (const pr of prims) { if (pr.p && Array.isArray(pr.p[0])) pr.p = pr.p.map(F); else if (pr.p) pr.p = F(pr.p); if (pr.c) pr.c = F(pr.c); if (pr.ax) pr.ax = F(pr.ax); if (pr.t) pr.t = F(pr.t); if (pr.n) pr.n = F(pr.n); }
      for (const L of labs) { L.at = F(L.at); L.dir = F(L.dir); }
      for (let i = 0; i < pieces.length; i++) pieces[i] = pieces[i].map(F).reverse();
    }
    return { prims, labs, pieces, tint };
  }

  // ---- the scene for one choice of turning senses and lengths (cfg), in world mm: primitives, labels, and the
  // bodies (convex pieces tagged with the nodes they join; bodies that share a node may touch)
  function scene(G, arms, cfg) {
    const byId = Object.fromEntries(arms.map(a => [a.id, a])), a0 = arms.find(a => !a.D.bad && a.D.c) || arms[0];
    const tele = G.split === "telescope", W = a0.P.W, prims = [], labs = [], bodies = [];
    const body = (pieces, tags) => bodies.push({ pieces: pieces.filter(p => p.length >= 3), tags });
    const band = n => { const ls = leaves(n).map(id => byId[id]).filter(a => a && !a.D.bad && a.D.c); return ls.length ? [Math.min(...ls.map(a => a.D.range[0])), Math.max(...ls.map(a => a.D.range[1]))] : null; };
    const fill = bd => (bd ? rgba(bandRGB(bd[0], bd[1]), 0.1) : WHITE_F), stroke = bd => (bd ? rgba(bandRGB(bd[0], bd[1]), 0.4) : WHITE_S);
    // a beam segment from p to q, wp wide at p and wq at q
    const seg = (p, q, wp, wq, bd, tags) => {
      const n = perp(nrm(sub(q, p))), poly = [ad(p, sc(n, wp / 2)), ad(q, sc(n, wq / 2)), ad(q, sc(n, -wq / 2)), ad(p, sc(n, -wp / 2))];
      prims.push({ k: "poly", p: poly, fill: fill(bd), stroke: stroke(bd) });
      // shortened at both ends, so that the beam may meet the optics it joins
      const s0 = Math.min(0.45, (0.7 * W) / (Math.hypot(...sub(q, p)) || 1));
      const pp = ad(p, sc(sub(q, p), s0)), qq = ad(p, sc(sub(q, p), 1 - s0)), wpp = wp + (wq - wp) * s0, wqq = wp + (wq - wp) * (1 - s0);
      body([hull([ad(pp, sc(n, wpp / 2)), ad(qq, sc(n, wqq / 2)), ad(qq, sc(n, -wqq / 2)), ad(pp, sc(n, -wpp / 2))])], tags);
    };
    const Ftel = tele ? Math.max(...arms.map(a => a.P.F)) : a0.P.F;
    let first, dir0, w0 = W, Lf = 0;
    if (!tele) {
      const fC = a0.D.fcol || a0.P.F * W, Lt = Math.min(0.32 * fC, 1.6 * W), tHalf = Lt / (2 * a0.P.F);
      const telCone = [v(-Lt, tHalf), v(0, 0), v(-Lt, -tHalf)];
      prims.push({ k: "poly", p: telCone, fill: "rgba(214,160,50,0.18)", stroke: "rgba(214,160,50,0.6)" });
      labs.push({ at: v(-Lt, 0), txt: "telescope", sub: "f/" + sig(a0.P.F, 3), pri: 2, dir: v(-1, 0) });
      if (a0.P.col === "mirror") {
        // a mirror collimator: the light from the slit to the mirror, returned RET off the axis, past the slit
        const M = v(fC, 0), r0 = rot(v(-1, 0), cfg.ret * RET), nM = nrm(sub(r0, v(1, 0))), tM = perp(nM);
        const hf = 0.5 * W / Math.cos(RET / 2), hm = 1.12 * hf;
        prims.push({ k: "poly", p: [v(0, 0), ad(M, sc(tM, hf)), ad(M, sc(tM, -hf))], fill: WHITE_F, stroke: WHITE_S });
        prims.push({ k: "mirror", c: M, t: tM, n: nM, h: hm });
        labs.push({ at: ad(M, sc(nM, -0.04 * W)), txt: "collimator", sub: "f = " + mm(fC), pri: 2, dir: sc(nM, -1) });
        body([hull([...telCone, v(0, 0.06 * W), v(0, -0.06 * W)])], ["tel"]);
        body([hull([v(0.3 * fC, 0.15 * W), v(0.3 * fC, -0.15 * W), ad(M, sc(tM, 0.8 * hf)), ad(M, sc(tM, -0.8 * hf))])], ["tel", "col"]);
        body([hull([ad(M, sc(tM, hm)), ad(M, sc(tM, -hm)), ad(ad(M, sc(tM, hm)), sc(nM, -0.08 * W)), ad(ad(M, sc(tM, -hm)), sc(nM, -0.08 * W))])], ["col"]);
        const L0 = (1.4 * W + 40) * cfg.L0;
        first = ad(M, sc(r0, L0)); dir0 = r0;
        seg(M, first, W, W, null, ["col", "n0"]);
      } else {
        const Lc = v(fC, 0);
        prims.push({ k: "poly", p: [v(0, 0), v(fC, W / 2), v(fC, -W / 2)], fill: WHITE_F, stroke: WHITE_S });
        prims.push({ k: "lens", c: Lc, ax: v(1, 0), h: 0.56 * W });
        labs.push({ at: ad(Lc, v(0, -0.6 * W)), txt: "collimator", sub: "f = " + mm(fC), pri: 2, dir: v(0, -1) });
        body([hull([...telCone, v(0, 0.06 * W), v(0, -0.06 * W), v(fC, 0.6 * W), v(fC, -0.6 * W)])], ["tel", "col"]);
        const L0 = (0.9 * W + 40) * cfg.L0;
        first = ad(Lc, v(L0, 0)); dir0 = v(1, 0);
        seg(Lc, first, W, W, null, ["col", "n0"]);
      }
      prims.push({ k: "slit", p: v(0, 0), ax: v(1, 0), h: 0.05 * W + 6 });
      labs.push({ at: v(0, 0), txt: "slit", sub: sig(a0.P.slitW, 3) + "″", pri: 1, dir: v(0, -1), optional: true });
    } else {
      // the telescope's beam converging on the arms' slits, which all sit at the same distance Lf from the first dichroic
      const base = 1.2 * W + 40;
      const pathMax = (n, d) => (typeof n === "string" ? d : Math.max(pathMax(n.T, typeof n.T === "string" ? d : d + base * cfg.L[n._k * 2]), pathMax(n.R, typeof n.R === "string" ? d : d + base * cfg.L[n._k * 2 + 1])));
      Lf = pathMax(G.tree, 0) + 1.6 * base * cfg.L0;
      w0 = Lf / Ftel;
      const Lt = 0.45 * Lf, d0 = v(-Lt, 0), wt = (Lf + Lt) / Ftel;
      first = v(0, 0); dir0 = v(1, 0);
      prims.push({ k: "poly", p: [ad(d0, v(0, wt / 2)), v(0, w0 / 2), v(0, -w0 / 2), ad(d0, v(0, -wt / 2))], fill: "rgba(214,160,50,0.18)", stroke: "rgba(214,160,50,0.6)" });
      labs.push({ at: d0, txt: "telescope", sub: "f/" + sig(Ftel, 3), pri: 2, dir: v(-1, 0) });
      body([hull([ad(d0, v(0, wt / 2)), ad(d0, v(0, -wt / 2)), v(-0.5 * W, w0 / 2), v(-0.5 * W, -w0 / 2)])], ["tel", "n0"]);
    }
    // the tree: at each dichroic the reflected light turns by 180 - 2 AOI (to the side cfg.ds picks), the transmitted
    // light runs on
    const walk = (node, at, d, wNow, path, tag) => {
      if (typeof node === "string") {
        const a = byId[node];
        if (!a) return;
        const U = unit(a, cfg.af[node] || 1, tele), th = Math.atan2(d[1], d[0]), T = q => ad(at, rot(q, th));
        for (const pr of U.prims) {
          const q = Object.assign({}, pr);
          if (pr.p && Array.isArray(pr.p[0])) q.p = pr.p.map(T); else if (pr.p) q.p = T(pr.p);
          if (pr.c) q.c = T(pr.c);
          if (pr.ax) q.ax = rot(pr.ax, th);
          if (pr.t) q.t = rot(pr.t, th);
          if (pr.n) q.n = rot(pr.n, th);
          prims.push(q);
        }
        for (const L of U.labs) labs.push(Object.assign({}, L, { at: T(L.at), dir: rot(L.dir, th) }));
        body(U.pieces.map(pc => pc.map(T)), [tag]);
        return;
      }
      const k = node._k, sense = cfg.ds[k], aoi = node.aoi * DEG;
      const rd = nrm(rot(d, sense * (Math.PI - 2 * aoi))), nPl = nrm(sub(rd, d)), tPl = perp(nPl);
      const half = 0.56 * Math.max(wNow, 0.12 * W) / Math.max(0.2, Math.cos(aoi)), thk = 0.035 * W + 2;
      prims.push({ k: "dich", p: [ad(at, sc(tPl, half)), ad(at, sc(tPl, -half))] });
      labs.push({ at: ad(at, sc(tPl, half)), txt: "dichroic " + grp(node.cut / 10) + " nm", sub: node.inferred ? "inferred" : "", pri: 4, dir: tPl });
      body([[ad(ad(at, sc(tPl, half)), sc(nPl, thk)), ad(ad(at, sc(tPl, -half)), sc(nPl, thk)), ad(ad(at, sc(tPl, -half)), sc(nPl, -thk)), ad(ad(at, sc(tPl, half)), sc(nPl, -thk))]], [tag]);
      const base = (tele ? 1.2 : 1.35) * W + 40;
      for (const [br, dd, j] of [[node.T, d, 0], [node.R, rd, 1]]) {
        const leaf = typeof br === "string", ctag = leaf ? "a:" + br : "n" + br._k;
        const len = tele && leaf ? Math.max(0.6 * base, Lf - path) : base * cfg.L[k * 2 + j];
        const to = ad(at, sc(dd, len)), wTo = tele ? Math.max(0.02 * W, wNow - len / Ftel) : wNow;
        seg(at, to, wNow, tele && leaf ? 0 : wTo, band(br), [tag, ctag]);
        walk(br, to, dd, wTo, path + len, ctag);
      }
    };
    walk(G.tree, first, dir0, w0, 0, "n0");
    return { prims, labs, bodies, W };
  }

  // the cost of a scene: the overlaps between bodies that share no node (in units of the beam width), and the
  // scale at which the drawing fills the panel
  function scoreOf(S, aspect) {
    let ov = 0;
    const bb = S.bodies.map(b => { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const pc of b.pieces) for (const q of pc) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); } return [x0, x1, y0, y1]; });
    const gap = 0.45 * S.W;
    for (let i = 0; i < S.bodies.length; i++) for (let j = i + 1; j < S.bodies.length; j++) {
      const A = S.bodies[i], B = S.bodies[j];
      if (A.tags.some(t => B.tags.includes(t))) continue;
      const a = bb[i], b = bb[j];
      if (a[1] + gap < b[0] || b[1] + gap < a[0] || a[3] + gap < b[2] || b[3] + gap < a[2]) continue;
      for (const pa of A.pieces) for (const pb of B.pieces) ov += depth(pa, pb, gap);
    }
    const all = bb.reduce((r, b) => [Math.min(r[0], b[0]), Math.max(r[1], b[1]), Math.min(r[2], b[2]), Math.max(r[3], b[3])], [Infinity, -Infinity, Infinity, -Infinity]);
    const sx = aspect / (all[1] - all[0]), sy = 1 / (all[3] - all[2]);
    return { ov: ov / S.W, s: Math.min(sx, sy) };
  }
  // the search: every combination of the turning senses at the base lengths; then, for the best few, the lengths
  // one branch at a time
  function choose(G, arms, aspect) {
    const nd = nodes(G.tree), ids = leaves(G.tree);
    nd.forEach((n, k) => { n._k = k; });
    const nS = nd.length + ids.length + (G.split === "telescope" ? 0 : 1);
    const make = (bits, L, L0) => ({ ds: nd.map((_, k) => (bits >> k) & 1 ? -1 : 1), af: Object.fromEntries(ids.map((id, i) => [id, (bits >> (nd.length + i)) & 1 ? -1 : 1])), ret: (bits >> (nd.length + ids.length)) & 1 ? -1 : 1, L, L0 });
    const evalC = c => { const r = scoreOf(scene(G, arms, c), aspect); return { c, ov: r.ov, s: r.s }; };
    const cost = (r, sMax) => 8 * r.ov + sMax / r.s;
    const L1 = nd.flatMap(() => [1, 1]);
    let res = [];
    // (the first arm's sense is fixed: a mirror image of the whole drawing is no different)
    for (let bits = 0; bits < (1 << nS); bits++) { if (nS > 0 && (bits & 1)) continue; res.push(evalC(make(bits, L1.slice(), 1))); }
    let sMax = Math.max(...res.map(r => r.s));
    res.sort((p, q) => cost(p, sMax) - cost(q, sMax));
    const MULT = [1, 1.5, 2.2, 3.2, 4.5];
    let best = res[0];
    for (const r0 of res.slice(0, 5)) {
      let cur = r0;
      for (let pass = 0; pass < 2; pass++) for (let i = -1; i < L1.length; i++) for (const mlt of MULT) {
        const c = { ...cur.c, L: cur.c.L.slice() };
        if (i < 0) c.L0 = mlt; else c.L[i] = mlt;
        const r = evalC(c);
        sMax = Math.max(sMax, r.s);
        if (cost(r, sMax) < cost(cur, sMax) - 1e-6) cur = r;
      }
      if (cost(cur, sMax) < cost(best, sMax)) best = cur;
    }
    return best.c;
  }
  // the choice is kept while the design stays in the same coarse bin (and the panel keeps its shape)
  const memo = new Map();
  function configFor(G, inst, arms, aspect) {
    const key = inst + "|" + Math.round(aspect * 3) + "|" + arms.map(a => a.D.bad || !a.D.c ? "x" : [a.id, Math.round(Math.log(a.P.W) * 3), Math.round(Math.log(a.D.fcam) * 3), Math.round(((a.D.alpha || 0) + (a.D.beta || 0) + (a.D.psi || 0)) / (10 * DEG)), a.P.gType, a.P.col].join(",")).join(";");
    if (!memo.has(key)) { if (memo.size > 60) memo.clear(); memo.set(key, choose(G, arms, aspect)); }
    nodes(G.tree).forEach((n, k) => { n._k = k; });
    return memo.get(key);
  }

  // ---- the layout panel
  let hitArms = [], last = null;                  // each arm's pieces on the canvas (CSS px), for a click; the last layout (tests)
  function drawLayout(cv, arms, inst, active, capH = 34) {
    const { g, w, h } = fitCanvas(cv);
    g.clearRect(0, 0, w, h);
    hitArms = [];
    const G = GROUPS[inst], a0 = arms.find(a => !a.D.bad && a.D.c);
    if (!G || !a0) { message(g, w, h, "—"); return { capX: 14 }; }
    const mL = 30, mR = 56, mT = 26, mB = Math.max(58, capH + 26);
    const aspect = (w - mL - mR) / Math.max(60, h - mT - mB), cfg = configFor(G, inst, arms, aspect);
    const Sc = scene(G, arms, cfg);
    last = { ov: scoreOf(Sc, aspect).ov, labels: [], cfg: JSON.parse(JSON.stringify(cfg)) };
    // fit: the bodies' extent, with room for the labels
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const b of Sc.bodies) for (const pc of b.pieces) for (const q of pc) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
    const padX = 70, padY = 20;
    const s = Math.min((w - mL - mR - 2 * padX) / (x1 - x0), (h - mT - mB - 2 * padY) / (y1 - y0));
    const ox = mL + ((w - mL - mR) - s * (x1 - x0)) / 2 - s * x0, oy = mT + ((h - mT - mB) - s * (y1 - y0)) / 2 + s * y1;
    const X = p => [ox + s * p[0], oy - s * p[1]];
    g.lineJoin = "round";
    const order = { poly: 0, slit: 1, lens: 2, mirror: 2, line: 3, dich: 3 };
    for (const pr of Sc.prims.slice().sort((p, q) => order[p.k] - order[q.k])) {
      if (pr.k === "poly") {
        g.beginPath(); pr.p.forEach((q, i) => { const c = X(q); i ? g.lineTo(c[0], c[1]) : g.moveTo(c[0], c[1]); }); g.closePath();
        if (pr.fill) { g.fillStyle = pr.fill; g.fill(); }
        if (pr.stroke) { g.strokeStyle = pr.stroke; g.lineWidth = 0.8; g.stroke(); }
      } else if (pr.k === "line" || pr.k === "dich") {
        const a = X(pr.p[0]), b = X(pr.p[1]);
        g.lineCap = "butt";
        if (pr.k === "dich") { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = DICH; g.lineWidth = 7; g.stroke(); }
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
        g.strokeStyle = pr.k === "dich" ? DICH_E : pr.col; g.lineWidth = pr.k === "dich" ? 2.4 : pr.lw; g.stroke();
      } else if (pr.k === "lens") {
        const n = perp(pr.ax), a = X(ad(pr.c, sc(n, pr.h))), b = X(ad(pr.c, sc(n, -pr.h))), bulge = sc(pr.ax, 0.12 * pr.h);
        const m1 = X(ad(pr.c, bulge)), m2 = X(ad(pr.c, sc(bulge, -1)));
        g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(2 * m1[0] - (a[0] + b[0]) / 2, 2 * m1[1] - (a[1] + b[1]) / 2, b[0], b[1]);
        g.quadraticCurveTo(2 * m2[0] - (a[0] + b[0]) / 2, 2 * m2[1] - (a[1] + b[1]) / 2, a[0], a[1]); g.closePath();
        g.fillStyle = GLASS; g.fill(); g.strokeStyle = GLASS_E; g.lineWidth = 1; g.stroke();
      } else if (pr.k === "mirror") {
        // a concave mirror: its edges bent toward the slit
        const sag = 0.1 * pr.h, a = X(ad(ad(pr.c, sc(pr.t, pr.h)), sc(pr.n, sag))), b = X(ad(ad(pr.c, sc(pr.t, -pr.h)), sc(pr.n, sag))), m0 = X(ad(pr.c, sc(pr.n, -sag)));
        g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(m0[0], m0[1], b[0], b[1]);
        g.strokeStyle = "rgba(95,104,114,0.35)"; g.lineWidth = 8; g.lineCap = "butt"; g.stroke();
        g.strokeStyle = STEEL; g.lineWidth = 3; g.stroke();
      } else if (pr.k === "slit") {
        const n = perp(pr.ax), a = X(ad(pr.p, sc(n, pr.h))), b = X(ad(pr.p, sc(n, -pr.h)));
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = "#3b3733"; g.lineWidth = 3; g.lineCap = "butt"; g.stroke();
      }
    }
    // each arm's pieces on the canvas, for a click
    for (const b of Sc.bodies) if (b.tags.length === 1 && b.tags[0].startsWith("a:")) hitArms.push({ id: b.tags[0].slice(2), polys: b.pieces.map(pc => pc.map(X)) });
    // the scale bar at the lower left; the caption follows it
    const nice = x => { const p = Math.pow(10, Math.floor(Math.log10(x))), f = x / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; };
    const L = nice(0.16 * (w - mL - mR) / s), bx = 14, by = h - 12;
    g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + L * s, by); g.moveTo(bx, by - 4); g.lineTo(bx, by + 4); g.moveTo(bx + L * s, by - 4); g.lineTo(bx + L * s, by + 4); g.stroke();
    g.font = `12.5px ${FONT}`; g.fillStyle = INK; g.textAlign = "left"; g.textBaseline = "middle";
    const sbLab = L >= 1000 ? L / 1000 + " m" : L + " mm";
    g.fillText(sbLab, bx + L * s + 8, by);
    const capX = bx + L * s + 8 + g.measureText(sbLab).width + 22;
    placeLabels(g, w, h, Sc.labs.map(Lb => ({ ...Lb, at: X(Lb.at), dir: [Lb.dir[0], -Lb.dir[1]] })), active, capH);
    return { capX, tele: G.split === "telescope" };
  }

  // the labels, placed where they cover the least ink (read back from the canvas, as the Spectral view does) and
  // keep off one another; an optional label with no clear place is left out
  function placeLabels(g, w, h, labs, active, capH) {
    let inkIn = () => 0;
    try {
      const cv = g.canvas, CW = cv.width, CH = cv.height, dpr = CW / w, px = g.getImageData(0, 0, CW, CH).data;
      const GW = Math.ceil(w / 2), GH = Math.ceil(h / 2), W1 = GW + 1, SAT = new Float32Array(W1 * (GH + 1));
      for (let j = 0; j < GH; j++) {
        const yy = Math.min(CH - 1, Math.floor((2 * j + 1) * dpr));
        let row = 0;
        for (let i = 0; i < GW; i++) {
          const k = (yy * CW + Math.min(CW - 1, Math.floor((2 * i + 1) * dpr))) * 4;
          const ink = px[k + 3] / 255 * (1 - (0.299 * px[k] + 0.587 * px[k + 1] + 0.114 * px[k + 2]) / 255);
          if (ink > 0.17) row += 4 * ink; else if (ink > 0.03) row += 1.2 * ink;
          SAT[(j + 1) * W1 + i + 1] = SAT[j * W1 + i + 1] + row;
        }
      }
      const cx = q => Math.max(0, Math.min(GW, Math.round(q / 2))), cy = q => Math.max(0, Math.min(GH, Math.round(q / 2)));
      inkIn = b => { const x0 = cx(b[0]), x1 = cx(b[2]), y0 = cy(b[1]), y1 = cy(b[3]); return SAT[y1 * W1 + x1] - SAT[y0 * W1 + x1] - SAT[y1 * W1 + x0] + SAT[y0 * W1 + x0]; };
    } catch (e) { /* an unreadable canvas: the labels keep off one another only */ }
    // kept clear: the buttons at the lower right, the scale bar and caption at the lower left
    const boxes = [[w - 50, h - 110, w, h], [10, h - capH - 16, w - 56, h]];
    const crowd = b => boxes.reduce((t, o) => t + Math.max(0, Math.min(b[2], o[2]) - Math.max(b[0], o[0])) * Math.max(0, Math.min(b[3], o[3]) - Math.max(b[1], o[1])), 0);
    const inside = b => b[0] >= 2 && b[2] <= w - 2 && b[1] >= 2 && b[3] <= h - 2;
    const ANG = [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180].map(d => d * DEG), RING = [6, 16, 30, 48];
    // (a narrow panel, a phone: the labels of the optics other than the dichroics give way where crowded)
    if (w < 560) for (const L of labs) if (L.pri <= 3) L.optional = true;
    for (const L of labs.sort((p, q) => q.pri - p.pri)) {
      const big = L.pri >= 5, fMain = `${big ? 13 : 12}px ${FONT}`, fSub = `11.5px ${FONT}`;
      g.font = fMain; const w1 = g.measureText(L.txt).width;
      g.font = fSub; const w2 = L.sub ? g.measureText("  " + L.sub).width : 0;
      const u0 = nrm(L.dir);
      let best = null;
      for (const withSub of L.sub ? [true, false] : [false]) {
        const wd = w1 + (withSub ? w2 : 0), hh = 9;
        ANG.forEach((an, ia) => RING.forEach((r, ir) => {
          const u = rot(u0, an), c = [L.at[0] + u[0] * (r + wd / 2), L.at[1] + u[1] * (r + hh)];
          const b = [c[0] - wd / 2 - 4, c[1] - hh, c[0] + wd / 2 + 4, c[1] + hh];
          const sc0 = 3 * ia + 0.5 * r + ir + (withSub ? 0 : 40) + (inside(b) ? 0 : 5000) + 60 * crowd(b) + inkIn(b);
          if (!best || sc0 < best.sc) best = { sc: sc0, c, b, sub: withSub, wd };
        }));
      }
      if (L.optional && (best.sc >= 5000 || crowd(best.b) > 0 || inkIn(best.b) > 150)) continue;
      if (last) last.labels.push({ txt: L.txt, box: best.b, inside: inside(best.b), crowd: crowd(best.b), sub: best.sub });
      boxes.push(best.b);
      const x0 = best.c[0] - best.wd / 2, y = best.c[1], on = L.arm && L.arm === active;
      // a label set well off its element gets a thin leader to the nearest point of its box
      const qx = Math.max(best.b[0], Math.min(best.b[2], L.at[0])), qy = Math.max(best.b[1] + 3, Math.min(best.b[3] - 3, L.at[1]));
      if (Math.hypot(qx - L.at[0], qy - L.at[1]) > 26) { g.strokeStyle = "rgba(106,101,96,0.75)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(L.at[0], L.at[1]); g.lineTo(qx, qy); g.stroke(); }
      g.textAlign = "left"; g.textBaseline = "middle"; g.lineJoin = "round"; g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4;
      g.font = on ? `600 ${big ? 13 : 12}px ${FONT}` : fMain; g.strokeText(L.txt, x0, y); g.fillStyle = on ? ACCENT : INK; g.fillText(L.txt, x0, y);
      if (best.sub) { g.font = fSub; g.strokeText("  " + L.sub, x0 + w1, y); g.fillStyle = MUTED; g.fillText("  " + L.sub, x0 + w1, y); }
      g.lineJoin = "miter";
      if (L.arm) {
        const hp = hitArms.find(q => q.id === L.arm);
        if (hp) hp.polys.push([[best.b[0], best.b[1]], [best.b[2], best.b[1]], [best.b[2], best.b[3]], [best.b[0], best.b[3]]]);
      }
    }
  }
  const inPoly = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
  const hitLayout = (x, y) => { for (const a of hitArms) if (a.polys.some(P => inPoly(P, x, y))) return a.id; return null; };

  // ---- the detector panel: every arm's chip to one scale, with each object's spectrum (as in the one-arm view), in
  // the rows that make the chips largest; below, the strip of the arms' coverage with the dichroics' crossovers
  let hitChips = [];
  function drawDetectors(cv, arms, inst, active, bufs) {
    const { g, w, h } = fitCanvas(cv);
    g.clearRect(0, 0, w, h);
    hitChips = [];
    const ok = arms.filter(a => !a.D.bad && a.D.c);
    if (!ok.length || !(cv.width > 0)) { message(g, w, h, "—"); return; }
    const stripH = 34 + 19 * ok.length, mL = 24, mR = 24, mT = 30, gapX = 22, gapY = 46, axH = 26, gapS = 34;
    const availW = w - mL - mR, availH = h - mT - stripH - gapS - 10;
    let lay = null;
    for (let nr = 1; nr <= ok.length; nr++) {
      const per = Math.ceil(ok.length / nr), rows = [];
      for (let i = 0; i < ok.length; i += per) rows.push(ok.slice(i, i + per));
      const sW = Math.min(...rows.map(r => (availW - gapX * (r.length - 1)) / r.reduce((t, a) => t + a.D.Lx, 0)));
      const sH = (availH - (gapY + axH) * rows.length + gapY) / rows.reduce((t, r) => t + Math.max(...r.map(a => a.D.Ly)), 0);
      const s = Math.min(sW, sH);
      if (!lay || s > lay.s * 1.02) lay = { s, rows };
    }
    const s = lay.s, chipsH = lay.rows.reduce((t, r) => t + Math.max(...r.map(a => a.D.Ly)) * s, 0) + (gapY + axH) * lay.rows.length - gapY;
    const top = mT + Math.max(0, (availH - chipsH) / 2);
    let y = top;
    g.textAlign = "center"; g.textBaseline = "middle";
    for (const row of lay.rows) {
      const rowH = Math.max(...row.map(a => a.D.Ly)) * s, rowW = row.reduce((t, a) => t + a.D.Lx * s, 0) + gapX * (row.length - 1);
      let x = mL + (availW - rowW) / 2;
      for (const a of row) {
        const D = a.D, P = a.P, cw = D.Lx * s, chh = D.Ly * s, yc = y + (rowH - chh) / 2;
        g.fillStyle = "#0b111c"; g.fillRect(x, yc, cw, chh);
        const T = (X, Y) => [x + cw / 2 + X * s, yc + chh / 2 - Y * s];
        g.save(); g.beginPath(); g.rect(x, yc, cw, chh); g.clip();
        if (!bufs[a.id]) bufs[a.id] = {};
        splatTraces(g, makeTraces(D, P), D, P, T, s * D.pixmm, x, yc, x + cw, yc + chh, bufs[a.id]);
        g.restore();
        const on = a.id === active;
        g.strokeStyle = on ? ACCENT : "#3b3733"; g.lineWidth = on ? 2 : 1; g.strokeRect(x + (on ? 1 : 0.5), yc + (on ? 1 : 0.5), cw - (on ? 2 : 1), chh - (on ? 2 : 1));
        g.font = on ? `600 13px ${FONT}` : `13px ${FONT}`; g.fillStyle = on ? ACCENT : INK; g.textBaseline = "middle"; g.fillText(a.name, x + cw / 2, yc - 11);
        // wavelengths along the chip's foot (grating mode: the dispersion runs along the chip)
        if (P.mode !== "echelle") {
          const lo = D.range[0] * 1e4, hi = D.range[1] * 1e4, span = hi - lo, st = [100, 200, 250, 500, 1000, 2000].find(q => span / q <= Math.max(2, cw / 60)) || 2000;
          g.strokeStyle = MUTED; g.lineWidth = 1; g.font = `11px ${FONT}`; g.fillStyle = MUTED; g.textBaseline = "top";
          for (let l = Math.ceil(lo / st) * st; l <= hi; l += st) {
            const q = D.pos(l / 1e4, D.order);
            if (!q) continue;
            const xx = T(q[0], 0)[0];
            if (xx < x + 2 || xx > x + cw - 2) continue;
            g.beginPath(); g.moveTo(Math.round(xx) + 0.5, yc + chh); g.lineTo(Math.round(xx) + 0.5, yc + chh + 4); g.stroke();
            g.fillText(grp(l), xx, yc + chh + 6);
          }
          g.textBaseline = "middle";
        } else {
          g.font = `11px ${FONT}`; g.fillStyle = MUTED; g.textBaseline = "top";
          g.fillText("orders " + Math.min(...D.orders.map(q => q.m)) + "–" + Math.max(...D.orders.map(q => q.m)), x + cw / 2, yc + chh + 6);
          g.textBaseline = "middle";
        }
        hitChips.push({ id: a.id, b: [x, yc - 20, x + cw, yc + chh] });
        x += cw + gapX;
      }
      y += rowH + axH + gapY;
    }
    // the coverage strip: each arm's range as a bar in its colors; the dichroics' crossovers and transitions
    const lo = Math.min(...ok.map(a => a.D.range[0])), hi = Math.max(...ok.map(a => a.D.range[1]));
    g.font = `11px ${FONT}`;
    const nameW = Math.max(...ok.map(a => g.measureText(a.name).width));
    const L0 = mL + nameW + 10, L1 = w - mR - 22, y0 = top + chipsH + gapS, rowH = 13;
    const XL = l => L0 + (l - lo) / (hi - lo) * (L1 - L0);
    ok.forEach((a, i) => {
      const yy = y0 + i * (rowH + 6), r0 = a.D.range[0], r1 = a.D.range[1];
      for (let k = 0; k < 48; k++) { const l0 = r0 + (r1 - r0) * k / 48, l1 = r0 + (r1 - r0) * (k + 1) / 48; g.fillStyle = rgba(lamRGB((l0 + l1) / 2 * 1e4), 0.9); g.fillRect(XL(l0), yy, XL(l1) - XL(l0) + 0.5, rowH); }
      g.font = a.id === active ? `600 11px ${FONT}` : `11px ${FONT}`; g.fillStyle = a.id === active ? ACCENT : INK; g.textAlign = "right"; g.textBaseline = "middle";
      g.fillText(a.name, L0 - 6, yy + rowH / 2);
    });
    const yA = y0 + ok.length * (rowH + 6) + 2;
    g.textAlign = "center"; g.textBaseline = "bottom"; g.font = `11px ${FONT}`;
    for (const nd of cuts(inst)) {
      const c = nd.cut / 1e4, xc = XL(c), xw0 = XL(c - nd.w / 2e4), xw1 = XL(c + nd.w / 2e4);
      if (xc < L0 || xc > L1) continue;
      g.fillStyle = "rgba(154,122,44,0.18)"; g.fillRect(xw0, y0 - 4, xw1 - xw0, yA - y0 + 4);
      g.strokeStyle = DICH_E; g.lineWidth = 1.2; g.beginPath(); g.moveTo(Math.round(xc) + 0.5, y0 - 6); g.lineTo(Math.round(xc) + 0.5, yA); g.stroke();
      g.fillStyle = DICH_E; g.fillText(grp(nd.cut / 10) + " nm", xc, y0 - 7);
    }
    // the wavelength axis
    g.strokeStyle = MUTED; g.lineWidth = 1; g.beginPath(); g.moveTo(L0, yA + 0.5); g.lineTo(L1, yA + 0.5); g.stroke();
    const span = (hi - lo) * 1e4, st = [100, 200, 500, 1000, 2000, 5000, 10000].find(q => (L1 - L0) * q / span >= 56) || 10000;
    g.fillStyle = MUTED; g.textAlign = "center"; g.textBaseline = "top";
    for (let l = Math.ceil(lo * 1e4 / st) * st; l <= hi * 1e4; l += st) { const xx = XL(l / 1e4); g.beginPath(); g.moveTo(Math.round(xx) + 0.5, yA); g.lineTo(Math.round(xx) + 0.5, yA + 4); g.stroke(); g.fillText(grp(l), xx, yA + 6); }
    g.textAlign = "left"; g.fillText("Å", L1 + 12, yA + 6);
  }
  const hitDetector = (x, y) => { for (const c of hitChips) if (x >= c.b[0] && x <= c.b[2] && y >= c.b[1] && y <= c.b[3]) return c.id; return null; };

  // ---- the stats strip: each arm's range, resolution and dispersion; the arm the controls set is marked
  function stats(arms, active, edited) {
    return arms.map(a => {
      const D = a.D, on = a.id === active, cls = "stat arm" + (on ? " on" : ""), ed = edited && edited.has(a.id) ? " (edited)" : "";
      const tip = on ? `${a.name}: the controls below set this arm` : `${a.name}: click to set this arm with the controls`;
      if (D.bad || !D.c) return `<div class="${cls}" data-arm="${a.id}" title="${tip}"><span class="k">${a.name}${ed}</span><span class="v">–</span></div>`;
      const R = D.c.Reff, Rt = R >= 1000 ? grp(Number(sig(R, 3))) : sig(R, 3);
      return `<div class="${cls}" data-arm="${a.id}" title="${tip}; wavelength range on the chip, resolving power at the central wavelength, dispersion"><span class="k">${a.name}${ed}</span><span class="v">${grp(D.range[0] * 1e4)}–${grp(D.range[1] * 1e4)} Å<small><i>R</i> ${Rt}</small><small>${sig(D.c.dlpix, 3)} Å/px</small></span></div>`;
    }).join("");
  }
  // the layout's caption
  function caption(arms, inst, active) {
    const G = GROUPS[inst], act = arms.find(a => a.id === active), nd = cuts(inst);
    const guess = nd.some(n => n.noAoi);
    return "All arms to one scale, with the angles at the dichroics and gratings true" + (guess ? " (45° where a dichroic's angle is not published)" : "") +
      "; the turning directions and spacings are chosen for clarity. The controls set the " + (act ? act.name.replace(/\s*[,(].*$/, "").replace(/\s+arm$/i, "") + " arm" : "first arm") +
      "; a click on another arm moves the controls to that arm.";
  }
  return { group, armIds, cuts, shared, drawLayout, drawDetectors, stats, caption, hitLayout, hitDetector, GROUPS, test: () => last };
};
})(typeof window !== "undefined" ? window : globalThis);
