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
const DEF = { tel: TELS.length ? TELS[0].id : "", focus: "", band: "V", stretch: "log", see: 0.8 };
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
// the seeing FWHM, on a log slider (0.1 to 4 arcsec)
const seeIn = $("tSee");
seeIn.addEventListener("input", () => { S.see = +Math.pow(10, +seeIn.value).toPrecision(3); H.schedule(); });
function syncControls() {
  const t = telOf(), f = focusOf();
  if (fsel.dataset.tel !== t.id) {
    fsel.innerHTML = "";
    for (const q of t.foci) { const o = document.createElement("option"); o.value = q.id; o.textContent = q.name; fsel.appendChild(o); }
    fsel.dataset.tel = t.id;
  }
  fsel.value = f.id; S.focus = f.id;
  bsel.value = S.band;
  seeIn.value = Math.log10(S.see); $("vtSee").textContent = sig(S.see, 2) + "″";
  segs.forEach(g => g());
}

// ------------------------------------------------------------------ the telescope at this focus, as the imager's engine sees it
// (a square "detector" as wide as the focus's field, so the drawing's bundles come from the field's edge and center)
function params() {
  const t = telOf(), f = focusOf();
  const fieldMM = 2 * f.F * t.D * 1000 * Math.tan((f.field || 10) / 60 * DEG / 2);
  return Object.assign(clone(IM.DEF), {
    D: t.D, eps: f.eps !== undefined ? f.eps : t.eps, F: f.F, tel: f.design, F1: t.F1, back: f.back, nasmyth: !!f.nasmyth, backN: f.backN, nasSide: f.side || "down",
    field: f.field || 10, optics: "direct", Nx: 1000, Ny: 1000, pix: fieldMM, rows: [1], band: S.band, lam: bandOf().lam, psf: "diff",
    view: "tel", annot: true, stretch: false, telMode: true,
  });
}

// ------------------------------------------------------------------ the pupil and its diffraction pattern: tpupil.js (window.TP)
const { N, Q } = window.TP;
let cache = { key: null }, scache = { key: null }, icache = { key: null };
function pupilAndPSF(pu, eps) {
  const key = JSON.stringify([pu, eps]);
  if (cache.key !== key) cache = Object.assign({ key }, window.TP.pupilAndPSF(pu, eps));
  return cache;
}
// the image through the atmosphere (lam in m, the seeing FWHM in radians)
function seeingPSF(pu, eps, lam, see) {
  const key = JSON.stringify([pu, eps, lam, see]);
  if (scache.key !== key) scache = Object.assign({ key }, window.TP.seeingPSF(pu, eps, lam, see));
  return scache;
}
// the pupil for drawing, at the screen's resolution (the FFT grid has only 128 cells across the pupil)
function pupilImage(pu, eps, n, ext) {
  const key = JSON.stringify([pu, eps, n, ext]);
  if (icache.key !== key) icache = { key, m: window.TP.pupilImage(pu, eps, n, ext) };
  return icache.m;
}
const pupilOf = () => { const t = telOf(), f = focusOf(); return Object.assign({}, t.pupil, f.pupil || {}); };
const epsOf = () => { const t = telOf(), f = focusOf(); return f.eps !== undefined ? f.eps : t.eps; };

// ------------------------------------------------------------------ results strip and readouts
// "6 × 25 mm", or "2 × 19.1 mm, 2 × 38.1 mm" when the widths differ
const vaneText = vs => {
  if (!vs.length) return "none drawn";
  const n = new Map();
  for (const v of vs) n.set(v.w, (n.get(v.w) || 0) + 1);
  return [...n].map(([w, k]) => k + " × " + sig(w * 1000, 3) + " mm").join(", ");
};
function renderText(Dz, P, pp, ps) {
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
  ]);
  rows($("rImgT"), [
    ["Wavelength", Math.round(lam * 1e4).toLocaleString("en-US") + " Å"],
    ["λ / D", fAng(lam * 1e-6 / t.D * RAD), "The diffraction-limited image is drawn in pixels of λ / (" + Q + " D) = " + fAng(lam * 1e-6 / (Q * t.pupil.D) * RAD) + "."],
    ["Seeing-limited FWHM", fAng(ps.fwPix * ps.pix * RAD), "Measured from the image through the atmosphere: the seeing and the telescope's diffraction together."],
    ["Peak vs diffraction-limited", sig(100 * ps.peak, 2) + "%", "The peak brightness of the seeing-limited image, relative to the diffraction-limited image of the same star (the same total light)."],
  ]);
  const eps = f.eps !== undefined ? f.eps : t.eps;
  rows($("rPupT"), [
    ["Primary", t.pupil.kind === "hex" ? (t.pupil.rings * (t.pupil.rings + 1) * 3) + " hexagonal segments" : "one mirror"],
    ["Central obstruction", "Ø " + sig(eps * t.D, 3) + " m (ε " + eps.toFixed(3) + ")"],
    ["Spider vanes", vaneText(t.pupil.vanes || [])],
    ["Area vs a full circle", sig(100 * pp.area / (Math.PI / 4 * t.D * t.D), 3) + "%"],
  ].concat(f.pupilNote || t.pupilNote ? [["Note", "see the tooltip", f.pupilNote || t.pupilNote]] : []));
}

// ------------------------------------------------------------------ the pupil and image panel
const RAMP = [[0, 0, 0], [70, 22, 16], [166, 58, 36], [230, 140, 60], [250, 214, 150], [255, 250, 238]];
const rampAt = v => { const u = Math.max(0, Math.min(1, v)) * (RAMP.length - 1), k = Math.min(RAMP.length - 2, Math.floor(u)), f = u - k; return [0, 1, 2].map(i => RAMP[k][i] + (RAMP[k + 1][i] - RAMP[k][i]) * f); };
// three images side by side: the entrance pupil, the diffraction-limited image of a star, and the seeing-limited one
function drawPupil(pp, P, ps) {
  const cv = $("cvP"), { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(cv.width > 0 && cv.height > 0)) return;
  const t = telOf(), pu = pupilOf(), eps = epsOf(), dpr = window.devicePixelRatio || 1, lam = P.lam * 1e-6;
  const col = Math.floor(w / 3), top = 40, side = Math.max(40, Math.min(col - 24, h - top - 40));
  const ys = top + (h - top - 40 - side) / 2, xs = [0, 1, 2].map(k => k * col + (col - side) / 2), yb = ys + side + 16;
  const label = (x, t1, t2) => {
    g.textAlign = "center"; g.fillStyle = "#4f4a44"; g.font = `12.5px ${FONT}`; g.fillText(t1, x + side / 2, ys - 22);
    g.fillStyle = MUTED; g.font = `11.5px ${FONT}`; g.fillText(t2, x + side / 2, ys - 7);
  };
  // a scale bar under an image: a round length near 0.3 of the image
  const bar = (x, perPx, text) => {
    const tm = side * 0.3 * perPx, p10 = Math.pow(10, Math.floor(Math.log10(tm)));
    const len = [1, 2, 5, 10].map(k => k * p10).reduce((b, q) => (Math.abs(q - tm) < Math.abs(b - tm) ? q : b), p10);
    g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, yb); g.lineTo(x + len / perPx, yb); g.stroke();
    g.fillStyle = "#4f4a44"; g.font = `12.5px ${FONT}`; g.textAlign = "left"; g.fillText(text(len), x + len / perPx + 8, yb + 4);
  };
  const blit = (n, fill, x, smooth) => {
    const oc = document.createElement("canvas"); oc.width = n; oc.height = n;
    const og = oc.getContext("2d"), id = og.createImageData(n, n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) fill(i, j, id.data, 4 * (j * n + i));
    og.putImageData(id, 0, 0);
    g.imageSmoothingEnabled = smooth; g.drawImage(oc, x, ys, side, side); g.imageSmoothingEnabled = true;
  };
  const shade = v => rampAt(S.stretch === "log" ? (Math.log10(Math.max(v, 1e-12)) + 5) / 5 : Math.min(1, v * 4));
  // the pupil, 1.1 D across, at the screen's resolution: light where the pupil transmits
  const n = 2 * Math.max(16, Math.round(side * dpr / 2)), ext = 1.1 * pu.D, pm = pupilImage(pu, eps, n, ext);   // n even: the pupil's center on a cell corner
  blit(n, (i, j, d, k) => { const v = pm[j * n + i]; d[k] = 240 - 150 * v; d[k + 1] = 236 - 110 * v; d[k + 2] = 228 - 60 * v; d[k + 3] = 255; }, xs[0], false);
  label(xs[0], "Entrance pupil", "Ø " + sig(t.pupil.D, 3) + " m");
  bar(xs[0], ext / side, lm => (lm >= 1 ? sig(lm, 2) + " m" : sig(lm * 100, 2) + " cm"));
  // the diffraction-limited image: the central 16 λ / D of the pattern
  const M = 128, c = N / 2;
  blit(2 * M, (i, j, d, k) => { const col3 = shade(pp.psf[(c - M + j) * N + (c - M + i)]); d[k] = col3[0]; d[k + 1] = col3[1]; d[k + 2] = col3[2]; d[k + 3] = 255; }, xs[1], false);
  label(xs[1], "Diffraction-limited", "perfect optics, no atmosphere");
  bar(xs[1], lam / (Q * t.pupil.D) * RAD * 2 * M / side, fAng);
  // the seeing-limited image: 4 FWHM across (the seeing and diffraction together, estimated)
  const fw = Math.hypot(S.see / RAD, 1.03 * lam / t.D), hw = Math.min(N / 2 - 1, Math.max(8, Math.round(2 * fw / ps.pix)));
  blit(2 * hw, (i, j, d, k) => { const col3 = shade(ps.psf[(c - hw + j) * N + (c - hw + i)]); d[k] = col3[0]; d[k + 1] = col3[1]; d[k + 2] = col3[2]; d[k + 3] = 255; }, xs[2], true);
  label(xs[2], "Seeing-limited", (t.space ? "if on the ground, " : "") + sig(S.see, 2) + "″ seeing" + (t.space ? "" : ", long exposure"));
  bar(xs[2], ps.pix * RAD * 2 * hw / side, fAng);
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
let cur = null, curP = null, curPP = null, curPS = null;
const tlTarget = { cv: "cvTL", cap: "tlSub", lv: tlview };
function draw() { if (cur) IMG.drawLayoutOn(tlTarget, cur, curP); }
function render() {
  if (!TELS.length) return;
  syncControls();
  curP = params();
  cur = IM.design(curP);
  const t = telOf(), f = focusOf();
  curPP = pupilAndPSF(pupilOf(), epsOf());
  curPS = seeingPSF(pupilOf(), epsOf(), curP.lam * 1e-6, S.see / RAD);
  renderText(cur, curP, curPP, curPS);
  H.fitPanels();
  if (tlview.mode === "auto") tlview.fit = true;
  draw();
  drawPupil(curPP, curP, curPS);
}
// links made before Keck I and II became one telescope, and Magellan one (Clay)
const OLD_IDS = { keck1: "keck", keck2: "keck", baade: "magellan", clay: "magellan" };
const PRESETS = TELS.map(t => ({ id: t.id, tel: t.group, name: t.name, state: { D: t.D } }));
return {
  render, PRESETS,
  presetId: () => S.tel,
  applyPreset: p => { S.tel = p.id; S.focus = ""; tlview.fit = true; H.schedule(); },
  reset: () => { S = clone(DEF); tlview.fit = true; H.schedule(); },
  hashParts: () => ["t.tel=" + encodeURIComponent(S.tel), "t.focus=" + encodeURIComponent(focusOf().id)].concat(S.band !== DEF.band ? ["t.band=" + encodeURIComponent(S.band)] : []).concat(S.stretch !== DEF.stretch ? ["t.stretch=" + S.stretch] : []).concat(S.see !== DEF.see ? ["t.see=" + S.see] : []),
  readHash: kv => {
    const id = OLD_IDS[kv["t.tel"]] || kv["t.tel"];
    if (id && TELS.find(t => t.id === id)) S.tel = id;
    if (kv["t.focus"]) S.focus = kv["t.focus"];
    if (kv["t.band"] && IMG.BANDS.find(b => b.k === kv["t.band"])) S.band = kv["t.band"];
    if (kv["t.stretch"] === "log" || kv["t.stretch"] === "linear") S.stretch = kv["t.stretch"];
    if (kv["t.see"] && isFinite(+kv["t.see"]) && +kv["t.see"] >= 0.1 && +kv["t.see"] <= 4) S.see = +kv["t.see"];
  },
  redraw: () => { if (cur) { draw(); drawPupil(curPP, curP, curPS); } },
  test: { state: () => clone(S), design: () => cur, focusAt: () => tlTarget.det && { ...tlTarget.det }, pupil: () => curPP && { area: curPP.area, fwPix: curPP.fwPix }, seeing: () => curPS && { fwhm: curPS.fwPix * curPS.pix * RAD, peak: curPS.peak }, set: o => { Object.assign(S, o); render(); H.scheduleHash(); } },
};
};
})();
