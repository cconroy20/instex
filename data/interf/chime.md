# Interferometer: CHIME and the CHIME/FRB Outriggers -- four 20 x 100 m cylinders (1024 dual-polarization feeds), site, drift-scan beam and transit times, band, the KKO, GBO and HCO outrigger stations, a point-source field

Compiled 2026-11-16 for the instex INTERFEROMETER mode, in the record format of `data/interf/vla.md` and `data/interf/dsa2000.md`. Every number comes from a document saved unmodified under `rawdata/interf/chime/`; each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **NOT FOUND** marks a gap. Downloaded files were read as text only (pdftotext and PyMuPDF for PDFs; tag-stripped text for HTML; YAML, JSON and Python files as data); nothing downloaded was run. Companion machine-readable file: `data/interf/chime.json` (configurations `CHIME`, 1024 feeds, and `CHIME_OUTRIGGERS`, 1344 feeds). Machine check: see the last section.

## Superseded by the audit of 2026-11-16 (data/audit/2026-11-16_X_arrays.md)

- Southern limit: the −5.7° below (DERIVED from FRB18's ∼110° north-south field) is replaced by −11°, the CHIME/FRB field (CAT1, new source: The First CHIME/FRB Fast Radio Burst Catalog, ApJS 257, 59, 2021; arXiv:2106.04352v3, `rawdata/interf/chime/arxiv_2106.04352v3.pdf`; Sec. 2: "The CHIME/FRB detector views the entire sky north of declination −11◦ ... every day"; beams formed from θ = −60° to +60°). OVW22's holography reaches −21°; the page uses the FRB field. North of +70° a source also transits below the pole (not modeled).
- "Three quarters of the sky": OVW22's 3/4 (31,000 deg²) is the sky visible from the site; the sky north of −11° is 59.5% of the sphere (DERIVED, (1 + sin 11°)/2).
- CHIME + outriggers: CHIME is now phased into one station, as the VLBI forms one beam at the CHIME core and at each outrigger (VLBI26 Sec. 2.1.1: "we use multiple phase center beamforming to form individual beams at the CHIME core and each Outrigger station"): four stations, six baselines, no random draw. CHIME sits at EPH's position.
- SEFDs: the ideal radiometer-equation values of HCO26 Sec. 5.1, SEFD_inp / √(N (N − 1)): CHIME 41.7 Jy (N = 960), KKO 629.9 Jy (64), HCO and GBO 313.7 Jy (128), with one feed's 40,000 Jy. Measured: HCO 530 Jy (XX), 390 Jy (YY); KKO about twice HCO; none for GBO. The baselines between outriggers are kept (VLBI26: in practice too faint for most bursts; whether the VLBI uses them is not published).
- The cylinder order A–D west to east is supported by HOLO24 Sec. 5 ("cylinder A being the farthest cylinder from the Galt telescope and cylinder D the closest", the Galt telescope 254 m east), no longer INFERRED.
- End feeds: OVW22 Sec. 4.1, "in December 2019 we began applying a static mask that consists of the 8 feeds at the edge of each cylinder" (a static mask in the cosmology pipeline, not "permanent").
- The east-west beam: FRB18's FoV matches the X polarization of the holographic beams (OVW22 Fig. 17; HOLO24), ≈ 20% wider than Y. The validate_int transit-time check tests the relation's arithmetic only.
- The point-source sky: the flux draw now spans 1 to 100 as its comments say (it stopped at 21.5).

## Completeness summary

**Site**: DRAO near Penticton, BC; lat 49.3207092, lon -119.6236774, height 555.372 m (EPH; the KKO24 ITRF centroid gives the same position to 0.1 m, DERIVED; FRB18 Table 1 gives 49 19 14.52 N, 119 37 25.25 W). Height datum uncertain (see conflicts).

**Cylinders and feeds (1024)**: four stationary parabolic cylinders, 20 m wide x 100 m long, axes north-south, focal length 5 m (f/D 0.25), 2 m gaps (22 m center to center, DERIVED), named A-D from west to east (INFERRED). Each focal line carries 256 dual-polarization (X east-west, Y north-south) cloverleaf feeds at 0.3048 m along its central 78 m. No survey of individual feed positions is published; the positions here follow that rule: e = -33, -11, +11, +33 m, n = (k - 127.5) x 0.3048 m, u = 0 (INFERRED). Bmax 101.97 m (DERIVED; OVW22 Table 2: 102 m), Bmin 0.3048 m. The 8 feeds at each end of each cylinder are masked statically (6.25%), and ~3% more fail the real-time tests (OVW22).

**Beam and drift**: no tracking; the sky drifts through a fixed fan beam on the meridian. E-W FWHM 2.5 deg at 400 MHz and 1.3 deg at 800 MHz (FRB18), i.e. ~1.0 deg / nu(GHz) (DERIVED); N-S extent ~110 deg (FRB18; ~120 deg OVW22, HOLO24; 100 deg VLBI26). Transit duration 10-5 min at the equator, 14-7 min at dec 45 deg, 24 h at the pole (FRB18), reproduced by t = FWHM / (15 deg/h cos dec) (DERIVED). FRB search: 1024 static formed beams (256 N-S FFT x 4 E-W), FWHM 40'-20'. 3/4 of the sky (31000 deg2) every day (OVW22).

**Band**: 400-800 MHz in 1024 channels of 390.625 kHz (DERIVED width; '390kHz' OVW22); FRB search 16k x 24.4 kHz at 0.983 ms (FRB18). **Sensitivity**: Tsys ~50 K on a dim sky, receiver 20-25 K (OVW22); per-feed SEFD ~4e4 Jy (KKO24, matching CHIME); collecting area 8000 m2 (FRB18).

**Outriggers**: KKO (64 feeds, 20 x 40 m, 66 km to the west, azimuth 280 deg; first light June 2022, science operations September 2023), GBO (128 feeds, 20 x 64 m, 3334 km to the east, azimuth 96 deg; built spring 2023), HCO (128 feeds, 20 x 80 m per HCO26, 955 km to the south, azimuth 189 deg; first light early 2025, commissioning paper September 2026). All 400-800 MHz CHIME-type cylinders rotated and rolled to view the DRAO meridian; triggered VLBI localizations of ~50 mas. Station positions from fitted ITRF/geocentric coordinates (KKO24, VLBI26); CHIME-frame ENU DERIVED. GBO's own commissioning paper is NOT FOUND (in preparation).

**Point-source field**: HOLO24 Table 1 lists 24 bright sources with declination and 600 MHz flux density (Cyg A 3613, Cas A 2375, Tau A 1142, Vir A 436 Jy ...); CHIME calibrates daily on Cas A, Cyg A, Tau A and Vir A (OVW22). RA (and catalog spectra) for 19 of the 24 come from the fluxcat catalogs that CHIME's software loads; RA for 5 is NOT FOUND.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| OVW22 | CHIME Collaboration (M. Amiri et al.), "An Overview of CHIME, the Canadian Hydrogen Intensity Mapping Experiment", ApJS 261, 29 (2022); arXiv:2201.07869v3 (24 May 2022): Sec. 2.1 Site, 2.2 Mechanical and Optical Design (Fig. 2), 2.3 Analog System, 3 Beams (Figs. 17-18), 4.1 Data Loss (Table 1), 4.2 Stability, 4.3 Noise, Appendix A Table 2. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2201.07869v3.pdf` | https://arxiv.org/pdf/2201.07869v3 |
| FRB18 | CHIME/FRB Collaboration (M. Amiri et al.), "The CHIME Fast Radio Burst Project: System Overview", ApJ 863, 48 (2018); arXiv:1803.11235v1 (29 Mar 2018): Sec. 2 and Table 1 (key properties of the CHIME telescope), Sec. 3.3 (FFT beamforming and channelization). Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_1803.11235v1.pdf` | https://arxiv.org/pdf/1803.11235v1 |
| HOLO24 | M. Amiri et al. (CHIME Collaboration), "Holographic Beam Measurements of the Canadian Hydrogen Intensity Mapping Experiment (CHIME)", ApJ 976, 163 (2024); arXiv:2408.00172v1 (31 Jul 2024): Sec. 1, Table 1 (24 holography sources: declination, flux density at 600 MHz), Sec. 2.2 (Galt telescope position), Fig. 10. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2408.00172v1.pdf` | https://arxiv.org/pdf/2408.00172v1 |
| DRONE | W. Tyndall et al., "Beam Maps of the Canadian Hydrogen Intensity Mapping Experiment (CHIME) Measured With a Drone", IEEE Open J. Antennas Propag. 6, 928 (2025); arXiv:2407.04848v2 (revised 29 Oct 2025): Sec. III (cylinder height above ground). Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2407.04848v2.pdf` | https://arxiv.org/pdf/2407.04848v2 |
| OUT25 | CHIME/FRB Collaboration, "CHIME/FRB Outriggers: Design Overview", ApJ 993, 55 (2025); arXiv:2504.05192v1 (7 Apr 2025; status "At the time of writing (early 2025)"): Abstract, Sec. 3.1 Geographic Array Design (3.1.3 Site selection), 3.2 Station Design, 6 Current Status and Outlook. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2504.05192v1.pdf` | https://arxiv.org/pdf/2504.05192v1 |
| KKO24 | A. E. Lanman et al. (CHIME/FRB Collaboration), "CHIME/FRB Outriggers: KKO Station System and Commissioning Results", AJ 168, 87 (2024); arXiv:2402.07898v2 (revised 29 May 2024): Sec. 1, Table 1 (characteristics of KKO), Sec. 2.1-2.3, 3.4.1 (SEFD), 3.5.1 (feed positions), 4.5 (ITRF positions of KKO and CHIME). Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2402.07898v2.pdf` | https://arxiv.org/pdf/2402.07898v2 |
| HCO26 | M. Lazda et al., "The CHIME/FRB Outriggers: Commissioning the Hat Creek Outrigger and an Updated Calibration Scheme ...", arXiv:2609.10686v1 (9 Sep 2026): Abstract, Sec. 2.1-2.3, Table 1 (characteristics of HCO). Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2609.10686v1.pdf` | https://arxiv.org/pdf/2609.10686v1 |
| VLBI26 | S. Andrew et al., "VLBI Astrometric Procedure and Performance with CHIME/FRB Outriggers", arXiv:2609.38344v1 (29 Sep 2026; submitted to ApJ): Sec. 2 (stations, baselines, beam footprint), Sec. 2.2 and Fig. 5 caption (fitted geocentric station positions of HCO and GBO). Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2609.38344v1.pdf` | https://arxiv.org/pdf/2609.38344v1 |
| EPH | CHIME collaboration software ch_ephem (GitHub chime-experiment/ch_ephem, commit 7ad5dd27f54f, 2026-07-15), ch_ephem/instruments.yaml: latitude, longitude, altitude, rotation and roll of chime, kko, gbo, hco (and galt, tone, pathfinder); also sources.py (the standard calibrator catalogs). Text only; not run. Commit record in github_api_commit_main.json. Fetched 2026-11-16 | `rawdata/interf/chime/ch_ephem/instruments.yaml` | https://raw.githubusercontent.com/chime-experiment/ch_ephem/7ad5dd27f54f83038bd101b030531842ff98c5ee/ch_ephem/instruments.yaml |
| EPHSRC | As EPH, ch_ephem/sources.py (source_dictionary built from the fluxcat catalogs). Text only; not run. Fetched 2026-11-16 | `rawdata/interf/chime/ch_ephem/sources.py` | https://raw.githubusercontent.com/chime-experiment/ch_ephem/7ad5dd27f54f83038bd101b030531842ff98c5ee/ch_ephem/sources.py |
| CHUTIL | CHIME collaboration software ch_util (GitHub chime-experiment/ch_util, commit ad4ae0efc7a4, 2026-09-04), ch_util/tools.py: _get_feed_position (feed y offsets in units of 0.3048 m within a cassette) and the cylinder-name map. Text only; not run. Fetched 2026-11-16 | `rawdata/interf/chime/ch_util/tools.py` | https://raw.githubusercontent.com/chime-experiment/ch_util/ad4ae0efc7a4d636680da10cc6324c36dc7221ba/ch_util/tools.py |
| FLUX | fluxcat (GitHub radiocosmology/fluxcat, commit 13825228d7e4, last pushed 2026-01-31), fluxcat/catalogs/primary_calibrators_perley2016.json: 20 calibrators with ra, dec (deg), spectral model CurvedPowerLaw and its parameters; the catalog CHIME's ch_ephem loads first. Data only. Fetched 2026-11-16 | `rawdata/interf/chime/fluxcat/primary_calibrators_perley2016.json` | https://raw.githubusercontent.com/radiocosmology/fluxcat/13825228d7e43466f3228962102b620407227045/fluxcat/catalogs/primary_calibrators_perley2016.json |
| FLUXCODE | As FLUX, fluxcat/core.py: definition of the CurvedPowerLaw model (ln S = a0 + a1 ln nu' + ..., nu' = nu / freq_pivot) and FREQ_NOMINAL = 600 MHz. Text only; not run. Fetched 2026-11-16 | `rawdata/interf/chime/fluxcat/core.py` | https://raw.githubusercontent.com/radiocosmology/fluxcat/13825228d7e43466f3228962102b620407227045/fluxcat/core.py |
| SPECFIND | As FLUX, fluxcat/catalogs/specfind_v2_5Jy_vollmer2009.json (194 sources; ra, dec, power-law fits pivoted at 600 MHz). Data only. Fetched 2026-11-16 | `rawdata/interf/chime/fluxcat/specfind_v2_5Jy_vollmer2009.json` | https://raw.githubusercontent.com/radiocosmology/fluxcat/13825228d7e43466f3228962102b620407227045/fluxcat/catalogs/specfind_v2_5Jy_vollmer2009.json |
| WEB | CHIME collaboration web site, Instrument page (chime-experiment.ca; page footer "© 2025"). Response headers in hdr_chime-experiment_instrument.txt. Fetched 2026-11-16 | `rawdata/interf/chime/chime-experiment_instrument.html` | https://chime-experiment.ca/en/instrument/ |
| ARXIV | arXiv API metadata (versions, dates, journal references) for the arXiv papers cited here and in chord.md. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_api_metadata_20261116.xml` | https://export.arxiv.org/api/query?id_list=... |

Also saved: `ch_ephem/observers.py`, `ch_util/ephemeris.py`, `ch_util/fluxcat.py` (pointers to the files above; not quoted) and the GitHub commit records `*/github_api_commit_main.json`.

## Site

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| site_name | Dominion Radio Astrophysical Observatory (DRAO), near Penticton, British Columbia, Canada |  | OVW22, Sec. 2.1 Site | "CHIME is built at the Dominion Radio Astrophysical Observatory (DRAO), near Penticton, B.C., Canada."<br>ALT: drift scan radio telescope at DRAO (OVW22, Abstract: "CHIME is located at the Dominion Radio Astrophysical Observatory near Penticton, BC Canada.") |
| lat_deg | 49.3207092194 | deg (N positive) | EPH, chime: latitude | "latitude: 49.3207092194"<br>DERIVED from the KKO24 ITRF centroid of CHIME (WGS84 ellipsoid): 49.320709 deg; FRB18's 49 19 14.52 N = 49.320700 deg<br>ALT: 49 19 14.52 N (FRB18, Table 1, Latitude: "Latitude 49◦19′14′′.52 North")<br>ALT: 49.3 (OVW22, Sec. 3.2, after Eq. 2: "where ` is the latitude of the observer (+49.3◦ for CHIME)") |
| lon_deg | -119.623677431 | deg (E positive; West negative) | EPH, chime: longitude | "longitude: -119.6236774310"<br>DERIVED from the KKO24 ITRF centroid: -119.623677 deg; FRB18's 119 37 25.25 W = -119.623681 deg (0.2 m west and 1.0 m south of the ITRF centroid, DERIVED)<br>ALT: 119 37 25.25 W (FRB18, Table 1, Longitude: "Longitude 119◦37′25′′.25 West") |
| elev_m | 555.372 | m (EPH header: above mean sea level; equals the WGS84 ellipsoidal height of the KKO24 ITRF centroid, see conflicts) | EPH, chime: altitude | "altitude: 555.372"<br>DERIVED: WGS84 ellipsoidal height of the KKO24 ITRF centroid = 555.4 m<br>ALT: ~600 m above sea level (INFERRED: KKO at 800 m is ~200 m higher) (KKO24, Sec. 2.1 Site: "being ∼ 200 m higher (at 800 m above sea level), it receives more precipitation") |
| reference_point | center of the focal lines (EPH); the KKO24 ITRF position is the mean position of all active feeds |  | EPH, comment above the chime record | "Calvin derived the horizontal position of the center of the focal lines..."<br>ALT: ITRF (-2059166.313, -3621302.972, 4814304.113) m (KKO24, Sec. 4.5.2: "(−2059166.313,−3621302.972,4814304.113) m")<br>ALT: centroid of active feeds (KKO24, Sec. 4.5.2: "The CHIME position (x̃CHIME) represents mean position of all active feeds in the CHIME array (the centroid)") |
| itrf_m | [-2059166.313, -3621302.972, 4814304.113] | m (ITRF, X Y Z) | KKO24, Sec. 4.5.2 Correlating & Fringe-Fitting | "(−2059166.313,−3621302.972,4814304.113) m"<br>DERIVED geodetic (WGS84): lat 49.320709, lon -119.623677, h 555.4 m |

## Cylinders

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| n_cylinders | 4 |  | OVW22, Abstract | "CHIME consists of four parallel cylindrical reflectors, oriented north-south, each 100m × 20m and outfitted with a 256 element dual-polarization linear feed array."<br>ALT: 4 (FRB18, Sec. 2: "The CHIME telescope (see Fig. 1) consists of four 20-m wide and 100-m long cylindrical paraboloidal reflectors.")<br>ALT: 4 (WEB, Telescope: "CHIME consists of four adjacent 20m x 100m cylindrical reflectors oriented north-south.") |
| cylinder_size_m | {"width": 20, "length": 100} | m (width E-W x length N-S) | OVW22, Sec. 2, Fig. 2 caption | "The parabolic reflecting surface of each of the four cylinders is 20m aperture, 5m focal length and 100m long."<br>ALT: {"width": 20} (OVW22, Appendix A, Table 2: "Cylinder width, wcyl (m) 20")<br>ALT: {"length": 100} (OVW22, Appendix A, Table 2: "Physical cylinder length (m) 100") |
| cylinder_axis | north-south (the cylinders are stationary) |  | FRB18, Sec. 2 | "The cylinders are stationary, aligned North-South."<br>ALT: no moving parts (OVW22, Sec. 2: "The optical system has no moving parts, and CHIME scans the sky as the Earth turns.") |
| focal_length_m | 5 | m (f/D = 0.25; the focal line is level with the reflector edges) | FRB18, Sec. 2 | "The focal length was chosen to be 5 m (f/D = 0.25) to place the feeds in the plane of the aperture"<br>ALT: f/0.25 (OVW22, Sec. 2.2: "choosing a reflector shape to be an f/0.25 parabola allows the use of feeds with approximately symmetric angular response patterns")<br>ALT: focus level with the reflector edges (OVW22, Sec. 2.2: "At this f-ratio, the focus is level with the edges of the reflector")<br>ALT: 0.25 (FRB18, Table 1: "Focal ratio, f/D 0.25") |
| cylinder_gap_m | 2 | m (edge to edge) | FRB18, Sec. 2 | "The inter-cylinder gaps are 2 m."<br>DERIVED: center-to-center spacing = 20 + 2 = 22 m; cylinder centers at e = -33, -11, +11, +33 m about the array center<br>ALT: 2 (OVW22, Appendix A, Table 2: "Cylinder spacing (edge-to-edge) (m) 2")<br>ALT: shortest E-W baseline 22 m (OVW22, Appendix A: "adjacent CHIME cylinders are separated by 2m (implying that the shortest nonzero East-West baseline is 22m)") |
| cylinder_order | A, B, C, D from west to east (INFERRED) |  | HOLO24, Fig. 10 caption | "given the absence of power beyond −10(+10)m for Cylinder A (D), where there is no other neighboring cylinder"<br>INFERRED: in the aperture coordinate x (+x east, OVW22 Sec. 2.2) cylinder A has no neighbor on its west (-x) side and D none on its east (+x) side, so A is the westernmost and D the easternmost; no source states the order outright<br>ALT: +X east, +Y north, +Z zenith (OVW22, Sec. 2.2: "We describe the layout of the telescope in a 3D Cartesian system with +Z pointing to the zenith, +X to the East and +Y North.")<br>ALT: cylinders named cylinder_A ... cylinder_D (CHUTIL, _get_input_props, pos_dict: ""cylinder_A": 2,")<br>ALT: N-S feed offset per cylinder counted from west to east (OVW22, Sec. 2.2 (continuation of 'per cylin-' after the page break): "der (from west to east). The quoted values were measured") |
| rotation_deg | 0.071 clockwise looking down (the structure's N-S axis lies 0.071 deg east of true north at its north end) | deg | OVW22, Sec. 2.2 | "This can be explained by a clockwise rotation (looking down from the sky) of the telescope structure by 0.071 ± 0.004° with respect to the true astronomical north-south direction."<br>DERIVED: at the end feeds (n = +-38.86 m) the rotation moves a feed 38.86 x tan(0.071 deg) = 0.048 m east-west; the feed table here leaves the rotation out<br>ALT: -0.071 (EPH, chime: rotation (degrees anti-clockwise looking down): "rotation: -0.071")<br>ALT: or a N-S offset of -2.73 cm per cylinder (OVW22, Sec. 2.2: "Alternatively, it can be explained by a linear offset in the north-south positions of the feeds from one cylinder to the next of −2.73 ± 0.15cm") |
| collecting_area_m2 | 8000 | m2 | FRB18, Table 1 | "Collecting area 8000 m2"<br>DERIVED: 4 x 20 m x 100 m = 8000 m2 (geometric area of the four reflectors) |
| cylinder_height_m | ~1 m (reflector above ground) | m | DRONE, Sec. III | "The height of the CHIME cylinders above ground is ∼1m" |

## Feeds

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| feeds_per_cylinder | 256 | dual-polarization feeds | OVW22, Sec. 2, Fig. 2 caption | "256 dual-polarization antennas are placed along the central 78m of the focal line of each cylinder, beneath an 88m×0.65m groundplane."<br>ALT: 256 (OVW22, Appendix A, Table 2: "Number of antennas per cylinder, Nant 256")<br>ALT: 256 feeds along 80 m (FRB18, Sec. 2: "A total of 256 dual-polarization feeds, spaced by 30 cm, are placed along 80 m of the focal line of each of the four cylinders, giving a total of 2048 signal paths.")<br>ALT: 2048 inputs (WEB, Telescope: "The 2048 signals from these inputs (256 antennas x 2 polarizations x 4 cylinders)") |
| feed_spacing_m | 0.3048 | m (along the focal line, the N-S axis) | OVW22, Appendix A, Table 2 | "Antenna spacing, dant (m) 0.3048"<br>DERIVED: 256 x 0.3048 = 78.03 m (the 'central 78 m'); the 256 feed centers span 255 x 0.3048 = 77.72 m<br>ALT: 0.305 (OVW22, Sec. 2.3: "Feeds are 305mm apart along the focal line (the telescope Y axis)")<br>ALT: 0.3 (FRB18, Sec. 2: "spaced by 30 cm")<br>ALT: 0.3 (OVW22, Sec. 4.5.1: "The spacing of feeds along the focal line is 30cm")<br>ALT: spacing set by machined cassettes of four feeds (OVW22, Sec. 2.3: "Thus, the inter-feed spacing is set by digital machining.")<br>ALT: feed y offset = (slot - 1.5) x 0.3048 m within a cassette (CHIME) (CHUTIL, _get_feed_position: "pos[1] += (float(slt.sn[-1]) - slot_factor) * 0.3048")<br>ALT: slot_factor 1.5 for CHIME, 0.5 for Outriggers (CHUTIL, _get_feed_position docstring: "1.5 for CHIME, 0.5 for Outriggers") |
| feed_rule | n_k = (k - 127.5) x 0.3048 m, k = 0..255 (k = 0 southernmost); e = cylinder center; u = 0 (INFERRED) | m | OVW22, Sec. 2, Fig. 2 caption | "256 dual-polarization antennas are placed along the central 78m of the focal line"<br>INFERRED: uniform 0.3048 m spacing centered on the cylinder's mid-point (central 78 m); all feeds at the height of the focal line (u = 0), as KKO24 assumes for its feeds; the feed numbering is a labeling choice here<br>ALT: z = 0 for all feeds (KKO24, Sec. 3.5.1: "Taking z = 0 for all feeds") |
| polarization | dual linear: X along east-west, Y along north-south (the focal-line axis) |  | OVW22, Sec. 2.2 | "Thus, the linear feed arrays are oriented along the Y axis with X and Y polarization directions."<br>ALT: orthogonal linear (FRB18, Table 1: "Polarization orthogonal linear") |
| feeds_flagged | ~9% of feed data: 16 per cylinder at the ends (8 at each end, INFERRED from 6.25% = 16/256) plus ~3% failing broker tests |  | OVW22, Sec. 4.1 and Table 1 | "in December 2019 we began applying a static mask that consists of the 8 feeds at the edge of each cylinder because it was determined that these feeds exhibit a highly non-redundant beam pattern."<br>DERIVED: 6.25% x 256 = 16 feeds per cylinder = 8 at each end (INFERRED reading of 'the 8 feeds at the edge'); 1 - (1 - 0.03)(1 - 0.0625) = 0.091<br>ALT: 6.25% (OVW22, Table 1: "Feed at ends of cylinder 6.25%")<br>ALT: 3% (OVW22, Sec. 4.1: "The flagging broker masks approximately 3% of inputs because they fail one or more of the tests")<br>ALT: 9% total (OVW22, Table 1: "Non-operational or malfunctioning feed 3%") |
| max_baseline_m | 102 | m | OVW22, Appendix A, Table 2 | "Maximum baseline, bmax (m) 102"<br>DERIVED from the feed rule: sqrt(66^2 + 77.724^2) = 101.97 m (A000 to D255); shortest 0.3048 m (adjacent feeds), shortest inter-cylinder E-W 22 m<br>ALT: 0.3048 (OVW22, Appendix A, Table 2: "Minimum baseline, bmin (m) 0.3048") |

Feed placement used in chime.json (DERIVED from the rule; INFERRED placement):

| cylinder | e (m) | n (m), k = 0 ... 255 | u (m) | statically masked |
|---|---|---|---|---|
| A | -33.0 | (k - 127.5) x 0.3048: -38.862 ... +38.862 | 0 | k = 0-7 and 248-255 |
| B | -11.0 | (k - 127.5) x 0.3048: -38.862 ... +38.862 | 0 | k = 0-7 and 248-255 |
| C | +11.0 | (k - 127.5) x 0.3048: -38.862 ... +38.862 | 0 | k = 0-7 and 248-255 |
| D | +33.0 | (k - 127.5) x 0.3048: -38.862 ... +38.862 | 0 | k = 0-7 and 248-255 |

- Frame: e east, n north, u up about the center of the four focal lines; the X polarization points east-west, Y north-south.
- Rotation: OVW22 finds the structure rotated 0.071 deg clockwise (looking down); applying the rotation moves the end feeds 4.8 cm east-west (DERIVED). Left out of the table.

## Primary beam and drift

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| ew_fwhm_deg | {"400MHz": 2.5, "800MHz": 1.3} | deg (E-W field of view at the low and high band edges) | FRB18, Table 1 and its note | "E-W FoV 2.5◦–1.3◦"<br>DERIVED: FWHM x nu = 2.5 x 0.4 = 1.00 deg GHz and 1.3 x 0.8 = 1.04 deg GHz, i.e. FWHM ~ 1.0 deg / nu(GHz) = 1.16-1.21 lambda / 20 m; 1.67 deg at 600 MHz<br>ALT: low and high frequency edges (FRB18, Table 1 note a: "Where two numbers appear, they refer to the low and high frequency edges of the band, respectively.")<br>ALT: measured FWHM ~1.5-4 deg, twice as large at 400 as at 800 MHz, X ~20% wider than Y, 30 MHz ripple (OVW22, Sec. 3.2.1, Fig. 17: "the FWHM is roughly twice as large at 400MHz as at 800MHz and ∼20% higher in the X polarization than in the Y polarization")<br>ALT: two degree wide stripe (OVW22, Abstract: "CHIME observes a two degree wide stripe covering the entire meridian at any given moment")<br>ALT: >~1 deg at 800 MHz (HOLO24, Sec. 1: "East-West profile formed by diffraction (width ≳1◦, from 800 MHz)")<br>ALT: ~2 deg (EW) x 100 deg (NS) (VLBI26, Sec. 2: "primary-beam footprint of ∼ 2◦ (EW) × 100◦ (NS)")<br>ALT: 3-degree wide strip (OUT25, Sec. 3.2.2: "a 3-degree wide strip between the North and South horizons over the local meridian at DRAO") |
| ns_fwhm_deg | 110 | deg (N-S field of view, along the cylinder axis; nearly independent of frequency) | FRB18, Table 1 | "N-S FoV ∼110◦"<br>DERIVED: a 110 deg N-S extent centered on the zenith reaches zenith angle 55 deg north and south: declinations from 49.32 - 55 = -5.7 deg upward, and past the pole to lower transits of sources north of dec 75.7 deg<br>ALT: ~120 deg (OVW22, Sec. 3.1: "∼120 degrees long in the unfocused North-South (N-S) direction, along the cylinder axis")<br>ALT: ~120 deg across the band (HOLO24, Sec. 1: "North-South profile which is essentially the broad (∼120◦ wide across the band) illumination pattern of the CHIME dipoles reflected to the sky")<br>ALT: 100 deg (VLBI26, Sec. 2: "primary-beam footprint of ∼ 2◦ (EW) × 100◦ (NS)")<br>ALT: feed beam width nearly independent of frequency (OVW22, Sec. 2.3: "the beam shape is broad and the beam width is largely independent of frequency over the CHIME band")<br>ALT: end feeds see the reflector to zenith angle 65 deg (OVW22, Sec. 2.2: "The 100m-long reflectors intercept the beams of the end feeds out to a zenith angle of 65°.") |
| fov_deg2 | ~200 | deg2 (instantaneous) | WEB, Instrument | "large instantaneous field of view (~200 square degrees)"<br>DERIVED: 110 deg x 1.67 deg (600 MHz) = 184 deg2<br>ALT: ~200 sq. deg. (FRB18, Sec. 1: "∼ 200 sq. deg. FoV") |
| transit_duration_min | {"equator": [10, 5], "dec45": [14, 7], "NCP": "24 h"} | min (at 400 and 800 MHz) | FRB18, Table 1 | "Source transit duration Equator: 10-5 min 45◦: 14-7 min North Celestial Pole: 24 hr"<br>DERIVED: t = FWHM_EW / (15 deg/h x cos dec): 2.5/15 h = 10.0 min and 1.3/15 h = 5.2 min at the equator; 14.1 and 7.4 min at dec 45 deg; at 600 MHz (1.67 deg) 6.7 min / cos dec |
| drift | transit telescope: the sky drifts through the fixed beam as the Earth turns; 3/4 of the sky every day |  | OVW22, Abstract | "observing 3/4 of the sky every day due to Earth rotation"<br>ALT: 31000 deg2, fsky ~0.75 (OVW22, Appendix A: "The sky coverage of CHIME, Ssky, is 31000deg2")<br>ALT: transit telescope (OVW22, Sec. 2: "CHIME is a transit radio telescope.") |
| formed_beams | 1024 static beams: 256 N-S (FFT) x 4 E-W (exact phasing); FWHM 40'-20' (400-800 MHz) |  | FRB18, Sec. 3.3 | "we synthesize 256 formed beams via a Fast Fourier Transform (FFT) algorithm along the North-South direction."<br>ALT: 4 E-W beams (FRB18, Sec. 3.3: "In the East-West direction, we form four beams via exact phasing.")<br>ALT: 1024 (FRB18, Sec. 3.3: "These give a total of 1024 discrete formed static beams")<br>ALT: N-S beams evenly spaced in sin(zenith angle) over ~110 deg (FRB18, Sec. 3.3: "are tiled across a runtime-defined range of angles (nominally ∼ 110◦ ), evenly spaced in sinθ space")<br>ALT: 40'-20' (FRB18, Table 1: "Beam width (FWHM) 40′–20′") |

Transit time through the E-W FWHM, t = FWHM / (15 deg/h x cos dec) (DERIVED; FWHM 2.5 deg at 400 MHz and 1.3 deg at 800 MHz from FRB18, 1.67 deg at 600 MHz from the DERIVED 1.0 deg / nu(GHz)):

| dec (deg) | 400 MHz (min) | 600 MHz (min) | 800 MHz (min) |
|---|---|---|---|
| 0 | 10.0 | 6.7 | 5.2 |
| 20 | 10.6 | 7.1 | 5.5 |
| 45 | 14.1 | 9.4 | 7.4 |
| 60 | 20.0 | 13.3 | 10.4 |
| 75 | 38.6 | 25.8 | 20.1 |

## Band and channels

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| freq_range | [0.4, 0.8] | GHz | OVW22, Abstract | "drift scan radio telescope operating across the 400MHz to 800MHz band"<br>DERIVED: bandwidth 0.4 GHz, sampled at once (800 MSPS, second Nyquist zone)<br>ALT: 400-800 MHz (FRB18, Table 1: "Frequency range 400–800 MHz")<br>ALT: sharp edges at 400 and 800 MHz (OVW22, Sec. 2.3: "The very sharp band edges at 400MHz and 800MHz are designed to allow half-Nyquist sampling of the signal.") |
| channels | {"n": 1024, "width_kHz": 390.625} |  | OVW22, Abstract | "feed correlation matrix is formed for 1024 frequency channels across the band every 31ms"<br>DERIVED: 400 MHz / 1024 = 390.625 kHz per channel<br>ALT: 390 kHz (OVW22, Sec. 2: "CHIME’s frequency resolution is 390kHz.")<br>ALT: FRB search: 16k channels of 24.4 kHz at 0.983 ms (FRB18, Sec. 3.3: "producing a Stokes-I data stream with a cadence of 0.983 ms and a spectral resolution of 24.4 kHz")<br>ALT: outriggers: 1024 x 390 kHz (OUT25, Sec. 3.2.3: "producing 1024 channels, each 390 kHz wide.") |

## Sensitivity

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| tsys_K | 50 | K (dim sky transiting; referred to the LNA input; strong spectral ripple) | OVW22, Sec. 4.3 | "The system temperature when a dim part of the radio sky is transiting overhead is approximately 50K"<br>ALT: receiver 20-25 K (OVW22, Sec. 4.3: "The receiver temperature increases from approximately 20K at 400MHz to 25K at 800MHz.")<br>ALT: 55 (OVW22, Appendix A.3 (forecast): "For the system temperature Tsys(z), we use a constant 55K")<br>ALT: receiver noise temperature 50 K (FRB18, Table 1: "Receiver noise temperature 50 K") |
| sefd_per_feed_Jy | 40000.0 | Jy (per feed and polarization; KKO, stated to match CHIME) | KKO24, Sec. 3.4.1 | "scale of ∼ 4 × 104 Jy corresponds to a system temperature of about 113 K, assuming an effective area of 7.8 m2 for each feed"<br>text layer renders 10^4 as '104' and m^2 as 'm2'; DERIVED: 2 k T / A_eff = 2 x 1.380649e-23 x 113 / 7.8 / 1e-26 = 4.0e4 Jy<br>ALT: consistent with CHIME (KKO24, Sec. 3.4.1: "These observed values are consistent with the equivalent results from CHIME, as expected since the analog hardware is the same.") |

## Outriggers: network

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| outrigger_network | three CHIME-like cylinder stations: KKO (~66 km), GBO (~3300 km), HCO (~955 km); ~50 mas localizations by VLBI |  | OUT25, Abstract | "the Outriggers will provide ∼ 50 milliarcsecond localization precision for the majority of detected FRBs"<br>ALT: one ~100 km and two ~1000 km stations (OUT25, Sec. 3.1.2: "our design comprises one station at a ∼ 100km distance scale from CHIME, and two more at ∼1000km from CHIME.")<br>ALT: each a single CHIME cylinder, rotated and rolled (KKO24, Sec. 1: "Each outrigger is a single CHIME cylinder, rotated and rolled such that its field of view overlaps with the CHIME field of view.")<br>ALT: 40 s baseband buffer, triggered by CHIME (KKO24, Sec. 1: "Each outrigger maintains a 40 s buffer of baseband data, which it will write to disk upon receiving an FRB detection trigger from CHIME.")<br>ALT: 64 / 128 / 128 feeds (VLBI26, Sec. 2: "CHIME contains 1024 dual-polarized feeds; its k’niPatn k’l⌣ stk’masqt Outrigger (KKO) contains 64; and its Outriggers in Green Bank (GBO) and Hat Creek (HCO) each contain 128")<br>ALT: feeds at 305 mm; 64 for KKO, 128 for the others (OUT25, Sec. 3.2.3: "spaced by 305mm, for a total of 64 feeds for KKO and 128 for the other two.")<br>ALT: 400-800 MHz at all stations (VLBI26, Sec. 2: "CHIME and its Outriggers are each stand-alone interferometers operating from 400–800MHz") |

Station positions (DERIVED from the fitted ITRF/geocentric coordinates; WGS84; ENU in CHIME's tangent frame, u includes Earth curvature):

| station | feeds | lat (deg) | lon (deg) | h (m, ellipsoid) | e (km) | n (km) | u (km) | chord to CHIME (km) | published distance | axis rotation (EPH, deg anticlockwise) |
|---|---|---|---|---|---|---|---|---|---|---|
| KKO | 64 | 49.418973 | -120.525112 | 804.2 | -65.41 | +11.32 | -0.10 | 66.38 | 66.2 projected (KKO24); 66 (OUT25) | 0.6874 |
| GBO | 128 | 38.435868 | -79.826180 | 807.5 | +3202.38 | -323.23 | -869.83 | 3334.12 | 3334 (VLBI26); 3370 (OUT25) | -27.3745 |
| HCO | 128 | 40.817509 | -121.466021 | 1019.5 | -155.43 | -939.78 | -71.15 | 955.2 | 955.2 (HCO26); 956 (OUT25) | 1.145 |

Outrigger-outrigger chords (DERIVED): KKO-HCO 957.99 km, KKO-GBO 3398.07 km, HCO-GBO 3506.13 km. Longest feed-pair separation in CHIME_OUTRIGGERS: 3334.16 km (A255-GBO000).

## Outriggers: KKO (k'niPatn k'l stk'masqt, near Princeton, BC)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| kko_location | 49 25 08.5794 N, 120 31 31.08 W; 4 km south of Princeton, BC |  | KKO24, Table 1 | "Geographic location 49◦ 25’ 8.5794” N 120◦ 31’ 31.08” W"<br>DERIVED: 49.419050, -120.525300 deg (equal to EPH's kko record); 15.9 m from the fitted KKO24 array position (DERIVED)<br>ALT: 4 km south of Princeton, BC (KKO24, Sec. 2.1: "The KKO site is located 4 kilometers South of Princeton, BC, on the North slopes of Agate and Copper Mountains.")<br>ALT: {"latitude": 49.41905, "longitude": -120.5253, "altitude": 835.0} (EPH, kko: "latitude: 49.41905")<br>ALT: rough position (EPH, comment above kko: "Rough position for outriggers.") |
| kko_itrf_m | [-2111752.244, -3581453.556, 4821610.081] | m (ITRF; fitted, MJD 59935, CHIME position held fixed) | KKO24, Sec. 4.5.3 | "(−2111752.244+1.363 −1.364,−3581453.556+0.889 −0.908,4821610.081+0.595 −0.550) m"<br>DERIVED: lat 49.418973, lon -120.525112, h 804.2 m (WGS84); 66.38 km from CHIME (chord); CHIME-frame ENU (-65.41, +11.32, -0.10) km<br>ALT: [-2111738.254, -3581458.22, 4821611.987] (KKO24, Sec. 4.5.2 (fiducial: GPS clock, ~15 m from the array center): "(−2111738.254,−3581458.22,4821611.987) m") |
| kko_elev_m | 800 | m above sea level | KKO24, Table 1 | "Elevation 800m"<br>ALT: 835.0 (EPH, kko: altitude: "altitude: 835.")<br>ALT: 804.2 (DERIVED ellipsoidal height of the fitted ITRF position) (KKO24, Sec. 4.5.3: "this baseline correction yields a KKO position of") |
| kko_baseline_km | 66.2 | km (projected, for a target at CHIME's zenith) | KKO24, Table 1 | "Baseline to CHIMEa 66.2km"<br>DERIVED from the ITRF positions: chord 66.38 km; horizontal component 66.37 km<br>ALT: 66 (OUT25, Sec. 3.1.3: "At 66 km line-of-sight distance to CHIME")<br>ALT: projected for a target at the CHIME zenith (KKO24, Table 1 note a: "Projected baseline for the target at the CHIME zenith.") |
| kko_cylinder | {"width_m": 20, "length_m": 40, "instrumented_m": 19.5, "focal_m": 5, "feeds": 64} |  | KKO24, Table 1 | "Cylinder width 20m Cylinder length 40m Instrumented cylinder length 19.5m Number of dual-polarization feeds 64"<br>DERIVED: 64 x 0.3048 = 19.51 m<br>ALT: 20 m x 40 m, 5 m focal length, central 20 m fitted (KKO24, Sec. 2.2: "It is a cylindrical paraboloid 20 meters wide and 40 meters long, with a 5 meter focal length. The central 20 meters of the focal line is fitted with a linear focal-plane array of feeds and receivers.")<br>ALT: 305 mm spacing (KKO24, Sec. 2.3: "Feed spacing along the focal line is 305 mm, identical to CHIME.")<br>ALT: 1/16 of CHIME's area (KKO24, Sec. 2: "The biggest difference is the scale of the system, which has 1/16 of CHIME’s collecting area.") |
| kko_orientation | {"rotation_deg": 0.69, "tilt_deg": 0.59} | deg (axis rotated from N-S, tipped toward the east) | KKO24, Sec. 2.2 | "the rotation of 0.69◦ and tilt of 0.59◦, are not apparent to the naked eye"<br>ALT: {"rotation": 0.6874, "roll": 0.5888} (EPH, kko: "rotation: 0.6874")<br>ALT: tipped slightly to the east (KKO24, Sec. 2.2: "Its long axis is aligned approximately North-South, rotated from the NS line and tipped slightly to the East so that the telescope sees exactly the same sky as CHIME.") |
| kko_online | first light June 2022; full science operations September 2023 |  | KKO24, Sec. 1 | "saw first light in June of 2022 and reached full science operations in September of 2023"<br>ALT: construction completed summer 2022 (OUT25, Sec. 6: "Construction of the KKO station was completed in the Summer of 2022.") |

## Outriggers: GBO (Green Bank Observatory, West Virginia)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| gbo_location | Green Bank Observatory, West Virginia |  | OUT25, Sec. 3.1.3 | "The second site selected was at the Green Bank Observatory (GBO) in West Virginia."<br>ALT: {"latitude": 38.436122, "longitude": -79.827922, "altitude": 826.01} (EPH, gbo: "latitude: 38.436122") |
| gbo_itrf_m | [883728.0, -4924463.3, 3943957.56] | m (geocentric; best fit from VLBI calibrators) | VLBI26, Fig. 5 caption | "(883728.0m, -4924463.3m, 3943957.56m) for GBO"<br>DERIVED: lat 38.435868, lon -79.826180, h 807.5 m (WGS84); 3334.12 km from CHIME (chord); CHIME-frame ENU (+3202.38, -323.23, -869.83) km; 157 m from the EPH gbo record (DERIVED) |
| gbo_baseline_km | 3334 | km | VLBI26, Sec. 2 | "CHIME-GBO (3334km predominantly east–west)"<br>DERIVED from the ITRF positions: chord 3334.12 km<br>ALT: 3370 (OUT25, Sec. 3.1.3: "At 3370km from CHIME, it forms the longest baseline") |
| gbo_cylinder | {"width_m": 20, "length_m": 64, "instrumented_m": 40, "feeds": 128} |  | OUT25, Sec. 3.2.3 | "achieved for the GBO and HCRO stations with single cylinders with 40m of instrumentation. This becomes a total reflector length of 64m"<br>DERIVED: 128 x 0.3048 = 39.0 m instrumented |
| gbo_orientation | {"rotation_deg": -27.3745, "roll_deg": -30.0871} | deg (EPH conventions: rotation anticlockwise looking down; roll eastward from vertical) | EPH, gbo | "rotation: -27.3745"<br>EPH roll line: 'roll: -30.0871' (a westward roll of 30 deg toward the DRAO meridian)<br>ALT: substantial roll and rotation (OUT25, Fig. 3 caption: "Due to its Eastward location, the GBO station requires a substantial axial roll and a rotation from local North")<br>ALT: -30.0871 (EPH, gbo: roll: "roll: -30.0871") |
| gbo_online | construction completed spring 2023; commissioning began April 2023; operational by early 2025 |  | OUT25, Sec. 6 | "Construction of the GBO station was completed in Spring of 2023."<br>ALT: commissioning from April 2023 (KKO24, Sec. 1: "began commissioning in April 2023")<br>ALT: operational (early 2025) (OUT25, Sec. 6: "Two of the three Outriggers, KKO and the GBO station, are fully constructed and operational") |

## Outriggers: HCO (Hat Creek Radio Observatory, California)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| hco_location | 40 49 03.07 N, 121 27 57.66 W; Hat Creek Radio Observatory, northern California |  | HCO26, Table 1 | "Geographic location 40◦ 49′ 3′′ .07N 121◦ 27′ 57′′ .66W"<br>DERIVED: 40.817519, -121.466017 deg; 1.3 m from the VLBI26 fitted position (DERIVED)<br>ALT: {"latitude": 40.8171082, "longitude": -121.4689584, "altitude": 1019.86} (EPH, hco: "latitude: 40.8171082") |
| hco_elev_m | 1019.34 | m | HCO26, Table 1 | "Elevation 1019.34m"<br>ALT: 1019.86 (EPH, hco: altitude: "altitude: 1019.86") |
| hco_itrf_m | [-2523644.2, -4123700.4, 4147773.46] | m (geocentric; best fit from VLBI calibrators) | VLBI26, Fig. 5 caption | "(-2523644.2m,-4123700.4m,4147773.46m) for HCO"<br>DERIVED: lat 40.817509, lon -121.466021, h 1019.5 m (WGS84); 955.20 km from CHIME (chord); CHIME-frame ENU (-155.43, -939.78, -71.15) km |
| hco_baseline_km | 955.2 | km (projected, for a target at CHIME's zenith) | HCO26, Table 1 | "Baseline to CHIMEa 955.2km"<br>DERIVED from the ITRF positions: chord 955.20 km; horizontal component 952.55 km<br>ALT: 956 (OUT25, Sec. 3.1.3: "Being 956km south of CHIME")<br>ALT: 955 (VLBI26, Sec. 2: "CHIME-HCO (955km predominantly north–south)") |
| hco_cylinder | {"width_m": 20, "length_m": 80, "instrumented_m": 39, "feeds": 128} |  | HCO26, Table 1 | "Cylinder width 20m Cylinder length 80m Instrumented cylinder length 39m"<br>ALT: 128 feeds along the inner 39 m (HCO26, Sec. 2.2: "The cylinder is populated with 128 dual linearly polarized antennas along the inner 39m of the focal line relative to the center of the cylinder.")<br>ALT: 64 m total length (OUT25, Sec. 3.2.3: "This becomes a total reflector length of 64m") |
| hco_orientation | {"roll_deg": 1.4, "rotation_deg_east_of_north": 1.22} | deg | HCO26, Sec. 2.2 | "marginally rolled by 1.4 degrees and rotated 1.22 degrees East of North"<br>ALT: {"rotation": 1.145, "roll": 1.0556} (EPH, hco: "rotation: 1.145") |
| hco_online | structure summer 2024; digital system early 2025, first light shortly after; commissioning (2025-2026) |  | OUT25, Sec. 6 | "Deployment of the digital instrumentation occurred in early 2025, with first light achieved shortly thereafter."<br>ALT: structure and reflector summer 2024 (OUT25, Sec. 6: "the HCRO station saw the completion of its telescope structure and reflector in the Summer of 2024")<br>ALT: third and final Outrigger (commissioning paper, Sep 2026) (HCO26, Sec. 1: "HCO is the third and final Outrigger telescope part of the CHIME/FRB Outrigger array") |

Other VLBI elements seen in the sources and left out: the TONE pathfinder at GBO (EPH record 'tone'), the Algonquin Radio Observatory used for early pulsar VLBI (OUT25 Sec. 4.2.2), and the John A. Galt 26 m telescope at DRAO, 254 m east, 22 m north and 19 m above the CHIME center (HOLO24), used for holography.

## Point-source field

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| calibrators_daily | Cas A, Cyg A, Tau A, Vir A (four transits a day; usually the brightest night-time transit is the primary) |  | OVW22, Sec. 4.2 | "The broker computes and stores gains using data from four bright source transits every day: Cassiopeia A, Cygnus A, Taurus A, and Virgo A"<br>ALT: 37 sources > 10 Jy at 600 MHz (OVW22, Sec. 3.2.2: "There are 37 bright point sources in CHIME’s declination range with flux greater than 10Jy at 600MHz")<br>ALT: standard catalog: primary_calibrators_perley2016 first (EPHSRC, source_dictionary: ""primary_calibrators_perley2016",")<br>ALT: pivot 600 MHz (FLUXCODE, constants: "FREQ_NOMINAL = 600.0") |

HOLO24 Table 1 (dec and S600 verbatim; each row quoted in the machine check) with RA, catalog dec and the catalog model's S600 from fluxcat (FLUX = primary_calibrators_perley2016, SPECFIND = specfind_v2_5Jy_vollmer2009; S_model DERIVED from the stored fit):

| source | dec (deg, HOLO24) | S600 (Jy, HOLO24) | conf. noise (%) | catalog key | RA (deg) | dec (deg, catalog) | S600 model (Jy) |
|---|---|---|---|---|---|---|---|
| Cygnus A | 40.7 | 3613 | 0.02 | FLUX:CYG_A | 299.86815 | 40.73392 | 3638.4 |
| Cassiopeia A | 58.8 | 2375 | 0.03 | FLUX:CAS_A | 350.86642 | 58.81178 | 3343.8 |
| Taurus A | 22.0 | 1142 | 0.06 | FLUX:TAU_A | 83.63321 | 22.01446 | 995.8 |
| Virgo A | 12.4 | 436 | .2 | FLUX:VIR_A | 187.70593 | 12.39112 | 421.0 |
| Hercules A | 5.0 | 120 | .6 | FLUX:HERCULES_A | 252.78395 | 4.99259 | 112.8 |
| 3C353 | -1.0 | 106 | .7 | FLUX:3C_353 | 260.11733 | -0.97962 | 102.8 |
| Hydra A | -12.1 | 97 | .7 | FLUX:HYDRA_A | 139.52362 | -12.09554 | 95.3 |
| Perseus B | 29.7 | 87 | .8 | NOT FOUND | NOT FOUND | | |
| 3C10C | 64.2 | 71 | 7 | SPECFIND:SN_1572A | 6.3083 | 64.14431 | 70.1 |
| 3C273 | 2.1 | 55 | 1 | NOT FOUND | NOT FOUND | | |
| 3C84 | 41.5 | 38 | 10 | NOT FOUND | NOT FOUND | | |
| 3C295 | 52.2 | 37 | 2 | FLUX:3C_295 | 212.8355 | 52.20277 | 42.3 |
| 3C58 | 64.8 | 31 | 2 | SPECFIND:SNR_G130.7+03.1 | 31.39683 | 64.82633 | 32.4 |
| 3C161 | -5.9 | 30 | 2 | SPECFIND:2C_553 | 96.79215 | -5.88477 | 33.6 |
| 3C147 | 49.9 | 29 | 2 | FLUX:3C_147 | 85.65057 | 49.85201 | 39.4 |
| 3C111 | 38.0 | 29 | 2 | NOT FOUND | NOT FOUND | | |
| 3C196 | 48.2 | 28 | 2 | FLUX:3C_196 | 123.40014 | 48.21738 | 29.5 |
| 3C409 | 23.6 | 27 | 3 | SPECFIND:3C_409 | 303.61499 | 23.58136 | 26.7 |
| 3C358 | -21.5 | 26 | 3 | NOT FOUND | NOT FOUND | | |
| 3C48 | 33.2 | 25 | 3 | FLUX:3C_48 | 24.42208 | 33.15976 | 30.4 |
| 3C286 | 30.5 | 18 | 4 | FLUX:3C_286 | 202.78453 | 30.50915 | 21.8 |
| 3C454.3 | 16.1 | 12 | 6 | SPECFIND:3C_454.3 | 343.49062 | 16.14821 | 11.9 |
| 3C78 | 4.1 | 11 | 6 | SPECFIND:NGC_1218 | 47.10927 | 4.11092 | 10.5 |
| 3C138 | 16.6 | 10 | 7 | FLUX:3C_138 | 80.29119 | 16.63946 | 12.9 |

The match of HOLO24's 3C10C to SPECFIND's SN_1572A (alias 3C_10, dec 64.14 deg) is INFERRED from the shared 3C number and declination; 3C161, 3C58 and 3C78 match through the aliases 3C_161, 3C_58 and 3C_78 (quoted).

The 20 primary calibrators of FLUX (RA, dec verbatim; S at 400/600/800 MHz DERIVED from the stored CurvedPowerLaw fit, S = a0 exp(sum a_i x^i), x = ln(nu / pivot)):

| key | RA (deg) | dec (deg) | S400 (Jy) | S600 (Jy) | S800 (Jy) |
|---|---|---|---|---|---|
| CYG_A | 299.86815 | 40.73392 | 5159.6 | 3638.4 | 2784.8 |
| CAS_A | 350.86642 | 58.81178 | 4534.2 | 3343.8 | 2697.7 |
| TAU_A | 83.63321 | 22.01446 | 1083.3 | 995.8 | 938.1 |
| VIR_A | 187.70593 | 12.39112 | 578.1 | 421.0 | 334.8 |
| FORNAX_A | 50.67383 | -37.20823 | 302.7 | 231.5 | 191.5 |
| PICTOR_A | 79.95717 | -45.77883 | 167.3 | 125.9 | 102.3 |
| HERCULES_A | 252.78395 | 4.99259 | 166.9 | 112.8 | 84.8 |
| 3C_353 | 260.11733 | -0.97962 | 133.3 | 102.8 | 84.9 |
| HYDRA_A | 139.52362 | -12.09554 | 135.8 | 95.3 | 73.7 |
| 3C_123 | 69.26823 | 29.6705 | 126.1 | 93.7 | 75.4 |
| 3C_295 | 212.8355 | 52.20277 | 54.2 | 42.3 | 34.8 |
| 3C_147 | 85.65057 | 49.85201 | 49.1 | 39.4 | 32.9 |
| 3C_48 | 24.42208 | 33.15976 | 39.1 | 30.4 | 24.9 |
| 3C_196 | 123.40014 | 48.21738 | 40.2 | 29.5 | 23.4 |
| 3C_380 | 277.38242 | 48.74616 | 35.7 | 25.7 | 20.4 |
| 3C_286 | 202.78453 | 30.50915 | 24.9 | 21.8 | 19.5 |
| 3C_444 | 333.60725 | -17.02661 | 31.6 | 21.2 | 16.0 |
| PKS_J0133-3629 | 23.49058 | -36.49325 | 18.7 | 15.1 | 12.8 |
| PKS_J0444-2809 | 71.15708 | -28.16514 | 20.3 | 14.6 | 11.4 |
| 3C_138 | 80.29119 | 16.63946 | 15.3 | 12.9 | 11.4 |

Transit elevation at CHIME, 90 - (49.32 - dec) (DERIVED): Fornax A 3.5 deg, PKS J0133-3629 4.2 deg, PKS J0444-2809 12.5 deg; Pictor A (-5.1 deg) never rises. These four lie outside the ~110 deg N-S beam.

## Not found

- Surveyed positions of individual CHIME feeds: the published papers give the rule (256 feeds at 0.3048 m along the central 78 m of each focal line; 22 m between cylinder centers); ch_util reads per-cassette offsets from a layout database that is not public. The positions here follow the rule (INFERRED).
- An explicit statement of the cylinder order (A-D west to east): INFERRED from HOLO24 Fig. 10.
- The ground height of each cylinder or terrain slope at DRAO: feeds are placed at u = 0 (the focal-line height) as KKO24 does for KKO.
- A published E-W primary-beam FWHM as a formula or table vs frequency: only the band-edge values 2.5 and 1.3 deg (FRB18) and the measured scatter plot (OVW22 Fig. 17); the 1.0 deg / nu(GHz) relation is DERIVED.
- Right ascensions for Perseus B, 3C273, 3C84, 3C111 and 3C358 (HOLO24 Table 1 lists declination only; neither saved fluxcat catalog contains these five).
- A published CHIME declination limit: 3/4 of the sky and 31000 deg2 are stated (OVW22); the southern limit near dec -6 deg is DERIVED from the 110 deg N-S field.
- Feed counts that are flagged at a given time (beyond the 16 per cylinder static edge mask and the ~3% broker average).
- The GBO station's own commissioning paper (Nimmo et al., in prep., cited by HCO26): GBO's geographic coordinates come from EPH and the VLBI26 fit; its cylinder length and feed count from OUT25.
- Survey positions of individual outrigger feeds (DERIVED here from station center + 0.3048 m spacing along the rotated axis; roll left out).
- Datum of EPH altitudes (header says above mean sea level; CHIME's value equals its ellipsoidal height).

## Conflicts

- Feed spacing: 0.3048 m (OVW22 Table 2; CHUTIL) vs 305 mm (OVW22 Sec. 2.3; KKO24; OUT25) vs 30 cm (FRB18; OVW22 Sec. 4.5.1). Adopted 0.3048 m (1 ft); the others are roundings.
- Instrumented length: central 78 m (OVW22) vs 80 m (FRB18). 256 x 0.3048 = 78.0 m (DERIVED).
- N-S beam extent: ~110 deg (FRB18 Table 1, formed-beam tiling) vs ~120 deg (OVW22, HOLO24) vs ~100 deg (VLBI26).
- E-W beam width: 2.5-1.3 deg across the band (FRB18) vs 'two degree wide stripe' (OVW22 abstract), 1.5-4 deg measured scatter (OVW22 Fig. 17), '3-degree wide strip' (OUT25).
- System temperature: ~50 K with a dim sky (OVW22 Sec. 4.3), 55 K in the forecast (OVW22 App. A), 'Receiver noise temperature 50 K' (FRB18) vs measured receiver temperature 20-25 K (OVW22 Sec. 4.3).
- CHIME orientation: a clockwise rotation of 0.071 deg (OVW22, EPH -0.071 anticlockwise) or a -2.73 cm N-S feed offset per cylinder (OVW22); OVW22 adopts the rotation.
- CHIME height datum: EPH 555.372 m 'above mean sea level' equals the WGS84 ellipsoidal height of the KKO24 ITRF centroid (555.4 m, DERIVED); KKO24 implies CHIME near 600 m above sea level (KKO at 800 m, '~200 m higher').
- CHIME-GBO distance: 3370 km (OUT25) vs 3334 km (VLBI26) vs 3334.12 km chord from the fitted positions (DERIVED).
- CHIME-KKO distance: 66.2 km 'projected for a target at the CHIME zenith' (KKO24 Table 1) vs 66 km (OUT25) vs 66.38 km chord and 66.37 km horizontal (DERIVED).
- CHIME-HCO distance: 955.2 km 'projected' (HCO26 Table 1) vs 956 km (OUT25), 955 km (VLBI26); DERIVED chord 955.20 km, horizontal 952.55 km. HCO26's 955.2 km equals the chord, not the horizontal projection.
- HCO cylinder length: 80 m (HCO26 Table 1 and Sec. 2.2) vs 64 m total for the GBO and HCRO stations (OUT25 Sec. 3.2.3). Instrumented 39 m (HCO26) vs 40 m (OUT25); 128 x 0.3048 = 39.0 m (DERIVED).
- HCO orientation: roll 1.4 deg, rotation 1.22 deg 'East of North' (HCO26) vs roll 1.0556, rotation +1.145 anticlockwise, i.e. west of north (EPH). The sense and size of the rotation disagree.
- KKO elevation: 800 m (KKO24 Table 1) vs 835 m (EPH, 'rough position') vs 804.2 m ellipsoidal from the fitted ITRF position (DERIVED).
- KKO instrumented length: 19.5 m (KKO24 Table 1) vs 'central 20 meters' (KKO24 Sec. 2.2) vs '20m of instrumentation' (OUT25).
- Cas A at 600 MHz: 2375 Jy (HOLO24 Table 1) vs 3344 Jy from the fluxcat Perley-2016 fit (DERIVED; the stored CurvedPowerLaw model has no time dependence). Tau A: 1142 Jy (HOLO24) vs 996 Jy (fit). Cyg A agrees (3613 vs 3638 Jy); Vir A 436 vs 421 Jy.
- GBO position: EPH gbo record (38.436122, -79.827922, 826.01 m) lies 157 m from the VLBI26 fitted position (DERIVED); EPH also keeps a separate 'tone' record (TONE pathfinder at GBO, 38.4293, -79.8452).

## Notes

- Feed positions: e = -33, -11, +11, +33 m for cylinders A-D (west to east, INFERRED order); n = (k - 127.5) x 0.3048 m for k = 0..255; u = 0. Bmax 101.97 m (A000-D255), Bmin 0.3048 m (DERIVED). The 0.071 deg clockwise structure rotation (OVW22) is left out (4.8 cm at the end feeds).
- Beam: each feed's primary beam is ~1.0 deg / nu(GHz) wide east-west (FRB18 band edges 2.5 and 1.3 deg; DERIVED relation) and ~110-120 deg north-south. A source transits in t = FWHM_EW / (15 deg/h x cos dec): 6.7 min / cos dec at 600 MHz (DERIVED).
- Outriggers in CHIME's tangent frame (DERIVED from KKO24 and VLBI26 positions): KKO (-65.41, +11.32, -0.10) km, HCO (-155.43, -939.78, -71.15) km, GBO (+3202.38, -323.23, -869.83) km; chords 66.38, 955.20, 3334.12 km; KKO-HCO 957.99 km, KKO-GBO 3398.07 km, HCO-GBO 3506.13 km.
- Point-source field: HOLO24 Table 1 (24 sources of 10 Jy or more at 600 MHz, dec -21.5 to +64.8) with RA from fluxcat for 19 of the 24; the four daily calibrators are Cyg A (3613 Jy), Cas A (2375 Jy), Tau A (1142 Jy), Vir A (436 Jy) at 600 MHz (HOLO24).

## Machine check

237 quotes machine-checked against the saved files' extracted text (pdftotext -layout and -raw, and PyMuPDF, for PDFs; tag-stripped and entity-decoded text for HTML; YAML, JSON, Python and XML files as is): all pass, 234 after normalization and 3 only with all whitespace removed (two line-broken KKO24 sentences and one OVW22 sentence); all 16 sources quoted; the 24 HOLO24 Table 1 rows and the fluxcat positions are among the quotes checked. 171 value checks pass (shared with chord.json): EPH latitudes, longitudes, altitudes, rotations and rolls equal instruments.yaml; the ITRF values equal the numbers in their quotes; all RA and dec values equal the fluxcat files; HOLO24 and catalog declinations agree to 0.06 deg; 1024 CHIME feeds at 0.3048 m with 64 edge-masked; 64/128/128 outrigger feeds spaced 0.3048 m whose centroids match the station positions to 0.2 m; Bmax recomputed from the feed table (2026-11-16). Normalization: Unicode NFKC; curly quotes, primes, the degree glyph, dashes, minus, multiplication sign (to x), tilde operator and soft hyphens normalized; table separators dropped; whitespace collapsed; a quote also passes with PDF line-end hyphenation closed up, or with all whitespace removed. A negative test (the first digit altered in 40 quotes) fails, as intended. Scripts kept outside the repository: /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/chime/check.py (with common.py, build_chime.py, build_chord.py, valcheck.py).
