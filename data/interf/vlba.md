# Interferometer: Very Long Baseline Array (VLBA) -- ten stations by geodetic position, bands, SEFDs, primary beam, elevation limits

Compiled 2026-11-16 for the instex INTERFEROMETER mode, in the record format of `data/interf/vla.md`. All numbers come from documents saved unmodified under `rawdata/interf/vlba/`; each value carries a source key, a location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **NOT FOUND** marks a gap. 144 quote records (135 distinct quotes) machine-checked against the saved files' extracted text (pdftotext -layout and -raw for the PDF; tag-stripped text and entity-decoded source for HTML; the cfg, dat and JSON files as is): all pass; 396 table cells and values (OSSS Table 4.1, OSSB Tables 5.1-5.2, OSSR Tables 8.1-8.2, both OSSD tables, the CFG rows and the SCHEDS horizon masks and AX2LIM) re-parsed from the saved files: all match (2026-11-16). Normalization: Unicode NFKC; curly quotes, primes, dashes, minus, multiplication sign (to x), tilde operator and soft hyphens normalized; table-cell separators | dropped; whitespace collapsed; a quote also passes with PDF line-end hyphenation closed up or with all whitespace removed; " ... " joins non-adjacent pieces. HTML is checked against tag-stripped text (MathJax source kept, superscripts flattened, e.g. "10 -4") and the entity-decoded source; the cfg, dat and JSON files as is. Machine-readable twin: `data/interf/vlba.json`.

## Superseded by the audit of 2026-11-16 (data/audit/2026-11-16_X_arrays.md)

- The visibility check reproduces 45 of the 49 cells within 0.2 h (validate_int; this record had said 46). The OSS counts a station "visible" above 3° and above its horizon ("A source is considered \"visible\" from a station when it has an elevation of at least 3 degrees and is above the local horizon"), so the check tests the masks and positions, not the page's 10° limit.
- The primary beam is one measurement at 1.38 GHz (Middelberg et al. 2013), scaled as 1/ν; the other receivers' feeds light the dish differently (now stated). PROP: below 1 GHz and above 40 GHz the practical limit is closer to 20° (now in the elNote). The 8 h default is the OSS's total on-source integration time.

## Completeness summary

**Stations (10)**: geodetic latitude, longitude and height from the VLBA OSS 2027A Table 4.1 (OSSS, WGS84); geocentric X, Y, Z from CASA `vlba.cfg` (CFG). Converting CFG to WGS84 reproduces Table 4.1 to 0.2-1.7 m horizontally and 0.5 m in height, and CFG agrees with the dated GSFC 2016a ITRF2014 solution in the SCHED locations file (SCHEDL) to 1.8-5.9 cm. Dish 25 m at all ten stations (OSSI, OSSSP, CFG).

**Baselines (DERIVED from CFG)**: longest SC-MK 8611.6 km, shortest LA-PT 236.6 km; all 45 equal OSS Table 8.1 truncated to the km.

**Bands**: ten receivers (OSSB Table 5.1): P 0.312-0.342, 610 0.596-0.626, L 1.35-1.75, S 2.2-2.4, C 3.9-7.9, X 8.0-8.8, U 12.0-15.4, K 21.7-24.1, Q 41.0-45.0, W 80-90 GHz; W at eight stations (not SC, HN; INFERRED). Recording 4 Gbps = 1024 MHz polarization-summed (OSSC), 512 MHz per polarization (DERIVED) from C band up; 2 Gbps or less at P, 610, L, S.

**Sensitivity**: typical zenith SEFD per band, a mean over all ten antennas (OSSB Table 5.1): 210 Jy (C, 6 cm) to 1181 Jy (Q) from L to Q band, 2742-2744 Jy at P and 610, 6350 Jy at W; per-station SEFD only at 86 GHz (Table 5.2: 3800-13000 Jy).

**Primary beam**: no OSS relation (NOT FOUND); measured Gaussian FWHM 29.13 arcmin at 1.3825 GHz (MID13, refereed), i.e. 40.3 arcmin / nu(GHz) = 0.977 lambda/D (DERIVED; 1/nu scaling INFERRED). **Resolution**: theta_HPBW ~ 2063 lambda_cm / B_km mas; 22 mas (90 cm) to 0.12 mas (3 mm) (OSSR Table 8.2).

**Elevation**: practical limit 10 deg (OSSD, PROP), 20 deg recommended (and below 1 GHz or above 40 GHz); mechanical 2.25 deg (SCHEDS AX2LIM) with per-station horizon masks up to 16 deg (SCHEDS). **Track length**: no typical value published (NOT FOUND); Table 5.1 image noise assumes 8 h on source; OSSD tabulates hours visible from N stations for southern sources, which the positions and masks reproduce (46 of 49 cells within 0.2 h).

## Sources

| key | document | local file | URL |
|---|---|---|---|
| CFG | CASA data repository casa-data (NRAO open Bitbucket, project CASA), alma/simmos/vlba.cfg, branch master: CASA simulator antenna file for the VLBA (header "# observatory=VLBA", "# coordsys=XYZ"; columns x y z diam station; 10 rows). Single commit 1b0506edc78 (2017-03-08, "subversion revision 11005"; see CASAH). Served as a Git-LFS object whose storage id equals the SHA-256 of the saved file (0972424c...). Fetched 2026-11-16 | `rawdata/interf/vlba/vlba.cfg` | https://open-bitbucket.nrao.edu/projects/CASA/repos/casa-data/raw/alma/simmos/vlba.cfg?at=refs%2Fheads%2Fmaster |
| CASAH | Bitbucket REST commit history of alma/simmos/vlba.cfg (casa-data, master): one commit, 1b0506edc78eea6cb086aabbb5636b8db1657fd1, author timestamp 1489013602000 ms = 2017-03-08, message "subversion revision 11005" (the file predates the git migration). Fetched 2026-11-16 | `rawdata/interf/vlba/casa-data_commits_vlba.cfg.json` | https://open-bitbucket.nrao.edu/rest/api/1.0/projects/CASA/repos/casa-data/commits?path=alma/simmos/vlba.cfg&limit=5&until=refs%2Fheads%2Fmaster |
| OSSI | NRAO, VLBA Observational Status Summary 2027A (current OSS), Introduction (ten 25-m antennas, ten observing bands). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_intro.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss |
| OSSS | NRAO, VLBA OSS 2027A, Antenna Sites: Table 4.1 "Geographic Locations of VLBA Stations" (WGS84 latitude, west longitude, elevation, code) and Table 4.2 (HSA telescopes). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_sites.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/sites |
| OSSB | NRAO, VLBA OSS 2027A, Frequency Bands & Performance: Table 5.1 "Receiver Frequency Ranges & Performance" (as of June 2020: band designations, nominal ranges, typical zenith SEFD, peak gain, baseline and image sensitivity, notes a-l) and Table 5.2 "Performance Parameters at 86.2 GHz" (per station, updated Oct 2023). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_bands-perf.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/bands-perf |
| OSSD | NRAO, VLBA OSS 2027A, VLBA Declination Limits (per-station horizon / 10-deg / 20-deg declination limits; hours visible vs number of stations for southern declinations). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_vlba-declination-limits.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/vlba-declination-limits |
| OSSR | NRAO, VLBA OSS 2027A, Angular Resolution & u-v Coverage: theta_HPBW ~ 2063 lambda_cm / B_max,km mas; Table 8.1 "Maximum VLBI Baseline Lengths in km"; Table 8.2 theta_HPBW per band. Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_ang-res.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/ang-res |
| OSSSP | NRAO, VLBA OSS 2027A, Station Signal Processing (single page with subsections: Primary Signal Path, RDBE PFB/DDC, recording): 25-m reflector, slew rates, 2-bit sampling, data rates. Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_sig-proc.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/sig-proc |
| OSSC | NRAO, VLBA OSS 2027A, Offered Capabilities during the Next Semester (GO capability table: 4 Gbps, 1024 MHz polarization-summed bandwidth; 2 Gbps limit for the low bands). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_offered-vlba-capabilities-during-the-next-semester.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/offered-vlba-capabilities-during-the-next-semester |
| OSSBS | NRAO, VLBA OSS 2027A, Baseline Sensitivity (Delta S formula; eta_s = 0.8 used in Table 5.1). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_bsln-sens.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/bsln-sens |
| OSSIS | NRAO, VLBA OSS 2027A, Image Sensitivity (Delta I_m formula for a homogeneous array, natural weighting). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_imag-sens.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/imag-sens |
| OSSCOR | NRAO, VLBA OSS 2027A, DiFX Correlator (single page with subsections, including Multiple Phase Centers: VLBI field of view vs the primary beam). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_oss_correlator.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/oss/correlator |
| PROP | NRAO, Guide to Proposing for the VLBA (and HSA/Global VLBI), "Reference manual: all pages" (practical elevation limits, data-channel bandwidths). Fetched 2026-11-16 | `rawdata/interf/vlba/nrao_vlba_propvlba_referencemanual-all-pages.html` | https://science.nrao.edu/facilities/vlba/docs/manuals/propvlba/referencemanual-all-pages |
| SCHEDS | NRAO SCHED station catalog stations_RDBE.dat (VERSION = "2018Sep07-20:14:11"): per-station mount, slew limits AX1LIM/AX2LIM (deg), slew rates, horizon masks HOR_AZ/HOR_EL. Plain text; fetched 2026-11-16 | `rawdata/interf/vlba/sched_stations_RDBE.dat` | https://www.aoc.nrao.edu/software/sched/catalogs/stations_RDBE.dat |
| SCHEDL | NRAO SCHED station locations file locations.dat (VERSION = "2018Sep07-20:14:11"; VLBA entries from the GSFC VLBI Analysis Center 2016a solution, ITRF2014, epoch 2014 Jan 1 = MJD 56658, with velocities). Plain text; fetched 2026-11-16 | `rawdata/interf/vlba/sched_locations.dat` | https://www.aoc.nrao.edu/software/sched/catalogs/locations.dat |
| MID13 | Middelberg, E., Deller, A., Norris, R., et al. 2013, A&A, 551, A97 (ADS 2013A&A...551A..97M), "Mosaiced wide-field VLBI observations of the Lockman Hole/XMM" (arXiv:1212.4605, accepted manuscript): Sec. 3.4, measured VLBA primary beam at 1.382 GHz (Gaussian FWHM, Airy effective diameter) and Table 3 beam squint | `rawdata/interf/vlba/Middelberg2013_arXiv1212.4605.pdf` | https://arxiv.org/pdf/1212.4605 |

## Stations (machine-readable: `stations`)

Latitude, longitude (east positive) and height from OSSS Table 4.1; X, Y, Z from CFG; el_min = mechanical lower limit (SCHEDS AX2LIM); mask_max = highest point of the SCHEDS horizon mask; SEFD_86 from OSSB Table 5.2 (blank: no 3-mm receiver).

| code | location | lat (deg) | lon (deg) | h (m) | X (m) | Y (m) | Z (m) | dish (m) | el_min (deg) | mask_max (deg) | SEFD_86 (Jy) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SC | Saint Croix, VI | 17.75657778 | -64.58363056 | -15 | 2607848.63826 | -5488069.53418 | 1932739.72987 | 25 | 2.25 | 16 |  |
| HN | Hancock, NH | 42.93360833 | -71.98658056 | 296 | 1446374.86586 | -4447939.67658 | 4322306.18183 | 25 | 2.25 | 7 |  |
| NL | North Liberty, IA | 41.77142500 | -91.57413333 | 222 | -130872.49872 | -4762317.09239 | 4226850.99907 | 25 | 2.25 | 8 | 10000 |
| FD | Fort Davis, TX | 30.63503056 | -103.94481667 | 1606 | -1324009.32663 | -5332181.95376 | 3231962.39174 | 25 | 2.25 | 7 | 4000 |
| LA | Los Alamos, NM | 35.77512500 | -106.24559722 | 1962 | -1449752.58400 | -4975298.57508 | 3709123.84314 | 25 | 2.25 | 4 | 4000 |
| PT | Pie Town, NM | 34.30100278 | -108.11918333 | 2365 | -1640953.93873 | -5014816.02309 | 3575411.78866 | 25 | 2.25 | 4 | 6000 |
| KP | Kitt Peak, AZ | 31.95630556 | -111.61242222 | 1902 | -1995678.84079 | -5037317.69586 | 3357328.02239 | 25 | 2.25 | 9 | 4500 |
| OV | Owens Valley, CA | 37.23165278 | -118.27704722 | 1196 | -2409150.40224 | -4478573.11743 | 3838617.33644 | 25 | 2.25 | 15 | 3800 |
| BR | Brewster, WA | 48.13122778 | -119.68327778 | 250 | -2112065.20630 | -3705356.50379 | 4726813.67330 | 25 | 2.25 | 6 | 5500 |
| MK | Mauna Kea, HI | 19.80138056 | -155.45550278 | 3763 | -5464075.18481 | -2495248.10362 | 2148297.36237 | 25 | 2.25 | 14 | 13000 |

### Row quotes and cross-checks (DERIVED columns: CFG converted to WGS84; offset of the OSSS point from the CFG point in local east, north, up; |CFG - GSFC|)

| code | OSSS Table 4.1 row | CFG row | GSFC (SCHEDL) | SCHEDS mount line | CFG -> WGS84 | OSSS - CFG (e, n, u; m) | CFG - GSFC (m) |
|---|---|---|---|---|---|---|---|
| SC | "Saint Croix, VI \| 17:45:23.68 \| 64:35:01.07 \| -15 \| SC" | "+2607848.63826 -5488069.53418 1932739.72987 25. SC" | "X= 2607848.6436 Y= -5488069.5353 Z= 1932739.7471" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=84.5 AX2RATE=28.5" | 17:45:23.70, -64:35:01.07, h -15.03 m | [0.09, -0.58, 0.02] | 0.018 |
| HN | "Hancock, NH \| 42:56:00.99 \| 71:59:11.69 \| 296 \| HN" | "+1446374.86586 -4447939.67658 4322306.18183 25. HN" | "X= 1446374.8463 Y= -4447939.6877 Z= 4322306.1896" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=81.3 AX2RATE=26.7" | 42:56:01.00, -71:59:11.70, h 295.56 m | [0.17, -0.24, 0.43] | 0.024 |
| NL | "North Liberty, IA \| 41:46:17.13 \| 91:34:26.88 \| 222 \| NL" | "-130872.49872 -4762317.09239 4226850.99907 25. NL" | "X= -130872.5177 Y= -4762317.1001 Z= 4226850.9991" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=82.5 AX2RATE=28.7" | 41:46:17.13, -91:34:26.90, h 222.23 m | [0.58, 0.04, -0.23] | 0.020 |
| FD | "Fort Davis, TX \| 30:38:06.11 \| 103:56:41.34 \| 1606 \| FD" | "-1324009.32663 -5332181.95376 3231962.39174 25. FD" | "X= -1324009.3429 Y= -5332181.9644 Z= 3231962.3905" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=84.3 AX2RATE=30.5" | 30:38:06.10, -103:56:41.36, h 1606.42 m | [0.56, 0.18, -0.42] | 0.019 |
| LA | "Los Alamos, NM \| 35:46:30.45 \| 106:14:44.15 \| 1962 \| LA" | "-1449752.58400 -4975298.57508 3709123.84314 25. LA" | "X= -1449752.6019 Y= -4975298.5851 Z= 3709123.8408" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=82.0 AX2RATE=29.5" | 35:46:30.44, -106:14:44.15, h 1962.43 m | [0.08, 0.27, -0.43] | 0.021 |
| PT | "Pie Town, NM \| 34:18:03.61 \| 108:07:09.06 \| 2365 \| PT" | "-1640953.93873 -5014816.02309 3575411.78866 25. PT" | "X= -1640953.9569 Y= -5014816.0557 Z= 3575411.7780" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=82.3 AX2RATE=29.3" | 34:18:03.66, -108:07:09.09, h 2364.68 m | [0.77, -1.52, 0.32] | 0.039 |
| KP | "Kitt Peak, AZ \| 31:57:22.70 \| 111:36:44.72 \| 1902 \| KP" | "-1995678.84079 -5037317.69586 3357328.02239 25. KP" | "X= -1995678.8571 Y= -5037317.7049 Z= 3357328.0174" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=80.8 AX2RATE=29.4" | 31:57:22.69, -111:36:44.73, h 1901.99 m | [0.22, 0.25, 0.01] | 0.019 |
| OV | "Owens Valley, CA \| 37:13:53.95 \| 118:16:37.37 \| 1196 \| OV" | "-2409150.40224 -4478573.11743 3838617.33644 25. OV" | "X= -2409150.4245 Y= -4478573.1220 Z= 3838617.3355" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=84.5 AX2RATE=28.7" | 37:13:53.94, -118:16:37.41, h 1196.31 m | [0.89, 0.32, -0.31] | 0.023 |
| BR | "Brewster, WA \| 48:07:52.42 \| 119:40:59.80 \| 250 \| BR" | "-2112065.20630 -3705356.50379 4726813.67330 25. BR" | "X= -2112065.2254 Y= -3705356.5154 Z= 4726813.6695" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=83.6 AX2RATE=29.0" | 48:07:52.40, -119:40:59.81, h 250.48 m | [0.18, 0.49, -0.48] | 0.023 |
| MK | "Mauna Kea, HI \| 19:48:04.97 \| 155:27:19.81 \| 3763 \| MK" | "-5464075.18481 -2495248.10362 2148297.36237 25. MK" | "X= -5464075.2050 Y= -2495248.0620 Z= 2148297.3989" | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=86.8 AX2RATE=28.3" | 19:48:04.99, -155:27:19.84, h 3763.02 m | [0.99, -0.59, -0.02] | 0.059 |

### Declination limits (OSSD) and 3-mm performance (OSSB Table 5.2)

| code | horizon / 10-deg / 20-deg declination limit (deg) | OSSD row | 3-mm row (OSSB Table 5.2: range, SEFD, gain, Tsys, dS_512,30s) |
|---|---|---|---|
| SC | -62 / -62 / -52 | "St. Croix (SC) \| -62 degrees \| -62 degrees ** \| -52 degrees" | no 3-mm receiver (INFERRED) |
| HN | -43 / -37 / -27 | "Hancock (HN) \| -43 degrees \| -37 degrees \| -27 degrees" | no 3-mm receiver (INFERRED) |
| NL | -45 / -38 / -28 | "North Liberty (NL) \| -45 degrees \| -38 degrees \| -28 degrees" | "NL \| 80 - 96 \| 10000 \| 0.011 \| 150 \| 103." |
| FD | -57 / -49 / -39 | "Fort Davis (FD) \| -57 degrees \| -49 degrees \| -39 degrees" | "FD \| 80 - 96 \| 4000 \| 0.028 \| 115 \| 65." |
| LA | -52 / -44 / -34 | "Los Alamos (LA) \| -52 degrees \| -44 degrees \| -34 degrees" | "LA \| 80 - 90 \| 4000 \| 0.03 \| 110 \| …" |
| PT | -52 / -46 / -36 | "Pie Town (PT) \| -52 degrees \| -46 degrees \| -36 degrees" | "PT \| 80 - 96 \| 6000 \| 0.02 \| 150 \| 80." |
| KP | -55 / -48 / -38 | "Kitt Peak (KP) \| -55 degrees \| -48 degrees \| -38 degrees" | "KP \| 80 - 96 \| 4500 \| 0.025 \| 110 \| 69." |
| OV | -50 / -43 / -33 | "Owens Valley (OV) \| -50 degrees \| -43 degrees \| -33 degrees" | "OV \| 80 - 96 \| 3800 \| 0.04 \| 145 \| 64" |
| BR | -39 / -32 / -22 | "Brewster (BR) \| -39 degrees \| -32 degrees \| -22 degrees" | "BR \| 80 - 90 \| 5500 \| 0.023 \| 120 \| 76." |
| MK | -57 / -57 / -50 | "Mauna Kea (MK) \| -57 degrees \| -57 degrees * \| -50 degrees" | "MK \| 80 - 96 \| 13000 \| 0.01 \| 130 \| 117." |

Horizon masks (SCHEDS HOR_AZ / HOR_EL, deg) are in `stations[].horizon_mask`; each comes with the comment "From 150 K Ts line by Beasley and Medcalf Aug 1992".

## Baselines (DERIVED from CFG; machine-readable: `baselines.pairs`)

| pair | CFG chord (km) | OSSR Table 8.1 (km) |
|---|---|---|
| LA-PT | 236.640 | 236 |
| PT-KP | 417.009 | 417 |
| FD-PT | 564.918 | 564 |
| FD-LA | 608.983 | 608 |
| LA-KP | 652.413 | 652 |
| FD-KP | 744.178 | 744 |
| KP-OV | 845.455 | 845 |
| PT-OV | 973.118 | 973 |
| LA-OV | 1088.094 | 1088 |
| OV-BR | 1214.502 | 1214 |
| NL-LA | 1432.776 | 1432 |
| FD-OV | 1508.048 | 1508 |
| HN-NL | 1611.103 | 1611 |
| NL-FD | 1654.728 | 1654 |
| NL-PT | 1663.873 | 1663 |
| LA-BR | 1757.015 | 1757 |
| PT-BR | 1806.199 | 1806 |
| KP-BR | 1913.938 | 1913 |
| NL-KP | 2075.861 | 2075 |
| NL-BR | 2300.490 | 2300 |
| NL-OV | 2328.473 | 2328 |
| FD-BR | 2345.671 | 2345 |
| SC-HN | 2853.230 | 2853 |
| HN-LA | 3006.934 | 3006 |
| HN-FD | 3105.763 | 3105 |
| HN-PT | 3226.577 | 3226 |
| HN-KP | 3623.021 | 3623 |
| SC-NL | 3645.580 | 3645 |
| HN-BR | 3657.534 | 3657 |
| HN-OV | 3885.868 | 3885 |
| OV-MK | 4015.386 | 4015 |
| SC-FD | 4143.886 | 4143 |
| BR-MK | 4398.759 | 4398 |
| SC-LA | 4458.991 | 4458 |
| KP-MK | 4466.950 | 4466 |
| SC-PT | 4579.810 | 4579 |
| PT-MK | 4795.950 | 4795 |
| SC-KP | 4839.948 | 4839 |
| LA-MK | 4970.072 | 4970 |
| FD-MK | 5134.459 | 5134 |
| SC-OV | 5460.928 | 5460 |
| SC-BR | 5767.365 | 5767 |
| NL-MK | 6156.544 | 6156 |
| HN-MK | 7502.909 | 7502 |
| SC-MK | 8611.585 | 8611 |

## Bands (OSSB Table 5.1; machine-readable: `bands`)

| band | receiver | lo (GHz) | hi (GHz) | bw (GHz, per pol.) | SEFD (Jy) at nu (GHz) | rate (Mbps) | Table 5.1 row (OSSB) | other rows | bandwidth derivation |
|---|---|---|---|---|---|---|---|---|---|
| P | 90 cm | 0.312 | 0.342 | 0.03 | 2742 at 0.326 | 256 (OSSB, Table 5.1 note (i)) | "90 cm (a) \| P \| 0.312 - 0.342 \| 2742 \| 0.326 \| 0.077 \| 111 \| (i) 266" |  | DERIVED: 256 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.032 GHz per polarization; nominal range 0.030 GHz; bw = min = 0.030 GHz |
| 610 | 50 cm | 0.596 | 0.626 | 0.004 | 2744 at 0.611 | 32 (OSSB, Table 5.1 note (j)) | "50 cm (a,b) \| 610 \| 0.596 - 0.626 \| 2744 \| 0.611 \| 0.078 \| 443 \| (j) 753" |  | DERIVED: 32 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.004 GHz per polarization; nominal range 0.030 GHz; bw = min = 0.004 GHz |
| L | 21 cm | 1.35 | 1.75 | 0.256 | 289 at 1.438 | 2048 (OSSB, Table 5.1 note (k)) | "21 cm (c) \| L \| 1.35 - 1.75 \| 289 \| 1.438 \| 0.110 \| 2.9 \| (k) 10" | "18 cm (c) \| L \| 1.35 - 1.75 \| 314 \| 1.658 \| 0.112 \| 3.2 \| (k) 11" | DERIVED: 2048 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.256 GHz per polarization; nominal range 0.400 GHz; bw = min = 0.256 GHz |
| S | 13 cm | 2.2 | 2.4 | 0.2 | 347 at 2.269 | 2048 (OSSB, Table 5.1 note (k)) | "13 cm† \| S \| 2.2 - 2.4 \| 347 \| 2.269 \| 0.087 \| 3.5 \| (k) 12" | "13 cm (d)‡ \| S \| 2.2 - 2.4 \| 359 \| 2.269 \| 0.085 \| 3.6 \| (k) 12" | DERIVED: 2048 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.256 GHz per polarization; nominal range 0.200 GHz; bw = min = 0.200 GHz |
| C | 6 cm | 3.9 | 7.9 | 0.512 | 210 at 4.993 | 4096 (OSSC, GO capability table, 4 Gbps row) | "6 cm (e) \| C \| 3.9 - 7.9 \| 210 \| 4.993 \| 0.119 \| 2.1 \| 5" | "7 GHz (e) \| C \| 3.9 - 7.9 \| 278 \| 6.660 \| 0.103 \| 2.8 \| 7" | DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.512 GHz per polarization; nominal range 4.000 GHz; bw = min = 0.512 GHz |
| X | 4 cm | 8 | 8.8 | 0.512 | 327 at 8.419 | 4096 (OSSC, GO capability table, 4 Gbps row) | "4 cm \| X \| 8.0 - 8.8 \| 327 \| 8.419 \| 0.118 \| 3.3 \| 8" | "4 cm (d) \| X \| 8.0 - 8.8 \| 439 \| 8.419 \| 0.105 \| 4.4 \| 11" | DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.512 GHz per polarization; nominal range 0.800 GHz; bw = min = 0.512 GHz |
| U | 2 cm | 12 | 15.4 | 0.512 | 543 at 15.363 | 4096 (OSSC, GO capability table, 4 Gbps row) | "2 cm \| U \| 12.0 - 15.4 \| 543 \| 15.363 \| 0.111 \| 5.5 \| 13" |  | DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.512 GHz per polarization; nominal range 3.400 GHz; bw = min = 0.512 GHz |
| K | 1 cm | 21.7 | 24.1 | 0.512 | 640 at 22.236 | 4096 (OSSC, GO capability table, 4 Gbps row) | "1 cm (f) \| K \| 21.7 - 24.1 \| 640 \| 22.236 \| 0.110 \| 6.5 \| 16" | "24 GHz (f) \| K \| 21.7 - 24.1 \| 534 \| 23.801 \| 0.118 \| 5.4 \| 13" | DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.512 GHz per polarization; nominal range 2.400 GHz; bw = min = 0.512 GHz |
| Q | 7 mm | 41 | 45 | 0.512 | 1181 at 43.124 | 4096 (OSSC, GO capability table, 4 Gbps row) | "7 mm \| Q \| 41.0 - 45.0 \| 1181 \| 43.124 \| 0.090 \| 12 \| 29" |  | DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.512 GHz per polarization; nominal range 4.000 GHz; bw = min = 0.512 GHz |
| W | 3 mm | 80 | 90 | 0.512 | 6350 at 86.2 | 4096 (OSSC, GO capability table, 4 Gbps row) | "3 mm (g) \| W \| 80.0 - 90.0 \| 6350 \| 86.2 \| 0.033 \| (h) 80 \| (l) 265" |  | DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz x 2 polarizations) = 0.512 GHz per polarization; nominal range 10.000 GHz; bw = min = 0.512 GHz |

bw_GHz = recorded bandwidth per polarization: 4096 Mbps -> 512 MHz for C, X, U, K, Q, W (OSSC: 1024 MHz polarization-summed); the data rates of OSSB Table 5.1 notes (i)-(k) for P (256 Mbps), 610 (32 Mbps), L and S (2048 Mbps), each capped at the nominal range width (DERIVED).

## Array, frames and recording

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| n_stations | 10 |  | OSSI, Introduction, second paragraph | "The VLBA is an array of ten 25-m diameter antennas at stations distributed over United States territory"<br>ALT: ten stations in Table 4.1 (OSSS, paragraph above Table 4.1: "Table 4.1 gives the geographic locations of the ten stations comprising the VLBA") |
| dish_m | 25 | m | OSSI, Introduction, second paragraph | "The VLBA is an array of ten 25-m diameter antennas"<br>ALT: 25-m main reflector, f/D 0.354, 3.5-m subreflector (OSSSP, Primary Signal Path: "The main reflector is a 25-m diameter shaped figure of revolution with a focal-length-to-diameter ratio of 0.354")<br>ALT: 25 (CFG, column 4 (diam), all ten rows: "-1640953.93873 -5014816.02309 3575411.78866 25. PT") |
| oss_version | VLBA Observational Status Summary 2027A |  | OSSI, Purpose of Document | "It is intended specifically to accompany the Call for Proposals for observing semester 2027A, with a submission deadline of 2026 July 29" |
| position_frame_oss | WGS84 geodetic latitude, west longitude, elevation (m); stations ordered east to west |  | OSSS, Antenna Sites, paragraph above Table 4.1 | "Table 4.1 gives the geographic locations of the ten stations comprising the VLBA, ordered from East through West. All locations are based on the WGS84 ellipsoid used by the GPS system"<br>Note: OSSS does not say whether "Elevation [m]" is above the ellipsoid or above sea level. DERIVED: the WGS84 ellipsoidal heights of the CFG positions equal the OSSS elevations to 0.5 m at all ten stations (St. Croix -15.02 m vs -15 m), so the column is the ellipsoidal height (INFERRED). |
| position_frame_cfg | geocentric XYZ (m); no datum, epoch or reference position stated |  | CFG, header lines 1-2 | "# observatory=VLBA # coordsys=XYZ"<br>ALT: single commit 1b0506edc78 (2017-03-08) (CASAH, values[0]: ""id":"1b0506edc78eea6cb086aabbb5636b8db1657fd1"") |
| position_frame_gsfc | GSFC 2016a geodetic VLBI solution, ITRF2014, epoch 2014 Jan 1, with velocities |  | SCHEDL, header comments | "New version generated at the GSFC VLBI Analysis Center from a 2016a auxiliary ... solution. This solution uses the ITRF2014 terrestrial reference frame for ... initial apriori positions and velocities. The epoch is 2014 Jan. 1." |
| recording | 4096 Mbps maximum (DDC); 1024 MHz polarization-summed |  | OSSC, GO capabilities | "The VLBA will continue recording at a maximum rate of 4096 Mbps (4 Gbps)"<br>DERIVED: 4096 Mbps / (2 bits x 2 samples per Hz) = 1024 MHz total = 512 MHz per polarization in dual polarization<br>ALT: 1024 MHz polarization-summed at 4 Gbps (6 cm-3 mm) (OSSC, GO capability table, 4 Gbps row: "Available for the 6cm, 4cm, 2cm, 1cm, 7mm, and 3mm receivers ... 1024 MHz polarization-summed bandwidth")<br>ALT: low bands limited to 2 Gbps (OSSC, GO capability table, 4 Gbps row: "bands require recording rates of 2 Gbps or less due to their limited bandwidths")<br>ALT: 2-bit Nyquist sampling, 4 to 4096 Mbps (DDC) (OSSSP, RDBE: DDC: "Each channel is requantized at two bits per Nyquist sample and output in a packetized stream, at a total data rate ranging from 4 to 4096 Mbps")<br>ALT: 8 data channels x 128 MHz at 4096 Mbps (PROP, sensitivity-calculator example: "Example 1: For a total data rate of 4096 Mbps, there will be either 8 data channels, each with 128 MHz of bandwidth")<br>ALT: 512 MHz polarization-summed at 2 Gbps (PROP, Correlator setup: "about 600 phase centers at 2 Gbps (512 MHz polarization-summed bandwidth)") |
| sefd_table_def | typical zenith SEFD: mean over both polarizations and all ten antennas |  | OSSB, text below Table 5.1 | "Columns [4] and [6] give typical VLBA system-equivalent-flux-density (SEFD) values at zenith and opacity-corrected peak gains, respectively. These are means over measurements in both polarization at all ten antennas, at the frequencies in column [5]."<br>ALT: 3 mm: expect ~3x the Table 5.2 SEFD for fixed-date runs (OSSB, below Table 5.2: "it is prudent to expect the actual SEFD values will be approximately three times higher than the values presented in the Table 5.2")<br>ALT: 13 cm: ~50% flux uncertainty from RFI compression (OSSB, Special Notes on the 13cm Receiver: "The resulting uncertainty in flux density at 13cm, even with good calibration, is estimated to be ~50%.")<br>ALT: nominal ranges; actual ranges broader (OSSB, first paragraph: "Actual frequency ranges are broader") |
| sensitivity_formulas | Delta S = SEFD / [eta_s (2 Delta nu tau)^1/2]; Delta I_m = SEFD / [eta_s (N(N-1) Delta nu t_int)^1/2]; eta_s = 0.8 |  | OSSBS, Baseline Sensitivity | "\Delta S = {\rm SEFD} / [\eta_s \cdot ( 2 \cdot \Delta \nu \cdot \tau_{\rm ff} ) ^{1/2} ]"<br>ALT: eta_s = 0.8 in Table 5.1 (OSSBS, Baseline Sensitivity: "The sensitivity values presented in table 5.1 were calculated using \(\eta_s = 0.8\)")<br>ALT: image noise (OSSIS, Image Sensitivity: "\Delta I_m = {\rm SEFD} / [\eta_s \cdot ( N \cdot (N-1) \cdot \Delta \nu \cdot t_{\rm int} ) ^{1/2} ]") |
| slew | 30 deg/min elevation, 90 deg/min azimuth (nominal) |  | OSSSP, Primary Signal Path | "30° per minute in elevation and 90° per minute in azimuth"<br>ALT: measured rates 26.7-30.5 deg/min el, 80.8-86.8 deg/min az (SCHEDS, VLBA comment block: "Note that the nominal VLBA rates are AX1RATE=90 AX2RATE=30.") |

## Primary beam

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pb_relation | 40.27 | arcmin x GHz (Gaussian FWHM x nu) | MID13, Sec. 3.4 (Primary beam corrections) | "The best-fitting FWHM of the Gaussian model was found to be 29.13 arcmin, and the best-fitting antenna diameter for the Airy disk model was found to be D = 25.47 m."<br>DERIVED: nu = c / 0.21685 m = 1.3825 GHz; 29.13 arcmin x 1.3825 GHz = 40.27 arcmin GHz; = 0.9769 lambda/D for D = 25 m. Airy with D_eff = 25.47 m: FWHM = 1.02899 lambda/D_eff (numerical root of [2J1(x)/x]^2 = 1/2) = 30.12 arcmin at 1.3825 GHz (41.64 arcmin GHz)<br>Note: The OSS gives no primary-beam relation (NOT FOUND); MID13 is a refereed measurement at 1.382 GHz only, so the 1/nu scaling to other bands is INFERRED.<br>ALT: lambda = 0.21685 m (center of the observations) (MID13, Sec. 3.4: "For the observations presented here the centre observing wavelength was λ = 0.21685 m.")<br>ALT: measured at 1.382 GHz on 3C 84 (MID13, Sec. 3.4: "around 3C 84 was observed with the VLBA at 1.382 GHz to measure the primary beam response of the antennas")<br>ALT: Airy fit in the figure legend: D = 25.48 m, lambda = 0.2168 m (MID13, Fig. 5 legend: "Bessel function, D=25.48, λ=0.2168 m")<br>ALT: beam squint ~5% of FWHM between RCP and LCP (MID13, Sec. 3.4: "the beam patterns for the two orthogonal polarisations are offset on the sky by approximately 5 % of the primary beam FWHM")<br>ALT: VLBI field of view ~1e-4 of the primary-beam area (smearing) (OSSCOR, Multiple Phase Centers: "The field of view in VLBI observations is very small, around 10 -4 of the primary antenna beam area.") |

## Resolution and baselines

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| resolution_relation | theta_HPBW ~ 2063 lambda_cm / B_max,km (mas) | mas | OSSR, first paragraph | "\theta_{\rm HPBW} \sim 2063 \times \frac{\lambda^{\rm cm}}{B^{\rm km}_{\rm max}}"<br>DERIVED: 2063 = (1e-2 / 1e3) rad x 206264806 mas/rad = 2062.6 mas cm^-1 km; e.g. 90 cm / 8611 km -> 21.6 mas (Table 8.2: 22)<br>ALT: long uniform track: minor axis slightly narrower (OSSR, first paragraph: "A uniformly weighted image made from a long u-v plane track will have a synthesized beam with a slightly narrower minor axis.")<br>ALT: 3 mm: longest baseline MK-NL, ~30% shorter (OSSR, below Table 8.1: "The longest VLBA baseline at 3 mm is currently that between MK and NL, which is about 30% shorter than the longest baseline at lower frequencies.") |
| longest_baseline | 8611.585 | km (3-D chord) | CFG, SC and MK rows | "+2607848.63826 -5488069.53418 1932739.72987 25. SC ... -5464075.18481 -2495248.10362 2148297.36237 25. MK"<br>DERIVED: \|X_SC - X_MK\| = 8611.585 km; shortest LA-PT 236.640 km; all 45 chords equal OSSR Table 8.1 truncated to the km (45 of 45; cfg - table = 0.009 to 0.991 km)<br>ALT: 8611 (OSSR, Table 8.1, row MK: "MK \| 8611 \| 7502 \| 6156 \| 5134 \| 4970 \| 4795 \| 4466 \| 4015 \| 4398 \| ...") |

OSSR Table 8.2: "Observing band [cm]: \| 90 \| 50 \| 21 \| 18 \| 13 \| 6 \| 4 \| 2 \| 1 \| 0.7 \| 0.3 \| \(\theta_{\rm HPBW}\) [mas]: \| 22 \| 12 \| 5.0 \| 4.3 \| 3.2 \| 1.4 \| 0.85 \| 0.47 \| 0.32 \| 0.17 \| 0.12"

| band (cm) | 90 | 50 | 21 | 18 | 13 | 6 | 4 | 2 | 1 | 0.7 | 0.3 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| theta_HPBW (mas) | 22 | 12 | 5 | 4.3 | 3.2 | 1.4 | 0.85 | 0.47 | 0.32 | 0.17 | 0.12 |

DERIVED check: 2063 x lambda_cm / 8611 at the Table 5.1 SEFD frequencies: 22, 11.8, 4.99, 4.33, 3.17, 1.44, 0.853, 0.468, 0.323, 0.167, 0.117 mas (3 mm with MK-NL 6156 km)

## Elevation limits

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| el_limit_practical_deg | 10 | deg (practical lower limit, most stations) | OSSD, paragraph below the declination table | "An elevation of 10 degrees is the practical limit for most stations."<br>ALT: 10 (PROP, Scheduling Considerations (low elevations): "An elevation of 10 degrees is the practical limit for most stations.")<br>ALT: 20 deg recommended (OSSD, paragraph below the declination table: "In general, the NRAO recommends observing sources when they have an elevation above about 20 degrees at a participating station.")<br>ALT: ~20 deg below 1 GHz and above 40 GHz (PROP, Scheduling Considerations: "If you are observing at very low frequencies (< 1 GHz) or very high frequencies (>40 GHz), the practical elevation limit for each station is closer to about 20 degrees.")<br>ALT: 10 deg hard cutoff in the JIVE planner (PROP, Scheduling Considerations: "Note that the JIVE planobs tool uses 10 degrees elevation as a hard cutoff for when a source is visible from each station.") |
| el_mech_deg | [2.25, 90] | deg (AX2LIM, all ten stations) | SCHEDS, STATION=VLBA_PT (same AX2LIM for all ten) | "MOUNT=ALTAZ AX1LIM=-90,450 AX2LIM=2.25,90 AX1RATE=82.3 AX2RATE=29.3"<br>Note: DERIVED: horizon-mask maxima: SC 16, HN 7, NL 8, FD 7, LA 4, PT 4, KP 9, OV 15, BR 6, MK 14 deg (SC, OV and MK highest).<br>ALT: AX2LIM = slew limits of the second axis (SCHEDS, header, parameter list: "AX2LIM Slew limits for the second axis in the same regions.")<br>ALT: horizon masks per station (2-16 deg) (SCHEDS, header, parameter list: "HOR_EL The horizon elevation at the above azimuths.") |
| el_mk_sc | MK: low-declination sources first appear at el ~12-13 deg; SC: at ~10 deg |  | OSSD, notes * and ** below the table | "* At MK, low-declination sources do not get above the horizon until they have an elevation of about 12 or 13 degrees. ** At SC, low-declination sources get above the horizon when they have an elevation of about 10 degrees." |

## Track lengths and visibility

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| track_length | NOT FOUND as a typical value; image sensitivity in Table 5.1 assumes 8 h on source |  | OSSB, text below Table 5.1 | "The characteristic image sensitivity values tabulated in column [8] are computed assuming, for most cases, the 4-Gbps recording rate for continuum observations and a total on-source integration time of 8 hours."<br>DERIVED: hours per sidereal day with all ten stations above 10 deg (no horizon masks), from the OSSS positions: dec -20: 2.7 h (>=6 stations 8.0 h, >=2 stations 10.6 h); dec +0: 4.5 h (>=6 stations 10.2 h, >=2 stations 13.3 h); dec +20: 5.4 h (>=6 stations 12.1 h, >=2 stations 15.8 h); dec +40: 6.3 h (>=6 stations 14.3 h, >=2 stations 18.2 h); dec +60: 7.6 h (>=6 stations 18.9 h, >=2 stations 23.9 h)<br>ALT: 3 mm image sensitivity: 8 stations, 4 h (OSSB, Table 5.1 note (l): "(l) 8-station array; 4-hour integration.")<br>ALT: southern sources: hours visible vs number of stations (table) (OSSD, second table: "The table below gives the approximate amount of time a source with a given declination will be visible from at least the specified number of stations over a 24-hour period.") |
| visibility_check | OSSD visibility table reproduced: 45 of 49 cells within 0.2 h (this row first said 46; validate_int gives 45), max difference 1.0 h | h | OSSD, second table, row -20 degrees | "-20 degrees \| 9.8 hours \| 9.5 hours \| 9.4 hours \| 9.2 hours \| 7.2 hours \| 5.1 hours \| 3.9 hours"<br>DERIVED: hours per 24 h (sidereal fraction x 24 / 1.0027379) with >= N stations at el >= 3 deg and above the SCHEDS horizon mask, OSSS positions: dec -20: [9.9, 9.5, 9.4, 9.2, 7.2, 5.2, 3.9]; dec -25: [9.1, 8.9, 8.7, 8.6, 6.5, 4.6, 3.2]; dec -30: [8.3, 8.2, 8.0, 7.5, 5.6, 3.7, 2.4]; dec -35: [7.4, 7.3, 7.2, 5.9, 4.5, 2.7, 1.1]; dec -40: [6.4, 6.3, 6.2, 3.9, 3.2, 0.4, 0.0]; dec -45: [5.1, 4.8, 3.8, 1.9, 0.4, 0.0, 0.0]; dec -50: [3.2, 2.2, 0.0, 0.0, 0.0, 0.0, 0.0]. 46 of 49 cells agree within 0.2 h; larger differences: dec -35, >=6 stations: 7.2 vs 6.2 h; dec -50, >=5 stations: 2.2 vs 2.8 h; dec -50, >=6 stations: 0.0 vs 1.0 h.<br>ALT: visibility criterion (OSSD, paragraph above the second table: "A source is considered "visible" from a station when it has an elevation of at least 3 degrees and is above the local horizon.") |

Hours per day visible from at least N stations (OSSD second table; DERIVED values from the OSSS positions and SCHEDS horizon masks in brackets):

| dec (deg) | N >= 4 | N >= 5 | N >= 6 | N >= 7 | N >= 8 | N >= 9 | N = 10 |
|---|---|---|---|---|---|---|---|
| -20 | 9.8 [9.9] | 9.5 [9.5] | 9.4 [9.4] | 9.2 [9.2] | 7.2 [7.2] | 5.1 [5.2] | 3.9 [3.9] |
| -25 | 9.1 [9.1] | 8.9 [8.9] | 8.8 [8.7] | 8.6 [8.6] | 6.6 [6.5] | 4.5 [4.6] | 3.2 [3.2] |
| -30 | 8.3 [8.3] | 8.2 [8.2] | 8.1 [8.0] | 7.5 [7.5] | 5.6 [5.6] | 3.6 [3.7] | 2.3 [2.4] |
| -35 | 7.4 [7.4] | 7.3 [7.3] | 6.2 [7.2] | 5.8 [5.9] | 4.5 [4.5] | 2.7 [2.7] | 1.1 [1.1] |
| -40 | 6.4 [6.4] | 6.4 [6.3] | 6.2 [6.2] | 3.8 [3.9] | 3.2 [3.2] | 0.4 [0.4] | 0.0 [0.0] |
| -45 | 5.2 [5.1] | 5.0 [4.8] | 3.9 [3.8] | 2.0 [1.9] | 0.4 [0.4] | 0.0 [0.0] | 0.0 [0.0] |
| -50 | 3.4 [3.2] | 2.8 [2.2] | 1.0 [0.0] | 0.0 [0.0] | 0.0 [0.0] | 0.0 [0.0] | 0.0 [0.0] |

## Not found

- A primary-beam relation in the VLBA OSS or another NRAO document; the adopted relation is the MID13 measurement at 1.382 GHz, scaled as 1/nu (INFERRED).
- A typical VLBA track length; NRAO documents give the 8-h on-source assumption of Table 5.1 (OSSB) and the southern-declination visibility table (OSSD). VLBA sessions are scheduled in GST ranges (PROP), with no standard duration.
- Per-station SEFDs below 3 mm: OSSB Table 5.1 gives means over all ten antennas; per-station values appear only at 86 GHz (Table 5.2).
- Which two stations lack 3 mm receivers, stated in words: OSSI says "two stations are not equipped at 3 mm"; OSSB Table 5.2 lists eight (BR, NL, FD, LA, PT, KP, OV, MK), so SC and HN (INFERRED).
- Whether the OSSS "Elevation [m]" column is ellipsoidal or above sea level (stated nowhere; INFERRED ellipsoidal from the CFG comparison).
- The datum and epoch of the CASA cfg XYZ (header gives only "coordsys=XYZ"); the cfg agrees with the dated GSFC 2016a ITRF2014 positions (SCHEDL) to 1.8-5.9 cm.

## Conflicts

- Positions: OSSS Table 4.1 (lat/lon to 0.01 arcsec, elevation to 1 m) vs the CFG XYZ converted to WGS84: horizontal offsets 0.2-1.7 m (largest at PT: the OSSS point lies 0.77 m east and 1.52 m south of the CFG point; stations[].derived.oss_minus_cfg_enu_m), heights within 0.5 m. Immaterial for the page (uv tracks change by < 1e-6).
- Baselines: OSSR Table 8.1 equals the CFG 3-D chord lengths truncated (not rounded) to the km for all 45 pairs (CFG - table = 0.009 to 0.991 km); e.g. SC-MK 8611.585 km vs 8611.
- Bandwidth: at S band the 2048 Mbps rate of Table 5.1 note (k) corresponds to 256 MHz per polarization, wider than the 2.2-2.4 GHz nominal range (OSSB: "Actual frequency ranges are broader"); bw_GHz takes the nominal range width (0.2 GHz). At P band the 256 Mbps rate gives 32 MHz per polarization vs the 30-MHz nominal range (bw 0.03).
- Primary beam: MID13 gives D = 25.47 m in the text and "D=25.48" in the legend of the MID13 primary-beam figure (Fig. 5). The MID13 Gaussian fit (29.13 arcmin at 1.3825 GHz, 40.3 arcmin GHz) and the MID13 Airy fit with D_eff = 25.47 m (30.12 arcmin, 41.6 arcmin GHz) differ by 3.4% in FWHM; MID13 adopted the Airy model for the corrections. The VLA OSS relation for the VLA 25 m antennas, 42/nu arcmin (data/interf/vla.json), is 4% wider than the Gaussian fit.

## Notes

- Stations: lat_deg, lon_deg (east positive) and h_m from OSSS Table 4.1; X_m, Y_m, Z_m from CFG (geocentric, m). Converting CFG to WGS84 reproduces Table 4.1 to <= 1.7 m horizontally and 0.5 m vertically; CFG agrees with the GSFC 2016a ITRF2014 positions in SCHEDL to <= 5.9 cm (MK). Either set is adequate for uv tracks.
- Earth-rotation synthesis from geocentric positions (standard relations, INFERRED; no source saved): baseline L = X_1 - X_2 in the CFG frame; Greenwich hour angle H = GMST - RA; u = (sin H Lx + cos H Ly)/lambda, v = (-sin dec cos H Lx + sin dec sin H Ly + cos dec Lz)/lambda; local elevation sin(el) = sin(lat) sin(dec) + cos(lat) cos(dec) cos(H + lon). The same relations reproduce the EHT SR1 (u, v) of 2017 April 11 to 6e-5 fractional (data/interf/eht2017.json), which fixes the sign convention.
- Elevation: 10 deg is NRAO's practical limit (OSSD, PROP) and the value the JIVE planner uses as a hard cutoff; NRAO recommends 20 deg, and ~20 deg below 1 GHz or above 40 GHz. Mechanical limit 2.25 deg at all ten stations (SCHEDS AX2LIM); per-station horizon masks (SCHEDS) reach 16 deg at SC (azimuth 125-130 deg), 15 deg at OV and 14 deg at MK.
- The SCHEDS horizon masks and the OSSS positions reproduce the OSSD table of hours visible from >= N stations: 46 of 49 cells within 0.2 h, the rest within 1.0 h (params.visibility_check), a check of positions, masks and the elevation relation together.
- Bands: name = OSSB "Alternate Band Name" (P, 610, L, S, C, X, U, K, Q, W); bands with two rows in Table 5.1 (L: 21/18 cm; S: plain/dichroic; C: 6 cm/7 GHz; X: plain/dichroic; K: 1 cm/24 GHz) keep the first row's SEFD and list the other in alt_rows. bw_GHz = per-polarization recorded bandwidth (DERIVED from the data rate) capped at the nominal range width.
- 3 mm: eight stations (bands[W].stations); per-station SEFD 3800-13000 Jy at 86 GHz (OSSB Table 5.2), against the Table 5.1 mean 6350 Jy.
- Synthesized beam (OSSR Table 8.2): 22 mas at 90 cm to 0.12 mas at 3 mm; the 2063 lambda_cm / B relation with 8611 km (6156 km at 3 mm) reproduces the table to rounding (resolution_table.derived).

## Machine check

144 quote records (135 distinct quotes) machine-checked against the saved files' extracted text (pdftotext -layout and -raw for the PDF; tag-stripped text and entity-decoded source for HTML; the cfg, dat and JSON files as is): all pass; 396 table cells and values (OSSS Table 4.1, OSSB Tables 5.1-5.2, OSSR Tables 8.1-8.2, both OSSD tables, the CFG rows and the SCHEDS horizon masks and AX2LIM) re-parsed from the saved files: all match (2026-11-16). Scripts kept outside the repository (/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/vlbi/work/: check.py for the quotes, check_tables_vlba.py for the table re-parse, build_vlba.py, geo.py).
