/* Page logic for the Telescopes mode of the Instrument Explorer: one telescope at one of its foci, drawn to scale
   (the Imager's telescope drawing), and its entrance pupil beside the diffraction pattern the pupil makes.
   The telescopes and their foci are in tpresets.js (window.IX_TELESCOPES); the optics are imager.js (window.IM). */
(function () {
"use strict";
window.TELAPP = function (H, IMG) {
const IM = window.IM, $ = H.$;
const { sig, fitCanvas, rows, MUTED, FONT, message } = H;
const { fAng, fLen } = IMG.fmt;
const RAD = IM.RAD, DEG = IM.DEG;
const TELS = window.IX_TELESCOPES || [];
const clone = o => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------ state
const DEF = { tel: TELS.length ? TELS[0].id : "", focus: "", band: "V", stretch: "log" };
let S = clone(DEF);
const telOf = () => TELS.find(t => t.id === S.tel) || TELS[0];
const focusOf = () => { const t = telOf(); return t.foci.find(f => f.id === S.focus) || t.foci[0]; };
const bandOf = () => IMG.BANDS.find(b => b.k === S.band) || IMG.BANDS[0];

// ------------------------------------------------------------------ controls
const fsel = $("tFocus"), bsel = $("tBand");
for (const b of IMG.BANDS) { const o = document.createElement("option"); o.value = b.k; o.textContent = b.k + "  " + Math.round(b.lam * 1e4).toLocaleString("en-US") + " Å"; o.title = b.note || ""; bsel.appendChild(o); }
bsel.addEventListener("change", () => { S.band = bsel.value; H.schedule(); });
fsel.addEventListener("change", () => { S.focus = fsel.value; tlview.fit = true; H.schedule(); });
const segs = [];
const bindSeg = (pairs, get, set) => {
  for (const [id, val] of pairs) $(id).addEventListener("click", () => { set(val); H.schedule(); });
  segs.push(() => { for (const [id, val] of pairs) $(id).setAttribute("aria-pressed", String(get() === val)); });
};
bindSeg([["tsLog", "log"], ["tsLin", "linear"]], () => S.stretch, v => { S.stretch = v; });
function syncControls() {
  const t = telOf(), f = focusOf();
  if (fsel.dataset.tel !== t.id) {
    fsel.innerHTML = "";
    for (const q of t.foci) { const o = document.createElement("option"); o.value = q.id; o.textContent = q.name; fsel.appendChild(o); }
    fsel.dataset.tel = t.id;
  }
  fsel.value = f.id; S.focus = f.id;
  bsel.value = S.band;
  segs.forEach(g => g());
}

// ------------------------------------------------------------------ the telescope at this focus, as the imager's engine sees it
// (a square "detector" as wide as the focus's field, so the drawing's bundles come from the field's edge and center)
function params() {
  const t = telOf(), f = focusOf();
  const fieldMM = 2 * f.F * t.D * 1000 * Math.tan((f.field || 10) / 60 * DEG / 2);
  return Object.assign(clone(IM.DEF), {
    D: t.D, eps: f.eps !== undefined ? f.eps : t.eps, F: f.F, tel: f.design, F1: t.F1, back: f.back, nasmyth: !!f.nasmyth, backN: f.backN,
    field: f.field || 10, optics: "direct", Nx: 1000, Ny: 1000, pix: fieldMM, rows: [1], band: S.band, lam: bandOf().lam, psf: "diff",
    view: "tel", annot: true, stretch: false, telMode: true,
  });
}

// ------------------------------------------------------------------ the pupil and its diffraction pattern: tpupil.js (window.TP)
const { N, Q } = window.TP;
let cache = { key: null };
function pupilAndPSF(pu, eps) {
  const key = JSON.stringify([pu, eps]);
  if (cache.key !== key) cache = Object.assign({ key }, window.TP.pupilAndPSF(pu, eps));
  return cache;
}

// ------------------------------------------------------------------ results strip and readouts
function renderText(Dz, P, pp) {
  const t = telOf(), f = focusOf(), lam = P.lam;
  const fwhm = pp.fwPix * lam * 1e-6 / (Q * t.pupil.D) * RAD;      // arcsec
  const items = [
    ["Collecting area", sig(pp.area, 3) + " m²" + `<small>like a Ø ${sig(2 * Math.sqrt(pp.area / Math.PI), 3)} m circle</small>`, "The area of the entrance pupil that collects light: the primary less the central obstruction, the spider vanes and anything else in the beam (measured from the drawn pupil). Each mirror's reflectivity is not included."],
    ["Focal ratio", "f/" + sig(f.F, 3) + `<small>f ${fLen(Dz.feff)}</small>`, "The focal ratio and focal length at this focus. One primary with different secondaries gives different foci."],
    ["Plate scale", sig(Dz.plate, 3) + "″/mm", "Sky angle per millimeter at this focus: 206265 / f."],
    ["Diffraction", fAng(fwhm) + `<small>FWHM at ${Math.round(lam * 1e4).toLocaleString("en-US")} Å</small>`, "The FWHM of the diffraction pattern's core, measured from the pattern drawn (λ / D sets the scale; the pupil's shape sets the details)."],
    ["Field", f.field ? "Ø " + fAng(f.field * 60) : "not published", f.field ? (f.fieldNote || "The field this focus delivers (corrected or unvignetted).") : "No field is published for this focus (the instruments there bring their own optics); the drawing uses 10′."],
  ];
  $("stats").innerHTML = items.map(([k, v, tt]) => `<div class="stat" title="${tt}"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  rows($("rTelT"), [
    ["Primary", "Ø " + sig(t.D, 3) + " m, f/" + sig(t.F1, 3), t.primaryNote || ""],
    ["Secondary", f.secondary || "–"],
    ["Reflections", String(f.refl || "–"), "Mirrors the light meets before this focus."],
    ["Where", f.where || "–"],
    ["Instruments", f.instruments || "–"],
  ]);
  rows($("rImgT"), [
    ["Wavelength", Math.round(lam * 1e4).toLocaleString("en-US") + " Å"],
    ["λ / D", fAng(lam * 1e-6 / t.D * RAD)],
    ["Image pixel", fAng(lam * 1e-6 / (Q * t.pupil.D) * RAD), "The drawn pattern's pixel: λ / (" + Q + " D)."],
  ]);
  const eps = f.eps !== undefined ? f.eps : t.eps;
  rows($("rPupT"), [
    ["Primary", t.pupil.kind === "hex" ? (t.pupil.rings * (t.pupil.rings + 1) * 3) + " hexagonal segments" : "one mirror"],
    ["Central obstruction", "Ø " + sig(eps * t.D, 3) + " m (ε " + eps.toFixed(3) + ")"],
    ["Spider vanes", (t.pupil.vanes || []).length ? (t.pupil.vanes.length + " × " + sig(t.pupil.vanes[0].w * 1000, 3) + " mm") : "none drawn"],
    ["Area vs a full circle", sig(100 * pp.area / (Math.PI / 4 * t.D * t.D), 3) + "%"],
  ].concat(f.pupilNote ? [["Note", "see the tooltip", f.pupilNote]] : []));
}

// ------------------------------------------------------------------ the pupil and image panel
const RAMP = [[0, 0, 0], [70, 22, 16], [166, 58, 36], [230, 140, 60], [250, 214, 150], [255, 250, 238]];
const rampAt = v => { const u = Math.max(0, Math.min(1, v)) * (RAMP.length - 1), k = Math.min(RAMP.length - 2, Math.floor(u)), f = u - k; return [0, 1, 2].map(i => RAMP[k][i] + (RAMP[k + 1][i] - RAMP[k][i]) * f); };
function drawPupil(pp, P) {
  const cv = $("cvP"), { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(cv.width > 0 && cv.height > 0)) return;
  const t = telOf(), half = Math.floor(w / 2), pad = 14, top = 22, side = Math.min(half - 2 * pad, h - top - 40);
  // the pupil: the mask's central region, light where it transmits
  const span = Math.ceil(t.pupil.D * 0.55 / pp.dx), c = N / 2;
  const oc = document.createElement("canvas"); oc.width = 2 * span; oc.height = 2 * span;
  const og = oc.getContext("2d"), id = og.createImageData(2 * span, 2 * span);
  for (let j = 0; j < 2 * span; j++) for (let i = 0; i < 2 * span; i++) {
    const v = pp.mask[(c - span + j) * N + (c - span + i)], k = 4 * (j * 2 * span + i);
    id.data[k] = 240 - 150 * v; id.data[k + 1] = 236 - 110 * v; id.data[k + 2] = 228 - 60 * v; id.data[k + 3] = 255;
  }
  og.putImageData(id, 0, 0);
  const x0 = pad, y0 = top;
  g.imageSmoothingEnabled = true; g.drawImage(oc, x0, y0 + (h - top - 40 - side) / 2, side, side);
  g.fillStyle = "#4f4a44"; g.font = `12.5px ${FONT}`; g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillText("Entrance pupil, Ø " + sig(t.pupil.D, 3) + " m", x0 + side / 2, top - 6);
  // the image: the pattern's central region, log or linear
  const M = 128, ext = 2 * M;                                        // the central 16 lambda / D
  const oc2 = document.createElement("canvas"); oc2.width = ext; oc2.height = ext;
  const og2 = oc2.getContext("2d"), id2 = og2.createImageData(ext, ext);
  for (let j = 0; j < ext; j++) for (let i = 0; i < ext; i++) {
    const v = pp.psf[(c - M + j) * N + (c - M + i)], k = 4 * (j * ext + i);
    const u = S.stretch === "log" ? (Math.log10(Math.max(v, 1e-12)) + 5) / 5 : Math.min(1, v * 4);
    const col = rampAt(u); id2.data[k] = col[0]; id2.data[k + 1] = col[1]; id2.data[k + 2] = col[2]; id2.data[k + 3] = 255;
  }
  og2.putImageData(id2, 0, 0);
  const x1 = half + pad, ys = y0 + (h - top - 40 - side) / 2;
  g.imageSmoothingEnabled = false; g.drawImage(oc2, x1, ys, side, side); g.imageSmoothingEnabled = true;
  g.fillText("Image of a star at " + Math.round(P.lam * 1e4).toLocaleString("en-US") + " Å (" + (S.stretch === "log" ? "log, 5 decades" : "linear") + ")", x1 + side / 2, top - 6);
  // a scale bar under the image: a round angle
  const pixA = P.lam * 1e-6 / (Q * t.pupil.D) * RAD, pxPerArc = side / ext / pixA;
  const target = side * 0.3 / pxPerArc, p10 = Math.pow(10, Math.floor(Math.log10(target)));
  const len = [1, 2, 5, 10].map(k => k * p10).reduce((b, q) => (Math.abs(q - target) < Math.abs(b - target) ? q : b), p10);
  const yb = ys + side + 16;
  g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x1, yb); g.lineTo(x1 + len * pxPerArc, yb); g.stroke();
  g.textAlign = "left"; g.fillText(fAng(len), x1 + len * pxPerArc + 8, yb + 4);
  // and one under the pupil: a round length
  const pxPerM = side / (2 * span * pp.dx), tm = side * 0.3 / pxPerM, q10 = Math.pow(10, Math.floor(Math.log10(tm)));
  const lm = [1, 2, 5, 10].map(k => k * q10).reduce((b, q) => (Math.abs(q - tm) < Math.abs(b - tm) ? q : b), q10);
  g.beginPath(); g.moveTo(x0, yb); g.lineTo(x0 + lm * pxPerM, yb); g.stroke();
  g.fillText(lm >= 1 ? sig(lm, 2) + " m" : sig(lm * 100, 2) + " cm", x0 + lm * pxPerM + 8, yb + 4);
}

// ------------------------------------------------------------------ the layout panel: zoom, pan, refit
const tlview = { mode: "auto", s: 0, k: 1, ox: 0, oy: 0, fit: true };
{
  const cv = $("cvTL");
  let drag = null;
  cv.addEventListener("wheel", ev => {
    if (!cur) return;
    ev.preventDefault(); tlview.mode = "fixed";
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, f = Math.exp(-ev.deltaY * 0.0022);
    tlview.ox = mx - (mx - tlview.ox) * f; tlview.oy = my - (my - tlview.oy) * f; tlview.s *= f;
    draw();
  }, { passive: false });
  cv.addEventListener("mousedown", ev => { drag = { x: ev.clientX, y: ev.clientY, ox: tlview.ox, oy: tlview.oy }; cv.style.cursor = "grabbing"; });
  window.addEventListener("mousemove", ev => { if (!drag || !cur) return; tlview.mode = "fixed"; tlview.ox = drag.ox + ev.clientX - drag.x; tlview.oy = drag.oy + ev.clientY - drag.y; draw(); });
  window.addEventListener("mouseup", () => { if (drag) { drag = null; cv.style.cursor = ""; } });
  cv.addEventListener("dblclick", () => { tlview.fit = true; tlview.mode = "auto"; draw(); });
  $("tlReset").addEventListener("click", () => { tlview.fit = true; tlview.mode = "auto"; draw(); });
}

// ------------------------------------------------------------------ main
let cur = null, curP = null, curPP = null;
function draw() { if (cur) IMG.drawLayoutOn({ cv: "cvTL", cap: "tlSub", lv: tlview }, cur, curP); }
function render() {
  if (!TELS.length) return;
  syncControls();
  curP = params();
  cur = IM.design(curP);
  const t = telOf(), f = focusOf();
  curPP = pupilAndPSF(Object.assign({}, t.pupil, f.pupil || {}), f.eps !== undefined ? f.eps : t.eps);
  renderText(cur, curP, curPP);
  H.fitPanels();
  if (tlview.mode === "auto") tlview.fit = true;
  draw();
  drawPupil(curPP, curP);
}
const PRESETS = TELS.map(t => ({ id: t.id, tel: t.group, name: t.name, state: { D: t.D } }));
return {
  render, PRESETS,
  presetId: () => S.tel,
  applyPreset: p => { S.tel = p.id; S.focus = ""; tlview.fit = true; H.schedule(); },
  reset: () => { S = clone(DEF); tlview.fit = true; H.schedule(); },
  hashParts: () => ["t.tel=" + encodeURIComponent(S.tel), "t.focus=" + encodeURIComponent(focusOf().id)].concat(S.band !== DEF.band ? ["t.band=" + encodeURIComponent(S.band)] : []).concat(S.stretch !== DEF.stretch ? ["t.stretch=" + S.stretch] : []),
  readHash: kv => {
    if (kv["t.tel"] && TELS.find(t => t.id === kv["t.tel"])) S.tel = kv["t.tel"];
    if (kv["t.focus"]) S.focus = kv["t.focus"];
    if (kv["t.band"] && IMG.BANDS.find(b => b.k === kv["t.band"])) S.band = kv["t.band"];
    if (kv["t.stretch"] === "log" || kv["t.stretch"] === "linear") S.stretch = kv["t.stretch"];
  },
  redraw: () => { if (cur) { draw(); drawPupil(curPP, curP); } },
  test: { state: () => clone(S), design: () => cur, pupil: () => curPP && { area: curPP.area, fwPix: curPP.fwPix }, set: o => { Object.assign(S, o); render(); H.scheduleHash(); } },
};
};
})();
