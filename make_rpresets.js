// Build web/rpresets.js (window.IX_ARRAYS, the Interferometer mode's arrays) from the sourced records in
// data/interf/*.json:  node make_rpresets.js
// Each record carries its sources; this script only reshapes: antenna positions (local east, north, up, m, rounded
// to the millimeter), the site's latitude, the dish, the elevation limit, the bands, the primary beam's relation.
"use strict";
const fs = require("fs");
const path = require("path");
const rd = f => JSON.parse(fs.readFileSync(path.join(__dirname, "data", "interf", f), "utf8"));
const mm = x => Math.round(x * 1000) / 1000;
const out = [];

// ---- VLA (data/interf/vla.json): the A, B, C and D configurations from CASA's vla.*.cfg; the 4-band system is
// left out (under development, and the primary-beam relation is stated only from P-band up)
{
  const j = rd("vla.json");
  out.push({
    id: "vla", name: "VLA", site: "New Mexico", lat: j.geometry.reference_point.wgs84_lat_deg, dish: j.dish_m, elLimit: j.elev_limit_deg,
    pb: { arcminGHz: j.pb_relation.fwhm_arcmin_x_GHz, band: { P: j.pb_relation.p_band_fwhm_arcmin_x_GHz } },
    pbSource: "θ ≈ " + j.pb_relation.fwhm_arcmin_x_GHz + "′ / ν(GHz), " + j.pb_relation.p_band_fwhm_arcmin_x_GHz + "′ / ν(GHz) at P band: the VLA Observational Status Summary",
    bands: j.bands.filter(b => b.name !== "4").map(b => ({ k: b.name, name: b.name + "  " + b.lo_GHz + "–" + b.hi_GHz + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    configs: ["A", "B", "C", "D"].map(c => ({ id: c, name: c, ants: j.configs[c].antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: j.configs[c].antennas.map(a => a.name), bmax: j.configs[c].bmax_m })),
    defaults: { cfg: "C", band: "L", nu: 1.5, dec: 40, dur: 8 },
  });
}

// ---- ALMA (data/interf/alma.json): the ten 12-m configurations of the current cycle from CASA's alma.cycleN.M.cfg
// (the notional 43-antenna sets), about the Technical Handbook's array location; the 2-degree hardware limit
{
  const j = rd("alma.json");
  out.push({
    id: "alma", name: "ALMA", site: "Chajnantor, Chile", lat: j.site.lat_deg, dish: j.dish_m, elLimit: j.elev_limit_deg,
    pb: { k: j.pb_relation.fwhm_coeff },
    pbSource: j.pb_relation.fwhm_coeff + " λ / D: the ALMA Cycle " + j.cycle + " Technical Handbook",
    bands: j.bands.map(b => ({ k: String(b.band), name: b.name + "  " + b.lo_GHz + "–" + b.hi_GHz + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz, rep: b.rep_GHz })),
    configs: Object.keys(j.configs).map(c => ({ id: c, name: c, ants: j.configs[c].antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: j.configs[c].antennas.map(a => a.name), bmax: j.configs[c].lmax_m })),
    defaults: { cfg: "C-3", band: "3", nu: 100, dec: -30, dur: 4 },
  });
}

// ---- DSA-2000 (data/interf/dsa2000.json): the 1650-dish design approved at the Final Design Review, from the
// project's sensitivity calculator (antennas_enu.json, about the array's centroid); the calculator's 20-degree
// elevation limit; the primary beam 3.36 deg / nu(GHz)
{
  const j = rd("dsa2000.json"), c = j.configs.FDR, b = j.bands[0];
  out.push({
    id: "dsa2000", name: "DSA-2000", site: "Spring Valley, Nevada", lat: j.site.lat_deg, dish: j.dish_m, elLimit: j.elev_limit_deg,
    pb: { arcminGHz: j.pb_relation.fwhm_deg_x_GHz * 60 },
    pbSource: "θ ≈ " + j.pb_relation.fwhm_deg_x_GHz + "° / ν(GHz): the DSA-2000 sensitivity calculator",
    bands: [{ k: "dsa", name: b.lo_GHz.toFixed(1) + "–" + b.hi_GHz.toFixed(1) + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz }],
    configs: [{ id: "FDR", name: "Final design", ants: c.antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: c.antennas.map(a => a.name), bmax: c.bmax_m }],
    defaults: { cfg: "FDR", band: "dsa", nu: 1.35, dec: 40, dur: 0.35 },
  });
}

const head = "/* The arrays of the Interferometer mode (window.IX_ARRAYS), built by make_rpresets.js from the sourced records in\n" +
  "   data/interf/*.json (do not edit by hand). Antenna positions: local east, north, up (m) about the array's\n" +
  "   reference point; lat: degrees; dish: m; elLimit: degrees; bands: GHz (bw: the largest instantaneous bandwidth). */\n";
fs.writeFileSync(path.join(__dirname, "web", "rpresets.js"), head + "window.IX_ARRAYS = " + JSON.stringify(out) + ";\n");
console.log("web/rpresets.js: " + out.map(a => a.name + " (" + a.configs.map(c => c.id + " " + c.ants.length).join(", ") + ")").join("; "));
