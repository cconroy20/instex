# Audit S8: ESPRESSO (blue, red), UVES (blue 390, red 580), MUSE, KCWI blue, KCRM

Presets audited: `espressob`, `espressor`, `uvesb`, `uvesr`, `muse`, `kcwib`, `kcrm` (web/presets.js lines 419–476 and 259–282).
Research records: data/round5/espresso.md, uves.md, muse_kcwi.md. Sources: rawdata/presets/{espresso,uves,harps,muse,kcwi}/.
Model reruns: scripts in `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/s8/` (`run.js` state overrides, `pub.js` pub lines with overrides, `tilt.js` slit-image tilt, `fitxd.js` cross-disperser fit, `uvesfmt.js` order positions against the ETC, `kcrmscan.js`, `rows.py` FITS reader). No project file was edited.

Labels: QUOTE = verbatim from a saved source; DERIVED = arithmetic done here; INFERRED = reasoning, not stated by a source; MODEL = output of web/physics.js.

---

## 1. ESPRESSO, singleHR (`espressob`, `espressor`)

### 1.1 The echelle blaze angle is the nominal R4 label; the γ = 4.85° and the 755 mm camera compensate for it (HIGH)

The preset uses δ = 76.0°, γ = 4.85° (INFERRED from the order table) and an effective camera of 755 mm (fitted to the pixel sizes of Pepe et al. 2021 Table 2; the design gives 800 mm). The three numbers form a self-consistent fit built on one assumption: that the ESPRESSO echelle is blazed at exactly 76°. The sources show that the "76°" of the ESPRESSO papers is the nominal R4 label, and that the grating is a replica of a UVES master whose measured facet angle is 75.04°.

Evidence, in order of directness:

1. ESPRESSO's echelle is replicated from a UVES master. QUOTE, Mégevand et al. 2014 (EM14), Sec. 3.7: "The main disperser is a R4 Echelle grating. The selected master is MR160 from RGL, formerly used for UVES, with a ruled area limited to 200x400 mm".
2. UVES had two masters, 41.59 /mm (blue) and 31.6 /mm (red). ESPRESSO's groove density is 31.6 /mm, so MR160 is the UVES red master (INFERRED). QUOTE, UVES User Manual Issue 117 (UM117), Table 2.2, p. 18: "Blue 41.59 1.900.000 0.100 76.0◦ 67" and "Red 31.6 2.100.000 0.0900 75.04◦ 63" (columns g/mm, resolving power, spatial resolution, blaze angle, blaze efficiency).
3. The UVES design paper calls 76° nominal and gives the red echelle a lower angle. QUOTE, Dekker et al. 2000 (D00), p. 541: "This permitted to use an unusually steep "R4" echelle with a nominal blaze angle of 76°"; Table 5: "Red 41.6 75.1°" (groove densities swapped in that table, as the research record notes); "Due to its lower blaze angle, the Rs products of the red echelle is 38 800".
4. NEW SOURCE, Laser Focus World, 1 Aug 1995 (the UVES red echelle at delivery), saved as `rawdata/presets/espresso/LaserFocusWorld1995_UVES_red_echelle_840mm_31.6_75.1deg.html`. QUOTES: "engineers fabricated a grating master by burnishing grooves into a 20-µm layer of aluminum vacuum-deposited on a 400-mm-long Zerodur substrate"; "Two grating segments were produced from the master for the echelle grating. The groove spacing of the completed elements is 31.6 mm -1 , with a 75.1° blaze angle." The 400 mm master length matches EM14's "200x400 mm".
5. The same 31.6 /mm R4 family in HARPS. QUOTE, HARPS User Manual 2.4, Table 2.2 (rawdata/presets/harps/): "R4, 31.6 gr/mm blaze angle 75◦ , mosaic 2×1 on Zerodur monolith 840 × 214 × 125mm"; p. 6: "Its echelle grating is operated in quasi-Littrow conditions (off plane angle = 0.721 deg blaze angle)". The project's own HARPS preset uses 75° and γ = 0.721°.

Numerical consistency (DERIVED, with G = 31.6 /mm):

| quantity | δ = 76°, γ = 4.85°, f = 755 mm (preset) | δ = 75.04°, γ = 0, f = 800 mm (design camera) | source value |
|---|---|---|---|
| m λ at the blaze, 2 sin δ cos γ / G | 61,191 nm (γ fitted) | 61,146 nm (−0.07%) | 61,187.3 nm (UM Tables 7–8; EP21 Table 2) |
| effective camera needed for the pixel sizes, pix / (2 tan δ · Δλ/λ) | 755 mm (fitted) | 810 mm | 800 mm design: 400 mm blue camera (EP14 Sec. 3.5) × 3000/1500 (main collimator R 6000, transfer mirrors R 3000; EST14 Table 1) |
| MODEL pixel size vs EP21 Table 2, orders 161 / 117 / 78 | +0.1% / +0.8% / +0.9% (fitted) | −1.4% / −0.6% / −0.6% (not fitted) | 0.00063 / 0.00086 / 0.00129 nm |
| MODEL slit-image tilt from the cross-dispersion axis | 34.1° | 0.0° (6.1° with γ = 0.8°) | "slightly tilted ... only a fraction of a pixel difference between upper and lower part of the trace" (QUOTE, Schmidt et al. 2021, Sec. 3.2) |
| footprint of the 300 mm slice beam, 300 / cos δ | 1240 mm (longer than the 1200 mm ruled length, EM14) | 1163 mm (fits) | 3 × 400 mm mosaic |

The tilt row is independent of the blaze-angle argument and settles γ. An off-plane angle of 4.85° on a 76° echelle tilts the monochromatic slit image by 34° in the model (tan φ ≈ 2 tan γ tan δ = 0.68, DERIVED), a shift of ≈6–7 px across a ≈10 px trace. Schmidt et al. 2021 (ES21) Sec. 3.2 measure a tilt of a fraction of a pixel across the trace, so γ ≲ 1° (INFERRED). EP21 Sec. 3.2.2 also describes the format with "when used in Littrow condition". With γ ≲ 1° the order table requires δ ≈ 75.1–75.2°, which agrees with the 75.04° / 75.1° of the UVES red master and makes the design 800 mm camera reproduce the measured pixel sizes without a fit.

The γ = 4.85° also props up the scored sampling line: the 34° tilt widens the model's slit image along X. At δ = 76° with γ = 0 the model gives 3.90 px at a blaze center; with γ = 4.85° it gives 4.46 px, which is what passes the "4.5 px" line.

Best-supported state: eDelta 75.04 (UVES manual value for the same master; 75.1° in D00 and Laser Focus World), gamma 0 (ESPRESSO value NOT FOUND; ≲ 1° from ES21; UVES and HARPS use 0.8° and 0.721°), theta 0, fcam 800 (design).

MODEL effect (blaze centers, both arms):

| | preset (76°, γ 4.85°, 755 mm) | corrected (75.04°, γ 0, 800 mm) |
|---|---|---|
| R_eff at blaze centers, orders 161 / 135–136 / 117 / 93 / 78 | 131,300–133,300 | 127,400–127,600 (−4%) |
| R_s (slit-limited) | 134,500–136,700 | 130,400–130,500 |
| slit image (npix) at blaze centers | 4.41–4.49 px | 4.58–4.69 px |
| dispersion | fitted to EP21 | within 0.6–1.4% of EP21, unfitted |
| scored "R = 140,000" (blue, at λc) | 132,750 (−5.2%, passes 6%) | 126,850 (−9.4%, misses) |
| scored "4.5 px" (blue, at λc) | 4.80 (+6.6%) | 4.35 (−3.4%) |

The R drop is 4%, smaller than tan 75.04°/tan 76° = 0.933 because removing the 34° line tilt restores 3% that the preset lost.

With the corrected geometry the R line misses 140,000 by 9% and should become an info line with its explanation, as the HARPS preset already does for the same grating family (HARPS model 99,820 vs measured 115,000, info). The explanation (INFERRED, partly DERIVED): EP21 Sec. 4.1.2 measures R from the FWHM of ThAr lines ("For all non-saturated Thorium lines with sufficient signal we measured the line width and converted the FWHM into resolving power"), and footnote 13 says the lines are partially resolved, so the values are "(safe) lower limits". A least-squares Gaussian fit to the projected profile of a uniformly lit round core of diameter d returns FWHM = 0.70 d (DERIVED numerically here), against the true FWHM 0.866 d that the explorer uses; for a uniform slit the Gaussian fit returns 0.84 w. A Gaussian-fit R can therefore sit up to 24% above the model's equal-line-width R for a fiber, before optical blur. The G-CLEF preset's note records the same ratio ("published R imply a line FWHM ~0.67 of the fiber image"). EP21 does not state the fitting function, so this explanation is INFERRED.

### 1.2 The equivalent cross-disperser does not reproduce the published order range (MEDIUM)

`xG` 757 /mm (blue) and 407 /mm (red) come from the Arns 2016 abstract read with a factor-of-ten correction (0.88 → 0.088 °/nm, INFERRED in the research record), halved for the app's 600 mm beam. MODEL with the preset: 54 orders on the blue chip (118–171) and 46 on the red (76–121), against 45 (117–161) and 40 (78–117) in UM Tables 7–8. The page shows coverage 357.8–516.7 nm (blue) and 505.6–802.1 nm (red); the published on-chip coverage is 377.15–527.03 nm and 519.22–790.64 nm (UM Tables 7–8, first and last rows). The `nOrders` pub line is info, but the coverage the page displays is wrong by up to 19 nm at the blue end.

Fix (EFFECTIVE, DERIVED with `fitxd.js`, blaze centers of the end orders placed 0.6 mm inside the chip edges): with the corrected echelle, blue xG 782 /mm at λc 4520 Å gives orders 117–161 and 378.9–523.9 nm; red xG 430 /mm at λc 6540 Å gives orders 78–118 and 520.6–785.7 nm. The Arns dispersion then becomes a cross-check (the fitted blue 782 /mm is 3% above the 757 /mm read from the abstract, so the factor-of-ten reading survives).

### 1.3 Central wavelengths sit off the blaze (MEDIUM, presentation)

λc = 4380 Å and 6548 Å are the VPH design wavelengths (Arns abstract), and no source puts them at the CCD center. The page reports R, sampling and dispersion at λc. The red λc lies 0.45 FSR from the blaze of order 93, so the red page shows R_eff 131,140 and 3.9 px, which the pub line has to explain away. Setting λc at the blaze of the order nearest the chip center removes the problem: with the corrected echelle, order 135 (4529 Å) for the blue arm and order 93 (6575 Å) for the red arm (DERIVED from m λ = 61,146 nm).

### 1.4 Other checks of state, note and pub

- D = 8.2 m, F = 5.0, W = 600 mm, slit 0.866″, nObj 4, 9232 × 9216 × 10 µm, 3 × 1 mosaic, off-axis parabola in double pass: confirmed against the quotes in data/round5/espresso.md (ER14 Sec. 2, EST14 Table 1, EP21 Secs. 3.1.4–3.1.5, UM Secs. 3.2 and 4.3).
- Note, "γ = 4.85° inferred from the order table, which then lists blaze-center wavelengths": the inference holds only with δ = 76° and is contradicted by ES21's line tilt (Sec. 1.1).
- Note, "θ = 0": NOT FOUND in any source (the research record says so); EP21's Littrow sentence describes echelles in general.
- Pub "4.5 px per resolution element": a design value. EP21 Sec. 3.2.2 QUOTE: "the pixel sampling given in Table 3 for the individual modes refers to the value expected at the center of an extracted echelle order"; the same 4.5 px appears in the 2014 design table (EP14 Table 1). The line should say "expected (design)".
- Pub "R = 140,000": measured (UM Table 1, "Measured Resolving power 140 000"; EP21: 138,000 median from ThAr, lower limits). Same mode (singleHR). The UM 140,000 is a rounding of the EP21 median.
- Drawing: the echelle is drawn 2480 mm long (the 600 mm equivalent beam at 76°) against the real 1200 mm mosaic. The research record's alternative mapping (D = 4.1 m, F = 10, W = 300 mm) gives identical R, slit and dispersion and a 1163–1240 mm footprint, at the price of a 4.1 m telescope label.
- Spatial scale: MODEL 0.16–0.19″/px along the slit, so a 1.0″ trace is drawn 5–6 px tall; UM Table 1 gives "Spatial sampling per slice 9.0" px and ER14 Fig. 2 a 107 µm (10.7 px) design image. The APSU's 3× compression and the cross-disperser prism's 1.5× expansion are not modeled. No pub line depends on this scale.

---

## 2. UVES, standard 390 (CD#2) and 580 (CD#3) (`uvesb`, `uvesr`)

State values verified against UM117 (Tables 1.1, 2.2, 2.3, 3.1, 3.2; Secs. 2.1–2.2), D00 (pp. 536, 541–542), VLT-SPE-ESO-10000-2723 Table 3, and the pipeline physical model (PHYS, `cdbeam[2] = {45.336, 46.0}`): D 8.0 m, F 10, W 200 mm, f_col 2000 mm (DERIVED, "from 3m to 2m"), echelles 41.59 /mm at 76.0° and 31.6 /mm at 75.04°, θ = 0 ("angle of incidence and diffraction equal but in a different plane", UM117 Sec. 2.1), γ = 0.8° (D00 p. 541), CD#2 660 /mm and CD#3 600 /mm with camera–collimator angles 46.0° / 45.336° (PHYS only), cameras 360 / 500 mm, detectors 2048 × 3000 and 4096 × 4096 of 15 µm. The scored lines pass. The MODEL blue format matches the ETC390 order positions to ≤ 12 px from order 104 to 142.

Findings:

1. Blue minimum-separation line compares a different setting (LOW–MEDIUM). The pub uses UM117 Table 3.2's CD#2 row at 395 nm (38.9 px = 9.6″); the note admits the 390 setting is not tabulated. The saved ETC output for the same 390 setting (`eso_uves_etc_P116_DIC1_Blue390_CD2_slit1.0.html`, spectral-format table) puts orders 141 and 142 at y = 64 and 26 px: 38 px = 9.35″ at the ETC's 0.246″/px (DERIVED). MODEL 9.37″. Score against the ETC390 value.
2. Pixel-scale lines cite the wrong document (LOW). 0.246″/px and 0.182″/px come from the ETC ("Medium pixel scale in Y (spatial) direction: 0.246 arcsec/pix") and PHYS; UM117 Table 1.1 gives "0.25” (CD1 and CD2) 0.18”(CD3)". The src should name the ETC.
3. Measured R at 1″ exceeds the model's R_eff (MEDIUM, presentation). The scored lines use the R × slit products 41,400 / 38,700, which are geometric (D00 computes them from its Eq. for the Littrow case), so scoring them as R_s is correct. D00 Fig. 14 ("Median spectral resolution of UVES"; text: "the measured median spectral resolution as a function of slit width, averaged for two CW settings per chip (blue: 342 and 437 nm; red: 580 and 860 nm)", from "an automatic measurement of the FWHM of hundreds of ThAr lines") reads ≈ 45,000 (blue EEV) and ≈ 44,000 (red EEV and MIT) at 1.0″ (read from the plot, ±1,000). The page shows R_eff 40,577 (blue) and 37,674 (red): 10% and 15% below the measurement. The settings differ from 390/580 (averaged CW settings), so an info line is the right form. The Gaussian-fit explanation of Sec. 1.1 applies here too: a slit measured by a Gaussian fit reads up to 1/0.84 = 1.19 times the geometric R.
4. Red format: order 128 missing (LOW). MODEL order positions vs ETC580 (EEV y + 2048 + 64 px gap for the MIT chip): order 128 at y = −72 px (off chip) vs ETC y = 3 px; orders 106–128 span 2041 px vs 2015 px (+1.3%). The page's coverage starts at 4805.5 Å; the ETC's order 128 starts at 472.69 nm (−1.7% from the model). The pub "coverage from 4760 Å" passes at 1.0% because UM117 Table 3.1 rounds the setting to "476". Modeling the 64 px gap (Ny 4160) moves the format by half the gap and does not recover order 128; the residual is the 1.3% spacing excess of the CD#3 model.
5. Note wording, blue detector: "the illuminated part of the 2k × 4k CCD" is unsupported. UM117 Table 2.3 QUOTE: "2048 × 3000 (2048 × 4096, used in windowed readout)"; D00: "windowed to 2K x 3K".
6. Line tilt (LOW, drawing). D00 p. 541 QUOTE: "the spectral line tilt caused by the off-plane angle is fully corrected by a rotation of the slit by 7 degrees." The explorer does not rotate the slit, so the drawing shows lines tilted 8.0° (blue) and 6.4° (red), and the red R_s reads 1% below the Littrow formula (38,217 vs 38,597, DERIVED).
7. Open: the PHYS model puts the echelle incidence at 74.57° (red) and 75.9° (blue), 0.47° and 0.10° below the facet angles (`static double uves_ech_blaze[2] = {74.57, 75.9}`). The ETC central-column wavelengths give m λ = 61,071 nm (red) and 46,685 nm (blue), against the model's blaze 61,140 and 46,656 nm; the ETC central columns therefore sit −280 px (red) and +124 px (blue) from the model's blaze along X (MODEL). If the red chip center is 0.47° off the blaze, the red R at the chip center is lower than the facet-angle value by up to tan 74.57°/tan 75.04° = 0.968 (DERIVED).

---

## 3. MUSE WFM (`muse`)

The note states the EFFECTIVE status of f_col, f_cam, W and G correctly, and the sourced items check out: UT4 Nasmyth, 8000 mm Nasmyth pupil, 0.2″ slices, 48 × 75 = 3600 spaxels (DERIVED), refractive collimator, one VPH, e2v 4096 × 4112 with dispersion along Y (MUM Table 3, Sec. 2.1.2.5), ×2 anamorphoser along the dispersion (MUM Sec. 2.1.2.2: "a magnification of 0.5 to the beam in the horizontal direction"). A search for the MUSE spectrograph prescription (Kosmalski et al. 2011, Renault et al. 2010, BlueMUSE papers) found no open copy with focal lengths or the VPH line density; the effective values remain the best available.

Findings:

1. The page flags MUSE "undersampled" (LOW, visible). MODEL npix at λc = 1.99981 < 2, so `S.flags` carries "undersampled" and app.js displays the flag. The design slice image is 2 px (B06: "85% enclosed energy within a 15x30µm2"; C26 Eq. 1) and MUM Sec. 3.2 gives 2.5 px per resolution element. Fix: W = 66.81 mm (or any W giving npix ≥ 2.000); R changes by < 0.01%.
2. "reproduce ... the 2-px slice image": the 2 px is a design figure (B06 requirement, C26 relation), not a measurement. MUM's measured sampling is 2.5 px per resolution element.
3. R: MODEL R_s at 7000 Å 2800 vs the lab 2737 (+2%); R_eff 2497 (−9%) because a 2 px slit image takes a large pixel term in quadrature. The pub lines are info, as they should be.

---

## 4. KCWI blue, BM + Medium slicer (`kcwib`)

Verified: D 10.95 m and F 13.7 (DERIVED from the 1.375″/mm plate scale and "f/13.7 measured across the vertices", M18), slicer at the focus with no fore-optics, Medium 0.69″, W 160 mm, collimator R 4345 mm (f 2172.5 mm; app 2192 mm), camera 304.4 mm, BM 1900 /mm at α = 30° (M18 Table 2), β = 20.79° at 4500 Å (DERIVED), 15 µm pixels. Scored lines pass (0.2425 Å/px; 0.1485″/px).

Findings:

1. A measured R exists and the pub uses two nominal values (MEDIUM, presentation). M18 Table 3 ("KCWI Slicer-Grating Spectral Resolution Table": 10000 / 5000 / 2500 for BM) and the Keck configuration page (2000 / 4000 / 8000) are nominal tables with exact factor-2 steps. M18 Fig. 26 is "Laboratory-measured spectral resolution of KCWI using the small slicer" (FeAr lamp, Sec. 5.1). Read from the plot (page 27, rendered at 300 dpi): BM at 4500 Å, R ≈ 8,300 (setting centered near 4270 Å) to 8,800 (setting centered near 4620 Å). M18 Sec. 5.1 QUOTE: "The measured resolution is slit-limited for all medium and large slicer configurations, which would scale the results in the Figure by factors of 0.5 and 0.25 respectively." Medium-slicer R ≈ 4,200–4,400 (DERIVED from M18's statement). MODEL R_eff 4,200, R_s 4,312: agreement within 5%. Replace the info pair with this line (scored at ≈ 8%, the plot-reading and setting spread). The same figure gives BL at 4500 Å ≈ 3,500, i.e. ≈ 880 for the Large slicer, against the Keck page's 900.
2. The npix info line's claim "their figure leaves out the grating's anamorphic factor cos α / cos β = 0.93" is unsupported. M18 Sec. 3.6 gives "nearly Nyquist sampled at 2.3 pixels" as a predicted value without the calculation; 0.35″/0.147 = 2.38 px and × 0.927 = 2.21 px (DERIVED), so 2.3 px lies between the two and the source does not say which was used.
3. Detector orientation: the note writes "4112 × 4096"; M18 writes "4096×4112". Which axis carries the dispersion is INFERRED (0.4% effect on coverage). Minor.

---

## 5. KCRM, RL + Medium slicer (`kcrm`)

Verified: RL 530 /mm (`rho()` in kcwi_file_primitives.py: "elif 'RL' in self.grating(): ... return 0.530"), FCAM 305 listed under "parameters that should be the same for both channels" (kcwi.cfg), pipeline resolution RL λ/800 for the Large slicer halved for the Medium (`resolution()`), Keck page "RL R (central) 0.92 Å/unbinned pixel >500 >1000 >2000" and the 8950 Å sample range.

New evidence (NEW SOURCE: PypeIt, release branch commit c1798aa, saved under rawdata/presets/kcwi/):

1. `PypeIt_release_c1798aa_reid_arxiv_keck_kcrm_RL.fits`, PypeIt's RL arc-line wavelength template (a fitted wavelength solution from KCRM arcs; read with a standalone parser, never executed): 2064 rows with header `BINSPEC = 2`, 6345.77–10125.02 Å, 1.8356 Å per binned pixel at 8247 Å, so 0.918 Å per unbinned pixel (DERIVED). With G = 530 /mm the dispersion fixes f_cam / cos β = 0.015 mm / (530 mm⁻¹ × 0.918 × 10⁻⁷ mm) = 308.3 mm (DERIVED), i.e. f_cam ≈ 305 mm for β ≈ 7–9°. MODEL with f_cam 305 mm and a 4128 px spectral axis: α = 18° at λc 8248 Å reproduces the template span (6346–10125 Å) and the 2.7% change of dispersion between the chip ends (model 1.0265, template 1.0276); α = 16° gives 1.034 and α = 20° 1.020. The research rule β = α − 9° gives α = 17.2° at 8248 Å (DERIVED). The 305 mm camera and the derived α are therefore corroborated by a measured wavelength solution, which upgrades the note's "an assumption". The 0.92 Å/px line can become a test against the template's measured 0.918 Å/px.
2. The template has 2064 binned = 4128 unbinned spectral pixels. The LBNL CCDs of PFS are "4114 × 4128" (D22 Sec. 7.4, data/presets_research.md), so the KCRM chip is probably 4114 × 4128 (INFERRED; Keck says only "LBNL 4kx4k"). Nx 4128 widens the model coverage by 30 Å (7053.9–10815.1 Å).
3. `PypeIt_release_c1798aa_spectrographs_keck_kcwi.py` gives KCRM `platescale = 0.145728,  # arcsec/pixel TODO :: Need to double check this`, the same as the blue arm: consistent with a 305 mm red camera, not independent confirmation.
4. R: no measured KCRM R was found. MODEL 2,129 vs the page's ">1000" (lower limit) and the pipeline's 1,600 (an atlas convolution width). The pub lines are correctly info.

---

## Summary

### (a) Confirmed errors, ranked by severity

1. ESPRESSO echelle geometry (`espressob`, `espressor`). δ = 76° is the nominal R4 label; the echelle is a replica of the UVES red 31.6 /mm master MR160, measured at 75.04° (UM117 Table 2.2) / 75.1° (D00 Table 5; Laser Focus World 1995). The γ = 4.85° and the 755 mm camera are compensating fits: γ = 4.85° tilts the model's lines by 34°, while ES21 Sec. 3.2 measures a sub-pixel tilt across the trace. Fix: eDelta 75.04, gamma 0 (≲ 1°, value NOT FOUND), fcam 800 (design, 400 × 3000/1500). Effect: R_eff at blaze centers 131,300–133,300 → 127,400–127,600 (−4%), R_s 135k → 130k; dispersion unchanged within 1.4% and now unfitted; slit image 4.45 → 4.6–4.7 px; the scored "R = 140,000" then misses by 9% and becomes info (measured ThAr FWHM, lower limits; Gaussian-fit FWHM of a round core is 0.70 d vs the model's 0.866 d, DERIVED).
2. ESPRESSO coverage. The abstract-derived equivalent cross-disperser puts 54 / 46 orders on the chips (published 45 / 40) and the page shows 357.8–516.7 nm (blue) and 505.6–802.1 nm (red) vs 377.2–527.0 and 519.2–790.6 nm (UM Tables 7–8). Fix: fit xG and λc to the published order range: blue 782 /mm at 4520 Å, red 430 /mm at 6540 Å (with fix 1), giving orders 117–161 and 78–118.
3. ESPRESSO λc off the blaze. The red page shows R and sampling 0.45 FSR from the blaze (3.9 px). Fix: λc at the blaze of the order nearest the chip center (orders 135 and 93: 4529 Å and 6575 Å with fix 1).
4. UVES blue minimum-separation line scored against the 395 nm row of a different setting. Fix: the same-setting ETC390 value, orders 141/142, 38 px = 9.35″ (model 9.37″).
5. MUSE flagged "undersampled" on the page (npix 1.99981). Fix: W 66.81 mm; no effect on R or dispersion.
6. UVES red format misses order 128 (ETC y = 3 px) and spaces orders 1.3% wider than the ETC; coverage starts at 4805.5 Å vs the ETC's 4726.9 Å (−1.7%). The pub line passes only against UM's rounded 4760 Å.

### (b) Unsupported or misleading claims

- ESPRESSO note: "γ = 4.85° inferred from the order table, which then lists blaze-center wavelengths" (rests on δ = 76°; contradicted by ES21); "δ = 76°" (nominal); "θ = 0" (NOT FOUND).
- ESPRESSO pub "4.5 px per resolution element": an expected (design) value (EP21 Sec. 3.2.2; EP14 Table 1), not a measurement.
- UVES pixel-scale lines attribute 0.246″ and 0.182″ to the manual; the values are the ETC's (manual: 0.25″, 0.18″).
- UVES note: "the illuminated part of the 2k × 4k CCD"; the source says windowed readout.
- KCWI npix info line: "their figure leaves out the grating's anamorphic factor" (M18 gives no calculation).
- KCWI R info line pairs two nominal tables (Keck 4000, M18 Table 3 5000); the measured lab curve (M18 Fig. 26 with the stated ×0.5) gives ≈ 4,200–4,400.
- MUSE note: the 2 px slice image is a design requirement; the measured sampling is 2.5 px per resolution element.
- KCRM note: "4096 × 4096 (the exact format is not published)"; PypeIt's template implies 4128 spectral pixels (INFERRED).
- UVES page R (R_eff 40,577 / 37,674) reads 10–15% below the measured median R at 1″ (≈ 45,000 / 44,000, D00 Fig. 14); no info line says so.

### (c) Open questions for the builders

- ESPRESSO: as-built blaze angle and groove density of the 3 × 1 mosaic (Lizon et al. 2018, SPIE 10701, full text paywalled); echelle γ and θ; VPH line densities, fringe tilts and incidence angles; red camera focal length; orientation of the octagonal fibers; the function fitted to ThAr lines for the published R.
- UVES: echelle incidence at the chip center (PHYS 74.57° red, 75.9° blue vs facet 75.04°, 76.0°); whether the 0.246″/0.182″ spatial scales are measured.
- MUSE: collimator and camera focal lengths, beam size, VPH line density and angles (Kosmalski et al. 2011; Renault et al. 2010).
- KCWI: the BM grating angle used at λc 4500 Å; a measured Medium-slicer R; which CCD axis carries the dispersion.
- KCRM: camera focal length; RL fringe tilt and the incidence-angle rule the control software uses; the red CCD format (4096 or 4128 spectral pixels).

### (d) New sources saved

- `rawdata/presets/espresso/LaserFocusWorld1995_UVES_red_echelle_840mm_31.6_75.1deg.html` (UVES red echelle: 31.6 /mm, 75.1°, one 400 mm master).
- `rawdata/presets/kcwi/PypeIt_release_c1798aa_reid_arxiv_keck_kcrm_RL.fits` (measured RL wavelength solution).
- `rawdata/presets/kcwi/PypeIt_release_c1798aa_reid_arxiv_keck_kcwi_BM.fits` (BM template; 0.239 Å/px at 4326 Å, a stitched multi-setting template).
- `rawdata/presets/kcwi/PypeIt_release_c1798aa_spectrographs_keck_kcwi.py` (PypeIt KCWI/KCRM spectrograph definitions; text only, never executed).
- Refused or empty: INAF open-access copy of an ESPRESSO alignment paper (HTTP 403, Cloudflare); the Newport/MKS echelle catalog page (a JavaScript shell with no table text). A search-engine summary of that catalog lists 31.6 /mm masters at both 75° (414E) and 76° (303E, 174E); the page itself was not retrieved, so the listing is not used as evidence.
