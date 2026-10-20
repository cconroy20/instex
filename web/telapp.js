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
const DEF = { tel: TELS.length ? TELS[0].id : "", focus: "", band: "V", stretch: "log", see: 0.8, field: 2 };
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
// the field of both images of a star (arcsec across, 0.05 to 5), on a log slider in the panel's header
const fieldIn = $("tField");
fieldIn.addEventListener("input", () => { S.field = +Math.pow(10, +fieldIn.value).toPrecision(3); H.schedule(); });
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
  fieldIn.value = Math.log10(S.field); $("vtField").textContent = fAng(S.field, 2);
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
// the images through the atmosphere and without it, on one grid wide enough for the field drawn (lam in m, the
// seeing FWHM and the field in radians); the grid comes in a few sizes, so most changes of the field reuse it
function seeingPSF(pu, eps, lam, see, field) {
  const across = window.TP.seeingGrid(pu, lam, see, field), key = JSON.stringify([pu, eps, lam, see, across]);
  if (scache.key !== key) scache = Object.assign({ key }, window.TP.seeingPSF(pu, eps, lam, see, across));
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
function renderText(Dz, P, pp, ps) {
  const t = telOf(), f = focusOf(), lam = P.lam;
  const fwhm = pp.fwPix * lam * 1e-6 / (Q * t.pupil.D) * RAD;      // arcsec
  // (no summary strip in this mode, his call: the figures are in the boxes)
  const nom = t.nominalD ? Math.round(Dz.feff / 1000 / t.nominalD) : 0;
  rows($("rTelT"), [
    ["Primary", "Ø " + sig(t.D, 3) + " m, f/" + sig(t.F1, 3), t.primaryNote || ""],
    ["Secondary", f.secondary || "–"],
    ["Reflections", String(f.refl || "–"), "Mirrors the light meets before this focus."],
    ["Focal ratio", "f/" + sig(f.F, 3) + (nom ? ` (f/${nom} on the nominal ${t.nominalD} m)` : ""),
      "The focal ratio at this focus. One primary with different secondaries gives different foci." + (nom ? ` The focal ratio here is the focal length over the primary's full ${sig(t.D, 4)} m (corner to corner); the observatory names its foci by the nominal ${t.nominalD} m aperture, so the same focal length is f/${nom} in the focus's name.` : "")],
    ["Focal length", fLen(Dz.feff)],
    ["Plate scale", sig(Dz.plate, 3) + "″/mm", "Sky angle per millimeter at this focus: 206265 / f."],
    ["Collecting area", sig(pp.area, 3) + " m² (like a Ø " + sig(2 * Math.sqrt(pp.area / Math.PI), 3) + " m circle)", "The area of the entrance pupil that collects light: the primary less the central obstruction, the spider vanes and anything else in the beam (measured from the drawn pupil). Each mirror's reflectivity is not included."],
  ]);
  rows($("rImgT"), [
    ["Wavelength", Math.round(lam * 1e4).toLocaleString("en-US") + " Å"],
    ["λ / D", fAng(lam * 1e-6 / t.D * RAD), "The angular scale of the diffraction pattern: the core's FWHM is about 1.0 λ / D."],
    ["Diffraction-limited FWHM", fAng(fwhm), "The FWHM of the diffraction pattern's core, measured from the pattern drawn (λ / D sets the scale; the pupil's shape sets the details)."],
    ["Seeing-limited FWHM", fAng(ps.fwPix * ps.pix * RAD), "Measured from the image through the atmosphere: the seeing and the telescope's diffraction together."],
    ["Peak vs diffraction-limited", sig(100 * ps.peak, 2) + "%", "The peak brightness of the seeing-limited image, relative to the diffraction-limited image of the same star (the same total light)."],
  ]);
}

// ------------------------------------------------------------------ the pupil and image panel
const RAMP = [[0, 0, 0], [70, 22, 16], [166, 58, 36], [230, 140, 60], [250, 214, 150], [255, 250, 238]];
const rampAt = v => { const u = Math.max(0, Math.min(1, v)) * (RAMP.length - 1), k = Math.min(RAMP.length - 2, Math.floor(u)), f = u - k; return [0, 1, 2].map(i => RAMP[k][i] + (RAMP[k + 1][i] - RAMP[k][i]) * f); };
// The 2 x 2 panel: the entrance pupil and the radial profiles above, the diffraction- and seeing-limited images of a
// star below, both images over the same field (S.field, arcsec across)
const C_DIFF = "#2f6a9e", C_SEE = "#c2621d";                           // blue and orange (safe for red-green vision)
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const pow10 = k => (k === 0 ? "1" : "10" + String(k).split("").map(c => SUP[c]).join(""));
// the azimuthal average of an image at radius r (pixels from the center at n/2), by bilinear interpolation at points
// about a pixel apart around the ring (fewer undersample the spikes)
function ringMean(img, n, r) {
  const c = n / 2, K = Math.max(36, Math.min(2048, Math.round(2 * Math.PI * r)));
  let a = 0;
  for (let q = 0; q < K; q++) {
    const x = c + r * Math.cos(2 * Math.PI * (q + 0.5) / K), y = c + r * Math.sin(2 * Math.PI * (q + 0.5) / K);
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    if (i < 0 || j < 0 || i + 1 >= n || j + 1 >= n) return NaN;
    a += img[j * n + i] * (1 - fx) * (1 - fy) + img[j * n + i + 1] * fx * (1 - fy) + img[(j + 1) * n + i] * (1 - fx) * fy + img[(j + 1) * n + i + 1] * fx * fy;
  }
  return a / K;
}
function drawPupil(pp, P, ps) {
  const cv = $("cvP"), { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(cv.width > 0 && cv.height > 0)) return;
  const t = telOf(), f = focusOf(), pu = pupilOf(), eps = epsOf(), dpr = window.devicePixelRatio || 1, lam = P.lam * 1e-6;
  cv.title = f.pupilNote || t.pupilNote || "";
  const ld = lam / t.D * RAD, cw = w / 2, ch = h / 2, head = 40, foot = 30;
  const side = Math.max(40, Math.floor(Math.min(cw - 28, ch - head - foot)));
  const X = k => Math.round(k * cw + (cw - side) / 2), Y = r => Math.round(r * ch + head + (ch - head - foot - side) / 2);
  const label = (x, y, t1, t2, col) => {
    g.textAlign = "center"; g.fillStyle = col || "#4f4a44"; g.font = `12.5px ${FONT}`; g.fillText(t1, x + side / 2, y - 22);
    g.fillStyle = MUTED; g.font = `11.5px ${FONT}`; g.fillText(t2, x + side / 2, y - 7);
  };
  // a scale bar under an image: a round length near 0.3 of the image
  const bar = (x, y, perPx, text) => {
    const tm = side * 0.3 * perPx, p10 = Math.pow(10, Math.floor(Math.log10(tm)));
    const len = [1, 2, 5, 10].map(k => k * p10).reduce((b, q) => (Math.abs(q - tm) < Math.abs(b - tm) ? q : b), p10);
    const yb = y + side + 16;
    g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, yb); g.lineTo(x + len / perPx, yb); g.stroke();
    g.fillStyle = "#4f4a44"; g.font = `12.5px ${FONT}`; g.textAlign = "left"; g.fillText(text(len), x + len / perPx + 8, yb + 4);
  };
  const shade = v => rampAt(S.stretch === "log" ? (Math.log10(Math.max(v, 1e-12)) + 5) / 5 : Math.min(1, v * 4));
  // an image's central field into the square at (x, y): img is n x n with its center at n/2 and pixels of pix
  // arcsec; the half-field hw (pixels) may be fractional, so the square's scale is exact
  const blitField = (img, n, pix, x, y) => {
    const hw = S.field / 2 / pix, K = Math.min(n / 2 - 1, Math.ceil(hw) + 1), m = 2 * K, c = n / 2;
    const oc = document.createElement("canvas"); oc.width = m; oc.height = m;
    const og = oc.getContext("2d"), id = og.createImageData(m, m);
    for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) {
      const col3 = shade(img[(c - K + j) * n + (c - K + i)]), k = 4 * (j * m + i);
      id.data[k] = col3[0]; id.data[k + 1] = col3[1]; id.data[k + 2] = col3[2]; id.data[k + 3] = 255;
    }
    og.putImageData(id, 0, 0);
    g.imageSmoothingEnabled = true; g.drawImage(oc, K + 0.5 - hw, K + 0.5 - hw, 2 * hw, 2 * hw, x, y, side, side);
  };
  // the pupil, 1.1 D across, at the screen's resolution: light where the pupil transmits
  const n = 2 * Math.max(16, Math.round(side * dpr / 2)), ext = 1.1 * pu.D, pm = pupilImage(pu, eps, n, ext);   // n even: the pupil's center on a cell corner
  {
    const oc = document.createElement("canvas"); oc.width = n; oc.height = n;
    const og = oc.getContext("2d"), id = og.createImageData(n, n);
    for (let k = 0; k < n * n; k++) { const v = pm[k]; id.data[4 * k] = 240 - 150 * v; id.data[4 * k + 1] = 236 - 110 * v; id.data[4 * k + 2] = 228 - 60 * v; id.data[4 * k + 3] = 255; }
    og.putImageData(id, 0, 0);
    g.imageSmoothingEnabled = false; g.drawImage(oc, X(0), Y(0), side, side); g.imageSmoothingEnabled = true;
  }
  label(X(0), Y(0), "Entrance pupil", "Ø " + sig(t.pupil.D, 3) + " m");
  bar(X(0), Y(0), ext / side, lm => (lm >= 1 ? sig(lm, 2) + " m" : sig(lm * 100, 2) + " cm"));
  // the two images over the same field: the diffraction-limited one from the fine grid (8 pixels per λ / D) while
  // the field fits inside it, else from the seeing grid
  const pixF = lam / (Q * t.pupil.D) * RAD, pixS = ps.pix * RAD, fine = S.field / 2 <= 60 * ld;
  blitField(fine ? pp.psf : ps.diff, fine ? N : ps.n, fine ? pixF : pixS, X(0), Y(1));
  label(X(0), Y(1), "Diffraction-limited", "perfect optics, no atmosphere", C_DIFF);
  bar(X(0), Y(1), S.field / side, fAng);
  blitField(ps.psf, ps.n, pixS, X(1), Y(1));
  label(X(1), Y(1), "Seeing-limited", (t.space ? "if on the ground, " : "") + sig(S.see, 2) + "″ seeing" + (t.space ? "" : ", long exposure"), C_SEE);
  bar(X(1), Y(1), S.field / side, fAng);
  // the radial profiles, for the same total light: relative to the diffraction-limited peak
  const x0 = Math.round(cw + 52), x1 = Math.round(w - 14), y0 = Y(0), y1 = Y(0) + side, YMIN = -7;
  const fwS = ps.fwPix * pixS, rMin = 0.1 * ld, rMax = Math.min(0.45 * ps.n * pixS, Math.max(0.75 * S.field, 3 * fwS));
  const lx0 = Math.log10(rMin), lx1 = Math.log10(rMax), px = r => x0 + (Math.log10(r) - lx0) / (lx1 - lx0) * (x1 - x0), py = v => y0 + (0 - Math.log10(v)) / (0 - YMIN) * (y1 - y0);
  g.textAlign = "center"; g.fillStyle = "#4f4a44"; g.font = `12.5px ${FONT}`; g.fillText("Radial profiles", (x0 + x1) / 2, y0 - 22);
  g.fillStyle = MUTED; g.font = `11.5px ${FONT}`; g.fillText("the same star, the same total light", (x0 + x1) / 2, y0 - 7);
  g.strokeStyle = "#cfc9bf"; g.lineWidth = 1; g.font = `11px ${FONT}`; g.fillStyle = MUTED;
  for (let k = 0; k >= YMIN; k -= 2) { const y = Math.round(py(Math.pow(10, k))) + 0.5; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.textAlign = "right"; g.fillText(pow10(k), x0 - 6, y + 4); }
  for (let k = Math.ceil(lx0); k <= lx1; k++) {
    const x = Math.round(px(Math.pow(10, k))) + 0.5, v = Math.pow(10, k);
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke();
    g.textAlign = "center"; g.fillText(v >= 0.1 ? sig(v, 1) + "″" : sig(v * 1000, 1) + " mas", x, y1 + 14);
  }
  g.strokeStyle = "#8a847b"; g.beginPath(); g.moveTo(x0 + 0.5, y0); g.lineTo(x0 + 0.5, y1 + 0.5); g.lineTo(x1, y1 + 0.5); g.stroke();
  g.save(); g.translate(x0 - 38, (y0 + y1) / 2); g.rotate(-Math.PI / 2); g.textAlign = "center"; g.fillStyle = MUTED; g.fillText("brightness", 0, 0); g.restore();
  g.textAlign = "center"; g.fillText("radius", (x0 + x1) / 2, y1 + 28);
  // the edge of the images
  if (S.field / 2 > rMin && S.field / 2 < rMax) {
    const xe = Math.round(px(S.field / 2)) + 0.5;
    g.strokeStyle = "#6a6560"; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xe, y0); g.lineTo(xe, y1); g.stroke(); g.setLineDash([]);
    g.save(); g.translate(xe - 4, y0 + 4); g.rotate(-Math.PI / 2); g.textAlign = "right"; g.fillStyle = MUTED; g.font = `11px ${FONT}`; g.fillText("image edge", 0, 0); g.restore();
  }
  const curve = (get, col) => {
    g.save(); g.beginPath(); g.rect(x0, y0 - 1, x1 - x0, y1 - y0 + 2); g.clip();
    g.strokeStyle = col; g.lineWidth = 1.6; g.beginPath();
    let on = false;
    for (let q = 0; q <= 240; q++) {
      const r = Math.pow(10, lx0 + (lx1 - lx0) * q / 240), v = get(r);
      if (!(v > 0)) { on = false; continue; }
      const xx = px(r), yy = Math.min(y1 + 2, py(v));
      if (on) g.lineTo(xx, yy); else g.moveTo(xx, yy);
      on = true;
    }
    g.stroke(); g.restore();
  };
  curve(r => (r <= 60 * ld ? ringMean(pp.psf, N, r / pixF) : ringMean(ps.diff, ps.n, r / pixS)), C_DIFF);
  curve(r => ps.peak * ringMean(ps.psf, ps.n, r / pixS), C_SEE);
  // the key, at the plot's lower left (small radii and faint levels: no curve goes there)
  g.font = `11.5px ${FONT}`; g.textAlign = "left";
  [["diffraction-limited", C_DIFF], ["seeing-limited", C_SEE]].forEach(([txt, col], k) => {
    const yy = y1 - 30 + 16 * k;
    g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 8, yy); g.lineTo(x0 + 24, yy); g.stroke();
    g.fillStyle = col; g.fillText(txt, x0 + 30, yy + 4);
  });
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
  curPS = seeingPSF(pupilOf(), epsOf(), curP.lam * 1e-6, S.see / RAD, S.field / RAD);
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
  hashParts: () => ["t.tel=" + encodeURIComponent(S.tel), "t.focus=" + encodeURIComponent(focusOf().id)].concat(S.band !== DEF.band ? ["t.band=" + encodeURIComponent(S.band)] : []).concat(S.stretch !== DEF.stretch ? ["t.stretch=" + S.stretch] : []).concat(S.see !== DEF.see ? ["t.see=" + S.see] : []).concat(S.field !== DEF.field ? ["t.field=" + S.field] : []),
  readHash: kv => {
    const id = OLD_IDS[kv["t.tel"]] || kv["t.tel"];
    if (id && TELS.find(t => t.id === id)) S.tel = id;
    if (kv["t.focus"]) S.focus = kv["t.focus"];
    if (kv["t.band"] && IMG.BANDS.find(b => b.k === kv["t.band"])) S.band = kv["t.band"];
    if (kv["t.stretch"] === "log" || kv["t.stretch"] === "linear") S.stretch = kv["t.stretch"];
    if (kv["t.see"] && isFinite(+kv["t.see"]) && +kv["t.see"] >= 0.1 && +kv["t.see"] <= 4) S.see = +kv["t.see"];
    if (kv["t.field"] && isFinite(+kv["t.field"]) && +kv["t.field"] >= 0.05 && +kv["t.field"] <= 5) S.field = +kv["t.field"];
  },
  redraw: () => { if (cur) { draw(); drawPupil(curPP, curP, curPS); } },
  test: { state: () => clone(S), design: () => cur, focusAt: () => tlTarget.det && { ...tlTarget.det }, pupil: () => curPP && { area: curPP.area, fwPix: curPP.fwPix }, seeing: () => curPS && { fwhm: curPS.fwPix * curPS.pix * RAD, peak: curPS.peak }, set: o => { Object.assign(S, o); render(); H.scheduleHash(); } },
};
};
})();
