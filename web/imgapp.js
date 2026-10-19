/* Page logic for the Imager mode of the Instrument Explorer: its controls, results strip, optical layout
   (the whole telescope, or the instrument from the focus on) and the sky as the detector mosaic records it.
   The optics are in imager.js (window.IM).  app.js owns the header (the Spectrograph | Imager switch, the
   preset menu, Reset all, About) and hands this module the shared helpers. */
(function () {
"use strict";
window.IMGAPP = function (H) {
const IM = window.IM, $ = H.$;
const { sig, grp, fitCanvas, rows, MUTED, FONT, frampRGB, rgba, message } = H;
const RAD = IM.RAD, DEG = IM.DEG;
const clone = o => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------ bands: one wavelength each, used only for the
// diffraction width (data/imaging/constants.md)
const BANDS = window.IX_BANDS || [];
const bandOf = k => BANDS.find(b => b.k === k) || BANDS[0];

// ------------------------------------------------------------------ state
// the instrument's defaults (imager.js) and the drawing's
const DEF = Object.assign(clone(IM.DEF), { view: "tel", annot: true, moon: false, stretch: false, depth: 25 });
// drawing-only keys (they keep a preset's name)
const DRAWING = new Set(["F1", "back", "backN", "nasmyth", "nasSide", "view", "annot", "moon", "stretch", "depth"]);
let S = clone(DEF), presetId = "custom";
const PRESETS = window.IX_IPRESETS || [];

const DETS = [
  { name: "2k × 2k, 15 µm", Nx: 2048, Ny: 2048, pix: 15 },
  { name: "2k × 4k, 15 µm", Nx: 2048, Ny: 4096, pix: 15 },
  { name: "4k × 4k, 15 µm", Nx: 4096, Ny: 4096, pix: 15 },
  { name: "4k × 4k, 10 µm", Nx: 4096, Ny: 4096, pix: 10 },
  { name: "6k × 6k, 15 µm", Nx: 6144, Ny: 6144, pix: 15 },
  { name: "10k × 10k, 9 µm", Nx: 10240, Ny: 10240, pix: 9 },
  { name: "2k × 2k, 18 µm (infrared)", Nx: 2048, Ny: 2048, pix: 18 },
  { name: "1k × 1k, 18 µm (infrared)", Nx: 1024, Ny: 1024, pix: 18 },
];

// ------------------------------------------------------------------ formatting
// an angle given in arcsec, in the unit that suits it
const fAng = (a, n = 3) => (a >= 3600 * 0.995 ? sig(a / 3600, n) + "°" : a >= 60 * 0.995 ? sig(a / 60, n) + "′" : a >= 0.1 ? sig(a, n) + "″" : sig(a * 1000, n) + " mas");
const fLen = v => (v >= 1000 ? sig(v / 1000, 3) + " m" : sig(v, 3) + " mm");
const fArea = deg2 => (deg2 >= 0.1 ? sig(deg2, 3) + " deg²" : deg2 * 3600 >= 0.1 ? sig(deg2 * 3600, 3) + " arcmin²" : sig(deg2 * 3600 * 3600, 3) + " arcsec²");
const fPix = n => (n >= 1e9 ? sig(n / 1e9, 3) + " billion" : sig(n / 1e6, 3) + " million");

// ------------------------------------------------------------------ controls
// [id, key, log10 slider?, integer?, formatter]
const SL = [
  ["iD", "D", true, false, v => sig(v, 3) + " m"],
  ["iF", "F", true, false, v => "f/" + sig(v, 3)],
  ["iEps", "eps", false, false, v => v.toFixed(2)],
  ["iFld", "field", true, false, v => fAng(v * 60)],
  ["iSee", "seeing", true, false, v => sig(v, 2) + "″"],
  ["iBlur", "blur", true, false, v => fAng(v, 2)],
  ["iW", "W", true, false, v => sig(v, 3) + " mm"],
  ["iFc", "Fc", true, false, v => "f/" + sig(v, 3)],
  ["iNx", "Nx", true, true, v => grp(v)],
  ["iNy", "Ny", true, true, v => grp(v)],
  ["iPix", "pix", false, false, v => sig(v, 3) + " µm"],
  ["iCol", "nCol", false, true, v => String(v)],
  ["iRow", "nRow", false, true, v => String(v)],
  ["iGap", "gapX", false, false, v => sig(v, 2) + " mm"],
  ["iF1", "F1", false, false, v => "f/" + v.toFixed(2)],
  ["iBk", "back", false, false, v => v.toFixed(2) + " D"],
  ["iBkN", "backN", false, false, v => v.toFixed(2) + " D"],
  ["iDepth", "depth", false, false, v => v.toFixed(1) + " mag"],
  ["iPlate", "plateMM", true, false, v => sig(v, 3) + " mm"],
  ["iGrain", "grain", true, false, v => sig(v, 2) + " µm"],
  ["iScan", "scan", true, false, v => sig(v, 2) + " µm"],
];
// a readout's element: v<name>_ where the spectrograph already uses v<name>
const vEl = id => $("v" + id.slice(1) + "_") || $("v" + id.slice(1));
const markCustom = () => { presetId = "custom"; $("preset").value = "custom"; };
for (const [id, key, lg, intg] of SL) {
  $(id).addEventListener("input", () => {
    let v = Number($(id).value);
    if (lg) v = Math.pow(10, v);
    if (intg) v = Math.max(1, Math.round(v));
    if ((key === "nCol" || key === "nRow") && S.rows) {
      // a preset's own pattern of rows gives way to a full grid of the chosen size
      S.nCol = Math.max(...S.rows); S.nRow = S.rows.length; S.rows = null; S.shiftY = null; S.extra = null;
    }
    if (key === "nCol" || key === "nRow" || key === "gapX") { S.gapsX = null; S.gapsY = null; }
    S[key] = v;
    if (key === "gapX") S.gapY = v;
    if (key === "Nx" || key === "Ny" || key === "pix") $("iDet").value = "custom";
    if (!DRAWING.has(key)) markCustom();
    if (["Nx", "Ny", "pix", "nCol", "nRow", "gapX", "F", "D", "Fc", "optics"].includes(key)) zoom.reset();
    H.schedule();
  });
}
function bindSeg(pairs, get, set, drawingOnly = false) {
  for (const [id, val] of pairs) $(id).addEventListener("click", () => { set(val); if (!drawingOnly) markCustom(); H.schedule(); });
  return () => { for (const [id, val] of pairs) $(id).setAttribute("aria-pressed", String(get() === val)); };
}
// the layout view: mm -> canvas px scale s along the axis, k times that across it (the Instrument view's stretch)
const lview = { mode: "auto", s: 0, k: 1, ox: 0, oy: 0, fit: true };
const segs = [
  bindSeg([["ipSee", "seeing"], ["ipDiff", "diff"], ["ipOpt", "optics"]], () => S.psf, v => { S.psf = v; }),
  bindSeg([["ioDir", "direct"], ["ioRe", "reimaged"]], () => S.optics, v => { S.optics = v; lview.fit = true; zoom.reset(); }),
  bindSeg([["ivTel", "tel"], ["ivInst", "inst"]], () => S.view, v => { S.view = v; lview.fit = true; }, true),
  bindSeg([["isOff", false], ["isOn", true]], () => !!S.stretch, v => { S.stretch = v; lview.fit = true; }, true),
  bindSeg([["ifAx", false], ["ifNa", true]], () => !!S.nasmyth, v => { S.nasmyth = v; lview.fit = true; }, true),
  bindSeg([["idCcd", "ccd"], ["idPlate", "plate"]], () => S.det || "ccd", v => { S.det = v; zoom.reset(); }),
  bindSeg([["isp1", "none"], ["isp4", "pyramid"]], () => S.split || "none", v => { S.split = v; lview.fit = true; }),
  bindSeg([["ianOn", true], ["ianOff", false]], () => S.annot !== false, v => { S.annot = v; }, true),
  bindSeg([["ilvAuto", "auto"], ["ilvFixed", "fixed"]], () => lview.mode, v => { lview.mode = v; if (v === "auto") lview.fit = true; }, true),
];
$("imMoon").addEventListener("click", () => { S.moon = !S.moon; H.schedule(); });
$("iTel").addEventListener("change", () => { S.tel = $("iTel").value; if (S.tel === "refr") S.eps = 0; lview.fit = true; markCustom(); H.schedule(); });
// bands
const bsel = $("iBand");
for (const b of BANDS) {
  const o = document.createElement("option"); o.value = b.k;
  o.textContent = b.k + "  " + grp(b.lam * 1e4) + " Å"; o.title = b.note || ""; bsel.appendChild(o);
}
bsel.addEventListener("change", () => { S.band = bsel.value; markCustom(); H.schedule(); });
// detector formats
const dsel = $("iDet");
DETS.forEach((d, i) => { const o = document.createElement("option"); o.value = String(i); o.textContent = d.name; dsel.appendChild(o); });
{ const o = document.createElement("option"); o.value = "custom"; o.textContent = "Custom format"; dsel.appendChild(o); }
dsel.addEventListener("change", () => {
  const d = DETS[Number(dsel.value)];
  if (d) { Object.assign(S, { Nx: d.Nx, Ny: d.Ny, pix: d.pix }); zoom.reset(); markCustom(); H.schedule(); }
});

function syncControls() {
  for (const [id, key, lg, , fmt] of SL) {
    let v = S[key];
    if (key === "nCol" && S.rows) v = Math.max(...S.rows);
    if (key === "nRow" && S.rows) v = S.rows.length;
    if (v === undefined || v === null) continue;
    const el = $(id), sv = lg ? Math.log10(v) : v;
    if (sv < +el.min) el.min = String(sv);
    if (sv > +el.max) el.max = String(sv);
    if (document.activeElement !== el) el.value = String(sv);
    vEl(id).textContent = fmt(v);
  }
  if (S.rows && S.rows.some(n => n !== S.rows[0])) $("vCol").textContent = "pattern";
  if (S.rows) $("vRow").textContent = String(S.rows.length);
  segs.forEach(f => f());
  $("imMoon").setAttribute("aria-pressed", String(!!S.moon));
  $("imMoon").parentElement.hidden = !window.IX_MOON_DIAM_ARCMIN;
  bsel.value = S.band;
  $("iTel").value = S.tel;
  const di = DETS.findIndex(d => d.Nx === S.Nx && d.Ny === S.Ny && d.pix === S.pix);
  dsel.value = di >= 0 ? String(di) : "custom";
}
const bodyClasses = () => [S.split === "pyramid" && S.optics === "reimaged" ? "isplit" : "", "idet-" + (S.det || "ccd"), "it-" + S.tel, S.nasmyth ? "in-nas" : "in-ax", "io-" + (S.optics === "reimaged" ? "re" : "dir"), "ip-" + S.psf, "iv-" + S.view, ilvExpanded ? "ilv-expanded" : ""];

function params() { return Object.assign({}, S, { lam: bandOf(S.band) ? bandOf(S.band).lam : 0.6 }); }

// ------------------------------------------------------------------ presets and the link
function applyPreset(p) {
  const st = clone(DEF);
  Object.assign(st, p.state);
  // the reader's view and drawing options carry over, except a depth the preset sets (a plate's limiting magnitude)
  for (const k of ["view", "annot", "moon", "stretch", "depth"]) if (!(k in p.state)) st[k] = S[k];         // the reader's view, not the preset's
  S = st; presetId = p.id; zoom.reset(); lview.fit = true; H.schedule();
}
function reset() { S = clone(DEF); presetId = "custom"; zoom.reset(); lview.fit = true; lview.mode = "auto"; H.schedule(); }
const CHOICES = { nasSide: ["down", "up"], split: ["none", "pyramid"], det: ["ccd", "plate"], tel: ["prime", "cass", "greg", "korsch", "pb", "schmidt", "refr"], psf: ["seeing", "diff", "optics"], optics: ["direct", "reimaged"], view: ["tel", "inst"], band: BANDS.map(b => b.k) };
function hashParts() {
  const parts = [];
  for (const k of Object.keys(DEF)) {
    const v = S[k], d = DEF[k];
    if (JSON.stringify(v) === JSON.stringify(d)) continue;
    parts.push("i." + k + "=" + encodeURIComponent(typeof v === "number" ? +v.toPrecision(7) : typeof v === "object" && v !== null ? JSON.stringify(v) : v));
  }
  if (presetId !== "custom") parts.push("ipreset=" + presetId);
  return parts;
}
function readHash(kv) {
  if (kv.ipreset) { const p = PRESETS.find(q => q.id === kv.ipreset); if (p) applyPreset(p); }
  for (const k of Object.keys(DEF)) {
    if (!(("i." + k) in kv)) continue;
    const v = kv["i." + k], d = DEF[k];
    if (k === "rows") {
      if (v === "" || v === "null") { S.rows = null; continue; }
      try { const a = JSON.parse(v); if (Array.isArray(a) && a.length && a.length <= 60 && a.every(n => Number.isInteger(n) && n >= 0 && n <= 60)) S.rows = a; } catch (e) { /* ignored */ }
    } else if (k === "gapsX" || k === "gapsY" || k === "shiftY") {
      if (v === "" || v === "null") { S[k] = null; continue; }
      try { const a = JSON.parse(v); if (Array.isArray(a) && a.length <= 60 && a.every(n => typeof n === "number" && isFinite(n) && Math.abs(n) < 1000)) S[k] = a; } catch (e) { /* ignored */ }
    } else if (k === "extra") {
      if (v === "" || v === "null") { S.extra = null; continue; }
      try { const a = JSON.parse(v); if (Array.isArray(a) && a.length <= 20 && a.every(c => c && isFinite(c.x) && isFinite(c.y) && Math.abs(c.x) < 5000 && Math.abs(c.y) < 5000)) S.extra = a.map(c => ({ x: +c.x, y: +c.y, rot: !!c.rot })); } catch (e) { /* ignored */ }
    } else if (typeof d === "boolean") { if (v === "true" || v === "false") S[k] = v === "true"; }
    else if (typeof d === "number") { const x = Number(v); if (isFinite(x) && (x > 0 || (k === "eps" && x >= 0 && x < 0.9) || (k === "gapX" || k === "gapY") && x >= 0)) S[k] = x; }
    else if (!CHOICES[k] || CHOICES[k].includes(v)) S[k] = v;
  }
  if (kv.ipreset) {
    const p = PRESETS.find(q => q.id === kv.ipreset);
    if (p) {
      const ref = Object.assign(clone(DEF), p.state), strip = o => JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k]) => !DRAWING.has(k))));
      if (strip(ref) !== strip(S)) presetId = "custom"; else presetId = p.id;
    }
  }
}

// ------------------------------------------------------------------ results strip and readouts
function renderText(Dz, P) {
  const st = $("stats");
  if (Dz.bad) { st.innerHTML = `<div class="flags" style="margin-left:0;max-width:none"><span class="flag">${Dz.bad}</span></div>`; }
  else {
    const fx = Dz.fieldX * 3600, fy = Dz.fieldY * 3600;
    const items = Dz.isPlate ? [
      ["Plate scale", sig(Dz.plate, 3) + "″/mm", `Sky angle per millimeter of the plate: 206265 / f_eff, with f_eff = ${fLen(Dz.feff)}. A plate has no pixels.`],
      ["Field", fAng(fx) + " × " + fAng(fy) + `<small>${fArea(Dz.areaDeg2)}</small>`, "The sky on one plate."],
      ["Image size", fAng(Dz.fwhm) + `<small>${sig(Dz.fwhm / Dz.plate * 1000, 3)} µm on the plate</small>`, `FWHM of a star's image: the seeing, diffraction and the emulsion's own spread (${sig(Dz.grain, 3)} µm = ${fAng(Dz.fwhmEmul)}) added in quadrature.`],
      ["Étendue", sig(Dz.etendue, 3) + " m² deg²", "Collecting area times the field's solid angle, A Ω: the figure of merit for surveying the sky."],
    ] : [
      ["Pixel scale", fAng(Dz.pixScale) + "/px", `Sky angle per pixel at the field center: 206265 p / f_eff, with f_eff = ${P.optics === "reimaged" ? "F_cam D" : "F D"} = ${fLen(Dz.feff)}. Only the effective focal length and the pixel size matter.`],
      ["Field", fAng(fx) + " × " + fAng(fy) + `<small>${fArea(Dz.areaDeg2)}</small>`, "The sky covered by the chips inside the corrected field: across the mosaic through its center, then the area of the chips alone (the gaps between chips excluded)."],
      ["Sampling", sig(Dz.sampling, 3) + " px" + `<small>FWHM ${fAng(Dz.fwhm)}</small>`, `Pixels across the FWHM of a star's image. Below about 2 the image is undersampled (Nyquist): a ${P.psf === "diff" ? "diffraction-limited image needs pixels no larger than λ/2D = " + fAng(Dz.nyquistPix) : "seeing-limited image needs pixels no larger than half the seeing FWHM"}.`],
      ["Étendue", sig(Dz.etendue, 3) + " m² deg²", "Collecting area times the field's solid angle, A Ω: the figure of merit for surveying the sky, because the time to cover an area of sky to a given depth scales as 1 / (A Ω)."],
    ];
    let html = items.map(([k, v, t]) => `<div class="stat" title="${t}"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
    const fl = Dz.flags.map(f => `<span class="flag" title="${f.txt}">${f.txt}</span>`).join("");
    if (fl) html += `<div class="flags">${fl}</div>`;
    st.innerHTML = html;
  }
  rows($("rTelI"), [
    ["Focal length", fLen(Dz.ftel), "f_tel = F D at the focus the instrument uses."],
    ["Plate scale", sig(Dz.plateTel, 3) + "″/mm", "At the telescope focus: 206265 / f_tel."],
    ["Collecting area", sig(Dz.area, 3) + " m²", "π D² (1 − ε²) / 4: the aperture less the central obstruction."],
    ["Field circle at the focus", "Ø " + fLen(2 * Dz.ftel * Math.tan(P.field / 60 * DEG / 2)), "The usable field's diameter at the telescope focus: 2 f_tel tan(field / 2)."],
  ]);
  const lamA = P.lam * 1e4;
  rows($("rSkyI"), [
    ["Wavelength", grp(lamA) + " Å", "The band's wavelength, used only for the diffraction width λ / D."],
    ["Diffraction FWHM", fAng(Dz.fwhmDiff), `The core of the Airy pattern: ${sig(IM.airyFWHM(Dz.eps), 4)} λ / D for a central obstruction of ${Dz.eps.toFixed(2)} (1.029 λ / D without one).`],
    ["Star FWHM", fAng(Dz.fwhm), P.psf === "diff" ? "Diffraction-limited (in space, or with adaptive optics): the Airy pattern alone." : P.psf === "optics" ? "The optics' own blur and diffraction added in quadrature (drawn as a Moffat profile)." : "Seeing and diffraction added in quadrature (an approximation; the seeing profile is drawn as a Moffat function)."],
  ]);
  if (P.optics === "reimaged") rows($("rOptI"), [
    ["Collimator, camera", fLen(Dz.fcol) + ", " + fLen(Dz.fcam), "Collimator f_col = F_tel W: it takes the telescope's beam and makes each star's light parallel, W wide. Camera f_cam = F_cam W."],
    ["Effective focal ratio", "f/" + sig(Dz.Feff, 3), "f_eff / D = F_tel f_cam / f_col = F_cam: the reimager makes the telescope an f/F_cam telescope of the same aperture."],
    [Dz.red < 1 ? "Focal reducer" : "Focal enlarger", "× " + sig(Dz.red, 3), "f_cam / f_col: the image scale relative to the telescope focus."],
    ["Field angle in the beam", "±" + sig(Dz.phiMax / DEG, 3) + "°", Dz.split ? `Half-angle of the field each camera takes: with the pyramid, each camera is centered on its own quadrant, so it sees the half-diagonal of one chip, not the whole field (in the beam, tan φ = (D / W) tan θ, D / W = ${sig(Dz.beamMag, 3)}).` : `Half-angle of the field (to the mosaic's farthest corner) in the collimated beam: tan φ = (D / W) tan θ, where D / W = ${sig(Dz.beamMag, 3)}. A big telescope with a small beam makes a modest sky field into a wide field for the camera.`],
    ["Field at the telescope focus", "Ø " + fLen(Dz.focalField), "The diameter at the telescope focus that the collimator must take in."],
  ]);
  else rows($("rOptI"), [
    ["Detector at the focus", "f/" + sig(P.F, 3), "A direct imager: the detector sits at the telescope focus (behind a corrector, filter and window, all treated as ideal), so the telescope alone sets the image scale."],
    ["Effective focal length", fLen(Dz.feff)],
  ]);
  if (Dz.isPlate) rows($("rDetI"), [
    ["Plate", sig(Dz.plateMM, 4) + " mm square (" + sig(Dz.plateMM / 25.4, 3) + " in)"],
    ["On the sky", fAng(Dz.plateMM * Dz.plate) + " square"],
    ["Emulsion spread", fAng(Dz.fwhmEmul), "The emulsion's own spreading of a star's light, as a FWHM on the sky."],
    ["Scan step", sig(Dz.scan, 3) + " µm = " + fAng(Dz.pixScale), "The plate was digitized later in steps of this size: the scan's pixels."],
    ["Scan", grp(Dz.P.Nx) + " × " + grp(Dz.P.Ny) + " px"],
  ]);
  else rows($("rDetI"), [
    ["Chip size", sig(Dz.cw, 3) + " × " + sig(Dz.ch, 3) + " mm"],
    ["Chip on the sky", fAng(Dz.cw * Dz.plate) + " × " + fAng(Dz.ch * Dz.plate)],
    ["Nyquist pixel, λ / 2D", sig(Dz.nyquistPix / Dz.plate * 1000, 3) + " µm", "λ / 2D = " + fAng(Dz.nyquistPix) + " on the sky: the pixel that samples the finest detail the aperture passes (the optics' cutoff D / λ), here in micrometers at the detector."],
  ]);
  if (Dz.isPlate) rows($("rMosI"), [["Plates", "1"], ["Pixels", "none (" + fPix(Dz.P.Nx * Dz.P.Ny) + " in the scan)"]]);
  else rows($("rMosI"), [
    ["Chips", Dz.nWhole === Dz.nChips ? String(Dz.nChips) : Dz.nChips + " (" + (Dz.nChips - Dz.nWhole) + " cut by the field)", Dz.nWhole === Dz.nChips ? "" : "The field circle passes over some chips: their parts outside the circle (gray on the sky) are counted out of the field and the pixels."],
    ["Mosaic size", sig(Dz.mosaic.x1 - Dz.mosaic.x0, 3) + " × " + sig(Dz.mosaic.y1 - Dz.mosaic.y0, 3) + " mm"],
    ["Pixels", Dz.bad ? "–" : fPix(Dz.npix), "Pixels inside the field."],
  ]);
}

// ------------------------------------------------------------------ drawing helpers
const halo = (g, txt, x, y, color = "#2b2723", font = `13px ${FONT}`, align = "center", base = "middle") => {
  g.font = font; g.textAlign = align; g.textBaseline = base;
  g.lineJoin = "round"; g.lineWidth = 4; g.strokeStyle = "rgba(255,255,255,0.92)"; g.strokeText(txt, x, y);
  g.fillStyle = color; g.fillText(txt, x, y);
};
// a biconvex lens with flat rims, centered at (x, y) with half-aperture hh (canvas px)
function lens(g, x, y, hh) {
  const d = 2 * hh, te = Math.max(2, 0.035 * d), sag = Math.max(2, 0.09 * d);
  g.beginPath();
  g.moveTo(x - te / 2, y - hh); g.lineTo(x + te / 2, y - hh);
  g.quadraticCurveTo(x + te / 2 + 2 * sag, y, x + te / 2, y + hh);
  g.lineTo(x - te / 2, y + hh);
  g.quadraticCurveTo(x - te / 2 - 2 * sag, y, x - te / 2, y - hh);
  g.closePath();
  g.fillStyle = "rgba(196,222,238,0.55)"; g.fill();
  g.strokeStyle = "#4b6b82"; g.lineWidth = 1.3; g.stroke();
}
// a mirror along a polyline of canvas points, with a hatched back on the side of `back` (+1/-1 in x)
function mirror(g, pts, back) {
  g.save();
  g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i + 1 < pts.length; i += 3) {                 // hatch
    const [x, y] = pts[i];
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + back * 6, y + 5); g.strokeStyle = "rgba(90,96,104,0.55)"; g.lineWidth = 1; g.stroke();
  }
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.strokeStyle = "#5c646d"; g.lineWidth = 4.2; g.stroke();
  g.strokeStyle = "#c9d0d6"; g.lineWidth = 1.6; g.stroke();
  g.restore();
}
function plate(g, x, y, hh, fill, stroke) {
  g.fillStyle = fill; g.fillRect(x - 2.5, y - hh, 5, 2 * hh);
  g.strokeStyle = stroke; g.lineWidth = 1; g.strokeRect(x - 2.5, y - hh, 5, 2 * hh);
}
// field-point colors: top of the field brick, center gray, bottom teal (the Spatial view's palette)
const FCOL = [frampRGB(0), frampRGB(0.5), frampRGB(1)];

// ------------------------------------------------------------------ optical layout
let ilvExpanded = false;
function fieldSlopes(Dz) {
  const a = Dz.ext.y1 / Dz.feffSigned, b = Dz.ext.y0 / Dz.feffSigned;
  return [Math.max(a, b), 0, Math.min(a, b)];
}
// a traced ray's height at unfolded z (straight between elements)
function hAt(pts, z) {
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i], b = pts[i + 1];
    if (z >= a.z - 1e-9 && z <= b.z + 1e-9) return a.h + (b.h - a.h) * (z - a.z) / ((b.z - a.z) || 1);
  }
  const L = pts[pts.length - 1];
  return L.h + (L.u || 0) * (z - L.z);
}
// tg: the canvas, its caption and its view state (the Telescopes mode draws into its own panel with this function)
function drawLayout(Dz, P, tg = { cv: "cvIL", cap: "ilSub", lv: lview }) {
  const lview = tg.lv;
  const cv = $(tg.cv);
  const { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(cv.width > 0 && cv.height > 0)) return;
  if (Dz.bad) { message(g, w, h, Dz.bad); return; }
  const tel = P.view === "tel", two = P.tel === "cass" || P.tel === "greg", Dmm = Dz.Dmm, eps = Dz.eps;
  const ts = fieldSlopes(Dz);
  // rays: for each field point, the annulus's inner and outer edges on each side
  const edgeA = [eps > 0.002 ? eps : 0.002, 1];
  const rays = ts.map(t => ({ t, up: edgeA.map(a => Dz.trace(a * Dmm / 2, t)), dn: edgeA.map(a => Dz.trace(-a * Dmm / 2, t)) }));
  // ---- world geometry (mm) for the chosen view: a list of polylines per bundle, and the elements
  const sag1 = hh => hh * hh / (4 * Dz.f1);
  let X, z0, polys = [], elems = [], marks = [];
  if (tel) {
    // the telescope folded on the page: light arrives from the left, the primary at x = 0
    const s = Dz.s || 0, refr = P.tel === "refr", schm = P.tel === "schmidt", nas = !!Dz.nasmyth, a3 = Dz.a3 || 0;
    const tma = Dz.tma, z3 = Dz.z3, x3 = Dz.x3;
    // light ahead of the primary (a Schmidt's corrector) travels to the right; after the mirror(s), as folded (a
    // three-mirror telescope's tertiary sends the light back to the left)
    X = z => (z < 0 ? z : refr ? z : tma ? (z <= s ? -z : z <= z3 ? z - 2 * s : x3 - (z - z3)) : two ? (z <= s ? -z : z - 2 * s) : -z);
    const xs = [0, nas ? -a3 : X(Dz.zF)].concat(nas || tma === "korsch" ? [] : [X(Dz.zDet)]).concat(two || tma ? [-s] : []).concat(tma ? [x3] : []).concat(schm ? [Dz.zStop] : []);
    const xIn = Math.min(...xs) - 0.12 * Math.max(Dmm, Math.max(...xs) - Math.min(...xs));
    z0 = xIn;
    // a Nasmyth tertiary: the flat on the line (x + a3) + y = 0 (45 degrees, through the axis a3 in front of the
    // primary) turns the returning beam downward on the page; past it the drawing is reflected about that line
    // A Korsch telescope's flat (on y = x - xF, the light arriving from the right) likewise turns the beam downward.
    // A Nasmyth fold on the other side (a left or east platform) turns it up instead.
    // fold(line, x0, dir, i0, s): dir +1 for light traveling right, -1 for left; s +1 to turn the beam down the page,
    // -1 up; the first segment from point i0 on that crosses the mirror line is split there, and everything past it
    // reflected about that line
    const fold = (line, x0, dir, i0, s = 1) => {
      const L = q => dir * (q[0] - x0) + s * q[1], out = line.slice(0, i0);
      let folded = false;
      for (let i = i0; i < line.length; i++) {
        const A = out[out.length - 1], B = line[i];
        if (!folded && L(A) < 0 && L(B) >= 0) {
          const t = -L(A) / (L(B) - L(A));
          out.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]);
          folded = true;
        }
        out.push(folded ? [x0 - dir * s * B[1], -s * dir * (B[0] - x0)] : B);
      }
      return out;
    };
    const nsg = P.nasSide === "up" ? -1 : 1;                           // which side the Nasmyth platform is drawn on
    const foldN = line => (nas ? fold(line, -a3, 1, 3, nsg) : tma === "korsch" ? fold(line, Dz.xFold, -1, 4) : line);
    const sag3 = hh => (tma ? hh * hh / (4 * Dz.f3) : 0);
    const pathOf = pts => {
      // incoming from xIn, then the folded segments; the primary point moved onto its curved surface
      const out = [[xIn, pts[0].h + pts.tVal * (xIn - X(pts[0].z))]];
      for (const p of pts) {
        if (Dz.split && p.z > Dz.zF + 1e-9) { out.push([X(Dz.zF), hAt(pts, Dz.zF)]); break; }   // the pyramid instrument: drawn as a box at the focus
        out.push([p.z === 0 && !refr ? -sag1(p.h) : tma && Math.abs(p.z - z3) < 1e-6 ? x3 - sag3(p.h) : X(p.z), p.h]);
      }
      return two || tma ? foldN(out) : out;
    };
    for (let f = 0; f < 3; f++) {
      const r = rays[f];
      for (const side of ["up", "dn"]) {
        const [inner, outer] = r[side];
        inner.tVal = r.t; outer.tVal = r.t;
        polys.push({ f, a: pathOf(inner), b: pathOf(outer) });
      }
    }
    // primary: its curve, with the Cassegrain hole sized to pass the returning beam
    let hole = 0;
    if ((two && !nas) || tma === "korsch") for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) hole = Math.max(hole, Math.abs(hAt(pts, 2 * s)));
    // the mirror as large as the bundles it catches (a Schmidt's mirror is larger than its stop)
    let mir = Dmm / 2;
    if (schm) for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) mir = Math.max(mir, Math.abs(hAt(pts, 0)) * 1.02);
    // (a Paul-Baker's tertiary fills the primary's central hole, the obstruction)
    if (tma === "pb") hole = eps * Dmm / 2;
    elems.push({ k: refr ? "objective" : "primary", hole: two || tma === "korsch" ? hole * 1.08 : hole, hh: mir });
    if (schm) elems.push({ k: "corrector", x: Dz.zStop, hh: Dmm / 2 });
    if (refr) { /* nothing in the beam */ } else if (two || tma) {
      let sec = 0;
      for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) sec = Math.max(sec, Math.abs(pts[1].h));
      elems.push({ k: "secondary", x: -s, hh: sec * 1.04, baffle: Math.max(sec * 1.04, eps * Dmm / 2), greg: !!Dz.greg });
      if (nas) {
        let t3 = 0;
        for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) t3 = Math.max(t3, Math.abs(hAt(pts, Dz.zM3)));
        elems.push({ k: "tertiary", x: -a3, hh: t3 * 1.12, s: nsg });
      }
      if (tma) {
        let t3 = 0;
        for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) t3 = Math.max(t3, Math.abs(hAt(pts, z3)));
        elems.push({ k: "tertiary3", x: x3, hh: t3 * 1.05, pb: tma === "pb" });
      }
      if (tma === "korsch") {
        // the flat: a hole for the light on its way to the tertiary, an annulus for the light coming back
        let inner = 0, outer = 0;
        for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) { inner = Math.max(inner, Math.abs(hAt(pts, 2 * s + Dz.xFold))); outer = Math.max(outer, Math.abs(hAt(pts, Dz.zFold))); }
        elems.push({ k: "flat", x: Dz.xFold, inner: inner * 1.08, hh: Math.max(outer * 1.12, inner * 1.5) });
      }
      if (tma === "pb") elems.push({ k: "camera", x: X(Dz.zF), hh: Math.max((Dz.mosaic.y1 - Dz.mosaic.y0) / 2 * 1.25, 0.05 * Dmm) });
    } else {
      // the prime-focus unit: the instrument in the beam, as wide as the obstruction
      elems.push({ k: "pfu", x: -Dz.zF, hh: Math.max(eps * Dmm / 2, (Dz.mosaic.y1 - Dz.mosaic.y0) / 2 * 1.2) });
    }
  } else {
    // the instrument from the telescope focus on, unfolded, light traveling to the right
    X = z => z - Dz.zF;
    const H0 = Math.max(Dz.ext.y1 - Dz.ext.y0, 1);
    const lin = Dz.reim ? 0.3 * Dz.fcol : Math.min(Dz.zF, 1.6 * P.F * H0);
    z0 = Dz.zF - lin;
    const pathOf = pts => {
      const out = [[X(z0), hAt(pts, z0)]];
      for (const p of pts) if (p.z > z0 + 1e-9) out.push([X(p.z), p.h]);
      return out;
    };
    if (Dz.reim && Dz.split) {
      // A flat four-sided pyramid at the focus (the WF/PC and 4-Shooter splitter): each facet tilts TAU from the
      // focal plane, so it sends its quadrant's light back toward the telescope, 2 TAU off the axis, to a camera of
      // its own above the focus.  Two facets drawn: the upper on the line through the apex along (sin TAU, cos TAU),
      // the lower along (sin TAU, -cos TAU).  Each camera's axis runs through its quadrant's center (q from the axis
      // at the focus), so each arm is traced in its own frame and reflected about its facet.  The center of the
      // field falls on the apex.
      const TAU = 5 * DEG;
      const chipC = Math.max(...Dz.chips.filter(c => c.active).map(c => Math.abs(c.y)));
      const q = chipC * Dz.fcol / Dz.fcam;
      const dC = Dz.zC - Dz.zF, dCam = Dz.zCam - Dz.zF, dDet = Dz.zDet - Dz.zF, dP = Dz.zP - Dz.zF;
      const facet = sg => [Math.sin(TAU), sg * Math.cos(TAU)];
      const refl = (sg, x, y) => { const l = facet(sg), k = 2 * (x * l[0] + y * l[1]); return [k * l[0] - x, k * l[1] - y]; };
      z0 = Dz.zF - 1.05 * dDet;
      const arm = (pts, sg) => {
        let u = 0;
        for (let i = 0; i + 1 < pts.length; i++) if (pts[i].z < Dz.zF && pts[i + 1].z >= Dz.zF) u = (pts[i + 1].h - pts[i].h) / (pts[i + 1].z - pts[i].z);
        const hf = hAt(pts, Dz.zF), t = Math.tan(TAU);
        const xFace = sg * hf * t / (1 - sg * u * t);                    // where the ray meets its facet (unfolded)
        const out = [[X(z0), hf + u * (X(z0))], [xFace, hf + u * xFace]];
        let hl = hf + u * xFace - sg * q, uu = u, d = xFace;
        for (const [dd, f] of [[dC, Dz.fcol], [dCam, Dz.fcam], [dDet, null]]) {
          hl += uu * (dd - d); d = dd;
          out.push(refl(sg, d, hl + sg * q));
          if (f) uu -= hl / f;
        }
        return out;
      };
      for (const [f, sg] of [[0, 1], [2, -1]]) for (const side of ["up", "dn"]) { const [inner, outer] = rays[f][side]; polys.push({ f, a: arm(inner, sg), b: arm(outer, sg) }); }
      for (const side of ["up", "dn"]) { const [inner, outer] = rays[1][side]; polys.push({ f: 1, a: [[X(z0), hAt(inner, z0)], [0, hAt(inner, Dz.zF)]], b: [[X(z0), hAt(outer, z0)], [0, hAt(outer, Dz.zF)]] }); }
      // apertures along each arm: the largest distance of its rays from the arm's axis at that point
      const aperA = (dd, sg) => {
        let m = 0;
        for (const r of [rays[sg > 0 ? 0 : 2]]) for (const sd of ["up", "dn"]) for (const pts of r[sd]) {
          let u = 0; for (let i = 0; i + 1 < pts.length; i++) if (pts[i].z < Dz.zF && pts[i + 1].z >= Dz.zF) u = (pts[i + 1].h - pts[i].h) / (pts[i + 1].z - pts[i].z);
          let hl = hAt(pts, Dz.zF) - sg * q, uu = u, d = 0;
          for (const [d2, f] of [[dC, Dz.fcol], [dCam, Dz.fcam], [dDet, null]]) { if (dd <= d2 + 1e-9) { m = Math.max(m, Math.abs(hl + uu * (dd - d))); break; } hl += uu * (d2 - d); d = d2; if (f) uu -= hl / f; }
        }
        return m;
      };
      const hp = 1.6 * q + 0.5 * aperA(0, 1);
      elems.push({ k: "pyramid", hh: hp, tau: TAU });
      for (const sg of [1, -1]) {
        const lab = sg > 0, ang = Math.atan2(...(() => { const r = refl(sg, 1, 0); return [r[1], r[0]]; })());
        const at = d => refl(sg, d, sg * q);
        elems.push({ k: "lensA", p: at(dC), ang, hh: aperA(dC, sg) * 1.06 + 1, lab: lab ? "collimator" : null, sub: "f " + fLen(Dz.fcol) });
        elems.push({ k: "plateA", p: at(dP), ang, hh: P.W / 2 * 1.08, lab: lab ? "pupil and filter" : null, sub: "Ø " + fLen(P.W) });
        elems.push({ k: "lensA", p: at(dCam), ang, hh: aperA(dCam, sg) * 1.06 + 1, lab: lab ? "camera" : null, sub: "f/" + sig(P.Fc, 3) + ", f " + fLen(Dz.fcam) });
        elems.push({ k: "detA", p: at(dDet), ang, hh: Dz.ch / 2, lab: lab ? "CCD (1 of 4)" : null });
      }
    } else
    for (let f = 0; f < 3; f++) for (const side of ["up", "dn"]) { const [inner, outer] = rays[f][side]; polys.push({ f, a: pathOf(inner), b: pathOf(outer) }); }
    if (Dz.reim && Dz.split) { /* the arms' elements are in place */ } else if (Dz.reim) {
      const aper = z => { let m = 0; for (const r of rays) for (const sd of ["up", "dn"]) for (const pts of r[sd]) m = Math.max(m, Math.abs(hAt(pts, z))); return m; };
      elems.push({ k: "focus", x: 0, hh: aper(Dz.zF) * 1.15 });
      elems.push({ k: "lens", x: X(Dz.zC), hh: aper(Dz.zC) * 1.06, lab: "collimator", sub: "f " + fLen(Dz.fcol) });
      elems.push({ k: "filter", x: X(Dz.zP), hh: P.W / 2 * 1.08, lab: "pupil and filter", sub: "Ø " + fLen(P.W) });
      elems.push({ k: "lens", x: X(Dz.zCam), hh: aper(Dz.zCam) * 1.06, lab: "camera", sub: "f/" + sig(P.Fc, 3) + ", f " + fLen(Dz.fcam) });
      marks.push({ k: "phi", x: X(Dz.zP) });
    } else {
      elems.push({ k: "filter", x: X(Dz.zF - 0.35 * lin), hh: Math.abs(hAt(rays[0].up[1], Dz.zF - 0.35 * lin)) * 1.1, lab: "filter" });
    }
  }
  // the detector: across the beam, or along the page past a Nasmyth fold (the beam then travels downward)
  if (!tel && Dz.reim && Dz.split) { /* the arms carry their own detectors */ }
  else if (tel && Dz.reim && Dz.split) elems.push({ k: "camera", x: X(Dz.zF) + 0.05 * Dz.Dmm, hh: 0.06 * Dz.Dmm, lab4: true });
  else if (tel && Dz.nasmyth) { const s = P.nasSide === "up" ? -1 : 1; elems.push({ k: "det", x: -Dz.a3, y: -s * (X(Dz.zDet) + Dz.a3), rot: true, sgn: -s, up: s < 0 }); }
  else if (tel && Dz.tma === "korsch") elems.push({ k: "det", x: Dz.xFold, y: X(Dz.zDet) - Dz.xFold, rot: true, sgn: 1, korsch: true });
  else elems.push({ k: "det", x: X(Dz.zDet), pb: tel && Dz.tma === "pb" });
  // ---- fit
  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  const grow = (x, y) => { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); };
  for (const p of polys) for (const q of p.a.concat(p.b)) grow(q[0], q[1]);
  if (tel) for (const e of elems) if (e.hh && (e.k === "primary" || e.k === "objective")) { grow(0, e.hh); grow(0, -e.hh); }
  const detE = elems.find(e => e.k === "det"), detH = Dz.mosaic.y1 - Dz.mosaic.y0;
  tg.det = detE ? { x: detE.x, y: detE.y || 0 } : null;           // where the focus was drawn (for the tests)
  if (!detE) { /* pyramid arms: grown from their elements below */ }
  else if (detE.rot) { grow(detE.x - detH / 2, detE.y); grow(detE.x + detH / 2, detE.y); }
  else { grow(detE.x, detH / 2); grow(detE.x, -detH / 2); }
  for (const e of elems) if (e.k === "tertiary3" || e.k === "flat") { grow(e.x, e.hh); grow(e.x, -e.hh); }
  for (const e of elems) if (e.k === "lensA" || e.k === "plateA" || e.k === "detA") { grow(e.p[0], e.p[1] + e.hh); grow(e.p[0], e.p[1] - e.hh); }
  for (const e of elems) if (e.k === "pyramid") { grow(Math.sin(e.tau) * e.hh, Math.cos(e.tau) * e.hh); grow(Math.sin(e.tau) * e.hh, -Math.cos(e.tau) * e.hh); }
  const mL = 30, mR = tel ? 120 : 30, mT = 34, mB = 54;
  const sxFit = (w - mL - mR) / Math.max(1e-9, bx1 - bx0), syFit = (h - mT - mB) / Math.max(1e-9, by1 - by0);
  // stretched (Instrument view): heights scaled by the largest step of 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 15, 20 ... that
  // still fits the panel
  const KS = [1, 1.5, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 80, 100];
  const kFit = !tel && P.stretch && !(Dz.reim && Dz.split) ? KS.filter(q => q <= syFit / sxFit + 1e-9).pop() || 1 : 1;
  if (lview.fit || lview.mode === "auto" || !(lview.s > 0)) {
    const sFit = Math.min(sxFit, syFit / kFit);
    lview.s = sFit; lview.k = kFit;
    lview.ox = mL + (w - mL - mR) / 2 - sFit * (bx0 + bx1) / 2;
    lview.oy = mT + (h - mT - mB) / 2 + sFit * kFit * (by0 + by1) / 2;
    lview.fit = false;
  }
  const sc = lview.s, ky = tel || !P.stretch || (Dz.reim && Dz.split) ? 1 : lview.k, T = (x, y) => [lview.ox + sc * x, lview.oy - sc * ky * y];
  // ---- bundles: translucent annular sheets, each field point in its color
  g.save();
  for (const p of polys) {
    const col = FCOL[p.f];
    for (let i = 0; i + 1 < p.a.length; i++) {
      const A = T(...p.a[i]), B = T(...p.a[i + 1]), C = T(...p.b[i + 1]), E = T(...p.b[i]);
      g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.lineTo(C[0], C[1]); g.lineTo(E[0], E[1]); g.closePath();
      g.fillStyle = rgba(col, tel ? 0.07 : p.f === 1 ? 0.13 : 0.16); g.fill();
    }
    for (const line of [p.a, p.b]) {
      g.beginPath(); line.forEach((q, i) => { const c = T(...q); i ? g.lineTo(c[0], c[1]) : g.moveTo(c[0], c[1]); });
      g.strokeStyle = rgba(col, 0.75); g.lineWidth = 0.9; g.stroke();
    }
  }
  g.restore();
  // ---- elements
  const annot = P.annot !== false;
  const labels = [], obstacles = [];                              // canvas boxes the labels keep clear of
  if (!tel) obstacles.push([0, 0, 240, 40]);                       // the floating Heights control
  for (const e of elems) {
    if (e.k === "objective") {
      const c = T(0, 0); lens(g, c[0], c[1], Dmm / 2 * sc);
      { const a = T(0, Dmm / 2); labels.push({ t: "objective", s: "Ø " + fLen(Dmm) + ", f/" + sig(P.F, 3), at: a }); }
    } else if (e.k === "primary") {
      const n = 60, top = [], bot = [];
      for (let i = 0; i <= n; i++) {
        const hh = e.hh * i / n;
        if (hh < e.hole) continue;
        top.push(T(-sag1(hh), hh)); bot.push(T(-sag1(hh), -hh));
      }
      mirror(g, top, 1); mirror(g, bot, 1);
      { const a = T(0, e.hh), sch = P.tel === "schmidt"; labels.push({ t: sch ? "mirror" : "primary", s: "Ø " + fLen(2 * e.hh) + (sch ? ", f " + fLen(Dz.f1) : ", f/" + sig(Dz.F1, 3)), at: a, pref: [[a[0] + 14, a[1] - 4]] }); }
    } else if (e.k === "secondary") {
      if (e.baffle > e.hh * 1.01) { const a = T(e.x - 0.004 * Dmm, e.baffle), b = T(e.x - 0.004 * Dmm, -e.baffle); g.fillStyle = "rgba(120,114,106,0.35)"; g.fillRect(a[0] - 5, a[1], 5, b[1] - a[1]); }
      const pts = [];
      // convex (Cassegrain: the edges curl away from the primary) or concave (Gregorian: toward it)
      for (let i = -20; i <= 20; i++) { const hh = e.hh * i / 20, sg = hh * hh / (4 * Math.abs(Dz.f2)); pts.push(T(e.x + (e.greg ? sg : -sg), hh)); }
      mirror(g, pts, -1);
      labels.push({ t: e.greg ? "secondary (concave, Gregorian)" : "secondary", s: "obstruction ε " + eps.toFixed(2), at: T(e.x, e.baffle), dx: 0, dy: -18, al: "center" });
    } else if (e.k === "pyramid") {
      const l1 = [Math.sin(e.tau) * e.hh, Math.cos(e.tau) * e.hh];
      mirror(g, [T(0, 0), T(l1[0], l1[1])], 1); mirror(g, [T(0, 0), T(l1[0], -l1[1])], 1);
      const a0 = T(0, 0);
      labels.push({ t: "pyramid mirror", s: "4 facets at " + Math.round(e.tau / DEG) + "°, 2 drawn", at: a0, pref: [[a0[0] + 16, a0[1] - 8]] });
    } else if (e.k === "lensA" || e.k === "plateA" || e.k === "detA") {
      const c = T(e.p[0], e.p[1]);
      g.save(); g.translate(c[0], c[1]); g.rotate(-e.ang);
      if (e.k === "lensA") lens(g, 0, 0, e.hh * sc);
      else if (e.k === "plateA") plate(g, 0, 0, e.hh * sc, "rgba(176,150,206,0.32)", "rgba(110,86,140,0.8)");
      else { g.fillStyle = "#151a24"; g.fillRect(-3, -e.hh * sc, 6, 2 * e.hh * sc); }
      g.restore();
      const ex = Math.abs(Math.sin(e.ang)) * e.hh * sc, ey = Math.abs(Math.cos(e.ang)) * e.hh * sc;
      obstacles.push([c[0] - ex - 4, c[1] - ey - 4, c[0] + ex + 4, c[1] + ey + 4]);
      if (e.lab) labels.push({ t: e.lab, s: e.sub, at: [c[0], c[1] - ey], pref: [[c[0] + ex + 8, c[1] - ey - 26]] });
    } else if (e.k === "tertiary3") {
      // concave, facing the light from the left: the edges curl toward it
      const pts = [];
      for (let i = -24; i <= 24; i++) { const hh = e.hh * i / 24; pts.push(T(e.x - hh * hh / (4 * Dz.f3), hh)); }
      mirror(g, pts, 1);
      labels.push({ t: e.pb ? "tertiary (concave)" : "tertiary (concave)", s: e.pb ? "at the primary's center" : "behind the primary", at: T(e.x, -e.hh), pref: [] });
    } else if (e.k === "flat") {
      for (const sg of [1, -1]) {
        const pts = [];
        for (let i = 0; i <= 10; i++) { const hh = sg * (e.inner + (e.hh - e.inner) * i / 10); pts.push(T(e.x + hh, hh)); }
        mirror(g, pts, 1);
      }
      labels.push({ t: "fold flat", s: "a hole passes the light to the tertiary", at: T(e.x + e.hh, e.hh) });
    } else if (e.k === "camera") {
      const a = T(e.x - 0.035 * Dz.Dmm, e.hh), b = T(e.x, -e.hh);
      g.fillStyle = "rgba(120,114,106,0.28)"; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      g.strokeStyle = "rgba(90,84,78,0.7)"; g.lineWidth = 1; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      labels.push(e.lab4 ? { t: "pyramid and four cameras", s: "see the Instrument view", at: T(e.x - 0.02 * Dz.Dmm, -e.hh) } : { t: "camera and detector", s: "in the secondary's shadow", at: T(e.x - 0.02 * Dz.Dmm, -e.hh) });
    } else if (e.k === "tertiary") {
      const pts = [];
      for (let i = -10; i <= 10; i++) { const hh = e.hh * i / 10; pts.push(T(e.x - (e.s || 1) * hh, hh)); }
      mirror(g, pts, 1);
      labels.push({ t: "tertiary (flat)", s: "to the Nasmyth focus", at: T(e.x - (e.s || 1) * e.hh, e.hh) });
    } else if (e.k === "pfu") {
      const a = T(e.x - 0.06 * Dz.zF, e.hh), b = T(e.x, -e.hh);
      g.fillStyle = "rgba(120,114,106,0.28)"; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      g.strokeStyle = "rgba(90,84,78,0.7)"; g.lineWidth = 1; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      labels.push({ t: "prime-focus unit and detector", s: "obstruction ε " + eps.toFixed(2), at: T(e.x - 0.03 * Dz.zF, e.hh) });
    } else if (e.k === "lens") {
      const c = T(e.x, 0); lens(g, c[0], c[1], e.hh * sc * ky);
      { const hw = 0.11 * 2 * e.hh * sc * ky + 3; obstacles.push([c[0] - hw, c[1] - e.hh * sc * ky, c[0] + hw, c[1] + e.hh * sc * ky]); }
      labels.push({ t: e.lab, s: e.sub, at: T(e.x, e.hh), dx: 0, dy: -18, al: "center" });
    } else if (e.k === "filter") {
      const c = T(e.x, 0); plate(g, c[0], c[1], e.hh * sc * ky, "rgba(176,150,206,0.32)", "rgba(110,86,140,0.8)");
      obstacles.push([c[0] - 4, c[1] - e.hh * sc * ky, c[0] + 4, c[1] + e.hh * sc * ky]);
      labels.push({ t: e.lab, s: e.sub, at: T(e.x, -e.hh), dx: 0, dy: 18, al: "center" });
    } else if (e.k === "corrector") {
      // the Schmidt corrector: a thin plate, figured (drawn with a slight waist) to cancel the sphere's aberration
      const a = T(e.x, e.hh), b = T(e.x, -e.hh), c = T(e.x, 0), t = 4;
      g.beginPath(); g.moveTo(a[0] - t, a[1]); g.lineTo(a[0] + t, a[1]);
      g.quadraticCurveTo(c[0] + t - 2.5, c[1], b[0] + t, b[1]); g.lineTo(b[0] - t, b[1]);
      g.quadraticCurveTo(c[0] - t + 2.5, c[1], a[0] - t, a[1]); g.closePath();
      g.fillStyle = "rgba(196,222,238,0.55)"; g.fill(); g.strokeStyle = "#4b6b82"; g.lineWidth = 1.2; g.stroke();
      labels.push({ t: "corrector plate", s: "aperture stop, Ø " + fLen(2 * e.hh), at: a });
    } else if (e.k === "focus") {
      const a = T(0, e.hh), b = T(0, -e.hh);
      g.setLineDash([4, 4]); g.strokeStyle = "rgba(90,84,78,0.8)"; g.lineWidth = 1; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]);
      labels.push({ t: "telescope focus", s: "f/" + sig(P.F, 3), at: T(0, -e.hh), dx: 0, dy: 18, al: "center" });
    } else if (e.k === "det") {
      // the mosaic edge-on: each distinct band of chips in height
      const bands = [];
      for (const c of Dz.chips) { const k = c.y.toFixed(4); if (!bands.find(b => b.k === k)) bands.push({ k, y0: c.y - c.h / 2, y1: c.y + c.h / 2 }); }
      const wpx = Math.max(4, Math.min(9, 0.012 * (by1 - by0) * sc));
      if (e.rot) {
        // past the fold the beam travels down the page (up for a Nasmyth platform on the other side): the mosaic lies
        // across it (heights h map to x = x3 - h, or x3 + h going up)
        const dy = e.up ? -wpx : 0;
        for (const b of bands) { const a = T(e.x + e.sgn * b.y1, e.y), c2 = T(e.x + e.sgn * b.y0, e.y); g.fillStyle = "#151a24"; g.fillRect(Math.min(a[0], c2[0]), a[1] + dy, Math.abs(c2[0] - a[0]), wpx); }
        const tip = T(e.x, e.y);
        const sub = P.telMode ? "" : Dz.nChips > 1 ? "detector, " + Dz.nChips + " chips" : "detector", lh = sub ? 31 : 16;
        // beside the focus first, clear of the converging beam
        let half = 0;
        for (const b of bands) half = Math.max(half, Math.abs(T(e.x + e.sgn * b.y1, e.y)[0] - tip[0]), Math.abs(T(e.x + e.sgn * b.y0, e.y)[0] - tip[0]));
        const px = tip[0] + half + 12, pref = [[px, tip[1] + (e.up ? -wpx : wpx) / 2 - lh / 2], [px, tip[1] - lh - 2], [px, tip[1] + 2]];
        labels.push({ t: e.korsch ? "focus" : "Nasmyth focus", s: sub, at: [tip[0], tip[1] + (e.up ? -wpx : wpx)], pref });
      } else
      for (const b of bands) { const a = T(e.x, b.y1), c2 = T(e.x, b.y0); g.fillStyle = "#151a24"; g.fillRect(a[0] - (tel && P.tel === "prime" ? 0 : wpx), a[1], wpx, c2[1] - a[1]); }
      const top = T(e.x, Dz.mosaic.y1);
      if (!(tel && P.tel === "prime") && !e.rot && !e.pb) labels.push({ t: P.telMode ? "focus" : "detector", s: Dz.nChips > 1 ? Dz.nChips + " chips" : "", at: [top[0], top[1]] });
    }
  }
  // the field angle in the beam, at the pupil
  for (const m of marks) if (m.k === "phi" && annot) {
    // drawn at the angle the bundles make on the page (a stretch steepens them); labeled with the true angle
    const c = T(m.x, 0), r = 0.55 * Math.min(Dz.fcam, Dz.fcol) * sc, a = Math.atan(ky * Math.tan(Dz.phiMax)), a0 = Dz.phiMax;
    g.strokeStyle = "rgba(60,56,52,0.75)"; g.lineWidth = 1;
    g.beginPath(); g.arc(c[0], c[1], r, -a, a); g.stroke();
    labels.push({ t: "field in the beam", s: "±" + sig(a0 / DEG, 3) + "°", at: [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)] });
  }
  // ---- labels, placed above or below their element, skipping any that would collide
  if (annot) {
    // each label tries spots above, below, left and right of its anchor; the first that stays in the panel and
    // clear of the labels already placed wins
    const placed = obstacles.slice();
    for (const L of labels) {
      g.font = `13.5px ${FONT}`; const w1 = g.measureText(L.t).width; g.font = `12px ${FONT}`; const w2 = L.s ? g.measureText(L.s).width : 0;
      const wd = Math.max(w1, w2), ht = L.s ? 31 : 16, [ax, ay] = L.at;
      const cands = (L.pref || []).concat([[ax - wd / 2, ay - 12 - ht], [ax - wd / 2, ay + 12], [ax - 12 - wd, ay - ht / 2], [ax + 12, ay - ht / 2]]);
      for (const d of [44, 76, 110]) cands.push([ax - wd / 2, ay - d - ht], [ax - wd / 2, ay + d], [ax + d * 0.6, ay - d - ht], [ax + d * 0.6, ay + d], [ax - d * 0.6 - wd, ay - d - ht], [ax - d * 0.6 - wd, ay + d]);
      for (const [x0, y0] of cands) {
        const box = [x0 - 3, y0, x0 + wd + 3, y0 + ht];
        if (box[0] < 4 || box[2] > w - 4 || box[1] < 4 || box[3] > h - mB + 8) continue;
        if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
        placed.push(box);
        // a leader line from a label set away from its anchor
        const nx = Math.max(x0, Math.min(x0 + wd, ax)), ny = Math.max(y0, Math.min(y0 + ht, ay));
        if (Math.hypot(nx - ax, ny - ay) > 30) {
          g.strokeStyle = "rgba(80,74,68,0.6)"; g.lineWidth = 0.8;
          g.beginPath(); g.moveTo(ax, ay); g.lineTo(nx, ny + (ny === y0 ? 0 : ny === y0 + ht ? 0 : 0)); g.stroke();
        }
        halo(g, L.t, x0, y0 + 8, "#2b2723", `13.5px ${FONT}`, "left");
        if (L.s) halo(g, L.s, x0, y0 + 23, "#6a6560", `12px ${FONT}`, "left");
        break;
      }
    }
    // scale bar and caption at the panel's lower left
    const target = 110 / sc, p10 = Math.pow(10, Math.floor(Math.log10(target)));
    const len = [1, 2, 5, 10].map(k => k * p10).reduce((b, q) => (Math.abs(q - target) < Math.abs(b - target) ? q : b), p10);
    const x0 = 22, y0 = h - 18;
    g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + len * sc, y0); g.moveTo(x0, y0 - 4); g.lineTo(x0, y0 + 4); g.moveTo(x0 + len * sc, y0 - 4); g.lineTo(x0 + len * sc, y0 + 4); g.stroke();
    halo(g, fLen(len), x0 + len * sc / 2, y0 - 10, "#4f4a44", `12px ${FONT}`, "center");
    const cap = $(tg.cap);
    cap.hidden = !!P.telMode;                                         // the Telescopes mode draws no caption (Charlie, 10-19)
    cap.style.setProperty("--capL", Math.round(x0 + len * sc + 18) + "px");
    cap.textContent = (ky > 1 ? "Heights stretched × " + ky + " (lengths to scale). " : "") + (tel
      ? "Field angles to scale: the bundles from the top, center and bottom of the field overlap until they near the focus."
      : Dz.reim && Dz.split ? "A flat pyramid at the focus reflects each quadrant back, 10° off the axis, to its own camera (two of four drawn; in 3D the arms run along the field's diagonals). The field's center falls on the apex."
      : Dz.reim ? "Each star's light leaves the collimator as a parallel bundle; the bundles cross at the pupil, where the filter sits, and the camera focuses each one onto the detector." : "Each star's cone of light converges onto the detector; the filter sits in the converging beam.");
  } else $(tg.cap).hidden = true;
}

// ------------------------------------------------------------------ the synthetic sky
/* An illustrative high-latitude field, the same at every scale: stars and galaxies in one-magnitude slices, each
   slice laid out on its own grid of tiles (about a dozen objects per tile, so faint slices use small tiles), each
   tile filled from a random generator seeded by the slice and the tile.  The counts are made up to look like a
   deep field; nothing on the page depends on them.  The reader's depth sets the faintest magnitude drawn; a view too
   wide to draw that many objects (about 15,000) stops at the magnitude that fits, and the header says so. */
const STAR_N = m => 300 * Math.pow(10, 0.2 * (m - 18));          // per deg^2 brighter than m (illustrative)
const GAL_N = m => 2000 * Math.pow(10, 0.4 * (m - 20));
const M0 = 6, M1 = 29, PER_TILE = 12, NMAX = 15000;
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hash4 = (a, b, c, d) => { let x = 2166136261; for (const v of [a, b, c, d]) { x ^= v & 0xffff; x = Math.imul(x, 16777619); x ^= (v >>> 16) & 0xffff; x = Math.imul(x, 16777619); } return x >>> 0; };
function poisson(r, lam) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; }
function skyObjects(x0, x1, y0, y1, depth) {
  const A = (x1 - x0) * (y1 - y0) / (3600 * 3600);               // deg^2
  // the faintest magnitude this view can hold (about NMAX objects), and the one drawn
  let a = M0, b = M1;
  for (let k = 0; k < 40; k++) { const c = 0.5 * (a + b); if ((STAR_N(c) + GAL_N(c)) * A > NMAX) b = c; else a = c; }
  const mCap = 0.5 * (a + b), mDraw = Math.min(depth, mCap, M1);
  const out = [];
  for (let k = M0; k < mDraw; k++) {
    const ns = (STAR_N(k + 1) - STAR_N(k)), ng = (GAL_N(k + 1) - GAL_N(k));
    for (const [typ, nk] of [[0, ns], [1, ng]]) {
      const n = nk / (3600 * 3600), Tt = Math.sqrt(PER_TILE / n);  // per arcsec^2; tile side (arcsec)
      const i0 = Math.floor(x0 / Tt), i1 = Math.floor(x1 / Tt), j0 = Math.floor(y0 / Tt), j1 = Math.floor(y1 / Tt);
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        const r = rng(hash4(k, typ, i | 0, j | 0));
        const cnt = poisson(r, PER_TILE);
        for (let q = 0; q < cnt; q++) {
          const x = (i + r()) * Tt, y = (j + r()) * Tt, m = k + r();
          const o = { x, y, m, gal: typ === 1 };
          if (o.gal) {
            const z = Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
            o.re = Math.min(120, 0.4 * Math.pow(10, -0.2 * (m - 23)) * Math.exp(0.3 * z));
            o.q = 0.3 + 0.7 * r(); o.pa = Math.PI * r(); o.n = r() < 0.7 ? 1 : 4;
          } else { r(); r(); r(); r(); }
          if (x >= x0 && x <= x1 && y >= y0 && y <= y1 && m <= mDraw) out.push(o);
        }
      }
    }
  }
  // a fixed target star near the center, as an observation is pointed at something (it shows the image's rings)
  if (TARGET.m <= mDraw) out.push({ x: TARGET.x, y: TARGET.y, m: TARGET.m, gal: false });
  return { list: out, mDraw, mCap };
}
const TARGET = { x: 1.7, y: 1.1, m: 20 };

// ------------------------------------------------------------------ the sky panel
const MOFFAT_BETA = window.IX_MOFFAT_BETA || 4.765;
const zoom = { z: 1, cx: 0, cy: 0, reset() { this.z = 1; this.cx = 0; this.cy = 0; } };
let skyGeom = null, hover = null, airyT = null, airyEps = -1, offS = null;
// the star's image profile at radius r (arcsec), unit peak, and its integral over the sky (arcsec^2)
function psfModel(Dz, P) {
  if (P.psf === "diff") {
    if (Dz.eps !== airyEps) { airyT = IM.airyTable(Dz.eps); airyEps = Dz.eps; }
    const c = P.lam * 1e-3 / (Math.PI * Dz.Dmm) * RAD;              // arcsec per unit v
    const T = airyT.T, dv = airyT.dv, n = T.length;
    if (!airyT.env) { airyT.env = new Float32Array(n); let m = 0; for (let i = n - 1; i >= 0; i--) { m = Math.max(m, T[i]); airyT.env[i] = m; } }
    const E = airyT.env;
    const f = r => { const v = r / c / dv, i = v | 0; return i + 1 < n ? T[i] + (T[i + 1] - T[i]) * (v - i) : 0; };
    const rAt = lev => { let lo = 0, hi = n - 1; if (E[hi] >= lev) return hi * dv * c; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (E[m] >= lev) lo = m; else hi = m; } return hi * dv * c; };
    return { f, rAt, total: 4 * Math.PI * c * c / (1 - Dz.eps * Dz.eps), fwhm: Dz.fwhm, rmax: airyT.vmax * c };
  }
  const be = MOFFAT_BETA, al = IM.moffatAlpha(Dz.fwhm, be);
  return { f: r => Math.pow(1 + (r * r) / (al * al), -be), rAt: lev => al * Math.sqrt(Math.max(0, Math.pow(Math.min(1, lev), -1 / be) - 1)), total: Math.PI * al * al / (be - 1), fwhm: Dz.fwhm, rmax: 60 * Dz.fwhm };
}
// a taper over the outer 30% of a footprint of radius R, so no edge shows
const taper = (r, R) => (r <= 0.7 * R ? 1 : r >= R ? 0 : 0.5 * (1 + Math.cos(Math.PI * (r - 0.7 * R) / (0.3 * R))));
// the radius at which a Sersic profile with I_e = ie (display units) falls to lev
const sersicR = (n, re, ie, lev) => (ie > lev ? re * Math.pow(1 + Math.log(ie / lev) / BN[n], n) : 2 * re);
// Sersic profile (unit at r_e), softened by the star's image so that small galaxies keep the PSF's core
const BN = { 1: 1.678, 4: 7.669 }, GAM2N = { 1: 1, 4: 5040 };
// the total of the unit-at-r_e Sersic profile, 2 pi n q r_e^2 e^b Gamma(2n) / b^(2n), in the units of r_e squared
const sersicTotal = (n, q, re) => 2 * Math.PI * n * q * re * re * Math.exp(BN[n]) * GAM2N[n] / Math.pow(BN[n], 2 * n);
function drawSky(Dz, P) {
  const cv = $("cvS");
  $("szReset").hidden = !(zoom.z > 1.001);
  const { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  skyGeom = null;
  if (!(cv.width > 0 && cv.height > 0)) return;
  if (Dz.bad) { message(g, w, h, Dz.bad); return; }
  const dpr = window.devicePixelRatio || 1;
  const k = RAD / Dz.feffSigned;                                  // sky arcsec per detector mm (signed: a reimager inverts)
  const ka = Math.abs(k);
  // chips on the sky (arcsec, tangent plane): x right, y up
  const chips = Dz.chips.map(c => ({ ...c, X: c.x * k, Y: c.y * k, Wd: c.w * ka, Ht: c.h * ka }));
  const ext = { x0: Dz.mosaic.x0 * ka, x1: Dz.mosaic.x1 * ka, y0: Dz.mosaic.y0 * ka, y1: Dz.mosaic.y1 * ka };
  const mL = 66, mR = 18, mT = 10, mB = 50;
  const aw = w - mL - mR, ah = h - mT - mB;
  const Wx = (ext.x1 - ext.x0) * 1.04, Wy = (ext.y1 - ext.y0) * 1.04;
  const s0 = Math.min(aw / Wx, ah / Wy), s = s0 * zoom.z;          // CSS px per arcsec
  const cxp = mL + aw / 2, cyp = mT + ah / 2;
  const T = (x, y) => [cxp + (x - zoom.cx) * s, cyp - (y - zoom.cy) * s];
  skyGeom = { s, s0, cxp, cyp, mL, mT, aw, ah, chips, ext, k };
  // the visible sky window (arcsec)
  const vx0 = zoom.cx - (aw / 2) / s, vx1 = zoom.cx + (aw / 2) / s, vy0 = zoom.cy - (ah / 2) / s, vy1 = zoom.cy + (ah / 2) / s;
  g.save();
  g.beginPath(); g.rect(mL, mT, aw, ah); g.clip();
  // chips: dark if inside the corrected field, gray and hatched if not
  const rectOf = c => { const a = T(c.X - c.Wd / 2, c.Y + c.Ht / 2), b = T(c.X + c.Wd / 2, c.Y - c.Ht / 2); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; };
  const vis = chips.filter(c => c.X + c.Wd / 2 >= vx0 && c.X - c.Wd / 2 <= vx1 && c.Y + c.Ht / 2 >= vy0 && c.Y - c.Ht / 2 <= vy1);
  for (const c of vis) {
    const r = rectOf(c);
    g.fillStyle = !c.active ? "#b9b4ac" : Dz.isPlate ? PLATE_FOG : "#0b111c"; g.fillRect(...r);
  }
  // ---- the sky image, on the active chips
  // clip to the field circle
  const fieldClip = () => { const c = T(0, 0); g.beginPath(); g.arc(c[0], c[1], Dz.Rcorr * ka * s, 0, 2 * Math.PI); g.clip(); };
  const pixA = Dz.pixScale;                                       // arcsec per detector pixel
  const ppx = s * pixA;                                           // CSS px per detector pixel
  const psf = psfModel(Dz, P);
  const act = vis.filter(c => c.active);
  if (act.length) {
    const marg = Math.max(psf.rmax * 0.5, 4 * psf.fwhm);
    const depth = P.depth || 25;
    const sky = skyObjects(vx0 - marg - 120, vx1 + marg + 120, vy0 - marg - 120, vy1 + marg + 120, depth);
    const objs = sky.list;
    skyGeom.mDraw = sky.mDraw; skyGeom.capped = sky.mDraw < depth - 0.05; skyGeom.nObj = objs.length;
    const flux = m => Math.pow(10, -0.4 * (m - 20));
    if (ppx >= 2.5 && !Dz.isPlate) {
      // pixel mode: the flux in each detector pixel (the star's image integrated over the pixel)
      // white: the peak pixel of a star 4 magnitudes brighter than the faintest drawn (the depth set, or what a wide
      // view can hold); objects are drawn out to where they fall below half the stretch's knee (W / 80)
      const W = flux(sky.mDraw - 4) * pixA * pixA / psf.total, lev = W / 80;
      const bufs = [];
      for (const c of act) {
        const cx0 = c.X - c.Wd / 2, cy1 = c.Y + c.Ht / 2;               // the chip's top-left on the sky
        const i0 = Math.max(0, Math.floor((vx0 - cx0) / pixA)), i1 = Math.min(P.Nx - 1, Math.floor((vx1 - cx0) / pixA));
        const j0 = Math.max(0, Math.floor((cy1 - vy1) / pixA)), j1 = Math.min(P.Ny - 1, Math.floor((cy1 - vy0) / pixA));
        if (i1 < i0 || j1 < j0) continue;
        const ni = i1 - i0 + 1, nj = j1 - j0 + 1, buf = new Float32Array(ni * nj);
        const ns = psf.fwhm / pixA > 2 ? 3 : 5, sub = pixA / ns;
        for (const o of objs) {
          const F = flux(o.m);
          // pixel coordinates of the object (continuous; pixel centers at integer + 0.5)
          const fi = (o.x - cx0) / pixA, fj = (cy1 - o.y) / pixA;
          let R, prof, norm;
          if (o.gal) {
            const n = o.n, b = BN[n], soft = 0.5 * psf.fwhm, ca = Math.cos(o.pa), sa = Math.sin(o.pa);
            norm = sersicTotal(n, o.q, o.re);
            R = sersicR(n, o.re, F * pixA * pixA / norm, lev) + 2 * psf.fwhm;
            prof = (dx, dy) => { const u = dx * ca + dy * sa, v = (-dx * sa + dy * ca) / o.q, rr = Math.sqrt(u * u + v * v + soft * soft); return Math.exp(-b * (Math.pow(rr / o.re, 1 / n) - 1)); };
          } else { norm = psf.total; R = Math.min(psf.rmax, Math.max(1.5 * psf.fwhm, psf.rAt(lev / (F * pixA * pixA / norm)))); prof = (dx, dy) => psf.f(Math.sqrt(dx * dx + dy * dy)); }
          const Rp = R / pixA;
          const a0 = Math.max(0, Math.floor(fi - Rp)), a1 = Math.min(P.Nx - 1, Math.floor(fi + Rp)), b0 = Math.max(0, Math.floor(fj - Rp)), b1 = Math.min(P.Ny - 1, Math.floor(fj + Rp));
          if (a1 < i0 || a0 > i1 || b1 < j0 || b0 > j1) continue;
          // each normalized by its profile's integral (galaxies sampled once per pixel, stars ns x ns times)
          for (let jj = Math.max(b0, j0); jj <= Math.min(b1, j1); jj++) for (let ii = Math.max(a0, i0); ii <= Math.min(a1, i1); ii++) {
            const rr = Math.hypot(ii + 0.5 - fi, jj + 0.5 - fj) * pixA;
            if (rr >= R) continue;
            let v;
            if (o.gal) v = F * prof((ii + 0.5 - fi) * pixA, (fj - jj - 0.5) * pixA) * pixA * pixA / norm;
            else {
              let sm = 0;
              for (let p = 0; p < ns; p++) for (let q = 0; q < ns; q++) sm += prof((ii + (p + 0.5) / ns - fi) * pixA, (fj - jj - (q + 0.5) / ns) * pixA);
              v = F * sm * sub * sub / norm;
            }
            buf[(jj - j0) * ni + (ii - i0)] += v * taper(rr, R);
          }
        }
        bufs.push({ c, i0, j0, ni, nj, buf, cx0, cy1 });
      }
      for (const b of bufs) {
        const oc = document.createElement("canvas"); oc.width = b.ni; oc.height = b.nj;
        const og = oc.getContext("2d"), im = og.createImageData(b.ni, b.nj);
        paint(b.buf, im.data, W);
        og.putImageData(im, 0, 0);
        const a = T(b.cx0 + b.i0 * pixA, b.cy1 - b.j0 * pixA);
        g.save(); fieldClip();
        g.imageSmoothingEnabled = false;
        g.drawImage(oc, a[0], a[1], b.ni * ppx, b.nj * ppx);
        g.imageSmoothingEnabled = true;
        g.restore();
      }
    } else {
      // screen mode: each object drawn into a buffer at device resolution, as flux per detector pixel where a
      // pixel is larger than a screen pixel (so the brightness carries on into pixel mode), else per screen pixel
      const bw = Math.ceil(aw * dpr), bh = Math.ceil(ah * dpr), buf = new Float32Array(bw * bh);
      const sd = s * dpr;                                         // device px per arcsec
      const cellA = Math.max(1, (ppx * dpr) * (ppx * dpr));        // detector-pixel area in device px^2, at least 1
      const blur = Math.sqrt(Math.pow(0.68 * ppx * dpr, 2) + 0.9);   // the pixel's box and one device pixel (device px)
      // white: the peak of a star 4 magnitudes brighter than the faintest drawn, as drawn here
      const fwR = Math.sqrt(Math.pow(psf.fwhm * sd, 2) + blur * blur), alR = IM.moffatAlpha(fwR, MOFFAT_BETA);
      const W = flux(sky.mDraw - 4) * cellA / (Math.PI * alR * alR / (MOFFAT_BETA - 1)), lev = W / 80;
      for (const o of objs) {
        const F = flux(o.m);
        const px = (o.x - vx0) * sd, py = (vy1 - o.y) * sd;
        const fw = Math.sqrt(Math.pow(psf.fwhm * sd, 2) + blur * blur);   // device px
        let R, prof, isG = o.gal && o.re * sd > 0.7, tot = 0;
        if (isG) {
          const n = o.n, b = BN[n], re = o.re * sd, soft = 0.5 * fw, ca = Math.cos(o.pa), sa = Math.sin(o.pa);
          tot = sersicTotal(n, o.q, re);
          R = sersicR(n, re, F * cellA / tot, lev) + 2 * fw;
          prof = (dx, dy) => { const u = dx * ca - dy * sa, v = (dx * sa + dy * ca) / o.q, rr = Math.sqrt(u * u + v * v + soft * soft); return Math.exp(-b * (Math.pow(rr / re, 1 / n) - 1)); };
        } else if (P.psf === "diff" && psf.fwhm * sd > 3) {
          const pk = F * cellA / (psf.total * sd * sd);
          R = Math.min(psf.rmax, Math.max(1.5 * psf.fwhm, psf.rAt(lev / pk))) * sd;
          prof = (dx, dy) => psf.f(Math.sqrt(dx * dx + dy * dy) / sd);
        } else {
          const be = MOFFAT_BETA, al = IM.moffatAlpha(fw, be), pk = F * cellA / (Math.PI * al * al / (be - 1));
          R = Math.max(1.5 * fw, al * Math.sqrt(Math.max(0, Math.pow(Math.min(1, lev / pk), -1 / be) - 1)));
          prof = (dx, dy) => Math.pow(1 + (dx * dx + dy * dy) / (al * al), -be);
        }
        const x0 = Math.max(0, Math.floor(px - R)), x1 = Math.min(bw - 1, Math.ceil(px + R)), y0 = Math.max(0, Math.floor(py - R)), y1 = Math.min(bh - 1, Math.ceil(py + R));
        if (x1 < x0 || y1 < y0) continue;
        // normalize over the full footprint (offscreen part included) so a star at the edge is not brightened;
        // a galaxy by the profile's analytic integral
        let sum = tot;
        if (!isG) {
          const fx0 = Math.floor(px - R), fx1 = Math.ceil(px + R), fy0 = Math.floor(py - R), fy1 = Math.ceil(py + R);
          const step = Math.max(1, Math.floor((fx1 - fx0) / 80));
          for (let y = fy0; y <= fy1; y += step) for (let x = fx0; x <= fx1; x += step) sum += prof(x + 0.5 - px, y + 0.5 - py);
          sum *= step * step;
        }
        if (!(sum > 0)) continue;
        const amp = F * cellA / sum;
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          const dx = x + 0.5 - px, dy = y + 0.5 - py, rr = Math.sqrt(dx * dx + dy * dy);
          if (rr < R) buf[y * bw + x] += amp * prof(dx, dy) * taper(rr, R);
        }
      }
      if (!offS) offS = document.createElement("canvas");
      offS.width = bw; offS.height = bh;
      const og = offS.getContext("2d"), im = og.createImageData(bw, bh);
      if (Dz.isPlate) {
        // the emulsion's grain: value noise on a lattice of the grain size, fixed on the plate
        const gmm = Dz.grain / 1000, kx = 1 / (sd * Dz.plate * gmm);       // grain cells per device px
        paintPlate(buf, im.data, W, bw, bh, (x, y) => grainNoise((vx0 + (x + 0.5) / sd) / Dz.plate / gmm, (vy1 - (y + 0.5) / sd) / Dz.plate / gmm), Math.min(1, Math.pow(1 / (1.5 * kx), 2)));
      } else paint(buf, im.data, W);
      og.putImageData(im, 0, 0);
      g.save();
      g.beginPath(); for (const c of act) g.rect(...rectOf(c)); g.clip();
      fieldClip();
      g.drawImage(offS, mL, mT, bw / dpr, bh / dpr);
      g.restore();
    }
  }
  // pixel grid when zoomed in far enough (a plate has none)
  if (ppx >= 7 && !Dz.isPlate) {
    g.strokeStyle = "rgba(128,128,128,0.4)"; g.lineWidth = 1;
    g.beginPath();
    for (const c of act) {
      const cx0 = c.X - c.Wd / 2, cy1 = c.Y + c.Ht / 2;
      const i0 = Math.max(0, Math.ceil((vx0 - cx0) / pixA)), i1 = Math.min(P.Nx, Math.floor((vx1 - cx0) / pixA));
      const j0 = Math.max(0, Math.ceil((cy1 - vy1) / pixA)), j1 = Math.min(P.Ny, Math.floor((cy1 - vy0) / pixA));
      const ya = T(0, Math.min(cy1, vy1))[1], yb = T(0, Math.max(cy1 - c.Ht, vy0))[1], xa = T(Math.max(cx0, vx0), 0)[0], xb = T(Math.min(cx0 + c.Wd, vx1), 0)[0];
      for (let i = i0; i <= i1; i++) { const x = Math.round(T(cx0 + i * pixA, 0)[0]) + 0.5; g.moveTo(x, ya); g.lineTo(x, yb); }
      for (let j = j0; j <= j1; j++) { const y = Math.round(T(0, cy1 - j * pixA)[1]) + 0.5; g.moveTo(xa, y); g.lineTo(xb, y); }
    }
    g.stroke();
  }
  // the parts of chips outside the field circle: gray and hatched
  {
    const c0 = T(0, 0), rr = Dz.Rcorr * ka * s;
    g.save();
    g.beginPath(); for (const c of vis) g.rect(...rectOf(c)); g.clip();
    g.beginPath(); g.rect(mL, mT, aw, ah); g.arc(c0[0], c0[1], rr, 0, 2 * Math.PI, true); g.clip("evenodd");
    g.fillStyle = "#b9b4ac"; g.fillRect(mL, mT, aw, ah);
    g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 1;
    g.beginPath(); for (let d = -ah; d < aw; d += 7) { g.moveTo(mL + d, mT + ah); g.lineTo(mL + d + ah, mT); } g.stroke();
    g.restore();
  }
  // chip outlines
  for (const c of vis) {
    const r = rectOf(c);
    g.strokeStyle = c.active ? "rgba(70,78,92,0.9)" : "rgba(150,144,136,0.9)"; g.lineWidth = 1; g.strokeRect(r[0] + 0.5, r[1] + 0.5, r[2] - 1, r[3] - 1);
  }
  // the corrected field and the full Moon
  const circle = (rad, dash, col, lab) => {
    const c = T(0, 0), r = rad * s;
    g.setLineDash(dash); g.strokeStyle = col; g.lineWidth = 1.2; g.beginPath(); g.arc(c[0], c[1], r, 0, 2 * Math.PI); g.stroke(); g.setLineDash([]);
    if (lab) {
      const a = -Math.PI / 4, x = c[0] + r * Math.cos(a), y = c[1] + r * Math.sin(a);
      if (x > mL + 40 && x < mL + aw - 40 && y > mT + 12 && y < mT + ah - 12) halo(g, lab, x + 6, y - 6, "#5c5650", `12px ${FONT}`, "left");
    }
  };
  circle(Dz.Rcorr * ka, [5, 4], "rgba(92,86,80,0.85)", "field edge");
  const moonD = window.IX_MOON_DIAM_ARCMIN;
  if (S.moon && moonD) circle(moonD * 60 / 2, [], "rgba(200,170,90,0.95)", "full Moon");
  g.restore();
  // ---- axes on the mosaic's edges (on the panel's, when zoomed past them)
  const c0 = T(ext.x0, ext.y1), c1 = T(ext.x1, ext.y0);
  const fx0 = Math.max(c0[0], mL), fx1 = Math.min(c1[0], mL + aw), fy0 = Math.max(c0[1], mT), fy1 = Math.min(c1[1], mT + ah);
  const span = Math.max(vx1 - vx0, vy1 - vy0);
  const unit = span >= 2 * 3600 ? [3600, "°"] : span >= 120 ? [60, "′"] : [1, "″"];
  const nice = (sp, n) => { const r = sp / Math.max(1, n), p10 = Math.pow(10, Math.floor(Math.log10(r))), f = r / p10; const m = [1, 2, 5, 10].reduce((b1, q) => (Math.abs(Math.log(q / f)) < Math.abs(Math.log(b1 / f)) ? q : b1), 1); return { st: m * p10, k: m === 2 ? 4 : 5 }; };
  const dec = st => Math.max(0, -Math.floor(Math.log10(st) + 1e-9));
  const num = (v, d) => (v < -1e-12 ? "−" : "") + Math.abs(v).toFixed(d);
  g.strokeStyle = MUTED; g.lineWidth = 1; g.font = `12px ${FONT}`; g.fillStyle = MUTED;
  const u = unit[0];
  {
    const a0 = Math.max(vx0, ext.x0) / u, a1 = Math.min(vx1, ext.x1) / u, { st, k: kk } = nice(a1 - a0, Math.max(2, (fx1 - fx0) / 70)), mn = st / kk;
    g.textAlign = "center"; g.textBaseline = "top";
    for (let i = Math.ceil(a0 / mn - 1e-9); i * mn <= a1 + 1e-9 * mn; i++) {
      const v = i * mn, x = T(v * u, 0)[0], major = i % kk === 0;
      g.beginPath(); g.moveTo(Math.round(x) + 0.5, fy1); g.lineTo(Math.round(x) + 0.5, fy1 + (major ? 5 : 3)); g.stroke();
      if (major) g.fillText(num(Math.abs(v) < mn * 1e-6 ? 0 : v, dec(st)), x, fy1 + 8);
    }
    halo(g, "Offset on the sky (" + unit[1] + ")", (fx0 + fx1) / 2, fy1 + 36, "#4f4a44", `12.5px ${FONT}`, "center");
  }
  {
    const a0 = Math.max(vy0, ext.y0) / u, a1 = Math.min(vy1, ext.y1) / u, { st, k: kk } = nice(a1 - a0, Math.max(2, (fy1 - fy0) / 48)), mn = st / kk;
    g.textAlign = "right"; g.textBaseline = "middle"; let wl = 0;
    for (let i = Math.ceil(a0 / mn - 1e-9); i * mn <= a1 + 1e-9 * mn; i++) {
      const v = i * mn, y = T(0, v * u)[1], major = i % kk === 0;
      g.beginPath(); g.moveTo(fx0, Math.round(y) + 0.5); g.lineTo(fx0 - (major ? 5 : 3), Math.round(y) + 0.5); g.stroke();
      if (major) { const t = num(Math.abs(v) < mn * 1e-6 ? 0 : v, dec(st)); g.fillText(t, fx0 - 8, y); wl = Math.max(wl, g.measureText(t).width); }
    }
    g.save(); g.translate(Math.max(10, fx0 - 8 - wl - 12), (fy0 + fy1) / 2); g.rotate(-Math.PI / 2);
    halo(g, "Offset (" + unit[1] + ")", 0, 0, "#4f4a44", `12.5px ${FONT}`, "center"); g.restore();
  }
  // ---- header readout: the pointer's position, or the star size
  const sub = $("sSub");
  const sAng = a => (a < 0 ? "−" : "") + fAng(Math.abs(a));
  if (hover) sub.innerHTML = `<b>${sAng(hover.x)}</b>, <b>${sAng(hover.y)}</b>` + (hover.chip ? (Dz.isPlate ? ` · on the plate <b>${sig(Math.abs(hover.x) / Dz.plate, 3)}</b>, <b>${sig(Math.abs(hover.y) / Dz.plate, 3)}</b> mm from the center` : ` · chip <b>${hover.chip}</b> · pixel <b>${hover.i + 1}</b>, <b>${hover.j + 1}</b>`) : "");
  else sub.innerHTML = "";
  // the depth reached: the slider's own, or less in a view too wide to draw that many objects
  const vd = $("vDepth"), dp = P.depth || 25;
  vd.textContent = skyGeom && skyGeom.capped ? dp.toFixed(1) + " mag (" + skyGeom.mDraw.toFixed(1) + " here)" : dp.toFixed(1) + " mag";
  vd.title = skyGeom && skyGeom.capped ? "A view this wide holds too many objects to draw one by one: it shows down to " + skyGeom.mDraw.toFixed(1) + " mag. Zoom in to reach the depth set." : "";
}
// a photographic plate, drawn as the negative the survey prints show: dark stars on the light, fogged plate, with
// the emulsion's grain (amplitude fading out when the grain is finer than the screen's pixels)
const PLATE_FOG = "#e6e0d2";
function grainNoise(u, v) {
  const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j;
  const h = (a, b) => (hash4(a | 0, b | 0, 7, 11) / 4294967296) * 2 - 1;
  const su = fu * fu * (3 - 2 * fu), sv = fv * fv * (3 - 2 * fv);
  return (h(i, j) * (1 - su) + h(i + 1, j) * su) * (1 - sv) + (h(i, j + 1) * (1 - su) + h(i + 1, j + 1) * su) * sv;
}
function paintPlate(buf, data, W, bw, bh, noise, amp) {
  const a = W / 40, top = Math.asinh(W / a), fog = [230, 224, 210], ink = [24, 22, 20];
  for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
    const i = y * bw + x, v = buf[i];
    let d = v > 0 ? Math.min(1, Math.asinh(v / a) / top) : 0;
    if (amp > 0.02) d = Math.max(0, Math.min(1, d + amp * noise(x, y) * (0.13 + 0.35 * d * (1 - d))));
    data[4 * i] = fog[0] + (ink[0] - fog[0]) * d; data[4 * i + 1] = fog[1] + (ink[1] - fog[1]) * d; data[4 * i + 2] = fog[2] + (ink[2] - fog[2]) * d; data[4 * i + 3] = 255;
  }
}
// asinh stretch to white over the dark chip
function paint(buf, data, W) {
  const a = W / 40, top = Math.asinh(W / a);
  for (let i = 0; i < buf.length; i++) {
    const v = buf[i];
    if (!(v > 0)) { data[4 * i + 3] = 0; continue; }
    const t = Math.min(1, Math.asinh(v / a) / top);
    data[4 * i] = 246; data[4 * i + 1] = 244; data[4 * i + 2] = 236; data[4 * i + 3] = Math.round(255 * t);
  }
}
function pickSky(ev) {
  if (!skyGeom || !cur) return null;
  const G = skyGeom, r = $("cvS").getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
  if (mx < G.mL || mx > G.mL + G.aw || my < G.mT || my > G.mT + G.ah) return null;
  const x = zoom.cx + (mx - G.cxp) / G.s, y = zoom.cy - (my - G.cyp) / G.s;
  const out = { x, y };
  const pixA = cur.pixScale;
  G.chips.forEach((c, n) => {
    if (Math.abs(x - c.X) <= c.Wd / 2 && Math.abs(y - c.Y) <= c.Ht / 2) {
      out.chip = n + 1; out.i = Math.floor((x - (c.X - c.Wd / 2)) / pixA); out.j = Math.floor(((c.Y + c.Ht / 2) - y) / pixA);
    }
  });
  return out;
}
{
  const cv = $("cvS");
  let drag = null;
  const clamp = () => {
    if (!skyGeom) return;
    if (zoom.z <= 1.0001) { zoom.cx = 0; zoom.cy = 0; }
    const e = skyGeom.ext;
    zoom.cx = Math.max(e.x0, Math.min(e.x1, zoom.cx)); zoom.cy = Math.max(e.y0, Math.min(e.y1, zoom.cy));
    cv.classList.toggle("zoomed", zoom.z > 1.001);
  };
  const redraw = () => { if (cur) drawSky(cur, curP); };
  cv.addEventListener("mousemove", ev => {
    if (drag) { if (!skyGeom) return; zoom.cx = drag.cx - (ev.clientX - drag.x) / skyGeom.s; zoom.cy = drag.cy + (ev.clientY - drag.y) / skyGeom.s; clamp(); redraw(); return; }
    hover = pickSky(ev); redraw();
  });
  cv.addEventListener("mouseleave", () => { hover = null; redraw(); });
  cv.addEventListener("mousedown", ev => { if (zoom.z > 1.001) { drag = { x: ev.clientX, y: ev.clientY, cx: zoom.cx, cy: zoom.cy }; cv.style.cursor = "grabbing"; } });
  window.addEventListener("mouseup", () => { if (drag) { drag = null; cv.style.cursor = ""; } });
  cv.addEventListener("wheel", ev => {
    if (!skyGeom) return;
    ev.preventDefault();
    const G = skyGeom, r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    const x = zoom.cx + (mx - G.cxp) / G.s, y = zoom.cy - (my - G.cyp) / G.s;
    const z = Math.max(1, Math.min(1e6, zoom.z * Math.exp(-ev.deltaY * 0.0022))), s1 = G.s0 * z;
    zoom.cx = x - (mx - G.cxp) / s1; zoom.cy = y + (my - G.cyp) / s1; zoom.z = z;
    clamp(); hover = pickSky(ev); redraw();
  }, { passive: false });
  cv.addEventListener("dblclick", () => { zoom.reset(); clamp(); redraw(); });
  $("szReset").addEventListener("click", () => { zoom.reset(); clamp(); redraw(); });
}
// layout panel: zoom, pan, refit, expand
{
  const cv = $("cvIL");
  let drag = null;
  const toFixed = () => { if (lview.mode !== "fixed") { lview.mode = "fixed"; segs.forEach(f => f()); } };
  cv.addEventListener("wheel", ev => {
    if (!cur) return;
    ev.preventDefault(); toFixed();
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, f = Math.exp(-ev.deltaY * 0.0022);
    lview.ox = mx - (mx - lview.ox) * f; lview.oy = my - (my - lview.oy) * f; lview.s *= f;
    drawLayout(cur, curP);
  }, { passive: false });
  cv.addEventListener("mousedown", ev => { drag = { x: ev.clientX, y: ev.clientY, ox: lview.ox, oy: lview.oy }; cv.style.cursor = "grabbing"; });
  window.addEventListener("mousemove", ev => { if (!drag || !cur) return; toFixed(); lview.ox = drag.ox + ev.clientX - drag.x; lview.oy = drag.oy + ev.clientY - drag.y; drawLayout(cur, curP); });
  window.addEventListener("mouseup", () => { if (drag) { drag = null; cv.style.cursor = ""; } });
  cv.addEventListener("dblclick", () => { lview.fit = true; if (cur) drawLayout(cur, curP); });
  $("ilvReset").addEventListener("click", () => { lview.fit = true; if (cur) drawLayout(cur, curP); });
  $("ilvOptsBtn").addEventListener("click", () => { const b = $("ilvOpts"); b.hidden = !b.hidden; });
  document.addEventListener("mousedown", ev => { const b = $("ilvOpts"); if (!b.hidden && !b.contains(ev.target) && ev.target !== $("ilvOptsBtn") && ev.target !== cv) b.hidden = true; });
  $("ilvExpand").innerHTML = H.ICON_EXPAND;
  $("ilvExpand").addEventListener("click", () => setExpanded(!ilvExpanded));
}
function setExpanded(on) {
  ilvExpanded = on;
  document.body.classList.toggle("ilv-expanded", on);
  $("ilvExpand").innerHTML = on ? H.ICON_COLLAPSE : H.ICON_EXPAND;
  $("ilvExpand").title = on ? "Return the layout to the page (Esc)." : "Expand the layout to fill the window (Esc returns).";
  lview.fit = true;
  requestAnimationFrame(() => { if (cur) { drawLayout(cur, curP); drawSky(cur, curP); } });
}

// ------------------------------------------------------------------ main
let cur = null, curP = null;
function render() {
  syncControls();
  curP = params();
  cur = IM.design(curP);
  renderText(cur, curP);
  H.fitPanels();
  drawLayout(cur, curP);
  hover = null;
  drawSky(cur, curP);
}
return {
  render, reset, applyPreset, custom: () => { presetId = "custom"; }, hashParts, readHash, bodyClasses, PRESETS,
  // for the Telescopes mode: the telescope drawing, and the formatting helpers
  drawLayoutOn: (tg, Dz, P) => drawLayout(Dz, P, tg), fmt: { fAng, fLen, fArea }, BANDS,
  presetId: () => presetId,
  redraw: () => { if (cur) { drawLayout(cur, curP); drawSky(cur, curP); } },
  escape: () => { if (ilvExpanded) { setExpanded(false); return true; } if (!$("ilvOpts").hidden) { $("ilvOpts").hidden = true; return true; } return false; },
  test: { state: () => clone(S), design: () => cur, params: () => curP, zoom: () => ({ ...zoom }), skyGeom: () => skyGeom && { ...skyGeom, chips: undefined }, set: o => { Object.assign(S, o); markCustom(); render(); H.scheduleHash(); } },
};
};
})();
