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
   after one slit and collimator; "focus" -- in the light spreading from the telescope's focus (Ftel), where MIKE's
   one slit stands (slit: "shared"), each arm then with its relay (and its own slit, X-Shooter), or with none (relay
   null: MODS, each arm's collimator in the diverging beam at its focal length from the slit); "preslit" -- in a
   collimated beam ahead of the slits (UVES: Wpre wide, a doublet focusing each arm on its slit); "echelle" -- in the
   collimated beam after one slit, collimator and echelle that the arms share (KPF), each arm then with its own
   cross-disperser, camera and detector.

   The layout is schematic in one respect, stated in its caption: the angles at the dichroics (180 - 2 AOI) and at the
   gratings are true, but which way each element turns the light and the distances between the elements are chosen
   to keep the arms clear of one another.  The choice is a small search: every combination of the turning senses, then
   the branch lengths one at a time, scored by how far the parts overlap (convex pieces, separating-axis depth) and by
   how large the drawing can be in the panel.  The result is kept while the design stays in the same coarse bin, so the
   drawing does not jump while a slider moves. */
(function (root) {
"use strict";
const GROUPS = {
  // DESI (D22 Sec. 7.2; FDR Table 5.3): the NIR-pass dichroic (>95% R 360-747 nm, >95% T 772-980 nm in FDR Table 5.3 and
  // the captions of D22 Figs. 14 and 32, where the text of D22 Sec. 7.2 says 757; mean AOI 25.4 deg) sends the NIR
  // straight on and reflects the rest to the red-pass dichroic (>95% R 360-566 nm, >95% T 593-772 nm, AOI 32.1 deg);
  // crossovers DERIVED as the middle of each specification gap
  "DESI": { split: "collimated", tree: { cut: 7595, w: 250, aoi: 25.4, src: "FDR Table 5.3; D22 Sec. 7.2 (NIR-pass; crossover DERIVED)",
    R: { cut: 5795, w: 270, aoi: 32.1, src: "D22 Sec. 7.2 (red-pass; crossover DERIVED)", R: "desib", T: "desir" }, T: "desiz" } },
  // Boombox (data/round11/boombox.md; Piotrowski et al. 2026, submitted, Sec. 2.2 and Fig. 1): a fused-silica dichroic at
  // 22 deg in the collimated beam, 5750 A with a 95 A transition (90% R to 90% T), reflects the blue; the red passes to a
  // 45 deg fold mirror that turns it the same way
  "Boombox": { split: "collimated", tree: { cut: 5750, w: 95, aoi: 22, src: "Piotrowski et al. 2026 (submitted) Sec. 2.2", R: "boomboxb", T: { fold: 45, rel: 1, src: "Piotrowski et al. 2026 Fig. 1", to: "boomboxr" } } },
  // PFS (V14 Sec. 3): "the first dichroic reflects the Blue part of the spectrum and the second reflects the Red while the
  // NIR is transmitted"; splits at the channel edges 640 and 955 nm (SM16), transitions ~20 nm (T16); the angles are not
  // in the text: ~29 and ~38 deg measured from V14 Fig. 2 (a concept-stage drawing; DERIVED, +-3 deg)
  "PFS": { split: "collimated", note: "PFS's dichroic angles are measured from a concept-stage drawing", tree: { cut: 6400, w: 200, aoi: 29, src: "V14 Sec. 3, Fig. 2 (AOI DERIVED); SM16 channel edges", R: "pfsb",
    T: { cut: 9550, w: 200, aoi: 38, rel: -1, src: "V14 Sec. 3, Fig. 2 (AOI DERIVED; the red reflected to the side opposite the blue); SM16 channel edges", R: "pfsr", T: "pfsn" } } },
  // 4MOST LRS (L20 Sec. 4.2): the red dichroic 706 nm at 35.35 deg, the blue dichroic 539 nm at 43.58 deg, transitions
  // 30 nm (measured 524-554 and 691-721 nm, D22); the blue dichroic transmits only 554-721 nm, so it follows the red one
  "4MOST LRS": { split: "collimated", tree: { cut: 7060, w: 300, aoi: 35.35, src: "L20 Sec. 4.2 (red dichroic)",
    R: { cut: 5390, w: 300, aoi: 43.58, src: "L20 Sec. 4.2 (blue dichroic)", R: "4mostlb", T: "4mostlg" }, T: "4mostlr" } },
  // 4MOST HRS: only the arm bands are published (392.6-435.5, 516-573, 610-679 nm); the splits are INFERRED in the gaps
  "4MOST HRS (effective optics)": { split: "collimated", tree: { cut: 5915, w: 300, aoi: 45, inferred: true, noAoi: true, src: "INFERRED in the band gap",
    R: { cut: 4758, w: 300, aoi: 45, inferred: true, noAoi: true, src: "INFERRED in the band gap", R: "4mosthb", T: "4mosthg" }, T: "4mosthr" } },
  // LLAMAS (F20 Secs. 2.4, 3.3): two dichroics at 475 and 690 nm; the 690 nm one is first (split in two halves, it carries
  // the fiber slit plate), as the throughput lists also show; which side of it reflects is INFERRED
  "LLAMAS (gratings fitted)": { split: "collimated", tree: { cut: 6900, w: 200, aoi: 45, noAoi: true, src: "F20 (690 nm)",
    R: { cut: 4750, w: 200, aoi: 45, noAoi: true, src: "F20 (475 nm)", R: "llamasb", T: "llamasg" }, T: "llamasr" } },
  // BOSS and SDSS-I/II (Smee et al. 2013; data/round7/boss.md): one dichroic at 45 deg in the collimated beam reflects the
  // blue to its camera and transmits the red; crossovers 6050 A (BOSS) and 6000 A (SDSS); the transition width 50 nm is
  // published for the SDSS dichroic and carried over to BOSS (INFERRED)
  "BOSS": { split: "collimated", tree: { cut: 6050, w: 500, aoi: 45, src: "Smee et al. 2013 (6050 A; width INFERRED from SDSS)", R: "bossb", T: "bossr" } },
  "SDSS-I/II": { split: "collimated", tree: { cut: 6000, w: 500, aoi: 45, src: "Smee et al. 2013 (6000 A, 50 nm)", R: "sdssb", T: "sdssr" } },
  // LAMOST LRS (Cui et al. 2012 Fig. 30(b); Huang et al. 2020): one dichroic in the collimated beam, the blue reflected; the
  // cut INFERRED in the gap between the arms' bands, the angle MEASURED from the figure, the width NOT FOUND
  "LAMOST LRS": { split: "collimated", tree: { cut: 5800, w: 500, aoi: 23, inferred: true, src: "Cui et al. 2012 Fig. 30(b) (AOI MEASURED); cut INFERRED", R: "lamostb", T: "lamostr" } },
  // WEAVE (ING; Dalton et al. 2014): one dichroic at 5900 A in the collimated beam, the blue reflected; 45 deg INFERRED from
  // the 90 deg turn in the layout; the width NOT FOUND; LR and HR cannot be mixed between the arms
  "WEAVE (LR)": { split: "collimated", tree: { cut: 5900, w: 500, aoi: 45, src: "ING (5900 A); AOI INFERRED from the layout", R: "weavelrb", T: "weavelrr" } },
  "WEAVE (HR)": { split: "collimated", tree: { cut: 5900, w: 500, aoi: 45, src: "ING (5900 A); AOI INFERRED from the layout", R: "weavehrg", T: "weavehrr" } },
  // MOONS (Oliva et al. 2014, 2016): dichroic I (0.95 um) reflects RI, dichroic H (1.40 um) reflects YJ and passes H; the
  // angles MEASURED from Oliva et al. 2016 Fig. 1 (+-4 deg), the widths NOT FOUND
  "MOONS LR (design)": { split: "collimated", tree: { cut: 9500, w: 300, aoi: 28, src: "Oliva et al. 2014 (0.95 um); AOI MEASURED", R: "moonsri",
    T: { cut: 14000, w: 300, aoi: 37, rel: 1, src: "Oliva et al. 2014 (1.40 um); AOI MEASURED", R: "moonsyj", T: "moonsh" } } },
  "MOONS HR (design)": { split: "collimated", tree: { cut: 9500, w: 300, aoi: 28, src: "Oliva et al. 2014 (0.95 um); AOI MEASURED", R: "moonshri",
    T: { cut: 14000, w: 300, aoi: 37, rel: 1, src: "Oliva et al. 2014 (1.40 um); AOI MEASURED", R: "moonshyj", T: "moonshh" } } },
  // KCWI + KCRM (KSPEC; M18 Fig. 2): a 560 nm dichroic takes the place of the blue arm's fold mirror
  "KCWI": { split: "collimated", tree: { cut: 5600, w: 200, aoi: 45, noAoi: true, src: "KSPEC Table 1 (560 nm)", R: "kcwib", T: "kcrm" } },
  // X-Shooter (V11 Secs. 2.1, 2.2.5, 3.2): two dichroics at 15 deg after the Cassegrain focus (f/13.41, V11 Sec. 2.2.7),
  // each reflecting back 150 deg, the second to the other side; the UVB and VIS beams "are then deviated to 90 deg with
  // folding mirrors" (V11 Sec. 2.1, Fig. 2): each fold turns the beam a further 120 deg the same way, so the two arms run
  // across the axis to opposite sides, crossing the arriving beam as Fig. 2 draws them (cross), and the NIR goes straight on;
  // crossovers 559.5 and 1024 nm; the first reflects the UVB, the second the VIS; each arm's relay (a focal reducer to
  // f/6.5 in the UVB and VIS) then images the focus on the arm's own slit. Widths: the combined dichroics transmit less
  // than 80% at 556.0-563.8 and 1009.5-1035 nm (ESO manual Sec. 3)
  "X-Shooter": { split: "focus", Ftel: 13.41, relay: "relay", note: "each arm's relay images the telescope's focus on the arm's own slit",
    tree: { cut: 5595, w: 78, aoi: 15, src: "V11 Secs. 2.2.5, 3.2; ESO manual Sec. 3", R: { fold: 30, rel: 1, cross: true, src: "V11 Sec. 2.1, Fig. 2", to: "xshuvb" },
      T: { cut: 10240, w: 255, aoi: 15, rel: -1, src: "V11 Secs. 2.2.5, 3.2; ESO manual Sec. 3", R: { fold: 30, rel: 1, cross: true, src: "V11 Sec. 2.1, Fig. 2", to: "xshvis" }, T: "xshnir" } } },
  // CARMENES (data/round9/carmenes.md; Q16 Sec. 2.1; C25): a dichroic at 960 nm in the converging f/10 beam ahead of the
  // fibers (after the pick-up flat and the dispersion corrector) reflects the VIS to its fiber heads and passes the NIR,
  // which an "additional NIR mirror" turns to its own; each channel's fibers lead to its own spectrograph. Drawn after the
  // focus (for a flat dichroic only the beam's convergence differs); the width and both angles INFERRED (45 deg)
  "CARMENES": { split: "focus", Ftel: 10, relay: "fibers, F/N system", note: "CARMENES's dichroic stands in the converging beam ahead of the fibers; the angles of the dichroic and the fold are inferred",
    tree: { cut: 9600, w: 300, aoi: 45, noAoi: true, src: "Q16 Sec. 2.1 (960 nm); width and AOI INFERRED", R: "carmenesvis",
      T: { fold: 45, src: "C25 (the additional NIR mirror); 45 deg INFERRED", to: "carmenesnir" } } },
  // MODS (data/round10/mods.md; the OSU Code V files): one slit mask, a field lens, then a dichroic at 5650 A, 35 deg in
  // the diverging f/15 beam (z = 275 mm), reflecting the red to a fold (38 deg) and passing the blue; each channel's
  // off-axis collimator takes the diverging beam straight from the dichroic, with no relay; the width (10-90%) DERIVED
  // from the measured MODS1 curve
  "MODS": { split: "focus", slit: "shared", Ftel: 15, relay: null, shared: { top: ["D"], m: ["slitW", "nObj"] },
    note: "MODS's dichroic and fold stand in the diverging beam after the slit, and each channel's collimator takes the light straight from them",
    tree: { cut: 5650, w: 180, aoi: 35, src: "MODS manual Sec. 2.4 (50% at 5650 A); the MODS1 curve (width DERIVED); Code V (35 deg)",
      R: { fold: 38, rel: 1, src: "Code V: the red fold, AOI 38 deg (DERIVED)", to: "modsr" }, T: "modsb" } },
  // AAOmega (data/round12/aaomega.md; Sharp et al. 2006 Sec. 2.3 and Fig. 1): the x5700 dichroic in the collimated beam,
  // upstream of each arm's Schmidt corrector, reflects the blue (INFERRED from Sec. 5.8); the width MEASURED from Fig. 1 (15
  // nm, at normal incidence), the angle NOT FOUND
  "AAOmega 580V/385R": { split: "collimated", tree: { cut: 5700, w: 150, aoi: 45, noAoi: true, src: "Sharp et al. 2006 (570 nm; width MEASURED; AOI NOT FOUND)", R: "aao580v", T: "aao385r" } },
  "AAOmega 1500V/1000R": { split: "collimated", tree: { cut: 5700, w: 150, aoi: 45, noAoi: true, src: "Sharp et al. 2006 (570 nm; width MEASURED; AOI NOT FOUND)", R: "aao1500v", T: "aao1000r" } },
  "AAOmega 2500V/2000R": { split: "collimated", tree: { cut: 5700, w: 150, aoi: 45, noAoi: true, src: "Sharp et al. 2006 (570 nm; width MEASURED; AOI NOT FOUND)", R: "aao2500v", T: "aao2000r" } },
  // Lick Kast (data/round11/kast.md): one slit; the D55 dichroic (5500 A) in the diverging beam reflects the blue and passes
  // the red, each arm with its own off-axis collimator (no relay); the width MEASURED from the manual's curve (10-90%), the
  // angle MEASURED from the report's oblique drawing (+-8 deg)
  "Kast": { split: "focus", slit: "shared", Ftel: 17.53, relay: null, shared: { top: ["D"], m: ["slitW", "nObj"] },
    note: "Kast's dichroic stands in the diverging beam after the slit; its angle is measured from an oblique drawing",
    tree: { cut: 5500, w: 380, aoi: 32.5, src: "Lick manual (D55, 5500 A); width and AOI MEASURED", R: "kastb", T: "kastr" } },
  // KPF (data/round9/kpf.md; Gibson et al. 2024 Table 1 and Fig. 3): the arms share the slit (the reformatter), the
  // primary collimator and the echelle; the dichroic (590 nm, the green reflected) stands in the white pupil's beam after
  // the secondary collimator; its angle MEASURED from Fig. 3 (31 +-4 deg), its width NOT FOUND (200 A INFERRED).  The
  // intermediate focus and the 1280 mm transfer collimator between the echelle and the dichroic are not drawn
  "KPF": { split: "echelle", shared: { top: ["D", "F"], m: ["slitW", "nObj", "W", "col", "colTilt", "telF", "fibAp", "eG", "eDelta", "gamma", "theta", "eTilt", "gLen", "wpT"] },
    note: "KPF's arms share the echelle; the transfer optics between the echelle and the dichroic are not drawn",
    tree: { cut: 5900, w: 200, aoi: 31, src: "Gibson et al. 2024 Table 1 (590 nm); AOI MEASURED from Fig. 3; width INFERRED", R: "kpfg", T: "kpfr" } },
  // MIKE (B03 Secs. 2.1, 2.3; LCO manual, May 2004): one slit at the f/11 focus; the dichroic, "the first optical element
  // beyond the slit", at an incidence of 30 deg, reflects the blue; each arm's injection optics then feed its lens. The
  // crossover is ~495 nm since 2004 (455 nm before); the width is the original dichroic's "80% reflectance by 440nm and
  // 80% transmission by 480nm" (the new one's is not published)
  "MIKE": { split: "focus", slit: "shared", Ftel: 11, relay: "injection optics", shared: { top: ["D"], m: ["slitW", "nObj"] },
    note: "MIKE's dichroic follows its one slit, and each arm's injection optics feed the arm's lens",
    tree: { cut: 4950, w: 400, aoi: 30, src: "B03 Sec. 2.1; LCO manual (May 2004)", R: "mikeblue", T: "mikered" } },
  // UVES (Dk00 p. 536 and Fig. 3; UM117 Secs. 2.2.1, 3.1): the f/15 Nasmyth beam is collimated behind the derotator, and
  // the dichroic (DIC1 at 450 nm in the standard 390+580 setting) stands in that collimated beam; a doublet in each arm
  // focuses it on the arm's slit at f/10. The blue is "reflected to the right" (UM Sec. 2.2.1): 45 deg INFERRED. The
  // transition: 430-465 nm (UM Sec. 3.1). The width of the pre-slit beam is not published (Wpre is schematic)
  "UVES": { split: "preslit", Ftel: 15, Wpre: 60, relay: "doublet", note: "the width of UVES's pre-slit beam is not published",
    tree: { cut: 4500, w: 350, aoi: 45, noAoi: true, src: "UM117 Secs. 2.2.1, 3.1 (DIC1)", R: "uvesb", T: "uvesr" } },
};
// (a tree node is a dichroic { cut, w, aoi, R, T, rel? } or a fold mirror { fold (AOI, deg), rel, to }; rel fixes a turn's
// sense relative to the last dichroic's on the path, where the layout search would otherwise choose it)
const leaves = n => (typeof n === "string" ? [n] : n.fold ? leaves(n.to) : [...leaves(n.R), ...leaves(n.T)]);
// the band the dichroics pass to each arm, in A: { id: [lo, hi, half-width of the transition at lo, at hi] }
const passBands = (n, lo = 0, hi = Infinity, wl = 0, wh = 0, out = {}) => {
  if (typeof n === "string") { out[n] = [lo, hi, wl, wh]; return out; }
  if (n.fold) return passBands(n.to, lo, hi, wl, wh, out);
  passBands(n.R, lo, Math.min(hi, n.cut), wl, n.cut < hi ? n.w / 2 : wh, out);
  passBands(n.T, Math.max(lo, n.cut), hi, n.cut > lo ? n.w / 2 : wl, wh, out);
  return out;
};
const nodes = n => (typeof n === "string" ? [] : n.fold ? nodes(n.to) : [n, ...nodes(n.R), ...nodes(n.T)]);
const folds = n => (typeof n === "string" ? [] : n.fold ? [n, ...folds(n.to)] : [...folds(n.R), ...folds(n.T)]);
// (each dichroic's two branch lengths, then each fold's, index the layout's length multipliers cfg.L)
const indexTree = t => { const nd = nodes(t); nd.forEach((n, k) => { n._k = k; }); folds(t).forEach((n, i) => { n._f = 2 * nd.length + i; }); return nd; };
// the controls that one arm's edit sets for every arm: the telescope always; for a split in the collimated beam also
// the slit, the fibers and the collimator, which the arms share (top-level keys, and keys of the mode's scope)
const SHARED_COLL = { top: ["D", "F"], m: ["slitW", "nObj", "W", "col", "telF", "fibAp"] }, SHARED_SEP = { top: ["D"], m: [] };

root.ARMSAPP = function (H) {
  const { fitCanvas, lamRGB, rgba, sig, grp, mm, FONT, INK, MUTED, message, makeTraces, splatTraces } = H;
  const DEG = Math.PI / 180, ACCENT = "#1f4e79";
  const group = inst => GROUPS[inst] || null;
  const armIds = inst => (GROUPS[inst] ? leaves(GROUPS[inst].tree) : []);
  const cuts = inst => (GROUPS[inst] ? nodes(GROUPS[inst].tree) : []);
  const shared = inst => { const G = GROUPS[inst]; return !G ? SHARED_COLL : G.shared || (G.split === "collimated" ? SHARED_COLL : SHARED_SEP); };
  const v = (x, y) => [x, y], ad = (p, q) => [p[0] + q[0], p[1] + q[1]], sub = (p, q) => [p[0] - q[0], p[1] - q[1]], sc = (p, s) => [p[0] * s, p[1] * s];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
  const rot = (p, t) => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];
  const nrm = p => { const n = Math.hypot(p[0], p[1]) || 1; return [p[0] / n, p[1] / n]; };
  const perp = p => [-p[1], p[0]];
  // (the light pulses: where the line p + s d meets the line through a along t; d reflected in a plane of normal n)
  const hitLine = (p, d, a, t) => { const c = d[0] * t[1] - d[1] * t[0], q = sub(a, p); return Math.abs(c) < 1e-12 ? p : ad(p, sc(d, (q[0] * t[1] - q[1] * t[0]) / c)); };
  const refl = (d, n) => sub(d, sc(n, 2 * dot(d, n)));
  const YR = [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45];   // the wavefronts' rays across the beam, in beam widths
  const RAY_W = "rgba(104,98,92,0.62)", RAY_T = "rgba(168,118,22,0.8)";   // white light; the telescope's light
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
  // the disperser's normal (and its outgoing direction e) in an arm's frame, the beam arriving along +x; cs picks the side
  // the camera turns to (unit() below, and the beams' ends on the gratings)
  function dispFrame(a, cs, xdOnly) {
    const P = a.P, D = a.D, ech = P.mode === "echelle", inc = v(1, 0);
    const xdRefl = xdOnly && P.xd === "grating";
    let e, nG;
    if (xdOnly && !xdRefl) { e = inc; nG = inc; }
    else if (xdRefl) { e = rot(v(-1, 0), -cs * (P.xPsi || 10) * DEG); nG = nrm(sub(e, inc)); }
    else if (ech) { e = rot(v(-1, 0), -cs * ECH_ANG); nG = nrm(sub(e, inc)); }
    else if (P.gType === "refl") { e = rot(v(-1, 0), -cs * (D.psi || 0)); nG = nrm(sub(e, inc)); }
    else if (P.gType === "grism") { e = inc; nG = inc; }
    else { e = rot(inc, cs * ((D.alpha || 0) + (D.beta || 0))); nG = rot(inc, cs * (D.alpha || 0)); }
    return { e, nG, xdRefl };
  }
  function unit(a, flip, tele, inj, pre0 = null, xdOnly = false) {
    const P = a.P, D = a.D, prims = [], labs = [], pieces = [];
    if (D.bad || !D.c) return { prims, labs, pieces: [[v(0, -1), v(1, 0), v(0, 1)]], bad: true };
    const ech = P.mode === "echelle", W = P.W, Wp = Math.max(W, D.Wp || W), fK = D.fcam, tint = bandRGB(D.range[0], D.range[1]);
    const bf = rgba(tint, 0.1), bs = rgba(tint, 0.4);
    // the arm's own slit and collimator (an instrument split in the telescope's beam): the disperser then sits at O,
    // the collimated beam arriving along dIn; cs picks the side the camera turns to
    let O = v(0, 0), dIn = v(1, 0), cs = 1;
    const chain = [];
    let innerAt = null;                           // (the pulses: an arm's own slit to its collimator, for height y)
    if (tele) {
      // (pre0, a split with no relay: the light arrives pre0.w wide, pre0.path from the slit, so the collimator stands
      // the rest of its focal length on, and the beam widens from pre0.w at the arm's start)
      const w0 = pre0 ? pre0.w : 0, fCa = Math.max(0.3 * (D.fcol || P.F * W), (D.fcol || P.F * W) - (pre0 ? pre0.path : 0));
      if (!inj) {
        prims.push({ k: "slit", p: v(0, 0), ax: v(1, 0), h: 0.05 * W + 6 });
        labs.push({ at: v(0, 0), txt: "slit", sub: sig(P.slitW, 2) + "″", pri: 1, dir: v(0, -1), optional: true });
      }
      if (P.col === "mirror") {
        // a mirror collimator folds the beam back RET off the slit's axis, to the disperser beside the arriving cone;
        // the camera then turns away from the cone
        const M = v(fCa, 0), r = rot(v(-1, 0), RET), nM = nrm(sub(r, v(1, 0))), tM = perp(nM), hf = 0.5 * W / Math.cos(RET / 2), hm = 1.12 * hf;
        const gapC = Math.max(1.3 * W + 40, 1.7 * W / Math.sin(RET));
        O = ad(M, sc(r, gapC)); dIn = r; cs = -1;
        innerAt = y => { const pM = ad(M, sc(tM, y / (0.5 * W) * hf)); return { pts: [v(0, y * w0 / W), pM], p: pM, d: r }; };
        prims.push({ k: "poly", p: [v(0, w0 / 2), ad(M, sc(tM, hf)), ad(M, sc(tM, -hf)), v(0, -w0 / 2)], fill: bf, stroke: bs });
        const n = perp(r);
        prims.push({ k: "poly", p: [ad(M, sc(tM, hf)), ad(O, sc(n, -W / 2)), ad(O, sc(n, W / 2)), ad(M, sc(tM, -hf))], fill: bf, stroke: bs });
        prims.push({ k: "mirror", c: M, t: tM, n: nM, h: hm });
        chain.push(v(0, Math.max(0.08 * W, w0 / 2)), v(0, -Math.max(0.08 * W, w0 / 2)), ad(M, sc(tM, hm)), ad(M, sc(tM, -hm)), ad(ad(M, sc(tM, hm)), sc(nM, -0.1 * W)), ad(ad(M, sc(tM, -hm)), sc(nM, -0.1 * W)));
      } else {
        const gapC = (ech ? 1.7 : 1.3) * W + 40;
        prims.push({ k: "poly", p: [v(0, w0 / 2), v(fCa, W / 2), v(fCa, -W / 2), v(0, -w0 / 2)], fill: bf, stroke: bs });
        prims.push({ k: "poly", p: [v(fCa, W / 2), v(fCa + gapC, W / 2), v(fCa + gapC, -W / 2), v(fCa, -W / 2)], fill: bf, stroke: bs });
        prims.push({ k: "lens", c: v(fCa, 0), ax: v(1, 0), h: 0.56 * W });
        chain.push(v(0, Math.max(0.08 * W, w0 / 2)), v(0, -Math.max(0.08 * W, w0 / 2)), v(fCa, 0.6 * W), v(fCa, -0.6 * W));
        O = v(fCa + gapC, 0);
        innerAt = y => ({ pts: [v(0, y * w0 / W), v(fCa, y)], p: v(fCa, y), d: v(1, 0) });
      }
    }
    // the disperser, in a frame where the beam arrives along +x at the origin, then turned and moved to O.  The
    // camera's direction: a reflection grating turns the beam back by the camera-collimator angle, an echelle (drawn
    // with its camera arm off the returning beam, as in the Spectral view) back by ECH_ANG, a transmission or VPH
    // grating deviates it forward by alpha + beta, a grism passes it straight
    const th = Math.atan2(dIn[1], dIn[0]), X = q => ad(O, rot(q, th)), XD = q => rot(q, th);
    const inc = v(1, 0);
    const { e, nG, xdRefl } = dispFrame(a, cs, xdOnly);
    const refl = xdOnly ? xdRefl : ech || P.gType === "refl", tG = perp(nG);
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
    const gName = xdOnly ? P.xdLabel || (P.xd === "vph" ? "VPH grating" : P.xd === "grism" ? "grism" : P.xd === "prism" ? "prism" : "cross-disperser")
      : ech ? "echelle" : P.gType === "grism" ? "grism" : P.gType === "refl" ? "grating" : P.gKind === "vph" || /VPH/i.test(a.name) ? "VPH" : "grating";
    const gSub = xdOnly ? (P.xd === "prism" ? "" : sig(P.xG, 4) + " /mm") : ech ? sig(P.eG, 3) + " /mm" : sig(P.G, 4) + " /mm";
    // the grating's label beyond its end on the side away from the camera, the arm's beyond its detector
    const far = dot(tG, e) <= 0 ? tG : sc(tG, -1);
    labs.push({ at: X(sc(far, gHalf)), txt: gName, sub: gSub, pri: 3, dir: XD(far) });
    labs.push({ at: X(ad(Dc, sc(e, 6))), txt: a.name, sub: grp(D.range[0] * 1e4) + "–" + grp(D.range[1] * 1e4) + " Å", pri: 5, dir: XD(e), arm: a.id });
    const gEnds = [X(sc(tG, gHalf)), X(sc(tG, -gHalf))];
    if (tele) pieces.push(hull([...chain, ...gEnds, X(v(0, 0.55 * W)), X(v(0, -0.55 * W))]));
    pieces.push(hull([...gEnds, ...[ad(C, sc(t, ch)), ad(C, sc(t, -ch)), ad(Dc, sc(t, D.Lx / 2)), ad(Dc, sc(t, -D.Lx / 2)), ad(Dc, sc(e, 0.08 * fK)), ...focus].map(X)]));
    // the light pulses (anim.js): from a point on the grating, each of the three wavelengths through the camera to its
    // focus; the grating's ends; and, for an arm with its own slit, the rays from that slit to the grating.  All in the
    // arm's final frame (after the flip), as the primitives
    const Ff = p => (flip < 0 ? [p[0], -p[1]] : p), toG = p => rot(sub(Ff(p), O), -th), fromG = q => Ff(X(q));
    const lamR = [lo, (lo + hi) / 2, hi].map(l => { const pq = D.pos(l, m); return pq ? { l, b: nrm(rot(e, cs * Math.atan(pq[0] / fK))), Q: ad(Dc, sc(t, cs * pq[0])) } : null; }).filter(Boolean);
    const colRays = hit => { const q = toG(hit); return lamR.map(L => ({ l: L.l, pts: [q, ad(q, sc(L.b, dot(sub(C, q), e) / dot(L.b, e))), L.Q].map(fromG) })); };
    const gl = [fromG(sc(tG, gHalf)), fromG(sc(tG, -gHalf))];
    const inner = innerAt ? YR.map(u => { const r0 = innerAt(u * W); return [...r0.pts, hitLine(r0.p, r0.d, O, rot(tG, th))].map(Ff); }) : [];
    if (flip < 0) {
      const F = p => [p[0], -p[1]];
      for (const pr of prims) { if (pr.p && Array.isArray(pr.p[0])) pr.p = pr.p.map(F); else if (pr.p) pr.p = F(pr.p); if (pr.c) pr.c = F(pr.c); if (pr.ax) pr.ax = F(pr.ax); if (pr.t) pr.t = F(pr.t); if (pr.n) pr.n = F(pr.n); }
      for (const L of labs) { L.at = F(L.at); L.dir = F(L.dir); }
      for (let i = 0; i < pieces.length; i++) pieces[i] = pieces[i].map(F).reverse();
    }
    return { prims, labs, pieces, tint, gl, colRays, inner };
  }

  // ---- the scene for one choice of turning senses and lengths (cfg), in world mm: primitives, labels, and the
  // bodies (convex pieces tagged with the nodes they join; bodies that share a node may touch)
  function scene(G, arms, cfg, wantRays = false) {
    const byId = Object.fromEntries(arms.map(a => [a.id, a])), a0 = arms.find(a => !a.D.bad && a.D.c) || arms[0];
    const echS = G.split === "echelle", tele = G.split !== "collimated" && !echS, W = a0.P.W, prims = [], labs = [], bodies = [];
    // the light pulses' rays (anim.js, only for the drawing that is shown): polylines in world mm, traced as light runs,
    // straight through each dichroic and reflected in it and in each fold, to the gratings; t places a colored ray on
    // the wavelength scale of all the arms together (the pulse's wiggle follows it)
    const rays = [], ray = (pts, c, t) => { if (wantRays) rays.push({ pts, c, t }); };
    const okA = arms.filter(a => !a.D.bad && a.D.c), lamLo = Math.min(...okA.map(a => a.D.range[0])), lamHi = Math.max(...okA.map(a => a.D.range[1]));
    const colRay = c => ray(c.pts, rgba(lamRGB(c.l * 1e4), 0.95), lamHi > lamLo ? (c.l - lamLo) / (lamHi - lamLo) : 0.5);
    let R0 = [];                                                  // the rays' states {p, d} entering the dichroic tree
    const body = (pieces, tags, opt = {}) => bodies.push({ pieces: pieces.filter(p => p.length >= 3), tags, ...opt });
    const band = n => { const ls = leaves(n).map(id => byId[id]).filter(a => a && !a.D.bad && a.D.c); return ls.length ? [Math.min(...ls.map(a => a.D.range[0])), Math.max(...ls.map(a => a.D.range[1]))] : null; };
    const fill = bd => (bd ? rgba(bandRGB(bd[0], bd[1]), 0.1) : WHITE_F), stroke = bd => (bd ? rgba(bandRGB(bd[0], bd[1]), 0.4) : WHITE_S);
    // a beam segment from p to q, wp wide at p and wq at q
    // (crossOK: a beam that the sources draw crossing other beams, which it may; it may not cross an optic)
    // (tp, tq: the tangents of the surfaces at p and q, a dichroic, a fold, a mirror or a grating, along which the beam's
    // ends are cut; square ends where none is given or where the cut would run past half the segment)
    const seg = (p, q, wp, wq, bd, tags, crossOK = false, tp = null, tq = null) => {
      const n = perp(nrm(sub(q, p))), Ls = Math.hypot(...sub(q, p));
      const edge = s => {
        const A = ad(p, sc(n, s * wp / 2)), B = ad(q, sc(n, s * wq / 2)), e = sub(B, A);
        let a2 = A, b2 = B;
        if (tp) { const h = hitLine(A, e, p, tp); if (Math.hypot(...sub(h, A)) < 0.45 * Ls) a2 = h; }
        if (tq) { const h = hitLine(A, e, q, tq); if (Math.hypot(...sub(h, B)) < 0.45 * Ls) b2 = h; }
        return [a2, b2];
      };
      const [a1, b1] = edge(1), [a0, b0] = edge(-1), poly = [a1, b1, b0, a0];
      prims.push({ k: "poly", p: poly, fill: fill(bd), stroke: stroke(bd) });
      // shortened at both ends, so that the beam may meet the optics it joins
      const s0 = Math.min(0.45, (0.7 * W) / (Math.hypot(...sub(q, p)) || 1));
      const pp = ad(p, sc(sub(q, p), s0)), qq = ad(p, sc(sub(q, p), 1 - s0)), wpp = wp + (wq - wp) * s0, wqq = wp + (wq - wp) * (1 - s0);
      body([hull([ad(pp, sc(n, wpp / 2)), ad(qq, sc(n, wqq / 2)), ad(qq, sc(n, -wqq / 2)), ad(pp, sc(n, -wpp / 2))])], tags, { beam: true, crossOK });
    };
    // the surface a beam arriving along d at point at meets first: a dichroic's or a fold's plane, an arm's grating (an arm
    // with its own slit or relay starts square)
    const planeAt = (node, d, psense) => {
      if (typeof node === "string") {
        const a = byId[node];
        if (tele || !a || a.D.bad || !a.D.c) return null;
        const t = perp(dispFrame(a, 1, echS).nG), f = cfg.af[node] || 1;
        return rot(f < 0 ? v(t[0], -t[1]) : t, Math.atan2(d[1], d[0]));
      }
      const sense = node.fold ? (node.rel || 1) * psense : node.rel ? node.rel * psense : cfg.ds[node._k];
      const aoi = (node.fold || node.aoi) * DEG, rd = nrm(rot(d, sense * (Math.PI - 2 * aoi)));
      return perp(nrm(sub(rd, d)));
    };
    // (a split after the telescope's focus: the true telescope focal ratio, from GROUPS; the arms' F is their slit's)
    const Ftel = tele ? G.Ftel : a0.P.F, pre = G.split === "preslit", Wpre = pre ? G.Wpre : 0;
    let first, dir0, w0 = W;
    if (!tele) {
      const fC = a0.D.fcol || a0.P.F * W, Lt = Math.min(0.32 * fC, 1.6 * W), tHalf = Lt / (2 * a0.P.F);
      const telCone = [v(-Lt, tHalf), v(0, 0), v(-Lt, -tHalf)];
      prims.push({ k: "poly", p: telCone, fill: "rgba(214,160,50,0.18)", stroke: "rgba(214,160,50,0.6)" });
      labs.push({ at: v(-Lt, 0), txt: "telescope", sub: "f/" + sig(a0.P.F, 3), pri: 2, dir: v(-1, 0) });
      for (const f of [-1, 0, 1]) ray([v(-Lt, f * tHalf), v(0, 0)], RAY_T);
      if (a0.P.col === "mirror") {
        // a mirror collimator: the light from the slit to the mirror, returned RET off the axis, past the slit.  An
        // on-axis mirror (colTilt 0: DESI, PFS, LLAMAS) returns the light along the axis, the slit standing in the
        // returning beam, and the first dichroic follows the slit (DESI's slit passes through a slot in that dichroic,
        // LLAMAS's dichroic carries the slit plate; here placed past the telescope's cone, for clarity)
        const onAx = a0.P.colTilt === 0, tilt = onAx ? 0 : RET;
        const M = v(fC, 0), r0 = rot(v(-1, 0), onAx ? 0 : cfg.ret * RET), nM = nrm(sub(r0, v(1, 0))), tM = perp(nM);
        const hf = 0.5 * W / Math.cos(tilt / 2), hm = 1.12 * hf;
        prims.push({ k: "poly", p: [v(0, 0), ad(M, sc(tM, hf)), ad(M, sc(tM, -hf))], fill: WHITE_F, stroke: WHITE_S });
        prims.push({ k: "mirror", c: M, t: tM, n: nM, h: hm });
        labs.push({ at: ad(M, sc(nM, -0.04 * W)), txt: "collimator", sub: "f = " + mm(fC), pri: 2, dir: sc(nM, -1) });
        // (on the axis the telescope's cone lies inside the returning beam: the two share the tag n0)
        body([hull([...telCone, v(0, 0.06 * W), v(0, -0.06 * W)])], onAx ? ["tel", "n0"] : ["tel"]);
        body([hull([v(0.3 * fC, 0.15 * W), v(0.3 * fC, -0.15 * W), ad(M, sc(tM, 0.8 * hf)), ad(M, sc(tM, -0.8 * hf))])], ["tel", "col"]);
        body([hull([ad(M, sc(tM, hm)), ad(M, sc(tM, -hm)), ad(ad(M, sc(tM, hm)), sc(nM, -0.08 * W)), ad(ad(M, sc(tM, -hm)), sc(nM, -0.08 * W))])], ["col"]);
        if (echS) {
          // the shared echelle: the collimated beam meets it beside the slit, and the dispersed light leaves ECH_ANG off
          // the returning beam, away from the axis, to the dichroics (the transfer optics between are not drawn)
          const Le = Math.max(1.4 * W + 40, 0.6 * fC), E = ad(M, sc(r0, Le));
          const cand = [ECH_ANG, -ECH_ANG].map(t => rot(sc(r0, -1), t)), r1 = Math.abs(ad(E, cand[0])[1]) >= Math.abs(ad(E, cand[1])[1]) ? cand[0] : cand[1];
          const nE = nrm(sub(r1, r0)), tE = perp(nE), hE = 0.55 * W / Math.max(0.25, Math.abs(dot(nE, r0))), back = Math.abs(dot(nE, sc(r0, -1)) ) > 0 ? sc(nE, -1) : nE;
          prims.push({ k: "line", p: [ad(E, sc(tE, hE)), ad(E, sc(tE, -hE))], col: STEEL, lw: 4 });
          const far = dot(tE, v(-1, 0)) >= 0 ? tE : sc(tE, -1);
          labs.push({ at: ad(E, sc(far, hE)), txt: "echelle", sub: sig(a0.P.eG, 3) + " /mm, shared", pri: 3, dir: far });
          body([hull([ad(E, sc(tE, hE)), ad(E, sc(tE, -hE)), ad(ad(E, sc(tE, hE)), sc(back, 0.1 * W)), ad(ad(E, sc(tE, -hE)), sc(back, 0.1 * W))])], ["ech"]);
          seg(M, E, W, W, null, ["col", "ech"], false, tM, tE);
          first = ad(E, sc(r1, (1.35 * W + 40) * cfg.L0)); dir0 = r1;
          seg(E, first, W, W, null, ["ech", "n0"], false, tE, planeAt(G.tree, r1, 1));
          R0 = YR.map(u => { const pM = ad(M, sc(tM, 2 * u * hf)); ray([v(0, 0), pM], RAY_W); const H = hitLine(pM, r0, E, tE); ray([pM, H], RAY_W); return { p: H, d: r1 }; });
        } else {
        const L0 = onAx ? fC + Lt + (0.4 * W + 20) * cfg.L0 : (1.4 * W + 40) * cfg.L0;
        first = ad(M, sc(r0, L0)); dir0 = r0;
        seg(M, first, W, W, null, ["col", "n0"], false, tM, planeAt(G.tree, r0, 1));
        R0 = YR.map(u => { const pM = ad(M, sc(tM, 2 * u * hf)); ray([v(0, 0), pM], RAY_W); return { p: pM, d: r0 }; });
        }
      } else {
        const Lc = v(fC, 0);
        prims.push({ k: "poly", p: [v(0, 0), v(fC, W / 2), v(fC, -W / 2)], fill: WHITE_F, stroke: WHITE_S });
        prims.push({ k: "lens", c: Lc, ax: v(1, 0), h: 0.56 * W });
        labs.push({ at: ad(Lc, v(0, -0.6 * W)), txt: "collimator", sub: "f = " + mm(fC), pri: 2, dir: v(0, -1) });
        body([hull([...telCone, v(0, 0.06 * W), v(0, -0.06 * W), v(fC, 0.6 * W), v(fC, -0.6 * W)])], ["tel", "col"]);
        const L0 = (0.9 * W + 40) * cfg.L0;
        first = ad(Lc, v(L0, 0)); dir0 = v(1, 0);
        seg(Lc, first, W, W, null, ["col", "n0"], false, null, planeAt(G.tree, v(1, 0), 1));
        R0 = YR.map(u => { const p = v(fC, u * W); ray([v(0, 0), p], RAY_W); return { p, d: v(1, 0) }; });
      }
      prims.push({ k: "slit", p: v(0, 0), ax: v(1, 0), h: 0.05 * W + 6 });
      labs.push({ at: v(0, 0), txt: "slit", sub: sig(a0.P.slitW, 3) + "″", pri: 1, dir: v(0, -1), optional: true });
    } else {
      // the telescope's cone to its focus at the origin: there the shared slit (MIKE) or the focal plane ahead of the
      // arms' own slits; then the light spreads at the telescope's focal ratio, to the dichroics ("focus") or to a
      // pre-slit collimator whose collimated beam carries the dichroics ("preslit", UVES)
      const Lt = 1.4 * W, tw = Lt / Ftel, cone = [v(-Lt, tw / 2), v(0, 0), v(-Lt, -tw / 2)];
      prims.push({ k: "poly", p: cone, fill: "rgba(214,160,50,0.18)", stroke: "rgba(214,160,50,0.6)" });
      labs.push({ at: v(-Lt, 0), txt: "telescope", sub: "f/" + sig(Ftel, 3), pri: 2, dir: v(-1, 0) });
      for (const f of [-1, 0, 1]) ray([v(-Lt, f * tw / 2), v(0, 0)], RAY_T);
      if (G.slit === "shared") {
        prims.push({ k: "slit", p: v(0, 0), ax: v(1, 0), h: 0.05 * W + 6 });
        labs.push({ at: v(0, 0), txt: "slit", sub: sig(a0.P.slitW, 3) + "″", pri: 2, dir: v(0, -1) });
      } else {
        prims.push({ k: "dot", p: v(0, 0) });
      }
      body([hull([...cone, v(0.02 * W, 0.04 * W), v(0.02 * W, -0.04 * W)])], ["tel"]);
      if (pre) {
        const fp = Wpre * Ftel, Lc = v(fp, 0);
        prims.push({ k: "poly", p: [v(0, 0), v(fp, Wpre / 2), v(fp, -Wpre / 2)], fill: WHITE_F, stroke: WHITE_S });
        prims.push({ k: "lens", c: Lc, ax: v(1, 0), h: 0.6 * Wpre });
        labs.push({ at: ad(Lc, v(0, -0.65 * Wpre)), txt: "collimator", sub: "pre-slit", pri: 2, dir: v(0, -1) });
        body([hull([v(0.3 * fp, 0.15 * Wpre), v(0.3 * fp, -0.15 * Wpre), v(fp, 0.62 * Wpre), v(fp, -0.62 * Wpre)])], ["tel", "col"]);
        const L0 = (1.4 * Wpre + 40) * cfg.L0;
        first = ad(Lc, v(L0, 0)); dir0 = v(1, 0); w0 = Wpre;
        seg(Lc, first, Wpre, Wpre, null, ["col", "n0"], false, null, planeAt(G.tree, v(1, 0), 1));
        R0 = YR.map(u => { const p = v(fp, u * Wpre); ray([v(0, 0), p], RAY_W); return { p, d: v(1, 0) }; });
      } else {
        const L0 = (0.9 * W + 40) * cfg.L0;
        first = v(L0, 0); dir0 = v(1, 0); w0 = L0 / Ftel;
        seg(v(0, 0), first, 0, w0, null, ["tel", "n0"], false, null, planeAt(G.tree, v(1, 0), 1));
        R0 = YR.map(u => ({ p: v(0, 0), d: nrm(v(L0, u * w0)) }));          // diverging from the telescope's focus
      }
    }
    // the tree: at each dichroic the reflected light turns by 180 - 2 AOI (to the side cfg.ds picks), the transmitted
    // light runs on
    // (Rs: the rays' states arriving with the beam; each meets the optic's plane, through at along its tangent)
    const meet = (Rs, at, tPl, nPl) => Rs.map(st => { const H = hitLine(st.p, st.d, at, tPl); ray([st.p, H], RAY_W); return { H, d: st.d, r: nPl ? refl(st.d, nPl) : st.d }; });
    const walk = (node, at, d, wNow, path, tag, psense = 1, Rs = []) => {
      if (node && node.fold) {
        // a fold mirror: the light turns by 180 - 2 AOI, the sense fixed relative to the last dichroic's turn
        const sense = (node.rel || 1) * psense, aoi = node.fold * DEG;
        const rd = nrm(rot(d, sense * (Math.PI - 2 * aoi))), nPl = nrm(sub(rd, d)), tPl = perp(nPl);
        const half = 0.56 * Math.max(wNow, 0.12 * W) / Math.max(0.2, Math.cos(aoi)), thk = 0.035 * W + 2;
        prims.push({ k: "fmir", p: [ad(at, sc(tPl, half)), ad(at, sc(tPl, -half))], back: sc(nPl, -1) });
        labs.push({ at: ad(at, sc(tPl, half)), txt: "fold mirror", sub: "", pri: 3, dir: tPl, optional: true });
        // (a fold the sources draw beside crossing beams: only a real intersection with a beam counts, not the clearance)
        body([[ad(ad(at, sc(tPl, half)), sc(nPl, thk)), ad(ad(at, sc(tPl, -half)), sc(nPl, thk)), ad(ad(at, sc(tPl, -half)), sc(nPl, -thk)), ad(ad(at, sc(tPl, half)), sc(nPl, -thk))]], [tag], { nearOK: !!node.cross });
        const br = node.to, leaf = typeof br === "string", ctag = leaf ? "a:" + br : "f:" + leaves(br)[0];
        const len = ((tele ? 0.9 : 1.35) * W + 40) * (cfg.L[node._f] || 1), to = ad(at, sc(rd, len)), wTo = tele && !pre ? (path + len) / Ftel : wNow;
        seg(at, to, wNow, wTo, band(br), [tag, ctag], !!node.cross, tPl, planeAt(br, rd, psense));
        walk(br, to, rd, wTo, path + len, ctag, psense, meet(Rs, at, tPl, nPl).map(q => ({ p: q.H, d: q.r })));
        return;
      }
      if (typeof node === "string") {
        const a = byId[node];
        if (!a) return;
        // (after the telescope's focus: the arm's relay at the branch's end; with the arms' own slits it focuses the
        // light on the slit at the arm's focal ratio, with MIKE's shared slit its injection optics feed the arm)
        let o = at, extra = null;
        const noRelay = tele && !G.relay && G.slit === "shared";
        if (tele && !a.D.bad && a.D.c && !noRelay) {
          const n = perp(d), hR = 0.62 * wNow + 0.03 * W;
          prims.push({ k: "lens", c: at, ax: d, h: hR });
          labs.push({ at: ad(at, sc(n, -hR)), txt: G.relay, sub: "", pri: 1, dir: sc(n, -1), optional: true });
          if (G.slit !== "shared") {
            o = ad(at, sc(d, wNow * a.P.F));
            prims.push({ k: "poly", p: [ad(at, sc(n, wNow / 2)), o, ad(at, sc(n, -wNow / 2))], fill: rgba(bandRGB(a.D.range[0], a.D.range[1]), 0.1), stroke: rgba(bandRGB(a.D.range[0], a.D.range[1]), 0.4) });
          }
          extra = hull([ad(at, sc(n, hR)), ad(at, sc(n, -hR)), ad(o, sc(n, 0.05 * W)), ad(o, sc(n, -0.05 * W)), ad(at, sc(d, 0.05 * W))]);
        }
        const U = unit(a, cfg.af[node] || 1, tele, G.slit === "shared", noRelay ? { path, w: wNow } : null, echS), th = Math.atan2(d[1], d[0]), T = q => ad(o, rot(q, th));
        if (wantRays && !U.bad) {
          if (tele) {
            // to the arm's relay (a lens square to the beam at at), then on to the arm's slit (or, with the shared slit, the
            // injection optics at at); inside the arm, from that slit by way of its collimator to the grating
            const hs = meet(Rs, at, perp(d), null);
            if (noRelay) {
              // (no relay: each ray runs on from where it crosses the arm's start, by the nearest of the arm's own rays)
              for (const q of hs) {
                let pl = null, dm = Infinity;
                for (const p0 of U.inner) { const dd = Math.hypot(...sub(T(p0[0]), q.H)); if (dd < dm) { dm = dd; pl = p0; } }
                if (!pl) continue;
                ray([q.H, ...pl.slice(1).map(T)], RAY_W);
                for (const c of U.colRays(pl[pl.length - 1])) colRay({ l: c.l, pts: c.pts.map(T) });
              }
            } else {
              for (const q of hs) ray([q.H, o], RAY_W);
              for (const pl of U.inner) { ray(pl.map(T), RAY_W); for (const c of U.colRays(pl[pl.length - 1])) colRay({ l: c.l, pts: c.pts.map(T) }); }
            }
          } else {
            // the collimated rays to the grating, in the arm's frame
            for (const st of Rs) {
              const hu = hitLine(rot(sub(st.p, o), -th), rot(st.d, -th), U.gl[0], sub(U.gl[1], U.gl[0]));
              ray([st.p, T(hu)], RAY_W);
              for (const c of U.colRays(hu)) colRay({ l: c.l, pts: c.pts.map(T) });
            }
          }
        }
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
        body([...U.pieces.map(pc => pc.map(T)), ...(extra ? [extra] : [])], [tag]);
        return;
      }
      const k = node._k, sense = node.rel ? node.rel * psense : cfg.ds[k], aoi = node.aoi * DEG;
      const rd = nrm(rot(d, sense * (Math.PI - 2 * aoi))), nPl = nrm(sub(rd, d)), tPl = perp(nPl);
      const half = 0.56 * Math.max(wNow, 0.12 * W) / Math.max(0.2, Math.cos(aoi)), thk = 0.035 * W + 2;
      prims.push({ k: "dich", p: [ad(at, sc(tPl, half)), ad(at, sc(tPl, -half))] });
      labs.push({ at: ad(at, sc(tPl, half)), txt: "dichroic " + grp(node.cut / 10) + " nm", sub: node.inferred ? "inferred" : "", pri: 4, dir: tPl });
      body([[ad(ad(at, sc(tPl, half)), sc(nPl, thk)), ad(ad(at, sc(tPl, -half)), sc(nPl, thk)), ad(ad(at, sc(tPl, -half)), sc(nPl, -thk)), ad(ad(at, sc(tPl, half)), sc(nPl, -thk))]], [tag]);
      const spread = tele && !pre;                                 // (the beam widens from the telescope's focus)
      const base = (tele ? 0.9 : 1.35) * W + 40, hits = meet(Rs, at, tPl, nPl);
      for (const [br, dd, j] of [[node.T, d, 0], [node.R, rd, 1]]) {
        const leaf = typeof br === "string", ctag = leaf ? "a:" + br : br.fold ? "f:" + leaves(br)[0] : "n" + br._k;
        const len = base * cfg.L[k * 2 + j];
        const to = ad(at, sc(dd, len)), wTo = spread ? (path + len) / Ftel : wNow;
        seg(at, to, wNow, wTo, band(br), [tag, ctag], false, tPl, planeAt(br, dd, sense));
        walk(br, to, dd, wTo, path + len, ctag, sense, hits.map(q => ({ p: q.H, d: j ? q.r : q.d })));
      }
    };
    walk(G.tree, first, dir0, w0, tele && !pre ? first[0] : 0, "n0", 1, R0);
    return { prims, labs, bodies, W, rays };
  }

  // the cost of a scene: the overlaps between bodies that share no node (in units of the beam width), and the
  // scale at which the drawing fills the panel
  function scoreOf(S, aspect) {
    let ov = 0;
    const pairs = [];                                                // (for the tests: which bodies overlap)
    const bb = S.bodies.map(b => { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const pc of b.pieces) for (const q of pc) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); } return [x0, x1, y0, y1]; });
    const gap = 0.45 * S.W;
    for (let i = 0; i < S.bodies.length; i++) for (let j = i + 1; j < S.bodies.length; j++) {
      const A = S.bodies[i], B = S.bodies[j];
      if (A.tags.some(t => B.tags.includes(t))) continue;
      if ((A.crossOK && B.beam) || (B.crossOK && A.beam)) continue;
      const a = bb[i], b = bb[j];
      if (a[1] + gap < b[0] || b[1] + gap < a[0] || a[3] + gap < b[2] || b[3] + gap < a[2]) continue;
      let o = 0;
      const gp = (A.nearOK && B.beam) || (B.nearOK && A.beam) ? 0 : gap;
      for (const pa of A.pieces) for (const pb of B.pieces) o += depth(pa, pb, gp);
      if (o > 0) { ov += o; pairs.push(A.tags.join(",") + (A.beam ? "(beam)" : "") + " x " + B.tags.join(",") + (B.beam ? "(beam)" : "")); }
    }
    const all = bb.reduce((r, b) => [Math.min(r[0], b[0]), Math.max(r[1], b[1]), Math.min(r[2], b[2]), Math.max(r[3], b[3])], [Infinity, -Infinity, Infinity, -Infinity]);
    const sx = aspect / (all[1] - all[0]), sy = 1 / (all[3] - all[2]);
    return { ov: ov / S.W, s: Math.min(sx, sy), pairs };
  }
  // the search: every combination of the turning senses at the base lengths; then, for the best few, the lengths
  // one branch at a time
  function choose(G, arms, aspect) {
    const nd = indexTree(G.tree), ids = leaves(G.tree), nf = folds(G.tree).length;
    // (the side to which a mirror collimator returns the light is one more choice, except on the axis)
    const a0 = arms.find(a => !a.D.bad && a.D.c), onAx = !!a0 && a0.P.col === "mirror" && a0.P.colTilt === 0;
    const nS = nd.length + ids.length + ((G.split === "collimated" || G.split === "echelle") && !onAx ? 1 : 0);
    const make = (bits, L, L0) => ({ ds: nd.map((_, k) => (bits >> k) & 1 ? -1 : 1), af: Object.fromEntries(ids.map((id, i) => [id, (bits >> (nd.length + i)) & 1 ? -1 : 1])), ret: (bits >> (nd.length + ids.length)) & 1 ? -1 : 1, L, L0 });
    const evalC = c => { const r = scoreOf(scene(G, arms, c), aspect); return { c, ov: r.ov, s: r.s }; };
    const L1 = nd.flatMap(() => [1, 1]).concat(Array(nf).fill(1));
    // the search, with a cost that weighs overlap against scale; if its best still overlaps (a fast collimator's wide cone,
    // WEAVE's f/3.1, traded a sliver of overlap for a more compact drawing), it runs again with any overlap at all costing
    // more than a modest loss of scale.  The second pass runs only then, so the layouts without overlap stay as they were
    const search = strict => {
    const cost = (r, sMax) => 8 * r.ov + (strict && r.ov > 1e-6 ? 2 : 0) + sMax / r.s;
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
    return best;
    };
    const b0 = search(false);
    return (b0.ov > 1e-6 ? search(true) : b0).c;
  }
  // the choice is kept while the design stays in the same coarse bin (and the panel keeps its shape)
  const memo = new Map();
  function configFor(G, inst, arms, aspect) {
    const key = inst + "|" + Math.round(aspect * 3) + "|" + arms.map(a => a.D.bad || !a.D.c ? "x" : [a.id, Math.round(Math.log(a.P.W) * 3), Math.round(Math.log(a.D.fcam) * 3), Math.round(((a.D.alpha || 0) + (a.D.beta || 0) + (a.D.psi || 0)) / (10 * DEG)), a.P.gType, a.P.col + (a.P.colTilt === 0 ? "0" : "")].join(",")).join(";");
    if (!memo.has(key)) { if (memo.size > 60) memo.clear(); memo.set(key, choose(G, arms, aspect)); }
    indexTree(G.tree);
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
    const Sc = scene(G, arms, cfg, true);
    const sc0 = scoreOf(Sc, aspect);
    last = { ov: sc0.ov, pairs: sc0.pairs, labels: [], cfg: JSON.parse(JSON.stringify(cfg)), probe: patch => scoreOf(scene(G, arms, Object.assign({}, cfg, patch)), aspect) };
    // fit: the bodies' extent, with room for the labels
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const b of Sc.bodies) for (const pc of b.pieces) for (const q of pc) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
    const padX = 70, padY = 20;
    const s = Math.min((w - mL - mR - 2 * padX) / (x1 - x0), (h - mT - mB - 2 * padY) / (y1 - y0));
    const ox = mL + ((w - mL - mR) - s * (x1 - x0)) / 2 - s * x0, oy = mT + ((h - mT - mB) - s * (y1 - y0)) / 2 + s * y1;
    const X = p => [ox + s * p[0], oy - s * p[1]];
    g.lineJoin = "round";
    const order = { poly: 0, slit: 1, dot: 1, lens: 2, mirror: 2, line: 3, dich: 3, fmir: 3 };
    for (const pr of Sc.prims.slice().sort((p, q) => order[p.k] - order[q.k])) {
      if (pr.k === "poly") {
        g.beginPath(); pr.p.forEach((q, i) => { const c = X(q); i ? g.lineTo(c[0], c[1]) : g.moveTo(c[0], c[1]); }); g.closePath();
        if (pr.fill) { g.fillStyle = pr.fill; g.fill(); }
        if (pr.stroke) { g.strokeStyle = pr.stroke; g.lineWidth = 0.8; g.stroke(); }
      } else if (pr.k === "fmir") {
        const a = X(pr.p[0]), b = X(pr.p[1]), bk = X(ad(pr.p[0], pr.back)), o0 = X(pr.p[0]), ux = (bk[0] - o0[0]), uy = (bk[1] - o0[1]), ul = Math.hypot(ux, uy) || 1;
        const hx = 6 * ux / ul, hy = 6 * uy / ul, nH = Math.max(5, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 7));
        g.lineCap = "butt"; g.strokeStyle = "rgba(90,96,108,0.8)"; g.lineWidth = 0.8; g.beginPath();
        for (let i = 0; i <= nH; i++) { const x = a[0] + (b[0] - a[0]) * i / nH, y = a[1] + (b[1] - a[1]) * i / nH; g.moveTo(x, y); g.lineTo(x + hx + 0.4 * (b[0] - a[0]) / nH, y + hy + 0.4 * (b[1] - a[1]) / nH); }
        g.stroke();
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = "#5a606c"; g.lineWidth = 3.2; g.stroke();
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
      } else if (pr.k === "dot") {
        const c = X(pr.p); g.beginPath(); g.arc(c[0], c[1], 2.6, 0, 2 * Math.PI); g.fillStyle = "#5a544e"; g.fill();
      } else if (pr.k === "slit") {
        const n = perp(pr.ax), a = X(ad(pr.p, sc(n, pr.h))), b = X(ad(pr.p, sc(n, -pr.h)));
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = "#3b3733"; g.lineWidth = 3; g.lineCap = "butt"; g.stroke();
      }
    }
    // the wavefronts (anim.js): the traced pieces joined end to end into whole rays (a piece carries on from the
    // latest earlier piece that ends where it starts: through each dichroic, both ways, and from the grating, each
    // wavelength), then set square to the rays leg by leg (anim.js's malus, in world mm): for each arm the white light
    // from the telescope (or the collimated beam's start) to its grating as one bundle, and from the grating each
    // wavelength as a bundle of its own, carrying on from the white light where it meets the grating
    if (window.ANIM && window.ANIM.malus) {
      // (where several pieces end at one point, a focus such as an arm's own slit, each piece leaving it takes the one
      // carried on least so far, so the bundle keeps its rays; at a dichroic both beams carry on from the one piece)
      const R = Sc.rays, prev = R.map(() => -1), used = R.map(() => 0), near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-3;
      R.forEach((r, i) => {
        let best = -1;
        for (let j = i - 1; j >= 0; j--) if (near(R[j].pts[R[j].pts.length - 1], r.pts[0]) && (best < 0 || used[j] < used[best])) best = j;
        if (best >= 0) { prev[i] = best; used[best]++; }
      });
      const whole = i => { const out = []; for (let j = i; j >= 0; j = prev[j]) out.unshift(...(out.length ? R[j].pts.slice(0, -1) : R[j].pts)); return out; };
      // each wavelength's pieces (its t) and the white pieces they start from; an arm: the white pieces that end on its grating
      const byL = new Map();
      R.forEach((r, i) => { if (r.t != null && prev[i] >= 0) { if (!byL.has(r.t)) byL.set(r.t, []); byL.get(r.t).push(i); } });
      const armOf = new Map(), arms = [], list = [];
      for (const idx of byL.values()) {
        const key = idx.map(i => prev[i]).sort((a, b) => a - b).join(",");
        if (!armOf.has(key)) { armOf.set(key, arms.length); arms.push(idx.map(i => prev[i])); }
      }
      const arr = new Map();
      arms.forEach((ends, ai) => {
        const M = window.ANIM.malus(ends.map(whole), null, [0, 0]);
        M.out.forEach((o, k) => { arr.set(ends[k], M.arr[k]); list.push({ p: o.p.map(X), s: o.s, s0: o.s[0], c: RAY_W, g: "w" + ai, trail: false }); });
      });
      let li = 0;
      for (const [t, idx] of byL) {
        const M = window.ANIM.malus(idx.map(i => R[i].pts), idx.map(i => arr.get(prev[i]) || 0));
        M.out.forEach((o, k) => list.push({ p: o.p.map(X), s: o.s, s0: o.s[0], c: R[idx[k]].c, t, g: "l" + li, trail: false }));
        li++;
      }
      window.ANIM.set(cv, window.ANIM.fromZero(list));
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
    return { capX, tele: G.split !== "collimated" && G.split !== "echelle" };
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
    // (each bar dimmed where the dichroics send that light to another arm: beyond the crossover and its transition)
    const pb = GROUPS[inst] ? passBands(GROUPS[inst].tree) : {};
    ok.forEach((a, i) => {
      const yy = y0 + i * (rowH + 6), r0 = a.D.range[0], r1 = a.D.range[1], b = pb[a.id];
      for (let k = 0; k < 96; k++) {
        const l0 = r0 + (r1 - r0) * k / 96, l1 = r0 + (r1 - r0) * (k + 1) / 96, lA = (l0 + l1) / 2 * 1e4;
        const out = b && (lA < b[0] - b[2] || lA > b[1] + b[3]);
        g.fillStyle = rgba(lamRGB(lA), out ? 0.22 : 0.9); g.fillRect(XL(l0), yy, XL(l1) - XL(l0) + 0.5, rowH);
      }
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
      "; the turning directions and spacings are chosen for clarity" + (G && G.note ? "; " + G.note : "") + ". The controls set the " + (act ? act.name.replace(/\s*[,(].*$/, "").replace(/\s+arm$/i, "") + " arm" : "first arm") +
      "; a click on another arm moves the controls to that arm.";
  }
  return { group, armIds, cuts, shared, drawLayout, drawDetectors, stats, caption, hitLayout, hitDetector, GROUPS, test: () => last };
};
})(typeof window !== "undefined" ? window : globalThis);
