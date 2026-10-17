/* Page logic for the Instrument Explorer: the controls, the results strip, the optical layout and
   the detector.  All optics are in physics.js (window.IX). */
(function () {
"use strict";
const IX = window.IX;
const $ = id => document.getElementById(id);
const errBox = $("err");
window.addEventListener("error", e => { errBox.hidden = false; errBox.textContent += (e.message || String(e)) + "\n"; });

// ------------------------------------------------------------------ state
// The telescope is shared; each mode keeps its own entrance, spectrograph, disperser and detector.
const DEF = {
  mode: "grating",
  D: 6.5, F: 5,
  g: { slitW: 1, traceW: null, nObj: 1, col: "lens", colTilt: null, layLen: null, foldOn: false, foldAng: 90, foldPos: 0.5, gFlip: false, annot: true, view: "spectral", spPts: 3, spPos: 0.5,
       W: 100, Fc: 1.6, fcam: null, gType: "trans", G: 1200, m: 1, lamB1: 5000, lamC: 5500, psi: 35, tAlpha: null, gA: 25, gGlass: "N-BK7", gKind: "ruled", gTilt: 0, Nx: 4096, Ny: 2048, pix: 15 },
  e: { slitW: 0.5, traceW: null, nObj: 1, col: "lens", colTilt: null, layLen: null, foldOn: false, foldAng: 90, foldPos: 0.5, gFlip: false, annot: true,
       W: 150, Fc: 3.0, fcam: null, eG: 31.6, eDelta: 63.435, gamma: 1, theta: 0, xd: "grating", xG: 300, xPsi: 10,
       xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 5500, Nx: 4096, Ny: 4096, pix: 15 },
};
const clone = o => JSON.parse(JSON.stringify(o));
let S = clone(DEF);
const M = () => (S.mode === "grating" ? S.g : S.e);

// presets: filled from data/presets (see README); each sets the full state
const PRESETS = window.IX_PRESETS || [];
let presetId = "custom";

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
  ["sCT", "colTilt", "m", false, false, v => v.toFixed(1) + "°"],
  ["sLL", "layLen", "m", true, false, v => sig(v, 3) + " mm"],
  ["sFA", "foldAng", "m", false, false, v => v.toFixed(0) + "°"],
  ["sFP", "foldPos", "m", false, false, v => v.toFixed(2)],
  ["sGam", "gamma", "m", false, false, v => v.toFixed(1) + "°"],
  ["sG", "G", "m", true, false, v => sig(v, 3) + " /mm"],
  ["sM", "m", "m", false, true, v => String(v)],
  ["sLB", "lamB1", "m", true, false, v => grp(v) + " Å, 1st order"],
  ["sEG", "eG", "m", true, false, v => sig(v, 3) + " /mm"],
  ["sED", "eDelta", "m", false, false, v => "R" + Math.tan(v * IX.DEG).toFixed(2) + " · " + v.toFixed(1) + "°"],
  ["sXG", "xG", "m", true, false, v => sig(v, 3) + " /mm"],
  ["sXA", "xA", "m", false, false, v => v.toFixed(1) + "°"],
  ["sLC", "lamC", "m", true, false, v => grp(v) + " Å"],
  ["sNx", "Nx", "m", true, true, v => grp(v)],
  ["sNy", "Ny", "m", true, true, v => grp(v)],
  ["sPix", "pix", "m", false, false, v => sig(v, 3) + " µm"],
];
const obj = scope => (scope === "s" ? S : M());

function markCustom() {
  presetId = "custom";
  $("preset").value = "custom";
}
for (const [id, key, scope, lg, intg] of SL) {
  $(id).addEventListener("input", () => {
    let v = Number($(id).value);
    if (lg) v = Math.pow(10, v);
    if (intg) v = Math.max(1, Math.round(v));
    obj(scope)[key] = v;
    if (id === "sFc") M().fcam = null;
    if (id === "sSW") M().traceW = null;
    if (id === "sXA") S.e.xPrisms = null;
    if (id === "sNx" || id === "sNy" || id === "sPix") $("detSel").value = "custom";
    markCustom();
    schedule();
  });
}
function bindSeg(pairs, get, set) {
  for (const [id, val] of pairs) $(id).addEventListener("click", () => { set(val); markCustom(); schedule(); });
  return () => { for (const [id, val] of pairs) $(id).setAttribute("aria-pressed", String(get() === val)); };
}
const segs = [
  bindSeg([["mGrat", "grating"], ["mEch", "echelle"]], () => S.mode, v => { S.mode = v; zoom.reset(); lview.fit = true; }),
  bindSeg([["gRefl", "refl"], ["gTr", "trans"], ["gGm", "grism"]], () => S.g.gType, v => {
    if (v === "grism" && S.g.gType !== "grism") {
      // start the grism with λ0 at the current central wavelength: sin A = m G λc / (n − 1) (ruled), coarser
      // ruling if no apex angle can do it
      const lc = S.g.lamC / 1e4, n = IX.nGlass(S.g.gGlass || "N-BK7", lc) || 1.5, sA = G => S.g.m * G / 1000 * lc / (n - 1);
      if (S.g.gKind !== "vph" && sA(S.g.G) > 0.8) S.g.G = 300;
      if (S.g.gKind !== "vph" && sA(S.g.G) <= 0.8) S.g.gA = Math.asin(sA(S.g.G)) / IX.DEG;
    }
    S.g.gType = v;
  }),
  bindSeg([["gkR", "ruled"], ["gkV", "vph"]], () => (S.g.gKind === "vph" ? "vph" : "ruled"), v => { S.g.gKind = v; }),
  bindSeg([["cLens", "lens"], ["cMirror", "mirror"]], () => M().col, v => { M().col = v; }),
  bindSeg([["foOff", false], ["foOn", true]], () => !!M().foldOn, v => { M().foldOn = v; }),
  bindSeg([["gfOff", false], ["gfOn", true]], () => !!M().gFlip, v => { M().gFlip = v; }),
  bindSeg([["anOn", true], ["anOff", false]], () => M().annot !== false, v => { M().annot = v; }),
  bindSeg([["vSpec", "spectral"], ["vSpat", "spatial"]], () => S.g.view || "spectral", v => { S.g.view = v; lview.fit = true; }),
  bindSeg([["sp3", 3], ["sp1", 1]], () => (S.g.spPts === 1 ? 1 : 3), v => { S.g.spPts = v; }),
  bindSeg([["xGr", "grating"], ["xVp", "vph"], ["xPr", "prism"], ["xGm", "grism"]], () => S.e.xd, v => { S.e.xd = v; }),
  bindSeg([["p1", 1], ["p2", 2]], () => (S.e.xPrisms ? 0 : S.e.xPasses), v => { S.e.xPasses = v; S.e.xPrisms = null; }),
];
// glass list
const gsel = $("xGlass");
for (const k of Object.keys(IX.GLASS)) {
  if (k.startsWith("__")) continue;
  const o = document.createElement("option"); o.value = k; o.textContent = IX.GLASS[k].label || k; gsel.appendChild(o);
}
gsel.addEventListener("change", () => { S.e.xGlass = gsel.value; S.e.xPrisms = null; markCustom(); schedule(); });
// the grism's glass (grating mode)
const ggsel = $("gGlass");
for (const k of Object.keys(IX.GLASS)) {
  if (k.startsWith("__")) continue;
  const o = document.createElement("option"); o.value = k; o.textContent = IX.GLASS[k].label || k; ggsel.appendChild(o);
}
ggsel.addEventListener("change", () => { S.g.gGlass = ggsel.value; markCustom(); schedule(); });
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
{ const o = document.createElement("option"); o.value = "custom"; o.textContent = "Custom"; psel.appendChild(o); }
// grouped by telescope, largest aperture first; inside a group the telescope prefix is dropped
{
  const groups = [];
  for (const p of PRESETS) {
    const t = p.tel || "Other";
    let gr = groups.find(x => x.t === t);
    if (!gr) { gr = { t, D: p.state.D, ps: [] }; groups.push(gr); }
    gr.ps.push(p);
  }
  groups.sort((x, y) => y.D - x.D || x.t.localeCompare(y.t));
  for (const gr of groups) {
    const og = document.createElement("optgroup"); og.label = gr.t;
    for (const p of gr.ps) { const o = document.createElement("option"); o.value = p.id; o.textContent = p.name.replace(/^[^/]*\/\s*/, ""); og.appendChild(o); }
    psel.appendChild(og);
  }
}
psel.addEventListener("change", () => {
  const p = PRESETS.find(q => q.id === psel.value);
  if (!p) { presetId = "custom"; return; }
  applyPreset(p);
});
function applyPreset(p) {
  const st = clone(DEF);
  for (const k of Object.keys(p.state)) {
    if (k === "g" || k === "e") Object.assign(st[k], p.state[k]);
    else st[k] = p.state[k];
  }
  S = st; presetId = p.id; psel.value = p.id; zoom.reset(); lview.fit = true; schedule();
}
$("reset").addEventListener("click", () => { S = clone(DEF); presetId = "custom"; psel.value = "custom"; zoom.reset(); lview.fit = true; schedule(); });

function syncControls() {
  for (const [id, key, scope, lg, , fmt] of SL) {
    const o = obj(scope), v = o[key];
    if (v === undefined || v === null) continue;
    const el = $(id);
    if (document.activeElement !== el) el.value = String(lg ? Math.log10(v) : v);
    $("v" + id.slice(1)).textContent = fmt(v);
  }
  segs.forEach(f => f());
  const b = document.body;
  b.className = [
    S.mode === "grating" ? "m-grat" : "m-ech",
    S.g.gType === "trans" ? "g-tr" : S.g.gType === "grism" ? "g-gr" : "g-refl",
    "c-" + M().col,
    M().foldOn ? "fold-on" : "fold-off",
    S.mode === "grating" && S.g.view === "spatial" ? "v-spatial" : "v-spectral",
    lvExpanded ? "lv-expanded" : "",                           // kept across re-renders (the class list is rebuilt)
    "x-" + S.e.xd,
  ].join(" ");
  gsel.value = S.e.xGlass;
  ggsel.value = S.g.gGlass || "N-BK7";
  const m = M(), di = DETS.findIndex(d => d.Nx === m.Nx && d.Ny === m.Ny && d.pix === m.pix);
  dsel.value = di >= 0 ? String(di) : "custom";
  psel.value = presetId;
}

function params() {
  const m = M();
  const P = {
    mode: S.mode, D: S.D, F: S.F, feed: "slit", slitW: m.slitW, N: 1, slitL: 0, nObj: m.nObj, traceW: m.traceW, col: m.col, colTilt: m.colTilt, layLen: m.layLen, foldOn: m.foldOn, foldAng: m.foldAng, foldPos: m.foldPos, gFlip: m.gFlip, annot: m.annot, view: m.view, spPts: m.spPts, spPos: m.spPos, W: m.W, Fc: m.Fc, fcam: m.fcam, Nx: m.Nx, Ny: m.Ny, pix: m.pix, lamC: m.lamC,
  };
  if (S.mode === "grating") Object.assign(P, { gType: m.gType, G: m.G, m: m.m, lamB: m.lamB1 / m.m, psi: m.psi, tAlpha: m.tAlpha, gA: m.gA, gGlass: m.gGlass, gKind: m.gKind, gTilt: m.gTilt || 0 });
  else Object.assign(P, { eG: m.eG, eDelta: m.eDelta, gamma: m.gamma, theta: m.theta, xd: m.xd, xG: m.xG, xPsi: m.xPsi,
                          xGlass: m.xGlass, xA: m.xA, xPasses: m.xPasses, xPrisms: m.xPrisms });
  return P;
}

// ------------------------------------------------------------------ URL hash
const SHARED = ["mode", "D", "F"];
function writeHash() {
  const parts = [];
  const put = (k, v, d) => { if (v !== d && v !== null) parts.push(k + "=" + encodeURIComponent(typeof v === "number" ? +v.toPrecision(7) : typeof v === "object" ? JSON.stringify(v) : v)); };
  for (const k of SHARED) put(k, S[k], DEF[k]);
  for (const sc of ["g", "e"]) for (const k of Object.keys(DEF[sc])) put(sc + "." + k, S[sc][k], DEF[sc][k]);
  if (presetId !== "custom") parts.push("preset=" + presetId);
  try { history.replaceState(null, "", parts.length ? "#" + parts.join("&") : location.pathname + location.search); } catch (e) { /* file:// */ }
}
function readHash() {
  const h = location.hash.slice(1);
  if (!h) return;
  const kv = {};
  for (const p of h.split("&")) { const [k, v] = p.split("="); if (k) kv[k] = decodeURIComponent(v || ""); }
  if (kv.preset) { const p = PRESETS.find(q => q.id === kv.preset); if (p) applyPreset(p); }
  const conv = (d, v) => { if (typeof d === "boolean") return v === "true"; if (v[0] === "[") { try { return JSON.parse(v); } catch (e) { return null; } } return typeof d === "number" || (d === null && v !== "" && isFinite(Number(v))) ? Number(v) : v; };
  for (const k of SHARED) if (k in kv) S[k] = conv(DEF[k], kv[k]);
  for (const sc of ["g", "e"]) for (const k of Object.keys(DEF[sc])) if (sc + "." + k in kv) S[sc][k] = conv(DEF[sc][k], kv[sc + "." + k]);
  if (kv.preset && Object.keys(kv).length > 1) {
    // a preset with later changes is no longer the preset
    const p = PRESETS.find(q => q.id === kv.preset);
    if (p) { const ref = clone(DEF); Object.assign(ref, p.state); presetId = kv.preset; }
  }
}

// ------------------------------------------------------------------ canvases
function fitCanvas(c) {
  const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const g = c.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { g, w, h };
}
const INK = "#1a1a1a", MUTED = "#6a6560", LINE = "#ded9d0";
const FONT = 'Charter, "PT Serif", Palatino, Georgia, serif';
// beam colors in the layout (light background): blue end, center, red end
const BEAM = { lo: [28, 95, 168], c: [92, 86, 80], hi: [178, 107, 0] };
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
    let cov = Dz.range ? fA(Dz.range[0]) + "–" + fA(Dz.range[1]) + " Å" : "–";
    let covSub = "";
    if (ech && Dz.orders.length) covSub = `<small> ${Dz.orders.length} orders${Dz.gaps && Dz.gaps.length ? ", gaps" : ""}</small>`;
    const items = [
      ["big", "Resolving power", fmtR(c.Reff), `Effective R at the central wavelength: the slit image, the grating's diffraction limit and one pixel added in quadrature (the slit by itself gives ${fmtR(c.Rs)}).`],
      ["", "Resolution", sig(c.dlamRes, 3) + " Å <small>" + sig(c.dv, 3) + " km/s</small>", "FWHM of a resolution element at the central wavelength."],
      ["", "Coverage", cov + covSub, ech ? "Wavelengths reaching the detector over all orders (slit center)." : "Wavelengths reaching the detector (slit center)."],
      ["", "Dispersion", sig(c.dlpix, 3) + " Å/px", "Wavelength per pixel along the dispersion at the central wavelength."],
      ["", "Spatial scale", sig(c.pixScale, 3) + "″/px", "Arcseconds on the sky per pixel along the slit (the spatial direction): 206265 p W / (D f_cam); the telescope focal ratio drops out. Along the dispersion one pixel covers the Dispersion figure in wavelength."],
      ["", "Sampling, λ × spatial", sig(c.npix, 3) + " × " + sig((P.traceW > 0 ? P.traceW : P.slitW) / c.pixScale, 3) + " px",
        "Spectral: pixels across one resolution element along the dispersion (the FWHM of the slit image; below 2 the spectrum is undersampled). Spatial: pixels across the FWHM of a trace perpendicular to the dispersion, the slit (or fiber) width imaged along the slit; for a slit spectrograph the star's seeing sets the real spatial profile, and the slit width is only a proxy for that profile. The two differ by the grating's anamorphic factor (and a preset's separate fiber width)."],
    ];
    let html = items.map(([cls, k, v, t]) => `<div class="stat ${cls}" title="${t}"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
    const fl = Dz.flags.map(f => `<span class="flag">${f.txt}</span>`).join("");
    html += `<div class="flags">${fl}</div>`;
    st.innerHTML = html;
  }
  // readouts
  const ftel = Dz.ftel;
  rows($("rTel"), [
    ["Focal length", mm(ftel)],
    ["Plate scale", sig(Dz.plate, 3) + "″/mm"],
  ]);
  const ent = [["At the focus", sig(Dz.slitFocus * 1000, 3) + " µm wide", "Slit width at the telescope focus: φ F_tel D."]];
  if (Dz.objects && Dz.objects.n > 1) ent.push(["Gap between spectra", sig(Dz.objects.gapPx, 3) + " px", P.mode === "echelle" ? "The spectra of the objects are stacked within the smallest spacing between orders." : "The spectra of the objects spread evenly over the height of the detector."]);
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
    if (P.gType === "grism") {
      const gr = Dz.grism;
      dis.push(["Undeviated λ0", grp(gr.lam0 * 1e4) + " Å", gr.vph ? "The wavelength that leaves along the collimator axis, at the detector center: m G λ0 = 2 n sin(A − t), sin t = sin A / n (the outer faces refract the beam to the Bragg angle at the VPH layer and back)." : "The wavelength that leaves along the collimator axis, at the detector center: m G λ0 = (n − 1) sin A. A grism has no tilt, so λ0 is fixed by the grism itself."]);
      dis.push(["Glass index n(λ0)", gr.n0.toFixed(4), gr.vph ? "Of the prisms. The beam meets the VPH layer at " + deg(gr.inner) + " inside the glass." : "Of the prism; the light leaves the ruled hypotenuse at A = " + deg(gr.A) + " from its normal."]);
      dis.push(["Camera angle", "0° (on axis)", "A grism passes λ0 straight through: the camera sits on the collimator axis."]);
    } else if (P.gType === "trans") {
      if (Math.abs(Dz.alpha - Dz.beta) < 1e-9) dis.push(["Angles α = β", deg(Dz.alpha), "Symmetric (Littrow, or Bragg for a volume-phase grating) setting for the central wavelength."]);
      else dis.push(["Angles α, β", (Dz.alpha / IX.DEG).toFixed(1) + "°, " + (Dz.beta / IX.DEG).toFixed(1) + "°", "Angle of incidence (fixed by the preset) and of diffraction of the central wavelength."]);
      dis.push(["Camera angle", deg(Dz.psi), "Deviation α + β of the central wavelength: the camera's angle to the collimator axis."]);
    } else {
      dis.push(["Angles α, β", (Dz.alpha / IX.DEG).toFixed(1) + "°, " + (Dz.beta / IX.DEG).toFixed(1) + "°", "Angle of incidence and of diffraction of the central wavelength, from the grating normal."]);
      if (Dz.delta !== null) dis.push(["Blaze angle δ", deg(Dz.delta)]);
    }
    dis.push(["Beam footprint", sig(Dz.Lg, 3) + " × " + sig(P.W, 3) + " mm", "The area the collimated beam covers on the grating: W / cos α along the dispersion (the beam stretched by the grating tilt) by W along the grooves. The footprint is the minimum ruled area the grating needs (the physical grating is larger) and sets the diffraction limit m N.", true]);
    if (Dz.c && Dz.c.eff !== null) dis.push(["Blaze efficiency at λc", pct(Dz.c.eff), "Relative to the blaze peak (scalar sinc² envelope)."]);
  } else {
    const os = Dz.orders || [];
    if (os.length) dis.push(["Orders", os[os.length - 1].m + "–" + os[0].m]);
    if (Dz.c) dis.push(["FSR", sig(P.lamC / Dz.mRef, 3) + " Å", "Free spectral range: λ / m at the central wavelength, the wavelength span of one order before the next order begins."]);
    if (isFinite(Dz.minSep)) dis.push(["Order gap", Math.round(Dz.minSep) + " px = " + sig(Dz.minSep * Dz.c.pixScale, 2) + "″", "The smallest separation between adjacent orders (above 3200 Å) at the blaze: the longest slit that fits between the two orders."]);
    dis.push(["Beam footprint", sig(Dz.Lg, 3) + " × " + sig(P.W, 3) + " mm", "The area the collimated beam covers on the grating: W / cos α along the dispersion (the beam stretched by the grating tilt) by W along the grooves. The footprint is the minimum ruled area the grating needs (the physical grating is larger) and sets the diffraction limit m N.", true]);
    if (P.xPrisms && P.xPrisms.length) {
      // a palindromic train is one set of prisms passed twice; group repeated prisms
      let tr = P.xPrisms, dbl = false;
      const key = q => q.glass + "|" + q.A;
      if (tr.length % 2 === 0 && tr.every((q, i) => key(q) === key(tr[tr.length - 1 - i]))) { tr = tr.slice(0, tr.length / 2); dbl = true; }
      const groups = [];
      for (const q of tr) { const g = groups[groups.length - 1]; if (g && key(g.q) === key(q)) g.n++; else groups.push({ q, n: 1 }); }
      const nm = q => ((IX.GLASS[q.glass] || {}).label || q.glass).replace(/ 301| at 105 K/g, "");
      dis.push(["Prisms", groups.map(g => (g.n > 1 ? g.n + " × " : "") + g.q.A + "° " + nm(g.q)).join(" + ") + (dbl ? ", double pass" : ""), "The cross-dispersing prisms, each at minimum deviation for the central wavelength.", true]);
    }
    if (Dz.xdDev && !(P.xPrisms && P.xPrisms.length)) dis.push(["Prism deviation", deg(Dz.xdDev)]);
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
let lastD1Auto = null;           // the automatic collimated-beam length, likewise
// the layout view: mm -> canvas px scale s and the canvas position (ox, oy) of the slit
const lview = { mode: "auto", s: 0, ox: 0, oy: 0, fit: true };
function drawLayout(Dz, P) {
  const { g, w, h } = fitCanvas($("cvL"));
  g.clearRect(0, 0, w, h);
  if (Dz.bad || !Dz.c) { message(g, w, h, Dz.bad || "No light reaches the detector"); $("lSub").textContent = ""; return; }
  const ech = P.mode === "echelle", trans = P.gType === "trans" && !ech, grism = P.gType === "grism" && !ech && !!Dz.grism;
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
  if (ech) {
    const psiD = 30 * IX.DEG;                                     // schematic: the real separation is out of the plane
    ac = v2(-Math.cos(psiD), Math.sin(psiD));
    const th = Math.abs(P.theta || 0);
    $("lSub").textContent = P.gamma > 0 ? "camera arm drawn at 30° (really 2γ = " + (2 * P.gamma).toFixed(1) + "° out of plane)"
      : th > 0 ? "camera arm drawn at 30° (really 2θ = " + (2 * th).toFixed(1) + "°)"
      : "camera arm drawn at 30° (really Littrow)";
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
  } else fan = [["lo", Dz.range[0], Dz.order], ["c", P.lamC / 1e4, Dz.order], ["hi", Dz.range[1], Dz.order]];
  const beams = fan.map(([k, l, m]) => {
    const p = Dz.pos(l, m);
    const X = p ? p[0] : 0, ph = Math.atan(X / fcam);
    return { k, l, X, b: addv(sc(ac, Math.cos(ph)), sc(xd, Math.sin(ph))) };
  });
  const Wp = Math.max(W, Dz.Wp);
  // spacing between the elements is not part of the design: choose it so the camera arm clears
  // the incoming beam (when the camera-collimator angle allows) and the camera clears the collimator
  const tf = Math.tan(Math.max(...beams.map(bm => Math.abs(Math.atan(bm.X / fcam)))));
  const sinPsi = Math.abs(ac[1]), cosPsi = -ac[0];
  let d2 = 0.6 * Wp + 0.1 * fcam + (ech ? 1.2 * Wp : 0) + (trans || grism ? 0.8 * Wp + 0.1 * fcam : 0);
  if (sinPsi > 0.2 && cosPsi > 0) for (let it = 0; it < 3; it++) d2 = Math.max(d2, (0.55 * W + 0.55 * Wp + d2 * tf + 0.25 * W) / sinPsi);
  if (cosPsi > 0) d1 = Math.max(d1, d2 * cosPsi + 0.25 * W + 0.06 * fcol);
  if (P.foldOn) d1 = Math.max(d1, 2.2 * W);                    // room for a fold mirror along the way
  lastD1Auto = d1;
  if (P.layLen > 0) d1 = P.layLen;                               // the Layout option: collimated beam length
  Gc[0] = fcol + d1;
  const Fp2 = addv(Gc, sc(tg, W / (2 * Math.cos(a)))), Fm2 = addv(Gc, sc(tg, -W / (2 * Math.cos(a))));
  Fp[0] = Fp2[0]; Fp[1] = Fp2[1]; Fm[0] = Fm2[0]; Fm[1] = Fm2[1];
  const C = addv(Gc, sc(ac, d2));
  const XDc = ech ? addv(Gc, sc(ac, d2 * 0.5)) : null;
  // beam edges where they meet the camera plane
  const hit = (p, b) => { const t = dt(addv(C, sc(p, -1)), ac) / dt(b, ac); return addv(p, sc(b, t)); };
  for (const bm of beams) { bm.Ep = hit(Fp, bm.b); bm.Em = hit(Fm, bm.b); bm.Q = addv(addv(C, sc(ac, fcam)), sc(xd, bm.X)); }
  // the rays drawn: NR wavelengths spanning the detector (grating mode) or the central order (echelle mode)
  const NR = ech ? 5 : 7, lR0 = fan[0][1], lR1 = fan[fan.length - 1][1], mRay = fan[0][2], rays = [];
  for (let j = 0; j < NR; j++) {
    const p = Dz.pos(lR0 + (lR1 - lR0) * j / (NR - 1), mRay);
    if (!p) continue;
    const ph = Math.atan(p[0] / fcam);
    rays.push({ t: j / (NR - 1), X: p[0], b: addv(sc(ac, Math.cos(ph)), sc(xd, Math.sin(ph))), Q: addv(addv(C, sc(ac, fcam)), sc(xd, p[0])) });
  }
  const Lx = Dz.Lx, Dc = addv(C, sc(ac, fcam));
  const det0 = addv(Dc, sc(xd, -Lx / 2)), det1 = addv(Dc, sc(xd, Lx / 2));
  let lensHalf = 0;
  for (const bm of beams) for (const E of [bm.Ep, bm.Em]) lensHalf = Math.max(lensHalf, Math.abs(dt(addv(E, sc(C, -1)), xd)));
  lensHalf *= 1.06;
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
  // Flip grating (Layout option): the grating tilted the other way, so it turns the light to the other side;
  // the grating and everything after it are reflected about the collimated beam's axis (y = 0), which the
  // beam itself is symmetric about.  A mirror image, so no number changes.
  const Mg = p => (P.gFlip ? v2(p[0], -p[1]) : p);
  const Mpost = p => Mf(Mfold(Mg(p)));
  const [Ga, Gb] = P.gFlip ? [Fm, Fp] : [Fp, Fm];               // where the beam's +W/2 and -W/2 edges meet the grating
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
    $("lSub").textContent = (free ? "drag the point along the slit; " : "") + "along the slit, unfolded (a mirror drawn as a lens), at λc; slit image scale f_cam / f_col = " + sig(mag, 2);
  }
  // bounding box (post-collimator points through the fold)
  const pre = [v2(-Lt, tHalf), v2(-Lt, -tHalf), addv(Cm, sc(tm, 0.6 * W)), addv(Cm, sc(tm, -0.6 * W))];
  const post = [Fp, Fm, det0, det1, addv(C, sc(xd, lensHalf)), addv(C, sc(xd, -lensHalf)), ...beams.map(bm => bm.Q)].map(Mpost);
  if (foldOn) post.push(Mf(Qp), Mf(Qm));
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of spatial ? SP.box : [...pre, ...post]) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  const mL = 70, mR = 70, mT = spatial ? 50 : 30, mB = 34;
  // the view: fitted to the panel (Auto scale, and whenever a fit is asked for), else held (Fixed scale)
  const sFit = Math.min((w - mL - mR) / (x1 - x0), (h - mT - mB) / (y1 - y0));
  const oxFit = mL + ((w - mL - mR) - sFit * (x1 - x0)) / 2 - sFit * x0, oyFit = mT + ((h - mT - mB) - sFit * (y1 - y0)) / 2 + sFit * y1;
  if (lview.mode === "auto" || lview.fit || !(lview.s > 0)) { lview.s = sFit; lview.ox = oxFit; lview.oy = oyFit; lview.fit = false; }
  const s = lview.s, ox = lview.ox, oy = lview.oy;
  spGeo = spatial && SP.free ? { hMax: SP.hMax, mag: SP.mag, Ly: SP.Ly, xD: SP.xD, s, ox, oy } : null;
  let fold = false;                                  // true while drawing what comes after the grating's fold(s)
  const T = p => { const q = fold ? Mpost(p) : p; return [ox + s * q[0], oy - s * q[1]]; };
  const poly = (ps, fill, stroke, lw = 1) => {
    g.beginPath(); ps.forEach((p, i) => { const q = T(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath();
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
  };
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
  const path = (pts, col, lw = 1, dash) => {
    g.beginPath(); pts.forEach((p, i) => { const q = T(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
    g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]);
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
  if (spatial) {
    // ---- Spatial view
    const { Ly, hMax, xG, xC, xD, fields } = SP, mmAs = P.D * 1000 * P.F / 206265;   // mm per arcsec at the slit
    const ang = x => (Math.abs(x) >= 60 ? sig(Math.abs(x) / 60, 3) + "′" : sig(Math.abs(x), 3) + "″");
    path([v2(-Lt, 0), v2(xD + 0.05 * fcam, 0)], "rgba(51,55,61,0.4)", 1, [12, 4, 2, 4]);          // the optical axis
    // starlight converging on each point of the slit
    for (const f of fields) {
      const sl = (f.yL - f.h) / fcol;
      poly([v2(-Lt, f.h - sl * Lt + tHalf), v2(0, f.h), v2(-Lt, f.h - sl * Lt - tHalf)], "rgba(236,186,72,0.13)", null);
      path([v2(-Lt, f.h - sl * Lt), v2(0, f.h)], "rgba(168,118,22,0.6)", 0.9);
    }
    { const f = fields[0], q = T(v2(-Lt, f.h - (f.yL - f.h) / fcol * Lt)); req(5, "telescope", [[q[0] + 2, q[1] - tHalf * s - 12, "left"], [q[0] + 2, q[1] + tHalf * s + 12, "left"]], INK, 13, { sub: "f/" + sig(P.F, 3) }); }
    // the light from each point: a faint band and three rays (the pupil's edges and center) through to the detector
    for (const f of fields) {
      const c = frampRGB(f.t), Y = f.m * fcam, P1 = y => v2(fcol, f.yL + y), P3 = y => v2(xC, y + f.m * d2);
      poly([v2(0, f.h), P1(W / 2), P1(-W / 2)], rgba(c, 0.05), null);
      poly([P1(W / 2), P3(W / 2), v2(xD, Y), P3(-W / 2), P1(-W / 2)], rgba(c, 0.05), null);
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
      const hw = Math.max(W * Math.abs(Math.tan(grism ? Dz.grism.A : a)) / 2, 3 / s), hh = 0.53 * W;
      const G0 = v2(xG - hw, hh), G1 = v2(xG + hw, hh), G2 = v2(xG + hw, -hh), G3 = v2(xG - hw, -hh);
      poly([G0, G1, G2, G3], trans ? glassFill(T(G0), T(G1)) : "rgba(51,55,61,0.32)", trans ? GLASS_EDGE : STEEL, 1.2);
      g.beginPath();
      for (let k = 1; k < 12; k++) { const x = xG - hw + 2 * hw * k / 12, r0 = T(v2(x, hh)), r1 = T(v2(x, -hh)); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); }
      g.strokeStyle = trans ? "rgba(63,109,150,0.5)" : "rgba(51,55,61,0.55)"; g.lineWidth = 0.8; g.stroke();
      const tq = T(v2(xG, hh)), bq = T(v2(xG, -hh));
      req(3, trans ? "transmission grating" : "grating", [[tq[0], tq[1] - 12, "center"], [bq[0], bq[1] + 14, "center"], [tq[0], tq[1] - 28, "center"], [bq[0], bq[1] + 30, "center"]], INK, 13, { sub: "at the pupil" });
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
  poly([v2(-Lt, tHalf), v2(0, 0), v2(-Lt, -tHalf)], "rgba(236,186,72,0.18)", null);
  for (const f of [-1, 0, 1]) path([v2(-Lt, f * tHalf), v2(0, 0)], "rgba(168,118,22,0.8)", 1);
  { const q = T(v2(-Lt, 0)); req(5, "telescope", [[q[0] + 2, q[1] - tHalf * s - 12, "left"], [q[0] + 2, q[1] + tHalf * s + 12, "left"]], INK, 13, { sub: "f/" + sig(P.F, 3) }); }
  // white light: diverging from the slit to the collimator, then parallel to the grating (by way of the fold)
  const onCol = y => onMirror(y / Math.cos(tau));
  const gPt = y => addv(Gc, sc(tg, (P.gFlip ? -y : y) / Math.cos(a)));   // meets the grating at height y, before Mpost
  const WL = rgba(NEU, 0.62);
  poly([v2(0, 0), Pp, Pm], rgba(NEU, 0.06), null);
  for (const y of YS) path([v2(0, 0), onCol(y)], WL, 0.9);
  if (foldOn) {
    const Qy = y => addv(Cf, sc(tf2, y / Math.sin(phi / 2)));
    poly([Pp, Mf(Qp), Mf(Qm), Pm], rgba(NEU, 0.07), null);
    poly([Mf(Qp), Mpost(Ga), Mpost(Gb), Mf(Qm)], rgba(NEU, 0.07), null);
    for (const y of YS) path([onCol(y), Mf(Qy(y)), Mpost(gPt(y))], WL, 0.9);
  } else {
    poly([Pp, Mpost(Ga), Mpost(Gb), Pm], rgba(NEU, 0.07), null);
    for (const y of YS) path([onCol(y), Mpost(gPt(y))], WL, 0.9);
  }
  // the beam diameter W, marked across the collimated beam
  wMark(T(Mf(v2(fcol + 0.35 * (foldOn ? fPos : 1) * d1, -W / 2))), T(Mf(v2(fcol + 0.35 * (foldOn ? fPos : 1) * d1, W / 2))));
  fold = true;
  // dispersed light: per wavelength a faint band and three rays (the beam's two edges and its center) from the
  // grating through the camera to their common focus on the detector
  const gPt0 = y => addv(Gc, sc(tg, y / Math.cos(a)));
  for (const r of rays) {
    const c = rampRGB(r.t), Ea = hit(Fp, r.b), Eb = hit(Fm, r.b);
    poly([Fp, Ea, Eb, Fm], rgba(c, 0.045), null);
    poly([Ea, r.Q, Eb], rgba(c, 0.07), null);
  }
  for (const r of rays) for (const y of [-W / 2, W / 2]) { const F0 = gPt0(y); path([F0, hit(F0, r.b), r.Q], rgba(rampRGB(r.t), 0.6), 0.9); }
  for (const r of rays) path([Gc, hit(Gc, r.b), r.Q], rgba(rampRGB(r.t), 0.95), 1.5);
  fold = false;
  // slit: two jaws
  {
    const q = T(v2(0, 0)); g.fillStyle = STEEL; g.fillRect(q[0] - 2, q[1] - 10, 4, 7.5); g.fillRect(q[0] - 2, q[1] + 2.5, 4, 7.5);
    req(5, "slit", [[q[0], q[1] + 21, "center"], [q[0], q[1] - 21, "center"]], INK, 13, { sub: sig(P.slitW, 3) + "″" });
  }
  if (mirror) {
    // a concave mirror facing the slit, hatched on the back
    const e0 = T(onMirror(halfM)), e1 = T(onMirror(-halfM)), cc = T(addv(Cm, sc(nm, -sagM)));   // quadratic Bezier = the parabola
    const nH = Math.max(6, Math.round(Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) / 7));
    hatch(Array.from({ length: nH + 1 }, (_, k) => onMirror(halfM * (1 - 2 * k / nH))), [sc(nm, -1), tm]);
    steel(() => { g.beginPath(); g.moveTo(e0[0], e0[1]); g.quadraticCurveTo(cc[0], cc[1], e1[0], e1[1]); }, e0, e1);
    const cs = ends(e0, e1);
    req(3, "collimator", [cs[1], cs[0], cs[2], cs[3]], INK, 13, { sub: "f = " + mm(fcol) });
  } else lens(v2(fcol, 0), v2(1, 0), W / 2 * 1.06, "collimator", "f = " + mm(fcol), true);
  if (foldOn) {
    // the flat fold mirror, hatched on the back (the side away from the arriving beam)
    const ext = 1.08 / Math.sin(phi / 2), u0 = W / 2 * ext;
    const f0 = T(Mf(addv(Cf, sc(tf2, u0)))), f1 = T(Mf(addv(Cf, sc(tf2, -u0))));
    const nH = Math.max(6, Math.round(Math.hypot(f1[0] - f0[0], f1[1] - f0[1]) / 7));
    const Mlin = p => addv(Mf(p), sc(Mf(v2(0, 0)), -1));          // Mf acting on a direction
    hatch(Array.from({ length: nH + 1 }, (_, k) => Mf(addv(Cf, sc(tf2, u0 * (1 - 2 * k / nH))))), [Mlin(nf), Mlin(tf2)]);
    steel(() => { g.beginPath(); g.moveTo(f0[0], f0[1]); g.lineTo(f1[0], f1[1]); }, f0, f1);
    req(4, "fold mirror", ends(f0, f1));
  }
  fold = true;
  if (ech && XDc) {
    // cross-disperser: drawn across the camera beam; it disperses out of the page
    const pp = v2(-ac[1], ac[0]);
    let half = 0;
    for (const bm of beams) for (const F of [Fp, Fm]) { const t = dt(addv(XDc, sc(F, -1)), ac) / dt(bm.b, ac); const E = addv(F, sc(bm.b, t)); half = Math.max(half, Math.abs(dt(addv(E, sc(XDc, -1)), pp))); }
    half *= 1.08;
    const th = Math.max(0.05 * half, 5 / s);
    const c0 = addv(XDc, sc(pp, half)), c1 = addv(XDc, sc(pp, -half));
    const q0 = T(c0), q1 = T(c1);
    if (P.xd === "prism") poly([c0, c1, addv(c1, sc(ac, th)), addv(c0, sc(ac, th))], glassFill(q0, q1), GLASS_EDGE, 1.2);
    else {
      poly([c0, c1, addv(c1, sc(ac, th)), addv(c0, sc(ac, th))], P.xd === "grating" ? STEEL : glassFill(q0, q1), P.xd === "grating" ? null : GLASS_EDGE, 1.2);
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = sheen(q0, q1, 0.95); g.lineWidth = 2; g.stroke();
    }
    req(4, "cross-disperser", ends(q0, q1), INK, 13, { sub: P.xd === "prism" ? null : sig(P.xG, 3) + " /mm" });
  }
  lens(C, ac, lensHalf, "camera f/" + sig(Dz.Fcam, 3), "f = " + mm(fcam), false);
  // grating: true length and angle; a reflection grating's facets drawn schematically (12 teeth), a
  // transmission grating as a plate with its rulings running through it
  const n2 = v2(-Math.cos(a), Math.sin(a));
  {
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
    const gsub = sig(ech ? P.eG : P.G, 3) + " /mm" + (grism ? ", A = " + (Dz.grism.A / IX.DEG).toFixed(1) + "°" : "");
    req(3, ech ? "echelle" : grism ? (Dz.grism.vph ? "VPH grism" : "grism") : trans ? "transmission grating" : "grating", ends(q0, q1), INK, 13, { sub: gsub });
  }
  // the grating normal, and the angles of incidence and diffraction of the central wavelength (grating mode;
  // the echelle drawing is schematic; a grism passes λ0 straight through)
  if (!ech && !grism) {
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
    poly([det0, det1, addv(det1, sc(ac, dep)), addv(det0, sc(ac, dep))], STEEL, null);
    const q0 = T(det0), q1 = T(det1), gr = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    for (const r of rays) gr.addColorStop(Math.min(1, Math.max(0, (r.X + Lx / 2) / Lx)), rgba(rampRGB(r.t), 1));
    g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.strokeStyle = rays.length ? gr : INK; g.lineWidth = 3.5; g.stroke();
    for (const r of rays) {
      const q = T(r.Q);
      g.beginPath(); g.arc(q[0], q[1], 3.4, 0, 2 * Math.PI); g.fillStyle = rgba(rampRGB(r.t), 1); g.fill();
      g.strokeStyle = "#fff"; g.lineWidth = 1.5; g.stroke();
    }
    const lp = T(Dc), off = T(addv(Dc, sc(ac, 0.06 * fcam)));
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
  if (P.annot === false) return;                                 // Labels off (Layout option): optics and rays only
  {
    const boxes = [];
    const box = (x, y, al, wd) => { const x0 = al === "left" ? x : al === "right" ? x - wd : x - wd / 2; return [x0 - 3, y - 9, x0 + wd + 3, y + 9]; };
    const hits = b => boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    const inside = b => b[0] >= 2 && b[2] <= w - 2 && b[1] >= 2 && b[3] <= h - 2;
    for (const L of LB.sort((p, q) => p.pri - q.pri)) {
      const fMain = `${L.ital ? "italic " : ""}${L.size}px ${FONT}`, fSub = `${L.size - 1.5}px ${FONT}`;
      g.font = fMain; const w1 = g.measureText(L.txt).width;
      g.font = fSub; const w2 = L.sub ? g.measureText("  " + L.sub).width : 0;
      const find = wd => L.cands.find(c => { const b = box(c[0], c[1], c[2], wd); return inside(b) && !hits(b); });
      let sub = !!L.sub, pick = find(w1 + w2);
      if (!pick && sub) { sub = false; pick = find(w1); }
      if (!pick) { if (L.optional) continue; sub = false; pick = L.cands.find(c => inside(box(c[0], c[1], c[2], w1))) || L.cands[0]; }
      const wd = w1 + (sub ? w2 : 0);
      boxes.push(box(pick[0], pick[1], pick[2], wd));
      const x0 = pick[2] === "left" ? pick[0] : pick[2] === "right" ? pick[0] - wd : pick[0] - wd / 2;
      g.textAlign = "left"; g.textBaseline = "middle";
      // a white halo under the text keeps it legible where it crosses rays
      g.lineJoin = "round"; g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4;
      g.font = fMain; g.strokeText(L.txt, x0, pick[1]); g.fillStyle = L.col; g.fillText(L.txt, x0, pick[1]);
      if (sub) { g.font = fSub; g.strokeText("  " + L.sub, x0 + w1, pick[1]); g.fillStyle = MUTED; g.fillText("  " + L.sub, x0 + w1, pick[1]); }
      g.lineJoin = "miter";
      if (L.then) L.then();
    }
  }
  // scale bar
  {
    const target = (w - mL - mR) * 0.16 / s, nice = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
    let L = nice[0]; for (const v of nice) if (v <= target) L = v;
    const xb = 14, yb = h - 12;
    g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(xb, yb); g.lineTo(xb + L * s, yb);
    g.moveTo(xb, yb - 4); g.lineTo(xb, yb + 4); g.moveTo(xb + L * s, yb - 4); g.lineTo(xb + L * s, yb + 4); g.stroke();
    g.fillStyle = MUTED; g.font = `12.5px ${FONT}`; g.textAlign = "left"; g.textBaseline = "bottom";
    g.fillText(L >= 1000 ? L / 1000 + " m" : L + " mm", xb + L * s + 8, yb + 5);
  }
}
// layout view controls: Auto / Fixed scale, Reset, scroll to zoom about the pointer, drag to pan
const lvSync = bindSeg([["lvAuto", "auto"], ["lvFixed", "fixed"]], () => lview.mode, v => { lview.mode = v; if (v === "auto") lview.fit = true; });
segs.push(lvSync);
$("lvOptsBtn").addEventListener("click", () => { const b = $("lvOpts"); b.hidden = !b.hidden; });
$("lvReset").addEventListener("click", () => { lview.fit = true; if (cur) drawLayout(cur, curP); });
// Expand: the layout panel fills the window (Esc or the same button returns)
const setExpanded = on => {
  lvExpanded = on;
  document.body.classList.toggle("lv-expanded", on);
  $("lvExpand").textContent = on ? "Exit" : "Expand";
  $("lvExpand").title = on ? "Return the layout to the page (Esc)." : "Expand the layout to fill the window, to play with the drawing directly (Esc returns).";
  lview.fit = true;
  requestAnimationFrame(() => { if (cur) drawLayout(cur, curP); });
};
$("lvExpand").addEventListener("click", () => setExpanded(!lvExpanded));
window.addEventListener("keydown", ev => { if (ev.key === "Escape" && lvExpanded) setExpanded(false); });
{
  const cv = $("cvL");
  let drag = null;
  const toFixed = () => { if (lview.mode !== "fixed") { lview.mode = "fixed"; lvSync(); } };
  cv.addEventListener("wheel", ev => {
    if (!cur) return;
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
    drawLayout(cur, curP); writeHash();
  };
  cv.addEventListener("mousedown", ev => {
    const k = spHit(ev);
    if (k) { ptDrag = k; cv.style.cursor = "ns-resize"; movePoint(ev); return; }
    drag = { x: ev.clientX, y: ev.clientY, ox: lview.ox, oy: lview.oy }; cv.style.cursor = "grabbing";
  });
  cv.addEventListener("mousemove", ev => { if (!drag && !ptDrag) cv.style.cursor = spHit(ev) ? "ns-resize" : ""; });
  window.addEventListener("mousemove", ev => {
    if (ptDrag && cur && spGeo) { movePoint(ev); return; }
    if (!drag || !cur) return;
    toFixed();
    lview.ox = drag.ox + ev.clientX - drag.x; lview.oy = drag.oy + ev.clientY - drag.y;
    drawLayout(cur, curP);
  });
  window.addEventListener("mouseup", () => { if (drag || ptDrag) { drag = null; ptDrag = null; cv.style.cursor = ""; } });
  cv.addEventListener("dblclick", () => { lview.fit = true; drawLayout(cur, curP); });
}

function message(g, w, h, txt) {
  // wrap to the panel width
  g.fillStyle = MUTED; g.font = `15px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  const words = txt.split(" "), lines = []; let cur = "";
  for (const wd of words) { const t = cur ? cur + " " + wd : wd; if (g.measureText(t).width > w * 0.8 && cur) { lines.push(cur); cur = wd; } else cur = t; }
  if (cur) lines.push(cur);
  lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * 21));
}

// ------------------------------------------------------------------ detector
/* The detector drawn to scale with the spectrum of every object as it falls on the chip: each spectrum is
   the trace of a star on the slit (about three detector pixels wide), colored by wavelength (blue short,
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
let spGeo = null, lvExpanded = false;                                                  // Spatial view, one free point: screen geometry for dragging
let detGeom = null, traces = [], hover = null, offD = null, offB = null;

function objectOffsets(Dz, P) {
  const n = Math.max(1, Math.round(P.nObj || 1));
  const lr = P.mode === "echelle" ? Dz.mlamRef / Dz.mRef : P.lamC / 1e4, mr = P.mode === "echelle" ? Dz.mRef : Dz.order;
  const a = Dz.pos(lr, mr, 0, 0.01), b = Dz.pos(lr, mr, 0, -0.01);
  if (!a || !b) return { n: 1, zeta: [0], gapPx: NaN };
  const dYdz = Math.hypot(a[0] - b[0], a[1] - b[1]) / 0.02;        // detector mm per slit mm, along the slit
  const span = P.mode === "echelle" ? (isFinite(Dz.minSep) ? Dz.minSep * Dz.pixmm : Dz.Ly / Math.max(1, Dz.orders.length)) : Dz.Ly;
  const gap = span / n;                                             // detector mm between neighboring spectra
  const zeta = [];
  for (let k = 0; k < n; k++) zeta.push((k - (n - 1) / 2) * gap / dYdz);
  return { n, zeta, gapPx: gap / Dz.pixmm };
}
function buildTraces(Dz, P) {
  traces = [];
  if (Dz.bad || !Dz.c) return;
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
}

function drawDetector(Dz, P) {
  const cv = $("cvD");
  const { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  detGeom = null;
  if (!(cv.width > 0 && cv.height > 0)) return;                  // a collapsed panel (mid-resize): nothing to draw into
  if (Dz.bad || !Dz.c) { message(g, w, h, Dz.bad ? "—" : "No light reaches the detector"); return; }
  const ech = P.mode === "echelle";
  const mL = ech ? 44 : 14, mR = ech ? 56 : 14, mT = ech ? 22 : 8, mB = ech ? 8 : 34;
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
  // Each trace is a Gaussian across the dispersion with FWHM = the slit (or fiber) width imaged along the
  // slit, phi / pixel scale.  Drawn as a band one sigma wide into an offscreen layer, blurred by
  // sigma' = sigma sqrt(11/12) (so the variance is sigma^2 and the shape is within ~1% of a Gaussian, FWHM
  // included), then added back AMP = 1/erf(1/(2 sqrt 2 sqrt(11/12))) = 2.51 times to restore unit peak.
  // Overlapping traces add; a band narrower than a pixel keeps its light through antialiasing.  Without
  // canvas filters, a stack of 12 nested strokes approximates the same profile.
  const dpr = window.devicePixelRatio || 1;
  let sgC = Math.max(0.05, (P.traceW > 0 ? P.traceW : P.slitW) / Dz.c.pixScale * ppx / 2.3548);   // canvas px
  // Traces packed closer than a canvas pixel (an IFU's 3600 spaxels seen whole) alias into moire: draw every kk-th
  // one, widened to fill the gaps (zooming in brings them all back).  Traces closer than their own width add up:
  // dim each so that the sum of many, sigma sqrt(2 pi) / pitch times one peak, stays at one trace's brightness.
  const obj = Dz.objects, pitch0 = obj && isFinite(obj.gapPx) && obj.n > 1 ? obj.gapPx * (obj.every || 1) * ppx : Infinity;
  const kk = pitch0 < 1.2 ? Math.ceil(1.2 / pitch0) : 1, pitchC = pitch0 * kk;
  if (kk > 1) sgC = Math.max(sgC, 0.6 * pitchC);
  const ovl = isFinite(pitchC) ? Math.min(1, pitchC / (sgC * 2.5066)) : 1;
  const pathOf = pts => { const pa = new Path2D(); pts.forEach((p, i) => { const q = T(...p.c); i ? pa.lineTo(q[0], q[1]) : pa.moveTo(q[0], q[1]); }); return pa; };
  const useFilter = "filter" in g;
  let og = g;
  if (useFilter) {
    if (!offD) offD = document.createElement("canvas");
    if (offD.width !== cv.width || offD.height !== cv.height) { offD.width = cv.width; offD.height = cv.height; }
    og = offD.getContext("2d");
    og.setTransform(1, 0, 0, 1, 0, 0); og.clearRect(0, 0, offD.width, offD.height);
    og.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  og.lineCap = "butt"; og.lineJoin = "round"; og.globalCompositeOperation = "lighter";
  const KG = 12, widths = [];
  for (let j = 0; j < KG; j++) widths.push(2 * sgC * Math.sqrt(-2 * Math.log((j + 0.5) / KG)));
  const strokeG = (path, style) => {
    og.strokeStyle = style;
    if (useFilter) { og.globalAlpha = 1; og.lineWidth = sgC; og.stroke(path); return; }
    og.globalAlpha = 1 / KG; for (const wd of widths) { og.lineWidth = wd; og.stroke(path); } og.globalAlpha = 1;
  };
  let grad = null, gradOrder = null;
  for (const tr of traces) {
    const pts = tr.pts;
    if (pts.length < 2 || (kk > 1 && (tr.k / ((obj && obj.every) || 1)) % kk)) continue;
    if (gradOrder === tr.m && grad) { strokeG(pathOf(pts), grad); continue; }
    gradOrder = tr.m;
    const A = T(...pts[0].c), B = T(...pts[pts.length - 1].c);
    const ux = B[0] - A[0], uy = B[1] - A[1], uu = ux * ux + uy * uy || 1;
    grad = og.createLinearGradient(A[0], A[1], B[0], B[1]);
    let lastF = -1, lastIn = null;
    const stop = (p, f) => {
      let b = (p.eff === null ? 0.85 : 0.18 + 0.82 * p.eff) * ovl;
      if (!p.inFsr) b *= 0.42;
      const col = lamRGB(p.l * 1e4);
      grad.addColorStop(Math.max(0, Math.min(1, f)), `rgb(${col[0] * b | 0},${col[1] * b | 0},${col[2] * b | 0})`);
    };
    for (const p of pts) {
      const q = T(...p.c), f = ((q[0] - A[0]) * ux + (q[1] - A[1]) * uy) / uu;
      if (lastIn !== null && p.inFsr !== lastIn) stop(p, f);      // a sharp step at the FSR edge
      if (f > lastF) { stop(p, f); lastF = f; }
      lastIn = p.inFsr;
    }
    strokeG(pathOf(pts), grad);
  }
  og.globalCompositeOperation = "source-over";
  if (useFilter) {
    // blur once into a second layer, then add it AMP times (so nothing clips before the blur)
    if (!offB) offB = document.createElement("canvas");
    if (offB.width !== cv.width || offB.height !== cv.height) { offB.width = cv.width; offB.height = cv.height; }
    const bg2 = offB.getContext("2d");
    bg2.setTransform(1, 0, 0, 1, 0, 0); bg2.clearRect(0, 0, offB.width, offB.height);
    const sb = sgC * Math.sqrt(11 / 12) * dpr;
    bg2.filter = sb > 0.05 ? `blur(${sb.toFixed(3)}px)` : "none";
    bg2.drawImage(offD, 0, 0); bg2.filter = "none";
    const AMP = 2.5088;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter";
    for (let k = 0; k < Math.floor(AMP); k++) g.drawImage(offB, 0, 0);
    g.globalAlpha = AMP - Math.floor(AMP); g.drawImage(offB, 0, 0);
    g.restore();
  }
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
  g.fillStyle = MUTED; g.font = `12.5px ${FONT}`;
  if (!ech) {
    // wavelength ticks under the chip, from the trace of the slit center
    const lo = Dz.range[0] * 1e4, hi = Dz.range[1] * 1e4, span = hi - lo;
    const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
    let st = steps[steps.length - 1];
    for (const v of steps) if (span / zoom.z / v <= Math.max(3, aw / 80)) { st = v; break; }
    g.textAlign = "center"; g.textBaseline = "top"; g.strokeStyle = MUTED; g.lineWidth = 1;
    const yb = mT + ah;
    for (let l = Math.ceil(lo / st) * st; l <= hi; l += st) {
      const p = Dz.pos(l / 1e4, Dz.order);
      if (!p) continue;
      const q = T(p[0], 0);
      if (q[0] < mL - 1 || q[0] > mL + aw + 1) continue;
      g.beginPath(); g.moveTo(q[0], yb); g.lineTo(q[0], yb + 5); g.stroke();
      g.fillText(grp(l), q[0], yb + 7);
    }
    g.textAlign = "right"; g.fillText("Å", mL + aw, yb + 21);
  } else {
  // order numbers on the left, blaze wavelengths on the right, every k-th order so labels stay ~15 px apart
  g.textBaseline = "middle";
  let lastY = -1e9;
  const items = traces.filter(tr => tr.k === 0).map(tr => { const p = Dz.pos(tr.o.lb, tr.m); return p ? { tr, y: T(p[0], p[1])[1] } : null; })
    .filter(Boolean).sort((a1, b1) => a1.y - b1.y);
  for (const it of items) {
    if (it.y < mT + 6 || it.y > mT + ah - 6 || it.y - lastY < 15) continue;
    lastY = it.y;
    g.textAlign = "right"; g.fillText(String(it.tr.m), mL - 6, it.y);
    g.textAlign = "left"; g.fillText(grp(it.tr.o.lb * 1e4), mL + aw + 6, it.y);
  }
  g.textBaseline = "bottom"; g.textAlign = "right"; g.fillText("order", mL - 6, mT - 5);
  g.textAlign = "left"; g.fillText("λ, Å", mL + aw + 6, mT - 5);
  }
  const sub = $("dSub");
  const L = hover ? Dz.local(hover.lam, hover.m) : null;
  if (L) sub.innerHTML = `<b>${fAd(hover.lam, 2)} Å</b>` + (ech ? ` · order <b>${hover.m}</b>` : "") + (Dz.objects && Dz.objects.n > 1 ? ` · object <b>${hover.k + 1}</b> of ${Dz.objects.n}` : "") +
    ` · R <b>${fmtR(L.Reff)}</b> · <b>${sig(L.dlpix, 3)}</b> Å/px` + (L.eff !== null ? ` · blaze <b>${pct(L.eff)}</b>` : "");
  else sub.textContent = zoom.z > 1.01 ? "zoom ×" + sig(zoom.z, 2) : "";
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
}

// ------------------------------------------------------------------ main loop
let cur = null, curP = null, pending = false;
function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
function render() {
  pending = false;
  syncControls();
  curP = params();
  cur = IX.design(curP);
  if (curP.mode === "grating" && curP.gType === "trans" && (M().tAlpha === null || M().tAlpha === undefined) && cur.alpha) {
    if (document.activeElement !== $("sTA")) $("sTA").value = String(cur.alpha / IX.DEG);
    $("vTA").textContent = (cur.alpha / IX.DEG).toFixed(1) + "° (sym.)";
  }
  if (M().fcam > 0 && cur.Fcam > 0) {
    if (document.activeElement !== $("sFc")) $("sFc").value = String(Math.log10(cur.Fcam));
    $("vFc").textContent = "f/" + cur.Fcam.toFixed(2);
  }
  if (!cur.bad && cur.c) cur.objects = objectOffsets(cur, curP);
  renderText(cur, curP);
  drawLayout(cur, curP);
  if ((M().layLen === null || M().layLen === undefined) && lastD1Auto !== null) {
    if (document.activeElement !== $("sLL")) $("sLL").value = String(Math.log10(Math.max(10, lastD1Auto)));
    $("vLL").textContent = sig(lastD1Auto, 3) + " mm (auto)";
  }
  if (M().col === "mirror" && (M().colTilt === null || M().colTilt === undefined) && lastTauAuto !== null) {
    if (document.activeElement !== $("sCT")) $("sCT").value = String(lastTauAuto / IX.DEG);
    $("vCT").textContent = (lastTauAuto / IX.DEG).toFixed(1) + "° (auto)";
  }
  drawRight();
  writeHash();
}
// the right-hand panel: the solar spectrum in grating mode, the detector format in echelle mode
function drawRight() {
  if (!cur) return;
  buildTraces(cur, curP); drawDetector(cur, curP);
}
function redrawDetector() { if (cur) drawDetector(cur, curP); }
window.addEventListener("resize", () => { if (cur) { drawLayout(cur, curP); drawRight(); } });

// test hooks
window.__instex = {
  state: () => clone(S), design: () => cur, params: () => curP, spGeo: () => spGeo,
  set: o => { for (const k of Object.keys(o)) { if (k === "g" || k === "e") Object.assign(S[k], o[k]); else S[k] = o[k]; } markCustom(); render(); },
  preset: id => { const p = PRESETS.find(q => q.id === id); if (p) { applyPreset(p); render(); } return !!p; },
  hover: () => hover, zoom: () => ({ z: zoom.z, cx: zoom.cx, cy: zoom.cy }), lview: () => ({ ...lview }),
};

readHash();
render();
})();
