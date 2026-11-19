/* Light pulses along the rays of a layout drawing (window.ANIM).  A canvas laid over the drawing carries short
   pulses that travel along the drawn rays, from where the light enters to the detector, on a loop; the drawing
   underneath is not redrawn.  After each redraw a drawing hands over its rays (set) as polylines in canvas pixels,
   each vertex with its distance along the ray in the drawing's own units (mm; canvas pixels where none is given),
   so the pulses of a bundle keep together at one speed.  A ray that starts where an earlier ray ends carries on
   from the earlier ray's distance (the spectrograph's white light, then each wavelength after the grating).
   The drawings now hand over wavefront rays (trail: false), and the light runs as a train of wavefronts with no
   pulses along the rays: in 2D lines through the heads of a group of rays, in 3D faint surfaces through the heads
   of a grid of rays across the pupil (the pulse code below is kept for a drawing that asks for pulses).  A drawing
   may ask for single fronts instead (the Telescopes view): one front per pass, launched as the last one arrives.
   One switch for the page: a button in each layout panel. */
(function () {
"use strict";
const TRIP = 4.8;        // seconds for a pulse or a single front to cross the longest ray (the next leaves as it arrives)
const TAIL = 90;         // the length of a pulse in pixels
const JOIN = 1.5;        // pixels: a ray starting this close to an earlier ray's end carries on from that ray
const PIECES = 24;       // a pulse drawn as short pieces, fading toward the tail
const WIDTH = 2.2, PEAK = 0.85;   // the pulse's line width (pixels) and its opacity at the head
// the glow around the pulse (two wide, faint strokes in its color) and the bright core along its front
const GLOW = [[10, 0.06], [5.5, 0.12]], CORE = 0.9, CORE_FROM = 0.55, CORE_PEAK = 0.85;
// the wavefronts as a train: each bundle's fronts every lam of distance, TRAIN_N fronts along the longest path at
// the mean spacing, the spacing following the light's wavelength (TRAIN_SHORT to TRAIN_LONG of the mean, blue to red;
// white light and the field colors at the mean).  The train runs on continuously; from the moment the light is let
// in, its leading front runs from the entrance and the train fills the instrument within TRAIN_TRIP.  A front drawn as a
// line TRAIN_LW pixels wide at opacity TRAIN_LA; as a surface (3D), translucent at TRAIN_FILL, so that the fronts of
// a train behind one another build up and each stays apart from the next.
const TRAIN_N = 24, TRAIN_SHORT = 0.72, TRAIN_LONG = 1.28, TRAIN_LW = 1.3, TRAIN_LA = 0.85, TRAIN_FILL = 0.1;
const TRAIN_TRIP = 2 * TRIP;   // seconds for the train to cross the longest path (slower than a single front)
// single fronts (a drawing that asks for them): one front per pass, crossing the longest path in TRIP, the next
// launched as it arrives; a line FRONT_LW pixels wide at opacity FRONT_LA, a surface at FRONT_FILL
const FRONT_LW = 1.8, FRONT_LA = 0.9, FRONT_FILL = 0.24;
// a front's curvature drawn exaggerated, so that a curved front reads apart from a flat one: its sag (the depth of
// its middle behind or ahead of its rim, along the light's direction, per its half-width) drawn as
// CURVE_MAX tanh(CURVE_X sag / CURVE_MAX): about CURVE_X times the true sag where the front is nearly flat (a slow
// beam), saturating toward CURVE_MAX where it curves strongly (just off a fast primary), so it never folds over.  A
// flat front stays flat, the rim stays on the beam's edges, and a front still closes to a point at a focus.
const CURVE_X = 6, CURVE_MAX = 0.4;
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
// on: the pulses shown (playing, or paused with tHeld the moment they stopped at); scrubbing: the time slider held
// (the light held at tHeld while it is dragged)
let on = false, paused = false, scrubbing = false, tHeld = 0, raf = 0, t0 = 0;

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
    v = { cv, ov, rays: [], smax: 0, groups: new Map(), surfs: new Map(), bundles: new Map() };
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
// (optional: the rays of a group, in order across the pupil), row and col: the ray's place in a grid across the pupil
// (optional: the group's wavefront is then a surface; wrap: its columns go around, as rings do), trail: false for a
// ray that only carries a wavefront }]
// opts.single (optional): single fronts, not a train
// opts.gl (optional): a function drawing a moment's wavefront surfaces on the GPU, given [{ c: [r, g, b], quads:
// [corner points in the world, four per cell] }], returning a canvas of the overlay's size (the rays then carry w,
// their points in the world, vertex for vertex with p)
function set(cv, list, opts) {
  if (!cv || typeof document === "undefined") return;
  const v = viewOf(cv), rays = [];
  v.gl = (opts && opts.gl) || null;
  v.single = !!(opts && opts.single);
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
    rays.push({ p: r.p, s: S, c, per: tl === null ? WAVE_PER : WAVE_SHORT + tl * (WAVE_LONG - WAVE_SHORT), k: (S[S.length - 1] - S[0]) / (px[px.length - 1] || 1), trail: r.trail !== false, g: r.g, b: r.b, row: r.row, col: r.col, wrap: !!r.wrap, w: r.w || null, lt: tl });
  }
  v.rays = rays;
  // (wavefronts: the rays of a group, in order across the pupil, have their heads joined by a line; or, for the rays
  // of a grid, the heads are the corners of the cells of a surface)
  // (bundles: the rays whose fronts bend together, as one light bundle: b, or the group; the two sides of a bundle
  // around a central obstruction are one bundle)
  v.groups = new Map(); v.surfs = new Map(); v.bundles = new Map();
  rays.forEach((r, i) => {
    if (r.g == null) return;
    const bk = r.b != null ? r.b : r.g;
    if (!v.bundles.has(bk)) v.bundles.set(bk, []);
    v.bundles.get(bk).push(i);
    if (r.row == null) { if (!v.groups.has(r.g)) v.groups.set(r.g, []); v.groups.get(r.g).push(i); return; }
    let S = v.surfs.get(r.g);
    if (!S) v.surfs.set(r.g, S = { at: [], nr: 0, nc: 0, wrap: r.wrap, c: r.c, bk });
    (S.at[r.row] = S.at[r.row] || [])[r.col] = i;
    S.nr = Math.max(S.nr, r.row + 1); S.nc = Math.max(S.nc, r.col + 1);
  });
  v.smax = rays.reduce((m, q) => Math.max(m, q.s[q.s.length - 1]), 0);
  place(v);
  kick();
}

// ---- wavefronts square to the rays (Malus), for the drawings that show fronts.  A bundle's rays (each a polyline,
// 2D or 3D points in a space where the optics keep their angles: mm in the drawing, before any stretch), leg by
// leg: within a leg the front is square to the rays, a plane where they run parallel and a sphere about the point
// where they meet (or from which they spread) otherwise.  The drawings treat lenses, gratings and some mirrors as
// thin, so the drawn paths differ in optical length; each ray waits at the vertex that starts a leg for as long as
// the leg's front needs (the vertex repeated, its distance jumping), every ray at every vertex, so that the legs
// keep the same place in each ray's list.  a0: the distances the rays arrive with at their first vertex (from an
// earlier bundle), or null: the first leg then starts with distance 0 where the rays meet, or (a parallel bundle)
// on the plane through ref.  Returns { out: [{ p, s }] (the vertices, repeated at the waits, and their distances),
// arr: the distances at the rays' ends }.
function solveN(A, b) {
  const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (!(Math.abs(M[piv][c]) > 1e-10 * Math.max(1, Math.abs(M[0][0])))) return null;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function malus(rs, a0, ref) {
  const dim = rs[0][0].length, sub = (p, q) => p.map((v, i) => v - q[i]), dot = (p, q) => p.reduce((s, v, i) => s + v * q[i], 0);
  const out = rs.map((p, j) => ({ p: [p[0]], s: [a0 ? a0[j] : 0] })), arr = a0 ? a0.slice() : rs.map(() => 0);
  const nL = Math.max(...rs.map(p => p.length)) - 1;
  for (let L = 0; L < nL; L++) {
    const idx = [];
    rs.forEach((p, j) => { if (p.length > L + 1) idx.push(j); });
    if (!idx.length) break;
    const V = idx.map(j => rs[j][L]), U = idx.map(j => { const d = sub(rs[j][L + 1], rs[j][L]), l = Math.hypot(...d) || 1; return d.map(x => x / l); });
    let spread = 0;
    for (const u of U) { const c = dot(u, U[0]); spread = Math.max(spread, Math.hypot(...u.map((x, i) => x - c * U[0][i]))); }
    // tau: the distance along each ray to the point where the rays meet (negative where they spread from it); the
    // front holds s + tau fixed across the bundle.  A parallel bundle: tau = -(V - ref).u, the front a plane.
    let tau = null;
    if (spread > 1e-6) {
      // (the point nearest all the rays' lines, by least squares: sum (I - u u) F = sum (I - u u) V)
      const A = Array.from({ length: dim }, () => new Array(dim).fill(0)), b = new Array(dim).fill(0);
      U.forEach((u, k) => { for (let i = 0; i < dim; i++) for (let m = 0; m < dim; m++) { const e = (i === m ? 1 : 0) - u[i] * u[m]; A[i][m] += e; b[i] += e * V[k][m]; } });
      const F = solveN(A, b);
      if (F) tau = V.map((v, k) => dot(sub(F, v), U[k]));
    }
    if (!tau) { const R = ref || V[0]; tau = V.map(v => -dot(sub(v, R), U[0])); }
    // C: the least that keeps every wait >= 0 within a bundle (the delays of a lens or a mirror the trace treats as
    // thin, which are the light's own).  A bundle that starts where an earlier one ends (a0: each wavelength leaving
    // a grating, an echelle or a prism's last face) is hinged about the middle of the beam instead: half the beam
    // leaves a little early, half a little late.  (A grating does not hold the light: it shifts the phase by one
    // wavelength per groove, so its outgoing front is pieced together from successive incoming ones.  With one front
    // drawn, waits >= 0 would heap the light on the grating until the last of the beam arrived.)
    const first = !L && !a0, hinge = !L && a0, at = idx.map((j, k) => arr[j] + tau[k]);
    const C = first ? 0 : hinge ? (Math.max(...at) + Math.min(...at)) / 2 : Math.max(...at);
    idx.forEach((j, k) => {
      const sj = C - tau[k], o = out[j], Lg = Math.hypot(...sub(rs[j][L + 1], rs[j][L]));
      if (first) o.s[0] = sj;
      else { if (hinge) o.s[0] = Math.min(o.s[0], sj); o.p.push(rs[j][L]); o.s.push(sj); }
      o.p.push(rs[j][L + 1]); o.s.push(sj + Lg); arr[j] = sj + Lg;
    });
  }
  return { out, arr };
}
// (the distances of a drawing's front rays made positive: the earliest start at zero)
function fromZero(list) {
  const m = Math.min(...list.map(r => r.s[0]));
  for (const r of list) { r.s = r.s.map(x => x - m); r.s0 = r.s[0]; }
  return list;
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
  const A = r.w && r.w[i - 1], B = r.w && r.w[i];
  return { p: [P[0] + u * (Q[0] - P[0]), P[1] + u * (Q[1] - P[1])], i, w: A ? A.map((x, k) => x + u * (B[k] - x)) : null };
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
// a bundle's heads at one moment, the front's curvature exaggerated (CURVE_X) in the space key ("p": the screen,
// "w": the world): leg by leg (heads waiting at an element left as they are), the heads moved along the leg's mean
// direction, in proportion to their depth behind the rim
function bend(hs, key) {
  const byLeg = new Map();
  for (const h of hs) {
    const P = h.r[key];
    if (!P || !h[key]) continue;
    const A = P[h.i - 1], B = P[h.i], d = B.map((x, k) => x - A[k]), l = Math.hypot(...d);
    if (!(l > 1e-9)) continue;
    h.u = d.map(x => x / l);
    if (!byLeg.has(h.i)) byLeg.set(h.i, []);
    byLeg.get(h.i).push(h);
  }
  for (const L of byLeg.values()) {
    if (L.length < 3) continue;
    const dim = L[0][key].length, um = new Array(dim).fill(0), c = new Array(dim).fill(0);
    for (const h of L) for (let k = 0; k < dim; k++) { um[k] += h.u[k]; c[k] += h[key][k] / L.length; }
    const lu = Math.hypot(...um);
    if (!(lu > 0)) continue;
    for (let k = 0; k < dim; k++) um[k] /= lu;
    let a = 0, lo = Infinity, hi = -Infinity, dRim = 0;
    for (const h of L) {
      const e = h[key].map((x, k) => x - c[k]), dl = e.reduce((acc, x, k) => acc + x * um[k], 0), pr = Math.hypot(...e.map((x, k) => x - dl * um[k]));
      h.dl = dl;
      if (pr > a) { a = pr; dRim = dl; }
      lo = Math.min(lo, dl); hi = Math.max(hi, dl);
    }
    const sag = a > 1e-9 ? (hi - lo) / a : 0;
    if (!(sag > 1e-6)) continue;
    const kx = CURVE_MAX * Math.tanh(CURVE_X * sag / CURVE_MAX) / sag;
    for (const h of L) h[key] = h[key].map((x, k) => x + (kx - 1) * (h.dl - dRim) * um[k]);
  }
}
// a ray's heads at the distances ds (ascending), in one sweep along the ray (null where the ray has not started or
// has ended)
function headsAlong(r, ds) {
  const n = r.s.length, out = new Array(ds.length).fill(null);
  let i = 1;
  for (let m = 0; m < ds.length; m++) {
    const d = ds[m];
    if (d < r.s[0] || d > r.s[n - 1]) continue;
    while (i < n - 1 && r.s[i] < d) i++;
    const a = r.s[i - 1], b = r.s[i], u = b > a ? (d - a) / (b - a) : 0, P = r.p[i - 1], Q = r.p[i];
    const A = r.w && r.w[i - 1], B = r.w && r.w[i];
    out[m] = { p: [P[0] + u * (Q[0] - P[0]), P[1] + u * (Q[1] - P[1])], i, w: A ? A.map((x, k) => x + u * (B[k] - x)) : null, r };
  }
  return out;
}
// a view's wave train at one moment, the light's leading front at distance lead: for each bundle the fronts'
// distances (ds, ascending: lead, lead - lam, ... within the bundle's rays) and each ray's heads at them (H: ray
// index -> heads), each front's heads bent together (bend)
function trainOf(v, lead) {
  const out = new Map(), mean = v.smax / TRAIN_N;
  for (const [bk, idx] of v.bundles) {
    // (single fronts: one per pass of the longest path)
    const r0 = v.rays[idx[0]], lam = v.single ? v.smax : mean * (r0.lt == null ? 1 : TRAIN_SHORT + r0.lt * (TRAIN_LONG - TRAIN_SHORT));
    let lo = Infinity, hi = -Infinity;
    for (const i of idx) { const r = v.rays[i]; lo = Math.min(lo, r.s[0]); hi = Math.max(hi, r.s[r.s.length - 1]); }
    hi = Math.min(hi, lead);
    const ds = [];
    for (let d = lead - Math.floor((lead - lo) / lam) * lam; d <= hi + 1e-9; d += lam) ds.push(d);
    const H = new Map();
    for (const i of idx) H.set(i, headsAlong(v.rays[i], ds));
    for (let m = 0; m < ds.length; m++) {
      const hs = [];
      for (const i of idx) { const h = H.get(i)[m]; if (h) hs.push(h); }
      bend(hs, "p");
      if (hs.length && hs[0].w) bend(hs, "w");
    }
    out.set(bk, { ds, H });
  }
  return out;
}
// the time for a view's light to cross its longest path: a train runs slower than a single front
const periodOf = v => (v && v.single ? TRIP : TRAIN_TRIP);
const stroke = (g, pts) => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); };

function frame(now) {
  raf = 0;
  if (!on) return;
  // (paused: the pulses held where they stopped, drawn again only when the drawing under them changes or the time
  // slider moves)
  const hold = paused || scrubbing, t = hold ? tHeld : Math.max(0, now / 1000 - t0), dpr = window.devicePixelRatio || 1;
  if (!scrubbing) sliders.forEach((sl, i) => { const val = Math.round(phaseOf(t, periodOf(viewOf(sliderCvs[i]))) * SCALE); if (+sl.value !== val) sl.value = val; });
  let live = false;
  for (const v of views) {
    const g = v.ov.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, v.ov.width, v.ov.height);
    if (!v.cv.offsetParent || !v.rays.length || !(v.smax > 0)) continue;
    live = true;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineCap = "butt"; g.lineJoin = "round"; g.lineWidth = WIDTH;
    const P = periodOf(v), speed = v.smax / P, n = Math.floor(t / P);
    const FILL = v.single ? FRONT_FILL : TRAIN_FILL;
    const TR = v.groups.size || v.surfs.size ? trainOf(v, t * speed) : null;
    // the wavefronts as surfaces: for each front of the train, the cells of the grid whose four corners lie on one leg
    // of the path, filled in one path per front (each cell wound the same way on the screen, so where the front folds
    // over itself the cells fill once), translucent.  (A drawing with a GPU (v.gl) is handed the cells' corners in the
    // world instead and draws them itself, hidden behind its solid parts.)
    if (v.surfs.size) {
      const glf = v.gl ? [] : null;
      for (const S of v.surfs.values()) {
        const B = TR.get(S.bk);
        if (!B) continue;
        g.fillStyle = `rgba(${S.c.map(x => x | 0).join(",")},${FILL})`;
        for (let m = 0; m < B.ds.length; m++) {
          const H = S.at.map(row => row.map(i => B.H.get(i)[m])), quads = [];
          let cells = 0;
          if (!glf) g.beginPath();
          for (let a = 0; a + 1 < S.nr; a++) for (let b = 0; b < S.nc; b++) {
            const b2 = b + 1 < S.nc ? b + 1 : S.wrap ? 0 : -1;
            if (b2 < 0) continue;
            const q = [H[a][b], H[a][b2], H[a + 1][b2], H[a + 1][b]];
            if (q.some(h => !h || h.i !== q[0].i)) continue;
            if (glf) { if (q.every(h => h.w)) quads.push(q[0].w, q[1].w, q[2].w, q[3].w); continue; }
            let ar = 0;
            for (let k = 0; k < 4; k++) { const P = q[k].p, Q = q[(k + 1) % 4].p; ar += P[0] * Q[1] - Q[0] * P[1]; }
            const o = ar < 0 ? [3, 2, 1, 0] : [0, 1, 2, 3];
            g.moveTo(q[o[0]].p[0], q[o[0]].p[1]);
            for (let k = 1; k < 4; k++) g.lineTo(q[o[k]].p[0], q[o[k]].p[1]);
            g.closePath(); cells++;
          }
          if (glf && quads.length) glf.push({ c: S.c, quads });
          if (cells) g.fill("nonzero");
        }
      }
      const img = glf && glf.length ? v.gl(glf, FILL) : null;
      if (img) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(img, 0, 0, v.ov.width, v.ov.height); g.restore(); }
    }
    // the wavefronts as lines: for each front of the train, a line through the heads of a group's rays, broken where
    // neighboring heads lie on different legs of the path (one reflected, the other not yet); a group's fronts
    // stroked as one path
    for (const idx of v.groups.values()) {
      const r0 = v.rays[idx[0]], B = TR.get(r0.b != null ? r0.b : r0.g);
      if (!B) continue;
      g.beginPath();
      for (let m = 0; m < B.ds.length; m++) {
        let prev = null;
        for (const i of idx) {
          const h = B.H.get(i)[m];
          if (h && prev && prev.i === h.i) g.lineTo(h.p[0], h.p[1]);
          else if (h) g.moveTo(h.p[0], h.p[1]);
          prev = h;
        }
      }
      g.lineWidth = v.single ? FRONT_LW : TRAIN_LW; g.strokeStyle = `rgba(${r0.c.map(x => x | 0).join(",")},${v.single ? FRONT_LA : TRAIN_LA})`; g.stroke();
    }
    for (const r of v.rays) {
      if (!r.trail) continue;
      const s0 = r.s[0], s1 = r.s[r.s.length - 1], tail = STYLE === "wave" ? WAVE_FRAC * WAVE_X * v.smax : TAIL * r.k, rgb = r.c.map(x => x | 0).join(",");
      // the pulses launched so far (the k-th at time k P), each with its head at distance d
      for (let k = n; k >= 0; k--) {
        const d = (t - k * P) * speed;
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
  if (!hold) raf = requestAnimationFrame(frame);
}
function kick() { if (on && !raf) raf = requestAnimationFrame(frame); }

// ---- the switches, in each layout panel's lower right: the play button (above the Expand button where the panel has
// one) and, above that, the drawn light shown or hidden (the drawings ask ANIM.rays and redraw through onRays)
const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ICON_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13M15.5 5.5v13"/></svg>';
const ICON_RAYS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12L20 5M3 12h17M3 12l17 7"/></svg>';
const ICON_NORAYS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12L20 5M3 12h17M3 12l17 7" opacity="0.35"/><path d="M5 21L19 3"/></svg>';
const buttons = [], rayButtons = [], redraws = [], sliders = [], sliderBoxes = [], sliderCvs = [];
let rays = true;
// ---- the time slider, in the bottom row of the panel's buttons while the light is shown: one pass of the light, from where it enters
// (left) to the detector (right).  Dragging it moves the light forward or back; the light holds while the slider is
// held, then plays on from there (or stays paused).
const SCALE = 1000;
// (P: the panel's time for the light to cross its longest path)
const phaseOf = (t, P) => (t % P) / P;
function seek(ph, cv) {
  const now = performance.now() / 1000, hold = paused || scrubbing, cur = hold ? tHeld : Math.max(0, now - t0);
  const P = cv ? periodOf(viewOf(cv)) : TRAIN_TRIP;
  // (within the current pass, and never the first, so that the light of the pass before is still on its way)
  const T = (Math.max(1, Math.floor(cur / P)) + Math.min(Math.max(ph, 0), 0.9999)) * P;
  if (hold) tHeld = T; else t0 = now - T;
  kick();
}
function scrubStart() {
  if (!on || scrubbing) return;
  if (!paused) { tHeld = Math.max(0, performance.now() / 1000 - t0); cancelAnimationFrame(raf); raf = 0; }
  scrubbing = true;
}
function scrubEnd() {
  if (!scrubbing) return;
  scrubbing = false;
  if (!paused) t0 = performance.now() / 1000 - tHeld;
  kick();
}
function sync() {
  const playing = on && !paused;
  for (const bx of sliderBoxes) bx.hidden = !on;
  for (const b of buttons) {
    b.innerHTML = playing ? ICON_STOP : ICON_PLAY;
    b.setAttribute("aria-pressed", playing ? "true" : "false");
    b.setAttribute("aria-label", playing ? "Pause the wavefronts" : paused ? "Resume the wavefronts" : "Animate the light as wavefronts");
    b.title = playing ? "Pause the wavefronts." : paused ? "Resume the wavefronts." : "Animate the light as wavefronts traveling from the entrance to the detector. Click again to pause.";
  }
  for (const b of rayButtons) {
    b.innerHTML = rays ? ICON_RAYS : ICON_NORAYS;
    b.setAttribute("aria-pressed", rays ? "false" : "true");
    b.setAttribute("aria-label", rays ? "Hide the drawn rays" : "Show the drawn rays");
    b.title = rays ? "Hide the drawn rays and light cones (the animation still runs)." : "Show the drawn rays and light cones again.";
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
    const bx = document.createElement("div");
    bx.className = "lvx lvt";
    bx.title = "Move the wavefronts forward or backward in time. The slider spans the time the light takes to travel from the entrance to the detector.";
    const sl = document.createElement("input");
    sl.type = "range"; sl.min = "0"; sl.max = String(SCALE); sl.step = "1"; sl.value = "0";
    sl.setAttribute("aria-label", "The wavefronts' moment in time");
    sl.addEventListener("pointerdown", scrubStart);
    sl.addEventListener("input", () => seek(+sl.value / SCALE, cv));
    sl.addEventListener("change", scrubEnd);
    bx.appendChild(sl);
    cv.parentElement.appendChild(bx);
    sliders.push(sl); sliderBoxes.push(bx); sliderCvs.push(cv);
  }
  window.addEventListener("pointerup", scrubEnd);
  window.addEventListener("pointercancel", scrubEnd);
  sync();
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addButtons); else addButtons();
}

const API = { set, toggle, reset, seek, malus, fromZero, get on() { return on; }, get paused() { return paused; }, lengths, toggleRays, onRays, get rays() { return rays; } };
if (typeof window !== "undefined") window.ANIM = API;
})();
