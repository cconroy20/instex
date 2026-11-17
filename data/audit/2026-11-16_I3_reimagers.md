# Audit I3: reimaged imager presets (FORS2 SR/HR, IMACS f/2, LRIS red, MOSFIRE, Megacam Clay, FourStar, 4-Shooter, NIRI f/6, f/14, f/32, HAWK-I, NIRC2 narrow, medium, wide)

Auditor scope: the 15 entries generated from web/ipresets.js ids fors2sr, fors2hr, imacsf2, lrisr, mosfirei, megacamm, fourstar, fourshooter, niri6/niri14/niri32, hawki, nirc2n/nirc2m/nirc2w, against data/imaging/{reimagers,magellan,fourshooter,niri_hawki,constants}.md and the saved sources under rawdata/imaging/ and rawdata/presets/. No project file was edited.

Method. Text was extracted from the saved PDFs (pdftotext -layout/-raw) and HTML (tag-stripped) into the scratchpad; the three scans without a text layer that mattered (Gunn 1984 BAAS abstract, Porter 1984) were OCR'd with tesseract. The model was run with `node validate_img.js` (369 pass, 0 fail; every audited preset passes its scored checks) and with variants to size the effect of each proposed fix. The drawing code (web/imgapp.js, layoutGeom and drawLayout) was read for the reimager labels. No headless screenshot was taken; the drawing findings below are read directly from the code.

Severity scale: HIGH = a number on the page is wrong by more than 10% or contradicts the instrument's documentation in a way a builder would object to at first sight; MEDIUM = wrong or unsupported but smaller in effect, or a scored check of the wrong configuration; LOW = attribution, wording, a sub-percent value, or an omission.

---------------------------------------------------------------------------------------------------------------------

## 1. Findings that cut across presets

### 1.1 HIGH: the drawing puts the filter at the pupil for four instruments whose filters are elsewhere

web/imgapp.js line 509 labels the pupil of every reimaged preset "pupil and filter" (Ø W), and the caption (line 740) reads "the bundles cross at the pupil, where the filter sits". No preset can override this. Four of the audited instruments put their filters elsewhere, and two of their own notes say so, so the page contradicts itself:

- FourStar. P13 Sec. 7.1: "Note that the filters are located near the focal plane rather than near the pupil plane so that field-angle dependent wavelength shifts are negligible". FSMAN Sec. 1.1: "The filter wheels are just ahead of L7." The preset note says "the filters sit near the focal plane", while the drawing labels the 130 mm cold stop "pupil and filter".
- HAWK-I. HUM Sec. 2.1: "The two filter wheels are located directly in front of the detector mosaic. The size of the filter needed to cover the whole FoV is 105×105 mm." The preset note says "the filters sit just in front of the detectors"; the drawing says otherwise. The pupil is the cold stop on camera mirror M3 (C05 p. 7: "The window forms a pupil image at M3 which is the system cold stop.").
- IMACS f/2. D11 Sec. 3.4.3: "Just in front of the Mosaic CCD Cameras, the f/2 and f/4 cameras are each slotted to accept a Shutter and Filter Server." D11 Sec. 3.4.4 contrasts the pupil with "the converging beam location of the Filter Servers". Only narrow-band filters sit at the pupil.
- NIRI. H03 p. 1390: "NIRI has one filter wheel in front of the collimator, i.e., in the f/16 beam, and another filter wheel in the collimated beam." The broadband filters (FW1: J, H, K, Ks, K', L', M') are in the converging f/16 beam ahead of the collimator (GFS: "filter wheel #1. This filter wheel is for broadband non-tilted filters"). The preset's default band is Ks, an FW1 filter.

The instruments whose filters do sit at or near the pupil or in the collimated beam (FORS2 broadband, LRIS red, MOSFIRE, NIRC2, 4-Shooter) are drawn correctly.

Fix: add a per-preset filter position (state key such as `filterAt: "pupil" | "converging" | "focus"`) and a "cold stop" label for FourStar, HAWK-I, NIRI and MOSFIRE (MOSFIRE's Lyot stop is at the pupil, M10 Sec. 3.1: "A Lyot stop is located at the pupil."). Until then, the four notes should say plainly that the drawing's filter position is not the instrument's.

### 1.2 HIGH: the Keck collecting area (LRIS, MOSFIRE, NIRC2) is 24% larger than the app's own Keck value

web/imager.js computes the collecting area as π D² (1 − ε²) / 4. With D = 10.95 m (the corner-to-corner diameter of the hexagonal primary) and ε = 0.24, the Imager page shows 88.75 m² for the three Keck presets. The project's own Keck record and the Telescopes mode give much less:

- data/telescopes/keck.md line 7: "76 m^2 design area (75.76 m^2 geometric; ~71.5 m^2 clear at f/15 DERIVED)"; web/tpresets.js Keck entry `"area": {"value": 71.5, ...}`.
- KTG02 Sec. 3.1.1 (rawdata/presets/deimos/keck_telescope_guide_ktelinstupdate.pdf): "The telescope aperture area is equivalent to that with a circular aperture 9.96 m in diameter." (77.9 m², DERIVED, with the central hole counted as area per keck.md line 86.)

Effect: collecting area +24% vs 71.5 m² (+17% vs the 76 m² design area); étendue inflated by the same factor. For LRIS this compounds with 1.4: the page's étendue is 2.11 m² deg² against 0.93 m² deg² for 71.5 m² over the published 6′ × 7.8′ (DERIVED), a factor 2.3. The note for NIRC2 mentions the hexagonal pupil; the LRIS and MOSFIRE notes do not.

Fix options: (a) keep D = 10.95 m for the diffraction width and give the imager an area override (state key `area: 71.5`, as tpresets.js already has), or (b) take the Keck pupil from the Telescopes mode (tpupil.js already models the 36 hexagons). Either way, add one sentence to the LRIS and MOSFIRE notes.

### 1.3 MEDIUM: rectangular and square field stops are drawn as the full detector (FORS2 SR, LRIS)

The model has only a circular field stop, so the page's field, area and étendue for FORS2 SR and LRIS are those of the detector:

| preset | page field | page area | published field | published area (DERIVED) | overstatement |
|---|---|---|---|---|---|
| fors2sr | 8.55′ × 8.61′ | 73.0 arcmin² | 6.8′ × 6.8′ (FUM117 Table 2.2 note 1) | 46.2 arcmin² | 1.58× |
| lrisr | 9.26′ × 9.26′ | 85.7 arcmin² | 6′ × 7.8′ (KLH; O95 abstract) | 46.8 arcmin² | 1.83× |

Both notes say the stop is not modeled, and both field checks are marked info, so nothing is hidden; but the headline field and étendue on the page are wrong for the instrument as observers use the instrument. A rectangular stop (state key `stop: {w, h}` in arcmin, applied like the circle) would fix both and also MOSFIRE's CSU square baffle. LRIS's field is also centered 6–7′ off the telescope axis (O95 p. 377: "In the 6 arcmin direction (called x) the field is off axis from 4 to 10 arcmin"; KLCS slitmask X = 174–436 mm); the model centers the CCD on the axis (a silent assumption; no effect on the scale).

### 1.4 MEDIUM: the AO presets draw a perfect Airy pattern (Strehl 1)

NIRC2 (all three), NIRI f/14 and f/32 use `psf: "diff"`, which the page describes as "Diffraction-limited (in space, or with adaptive optics): the Airy pattern alone." Gemini's own Altair numbers show partial correction: GNCAP, "NIRI + ALTAIR (Natural Guide Star, Field Lens)" table, K′ Strehl ratios 0.533 (20%-ile seeing, R = 12 guide star, 5″ off) down to 0.035–0.12 for fainter or worse conditions; LGS K′ Strehl 0.081–0.294. A model that cannot draw a partially corrected PSF should say in the AO notes that the image shown is the diffraction limit, not the delivered image (the saved sources give no Keck AO Strehl; none is quoted here).

### 1.5 LOW: the "collimator" in the drawing and the readout table is an equivalent for three instruments that have no collimated beam

The readout row "Collimator, camera" says "Collimator f_col = F_tel W: it takes the telescope's beam and makes each star's light parallel, W wide." For FourStar (field-lens doublet L1/L2, 210 mm behind the focus, P13 Sec. 4), HAWK-I (powered entrance window, then mirrors; C05) and NIRI (ZnSe field lens 100 mm behind the focal plane plus a two-element collimator lens, H03 and GWCOL), the page shows a 1430 mm, 1500 mm and 616 mm collimator at that distance past the focus. The FourStar note describes the real doublet but does not say that the drawn collimator is an equivalent; the research record does (magellan.md: "f_col = 1430 mm and f_cam = 468 mm are DERIVED equivalents for the explorer's ideal model"). Add "the drawn collimator and camera are the ideal pair with the same pupil and magnification" to the FourStar and HAWK-I notes.

### 1.6 LOW: telescope inputs differ between the Imager and Spectrograph modes for the same focus

web/presets.js uses F = 13.28 for FORS2 (line 413 block) where the imager uses VLTSPE's 13.4106 (reimagers.md calls 13.28 the "round-5 DERIVED value before the VLTSPE audit"), and F = 13.7 for LRIS where the imager uses 13.66. The FORS2 difference is 1.0% in focal length. Outside this audit's presets, but the same telescope should carry one F.

---------------------------------------------------------------------------------------------------------------------

## 2. Per-preset audit

### 2.1 fors2sr and fors2hr (VLT UT1 Cassegrain, FORS2 imaging)

Verified against sources:
- D = 8.115 m, F = 13.4106: VLTSPE Table 2 (rawdata/presets/uves/VLT-SPE-ESO-10000-2723_is1_Requirements_for_VLT_UT_Instruments.pdf, p. 10): "Entrance pupil diameter 8115.0 mm / Focal ratio 13.4106 / Focal length 108827 mm".
- ε = 0.1375 (DERIVED): VLTSPE Sec. 3.2.4: "If the baffle is not used, the central obstruction is that produced by the secondary mirror alone (1116 mm diameter)." 1116/8115 = 0.1375.
- f_col 1233 / 616 mm, f_cam 280 mm: FUM117 Table 2.2 "collimator focal length 1233 mm 616 mm / camera focal length 280 mm 280 mm"; FINST "F/15 collimators of focal length f1233mm (COLL_SR) and f616 mm (COLL_HR) giving a 90 mm and a 44.5 mm diameter pupil".
- Two 4096 × 2048 chips stacked in y, gap 480 µm: FUM117 Table 2.9 "2×4096×2048"; Table 2.7 "MIT (red) 0.08 30.0 480.0"; header YGAP = 480.0.
- SR field limited by the MOS unit: FUM117 Sec. 2.3.1 "restricted by the MOS unit in the focal plane of the unit telescope to about 6.8×6.8 arcminutes for the SR collimator."
- Broadband filters in the parallel beam: FUM117 Sec. 2.1.
- SR scale 0.12591″/px: FUM117 Table 4.2 "FORS2/Antu SR ω Cen I 0.12591±0.00002" (measured, June 2004, the current telescope). Model 0.12519 (−0.57%, within the 1% tolerance).

Flags:
- MEDIUM (fors2hr, configuration of the scored check): the HR scale 0.06323 is "FORS2/Yepun HR Pal 3 I 0.06323±0.00003" (FUM117 Table 4.2), measured on UT4 before FORS2 moved to Antu in 2004. The same table gives the SR scale on Yepun as 0.12604–0.12607 vs 0.12591 on Antu (−0.1%), so the HR scale on Antu is likely ≈0.0632 (INFERRED). No Antu HR measurement is in the manual. The pub label should read "measured on UT4 (Yepun), before 2004". Effect ≤0.1%.
- LOW (fors2hr note "a 4.25′ field set by the CCDs"): FUM117 Sec. 2.3.4 "HR Collimator Field Stop": "For HR observations in imaging mode the MOS slit arms are also used to form a field stop mask to limit the field in the focal area of the instrument and thus to reduce stray light." The mask size is not given, and FUM117 Sec. 2.3.1 adds "In case of the HR collimator the corners of the field of view are vignetted by the camera lenses." The note should mention both the MOS-arm stop and the corner vignetting.
- LOW (silent assumption): the mosaic is centered on the optical axis with the axis in the 480 µm gap. FUM117 Sec. 2.3.1: "The two CCDs of each mosaic are mounted slightly offset from the optical axis by 33′′ for operational reasons. The center of the field of view will fall on y-pixel ∼238 of the upper 'chip1' CCD for unbinned SR mode." No effect on the scale; the drawing and the field circle are off by 33″.
- LOW (page shows W = 91.9 / 45.9 mm and final f/3.05 / f/6.10): ESO publishes a 90 / 44.5 mm pupil (FINST) and final f/3.13 / 6.25 (FUM117 Table 2.2). The model's W = f_col / F is a consistent ideal-optics value; the note could say that ESO's pupil and final f-ratio differ by 2%.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: ε (DERIVED, bare M2; the sky-baffle setting is NOT FOUND, 0.191 if deployed); W (DERIVED, f_col / F); gap in px (DERIVED); primary f/1.8 (drawing only). Pupil position relative to the three filter wheels: NOT FOUND.

Scored checks: SR pixel scale (measured, same telescope, unbinned): correct configuration. HR pixel scale: UT4 measurement (above). HR field 4.25′ (FOVW): the model's 4.27′ is 4096 px × scale; a fair check of f_cam/f_col but not of the field limit.

### 2.2 imacsf2 (Magellan Baade, IMACS f/2 imaging)

Verified:
- D 6.5, F 11 (71526.4 mm design, CS98N9), f_col 1648.46 mm (CS98N11), 150 mm beam, f_cam 355.6 mm (BD03 Table 1 "Focal length 641.8 mm 355.6 mm"), f/2.38 imaging (BD03). Model 0.2006″/px vs 0.200 (LCOUM), +0.3%.
- West Nasmyth platform: LCOUM: "The rotating tertiary mirror in the telescope directs the beam to IMACS on the west Nasmyth platform, or to Fourstar ... on the east Nasmyth platform".
- Mosaic3 on f/2 since December 2017; eight 2K × 4K × 15 µm; gaps 1.08 mm (short sides) and 1.37 mm (long sides): LCOUM, quoted in reimagers.md; layout rows [4, 4], Nx 2048 × Ny 4096, gapX 1.37, gapY 1.08 is consistent.
- 30′ circle: D11 Fig. 2 "The outer circle is the full but partially vignetted field of 30′ diameter."

Flags:
- MEDIUM (scored check not used where the source supports one): the info line compares the model to 670 arcmin² and says "the model excludes the gaps, about 4%". The same LCOUM sentence gives the pixels-only value: "The f/2 camera accesses the largest possible field, 670 sq arcmin, 656 of which are covered by CCD pixels, or 0.186 sq deg)." The model's quantity (pixels inside the circle, gaps excluded) is the 656 arcmin² quantity. Model 645.7 arcmin², −1.6% vs 656. The gap share by LCOUM's own numbers is (670 − 656)/670 = 2.1%, not "about 4%"; the remaining 1.5% is the model's. Fix: score `{ q: "area", value: 656/3600, tol: 0.02 }` with src "LCO IMACS pages: 656 sq arcmin on CCD pixels".
- LOW (omission): the note's telescope chain omits the ADC corrector. LCOUM 1.B: "It is fed by the telescope's 6.5m primary, f/11 Gregorian secondary, and flat tertiary mirrors, and a corrector." and "The wider field of IMACS requires a radially mounted, integral ADC (atmospheric dispersion compensating) corrector." The 71526.4 mm focal length is the 1998 design without the corrector (NOT FOUND as built).
- LOW ("ε is measured on the twin telescope (Clay)"): M18 Sec. 4.1 says "The central obscuration is 29% (defined by the secondary baffle)" in a paragraph on as-built mirror surface data; the 29% itself is not described as a measurement. Prefer "ε is the value for the twin telescope (Clay) at f/11, set by the secondary baffle". L26 Sec. 5 settles that 29% is a diameter ratio ("a central obscuration diameter ratio of 29%").
- Filter position: see 1.1.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: ε (Clay value; Baade value NOT FOUND); W (DERIVED 149.86 = f_col / F); which mosaic axis is long on the sky (INFERRED from LCOUM's f/4 note); camera baffle size (NOT FOUND, only the effect); as-built collimator and telescope focal lengths (NOT FOUND).

Scored check: pixel scale 0.200 "central" (LCOUM), f/2, Mosaic3: correct configuration.

### 2.3 lrisr (Keck I Cassegrain, LRIS red imaging)

Verified:
- f_col 2000, f_cam 305 (O95 p. 376: "The collimator focal length was then set at 2000 mm and the camera focal length at 305 mm."); filters in the collimated beam in front of the camera (O95 Sec. 4); imaging mirror on the turret (O95 Sec. 5).
- Mark IV 4k × 4k since 2021: KLN 2021-Aug-19 "A new monolithic 4k x 4k thick CCD has been installed to replace the old Mark 3 LRIS red side mosaic (late April 2021)."; KLDET "LBNL 4k x 4k CCD ... (Mark IV, installed in May 2021)", "Plate scale 0.135"/pix".
- Model 0.13563″/px (+0.47%).

Flags:
- HIGH: collecting area and étendue (1.2, 1.3).
- LOW (scored value's provenance): the only measurement of 0.135″/px in the saved sources is for the 2009 two-chip red mosaic (KLRU: "Based on these images, the plate scale of the new red mosaic is 0.135 arcsec/pix"); KLDET lists the same 0.135 for the Mark IV without saying it was remeasured. The pub src should say "Keck LRIS detector table (Mark IV); last measured 2009 (KLRU)".
- LOW (omission): LRIS has worked behind the Keck I Cassegrain ADC since 2007 (KLN: "ADC Cleaning (2024-Feb-20) ... started to clean the ADC prisms"). The prisms carry no power; Keck's ADC page, found in a web search, says the image-scale change is under 1″ across the field. Worth one clause in the note.
- LOW (F differs from the research's recommendation and the spectrograph preset): reimagers.md recommends F_tel = 13.7 (O95 "real focal ratio") with W = 146.0; the preset uses 13.66 (KTG02 149.6 m) with W = 146.41. Both are sourced; the spectrograph LRIS preset uses 13.7 (1.6).

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: W (DERIVED; O95 publishes a 141 mm pupil image, formed with the field lens); F (DERIVED 149.6/10.95); primary f/1.6 (DERIVED, drawing only); ε (Keck II value from H17); Mark IV footprint and vignetting (NOT FOUND); off-axis field (silent assumption, 1.3).

Scored check: 0.135″/px, unbinned, red side: correct configuration (provenance above).

### 2.4 mosfirei (Keck I Cassegrain, MOSFIRE imaging)

Verified: everything optical matches data/round4/mosfire.md and M12: f_col 1813.0, f_cam 250.0 (design), 2040 × 2040 active, 18 µm, 6.9′ (414″) circular baffle in front of the field lens (M12 Sec. 3), filters before the pupil wheel (MDDR Sec. 5.2.1.1). Model 0.18001″/px (+0.12%).

Flags:
- HIGH: collecting area and étendue (1.2).
- LOW: the model uses pix = 18 µm; M12 gives "17.984 μm pitch at 77 K", which gives 0.17985″/px. The preset could use 17.984.
- LOW (scored field not independent): 6.113′ is M12's own arithmetic "2040 pixels x 0.1798"/pixel=366.79"", so the field check repeats the pixel-scale check. Keep it, but mark it as arithmetic.
- LOW: the 0.1798 is not an on-sky measurement: M12 Sec. 3 "Assuming that the Keck plate scale is exactly correct the measured pixel size in imaging mode at the detector maps to 0.1798" on the sky." The pub entry does not call it measured, which is correct.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: W (DERIVED 132.7; the design stipulated 125.0 mm at f/14.50); as-built f_col, f_cam (NOT FOUND, design values; the 7.25× reduction is measured).

### 2.5 nirc2n, nirc2m, nirc2w (Keck II AO, NIRC2)

Verified: AO output f/15 with the telescope's pupil position (KTG02 Sec. 4.9: "The output of the AO system is identical to that of the telescope with the same f/# and with the pupil at the same distance in front of the focal plane."); left Nasmyth (KNOM 1.1); detector 1024², 27 µm (KNG); optical order (KNOM 1.2); scales and fields (KNG).

Flags:
- HIGH: collecting area (1.2); MEDIUM: AO PSF (1.4).
- LOW (nirc2n, configuration date): the preset's 0.009942″/px (KNG) predates the 2015-04-13 realignment. S16 (rawdata/imaging/nirc2/Service2016_PASP128_095004_NIRC2distortion.pdf) Sec. 5.3: "9.971 ± .004 ± .001 mas pixel−1 post-realignment and ... 9.952 ± .002 ± .001 mas pixel−1 pre-realignment." The current narrow scale is +0.29% above the preset's. Fix: f_cam ≈ 1286 mm (Fc = 51.04), pub value 0.009971 with src S16, or keep 0.009942 and label it the Keck page's pre-2015 value.
- INFERRED inputs, stated as such in the note: W = 25.2 mm, f_col = 344 mm and the absolute f_cam values come from a similarity fit of Tuthill's aperture-mask drawings (KNRM). A web search (NIRC2 pupil diameter, Lyot stop, collimator focal length) found only on-sky-equivalent Lyot-stop sizes (H17: "this diameter is equal to 8.7 m and corresponds to 80% of the entrance pupil diameter"), no millimeter values. The inference does not affect the scale or field; NOT FOUND remains the honest status.

Scored checks: none (all info; circular by construction). Correct.

### 2.6 megacamm (Magellan Clay f/5 Cassegrain, Megacam)

Verified:
- 0.169 mm/″ (M15 Table 1 "Plate scale 0:169 mm arcsec"; MCM), F = 5.36 DERIVED; 36 e2v CCD42-90, 2048 × 4608, 13.5 µm; 9 × 4 layout.
- Layout from the M15 Fig. 3 photograph (page 368, rendered and inspected here): four columns of nine chips, each chip with its long side horizontal, arrows "31″ gaps" between columns 1|2 and 3|4. The preset's rows of four with gapsX [5.24, 1.01, 5.24] mm match. MCM Sec. 2.2: "a 6 arcsec gap between them. There is a larger gap of 31 arcsec between rows one and two and between rows three and four."
- Corrector: M15 Sec. 3.1 "three lenses located just behind the primary mirror vertex, as well as a final lens ... This final 48-mm-thick element serves a dual role as a field-flattener and as the window to the cryostat."
- "No longer offered": LCOMI.

Flags:
- MEDIUM ("ε is set solely by the secondary" is not what the sources say): M15 Sec. 3.1 gives only the mirror ("a 1.8 m diameter hyperbolic secondary mirror"), Sec. 3.4 describes "a cylindrical M2" baffle of unpublished size and says "Mechanical constraints, however, at each of the telescopes prevented us from making nominal baffles", and Sec. 8.1 uses "a telescope area of 29 m2" for throughput, which implies ε = 0.355 (DERIVED, magellan.md). The note should read "ε is the secondary mirror's diameter (1.8 m); the M2 baffle (size not published) and spiders are not included; M15's 29 m² implies 0.355." Effect: area 30.6 m² vs 29.0 m² (5%).
- LOW: the 35′ corrected field is an MMT statement (M06) carried to Clay through M15's "identical refractive correctors"; the note could say so.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: F (DERIVED from the plate scale; circular for the pixel-scale line, which is info); gaps in mm (DERIVED from arcsec × 0.169); ε (DERIVED from the mirror; Clay f/5 obscuration NOT FOUND; Szentgyorgyi et al. 2012 not obtainable, abstract only); corrected field (MMT value).

Scored check: field 25′ × 25′ via fieldY (gap-inclusive envelope, M15 Sec. 2.1, M06): model 25.35′, consistent definition.

### 2.7 fourstar (Magellan Baade f/11 east Nasmyth, FourStar)

Verified: east Nasmyth (P13 Sec. 1; LCOUM); f/11 Gregorian (FSCDR); 130 mm pupil image 27 mm in front of L3, L1 210 mm behind the focus (P13 Sec. 4); f/3.6 (P13 Sec. 1); 4 HAWAII-2RG 2048², 18 µm, 2040 active (FSMAN Sec. 6.9); gaps "~2 mm or ~18 arcsec" (FSMAN Sec. 2.2) vs "150 pixels = 24"" (P13 Table 1) vs 19″ (FSQF, FSH, FSOBS); 0.159″/px. Model 0.15867 (−0.21%).

Flags:
- HIGH: drawing labels the 130 mm cold stop "pupil and filter" (1.1).
- LOW: the drawn 1430 mm collimator is an equivalent (1.5).
- LOW: the info line says P13's 10.8′ is "the pixels alone"; P13 does not say so (FSQF's "5.4'x5.4' per array" supports the reading). Mark the reading INFERRED.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: f_col 1430, f_cam 468 (DERIVED equivalents, no collimated space); ε (Clay f/11 value); cold-stop iris and central-disk sizes (NOT FOUND); gap (2.0 mm chosen among three published values; x and y not separated, NOT FOUND).

Scored check: 0.159″/px from the published f/3.6 and W: independent of the scale and passes.

### 2.8 fourshooter (Hale 200-inch Cassegrain, 4-Shooter)

Verified: D 5.08 m (B61), f/16 (P84, B61, PHT), ε 0.36 (72-in cage, B61), four TI 800 × 800, 15 µm (CPM86), f/1.8 (P84 p. 36), 0.335″/px (P84 Table I, re-OCR'd here: "Image Scale: 0.335 arcsec per pixel"), field "8'56" × 8'56"" (P84 Table I), pyramid incidence ≈5° (Z87 Sec. II: "A pyramid mirror splits the field into four CCD chips ... The angle of incidence at this mirror is about 5°").

Flags:
- MEDIUM (the field and pixel count include pyramid-shadowed pixels): S94 Sec. 2.1, p. 1246: "the field of view is 8.9' on a side (In practice, the field is a bit smaller, for the CCDs are positioned so that each sees the apex of the pyramid; this results in 20 pixels along two edges of each CCD that are not exposed to the sky." P96 Sec. 2.1: "The effective size of the field for this project is ∼2X780 pixels, or a width of 520"." The preset models 800 px of sky per chip with a 1″ gap, so the page shows 537″ (8.95′) and 79.8 arcmin² where the sky reaching the chips is ≈523″ and 75.9 arcmin² (DERIVED with Nx = Ny = 780). Fix: Nx = Ny = 780 (sky pixels) with the 0.045 mm crack, note "20 px along the two apex edges of each chip see the pyramid's shadow", and score the field against P96's 520″ (model 523.7″, +0.7%). Effect −2.6% in field, −5% in area.
- MEDIUM (the scored field check is circular): P84's 8′56″ is 1600 px × 0.335″ = 536.0″ exactly (DERIVED), and F_cam was derived from 0.335″/px, so the check `fieldX = 8.933′, tol 1%` tests only the 1″ gap. Mark it info, or replace with P96's 520″ as above.
- LOW (wrong attributions in pub src): pixel scale src "Gunn+84, Porter 1984": the Gunn et al. 1984 BAAS abstract (OCR'd here) gives no pixel scale, only "a 1600x1600 pixel contiguous field about 8.5 arc- minutes on a side". Use "Porter 1984 Table I; Schneider+94; Dressler & Gunn 92". Field src "Schneider+86": Schneider et al. 1986 (AJ 91, 991) does not give the field (searched its text layer); the 8′56″ is Porter 1984 Table I, and 8.9′ is Schneider et al. 1994.
- LOW ("(1984-1996)" in the note): no source gives a retirement date. P96 Sec. 1: "installed in 1983"; P84: first mounted spring 1984 (tests March 1984); the latest observations in the saved sources are 1985–1989 (N95 Sec. 2.1 "All data were obtained during observing runs in 1985-1989"; P96 "Imaging of the five fields began in 1986 October and required approximately three years to complete"). 1996 is the date of the last paper read. Write "(in use from 1983–84; described to 1996)" or drop the end date.
- LOW (note and caption wording): "a flat four-sided pyramid" and the caption's "in 3D the arms run along the field's diagonals". P84 says the pyramid "both flattens the field and reflects the different quadrants", which implies powered (not plane) facets; the diagonal routing is geometric inference (fourshooter.md: "This follows from geometry, not from a source"). Mark both as the drawing's assumptions.
- LOW (npix scored with tol 1e-9): 4 × 800 × 800 is the state itself; a tautology. Harmless.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: f_col 1000, W 62.5, f_cam 113.6 mm (placeholders, labeled as such in the note: good); facet tilt 5° and 10° beam deviation (DERIVED from Z87's incidence); ε (1961 cage; no 4-Shooter-era value, NOT FOUND); 1″ crack (C86) chosen over P96's "few arcseconds". The instrument paper (Gunn et al. 1987, Opt. Eng. 26, 779) remains NOT OBTAINED (SPIE refusal recorded in fourshooter.md; not retried).

### 2.9 niri6, niri14, niri32 (Gemini North Cassegrain, NIRI)

Verified: D 7.9 m entrance pupil (GZMX "ENPD 7900"; M2 is the stop); f_eff 128.12 m (GTEL) → F 16.22 (DERIVED); ε 0.164 (DERIVED from the 168 mm M2 hole, B01/G96; Zemax gives 0.152); 38 mm pupil at the cold Lyot stop (H03 p. 1390; GFS); Aladdin 1024², 27 µm; scales 0.1171 / 0.0499 / 0.0219 and fields 119.9 / 51.1 / 22.4″ (GNCAP); "Unavailable For Proposals at Gemini North" (GNI).

Flags:
- MEDIUM (niri14: "The f/14 and f/32 cameras are normally used behind the Altair adaptive optics"; name "(with Altair AO)"; psf "diff"): H03 Sec. 1 gives the design purposes: f/6 for "a moderate wide-field capability using tip-tilt compensations and low-order active optics corrections"; f/14 because "Unlike the f/6 camera, its f-ratio is sufficiently slow that the infrared background fluxes allow imaging in the L and M bands"; and only f/32 "will be used with the Gemini adaptive optics system 'Altair'". GNI says Altair "is available for use with NIRI f/32 for J-L' imaging and NIRI f/14 for imaging out to 2.5 microns", which is availability, not normal use. Fix: name the f/14 preset "NIRI f/14 camera", default psf "seeing" (the page then shows 16 px per 0.8″ FWHM in place of the undersampled 1.15 px Airy core), and say in the note that Altair is optional at f/14. "Normally used behind Altair" is supported for f/32 only.
- MEDIUM (niri32 "with Altair AO" vs its scale): the f/32 f_cam was set from 0.0219″/px, the scale without the Altair field lens. GNCAP lists "f/32 + Altair Field Lens 0.0214 21.9 x 21.9", and Gemini's NIRI + Altair sensitivity tables on the same page are headed "NIRI + ALTAIR (Natural Guide Star, Field Lens)" and "NIRI + ALTAIR (Laser Guide Star, Field Lens)". The Gemini Altair field-lens page refused automated access (HTTP 403), so when the lens is required is not settled here. Either label the preset "f/32, without the Altair field lens" or model the field lens: F = 16.60, W = 37.13 mm, Fc = 32.94 (DERIVED: f_eff 260,241 mm, niri_hawki.md) and pub 0.0214″/px, 21.9″. Effect 2.3% in scale.
- LOW: the note says Altair "keeps the f/16 beam and the pupil" (GALT: "it reproduces the telescope focal ratio (f/16), pupil size and pupil position"), true without the field lens only.
- Filter position: see 1.1 (broadband filters in the f/16 beam before the collimator).

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: F 16.22, ε 0.164, f_col 616.3, f_cam 228.8 / 536.8 / 1223.2 (all DERIVED; the camera focal lengths are circular for the scale lines, which are info); current ISS port (NOT FOUND); Lyot-stop shape and central obscuration (NOT FOUND).

Scored checks: none; all info lines are labeled circular. Correct.

### 2.10 hawki (VLT UT4 Nasmyth A, HAWK-I)

Verified: Nasmyth A of UT4 (HUM Sec. 2.2; HDR0 "TEL FOCU ID = 'NA'"); D 8.0 m, F 15.000, f 120,000 mm (VLTSPE Table 3: "Entrance pupil diameter 8000 mm / Focal ratio 15.000 / Focal length 120000 mm"); ε 1116/8000 (DERIVED); F/4.36 and 169.4 µm/″ (HUM); "a powered window and all-reflective design" (C05 p. 7); 4 HAWAII-2RG with 2040² light-sensitive (HUM Sec. 5.3: "4 reference columns/rows around each device"); gaps 2.90 / 2.70 mm DERIVED from the HUM Sec. 5.1 offset table; field 7.5′ × 7.5′ (HUM). Model 0.10644″/px, 7.524′.

Flags:
- HIGH: drawing labels the pupil "pupil and filter" while the filters are directly in front of the detectors (1.1).
- LOW: pub "(0.1064 measured)": EHO says "The pixel scale is0.1064 arcsec/pix with negligible distortions (< 0.3 %)" and the headers carry INS PIXSCALE = 0.106430; neither is described as a measurement in the saved sources. Drop "measured" or cite a measurement.
- LOW: published gap "~15″" (HUM Sec. 5, EHI, C05 "2.7 mm or 15 arcsec") vs the model's 17.1″ (x) and 16.0″ (y) between light-sensitive areas, DERIVED from HUM's offsets plus the 4 + 4 reference pixels. The DERIVED values are better supported; the note could quote both.
- W = 100 mm is labeled as the drawing's assumption: correct. The instrument paper (Kissler-Patig et al. 2008, A&A 491, 941) refused automated download again (aanda.org HTTP 403; typeset.io mirror HTTP 403), so the pupil size stays NOT FOUND.

EFFECTIVE / INFERRED / DERIVED / NOT FOUND: ε (DERIVED; the DSM since 2016 gives 0.140; sky-baffle use NOT FOUND); W, f_col, f_cam (NOT FOUND; ratio DERIVED 0.2907); gaps (DERIVED).

Scored checks: pixel scale (no-AO and GLAO headers agree, HDR0/HDR1) and field: correct configuration.

---------------------------------------------------------------------------------------------------------------------

## 3. Summary

### (a) Confirmed errors, by severity, with fix, source and effect

1. HIGH, all reimaged presets with filters away from the pupil (fourstar, hawki, imacsf2, niri6/14/32): the drawing and caption put the filter at the pupil (web/imgapp.js lines 509, 740). Sources: P13 Sec. 7.1 ("located near the focal plane rather than near the pupil plane"), HUM Sec. 2.1 ("directly in front of the detector mosaic"), D11 Sec. 3.4.3 (Filter Server "Just in front of the Mosaic CCD Cameras"), H03 p. 1390 (broadband "in the f/16 beam"). Fix: a per-preset filter position and a "cold stop" label. Effect: drawing and caption only; the FourStar and HAWK-I pages contradict their own notes.
2. HIGH, lrisr, mosfirei, nirc2n/m/w: collecting area 88.75 m² from a circular 10.95 m annulus vs 71.5 m² (the app's own Keck value, data/telescopes/keck.md, web/tpresets.js) or 77.9 m² (KTG02 Sec. 3.1.1, 9.96 m equivalent). Fix: an area override or the hexagonal pupil. Effect: area and étendue +24%.
3. MEDIUM, fors2sr and lrisr: field, area and étendue are those of the detector (73.0 and 85.7 arcmin²) where the instruments' stops give 46.2 and 46.8 arcmin² (FUM117 Table 2.2; KLH, O95). Fix: a rectangular stop. Effect: étendue 1.6× and 1.8× too large (2.3× for LRIS with item 2).
4. MEDIUM, fourshooter: 20 px along two edges of each chip see no sky (S94 p. 1246; P96 "∼2X780 pixels, or a width of 520""); the scored 8′56″ field check is circular (1600 × 0.335″). Fix: Nx = Ny = 780, score P96's 520″. Effect: field −2.6%, area −5%.
5. MEDIUM, niri14: "normally used behind the Altair adaptive optics", "(with Altair AO)" and psf "diff" are unsupported; H03 Sec. 1 designs f/14 for L and M imaging and only f/32 for Altair. Fix: rename, psf "seeing", Altair optional. Effect: the default image changes from an undersampled Airy core to the seeing disk.
6. MEDIUM, niri32: preset labeled "with Altair AO" but scaled without the Altair field lens; Gemini's NIRI + Altair tables are for the field-lens configuration (GNCAP, 0.0214″/px, 21.9″). Fix: model the field lens (F 16.60, W 37.13, Fc 32.94) or relabel. Effect 2.3%.
7. MEDIUM, imacsf2: info check uses 670 arcmin² (gaps included) when the same LCOUM sentence gives 656 arcmin² on pixels, the model's own quantity; "about 4%" gap share is 2.1% by LCOUM's numbers. Fix: score 656 at 2% (model −1.6%).
8. MEDIUM, megacamm: "ε is set solely by the secondary" is not what M15 says (unpublished M2 baffle; 29 m² throughput area implies ε = 0.355). Fix: reword. Effect up to 5% in area.
9. MEDIUM, all AO presets (nirc2n/m/w, niri14, niri32): perfect Airy pattern; Gemini's own Altair K′ Strehl ratios are 0.035–0.53 (GNCAP). Fix: one sentence in the notes.
10. MEDIUM, fors2hr: the scored HR scale is the UT4 (Yepun) pre-2004 measurement (FUM117 Table 4.2); the preset is UT1. Fix: relabel. Effect ≤0.1%.
11. LOW, nirc2n: 0.009942″/px predates the 2015 realignment; S16 measures 9.971 mas/px since then. Fix: f_cam ≈ 1286 mm or relabel. Effect +0.29%.
12. LOW, fourshooter: pub src misattributed (Gunn+84 gives no scale; Schneider+86 gives no field); "(1984-1996)" end date unsupported (latest documented use 1989).
13. LOW, fors2hr note: the HR field is also limited by a MOS-arm field-stop mask and camera-lens corner vignetting (FUM117 Secs. 2.3.1, 2.3.4), not by the CCDs alone.
14. LOW, mosfirei: pixel pitch 18 vs 17.984 µm at 77 K (M12); effect 0.09%.

### (b) Unsupported or misleading claims

- fourshooter note: "(1984-1996)"; "a flat four-sided pyramid" (P84: the pyramid "flattens the field", so the facets are probably powered); caption "the arms run along the field's diagonals" (geometric inference).
- imacsf2 note: "ε is measured on the twin telescope (Clay)" (M18 does not call the 29% a measurement).
- hawki pub: "(0.1064 measured)" (no saved source calls the value measured).
- fourstar info: P13's 10.8′ described as "the pixels alone" (an inference).
- lrisr pub: 0.135″/px credited to the current detector without a Mark IV measurement in the saved sources (last measured for the 2009 mosaic, KLRU).
- fourstar, hawki, niri readout: "Collimator ... makes each star's light parallel" for instruments with no collimated beam (FourStar, HAWK-I) or a field lens plus collimator (NIRI).
- imacsf2 note omits the ADC corrector that LCOUM puts in the IMACS feed; lrisr note omits the Cassegrain ADC.

### (c) Open questions only the builders could answer

- HAWK-I: the cold-stop (M3) diameter and the window-to-M3 distances (the instrument paper refused download).
- NIRC2: the pupil diameter, collimator and camera focal lengths (no publication found; the mask-drawing inference gives W ≈ 25.2 mm).
- 4-Shooter: collimator and camera focal lengths, pupil size, facet figure (Opt. Eng. 26, 779 not obtained), and the retirement date.
- FourStar: which gap is right (2 mm / 18″, 19″ or 150 px = 24″), separately in x and y; the cold-stop iris and central-disk sizes.
- Magellan: the Baade f/11 and Clay f/5 central obscurations, including the M2 baffles.
- NIRI f/32 + Altair: whether the Altair field lens is always in for NIRI imaging (Gemini's field-lens page refused access).
- FORS2: which M2 sky-baffle setting FORS2 uses (ε 0.1375 vs 0.191), and an HR scale measured on Antu.
- LRIS: whether the 0.135″/px was remeasured for the Mark IV CCD, and the Mark IV's illuminated footprint.

### (d) New sources saved

None. Attempts that failed: Kissler-Patig et al. 2008 (A&A 491, 941) from aanda.org and a typeset.io mirror (both HTTP 403; the empty attempt was deleted); Gemini's Altair field-lens page (HTTP 403). Web searches for the NIRC2 pupil size and the Magellan Clay f/5 obscuration found nothing citable beyond the saved sources. OCR text of the Gunn 1984 and Porter 1984 scans and the rendered M15 page 368 are in the scratchpad (audit/i3txt/), not in rawdata/.
