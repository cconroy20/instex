# Interferometer: ALMA 12-m Array -- Cycle 13 configurations C-1 ... C-10 (antenna positions, site, bands, imaging relations)

Compiled 2026-10-20 for the instex INTERFEROMETER mode, in the record format of `data/telescopes/vlt.md`. Every number comes from a document saved unmodified under `rawdata/interf/alma/`; each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **BINARY READ-OFF** marks values decoded from the CASA Observatories casacore table (not text). 246 quote records (181 distinct quotes) machine-checked against the saved files' extracted text (pdftotext -layout and -raw for PDFs, split by page; tag-stripped text and raw source for HTML; the cfg, JSON and .py files as is; the casacore table by decoding its ISM index): all pass (2026-10-20). Normalisation: Unicode NFKC; curly quotes, primes, dashes, minus, multiplication sign (to x), tilde operator, division slash, the ring/bullet degree signs and soft hyphens normalised; whitespace collapsed; a quote also passes with PDF line-end hyphenation closed up or with all whitespace removed (table rows); ' ... ' joins non-adjacent pieces on one page. Machine-readable twin: `data/interf/alma.json`.

## Completeness summary

**Cycle**: ALMA Cycle 13 runs 1 October 2026 - 30 September 2027 (PG), so it is the current cycle on 2026-10-20; the configuration in use this week is C-3 (SCHED block 4, 2026-10-19 to 10-26). Cycle 13 files are the newest in CASA (commit 2026-02-18; no cycle 14 files), and they are byte-identical to the Cycle 11 and Cycle 12 files and to the Science Portal zip (PG Sec. 1.3: configurations unchanged).

**Antenna positions**: all ten configurations, 43 antennas each (the notional C43-X sets; pad names only), from CASA `alma.cycle13.N.cfg` (coordsys=LOC, local tangent plane, metres, x y z diam pad; diam = 12 m; no COFA line, so the origin is the CASA observatory "ALMA" position, lat -23.022886, lon -67.754929, h 5056.8 m WGS84, read from the CASA Observatories table). Converted (DERIVED, rigid rotation + translation) to local ENU at the TH array location lat -23.02917, lon -67.754649 (the origin sits at (+28.7, -696.5, -0.04) m in the cfg frame). Derived maximum baselines agree with TH Table 7.3 to 2.6 m (0.016%) and with the PG Lmax to rounding; minimum baselines differ by up to 12.1 m because Table 7.3 is projected (a +/- 1 h track at Dec -23 deg reproduces all Table 7.3 entries within 1.4%, L05/L80/max within 0.47%). The 50-antenna operational pad lists are NOT FOUND.

**Imaging relations**: theta_res ~ 0.574 lambda/L80, theta_MRS ~ 0.983 lambda/L5 (TH Eqs. 7.4, 7.6; Briggs robust 0.5; source at Dec -23 deg); Cycle 13 tables give theta_max / theta_min per configuration at one frequency per band (40-870 GHz) and theta_MRS per configuration; primary beam FWHM = 1.13 lambda/D (58" at 100 GHz). **Bands**: 1-10 (35-950 GHz; Band 2 67-116 GHz new on the 12-m Array), 7.5 GHz per polarization (4 x 1.875 GHz), 15 GHz in Bands 9-10 with 90-deg Walsh switching; WSU not part of Cycle 13. **Elevation**: hardware 2-125 deg only from the 2001 project book; operationally sources must transit above 20 deg (Dec <= +47 deg); a per-scan elevation cut-off is NOT FOUND.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| CFG | CASA data repository (casa-data, NRAO open Bitbucket), directory alma/simmos: alma.cycle13.1.cfg ... alma.cycle13.10.cfg, the CASA simulator antenna-position files for the ALMA Cycle 13 12-m configurations C-1 ... C-10 (43 antennas each; added in commit 6d3899caf00, 2026-02-18, "CAS-14730 add cycle 13 configuration files"); fetched 2026-10-20 | `rawdata/interf/alma/alma.cycle13.{1..10}.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/alma.cycle13.N.cfg (N = 1..10) |
| CFGZIP | ALMA Science Portal, Cycle 13 documents, "alma-configuration-files": ALMA_cycle13_configuration_files.zip (17.1 KB; the same ten alma.cycle13.N.cfg, byte-identical to CFG; zip entries dated 2024-03-05) and its item page; fetched 2026-10-20 | `rawdata/interf/alma/ALMA_cycle13_configuration_files.zip` | https://almascience.nrao.edu/documents-and-tools/cycle13/alma-configuration-files/@@download/file/ALMA_cycle13_configuration_files.zip |
| CFGPREV | casa-data alma/simmos: alma.cycle11.N.cfg and alma.cycle12.N.cfg (N = 1..10), downloaded only to compare with Cycle 13 (all 20 byte-identical to the Cycle 13 file with the same N); fetched 2026-10-20 | `rawdata/interf/alma/casadata_prev_cycles/` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/alma.cycle{11,12}.N.cfg |
| GITC | casa-data REST API commit history of alma/simmos/alma.cycle13.1.cfg (JSON; one commit, 6d3899caf00762c71c54a9d8085450648b7128c6, authorTimestamp 1771437164000 ms = 2026-02-18 17:52:44 UTC; the same single commit is the history of every alma.cycle13.N.cfg); fetched 2026-10-20 | `rawdata/interf/alma/casadata_commits_alma.cycle13.1.cfg.json` | https://open-bitbucket.nrao.edu/rest/api/1.0/projects/CASA/repos/casa-data/commits?path=alma/simmos/alma.cycle13.1.cfg&limit=5 |
| GITF | casa-data REST API file listing of alma/simmos (JSON, 253 files, isLastPage true): ALMA 12-m cycle files run to alma.cycle13.N.cfg; no cycle14 files; fetched 2026-10-20 | `rawdata/interf/alma/casadata_files_alma_simmos.json` | https://open-bitbucket.nrao.edu/rest/api/1.0/projects/CASA/repos/casa-data/files/alma/simmos?limit=1000 |
| OBS | CASA casa-data geodetic/Observatories casacore table (binary: table.dat descriptor, table.f0 IncrementalStMan data; latest commit on table.f0 625e774c108, 2025-12-11): row "ALMA" (row 0), the observatory position CASA uses for "observatory=ALMA". BINARY READ-OFF: values decoded from the ISM bucket index (row 0 offsets), little-endian doubles; fetched 2026-10-20 (git-LFS objects) | `rawdata/interf/alma/casadata_geodetic_Observatories/` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/geodetic/Observatories/table.f0 (and table.dat, table.f1, table.info) |
| SIMU | CASA casa6 source, casatasks/src/private/simutil.py (commit 1efb2921add, 2026-06-01): readantenna() (cfg header keys observatory/COFA/coordsys; LOC needs a known observatory or COFA), locxyz2itrf() (local tangent plane to ECEF, WGS84 a, b), baselineLengths(). Read only, never executed or imported | `rawdata/interf/alma/casa_code/casa6_casatasks_private_simutil.py` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa6/raw/casatasks/src/private/simutil.py |
| PG | ALMA Cycle 13 Proposer's Guide, ALMA Doc. 13.2, ver. 1.0, 19 March 2026 (G. C. Privon, L. Cerrigone, A. Corvillon, A. Kawamura, G. Popping, D. Rebolledo; doi 10.5281/zenodo.18793859): Cycle 13 CfP and Table 1 (timeline), Sec. 4.3.3 + Table 3 (configuration schedule), App. A.1 (number of antennas), A.2 (configurations), Table A-1 (angular resolution), Table A-2 (MRS), Table A-4 (receiver bands), A.5.3 (Bands 9-10), A.6.1 + Table A-5 (basebands, correlator), A.8 (source restrictions, shadowing, declination limit) | `rawdata/interf/alma/ALMA_Cycle13_Proposers_Guide.pdf` | https://almascience.org/documents-and-tools/cycle13/alma-proposers-guide |
| TH | ALMA Cycle 13 Technical Handbook, Doc 13.3, version 1.0, 1 March 2026 (ed. P. C. Cortes; Ch. 7 by R. Loomis): Sec. 2.1-2.2 (site, 12-m Array), Ch. 3 (primary beam), Table 4.1 + Secs. 4.4-4.5 (receivers, IF bandwidth), Sec. 5.2 (WSU mention), Sec. 7.2 (configurations, notional C43-X), Table 7.1 (angular resolution), Table 7.2 (MRS), Table 7.3 (baseline statistics of the notional configurations), Sec. 7.3 (shadowing, latitude), Sec. 7.4 (Eqs. 7.3-7.4, Briggs robust 0.5), Table 7.5 (peak sidelobes), Sec. 7.6 (Eq. 7.6), Sec. 7.7 (primary beam FWHM), Sec. 10.3.1 (Eq. 10.5), App. A.1 (antennas) | `rawdata/interf/alma/ALMA_Cycle13_Technical_Handbook.pdf` | https://almascience.org/documents-and-tools/cycle13/alma-technical-handbook |
| PRIM | Observing with ALMA - A Primer (Cycle 13), Doc 13.1, ver. 1, 25/27 Feb 2026 (G. Schieven): Level One Science Aims, "ALMA Full Operations Specifications" table, MRS rule of thumb | `rawdata/interf/alma/ALMA_Cycle13_Primer_Doc13.1.pdf` | https://almascience.nrao.edu/documents-and-tools/cycle13/alma-science-primer/@@download/file/ALMA-C13Primer-v1.pdf |
| DOCS | ALMA Science Portal, "Cycle 13" documents-and-tools listing page (links to the Proposer's Guide, Technical Handbook, configuration files, Primer); fetched 2026-10-20 | `rawdata/interf/alma/almascience_cycle13_documents.html` | https://almascience.org/documents-and-tools/cycle13 |
| SCHED | ALMA Science Portal, "Configuration Schedule" page (Cycle 13 by block + complete tentative Cycle 13 schedule); fetched 2026-10-20 | `rawdata/interf/alma/almascience_observing_configuration_schedule.html` | https://almascience.nrao.edu/observing/observing-configuration-schedule |
| WSU | ALMA Science Portal, "ALMA2030 WSU (Overview)" page on the Wideband Sensitivity Upgrade; fetched 2026-10-20 | `rawdata/interf/alma/almascience_alma2030_wsu.html` | https://almascience.nrao.edu/about-alma/alma2030-wsu |
| C14 | ALMA Science Portal URL documents-and-tools/cycle14 (pattern of the Cycle 13 page): HTTP 404, body {"error_type": "NotFound"}; fetched 2026-10-20 | `rawdata/interf/alma/almascience_cycle14_documents_HTTP404.json` | https://almascience.org/documents-and-tools/cycle14 |
| PB4 | ALMA Project Book, Chapter 4, "Antennas", T. Andersen and P. Napier (last changed 2001-Feb-06; Acrobat web capture): Sec. 4.2.4 Range of Motion. Design-era (pre-construction) specification, not a production-antenna or Cycle 13 document | `rawdata/interf/alma/ALMA_ProjectBook_Ch4_Antennas_Andersen_Napier.pdf` | https://www.cv.nrao.edu/~demerson/almapbk/construc/chap4/chap4.pdf |

Also saved, not cited (searched; nothing usable): `rawdata/interf/alma/not_cited/Mangum2006_PASP118_1257_ALMA_prototype_antennas_astro-ph0609329v1.pdf` (Mangum et al. 2006, PASP 118, 1257 (arXiv astro-ph/0609329v1): searched for an elevation range; none stated); `rawdata/interf/alma/not_cited/Beasley2006_ALMA_overview_astro-ph0606376v1.pdf` (Beasley, Murowinski, Tarenghi 2006 (arXiv astro-ph/0606376v1): no antenna range of motion); `rawdata/interf/alma/not_cited/WoottenThompson2009_ProcIEEE_ALMA_arXiv0904.3739v1.pdf` (Wootten & Thompson 2009, Proc. IEEE (arXiv 0904.3739v1): no antenna range of motion); `rawdata/interf/alma/not_cited/ATNF_RadioSchool2001_alma.pdf` (ATNF Radio School 2001 ALMA slides: no range of motion); `rawdata/interf/alma/not_cited/ALMA_webOT_Reference_Manual_Cycle13.pdf` (Cycle 13 web-OT Reference Manual: no elevation limit value); `rawdata/interf/alma/not_cited/ALMA_webOT_UserManual_Cycle13.pdf` (Cycle 13 web-OT User Manual: no elevation limit value); `rawdata/interf/alma/not_cited/help_almascience_kb_index.html` (ALMA Helpdesk knowledgebase index (article 402 URL redirected to the index)); `rawdata/interf/alma/not_cited/almascience_news.html` (Science Portal news page (served an old news list; nothing on Cycle 14)); `rawdata/interf/alma/not_cited/almascience_cycle13_*.view.html` (Science Portal item pages used to locate the OT manuals and the Primer).

## Cycle

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| cycle | Cycle 13: observations October 2026 - September 2027 (current on 2026-10-20; started 1 October 2026) |  | PG, Cycle 13 Call for Proposals [PDF p. 6] | "is pleased to announce the ALMA Cycle 13 Call for Proposals (CfP) for scientific observations to be scheduled from October 2026 to September 2027"<br>ALT: start 1 October 2026 (anticipated); end 30 September 2027 (PG, Table 1 (Cycle 13 timeline) [PDF p. 7]: "01 October 2026 Start of ALMA Cycle 13 Science Observations (anticipated) 30 September 2027 End of ALMA Cycle 13")<br>ALT: C-3 in use in the week of 2026-10-20 (block 4, 2026-10-19 to 2026-10-26, 15-500 m) (SCHED, Cycle 13 - by Block, block 4: "2026-10-19 2026-10-26 PI ( Observing Report ) C-3 15-500")<br>ALT: Cycle 13 configuration files are the latest in casa-data (added 2026-02-18; no cycle 14 files) (GITC, values[0].message: "CAS-14730 add cycle 13 configuration files")<br>ALT: file listing ends at cycle 13 (GITF, values[]: ""alma.cycle13.1.cfg","alma.cycle13.10.cfg","alma.cycle13.2.cfg"")<br>ALT: no Cycle 14 documents page (HTTP 404) (C14, response body: "{"error_type": "NotFound"}")<br>Note: Today (2026-10-20) falls inside Cycle 13, so Cycle 13 is the current cycle; No Cycle 14 documents page (C14: HTTP 404) or configuration files (GITF: no cycle14 file) exist. The Cycle 13 configuration files are byte-identical to the Cycle 11 and Cycle 12 files (CFGPREV), consistent with PG Sec. 1.3. |
| config_unchanged | configurations, angular resolutions and MRSs unchanged from previous cycles |  | PG, Sec. 1.3 (Angular Resolution and Maximum Recoverable Scale Tables) [PDF p. 7] | "The configurations, ARs, and MRSs have not changed from what was achieved in previous cycles."<br>DERIVED: sha256 comparison: alma.cycle13.N.cfg == alma.cycle12.N.cfg == alma.cycle11.N.cfg (byte-identical) for N = 1..10, and == the Science Portal zip entry (CFGZIP). Checked: True |

## Site and coordinate frame

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| site_latlon | lat -23.02917 deg, lon -67.754649 deg (array location, Chajnantor) | deg | TH, Sec. 2.1 (The ALMA Telescope) [PDF p. 11] | "The array is located on the Chajnantor plain of the Chilean Andes (lat.=–23.02917◦ , long.=–67.754649◦ )"<br>ALT: latitude -23.02917 deg (shadowing section) (TH, Sec. 7.3 (Shadowing) [PDF p. 97]: "Given ALMA’s location (latitude=−23.02917◦ )")<br>ALT: -23.029 deg, -67.755 deg, 5000 m (PG, Sec. 2.2 (The ALMA telescope) [PDF p. 8]: "The Array is located on the Chajnantor plateau of the Chilean Andes at latitude = −23.029◦ , longitude = −67.755◦ and an altitude of 5000 m.")<br>Note: Used here as the ARRAY CENTRE (origin of e, n, u). It lies 696.5 m south and 28.7 m east of the CASA LOC origin (DERIVED below), inside the compact core: the C-1 centroid is 66 m from it. |
| site_elevation | 5000 | m (nominal altitude of the Array Operations Site) | TH, Sec. 2.1 [PDF p. 11] | "are all located at the 5000-meter altitude site referred to as the Array Operations Site (AOS)"<br>ALT: 5000 m (PG, Sec. 2.2 [PDF p. 8]: "and an altitude of 5000 m.")<br>ALT: about 5000 m (PRIM, Introduction [PDF p. 5]: "Located on the Chajnantor plain of the Chilean Andes at an elevation of about 5000 m")<br>ALT: 5056.8 m WGS84 height of the CASA "ALMA" observatory position (OBS, Observatories table, row 0 (Name ALMA, Type WGS84), column Height (UNIT m) [BINARY READ-OFF]: "ALMA ... WGS84 ... MMA Memo 261, Radford ... Height 5056.8")<br>Note: The 5000 m is a rounded site altitude; the CASA reference height is 5056.8 m (ellipsoidal, WGS84). Compact-configuration pads sit 1.3-7.8 m below that reference (cfg z values). |
| casa_loc_origin | lon -67.754929 deg, lat -23.022886 deg, height 5056.8 m (WGS84): CASA observatory "ALMA" = origin of the cfg LOC frame | deg, deg, m | OBS, Observatories table (casacore), row 0: Name, Type, Long, Lat, Height, Source [BINARY READ-OFF via the ISM index; byte offsets 516 (MJD), 524 (Long), 532 (Lat), 540 (Height), 572 (Name)] | "ALMA ... WGS84 ... MMA Memo 261, Radford ... Long -67.754929 Lat -23.022886 Height 5056.8"<br>ALT: columns and units: Long, Lat in deg, Height in m (OBS, table.dat column descriptors [BINARY READ-OFF]: "List of Observatory positions ... Long ... UNIT ... deg ... Lat ... Height")<br>ALT: LOC needs a known observatory (or COFA); a known name gives posobs = me.observatory(name) (SIMU, readantenna(): "posobs=me.measure(me.observatory(t),'WGS84')")<br>ALT: error text when neither is available (SIMU, readantenna(): "To use local coordinates in the antenna position file, you must either use a known observatory name, or provide the COFA explicitly")<br>ALT: docstring example COFA (rounded) (SIMU, readantenna() docstring: "# COFA=-67.75,-23.02")<br>Note: The cfg files have "observatory=ALMA" and no COFA line (CFG header), so CASA reads them relative to this table row. The decoded row also has MJD 51420.9486, Comment "+/- 5mas", and X, Y, Z = 1761.87, -4307.63, -1977.71 m (meaning not documented; not used). |
| cfg_format | LOC = local tangent plane; columns x y z diam pad (metres; no antenna names, pad names only); observatory=ALMA; no COFA |  | CFG, alma.cycle13.1.cfg ... alma.cycle13.10.cfg, header lines 1-3 (identical in all ten) | "# observatory=ALMA # coordsys=LOC (local tangent plane) # x y z diam pad#"<br>ALT: first data row of C-1 (CFG, alma.cycle13.1.cfg line 4: "-33.89412596 -712.7516484 -2.330089496 12. A001")<br>ALT: the same ten files on the Science Portal (zip, byte-identical) (CFGZIP, item page "alma-configuration-files": "ALMA_cycle13_configuration_files.zip")<br>ALT: listed among the Cycle 13 documents (DOCS, Cycle 13 document list: "alma-proposers-guide ... alma-technical-handbook ... alma-configuration-files")<br>ALT: LOC = x offset, y offset, height (SIMU, readantenna() docstring: "coordsys can be XYZ=earth-centered, UTM=easting,northing,altitude, or LOC=xoffset,yoffset,height") |
| loc_definition | x = East, y = North, z = Up (normal to the WGS84 ellipsoid) relative to the observatory reference point; metres |  | SIMU, locxyz2itrf() docstring | "The "local" (x, y, z) are measured relative to the closest point to (lat, longitude) on the WGS84 reference ellipsoid, with z normal to the ellipsoid and y pointing north."<br>ALT: x enters along the local east vector (-sin lon, cos lon, 0) (SIMU, locxyz2itrf(): "x = Nploczcphimlocysphi * clmb - locx * slmb")<br>ALT: WGS84 a (SIMU, locxyz2itrf(): "a = 6378137.0      # WGS84 equatorial semimajor axis")<br>ALT: WGS84 b (SIMU, locxyz2itrf(): "b = 6356752.3142   # WGS84 polar semimajor axis")<br>DERIVED: Re-implemented here (not executed from the download): ECEF = locxyz2itrf(lat0, lon0, h0, x, y, z) is exactly ECEF_ref(lat0, lon0, h0) + R^T [x, y, z] with the standard ENU rotation (round-trip check ENU->ECEF->ENU at the reference: max error 3.6e-10 m). |
| enu_conversion | e, n, u (metres) = local ENU at the TH array centre (lat -23.02917, lon -67.754649, ellipsoidal height 5056.8 m) | m | TH, Sec. 2.1 [PDF p. 11] | "The array is located on the Chajnantor plain of the Chilean Andes (lat.=–23.02917◦ , long.=–67.754649◦ )"<br>DERIVED: Each cfg (x, y, z) -> ECEF with the CASA locxyz2itrf formula at the OBS reference (lat -23.022886, lon -67.754929, h 5056.8 m, WGS84 a, b from SIMU) -> ENU at the array centre (WGS84; h = 5056.8 m chosen so u keeps the cfg height datum). The array centre sits at (x, y, z) = (28.723, -696.472, -0.038) m in the cfg LOC frame. The conversion is a rigid rotation + translation (3-D baseline lengths change by < 2e-9 m); it differs from the plain translation e = x - 28.723, n = y + 696.472, u = z + 0.038 by at most 0.912 m (C-10 outer pads; the two tangent planes are 0.0063 deg apart). u is relative to the ellipsoidal height 5056.8 m (the CASA reference height), not to the 5000 m nominal altitude.<br>INFERRED: Taking the TH lat/lon as the "array centre" is a choice: TH calls it the location of the array; no document calls it the centre of a configuration. |

## Array and antennas

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| n_antennas | 43 antennas in each cfg (notional C43-X); configurations are 50-antenna; at least 43 offered | antennas | TH, Sec. 7.2 (Configurations) [PDF p. 96] | "For simulation and project planning purposes, configurations referred to as “notional configurations” of 43 12-m antennas (C43-X) are available on the Science Portal and in CASA."<br>ALT: at least 43 offered (PG, App. A.1 (Number of antennas) [PDF p. 38]: "At least forty-three 12-m antennas will be offered in the 12-m Array.")<br>ALT: 50 per configuration; OT considers 43-50 (PG, Sec. 4.3.3 [PDF p. 22]: "While each config- uration contains fifty 12-m antennas ... the OT considers the full range of 43 to 50-antenna configurations")<br>ALT: 50 used, >= 43 committed (TH, Sec. 7.2 [PDF p. 96]: "ALMA is committed to providing at least 43 antennas for each 12-m Array observation and on average provides more than 43 antennas")<br>ALT: notional = the 43 highest-priority pads (TH, Sec. 7.2 [PDF p. 96]: "which are the 43 pads in each configuration that have the highest operational priority in terms of antenna availability")<br>ALT: 54 12-m antennas, 192 pads (TH, Sec. 7.2 footnote 2 [PDF p. 96]: "ALMA’s 54 12-m antennas can be distributed among 192 “antenna pads”")<br>Note: The 50-antenna pad lists behind the PG/TH theta ranges are NOT FOUND in any downloadable file.<br>DERIVED: Count of data rows in each alma.cycle13.N.cfg: [43, 43, 43, 43, 43, 43, 43, 43, 43, 43] (all pad names unique: True). |
| dish | 12 | m (12-m Array antenna diameter) | TH, Sec. 2.2 (The 12-m Array) [PDF p. 11] | "The 12-m Array consists of fifty 12-meter diameter antennas"<br>ALT: diam column = 12. for every antenna in all ten cfg files (CFG, alma.cycle13.1.cfg line 4 (4th column): "-33.89412596 -712.7516484 -2.330089496 12. A001")<br>ALT: 54 of 66 antennas are 12 m (TH, App. A.1 (Design and Properties) [PDF p. 205]: "ALMA is composed of a total of 66 antennas, 54 with a diameter of 12 m and 12 with a diameter of 7 m.")<br>DERIVED: diam values found in the cfg files: [12.0] |
| blockage | 0.75 | m (effective blocked diameter: subreflector + support arms) | TH, Sec. 3.2 (Single-dish Response) [PDF p. 18] | "each 12-m antenna has a secondary reflector and support arms that block an effective area of 0.75 m diameter on the primary surface"<br>ALT: subreflector 750 mm (TH, App. A.1 [PDF p. 206]: "The subreflector has a diameter of 750 mm.") |
| baseline_range | 15 m to ~16 km | m | TH, Sec. 2.1 [PDF p. 11] | "The antenna foundation distribution yields baselines (distances between two antennas) ranging from 15 m to ∼16 km"<br>ALT: ~160 m to 16.2 km maximum baselines (PG, App. A.2 (Array configurations) [PDF p. 38]: "transition from the most compact (with maximum baselines of ∼160 m) up to the most extended configuration (maximum baselines of 16.2 km in Cycle 13)") |

## Imaging relations

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| theta_res_definition | theta_res ~ 0.574 lambda / L80 (L80 = 80th-percentile projected uv-distance); general k lambda / Lmax with 0.7 < k < 1.2; FWHM of the synthesized-beam main lobe; CASA simulations with Briggs robust = 0.5 |  | TH, Sec. 7.4.1 (Definition of angular resolution), Eq. 7.4 [PDF p. 101] | "Via simulations using the ALMA notional configurations, the following equation was empirically determined: 0.574λ θres ≈ [radians]"<br>ALT: Eq. 7.3: theta_res = k lambda / Lmax, FWHM of the main lobe (TH, Sec. 7.4.1, Eq. 7.3 [PDF p. 101]: "where θres is the FWHM of the main lobe of the synthesized beam; k is a factor that depends on the uv-plane weighting function")<br>ALT: 0.7 < k < 1.2 (TH, Sec. 7.4.1 [PDF p. 101]: "For commonly used weighting schemes, k is typically in the range 0.7 < k < 1.2.")<br>ALT: L80 = 80th percentile projected baseline (TH, Sec. 7.4.1 [PDF p. 101]: "ALMA uses the 80th percentile projected baseline uv-distance as a more robust proxy")<br>ALT: Briggs robust = 0.5 (TH, Sec. 7.4.2 (Effects of weighting scheme) [PDF p. 102]: "Unless otherwise specified, the angular resolutions and time ratios presented in this chapter were computed using CASA simulations with Briggs weighting and robust = 0.5.")<br>ALT: robust -2 to 2 spans 0.7" to 1.2" for C43-4 at 100 GHz (TH, Sec. 7.4.2 [PDF p. 102]: "the angular resolution varies from 0.7′′ (robust = −2) to 1.2′′ (robust = 2)")<br>ALT: Table 7.1/A-1: guideline value at -23 deg Dec; theta_max/theta_min = range over 50-antenna operational configurations (TH, Table 7.1 caption [PDF p. 97]: "θ is a guideline value for the angular resolution achievable with a given combination of band and configuration, assuming a source at -23 deg Dec. For the 12-m Array, a θmax and θmin are shown to convey the range of possible resolutions provided by the 50-antenna configurations, depending on the available antenna pads used by actual operational configurations.")<br>ALT: N-S size grows as 1/sin(elevation) (TH, Table 7.1 caption [PDF p. 97]: "For sources transiting at lower elevations, the North- South angular measures will increase proportional to 1/sin(elevation).")<br>ALT: operational configurations: beams +4.3% (C-8 +10.4%, C-9 -7.1%) vs notional (TH, Sec. 7.2 [PDF p. 96]: "Real-world configurations often use pads of the next more compact C-X configuration and typically have +4.3% (+/- 1.4%) larger beams than the notional configurations provided for simulations, apart from C-8 (+10.4%) and C-9 (-7.1%).")<br>ALT: Primer rule of thumb: ~0.2" x (300/nu GHz) x (1 km / max baseline) (PRIM, "ALMA Full Operations Specifications" table [PDF p. 8]: "Angular Resolution (“) ~0.2” × (300/ν GHz) × ( 1 km / maximum baseline )") |
| theta_mrs_definition | theta_MRS ~ 0.983 lambda / L5 (L5 = 5th percentile of uv-distance) |  | TH, Sec. 7.6 (Large Spatial Scale Response), Eq. 7.6 [PDF p. 108] | "ALMA uses the 5th percentile shortest baseline L5 instead of the very shortest baseline Lmin to calculate θM RS ; using simulations of configurations the following equation was empirically determined: 0.983 λ θM RS ≈ [radians]"<br>ALT: L5 = 5th percentile of uv-distance (TH, Sec. 7.6 [PDF p. 108]: "and L5 is the 5th percentile of uv-distance in meters")<br>ALT: PG Table A-2 uses L05 from TH Table 7.3 + Eq. 7.6 (PG, Table A-2 caption [PDF p. 40]: "is computed using the 5th percentile baseline (L05) from Table 7.3 and Equation 7.6 in the Technical Handbook.")<br>ALT: Primer: MRS = 0.6 lambda / minimum baseline (PRIM, Glossary-style text on MRS [PDF p. 29]: "and is defined to be 0.6 × (wave- ... length/minimum baseline) in radians") |
| table73_projection | Table 7.3 baselines are projected for a source transiting at zenith |  | TH, Table 7.3 caption [PDF p. 99] | "Table 7.3: Basic parameters of the notional 7-m Array and 12-m Array configurations. The baselines are projected for a source transiting at zenith."<br>INFERRED: The track length behind Table 7.3 is not stated. Projecting the cfg baselines for a source at Dec = -23.02917 deg over hour angles -1 h to +1 h (21 samples) reproduces Table 7.3: min within 1.4%, L05 within 0.47%, L80 within 0.15%, max within 0.012%; the instantaneous transit values are 0.1-1.8% off in L05/L80 (see configs.*.derived). |
| pb_relation | FWHM = 1.13 lambda / D (measured, 12-m and 7-m antennas); = 58" at 100 GHz for D = 12 m |  | TH, Sec. 3.2 (Single-dish Response) [PDF p. 18] | "The actual ALMA 12-m antennas (and the ALMA 7-m antennas) have measured primary beam FWHM values of ∼1.13 λ/D."<br>ALT: 58" at 100 GHz (TH, Sec. 7.7 (Mosaicing) [PDF p. 110]: "The resulting F W HM of the ALMA 12-m antennas is measured to be F W HM = 1.13 D ... = 58′′ at 100 GHz, and it varies inversely with frequency.")<br>ALT: -12 dB edge taper (TH, Sec. 7.7 [PDF p. 110]: "The ALMA feedhorns were designed to illuminate the dish with a -12 dB edge taper to provide a nearly Gaussian primary beam with low sidelobes")<br>ALT: Eq. 10.5 theta = 1.13 lambda / D (half-power width) (TH, Sec. 10.3.1 (Antenna Primary Beam Pattern), Eq. 10.5 [PDF p. 161]: "θ = 1.13λ/D")<br>ALT: CASA PB model = Airy pattern scaled to that FWHM (TH, Sec. 10.3.1 [PDF p. 161]: "The current primary beam model for ALMA antennas in CASA is an Airy pattern scaled in angular extent such that its FWHM matches θ in the equation above.")<br>ALT: uniform illumination would give 1.02 lambda / D (TH, Sec. 3.2, Eq. 3.4 [PDF p. 17]: "HPBW Primary Beam = 1.02 × λ/D.")<br>ALT: ~19.4" x (300/nu GHz) (12-m) (PRIM, "ALMA Full Operations Specifications" table [PDF p. 8]: "12-m Primary beam (“) ~19.4” × (300/ν GHz)")<br>DERIVED: 1.13 x (c/100 GHz) / 12 m = 58.23" (TH: 58"); at 300 GHz 19.41" (PRIM: ~19.4"). c = 299 792 458 m/s (SI). |

## Bandwidth

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| bandwidth | 7.5 | GHz per polarization (4 basebands x 1.875 GHz); Bands 9-10: 15 GHz with 90-deg Walsh switching | TH, Sec. 2.2 [PDF p. 12] | "The 7.5 GHz total IF bandwidth from the selected receiver is divided into four 1.875 GHz-wide basebands"<br>ALT: 7.5 GHz per polarization, Bands 1-8; Bands 9-10 double (15 GHz) (TH, Sec. 4.5 (The Cycle 13 Receivers) [PDF p. 36]: "The IF effective bandwidth is 7.5 GHz per polarization (after passing through the IF processing units), so the total instantaneous receiver bandwidth is the same for Bands 1–8. ... The effective system bandwidth available in Bands 9 and 10 is therefore double that of the 2SB receivers (15 GHz).")<br>ALT: 7.5 GHz per polarization from the receiver (TH, Sec. 2.2 [PDF p. 12]: "down-converts the signals to an intermediate frequency with 7.5 GHz of bandwidth per polarization")<br>ALT: Bands 9-10: 90-deg Walsh switching doubles continuum bandwidth to 15 GHz (default on in Cycle 13) (PG, App. A.5.3 [PDF p. 43]: "This mode doubles the continuum bandwidth to 15 GHz")<br>ALT: up to four basebands per polarization (PG, App. A.6.1 [PDF p. 43]: "The ALMA IF system provides up to four basebands (per parallel polarization) that can be independently placed within the two receiver sidebands.")<br>ALT: widest spectral window 1875 MHz (TDM, 15.6 MHz channels) (PG, Table A-5 [PDF p. 44]: "1875 15.6 31.2 120 TDM")<br>ALT: Primer: 16 GHz total = 2 pol x 4 basebands x 2 GHz (PRIM, "ALMA Full Operations Specifications" table [PDF p. 8]: "Correlator: Total Bandwidth 16 GHz (2 polarizations × 4 basebands × 2 GHz/baseband)")<br>Note: 2 GHz is the nominal baseband width; 1.875 GHz is the usable width after anti-aliasing filters (TH Sec. 4.5: "reduced to an effective total bandwidth of 3.75 GHz"). For continuum sensitivity use 7.5 GHz per polarization (15 GHz in Bands 9-10). |
| wsu | Wideband Sensitivity Upgrade (WSU) is upcoming, not part of the Cycle 13 capabilities (PG does not mention it; TH mentions it only for a future spectrometer) |  | TH, Sec. 5.2 (The ACA Spectrometer) [PDF p. 73] | "Total Power GPU Spectrometer (TPGS), under preparation for the upcoming Wideband Sensitivity Upgrade (WSU)."<br>ALT: WSU initial goal: 2x instantaneous bandwidth (WSU, Benefits of the WSU (Initial Cycle of Observations: 2x upgrade): "2x increase in available instantaneous bandwidth")<br>ALT: IF bandwidth to be broadened by >= 2x (WSU, overview text: "the broadening of the receiver Intermediate Frequency (IF) bandwidth by at least a factor of two")<br>Note: No WSU start date or cycle is given in the saved documents (NOT FOUND). |

## Elevation limits

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| elevation_hw | 2 deg minimum, 125 deg maximum (over the top), 0.2 deg zenith cone of avoidance (design specification, 2001) | deg | PB4, Sec. 4.2.4 (Range of Motion) [PDF p. 5] | "Minimum elevation angle for observations: 2 deg Maximum elevation angle for observations: 125 deg. Cone of avoidance at the zenith: 0.2 deg in radius for normal sidereal tracking."<br>ALT: azimuth range +/- 270 deg from North (PB4, Sec. 4.2.4 [PDF p. 5]: "Range of azimuth motion: 270 degrees either side of due north.")<br>ALT: wind-survival stow at 15 deg elevation (PB4, Sec. 4.2.4 [PDF p. 5]: "Stow position for wind survival: elevation 15 deg")<br>ALT: degraded switching within ~30 deg of zenith (PB4, Sec. 4.2.4 [PDF p. 5]: "there will be a region around the zenith about 30 deg in radius, where azimuth switching times are degraded")<br>Note: Design-era (pre-construction) project-book value; no Cycle 13 document states the hardware elevation range (TH, PG, PRIM, OT manuals searched; NOT FOUND there). |
| elevation_obs | sources must transit above 20 deg elevation: declination limit +47 deg = maximum elevation 20 deg; OT warning for transits 20-30 deg | deg | PG, App. A.8 (Source restrictions) [PDF p. 47] | "The adopted upper declination limit for ALMA is +47◦ , corresponding to a maximum elevation of 20◦ at the ALMA site. The ALMA OT gives a warning for objects from +37 through +47◦ declination, corre- sponding to transits between 20 and 30-degrees elevation."<br>ALT: +47 deg = max elevation ~20 deg; shadowing at low elevation (TH, Sec. 7.3 (Shadowing) [PDF p. 97]: "targets as far North as declination +47◦ can in principle be observed, corresponding to a maximum source elevation at the Chajnantor site of ∼ 20◦")<br>ALT: 12-m shadowing > 5% (most compact) for Dec < -65 or > +20 (PG, App. A.8 [PDF p. 47]: "For the 12-m Array, this shadowing becomes signif- icant (> 5%) in the most compact configuration for sources with declinations lower than −65◦ or higher than +20◦ .")<br>ALT: shadowing fraction up to 55% in C-1 (TH, Sec. 7.3 [PDF p. 97]: "the shadowing fraction can be as large as 55% for sources observed with the most compact 12-m Array configuration")<br>ALT: design aim: sources transiting above 20 deg (PRIM, Level One Science Aims, III [PDF p. 8]: "This requirement applies to all sources visible to ALMA that transit at an elevation greater than 20 degrees.")<br>ALT: PWV limits quoted for 60 deg elevation (PG, Sec. 4.3.1 (Weather), Figure 2 caption [PDF p. 20]: "show the PWV observing limits adopted for the ALMA bands for an elevation of 60 degrees.")<br>INFERRED: A per-scan minimum observing elevation (track cut-off) is NOT FOUND in the Cycle 13 documents; "20 deg" here is the transit-elevation floor, not a tracking limit. |

## Configurations C-1 ... C-10: derived baselines vs published (machine-readable: `configs`)

DERIVED from the cfg files (903 baselines each). "3-D" = ground distance; "zenith" = horizontal length (instant at transit of a zenith source); "+/-1h" = projected uv-distance for Dec -23.02917 deg over hour angles -1 h ... +1 h. Published: PG Table A-1 Lmax / Table A-2 Lmin (Cycle 13 C-X) and TH Table 7.3 (notional C43-X; "projected for a source transiting at zenith").

| config | Lmin 3-D / +/-1h (m) | TH 7.3 min | PG Lmin | L05 zenith / +/-1h | TH 7.3 L05 | L80 zenith / +/-1h | TH 7.3 L80 | Lmax 3-D / +/-1h (m) | TH 7.3 max | PG Lmax | centroid e, n, u (m) | u range (m) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C-1 | 15.06 / 14.65 | 14.6 | 15 m | 21.39 / 21.35 | 21.4 | 107.67 / 107.03 | 107.1 | 160.69 / 160.69 | 160.7 | 161 m | -60.6, -27.0, -2.2 | -3.3 to -1.3 |
| C-2 | 15.06 / 14.65 | 14.6 | 15 m | 27.47 / 26.94 | 27.0 | 144.22 / 143.76 | 143.8 | 313.69 / 313.68 | 313.7 | 314 m | -58.4, -36.0, -2.2 | -5.6 to -0.0 |
| C-3 | 15.06 / 14.65 | 14.6 | 15 m | 37.85 / 37.62 | 37.6 | 236.08 / 235.11 | 235.4 | 500.20 / 500.20 | 500.2 | 500 m | -60.3, -18.9, -2.2 | -7.8 to 3.0 |
| C-4 | 15.06 / 14.65 | 14.6 | 15 m | 54.97 / 54.08 | 54.1 | 370.71 / 368.66 | 369.2 | 783.55 / 783.55 | 783.5 | 784 m | -62.4, -29.8, -2.2 | -11.9 to 7.0 |
| C-5 | 15.08 / 14.65 | 14.6 | 15 m | 91.84 / 90.68 | 90.9 | 626.02 / 623.20 | 623.8 | 1397.88 / 1397.88 | 1397.9 | 1.4 km | -47.4, -0.0, -3.0 | -21.8 to 7.0 |
| C-6 | 15.08 / 14.65 | 14.6 | 15 m | 151.21 / 147.91 | 148.6 | 1180.63 / 1170.90 | 1172.5 | 2516.92 / 2516.90 | 2516.9 | 2.5 km | -33.0, -84.3, -5.1 | -48.8 to 13.7 |
| C-7 | 64.06 / 63.97 | 64.0 | 64 m | 237.08 / 235.09 | 235.2 | 1679.80 / 1672.00 | 1673.1 | 3637.81 / 3637.81 | 3637.8 | 3.6 km | -39.8, 6.6, -7.8 | -48.8 to 13.7 |
| C-8 | 113.02 / 109.62 | 110.4 | 110 m | 430.23 / 427.75 | 427.3 | 3543.95 / 3527.29 | 3527.3 | 8547.79 / 8547.79 | 8547.7 | 8.5 km | 240.6, 217.6, -19.9 | -158.5 to 26.7 |
| C-9 | 375.51 / 362.42 | 367.6 | 368 m | 753.65 / 746.82 | 746.9 | 6500.02 / 6474.38 | 6482.6 | 13894.83 / 13894.61 | 13894.2 | 13.9 km | 808.6, 283.1, -62.6 | -339.3 to 26.7 |
| C-10 | 256.12 / 244.41 | 244.0 | 244 m | 1235.44 / 1226.10 | 1228.1 | 8750.87 / 8687.79 | 8685.9 | 16196.58 / 16195.98 | 16194.0 | 16.2 km | 1217.7, 889.0, -111.2 | -445.3 to 26.7 |

Quotes: PG C-1: "C-1 161 m θmax" / "C-1 15 m θM RS". PG C-2: "C-2 314 m θmax" / "C-2 15 m θM RS". PG C-3: "C-3 500 m θmax" / "C-3 15 m θM RS". PG C-4: "C-4 784 m θmax" / "C-4 15 m θM RS". PG C-5: "C-5 1.4 km θmax" / "C-5 15 m θM RS". PG C-6: "C-6 2.5 km θmax" / "C-6 15 m θM RS". PG C-7: "C-7 3.6 km θmax" / "C-7 64 m θM RS". PG C-8: "C-8 8.5 km θmax" / "C-8 110 m θM RS". PG C-9: "C-9 13.9 km θmax" / "C-9 368 m θM RS". PG C-10: "C-10 16.2 km θmax" / "C-10 244 m θM RS".

TH Table 7.3 quotes: "Configuration 7-m C43-1 C43-2 C43-3 C43-4 C43-5 ... Minimum baseline (m) 8.7 14.6 14.6 14.6 14.6 14.6 ... 5th percentile or L05 (m) 9.1 21.4 27.0 37.6 54.1 90.9 ... 80th percentile or L80 (m) 30.7 107.1 143.8 235.4 369.2 623.8 ... Maximum baseline (m) 45.0 160.7 313.7 500.2 783.5 1397.9" (Table 7.3 [PDF p. 99]) | "Configuration C43-6 C43-7 C43-8 C43-9 C43-10 ... Minimum baseline (m) 14.6 64.0 110.4 367.6 244.0 ... 5th percentile or L05 (m) 148.6 235.2 427.3 746.9 1228.1 ... 80th percentile or L80 (m) 1172.5 1673.1 3527.3 6482.6 8685.9 ... Maximum baseline (m) 2516.9 3637.8 8547.7 13894.2 16194.0" (Table 7.3 [PDF p. 99]). 7-m column: min 8.7, L05 9.1, L80 30.7, max 45.0 m.

### theta at 100 GHz: TH relations applied to the cfg vs the Cycle 13 tables (DERIVED)

| config | 0.574 lambda/L80 (TH 7.3 L80) | 0.574 lambda/L80 (cfg +/-1h) | PG/TH theta_max | theta_min | 0.983 lambda/L05 (TH 7.3) | (cfg +/-1h) | PG/TH theta_MRS |
|---|---|---|---|---|---|---|---|
| C-1 | 3.3141" | 3.3163" | 3.31" | 3.07" | 28.404" | 28.464" | 28.5" |
| C-2 | 2.4683" | 2.4690" | 3.18" | 2.92" | 22.513" | 22.564" | 22.6" |
| C-3 | 1.5078" | 1.5097" | 2.39" | 1.91" | 16.166" | 16.160" | 16.2" |
| C-4 | 0.9614" | 0.9628" | 1.41" | 1.2" | 11.236" | 11.240" | 11.2" |
| C-5 | 0.5690" | 0.5695" | 0.89" | 0.72" | 6.687" | 6.703" | 6.7" |
| C-6 | 0.3027" | 0.3031" | 0.54" | 0.4" | 4.091" | 4.110" | 4.11" |
| C-7 | 0.2121" | 0.2123" | 0.3" | 0.27" | 2.584" | 2.586" | 2.58" |
| C-8 | 0.1006" | 0.1006" | 0.2" | 0.12" | 1.423" | 1.421" | 1.42" |
| C-9 | 0.0548" | 0.0548" | 0.074" | 0.062" | 0.814" | 0.814" | 0.81" |
| C-10 | 0.0409" | 0.0409" | 0.057" | 0.051" | 0.495" | 0.496" | 0.5" |

lambda = c / 100 GHz = 2.998 mm (c = 299 792 458 m/s, SI). MRS reproduces the table to 1.0%; theta_res matches only C-1 (see Conflicts).

## Angular resolution table (TH Table 7.1 = PG Table A-1; machine-readable: `res_table`)

Definition and caption: see `theta_res_definition`. Frequencies (GHz) per band 1-10: 40, 75, 100, 150, 185, 230, 345, 460, 650, 870 ("Band 1 2 3 4 5 6 7 8 9 10 Freq (GHz) 40 75 100 150 185 230 345 460 650 870", TH Table 7.1 header).

| config | row | B1 40 GHz | B2 75 GHz | B3 100 GHz | B4 150 GHz | B5 185 GHz | B6 230 GHz | B7 345 GHz | B8 460 GHz | B9 650 GHz | B10 870 GHz | verbatim quote |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7-m | theta (") | 31.8 | 16.9 | 12.7 | 8.47 | 6.87 | 5.52 | 3.68 | 2.76 | 1.95 | 1.46 | "7-m θ (′′ ) 31.8 16.9 12.7 8.47 6.87 5.52 3.68 2.76 1.95 1.46" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-1 | theta_max (") | 8.28 | 4.42 | 3.31 | 2.21 | 1.79 | 1.44 | 0.96 | 0.72 | 0.51 | 0.38 | "C-1 θmax (′′ ) 8.28 4.42 3.31 2.21 1.79 1.44 0.96 0.72 0.51 0.38" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-1 | theta_min (") | 7.69 | 4.1 | 3.07 | 2.05 | 1.66 | 1.34 | 0.89 | 0.67 | 0.47 | 0.35 | "θmin (′′ ) 7.69 4.10 3.07 2.05 1.66 1.34 0.89 0.67 0.47 0.35" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-2 | theta_max (") | 7.96 | 4.24 | 3.18 | 2.12 | 1.72 | 1.38 | 0.92 | 0.69 | 0.49 | 0.37 | "C-2 θmax (′′ ) 7.96 4.24 3.18 2.12 1.72 1.38 0.92 0.69 0.49 0.37" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-2 | theta_min (") | 7.31 | 3.89 | 2.92 | 1.95 | 1.58 | 1.27 | 0.85 | 0.64 | 0.45 | 0.34 | "θmin (′′ ) 7.31 3.89 2.92 1.95 1.58 1.27 0.85 0.64 0.45 0.34" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-3 | theta_max (") | 5.97 | 3.19 | 2.39 | 1.59 | 1.29 | 1.04 | 0.69 | 0.52 | 0.37 | 0.27 | "C-3 θmax (′′ ) 5.97 3.19 2.39 1.59 1.29 1.04 0.69 0.52 0.37 0.27" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-3 | theta_min (") | 4.79 | 2.55 | 1.91 | 1.28 | 1.03 | 0.83 | 0.55 | 0.42 | 0.29 | 0.22 | "θmin (′′ ) 4.79 2.55 1.91 1.28 1.03 0.83 0.55 0.42 0.29 0.22" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-4 | theta_max (") | 3.54 | 1.88 | 1.41 | 0.94 | 0.76 | 0.61 | 0.41 | 0.31 | 0.22 | 0.16 | "C-4 θmax (′′ ) 3.54 1.88 1.41 0.94 0.76 0.61 0.41 0.31 0.22 0.16" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-4 | theta_min (") | 2.99 | 1.6 | 1.2 | 0.8 | 0.65 | 0.52 | 0.35 | 0.26 | 0.18 | 0.14 | "θmin (′′ ) 2.99 1.60 1.20 0.80 0.65 0.52 0.35 0.26 0.18 0.14" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-5 | theta_max (") | 2.22 | 1.18 | 0.89 | 0.59 | 0.48 | 0.39 | 0.26 | 0.19 | 0.14 | 0.1 | "C-5 θmax (′′ ) 2.22 1.18 0.89 0.59 0.48 0.39 0.26 0.19 0.14 0.10" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-5 | theta_min (") | 1.8 | 0.96 | 0.72 | 0.48 | 0.39 | 0.31 | 0.21 | 0.16 | 0.11 | 0.083 | "θmin (′′ ) 1.80 0.96 0.72 0.48 0.39 0.31 0.21 0.16 0.11 0.083" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-6 | theta_max (") | 1.34 | 0.72 | 0.54 | 0.36 | 0.29 | 0.23 | 0.16 | 0.12 | 0.082 | 0.061 | "C-6 θmax (′′ ) 1.34 0.72 0.54 0.36 0.29 0.23 0.16 0.12 0.082 0.061" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-6 | theta_min (") | 0.99 | 0.53 | 0.4 | 0.26 | 0.21 | 0.17 | 0.11 | 0.086 | 0.061 | 0.046 | "θmin (′′ ) 0.99 0.53 0.40 0.26 0.21 0.17 0.11 0.086 0.061 0.046" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-7 | theta_max (") | 0.74 | 0.39 | 0.3 | 0.2 | 0.16 | 0.13 | 0.086 | 0.064 | 0.046 | 0.034 | "C-7 θmax (′′ ) 0.74 0.39 0.30 0.20 0.16 0.13 0.086 0.064 0.046 0.034" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-7 | theta_min (") | 0.67 | 0.36 | 0.27 | 0.18 | 0.14 | 0.12 | 0.077 | 0.058 | 0.041 | 0.031 | "θmin (′′ ) 0.67 0.36 0.27 0.18 0.14 0.12 0.077 0.058 0.041 0.031" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-8 | theta_max (") | 0.5 | 0.27 | 0.2 | 0.13 | 0.11 | 0.087 | 0.058 | 0.043 | 0.031 | 0.023 | "C-8 θmax (′′ ) 0.50 0.27 0.20 0.13 0.11 0.087 0.058 0.043 0.031 0.023" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-8 | theta_min (") | 0.31 | 0.17 | 0.12 | 0.083 | 0.067 | 0.054 | 0.036 | 0.027 | 0.019 | 0.014 | "θmin (′′ ) 0.31 0.17 0.12 0.083 0.067 0.054 0.036 0.027 0.019 0.014" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-9 | theta_max (") | 0.19 | 0.1 | 0.074 | 0.049 | 0.04 | 0.032 | 0.021 | 0.016 | 0.011 | 0.0085 | "C-9 θmax (′′ ) 0.19 0.10 0.074 0.049 0.040 0.032 0.021 0.016 0.011 0.0085" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-9 | theta_min (") | 0.16 | 0.083 | 0.062 | 0.041 | 0.034 | 0.027 | 0.018 | 0.013 | 0.01 | 0.0071 | "θmin (′′ ) 0.16 0.083 0.062 0.041 0.034 0.027 0.018 0.013 0.010 0.0071" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-10 | theta_max (") | 0.14 | 0.076 | 0.057 | 0.038 | 0.031 | 0.025 | 0.017 | 0.012 | 0.0088 | 0.0066 | "C-10 θmax (′′ ) 0.14 0.076 0.057 0.038 0.031 0.025 0.017 0.012 0.0088 0.0066" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |
| C-10 | theta_min (") | 0.13 | 0.068 | 0.051 | 0.034 | 0.028 | 0.022 | 0.015 | 0.011 | 0.0078 | 0.0059 | "θmin (′′ ) 0.13 0.068 0.051 0.034 0.028 0.022 0.015 0.011 0.0078 0.0059" (Table 7.1 (identical numbers in PG Table A-1) [PDF p. 97]) |

## Maximum recoverable scale table (TH Table 7.2 = PG Table A-2; machine-readable: `mrs_table`)

| config | B1 40 GHz | B2 75 GHz | B3 100 GHz | B4 150 GHz | B5 185 GHz | B6 230 GHz | B7 345 GHz | B8 460 GHz | B9 650 GHz | B10 870 GHz | verbatim quote |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 7-m | 167 | 88.9 | 66.7 | 44.5 | 36.1 | 29 | 19.3 | 14.5 | 10.3 | 7.67 | "7-m θM RS (′′ ) 167 88.9 66.7 44.5 36.1 29.0 19.3 14.5 10.3 7.67" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-1 | 71.2 | 38 | 28.5 | 19 | 15.4 | 12.4 | 8.25 | 6.19 | 4.38 | 3.27 | "C-1 θM RS (′′ ) 71.2 38.0 28.5 19.0 15.4 12.4 8.25 6.19 4.38 3.27" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-2 | 56.5 | 30.1 | 22.6 | 15 | 12.2 | 9.81 | 6.54 | 4.9 | 3.47 | 2.59 | "C-2 θM RS (′′ ) 56.5 30.1 22.6 15.0 12.2 9.81 6.54 4.90 3.47 2.59" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-3 | 40.5 | 21.6 | 16.2 | 10.8 | 8.73 | 7.02 | 4.68 | 3.51 | 2.48 | 1.86 | "C-3 θM RS (′′ ) 40.5 21.6 16.2 10.8 8.73 7.02 4.68 3.51 2.48 1.86" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-4 | 28 | 14.9 | 11.2 | 7.5 | 6.08 | 4.89 | 3.26 | 2.44 | 1.73 | 1.29 | "C-4 θM RS (′′ ) 28.0 14.9 11.2 7.50 6.08 4.89 3.26 2.44 1.73 1.29" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-5 | 16.8 | 8.93 | 6.7 | 4.47 | 3.62 | 2.91 | 1.94 | 1.46 | 1.03 | 0.77 | "C-5 θM RS (′′ ) 16.8 8.93 6.70 4.47 3.62 2.91 1.94 1.46 1.03 0.77" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-6 | 10.3 | 5.48 | 4.11 | 2.74 | 2.22 | 1.78 | 1.19 | 0.89 | 0.63 | 0.47 | "C-6 θM RS (′′ ) 10.3 5.48 4.11 2.74 2.22 1.78 1.19 0.89 0.63 0.47" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-7 | 6.45 | 3.44 | 2.58 | 1.72 | 1.4 | 1.12 | 0.75 | 0.56 | 0.4 | 0.3 | "C-7 θM RS (′′ ) 6.45 3.44 2.58 1.72 1.40 1.12 0.75 0.56 0.40 0.30" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-8 | 3.55 | 1.89 | 1.42 | 0.95 | 0.77 | 0.62 | 0.41 | 0.31 | 0.22 | 0.16 | "C-8 θM RS (′′ ) 3.55 1.89 1.42 0.95 0.77 0.62 0.41 0.31 0.22 0.16" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-9 | 2.03 | 1.08 | 0.81 | 0.54 | 0.44 | 0.35 | 0.24 | 0.18 | 0.13 | 0.093 | "C-9 θM RS (′′ ) 2.03 1.08 0.81 0.54 0.44 0.35 0.24 0.18 0.13 0.093" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |
| C-10 | 1.25 | 0.67 | 0.5 | 0.33 | 0.27 | 0.22 | 0.14 | 0.11 | 0.077 | 0.057 | "C-10 θM RS (′′ ) 1.25 0.67 0.50 0.33 0.27 0.22 0.14 0.11 0.077 0.057" (Table 7.2 (identical numbers in PG Table A-2) [PDF p. 99]) |

## Peak sidelobe levels (TH Table 7.5; machine-readable: `sidelobe_table`)

"Table 7.5: Peak sidelobe levels for a 1-hour observation of an unresolved source at a declination of −23◦ with the different notional array configurations." (Table 7.5 caption [PDF p. 106])

| config | natural | briggs (R = 0.5) | uniform |
|---|---|---|---|
| 7-m | 44% | 42.2% | 39% |
| C43-1 | 5.5% | 7.8% | 7.7% |
| C43-2 | 5% | 6.6% | 16.7% |
| C43-3 | 6.2% | 6.7% | 12.4% |
| C43-4 | 10.4% | 7.3% | 11% |
| C43-5 | 6.3% | 8% | 13.1% |
| C43-6 | 4.6% | 6.2% | 11.3% |
| C43-7 | 9.6% | 5.6% | 11.2% |
| C43-8 | 7.8% | 9.7% | 10.1% |
| C43-9 | 11.1% | 9.6% | 8.5% |
| C43-10 | 13% | 11.3% | 12% |

Quotes: "natural 44.0% 5.5% 5.0% 6.2% 10.4% 6.3% ... briggs (R = 0.5) 42.2% 7.8% 6.6% 6.7% 7.3% 8.0% ... uniform 39.0% 7.7% 16.7% 12.4% 11.0% 13.1%" (Table 7.5 [PDF p. 106]) | "natural 4.6% 9.6% 7.8% 11.1% 13.0% ... briggs (R = 0.5) 6.2% 5.6% 9.7% 9.6% 11.3% ... uniform 11.3% 11.2% 10.1% 8.5% 12.0%" (Table 7.5 [PDF p. 106])

## Receiver bands (machine-readable: `bands`)

lo/hi = PG Table A-4 nominal continuum ranges; bw_GHz = 7.5 GHz per polarization (TH Table 4.1 "Inst. IF bandw."); bw_GHz_max = 15 GHz for Bands 9-10 with 90-deg Walsh switching; rep_GHz = the PG/TH table frequency. "These are the nominal frequency ranges for continuum observations." (Table A-4 caption [PDF p. 42]). "Band 2, covering 67–116 GHz, is offered for the 12-m Array, including full polarization with a single pointing." (Sec. 1.1 (Band 2 on the 12-m Array) [PDF p. 7]). "Maximum instantaneous IF bandwidth, limited by the back-end filters and spectrometers." (Table 4.1 note 4 [PDF p. 31]).

| band | lo-hi (GHz) | rep (GHz) | type | IF (GHz) | LO1 (GHz) | bw per pol (GHz) | PG Table A-4 quote | TH Table 4.1 quote |
|---|---|---|---|---|---|---|---|---|
| 1 | 35-50 | 40 | SSB | 4-12 | 31-38 | 7.5 | "1 35 – 50 8.5 – 6 4 – 12 SSB" | "1 35.0 – 50.0/ 31.0 – 38.0 SSB 4 – 12 7.5 <25 <32" |
| 2 | 67-116 | 75 | 2SB | 4-12 | 79-104 | 7.5 | "2 67 – 116 4.5 – 2.6 4 – 12 2SB" | "2 67.0 – 116.0/ 79 – 104 2SB 4 – 12 7.5 <30,417 <437" |
| 3 | 84-116 | 100 | 2SB | 4-8 | 92-108 | 7.5 | "3 84 – 116 3.6 – 2.6 4–8 2SB" | "3 84.0 – 116.0/ 92 – 108 2SB 4–8 7.5 <398 <438" |
| 4 | 125-163 | 150 | 2SB | 4-8 | 133-155 | 7.5 | "4 125 – 163 2.4 – 1.8 4–8 2SB" | "4 125.0 – 163.0/ 133 – 155 2SB 4–8 7.5 <51 <82" |
| 5 | 158-211 | 185 | 2SB | 4-8 | 166-203 | 7.5 | "5 158 – 211 1.9 – 1.4 4–8 2SB" | "5 158.0 – 211.0/ 166 – 203 2SB 4–8 7.5 <55 <75" |
| 6 | 211-275 | 230 | 2SB | 4.5-10 | 221-265 | 7.5 | "6 211 – 275 1.4 – 1.1 4.5 – 10 2SB" | "6 211.0 – 275.0/ 221 – 265 2SB 4.5 – 103 7.5 <83 <136" |
| 7 | 275-373 | 345 | 2SB | 4-8 | 283-365 | 7.5 | "7 275 – 373 1.1 – 0.8 4–8 2SB" | "7 275.0 – 373.0/ 283 – 365 2SB 4–8 7.5 <147 <219" |
| 8 | 385-500 | 460 | 2SB | 4-8 | 393-492 | 7.5 | "8 385 – 500 0.78 – 0.60 4–8 2SB" | "8 385.0 – 500.0/ 393 – 492 2SB 4–8 7.5 <196 <292" |
| 9 | 602-720 | 650 | DSB | 4-12 | 610-712 | 7.5 (15) | "9 602 – 720 0.50 – 0.42 4 – 12 DSB" | "9 602.0 – 720.0/ 610 – 712 DSB 4 – 12 7.5(15)5 <175 <261" |
| 10 | 787-950 | 870 | DSB | 4-12 | 795-942 | 7.5 (15) | "10 787 – 950 0.38 – 0.32 4 – 12 DSB" | "10 787.0 – 950.0/ 795 – 942 DSB 4 – 12 7.5(15)5 <2309 <344" |

TH Table 4.1 text runs footnote markers into the numbers (e.g. "<30,417" = "<30, 41" + note 7; "4.5 - 103" = "4.5 - 10" + note 3; "7.5(15)5" = "7.5 (15)" + note 5).

## Configuration schedule (PG Table 3; machine-readable: `schedule`)

| start | config | longest baseline | LST best | verbatim quote |
|---|---|---|---|---|
| 2026 October 1 | C-3 | 0.50 km | ∼ 22—10 h | "2026 October 1 C-3 0.50 km ∼ 22—10 h" |
| 2026 October 20 | C-2 | 0.31 km | ∼ 23—11 h | "2026 October 20 C-2 0.31 km ∼ 23—11 h" |
| 2026 November 10 | C-1 | 0.16 km | ∼ 1—13 h | "2026 November 10 C-1 0.16 km ∼ 1—13 h" |
| 2026 November 30 | C-2 | 0.31 km | ∼ 2—14 h | "2026 November 30 C-2 0.31 km ∼ 2—14 h" |
| 2026 December 20 | C-3 | 0.50 km | ∼ 4—15 h | "2026 December 20 C-3 0.50 km ∼ 4—15 h" |
| 2027 January 10 | C-4 | 0.78 km | ∼ 5—17 h | "2027 January 10 C-4 0.78 km ∼ 5—17 h" |
| 2027 February 1 | No observations due to maintenance |  |  | "2027 February 1 No observations due to maintenance" |
| 2027 March 1 | C-4 | 0.78 km | ∼ 8—21 h | "2027 March 1 C-4 0.78 km ∼ 8—21 h" |
| 2027 March 20 | C-5 | 1.4 km | ∼ 9—23 h | "2027 March 20 C-5 1.4 km ∼ 9—23 h" |
| 2027 April 20 | C-6 | 2.5 km | ∼ 11—1 h | "2027 April 20 C-6 2.5 km ∼ 11—1 h" |
| 2027 May 20 | C-7 | 3.6 km | ∼ 13—3 h | "2027 May 20 C-7 3.6 km ∼ 13—3 h" |
| 2027 June 20 | C-8 | 8.5 km | ∼ 14—5 h | "2027 June 20 C-8 8.5 km ∼ 14—5 h" |
| 2027 July 11 | C-9 | 13.9 km | ∼ 16—6 h | "2027 July 11 C-9 13.9 km ∼ 16—6 h" |
| 2027 July 30 | C-10 | 16.2 km | ∼ 17—7 h | "2027 July 30 C-10 16.2 km ∼ 17—7 h" |
| 2027 August 20 | C-9 | 13.9 km | ∼ 19—8 h | "2027 August 20 C-9 13.9 km ∼ 19—8 h" |
| 2027 September 10 | C-8 | 8.5 km | ∼ 20—9 h | "2027 September 10 C-8 8.5 km ∼ 20—9 h" |

## Antenna positions (DERIVED e, n, u in metres at the array centre; machine-readable: `configs.C-N.antennas`)

### C-1 (`rawdata/interf/alma/alma.cycle13.1.cfg`, sha256 c6ecb7c64334..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A001 | -62.617 | -16.280 | -2.290 | A002 | -46.177 | -13.137 | -2.289 | A003 | -51.282 | 4.488 | -2.286 |
| A004 | -34.144 | -27.319 | -2.293 | A005 | -3.477 | -47.960 | -2.293 | A006 | -7.776 | -24.993 | -2.292 |
| A007 | -12.788 | -4.204 | -2.291 | A008 | -19.241 | 9.395 | -2.692 | A009 | -38.558 | 32.645 | -2.688 |
| A010 | -49.617 | 42.912 | -2.404 | A011 | 9.103 | -39.404 | -2.442 | A013 | -27.757 | -6.183 | -2.287 |
| A015 | -17.983 | 36.905 | -2.692 | A016 | -49.343 | 62.565 | -2.496 | A017 | -35.435 | 11.520 | -2.290 |
| A018 | -69.962 | -29.506 | -2.295 | A019 | -79.027 | -14.738 | -2.293 | A022 | -72.367 | 43.729 | -2.290 |
| A023 | -88.127 | 28.900 | -2.096 | A024 | -103.198 | 11.814 | -2.093 | A025 | -113.246 | -8.422 | -1.899 |
| A026 | -115.596 | -35.790 | -1.887 | A027 | -121.866 | -49.488 | -1.898 | A028 | -85.773 | 51.033 | -2.097 |
| A030 | -97.204 | -1.999 | -2.297 | A031 | -124.623 | 1.582 | -1.890 | A033 | -134.161 | -58.532 | -1.597 |
| A034 | -105.625 | -21.701 | -1.889 | A035 | -54.765 | -29.717 | -2.291 | A036 | -44.122 | -49.887 | -2.288 |
| A038 | -109.220 | -68.640 | -1.897 | A039 | -92.912 | -74.678 | -1.894 | A040 | -71.062 | -81.389 | -2.293 |
| A041 | -51.816 | -82.136 | -2.294 | A042 | -26.340 | -66.814 | -2.793 | A043 | -11.617 | -70.062 | -2.796 |
| A044 | -108.790 | -83.902 | -1.289 | A045 | -92.228 | -90.348 | -1.293 | A046 | -65.390 | -65.694 | -2.295 |
| A047 | -48.377 | -98.123 | -2.290 | A048 | -30.246 | -92.473 | -2.789 | A049 | 1.629 | -77.447 | -3.289 |
| A050 | -43.769 | -67.863 | -2.290 |  |  |  |  |  |  |  |  |

### C-2 (`rawdata/interf/alma/alma.cycle13.2.cfg`, sha256 464fa1a5713d..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A001 | -62.617 | -16.280 | -2.290 | A002 | -46.177 | -13.137 | -2.289 | A003 | -51.282 | 4.488 | -2.286 |
| A004 | -34.144 | -27.319 | -2.293 | A005 | -3.477 | -47.960 | -2.293 | A006 | -7.776 | -24.993 | -2.292 |
| A007 | -12.788 | -4.204 | -2.291 | A008 | -19.241 | 9.395 | -2.692 | A010 | -49.617 | 42.912 | -2.404 |
| A011 | 9.103 | -39.404 | -2.442 | A015 | -17.983 | 36.905 | -2.692 | A016 | -49.343 | 62.565 | -2.496 |
| A017 | -35.435 | 11.520 | -2.290 | A019 | -79.027 | -14.738 | -2.293 | A022 | -72.367 | 43.729 | -2.290 |
| A023 | -88.127 | 28.900 | -2.096 | A024 | -103.198 | 11.814 | -2.093 | A025 | -113.246 | -8.422 | -1.899 |
| A026 | -115.596 | -35.790 | -1.887 | A027 | -121.866 | -49.488 | -1.898 | A033 | -134.161 | -58.532 | -1.597 |
| A034 | -105.625 | -21.701 | -1.889 | A035 | -54.765 | -29.717 | -2.291 | A036 | -44.122 | -49.887 | -2.288 |
| A039 | -92.912 | -74.678 | -1.894 | A040 | -71.062 | -81.389 | -2.293 | A041 | -51.816 | -82.136 | -2.294 |
| A042 | -26.340 | -66.814 | -2.793 | A043 | -11.617 | -70.062 | -2.796 | A044 | -108.790 | -83.902 | -1.289 |
| A045 | -92.228 | -90.348 | -1.293 | A047 | -48.377 | -98.123 | -2.290 | A048 | -30.246 | -92.473 | -2.789 |
| A049 | 1.629 | -77.447 | -3.289 | A050 | -43.769 | -67.863 | -2.290 | A058 | -74.073 | -149.925 | -1.794 |
| A066 | -83.435 | 79.783 | -2.492 | A068 | -169.230 | 45.308 | -0.602 | A069 | -188.274 | -92.997 | -0.037 |
| A060 | -34.012 | -166.382 | -1.490 | A062 | -108.266 | -132.468 | -1.243 | A072 | 60.371 | 96.512 | -5.634 |
| A074 | 74.994 | -151.520 | -4.437 |  |  |  |  |  |  |  |  |

### C-3 (`rawdata/interf/alma/alma.cycle13.3.cfg`, sha256 4b91ef943090..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A001 | -62.617 | -16.280 | -2.290 | A002 | -46.177 | -13.137 | -2.289 | A007 | -12.788 | -4.204 | -2.291 |
| A008 | -19.241 | 9.395 | -2.692 | A010 | -49.617 | 42.912 | -2.404 | A011 | 9.103 | -39.404 | -2.442 |
| A015 | -17.983 | 36.905 | -2.692 | A016 | -49.343 | 62.565 | -2.496 | A022 | -72.367 | 43.729 | -2.290 |
| A023 | -88.127 | 28.900 | -2.096 | A024 | -103.198 | 11.814 | -2.093 | A025 | -113.246 | -8.422 | -1.899 |
| A026 | -115.596 | -35.790 | -1.887 | A027 | -121.866 | -49.488 | -1.898 | A033 | -134.161 | -58.532 | -1.597 |
| A034 | -105.625 | -21.701 | -1.889 | A035 | -54.765 | -29.717 | -2.291 | A036 | -44.122 | -49.887 | -2.288 |
| A040 | -71.062 | -81.389 | -2.293 | A042 | -26.340 | -66.814 | -2.793 | A043 | -11.617 | -70.062 | -2.796 |
| A044 | -108.790 | -83.902 | -1.289 | A045 | -92.228 | -90.348 | -1.293 | A047 | -48.377 | -98.123 | -2.290 |
| A048 | -30.246 | -92.473 | -2.789 | A049 | 1.629 | -77.447 | -3.289 | A050 | -43.769 | -67.863 | -2.290 |
| A058 | -74.073 | -149.925 | -1.794 | A060 | -34.012 | -166.382 | -1.490 | A062 | -108.266 | -132.468 | -1.243 |
| A066 | -83.435 | 79.783 | -2.492 | A068 | -169.230 | 45.308 | -0.602 | A069 | -188.274 | -92.997 | -0.037 |
| A070 | 79.375 | -66.395 | -4.049 | A072 | 60.371 | 96.512 | -5.634 | A073 | -233.872 | -28.218 | 0.260 |
| A074 | 74.994 | -151.520 | -4.437 | A075 | -91.373 | 177.406 | -1.488 | A076 | -164.793 | -205.614 | 0.987 |
| A082 | 182.229 | -63.868 | -7.676 | A083 | -230.344 | 188.887 | 2.968 | A085 | 120.882 | 204.888 | -7.796 |
| A088 | -99.891 | 269.079 | -0.549 |  |  |  |  |  |  |  |  |

### C-4 (`rawdata/interf/alma/alma.cycle13.4.cfg`, sha256 3ee8be08abd4..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A001 | -62.617 | -16.280 | -2.290 | A007 | -12.788 | -4.204 | -2.291 | A008 | -19.241 | 9.395 | -2.692 |
| A011 | 9.103 | -39.404 | -2.442 | A015 | -17.983 | 36.905 | -2.692 | A016 | -49.343 | 62.565 | -2.496 |
| A022 | -72.367 | 43.729 | -2.290 | A023 | -88.127 | 28.900 | -2.096 | A024 | -103.198 | 11.814 | -2.093 |
| A027 | -121.866 | -49.488 | -1.898 | A033 | -134.161 | -58.532 | -1.597 | A035 | -54.765 | -29.717 | -2.291 |
| A042 | -26.340 | -66.814 | -2.793 | A043 | -11.617 | -70.062 | -2.796 | A044 | -108.790 | -83.902 | -1.289 |
| A045 | -92.228 | -90.348 | -1.293 | A047 | -48.377 | -98.123 | -2.290 | A048 | -30.246 | -92.473 | -2.789 |
| A049 | 1.629 | -77.447 | -3.289 | A058 | -74.073 | -149.925 | -1.794 | A060 | -34.012 | -166.382 | -1.490 |
| A062 | -108.266 | -132.468 | -1.243 | A066 | -83.435 | 79.783 | -2.492 | A068 | -169.230 | 45.308 | -0.602 |
| A069 | -188.274 | -92.997 | -0.037 | A070 | 79.375 | -66.395 | -4.049 | A072 | 60.371 | 96.512 | -5.634 |
| A073 | -233.872 | -28.218 | 0.260 | A074 | 74.994 | -151.520 | -4.437 | A075 | -91.373 | 177.406 | -1.488 |
| A076 | -164.793 | -205.614 | 0.987 | A082 | 182.229 | -63.868 | -7.676 | A083 | -230.344 | 188.887 | 2.968 |
| A085 | 120.882 | 204.888 | -7.796 | A086 | -349.288 | -67.389 | 2.965 | A088 | -99.891 | 269.079 | -0.549 |
| A089 | -144.429 | -378.971 | 6.971 | A090 | 249.694 | 124.900 | -11.920 | A092 | 130.784 | -370.622 | -1.835 |
| A087 | 182.276 | -186.994 | -6.907 | A091 | -399.697 | 92.348 | -0.566 | A093 | 0.176 | 391.055 | -2.939 |
| A094 | -351.247 | -307.654 | -3.453 |  |  |  |  |  |  |  |  |

### C-5 (`rawdata/interf/alma/alma.cycle13.5.cfg`, sha256 f09287f27591..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A007 | -12.788 | -4.204 | -2.291 | A011 | 9.103 | -39.404 | -2.442 | A015 | -17.983 | 36.905 | -2.692 |
| A022 | -72.367 | 43.729 | -2.290 | A024 | -103.198 | 11.814 | -2.093 | A027 | -121.866 | -49.488 | -1.898 |
| A033 | -134.161 | -58.532 | -1.597 | A042 | -26.340 | -66.814 | -2.793 | A043 | -11.617 | -70.062 | -2.796 |
| A045 | -92.228 | -90.348 | -1.293 | A047 | -48.377 | -98.123 | -2.290 | A058 | -74.073 | -149.925 | -1.794 |
| A060 | -34.012 | -166.382 | -1.490 | A062 | -108.266 | -132.468 | -1.243 | A066 | -83.435 | 79.783 | -2.492 |
| A068 | -169.230 | 45.308 | -0.602 | A069 | -188.274 | -92.997 | -0.037 | A070 | 79.375 | -66.395 | -4.049 |
| A072 | 60.371 | 96.512 | -5.634 | A073 | -233.872 | -28.218 | 0.260 | A074 | 74.994 | -151.520 | -4.437 |
| A075 | -91.373 | 177.406 | -1.488 | A076 | -164.793 | -205.614 | 0.987 | A082 | 182.229 | -63.868 | -7.676 |
| A083 | -230.344 | 188.887 | 2.968 | A085 | 120.882 | 204.888 | -7.796 | A086 | -349.288 | -67.389 | 2.965 |
| A087 | 182.276 | -186.994 | -6.907 | A088 | -99.891 | 269.079 | -0.549 | A089 | -144.429 | -378.971 | 6.971 |
| A090 | 249.694 | 124.900 | -11.920 | A091 | -399.697 | 92.348 | -0.566 | A092 | 130.784 | -370.622 | -1.835 |
| A093 | 0.176 | 391.055 | -2.939 | A094 | -351.247 | -307.654 | -3.453 | A096 | -433.959 | 354.328 | -1.634 |
| A104 | -617.706 | 184.590 | -3.686 | A134 | -162.804 | -572.327 | 1.518 | A135 | 356.068 | 329.015 | -11.977 |
| A101 | -264.141 | 513.936 | 0.414 | A105 | 413.296 | -514.368 | -7.357 | A108 | 635.776 | 44.098 | -21.783 |
| A111 | 307.492 | 744.030 | -7.774 |  |  |  |  |  |  |  |  |

### C-6 (`rawdata/interf/alma/alma.cycle13.6.cfg`, sha256 b20fa619a518..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A007 | -12.788 | -4.204 | -2.291 | A015 | -17.983 | 36.905 | -2.692 | A027 | -121.866 | -49.488 | -1.898 |
| A042 | -26.340 | -66.814 | -2.793 | A043 | -11.617 | -70.062 | -2.796 | A060 | -34.012 | -166.382 | -1.490 |
| A066 | -83.435 | 79.783 | -2.492 | A068 | -169.230 | 45.308 | -0.602 | A069 | -188.274 | -92.997 | -0.037 |
| A070 | 79.375 | -66.395 | -4.049 | A072 | 60.371 | 96.512 | -5.634 | A073 | -233.872 | -28.218 | 0.260 |
| A074 | 74.994 | -151.520 | -4.437 | A075 | -91.373 | 177.406 | -1.488 | A076 | -164.793 | -205.614 | 0.987 |
| A082 | 182.229 | -63.868 | -7.676 | A083 | -230.344 | 188.887 | 2.968 | A085 | 120.882 | 204.888 | -7.796 |
| A086 | -349.288 | -67.389 | 2.965 | A087 | 182.276 | -186.994 | -6.907 | A088 | -99.891 | 269.079 | -0.549 |
| A089 | -144.429 | -378.971 | 6.971 | A090 | 249.694 | 124.900 | -11.920 | A091 | -399.697 | 92.348 | -0.566 |
| A092 | 130.784 | -370.622 | -1.835 | A093 | 0.176 | 391.055 | -2.939 | A094 | -351.247 | -307.654 | -3.453 |
| A096 | -433.959 | 354.328 | -1.634 | A101 | -264.141 | 513.936 | 0.414 | A104 | -617.706 | 184.590 | -3.686 |
| A105 | 413.296 | -514.368 | -7.357 | A108 | 635.776 | 44.098 | -21.783 | A110 | 157.920 | -853.890 | -8.571 |
| A111 | 307.492 | 744.030 | -7.774 | A115 | -204.627 | -951.074 | 2.471 | A116 | 710.006 | 614.315 | -22.732 |
| A122 | -1166.704 | 706.464 | -19.670 | A134 | -162.804 | -572.327 | 1.518 | A135 | 356.068 | 329.015 | -11.977 |
| A120 | -797.564 | -1030.195 | -12.257 | A121 | 1094.566 | 241.199 | -48.827 | A123 | 357.627 | -1265.621 | 13.742 |
| A128 | -153.078 | -1597.302 | -9.595 |  |  |  |  |  |  |  |  |

### C-7 (`rawdata/interf/alma/alma.cycle13.7.cfg`, sha256 a8abc0dce01b..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A007 | -12.788 | -4.204 | -2.291 | A027 | -121.866 | -49.488 | -1.898 | A042 | -26.340 | -66.814 | -2.793 |
| A072 | 60.371 | 96.512 | -5.634 | A074 | 74.994 | -151.520 | -4.437 | A075 | -91.373 | 177.406 | -1.488 |
| A076 | -164.793 | -205.614 | 0.987 | A082 | 182.229 | -63.868 | -7.676 | A083 | -230.344 | 188.887 | 2.968 |
| A085 | 120.882 | 204.888 | -7.796 | A086 | -349.288 | -67.389 | 2.965 | A087 | 182.276 | -186.994 | -6.907 |
| A088 | -99.891 | 269.079 | -0.549 | A089 | -144.429 | -378.971 | 6.971 | A090 | 249.694 | 124.900 | -11.920 |
| A091 | -399.697 | 92.348 | -0.566 | A092 | 130.784 | -370.622 | -1.835 | A093 | 0.176 | 391.055 | -2.939 |
| A094 | -351.247 | -307.654 | -3.453 | A096 | -433.959 | 354.328 | -1.634 | A101 | -264.141 | 513.936 | 0.414 |
| A104 | -617.706 | 184.590 | -3.686 | A105 | 413.296 | -514.368 | -7.357 | A108 | 635.776 | 44.098 | -21.783 |
| A110 | 157.920 | -853.890 | -8.571 | A111 | 307.492 | 744.030 | -7.774 | A115 | -204.627 | -951.074 | 2.471 |
| A116 | 710.006 | 614.315 | -22.732 | A120 | -797.564 | -1030.195 | -12.257 | A121 | 1094.566 | 241.199 | -48.827 |
| A122 | -1166.704 | 706.464 | -19.670 | A123 | 357.627 | -1265.621 | 13.742 | A124 | 419.522 | 1342.599 | -10.777 |
| A125 | -1304.573 | -737.200 | -34.520 | A126 | 1212.999 | -383.434 | -31.429 | A127 | -911.946 | 1236.181 | 8.138 |
| A128 | -153.078 | -1597.302 | -9.595 | A134 | -162.804 | -572.327 | 1.518 | A135 | 356.068 | 329.015 | -11.977 |
| A118 | 727.120 | -926.127 | 6.164 | A129 | 1116.337 | 1212.379 | -40.918 | A130 | -1729.222 | -124.176 | -29.433 |
| A132 | -481.207 | 2025.657 | 2.354 |  |  |  |  |  |  |  |  |

### C-8 (`rawdata/interf/alma/alma.cycle13.8.cfg`, sha256 5cb66fd35a36..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A027 | -121.866 | -49.488 | -1.898 | A074 | 74.994 | -151.520 | -4.437 | A082 | 182.229 | -63.868 | -7.676 |
| A083 | -230.344 | 188.887 | 2.968 | A087 | 182.276 | -186.994 | -6.907 | A089 | -144.429 | -378.971 | 6.971 |
| A090 | 249.694 | 124.900 | -11.920 | A091 | -399.697 | 92.348 | -0.566 | A092 | 130.784 | -370.622 | -1.835 |
| A093 | 0.176 | 391.055 | -2.939 | A094 | -351.247 | -307.654 | -3.453 | A096 | -433.959 | 354.328 | -1.634 |
| A101 | -264.141 | 513.936 | 0.414 | A104 | -617.706 | 184.590 | -3.686 | A105 | 413.296 | -514.368 | -7.357 |
| A108 | 635.776 | 44.098 | -21.783 | A110 | 157.920 | -853.890 | -8.571 | A111 | 307.492 | 744.030 | -7.774 |
| A115 | -204.627 | -951.074 | 2.471 | A116 | 710.006 | 614.315 | -22.732 | A118 | 727.120 | -926.127 | 6.164 |
| A120 | -797.564 | -1030.195 | -12.257 | A121 | 1094.566 | 241.199 | -48.827 | A122 | -1166.704 | 706.464 | -19.670 |
| A123 | 357.627 | -1265.621 | 13.742 | A124 | 419.522 | 1342.599 | -10.777 | A125 | -1304.573 | -737.200 | -34.520 |
| A126 | 1212.999 | -383.434 | -31.429 | A127 | -911.946 | 1236.181 | 8.138 | A128 | -153.078 | -1597.302 | -9.595 |
| A129 | 1116.337 | 1212.379 | -40.918 | A130 | -1729.222 | -124.176 | -29.433 | A131 | 1337.022 | -1193.221 | 26.671 |
| A132 | -481.207 | 2025.657 | 2.354 | A135 | 356.068 | 329.015 | -11.977 | W207 | -2836.604 | 2109.058 | -66.408 |
| W210 | -1224.581 | 3521.806 | 16.938 | P401 | 2252.060 | 2202.012 | -115.036 | A133 | -1203.842 | -1163.784 | -36.005 |
| S301 | 1662.325 | -2695.788 | -15.155 | S307 | 4734.308 | -1859.065 | -59.125 | P404 | 2943.808 | 2642.726 | -125.701 |
| P410 | 3662.610 | 5340.607 | -158.537 |  |  |  |  |  |  |  |  |

### C-9 (`rawdata/interf/alma/alma.cycle13.9.cfg`, sha256 337a7ea0e09f..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A074 | 74.994 | -151.520 | -4.437 | A094 | -351.247 | -307.654 | -3.453 | A101 | -264.141 | 513.936 | 0.414 |
| A104 | -617.706 | 184.590 | -3.686 | A105 | 413.296 | -514.368 | -7.357 | A108 | 635.776 | 44.098 | -21.783 |
| A110 | 157.920 | -853.890 | -8.571 | A111 | 307.492 | 744.030 | -7.774 | A115 | -204.627 | -951.074 | 2.471 |
| A116 | 710.006 | 614.315 | -22.732 | A118 | 727.120 | -926.127 | 6.164 | A120 | -797.564 | -1030.195 | -12.257 |
| A121 | 1094.566 | 241.199 | -48.827 | A122 | -1166.704 | 706.464 | -19.670 | A123 | 357.627 | -1265.621 | 13.742 |
| A124 | 419.522 | 1342.599 | -10.777 | A125 | -1304.573 | -737.200 | -34.520 | A126 | 1212.999 | -383.434 | -31.429 |
| A127 | -911.946 | 1236.181 | 8.138 | A128 | -153.078 | -1597.302 | -9.595 | A129 | 1116.337 | 1212.379 | -40.918 |
| A130 | -1729.222 | -124.176 | -29.433 | A131 | 1337.022 | -1193.221 | 26.671 | A132 | -481.207 | 2025.657 | 2.354 |
| A133 | -1203.842 | -1163.784 | -36.005 | A135 | 356.068 | 329.015 | -11.977 | W207 | -2836.604 | 2109.058 | -66.408 |
| W209 | -1737.688 | 4048.194 | -14.033 | W210 | -1224.581 | 3521.806 | 16.938 | S301 | 1662.325 | -2695.788 | -15.155 |
| S303 | 3310.845 | -5310.540 | -247.370 | S306 | 3902.314 | -1935.543 | -57.094 | S307 | 4734.308 | -1859.065 | -59.125 |
| P401 | 2252.060 | 2202.012 | -115.036 | P402 | 3652.953 | 2258.949 | -164.111 | P404 | 2943.808 | 2642.726 | -125.701 |
| P410 | 3662.610 | 5340.607 | -158.537 | P411 | 4839.296 | 6477.465 | -210.993 | W202 | -6516.530 | 1825.992 | -339.305 |
| S305 | 3478.681 | -6094.075 | -254.144 | S308 | 5353.661 | -5396.113 | -261.498 | P405 | 3759.639 | 2686.087 | -150.633 |
| P409 | 3799.038 | 4355.997 | -164.571 |  |  |  |  |  |  |  |  |

### C-10 (`rawdata/interf/alma/alma.cycle13.10.cfg`, sha256 5ec3e3084229..., 43 antennas)

| pad | e | n | u | pad | e | n | u | pad | e | n | u |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A122 | -1166.704 | 706.464 | -19.670 | A123 | 357.627 | -1265.621 | 13.742 | A124 | 419.522 | 1342.599 | -10.777 |
| A125 | -1304.573 | -737.200 | -34.520 | A126 | 1212.999 | -383.434 | -31.429 | A127 | -911.946 | 1236.181 | 8.138 |
| A128 | -153.078 | -1597.302 | -9.595 | A129 | 1116.337 | 1212.379 | -40.918 | A131 | 1337.022 | -1193.221 | 26.671 |
| A132 | -481.207 | 2025.657 | 2.354 | A133 | -1203.842 | -1163.784 | -36.005 | A134 | -162.804 | -572.327 | 1.518 |
| A135 | 356.068 | 329.015 | -11.977 | A136 | -615.410 | 267.696 | -3.474 | P401 | 2252.060 | 2202.012 | -115.036 |
| P402 | 3652.953 | 2258.949 | -164.111 | P403 | 3486.753 | 2617.905 | -140.798 | P404 | 2943.808 | 2642.726 | -125.701 |
| P406 | 3901.957 | 3230.032 | -160.910 | P407 | 4301.130 | 3535.905 | -198.374 | P408 | 4099.042 | 3842.302 | -182.126 |
| P409 | 3799.038 | 4355.997 | -164.571 | P410 | 3662.610 | 5340.607 | -158.537 | P411 | 4839.296 | 6477.465 | -210.993 |
| P412 | 5167.985 | 8264.028 | -199.174 | P413 | 6423.403 | 8583.133 | -246.005 | S301 | 1662.325 | -2695.788 | -15.155 |
| S302 | 2364.430 | -4299.446 | -180.733 | S303 | 3310.845 | -5310.540 | -247.370 | S304 | 3438.620 | -2123.362 | -103.586 |
| S305 | 3478.681 | -6094.075 | -254.144 | S306 | 3902.314 | -1935.543 | -57.094 | S307 | 4734.308 | -1859.065 | -59.125 |
| S308 | 5353.661 | -5396.113 | -261.498 | S309 | 6264.430 | -5737.666 | -286.301 | W201 | -7626.095 | 527.002 | -445.266 |
| W202 | -6516.530 | 1825.992 | -339.305 | W205 | -4446.707 | 1933.830 | -148.826 | W206 | -3101.552 | 2053.352 | -78.002 |
| W207 | -2836.604 | 2109.058 | -66.408 | W208 | -1987.483 | 4102.203 | -30.922 | W209 | -1737.688 | 4048.194 | -14.033 |
| W210 | -1224.581 | 3521.806 | 16.938 |  |  |  |  |  |  |  |  |

## Not found

- The 50-antenna pad lists of the operational C-1 ... C-10 configurations (PG/TH quote theta ranges for 50-antenna configurations; only the 43-antenna notional C43-X files are published in CASA and on the Science Portal).
- The exact track length / hour-angle range behind TH Table 7.3 (INFERRED here as about +/- 1 h by reproduction) and the simulation set-up behind the Cycle 13 theta_max / theta_min ranges.
- An official per-scan minimum observing elevation (track cut-off) for Cycle 13; the documents give only the transit-elevation floor (declination limit +47 deg = 20 deg) and shadowing guidance. The hardware 2-125 deg range is from the 2001 project book, not a current document.
- A Cycle 13 statement of the hardware azimuth range or slew rates (only the 2001 PB4 azimuth +/- 270 deg).
- An "array centre" defined as such: the TH lat/lon is "the array location"; the cfg LOC origin is the CASA observatory position, 696.5 m north of it.
- The WSU first-science cycle (WSU page and TH give no date).
- The meaning of the X, Y, Z columns (1761.87, -4307.63, -1977.71 m) of the CASA Observatories ALMA row.

## Conflicts

- Minimum baseline: 15.05 m between pads in the cfg (C-1 ... C-4) vs 14.6 m in TH Table 7.3 vs "15 m" in PG Table A-2 and TH Sec. 2.1. Table 7.3 baselines are projected (zenith-transit source); projecting over +/- 1 h gives 14.65 m (matches).
- C-8, C-9, C-10 minimum baseline: cfg 113.0, 375.5, 256.1 m (3-D) vs TH Table 7.3 110.4, 367.6, 244.0 m and PG Lmin 110, 368, 244 m; the projection over +/- 1 h gives 109.6, 362.4, 244.4 m (C-8, C-10 agree; C-9 differs by 1.4%).
- Angular resolution: TH Eq. 7.4 (0.574 lambda/L80) with the Table 7.3 L80 reproduces the Cycle 13 theta_max only for C-1 (3.31" vs 3.31" at 100 GHz); for C-2 ... C-10 it gives beams 12-24% finer than the tabulated theta_min (e.g. C-10: 0.0409" vs theta_min 0.051", theta_max 0.057"). The Cycle 13 table (new presentation, PG Sec. 1.3) describes the 50-antenna operational configurations (TH Table 7.1 caption), not the C43-X cfg files; Eq. 7.6 does reproduce the MRS table (within 1.0%).
- MRS: TH Eq. 7.6 0.983 lambda/L5 (used for PG/TH Tables A-2/7.2) vs Primer "0.6 x (wavelength/minimum baseline)".
- Bandwidth: TH 7.5 GHz per polarization (4 x 1.875 GHz usable) vs Primer "16 GHz (2 polarizations x 4 basebands x 2 GHz/baseband)" (nominal 2 GHz basebands, both polarizations).
- Site: TH lat -23.02917, lon -67.754649 vs PG -23.029, -67.755 (rounded) vs the CASA LOC origin -23.022886, -67.754929 (696.5 m further north). Altitude 5000 m (TH, PG; rounded) vs 5056.8 m (CASA WGS84 height).
- Current-configuration dates: PG Table 3 has C-2 from 2026 October 20; the Science Portal schedule (fetched 2026-10-20) has C-3 through block 4 (to 2026-10-26) and C-2 from 25-Oct-2026. The portal block table lists "beam 1.4"" for C-3 at 100 GHz vs PG theta_max/theta_min 2.39"/1.91".

## Notes

- For uv tracks: e, n, u of the antennas are a rigid frame at lat -23.02917 deg; baseline (dE, dN, dU) -> equatorial X = -sin(lat) dN + cos(lat) dU, Y = dE, Z = cos(lat) dN + sin(lat) dU, then the usual (u, v, w) rotation by hour angle and declination (standard; the reproduction of TH Table 7.3 above used exactly this).
- TH Eq. 7.6 (theta_MRS ~ 0.983 lambda / L5) with the Table 7.3 L05 reproduces the TH Table 7.2 / PG Table A-2 MRS values within 1.0% (e.g. C-1: 28.4" vs 28.5" at 100 GHz); Eq. 7.4 does not reproduce the Cycle 13 resolution ranges (Conflicts).
- Primary beam: FWHM = 1.13 lambda / D (12 m: 58" at 100 GHz, 19.4" at 300 GHz); CASA models it as an Airy pattern scaled to that FWHM; effective blockage 0.75 m.
- Peak sidelobe levels (TH Table 7.5, 1-hour observation at Dec -23 deg, notional C43-X) are a validation target for the dirty beam (Briggs 0.5: 6-11%).
- Downloaded but not cited (searched for an elevation range / limits; nothing usable): not_cited/Mangum2006_PASP118_1257_ALMA_prototype_antennas_astro-ph0609329v1.pdf (Mangum et al. 2006, PASP 118, 1257 (arXiv astro-ph/0609329v1): searched for an elevation range; none stated); not_cited/Beasley2006_ALMA_overview_astro-ph0606376v1.pdf (Beasley, Murowinski, Tarenghi 2006 (arXiv astro-ph/0606376v1): no antenna range of motion); not_cited/WoottenThompson2009_ProcIEEE_ALMA_arXiv0904.3739v1.pdf (Wootten & Thompson 2009, Proc. IEEE (arXiv 0904.3739v1): no antenna range of motion); not_cited/ATNF_RadioSchool2001_alma.pdf (ATNF Radio School 2001 ALMA slides: no range of motion); not_cited/ALMA_webOT_Reference_Manual_Cycle13.pdf (Cycle 13 web-OT Reference Manual: no elevation limit value); not_cited/ALMA_webOT_UserManual_Cycle13.pdf (Cycle 13 web-OT User Manual: no elevation limit value); not_cited/help_almascience_kb_index.html (ALMA Helpdesk knowledgebase index (article 402 URL redirected to the index)); not_cited/almascience_news.html (Science Portal news page (served an old news list; nothing on Cycle 14)); not_cited/almascience_cycle13_*.view.html (Science Portal item pages used to locate the OT manuals and the Primer).
