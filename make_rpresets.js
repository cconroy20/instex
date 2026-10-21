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
    configs: ["A", "B", "C", "D"].map(c => ({ id: c, name: c, ants: j.configs[c].antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: j.configs[c].antennas.map(a => a.name), bmax: j.configs[c].bmax_m,
      note: c === "C" ? "CASA's file for C leaves pad N1 empty. In the real C configuration one antenna from the middle of the north arm sits on N1, so the VLA's Observational Status Summary gives a shortest baseline of " + j.params.bmin_km.value.C * 1000 + " m (" + j.configs.C.with_N1_variant.bmin_m + " m with N1 occupied here)." : "" })),
    // the largest angular scale, per band and configuration (the OSS's Table 3.1.1: full synthesis; half for a snapshot)
    las: { src: "the VLA's Observational Status Summary", cfgs: j.las_table.configs, bands: Object.fromEntries(j.las_table.bands.map((b, k) => [b, { nu: j.las_table.freq_GHz[k], v: j.las_table.values[b] }])) },
    elNote: "The VLA's hard lower limit, " + j.elev_limit_deg + "° (the Guide to Observing with the VLA).",
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
    lasSource: "the ALMA Technical Handbook's 0.983 λ / L5 (Eq. 7.6)",
    elNote: "The antennas' hardware limit, " + j.elev_limit_deg + "° (the 2001 ALMA Project Book; no current value found). The Proposer's Guide asks only that a source transit above " + j.min_transit_elev_deg + "°.",
    antNote: "The notional " + j.n_ant_cfg + "-antenna set of each configuration (CASA's files). The real configurations have " + j.n_ant_config + " pads, with at least " + j.n_ant_offered_min + " antennas offered.",
    bands: j.bands.map(b => ({ k: String(b.band), name: b.name + "  " + b.lo_GHz + "–" + b.hi_GHz + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz, rep: b.rep_GHz })),
    configs: Object.keys(j.configs).map(c => ({ id: c, name: c, ants: j.configs[c].antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: j.configs[c].antennas.map(a => a.name), bmax: j.configs[c].lmax_m })),
    defaults: { cfg: "C-3", band: "3", nu: 100, dec: -30, dur: 4 },
  });
}

// ---- DSA-2000 (data/interf/dsa2000.json): the 1650-dish design of the Final Design Review, from the
// project's sensitivity calculator (antennas_enu.json, about the array's centroid); the calculator's 20-degree
// elevation limit; the primary beam 3.36 deg / nu(GHz)
{
  const j = rd("dsa2000.json"), c = j.configs.FDR, b = j.bands[0];
  out.push({
    id: "dsa2000", name: "DSA-2000", site: "Spring Valley, Nevada", lat: j.site.lat_deg, dish: j.dish_m, elLimit: j.elev_limit_deg,
    pb: { arcminGHz: j.pb_relation.fwhm_deg_x_GHz * 60 },
    pbSource: "θ ≈ " + j.pb_relation.fwhm_deg_x_GHz + "° / ν(GHz): the DSA Sensitivity Calculator",
    elNote: "The DSA Sensitivity Calculator's model of targeted tracks: above " + j.elev_limit_deg + "° and within ±" + j.tracking.max_abs_ha_h + " h of transit (survey pointings last " + j.tracking.survey_pointing_min + " minutes); no mechanical limit found.",
    antNote: "The Deep Synoptic Array (DSA, formerly DSA-2000): the " + c.antennas.length + "-dish design of the Final Design Review (2026), from the project's sensitivity calculator.",
    bands: [{ k: "dsa", name: b.lo_GHz.toFixed(1) + "–" + b.hi_GHz.toFixed(1) + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz }],
    configs: [{ id: "FDR", name: "Final design", ants: c.antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: c.antennas.map(a => a.name), bmax: c.bmax_m }],
    defaults: { cfg: "FDR", band: "dsa", nu: 1.35, dec: 40, dur: 0.35 },
  });
}

// ---- Arecibo (data/interf/arecibo.json): a single dish, the Gregorian feed's illuminated 213 x 237 m of the 305 m
// reflector (taken as uniformly lit; 213 m north-south on the meridian, INFERRED), within 19.7 deg of the zenith; the
// Gregorian receivers (the carriage-house line feed, which lit the whole dish, left out)
{
  const j = rd("arecibo.json"), il = j.illuminated;
  const NAMES = { "327": "327 MHz", "430": "430 MHz", lbw: "L-wide", ALFA: "ALFA", sbw: "S-wide", sbn: "S-narrow", sbh: "S-high", cb: "C", cbwd: "C-wide", "C-high": "C-high", xb: "X" };
  const lbw = j.beam.find(b => b.receiver === "lbw");
  out.push({
    id: "arecibo", name: "Arecibo 305 m", site: "Puerto Rico", lat: j.site.lat_deg, dish: j.dish_m, elLimit: 0,
    single: { ew: il.ew_m, ns: il.ns_m, note: "The real illumination tapers to " + il.illumination.edge_taper_db + " dB at the edge, and the platform and the Gregorian dome block part of the aperture." },
    zenLimit: j.zenith_limit_deg, decRange: j.dec_range_deg, pb: { k: 1 }, pbSource: "",
    dishNote: "The 305 m telescope stopped observing after an auxiliary cable failed on 10 August 2020; NSF announced the telescope's decommissioning on 19 November 2020, and the instrument platform fell into the dish on 1 December 2020.",
    beamNote: "Measured with the L-wide receiver at " + lbw.freq_GHz + " GHz: " + lbw.fwhm_az_arcmin + "′ × " + lbw.fwhm_za_arcmin + "′ (azimuth × zenith angle). The measured first sidelobe is " + (100 * Math.min(...j.sidelobes.first_peak_frac_heiles2001.map(q => q.frac))).toFixed(1) + "–" + (100 * Math.max(...j.sidelobes.first_peak_frac_heiles2001.map(q => q.frac))).toFixed(1) + "% of the peak (Heiles et al. 2001): the blockage raises the sidelobe above the uniform aperture's 1.75%.",
    caption: "The 305 m reflector and the part the Gregorian feed lights (blue). Arecibo collapsed on 1 December 2020.",
    bands: j.bands.filter(b => NAMES[b.name]).map(b => ({ k: b.name, name: NAMES[b.name] + "  " + (b.hi_GHz < 1 ? Math.round(b.lo_GHz * 1000) + "–" + Math.round(b.hi_GHz * 1000) + " MHz" : b.lo_GHz + "–" + b.hi_GHz + " GHz"), lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    configs: [{ id: "dish", name: "Gregorian", ants: [[0, 0, 0]], names: ["dish"], bmax: Math.max(il.ew_m, il.ns_m) }],
    defaults: { cfg: "dish", band: "lbw", nu: 1.42, dec: 18, dur: 0 },
  });
}

const head = "/* The arrays of the Interferometer mode (window.IX_ARRAYS), built by make_rpresets.js from the sourced records in\n" +
  "   data/interf/*.json (do not edit by hand). Antenna positions: local east, north, up (m) relative to the array's\n" +
  "   reference point; lat: degrees; dish: m; elLimit: degrees; bands: GHz (bw: the largest instantaneous bandwidth). */\n";
fs.writeFileSync(path.join(__dirname, "web", "rpresets.js"), head + "window.IX_ARRAYS = " + JSON.stringify(out) + ";\n");
console.log("web/rpresets.js: " + out.map(a => a.name + " (" + a.configs.map(c => c.id + " " + c.ants.length).join(", ") + ")").join("; "));
