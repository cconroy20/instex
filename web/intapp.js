/* Page logic for the Interferometer mode of the Instrument Explorer: a radio array in one of its configurations,
   the uv plane its baselines sample as the Earth turns, and the synthesized beam and the dirty image that sampling
   makes of a model sky. The arrays are in rpresets.js (window.IX_ARRAYS); the physics is interf.js (window.RI). */
(function () {
"use strict";
window.INTAPP = function (H, IMG) {
const RI = window.RI, $ = H.$;
const { sig, fitCanvas, rows, MUTED, FONT } = H;
const { fAng } = IMG.fmt;
const DEG = RI.DEG, RAD = RI.RAD, C = RI.C;
const ARRS = window.IX_ARRAYS || [];
const clone = o => JSON.parse(JSON.stringify(o));
// Image skies (sources and credits in data/interf/images.md): the image's file, width (arcsec) and the credit drawn
// with the image; the brightness is the picture's own (the 8-bit gray value)
const IMGS = [
  { k: "m101", name: "M101 (Hubble)", file: "img/m101_hubble.jpg", width: 828.43, what: "M101 in visible light", credit: "Image: European Space Agency & NASA (CC BY 4.0)" },
];
const SKIES = [["point", "Point"], ["double", "Two points"], ["gaussian", "Gaussian"], ["disc", "Uniform disc"], ["ring", "Ring"]].concat(IMGS.map(q => [q.k, q.name]));
const SIZE_LABEL = { point: "Size", double: "Separation", gaussian: "FWHM", disc: "Diameter", ring: "Diameter", m101: "Width" };
const imgOf = k => IMGS.find(q => q.k === k);
// the images, read once from their files into a pyramid of brightness arrays; a large image is read through a
// canvas in strips (a canvas the image's full size would exceed some browsers' limits)
const imgData = {}, imgBusy = {};
function loadImg(k) {
  const q = imgOf(k);
  if (!q || imgData[k] || imgBusy[k]) return;
  imgBusy[k] = true;
  const im = new Image();
  im.onload = () => {
    const w = im.naturalWidth, h = im.naturalHeight, v = new Uint8Array(w * h), rowsPer = Math.max(1, Math.floor(4e6 / w));
    const c = document.createElement("canvas"); c.width = w; c.height = rowsPer;
    const g = c.getContext("2d", { willReadFrequently: true });
    for (let y0 = 0; y0 < h; y0 += rowsPer) {
      const m = Math.min(rowsPer, h - y0);
      g.clearRect(0, 0, w, rowsPer); g.drawImage(im, 0, y0, w, m, 0, 0, w, m);
      const d = g.getImageData(0, 0, w, m).data;
      for (let j = 0; j < w * m; j++) v[y0 * w + j] = d[4 * j];
    }
    imgData[k] = RI.pyramid({ w, h, v, scale: 1 / 255 }); imgBusy[k] = false; vcache.key = null; tcache.key = null; H.schedule();
  };
  im.onerror = () => { imgBusy[k] = false; };
  im.src = q.file;
}
const BUDGET = 2e6;                                                  // samples per observation, at most
const MAXPAIRS = 1e5;                                                // baselines drawn at random beyond this many
const C_UV = "#2f6a9e", C_MIR = "#9dbcd9", C_NOW = "#c2621d";        // samples, mirror points, the moment played

// ------------------------------------------------------------------ formats
const fLen = m => (m >= 1000 ? sig(m / 1000, 3) + " km" : sig(m, 3) + " m");
const fLam = (m, d = 3) => (m >= 1 ? sig(m, d) + " m" : m >= 0.01 ? sig(m * 100, d) + " cm" : m >= 1e-3 ? sig(m * 1000, d) + " mm" : sig(m * 1e6, d) + " µm");
const fNu = (g, d = 4) => (g >= 1 ? sig(g, d) + " GHz" : sig(g * 1000, d) + " MHz");
const fDur = h => (h < 1 ? Math.round(h * 60) + " min" : sig(h, 3) + " h");
const fDeg = d => (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d).toFixed(1) + "°";
const r125 = x => { const p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; };
// a round angle (arcsec) in the unit it is shown in
const niceAng = a => (a >= 3600 ? 3600 * r125(a / 3600) : a >= 60 ? 60 * r125(a / 60) : r125(a));

// ------------------------------------------------------------------ state
// angles in degrees, hours, GHz, arcseconds; el null = the array's own elevation limit; lay: the layout ("built" =
// the configuration's pads, else a made-up layout of na antennas spanning ext m, seed for the random one); off:
// antennas switched off and mv: antennas moved ({ k: [e, n] } m), both by their index in the layout
const arrById = id => ARRS.find(a => a.id === id) || ARRS[0];
function defaultsFor(a) {
  const d = a.defaults, c = a.configs.find(q => q.id === d.cfg) || a.configs[0], b = a.bands.find(q => q.k === d.band) || a.bands[0];
  const est = C / (d.nu * 1e9) / c.bmax * RAD;                       // lambda / B_max, arcsec
  return { arr: a.id, cfg: c.id, lay: "built", na: c.ants.length, ext: +c.bmax.toPrecision(2), seed: 1, conc: 1, dec: d.dec, dur: d.dur, el: null, band: b.k, nu: d.nu, bw: 0, wt: "natural", rob: 0.5,
    sky: "double", size: niceAng(5 * est), field: niceAng(25 * est), uvv: "uv", bstr: "lin", off: [], mv: {} };
}
let S = ARRS.length ? defaultsFor(ARRS[0]) : {};
const arrOf = () => arrById(S.arr);
const cfgOf = () => { const a = arrOf(); return a.configs.find(c => c.id === S.cfg) || a.configs[0]; };
const bandOf = () => { const a = arrOf(); return a.bands.find(b => b.k === S.band) || a.bands[0]; };
const elOf = () => (S.el === null || S.el === undefined ? arrOf().elLimit : S.el);
// the primary beam's FWHM (radians) at nu (GHz): the observatory's relation, in arcmin times GHz (the VLA) or in
// lambda / D (ALMA)
const pbOf = nu => { const a = arrOf(), p = a.pb; return p.arcminGHz ? ((p.band && p.band[S.band]) || p.arcminGHz) / nu / 60 * DEG : p.k * C / (nu * 1e9) / a.dish; };
// the layout's pads: the configuration's, or a made-up layout (cached)
let lcache = { key: null };
function pads() {
  if (S.lay === "built") return { ants: cfgOf().ants, names: cfgOf().names || [] };
  const key = JSON.stringify([S.lay, S.na, S.ext, arrOf().dish, S.seed, S.conc]);
  if (lcache.key !== key) { const ants = RI.layout(S.lay, S.na, S.ext, arrOf().dish, S.seed, S.conc); lcache = { key, ants, names: ants.map((_, k) => "antenna " + (k + 1)) }; }
  return lcache;
}
// the antennas now: the layout's, with the reader's moves and switches
function antsNow() {
  const off = new Set(S.off), P = pads();
  return P.ants.map((p, k) => { const m = S.mv[k]; return { e: m ? m[0] : p[0], n: m ? m[1] : p[1], u: m ? 0 : p[2] || 0, on: !off.has(k), name: P.names[k] || "" }; });
}
const modified = () => S.off.length > 0 || Object.keys(S.mv).length > 0;

// ------------------------------------------------------------------ controls
const segs = [];
const bindSeg = (pairs, get, set) => {
  for (const [id, val] of pairs) $(id).addEventListener("click", () => { stopPlay(); set(val); H.schedule(); H.scheduleHash(); });
  segs.push(() => { for (const [id, val] of pairs) $(id).setAttribute("aria-pressed", String(get() === val)); });
};
bindSeg([["rwNat", "natural"], ["rwRob", "robust"], ["rwUni", "uniform"]], () => S.wt, v => { S.wt = v; });
bindSeg([["ruvC", "uv"], ["ruvA", "amp"]], () => S.uvv, v => { S.uvv = v; });
bindSeg([["rbLin", "lin"], ["rbLog", "log"]], () => S.bstr, v => { S.bstr = v; });
const csel = $("rCfg"), bsel = $("rBand"), ssel = $("rSky"), lsel = $("rLay");
const LAYS = [["built", "As built"], ["random", "Random"], ["grid", "Grid"], ["line", "Line, east–west"], ["L", "L"], ["T", "T"], ["Y", "Y"], ["cross", "Cross"], ["ring", "Ring"]];
for (const [k, t] of LAYS) { const o = document.createElement("option"); o.value = k; o.textContent = t; lsel.appendChild(o); }
lsel.addEventListener("change", () => {
  stopPlay();
  // leaving the configuration's pads: start from its antenna count and longest baseline
  if (S.lay === "built") { S.na = cfgOf().ants.length; S.ext = +cfgOf().bmax.toPrecision(2); }
  S.lay = lsel.value; S.off = []; S.mv = {}; alview.fit = true; H.schedule();
});
$("rRedraw").addEventListener("click", () => { stopPlay(); S.seed = (S.seed % 9973) + 1; S.off = []; S.mv = {}; alview.fit = true; H.schedule(); });
for (const [k, t] of SKIES) { const o = document.createElement("option"); o.value = k; o.textContent = t; ssel.appendChild(o); }
csel.addEventListener("change", () => { stopPlay(); S.cfg = csel.value; S.off = []; S.mv = {}; alview.fit = true; H.schedule(); });
bsel.addEventListener("change", () => {
  stopPlay(); S.band = bsel.value; const b = bandOf();
  S.nu = b.rep || +((b.lo + b.hi) / 2).toPrecision(4); S.bw = Math.min(S.bw, b.bw); H.schedule();
});
ssel.addEventListener("change", () => {
  stopPlay(); S.sky = ssel.value;
  // an image comes at its own width, with the field a little wider
  const q = imgOf(S.sky); if (q) { S.size = q.width; S.field = niceAng(1.25 * q.width); }
  H.schedule();
});
// sliders: [id, key, log10?, digits]
const SL = [["rNa", "na", true], ["rExt", "ext", true], ["rConc", "conc", false], ["rDec", "dec", false], ["rDur", "dur", false], ["rEl", "el", false], ["rNu", "nu", false], ["rBw", "bw", false], ["rRob", "rob", false], ["rSize", "size", true], ["rField", "field", true]];
for (const [id, key, lg] of SL) $(id).addEventListener("input", () => {
  stopPlay();
  const x = +$(id).value, v = lg ? Math.pow(10, x) : x;
  S[key] = key === "na" ? Math.round(v) : lg ? +v.toPrecision(key === "ext" ? 2 : 3) : +v.toFixed(key === "nu" || key === "bw" ? 4 : 2);
  // a new count or size makes a new layout: the switches and moves of the old one no longer apply
  if (key === "na" || key === "ext" || key === "conc") { S.off = []; S.mv = {}; alview.fit = true; }
  quick();
  H.schedule();
});
function syncControls() {
  const a = arrOf(), c = cfgOf(), b = bandOf();
  if (csel.dataset.arr !== a.id) {
    csel.innerHTML = ""; bsel.innerHTML = "";
    for (const q of a.configs) { const o = document.createElement("option"); o.value = q.id; o.textContent = q.name; o.title = "Longest baseline " + fLen(q.bmax); csel.appendChild(o); }
    for (const q of a.bands) { const o = document.createElement("option"); o.value = q.k; o.textContent = q.name; bsel.appendChild(o); }
    csel.dataset.arr = a.id;
  }
  csel.value = c.id; S.cfg = c.id; bsel.value = b.k; S.band = b.k; ssel.value = S.sky;
  const nuIn = $("rNu"), bwIn = $("rBw");
  nuIn.min = b.lo; nuIn.max = b.hi; nuIn.step = String(+((b.hi - b.lo) / 500).toPrecision(2));
  bwIn.min = 0; bwIn.max = b.bw; bwIn.step = String(+(b.bw / 200).toPrecision(2));
  const put = (id, v, txt) => { const el = $(id); if (document.activeElement !== el) el.value = String(v); $("v" + id).textContent = txt; };
  lsel.value = S.lay;
  const gen = S.lay !== "built";
  const sd = !!a.single;
  $("rLayRow").hidden = sd; $("rElRow").hidden = sd; $("rDurRow").hidden = sd; $("rBwRow").hidden = sd; $("rWtRow").hidden = sd;
  $("rCfgRow").hidden = gen || sd; $("rNaRow").hidden = !gen; $("rExtRow").hidden = !gen; $("rConcRow").hidden = !gen || S.lay === "ring"; $("rRedraw").hidden = S.lay !== "random";
  put("rConc", S.conc, S.conc === 1 ? "even" : S.conc.toFixed(2));
  $("rExt").min = String(Math.log10(Math.max(20, 3 * a.dish)));
  put("rNa", Math.log10(S.na), S.na.toLocaleString("en-US"));
  put("rExt", Math.log10(S.ext), fLen(S.ext));
  put("rDec", S.dec, fDeg(S.dec));
  put("rDur", S.dur, S.dur > 0 ? fDur(S.dur) : "snapshot");
  put("rEl", elOf(), Math.round(elOf() * 10) / 10 + "°" + (S.el === null ? "" : ""));
  put("rNu", S.nu, fNu(S.nu, 3) + " (" + fLam(C / (S.nu * 1e9), 2) + ")");
  put("rBw", S.bw, S.bw > 0 ? fNu(S.bw) : "one frequency");
  put("rRob", S.rob, (S.rob > 0 ? "+" : S.rob < 0 ? "−" : "") + Math.abs(S.rob).toFixed(1));
  put("rSize", Math.log10(S.size), fAng(S.size));
  put("rField", Math.log10(S.field), fAng(S.field));
  $("lrSize").textContent = SIZE_LABEL[S.sky];
  $("rSizeRow").hidden = S.sky === "point";
  $("rRobRow").hidden = S.wt !== "robust" || sd;
  $("rRestore").hidden = !modified();
  $("rPlay").textContent = play ? "■ Stop" : "▶ Play";
  $("rPlay").disabled = !(S.dur > 0) || sd;
  segs.forEach(g => g());
}

// ------------------------------------------------------------------ the computation
// While a slider moves, a coarser image grid keeps the page responsive; the full grid follows when it stops.
let quickUntil = 0, refineTimer = 0;
function quick() { quickUntil = performance.now() + 250; clearTimeout(refineTimer); refineTimer = setTimeout(() => H.schedule(), 280); }
let vcache = { key: null }, tcache = { key: null }, pcache = { key: null };
function compute(fast) {
  const a = arrOf(), ants = antsNow(), lat = a.lat * DEG, dec = S.dec * DEG, elMin = elOf() * DEG;
  const nu = S.nu * 1e9, bw = S.bw * 1e9, lam = C / nu;
  // the baselines (a random draw of MAXPAIRS beyond that many), their lengths sorted, and the exact extremes, kept
  // while the layout stays the same
  const akey = JSON.stringify([S.arr, S.cfg, S.lay, S.na, S.ext, S.seed, S.conc, S.off, S.mv]);
  if (pcache.key !== akey) { const B = RI.baselines(ants, lat, MAXPAIRS); B.len.sort(); pcache = { key: akey, B, ex: RI.extremes(ants) }; }
  const B = pcache.B, L = B.len, on = ants.filter(x => x.on).length;
  const R = { a, ants, lat, nu, bw, lam, L, on, nb: B.total, nbUsed: B.length, sub: B.sub, Bmax: pcache.ex.bmax, Bmin: pcache.ex.bmin };
  R.pb = pbOf(S.nu);
  R.up = RI.hoursUp(S.dur, dec, lat, elMin);
  R.transit = RI.elevation(0, dec, lat) / DEG;
  let Sm, w, step = 1 / 120, nCh = 1;
  if (a.single) {
    // a single dish: every spacing within the illuminated aperture at once, weighted by the aperture's
    // autocorrelation; no Earth rotation, and no primary-beam taper (a map is made by scanning the beam over the sky)
    const ap = RI.aperture(a.single.ew, a.single.ns, nu), big = Math.max(a.single.ew, a.single.ns);
    Object.assign(R, { single: true, pb: 0, nb: 0, Bmax: big, Bmin: 0, ext: big / lam, full: ap, step: 0, nCh: 1 });
    R.reach = Math.abs(S.dec - a.lat) <= a.zenLimit;
    Sm = R.reach ? ap : Object.assign({}, ap, { n: 0 });
    R.S = Sm;
    if (!Sm.n) return R;
    w = ap.w0;
  } else {
  if (R.nb === 0) return R;
  // the extent of the uv plane: the longest baseline at the band's highest frequency
  R.ext = R.Bmax * (nu + bw / 2) / C;
  // the time step (30 s) and the channels across the band, coarsened together to stay within the budget; the
  // channels are spaced like the time samples on the longest track
  for (let it = 0; it < 60; it++) {
    nCh = bw > 0 ? Math.max(2, Math.min(64, Math.ceil((bw / nu) / (0.2618 * step)))) : 1;
    const nt = S.dur > 0 ? S.dur / step + 1 : 1;
    if (R.nbUsed * nCh * nt <= BUDGET) break;
    if (S.dur > 0) step *= 1.25; else break;
  }
  const full = RI.sample({ ants, lat, dec, elMin, dur: S.dur, nu, bw, nCh, step, B });
  R.full = full; R.step = step; R.nCh = nCh;
  // while playing, the samples up to the moment played: a prefix, the samples running in time order
  Sm = full;
  if (play) {
    const k = full.up.filter(h => h <= play.h + 1e-9).length, m = k * full.nb * full.nCh;
    Sm = Object.assign({}, full, { u: full.u.subarray(0, m), v: full.v.subarray(0, m), n: m, upNow: k });
  }
  R.S = Sm;
  if (!Sm.n) return R;
  // the uniform and robust weights count samples in uv cells: an image about 250 beams across, or coarser where
  // the time samples (or the channels) lie further apart on the longest track, so that a track fills its cells
  // (with the baselines a random draw, cells sqrt(total / drawn) wider hold as many samples as the full set's would)
  const cell = Math.max(R.ext / 250, 1.5 * 0.2618 * step * R.ext, nCh > 1 ? 1.5 * (bw / (nCh - 1)) / nu * R.ext : 0) * (R.sub ? Math.sqrt(R.nb / R.nbUsed) : 1);
  R.cell = cell;
  w = RI.weigh(Sm, S.wt, S.rob, cell);
  }
  // the weights on a grid: the samples gridded, or a single dish's aperture put straight onto the cells
  const gridAt = (nn, du) => (R.single ? RI.apertureGrid(Sm.single, nn, du) : RI.grid(Sm, w, nn, du));
  // the beam's size and sidelobes, measured on a grid of its own (pixels 1/20 of the shortest fringe), coarser
  // if the main lobe does not fit
  const nm = fast ? 256 : 512;
  for (let k = 0, pixm = 0.05 / R.ext; k < 3; k++, pixm *= 3) {
    const Gm = gridAt(nm, 1 / (nm * pixm)), Dm = RI.dirty(Gm.g, null, nm);
    const f = RI.fitBeam(Dm.beam, nm, pixm);
    if (f) { R.beam = f; R.side = RI.sidelobe(Dm.beam, nm, 1.5 * f.maj / pixm); break; }
  }
  // the image grid: twice the field across (so that the beam's sidelobes and the sky do not wrap into the field),
  // at about one pixel per screen pixel
  const cv = $("cvU"), dpr = window.devicePixelRatio || 1, sideCss = Math.max(80, Math.min(cv.clientWidth / 2 - 28, cv.clientHeight / 2 - 70));
  let n = 256; while (n < Math.min(1024, 2 * sideCss * dpr)) n *= 2;
  if (fast && n > 256) n /= 2;
  const F = S.field / RAD, pix = 2 * F / n;
  const G = gridAt(n, 1 / (2 * F));
  R.drop = R.single ? G.drop : G.drop / Sm.n;
  const im = imgOf(S.sky), pyr = im ? imgData[S.sky] : null, model = im ? "image" : S.sky;
  if (im && !pyr) { loadImg(S.sky); R.loading = true; }
  // the pyramid's level for this grid: pixels just below half the grid's
  const imd = pyr ? RI.level(pyr, S.size / RAD, pix) : null;
  R.imgLevel = imd ? { w: imd.w, pix: S.size / imd.w } : null;
  const key = JSON.stringify([S.sky, S.size, n, pix, R.pb, imd ? imd.w : 0]);
  if (vcache.key !== key) vcache = { key, V: RI.visibilities(RI.skyImage(model, S.size / RAD, n, pix, R.pb, imd), n) };
  const D = RI.dirty(G.g, vcache.V, n);
  const tkey = JSON.stringify([S.sky, S.size, n, pix, imd ? imd.w : 0]);
  if (tcache.key !== tkey) tcache = { key: tkey, s: RI.skyImage(model, S.size / RAD, n, pix, 0, imd) };
  Object.assign(R, { n, pix, F, D, sky: tcache.s, w });
  return R;
}

// ------------------------------------------------------------------ readouts
function renderText(R) {
  const a = R.a, tot = R.ants.length, nmv = Object.keys(S.mv).length;
  if (R.single) {
    const sd = a.single, bm = R.beam;
    rows($("rArrR"), [
      ["Reflector", "Ø " + sig(a.dish, 3) + " m", a.dishNote || ""],
      ["Illuminated", sig(sd.ew, 3) + " × " + sig(sd.ns, 3) + " m", "The part of the reflector the feed illuminates (east-west × north-south), drawn blue; the page takes the illumination as uniform. " + (sd.note || "")],
      ["Spacings", "all, 0 to " + fLen(Math.max(sd.ew, sd.ns)), "A filled aperture measures every spacing within the illuminated area at once, each weighted by how often the spacing occurs across the aperture (the aperture's autocorrelation), including the zero spacing: the total flux."],
      ["Zenith-angle limit", sig(a.zenLimit, 3) + "°", "The dish is fixed; the feed moves to point within this angle of the zenith."],
    ]);
    rows($("rObsR"), [
      ["Within reach", R.reach ? "yes" : "no", "Declinations " + fDeg(a.lat - a.zenLimit) + " to " + fDeg(a.lat + a.zenLimit) + ": the source must pass within " + sig(a.zenLimit, 3) + "° of the zenith (latitude " + fDeg(a.lat) + ")."],
      ["Elevation at transit", R.transit > 0 ? Math.round(R.transit) + "°" : "never rises", "The source's elevation at the meridian: 90° − |latitude − declination|."],
      ["Field of view", "the beam", "A single dish sees one beam at a time; a map is made by scanning the beam across the sky, so the map has no primary-beam taper."],
    ]);
    rows($("rImgR"), [
      ["Beam", bm ? fAng(bm.maj * RAD, 3) + " × " + fAng(bm.min * RAD, 3) + ", PA " + Math.round(bm.pa) + "°" : "–", "The FWHM of the dish's beam, a Gaussian fitted to the main lobe of the diffraction pattern of the illuminated aperture (about 1.03 λ / D). " + (a.beamNote || "")],
      ["Peak sidelobe", R.side !== undefined && R.side !== null ? (R.side >= 0 ? "+" : "−") + sig(Math.abs(R.side) * 100, 2) + "%" : "–", "The first ring of the diffraction pattern (1.75% for a uniformly illuminated circle); a filled aperture's beam has no negative sidelobes."],
      ["Largest scale", "all", "The dish measures the zero spacing, the total flux, so no structure is resolved out, however large."],
    ]);
    return;
  }
  rows($("rArrR"), [
    ["Antennas", (R.on < tot ? R.on.toLocaleString("en-US") + " of " + tot.toLocaleString("en-US") : tot.toLocaleString("en-US")) + " × " + sig(a.dish, 3) + " m" + (nmv ? " (" + nmv + " moved)" : ""), "The antennas in this configuration, each a dish of this diameter. Click an antenna in the drawing to switch off or on; drag to move."],
    ["Baselines", R.nb.toLocaleString("en-US"), "Every pair of antennas is a baseline: N (N − 1) / 2 of them." + (R.sub ? " Beyond " + MAXPAIRS.toLocaleString("en-US") + ", the page uses a random draw of that many pairs (" + R.nbUsed.toLocaleString("en-US") + " here): the uv coverage and the beam come out the same, statistically, as with all the pairs." : "")],
    ["Longest baseline", R.nb ? fLen(R.Bmax) : "–", "The longest baseline on the ground. The longest baseline makes the finest fringes, and so sets the resolution, about λ / B_max."],
    ["Shortest baseline", R.nb ? fLen(R.Bmin) : "–", "The shortest baseline on the ground. The shortest baseline makes the widest fringes, and so sets the largest structure the array can see. Two dishes cannot stand closer than a dish diameter, so no baseline is shorter than that."],
  ]);
  const upTxt = R.up < 0 || (S.dur > 0 && R.up === 0) ? "below the limit" : S.dur > 0 ? fDur(R.up) + " of " + fDur(S.dur) : "yes";
  rows($("rObsR"), [
    ["Above the limit", upTxt, "The part of the observation with the source above the elevation limit. Hour angles with the source below the limit give no samples."],
    ["Elevation at transit", R.transit > 0 ? Math.round(R.transit) + "°" : "never rises", "The source's elevation at the meridian: 90° − |latitude − declination|. The array is at latitude " + fDeg(a.lat) + "."],
    ["Primary beam", fAng(R.pb * RAD, 3), `The field of view: the half-power width of one dish's beam on the sky (${a.pbSource}). Sources far outside the primary beam are not seen.`],
  ]);
  const L5 = RI.pctile(R.L, 5), las = L5 > 0 ? 0.983 * R.lam / L5 * RAD : NaN;
  const bm = R.beam;
  rows($("rImgR"), [
    ["Beam", bm ? fAng(bm.maj * RAD, 3) + " × " + fAng(bm.min * RAD, 3) + ", PA " + Math.round(bm.pa) + "°" : R.S && R.S.n ? "–" : "no samples", "The synthesized beam, the resolution: the FWHM of an elliptical Gaussian fitted to the synthesized beam's main lobe (major × minor axis), and the position angle of the major axis, east of north."],
    ["Peak sidelobe", R.side !== undefined && R.side !== null ? (R.side >= 0 ? "+" : "−") + Math.round(Math.abs(R.side) * 100) + "%" : "–", "The largest sidelobe of the synthesized beam beyond the main lobe (within about ten beams of the center), relative to the peak: negative sidelobes are the dark rings and troughs."],
    ["Largest scale", isFinite(las) ? "≈ " + fAng(las, 2) : "–", "The largest recoverable scale, about the largest structure the array images well: 0.983 λ / L5, with L5 the shortest 5% of the baselines (ALMA's definition). A smooth source much larger than this scale is resolved out: the source's flux goes missing."],
  ]);
}

// ------------------------------------------------------------------ the array panel
const alview = { s: 1, ox: 0, oy: 0, fit: true };
let hoverAnt = -1;
function antScreen(ants) {
  const X = e => alview.ox + e * alview.s, Y = n => alview.oy - n * alview.s;
  return ants.map(p => [X(p.e), Y(p.n)]);
}
function drawArray(R) {
  const cv = $("cvA"), { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(w > 0 && h > 0)) return;
  const ants = R.ants, a = R.a;
  if (a.single) { drawDish(g, w, h, a); return; }
  if (alview.fit) {
    let e0 = Infinity, e1 = -Infinity, n0 = Infinity, n1 = -Infinity;
    for (const p of ants) { e0 = Math.min(e0, p.e); e1 = Math.max(e1, p.e); n0 = Math.min(n0, p.n); n1 = Math.max(n1, p.n); }
    const top = 30, bot = 56, side = 30, dx = Math.max(e1 - e0, a.dish * 4), dy = Math.max(n1 - n0, a.dish * 4);
    alview.s = Math.min((w - 2 * side) / dx, (h - top - bot) / dy);
    alview.ox = side + (w - 2 * side - dx * alview.s) / 2 - (e0 - (dx - (e1 - e0)) / 2) * alview.s;
    alview.oy = top + (h - top - bot - dy * alview.s) / 2 + (n1 + (dy - (n1 - n0)) / 2) * alview.s;
    alview.fit = false;
  }
  const xy = antScreen(ants), rr = Math.max(ants.length > 2000 ? 1.2 : ants.length > 500 ? 1.8 : 2.6, a.dish / 2 * alview.s);
  ants.forEach((p, k) => {
    const [x, y] = xy[k];
    g.beginPath(); g.arc(x, y, k === hoverAnt ? rr + 1.5 : rr, 0, 2 * Math.PI);
    if (p.on) { g.fillStyle = C_UV; g.fill(); } else { g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#a9a39a"; g.lineWidth = 1.2; g.stroke(); }
  });
  if (hoverAnt >= 0 && hoverAnt < ants.length) {
    const p = ants[hoverAnt], [x, y] = xy[hoverAnt];
    g.font = `12.5px ${FONT}`; g.textAlign = x > w - 160 ? "right" : "left"; g.fillStyle = "#4f4a44";
    g.fillText((p.name ? p.name + ": " : "") + (p.on ? "" : "off, ") + fLen(Math.abs(p.e)) + (p.e >= 0 ? " east, " : " west, ") + fLen(Math.abs(p.n)) + (p.n >= 0 ? " north" : " south"), x + (x > w - 160 ? -10 : 10), y - 10);
  }
  // the compass, top right
  g.strokeStyle = "#6a6560"; g.fillStyle = "#6a6560"; g.lineWidth = 1.3; g.font = `12px ${FONT}`;
  { const x0 = w - 34, y0 = 52;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0, y0 - 24); g.moveTo(x0, y0); g.lineTo(x0 + 24, y0); g.stroke();
    g.textAlign = "center"; g.fillText("N", x0, y0 - 29); g.textAlign = "left"; g.fillText("E", x0 + 28, y0 + 4); }
  // the scale bar, lower left: a round length near a fifth of the panel
  { const tm = w * 0.2 / alview.s, len = r125(tm), px = len * alview.s, x0 = 26, y0 = h - 22;
    g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + px, y0); g.stroke();
    g.beginPath(); g.moveTo(x0, y0 - 4); g.lineTo(x0, y0 + 4); g.moveTo(x0 + px, y0 - 4); g.lineTo(x0 + px, y0 + 4); g.stroke();
    g.fillStyle = "#4f4a44"; g.textAlign = "center"; g.font = `12.5px ${FONT}`; g.fillText(fLen(len), x0 + px / 2, y0 - 8);
    document.documentElement.style.setProperty("--capLA", Math.round(x0 + px + 22) + "px"); }
  const lname = (LAYS.find(q => q[0] === S.lay) || LAYS[0])[1];
  $("alSub").textContent = (S.lay !== "built" ? lname + " layout. " : a.configs.length > 1 ? cfgOf().name + " configuration. " : "") + "Click an antenna to switch off or on; drag to move.";
}
// a single dish, from above: the reflector (gray) and the illuminated aperture (blue), to scale
function drawDish(g, w, h, a) {
  const sd = a.single, D = a.dish;
  if (alview.fit) { alview.s = Math.min(w - 60, h - 110) / (1.15 * D); alview.ox = w / 2; alview.oy = (h - 30) / 2; alview.fit = false; }
  const X = e => alview.ox + e * alview.s, Y = n => alview.oy - n * alview.s;
  g.fillStyle = "#f1ede5"; g.strokeStyle = "#a9a39a"; g.lineWidth = 1.2;
  g.beginPath(); g.arc(X(0), Y(0), D / 2 * alview.s, 0, 2 * Math.PI); g.fill(); g.stroke();
  g.fillStyle = "rgba(47,106,158,.55)"; g.strokeStyle = C_UV;
  g.beginPath(); g.ellipse(X(sd.x0 || 0), Y(sd.y0 || 0), sd.ew / 2 * alview.s, sd.ns / 2 * alview.s, 0, 0, 2 * Math.PI); g.fill(); g.stroke();
  g.font = `12.5px ${FONT}`; g.fillStyle = "#4f4a44"; g.textAlign = "left";
  g.fillText("reflector, Ø " + sig(D, 3) + " m", X(D / 2 * 0.72) + 6, Y(D / 2 * 0.72) - 6);
  g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText("illuminated, " + sig(sd.ew, 3) + " × " + sig(sd.ns, 3) + " m", X(0), Y(0) + 4);
  g.strokeStyle = "#6a6560"; g.fillStyle = "#6a6560"; g.lineWidth = 1.3; g.font = `12px ${FONT}`;
  { const x0 = w - 34, y0 = 52; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0, y0 - 24); g.moveTo(x0, y0); g.lineTo(x0 + 24, y0); g.stroke(); g.textAlign = "center"; g.fillText("N", x0, y0 - 29); g.textAlign = "left"; g.fillText("E", x0 + 28, y0 + 4); }
  { const len = r125(w * 0.2 / alview.s), px = len * alview.s, x0 = 26, y0 = h - 22;
    g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + px, y0); g.stroke();
    g.beginPath(); g.moveTo(x0, y0 - 4); g.lineTo(x0, y0 + 4); g.moveTo(x0 + px, y0 - 4); g.lineTo(x0 + px, y0 + 4); g.stroke();
    g.fillStyle = "#4f4a44"; g.textAlign = "center"; g.font = `12.5px ${FONT}`; g.fillText(fLen(len), x0 + px / 2, y0 - 8);
    document.documentElement.style.setProperty("--capLA", Math.round(x0 + px + 22) + "px"); }
  $("alSub").textContent = a.caption || "A single dish: one filled aperture in place of many antennas.";
}
{
  const cv = $("cvA");
  let drag = null;
  const pick = ev => {
    if (!cur || cur.single) return -1;
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, xy = antScreen(cur.ants), rr = Math.max(7, cur.a.dish / 2 * alview.s + 3);
    let best = -1, bd = rr;
    xy.forEach(([x, y], k) => { const d = Math.hypot(x - mx, y - my); if (d < bd) { bd = d; best = k; } });
    return best;
  };
  cv.addEventListener("wheel", ev => {
    if (!cur) return;
    ev.preventDefault();
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, f = Math.exp(-ev.deltaY * 0.0022);
    alview.ox = mx - (mx - alview.ox) * f; alview.oy = my - (my - alview.oy) * f; alview.s *= f;
    drawArray(cur);
  }, { passive: false });
  cv.addEventListener("mousedown", ev => {
    const k = pick(ev);
    drag = { x: ev.clientX, y: ev.clientY, ox: alview.ox, oy: alview.oy, k, moved: false };
    cv.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", ev => {
    if (!drag) {
      if (ev.target !== cv) return;
      const k = pick(ev);
      if (k !== hoverAnt) { hoverAnt = k; if (cur) drawArray(cur); }
      cv.style.cursor = k >= 0 ? "pointer" : "";
      return;
    }
    if (!cur) return;
    const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    if (drag.k >= 0) {
      // move the antenna: its new place on the ground
      stopPlay();
      const r = cv.getBoundingClientRect(), e = (ev.clientX - r.left - alview.ox) / alview.s, n = (alview.oy - (ev.clientY - r.top)) / alview.s;
      S.mv[drag.k] = [+e.toFixed(1), +n.toFixed(1)];
      quick(); H.schedule();
    } else { alview.ox = drag.ox + dx; alview.oy = drag.oy + dy; drawArray(cur); }
  });
  window.addEventListener("mouseup", () => {
    if (!drag) return;
    if (!drag.moved && drag.k >= 0) {
      // a click: switch the antenna off or on
      stopPlay();
      const i = S.off.indexOf(drag.k);
      if (i >= 0) S.off.splice(i, 1); else S.off.push(drag.k);
      S.off.sort((x, y) => x - y);
      H.schedule();
    }
    if (drag.moved && drag.k >= 0) H.scheduleHash();
    drag = null; cv.style.cursor = "";
  });
  cv.addEventListener("mouseleave", () => { if (hoverAnt >= 0) { hoverAnt = -1; if (cur) drawArray(cur); } });
  cv.addEventListener("dblclick", () => { alview.fit = true; if (cur) drawArray(cur); });
  $("alReset").addEventListener("click", () => { alview.fit = true; if (cur) drawArray(cur); });
  $("rRestore").addEventListener("click", () => { stopPlay(); S.off = []; S.mv = {}; H.schedule(); });
}

// ------------------------------------------------------------------ the uv plane and the images
const RAMP = [[0, 0, 0], [70, 22, 16], [166, 58, 36], [230, 140, 60], [250, 214, 150], [255, 250, 238]];
const BLUE = [[0, 0, 0], [14, 34, 70], [30, 78, 140], [84, 140, 205], [170, 205, 238], [236, 244, 252]];
const at = (P, v) => { const u = Math.max(0, Math.min(1, v)) * (P.length - 1), k = Math.min(P.length - 2, Math.floor(u)), f = u - k; return [0, 1, 2].map(i => P[k][i] + (P[k + 1][i] - P[k][i]) * f); };
// positive values warm (black, brick, orange, cream), negative cool (black to blue), on a linear scale; or the size
// |v| over three decades, the sign kept in the color
const shade = v => (v >= 0 ? at(RAMP, v) : at(BLUE, -v));
const shadeLog = v => { const t = (Math.log10(Math.max(Math.abs(v), 1e-12)) + 3) / 3; return v >= 0 ? at(RAMP, t) : at(BLUE, t); };
// a unit for wavelengths on the uv axes
const uvUnit = x => (x >= 1e9 ? [1e9, "Gλ"] : x >= 1e6 ? [1e6, "Mλ"] : x >= 1e3 ? [1e3, "kλ"] : [1, "λ"]);
let geom = null;
function drawPanel(R) {
  const cv = $("cvU"), { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(cv.width > 0 && cv.height > 0)) return;
  const dpr = window.devicePixelRatio || 1, cw = w / 2, ch = h / 2, head = 32, foot = 30;
  const side = Math.max(40, Math.floor(Math.min(cw - 28, ch - head - foot)));
  const X = k => Math.round(k * cw + (cw - side) / 2), Y = r => Math.round(r * ch + head + (ch - head - foot - side) / 2);
  // each square's title, centered above the square
  const label = (x, y, t) => { g.textAlign = "center"; g.fillStyle = "#4f4a44"; g.font = `15px ${FONT}`; g.fillText(t, x + side / 2, y - 10); };
  const bar = (x, y, perPx, text) => {
    const tm = side * 0.3 * perPx, len = niceAng(tm), yb = y + side + 16;
    g.strokeStyle = "#4f4a44"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, yb); g.lineTo(x + len / perPx, yb); g.stroke();
    g.fillStyle = "#4f4a44"; g.font = `12.5px ${FONT}`; g.textAlign = "left"; g.fillText(text(len), x + len / perPx + 8, yb + 4);
  };
  const empty = (x, y, txt) => { g.fillStyle = "#f1ede5"; g.fillRect(x, y, side, side); g.fillStyle = MUTED; g.font = `12.5px ${FONT}`; g.textAlign = "center"; g.fillText(txt, x + side / 2, y + side / 2); };
  if (!R.nb && !R.single) { for (let k = 0; k < 4; k++) empty(X(k % 2), Y(k >> 1), "fewer than two antennas"); return; }
  const Sm = R.S, none = !Sm || !Sm.n;
  // ---- top left: the uv coverage, or the visibility amplitude against uv distance: a square plot (u and v at one
  // scale), the tick labels to its left and below, the Coverage | Amplitude switch under it
  const ul = 40, ps = side - ul, x0 = X(0) + ul, y0 = Y(0), [U, un] = uvUnit(R.ext * 1.05);
  if (S.uvv === "uv") label(X(0) + ul / 2, Y(0), play && !R.single ? "uv coverage, hour angle " + (play.h >= 0 ? "+" : "−") + Math.abs(play.h).toFixed(1) + " h" : "uv coverage");
  else label(X(0) + ul / 2, Y(0), "Visibility amplitude");
  const ext = R.ext * 1.05, ppx = Math.round(ps * dpr), plotH = ps;
  g.fillStyle = "#fff"; g.fillRect(x0, y0, ps, ps);
  const box = $("uvBox"), cvr = cv.getBoundingClientRect(), pr = cv.parentElement.getBoundingClientRect();
  box.style.left = Math.round(cvr.left - pr.left + x0 + ps / 2 - box.offsetWidth / 2) + "px"; box.style.top = Math.round(cvr.top - pr.top + y0 + ps + 30) + "px";
  if (none) empty(x0, y0, R.single ? "the source is out of reach" : R.up < 0 || (S.dur > 0 && R.up === 0) ? "the source is below the limit" : "no samples");
  else if (S.uvv === "uv") {
    // the samples, rasterized at the screen's resolution (a canvas call per sample would be slow)
    const W = ppx, Hh = ppx, oc = document.createElement("canvas"); oc.width = W; oc.height = Hh;
    const og = oc.getContext("2d"), id = og.createImageData(W, Hh), d = id.data;
    const sx = W / (2 * ext), sy = Hh / (2 * ext);
    const dot = (u, v, c, r) => {
      const px = Math.round(W / 2 + u * sx), py = Math.round(Hh / 2 - v * sy);
      for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) {
        const x = px + a, y = py + b; if (x < 0 || y < 0 || x >= W || y >= Hh) continue;
        const k = 4 * (y * W + x); d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
    };
    const stride = Math.max(1, Math.floor(Sm.n / 1.2e6)), r0 = dpr > 1.5 ? 1 : 0;
    const cU = [47, 106, 158], cM = [157, 188, 217], cN = [194, 98, 29];
    if (Sm.w0) {
      // a single dish: the lattice of spacings, shaded by the aperture's autocorrelation (both halves alike)
      const sp = W / (2 * ext) * (Math.max(R.a.single.ew, R.a.single.ns) / R.lam) / 72, rr = Math.max(0, Math.ceil(sp / 2));
      for (let k = 0; k < Sm.n; k++) { const t = Sm.w0[k], c = [0, 1, 2].map(i => Math.round(cM[i] + (cU[i] - cM[i]) * Math.min(1, t))); dot(Sm.u[k], Sm.v[k], c, rr); dot(-Sm.u[k], -Sm.v[k], c, rr); }
    } else {
      for (let k = 0; k < Sm.n; k += stride) dot(-Sm.u[k], -Sm.v[k], cM, r0);
      for (let k = 0; k < Sm.n; k += stride) dot(Sm.u[k], Sm.v[k], cU, r0);
    }
    if (play && Sm.n) { const m = R.full.nb * R.full.nCh; for (let k = Math.max(0, Sm.n - m); k < Sm.n; k++) { dot(Sm.u[k], Sm.v[k], cN, r0 + 1); dot(-Sm.u[k], -Sm.v[k], cN, r0 + 1); } }
    og.putImageData(id, 0, 0);
    g.drawImage(oc, x0, y0, ps, ps);
  } else {
    // amplitude against uv distance: the model's curve (when the model is round) and the samples on it
    const W = ppx, Hh = ppx, oc = document.createElement("canvas"); oc.width = W; oc.height = Hh;
    const og = oc.getContext("2d"), id = og.createImageData(W, Hh), d = id.data;
    const stride = Math.max(1, Math.floor(Sm.n / 4e5)), isImg = !!imgOf(S.sky), Vg = vcache.V, n0 = R.n, du0 = 1 / (2 * R.F), V0 = Vg.re[0] || 1;
    // an image's visibility: the sky's transform on the image grid, at the sample's cell
    const ampAt = (u, v) => { if (!isImg) return Math.abs(RI.vis(S.sky, S.size / RAD, u, v)); const p = Math.round(u / du0), q = Math.round(v / du0); if (Math.abs(p) >= n0 / 2 || Math.abs(q) >= n0 / 2) return NaN; const c = ((q + n0) % n0) * n0 + (p + n0) % n0; return Math.hypot(Vg.re[c], Vg.im[c]) / V0; };
    for (let k = 0; k < Sm.n; k += stride) {
      const q = Math.hypot(Sm.u[k], Sm.v[k]), A = ampAt(Sm.u[k], Sm.v[k]);
      if (!isFinite(A)) continue;
      const x = Math.round(q / ext * (W - 1)), y = Math.round((1 - A / 1.08) * (Hh - 1));
      if (x < 0 || y < 0 || x >= W || y >= Hh) continue;
      const kk = 4 * (y * W + x); d[kk] = 47; d[kk + 1] = 106; d[kk + 2] = 158; d[kk + 3] = 255;
    }
    og.putImageData(id, 0, 0);
    g.drawImage(oc, x0, y0, ps, ps);
    if (S.sky !== "double" && !isImg) {
      g.strokeStyle = "#4f4a44"; g.lineWidth = 1.1; g.beginPath();
      for (let q = 0; q <= 400; q++) { const uq = ext * q / 400, A = Math.abs(RI.vis(S.sky, S.size / RAD, uq, 0)), x = x0 + uq / ext * ps, y = y0 + (1 - A / 1.08) * plotH; q ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
  }
  // axes and ticks
  g.strokeStyle = "#8a847b"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, ps - 1, ps - 1);
  g.fillStyle = MUTED; g.font = `11px ${FONT}`;
  const tick = r125(ext / U / 2) * U, tl = t => String(+(t / U).toPrecision(3)).replace("-", "−");
  if (S.uvv === "uv") {
    for (let t = -Math.floor(ext / tick) * tick; t <= ext + 1e-9; t += tick) {
      const x = x0 + (t / ext + 1) / 2 * ps, y = y0 + (1 - t / ext) / 2 * ps;
      g.textAlign = "center"; g.fillText(tl(t), x, y0 + ps + 13);
      g.textAlign = "right"; g.fillText(tl(t), x0 - 4, y + 4);
      g.strokeStyle = "rgba(138,132,123,.6)"; g.beginPath(); g.moveTo(x, y0 + ps); g.lineTo(x, y0 + ps - 4); g.moveTo(x0, y); g.lineTo(x0 + 4, y); g.stroke();
    }
    g.textAlign = "center"; g.fillText("u (" + un + "), east", x0 + ps / 2, y0 + ps + 25);
    g.save(); g.translate(x0 - 30, y0 + ps / 2); g.rotate(-Math.PI / 2); g.fillText("v (" + un + "), north", 0, 0); g.restore();
  } else {
    for (let t = 0; t <= ext + 1e-9; t += tick) { const x = x0 + t / ext * ps; g.textAlign = "center"; g.fillText(tl(t), x, y0 + ps + 13); }
    for (const v of [0, 0.5, 1]) { const y = y0 + (1 - v / 1.08) * ps; g.textAlign = "right"; g.fillText(String(v), x0 - 4, y + 4); g.strokeStyle = "rgba(138,132,123,.35)"; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + ps, y); g.stroke(); }
    g.textAlign = "center"; g.fillText("uv distance (" + un + ")", x0 + ps / 2, y0 + ps + 25);
    g.save(); g.translate(x0 - 30, y0 + ps / 2); g.rotate(-Math.PI / 2); g.fillText("amplitude / flux", 0, 0); g.restore();
  }
  // ---- the images: the field's center (half the grid) into a square, east to the left and north up
  const n = R.n, m = n / 2;
  const blit = (img, x, y, scale, sh = shade) => {
    const oc = document.createElement("canvas"); oc.width = m; oc.height = m;
    const og = oc.getContext("2d"), id = og.createImageData(m, m);
    for (let r = 0; r < m; r++) for (let c = 0; c < m; c++) {
      const i = m / 2 - c, j = m / 2 - r, col = sh(img[((j + n) % n) * n + ((i + n) % n)] * scale), k = 4 * (r * m + c);
      id.data[k] = col[0]; id.data[k + 1] = col[1]; id.data[k + 2] = col[2]; id.data[k + 3] = 255;
    }
    og.putImageData(id, 0, 0);
    g.imageSmoothingEnabled = true; g.drawImage(oc, x, y, side, side);
  };
  const toPx = side / (R.F * RAD);                                   // screen pixels per arcsec (the square shows the field)
  geom = { side, toPx, field: S.field };
  // ---- top right: the synthesized beam
  if (none) empty(X(1), Y(0), "no samples");
  else blit(R.D.beam, X(1), Y(0), 1, S.bstr === "log" ? shadeLog : shade);
  { const box = $("bsBox"), cvr = cv.getBoundingClientRect(), pr = cv.parentElement.getBoundingClientRect();
    box.style.left = Math.round(cvr.left - pr.left + X(1) + side - box.offsetWidth) + "px"; box.style.top = Math.round(cvr.top - pr.top + Y(0) + side + 4) + "px"; }
  label(X(1), Y(0), R.single ? "Beam" : "Synthesized beam");
  bar(X(1), Y(0), 1 / toPx, a => fAng(a, 2));
  // ---- bottom left: the sky
  {
    let mx = 0; for (let k = 0; k < n * n; k++) mx = Math.max(mx, R.sky[k]);
    const pts = S.sky === "point" ? [[0, 0]] : S.sky === "double" ? [[-S.size / 2, 0], [S.size / 2, 0]] : S.size * toPx < 2.5 ? [[0, 0]] : [];
    if (pts.length) { g.fillStyle = "#000"; g.fillRect(X(0), Y(1), side, side); } else blit(R.sky, X(0), Y(1), mx > 0 ? 1 / mx : 0);
    g.save(); g.beginPath(); g.rect(X(0), Y(1), side, side); g.clip();
    g.fillStyle = "rgb(255,250,238)";
    for (const [l, mm] of pts) { g.beginPath(); g.arc(X(0) + side / 2 - l * toPx, Y(1) + side / 2 - mm * toPx, 3, 0, 2 * Math.PI); g.fill(); }
    // the primary beam's half-power circle
    const rp = R.pb * RAD / 2 * toPx;
    if (R.pb > 0 && rp < side * 0.7) { g.strokeStyle = "rgba(220,214,204,.85)"; g.setLineDash([5, 4]); g.lineWidth = 1.2; g.beginPath(); g.arc(X(0) + side / 2, Y(1) + side / 2, rp, 0, 2 * Math.PI); g.stroke(); g.setLineDash([]); }
    // the compass: north up, east to the left (the sky seen from below)
    g.strokeStyle = "rgba(220,214,204,.9)"; g.fillStyle = "rgba(220,214,204,.9)"; g.lineWidth = 1.2; g.font = `11px ${FONT}`;
    const cx = X(0) + side - 14, cy = Y(1) + 34;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - 18); g.moveTo(cx, cy); g.lineTo(cx - 18, cy); g.stroke();
    g.textAlign = "center"; g.fillText("N", cx, cy - 22); g.textAlign = "right"; g.fillText("E", cx - 22, cy + 4);
    g.restore();
  }
  const simg = imgOf(S.sky);
  label(X(0), Y(1), "Input image");
  // the image's credit, on the image (light on the dark sky, lower right)
  if (simg) { g.fillStyle = "rgba(220,214,204,.92)"; g.font = `10.5px ${FONT}`; g.textAlign = "right"; g.fillText(simg.credit, X(0) + side - 6, Y(1) + side - 7); }
  if (R.loading) { g.fillStyle = "rgba(220,214,204,.9)"; g.font = `12.5px ${FONT}`; g.textAlign = "center"; g.fillText("reading the image…", X(0) + side / 2, Y(1) + side / 2); }
  bar(X(0), Y(1), 1 / toPx, a => fAng(a, 2));
  // ---- bottom right: the dirty image, with the fitted beam at its lower left
  if (none) empty(X(1), Y(1), "no samples");
  else {
    let mx = 0; for (let k = 0; k < n * n; k++) mx = Math.max(mx, R.D.img[k]);
    blit(R.D.img, X(1), Y(1), mx > 0 ? 1 / mx : 0);
    const bm = R.beam;
    if (bm && bm.maj * RAD * toPx >= 3) {
      const ax = bm.maj * RAD * toPx / 2, bx = bm.min * RAD * toPx / 2, cx = X(1) + 10 + Math.max(ax, 6), cy = Y(1) + side - 10 - Math.max(ax, 6);
      if (ax < side / 4) { g.strokeStyle = "rgba(255,250,238,.95)"; g.lineWidth = 1.3; g.beginPath(); g.ellipse(cx, cy, ax, bx, Math.atan2(-Math.cos(bm.pa * DEG), -Math.sin(bm.pa * DEG)), 0, 2 * Math.PI); g.stroke(); }
    }
  }
  label(X(1), Y(1), R.single ? "Map" : "Dirty image");
  bar(X(1), Y(1), 1 / toPx, a => fAng(a, 2));
}

// ------------------------------------------------------------------ playing the observation
// The hour angle runs from the start of the observation to its end in six seconds, the uv tracks growing as the
// Earth turns; any change stops it.
let play = null;
const PLAY_MS = 6000;
function stopPlay() { if (play) { play = null; cancelAnimationFrame(playRAF); } }
let playRAF = 0;
function tick() {
  if (!play) return;
  const f = Math.min(1, (performance.now() - play.t0) / PLAY_MS);
  play.h = -S.dur / 2 + S.dur * f;
  draw(true);
  if (f >= 1) { play = null; draw(false); return; }
  playRAF = requestAnimationFrame(tick);
}
$("rPlay").addEventListener("click", () => {
  if (play) { stopPlay(); H.schedule(); return; }
  if (!(S.dur > 0)) return;
  play = { t0: performance.now(), h: -S.dur / 2 };
  tick();
});

// ------------------------------------------------------------------ main
let cur = null;
function draw(fast) {
  syncControls();
  cur = compute(fast);
  renderText(cur);
  // (the image grid follows the panel's size: computed again if fitting the panels to the window changed it)
  if (H.fitPanels()) { cur = compute(fast); renderText(cur); }
  drawArray(cur);
  drawPanel(cur);
}
function render() {
  if (!ARRS.length) return;
  if (play) return;                                                  // the animation draws its own frames
  draw(performance.now() < quickUntil);
}
const PRESETS = ARRS.map(a => ({ id: a.id, tel: a.name, name: a.name, state: { D: a.dish } }));
const POS = new Set(["size", "field"]);
return {
  render, PRESETS,
  presetId: () => S.arr,
  applyPreset: p => { stopPlay(); S = defaultsFor(arrById(p.id)); alview.fit = true; H.schedule(); },
  reset: () => { stopPlay(); S = defaultsFor(arrOf()); alview.fit = true; H.schedule(); },
  hashParts: () => {
    const D = defaultsFor(arrOf()), out = ["r.arr=" + encodeURIComponent(S.arr)];
    for (const k of ["cfg", "lay", "na", "ext", "seed", "conc", "dec", "dur", "el", "band", "nu", "bw", "wt", "rob", "sky", "size", "field", "uvv", "bstr"]) if (S[k] !== D[k] && S[k] !== null) out.push("r." + k + "=" + encodeURIComponent(S[k]));
    if (S.off.length) out.push("r.off=" + S.off.join("."));
    const mv = Object.keys(S.mv); if (mv.length) out.push("r.mv=" + mv.map(k => k + ":" + S.mv[k][0] + ":" + S.mv[k][1]).join("_"));
    return out;
  },
  readHash: kv => {
    const a = ARRS.find(q => q.id === kv["r.arr"]) || arrOf();
    S = defaultsFor(a);
    const c = a.configs.find(q => q.id === kv["r.cfg"]); if (c) S.cfg = c.id;
    const b = a.bands.find(q => q.k === kv["r.band"]); if (b) S.band = b.k;
    const num = (k, lo, hi) => { const v = kv["r." + k]; if (v === undefined || v === "") return; const x = Number(v); if (isFinite(x) && x >= lo && x <= hi && (!POS.has(k) || x > 0)) S[k] = x; };
    if (LAYS.some(q => q[0] === kv["r.lay"])) S.lay = kv["r.lay"];
    if (kv["r.na"] && Number.isInteger(+kv["r.na"]) && +kv["r.na"] >= 2 && +kv["r.na"] <= 10000) S.na = +kv["r.na"];
    if (kv["r.seed"] && Number.isInteger(+kv["r.seed"]) && +kv["r.seed"] >= 1) S.seed = +kv["r.seed"];
    num("ext", 1, 3e5); num("conc", 1, 2);
    num("dec", -90, 90); num("dur", 0, 24); num("el", 0, 90); num("nu", 0, 2000); num("bw", 0, 100); num("rob", -2, 2); num("size", 1e-4, 1e5); num("field", 1e-3, 1e5);
    if (["natural", "robust", "uniform"].includes(kv["r.wt"])) S.wt = kv["r.wt"];
    if (SKIES.some(q => q[0] === kv["r.sky"])) S.sky = kv["r.sky"];
    if (kv["r.uvv"] === "amp" || kv["r.uvv"] === "uv") S.uvv = kv["r.uvv"];
    if (kv["r.bstr"] === "lin" || kv["r.bstr"] === "log") S.bstr = kv["r.bstr"];
    const N = pads().ants.length;
    if (kv["r.off"]) S.off = [...new Set(kv["r.off"].split(".").map(Number).filter(k => Number.isInteger(k) && k >= 0 && k < N))].sort((x, y) => x - y);
    if (kv["r.mv"]) for (const t of kv["r.mv"].split("_")) { const [k, e, n] = t.split(":").map(Number); if (Number.isInteger(k) && k >= 0 && k < N && isFinite(e) && isFinite(n)) S.mv[k] = [e, n]; }
    alview.fit = true;
  },
  redraw: () => { if (cur) { drawArray(cur); drawPanel(cur); } },
  test: { state: () => clone(S), result: () => cur && { nb: cur.nb, n: cur.S && cur.S.n, beam: cur.beam && { ...cur.beam }, side: cur.side, pb: cur.pb, drop: cur.drop, up: cur.up, ext: cur.ext, Bmax: cur.Bmax, Bmin: cur.Bmin, cell: cur.cell, step: cur.step, nCh: cur.nCh, gridN: cur.n, loading: !!cur.loading, imgLevel: cur.imgLevel }, geom: () => geom && { ...geom }, set: o => { stopPlay(); Object.assign(S, o); draw(false); H.scheduleHash(); }, playing: () => !!play,
    antXY: k => { const xy = antScreen(cur.ants)[k], r = $("cvA").getBoundingClientRect(); return [r.left + xy[0], r.top + xy[1]]; } },
};
};
})();
