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
    // (C: the Status Summary puts "an antenna from the middle of the north arm" on the central pad N1, which CASA's
    // file leaves empty; the pad vacated is not published, and the middle of the arm's nine pads is N10 (INFERRED))
    configs: ["A", "B", "C", "D"].map(c => {
      const A = j.configs[c].antennas.map(a => (c === "C" && a.name === "N10" ? Object.assign({}, j.configs.C.with_N1_variant.N1_enu, { name: "N01" }) : a));
      if (c === "C" && A.filter(a => a.name === "N01").length !== 1) throw new Error("VLA C: N10 not found for the N1 move");
      return { id: c, name: c, ants: A.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: A.map(a => a.name), bmax: j.configs[c].bmax_m,
        note: c === "C" ? "In the C configuration one antenna from the middle of the north arm stands on the central pad N1 (the VLA's Observational Status Summary), which CASA's file leaves empty; here the antenna of N10, the middle of the arm's nine pads (the pad is not published), so the shortest baseline is " + j.configs.C.with_N1_variant.bmin_m + " m (the Summary gives " + j.params.bmin_km.value.C * 1000 + " m)." : "" };
    }),
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
    elNote: "The antennas' hardware limit, " + j.elev_limit_deg + "° (the 2001 ALMA Project Book; no current value found). The Proposer's Guide sets an upper declination limit of +47°, where a source transits " + j.min_transit_elev_deg + "° above the horizon.",
    antNote: "The notional " + j.n_ant_cfg + "-antenna set of each configuration (CASA's files). The real configurations have " + j.n_ant_config + " pads, with at least " + j.n_ant_offered_min + " antennas offered.",
    bands: j.bands.map(b => ({ k: String(b.band), name: b.name + "  " + b.lo_GHz + "–" + b.hi_GHz + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz, rep: b.rep_GHz })),
    configs: Object.keys(j.configs).map(c => ({ id: c, name: c, ants: j.configs[c].antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: j.configs[c].antennas.map(a => a.name), bmax: j.configs[c].lmax_m })),
    defaults: { cfg: "C-3", band: "3", nu: 100, dec: -30, dur: 4 },
  });
}

// ---- SMA (data/interf/sma.json): the four configurations of eight 6 m antennas from CASA's sma.*.cfg (local east,
// north, up about pad 1: SMA Memo 131's as-built pads in meters); the four receivers at the Observer Center's RF
// ranges, the LO range +-16 GHz, with 12 GHz in each of the two sidebands (the page sets the 24 GHz side by side,
// without the 8 GHz gap between the sidebands, as ALMA's 7.5 GHz); the primary beam 1.2 lambda / D (DERIVED from the
// Quick Specs' 55, 51, 36, 31 arcsec); the beam calculator's 15-degree limit, 33 degrees in the subcompact
// configuration (collisions); the latitude of the EHT's phasing center (Paper II: pad 1's own position is not
// published). The default declination +30 keeps the transit below the 89-degree hardstop.
{
  const j = rd("sma.json"), cb = j.config_baselines_derived, rf = j.rf_range_GHz_derived, pb = j.primary_beam;
  const CF = [["SUB", "subcompact", "Subcompact"], ["COM", "compact", "Compact"], ["EXT", "extended", "Extended"], ["VEX", "vextended", "Very extended"]];
  const ks = Object.values(pb).map(q => q.k);
  out.push({
    id: "sma", name: "SMA", site: "Maunakea, Hawaii", lat: Math.round(j.site.phasing_center_EHT2017.lat_deg_DERIVED * 1e4) / 1e4, dish: j.dish_m, elLimit: 15,
    pb: { k: 1.2 },
    pbSource: "1.2 λ / D: " + pb["230"].fwhm_arcsec + "″ at 230 GHz and " + pb["345"].fwhm_arcsec + "″ at 345 GHz in the SMA's Quick Specs, " + Math.min(...ks).toFixed(2) + "–" + Math.max(...ks).toFixed(2) + " λ / D across the four receivers",
    elNote: "15°, the SMA beam calculator's default; the antennas' hardstops are at 6.7° (Hunter et al. 2013). The subcompact configuration has a separate limit, 33°, which the SMA imposes to keep neighboring dishes from colliding.",
    antNote: "The Submillimeter Array on Maunakea, dedicated in 2003 and operated by the Smithsonian Astrophysical Observatory and the Academia Sinica Institute of Astronomy and Astrophysics, moves eight 6 m antennas among 24 pads. The pads lie on four nested rings, each close to a Reuleaux triangle, a curve of constant width (Keto 1997). The array then has the same width in each direction, so the longest spacings in the uv plane lie on a circle and the beam is round for a source at the zenith (Ho et al. 2004). The inner ring follows the shape closely; the outer rings depart from the shape where the terrain forced compromises. Storm damage in August 2024 to the roads and infrastructure at pads 18 and 19 has stopped the very extended configuration, and in February 2026 the Observer Center reported that the repair would not start before late fiscal year 2026. The positions come from CASA's simulator files, which give the as-built pads of SMA Memo 131 (1998) in meters.",
    durNote: "The default, 6 h, is the track length that the sensitivities in the SMA's Quick Specs assume; the SMA publishes no typical track length.",
    bands: ["230", "240", "345", "400"].map(k => ({ k, name: k + "Rx  " + rf[k][0] + "–" + rf[k][1] + " GHz", lo: rf[k][0], hi: rf[k][1], bw: 24, rep: +k })),
    configs: CF.map(([id, key, name]) => {
      const P = cb[key].pads, ants = P.map(n => j.pads[String(n)].enu_m);
      if (P.some(n => !/CFG/.test(j.pads[String(n)].from))) throw new Error("SMA " + id + ": a pad not from CASA's files");
      return Object.assign({ id, name, ants: ants.map(p => p.map(mm)), names: P.map(n => "pad " + n), bmax: Math.round(cb[key].max_m * 100) / 100 },
        id === "SUB" ? { elLimit: 33, note: "The subcompact configuration uses pads 1 to 6 of the inner ring, 9.5 to 25 m apart, and pads 8 and 23 (the Observer Center's usual pair). The SMA observes in this configuration only above 33° elevation, to keep neighboring dishes from colliding." } : {});
    }),
    // (all 24 pads, drawn pale in the Array panel: 20 from CASA's files, pads 10, 13, 22 and 24 from Memo 131's
    // table in feet, DERIVED)
    pads: Object.keys(j.pads).map(n => j.pads[n].enu_m.map(mm)),
    defaults: { cfg: "COM", band: "230", nu: 230, dec: 30, dur: 6 },
  });
}

// ---- eSMA (data/interf/esma.json): the SMA's eight antennas on the very extended pads with the JCMT (15 m) and the
// CSO (10.4 m), 2007-2010; the two telescopes placed in the pad frame with pad 1 at the SMA's position in EHT Paper II
// (INFERRED: no source ties the pad frame to the Earth; the published 782, 625 and 164 m baselines come out within
// 0.4 m); baselines weighted 1 / (SEFD_i SEFD_j) from the design aperture efficiencies with one system temperature
// (DERIVED, so the weights are the products of the effective areas); the bands of the eSMA paper's Table 1, 2 GHz in
// each sideband laid side by side; uniform weighting by default, as for the published eSMA beams
{
  const j = rd("esma.json"), r = j.recommended_page_record, c = r.configs.VEX, sma = rd("sma.json");
  const st = c.stations, D = r.dish, SE = r.sefd_Jy, P = j.positions;
  if (c.pads.some((n, k) => c.ants_enu_m[k].some((x, i) => Math.abs(x - sma.pads[String(n)].enu_m[i]) > 1e-6))) throw new Error("eSMA: the pads differ from the SMA record's");
  if ([P.JCMT_enu_about_P2_SMA_point_m_DERIVED, P.CSO_enu_about_P2_SMA_point_m_DERIVED].some((q, k) => q.some((x, i) => x !== c.ants_enu_m[8 + k][i]))) throw new Error("eSMA: the JCMT or CSO position differs from the tie");
  const pb = r.pb.k, bl = j.baselines_published_m;
  out.push({
    id: "esma", name: "SMA + JCMT + CSO", site: "Maunakea, Hawaii", lat: r.lat, dish: D.SMA, elLimit: r.elLimit,
    pb: { k: pb.SMA },
    pbSource: "the SMA's 6 m dishes, 1.2 λ / D; the JCMT's and the CSO's beams are narrower, 15″ and 20″ at 337 GHz (Favre et al. 2014), so the baselines to the two large dishes see a smaller field",
    elNote: "15°, as for the SMA; no limit is published for the JCMT or the CSO.",
    antNote: "The extended SMA (the eSMA) joined the SMA's eight antennas, on the pads of the very extended configuration, with the James Clerk Maxwell Telescope (15 m) and the Caltech Submillimeter Observatory (10.4 m), to make ten elements with 45 baselines out to " + bl.eSMA_VEX_2008[1] + " m (Bottinelli et al. 2008). The published eSMA data run from August 2007 to February 2010. The CSO closed in 2015 and was removed from Maunakea by 2024, so this array can no longer observe. No source gives the two telescopes' positions in the SMA's pad frame. The page places pad 1 at the SMA's position in EHT 2019 Paper II, which reproduces the published " + bl.eSMA_VEX_2008[1] + " m (CSO to pad 19), " + bl.Titan_2010_max + " m (JCMT to pad 19) and " + bl.JCMT_CSO_WIE99 + " m (JCMT to CSO) baselines to within 0.4 m. The SEFDs come from the design aperture efficiencies (0.67, 0.55 and 0.60) with one system temperature for the three telescopes, so a baseline's weight is the product of the two dishes' effective areas. Under natural weighting the baselines to the JCMT dominate; the page uses uniform weighting by default, as the published eSMA beams do.",
    durNote: "The default, 10 h (hour angles ±5 h), is the track of the eSMA's published performance estimate at 345 GHz and declination +25° (Bottinelli et al. 2008).",
    bands: r.bands.map(b => ({ k: b.k, name: (b.k === "230" ? "1.3 mm" : "0.87 mm") + "  " + b.lo + "–" + b.hi + " GHz", lo: b.lo, hi: b.hi, bw: b.bw, rep: b.rep_GHz })),
    configs: [{ id: "VEX", name: "Very extended", ants: c.ants_enu_m.map(p => p.map(mm)), names: c.pads.map(n => "pad " + n).concat(["JCMT", "CSO"]),
      dishes: st.map(s => D[s]), sefd: st.map(s => SE[s]), bmax: c.bmax_m }],
    pads: Object.keys(sma.pads).map(n => sma.pads[n].enu_m.map(mm)),
    defaults: { cfg: "VEX", band: "345", nu: 345, dec: 25, dur: 10, wt: "uniform" },
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
    // the calculator's targeted tracks end 2 h of hour angle either side of the transit: the Duration slider stops
    // at 4 h of hour angle
    haMax: j.tracking.max_abs_ha_h,
    durNote: "The DSA Sensitivity Calculator limits a targeted track to ±" + j.tracking.max_abs_ha_h + " h of hour angle around the transit (longer requests are split over several transits), so the slider stops there.",
    defaults: { cfg: "FDR", band: "dsa", nu: 1.35, dec: 40, dur: 0.35 },
  });
}

// ---- Arecibo (data/interf/arecibo.json): a single dish, the Gregorian feed's illuminated 213 x 237 m of the 305 m
// reflector (taken as uniformly lit; the 213 m along the uphill-downhill (zenith-angle) direction, EXPP, so north-south
// on the meridian), within 19.7 deg of the zenith; the
// Gregorian receivers (the carriage-house line feed, which lit the whole dish, left out)
{
  const j = rd("arecibo.json"), il = j.illuminated;
  const NAMES = { "327": "327 MHz", "430": "430 MHz", lbw: "L-wide", ALFA: "ALFA", sbw: "S-wide", sbn: "S-narrow", sbh: "S-high", cb: "C", cbwd: "C-wide", "C-high": "C-high", xb: "X" };
  const lbw = j.beam.find(b => b.receiver === "lbw");
  out.push({
    id: "arecibo", name: "Arecibo 305 m", site: "Puerto Rico", lat: j.site.lat_deg, dish: j.dish_m, elLimit: 0,
    single: { ew: il.ew_m, ns: il.ns_m, note: "The Gregorian feed was designed to taper the illumination to " + il.illumination.edge_taper_db + " dB at the edge (the 1992 design memo; NAIC's 2004 beam page gives \"a geometric taper of about 9\" dB), and the platform and the Gregorian dome block part of the aperture." },
    zenLimit: j.zenith_limit_deg, decRange: j.dec_range_deg, pb: { k: 1 }, pbSource: "",
    dishNote: "The 305 m telescope stopped observing after an auxiliary cable failed on 10 August 2020; NSF announced the telescope's decommissioning on 19 November 2020, and the instrument platform fell into the dish on 1 December 2020.",
    beamNote: "Measured with the L-wide receiver at " + lbw.freq_GHz + " GHz: " + lbw.fwhm_az_arcmin + "′ × " + lbw.fwhm_za_arcmin + "′ (azimuth × zenith angle). The measured first sidelobe is " + (100 * Math.min(...j.sidelobes.first_peak_frac_heiles2001.map(q => q.frac))).toFixed(1) + "–" + (100 * Math.max(...j.sidelobes.first_peak_frac_heiles2001.map(q => q.frac))).toFixed(1) + "% of the peak (Heiles et al. 2001): the blockage raises the sidelobe above the uniform aperture's 1.75%.",
    caption: "The 305 m reflector and the part the Gregorian feed lights (blue). Arecibo collapsed on 1 December 2020.",
    bands: j.bands.filter(b => NAMES[b.name]).map(b => ({ k: b.name, name: NAMES[b.name] + "  " + (b.hi_GHz < 1 ? Math.round(b.lo_GHz * 1000) + "–" + Math.round(b.hi_GHz * 1000) + " MHz" : b.lo_GHz + "–" + b.hi_GHz + " GHz"), lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    configs: [{ id: "dish", name: "Gregorian", ants: [[0, 0, 0]], names: ["dish"], bmax: Math.max(il.ew_m, il.ns_m) }],
    defaults: { cfg: "dish", band: "lbw", nu: 1.42, dec: 18, dur: 0 },
  });
}

// ---- helpers for the Earth-scale and transit arrays
const D2R = Math.PI / 180;
const WGS = { a: 6378137, f: 1 / 298.257223563 };
WGS.e2 = WGS.f * (2 - WGS.f);
// WGS84 geodetic (degrees, m) to Earth-centered X, Y, Z (m), and back (iterated)
function toECEF(lat, lon, h) {
  const p = lat * D2R, l = lon * D2R, N = WGS.a / Math.sqrt(1 - WGS.e2 * Math.sin(p) ** 2);
  return [(N + h) * Math.cos(p) * Math.cos(l), (N + h) * Math.cos(p) * Math.sin(l), (N * (1 - WGS.e2) + h) * Math.sin(p)];
}
function toGeo(X, Y, Z) {
  const lon = Math.atan2(Y, X), pr = Math.hypot(X, Y);
  let lat = Math.atan2(Z, pr * (1 - WGS.e2)), h = 0;
  for (let k = 0; k < 8; k++) { const N = WGS.a / Math.sqrt(1 - WGS.e2 * Math.sin(lat) ** 2); h = pr / Math.cos(lat) - N; lat = Math.atan2(Z, pr * (1 - WGS.e2 * N / (N + h))); }
  return [lat / D2R, lon / D2R, h];
}
// a point east, north, up (m) of a site (the local tangent frame) to geodetic latitude, longitude, height
function enuToGeo(site, e, n, u) {
  const [X0, Y0, Z0] = toECEF(site[0], site[1], site[2]), p = site[0] * D2R, l = site[1] * D2R;
  const sp = Math.sin(p), cp = Math.cos(p), sl = Math.sin(l), cl = Math.cos(l);
  return toGeo(X0 - sl * e - sp * cl * n + cp * cl * u, Y0 + cl * e - sp * sl * n + cp * sl * u, Z0 + cp * n + sp * u);
}
const r9 = x => Math.round(x * 1e9) / 1e9, r3 = x => Math.round(x * 1e3) / 1e3;
// the longitude of the stations' mean direction (degrees, to 0.1)
const meanLon = st => { let x = 0, y = 0; for (const q of st) { x += Math.cos(q[0] * D2R) * Math.cos(q[1] * D2R); y += Math.cos(q[0] * D2R) * Math.sin(q[1] * D2R); } return Math.round(Math.atan2(y, x) / D2R * 10) / 10; };
const meanLat = st => Math.round(st.reduce((a, q) => a + q[0], 0) / st.length * 10) / 10;
const fBand = (lo, hi) => (hi < 1 ? Math.round(lo * 1000) + "–" + Math.round(hi * 1000) + " MHz" : lo + "–" + hi + " GHz");

// ---- VLBA (data/interf/vlba.json): the ten stations of the Status Summary (WGS84), each with its horizon mask
// (SCHED's catalog); NRAO's practical 10-degree limit; the primary beam measured at 1.38 GHz (Middelberg et al. 2013),
// scaled as 1 / nu
{
  const j = rd("vlba.json"), st = j.stations, P = st.map(s => [s.lat_deg, s.lon_deg, s.h_m]);
  out.push({
    id: "vlba", name: "VLBA", site: "Hawaii to the Virgin Islands", lat: meanLat(P), geo: { lon0: meanLon(P) }, dish: j.dish_m, elLimit: j.elev_limit_deg, unit: "stations",
    pb: { arcminGHz: j.pb_relation.fwhm_arcmin_x_GHz },
    pbSource: "θ ≈ " + j.pb_relation.fwhm_arcmin_x_GHz.toFixed(1) + "′ / ν(GHz): measured at " + j.pb_relation.measured_freq_GHz.toFixed(2) + " GHz (Middelberg et al. 2013) and scaled as 1 / ν (a single measurement; the other receivers' feeds light the dish differently, so their beams may differ)",
    elNote: "NRAO's practical limit, " + j.elev_limit_deg + "° (" + j.elev_recommended_deg + "° recommended; below 1 GHz and above 40 GHz the practical limit is closer to 20°, the proposing guide; the antennas reach " + j.elev_mech_deg + "°). Each station's horizon mask applies too: the terrain by azimuth, up to " + Math.max(...st.map(s => Math.max(...s.horizon_mask.el_deg))) + "° at St. Croix (SCHED's station catalog).",
    antNote: "The Very Long Baseline Array: ten " + j.dish_m + " m antennas from Mauna Kea, Hawaii, to St. Croix in the Virgin Islands, operated by NRAO; the positions from the VLBA Observational Status Summary.",
    bminNote: "Los Alamos and Pie Town, New Mexico, " + j.baselines.shortest_km + " km apart.",
    bands: j.bands.map(b => ({ k: b.name, name: b.receiver + "  " + fBand(b.lo_GHz, b.hi_GHz), lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz, stations: b.stations })),
    configs: [{ id: "vlba", name: "Ten stations", ants: P, names: st.map(s => s.code), full: st.map(s => s.location), masks: st.map(s => ({ az: s.horizon_mask.az_deg, el: s.horizon_mask.el_deg })), bmax: j.baselines.longest_km * 1000 }],
    ranges: { size: [-4, 0.5], field: [-3.5, 1] },
    defaults: { cfg: "vlba", band: "U", nu: 15, dec: 30, dur: 8, sky: "corejet", size: 0.01, field: 0.02 },
    durNote: "The default 8 h is the total on-source integration time the Status Summary's sensitivity table assumes (a real track is longer, with calibrators and slews); NRAO gives no typical track.",
  });
}

// ---- EHT 2017 (data/interf/eht2017.json): the eight stations of Paper II (phased ALMA and SMA as one station each,
// with the diameter of the same collecting area), the SEFDs of Paper III; the reference meridian chosen so that the
// default 7 h track centered on its transit is the M87 track of 2017 April 11 (the EHT's data release)
{
  // (the positions from Paper II's X, Y, Z, to 0.1 m; the tabulated latitudes and longitudes are rounded to 0.1 arcsec)
  const j = rd("eht2017.json"), st = j.stations, P = st.map(s => toGeo(s.X_m, s.Y_m, s.Z_m).map((x, i) => (i < 2 ? r9(x) : r3(x))));
  const tr = j.observing.sr1_tracks["11"].utc_h, tc = (tr[0] + tr[1]) / 2;
  const gha = ((j.observing.gst0_apr11_deg + j.observing.degpdy * tc / 24 - j.target.ra_deg) % 360 + 540) % 360 - 180;
  const lon0 = Math.round(-gha * 10) / 10, LBL = { PV: "IRAM 30 m" };
  out.push({
    id: "eht2017", name: "EHT 2017", site: "Hawaii, Arizona, Mexico, Chile, Spain, South Pole", lat: 0, geo: { lon0 }, dish: 12, elLimit: 0, unit: "stations",
    pb: { k: j.pb.apex_k_lambda_over_D },
    pbSource: j.pb.apex_k_lambda_over_D + " λ / D for APEX's 12 m dish (" + j.pb.apex_fwhm_arcsec + "″ at " + j.pb.apex_freq_GHz + " GHz; EHT 2019 Paper II). The single dishes' beams differ (a phased array's beam is one element's: ALMA's 12 m, the SMA's 6 m, wider than APEX's), and none matters at these scales",
    elNote: "0°: each station's own limit holds. Only the IRAM 30 m's 9° and the LMT's 0° are mechanical. The others are read from the M87 tracks of 2017: the tracks ended when M87 set below 20° at ALMA (Paper III), which also cut APEX on the same site; M87 rises behind the Large Binocular Telescope as seen from the SMT, so the SMT starts at 25° toward M87 only (Paper IV); JCMT's 12° and the SMA's 16° are the lowest elevations in the released data. The page applies them at every declination and azimuth, so other sources' tracks are cut shorter than the stations require; none found for the SPT.",
    antNote: "The Event Horizon Telescope of April 2017 at 1.3 mm: eight stations at six sites. Phased ALMA (37 dishes) and the phased SMA count as single stations; the dish sizes are the 2017 effective diameters, and the baselines are weighted by the stations' SEFDs (EHT 2019 Papers II and III).",
    bminNote: "JCMT and the SMA, " + Math.round(j.baselines.shortest_m) + " m apart on Maunakea; ALMA and APEX are " + (Math.hypot(st[0].X_m - st[1].X_m, st[0].Y_m - st[1].Y_m, st[0].Z_m - st[1].Z_m) / 1000).toFixed(1) + " km apart: the only short spacings in the array.",
    durNote: "The default, " + (tr[1] - tr[0]).toFixed(1) + " h centered on the transit at " + Math.abs(lon0) + "° W, is the M87 track of 2017 April 11 (" + tr[0].toFixed(2) + "–" + tr[1].toFixed(2) + " h UTC).",
    bands: j.bands.map(b => ({ k: b.name, name: b.name + "  " + b.lo_GHz + "–" + b.hi_GHz + " GHz", lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    configs: [{ id: "2017", name: "April 2017", ants: P, names: st.map(s => LBL[s.name] || s.name), full: st.map(s => s.full_name + ", " + s.site), dishes: st.map(s => s.dish_eff_m), sefd: st.map(s => s.sefd_jy), elMin: st.map(s => s.el_limit_deg || 0), bmax: j.baselines.all_longest_km * 1000 }],
    ranges: { size: [-5.5, -2], field: [-5, -1.5] },
    // (uniform weighting by default, as for the EHT's own CLEAN beam: natural weighting lets ALMA's baselines dominate)
    defaults: { cfg: "2017", band: "high", wt: "uniform", nu: j.bands[1].center_GHz, bw: j.bands[1].bw_GHz, dec: +j.target.dec_deg.toFixed(2), dur: +(tr[1] - tr[0]).toFixed(2), sky: "m87", size: j.ring_model.adopted.diameter_uas * 1e-6, field: 1.6e-4 },
  });
}

// ---- CHIME (data/interf/chime.json): four 20 x 100 m cylinders, 256 feeds each by the published rule, less the 8
// feeds at each end of each cylinder, masked since December 2019 (960 feeds); a transit array: the beam ~1.0 deg /
// nu(GHz) east-west (DERIVED from 2.5 and 1.3 deg at the band's edges) by ~110 deg north-south (CHIME/FRB 2018); the
// field north of -11 deg (the CHIME/FRB catalog; audit X, 2026-11-16: was a DERIVED -5.7)
const chime = rd("chime.json");
{
  const j = chime, fe = j.configs.CHIME.antennas.filter(a => !a.edge_masked), cy = j.cylinders;
  // (the longest baseline of the 960 feeds kept; the record's bmax is the 1,024-feed rule's)
  let bm = 0; for (let i = 0; i < fe.length; i++) for (let k = i + 1; k < fe.length; k++) bm = Math.max(bm, Math.hypot(fe[i].e - fe[k].e, fe[i].n - fe[k].n, fe[i].u - fe[k].u));
  out.push({
    id: "chime", name: "CHIME", site: "DRAO, British Columbia", lat: j.site.lat_deg, dish: j.feeds.spacing_m, elLimit: 0, transit: true, decRange: [j.drift.dec_south_limit_deg, 90],
    fixedWho: "CHIME's cylinders", unit: "feeds", unitOne: "feed", unitTail: " on " + cy.n + " cylinders", cyl: cy.center_e_m.map(e => [e, 0, cy.width_m, cy.length_m]),
    pb: { ew: { arcminGHz: j.pb_relation.ew_fwhm_deg_x_GHz * 60 }, ns: { deg: j.pb_relation.ns_fwhm_deg } },
    pbSource: "east-west ≈ " + j.pb_relation.ew_fwhm_deg_x_GHz.toFixed(1) + "° / ν(GHz), from " + j.pb_relation.ew_fwhm_deg_band_edges["0.4"] + "° at 400 MHz and " + j.pb_relation.ew_fwhm_deg_band_edges["0.8"] + "° at 800 MHz (the field of view of CHIME/FRB 2018); north-south ≈ " + j.pb_relation.ns_fwhm_deg + "°. The measured beams follow the 1 / ν scaling (holography: CHIME 2022 Fig. 17, CHIME 2024), about 20% wider in the X polarization than in Y; the relation matches X",
    reachNote: "Declinations above " + j.drift.dec_south_limit_deg + "°: the CHIME/FRB search forms its beams to 60° on either side of the zenith along the meridian, so CHIME sees the sky north of " + j.drift.dec_south_limit_deg + "°, ≈ " + Math.round(j.drift.sky_fraction_north_of_limit * 100) + "% of the sphere, each day as the Earth turns (CHIME/FRB 2021); north of +" + j.drift.dec_twice_daily_deg + "° a source also crosses the beam below the pole, which the page does not model. CHIME's holography reaches −21° (CHIME 2022).",
    antNote: "The Canadian Hydrogen Intensity Mapping Experiment: 1,024 feeds, " + j.feeds.per_cylinder + " on each cylinder's focal line " + j.feeds.spacing_m + " m apart; the 8 at each end of each cylinder, masked since December 2019 because their beams differ from the rest (CHIME 2022), are left out here. The feed positions follow the published rule (no survey of the feeds is public); the cylinders run A to D from west to east (CHIME 2024).",
    durNote: "CHIME/FRB 2018: " + j.drift.transit_min.equator.join(" to ") + " minutes at the equator and " + j.drift.transit_min.dec45.join(" to ") + " at declination 45°, across the band.",
    bands: j.bands.map(b => ({ k: "chime", name: fBand(b.lo_GHz, b.hi_GHz), lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    // (to 0.1 mm: millimeters would turn the 0.3048 m spacing into 0.304 or 0.305 m)
    configs: [{ id: "chime", name: "Four cylinders", ants: fe.map(a => [a.e, a.n, a.u].map(x => Math.round(x * 1e4) / 1e4)), names: fe.map(a => a.name), bmax: Math.round(bm * 1e4) / 1e4 }],
    ranges: { size: [2, 4.6], field: [2.5, 4.8] },
    defaults: { cfg: "chime", band: "chime", nu: 0.6, dec: 40, dur: 24, sky: "points", size: 5 * 3600, field: 8 * 3600 },
  });
}

// ---- CHIME and the CHIME/FRB Outriggers: CHIME and the three outrigger stations (KKO, HCO, GBO), each phased into
// one station, as the VLBI forms one beam at the CHIME core and at each outrigger (VLBI26; audit X, 2026-11-16: CHIME
// had been 960 separate feeds, which a random draw of pairs then weighted); the outriggers at their fitted positions
// (KKO24, VLBI26), CHIME at its own (EPH); the SEFD of a station of N phased feeds the ideal 40,000 Jy / sqrt(N (N - 1))
// of the radiometer equation (HCO26); the outriggers' beams turned to overlap CHIME's
{
  const j = chime, fe = j.configs.CHIME.antennas.filter(a => !a.edge_masked);
  const O = ["KKO", "HCO", "GBO"].map(k => Object.assign({ k }, j.outriggers.stations[k]));
  const P = [[j.site.lat_deg, j.site.lon_deg, j.site.elev_m]].concat(O.map(o => [o.lat_deg, o.lon_deg, o.h_ellipsoid_m])).map(q => [r9(q[0]), r9(q[1]), r3(q[2])]);
  const sf = j.sensitivity.sefd_per_feed_Jy, bf = N => sf / Math.sqrt(N * (N - 1)), N = [fe.length].concat(O.map(o => o.n_feeds));
  const SE = N.map(bf), fJy = x => Math.round(x).toLocaleString("en-US");
  out.push({
    id: "chimeout", name: "CHIME + outriggers", site: "British Columbia, California, West Virginia", lat: j.site.lat_deg, geo: { lon0: j.site.lon_deg }, dish: j.feeds.spacing_m, elLimit: 0, transit: true, decRange: [j.drift.dec_south_limit_deg, 90],
    fixedWho: "The cylinders", unit: "stations", unitTail: " (CHIME and " + O.length + " outriggers)", unitMany: "stations",
    pb: { ew: { arcminGHz: j.pb_relation.ew_fwhm_deg_x_GHz * 60 }, ns: { deg: j.pb_relation.ns_fwhm_deg } },
    pbSource: "CHIME's beam",
    reachNote: "Declinations above " + j.drift.dec_south_limit_deg + "°, as for CHIME: the outriggers see the source as the source crosses CHIME's beam.",
    antNote: "The CHIME/FRB Outriggers localize the bursts CHIME finds by VLBI: KKO (" + O[0].n_feeds + " feeds, " + O[0].chord_km.toFixed(0) + " km from CHIME), HCO (" + O[1].n_feeds + " feeds, " + O[1].chord_km.toFixed(0) + " km) and GBO (" + O[2].n_feeds + " feeds, " + O[2].chord_km.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " km), single cylinders turned so that their beams overlap CHIME's. The VLBI phases CHIME's " + fe.length + " feeds and each outrigger's feeds into one station each (Andrew et al. 2026), so the array has six baselines. Each baseline is weighted by its two stations' SEFDs, the ideal values of the radiometer equation, one feed's " + sf.toLocaleString("en-US") + " Jy / √(N (N − 1)) for N phased feeds (Lazda et al. 2026): CHIME " + fJy(SE[0]) + " Jy, KKO " + fJy(SE[1]) + " Jy, HCO and GBO " + fJy(SE[2]) + " Jy. HCO's measured medians are 390 Jy (YY) and 530 Jy (XX), and KKO's about twice HCO's; none is published for GBO. Whether the real VLBI also uses the baselines between outriggers (to 3,506 km, HCO–GBO), which are in practice too faint for most bursts (Andrew et al. 2026), is not published; the page keeps them.",
    bminNote: "CHIME and KKO, " + O[0].chord_km.toFixed(0) + " km apart.",
    durNote: "A fast radio burst lasts milliseconds, one snapshot (the default); a steady source can be followed through CHIME's beam.",
    bands: j.bands.map(b => ({ k: "chime", name: fBand(b.lo_GHz, b.hi_GHz), lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    configs: [{ id: "out", name: "Four stations", ants: P, names: ["CHIME"].concat(O.map(o => o.k)),
      full: ["four 20 × 100 m cylinders, " + fe.length + " feeds phased", "a 20 × 40 m cylinder, " + O[0].n_feeds + " feeds phased", "a 20 × 80 m cylinder, " + O[1].n_feeds + " feeds phased", "one cylinder, " + O[2].n_feeds + " feeds phased"],
      dishes: [0, 0, 0, 0], sefd: SE, bmax: j.configs.CHIME_OUTRIGGERS.bmax_m }],
    ranges: { size: [-3, 4.6], field: [-3, 4.8] },
    defaults: { cfg: "out", band: "chime", nu: 0.6, bw: 0.4, dec: 40, dur: 0, sky: "point", size: 0.05, field: 1 },
  });
}

// ---- CHORD (data/interf/chord.json): the 512 x 6 m dishes of the core, under construction (read from the layout
// figure, snapped to the 6.3 x 8.5 m grid), and the 64-dish pathfinder; a transit array, the dishes fixed in azimuth
// and set by hand to a declination between +20 and +80 degrees; the primary beam 1.2 lambda / D
{
  const j = rd("chord.json"), C = j.configs;
  out.push({
    id: "chord", name: "CHORD", site: "DRAO, British Columbia", lat: j.site.lat_deg, dish: j.dish_m, elLimit: 0, transit: true, fixedWho: "CHORD's dishes", unitOne: "dish", decRange: j.pointing.dec_range_deg,
    aliases: true, aliasNote: "λ / " + j.grid.dn_m + " m north-south (foreshortened as the dishes tilt from the zenith) and λ / " + j.grid.de_m + " m east-west, in the synthesized beam nearly as bright as the main lobe in a snapshot at one frequency (at 21 cm \"The north alias is about 1.4 degrees away, and the east alias is about 1.9 degrees away\", Hopkins et al. 2026)",
    pb: { arcminGHz: j.pb_relation.fwhm_deg_x_GHz * 60 },
    pbSource: j.pb_relation.k_lambda_over_D + " λ / D = " + j.pb_relation.fwhm_deg_x_GHz.toFixed(2) + "° / ν(GHz) for the " + j.dish_m + " m dishes (2.4° at 1420 MHz, Bij et al. 2026). The measured beams are near the diffraction limit in one plane and up to 2.5° wider in the other below 1.1 GHz (Bandura et al. 2026), so one circular beam is a middle value",
    reachNote: "Declinations " + j.pointing.dec_range_deg.map(d => "+" + d + "°").join(" to ") + ": the dishes are fixed in azimuth on the meridian (INFERRED), and their elevation is to be reset by hand every few months or less often, so the array surveys one strip of declination at a time as the sky drifts through the beams.",
    antNote: "The Canadian Hydrogen Observatory and Radio-transient Detector, under construction next to CHIME: 64 dishes installed by April 2026, the full core planned for the end of 2027. The positions are read from a published schematic (Bij et al. 2026; no table is public), on a grid turned 2° anticlockwise from north, the sense of the UTM grid at DRAO; the schematic draws the rows turned the other way, and no source settles which is right. The two 64-dish outrigger stations, at Hat Creek and Green Bank, are left out.",
    bands: j.bands.map(b => ({ k: "chord", name: fBand(b.lo_GHz, b.hi_GHz), lo: b.lo_GHz, hi: b.hi_GHz, bw: b.bw_GHz })),
    configs: [["core", "Core"], ["pathfinder", "Pathfinder"]].map(([id, name]) => ({ id, name, ants: C[id].antennas.map(a => [mm(a.e), mm(a.n), mm(a.u)]), names: C[id].antennas.map(a => a.name), bmax: C[id].bmax_m })),
    ranges: { size: [2, 4.8], field: [2.5, 4.9] },
    defaults: { cfg: "core", band: "chord", nu: 0.9, dec: 40, dur: 24, sky: "points", size: 4 * 3600, field: 6 * 3600 },
  });
}

const head = "/* The arrays of the Interferometer mode (window.IX_ARRAYS), built by make_rpresets.js from the sourced records in\n" +
  "   data/interf/*.json (do not edit by hand). Antenna positions: local east, north, up (m) relative to the array's\n" +
  "   reference point; lat: degrees; dish: m; elLimit: degrees; bands: GHz (bw: the largest instantaneous bandwidth). */\n";
fs.writeFileSync(path.join(__dirname, "web", "rpresets.js"), head + "window.IX_ARRAYS = " + JSON.stringify(out) + ";\n");
console.log("web/rpresets.js: " + out.map(a => a.name + " (" + a.configs.map(c => c.id + " " + c.ants.length).join(", ") + ")").join("; "));
