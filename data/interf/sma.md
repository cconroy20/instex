# Interferometer: Submillimeter Array (SMA) -- 24 pads, four configurations, receivers, primary beam, Reuleaux design

Compiled 2026-11-18 for the instex INTERFEROMETER mode, in the record format of `data/interf/alma.md` and `data/interf/vlba.md`. All numbers come from documents saved unmodified under `rawdata/interf/sma/` (the EHT keys P2 and EHTIM under `rawdata/interf/eht2017/`); each value carries a source key, a location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **NOT FOUND** marks a gap. 135 quote records (132 distinct quotes) machine-checked against the saved files' extracted text (pdftotext -layout and -raw for PDFs; tag-stripped text and raw source for HTML; the cfg, JSON and txt files as is): all pass (2026-11-18). Normalization: Unicode NFKC; curly quotes, primes, dashes, minus, multiplication sign (to x), tilde operator, soft hyphens and the AAS and Keto font glyphs mapped; case folded; whitespace collapsed; a quote also passes with PDF line-end hyphenation closed up or with all whitespace removed (table rows); ' ... ' joins non-adjacent pieces. Machine-readable twin: `data/interf/sma.json` (its `recommended_page_record` is the block for make_rpresets.js).

## Completeness summary

**Array**: 8 antennas of 6 m (OCSPEC, HO04), alt-azimuth, f/0.4 bent-Nasmyth; 24 pads in four nested rings (HO04); site 4080 m (WSMA). Operated by SAO and ASIAA; dedicated 2003 November 22. Central blockage NOT FOUND.

**Pads (24)**: local east/north/up in m about pad 1 from the CASA simulator files (CFG; single commit 1b0506edc78, 2017-03-08, svn r11005; 20 pads) and from SMA Memo 131 Table 1 (M131, 1998, ft, all 24 pads, as-built from the project book). CFG is Memo 131 converted to metres for 18 pads (max difference 0.033 m); pads 7 and 8 differ (Memo 131 has a typo in pad 7 north and CFG pad 8 north is 6.33 m south of the memo value; see Conflicts). Pads 10, 13, 22, 24 come from the memo only (DERIVED from ft). The absolute position of pad 1 is NOT FOUND; the only sourced absolute point is the EHT 2017 phasing center (19.82423 deg, -155.47755 deg, h 4115.1 m GRS80, DERIVED from P2 Table 2 XYZ).

**Configurations (current)**: SUB [1, 2, 3, 4, 5, 6, 8, 23], COM [1, 4, 5, 7, 8, 9, 12, 23], EXT [1, 9, 11, 12, 14, 15, 16, 17], VEX [1, 12, 16, 17, 18, 19, 20, 21] (CFG, matching OCS's pad lists). Baselines (DERIVED from CFG, 3-D): SUB 9.48-69.08 m (inner six pads 9.48-25.31 m, 15 baselines; OCS 9.5-25 m), COM 16.45-76.98 m (OCS ~70 m; inner four pads 16.45-32.37 m vs OCS 16.5-32 m), EXT 44.17-226.01 m (OCS 220 m), VEX 68.39-508.91 m (OCCALL 508 m, OCSPEC 509 m). All 24 pads: shortest 7.96 m (pads 4-22; OCSPEC 8 m), longest 508.91 m (pads 1-19). 2026A schedule: COM through September, EXT or SUB for the last six weeks; VEX unavailable (storm damage, pads 18 and 19); 2026B/2027A schedule NOT FOUND.

**Receivers and correlator**: four legacy single-polarization DSB receivers (230, 240, 345, 400 GHz; LO 194-238, 212-265, 252-352, 336-408 GHz) and, as of February 2026, two antennas with the dual-polarization wSMA (Low LO 210-270, High LO 273-357 GHz; up to five by mid-2026). IF 4-16 GHz, so RF = LO +/- 16 GHz; SWARM gives 12 GHz per sideband per receiver, 24 GHz per receiver, 48 GHz with two receivers, 140 kHz channels.

**Primary beam**: 55, 51, 36, 31 arcsec at 230, 240, 345, 400 GHz (OCSPEC) = 1.19-1.23 lambda/D (DERIVED), adopted k = 1.2. **Elevation**: hardstops 6.7-89 deg (HUN13); subcompact/inner ring >= 33 deg (OCS); calculator default 15 deg (OCBC); Memo 131 used 20 deg. **Beams (validation targets)**: OCS characteristic resolutions at 345 GHz: 5 (SUB inner six), 2.5 (COM), 0.7-0.8 (EXT), ~0.25 arcsec (VEX); Memo 131 Table 3 for the 1998 configurations. **Largest scale**: NOT FOUND (DERIVED here).

## Recommendation for the page (INFERRED choices marked)

- **Menu**: `SUB` "Subcompact" (8 pads), `COM` "Compact", `EXT` "Extended", `VEX` "Very extended" (flag: out of service in 2026A; keep it, since the pads are surveyed and the page teaches the design). Optional fifth entry "Inner ring" = pads 1-6 only (the beam calculator's INR; a subset of SUB). Do not offer `compact.n` (no SMA page lists it).
- **Defaults** (INFERRED): `{ cfg: "COM", band: "230", nu: 225, dec: 20, dur: 6 }`. COM is the only configuration scheduled through September 2026; 225 GHz is the middle of the 1.3 mm window; declination +20 passes near the zenith (latitude 19.8 deg); 6 h is the OCSPEC sensitivity convention.
- **Bands** (INFERRED): `230` lo 180 hi 286, bw 24; `345` lo 236 hi 418, bw 24 (GHz). lo/hi are the union of the RF coverage LO +/- 16 GHz of the 230/240/wSMA-Low and 345/400/wSMA-High receivers, clipped to the quoted 180-418 GHz; bw is 12 GHz per sideband x 2 sidebands per receiver (48 GHz with two receivers).
- **Page fields**: dish 6, lat 19.8242, pb k = 1.2, elLimit 15 (SUB and inner ring 33), bmax per configuration from the DERIVED baselines (SUB 69.1, COM 77.0, EXT 226.0, VEX 508.9 m). The pad coordinates are given about pad 1; the reference point is pad 1, its absolute position NOT FOUND (use the EHT phasing center only for the latitude).
- **The page's model cannot represent**: the two sidebands with the 8 GHz gap (DSB receivers, so a line in the image sideband also adds noise); simultaneous dual-receiver operation and the 44 GHz continuous-coverage mode; the per-configuration elevation limit (SUB 33 deg) unless elLimit becomes a per-config value; antenna-to-pad assignment and 6-7 antenna operation (the array is often 7 antennas; a track passes with 7); the 1998 vs current pad sets; the reconfiguration schedule (one configuration per semester or part of one); phasing (6 x 6 m phased SMA as one EHT station).

## Sources

| key | document | local file | URL |
|---|---|---|---|
| CFG | CASA data repository casa-data (NRAO open Bitbucket, project CASA), alma/simmos/sma.{subcompact,compact,compact.n,extended,vextended}.cfg, branch master: CASA simulator antenna files for the SMA (header "# observatory=SMA", "# coordsys=LOC (local tangent plane)", columns x y z diam pad#; 8 rows each; x east, y north, z up in m, pad 1 at the origin). Fetched 2026-11-18 | `rawdata/interf/sma/sma.{subcompact,compact,compact.n,extended,vextended}.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/sma.subcompact.cfg?at=refs%2Fheads%2Fmaster (and the same path with sma.compact, sma.compact.n, sma.extended, sma.vextended) |
| CASAH | Bitbucket REST commit history of each of the five SMA cfg files (casa-data, master): one commit each, the same one, 1b0506edc78eea6cb086aabbb5636b8db1657fd1, authorTimestamp 1489013602000 ms = 2017-03-08, message "subversion revision 11005" (predates the git migration). Fetched 2026-11-18 | `rawdata/interf/sma/casa-data_commits_sma.{subcompact,compact,compact.n,extended,vextended}.cfg.json` | https://open-bitbucket.nrao.edu/rest/api/1.0/projects/CASA/repos/casa-data/commits?path=alma/simmos/sma.subcompact.cfg&limit=5&until=refs%2Fheads%2Fmaster (and the other four files) |
| M131 | Wilner, D. 1998 January 15, SMA Technical Memo #131 "SMA Synthesized Beam Characteristics": Table 1 SMA Antenna Pad Locations (24 pads, ft, north / east / elevation, as-built from the project book), Table 2 pads of the 1998 configurations A-D, Table 3 synthesized beams at 345 GHz, Fig. 1 pad map. Fetched 2026-11-18 | `rawdata/interf/sma/memo131.pdf` | https://lweb.cfa.harvard.edu/sma/memos/131.pdf |
| KETO | Keto, E. 1997, ApJ 475, 843, "The Shapes of Cross-Correlation Interferometers" (publisher PDF via the ADS PUB_PDF gateway, 10 pp). Fetched 2026-11-18 | `rawdata/interf/sma/keto1997_ApJ475_843.pdf` | https://ui.adsabs.harvard.edu/link_gateway/1997ApJ...475..843K/PUB_PDF |
| HO04 | Ho, P. T. P., Moran, J. M., & Lo, K. Y. 2004, ApJ 616, L1, "The Submillimeter Array" (arXiv:astro-ph/0406352; Table 1 basic characteristics, Sec. 2.3 configuration of the array, Fig. 3 pad layout). Fetched 2026-11-18 | `rawdata/interf/sma/ho2004_arXiv_astro-ph_0406352.pdf` | https://arxiv.org/pdf/astro-ph/0406352 |
| OCS | SMA Observer Center, "Array Status and Technical Information" (2026A call; "Last updated: 2026-Feb-5"): receivers (Tables 1A, 1B), correlator (Table 2), array configurations, configuration schedule. Fetched 2026-11-18 | `rawdata/interf/sma/oc_status.html` | http://sma1.sma.hawaii.edu/status.html |
| OCSPEC | SMA Observer Center, "Specifications of the SMA" (Quick Specs): baselines, best resolution, antennas, receivers, primary beam, Tsys, backend. Fetched 2026-11-18 | `rawdata/interf/sma/oc_specs.html` | http://sma1.sma.hawaii.edu/specs.html |
| OCSCHED | SMA Observer Center, "Array Configuration Schedule" ("Last updated: 2026-Feb-4"): 2025B and 2026A configuration plan. Fetched 2026-11-18 | `rawdata/interf/sma/oc_array_config_sched.html` | http://sma1.sma.hawaii.edu/array_config_sched.html |
| OCCALL | SMA Observer Center, "Call for SAO SMA Science Observing Proposals" (2026A call, deadline 2026-03-04): configurations and maximum baselines, bandwidth, observing practice. Fetched 2026-11-18 | `rawdata/interf/sma/oc_call.html` | http://sma1.sma.hawaii.edu/call.html |
| OCBC | SMA Observer Center, "SMA Multi-config Beam Calculator & Sensitivity Estimator" (form page): configuration choices, the 24 pads with their antenna numbers, elevation assumptions. Fetched 2026-11-18 | `rawdata/interf/sma/oc_beamcalc.html` | http://sma1.sma.hawaii.edu/beamcalc.html |
| OCBCN | SMA Observer Center, "SMA Beam Calculator & Sensitivity Estimator Notes" (M. Gurwell, updated 05 February 2020): IF range, receiver temperatures, on-source fraction, sideband beams. Fetched 2026-11-18 | `rawdata/interf/sma/oc_beamcalc_notes2020.html` | http://sma1.sma.hawaii.edu/beamcalc_notes2020.html |
| HUN13 | Hunter, T. R., et al. 2013, J. Astron. Instrum. 2, 1350002, "The Digital Motion Control System for the Submillimeter Array Antennas" (arXiv:1303.4397): hardstop range of motion. Fetched 2026-11-18 | `rawdata/interf/sma/hunter2013_arXiv1303.4397.pdf` | https://arxiv.org/pdf/1303.4397 |
| WSMA | Grimes, P. K., et al. 2024, SPIE 13096, 1309639, "Upgrading the Submillimeter Array: wSMA and beyond" (arXiv:2406.17192). Fetched 2026-11-18 | `rawdata/interf/sma/grimes2024_arXiv2406.17192.pdf` | https://arxiv.org/pdf/2406.17192 |
| ESMA | Bottinelli, S., et al. 2008, SPIE 7012, 70120D, "The eSMA: description and first results" (arXiv:0808.2554). Fetched 2026-11-18 | `rawdata/interf/sma/bottinelli2008_arXiv0808.2554.pdf` | https://arxiv.org/pdf/0808.2554 |
| SWARM | Primiani, R. A., et al. 2016, J. Astron. Instrum. 5, 1641006, "SWARM: A 32 GHz Correlator and VLBI Beamformer for the Submillimeter Array" (arXiv:1611.02596). Fetched 2026-11-18 | `rawdata/interf/sma/primiani2016_arXiv1611.02596.pdf` | https://arxiv.org/pdf/1611.02596 |
| CSO | Caltech news, "Caltech's Submillimeter Observatory Has Been Removed from Maunakea", 2024-07-02 (HTML). Fetched 2026-11-18 | `rawdata/interf/sma/caltech_cso_removed.html` | https://experts.caltech.edu/news/caltechs-submillimeter-observatory-has-been-removed-from-maunakea |
| P2 | EHT Collaboration 2019, ApJL 875, L2, Paper II "Array and Instrumentation" (already saved by the eht2017 record; not copied): Table 2 station XYZ (the SMA phasing center), Table 3 note c, Appendix A.9. Cited by its eht2017 key | `rawdata/interf/eht2017/EHT2019_Paper2_arXiv1906.11239.pdf` | https://arxiv.org/pdf/1906.11239 |
| EHTIM | ehtim array file EHT2017.txt (already saved by the eht2017 record; not copied): the SMA row of the older ehtim array table | `rawdata/interf/eht2017/ehtim_arrays_EHT2017.txt` | (see data/interf/eht2017.md, source ehtim) |
| ADS | NASA ADS API response (one query on seven bibcodes; fields bibcode, title, author, year, pub, volume, page, doi, identifier). Fetched 2026-11-18 | `rawdata/interf/sma/ads_bibcodes.json` | https://api.adsabs.harvard.edu/v1/search/query (q = bibcode:(...)) |

The five CFG keys used in quote records are CFGSUB, CFGCOM, CFGCOMN, CFGEXT, CFGVEX (one file each; the SRC key `CFG` covers all five).

**Downloads read but not cited** (in `rawdata/interf/sma/not_cited/`): `oc_proposing.html`, `oc_tools.html`, `oc_tsyscalc.html`, `oc_tac_proc.html`, `oc_call_largescale.html` (SMA Observer Center pages with no value used here); `oc_beamcalc.singlecon.html` (older single-configuration beam calculator: subcompact limit 31.3 deg, superseded by the 33 deg of the multi-config page); `oc_beamcalc_notes.html` (older 2017-2019 calculator notes: IF 8 GHz, superseded by `oc_beamcalc_notes2020.html`); `sma_data_format_2021.pdf` (MIR data format: the `antennas` file holds X, Y, Z in m, no values given); `memo02.pdf` (Design Study Memo 2, array configurations, 1989; scanned, not read in full), `memo32.pdf` (Hawaii Site Plan, 1990: 500 m baseline rationale), `memo77.pdf` (Synthesis beams of tangential..., scanned), `memo94.pdf` (azimuth cable wrap), `memo104.pdf`, `memo150.pdf` (elevation drive; elevation range at 20 deg only mentioned), `memo163.pdf` (beamformer), `arxiv_astro-ph_0606514.pdf` (Matsushita et al., focus vs elevation).

## Site

| id | value | source, location | quote |
|---|---|---|---|
| site_h | 4080 m | WSMA, Sec. 2, first sentence | "located atop Maunakea in Hawaii at 4080m AMSL"<br>ALT: HO04, Sec. 1: "at an elevation of 4,080 m"<br>Note: Nominal altitude (above mean sea level, "AMSL"). |
| phasing_xyz | -5464555.5, -2492928.0, 2150797.2 m | P2, Table 2, SMA row | "-5464555.5 -2492928.0 2150797.2"<br>ALT: P2, Table 2 note b: "Array coordinates indicate the phasing center used in 2017."<br>Note: Converted to GRS80 by this record: lat 19.82423 deg, lon -155.47755 deg, h 4115.08 m (DERIVED, Sec. Site); P2 Table 2 lists 4115.1 m GRS80. |
| site_h_p2 | 4115.1 m | P2, Table 2, SMA row | "2150797.2 ... 4115.1"<br>ALT: P2, Table 2 note a: "Elevations are relative to the GRS80 ellipsoid"<br>Note: The 35 m difference from 4080 m is the geoid undulation plus the 2017 phasing reference (not a conflict in the pads). |

**DERIVED (GRS80 from the P2 XYZ)**: lat 19.82423 deg, lon -155.47755 deg, h 4115.08 m (a = 6378137 m, 1/f = 298.257222101, iterated; P2 Table 2 lists h 4115.1 m; the eht2017 record has 19.8242222, -155.4775278). The EHT phasing center cannot be placed on the pad map: no source gives the absolute position of pad 1 (NOT FOUND). The older ehtim row (`EHTIM`) differs from the P2 point by sqrt(32.1^2 + 219.08^2 + 185.45^2) = 288.8 m, so the two EHT files already disagree by more than half the pad field's size; whether the phasing center sits near the middle of the pads is NOT FOUND (P2 Table 2 note b says only that the array coordinates indicate the phasing center used in 2017).

## Array

| id | value | source, location | quote |
|---|---|---|---|
| n_antennas | 8 | OCSPEC, Antennas table | "quantity 8"<br>ALT: OCS, Array Configurations: "The full complement of 8 array antennas is potentially available"<br>ALT: HO04, Table 1: "Interferometer elements 8 6-meter, f/0.4 paraboloids, bent-Nasmyth optics"<br>ALT: WSMA, Sec. 2: "The Submillimeter Array (SMA) is an 8-element radio interferometer located atop Maunakea"<br>Note: Operational maximum; tracks run with 7 (sometimes 6) antennas when maintenance requires (OCS Array Configurations). |
| dish | 6.0 m | OCSPEC, Antennas table | "diameter 6m"<br>ALT: HO04, Table 1: "Interferometer elements 8 6-meter, f/0.4 paraboloids, bent-Nasmyth optics" |
| surface_rms | 11-18 micron | OCSPEC, Antennas table | "surface accuracy (rms) 11-18"<br>ALT: HO04, Table 1: "Surface accuracy 12 microns rms" |
| aper_eff | 0.70-0.80, 0.60-0.75, 0.60-0.75 | OCSPEC, Antennas table | "aperture efficiency (230/240 GHz) (345 GHz) (400 GHz) 0.70-0.80 0.60-0.75 0.60-0.75" |
| optics | f/0.4 paraboloid, bent-Nasmyth, alt-azimuth mount | HO04, Table 1 | "Telescope mount alt-azimuth"<br>ALT: HO04, Table 1: "Secondary reflector machined aluminum, 10Hz chopping"<br>Note: No central blockage or secondary diameter is published in the sources found (NOT FOUND). |

## Pads: all 24, with provenance

| id | value | source, location | quote |
|---|---|---|---|
| pad_origin | local tangent plane east (x), north (y), up (z) in m; pad 1 at (0, 0, 0) | CFGSUB, file header and first row | "# observatory=SMA # coordsys=LOC (local tangent plane) # x y z diam pad# 0.00 0.00 0.00 6. 1"<br>ALT: CFGEXT, file header: "# observatory=SMA # coordsys=LOC (local tangent plane)"<br>Note: CASA reads LOC files relative to the Observatories row named SMA; the casa-data Observatories table has no SMA row (checked by a string search of the ALMA record's saved copy), so the absolute origin is not defined by CASA. |
| cfg_sub | 1, 2, 3, 4, 5, 6, 8, 23 | CFGSUB, rows | "0.00 0.00 0.00 6. 1 -7.47 -5.84 -0.01 6. 2 -23.76 -8.23 -0.06 6. 3 -25.16 1.37 -0.04 6. 4 -18.98 16.62 -0.08 6. 5 -10.11 13.01 -0.01 6. 6 -63.88 -22.06 -3.21 6. 8 -59.57 34.35 -6.64 6. 23" |
| cfg_com | 1, 4, 5, 7, 8, 9, 12, 23 | CFGCOM, rows | "0.00 0.00 0.00 6. 1 -25.16 1.37 -0.04 6. 4 -18.98 16.62 -0.08 6. 5 -20.09 -15.73 -0.10 6. 7 -63.88 -22.06 -3.21 6. 8 -68.02 5.59 -4.79 6. 9 -53.67 -42.30 -2.75 6. 12 -59.57 34.35 -6.64 6. 23" |
| cfg_comn | 1, 4, 5, 7, 9, 12, 16, 23 | CFGCOMN, rows | "0.00 0.00 0.00 6. 1 -25.16 1.37 -0.04 6. 4 -18.98 16.62 -0.08 6. 5 -20.09 -15.73 -0.10 6. 7 -68.02 5.59 -4.79 6. 9 -53.67 -42.30 -2.75 6. 12 -71.55 95.53 -10.84 6. 16 -59.57 34.35 -6.64 6. 23" |
| cfg_ext | 1, 9, 11, 12, 14, 15, 16, 17 | CFGEXT, rows | "0.00 0.00 0.00 6. 1 -68.02 5.59 -4.79 6. 9 -27.03 34.55 -5.13 6. 11 -53.67 -42.30 -2.75 6. 12 -178.82 3.36 -11.45 6. 14 -136.76 118.97 -11.77 6. 15 -71.55 95.53 -10.84 6. 16 -133.60 -107.01 -10.38 6. 17" |
| cfg_vex | 1, 12, 16, 17, 18, 19, 20, 21 | CFGVEX, rows | "0.00 0.00 0.00 6. 1 -53.67 -42.30 -2.75 6. 12 -71.55 95.53 -10.84 6. 16 -133.60 -107.01 -10.38 6. 17 -349.68 42.55 -24.69 6. 18 -479.03 167.96 -36.17 6. 19 -251.59 335.61 -18.58 6. 20 -73.52 321.22 -20.29 6. 21" |
| casah | one commit, 2017-03-08, "subversion revision 11005" | CASAH, JSON values[0] | ""authorTimestamp":1489013602000,"committer""<br>ALT: CASAH, JSON values[0]: ""message":"subversion revision 11005""<br>Note: All five files have the same single commit (2017-03-08); casa-data master holds nothing newer for the SMA. |
| m131_t1_title | 24 pads: north, east, elevation (ft) about a ground reference ft | M131, Table 1 caption | "Table 1: SMA Antenna Pad Locations (unit: ft)"<br>ALT: M131, Sec. 2: "The project book lists the as-built antenna pad locations in local ground based coordinates measured to the north, to the east, and in elevation."<br>ALT: M131, Sec. 2: "Table 1 reproduces these locations after subtracting constant" |
| m131_pads | see pads table ft | M131, Table 1 | "1 27.22 78.70 0.78 2 8.07 54.20 0.76 3 0.23 0.75 0.58 4 31.73 -3.83 0.66 5 81.74 16.42 0.53 6 69.91 45.53 0.74 7 884.61 12.80 0.45 8 -24.39 -130.89 -9.75 9 45.56 -144.46 -14.92 10 174.46 -88.71 -21.24 11 140.57 -9.99 -16.05 12 -111.45 -97.37 -8.23 13 -165.01 -515.08 -36.90 14 38.23 -507.98 -36.80 15 417.53 -369.99 -37.85 16 340.63 -156.06 -34.78 17 -323.85 -359.63 -33.26 18 166.83 -1068.56 -80.21 19 578.27 -1492.93 -117.88 20 1128.31 -746.72 -60.17 21 1081.08 -162.50 -65.80 22 57.42 0.84 0.69 23 139.93 -116.74 -21.01 24 387.10 -478.66 -37.72" |
| m131_cfg_tab | A 1 17 18 19 20 21 (+two); B 1 12 13 14 15 16 17 24; C 1 7 8 9 10 11 12 23; D 1 2 3 4 5 6 7 22 | M131, Table 2 | "A 1 17 18 19 20 21 (+two) B 1 12 13 14 15 16 17 24 C 1 7 8 9 10 11 12 23 D 1 2 3 4 5 6 7 22"<br>ALT: M131, Sec. 2: "Each con"<br>Note: These 1998 configurations A-D are NOT the current SUB/COM/EXT/VEX pad sets (compare OCS). |
| oc_pads_ant | 24 pads; antenna numbers: pad 1 ant 8, pad 4 ant 4, pad 5 ant 6, pad 7 ant 1, pad 8 ant 2, pad 9 ant 3, pad 12 ant 7, pad 23 ant 5 | OCBC, Pads for custom configuration | "1 (ant. 8) 2 3 4 (ant. 4) 5 (ant. 6) 6 7 (ant. 1) 8 (ant. 2) 9 (ant. 3) 10 11 12 (ant. 7) 13 14 15 16 17 18 19 20 21 22 23 (ant. 5) 24"<br>Note: The antennas listed sit on the pads of the current configuration (COM); pads 1, 4, 5, 7, 8, 9, 12, 23 = the CFG compact pad set. |

Columns: CFG east, north, up (m, pad 1 at the origin); Memo 131 ENU = (value - pad 1 value) x 0.3048 (DERIVED: e.g. pad 4: east (-3.83 - 78.70) x 0.3048 = -25.16 m, north (31.73 - 27.22) x 0.3048 = 1.37 m, up (0.66 - 0.78) x 0.3048 = -0.04 m); difference = CFG - memo.

| pad | CFG E | CFG N | CFG U | memo E | memo N | memo U | CFG-memo (E, N, U) m | in configurations |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | +0.000, +0.000, +0.000 | SUB, COM, EXT, VEX |
| 2 | -7.47 | -5.84 | -0.01 | -7.47 | -5.84 | -0.01 | -0.002, -0.003, -0.004 | SUB |
| 3 | -23.76 | -8.23 | -0.06 | -23.76 | -8.23 | -0.06 | -0.001, -0.003, +0.001 | SUB |
| 4 | -25.16 | 1.37 | -0.04 | -25.16 | 1.37 | -0.04 | -0.005, -0.005, -0.003 | SUB, COM |
| 5 | -18.98 | 16.62 | -0.08 | -18.98 | 16.62 | -0.08 | +0.003, +0.002, -0.004 | SUB, COM |
| 6 | -10.11 | 13.01 | -0.01 | -10.11 | 13.01 | -0.01 | +0.000, -0.002, +0.002 | SUB |
| 7 | -20.09 | -15.73 | -0.10 | -20.09 | 261.33 | -0.10 | -0.004, -277.062, +0.001 | COM |
| 8 | -63.88 | -22.06 | -3.21 | -63.88 | -15.73 | -3.21 | +0.003, -6.329, -0.000 | SUB, COM |
| 9 | -68.02 | 5.59 | -4.79 | -68.02 | 5.59 | -4.79 | -0.001, -0.000, -0.005 | COM, EXT |
| 10 | (not in CFG) | | | -51.03 | 44.88 | -6.71 | memo only | none current (1998: C) |
| 11 | -27.03 | 34.55 | -5.13 | -27.03 | 34.55 | -5.13 | +0.003, +0.001, -0.000 | EXT |
| 12 | -53.67 | -42.30 | -2.75 | -53.67 | -42.27 | -2.75 | -0.004, -0.033, -0.004 | COM, EXT, VEX |
| 13 | (not in CFG) | | | -180.98 | -58.59 | -11.48 | memo only | none current (1998: B) |
| 14 | -178.82 | 3.36 | -11.45 | -178.82 | 3.36 | -11.45 | +0.000, +0.004, +0.004 | EXT |
| 15 | -136.76 | 118.97 | -11.77 | -136.76 | 118.97 | -11.77 | +0.001, +0.004, +0.004 | EXT |
| 16 | -71.55 | 95.53 | -10.84 | -71.55 | 95.53 | -10.84 | +0.005, +0.003, -0.001 | EXT, VEX, COM-N (CFG only) |
| 17 | -133.60 | -107.01 | -10.38 | -133.60 | -107.01 | -10.38 | +0.003, -0.004, -0.005 | EXT, VEX |
| 18 | -349.68 | 42.55 | -24.69 | -349.68 | 42.55 | -24.69 | +0.005, -0.003, -0.004 | VEX |
| 19 | -479.03 | 167.96 | -36.17 | -479.03 | 167.96 | -36.17 | +0.003, -0.000, -0.002 | VEX |
| 20 | -251.59 | 335.61 | -18.58 | -251.59 | 335.61 | -18.58 | -0.002, -0.002, -0.002 | VEX |
| 21 | -73.52 | 321.22 | -20.29 | -73.52 | 321.22 | -20.29 | -0.002, +0.003, +0.004 | VEX |
| 22 | (not in CFG) | | | -23.73 | 9.20 | -0.03 | memo only | none current (1998: D) |
| 23 | -59.57 | 34.35 | -6.64 | -59.57 | 34.35 | -6.64 | +0.000, -0.004, +0.002 | SUB, COM |
| 24 | (not in CFG) | | | -169.88 | 109.69 | -11.73 | memo only | none current (1998: B) |

**Rigid fit** (rotation + translation, horizontal) of the memo positions onto CFG for the 17 pads that agree to < 0.02 m: rotation 0.00009 deg, rms 0.0039 m, max 0.0069 m. CFG is therefore the memo table converted from ft, rounded to 0.01 m (pad 12 north differs by 0.033 m); it is one measurement set, not two. Two exceptions: pad 7 north (memo 884.61 ft, a typo; CFG -15.73 m, which is the value the memo gives for pad 8) and pad 8 north (memo -15.73 m, CFG -22.06 m). **Current source**: CFG for the 20 pads in current use (the file is the CASA simulator's SMA geometry, dated 2017-03-08 by its single commit); the memo (1998) for pads 10, 13, 22, 24. Whether Memo 131 or CFG is right for pad 8 could not be decided from the saved documents; the page should use CFG (the maintained file) and the notes should carry the 6 m ambiguity.

## Configurations and baselines

| id | value | source, location | quote |
|---|---|---|---|
| oc_sub | pads 1-6 plus two others, typically 8 and 23; inner ring baselines 9.5-25 m (15 baselines) | OCS, Array Configurations | "subcompact : This configuration utilizes six pads on the inner ring (pads 1 through 6) plus two others, typically pads 8 and 23."<br>ALT: OCS, Array Configurations: "This array provides 15 baselines on the inner ring ranging from 9.5 to 25 m in length; the characteristic resolution is 5 arcsec at 345 GHz (using just the six inner ring antennas)." |
| oc_com | pads 1, 4, 5, 7, 8, 9, 12, 23; max baseline ~70 m; characteristic resolution 2.5 arcsec at 345 GHz; inner ring 6 baselines 16.5-32 m | OCS, Array Configurations | "compact : This configuration uses pads on the inner ring and second ring (pads 1,4,5,7,8,9,12,23) and provides maximum baseline lengths of approximately 70 meters and characteristic resolution of 2.5 arcsec at 345 GHz."<br>ALT: OCS, Array Configurations: "provides only six baselines on the inner ring, ranging in length from 16.5 to 32 m" |
| oc_ext | pads 1, 9, 11, 12, 14, 15, 16, 17; max baseline 220 m; 0.7-0.8 arcsec at 345 GHz | OCS, Array Configurations | "extended : This configuration includes pads on the third ring (pads 1,9,11,12,14,15,16,17) and provides maximum baseline lengths to 220 meters and characteristic resolution of 0.7-0.8 arcsec at 345 GHz." |
| oc_vex | pads 1, 17, 18, 19, 20, 21 plus two others, typically 12 and 16; max baseline just over 500 m; ~0.25 arcsec at 345 GHz | OCS, Array Configurations | "very extended : This configuration uses pads on the fourth ring (pads 1,17,18,19,20,21 plus two others, typically pads 12 and 16) to reach maximum baselines of just over 500 meters, with a characteristic resolution down to ~0.25 arcsec at 345 GHz." |
| vex_damage | not currently possible; repair planned not before late FY2026 | OCS, Array Configurations; Array Configuration Schedule | "Due to storm damage to roads and infrastructure to pads 18 and 19, VEX configuration is currently not possible."<br>ALT: OCS, Array Configuration Schedule: "will not commence until late FY2026 at the earliest" |
| call_maxbl | 30 m (SUB inner ring), 70 m (COM), 220 m (EXT), 508 m (VEX) m | OCCALL, RA Coverage by Semester and UV Plane Considerations | "The SMA operates in 4 configurations with maximum baselines of 30m (the six antennas on the inner ring of "subcompact"), 70m ("compact"), 220m ("extended"), and 508m ("very extended")"<br>ALT: WSMA, Sec. 2: "with maximum baselines of 30m for the six antennas on the inner ring"<br>ALT: WSMA, Sec. 2: "Very Extended with baselines up to 508m" |
| specs_bl | 8 - 509 m | OCSPEC, Array table | "baseline length 8 - 509m"<br>ALT: HO04, Table 1: "Available baselines 9 - 500 meters"<br>ALT: P2, App. A.9: "baselines as long as 509 m"<br>ALT: ESMA, Sec. 1: "the longest baseline extends to 782 m, compared to 509 m" |
| inr_option | beam calculator offers INR, SUB, COM, EXT, VEX | OCBC, Array Configuration | "INR (inner ring only) SUB COM EXT VEX" |
| reconfig | 2 to 3 days day | OCSCHED, end of page | "Reconfiguration of the array typically requires 2 to 3 days, including antenna moves and recalibration." |
| sched_2026 | 2026A: compact through September; EXT or SUB considered for the final six weeks; 2026B/2027A schedule NOT FOUND | OCSCHED, 2026A paragraph | "In 2026A, the SMA will be in compact (COM) configuration through September."<br>ALT: OCSCHED, 2026A paragraph: "EXT or SUB configurations will be considered for the final six weeks of the semester, depending upon proposal pressure."<br>ALT: OCSCHED, footer: "Last updated: 2026-Feb-4"<br>ALT: OCS, footer: "Last updated: 2026-Feb-5"<br>Note: The pages saved 2026-11-18 still carry the 2026A call; no 2026B (from 16 Nov 2026) schedule is posted. |
| sched_2025 | 2025B: Compact, no reconfigurations; 2025A: extended 14 Jun - 8 Jul, compact 10 Jul - 24 Aug, subcompact 26 Aug - 21/28 Oct, compact 23/30 Oct - 15 Nov 2025 | OCSCHED, 2025B and 2025A table | "2025B: Compact There will be no reconfigurations during 2025B."<br>ALT: OCSCHED, Semester 2025A table: "extended 14 June 2025 8 July 2025 back to science compact 1 10 July 2025 24 August 2025 subcompact 26 August 2025 21/28 October 2025 compact 2 23/30 October 2025 15 November 2025" |

**Baselines DERIVED from CFG** (3-D distances of the eight pads, 28 baselines each; horizontal projections differ by < 1.3 m):

| config | pads | published max (source) | derived min (m) | derived max (m) | agreement |
|---|---|---|---|---|---|
| SUB | 1, 2, 3, 4, 5, 6, 8, 23 | 30 (inner ring; 9.5-25 m inner baselines) | 9.48 | 69.08 | inner ring 9.48-25.31 vs OCS 9.5-25 (agree); 8-pad max 69.08 vs 30 (inner six only) |
| COM | 1, 4, 5, 7, 8, 9, 12, 23 | about 70 | 16.45 | 76.98 | inner four 16.45-32.37 vs OCS 16.5-32 (agree); max 76.98 vs ~70 (+10%) |
| EXT | 1, 9, 11, 12, 14, 15, 16, 17 | 220 | 44.17 | 226.01 | 226.01 vs 220 (+2.7%) |
| VEX | 1, 12, 16, 17, 18, 19, 20, 21 | 508 / just over 500 / 509 | 68.39 | 508.91 | 508.91 vs 508 (OCCALL) / 509 (OCSPEC): agree |

INR (inner ring only, pads 1-6): 15 baselines, 9.48-25.31 m (OCS: 15 baselines, 9.5 to 25 m). All 24 pads: shortest 7.96 m (pads 4-22), longest 508.91 m (pads 1-19); OCSPEC "8 - 509m" reproduced.

## Design: Reuleaux triangles (Keto 1997)

| id | value | source, location | quote |
|---|---|---|---|
| keto_abs | antennas on a curve of constant width; best = Reuleaux triangle | KETO, Abstract | "The most uniform sampling within this circular region in Fourier space will be created by the particular symmetric curve of constant width that has the lowest degree of rotational symmetry"<br>ALT: KETO, Abstract: "which is the Reuleaux triangle"<br>ALT: KETO, Abstract: "will be constructed with a design based on the Reuleaux triangle"<br>ALT: KETO, Sec. 3 (constant width): "Placing the antennas along a curve of constant width ensures that the maximum separation of the antennas, and thus the resolution, will be the same in all directions." |
| keto_pert | small perturbations break symmetries; found numerically (self-organizing neural network) | KETO, Abstract | "the sampling can be further improved by perturbing the antenna locations slightly"<br>ALT: KETO, Abstract: "Self-organizing neural networks which are" |
| ho_rings | 4 nested rings, 24 pads, up to 8 pads per ring; each ring an optimized Reuleaux triangle | HO04, Sec. 2.3; Table 1 | "To provide different angular resolutions the array consists of four nested"<br>ALT: HO04, Sec. 2.3: "is an optimized Reuleaux triangle, accommodating up to eight pads."<br>ALT: HO04, Table 1: "Array configuration 4 nested rings, 24 pads, up to 8 pads per ring"<br>ALT: HO04, Sec. 2.3: "Some compromises were eventually made because of the topography of the site."<br>ALT: HO04, Sec. 2.3: "Addition of the two ASIAA telescopes was accommodated within this Reuleaux triangle scheme on an ad hoc basis." |
| ho_rule | constant maximum separation => circular beam at the zenith; triangle maximizes the angles between baseline vectors | HO04, Sec. 2.3 | "the maximum separation between telescopes is a constant. This ensures that the maximum uv plane spacings lie on a circle"<br>ALT: HO04, Sec. 2.3: "The choice of a triangle, versus a polygon of more sides, ensures that the angles between baseline vectors" |
| m131_reul | four tangential Reuleaux triangles | M131, Sec. 1 | "The antenna stations for the SMA on Mauna Kea are arranged approximately in four tangential Releaux triangles that provide"<br>ALT: M131, Fig. 1 caption: "showing the four tangential Releaux triangles that comprise the A, B, C, and D" |

**The rule** (KETO): put the antennas on a curve of constant width, because then the largest baseline is the same in every direction and the highest spatial frequencies fall on a circle (equal resolution in all directions); of all such curves the Reuleaux triangle (an equilateral triangle with its sides replaced by circular arcs centered on the opposite vertices) gives the most uniform sampling of the rest of the Fourier disk because it has the least rotational symmetry; then perturb the antennas slightly off the curve (the SMA's were found with a neural-network search, HO04).

**Do the built pads follow it? (DERIVED)** For a curve of constant width the extent of the pad set projected on any direction (maximum minus minimum) is the same. Over directions at 1 deg steps, the projected extent of each ring's pads (CFG) varies as follows, as peak-to-peak over mean:

| set | min extent (m) | max extent (m) | (max - min)/mean |
|---|---|---|---|
| inner six pads (1-6) | 23.8 | 25.3 | 0.059 |
| SUB (8 pads) | 53.0 | 68.8 | 0.253 |
| COM | 64.0 | 76.9 | 0.185 |
| EXT | 164.5 | 226.0 | 0.321 |
| VEX | 386.7 | 507.6 | 0.270 |
| control: 8 points evenly spaced on a perfect Reuleaux triangle (40 rotations) | | | 0.104-0.136 |
| control: 6 points evenly spaced (40 rotations) | | | 0.035-0.140 |

So the six inner-ring pads are close to a constant-width shape (6%); the outer rings, which have to avoid lava fields and slopes (HO04: "Some compromises were eventually made because of the topography of the site"; the two ASIAA antennas were fitted in "on an ad hoc basis"), deviate by 18-32%, about twice the 10-14% that eight evenly spaced points on an ideal triangle already show. The page can teach the principle with the inner ring and show the outer rings as approximations. Memo 131's Fig. 1 caption and Sec. 1 describe the layout as "four tangential Reuleaux triangles".

## Receivers and correlator

| id | value | source, location | quote |
|---|---|---|---|
| rx_legacy | 230 (RxA V), 240 (RxB H), 345 (RxA V), 400 (RxB H) GHz | OCS, Receivers | "Prior to the wSMA upgrade program each cryostat was equipped with four single pol receivers each, named 230GHz(RxA V), 240GHz(RxB H), 345GHz(RxA V), and 400GHz(RxB H)."<br>ALT: WSMA, Sec. 2: "All eight antennas are currently equipped with four receivers each, named 230GHz(RxA), 240GHz(RxB), 345GHz(RxA), and 400GHz(RxB)." |
| rx_lo_legacy | 230: 194-238; 240: 212-265; 345: 252-352; 400: 336-408 GHz | OCS, Table 1A | "LO Frequency Range 194-238 GHz 1 212-265 GHz 2 252-352 GHz 336-408 GHz 3"<br>ALT: OCS, Table 1A note 1: "In the 230 GHz band, an LO range of 188-244 GHz is available with 7 antennas." |
| rx_if_rf | IF 4-16 GHz in each sideband; RF = LO +/- (4 to 16) GHz | OCS, Receivers | "add +/-16 GHz to the LO range to get the full correlator RF range."<br>ALT: OCS, Total Bandwidth and Correlator Coverage: "The correlator processes the IF frequencies from 4 to 16 GHz for each receiver, producing two 12 GHz wide sidebands, separated by an 8 GHz gap, for each receiver." |
| rx_wsma | Low Band LO 210-270; High Band LO 273-357 GHz | OCS, Table 1B | "LO Frequency Range 210-270 GHz 273-357 GHz"<br>ALT: WSMA, Sec. 3: "The two receiver cartridges cover the two main frequency bands requested for observations with the SMA - 194-286 GHz and 264-376 GHz." |
| wsma_status | 2 antennas fully upgraded, a third nearing deployment, a fourth in staging; up to 5 by mid-2026 | OCS, Receivers, first paragraph | "As of February 2026, two antennas are fully upgraded with wSMA systems, a third is nearing deployment, and fourth system is delivered and in staging."<br>ALT: OCS, Receivers, first paragraph: "By mid-2026, we expect to have as many as five antennas upgraded to wSMA systems."<br>Note: No later status posted; 2026-11 status NOT FOUND. |
| rx_dual | one RxA (V) + one RxB (H): 230/240, 230/400, 345/240, 345/400 (not 230/345, 240/400); wSMA: LB_V/LB_H and HB_V/HB_H pairs, same rules via legacy names | OCS, Receivers | "With these SMA legacy systems, simultaneous dual frequency operation was possible with any combination of one RxA (V pol) and one RxB (H pol) receiver."<br>ALT: OCS, Receivers: "Proposals for this semester may request dual band observations using any pair of RxA and RxB receivers."<br>ALT: OCS, Receivers (tuning limits): "Split Rx tuning (different LO frequencies) allowed only for 345Rx LO 252 -- 352 GHz AND 240Rx LO 212 -- 265 GHz" |
| corr_bw | 6 x 2 GHz windows per receiver path => 12 GHz per sideband per receiver; 140 kHz resolution GHz | OCS, Total Bandwidth and Correlator Coverage | "provides six 2-GHz contiguous windows, for each of two single polarization receiver paths, for a total processed bandwidth to 12 GHz per sideband per receiver"<br>ALT: OCS, Table 2: "12 GHz BW per sideband per receiver"<br>ALT: OCSPEC, IF/Backend: "bandwidth, single rx 12 GHz/sideband" |
| corr_total | 48 GHz (12 GHz x 2 sidebands x 2 receivers) GHz | OCCALL, Technical Information, Tools, and Resources | "Our standard spectral coverage capability is a processed bandwidth of 12 GHz per sideband per polarization, equal to 48 GHz of total processed dual reciever bandwidth, all at 140 kHz resolution."<br>ALT: WSMA, Sec. 2: "for a total of 48GHz on-sky instantaneous bandwidth"<br>ALT: SWARM, Sec. 1: "Total sky bandwidth 32 GHz 8 GHz per side band per pol"<br>Note: The 2016 SWARM design was 8 GHz per sideband per polarization (32 GHz total); the 2026 capability is 12 GHz (48 GHz). |
| corr_dual44 | 44 GHz continuous coverage (LOs offset by 12 GHz); in 2026A limited to a range near 1.1 mm GHz | OCS, Total Bandwidth and Correlator Coverage | "A unique capability available is the continuous 44 GHz spectral coverage available in the common frequency ranges of the RxA and RxB receiver pairs by offsetting their LOs by 12 GHz" |

**RF coverage (DERIVED, LO +/- 16 GHz from OCS)**: 230: 178-254; 240: 196-281; 345: 236-368; 400: 320-424; wSMA Low: 194-286 (WSMA cartridge: 194-286); wSMA High: 257-373 (WSMA cartridge: 264-376) GHz. The two sidebands of a DSB receiver are LO-16 to LO-4 and LO+4 to LO+16 GHz, with an 8 GHz gap between them. One representative frequency per receiver where a source gives one: the nominal receiver frequencies 230, 240, 345 and 400 GHz (OCSPEC: 1.3, 1.2, 0.87, 0.75 mm); the beam-calculator example uses 235 GHz USB (OCBCN).

**Bandwidth per receiver**: 12 GHz per sideband, so 24 GHz of sky per DSB receiver (DERIVED, 12 x 2), 48 GHz with two receivers (OCCALL); 6 windows of 2 GHz per sideband; 140 kHz channels. The page's `bw` (largest instantaneous bandwidth) is 24 GHz (INFERRED; 48 GHz if both receivers are counted).

## Primary beam, limits and sensitivity

| id | value | source, location | quote |
|---|---|---|---|
| pb_table | 55 (230), 51 (240), 36 (345), 31 (400) arcsec | OCSPEC, Receivers table | "primary beam (") 55 51 36 31"<br>ALT: OCSPEC, Receivers table: "frequency (GHz) wavelength (mm) 230 1.3 240 1.2 345 0.87 400 0.75"<br>ALT: HO04, Table 1: "Primary beam field of view 70"<br>Note: Rounded to the arcsecond. DERIVED k = FWHM/(lambda/D) = 1.19-1.23 (about 1.2 lambda/D; Sec. Beams). |
| pb_sideband | beam_LSB = beam_LO/(1 - 10/freq_LO); beam_USB = beam_LO/(1 + 10/freq_LO) | OCBCN, last paragraph | "The beam_LSB FWHM is simply beam_LO FWHM/(1 - 10/freq_LO)" |
| sub_el | observations above 33 deg elevation (antenna collision) deg | OCS, Array Configurations, subcompact paragraph | "To protect antennas from collision, an elevation restriction (limiting observations to above 33 degrees elevation) is in place"<br>ALT: OCBC, Notes: "For subcompact and inner ring only configurations, the array elements are physically limited to elevations"<br>ALT: OCBCN, Multi-config paragraph: "a 33 degree lower limit is imposed for SUB configuration" |
| el_assumed | 15 deg | OCBC, Notes | "Minimum elevation and hour angle limits are optional (elevation limit of 15" |
| el_mech | 6.7 to 89 deg elevation; azimuth -178 to +357 deg | HUN13, Sec. 2 (mechanical) | "The total range of motion between the hardstops is -178"<br>ALT: HUN13, Sec. 2 (mechanical): "in azimuth and 6.7" |
| el_memo131 | +/-6 h hour angle, elevation > 20 deg, shadowed data omitted | M131, Sec. 3 | "Observing was limited to 6 hours before and after transit and elevations higher than 20 degrees. Shadowed data were omitted." |
| night | generally at night; conditions rarely suitable in the afternoon | OCCALL, RA Coverage by Semester | "SMA observations are generally executed at night when the atmospheric phase noise is low and often continued into the early morning."<br>ALT: OCCALL, RA Coverage by Semester: "Many projects do not need full tracks (a full rise to set observation)" |
| spec_sens | 0.3, 1.0, 1.7 mJy (DSB, 6 hours; 230 GHz 2.0 mm H2O, 345 GHz 1.5 mm, 400 GHz 1.0 mm) mJy | OCSPEC, Array table | "sensitivity (DSB, 6 hours)" |
| spec_res | 0.4 (230), 0.3 (345), 0.25 (400) arcsec | OCSPEC, Array table | "best resolution (230 GHz) (345 GHz) (400 GHz) 0.4" 0.3" 0.25"" |
| tsys | 80-200 (230), 90-220 (240), 150-350 (345), 150-350 (400) K | OCSPEC, Receivers table | "T sys (DSB, K) 80-200 90-220 150-350 150-350" |
| trx | 6 hf/k (230/240); 9 hf/k at 265-325 GHz and 7 hf/k above 325 GHz (345/400) | OCBCN, Notes, receiver temperatures | "Double sideband receiver temperatures follow 6 hf/k for the 230/240 GHz receivers."<br>ALT: OCBCN, Notes, receiver temperatures: "recent analysis provides typical performance as 9 hf/k between 265 and 325 GHz, and 7 hf/k above 325 GHz" |
| onsrc | 66% of the track; visibilities of 1.5 min scans | OCBCN, Notes | "on-source' time is estimated to be 66% of the total available time in a track" |
| m131_gain | 140 Jy/K (70% aperture efficiency) Jy/K | M131, Sec. 3 | "antenna gains of 140 Jy/K" |
| m131_char | 0.25, 0.7, 2, 5 arcsec | M131, Sec. 3 | "The characteristic FWHM beam sizes at 345 GHz are 0.25, 0.7, 2, and 5 arcseconds in the A, B, C, and D" |
| m131_weight | natural weighting of the visibilities times 1/Tsys^2 weighting | M131, Abstract | "We use natural weighting of the visibilities" |
| m131_t3_D | dec -40: 7.96 5.78 -25 ... dec 60: 6.13 5.34 -64 arcsec | M131, Table 3 | "D array -40 7.96 5.78 -25 -20 6.00 5.32 -59 -5 6.02 4.67 -87 20 6.19 4.32 -87 40 6.13 4.58 -86 60 6.13 5.34 -64" |
| m131_t3_C | dec 20: 2.32 1.52 -89 arcsec | M131, Table 3 | "C array -40 3.06 2.02 -9 -20 2.19 1.96 -78 -5 2.25 1.68 -87 20 2.32 1.52 -89 40 2.35 1.58 -89 60 2.38 1.79 -90" |
| m131_t3_B | dec 20: 0.84 0.48 90 arcsec | M131, Table 3 | "B array -40 1.00 0.70 -5 -20 0.77 0.63 -88 -5 0.80 0.53 90 20 0.84 0.48 90 40 0.85 0.50 90 60 0.87 0.59 90" |
| m131_t3_A | dec 20: 0.29 0.22 79 arcsec | M131, Table 3 | "A array -40 0.41 0.24 2 -20 0.29 0.26 28 -5 0.28 0.24 68 20 0.29 0.22 79 40 0.30 0.22 82 60 0.31 0.24 84" |

**Primary beam (DERIVED)**: k = FWHM / (lambda/D), D = 6 m, lambda = 299.792458/nu mm:

| nu (GHz) | lambda/D (arcsec) | OCSPEC FWHM (arcsec) | k | FWHM x nu (arcsec GHz) |
|---|---|---|---|---|
| 230 | 44.81 | 55 | 1.227 | 12650 |
| 240 | 42.94 | 51 | 1.188 | 12240 |
| 345 | 29.87 | 36 | 1.205 | 12420 |
| 400 | 25.77 | 31 | 1.203 | 12400 |

The table's rounding (whole arcseconds) leaves k = 1.19-1.23; adopted 1.2 lambda/D, i.e. FWHM = 12400 arcsec GHz / nu = 207 arcmin GHz / nu (DERIVED: 12400/60), well above the 1.03 of a uniformly illuminated disk, as expected for a tapered illumination.


**Declination range (DERIVED, not a published limit)**: a source transits at elevation 90 - |lat - dec| with lat = 19.82 deg, so dec >= lat - (90 - el_min): -63.5 deg for the 6.7 deg hardstop, -55.2 for 15 deg, -50.2 for 20 deg, -37.2 for the 33 deg subcompact limit; the northern limit is the pole (the hardstop at 89 deg does not stop circumpolar sources below it). Memo 131 simulated dec -40 to +60.

**Single-dish gain and SEFD (DERIVED, notes only)**: Jy/K = 2k/(eta A) = 2 x 1.380649e-23 /(eta x 28.27 m^2) x 1e26 = 122 (eta 0.80) to 140 (eta 0.70) Jy/K, consistent with Memo 131's 140 Jy/K at 70%; with the OCSPEC DSB Tsys of 80-200 K at 230 GHz, a single-antenna DSB SEFD is about 10-28 kJy. The page weights identical dishes equally and does not need it.

## Beams and largest scales: validation targets

**Published (current configurations, 345 GHz)**: SUB 5 arcsec (six inner-ring antennas only), COM 2.5, EXT 0.7-0.8, VEX ~0.25 (OCS, "characteristic resolution"; the sources do not say how it was computed; the COM and EXT values are close to lambda/Bmax of the published maximum baselines; VEX is not). Quick-spec best resolutions: 0.4 (230 GHz), 0.3 (345 GHz), 0.25 (400 GHz) arcsec (OCSPEC; the 0.25 at 400 GHz is the VEX).

**Published (1998 configurations, Memo 131 Table 3, 345 GHz)**: natural weighting combined with 1/Tsys^2 weighting, +/-6 h of hour angle, elevation > 20 deg, shadowed data omitted, FWHM major x minor (arcsec) and PA (deg): dec -40, -20, -5, 20, 40, 60. These configurations A-D used the pad sets in Memo 131 Table 2 (not the current ones). Characteristic beams 0.25, 0.7, 2, 5 arcsec (A, B, C, D).

| config (1998) | dec 20 published | dec 60 published |
|---|---|---|
| D | 6.19 x 4.32 | 6.13 x 5.34 |
| C | 2.32 x 1.52 | 2.38 x 1.79 |
| B | 0.84 x 0.48 | 0.87 x 0.59 |
| A (six antennas) | 0.29 x 0.22 | 0.31 x 0.24 |

**Method check (DERIVED)**: this record's simulation (uv tracks from the pad positions at latitude 19.82 deg, 2 min samples, +/-6 h, elevation >= 20 deg, shadowed baselines dropped, natural weighting without the Tsys weight, central lobe taken as the filled ellipse of the contiguous >= 50% region of the dirty beam) applied to the memo's own pads at dec 20, 345 GHz:

| config | simulated major x minor | geometric mean | published geometric mean | ratio |
|---|---|---|---|---|
| D | 5.68 x 4.59 | 5.10 | 5.17 | 0.987 |
| C | 2.10 x 1.70 | 1.89 | 1.88 | 1.008 |
| B | 0.86 x 0.53 | 0.68 | 0.63 | 1.064 |

The geometric-mean beam agrees within 1-6%; the major/minor split does not (the crude central-lobe estimate and the missing Tsys weight), so use the geometric mean only.

**Current configurations, DERIVED with the same method (345 GHz, dec +20; SUB uses elevation >= 33 deg)**:

| config | simulated major x minor (arcsec) | geometric mean | lambda/Bmax (arcsec) | OCS characteristic |
|---|---|---|---|---|
| SUB (8 pads) | 2.80 x 2.40 | 2.59 | 2.59 | 5 (inner six only) |
| INR (pads 1-6), el>=33 | 5.59 x 3.66 | 4.52 |  | 5 |
| INR (pads 1-6), el>=20 | 6.91 x 3.99 | 5.25 |  | 5 |
| COM | 2.02 x 2.02 | 2.02 | 2.33 | 2.5 |
| EXT | 0.99 x 0.67 | 0.81 | 0.79 | 0.7-0.8 |
| VEX | 0.35 x 0.29 | 0.32 | 0.35 | ~0.25 |

The inner six antennas give a 4.5-5.3 arcsec geometric-mean beam, matching the published 5 arcsec; COM and EXT agree with the published values to 20%, VEX is 0.32 arcsec against "~0.25" (the quoted figure is closer to the quick-spec best resolution than to a natural-weighted beam). Treat the published numbers as targets with a tolerance of about 25%.

**Largest angular scale (NOT FOUND in the SMA documents; DERIVED here)**. The ALMA record's relation theta_MRS ~ 0.983 lambda / L5 (L5 = 5th percentile of the uv distance; INFERRED to apply, since no SMA source states a relation; the alternative 0.6 lambda/Bmin is the ALMA Primer's definition) at 345 GHz, dec +20:

| config | L5 (m) | 0.983 lambda/L5 (arcsec) | lambda/Bmin (arcsec) | 0.6 lambda/Bmin (arcsec) |
|---|---|---|---|---|
| SUB (8 pads) | 9.2 | 19.1 | 18.9 | 11.3 |
| INR (pads 1-6) | 8.3 | 21.1 | 18.9 | 11.3 |
| COM | 16.4 | 10.8 | 10.9 | 6.5 |
| EXT | 41.9 | 4.2 | 4.1 | 2.4 |
| VEX | 87.5 | 2.0 | 2.6 | 1.6 |

The primary beam at 345 GHz is 36 arcsec (OCSPEC), so even the subcompact's recoverable scale (about 11-21 arcsec) is below the field of view.

## Context for the notes

| id | value | source, location | quote |
|---|---|---|---|
| operators | SAO and ASIAA (Taiwan) | WSMA, Abstract | "operating at millimeter and submillimeter wavelengths on Maunakea, Hawaii, operated by the Smithsonian Astrophysical Observatory and Academia Sinica Institute of Astronomy and Astrophysics"<br>ALT: HO04, Sec. 1: "In 1996, the Academia Sinica Institute of Astronomy and Astrophysics joined the SMA project" |
| fringes | September 1999 | HO04, Sec. 2.1 | "obtained first fringes on Mauna Kea in September 1999" |
| dedication | 2003 November 22 (all eight elements deployed by end of 2003) | HO04, Sec. 1 | "formally dedicated on November 22, 2003" |
| commissioned | 2003; 20+ years of operation | WSMA, Sec. 1 | "First commissioned in 2003" |
| esma_fringes | 2007 August 30; longest baseline 782 m (with CSO) vs 509 m (SMA alone) | ESMA, Abstract; Sec. 1 | "first fringes at 345 GHz were obtained on August 30 2007"<br>ALT: ESMA, Sec. 1: "the longest baseline extends to 782 m, compared to 509 m"<br>ALT: ESMA, Sec. 1: "The JCMT-SMA Memorandum of Understanding was signed in 2001" |
| cso | operated 1987-2015; physically removed, site restored (2024-07-02 news) | CSO, first paragraphs | "CSO, which operated from 1987 to 2015"<br>ALT: CSO, first paragraph: "and the land at the site has been restored" |
| ehtphase | phased array of 6 x 6 m antennas (median, 2017); 14.7 m equivalent | P2, Table 3 note c | "The median number of phased antennas in 2017 for the SMA was 6"<br>ALT: P2, App. A.9: "The SMA is an eight-element radio interferometer located"<br>ALT: SWARM, Abstract: "phased array" |
| ehtim_row | -5464523.400, -2493147.080, 2150611.750 m | EHTIM, row SMA | "SMA -5464523.400 -2493147.080 2150611.750" |
| wsma_range | 180 to 418 GHz (wSMA to extend) GHz | WSMA, Sec. 2 | "Operating at frequencies from 180 GHz to 418 GHz" |
| status_loss | compact only through September; observing time may drop by up to 1/3 (wSMA, infrastructure, Large Scale programs) | OCS, New/Highlighted Capabilities | "Potential decrease in available observing time by up to 1/3."<br>ALT: OCS, New/Highlighted Capabilities: "In 2026A, the SMA will be in compact (COM) configuration through September." |
| min_ants | 7 antennas (full-pol), 14 receivers (dual); 6/5 antennas partially charged | OCS, "Time Charged" Allocation Rules | "Dual-polarization tracks: 14 working receivers (7 tuned to the RxA tuning, 7 tuned to the RxB tuning)" |

**History**: an SAO project begun as six 6 m antennas; ASIAA joined in 1996 and added two (HO04); first fringes on Mauna Kea in September 1999; all eight elements by the end of 2003; dedicated 2003 November 22. The site lies in "Millimeter Valley" next to the CSO and JCMT (HO04), so the SMA, JCMT and CSO formed the eSMA (first 345 GHz fringes 2007 August 30, ESMA); the CSO closed in 2015 and was removed by mid-2024 (CSO), so the eSMA is no longer possible with the CSO. **2026 status**: the compact configuration all of 2026A; wSMA receivers on two antennas (February 2026) with five expected by mid-2026; observing time possibly down by a third; VEX out of service; SWARM supplies 12 GHz per sideband per receiver (SWARM 2016 design: 8 GHz). **EHT**: the SMA is one EHT station, phased (6 x 6 m median in 2017, 14.7 m equivalent); the page should use one 6 m dish's beam for it, as the eht2017 record does.

## Conflicts

- Pad 7 north: Memo 131 Table 1 prints 884.61 ft (an evident typo; 884.61 ft would put pad 7 about 277 m north of the inner ring); CFG gives -15.73 m (= -24.39 ft in the memo frame, the value the memo prints for pad 8).
- Pad 8 north: Memo 131 gives -24.39 ft (N = -15.73 m relative to pad 1); CFG gives -22.06 m, 6.33 m south of the memo value. CFG pad 7 north equals the memo-derived pad 8 north, so one of the two documents probably has a transcription slip between rows 7 and 8; which is right could not be settled from the saved documents. The pad 8 position changes the SUB and COM baselines to pad 8 by up to 6 m.
- COM maximum baseline: OCS "approximately 70 meters" and OCCALL 70 m vs 76.98 m (pads 12-23) from CFG.
- EXT maximum baseline: OCS/OCCALL 220 m vs 226.01 m (pads 15-17) from CFG.
- SUB maximum baseline: OCCALL/WSMA 30 m (the six inner-ring antennas only); the full 8-pad subcompact (pads 1-6, 8, 23) reaches 69.08 m.
- Shortest baseline: OCSPEC 8 m agrees with the shortest of all 24 pads, 7.96 m (pads 4-22, DERIVED; pad 22 is in no current configuration); the shortest in the SUB set is 9.48 m (pads 1-2), matching HO04 Table 1 (9 m) and OCS (9.5 m).
- VEX maximum baseline: 508.91 m (CFG, pads 1-19) vs OCCALL 508 m, OCSPEC 509 m, HO04 "500 m": agree.
- Resolution: OCS "characteristic resolution" 0.25 arcsec for VEX at 345 GHz vs lambda/Bmax = 0.35 arcsec (DERIVED) and a simulated natural-weighted beam of 0.32 arcsec; OCS 2.5 arcsec for COM vs 2.33 (lambda/Bmax) and 2.0 (simulated).
- Subcompact elevation: 33 deg (OCS, OCBC, OCBCN) vs 31.3 deg in the older single-configuration beam calculator (read, not cited; superseded).
- Receiver names do not give the coverage: OCS "for historical reasons, the receiver names do not correctly reflect the actual coverages" (the 230 receiver tunes LO 194-238 GHz, the 240 receiver 212-265 GHz).
- wSMA Low Band: OCS Table 1B LO 210-270 GHz +/-16 GHz = RF 194-286 GHz, equal to WSMA cartridge range 194-286 GHz; High Band LO 273-357 GHz gives RF 257-373 GHz vs WSMA cartridge 264-376 GHz (a few GHz at the edges).
- SMA positions in the EHT files: P2 Table 2 phasing center vs the older ehtim EHT2017.txt row differ by 288.8 m (DERIVED); the pad field spans 0.5 km, so neither point can be placed on the pad map.

## NOT FOUND

- Absolute geodetic position of pad 1 (or of any pad): CASA has no SMA row in its Observatories table; Memo 131 gives a ground reference without absolute coordinates. The only sourced absolute point is the EHT 2017 phasing center (P2 Table 2), whose relation to the pad field is not stated.
- Central blockage or subreflector diameter of the 6 m antennas.
- A published largest angular scale / maximum recoverable scale for the SMA configurations: the values here are DERIVED (0.983 lambda/L5, INFERRED relation from the ALMA record; 0.6 lambda/Bmin as the alternative).
- A published declination range of the SMA (DERIVED from latitude and elevation limits only).
- A typical track length in hours (the OSPEC sensitivity is for 6 hours; Memo 131 simulates +/-6 h; SAO calls speak of rise-to-set tracks).
- Configuration schedule for 2026B/2027A (the OC pages saved 2026-11-18 end at 2026A, last updated 2026-02-04/05).
- Per-configuration synthesized beams and largest scales for the CURRENT configurations in a published table (the OC beam calculator computes them on request; Memo 131 Table 3 is for the 1998 configurations A-D, which use different pads).
- Per-antenna SEFD or a quoted SEFD per receiver (Tsys is given as DSB ranges; the EHT phased SEFD is in the eht2017 record).
- Shadowing guidance for the compact configurations beyond the 33 deg SUB limit.
- The wSMA status after February 2026.

## References (ADS bibcodes, looked up through the ADS API and title-checked; response saved as `ads_bibcodes.json`)

| bibcode | reference | title (as returned by ADS) |
|---|---|---|
| 1997ApJ...475..843K | Keto 1997, ApJ 475, 843 | The Shapes of Cross-Correlation Interferometers |
| 2004ApJ...616L...1H | Ho, Moran & Lo 2004, ApJ 616, L1 | The Submillimeter Array |
| 2013JAI.....250002H | Hunter et al. 2013, JAI 2, 1350002 | The Digital Motion Control System for the Submillimeter Array Antennas |
| 2024SPIE13096E..39G | Grimes et al. 2024, SPIE 13096, 1309639 | Upgrading the submillimeter array: wSMA and beyond |
| 2008SPIE.7012E..0DB | Bottinelli et al. 2008, SPIE 7012, 70120D | The eSMA: description and first results |
| 2016JAI.....541006P | Primiani et al. 2016, JAI 5, 1641006 | SWARM: A 32 GHz Correlator and VLBI Beamformer for the Submillimeter Array |
| 2019ApJ...875L...2E | EHT Collaboration 2019, ApJL 875, L2 | First M87 Event Horizon Telescope Results. II. Array and Instrumentation |

No bibcode: SMA Technical Memo 131 (Wilner 1998; M131), SMA Observer Center pages, the casa-data files, the Caltech news item. Ho, Moran & Lo is listed under its first author in ADS (the arXiv paper is by Ho, Moran and Lo).

## Notes

- Pad coordinates: x east, y north, z up in m relative to pad 1 (CFG). 20 of 24 pads are in CFG; pads 10, 13, 22, 24 (used by no current configuration) come from Memo 131 Table 1 converted from ft (DERIVED, x 0.3048, relative to pad 1).
- CFG equals Memo 131 Table 1 converted to metres and rounded to 0.01 m for 18 pads (maximum difference 0.033 m, pad 12 north); it is therefore not an independent measurement. Pads 7 and 8 differ (Conflicts).
- The beams in beams_345GHz_simulated are this record's own natural-weighted simulation (2 min samples, +/-6 h, elevation >= 20 deg, >= 33 deg for SUB and the inner ring, shadowed baselines (projected separation < 6 m) dropped; central lobe = filled ellipse of the contiguous >= 50% region) and reproduce Memo 131 Table 3 for the 1998 configurations within 1-6% in geometric-mean FWHM.
- Keto design test (DERIVED): the width of the pad set projected on a direction (max minus min) is constant for a curve of constant width. For the built rings the width varies by 18% (COM), 25% (SUB), 27% (VEX) and 32% (EXT) peak to peak relative to the mean; eight points spread evenly on a perfect Reuleaux triangle vary by 10-14%. The built pads follow the Reuleaux plan only loosely (topography, the two ASIAA antennas added ad hoc); the six inner-ring pads vary by 6%.
- Scripts: `/private/tmp/claude-501/-Users-cconroy-memos/1afe1b95-89f0-42d0-86cc-df49c96c34df/scratchpad/sma/work/` (`qcheck.py` quote checker, `analysis.py` baselines, fits, beams and widths, `beam.py`, `build.py`, `recs.py`).
