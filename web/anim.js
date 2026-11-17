/* Light pulses along the rays of a layout drawing (window.ANIM).  A canvas laid over the drawing carries short
   pulses that travel along the drawn rays, from where the light enters to the detector, on a loop; the drawing
   underneath is not redrawn.  After each redraw a drawing hands over its rays (set) as polylines in canvas pixels,
   each vertex with its distance along the ray in the drawing's own units (mm; canvas pixels where none is given),
   so the pulses of a bundle keep together at one speed.  A ray that starts where an earlier ray ends carries on
   from the earlier ray's distance (the spectrograph's white light, then each wavelength after the grating).
   One switch for the page: a button in each layout panel. */
(function () {
"use strict";
const TRIP = 3.2;        // seconds for a pulse to cross the longest ray
const GAP = TRIP;        // seconds between launches: the next set leaves as the last set reaches the detector
const TAIL = 90;         // the length of a pulse in pixels
const JOIN = 1.5;        // pixels: a ray starting this close to an earlier ray's end carries on from that ray
const PIECES = 24;       // a pulse drawn as short pieces, fading toward the tail
const WIDTH = 2.2, PEAK = 0.85;   // the pulse's line width (pixels) and its opacity at the head
// the glow around the pulse (two wide, faint strokes in its color) and the bright core along its front
const GLOW = [[10, 0.06], [5.5, 0.12]], CORE = 0.9, CORE_FROM = 0.55, CORE_PEAK = 0.85;
const views = [];        // one per layout canvas: { cv, ov, rays, smax }
let on = false, raf = 0, t0 = 0;

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
    v = { cv, ov, rays: [], smax: 0 };
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
// s0: the distance where the ray starts (optional), c: [r, g, b] or a CSS rgb()/rgba() color }]
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
    rays.push({ p: r.p, s: S, c: parse(r.c), k: (S[S.length - 1] - S[0]) / (px[px.length - 1] || 1) });
  }
  v.rays = rays;
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
const stroke = (g, pts) => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); };

function frame(now) {
  raf = 0;
  if (!on) return;
  const t = Math.max(0, now / 1000 - t0), dpr = window.devicePixelRatio || 1;
  let live = false;
  for (const v of views) {
    const g = v.ov.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, v.ov.width, v.ov.height);
    if (!v.cv.offsetParent || !v.rays.length || !(v.smax > 0)) continue;
    live = true;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineCap = "butt"; g.lineJoin = "round"; g.lineWidth = WIDTH;
    const speed = v.smax / TRIP, n = Math.floor(t / GAP);
    for (const r of v.rays) {
      const s0 = r.s[0], s1 = r.s[r.s.length - 1], tail = TAIL * r.k, rgb = r.c.map(x => x | 0).join(",");
      // the pulses launched so far (the k-th at time k GAP), each with its head at distance d
      for (let k = n; k >= 0; k--) {
        const d = (t - k * GAP) * speed;
        if (d - tail > s1) break;
        if (d < s0) continue;
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
  if (live) raf = requestAnimationFrame(frame);
}
function kick() { if (on && !raf) raf = requestAnimationFrame(frame); }

// ---- the switch: a play button in each layout panel (above the Expand button where the panel has one)
const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ICON_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13M15.5 5.5v13"/></svg>';
const buttons = [];
function sync() {
  for (const b of buttons) {
    b.innerHTML = on ? ICON_STOP : ICON_PLAY;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.setAttribute("aria-label", on ? "Stop the light pulses" : "Animate the light");
    b.title = on ? "Stop the light pulses." : "Animate the light: pulses travel along the rays to the detector. Click again to stop.";
  }
}
function toggle(state = !on) {
  on = !!state;
  if (on) { t0 = performance.now() / 1000; for (const v of views) place(v); kick(); }
  else {
    cancelAnimationFrame(raf); raf = 0;
    for (const v of views) v.ov.getContext("2d").clearRect(0, 0, v.ov.width, v.ov.height);
  }
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
  }
  sync();
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addButtons); else addButtons();
}

const API = { set, toggle, get on() { return on; }, lengths };
if (typeof window !== "undefined") window.ANIM = API;
})();
