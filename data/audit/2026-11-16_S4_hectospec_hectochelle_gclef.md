# Audit S4: Hectospec, Hectochelle and G-CLEF presets

Scope: presets `hectospec`, `hectochelle`, `gclef` in web/presets.js; research record data/presets_research.md (round 3) and data/presets_sources_3.json; sources in rawdata/presets/{hectospec,hectochelle,gclef}/. No project file was edited. Two new source files were saved (Section 5). Model runs used `IX.design(toP(state))` exactly as validate.js does; scripts and digitizations are in the scratchpad folder /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/s4/run/.

Source keys follow the research record: F05 (Fabricant et al. 2005), HOM07 (Hectospec observers manual), HHM04 (Hectospec hardware manual), MMTOH (MMTO Hecto page), S11 (Szentgyorgyi et al. 2011), HCOG (Hectochelle observers guide, rev. 2023), GC12/GC14D/GC16O/GC16D/GC18O/GC18D (G-CLEF SPIE papers), GCM23 (G@M poster), GC24/GC25 (G-CLEF arXiv papers). Page numbers are the documents' printed page numbers.

Current model output (validate.js): Hectospec R 1186, 3759–9415 Å, 1.231 Å/px; Hectochelle R 34,830, 5149–5305 Å, 0.0339 Å/px; G-CLEF R 27,958, 5171–9400 Å, orders 119–65.

---

## 1. MMT / Hectospec, 270 gpm, Hα

### 1.1 State and note

| item | preset | verdict | source |
|---|---|---|---|
| D, F | 6.5 m, f/5.3 | correct | F05 Sec. 4.2: "a focal ratio of f/5.3, the final focal ratio of the spectroscopic wide field corrector and the design focal ratio of the Hectospec bench spectrograph" |
| slitW | (√3/2) × 1.5″ | correct | HOM07 p. 4: "Each fiber has a core diameter of 250 µm, subtending 1.5″ on the sky." (250 µm at f/5.3 on 6.5 m = 1.497″, DERIVED) |
| W, f_col | 259 mm, f_col = 5.3 × 259 = 1372.7 mm | correct | HOM07 Sec. 3.2.1 "Collimated beam diameter 259 mm"; as-built Zemax collimator R = −2748.153 mm (f 1374.1) and object distance 1371.600 mm (HOM07 Sec. 3.2.2) |
| fcam | 397 mm | correct as stated; the as-built prescription gives 394.5–394.9 mm | HOM07 Sec. 3.2.1 "Camera focal length 397 mm". DERIVED here: paraxial and real-ray traces of the HOM07 Sec. 3.2.2 camera (surfaces 7–13, Malitson silica) give EFL 394.5 mm (y–nu) and 394.9 mm (chief ray, stop at the grating 546.1 mm away). Using 394.9 mm would raise the dispersion 0.5% (1.231 → 1.238 Å/px). Not recommended as a change; recorded for completeness. |
| psi | 35°, in the dispersion plane | correct | HOM07 Sec. 3.2.1 "Camera-collimator angle 35°"; HOM07 Fig. 8 caption "The fibers are arranged in a line perpendicular to the plane of the page" (the 35° lies in the page, the dispersion plane); Zemax coordinate breaks "Tilt About X : 22.83°" and "12.17°" (sum 35.00°). The model returns α = 22.830°, β = −12.170° at 6563 Å, the Zemax values exactly. |
| G, m, lamC | 270 /mm, 1, 6563 Å | correct | HOM07 Sec. 3.3 "all set up with Hα as the central wavelength" |
| lamB1 | 5200 Å | WRONG: 5296 Å (blaze angle 4.1°) | HOM07 Fig. 9 (p. 18), the Richardson test sheet of the actual grating: "Serial Number: MR192-1-1-1 ... Grooves/mm: 270 ... Nominal Littrow Blaze: 530 nm ... Blaze angle: 4.1 degrees ... Measured with 35 degrees between incident and diffracted beams". The measured efficiency curve peaks at 0.72 near 0.48–0.50 µm, read from the plot. 2 sin(4.1°)/270 mm = 5296 Å (DERIVED). |
| Nx, Ny, pix | 4608, 4096, 13.5 µm | correct | F05 Sec. 3.2: "two E2V model 42-90 4608X2048 CCDs with 13.5 µm pixels, arranged in a 4608X4096 array. The long axis of the CCDs are parallel to dispersion." |
| nObj | 300 | correct | F05 Abstract |
| colTilt, layLen | 0, 2749 mm | correct | Zemax collimator-to-grating thickness −2748.788 mm |
| note "blaze 5200 Å" | | WRONG, as above | The manuals' 5200 Å (HOM07 Sec. 3.3, HHM04 Sec. 3.3.2, MMTOH) and F05's 5000 Å ("In both cases we specified a 5000 Å blaze, but the blaze angle has proven to be the most difficult parameter to control") disagree with the vendor sheet; the vendor sheet is the measurement of the delivered grating. |
| note "Decommissioned in 2026" | | correct | MMTOH: "Hectospec and Hectochelle were permanently decommissioned in summer 2026" |

Effect of the blaze fix: the model's blaze peak moves from 4920 Å to 5015 Å, matching the vendor's measured peak at 0.48–0.50 µm in the same 35° geometry. Efficiency at Hα rises from 0.818 to 0.837 of peak. R, dispersion and coverage are unchanged.

Not modeled (drawing or detail, not errors): HOM07 p. 4, "The fibers are mounted in two rows; images of even and odd fibers are separated by ~30 pixels (in the wavelength direction)", so alternate fibers' coverage is shifted by ≈37 Å (30 × 1.23 Å, DERIVED). The CCD gap runs parallel to the spectra and costs no wavelength.

### 1.2 pub lines

- "1.21 Å/px" (scored, 3%): model 1.231 at 6563 Å (1.7%). The 1.21 (HOM07 p. 4; MMTOH) is inconsistent with the manual's own coverage numbers: 5770 Å / 4608 px = 1.252 Å/px and the table's 4176 Å / 3400 px = 1.228 Å/px (DERIVED). The model gives 1.210 Å/px at 4500 Å, so 1.21 may describe the blue half; the source does not say where on the chip. Passing, but the line should say that the figure is unlocated.
- "coverage 5770 Å" (scored, 5%): model 5656 Å (2.0%). The stronger test is the HOM07 Sec. 3.3 table, "270 4488-8664 ... The spectral coverages in this table refer to the nominal 3400 pixel format". The model on a 3400-px format gives 4486.6–8665.5 Å, agreement to 2 Å at both edges. The manual's "full spectral coverage is ~1.35 times that shown in the table" gives 4176 × 4608/3400 = 5660 Å (DERIVED), and the model gives 5656 Å. The intro's 5770 Å cannot be reconciled with the table. Recommended: score span 5660 Å (tol 1%), cite the table, and keep 5770 Å as info.
- "fiber image 5.1 px" (scored): model 5.06 px. This is F05's "With perfect optics" design figure, not a measurement; the label says so.
- "pixScale 0.2795″/px" (scored): passes. The "6″/mm" in the label is DERIVED (250 µm = 1.5″) and does not appear in F05; the line partly repeats the state (W F / f_cam = 3.458).
- "R = 6563/6.2 Å" (info): the 6.2 Å is the design value of the HHM04 Sec. 3.3.2 table ("270 4488-8664 6.2"); F05 quotes the same number. Correctly marked info.
- "fiber images 10.2 px apart" (info): correct (HHM04 Sec. 3.3.3).

Missing scored test: the only measured resolution in the sources, HOM07 Sec. 3.3: "The spectral resolutions quoted are as measured with arc lines, with the first number referring to wavelengths around 4500 Å, while the second refers to 7000 Å", 270 gpm "5.8-5.0" Å. Model FWHM is 5.53 Å at both wavelengths: R 814 vs 776 at 4500 Å (+4.9%) and 1265 vs 1400 at 7000 Å (−9.6%). The measured FWHM falls by 14% from blue to red, which an ideal camera with a fixed fiber image cannot reproduce (F05 Sec. 3.3.1 gives RMS image diameters of 1.3–1.8 px for the real optics). Recommended: add RAt lines at 4500 Å (776) and 7000 Å (1400) as measured, tol 10%, with the 7000 Å line expected near the tolerance edge.

---

## 2. MMT / Hectochelle, RV31

### 2.1 Camera focal length (the main error)

The preset uses f_cam = 25.3 in = 642.6 mm (HCOG App. B, p. 46–47: "You may, however, calculate the position on the focal plane with the grating equation and the following parameters ... Camera focal length: 25.3 inches"). The research record weighed this against 670.6 mm implied by S11's 0.49 demagnification. Four independent lines of evidence give ≈619–622 mm instead.

1. HCOG App. E, Table 5 "Hectochelle Optical Parameters" (p. 65), missed by the research: "Collimation Focal Length 1371.6 mm / Corrected Camera Focal Length 618.658 ,,". The same table states "Inc/Diffr. Opening Angle 15 º".
2. HCOG Fig. 21 (p. 46), "Extent of CCD Format", digitized here: major ticks at −5, 0, +5° fall at pixels 428.5, 978.5, 1528.5 of the embedded image, and the two format lines at 662 and 1295, i.e. ±2.877°. The chip half-length 2304 × 13.5 µm = 31.10 mm then implies f = 31.10 / tan 2.877° = 618.6 mm (DERIVED). Fig. 21 was drawn with the Table 5 focal length.
3. S11 Table 2 (p. 1191), the published prescription. A paraxial trace of the camera (corrector lenses 1670.34 CX / 3267.71 CX and 1458.06 CX / 590.83 CC, camera mirror 1350.99 CC, field flattener 131.45 CX / 494.26 CC, tabulated spacings, Malitson silica) gives EFL 619.1 mm at 5230 Å, and the paraxial focus lands on the tabulated focal plane (residual height 4×10⁻⁴ of the entrance height), which confirms the sign reading of CX/CC. A chief-ray trace with the stop at the grating (2032.00 mm before the corrector) gives a scale of 621.2 mm at the center and pincushion distortion of +3.75% in local scale at 2.9° (the chip ends). The same code applied to the Hectospec as-built Zemax camera returns 394.5–394.9 mm against the stated 397 mm, a check of the method.
4. Measurement. HSRED ThAr wavelength solutions of RV31 frames (2×3 binning, 13 nights from 2017-09-12 to 2019-10-21) from the H3 survey reductions, ~/h3/tiles/ThAr/*/RV31_2x3/*/spHect-comp*.fits (HDU0 holds the wavelength of each binned pixel, 240 fibers × 1536 px; header FILTER = RV31, CCDSUM = 2 3). For the central 40 fibers: chip-center wavelength 5229.0 Å; dispersion at the chip center 0.1052 Å per binned pixel = 0.03507 Å per 13.5 µm pixel; 0.0361 at the blue end and 0.0313 at the red end; coverage 5147.7–5307.0 Å (159.3 Å). The values repeat to ±0.1% across the 13 nights.

Model comparison at lamC = 5229 Å:

| f_cam | center Å/px | blue / red end Å/px | span | fiber image along dispersion |
|---|---|---|---|---|
| 642.6 mm (preset) | 0.03393 (−3.3%) | 0.0363 / 0.0314 | 156.2 Å | 4.98 px |
| 618.66 mm (HCOG Table 5) | 0.03527 (+0.6%) | 0.0378 / 0.0325 | 162.3 Å (+1.9%) | 4.79 px |
| 618.66 mm with the prescription's pincushion applied at the ends (DERIVED) | 0.03527 | 0.0365 / 0.0314 | ≈159 Å | |
| measured (H3 ThAr) | 0.03507 | 0.0361 / 0.0313 | 159.3 Å | |

With 618.66 mm and the distortion of the published prescription, the measured solution is reproduced to ≤1% at the center and both ends. The preset's 642.6 mm matches the measured mean span by accident: the error in the focal length offsets the missing pincushion, and the center dispersion is 3.3% low. Neither the 25.3 in of HCOG App. B nor the 0.49 of S11 is reproduced by any prescription or measurement; S11's own Table 2 implies a demagnification of 619/1368.55 = 0.452 (DERIVED).

Fix: fcam 618.658 (HCOG App. E Table 5; S11 Table 2). Effect: dispersion +3.9% (0.0339 → 0.0353 Å/px at 5230 Å), coverage 156 → 162 Å (measured 159 Å; the 2% excess is the camera's pincushion, which the ideal-camera model lacks), fiber image along dispersion 4.98 → 4.79 px, Reff 34,830 → 34,760. R barely moves because R is set by the slit and f_col.

### 2.2 Other state and note items

| item | preset | verdict | source |
|---|---|---|---|
| D, F, f_col | 6.5 m, 5.4 → f_col = 1371.6 mm | correct, and now directly sourced | HCOG Table 5 "Collimation Focal Length 1371.6 mm"; S11 Sec. 4.3 slit radius 1371.6 mm. The research DERIVED 1368.55 mm from R/2; the stated value is 1371.6. |
| slitW | (√3/2) × 250 µm/(5.4 × 6.5 m) = 1.272″ | correct (virtual convention: the collimator sees 250 µm) | S11 Sec. 3.6 "250 µm core fibers" |
| W | 254 mm | correct | S11 Sec. 3.1 "The spectrograph beam size is 254 mm and the spectrograph input focal ratio is f/5.4." |
| G, m, lamB1 | 110 /mm, 31, Littrow blaze for 64.5° | correct | S11 Sec. 3.3 "The ruling density is 110 lines per millimeter and the rulings are blazed at 64.5°" |
| psi | 15°, in plane | correct | S11 Sec. 3.3 "The incident and central diffracted beams that intersect the grating face have an opening angle of 15°. The angle of incidence (α) is 72° and the center-wavelength diffraction angle (β) is 57°"; S11 Table 1 "Opening angle α-β 15°"; S11 Fig. 2 draws the 15° in the dispersion plane; HCOG App. B "The opening angle between the incident beam and the center of the diffracted beam is fixed at 15°." |
| lamC | 5230 Å | correct | RV31 CWL; measured chip center 5229.0 Å (above) |
| Nx, Ny, pix | 4608, 4096, 13.5 µm | correct | S11 Sec. 5.1 "two E2V 2048 × 4608 pixel backside-illuminated CCDs model CCD42-90 with 13.5 µm pixels"; Sec. 3.4 "The columns (i.e., the long dimension of the CCD) are aligned with the dispersion direction" |
| nObj | 240 | correct | S11 Sec. 2 |
| layLen | 2737 mm | correct | S11 Table 2 "−2736.85" |

Errors in HCOG Table 5 that the preset must not adopt: "Grating Angle of Incidence 57º / Grating Diffraction Angle (Blaze) 72º" (swapped relative to S11 Sec. 3.3 and HCOG App. B "Blaze angle of incidence: α = 72°"), "CCD Param 2k x 4.5k, 15μ pixel" (13.5 µm per S11 and F05) and "Fiber Output F/# 5.0". The swap is settled by the measurement: with β = 72° the measured 0.0351 Å/px would need a 349 mm camera, and the image along dispersion would be 14.7 px against the measured LSF of 3.4–4.2 px (DERIVED).

Note text:
- "catadioptric camera 25.3 in (642.6 mm, observers guide; the paper's 0.49 reduction implies 670.6 mm)": replace with 618.66 mm (HCOG App. E; S11 Table 2) and the measured dispersion.
- "1.47″ at f/5.4 on 6.5 m; 1.5″ in the guide": S11 also states 1.5″ ("the 250 µm diameter core optical fibers that feed Hectochelle subtend 1.5′′ on the sky"); 1.47″ is DERIVED from S11's 170 µm/″. Minor misattribution.
- "(α 72°, β 57°)": these are the blaze-center angles. RV31 runs off blaze: S11 Sec. 10 says the poorer throughput agreement "at order 31 ... is explained in large part by the fact the echelle is grating is operated significantly off-blaze in the discrepant orders". At the measured center (5229 Å) the angles are α = 71.56°, β = 56.56° (DERIVED). The note should say so.

Not modeled: off-axis fibers meet the grating up to 2.58° out of plane (S11 Sec. 3.3), which tilts the slit images and spreads the LSF FWHM over 3.4–4.2 px (S11 Sec. 3.4); the camera's pincushion (Section 2.1).

### 2.3 pub lines

- "nominal R 32,000 at 5200 Å, from the fiber-image diameter" (Rdiam, scored 8%): S11's number equals the blaze-center closed form, (sin 72° + sin 57°)/cos 72° × 1371.6/0.250 = 31,780 (DERIVED). The model gives 30,970 at the RV31 setting (−3.2%) and 31,777 at the order-31 blaze center 5248.5 Å (−0.7%). The line is geometric, not measured, and the model repeats the same closed form. Reclassify as info, or evaluate at λ = 5248.5 Å.
- "~150 Å per order" (span, scored 10%): a generic statement for all orders (S11 Sec. 1). Replace with the measured RV31 coverage 5147.7–5307.0 Å (Section 2.1) or the published "5150Å−5300Å" (Conroy et al. 2019, Sec. 3, saved under rawdata). With f_cam 618.66 the model gives 5144.8–5307.1 Å, so lo and hi pass at 0.1% and the span (162.3 vs 159.3 Å) at 2%.
- "fiber image 69 µm = 5.1 px" (diam, scored 5%): S11's 124 × 69 µm ellipse follows from its 0.49 demagnification, which S11's own Table 2 contradicts (0.452 gives 113 × 64 µm = 8.4 × 4.75 px, DERIVED). With the corrected camera the line fails (4.79 vs 5.1 px, −6%). Reclassify as info with this explanation.
- "R 38,000 typical (measured)": S11 does not call the number measured. The sentence closes an argument: "Projection of the circular slit image onto the dispersion axis effectively boosts this resolution by a factor of 1.46. ... These effects reduce the boost factor somewhat. A typical resolution of 38,000 is achieved." HCOG, "A brief description of the Hectochelle": "The resolution of the Hectochelle is ~34,000"; MMTOH: "R range of 32,000 – 40,000" and "R~32,000". The measured quantity in S11 is the LSF: "As measured on full-resolution frames, the FWHM of spectral features varies by 10%, i.e., between 3.4 and 4.2 pixels." With the measured 0.03507 Å/px this is R = 35,500–43,800 at 5229 Å (DERIVED). The model gives R 34,760 (LSF FWHM 4.27 px with f_cam 618.66). Recommended: drop "(measured)" from the 38,000 line, and add the LSF range as the measured line (info, or score the midpoint 3.8 px with a 12% tolerance). The model's 4.27 px sits 2% above the measured range because the model uses the true FWHM of a uniformly lit disk (0.866 D); see Section 3.3 for the Gaussian-fit convention that S11's "1.46 boost" implies.
- "α 72°, β 57° at the order center" (alphaDeg, scored 1%): a blaze-center value compared with the RV31 setting (71.58° in the model at 5230 Å; 71.56° at the measured 5229 Å). Passes at 0.6% only because the off-blaze offset is small. Reclassify as info or evaluate at 5248.5 Å.
- "0.04 Å/px" (info): MMTOH's one-figure value. Replace the parenthetical "642.6 mm gives 0.0336" with the measured 0.0351 Å/px.

Context for the page: the common science setting is 2×3 binning. Conroy et al. 2019 Sec. 3: "The data are binned by a factor of three in the wavelength direction and two in the spatial direction. This setup delivers a resolution of R ≈ 23,000 over the (single order) wavelength range 5150Å−5300Å." The preset is unbinned.

### 2.4 RV31 order-isolating filter passband

| quantity | value | source |
|---|---|---|
| center, FWHM (table) | 5230 Å, 160 Å; peak transmission 0.94; transmission × CCD QE 0.78; vendor Barr | S11 Table 5 (p. 1208): "RV 31 . . . 5230 160 0.94 0.78 Barr Radial velocity" |
| center, FWHM (2023 table) | 523.0 nm, 16.0 nm, 0.94, 0.78, Barr | HCOG Table 4 (p. 47): "RV 31 523.0 16.0 0.94 0.78 Barr Radial velocity" |
| measured curve | half-maximum 5149–5303 Å (FWHM 154 Å, center 5226 Å); T ≥ 0.76 from 5153 to 5286 Å; peak 0.95 near 5168 Å; T = 0.10 at 5137 and 5320 Å | HCOG Fig. 34 (p. 54), header "RV_31 #RV 31 Center: 522.600 Width: 16.9000", digitized here (axis ticks at 515/520/525/530 nm, 83.27 px nm⁻¹; T scale from the 0.2-step ticks). Sample values: T(5141 Å) 0.19, T(5150) 0.58, T(5160) 0.92, T(5180) 0.94, T(5200) 0.88, T(5226) 0.85, T(5250) 0.77, T(5273) 0.84, T(5300) 0.56, T(5311) 0.28 |
| figure's "detector edges" | 5141.5 and 5310.6 Å (dashed lines) | HCOG Fig. 34 lower panel, "Dash: Detector Edge". The 16.9 nm "Width" in the header is this span, which equals the order-31 FSR at 522.6 nm (522.6/31 = 16.86 nm, DERIVED); the guide asserts "The FSR of order 31 (~510 nm) is the same size as the CCD format". The measured chip edges are 5147.7 and 5307.0 Å. |
| on-chip coverage | 5147.7–5307.0 Å measured; "5150Å−5300Å" published | H3 ThAr solutions (Section 2.1); Conroy et al. 2019 Sec. 3 |

Recommended for the order-filter setting: band 5150–5310 Å (5230 ± 80 Å, S11 Table 5 and HCOG Table 4), peak T 0.94; or the digitized curve (half-maximum 5149–5303 Å) if the page draws a profile. The filter half-maximum points coincide with the chip ends to within 5 Å, so the filter and the detector bound the coverage together.

---

## 3. GMT / G-CLEF red, MR mode (design)

### 3.1 State and note

| item | preset | verdict | source |
|---|---|---|---|
| D, F | 25.4 m, f/8 | correct | GCWEB1 Table 3 "Telescope Aperture 25.4 m (7 × 8.4 m)"; GC18D Sec. 2.1 "The GMT relayed image is at an F/8." |
| slitW | (√3/2) × 0.8″ | rounded: 0.812″ | GC18O Table 1 "MR 0.8 800 35,000 Round optical fiber". 300 µm × 8/3 = 800 µm at the f/8 slit (GC18D Sec. 2.1, "bi-telecentric relay systems with m=3/8 magnification"), and 800 µm at f/8 on 25.4 m is 0.812″ (DERIVED). Effect: Rs −1.5% (28,000 → 27,590). Minor. |
| W, f_col | 300 mm, 2400 mm | correct | GC16D Sec. 2.2 "The collimated beam has a diameter of 300mm"; "The fiber end images are located on the optical axis of the collimator at its focus, 2400mm away" |
| fcam | 675 mm EFFECTIVE | correct | GC18O Table 2 "Pup.Xfer Mirr./Cam. Reduction 450/1600 = 0.2813", i.e. 450 × 2400/1600 = 675 mm (DERIVED) |
| eG, eDelta | 31.6 /mm, 75.96° | supported; conflict with 2014/2018 text | GC16D Sec. 2.2 "The grating face is tilted at 75.96°"; GC12 Table 5 "Blaze Angle 75.96° (R4)". GC14D Sec. 2.1 and GC18D Sec. 3 print "75.6°". A 75.6° face with a 75.96° blaze would put an unstated 0.36° in-plane offset into a design both papers call Littrow apart from γ; the "75.6" is INFERRED to be a dropped digit. If 75.6° were right: Rs −2.4%. |
| gamma, theta | 0.75° out of plane, 0 | correct, geometry checked against the figures | GC16D Sec. 2.2 "a true Littrow condition is slightly compromised by a 0.75° γ angle (a small clockwise rotation of the grating in the plane of Fig, 1)". GC16D Fig. 1 is a side view: the echelle is drawn as a rectangle with edges parallel to the beam (the dispersion plane would show a thin line inclined at 14°), and the returned beam rises to the Mangin mirror above the fiber feed. GC14D Fig. 1 caption: "The main dispersion is in and out of the plane of the figure." A rotation in that plane tilts the grooves, which is γ. GC18D Sec. 3 writes "(γ = 0.75°)", GC18O Sec. 2 "a small 'γ angle' pitch". |
| xd, xG | VPH, 480 × 450/675 = 320 /mm EFFECTIVE | correct; validated (Section 3.2) | GC16D Sec. 2.2 "a VPH grating with a groove density of 480 lines/mm ... optimized for the first order at a wavelength of 7300Å" |
| VPH fringe tilt | not modeled | minor | GC16D Sec. 2.2 "The imprinted fringes are tilted by 3.25 degrees, so that the VPH grating does not operate in a Littrow configuration". The asymmetric angles change the cross-dispersion by ≈1% (1/cos of the exit angle). |
| lamC | 7300 Å | unsourced as format center; ≈7450 Å INFERRED | No source gives the format center (research NOT FOUND). GC16D Fig. 15, right panel (red PRV echellogram), digitized: the reddest order is centered at −43.3 mm and the outer edge of the bluest order at +43.25 mm inside a ±46.2 mm detector box, so the whole red format fits. The model at 7300 Å puts order 65 at +46.96 mm, beyond the 46.1 mm half-height. At lamC = 7450 Å the model puts order 65 at +43.7 mm and order 112 at −42.7 mm, within 0.5 mm of the figure (assuming the extreme orders in Fig. 15 are 65 and ≈112, the range of Fig. 16's red panel). R is unchanged. |
| Nx, Ny | 9240 × 9220 (DERIVED from mm) | approximately right: 9232 × 9216 | GC16D Sec. 3 "(92.4×92.2mm) ... (e2V) monolithic detector, with a ... (10µm) pixel size". The e2v device with that area and pixel is the CCD290-99, datasheet: "Number of pixels 9216 (H) × 9232 (V)", "Pixel size 10 µm square", "Image area 92.2 mm × 92.4 mm" (identification INFERRED; GC16D names no model). Which axis carries the dispersion: NOT FOUND. Effect < 0.2%. |
| nObj | 3 | correct | GC16D Table 2 MR: 1 science, 2 calibration/sky; GC18D Table 1 adds "(+1 GMTNIRS)" |
| xPsi, xGlass, xA | 10, silica, 40 | unused for a VPH | harmless leftovers |

Note text:
- "the 2016-2018 design (Ben-Ami et al. 2016, 2018; Szentgyorgyi et al. 2016, 2018)": the preset's tilt (75.96°) and red detector (e2v, 10 µm) are 2016 values. The 2018 papers print 75.6° and describe "an STA 1600 95.04×95.04mm CCD" for the cameras (GC18D Sec. 3), "a 'baseline' pixel size of 9 µ" (GC18O Table 2 caption; the table itself says 0.010 mm) and an "STA I600LN Circular Package CCD" (GC18O Fig. 10). Call the preset the 2016 design and cite the 2018 differences.
- "Not built yet": GC24 Sec. 2.1 (2024): "At the time of writing, G-CLEF is currently being assembled at the Center for Astrophysics | Harvard & Smithsonian. In 2027, G-CLEF is planned to be commissioned on the 6.5m Magellan Clay Telescope"; Sec. 2.2: "the G-CLEF red camera has been assembled". GC25 (2025): "currently under assembly, with first light at Magellan anticipated in 2027". Suggested wording: "Under assembly; first light planned on Magellan Clay in 2027 and on the GMT in the 2030s."
- The as-built red cross-disperser differs from the preset: GC24 Sec. 2.1 "Each channel includes a volume phase holographic (VPH) grism as a cross-disperser"; GCM23 lists "Red and Blue VPH Prisms". No prescription is published. "the design has changed since" covers this, but the note could name it.
- "in Littrow, 0.75° out of plane", "off-axis-parabola collimator 2400 mm, 300 mm beam", "R4 echelle 31.6 /mm", "effective camera 675 mm": correct.

### 3.2 Order spacing: the pub line compares unlike quantities

The info line "minimum inter-order EDGE gap 210 µm ... center spacing here" carries value 21 (px) and the model returns a center spacing of 103.5 px. The two numbers cannot be compared. GC16D Sec. 3: "For the red (blue) echellogram, we get a minimum inter-order separation of 210µm (244µm) and a minimum intra-order separation of 120µm (110µm), see Fig. 15 and 16." GC16D Fig. 16 (red) shows the inter-order separation at ≈2.3 mm for order 65, falling to 210 µm at order ≈112, and a flat intra-order separation of ≈120 µm (the fiber pitch within an order). Adding the PRV footprint, 7 × 120 µm = 0.84 mm (8 fiber centers), gives center spacings of 3.14 mm at order 65 and 1.05 mm at order 112 (DERIVED). The model gives 3.159 mm (65/66) and 1.053 mm (112/113), within 1% at both ends. Reading the inter-order separation as center spacing minus 0.84 mm is INFERRED from that agreement.

Recommended line: { q: "minSepPx", m1: 65, m2: 113, value: 105 (DERIVED: 210 µm + 7 × 120 µm at 10 µm px), tol 0.05 }. Model: 105.3 px (preset), 105.4 px (with lamC 7450 and the CCD290 format). This line validates the 480 × 450/675 = 320 /mm white-pupil mapping.

### 3.3 Resolution: the 20% miss is a definition of FWHM

"R 35,000 (MR)" (info): model 27,958. The miss is not a geometry error. The G-CLEF papers quote R from a Gaussian-fit FWHM: GC14D Fig. 7 shows an IRAF splot Gaussian fit ("gfwhm ... 3.644") to a simulated PRV cross-section, the same 3.65 px that GC14D Table 5 lists as the PRV "FWHM in binned pixels", for a geometric image of 83 µm (5.6 px of 15 µm; ratio 0.66, DERIVED). A least-squares Gaussian fit to the projected profile of a uniformly lit disk has FWHM = 0.70 D (computed here numerically; 0.70–0.72 D with pixel sampling or a small PSF). The model uses the true FWHM, 0.866 D. Rescaled, the model gives 28,000 × 0.866/0.70 = 34,640, within 1% of 35,000. S11's "boosts this resolution by a factor of 1.46" for Hectochelle (FWHM 0.685 D) is the same convention from the same group. The info line should state this explanation in place of "published R imply a line FWHM ~0.67 of the fiber image".

"reddest order 65" (info): with lamC ≈ 7450 Å the model puts the whole of order 65 on the chip, plus a partial order 64 (the dichroic and the 950 nm limit are not modeled).

### 3.4 Combined effect of the recommended G-CLEF changes

lamC 7450, Nx 9232, Ny 9216, slitW (√3/2) × 0.812″: Rs 27,480 at lamC (27,480 × 0.866/0.70 = 34,000 vs 35,000), coverage 5327–9549 Å, orders 115–64 on the chip, minimum center spacing 105.4 px for orders 65–113.

---

## 4. Items only the builders could settle

- Hectochelle: the origin of the 25.3 in (642.6 mm) in HCOG App. B and of S11's 0.49 demagnification and 124 × 69 µm ellipse. Both disagree with S11 Table 2, HCOG Table 5, HCOG Fig. 21 and the measured wavelength solution; they may be pre-construction design values (Szentgyorgyi et al. 1998, not obtained).
- Hectochelle: the method behind S11's "typical resolution of 38,000" (measured on arc lines, or the 32,000 × 1.46 argument).
- Hectochelle: whether the HCOG Fig. 34 curve is the vendor scan or a CfA measurement, and at what angle of incidence.
- Hectospec: what "1.21 Å/px" and "5770 Å" refer to (chip location, measured or design); they disagree with each other and with the HOM07 table at the 2–3% level.
- G-CLEF: the format center in cross-dispersion (VPH incidence angle and camera axis), which detector axis carries the echelle dispersion, the 75.96° vs 75.6° grating tilt, the red-arm detector after 2018 (e2v CCD290-99 at 10 µm or STA1600 at 9 µm), and the as-built red VPH grism prescription.

---

## 5. New sources saved

- rawdata/presets/hectochelle/Conroy2019_H3_survey_arXiv1907.07684.pdf: Conroy et al. 2019, "Mapping the Stellar Halo with the H3 Spectroscopic Survey", arXiv:1907.07684 (RV31 setup, binning, R ≈ 23,000, 5150–5300 Å; Sec. 3).
- rawdata/presets/gclef/teledyne_e2v_CCD290-99_datasheet.pdf: Teledyne e2v CCD290-99 datasheet (from teledyneimaging.com/download/e216e1ae-6435-498d-8fe2-45ddd187670e): 9216 × 9232 px, 10 µm, 92.2 × 92.4 mm.
- Local measurement used (not copied): ~/h3/tiles/ThAr/<date>/RV31_2x3/<config>/spHect-comp*.fits (HSRED ThAr solutions, 13 nights 2017–2019). The figures used in existing sources were HOM07 Fig. 9, HCOG Figs. 21 and 34, S11 Fig. 2 and Table 2, GC16D Figs. 1, 6, 15, 16 and GC14D Figs. 1, 7 and Table 5.
- No headless screenshot was taken; the model outputs above are those the page displays.

---

## 6. Summary

(a) Confirmed errors, by severity

1. Hectochelle camera focal length: 642.6 mm → 618.66 mm. Sources: HCOG App. E Table 5 ("Corrected Camera Focal Length 618.658"), HCOG Fig. 21 (format at ±2.877°, implying 618.6 mm), the S11 Table 2 prescription (paraxial 619–621 mm), and the measured RV31 wavelength solutions (0.03507 Å/px at the chip center, 5147.7–5307.0 Å). Effect: dispersion +3.9% (0.0339 → 0.0353 Å/px; measured 0.0351), coverage 156 → 162 Å (measured 159 Å; the model lacks the camera's +3.75% edge pincushion), fiber image 4.98 → 4.79 px, R 34,830 → 34,760 (R barely changes).
2. Hectochelle pub lines built on S11's 0.49 demagnification and blaze-center angles: "fiber image 5.1 px" fails with the corrected camera (4.79 px) and should be info; "α 72°" and "nominal R 32,000" are blaze-center values compared with the off-blaze RV31 setting (α 71.56° at the measured 5229 Å center); "R 38,000 (measured)" is not stated as measured in S11 (the measured LSF is 3.4–4.2 px, R 35,500–43,800 with the measured dispersion); "~150 Å per order" should become the measured 5147.7–5307.0 Å. Effect: changes which lines are scored; the model reproduces the measured coverage to 0.1% at both edges with f_cam 618.66.
3. G-CLEF order-spacing line: value 21 px (an edge gap) is compared with a model center spacing (103.5 px). Fix: 105 px center spacing (210 µm + 7 × 120 µm, GC16D Sec. 3 and Fig. 16), orders 65–113; model 105.3 px. Effect: a scored test of the white-pupil cross-disperser mapping that passes at 0.3%.
4. Hectospec blaze: lamB1 5200 → 5296 Å (blaze angle 4.1°, Richardson test sheet MR192-1-1-1 in HOM07 Fig. 9, measured in the 35° geometry). Effect: blaze peak 4920 → 5015 Å, matching the measured peak; no change to R, dispersion or coverage.
5. G-CLEF format center: lamC 7300 Å has no source and drops order 65 off the chip; GC16D Fig. 15 places the whole red format (orders 65 to ≈112) on the detector, reproduced with lamC ≈ 7450 Å (INFERRED). Effect: orders on chip 119–65 → 115–64; R unchanged.
6. G-CLEF minor values: MR fiber 0.8″ → 0.812″ (800 µm at f/8, DERIVED; Rs −1.5%); detector 9240 × 9220 → 9232 × 9216 (CCD290-99 datasheet; < 0.2%).

(b) Unsupported or misleading claims

- G-CLEF "R 35,000" info text: the miss is explained by the Gaussian-fit FWHM convention (0.70 D, GC14D Fig. 7 and Table 5), which rescales the model to 34,640; replace "FWHM ~0.67 of the fiber image" with this.
- G-CLEF note "the 2016-2018 design": the preset uses 2016 values that the 2018 papers change (75.6°, STA1600 at 9 µm); "Not built yet": under assembly since 2024, first light on Magellan planned for 2027 (GC24, GC25); the as-built red cross-disperser is a VPH grism (GC24, GCM23).
- Hectochelle note: "1.5″ in the guide" (S11 also says 1.5″; 1.47″ is derived); "(α 72°, β 57°)" without saying these are blaze-center angles.
- Hectospec pub: "1.21 Å/px" and "5770 Å" disagree with the manual's own table at the 2–3% level; the table (4488–8664 Å over 3400 px, reproduced by the model to 2 Å) is the better scored test, and the arc-line FWHMs 5.8 and 5.0 Å at 4500 and 7000 Å (HOM07 Sec. 3.3, measured) are the only measured resolution and are not scored (model: +4.9% and −9.6% in R). The "6″/mm" in the pixel-scale label is derived, not from F05.

(c) Open questions for the builders: listed in Section 4 (origin of 25.3 in and 0.49 for Hectochelle; method of the 38,000; RV31 curve provenance; meaning of Hectospec's 1.21 Å/px and 5770 Å; G-CLEF format center, dispersion axis, 75.96° vs 75.6°, post-2018 detector and red grism).

(d) New sources saved: rawdata/presets/hectochelle/Conroy2019_H3_survey_arXiv1907.07684.pdf and rawdata/presets/gclef/teledyne_e2v_CCD290-99_datasheet.pdf; local H3 ThAr wavelength solutions used in place (~/h3/tiles/ThAr/*/RV31_2x3/*/spHect-comp*.fits).

RV31 passband for the page: 5150–5310 Å (CWL 5230 Å, FWHM 160 Å, peak T 0.94; S11 Table 5, HCOG Table 4); digitized HCOG Fig. 34 curve half-maximum 5149–5303 Å; measured chip coverage 5147.7–5307.0 Å.
