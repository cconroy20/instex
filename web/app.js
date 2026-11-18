/* Page logic for the Instrument Explorer: the controls, the results strip, the optical layout and
   the detector.  All optics are in physics.js (window.IX). */
(function () {
"use strict";
const IX = window.IX;
const $ = id => document.getElementById(id);
const errBox = $("err");
window.addEventListener("error", e => {
  if (/ResizeObserver loop/.test(e.message || "")) return;           // a harmless browser notice, not a page error
  errBox.hidden = false; errBox.textContent += (e.message || String(e)) + "\n";
});

// ------------------------------------------------------------------ state
// The telescope is shared; each mode keeps its own entrance, spectrograph, disperser and detector.
const DEF = {
  mode: "grating",
  D: 6.5, F: 5,
  arms: false,                                                   // every arm of a multi-arm instrument in one view (arms.js)
  g: { slitW: 1, traceW: null, nObj: 1, col: "lens", cam: "lens", colTilt: null, layLen: null, camLen: null, foldOn: false, foldAng: 90, foldPos: 0.5, foldLabel: "", filtShow: false, preFoldOn: false, preFoldAng: 90, preFoldPos: 0.33, gFlip: false, annot: true, view: "spectral", spPts: 3, spPos: 0.5,
       W: 100, Fc: 1.6, fcam: null, gType: "trans", G: 1200, m: 1, lamB1: 5000, lamC: 5500, psi: 35, tAlpha: null, gA: 25, gGlass: "N-BK7", gKind: "ruled", gTilt: 0, pA: 60, pN: 1, pPrisms: null, Nx: 4096, Ny: 2048, pix: 15,
       filt: null, fgroups: null, telF: null, fibAp: null },
  e: { slitW: 0.5, traceW: null, nObj: 1, col: "lens", cam: "lens", dpass: false, view: "spectral", colTilt: null, layLen: null, camLen: null, foldOn: false, foldAng: 90, foldPos: 0.5, foldLabel: "", filtShow: false, preFoldOn: false, preFoldAng: 90, preFoldPos: 0.33, gFlip: false, annot: true,
       W: 150, Fc: 3.0, fcam: null, eG: 31.6, eDelta: 63.435, gamma: 1, theta: 0, eTilt: 0, xd: "grating", xG: 300, xPsi: 10, xGrA: null, lay3d: "single", wpT: null,
        xPre: null, xDbl: null, xDraw: null, wp3: false, fold3d: "", xdLabel: "", note3d: "", note2d: "", camEq: "", xdEq: "", feedLabel: "", dichLabel: "", dichBefore: 0, dichTilt: 15,   // the 3D view's prism passes and labels (presets)
       xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, xGrism: null, lamC: 5500, Nx: 4096, Ny: 4096, pix: 15, filt: null, fgroups: null, telF: null, fibAp: null },
};
const clone = o => JSON.parse(JSON.stringify(o));
let S = clone(DEF);
// the 3D view's rotation, world -> view (rows: screen right, screen up, toward the viewer); a turntable pose
// (az about the slit axis, then el) only sets the snaps, the mouse turns it freely
const rotAzEl = (az, el) => { const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el); return [[ca, sa, 0], [-se * sa, se * ca, ce], [ce * sa, -ce * ca, se]]; };
const R3 = { m: rotAzEl(-0.6, 0.5), az: -0.6, el: 0.5 };
// orbit controls (as in CAD viewers and three.js's OrbitControls): spin about the slit axis without limit, tilt from
// straight over to straight under, no roll; a release keeps turning and slows to a stop
const setOrbit = (az, el) => { R3.az = az; R3.el = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, el)); R3.m = rotAzEl(R3.az, R3.el); };
let orbitVel = null, orbitRAF = 0, drawRAF = 0;
function stopCoast() { orbitVel = null; cancelAnimationFrame(orbitRAF); turning3 = false; }
const drawSoon = () => { if (!drawRAF) drawRAF = requestAnimationFrame(() => { drawRAF = 0; if (cur) drawLayout(cur, curP); }); };
if (window.ANIM) window.ANIM.onRays(() => schedule());              // the drawn rays shown or hidden (anim.js)
let turning3 = false;                               // while the 3D view is being turned, the scale holds
let c3mode = "lam";                                // 3D rays colored by wavelength or by slit position
const M = () => (S.mode === "grating" ? S.g : S.e);

// presets: defined in presets.js (window.IX_PRESETS, sources in data/ and the README); each sets the full state
const PRESETS = window.IX_PRESETS || [];
let presetId = "custom";
// the instrument: "spec" (spectrograph, this file) or "img" (imager, imgapp.js)
let inst = "spec", IMG = null, TEL = null, INT = null, ARMS = null;
// the All-arms view: the instrument shown and the arm the controls edit (kept while the edits make the state custom)
let armsInst = null, armsActive = null, armsEdits = {};
const armsOn = () => !!(S.arms && armsInst && ARMS && ARMS.group(armsInst) && inst === "spec");

const DETS = [
  { name: "2k × 4k, 15 µm", Nx: 4096, Ny: 2048, pix: 15 },
  { name: "4k × 4k, 15 µm", Nx: 4096, Ny: 4096, pix: 15 },
  { name: "6k × 6k, 15 µm", Nx: 6144, Ny: 6144, pix: 15 },
  { name: "9k × 9k, 10 µm", Nx: 9216, Ny: 9216, pix: 10 },
  { name: "10k × 10k, 9 µm", Nx: 10240, Ny: 10240, pix: 9 },
  { name: "2k × 2k, 18 µm (infrared)", Nx: 2048, Ny: 2048, pix: 18 },
  { name: "4k × 4k, 10 µm (infrared)", Nx: 4096, Ny: 4096, pix: 10 },
];

// ------------------------------------------------------------------ formatting
const sig = (v, n = 3) => {
  if (!isFinite(v)) return "–";
  if (v === 0) return "0";
  const d = Math.max(0, n - 1 - Math.floor(Math.log10(Math.abs(v))));
  return v.toFixed(Math.min(d, 6));
};
const grp = v => (Math.abs(v) >= 10000 ? Math.round(v).toLocaleString("en-US") : String(Math.round(v)));
const fmtR = v => (v >= 1000 ? grp(Number(sig(v, 3))) : sig(v, 3));
const fA = l => grp(l * 1e4);                                 // um -> integer A
const fAd = (l, n = 1) => (l * 1e4).toFixed(n);
const pct = v => (v * 100).toFixed(v < 0.1 ? 1 : 0) + "%";
const deg = r => (r / IX.DEG).toFixed(1) + "°";
const mm = v => (v >= 1000 ? sig(v / 1000, 3) + " m" : sig(v, 3) + " mm");

// ------------------------------------------------------------------ controls
// [id, key, scope ('s' shared, 'm' this mode), log10 slider?, integer?, formatter]
const SL = [
  ["sD", "D", "s", true, false, v => sig(v, 3) + " m"],
  ["sF", "F", "s", true, false, v => "f/" + sig(v, 3)],
  ["sSW", "slitW", "m", true, false, v => sig(v, 3) + "″"],
  ["sNO", "nObj", "m", true, true, v => String(v)],
  ["sW", "W", "m", true, false, v => sig(v, 3) + " mm"],
  ["sFc", "Fc", "m", true, false, v => "f/" + v.toFixed(2)],
  ["sPsi", "psi", "m", false, false, v => v.toFixed(1) + "°"],
  ["sTA", "tAlpha", "m", false, false, v => v.toFixed(1) + "°"],
  ["sGA", "gA", "m", false, false, v => v.toFixed(1) + "°"],
  ["sPA", "pA", "m", false, false, v => v.toFixed(1) + "°"],
  ["sCT", "colTilt", "m", false, false, v => v.toFixed(1) + "°"],
  ["sLL", "layLen", "m", true, false, v => sig(v, 3) + " mm"],
  ["sCL", "camLen", "m", true, false, v => sig(v, 3) + " mm"],
  ["sFA", "foldAng", "m", false, false, v => v.toFixed(0) + "°"],
  ["sFP", "foldPos", "m", false, false, v => v.toFixed(2)],
  ["sGam", "gamma", "m", false, false, v => (Math.abs(v * 10 - Math.round(v * 10)) > 1e-6 ? v.toFixed(2) : v.toFixed(1)) + "°"],
  ["sG", "G", "m", true, false, v => grooves(v)],
  ["sM", "m", "m", false, true, v => String(v)],
  ["sLB", "lamB1", "m", true, false, v => (v >= 30000 ? sig(v / 1e4, 3) + " µm" : grp(v) + " Å") + ", 1st order"],
  ["sEG", "eG", "m", true, false, v => grooves(v)],
  ["sED", "eDelta", "m", false, false, v => "R" + Math.tan(v * IX.DEG).toFixed(2) + " · " + v.toFixed(1) + "°"],
  ["sXG", "xG", "m", true, false, v => grooves(v)],
  ["sXA", "xA", "m", false, false, v => v.toFixed(1) + "°"],
  ["sLC", "lamC", "m", true, false, v => grp(v) + " Å"],
  ["sNx", "Nx", "m", true, true, v => grp(v)],
  ["sNy", "Ny", "m", true, true, v => grp(v)],
  ["sPix", "pix", "m", false, false, v => sig(v, 3) + " µm"],
];
const obj = scope => (scope === "s" ? S : M());
// layout options that change only the drawing (they keep a preset's name)
const DRAWING_KEYS = new Set(["layLen", "camLen", "foldLabel", "filtShow", "xDraw", "note2d", "camEq", "xdEq", "feedLabel", "dichLabel", "dichBefore", "dichTilt", "preFoldOn", "preFoldAng", "preFoldPos", "foldOn", "foldAng", "foldPos", "colTilt", "gFlip", "annot", "view", "spPts", "spPos", "cam", "dpass", "lay3d", "wpT", "xPre", "xDbl", "wp3", "fold3d", "xdLabel", "note3d"]);

function markCustom() {
  presetId = "custom";
  showPreset(armsOn() ? armsActive : "custom");                  // (the All-arms view keeps its instrument's menus)
}
for (const [id, key, scope, lg, intg] of SL) {
  $(id).addEventListener("input", () => {
    let v = Number($(id).value);
    if (lg) v = Math.pow(10, v);
    if (intg) v = Math.max(1, Math.round(v));
    obj(scope)[key] = v;
    if (id === "sFc") M().fcam = null;
    if (id === "sSW") M().traceW = null;
    if (id === "sXA") { S.e.xPrisms = null; S.e.xGrism = null; }
    if (id === "sPA") S.g.pPrisms = null;
    if (id === "sNx" || id === "sNy" || id === "sPix") { $("detSel").value = "custom"; zoom.reset(); }
    if (!DRAWING_KEYS.has(key)) markCustom();
    schedule();
  });
}
function bindSeg(pairs, get, set, drawingOnly = false) {
  for (const [id, val] of pairs) $(id).addEventListener("click", () => { set(val); if (!drawingOnly) markCustom(); schedule(); });
  return () => { for (const [id, val] of pairs) $(id).setAttribute("aria-pressed", String(get() === val)); };
}
// Choosing a grism: set its apex so that the undeviated wavelength is lc (ruled: sin A = m G lc / (n - 1); VPH:
// m G lc = 2 n sin(A - asin(sin A / n)), solved by bisection), with a coarser ruling if no apex up to 60 deg can do it.
// The grating's own groove density comes back when the grism is switched off.
let preGrismG = null;
function aimGrism(lc) {
  const n = IX.nGlass(S.g.gGlass || "N-BK7", lc), m = S.g.m;
  if (!(n > 1)) return;
  const need = G => m * G / 1000 * lc;
  const reach = A => (S.g.gKind === "vph" ? 2 * n * Math.sin(A - Math.asin(Math.sin(A) / n)) : (n - 1) * Math.sin(A) / Math.cos(0));
  const maxA = 60 * IX.DEG;
  if (need(S.g.G) > reach(maxA)) S.g.G = 300;
  if (need(S.g.G) > reach(maxA)) return;
  let a = 0, b = maxA;
  for (let k = 0; k < 60; k++) { const c = 0.5 * (a + b); if (reach(c) < need(S.g.G)) a = c; else b = c; }
  S.g.gA = 0.5 * (a + b) / IX.DEG;
}
const segs = [
  bindSeg([["mGrat", "grating"], ["mEch", "echelle"]], () => S.mode, v => { S.mode = v; zoom.reset(); lview.fit = true; stopCoast(); }),
  bindSeg([["gRefl", "refl"], ["gTr", "trans"], ["gGm", "grism"], ["gPr", "prism"]], () => S.g.gType, v => {
    if (v === "grism" && S.g.gType !== "grism") { preGrismG = S.g.G; aimGrism(S.g.lamC / 1e4); }
    else if (v !== "grism" && S.g.gType === "grism" && preGrismG !== null) { S.g.G = preGrismG; preGrismG = null; }
    S.g.gType = v;
  }),
  bindSeg([["gkR", "ruled"], ["gkV", "vph"]], () => (S.g.gKind === "vph" ? "vph" : "ruled"), v => {
    const l0 = cur && cur.grism ? cur.grism.lam0 : S.g.lamC / 1e4;
    S.g.gKind = v; aimGrism(l0);                      // keep the undeviated wavelength where it was
  }),
  bindSeg([["cLens", "lens"], ["cMirror", "mirror"]], () => M().col, v => { M().col = v; }),
  bindSeg([["kLens", "lens"], ["kMirror", "mirror"]], () => (M().cam === "mirror" ? "mirror" : "lens"), v => { M().cam = v; }, true),
  bindSeg([["foOff", false], ["foOn", true]], () => !!M().foldOn, v => { M().foldOn = v; }, true),
  bindSeg([["gfOff", false], ["gfOn", true]], () => !!M().gFlip, v => { M().gFlip = v; }, true),
  bindSeg([["anOn", true], ["anOff", false]], () => M().annot !== false, v => { M().annot = v; }, true),
  bindSeg([["vSpec", "spectral"], ["vSpat", "spatial"], ["v3d", "3d"]], () => M().view || "spectral", v => { M().view = v; lview.fit = true; stopCoast(); }, true),
  bindSeg([["sp3", 3], ["sp1", 1]], () => (S.g.spPts === 1 ? 1 : 3), v => { S.g.spPts = v; }, true),
  bindSeg([["xGr", "grating"], ["xVp", "vph"], ["xPr", "prism"], ["xGm", "grism"]], () => S.e.xd, v => { S.e.xd = v; }),
  bindSeg([["p1", 1], ["p2", 2]], () => (S.e.xPrisms ? 0 : S.e.xPasses), v => { S.e.xPasses = v; S.e.xPrisms = null; S.e.xGrism = null; }),
  bindSeg([["pn1", 1], ["pn2", 2], ["pn3", 3]], () => (S.g.pPrisms ? 0 : S.g.pN), v => { S.g.pN = v; S.g.pPrisms = null; }),
];
// glass list
const gsel = $("xGlass");
for (const k of Object.keys(IX.GLASS)) {
  if (k.startsWith("__")) continue;
  const o = document.createElement("option"); o.value = k; o.textContent = IX.GLASS[k].label || k; gsel.appendChild(o);
}
gsel.addEventListener("change", () => { S.e.xGlass = gsel.value; S.e.xPrisms = null; S.e.xGrism = null; markCustom(); schedule(); });
// the grism's glass (grating mode)
const ggsel = $("gGlass");
for (const k of Object.keys(IX.GLASS)) {
  if (k.startsWith("__")) continue;
  const o = document.createElement("option"); o.value = k; o.textContent = IX.GLASS[k].label || k; ggsel.appendChild(o);
}
ggsel.addEventListener("change", () => { S.g.gGlass = ggsel.value; S.g.pPrisms = null; markCustom(); schedule(); });
// detector formats
const dsel = $("detSel");
DETS.forEach((d, i) => { const o = document.createElement("option"); o.value = String(i); o.textContent = d.name; dsel.appendChild(o); });
{ const o = document.createElement("option"); o.value = "custom"; o.textContent = "Custom format"; dsel.appendChild(o); }
dsel.addEventListener("change", () => {
  const d = DETS[Number(dsel.value)];
  if (d) { Object.assign(M(), { Nx: d.Nx, Ny: d.Ny, pix: d.pix }); zoom.reset(); markCustom(); schedule(); }
});
// presets
const psel = $("preset");
// grouped by telescope, largest aperture first; inside a group the telescope prefix is dropped
let menuFor = null;
function buildPresetMenu() {
  if (menuFor === inst) return;
  menuFor = inst;
  psel.innerHTML = "";
  { const o = document.createElement("option"); o.value = "custom"; o.textContent = "Custom"; psel.appendChild(o); }
  const groups = [];
  for (const p of (inst === "img" ? IMG.PRESETS : inst === "tel" ? TEL.PRESETS : inst === "int" ? INT.PRESETS : PRESETS)) {
    const t = p.tel || "Other";
    let gr = groups.find(x => x.t === t);
    if (!gr) { gr = { t, D: p.state.D, ps: [] }; groups.push(gr); }
    gr.ps.push(p);
  }
  groups.sort((x, y) => y.D - x.D || x.t.localeCompare(y.t));
  // a group of one (each telescope in the Telescopes mode, each array in the Interferometer mode) is one line, under its own name
  instOpts = {};
  for (const gr of groups) {
    if (gr.ps.length === 1 && (inst === "tel" || inst === "int")) { const o = document.createElement("option"); o.value = gr.ps[0].id; o.textContent = gr.ps[0].name; psel.appendChild(o); continue; }
    const og = document.createElement("optgroup"); og.label = gr.t;
    for (const p of gr.ps) {
      if (p.inst && instOpts[instKey(p)]) continue;              // the instrument already has its line
      const o = document.createElement("option"); o.value = p.id; o.textContent = p.inst || p.name.replace(/^[^/]*\/\s*/, "");
      if (p.inst) { instOpts[instKey(p)] = o; o.dataset.first = p.id; }
      og.appendChild(o);
    }
    psel.appendChild(og);
  }
}
// An instrument with several settings (arms, channels, gratings, bands, cameras) is one line in the Preset menu, and the
// Setting menu beside it picks the setting. The instrument's line carries the selected setting's preset id as its value,
// so the Preset menu's value is always the preset's id.
const ssel = $("setting");
let instOpts = {};                                               // instrument -> its line in the Preset menu
const instKey = p => (p.tel || "") + "|" + p.inst;
const presetList = () => (inst === "img" ? IMG.PRESETS : inst === "tel" ? TEL.PRESETS : inst === "int" ? INT.PRESETS : PRESETS);
function showPreset(id) {
  const L = presetList(), p = id === "custom" ? null : L.find(q => q.id === id);
  const sibs = p && p.inst ? L.filter(q => q.inst && instKey(q) === instKey(p)) : [];
  if (p && p.inst && instOpts[instKey(p)]) instOpts[instKey(p)].value = id;
  psel.value = p ? id : "custom";
  $("settingLab").hidden = sibs.length < 2;
  if (sibs.length < 2) return;
  if (ssel.dataset.inst !== instKey(p)) {
    ssel.innerHTML = "";
    for (const q of sibs) { const o = document.createElement("option"); o.value = q.id; o.textContent = q.setting || q.name; ssel.appendChild(o); }
    // (a multi-arm instrument with its dichroics in arms.js: every arm at once)
    if (inst === "spec" && ARMS && ARMS.group(p.inst)) { const o = document.createElement("option"); o.value = "__arms"; o.textContent = "All arms"; ssel.appendChild(o); }
    ssel.dataset.inst = instKey(p);
  }
  ssel.value = inst === "spec" && S.arms && ARMS && ARMS.group(p.inst) ? "__arms" : id;
}
ssel.addEventListener("change", () => {
  if (ssel.value === "__arms") {
    // every arm at once: the arm shown now stays the one the controls edit
    const id = presetId !== "custom" ? presetId : armsActive;
    const q = PRESETS.find(x => x.id === id);
    if (q && ARMS && ARMS.group(q.inst)) { S.arms = true; armsInst = q.inst; armsActive = q.id; armsEdits = {}; lview.fit = true; schedule(); }
    return;
  }
  showPreset(ssel.value); psel.dispatchEvent(new Event("change"));
});
psel.addEventListener("change", ev => {
  if (window.ANIM) window.ANIM.reset();                          // a new telescope or instrument: the pulses off
  // an instrument picked in the Preset menu starts at its first setting (a change from the Setting menu keeps its choice)
  const o = psel.selectedOptions[0];
  if (ev.isTrusted && o && o.dataset.first) o.value = o.dataset.first;
  if (inst === "img") { const q = IMG.PRESETS.find(x => x.id === psel.value); if (q) IMG.applyPreset(q); else { IMG.custom(); scheduleHash(); } return; }
  if (inst === "tel") { const q = TEL.PRESETS.find(x => x.id === psel.value); if (q) TEL.applyPreset(q); return; }
  if (inst === "int") { const q = INT.PRESETS.find(x => x.id === psel.value); if (q) INT.applyPreset(q); return; }
  const p = PRESETS.find(q => q.id === psel.value);
  if (!p) { presetId = "custom"; scheduleHash(); return; }
  applyPreset(p);
});
function applyPreset(p) {
  const st = clone(DEF);
  for (const k of Object.keys(p.state)) {
    if (k === "g" || k === "e") Object.assign(st[k], p.state[k]);
    else st[k] = p.state[k];
  }
  st.g.view = S.g.view; st.e.view = S.e.view;     // the view (Spectral, Spatial, 3D) is the reader's, not the preset's
  S = st; presetId = p.id; armsInst = null; armsActive = null; armsEdits = {}; showPreset(p.id); zoom.reset(); lview.fit = true; schedule();
}
$("reset").addEventListener("click", () => {
  if (inst === "img") { IMG.reset(); return; }
  if (inst === "tel") { TEL.reset(); return; }
  if (inst === "int") { INT.reset(); return; }
  S = clone(DEF); presetId = "custom"; armsInst = null; armsActive = null; armsEdits = {}; showPreset("custom"); zoom.reset(); lview.fit = true; lview.mode = "auto";
  stopCoast(); setOrbit(-0.6, 0.5); c3mode = "lam"; sync3(); schedule();
});

function syncControls() {
  for (const [id, key, scope, lg, , fmt] of SL) {
    const o = obj(scope), v = o[key];
    if (v === undefined || v === null) continue;
    const el = $(id), sv = lg ? Math.log10(v) : v;
    if (sv < +el.min) el.min = String(sv);
    if (sv > +el.max) el.max = String(sv);
    if (document.activeElement !== el) el.value = String(sv);
    $("v" + id.slice(1)).textContent = fmt(v);
  }
  segs.forEach(f => f());
  const b = document.body;
  b.className = [
    S.mode === "grating" ? "m-grat" : "m-ech",
    S.g.gType === "trans" ? "g-tr" : S.g.gType === "grism" ? "g-gr" : S.g.gType === "prism" ? "g-pr" : "g-refl",
    "c-" + M().col,
    M().foldOn ? "fold-on" : "fold-off",
    S.mode === "grating" && S.g.view === "spatial" ? "v-spatial" : (S.mode === "grating" ? S.g.view === "3d" : S.e.view === "3d") ? "v-3d" : "v-spectral",
    S.mode === "echelle" && S.e.dpass ? "dp" : "",
    lvExpanded ? "lv-expanded" : "",                           // kept across re-renders (the class list is rebuilt)
    armsOn() ? "arms" : "",                                      // the All-arms view (arms.js)
    "x-" + S.e.xd,
    "inst-" + inst,
    ...(IMG ? IMG.bodyClasses() : []),
    ...(TEL && TEL.bodyClasses ? TEL.bodyClasses() : []),
  ].join(" ");
  syncInst();
  gsel.value = S.e.xPrisms && S.e.xPrisms.length ? S.e.xPrisms[0].glass : S.e.xGlass;
  if (S.e.xPrisms && S.e.xPrisms.length) { $("vXA").textContent = "train"; $("vXA").title = "The preset's prism train (listed below); moving the slider replaces it with one prism."; } else $("vXA").title = "";
  ggsel.value = S.g.gType === "prism" && S.g.pPrisms && S.g.pPrisms.length ? S.g.pPrisms[0].glass : S.g.gGlass || "N-BK7";
  if (S.g.pPrisms && S.g.pPrisms.length) { $("vPA").textContent = "train"; $("vPA").title = "The preset's prism train (in the Disperser readout); moving the slider replaces it with identical prisms."; } else $("vPA").title = "";
  const m = M(), di = DETS.findIndex(d => d.Nx === m.Nx && d.Ny === m.Ny && d.pix === m.pix);
  dsel.value = di >= 0 ? String(di) : "custom";
  buildPresetMenu();
  showPreset(inst === "img" ? IMG.presetId() : inst === "tel" ? TEL.presetId() : inst === "int" ? INT.presetId() : presetId === "custom" && armsOn() ? armsActive : presetId);
}

function params() {
  const m = M();
  const P = {
    mode: S.mode, D: S.D, F: S.F, feed: "slit", slitW: m.slitW, N: 1, slitL: 0, nObj: m.nObj, traceW: m.traceW, col: m.col, cam: m.cam, dpass: m.dpass, lay3d: m.lay3d, wpT: m.wpT, colTilt: m.colTilt, layLen: m.layLen, camLen: m.camLen, foldOn: m.foldOn, foldAng: m.foldAng, foldPos: m.foldPos, foldLabel: m.foldLabel, filtShow: m.filtShow, preFoldOn: m.preFoldOn, preFoldAng: m.preFoldAng, preFoldPos: m.preFoldPos, gFlip: m.gFlip, annot: m.annot, view: m.view, spPts: m.spPts, spPos: m.spPos, W: m.W, Fc: m.Fc, fcam: m.fcam, Nx: m.Nx, Ny: m.Ny, pix: m.pix, lamC: m.lamC, filt: m.filt, fgroups: m.fgroups,
  };
  if (S.mode === "grating") Object.assign(P, { gType: m.gType, G: m.G, m: m.m, lamB: m.lamB1 / m.m, psi: m.psi, tAlpha: m.tAlpha, gA: m.gA, gGlass: m.gGlass, gKind: m.gKind, gTilt: m.gTilt || 0, pA: m.pA, pN: m.pN, pPrisms: m.pPrisms });
  else Object.assign(P, { eG: m.eG, eDelta: m.eDelta, gamma: m.gamma, theta: m.theta, eTilt: m.eTilt, xd: m.xd, xG: m.xG, xPsi: m.xPsi, xGrA: m.xGrA,
                          xGlass: m.xGlass, xA: m.xA, xPasses: m.xPasses, xPrisms: m.xPrisms, xGrism: m.xGrism,
                          xPre: m.xPre, xDbl: m.xDbl, xDraw: m.xDraw, wp3: m.wp3, fold3d: m.fold3d, xdLabel: m.xdLabel, note3d: m.note3d, note2d: m.note2d, camEq: m.camEq, xdEq: m.xdEq, feedLabel: m.feedLabel, dichLabel: m.dichLabel, dichBefore: m.dichBefore, dichTilt: m.dichTilt });
  return P;
}

// ------------------------------------------------------------------ URL hash
const SHARED = ["mode", "D", "F", "arms"];
let hashTimer = 0, lastHash = null;
function scheduleHash() { clearTimeout(hashTimer); hashTimer = setTimeout(writeHash, 180); }
function writeHash() {
  let parts = [];
  if (inst === "img" || inst === "tel" || inst === "int") {
    parts = ["inst=" + inst, ...(inst === "img" ? IMG.hashParts() : inst === "tel" ? TEL.hashParts() : INT.hashParts())];
    lastHash = "#" + parts.join("&");
    try { history.replaceState(null, "", lastHash); } catch (e) { /* file:// */ }
    return;
  }
  const put = (k, v, d) => { if (v !== d && v !== null) parts.push(k + "=" + encodeURIComponent(typeof v === "number" ? +v.toPrecision(7) : typeof v === "object" ? JSON.stringify(v) : v)); };
  for (const k of SHARED) put(k, S[k], DEF[k]);
  for (const sc of ["g", "e"]) for (const k of Object.keys(DEF[sc])) put(sc + "." + k, S[sc][k], DEF[sc][k]);
  if (presetId !== "custom") parts.push("preset=" + presetId);
  if (armsOn() && armsActive) parts.push("arm=" + armsActive);   // the All-arms view: the arm the controls set
  lastHash = parts.length ? "#" + parts.join("&") : "";
  try { history.replaceState(null, "", parts.length ? "#" + parts.join("&") : location.pathname + location.search); } catch (e) { /* file:// */ }
}
// keys that must be positive, and the allowed values of the string-valued keys
const POSITIVE = new Set(["D", "F", "slitW", "nObj", "W", "Fc", "fcam", "G", "m", "lamB1", "lamC", "eG", "xG", "xA", "Nx", "Ny", "pix", "traceW", "layLen", "camLen", "gA", "telF", "fibAp", "xGrA", "wpT", "xPre", "pA", "pN"]);
const CHOICES = { mode: ["grating", "echelle"], gType: ["refl", "trans", "grism", "prism"], col: ["lens", "mirror"], cam: ["lens", "mirror"], view: ["spectral", "spatial", "3d"], lay3d: ["single", "pp", "4c", "wp"],
  gKind: ["ruled", "vph"], xd: ["grating", "vph", "prism", "grism"], gGlass: Object.keys(IX.GLASS), xGlass: Object.keys(IX.GLASS) };
function readHash() {
  const h = location.hash.slice(1);
  if (!h) return;
  const kv = {};
  for (const p of h.split("&")) { const [k, v] = p.split("="); if (k) kv[k] = decodeURIComponent(v || ""); }
  if (kv.inst === "img") { inst = "img"; IMG.readHash(kv); return; }
  if (kv.inst === "tel") { inst = "tel"; TEL.readHash(kv); return; }
  if (kv.inst === "int") { inst = "int"; INT.readHash(kv); return; }
  if (kv.preset) { const p = PRESETS.find(q => q.id === kv.preset); if (p) applyPreset(p); }
  // a value of the wrong kind (a typed-in link) is ignored: the key keeps its default (or the preset's value)
  const NUL = Symbol("skip");
  const conv = (k, d, v) => {
    if (typeof d === "boolean") return v === "true" ? true : v === "false" ? false : NUL;
    if (v[0] === "{" && k === "xGrism") {
      // the grism after a prism train (ELODIE): a known glass, a positive groove density, an apex between 0 and 90 deg
      try { const o = JSON.parse(v); return o && IX.GLASS[o.glass] && o.G > 0 && o.A > 0 && o.A < 90 ? o : NUL; } catch (e) { return NUL; }
    }
    if (v[0] === "[") {
      // a prism train (xPrisms; xDraw, the prisms drawn; pPrisms, a prism spectrograph's): each prism a known glass and an apex angle between 0 and 90 deg
      // an order filter's band [lo, hi] (Å); fiber groups [fibers per group, pitch, gap] (µm on the detector)
      try {
        const a = JSON.parse(v);
        if (k === "filt") return Array.isArray(a) && a.length === 2 && a.every(x => isFinite(x) && x > 0) && a[0] < a[1] ? a : NUL;
        if (k === "fgroups") return Array.isArray(a) && a.length === 3 && Number.isInteger(a[0]) && a[0] >= 1 && a.every(x => isFinite(x) && x > 0) ? a : NUL;
        return (k === "xPrisms" || k === "xDraw" || k === "pPrisms") && Array.isArray(a) && a.length && a.every(q => q && IX.GLASS[q.glass] && q.A > 0 && q.A < 90) ? a : NUL;
      } catch (e) { return NUL; }
    }
    if (typeof d === "number" || d === null) {
      if (v === "" && d === null) return null;
      const x = Number(v);
      return isFinite(x) && (!POSITIVE.has(k) || x > 0) ? x : NUL;
    }
    return !CHOICES[k] || CHOICES[k].includes(v) ? v : NUL;
  };
  const setK = (o, k, d, v) => { const x = conv(k, d, v); if (x !== NUL) o[k] = x; };
  for (const k of SHARED) if (k in kv) setK(S, k, DEF[k], kv[k]);
  for (const sc of ["g", "e"]) for (const k of Object.keys(DEF[sc])) if (sc + "." + k in kv) setK(S[sc], k, DEF[sc][k], kv[sc + "." + k]);
  // a typed-in link that asks for a grism without its apex: aim the apex at lambda_c, as the Grism button does
  // (only when the default apex passes no wavelength, so an apex chosen on the page is never moved)
  if (S.g.gType === "grism" && !("g.gA" in kv)) {
    const md = S.mode; S.mode = "grating"; const Pg = params(); S.mode = md;
    if (IX.design(Pg).bad) { preGrismG = S.g.G; aimGrism(S.g.lamC / 1e4); }
  }
  if (kv.preset) {
    // a preset whose instrument was changed afterwards is no longer the preset (drawing options do not count)
    const p = PRESETS.find(q => q.id === kv.preset);
    if (p) {
      if (!samePreset(S, p)) presetId = "custom";
    }
  }
  // the All-arms view: the arm the controls set (the other arms come back as their presets)
  if (S.arms && kv.arm) { const q = PRESETS.find(x => x.id === kv.arm); if (q && ARMS && ARMS.group(q.inst)) { armsInst = q.inst; armsActive = q.id; armsEdits = {}; showPreset(q.id); } }
}

// ------------------------------------------------------------------ canvases
// a groove density: four significant figures below 1000 /mm (110.5, 52.67), whole numbers above
const grooves = v => (v >= 1000 ? grp(Math.round(v)) : String(+v.toPrecision(4))) + " /mm";
function fitCanvas(c) {
  const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const g = c.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { g, w, h };
}
const INK = "#1a1a1a", MUTED = "#6a6560", LINE = "#ded9d0";
const FONT = 'Charter, "PT Serif", Palatino, Georgia, serif';
// the layout's colors for dispersed light: matplotlib plasma 0.04-0.80, deep indigo (short wavelengths) to
// orange-gold (long), with lightness rising monotonically so the order reads without red-green vision
const RAMP = [[38, 5, 145], [117, 1, 168], [182, 48, 139], [227, 104, 95], [252, 166, 54]];
// and for positions along the slit (Spatial view), a diverging pair through a neutral center: brick at the top of
// the slit, gray at its center, teal at the bottom (the book palette's BRICK/TEAL2, checked for red-green vision)
const FRAMP = [[166, 58, 36], [152, 96, 82], [128, 122, 116], [64, 128, 120], [0, 137, 123]];
const frampRGB = t => {
  const u = Math.min(1, Math.max(0, t)) * (FRAMP.length - 1), k = Math.min(FRAMP.length - 2, Math.floor(u)), f = u - k;
  return [0, 1, 2].map(i => FRAMP[k][i] + (FRAMP[k + 1][i] - FRAMP[k][i]) * f);
};
const rampRGB = t => {
  const u = Math.min(1, Math.max(0, t)) * (RAMP.length - 1), k = Math.min(RAMP.length - 2, Math.floor(u)), f = u - k;
  return [0, 1, 2].map(i => RAMP[k][i] + (RAMP[k + 1][i] - RAMP[k][i]) * f);
};
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

// ------------------------------------------------------------------ results strip and readouts
function rows(el, list) {
  el.innerHTML = list.filter(Boolean).map(([k, v, t, wide]) => `<div class="rd${wide ? " wide" : ""}"${t ? ` title="${t}"` : ""}><span>${k}</span><b>${v}</b></div>`).join("");
}
function renderText(Dz, P) {
  const st = $("stats");
  if (Dz.bad || !Dz.c) {
    st.innerHTML = `<div class="flags" style="margin-left:0;max-width:none"><span class="flag">${Dz.bad || "no solution"}</span></div>`;
  } else {
    const c = Dz.c, ech = P.mode === "echelle";
    const cov = Dz.range ? fA(Dz.range[0]) + "–" + fA(Dz.range[1]) + " Å" : "–";
    const spat = (P.traceW > 0 ? P.traceW : P.slitW) / c.pixScale;
    // the live strip's six figures; a muted second figure (km/s, orders) follows the first after a space
    const items = [
      ["res", "Resolution", `<span class="pre"><i>R</i> =</span><span class="rv">${fmtR(c.Reff)}</span><small>${sig(c.dlamRes, 3)} Å</small><small>${sig(c.dv, 3)} km/s</small>`, "",
        `Effective resolving power R at the central wavelength: λ over the FWHM of the line, the slit image and the grating's diffraction limit added in quadrature (the slit by itself gives ${fmtR(c.Rs)}). Then the FWHM of a resolution element, in wavelength and in velocity. ` + (c.npix >= 3 ? `A pipeline that fits a Gaussian to the line measures a width 0.84 of the slit image's, so reports R ≈ ${fmtR(c.Rfit)}; observatories quote R in either convention.` : `The line spans fewer than 3 pixels, too few for a fitted width to mean much.`)],
      ["", "λ range", cov, "", ech ? "Wavelengths reaching the detector over all orders (slit center)" + (Dz.filt ? `, within the arm's band, ${fA(Dz.filt[0])}–${fA(Dz.filt[1])} Å, set by the dichroics (orders outside the band receive no light)` : "") + "; the number of orders is in the Disperser box, and gaps raise a warning." : Dz.filt ? `Wavelengths reaching the detector (slit center), within the band of the order-isolating filter, ${fA(Dz.filt[0])}–${fA(Dz.filt[1])} Å, which also blocks the neighboring orders.` : "Wavelengths reaching the detector (slit center)."],
      ["", "Dispersion", sig(c.dlpix, 3) + " Å/px", "", "Wavelength per pixel along the dispersion at the central wavelength."],
      ["", "Spatial scale", sig(c.pixScale, 3) + "″/px", "", "Arcseconds on the sky per pixel along the slit: 206265 p W / (D f_cam); the telescope focal ratio drops out."],
      ["", "Sampling, λ × spatial", sig(c.npix, 3) + " × " + sig(spat, 3) + " px", "",
        "Spectral: pixels across one resolution element along the dispersion (the FWHM of the slit image; below 2 the spectrum is undersampled). Spatial: pixels across the FWHM of a trace along the slit, the slit (or fiber) width imaged along the slit; for a slit spectrograph the star's seeing sets the real spatial profile."],
    ];
    let html = items.map(([cls, k, v, sub, t]) => `<div class="stat ${cls}" title="${t}"><span class="k">${k}</span><span class="v">${v}${sub ? `<small>${sub}</small>` : ""}</span></div>`).join("");
    const fl = Dz.flags.map(f => `<span class="flag" title="${f.txt}">${f.txt}</span>`).join("");
    if (fl) html += `<div class="flags">${fl}</div>`;
    st.innerHTML = html;
    // warnings that do not fit beside the numbers fold into one chip, the list in its tooltip
    const fe = st.querySelector(".flags");
    if (fe && Dz.flags.length > 1 && [...fe.children].some(e => e.scrollWidth > e.clientWidth + 1)) {
      const all = Dz.flags.map(f => f.txt).join("; ");
      fe.innerHTML = `<span class="flag" title="${all}">${Dz.flags.length} warnings</span>`;
    }
  }
  // readouts
  const ftel = Dz.ftel;
  // a fiber-fed preset that gives the telescope's own focus (telF) and the fibers' apertures on the sky (fibAp): the
  // telescope as it is, and the slider's focal ratio named for what it is, the fibers' output ratio
  const mm0 = M();
  $("lsF").textContent = mm0.telF ? "Fiber output, focal ratio" : "Focal ratio";
  rows($("rTel"), mm0.telF ? [
    ["Telescope focus", "f/" + sig(mm0.telF, 3) + ", " + mm(mm0.telF * S.D * 1000), `The telescope's own focus, where the fibers' apertures sit (${sig(mm0.fibAp, 3)}″ on the sky). Each fiber delivers f/${sig(S.F, 3)} to the spectrograph, and the slider and the numbers below use that ratio, so that the core enters at its true size: core / (F × D).`],
    ["At the fiber output", mm(ftel) + ", " + sig(Dz.plate, 3) + "″/mm", "The focal length and plate scale the spectrograph sees: f/" + sig(S.F, 3) + " on the telescope's aperture."],
  ] : [
    ["Focal length", mm(ftel)],
    ["Plate scale", sig(Dz.plate, 3) + "″/mm"],
  ]);
  const ent = [["At the focus", sig(Dz.slitFocus * 1000, 3) + " µm wide", "Slit width at the telescope focus: φ F_tel D."]];
  if (Dz.objects && Dz.objects.n > 1) { const gr = Dz.objects.groups;
    ent.push(["Gap between spectra", sig(Dz.objects.gapPx, 3) + " px", gr ? `The fibers sit in ${gr.n} groups of ${gr.per} on the pseudo-slit: ${sig(gr.pitchPx, 3)} px apart within a group, ${sig(gr.gapPx, 3)} px from the last spectrum of one group to the first of the next.` : P.mode === "echelle" ? "The spectra of the objects are stacked within the smallest spacing between orders." : "The spectra of the objects spread evenly over the height of the detector."]); }
  if (Dz.objects && Dz.objects.n > 1 && Dz.c) {
    const fwPx = (P.traceW > 0 ? P.traceW : P.slitW) / Dz.c.pixScale;   // the trace width across the dispersion
    ent.push(["Gap in trace FWHM", sig(Dz.objects.gapPx / fwPx, 3), `The gap between neighboring spectra over the width of one trace across the dispersion: the slit (or the fiber's equivalent) width imaged along the slit, φ / pixel scale = ${sig(fwPx, 3)} px. For a slit the star's seeing sets the real profile; a slit matched to the seeing makes the two similar.`]);
  }
  if (Dz.c && Dz.fcam > 0) {
    const thD = Dz.c.w / Dz.fcam * IX.RAD;                      // the slit image width over the camera focal length
    ent.push(["Angle at the detector", sig(thD, 3) + "″", `The angle the slit width subtends in the beam arriving at the detector: θ′ = θ_g cos α / cos β, with θ_g = φ D / W = ${sig(Dz.thetaG * IX.RAD, 3)}″ in the beam at the grating (the optical invariant). Multiplied by the camera focal length, θ′ gives the slit image on the detector: ${sig(Dz.c.w * 1000, 3)} µm.`]);
  }
  rows($("rEnt"), ent);
  if (Dz.bad && !Dz.Wp) { rows($("rSpe"), [["Collimator", mm(Dz.fcol || 0)]]); rows($("rDis"), []); rows($("rDet"), []); return; }
  rows($("rSpe"), [
    ["Collimator", mm(Dz.fcol) + ", f/" + sig(Dz.Fcol, 3), "f_col = F_tel W / η: the collimator matches the beam the telescope (or fiber) delivers."],
    ["Camera field", "±" + (Dz.camField / IX.DEG).toFixed(1) + "°", "Half-angle from the axis to the detector corner."],
    ["Camera focal length", mm(Dz.fcam), "F_cam times the diffracted beam W' = W cos β / cos α (the anamorphic factor)."],
  ]);
  const dis = [];
  if (P.mode === "grating") {
    if (P.gType === "prism" && Dz.prism) {
      const pr = Dz.prism, tr = pr.train, lc = P.lamC / 1e4, nm = q => (IX.GLASS[q.glass] || {}).label || q.glass, fa = v => +Number(v).toFixed(2) + "°";
      const same = tr.every(q => q.glass === tr[0].glass && q.A === tr[0].A && !q.dI);
      const txt = same ? (tr.length > 1 ? tr.length + " × " : "") + fa(tr[0].A) + " " + nm(tr[0]) : tr.map(q => fa(q.A) + " " + nm(q)).join(" + ");
      dis.push(["Prisms", txt, same ? "Each prism stands at minimum deviation for the central wavelength." : "The preset's train: " + tr.map(q => fa(q.A) + " " + nm(q) + (q.dI ? ", turned " + q.dI + "° from minimum deviation" : "")).join("; ") + ". The others stand at minimum deviation for the central wavelength.", true]);
      const hh = 1e-4, n0 = IX.nGlass(tr[0].glass, lc), dn = (IX.nGlass(tr[0].glass, lc + hh) - IX.nGlass(tr[0].glass, lc - hh)) / (2 * hh);
      if (isFinite(n0) && isFinite(dn)) {
        dis.push(["Glass index at λc", n0.toFixed(4), "The refractive index of " + nm(tr[0]) + " at the central wavelength, from the manufacturer's dispersion formula."]);
        dis.push(["dn/dλ at λc", (dn < 0 ? "−" : "") + sig(Math.abs(dn), 3) + " µm⁻¹", "The slope of the glass's index. At minimum deviation each prism disperses by dθ/dλ = 2 sin(A/2) / cos i × |dn/dλ|, with sin i = n sin(A/2): glass disperses most strongly in the blue."]);
      }
      dis.push(["Camera angle", deg(pr.dev), "The deviation of the central wavelength, 2i − A for each prism: the camera's angle to the collimator axis."]);
      dis.push(["Glass base", sig(Dz.Lg, 3) + " mm", "The difference in glass path between the two edges of the beam, summed over the prisms: the base b of a prism the beam just fills, 2 W sin(A/2) / cos i at minimum deviation. With the glass's dispersion, b sets the diffraction limit R = b |dn/dλ|."]);
    } else if (P.gType === "grism") {
      const gr = Dz.grism;
      dis.push(["Undeviated λ0", grp(gr.lam0 * 1e4) + " Å", gr.vph ? "The wavelength that leaves along the collimator axis, at the detector center: m G λ0 = 2 n sin(A − t), sin t = sin A / n (the outer faces refract the beam to the Bragg angle at the VPH layer and back)." : gr.eps ? "The wavelength that leaves along the collimator axis, at the detector center: m G λ0 = n sin(A − ε′) − sin(A − ε), with the prism's entrance face tilted ε = " + deg(gr.eps) + " (sin ε′ = sin ε / n). The grism is not tilted in use, so λ0 is fixed by the grism itself." : "The wavelength that leaves along the collimator axis, at the detector center: m G λ0 = (n − 1) sin A. The grism is not tilted in use, so λ0 is fixed by the grism itself."]);
      dis.push(["Glass index n(λ0)", gr.n0.toFixed(4), gr.vph ? "Of the prisms. The beam meets the VPH layer at " + deg(gr.inner) + " inside the glass." : (gr.eps ? "Of the prism; the light leaves the ruled hypotenuse at A − ε = " + deg(gr.A - gr.eps) + " from its normal." : "Of the prism; the light leaves the ruled hypotenuse at A = " + deg(gr.A) + " from its normal.")]);
      dis.push(["Camera angle", "0° (on axis)", "A grism passes λ0 straight through: the camera sits on the collimator axis."]);
    } else if (P.gType === "trans") {
      if (Math.abs(Dz.alpha - Dz.beta) < 1e-9) dis.push(["Angles α = β", deg(Dz.alpha), "Symmetric (Littrow, or Bragg for a volume-phase grating) setting for the central wavelength."]);
      else dis.push(["Angles α, β", (Dz.alpha / IX.DEG).toFixed(1) + "°, " + (Dz.beta / IX.DEG).toFixed(1) + "°", "Angle of incidence (fixed by the preset) and of diffraction of the central wavelength."]);
      dis.push(["Camera angle", deg(Dz.psi), "Deviation α + β of the central wavelength: the camera's angle to the collimator axis."]);
    } else {
      dis.push(["Angles α, β", (Dz.alpha / IX.DEG).toFixed(1) + "°, " + (Dz.beta / IX.DEG).toFixed(1) + "°", "Angle of incidence and of diffraction of the central wavelength, from the grating normal."]);
      if (Dz.delta !== null) dis.push(["Blaze angle δ", deg(Dz.delta)]);
      // (the Blaze slider gives the Littrow value; with the camera at an angle the facets' peak moves bluer)
      if (Dz.delta !== null && Math.abs(Dz.psi || 0) > 1e-6) dis.push(["Blaze peak at this angle", (v => (v >= 3 ? sig(v, 3) + " µm" : grp(v * 1e4) + " Å"))(2 * Math.sin(Dz.delta) * Math.cos(Dz.psi / 2) / (P.G / 1000)) + ", 1st order", "The facets reflect specularly when α + β = 2δ, so with the camera at ψ from the collimator the blaze peak sits at m λ = 2 sin δ cos(ψ/2) / G. The Blaze slider gives the Littrow value, 2 sin δ / G, at ψ = 0."]);
    }
    if (P.gType !== "prism") dis.push(["Beam footprint", sig(Dz.Lg, 3) + " × " + sig(P.W, 3) + " mm", "The area the collimated beam covers on the grating: W / cos α along the dispersion (the beam stretched by the grating tilt) by W along the grooves. The footprint is the minimum ruled area the grating needs (the physical grating is larger) and sets the diffraction limit m N.", true]);
    if (Dz.c && Dz.c.eff !== null) dis.push(["Blaze efficiency at λc", pct(Dz.c.eff), "Relative to the blaze peak (scalar sinc² envelope)."]);
  } else {
    const os = Dz.orders || [];
    if (os.length) dis.push(["Orders", os[os.length - 1].m + "–" + os[0].m]);
    if (Dz.c) dis.push(["FSR", sig(P.lamC / Dz.mRef, 3) + " Å", "Free spectral range: λ / m at the central wavelength, the wavelength span of one order before the next order begins."]);
    if (isFinite(Dz.minSep)) dis.push(["Order gap", Math.round(Dz.minSep) + " px = " + sig(Dz.minSep * Dz.c.pixScale / Math.abs(Dz.c.sdir[1]), 2) + "″", "The smallest separation between adjacent orders (above 3200 Å) at the blaze: the longest slit that fits between the two orders (on the sky, along the slit; a tilted slit image spreads over more rows, which the conversion includes)."]);
    dis.push(["Beam footprint", sig(Dz.Lg, 3) + " × " + sig(P.W, 3) + " mm", "The area the collimated beam covers on the grating: W / cos α along the dispersion (the beam stretched by the grating tilt) by W along the grooves. The footprint is the minimum ruled area the grating needs (the physical grating is larger) and sets the diffraction limit m N.", true]);
    if (P.xPrisms && P.xPrisms.length) {
      // a palindromic train is one set of prisms passed twice; group repeated prisms
      let tr = P.xPrisms, dbl = false;
      const key = q => q.glass + "|" + q.A;
      if (tr.length % 2 === 0 && tr.every((q, i) => key(q) === key(tr[tr.length - 1 - i]))) { tr = tr.slice(0, tr.length / 2); dbl = true; }
      const groups = [];
      for (const q of tr) { const g = groups[groups.length - 1]; if (g && key(g.q) === key(q)) g.n++; else groups.push({ q, n: 1 }); }
      const nm = q => ((IX.GLASS[q.glass] || {}).label || q.glass).replace(/ 301| at 105 K/g, "");
      const full = groups.map(g => (g.n > 1 ? g.n + " × " : "") + g.q.A + "° " + nm(g.q)).join(" + ") + (dbl ? ", double pass" : "");
      // a long train is summarized on one line (the full list in the tooltip)
      const cnt = {}; for (const q of P.xPrisms) cnt[nm(q)] = (cnt[nm(q)] || 0) + 1;
      const shown = full.length <= 44 ? full : P.xPrisms.length + " passes: " + Object.entries(cnt).map(([g, n]) => n + " " + g).join(", ");
      dis.push(["Prisms", shown, "The cross-dispersing prisms, each at minimum deviation for the central wavelength: " + full + ".", true]);
    }
    if (Dz.xdDev && !(P.xPrisms && P.xPrisms.length)) dis.push(["Prism deviation", deg(Dz.xdDev)]);
    if (Dz.xdGrism) dis.push(["Grism after the prisms", grooves(Dz.xdGrism.G) + ", " + (+(Dz.xdGrism.A / IX.DEG).toFixed(2)) + "°", "A grism of " + ((IX.GLASS[Dz.xdGrism.glass] || {}).label || Dz.xdGrism.glass) + " behind the prisms, entered square to the beam, its first order dispersing the same way: the grism spreads the red orders, which the prism crowds, so the two together space the orders more evenly than either alone.", true]);
    if (Dz.xdApex) dis.push(["Grism apex", deg(Dz.xdApex)]);
  }
  rows($("rDis"), dis);
  rows($("rDet"), [
    ["Size", sig(Dz.Lx, 3) + " × " + sig(Dz.Ly, 3) + " mm"],
    ["Pixels", sig(P.Nx * P.Ny / 1e6, 3) + " million"],
  ]);
}

// ------------------------------------------------------------------ optical layout
let lastTauAuto = null;          // the automatic collimator tilt of the last drawing, shown on the slider
let lastD1Auto = null, lastD2Auto = null;   // the automatic collimated-beam length and camera distance, likewise
// the layout view: mm -> canvas px scale s and the canvas position (ox, oy) of the slit
const lview = { mode: "auto", s: 0, ox: 0, oy: 0, fit: true };
function drawLayout(Dz, P) {
  if (armsOn()) { schedule(); return; }                          // the All-arms view draws this panel (arms.js)
  const { g, w, h } = fitCanvas($("cvL"));
  g.clearRect(0, 0, w, h);
  if (window.ANIM) window.ANIM.set($("cvL"), []);
  const hideRays = !!(window.ANIM && !window.ANIM.rays);             // the drawn rays hidden (anim.js): pulses only
  if (Dz.bad || !Dz.c) { message(g, w, h, Dz.bad || "No light reaches the detector"); $("lSub").textContent = ""; $("lSub").hidden = true; return; }
  const ech = P.mode === "echelle", trans = P.gType === "trans" && !ech, grism = P.gType === "grism" && !ech && !!Dz.grism;
  const prism = P.gType === "prism" && !ech && !!Dz.prism;
  // a: the tilt of the surface where the collimated beam ends and the dispersed beam starts.  A ruled grism is
  // entered square to the beam, so the rays run straight to its hypotenuse, tilted the other way by the apex A;
  // a VPH grism's layer is square to the beam.
  const W = P.W, fcol = Dz.fcol, fcam = Dz.fcam, a = grism ? (Dz.grism.vph ? 0 : -(Dz.grism.A - Dz.grism.eps)) : Dz.alpha;
  const v2 = (x, y) => [x, y];
  const addv = (p, q) => [p[0] + q[0], p[1] + q[1]], sc = (p, s) => [p[0] * s, p[1] * s];
  const dt = (p, q) => p[0] * q[0] + p[1] * q[1];
  // geometry in mm: the beam runs along +x; the 3-D x axis (in the dispersion plane) maps to +y
  let d1 = 0.5 * W + 0.12 * fcol;
  const Gc = v2(fcol + d1, 0);
  const tg = v2(Math.sin(a), Math.cos(a));                       // along the grating surface
  const Fp = addv(Gc, sc(tg, W / (2 * Math.cos(a)))), Fm = addv(Gc, sc(tg, -W / (2 * Math.cos(a))));
  let ac, xd;
  // Double pass (MIKE): one lens is both collimator and camera.  The beams overlap in the echelle's dispersion plane
  // (the slit sits beside the detector, across the orders); the returning beam is drawn at the small angle dpPsi
  // that puts the detector clear of the slit, and the echelle at dpD1 from the lens.
  const dpass = ech && !!P.dpass;
  const dpD1Auto = Math.max(1.6 * W, 0.8 * fcol), dpD1 = P.layLen > 0 ? P.layLen : dpD1Auto;
  // (with an in-plane angle between the beams, M2FS's 2θ = 6.6°, the returning beam is drawn at its true angle: the
  // slit's injection optics sit beside the detector in this plane)
  const dpTrue = dpass && Math.abs(P.theta || 0) > 0;
  const dpPsi = dpass ? (dpTrue ? 2 * Math.abs(P.theta) * IX.DEG : Math.atan((0.62 * Dz.Lx + 0.05 * fcam) / (dpD1 + fcam))) : 0;
  if (dpass) {
    ac = v2(-Math.cos(dpPsi), -Math.sin(dpPsi));
    $("lSub").textContent = dpTrue ? "Double pass: one lens is both collimator and camera. The returning beam leaves 2θ = " + (2 * Math.abs(P.theta)).toFixed(1) + "° from the incoming one in this plane, drawn true, and passes beside the slit's injection optics to the detector."
      : "Double pass: one lens is both collimator and camera. The beams overlap in this plane; the returning beam is drawn " + (dpPsi / IX.DEG).toFixed(1) + "° off so that the detector clears the slit, which sits beside the detector out of the page.";
  } else if (ech) {
    const psiD = 30 * IX.DEG;                                     // schematic: the real separation is out of the plane
    ac = v2(-Math.cos(psiD), Math.sin(psiD));
    const th = Math.abs(P.theta || 0);
    // an echelle works near Littrow: drawn true, the camera arm would lie on the collimator beam
    const sep = [th > 0 ? "2θ = " + (2 * th).toFixed(1) + "° apart in the page" : "", P.gamma > 0 ? "2γ = " + (2 * P.gamma).toFixed(1) + "° apart out of the page" : ""].filter(Boolean);
    $("lSub").textContent = "Camera arm drawn at 30° for clarity: " + (sep.length ? "the beams are " + sep.join(" and ") + "." : "in Littrow the beams overlap.") + (P.note2d ? " " + P.note2d : "");
  } else {
    ac = v2(Dz.zc[2], Dz.zc[0]);
    const n = Math.hypot(ac[0], ac[1]); ac = sc(ac, 1 / n);
    $("lSub").textContent = "";
  }
  {
    let x = v2(Dz.xc[2], Dz.xc[0]);
    x = addv(x, sc(ac, -dt(x, ac)));
    const n = Math.hypot(x[0], x[1]);
    xd = n > 1e-9 ? sc(x, 1 / n) : v2(ac[1], -ac[0]);
    if (ech) { const pp = v2(ac[1], -ac[0]); xd = dt(pp, xd) >= 0 ? pp : sc(pp, -1); }
  }
  // wavelengths for the fan: the detector edges (central order in echelle mode) and lamC
  let fan;
  if (ech) {
    const o = Dz.orders.find(q => q.m === Dz.mRef) || Dz.orders[Math.floor(Dz.orders.length / 2)];
    fan = o ? [["lo", o.lo, o.m], ["c", P.lamC / 1e4, Dz.mRef], ["hi", o.hi, o.m]] : [["c", P.lamC / 1e4, Dz.mRef]];
  } else fan = [["lo", Dz.range[0], Dz.order], ["c", Dz.grism ? Dz.grism.lam0 : P.lamC / 1e4, Dz.order], ["hi", Dz.range[1], Dz.order]];
  const beams = fan.map(([k, l, m]) => {
    const p = Dz.pos(l, m);
    const X = p ? p[0] : 0, ph = Math.atan(X / fcam);
    return { k, l, X, b: addv(sc(ac, Math.cos(ph)), sc(xd, Math.sin(ph))) };
  });
  const Wp = Math.max(W, Dz.Wp);
  // A mirror camera (catadioptric with an internal focus, as in HIRES, Hectospec and Hectochelle): a weak two-lens
  // corrector where a lens camera would stand, a spherical mirror farther along the arm, and the focus back inside
  // the arriving beam, where the detector and its dewar block the middle of that beam.  Drawing only: the image
  // scale is f_cam either way.  The spacings follow the Hectospec and Hectochelle prescriptions (the mirror 3.2 and
  // 3.5 f_cam past the corrector, the focus 1.08 and 1.07 f_cam in front of the mirror, the second corrector lens
  // 0.29 and 0.26 f_cam past the first).
  const camMir = P.cam === "mirror";
  const LmC = 3.3 * fcam, fFoc = 1.08 * fcam, Rm = 2 * fFoc, dK2 = 0.27 * fcam;
  const dDet = camMir ? LmC - fFoc : fcam;                       // camera (corrector) to the detector, along the arm
  // spacing between the elements is not part of the design: choose it so the camera arm clears
  // the incoming beam (when the camera-collimator angle allows) and the camera clears the collimator
  const tf = Math.tan(Math.max(...beams.map(bm => Math.abs(Math.atan(bm.X / fcam)))));
  const sinPsi = Math.abs(ac[1]), cosPsi = -ac[0];
  let d2 = 0.6 * Wp + 0.1 * fcam + (ech ? 1.2 * Wp : 0) + (trans || grism || prism ? 0.8 * Wp + 0.1 * fcam : 0);
  if (sinPsi > 0.2 && cosPsi > 0) for (let it = 0; it < 3; it++) d2 = Math.max(d2, (0.55 * W + 0.55 * Wp + d2 * tf + 0.25 * W) / sinPsi);
  lastD2Auto = dpass ? null : d2;
  if (P.camLen > 0 && !dpass) d2 = P.camLen;                    // the Layout option: disperser to the camera (a lens camera's
                                                                 // thin lens; a mirror camera's corrector), as sourced
  if (cosPsi > 0) d1 = Math.max(d1, (d2 + (camMir ? LmC : 0)) * cosPsi + 0.25 * W + 0.06 * fcol);
  if (P.foldOn) d1 = Math.max(d1, 2.2 * W);                    // room for a fold mirror along the way
  lastD1Auto = dpass ? dpD1Auto : d1;
  if (P.layLen > 0) d1 = P.layLen;                               // the Layout option: collimated beam length
  if (dpass) { d1 = dpD1; d2 = d1 / Math.cos(dpPsi); }
  Gc[0] = fcol + d1;
  const Fp2 = addv(Gc, sc(tg, W / (2 * Math.cos(a)))), Fm2 = addv(Gc, sc(tg, -W / (2 * Math.cos(a))));
  Fp[0] = Fp2[0]; Fp[1] = Fp2[1]; Fm[0] = Fm2[0]; Fm[1] = Fm2[1];
  // A prism spectrograph: the prisms drawn in turn along the central wavelength's path, each with the beam's
  // footprint at the middle of both faces and the apex on the inner side of the bend, the first entrance face where
  // the collimated beam ends (the pupil), each later prism the smallest clear gap past the one before.  The dispersed
  // beams leave the last exit face, so Gc, Fp and Fm move there.  chain(y): where the ray at height y in the
  // collimated beam meets the faces in turn (the central wavelength's directions).  Drawing only: the spacing is schematic.
  let PR = null;
  if (prism) {
    const D2 = u => v2(u[2], u[0]);                                // tracer (x, z) -> drawing (along the beam, up)
    const dirs = Dz.prism.dirs.map(D2), nrms = Dz.prism.stages.map(st => D2(st.nrm));
    const prp = v => v2(-v[1], v[0]), un = v => sc(v, 1 / Math.hypot(v[0], v[1]));
    const meet = (p, d, q, t) => addv(p, sc(d, ((q[0] - p[0]) * t[1] - (q[1] - p[1]) * t[0]) / (d[0] * t[1] - d[1] * t[0])));
    const build = (k, E, wk) => {
      const dPrev = dirs[2 * k], dIn = dirs[2 * k + 1], dOut = dirs[2 * k + 2], n1 = nrms[2 * k], n2 = nrms[2 * k + 1];
      let tA = prp(n1);
      if (dt(tA, addv(dOut, sc(dPrev, -1))) > 0) tA = sc(tA, -1);   // along the entrance face toward the apex
      const hf = 0.6 * wk / Math.abs(dt(dPrev, n1)), Ap = addv(E, sc(tA, hf)), X = meet(E, dIn, Ap, prp(n2));
      const L = 2 * Math.max(hf, Math.hypot(X[0] - Ap[0], X[1] - Ap[1]));
      const wIn = wk * Math.abs(dt(dIn, n1)) / Math.abs(dt(dPrev, n1));
      return { tri: [Ap, addv(Ap, sc(tA, -L)), addv(Ap, sc(un(addv(X, sc(Ap, -1))), L))], E, X, t1: prp(n1), t2: prp(n2),
        wOut: wIn * Math.abs(dt(dOut, n2)) / Math.abs(dt(dIn, n2)) };
    };
    // convex polygons overlap (separating axes), with a clearance of 3% of the beam
    const overlap = (A, B) => {
      for (const Q of [A, B]) for (let i = 0; i < Q.length; i++) {
        const e = addv(Q[(i + 1) % Q.length], sc(Q[i], -1)), nn = un(v2(-e[1], e[0]));
        const pa = A.map(p => dt(p, nn)), pb = B.map(p => dt(p, nn));
        if (Math.max(...pa) + 0.03 * W < Math.min(...pb) || Math.max(...pb) + 0.03 * W < Math.min(...pa)) return false;
      }
      return true;
    };
    const parts = [];
    let wk = W;
    for (let k = 0; k < Dz.prism.train.length; k++) {
      let gap = 0.1 * W, pr = build(k, k ? addv(parts[k - 1].X, sc(dirs[2 * k], gap)) : v2(fcol + d1, 0), wk);
      while (k && parts.some(q => overlap(q.tri, pr.tri)) && gap < 30 * W) { gap *= 1.2; pr = build(k, addv(parts[k - 1].X, sc(dirs[2 * k], gap)), wk); }
      parts.push(pr); wk = pr.wOut;
    }
    const faces = parts.flatMap(q => [[q.E, q.t1], [q.X, q.t2]]);
    const chain = y => { let p = v2(fcol, y); return faces.map(([q, t], j) => (p = meet(p, dirs[j], q, t))); };
    const Sj = [0];                                                // path length along the central ray from the pupil
    for (let j = 1; j < faces.length; j++) Sj.push(Sj[j - 1] + Math.hypot(faces[j][0][0] - faces[j - 1][0][0], faces[j][0][1] - faces[j - 1][0][1]));
    const last = c => c[c.length - 1], cp = chain(W / 2), cm = chain(-W / 2), c0 = last(chain(0));
    Gc[0] = c0[0]; Gc[1] = c0[1];
    Fp[0] = last(cp)[0]; Fp[1] = last(cp)[1]; Fm[0] = last(cm)[0]; Fm[1] = last(cm)[1];
    PR = { tris: parts.map(q => q.tri), chain, last, Ep: cp[0], Em: cm[0], S: Sj };
  }
  const C = addv(Gc, sc(ac, d2));
  // (double pass: the prism just past the lens group, 0.7 of the way from the echelle: MIKE red ≈100 mm past the last
  // lens on a ≈350 mm path, Bernstein et al. 2003 Fig. 1; M2FS 122 mm on 394 mm, Mateo et al. 2012 Fig. 4)
  const XDc = ech ? addv(Gc, sc(ac, d2 * (dpass ? 0.7 : 0.5))) : null;
  // beam edges where they meet the camera plane
  const hit = (p, b) => { const t = dt(addv(C, sc(p, -1)), ac) / dt(b, ac); return addv(p, sc(b, t)); };
  for (const bm of beams) { bm.Ep = hit(Fp, bm.b); bm.Em = hit(Fm, bm.b); bm.Q = addv(addv(C, sc(ac, dDet)), sc(xd, bm.X)); }
  // the rays drawn: NR wavelengths spanning the detector (grating mode) or the central order (echelle mode)
  const NR = ech ? 5 : 7, lR0 = fan[0][1], lR1 = fan[fan.length - 1][1], mRay = fan[0][2], rays = [];
  for (let j = 0; j < NR; j++) {
    const p = Dz.pos(lR0 + (lR1 - lR0) * j / (NR - 1), mRay);
    if (!p) continue;
    const ph = Math.atan(p[0] / fcam);
    rays.push({ t: j / (NR - 1), X: p[0], b: addv(sc(ac, Math.cos(ph)), sc(xd, Math.sin(ph))), Q: addv(addv(C, sc(ac, dDet)), sc(xd, p[0])) });
  }
  const Lx = Dz.Lx, Dc = addv(C, sc(ac, dDet));
  const det0 = addv(Dc, sc(xd, -Lx / 2)), det1 = addv(Dc, sc(xd, Lx / 2));
  let lensHalf = 0;
  for (const bm of beams) for (const E of [bm.Ep, bm.Em]) lensHalf = Math.max(lensHalf, Math.abs(dt(addv(E, sc(C, -1)), xd)));
  lensHalf *= 1.06;
  // the mirror camera's parts (see camMir above): the second corrector lens, the spherical mirror (center of
  // curvature Ccc, radius Rm = 2 x the focus distance), the dewar behind the detector (toward the corrector) and the
  // field flattener in front of the detector, which is also the dewar window
  let MIR = null;
  if (camMir) {
    const Mc = addv(C, sc(ac, LmC)), Ccc = addv(Mc, sc(ac, -Rm)), uv = p => { const q = addv(p, sc(C, -1)); return [dt(q, ac), dt(q, xd)]; };
    const mhit = (p, b) => { const q = addv(p, sc(Ccc, -1)), qb = dt(q, b); return addv(p, sc(b, -qb + Math.sqrt(Math.max(0, qb * qb - dt(q, q) + Rm * Rm)))); };
    let half = 0.53 * Wp, half2 = lensHalf;
    for (const bm of beams) for (const F of [Fp, Fm]) {
      half = Math.max(half, 1.06 * Math.abs(uv(mhit(F, bm.b))[1]));
      const t = (dK2 - uv(F)[0]) / dt(bm.b, ac);
      half2 = Math.max(half2, 1.06 * Math.abs(uv(addv(F, sc(bm.b, t)))[1]));
    }
    const psM = Math.asin(Math.min(0.95, half / Rm));
    const arc = Array.from({ length: 41 }, (_, k) => { const ps = psM * (1 - 2 * k / 40); return addv(Ccc, addv(sc(ac, Rm * Math.cos(ps)), sc(xd, Rm * Math.sin(ps)))); });
    const dewL = 0.3 * fcam, dewH = 0.85 * Lx, u0 = dDet - dewL;
    const at = (u, v) => addv(addv(C, sc(ac, u)), sc(xd, v));
    const dewar = [at(u0, dewH), at(dDet, dewH), at(dDet, -dewH), at(u0, -dewH)];
    // where a ray from p along b first meets the dewar (its back face, toward the corrector, or a side), or null
    const block = (p, b) => {
      const [pu, pv] = uv(p), bu = dt(b, ac), bv = dt(b, xd);
      if (bu <= 0) return null;
      const t0 = (u0 - pu) / bu, v0 = pv + t0 * bv;
      if (t0 > 0 && Math.abs(v0) <= dewH) return addv(p, sc(b, t0));
      if (Math.abs(bv) > 1e-12) for (const sg of [1, -1]) {
        const ts = (sg * dewH - pv) / bv, us = pu + ts * bu;
        if (ts > 0 && us >= u0 && us <= dDet) return addv(p, sc(b, ts));
      }
      return null;
    };
    // the dewar's shadow in a bundle running along b: from the dewar's back corners to the mirror
    const shadow = b => { const B0 = at(u0, dewH), B1 = at(u0, -dewH); return [B0, B1, mhit(B1, b), mhit(B0, b)]; };
    MIR = { Mc, mhit, half, half2, arc, dewar, dewL, dewH, block, shadow, C2: addv(C, sc(ac, dK2)), Fl: addv(Dc, sc(ac, 0.05 * fcam)) };
  }
  const Lt = 0.28 * fcol, tHalf = Lt / (2 * P.F);
  // A mirror collimator folds the beam: everything after it is the unfolded drawing reflected
  // about the mirror, a line through (f_col, 0) tilted by tau, chosen so the returning beam clears
  // the beam coming in from the slit.  A lens leaves the drawing unfolded.
  const mirror = P.col === "mirror";
  const tauAuto = 0.5 * Math.asin(Math.min(0.9, 1.3 * W / d1));
  const tau = !mirror ? 0 : P.colTilt !== null && P.colTilt !== undefined && isFinite(P.colTilt) ? P.colTilt * IX.DEG : tauAuto;
  lastTauAuto = tauAuto;
  const Cm = v2(fcol, 0), nm = v2(-Math.cos(tau), Math.sin(tau)), tm = v2(Math.sin(tau), Math.cos(tau));
  const Mf = p => (mirror ? addv(p, sc(nm, -2 * dt(addv(p, sc(Cm, -1)), nm))) : p);
  // the mirror is drawn as a parabola bent toward the slit, sag(s) = sagM (s / halfM)^2 along its normal;
  // the beam edges meet it on that curve (a lens: the straight line through f_col)
  const halfM = 0.56 * W / Math.cos(tau), sagM = mirror ? 0.06 * halfM : 0;
  const onMirror = s => addv(addv(Cm, sc(tm, s)), sc(nm, sagM * (s / halfM) ** 2));
  const Pp = onMirror(W / (2 * Math.cos(tau))), Pm = onMirror(-W / (2 * Math.cos(tau)));
  // a flat fold mirror a fraction foldPos of the way from the collimator to the grating (Layout option): what
  // lies beyond it is reflected about its line, which turns the beam by phi; then the collimator's own fold Mf
  // applies to everything.  Mf reverses the sense of a turn, so a mirror collimator takes 360 - phi: the beam
  // turns counterclockwise on the page either way.
  const phi = (mirror ? 360 - (P.foldAng ?? 90) : (P.foldAng ?? 90)) * IX.DEG;
  const foldOn = !!P.foldOn && Math.sin(phi / 2) > 0.05;         // near 0 or 360 deg the mirror would be edge-on
  const fPos = Math.min(0.98, Math.max(0.02, P.foldPos ?? 0.5));
  const Cf = v2(fcol + fPos * d1, 0), nf = v2(Math.sin(phi / 2), -Math.cos(phi / 2)), tf2 = v2(Math.cos(phi / 2), Math.sin(phi / 2));
  const Mfold = p => (foldOn ? addv(p, sc(nf, -2 * dt(addv(p, sc(Cf, -1)), nf))) : p);
  // a flat fold between the slit and the collimator (P.preFoldOn, drawing only; APOGEE's Fold Mirror 1, which the light
  // meets on the way to the on-axis collimator and again on the way back: Wilson et al. 2019): the drawing is made
  // unfolded, then whatever lies beyond the mirror's line, on the collimator's side, is reflected in it (in the Spectral
  // view).  preFoldAng: the turn (deg, counterclockwise on the page); preFoldPos: the mirror's distance from the
  // collimator as a fraction of f_col
  const preOn = !!P.preFoldOn && P.view !== "spatial" && P.view !== "3d";
  const phi1 = (P.preFoldAng ?? 90) * IX.DEG / 2, C1 = v2(fcol * (1 - Math.min(0.95, Math.max(0.05, P.preFoldPos ?? 0.33))), 0);
  const t1 = v2(Math.cos(phi1), Math.sin(phi1)), n1 = v2(Math.sin(phi1), -Math.cos(phi1));
  const side1 = p => dt(addv(p, sc(C1, -1)), n1);
  const R1 = p => (preOn && side1(p) > 0 ? addv(p, sc(n1, -2 * side1(p))) : p);
  // Flip grating (Layout option): the grating tilted the other way, so it turns the light to the other side;
  // the grating and everything after it are reflected about the collimated beam's axis (y = 0), which the
  // beam itself is symmetric about.  A mirror image, so no number changes.
  const Mg = p => (P.gFlip ? v2(p[0], -p[1]) : p);
  const Mpost = p => Mf(Mfold(Mg(p)));
  const [Ga, Gb] = PR ? (P.gFlip ? [PR.Em, PR.Ep] : [PR.Ep, PR.Em]) : P.gFlip ? [Fm, Fp] : [Fp, Fm];   // where the beam's +W/2 and -W/2 edges meet the grating (a prism's first face)
  const Qp = addv(Cf, sc(tf2, W / (2 * Math.sin(phi / 2)))), Qm = addv(Cf, sc(tf2, -W / (2 * Math.sin(phi / 2))));
  // Spatial view (grating mode): the plane that holds the slit length, unfolded onto one axis at the central
  // wavelength.  A point h along the slit leaves the collimator as a parallel bundle at slope -h / f_col whose
  // center crosses the axis at the grating (the pupil); the camera brings it to -h f_cam / f_col on the detector.
  const spatial = P.view === "spatial" && !ech;
  let SP = null;
  if (spatial) {
    const mag = fcam / fcol, Ly = Dz.Ly, hMax = 0.5 * Ly / mag, xG = fcol + d1, xC = xG + d2, xD = xC + fcam;
    // three fixed points (the two ends of the slit and its center), or one free point at spPos (-1 bottom .. +1 top)
    const free = P.spPts === 1, u = Math.min(1, Math.max(-1, P.spPos ?? 0.5));
    const fields = (free ? [(1 - u) / 2] : [0, 0.5, 1]).map(t => { const hh = hMax * (1 - 2 * t); return { t, h: hh, m: -hh / fcol, yL: hh * d1 / fcol }; });
    const colHalf = 1.06 * (W / 2 + hMax * d1 / fcol), camHalf = 1.06 * (W / 2 + d2 * hMax / fcol), tilt = Math.abs(hMax * d1 / fcol - hMax) / fcol;   // the slit ends set the frame, wherever the free point is
    SP = { mag, Ly, hMax, xG, xC, xD, fields, free, colHalf, camHalf,
      box: [v2(-Lt, hMax + tilt * Lt + tHalf), v2(-Lt, -hMax - tilt * Lt - tHalf), v2(fcol, colHalf), v2(fcol, -colHalf),
            v2(xC, camHalf), v2(xC, -camHalf), v2(xD + 0.04 * fcam, Ly / 2), v2(xD + 0.04 * fcam, -Ly / 2)] };
    $("lSub").textContent = (free ? "drag the point along the slit; " : "") + "along the slit, unfolded (mirrors drawn as lenses), at λc; slit image scale f_cam / f_col = " + sig(mag, 2);
  }
  // ---- 3D view (grating mode): the dispersion-plane drawing above, with the slit direction as a third axis.
  // World coordinates: x, y the drawing's (after the folds, which are reflections in the dispersion plane and
  // leave the slit direction alone), z along the slit.  A slit point at height z leaves the collimator as a
  // parallel bundle sloping by -z / f_col along the slit, centered on the grating (the pupil); after the grating
  // each ray follows the traced 3-D direction (the tracer's slit coordinate is -z) to its focus on the detector.
  // Each bundle is drawn as a solid: the surface swept by the edge of its circular pupil (a cone from the slit
  // point to the collimator, a tube through the collimated beam, a tube to the camera and a cone to the focus).
  const view3d = P.view === "3d";
  const prims3 = [], pts3 = [], labs3 = [], beams3 = [];      // (beams3: the beams again, for the light pulses)
  let proj3 = null, box3 = null;
  if (view3d) {
    const NEU3 = [104, 98, 92], GLASS3 = [150, 196, 232], STEEL_RGB = [96, 104, 114], STEEL3 = "#33373d", GE3 = "#3f6d96";
    // (a mirror's color: steel in the 2D painter, as before; its faces marked polished for the WebGL view)
    const MIRROR3 = [96, 104, 114];
    const a3 = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]], s3 = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
    const d3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2], n3 = v => s3(v, 1 / (Math.hypot(v[0], v[1], v[2]) || 1));
    const x3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
    const M3 = (fn, p) => { const q = fn([p[0], p[1]]); return [q[0], q[1], p[2]]; };
    const L3 = (fn, v) => { const q = fn([v[0], v[1]]), o = fn([0, 0]); return [q[0] - o[0], q[1] - o[1], v[2]]; };
    const W3 = v => [v[2], v[0], v[1]];                           // tracer direction -> unfolded world
    const Mp = p => M3(Mpost, p);
    const NS = 20, RING = Array.from({ length: NS }, (_, k) => [W / 2 * Math.cos(2 * Math.PI * k / NS), W / 2 * Math.sin(2 * Math.PI * k / NS)]);
    const line = (p, q, col, lw) => { prims3.push({ k: "l", p: [p, q], col, lw }); pts3.push(p, q); };
    const face = (ps, rgb, al, stroke = null, lw = 1) => { prims3.push({ k: "f", p: ps, rgb, al, stroke, lw, spec: rgb === MIRROR3 }); pts3.push(...ps); };
    // a swept surface between stations (each a ring of NS points, or one apex point); faces, silhouettes and the
    // footprint rings are made when it is drawn, since the silhouette depends on the view
    const tube = (stations, rgb, al, tel) => { prims3.push({ k: "t", st: stations, rgb, al }); beams3.push({ st: stations, rgb, tel: !!tel }); for (const s of stations) pts3.push(...s); };
    // a disc or a lens of thickness th across the axis n, as wedges (for the depth sort) and a rim
    const slab = (c, n, r, th, rgb, al, stroke, map = p => p) => {
      n = n3(n); let u = x3(n, [0, 0, 1]); if (Math.hypot(...u) < 1e-6) u = [1, 0, 0]; u = n3(u); const v = x3(n, u);
      const ring = off => Array.from({ length: 36 }, (_, k) => map(a3(a3(c, s3(n, off)), a3(s3(u, r * Math.cos(2 * Math.PI * k / 36)), s3(v, r * Math.sin(2 * Math.PI * k / 36))))));
      const f0 = ring(th / 2), f1 = ring(-th / 2), c0 = map(a3(c, s3(n, th / 2))), c1 = map(a3(c, s3(n, -th / 2)));
      for (let k = 0; k < 36; k++) {
        const k2 = (k + 1) % 36;
        face([c0, f0[k], f0[k2]], rgb, al); face([c1, f1[k], f1[k2]], rgb, al);
        face([f0[k], f0[k2], f1[k2], f1[k]], rgb, Math.min(1, al * 1.6));
      }
      prims3.push({ k: "o", p: f0, stroke, lw: 1.1 }, { k: "o", p: f1, stroke, lw: 1.1 });
    };
    // a plate: the rectangle c +- hu u +- hv v, thickness th behind it along -n
    const plate = (c, u, v, hu, hv, n, th, rgb, al, stroke) => {
      const P4 = off => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => a3(a3(c, s3(n, off)), a3(s3(u, i * hu), s3(v, j * hv))));
      const F = P4(0), B = P4(-th);
      face(F, rgb, al, stroke); face(B, rgb, al * 0.8, stroke);
      for (let k = 0; k < 4; k++) face([F[k], F[(k + 1) % 4], B[(k + 1) % 4], B[k]], rgb, Math.min(1, al * 1.4), stroke, 0.6);
    };
    // ---- 3D view of a double-pass echelle (MIKE).  World: x along the lens axis (the focal plane at x = 0, the lens
    // at x = f), y along the echelle's dispersion, z across the orders (up).  The slit (the image the injection optics
    // form in the lens's focal plane) sits sInj above the axis and the detector as far below it; the one lens collimates
    // the light from the slit and brings the light back from the echelle to its foci.  The prisms (apex edges along y)
    // bend the beam in the x-z plane on the way in and again on the way out; the echelle works in Littrow in its own
    // plane.  Where each order and wavelength lands comes from the tracer (Dz.pos), so the drawing agrees with the
    // Detector panel; each returning bundle is traced back from its focus through the drawn prisms by Snell's law
    // (the tracer itself applies both prism passes after the echelle, so the prisms are placed here, at minimum
    // deviation for the central wavelength).
    function build3dDoublePass() {
      const f = fcam, Lx = Dz.Lx, Ly = Dz.Ly, dE = d1, sInj = 0.6 * Ly + 0.025 * f;
      // where the slit and the detector sit in the lens's focal plane: across the orders (z), sInj above and below the
      // axis (MIKE: the injection optics, Bernstein et al. 2003 Sec. 2.3); or, for an echelle used off Littrow by theta,
      // in the echelle's own plane (y), f tan(theta) either side, the returning beam 2 theta from the arriving one (M2FS:
      // Mateo et al. 2012 Figs. 3-4, the fiber ends beside the CCD in the echelle's plane)
      const dpY = Math.abs(P.theta || 0) > 0, sOff = dpY ? f * Math.tan(Math.abs(P.theta) * IX.DEG) : sInj, OFF = dpY ? [0, sOff, 0] : [0, 0, sInj], mOFF = s3(OFF, -1);
      const O = [f, 0, 0], XA = [1, 0, 0], YA = [0, 1, 0], ZA = [0, 0, 1], lcE = P.lamC / 1e4;
      const refr = (u, nv, n1, n2) => { const c = d3(u, nv), r = n1 / n2, k = 1 - r * r * (1 - c * c); return k < 0 ? null : n3(a3(s3(a3(u, s3(nv, -c)), r), s3(nv, Math.sqrt(k)))); };
      const hitPl = (p, u, c, nv) => a3(p, s3(u, d3(a3(c, s3(p, -1)), nv) / d3(u, nv)));
      const ringAt = (c, a1, a2, r) => RING.map(([py, pz]) => a3(c, a3(s3(a1, py * 2 * r / W), s3(a2, pz * 2 * r / W))));
      const perpPair = u => { const a1 = n3(x3(u, ZA)), a2 = n3(x3(a1, u)); return [a1, a2]; };
      // one physical prism for each two of the tracer's passes, or the prisms the instrument has where the model uses an
      // equivalent one (P.xDraw, drawing only: MIKE blue's two 38 deg prisms for the 62 deg prism Bernstein et al. state)
      const train = Array.isArray(P.xDraw) && P.xDraw.length ? P.xDraw.flatMap(q => [q, q]) : Array.isArray(P.xPrisms) && P.xPrisms.length ? P.xPrisms : Array(Math.max(1, Math.round(P.xPasses || 1))).fill({ glass: P.xGlass, A: P.xA });
      const prisms = [];
      const lensIn = a3(O, s3(OFF, dE / f)), v0 = n3(a3(O, mOFF));
      let p = lensIn, u = v0, run = 0;
      for (let k = 0; k < Math.max(1, Math.round(train.length / 2)); k++) {
        const pr = train[k], A = pr.A * IX.DEG, nC = IX.nGlass(pr.glass, lcE), D = 2 * Math.asin(Math.min(1, nC * Math.sin(A / 2))) - A;
        const bIn = n3(a3(ZA, s3(u, -d3(ZA, u)))), uInt = n3(a3(s3(u, Math.cos(D / 2)), s3(bIn, Math.sin(D / 2))));
        const b = n3(a3(ZA, s3(uInt, -d3(ZA, uInt))));                // toward the base: the beam bends toward +z
        const ha = 1.1 * W, H = 1.9 * W;                              // room for both beams and the spread of orders; MIKE red: a 248 mm base for its 150 mm beam (the prisms are "more than 8 inches thick at the base")
        // the first prism as near the lens as it can stand (its nearest corner 0.12 W past the lens), the next one 0.15 W on
        const nearX = cc => { const T0 = a3(cc, s3(b, -ha)), r = H / Math.cos(A / 2);
          return Math.min(T0[0], T0[0] + r * (Math.cos(A / 2) * b[0] - Math.sin(A / 2) * uInt[0]), T0[0] + r * (Math.cos(A / 2) * b[0] + Math.sin(A / 2) * uInt[0])); };
        let L = 0;
        for (let it = 0; it < 4; it++) { const gap = (k ? p[0] + 0.15 * W : f + 0.12 * W) - nearX(a3(p, s3(u, L))); if (gap > 0) L += gap / Math.max(0.2, u[0]); }
        const c = a3(p, s3(u, L)), T = a3(c, s3(b, -ha));
        const n1 = n3(a3(s3(uInt, Math.cos(A / 2)), s3(b, Math.sin(A / 2)))), n2 = n3(a3(s3(uInt, Math.cos(A / 2)), s3(b, -Math.sin(A / 2))));
        const e1 = n3(a3(s3(b, Math.cos(A / 2)), s3(uInt, -Math.sin(A / 2)))), e2 = n3(a3(s3(b, Math.cos(A / 2)), s3(uInt, Math.sin(A / 2))));
        const P1 = { T, n1, n2, glass: pr.glass, A: pr.A, B1: a3(T, s3(e1, H / Math.cos(A / 2))), B2: a3(T, s3(e2, H / Math.cos(A / 2))) };
        prisms.push(P1);
        const q1 = hitPl(p, u, T, n1), u1 = refr(u, n1, 1, nC), q2 = hitPl(q1, u1, T, n2), u2 = refr(u1, n2, nC, 1);
        run += Math.hypot(...a3(q1, s3(p, -1))) + Math.hypot(...a3(q2, s3(q1, -1)));
        p = q2; u = u2;
      }
      // the echelle: its center dE (the camera's stop distance) from the lens, or farther if its near end (an echelle at
      // blaze angle delta reaches W tan(delta) / 2 toward the light) would meet the last prism
      const dl = (P.eDelta || 63) * IX.DEG, prismFar = prisms.length ? Math.max(...prisms.map(q => Math.max(d3(a3(q.T, s3(p, -1)), u), d3(a3(q.B1, s3(p, -1)), u), d3(a3(q.B2, s3(p, -1)), u)))) : 0;
      const E = a3(p, s3(u, Math.max(dE - run, prismFar + 0.5 * W * Math.tan(dl) + 0.12 * W))), vE = u;
      // traces through the prisms: toward the echelle (forward) or back toward the lens; each returns the points
      // where the ray meets the faces and its final direction (null if a ray is lost)
      const fwd = (p0, u0, lam) => {
        const pts = []; let q = p0, w = u0;
        for (const pr of prisms) {
          const n = IX.nGlass(pr.glass, lam);
          const a = hitPl(q, w, pr.T, pr.n1); w = w && refr(w, pr.n1, 1, n); if (!w) return null;
          const b = hitPl(a, w, pr.T, pr.n2); w = refr(w, pr.n2, n, 1); if (!w) return null;
          pts.push(a, b); q = b;
        }
        return { pts, u: w, end: q };
      };
      const back = (p0, u0, lam) => {
        const pts = []; let q = p0, w = u0;
        for (const pr of prisms.slice().reverse()) {
          const n = IX.nGlass(pr.glass, lam), m2 = s3(pr.n2, -1), m1 = s3(pr.n1, -1);
          const a = hitPl(q, w, pr.T, m2); w = refr(w, m2, 1, n); if (!w) return null;
          const b = hitPl(a, w, pr.T, m1); w = refr(w, m1, n, 1); if (!w) return null;
          pts.push(a, b); q = b;
        }
        return { pts, u: w, end: q };
      };
      const lensHit = (q, w) => hitPl(q, w, O, XA);
      // the echelle: in Littrow in the x-y plane; across the orders it returns the central wavelength to the
      // detector's center, so its normal bisects the arriving beam and that returning one
      const Qc = mOFF, wc = n3(a3(Qc, s3(O, -1)));
      const rc = fwd(a3(O, s3(OFF, -dE / f)), s3(wc, -1), lcE);
      const w1c = rc ? s3(rc.u, -1) : s3(vE, -1);
      const mxd = n3(a3(w1c, s3(vE, -1))), Yp = n3(a3(YA, s3(mxd, -d3(YA, mxd))));
      const nE = n3(a3(s3(mxd, Math.cos(dl)), s3(Yp, Math.sin(dl)))), tE = n3(a3(s3(Yp, Math.cos(dl)), s3(mxd, -Math.sin(dl)))), gE = n3(x3(nE, tE));
      const onE = (q, w) => hitPl(q, w, E, nE);
      // the wavelength scale for the colors: the chip's whole range
      const lr = Dz.range || [lcE * 0.9, lcE * 1.1], tOf = l => Math.min(1, Math.max(0, (l - lr[0]) / (lr[1] - lr[0])));
      // light arriving: the telescope's cone to the slit, then from the slit through the lens, the prisms and onto the echelle
      const S0 = OFF.slice();
      tube([ringAt(a3([-Lt, 0, 0], OFF), YA, ZA, tHalf), [S0]], [214, 160, 50], 0.13, true);
      let rL = 0;
      {
        const [a1, a2] = [YA, ZA], lens = ringAt(lensIn, a1, a2, W / 2), st = [[S0], lens], tr = lens.map(q => fwd(q, v0, lcE));
        if (tr.every(Boolean)) {
          for (let j = 0; j < tr[0].pts.length; j++) st.push(tr.map(t => t.pts[j]));
          st.push(tr.map(t => onE(t.end, t.u)));
          tube(st, NEU3, 0.07);
        }
        for (const q of lens) rL = Math.max(rL, Math.hypot(q[1], q[2]));
      }
      // light returning: three orders (the reddest, the middle, the bluest on the chip), three wavelengths in each
      const ords = Dz.orders || [], pick = ords.length ? [...new Set([ords[ords.length - 1], ords[Math.floor(ords.length / 2)], ords[0]])] : [];
      const foci = [];
      for (const o of pick) for (const l of [o.lo, Math.min(o.hi, Math.max(o.lo, o.lb)), o.hi]) {
        const pq = Dz.pos(l, o.m);
        if (!pq) continue;
        const Q = a3([0, pq[0], pq[1]], mOFF), w = n3(a3(Q, s3(O, -1)));
        const rv = fwd(lensIn, s3(w, -1), l);
        if (!rv) continue;
        const w1 = s3(rv.u, -1), [a1, a2] = perpPair(w1);
        const foot = ringAt(E, a1, a2, W / 2).map(q => onE(q, w1));
        const tr = foot.map(q => back(q, w1, l));
        if (!tr.every(Boolean)) continue;
        const st = [foot];
        for (let j = 0; j < tr[0].pts.length; j++) st.push(tr.map(t => t.pts[j]));
        const lens = tr.map(t => lensHit(t.end, t.u));
        for (const q of lens) rL = Math.max(rL, Math.hypot(q[1], q[2]));
        st.push(lens, [Q]);
        const rgb = rampRGB(tOf(l));
        tube(st, rgb, 0.12);
        foci.push([Q, rgb]);
      }
      // the optics: the lens (collimator and camera), the prisms, the echelle
      slab(O, XA, rL * 1.06, 0.1 * rL, GLASS3, 0.22, GE3);
      const hy = 0.62 * W + 0.3 * Lx * dE / f;
      for (const pr of prisms) {
        const at = (q, y) => [q[0], q[1] + y, q[2]];
        for (const y of [hy, -hy]) face([at(pr.T, y), at(pr.B1, y), at(pr.B2, y)], GLASS3, 0.25, GE3);
        for (const [q0, q1] of [[pr.T, pr.B1], [pr.T, pr.B2], [pr.B1, pr.B2]]) face([at(q0, hy), at(q1, hy), at(q1, -hy), at(q0, -hy)], GLASS3, 0.2, GE3);
      }
      {
        const hu = 1.04 * W / (2 * Math.cos(dl)), hv = 1.04 * W / 2;
        plate(E, tE, gE, hu, hv, nE, 0.06 * W, STEEL_RGB, 0.6, STEEL3);
        for (let k = 1; k < 14; k++) { const q = a3(E, s3(tE, hu * (2 * k / 14 - 1))); line(a3(q, s3(gE, hv)), a3(q, s3(gE, -hv)), rgba(rampRGB(k / 14), 0.85), 1); }
      }
      // the detector, with every order's trace on its face, the foci of the drawn bundles, and its two directions
      {
        const Dc = mOFF;
        plate(Dc, YA, ZA, Lx / 2, Ly / 2, XA, 0.012 * Lx + 0.5, [51, 55, 61], 0.92, STEEL3);
        for (const o of ords) {
          let prev = null;
          for (let k = 0; k <= 24; k++) {
            const l = o.lo + (o.hi - o.lo) * k / 24, pq = Dz.pos(l, o.m);
            if (!pq) { prev = null; continue; }
            const q = a3([0.4, pq[0], pq[1]], mOFF);
            if (prev) line(prev, q, rgba(rampRGB(tOf(l)), 1), 1.4);
            prev = q;
          }
        }
        for (const [q, col] of foci) prims3.push({ k: "d", p: [q], col });
        const o = a3([0, -1.12 * Lx / 2, -1.12 * Ly / 2], mOFF);
        prims3.push({ k: "a", p: [o, a3(o, s3(YA, 0.5 * Lx))], txt: "λ" }, { k: "a", p: [o, a3(o, s3(ZA, 0.5 * Ly))], txt: "orders" });
      }
      // the slit, and the order-sorting filter just past it (P.filtShow)
      prims3.push({ k: "d", p: [S0], col: [96, 90, 84] });
      if (P.filtShow && Array.isArray(P.filt)) {
        const cF = a3(S0, s3(v0, 0.06 * f)), hF = 0.06 * f / (2 * P.F) * 1.8 + 0.03 * W, [fa, fb] = perpPair(v0);
        plate(cF, fa, fb, hF, hF, v0, 2, [170, 206, 236], 0.6, "rgba(60,96,128,0.8)");
        labs3.push([a3(cF, s3(fb, 1.6 * hF)), "order filter", grp(P.filt[0]) + "–" + grp(P.filt[1]) + " Å"]);
      }
      const pTop = prisms.length ? prisms[prisms.length - 1] : null;
      labs3.push([a3([-Lt, 0, tHalf * 1.8], OFF), "telescope", "f/" + sig(P.F, 3)], [a3([0, 0, 0.09 * f], OFF), "slit", sig(P.slitW, 3) + "″"],
        [a3(O, [0, 0, -rL * 1.18]), "collimator and camera f/" + sig(Dz.Fcam, 3), "f = " + mm(f)],
        [a3([0, 0, -0.75 * Ly - 0.05 * f], mOFF), "detector", mm(Lx)],
        [a3(E, s3(gE, 0.75 * W)), "echelle", sig(P.eG, 3) + " /mm"]);
      if (pTop) labs3.push([a3(pTop.B2, [0, 0, 0.12 * W]), prisms.length > 1 ? prisms.length + " prisms" : "prism", prisms.map(q => q.A + "°").join(" + ")]);
      $("lSub").textContent = "drag to orbit, right- or shift-drag to pan, scroll to zoom, double-click to reset; the slit (the image the injection optics place in the lens's focal plane) and the detector sit " + sig(sOff, 2) + (dpY ? " mm either side of the lens axis in the echelle's plane, so the returning beam leaves 2θ = " + sig(2 * Math.abs(P.theta), 2) + "° from the arriving one" : " mm above and below the lens axis");
    }
    // ---- 3D view of a single-pass echelle (HIRES, X-Shooter, HARPS, UVES ...).  World: the drawing's unfolded frame
    // (the slit at the origin, the collimated beam along +x, x-y the echelle's dispersion plane, z up), mapped through
    // the folds as in grating mode.  Every direction after the collimator comes from the tracer, turned by -gamma about
    // its x axis so the collimated beam runs along +x: the echelle's normal and grooves, each order's direction after
    // the echelle, each surface of the cross-disperser, the camera's axis and the detector's.  Where each order and
    // wavelength lands is the tracer's (Dz.pos), so the drawing agrees with the Detector panel.  The distances between
    // the echelle, the cross-disperser and the camera are schematic (the tracer works with directions only): the
    // cross-disperser stands where the returning beam has drawn clear of the arriving one, as far as practical, and
    // the tracer's cross-disperser passes are drawn one after another there, after the echelle, where the tracer
    // applies them.
    function build3dEchelle() {
      const gm = Dz.gamma || 0, cgm = Math.cos(gm), sgm = Math.sin(gm);
      const T = v => [-v[1] * sgm + v[2] * cgm, v[0], v[1] * cgm + v[2] * sgm];   // tracer -> unfolded world
      const dirW = u => (u ? n3(T(u)) : null);
      const f = fcam, LxD = Dz.Lx, LyD = Dz.Ly, lcE = P.lamC / 1e4, ZA = [0, 0, 1];
      const Mp3 = p => M3(Mpost, p), Lv = v => n3(L3(Mpost, v));
      const hitPl = (p, u, c, nv) => a3(p, s3(u, d3(a3(c, s3(p, -1)), nv) / d3(u, nv)));
      const ringAt = (c, a1, a2, r) => RING.map(([py, pz]) => a3(c, a3(s3(a1, py * 2 * r / W), s3(a2, pz * 2 * r / W))));
      const perpPair = u => { let a1 = x3(u, ZA); if (Math.hypot(...a1) < 1e-6) a1 = [0, 1, 0]; a1 = n3(a1); return [a1, n3(x3(a1, u))]; };
      const perpTo = (v, e) => n3(a3(v, s3(e, -d3(v, e))));
      // the echelle: its center at the end of the collimated beam, its normal and grooves from the tracer
      // (placed first about the origin, then moved out along the collimated beam: far enough that the cross-disperser
      // and the camera stand in front of the collimator, never behind it)
      let Ec = [0, 0, 0];
      const nE = dirW(Dz.nhat), gE = dirW([0, 1, 0]), tE = n3(x3(gE, nE));
      const mR = Dz.mRef, uBt = Dz.mainOut(Dz.mlamRef / mR, mR), uB = dirW(uBt);
      // the cross-disperser's surfaces, traced as the tracer traces them (physics.js traceXd), each direction mapped
      const stg = Dz.xdStages || [];
      const xdDirs = (u, lam) => {
        const out = []; let w = u;
        for (const s of stg) {
          if (!w) return null;
          if (s.kind === "grating") w = IX.surface(w, s.nrm, s.g, lam, 1, 1, true);
          else if (s.kind === "tgrating") w = IX.surface(w, s.nrm, s.g, lam, 1, 1, false);
          else { const n1 = s.from === 1 ? 1 : IX.nGlass(s.from, lam), n2 = s.to === 1 ? 1 : IX.nGlass(s.to, lam); w = IX.surface(w, s.nrm, s.g || null, s.g ? lam : 0, n1, n2, false); }
          out.push(w ? dirW(w) : null);
        }
        return out.every(Boolean) ? out : null;
      };
      // the elements: a wedge (a prism, or a grism's glass with its ruled face) for two faces in turn, else one surface
      const els = [];
      for (let i = 0; i < stg.length; i++) {
        if (stg[i].kind === "face" && i + 1 < stg.length && (stg[i + 1].kind === "face" || stg[i + 1].kind === "gface")) { els.push({ k: "w", i0: i, i1: i + 1, glass: stg[i].to, ruled: stg[i + 1].kind === "gface" }); i++; }
        else els.push({ k: "s", i0: stg[i].kind === "face" ? i : i, i1: i, refl: stg[i].kind === "grating", s: stg[i] });
      }
      const WpD = Math.max(W, Dz.Wp || W), spread = LxD / f;      // the beam across, and an order's angular spread
      const offAx = q => Math.hypot(q[1], q[2]);                  // from the arriving collimated beam's axis
      // the central path: lamC on the reference order's blaze direction (the camera axis, as in the tracer)
      const dC = xdDirs(uBt, lcE) || [];
      let dX = 0.9 * WpD + 0.3 * W;
      // (out to 90% of the echelle's distance from the collimator: HIRES's beams, 10° apart in the echelle's plane, clear
      // each other only near the collimator)
      for (let k = 0; k < 40 && offAx(a3(Ec, s3(uB, dX))) < 0.5 * W + 0.6 * WpD && dX < Math.max(2.5 * WpD + 0.5 * f, 0.9 * d1); k++) dX *= 1.1;
      let p = a3(Ec, s3(uB, dX - 0.3 * WpD)), win = uB;
      const ha = 0.62 * WpD + 0.25 * spread * dX, hy0 = 0.62 * WpD;
      for (const el of els) {
        if (el.k === "s") {
          el.c = p; el.n = n3(T(stg[el.i0].nrm));
          const gx = stg[el.i0].g ? perpTo(n3(T(stg[el.i0].g)), el.n) : perpPair(el.n)[0];
          el.ux = gx; el.uy = n3(x3(el.n, gx));
          el.hx = 0.62 * WpD / Math.max(0.2, Math.abs(d3(win, el.n))); el.hy = hy0 + 0.6 * spread * dX;
          win = dC[el.i1] || win; p = a3(p, s3(win, 0.95 * WpD));
        } else {
          const n1 = n3(T(stg[el.i0].nrm)), n2 = n3(T(stg[el.i1].nrm)), e = n3(x3(n1, n2)), base = perpTo(a3(n1, s3(n2, -1)), e);
          let w = n3(x3(n1, e)); if (d3(w, base) > 0) w = s3(w, -1);             // within the entrance face, away from the base
          const q1 = p, T0 = a3(q1, s3(w, ha)), uIn = dC[el.i0] || win, q2 = hitPl(q1, uIn, T0, n2);
          let w2 = n3(x3(n2, e)); if (d3(w2, base) < 0) w2 = s3(w2, -1);          // within the exit face, toward the base
          const H = ha + 0.8 * WpD;
          Object.assign(el, { n1, n2, e, T0, B1: a3(T0, s3(w, -H)), B2: a3(T0, s3(w2, H)), hy: hy0 + 0.6 * spread * dX });
          win = dC[el.i1] || win; p = a3(q2, s3(win, 0.55 * WpD));
          dX += 1.2 * WpD;
        }
      }
      const pEnd = p, zcW = dirW(Dz.zc), xcW = dirW(Dz.xc), ycW = dirW(Dz.yc);
      // the camera: along its axis from the last surface, clear of the arriving beam where practical
      let dCam = 0.6 * WpD + 0.1 * f;
      for (let k = 0; k < 30 && offAx(a3(pEnd, s3(zcW, dCam))) < 0.5 * W + 0.7 * WpD && dCam < 3 * WpD + f; k++) dCam *= 1.1;
      let C3 = a3(pEnd, s3(zcW, dCam)), Dc3 = a3(C3, s3(zcW, f));
      {
        let minX = Math.min(C3[0] - 0.6 * WpD, Dc3[0] - 0.6 * Math.max(LxD, LyD));
        for (const el of els) for (const q of el.k === "s" ? [el.c] : [el.T0, el.B1, el.B2]) minX = Math.min(minX, q[0] - (el.k === "s" ? el.hx : 0));
        const sh = [Math.max(fcol + d1, fcol + 0.35 * W - minX), 0, 0];
        Ec = sh; C3 = a3(C3, sh); Dc3 = a3(Dc3, sh);
        for (const el of els) { if (el.k === "s") el.c = a3(el.c, sh); else { el.T0 = a3(el.T0, sh); el.B1 = a3(el.B1, sh); el.B2 = a3(el.B2, sh); } }
      }
      // the light from the telescope to the echelle (white): the cone to the slit, the cone to the collimator, the
      // collimated beam to the echelle's face
      const S0 = [0, 0, 0];
      tube([Array.from({ length: NS }, (_, k) => [-Lt, tHalf * Math.cos(2 * Math.PI * k / NS), tHalf * Math.sin(2 * Math.PI * k / NS)]), [S0]], [214, 160, 50], 0.13, true);
      {
        const st = [[S0], RING.map(([py, pz]) => { const c = onMirror(py / Math.cos(tau)); return [c[0], c[1], pz]; })];
        if (foldOn) st.push(RING.map(([py, pz]) => { const q = addv(Cf, sc(tf2, py / Math.sin(phi / 2))); return M3(Mf, [q[0], q[1], pz]); }));
        st.push(RING.map(([py, pz]) => Mp3(hitPl([fcol, py, pz], [1, 0, 0], Ec, nE))));
        tube(st, NEU3, 0.07);
      }
      // the dispersed light: three orders (the reddest, the middle, the bluest on the chip), three wavelengths in each
      const ords = Dz.orders || [], pick = ords.length ? [...new Set([ords[ords.length - 1], ords[Math.floor(ords.length / 2)], ords[0]])] : [];
      const lr = Dz.range || [lcE * 0.9, lcE * 1.1], tOf = l => Math.min(1, Math.max(0, (l - lr[0]) / (lr[1] - lr[0])));
      const foci = [];
      let rCam = 0;
      for (const o of pick) for (const l of [o.lo, Math.min(o.hi, Math.max(o.lo, o.lb)), o.hi]) {
        const pq = Dz.pos(l, o.m), ut = Dz.mainOut(l, o.m);
        if (!pq || !ut) continue;
        const u1 = dirW(ut), dirs = stg.length ? xdDirs(ut, l) : [];
        if (!dirs) continue;
        const [a1, a2] = perpPair(u1);
        let cur = ringAt(Ec, a1, a2, W / 2).map(q => hitPl(q, u1, Ec, nE)), w = u1;
        const st = [cur];
        for (const el of els) {
          if (el.k === "s") { cur = cur.map(q => hitPl(q, w, el.c, el.n)); st.push(cur); w = dirs[el.i1]; }
          else {
            const wi = dirs[el.i0];
            cur = cur.map(q => hitPl(q, w, el.T0, el.n1)); st.push(cur);
            cur = cur.map(q => hitPl(q, wi, el.T0, el.n2)); st.push(cur);
            w = dirs[el.i1];
          }
        }
        cur = cur.map(q => hitPl(q, w, C3, zcW)); st.push(cur);
        for (const q of cur) rCam = Math.max(rCam, Math.hypot(...a3(q, s3(C3, -1))));
        const Q = a3(Dc3, a3(s3(xcW, pq[0]), s3(ycW, pq[1]))), rgb = rampRGB(tOf(l));
        st.push([Q]);
        tube(st.map(r => r.map(Mp3)), rgb, 0.12);
        foci.push([Mp3(Q), rgb]);
      }
      // the optics: the collimator, the echelle, the cross-disperser, the camera
      const rCol = 1.06 * W / 2;
      if (mirror) slab([Cm[0], Cm[1], 0], [nm[0], nm[1], 0], rCol, 0.05 * rCol, MIRROR3, 0.55, STEEL3);
      else slab([fcol, 0, 0], [1, 0, 0], rCol, 0.12 * rCol, GLASS3, 0.22, GE3);
      if (foldOn) {
        const hL = 1.08 * W / 2 / Math.sin(phi / 2), tf3 = n3(L3(Mf, [tf2[0], tf2[1], 0])), c = M3(Mf, [Cf[0], Cf[1], 0]);
        const nrm = n3(x3(tf3, ZA)), bk = d3(nrm, M3(Mf, [Cf[0] + nf[0], Cf[1] + nf[1], 0]).map((v, i) => v - c[i])) > 0 ? nrm : s3(nrm, -1);
        plate(c, tf3, ZA, hL, rCol, s3(bk, -1), 0.04 * W, MIRROR3, 0.6, STEEL3);
      }
      {
        const hu = 1.04 * W / (2 * Math.max(0.15, Math.abs(d3([1, 0, 0], nE)))), hv = 1.04 * W / 2;
        plate(Mp3(Ec), Lv(tE), Lv(gE), hu, hv, Lv(nE), 0.06 * W, STEEL_RGB, 0.6, STEEL3);
        for (let k = 1; k < 14; k++) { const q = a3(Ec, s3(tE, hu * (2 * k / 14 - 1))); line(Mp3(a3(q, s3(gE, hv))), Mp3(a3(q, s3(gE, -hv))), rgba(rampRGB(k / 14), 0.85), 1); }
      }
      let xdTop = null;
      for (const el of els) {
        if (el.k === "s") {
          const glass = !el.refl;
          plate(Mp3(el.c), Lv(el.ux), Lv(el.uy), el.hx, el.hy, Lv(el.n), 0.06 * WpD, glass ? GLASS3 : STEEL_RGB, glass ? 0.3 : 0.6, glass ? GE3 : STEEL3);
          for (let k = 1; k < 12; k++) { const q = a3(el.c, s3(el.ux, el.hx * (2 * k / 12 - 1))); line(Mp3(a3(q, s3(el.uy, el.hy))), Mp3(a3(q, s3(el.uy, -el.hy))), rgba([120, 128, 138], 0.7), 0.8); }
          xdTop = a3(el.c, s3(el.uy, 1.2 * el.hy));
        } else {
          const at = (q, y) => Mp3(a3(q, s3(el.e, y)));
          for (const y of [el.hy, -el.hy]) face([at(el.T0, y), at(el.B1, y), at(el.B2, y)], GLASS3, 0.25, GE3);
          for (const [q0, q1] of [[el.T0, el.B1], [el.T0, el.B2], [el.B1, el.B2]]) face([at(q0, el.hy), at(q1, el.hy), at(q1, -el.hy), at(q0, -el.hy)], GLASS3, 0.2, GE3);
          if (el.ruled) for (let k = 1; k < 12; k++) { const q = a3(el.T0, s3(a3(el.B2, s3(el.T0, -1)), k / 12)); line(at(q, el.hy), at(q, -el.hy), rgba([120, 128, 138], 0.7), 0.8); }
          xdTop = a3(el.T0, s3(el.e, 1.2 * el.hy));
        }
      }
      slab(C3, zcW, Math.max(rCam, 0.5 * WpD) * 1.06, 0.12 * Math.max(rCam, 0.5 * WpD), GLASS3, 0.22, GE3, Mp3);
      // the detector, with every order's trace on its face, the foci of the drawn bundles, and its two directions
      {
        const off = s3(zcW, -0.4);
        plate(Mp3(Dc3), Lv(xcW), Lv(ycW), LxD / 2, LyD / 2, s3(Lv(zcW), -1), 0.012 * LxD + 0.5, [51, 55, 61], 0.92, STEEL3);
        for (const o of ords) {
          let prev = null;
          for (let k = 0; k <= 24; k++) {
            const l = o.lo + (o.hi - o.lo) * k / 24, pq = Dz.pos(l, o.m);
            if (!pq) { prev = null; continue; }
            const q = Mp3(a3(a3(Dc3, off), a3(s3(xcW, pq[0]), s3(ycW, pq[1]))));
            if (prev) line(prev, q, rgba(rampRGB(tOf(l)), 1), 1.4);
            prev = q;
          }
        }
        for (const [q, col] of foci) prims3.push({ k: "d", p: [q], col });
        const o = Mp3(a3(Dc3, a3(s3(xcW, -1.12 * LxD / 2), s3(ycW, -1.12 * LyD / 2))));
        prims3.push({ k: "a", p: [o, a3(o, s3(Lv(xcW), 0.5 * LxD))], txt: "λ" }, { k: "a", p: [o, a3(o, s3(Lv(ycW), 0.5 * LyD))], txt: "orders" });
        labs3.push([Mp3(a3(Dc3, s3(ycW, 0.75 * LyD + 0.05 * f))), "detector", mm(LxD)]);
      }
      prims3.push({ k: "d", p: [S0], col: [96, 90, 84] });
      const xdName = P.xd === "prism" ? (els.length > 1 ? els.length + " prism passes" : "prism") : P.xd === "grism" ? "grism" : P.xd === "vph" ? "VPH grating" : "grating";
      labs3.push([[-Lt, 0, tHalf * 1.8], "telescope", "f/" + sig(P.F, 3)], [[0, 0, -0.09 * fcol], "slit", sig(P.slitW, 3) + "″"],
        [mirror ? [Cm[0], Cm[1], -rCol * 1.18] : [fcol, 0, -rCol * 1.18], "collimator", "f = " + mm(fcol)],
        [Mp3(a3(Ec, s3(gE, 0.75 * W))), "echelle", sig(P.eG, 4) + " /mm"],
        [Mp3(a3(C3, s3(ZA, -1.2 * Math.max(rCam, 0.5 * WpD)))), "camera f/" + sig(Dz.Fcam, 3), "f = " + mm(f)]);
      if (xdTop) labs3.push([Mp3(xdTop), "cross-disperser", xdName]);
      const passes = els.length > 1 && P.xd === "prism";
      $("lSub").textContent = "drag to orbit, right- or shift-drag to pan, scroll to zoom, double-click to reset; directions from the ray trace" + (gm > 0 ? " (the beams " + (2 * gm / IX.DEG).toFixed(1) + "° apart out of the echelle's plane)" : "") + "; the spacings after the echelle are schematic" + (passes ? ", and the prisms' passes are drawn in turn after the echelle, where the tracer applies them" : "") + ".";
    }
    // ---- 3D view of the echelles whose light comes back past the collimator (P.lay3d), in the double-pass view's
    // frame: x along the collimator's axis (its focal plane at x = 0, the collimator at x = f_col), y along the
    // echelle's dispersion, z across the orders (up).  The slit sits sS above the axis; the returning light comes back
    // as far below it.  Three arrangements:
    //   "pp": prisms passed on the way to the echelle and again on the way back (MagE, ESI, FIRE); the returning light
    //         goes to a camera of its own beside the collimator;
    //   "4c": the same prisms, then the collimator again, which forms the cross-dispersed spectrum in its focal plane
    //         below the slit; a flat sends it to a camera that re-images it onto the detector (X-Shooter's 4C design);
    //   "wp": a white pupil: the collimator again forms the spectrum (orders overlapping) below the slit, a flat folds
    //         it to the transfer collimator (f = wpT), which re-forms the pupil, where the cross-disperser stands, in
    //         front of the camera (HARPS, UVES, FEROS, ESPRESSO, G-CLEF, ZShooter).
    // Where each order and wavelength lands is the tracer's (Dz.pos): each returning bundle is traced back from its
    // focus through the drawn optics (Snell's law in the prisms), so the drawing agrees with the Detector panel.  The
    // mirrors are drawn as lenses, unfolded but for the flat; the spacings the sources do not give are schematic.
    function build3dFolded(kind) {
      const fC = fcol, fK = fcam, LxD = Dz.Lx, LyD = Dz.Ly, lcE = P.lamC / 1e4, dE = d1;
      const XA = [1, 0, 0], YA = [0, 1, 0], ZA = [0, 0, 1], O = [fC, 0, 0];
      const refr = (u, nv, n1, n2) => { const c = d3(u, nv), r = n1 / n2, k = 1 - r * r * (1 - c * c); return k < 0 ? null : n3(a3(s3(a3(u, s3(nv, -c)), r), s3(nv, Math.sqrt(k)))); };
      const hitPl = (p, u, c, nv) => a3(p, s3(u, d3(a3(c, s3(p, -1)), nv) / d3(u, nv)));
      const ringAt = (c, a1, a2, r) => RING.map(([py, pz]) => a3(c, a3(s3(a1, py * 2 * r / W), s3(a2, pz * 2 * r / W))));
      const perpPair = u => { let a1 = x3(u, ZA); if (Math.hypot(...a1) < 1e-6) a1 = YA; a1 = n3(a1); return [a1, n3(x3(a1, u))]; };
      const perpTo = (v, e) => n3(a3(v, s3(e, -d3(v, e))));
      const rotY = (v, t) => [v[0] * Math.cos(t) + v[2] * Math.sin(t), v[1], -v[0] * Math.sin(t) + v[2] * Math.cos(t)];
      const WpD = Math.max(W, Dz.Wp || W), gm = Dz.gamma || 0;
      const fT = kind === "wp" ? (P.wpT > 0 ? P.wpT : fC) : fC, fPh = kind === "wp" ? fK * fT / fC : fK;   // the transfer collimator; the camera itself (f_cam is the model's effective camera)
      // the separation out of the echelle's plane: the slit sS above the axis, the returning focus as far below
      const rA = 0.62 * WpD;                                        // the camera's half aperture ("pp")
      // ("pp": the slit near the axis; the camera stands below the arriving beam, near the prisms)
      const sS = kind === "pp" ? 0.03 * fC : Math.max(gm * fC, 0.06 * fC + (kind === "4c" ? 0.6 * LyD * fC / fK : 0.15 * W));
      let sepDeg = 2 * Math.atan(sS / fC) / IX.DEG;
      const sepTrue = 2 * gm / IX.DEG;
      // the prisms ("pp", "4c"), from the tracer's passes in the order the light makes them (P.xPrisms): P.xPre passes
      // before the echelle, the last P.xDbl of them through prisms passed again on the way back; the first passes then
      // cross prisms met only on the way in (FIRE's first), the passes past xPre + xDbl prisms met only on the way back
      // (MagE's 40 deg prism, ESI's second, FIRE's fourth). Without the keys: half the passes, each prism passed twice.
      // Each prism stands at minimum deviation for lamC, turned by its pass's dI (a larger angle of incidence for
      // dI > 0, as in physics.js), bending the beam toward +z (as in the double-pass view)
      const train = Array.isArray(P.xPrisms) && P.xPrisms.length ? P.xPrisms : Array(Math.max(1, Math.round(P.xPasses || 1))).fill({ glass: P.xGlass, A: P.xA });
      const nPass = train.length, nD0 = Math.max(1, Math.round(nPass / 2));
      const xPre = P.xPre > 0 ? Math.min(nPass, Math.round(P.xPre)) : nD0;
      const xDbl = P.xDbl === null || P.xDbl === undefined || !(P.xDbl >= 0) ? Math.min(xPre, nD0) : Math.min(xPre, nPass - xPre, Math.round(P.xDbl));
      const usePr = kind !== "wp" && P.xd === "prism";
      const inOnly = usePr ? train.slice(0, xPre - xDbl) : [], dblT = usePr ? train.slice(xPre - xDbl, xPre) : [], outOnly = usePr && kind === "pp" ? train.slice(xPre + xDbl) : [];
      // a prism whose central ray crosses at c going along u: apex ha below the ray, height H, at minimum deviation
      const rotAx = (v, ax, t) => a3(a3(s3(v, Math.cos(t)), s3(x3(ax, v), Math.sin(t))), s3(ax, d3(ax, v) * (1 - Math.cos(t))));
      const mkPrism = (c, u, pr, ha, H) => {
        const A = pr.A * IX.DEG, nC = IX.nGlass(pr.glass, lcE), D = 2 * Math.asin(Math.min(1, nC * Math.sin(A / 2))) - A;
        const bIn = n3(a3(ZA, s3(u, -d3(ZA, u)))), uInt = n3(a3(s3(u, Math.cos(D / 2)), s3(bIn, Math.sin(D / 2))));
        const b = n3(a3(ZA, s3(uInt, -d3(ZA, uInt))));
        let T = a3(c, s3(b, -ha)), n1 = n3(a3(s3(uInt, Math.cos(A / 2)), s3(b, Math.sin(A / 2)))), n2 = n3(a3(s3(uInt, Math.cos(A / 2)), s3(b, -Math.sin(A / 2))));
        const e1 = n3(a3(s3(b, Math.cos(A / 2)), s3(uInt, -Math.sin(A / 2)))), e2 = n3(a3(s3(b, Math.cos(A / 2)), s3(uInt, Math.sin(A / 2))));
        let B1 = a3(T, s3(e1, H / Math.cos(A / 2))), B2 = a3(T, s3(e2, H / Math.cos(A / 2)));
        if (pr.dI) {
          // turned about the normal of its principal plane, through c, the way that opens the first face's incidence
          const ax = n3(x3(n1, n2)), ang = i1 => Math.acos(Math.max(-1, Math.min(1, d3(u, i1))));
          let t = pr.dI * IX.DEG;
          if ((ang(rotAx(n1, ax, t)) - ang(n1)) * pr.dI < 0) t = -t;
          const R = q => a3(c, rotAx(a3(q, s3(c, -1)), ax, t));
          T = R(T); B1 = R(B1); B2 = R(B2); n1 = rotAx(n1, ax, t); n2 = rotAx(n2, ax, t);
        }
        return { T, n1, n2, glass: pr.glass, A: pr.A, B1, B2 };
      };
      const through = (pr, q, w, lam) => {
        const n = IX.nGlass(pr.glass, lam), a = hitPl(q, w, pr.T, pr.n1), w1 = refr(w, pr.n1, 1, n);
        if (!w1) return null;
        const b = hitPl(a, w1, pr.T, pr.n2), w2 = refr(w1, pr.n2, n, 1);
        return w2 ? { a, b, u: w2 } : null;
      };
      const prisms = [], dblP = [], postRev = [];                    // the arriving light's prisms; the double-pass ones; the returning light's alone
      const lensIn = a3(O, [0, 0, sS * dE / fC]), v0 = n3([fC, 0, -sS]);
      let p = lensIn, u = v0, run = 0;
      // (a prism met only on the way in near the collimator; the double-pass ones from 0.45 of the way to the echelle on,
      // from 0.7 when prisms met only on the way back follow them: the camera then stays near the pupil)
      const dblFrom = fC + (outOnly.length ? 0.7 : 0.45) * dE;
      [...inOnly.map(pr => [pr, 1]), ...dblT.map(pr => [pr, 2])].forEach(([pr, np], k, all) => {
        const ha = np === 1 ? 0.7 * W : outOnly.length ? 0.7 * W : 1.1 * W, H = np === 1 ? 1.4 * W : outOnly.length ? 2.4 * W : 1.9 * W;
        const target = k === 0 ? (np === 1 ? fC + 0.1 * dE : dblFrom) : np === 2 && all[k - 1][1] === 1 ? Math.max(p[0] + 0.15 * W, dblFrom) : p[0] + 0.15 * W;
        let L = 0;
        for (let it = 0; it < 4; it++) {
          const q0 = mkPrism(a3(p, s3(u, L)), u, pr, ha, H), gap = target - Math.min(q0.T[0], q0.B1[0], q0.B2[0]);
          if (gap > 0) L += gap / Math.max(0.2, u[0]);
        }
        const q = mkPrism(a3(p, s3(u, L)), u, pr, ha, H), tr = through(q, p, u, lcE);
        prisms.push(q);
        if (np === 2) dblP.push(q);
        if (!tr) return;
        run += Math.hypot(...a3(tr.a, s3(p, -1))) + Math.hypot(...a3(tr.b, s3(tr.a, -1)));
        p = tr.b; u = tr.u;
      });
      let retPr = dblP;                                              // the returning light's prisms, from the camera's side
      const dl = (P.eDelta || 63) * IX.DEG, prismFar = prisms.length ? Math.max(...prisms.map(q => Math.max(d3(a3(q.T, s3(p, -1)), u), d3(a3(q.B1, s3(p, -1)), u), d3(a3(q.B2, s3(p, -1)), u)))) : 0;
      const E = a3(p, s3(u, Math.max(dE - run, prismFar + 0.5 * W * Math.tan(dl) + 0.12 * W))), vE = u;
      // (a prism with rev was set across the returning light, which enters it through n1: the light toward the echelle
      // crosses it the other way)
      const fwd = (p0, u0, lam, list = retPr) => {
        const pts = []; let q = p0, w = u0;
        for (const pr of list) {
          const n = IX.nGlass(pr.glass, lam), f1 = pr.rev ? s3(pr.n2, -1) : pr.n1, f2 = pr.rev ? s3(pr.n1, -1) : pr.n2;
          const a = hitPl(q, w, pr.T, f1); w = w && refr(w, f1, 1, n); if (!w) return null;
          const b = hitPl(a, w, pr.T, f2); w = refr(w, f2, n, 1); if (!w) return null;
          pts.push(a, b); q = b;
        }
        return { pts, u: w, end: q };
      };
      const back = (p0, u0, lam, list = retPr) => {
        const pts = []; let q = p0, w = u0;
        for (const pr of list.slice().reverse()) {
          const n = IX.nGlass(pr.glass, lam), m2 = pr.rev ? pr.n1 : s3(pr.n2, -1), m1 = pr.rev ? pr.n2 : s3(pr.n1, -1);
          const a = hitPl(q, w, pr.T, m2); w = refr(w, m2, 1, n); if (!w) return null;
          const b = hitPl(a, w, pr.T, m1); w = refr(w, m1, n, 1); if (!w) return null;
          pts.push(a, b); q = b;
        }
        return { pts, u: w, end: q };
      };
      // where the returning light meets the plane x = f_col: the collimator again ("4c", "wp") or the camera ("pp"),
      // whose center sits where the central returning ray crosses that plane
      // ("pp": the returning light leaves the echelle psi below the arriving beam, the instrument's 2 gamma or, where that is
      // too small to draw, the angle that puts the camera clear of the arriving beam 0.6 of the way back to the collimator
      // (nearer for a short camera, whose aperture would otherwise have to grow with the field it sees);
      // both beams cross the prisms, which are tall enough for the two)
      let Oret = O, camFixed = null;
      if (kind === "pp") {
        // (room on the way back for the prisms met only there, behind the double-pass ones)
        const dblFar = dblP.length ? Math.max(...dblP.flatMap(q => [q.T, q.B1, q.B2].map(z => d3(a3(E, s3(z, -1)), vE)))) : 0;
        const Lc = Math.max(Math.min(0.6 * dE, 3 * W + fK), outOnly.length ? dblFar + outOnly.length * 1.7 * W + 0.9 * W : 0);
        const psi = Math.max(2 * gm, Math.asin(Math.min(0.5, (0.5 * W + rA + 0.12 * W) / Lc)));
        Oret = a3(E, [-Lc * Math.cos(psi), 0, -Lc * Math.sin(psi)]);
        if (outOnly.length) {
          // With prisms met only on the way back, which bend the returning light further toward +z (as the double-pass
          // ones do, so that the cross-dispersions add), the returning beam leaves the echelle above the arriving one
          // and the camera stands above it. The returning central ray is traced from the echelle's center back through
          // the double-pass prisms, each single-pass prism set across it as it goes; its angle above the arriving beam
          // is the smallest that puts those prisms and the camera clear of the arriving beam.
          const zP = n3(a3(ZA, s3(v0, -d3(ZA, v0))));
          const off = q => d3(a3(q, s3(lensIn, -1)), zP);              // height above the arriving beam's axis
          const build = t0 => {
            let q = E, w = rotY(s3(vE, -1), t0);
            for (const pr of dblP.slice().reverse()) {
              const n = IX.nGlass(pr.glass, lcE), a = hitPl(q, w, pr.T, s3(pr.n2, -1)), w1 = refr(w, s3(pr.n2, -1), 1, n);
              if (!w1) return null;
              const b = hitPl(a, w1, pr.T, s3(pr.n1, -1)), w2 = refr(w1, s3(pr.n1, -1), n, 1);
              if (!w2) return null;
              q = b; w = w2;
            }
            const placed = [];
            let low = Infinity;
            for (let j = 0; j < outOnly.length; j++) {
              const pr = Object.assign(mkPrism(a3(q, s3(w, (j ? 0.95 : 1.1) * W)), w, outOnly[j], 0.7 * W, 1.4 * W), { rev: true }), t = through(pr, q, w, lcE);
              if (!t) return null;
              low = Math.min(low, off(pr.T), off(pr.B1), off(pr.B2));
              placed.push(pr); q = t.b; w = t.u;
            }
            const Oc = a3(q, s3(w, 0.45 * W + 0.2 * rA));
            low = Math.min(low, off(Oc) - rA);
            return { q, w, placed, Oc, low };
          };
          let r = null;
          for (let t = Math.max(2 * gm, 3 * IX.DEG); t < 50 * IX.DEG; t += 0.5 * IX.DEG) { const r1 = build(t); if (!r1) continue; r = r1; if (r1.low > 0.62 * W) break; }
          if (r) {
            Oret = r.Oc; camFixed = r.w;
            postRev.push(...r.placed.slice().reverse());
            retPr = [...postRev, ...dblP];
          }
        }
      }
      // the returning light's focus: "pp" -- the camera's focal plane; else the collimator's, below the slit
      const Qc0 = kind === "pp" ? null : [0, 0, -sS];
      // the central returning ray, traced from the camera's center ("pp", over its direction) or from the collimator's
      // plane ("4c", "wp", over the point it crosses that plane, its direction fixed by the focus) so that it reaches the
      // echelle's center through the drawn prisms; each bundle's footprint on the echelle (the pupil) is centered there
      const onPlaneE = (q, w) => hitPl(q, w, E, s3(vE, -1));
      let camAx = null, retOff = [0, -sS * dE / fC];
      if (kind === "pp") {
        const aimDir = () => {
          let aim = E;
          for (let it = 0; it < 8; it++) { const d = n3(a3(aim, s3(Oret, -1))), r = fwd(Oret, d, lcE); if (!r) break; const H = onPlaneE(r.end, r.u); aim = a3(aim, s3(a3(H, s3(E, -1)), -1)); }
          return n3(a3(aim, s3(Oret, -1)));
        };
        camAx = camFixed || s3(aimDir(), -1);
      } else {
        const wC = n3(a3([0, 0, -sS], s3(O, -1)));
        for (let it = 0; it < 8; it++) { const st0 = a3(O, [0, retOff[0], retOff[1]]), r = fwd(st0, s3(wC, -1), lcE); if (!r) break; const H = onPlaneE(r.end, r.u); retOff = [retOff[0] - (H[1] - E[1]), retOff[1] - (H[2] - E[2])]; }
      }
      const retStart = kind === "pp" ? Oret : a3(O, [0, retOff[0], retOff[1]]);
      if (kind === "pp" && !camFixed) sepDeg = Math.acos(Math.max(-1, Math.min(1, d3(s3(v0, -1), camAx)))) / IX.DEG;
      const Dpp = kind === "pp" ? a3(Oret, s3(camAx, fK)) : null;
      const xPP = kind === "pp" ? perpTo(YA, camAx) : null, yPP = kind === "pp" ? n3(x3(camAx, xPP)) : null;
      // the focus of order m at lam: on the detector ("pp"), else in the collimator's focal plane: the cross-dispersed
      // spectrum scaled by f_col / f_cam ("4c"), or the uncross-dispersed one ("wp": the echelle's angles only)
      const uBt = Dz.mainOut(Dz.mlamRef / Dz.mRef, Dz.mRef);
      const focus = (l, m) => {
        const pq = Dz.pos(l, m);
        if (!pq) return null;
        if (kind === "pp") return { F: a3(Dpp, a3(s3(xPP, pq[0]), s3(yPP, pq[1]))), pq };
        if (kind === "4c") return { F: [0, pq[0] * fC / fK, pq[1] * fC / fK - sS], pq };
        const ut = Dz.mainOut(l, m);
        if (!ut || !uBt) return null;
        // the angles from the blaze direction, along the echelle's dispersion (the tracer's x) and across it (y)
        const ax = Math.atan2(ut[0], ut[2]) - Math.atan2(uBt[0], uBt[2]), ay = Math.asin(Math.max(-1, Math.min(1, ut[1]))) - Math.asin(Math.max(-1, Math.min(1, uBt[1])));
        return { F: [0, fC * Math.tan(ax), -sS + fC * Math.tan(ay)], pq };
      };
      // the echelle: in Littrow in its own plane; across the orders it returns the central wavelength to the returning
      // focus's center, so its normal bisects the arriving beam and that returning one
      const Fc = kind === "pp" ? Dpp : Qc0, wc = n3(a3(Fc, s3(Oret, -1)));
      const startC = retStart;
      const rc = fwd(startC, s3(wc, -1), lcE);
      const w1c = rc ? s3(rc.u, -1) : s3(vE, -1);
      if (camFixed) sepDeg = Math.acos(Math.max(-1, Math.min(1, d3(s3(vE, -1), w1c)))) / IX.DEG;
      const mxd = n3(a3(w1c, s3(vE, -1))), Yp = n3(a3(YA, s3(mxd, -d3(YA, mxd))));
      const nE = n3(a3(s3(mxd, Math.cos(dl)), s3(Yp, Math.sin(dl)))), tE = n3(a3(s3(Yp, Math.cos(dl)), s3(mxd, -Math.sin(dl)))), gE = n3(x3(nE, tE));
      const onE = (q, w) => hitPl(q, w, E, nE);
      const lr = Dz.range || [lcE * 0.9, lcE * 1.1], tOf = l => Math.min(1, Math.max(0, (l - lr[0]) / (lr[1] - lr[0])));
      // the relay ("4c", "wp"): built along the line from the collimator through the spectrum's center, then folded by
      // a flat just past the spectrum, which sends the light down
      const I0 = Qc0, dIn = I0 ? n3(a3(I0, s3(O, -1))) : null;
      const F0 = I0 ? a3(I0, s3(dIn, 0.05 * fC)) : null, aDown = n3([0.25, 0, -1]), nF = I0 ? n3(a3(aDown, s3(dIn, -1))) : null;
      const Fold = q => (I0 ? a3(q, s3(nF, -2 * d3(a3(q, s3(F0, -1)), nF))) : q);
      let Tl = null, XDc = null, aCam = null, Cc = null, Dc = null, xD = null, yD = null, Rl = null, relayV = 0;
      if (kind === "wp") {
        Tl = a3(I0, s3(dIn, fT)); XDc = a3(Tl, s3(dIn, fT));
        // the cross-disperser turns the beam by the tracer's central deviation, across the echelle's dispersion
        const dev = Math.acos(Math.max(-1, Math.min(1, d3(n3(uBt), Dz.zc))));
        aCam = n3(rotY(dIn, -dev));
        if (aCam[2] > dIn[2] + 1e-9 && dev < Math.PI / 2) aCam = n3(rotY(dIn, dev));
        Cc = a3(XDc, s3(aCam, 0.55 * W * fT / fC + 0.15 * fPh)); Dc = a3(Cc, s3(aCam, fPh));
        xD = perpTo(YA, aCam); yD = n3(x3(aCam, xD));
      } else if (kind === "4c") {
        // the camera re-images the spectrum at f_cam / f_col: object distance u, image distance v = u f_cam / f_col
        const uR = 0.7 * fC; relayV = uR * fK / fC;
        Rl = a3(I0, s3(dIn, uR)); aCam = dIn; Dc = a3(Rl, s3(dIn, relayV));
        xD = perpTo(YA, aCam); yD = n3(x3(aCam, xD));
      }
      // light arriving: the telescope's cone to the slit, then from the slit through the collimator, the prisms and
      // onto the echelle
      const S0 = [0, 0, sS];
      tube([ringAt([-Lt, 0, sS], YA, ZA, tHalf), [S0]], [214, 160, 50], 0.13, true);
      let rL = 0, rR = 0, rT = 0, rK = 0;
      {
        const lens = ringAt(lensIn, YA, ZA, W / 2), st = [[S0], lens], tr = lens.map(q => fwd(q, v0, lcE, prisms));
        if (tr.every(Boolean)) {
          for (let j = 0; j < tr[0].pts.length; j++) st.push(tr.map(t => t.pts[j]));
          st.push(tr.map(t => onE(t.end, t.u)));
          tube(st, NEU3, 0.07);
        }
        for (const q of lens) rL = Math.max(rL, Math.hypot(q[1], q[2]));
      }
      // light returning: three orders (the reddest, the middle, the bluest on the chip), three wavelengths in each
      const ords = Dz.orders || [], pick = ords.length ? [...new Set([ords[ords.length - 1], ords[Math.floor(ords.length / 2)], ords[0]])] : [];
      const foci = [];
      for (const o of pick) for (const l of [o.lo, Math.min(o.hi, Math.max(o.lo, o.lb)), o.hi]) {
        const fo = focus(l, o.m);
        if (!fo) continue;
        const Fp = fo.F, w = n3(a3(Fp, s3(Oret, -1)));
        const rv = fwd(retStart, s3(w, -1), l);
        if (!rv) continue;
        const w1 = s3(rv.u, -1), [a1, a2] = perpPair(w1);
        const foot = ringAt(E, a1, a2, W / 2).map(q => onE(q, w1));
        const tr = foot.map(q => back(q, w1, l));
        if (!tr.every(Boolean)) continue;
        const st = [foot];
        for (let j = 0; j < tr[0].pts.length; j++) st.push(tr.map(t => t.pts[j]));
        const atRet = tr.map(t => hitPl(t.end, t.u, Oret, kind === "pp" ? camAx : XA));
        for (const q of atRet) { const r = Math.hypot(...a3(q, s3(Oret, -1))); if (kind === "pp") rK = Math.max(rK, r); else rL = Math.max(rL, r); }
        st.push(atRet, [Fp]);
        const rgb = rampRGB(tOf(l));
        tube(st, rgb, 0.12);
        if (kind === "pp") { foci.push([Fp, rgb]); continue; }
        // the relay: from the focus in the collimator's focal plane on, folded by the flat
        const chief = n3(a3(Fp, s3(O, -1)));
        if (kind === "4c") {
          const Rc = hitPl(Fp, chief, Rl, dIn), [b1, b2] = perpPair(dIn), ring = ringAt(Rc, b1, b2, 0.5 * W * 0.7);
          for (const q of ring) rR = Math.max(rR, Math.hypot(...a3(q, s3(Rl, -1))));
          const Q = a3(Dc, a3(s3(xD, -fo.pq[0]), s3(yD, -fo.pq[1])));
          tube([[Fp], ring, [Q]].map(r => r.map(Fold)), rgb, 0.12);
          foci.push([Fold(Q), rgb]);
        } else {
          const Ct = hitPl(Fp, chief, Tl, dIn), [b1, b2] = perpPair(dIn), rT0 = 0.5 * W * fT / fC;
          const ringT = ringAt(Ct, b1, b2, rT0), w2 = n3(a3(Tl, s3(Fp, -1)));
          for (const q of ringT) rT = Math.max(rT, Math.hypot(...a3(q, s3(Tl, -1))));
          const atXD = ringT.map(q => hitPl(q, w2, XDc, dIn));
          const Q = a3(Dc, a3(s3(xD, -fo.pq[0]), s3(yD, fo.pq[1]))), w3 = n3(a3(Q, s3(Cc, -1)));
          const atCam = atXD.map(q => hitPl(q, w3, Cc, aCam));
          for (const q of atCam) rK = Math.max(rK, Math.hypot(...a3(q, s3(Cc, -1))));
          tube([[Fp], ringT, atXD, atCam, [Q]].map(r => r.map(Fold)), rgb, 0.12);
          foci.push([Fold(Q), rgb]);
        }
      }
      // the optics: the collimator, the prisms, the echelle
      slab(O, XA, Math.max(rL, 0.5 * W) * 1.06, 0.1 * Math.max(rL, 0.5 * W), GLASS3, 0.22, GE3);
      const hy = 0.62 * W + 0.3 * LxD * dE / fK;
      for (const pr of [...prisms, ...postRev]) {
        const at = (q, y) => [q[0], q[1] + y, q[2]];
        for (const y of [hy, -hy]) face([at(pr.T, y), at(pr.B1, y), at(pr.B2, y)], GLASS3, 0.25, GE3);
        for (const [q0, q1] of [[pr.T, pr.B1], [pr.T, pr.B2], [pr.B1, pr.B2]]) face([at(q0, hy), at(q1, hy), at(q1, -hy), at(q0, -hy)], GLASS3, 0.2, GE3);
      }
      {
        const hu = 1.04 * W / (2 * Math.cos(dl)), hv = 1.04 * W / 2;
        plate(E, tE, gE, hu, hv, nE, 0.06 * W, STEEL_RGB, 0.6, STEEL3);
        for (let k = 1; k < 14; k++) { const q = a3(E, s3(tE, hu * (2 * k / 14 - 1))); line(a3(q, s3(gE, hv)), a3(q, s3(gE, -hv)), rgba(rampRGB(k / 14), 0.85), 1); }
      }
      // the detector (and its traces of every order) on the camera's or the relay's focal plane
      const detector = (Dctr, ex, ey, sx, sy, map) => {
        plate(map(Dctr), n3(a3(map(ex), s3(map([0, 0, 0]), -1))), n3(a3(map(ey), s3(map([0, 0, 0]), -1))), LxD / 2, LyD / 2, n3(x3(a3(map(ex), s3(map([0, 0, 0]), -1)), a3(map(ey), s3(map([0, 0, 0]), -1)))), 0.012 * LxD + 0.5, [51, 55, 61], 0.92, STEEL3);
        for (const o of ords) {
          let prev = null;
          for (let k = 0; k <= 24; k++) {
            const l = o.lo + (o.hi - o.lo) * k / 24, pq = Dz.pos(l, o.m);
            if (!pq) { prev = null; continue; }
            const q = map(a3(Dctr, a3(s3(ex, sx * pq[0]), s3(ey, sy * pq[1]))));
            if (prev) line(prev, q, rgba(rampRGB(tOf(l)), 1), 1.4);
            prev = q;
          }
        }
      };
      const id = q => q;
      if (kind === "pp") {
        slab(Oret, camAx, Math.max(rK, rA) * 1.06, 0.1 * Math.max(rK, rA), GLASS3, 0.22, GE3);
        detector(Dpp, xPP, yPP, 1, 1, id);
        labs3.push([a3(Oret, [0, 0, -Math.max(rK, rA) * 1.2]), "camera f/" + sig(Dz.Fcam, 3), "f = " + mm(fK)], [a3(Dpp, s3(yPP, -0.75 * LyD)), "detector", mm(LxD)]);
      } else {
        // the spectrum in the collimator's focal plane, the flat, the relay's optics
        const sp = []; for (const o of ords) for (let k = 0; k <= 12; k++) { const fo = focus(o.lo + (o.hi - o.lo) * k / 12, o.m); if (fo) sp.push(fo.F); }
        const ys = sp.map(q => q[1]), zs = sp.map(q => q[2]), hyS = Math.max(0.1 * W, ...ys.map(Math.abs)) * 1.15, hzS = Math.max(0.05 * W, ...zs.map(z => Math.abs(z + sS))) * 1.3;
        line([0, -hyS, -sS], [0, hyS, -sS], rgba([140, 132, 120], 0.8), 1);
        const tf = n3(x3(nF, YA));
        plate(F0, YA, tf, hyS * 1.1, hzS * 1.6 + 0.04 * fC, nF, 0.02 * fC, MIRROR3, 0.55, STEEL3);
        if (kind === "4c") {
          slab(Fold(Rl), n3(a3(Fold(a3(Rl, dIn)), s3(Fold(Rl), -1))), Math.max(rR, 0.3 * W) * 1.06, 0.1 * Math.max(rR, 0.3 * W), GLASS3, 0.22, GE3);
          detector(Dc, xD, yD, -1, -1, Fold);
          labs3.push([Fold(a3(Rl, [0, 0, -Math.max(rR, 0.3 * W) * 1.3])), "camera f/" + sig(Dz.Fcam, 3), "re-images the spectrum"], [Fold(a3(Dc, s3(yD, 0.8 * LyD))), "detector", mm(LxD)]);
        } else {
          const aT = n3(a3(Fold(a3(Tl, dIn)), s3(Fold(Tl), -1)));
          slab(Fold(Tl), aT, Math.max(rT, 0.5 * W * fT / fC) * 1.06, 0.1 * Math.max(rT, 0.5 * W * fT / fC), GLASS3, 0.22, GE3);
          // the cross-disperser at the white pupil, turning the beam from the transfer collimator's axis to the camera's
          const dI = n3(a3(Fold(a3(XDc, dIn)), s3(Fold(XDc), -1))), aC = n3(a3(Fold(a3(Cc, aCam)), s3(Fold(Cc), -1)));
          const refl = P.xd === "grating", nX = n3(refl ? a3(aC, s3(dI, -1)) : a3(aC, dI)), uX = perpTo(Fold(a3([0, 0, 0], YA)).map((v, i) => v - Fold([0, 0, 0])[i]), nX), vX = n3(x3(nX, uX));
          const hX = 0.62 * W * fT / fC + 0.3 * LxD * fT / fK;
          plate(Fold(XDc), uX, vX, hX, hX, nX, 0.05 * W * fT / fC, refl ? STEEL_RGB : GLASS3, refl ? 0.6 : 0.3, refl ? STEEL3 : GE3);
          slab(Fold(Cc), aC, Math.max(rK, 0.5 * W * fT / fC) * 1.06, 0.1 * Math.max(rK, 0.5 * W * fT / fC), GLASS3, 0.22, GE3);
          detector(Dc, xD, yD, -1, 1, Fold);
          const xdName = P.xdLabel || (P.xd === "prism" ? "prism" : P.xd === "grism" ? "grism" : P.xd === "vph" ? "VPH grating" : "grating");
          // a dichroic plate (P.dichLabel, drawing only) in the transferred beam, dichBefore mm ahead of the cross-disperser,
          // tilted dichTilt deg; the drawn arm is the one the dichroic transmits (G-CLEF red: Ben-Ami et al. 2016 Sec. 2.2)
          if (P.dichLabel) {
            const Wt = W * fT / fC, Pd = a3(XDc, s3(dIn, -(P.dichBefore > 0 ? P.dichBefore : 0.3 * fT)));
            const FoldV = (p, v) => n3(a3(Fold(a3(p, v)), s3(Fold(p), -1)));
            const nW = FoldV(Pd, rotY(dIn, (P.dichTilt || 15) * IX.DEG)), uW = perpTo(FoldV(Pd, YA), nW), vW = n3(x3(nW, uW));
            plate(Fold(Pd), uW, vW, 0.83 * Wt, 0.64 * Wt, nW, 0.15 * Wt, [222, 190, 120], 0.35, "rgba(150,118,50,0.8)");
            labs3.push([a3(Fold(Pd), s3(vW, -0.9 * Wt)), "dichroic", P.dichLabel]);
          }
          // (HARPS: the light returns to the collimator a third time; drawn unfolded, as a mirror of its own)
          labs3.push([Fold(a3(Tl, [0, 0, -Math.max(rT, 0.5 * W * fT / fC) * 1.3])), P.wp3 ? "collimator, third pass" : "transfer collimator", "f = " + mm(fT) + (P.wp3 ? ", drawn unfolded" : "")],
            [Fold(a3(XDc, s3(vX, 1.3 * hX))), "cross-disperser", xdName + ", at the white pupil"],
            [Fold(a3(Cc, [0, 0, -Math.max(rK, 0.5 * W * fT / fC) * 1.3])), "camera", "f = " + mm(fPh)],
            [Fold(a3(Dc, s3(yD, 0.8 * LyD))), "detector", mm(LxD)]);
        }
        labs3.push([[0, 0, -sS - hzS - 0.04 * fC], "spectrum", kind === "wp" ? "orders overlapping" : "cross-dispersed"], [a3(F0, [0, 0, -0.12 * fC]), P.fold3d || "flat", ""]);
      }
      for (const [q, col] of foci) prims3.push({ k: "d", p: [q], col });
      prims3.push({ k: "d", p: [S0], col: [96, 90, 84] });
      const pTop = prisms.length ? prisms[prisms.length - 1] : null;
      labs3.push([[-Lt, 0, sS + tHalf * 1.8], P.feedLabel || "telescope", "f/" + sig(P.F, 3)], [[0, 0, sS + 0.09 * fC], "slit", sig(P.slitW, 3) + "″"],
        [a3(O, [0, 0, rL * 1.18]), kind === "pp" ? "collimator" : P.wp3 ? "collimator, passed three times" : "collimator, passed twice", "f = " + mm(fC)],
        [a3(E, s3(gE, 0.75 * W)), "echelle", sig(P.eG, 4) + " /mm"]);
      if (pTop) {
        const nAll = prisms.length + postRev.length, ones = inOnly.length + outOnly.length;
        const what = !ones ? (nAll > 1 ? nAll + " prisms, passed twice" : "prism, passed twice") : nAll + " prisms: " + (dblP.length === 1 ? "one" : dblP.length) + " passed twice, " + (ones === 1 ? "one" : ones) + " once";
        const list = [...inOnly.map(q => q.A + "°"), ...dblT.map(q => q.A + "° ×2"), ...outOnly.map(q => q.A + "°")].join(", ");
        labs3.push([a3(pTop.B2, [0, 0, 0.12 * W]), what, ones ? list : prisms.map(q => q.A + "°").join(" + ")]);
      }
      const sepTxt = Math.abs(sepDeg - sepTrue) < 0.05 ? "" : "; the beams are drawn " + sepDeg.toFixed(1) + "° apart out of the echelle's plane" + (sepTrue > 0 ? " (" + sepTrue.toFixed(1) + "° in the instrument)" : " (the instrument's angle is not given in the sources)");
      $("lSub").textContent = "drag to orbit, right- or shift-drag to pan, scroll to zoom, double-click to reset; mirrors drawn as lenses" + (kind === "wp" ? " (" + (P.wp3 ? "the collimator's third pass drawn as a mirror of its own" : fT === fC && P.wpT > 0 ? "the transfer collimator matches the main one" : "the transfer collimator " + mm(fT) + ", the camera " + mm(fPh)) + ")" : "") + sepTxt + (kind === "pp" && P.xPrisms && P.xPrisms.some(q => q.dI) ? "; prisms turned from minimum deviation as in the model" : "") + "; spacings not in the sources are schematic" + (P.note3d ? "; " + P.note3d : "") + ".";
    }
    if (ech) { if (dpass) build3dDoublePass(); else if (["pp", "4c", "wp"].includes(P.lay3d)) build3dFolded(P.lay3d); else build3dEchelle(); }
    else {
    const Ly = Dz.Ly, hMax = 0.5 * Ly * fcol / fcam, lc = Dz.grism ? Dz.grism.lam0 : P.lamC / 1e4;
    const zcW = W3(Dz.zc), xcW = W3(Dz.xc), ycW = W3(Dz.yc);
    const C3 = [C[0], C[1], 0], Dc3 = a3(C3, s3(zcW, fcam));
    const byS = c3mode === "slit";
    const slits = [[hMax, 0], [0, 0.5], [-hMax, 1]];               // z on the slit, color (brick top .. teal bottom)
    const lams = [[Dz.range[0], 0], [lc, 0.5], [Dz.range[1], 1]];
    const onCol3 = y => onMirror(y / Math.cos(tau));
    const Qy3 = y => addv(Cf, sc(tf2, y / Math.sin(phi / 2)));
    const gPt3 = y => addv(Gc, sc(tg, (P.gFlip ? -y : y) / Math.cos(a))), gPt03 = y => addv(Gc, sc(tg, y / Math.cos(a)));
    // white light (or, colored by slit, each slit point's light): telescope cones, cones to the collimator, collimated tubes
    for (const [z, t] of slits) {
      const yL = z * d1 / fcol, sl = -z / fcol, zAt = (xu, pz) => yL + pz + sl * (xu - fcol);
      const bz = z - (yL - z) / fcol * Lt, S0 = [0, 0, z];
      tube([Array.from({ length: NS }, (_, k) => [-Lt, tHalf * Math.cos(2 * Math.PI * k / NS), bz + tHalf * Math.sin(2 * Math.PI * k / NS)]), [S0]], [214, 160, 50], 0.13, true);
      const rgb = byS ? frampRGB(t) : NEU3, al = byS ? 0.1 : 0.06;
      const st = [[S0], RING.map(([py, pz]) => { const c = onCol3(py); return [c[0], c[1], yL + pz]; })];
      if (foldOn) st.push(RING.map(([py, pz]) => { const q = Qy3(py); return M3(Mf, [q[0], q[1], zAt(q[0], pz)]); }));
      st.push(RING.map(([py, pz]) => { const gp = gPt3(py); return Mp([gp[0], gp[1], zAt(gp[0], pz)]); }));
      // through the prisms: a station at each face, the bundle's slope along the slit kept over the path from the pupil
      if (PR) for (let j = 1; j < PR.S.length; j++) st.push(RING.map(([py, pz]) => { const c = PR.chain(P.gFlip ? -py : py)[j]; return Mp([c[0], c[1], pz + sl * PR.S[j]]); }));
      tube(st, rgb, al);
    }
    // dispersed light: three wavelengths from each of the three slit points, to their foci on the detector
    let rCam = lensHalf;
    const foci = [];
    for (const [l, tl] of lams) for (const [z, tz] of slits) {
      const p = Dz.pos(l, Dz.order, 0, -z);
      if (!p) continue;
      const b3 = n3(a3(zcW, a3(s3(xcW, p[0] / fcam), s3(ycW, p[1] / fcam)))), Q = a3(Dc3, a3(s3(xcW, p[0]), s3(ycW, p[1])));
      const rgb = byS ? frampRGB(tz) : rampRGB(tl);
      const zEx = PR ? -z / fcol * PR.S[PR.S.length - 1] : 0;      // (prisms: the slit point's offset at the last face)
      const Gs = RING.map(([py, pz]) => { const g0 = PR ? PR.last(PR.chain(py)) : gPt03(py); return [g0[0], g0[1], pz + zEx]; });
      const Es = Gs.map(G => a3(G, s3(b3, d3(a3(C3, s3(G, -1)), zcW) / d3(b3, zcW))));
      for (const E of Es) rCam = Math.max(rCam, Math.hypot(E[0] - C3[0], E[1] - C3[1], E[2] - C3[2]));
      tube([Gs.map(Mp), Es.map(Mp), [Mp(Q)]], rgb, 0.12);
      foci.push([Mp(Q), rgb]);
    }
    // the optics
    const rCol = 1.06 * (W / 2 + hMax * d1 / fcol);
    if (mirror) slab([Cm[0], Cm[1], 0], [nm[0], nm[1], 0], rCol, 0.05 * rCol, MIRROR3, 0.55, STEEL3);
    else slab([fcol, 0, 0], [1, 0, 0], rCol, 0.12 * rCol, GLASS3, 0.22, GE3);
    if (foldOn) {
      // the fold covers the marginal rays where it stands: in the page the collimated beam's footprint, W / cos(AOI); along
      // the slit the beam's radius plus the slit ends' bundles, which cross the axis at the grating (the pupil), so they
      // stand off by hMax x (the fold's distance from the grating) / f_col, less than at the collimator
      const hL = 1.08 * W / 2 / Math.sin(phi / 2), hZ = 1.06 * (W / 2 + hMax * (1 - fPos) * d1 / fcol);
      const tf3 = n3(L3(Mf, [tf2[0], tf2[1], 0])), c = M3(Mf, [Cf[0], Cf[1], 0]);
      const nrm = n3(x3(tf3, [0, 0, 1])), back = d3(nrm, M3(Mf, [Cf[0] + nf[0], Cf[1] + nf[1], 0]).map((v, i) => v - c[i])) > 0 ? nrm : s3(nrm, -1);
      plate(c, tf3, [0, 0, 1], hL, hZ, s3(back, -1), 0.04 * W, MIRROR3, 0.6, STEEL3);
    }
    if (PR) {
      // the prisms: glass triangles extruded along the slit
      const zg = 1.04 * W / 2, tr = Dz.prism.train, same = tr.every(q => q.glass === tr[0].glass && q.A === tr[0].A), fa = v => +Number(v).toFixed(2) + "°";
      for (const T3 of PR.tris) {
        for (const z of [zg, -zg]) face(T3.map(q => Mp([q[0], q[1], z])), GLASS3, 0.25, GE3);
        for (let k = 0; k < 3; k++) { const p0 = T3[k], p1 = T3[(k + 1) % 3]; face([[p0, zg], [p1, zg], [p1, -zg], [p0, -zg]].map(([q, z]) => Mp([q[0], q[1], z])), GLASS3, 0.25, GE3); }
      }
      const ap = PR.tris[Math.floor(PR.tris.length / 2)][0];
      labs3.push([Mp([ap[0], ap[1], zg * 1.15]), tr.length > 1 ? tr.length + " prisms" : "prism", same ? fa(tr[0].A) + ", " + ((IX.GLASS[tr[0].glass] || {}).label || tr[0].glass) : tr.map(q => fa(q.A)).join(" + ")]);
    } else {
      const ext = 1.04, zg = ext * W / 2;
      const A0 = addv(Gc, sc(tg, -ext * W / (2 * Math.cos(a)))), A1 = addv(Gc, sc(tg, ext * W / (2 * Math.cos(a))));
      const glass = trans || grism, G3c = Mp([Gc[0], Gc[1], 0]), u3 = n3(a3(Mp([A1[0], A1[1], 0]), s3(G3c, -1)));
      const nIn = n3(x3(u3, [0, 0, 1]));                            // the grating normal (either side)
      if (grism && !Dz.grism.vph) {
        const e = Dz.grism.eps, Lh = Math.hypot(A1[0] - A0[0], A1[1] - A0[1]), E2 = addv(A1, sc(v2(-Math.sin(e), -Math.cos(e)), Lh * Math.cos(Dz.grism.A)));
        for (const z of [zg, -zg]) face([A1, A0, E2].map(q => Mp([q[0], q[1], z])), GLASS3, 0.25, GE3);
        face([[A1, zg], [E2, zg], [E2, -zg], [A1, -zg]].map(([q, z]) => Mp([q[0], q[1], z])), GLASS3, 0.25, GE3);
        face([[A0, zg], [E2, zg], [E2, -zg], [A0, -zg]].map(([q, z]) => Mp([q[0], q[1], z])), GLASS3, 0.25, GE3);
        face([[A0, zg], [A1, zg], [A1, -zg], [A0, -zg]].map(([q, z]) => Mp([q[0], q[1], z])), GLASS3, 0.3, GE3);
      } else plate(G3c, u3, [0, 0, 1], Math.hypot(A1[0] - A0[0], A1[1] - A0[1]) / 2, zg, nIn, 0.06 * W, glass ? GLASS3 : STEEL_RGB, glass ? 0.3 : 0.6, glass ? GE3 : STEEL3);
      // the grooves run along the slit
      for (let k = 1; k < 14; k++) { const q = addv(A0, sc(addv(A1, sc(A0, -1)), k / 14)); line(Mp([q[0], q[1], zg]), Mp([q[0], q[1], -zg]), rgba(rampRGB(k / 14), 0.85), 1); }
      labs3.push([Mp([Gc[0], Gc[1], zg * 1.15]), grism ? (Dz.grism.vph ? "VPH grism" : "grism") : trans ? "transmission grating" : "grating", "grooves ∥ slit"]);
    }
    slab(C3, zcW, rCam * 1.06, 0.12 * rCam, GLASS3, 0.22, GE3, Mp);
    const cam3 = Mp(C3);
    // detector: the chip, the spectrum of each slit point across it, the foci, and its two directions
    {
      const hx = Lx / 2, hy = Ly / 2, ex = L3(Mpost, xcW), ey = L3(Mpost, ycW), ez = n3(L3(Mpost, zcW));
      plate(Mp(Dc3), ex, ey, hx, hy, s3(ez, -1), 0.012 * Lx + 0.5, [51, 55, 61], 0.92, STEEL3);
      const off = s3(zcW, -0.4);
      for (const [z, tz] of slits) {
        let prev = null;
        for (let k = 0; k <= 40; k++) {
          const l = Dz.range[0] + (Dz.range[1] - Dz.range[0]) * k / 40, p = Dz.pos(l, Dz.order, 0, -z);
          if (!p) { prev = null; continue; }
          const q = Mp(a3(a3(Dc3, off), a3(s3(xcW, p[0]), s3(ycW, p[1]))));
          if (prev) line(prev, q, rgba(byS ? frampRGB(tz) : rampRGB(k / 40), 1), 2.6);
          prev = q;
        }
      }
      for (const [q, col] of foci) prims3.push({ k: "d", p: [q], col });
      const o = Mp(a3(Dc3, a3(s3(xcW, -1.12 * hx), s3(ycW, -1.12 * hy))));
      prims3.push({ k: "a", p: [o, a3(o, s3(ex, 0.5 * Lx))], txt: "λ" }, { k: "a", p: [o, a3(o, s3(ey, 0.5 * Ly))], txt: "slit" });
      labs3.push([Mp(a3(Dc3, s3(ycW, 1.35 * hy))), "detector", mm(Lx)]);
    }
    // the slit, along z
    line([0, 0, -1.08 * hMax], [0, 0, 1.08 * hMax], STEEL3, 3);
    for (const [z, t] of slits) prims3.push({ k: "d", p: [[0, 0, z]], col: byS ? frampRGB(t) : [96, 90, 84] });
    prims3.push({ k: "a", p: [[0, 0, 1.12 * hMax], [0, 0, 1.12 * hMax + 0.5 * W]], txt: "along the slit" });
    labs3.push([[0, 0, -1.25 * hMax], "slit", sig(P.slitW, 3) + "″"], [[-Lt, 0, 0], "telescope", "f/" + sig(P.F, 3)],
      [mirror ? [Cm[0], Cm[1], -rCol * 1.1] : [fcol, 0, -rCol * 1.1], "collimator", "f = " + mm(fcol)], [a3(cam3, [0, 0, -rCam * 1.15]), "camera f/" + sig(Dz.Fcam, 3), "f = " + mm(fcam)]);
    }
    // the view: a free rotation (R3, world -> view: screen right, screen up, toward the viewer) about the middle
    // of the scene, so a turn (which keeps the scale) leaves the instrument in place
    let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const p of pts3) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); }
    const cen = s3(a3(lo, hi), 0.5), R = R3.m;
    proj3 = p => { const d = [p[0] - cen[0], p[1] - cen[1], p[2] - cen[2]]; return [d3(R[0], d), d3(R[1], d), d3(R[2], d)]; };
    box3 = pts3.map(p => proj3(p).slice(0, 2));
    if (!ech) $("lSub").textContent = "drag to orbit, right- or shift-drag to pan, scroll to zoom, double-click to reset" + (P.preFoldOn ? "; the fold mirror before the collimator is drawn only in the Spectral view" : "");
  }
  // bounding box (post-collimator points through the fold)
  const pre = [v2(-Lt, tHalf), v2(-Lt, -tHalf), addv(Cm, sc(tm, 0.6 * W)), addv(Cm, sc(tm, -0.6 * W))];
  const post = [Fp, Fm, det0, det1, addv(C, sc(xd, lensHalf)), addv(C, sc(xd, -lensHalf)), ...beams.map(bm => bm.Q), ...(PR ? PR.tris.flat() : []),
    ...(MIR ? [MIR.arc[0], MIR.arc[MIR.arc.length - 1], addv(MIR.Mc, sc(ac, 0.04 * MIR.half)), ...MIR.dewar, addv(MIR.C2, sc(xd, MIR.half2)), addv(MIR.C2, sc(xd, -MIR.half2))] : [])].map(Mpost);
  if (foldOn) post.push(Mf(Qp), Mf(Qm));
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of view3d ? box3 : spatial ? SP.box : [...pre, ...post].map(R1)) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  // room for the labels at the sides, and below for the scale bar and caption at the panel's foot
  const mL = 64, mR = 100, mT = spatial || view3d ? 48 : 26, mB = 40;
  // the view: fitted to the panel (Auto scale, and whenever a fit is asked for), else held (Fixed scale)
  const sFit = Math.min((w - mL - mR) / (x1 - x0), (h - mT - mB) / (y1 - y0));
  const oxFit = mL + ((w - mL - mR) - sFit * (x1 - x0)) / 2 - sFit * x0, oyFit = mT + ((h - mT - mB) - sFit * (y1 - y0)) / 2 + sFit * y1;
  if (lview.fit || !(lview.s > 0) || (lview.mode === "auto" && !(view3d && turning3))) { lview.s = sFit; lview.ox = oxFit; lview.oy = oyFit; lview.fit = false; }
  const s = lview.s, ox = lview.ox, oy = lview.oy;
  spGeo = spatial && SP.free ? { hMax: SP.hMax, mag: SP.mag, Ly: SP.Ly, xD: SP.xD, s, ox, oy } : null;
  let fold = false;                                  // true while drawing what comes after the grating's fold(s)
  let noR1 = false;                                  // (true while drawing the pre-collimator fold itself)
  const T = p => { const q0 = fold ? Mpost(p) : p, q = noR1 ? q0 : R1(q0); return [ox + s * q[0], oy - s * q[1]]; };
  // (with a fold before the collimator: a polygon or path that crosses the mirror's line is cut there, so each part
  // is reflected or not as a whole; the cut points lie on the line, where the reflection leaves each point in place)
  const sideT = p => side1(fold ? Mpost(p) : p);
  const cutAt1 = (p, q) => { const a = sideT(p), b = sideT(q); return a * b < 0 ? addv(p, sc(addv(q, sc(p, -1)), a / (a - b))) : null; };
  const splitPoly = ps => {
    if (!preOn) return [ps];
    const A = [], B = [];
    ps.forEach((p, i) => { const q = ps[(i + 1) % ps.length], m = cutAt1(p, q); (sideT(p) <= 0 ? A : B).push(p); if (m) { A.push(m); B.push(m); } });
    return [A, B].filter(x => x.length > 2);
  };
  const poly = (ps0, fill, stroke, lw = 1) => {
    for (const ps of splitPoly(ps0)) {
      g.beginPath(); ps.forEach((p, i) => { const q = T(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath();
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
    }
  };
  const beam = (ps, fill) => { if (!hideRays) poly(ps, fill, null); };   // a beam's faint fill
  const line = (p, q, col, lw = 1, dash) => { const a1 = T(p), b1 = T(q); g.beginPath(); g.moveTo(a1[0], a1[1]); g.lineTo(b1[0], b1[1]); g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]); };
  // labels are collected and placed at the end: each tries its candidate positions in turn and takes
  // the first that does not overlap a label already placed (wavelength labels go first)
  const LB = [];
  // opt: { sub: muted details after the name, ital, optional: skip the label (and its mark) when it does not fit,
  // then: draws the label's mark once the label has a place }
  const req = (pri, txt, cands, col = INK, size = 13, opt = {}) => LB.push({ pri, txt, cands, col, size, ...opt });
  const ends = (q0, q1, up = 12, down = 14) => {   // above the upper end, below the lower end, then beside the middle
    const hi = q0[1] < q1[1] ? q0 : q1, lo = hi === q0 ? q1 : q0, mx = (q0[0] + q1[0]) / 2, my = (q0[1] + q1[1]) / 2;
    return [[hi[0], hi[1] - up, "center"], [lo[0], lo[1] + down, "center"], [mx - 10, my, "right"], [mx + 10, my, "left"]];
  };
  // ---- the drawing.  White light is drawn as gray rays and dispersed light as colored rays, one color per
  // wavelength (the ramp above), each wavelength's rays meeting at their focus on the detector.  The optics
  // follow the usual drawing conventions: glass shaded and outlined, mirrors hatched on the back.
  const NEU = [104, 98, 92], GLASS_EDGE = "#3f6d96", STEEL = "#33373d";
  // (the solid colored paths are the rays: kept for the light pulses, anim.js)
  const pulseRays = [];
  const path = (pts0, col, lw = 1, dash) => {
    const pts = !preOn ? pts0 : pts0.flatMap((p, i) => { const m = i ? cutAt1(pts0[i - 1], p) : null; return m ? [m, p] : [p]; });
    if (hideRays && !dash && typeof col === "string") { pulseRays.push({ p: pts.map(T), c: col }); return; }
    g.beginPath(); pts.forEach((p, i) => { const q = T(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
    g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]);
    if (!dash && typeof col === "string") pulseRays.push({ p: pts.map(T), c: col });
  };
  const glassFill = (q0, q1) => {
    const gr = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    gr.addColorStop(0, "rgba(118,176,222,0.55)"); gr.addColorStop(0.5, "rgba(205,232,250,0.68)"); gr.addColorStop(1, "rgba(118,176,222,0.55)");
    return gr;
  };
  const sheen = (q0, q1, a) => {                                  // a grating's colors along its ruled face
    const gr = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    for (let k = 0; k <= 4; k++) gr.addColorStop(k / 4, rgba(rampRGB(k / 4), a));
    return gr;
  };
  const hatch = (pts, back) => {                                  // short slanted ticks behind a mirror (screen px)
    g.beginPath();
    for (const p of pts) { const q = T(p), r = T(addv(addv(p, sc(back[0], 7 / s)), sc(back[1], 4.5 / s))); g.moveTo(q[0], q[1]); g.lineTo(r[0], r[1]); }
    g.strokeStyle = "rgba(51,55,61,0.75)"; g.lineWidth = 1; g.stroke();
  };
  const steel = (draw, q0, q1) => {                               // polished steel: dark rim, bright core
    draw(); g.strokeStyle = STEEL; g.lineWidth = 5.5; g.lineCap = "round"; g.stroke();
    const gr = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    gr.addColorStop(0, "#5d6670"); gr.addColorStop(0.42, "#dfe6ee"); gr.addColorStop(0.58, "#b9c3ce"); gr.addColorStop(1, "#56606a");
    draw(); g.strokeStyle = gr; g.lineWidth = 2.6; g.stroke(); g.lineCap = "butt";
  };
  const YS = [-0.5, -0.25, 0, 0.25, 0.5].map(f => f * W);        // ray heights across the collimated beam
  // lenses: a biconvex element as an optical drawing shows one, two convex faces joined by a flat rim of
  // finite edge thickness, tinted glass with a crisp outline
  const lens = (c, axis, half, name, sub, below) => {
    const perp2 = v2(-axis[1], axis[0]), q0 = T(addv(c, sc(perp2, half))), q1 = T(addv(c, sc(perp2, -half)));
    const ql = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) || 1, ax = [-(q1[1] - q0[1]) / ql, (q1[0] - q0[0]) / ql];
    const te = Math.max(2.5, 0.035 * ql), sag = Math.max(3, 0.09 * ql), mx = (q0[0] + q1[0]) / 2, my = (q0[1] + q1[1]) / 2;
    const off = (p, d) => [p[0] + ax[0] * d, p[1] + ax[1] * d];
    const a0 = off(q0, te / 2), a1 = off(q1, te / 2), b0 = off(q0, -te / 2), b1 = off(q1, -te / 2);
    const ka = off([mx, my], te / 2 + 2 * sag), kb = off([mx, my], -te / 2 - 2 * sag);  // quadratic controls: sag at the center
    g.beginPath(); g.moveTo(a0[0], a0[1]); g.quadraticCurveTo(ka[0], ka[1], a1[0], a1[1]);
    g.lineTo(b1[0], b1[1]); g.quadraticCurveTo(kb[0], kb[1], b0[0], b0[1]); g.closePath();
    const gr = g.createLinearGradient(...off([mx, my], te / 2 + sag), ...off([mx, my], -te / 2 - sag));
    gr.addColorStop(0, "rgba(150,196,232,0.5)"); gr.addColorStop(0.5, "rgba(196,225,246,0.5)"); gr.addColorStop(1, "rgba(150,196,232,0.5)");
    g.fillStyle = gr; g.fill(); g.strokeStyle = GLASS_EDGE; g.lineWidth = 1.3; g.lineJoin = "round"; g.stroke(); g.lineJoin = "miter";
    const cs = ends(q0, q1), hiE = q0[1] < q1[1] ? q0 : q1, loE = hiE === q0 ? q1 : q0;
    const far = [[hiE[0], hiE[1] - 28, "center"], [loE[0], loE[1] + 30, "center"]];   // farther out, before the middle
    req(3, name, below ? [cs[1], cs[0], far[1], far[0], cs[2], cs[3]] : [cs[0], cs[1], far[0], far[1], cs[2], cs[3]], INK, 13, { sub });
  };
  const wMark = (p0, p1) => {                                     // a dimension arrow for W, drawn when its label finds room
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1, ux = (p1[0] - p0[0]) / L, uy = (p1[1] - p0[1]) / L;
    const draw = () => {
      const head = (p, sgn) => { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] - sgn * (7 * ux - 3.2 * uy), p[1] - sgn * (7 * uy + 3.2 * ux)); g.lineTo(p[0] - sgn * (7 * ux + 3.2 * uy), p[1] - sgn * (7 * uy - 3.2 * ux)); g.closePath(); g.fill(); };
      g.strokeStyle = INK; g.fillStyle = INK; g.lineWidth = 1;
      g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
      head(p1, 1); head(p0, -1);
    };
    const hi = p0[1] < p1[1] ? p0 : p1, lo = hi === p0 ? p1 : p0;
    if (L > 24) req(1, "W", [[hi[0], hi[1] - 11, "center"], [lo[0], lo[1] + 12, "center"], [hi[0] + 8, hi[1] + 8, "left"], [hi[0] - 8, hi[1] + 8, "right"]], INK, 14, { sub: mm(W), ital: true, optional: true, then: draw });
  };
  if (view3d) {
    // ---- 3D view: everything projected and drawn back to front; faces shaded by their angle to a light from
    // the upper left, in front
    const S2 = p => { const q = proj3(p); return T([q[0], q[1]]); };
    // the light pulses (anim.js): four rays around each beam (a ring's quarter points, so a flipped grating still
    // meets them), with distances in mm along each ray in the world.  The telescope's light (its tubes marked tel)
    // starts the count; each later beam carries on from the earlier beam whose end lies nearest its start (the slit,
    // then the grating or the echelle), wherever that lies: a fold can put the grating behind the slit (Viaspec).
    {
      const rays3 = [];
      for (const b of beams3) {
        const n = Math.max(...b.st.map(s => s.length));
        for (let k = 0; k < n; k += Math.max(1, Math.round(n / 4))) rays3.push({ w: b.st.map(s => s[s.length === 1 ? 0 : k % s.length]), rgb: b.rgb, tel: b.tel });
      }
      const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
      rays3.forEach((r, i) => {
        r.s = window.ANIM ? window.ANIM.lengths(r.w) : [0];
        r.s0 = 0;
        if (r.tel) return;
        let best = Infinity;
        for (let j = 0; j < i; j++) {
          const q = rays3[j], dd = dist(r.w[0], q.w[q.w.length - 1]);
          if (dd < best) { best = dd; r.s0 = q.s0 + q.s[q.s.length - 1]; }
        }
      });
      for (const r of rays3) pulseRays.push({ p: r.w.map(S2), s: r.s, s0: r.s0, c: r.rgb });
    }
    const LT = [-0.42, 0.55, 0.72], shade = vs => {
      const u = [vs[1][0] - vs[0][0], vs[1][1] - vs[0][1], vs[1][2] - vs[0][2]], v = [vs[2][0] - vs[0][0], vs[2][1] - vs[0][1], vs[2][2] - vs[0][2]];
      const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], L = Math.hypot(...n) || 1;
      return 0.62 + 0.5 * Math.abs((n[0] * LT[0] + n[1] * LT[1] + n[2] * LT[2]) / L);
    };
    // WebGL (tel3dgl.js): the faces, beams, outlines and lines drawn on the GPU under this canvas, with this view's
    // mapping; the painter below then draws only the focus dots and the axis arrows (and all of it without WebGL)
    let gl = false;
    if (window.TEL3DGL && !/[?&]gl=0/.test(location.search)) {
      let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (const p of pts3) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); }
      gl = window.TEL3DGL.renderScene($("cvL"), [Dz, P, c3mode], () => prims3, { R: R3.m, cen: lo.map((v, i) => (v + hi[i]) / 2), s, ox, oy, w, h });
    }
    const items = [];
    const put = pr => { const vs = pr.p.map(proj3); items.push({ pr, vs, d: vs.reduce((s, q) => s + q[2], 0) / vs.length }); };
    for (const pr of prims3) {
      if (gl && pr.k !== "d" && pr.k !== "a") continue;
      if (pr.k !== "t") { put(pr); continue; }
      if (hideRays) continue;
      // a beam: its faces, its silhouette (the lengthwise edges between a face turned toward the viewer and one
      // turned away), and a faint ring where it meets each optic
      const st = pr.st, V = st.map(s => s.map(proj3)), dark = pr.rgb.map(x => x * 0.62);
      for (let i = 1; i < st.length; i++) {
        const A = st[i - 1], B = st[i], VA = V[i - 1], VB = V[i], n = Math.max(A.length, B.length);
        const facing = [];
        for (let k = 0; k < n; k++) {
          const k2 = (k + 1) % n, a0 = VA[A.length === 1 ? 0 : k], a1 = VA[A.length === 1 ? 0 : k2], b0 = VB[B.length === 1 ? 0 : k], b1 = VB[B.length === 1 ? 0 : k2];
          const ps = A.length === 1 ? [A[0], B[k], B[k2]] : B.length === 1 ? [A[k], A[k2], B[0]] : [A[k], A[k2], B[k2], B[k]];
          put({ k: "f", p: ps, rgb: pr.rgb, al: pr.al, flat: true });   // (light: one flat color, no facets)
          // the face's normal toward the viewer, from its two diagonals (works for triangles and quads)
          const u = A.length === 1 ? [b0[0] - a0[0], b0[1] - a0[1]] : [b1[0] - a0[0], b1[1] - a0[1]], v = A.length === 1 ? [b1[0] - a0[0], b1[1] - a0[1]] : [b0[0] - a1[0], b0[1] - a1[1]];
          facing.push(u[0] * v[1] - u[1] * v[0] > 0);
        }
        for (let k = 0; k < n; k++) if (facing[k] !== facing[(k + n - 1) % n])
          put({ k: "l", p: [A[A.length === 1 ? 0 : k], B[B.length === 1 ? 0 : k]], col: rgba(dark, 0.85), lw: 1.1 });
      }
      for (const s of st) if (s.length > 1) put({ k: "o", p: s, stroke: rgba(dark, 0.45), lw: 0.8 });
    }
    items.sort((u, v) => u.d - v.d);
    for (const { pr, vs } of items) {
      const q = pr.p.map(S2);
      if (pr.k === "f") {
        const b = pr.flat ? 1 : shade(vs), c = pr.rgb.map(x => Math.min(255, x * b));
        g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath();
        g.fillStyle = rgba(c, pr.al); g.fill();
        if (pr.stroke) { g.strokeStyle = pr.stroke; g.lineWidth = pr.lw; g.stroke(); }
      } else if (pr.k === "o") { g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.strokeStyle = pr.stroke; g.lineWidth = pr.lw; g.stroke(); }
      else if (pr.k === "l") { g.beginPath(); g.moveTo(q[0][0], q[0][1]); g.lineTo(q[1][0], q[1][1]); g.strokeStyle = pr.col; g.lineWidth = pr.lw; g.lineCap = "round"; g.stroke(); g.lineCap = "butt"; }
      else if (pr.k === "d") { g.beginPath(); g.arc(q[0][0], q[0][1], 3.4, 0, 2 * Math.PI); g.fillStyle = rgba(pr.col, 1); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 1.4; g.stroke(); }
      else if (pr.k === "a" && P.annot !== false) {
        const [p0, p1] = q, L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        if (L < 6) continue;
        const ux = (p1[0] - p0[0]) / L, uy = (p1[1] - p0[1]) / L;
        g.strokeStyle = INK; g.fillStyle = INK; g.lineWidth = 1.3;
        g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
        g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p1[0] - 8 * ux + 3.5 * uy, p1[1] - 8 * uy - 3.5 * ux); g.lineTo(p1[0] - 8 * ux - 3.5 * uy, p1[1] - 8 * uy + 3.5 * ux); g.closePath(); g.fill();
        req(0, pr.txt, [[p1[0] + 9 * ux, p1[1] + 9 * uy, ux >= 0 ? "left" : "right"], [p1[0], p1[1] - 11, "center"], [p1[0], p1[1] + 12, "center"]], INK, 13.5, { ital: pr.txt === "λ" });
      }
    }
    for (const [p, name, sub] of labs3) { const q = S2(p); req(3, name, [[q[0], q[1], "center"], [q[0], q[1] - 16, "center"], [q[0], q[1] + 16, "center"], [q[0] + 10, q[1], "left"], [q[0] - 10, q[1], "right"]], INK, 13, { sub }); }
  } else if (spatial) {
    // ---- Spatial view
    const { Ly, hMax, xG, xC, xD, fields } = SP, mmAs = P.D * 1000 * P.F / 206265;   // mm per arcsec at the slit
    const ang = x => (Math.abs(x) >= 60 ? sig(Math.abs(x) / 60, 3) + "′" : sig(Math.abs(x), 3) + "″");
    path([v2(-Lt, 0), v2(xD + 0.05 * fcam, 0)], "rgba(51,55,61,0.4)", 1, [12, 4, 2, 4]);          // the optical axis
    // starlight converging on each point of the slit
    for (const f of fields) {
      const sl = (f.yL - f.h) / fcol;
      beam([v2(-Lt, f.h - sl * Lt + tHalf), v2(0, f.h), v2(-Lt, f.h - sl * Lt - tHalf)], "rgba(236,186,72,0.13)");
      path([v2(-Lt, f.h - sl * Lt), v2(0, f.h)], "rgba(168,118,22,0.6)", 0.9);
    }
    { const f = fields[0], q = T(v2(-Lt, f.h - (f.yL - f.h) / fcol * Lt)); req(5, "telescope", [[q[0] + 2, q[1] - tHalf * s - 12, "left"], [q[0] + 2, q[1] + tHalf * s + 12, "left"]], INK, 13, { sub: "f/" + sig(P.F, 3) }); }
    // the light from each point: a faint band and three rays (the pupil's edges and center) through to the detector
    for (const f of fields) {
      const c = frampRGB(f.t), Y = f.m * fcam, P1 = y => v2(fcol, f.yL + y), P3 = y => v2(xC, y + f.m * d2);
      beam([v2(0, f.h), P1(W / 2), P1(-W / 2)], rgba(c, 0.05));
      beam([P1(W / 2), P3(W / 2), v2(xD, Y), P3(-W / 2), P1(-W / 2)], rgba(c, 0.05));
    }
    for (const f of fields) for (const y of [-W / 2, W / 2, 0]) {
      const Y = f.m * fcam;
      path([v2(0, f.h), v2(fcol, f.yL + y), v2(xG, y), v2(xC, y + f.m * d2), v2(xD, Y)], rgba(frampRGB(f.t), y ? 0.6 : 0.95), y ? 0.9 : 1.5);
    }
    // the slit seen along its length, each point marked
    {
      const q0 = T(v2(0, hMax)), q1 = T(v2(0, -hMax));
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = "rgba(51,55,61,0.35)"; g.lineWidth = 1; g.stroke();   // the opening
      g.fillStyle = STEEL; g.fillRect(q0[0] - 2, q0[1] - 12, 4, 10); g.fillRect(q1[0] - 2, q1[1] + 2, 4, 10);
      if (SP.free) { const q = T(v2(0, fields[0].h)); g.beginPath(); g.arc(q[0], q[1], 6.5, 0, 2 * Math.PI); g.strokeStyle = rgba(frampRGB(fields[0].t), 0.9); g.lineWidth = 1.5; g.stroke(); }   // the drag handle
      for (const f of fields) { const q = T(v2(0, f.h)); g.beginPath(); g.arc(q[0], q[1], 2.6, 0, 2 * Math.PI); g.fillStyle = rgba(frampRGB(f.t), 1); g.fill(); }
      req(5, "slit", [[q1[0], q1[1] + 22, "center"], [q0[0], q0[1] - 22, "center"]], INK, 13, { sub: ang(2 * hMax / mmAs) + " long" });
    }
    lens(v2(fcol, 0), v2(1, 0), SP.colHalf, "collimator", "f = " + mm(fcol), true);
    // the grating from the side: the ruled face foreshortened to W tan α along the axis, the grooves running along the slit
    {
      // (prisms: a glass block as long as the central ray's path through the glass, half the glass base at minimum
      // deviation, unfolded onto the axis)
      const hw = PR ? Math.max(Math.min(Dz.Lg / 4, 0.3 * (SP.xC - xG)), 3 / s) : Math.max(W * Math.abs(Math.tan(grism ? Dz.grism.A : a)) / 2, 3 / s), hh = 0.53 * W;
      const G0 = v2(xG - hw, hh), G1 = v2(xG + hw, hh), G2 = v2(xG + hw, -hh), G3 = v2(xG - hw, -hh);
      const glassy = trans || grism || !!PR;
      poly([G0, G1, G2, G3], glassy ? glassFill(T(G0), T(G1)) : "rgba(51,55,61,0.32)", glassy ? GLASS_EDGE : STEEL, 1.2);
      g.beginPath();
      if (!PR) for (let k = 1; k < 12; k++) { const x = xG - hw + 2 * hw * k / 12, r0 = T(v2(x, hh)), r1 = T(v2(x, -hh)); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); }
      g.strokeStyle = glassy ? "rgba(63,109,150,0.5)" : "rgba(51,55,61,0.55)"; g.lineWidth = 0.8; g.stroke();
      const tq = T(v2(xG, hh)), bq = T(v2(xG, -hh));
      req(3, PR ? (Dz.prism.train.length > 1 ? Dz.prism.train.length + " prisms" : "prism") : grism ? (Dz.grism.vph ? "VPH grism" : "grism") : trans ? "transmission grating" : "grating", [[tq[0], tq[1] - 12, "center"], [bq[0], bq[1] + 14, "center"], [tq[0], tq[1] - 28, "center"], [bq[0], bq[1] + 30, "center"]], INK, 13, { sub: "at the pupil" });
    }
    wMark(T(v2(xG - Math.max(0.2 * d1, 1.5 * W * Math.abs(Math.tan(a))), -W / 2)), T(v2(xG - Math.max(0.2 * d1, 1.5 * W * Math.abs(Math.tan(a))), W / 2)));
    lens(v2(xC, 0), v2(1, 0), SP.camHalf, "camera f/" + sig(Dz.Fcam, 3), "f = " + mm(fcam), false);
    // the detector seen edge-on along the slit: the image of the slit, inverted, with each point's focus
    {
      const d0 = v2(xD, Ly / 2), d1p = v2(xD, -Ly / 2), dep = 6 / s;
      poly([d0, d1p, addv(d1p, v2(dep, 0)), addv(d0, v2(dep, 0))], STEEL, null);
      const q0 = T(d0), q1 = T(d1p), gr = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
      for (let k = 0; k <= 4; k++) gr.addColorStop(k / 4, rgba(frampRGB(1 - k / 4), 1));      // top of the chip = bottom of the slit
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = gr; g.lineWidth = 3.5; g.stroke();
      for (const f of fields) {
        const q = T(v2(xD, f.m * fcam));
        g.beginPath(); g.arc(q[0], q[1], 3.4, 0, 2 * Math.PI); g.fillStyle = rgba(frampRGB(f.t), 1); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 1.5; g.stroke();
      }
      const lp = T(v2(xD, 0));
      const lo = q0[1] > q1[1] ? q0 : q1, hi = lo === q0 ? q1 : q0;
      req(2, "detector", [[lo[0], lo[1] + 18, "center"], [hi[0], hi[1] - 16, "center"], [lo[0], lo[1] + 34, "center"], [lp[0] + 14, lp[1], "left"]], INK, 13, { sub: mm(Ly) });
      // the ends of the slit, as offsets on the sky from its center
      for (const f of SP.free ? fields : [fields[0], fields[fields.length - 1]]) {
        const q = T(v2(xD, f.m * fcam)), up = f.m * fcam > 0;
        req(0, (f.h > 1e-9 ? "+" : f.h < -1e-9 ? "−" : "") + ang(f.h / mmAs), [[q[0] + 9, q[1] + (up ? -10 : 10), "left"], [q[0] + 9, q[1] + (up ? 10 : -10), "left"]], INK, 12.5);
      }
    }
  } else {
  // telescope (or fiber) beam converging on the slit: starlight
  beam([v2(-Lt, tHalf), v2(0, 0), v2(-Lt, -tHalf)], "rgba(236,186,72,0.18)");
  for (const f of [-1, 0, 1]) path([v2(-Lt, f * tHalf), v2(0, 0)], "rgba(168,118,22,0.8)", 1);
  { const q = T(v2(-Lt, 0)); req(5, P.feedLabel || "telescope", [[q[0] + 2, q[1] - tHalf * s - 12, "left"], [q[0] + 2, q[1] + tHalf * s + 12, "left"]], INK, 13, { sub: "f/" + sig(P.F, 3) }); }
  // white light: diverging from the slit to the collimator, then parallel to the grating (by way of the fold)
  const onCol = y => onMirror(y / Math.cos(tau));
  const gPt = y => (PR ? PR.chain(P.gFlip ? -y : y)[0] : addv(Gc, sc(tg, (P.gFlip ? -y : y) / Math.cos(a))));   // meets the grating (a prism's first face) at height y, before Mpost
  const WL = rgba(NEU, 0.62);
  beam([v2(0, 0), Pp, Pm], rgba(NEU, 0.06));
  for (const y of YS) path([v2(0, 0), onCol(y)], WL, 0.9);
  if (foldOn) {
    const Qy = y => addv(Cf, sc(tf2, y / Math.sin(phi / 2)));
    beam([Pp, Mf(Qp), Mf(Qm), Pm], rgba(NEU, 0.07));
    beam([Mf(Qp), Mpost(Ga), Mpost(Gb), Mf(Qm)], rgba(NEU, 0.07));
    for (const y of YS) path([onCol(y), Mf(Qy(y)), Mpost(gPt(y))], WL, 0.9);
  } else {
    beam([Pp, Mpost(Ga), Mpost(Gb), Pm], rgba(NEU, 0.07));
    for (const y of YS) path([onCol(y), Mpost(gPt(y))], WL, 0.9);
  }
  // the beam diameter W, marked across the collimated beam
  wMark(T(Mf(v2(fcol + 0.35 * (foldOn ? fPos : 1) * d1, -W / 2))), T(Mf(v2(fcol + 0.35 * (foldOn ? fPos : 1) * d1, W / 2))));
  fold = true;
  // dispersed light: per wavelength a faint band and three rays (the beam's two edges and its center) from the
  // grating through the camera to their common focus on the detector
  const gPt0 = y => (PR ? PR.last(PR.chain(y)) : addv(Gc, sc(tg, y / Math.cos(a))));
  if (PR) {
    // white light through the prisms, along the central wavelength's path, between the faces in turn
    const cp = PR.chain(W / 2), cm = PR.chain(-W / 2);
    for (let j = 0; j + 1 < cp.length; j++) beam([cp[j], cp[j + 1], cm[j + 1], cm[j]], rgba(NEU, 0.08));
    for (const y of YS) path(PR.chain(P.gFlip ? -y : y), rgba(NEU, 0.62), 0.9);
  }
  if (MIR) {
    // a mirror camera: each wavelength's bundle runs through the corrector to the mirror, less the dewar's shadow,
    // and comes back as a hollow cone to its focus on the detector (canvas clip + even-odd fill cut the shadow out)
    const cut = (outer, inner, fill) => {
      const trace = ps => ps.forEach((p, i) => { const q = T(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
      g.save(); g.beginPath(); trace(outer); g.closePath(); g.clip();
      g.beginPath(); trace(outer); g.closePath(); trace(inner); g.closePath(); g.fillStyle = fill; g.fill("evenodd"); g.restore();
    };
    for (const r of rays) {
      const c = rampRGB(r.t), Ma = MIR.mhit(Fp, r.b), Mb = MIR.mhit(Fm, r.b), sh = MIR.shadow(r.b);
      if (!hideRays) { cut([Fp, Ma, Mb, Fm], sh, rgba(c, 0.045)); cut([Ma, r.Q, Mb], [sh[2], r.Q, sh[3]], rgba(c, 0.07)); }
    }
    // the rays: on to the mirror and back to the focus, or stopped where they meet the dewar
    const ray = (F0, r, col, lw) => { const B = MIR.block(F0, r.b); path(B ? [F0, B] : [F0, MIR.mhit(F0, r.b), r.Q], col, lw); };
    for (const r of rays) for (const y of [-W / 2, W / 2]) ray(gPt0(y), r, rgba(rampRGB(r.t), 0.6), 0.9);
    for (const r of rays) ray(Gc, r, rgba(rampRGB(r.t), 0.95), 1.5);
  } else {
    for (const r of rays) {
      const c = rampRGB(r.t), Ea = hit(Fp, r.b), Eb = hit(Fm, r.b);
      beam([Fp, Ea, Eb, Fm], rgba(c, 0.045));
      beam([Ea, r.Q, Eb], rgba(c, 0.07));
    }
    for (const r of rays) for (const y of [-W / 2, W / 2]) { const F0 = gPt0(y); path([F0, hit(F0, r.b), r.Q], rgba(rampRGB(r.t), 0.6), 0.9); }
    for (const r of rays) path([Gc, hit(Gc, r.b), r.Q], rgba(rampRGB(r.t), 0.95), 1.5);
  }
  fold = false;
  // slit: two jaws
  {
    const q = T(v2(0, 0)); g.fillStyle = STEEL; g.fillRect(q[0] - 2, q[1] - 10, 4, 7.5); g.fillRect(q[0] - 2, q[1] + 2.5, 4, 7.5);
    req(5, "slit", [[q[0], q[1] + 21, "center"], [q[0], q[1] - 21, "center"]], INK, 13, { sub: sig(P.slitW, 3) + "″" });
  }
  // an order-sorting filter just past the slit (P.filtShow, drawing only: M2FS's in front of the fiber ends, Mateo et al.
  // 2012 Sec. 2.2; Hectochelle's at the fiber slit, Szentgyorgyi et al. 2011 Fig. 2)
  if (P.filtShow && Array.isArray(P.filt)) {
    const xf = 0.06 * fcol, hf = xf / (2 * P.F) * 1.8 + 0.03 * W, a = T(v2(xf, hf)), b = T(v2(xf, -hf));
    g.save(); g.lineCap = "butt"; g.strokeStyle = "rgba(60,96,128,0.85)"; g.lineWidth = 5; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    g.strokeStyle = "rgba(170,206,236,0.95)"; g.lineWidth = 3; g.stroke(); g.restore();
    req(6, "order filter", ends(a, b), INK, 12, { sub: grp(P.filt[0]) + "–" + grp(P.filt[1]) + " Å" });
  }
  if (mirror) {
    // a concave mirror facing the slit, hatched on the back
    const e0 = T(onMirror(halfM)), e1 = T(onMirror(-halfM)), cc = T(addv(Cm, sc(nm, -sagM)));   // quadratic Bezier = the parabola
    const nH = Math.max(6, Math.round(Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) / 7));
    hatch(Array.from({ length: nH + 1 }, (_, k) => onMirror(halfM * (1 - 2 * k / nH))), [sc(nm, -1), tm]);
    steel(() => { g.beginPath(); g.moveTo(e0[0], e0[1]); g.quadraticCurveTo(cc[0], cc[1], e1[0], e1[1]); }, e0, e1);
    const cs = ends(e0, e1);
    req(3, "collimator", [cs[1], cs[0], cs[2], cs[3]], INK, 13, { sub: "f = " + mm(fcol) });
  } else if (dpass) {
    let lo = -W / 2, hi = W / 2;
    for (const bm of beams) for (const E of [bm.Ep, bm.Em]) { const y = Mpost(E)[1]; lo = Math.min(lo, y); hi = Math.max(hi, y); }
    lens(v2(fcol, (lo + hi) / 2), v2(1, 0), (hi - lo) / 2 * 1.06, "collimator and camera f/" + sig(Dz.Fcam, 3), "f = " + mm(fcam), true);
  } else lens(v2(fcol, 0), v2(1, 0), W / 2 * 1.06, "collimator", "f = " + mm(fcol), true);
  if (preOn) {
    // the fold before the collimator: a flat on its line, hatched on the back (the collimator's side before the fold)
    noR1 = true;
    const u1 = 1.08 * Math.max(W / 2, (C1[0] / (2 * P.F))) / Math.max(0.2, Math.sin(phi1));
    const f0 = T(addv(C1, sc(t1, u1))), f1 = T(addv(C1, sc(t1, -u1)));
    const nH = Math.max(6, Math.round(Math.hypot(f1[0] - f0[0], f1[1] - f0[1]) / 7));
    hatch(Array.from({ length: nH + 1 }, (_, k) => addv(C1, sc(t1, u1 * (1 - 2 * k / nH)))), [n1, t1]);
    steel(() => { g.beginPath(); g.moveTo(f0[0], f0[1]); g.lineTo(f1[0], f1[1]); }, f0, f1);
    req(4, "fold mirror", ends(f0, f1));
    noR1 = false;
  }
  if (foldOn) {
    // the flat fold mirror, hatched on the back (the side away from the arriving beam)
    const ext = 1.08 / Math.sin(phi / 2), u0 = W / 2 * ext;
    const f0 = T(Mf(addv(Cf, sc(tf2, u0)))), f1 = T(Mf(addv(Cf, sc(tf2, -u0))));
    const nH = Math.max(6, Math.round(Math.hypot(f1[0] - f0[0], f1[1] - f0[1]) / 7));
    const Mlin = p => addv(Mf(p), sc(Mf(v2(0, 0)), -1));          // Mf acting on a direction
    hatch(Array.from({ length: nH + 1 }, (_, k) => Mf(addv(Cf, sc(tf2, u0 * (1 - 2 * k / nH))))), [Mlin(nf), Mlin(tf2)]);
    steel(() => { g.beginPath(); g.moveTo(f0[0], f0[1]); g.lineTo(f1[0], f1[1]); }, f0, f1);
    req(4, P.foldLabel || "fold mirror", ends(f0, f1));
  }
  fold = true;
  if (ech && XDc) {
    // cross-disperser: drawn across the camera beam; it disperses out of the page
    const pp = v2(-ac[1], ac[0]);
    let half = 0;
    for (const bm of beams) for (const F of [Fp, Fm]) { const t = dt(addv(XDc, sc(F, -1)), ac) / dt(bm.b, ac); const E = addv(F, sc(bm.b, t)); half = Math.max(half, Math.abs(dt(addv(E, sc(XDc, -1)), pp))); }
    if (dpass) for (const y of [-W / 2, W / 2]) {               // the incoming beam crosses the prism too
      const E = v2(XDc[0] - (y - XDc[1]) * ac[1] / ac[0], y);
      half = Math.max(half, Math.abs(dt(addv(E, sc(XDc, -1)), pp)));
    }
    half *= 1.08;
    const th = Math.max(0.05 * half, 5 / s);
    const c0 = addv(XDc, sc(pp, half)), c1 = addv(XDc, sc(pp, -half));
    const q0 = T(c0), q1 = T(c1);
    if (P.xd === "prism") poly([c0, c1, addv(c1, sc(ac, th)), addv(c0, sc(ac, th))], glassFill(q0, q1), GLASS_EDGE, 1.2);
    else {
      poly([c0, c1, addv(c1, sc(ac, th)), addv(c0, sc(ac, th))], P.xd === "grating" ? STEEL : glassFill(q0, q1), P.xd === "grating" ? null : GLASS_EDGE, 1.2);
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = sheen(q0, q1, 0.95); g.lineWidth = 2; g.stroke();
    }
    req(4, "cross-disperser", ends(q0, q1), INK, 13, { sub: P.xd === "prism" ? null : grooves(P.xG) + (P.xdEq ? ", " + P.xdEq : "") });
  }
  if (!MIR) { if (!dpass) lens(C, ac, lensHalf, "camera f/" + sig(Dz.Fcam, 3), "f = " + mm(fcam) + (P.camEq ? ", " + P.camEq : ""), false); }   // double pass: the collimator lens
  else {
    // a thin element across the axis at c (light arriving along +axis): the front face bulges toward the light by
    // sagA, the back face by sagB away from the light (sagB < 0: toward the light, a meniscus); fractions of the
    // element's length on the screen, edge thickness teF likewise
    const element = (c, axis, half, sagA, sagB, teF) => {
      const perp2 = v2(-axis[1], axis[0]), q0 = T(addv(c, sc(perp2, half))), q1 = T(addv(c, sc(perp2, -half)));
      const o = T(c), o1 = T(addv(c, sc(axis, 10 / s))), al = Math.hypot(o1[0] - o[0], o1[1] - o[1]) || 1, ax = [(o1[0] - o[0]) / al, (o1[1] - o[1]) / al];
      const ql = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) || 1, te = Math.max(2, teF * ql), mx = (q0[0] + q1[0]) / 2, my = (q0[1] + q1[1]) / 2;
      const off = (p, d) => [p[0] + ax[0] * d, p[1] + ax[1] * d];
      const a0 = off(q0, -te / 2), a1 = off(q1, -te / 2), b0 = off(q0, te / 2), b1 = off(q1, te / 2);
      const ka = off([mx, my], -te / 2 - 2 * sagA * ql), kb = off([mx, my], te / 2 + 2 * sagB * ql);
      g.beginPath(); g.moveTo(a0[0], a0[1]); g.quadraticCurveTo(ka[0], ka[1], a1[0], a1[1]);
      g.lineTo(b1[0], b1[1]); g.quadraticCurveTo(kb[0], kb[1], b0[0], b0[1]); g.closePath();
      const gr = g.createLinearGradient(...off([mx, my], -te), ...off([mx, my], te));
      gr.addColorStop(0, "rgba(150,196,232,0.5)"); gr.addColorStop(0.5, "rgba(196,225,246,0.5)"); gr.addColorStop(1, "rgba(150,196,232,0.5)");
      g.fillStyle = gr; g.fill(); g.strokeStyle = GLASS_EDGE; g.lineWidth = 1.2; g.lineJoin = "round"; g.stroke(); g.lineJoin = "miter";
      return [q0, q1];
    };
    // the corrector: a weak biconvex lens, then a meniscus convex toward the grating (as in Hectospec and Hectochelle)
    const k1 = element(C, ac, lensHalf, 0.03, 0.012, 0.05);
    element(MIR.C2, ac, MIR.half2, 0.022, -0.04, 0.06);
    req(4, "corrector", ends(k1[0], k1[1]), INK, 13, { optional: true });
    // the spherical mirror, facing the corrector, hatched on the back
    const arcS = MIR.arc.map(T), e0 = arcS[0], e1 = arcS[arcS.length - 1];
    const nH = Math.max(6, Math.round(Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) / 7));
    hatch(Array.from({ length: nH + 1 }, (_, k) => MIR.arc[Math.round(k * (MIR.arc.length - 1) / nH)]), [ac, xd]);
    steel(() => { g.beginPath(); arcS.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); }, e0, e1);
    { const cs = ends(e0, e1); req(3, "camera f/" + sig(Dz.Fcam, 3), [cs[0], cs[1], cs[2], cs[3]], INK, 13, { sub: "f = " + mm(fcam) }); }
    // the dewar inside the beam, behind the detector, and the field flattener (its window) in front of the detector
    poly(MIR.dewar, "rgba(64,69,76,0.88)", STEEL, 1);
    element(MIR.Fl, sc(ac, -1), 0.85 * Lx / 2 * 1.25, 0.16, -0.05, 0.08);
  }
  // grating: true length and angle; a reflection grating's facets drawn schematically (12 teeth), a
  // transmission grating as a plate with its rulings running through it
  const n2 = v2(-Math.cos(a), Math.sin(a));
  if (PR) {
    // the prisms: glass triangles, named by number, apex and glass
    for (const tri of PR.tris) poly(tri, glassFill(T(tri[1]), T(tri[2])), GLASS_EDGE, 1.2);
    const tr = Dz.prism.train, same = tr.every(q => q.glass === tr[0].glass && q.A === tr[0].A);
    const nm = q => (IX.GLASS[q.glass] || {}).label || q.glass, qs = PR.tris.flat().map(T), fa = v => +Number(v).toFixed(2) + "°";
    const top = qs.reduce((u, q) => (q[1] < u[1] ? q : u)), bot = qs.reduce((u, q) => (q[1] > u[1] ? q : u));
    req(3, tr.length > 1 ? tr.length + " prisms" : "prism", ends(top, bot), INK, 13, { sub: same ? fa(tr[0].A) + ", " + nm(tr[0]) : tr.map(q => fa(q.A)).join(" + ") });
  } else {
    const ext = 1.04;
    const A0 = addv(Gc, sc(tg, -ext * W / (2 * Math.cos(a)))), A1 = addv(Gc, sc(tg, ext * W / (2 * Math.cos(a))));
    const q0 = T(A0), q1 = T(A1);
    if (grism) {
      const Ap = Dz.grism.A;
      if (!Dz.grism.vph) {
        // the prism: its ruled hypotenuse A0-A1 (A1 the thin, upper end), the entrance face from A1 at the apex
        // angle, square to the beam unless tilted by eps (FORS), the base at right angles to the entrance face
        const e = Dz.grism.eps, Lh = Math.hypot(A1[0] - A0[0], A1[1] - A0[1]);
        const E = addv(A1, sc(v2(-Math.sin(e), -Math.cos(e)), Lh * Math.cos(Ap)));
        poly([A1, A0, E], glassFill(T(A1), T(E)), GLASS_EDGE, 1.2);
      } else {
        // two prisms of apex A meeting along the VPH layer, which stands square to the beam through Gc
        const hh = 0.52 * W * ext, d = 2 * hh * Math.tan(Ap), V1 = v2(Gc[0], Gc[1] + hh), V2 = v2(Gc[0], Gc[1] - hh);
        poly([V1, v2(Gc[0] + d, Gc[1] - hh), v2(Gc[0] - d, Gc[1] - hh)], glassFill(T(v2(Gc[0] - d, Gc[1])), T(v2(Gc[0] + d, Gc[1]))), GLASS_EDGE, 1.2);
        line(V1, V2, "rgba(63,109,150,0.7)", 1);
      }
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = sheen(q0, q1, 0.95); g.lineWidth = 1.8; g.stroke();
    } else if (trans) {
      const th = Math.max(0.08 * Dz.Lg, 6 / s);
      poly([A0, A1, addv(A1, sc(n2, -th)), addv(A0, sc(n2, -th))], glassFill(q0, q1), GLASS_EDGE, 1.2);
      g.beginPath();
      for (let k = 1; k < 18; k++) { const p = addv(A0, sc(addv(A1, sc(A0, -1)), k / 18)), r0 = T(p), r1 = T(addv(p, sc(n2, -th))); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); }
      g.strokeStyle = "rgba(63,109,150,0.55)"; g.lineWidth = 0.8; g.stroke();
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = sheen(q0, q1, 0.9); g.lineWidth = 1.6; g.stroke();
    } else {
      // 12 schematic grooves at the true blaze angle: each blaze facet (length ds cos(delta)) has its normal
      // tipped by delta from the grating normal toward the incoming beam (the bisector of the incident and
      // diffracted directions), the riser (ds sin(delta)) at right angles to it
      const nT = 12, L = Dz.Lg * ext, ds = L / nT;
      const dl = Dz.delta !== null && isFinite(Dz.delta) ? Dz.delta : a;
      const ps = [];
      for (let k = 0; k <= nT; k++) {
        const base = addv(A0, sc(tg, ds * k));
        ps.push(base);
        if (k < nT) ps.push(addv(addv(base, sc(tg, ds * Math.sin(dl) ** 2)), sc(n2, -ds * Math.sin(dl) * Math.cos(dl))));
      }
      const back = sc(n2, -Math.max(ds * Math.sin(dl) * Math.cos(dl) * 1.6, 0.025 * L));
      poly([...ps, addv(A1, back), addv(A0, back)], STEEL, null);
      path(ps, sheen(q0, q1, 0.95), 1.4);
    }
    const gsub = grooves(ech ? P.eG : P.G) + (grism ? ", A = " + (Dz.grism.A / IX.DEG).toFixed(1) + "°" : "");
    req(3, ech ? "echelle" : grism ? (Dz.grism.vph ? "VPH grism" : "grism") : trans ? "transmission grating" : "grating", ends(q0, q1), INK, 13, { sub: gsub });
  }
  // the grating normal, and the angles of incidence and diffraction of the central wavelength (grating mode;
  // the echelle drawing is schematic; a grism passes λ0 straight through)
  if (!ech && !grism && !PR) {
    const Ln = Math.max(0.6 * W, 52 / s);
    if (P.annot !== false) path([addv(Gc, sc(n2, Ln)), addv(Gc, sc(n2, -Ln))], "rgba(51,55,61,0.6)", 1, [5, 4]);
    const arc = (u0, u1, rpx, txt) => {
      const r = rpx / s, t0 = Math.atan2(u0[1], u0[0]);
      let d = Math.atan2(u1[1], u1[0]) - t0;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      if (Math.abs(d) < 0.02) return;
      const pts = Array.from({ length: 25 }, (_, k) => addv(Gc, v2(r * Math.cos(t0 + d * k / 24), r * Math.sin(t0 + d * k / 24))));
      const tm = t0 + d / 2, q = T(addv(Gc, v2((r + 11 / s) * Math.cos(tm), (r + 11 / s) * Math.sin(tm))));
      const scr = pts.map(T);                                      // screen points now: the label stage runs with fold off
      req(1, txt, [[q[0], q[1], "center"]], INK, 15, { ital: true, optional: true,
        then: () => { g.beginPath(); scr.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.strokeStyle = INK; g.lineWidth = 1.1; g.stroke(); } });
    };
    const rA = Math.min(40, Math.max(16, 0.42 * W * s));
    arc(v2(-1, 0), n2, rA, "α");
    arc(ac, trans ? sc(n2, -1) : n2, rA + 12, "β");
  }
  // detector: the chip (its package behind the face), the spectrum along its face, and the focus of each wavelength
  {
    const dep = 6 / s;
    const back = MIR ? -dep : dep;                                 // the package lies away from the arriving light
    poly([det0, det1, addv(det1, sc(ac, back)), addv(det0, sc(ac, back))], STEEL, null);
    const q0 = T(det0), q1 = T(det1), gr = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    for (const r of rays) gr.addColorStop(Math.min(1, Math.max(0, (r.X + Lx / 2) / Lx)), rgba(rampRGB(r.t), 1));
    g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = rays.length ? gr : INK; g.lineWidth = 3.5; g.stroke();
    for (const r of rays) {
      const q = T(r.Q);
      g.beginPath(); g.arc(q[0], q[1], 3.4, 0, 2 * Math.PI); g.fillStyle = rgba(rampRGB(r.t), 1); g.fill();
      g.strokeStyle = "#fff"; g.lineWidth = 1.5; g.stroke();
    }
    // the label beyond the package (with a mirror camera, beyond the dewar's far end, toward the corrector)
    const lp = T(MIR ? addv(Dc, sc(ac, -MIR.dewL)) : Dc), off = T(addv(Dc, sc(ac, MIR ? -MIR.dewL - 0.06 * fcam : 0.06 * fcam)));
    const dx = off[0] - lp[0], dy = off[1] - lp[1], n = Math.hypot(dx, dy) || 1;
    req(2, "detector", [[lp[0] + dx / n * 14, lp[1] + dy / n * 14, dx > 0 ? "left" : "right"], ...ends(q0, q1, 14, 16)], INK, 13, { sub: mm(Lx) });
  }
  // wavelength labels at the detector ends
  for (const bm of beams) {
    if (bm.k === "c") continue;
    const q = T(bm.Q), out = T(addv(bm.Q, sc(xd, (bm.X >= 0 ? 1 : -1) * 0.04 * Lx + 1e-9)));
    const dx = out[0] - q[0], dy = out[1] - q[1], n = Math.hypot(dx, dy) || 1;
    req(0, fA(bm.l) + " Å", [[q[0] + dx / n * 10, q[1] + dy / n * 10, dx >= 0 ? "left" : "right"]], INK, 12.5);
  }
  }  // spectral view
  fold = false;
  const capEl = $("lSub");
  capEl.hidden = P.annot === false || !capEl.textContent;
  if (window.ANIM) window.ANIM.set($("cvL"), pulseRays);
  if (P.annot === false) return;                                 // Labels off (Layout option): optics and rays only
  // the scale bar and the caption sit at the lower left of the panel
  const sbY = h - 12;                                             // the panel's foot, whatever the drawing does
  let capX = 14, sbL = 0, sbLab = "";
  if (!view3d) {
    const target = (w - mL - mR) * 0.16 / s, nice = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
    sbL = nice[0]; for (const v of nice) if (v <= target) sbL = v;
    sbLab = sbL >= 1000 ? sbL / 1000 + " m" : sbL + " mm";
    g.font = `12.5px ${FONT}`;
    capX = 14 + sbL * s + 8 + g.measureText(sbLab).width + 22;
  }
  const cvEl = $("cvL");
  capEl.style.setProperty("--capL", (cvEl.offsetLeft + capX) + "px");    // the caption starts after the scale bar
  {
    const boxes = [];
    const box = (x, y, al, wd) => { const x0 = al === "left" ? x : al === "right" ? x - wd : x - wd / 2; return [x0 - 7, y - 9, x0 + wd + 7, y + 9]; };
    const inside = b => b[0] >= 2 && b[2] <= w - 2 && b[1] >= 2 && b[3] <= h - 2;
    // kept clear: the expand button (lower right), the scale bar and caption, and in the Spatial and 3D views the
    // box of controls (upper left)
    boxes.push([w - 50, h - 44, w, h]);
    boxes.push([10, sbY - Math.max(12, capEl.hidden ? 0 : capEl.offsetHeight + 2), capEl.hidden ? capX : w - 56, h]);   // the caption may run to two lines
    if (spatial || view3d) boxes.push([0, 0, 300, 34]);
    const crowd = b => boxes.reduce((t, o) => t + Math.max(0, Math.min(b[2], o[2]) - Math.max(b[0], o[0])) * Math.max(0, Math.min(b[3], o[3]) - Math.max(b[1], o[1])), 0);
    // What is drawn under a box, read back from the canvas: darkness times opacity, summed over 2 x 2 px cells
    // (one sample each) through a summed-area table, so a label keeps off the optics, the arrows and dense rays as
    // well as other labels.  Pale fills (beam and glass tints) count a little.  Skipped while the 3D view turns.
    let inkIn = () => 0;
    if (!(view3d && turning3)) {
      try {
        const CW = cvEl.width, CH = cvEl.height, dpr = CW / w, px = g.getImageData(0, 0, CW, CH).data;
        const GW = Math.ceil(w / 2), GH = Math.ceil(h / 2), W1 = GW + 1, SAT = new Float32Array(W1 * (GH + 1));
        for (let j = 0; j < GH; j++) {
          const yy = Math.min(CH - 1, Math.floor((2 * j + 1) * dpr));
          let row = 0;
          for (let i = 0; i < GW; i++) {
            const k = (yy * CW + Math.min(CW - 1, Math.floor((2 * i + 1) * dpr))) * 4;
            const ink = px[k + 3] / 255 * (1 - (0.299 * px[k] + 0.587 * px[k + 1] + 0.114 * px[k + 2]) / 255);
            if (ink > 0.17) row += 4 * ink; else if (ink > 0.03) row += 1.2 * ink;   // pale fills count a little
            SAT[(j + 1) * W1 + i + 1] = SAT[j * W1 + i + 1] + row;
          }
        }
        const cx = v => Math.max(0, Math.min(GW, Math.round(v / 2))), cy = v => Math.max(0, Math.min(GH, Math.round(v / 2)));
        inkIn = b => { const x0 = cx(b[0]), x1 = cx(b[2]), y0 = cy(b[1]), y1 = cy(b[3]); return SAT[y1 * W1 + x1] - SAT[y0 * W1 + x1] - SAT[y1 * W1 + x0] + SAT[y0 * W1 + x0]; };
      } catch (e) { /* an unreadable canvas: labels keep off one another only */ }
    }
    placedLabels = [];
    const RING = [24, 38, 54], DIRS = Array.from({ length: 8 }, (_, k) => [Math.cos(k * Math.PI / 4), -Math.sin(k * Math.PI / 4)]);
    for (const L of LB.sort((p, q) => p.pri - q.pri)) {
      const fMain = `${L.ital ? "italic " : ""}${L.size}px ${FONT}`, fSub = `${L.size - 1.5}px ${FONT}`;
      g.font = fMain; const w1 = g.measureText(L.txt).width;
      g.font = fSub; const w2 = L.sub ? g.measureText("  " + L.sub).width : 0;
      // candidates: the label's own positions in order of preference, then (for a label that must have a place)
      // rings around its element, reached by a leader line
      const n0 = L.cands.length, at = L.cands.reduce((a1, c) => [a1[0] + c[0] / n0, a1[1] + c[1] / n0], [0, 0]);
      const cands = L.cands.map((c, i) => ({ c, cost: 6 * i, lead: false }));
      if (!L.optional) for (const r of RING) for (const [ux, uy] of DIRS) {
        const al = ux > 0.3 ? "left" : ux < -0.3 ? "right" : "center";
        cands.push({ c: [at[0] + r * ux, at[1] + r * uy, al], cost: 34 + 0.8 * r, lead: true });
      }
      let best = null;
      for (const withSub of L.sub ? [true, false] : [false]) {
        const wd = w1 + (withSub ? w2 : 0);
        for (const k of cands) {
          const b = box(k.c[0], k.c[1], k.c[2], wd);
          const sc0 = k.cost + (withSub ? 0 : 40) + (inside(b) ? 0 : 5000) + 60 * crowd(b) + inkIn(b);
          if (!best || sc0 < best.sc) best = { ...k, sc: sc0, sub: withSub, wd, b };
        }
      }
      // an optional label (the W arrow, the angles) that cannot find a clear place is left out
      if (L.optional && (best.sc >= 5000 || crowd(best.b) > 0 || inkIn(best.b) > 150)) continue;
      const pick = best.c, sub = best.sub, wd = best.wd;
      boxes.push(best.b);
      placedLabels.push({ txt: L.txt, box: best.b, ink: inkIn(best.b), lead: best.lead, optional: !!L.optional });
      const x0 = pick[2] === "left" ? pick[0] : pick[2] === "right" ? pick[0] - wd : pick[0] - wd / 2;
      if (best.lead) {
        // a thin leader from the element to the nearest point of the label
        const qx = Math.max(best.b[0], Math.min(best.b[2], at[0])), qy = Math.max(best.b[1] + 4, Math.min(best.b[3] - 4, at[1]));
        g.strokeStyle = "rgba(106,101,96,0.75)"; g.lineWidth = 0.8; g.setLineDash([]);
        g.beginPath(); g.moveTo(at[0], at[1]); g.lineTo(qx, qy); g.stroke();
      }
      g.textAlign = "left"; g.textBaseline = "middle";
      // a white halo under the text keeps it legible where it crosses rays
      g.lineJoin = "round"; g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4;
      g.font = fMain; g.strokeText(L.txt, x0, pick[1]); g.fillStyle = L.col; g.fillText(L.txt, x0, pick[1]);
      if (sub) { g.font = fSub; g.strokeText("  " + L.sub, x0 + w1, pick[1]); g.fillStyle = MUTED; g.fillText("  " + L.sub, x0 + w1, pick[1]); }
      g.lineJoin = "miter";
      if (L.then) L.then();
    }
  }
  // scale bar (not in 3D: lengths along the line of sight are foreshortened)
  if (!view3d) {
    const xb = 14, yb = sbY;
    g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(xb, yb); g.lineTo(xb + sbL * s, yb);
    g.moveTo(xb, yb - 4); g.lineTo(xb, yb + 4); g.moveTo(xb + sbL * s, yb - 4); g.lineTo(xb + sbL * s, yb + 4); g.stroke();
    g.fillStyle = MUTED; g.font = `12.5px ${FONT}`; g.textAlign = "left"; g.textBaseline = "bottom";
    g.fillText(sbLab, xb + sbL * s + 8, yb + 5);
  }
}
// layout view controls: Auto / Fixed scale, Reset, scroll to zoom about the pointer, drag to pan (to turn, in 3D)
const lvSync = bindSeg([["lvAuto", "auto"], ["lvFixed", "fixed"]], () => lview.mode, v => { lview.mode = v; if (v === "auto") lview.fit = true; }, true);
segs.push(lvSync);
$("lvOptsBtn").addEventListener("click", () => { const b = $("lvOpts"); b.hidden = !b.hidden; });
$("lvReset").addEventListener("click", () => { lview.fit = true; if (cur) drawLayout(cur, curP); });
// About the model and References: dialogs (the close button, Esc, or a click outside the box closes one)
function bindDialog(id, btn, close, before) {
  const dlg = $(id);
  $(btn).addEventListener("click", () => { if (before) before(); dlg.showModal(); });
  $(close).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", ev => {                         // a click on the backdrop, outside the box
    const r = dlg.getBoundingClientRect();
    if (ev.target === dlg && (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom)) dlg.close();
  });
}
bindDialog("about", "aboutBtn", "aboutClose");
// References (window.IX_REFS, built by make_refs.js from data/refs_map.json): the selected preset's sources, with
// the preset's note on where the numbers come from, then the sources of the model in this mode
const REFS = window.IX_REFS || { model: {} };
function presetNow() {
  const list = inst === "img" ? IMG.PRESETS : inst === "tel" ? TEL.PRESETS : inst === "int" ? INT.PRESETS : PRESETS;
  return list.find(p => p.id === psel.value) || null;
}
function refItems(ul, rs) {
  ul.innerHTML = "";
  for (const r of rs || []) {
    const li = document.createElement("li");
    if (r.u) { const a = document.createElement("a"); a.href = r.u; a.target = "_blank"; a.rel = "noopener"; a.textContent = r.t; li.appendChild(a); }
    else li.textContent = r.t;
    ul.appendChild(li);
  }
}
function fillRefs() {
  const p = presetNow(), rs = p ? (REFS[inst] || {})[p.id] : null;
  $("refsName").textContent = p ? p.name : "Custom settings";
  refItems($("refsList"), rs);
  $("refsList").hidden = !(rs && rs.length);
  $("refsNote").textContent = p ? (p.note || "") : "No preset is selected.";
  $("refsNote").hidden = !$("refsNote").textContent;
  refItems($("refsModel"), REFS.model[inst]);
}
bindDialog("refs", "refsBtn", "refsClose", fillRefs);
// the preset menu's tooltip names the selected preset's sources
psel.addEventListener("mouseenter", () => {
  const p = presetNow(), rs = p ? (REFS[inst] || {})[p.id] : null;
  psel.title = rs && rs.length ? "Sources: " + rs.map(r => r.t).join("; ") : "";
});
// the standard expand / collapse glyphs: arrows out to the corners, or in from them
const ICON_EXPAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
const ICON_COLLAPSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
function setExpandIcon(on) {
  const b = $("lvExpand");
  b.innerHTML = on ? ICON_COLLAPSE : ICON_EXPAND;
  b.setAttribute("aria-label", on ? "Return the layout to the page" : "Expand the layout");
  b.title = on ? "Return the layout to the page (Esc does the same)." : "Expand the layout to fill the window, to play with the drawing directly (Esc returns).";
}
setExpandIcon(false);
// Expand: the layout panel fills the window (Esc or the same button returns)
const setExpanded = on => {
  lvExpanded = on;
  document.body.classList.toggle("lv-expanded", on);
  setExpandIcon(on);
  $("lvExpand").title = on ? "Return the layout to the page (Esc)." : "Expand the layout to fill the window, to play with the drawing directly (Esc returns).";
  lview.fit = true;
  requestAnimationFrame(() => { if (cur) { drawLayout(cur, curP); drawRight(); } });
};
$("lvExpand").addEventListener("click", () => setExpanded(!lvExpanded));
// 3D view: snap to a view, color by wavelength or slit position
const sync3 = () => { $("c3L").setAttribute("aria-pressed", String(c3mode === "lam")); $("c3S").setAttribute("aria-pressed", String(c3mode === "slit")); };
for (const [id, az, el] of [["v3Top", 0, Math.PI / 2], ["v3Side", 0, 0], ["v3Obl", -0.6, 0.5]])
  $(id).addEventListener("click", () => { stopCoast(); setOrbit(az, el); lview.fit = true; if (cur) drawLayout(cur, curP); });
for (const [id, m] of [["c3L", "lam"], ["c3S", "slit"]]) $(id).addEventListener("click", () => { c3mode = m; sync3(); if (cur) drawLayout(cur, curP); });
sync3();
window.addEventListener("keydown", ev => {
  if (ev.key !== "Escape" || $("about").open || $("refs").open) return;   // an open dialog takes its own Esc
  if (inst === "img") { IMG.escape(); return; }
  if (inst === "tel") { TEL.escape(); return; }
  if (lvExpanded) setExpanded(false);                     // expanded: back to the page
  else if (!$("lvOpts").hidden) $("lvOpts").hidden = true;
});
// a click outside the layout options closes them (not on the drawing itself, which they act on)
document.addEventListener("mousedown", ev => {
  const b = $("lvOpts");
  if (!b.hidden && !b.contains(ev.target) && ev.target !== $("lvOptsBtn") && ev.target !== $("cvL")) b.hidden = true;
});
{
  const cv = $("cvL");
  let drag = null;
  const toFixed = () => { if (lview.mode !== "fixed") { lview.mode = "fixed"; lvSync(); } };
  cv.addEventListener("wheel", ev => {
    if (!cur || armsOn()) return;                                // (the All-arms view always fits its panel)
    ev.preventDefault();
    toFixed();
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    const f = Math.exp(-ev.deltaY * 0.0022);
    lview.ox = mx - (mx - lview.ox) * f; lview.oy = my - (my - lview.oy) * f; lview.s *= f;
    drawLayout(cur, curP);
  }, { passive: false });
  // Spatial view with one free point: grabbing the slit (or the detector) moves the point along the slit
  const spHit = ev => {
    if (!spGeo) return null;
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, G = spGeo;
    const inY = half => my > G.oy - G.s * half - 14 && my < G.oy + G.s * half + 14;
    if (Math.abs(mx - G.ox) < 14 && inY(G.hMax)) return "slit";
    if (Math.abs(mx - (G.ox + G.s * G.xD)) < 16 && inY(G.Ly / 2)) return "det";
    return null;
  };
  let ptDrag = null;
  const movePoint = ev => {
    const r = cv.getBoundingClientRect(), G = spGeo, y = (G.oy - (ev.clientY - r.top)) / G.s;   // world height under the pointer
    const hh = ptDrag === "det" ? -y / G.mag : y;
    S.g.spPos = Math.min(1, Math.max(-1, hh / G.hMax)); curP.spPos = S.g.spPos;
    drawLayout(cur, curP); scheduleHash();
  };
  cv.addEventListener("mousedown", ev => {
    if (armsOn()) return;
    const k = spHit(ev);
    if (k) { ptDrag = k; cv.style.cursor = "ns-resize"; movePoint(ev); return; }
    const is3d = curP && curP.view === "3d";
    orbitVel = null; cancelAnimationFrame(orbitRAF);
    drag = { x: ev.clientX, y: ev.clientY, ox: lview.ox, oy: lview.oy, turn: is3d && !ev.shiftKey && ev.button === 0, az0: R3.az, el0: R3.el, lx: ev.clientX, ly: ev.clientY, lt: performance.now(), v: [0, 0] };
    cv.style.cursor = "grabbing";
    turning3 = drag.turn;
  });
  cv.addEventListener("mousemove", ev => { if (!drag && !ptDrag) cv.style.cursor = spHit(ev) ? "ns-resize" : ""; });
  window.addEventListener("mousemove", ev => {
    if (ptDrag && cur && spGeo) { movePoint(ev); return; }
    if (!drag || !cur) return;
    if (drag.turn) {
      // a full panel height of drag turns the view by 360 degrees (OrbitControls' rate)
      const k = 2 * Math.PI / (cv.clientHeight || 400);
      setOrbit(drag.az0 - (ev.clientX - drag.x) * k, drag.el0 + (ev.clientY - drag.y) * k);
      const t = performance.now(), dt = Math.max(1, t - drag.lt);
      drag.v = [-(ev.clientX - drag.lx) * k / dt, (ev.clientY - drag.ly) * k / dt];   // radians per ms, for the coast
      drag.lx = ev.clientX; drag.ly = ev.clientY; drag.lt = t;
      drawSoon();
      return;
    }
    toFixed();
    lview.ox = drag.ox + ev.clientX - drag.x; lview.oy = drag.oy + ev.clientY - drag.y;
    drawSoon();
  });
  window.addEventListener("mouseup", () => {
    if (drag && drag.turn && performance.now() - drag.lt < 80 && Math.hypot(...drag.v) > 2e-4) {
      // coast: keep the release speed, slowing by 8% a frame
      orbitVel = drag.v.map(x => x * 16);
      const step = () => {
        if (!orbitVel || !cur || curP.view !== "3d") { stopCoast(); return; }
        setOrbit(R3.az + orbitVel[0], R3.el + orbitVel[1]);
        orbitVel = orbitVel.map(x => x * 0.92);
        drawLayout(cur, curP);
        if (Math.hypot(...orbitVel) > 1e-4) orbitRAF = requestAnimationFrame(step); else { orbitVel = null; turning3 = false; drawSoon(); }
      };
      orbitRAF = requestAnimationFrame(step);
    } else if (drag) { if (turning3) drawSoon(); turning3 = false; }   // the labels get their full placement again
    if (drag || ptDrag) { drag = null; ptDrag = null; cv.style.cursor = ""; }
  });
  cv.addEventListener("contextmenu", ev => { if (curP && curP.view === "3d") ev.preventDefault(); });     // right-drag pans
  let tch = null;
  cv.addEventListener("touchstart", ev => { if (ev.touches.length === 1) tch = { x: ev.touches[0].clientX, ox: lview.ox, az0: R3.az }; }, { passive: true });
  cv.addEventListener("touchmove", ev => {
    if (!tch || !cur || ev.touches.length !== 1) return;
    const dx = ev.touches[0].clientX - tch.x;
    if (curP.view === "3d") setOrbit(tch.az0 - dx * 2 * Math.PI / (cv.clientHeight || 400), R3.el);
    else { toFixed(); lview.ox = tch.ox + dx; }
    drawSoon();
  }, { passive: true });
  cv.addEventListener("touchend", () => { tch = null; });
  cv.addEventListener("dblclick", () => {
    if (curP && curP.view === "3d") { stopCoast(); setOrbit(-0.6, 0.5); }
    lview.fit = true; drawLayout(cur, curP);
  });
}

function message(g, w, h, txt) {
  // wrap to the panel width
  g.fillStyle = MUTED; g.font = `15px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  const words = txt.split(" "), lines = []; let ln = "";
  for (const wd of words) { const t = ln ? ln + " " + wd : wd; if (g.measureText(t).width > w * 0.8 && ln) { lines.push(ln); ln = wd; } else ln = t; }
  if (ln) lines.push(ln);
  lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * 21));
}

// ------------------------------------------------------------------ detector
/* The detector drawn to scale with the spectrum of every object as it falls on the chip: each spectrum is
   the trace of a star on the slit (a Gaussian across the dispersion whose FWHM is the trace width, or the
   slit width when no trace width is set), colored by wavelength (blue short,
   amber long, fixed in absolute wavelength) with brightness following the blaze efficiency (dimmed outside
   an echelle order's free spectral range).  The objects sit at different positions along the slit: in
   grating mode spread evenly over the chip height, in echelle mode stacked within the smallest order
   spacing, so that the spectra of neighboring orders do not interleave. */
const LSTOP = [[3200, [40, 110, 220]], [4300, [96, 166, 245]], [5500, [228, 224, 214]], [6800, [246, 186, 105]], [8800, [222, 128, 30]]];
function lamRGB(lA) {
  const n = LSTOP.length;
  if (lA <= LSTOP[0][0]) return LSTOP[0][1];
  if (lA >= LSTOP[n - 1][0]) return LSTOP[n - 1][1];
  let k = 0; while (lA > LSTOP[k + 1][0]) k++;
  const a = LSTOP[k], b = LSTOP[k + 1], t = (lA - a[0]) / (b[0] - a[0]);
  return [0, 1, 2].map(i => a[1][i] + (b[1][i] - a[1][i]) * t);
}
const zoom = { z: 1, cx: 0, cy: 0, reset() { this.z = 1; this.cx = 0; this.cy = 0; } };
let placedLabels = [];                                             // the layout's labels as placed (for the tests)
let spGeo = null, lvExpanded = false;                              // Spatial view, one free point: screen geometry for dragging
let detGeom = null, traces = [], hover = null;
const detBufs = {};                                             // the detector panel's pixel buffers (splatTraces)
// exp(-x^2 / 2) tabulated at x = k / EXPN up to 4 (the detector's trace profiles)
const EXPN = 32, EXPT = Float32Array.from({ length: 4 * EXPN + 1 }, (_, k) => Math.exp(-0.5 * (k / EXPN) * (k / EXPN)));

function objectOffsets(Dz, P) {
  const n = Math.max(1, Math.round(P.nObj || 1));
  const lr = P.mode === "echelle" ? Dz.mlamRef / Dz.mRef : Dz.grism ? Dz.grism.lam0 : P.lamC / 1e4, mr = P.mode === "echelle" ? Dz.mRef : Dz.order;
  const a = Dz.pos(lr, mr, 0, 0.01), b = Dz.pos(lr, mr, 0, -0.01);
  if (!a || !b) return { n: 1, zeta: [0], gapPx: NaN };
  const dYdz = Math.hypot(a[0] - b[0], a[1] - b[1]) / 0.02;        // detector mm per slit mm, along the slit
  const span = P.mode === "echelle" ? (isFinite(Dz.minSep) ? Dz.minSep * Dz.pixmm : Dz.Ly / Math.max(1, Dz.orders.length)) : Dz.Ly;
  // fibers in groups (P.fgroups = [fibers per group, pitch, gap], µm on the detector, center to center; the gap from
  // the last fiber of one group to the first of the next): the groups centered on the detector; else spread evenly
  const fg = Array.isArray(P.fgroups) && P.fgroups.length === 3 ? P.fgroups : null;
  if (fg && n > 1) {
    const per = Math.max(1, Math.round(fg[0])), pitch = fg[1] / 1000, gp = fg[2] / 1000, ys = [];
    for (let k = 0; k < n; k++) { const g = Math.floor(k / per), j = k % per; ys.push(g * ((per - 1) * pitch + gp) + j * pitch); }
    const mid = (ys[0] + ys[n - 1]) / 2;
    return { n, zeta: ys.map(y => (y - mid) / dYdz), gapPx: pitch / Dz.pixmm, groups: { per, pitchPx: pitch / Dz.pixmm, gapPx: gp / Dz.pixmm, n: Math.ceil(n / per) } };
  }
  const gap = span / n;                                             // detector mm between neighboring spectra
  const zeta = [];
  for (let k = 0; k < n; k++) zeta.push((k - (n - 1) / 2) * gap / dYdz);
  return { n, zeta, gapPx: gap / Dz.pixmm };
}
function buildTraces(Dz, P) { traces = makeTraces(Dz, P); }
// each object's spectrum in each order, sampled along the order (the detector panels, here and in arms.js)
function makeTraces(Dz, P) {
  const traces = [];
  if (Dz.bad || !Dz.c) return traces;
  const ob = objectOffsets(Dz, P);
  Dz.objects = ob;
  const nOrd = Math.max(1, Dz.orders.length);
  const ns = Math.max(12, Math.min(110, Math.round(24000 / (ob.n * nOrd))));
  for (const o of Dz.orders) {
    const pad = (o.hi - o.lo) * 0.01, lo = o.lo - pad, hi = o.hi + pad;
    const ls = [], effs = [];
    for (let i = 0; i <= ns; i++) {
      const l = lo + (hi - lo) * i / ns, L = Dz.local(l, o.m);
      ls.push(l); effs.push(L ? L.eff : null);
    }
    // past ~4000 traces the spectra merge into a band anyway: draw every k-th object
    const every = Math.max(1, Math.ceil(ob.n * nOrd / 4000));
    ob.every = every;
    ob.zeta.forEach((z, k) => {
      if (k % every) return;
      const pts = [];
      ls.forEach((l, i) => { const c = Dz.pos(l, o.m, 0, z); if (c) pts.push({ l, c, eff: effs[i], inFsr: P.mode !== "echelle" || (l >= o.fsrLo && l <= o.fsrHi) }); });
      traces.push({ m: o.m, k, pts, o });
    });
  }
  return traces;
}

// The traces trs of Dz drawn into the canvas context g within the CSS-px rectangle (rx0, ry0)-(rx1, ry1): T maps
// detector mm to CSS px, ppx is CSS px per detector px, and buf holds the buffers between calls.
  // The traces are rendered pixel by pixel. Each trace is a Gaussian across the dispersion, FWHM = the slit (or
  // fiber) width imaged along the slit, evaluated at the centers of the screen's device pixels. Strokes drawn
  // thinner than a pixel and blurred afterward alias: traces a few pixels apart beat against the pixel grid into
  // moire, and a blur cannot remove a beat once the strokes are rasterized. So the profile is widened before it
  // is sampled: at least 0.6 device px (a single trace stays sharp), and to 0.45 of the trace spacing where the
  // traces are too close to resolve, so that a dense set reads as a smooth band; the widening fades out between
  // spacings of 4.5 and 7 px, where the traces show singly. Each trace keeps its peak brightness, dimmed where
  // neighbors overlap so that the sum of many, sigma sqrt(2 pi) / spacing times one peak, stays at one trace's
  // brightness. Traces packed closer than a device pixel (an IFU's 3600 spaxels seen whole) are thinned to every
  // kk-th (zooming in brings them all back).
function splatTraces(g, trs, Dz, P, T, ppx, rx0, ry0, rx1, ry1, buf) {
  const ech = P.mode === "echelle";
  const dpr = window.devicePixelRatio || 1, ppd = ppx * dpr;          // device px per detector px
  const sgT = (P.traceW > 0 ? P.traceW : P.slitW) / Dz.c.pixScale * ppd / 2.3548;   // the true sigma, device px
  const obj = Dz.objects, every = (obj && obj.every) || 1;
  // the spacing between neighboring traces (detector px): the objects' within an order, or (one object per order,
  // echelle) the orders' own, order by order
  const ordSep = {};
  if (ech && Dz.orders.length > 1) {
    const Ys = Dz.orders.map(o => { const q = Dz.pos(o.lb, o.m); return q ? q[1] : NaN; });
    Dz.orders.forEach((o, k) => {
      const d = [k > 0 ? Math.abs(Ys[k] - Ys[k - 1]) : Infinity, k + 1 < Ys.length ? Math.abs(Ys[k + 1] - Ys[k]) : Infinity].filter(isFinite);
      ordSep[o.m] = d.length ? Math.min(...d) / Dz.pixmm : isFinite(Dz.minSep) ? Dz.minSep : Infinity;
    });
  }
  const objPitch = obj && obj.n > 1 && isFinite(obj.gapPx) ? obj.gapPx * every : Infinity;
  const pitchFor = m => Math.min(objPitch, ech && !(obj && obj.n > 1) ? (ordSep[m] !== undefined ? ordSep[m] : Infinity) : Infinity) * ppd;
  const pitchAll = Math.min(objPitch, ...Object.values(ordSep).map(v => v * (obj && obj.n > 1 ? Infinity : 1))) * ppd;
  const kk = pitchAll < 1 ? Math.ceil(1 / pitchAll) : 1;
  // an isolated trace (grating mode, objects far apart) is drawn at least 0.55 CSS px (FWHM ~1.3 px), so that a
  // single star shows on the whole chip; zooming in reaches the true width
  const sgMin = Math.max(0.6, P.mode !== "echelle" && objPitch * ppx > 6 ? 0.55 * dpr : 0);
  const sigFor = p => {
    const sp = p < 4.5 ? 0.45 * p : p < 7 ? 0.45 * p * (7 - p) / 2.5 : 0;
    return Math.max(sgT, sgMin, sp);
  };
  // the region drawn, in device px
  const x0d = Math.max(0, Math.floor(rx0 * dpr)), x1d = Math.min(g.canvas.width, Math.ceil(rx1 * dpr));
  const y0d = Math.max(0, Math.floor(ry0 * dpr)), y1d = Math.min(g.canvas.height, Math.ceil(ry1 * dpr));
  const RW = x1d - x0d, RH = y1d - y0d;
  if (RW > 0 && RH > 0) {
    if (!buf.det || buf.det.RW !== RW || buf.det.RH !== RH) buf.det = { RW, RH, acc: new Float32Array(RW * RH * 3), img: new ImageData(RW, RH) };
    const acc = buf.det.acc; acc.fill(0);
    // the segment from point A to point B (device px, colors premultiplied by brightness), splatted column by
    // column (or row by row where steeper than 45 degrees): along a column, a trace of perpendicular sigma sg
    // inclined at slope s is a Gaussian of sigma sg sqrt(1 + s^2) with the same peak
    const seg = (xa, ya, ca, ia, xb, yb, cb, ib, sg) => {
      const dx = xb - xa, dy = yb - ya, colw = Math.abs(dx) >= Math.abs(dy);
      const [u0, u1, v0, du, dv, U, V] = colw ? [xa, xb, ya, dx, dy, RW, RH] : [ya, yb, xa, dy, dx, RH, RW];
      if (!du) return;
      const sl = dv / du, sv = sg * Math.sqrt(1 + sl * sl), Rr = 4 * sv, inv = EXPN / sv;
      const lo = Math.max(0, Math.ceil(Math.min(u0, u1) - 0.5)), hi = Math.min(U - 1, Math.ceil(Math.max(u0, u1) - 0.5) - 1);
      const step = ia === ib;
      for (let i = lo; i <= hi; i++) {
        const t = (i + 0.5 - u0) / du, v = v0 + t * dv;
        const j0 = Math.max(0, Math.ceil(v - Rr - 0.5)), j1 = Math.min(V - 1, Math.floor(v + Rr - 0.5));
        if (j0 > j1) continue;
        const c = step ? null : t < 0.5 ? ca : cb;
        const r = c ? c[0] : ca[0] + (cb[0] - ca[0]) * t, gg = c ? c[1] : ca[1] + (cb[1] - ca[1]) * t, bb = c ? c[2] : ca[2] + (cb[2] - ca[2]) * t;
        for (let j = j0; j <= j1; j++) {
          const e = EXPT[Math.min(EXPT.length - 1, Math.abs((j + 0.5 - v) * inv) | 0)];
          const q = 3 * (colw ? j * RW + i : i * RW + j);
          acc[q] += r * e; acc[q + 1] += gg * e; acc[q + 2] += bb * e;
        }
      }
    };
    for (const tr of trs) {
      const pts = tr.pts;
      if (pts.length < 2 || (kk > 1 && (tr.k / every) % kk)) continue;
      const p = pitchFor(tr.m) * kk, sg = sigFor(p);
      const ovl = isFinite(p) ? Math.min(1, p / (sg * 2.5066)) : 1;
      let prev = null;
      for (const pt of pts) {
        const q = T(...pt.c);
        let b = (pt.eff === null ? 0.85 : 0.18 + 0.82 * pt.eff) * ovl;
        if (!pt.inFsr) b *= 0.42;
        const col = lamRGB(pt.l * 1e4), cur = [q[0] * dpr - x0d, q[1] * dpr - y0d, [col[0] * b, col[1] * b, col[2] * b], pt.inFsr];
        if (prev) seg(prev[0], prev[1], prev[2], prev[3], cur[0], cur[1], cur[2], cur[3], sg);
        prev = cur;
      }
    }
    const px = buf.det.img.data;
    for (let k = 0, q = 0; k < RW * RH; k++, q += 3) { px[4 * k] = acc[q]; px[4 * k + 1] = acc[q + 1]; px[4 * k + 2] = acc[q + 2]; px[4 * k + 3] = 255; }
    if (!buf.off) buf.off = document.createElement("canvas");
    if (buf.off.width < RW || buf.off.height < RH) { buf.off.width = Math.max(buf.off.width, RW); buf.off.height = Math.max(buf.off.height, RH); }
    buf.off.getContext("2d").putImageData(buf.det.img, 0, 0);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter";
    g.drawImage(buf.off, 0, 0, RW, RH, x0d, y0d, RW, RH);
    g.restore();
  }
}

function drawDetector(Dz, P) {
  if (armsOn()) return;                                          // the All-arms view draws this panel (arms.js)
  const cv = $("cvD");
  $("dzReset").hidden = !(zoom.z > 1.001);
  const { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  detGeom = null;
  if (!(cv.width > 0 && cv.height > 0)) return;                  // a collapsed panel (mid-resize): nothing to draw into
  if (Dz.bad || !Dz.c) { message(g, w, h, Dz.bad ? "—" : "No light reaches the detector"); return; }
  const ech = P.mode === "echelle";
  // margins hold the axes: grating, wavelength below and position along the slit at left; echelle, the order
  // numbers at left and the blaze wavelength at right
  const mL = 62, mR = ech ? 70 : 20, mT = ech ? 12 : 10, mB = ech ? 12 : 48;
  const aw = w - mL - mR, ah = h - mT - mB;
  const Lx = Dz.Lx, Ly = Dz.Ly;
  const s0 = Math.min(aw / Lx, ah / Ly), s = s0 * zoom.z;
  const cxp = mL + aw / 2, cyp = mT + ah / 2;
  const T = (X, Y) => [cxp + (X - zoom.cx) * s, cyp - (Y - zoom.cy) * s];
  detGeom = { s, s0, cxp, cyp, mL, mT, aw, ah, Lx, Ly };
  const c0 = T(-Lx / 2, Ly / 2), c1 = T(Lx / 2, -Ly / 2);
  g.save();
  g.beginPath(); g.rect(mL, mT, aw, ah); g.clip();
  g.fillStyle = "#0b111c"; g.fillRect(c0[0], c0[1], c1[0] - c0[0], c1[1] - c0[1]);
  g.beginPath(); g.rect(c0[0], c0[1], c1[0] - c0[0], c1[1] - c0[1]); g.clip();
  const ppx = s * Dz.pixmm;
  splatTraces(g, traces, Dz, P, T, ppx, Math.max(mL, c0[0]), Math.max(mT, c0[1]), Math.min(mL + aw, c1[0]), Math.min(mT + ah, c1[1]), detBufs);
  // pixel grid when zoomed in far enough (mid-gray: visible on the dark chip and on a bright trace)
  if (ppx >= 6) {
    g.strokeStyle = "rgba(128,128,128,0.45)"; g.lineWidth = 1;
    const vx0 = zoom.cx - (aw / 2) / s, vx1 = zoom.cx + (aw / 2) / s, vy0 = zoom.cy - (ah / 2) / s, vy1 = zoom.cy + (ah / 2) / s;
    g.beginPath();
    const i0 = Math.ceil((Math.max(vx0, -Lx / 2) + Lx / 2) / Dz.pixmm), i1 = Math.floor((Math.min(vx1, Lx / 2) + Lx / 2) / Dz.pixmm);
    for (let i = i0; i <= i1; i++) { const X = -Lx / 2 + i * Dz.pixmm, a1 = T(X, vy1), b1 = T(X, vy0); g.moveTo(Math.round(a1[0]) + 0.5, a1[1]); g.lineTo(Math.round(b1[0]) + 0.5, b1[1]); }
    const j0 = Math.ceil((Math.max(vy0, -Ly / 2) + Ly / 2) / Dz.pixmm), j1 = Math.floor((Math.min(vy1, Ly / 2) + Ly / 2) / Dz.pixmm);
    for (let j = j0; j <= j1; j++) { const Y = -Ly / 2 + j * Dz.pixmm, a1 = T(vx0, Y), b1 = T(vx1, Y); g.moveTo(a1[0], Math.round(a1[1]) + 0.5); g.lineTo(b1[0], Math.round(b1[1]) + 0.5); }
    g.stroke();
  }
  // the resolution element under the pointer: the slit image at that wavelength, FWHM wide
  if (hover && ppx >= 3) {
    const L = Dz.local(hover.lam, hover.m);
    if (L) {
      const hw = L.fw / 2, sd = L.sdir, hl = 1.5 * Dz.pixmm;
      const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a1, b1]) => T(L.X + a1 * hw + b1 * hl * sd[0], L.Y + b1 * hl * sd[1]));
      g.beginPath(); corners.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath();
      g.strokeStyle = "rgba(20,20,20,0.85)"; g.lineWidth = 3; g.stroke();
      g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 1.2; g.stroke();
    }
  }
  g.restore();
  g.strokeStyle = "#3b3733"; g.lineWidth = 1;
  g.strokeRect(Math.max(c0[0], mL) + 0.5, Math.max(c0[1], mT) + 0.5, Math.min(c1[0], mL + aw) - Math.max(c0[0], mL) - 1, Math.min(c1[1], mT + ah) - Math.max(c0[1], mT) - 1);
  // ---- axes on the chip's edges (on the panel's, when zoomed past them): ticks outward, round values
  const fx0 = Math.max(c0[0], mL), fx1 = Math.min(c1[0], mL + aw), fy0 = Math.max(c0[1], mT), fy1 = Math.min(c1[1], mT + ah);
  const TK = 5, TKm = 3, LAB = `12px ${FONT}`, TTL = `12.5px ${FONT}`, TINK = "#4f4a44";
  // a 1-2-5 step giving about n intervals over span, with its minor step
  const nice = (span, n) => {
    const r = span / Math.max(1, n), p10 = Math.pow(10, Math.floor(Math.log10(r))), f = r / p10;
    const m = [1, 2, 5, 10].reduce((b1, q) => (Math.abs(Math.log(q / f)) < Math.abs(Math.log(b1 / f)) ? q : b1), 1);   // nearest in log
    return { st: m * p10, k: m === 2 ? 4 : 5 };
  };
  const dec = st => Math.max(0, -Math.floor(Math.log10(st) + 1e-9));
  const num = (v, d) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(d);
  let wL = 0, wR = 0;                                              // widest tick label at left and right, for the titles
  const labelL = (txt, x, y) => { g.fillText(txt, x, y); wL = Math.max(wL, g.measureText(txt).width); };
  const labelR = (txt, x, y) => { g.fillText(txt, x, y); wR = Math.max(wR, g.measureText(txt).width); };
  g.strokeStyle = MUTED; g.lineWidth = 1;
  const tickV = (x, y, len) => { g.beginPath(); g.moveTo(Math.round(x) + 0.5, y); g.lineTo(Math.round(x) + 0.5, y + len); g.stroke(); };
  const tickH = (x, y, len) => { g.beginPath(); g.moveTo(x, Math.round(y) + 0.5); g.lineTo(x + len, Math.round(y) + 0.5); g.stroke(); };
  const title = (txt, x, y, rot) => {
    g.save(); g.translate(x, y); if (rot) g.rotate(-Math.PI / 2);
    g.font = TTL; g.fillStyle = TINK; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 0); g.restore();
  };
  // ticks at every multiple of the minor step inside [v0, v1]; at() gives the canvas coordinate or null
  const ticks = (v0, v1, st, k, at, draw) => {
    const mn = st / k;
    for (let i = Math.ceil(v0 / mn - 1e-9); i * mn <= v1 + mn * 1e-9; i++) { const v = i * mn, q = at(v); if (q !== null) draw(q, v, i % k === 0); }
  };
  if (!ech) {
    // wavelength (um) along the trace of the slit center; the visible range by bisection on X(lambda)
    const lo = Dz.range[0], hi = Dz.range[1];
    const Xof = l => { const p = Dz.pos(l, Dz.order); return p ? p[0] : NaN; };
    const inc = Xof(hi) > Xof(lo);
    const lamAt = X => { let a1 = lo, b1 = hi; for (let i = 0; i < 40; i++) { const mid = (a1 + b1) / 2; if ((Xof(mid) < X) === inc) a1 = mid; else b1 = mid; } return (a1 + b1) / 2; };
    const la = lamAt(zoom.cx + (fx0 - cxp) / s), lb = lamAt(zoom.cx + (fx1 - cxp) / s);
    const v0 = Math.min(la, lb), v1 = Math.max(la, lb), { st, k } = nice(v1 - v0, Math.max(2, (fx1 - fx0) / 65));
    g.font = LAB; g.fillStyle = MUTED; g.textAlign = "center"; g.textBaseline = "top";
    let lastX = null;                                                // a label too close to the previous one is skipped
    ticks(v0, v1, st, k, l => { const X = Xof(l); if (!isFinite(X)) return null; const x = T(X, 0)[0]; return x >= fx0 - 0.5 && x <= fx1 + 0.5 ? x : null; },
      (x, l, major) => {
        const txt = num(l, dec(st)), lab = major && (lastX === null || Math.abs(x - lastX) >= g.measureText(txt).width + 10);
        tickV(x, fy1, lab ? TK : TKm);
        if (lab) { g.fillText(txt, x, fy1 + TK + 3); lastX = x; }
      });
    title("Wavelength (µm)", (fx0 + fx1) / 2, fy1 + TK + 30, false);
    // position along the slit (arcsec) through the column of the central wavelength, traced
    const lc = Dz.c.lam, plate = Dz.plate;
    const Yof = a => { const p = Dz.pos(lc, Dz.order, 0, a / plate); return p ? p[1] : NaN; };
    const Y0 = Yof(0), dY = (Yof(1) - Yof(-1)) / 2;                    // mm per arcsec (signed)
    if (isFinite(Y0) && dY) {
      const aAt = y => (zoom.cy - (y - cyp) / s - Y0) / dY;
      const a0 = Math.min(aAt(fy0), aAt(fy1)), a1 = Math.max(aAt(fy0), aAt(fy1)), { st: sa, k: ka } = nice(a1 - a0, Math.max(2, (fy1 - fy0) / 45));
      g.font = LAB; g.fillStyle = MUTED; g.textAlign = "right"; g.textBaseline = "middle";
      ticks(a0, a1, sa, ka, a => { const Y = Yof(a); if (!isFinite(Y)) return null; const y = T(0, Y)[1]; return y >= fy0 - 0.5 && y <= fy1 + 0.5 ? y : null; },
        (y, a, major) => { tickH(fx0, y, -(major ? TK : TKm)); if (major) labelL(num(Math.abs(a) < sa * 1e-6 ? 0 : a, dec(sa)), fx0 - TK - 3, y); });
      title("Along the slit (″)", Math.max(10, fx0 - TK - 3 - wL - 13), (fy0 + fy1) / 2, true);
    }
  } else {
    // left: every order on the chip gets a tick at its blaze center, every k-th (k = 1, 2, 5, 10 ...) a number
    const ords = Dz.orders.map(o => { const p = Dz.pos(o.lb, o.m); return p ? { m: o.m, lb: o.lb, y: T(p[0], p[1])[1] } : null; })
      .filter(o => o && o.y >= fy0 - 0.5 && o.y <= fy1 + 0.5).sort((a1, b1) => a1.y - b1.y);
    if (ords.length) {
      const gaps = ords.slice(1).map((o, i) => o.y - ords[i].y).sort((a1, b1) => a1 - b1);
      const med = gaps.length ? gaps[gaps.length >> 1] : 99;
      const kOrd = [1, 2, 5, 10, 20, 50, 100].find(q => q * med >= 15) || 100;
      g.font = LAB; g.fillStyle = MUTED; g.textAlign = "right"; g.textBaseline = "middle";
      let last = -1e9;
      for (const o of ords) {
        const lab = o.m % kOrd === 0 && o.y - last >= 13;
        if (lab || med >= 2.5) tickH(fx0, o.y, -(lab ? TK : TKm));
        if (lab) { labelL(String(o.m), fx0 - TK - 3, o.y); last = o.y; }
      }
      title("Order", Math.max(10, fx0 - TK - 3 - wL - 13), (fy0 + fy1) / 2, true);
      // right: blaze wavelength (um), round values placed by interpolating between the orders' blaze centers
      const byL = ords.slice().sort((a1, b1) => a1.lb - b1.lb), v0 = byL[0].lb, v1 = byL[byL.length - 1].lb;
      const yAt = v => {
        for (let i = 0; i + 1 < byL.length; i++) {
          const A = byL[i], B = byL[i + 1];
          if (v >= A.lb && v <= B.lb) return A.y + (B.y - A.y) * (v - A.lb) / (B.lb - A.lb || 1);
        }
        return null;
      };
      if (v1 > v0) {
        const { st, k } = nice(v1 - v0, Math.max(2, (fy1 - fy0) / 45));
        g.textAlign = "left";
        let lastR = -1e9;
        ticks(v0, v1, st, k, yAt, (y, v, major) => {
          const lab = major && Math.abs(y - lastR) >= 13;
          tickH(fx1, y, lab ? TK : TKm);
          if (lab) { labelR(num(v, dec(st)), fx1 + TK + 3, y); lastR = y; }
        });
        title("Blaze wavelength (µm)", Math.min(w - 10, fx1 + TK + 3 + wR + 13), (fy0 + fy1) / 2, true);
      }
    }
  }
  const sub = $("dSub");
  const L = hover ? Dz.local(hover.lam, hover.m) : null;
  if (L) sub.innerHTML = `<b>${fAd(hover.lam, 2)} Å</b>` + (ech ? ` · order <b>${hover.m}</b>` : "") + (Dz.objects && Dz.objects.n > 1 ? ` · object <b>${hover.k + 1}</b> of ${Dz.objects.n}` : "") +
    ` · R <b>${fmtR(L.Reff)}</b> · <b>${sig(L.dlpix, 3)}</b> Å/px` + (L.eff !== null ? ` · blaze <b>${pct(L.eff)}</b>` : "");
  else sub.innerHTML = detLegend(Dz, P);
}

// the key to the detector drawing, in the header while the pointer is off the traces: the colors (fixed in
// absolute wavelength, the LSTOP ramp), the brightness (the blaze, where there is one) and the dimmed parts
function detLegend(Dz, P) {
  if (Dz.bad || !Dz.c) return "";
  const blaze = Dz.c.eff !== null && Dz.c.eff !== undefined;
  return `<span class="lg">${(LSTOP[0][0] / 1e4).toFixed(2)}<span class="lgsw"></span>${(LSTOP[LSTOP.length - 1][0] / 1e4).toFixed(2)} µm</span>` +
    (blaze ? `<span class="lg" title="Brightness follows the blaze efficiency (scalar theory), relative to the peak.">brightness: blaze</span>` : "") +
    (P.mode === "echelle" ? `<span class="lg" title="Each order is drawn faint beyond its free spectral range, where the neighboring order covers the same wavelengths.">faint: outside the FSR</span>` : "");
}
// pointer -> nearest order trace (within 10 canvas px)
function pick(ev) {
  if (!detGeom) return null;
  const G = detGeom, r = $("cvD").getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
  if (mx < G.mL || mx > G.mL + G.aw || my < G.mT || my > G.mT + G.ah) return null;
  const X = zoom.cx + (mx - G.cxp) / G.s, Y = zoom.cy - (my - G.cyp) / G.s;
  if (Math.abs(X) > G.Lx / 2 || Math.abs(Y) > G.Ly / 2) return null;
  let best = null;
  for (const tr of traces) {
    const pts = tr.pts;
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i].c, b = pts[i + 1].c, vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy || 1e-30;
      let t = ((X - a[0]) * vx + (Y - a[1]) * vy) / L2; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(a[0] + t * vx - X, a[1] + t * vy - Y) * G.s;
      if (!best || d < best.d) best = { d, lam: pts[i].l + t * (pts[i + 1].l - pts[i].l), m: tr.m, k: tr.k };
    }
  }
  return best && best.d <= 10 ? { lam: best.lam, m: best.m, k: best.k } : null;
}
function clampZoom() {
  if (!detGeom) return;
  if (zoom.z <= 1.0001) { zoom.cx = 0; zoom.cy = 0; }
  zoom.cx = Math.max(-detGeom.Lx / 2, Math.min(detGeom.Lx / 2, zoom.cx));
  zoom.cy = Math.max(-detGeom.Ly / 2, Math.min(detGeom.Ly / 2, zoom.cy));
  $("cvD").classList.toggle("zoomed", zoom.z > 1.001);
}
{
  const cv = $("cvD");
  let drag = null;
  cv.addEventListener("mousemove", ev => {
    if (drag) {
      if (!detGeom) return;
      zoom.cx = drag.cx - (ev.clientX - drag.x) / detGeom.s; zoom.cy = drag.cy + (ev.clientY - drag.y) / detGeom.s;
      clampZoom(); redrawDetector(); return;
    }
    hover = pick(ev); redrawDetector();
  });
  cv.addEventListener("mouseleave", () => { hover = null; redrawDetector(); });
  cv.addEventListener("mousedown", ev => { if (zoom.z > 1.001) { drag = { x: ev.clientX, y: ev.clientY, cx: zoom.cx, cy: zoom.cy }; cv.style.cursor = "grabbing"; } });
  window.addEventListener("mouseup", () => { if (drag) { drag = null; cv.style.cursor = ""; } });
  cv.addEventListener("wheel", ev => {
    if (!detGeom) return;
    ev.preventDefault();
    const G = detGeom, r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    const X = zoom.cx + (mx - G.cxp) / G.s, Y = zoom.cy - (my - G.cyp) / G.s;
    const z = Math.max(1, Math.min(4000, zoom.z * Math.exp(-ev.deltaY * 0.0022))), s1 = G.s0 * z;
    zoom.cx = X - (mx - G.cxp) / s1; zoom.cy = Y + (my - G.cyp) / s1; zoom.z = z;
    clampZoom(); hover = pick(ev); redrawDetector();
  }, { passive: false });
  cv.addEventListener("dblclick", () => { zoom.reset(); clampZoom(); redrawDetector(); });
  $("dzReset").addEventListener("click", () => { zoom.reset(); clampZoom(); redrawDetector(); });
}

// ------------------------------------------------------------------ the All-arms view (arms.js)
// a preset's full state
function presetState(p) {
  const st = clone(DEF);
  for (const k of Object.keys(p.state)) { if (k === "g" || k === "e") Object.assign(st[k], p.state[k]); else st[k] = p.state[k]; }
  return st;
}
// a state that is a preset's, apart from the drawing options
function samePreset(st, p) {
  const strip = x => JSON.stringify({ ...x, arms: false, g: Object.fromEntries(Object.entries(x.g).filter(([k]) => !DRAWING_KEYS.has(k))), e: Object.fromEntries(Object.entries(x.e).filter(([k]) => !DRAWING_KEYS.has(k))) });
  return strip(presetState(p)) === strip(st);
}
// the state an arm is drawn with: its own (edited or preset), with the shared controls from the page
function armState(id) {
  const q = PRESETS.find(x => x.id === id);
  if (!q) return null;
  const st = armsEdits[id] ? clone(armsEdits[id]) : presetState(q), sh = ARMS.shared(armsInst), sc = st.mode === "echelle" ? "e" : "g", sc0 = S.mode === "echelle" ? "e" : "g";
  for (const k of sh.top) st[k] = S[k];
  if (sc === sc0) for (const k of sh.m) st[sc][k] = S[sc0][k];
  st.g.view = S.g.view; st.e.view = S.e.view; st.arms = true;
  return st;
}
// the controls move to another arm: the page's state is kept as this arm's, and the other arm's comes back
function armsSwitch(id) {
  if (!armsOn() || !id || id === armsActive || !armsInst || !ARMS.armIds(armsInst).includes(id)) return;
  armsEdits[armsActive] = clone(S);
  const st = armState(id), q = PRESETS.find(x => x.id === id);
  delete armsEdits[id];
  S = st; armsActive = id; presetId = samePreset(st, q) ? id : "custom";
  showPreset(id); zoom.reset(); schedule();
}
const armsBufs = {};
let armsLast = null, armsCapX = 0;
function renderArms() {
  const arms = ARMS.armIds(armsInst).map(id => {
    const q = PRESETS.find(x => x.id === id);
    if (!q) return null;
    const st = id === armsActive ? S : armState(id), save = S;
    S = st; const Pa = params(); S = save;
    return { id, name: q.setting || q.name, P: Pa, D: id === armsActive ? cur : IX.design(Pa), edited: id === armsActive ? presetId === "custom" : !samePreset(st, q) };
  }).filter(Boolean);
  armsLast = arms;
  if (window.ANIM) window.ANIM.set($("cvL"), []);
  // the caption first, so that the drawing keeps clear of it (it follows the scale bar, as in the one-arm view)
  const capEl = $("lSub");
  capEl.textContent = ARMS.caption(arms, armsInst, armsActive);
  capEl.hidden = false;
  if (armsCapX) capEl.style.setProperty("--capL", ($("cvL").offsetLeft + armsCapX) + "px");
  const info = ARMS.drawLayout($("cvL"), arms, armsInst, armsActive, capEl.offsetHeight);
  armsCapX = info.capX;
  ARMS.drawDetectors($("cvD"), arms, armsInst, armsActive, armsBufs);
  detGeom = null; hover = null;
  $("dzReset").hidden = true;
  $("stats").innerHTML = ARMS.stats(arms, armsActive, new Set(arms.filter(a => a.edited).map(a => a.id)));
  const live = arms.find(a => !a.D.bad && a.D.c);
  $("dSub").innerHTML = live ? detLegend(live.D, live.P) : "";
  capEl.style.setProperty("--capL", ($("cvL").offsetLeft + info.capX) + "px");
  scheduleHash();
}
// a click on an arm (in the layout, on a chip, or in the stats strip) gives it the controls
$("cvL").addEventListener("click", ev => { if (!armsOn()) return; const r = $("cvL").getBoundingClientRect(); armsSwitch(ARMS.hitLayout(ev.clientX - r.left, ev.clientY - r.top)); });
$("cvD").addEventListener("click", ev => { if (!armsOn()) return; const r = $("cvD").getBoundingClientRect(); armsSwitch(ARMS.hitDetector(ev.clientX - r.left, ev.clientY - r.top)); });
$("stats").addEventListener("click", ev => { if (!armsOn()) return; const el = ev.target.closest("[data-arm]"); if (el) armsSwitch(el.dataset.arm); });
for (const [id, hit] of [["cvL", (x, y) => ARMS.hitLayout(x, y)], ["cvD", (x, y) => ARMS.hitDetector(x, y)]]) {
  $(id).addEventListener("mousemove", ev => {
    if (!armsOn()) return;
    const r = $(id).getBoundingClientRect(), a = hit(ev.clientX - r.left, ev.clientY - r.top);
    $(id).style.cursor = a && a !== armsActive ? "pointer" : "";
  });
}

// ------------------------------------------------------------------ main loop
let cur = null, curP = null, pending = false;
function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
function render() {
  pending = false;
  // (an All-arms link without its arm: the arm of the preset)
  if (inst === "spec" && S.arms && !armsInst) { const p = PRESETS.find(q => q.id === presetId); if (p && ARMS && ARMS.group(p.inst)) { armsInst = p.inst; armsActive = p.id; } else S.arms = false; }
  syncControls();
  if (inst === "img") { IMG.render(); scheduleHash(); return; }
  if (inst === "tel") { TEL.render(); scheduleHash(); return; }
  if (inst === "int") { INT.render(); scheduleHash(); return; }
  curP = params();
  cur = IX.design(curP);
  // a wide detector chip (2k x 4k and the like) leaves room: the layout panel takes more of the width
  document.querySelector(".panels").classList.toggle("lwide", !cur.bad && cur.Lx > 0 && cur.Lx / cur.Ly >= 1.5);
  if (curP.mode === "grating" && curP.gType === "trans" && (M().tAlpha === null || M().tAlpha === undefined) && cur.alpha) {
    if (document.activeElement !== $("sTA")) $("sTA").value = String(cur.alpha / IX.DEG);
    $("vTA").textContent = (cur.alpha / IX.DEG).toFixed(1) + "°";   // the symmetric setting ("Angles α = β" below)
  }
  if (M().fcam > 0 && cur.Fcam > 0) {
    if (document.activeElement !== $("sFc")) $("sFc").value = String(Math.log10(cur.Fcam));
    $("vFc").textContent = "f/" + cur.Fcam.toFixed(2);
  }
  if (!cur.bad && cur.c) cur.objects = objectOffsets(cur, curP);
  renderText(cur, curP);
  fitPanels();
  // the All-arms view (arms.js): each arm designed, the arm the controls set from the page's state and the others from
  // their own earlier edits or their presets, with the controls the arms share (the telescope; for a split in the
  // collimated beam also the slit, fibers and collimator) taken from the page
  if (armsOn()) { renderArms(); return; }
  drawLayout(cur, curP);
  if ((M().layLen === null || M().layLen === undefined) && lastD1Auto !== null) {
    if (document.activeElement !== $("sLL")) $("sLL").value = String(Math.log10(Math.max(10, lastD1Auto)));
    $("vLL").textContent = sig(lastD1Auto, 3) + " mm (auto)";
  }
  if ((M().camLen === null || M().camLen === undefined) && lastD2Auto !== null) {
    if (document.activeElement !== $("sCL")) $("sCL").value = String(Math.log10(Math.max(10, lastD2Auto)));
    $("vCL").textContent = sig(lastD2Auto, 3) + " mm (auto)";
  }
  if (M().col === "mirror" && (M().colTilt === null || M().colTilt === undefined) && lastTauAuto !== null) {
    if (document.activeElement !== $("sCT")) $("sCT").value = String(lastTauAuto / IX.DEG);
    $("vCT").textContent = (lastTauAuto / IX.DEG).toFixed(1) + "° (auto)";
  }
  hover = null;                                   // the readout under the pointer is for the old design
  drawRight();
  scheduleHash();
}
// the right-hand panel: the spectra as they fall on the detector, in both modes
function drawRight() {
  if (!cur) return;
  buildTraces(cur, curP); drawDetector(cur, curP);
}
function redrawDetector() { if (cur) drawDetector(cur, curP); }
// The two panels take the height the window has left after the header, the strip and the controls, so the
// controls end at the window's bottom in every mode (a fixed 100vh - 520 px left blank space under the shorter
// control rows). On a phone, and while the layout is expanded, the stylesheet's height stands.
// The header note stays on one line: in its place beside the preset menu when it fits there, else on a line of its own
// under the bar (Charlie's choice once the third mode button left too little room at large default fonts). Measured,
// so it follows the reader's font size; re-checked whenever the bar changes size. The Interferometer's note keeps its
// own width and the menu shrinks instead (style.css), so there the note also goes below when the note squeezes the
// menu (at 1100 px the menu showed one letter): the menu's width beside the note against its width without the note.
function fitHeader() {
  const bar = document.querySelector(".bar"), n = document.querySelector(".presetnote"), sel = document.getElementById("preset");
  if (!bar || !n) return;
  bar.classList.remove("note-below");
  n.style.whiteSpace = "nowrap"; const need = n.scrollWidth; n.style.whiteSpace = "";
  let squeezed = false;
  if (document.body.classList.contains("inst-int") && sel && sel.offsetParent !== null) {
    const w1 = sel.getBoundingClientRect().width;
    n.style.display = "none"; const w0 = sel.getBoundingClientRect().width; n.style.display = "";
    squeezed = w1 < w0 - 1;
  }
  bar.classList.toggle("note-below", n.getBoundingClientRect().width < need - 0.5 || squeezed);
}
// (deferred a frame: changing the header inside the observer's own callback would re-trigger it in the same frame)
let hdrRAF = 0;
if (window.ResizeObserver) new ResizeObserver(() => { cancelAnimationFrame(hdrRAF); hdrRAF = requestAnimationFrame(fitHeader); }).observe(document.querySelector("header"));
const PH_MIN = 235, PH_MAX = 1100;
function fitPanels() {
  fitHeader();
  const root = document.documentElement;
  if (innerWidth <= 860) { const had = !!root.style.getPropertyValue("--ph"); root.style.removeProperty("--ph"); return had; }
  if (lvExpanded) return false;
  // (in the Telescopes mode the layout's height sets the left column's, and the pupil-and-image panel stretches to it)
  const h0 = $(inst === "img" ? "cvS" : inst === "tel" ? "cvTL" : inst === "int" ? "cvA" : "cvD").clientHeight, ctl = document.querySelector(inst === "img" ? ".controls.only-img" : inst === "tel" ? ".tcontrols" : inst === "int" ? ".rcontrols" : ".controls.only-spec");
  if (!h0 || !ctl) return false;
  const want = Math.round(Math.min(PH_MAX, Math.max(PH_MIN, h0 + innerHeight - 6 - (ctl.getBoundingClientRect().bottom + scrollY))));
  if (Math.abs(want - h0) < 1) return false;
  root.style.setProperty("--ph", want + "px");
  return true;
}
window.addEventListener("resize", () => { fitPanels(); if (inst === "img") { IMG.redraw(); return; } if (inst === "tel") { TEL.redraw(); return; } if (inst === "int") { INT.redraw(); return; } if (cur) { drawLayout(cur, curP); drawRight(); } });

// test hooks
window.__instex = {
  state: () => clone(S), design: () => cur, params: () => curP, spGeo: () => spGeo, rot3: () => ({ m: R3.m.map(r => r.slice()), az: R3.az, el: R3.el }),
  set: o => { for (const k of Object.keys(o)) { if (k === "g" || k === "e") Object.assign(S[k], o[k]); else S[k] = o[k]; } markCustom(); render(); },
  preset: id => { const p = PRESETS.find(q => q.id === id); if (p) { applyPreset(p); render(); } return !!p; },
  inst: v => { if (v) { inst = v; render(); } return inst; }, img: () => IMG.test, tel: () => TEL.test, int: () => INT.test,
  arms: () => ({ on: armsOn(), inst: armsInst, active: armsActive, edits: Object.keys(armsEdits), preset: presetId, setting: $("setting").value, settingShown: !$("settingLab").hidden,
    arms: (armsLast || []).map(a => ({ id: a.id, name: a.name, bad: !!a.D.bad, range: a.D.range, edited: a.edited, D: a.P.D, slitW: a.P.slitW, W: a.P.W })), layout: ARMS && ARMS.test() }),
  armsSwitch: id => { armsSwitch(id); render(); }, armsGroups: () => (ARMS ? Object.keys(ARMS.GROUPS).map(k => [k, ARMS.armIds(k)]) : []), setting: v => { $("setting").value = v; $("setting").dispatchEvent(new Event("change")); render(); },
  hover: () => hover, zoom: () => ({ z: zoom.z, cx: zoom.cx, cy: zoom.cy }), lview: () => ({ ...lview }), detGeom: () => detGeom && { ...detGeom }, labels: () => placedLabels.map(l => ({ ...l })),
};

// the imager: its own module, handed the shared helpers
ARMS = window.ARMSAPP ? window.ARMSAPP({ fitCanvas, lamRGB, rgba, sig, grp, mm, FONT, INK, MUTED, LINE, message, makeTraces, splatTraces }) : null;
IMG = window.IMGAPP({ $, sig, grp, fitCanvas, rows, INK, MUTED, LINE, FONT, frampRGB, rampRGB, rgba, message, schedule, scheduleHash, fitPanels, ICON_EXPAND, ICON_COLLAPSE });
TEL = window.TELAPP({ $, sig, grp, fitCanvas, rows, INK, MUTED, LINE, FONT, rgba, message, schedule, scheduleHash, fitPanels, ICON_EXPAND, ICON_COLLAPSE }, IMG);
INT = window.INTAPP({ $, sig, grp, fitCanvas, rows, INK, MUTED, LINE, FONT, rgba, message, schedule, scheduleHash, fitPanels }, IMG);
const RESET_TITLE = { spec: $("reset").title, img: "Back to the defaults for the whole imager: a 4 m f/3 prime-focus telescope with a 3 × 3 mosaic of 4k × 4k chips.", tel: "Back to the first telescope at its first focus.", int: "Back to the defaults for this array: its default configuration, band and source." };
function syncInst() {
  $("iSpec").setAttribute("aria-pressed", String(inst === "spec"));
  $("iImg").setAttribute("aria-pressed", String(inst === "img"));
  $("iTelMode").setAttribute("aria-pressed", String(inst === "tel"));
  $("iIntMode").setAttribute("aria-pressed", String(inst === "int"));
  $("reset").title = RESET_TITLE[inst];
}
for (const [id, v] of [["iSpec", "spec"], ["iImg", "img"], ["iTelMode", "tel"], ["iIntMode", "int"]]) $(id).addEventListener("click", () => {
  if (inst === v) return;
  if (window.ANIM) window.ANIM.reset();                          // a new mode: the pulses off
  inst = v; zoom.reset(); lview.fit = true; stopCoast(); schedule();
});
readHash();
render();
// a link edited in the address bar (the page's own updates use replaceState, which fires no event)
window.addEventListener("hashchange", () => {
  if (location.hash === lastHash) return;
  S = clone(DEF); presetId = "custom"; inst = "spec"; IMG.reset(); readHash(); zoom.reset(); lview.fit = true; render();
});
})();
