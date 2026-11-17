# Audit S7: PFS (pfsb, pfsr, pfsn), APOGEE-N (apogee), FIRE (fire), FEROS (feros)

Auditor: Claude (Opus 5.5), 2026-11-16. No project file was edited. Model numbers come from `IX.design(toP(state))` as in validate.js (scripts in the session scratchpad, `s7/`). DERIVED marks arithmetic done here; INFERRED marks interpretation.

## Method and the new measured sources

The research records (data/round4/pfs.md, data/round5/apogee.md, data/round5/fire_feros.md) rest on design papers and web tables. For these four instruments, data-reduction pipelines publish measured wavelength solutions and trace positions, so each preset's geometry was tested against measurements:

| instrument | source (saved under rawdata/presets/) | measured quantity |
|---|---|---|
| PFS | `pfs/drp_pfs_data/drp_pfs_data_04512fe_pfsDetectorMap-081976-b3.fits`, `...-081808-r3.fits` (bootstrap maps fitted to SM3 arcs and flats, header CALIB_ID calibDate=2022-11-15); `...detectorMap-sim-{b1,r1,n1}.fits` (2D-simulator maps); commit 04512fe of github.com/Subaru-PFS/drp_pfs_data (Git LFS) | wavelength vs row and trace column vs row for 616 fibers per arm |
| PFS | `pfs/etc/pfsetc_467b127_config_PFS.20240714.dat`, `..._config_PFS.dat`, `..._etc_psf.py`, `..._etc_params.py` (Subaru-PFS/spt_ExposureTimeCalculator, commit 467b127) | the project's own spectrograph LSF model |
| APOGEE | `apogee/sdss_dr16_r12_cal_wave/apWave-{a,b,c}-24040000.fits` (SDSS DR16 SAS, `redux/r12/cal/wave/`) | per-fiber wavelength arrays, 300 fibers × 2048 px per chip |
| FIRE | `fire/pypeit/pypeit_release_magellan_fire.py` and `fire/pypeit/pypeit_release_reid_arxiv_magellan_fire_echelle.fits` (PypeIt `release` branch, commit c1798aa, 2026-11-08) | order-center positions across the chip (`order_spat_pos`, post-2016 data) and the archived wavelength solution of orders 11–31 |
| FIRE | `fire/3doptix_mks-newport_53-416E_2026-11-16.html` | catalog listing of the echelle master |
| FEROS | `feros/ceres/ceres_72a95b2_*` (CERES pipeline, github.com/rabrahm/ceres commit 72a95b2: ferospipe.py, ferosutils.py and 26 ThAr line lists `wavcals/order_08–33`) | pixel positions of identified arc lines in orders 33–58 |

The Newport catalog page (newport.com/g/custom-echelle-gratings) is a JavaScript application and returned no table to automated fetches; the search snippet and the 3DOptix aggregator page give the master as "53-*-416E 54.49 g/mm Echelle Grating with 46° Nominal Blaze Angle".

---

## 1. Subaru / PFS (pfsb, pfsr, pfsn)

### State values

| value | source | verdict |
|---|---|---|
| D 8.2, F 2.8; slitW = (√3/2) × 129 µm/(2.8 × 8.2 m) = 1.004″ | S15 Table 1: "Cable A: 129 µm / 168 µm / 189 µm"; S15 Sec. 2: "Cable A is connected to the spectrographs." | correct (virtual convention; D cancels) |
| nObj 616 | GFM count: SM3/SM4 600 science + 16 engineering; SM1/SM2 597 + 16 = 613. The b3 map holds 616 fiberIds | correct for SM3/SM4 |
| f_col = F × W = 693.5 mm (DERIVED in the research from the slit-to-collimator distance, S15 Fig. 8 caption) | measured trace spacing (new): 6.16–6.21 px per 213.93 µm slit hole near the slit center in b3 and r3, 6.15–6.20 px in the NIR simulation, so f_cam/f_col = 0.432–0.435 (DERIVED) against 300/693.5 = 0.4326 | confirmed |
| f_cam 300 mm | B14 Sec. 2 | consistent with the measured dispersion and trace spacing |
| G 711.4 / 556.7 / 569.5 /mm, α 7.2 / 9.5 / 14.9°, β 14.2 / 16.5 / 21.9° (B14 Table 1, design values; as-built values NOT FOUND in the research) | measured bootstrap maps, central fiber (hole 315), dispersion at rows 200 / 2088 / 3975: b3 0.6957 / 0.6822 / 0.6571 Å/px (model 0.6884 / 0.6814 / 0.6563); r3 0.8782 / 0.8646 / 0.8281 (model 0.8735 / 0.8612 / 0.8260); NIR simulation 0.8374 / 0.8167 / 0.7761 (model 0.8342 / 0.8146 / 0.7744). Chip coverage: b 374.75–658.63 nm (model 377.67–660.60), r 622.83–982.06 (model 625.10–982.69), NIR (simulation) 936.88–1269.80 (model 937.12–1268.96) | confirmed: dispersion within 0.1–1.0%, edges within 3 nm. The design gratings reproduce the as-built format |
| Nx × Ny 4176 × 4096 (b, r), 4088 × 4088 (NIR) | DM; the b3/r3 maps have MAXX 4095, MAXY 4175 | correct |
| psi 35, lamB1 5000 | unused for a transmission grating with tAlpha set | harmless |

The maps date from November 2022, before the 2023–2024 VPH re-orientation (T24 Sec. 2). T24 does not state that the rolled gratings keep the same dispersion geometry; the research note asserts so. A post-2024 map would settle the point.

### Note

The sentences check against S15, B14, the IPMU and Subaru tables. One display inconsistency: the note gives the camera as "300 mm f/1.09", and the page shows f/1.24, because W = 247.7 mm is the f/2.8 fiber cone (the collimated pupil is 275 mm). The design f/1.09 belongs to the 275 mm pupil.

### Pub lines

- "~0.7 / ~0.9 / ~0.8 Å/px", scored at 5%: the sources give one significant figure (implicit precision ±6–7%), so the 5% tolerance is tighter than the source. The bootstrap maps supply measured values: 0.682 Å/px at 518.9 nm (b3) and 0.865 Å/px at 805.4 nm (r3), central fiber, mid-row. The model gives 0.681 and 0.861 at the preset's λc.
- "R ~2500 / 3000 / 4500" (info): the source text is right (IPMU note 7: "As of July 2024. These are based on measurement before shipping to Subaru Telescope."). The explanation is now partly wrong. The line points to the collimator focal length ("the collimator focal length is not published and 693.5 mm is the slit-to-collimator distance"), but the measured trace spacing confirms f_cam/f_col = 0.433, so the slit-image magnification is right to <1%. The model's fiber image, 129 µm × 0.4326 × 1.023 (anamorphic) × √3/2 = 3.30 px FWHM, is wider than the table's 3.0 px for some other reason.
- PFS ETC evidence (new): the project's ETC models the spectrograph LSF as a uniform disk of "Geometric fiber image diameter" 47.0 µm (CAMERA lines, field 7 of config PFS.20240714.dat; also in the oldest config PFS.dat), convolved with a 14.1 µm rms camera Gaussian and the pixel. That disk is 16% smaller than 129 µm × 0.4326 = 55.8 µm. DERIVED: the ETC's disk ⊗ Gaussian has FWHM 3.02 px (3.09 px with the pixel), matching the table's 3.0 px. Entering a 47.0 µm image in the explorer gives R = 2485 / 3132 / 4501 against 2500 / 3000 / 4500 (−0.6%, +4.4%, 0.0%). No public source explains why the effective image is smaller than the measured magnification predicts (see open questions).
- The table is not internally consistent at the 5% level. R 2500 at 500 nm implies 2.0 Å FWHM, while the same table lists 2.1 Å.

---

## 2. SDSS / APOGEE-N (apogee)

### State values

All values check against W19 as tabulated in the research: G 1009.345 /mm (W19 Table 5 note k), α 54.061° (note j), f_col = 2107.22/2 mm (DERIVED), f_cam 356 mm (warm), three 2048-px H2RG arrays with 2.9 mm gaps (Nx = 6466), and λc 16158 Å fitted to the published edges.

Test against the DR16 apWave solution (fiber 150, MJD-58017+ frames):

| chip | measured edges (Å) | measured center, Å/px | model Å/px at that λ |
|---|---|---|---|
| c (blue) | 15141.3–15808.8 | 15485.1, 0.3262 | 0.3254 (−0.2%) |
| b (green) | 15856.2–16434.2 | 16156.0, 0.2825 | 0.2860 (+1.2%) |
| a (red) | 16471.8–16953.7 | 16724.4, 0.2355 | 0.2366 (+0.5%) |

The model's outer edges (15139, 16963 Å) fall within 9 Å of the measured edges. The measured chip gaps are 47 Å and 38 Å. The 1.2% excess at the green chip, against 0.2–0.5% at the outer chips, is a camera-distortion pattern that no single f_cam removes (f_cam 358 mm gives −0.8 / +0.7 / −0.1%). The real camera points at the Littrow direction with the arrays off-axis (W19 Table 5 notes m, q), and the explorer's ideal f tan θ camera points at the mosaic center. Replacing the room-temperature 1009.345 /mm with the cold line density 1009.524 /mm (W19 Fig. 21 legend) changes the dispersion by <0.1%.

### Note

Correct as written. "VPH 1009.345 /mm" is the room-temperature value of a 77 K instrument (cold 1009.524 /mm); the difference is negligible and could be stated.

### Pub lines

- The three scored dlpixAt lines (DR16 web "central dispersion") pass and agree with apWave. apWave gives sharper values and chip centers (15485 / 16156 / 16724 Å, 10 Å redder than the centers derived from the rounded W19 edges).
- The three info lines "0.326 / 0.282 / 0.235 Å/px at 1.54 / 1.61 / 1.66 µm" say "At the stated wavelengths the model is 1.0%, 2.8% and 5.9% finer". The model gives 0.329, 0.290, 0.249 Å/px, more Å per pixel than W19, so the model is coarser. The conclusion (the W19 values are chip-center values) is right; apWave confirms the conclusion: the measured dispersion at 15400 Å is ≈0.331 Å/px (DERIVED from fiber 150).
- "measured R = 22,500 (nominal; chip medians 22,000–23,700)", info. W19's abstract gives 22,500 as the nominal value ("R = λ/∆λ ~ 22,500"); the measured average is N15 Sec. 6.2 ("gives an average of R=22,500 for APOGEE spectra, but there are ~10–20% variations across the detectors"). Chip by chip the model is +3%, +6% and +22% above the W19 Table 1 medians (model R_eff 23,453 / 25,173 / 26,912 at the chip centers against 22,800 / 23,700 / 22,000). The model's R rises to the red, and the measured R is lowest in the red, because the measured LSF (2.01 / 2.44 / 3.14 px, M17 Table 2) widens faster than the geometric image (1.76 / 2.01 / 2.42 px).

---

## 3. Magellan / FIRE (fire)

### State values

| value | source | verdict |
|---|---|---|
| eG 54.49 /mm, δ 46° | S13 Sec. 3.2.4; catalog master 416E: "54.49 g/mm Echelle Grating with 46° Nominal Blaze Angle" (3DOptix copy of the MKS/Newport listing) | confirmed by catalog and by the measured dispersion (below) |
| θ = 0, γ = 0 (NOT FOUND) | PypeIt arc solution (new): at the center of orders 11–31 the model's dispersion agrees within −0.9% to +0.6% (order 29: −1.7%); along each order the measured velocity sampling runs 16.9 → 14.7–15.0 → 12.3 km/s/px (blue end, center, red end), and the model gives 16.9 → 14.7 → 12.4 | in-plane Littrow (θ ≈ 0) confirmed; the off-Littrow angle lies out of the dispersion plane |
| f_col 555, f_cam 176.8, 18 µm pixels | S13 Table 2; Teledyne brochure | consistent with the measured dispersion to <1% |
| λc 1.20 µm (DERIVED) | PypeIt `order_spat_pos`: order 22 sits 9 px from the chip center | confirmed |
| prisms at minimum deviation, all after the echelle | S13: prisms deliberately off minimum deviation, three passes before the echelle | known limitation; quantified below |

Measured cross-dispersion (new). PypeIt's order centers (post-2016 data) put orders 11–31 over 1767 px; the model puts the same orders over 1233 px. The ratio of adjacent-order spacings is 1.35–1.53 (1.43 for the span), with the smallest real spacing 70 px (orders 15–17, H band) against the model's 51 px.

Order centering (new, INFERRED cause). The measured mλ at the chip's center column runs from 26.205 µm (order 31) to 26.487 µm (order 11), a 1.07% spread; the model holds 26.403 µm for all orders. The real order centers therefore sit up to 151 px (order 31) and 66 px (order 11) from the model's, along the dispersion. The likely cause is the three upstream prism passes, which send each wavelength onto the echelle at a different out-of-plane angle; the explorer places all passes after the echelle. Dispersion and R change by <1%.

### Note

- "the cross-dispersion here is 1.4–1.8× too small": the measured order positions give 1.35–1.53× (1.43× over orders 11–31). The 1.4–1.8 range came from the ratio of along-slit pixel scales.
- The other note sentences check against S13 Table 2.

### Pub lines

- "12.5 km/s per pixel" (info) calls the difference from the prescription's 14.7 km/s/px "a conflict between the sources". The measured arc solution shows no conflict. The prescription is right at the order centers (14.7–15.0 km/s/px), and the sampling falls to 12.3–12.4 km/s/px at the red end of each order. The published figures describe the red end of an order. DERIVED from the model at x = +1000 px: 12.4 km/s/px, a 0.6″ slit image of 4.18 px, 0.144″/px in the spectral direction and slit-limited R = 5780. These match "50 km/s or 4 pixels", "0.15″/px in the spectral direction" and "R = 6000" (S11, S13, FWS) to 4%. At the blue end the model gives 0.177″/px, the web's 0.18″/px.
- "R = 6000 at 0.6″" (info): a design figure, as the line says. At the order center the prescription gives 5527, at the red end 5780. No measured FIRE resolving power was found.
- "orders 11–32", 22 (info): PypeIt extracts 21 orders (11–31) and skips the first 500 px of order 31. The model shows 25 orders and coverage from 7454 Å (real ≈8000 Å).
- "0.12″/px to 0.09″/px along the slit" (info): unchanged. PypeIt uses one along-slit scale of 0.15″/px for all orders (`order_platescale`), a pipeline approximation.

Suggested scored lines from the PypeIt solution: dlpixAt 0.8114 Å/px at 16501 Å in order 16 (model 0.8109); 0.5919 Å/px at 11968 Å in order 22 (model 0.5934); kmspx 14.8 at the center (model 14.74); tolerance 1–2%.

---

## 4. MPG 2.2 m / FEROS (feros)

### State values

| value | source | verdict |
|---|---|---|
| slitW 1.0″ (box, one slicer slice) at F = 1500/136 | FDR Ch. 3; K98S Table 1 ("effective 'slit' width w = D/2 = 0.120") | correct: 117.6 µm in the model |
| the 1.0″ box (no √3/2 factor) | KP98 Fig. 6 (rendered here): the two half-moons are mirrored, flat edges on opposite sides, so the summed profile has vertical edges and a FWHM equal to the full slice width (INFERRED from the figure) | convention supported |
| eG 79, δ 63.4°, θ 0, γ 0.6° | FDR Sec. 3.6, 10.10; KP98 Sec. 2 | correct; the model's slit-image tilt, 2.41°, matches KP98's 2.4° |
| f_col 1500, W 136, f_cam 410 | FDR | see dispersion test |
| LF5 55°, single pass, minimum deviation at 4623 Å | FDR Sec. 3.7; KP98 Sec. 2 | design values; see coverage |
| Nx 4096 along the dispersion | FDR, K99; CERES line positions run to px 3994 along the 4096-px axis | correct; FUM78's "shorter dimension" is wrong |

Dispersion test (new). Against the CERES line lists (orders 33–58, cubic fit per order, rms 0.01–0.02 Å), the model's Å/px at the measured center wavelength is 0.7% (order 33, 6867 Å) to 1.8% (order 58, 3910 Å) too small, the gap growing toward the blue. The camera explains the trend: KP98 Sec. 2.3, "The system uses a large CaF2 entrance lens and is optimized without lateral color correction"; FDR Sec. 3.8.2, "Lateral colour correction: none". The effective camera focal length therefore falls from ≈407 mm in the red to ≈403 mm in the blue (DERIVED). Slit-limited R does not depend on f_cam; the sampling and the cross-dispersion shrink by the same 0.7–1.8%. The measured mλ at the chip center, 22.662–22.678 µm, lies 0.1–0.2% above the model's blaze value (22.636 µm), so the real chip center sits ≈150 px redward of the blaze peak.

Coverage and order count. With the prism at minimum deviation, orders 25–63 span 1969 px, 79 px short of the chip, and the model also records orders 22–24 (coverage 3586–10,207 Å, 42 orders). No choice of λc removes the extra orders (4400–4623 Å tried). Reproducing exactly orders 25–63 needs ≈2.5–4% more cross-dispersion than the model has (DERIVED). The model's first coverage gap, 8528.6–8531.0 Å, matches the published 853.4–854.1 nm to 5 Å, and the second, 8856.6–8872.3 Å, matches 886.2–887.5 nm.

### Note

Correct as written. A sentence on the uncorrected lateral color would explain the dispersion offset.

### Pub lines

- "R = 48,000" (scored, model 46,158, 3.8%): the value is measured, but the cited KP98 is a design-stage paper written before first light ("It is planned that Feros will be fully operational at the ESO 1.52-m telescope in December 1998"). The measurement is K99: "The measured spectral resolving power of FEROS is R = 48,000 corresponding to 2.2 pixels of 15 µm." With the measured dispersion (0.04237 Å/px at 4627 Å), 2.2 px corresponds to R = 49,600 (DERIVED); the published pair is consistent to 3%.
- "coverage from 3560 Å" (scored at 2%): the tolerance (71 Å) exceeds the free spectral range of order 63 (57 Å), so the test can fail only if an order goes missing.
- "coverage to 9200 Å" (info): the explanation "the cause of the difference is not known" stands; the required 2.5–4% extra cross-dispersion could be added.
- "order spacing from ~30 px" (scored): passes, 29.3 px.

Suggested additions: first gap at 8534 Å (q gap, model 8529, tolerance 0.2%); dlpixAt 0.06265 Å/px at 6867.3 Å in order 33 and 0.04237 Å/px at 4626.6 Å in order 49 (CERES), with the lateral-color explanation and a 2.5% tolerance.

---

## Page check

No screenshot was taken. The page reads the same `IX.design` outputs computed here.

- PFS: R 2219 / 2705 / 3878 against the published 2500 / 3000 / 4500. Sampling 3.30–3.36 px, dispersion and coverage correct. Camera shown at f/1.24 against the note's f/1.09.
- APOGEE: R_eff 25,178 at λc against the measured 22,500. Coverage 15139–16963 Å is drawn continuous; the real chip gaps are 47 Å and 38 Å. Sampling 2.0 px at λc.
- FIRE: R 5323 at λc. Coverage 7454–25,138 Å with 25 orders (real ≈8000–25,200 Å, 21–22 orders). Order spacing 1.43× too small; along-slit scale 0.163″/px (real 0.09–0.12″/px).
- FEROS: R 46,158 with sampling 2.16 px. Coverage 3586–10,207 Å with 42 orders (real 356–920 nm, 39 orders), and the gap flag "coverage gaps above 8529 Å" (published 853.4 nm).

---

## Summary

### (a) Confirmed errors, ranked by severity

1. **FIRE: the note misstates the cross-dispersion shortfall and the pub lines misread the sampling figures as a source conflict.** Fix: change "1.4–1.8× too small" to "1.35–1.5× too small (1.43× over orders 11–31, PypeIt order positions)". Rewrite the kmspx and specScale lines: the arc solution gives 14.7–15.0 km/s/px at the order centers (model 14.74) and 12.3 at the red end; the published 12.5 km/s/px, 0.15″/px and "4 px per 0.6″" describe the red end of an order, and the web's 0.18″/px the blue end. Source: PypeIt `magellan_fire.py` and `reid_arxiv/magellan_fire_echelle.fits`. Effect: none on the model's dispersion (correct to <1%); the stated shortfall in order spacing moves from 1.4–1.8 to 1.35–1.53. The page's 25 orders and 7454 Å blue limit remain the visible symptom.
2. **FEROS: dispersion 0.7–1.8% too fine, growing to the blue; coverage 1000 Å too long in the red.** Fix: state in the note that the camera has no lateral-color correction (KP98 Sec. 2.3; FDR Sec. 3.8.2) and add scored dlpixAt lines from the CERES line lists; in the "hi" line, record that the model needs 2.5–4% more cross-dispersion to drop orders 22–24. Effect: dispersion −0.7% to −1.8%, R unchanged, coverage 10,207 Å against 9200 Å.
3. **PFS: the R explanation blames the unpublished collimator focal length, which the measured trace spacing now confirms.** Fix: replace the clause with the measured magnification (6.16–6.21 px per 213.93 µm hole, f_cam/f_col = 0.433) and cite the PFS ETC's 47.0 µm effective fiber image, which reproduces the published R to −0.6% / +4.4% / 0.0%. Effect on the model: none with the current convention; R would rise 14–17% if the ETC's image were adopted.
4. **APOGEE: "the model is 1.0%, 2.8% and 5.9% finer" should read "coarser"** (model 0.329 / 0.290 / 0.249 Å/px against 0.326 / 0.282 / 0.235). Effect: wording only.
5. **FEROS: the measured R = 48,000 is cited to KP98, a pre-first-light design paper.** Fix: cite K99 ("The measured spectral resolving power of FEROS is R = 48,000 corresponding to 2.2 pixels of 15 µm") and FUM78 App. A.6.4.
6. **APOGEE: "measured R = 22,500" cites W19's abstract, where 22,500 is nominal.** Fix: cite N15 Sec. 6.2 for the measured average and add the chip comparison (model +3%, +6%, +22% against the W19 Table 1 medians).

### (b) Unsupported or misleading claims

- PFS note: "camera 300 mm f/1.09" while the page shows f/1.24 (beam 247.7 mm against the 275 mm pupil).
- PFS dispersion lines: a 5% tolerance on one-significant-figure values. The bootstrap maps give 0.682 and 0.865 Å/px (b, r) for tighter tests.
- PFS research note: "dispersion geometry unchanged" after the 2023–2024 VPH roll is not stated in T24.
- FEROS "coverage from 3560 Å": the 2% tolerance exceeds one order's free spectral range.
- FIRE "R = 6000 at 0.6″": design figure; no measured FIRE resolving power was found.

### (c) Open questions for the builders

- PFS: what sets the effective fiber-image width? The trace spacing gives a 55.8 µm geometric image of the 129 µm core, while the ETC adopts 47.0 µm and the July 2024 lab R values require ≈47 µm. Which fibers (science or 80 µm engineering) and which FWHM estimator gave the pre-shipping R? Did the 2023–2024 VPH roll change α or β?
- APOGEE: the cold camera focal length and distortion map (the model is 1.2% coarser at the green chip and 0.2–0.5% at the outer chips).
- FIRE: the prism incidence angles and the out-of-plane angle at the echelle per order (needed to reproduce the 1.43× order spacing and the 1.07% spread of mλ at the chip center).
- FEROS: the as-built prism angle, the LF5 melt and the format centering that leave orders 22–24 off the chip; the camera's focal length vs. wavelength.

### (d) New sources saved (all new files; nothing overwritten)

- `rawdata/presets/pfs/drp_pfs_data/` (5 FITS detector maps, drp_pfs_data commit 04512fe)
- `rawdata/presets/pfs/etc/` (4 files, spt_ExposureTimeCalculator commit 467b127)
- `rawdata/presets/apogee/sdss_dr16_r12_cal_wave/apWave-{a,b,c}-24040000.fits`
- `rawdata/presets/fire/pypeit/pypeit_release_magellan_fire.py`, `pypeit_release_reid_arxiv_magellan_fire_echelle.fits` (PypeIt commit c1798aa)
- `rawdata/presets/fire/3doptix_mks-newport_53-416E_2026-11-16.html`
- `rawdata/presets/feros/ceres/` (28 files, CERES commit 72a95b2)
