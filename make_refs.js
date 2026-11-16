#!/usr/bin/env node
// Build web/refs.js (window.IX_REFS) from data/refs_map.json.  Each reference in the map names a source by file and
// key in the research tables under data/; the link comes from that table, so a reference cannot point anywhere the
// research did not.  The script fails if a reference does not resolve, if its short citation does not match the
// table's citation (first word and year), or if a preset of any of the four modes has no reference.
//
//   node make_refs.js            write web/refs.js
//   node make_refs.js --check    fail if web/refs.js differs from what the map gives (deploy.sh runs this)
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = __dirname, OUT = path.join(ROOT, "web/refs.js");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "data/refs_map.json"), "utf8"));
const errs = [];

// the source tables: { key: {cite, url} } per file (JSON twins); Markdown files are searched as text
const tables = {};
function table(file) {
  if (file in tables) return tables[file];
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return (tables[file] = null);
  const txt = fs.readFileSync(p, "utf8");
  if (!file.endsWith(".json")) return (tables[file] = { md: txt });
  const S = JSON.parse(txt).sources || {}, t = {};
  const ents = Array.isArray(S) ? S.map(s => Array.isArray(s) ? s : [s.key || s.id, s]) : Object.entries(S);
  for (const [k, s] of ents) t[k] = { cite: s.cite || s.document || s.title || "", url: s.url || "" };
  return (tables[file] = t);
}

// links: a paper's ADS abstract page when the map gives its bibcode (ads); else the document's landing page where
// there is one (arXiv abstract, ADS abstract), else the URL as recorded in the source table
function link(u) {
  u = String(u || "").trim().split(/\s+/)[0];
  let m = u.match(/^https?:\/\/arxiv\.org\/pdf\/(.+?)(?:\.pdf)?$/);
  if (m) return "https://arxiv.org/abs/" + m[1];
  m = u.match(/^https?:\/\/articles\.adsabs\.harvard\.edu\/(?:pdf|full|abs)\/([^/?#]+)/);
  if (m) return "https://ui.adsabs.harvard.edu/abs/" + decodeURIComponent(m[1]);
  return u;
}

const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function resolve(r, where) {
  if (!r || !r.file || !r.key || !r.text) { errs.push(where + ": a reference needs file, key and text"); return null; }
  const t = table(r.file);
  if (!t) { errs.push(where + ": no file " + r.file); return null; }
  let url, cite;
  if (t.md !== undefined) {                                     // a Markdown table: the URL must occur in the file
    url = r.url || "";
    if (url && !t.md.includes(url)) errs.push(where + ": " + url + " does not occur in " + r.file);
    if (!url && !/\binternal\b/i.test(r.text)) errs.push(where + ": no URL, and the citation does not say internal");
    cite = t.md;
  } else {
    const s = t[r.key];
    if (!s) { errs.push(where + ": no key " + r.key + " in " + r.file); return null; }
    url = s.url; cite = s.cite;
  }
  // the short citation's first word (an author or an issuer) and its year must appear in the table's citation
  const first = r.text.split(/[\s,]/)[0], yr = (r.text.match(/\b(1[89]|20)\d\d\b/) || [])[0];
  if (t.md === undefined && !norm(cite).includes(norm(first))) errs.push(where + ": '" + first + "' is not in the citation of " + r.key);
  if (t.md === undefined && yr && !cite.includes(yr)) errs.push(where + ": year " + yr + " is not in the citation of " + r.key);
  // a paper with an ADS bibcode links to its ADS abstract page; the bibcode's year must be the citation's
  if (r.ads) {
    if (!/^\d{4}[A-Za-z][A-Za-z0-9&.]{13}[A-Z.]$/.test(r.ads)) errs.push(where + ": malformed bibcode " + r.ads);
    else if (yr && r.ads.slice(0, 4) !== yr) errs.push(where + ": bibcode " + r.ads + " is not from " + yr);
    return { t: r.text, u: "https://ui.adsabs.harvard.edu/abs/" + encodeURIComponent(r.ads) + "/abstract" };
  }
  return { t: r.text, u: link(url) };
}

// the presets of the four modes
global.window = global;
const SPEC = require("./web/presets.js");
require("./web/ipresets.js"); require("./web/tpresets.js"); require("./web/rpresets.js");
const MODES = { spec: SPEC.map(p => p.id), img: window.IX_IPRESETS.map(p => p.id),
  tel: window.IX_TELESCOPES.map(t => t.id), int: window.IX_ARRAYS.map(a => a.id) };

const out = { model: {} };
for (const [m, ids] of Object.entries(MODES)) {
  out[m] = {};
  const mm = map[m] || {};
  for (const id of ids) {
    const rs = mm[id];
    if (!rs || !rs.length) { errs.push(m + "/" + id + ": no reference"); continue; }
    const seen = new Set();
    out[m][id] = rs.map((r, i) => resolve(r, m + "/" + id + "[" + i + "]")).filter(r => {
      if (!r) return false;
      const k = r.t + "|" + r.u; if (seen.has(k)) { errs.push(m + "/" + id + ": duplicate " + r.t); return false; }
      seen.add(k); return true;
    });
  }
  for (const id of Object.keys(mm)) if (!ids.includes(id)) errs.push(m + "/" + id + ": in the map but not a preset");
  out.model[m] = ((map.model || {})[m] || []).map((r, i) => resolve(r, "model/" + m + "[" + i + "]")).filter(Boolean);
  if (!out.model[m].length) errs.push("model/" + m + ": no reference");
}

if (errs.length) { console.error(errs.join("\n")); console.error(errs.length + " problem(s); web/refs.js not written"); process.exit(1); }
const js = "/* The references of each preset and of the model in each mode (window.IX_REFS), built by make_refs.js from\n" +
  "   data/refs_map.json and the source tables in data/ (do not edit by hand).  A reference is { t: the short citation,\n" +
  "   u: the link (empty for an internal document) }. */\n" +
  "window.IX_REFS = " + JSON.stringify(out) + ";\n";
const n = Object.values(MODES).reduce((s, ids) => s + ids.length, 0);
if (process.argv.includes("--check")) {
  const old = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (old !== js) { console.error("web/refs.js is out of date: run node make_refs.js"); process.exit(1); }
  console.log("web/refs.js up to date: " + n + " presets, each with a reference");
} else {
  fs.writeFileSync(OUT, js);
  console.log("wrote web/refs.js: " + n + " presets, " + Object.values(out.model).reduce((s, r) => s + r.length, 0) + " model references");
}
