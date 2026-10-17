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
  const fit = async () => ev(`(() => { const r = document.querySelector(".controls").getBoundingClientRect(); return { bottom: r.bottom, vh: innerHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; })()`);
  await send("Page.enable"); await send("Runtime.enable"); await send("Log.enable");
  await size(1440, 900);

  // ------------------------------------------------------------ load and defaults
  await go();
  let d0 = await D();
  check("page loads, default grating design valid", !d0.bad && d0.n === 1, `R ${d0.R && d0.R.toFixed(0)}`);
  const statR = await ev(`document.querySelector(".stat.big .v").textContent`);
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
    const dragDet = await ev(`(() => { const cv = document.getElementById("cvL"), r = cv.getBoundingClientRect(), G = window.__instex.spGeo(), xd = r.left + G.ox + G.s * G.xD;
      cv.dispatchEvent(new MouseEvent("mousedown", { clientX: xd, clientY: r.top + G.oy - G.s * G.Ly / 4, bubbles: true }));
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      return window.__instex.state().g.spPos; })()`);
    check("1 free: grabbing the detector places the point whose image lands there (inverted)", Math.abs(dragDet + 0.5) < 0.08);
    await click("#sp3"); await sleep(150);
    // Expand: the layout fills the window; Esc returns
    const h0 = await ev(`document.getElementById("cvL").clientHeight`);
    await click("#lvExpand"); await sleep(250);
    const h1 = await ev(`document.getElementById("cvL").clientHeight`), w1 = await ev(`document.getElementById("cvL").clientWidth`);
    check("Expand: the layout fills the window, button reads Exit", h1 > h0 * 1.5 && w1 > (await ev(`innerWidth`)) * 0.9 && (await ev(`document.getElementById("lvExpand").textContent`)) === "Exit" && (await ev(`document.getElementById("err").textContent`)) === "");
    await click("#lvOptsBtn"); await sleep(100);
    await setRange("#sLL", Math.log10(900)); await sleep(250);
    check("Expanded: changing a layout option keeps the layout expanded", (await ev(`document.body.classList.contains("lv-expanded")`)) && (await ev(`document.getElementById("cvL").clientHeight`)) === h1);
    await click("#lvOptsBtn"); await sleep(100);
    await ev(`window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await sleep(250);
    check("Esc returns the layout to the page", (await ev(`document.getElementById("cvL").clientHeight`)) === h0 && (await ev(`document.getElementById("lvExpand").textContent`)) === "Expand");
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
    check("grating incidence shown for the transmission grating, at the symmetric setting", (await vis("#sTA")) && /sym/.test(await ev(`document.querySelector("#vTA").textContent`)));
    const s0 = await ev(`(() => { const d = window.__instex.design(); return { a: d.alpha, b: d.beta, R: d.c.Rs }; })()`);
    await setRange("#sTA", 30);
    const s1 = await ev(`(() => { const d = window.__instex.design(), P = window.__instex.params(); return { a: d.alpha, b: d.beta, R: d.c.Rs, G: P.G, l: P.lamC, thg: d.thetaG }; })()`);
    const sb = s1.G / 1000 * s1.l / 1e4 - Math.sin(30 * Math.PI / 180);
    const Rw = (Math.sin(s1.a) + Math.sin(s1.b)) / (s1.thg * Math.cos(s1.a));
    check("grating incidence 30°: beta from the grating equation, R = (sin a + sin b)/(theta_g cos a)", Math.abs(s1.a - 30 * Math.PI / 180) < 1e-9 && Math.abs(Math.sin(s1.b) - sb) < 1e-12 && Math.abs(s1.R / Rw - 1) < 1e-5 && s1.R > s0.R,
      `beta ${(s1.b * 180 / Math.PI).toFixed(2)} deg, R ${s0.R.toFixed(0)} -> ${s1.R.toFixed(0)}`);
    await click("#reset");
    check("Reset returns the transmission grating to the symmetric setting", /sym/.test(await ev(`document.querySelector("#vTA").textContent`)));
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
  check("gamma 6 deg: R lower by about cos(gamma)", d.Rs < e0.Rs && d.Rs > 0.97 * e0.Rs, `${(d.Rs / e0.Rs).toFixed(4)}`);
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
    await click("#p2"); const d2 = await D();
    check("double pass spreads the orders further (less coverage)", !d2.bad && (d2.hi - d2.lo) < (d.hi - d.lo), `${(d2.lo * 1e4).toFixed(0)}-${(d2.hi * 1e4).toFixed(0)}`);
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
    // grating margins 14 / 14 / 8 / 34; the chip center is the slit center, between objects 10 and 11 -> aim at object 11
    const g0 = await ev(`(() => { const d = window.__instex.design(); const z = d.objects.zeta[10]; const p = d.pos(d.P.lamC / 1e4, d.order, 0, z); return { X: p[0], Y: p[1], Lx: d.Lx, Ly: d.Ly }; })()`);
    const aw = box.w - 28, ah = box.h - 42, s0 = Math.min(aw / g0.Lx, ah / g0.Ly);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x + 14 + aw / 2 + g0.X * s0, y: box.y + 8 + ah / 2 - g0.Y * s0 }); await sleep(150);
    const hv = await ev(`window.__instex.hover()`);
    check("hover names the object and reads the central wavelength", hv && hv.k === 10 && Math.abs(hv.lam * 1e4 - 5500) < 10, hv ? `object ${hv.k + 1}, ${(hv.lam * 1e4).toFixed(1)} A` : "none");
    check("hover readout shows 'object 11 of 20'", /object 11 of 20/.test(await ev(`document.querySelector("#dSub").textContent`)));
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 }); await sleep(100);
  }
  await shot("06_grating_objects.png");
  await click("#reset");

  // ------------------------------------------------------------ hover and zoom on the echelle detector
  await click("#mEch"); await sleep(300);
  check("detector canvas shown in echelle mode", (await vis("#cvD")) && !(await vis("#cvS")));
  const box = await ev(`(r => ({x: r.left, y: r.top, w: r.width, h: r.height}))(document.querySelector("#cvD").getBoundingClientRect())`);
  const cpos = await ev(`(() => { const d = window.__instex.design(); const L = d.local(d.mlamRef / d.mRef, d.mRef); return { X: L.X, Y: L.Y, Lx: d.Lx, Ly: d.Ly, lam: d.mlamRef / d.mRef, m: d.mRef }; })()`);
  // geometry of drawDetector at zoom 1: margins 44 / 56 / 22 / 8
  const aw = box.w - 100, ah = box.h - 30, s0 = Math.min(aw / cpos.Lx, ah / cpos.Ly);
  const cx = box.x + 44 + aw / 2 + cpos.X * s0, cy = box.y + 22 + ah / 2 - cpos.Y * s0;
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
  const hash = await ev(`location.hash`);
  const pBefore = await ev(`window.__instex.params()`);
  await go(hash);
  const pAfter = await ev(`window.__instex.params()`);
  const okKey = k => (typeof pBefore[k] === "number" ? (pBefore[k] === pAfter[k] || rel(pAfter[k], pBefore[k]) < 1e-6) : pAfter[k] === pBefore[k]);
  const bad = Object.keys(pBefore).filter(k => !okKey(k));
  check("URL hash round trip (7 significant digits)", bad.length === 0, bad.length ? bad.map(k => `${k}: ${pBefore[k]} vs ${pAfter[k]}`).join("; ") : hash);
  await click("#reset");

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
  await size(390, 844); await go();
  const ph = await fit();
  check("phone width: no sideways scroll", ph.sw <= ph.cw, `${ph.sw} vs ${ph.cw}`);
  await shot("09_phone.png");
  await size(1440, 900);

  // ------------------------------------------------------------ speed
  await go("#mode=echelle");
  const t = await ev(`(() => { const t0 = performance.now(); for (let i = 0; i < 10; i++) window.__instex.set({ e: { W: 150 + i } }); return (performance.now() - t0) / 10; })()`);
  check("echelle redraw time", t < 120, `${t.toFixed(1)} ms per frame`);
  await go();
  const t2 = await ev(`(() => { const t0 = performance.now(); for (let i = 0; i < 10; i++) window.__instex.set({ g: { W: 100 + i } }); return (performance.now() - t0) / 10; })()`);
  check("grating redraw time", t2 < 40, `${t2.toFixed(1)} ms per frame`);

  check("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  console.log(`\n${passes} passed, ${fails} failed`);
  ws.close(); chrome.kill(); process.exit(fails ? 1 : 0);
})();
