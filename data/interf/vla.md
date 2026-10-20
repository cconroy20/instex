# Interferometer: Karl G. Jansky Very Large Array (VLA) -- configurations A-D, site, resolution tables, bands, elevation limits

Compiled 2026-10-20 for the instex INTERFEROMETER mode, in the record format of `data/telescopes/vlt.md`. Every number comes from a document saved unmodified under `rawdata/interf/vla/`; each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **NOT FOUND** marks a gap. 94 quotes machine-checked against the saved files' extracted text (pdftotext -layout and -raw for the PDF; tag-stripped text and entity-decoded source for HTML; cfg and JSON files as is): all pass; 108 table cells of OSSR Table 3.1.1 and OSSB Table 3.3.1 re-parsed from the saved HTML: all match; the four antenna lists match their cfg files (2026-10-20). Normalisation: Unicode NFKC; curly quotes, primes, dashes, minus, multiplication sign (to x), tilde operator and soft hyphens normalised; table-cell separators | dropped; whitespace collapsed; a quote also passes against the text with PDF line-end hyphenation closed up, or with all whitespace removed; " ... " joins non-adjacent pieces. HTML is checked against tag-stripped text (sub/superscripts flattened, e.g. "θ PB = 42/ν GHz") and the entity-decoded source. Companion machine-readable file: `data/interf/vla.json`.

## Completeness summary

**Antenna positions (A, B, C, D; 27 each)**: CASA simulator files vla.a/b/c/d.cfg (CFGA-D), geocentric XYZ in metres ("coordsys=XYZ"; no datum or reference position stated), 25 m diameter column, pad names only (no antenna IDs). Converted to local e, n, u (DERIVED) about the origin of the NRAO station table (PADS, "array center as origin"), which a 4-parameter fit locates in the cfg frame at XYZ = (-1601185.365, -5041977.547, 3554875.870) m = WGS84 34.0788133 N, -107.6183337 E, h = 2114.89 m. Cross-check with PADS: same pad membership in all four configurations; 2.0 mm rms / 6.0 mm max residual over all 72 pads (INFERRED: the same survey).

**Baselines (DERIVED from the cfg)**: Bmax A 36623.09 / B 11128.04 / C 3387.47 / D 1031.20 m vs OSS 36.4 / 11.1 / 3.4 / 1.03 km (agree within 0.6%). Bmin A 793.39 / B 243.12 / C 78.04 (44.82 with N1) / D 39.99 m vs OSS 680 / 210 / 35.5 / 35 m: the OSS values are 12-21% lower (55% in C without N1); method NOT FOUND.

**Site**: latitude 34 04 43.497 N, longitude 107 37 03.819 W (PUB; latitude also OGW); elevation 2100 m (OSSI, rounded). **Dish** 25 m (PUB, cfg). **Elevation limit** 8 deg hard lower limit (OGV, OGL). **OSS 2027A Table 3.1.1** beam FWHM and LAS per band per configuration with notes (uniform weighting, 12 h, near-zenith source, dec -15 to +75). **Primary beam** theta_PB = 42/nu_GHz arcmin (1-50 GHz), 50/nu_GHz at P. **Bands** 4, P, L, S, C, X, Ku, K, Ka, Q with nominal edges (OSSB) and per-polarization default bandwidths (OSSP, OSSW).

## Sources

| key | document | local file | URL |
|---|---|---|---|
| CFGA | CASA data repository casa-data (NRAO open-bitbucket, project CASA), alma/simmos/vla.a.cfg, branch master: CASA simulator antenna file for VLA A configuration (header "# observatory=VLA", "# coordsys=XYZ"; columns x y z diam pad). Single commit 1b0506edc78 (2017-03-08, "subversion revision 11005"; see CASAH). Served as a Git-LFS object whose storage id equals the SHA-256 of the saved file (e958cbdf...). Fetched 2026-10-20 | `rawdata/interf/vla/vla.a.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/vla.a.cfg?at=refs%2Fheads%2Fmaster |
| CFGB | As CFGA, alma/simmos/vla.b.cfg (B configuration; SHA-256 b58863c1...) | `rawdata/interf/vla/vla.b.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/vla.b.cfg?at=refs%2Fheads%2Fmaster |
| CFGC | As CFGA, alma/simmos/vla.c.cfg (C configuration; SHA-256 29e58dec...) | `rawdata/interf/vla/vla.c.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/vla.c.cfg?at=refs%2Fheads%2Fmaster |
| CFGD | As CFGA, alma/simmos/vla.d.cfg (D configuration; SHA-256 91fd52e1...) | `rawdata/interf/vla/vla.d.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/vla.d.cfg?at=refs%2Fheads%2Fmaster |
| CASAH | Bitbucket REST commit history of each cfg file (casa-data, master): one commit each, 1b0506edc78eea6cb086aabbb5636b8db1657fd1, author timestamp 2017-03-08, message "subversion revision 11005" (the files predate the git migration; their original date is not recorded). Fetched 2026-10-20 | `rawdata/interf/vla/casa-data_commits_vla.a.cfg.json (and .b, .c, .d)` | https://open-bitbucket.nrao.edu/rest/api/1.0/projects/CASA/repos/casa-data/commits?path=alma/simmos/vla.a.cfg&limit=5&until=refs%2Fheads%2Fmaster |
| PADS | NRAO, "An Introduction to the NRAO Very Large Array" (the VLA "Green Book"), Chapter 1 "The Basic Instrument", Tables 1-4, 1-5, 1-6 "Station Positions for the Southwest / Southeast / North Arm" (book pp. 18-20; 3-page extract, PDF title "green.dvi", created 2015-06-05). This is the "stations position file" linked from the current OSS introduction (OSSI); hosted under the oss2026a directory. Columns: station name, configuration marks A B C D, Lx Ly Lz (ns) "with array center as origin", R (m). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss2026a_ant_positions.pdf` | https://science.nrao.edu/facilities/vla/docs/manuals/oss2026a/files/ant_positions.pdf |
| OSSI | NRAO, VLA Observational Status Summary 2027A (current OSS), Introduction: purpose, overview of the VLA. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_intro.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss |
| OSSR | NRAO, VLA OSS 2027A, Performance > Resolution: Table 3.1.1 "Configuration Properties" (Bmax, Bmin, synthesized beamwidth theta_HPBW, largest angular scale theta_LAS) and its notes 1-5. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_performance_resolution.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/performance/resolution |
| OSSF | NRAO, VLA OSS 2027A, Performance > Field of View: Primary Beam (theta_PB relation). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_performance_fov.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/performance/fov |
| OSSB | NRAO, VLA OSS 2027A, Performance > VLA Frequency Bands and Tunability: Table 3.3.1 "Default frequencies for continuum applications" (band names, nominal band edges, default IF-pair tunings) and notes 1-4. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_performance_vla-frequency-bands-and-tunability.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/performance/vla-frequency-bands-and-tunability |
| OSSP | NRAO, VLA OSS 2027A, Offered VLA Capabilities during the Next Semester: Summary of Capabilities and the GO capability table (8-bit and 3-bit default bandwidths per band). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_proposing.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/proposing |
| OSSW | NRAO, VLA OSS 2027A, WIDAR Correlator (total bandwidth per polarization for 8-bit and 3-bit setups). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_widar.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/widar |
| OSSPF | NRAO, VLA OSS 2027A, Performance of the VLA during the Next Semester (single page holding all performance sections; used for the Sensitivity > Pointing paragraph). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_performance.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/performance |
| OSSS | NRAO, VLA OSS 2027A, Performance > Shadowing and Cross-Talk. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_performance_shadowing.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/performance/shadowing |
| OSSSN | NRAO, VLA OSS 2027A, Performance > Snapshots. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_oss_performance_snapshots.html` | https://science.nrao.edu/facilities/vla/docs/manuals/oss/performance/snapshots |
| OGV | NRAO, Guide to Observing with the VLA, Presubmission Checklists > SB Validation (Static Report Tab: Elevation Limits). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_obsguide_presubmission-checklists_validation-process.html` | https://science.nrao.edu/facilities/vla/docs/manuals/obsguide/presubmission-checklists/validation-process |
| OGL | NRAO, Guide to Observing with the VLA, Observing Modes > VLBI (Practicalities: minimum and maximum VLA elevation). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_obsguide_modes_vlbi.html` | https://science.nrao.edu/facilities/vla/docs/manuals/obsguide/modes/vlbi |
| OGW | NRAO, Guide to Observing with the VLA, Dynamic Scheduling > Antenna Wraps (latitude of the VLA). Fetched 2026-10-20 | `rawdata/interf/vla/nrao_obsguide_dynsched_antenna-wraps.html` | https://science.nrao.edu/facilities/vla/docs/manuals/obsguide/dynsched/antenna-wraps |
| OGS | NRAO, Guide to Observing with the VLA, Dynamic Scheduling > Antenna Shadowing. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_obsguide_dynsched_antenna-shadowing.html` | https://science.nrao.edu/facilities/vla/docs/manuals/obsguide/dynsched/antenna-shadowing |
| PUB | NRAO public web site, "Very Large Array" telescope page, fact table (number of antennas, dish size, latitude, longitude, configuration sizes); page metadata modified 2023-03-24. Fetched 2026-10-20 | `rawdata/interf/vla/nrao_public_telescopes_vla.html` | https://public.nrao.edu/telescopes/vla/ |

## Site and array

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| site_name | Plains of San Agustin, southwestern New Mexico; 27-element array on the arms of an upside-down Y |  | OSSI, Overview of the VLA | "The Karl G. Jansky Very Large Array (VLA) is a 27–element interferometric array, arranged along the arms of an upside-down Y"<br>ALT: located on the Plains of San Agustin (OSSI, Overview of the VLA: "The VLA is located at an elevation of 2100 meters on the Plains of San Agustin in southwestern New Mexico") |
| lat_deg | 34.078749167 | deg (N positive) | PUB, fact table, Latitude | "34°04'43.497" North"<br>DERIVED: 34 + 4/60 + 43.497/3600 = 34.078749167 deg<br>ALT: 34°04'43.497" (same) (OGW, Antenna Wraps, near-zenith wrap paragraph: "34.1° (34°04′43.497′′) Declination (latitude of the VLA)")<br>ALT (DERIVED, CFG + PADS fit): WGS84 geodetic latitude of the PADS origin ("array center") located in the CFG XYZ frame by the 4-parameter fit (see configs notes): 34.0788133 deg |
| lon_deg | -107.6177275 | deg (E positive; West negative) | PUB, fact table, Longitude | "107°37'03.819" West"<br>DERIVED: -(107 + 37/60 + 3.819/3600) = -107.617727500 deg<br>ALT (DERIVED, CFG + PADS fit): WGS84 geodetic longitude of the PADS origin in the CFG XYZ frame: -107.6183337 deg (also the fitted rotation angle of the PADS frame about Z: -107.6183337 deg) |
| elev_m | 2100 | m (above sea level, rounded) | OSSI, Overview of the VLA | "The VLA is located at an elevation of 2100 meters on the Plains of San Agustin in southwestern New Mexico"<br>ALT (DERIVED, CFG + PADS fit): WGS84 ELLIPSOIDAL height of the PADS origin in the CFG XYZ frame: 2114.89 m (not a height above sea level; the geoid separation is NOT FOUND in the saved sources) |
| dish_m | 25.0 | m | PUB, fact table, Dish size | "25 meters"<br>ALT: 25.0 (CFGA, column 4 (diam) of every pad row (all four files): "-1601614.061201 -5042001.676547 3554652.455603 25. W08") |
| n_antennas | 27 |  | OSSI, Overview of the VLA | "is a 27–element interferometric array"<br>ALT: 28 (27 active and 1 spare) (PUB, fact table, Number of antennas: "28 (27 active and 1 spare)") |
| config_scale_ratios | 1 : 3.28 : 10.8 : 35.5 (D : C : B : A) |  | OSSI, Overview of the VLA | "There are four basic antenna arrangements, called configurations, whose scales vary by the ratios 1 : 3.28 : 10.8 : 35.5 from smallest to largest. These configurations are denoted D , C , B , and A , respectively." |
| oss_version | VLA Observational Status Summary 2027A |  | OSSI, page heading and Purpose of Document | "This Observational Status Summary (OSS) summarizes the instrumental status of the Karl G. Jansky Very Large Array (VLA) for the D-configuration, for the observing period November 12 2027 through February 21 2028 (Semester 2027B), and should be used when preparing proposals for the 29 July 2026 deadline." |

## Coordinate frames and conversion

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| cfg_coordsys | XYZ (geocentric Cartesian, metres); no datum, epoch or reference position stated |  | CFGA, header lines 1-2 (identical in CFGB, CFGC, CFGD) | "# observatory=VLA # coordsys=XYZ" |
| cfg_history | single git commit 1b0506edc78 (2017-03-08) importing subversion revision 11005 |  | CASAH, values[0].id / message | ""id":"1b0506edc78eea6cb086aabbb5636b8db1657fd1" ... "message":"subversion revision 11005"" |
| pads_frame | Lx, Ly, Lz in nanoseconds with the array center as origin; R in metres |  | PADS, Tables 1-4 to 1-6 column headings, pp. 18-20 | "Coordinates with array center as origin"<br>ALT: column heads (PADS, Table 1-4 heading: "Lx (ns) Ly (ns) Lz (ns) R(m)") |
| pads_table_title | An Introduction to the NRAO Very Large Array, Chapter 1, Tables 1-4 to 1-6 |  | PADS, page headers | "An Introduction to the NRAO Very Large Array"<br>ALT: SW arm table (PADS, p. 18: "Station Positions for the Southwest Arm")<br>ALT: SE arm table (PADS, p. 19: "Station Positions for the Southeast Arm")<br>ALT: N arm table (PADS, p. 20: "Station Positions for the North Arm") |
| pad_file_pointer | antenna positions: the OSS points to the stations position file (PADS) |  | OSSI, Overview of the VLA | "For details about antenna positions in the various configurations we refer to the stations position file" |

- Reference point (DERIVED): origin of the NRAO station table PADS ("array center as origin"), located in the CASA XYZ frame by a least-squares fit of XYZ_cfg = C0 + Rz(theta) * c * (Lx, Ly, Lz) over all 72 pads (4 free parameters: C0 and theta; c = 0.299792458 m/ns, no scale term).
  - Result: C0 = (-1601185.365, -5041977.547, 3554875.870) m; theta = -107.61833368 deg; WGS84 lat0 = 34.07881334 deg, lon0 = -107.61833368 deg, h = 2114.890 m; residuals 2.0 mm rms, 6.0 mm max (E72), 72 pads.
- ENU conversion (DERIVED; INFERRED frame): DERIVED: e = -sin(lon0) dX + cos(lon0) dY; n = -sin(lat0) cos(lon0) dX - sin(lat0) sin(lon0) dY + cos(lat0) dZ; u = cos(lat0) cos(lon0) dX + cos(lat0) sin(lon0) dY + sin(lat0) dZ, with (dX, dY, dZ) = XYZ_cfg - C0 and (lat0, lon0) the WGS84 geodetic latitude/longitude of C0 (a = 6378137 m, 1/f = 298.257223563). INFERRED: the cfg XYZ is an Earth-centred Earth-fixed frame compatible with WGS84 (the header states only coordsys=XYZ). Local tangent plane at C0: u includes the Earth-curvature drop of distant pads.
- Equatorial baseline frame for Earth-rotation synthesis: For Earth-rotation synthesis the baseline frame of PADS is X_eq = -sin(lat0) n + cos(lat0) u, Y_eq = e, Z_eq = cos(lat0) n + sin(lat0) u (X_eq in the meridian plane toward the equator, Y_eq east, Z_eq toward the north celestial pole). INFERRED frame definition (PADS does not define Lx, Ly, Lz); supported by the fit: the rotation angle about Z equals lon0 to 1e-8 deg and residuals are mm-level.

### Cross-check: CASA cfg vs NRAO station table (PADS), all 72 pads

| pad | configs (PADS marks) | PADS R (m) | cfg distance from C0 (m, DERIVED) | fit residual (mm, DERIVED) |
|---|---|---|---|---|
| W1 | D | 39.95 | 39.952 | 0.1 |
| W2 | CD | 44.79 | 44.787 | 0.1 |
| W3 | D | 89.83 | 89.832 | 0.1 |
| W4 | BCD | 147.19 | 147.186 | 0.1 |
| W5 | D | 216.18 | 216.181 | 0.1 |
| W6 | CD | 295.51 | 295.511 | 0.1 |
| W7 | D | 384.93 | 384.930 | 0.1 |
| W8 | ABCD | 484.02 | 484.021 | 0.1 |
| W9 | D | 592.39 | 592.393 | 0.1 |
| W10 | C | 709.81 | 709.814 | 0.2 |
| W12 | BC | 970.49 | 970.490 | 0.2 |
| W14 | C | 1264.29 | 1264.293 | 0.3 |
| W16 | ABC | 1589.80 | 1589.807 | 3.2 |
| W18 | C | 1946.02 | 1946.017 | 0.5 |
| W20 | B | 2331.63 | 2331.631 | 0.6 |
| W24 | AB | 3188.05 | 3188.051 | 0.9 |
| W28 | B | 4153.44 | 4153.442 | 1.1 |
| W32 | AB | 5222.88 | 5222.883 | 1.5 |
| W36 | B | 6392.71 | 6392.711 | 1.8 |
| W40 | A | 7659.49 | 7659.496 | 2.1 |
| W48 | A | 10473.00 | 10473.004 | 3.0 |
| W56 | A | 13643.97 | 13643.971 | 3.9 |
| W64 | A | 17157.45 | 17157.459 | 4.9 |
| W72 | A | 21000.19 | 21000.193 | 6.0 |
| E1 | D | 79.96 | 79.961 | 0.1 |
| E2 | CD | 44.85 | 44.851 | 0.1 |
| E3 | D | 89.94 | 89.936 | 0.1 |
| E4 | BCD | 147.44 | 147.439 | 0.1 |
| E5 | D | 216.07 | 216.070 | 0.1 |
| E6 | CD | 295.42 | 295.420 | 0.1 |
| E7 | D | 384.93 | 384.934 | 0.1 |
| E8 | ABCD | 484.02 | 484.017 | 0.1 |
| E9 | D | 592.38 | 592.379 | 0.2 |
| E10 | C | 709.79 | 709.794 | 0.2 |
| E12 | BC | 970.21 | 970.211 | 0.3 |
| E14 | C | 1264.33 | 1264.332 | 0.3 |
| E16 | ABC | 1589.92 | 1589.925 | 0.4 |
| E18 | C | 1946.03 | 1946.026 | 0.5 |
| E20 | B | 2331.68 | 2331.676 | 0.6 |
| E24 | AB | 3188.13 | 3188.130 | 0.9 |
| E28 | B | 4153.44 | 4153.446 | 1.2 |
| E32 | AB | 5222.93 | 5222.934 | 1.5 |
| E36 | B | 6392.82 | 6392.819 | 1.8 |
| E40 | A | 7659.65 | 7659.651 | 2.2 |
| E48 | A | 10472.93 | 10472.929 | 3.0 |
| E56 | A | 13644.00 | 13644.003 | 3.9 |
| E64 | A | 17157.37 | 17157.378 | 4.9 |
| E72 | A | 20999.45 | 20999.452 | 6.0 |
| N1 | D | 0.84 | 0.845 | 0.1 |
| N2 | CD | 54.91 | 54.906 | 0.1 |
| N3 | D | 94.90 | 94.898 | 0.1 |
| N4 | BCD | 134.89 | 134.888 | 0.1 |
| N5 | D | 194.86 | 194.863 | 0.1 |
| N6 | CD | 266.41 | 266.409 | 0.1 |
| N7 | D | 347.07 | 347.072 | 0.2 |
| N8 | ABCD | 436.37 | 436.375 | 0.2 |
| N9 | D | 534.19 | 534.190 | 0.2 |
| N10 | C | 640.03 | 640.027 | 0.3 |
| N12 | BC | 875.11 | 875.105 | 0.3 |
| N14 | C | 1140.07 | 1140.070 | 0.4 |
| N16 | ABC | 1433.62 | 1433.616 | 0.5 |
| N18 | C | 1754.71 | 1754.714 | 0.6 |
| N20 | B | 2102.44 | 2102.438 | 0.7 |
| N24 | AB | 2974.68 | 2974.685 | 0.9 |
| N28 | B | 3745.05 | 3745.051 | 1.1 |
| N32 | AB | 4709.44 | 4709.445 | 1.4 |
| N36 | B | 5764.25 | 5764.256 | 1.7 |
| N40 | A | 6906.45 | 6906.455 | 2.0 |
| N48 | A | 9443.50 | 9443.499 | 2.8 |
| N56 | A | 12302.77 | 12302.772 | 3.6 |
| N64 | A | 15470.70 | 15470.700 | 4.5 |
| N72 | A | 18935.62 | 18935.629 | 5.5 |

## Configurations: baselines vs the OSS

| config | n | Bmax cfg (m, DERIVED; pair) | Bmax OSS (m) | cfg/OSS | Bmin cfg (m, DERIVED; pair) | Bmin OSS (m) | OSS/cfg | PUB size (m, DERIVED from miles) |
|---|---|---|---|---|---|---|---|---|
| A | 27 | 36623.09 (W72-E72) | 36400 | 1.0061 | 793.39 (W08-N08) | 680.0 | 0.8571 | 36403.4 |
| B | 27 | 11128.04 (W36-E36) | 11100 | 1.0025 | 243.12 (W04-N04) | 210.0 | 0.8638 | 11394.2 |
| C | 27 | 3387.47 (W18-E18) | 3400 | 0.9963 | 78.04 (W02-E02) | 35.5 | 0.4549 | 3395.7 |
| D | 27 | 1031.20 (W09-E09) | 1030 | 1.0012 | 39.99 (W01-N01) | 35.0 | 0.8752 | 1030.0 |

C with N1 occupied: OSSR note 5: in C an antenna from the middle of the north arm is moved to pad N1; the cfg file does not include this (no N01 in vla.c.cfg). Which north-arm pad is vacated is NOT FOUND. DERIVED: with N1 occupied (N1 position from vla.d.cfg), Bmin = 44.82 m (W02-N01) whichever north pad is vacated; Bmax unchanged 3387.47 m.

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| bmax_km | {"A": 36.4, "B": 11.1, "C": 3.4, "D": 1.03} | km | OSSR, Table 3.1.1, row Bmax | "B max (km 1 ) \| 36.4 \| 11.1 \| 3.4 \| 1.03" |
| bmin_km | {"A": 0.68, "B": 0.21, "C": 0.0355, "D": 0.035} | km | OSSR, Table 3.1.1, row Bmin | "B min (km 1 ) \| 0.68 \| 0.21 \| 0.0355 \| 0.035" |
| bmax_bmin_definition | Bmax/Bmin = maximum/minimum antenna separation |  | OSSR, Table 3.1.1 note 1 | "B max is the maximum antenna separation, B min is the minimum antenna separation, θ HPBW is the synthesized beam width (FWHM), and θ LAS is the largest angular scale structure visible to the array." |
| c_config_N1 | In C an antenna from the middle of the north arm sits on the central pad N1 |  | OSSR, Table 3.1.1 note 5 | "For the C configuration, an antenna from the middle of the north arm is moved to the central pad N1. This results in improved imaging for extended objects, but may slightly degrade snapshot performance. Note that although the minimum spacing is the same as in D configuration" |
| config_size_public | {"A": {"miles": 22.62, "km": 36.403}, "B": {"miles": 7.08, "km": 11.394}, "C": {"miles": 2.11, "km": 3.396}, "D": {"miles": 0.64, "km": 1.03}} | miles across (km DERIVED) | PUB, fact table, A/B/C/D configuration size | "A configuration size \| 22.62 miles across \| B configuration size \| 7.08 miles across \| C configuration size \| 2.11 miles across \| D configuration size \| 0.64 miles across"<br>DERIVED: km = miles x 1.609344: A 36.403, B 11.394, C 3.396, D 1.030 |

### A configuration (CFGA; header "# observatory=VLA", "# coordsys=XYZ"; positions DERIVED)

| name = pad | e (m) | n (m) | u (m) |
|---|---|---|---|
| W08 | -401.284 | -270.640 | 1.334 |
| W16 | -1317.993 | -889.031 | 2.031 |
| W24 | -2642.995 | -1782.746 | 7.831 |
| W32 | -4329.943 | -2920.631 | 4.214 |
| W40 | -6350.014 | -4283.126 | -6.083 |
| W48 | -8682.490 | -5856.460 | -7.393 |
| W56 | -11311.499 | -7629.387 | -19.330 |
| W64 | -14224.344 | -9594.029 | -32.231 |
| W72 | -17410.200 | -11742.669 | -52.585 |
| E08 | 438.695 | -204.497 | -0.195 |
| E16 | 1440.998 | -671.853 | 0.619 |
| E24 | 2889.460 | -1347.233 | 12.444 |
| E32 | 4733.628 | -2207.127 | 19.932 |
| E40 | 6942.068 | -3236.843 | 28.051 |
| E48 | 9491.930 | -4425.511 | 19.305 |
| E56 | 12366.077 | -5765.308 | 13.829 |
| E64 | 15550.464 | -7249.692 | 25.333 |
| E72 | 19090.283 | -8748.444 | -53.287 |
| N08 | -38.038 | 434.714 | -0.026 |
| N16 | -124.978 | 1428.157 | -1.400 |
| N24 | -259.369 | 2963.356 | -0.078 |
| N32 | -410.659 | 4691.507 | -0.367 |
| N40 | -602.292 | 6880.143 | 0.596 |
| N48 | -823.557 | 9407.520 | 0.075 |
| N56 | -1072.928 | 12255.897 | -4.260 |
| N64 | -1349.249 | 15411.749 | -7.752 |
| N72 | -1651.464 | 18863.474 | -9.204 |

### B configuration (CFGB; header "# observatory=VLA", "# coordsys=XYZ"; positions DERIVED)

| name = pad | e (m) | n (m) | u (m) |
|---|---|---|---|
| W04 | -122.034 | -82.284 | 0.976 |
| W08 | -401.284 | -270.640 | 1.334 |
| W12 | -804.571 | -542.687 | 2.519 |
| W16 | -1317.993 | -889.031 | 2.031 |
| W20 | -1932.978 | -1303.874 | 3.294 |
| W24 | -2642.995 | -1782.746 | 7.831 |
| W28 | -3443.309 | -2322.578 | 18.135 |
| W32 | -4329.943 | -2920.631 | 4.214 |
| W36 | -5299.784 | -3574.777 | -3.631 |
| E04 | 133.639 | -62.276 | 0.855 |
| E08 | 438.695 | -204.497 | -0.195 |
| E12 | 879.295 | -410.060 | -0.377 |
| E16 | 1440.998 | -671.853 | 0.619 |
| E20 | 2113.244 | -985.302 | 9.654 |
| E24 | 2889.460 | -1347.233 | 12.444 |
| E28 | 3764.330 | -1755.162 | 18.334 |
| E32 | 4733.628 | -2207.127 | 19.932 |
| E36 | 5793.902 | -2701.520 | 25.128 |
| N04 | -11.737 | 134.375 | 0.567 |
| N08 | -38.038 | 434.714 | -0.026 |
| N12 | -76.288 | 871.773 | -0.972 |
| N16 | -124.978 | 1428.157 | -1.400 |
| N20 | -183.290 | 2094.433 | -0.902 |
| N24 | -259.369 | 2963.356 | -0.078 |
| N28 | -326.564 | 3730.786 | -1.211 |
| N32 | -410.659 | 4691.507 | -0.367 |
| N36 | -502.947 | 5742.272 | 0.014 |

### C configuration (CFGC; header "# observatory=VLA", "# coordsys=XYZ"; positions DERIVED)

| name = pad | e (m) | n (m) | u (m) |
|---|---|---|---|
| W02 | -37.135 | -25.021 | 0.914 |
| W04 | -122.034 | -82.284 | 0.976 |
| W06 | -244.996 | -165.233 | 1.132 |
| W08 | -401.284 | -270.640 | 1.334 |
| W10 | -588.457 | -396.927 | 1.895 |
| W12 | -804.571 | -542.687 | 2.519 |
| W14 | -1048.135 | -706.997 | 2.506 |
| W16 | -1317.993 | -889.031 | 2.031 |
| W18 | -1613.286 | -1088.250 | 2.391 |
| E02 | 40.667 | -18.897 | 0.865 |
| E04 | 133.639 | -62.276 | 0.855 |
| E06 | 267.763 | -124.801 | 0.868 |
| E08 | 438.695 | -204.497 | -0.195 |
| E10 | 643.316 | -299.919 | -0.825 |
| E12 | 879.295 | -410.060 | -0.377 |
| E14 | 1145.912 | -534.248 | 0.403 |
| E16 | 1440.998 | -671.853 | 0.619 |
| E18 | 1763.730 | -822.349 | 3.979 |
| N02 | -4.776 | 54.693 | 0.719 |
| N04 | -11.737 | 134.375 | 0.567 |
| N06 | -23.213 | 265.395 | 0.297 |
| N08 | -38.038 | 434.714 | -0.026 |
| N10 | -55.779 | 637.591 | -0.470 |
| N12 | -76.288 | 871.773 | -0.972 |
| N14 | -99.387 | 1135.729 | -1.345 |
| N16 | -124.978 | 1428.157 | -1.400 |
| N18 | -152.981 | 1748.032 | -1.469 |

### D configuration (CFGD; header "# observatory=VLA", "# coordsys=XYZ"; positions DERIVED)

| name = pad | e (m) | n (m) | u (m) |
|---|---|---|---|
| W01 | 3.499 | -39.789 | 0.840 |
| W02 | -37.135 | -25.021 | 0.914 |
| W03 | -74.486 | -50.207 | 0.948 |
| W04 | -122.034 | -82.284 | 0.976 |
| W05 | -179.228 | -120.873 | 1.053 |
| W06 | -244.996 | -165.233 | 1.132 |
| W07 | -319.126 | -215.239 | 1.232 |
| W08 | -401.284 | -270.640 | 1.334 |
| W09 | -491.117 | -331.258 | 1.439 |
| E01 | 6.994 | -79.650 | 0.865 |
| E02 | 40.667 | -18.897 | 0.865 |
| E03 | 81.529 | -37.958 | 0.877 |
| E04 | 133.639 | -62.276 | 0.855 |
| E05 | 195.845 | -91.268 | 0.881 |
| E06 | 267.763 | -124.801 | 0.868 |
| E07 | 348.887 | -162.640 | 0.472 |
| E08 | 438.695 | -204.497 | -0.195 |
| E09 | 536.895 | -250.310 | -0.745 |
| N01 | 0.015 | 0.048 | 0.843 |
| N02 | -4.776 | 54.693 | 0.719 |
| N03 | -8.262 | 94.536 | 0.646 |
| N04 | -11.737 | 134.375 | 0.567 |
| N05 | -16.986 | 194.120 | 0.414 |
| N06 | -23.213 | 265.395 | 0.297 |
| N07 | -30.249 | 345.751 | 0.149 |
| N08 | -38.038 | 434.714 | -0.026 |
| N09 | -46.627 | 532.151 | -0.277 |

## OSS Table 3.1.1: synthesized beam and largest angular scale (OSSR)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| beam_table_heading | Synthesized Beamwidth theta_HPBW (arcsec), notes 1,2,3 |  | OSSR, Table 3.1.1 sub-heading | "Synthesized Beamwidth θ HPBW (arcsec) 1,2,3" |
| beam_footnotes | uniform weighting, untapered, full 12 h synthesis, source passing near the zenith; valid for -15 < dec < +75 deg; natural ~1.5x, snapshot ~1.3x |  | OSSR, Table 3.1.1, text below the table and notes 2-3 | "These estimates of the synthesized beamwidth are for a uniformly weighted, untapered map produced from a full 12 hour synthesis observation of a source which passes near the zenith."<br>ALT: declination range (OSSR, note 2: "The listed resolutions are appropriate for sources with declinations between −15 and +75 degrees.")<br>ALT: natural weighting / snapshots (OSSR, note 3: "The approximate resolution for a naturally weighted map is about 1.5 times the numbers listed for θ HPBW . The values for snapshots are about 1.3 times the listed values.")<br>ALT: central frequency of each band (OSSR, paragraph above Table 3.1.1: "the approximate synthesized beam size (full width at half-power; the resolution element) for the central frequency for each band, and the largest angular scale of detectable emission.") |
| las_table_heading | Largest Angular Scale theta_LAS (arcsec), notes 1,4 |  | OSSR, Table 3.1.1 sub-heading | "Largest Angular Scale θ LAS (arcsec) 1,4" |
| las_footnotes | LAS = largest structure imaged reasonably well in a full synthesis; divide by 2 for a single snapshot |  | OSSR, Table 3.1.1 note 4 | "The largest angular scale structure is that which can be imaged reasonably well in full synthesis observations. For single snapshot observations, the quoted numbers should be divided by two." |
| resolution_lambda_over_B | diffraction limit theta ~ lambda/Bmax |  | OSSR, Resolution, first paragraph | "For emission structures smaller than the diffraction limit (θ ∼ λ/B max ), the VLA acts like a single-dish instrument" |
| snapshot_sidelobes | snapshot synthesized beam has high sidelobes |  | OSSSN, Snapshots, second paragraph | "Note that because the snapshot synthesized beam contains high sidelobes, the effects of background confusing sources are much worse than for full syntheses" |

| band (row label) | A | B | C | D | verbatim row (OSSR Table 3.1.1) |
|---|---|---|---|---|---|
| theta_HPBW (arcsec) 74 MHz (4) | 24 | 80 | 260 | 850 | "74 MHz (4) \| 24 \| 80 \| 260 \| 850" |
| theta_HPBW (arcsec) 350 MHz (P) | 5.6 | 18.5 | 60 | 200 | "350 MHz (P) \| 5.6 \| 18.5 \| 60 \| 200" |
| theta_HPBW (arcsec) 1.5 GHz (L) | 1.3 | 4.3 | 14 | 46 | "1.5 GHz (L) \| 1.3 \| 4.3 \| 14 \| 46" |
| theta_HPBW (arcsec) 3.0 GHz (S) | 0.65 | 2.1 | 7.0 | 23 | "3.0 GHz (S) \| 0.65 \| 2.1 \| 7.0 \| 23" |
| theta_HPBW (arcsec) 6.0 GHz (C) | 0.33 | 1.0 | 3.5 | 12 | "6.0 GHz (C) \| 0.33 \| 1.0 \| 3.5 \| 12" |
| theta_HPBW (arcsec) 10 GHz (X) | 0.2 | 0.6 | 2.1 | 7.2 | "10 GHz (X) \| 0.20 \| 0.60 \| 2.1 \| 7.2" |
| theta_HPBW (arcsec) 15 GHz (Ku) | 0.13 | 0.42 | 1.4 | 4.6 | "15 GHz (Ku) \| 0.13 \| 0.42 \| 1.4 \| 4.6" |
| theta_HPBW (arcsec) 22 GHz (K) | 0.089 | 0.28 | 0.95 | 3.1 | "22 GHz (K) \| 0.089 \| 0.28 \| 0.95 \| 3.1" |
| theta_HPBW (arcsec) 33 GHz (Ka) | 0.059 | 0.19 | 0.63 | 2.1 | "33 GHz (Ka) \| 0.059 \| 0.19 \| 0.63 \| 2.1" |
| theta_HPBW (arcsec) 45 GHz (Q) | 0.043 | 0.14 | 0.47 | 1.5 | "45 GHz (Q) \| 0.043 \| 0.14 \| 0.47 \| 1.5" |

| band (row label) | A | B | C | D | verbatim row (OSSR Table 3.1.1) |
|---|---|---|---|---|---|
| theta_LAS (arcsec) 74 MHz (4) | 800 | 2200 | 20000 | 20000 | "74 MHz (4) \| 800 \| 2200 \| 20000 \| 20000" |
| theta_LAS (arcsec) 350 MHz (P) | 155 | 515 | 4150 | 4150 | "350 MHz (P) \| 155 \| 515 \| 4150 \| 4150" |
| theta_LAS (arcsec) 1.5 GHz (L) | 36 | 120 | 970 | 970 | "1.5 GHz (L) \| 36 \| 120 \| 970 \| 970" |
| theta_LAS (arcsec) 3.0 GHz (S) | 18 | 58 | 490 | 490 | "3.0 GHz (S) \| 18 \| 58 \| 490 \| 490" |
| theta_LAS (arcsec) 6.0 GHz (C) | 8.9 | 29 | 240 | 240 | "6.0 GHz (C) \| 8.9 \| 29 \| 240 \| 240" |
| theta_LAS (arcsec) 10 GHz (X) | 5.3 | 17 | 145 | 145 | "10 GHz (X) \| 5.3 \| 17 \| 145 \| 145" |
| theta_LAS (arcsec) 15 GHz (Ku) | 3.6 | 12 | 97 | 97 | "15 GHz (Ku) \| 3.6 \| 12 \| 97 \| 97" |
| theta_LAS (arcsec) 22 GHz (K) | 2.4 | 7.9 | 66 | 66 | "22 GHz (K) \| 2.4 \| 7.9 \| 66 \| 66" |
| theta_LAS (arcsec) 33 GHz (Ka) | 1.6 | 5.3 | 44 | 44 | "33 GHz (Ka) \| 1.6 \| 5.3 \| 44 \| 44" |
| theta_LAS (arcsec) 45 GHz (Q) | 1.2 | 3.9 | 32 | 32 | "45 GHz (Q) \| 1.2 \| 3.9 \| 32 \| 32" |

DERIVED: Beam table: theta_HPBW x Bmax(OSS) / lambda = 1.045 to 1.199 over all 40 cells (DERIVED); LAS x Bmin(OSS) / lambda = 0.58-0.65 (A), 0.55-0.61 (B), 0.83-0.85 (C), 0.82-0.84 (D) (DERIVED). C and D share the LAS row values.

## Primary beam

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pb_relation | theta_PB [arcmin] = 42 / nu[GHz] (1-50 GHz, L- through Q-band); 50 / nu[GHz] at P-band | arcmin FWHM | OSSF, Field of View > Primary Beam | "An approximate formula for the full width at half power in arcminutes is θ PB = 42/ν GHz for frequencies between 1 and 50 GHz (L- through Q-band). At P-band the approximate value is θ PB = 50/ν GHz ." |

## Bands (OSSB Table 3.3.1 edges; OSSP default bandwidth per polarization)

| band | wavelength label | lo (GHz) | hi (GHz) | bw (GHz) | mode | range quote (OSSB) | bandwidth quote (OSSP) |
|---|---|---|---|---|---|---|---|
| 4 | 4 m | 0.054 | 0.084 | 0.012 | 8-bit default, Stokes I only (3 x 4 MHz); system under development | "4 m (4) \| 0.054 – 0.084 2" | "12 MHz bandwidth Stokes I continuum observations only* at 4-band (3 x 4 MHz subbands)" |
| P | 90 cm | 0.2 | 0.5 | 0.256 | 8-bit default (16 x 16 MHz covering 224-480 MHz) | "90 cm (P) \| 0.20 – 0.50 3" | "256 MHz bandwidth continuum observations at P-band (16 × 16 MHz subbands)" |
| L | 20 cm | 1.0 | 2.0 | 1.0 | 8-bit (16 x 64 MHz) | "20 cm (L) \| 1.0 – 2.0 4" | "1 GHz bandwidth continuum observations at L-band (16 × 64 MHz subbands)" |
| S | 13 cm | 2.0 | 4.0 | 2.0 | 8-bit (3-bit not available at S) | "13 cm (S) \| 2.0 – 4.0" | "2 GHz bandwidth continuum observations at S/C/X/Ku/K/Ka/Q bands (16 × 128 MHz subbands)" |
| C | 6 cm | 4.0 | 8.0 | 4.0 | 3-bit | "6 cm (C) \| 4.0 – 8.0" | "4 GHz bandwidth at C/X-bands" |
| X | 3 cm | 8.0 | 12.0 | 4.0 | 3-bit | "3 cm (X) \| 8.0 – 12.0" | "4 GHz bandwidth at C/X-bands" |
| Ku | 2 cm | 12.0 | 18.0 | 6.0 | 3-bit | "2 cm (Ku) \| 12.0 – 18.0" | "6 GHz bandwidth at Ku-band" |
| K | 1.3 cm | 18.0 | 26.5 | 8.0 | 3-bit | "1.3 cm (K) \| 18.0 – 26.5" | "8 GHz bandwidth continuum observations at K/Ka/Q-bands" |
| Ka | 1 cm | 26.5 | 40.0 | 8.0 | 3-bit | "1 cm (Ka) \| 26.5 – 40.0" | "8 GHz bandwidth continuum observations at K/Ka/Q-bands" |
| Q | 0.7 cm | 40.0 | 50.0 | 8.0 | 3-bit | "0.7 cm (Q) \| 40.0 – 50.0" | "8 GHz bandwidth continuum observations at K/Ka/Q-bands" |

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| band_edges_note | Table 3.3.1 Range = nominal band edges |  | OSSB, Table 3.3.1 note 1 | "Listed here are the nominal band edges. For all bands, the receivers can be tuned to frequencies outside this range, but at the cost of diminished performance." |
| band_4_dev | 4-band system under development; default 12 MHz |  | OSSB, Table 3.3.1 note 2 | "The 4-band system is currently under development. The default frequency range maximizes sensitivity of the system and provides a nominal bandwidth of 12 MHz and a channel resolution of 64 kHz." |
| band_P_default | P default: 16 x 16 MHz covering 224-480 MHz |  | OSSB, Table 3.3.1 note 3 | "The default setup for P-band will provide 16 subbands from the A0/C0 IF pair, each 16 MHz wide, to cover the frequency range 224–480 MHz." |
| bw_8bit | 8-bit: 2 GHz per polarization (1 GHz at L, 256 MHz at P) | per polarization | OSSW, WIDAR Correlator | "8-bit wideband setups are available for all observing bands, providing a total of 2 GHz of bandwidth per polarization (1 GHz per polarization at L-band, and 256 MHz per polarization at P-band)." |
| bw_3bit | 3-bit (bands above S): 4 GHz C/X, 6 GHz Ku, 8 GHz K/Ka/Q per polarization | per polarization | OSSW, WIDAR Correlator | "3-bit setups are available for all bands above S-band, providing total bandwidths per polarization of 4 GHz (C/X-bands), 6 GHz (Ku-band), or 8 GHz (K/Ka/Q-bands)." |
| bands_summary_capabilities | continuous 1-50 GHz in L..Q; P 224-480 MHz and 4-band 54-86 MHz receivers near prime focus |  | OSSP, Summary of Capabilities | "the VLA offers continuous frequency coverage from 1–50 GHz in the following observing bands: 1–2 GHz (L-band); 2–4 GHz (S-band); 4–8 GHz (C-band); 8–12 GHz (X-band); 12–18 GHz (Ku-band); 18–26.5 GHz (K-band); 26.5–40 GHz (Ka-band); and 40–50 GHz (Q-band)."<br>ALT: P and 4-band receivers (OSSP, Summary of Capabilities: "all VLA antennas are equipped with 224–480 MHz (P-band) and 54–86 MHz (4-band) receivers near the prime focus.") |

## Elevation limits and shadowing

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| elev_limit_deg | 8 | deg (hard lower limit) | OGV, Static Report Tab > Elevation Limits | "The VLA's hard lower elevation limit is 8°."<br>ALT: 8 deg min; 125 deg max with over-the-top motion (not default) (OGL, Practicalities: "The minimum VLA elevation is 8°. The maximum VLA elevation is 125° if over-the-top antenna motion is allowed by the observer. However, such antenna motion is not normally recommended and not the default.") |
| elev_recommended | {"below_15GHz_min": 10, "below_15GHz_max": 85, "S_band_min": 20, "above_15GHz_min": 30, "above_15GHz_max": 80} | deg | OGV, Static Report Tab > Elevation Limits | "High frequency (> 15 GHz) observing: avoid elevations < 30° (if possible) and > 80° (required). Low frequency (< 15 GHz) observing: avoid elevations < 10° (recommended) and > 85°. S-band (2-4 GHz) observing: avoid elevations < 20° (recommended to avoid ground spill-over)."<br>ALT: > 80 deg elevation: tracking difficult (OSSPF, Sensitivity > Pointing: "At source elevations greater than 80 degrees (zenith angle < 10 degrees), source tracking becomes difficult") |
| shadowing | D and C at low elevation are commonly shadowed; for at most one shadowed antenna use el > 40 deg (D), > 25 deg (C); max elevation = dec + 56 deg |  | OGS, Antenna Shadowing | "Therefore, to guarantee no more than a single shadowed antenna, restrict the elevations, if possible, to >40° for D-configuration and >25° for C-configuration."<br>DERIVED: max elevation = 90 - (lat - dec) = dec + 55.92 deg for lat 34.0787 deg, i.e. the guide's "Declination plus 56"<br>ALT: dec + 56 (OGS, Antenna Shadowing: "Note that the maximum elevation (in degrees) for your target is its Declination plus 56°")<br>ALT: OSS statement (OSSS, Shadowing and Cross-Talk: "Observations at low elevation in the C and D configurations will commonly be affected by shadowing.") |

## Not found

- Antenna identities (ea01-ea28) on each pad: the cfg files list pads only; antennas are named by pad here.
- Which north-arm pad is vacated when an antenna moves to N1 in C configuration (OSSR note 5); the CASA C file has no N1 (configs.C.with_N1_variant gives the DERIVED effect).
- How the OSS Bmax and Bmin are computed (3-D pad separation, projected separation, which pad list or survey); OSSR gives only "maximum/minimum antenna separation".
- Datum, frame realisation and epoch of the CASA cfg XYZ, and any reference position for the cfg files (header gives only "coordsys=XYZ"); the survey date of the pad coordinates in either PADS or the cfg files.
- A definition of the PADS Lx, Ly, Lz axes in the saved 3-page extract (the frame used here is INFERRED from the fit: Lz along the Earth axis, Lx in the meridian plane of the array center, Ly east).
- A precise array-centre height above sea level (OSSI gives 2100 m, rounded) and the geoid separation; the datum of the NRAO public latitude/longitude and which point it designates.
- The antenna diameter stated in the OSS pages themselves (25 m is from PUB and the cfg diam column).
- Any 4-band bandwidth beyond the 12 MHz default (the 4-band system is "under development", OSSB note 2).

## Conflicts

- Bmin: cfg 3-D minimum pad separations A 793.39 m (W08-N08), B 243.12 m (W04-N04), C 78.04 m (W02-E02; 44.82 m with N1 occupied), D 39.99 m (W01-N01) vs OSSR 680, 210, 35.5, 35 m; OSS lower by 14.3%, 13.6%, 54.5% (20.8% vs the N1 variant), 12.5%. The horizontal (e,n) separations are the same to 0.01 m, so a vertical offset does not explain it; the OSS method is NOT FOUND.
- Bmax: cfg A 36623.09 m (W72-E72), B 11128.04 m, C 3387.47 m, D 1031.20 m vs OSSR 36400, 11100, 3400, 1030 m (cfg +0.61%, +0.25%, -0.37%, +0.12%); PUB configuration sizes 22.62, 7.08, 2.11, 0.64 miles = 36403, 11394, 3396, 1030 m DERIVED (B 2.4% above the cfg).
- Site: the PUB latitude/longitude (34 04 43.497 N, 107 37 03.819 W) lies 56.0 m east and 7.1 m south of the PADS origin as located in the cfg frame on WGS84 (34.0788133 N, -107.6183337 E); cause (datum or a different reference point) NOT FOUND. Immaterial for uv tracks (latitude differs by 0.23 arcsec).
- Height: 2100 m above sea level (OSSI, rounded) vs 2114.89 m WGS84 ellipsoidal height DERIVED for the PADS origin (different quantities; geoid separation NOT FOUND).
- Band edges: 4-band 0.054-0.084 GHz (OSSB Table 3.3.1) vs 54-86 MHz receivers (OSSP); P-band 0.20-0.50 GHz nominal edges (OSSB) vs 224-480 MHz receivers (OSSP; the OSSB P default also covers 224-480 MHz).
- OSS label: the page heading is "VLA Observational Status Summary 2027A" while its purpose sentence names Semester 2027B (12 Nov 2027 - 21 Feb 2028, D configuration) and the 29 July 2026 deadline (quoted as printed).

## Notes

- Positions: e, n, u in metres in the local tangent plane at the PADS origin ("array center"), DERIVED from the CASA cfg XYZ (geometry.enu_conversion). For Earth-rotation synthesis use geometry.equatorial_from_enu with lat0 = 34.0788133 deg; this reproduces the NRAO PADS Lx, Ly, Lz (x c) to 6.0 mm worst case (E72).
- Cross-check CASA cfg vs NRAO PADS: all 72 pads; configuration membership marks of PADS Tables 1-4 to 1-6 equal the cfg pad lists for A, B, C and D (27 each); after the 4-parameter fit (translation + rotation about Z, no scale) the residuals are 2.0 mm rms, 6.0 mm max (E72), comparable to the 0.01 ns (3 mm) rounding of the PADS coordinates. PADS R(m) equals |L| x 0.299792458 m/ns to 5 mm (so ns = light-nanoseconds). INFERRED: the two files carry the same pad survey, so the agreement confirms the transcription and frame, not the survey itself.
- Configuration scale: cfg Bmax ratios D:C:B:A = 1 : 3.285 : 10.791 : 35.515 vs OSSI 1 : 3.28 : 10.8 : 35.5 (agree to the rounding).
- Beam table: theta_HPBW x Bmax(OSS) / lambda = 1.045 to 1.199 over all 40 cells (DERIVED); LAS x Bmin(OSS) / lambda = 0.58-0.65 (A), 0.55-0.61 (B), 0.83-0.85 (C), 0.82-0.84 (D) (DERIVED). C and D share the LAS row values.
- Pads: D uses W1-W9, E1-E9, N1-N9; C the even pads 2-18; B pads 4, 8, 12, ..., 36; A pads 8, 16, ..., 72 on each arm. Pad N1 is 0.84 m from the PADS origin (PADS R = 0.84 m), almost entirely vertical (u = 0.843 m), i.e. the PADS origin lies 0.84 m below the N1 pad position and within 5 cm of it horizontally.
- u (up) spans -53.3 to 28.1 m in A (Earth curvature and terrain); keep it for w-terms or when converting to the equatorial frame.
- Elevation: hard lower limit 8 deg (OGV, OGL); recommended minima 10 deg below 15 GHz, 20 deg at S-band, 30 deg above 15 GHz; avoid > 80 deg above 15 GHz (required) and > 85 deg below; over-the-top to 125 deg possible but not default. Shadowing: at most one antenna shadowed for el > 40 deg (D), > 25 deg (C).
- Bandwidth: bands[].bw_GHz is per polarization for the GO default setups. The nominal band width hi - lo (DERIVED) exceeds it at 4 (0.030 vs 0.012 GHz), P (0.30 vs 0.256), K (8.5 vs 8), Ka (13.5 vs 8) and Q (10 vs 8), and equals it at L, S, C, X and Ku.

## Machine check

94 quotes machine-checked against the saved files' extracted text (pdftotext -layout and -raw for the PDF; tag-stripped text and entity-decoded source for HTML; cfg and JSON files as is): all pass; 108 table cells of OSSR Table 3.1.1 and OSSB Table 3.3.1 re-parsed from the saved HTML: all match; the four antenna lists match their cfg files (2026-10-20). Script kept outside the repository (/private/tmp/claude-501/-Users-cconroy-memos/604f8c8c-8c13-422b-815a-7d85a29a1a3e/scratchpad/vla_agent/check.py, with strip.py, analyze.py, build.py, finish.py); it walks every src + quote pair in vla.json, re-parses the OSSR and OSSB HTML tables cell by cell against beam_table, las_table, the published Bmax/Bmin and the band edges, and compares each configuration's antenna list with its cfg file.
