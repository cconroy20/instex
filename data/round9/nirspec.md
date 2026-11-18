# Round 9 (2026-11-18): NIRSPEC, the near-infrared cross-dispersed echelle spectrograph of the Keck II telescope (id `nirspec`)

Keck II NIRSPEC (UCLA Infrared Laboratory, commissioned 1999, upgraded Dec 2018). NOT JWST NIRSpec. Same rules as rounds 1-8 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/nirspec/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value chosen so that the explorer reproduces published performance where the prescription is unpublished; **INFERRED** marks a reading that is not stated; **MEASURED** marks a value read from a published figure (method and scale given); **NOT FOUND** marks a gap. Quotes were machine-checked (131 quote pieces, 0 failures) against `pdftotext -layout`, `-raw` and default-order text of each PDF and the tag-stripped text of each HTML page, with whitespace, case, quotes, dashes, minus signs, the micro sign and Greek letters, ligatures and hyphenation normalized (punctuation other than . , / % + < > = is dropped on both sides); " ... " joins non-adjacent pieces. Three PDFs are SCANS with an OCR layer that is incomplete or has errors (McLean et al. 1998, Robichaud et al. 1998, McLean et al. 1995): 43 of their 54 quote pieces matched the OCR, the other 11 are transcribed from the scan (including all of Table 1 of McLean 1998). Quotes of the Keck spectral_dispersion.xlsx are not text-checked (values read from the parsed cells; `data/round9/nirspec_dispersion_table.tsv`). Figure-derived entries (MEASURED, INFERRED) and DERIVED lines have no quote. Machine-readable twin: `data/round9/nirspec.json`.

## Completeness summary

**Complete from the open literature:** the feed (Keck II right Nasmyth, f/15, re-imaged to f/10 at 2.06 arcsec/mm), the slits (echelle 0.144-0.720 arcsec, 12 or 24 arcsec long; low-res 0.38-0.76 arcsec, 42 arcsec), the off-axis paraboloid collimator (f = 1.2 m, 120 mm beam), the echelle (23.29 /mm cryogenic, blaze 63.5 deg R2, gamma 5 deg, 142 x 320 mm), the cross-disperser (75.75 /mm, blaze about 10 deg, 50 deg between input and output beams, orders 1-4, 216 x 200 mm), the three-mirror-anastigmat camera type, both detectors (Aladdin III 1024 x 1024 of 27 um to 2018; H2RG 2048 x 2048 of 18 um since), the filters and their bands, the orders per band and the measured dispersion of 66 orders in Y, J, H and K (the Keck table), the published layout figure, and (from Robichaud et al. 1998) the TMA mirror table, the focal lengths in both directions (464.24 mm in y, 407.49 mm in x) and the effective aperture.

**Not found:** the TMA mirror vertex spacings and offsets (the design notes are dead links), the echelle's in-plane angle, the collimator's off-axis tilt, a measured resolving power (McLean et al. 2000 not supplied), and a scaled layout. **Camera:** the sourced EFLs (464.24 mm along the dispersion, 407.49 mm in the XD plane) agree with the focal lengths DERIVED from the published pixel scales (463.5 and 409 mm) to 0.2-0.4 percent, which settles y = dispersion; the fit to Keck's dispersion table gives 473.6 mm (2.0 percent higher, inside the 2.6-4.3 percent as-built EFL tolerance). **Agreement:** with the sourced 464.24 mm, the explorer's cross-disperser angles for K, Y, J and H come out within 0.2 deg of Keck's table, the dispersion a median 2.0 percent high over 66 orders (61 within 5 percent), and the orders per band within one.

## Sources

| key | document | local file (rawdata/presets/nirspec/) | URL |
|---|---|---|---|
| M98 | McLean, I. S., Becklin, E. E., Bendiksen, O., et al. 1998, Proc. SPIE 3354, 566, "The Design and Development of NIRSPEC: A Near-Infrared Echelle Spectrograph for the Keck II Telescope" (ADS 1998SPIE.3354..566M; title checked on ADS). Keck copy (W. M. Keck Observatory Report #251 reprint, 13 journal pages 566-578, 16 PDF pages with the report cover). SCANNED PAGES: the text layer is incomplete OCR (Table 1 is missing most cells, words are dropped); its quotes are transcribed from the scan and, where the OCR holds them, machine-matched. Journal page p = PDF page + 564 (Table 1 on PDF p. 3 = journal p. 567; Fig. 1 on PDF p. 4 = journal p. 568) | keck_McLean_SPIE_1998_NIRSPEC-orig.pdf (identical copy: keck_KOR251.pdf) | https://www2.keck.hawaii.edu/inst/nirspec/McLean_SPIE_1998_NIRSPEC-orig.pdf |
| RB98 | Robichaud, J. L., Zellers, B., Philippon, R., McLean, I. S. & Figer, D. F. 1998, Proc. SPIE 3354, 1068, "Cryogenic Performance of the NIRSPEC Three-Mirror Anastigmat" (ADS 1998SPIE.3354.1068R; supplied by the user; 9 pages, journal pp. 1068-1076). SCANNED pages (JBIG2 images) with an OCR text layer that has errors ("nun" for mm, "f/lO"): quote pieces that match the OCR are machine-matched, the rest are transcribed from the scan | robichaud1998_3354_1068.pdf | supplied by the user (SPIE paywall) |
| M95 | McLean, I. S., Becklin, E. E., Figer, D. F., Larson, S. B., Liu, T. & Graham, J. R. 1995, Proc. SPIE 2475, 350, "NIRSPEC: A near infrared crossdispersed echelle spectrograph for the Keck II telescope" (ADS 1995SPIE.2475..350M; supplied by the user; 10 pages, journal pp. 350-358). The CONCEPT design, superseded by the as-built values: used here for history and conflicts only. SCANNED, OCR layer with errors (e.g. "f12.2" for f/2.2) | mclean1995_2475_350.pdf | supplied by the user (SPIE paywall) |
| U99 | McLean, I. S. (P.I.), "NIRSPEC SUMMARY", UCLA Infrared Laboratory, dated August 19, 1999 (commissioning summary written for Keck users; the only source for the cryogenic groove densities, gamma, the cross-disperser geometry and the camera speed; HTML text layer) | ucla_nirspec_summary2.html | https://irlab.astro.ucla.edu/instruments/nirspec/nirspec_summary.html |
| M14 | Martin, E. C., Fitzgerald, M. P., McLean, I. S., et al. 2014, Proc. SPIE 9147, 914781, "Performance modeling of an upgraded NIRSPEC on Keck" (ADS 2014SPIE.9147E..81M). NOTE: Keck's page names this file "Martin_SPIE_2016_NIRSPEC-upgrade.pdf" and lists it as the 2016 slit-viewing-camera paper (9908), but the file is the 2014 paper (header: Proc. of SPIE Vol. 9147 914781); the 2016 paper (2016SPIE.9908E..2RM) is NOT in hand. Clean text layer | keck_Martin_SPIE_2016_NIRSPEC-upgrade.pdf (Keck's file name; contents = 2014 paper) | https://www2.keck.hawaii.edu/inst/nirspec/Martin_SPIE_2016_NIRSPEC-upgrade.pdf |
| M18 | Martin, E. C., Fitzgerald, M. P., McLean, I. S., et al. 2018, Proc. SPIE 10702, 107020A, "An overview of the NIRSPEC upgrade for the Keck II telescope" (ADS 2018SPIE10702E..0AM; arXiv:1808.06024; clean text layer; Figs 1-2 and Table 1 on pp. 2-3) | Martin2018_SPIE10702_arXiv1808.06024.pdf | https://arxiv.org/pdf/1808.06024 |
| L20 | Lopez, R. A., Hoffman, E. B., Doppmann, G., et al. 2020, Proc. SPIE 11447, 114476B, "Characterization and performance of the upgraded NIRSPEC on the W. M. Keck Telescope" (ADS 2020SPIE11447E..6BL; Keck copy; clean text layer; the primes after arcsecond values are garbled by the PDF font, e.g. "0.28800" is 0.288 arcsec) | keck_Lopez_SPIE_2020Dec_NIRSPEC-Upgrade.pdf | https://www2.keck.hawaii.edu/inst/nirspec/Lopez_SPIE_2020Dec_NIRSPEC-Upgrade.pdf |
| KS | Keck NIRSPEC "Specifications" page (Detector Characteristics updated December 2020; slits, orders, pointers to the dispersion table) | keck_Specifications.html | https://www2.keck.hawaii.edu/inst/nirspec/Specifications.html |
| KF | Keck NIRSPEC "Filters" page (two science filter wheels; the 2022 and 2025 filter swaps) | keck_filters.html | https://www2.keck.hawaii.edu/inst/nirspec/filters.html |
| KN | Keck NIRSPEC status and news page (status updated March 2025) | keck_news.html | https://www2.keck.hawaii.edu/inst/nirspec/news.html |
| KC | Keck NIRSPEC calibration page (echelle arc-lamp and sky-line tools: orders and wavelength ranges per setting) | keck_cals.html | https://www2.keck.hawaii.edu/inst/nirspec/cals.html |
| KD | Keck NIRSPEC measured spectral dispersion table (IRAF identify/dispcor fits; Y, J, H taken 2019 Oct 19 with a 0.288 arcsec slit, K and L 2020 Dec 3 with 0.144 arcsec; echelle angle, XD angle, order, A/pix, wavelength at pixels 1 and 2048). XLSX, no text layer: its values are read from the parsed cells (data/round9/nirspec_dispersion_table.tsv) and are not quote-checked; dispersion.pdf is the plot of the same values | keck_spectral_dispersion.xlsx, keck_dispersion.pdf | https://www2.keck.hawaii.edu/inst/nirspec/spectral_dispersion.xlsx |
| KOA | Keck Observatory Archive, "NIRSPEC Instrument and Data Format" (the pre-upgrade description by the UCLA team: Table 2, Summary of Properties) | koa_nirspec_data_description.html | https://www2.keck.hawaii.edu/koa/public/nspec/nirspec_data_description.html |
| KI | Keck NIRSPEC home page | keck_nirspec_index.html | https://www2.keck.hawaii.edu/inst/nirspec/ |

Also saved, not quoted: keck_idx-preobs.html, idx-obs, idx-postobs, idx-index, idx-eng (Keck page indexes), keck_sens.html (sensitivities), keck_obs_procedures.html, keck_imrot.html, keck_lines.html, keck_pypeit_nirspec.html, keck_xnirspec.html, keck_mechanism_images.html, keck_nirspec_news.html (404 body), keck_N1arclamps.html (404 body), keck_spec_highres.png, keck_spec_lowres.png, keck_slitwheel.png (Keck detector-format and slit-wheel diagrams), gemini_nirspecGen.html (Gemini 2001 description), ucla_index.html, keck_KOR251.pdf (a second copy of McLean 1998), keck_dispersion.pdf.

## NIRSPEC parameters

### Telescope and feed

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Focus | Right Nasmyth (RNAS) platform of Keck II, f/15, tertiary mirror in place |  | U99, Sec. 2 | "resides on kinematic mounts on the Right Nasmyth (RNAS) platform of the Keck II telescope and operates at the f/15 focus with the tertiary mirror in place" |
| Focus (alt) | ALT: f/15 input beam, RNAS, Keck II |  | KS, Basic NIRSPEC Specifications | "RNAS, Keck-2, f/15 input beam" |
| Focus (alt, shared with DEIMOS) | ALT: right f/15 Nasmyth station |  | KOA, Sec. 1.1 | "Access to the right (f/15) Nasmyth focal station of Keck II is shared with DEIMOS" |
| Plate scale at the telescope focus | 1.38 | arcsec/mm | M98, Sec. 3.1, p. 567 (scan) | "which has a plate scale of 1.38 arcsec per mm" (transcribed from the scan) |
| Telescope pupil and F used by the explorer | D = 10.95 m, F = 13.7 (project rule) |  | project, web/presets.js header | "Keck: D = 10.95 m at f/13.7" |
| Re-imaged beam at the slit plane | f/10, 2.06 arcsec/mm |  | U99, Sec. 2 | "convert the beam from f/15 to f/10 (2.06"/mm) at the slit plane" |
| Front-end pupil image | 26 | mm | U99, Sec. 2 | "produce a pupil image approximately 26 mm in diameter and provide a convenient location for a cold stop" |
| Slit tilt (toward the slit-viewing camera) | 12 | deg | U99, Sec. 4 | "Each slit is tilted by about 12° to enable reflected light to reach the independent infrared slit-viewing camera" |
| Echelle-mode slit widths (post-upgrade pixel scale) | 0.144, 0.288, 0.432, 0.576, 0.720 arcsec (1.5, 3, 4.5, 6, 7.5 pix) |  | KS, Basic NIRSPEC Specifications, High-Res Slits | "High-Res Slits: 0.144"x12 (1.5-pix) 0.288"x12 (3-pix) 0.432"x12 (4.5-pix) 0.576"x12 (6-pix) 0.720"x12 (7.5-pix)" |
| Echelle-mode slit lengths | 12 arcsec (all widths); 24 arcsec (0.288, 0.432, 0.576, 0.720) |  | KS, Basic NIRSPEC Specifications | "0.288"x24 (3-pix) 0.432"x24 (4.5-pix) 0.720"x24 (7.5-pix)" |
| Echelle-mode slit widths (design) | ALT: 0.14, 0.29, 0.43, 0.58, 0.72 arcsec; lengths 12 or 24 arcsec |  | M98, Table 1, p. 567 (scan) | "Slit widths 0.14, 0.29, 0.43, 0.58, 0.72 Slit lengths 12 or 24" (transcribed from the scan) |
| Low-resolution slits | 42 arcsec long; 0.380 (3 pix), 0.570 (4.5 pix), 0.760 (6 pix) arcsec wide |  | KS, Basic NIRSPEC Specifications, Low-Res Slits | "Low-Res Slits: 42x0.380" (3-pix) 42x0.570" (4.5-pix) 42x0.760" (6-pix)" |
| Spectra on the detector | INFERRED: 1 | single object | U99, Sec. 4 | "There is no imaging mode which does not contain a slit" |

### Collimator and beam

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Collimator type and focal length | off-axis paraboloid (OAPC), f = 1.2 m |  | M98, Sec. 3.1 Back End Optics, p. 570 (scan); Fig. 1 caption, p. 568 | "travels 1.2 m to an off-axis paraboloid mirror (called the OAPC) which acts as the collimator producing a 120 mm beam which returns almost the same distance" (transcribed from the scan) |
| Collimator focal length (Fig. 1 scale) | ALT: 1200 | mm | M98, Fig. 1 caption, p. 568 (scan) | "For scale, the focal length of the collimator is 1.2 m" (transcribed from the scan) |
| Collimator (alt) | ALT: off-axis parabolic mirror, 120 mm pupil on the echelle |  | U99, Sec. 2 | "the emergent f/10 beam is collimated with an off-axis parabolic mirror to produce a 120 mm diameter pupil on the echelle grating" |
| Collimator (alt, post-upgrade papers) | ALT: OAP re-collimates to a 120 mm beam toward the grating turret |  | M14, Sec. 1.1 | "Following the slit plane, an OAP mirror is used to re-collimate the light into a 120mm beam towards the grating turret" |
| Collimated beam width | 120 | mm | M98, Table 1, p. 567 (scan) | "Collimated beam width 120 mm 120 mm" (transcribed from the scan) |
| Collimator on- or off-axis | OFF-AXIS (slit wheel and echelle sit side by side; the beam goes out 1.2 m and returns almost the same distance) |  | M98, p. 570 (scan); Fig. 1 p. 568; Sec. 3.1 p. 567 | "which returns almost the same distance to meet the echelle grating located very ... the optical layout was kept as unfolded as possible, all reflecting and with no central obscurations" (transcribed from the scan) |
| Collimator off-axis tilt | INFERRED: not published; about 3-4 deg (half the outgoing-to-returning angle) | deg | Fig. 1 geometry |  |
| Collimator to echelle | 1200 | mm | M98, p. 570 (scan) | "travels 1.2 m to an off-axis paraboloid mirror (called the OAPC) which acts as the collimator producing a 120 mm beam which returns almost the same distance" (transcribed from the scan) |

### Echelle

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Echelle groove density (cryogenic) | 23.29 | lines/mm | U99, Sec. 2 | "a (cryogenic) groove density of T= 1/d = 23.29 lines/mm" |
| Echelle groove density (design table) | ALT: 23.2 | l/mm | M98, Table 1, p. 567 (scan) | "Groove density 23.2 l/mm 75 l/mm" (transcribed from the scan) |
| Echelle groove density (Keck data description) | ALT: 23.2 | l/mm | KOA, Table 2 | "Groove Density 23.2 l/mm 75 l/mm" |
| Echelle groove density (design text) | ALT: 23 | lines/mm | M98, Sec. 1, p. 566 (scan) | "choosing an echelle grating with 23 lines/mm" (transcribed from the scan) |
| Echelle blaze angle, tan(theta_B) | 63.5 deg, tan(theta_B) = 2 (R2) |  | U99, Sec. 2 | "With tanθ B = 2, where θ B = 63.5° is the blaze angle" |
| Echelle blaze (alt) | ALT: 63.5 deg |  | M98, Table 1, p. 567 (scan) | "Blaze angle 63.5" (transcribed from the scan) |
| Out-of-plane angle gamma (quasi-Littrow) | 5 | deg | U99, Sec. 2 | "single echelle grating in Quasi-Littrow (QLM) mode with the out-of-plane angle, γ = 5°" |
| Echelle gamma (alt) | ALT: 5.0 deg |  | KOA, Table 2 | "Blaze Angle/Gamma Angle 63.5 ° /5.0 °" |
| m lambda_B | 76.56 | um | U99, Sec. 2 | "mλ B = d (sinθ i + sinθ o )cosγ = 2dsinθ B cosγ = 76.56 microns" |
| Echelle size (groove length x dispersion length) | 142 x 320 mm, 50 mm thick |  | M98, Sec. 3.1, p. 571 (scan) | "The echelle grating is 142x320 mm (50 mm thick) and the cross-disperser grating is 216x200 mm (37.5 mm thick); the first dimension is the groove length" (transcribed from the scan) |
| Echelle ruled length used as gLen | INFERRED: 320 | mm | M98, p. 571 (scan) | "the first dimension is the groove length" (transcribed from the scan) |
| Beam footprint on the echelle | DERIVED: 120 / cos(63.5 deg) = 268 mm (< 320 mm: the beam does not overfill) | mm | arithmetic |  |
| Echelle vendor and substrate | Richardson Laboratory replica on aluminum blank, gold coated |  | M98, p. 571 (scan) | "Replica gratings were applied to each of the aluminum blanks and gold-coated by the Richardson Laboratory" (transcribed from the scan) |
| Echelle angle range used on sky | 62.0-64.0 deg (echelle) and 34.0-38.0 deg (cross-disperser) in the resolution test |  | L20, Sec. 2.9.2 | "The exposures span a range of 62.0°–64.0° in echelle angle and 34.0°–38.0° in cross-disperser angle" |
| In-plane offset of the echelle (theta) | NOT FOUND | | | |

### Cross-disperser

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| XD groove density (cryogenic) | 75.75 | lines/mm | U99, Sec. 2 | "NIRSPEC's cross-disperser grating (or CDG) has a groove density of 75.75 lines/mm (at the cryogenic operating temperature)" |
| XD groove density and blaze (design table) | ALT: 75 l/mm, blaze 10 deg |  | M98, Table 1, p. 567 (scan; the 'Low Resolution Mode' column, the same grating) | "Groove density 23.2 l/mm 75 l/mm Blaze angle 63.5 10" (transcribed from the scan) |
| XD geometry | difference of 50 deg between input and output beams; theta_i ~ 35, theta_o ~ -15, theta_B ~ 10 deg; zero out-of-plane angle |  | U99, Sec. 2 | "zero out-of-plane angle. Since the geometry of the optical layout requires a difference of 50° between the input and output beams ... then we find that θ i ~ 35°, θ o ~ -15°, and θ B ~ 10°" |
| XD m_c lambda_cen | 4.155 | um | U99, Sec. 2 | "m c λ cen = 4.155 microns" |
| XD orders used | m_c = 1-4 with the order-sorting filters |  | U99, Sec. 2 | "The CDG is used in low order (m c = 1 - 4) in conjunction with order-sorting filters" |
| XD order separation | 14.25 lambda_B^2 m_c pixels (27 um pixels): about 62 pixels = 11.8 arcsec at 1.045 um in 4th order |  | U99, Sec. 2 | "Order separation in pixels is 14.25λ B 2 m c which gives about 62 pixels at 1.045 µm in 4 th order, or about 11.8"" |
| XD size | 216 x 200 mm, 37.5 mm thick (groove length first) |  | M98, p. 571 (scan) | "the cross-disperser grating is 216x200 mm (37.5 mm thick)" (transcribed from the scan) |
| XD turret angle = angle of incidence | DERIVED: angles of the Keck table (34.1-36.7 deg for Y-K) reproduce m_c = 4, 3, 3, 2 and 1 (DERIVED, see below) |  | KD, spectral_dispersion.xlsx, column 'Xdisperser' |  |

### Camera

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Camera type | three-mirror anastigmat (two concave ellipsoids, one convex hyperboloid), all reflective, no corrector |  | M98, Sec. 3.1, p. 571 (scan) | "This complex unit consists of two concave ellipsoids and a convex hyperboloid to collect and focus the cross-dispersed spectrum" (transcribed from the scan) |
| Camera speed | special f/3 camera |  | U99, Sec. 2 | "collected by a special f/3 camera in the "back end"" |
| Camera: different focal lengths along the two directions | yes |  | U99, Sec. 4 | "The Three-Mirror Anastigmat (TMA) camera in the spectrograph has different focal lengths along the dispersion and spatial (slit height) directions." |
| Camera scale, echelle mode, 27 um pixels | 0.144 arcsec/pix along the dispersion; 0.193 arcsec/pix along the slit; reversed in low-res mode |  | U99, Sec. 4 | "this circumstance yields an image scale of 0.144"/pixel in the dispersion direction and 0.193"/pixel along the spatial direction on the infrared array. Note however, that in the Low-Res mode these scales are reversed." |
| Camera scale after the upgrade | 0.096 arcsec/pix (18 um pixels; the optics are unchanged) |  | M14, Sec. 2.1 | "the pixel scale will decrease to 0.096˝ per pixel because the OAPs and gratings will remain unchanged" |
| Camera focal length, dispersion direction (nominal) | DERIVED: 463.5 | mm | 1200 mm x 2.06 arcsec/mm / (0.144 / 0.027 arcsec/mm) |  |
| Camera focal length, dispersion direction (cross-check fit to Keck's dispersion table) | EFFECTIVE: 473.6 | mm | KD, 66 orders of the Y, J, H, K arc tables (median; scatter 11 mm; 2.0 percent above the sourced 464.24 mm) |  |
| Camera focal length, XD-plane direction (nominal) | DERIVED: 346 mm effective (0.193 arcsec/pix); 346 / 0.846 = 409 mm true after the XD anamorphism cos(35.1)/cos(14.9) = 0.846 (sourced EFL in x: 407.49 mm, 0.4 percent lower) | mm | 1200 x 2.06 / (0.193/0.027); 346 / 0.846 |  |
| TMA and fold mirrors | none other than the three TMA mirrors; unfolded back end |  | M98, Sec. 3.1, p. 567 (scan) | "the optical layout was kept as unfolded as possible, all reflecting and with no central obscurations" (transcribed from the scan) |

### Detectors

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Detector, post-upgrade (Dec 2018 on) | Teledyne H2RG HgCdTe 2048 x 2048, 18 um pixels, 5 um cutoff |  | M18, Table 1, p. 3 | "H2RG 5-µm cutoff ... 2048x2048 18-µm pixels" |
| Detector (Keck page) | ALT: Teledyne H2RG 2048x2048, 18 micron pixels; sensitive 0.95-5.5 microns |  | KS, Detector Characteristics (updated Dec 2020) | "Teledyne H2RG 2048x2048, 18 micron pixels" |
| Detector, pre-upgrade (1999 to 2018) | Aladdin III InSb 1024 x 1024, 27 um pixels, 5 um cutoff |  | M18, Table 1, p. 3 | "Aladdin III 5-µm cutoff ... 1024x1024 27-µm pixels" |
| Detector, pre-upgrade (UCLA 1999) | ALT: Raytheon/SBRC 1024 x 1024 ALADDIN InSb, 27 um pixels |  | U99, Sec. 8 | "Raytheon/SBRC 1024 x 1024 (ALADDIN) array of indium antimonide (InSb) with 27 µm pixels" |
| Echelle orders over the whole range | m = 81 to 14 for 0.95-5.5 um |  | KS, Measured Spectral Dispersion | "In high resolution mode, NIRSPEC covers echelle orders that span m = 81 to 14 (0.95 - 5.5 microns)" |
| Order centers at the range ends | 0.957 um in order 80; 5.47 um in order 14 |  | U99, Sec. 2 | "a central wavelength of λ = 0.957 µm occurs in order m = 80, but near the detector cut-off wavelength, the central wavelength of λ = 5.47 µm occurs in order m = 14" |
| Gain and read noise (post-upgrade) | 3.01 e-/ADU; 11.56 e- (MCDS 16) |  | KS, Spectrograph (SPEC) | "Read Noise 11.56 e- (3.84 ADU, MCDS 16)" |
| Thermal light leak (back-end camera) | instrument background 0.70 e-/s, up to 1.7 e-/s at the worst place |  | KN, NIRSPEC Back in Service March 11, 2022 | "now measured at 1.7 e-/s in the regions with the highest thermal background" |

### Filters and coverage

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Filter NIRSPEC-1 (Y) | 0.947-1.121 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "NIRSPEC-1 (Y) 0.947-1.121" |
| Filter NIRSPEC-3 (J) | 1.143-1.375 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "NIRSPEC-3 (J) 1.143-1.375" |
| Filter NIRSPEC-5 (H) | 1.413-1.808 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "NIRSPEC-5 (H) 1.413-1.808" |
| Filter NIRSPEC-7 (K) | 1.839-2.630 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "NIRSPEC-7 (K) 1.839-2.630" |
| Filter Yband-new | 0.950-1.120 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "Yband-new 0.950-1.120" |
| Filter Jband-new | 1.140-1.350 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "Jband-new 1.140-1.350" |
| Filter Hband-new | 1.434-1.709 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "Hband-new 1.434-1.709" |
| Filter Kband-new | 1.907-2.554 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "Kband-new 1.907-2.554" |
| Filter L-Prime | 3.420-4.120 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "L-Prime 3.420-4.120" |
| Filter M-Prime | 4.570-4.810 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "M-Prime 4.570-4.810" |
| Filter KL | 2.134-4.228 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "KL 2.134-4.228" |
| Filter M-Wide | 4.420-5.530 | um | KF, SPEC Filter Wheel No. 1 / No. 2 list | "M-Wide 4.420-5.530" |
| Kband-new is the preferred K filter | since March 2022 |  | KN, Back in Service March 11, 2022 | "The new Kband filter (so called "Kband-new") is performing very well and is now the preferred filter to use for all Kband science" |
| New Y, J, H filters (Feb 2025) | Yband-new, Jband-new, Hband-new; no Thin blocker needed |  | KN, NIRSPEC Status (Updated March 2025) | "three new broadband filters were installed" |
| Orders and wavelengths of the Y setting | orders 68-80, 0.946-1.130 um |  | KC, Echelle arc lamp tools | "orders 68-80 of the Y-band (0.946-1.130um)" |
| J setting | orders 55-67, 1.128-1.40 um |  | KC, Echelle arc lamp tools | "orders 55-67 of the J-band (1.128-1.40um)" |
| H setting | orders 43-53, 1.427-1.793 um |  | KC, Echelle arc lamp tools | "orders 43-53 of the H-band (1.427-1.793um)" |
| K setting 1 | orders 33-41, 1.827-2.315 um |  | KC, Echelle arc lamp tools | "orders 33-41 of the K-band (1.827-2.315um)" |
| K setting 3 | orders 28-34, 2.202-2.727 um |  | KC, Echelle arc lamp tools | "orders 28-34 of the K-band (2.202-2.727um)" |
| L setting 1 | orders 22-29, 2.577-3.466 um |  | KC, Echelle arc lamp tools | "orders 22-29 of the L-band (2.577-3.466um)" |
| Filters sit near the pupil image | order-sorting filters in a wheel near the front-end pupil; the open position is a Lyot stop |  | KF, Other Notes | "The OPEN position in each wheel is Lyot stop" |

### Published performance

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Design R (echelle, 0.42 arcsec) | 23,640 (geometric design value) |  | KOA, Table 2 | "Resolving Power (0.42" slit) 23,640 2,264" |
| R, 0.43 arcsec echelle slit | 25,000 (12 km/s); R x theta = 10,800 |  | U99, Sec. 1 | "The resolving power (R=λ/Δλ) is 25,000 (12 km/s) for a slit width of θ=0.43" (3 pixels). Alternatively, the Rθ product is 10,800." |
| R, current Keck page | 25,000 for the 4.5-pixel slit (0.43 arcsec); 2000 for the 3-pixel low-res slit (0.38 arcsec) |  | KS, Basic NIRSPEC Specifications | "High resolution: R=25,000, 4.5-pixel slit (0.43") ... Low resolution: R=2000 (150 km/s), 3-pixel slit (0.38")" |
| Low-res R | 2,500 (2-pixel slit); design R = 2,264 at 0.42 arcsec |  | U99, Sec. 2 | "low-res") mode from the CDG alone with R = 2,500 (120 km/s) for a 2 pixel wide slit" |
| Low-res dispersion (27 um pixels) | about 2 A/pixel at 1 um, scaling with wavelength |  | U99, Sec. 2 | "The dispersion is approximately 2 A/pixel at 1 µm and scales with λ" |
| Echelle pixel scale along the slit | 0.193 arcsec/pix at 27 um; post-upgrade measured 0.13 +- 0.03 arcsec/pix |  | L20, Sec. 2.7 | "we measure a pixel scale of 0.13" |
| Low-res pixel scale along the slit (post-upgrade) | 0.098 +- 0.004 arcsec/pix, measured |  | L20, Sec. 2.7 | "leading to a pixel scale of 0.098" |
| Measured line width across the H2RG | 3.4 to 4.1 pixels FWHM (0.288 arcsec slit, N5, H band); sharpest at the center, worst in the corners |  | L20, Fig. 7 caption | "The resolution ranges from 3.4 to 4.1 pixels" |
| Throughput (Keck + sky + instrument), K band | 23.5 percent (NIRSPEC-7); Y 17.0, J 15.7, H 9.7 |  | L20, Table 1 | "NIRSPEC-7 (K) 1.09 ± 0.04 23.5" |
| Orders per detector | about 10 at 1 um but only about three at 4 um (1024 array, 27 um pixels) |  | U99, Sec. 4 | "About 10 orders are captured at 1 µm but only about three at 4 µm" |
| Settings needed for the whole range | 25 echelle, 7 low-res |  | KOA, Table 2 | "Number of settings required 25 7" |
| Status | in service since the Dec 2018 upgrade; annual warm-and-pump; slit wheel serviced Feb 2025 |  | KN, NIRSPEC Status (Updated March 2025) | "In October 2024, NIRSPEC's slit wheel began showing signs of slipping" |
| Upgrade | NIRSPEC was upgraded in late 2018 and is now back in service |  | KI, home page | "NIRSPEC was upgraded in late 2018 and is now back in service" |
| Optical design unchanged by the upgrade | the TMA prescription was set for the 27 um Aladdin; the 2048 H2RG is physically larger and may have reduced image quality |  | L20, Sec. 2.9 | "NIRSPEC was originally designed for a 1024×1024, 27-µm pixel Aladdin III, which set the optical prescription for the backend camera three-mirror anastigmat" |

### Layout

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Front-end K-mirrors and image rotator | two K-mirror-like folded assemblies with off-axis parabolas; the first collimates f/15 and rotates |  | M98, Sec. 3.1 Front End Optics, p. 569 (scan) | "the first-stage or Front End optics convert the f/15 focus to f/10" (transcribed from the scan) |
| Back-end light path (SPEC) | slit -> collimator (f/10 beam) -> echelle or flat -> cross-disperser -> TMA -> array |  | M18, Sec. 1, p. 2 | "Light going through the slit to the back-end is then re-collimated, and either reflected by a flat mirror or dispersed by the echelle grating, depending on the observing mode. The beam is then cross dispersed and imaged onto the detector plane by a three-mirror anastigmat (TMA)." |
| Echelle back-to-back with a flat mirror | turret swaps the echelle for the flat in low-res mode |  | M98, p. 570-571 (scan) | "Mounted back-to-back with the echelle grating is a flat mirror" (transcribed from the scan) |
| Grating turret | the echelle (or flat) sits in a turret; the XD grating on a second scan mechanism |  | M14, Sec. 1.1 | "the echelle grating is selected in the grating turret" |

### TMA camera (Robichaud et al. 1998)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| TMA EFL along y | 464.24 | mm | RB98, Sec. 2.0, p. 1069 (scan) | "In the stand-alone TMA, the EFL in y is 464.24" |
| TMA EFL along x | 407.49 | mm | RB98, Sec. 2.0, p. 1069 (scan) | "and in x is 407.49" |
| TMA average EFL | 435.87 | mm | RB98, Sec. 2.0, p. 1069 (scan) | "with an average EFL of 435.87 mm" |
| Dispersion axis of the camera | DERIVED: y (EFL 464.24 mm) |  | 0.144 arcsec/27 um pixel x 2.06 arcsec/mm gives 463.5 mm (0.16 percent below 464.24); the slit-direction scale 0.193 arcsec/27 um with the XD anamorphism gives 409 mm against 407.49 (0.4 percent); the 30.48 mm field is 3.76 deg in y and 4.29 deg in x (30.48/464.24, 30.48/407.49), matching the stated FOV of +2.0/-1.78 deg (in y, sum 3.78) and +-2.13 deg (in x, 4.26) |  |
| TMA effective collecting aperture | 131 | mm | RB98, Sec. 2.0, p. 1069 (scan) | "The effective TMA collecting aperture is a 131 mm (5.2") diameter circle" |
| TMA acceptance aperture | ALT: 132 mm, no vignetting | mm | RB98, Table 5-1, p. 1074 (scan) | "effective aperture of 132 mm" |
| Field of view presented to the TMA | +2.0/-1.78 deg in y and +-2.13 deg in x for a 30.48 mm square format |  | RB98, Sec. 2.0, p. 1069 (scan) | "degrees (in y) and +2.13 (in x) for a 30.48 mm square format focal plane" |
| Footprint of the two gratings on the TMA | elliptical, axes about 45 deg from x and y; 165.1 mm x 104.1 mm at 1142.3 nm |  | RB98, Sec. 2.0, p. 1069 (scan) | "The aperture created by the two dispersive gratings is elliptical in shape, with the major and minor axes approximately 45 degrees from the x and y axes ... the footprint is 165.1 mm x 104.1 mm" |
| Equivalent circular aperture of that footprint | DERIVED: sqrt(165.1 x 104.1) = 131.1 mm (the stated 131 mm) | mm | arithmetic |  |
| TMA focal ratios | DERIVED: f/3.54 along y (464.24/131), f/3.11 along x (407.49/131), f/3.33 on the average EFL |  | arithmetic |  |
| M1 primary | concave ellipsoid, base radius 678 mm, conic -0.6716, F1 372.942 mm, F2 3759.098 mm, parent diameter 684.28 mm |  | RB98, Table 2-1, p. 1070 (scan) | "Base Radius 678 mm ... -0.6716 (ellipsoid) ... 372.942 mm ... 3759.098 mm ... Parent Diameter 684.28 mm" |
| M2 secondary | convex hyperboloid, base radius 231.292 mm, conic -4.9453, F1 188.976 mm (real), F2 71.743 mm (virtual), parent diameter 175.00 mm |  | RB98, Table 2-1, p. 1070 (scan) | "Base Radius 231.292 ... -4.9453 (hyperboloid) ... 71.743 mm ... Parent Diameter 175.00 mm" |
| M3 tertiary | concave ellipsoid, base radius 330.302 mm, conic -0.0774, F1 258.411 mm, F2 457.606 mm, parent diameter 252.12 mm |  | RB98, Table 2-1, p. 1070 (scan) | "Base Radius 330.302 ... -0.0774 (ellipsoid) ... 258.411 ... 457.606 mm ... Parent Diameter 252.12 mm" |
| TMA design form | off-axis, unobscured, no vignetting; three reflective surfaces, no refractive element; silver coated, nickel-plated aluminum |  | RB98, Sec. 1, p. 1069 (scan) | "The off-axis TMA design form naturally provides an unobscured reimager with no vignetting" |
| As-built effective focal length | within 2.6-4.3 percent of the theoretical EFL (sign not stated) |  | RB98, Table 5-1, p. 1074 (scan) | "within 2.6% - 4.3%" |
| As-built image quality at 60 K | worst field point < 0.6 waves RMS; > 70 percent energy on the detector at the worst point, average > 85 percent |  | RB98, Sec. 5.3-6.0, pp. 1075-1076 (scan) | "The worst case field point in the TMA is < 0.6 waves RMS (as-built @ 60 Kelvin)" |
| Orders per array (design) | 5-6 orders cover 60-90 percent of J, H, K or L (concept statement; the 1024 array of 27 um) |  | RB98, Sec. 1.0, p. 1068 (scan) | "Typically 5-6 orders on the array cover 60 - 90% of the selected waveband" |
| Front end (as built by UCLA) | K-mirror: a conic surface and two flats, makes a pupil image used as the Lyot stop; then f/10 onto the slit; an off-axis parabola recollimates |  | RB98, Sec. 1.0, p. 1069 (scan) | "After the Lyot stop the beam is refocussed at ... An off axis parabola recollimates the" |

### Concept design (McLean et al. 1995; superseded)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Concept camera speed | f/2.2 (spectrometer with a 120 mm beam); TMA concept figure f/2.7 |  | M95, Sec. 1, p. 353 (scan); Fig. 2 caption, p. 355 | "Conceptual design of an f/2.7 three mirror anastigmat (TMA) camera for NIRSPEC." |
| Concept gratings | echelle 31.6 l/mm, blaze 63.5 deg; cross-disperser 75 l/mm, blaze 10 deg ('further optimization is likely and custom gratings will probably be manufactured') |  | M95, Sec. 4, p. 355 (scan) | "assumes an echelle grating with 31.6 l/mm and blaze 63.5 and a cross-disperser grating with 75 l/mm and blaze = 10" |
| Concept slit-plane scale | about 2 arcsec/mm at f/10 (one 0.2 arcsec pixel projects to 100 um) |  | M95, Sec. 4, p. 355 (scan) | "The image scale at the slit is approximately 2"/mm so that one pixel (0.2") projects to 100 um" |
| Concept beam and f/10 re-imaging | 120 mm beam; f/15 re-imaged to f/10; Lyot pupil 27 mm |  | M95, Sec. 4, p. 354 (scan) | "beam is collimated by an arrangement of three mirrors, two of which are flats, to produce a pupil image of diameter 27 mm" |
| Concept slits and orders | slit widths in discrete 0.2 arcsec steps up to about 1.0 arcsec; 20-30 arcsec long; 5-6 orders on the array covering 60-90 percent of a band |  | M95, Sec. 3-4, pp. 352, 355 (scan) | "with typically 5 to 6 orders on the array covering 60 - 90% of the selected waveband" |
| Concept camera requirement | f/# camera about 2.8 on 0.56 arcsec pixel needs ~20 percent faster to accept the beam spread |  | M95, Sec. 3.1, p. 352 (scan) | "the camera must be faster (about 20%) in practice to accept the beam-spread from the dispersing elements" |

### Dispersion arithmetic (DERIVED and EFFECTIVE)

* Slit-plane scale: 2.06 arcsec/mm (U99). Echelle-mode dispersion scale 0.144 arcsec per 27 um pixel = 5.333 arcsec/mm at the detector (U99). Magnification 2.06 / 5.333 = 0.3863; f_cam(dispersion) = 0.3863 x 1200 mm = **463.5 mm** (DERIVED); SOURCED: Robichaud et al. 1998, EFL in y = **464.24 mm** (0.16 percent apart), so y is the dispersion axis. Slit-direction: 0.193 arcsec per 27 um = 7.148 arcsec/mm; 2.06 / 7.148 = 0.2882; x 1200 = **345.9 mm** effective; the XD anamorphic factor cos(35.1 deg) / cos(14.9 deg) = 0.846 gives a true XD-plane focal length of **409 mm** (DERIVED); SOURCED EFL in x = **407.49 mm** (0.4 percent apart). Check of the effective slit-direction scale with the sourced value: 407.49 x 0.846 = 344.7 mm, 1200 x 2.06 x 0.027 / 344.7 = 0.1936 arcsec/27 um pixel (published 0.193). Robichaud et al. FOV check: 30.48 mm / 464.24 mm = 3.76 deg and 30.48 / 407.49 = 4.29 deg against the stated +2.0/-1.78 (sum 3.78) and +-2.13 (4.26) deg.
* Echelle: d = 1 / 23.29 mm = 42.936 um; m lambda_B = 2 d sin(63.5 deg) cos(5 deg) = 76.56 um (matches U99's 76.56 um: DERIVED check). Order 37 at the Keck K-setting-1 echelle angle 62.23 deg: lambda = 2 d sin(62.23) cos(5) / 37 = 2.0545 um against the table's order-37 chip center 2.0505 um (0.2 percent; the table's angle reproduces the center in all 66 orders to 0.2-0.3 percent, mean ratio 0.998).
* Camera cross-check fit (EFFECTIVE, not used in the preset): for each of the 66 orders of the Y, J, H and K rows of the Keck dispersion table, theta_c = asin(m lambda_c / (2 d cos gamma)) from the order's center wavelength, dlambda/dbeta = d cos(theta_c) cos(gamma) / m, and f_cam = (dlambda/dbeta) x 0.018 mm / (A per pixel). Median **473.6 mm**, mean 474.6, scatter 11 mm (438.6-518.3; the poorest fits are the few-line orders). By band: Y 472.9, J 472.6, H 473.7, K 472.5-476.6; no trend with wavelength or order. It is 2.0 percent above the sourced 464.24 mm; Robichaud et al. Table 5-1 reports the as-built EFL within 2.6-4.3 percent of the theoretical (sign not stated), so the fit may be the as-built EFL. The echelle's anamorphic factor (alpha not equal to beta in quasi-Littrow) would also scale it.
* Cross-disperser identity (DERIVED check of the table's XD angles as incidence angles): sin(i) + sin(i - 50 deg) = m_c G lambda with G = 75.75 /mm gives m_c = 3.97 (Y, i = 34.95), 2.99 (J, 34.08), 3.04 (H, 36.72), 2.02 (K setting 1, 35.08) and 1.04 (KL, 32.47) at the band's central wavelength, so the XD turret angle is the angle of incidence and the bands use m_c = 4, 3, 3, 2, 1. At m_c = 4: m_c lambda = 4.155 um gives lambda = 1.039 um (U99's number).
* XD order separation: sep (27 um pixels) = 14.25 lambda_B^2 m_c: at 2.05 um with m_c = 2: 119.7 px = 23.1 arcsec (x 0.193); at 1.045 um, m_c = 4: 62.2 px = 12.0 arcsec (U99 says 11.8). At 18 um pixels the pixel counts scale by 1.5: 179.6 and 93.3 px.
* Echelle footprint 120 mm / cos(63.5 deg) = 268.3 mm, less than the 320 mm length: no overfill; with the recommended 131.2 mm beam 293 mm, also inside.

### Keck measured dispersion, K band rows (spectral_dispersion.xlsx; slit 0.144 arcsec, arc frames 1.5 s x 20, IRAF identify/dispcor, Legendre fits)

| setting | echelle angle | XD angle | order | A/pix | lambda at pixel 1 (A) | lambda at pixel 2048 (A) | RMS (A) |
|---|---|---|---|---|---|---|---|
| K-band1 | 62.23 | 35.08 | 41 | 0.1831 | 18330.0 | 18704.9 | 4.1939 |
| K-band1 | 62.23 | 35.08 | 40 | 0.1886 | 18786.0 | 19172.1 | 0.105 |
| K-band1 | 62.23 | 35.08 | 39 | 0.1999 | 19248.2 | 19657.4 | n/a |
| K-band1 | 62.23 | 35.08 | 38 | 0.1972 | 19766.4 | 20170.1 | 9.69E- |
| K-band1 | 62.23 | 35.08 | 37 | 0.2003 | 20300.4 | 20710.4 | 0.1913 |
| K-band1 | 62.23 | 35.08 | 36 | 0.2096 | 20856.7 | 21285.7 | 8.0019 |
| K-band1 | 62.23 | 35.08 | 35 | 0.2159 | 21449.3 | 21891.3 | 3.6799 |
| K-band1 | 62.23 | 35.08 | 34 | 0.2207 | 22077.1 | 22528.9 | 3.8339 |
| K-band1 | 62.23 | 35.08 | 33 | 0.2083 | 22779.5 | 23205.9 | 3.1489 |
| K-band2 | 63.92 | 35.19 | 41 | 0.1710 | 18616.7 | 18966.8 | 9.9360 |
| K-band2 | 63.92 | 35.19 | 39 | 0.1795 | 19562.6 | 19930.1 | 5.0299 |
| K-band2 | 63.92 | 35.19 | 38 | 0.1748 | 20088.9 | 20446.7 | 0.1852 |
| K-band2 | 63.92 | 35.19 | 37 | 0.1912 | 20613.2 | 21004.6 | 6.8949 |
| K-band2 | 63.92 | 35.19 | 36 | 0.1978 | 21180.3 | 21585.2 | 5.5989 |
| K-band2 | 63.92 | 35.19 | 35 | 0.2034 | 21778.9 | 22195.4 | 0.2356 |
| K-band2 | 63.92 | 35.19 | 34 | 0.2075 | 22421.9 | 22846.5 | 3.286E |
| K-band2 | 63.92 | 35.19 | 33 | 0.2140 | 23099.0 | 23537.0 | 4.8980 |

All 66 Y, J, H, K rows (and L) are in `data/round9/nirspec_dispersion_table.tsv` (a tab-separated copy of the xlsx cells; row index, echelle angle, XD angle, filter, band, order, A/pix, lambda at pixel 1, at pixel 2048, RMS, fit order, number of arc lines).

## Layout (optical layout figure)

| item | reading |
|---|---|
| Source figures | McLean et al. 1998 Fig. 1 (journal p. 568; PDF p. 4 of keck_McLean_SPIE_1998_NIRSPEC-orig.pdf): the 'final optical layout', a 3D perspective view of the whole instrument with the labeled OAP1, Lyot stop and filter, OAP2, slit plane, flats, echelle, collimator (OAPC), cross-disperser, TMAP, TMAS, TMAT and array. Fig. 4 (p. 571) is the mechanical 3D schematic (optical plate 54 inches long). Martin et al. 2018 Fig. 2 (p. 2) is a top-down solid model of the interior with red arrows along the SPEC path (a raster image; no scale). |
| Back-end element order (SPEC path) | SOURCED (text and Fig. 1 labels): slit plane on the slit wheel (f/10 beam, slits tilted 12 deg) -> off-axis paraboloid collimator OAPC, 1.2 m from the slit, 120 mm beam -> echelle (or the back-to-back flat in low-res mode), 'very close to the slit wheel' and about 1.2 m from the collimator -> cross-disperser grating (on a turret scanned about the vertical axis) -> TMAP (concave ellipsoid, primary) -> TMAS (small convex hyperboloid, secondary) -> TMAT (concave ellipsoid, tertiary) -> array. No fold mirrors in the back end (McLean 1998 p. 567: 'as unfolded as possible'). |
| Which side each element sits (Fig. 1) | MEASURED/SCHEMATIC from the perspective view: the slit wheel and the echelle stand together at the left end of the bench; the OAPC sits at the far right end; the beam runs the length of the bench to the OAPC and returns to the echelle along almost the same path (the figure draws two bundles, one over the other). The dispersed beam then runs back toward the right to the XD grating, which stands about two thirds of the way down the bench in front of the collimator, and from there to the TMA, which is folded onto itself (TMAP in the middle of the bench, TMAS and TMAT toward the top of the view, array at the upper right). |
| Collimator to echelle | SOURCED: about 1200 mm ('travels 1.2 m ... returns almost the same distance'). layLen = 1200. |
| Echelle to XD, XD to TMAP | MEASURED, low accuracy (a perspective view with one scale, the 1.2 m collimator focal length): scale 1200 mm = 743 px (slit plane at x = 555, y = 1100 to the OAPC center at x = 1278, y = 1183 in the 1682 px wide display of the page image, 1.615 mm/px); echelle (x = 410, y = 1150) to the XD center (x = 1085, y = 1150) 675 px = about 1090 mm; XD to the TMAP center (x = 738, y = 1120) 348 px = about 560 mm. The foreshortening of the 3D view is not corrected; assign +-25 percent. camLen (XD to the first TMA mirror) = about 560 mm; the echelle-to-XD path has no field in the explorer's drawing parameters. |
| Collimator on- or off-axis (deploy gate) | OFF-AXIS, SOURCED: 'an off-axis paraboloid mirror (called the OAPC) which acts as the collimator ... which returns almost the same distance to meet the echelle grating located very close to the slit wheel' (McLean 1998 p. 570); 'the optical layout was kept as unfolded as possible, all reflecting and with no central obscurations' (p. 567); U99: 'collimated with an off-axis parabolic mirror'. The slit wheel and the echelle are side by side, not one inside the other's beam, so there is no central obscuration and colTilt must be set (not 0). The tilt value is not published: about 3.5 deg is INFERRED from needing the 120 mm outgoing and returning beams (1200 mm away) to clear each other at the slit and echelle (about 150 mm apart over 1200 mm = 7 deg between the beams, half = 3.5 deg). |
| TMA camera (Robichaud et al. 1998, Table 2-1 and Fig. 2-1) | SOURCED: after the XD grating the beam meets M1, a concave ellipsoid (base radius 678 mm, parent diameter 684.28 mm), then M2, a small convex hyperboloid (231.292 mm, parent 175.00 mm), then M3, a concave ellipsoid (330.302 mm, parent 252.12 mm), then the array; the three mirrors are off-axis segments (the aperture is laterally offset: McLean 1995 Sec. 4 'the entrance aperture can be laterally offset giving an unobscured design'), unobscured, no refractive element. The illuminated aperture is the elliptical footprint of the two gratings, 165.1 x 104.1 mm at 1142.3 nm, axes at about 45 deg to x and y, an equivalent circle of 131 mm; the field is +2.0/-1.78 deg in y and +-2.13 deg in x for a 30.48 mm square. The prescription gives no vertex spacings, tilts or decenters, so the TMA drawing (and camLen, MEASURED rough 560 mm from Fig. 1) is not improved. INFERRED: the parent diameters (684, 175, 252 mm) bound the offsets of the used 131 mm-class apertures from the parent vertices: M1 is a segment lying within a 684 mm parent, M2 within 175 mm. |
| In low-res mode | SOURCED: the turret exchanges the echelle for its back-to-back flat; the XD grating alone disperses (Martin 2014 Sec. 1.1: 'a flat mirror is selected in the turret, and the cross-disperser grating alone provides R~2,000'). The flat sits where the echelle stood, so the grating-mode preset has the XD grating at the end of a 1200 mm path with the same camera. |

Layout element tags: collimator type and focal length, distance collimator to echelle, XD and TMA element order and the absence of folds, the echelle-to-flat swap: SOURCED. Echelle-to-XD path, XD-to-TMAP path, the left/right positions: MEASURED (low accuracy) from Fig. 1. Collimator off-axis tilt: INFERRED. The XD angles (34-37 deg): SOURCED (Keck table).

## Recommended presets

**Preset name:** `Keck / NIRSPEC echelle K, 0.43″` (id `nirspec`), telescope group Keck II (tel "Keck 10 m", as DEIMOS, ESI and KCWI); one Preset line `NIRSPEC` (inst) with Settings below. Era: post-upgrade (H2RG, from Dec 2018), the instrument in service now.

**Settings (short names):**

| setting | mode | XD order m_c (xG) | lamC (A) | filt (A) | table orders | table echelle / XD angle (deg) |
|---|---|---|---|---|---|---|
| K, 0.43 | echelle | 2 (151.50) | 20505 | 19070-25540 | K setting 1: 33-41 (1.827-2.315 um) | 62.23 / 35.08 |
| Y, 0.43 | echelle | 4 (303.00) | 10320 | 9500-11200 | 68-80 (0.946-1.130 um) | 63.00 / 34.95 |
| J, 0.43 | echelle | 3 (227.25) | 12518 | 11400-13500 | 55-67 (1.128-1.40 um) | 63.00 / 34.08 |
| H, 0.43 | echelle | 3 (227.25) | 15912 | 14340-17090 | 43-53 (1.427-1.793 um) | 63.00 / 36.72 |
| low-res K | grating | 2 (G = 75.75, m = 2) | 22000 | 19070-25540 | one XD order at a time | - |
| K, old InSb | echelle | as K | 20505 | as K | 33-41 | detector 1024 x 1024, 27 um (pre-Dec 2018) |

Filter choices: K uses Kband-new (1.907-2.554 um, preferred since March 2022; NIRSPEC-7 1.839-2.630 um is the alternative); Y, J, H use the new filters of Feb 2025 (Yband-new 0.950-1.120, Jband-new 1.140-1.350, Hband-new 1.434-1.709 um; the older NIRSPEC-1, -3, -5 are 0.947-1.121, 1.143-1.375, 1.413-1.808 um). lamC is the center of the middle order of the Keck setting (K: order 37, (20300+20710)/2 = 20505 A).

**Echelle-mode state (K; the other bands change xG, lamC, filt; fcam is the SOURCED y-axis EFL of the TMA, 464.24 mm, Robichaud et al. 1998):**

```json
{
 "mode": "echelle",
 "D": 10.95,
 "F": "206265 / (2.06 * 10950) = 9.144",
 "W": "1200 / F = 131.2",
 "slitW": 0.432,
 "nObj": 1,
 "col": "mirror",
 "cam": "mirror (closest drawing; see Notes)",
 "colTilt": "about 3.5 (INFERRED)",
 "layLen": 1200,
 "camLen": "about 560 (MEASURED, rough)",
 "fcam": 464.24,
 "eG": 23.29,
 "eDelta": 63.5,
 "gamma": 5,
 "theta": 0,
 "xd": "grating",
 "xG": "151.5 (2 x 75.75)",
 "xPsi": 50,
 "Nx": 2048,
 "Ny": 2048,
 "pix": 18,
 "gLen": 320,
 "lamC": 20505,
 "filt": [
  19070,
  25540
 ]
}
```

**Low-res grating-mode state (fcam is the SOURCED x-axis EFL, 407.49 mm: the dispersion lies in the XD plane):**

```json
{
 "mode": "grating",
 "D": 10.95,
 "F": 9.144,
 "W": 131.2,
 "slitW": 0.38,
 "nObj": 1,
 "col": "mirror",
 "cam": "mirror (closest drawing)",
 "colTilt": "about 3.5 (INFERRED)",
 "layLen": 1200,
 "fcam": 407.49,
 "gType": "refl",
 "G": 75.75,
 "m": 2,
 "lamB1": "41550 (m_c lambda_cen = 4.155 um, SOURCED)",
 "lamC": 22000,
 "psi": 50,
 "Nx": 2048,
 "Ny": 2048,
 "pix": 18,
 "filt": [
  19070,
  25540
 ],
 "gLen": 200
}
```

Slit width: 0.432 arcsec (the nominal 4.5-pixel, R = 25,000 slit); pass the other slits (0.144, 0.288, 0.576, 0.720) as the slit control. D and F: the recommended entry keeps the published plate scale at the slit (2.06 arcsec/mm; F = 9.144 on D = 10.95 m, W = 131.2 mm; see Conflicts for the alternative F = 10, W = 120 mm, which changes the slit's angular scale by 9 percent).

### Published performance (validation targets proposed)

| what | q | value | tol or info | source |
|---|---|---|---|---|
| R = 25,000 at 0.43 arcsec (design/commissioning, slit-limited) | Rs | 25000 | info | UCLA summary 1999 Sec. 1; model gives 21,900 for 0.432 arcsec |
| R x theta = 9,890 geometric (design table R = 23,640 at 0.42 arcsec) | Rs | 22890 | 0.07 | Keck data description Table 2 (23,640 at 0.42 arcsec = R theta 9,929); DERIVED 4 x 1200 x 2.06 / 0.432 = 22,890 |
| dispersion per pixel in order 37 (K setting 1), measured | dlpixAt | 0.2003 | 0.06 | Keck spectral_dispersion.xlsx (K-band1 row, 0.2003 A/pix; K-band2 gives 0.1912 at 20809 A) |
| dispersion in order 48 (H), measured | dlpixAt | 0.15255 | 0.06 | Keck spectral_dispersion.xlsx (H-band row 48: 0.15255 A/pix) |
| dispersion in order 74 (Y), measured | dlpixAt | 0.0993 | 0.06 | Keck spectral_dispersion.xlsx (Y-band row 74: 0.09930 A/pix) |
| K setting 1 covers orders 33-41 | nOrders | 9 | 0.2 | Keck calibration page (Kband1 tools); the model's count depends on the filter and the chip |
| minimum order separation, 14.25 lambda^2 m_c = 120 px (27 um pixels; 180 px at 18 um) at 2.05 um | minSepPx | 180 | 0.15 | UCLA summary 1999 Sec. 2 (DERIVED at 2.05 um, m_c = 2) |
| 0.096 arcsec per pixel along the dispersion (post-upgrade) | specScale | 0.096 | info | Martin et al. 2014 Sec. 2.1 (the explorer's specScale is the slit width over its pixels; compare 0.432 arcsec = 4.5 px) |
| 0.129 arcsec per pixel along the slit (0.193 x 18/27; measured 0.13 +- 0.03) | pixScale | 0.1287 | info | UCLA 1999 Sec. 4; Lopez et al. 2020 Sec. 2.7. The model gives 0.106 (-18%): a single fcam cannot hold both TMA directions |
| measured line width 3.4-4.1 px at 0.288 arcsec in H: R = 25,400-30,700 (order 49) | RAt | 28000 | info | Lopez et al. 2020 Fig. 7 with the dispersion table (DERIVED lambda / (FWHM x dlpix) = 15590 / (3.4..4.1 x 0.1495)) |

### Model check

Model check (the explorer's physics.js design() run from a scratch script, never edited; F = 9.144, W = 131.2 mm, slit 0.432 arcsec, echelle 23.29 /mm, delta 63.5, gamma 5, theta 0, XD grating at psi = 50, **fcam = 464.24 mm (the sourced TMA EFL in y)**, 2048 x 2048 of 18 um, gLen 320):

| setting | XD order, xG | model XD incidence | table XD angle | model dlpix at lamC (A/px) | table dlpix | model orders on the chip | table orders |
|---|---|---|---|---|---|---|---|
| K (Kband-new filter) | 2, 151.5 | 34.87 | 35.08 | 0.2145 (order 37; +7%, the table's order 37 is an outlier) | 0.2003 (K1), 0.1912 (K2) | 34-40 | 33-41 |
| Y | 4, 303 | 34.93 | 34.95 | 0.1024 (order 74; +3.1%) | 0.0993 | 68-81 | 68-80 |
| J | 3, 227.25 | 34.03 | 34.08 | 0.1243 (order 61; +1.5%) | 0.1225 | 56-67 | 55-67 |
| H | 3, 227.25 | 36.51 | 36.72 | 0.1577 (order 48; +3.4%) | 0.1525 | 44-54 | 43-53 |

Over all 66 orders of the Keck dispersion table (Y, J, H, K), the model's dispersion with the sourced 464.24 mm exceeds the table's by a median 2.0 percent (Y 1.9, J 1.8, H 2.0, K 2.2; mean 2.2); 61 of 66 orders agree within 5 percent and 64 within 10 percent (DERIVED from the grating equation with 23.29 /mm and gamma 5 deg at each order's center wavelength, the same arithmetic the model uses). With the cross-check fcam of 473.6 mm the median miss is 0 by construction.

Rs (slit-limited R at 0.432 arcsec): K 21,900, Y 22,050, J 22,120, H 21,910 (design R theta 9,890 / 0.432 = 22,890: the model is 4.3-4.5 percent lower; the cos gamma and the slit-plane scale; the 25,000 of UCLA 1999 is 14 percent higher and not stated as measured). The model's slit-direction scale is 0.106 arcsec/px at 18 um against the published 0.129 (-18 percent), and its order spacing 200 px (K) and 96 px (Y) against the published 14.25 lambda^2 m_c x 1.5 = 180 and 93 px (+11 and +3 percent). Low-res (grating mode, G = 75.75, m = m_c, psi = 50, **fcam = 407.49 mm, the sourced EFL in x**): Y at 27 um pixels gives 2.11 A/px (published about 2), pixScale 0.109 arcsec/px at 18 um against 0.096 (+14 percent); Rs(0.38 arcsec) = 2,395 (Y) against R theta / theta = 2,500.

## NOT FOUND

* The TMA mirror positions, tilts and decenters inside the dewar (Robichaud et al. 1998 Table 2-1 gives base radii, conics, conjugate distances F1 and F2 and parent diameters only; no vertex spacings or off-axis offsets). NIRSPEC Optics Design Note 21.00 "Focal Length of TMA" (Figer, 1996) and the other design notes at https://irlab.astro.ucla.edu/instruments/nirspec/docs/Design/Optics/ (NODN2100, NODN0701, NODN1700, NODN0800) are dead links (HTTP 404) and the Internet Archive was offline; the TMA focal lengths are now SOURCED from Robichaud et al. (464.24 mm in y, 407.49 mm in x), so the notes are no longer needed for them. The earlier web-search hint of "about 420 mm, f/3.5" is explained but not confirmed: f/3.54 is 464.24 / 131 (DERIVED); 420 mm matches nothing (the average EFL is 435.87 mm).
* The echelle's in-plane offset (theta): published only as the out-of-plane angle gamma = 5 deg and the quasi-Littrow statement; the explorer's theta is entered as 0.
* The collimator's off-axis distance or tilt, and the distances echelle to XD and XD to the TMA (only the 1.2 m collimator path is stated; the other two are read from the 3D perspective of Fig. 1). Robichaud et al.'s Fig. 1-1 (the instrument concept) is a second, unscaled perspective sketch.
* A ruled-area statement for either grating (the sizes given are the replica gratings: 142 x 320 mm and 216 x 200 mm).
* A measured R from arc lines: McLean et al. 2000, Proc. SPIE 4008, 1048, "Performance and results with the NIRSPEC echelle spectrograph on the Keck II telescope" (2000SPIE.4008.1048M, SPIE paywall; NOT supplied). It is the likely source of a measured R at the commissioning slit; none of the 25,000 values here is stated as measured. The only measured line widths are Lopez et al. 2020 (3.4-4.1 px at 0.288 arcsec in H).
* The 2016 slit-viewing-camera paper (Martin et al. 2016, SPIE 9908, 99082R, 2016SPIE.9908E..2RM) is not needed for the spectrograph, and Keck's page gives the 2014 paper under its name.
* A published layout figure with a scale for the XD and the TMA (Fig. 1 of McLean et al. 1998 is a perspective view with only the 1.2 m collimator as a scale).
* Measured throughput of the echelle blaze or the grating efficiencies (only total system throughputs by filter, Lopez et al. 2020 Table 1; TMA transmission > 98 percent per element, Robichaud et al. Table 5-1).
* The dispersion table has no measurement for L-prime (3.42-4.12 um) or M; its L rows end at 3.38 um with the KL filter.

## Conflicts between sources

* Echelle groove density: 23 /mm (McLean 1998 Sec. 1), 23.2 /mm (Table 1 there and the Keck data description), 23.29 /mm (UCLA 1999, cryogenic); the 1995 CONCEPT had 31.6 /mm (McLean et al. 1995 Sec. 4: 'an echelle grating with 31.6 l/mm and blaze 63.5'), superseded. Use 23.29: it reproduces the Keck dispersion table; 23.2 would change the dispersion by 0.4 percent.
* Superseded 1995 concept values (McLean et al. 1995, SPIE 2475; not the as-built instrument): echelle 31.6 /mm; cross-disperser 75 /mm blaze 10 deg (the as-built is 75.75 /mm cryogenic, so this one survived); camera 'f/2.2' (Sec. 1) and a TMA concept 'f/2.7' (Fig. 2) against the as-built TMA (464.24 and 407.49 mm EFLs on a 131 mm aperture: f/3.5 and f/3.1); image scale at the slit 'approximately 2 arcsec/mm' (as built 2.06); slits in steps of 0.2 arcsec up to 1.0 arcsec, 20-30 arcsec long (as built 0.144-0.720 arcsec, 12 or 24 arcsec); 'f/15 Nasmyth' and 'f/10' re-imaging unchanged; 120 mm beam unchanged; Lyot pupil 27 mm (as built 26 mm); 5-6 orders per array covering 60-90 percent of a band (repeated in Robichaud et al. 1998 Sec. 1.0). McLean 1998 Sec. 1 records the changes: 'adopting an all-reflective design for the spectrograph, selecting a slightly slower camera section ... and choosing an echelle grating with 23 lines/mm'.
* Resolving power at the nominal slit: 23,640 at 0.42 arcsec (design Table 1 and Keck data description, R theta = 9,929), 25,000 at 0.43 arcsec (UCLA 1999, Keck specifications; R theta = 10,800), about 20,000 (Martin 2014 Sec. 1.1) and 'R ~ 25,000 (0.28 arcsec)' in Martin 2014 Table 1. The geometric R theta from the optics is 9,890 (DERIVED). None of the 25,000 values is stated as measured.
* Pixels per slit: the same 0.43 arcsec slit is 3 pixels (27 um, 1999) and 4.5 pixels (18 um, current Keck page, 0.096 arcsec/pix).
* Lopez et al. 2020 Sec. 2.7 text says 0.098 +- 0.004 arcsec/px was measured in low-res mode (binary along the slit) and 0.13 +- 0.03 in high-res mode; the Summary (Sec. 4) swaps the labels ('0.098 in high-resolution mode and 0.1309 in low-resolution mode'). The text agrees with the optics (along the slit: 0.144 x 18/27 = 0.096 in low-res, 0.193 x 18/27 = 0.129 in high-res); the summary is wrong.
* Camera focal length along the dispersion: 464.24 mm (Robichaud et al. 1998, SOURCED, stand-alone TMA design) against 463.5 mm (DERIVED from the 0.144 arcsec/pixel scale) and 473.6 mm (median fit to the Keck dispersion table; 2.0 percent above). Robichaud et al. Table 5-1 reports the as-built EFL within 2.6-4.3 percent of the theoretical (sign not stated), so the 2.0 percent is inside the as-built tolerance. Along the XD plane: 407.49 mm (SOURCED) against 409 mm (DERIVED). The UCLA 1999 'special f/3 camera' is the x direction (407.49 / 131 = f/3.11); the y direction is f/3.54.
* The '131 mm' TMA aperture (Robichaud et al. Sec. 2.0; 132 mm in Table 5-1) and the explorer's W = 131.2 mm: a coincidence. The 131 mm is the equivalent circle of the elliptical footprint of the two gratings on the TMA, sqrt(165.1 x 104.1) = 131.1 mm (DERIVED); a 120 mm collimated beam stretched by the cross-disperser's cos(15)/cos(35) = 1.18 in its plane gives 120 x 141.5 mm, equivalent diameter 130.3 mm (DERIVED), so the TMA aperture agrees with the published 120 mm beam and would be exceeded by a 131 mm beam (equivalent 143 mm). The explorer's 131.2 mm comes from the slit-plane scale (1200 mm / 9.144), not from the TMA, and is a modeling convenience (see next item).
* Slit-plane scale versus the explorer's Keck pupil: the published 2.06 arcsec/mm at f/10 means an effective 99.7 m telescope focal length, which on the explorer's D = 10.95 m is F = 9.14, and a 1200 mm collimator then gives a 131 mm beam, against the published 120 mm (the nominal 10 m pupil: 1.38 arcsec/mm at f/15 gives 149.5 m focal length, 149.5 / 10 = 14.95). F = 9.144 / W = 131.2 keeps the published plate scale, slit widths in arcsec and R; F = 10 / W = 120 matches the published beam but changes the slit scale by 9 percent (the slit would have to be entered 0.395 arcsec to keep R). The recommendation stays F = 9.144, W = 131.2: R, dispersion and slit scale are right; only the drawn beam is 9 percent wide, and the echelle footprint 293 mm is still inside the 320 mm ruled length.
* Keck's web page lists "Martin_SPIE_2016_NIRSPEC-upgrade.pdf" as the 2016 SPIE 9908 paper; the file is the 2014 SPIE 9147 paper.
* Keck's K filters: NIRSPEC-7 (1.839-2.630 um), K (1.996-2.382), K-prime and Kband-new (1.907-2.554 um); Kband-new is the preferred K filter since March 2022 (Keck news).

## Notes

* Which preset: ECHELLE K, post-upgrade, with Kband-new, 0.432 arcsec, is the recommended default. No usage statistic for the bands was found, so this is a judgment from sourced facts: Keck names Kband-new the preferred filter for all K-band science since 2022 (Keck news), K and L were the bands re-measured most recently (Dec 2020 dispersion table), and 0.432 arcsec is the nominal R = 25,000 slit. Settings: Y, J, H echelle (XD order m_c = 4, 3, 3) and the low-resolution grating mode in K. L and M would need the L-prime and M filters and an echelle angle not tabulated here (Keck's table ends at 3.38 um): leave them out or add them from the grating equation.
* Pre-upgrade era (1999 to Dec 2018, Aladdin III InSb 1024 x 1024 of 27 um): one extra Setting, 'K, old InSb', is cheap and honest (Nx = Ny = 1024, pix = 27; everything else identical, because 'the OAPs and gratings will remain unchanged', Martin et al. 2014), and about 20 years of archive papers used it, but it adds no optics: it shows the 0.144 arcsec/px sampling and roughly half the spectral range per order. Recommended as optional.
* XD order: the explorer's cross-disperser grating is first-order; NIRSPEC uses m_c = 1-4. Entering xG = m_c x 75.75 /mm at psi = 50 deg reproduces the true angles exactly (K: incidence 35 deg, exit -15 deg; the model's 34.87 against the table's 35.08). EFFECTIVE entry; the cross-dispersion per order is right, the drawing's label would read 151.5 /mm.
* Camera: the three-mirror anastigmat is all reflective and off-axis, with the detector outside the beam and no corrector (Robichaud et al. 1998: concave ellipsoid primary, convex hyperboloid secondary, concave ellipsoid tertiary); the explorer's "mirror" camera drawing is a catadioptric (corrector, spherical mirror, dewar inside the beam), so neither drawing is correct: "mirror" is nearer in kind (reflective, no lenses) but draws an obscured on-axis focus. A new TMA drawing type would be needed for an accurate picture; the mirror prescription of Robichaud et al. (Table 2-1) lacks vertex spacings, so even a schematic TMA would need the Fig. 2-1 raytrace read by eye.
* fcam decision: the SOURCED y-axis EFL, 464.24 mm, is entered (the dispersion axis: 463.5 mm DERIVED from the published 0.144 arcsec/pixel, 0.16 percent apart). The explorer then gives a median 2.0 percent more dispersion than Keck's measured table (61 of 66 orders within 5 percent), inside the 2.6-4.3 percent as-built EFL tolerance reported by Robichaud et al. and inside the table's own 2.3 percent order-to-order scatter (11 mm of 473.6). The EFFECTIVE alternative, 473.6 mm, zeroes the median miss but is a fit to a table whose few-line orders scatter, and the explorer's rule is to prefer the sourced value; mention the 2 percent in the preset note.
* The explorer cannot represent a camera whose focal length differs between the two directions (464.24 mm in y, the dispersion; 407.49 mm in x, the XD plane; equivalent f/3.54 and f/3.11 on the 131 mm aperture). The echelle preset keeps the dispersion right and so gives an 18 percent too small scale along the slit (0.106 against 0.129 arcsec/px); the order spacing in pixels is within 3-11 percent. In the low-res grating mode the dispersion lies in the XD plane, where the sourced focal length is 407.49 mm (fcam 407.49 gives 2.11 A/px at 1 um for 27 um pixels; published about 2). The H2RG's 36.9 mm side exceeds the 30.48 mm square the TMA was designed for (a 1024 x 27 um array is 27.6 mm), so the corners are beyond the design field (DERIVED; Lopez et al. 2020 find 3.4-4.1 px line widths, the worst in the corners).
* The slit tilt of 12 deg (to reach the slit-viewing camera) and the quasi-Littrow tilt of the slit images on the detector are not modeled; the K-mirror image rotator and the fore optics are outside the dewar window and the explorer starts at the slit.
* Cryogenic 'Lyot stop' filter wheel: an open position is the Lyot stop (central obscuration matching the secondary); the AO stop and FEU stop positions are not modeled. NIRSPEC also runs behind the AO system on the left Nasmyth platform (not the f/15 right-Nasmyth feed entered here).
* Detector: H2RG 2048 x 2048 of 18 um, 5 um cutoff (the Keck page gives sensitivity to 5.5 um). The beam's useful field is smaller than the H2RG's physical size; Lopez et al. 2020 finds 3.4-4.1 px line widths with the sharpest region in the center.
* Order-sorting filters are in the front end, near the pupil image (K1 module), so the explorer's filt band applies to the whole echelle format as in the Hamilton preset.
* Current availability: in service as of March 2025 (Keck news); an elevated thermal background (0.7 e-/s, up to 1.7 e-/s) from a light leak in the back-end camera is present and removed in A-B pairs; the slit wheel failed in Oct 2024 and was serviced Feb 2025.
