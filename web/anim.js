/* Light pulses along the rays of a layout drawing (window.ANIM).  A canvas laid over the drawing carries short
   pulses that travel along the drawn rays, from where the light enters to the detector, on a loop; the drawing
   underneath is not redrawn.  After each redraw a drawing hands over its rays (set) as polylines in canvas pixels,
   each vertex with its distance along the ray in the drawing's own units (mm; canvas pixels where none is given),
   so the pulses of a bundle keep together at one speed.  A ray that starts where an earlier ray ends carries on
   from the earlier ray's distance (the spectrograph's white light, then each wavelength after the grating).
   One switch for the page: a button in each layout panel. */
(function () {
"use strict";
const TRIP = 4.8;        // seconds for a pulse to cross the longest ray
const GAP = TRIP;        // seconds between launches: the next set leaves as the last set reaches the detector
const TAIL = 90;         // the length of a pulse in pixels
const JOIN = 1.5;        // pixels: a ray starting this close to an earlier ray's end carries on from that ray
const PIECES = 24;       // a pulse drawn as short pieces, fading toward the tail
const WIDTH = 2.2, PEAK = 0.85;   // the pulse's line width (pixels) and its opacity at the head
// the glow around the pulse (two wide, faint strokes in its color) and the bright core along its front
const GLOW = [[10, 0.06], [5.5, 0.12]], CORE = 0.9, CORE_FROM = 0.55, CORE_PEAK = 0.85;
const FRONT = 1.8;       // a wavefront's line width (pixels)
// a pulse as a little wave (the default; ?pulse=comet in the address for the fading streak): a few cycles of a sine
// across the ray, at full height over its leading part and fading over the trail behind (u = 0 at the tail, 1 at the
// head; the opacity follows the height), one on each ray.
const STYLE = typeof location !== "undefined" && /[?&]pulse=comet/.test(location.search) ? "comet" : "wave";
const WAVE_LEN = 66, WAVE_PER = 9.5, WAVE_AMP = 3.6, WAVE_LW = 1.6, WAVE_PEAK = 0.95, WAVE_STEP = 1.1;  // pixels
// (the wave belongs to the drawing: its length is WAVE_FRAC of the longest light path, whatever the zoom, and the
// spacing and the height scale with it; the pixel sizes above are those of a wave WAVE_LEN pixels long)
const WAVE_FRAC = 0.06;
const WAVE_X = 1.6;      // the wave's length, with its trail, in units of that WAVE_LEN-pixel wave
const WAVE_FADE = 0.84;                             // the share of the wave, from the tail, over which it fades in
const env = u => (u >= WAVE_FADE ? 1 : (1 - Math.cos(Math.PI * u / WAVE_FADE)) / 2);
// The wiggle's spacing follows the wavelength: a ray in the drawings' wavelength colors (app.js's ramp, deep indigo
// for the shortest wavelength on the detector to orange-gold for the longest) gets WAVE_SHORT to WAVE_LONG pixels;
// white light and the field colors keep WAVE_PER.  And the wave oscillates: its crests run forward through the
// packet at WAVE_CREST pixels a second, so a crest passes a point WAVE_CREST / spacing times a second (the
// frequency, higher for shorter waves, as for light).
const WAVE_SHORT = 7, WAVE_LONG = 12, WAVE_CREST = 18;
const RAMP = [[38, 5, 145], [117, 1, 168], [182, 48, 139], [227, 104, 95], [252, 166, 54]];
// a color's place on the ramp (0 to 1), or null for a color off the ramp
function rampT(c) {
  let best = 1e9, t = null;
  for (let k = 0; k + 1 < RAMP.length; k++) {
    const A = RAMP[k], B = RAMP[k + 1], AB = B.map((v, i) => v - A[i]), AC = c.map((v, i) => v - A[i]);
    const u = Math.min(1, Math.max(0, AB.reduce((s, v, i) => s + v * AC[i], 0) / AB.reduce((s, v) => s + v * v, 0)));
    const dd = Math.hypot(...c.map((v, i) => v - (A[i] + u * AB[i])));
    if (dd < best) { best = dd; t = (k + u) / (RAMP.length - 1); }
  }
  return best < 6 ? t : null;
}
const views = [];        // one per layout canvas: { cv, ov, rays, smax }
// on: the pulses shown (playing, or paused with tHeld the moment they stopped at)
let on = false, paused = false, tHeld = 0, raf = 0, t0 = 0;

// white light (the drawings' gray rays) pulses in warm gold, the color of the starlight in the 3D view and of the
// telescope beam in the Spectrograph view
const WARM = [226, 160, 44];
const parse = c => {
  let rgb = [90, 90, 90];
  if (Array.isArray(c)) rgb = c;
  else { const m = /rgba?\(([^)]+)\)/.exec(String(c)); if (m) rgb = m[1].split(",").slice(0, 3).map(Number); }
  return Math.max(...rgb) - Math.min(...rgb) < 24 ? WARM : rgb;
};
// the distance along a polyline at each vertex (2D or 3D points)
const lengths = ps => {
  const s = [0];
  for (let i = 1; i < ps.length; i++) s.push(s[i - 1] + Math.hypot(...ps[i].map((v, k) => v - ps[i - 1][k])));
  return s;
};

function viewOf(cv) {
  let v = views.find(x => x.cv === cv);
  if (!v) {
    const ov = document.createElement("canvas");
    ov.className = "pulses"; ov.setAttribute("aria-hidden", "true");
    cv.parentElement.appendChild(ov);
    v = { cv, ov, rays: [], smax: 0, groups: new Map() };
    views.push(v);
    place(v);
  }
  return v;
}

// the overlay over its drawing, at the drawing's size
function place(v) {
  const { cv, ov } = v, dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
  ov.style.left = cv.offsetLeft + "px"; ov.style.top = cv.offsetTop + "px";
  ov.style.width = w + "px"; ov.style.height = h + "px";
  if (ov.width !== Math.round(w * dpr) || ov.height !== Math.round(h * dpr)) { ov.width = Math.round(w * dpr); ov.height = Math.round(h * dpr); }
}

// a drawing's rays after a redraw: [{ p: [[x, y], ...] canvas pixels, s: [distance at each vertex] (optional),
// s0: the distance where the ray starts (optional), c: [r, g, b] or a CSS rgb()/rgba() color, g: a wavefront group
// (optional: the rays of a group, in order across the pupil), trail: false for a ray that only carries a wavefront }]
function set(cv, list) {
  if (!cv || typeof document === "undefined") return;
  const v = viewOf(cv), rays = [];
  for (const r of list || []) {
    if (!r || !r.p || r.p.length < 2) continue;
    const s = r.s || lengths(r.p), a = r.p[0];
    // (s0: the distance at the ray's start, where the drawing knows it: a 3D drawing chains its rays in the world,
    // since rays apart in depth can meet on the screen)
    let s0 = r.s0;
    if (s0 == null) {
      s0 = 0;
      for (const q of rays) {
        const e = q.p[q.p.length - 1];
        if (Math.abs(e[0] - a[0]) < JOIN && Math.abs(e[1] - a[1]) < JOIN) { s0 = q.s[q.s.length - 1]; break; }
      }
    }
    const px = lengths(r.p), S = s.map(x => x - s[0] + s0);
    // (k: distance per pixel, so that a pulse keeps its length on the screen)
    // (t: the ray's place on the wavelength scale, where a drawing in other colors gives it: the All-arms view)
    const c = parse(r.c), tl = r.t != null ? Math.min(1, Math.max(0, r.t)) : rampT(c);
    rays.push({ p: r.p, s: S, c, per: tl === null ? WAVE_PER : WAVE_SHORT + tl * (WAVE_LONG - WAVE_SHORT), k: (S[S.length - 1] - S[0]) / (px[px.length - 1] || 1), trail: r.trail !== false, g: r.g });
  }
  v.rays = rays;
  // (wavefronts: the rays of a group, in order across the pupil, have their pulse heads joined by a line)
  v.groups = new Map();
  rays.forEach((r, i) => { if (r.g != null) { if (!v.groups.has(r.g)) v.groups.set(r.g, []); v.groups.get(r.g).push(i); } });
  v.smax = rays.reduce((m, q) => Math.max(m, q.s[q.s.length - 1]), 0);
  place(v);
  kick();
}

// the points of a ray between distances lo and hi
function span(r, lo, hi) {
  const at = s => {
    let i = 1;
    while (i < r.s.length - 1 && r.s[i] < s) i++;
    const a = r.s[i - 1], b = r.s[i], u = b > a ? (s - a) / (b - a) : 0, P = r.p[i - 1], Q = r.p[i];
    return [P[0] + u * (Q[0] - P[0]), P[1] + u * (Q[1] - P[1])];
  };
  const pts = [at(lo)];
  for (let i = 0; i < r.s.length; i++) if (r.s[i] > lo && r.s[i] < hi) pts.push(r.p[i]);
  pts.push(at(hi));
  return pts;
}
// a ray's head at distance d, with the leg of the path it is on (null before the ray starts or past its end)
function headAt(r, d) {
  const n = r.s.length;
  if (d < r.s[0] || d > r.s[n - 1]) return null;
  let i = 1;
  while (i < n - 1 && r.s[i] < d) i++;
  const a = r.s[i - 1], b = r.s[i], u = b > a ? (d - a) / (b - a) : 0, P = r.p[i - 1], Q = r.p[i];
  return { p: [P[0] + u * (Q[0] - P[0]), P[1] + u * (Q[1] - P[1])], i };
}
// a wave packet on ray r, its head at distance d: sampled every WAVE_STEP pixels along the ray, each sample moved
// across the ray (perpendicular to its leg on the screen) by the envelope times the sine; drawn as a glow and then a
// line, each in a few opacity steps (the consecutive pieces of one step stroked as one path)
function wavePacket(g, r, d, s0, s1, rgb, t, Ls) {
  const px = Ls / (r.k || 1), sc = px / (WAVE_LEN * WAVE_X), n = Math.max(8, Math.min(400, Math.round(px / WAVE_STEP))), pts = [];
  const ph = 2 * Math.PI * WAVE_CREST * t / r.per;   // (the crests' advance through the packet by time t)
  for (let j = 0; j <= n; j++) {
    const u = j / n, s = d - (1 - u) * Ls, h = s >= s0 && s <= s1 ? headAt(r, s) : null;
    if (!h) { pts.push(null); continue; }
    const P = r.p[h.i - 1], Q = r.p[h.i], dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy) || 1;
    const e = env(u), off = WAVE_AMP * sc * e * Math.sin(2 * Math.PI * u * WAVE_LEN * WAVE_X / r.per - ph);
    pts.push({ x: h.p[0] - dy / L * off, y: h.p[1] + dx / L * off, e });
  }
  const LEVELS = 10;
  for (const [lw, peak] of [[WAVE_LW, WAVE_PEAK]]) {
    g.lineWidth = lw;
    for (let lev = 1; lev <= LEVELS; lev++) {
      let open = false;
      g.beginPath();
      for (let j = 0; j < n; j++) {
        const a = pts[j], b = pts[j + 1];
        if (!a || !b || Math.round((a.e + b.e) / 2 * LEVELS) !== lev) { open = false; continue; }
        if (!open) { g.moveTo(a.x, a.y); open = true; }
        g.lineTo(b.x, b.y);
      }
      g.strokeStyle = `rgba(${rgb},${(peak * lev / LEVELS).toFixed(3)})`; g.stroke();
    }
  }
}
const stroke = (g, pts) => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); };

function frame(now) {
  raf = 0;
  if (!on) return;
  // (paused: the pulses held where they stopped, drawn again only when the drawing under them changes)
  const t = paused ? tHeld : Math.max(0, now / 1000 - t0), dpr = window.devicePixelRatio || 1;
  let live = false;
  for (const v of views) {
    const g = v.ov.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, v.ov.width, v.ov.height);
    if (!v.cv.offsetParent || !v.rays.length || !(v.smax > 0)) continue;
    live = true;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineCap = "butt"; g.lineJoin = "round"; g.lineWidth = WIDTH;
    const speed = v.smax / TRIP, n = Math.floor(t / GAP);
    // the wavefronts: at each pulse's moment, a line through the heads of a group's rays, broken where neighboring
    // heads lie on different legs of the path (one reflected, the other not yet)
    for (const idx of v.groups.values()) {
      const rgb = v.rays[idx[0]].c.map(x => x | 0).join(",");
      for (let k = n; k >= 0; k--) {
        const d = (t - k * GAP) * speed;
        if (d > v.smax) break;
        const heads = idx.map(i => headAt(v.rays[i], d));
        const runs = [];
        let cur = [];
        heads.forEach((h, j) => {
          if (h && cur.length && heads[j - 1] && heads[j - 1].i === h.i) cur.push(h.p);
          else { if (cur.length > 1) runs.push(cur); cur = h ? [h.p] : []; }
        });
        if (cur.length > 1) runs.push(cur);
        for (const [lw, al] of GLOW) { g.lineWidth = lw; g.strokeStyle = `rgba(${rgb},${al * 1.5})`; for (const pts of runs) stroke(g, pts); }
        g.lineWidth = FRONT; g.strokeStyle = `rgba(${rgb},0.9)`;
        for (const pts of runs) stroke(g, pts);
      }
    }
    for (const r of v.rays) {
      if (!r.trail) continue;
      const s0 = r.s[0], s1 = r.s[r.s.length - 1], tail = STYLE === "wave" ? WAVE_FRAC * WAVE_X * v.smax : TAIL * r.k, rgb = r.c.map(x => x | 0).join(",");
      // the pulses launched so far (the k-th at time k GAP), each with its head at distance d
      for (let k = n; k >= 0; k--) {
        const d = (t - k * GAP) * speed;
        if (d - tail > s1) break;
        if (d < s0) continue;
        if (STYLE === "wave") { wavePacket(g, r, d, s0, s1, rgb, t, tail); continue; }
        const lo = Math.max(s0, d - tail), hi = Math.min(s1, d);
        if (hi <= lo) continue;
        // a line in the ray's color, fading from the head to nothing at the tail, in a soft glow of the same color,
        // with a bright core along its front (each layer drawn whole before the next, so the pieces do not overlap)
        const pieces = [];
        for (let j = 0; j < PIECES; j++) {
          const a = Math.max(lo, d - tail * (1 - j / PIECES)), b = Math.min(hi, d - tail * (1 - (j + 1) / PIECES));
          if (b > a) pieces.push({ f: (j + 1) / PIECES, pts: span(r, a, b) });
        }
        for (const [lw, al] of GLOW) {
          g.lineWidth = lw;
          for (const pc of pieces) { g.strokeStyle = `rgba(${rgb},${(al * pc.f * pc.f).toFixed(3)})`; stroke(g, pc.pts); }
        }
        g.lineWidth = WIDTH;
        for (const pc of pieces) { g.strokeStyle = `rgba(${rgb},${(PEAK * pc.f * pc.f).toFixed(3)})`; stroke(g, pc.pts); }
        g.lineWidth = CORE;
        for (const pc of pieces) if (pc.f > CORE_FROM) {
          g.strokeStyle = `rgba(255,255,255,${(CORE_PEAK * (pc.f - CORE_FROM) / (1 - CORE_FROM)).toFixed(3)})`; stroke(g, pc.pts);
        }
      }
    }
  }
  // no drawing on the page with rays to run along (a new view without them: the All-arms layout, the Interferometer,
  // a design that fails): the pulses are switched off and cleared, not left holding
  if (!live) { reset(); return; }
  if (!paused) raf = requestAnimationFrame(frame);
}
function kick() { if (on && !raf) raf = requestAnimationFrame(frame); }

// ---- the switches, in each layout panel's lower right: the play button (above the Expand button where the panel has
// one) and, above that, the drawn light shown or hidden (the drawings ask ANIM.rays and redraw through onRays)
const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ICON_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13M15.5 5.5v13"/></svg>';
const ICON_RAYS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12L20 5M3 12h17M3 12l17 7"/></svg>';
const ICON_NORAYS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12L20 5M3 12h17M3 12l17 7" opacity="0.35"/><path d="M5 21L19 3"/></svg>';
const buttons = [], rayButtons = [], redraws = [];
let rays = true;
function sync() {
  const playing = on && !paused;
  for (const b of buttons) {
    b.innerHTML = playing ? ICON_STOP : ICON_PLAY;
    b.setAttribute("aria-pressed", playing ? "true" : "false");
    b.setAttribute("aria-label", playing ? "Pause the light pulses" : paused ? "Resume the light pulses" : "Animate the light");
    b.title = playing ? "Pause the light pulses." : paused ? "Resume the light pulses." : "Animate the light: pulses travel along the rays to the detector. Click again to pause.";
  }
  for (const b of rayButtons) {
    b.innerHTML = rays ? ICON_RAYS : ICON_NORAYS;
    b.setAttribute("aria-pressed", rays ? "false" : "true");
    b.setAttribute("aria-label", rays ? "Hide the drawn rays" : "Show the drawn rays");
    b.title = rays ? "Hide the drawn rays and light cones (the pulses still run)." : "Show the drawn rays and light cones again.";
  }
}
function toggleRays(state = !rays) { rays = !!state; sync(); for (const f of redraws) f(); }
function onRays(fn) { redraws.push(fn); }
// the play button: off -> playing -> paused -> playing (resumed where it stopped) ...
function toggle() {
  const now = performance.now() / 1000;
  if (!on) { on = true; paused = false; t0 = now; for (const v of views) place(v); }
  else if (!paused) { paused = true; tHeld = Math.max(0, now - t0); cancelAnimationFrame(raf); raf = 0; }
  else { paused = false; t0 = now - tHeld; }
  kick();
  sync();
}
// off, the pulses cleared (a new telescope, instrument or mode starts without them)
function reset() {
  if (!on) return;
  on = false; paused = false;
  cancelAnimationFrame(raf); raf = 0;
  for (const v of views) v.ov.getContext("2d").clearRect(0, 0, v.ov.width, v.ov.height);
  sync();
}
function addButtons() {
  for (const id of ["cvL", "cvIL", "cvTL"]) {
    const cv = document.getElementById(id);
    if (!cv) continue;
    viewOf(cv);
    const b = document.createElement("button");
    b.type = "button"; b.className = "ghost lvx lvp" + (cv.parentElement.querySelector(".lvx") ? "" : " solo");
    b.addEventListener("click", () => toggle());
    cv.parentElement.appendChild(b);
    buttons.push(b);
    const br = document.createElement("button");
    br.type = "button"; br.className = b.className.replace("lvp", "lvr");
    br.addEventListener("click", () => toggleRays());
    cv.parentElement.appendChild(br);
    rayButtons.push(br);
  }
  sync();
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addButtons); else addButtons();
}

const API = { set, toggle, reset, get on() { return on; }, get paused() { return paused; }, lengths, toggleRays, onRays, get rays() { return rays; } };
if (typeof window !== "undefined") window.ANIM = API;
})();
