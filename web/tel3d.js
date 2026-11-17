/* The Telescopes mode's 3D view of the optical layout (window.TEL3D).  The telescope is laid out as the 2D drawing
   lays it out (imgapp.js layoutGeom: the same ray trace, folds and mirror sizes, in mm with x along the axis and
   the light arriving from -x), with a third axis added; the world stands the telescope up, the sky overhead.
   - The primary is tiled from the pupil (tpupil.js tiles: the hexagonal segments, the round mirrors, or one mirror),
     each outline lifted onto the paraboloid, with the mirror's central hole (opts.hole: the sourced hole, else the
     largest the telescope's foci need); pads sit on it.  A segmented secondary (GMT's) is tiled the same way.
   - The secondary's baffle (the central obstruction, where wider than the mirror) and the spider vanes and blocks
     lie just above the secondary or across the prime-focus unit, so the shadows in the Pupil panel and the spikes
     in the image have their source in view.
   - The light from the top, center and bottom of the field (the 2D drawing's three bundles) travels as translucent
     sheets swept by each bundle's outer edge, and the center bundle's inner edge (the obstruction's shadow); the
     incoming starlight as a few rays.  A ray at pupil point (px, py) is traced separately across the axis (with the
     field slope) and out of the page (ideal round optics: the two traces add).
   - Orthographic; turned by az about the vertical and el above the horizon (telapp.js holds the controls).
   Pupil coordinates map to the drawing's frame as y = px, z = -py, and the drawing's frame to the world as
   (y, -z, -x): the world's top view (from the sky) shows the pupil as the Pupil panel draws it. */
(function () {
"use strict";
const DEG = Math.PI / 180;
// world -> view rotation (rows: screen right, screen up, toward the viewer): az about the vertical, el above the horizon
const rotAzEl = (az, el) => { const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el); return [[ca, sa, 0], [-se * sa, se * ca, ce], [ce * sa, -ce * ca, se]]; };
const a3 = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]], s3 = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
const d3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2], n3 = v => s3(v, 1 / (Math.hypot(v[0], v[1], v[2]) || 1));
const W = p => [p[1], -p[2], -p[0]];                                   // the drawing's frame -> the world
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
// colors: polished aluminum (cool silver) or gold coatings, with a specular highlight; slate structure; glass
const PAL = {
  silver: [178, 190, 206], gold: [214, 168, 66], vane: [54, 60, 72], baffle: [72, 78, 90], unit: [84, 106, 136],
  glass: [150, 196, 232], focus: [24, 30, 46],
  // the field's top, center and bottom (brick, warm gold, teal: the brick-teal pair is colorblind-safe; the center
  // bundle is the only filled one)
  light: [[176, 74, 48], [222, 160, 48], [0, 137, 123]],
};
const edgeOf = rgb => rgba(rgb.map(c => c * 0.5), 0.75);
// a point in a polygon ([[x, y], ...]), by the crossing count
const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };

function build(Dz, P, G, pu, opts = {}) {
  const prims = [], labs = [], pulses = [], Dmm = Dz.Dmm;
  const face = (ps, rgb, al, stroke = null, lw = 1, spec = false) => prims.push({ k: "f", p: ps.map(W), rgb, al, stroke, lw, spec });
  const tube = (stations, rgb, al) => prims.push({ k: "t", st: stations.map(s => s.map(W)), rgb, al });
  const outline = (ps, stroke, lw = 1) => prims.push({ k: "o", p: ps.map(W), stroke, lw });
  const lab = (p, name) => labs.push({ p: W(p), name });
  const prim = G.elems.find(e => e.k === "primary"), sec = G.elems.find(e => e.k === "secondary");
  const MIR = opts.coating === "gold" ? PAL.gold : PAL.silver, MEDGE = edgeOf(MIR);
  // each segment a shade apart, as the segments of a real mirror catch the light
  const tint = i => { const r = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return MIR.map(c => c * (0.95 + 0.1 * (r - Math.floor(r)))); };
  const sag1 = G.sag1, lift = (px, py) => [-sag1(Math.hypot(px, py)), px, -py];     // a pupil point (mm) on the primary
  // a polygon (pupil mm) on a surface lift(): a fan of slices from its center (or from the edge of a hole around the
  // origin), fine enough to follow the curvature; or one face for a small tile
  const tilePoly = (pts, rgb, liftFn, hole, fine) => {
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
    const holed = hole > 0 && inPoly(pts, 0, 0);
    if (!fine && !holed) { face(pts.map(q => liftFn(q[0], q[1])), rgb, 0.95, MEDGE, 0.6, true); return; }
    const o = holed ? [0, 0] : [cx, cy], NJ = 4;
    for (let k = 0; k < pts.length; k++) {
      const q0 = pts[k], q1 = pts[(k + 1) % pts.length];
      const f0 = q => (holed ? Math.min(0.98, hole / Math.hypot(q[0], q[1])) : 0);
      for (let j = 0; j < NJ; j++) {
        const mix = (q, t) => { const a = f0(q) + (1 - f0(q)) * t; return [o[0] + (q[0] - o[0]) * a, o[1] + (q[1] - o[1]) * a]; };
        face([mix(q0, j / NJ), mix(q0, (j + 1) / NJ), mix(q1, (j + 1) / NJ), mix(q1, j / NJ)].map(q => liftFn(q[0], q[1])), rgb, 0.95, null, 1, true);
      }
    }
    outline(pts.map(q => liftFn(q[0], q[1])), MEDGE, 1);
    if (holed) outline(pts.map(q => { const a = Math.min(0.98, hole / Math.hypot(q[0], q[1])); return liftFn(q[0] * a, q[1] * a); }), MEDGE, 0.8);
  };
  // ---- the primary: tiles, or one mirror as a mesh of rings and sectors (an off-axis one centered on its section)
  const tiles = pu ? window.TP.tiles(pu) : null;
  const hole = prim && !prim.off ? (opts.hole > 0 ? opts.hole : prim.hole || 0) : 0;
  if (prim) {
    if (tiles && tiles.length) {
      const fine = tiles.length < 60;                                  // few large tiles: follow the curvature
      tiles.forEach((t, i) => tilePoly(t.map(([x, y]) => [x * 1000, y * 1000]), tint(i), lift, hole, fine && t.length > 6));
    } else if (P.tel === "refr") { /* the objective: a lens, below */ } else {
      // (the whole mirror where its size is known: an undersized secondary or a stop uses less of it than the light does)
      const off = G.off || 0, R = prim.off ? Dmm / 2 : Math.max(prim.hh, P.Dmirror ? P.Dmirror * 500 : 0), r0 = hole, NA = 48, NR = 5;
      for (let i = 0; i < NR; i++) for (let k = 0; k < NA; k++) {
        const ra = r0 + (R - r0) * i / NR, rb = r0 + (R - r0) * (i + 1) / NR, t0 = 2 * Math.PI * k / NA, t1 = 2 * Math.PI * (k + 1) / NA;
        face([[ra, t0], [rb, t0], [rb, t1], [ra, t1]].map(([r, t]) => lift(off + r * Math.cos(t), r * Math.sin(t))), MIR, 0.95, null, 1, true);
      }
      for (const r of r0 > 0 ? [R, r0] : [R]) outline(Array.from({ length: NA }, (_, k) => lift(off + r * Math.cos(2 * Math.PI * k / NA), r * Math.sin(2 * Math.PI * k / NA))), MEDGE, 1.1);
      // the mirror's rim, so the glass reads as a solid
      const th = 0.025 * Dmm;
      for (let k = 0; k < NA; k++) {
        const t0 = 2 * Math.PI * k / NA, t1 = 2 * Math.PI * (k + 1) / NA, A = lift(off + R * Math.cos(t0), R * Math.sin(t0)), B = lift(off + R * Math.cos(t1), R * Math.sin(t1));
        face([A, B, [B[0] + th, B[1], B[2]], [A[0] + th, A[1], A[2]]], MIR.map(c => c * 0.7), 0.95);
      }
    }
    for (const p of (pu && pu.pads) || []) {
      const cx = p.r * 1000 * Math.cos(p.ang * DEG), cy = p.r * 1000 * Math.sin(p.ang * DEG), r = p.d * 500;
      face(Array.from({ length: 16 }, (_, k) => lift(cx + r * Math.cos(2 * Math.PI * k / 16), cy + r * Math.sin(2 * Math.PI * k / 16))).map(q => [q[0] - 0.002 * Dmm, q[1], q[2]]), PAL.vane, 0.95);
    }
    lab(lift((G.off || 0) + (prim.off ? Dmm / 2 : prim.hh), 0), P.tel === "schmidt" ? "mirror" : prim.off ? "primary (off-axis)" : "primary");
  }
  // ---- a disc (a curved one: sag(r) along the axis) at x across the axis, radius r1, hole r0, centered at (y0, 0)
  const disc = (x, r1, r0, sag, rgb, al, y0 = 0, spec = true, NA = 36) => {
    const at = (r, t) => [x + sag(r), y0 + r * Math.cos(t), r * Math.sin(t)];
    const rs = r0 > 0 ? [r0, (r0 + r1) / 2, r1] : [0, r1 / 2, r1];
    for (let i = 0; i + 1 < rs.length; i++) for (let k = 0; k < NA; k++) {
      const t0 = 2 * Math.PI * k / NA, t1 = 2 * Math.PI * (k + 1) / NA;
      face([at(rs[i], t0), at(rs[i + 1], t0), at(rs[i + 1], t1), at(rs[i], t1)], rgb, al, null, 1, spec);
    }
    outline(Array.from({ length: NA }, (_, k) => at(r1, 2 * Math.PI * k / NA)), edgeOf(rgb), 1.1);
  };
  // a flat ellipse (or annulus) in the plane through c spanned by the unit vectors u (half-length r1 su) and z
  const flatEl = (c, u, r1, r0, su, rgb, al) => {
    const NA = 36, at = (r, t) => a3(c, a3(s3(u, r * su * Math.cos(t)), [0, 0, r * Math.sin(t)]));
    for (let k = 0; k < NA; k++) {
      const t0 = 2 * Math.PI * k / NA, t1 = 2 * Math.PI * (k + 1) / NA;
      face(r0 > 0 ? [at(r0, t0), at(r1, t0), at(r1, t1), at(r0, t1)] : [c, at(r1, t0), at(r1, t1)], rgb, al, null, 1, true);
    }
    outline(Array.from({ length: NA }, (_, k) => at(r1, 2 * Math.PI * k / NA)), edgeOf(rgb), 1.1);
    if (r0 > 0) outline(Array.from({ length: NA }, (_, k) => at(r0, 2 * Math.PI * k / NA)), edgeOf(rgb), 0.8);
  };
  // a cylinder along the axis from x0 to x1, radius r (a prime-focus unit, a camera)
  const cyl = (x0, x1, r, rgb, al) => {
    const NA = 28, at = (x, t) => [x, r * Math.cos(t), r * Math.sin(t)];
    for (let k = 0; k < NA; k++) { const t0 = 2 * Math.PI * k / NA, t1 = 2 * Math.PI * (k + 1) / NA; face([at(x0, t0), at(x1, t0), at(x1, t1), at(x0, t1)], rgb, al); }
    for (const x of [x0, x1]) face(Array.from({ length: NA }, (_, k) => at(x, 2 * Math.PI * k / NA)), rgb, al * 0.85, edgeOf(rgb), 0.8);
  };
  // ---- the other elements
  for (const e of G.elems) {
    if (e.k === "objective") { disc(0, Dmm / 2, 0, r => 0.04 * Dmm * (1 - (2 * r / Dmm) ** 2), PAL.glass, 0.35, 0, false); lab([0, Dmm / 2, 0], "objective"); }
    else if (e.k === "secondary") {
      const sg = r => (e.greg ? 1 : -1) * r * r / (4 * Math.abs(Dz.f2));
      if (e.span) disc(e.x, (e.span[1] - e.span[0]) / 2, 0, sg, MIR, 0.95, (e.span[0] + e.span[1]) / 2);
      else if (pu && pu.kind === "circles" && tiles) {
        // a segmented secondary (GMT's): the primary's mirrors, scaled to the beam on the secondary
        const k = e.hh / (Dmm / 2);
        tiles.forEach((t, i) => tilePoly(t.map(([x, y]) => [x * 1000 * k, y * 1000 * k]), tint(i + 7), (px, py) => [e.x + sg(Math.hypot(px, py)), px, -py], 0, true));
      } else disc(e.x, e.hh, 0, sg, MIR, 0.95);
      // the baffle around it, where the central obstruction is wider than the mirror (not in a Paul-Baker telescope,
      // Rubin's, whose obstruction is the primary's inner edge: the tertiary fills the center of the same glass)
      if (!e.span && Dz.tma !== "pb" && e.baffle > e.hh * 1.01) disc(e.x - 0.006 * Dmm, e.baffle, 0, () => 0, PAL.baffle, 0.92, 0, false);
      lab([e.x, e.span ? e.span[1] : Math.max(e.hh, e.baffle || 0), 0], e.greg ? "secondary (concave)" : "secondary");
    } else if (e.k === "tertiary") {
      flatEl([e.x, 0, 0], n3([-(e.s || 1), 1, 0]), e.hh, 0, Math.SQRT2, MIR, 0.95);
      lab([e.x, e.hh, 0], "tertiary (flat)");
    } else if (e.k === "tertiary3") {
      disc(e.x, e.hh, 0, r => -r * r / (4 * Dz.f3), MIR, 0.95);
      lab([e.x, -e.hh, 0], "tertiary (concave)");
    } else if (e.k === "flat") {
      flatEl([e.x, 0, 0], n3([1, 1, 0]), e.hh, e.inner, Math.SQRT2, MIR, 0.95);
      lab([e.x + e.hh, e.hh, 0], "fold flat");
    } else if (e.k === "pfu") {
      cyl(e.x - 0.06 * Dz.zF, e.corr !== null && e.corr !== undefined ? e.corr + 0.01 * Dz.zF : e.x, e.hh, PAL.unit, 0.85);
      lab([e.x - 0.03 * Dz.zF, e.hh, 0], P.pfuLabel || "prime-focus unit");
    } else if (e.k === "camera") cyl(e.x - 0.035 * Dmm, e.x, e.hh, PAL.unit, 0.85);
    else if (e.k === "lens") disc(e.x, e.hh, 0, r => 0.15 * e.hh * (1 - (r / e.hh) ** 2), PAL.glass, 0.35, 0, false);
    else if (e.k === "corrector") disc(e.x, e.hh, 0, () => 0, PAL.glass, 0.35, 0, false);
    else if (e.k === "det") {
      // the focus: a square as wide as the field drawn, across the beam (along the page past a fold), and the star's
      // image on it
      const hw = Math.max((Dz.mosaic.y1 - Dz.mosaic.y0) / 2, 0.01 * Dmm), c = [e.x, e.y || 0, 0];
      const u = e.rot ? [1, 0, 0] : [0, 1, 0], v = [0, 0, 1];
      face([[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => a3(c, a3(s3(u, i * hw), s3(v, j * hw)))), PAL.focus, 0.95, edgeOf(PAL.focus), 0.8);
      prims.push({ k: "d", p: [W(c)], col: PAL.light[1] });
      lab(c, P.focusLabel || (e.korsch ? "focus" : e.rot ? (P.focusKind || "Nasmyth focus") : "focus"));
    }
  }
  // ---- spider vanes and blocks: in a plane just above the secondary (or across the prime-focus unit)
  // (a Schmidt's camera, or plateholder, sits at the focus inside the tube, in the incoming light: its vanes and its body
  // in the pupil (blocks) go there, the body given depth toward the corrector)
  const pfu = G.elems.find(e => e.k === "pfu"), detE = G.elems.find(e => e.k === "det"), schm = P.tel === "schmidt";
  const xv = sec && !sec.span ? sec.x - 0.012 * Dmm : pfu ? pfu.x - 0.03 * Dz.zF : schm && detE ? detE.x - 0.006 * Dmm : null;
  if (xv !== null && pu) {
    const ox = pu.stop ? pu.stop.x * 1000 : 0, oy = pu.stop ? pu.stop.y * 1000 : 0, R = (pu.stop ? pu.stop.d : pu.D) * 500;
    const rObs = sec ? Math.max(sec.hh, Dz.tma === "pb" ? 0 : sec.baffle || 0) : pfu ? pfu.hh : schm ? Math.max(0, ...(pu.blocks || []).flat().map(([x, y]) => Math.hypot(x, y) * 1000)) : 0, th = 0.004 * Dmm;
    const bar = (A, B, w) => {
      const d = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(d[0], d[1]) || 1, n = [-d[1] / L * w / 2, d[0] / L * w / 2];
      const q = [[A[0] + n[0], A[1] + n[1]], [B[0] + n[0], B[1] + n[1]], [B[0] - n[0], B[1] - n[1]], [A[0] - n[0], A[1] - n[1]]];
      const top = q.map(([x, y]) => [xv - th, x, -y]), bot = q.map(([x, y]) => [xv + th, x, -y]);
      face(top, PAL.vane, 0.95, edgeOf(PAL.vane), 0.5); face(bot, PAL.vane, 0.95);
      for (let k = 0; k < 4; k++) face([top[k], top[(k + 1) % 4], bot[(k + 1) % 4], bot[k]], PAL.vane, 0.95);
    };
    for (const v of pu.vanes || []) {
      const c = Math.cos(v.ang * DEG), sn = Math.sin(v.ang * DEG), x0 = ox + (v.x0 || 0) * 1000, y0 = oy + (v.y0 || 0) * 1000;
      // out to the pupil's edge (or rmax), from the obstruction's edge (or from, or the vane's own start)
      const reach = Rr => { const b = (x0 - ox) * c + (y0 - oy) * sn, cc = (x0 - ox) ** 2 + (y0 - oy) ** 2 - Rr * Rr; return -b + Math.sqrt(Math.max(0, b * b - cc)); };
      const Lend = v.to ? v.to * 1000 : reach(v.rmax ? v.rmax * 1000 : R);
      const Lbeg = v.from ? v.from * 1000 : (v.x0 || v.y0 ? 0 : rObs);
      bar([x0 + Lbeg * c, y0 + Lbeg * sn], [x0 + Lend * c, y0 + Lend * sn], v.w * 1000);
      if (v.full) bar([x0 - Lbeg * c, y0 - Lbeg * sn], [x0 - Lend * c, y0 - Lend * sn], v.w * 1000);
    }
    const bd = schm ? 0.1 * Dmm : 0;
    for (const b of pu.blocks || []) {
      const top = b.map(([x, y]) => [xv - bd, ox + x * 1000, -(oy + y * 1000)]), bot = b.map(([x, y]) => [xv, ox + x * 1000, -(oy + y * 1000)]);
      face(top, schm ? PAL.unit : PAL.vane, 0.95, edgeOf(PAL.vane), 0.6);
      if (bd) { face(bot, PAL.unit, 0.95); for (let k = 0; k < b.length; k++) face([top[k], top[(k + 1) % b.length], bot[(k + 1) % b.length], bot[k]], PAL.unit, 0.95); }
    }
  }
  // ---- the light: three bundles of the field, swept by their edges
  const NS = 28, eps = Dz.eps, off = G.off || 0;
  const stop = pu && pu.stop ? { x: pu.stop.x * 1000, y: pu.stop.y * 1000, r: pu.stop.d * 500 } : null;
  const spans = stop && P.mirrorSpans ? [Math.min(...P.mirrorSpans.map(q => q[0])) * 1000, Math.max(...P.mirrorSpans.map(q => q[1])) * 1000] : null;
  const ring = (r, cx, cy) => Array.from({ length: NS }, (_, k) => {
    let x = cx + r * Math.cos(2 * Math.PI * k / NS); const y = cy + r * Math.sin(2 * Math.PI * k / NS);
    if (spans) x = Math.min(spans[1], Math.max(spans[0], x));       // (the HET: the light stops at the array's edge)
    return [x, y];
  });
  // the starlight drawn from just above the highest optic (a long column of light would read as a tube)
  let xTop = 0;
  for (const e of G.elems) {
    if (e.k === "secondary" || e.k === "tertiary3" || e.k === "lens" || e.k === "corrector" || e.k === "flat") xTop = Math.min(xTop, e.x);
    if (e.k === "pfu") xTop = Math.min(xTop, e.x - 0.06 * Dz.zF);
  }
  xTop -= 0.15 * Dmm;
  const sheet = (pts, t, rgb, al, rays = true, pulsed = true) => {
    const paths = pts.map(([px, py]) => {
      const q = G.pathOf3(Dz.trace(px, t), Dz.trace(-py, 0), t), A = q[0], B = q[1], u = (xTop - A[0]) / ((B[0] - A[0]) || 1);
      if (u > 0 && u < 1) q[0] = A.map((v, k) => v + u * (B[k] - v));
      return q;
    });
    // (a Schmidt's light runs from the corrector to the mirror as a long column, drawn as rays too)
    const n = Math.min(...paths.map(q => q.length)), s0 = P.tel === "schmidt" ? 2 : 1;
    const st = [];
    for (let j = s0; j < n; j++) st.push(paths.map(q => q[j]));
    tube(st, rgb, al);
    // the incoming starlight: a few rays, not a sheet (a column of light reads as a tube)
    if (rays) for (let k = 0; k < paths.length; k += Math.max(1, Math.round(paths.length / 8)))
      for (let j = 0; j < s0; j++) prims.push({ k: "l", p: [W(paths[k][j]), W(paths[k][j + 1])], col: rgba(rgb, 0.6), lw: 0.9 });
    // the light pulses (anim.js): seven rays around the bundle's edge, from the sky to the focus
    if (pulsed) for (let k = 0; k < paths.length; k += Math.max(1, Math.round(paths.length / 7))) pulses.push({ p: paths[k].map(W), rgb });
  };
  const cx = stop ? stop.x : off, cy = stop ? stop.y : 0, rOut = stop ? stop.r : Dmm / 2, rIn = eps > 0.002 ? eps * (stop ? stop.r : Dmm / 2) : 0;
  // the on-axis star's light as a warm sheet; the top and bottom of the field as their edges only (overlapping
  // tinted sheets mix to mud)
  G.ts.forEach((t, f) => {
    if (f !== 1) { sheet(ring(rOut, cx, cy), t, PAL.light[f], 0, false); return; }
    sheet(ring(rOut, cx, cy), t, PAL.light[f], 0.15);
    if (rIn > 0 && !off) sheet(ring(rIn, cx, cy), t, PAL.light[f], 0.1, false, false);
  });
  // (the center of the field last: its pulses on top where the bundles overlap)
  pulses.sort((a, b) => (a.rgb === PAL.light[1]) - (b.rgb === PAL.light[1]));
  return { prims, labs, pulses };
}

// ---- the painter: everything projected and drawn back to front; faces shaded by their angle to a light from the
// upper left, in front (mirrors also catch a specular highlight); a swept sheet drawn as its faces, its silhouette
// and faint rings where it meets each optic
function draw(cv, Dz, P, G, pu, V, H, opts) {
  const { g, w, h } = H.fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  const ANIM = typeof window !== "undefined" ? window.ANIM : null;
  if (ANIM) ANIM.set(cv, []);
  if (!(cv.width > 0 && cv.height > 0)) return;
  if (Dz.bad) { H.message(g, w, h, Dz.bad); return; }
  {
    const bg = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.7);
    bg.addColorStop(0, "rgba(232,238,245,0.9)"); bg.addColorStop(1, "rgba(232,238,245,0)");
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
  }
  let { prims, labs, pulses } = build(Dz, P, G, pu, opts);
  // a binocular telescope (the LBT): the side drawn twice, its axes opts.twin apart along the pupil's x (the world's x)
  if (opts && opts.twin) {
    const h = opts.twin / 2, sh = (q, d) => [q[0] + d, q[1], q[2]];
    const dup = d => prims.map(pr => (pr.k === "t" ? Object.assign({}, pr, { st: pr.st.map(st => st.map(q => sh(q, d))) }) : Object.assign({}, pr, { p: pr.p.map(q => sh(q, d)) })));
    prims = dup(-h).concat(dup(h));
    pulses = [-h, h].flatMap(d => pulses.map(pl => ({ p: pl.p.map(q => sh(q, d)), rgb: pl.rgb })));
    labs = labs.map(L => Object.assign({}, L, { p: sh(L.p, h) }));
  }
  const R = rotAzEl(V.az, V.el);
  // the scene's center: the middle of its bounding box, so a turn leaves the telescope in place
  const pts = [];
  for (const pr of prims) { if (pr.k === "t") for (const s of pr.st) pts.push(...s); else pts.push(...pr.p); }
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const p of pts) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); }
  const cen = s3(a3(lo, hi), 0.5);
  const proj = p => { const d = [p[0] - cen[0], p[1] - cen[1], p[2] - cen[2]]; return [d3(R[0], d), d3(R[1], d), d3(R[2], d)]; };
  const mL = 30, mR = 30, mT = 30, mB = 30;
  if (V.fit || !(V.s > 0) || (V.mode === "auto" && !V.turning)) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) { const q = proj(p); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
    V.s = Math.min((w - mL - mR) / Math.max(1e-9, x1 - x0), (h - mT - mB) / Math.max(1e-9, y1 - y0));
    V.ox = mL + (w - mL - mR) / 2 - V.s * (x0 + x1) / 2; V.oy = mT + (h - mT - mB) / 2 + V.s * (y0 + y1) / 2;
    V.fit = false;
  }
  const S2 = q => [V.ox + V.s * q[0], V.oy - V.s * q[1]];
  // the light pulses: projected rays, with distances in mm along each ray in the world (so a pulse slows on the
  // screen where its ray runs toward the viewer)
  if (ANIM) ANIM.set(cv, pulses.map(pl => ({ p: pl.p.map(q => S2(proj(q))), s: ANIM.lengths(pl.p), c: pl.rgb })));
  const LT = n3([-0.42, 0.55, 0.72]), HV = n3(a3(LT, [0, 0, 1]));
  const light = vs => {
    const u = [vs[1][0] - vs[0][0], vs[1][1] - vs[0][1], vs[1][2] - vs[0][2]], v = [vs[2][0] - vs[0][0], vs[2][1] - vs[0][1], vs[2][2] - vs[0][2]];
    const n = n3([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]);
    return { dif: 0.6 + 0.55 * Math.abs(d3(n, LT)), spec: Math.pow(Math.abs(d3(n, HV)), 28) };
  };
  const items = [];
  const put = pr => { const vs = pr.p.map(proj); items.push({ pr, vs, d: vs.reduce((s, q) => s + q[2], 0) / vs.length }); };
  for (const pr of prims) {
    if (pr.k !== "t") { put(pr); continue; }
    const st = pr.st, Vv = st.map(s => s.map(proj)), dark = pr.rgb.map(x => x * 0.62);
    for (let i = 1; i < st.length; i++) {
      const A = st[i - 1], B = st[i], VA = Vv[i - 1], VB = Vv[i], n = A.length, facing = [];
      for (let k = 0; k < n; k++) {
        const k2 = (k + 1) % n;
        if (pr.al > 0) put({ k: "f", p: [A[k], A[k2], B[k2], B[k]], rgb: pr.rgb, al: pr.al });
        const u = [VB[k2][0] - VA[k][0], VB[k2][1] - VA[k][1]], v = [VB[k][0] - VA[k2][0], VB[k][1] - VA[k2][1]];
        facing.push(u[0] * v[1] - u[1] * v[0] > 0);
      }
      for (let k = 0; k < n; k++) if (facing[k] !== facing[(k + n - 1) % n]) put({ k: "l", p: [A[k], B[k]], col: rgba(pr.al > 0 ? dark : pr.rgb, pr.al > 0 ? 0.8 : 0.75), lw: pr.al > 0 ? 1 : 1.2 });
    }
    if (pr.al > 0) for (let i = 1; i + 1 < st.length; i++) put({ k: "o", p: st[i], stroke: rgba(dark, 0.35), lw: 0.7 });
  }
  items.sort((u, v) => u.d - v.d);
  for (const { pr, vs } of items) {
    const q = vs.map(S2);
    if (pr.k === "f") {
      const L = light(vs), s = pr.spec ? 0.6 * L.spec : 0;
      const c = pr.rgb.map(x => Math.min(255, x * L.dif * (1 - s) + 255 * s));
      g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath();
      g.fillStyle = rgba(c, pr.al); g.fill();
      if (pr.stroke) { g.strokeStyle = pr.stroke; g.lineWidth = pr.lw; g.stroke(); }
    } else if (pr.k === "o") { g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.strokeStyle = pr.stroke; g.lineWidth = pr.lw; g.stroke(); }
    else if (pr.k === "l") { g.beginPath(); g.moveTo(q[0][0], q[0][1]); g.lineTo(q[1][0], q[1][1]); g.strokeStyle = pr.col; g.lineWidth = pr.lw; g.stroke(); }
    else if (pr.k === "d") { g.beginPath(); g.arc(q[0][0], q[0][1], 3.6, 0, 2 * Math.PI); g.fillStyle = rgba(pr.col, 1); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 1.4; g.stroke(); }
  }
  // labels (not while turning): beside their anchors, skipping any that would collide
  if (P.annot !== false && !V.turning) {
    const placed = [];
    for (const L of labs) {
      const a = S2(proj(L.p));
      g.font = `13.5px ${H.FONT}`; const wd = g.measureText(L.name).width, ht = 16;
      for (const [x0, y0] of [[a[0] + 10, a[1] - 22], [a[0] + 10, a[1] + 6], [a[0] - 10 - wd, a[1] - 22], [a[0] - 10 - wd, a[1] + 6], [a[0] + 24, a[1] - 40], [a[0] - 24 - wd, a[1] - 40]]) {
        const box = [x0 - 3, y0, x0 + wd + 3, y0 + ht];
        if (box[0] < 4 || box[2] > w - 4 || box[1] < 4 || box[3] > h - 4) continue;
        if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
        placed.push(box);
        H.halo(g, L.name, x0, y0 + 8, "#2b2723", `13.5px ${H.FONT}`, "left");
        break;
      }
    }
  }
  return { cen, n: items.length };
}
const API = { draw, build, rotAzEl, PAL };
if (typeof module !== "undefined" && module.exports) module.exports = API;
if (typeof window !== "undefined") window.TEL3D = API;
})();
