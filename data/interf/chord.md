# Interferometer: CHORD (Canadian Hydrogen Observatory and Radio-transient Detector) -- 512 x 6 m core on a 22 x 24 grid, 64-dish pathfinder, drift-scan pointing, band, primary beam, outriggers, status

Compiled 2026-11-16 for the instex INTERFEROMETER mode, in the record format of `data/interf/vla.md` and `data/interf/dsa2000.md`. Every number comes from a document saved unmodified under `rawdata/interf/chord/` (the CHIME position and the outrigger sites under `rawdata/interf/chime/`); each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **NOT FOUND** marks a gap. Downloaded files were read as text only (pdftotext and PyMuPDF for PDFs, including the drawing operators of one vector figure; tag-stripped text for HTML); nothing downloaded was run. Companion machine-readable file: `data/interf/chord.json` (configurations `core`, 512 dishes; `pathfinder`, 64; `full_grid`, 528). Machine check: see the last section.

## Completeness summary

**Status**: under construction at DRAO. Construction began September 2024; first dish placed 16 January 2025; first fringes (three dishes, Cas A) 29 October 2025; 64 dishes installed by 28 April 2026, pathfinder commissioning in Q2-Q3 2026; full core planned by the end of 2027, commissioning through 2028 (SPIE26, July 2026). PM26 (September 2026) reports the first 64-dish sub-array nearly complete.

**Core layout (512)**: 6 m composite dishes (f/D 0.21) on a rectangular grid of 22 columns east-west x 24 rows north-south, spaced 6.3 m E-W and 8.5 m N-S (HIG26, MF26); 16 of the 528 nodes are empty (physical obstructions). The positions here are digitized from the vector markers of HIG26 Fig. 1: all 512 distinct markers fall on that lattice (fitted spacing 6.3001 x 8.5000 m, rms 5 mm), and the 16 empty nodes and the 8 x 8 pathfinder block at the SW corner are read off directly (DERIVED). The rows follow the UTM grid, rotated 2 deg from true east-west (HIG26); the sense of that rotation conflicts between the UTM geometry and the figure (see conflicts). Bmax 236.06 m, Bmin 6.30 m (DERIVED). Site: adjacent to CHIME at DRAO; CHORD's own coordinates NOT FOUND (CHIME's are used, INFERRED).

**Pointing**: drift scan with no tracking; dishes fixed in azimuth, elevation reset by hand every few months or more; declinations +20 to +80 deg (SPIE26, HIG26). **Band**: 300-1500 MHz instantaneous; 6144 x 195.3125 kHz channels kept (1200 MHz). **Primary beam**: 1.2 lambda/d = 2.4 deg at 1420 MHz (HIG26), i.e. 3.435 deg / nu(GHz) (DERIVED); 12 to 2.5 deg across the band (SPIE26). **Synthesized beam**: 4' N-S x 6' E-W at 1420 MHz (HIG26). **Tsys** ~30 K.

**Outriggers**: two 64-dish stations at Hat Creek (California) and Green Bank (West Virginia), next to the CHIME/FRB outriggers, for triggered VLBI; positions and layouts NOT FOUND (INFERRED to sit near the CHIME/FRB stations of `chime.json`). The 2019 white paper's cylinders at the outriggers (LRP19) are superseded.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| SPIE26 | The CHORD Collaboration (K. Bandura et al.), "Overview of the Canadian Hydrogen Observatory and Radio Transient Detector (CHORD) Project", Proc. SPIE 14153, 141531A (2026); arXiv:2607.09374v1 (10 Jul 2026): Abstract, Sec. 1, 3 Telescope Architecture, Table 1, 4 Dish design, 5-8 digital system (tables), 10 Outrigger design, 11 Project status (as of April 28, 2026), 12 early commissioning. Fetched 2026-11-16 | `rawdata/interf/chord/arxiv_2607.09374v1.pdf` | https://arxiv.org/pdf/2607.09374v1 |
| HIG26 | A. Bij et al., "CHORD HI-Galaxy Survey Forecasts: Searching for nearby dark galaxies and high redshift giants", arXiv:2607.24903v2 (27 Jul 2026, revised 16 Sep 2026): Sec. 2, Fig. 1 (dish layout: core and 64-dish pathfinder), Table 1 (design specifications at 1420 MHz). Fetched 2026-11-16 | `rawdata/interf/chord/arxiv_2607.24903v2.pdf` | https://arxiv.org/pdf/2607.24903v2 |
| MF26 | H. S. Hopkins et al., "Matched Filtering for the Canadian Hydrogen Observatory and Radio-Transient Detector Galaxy Search", ApJ 1008, 136 (2026); arXiv:2603.03520v2 (5 Mar 2026): Sec. 1 (22 x 24 grid, footnote 5), Table 1, Sec. 2 (Eq. 12: grid dimensions and spacings). Fetched 2026-11-16 | `rawdata/interf/chord/arxiv_2603.03520v2.pdf` | https://arxiv.org/pdf/2603.03520v2 |
| PM26 | D. Wulf et al., "Project management of the Canadian Hydrogen Observatory and Radio-transient Detector", arXiv:2609.01452v1 (1 Sep 2026; Proc. SPIE 14152): Abstract, Sec. 1. Fetched 2026-11-16 | `rawdata/interf/chord/arxiv_2609.01452v1.pdf` | https://arxiv.org/pdf/2609.01452v1 |
| LRP19 | K. Vanderlinde et al., "LRP 2020 Whitepaper: The Canadian Hydrogen Observatory and Radio-transient Detector (CHORD)", Canadian Long Range Plan 2020 white paper E029; arXiv:1911.01777v1 (5 Nov 2019): Summary, Sec. 'Wide-field Outrigger Stations' ... 'A Transformative Core', Table 1 (CHORD technical properties; superseded design). Fetched 2026-11-16 | `rawdata/interf/chord/arxiv_1911.01777v1.pdf` | https://arxiv.org/pdf/1911.01777v1 |
| WEB | CHORD Collaboration web site, Instrument page (chord-observatory.ca, Google Sites; footer "© 2023"). Response headers in hdr_chord-observatory_instrument.txt. Fetched 2026-11-16 | `rawdata/interf/chord/chord-observatory_instrument.html` | https://www.chord-observatory.ca/instrument |
| EPH | ch_ephem instruments.yaml (see data/interf/chime.md, key EPH): CHIME position and the CHIME outrigger sites. Fetched 2026-11-16 | `rawdata/interf/chime/ch_ephem/instruments.yaml` | https://raw.githubusercontent.com/chime-experiment/ch_ephem/7ad5dd27f54f83038bd101b030531842ff98c5ee/ch_ephem/instruments.yaml |
| OVW22 | CHIME Collaboration, ApJS 261, 29 (2022), arXiv:2201.07869v3 (see chime.md): CHIME at DRAO. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2201.07869v3.pdf` | https://arxiv.org/pdf/2201.07869v3 |
| VLBI26 | S. Andrew et al., arXiv:2609.38344v1 (see chime.md): fitted positions of the CHIME/FRB outrigger stations at HCO and GBO. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_2609.38344v1.pdf` | https://arxiv.org/pdf/2609.38344v1 |
| ARXIV | arXiv API metadata (versions, dates, journal references), saved with the CHIME sources. Fetched 2026-11-16 | `rawdata/interf/chime/arxiv_api_metadata_20261116.xml` | https://export.arxiv.org/api/query?id_list=... |

## Status and site

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| project_status | under construction at DRAO: 64-dish pathfinder installed by 2026-04-28 and commissioning Q2-Q3 2026; full 512-dish core by end of 2027; commissioning through 2028 |  | SPIE26, Sec. 11 Project status | "As of April 28, 2026, 64 dishes had been constructed and installed on their completed foundations"<br>ALT: core complete end of 2027, commissioning 2028 (SPIE26, Sec. 11: "Completion of the full 512-element core array is currently planned by the end of 2027, with commissioning of the complete telescope expected to follow throughout 2028.")<br>ALT: pathfinder commissioning Q2-Q3 2026 (SPIE26, Sec. 11: "A 64-dish “pathfinder” implementation of CHORD is scheduled for commissioning during the second and third quarters of 2026")<br>ALT: first dish 2025-01-16 (SPIE26, Sec. 11: "The first dish was placed on its foundation January 16, 2025.")<br>ALT: construction began September 2024 (SPIE26, Sec. 11: "Construction activities for the CHORD core array began in September 2024")<br>ALT: first fringes on Cas A, 2025-10-29 (three-dish array) (SPIE26, Sec. 12.1: "An observation of the bright supernova remnant Cassiopeia A was conducted on October 29, 2025.")<br>ALT: nearing completion of the first 64-dish sub-array (Sep 2026) (PM26, Abstract: "The project is nearing completion of the first 64-dish sub-array")<br>ALT: full array commissioned in 2028 (SPIE26, Abstract: "The full array will be commissioned in 2028.")<br>ALT: proposal 2019; started in earnest late 2022 (PM26, Sec. 1: "The proposal to fund CHORD was submitted in 2019, though the project did not start in earnest until late 2022") |
| site | DRAO near Penticton, British Columbia, adjacent to CHIME |  | SPIE26, Sec. 1 | "located adjacent to CHIME at the Dominion Radio Astrophysical Observatory (DRAO) near Penticton, British Columbia."<br>INFERRED: latitude and longitude of CHIME (EPH: 49.3207092, -119.6236774, 555.372 m) stand in for the core; CHORD's own coordinates and the offset from CHIME are NOT FOUND<br>ALT: adjacent to CHIME on the NRC site (LRP19, A Transformative Core: "A large “core” array of 512 close-packed 6-m composite reflectors will be deployed adjacent to CHIME on the NRC site at DRAO.")<br>ALT: {"latitude": 49.3207092194} (EPH, chime: "latitude: 49.3207092194")<br>ALT: CHIME at DRAO (OVW22, Sec. 2.1: "CHIME is built at the Dominion Radio Astrophysical Observatory (DRAO), near Penticton, B.C., Canada.") |

## Dishes and layout

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| n_dishes | 512 |  | SPIE26, Abstract | "The telescope consists of a 512-element core array of 6m dishes operating from 300–1500MHz in drift-scan mode"<br>DERIVED from HIG26 Fig. 1: 512 occupied grid nodes<br>ALT: 512 (HIG26, Table 1: "Core dishes, Ndish 512 (22×24)")<br>ALT: 512 (PM26, Sec. 1: "the core instrument will consist of 512 6-meter dishes arranged in a close-packed grid to optimize redundancy and mapping speed.")<br>ALT: 512 (LRP19, Summary: "consisting of a central array of 512× 6-m dishes")<br>ALT: 512 (WEB, Composite Dishes: "CHORD will feature 512 × 6m dishes in a central array, with 64-dish outrigger arrays at two remote sites.") |
| dish_m | 6 | m | SPIE26, Table 1 | "Core Dish Geometry D=6 m composite, f/D = 0.21"<br>ALT: 0.21 (SPIE26, Sec. 4: "Each CHORD antenna uses a precision 6m composite dish with f/D ≈ 0.21, placing the focal plane slightly below the plane of the dish rim.")<br>ALT: f/D 0.25 (2019 design) (LRP19, Table 1: "Focal ratio 0.25")<br>ALT: 14,500 m2 (SPIE26, Table 1: "Core array size 512 × 6 m composite dishes (14,500 m2")<br>ALT: 14,400 m2 (2019) (LRP19, Table 1: "Collecting Area 14,400 m2") |
| grid | {"n_ew": 22, "n_ns": 24, "de_m": 6.3, "dn_m": 8.5} | dishes, m | HIG26, Fig. 1 caption | "Each 6-m wide dish is evenly spaced by 6.3m in the E-W direction and 8.5m in the N-S direction."<br>DERIVED from HIG26 Fig. 1 (vector markers; axis ticks give 0.56638 pt/m E-W and 0.56637 pt/m N-S): all markers lie on a 22 (E-W) x 24 (N-S) lattice of spacing 6.3001 m x 8.5000 m, rms residual 5 mm and 5 mm; footprint 132.3 m x 195.5 m between dish centers<br>ALT: 6.3 m E-W, 8.5 m N-S (HIG26, Table 1: "Grid spacing 6.3m E-W, 8.5m N-S")<br>ALT: 22 x 24 rectangular array (MF26, Sec. 1: "It will consist of 512 six-meter dishes in a 22×24 rectangular array")<br>ALT: m1 x m2 = 24 x 22 (MF26, Table 1: "24 × 22 0.21 m 2.0 deg 3.1’ × 7.0’ 20-80 deg")<br>ALT: L1 = N-S spacing (x cos of pointing offset), L2 = E-W spacing (MF26, Sec. 2.3, after Eq. 12: "L2 is the east-west separation between neighboring dishes in the grid")<br>ALT: first E-W baselines 6.3, 31.5, 37.8 m (SPIE26, Sec. 12: "The three dishes were located along the southwestern edge of the array and formed east–west baselines of length 6.3m, 31.5m, and 37.8m.") |
| grid_gaps | 16 empty nodes of the 22 x 24 grid (digitized: (0,23), (10,6), (10,17), (20,0), (20,1), (20,2), (20,3), (20,4), (20,5), (21,0), (21,1), (21,2), (21,3), (21,4), (21,5), (21,6); i east, j north, from the SW corner) |  | HIG26, Fig. 1 caption | "The core array grid is not fully populated due to physical obstructions on the site."<br>DERIVED: 22 x 24 = 528 nodes - 512 dishes = 16; the digitized figure has exactly these 16 empty: the NW corner node, two interior nodes (i 10, j 6 and 17), and a block of 13 at the SE corner<br>ALT: not fully populated (MF26, footnote 5: "The 22×24 grid is not fully populated due to physical obstructions at the site.") |
| grid_rotation_deg | 2 (dish rows follow the UTM grid, not true east-west) | deg | HIG26, Fig. 1 caption | "The dish positions follow the Universal Transverse Mercator (UTM) coordinate grid, which is rotated by 2◦ relative to geographical latitude and longitude at the CHORD location."<br>DERIVED: UTM zone 11 (central meridian 117 W) at CHIME's position, spherical transverse Mercator: true north lies 1.99 deg east of grid north, so the grid axes are rotated 1.99 deg anticlockwise (looking down) from east/north; chord.json applies this sense. The figure itself draws the rows rotated 1.99 deg the other way (grid north east of the plot's north axis; see conflicts)<br>ALT: CHIME Pathfinder rotation 1.986 deg anticlockwise (EPH convention) (EPH, pathfinder: "rotation: 1.986") |
| pathfinder | 64 dishes: an 8 x 8 block at the SW corner of the grid (i 0-7, j 0-7) |  | HIG26, Fig. 1 caption | "The layout of the 64-dish initial Pathfinder is shown in green"<br>DERIVED from the figure: 64 green nodes, i 0-7, j 0-7; Bmax 74.06 m<br>ALT: 64-dish pathfinder (SPIE26, Abstract: "a 64-dish pathfinder array is currently being commissioned") |
| baselines | {"bmax_m": 236.06, "bmin_m": 6.3} | m (horizontal) | HIG26, Fig. 1 caption | "Right: Baseline distribution for the Pathfinder and core array, showing CHORD’s high redundancy."<br>DERIVED from the digitized layout: Bmax 236.06 m (D0000-D2321); Bmin 6.30 m; full-grid diagonal sqrt(132.3^2 + 195.5^2) = 236.06 m |

Occupancy of the 22 x 24 grid digitized from HIG26 Fig. 1 (north up, east right; o = core dish, P = pathfinder dish, . = empty node; row j from the south, column i from the west):

         i: 0         1         2
            0123456789012345678901
    23  .ooooooooooooooooooooo
    22  oooooooooooooooooooooo
    21  oooooooooooooooooooooo
    20  oooooooooooooooooooooo
    19  oooooooooooooooooooooo
    18  oooooooooooooooooooooo
    17  oooooooooo.ooooooooooo
    16  oooooooooooooooooooooo
    15  oooooooooooooooooooooo
    14  oooooooooooooooooooooo
    13  oooooooooooooooooooooo
    12  oooooooooooooooooooooo
    11  oooooooooooooooooooooo
    10  oooooooooooooooooooooo
     9  oooooooooooooooooooooo
     8  oooooooooooooooooooooo
     7  PPPPPPPPoooooooooooooo
     6  PPPPPPPPoo.oooooooooo.
     5  PPPPPPPPoooooooooooo..
     4  PPPPPPPPoooooooooooo..
     3  PPPPPPPPoooooooooooo..
     2  PPPPPPPPoooooooooooo..
     1  PPPPPPPPoooooooooooo..
     0  PPPPPPPPoooooooooooo..

Dish position in the grid frame: e_grid = (i - 10.5) x 6.3 m, n_grid = (j - 11.5) x 8.5 m; chord.json rotates these by 1.99 deg anticlockwise into east/north (INFERRED sense) and sets u = 0.

## Pointing

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pointing | drift scan; dishes fixed in azimuth (on the meridian, INFERRED), elevation set by hand every few months; declinations +20 to +80 deg |  | SPIE26, Sec. 3 | "The telescope operates as a transit instrument with no motorized tracking system. Dishes are fixed in azimuth and observe the sky through Earth rotation"<br>DERIVED: at latitude 49.32 deg, pointing declinations 20-80 deg are zenith angles 29.3 deg south to 30.7 deg north (elevation >= 59.3 deg)<br>ALT: manual elevation (SPIE26, Sec. 3: "The elevation angle of each dish can be adjusted manually to select the observing declination range, but this adjustment is infrequent and time consuming.")<br>ALT: repointing cadence (SPIE26, Sec. 3: "Elevation repointings are expected to take place on a cadence of a few months or more")<br>ALT: 20-80 deg (SPIE26, Table 1: "Accessible declination range 20-80 degrees")<br>ALT: +20 < dec < +80, set by shadowing (HIG26, Sec. 2: "The declination range accessible to CHORD is +20◦ < δ < +80◦, set by the range of dish elevations across which shadowing is insignificant for HI-galaxy science.")<br>ALT: parked at fixed elevation and azimuth (HIG26, Sec. 2: "CHORD is a drift-scan telescope, where the dishes take data while parked at a fixed elevation and azimuth.")<br>ALT: N-S spacing foreshortened when pointed off zenith (MF26, Sec. 2.3, after Eq. 12: "L1 is the separation between neighboring dishes north-south direction times the cosine of the difference between the pointing declination and CHORD’s zenith declination.") |

## Band and beams

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| freq_range | [0.3, 1.5] | GHz (instantaneous) | SPIE26, Sec. 3 | "CHORD operates over an instantaneous frequency range of 300–1500MHz using ultra-wideband feeds mounted at the prime focus of each reflector."<br>DERIVED: 1.2 GHz wide; the correlator keeps 6144 channels of 195.3125 kHz = 1200 MHz<br>ALT: 300-1500 MHz (SPIE26, Table 1: "Frequency range 300MHz 1500MHz")<br>ALT: 6144 channels (MF26, Sec. 1: "It will record 6144 frequency channels evenly spaced between 300 and 1500 MHz.")<br>ALT: 195.3125 kHz (SPIE26, Sec. 6: "The resulting 8192 frequency channels have a bandwidth of 195.3125kHz per channel.")<br>ALT: 1200 MHz kept (SPIE26, Sec. 7: "down selecting to 1200 MHz of bandwidth (6144 frequency channels)") |
| polarization | dual linear: x east-west, y north-south |  | SPIE26, Sec. 12.2 | "with the convention that the x (y) polarization is aligned east-west (north-south)" |
| primary_beam | FWHM ~ 1.2 lambda / D (2.4 deg at 1420 MHz) | deg | HIG26, Sec. 2 | "θPB ≈ 1.2λ/d = 2.4◦"<br>DERIVED: 1.2 x 0.299792 / 6 rad = 3.435 deg / nu(GHz): 11.45 deg at 0.3 GHz, 2.42 deg at 1.42 GHz, 2.29 deg at 1.5 GHz<br>ALT: 2.4 (HIG26, Table 1: "Primary beam FWHM, θPB 2.4◦")<br>ALT: 12 deg (300 MHz) to 2.5 deg (1500 MHz) (SPIE26, Table 1: "Field of view 12 deg 2.5 deg")<br>ALT: 2.0 deg at 0.21 m (= lambda / D) (MF26, Table 1: "24 × 22 0.21 m 2.0 deg")<br>ALT: 130-5 deg2 (2019) (LRP19, Table 1: "Field of View 130 – 5 deg2")<br>ALT: E-plane near the diffraction limit; H-plane 1-2.5 deg wider below 1100 MHz (measured) (SPIE26, Sec. 12.2: "As expected, the H-plane is ∼ 1–2.5 degrees larger than the diffraction limit at frequencies below 1100 MHz") |
| synth_beam | {"ns_arcmin": 4, "ew_arcmin": 6, "freq_GHz": 1.42, "weighting": "natural", "where": "boresight"} | arcmin | HIG26, Table 1 | "Synthesized beam FWHM, θSB 4′ N-S, 6′ E-W"<br>DERIVED: lambda / L at 1.42 GHz (0.2111 m): 0.2111 / 195.5 m = 3.71' (N-S), 0.2111 / 132.3 m = 5.49' (E-W)<br>ALT: 3.1' x 7.0' at 0.21 m (MF26, Table 1: "3.1’ × 7.0’")<br>ALT: formed beams 17 x 23' to 3.4 x 4.5' (SPIE26, Table 1: "Formed Beam Size 17 × 23 arcmin 3.4 × 4.5 arcmin") |
| formed_beams | FRB search: a 48 x 48 grid of beams, interpolated to the chosen sky positions; ~5000 intensity beams; up to 96 coherent beams |  | SPIE26, Sec. 8.5 | "we form a regular 48 × 48 spatial array of beams"<br>ALT: 5000 intensity beams (SPIE26, Table 2: "Number of formed beams 5000× 4-bit intensity beams")<br>ALT: 512 formed beams (2019) (LRP19, Table 1: "Formed Beams 512") |
| tsys_K | 30 | K | HIG26, Table 1 | "System temperature, Tsys 30K"<br>ALT: receiver ~30 K (SPIE26, Sec. 3: "Low-noise amplifiers integrated directly onto the feed assembly provide a receiver noise temperature of approximately 30K.")<br>ALT: <30 K (WEB, Ultra-Wideband Feeds: "<30 K system temperature across a 5:1 bandwidth (300-1500 MHz)")<br>ALT: SEFD 9 Jy (array, 2019) (LRP19, Table 1: "Tsys 30K SEFD 9Jy")<br>ALT: measured (three dishes): within ~5 K of simulations at 600-1100 MHz; values only plotted (Fig. 12) (SPIE26, Sec. 12.3: "The average system temperature is generally consistent with simulations, especially from 600–1100 MHz, where the difference with simulations is of order ≲ 5 K.") |

## Outriggers

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| outriggers | two 64-dish stations at HCO (California) and GBO (West Virginia), next to the CHIME/FRB outriggers; triggered baseband recording for VLBI |  | SPIE26, Sec. 1 | "Two additional outrigger stations, each with 64 six-meter dishes, are located at the Hat Creek Radio Observatory (HCO) and the Green Bank Observatory (GBO) adjacent to the CHIME outriggers."<br>INFERRED: station positions ~ those of the CHIME/FRB outriggers (VLBI26: HCO 955.20 km, GBO 3334.12 km from CHIME, DERIVED in chime.md); dish layouts NOT FOUND<br>ALT: being constructed (SPIE26, Sec. 3: "Two additional outrigger stations, each containing 64 dishes, are being constructed at the Hat Creek Radio Observatory (HCO) in California and the Green Bank Observatory (GBO) in West Virginia.")<br>ALT: planned (PM26, Sec. 1: "There are also two outrigger stations planned, each consisting of 64 6-meter dishes, at the Green Bank Observatory in West Virginia, USA and the Hat Creek Observatory in California, USA.")<br>ALT: 64 dishes per station; triggered recording (SPIE26, Sec. 10: "The current design consists of 64 dishes per station together with a reduced backend optimized for buffering, timing, and triggered recording.")<br>ALT: commercial steel dishes under study (SPIE26, Sec. 10: "the project is investigating the use of commercially available steel reflector antennas in place of the custom composite dishes used by the core array")<br>ALT: 2019 design: cylinders 90 x 10 m plus 64 dishes, 30-3000 km (LRP19, Wide-field Outrigger Stations: "CHORD begins by enhancing the existing CHIME/FRB instrument with two outrigger stations at distances of 30–3,000 km from CHIME.")<br>ALT: 2019 table (LRP19, Table 1: "Cylinders 1 / station Length 90m Width 10m")<br>ALT: CHIME/FRB outrigger stations at HCO and GBO (fitted geocentric positions) (VLBI26, Fig. 5 caption: "(-2523644.2m,-4123700.4m,4147773.46m) for HCO and (883728.0m, -4924463.3m, 3943957.56m) for GBO") |

## Not found

- CHORD's own geodetic coordinates and its offset from CHIME: the core is 'adjacent to CHIME' (SPIE26, LRP19); chord.json uses CHIME's latitude (INFERRED).
- A published table of dish positions: the layout here is digitized from the vector markers of HIG26 Fig. 1 and snapped to the stated 6.3 x 8.5 m grid (all markers lie within ~1 cm of a node); dish heights and terrain are NOT FOUND (u = 0).
- The azimuth of the fixed dishes: 'fixed in azimuth' (SPIE26); pointing along the meridian is INFERRED from the declination-strip surveys (HIG26, MF26).
- A published FWHM relation over the band: HIG26 gives 1.2 lambda / d = 2.4 deg at 1420 MHz; SPIE26 Table 1 gives 12 and 2.5 deg at the band edges; the measured curves are only plotted (SPIE26 Fig. 11).
- Outrigger station positions and dish layouts (HCO, GBO): only 'adjacent to the CHIME outriggers' (SPIE26).
- The dates the outriggers will observe: SPIE26 says they 'are being constructed' (Sec. 3), PM26 calls the stations 'planned'.
- A measured system temperature in numbers: SPIE26 Sec. 12.3 plots the three-dish estimates (Fig. 12) and states only that they agree with simulations to within ~5 K from 600 to 1100 MHz.

## Conflicts

- Grid rotation sense: HIG26 says the rows follow the UTM grid, rotated 2 deg from latitude and longitude; UTM zone 11 at DRAO puts grid north 1.99 deg west of true north (DERIVED), but the HIG26 figure draws the rows 1.99 deg the other way (grid north east of the plot's north axis), if its E-W axis increases eastward. chord.json follows the UTM sense. The two senses differ by 3.98 deg in the orientation of all baselines: up to 6.8 m in e at the grid's north and south edges and 4.6 m in n at its east and west edges (DERIVED).
- Grid dimensions: '22×24' (HIG26 Table 1; MF26 Sec. 1) and m1 x m2 = '24 × 22' with m1 along N-S (MF26 Table 1 and Eq. 12); the digitized figure has 22 columns E-W and 24 rows N-S. Consistent.
- Dish focal ratio: f/D = 0.21 (SPIE26) vs 0.25 (LRP19, 2019 design).
- Collecting area: 14,500 m2 (SPIE26) vs 14,400 m2 (LRP19). DERIVED geometric 512 x pi x 3^2 = 14,476 m2.
- Primary-beam FWHM: 1.2 lambda/d = 2.4 deg at 1420 MHz (HIG26) vs lambda/D = 2.0 deg at 0.21 m (MF26 Table 1, Airy model) vs 12 deg and 2.5 deg at the band edges (SPIE26 Table 1; 1.2 lambda/D gives 11.45 and 2.29 deg, DERIVED).
- Synthesized beam: 4' N-S x 6' E-W at 1420 MHz (HIG26) vs 3.1' x 7.0' at 0.21 m (MF26). DERIVED lambda/L: 3.71' x 5.49'.
- Formed beams: 512 (LRP19, 2019) vs a 48 x 48 grid interpolated to ~5000 intensity beams (SPIE26).
- Outriggers: 2019 design = a 90 x 10 m cylinder plus 64 dishes per station at 30-3000 km (LRP19); current = 64 dishes per station at HCO and GBO (SPIE26, PM26). Status 'being constructed' (SPIE26) vs 'planned' (PM26).
- Status: full array 'commissioned in 2028' (SPIE26 abstract) vs 'commissioning ... throughout 2028' (SPIE26 Sec. 11).

## Notes

- Positions: e, n in meters about the center of the full 22 x 24 grid, grid axes rotated 1.99 deg anticlockwise from east/north (UTM sense, INFERRED); u = 0. Names D{jj}{ii}: j = row from the south (0-23), i = column from the west (0-21). e_grid, n_grid give the unrotated grid coordinates.
- Layout statistics (DERIVED): 512 dishes, Bmax 236.06 m, Bmin 6.30 m (6.3 m E-W neighbors); pathfinder 64 dishes, Bmax 74.06 m.
- Primary beam for the page: 1.2 lambda / D with D = 6 m, i.e. 3.435 deg / nu(GHz) (DERIVED from HIG26); the dishes point at a fixed declination between +20 and +80 deg and the sky drifts through: a source at dec 49.3 deg crosses the 2.42 deg beam at 1.42 GHz in 2.42 / (15 x cos 49.3 deg) h = 14.8 min (DERIVED).
- Status dates: SPIE26 (arXiv 10 Jul 2026; status as of 28 Apr 2026); PM26 (1 Sep 2026); HIG26 (v2 16 Sep 2026); MF26 (v2 5 Mar 2026); LRP19 (5 Nov 2019, superseded design).

## Machine check

77 quotes machine-checked against the saved files' extracted text (pdftotext -layout and -raw, and PyMuPDF, for PDFs; tag-stripped text for HTML; YAML and XML as is): all pass, 76 after normalization and 1 only with all whitespace removed (a line-broken HIG26 sentence); all 10 sources quoted. Value checks (shared with chime.json, 171 in all) pass: 512 core dishes, 16 empty nodes, 64 pathfinder dishes, 528 full-grid nodes, Bmin 6.3 m, site latitude equal to CHIME's EPH value. The layout digitization reads 520 vector markers (512 distinct; 8 pathfinder markers drawn twice) from HIG26 Fig. 1; the axis ticks give 0.56638 pt/m on both axes; the fitted lattice spacings are 6.30006 m and 8.50001 m with rms residuals of 5 mm, so all markers sit on nodes of the stated 6.3 x 8.5 m grid (2026-11-16). Normalization as in chime.md. A negative test (the first digit altered in 40 quotes) fails, as intended. Scripts kept outside the repository: /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/chime/build_chord.py (with check.py, common.py, valcheck.py).
