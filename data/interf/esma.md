# Interferometer: the extended Submillimeter Array (eSMA) -- SMA + JCMT (15 m) + CSO (10.4 m), positions in the SMA pad frame, baselines, dishes, validation beams

Compiled 2026-11-18 for the instex INTERFEROMETER mode, in the record format of `data/interf/sma.md` (read it first: pads, configurations and the SMA receivers are NOT repeated here). All numbers come from documents saved unmodified under `rawdata/interf/esma/` (new) or already saved by the SMA and EHT records (`rawdata/interf/sma/`, `rawdata/interf/eht2017/`; named in the Sources table, not copied); each value carries a source key, a location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states (reason given). **NOT FOUND** marks a gap. 123 quote records (123 distinct quotes) machine-checked against the saved files' extracted text (pdftotext -layout and -raw for PDFs; tag-stripped text and raw source for HTML; json, cfg and txt as is): 123 quote records, 0 failures (2026-11-18). Normalization: Unicode NFKC; curly quotes, primes, dashes, minus, multiplication sign (to x), soft hyphens and the font glyphs mapped; case folded; whitespace collapsed; a quote also passes with PDF line-end hyphenation closed up or with all whitespace removed; " ... " joins non-adjacent pieces (used where a two-column PDF page interleaves lines). Machine-readable twin: `data/interf/esma.json` (its `recommended_page_record` is the block for make_rpresets.js).

## Completeness summary

**What it was**: the SMA (8 x 6 m) joined by the JCMT (15 m) and the CSO (10.4 m) into one 10-element, 45-baseline, single-polarization, single-frequency interferometer, 488 m2 of geometric collecting area (DERIVED 487.9), longest baseline 782 m (with the CSO; SMA alone 509 m). MOU 2001; first 345 GHz fringes 2007 August 30; science verification 2008-2010. Published eSMA data in the saved papers span 2007 August to 2010 February (the last eSMA data set found is Titan, 2010-02-12); the CSO closed in 2015 and was removed from Maunakea by mid-2024. Receivers: 230 GHz (tests 230-270 GHz, JCMT RxA3 1.5 GHz usable) and 345 GHz (designed 320-355 GHz); 2 GHz per sideband correlated (about 4 GHz DSB). Frequency of use, nights per year and any end date of the eSMA as a facility: NOT FOUND.

**Today (2026)**: the CSO no longer exists, so the 782 m baselines and the 10-element array are impossible. The JCMT is still equipped with 230 GHz and 345 GHz single-pixel heterodyne receivers (Namakanui, page last updated 2026-07-23; commissioning) and has done interferometry with the SMA outside the eSMA mode (2019 fringe test; 2024 January VLBI as a paired antenna with the phased SMA). No SMA or JCMT page saved here offers an eSMA (SMA + JCMT) mode in 2026 (NOT FOUND). What remains possible: SMA + JCMT, 9 elements and 36 baselines (DERIVED), JCMT-pad baselines 156-221 m in COM (155.7-624.5 m with VEX pads, but VEX is out of service in 2026A).

**Configuration**: always the SMA very extended (VEX) in the papers that name it (BOT09, SHI09, VK12: pads 1, 12, 16, 17, 18, 19, 20, 21 in the CASA file; the pad set of 2008-2010 is not stated: INFERRED the same).

**KEY GAP (JCMT and CSO in the pad frame)**: NO source ties the SMA pad frame to an absolute position (confirmed again: the MIR antenna file is relative to a reference antenna, MIRQA). The best route: take the EHT 2017 SMA point (P2 Table 2; also the astropy/SMA GPS point to 1 m) as pad 1 (INFERRED), which puts the JCMT at E 54.5, N -154.0, U 5.0 m and the CSO at E 212.3, N -195.5, U -7.9 m about pad 1 (DERIVED from P2 XYZ). Test: this placement gives CSO to pad 19 = 781.6 m (published longest baseline 782 m) and JCMT to pad 19 = 624.5 m (published 625 m for the 2010 array of 7 SMA antennas + JCMT), and JCMT to CSO 163.7 m (published 164 m, figure 160 m). The two long baselines allow pad 1 to differ from the EHT point by at most E -7.5 to +8.0 m, N -12.8 to +14.8 m (+-0.5 m rounding; the two constraints are nearly parallel, so the cross direction is loose). Placing the EHT point at the centroid of the COM pads instead would move the JCMT and the CSO 38.8 m relative to the pads and breaks both tests (CSO-pad 19 749 m, JCMT-pad 19 593 m): REJECTED.

**Dishes and SEFDs**: SMA 6 m, JCMT 15 m, CSO 10.4 m; aperture efficiencies in 2008 SMA 0.75, JCMT 0.70 (BOT09) or 0.40 (SHI09, conflict), CSO 0.30 (a malfunctioning half-wave plate; typically >= 0.60 as a single dish); design effective apertures 18.94, 97.19, 50.97 m2 (eta 0.67, 0.55, 0.60; ESMA Appendix B). No SEFD was published for the eSMA stations; the page SEFDs are DERIVED (2761.3 Tsys / Ae Jy; Sec. Dishes). **Primary beams**: JCMT 15 arcsec and CSO 20 arcsec at 337 GHz (FAV14), 1.23 and 1.13 lambda/D (DERIVED); SMA 36 arcsec at 345 GHz. **Elevation limits** of the JCMT and the CSO: NOT FOUND.

**Validation targets (uniform weighting; this record's simulation reproduces them)**: PKS 1830-211, 267 GHz, dec -21.06, VEX + JCMT + CSO: published 0.55 x 0.22 arcsec PA 32 deg (BOT09), simulated 0.54 x 0.24 PA 34; IRC+10216, 270 GHz, dec +13.28: published 0.46 x 0.22 PA 39.9, simulated 0.44 x 0.20 PA 45; the SPIE estimate at 345 GHz, dec +25: published 0.18 x 0.32 (eSMA) and 0.24 x 0.32 (SMA), simulated 0.19 x 0.32 and 0.27 x 0.32; NGC 2071 (natural weighting published, simulated uniform 0.35 x 0.18 vs published 0.37 x 0.19). Beam axes agree to about 10% and the longest baseline (782 m) to 0.4 m.

## Recommendation for the page (INFERRED choices marked)

- **Entry**: name `eSMA` ("eSMA: SMA + JCMT + CSO"), era 2007-2010, site Maunakea (4080 m), latitude 19.8242 deg (the three stations within 0.002 deg). Flag in the page notes: the CSO was removed in 2024, so the array no longer exists; the entry is historical.
- **Stations (10)**: the 8 pads of the VEX configuration (pads 1, 12, 16, 17, 18, 19, 20, 21; ENU about pad 1 from `sma.md`) plus the JCMT and the CSO at the positions above (about pad 1, INFERRED; uncertainty above). Dishes 6 m (x8), 15 m, 10.4 m. Per-station SEFDs (DERIVED, relative weights matter: the page uses 1 / (SEFD_i SEFD_j)): design set A at an assumed Tsys of 300 K (INFERRED, DSB, equal for all, following ESMA Appendix B): SMA 43.7 kJy, JCMT 8.5 kJy, CSO 16.3 kJy; alternative set B (April 2008 measured efficiencies and mid-range Tsys of SHI09: Tsys 350, 450, 350 K): SMA 45.6, JCMT 17.6, CSO 37.9 kJy. **Recommended: set A** (the facility as designed; the 2008 CSO efficiency was a malfunction).
- **Bands** (INFERRED from ESMA Table 1 and the tests): `230` lo 210 hi 280 (ESMA Table 1 eSMA frequency range), bw 4 GHz (2 GHz per sideband, DSB: VK12, SHI09; the JCMT RxA3 gave 1.5 GHz); `345` lo 315 hi 380, bw 4 GHz (designed 320-355 GHz).
- **Defaults** (INFERRED): `{ cfg: "VEX", band: "345", nu: 345, dec: 25, dur: 10 }`: VEX is the only SMA configuration with the 782 m baseline; 345 GHz is the eSMA's stated preferred band and the frequency of the published performance estimate (ESMA Table 1: 345 GHz, dec +25, H.A. +-5); `dur` is the track length (+-5 h) because the 6.7 h of that estimate is on-source time.
- **Page fields**: elLimit 15 deg for all stations (INFERRED: JCMT and CSO limits NOT FOUND; the JCMT was detected down to 12.5 deg in the EHT 2017 data, `eht2017.md`); bmax 781.6 m (3-D, CSO to pad 19), bmin 68.4 m (3-D, SMA pads 1-12; the published 25 m is a projected length); primary beams per station (k = 1.2 for the SMA, 1.23 JCMT, 1.13 CSO).
- **The page's model cannot represent**: (1) three different primary beams (JCMT 15 arcsec and CSO 20 arcsec at 337 GHz against the SMA's 36 arcsec at 345 GHz): a source more than a few arcsec off axis is seen by the SMA pads only (VK12: a position at 20 percent of the SMA beam was "outside the primary beam of the JCMT and CSO"); (2) single polarization with half-wave plates and the resulting efficiency loss (CSO 0.30 in 2008); (3) elevation-dependent phase terms and the 0.1 mm baseline-calibration problem of a heterogeneous array; (4) different correlated bandwidths (JCMT RxA3 1.5 GHz vs 2 GHz); (5) the 2010 array of 7 SMA antennas + JCMT (375 m2, 625 m); (6) dual-polarization eSMA (6 SMA antennas + JCMT + CSO, 28 baselines); (7) that the CSO no longer exists; (8) uncertainty of the JCMT and CSO positions in the pad frame (INFERRED, up to about +-8 m E and +-14 m N).

## Sources

| key | document | local file | URL |
|---|---|---|---|
| ESMA | Bottinelli, S., et al. 2008, SPIE 7012, 70120D, "The eSMA: description and first results" (arXiv:0808.2554). Already saved by the SMA record; cited by its key there, not copied | `rawdata/interf/sma/bottinelli2008_arXiv0808.2554.pdf` | https://arxiv.org/pdf/0808.2554 |
| BOT09 | Bottinelli, S., et al. 2009, ApJ 690, L130, "Detection of C I in Absorption toward PKS 1830-211 with the eSMA" (arXiv:0811.3944). Fetched 2026-11-18 | `rawdata/interf/esma/bottinelli2009_arXiv0811.3944.pdf` | https://arxiv.org/pdf/0811.3944 |
| SHI09 | Shinnaga, H., et al. 2009, ApJ 698, 1924, "IRC+10216's Innermost Envelope -- The eSMA's View" (arXiv:0904.0280). Fetched 2026-11-18 | `rawdata/interf/esma/shinnaga2009_arXiv0904.0280.pdf` | https://arxiv.org/pdf/0904.0280 |
| VK12 | van Kempen, T. A., et al. 2012, ApJ 751, 137, "The Small-scale Physical Structure and Fragmentation Difference of Two Embedded Intermediate-mass Protostars in Orion" (arXiv:1203.3718; NGC 2071 eSMA track 2010 Feb 11). Fetched 2026-11-18 | `rawdata/interf/esma/vankempen2012_arXiv1203.3718.pdf` | https://arxiv.org/pdf/1203.3718 |
| FAV14 | Favre, C., et al. 2014, ApJ 790, 55, "Dynamical Structure of the Inner 100 AU of the Deeply Embedded Protostar IRAS 16293-2422" (arXiv:1406.0709; eSMA track 2009 March 22). Fetched 2026-11-18 | `rawdata/interf/esma/favre2014_arXiv1406.0709.pdf` | https://arxiv.org/pdf/1406.0709 |
| LIG24 | Light, S., et al. 2024, PSJ 5, 98, "Measurements of Titan's Stratospheric Winds during the 2009 Equinox with the eSMA" (arXiv:2404.08832; Table 1 beams and maximum baselines). Fetched 2026-11-18 | `rawdata/interf/esma/light2024_arXiv2404.08832.pdf` | https://arxiv.org/pdf/2404.08832 |
| WIE99 | Wiedner, M. C. 1999 March, SMA Technical Memo 136, "Connecting the CSO and JCMT to the SMA" (pre-construction plan; baselines 164 m and ~770 m). Fetched 2026-11-18 | `rawdata/interf/esma/sma_memo136_wiedner1999.pdf` | https://lweb.cfa.harvard.edu/sma/memos/136.pdf |
| NEWS25 | SMA Newsletter No. 40, July 2025 (JCMT and phased SMA as a paired antenna, 2024 January). Fetched 2026-11-18 | `rawdata/interf/esma/sma_newsletter40_2025-07.pdf` | https://lweb.cfa.harvard.edu/sma/Newsletters/pdfFiles/SMA_NewsJuly2025.pdf |
| MIRQA | SMA MIRIAD support thread, J.-H. Zhao to C. Cyganowski, 2012-07-26 (antenna positions relative to a reference antenna). Fetched 2026-11-18 | `rawdata/interf/esma/miriad_QandA_Cyganowski26Jul2012.html` | https://lweb.cfa.harvard.edu/sma/miriad/download/QandA/2012/Cyganowski26Jul2012.html |
| ASTRO | astropy-data, coordinates/sites.json (entries `sma`, `jcmt`). Fetched 2026-11-18 | `rawdata/interf/esma/astropy_data_sites.json` | https://raw.githubusercontent.com/astropy/astropy-data/gh-pages/coordinates/sites.json |
| EAOI | East Asian Observatory, JCMT Instrumentation page ("Last update: July 23rd 2026"). Fetched 2026-11-18 | `rawdata/interf/esma/eao_jcmt_instrumentation.html` | https://www.eaobservatory.org/jcmt/instrumentation/ |
| EAOA | East Asian Observatory, About the JCMT. Fetched 2026-11-18 | `rawdata/interf/esma/eao_jcmt_about.html` | https://www.eaobservatory.org/jcmt/about/ |
| EAOM | East Asian Observatory, JCMT home page and news list (the 2019 SMA fringe test item). Fetched 2026-11-18 | `rawdata/interf/esma/eao_jcmt_main.html` | https://www.eaobservatory.org/jcmt/ |
| ADSE | NASA ADS API response (one query on eight bibcodes). Fetched 2026-11-18 | `rawdata/interf/esma/ads_bibcodes.json` | https://api.adsabs.harvard.edu/v1/search/query (q = bibcode:(...)) |
| P2 | EHT Collaboration 2019, ApJL 875, L2, Paper II (already saved by the eht2017 record): Table 2 station XYZ (SMA phasing center, JCMT, CSO), Table 3 JCMT and SMA6 sensitivities. Not copied | `rawdata/interf/eht2017/EHT2019_Paper2_arXiv1906.11239.pdf` | https://arxiv.org/pdf/1906.11239 |
| EHTIM | ehtim array file EHT2017.txt (already saved by the eht2017 record): its SMA row coincides with the CSO. Not copied | `rawdata/interf/eht2017/ehtim_arrays_EHT2017.txt` | (see data/interf/eht2017.md) |
| CFG | CASA simulator antenna file sma.vextended.cfg (already saved by the SMA record; pad rows 1, 12, 19). Not copied | `rawdata/interf/sma/sma.vextended.cfg` | see data/interf/sma.md, source CFG |
| OCSPEC | SMA Observer Center, Specifications of the SMA (already saved). Not copied | `rawdata/interf/sma/oc_specs.html` | http://sma1.sma.hawaii.edu/specs.html |
| OCS | SMA Observer Center, Array Status and Technical Information (already saved). Not copied | `rawdata/interf/sma/oc_status.html` | http://sma1.sma.hawaii.edu/status.html |
| CSO | Caltech news, "Caltech's Submillimeter Observatory Has Been Removed from Maunakea", 2024-07-02 (already saved by the SMA record under key CSO). Not copied | `rawdata/interf/sma/caltech_cso_removed.html` | https://experts.caltech.edu/news/caltechs-submillimeter-observatory-has-been-removed-from-maunakea |

**Searched, nothing usable saved**: the SMA memo index (a copy was scanned by title for eSMA, JCMT, CSO, position, coordinate, survey, geodetic, baseline, combine, location and pad; only Memo 136 "Connecting the CSO and JCMT to the SMA" matches; memos with other titles were not opened); the CSO web site (cso.caltech.edu, nothing on specifications); JCMT and CSO elevation limits and SEFDs (no saved source states them; the EAO About page gives surface accuracy and pointing only).

## The eSMA: history, receivers, bandwidth, use

| id | value | source, location | quote |
|---|---|---|---|
| esma_def | SMA + JCMT + CSO as one facility | ESMA, Abstract | "The eSMA (“extended SMA”) combines the SMA, JCMT and CSO into a single facility"<br>ALT: BOT09, Sec. 2.1: "The eSMA consists of the SMA9 array of eight 6-m antennas augmented by the nearby single dishes of the JCMT10 (15 m) and the CSO (10.4 m)."<br>Note: Two single dishes join the 8 SMA antennas as two extra "antennas" (WIE99 concept). |
| esma_mou | MOU 2001 (JCMT-SMA); CSO later | ESMA, Sec. 1 | "The JCMT-SMA Memorandum of Understanding was signed in 2001; the CSO later agreed to join the project." |
| esma_pre | CSO-JCMT two-element interferometer 1992-1995 | ESMA, Sec. 1 | "the 10.4-m CSO and 15-m JCMT as a two-antenna interferometer (1992-1995"<br>ALT: WIE99, Sec. 1: "a single baseline of 164 m"<br>Note: The pre-SMA CSO-JCMT baseline was 164 m (WIE99); this record derives 163.7 m from P2. |
| esma_fringe | first 345 GHz fringes 2007-08-30; science verification | ESMA, Abstract | "first fringes at 345 GHz were obtained on August 30 2007, and the array has entered the science-verification stage" |
| esma_freq | designed 320-355 GHz; tested 230-270 GHz in 2008 | ESMA, Sec. 2 | "Note that although the eSMA is designed to operate in the 320-355 GHz window, the testing to date has been done at lower frequencies (230-270 GHz)." |
| esma_t1_freq | eSMA 210-280 GHz (230 band), 315-380 GHz (345 band), 320-355 GHz (dual pol) | ESMA, Table 1 | "Frequency range (GHz) 210–280 315–380 320–355 272–349 320–355" |
| esma_45 | 10 antennas, 45 baselines, single frequency | ESMA, Sec. 2.1.1 | "there is enough hardware for running the eSMA 10-antenna single-frequency configuration (45 baselines). Since August 2007, the eSMA has been observing successfully with all 45 baselines."<br>ALT: ESMA, Table 1: "Number of baselines 45 45 28 28 28"<br>ALT: ESMA, Table 3: "eSMAsp 8×7/2 = 28 8 8 1 45" |
| esma_sp | single polarization (half-wave plates at JCMT and CSO) | ESMA, Sec. 2.4 | "Note that the eSMA currently operates in single polarization mode."<br>ALT: BOT09, Sec. 2.1: "Observations were carried out in single polarization mode with half-wave plates in the beam of the CSO and JCMT"<br>Note: Dual polarization needs the JCMT only for now; 6 SMA antennas then (6x5/2 + 6 + 6 + 1 = 28 baselines): In the event of dual-polarization observations with the eSMA, two SMA antennas will have to be dropped from the array due to correlator capacities. |
| b09_bw | JCMT RxA3 usable 1.5 GHz; SMA and CSO 2 GHz (230 band, 2008) | BOT09, Sec. 2.1 | "the JCMT used receiver A3 which, due to a different intermediate frequency, provided a usable bandwidth of about 1.5 GHz, slightly less than the 2 GHz covered by the SMA and CSO"<br>ALT: SHI09, Sec. 2, footnote 1: "JCMT’s receiver had a more limited frequency coverage from 264.770 to 266.338 GHz and from 274.357 to 275.927 GHz" |
| vk_bw | 2 GHz bandwidth mode with the eSMA (more antennas); 4 GHz total with both sidebands (2008) | VK12, Sec. 2.1 | "the correlator setup was limited to the 2 GHz bandwidth mode due to the increased number of antennas"<br>ALT: SHI09, Sec. 2: "The total bandwidth of ∼ 4 GHz (2 GHz from each sideband" |
| l24_2009 | 2009: 8 SMA + JCMT + CSO (488 m2, 780 m) | LIG24, Sec. 2 | "During the 2009 observations, the eSMA was composed of all eight SMA antennas, the JCMT and the CSO."<br>ALT: LIG24, Table 1: "2009-03-23 06:40-14:25 8.4314 -2.9822 0.8 182.2 0.8422 0.384 × 0.196 48.8 780 488" |
| l24_2010 | 2010-02-12: 7 SMA + JCMT only (375 m2, 625 m) | LIG24, Sec. 2 | "in 2010, only 7 SMA antennas were available, along with the JCMT, providing less overall collecting area and a shorter maximum baseline"<br>ALT: LIG24, Table 1: "2010-02-12 09:06-18:30 8.7061 4.5841 1.0 120.8 0.8156 0.382 × 0.228 53.8 625 375"<br>Note: VK12 reports the NGC 2071 track of 2010 Feb 11 as eSMA with "the very extended configuration ... combined with the JCMT and the CSO" (VK12 Sec. 2.1); the CSO was absent on Feb 12 (LIG24). |
| eaoi_230 | JCMT today: 230 and 345 GHz receivers (Namakanui) | EAOI, Heterodyne Instrumentation | "a single-pixel insert on Nāmakanui working at 230 GHz"<br>ALT: EAOI, Heterodyne Instrumentation: "a single-pixel insert on Nāmakanui working at 345 GHz"<br>ALT: EAOI, Heterodyne Instrumentation: "The JCMT currently has five heterodyne spectral instruments"<br>ALT: EAOI, Instrumentation page, Current Status: "Last update: July 23rd 2026."<br>Note: Namakanui 345 GHz "undergoing commissioning"; HARP and SCUBA-2 paused (2026). |
| eaom_fringe | 2019-12: JCMT-SMA fringes with Namakanui | EAOM, News list (2019-12-14 item) | "The JCMT had a successful fringe test yesterday with the SMA using the new instrument Nāmakanui" |
| n25_pair | 2024 January: JCMT + phased SMA as a paired antenna in VLBI | NEWS25, p. 8 (FPT article) | "JCMT and phased-SMA acted as a paired antenna"<br>ALT: NEWS25, p. 8 (FPT article): "on 2024 January 24"<br>Note: This is VLBI use (EHT-type), not an eSMA imaging mode. |
| cso_gone | CSO operated 1987-2015; removed from Maunakea (2024) | CSO, first paragraphs | "CSO, which operated from 1987 to 2015"<br>ALT: CSO, first paragraph: "and the land at the site has been restored" |
| sma_vex | SMA VEX not possible in 2026A (pads 18, 19) | OCS, Array Configurations | "Due to storm damage to roads and infrastructure to pads 18 and 19, VEX configuration is currently not possible." |

**Frequency of use**: the saved papers show eSMA tracks on 2007 Aug 29-30, 2008 Mar 13 (IRAS 16293 test with the SMA compact; ESMA Sec. 4), 2008 Apr 14 (PKS 1830, IRC+10216), 2009 Mar 22-23 (IRAS 16293, Titan), 2010 Feb 11-12 (NGC 2071, Titan): a few nights per year. How the eSMA was scheduled and when it ended: NOT FOUND.

## Positions in the SMA pad frame (the key gap)

| id | value | source, location | quote |
|---|---|---|---|
| p2_sma | SMA (2017 phasing center) X, Y, Z = -5464555.5, -2492928.0, 2150797.2 m | P2, Table 2, SMA row | "-5464555.5 -2492928.0 2150797.2"<br>ALT: P2, Table 2 note b: "Array coordinates indicate the phasing center used in 2017." |
| p2_jcmt | JCMT -5464584.7, -2493001.2, 2150654.0 m | P2, Table 2, JCMT row | "JCMT 15 Hawaii, USA -5464584.7 -2493001.2 2150654.0" |
| p2_cso | CSO -5464520.9, -2493145.6, 2150610.6 m | P2, Table 2, CSO row | "CSO 10 Hawaii, USA -5464520.9 -2493145.6 2150610.6" |
| ast_sma | astropy site `sma`: lat 19.82422, lon -155.47755, h 4125.1 m ("SMA internal GPS (October 2024)") | ASTRO, entry "sma" | "SMA internal GPS (October 2024)"<br>ALT: ASTRO, entry "sma": ""latitude": 19.82422"<br>ALT: ASTRO, entry "sma": ""longitude": -155.47755"<br>ALT: ASTRO, entry "sma": ""elevation": 4125.1"<br>Note: Agrees with the P2 phasing center (19.82423, -155.47755) to 0.00001 deg (about 1 m); the 10 m height difference is the geoid/reference-ellipsoid convention (P2: 4115.1 m GRS80). It is "the SMA", not a named pad. |
| ast_jcmt | astropy site `jcmt`: lat 19.8228, lon -155.477 (204.523 E), h 4124.75 m | ASTRO, entry "jcmt" | "2007-04-11 GPS measurements by R. Tilanus (via Starlink/PAL)"<br>Note: Agrees with P2 JCMT (19.82284, -155.47703) to 0.0001 deg. |
| mir_ref | MIR antenna files are relative to a reference antenna (zero) | MIRQA, J.-H. Zhao reply | "The reference antenna position should be zero."<br>ALT: MIRQA, mirhelp text quoted in C. Cyganowski message: "The geocentrical ... coordinates for the antennas can be retrieved from SMA sybase."<br>Note: The absolute geocentric antenna coordinates are held in the SMA database ("SMA sybase", per the thread); not public here. |
| cfg_hdr | CASA SMA files: local plane, pad 1 at the origin; no SMA row in the CASA Observatories table | CFGVEX, header | "# observatory=SMA # coordsys=LOC (local tangent plane)"<br>ALT: CFGVEX, pad 1 row: "0.00 0.00 0.00 6. 1"<br>Note: See sma.md (pad_origin). |

**What the sources do not give**: any absolute (geodetic or geocentric) position of pad 1 or of any pad, and any JCMT or CSO coordinate in the pad frame: NOT FOUND (SMA Memo 131 gives pads relative to a ground reference; Memo 136 gives only the 164 m JCMT-CSO baseline; ESMA Fig. 1 is a map with three labeled distances; LIG24 Fig. 1 is a Google Earth map).

**JCMT and CSO in the local frame about the P2 SMA point (DERIVED)**: geocentric differences rotated to east, north, up at the P2 SMA point (lat 19.82423, lon -155.47755 deg; GRS80 a = 6378137 m, 1/f = 298.257222101):

| station | E (m) | N (m) | U (m) | 3-D distance from the P2 SMA point (m) | GRS80 lat, lon, h from P2 XYZ |
|---|---|---|---|---|---|
| JCMT | 54.5 | -154.0 | 5.0 | 163.5 | 19.82284, -155.47703, 4120.1 |
| CSO | 212.3 | -195.5 | -7.9 | 288.7 | 19.82246, -155.47552, 4107.2 |

JCMT to CSO: 163.7 m (DERIVED); published 164 m (WIE99, a "single baseline of 164 m") and 160 m (ESMA Fig. 1 label); the JCMT-CSO distance is independent of the pad-1 placement. The SMA pads lie to the north-west of the JCMT and CSO (all pad east coordinates about pad 1 are <= 0 and the JCMT and CSO are at E > 0 of the P2 point).

**The tie (INFERRED)**: set pad 1 at the P2 SMA point, so that the JCMT and CSO about pad 1 are the numbers above. Reason: no source states the mapping, but (a) the P2 point and the SMA GPS point agree to 1 m, so a single reference point exists; (b) the published longest eSMA baseline (782 m, CSO to the farthest pad, pad 19 in the VEX) and the 2010 maximum baseline of the 7-antenna array (625 m, JCMT to pad 19) are reproduced to 0.4 and 0.5 m with that placement. The test (CFG pad 19 at E -479.03, N 167.96, U -36.17 m about pad 1, CFG):

| placement of pad 1 relative to the P2 SMA point (E, N; U = 0) | CSO to pad 19 (m) | JCMT to pad 19 (m) | verdict |
|---|---|---|---|
| (0, 0): pad 1 at the P2 point | 781.6 | 624.5 | matches 782 and 625 |
| P2 point at the centroid of the COM pads, pad 1 at (+38.7, +2.8) | 748.9 | 593.3 | fails by 33 and 32 m |
| P2 point at the centroid of the SUB pads, (+26.1, -3.7) | 756.8 | 600.4 | fails |
| P2 point at the centroid of the EXT pads, (+83.7, -13.6) | 701.8 | 546.9 | fails |
| P2 point at the centroid of the VEX pads, (+176.6, -101.7) | 578.2 | 421.5 | fails |
| P2 point at the centroid of all 24 pads, (+103.2, -45.6) | 669.1 | 513.0 | fails |

Allowed placements (grid search, 0.25 m steps, U = 0, both distances within +-0.5 m of 782 and 625): 275 points, E -7.50 to +8.00 m and N -12.75 to +14.75 m. **Uncertainty of the tie**: about +-8 m east and -13 to +15 m north for the JCMT and the CSO relative to the pads (every station moves together); the beams change by < 10% over this range (Sec. Validation). The "centroid of the 2017 pads" route cannot be used: the pad set of the 2017 phasing is not stated (P2: "array coordinates indicate the phasing center used in 2017"), and each centroid hypothesis would shift the JCMT and the CSO by 26-204 m relative to the pads and spoil the 782 m test. The ehtim SMA row (EHTIM, -5464523.400, -2493147.080, 2150611.750) is the CSO (3.1 m from the P2 CSO), not the SMA (see eht2017.md): do not use it for the SMA.

| id | value | source, location | quote |
|---|---|---|---|
| esma_dxyz | baseline-solution corrections (JCMT, CSO) 2007-08-29 ~ 10-23 mm | ESMA, Sec. 2.3 | "(∆X, ∆Y , ∆Z) = 10.25, −8.53, 14.11 mm and −8.82, 3.14, −22.96 mm for the JCMT and CSO, respectively"<br>ALT: ESMA, Sec. 2.1.2: "Presently the eSMA is converging towards the required maximum residual baseline uncertainty of ∼0.1 mm."<br>Note: The pad-frame positions of the JCMT and the CSO were solved to about 0.1 mm after calibration (the required accuracy); their absolute numbers are in the MIR/eSMA baseline files, NOT FOUND in the papers. |
| esma_fig1 | map of pads, JCMT and CSO | ESMA, Sec. 2, first paragraph | "the right panel shows the locations of the JCMT and CSO and the pad-positions for the SMA antennas"<br>ALT: ESMA, Fig. 1 caption: "Also labeled are a few key distances."<br>ALT: LIG24, Fig. 1 caption: "small green circles indicate the location of SMA antennas, yellow triangle represents JCMT location, and the pink diamond represents CSO location" |
| esma_fig1_509 | 509 m: SMA longest baseline (label, Fig. 1) | ESMA, Fig. 1 labels | "509 m" |
| esma_fig1_273 | 273 m: label of an arrow ending at the CSO from the compact/sub-compact pads (read from the figure image) | ESMA, Fig. 1 labels | "273 m"<br>Note: Not reproduced: from pad 1 (placed at the P2 point) the CSO is 288.7 m away and pad 1 is the SMA pad nearest to the CSO; a pad-1 to CSO distance of 273 m would need pad 1 about (+11.5, -10.6) m from the P2 point, which lies 3.5 m outside the placements allowed by the 782 m and 625 m baselines (it would give 773 m for the longest baseline). The start of the arrow is not identified in the text; treated as a rough figure annotation (Sec. Conflicts). |
| esma_fig1_160 | 160 m: JCMT to CSO label (Fig. 1); DERIVED 163.7 m | ESMA, Fig. 1 labels | "160 m" |

## Baselines

| id | value | source, location | quote |
|---|---|---|---|
| b09_bl | 45 eSMA baselines 25-782 m (22-678 kλ); 28 SMA baselines 68-509 m (VEX, 2008-04-14) | BOT09, Sec. 2.1 | "The 45 eSMA baselines and the 28 SMA baselines had lengths ... 25-782 m (22-678 kλ) and 68-509 m (56-419 kλ)"<br>ALT: SHI09, Sec. 2: "the eSMA then covered baselines ranging from 25 to 782 m (∼ 20 to 692 kλ or ∼ 0.′′ 2 to 10′′ )"<br>ALT: SHI09, Sec. 2: "The SMA was configured in its very extended array (maximum baselines to 508 m)"<br>Note: SHI09 (265-276 GHz, 2008-04-14) gives the same 25 to 782 m (20 to 692 kλ) for the same night. |
| esma_t1_bl | longest baseline 782 m (eSMA) vs 509 m (SMA) | ESMA, Table 1 | "Longest baseline (m) 782 509" |
| l24_t1a | Titan 2009-03-23: maximum baseline 780 m, area 488 m2; 2010-02-12: 625 m, 375 m2 | LIG24, Table 1 | "2009-03-23 06:40-14:25 8.4314 -2.9822 0.8 182.2 0.8422 0.384 × 0.196 48.8 780 488"<br>ALT: LIG24, Table 1: "2010-02-12 09:06-18:30 8.7061 4.5841 1.0 120.8 0.8156 0.382 × 0.228 53.8 625 375" |
| w99_770 | pre-construction plan: nearly 770 m (1999) | WIE99, Sec. 1 | "the longest baseline will nearly reach 770 m"<br>ALT: WIE99, Sec. 1: "collecting area to 488 m2 , increase the number of baselines to 45" |
| b09_50 | longest baseline +50% over the SMA alone | BOT09, Sec. 2.1 | "the longest baseline of the eSMA is increased by 50% compared to the SMA alone" |

**DERIVED baselines (3-D, from the pad frame and the placement above)**, eSMA = the config's 8 pads + JCMT + CSO, 45 baselines:

| config | SMA-SMA (m) | JCMT-pad (m) | CSO-pad (m) | JCMT-CSO (m) | eSMA shortest / longest (m) | longest pair |
|---|---|---|---|---|---|---|
| VEX | 68.4-508.9 | 155.7-624.5 | 288.7-781.6 | 163.7 | 68.4 / 781.6 | CSO-pad 19 |
| EXT | 44.2-226.0 | 155.7-333.7 | 288.7-469.9 | 163.7 | 44.2 / 469.9 | CSO-pad 15 |
| COM | 16.5-77.0 | 155.7-220.5 | 288.7-356.0 | 163.7 | 16.5 / 356.0 | CSO-pad 23 |
| SUB | 9.5-69.1 | 160.7-220.5 | 288.7-356.0 | 163.7 | 9.5 / 356.0 | CSO-pad 23 |

Tests: VEX longest eSMA baseline 781.6 m (CSO-pad 19) vs 782 m published (ESMA, BOT09, SHI09; LIG24 780 m in Table 1): agree to 0.4 m (the placement was tested against exactly this, so this is a consistency check on the tie, not an independent one; the JCMT-pad 19 distance 624.5 m vs 625 m (LIG24, 2010) is the second constraint). VEX SMA-SMA longest 508.9 m vs 509 m (ESMA). The published eSMA shortest baseline, 25 m (22 kλ), cannot be a 3-D separation: the shortest 3-D eSMA baseline is 68.4 m (SMA pads 1-12). In this record's simulated tracks (VEX + JCMT + CSO, 2 min samples) the shortest projected baseline is 30.8 m at dec -21 (+-3.5 h), 58.6 m at dec +13 (+-2.75 h) and 30.0 m at dec +25 (+-5 h): the published 25 m is a projected length (a baseline foreshortened when the source is near the baseline's direction); unreconciled by 5 m (the real tracks' hour angles are not given). The SMA-only 68 m in BOT09 equals the 3-D shortest VEX baseline, 68.4 m.

The non-VEX eSMA entries (EXT, COM, SUB) were not observed as eSMA in any saved source (VK12, BOT09, SHI09 all use VEX; ESMA Sec. 4 used the compact configuration for the first IRAS 16293 test, "far from optimal eSMA beam"); they are listed because the page's pad sets can be combined with the same two dishes (INFERRED, not an observed mode).

Collecting areas (DERIVED, pi D^2/4): SMA 6 m 28.27 m2; JCMT 176.71; CSO 84.95; eSMA (8 SMA + JCMT + CSO) 487.9 m2 (ESMA Table 1: 488); 7 SMA + JCMT 374.6 (LIG24: 375); 6 SMA + JCMT + CSO 431.3 (ESMA Table 1: 431); SMA alone 226.2 (226).

## Dishes, efficiencies, system temperatures, SEFDs

| id | value | source, location | quote |
|---|---|---|---|
| esma_app_D | SMA 6 m (ESMA Appendix B prints "8"), JCMT 15 m, CSO 10.4 m | ESMA, Appendix B | "except for their diameter (8, 15 and 10.4 m respectively)"<br>ALT: BOT09, Sec. 2.1: "Observations were carried out in single polarization mode with half-wave plates in the beam of the CSO and JCMT"<br>Note: The printed "8" for the SMA diameter is a typo: BOT09 Sec. 2.1 gives 6 m, and Ae,SMA 18.94 m2 = 0.67 x pi x 6^2/4 (DERIVED). |
| esma_app_eta | design aperture efficiencies 0.67, 0.55, 0.60 (SMA, JCMT, CSO) | ESMA, Appendix B | "(0.67, 0.55 and 0.60 respectively)"<br>ALT: ESMA, Appendix B: "effective apertures of the SMA, JCMT and CSO antennas and are 18.94, 97.19 and 50.97 m2 respectively" |
| b09_eff | 2008-04-14 measured: SMA 0.75, JCMT 0.70, CSO 0.30 | BOT09, Sec. 2.2 | "imply average efficiencies of about 0.75 for the SMA antennas, 0.70 for the JCMT, and 0.30 for the CSO"<br>Note: CSO low because of a malfunction of the rotating polarizer (BOT09). |
| s09_eff | 2008-04-14 (same night): JCMT 0.40, CSO 0.30 (relative to SMA 0.75) | SHI09, Sec. 2 | "the estimated aperture efficiencies of the JCMT and the CSO telescopes were found to be 40% and 30%"<br>ALT: SHI09, Sec. 2: "Based on an aperture efficiency of 75% of the SMA antennas"<br>ALT: SHI09, Sec. 2: "The CSO’s aperture efficiency is typically & 60% when the telescope is used as a single-dish telescope."<br>Note: Conflict with BOT09 on the JCMT (0.70 vs 0.40); both for the same observation. |
| b09_trx | receiver temperatures: SMA 45-70 K; CSO the same or higher; JCMT 2.5x higher (BOT09) | BOT09, Sec. 2.2 | "The SMA receiver temperatures ranged from ∼45 to 70 K on both nights, with the CSO comparable to the high end of this range, and the JCMT a factor of 2.5 times higher." |
| s09_trx | receiver temperatures: SMA and CSO 85-140 K; JCMT 290 K (SHI09) | SHI09, Sec. 2 | "The receiver temperatures of the SMA antennas and the CSO antenna ranged from ∼ 85 to 140 K, while the JCMT antenna’s receiver temperature was ∼ 290 K."<br>Note: BOT09 and SHI09 differ by about a factor of 2 on the SMA receiver temperature; the measurement conditions (frequency) differ (260-267 GHz vs 265-276 GHz in both). Not reconciled. |
| s09_tsys | DSB system temperatures: SMA and CSO 200-500 K, JCMT 300-600 K (265-276 GHz) | SHI09, Sec. 2 | "The double sideband system temperature of the SMA antennas and the CSO telescope were ranging between ∼ 200 – 500 K, while the double sideband system temperature of the JCMT telescope was ranging between ∼ 300 – 600 K." |
| sma_tsys | SMA Tsys (DSB) 80-200 (230), 150-350 (345) K; aperture efficiency 0.70-0.80 / 0.60-0.75 | OCSPEC, Receivers table | "T sys (DSB, K) 80-200 90-220 150-350 150-350"<br>ALT: OCSPEC, Antennas table: "aperture efficiency (230/240 GHz) (345 GHz) (400 GHz) 0.70-0.80 0.60-0.75 0.60-0.75"<br>ALT: OCSPEC, Antennas table: "diameter 6m"<br>Note: SMA record keys OCSPEC (already saved). |
| p2_t3_jcmt | JCMT 2017 at 230 GHz: eta 0.52, Tsys* 345 K, SEFD 10,500 Jy | P2, Table 3, JCMT row | "JCMT 15 0.52 345 10,500 3.5"<br>ALT: P2, Table 3 note a: "SEFD=2kT * sys /hA Ageom"<br>Note: EHT-era (2017) single dish with the 230 GHz receiver; includes atmosphere and the elevation of the sources. Check DERIVED: 2761.3 x 345 / (0.52 x 176.7 m2) = 10,367 Jy. |
| p2_t3_sma | SMA phased 6 antennas, 2017: SEFD 6200 Jy (14.7 m effective, eta 0.75) | P2, Table 3, SMA6 row | "SMA6c 14.7 0.75 285 6200 2.7"<br>ALT: P2, Table 3 note c: "The median number of phased antennas in 2017 for the SMA was 6 × 6 m antennas"<br>Note: Per antenna about 6 x 6200 = 37,200 Jy if the phasing efficiency is perfect (DERIVED, ideal; the P2 value includes phasing losses). |

**SEFD recipe**: SEFD = 2 k Tsys / Ae with Ae = eta A (P2 note a: SEFD = 2 k T*sys / eta A_geom). 2 k x 10^26 = 2761.3 Jy m2 K^-1 (DERIVED: 2 x 1.380649e-23 x 1e26). The eSMA papers give no SEFD (NOT FOUND), only the pieces above, so:

| set | assumptions | SMA (Jy) | JCMT (Jy) | CSO (Jy) |
|---|---|---|---|---|
| A (design; recommended) | Ae 18.94, 97.19, 50.97 m2 (ESMA App. B); Tsys 300 K DSB for all (INFERRED, mid of OCSPEC 345 GHz range 150-350 K and of SHI09 200-500 K) | 43738 | 8523 | 16252 |
| B1 (April 2008 measured, SHI09) | eta 0.75, 0.40, 0.30; Tsys 350, 450, 350 K (midpoints of the quoted ranges, INFERRED) | 45575 | 17579 | 37923 |
| B2 (as B1 with BOT09 JCMT eta 0.70) | JCMT 0.70, Tsys 450 K | 45575 | 10045 | 37923 |
| ratios in A | 1 / Ae: SMA : JCMT : CSO | 1.00 | 0.195 | 0.372 |

The relative weighting 1 / (SEFD_i SEFD_j) of a JCMT-CSO baseline against an SMA-SMA baseline is 13.8 in set A and 3.12 in set B1 (DERIVED). Also DERIVED from OCSPEC (not eSMA): a single SMA antenna at 230 GHz, Tsys 80-200 K and eta 0.80-0.70: 9.8-27.9 kJy; at 345 GHz, Tsys 150-350 K and eta 0.75-0.60: 19.5-57.0 kJy. ESMA Appendix B itself treats Tsys as equal for all antennas "as a 0th order approximation" (quote: "Assuming identical Tsys for all antennas as a 0th order approximation"). CSO single-dish efficiency "typically & 60%" (SHI09; set A uses the design 0.60).

## Primary beams, surface and pointing

| id | value | source, location | quote |
|---|---|---|---|
| f14_jb | JCMT beam at 337 GHz: 15 arcsec | FAV14, Sec. 4.1 | "to mimic the JCMT beam at 337 GHz (15′′ )" |
| f14_cb | CSO beam at 337 GHz: 20 arcsec | FAV14, Sec. 4.1 | "similar to the CSO beam at 337 GHz (20′′ )" |
| s09_jb | JCMT beam 19 arcsec at 266 GHz (single dish, Saturn) | SHI09, Sec. 2 | "beam efficiency was measured to be 65% with a beam size of ∼ 19′′ at 266 GHz" |
| sma_pb | SMA primary beam 55, 51, 36, 31 arcsec at 230, 240, 345, 400 GHz | OCSPEC, Receivers table | "primary beam (") 55 51 36 31" |
| vk_pb | a source at 20 percent of the SMA primary beam lies outside the JCMT and CSO primary beams | VK12, Sec. 3.1.2 | "in fact outside the primary beam of the JCMT and CSO" |
| eaoa_surf | JCMT surface accuracy 24 micron (typical) | EAOA, About the JCMT | "The surface accuracy is routinely measured and has a typical value of 24 micron."<br>ALT: EAOA, About the JCMT: "The 15-metre diameter primary reflector of the JCMT is made up of 276 individual lightweight panels." |
| eaoa_pt | JCMT rms pointing about 2 arcsec | EAOA, About the JCMT | "The rms pointing accuracy of the JCMT is about 2 arcsec in Azimuth and Elevation." |

**DERIVED (k = FWHM / (lambda/D); lambda = 299.792458 / nu mm)**: JCMT 15 arcsec at 337 GHz: lambda/D = 12.23 arcsec, k = 1.226 (the 19 arcsec JCMT beam at 266 GHz of SHI09 gives k = 1.226, the same); CSO 20 arcsec: lambda/D = 17.64 arcsec, k = 1.134; SMA 36 arcsec at 345 GHz: k = 1.205 (sma.md). Primary-beam FWHM at the eSMA bands (DERIVED, k = 1.2 SMA, 1.23 JCMT, 1.13 CSO): at 230 GHz 54, 22.0, 29.3 arcsec; at 345 GHz 36, 14.7, 19.5 arcsec (SMA, JCMT, CSO). The 19 arcsec of SHI09 is the JCMT beam at 266 GHz from a Saturn scan with the single dish (not the interferometer).

## Elevation limits

JCMT and CSO elevation limits: NOT FOUND (EAO About page, WIE99, ESMA, BOT09, SHI09 and the Caltech page do not state them). Lowest elevation at which the JCMT was detected in the EHT 2017 data: 12.5 deg (DERIVED in `data/interf/eht2017.md`, not a limit). SMA limits as in sma.md (hardstop 6.7 deg, 15 deg calculator default, 33 deg SUB). The page uses 15 deg for every station (INFERRED).

## Validation targets (published eSMA beams) and the simulation

Published (weighting as stated; all VEX + JCMT + CSO unless noted):

| id | value | source, location | quote |
|---|---|---|---|
| b09_beam | PKS 1830-211, 1.1 mm continuum (267 GHz), 2008-04-14, 7 h: 0.55 x 0.22 arcsec, PA 32 deg; SMA only 0.50 x 0.33, PA 25 | BOT09, Table 1 | "Beam FWHM 0.′′ 55 × 0.′′ 22 0.′′ 62 × 0.′′ 30 0.′′ 57 × 0.′′ 40"<br>ALT: BOT09, Table 1: "Beam P.A. 32◦ 38◦ 15◦"<br>ALT: BOT09, Sec. 2.1: "resulting in a best resolution at 1.1 mm of 0.′′ 55×0.′′ 22"<br>ALT: BOT09, Sec. 2.1: "for seven hours on 2008 April 14 (with eight SMA antennas in the very-extended configuration, or “vex”)"<br>ALT: BOT09, Sec. 2.1: "δJ2000 = −21◦ 03′ 39.′′ 77"<br>ALT: ESMA, Table 2 (continuum, SMA): "0.′′ 50 × 0.′′ 33, 25◦"<br>Note: Weighting not stated for the beam (the SPIE Table 1 note says its resolutions are uniform). Opacity 0.15-0.25 at 225 GHz. |
| s09_beam | IRC+10216, 264-276 GHz, 2008-04-14, 5.5 h track (4 h on source), dec +13.28: 0.46 x 0.22 arcsec, PA 39.9 deg | SHI09, Sec. 2 | "The synthesized beam size was 0.′′ 46 × 0.′′ 22 with a position angle of 39.9◦"<br>ALT: SHI09, Sec. 2: "The track lasted 5.5 hours, and about 4 hours of on-source data were acquired."<br>ALT: SHI09, Sec. 2: "Decl. = 13◦ 16′ 43.′′ 898 (J2000)"<br>ALT: SHI09, Sec. 2: "The total bandwidth of ∼ 4 GHz (2 GHz from each sideband"<br>Note: Weighting not stated. |
| esma_t1_res | SPIE estimate at 345 GHz, dec +25, H.A. +-5, 6.7 h on source: eSMA 0.18 x 0.32, SMA 0.24 x 0.32 arcsec; 230 GHz measured 0.22 x 0.55 | ESMA, Table 1 | "Resolution (arcsec) 0.22×0.55 0.18×0.32 0.24×0.32"<br>ALT: ESMA, Table 1, note (ii): "Resolutions are given for uniform weighting and sensitivities for natural weighting."<br>ALT: ESMA, Sec. 2.4: "assuming a frequency of 345 GHz, 6.7 hr of on-source integration time (H.A.=±5), a source declination of 25"<br>ALT: ESMA, Table 1, note (iii): "Bold characters denote values measured for the 7-hr track on PKS 1830−211"<br>Note: The eSMA 230 GHz 0.22 x 0.55 is the PKS 1830 measurement (bold in the paper). |
| vk_t2 | NGC 2071, 349.4 GHz, 2010-02-11, 1.5 h: 0.37 x 0.19 arcsec, natural weighting | VK12, Table 2 | "Feb 11 2010 eSMA NGC 2071 0.37”x0.19” 2 GHz 349.415 USB s17 128"<br>ALT: VK12, Sec. 2.1: "a natural weighting was applied to obtain the best images"<br>ALT: VK12, Sec. 2.1: "The limited observing time of 1.5 hours"<br>ALT: VK12, Table 1: "NGC 2071 05 47 04.7 +00 21 44"<br>Note: Hour angle range not stated. |
| f14_t1 | IRAS 16293-2422, 337.7 GHz, 2009-03-22, 3.4 h on source: 0.46 x 0.29, PA 52 deg (SMA + eSMA combined: 0.59 x 0.38) | FAV14, Table 1 | "1 eSMA 2009 March 22 337.671 0.72 0.46 × 0.29 52 80"<br>ALT: FAV14, Sec. 2.1: "Observations of IRAS 16293-2422 were carried out with the eSMA on 2009 March 22 for 3.4 hours on source in single linear polarization mode."<br>ALT: FAV14, Sec. 2.1: "δJ2000 = -24◦ 28′ 35.′′ 50"<br>ALT: FAV14, Sec. 2.3: "The uniform weighted synthesized beam was 0.58′′ × 0.38′′"<br>Note: Weighting not stated. |
| l24_t1a | Titan, 349.4 GHz: natural beam 0.384 x 0.196 arcsec, PA 48.8 deg (2009-03-23, 780 m); 0.382 x 0.228, PA 53.8 (2010-02-12, 625 m, 7 SMA + JCMT) | LIG24, Table 1 | "2009-03-23 06:40-14:25 8.4314 -2.9822 0.8 182.2 0.8422 0.384 × 0.196 48.8 780 488"<br>ALT: LIG24, Table 1: "2010-02-12 09:06-18:30 8.7061 4.5841 1.0 120.8 0.8156 0.382 × 0.228 53.8 625 375"<br>ALT: LIG24, Table 1 notes: "g Natural beam shape"<br>ALT: LIG24, Sec. 2: "near 349.4 GHz"<br>Note: Titan declination NOT FOUND in LIG24 (not usable as a simulation target). |

**Simulation (DERIVED; `esma_sim.py`)**: stations = the VEX pads (CFG) + JCMT + CSO about pad 1 (the tie above); uv tracks at latitude 19.8242 deg, 2 min samples, symmetric hour-angle range (+-half the stated track length; the true range is not given: INFERRED), elevation >= 15 deg for all stations (INFERRED), baselines shadowed when the projected separation is below the mean of the two dish diameters; weights 1 / (SEFD_i SEFD_j) with SEFD proportional to 1 / Ae (set A, equal Tsys); uniform weighting uses cells of 1 / (10 arcsec) in uv; central lobe = filled ellipse of the contiguous >= 50% region of the dirty beam (the same method as sma.md).

| case | simulated (uniform, arcsec, PA deg) | simulated (natural) | published |
|---|---|---|---|
| PKS 1830, 267 GHz, dec -21.06, +-3.5 h | 0.54 x 0.24, PA 34 | 0.67 x 0.28, PA 36 | 0.55 x 0.22, PA 32 |
| IRC+10216, 270 GHz, dec +13.28, +-2.75 h | 0.44 x 0.20, PA 45 | 0.59 x 0.24, PA 45 | 0.46 x 0.22, PA 39.9 |
| SPIE estimate, 345 GHz, dec +25, +-5 h, eSMA | 0.32 x 0.19, PA 57 | 0.44 x 0.20, PA 48 | 0.32 x 0.18 (uniform) |
| same, SMA only | 0.32 x 0.27, PA 63 | 0.35 x 0.29, PA 45 | 0.32 x 0.24 (uniform) |
| NGC 2071, 349.4 GHz, dec +0.36, +-0.75 h | 0.35 x 0.18, PA 45 | 0.48 x 0.18, PA 38 | 0.37 x 0.19 (natural) |
| IRAS 16293, 337.7 GHz, dec -24.48, +-1.7 h | 0.46 x 0.19, PA 27 | 0.58 x 0.21, PA 30 | 0.46 x 0.29, PA 52 |

Reading: the uniform-weighted simulation reproduces the published beams of the three long tracks (PKS 1830, IRC+10216, SPIE estimate) to <= 0.03 arcsec in each axis, and the PA to 2-5 deg where one is published. NGC 2071 (published natural weighting) is matched by the uniform simulation, not the natural one: the weighting in the published maps is not stated or is a robust weighting (INFERRED); for the 1.5 h NGC 2071 and 3.4 h IRAS 16293 tracks the hour-angle coverage is unknown, so the minor axis and PA differ (IRAS 16293 minor axis 0.19 vs 0.29 arcsec). Treat the published beams as targets with a tolerance of about 25% in the geometric mean. Sensitivity of the beam to the JCMT-CSO placement (uniform weighting; PKS 1830, IRC+10216, SPIE estimate): placement (0, 0) 0.54x0.24, 0.44x0.20, 0.32x0.19; placement (+8, 0) 0.51x0.24, 0.44x0.20, 0.31x0.17; (0, +14) 0.53x0.24, 0.47x0.19, 0.31x0.16; (-7.5, -12.75) 0.54x0.23, 0.44x0.20, 0.32x0.19; COM-centroid placement (+38.7, +2.8) 0.50x0.25, 0.46x0.20, 0.33x0.17: the beam sizes are insensitive; the 782 m test is the discriminator.

Sensitivity ratios of the design (ESMA Table 1, estimates; sensitivities for natural weighting): see json (`esma_table1`).

## Conflicts

- JCMT aperture efficiency on 2008-04-14: BOT09 0.70 vs SHI09 0.40 (both quote the SMA at 0.75 and the CSO at 0.30). Set B1 uses 0.40, B2 0.70.
- SMA receiver temperature: BOT09 45-70 K vs SHI09 85-140 K (different frequency set-ups, same night); BOT09 JCMT "a factor of 2.5 times higher" vs SHI09 JCMT 290 K against 85-140 K (a factor of 2-3.4).
- Longest baseline: 782 m (ESMA, BOT09, SHI09) vs 780 m (LIG24 Table 1, 2009 data) vs "nearly 770 m" (WIE99, pre-construction) vs 781.6 m derived here.
- 273 m in ESMA Fig. 1 vs 288.7 m derived (P2 SMA point to CSO); the arrow's start point on the pad map is not identified in the text (the figure image, not machine-checkable); not reconciled. 160 m (Fig. 1) vs 163.7 m derived vs 164 m (WIE99).
- ESMA Appendix B prints the SMA diameter as "8" m; BOT09 Sec. 2.1 and the Ae value 18.94 m2 imply 6 m (typo).
- Shortest baseline: 25 m published (BOT09, SHI09) vs 68.4 m 3-D derived; resolved as a projected length (simulated 30-59 m); the SMA-only 68 m in BOT09 is the 3-D VEX shortest.
- February 2010 configuration: VK12 describes the NGC 2071 track of Feb 11 as "combined with the JCMT and the CSO"; LIG24 states that on 2010-02-12 only 7 SMA antennas and the JCMT were used (375 m2, 625 m).
- Pad 7 and pad 8 conflicts of the SMA record (sma.md) do not affect the VEX pads used here.
- EHT files: the ehtim SMA row is the CSO position (3.1 m), not the SMA (eht2017.md, sma.md).

## NOT FOUND

- Absolute position of pad 1 (or any pad) and any published JCMT or CSO position in the pad frame; the JCMT/CSO/pad frame tie here is INFERRED.
- JCMT and CSO elevation limits; JCMT and CSO SEFDs or Tsys at 345 GHz in eSMA mode; the 2008-2010 eSMA SEFDs of any station (only 265-276 GHz Tsys ranges).
- Pad set of the SMA during each eSMA track (VEX is named; its pad list at the time is INFERRED to be the CFG list).
- How often the eSMA was scheduled, the date of its last observation, and any statement of the facility's end.
- Whether the SMA and the JCMT offer joint imaging (SMA + JCMT, no CSO) in 2026: nothing in the saved SMA Observer Center pages or the EAO pages says so.
- Titan declination and hour-angle range of the published tracks (the simulated beams assume symmetric tracks).
- The hour-angle ranges and weighting of the published beams.
- A published SEFD value for the JCMT or CSO as an eSMA element.

## References (ADS bibcodes, looked up through the ADS API and title-checked; response saved as `ads_bibcodes.json`)

| bibcode | reference | title (as returned by ADS) |
|---|---|---|
| 2008SPIE.7012E..0DB | Bottinelli et al. 2008, SPIE 7012, 70120D | The eSMA: description and first results |
| 2009ApJ...690L.130B | Bottinelli et al. 2009, ApJ 690, L130 | Detection of C I in Absorption toward PKS 1830 - 211 with the eSMA |
| 2009ApJ...698.1924S | Shinnaga et al. 2009, ApJ 698, 1924 | IRC+10216'S Innermost Envelope--The eSMA'S View |
| 2012ApJ...751..137V | van Kempen et al. 2012, ApJ 751, 137 | The Small-scale Physical Structure and Fragmentation Difference of Two Embedded Intermediate-mass Protostars in Orion |
| 2014ApJ...790...55F | Favre et al. 2014, ApJ 790, 55 | Dynamical Structure of the Inner 100 AU of the Deeply Embedded Protostar IRAS 16293-2422 |
| 2024PSJ.....5...98L | Light et al. 2024, PSJ 5, 98 | Measurements of Titan's Stratospheric Winds during the 2009 Equinox with the eSMA |
| 2019ApJ...875L...2E | EHT Collaboration 2019, ApJL 875, L2 | First M87 Event Horizon Telescope Results. II. Array and Instrumentation |
| 1994ApJ...434L..75L | Lay et al. 1994, ApJ 434, L75 | Protostellar Accretion Disks Resolved with the JCMT-CSO Interferometer |

No bibcode: SMA Technical Memo 136 (Wiedner 1999; WIE99), the SMA Newsletter 40, the SMA MIRIAD support thread, the astropy-data sites file, the EAO web pages. An ADS search for abstracts containing eSMA also returned Tang et al. 2013 (ApJ 763, 135; W51 North; downloaded, no eSMA data, not used) and Gurwell et al. 2009 (DPS abstract, Titan CH3CN with the eSMA; not saved).

## Notes

- Positions: JCMT and CSO about pad 1 are `[54.48, -154.03, 5.01]` and `[212.33, -195.49, -7.93]` m (east, north, up) under the INFERRED pad-1 = P2-SMA-point tie. The up component of pad 1 relative to the P2 point is unknown (taken 0); a 10 m change in it moves the CSO-pad 19 distance by about 0.5 m.
- ESMA Table 1 sensitivities (natural weighting, 345 GHz, 6.7 h, dec +25, pwv 1.5 mm; continuum mJy/beam; line K per 1 km/s): eSMA sp 345: 1.1 and 5.6; SMA sp 230 col: 2.3 and 10.7; the eSMA gain over the SMA alone is "a factor of ~3-5 in observing speed" with dual polarization (ESMA Sec. 1). Rows of the paper are in the json.
- Scripts: `/private/tmp/claude-501/-Users-cconroy-memos/1afe1b95-89f0-42d0-86cc-df49c96c34df/scratchpad/sma/esma_work/` (`geom_lib.py`/`geom.py` geodetic and ENU, `derive.py` derived numbers, `esma_sim.py` and `sens.py` beams, `minproj.py` shortest projected baselines, `h1.py`/`h2.py` tie tests, `recs_esma.py` quote records, `qcheck.py` checker, `adsq.py` ADS query, `build_esma.py` this build).
