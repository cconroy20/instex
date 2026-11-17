# Audit S2: DESI (B, R, Z), Boombox (blue, red) and Via/Viaspec presets

Presets: desib, desir, desiz, boomboxb, boomboxr, via (web/presets.js lines 592–630). No project file was edited. Scripts and digitizations are in the scratchpad folder /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/s2/ (js/run.js, js/var.js, js/via.js, js/bb.js, py/bbang.py, img/, shots/).

## Sources

The research record cites D22, FDR and G23 for DESI and two Via documents (VT, VR) for Via. The record has no Boombox section at all, and no Boombox parameter carries a verbatim quote anywhere in data/. The decisive Via and Boombox sources below are project documents already on disk, and the research record cites none of these documents.

| key | document | location |
|---|---|---|
| D22 | DESI Collaboration 2022, AJ 164, 207 (instrument overview) | rawdata/presets/desi/DESI2022_InstrumentOverview_arXiv2205.10939.pdf |
| FDR | DESI Final Design Report, Part II (2016) | rawdata/presets/desi/DESI2016_FDR_PartII_Instrument_arXiv1611.00037.pdf |
| G23 | Guy et al. 2023, AJ 165, 144 (spectroscopic pipeline) | rawdata/presets/desi/Guy2023_DESI_SpectroPipeline_arXiv2209.14482.pdf |
| VT | Via technical document, technical.tex (2025-10-20) | ~/via/docs/technical/technical.tex |
| VSB | Via Science Book (PDF dated 2026-07-20, 101 pp.), the newest design document found | ~/Documents/__Work/Via/Via_Science_Book.pdf |
| TM-R | Viaspec tech memo "Calculating spectral resolution to first order", rev 3 (2024-03-21), by the Viaspec optical designer | ~/Documents/__Work/Via/Viaspec_TechMemo_SpectralResolution_rev3.pdf |
| TM-F | Viaspec tech memo "Characterizing field dependence of spectral resolution", rev 1 (2024-03-22) | ~/Documents/__Work/Via/Viaspec_TechMemo_FieldDependence_rev1.pdf |
| VVS | "Viaspec vital stats" table (undated; earlier design with a 260 mm beam and 192 µm fibers) | ~/Documents/__Work/Via/Viaspec_vital_stats.docx |
| VDS | Viaspec detector specification deck (2024-01-12) | ~/Documents/__Work/Via/CCDs/Viaspec_Detectors_Specification.pdf |
| BBL | Zemax layout of the Boombox optics (PowerPoint export, 2025-05-07), the figure printed as VT Fig. bb_optics and VSB Fig. 15 | ~/via/docs/technical/fig/Boombox_bench_layout.pdf |
| ETC | Via ETC notebooks and data: 07_fiber_masking.ipynb, txt/jack_mask_R.csv (the designer's R vs mask width), 12_dev_boombox.ipynb | ~/via/sandbox/etc/ |

## 1. DESI B, R and Z arms

### Values checked

| state / note item | preset | source | status |
|---|---|---|---|
| D | 3.797 m | D22 Sec. 4: "The unmasked aperture is 3797 mm" | correct |
| F, slitW | f/3.57, 0.866 × 107 µm/(3.57 × 3797 mm) = 1.410″ | D22 Sec. 7.1–7.2 (f/3.57, 107 µm) | correct arithmetic; virtual-core convention as documented in the header |
| "1.585″ on the sky at the field center" | | D22 Sec. 4.2 | correct |
| W | 126 mm (f_col 449.8 mm) | FDR Sec. 5.1.2: "The f/# is 3.57 and the pupil is 126 mm." | correct. D22's "incident beam diameters are approximately 140 mm" is the footprint at the gratings, not the per-fiber beam |
| fcam | 212.8 / 213.6 / 214.0 mm | FDR Table 5.5, "Camera Optical Budgeted Requirements" | design values, not as-built; the G23 chip ranges confirm G × f_cam to ≤0.8% (below) |
| G, tAlpha | 1103.5/11.48°, 1157.4/18.73°, 992.5/21.19° | D22 Sec. 7.2 ("fringe frequencies and average incidence angles") | correct |
| lamC | band middle: 4765, 6690, 8635 Å | none | wrong for the chip center (below) |
| Nx × Ny | 4096 × 4096, 15 µm | D22 Sec. 7.4, G23 Sec. 2.4 | B correct; R and NIR CCDs are 4114 × 4128, with rows along wavelength (G23: "the row index ... increases with increasing wavelength") |
| nObj | 500 | D22 Sec. 7.2 | correct |
| "f/1.7 camera" | page shows f/1.75 | FDR Table 5.5 f/1.70 on the 126 mm pupil | the page's f-ratio is on the diffracted beam (W cos β/cos α); cosmetic |

### Coverage and the scored band-edge lines

The scored lines "band from 3600 Å on the chip" and "band to 5930 Å on the chip" (and the R and Z equivalents) compare the model's chip edges with the FDR spectral bands. Those bands are the dichroic and camera-field design bands (FDR Sec. 5.1: "The bands chosen that meet the requirements are: 360–593 nm, 566–772 nm, and 747–980 nm"; Table 5.5 "Spectral field (nm)"), not the chip edges. The lines pass only because of the 3% tolerance.

G23 Fig. 14 shows the chip edges: its caption reads "The full wavelength range accessible for each camera is shown." I read the data extents from the vector paths of the figure against the tick labels (DERIVED, ±5 Å): B 3561–5996 Å, R 5631–7823 Å, NIR 7413–9907 Å. G23 Sec. 4.5.5 adds "the native CCD pixel scale (∼0.6 Å/row)".

| arm | model chip, preset | G23 Fig. 14 | lamC that matches the low edge / high edge | model chip at the mean lamC |
|---|---|---|---|---|
| B | 3511–5958 (span 2447) | 3561–5996 (2435) | 4813 / 4805 | 3557–6000 |
| R | 5554–7747 (2193) | 5631–7823 (2192) | 6763 / 6773 | 5637–7818 |
| Z | 7341–9828 (2487) | 7413–9907 (2494) | 8702 / 8722 | 7424–9898 |

One lamC per arm fits both edges to 8–20 Å, so the model's dispersion (as-built G and α with the FDR camera focal lengths) is right to ≤0.8%. Only lamC is off, by +44, +78 and +77 Å. With Nx = 4114 (R) and 4128 (Z) the two edge solutions agree to 1–9 Å (INFERRED; within the digitizing precision). The research record's DERIVED dispersions (0.58, 0.51, 0.58 Å/px, from the bands over FDR's 60.26 mm) are 2–5% off; the G23 ranges give 0.594, 0.535 and 0.609 Å/px (DERIVED, span/4096).

Effect of lamC = 4809 / 6768 / 8712 Å: coverage shifts redward by 42–83 Å; R at a given wavelength changes by <0.1%; Reff at the new λc is 2496 / 3824 / 4291; the camera-collimator angle (α + β) moves from 30.55/45.68/50.90° to 30.85/46.26/51.40°.

### Resolution

The info lines read D22's "approximately 2000 – 3000, 3500 – 4500, and 4000 – 5500" as values at the band edges, and the src text reports the model 7–9% short at the blue ends and 12% short at the red end of Z. D22 gives approximate ranges, not values at stated wavelengths, and does not say they are measured.

G23 Fig. 13 gives a measurement: the average PSF FWHM along the dispersion in CCD pixels, "not convolved with the pixel size". I digitized the solid curves from the vector figure. The model's slit term (npix, the √3/2 equal-line-width convention, including cos α/cos β) compares directly.

| arm, λ (Å) | measured PSF FWHM (px) | model slit FWHM (px) | model Reff | R from the measured PSF, pixel added in quadrature as the model does |
|---|---|---|---|---|
| B 3703 | 2.83 | 2.98 (+5.1%) | 1919 | 2006 |
| B 4761 | 2.91 | 3.03 (+4.1%) | 2471 | 2561 |
| B 5996 | 3.18 | 3.30 (+3.8%) | 3136 | 3244 |
| R 6054 | 2.92 | 3.03 (+3.7%) | 3410 | 3525 |
| R 7019 | 3.12 | 3.19 (+2.5%) | 3972 | 4064 |
| R 7823 | 3.30 | 3.50 (+5.9%) | 4460 | 4703 |
| Z 7706 | 2.91 | 3.03 (+4.4%) | 3780 | 3931 |
| Z 8806 | 3.14 | 3.19 (+1.6%) | 4340 | 4405 |
| Z 9723 | 3.29 | 3.49 (+6.0%) | 4826 | 5095 |

Against the measured PSF the model's R is 1.5–5.3% low, much closer than the 7–12% the src text reports. The model's geometric image is 2–6% wider than the measured PSF, which includes optical blur. Two readings exist and neither is settled: the collimator focal length could be closer to the slithead's curvature radius, 468 mm (FDR Sec. 5.1.1, "a curved edge of radius 468 mm"; a Schmidt focal surface has radius f; INFERRED), which raises R by 3.7%; or the fiber near field is not a uniform disk. D22's spatial magnification "0.48" points the other way (f_col ≈ 445 mm, DERIVED).

## 2. Boombox blue and red

### Document status of each value

| value | preset | document | status |
|---|---|---|---|
| D 6.5 m | 6.5 | VT Executive Summary | documented |
| fiber 200 µm, 1.2″, unmasked | yes | VT table; VT Sec. Data Simulator: "The Boombox fibers are unmasked." | documented |
| nObj | 36 | VT Sec. Boombox: "accepting 36 fibers" | documented |
| collimator: refractive triplet | col lens | VT: "collimated using a refractive triplet" | documented |
| fiber output f/5.3 | F 5.3 | none for Boombox | GUESSED in the note; BBL's fiber cone is f/5.23 (below), so the guess holds to ≈1% |
| beam | 35 mm | VSB Sec. 2.1: "Boombox, an R ≈ 1000 dual-channel spectrograph covering 360 < λ < 1010 nm with a 50-mm collimated beam" | WRONG: 50 mm; BBL measures 49.7 mm |
| camera f/1.5 | fcam = 1.5 × 35 = 52.5 mm | VT, VSB: "custom f/1.5 refractive cameras" | f-ratio documented; focal length not documented; 75 mm on the 50 mm beam (DERIVED); BBL ≈70–72 mm (INFERRED) |
| binary transmission gratings | gType trans | VT: "two etched binary transmission gratings manufactured by Plymouth Grating Laboratory" | documented |
| groove densities | 2101, 1157 /mm | none | no document; solved to fill the chip; BBL implies different values (below) |
| order | m = 1 | none | INFERRED |
| symmetric setting | tAlpha null | none | BBL supports near-symmetric use at mid-band (β − α ≤ 1°) |
| detector | 2048 × 256, 15 µm | VT, VSB (Teledyne LANSIS 261, e2v CCD261-04) | documented |
| blue band | 3600–5900 Å | VT, VSB | documented |
| red band | 5700–10000 Å | VT text (VT table: 360–960 nm) | VSB, newer: "a red channel (5700 to 10100 Å)", table 360–1010 nm |
| R ≈ 1000 (info) | | VT, VSB | a nominal figure; the Via ETC sets Boombox R = 1000.0 as an input (12_dev_boombox.ipynb, cell 16 output) and derives nothing from the optics |

### Measurements from the Zemax layout (BBL)

BBL embeds a 1810 × 1000 raster of the Zemax drawing with Zemax's own 200 mm scale bar (479 px, so 2.395 px/mm). On the Viaspec layout the same kind of bar returns the documented 254 mm beam as 253 mm. Ray angles come from line fits to each Zemax wavelength color (five colors; deviation increases monotonically from blue to magenta in both arms, so the colors run from short to long wavelength).

- Collimated beam: 49.7 mm in the horizontal, vertical and diagonal segments.
- Fiber cone: marginal-ray slopes ±0.0956 with the apex at the drawn slit, f/5.23; f_col = beam/(2 tan u) ≈ 260 mm.
- Blue arm: the dichroic face lies at 67.4°, so the beam reaches the grating at 135.0°; the grating face at 64.2° gives incidence α = 19.2°. The five wavelengths leave at deviations 27.1, 32.6, 38.0, 43.5 and 49.2° (±0.3°); the middle one has β = 18.8°. The camera-collimator angle at mid-band is ≈38°.
- Red arm: the fold mirror face at 44.9° sends the beam straight down; the grating face at 24.8° gives α = 24.8°. Deviations 37.7, 43.1, 48.5, 54.5 and 61.0°; the middle β = 23.7°. The camera-collimator angle at mid-band is ≈48.5°.
- The five image points span 28.5 mm (blue) and 29.2 mm (red) of the 30.72 mm chip. With angular spreads of 22.1° and 23.3°, f·tan θ gives f_cam ≈ 72 mm and ≈ 70 mm.
- The traced wavelengths span a ratio λ5/λ1 = 1.78 ± 0.02 in blue (band 5900/3600 = 1.64: the chip extends past the blue band) and 1.57 ± 0.02 in red (band 10000/5700 = 1.75; 10100/5700 = 1.77). The red ratio depends on the measured deviations and hardly on α, so the drawn red channel covers a narrower range than the documented red band.

The preset shows a camera-collimator angle of 61.2° (blue) and 55.2° (red) and a camera field of ±16.4°; BBL shows ≈38° and ≈48.5° and ±11–12°.

### Model variants

| variant | G (/mm) | α (°) | α+β (°) | Å/px at λc | chip (Å) | Reff at band start / middle / end |
|---|---|---|---|---|---|---|
| blue preset (W 35, fcam 52.5) | 2101 | 30.6 | 61.2 | 1.170 | 3600–5901 | 897 / 1186 / 1505 |
| blue, W 50, fcam 75, preset's fill-the-chip method | 1609 | 22.7 | 45.4 | 1.146 | 3600–5900 | 917 / 1212 / 1523 |
| blue, W 50, fcam 75, BBL α = 19.2° symmetric at 4750 Å | 1384 | 19.2 | 38.4 | 1.365 | 3333–6071 | 771 / 1018 / 1276 |
| same with f_col 260, fcam 72 (BBL) | 1384 | 19.2 | 38.4 | 1.422 | 3274–6121 | 768 / 1015 / 1272 |
| red preset | 1157 | 27.6 | 55.2 | 2.188 | 5699–10000 | 761 / 1048 / 1362 |
| red, W 50, fcam 75, fill-the-chip | 875 | 20.3 | 40.6 | 2.143 | 5700–10000 | 777 / 1071 / 1379 |
| red, W 50, fcam 75, BBL α = 24.8° symmetric at 7850 Å | 1070 | 24.8 | 49.7 | 1.697 | 6068–9472 | (5700 and 10000 off the chip) / 1354 / – |

The 50 mm beam by itself leaves R within 2% (the fiber image is 200 µm × f/1.5 ÷ f/5.3 for any beam) but changes G by −23% and −24% and the drawing's angles by 15–16°. The BBL blue geometry lowers R by 14–16% at fixed wavelength, to ≈1015–1020 at 4750 Å, and leaves 6% of the chip beyond each end of the band. The BBL red geometry cannot reach the documented red band with a 70–75 mm camera; the documents disagree among themselves here (Section c).

### Resolution convention

The Via team quotes R for an unmasked fiber with the full fiber diameter: 07_fiber_masking.ipynb computes R from the whole 1.183″ width (9110), and VSB Fig. 12 labels the unmasked Viaspec "R = 9000". The explorer's equal-line-width convention (0.866 × diameter) returns 10,480 for the same Viaspec optics (DERIVED with the TM-R values), 15% higher. If Boombox's "R ≈ 1000" uses the full-diameter convention (INFERRED), the explorer should show ≈1150 for the same optics. With the preset's geometry the full-diameter R is ≈1100 (blue center) and ≈970 (red center), DERIVED.

## 3. Via / Viaspec

### Values checked

| state / note item | preset | source | status |
|---|---|---|---|
| D, F | 6.5 m, f/5.3 | VT Sec. Focal Plane | correct; TM-R uses 169.1 µm/″ from the MegaCam model, f/5.37 on 6.5 m |
| slitW | 0.7″ | VT: "We therefore utilize a $0.7\arcsec$ slit mask" | correct for VT; VSB Sec. 2.3 (newer): "We therefore use a 120 µm slit mask", 0.718″ at f/5.3 or 0.710″ at 169.1 µm/″ |
| traceW | 0.866 × 1.2″ | VT fiber 200 µm, 1.2″ | consistent |
| nObj | 660 | VT table "Number of Fibers (incl. calibration) & 660" | VSB's table says 600, while VSB's own text lists 540 positioned + 60 fiducial/sky + "60 fibers" of lamp light = 660; the 400 µm fiber pitch (VSB) × 660 = 264 mm fits the ±5.7° field at f_col 1375 mm |
| "Th-Ar calibration" | note | VT: "delivers Th-Ar arc lamp lines to 60 fibers" | VSB (newer): "Argon lamp lines are relayed through 60 fibers" |
| collimator | mirror, f_col = 5.3 × 254 = 1346 mm | VT: "collimate the $\approx f/5.3$ output light from each fiber into a 254 mm diameter beam" | VT states the fiber output ratio, not the collimator's; VVS: "Collimator focal length 1375 mm"; TM-R: EFL 409.881 mm / system magnification 0.29808 = 1375.1 mm (DERIVED), i.e. f/5.41 on 254 mm |
| fcam | 1.62 × 254 = 411.5 mm | VT "f/1.62 camera" | TM-R: "The nominal effective focal length (EFL) of the camera is 409.881 mm at 5500 Å" (408.68 at 5050 Å, 410.910 at 5950 Å) |
| G, m | 2000 /mm, 1 | VT; TM-R "for the order m = 1" | correct |
| setting | symmetric at 5500 Å (α = 33.37°) | research: "±5.7 degrees" left "not resolved" | TM-R: "beams spanning ±5.7° about the y-axis. The tilt angle of the grating is 33.57° ... minimum incidence angle of 33.57°"; "The camera is tilted by 33.570° with respect to the grating." So ±5.7° is the field along the slit, and the camera axis sits at λ = 2 × 0.5 µm × sin 33.57° = 5530 Å (DERIVED) |
| detector | 9216 × 9216, 10 µm | VT, VR "9k × 9k" | VDS: CCD290-99 "Rows 9232, Columns 9216", 10 µm |

### Scored lines

- "R ≈ 15,000" (q R, tol 0.08). A design figure, not a measurement: TM-R's method is the paraxial mask image blurred by a Gaussian PSF with no pixelization; the designer's table (ETC txt/jack_mask_R.csv) gives 15,116 at 0.70″; VSB Fig. 12 labels "Viaspec, 120 µm mask (R = 15000)". The presets.js header reserves q R for measured λ/FWHM and sends geometric figures to Rs. The model's Rs is 15,166, 0.3% from the designer's table; Reff is 14,601. The line passes either way; its label should say design and its q should be Rs.
- "5.5 km/s per pixel". Correct: VT Sec. Wavelength Calibration; TM-R's 900 Å over 88.850 mm gives 0.1013 Å per 10 µm pixel, 5.52 km s⁻¹ at 5500 Å (DERIVED); model 0.1015 Å/px, 5.53 km s⁻¹.
- "coverage from 5050 Å / to 5950 Å" (tol 0.02). The design band. TM-R places 5050 Å at −45.649 mm and 5950 Å at +43.201 mm from the camera axis, so a chip centered on the axis spans 5047–5978 Å (model, design variant). The preset model gives 5018–5948 Å.

### Design-faithful variant

With F = 1375/254, fcam 409.881 mm, tAlpha 33.57°, lamC 5530 Å and the 120 µm mask: Rs 15,127 and Reff 14,560 at 5500 Å, 0.1016 Å/px (5.51 km s⁻¹), chip 5047–5978 Å, camera-collimator angle 67.1° (preset 66.7°). The R changes by <1% because the mask image on the detector is the same: 116.9 µm × 411.5/1346.2 = 35.73 µm (preset) vs 120 µm × 409.881/1375 = 35.77 µm (design). The along-slit scale moves from 0.196 to 0.198″/px.

## Page check

Headless screenshots (scratchpad shots/): boomboxb shows R = 1212 (4.00 Å, 247 km/s), 3600–5901 Å, 1.17 Å/px, beam 35.0 mm, collimator 186 mm, camera 52.5 mm, camera angle 61.2°, camera field ±16.4°. via shows R = 14,601, 5018–5948 Å, 0.101 Å/px, 0.196″/px, camera angle 66.7°. desib shows R = 2473, 3511–5958 Å, 0.604 Å/px, camera f/1.75. The Boombox drawing is the one that departs most visibly from the design: BBL's 50 mm beam, ≈38° camera angle in blue and ±11–12° camera field.

## Summary

### (a) Confirmed errors, by severity

1. Boombox beam (boomboxb, boomboxr). The preset guesses 35 mm; VSB Sec. 2.1 states "a 50-mm collimated beam" and BBL measures 49.7 mm. Fix: W = 50, fcam = 75 (f/1.5 on the beam); BBL suggests f_col ≈ 260 mm (f/5.23 fiber cone) and f_cam ≈ 70–72 mm. Effect with the preset's own fill-the-chip method: R +1% (blue 1212 → 1225, red 1071 → 1082 at λc), dispersion and coverage unchanged by construction, G 2101 → 1609 and 1157 → 875 /mm, camera angle 61.2° → 45.4° and 55.2° → 40.6°, camera field ±16.4° → ≈±11.7°.
2. Boombox grating geometry. The preset's G and angles have no document; the design drawing (BBL, printed in VT and VSB) shows incidence ≈19.2° (blue) and ≈24.8° (red), symmetric at mid-band, camera angles ≈38° and ≈48.5°. Figure-derived (±0.5°). Best-supported blue values: G ≈ 1370–1385 /mm if the camera axis sits at 4750 Å (INFERRED), giving 1.37–1.42 Å/px, chip ≈3300–6100 Å, and R lower by 14–16% (≈1015–1020 at 4750 Å vs 1186). For red, no G reconciles the drawing with the documented band (item c1). The note's "the band exactly fills the 2048 pixels" is contradicted by BBL in blue.
3. DESI central wavelengths and the scored band lines (desib, desir, desiz). lamC is the band middle; G23 Fig. 14 puts the chip edges at 3561–5996, 5631–7823 and 7413–9907 Å (DERIVED from the vector figure). Fix: lamC = 4809, 6768, 8712 Å; rescore "lo"/"hi" against the G23 ranges with ≈0.5% tolerance, and relabel the FDR band edges as the dichroic bands. Effect: coverage +42 to +83 Å; R at fixed λ unchanged; dispersion already right to ≤0.8%.
4. Via "R ≈ 15,000" scored as a measured effective R. A design value (TM-R method; designer's table 15,116 at 0.70″). Fix: label "(design)" and use q Rs (model 15,166, 0.3% off). No change to the model.
5. Via geometry and focal lengths. The design incidence is 33.57° (camera axis at 5530 Å), f_col 1375 mm, f_cam 409.881 mm (TM-R, VVS). Fix: tAlpha 33.57, lamC 5530, F = 5.413, fcam 409.88. Effect: R <1%; coverage 5018–5948 → 5047–5978 Å; the "±5.7°" in the research is the field along the slit.
6. Boombox red band end. The preset uses 10000 Å (VT); VSB, the newer document, gives 10100 Å (table 360–1010 nm). Effect if the band fills the chip: red dispersion +2.3%, R −2%.
7. DESI R and NIR detector rows. 4114 × 4128 (G23 Sec. 2.4), not 4096. Effect ≤0.8% in coverage width.

### (b) Unsupported or misleading claims

- Boombox note: "a 35 mm beam shared by both channels" (contradicted, item a1); the groove densities and λc (no document); "Coverage therefore matches by construction" (true of the model, not of the design drawing).
- Boombox "R ≈ 1000": a nominal number. The Via ETC uses R = 1000.0 as an input, and the Via team's convention for unmasked fibers is the full diameter, 15% below the explorer's convention.
- The research record has no Boombox section; data/refs_map.json cites "Via technical description, Boombox section (internal)". No Boombox value has a recorded quote.
- DESI pub lines "band from ... Å on the chip": the FDR values are band edges, not chip edges.
- DESI R info lines: D22's "approximately 2000 – 3000" ranges are read as band-edge values, and the src text reports 7–12% misses; against G23's measured PSF the model is 1.5–5.3% low.
- DESI fcam values are FDR budgeted requirements (design); the note does not say so, though the G23 ranges support the values to ≤0.8%.
- DESI research record: DERIVED dispersions 0.58/0.51/0.58 Å/px are 2–5% off (G23: 0.594/0.535/0.609, DERIVED).
- Via note: "254 mm beam (f/5.3 collimator)": VT gives f/5.3 for the fiber output; the design collimator is 1375 mm (f/5.41 on 254 mm). "Th-Ar calibration": VSB now says argon. "0.7″ slit mask": VSB now specifies 120 µm (0.71–0.72″).

### (c) Open questions for the instrument builders

1. Boombox gratings: groove densities and incidence angles, and which five wavelengths the Zemax layout traces. In red, BBL's traced range (λ5/λ1 ≈ 1.57), the f/1.5 camera on a 50 mm beam and the documented 5700–10000 (or 10100) Å band do not agree.
2. Boombox focal lengths: collimator (BBL ≈260 mm) and cameras (BBL ≈70–72 mm vs 75 mm from f/1.5 × 50 mm).
3. Boombox "R ≈ 1000": definition (full fiber diameter or FWHM), wavelength, and whether any optical calculation stands behind the number.
4. Fiber output f-ratio at the Boombox slit after FRD (BBL traces f/5.23).
5. Viaspec: fibers on the slit (660 vs VSB table's 600); detector placement relative to the camera axis; 0.7″ vs 120 µm mask as the adopted value.
6. DESI: as-built collimator focal length (449.8 mm from f/3.57 × 126 mm, 468 mm slit radius, or ≈445 mm from "0.48"), and as-built camera focal lengths.

### (d) New sources saved

None downloaded, and nothing written to rawdata/. The new evidence is in documents already on disk (paths in the Sources table): VSB, TM-R, TM-F, VVS, VDS, BBL and the ETC notebooks, plus digitizations of G23 Figs. 13 and 14 (from the PDF already in rawdata/presets/desi). The Via and Boombox documents are internal project files. rawdata/ is git-ignored, but data/presets_research.md is in the public repository, so quoting these documents there is Charlie's call.
