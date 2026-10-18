// Screenshot a page state:  node shot.js "<url with #hash>" out.png [width] [height] [full|view] ["js to run first"]
// Prints any page errors.  "view" captures the viewport only (to judge the no-scroll layout).
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const [url, out, W = "1440", H = "900", mode = "view", js = ""] = process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", PORT = 9400 + Math.floor(Math.random() * 500);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const prof = fs.mkdtempSync("/tmp/instex-shot-");
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`,
    `--window-size=${W},${H}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
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
  for (let i = 0; i < 50 && !tabs; i++) { await sleep(200); try { tabs = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch (e) {} }
  const ws = new WebSocket(tabs.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const pend = new Map(); const errs = [];
  ws.addEventListener("message", ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: +(process.env.DSF || 1), mobile: false });
  await send("Page.navigate", { url });
  await sleep(1800);
  if (js) { const r = await send("Runtime.evaluate", { expression: js, returnByValue: true, awaitPromise: true }); if (r.result?.result?.value !== undefined) console.log(JSON.stringify(r.result.result.value)); await sleep(600); }
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: mode === "full" });
  fs.writeFileSync(out, Buffer.from(r.result.data, "base64"));
  if (errs.length) console.log("PAGE ERRORS:\n" + errs.join("\n"));
  ws.close(); process.exit(0);
})();
