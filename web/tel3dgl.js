/* The 3D views drawn with WebGL (window.TEL3DGL; three.js r147 in web/vendor/): the Telescopes mode's (draw: the
   scene of tel3d.js's build(), the mirrors and segments, the vanes and baffles, the traced light) and the
   Spectrograph's (renderScene: the scene app.js builds).  On the GPU:
   - the mirrors shade smoothly (normals averaged across each mirror) and reflect a sky (bright toward the zenith,
     the ground below in slate), as polished aluminum or gold; glass shades smoothly too;
   - the depth is decided per pixel, so the light passes behind the secondary and through the vanes as it should;
   - the light is one translucent surface per bundle, with no seams; the bundles' outlines and the rays are lines of
     a fixed width in pixels, and rings of rays and round edges are drawn as smooth curves.
   Each frame is drawn off the page and copied onto the layout's own 2D canvas, with the view's rotation, scale and
   offsets, so the labels placed there afterward (keeping clear of the optics) and the light pulses (anim.js's
   overlay) land where the GPU draws.
   The default where WebGL is available; the 2D painters otherwise (or with ?gl=0 in the address). */
(function () {
"use strict";
const d3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
// the scene's world (z up, toward the sky) -> three.js's (y up)
const TW = p => [p[0], p[2], -p[1]];
// one GPU scene for each 2D canvas drawn over one (the Telescopes and the Spectrograph layouts); G is the one being
// drawn: { renderer, gl canvas, scene, camera, root, sil, key, tubes, size }
const STATES = new Map();
let G = null;

// a CSS rgb()/rgba() color, or [r, g, b] 0-255, as [r, g, b, a] 0-1
const parseCol = c => {
  if (Array.isArray(c)) return [c[0] / 255, c[1] / 255, c[2] / 255, 1];
  const m = /rgba?\(([^)]+)\)/.exec(String(c));
  if (m) { const v = m[1].split(",").map(Number); return [v[0] / 255, v[1] / 255, v[2] / 255, v.length > 3 ? v[3] : 1]; }
  const h = /^#([0-9a-f]{6})$/i.exec(String(c));
  if (h) { const n = parseInt(h[1], 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, 1]; }
  return [0.3, 0.3, 0.3, 1];
};

// the sky the mirrors reflect: an equirectangular gradient (zenith at the top), turned into an environment map
function skyEnv(THREE, renderer) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256;
  const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 256);
  // (enough contrast between the zenith and the horizon that a curved mirror, reflecting a range of heights, shows
  // its curvature as a gradient across the glass)
  gr.addColorStop(0, "rgb(252,253,255)"); gr.addColorStop(0.25, "rgb(232,238,246)"); gr.addColorStop(0.45, "rgb(186,198,214)");
  gr.addColorStop(0.5, "rgb(150,162,178)"); gr.addColorStop(0.52, "rgb(112,120,134)"); gr.addColorStop(1, "rgb(70,76,88)");
  g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  // a soft bright patch high in the sky, toward the light the 2D view shades with, for a highlight
  const sp = g.createRadialGradient(150, 50, 0, 150, 50, 60);
  sp.addColorStop(0, "rgba(255,255,255,0.95)"); sp.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = sp; g.fillRect(0, 0, 512, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose();
  return env;
}

// (the GPU draws on a canvas kept off the page; each frame is copied onto the layout's own 2D canvas, so the labels
// placed there afterward see the optics and keep clear of them, as in the 2D painter)
function setup(cv) {
  const THREE = window.THREE;
  const glcv = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas: glcv, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  scene.add(camera);
  // matte parts (vanes, baffles, the prime-focus unit, rims): a light from the upper left in front, as in 2D
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const sun = new THREE.DirectionalLight(0xffffff, 0.62); sun.position.set(-0.42, 0.55, 0.72); camera.add(sun);
  G = { THREE, renderer, glcv, scene, camera, env: skyEnv(THREE, renderer), root: null, sil: null, key: null };
  STATES.set(cv, G);
}

// (kept for callers: nothing of the GPU's sits on the page to put away)
function hide() {}

// ---- the scene from tel3d.js's primitives (in the scene's world, mm)
function buildScene(prims, cen) {
  const THREE = G.THREE, root = new THREE.Group();
  const tri = { mirror: [], matte: {}, glass: {} };   // triangles: { p: [3 points], c: [r, g, b] }
  const lines = new Map();                             // "r,g,b,a|width" -> flat list of segment ends
  const addLine = (a, b, col, lw) => {
    const c = parseCol(col), k = c.map(v => v.toFixed(3)).join(",") + "|" + (lw || 1).toFixed(2);
    if (!lines.has(k)) lines.set(k, []);
    lines.get(k).push(TW(a), TW(b));
  };
  const tubes = [];
  for (const pr of prims) {
    if (pr.k === "f") {
      const P = pr.p.map(TW), rgb = pr.rgb.map(v => v / 255);
      // each polygon as a fan, each triangle turned to face the middle of the scene (so a mirror's triangles agree
      // on which way is front, and its averaged normals point out of the reflecting face)
      for (let i = 1; i + 1 < P.length; i++) {
        let t = [P[0], P[i], P[i + 1]];
        const u = t[1].map((v, j) => v - t[0][j]), w = t[2].map((v, j) => v - t[0][j]);
        const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
        const m = t[0].map((v, j) => (v + t[1][j] + t[2][j]) / 3), to = TW(cen).map((v, j) => v - m[j]);
        if (d3(n, to) < 0) t = [t[0], t[2], t[1]];
        if (pr.spec) { const mx = Math.max(...pr.rgb); tri.mirror.push({ p: t, c: pr.rgb.map(v => 0.97 * v / mx) }); }
        else if (pr.seal) (tri.rim = tri.rim || []).push({ p: t, c: rgb });      // a mirror's rim: shaded smooth
        else {
          const key = pr.al < 0.9 ? "glass" : "matte", a = pr.al.toFixed(2);
          (tri[key][a] = tri[key][a] || []).push({ p: t, c: rgb });
        }
      }
      if (pr.stroke) for (let i = 0; i < pr.p.length; i++) addLine(pr.p[i], pr.p[(i + 1) % pr.p.length], pr.stroke, pr.lw);
    } else if (pr.k === "o") {
      const P = smoothRing(pr.p);
      for (let i = 0; i < P.length; i++) addLine(P[i], P[(i + 1) % P.length], pr.stroke, pr.lw);
    } else if (pr.k === "l") {
      if (!(pr.ray && hideRays())) addLine(pr.p[0], pr.p[1], pr.col, pr.lw);
    } else if (pr.k === "t") tubes.push(Object.assign({}, pr, { st: pr.st.map(s => smoothRing(s)) }));   // (each ring smooth, in step)
  }
  // mirrors: vertices shared within a mirror (same place, same tint) so the normals average into a smooth surface
  if (tri.mirror.length) {
    const geo = triGeometry(tri.mirror, true);
    // the reflecting face polished; the back (the glass and its cell, seen from behind) matte slate
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 1, roughness: 0.14, envMap: G.env, envMapIntensity: 1.05, side: THREE.FrontSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const back = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.42, 0.45, 0.5), side: THREE.BackSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    root.add(new THREE.Mesh(geo, mat), new THREE.Mesh(geo, back));
  }
  if (tri.rim) root.add(new THREE.Mesh(triGeometry(tri.rim, true), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })));
  for (const [a, ts] of Object.entries(tri.matte)) {
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, flatShading: true, transparent: +a < 0.999, opacity: +a, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    root.add(new THREE.Mesh(triGeometry(ts, false), mat));
  }
  for (const [a, ts] of Object.entries(tri.glass)) {
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: +a, depthWrite: false });
    const m = new THREE.Mesh(triGeometry(ts, true), mat); m.renderOrder = 2; root.add(m);
  }
  // the light: one translucent surface per bundle (no seams between its faces), drawn after the solids
  if (!hideRays()) for (const pr of tubes) {
    if (!(pr.al > 0)) continue;
    const pos = [], st = waists(pr.st).map(s => s.map(TW));
    for (let i = 1; i < st.length; i++) {
      const A = st[i - 1], B = st[i], n = Math.max(A.length, B.length), at = (S, k) => S[S.length === 1 ? 0 : k % S.length];
      for (let k = 0; k < n; k++) {
        const a0 = at(A, k), a1 = at(A, k + 1), b0 = at(B, k), b1 = at(B, k + 1);
        if (A.length > 1) pos.push(...a0, ...a1, ...b1);
        if (B.length > 1) pos.push(...a0, ...b1, ...b0);
        else if (A.length === 1) pos.push(...a0, ...b1, ...b0);
      }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const c = pr.rgb.map(v => v / 255), mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(c[0], c[1], c[2]), transparent: true, opacity: pr.al, depthWrite: false, side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat); m.renderOrder = 3; root.add(m);
  }
  // the static lines (outlines, the starlight's rays, the rings where a bundle meets an optic)
  for (const pr of tubes) if (pr.al > 0 && !hideRays()) {
    const dark = pr.rgb.map(x => x * 0.62);
    for (let i = 1; i + 1 < pr.st.length; i++) { const s = pr.st[i]; for (let k = 0; k < s.length; k++) addLine(s[k], s[(k + 1) % s.length], `rgba(${dark.join(",")},0.35)`, 0.7); }
  }
  for (const [k, pts] of lines) root.add(lineObject(k, pts));
  return { root, tubes };
}
const hideRays = () => !!(window.ANIM && !window.ANIM.rays);

// a closed ring of points (a bundle's 28 rays around, a mirror's edge) resampled as a smooth curve through them
// (uniform Catmull-Rom, m points per span), so outer edges read as curves and not as polygons; rings of a few
// points (a hexagonal segment's corners) are left as they are
const SMOOTH_MIN = 12;
function smoothRing(P, m = 4) {
  const n = P.length;
  if (n < SMOOTH_MIN) return P;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    for (let s = 0; s < m; s++) {
      const t = s / m, t2 = t * t, t3 = t2 * t;
      out.push(p1.map((_, j) => 0.5 * (2 * p1[j] + (p2[j] - p0[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (3 * p1[j] - p0[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  return out;
}

// a bundle's stations with a station added where the light passes through a focus between two optics: there the
// ring of rays shrinks to its narrowest (the spread about its center, quadratic along the stretch, at its minimum)
// and comes out turned over, so the faces across the focus would overlap; split there, each half is a clean cone
function waists(st) {
  const out = [st[0]];
  for (let i = 1; i < st.length; i++) {
    const A = st[i - 1], B = st[i], n = A.length;
    if (n > 2 && B.length === n) {
      // spread(u) = sum |(A_k - Abar) + u ((B_k - Bbar) - (A_k - Abar))|^2: a quadratic a u^2 + b u + c
      const ca = [0, 1, 2].map(j => A.reduce((s, p) => s + p[j], 0) / n), cb = [0, 1, 2].map(j => B.reduce((s, p) => s + p[j], 0) / n);
      let a = 0, b = 0, c = 0, e = 0;
      for (let k = 0; k < n; k++) for (let j = 0; j < 3; j++) {
        const p = A[k][j] - ca[j], q = B[k][j] - cb[j] - p;
        a += q * q; b += 2 * p * q; c += p * p; e += (B[k][j] - cb[j]) ** 2;
      }
      const u = a > 0 ? -b / (2 * a) : -1, sMin = a * u * u + b * u + c;
      if (u > 0.02 && u < 0.98 && sMin < 0.05 * Math.min(c, e)) out.push(A.map((p, k) => p.map((v, j) => v + u * (B[k][j] - v))));
    }
    out.push(B);
  }
  return out;
}

function triGeometry(ts, smooth) {
  const THREE = G.THREE;
  if (!smooth) {
    const pos = [], col = [];
    for (const t of ts) for (const p of t.p) { pos.push(...p); col.push(...t.c); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    return geo;
  }
  // shared vertices: one per place and tint (to 0.01 mm)
  const idx = new Map(), pos = [], col = [], ind = [];
  for (const t of ts) for (const p of t.p) {
    const key = p.map(v => Math.round(v * 100)).join(",") + "|" + t.c.map(v => v.toFixed(3)).join(",");
    let i = idx.get(key);
    if (i === undefined) { i = pos.length / 3; idx.set(key, i); pos.push(...p); col.push(...t.c); }
    ind.push(i);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(ind); geo.computeVertexNormals();
  return geo;
}

function lineObject(key, pts) {
  const THREE = G.THREE, [cs, lw] = key.split("|"), c = cs.split(",").map(Number);
  const geo = new THREE.LineSegmentsGeometry(); geo.setPositions(pts.flat());
  // opaque, the translucent color mixed with the panel's pale background: translucent pieces would overlap at each
  // joint and bead the line with darker dots
  const BG = [0.94, 0.955, 0.97], mix = c.slice(0, 3).map((v, i) => v * c[3] + BG[i] * (1 - c[3]));
  const mat = new THREE.LineMaterial({ color: new THREE.Color(mix[0], mix[1], mix[2]), linewidth: +lw });
  const o = new THREE.LineSegments2(geo, mat); o.renderOrder = 4;
  return o;
}

// the bundles' outlines as the view sees them (the lengthwise edges between a face turned toward the viewer and one
// turned away), computed for each view, as in 2D
function silhouettes(tubes, proj) {
  const lines = new Map();
  for (const pr of tubes) {
    const st = pr.st, Vv = st.map(s => s.map(proj)), dark = pr.rgb.map(x => x * 0.62);
    const col = parseCol(pr.al > 0 ? `rgba(${dark.join(",")},0.8)` : `rgba(${pr.rgb.join(",")},0.75)`), lw = pr.al > 0 ? 1 : 1.2;
    const key = col.map(v => v.toFixed(3)).join(",") + "|" + lw.toFixed(2);
    for (let i = 1; i < st.length; i++) {
      const A = st[i - 1], B = st[i], VA = Vv[i - 1], VB = Vv[i], n = A.length;
      if (A.length === 1 || B.length === 1) {
        // a cone from (or to) a point (the slit, a focus): its outline the rays from the point where its faces turn
        // from the viewer
        const toA = A.length === 1, ring = toA ? B : A, Vr = toA ? VB : VA, apex = toA ? A[0] : B[0], Va = toA ? VA[0] : VB[0], m = ring.length;
        if (m < 3) continue;
        const facing = [];
        for (let k = 0; k < m; k++) {
          const k2 = (k + 1) % m, u = [Vr[k][0] - Va[0], Vr[k][1] - Va[1]], v = [Vr[k2][0] - Va[0], Vr[k2][1] - Va[1]];
          facing.push(u[0] * v[1] - u[1] * v[0] > 0);
        }
        for (let k = 0; k < m; k++) if (facing[k] !== facing[(k + m - 1) % m]) {
          if (!lines.has(key)) lines.set(key, []);
          lines.get(key).push(TW(apex), TW(ring[k]));
        }
        continue;
      }
      if (n < 3 || B.length !== n) continue;
      const facing = [];
      for (let k = 0; k < n; k++) {
        const k2 = (k + 1) % n, u = [VB[k2][0] - VA[k][0], VB[k2][1] - VA[k][1]], v = [VB[k][0] - VA[k2][0], VB[k][1] - VA[k2][1]];
        facing.push(u[0] * v[1] - u[1] * v[0] > 0);
      }
      for (let k = 0; k < n; k++) if (facing[k] !== facing[(k + n - 1) % n]) {
        if (!lines.has(key)) lines.set(key, []);
        lines.get(key).push(TW(A[k]), TW(B[k]));
      }
    }
  }
  const grp = new G.THREE.Group();
  for (const [k, pts] of lines) grp.add(lineObject(k, pts));
  return grp;
}

// WebGL available (three.js loaded and a context to be had); once a setup fails, the 2D painter for good
let failed = false, okCache = null;
function ok() {
  if (failed || !window.THREE || !window.THREE.LineSegments2) return false;
  if (okCache === null) { try { const c = document.createElement("canvas"); okCache = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { okCache = false; } }
  return okCache;
}

// the GPU state for the 2D canvas cv (made on first use); null if WebGL is not to be had
function stateFor(cv) {
  if (!ok()) return null;
  G = STATES.get(cv) || null;
  if (!G) { try { setup(cv); } catch (e) { failed = true; if (G && G.glcv) G.glcv.remove(); G = null; } }
  return G;
}

// the scene drawn for one view: a point p in the world lands on the screen at [ox + s R0·(p − cen), oy − s R1·(p − cen)]
// (R: the rows of the world -> view rotation: screen right, screen up, toward the viewer)
function renderFrame(R, cen, size, s, ox, oy, w, h) {
  const proj = p => { const d = [p[0] - cen[0], p[1] - cen[1], p[2] - cen[2]]; return [d3(R[0], d), d3(R[1], d), d3(R[2], d)]; };
  // the camera: looking along the view's depth axis at the scene's center, its frustum matching the 2D mapping
  const cam = G.camera, c3 = TW(cen), up = TW(R[1]), back = TW(R[2]);
  cam.left = -ox / s; cam.right = (w - ox) / s; cam.top = oy / s; cam.bottom = (oy - h) / s;
  cam.near = 0.01 * size; cam.far = 8 * size;
  cam.position.set(c3[0] + 3 * size * back[0], c3[1] + 3 * size * back[1], c3[2] + 3 * size * back[2]);
  cam.up.set(up[0], up[1], up[2]); cam.lookAt(c3[0], c3[1], c3[2]); cam.updateProjectionMatrix();
  // the bundles' outlines for this view
  if (G.sil) { G.scene.remove(G.sil); disposeTree(G.sil); G.sil = null; }
  if (!hideRays()) { G.sil = silhouettes(G.tubes, proj); G.scene.add(G.sil); }
  const dpr = window.devicePixelRatio || 1;
  G.renderer.setPixelRatio(dpr); G.renderer.setSize(w, h, false);
  G.scene.traverse(o => { if (o.material && o.material.isLineMaterial) o.material.resolution.set(w, h); });
  G.renderer.render(G.scene, cam);
}

// any 3D scene (the Spectrograph's): the primitives (as tel3d.js builds them: faces, beams, outlines, lines; in the
// world, mm) drawn on the GPU under the 2D canvas cv, with the view's mapping (as renderFrame).  The primitives are
// asked for (getPrims) and the GPU's scene rebuilt only when key changes.  Returns false (draw in 2D) without WebGL.
function renderScene(cv, key, getPrims, view) {
  if (!stateFor(cv)) return false;
  const k2 = [].concat(key, hideRays());
  if (!G.key || G.key.length !== k2.length || G.key.some((x, i) => x !== k2[i])) {
    const prims = getPrims();
    let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const pr of prims) for (const p of (pr.k === "t" ? pr.st.flat() : pr.p)) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); }
    if (G.root) { G.scene.remove(G.root); disposeTree(G.root); }
    const built = buildScene(prims, view.cen);
    G.root = built.root; G.scene.add(G.root);
    Object.assign(G, { key: k2, tubes: built.tubes, size: Math.max(1, ...hi.map((v, i) => v - lo[i])) });
  }
  renderFrame(view.R, view.cen, G.size, view.s, view.ox, view.oy, view.w, view.h);
  cv.getContext("2d").drawImage(G.glcv, 0, 0, view.w, view.h);
  return true;
}

function draw(cv, Dz, P, Gm, pu, V, H, opts) {
  const T3D = window.TEL3D;
  if (!stateFor(cv)) return T3D.draw(cv, Dz, P, Gm, pu, V, H, opts);
  const { g, w, h } = H.fitCanvas(cv);
  g.clearRect(0, 0, w, h);
  const ANIM = window.ANIM;
  if (ANIM) ANIM.set(cv, []);
  if (!(cv.width > 0 && cv.height > 0)) return;
  if (Dz.bad) { H.message(g, w, h, Dz.bad); return; }
  { const bg = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.7);   // (tel3d.js's background)
    bg.addColorStop(0, "rgba(232,238,245,0.9)"); bg.addColorStop(1, "rgba(232,238,245,0)"); g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  // the primitives (built again only when the design or the drawn-rays switch changes)
  const key = [Dz, JSON.stringify(opts), hideRays()];
  if (!G.key || G.key[0] !== key[0] || G.key[1] !== key[1] || G.key[2] !== key[2]) {
    let { prims, labs, pulses } = T3D.build(Dz, P, Gm, pu, opts);
    if (opts && opts.twin) {
      // (the two sides mirror each other across the mount's center, as in tel3d.js)
      const hh = opts.twin / 2, sh = (q, d, m) => [(m ? -q[0] : q[0]) + d, q[1], q[2]], mL = !!opts.twinDX, mR = !opts.twinDX;
      const dup = (d, m) => prims.map(pr => (pr.k === "t" ? Object.assign({}, pr, { st: pr.st.map(s => s.map(q => sh(q, d, m))) }) : Object.assign({}, pr, { p: pr.p.map(q => sh(q, d, m)) })));
      prims = dup(-hh, mL).concat(dup(hh, mR));
      pulses = [[-hh, mL], [hh, mR]].flatMap(([d, m]) => pulses.map(pl => ({ p: pl.p.map(q => sh(q, d, m)), rgb: pl.rgb })));
      labs = labs.map(L => Object.assign({}, L, { p: sh(L.p, hh, mR) }));
    }
    const pts = [];
    for (const pr of prims) { if (pr.k === "t") for (const s of pr.st) pts.push(...s); else pts.push(...pr.p); }
    let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const p of pts) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); }
    const cen = lo.map((v, i) => (v + hi[i]) / 2), size = Math.max(1, ...hi.map((v, i) => v - lo[i]));
    // (the GPU's scene rebuilt only when the geometry itself differs: a new band or seeing gives a new design object
    // but the same telescope, and keeps the scene)
    let sig = prims.length + (hideRays() ? 7919 : 0);   // (the drawn-rays switch changes the scene too)
    const mix = v => { sig = (Math.imul(sig, 31) + (Math.round(v * 100) | 0)) | 0; };
    for (const pr of prims) {
      mix(pr.k.charCodeAt(0)); mix(pr.al || 0); for (const c of pr.rgb || []) mix(c);
      for (const q of (pr.k === "t" ? pr.st.flat() : pr.p)) { mix(q[0]); mix(q[1]); mix(q[2]); }
    }
    if (!G.root || G.sig !== sig) {
      if (G.root) { G.scene.remove(G.root); disposeTree(G.root); }
      const built = buildScene(prims, cen);
      G.root = built.root; G.scene.add(G.root); G.tubes = built.tubes; G.sig = sig;
    }
    Object.assign(G, { key, prims, labs, pulses, pts, cen, size, dots: prims.filter(pr => pr.k === "d") });
  }
  const { cen, size, pts } = G;
  // the view: tel3d.js's rotation, scale and offsets
  const R = T3D.rotAzEl(V.az, V.el);
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
  renderFrame(R, cen, size, V.s, V.ox, V.oy, w, h);
  g.drawImage(G.glcv, 0, 0, w, h);
  // the pulses (anim.js) and, on the 2D canvas, the focus dots and the labels
  if (ANIM) ANIM.set(cv, G.pulses.map(pl => ({ p: pl.p.map(q => S2(proj(q))), s: ANIM.lengths(pl.p), c: pl.rgb })));
  for (const pr of G.dots) {
    const q = S2(proj(pr.p[0]));
    g.beginPath(); g.arc(q[0], q[1], 3.6, 0, 2 * Math.PI); g.fillStyle = `rgb(${pr.col.map(v => v | 0).join(",")})`; g.fill();
    g.strokeStyle = "#fff"; g.lineWidth = 1.4; g.stroke();
  }
  if (P.annot !== false && !V.turning) {
    const placed = [];
    for (const L of G.labs) {
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
  return { cen, n: G.prims.length };
}
function disposeTree(o) { o.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); }); }

// (for the tests: what the GPU's scene under cv holds)
function stats(cv) {
  const S = STATES.get(cv), out = { mirrorTris: 0, meshes: 0 };
  if (!S || !S.root) return out;
  S.root.traverse(o => { if (o.isMesh) { out.meshes++; if (o.material.isMeshStandardMaterial) out.mirrorTris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; } });
  return out;
}

const API = { draw, renderScene, hide, ok, stats };
if (typeof window !== "undefined") window.TEL3DGL = API;
})();
