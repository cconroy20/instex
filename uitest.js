// Drive the page in headless Chrome and check that each control does what it should: the sliders
// and switches move the results the way the optics says they must, the hover readout and the zoom
// on the detector work, the URL hash round-trips, the presets load, and the page fits on one
// screen (1440 x 900 and 1280 x 800) in every mode.
//   python3 web/serve.py 8795 &   then   node uitest.js [url] [outdir]
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const URL0 = process.argv[2] || "http://localhost:8795/";
const OUT = process.argv[3] || path.join(__dirname, "cache", "shots_ui");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9400 + Math.floor(Math.random() * 500);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0, passes = 0;
function check(name, ok, detail) {
  ok ? passes++ : fails++;
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail !== undefined ? "  --  " + detail : ""}`);
}
const rel = (a, b) => Math.abs(a / b - 1);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const prof = fs.mkdtempSync("/tmp/instex-chrome-");
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${prof}`, "--window-size=1440,900", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  // whatever happens (a failed check, a crash, Ctrl-C), stop Chrome and delete its throwaway profile
  const cleanup = () => {                         // synchronous: runs from process "exit"
    try { chrome.kill("SIGKILL"); } catch (e) {}
    const nap = new Int32Array(new SharedArrayBuffer(4));
    for (let k = 0; k < 40 && fs.existsSync(prof); k++) {    // a dying Chrome can still write into its profile
      try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
      if (fs.existsSync(prof)) Atomics.wait(nap, 0, 0, 50);
    }
  };
  process.on("exit", cleanup);
  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(130));
  process.on("uncaughtException", e => { console.error(e); process.exit(2); });
  process.on("unhandledRejection", e => { console.error(e); process.exit(2); });
  let tabs = null;
  for (let i = 0; i < 50 && !tabs; i++) {
    await sleep(200);
    try { tabs = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch (e) { /* not up yet */ }
  }
  const page = tabs.find(t => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const pend = new Map(); const errors = [];
  ws.addEventListener("message", ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === "Log.entryAdded" && m.params.entry.level === "error") errors.push(m.params.entry.text + " " + (m.params.entry.url || ""));
  });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => {
    const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result.exceptionDetails) throw new Error(expr + "\n" + JSON.stringify(r.result.exceptionDetails));
    return r.result.result.value;
  };
  const size = (w, h) => send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  const shot = async name => {
    const r = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(OUT, name), Buffer.from(r.result.data, "base64"));
  };
  const go = async (hash = "") => { await send("Page.navigate", { url: URL0 + "?r=" + Math.random() + hash }); await sleep(900); };
  const setRange = async (sel, v) => { await ev(`(e => { e.value = ${v}; e.dispatchEvent(new Event("input", {bubbles: true})); })(document.querySelector(${JSON.stringify(sel)}))`); await sleep(120); };
  const click = async sel => { await ev(`document.querySelector(${JSON.stringify(sel)}).click()`); await sleep(150); };
  const D = async () => ev(`(() => { const d = window.__instex.design(); return d.c ? { R: d.c.Reff, Rs: d.c.Rs, npix: d.c.npix, ps: d.c.pixScale, dl: d.c.dlpix,
      lo: d.range && d.range[0], hi: d.range && d.range[1], fcol: d.fcol, n: d.orders.length, bad: d.bad || null, flags: d.flags.map(f => f.k) } : { bad: d.bad || "no c" }; })()`);
  const vis = async sel => ev(`(e => !!e && e.offsetParent !== null)(document.querySelector(${JSON.stringify(sel)}))`);
  const fit = async () => ev(`(() => { const r = [...document.querySelectorAll(".controls")].find(e => e.offsetParent !== null).getBoundingClientRect(); return { bottom: r.bottom, vh: innerHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; })()`);
  await send("Page.enable"); await send("Runtime.enable"); await send("Log.enable");
  await size(1440, 900);

  // ------------------------------------------------------------ load and defaults
  await go();
  let d0 = await D();
  check("page loads, default grating design valid", !d0.bad && d0.n === 1, `R ${d0.R && d0.R.toFixed(0)}`);
  const statR = await ev(`document.querySelector(".stat.res .rv").textContent`);
  check("results strip shows R", statR.startsWith(String(Math.round(d0.R)).slice(0, 2)), statR);
  {
    const samp = await ev(`[...document.querySelectorAll(".stat")].find(e => /Sampling/.test(e.textContent)).textContent`);
    const want = await ev(`(() => { const d = window.__instex.design(), P = window.__instex.params(); return [d.c.npix, P.slitW / d.c.pixScale]; })()`);
    check("sampling reported separately, spectral and spatial", /λ × spatial/.test(samp) && samp.includes(want[0].toFixed(2).slice(0, 3)) && samp.includes(want[1].toFixed(2).slice(0, 3)), samp);
  }
  await shot("01_default.png");

  // ------------------------------------------------------------ the sliders move the optics the right way
  // Sliders snap to their steps, so each check compares against the parameters actually set, and
  // starts again from the defaults.
  const Pm = async () => ev(`window.__instex.params()`);
  const p0 = await Pm();
  const fresh = async () => { await click("#reset"); };
  let d, p;
  await fresh(); await setRange("#sD", Math.log10(13)); d = await D(); p = await Pm();
  check("R_slit proportional to 1/D (slit fixed on the sky)", rel(d.Rs / d0.Rs, p0.D / p.D) < 1e-6, `D ${p.D.toFixed(3)}: ${d0.Rs.toFixed(1)} -> ${d.Rs.toFixed(1)}`);
  await fresh(); await setRange("#sF", Math.log10(15)); d = await D(); p = await Pm();
  check("slower focus: R unchanged, collimator longer by F ratio", rel(d.Rs, d0.Rs) < 1e-9 && rel(d.fcol / d0.fcol, p.F / p0.F) < 1e-9, `f/${p.F.toFixed(3)}, f_col ${d.fcol.toFixed(1)}`);
  await fresh(); await setRange("#sW", Math.log10(200)); d = await D(); p = await Pm();
  check("R_slit proportional to W", rel(d.Rs / d0.Rs, p.W / p0.W) < 1e-5, `W ${p.W.toFixed(2)}: ${d.Rs.toFixed(1)}`);
  check("  ... while the pixel scale stays put (camera focal ratio fixed: 206265 p / (D F_cam))", rel(d.ps, d0.ps) < 1e-6, `${d0.ps.toFixed(4)} -> ${d.ps.toFixed(4)}`);
  await fresh(); await setRange("#sFc", Math.log10(3.2)); d = await D(); p = await Pm();
  check("sampling proportional to the camera focal ratio, R_slit unchanged", rel(d.npix / d0.npix, p.Fc / p0.Fc) < 1e-6 && rel(d.Rs, d0.Rs) < 1e-9, `${d0.npix.toFixed(3)} -> ${d.npix.toFixed(3)}`);
  check("  ... and the coverage shrinks about as 1/F_cam", Math.abs((d.hi - d.lo) / (d0.hi - d0.lo) * p.Fc / p0.Fc - 1) < 0.06, `${((d.hi - d.lo) / (d0.hi - d0.lo)).toFixed(3)}`);
  await fresh(); await setRange("#sSW", Math.log10(0.5)); d = await D(); p = await Pm();
  check("R_slit proportional to 1/phi", rel(d.Rs / d0.Rs, p0.slitW / p.slitW) < 1e-5, `phi ${p.slitW.toFixed(4)}`);
  await fresh(); await setRange("#sG", Math.log10(1800)); d = await D();
  check("finer ruling: higher R, shorter coverage", d.Rs > d0.Rs * 1.3 && (d.hi - d.lo) < (d0.hi - d0.lo), `R ${d.Rs.toFixed(0)}`);
  await fresh(); await setRange("#sLC", Math.log10(6500)); d = await D();
  check("central wavelength 6500 A moves the coverage redward", d.lo > d0.lo && d.hi > d0.hi && d.lo < 0.65 && d.hi > 0.65, `${(d.lo * 1e4).toFixed(0)}-${(d.hi * 1e4).toFixed(0)}`);
  await fresh(); await setRange("#sPix", 7.5); d = await D();
  check("half-size pixels double the sampling", rel(d.npix / d0.npix, 2) < 1e-6, d.npix.toFixed(3));
  await fresh(); await setRange("#sNx", Math.log10(2048)); d = await D(); p = await Pm();
  check("fewer pixels along lambda: proportionally less coverage", Math.abs((d.hi - d.lo) / (d0.hi - d0.lo) / (p.Nx / p0.Nx) - 1) < 0.05, `${p.Nx} px: ${((d.hi - d.lo) / (d0.hi - d0.lo)).toFixed(3)}`);
  check("detector menu turns to Custom format", (await ev(`document.querySelector("#detSel").value`)) === "custom");
  await ev(`(s => { s.value = "1"; s.dispatchEvent(new Event("change")); })(document.querySelector("#detSel"))`); await sleep(150);
  check("detector menu sets 4k x 4k", (await ev(`window.__instex.params().Ny`)) === 4096);
  await fresh(); await click("#gRefl"); const dRef = await D(); await setRange("#sPsi", 10); d = await D();
  check("reflection grating: the camera angle changes alpha/beta and R", Math.abs(d.Rs / dRef.Rs - 1) > 0.01, `${dRef.Rs.toFixed(0)} -> ${d.Rs.toFixed(0)}`);
  await fresh(); await setRange("#sM", 2); d = await D();
  check("second order: needs a filter flag, about twice R", d.flags.includes("ord") && d.Rs > 1.6 * d0.Rs, d.Rs.toFixed(0));
  await fresh(); d = await D();
  check("Reset restores the defaults", rel(d.R, d0.R) < 1e-12 && (await ev(`location.hash`)) === "", d.R.toFixed(1));

  // ------------------------------------------------------------ layout view: auto / fixed scale, zoom, pan, reset
  {
    await click("#reset"); await sleep(200);
    const v0 = await ev(`window.__instex.lview()`);
    check("layout starts in Auto scale", v0.mode === "auto" && v0.s > 0);
    const lb = await ev(`(r => ({x: r.left, y: r.top, w: r.width, h: r.height}))(document.querySelector("#cvL").getBoundingClientRect())`);
    await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: lb.x + lb.w / 2, y: lb.y + lb.h / 2, deltaX: 0, deltaY: -300 }); await sleep(150);
    const v1 = await ev(`window.__instex.lview()`);
    check("scrolling zooms the layout and switches to Fixed scale", v1.mode === "fixed" && v1.s > v0.s * 1.5 && (await ev(`document.querySelector("#lvFixed").getAttribute("aria-pressed")`)) === "true", `s ${v0.s.toFixed(3)} -> ${v1.s.toFixed(3)}`);
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: lb.x + 200, y: lb.y + 200, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: lb.x + 260, y: lb.y + 230, button: "left", buttons: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: lb.x + 260, y: lb.y + 230, button: "left", clickCount: 1 }); await sleep(150);
    const v2 = await ev(`window.__instex.lview()`);
    check("dragging pans the layout", Math.abs(v2.ox - v1.ox - 60) < 1 && Math.abs(v2.oy - v1.oy - 30) < 1, `${(v2.ox - v1.ox).toFixed(1)}, ${(v2.oy - v1.oy).toFixed(1)} px`);
    await setRange("#sW", Math.log10(200)); await sleep(150);
    const v3 = await ev(`window.__instex.lview()`);
    check("Fixed scale holds the scale when the instrument changes", v3.s === v2.s && v3.ox === v2.ox);
    await click("#lvReset"); await sleep(150);
    const v4 = await ev(`window.__instex.lview()`);
    check("Reset refits the drawing and keeps Fixed scale", v4.mode === "fixed" && Math.abs(v4.s - v2.s) > 1e-6);
    await click("#lvAuto"); await setRange("#sW", Math.log10(100)); await sleep(150);
    const v5 = await ev(`window.__instex.lview()`);
    check("Auto scale refits on every change", v5.mode === "auto" && Math.abs(v5.s - v4.s) > 1e-6);
    await click("#reset");
  }
  // ------------------------------------------------------------ Layout options: beam length, fold mirror (drawing only)
  {
    await click("#reset"); await sleep(200);
    check("Layout options hidden until asked for", !(await vis("#sLL")));
    await click("#lvOptsBtn");
    check("Layout options open: beam length at its automatic value", (await vis("#sLL")) && /auto/.test(await ev(`document.querySelector("#vLL").textContent`)));
    const d0 = await D(), p0 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    await setRange("#sLL", Math.log10(400)); await sleep(150);
    const d1 = await D(), p1 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("a longer collimated beam: drawing changes, numbers do not", JSON.stringify(d0) === JSON.stringify(d1) && p0 !== p1 && Math.abs((await ev(`window.__instex.params().layLen`)) - 400) < 3);
    check("fold angle hidden while the fold mirror is off", !(await vis("#sFA")));
    await click("#foOn");
    const d2 = await D(), p2 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("fold mirror on: angle slider shown, drawing changes, numbers do not", (await vis("#sFA")) && JSON.stringify(d2) === JSON.stringify(d0) && p2 !== p1);
    await setRange("#sFA", 120); await sleep(150);
    const p3 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("fold angle 120°: the drawing changes", p3 !== p2 && (await ev(`window.__instex.params().foldAng`)) === 120);
    await setRange("#sFA", 300); await sleep(150);
    const p4 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("fold angle reaches 300° (turning the other way), no page error", p4 !== p3 && (await ev(`window.__instex.params().foldAng`)) === 300 && (await ev(`document.getElementById("err").textContent`)) === "");
    await setRange("#sFP", 0.8); await sleep(150);
    const p5 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("fold position 0.8: shown with the fold on, the drawing changes", (await vis("#sFP")) && p5 !== p4 && (await ev(`window.__instex.params().foldPos`)) === 0.8);
    const d5 = await D();
    await click("#gfOn"); await sleep(150);
    const p6 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    const d6 = await D();
    check("grating flipped: drawing changes, numbers do not, state in the URL", p6 !== p5 && JSON.stringify(d6) === JSON.stringify(d5) && /gFlip=true/.test(await ev(`location.hash`)));
    await click("#gfOff"); await sleep(100);
    const p7 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    await click("#anOff"); await sleep(150);
    const p8 = await ev(`document.querySelector("#cvL").toDataURL().length`), d8 = await D();
    check("labels and marks hidden: drawing changes, numbers do not, no page error", p8 !== p7 && JSON.stringify(d8) === JSON.stringify(d5) && (await ev(`window.__instex.params().annot`)) === false && (await ev(`document.getElementById("err").textContent`)) === "");
    await click("#anOn"); await sleep(150);
    check("labels and marks shown again", (await ev(`document.querySelector("#cvL").toDataURL().length`)) === p7);
    // Spatial view: the plane along the slit (grating mode), drawing only
    const d9 = await D(), p9 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    await click("#vSpat"); await sleep(200);
    const p10 = await ev(`document.querySelector("#cvL").toDataURL().length`), d10 = await D();
    check("Spatial view: drawing changes, numbers do not, subtitle says so, no page error", p10 !== p9 && JSON.stringify(d10) === JSON.stringify(d9)
      && /along the slit/.test(await ev(`document.getElementById("lSub").textContent`)) && (await ev(`document.getElementById("err").textContent`)) === "" && /g\.view=spatial/.test(await ev(`location.hash`)));
    check("Spatial view: three fixed slit points by default, the points control shown", (await vis("#sp3")) && (await ev(`window.__instex.params().spPts`)) === 3 && (await ev(`window.__instex.spGeo()`)) === null);
    await click("#sp1"); await sleep(200);
    const dragTo = await ev(`(() => { const cv = document.getElementById("cvL"), r = cv.getBoundingClientRect(), G = window.__instex.spGeo();
      cv.dispatchEvent(new MouseEvent("mousedown", { clientX: r.left + G.ox, clientY: r.top + G.oy - G.s * G.hMax * 0.5, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: r.left + G.ox, clientY: r.top + G.oy + G.s * G.hMax * 0.6, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      return window.__instex.state().g.spPos; })()`);
    check("1 free: dragging along the slit moves the point (to -0.6 of the half-slit, within a pixel)", Math.abs(dragTo + 0.6) < 0.05 && /drag the point/.test(await ev(`document.getElementById("lSub").textContent`)) && (await ev(`document.getElementById("err").textContent`)) === "");
    // the click lands on a whole pixel (synthetic events round clientY), so the expected position uses that pixel
    const dragDet = await ev(`(() => { const cv = document.getElementById("cvL"), r = cv.getBoundingClientRect(), G = window.__instex.spGeo(), xd = r.left + G.ox + G.s * G.xD;
      const cy = Math.round(r.top + G.oy - G.s * G.Ly / 4);
      cv.dispatchEvent(new MouseEvent("mousedown", { clientX: xd, clientY: cy, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      const want = Math.max(-1, Math.min(1, -((G.oy - (cy - r.top)) / G.s) / G.mag / G.hMax));
      return [window.__instex.state().g.spPos, want]; })()`);
    check("1 free: grabbing the detector places the point whose image lands there (inverted)", Math.abs(dragDet[0] - dragDet[1]) < 1e-6 && dragDet[0] < -0.3, `${dragDet[0].toFixed(3)} (click a quarter up the detector image)`);
    await click("#sp3"); await sleep(150);
    // Expand: the layout fills the window; Esc returns
    const h0 = await ev(`document.getElementById("cvL").clientHeight`);
    await click("#lvExpand"); await sleep(250);
    const h1 = await ev(`document.getElementById("cvL").clientHeight`), w1 = await ev(`document.getElementById("cvL").clientWidth`);
    check("Expand: the layout fills the window, button shows the collapse icon", h1 > h0 * 1.5 && w1 > (await ev(`innerWidth`)) * 0.9 && /Return/.test(await ev(`document.getElementById("lvExpand").getAttribute("aria-label")`)) && (await ev(`document.getElementById("err").textContent`)) === "");
    await click("#lvOptsBtn"); await sleep(100);
    await setRange("#sLL", Math.log10(900)); await sleep(250);
    check("Expanded: changing a layout option keeps the layout expanded", (await ev(`document.body.classList.contains("lv-expanded")`)) && (await ev(`document.getElementById("cvL").clientHeight`)) === h1);
    await click("#lvOptsBtn"); await sleep(100);
    await ev(`window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await sleep(250);
    check("Esc returns the layout to the page", (await ev(`document.getElementById("cvL").clientHeight`)) === h0 && /Expand/.test(await ev(`document.getElementById("lvExpand").getAttribute("aria-label")`)));
    // 3D view: turnable, snaps, color by wavelength or slit position; drawing only
    await click("#v3d"); await sleep(250);
    const q0 = await ev(`document.querySelector("#cvL").toDataURL().length`), d3a = await D();
    check("3D view: drawn, numbers unchanged, snap and color controls shown, no page error", (await vis("#v3Top")) && (await vis("#c3S")) && JSON.stringify(d3a) === JSON.stringify(d9) && (await ev(`document.getElementById("err").textContent`)) === "" && /view=3d/.test(await ev(`location.hash`)));
    await click("#v3Top"); await sleep(150); const qT = await ev(`document.querySelector("#cvL").toDataURL().length`);
    await click("#v3Side"); await sleep(150); const qS = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("3D view: Top and Side snaps draw different views", qT !== qS && qS !== q0);
    await click("#c3S"); await sleep(150);
    check("3D view: coloring by slit position redraws", (await ev(`document.querySelector("#cvL").toDataURL().length`)) !== qS && (await ev(`document.getElementById("c3S").getAttribute("aria-pressed")`)) === "true");
    await click("#c3L"); await click("#v3Obl"); await sleep(150);
    const turn = await ev(`(() => { const cv = document.getElementById("cvL"), r = cv.getBoundingClientRect(), s0 = window.__instex.lview().s, a0 = window.__instex.rot3().az;
      cv.dispatchEvent(new MouseEvent("mousedown", { clientX: r.left + 200, clientY: r.top + 150, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: r.left + 260, clientY: r.top + 170, bubbles: true }));
      const s1 = window.__instex.lview().s, a1 = window.__instex.rot3().az;
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      return [a0, a1, s0, s1, window.__instex.lview().mode]; })()`);
    check("3D view: dragging turns it and holds the scale", turn[0] !== turn[1] && Math.abs(turn[2] - turn[3]) < 1e-9 && turn[4] === "auto", `azimuth ${turn[0].toFixed(2)} -> ${turn[1].toFixed(2)}`);
    const orb = await ev(`(() => { const cv = document.getElementById("cvL"), r = cv.getBoundingClientRect(), o0 = window.__instex.rot3();
      cv.dispatchEvent(new MouseEvent("mousedown", { clientX: r.left + 200, clientY: r.top + 20, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: r.left + 200, clientY: r.top + 900, bubbles: true }));
      const o1 = window.__instex.rot3();
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: r.left + 200 + 3 * r.height, clientY: r.top + 900, bubbles: true }));
      const o2 = window.__instex.rot3();
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      return [o0.el, o1.el, o1.az, o2.az, document.getElementById("err").textContent]; })()`);
    check("3D orbit: tilts all the way to straight over (no further, no roll), spins without limit", Math.abs(orb[1] - Math.PI / 2) < 1e-9 && Math.abs(orb[3] - orb[2]) > 2 * Math.PI && orb[4] === "", `tilt ${orb[0].toFixed(2)} -> ${orb[1].toFixed(2)} rad; spin ${(orb[3] - orb[2]).toFixed(1)} rad`);
    await click("#vSpec"); await sleep(150);
    await click("#mEch"); await sleep(200);
    check("Spatial view switch hidden in echelle mode, echelle drawn in the dispersion plane", !(await vis("#vSpat")) && !/along the slit/.test(await ev(`document.getElementById("lSub").textContent`)));
    await click("#mGrat"); await sleep(150);
    await click("#vSpec"); await sleep(150);
    await click("#lvOptsBtn");
    check("Layout options close again", !(await vis("#sLL")));
    await click("#reset");
  }
  // ------------------------------------------------------------ collimator: lens or mirror (drawing only)
  {
    await click("#lvOptsBtn");
    check("collimator tilt hidden for a lens", !(await vis("#sCT")));
    const before = await D();
    const px0 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    await click("#cMirror"); const after = await D();
    const px1 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("mirror collimator: same numbers, different drawing", JSON.stringify(before) === JSON.stringify(after) && px0 !== px1 && (await ev(`window.__instex.params().col`)) === "mirror");
    check("mirror collimator: tilt slider shown at its automatic value", (await vis("#sCT")) && /auto/.test(await ev(`document.querySelector("#vCT").textContent`)));
    await setRange("#sCT", 25);
    const after2 = await D(), px2 = await ev(`document.querySelector("#cvL").toDataURL().length`);
    check("collimator tilt 25°: the drawing changes, the numbers do not", JSON.stringify(after2) === JSON.stringify(after) && px2 !== px1 && (await ev(`window.__instex.params().colTilt`)) === 25);
    await click("#lvOptsBtn");
    await click("#cLens");
  }
  // ------------------------------------------------------------ grating incidence on the transmission grating
  {
    check("grating incidence shown for the transmission grating, at the symmetric setting", (await vis("#sTA")) && /α = β/.test(await ev(`document.getElementById("rDis").textContent`)));
    const s0 = await ev(`(() => { const d = window.__instex.design(); return { a: d.alpha, b: d.beta, R: d.c.Rs }; })()`);
    await setRange("#sTA", 30);
    const s1 = await ev(`(() => { const d = window.__instex.design(), P = window.__instex.params(); return { a: d.alpha, b: d.beta, R: d.c.Rs, G: P.G, l: P.lamC, thg: d.thetaG }; })()`);
    const sb = s1.G / 1000 * s1.l / 1e4 - Math.sin(30 * Math.PI / 180);
    const Rw = (Math.sin(s1.a) + Math.sin(s1.b)) / (s1.thg * Math.cos(s1.a));
    check("grating incidence 30°: beta from the grating equation, R = (sin a + sin b)/(theta_g cos a)", Math.abs(s1.a - 30 * Math.PI / 180) < 1e-9 && Math.abs(Math.sin(s1.b) - sb) < 1e-12 && Math.abs(s1.R / Rw - 1) < 1e-5 && s1.R > s0.R,
      `beta ${(s1.b * 180 / Math.PI).toFixed(2)} deg, R ${s0.R.toFixed(0)} -> ${s1.R.toFixed(0)}`);
    await click("#reset");
    check("Reset returns the transmission grating to the symmetric setting", /α = β/.test(await ev(`document.getElementById("rDis").textContent`)));
  }
  // ------------------------------------------------------------ transmission grating
  await click("#gRefl");
  check("Reflection shows the camera angle and blaze", (await vis("#sPsi")) && (await vis("#sLB")));
  await click("#gTr");
  check("Transmission (the default) hides the camera angle and blaze", !(await vis("#sPsi")) && !(await vis("#sLB")));
  d = await D();
  check("transmission design valid", !d.bad, d.bad || d.R.toFixed(0));
  await shot("03_transmission.png");

  // ------------------------------------------------------------ echelle
  await click("#mEch"); d = await D();
  check("echelle mode: many orders, no overlap at the default", !d.bad && d.n > 50 && !d.flags.includes("ovl"), `${d.n} orders, R ${d.R.toFixed(0)}`);
  check("echelle shows its own controls", (await vis("#sEG")) && (await vis("#sGam")) && !(await vis("#sG")) && !(await vis("#sPsi")));
  await shot("04_echelle.png");
  const e0 = d;
  await setRange("#sED", 75.96); d = await D();
  check("R4 echelle: about twice the R of R2", Math.abs(d.Rs / e0.Rs - 2) < 0.06, `${(d.Rs / e0.Rs).toFixed(3)}`);
  await setRange("#sED", 63.435);
  await setRange("#sGam", 6); d = await D();
  // out of plane by gamma, R falls as cos(gamma) (validate.js checks this to 1e-6 without a cross-disperser);
  // here the cross-disperser tilts the orders under lines tilted by gamma, which costs about 1.5% more at 6 deg
  { const want = Math.cos(6 * Math.PI / 180) / Math.cos(Math.PI / 180), got = d.Rs / e0.Rs;
    check("gamma 6 deg: R lower by cos(gamma), within the 2.5% line-tilt coupling", got < want && got > 0.975 * want, `${got.toFixed(4)} vs cos ratio ${want.toFixed(4)}`); }
  await setRange("#sGam", 1);
  await setRange("#sXG", Math.log10(150)); d = await D();
  check("coarser cross-disperser: orders closer, more coverage", d.hi - d.lo > e0.hi - e0.lo, `${(d.lo * 1e4).toFixed(0)}-${(d.hi * 1e4).toFixed(0)}`);
  await setRange("#sXG", Math.log10(300));
  await setRange("#sFc", 0); d = await D();
  check("fast (f/1) camera: undersampled flag", d.flags.includes("samp"), d.npix.toFixed(2));
  await setRange("#sFc", Math.log10(3));
  const glasses = await ev(`[...document.querySelectorAll("#xGlass option")].map(o => o.value)`);
  if (glasses.length) {
    await click("#xPr"); d = await D();
    check("prism cross-disperser valid", !d.bad && d.n > 10, d.bad || `${d.n} orders`);
    const sep1 = await ev(`window.__instex.design().minSep`);
    await click("#p2"); const d2 = await D();
    const sep2 = await ev(`window.__instex.design().minSep`);
    check("double pass doubles the order spacing", !d2.bad && rel(sep2, 2 * sep1) < 0.08, `${sep1.toFixed(1)} -> ${sep2.toFixed(1)} px`);
    await shot("05_prism.png");
    await click("#xGm"); d = await D();
    check("grism cross-disperser valid", !d.bad && d.n > 10, d.bad || `${d.n} orders`);
    await click("#xGr");
  } else check("glass list present (prism / grism)", false, "no glasses in IX.GLASS");
  await click("#mGrat"); d = await D();
  check("switching back to Grating restores the grating settings", rel(d.R, d0.R) < 1e-12);

  // ------------------------------------------------------------ the detector in grating mode, and the number of objects
  await click("#reset"); await sleep(300);
  check("grating mode shows the detector", await vis("#cvD"));
  const nTr = async () => ev(`(() => { const d = window.__instex.design(); return d.objects ? d.objects.n : null; })()`);
  check("one object by default: one spectrum", (await nTr()) === 1);
  await setRange("#sNO", Math.log10(20)); await sleep(200);
  const ob = await ev(`(() => { const d = window.__instex.design(); return { n: d.objects.n, gap: d.objects.gapPx, Ny: window.__instex.params().Ny }; })()`);
  check("20 objects spread evenly over the chip height", ob.n === 20 && Math.abs(ob.gap - ob.Ny / 20) < 1e-6, `${ob.n} spectra, ${ob.gap.toFixed(1)} px apart`);
  check("gap between spectra in the Entrance readouts", /Gap between spectra/.test(await ev(`document.querySelector("#rEnt").textContent`)));
  {
    const t = await ev(`[...document.querySelectorAll("#rEnt .rd")].find(e => /trace FWHM/.test(e.textContent)).querySelector("b").textContent`);
    const want = await ev(`(() => { const d = window.__instex.design(), P = window.__instex.params(); return d.objects.gapPx / (P.slitW / d.c.pixScale); })()`);
    check("gap in trace FWHM = gap / (slit width / pixel scale)", Math.abs(Number(t) / want - 1) < 0.01, `${t} vs ${want.toFixed(3)}`);
  }
  {
    const box = await ev(`(r => ({x: r.left, y: r.top, w: r.width, h: r.height}))(document.querySelector("#cvD").getBoundingClientRect())`);
    // the chip center is the slit center, between objects 10 and 11 -> aim at object 11 (the drawing's geometry at zoom 1)
    const g0 = await ev(`(() => { const d = window.__instex.design(); const z = d.objects.zeta[10]; const p = d.pos(d.P.lamC / 1e4, d.order, 0, z); return { X: p[0], Y: p[1] }; })()`);
    const G = await ev(`window.__instex.detGeom()`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x + G.cxp + g0.X * G.s, y: box.y + G.cyp - g0.Y * G.s }); await sleep(150);
    const hv = await ev(`window.__instex.hover()`);
    check("hover names the object and reads the central wavelength", hv && hv.k === 10 && Math.abs(hv.lam * 1e4 - 5500) < 10, hv ? `object ${hv.k + 1}, ${(hv.lam * 1e4).toFixed(1)} A` : "none");
    check("hover readout shows 'object 11 of 20'", /object 11 of 20/.test(await ev(`document.querySelector("#dSub").textContent`)));
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 }); await sleep(100);
  }
  await shot("06_grating_objects.png");
  await click("#reset");

  // ------------------------------------------------------------ hover and zoom on the echelle detector
  await click("#mEch"); await sleep(300);
  check("detector canvas shown in echelle mode", await vis("#cvD"));
  const box = await ev(`(r => ({x: r.left, y: r.top, w: r.width, h: r.height}))(document.querySelector("#cvD").getBoundingClientRect())`);
  const cpos = await ev(`(() => { const d = window.__instex.design(); const L = d.local(d.mlamRef / d.mRef, d.mRef); return { X: L.X, Y: L.Y, Lx: d.Lx, Ly: d.Ly, lam: d.mlamRef / d.mRef, m: d.mRef }; })()`);
  // the drawing's geometry at zoom 1
  const G = await ev(`window.__instex.detGeom()`);
  const cx = box.x + G.cxp + cpos.X * G.s, cy = box.y + G.cyp - cpos.Y * G.s;
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: cx, y: cy }); await sleep(150);
  const hv = await ev(`window.__instex.hover()`);
  check("hover on an order reads its wavelength and order", hv && hv.m === cpos.m && Math.abs(hv.lam - cpos.lam) / cpos.lam < 2e-3, hv ? `order ${hv.m}, ${(hv.lam * 1e4).toFixed(2)} A` : "none");
  const sub = await ev(`document.querySelector("#dSub").textContent`);
  check("hover readout in the panel header", /Å/.test(sub) && /order/.test(sub), sub);
  for (let k = 0; k < 9; k++) { await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: cx, y: cy, deltaX: 0, deltaY: -250 }); await sleep(30); }
  await sleep(150);
  const z = await ev(`window.__instex.zoom()`);
  check("scroll zooms the detector about the pointer", z.z > 50, `x${z.z.toFixed(1)}`);
  await shot("07_detector_zoom.png");
  const grid = await ev(`(() => { const c = document.querySelector("#cvD"), g = c.getContext("2d"); const y = Math.floor(c.height * 0.25);
      const d = g.getImageData(0, y, c.width, 1).data; let n = 0, prev = 0; for (let i = 0; i < d.length; i += 4) { const v = d[i] + d[i + 1] + d[i + 2]; if (Math.abs(v - prev) > 25) n++; prev = v; } return n; })()`);
  check("pixel grid drawn when zoomed in", grid > 10, `${grid} edges along a row`);
  await ev(`document.querySelector("#cvD").dispatchEvent(new MouseEvent("dblclick", {bubbles: true}))`); await sleep(150);
  check("double-click resets the zoom", (await ev(`window.__instex.zoom()`)).z === 1);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 }); await sleep(100);
  await click("#reset");

  // ------------------------------------------------------------ URL hash round trip
  await setRange("#sD", 1); await click("#mEch"); await setRange("#sGam", 3.5);
  await sleep(300);                              // the link is written a moment after the last change
  const hash = await ev(`location.hash`);
  const pBefore = await ev(`window.__instex.params()`);
  await go(hash);
  const pAfter = await ev(`window.__instex.params()`);
  const okKey = k => (typeof pBefore[k] === "number" ? (pBefore[k] === pAfter[k] || rel(pAfter[k], pBefore[k]) < 1e-6) : pAfter[k] === pBefore[k]);
  const bad = Object.keys(pBefore).filter(k => !okKey(k));
  check("URL hash round trip (7 significant digits)", bad.length === 0, bad.length ? bad.map(k => `${k}: ${pBefore[k]} vs ${pAfter[k]}`).join("; ") : hash);
  await click("#reset");

  // ------------------------------------------------------------ grism (grating mode)
  {
    await click("#reset"); await sleep(200);
    await click("#gGm"); await sleep(250);
    const txt = await ev(`document.getElementById("rDis").textContent`);
    check("grism: undeviated λ0 shown, camera on axis, apex and glass controls shown, λc hidden", /Undeviated λ0/.test(txt) && /on axis/.test(txt) && (await vis("#sGA")) && (await vis("#gGlass")) && !(await vis("#sLC")) && (await ev(`document.getElementById("err").textContent`)) === "");
    const l0a = await ev(`window.__instex.design().grism.lam0`);
    await setRange("#sGA", 30); await sleep(200);
    const l0b = await ev(`window.__instex.design().grism.lam0`);
    check("grism: a larger apex angle moves λ0 to the red", l0b > l0a, `${(l0a * 1e4).toFixed(0)} -> ${(l0b * 1e4).toFixed(0)} A`);
    await click("#gkV"); await sleep(200);
    check("VPH grism: drawn and labeled, no page error", (await ev(`window.__instex.design().grism.vph`)) === true && (await ev(`document.getElementById("err").textContent`)) === "");
    await click("#gTr"); await sleep(200);
    check("back to a transmission grating: λc shown again", await vis("#sLC"));
  }

  // ------------------------------------------------------------ regressions from the 2026-10-17 audit
  {
    await go(); await sleep(200);
    const R0 = (await D()).R;
    await click("#gGm"); await sleep(200);
    const g1 = await ev(`window.__instex.state().g.G`);
    await click("#gTr"); await sleep(200);
    check("grism and back: the grating's grooves and R come back", (await ev(`window.__instex.state().g.G`)) === 1200 && rel((await D()).R, R0) < 1e-9, `${g1} -> ${await ev(`window.__instex.state().g.G`)} /mm`);
    await click("#gGm"); await sleep(200);
    const lr = await ev(`window.__instex.design().grism.lam0`);
    await click("#gkV"); await sleep(200);
    const lv = await ev(`window.__instex.design().grism.lam0`);
    check("grism: choosing it puts λ0 at λc, and switching Ruled -> VPH keeps it", Math.abs(lr - 0.55) < 0.005 && Math.abs(lv - lr) < 0.005, `${(lr * 1e4).toFixed(0)} -> ${(lv * 1e4).toFixed(0)} A`);
    await click("#gTr"); await sleep(150);
    // a preset value beyond a slider's range widens the range, so a nudge moves from the value
    await go("#preset=hectochelle");
    const sm = await ev(`(e => [+e.max, +e.value])(document.getElementById("sM"))`);
    check("slider ranges widen to a preset's value (Hectochelle order 31)", sm[0] >= 31 && sm[1] === 31, `max ${sm[0]}, value ${sm[1]}`);
    // malformed links leave the defaults alone
    await go("#g.tAlpha=&g.colTilt=abc&g.pix=0&g.gType=foo&g.W=-5&D=xyz");
    const st = await ev(`window.__instex.state()`);
    check("malformed link values are ignored, no page error", st.g.pix === 15 && st.g.gType === "trans" && st.g.W === 100 && st.D === 6.5 && st.g.colTilt === null && (await ev(`document.getElementById("err").textContent`)) === "");
    // an edited link is followed
    await ev(`location.hash = "#preset=harps"`); await sleep(400);
    check("editing the link loads it (hashchange)", (await ev(`window.__instex.params().mode`)) === "echelle" && (await ev(`document.getElementById("preset").value`)) === "harps");
    // rapid changes end in a link that matches the state
    await go(); await ev(`(() => { for (let i = 0; i < 300; i++) window.__instex.set({ g: { W: 100 + i } }); })()`); await sleep(400);
    check("after 300 rapid changes the link matches the state", /g\.W=399(&|$)/.test(await ev(`location.hash`)), await ev(`location.hash`));
    // a preset changed in the link is Custom; drawing options keep the preset's name
    await go("#preset=lris&g.W=300");
    check("a preset with a changed instrument loads as Custom", (await ev(`document.getElementById("preset").value`)) === "custom");
    await go("#preset=via"); await click("#v3d"); await click("#foOn");
    check("drawing options (3D view, fold mirror) keep the preset's name", (await ev(`document.getElementById("preset").value`)) === "via");
    // 3D: a snap stops a coast, and Auto scale refits afterwards
    const s3 = await ev(`(async () => { const cv = document.getElementById("cvL"), r = cv.getBoundingClientRect();
      cv.dispatchEvent(new MouseEvent("mousedown", { clientX: r.left + 100, clientY: r.top + 100, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: r.left + 400, clientY: r.top + 120, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      document.getElementById("v3Top").click();
      await new Promise(res => setTimeout(res, 200));
      const a = window.__instex.rot3().az, s1 = window.__instex.lview().s;
      await new Promise(res => setTimeout(res, 300));
      const a2 = window.__instex.rot3().az;
      window.__instex.set({ g: { W: 400 } });
      return [a, a2, s1, window.__instex.lview().s]; })()`);
    check("3D: a snap stops the coast, and Auto scale refits after it", s3[0] === s3[1] && s3[2] !== s3[3], `az ${s3[0].toFixed(3)} -> ${s3[1].toFixed(3)}; scale ${s3[2].toFixed(3)} -> ${s3[3].toFixed(3)}`);
    await click("#vSpec");
    // Expand: a change made while expanded, then Exit, leaves the detector bitmap at its box's size
    await go(); await click("#lvExpand"); await sleep(250);
    await ev(`window.__instex.set({ g: { W: 150 } })`); await sleep(150);
    await click("#lvExpand"); await sleep(300);
    const cvd = await ev(`(c => [c.width, Math.round(c.clientWidth * (window.devicePixelRatio || 1))])(document.getElementById("cvD"))`);
    check("Expand, change, Exit: the detector is redrawn at its own size", cvd[0] === cvd[1], `${cvd[0]} vs ${cvd[1]}`);
    // changing the detector format resets the detector zoom
    await ev(`(c => { const r = c.getBoundingClientRect(); for (let i = 0; i < 6; i++) c.dispatchEvent(new WheelEvent("wheel", { deltaY: -300, clientX: r.right - 20, clientY: r.top + r.height / 2, bubbles: true, cancelable: true })); })(document.getElementById("cvD"))`);
    const z1 = (await ev(`window.__instex.zoom()`)).z;
    await setRange("#sNx", Math.log10(1024)); await sleep(150);
    check("a new detector format resets the detector zoom", z1 > 2 && (await ev(`window.__instex.zoom()`)).z === 1, `zoom ${z1.toFixed(1)} -> ${(await ev(`window.__instex.zoom()`)).z}`);
    // Esc and a click outside close the layout options
    await go(); await click("#lvOptsBtn");
    await ev(`window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await sleep(100);
    const escClosed = !(await vis("#sLL"));
    await click("#lvOptsBtn");
    await ev(`document.querySelector(".stats").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))`); await sleep(100);
    check("Esc, or a click outside, closes the layout options", escClosed && !(await vis("#sLL")));
    // echelle orders closer than one trace width raise a warning
    await go("#mode=echelle&e.xG=30&e.slitW=3");
    check("echelle: orders closer than one trace width are flagged on the page", (await ev(`window.__instex.design().flags.some(f => f.k === "ovl")`)) && (await ev(`[...document.querySelectorAll(".flags .flag")].some(e => /trace width/.test(e.textContent + " " + e.title))`)));
    await go("#mode=echelle&e.xd=prism&e.xPrisms=" + encodeURIComponent(JSON.stringify([{ glass: "unobtainium", A: 40 }])));
    check("a link's prism train with an unknown glass is ignored", (await ev(`window.__instex.state().e.xPrisms`)) === null && (await ev(`document.getElementById("err").textContent`)) === "");
    // layout audit, 2026-10-17: lowercase lambda in the small-caps strip; the drawing's caption below it, clear of
    // the scale bar and the Expand button and hidden with the labels; the two Resets named apart; a typed grism link
    await go("#mode=echelle");
    check("results strip: the labels keep a lowercase λ", (await ev(`[...document.querySelectorAll(".stat .k")].some(e => /λ/.test(e.textContent) && getComputedStyle(e).textTransform === "none")`)));
    { const r = await ev(`(() => { const c = document.getElementById("lSub"), e = document.getElementById("lvExpand").getBoundingClientRect(), b = c.getBoundingClientRect(), v = document.getElementById("cvL").getBoundingClientRect();
        return { hid: c.hidden, txt: c.textContent, right: b.right, eLeft: e.left, left: b.left, bottom: b.bottom, vBottom: v.bottom, vLeft: v.left, oneLine: b.height < 22 }; })()`);
      check("layout caption: shown in full under the drawing, between the scale bar and Expand", !r.hid && /for clarity/.test(r.txt) && r.right <= r.eLeft && r.left > r.vLeft + 60 && r.bottom <= r.vBottom + 1, JSON.stringify(r)); }
    await click("#lvOptsBtn"); await click("#anOff");
    check("layout caption hidden with the labels", await ev(`document.getElementById("lSub").hidden`));
    await click("#anOn"); await click("#lvOptsBtn");
    // About the model: a dialog from the header; the credit line stays at the bottom of the page
    await go();
    check("footer holds only the credit line", /written by Claude/.test(await ev(`document.querySelector("footer").textContent`)) && !/ideal \(aberration-free\)/.test(await ev(`document.querySelector("footer").textContent`)));
    await click("#aboutBtn");
    const abOpen = await ev(`document.getElementById("about").open`), abTxt = await ev(`document.getElementById("about").textContent`);
    await shot("09_about.png");
    await ev(`document.getElementById("about").dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 5, clientY: 5 }))`); await sleep(100);
    check("About the model opens a dialog with the model text; a click outside closes it", abOpen && /aberration-free/.test(abTxt) && !(await ev(`document.getElementById("about").open`)));
    check("the two resets are named apart: 'Reset all' and 'Refit'", (await ev(`document.getElementById("reset").textContent`)) === "Reset all" && (await ev(`document.getElementById("lvReset").textContent`)) === "Refit");
    await go("#g.gType=grism");
    { const r = await ev(`(d => [d.bad || null, d.grism && d.grism.lam0])(window.__instex.design())`);
      check("a typed link to a grism without an apex aims the apex at λc", r[0] === null && Math.abs(r[1] - 0.55) < 0.005, JSON.stringify(r)); }
    await click("#gTr");
    check("  ... and leaving the grism brings back the grating's 1200 /mm", (await ev(`window.__instex.state().g.G`)) === 1200);
  }

  // ------------------------------------------------------------ layout pass, 2026-10-18
  {
    // labels keep off the drawing: the ink under each (darkness x opacity summed over the box) stays small
    const inkReport = async () => (await ev(`window.__instex.labels()`)).map(l => `${l.txt}:${l.ink.toFixed(0)}${l.lead ? "*" : ""}${l.optional ? "(o)" : ""}`).join(" ");
    for (const [label, hs] of [["grating", ""], ["HIRES", "#preset=hires"], ["FIRE", "#preset=fire"], ["DESI B", "#preset=desib"], ["3D", "#g.view=3d"]]) {
      await go(hs);
      // the marks' labels (W, α, β) sit at their arrows and arcs inside the beam by design, so only the names count
      const ls = (await ev(`window.__instex.labels()`)).filter(l => !l.optional);
      const worst = Math.max(...ls.map(l => l.ink));
      check(`${label} layout: every element's label placed off the optics (ink under each < 120)`, ls.length > 4 && worst < 120, await inkReport());
    }
    // the wide 2k x 4k chip gives the layout panel more of the width; a square chip keeps the even split
    await go();
    const wA = await ev(`[document.getElementById("cvL").clientWidth, document.getElementById("cvD").clientWidth]`);
    await go("#preset=desib");
    const wB = await ev(`[document.getElementById("cvL").clientWidth, document.getElementById("cvD").clientWidth]`);
    check("panel split: wider layout for a 2:1 chip, the usual split for a square one", wA[0] / wA[1] > wB[0] / wB[1] + 0.15, `${(wA[0] / wA[1]).toFixed(2)} vs ${(wB[0] / wB[1]).toFixed(2)}`);
    // one star on the whole chip shows: a bright row through the chip's middle
    await go();
    const peak = await ev(`(() => { const c = document.getElementById("cvD"), g = c.getContext("2d"), G = window.__instex.detGeom();
      const dpr = c.width / c.clientWidth, x = Math.round(G.cxp * dpr), y0 = Math.round((G.cyp - 20) * dpr), d = g.getImageData(x, y0, 1, Math.round(40 * dpr)).data;
      let m = 0; for (let i = 0; i < d.length; i += 4) m = Math.max(m, d[i] + d[i + 1] + d[i + 2]); return m / 3; })()`);
    const bare = await ev(`(() => { const c = document.getElementById("cvD"), g = c.getContext("2d"), G = window.__instex.detGeom();
      const dpr = c.width / c.clientWidth, d = g.getImageData(Math.round(G.cxp * dpr), Math.round((G.cyp - 60) * dpr), 1, 1).data; return (d[0] + d[1] + d[2]) / 3; })()`);
    check("a single star's trace shows on the whole chip (peak at least 5x the bare chip)", peak > 5 * Math.max(bare, 10), `${peak.toFixed(0)} vs chip ${bare.toFixed(0)}`);
    // the key sits in the detector header until the pointer is on a trace
    check("detector key in the header: the color ramp in µm", /µm/.test(await ev(`document.getElementById("dSub").textContent`)) && (await ev(`!!document.querySelector("#dSub .lgsw")`)));
    await go("#mode=echelle");
    check("  ... in echelle mode with the blaze and the free spectral range", /blaze/.test(await ev(`document.getElementById("dSub").textContent`)) && /FSR/.test(await ev(`document.getElementById("dSub").textContent`)));
    // Reset zoom appears only while the detector is zoomed, and resets it
    const hid0 = await ev(`document.getElementById("dzReset").hidden`);
    await ev(`(c => { const r = c.getBoundingClientRect(); for (let i = 0; i < 4; i++) c.dispatchEvent(new WheelEvent("wheel", { deltaY: -300, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true })); })(document.getElementById("cvD"))`); await sleep(150);
    const hid1 = await ev(`document.getElementById("dzReset").hidden`);
    await click("#dzReset");
    check("Reset zoom: hidden at full view, shown when zoomed, and resets the zoom", hid0 && !hid1 && (await ev(`window.__instex.zoom().z`)) === 1 && (await ev(`document.getElementById("dzReset").hidden`)));
    // the incidence row stays on one line at 1280 x 800
    await size(1280, 800); await go();
    check("1280x800: 'Incidence, α' and its value on one line", (await ev(`document.querySelector('label[for="sTA"]').getBoundingClientRect().height`)) < 26);
    await size(1440, 900);
  }

  // ------------------------------------------------------------ controls no other check moves, each against a closed form
  {
    const gapY = `(() => { const d = window.__instex.design(), m = d.mRef, a = d.local(d.mlamRef / m, m), b = d.local(d.mlamRef / (m + 1), m + 1); return Math.abs(a.Y - b.Y); })()`;
    // blaze wavelength (reflection grating): facet angle delta = asin(m G lamB / 2), lamB = lamB1 / m
    await go("#g.gType=refl"); await setRange("#sLB", Math.log10(7000));
    { const s = await ev(`window.__instex.state().g`), dl = await ev(`window.__instex.design().delta`), want = Math.asin(s.m * s.G / 1000 * (s.lamB1 / s.m / 1e4) / 2);
      check("blaze slider: facet angle asin(m G lambda_B / 2)", Math.abs(s.lamB1 - 7000) < 50 && Math.abs(dl - want) < 1e-12, `lamB1 ${s.lamB1.toFixed(0)} A, delta ${(dl * 180 / Math.PI).toFixed(3)} deg`); }
    // echelle grooves: half the grooves, twice m lambda at the blaze, the same R at the blaze center (R varies
    // along an order, and lambda_c sits elsewhere in the order once the blaze moves)
    const eRef = `(d => [d.mlamRef, d.local(d.mlamRef / d.mRef, d.mRef).Rs, window.__instex.state().e.eG])(window.__instex.design())`;
    await go("#mode=echelle"); const ea = await ev(eRef);
    await setRange("#sEG", Math.log10(15.8)); const eb = await ev(eRef);
    check("echelle grooves: m lambda at the blaze goes as 1/G, R at the blaze unchanged", rel(eb[0] / ea[0], 31.6 / eb[2]) < 1e-9 && rel(eb[1], ea[1]) < 1e-4, `G ${eb[2].toFixed(3)}: m lambda ${ea[0].toFixed(3)} -> ${eb[0].toFixed(3)} um, R ${ea[1].toFixed(0)} -> ${eb[1].toFixed(0)}`);
    // detector rows: the chip height is Ny pixels
    await setRange("#sNy", Math.log10(2048));
    { const r = await ev(`[window.__instex.design().Ly, window.__instex.state().e.Ny, window.__instex.state().e.pix, document.getElementById("detSel").value]`);
      check("detector rows: chip height Ny x pixel, format turns Custom", rel(r[0], r[1] * r[2] / 1000) < 1e-12 && Math.abs(r[1] - 2048) < 30 && r[3] === "custom", `${r[1]} rows, ${r[0].toFixed(2)} mm`); }
    // VPH cross-disperser: order gaps grow as lambda squared, as for a grating
    await go("#mode=echelle"); await click("#xVp");
    { const r = await ev(`(() => { const d = window.__instex.design(), ms = d.orders.map(o => o.m), mb = Math.max(...ms) - 1, mr = Math.min(...ms);
        const gap = m => Math.abs(d.local(d.mlamRef / m, m).Y - d.local(d.mlamRef / (m + 1), m + 1).Y);
        return [window.__instex.state().e.xd, gap(mr) / gap(mb), (mb / mr) ** 2]; })()`);
      check("VPH cross-disperser: order gaps grow as lambda squared (to 3%)", r[0] === "vph" && rel(r[1], r[2]) < 0.03, `red/blue gap ${r[1].toFixed(3)} vs ${r[2].toFixed(3)}`); }
    // prism apex and glass: a larger apex, or a more dispersive glass, spreads the orders
    await go("#mode=echelle&e.xd=prism"); const g40 = await ev(gapY);
    await setRange("#sXA", 55); const g55 = await ev(gapY);
    check("prism apex 40 -> 55 deg: orders farther apart", g55 > 1.3 * g40, `${g40.toFixed(4)} -> ${g55.toFixed(4)} mm`);
    await go("#mode=echelle&e.xd=prism");
    await ev(`(s => { s.value = "SF6"; s.dispatchEvent(new Event("change")); })(document.getElementById("xGlass"))`); await sleep(200);
    const gSF = await ev(gapY);
    check("prism glass silica -> SF6: orders farther apart, menu follows", gSF > 3 * g40 && (await ev(`window.__instex.state().e.xGlass`)) === "SF6", `${g40.toFixed(4)} -> ${gSF.toFixed(4)} mm`);
    // the grism's glass: lambda0 solves (n(lambda0) - 1) sin A = m G lambda0 for the new glass
    await go(); await click("#gGm");
    const l0bk = await ev(`window.__instex.design().grism.lam0`);
    await ev(`(s => { s.value = "SF6"; s.dispatchEvent(new Event("change")); })(document.getElementById("gGlass"))`); await sleep(200);
    { const r = await ev(`(() => { const d = window.__instex.design(), s = window.__instex.state().g, l = d.grism.lam0; return [l, (IX.nGlass("SF6", l) - 1) * Math.sin(s.gA * Math.PI / 180) / (s.m * s.G / 1000)]; })()`);
      check("grism glass N-BK7 -> SF6: lambda0 moves and solves the grism equation", Math.abs(r[0] - r[1]) < 1e-9 && r[0] > l0bk, `${(l0bk * 1e4).toFixed(0)} -> ${(r[0] * 1e4).toFixed(0)} A`); }
    // VPH -> Ruled keeps lambda0, as Ruled -> VPH does
    await go(); await click("#gGm"); await click("#gkV"); const lv = await ev(`window.__instex.design().grism.lam0`);
    await click("#gkR"); const lr = await ev(`window.__instex.design().grism.lam0`);
    check("grism: switching VPH -> Ruled keeps lambda0", Math.abs(lr - lv) < 0.005 && (await ev(`window.__instex.state().g.gKind`)) === "ruled", `${(lv * 1e4).toFixed(0)} -> ${(lr * 1e4).toFixed(0)} A`);
    // every key survives the link: set each one away from its default, reload from the hash, compare the whole state
    await go();
    await ev(`window.__instex.set({ mode: "echelle", D: 8.2, F: 13.6,
      g: { slitW: 1.3, traceW: 2.1, nObj: 3, col: "mirror", colTilt: 4.5, layLen: 700, foldOn: true, foldAng: 120, foldPos: 0.3, gFlip: true, annot: false, view: "spatial", spPts: 1, spPos: 0.25,
           W: 120, Fc: 2.2, fcam: 260, gType: "refl", G: 600, m: 2, lamB1: 7000, lamC: 6000, psi: 30, tAlpha: 20, gA: 30, gGlass: "SF6", gKind: "vph", gTilt: 3, Nx: 2048, Ny: 1024, pix: 13.5 },
      e: { slitW: 0.7, traceW: 0.9, nObj: 2, col: "mirror", colTilt: -3, layLen: 900, foldOn: true, foldAng: 200, foldPos: 0.7, gFlip: true, annot: false,
           W: 200, Fc: 2.5, fcam: 500, eG: 41.6, eDelta: 70, gamma: 2, theta: 1.5, xd: "prism", xG: 250, xPsi: 12, xGlass: "LF5", xA: 35, xPasses: 2,
           xPrisms: [{ glass: "silica", A: 46 }, { glass: "N-BK7", A: 30 }], lamC: 6500, Nx: 6144, Ny: 6160, pix: 10 } })`);
    await sleep(300);
    const sBefore = await ev(`window.__instex.state()`), hAll = await ev(`location.hash`);
    await go(hAll);
    const sAfter = await ev(`window.__instex.state()`);
    const diff = [];
    for (const k of Object.keys(sBefore)) {
      if (k === "g" || k === "e") { for (const j of Object.keys(sBefore[k])) if (JSON.stringify(sBefore[k][j]) !== JSON.stringify(sAfter[k][j])) diff.push(`${k}.${j}: ${JSON.stringify(sBefore[k][j])} vs ${JSON.stringify(sAfter[k][j])}`); }
      else if (JSON.stringify(sBefore[k]) !== JSON.stringify(sAfter[k])) diff.push(`${k}: ${sBefore[k]} vs ${sAfter[k]}`);
    }
    const nKeys = Object.keys(sBefore.g).length + Object.keys(sBefore.e).length + 3;
    check(`every key (${nKeys}) set away from its default survives the link`, diff.length === 0 && hAll.split("&").length >= nKeys, diff.join("; ") || `${hAll.split("&").length} fields`);
  }

  // ------------------------------------------------------------ presets
  const presets = await ev(`[...document.querySelectorAll("#preset option")].map(o => o.value).filter(v => v !== "custom")`);
  check("every preset in the menu", presets.length === (await ev(`window.IX_PRESETS.length`)) && presets.length >= 38, presets.length + ": " + presets.join(", "));
  for (const p of presets) {
    await ev(`(s => { s.value = ${JSON.stringify(p)}; s.dispatchEvent(new Event("change")); })(document.querySelector("#preset"))`); await sleep(250);
    d = await D();
    const colWant = { lris: "mirror", hires: "mirror", mikered: "lens", mikeblue: "lens", harps: "mirror", desib: "mirror", desir: "mirror", desiz: "mirror", boomboxb: "lens", boomboxr: "lens", via: "mirror",
      deimos: "mirror", binospec: "lens", xshuvb: "mirror", xshvis: "mirror", xshnir: "mirror",
      hectospec: "mirror", hectochelle: "mirror", gclef: "mirror" }[p];
    if (colWant) check(`preset ${p}: ${colWant} collimator, as sourced`, (await ev(`window.__instex.params().col`)) === colWant);
    check(`preset ${p} loads`, !d.bad, d.bad || `R ${d.R.toFixed(0)}, ${(d.lo * 1e4).toFixed(0)}-${(d.hi * 1e4).toFixed(0)} A`);
    await shot(`p_${p}.png`);
  }
  if (presets.length) {
    await setRange("#sD", 0.5);
    check("moving a control after a preset turns it Custom", (await ev(`document.querySelector("#preset").value`)) === "custom");
  }
  await click("#reset");

  // ------------------------------------------------------------ layout: one screen, every mode
  for (const [w, h] of [[1440, 900], [1280, 800]]) {
    await size(w, h);
    for (const [label, hash2] of [["grating", ""], ["grating transmission", "#g.gType=trans"], ["echelle", "#mode=echelle"], ["echelle prism", "#mode=echelle&e.xd=prism"], ["HARPS preset", "#preset=harps"], ["X-Shooter NIR preset", "#preset=xshnir"], ["G-CLEF preset", "#preset=gclef"], ["Hectospec preset", "#preset=hectospec"]]) {
      await go(hash2);
      const f = await fit();
      check(`${w}x${h} ${label}: controls end inside the window, no sideways scroll`, f.bottom <= f.vh + 0.5 && f.sw <= f.cw, `bottom ${f.bottom.toFixed(0)} / ${f.vh}`);
    }
    await go(); await shot(`08_fit_${w}.png`);
  }
  // the header note stays on one line with room to spare, also at a larger default font size (18 px)
  await size(1440, 900); await go();
  for (const fs of ["", "18px"]) {
    const r = await ev(`(fs => { document.documentElement.style.fontSize = fs; const n = document.querySelector(".presetnote"), a = document.getElementById("aboutBtn");
      const lh = parseFloat(getComputedStyle(n).lineHeight), out = { lines: Math.round(n.getBoundingClientRect().height / lh), gap: a.getBoundingClientRect().left - n.getBoundingClientRect().right };
      document.documentElement.style.fontSize = ""; return out; })(${JSON.stringify(fs)})`);
    check(`1440x900 header note on one line (root font ${fs || "default"})`, r.lines === 1, JSON.stringify(r));
  }
  // the panels take the height left over: in the default (shorter) grating controls, the controls still end at the bottom
  await size(1440, 900); await go();
  { const f = await fit(); check("1440x900 grating: the panels grow to fill the window (controls end at its bottom)", f.bottom > f.vh - 12 && f.bottom <= f.vh + 0.5, `bottom ${f.bottom.toFixed(0)} / ${f.vh}`); }
  await size(1280, 800);
  // every preset at the smaller laptop screen (the tighter one)
  {
    const ids = await ev(`window.IX_PRESETS.map(p => p.id)`), over = [];
    for (const id of ids) { await send("Page.navigate", { url: URL0 + "?r=" + Math.random() + "#preset=" + id }); await sleep(450); const f = await fit(); if (!(f.bottom <= f.vh + 0.5 && f.sw <= f.cw)) over.push(`${id} ${f.bottom.toFixed(0)}`); }
    check(`1280x800: every preset's controls fit (${ids.length})`, over.length === 0, over.join(", "));
  }
  // the phone layout: the header's buttons are not covered by the panel's boxes
  await size(390, 844); await go("#g.view=3d");
  check("phone width: the layout header's buttons are reachable", (await ev(`["lvOptsBtn", "lvAuto", "lvFixed", "lvReset", "v3d"].every(id => { const r = document.getElementById(id).getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e && e.id === id; })`)));
  await size(390, 844); await go();
  const ph = await fit();
  check("phone width: no sideways scroll", ph.sw <= ph.cw, `${ph.sw} vs ${ph.cw}`);
  await shot("09_phone.png");
  await size(1440, 900);

  // ------------------------------------------------------------ Imager mode (2026-10-19)
  await size(1440, 900); await go();
  const r0 = await ev(`window.__instex.design().c.Reff`);
  await ev(`document.getElementById("iImg").click()`); await sleep(500);
  {
    const st = await ev(`({ cls: document.body.className, spec: getComputedStyle(document.querySelector(".panels.only-spec")).display, img: getComputedStyle(document.getElementById("imgPanels")).display,
      stats: document.querySelectorAll("#stats .stat").length, ps: window.__instex.img().design().pixScale, hash: location.hash, menu: document.getElementById("preset").options.length })`);
    check("Imager switch: imager panels shown, spectrograph hidden", /inst-img/.test(st.cls) && st.spec === "none" && st.img !== "none", st.cls);
    check("Imager default: four figures in the strip, 0.258″/px", st.stats === 4 && Math.abs(st.ps - 0.25783) < 1e-4, `${st.stats} figures, ${st.ps}`);
    check("Imager: the link says inst=img", /inst=img/.test(st.hash), st.hash);
    check("Imager: the preset menu lists the imager presets", st.menu > 15, st.menu + " options");
  }
  await ev(`document.getElementById("iSpec").click()`); await sleep(400);
  check("back to the Spectrograph: its state kept", (await ev(`document.body.className.includes("inst-spec") && Math.abs(window.__instex.design().c.Reff - ${r0}) < 1e-6`)));
  // every imager preset: no errors, one screen at both laptop sizes
  {
    const ids = await ev(`window.IX_IPRESETS.map(p => p.id)`);
    for (const [w, h] of [[1440, 900], [1280, 800]]) {
      await size(w, h);
      const over = [], bad = [];
      for (const id of ids) {
        await send("Page.navigate", { url: URL0 + "?r=" + Math.random() + "#inst=img&ipreset=" + id }); await sleep(500);
        const f = await fit(); if (!(f.bottom <= f.vh + 0.5 && f.sw <= f.cw)) over.push(`${id} ${f.bottom.toFixed(0)}`);
        const r = await ev(`({ p: document.getElementById("preset").value, bad: window.__instex.img().design().bad || "" })`);
        if (r.p !== id || r.bad) bad.push(id + ":" + r.p + r.bad);
      }
      check(`${w}x${h}: every imager preset loads by its link (${ids.length})`, bad.length === 0, bad.join(", "));
      check(`${w}x${h}: every imager preset's controls fit`, over.length === 0, over.join(", "));
    }
    await size(1440, 900);
  }
  // the link carries the state, the drawing options and a preset's mosaic pattern
  await go("#inst=img&ipreset=hsc");
  await ev(`window.__instex.img().set({ D: 7.5, tel: "schmidt", stretch: true, view: "inst", seeing: 1.1 })`); await sleep(400);
  {
    const h1 = await ev(`location.hash`), s1 = await ev(`JSON.stringify(window.__instex.img().state())`);
    await go(h1);
    const s2 = await ev(`JSON.stringify(window.__instex.img().state())`);
    check("Imager link round trip (state, drawing options, the HSC rows, gaps and turned chips)", s1 === s2, h1.slice(0, 120));
    check("Imager: a changed preset is Custom", (await ev(`document.getElementById("preset").value`)) === "custom");
  }
  // stretch: the Instrument view of a long, thin reimager fills the panel
  await go("#inst=img&ipreset=mosfirei&i.view=inst");
  const capA = await ev(`document.getElementById("ilSub").textContent`);
  await ev(`document.getElementById("isOn").click()`); await sleep(300);
  const capB = await ev(`document.getElementById("ilSub").textContent`);
  check("Stretched heights: the caption gives the factor", !/stretched/.test(capA) && /Heights stretched × \d/.test(capB), capB.slice(0, 40));
  // sky zoom: the wheel zooms about the pointer, the reset button appears, double-click resets
  await go("#inst=img");
  {
    const z = await ev(`(async () => { const c = document.getElementById("cvS"), r = c.getBoundingClientRect();
      for (let k = 0; k < 8; k++) { c.dispatchEvent(new WheelEvent("wheel", { deltaY: -300, clientX: r.left + r.width * 0.55, clientY: r.top + r.height * 0.45, bubbles: true, cancelable: true })); await new Promise(q => setTimeout(q, 20)); }
      const a = window.__instex.img().zoom().z, btn = !document.getElementById("szReset").hidden;
      c.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })); await new Promise(q => setTimeout(q, 50));
      return { a, btn, b: window.__instex.img().zoom().z }; })()`);
    check("Sky: wheel zooms in, Reset zoom shows, double-click resets", z.a > 10 && z.btn && z.b === 1, JSON.stringify(z));
  }
  // the header note on one line in the Imager too, at a larger default font
  {
    const r = await ev(`(() => { document.documentElement.style.fontSize = "18px"; const n = document.querySelector(".presetnote"); const lh = parseFloat(getComputedStyle(n).lineHeight); const k = Math.round(n.getBoundingClientRect().height / lh); document.documentElement.style.fontSize = ""; return k; })()`);
    check("Imager 1440x900: header note on one line (root font 18px)", r === 1, r + " lines");
  }
  // speed: the whole page redrawn (layout and sky) for the largest mosaic
  await go("#inst=img&ipreset=lsst");
  {
    const t = await ev(`(() => { const t0 = performance.now(); for (let i = 0; i < 5; i++) window.__instex.img().set({ seeing: 0.7 + 0.01 * i }); return (performance.now() - t0) / 5; })()`);
    check("Imager redraw time (LSSTCam, 189 chips)", t < 250, `${t.toFixed(1)} ms per frame`);
  }
  await go("#inst=img&ipreset=nirc2n");
  {
    const t = await ev(`(async () => { const c = document.getElementById("cvS"), r = c.getBoundingClientRect(), t0 = performance.now();
      for (let k = 0; k < 6; k++) { c.dispatchEvent(new WheelEvent("wheel", { deltaY: -300, clientX: r.left + r.width * 0.6, clientY: r.top + r.height * 0.4, bubbles: true, cancelable: true })); }
      return (performance.now() - t0) / 6; })()`);
    check("Sky zoom redraw time (NIRC2, pixel mode with Airy rings)", t < 250, `${t.toFixed(1)} ms per step`);
  }
  await shot("10_imager.png");

  // ------------------------------------------------------------ speed
  await go("#mode=echelle");
  const t = await ev(`(() => { const t0 = performance.now(); for (let i = 0; i < 10; i++) window.__instex.set({ e: { W: 150 + i } }); return (performance.now() - t0) / 10; })()`);
  check("echelle redraw time", t < 120, `${t.toFixed(1)} ms per frame`);
  await go();
  const t2 = await ev(`(() => { const t0 = performance.now(); for (let i = 0; i < 10; i++) window.__instex.set({ g: { W: 100 + i } }); return (performance.now() - t0) / 10; })()`);
  check("grating redraw time", t2 < 40, `${t2.toFixed(1)} ms per frame`);

  check("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  console.log(`\n${passes} passed, ${fails} failed`);
  ws.close(); process.exit(fails ? 1 : 0);
})();
