# Audit I2 (part): VST / OmegaCAM, LBT / LBC-Blue, LBT / LBC-Red

Scope: presets `omegacam`, `lbcb`, `lbcr` in web/ipresets.js (lines 200-225), against data/imaging/vst_lbc.md and the saved sources in rawdata/imaging/vst/ and rawdata/imaging/lbc/. No project file was edited. One new source was saved (listed at the end). `node validate_img.js` passes for all three presets (369 pass, 0 fail); variants below were run with `IM.design` on copies of the preset states.

Source keys follow vst_lbc.md: MAN (OmegaCAM User Manual, Issue 109.1, 2021), P88 (OmegaCAM User Manual, Issue 2.5, 2011-06-30, NEW), EPV / EPM / EVS / EOI / EMD (ESO web pages), A10 (Arcidiacono+2010), CS11, G08 (Giallongo+2008), BB10 (Bellini & Bedin 2010), R16 (Rothberg+2016), LQF / LOP / LFP (LBTO pages), THV / THL (THELI configuration files, third party).

## Ranked summary

| rank | preset | finding | fix | effect |
|---|---|---|---|---|
| 1 | lbcb, lbcr | F1 = 1.142 is ignored: with tel "prime" and no `corrector` key, imager.js sets f1 = F D. The page draws the primary as "Ø 8.40 m, f/1.45" with the focus 12.2 m above it and no corrector. The LBT primary is f/1.142 (f = 9.59 m). | Add the Telescopes mode's corrector, e.g. `corrector: { d: 0.93, label: "LBC-Blue corrector", sub: "five fused-silica lenses and the cryostat window, drawn as one lens" }` (BK7 for Red), as web/tpresets.js lines 436 and 441 already do. | Drawing only. Verified: pixel scale 0.22862″/px, field and étendue unchanged; the primary becomes f1 = 9.593 m and the focus moves to 9.84 m. |
| 2 | lbcb | The builders' measured center pixel scale is missing from the record and the preset. G08 Sec. 3 (PDF p. 6): "The pixel scale at the center is 0.2275′′± 0.0001 and the median value is 0.2254′′± 0.0001". The preset scores the model against BB10's 0.2297 as "(measured)". The two measured center values differ by 1.0%; the model (0.22862) sits −0.47% from BB10 and +0.49% from G08, so the 1% check passes either way and discriminates nothing. | Add G08 0.2275 as a pub entry (scored at 1% or info) beside BB10, state in `src` that the two measured center values disagree by 1%, and add the G08 quote to vst_lbc.md. | Scoring and provenance; no state change. |
| 3 | omegacam | The Cassegrain focus is drawn at the default 0.2 D (0.52 m) behind the primary. MAN Fig. 2 (PDF p. 12, "Scales are in mm") puts the focal plane 1.20 m behind the M1 vertex and M2 4.50 m in front of the focal plane. With the default the drawn secondary has R2 = 3.86 m against the published 4374 mm (EPM), −12%. | `back: 0.459` (1197 mm / 2610 mm, DERIVED from Fig. 2). | Drawing only. With 0.459 the model's M2 has R2 = 4.351 m (−0.5% from EPM) and M1-M2 = 3.29 m (Fig. 2: 3.30 m). |
| 4 | omegacam | F = 5.57 reproduces the current manual's rounded 0.213″/px. P88 (Issue 2.5, Sec. 2.1, PDF p. 9) gives "0.2134 for the two-lens corrector", and the THELI on-sky solution gives 0.21343 (record, DERIVED). | F = 5.555 (= 206264.8 × 0.015 / 0.2134 / 2610). | Pixel scale 0.21282 → 0.21340″/px (+0.27%); fieldX 60.60′ → 60.76′; étendue 4.373 → 4.396 m² deg². No check changes state. |
| 5 | lbcr | Gaps 0.945 mm (70 px) come from an R16/LBTO statement made for both cameras, whose own arcsec half ("18″") is 1.07 mm at 16.9″/mm; the Blue preset uses G08's 1.0 / 1.03 mm. The two presets draw different gaps although no source says the cameras differ (R16: "LBC Red is the same layout with a slight difference in the corrected field size"). | Use G08's 1.0 / 1.03 mm for both (the builders' values), or 70 px for both, and say no Red measurement exists. | fieldX +0.04′; nothing scored. |
| 6 | lbcb | Chip #4 is centered over the row (x = 0, per the LBTO/R16/BB10 text). Both on-sky solutions put it ~1.0 mm toward chip #3: BB10 Table 4 (chip [4] at x = 948.36 vs chip [2] at 1025.00, 76.6 px) and THL's .ahead (chip-4 center 17.5″ ≈ 77 px off the row center, DERIVED). | Optional: shift the extra chip 1.03 mm toward chip #3. | Drawing only. |
| 7 | lbcb, lbcr | The axis height on chip 2 is DERIVED indirectly (shiftY −8.539 / −8.297 mm). The direct sources give R16 rotator centers y = 2924 (Blue), 2913 (Red) and G08 FoV center y = 2919 (Blue): 8.36, 8.21 and 8.30 mm above the chip-2 center (DERIVED). | shiftY −8.36 (Blue) and −8.21 (Red), chip 4 moved with the row. | rMax changes by <1 mm; nothing scored. |
| 8 | omegacam | CCD 77 has been out of operation since P108 (EMD; MAN change record "108.1 12.02.2021 Sect 1.1 CCD 77 currently not working."). The model counts 32 working CCDs. | Optional clause in the note. | npix check is the nominal 268 Mpix, so unchanged. |

Unsupported or misleading text: the lbcb `pub` line "0.2255″/px (field average) ... the average includes the pincushion distortion" cites LBTO, whose sentence derives 0.2255 "thus" from 16.9″/mm (arithmetically 0.2282); the distortion reading is supported by G08's measured median, which should be the cited source. The lbcb "(measured)" label for 0.2297 omits the conflicting builders' value. Other note sentences are supported (details per preset).

Open questions for the builders: VST M2-baffle and chimney diameters; the as-built OmegaCAM gaps; the LBC body diameter at prime focus; which LBC-Blue center scale is right (0.2275 or 0.2297); the pixel frame of the LBC rotator centers; LBC-Red gaps and center scale.

## 1. VST / OmegaCAM (`omegacam`)

### 1.1 Values verified

| input | preset | source and location | quote |
|---|---|---|---|
| D | 2.61 m | CS11 p. 2; EPV fact table; A10 Sec. 1 | "a 2.61-metre aperture"; "Diameter. Primary M1: 2.61 m"; "The VST is a 2.61 m Alt-az f/5.5 modified Ritchey-Chretien telescope" |
| eps | 0.36 | EPV fact table; EPM table | "Diameter. Secondary M2: 0.938 m"; "diameter 2650 mm 938 mm hole 600 mm 130 mm". 0.938 / 2.61 = 0.359 (DERIVED). MAN Fig. 2 (PDF p. 12) draws M2 spanning ±445 mm with the ray bundle filling ±440 mm (figure reading), so 0.938 m is the right order for the M2 shadow. |
| tel, design | cass | EVS main text | "It features a f/5.5 modified Ritchey-Chretien optical layout, a two lens wide-field corrector, with the dewar window acting as a third lens" |
| F1 | 1.82 | EPM table | "radius of curvature 9509 mm (f/3.6) 4374 mm (f/4.7)"; 9509 / 2 / 2610 = 1.822 (DERIVED; ESO's "f/3.6" is R/D) |
| F | 5.57 | MAN Sec. 2.8, printed p. 22 | "With the ADC out – hence two-lens corrector in – it is 0.213′′ /pix." 206264.8 × 0.015 / 0.213 / 2610 = 5.565 (DERIVED). See error 4. |
| field | 88.2′ | A10 Sec. 1 | "with a corrected Cassegrain Field of View (FoV) diameter of 1.47degrees". The array diagonal is 1.435° (DERIVED), so all 32 chips lie inside (model: 32/32 whole). |
| Nx, Ny, pix | 2048 × 4100, 15 µm | MAN Table 1, printed p. 10 | "Active Pixel Area 2048 x 4102 pixels (2048x4100 used)"; "Pixel size 15 µm" |
| rows | [8, 8, 8, 8] | MAN Fig. 3 (PDF p. 13) and Table 2 | 4 rows of 8, N up; pointing center "X" in the central narrow gap |
| gapX | 1.5 mm | MAN Sec. 2.2.1, printed p. 8 | "between the long sides of the CCDs: 1.5mm (100 pix=21.5′′ )" |
| gapsY | 5.64, 0.82, 5.64 mm | MAN Sec. 2.2.1 | "central gap along the short sides: 0.82mm (55 pix=11.8′′ )"; "wide gap along short sides: 5.64mm (376 pix=80.5′′)" |

The gap values and their order are confirmed by a design drawing in the NEW source P88 (App. B, Fig. 25 "Technical drawing showing the pixel positions in the array", PDF p. 49), which shows one quadrant from the array center: chip centers at X = 16.11, 48.33, 80.55, 112.77 mm (pitch 32.22; gap 32.22 − 30.72 = 1.50 mm) and an array half-width of 128.13 mm; along the long axis the inner CCD's active area (61.53 mm = 4102 px) ends at 61.94 mm and the outer CCD's at 129.08 mm. DERIVED: central gap 2 × (61.94 − 61.53) = 0.82 mm; wide gap 129.08 − 61.53 − 61.94 = 5.61 mm between the 4102-px active areas, 5.64 mm between the 4100 used rows; array height 2 × 129.08 = 258.16 mm (model 258.10 mm). MAN Fig. 3 shows the wide gaps between rows 1-2 and 3-4, matching `gapsY`. The preset's mosaic (256.26 × 258.10 mm) is consistent.

Note sentences: "a modified Ritchey-Chrétien Cassegrain" (EVS); "behind a two-lens corrector" (EVS, MAN Sec. 2.1, the ESO name; the dewar window is a third lens); "32 CCDs in four rows of eight" (MAN); "the two wide gaps between rows hold the readout registers" (MAN Sec. 2.2.1: border "5mm on the side of the readout register"; "In the lower half of the CCD array, the readout register is at the ”bottom” (southern edge) of the CCDs, whereas in the upper (northern) half the CCDs are rotated through 180 degrees."; EOI: "two broader insensitive bands, each 5.7mm wide, which is where the CCD bond wires are"); "the narrow middle gap separates the two halves" (supported; the halves are the N and S halves, while the two FIERA readout halves are E and W); "ε is a lower bound (set solely by the secondary; the baffles are not published)" (MAN Sec. 2.9.1 names "M2, chimney and M1 plug" without dimensions); "F comes from the published 0.213″/px" (MAN Sec. 2.8). All supported.

### 1.2 Errors

**Back focal distance (drawing).** The preset sets no `back`, so imager.js uses 0.2 D (0.522 m). MAN Fig. 2 "OVERALL VIEW" (PDF p. 12; axes in mm, focal plane at 0) read from a 300-dpi render: M1 vertex at −1197 mm, M2 vertex at −4498 mm (reading uncertainty ±10 mm). DERIVED: the focus lies 1.20 m (0.459 D) behind the M1 vertex and the M1-M2 spacing is 3.30 m. Model runs:

| back | M1-M2 (m) | f2 (m) | R2 (m) | published R2 (EPM) |
|---|---|---|---|---|
| 0.2 (as is) | 3.452 | −1.929 | 3.857 | 4.374 |
| 0.459 | 3.286 | −2.176 | 4.351 | 4.374 |

Fix: `back: 0.459`. The match of R2 to 0.5% with the figure's back focus is an independent check (the corrector's small power is ignored). Effect: drawing only.

**Pixel scale and F (low).** P88 Sec. 2.1 (PDF p. 9): "16k x 16k detector mosaic (Fig. 4) at 0.21 arcsec per pixel (0.2134 for the two-lens corrector, 0.215 for the ADC configuration)". The current MAN rounds this to 0.213 (Sec. 2.1 and 2.8); EOI gives 0.214. The THELI on-sky solution (THV .ahead, mean |CD| over 32 chips) gives 0.21343 (record, DERIVED). Caveat: P88 Sec. 2.8 says "Add final measurements after commissioning.", so 0.2134 in P88 may be a design value; the on-sky THELI value agrees with 0.2134 to 0.01%. Best-supported value 0.2134″/px, F = 5.555. Effect: +0.27% on the pixel scale (0.21282 → 0.21340) and field (60.60′ → 60.76′, 61.03′ → 61.20′). MAN Sec. 2.8 states "The radial plate scale is constant over the field to better than 1 part in 1000", so the center and average values coincide and the comparison with the model's on-axis scale is valid. The manual's other implied scales ("1mm=14.3 arcsec" = 0.2145″/px; "100 pix=21.5′′" = 0.215″/px) are rounded or ADC values.

**CCD 77 (low).** EMD: "P108 phase 1. CCD 77 out of operation."; MAN change record: "108.1 12.02.2021 Sect 1.1 CCD 77 currently not working." The preset's 32 working CCDs describe the layout, not the current array. Optional note clause.

### 1.3 Unsupported or misleading note text

None found.

### 1.4 DERIVED / INFERRED / NOT FOUND and silent assumptions

- F = 5.57: DERIVED from 0.213; better 5.555 from 0.2134 (P88, THELI).
- F1 = 1.82: DERIVED from R1 = 9509 mm (EPM). Settled.
- eps = 0.36: lower bound. The M2 baffle and chimney are NOT FOUND in MAN (P109, P88), EPV, EPM, EVS, EOI, A98, A10, CS11, K02, K11, S24, I05, or a web search (no ETC or ESO page gives a VST collecting area). The 600 mm M1 hole lies inside the M2 shadow.
- back = 0.2 D: silent default; Fig. 2 gives 0.459 D (error above).
- Gaps: the manual's "average gap sizes" (design); the THELI on-sky solution gives 1.39 / 0.77 / 5.42 mm (record, DERIVED). With the THELI gaps fieldX is 60.41′ (−0.19′). Not an error; listed as an open question.
- The corrector, filter and window are treated as ideal (stated in the model).

### 1.5 Scored checks

| check | configuration | measurement? | model | verdict |
|---|---|---|---|---|
| pixScale 0.213 (info) | two-lens corrector | design/rounded (MAN) | 0.21282 (−0.08%) | circular, correctly marked info; 0.2134 better supported |
| fieldX 60′, tol 3% | science array, two-lens | nominal "1 degree x 1 degree" (MAN Fig. 3; EOI "covers 1x1 degree") | 60.60′ (+0.99%) | passes; a one-significant-figure number, so a weak test |
| npix 268,697,600, tol 1e-6 | 32 × 2048 × 4100 used | arithmetic; MAN heading "The 268-Million Pixel Science Array" | exact | fine |

### 1.6 Open questions (builders)

- Diameters of the M2 baffle and the M1 "chimney" baffle (the true obscuration).
- The M1-M2 spacing and back focal distance (to confirm the Fig. 2 reading).
- The current two-lens pixel scale: 0.2134 (P88, THELI) or 0.213 / 0.214 (MAN, EOI).
- As-built gaps: design 1.50 / 0.82 / 5.64 mm vs THELI on-sky 1.39 / 0.77 / 5.42 mm.

## 2. LBT / LBC-Blue (`lbcb`)

### 2.1 Values verified

| input | preset | source and location | quote |
|---|---|---|---|
| D | 8.4 m | R16 Sec. 1; LQF | "Each mirror is 8.4 meters in diameter"; "Primary Physical Diameter: 8.417 meter" |
| eps | 0.106 | LQF | "Central Hole Physical Diameter: 0.889 meter"; 0.889 / 8.4 = 0.1058 (DERIVED, lower bound) |
| F | 1.45 | G08 Sec. 2.1 | "The focal length of the opti- cal corrector is 12180mm and the final focal ratio is F/1.45." |
| F1 | 1.142 | LQF | "Primary Focal Ratio: F/1.142" (correct value, but not used by the model: error 1) |
| field | 40′ (choice) | R16 Sec. 3.1 | "The corrected fields have a diameter of 110 mm and 108.2 mm for LBC Blue and LBC Red"; 110 mm × 16.935″/mm = 31.0′ = 0.517° (DERIVED). The note says the circle is widened to take in the mosaic. |
| Nx, Ny, pix | 2048 × 4608, 13.5 µm | G08 Sec. 2.1; LFP | "an array of four E2V 42-90 (4608×2048 pixels) chips"; "13.5 microns x 13.5 microns per pixel" |
| rows, extra | [3] + one rotated chip above | LFP | "three of the chips are butted along their long edges, with the fourth chip rotated counterclockwise by 90 degrees and centered along the top of the other CCDs" |
| gapX, gapY | 1.0, 1.03 mm | G08 Sec. 2.1 | "The gaps between the vertical chips are 1mm, which corresponds to 74 pixels or equivalently 16.7 arcsec in the focal plane of LBC-Blue. The gap between the vertical chips and the horizontal chip is 1.03mm (76 pixels, 17.2 arcsec)." |
| axis on chip 2 | shiftY −8.539 mm | G08 Sec. 3 (PDF p. 6); R16 (PDF p. 5); LFP | "close to the geometrical FoV center (pixel x=1024 y=2919 of chip no. 2)"; "The rotator center for LBC Blue is (in detector coordinates on Chip 2) [1035,2924] and for LBC Red [1078,2913]." |

Note sentences: "One of the Large Binocular Camera's two prime-focus imagers" (R16 Sec. 3.1); "behind a five-lens corrector" (R16 Sec. 3.1: "Each LBC uses a similar set of five corrective lens (a 6th lens is the cryostat window with almost no net power)." LOP counts "a total of six lenses, including the cryostat windows"; the Telescopes mode says "five fused-silica lenses and the cryostat window", which would be the consistent wording); "three CCDs in a row and a fourth turned by 90° above the row" (LFP); "the optical axis on the middle chip" (G08 FoV center and R16 rotator center both on chip 2); "ε is a lower bound (the primary's central hole; the camera's shadow is not published)" (LQF; confirmed NOT FOUND, see 2.4); "The corrected field is 110 mm (0.52°) across" (R16).

### 2.2 Errors

**F1 ignored; primary drawn at f/1.45 (medium, drawing).** In web/imager.js `design()`, a prime-focus telescope uses F1 only inside `if (P.tel === "prime" && P.corrector && P.F1 && ...)`; otherwise `f1 = P.F * Dmm` and `F1: P.F`. The lbcb and lbcr states carry no `corrector`, so F1 = 1.142 has no effect. A headless screenshot of `#inst=img&ipreset=lbcb` shows the primary labeled "Ø 8.40 m, f/1.45" and the prime-focus unit 12.2 m above the primary, with no corrector (scratch copy: /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/vstlbc/shot_lbcb.png). Fix: add the corrector the Telescopes mode already uses for the LBT prime foci (web/tpresets.js lines 436 and 441, `corrector: { d: 0.93, ... }`; data/telescopes/lbt.md calls d schematic: where the f/1.144 cone is 0.81 m wide, the L1 diameter). Model with the fix: pixel scale 0.22862″/px (unchanged), field 23.97′ × 25.65′ (unchanged), f1 = 9.593 m, focus 9.84 m from the primary. The same omission affects other imager presets with tel "prime", F1 ≠ F and no corrector (hsc, decam, megacam), which are outside this part.

**Center pixel scale: two measurements, one scored (medium).** G08 Sec. 3 (PDF p. 6): "The pixel scale at the center is 0.2275′′± 0.0001 and the median value is 0.2254′′± 0.0001 with filter-to-filter variation affecting the fourth decimal digit." vst_lbc.md has no entry for 0.2275 (grep). The preset scores BB10's value. BB10's configuration: the scale at chip [2]'s reference pixel (x◦, y◦) = (1025, 2305) of the work image, the chip center, 614-620 px (8.3 mm, 2.3′) from the FoV/rotator center; V-Bessel images of February 2007 (BB10 Table 1); made absolute against the Digital Sky Survey (BB10 Sec. 5, PDF p. 10: "we inter-compared star positions in the Digital Sky Surveys with those of our reference frame, and derived an absolute x-scale factor for chip [2] in its reference point (x◦ , y◦ )[2] . We found a value for α[2] = 229.7±0.1 mas"). BB10 says the ±0.1 mas "reflects the scale stability under the limited conditions explored", so the absolute error is not stated. The 2.3′ offset does not explain the 1% difference: with G08's pincushion of at most 1.75% at the edge (r ≈ 17′), the radial scale at 2.3′ differs from the center by ≈ 3 × 1.75% × (2.3/17)² ≈ 0.1% (DERIVED). THL's linear chip-2 scale (0.2265″/px, an average over a chip spanning −10′ to +7′ about the axis, DERIVED from the .ahead CD matrix) sits closer to G08 than to BB10 (INFERRED; the template carries no distortion terms). Fix: add G08's 0.2275 as a pub line, keep BB10 with its configuration stated ("at chip 2's center, DSS-calibrated"), and say the two disagree by 1%; the design focal length 12,180 mm (0.2286) lies between. Effect: the check is retained but no longer implies a single measured value.

**Chip #4 position (low, drawing).** The preset centers chip #4 (x = 0). BB10 Table 4 (PDF p. 10): "(xcorr [2] )k 3135.0 1025.00 −1088.1 948.36", i.e. chip [4]'s center 76.6 px (1.03 mm) from chip [2]'s, toward chip [3]. THL LBC_BLUE@LBT.ahead (linear CDs, DERIVED): chip 4 spans −514.8″ to +522.4″ against the row's −723.0″ to +695.6″, a 17.5″ (≈77 px) offset toward chip 3. The LBTO drawing (LFP) and the texts of LFP, R16 and BB10 say "centered". Effect: none on scored values.

**Axis height (low, drawing).** shiftY = −8.539 mm (632.5 px above the chip-2 center) was DERIVED from BB10's mosaic "+" (1025, 3355) and the LFP rotator center, mixing BB10's on-sky 52-px chip-4 gap with G08's 76-px gap. Direct values (DERIVED, taking y to increase toward chip 4 as in BB10's frame): R16 rotator center (2924 − 2304.5) × 0.0135 = 8.36 mm; G08 FoV center (2919 − 2304.5) × 0.0135 = 8.30 mm. Effect: rMax 59.9 → 60.2-60.6 mm; fieldX, fieldY and area unchanged to 0.01′.

### 2.3 Unsupported or misleading note text

- pub[0] "pixel scale 0.2297″/px near the center (measured)": true for BB10, but the label implies the measured center value; the builders' measurement is 0.2275 (above).
- pub[1] `src` "LBTO; the average includes the pincushion distortion, which the model leaves out": LFP's sentence reads "At the f/1.47 LBC focus, the focal plane scale is 16.9 arcsec/mm, and, thus, the average pixel scale for both LBC Blue and LBC Red is 0.2255 arcsec/pixel", and 16.9 × 0.0135 = 0.2282, so LBTO does not say the average reflects distortion. The reading is supported by G08's measured center (0.2275) and median (0.2254); cite G08.
- "five-lens corrector": supported by R16; LOP says six lenses including the cryostat window. Suggest "five lenses and the cryostat window" (as the Telescopes mode).

### 2.4 DERIVED / INFERRED / NOT FOUND and silent assumptions

- eps = 0.106: lower bound; the LBC body (hub, derotator, cryostat) diameter is NOT FOUND. Searched: LBTO pages (LQF, LOV, LOP, LFP, LIO), the LBC ETC help (lbt.inaf.it, gives only "p=0.23"), a web search, and Rodriguez et al. 2020 (SPIE 11487, 114870E), which names "the central obscuration" of the extra-focal pupil as a collimation diagnostic without a number. L1 (810 mm, G08) is smaller than the hole.
- F1 = 1.142: sourced, but unused (error 1).
- shiftY, extra-chip x: DERIVED or assumed (errors above). The pixel frame of the R16 rotator centers is not stated: x = 1035 (Blue) and 1078 (Red) are 10.5 and 53.5 px from the chip center in science pixels, or −39.5 and +3.5 px if the coordinates include the 50 prescan columns (BB10 Sec. 2: science area "within pixel (51, 1) and pixel (2098, 4608)"). The preset puts the axis at the chip-2 center in x.
- Gaps: G08 design (74 / 76 px). On-sky: BB10 Table 4, 62 / 65 / 52 px (record, DERIVED); THL .ahead, 16.1″ / 15.3″ / 14.8″ ≈ 71 / 68 / 66 px (DERIVED, linear CDs). The model's 1.0 / 1.03 mm stand as the builders' values.
- That the rotator center is the optical axis: INFERRED; G08's "geometrical FoV center" (y = 2919) lies 5 px from the rotator center (y = 2924), which supports it.

### 2.5 Scored checks

| check | configuration | measurement? | model | verdict |
|---|---|---|---|---|
| pixScale 0.2297, tol 1% | LBC-Blue, V/B Bessel 2007, chip-2 center (2.3′ off axis), DSS-calibrated | measured (BB10) | 0.22862 (−0.47%) | passes; G08's measured center 0.2275 gives +0.49% and also passes; add G08 |
| pixScale 0.2255 (info) | field average | LBTO (G08 measures 0.2254 median) | +1.38% | correctly info; cite G08 |
| npix 37,748,736 | 4 × 2048 × 4608 | arithmetic (no published total) | exact | fine |

### 2.6 Open questions (builders)

- The outer diameter of the LBC body on the swing arm (the prime-focus obscuration).
- The center pixel scale: G08 0.2275 or BB10 0.2297 (and BB10's 0.2319″ master-frame scale in its Fig. 9 caption).
- The pixel frame of the rotator centers [1035, 2924] and [1078, 2913]; whether the rotator axis is the optical axis.
- The lateral offset of chip #4 (on-sky 1.0 mm toward chip #3 vs "centered").

## 3. LBT / LBC-Red (`lbcr`)

### 3.1 Values verified

| input | preset | source and location | quote |
|---|---|---|---|
| D, eps, F1, Nx, Ny, pix, rows | as LBC-Blue | as LBC-Blue; R16 Sec. 3.1 | "Figure 1 shows the layout of LBC Blue (LBC Red is the same layout with a slight difference in the corrected field size)" |
| F | 1.453 | LFP | "At the f/1.47 LBC focus, the focal plane scale is 16.9 arcsec/mm"; 206264.8 / 16.9 / 8400 = 1.453 (DERIVED) |
| gapX, gapY | 0.945 mm | R16 Sec. 3.1; LIO | "Each CCD covers 70 .8 × 170 .6 with a gap of 70 pixels (1800 ) between each CCD" (text layer: 7.8′ × 17.6′, 18″); 70 × 13.5 µm = 0.945 mm (DERIVED) |
| shiftY | −8.297 mm | by analogy with Blue | R16 Red rotator center [1078, 2913] gives 8.21 mm (DERIVED) |

Note sentences: "the red-optimized twin of LBC-Blue on the LBT's other 8.4 m mirror" (R16 Sec. 3.1: "one red optimized at the f/1.14 prime focus on DX"); "deep-depletion CCDs" (G08 Sec. 2.2: "The red channel is equipped with 4 high-resistivity, deep-depletion 42-90 E2V detectors"); "a corrector of BK7 lenses" (LOP: "The LBC-Red lenses are BK7 borosilicate"; R16; G08 Sec. 2.2); "the same layout of four CCDs" (R16); "F comes from LBTO's 16.9″/mm (sources quote f/1.45 to f/1.47)" (LFP, LOP; f/1.45 is G08's Blue value, and for Red G08 Sec. 2.2 says only "The focal length, and hence the plate scale, are almost equivalent to the the blue channel design"); "ε is a lower bound" (LQF). Supported.

### 3.2 Errors

- F1 ignored and the primary drawn at f/1.453 (as LBC-Blue, error 1). Fix: the BK7 corrector entry of web/tpresets.js line 441.
- Gaps inconsistent with LBC-Blue (low): see ranked item 5.
- Axis height (low): shiftY −8.297 vs R16's 8.21 mm (DERIVED); the x frame question of 2.4 matters more here (53.5 px = 0.72 mm if science pixels).

### 3.3 Unsupported or misleading note text

None beyond the f/1.45 attribution noted above.

### 3.4 DERIVED / INFERRED / NOT FOUND and silent assumptions

- F = 1.453: DERIVED from a three-figure plate scale (16.85-16.95″/mm gives F = 1.449-1.457). LBTO's f/1.47 equals the 0.2255″/px average (12,348 mm), so f/1.47 most likely encodes the distortion-averaged scale (INFERRED). G08's "almost equivalent" supports a Red focal length near 12,180 mm.
- No Red center pixel scale is published (searched: R16, LBTO pages, a web search); THL LBC_RED@LBT.ini gives "PIXSCALE=0.2240". The preset scores no pixel scale for Red, so the only scored check is arithmetic (npix).
- Red corrected field: 118.5 mm (LFP drawing, record) vs 108.2 mm (R16); not used by the preset (field 40′ takes in the mosaic).
- eps and the body shadow: as LBC-Blue.

### 3.5 Scored checks

| check | configuration | measurement? | model | verdict |
|---|---|---|---|---|
| pixScale 0.2255 (info) | field average, stated for both LBCs | LBTO (R16 Table 1 also 0.2255) | 0.22815 (+1.17%) | correctly info; F is derived from the same page |
| npix 37,748,736 | 4 × 2048 × 4608 | arithmetic | exact | fine |

### 3.6 Open questions (builders)

- LBC-Red gaps and chip-4 offset (no Red measurement found).
- LBC-Red focal length and center pixel scale.
- The corrected-field diameter (118.5 or 108.2 mm).

## New sources saved

- `rawdata/imaging/vst/ESO_OmegaCAM_UserManual_VST-MAN-OCM-23100-3110_Issue2.5_2011-06-30_forP88.pdf`: OmegaCAM User Manual, Issue 2.5, 30.06.2011 (K. Kuijken), 50 pp., from https://www.hq.eso.org/sci/facilities/paranal/instruments/omegacam/doc/OmegaCAM_manual25_forP88.pdf. Sec. 2.1 (PDF p. 9): "0.2134 for the two-lens corrector"; App. B, Fig. 25 (PDF p. 49): the technical drawing of the CCD positions (gap check above). Read with pdftotext and pdftoppm only.

Not saved (no usable number): Rodriguez et al. 2020, Proc. SPIE 11487, 114870E (author copy at wp.optics.arizona.edu); scratch copy only.

Scratch files (not project files): screenshots /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/vstlbc/shot_omegacam.png and /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/vstlbc/shot_lbcb.png; the Fig. 2 render /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/vstlbc/fig2a.png and the Fig. 25 crop /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/dl2/fig25crop.png. The local server on port 8847 was stopped.
