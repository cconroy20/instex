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
const SKIES = [["point", "Point"], ["double", "Two points"], ["gaussian", "Gaussian"], ["disc", "Uniform disc"], ["ring", "Ring"], ["crescent", "Crescent (like M87*)"], ["m87", "M87* with its jet"], ["corejet", "Core and jet"], ["points", "Point sources"]].concat(IMGS.map(q => [q.k, q.name]));
const SIZE_LABEL = { point: "Size", double: "Separation", gaussian: "FWHM", disc: "Diameter", ring: "Diameter", crescent: "Diameter", m87: "Ring diameter", corejet: "Jet length", points: "Spread", m101: "Width" };
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
const MAXPAIRS = 1e5, MINPAIRS = 2e4;                                // baselines drawn at random beyond MAXPAIRS
const C_UV = "#2f6a9e", C_MIR = "#9dbcd9", C_NOW = "#c2621d";        // samples, mirror points, the moment played

// ------------------------------------------------------------------ formats
const fLen = m => (m >= 1000 ? sig(m / 1000, 3) + " km" : sig(m, 3) + " m");
const fLam = (m, d = 3) => (m >= 1 ? sig(m, d) + " m" : m >= 0.01 ? sig(m * 100, d) + " cm" : m >= 1e-3 ? sig(m * 1000, d) + " mm" : sig(m * 1e6, d) + " µm");
const fNu = (g, d = 4) => (g >= 1 ? sig(g, d) + " GHz" : sig(g * 1000, d) + " MHz");
// two angles (arcsec) in the unit the first is shown in
const fAng2 = (a, b, n = 3) => { const u = a >= 3600 * 0.995 ? [3600, "°"] : a >= 60 * 0.995 ? [60, "′"] : a >= 0.1 ? [1, "″"] : a >= 1e-3 * 0.995 ? [0.001, " mas"] : [1e-6, " µas"]; return sig(a / u[0], n) + (u[1][0] === " " ? "" : u[1]) + " × " + sig(b / u[0], n) + u[1]; };
const fDish = d => String(+d.toPrecision(4));
const fDur = h => (h < 1 ? Math.round(h * 60) + " min" : sig(h, 3) + " h");
const fDeg = d => (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d).toFixed(1) + "°";
const fLon = d => Math.abs(d).toFixed(1) + "° " + (d >= 0 ? "E" : "W");
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
  return { arr: a.id, cfg: c.id, lay: "built", na: c.ants.length, ext: +c.bmax.toPrecision(2), seed: 1, conc: 1, dec: d.dec, dur: d.dur, el: null, band: b.k, nu: d.nu, bw: d.bw || 0, wt: d.wt || "natural", rob: 0.5,
    sky: d.sky || "double", size: d.size || niceAng(5 * est), field: d.field || niceAng(25 * est), uvv: "uv", bstr: "lin", dimg: "dirty", off: [], mv: {} };
}
let S = ARRS.length ? defaultsFor(ARRS[0]) : {};
const arrOf = () => arrById(S.arr);
const cfgOf = () => { const a = arrOf(); return a.configs.find(c => c.id === S.cfg) || a.configs[0]; };
const bandOf = () => { const a = arrOf(); return a.bands.find(b => b.k === S.band) || a.bands[0]; };
const elOf = () => (S.el === null || S.el === undefined ? arrOf().elLimit : S.el);
// the primary beam's FWHM (radians) at nu (GHz): the observatory's relation, in arcmin times GHz (the VLA) or in
// lambda / D (ALMA)
// (a cylinder's beam is elliptical, { ew, ns }: narrow east-west across the reflector, wide north-south along the line
// of feeds; p.ew and p.ns each a relation of their own)
const pbRel = (p, nu, D) => (p.deg ? p.deg * DEG : p.arcminGHz ? ((p.band && p.band[S.band]) || p.arcminGHz) / nu / 60 * DEG : p.k * C / (nu * 1e9) / (p.D || D));
const pbOf = nu => { const a = arrOf(), p = a.pb; return p.ew ? { ew: pbRel(p.ew, nu, a.dish), ns: pbRel(p.ns, nu, a.dish) } : pbRel(p, nu, a.dish); };
const pbEW = pb => (typeof pb === "object" ? pb.ew : pb);
// A transit array (CHIME, CHORD) does not track: the source drifts through the fixed beam, and the observation lasts
// at most the time the source takes to cross the beam's half-power width east-west, theta / (15.04 deg/h cos dec)
// (24 h at most, near the pole). S.dur 24 = the whole crossing.
const transitMax = () => Math.min(24, pbEW(pbOf(S.nu)) / (RI.HA_PER_H * Math.max(1e-6, Math.cos(S.dec * DEG))));
// An array whose tracks end haMax hours of hour angle either side of the transit (the DSA) observes at most 2 haMax
// hours of hour angle, a little less in hours of time.
const durMax = () => { const a = arrOf(); return a.transit ? transitMax() : a.haMax ? 2 * a.haMax * (Math.PI / 12) / RI.HA_PER_H : 24; };
const durNow = () => Math.min(S.dur, durMax());
// the Array panel's first line for a transit array: the telescope does not track, and the time a source spends in the
// beam
const fixedLine = () => { const a = arrOf(); return a.transit ? `${a.fixedWho} do not track: a source is seen only while the sky carries the source through the beam, ${fDur(transitMax())} here. ` : ""; };
// the log10 (arcsec) ranges of the Size and Field sliders: the arrays' own (the EHT reaches microarcseconds, CHIME
// degrees)
const RANGE = { size: [-3, 3.6], field: [-2.5, 4] };
const rangeOf = k => (arrOf().ranges && arrOf().ranges[k]) || RANGE[k];
// the layout's pads: the configuration's, or a made-up layout (cached)
let lcache = { key: null };
function pads() {
  if (S.lay === "built") return { ants: cfgOf().ants, names: cfgOf().names || [] };
  const key = JSON.stringify([S.lay, S.na, S.ext, arrOf().dish, S.seed, S.conc]);
  if (lcache.key !== key) { const ants = RI.layout(S.lay, S.na, S.ext, arrOf().dish, S.seed, S.conc); lcache = { key, ants, names: ants.map((_, k) => "antenna " + (k + 1)) }; }
  return lcache;
}
// the antennas now: the layout's, with the reader's moves and switches; while the antennas are being added, the ones
// not yet added are pending (off, and drawn apart)
// a horizon mask in radians (cached on the mask)
const maskRad = m => m.rad || (m.rad = { az: m.az.map(x => x * DEG), el: m.el.map(x => x * DEG) });
// An Earth-scale array's stations (a.geo): latitude, longitude (degrees) and height (m), and their positions in the
// equatorial frame of the array's reference meridian (cached); each station's group (its site, for the labels), dish,
// SEFD and own elevation limit when the record gives them
const xyzCache = {};
function geoAnts() {
  const a = arrOf(), c = cfgOf(), key = a.id + "|" + c.id;
  if (!xyzCache[key]) xyzCache[key] = c.ants.map(p => RI.geoXYZ(p[0] * DEG, p[1] * DEG, p[2], a.geo.lon0 * DEG));
  return xyzCache[key];
}
function antsNow() {
  const off = new Set(S.off), P = pads(), a = arrOf(), c = cfgOf();
  if (a.geo) {
    // (a station without the band's receiver sits out, drawn apart: the VLBA's 3 mm band at eight of its ten)
    const X = geoAnts(), keep = new Set(c.keep || []), rx = bandOf().stations ? new Set(bandOf().stations) : null;
    const A = c.ants.map((p, k) => { const nm = P.names[k] || "", noRx = !!rx && !rx.has(nm);
      return { lat: p[0], lon: p[1], h: p[2], xyz: X[k], e: 0, n: 0, on: !off.has(k) && !noRx, noRx, name: nm, full: c.full ? c.full[k] : "", group: c.groups ? c.groups[k] : nm, dish: c.dishes ? c.dishes[k] : a.dish, sefd: c.sefd ? c.sefd[k] : 0, elMin: c.elMin ? c.elMin[k] : 0, mask: c.masks ? c.masks[k] : null, keep: keep.has(k) }; });
    if (aplay) { const live = addOrder(A.length).filter(k => A[k].on); live.slice(aplay.k).forEach(k => { A[k].on = false; A[k].pending = true; }); }
    return A;
  }
  const A = P.ants.map((p, k) => { const m = S.mv[k]; return { e: m ? m[0] : p[0], n: m ? m[1] : p[1], u: m ? 0 : p[2] || 0, on: !off.has(k), name: P.names[k] || "" }; });
  if (aplay) { const live = addOrder(A.length).filter(k => A[k].on); live.slice(aplay.k).forEach(k => { A[k].on = false; A[k].pending = true; }); }
  return A;
}
// the order in which the antennas are added: a fixed random shuffle (seeded, so the same each time)
let ocache = { n: -1 };
function addOrder(N) {
  if (ocache.n === N) return ocache.o;
  const rnd = RI.rng(11), o = Array.from({ length: N }, (_, k) => k);
  for (let k = N - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); const t = o[k]; o[k] = o[j]; o[j] = t; }
  ocache = { n: N, o };
  return o;
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
bindSeg([["rdiD", "dirty"], ["rdiS", "smooth"]], () => S.dimg, v => { S.dimg = v; });
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
  S[key] = key === "na" ? Math.round(v) : lg ? +v.toPrecision(key === "ext" ? 2 : 3) : +v.toFixed(key === "nu" || key === "bw" ? 4 : key === "dur" && arrOf().transit ? 4 : 2);
  // (a transit array's slider at its end: the whole crossing, at any frequency or declination set later)
  if (key === "dur" && arrOf().transit && x >= +$(id).max * 0.995) S.dur = 24;
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
  // the tooltips that depend on the array
  $("rElRow").title = a.geo ? "The lowest elevation at which the stations observe, the same for all of them (a station whose own limit is higher keeps its own). A baseline samples only while the source is above the limit at both of its stations, each at its own place on the Earth. The default: " + (a.elNote || "the observatory's limit.")
    : "The lowest elevation at which the antennas observe. Below the limit a source gives no samples, so a low source's tracks are cut short. The default: " + (a.elNote || "the observatory's limit.");
  $("rCfgRow").title = a.configs.length > 1 ? "The array's configuration: the pads the antennas stand on. The antennas are moved between configurations, compact to extended, over the observatory's cycle." + (cfgOf().note ? " " + cfgOf().note : "") : "The array's one configuration." + (a.antNote ? " " + a.antNote : "");
  // (an Earth-scale array's stations and a cylinder's feeds stay where they are built: no made-up layouts)
  const fixed = !!(a.geo || a.cyl);
  if (fixed && S.lay !== "built") S.lay = "built";
  $("rLayRow").hidden = sd || fixed; $("rElRow").hidden = sd || !!a.transit; $("rDurRow").hidden = sd; $("rBwRow").hidden = sd; $("rWtRow").hidden = sd;
  $("rCfgRow").hidden = gen || sd; $("rNaRow").hidden = !gen; $("rExtRow").hidden = !gen; $("rConcRow").hidden = !gen || S.lay === "ring"; $("rRedraw").hidden = S.lay !== "random";
  put("rConc", S.conc, S.conc === 1 ? "even" : S.conc.toFixed(2));
  $("rExt").min = String(Math.log10(Math.max(20, 3 * a.dish)));
  put("rNa", Math.log10(S.na), S.na.toLocaleString("en-US"));
  put("rExt", Math.log10(S.ext), fLen(S.ext));
  put("rDec", S.dec, fDeg(S.dec));
  // (a transit array's slider runs to the whole crossing of the beam, which depends on the frequency and declination)
  $("lrDur").textContent = a.transit ? "Time in the beam" : "Duration";
  { const dIn = $("rDur");
    if (a.transit) { const tm = transitMax(); dIn.max = String(tm); dIn.step = String(tm / 100); }
    else { dIn.max = String(durMax()); dIn.step = "0.1"; }
    const dn = durNow();
    put("rDur", dn, !(dn > 0) ? "snapshot" : a.transit && S.dur >= transitMax() * 0.999 ? "all " + fDur(dn) : fDur(dn));
    $("rDurRow").title = a.transit ? "How long the array observes the source as the source drifts through the beam, centered on the transit. The antennas do not track: the source crosses the beam's half-power width east-west in θ / (15.04° per hour × cos δ), " + fDur(transitMax()) + " here, and the slider runs to that. 0 is a snapshot." + (a.durNote ? " " + a.durNote : "")
      : "How long the array observes, in hours of time, centered on the source's transit (the hour angle runs 15.04° an hour). 0 is a snapshot: one sample per baseline. A longer track fills in the uv plane as the Earth turns (Earth-rotation synthesis)." + (a.geo ? " The transit is the source's transit at longitude " + fLon(a.geo.lon0) + ", near the middle of the array." : "") + (a.durNote ? " " + a.durNote : ""); }
  put("rEl", elOf(), Math.round(elOf() * 10) / 10 + "°" + (a.geo && cfgOf().elMin && elOf() < Math.max(...cfgOf().elMin) ? ", stations' own" : ""));
  put("rNu", S.nu, fNu(S.nu, 3) + " (" + fLam(C / (S.nu * 1e9), 2) + ")");
  put("rBw", S.bw, S.bw > 0 ? fNu(S.bw) : "one frequency");
  put("rRob", S.rob, (S.rob > 0 ? "+" : S.rob < 0 ? "−" : "") + Math.abs(S.rob).toFixed(1));
  for (const [id, k] of [["rSize", "size"], ["rField", "field"]]) { const r = rangeOf(k); $(id).min = String(r[0]); $(id).max = String(r[1]); }
  put("rSize", Math.log10(S.size), fAng(S.size));
  put("rField", Math.log10(S.field), fAng(S.field));
  $("lrSize").textContent = SIZE_LABEL[S.sky];
  $("rSizeRow").hidden = S.sky === "point";
  $("rRobRow").hidden = S.wt !== "robust" || sd;
  $("rRestore").hidden = !modified();
  $("rPlay").textContent = play ? "■ Stop" : arrOf().transit ? "▶ Transit" : "▶ Hours";
  $("rPlay").disabled = !(durNow() > 0) || sd;
  $("rPlayA").textContent = aplay ? "■ Stop" : "▶ Antennas";
  $("rPlayA").disabled = sd || onCount() < 3;
  segs.forEach(g => g());
}

// ------------------------------------------------------------------ the computation
// While a slider moves, a coarser image grid keeps the page responsive; the full grid follows when it stops.
let quickUntil = 0, refineTimer = 0;
function quick() { quickUntil = performance.now() + 250; clearTimeout(refineTimer); refineTimer = setTimeout(() => H.schedule(), 280); }
let vcache = { key: null }, tcache = { key: null }, pcache = { key: null }, v0cache = { key: null }, ecache = { key: null }, scache = { key: null };
function compute(fast) {
  const a = arrOf(), ants = antsNow(), lat = a.lat * DEG, dec = S.dec * DEG, elMin = elOf() * DEG, dur = durNow();
  // the band observed, kept within the receiver's band
  const bnd = bandOf(), bLo = Math.max(bnd.lo, S.nu - S.bw / 2), bHi = Math.min(bnd.hi, S.nu + S.bw / 2);
  const nu = S.nu * 1e9, bw = Math.max(0, bHi - bLo) * 1e9, nuC = (bLo + bHi) / 2 * 1e9, lam = C / nu;
  // The time step, the channels and the baselines used. Samples lie sp apart (a fraction of a baseline's length)
  // along a track and along a band's streak, sp starting at 30 s of the Earth's turn (1/381) and widening until the
  // samples fit the budget, with at most 512 channels and at least 2 across a band. All the baselines up to
  // MAXPAIRS; beyond that a random draw of distinct pairs, MINPAIRS to MAXPAIRS of them, fewer when the observation
  // needs many samples per baseline, so that the tracks and streaks stay finely sampled. The draws are nested (the
  // first K pairs of one seeded sequence), so the picture does not jump as K changes.
  const nOn = ants.filter(x => x.on).length, total = nOn * (nOn - 1) / 2;
  let step = 1 / 120, nCh = 1, K = total;
  for (let it = 0, sp = RI.HA_PER_H / 120; it < 200; it++, sp *= 1.1) {
    step = sp / RI.HA_PER_H;
    const nt = dur > 0 ? Math.floor(dur / step) + 1 : 1;
    nCh = bw > 0 ? Math.max(2, Math.min(512, Math.ceil((bw / nuC) / sp))) : 1;
    K = total > MAXPAIRS ? Math.max(MINPAIRS, Math.min(MAXPAIRS, Math.floor(BUDGET / (nt * nCh)))) : total;
    if (K * nCh * nt <= BUDGET || (nt === 1 && nCh === (bw > 0 ? 2 : 1))) break;
  }
  // the baselines, their lengths sorted, and the exact extremes, kept while the layout (and the draw) stays the same
  const lkey = JSON.stringify([S.arr, S.cfg, S.lay, S.na, S.ext, S.seed, S.conc, S.off, S.mv, aplay ? aplay.k : 0]), akey = lkey + "|" + K;
  if (ecache.key !== lkey) ecache = { key: lkey, ex: RI.extremes(ants) };
  if (pcache.key !== akey) { const B = RI.baselines(ants, lat, total > MAXPAIRS ? K : Infinity); B.len.sort(); pcache = { key: akey, B }; }
  const B = pcache.B, L = B.len, on = nOn;
  const R = { a, ants, lat, nu, bw, lam, L, on, nb: B.total, nbUsed: B.length, sub: B.sub, Bmax: ecache.ex.bmax, Bmin: ecache.ex.bmin, dur };
  R.pb = pbOf(S.nu);
  // A transit array (CHIME, CHORD) maps the sky as the sky drifts through the beam (RI.gridEnv): the map's beam is the
  // synthesized beam times the primary beam's east-west envelope, channel by channel, and the sky carries only the
  // beam's north-south pattern
  R.drift = !!a.transit && !a.geo && !a.single;
  R.skyPB = R.drift ? { ew: Infinity, ns: typeof R.pb === "object" ? R.pb.ns : R.pb } : R.pb;
  // the image grid: twice the field across (so that the beam's sidelobes and the sky do not wrap into the field),
  // at about one pixel per screen pixel; and the input image on the grid, drawn whether or not there are samples
  {
    const cv = $("cvU"), dpr = window.devicePixelRatio || 1, sideCss = Math.max(80, Math.min(cv.clientWidth / 2 - 28, cv.clientHeight / 2 - 70));
    let n = 256; while (n < Math.min(1024, 2 * sideCss * dpr)) n *= 2;
    if (fast && n > 256) n /= 2;
    const F = S.field / RAD, pix = 2 * F / n;
    const im = imgOf(S.sky), pyr = im ? imgData[S.sky] : null, model = im ? "image" : S.sky;
    if (im && !pyr) { loadImg(S.sky); R.loading = true; }
    // the pyramid's level for this grid: pixels just below half the grid's
    const imd = pyr ? RI.level(pyr, S.size / RAD, pix) : null;
    R.imgLevel = imd ? { w: imd.w, pix: S.size / imd.w } : null;
    const tkey = JSON.stringify([S.sky, S.size, n, pix, imd ? imd.w : 0]);
    if (tcache.key !== tkey) tcache = { key: tkey, s: RI.skyImage(model, S.size / RAD, n, pix, 0, imd) };
    Object.assign(R, { n, pix, F, sky: tcache.s, grid: { n, pix, F, model, imd } });
  }
  // An Earth-scale array: each station sees the source at its own hour angle and elevation, above the higher of the
  // limit set and the station's own; each baseline weighted 1 / (SEFD_i SEFD_j) when the stations' sensitivities differ
  const onA = ants.filter(x => x.on);
  const sta = a.geo ? onA.map(p => ({ lat: p.lat * DEG, dlon: (p.lon - a.geo.lon0) * DEG, elMin: Math.max(elOf(), p.elMin || 0) * DEG, mask: p.mask ? maskRad(p.mask) : null })) : null;
  R.dur = dur; R.sta = sta;
  R.up = sta ? RI.hoursUpSta(dur, dec, sta) : RI.hoursUp(dur, dec, lat, elMin);
  R.transit = RI.elevation(0, dec, lat) / DEG;
  if (sta) {
    // the stations that see the source above their limits at some time in the observation
    const Hs = RI.hourAngles(dur, 1 / 60);
    // (counted by site: CHIME's feeds are one site)
    const seen = sta.map(q => Hs.some(h => RI.staSees(q, h * RI.HA_PER_H, dec))), G = groupsOf(onA);
    R.staUp = G.filter(q => q.k.some(k => seen[k])).length; R.nSites = G.length;
  }
  // a transit array whose dishes are pointed by hand along the meridian (CHORD) reaches a band of declinations only
  R.reach = !a.decRange || (S.dec >= a.decRange[0] && S.dec <= a.decRange[1]);
  let Sm, w;
  if (a.single) {
    // a single dish: every spacing within the illuminated aperture at once, weighted by the aperture's
    // autocorrelation; no Earth rotation, and no primary-beam taper (a map is made by scanning the beam over the sky)
    const ap = RI.aperture(a.single.ew, a.single.ns, nu), big = Math.max(a.single.ew, a.single.ns);
    Object.assign(R, { single: true, pb: 0, nb: 0, Bmax: big, Bmin: 0, ext: big / lam, full: ap, step: 0, nCh: 1 });
    R.reach = a.decRange ? S.dec >= a.decRange[0] && S.dec <= a.decRange[1] : Math.abs(S.dec - a.lat) <= a.zenLimit;
    Sm = R.reach ? ap : Object.assign({}, ap, { n: 0 });
    R.S = Sm;
    if (!Sm.n) return R;
    w = ap.w0;
  } else {
  if (R.nb === 0) return R;
  if (!R.reach) { R.ext = R.Bmax * (nuC + bw / 2) / C; R.S = { n: 0 }; return R; }
  // the extent of the uv plane: the longest baseline at the band's highest frequency
  R.ext = R.Bmax * (nuC + bw / 2) / C;
  let wq = null;
  if (sta && onA.some(p => p.sefd > 0)) {
    wq = new Float32Array(B.length);
    let mx = 0;
    for (let k = 0; k < B.length; k++) { wq[k] = 1 / (onA[B.I[k]].sefd * onA[B.J[k]].sefd); mx = Math.max(mx, wq[k]); }
    for (let k = 0; k < B.length; k++) wq[k] /= mx;
  }
  R.wq = !!wq;
  // (shadowing: for the arrays of tracking dishes on one site)
  const shadow = !sta && !a.transit && !a.cyl ? a.dish : 0;
  // (a transit array: each sample weighted by the beam's power toward the drifting source)
  const full = RI.sample({ ants, lat, dec, elMin, dur, nu: nuC, bw, nCh, step, B, sta, wq, shadow, drift: a.transit ? pbEW(R.pb) : 0 });
  R.full = full; R.step = step; R.nCh = nCh; R.shadow = shadow ? full.shadowed : null;
  // while playing, the samples up to the moment played: a prefix, the samples running in time order
  Sm = full;
  if (play) {
    const k = full.up.filter(h => h <= play.h + 1e-9).length, m = full.tOff[k];
    Sm = Object.assign({}, full, { u: full.u.subarray(0, m), v: full.v.subarray(0, m), wb: full.wb && full.wb.subarray(0, m), n: m, upNow: k });
  }
  R.S = Sm;
  if (!Sm.n) return R;
  // The uniform and robust weights count samples in uv cells: an image about 250 beams across (cells 1/250 of the
  // longest baseline in wavelengths). A sparse set of samples (few baselines, coarse steps) gets cells as wide as
  // its samples' spacing along the tracks and streaks, so that a track fills its cells, but no wider than the cells
  // that hold four samples on average (a dense set fills its cells anyway). With the baselines a random draw, the
  // cells are sqrt(total / drawn) wider, so as to hold as many samples as the full set's would.
  const gap = 1.5 * Math.max(RI.HA_PER_H * step, nCh > 1 ? (bw / nuC) / nCh : 0) * R.ext, fill = R.ext * Math.sqrt(2 * Math.PI / Sm.n);
  const cell = R.sub ? R.ext / 250 * Math.sqrt(R.nb / R.nbUsed) : Math.max(R.ext / 250, Math.min(gap, fill));
  R.cell = cell;
  w = RI.weigh(Sm, S.wt, S.rob, cell);
  }
  // the weights on a grid: the samples gridded (for a transit array, convolved along u with each channel's east-west
  // envelope), or a single dish's aperture put straight onto the cells
  const ewOf = nuHz => pbEW(pbOf(nuHz / 1e9));
  const gridAt = (nn, du) => (R.single ? RI.apertureGrid(Sm.single, nn, du) : R.drift ? RI.gridEnv(Sm, w, nn, du, ewOf) : RI.grid(Sm, w, nn, du));
  // the beam's size and sidelobes, measured on a grid of its own (pixels 1/20 of the shortest fringe), coarser
  // if the main lobe does not fit
  const nm = fast ? 256 : 512;
  for (let k = 0, pixm = 0.05 / R.ext; k < 3; k++, pixm *= 3) {
    const Gm = gridAt(nm, 1 / (nm * pixm)), Dm = RI.dirty(Gm.g, null, nm);
    const f = RI.fitBeam(Dm.beam, nm, pixm);
    if (f) { R.beam = f; R.side = RI.sidelobe(Dm.beam, nm, 1.5 * f.maj / pixm); break; }
  }
  // the dirty image: the weights times the sky's (times the primary beam, or a transit array's north-south pattern)
  // visibilities, on the image grid
  const { n, pix, F, model, imd } = R.grid;
  const G = gridAt(n, 1 / (2 * F));
  R.drop = R.single ? G.drop : G.drop / Sm.n;
  const key = JSON.stringify([S.sky, S.size, n, pix, R.skyPB, imd ? imd.w : 0]);
  if (vcache.key !== key) vcache = { key, V: RI.pointVis(model, S.size / RAD, n, 1 / (2 * F), R.skyPB) || RI.visibilities(RI.skyImage(model, S.size / RAD, n, pix, R.skyPB, imd), n) };
  Object.assign(R, { D: RI.dirty(G.g, vcache.V, n), w });
  // A regular grid of dishes (CHORD, flagged aliases; the made-up Grid layout) has grating lobes, copies of the main
  // lobe at λ over the grid's spacings, beyond the ±12.8 λ / B_max of the search above: the peak sidelobe is then also
  // searched over the whole image grid, the field on either side of the center (audit X, 2026-11-16). The same search
  // for a transit array's map beam, whose envelope reaches beyond the search above.
  R.aliases = !R.single && !!R.beam && ((S.lay === "built" && !!a.aliases) || S.lay === "grid");
  if (R.aliases || (R.drift && R.beam)) {
    const wide = RI.sidelobe(R.D.beam, n, Math.max(2, 1.5 * R.beam.maj / pix));
    R.sideWide = wide;
    if (Math.abs(wide) > Math.abs(R.side || 0)) R.side = wide;
  }
  // the sky smoothed by the fitted beam (the Smoothed view), kept while the sky, the grid and the beam stay the same
  if (S.dimg === "smooth" && R.beam && !R.single) {
    const sk = key + "|" + [R.beam.maj, R.beam.min, R.beam.pa].join(",");
    if (scache.key !== sk) scache = { key: sk, img: RI.smoothed(vcache.V, R.beam, n, 1 / (2 * F)) };
    R.smooth = scache.img;
  }
  return R;
}

// ------------------------------------------------------------------ readouts
function renderText(R) {
  const a = R.a, tot = R.ants.length, nmv = Object.keys(S.mv).length;
  if (R.single) {
    const sd = a.single, bm = R.beam;
    rows($("rArrR"), [
      ["Reflector", "Ø " + fDish(a.dish) + " m", a.dishNote || ""],
      ["Illuminated", sig(sd.ew, 3) + " × " + sig(sd.ns, 3) + " m", "The part of the reflector the feed illuminates (east-west × north-south), drawn blue. The page takes the illumination as uniform. " + (sd.note || "")],
      ["Spacings", "all, 0 to " + fLen(Math.max(sd.ew, sd.ns)), "A filled aperture measures all the spacings within the illuminated area at once, each weighted by how often the spacing occurs across the aperture (the aperture's autocorrelation), including the zero spacing: the total flux."],
      ["Zenith-angle limit", sig(a.zenLimit, 3) + "°", "The dish is fixed, and the feed moves to point within this angle of the zenith."],
    ]);
    rows($("rObsR"), [
      ["Within reach", R.reach ? "yes" : "no", "Declinations " + fDeg(a.decRange ? a.decRange[0] : a.lat - a.zenLimit) + " to " + fDeg(a.decRange ? a.decRange[1] : a.lat + a.zenLimit) + " (the users' guide): the source must pass within " + sig(a.zenLimit, 3) + "° of the zenith (latitude " + fDeg(a.lat) + ")."],
      ["Elevation at transit", R.transit > 0 ? Math.round(R.transit) + "°" : "never rises", "The source's elevation at the meridian: 90° − |latitude − declination|."],
      ["Field of view", "the beam", "A single dish sees one beam at a time. A map is made by scanning the beam across the sky, so the map has no primary-beam taper."],
    ]);
    rows($("rImgR"), [
      ["Beam", bm ? fAng2(bm.maj * RAD, bm.min * RAD) + ", PA " + Math.round(bm.pa) + "°" : "–", "The FWHM of the dish's beam, a Gaussian fitted to the main lobe of the diffraction pattern of the uniformly lit aperture (≈ 1.03 λ / D). " + (a.beamNote || "")],
      ["Peak sidelobe", R.side !== undefined && R.side !== null ? (R.side >= 0 ? "+" : "−") + sig(Math.abs(R.side) * 100, 2) + "%" : "–", "The first ring of the diffraction pattern (1.75% for a uniformly illuminated circle). A filled aperture's beam has no negative sidelobes."],
      ["Largest scale", "all", "The dish measures the zero spacing, the total flux, so structures of any size are recovered."],
    ]);
    return;
  }
  // the antennas: a count of the unit the array is built of (antennas, stations, feeds) and the dish, or the dishes'
  // range when they differ
  const cnt = (R.on < tot ? R.on.toLocaleString("en-US") + " of " + tot.toLocaleString("en-US") : tot.toLocaleString("en-US")) + (a.unit ? " " + a.unit : "");
  const dl = a.geo && cfgOf().dishes ? [Math.min(...cfgOf().dishes), Math.max(...cfgOf().dishes)] : null;
  const antTxt = cnt + (a.unitTail !== undefined ? a.unitTail : dl && dl[1] > dl[0] ? ", " + fDish(dl[0]) + "–" + fDish(dl[1]) + " m" : " × " + fDish(a.dish) + " m") + (nmv ? " (" + nmv + " moved)" : "");
  rows($("rArrR"), [
    ["Antennas", antTxt, a.geo ? "The stations of the array, each at its own place on the Earth" + (dl && dl[1] > dl[0] ? ", with dishes of different sizes (a phased array counts as the one dish of the same collecting area)" : "") + ". Click a station's name in the drawing to remove or restore the station, and drag the globe to turn the globe." + (a.antNote ? " " + a.antNote : "")
      : a.cyl ? "The feeds along the cylinders' focal lines. Each cylinder focuses the light in the east-west direction onto its focal line; along the line the reflector is flat, so each feed sees the whole meridian north-south and shares the reflector with its neighbors. Click a feed in the drawing to remove or restore the feed, and drag a feed to move the feed." + (a.antNote ? " " + a.antNote : "")
      : "The antennas in " + (S.lay === "built" ? "this configuration" : "this layout") + ", each a dish of this diameter. Click an antenna in the drawing to remove or restore the antenna, and drag an antenna to move the antenna." + (S.lay === "built" && a.antNote ? " " + a.antNote : "")],
    ["Baselines", R.nb.toLocaleString("en-US"), "Each pair of antennas is a baseline: N antennas make N (N − 1) / 2." + (R.sub ? " Beyond " + MAXPAIRS.toLocaleString("en-US") + ", the page uses a random draw of distinct pairs, " + MINPAIRS.toLocaleString("en-US") + " to " + MAXPAIRS.toLocaleString("en-US") + " (fewer for long tracks and wide bands, which need more samples per baseline; " + R.nbUsed.toLocaleString("en-US") + " here): the uv coverage and the beam come out the same, statistically, as with all the pairs." + (cfgOf().keep ? " The draw keeps every baseline to the outriggers." : "") : "") + (R.wq ? " Each baseline is weighted by the two stations' sensitivities, 1 / (SEFD_i × SEFD_j): a baseline between two large dishes counts for more." : "")],
    ["Longest baseline", R.nb ? fLen(R.Bmax) : "–", a.geo ? "The longest baseline: the straight line between two stations, through the Earth. The longest baseline makes the finest fringes, and so sets the resolution, ≈ λ / B_max. Seen from the source, a baseline looks shorter, and the two stations must both see the source." : "The longest baseline on the ground. The longest baseline makes the finest fringes, and so sets the resolution, ≈ λ / B_max."],
    ["Shortest baseline", R.nb ? fLen(R.Bmin) : "–", a.geo ? "The shortest baseline: the two stations closest together. The shortest baseline makes the widest fringes, and so sets the largest structure the array can see." + (a.bminNote ? " " + a.bminNote : "")
      : a.cyl ? "The shortest baseline: two neighboring feeds on one cylinder's focal line. The shortest baseline makes the widest fringes, and so sets the largest structure the array can see."
      : "The shortest baseline on the ground. The shortest baseline makes the widest fringes, and so sets the largest structure the array can see. Dishes stand at least a dish diameter apart, so on the ground no baseline is shorter than a dish. Seen from a low source a baseline can look shorter, but then one dish shades the other, and the page drops the shadowed antenna's baselines (the Observation panel's Shadowed row)." + (S.lay === "built" && cfgOf().note ? " " + cfgOf().note : "")],
  ]);
  const upTxt = R.up < 0 || (R.dur > 0 && R.up === 0) ? "below the limit" : R.dur > 0 ? (R.up >= 1 && R.dur >= 1 ? sig(R.up, 3) : fDur(R.up)) + " of " + fDur(R.dur) : "yes";
  const pbTxt = typeof R.pb === "object" ? fAng2(R.pb.ew * RAD, R.pb.ns * RAD, 2) : fAng(R.pb * RAD, 2);
  // a transit array's map (RI.gridEnv)
  const DRIFT_TXT = "The sky drifts through the beam, and the telescope maps the sky direction by direction, each direction from the data taken as the direction crosses the meridian. Each point of the map then sees the sky through the synthesized beam times the beam's east-west power pattern, channel by channel, so the map is the sky convolved with that product, the beam shown. North-south the beam stays fixed, and the page applies the beam's north-south pattern to the sky. Each sample is weighted by the beam's power toward the source as the source drifts across, 1 at transit and 1/2 at the half-power edges.";
  rows($("rObsR"), a.geo ? [
    ["Two stations up", upTxt, "The part of the observation with the source above the limit at two stations or more. A baseline samples only while the source is above the limit at both of its stations, each station at its own hour angle and elevation."],
    ["Stations up", R.sta ? R.staUp + " of " + R.nSites : "–", "The stations that see the source above their limits at some time during the observation (a site with many feeds counts once). A station on the far side of the Earth from the source sees nothing."],
    a.transit ? ["Within reach", R.reach ? "yes" : "no", a.reachNote || ""] : ["Primary beam", pbTxt, `The field of view: the half-power width of one dish's beam on the sky (${a.pbSource}), at the frequency set. Far wider than the images here.`],
  ] : a.transit ? [
    ["Within reach", R.reach ? "yes" : "no", a.reachNote || ""],
    ["Elevation at transit", R.transit > 0 ? Math.round(R.transit) + "°" : "never rises", "The source's elevation at the meridian: 90° − |latitude − declination|. The array is at latitude " + fDeg(a.lat) + "."],
    ["Primary beam", pbTxt, typeof R.pb === "object" ? `The field of view, east-west × north-south: the half-power widths of one feed's beam on the sky (${a.pbSource}), at the frequency set. The cylinder focuses the light in the east-west direction only, so the beam is a narrow strip along the meridian. ${DRIFT_TXT}`
      : `The field of view: the half-power width of one dish's beam on the sky (${a.pbSource}), at the frequency set. The dishes do not track. ${DRIFT_TXT}`],
  ] : [
    ["Above the limit", upTxt, "The part of the observation with the source above the elevation limit. Hour angles with the source below the limit give no samples."],
    ["Shadowed", R.shadow === null || R.shadow === undefined ? "–" : R.shadow > 0 ? (R.shadow < 0.001 ? "< 0.1%" : sig(100 * R.shadow, 2) + "%") + " of samples" : "none", "The samples lost to shadowing. Seen from a low source, one dish can stand in front of another: an antenna is shadowed when another antenna nearer the source stands within a dish diameter of the first one's line of sight. The shadowed antenna's baselines give no samples at that moment, as the observatories flag them. Shadowing affects compact configurations observing low sources."],
    ["Elevation at transit", R.transit > 0 ? Math.round(R.transit) + "°" : "never rises", "The source's elevation at the meridian: 90° − |latitude − declination|. The array is at latitude " + fDeg(a.lat) + "."],
    ["Primary beam", pbTxt, `The field of view: the half-power width of one dish's beam on the sky (${a.pbSource}), at the frequency set. Sources far outside the primary beam are not seen.`],
  ]);
  // the largest scale: the VLA's own table for the VLA as built (scaled as 1 / frequency within the band, halved for a
  // snapshot), ALMA's 0.983 lambda / L5 for ALMA and for every other array or layout
  const L5 = RI.pctile(R.L, 5), asBuilt = S.lay === "built" && !modified(), tab = a.las && asBuilt && a.las.bands[S.band];
  let las = L5 > 0 ? 0.983 * R.lam / L5 * RAD : NaN, lasSrc = a.lasSource && asBuilt ? a.lasSource : "ALMA's rule, 0.983 λ / L5, with L5 the 5th-percentile baseline length (the ALMA Technical Handbook)";
  if (tab) { las = tab.v[a.las.cfgs.indexOf(S.cfg)] * tab.nu / S.nu * (R.dur > 0 ? 1 : 0.5); lasSrc = a.las.src + ": the largest structure imaged reasonably well in a full synthesis, " + tab.v[a.las.cfgs.indexOf(S.cfg)] + "″ at " + tab.nu + " GHz, scaled as 1 / frequency" + (R.dur > 0 ? "" : ", and halved for a snapshot"); }
  if (!(R.S && R.S.n)) las = NaN;
  const bm = R.beam;
  rows($("rImgR"), [
    ["Beam", bm ? fAng2(bm.maj * RAD, bm.min * RAD) + ", PA " + Math.round(bm.pa) + "°" : R.S && R.S.n ? "–" : "no samples", "The synthesized beam, the resolution: the FWHM of an elliptical Gaussian fitted to the synthesized beam's main lobe (major × minor axis), and the position angle of the major axis, east of north." + (R.drift ? " For a transit array the beam shown is the map's beam: the synthesized beam times the primary beam's east-west power pattern (see Primary beam)." : "")],
    ["Peak sidelobe", R.side !== undefined && R.side !== null ? (R.side >= 0 ? "+" : "−") + Math.round(Math.abs(R.side) * 100) + "%" : "–", "The largest sidelobe of the synthesized beam beyond the main lobe (within ~10 beams of the center), relative to the peak. Negative sidelobes are the blue rings and troughs." + (R.drift ? " For a transit array the sidelobes are those of the map's beam, the synthesized beam times the primary beam's east-west power pattern, and the search covers the whole image grid, the field on either side of the center. A regular layout repeats the main lobe at λ over the layout's spacings" + (a.aliasNote && S.lay === "built" ? ", " + a.aliasNote : "") + ". The east-west power pattern subdues the east-west copies, and over a wide band the copies smear radially, since λ over a spacing changes across the band." + (a.cyl ? " The feeds stand 0.3048 m apart along each cylinder, which places the north-south copies below the horizon." : " North-south the dishes stay pointed at one declination, so the north-south copies keep their full height in the map's beam.")
      : R.aliases ? " For a regular grid of dishes the search also covers the whole image grid, the field on either side of the center, so the grating lobes count: copies of the main lobe at λ over the grid's spacings" + (a.aliasNote && S.lay === "built" ? ", " + a.aliasNote : "") + "." : "")],
    ["Largest scale", isFinite(las) ? "≈ " + fAng(las, 2) : "–", "The largest recoverable scale, approximately the largest structure the array images well (" + lasSrc + "). A smooth source much larger than this scale is resolved out, and the source's flux goes missing."],
  ]);
}

// ------------------------------------------------------------------ the array panel
// the view: s screen pixels per meter, the origin at (ox, oy); for the globe also the latitude and longitude at the
// globe's center (degrees)
const alview = { s: 1, ox: 0, oy: 0, lat: 0, lon: 0, fit: true };
let hoverAnt = -1;
const R_EARTH = 6371e3;
// the globe, in orthographic projection about the view's center: (latitude, longitude) to screen x, y and z (> 0 on
// the near side). A parallel projection, so a baseline (a straight chord through the Earth) is a straight line here.
function globeProj() {
  const lc = alview.lat * DEG, sc = Math.sin(lc), cc = Math.cos(lc), Rp = R_EARTH * alview.s;
  return (lat, lon) => {
    const p = lat * DEG, dl = (lon - alview.lon) * DEG, cp = Math.cos(p), sp = Math.sin(p);
    return [alview.ox + Rp * cp * Math.sin(dl), alview.oy - Rp * (cc * sp - sc * cp * Math.cos(dl)), sc * sp + cc * cp * Math.cos(dl)];
  };
}
function antScreen(ants) {
  if (arrOf().geo) { const P = globeProj(); return ants.map(p => P(p.lat, p.lon)); }
  const X = e => alview.ox + e * alview.s, Y = n => alview.oy - n * alview.s;
  return ants.map(p => [X(p.e), Y(p.n)]);
}
// an Earth-scale array's sites: the stations grouped by site (a phased array or a cluster of feeds is one site), each
// site's label box on the screen kept for the clicks
let glabels = [];
function groupsOf(ants) {
  const G = new Map();
  ants.forEach((p, k) => { const q = G.get(p.group) || { name: p.group, k: [] }; q.k.push(k); G.set(p.group, q); });
  return [...G.values()];
}
const C_LAND = "#e6dfd2", C_LANDE = "#c9bfae", C_SEA = "#f3f6f8", C_RIM = "#b9c3ca";
function drawGlobe(g, w, h, R) {
  const ants = R.ants, top = 24, bot = 50;
  if (alview.fit) {
    // centered on the stations' mean direction, the whole Earth in view
    let x = 0, y = 0, z = 0;
    for (const p of ants) { const c = Math.cos(p.lat * DEG); x += c * Math.cos(p.lon * DEG); y += c * Math.sin(p.lon * DEG); z += Math.sin(p.lat * DEG); }
    alview.lat = Math.atan2(z, Math.hypot(x, y)) / DEG; alview.lon = Math.atan2(y, x) / DEG;
    alview.s = Math.min(w - 40, h - top - bot) / 2 / R_EARTH * 0.97; alview.ox = w / 2; alview.oy = top + (h - top - bot) / 2;
    alview.fit = false;
  }
  const P = globeProj(), Rp = R_EARTH * alview.s, ox = alview.ox, oy = alview.oy;
  g.fillStyle = C_SEA; g.beginPath(); g.arc(ox, oy, Rp, 0, 2 * Math.PI); g.fill();
  // the land (Natural Earth's 1:110 million outlines); a point on the far side goes to the rim along its own direction,
  // so that a coast running behind the Earth closes along the rim
  g.save(); g.beginPath(); g.arc(ox, oy, Rp, 0, 2 * Math.PI); g.clip();
  g.fillStyle = C_LAND; g.strokeStyle = C_LANDE; g.lineWidth = 0.8;
  for (const ring of window.IX_LAND || []) {
    let any = false; const xy = [];
    for (let k = 0; k < ring.length; k += 2) {
      let [x, y, zz] = P(ring[k + 1], ring[k]);
      if (zz >= 0) any = true; else { const d = Math.hypot(x - ox, y - oy) || 1; x = ox + (x - ox) / d * Rp; y = oy + (y - oy) / d * Rp; }
      xy.push(x, y);
    }
    if (!any) continue;
    g.beginPath(); g.moveTo(xy[0], xy[1]); for (let k = 2; k < xy.length; k += 2) g.lineTo(xy[k], xy[k + 1]); g.closePath(); g.fill(); g.stroke();
  }
  g.restore();
  g.strokeStyle = C_RIM; g.lineWidth = 1.2; g.beginPath(); g.arc(ox, oy, Rp, 0, 2 * Math.PI); g.stroke();
  // the sites: each at its stations' mean position; the baselines between the sites in use, straight chords
  const xy = ants.map(p => P(p.lat, p.lon)), G = groupsOf(ants);
  for (const q of G) { q.on = q.k.filter(k => ants[k].on).length; q.noRx = q.k.every(k => ants[k].noRx); q.xy = [0, 1, 2].map(i => q.k.reduce((s0, k) => s0 + xy[k][i], 0) / q.k.length); }
  const live = G.filter(q => q.on > 0);
  g.strokeStyle = "rgba(47,106,158,.38)"; g.lineWidth = 1;
  g.beginPath();
  for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) { g.moveTo(live[i].xy[0], live[i].xy[1]); g.lineTo(live[j].xy[0], live[j].xy[1]); }
  g.stroke();
  for (const q of G) {
    const [x, y, zz] = q.xy, back = zz < 0;
    g.beginPath(); g.arc(x, y, hoverAnt === q.k[0] ? 5.5 : 4, 0, 2 * Math.PI);
    if (q.on && !back) { g.fillStyle = C_UV; g.fill(); }
    else { g.fillStyle = "#fff"; g.fill(); g.strokeStyle = q.on ? C_UV : "#a9a39a"; g.lineWidth = 1.2; g.stroke(); }
  }
  // the labels, beside the sites, stacked where sites fall together (ALMA and APEX, 2 km apart)
  glabels = [];
  g.font = `12px ${FONT}`; g.textBaseline = "middle";
  const placed = [];
  for (const q of [...G].sort((A, B) => A.xy[1] - B.xy[1])) {
    const [x, y] = q.xy, right = x < ox + Rp * 0.55, txt = q.name + (q.k.length > 1 ? ", " + (q.on < q.k.length ? q.on.toLocaleString("en-US") + " of " : "") + q.k.length.toLocaleString("en-US") + " " + (arrOf().unitMany || "stations") : "") + (q.noRx ? ", no receiver" : "");
    let ly = y;
    while (placed.some(([px, py, pr]) => pr === right && Math.abs(px - x) < 60 && Math.abs(py - ly) < 14)) ly += 14;
    placed.push([x, ly, right]);
    const tw = g.measureText(txt).width, lx = right ? x + 8 : x - 8 - tw;
    g.fillStyle = q.on ? "#4f4a44" : "#a9a39a"; g.textAlign = "left"; g.fillText(txt, lx, ly);
    if (ly !== y) { g.strokeStyle = "rgba(79,74,68,.6)"; g.lineWidth = 0.9; g.beginPath(); g.moveTo(x, y); g.lineTo(right ? lx - 2 : lx + tw + 2, ly); g.stroke(); }
    glabels.push({ x0: lx - 3, x1: lx + tw + 3, y0: ly - 8, y1: ly + 8, q, x, y });
  }
  g.textBaseline = "alphabetic";
  // the hovered site's stations, top left
  if (hoverAnt >= 0) {
    const q = G.find(z => z.k.includes(hoverAnt));
    if (q) { g.font = `12.5px ${FONT}`; g.fillStyle = "#4f4a44"; g.textAlign = "left";
      const p = ants[q.k[0]], ll = Math.abs(p.lat).toFixed(2) + "° " + (p.lat >= 0 ? "N" : "S") + ", " + Math.abs(p.lon).toFixed(2) + "° " + (p.lon >= 0 ? "E" : "W");
      const lines = q.k.length > 3 ? [q.name + ": " + q.k.length.toLocaleString("en-US") + " " + (arrOf().unitMany || "stations") + ", " + ll] : q.k.map(k => ants[k].name + (ants[k].full ? " (" + ants[k].full + ")" : "") + (ants[k].dish ? ", " + fDish(ants[k].dish) + " m" : "") + (ants[k].sefd ? ", SEFD " + Math.round(ants[k].sefd).toLocaleString("en-US") + " Jy" : "") + (ants[k].noRx ? ", no receiver in this band" : ants[k].on ? "" : " (off)")).concat([ll]);
      lines.forEach((t, i) => g.fillText(t, 14, 18 + 15 * i)); }
  }
  document.documentElement.style.setProperty("--capLA", "22px");
  $("alSub").textContent = fixedLine() + (arrOf().configs.length > 1 ? cfgOf().name + ". " : "") + "Drag to turn the globe. Click a station's name to remove or restore the station.";
}
function drawArray(R) {
  const cv = $("cvA"), { g, w, h } = fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  if (!(w > 0 && h > 0)) return;
  const ants = R.ants, a = R.a;
  if (a.single) { drawDish(g, w, h, a); return; }
  if (a.geo) { drawGlobe(g, w, h, R); return; }
  if (alview.fit) {
    let e0 = Infinity, e1 = -Infinity, n0 = Infinity, n1 = -Infinity;
    for (const p of ants) { e0 = Math.min(e0, p.e); e1 = Math.max(e1, p.e); n0 = Math.min(n0, p.n); n1 = Math.max(n1, p.n); }
    for (const [ce, cn, cw, cl] of a.cyl || []) { e0 = Math.min(e0, ce - cw / 2); e1 = Math.max(e1, ce + cw / 2); n0 = Math.min(n0, cn - cl / 2); n1 = Math.max(n1, cn + cl / 2); }
    const top = 30, bot = 56, side = 30, dx = Math.max(e1 - e0, a.dish * 4), dy = Math.max(n1 - n0, a.dish * 4);
    alview.s = Math.min((w - 2 * side) / dx, (h - top - bot) / dy);
    alview.ox = side + (w - 2 * side - dx * alview.s) / 2 - (e0 - (dx - (e1 - e0)) / 2) * alview.s;
    alview.oy = top + (h - top - bot - dy * alview.s) / 2 + (n1 + (dy - (n1 - n0)) / 2) * alview.s;
    alview.fit = false;
  }
  // a cylinder's reflector under its line of feeds ([east, north, width, length] m)
  for (const [ce, cn, cw, cl] of a.cyl || []) {
    g.fillStyle = "#ece7de"; g.strokeStyle = "#c9bfae"; g.lineWidth = 1;
    g.fillRect(alview.ox + (ce - cw / 2) * alview.s, alview.oy - (cn + cl / 2) * alview.s, cw * alview.s, cl * alview.s);
    g.strokeRect(alview.ox + (ce - cw / 2) * alview.s, alview.oy - (cn + cl / 2) * alview.s, cw * alview.s, cl * alview.s);
  }
  const xy = antScreen(ants), rr = Math.max(ants.length > 2000 ? 1.2 : ants.length > 500 ? 1.8 : 2.6, a.dish / 2 * alview.s);
  ants.forEach((p, k) => {
    const [x, y] = xy[k];
    g.beginPath(); g.arc(x, y, k === hoverAnt ? rr + 1.5 : rr, 0, 2 * Math.PI);
    if (p.on) { g.fillStyle = C_UV; g.fill(); } else if (p.pending) { g.fillStyle = "#fff"; g.fill(); g.strokeStyle = C_MIR; g.lineWidth = 1.2; g.stroke(); } else { g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#a9a39a"; g.lineWidth = 1.2; g.stroke(); }
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
  const one = a.unitOne || "antenna";
  $("alSub").textContent = fixedLine() + (S.lay !== "built" ? lname + " layout. " : a.configs.length > 1 ? cfgOf().name + " configuration. " : "") + `Click ${/^[aeiou]/.test(one) ? "an" : "a"} ${one} to remove or restore the ${one}, and drag ${/^[aeiou]/.test(one) ? "an" : "a"} ${one} to move the ${one}.`;
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
  // an Earth-scale array: the site under the pointer (its label or its dot), as the index of its first station
  const pickSite = ev => {
    const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    for (const L of glabels) if (mx >= L.x0 && mx <= L.x1 && my >= L.y0 && my <= L.y1) return L.q;
    let best = null, bd = 8;
    for (const L of glabels) { const d = Math.hypot(L.x - mx, L.y - my); if (d < bd) { bd = d; best = L.q; } }
    return best;
  };
  const pick = ev => {
    if (!cur || cur.single) return -1;
    if (cur.a.geo) { const q = pickSite(ev); return q ? q.k[0] : -1; }
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
    drag = { x: ev.clientX, y: ev.clientY, ox: alview.ox, oy: alview.oy, lat: alview.lat, lon: alview.lon, k, q: cur && cur.a.geo ? pickSite(ev) : null, moved: false };
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
    if (cur.a.geo) {
      // turn the globe: the surface follows the pointer
      const Rp = R_EARTH * alview.s;
      alview.lon = drag.lon - dx / Rp / DEG; alview.lat = Math.max(-89, Math.min(89, drag.lat + dy / Rp / DEG));
      drawArray(cur);
    } else if (drag.k >= 0) {
      // move the antenna: its new place on the ground
      stopPlay();
      const r = cv.getBoundingClientRect(), e = (ev.clientX - r.left - alview.ox) / alview.s, n = (alview.oy - (ev.clientY - r.top)) / alview.s;
      S.mv[drag.k] = [+e.toFixed(1), +n.toFixed(1)];
      quick(); H.schedule();
    } else { alview.ox = drag.ox + dx; alview.oy = drag.oy + dy; drawArray(cur); }
  });
  window.addEventListener("mouseup", () => {
    if (!drag) return;
    if (!drag.moved && drag.q) {
      // a click on a site: switch its stations off, or back on if any is off
      stopPlay();
      const off = new Set(S.off), anyOff = drag.q.k.some(k => off.has(k));
      for (const k of drag.q.k) { if (anyOff) off.delete(k); else off.add(k); }
      S.off = [...off].sort((x, y) => x - y);
      H.schedule(); H.scheduleHash();
    } else if (!drag.moved && drag.k >= 0 && !(cur && cur.a.geo)) {
      // a click: switch the antenna off or on
      stopPlay();
      const i = S.off.indexOf(drag.k);
      if (i >= 0) S.off.splice(i, 1); else S.off.push(drag.k);
      S.off.sort((x, y) => x - y);
      H.schedule();
    }
    if (drag.moved && drag.k >= 0 && !(cur && cur.a.geo)) H.scheduleHash();
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
  if (S.uvv === "uv") label(X(0) + ul / 2, Y(0), play && !R.single ? (R.dur < 1 ? "uv coverage, " + (play.h >= 0 ? "+" : "−") + Math.abs(play.h * 60).toFixed(1) + " min from transit" : "uv coverage, hour angle " + (play.h >= 0 ? "+" : "−") + Math.abs(play.h * RI.HA_PER_H / (15 * DEG)).toFixed(1) + " h") : aplay ? "uv coverage, " + aplay.k.toLocaleString("en-US") + " antennas" : "uv coverage");
  else label(X(0) + ul / 2, Y(0), "Visibility amplitude");
  const ext = R.ext * 1.05, ppx = Math.round(ps * dpr), plotH = ps;
  g.fillStyle = "#fff"; g.fillRect(x0, y0, ps, ps);
  const box = $("uvBox"), cvr = cv.getBoundingClientRect(), pr = cv.parentElement.getBoundingClientRect();
  box.style.left = Math.round(cvr.left - pr.left + x0 + ps / 2 - box.offsetWidth / 2) + "px"; box.style.top = Math.round(cvr.top - pr.top + y0 + ps + 30) + "px";
  if (none) empty(x0, y0, R.single || R.reach === false ? "the source is out of reach" : R.up < 0 || (R.dur > 0 && R.up === 0) ? "the source is below the limit" : "no samples");
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
      // A transit array's map: each sample stands for a strip of spacings along u, the transform of the east-west
      // envelope (a Gaussian of rms 1 / (2π σ) wavelengths, σ the envelope's rms width), shaded under the samples (the
      // shade's peak where the strips overlap). The channels in at most 8 groups, each with the group's own width.
      if (R.drift) {
        const nCh = Sm.nCh || 1, G = Math.min(nCh, 8), shd = new Float32Array(W * Hh), occ = new Uint8Array(W * Hh);
        for (let gi = 0; gi < G; gi++) {
          const c0 = Math.floor(gi * nCh / G), c1 = Math.floor((gi + 1) * nCh / G);
          let nuG = 0; for (let c = c0; c < c1; c++) nuG += Sm.nus[c]; nuG /= c1 - c0;
          const su = Math.sqrt(2 * Math.LN2) / (Math.PI * pbEW(pbOf(nuG / 1e9))) * sx, rr = Math.ceil(2.6 * su);
          const prof = Float32Array.from({ length: rr + 1 }, (_, d) => Math.exp(-d * d / (2 * su * su))), list = [];
          occ.fill(0);
          for (let c = c0; c < c1; c++) for (let k = c; k < Sm.n; k += nCh) for (const s of [1, -1]) {
            const px = Math.round(W / 2 + s * Sm.u[k] * sx), py = Math.round(Hh / 2 - s * Sm.v[k] * sy);
            if (px < 0 || py < 0 || px >= W || py >= Hh) continue;
            const i = py * W + px; if (!occ[i]) { occ[i] = 1; list.push(i); }
          }
          for (const i of list) {
            const x = i % W, row = i - x;
            for (let dd = -rr; dd <= rr; dd++) { const xx = x + dd; if (xx < 0 || xx >= W) continue; const t = prof[dd < 0 ? -dd : dd]; if (t > shd[row + xx]) shd[row + xx] = t; }
          }
        }
        const cF = [222, 232, 242];
        for (let i = 0; i < W * Hh; i++) { const t = shd[i]; if (t < 0.03) continue; const k = 4 * i; for (let j = 0; j < 3; j++) d[k + j] = Math.round(255 - (255 - cF[j]) * t); d[k + 3] = 255; }
      }
      for (let k = 0; k < Sm.n; k += stride) dot(-Sm.u[k], -Sm.v[k], cM, r0);
      for (let k = 0; k < Sm.n; k += stride) dot(Sm.u[k], Sm.v[k], cU, r0);
    }
    if (play && Sm.n) { const k0 = Sm.upNow > 0 ? R.full.tOff[Sm.upNow - 1] : 0; for (let k = k0; k < Sm.n; k++) { dot(Sm.u[k], Sm.v[k], cN, r0 + 1); dot(-Sm.u[k], -Sm.v[k], cN, r0 + 1); } }
    og.putImageData(id, 0, 0);
    g.drawImage(oc, x0, y0, ps, ps);
  } else {
    // amplitude against uv distance: the model's curve (when the model is round) and the samples on it
    const W = ppx, Hh = ppx, oc = document.createElement("canvas"); oc.width = W; oc.height = Hh;
    const og = oc.getContext("2d"), id = og.createImageData(W, Hh), d = id.data;
    // (the point-source sky's visibility is a sum over its 60 sources at each sample: at most 100,000 samples drawn)
    const stride = Math.max(1, Math.floor(Sm.n / (S.sky === "points" ? 1e5 : 4e5))), isImg = !!imgOf(S.sky), n0 = R.n, du0 = 1 / (2 * R.F);
    // An image's visibility: the transform of the input image (without the primary beam, as for the closed forms of
    // the other skies), interpolated between the grid's cells (bilinear in the real and imaginary parts). The other
    // skies' visibilities are computed at each sample: closed forms, or sums over the model's components.
    if (isImg && v0cache.key !== tcache.key) v0cache = { key: tcache.key, V: RI.visibilities(R.sky, n0) };
    const Vg = isImg ? v0cache.V : null, V0 = isImg ? Vg.re[0] || 1 : 1;
    const ampAt = (u, v) => {
      if (!isImg) return Math.abs(RI.vis(S.sky, S.size / RAD, u, v));
      const x = u / du0, y = v / du0, p = Math.floor(x), q = Math.floor(y), fx = x - p, fy = y - q;
      if (p <= -n0 / 2 || q <= -n0 / 2 || p + 1 >= n0 / 2 || q + 1 >= n0 / 2) return NaN;
      const at2 = (a, b) => ((b + n0) % n0) * n0 + (a + n0) % n0, w4 = [[p, q, (1 - fx) * (1 - fy)], [p + 1, q, fx * (1 - fy)], [p, q + 1, (1 - fx) * fy], [p + 1, q + 1, fx * fy]];
      let re = 0, im = 0; for (const [a, b, wt] of w4) { const c = at2(a, b); re += wt * Vg.re[c]; im += wt * Vg.im[c]; }
      return Math.hypot(re, im) / V0;
    };
    // (samples within 1% of the plot's width of zero spacing, the EHT's baselines within a site, would sit on the
    // frame's left edge: drawn as small marks just inside the frame)
    const zero = new Set();
    for (let k = 0; k < Sm.n; k += stride) {
      const q = Math.hypot(Sm.u[k], Sm.v[k]), A = ampAt(Sm.u[k], Sm.v[k]);
      if (!isFinite(A)) continue;
      const x = Math.round(q / ext * (W - 1)), y = Math.round((1 - A / 1.08) * (Hh - 1));
      if (x < 0 || y < 0 || x >= W || y >= Hh) continue;
      if (q < 0.01 * ext) { zero.add(y); continue; }
      const kk = 4 * (y * W + x); d[kk] = 47; d[kk + 1] = 106; d[kk + 2] = 158; d[kk + 3] = 255;
    }
    og.putImageData(id, 0, 0);
    g.drawImage(oc, x0, y0, ps, ps);
    g.fillStyle = "rgb(47,106,158)";
    for (const y of zero) { g.beginPath(); g.arc(x0 + 4, y0 + y / (Hh - 1) * ps, 2.5, 0, 2 * Math.PI); g.fill(); }
    // (the model's curve along one cut: for the round skies only)
    if (["point", "gaussian", "disc", "ring"].includes(S.sky)) {
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
    // point skies as dots ([l, m (arcsec), radius, brightness]): the points model's sources sized and lit by their
    // flux times the primary beam (a transit array's: the north-south pattern)
    const A = RI.beamFn(R.skyPB);
    const pts = S.sky === "point" ? [[0, 0, 3, 1]] : S.sky === "double" ? [[-S.size / 2, 0, 3, 1], [S.size / 2, 0, 3, 1]]
      : S.sky === "points" ? RI.pointsList(S.size / RAD).map(([l, m, f]) => { const b = f / 100 * A(l, m); return [l * RAD, m * RAD, 1.4 + 2.6 * Math.sqrt(b), Math.min(1, 0.5 + 0.5 * Math.sqrt(b))]; })
      : S.size * toPx < 2.5 ? [[0, 0, 3, 1]] : [];
    if (pts.length) { g.fillStyle = "#000"; g.fillRect(X(0), Y(1), side, side); } else blit(R.sky, X(0), Y(1), mx > 0 ? 1 / mx : 0);
    g.save(); g.beginPath(); g.rect(X(0), Y(1), side, side); g.clip();
    for (const [l, mm, r, b] of pts) { g.fillStyle = `rgba(255,250,238,${b})`; g.beginPath(); g.arc(X(0) + side / 2 - l * toPx, Y(1) + side / 2 - mm * toPx, r, 0, 2 * Math.PI); g.fill(); }
    // the primary beam's half-power outline (a cylinder's: an ellipse, narrow east-west); for a transit array the
    // north-south half-power lines alone, where they fall within the field (the sky drifts through the beam east-west)
    const [rx, ry] = typeof R.pb === "object" ? [R.pb.ew * RAD / 2 * toPx, R.pb.ns * RAD / 2 * toPx] : [R.pb * RAD / 2 * toPx, R.pb * RAD / 2 * toPx];
    g.strokeStyle = "rgba(220,214,204,.85)"; g.setLineDash([5, 4]); g.lineWidth = 1.2;
    if (R.drift) { if (ry < side / 2) { g.beginPath(); for (const s of [-1, 1]) { g.moveTo(X(0), Y(1) + side / 2 + s * ry); g.lineTo(X(0) + side, Y(1) + side / 2 + s * ry); } g.stroke(); } }
    else if ((typeof R.pb === "object" || R.pb > 0) && rx < side * 0.7) { g.beginPath(); g.ellipse(X(0) + side / 2, Y(1) + side / 2, rx, Math.min(ry, 1e5), 0, 0, 2 * Math.PI); g.stroke(); }
    g.setLineDash([]);
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
  const showS = S.dimg === "smooth" && R.smooth;
  if (none) empty(X(1), Y(1), "no samples");
  else {
    const im = showS ? R.smooth : R.D.img;
    let mx = 0; for (let k = 0; k < n * n; k++) mx = Math.max(mx, im[k]);
    blit(im, X(1), Y(1), mx > 0 ? 1 / mx : 0);
    const bm = R.beam;
    if (bm && bm.maj * RAD * toPx >= 3) {
      const ax = bm.maj * RAD * toPx / 2, bx = bm.min * RAD * toPx / 2, cx = X(1) + 10 + Math.max(ax, 6), cy = Y(1) + side - 10 - Math.max(ax, 6);
      if (ax < side / 4) { g.strokeStyle = "rgba(255,250,238,.95)"; g.lineWidth = 1.3; g.beginPath(); g.ellipse(cx, cy, ax, bx, Math.atan2(-Math.cos(bm.pa * DEG), -Math.sin(bm.pa * DEG)), 0, 2 * Math.PI); g.stroke(); }
    }
  }
  label(X(1), Y(1), R.single ? "Map" : showS ? "Smoothed sky" : "Dirty image");
  { const box = $("diBox"), cvr = cv.getBoundingClientRect(), pr = cv.parentElement.getBoundingClientRect();
    box.hidden = !!R.single;
    box.style.left = Math.round(cvr.left - pr.left + X(1) + side - box.offsetWidth) + "px"; box.style.top = Math.round(cvr.top - pr.top + Y(1) + side + 4) + "px"; }
  // when the longest baselines fall beyond the image grid (a field many beams wide), the images show the shorter
  // baselines only: say so on the images
  if (!none && R.drop > 0.01) {
    g.fillStyle = "rgba(220,214,204,.92)"; g.font = `10.5px ${FONT}`; g.textAlign = "left";
    const t = Math.round(100 * Math.min(1, R.drop)) + "% of the samples beyond these pixels: narrow the field";
    for (const yy of [Y(0), Y(1)]) g.fillText(t, X(1) + 6, yy + 14);
  }
  bar(X(1), Y(1), 1 / toPx, a => fAng(a, 2));
}

// ------------------------------------------------------------------ playing the observation
// The hour angle runs from the start of the observation to its end in six seconds, the uv tracks growing as the
// Earth turns; any change stops it.
let play = null;
const PLAY_MS = 6000;
function stopPlay() { if (play) { play = null; cancelAnimationFrame(playRAF); } if (aplay) { aplay = null; cancelAnimationFrame(aplayRAF); } }
let playRAF = 0;
function tick() {
  if (!play) return;
  const f = Math.min(1, (performance.now() - play.t0) / PLAY_MS);
  const d = durNow(); play.h = -d / 2 + d * f;
  draw(true);
  if (f >= 1) { play = null; draw(false); return; }
  playRAF = requestAnimationFrame(tick);
}
$("rPlay").addEventListener("click", () => {
  if (play) { stopPlay(); H.schedule(); return; }
  if (!(durNow() > 0)) return;
  stopPlay();
  play = { t0: performance.now(), h: -durNow() / 2 };
  tick();
});
// Adding the antennas: from 2 to all those switched on, in a fixed random order, with the observation as set, at a
// steady rate in the logarithm: k = 2 (N / 2)^(t / T), the count growing by the same factor each second; the
// baselines grow as k (k - 1) / 2
let aplay = null, aplayRAF = 0;
const onCount = () => { const P = pads(), off = new Set(S.off); let n = 0; for (let k = 0; k < P.ants.length; k++) if (!off.has(k)) n++; return n; };
function tickA() {
  if (!aplay) return;
  const f = Math.min(1, (performance.now() - aplay.t0) / PLAY_MS), k = Math.max(2, Math.min(aplay.N, Math.round(2 * Math.pow(aplay.N / 2, f))));
  if (k !== aplay.k || f >= 1) { aplay.k = k; draw(true); }
  if (f >= 1) { aplay = null; draw(false); return; }
  aplayRAF = requestAnimationFrame(tickA);
}
$("rPlayA").addEventListener("click", () => {
  if (aplay) { stopPlay(); H.schedule(); return; }
  const N = onCount();
  if (arrOf().single || N < 3) return;
  stopPlay();
  aplay = { t0: performance.now(), N, k: 0 };                         // (k 0: the first frame draws)
  tickA();
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
  if (play || aplay) return;                                         // the animations draw their own frames
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
    for (const k of ["cfg", "lay", "na", "ext", "seed", "conc", "dec", "dur", "el", "band", "nu", "bw", "wt", "rob", "sky", "size", "field", "uvv", "bstr", "dimg"]) if (S[k] !== D[k] && S[k] !== null) out.push("r." + k + "=" + encodeURIComponent(S[k]));
    // (runs written as ranges: a site of 1,024 feeds switched off is "0-1023")
    if (S.off.length) { const t = []; for (let i = 0; i < S.off.length;) { let j = i; while (j + 1 < S.off.length && S.off[j + 1] === S.off[j] + 1) j++; t.push(j > i ? S.off[i] + "-" + S.off[j] : String(S.off[i])); i = j + 1; } out.push("r.off=" + t.join(".")); }
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
    num("dec", -90, 90); num("dur", 0, 24); num("el", 0, 90); num("nu", 0, 2000); num("bw", 0, 100); num("rob", -2, 2); num("size", 1e-6, 1e5); num("field", 1e-6, 1e5);
    if (["natural", "robust", "uniform"].includes(kv["r.wt"])) S.wt = kv["r.wt"];
    if (SKIES.some(q => q[0] === kv["r.sky"])) S.sky = kv["r.sky"];
    if (kv["r.uvv"] === "amp" || kv["r.uvv"] === "uv") S.uvv = kv["r.uvv"];
    if (kv["r.bstr"] === "lin" || kv["r.bstr"] === "log") S.bstr = kv["r.bstr"];
    if (kv["r.dimg"] === "dirty" || kv["r.dimg"] === "smooth") S.dimg = kv["r.dimg"];
    const N = pads().ants.length;
    if (kv["r.off"]) S.off = [...new Set(kv["r.off"].split(".").flatMap(t => { const [x, y] = t.split("-").map(Number); return y === undefined ? [x] : Number.isInteger(x) && Number.isInteger(y) && y >= x && y - x < N ? Array.from({ length: y - x + 1 }, (_, k) => x + k) : []; }).filter(k => Number.isInteger(k) && k >= 0 && k < N))].sort((x, y) => x - y);
    if (kv["r.mv"]) for (const t of kv["r.mv"].split("_")) { const [k, e, n] = t.split(":").map(Number); if (Number.isInteger(k) && k >= 0 && k < N && isFinite(e) && isFinite(n)) S.mv[k] = [e, n]; }
    alview.fit = true;
  },
  redraw: () => { if (cur) { drawArray(cur); drawPanel(cur); } },
  test: { state: () => clone(S), result: () => cur && { smooth: !!cur.smooth, on: cur.on, staUp: cur.staUp, nSites: cur.nSites, reach: cur.reach, dur: cur.dur, nb: cur.nb, n: cur.S && cur.S.n, beam: cur.beam && { ...cur.beam }, side: cur.side, pb: cur.pb, drop: cur.drop, up: cur.up, ext: cur.ext, Bmax: cur.Bmax, Bmin: cur.Bmin, cell: cur.cell, step: cur.step, nCh: cur.nCh, gridN: cur.n, loading: !!cur.loading, imgLevel: cur.imgLevel, nus: cur.full && cur.full.nus && [Math.min(...cur.full.nus), Math.max(...cur.full.nus)], K: cur.nbUsed, shadow: cur.shadow }, geom: () => geom && { ...geom }, set: o => { stopPlay(); Object.assign(S, o); draw(false); H.scheduleHash(); }, playing: () => !!play, adding: () => aplay && { ...aplay },
    antXY: k => { const xy = antScreen(cur.ants)[k], r = $("cvA").getBoundingClientRect(); return [r.left + xy[0], r.top + xy[1]]; },
    // the globe's site labels: name, stations, stations on, and the label's center on the page
    sites: () => { const r = $("cvA").getBoundingClientRect(); return glabels.map(L => ({ name: L.q.name, n: L.q.k.length, on: L.q.on, x: r.left + (L.x0 + L.x1) / 2, y: r.top + (L.y0 + L.y1) / 2 })); },
    view: () => ({ lat: alview.lat, lon: alview.lon }) },
};
};
})();
