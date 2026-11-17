# Audit S5: IMACS, LLAMAS (blue, green, red), MagE, ESI

Auditor's scratch folder (scripts, extracted text, screenshots): `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/audit/s5/`. Key scripts: `run.js` (all six presets), `imacsvar.js`, `llamasR.js`, `ordpos.js`, `esivar.js`, `esilam.js`, `magedisp.js`, `shots.js` (headless screenshots in `shots/`). No project file was edited. New downloads are listed in Section 6.

Model outputs at the presets' own settings (`IX.design(toP(state))`):

| preset | R_eff | R_s | Å/px | ″/px | range (Å) | other |
|---|---|---|---|---|---|---|
| imacs | 11,278 | 11,696 | 0.1919 | 0.1111 | 7461–9026 | α 54.90°, β 9.90°, anamorphic W′/W 1.713 |
| llamasb | 2080 | 2244 | 0.7617 | 0.306 (virtual) | 3417–4947 | α = β 28.12°, camera angle 56.2° shown |
| llamasg | 1811 | 1955 | 1.2270 | 0.306 | 4634–7099 | α = β 24.96° |
| llamasr | 1976 | 2133 | 1.6069 | 0.306 | 6771–10000 | α = β 26.93° |
| mage | 3892 | 4067 | 0.3098 | 0.3084 | 3200–10955 | orders 6–20 (15) |
| esi | 4055 | 4100 | 0.1905 | 0.1523 | 3762–10952 | orders 6–16 (11) |

---

## 1. Magellan / IMACS f/4, 1200 l/mm, 0.7″ (`imacs`)

### 1.1 State, note and pub lines checked against the sources

| item | preset | source | verdict |
|---|---|---|---|
| D, F | 6.5 m, f/11.0 | CS98N9 "focal length: 71526.4 mm"; LCOT "f/11 at the two Nasmyth locations" | OK (1998 design value; as-built scale behind the ADC/corrector NOT FOUND, but consistent with 0.111″/px) |
| f_col | 1648.46 mm (W = 149.86) | CS98N11 "focal length: 1648.46 mm (64.90 inches)" | OK as the only published value (design run #091197BR) |
| f_cam | 641.8 mm | BD03 Table 1 "Focal length 641.8 mm"; LCOTC JS "var cmfl = 641800.0" | OK |
| ψ = 45°, in the dispersion plane | 45 | LCOTC JS "var spa = 45.0 / to_deg ; // IMACS spectrograph angle" used in `Math.sin( angle - spa )` of the grating equation | OK. The in-plane geometry is confirmed independently: the eight LCOUM grating-table rows reproduce to ≤6 Å and BD03's R/0.5″ column to <1% (research, DERIVED), and LCOTC's anamorphic factor `Math.cos( angle - spa ) / Math.cos( angle )` is the model's W′/W = 1.713 |
| grating 1200 l/mm, blaze 32.7° (lamB1 9007 Å) | 32.7° | S17 Sec. 2.1 "The new 1200/32.7◦ grating acquired for this project"; S20 "blazed at 9000 Å"; LCOUM table "1200 32.2 32.18 1 8200 7400-8980 0.191" | OK, and now settled by the manufacturer: Richardson Gratings catalog (new file, p. 13, Table T2 "Plane Ruled Reflectance Gratings (continued)"): "53-*-067R 1200 900 nm 32.7° 154 x 206". The LCOUM "32.2" is a typo for 32.7. The blaze enters only the efficiency envelope, so R, dispersion and coverage are unaffected |
| tilt 32.4° → λc 8250 Å | 8250 | L18 Sec. 2.1 "a tilt angle of 32.4◦"; λc = 2 sin T cos 22.5°/G = 8250.7 Å DERIVED | OK |
| slit 0.7″ | 0.7 | S17 "Mask 1 contained 63 0.7″ × 5.0″ slits" | OK |
| detector 8192 × 8192, 15 µm | — | LCOUM "8192 x 8192 pixel mosaic ... 2K x 4K x 15-micron devices" | OK; see 1.3 for the chip gaps |
| nObj 51 | 51 | S17 Table 1 (5 masks, 249 slits), L18 Sec. 2.1 (3 masks, 187), S20 Table 1 (17 masks, 841) | Rechecked: 1277 slits / 25 masks = 51.1. Note wording "mean of 25 published dwarf-galaxy masks" is accurate |
| pub dlpix 0.19 | 0.1919 | S17 "a dispersion of 0.19 Å pix−1"; L18 Table 1 "0.19" | OK (+1.0%) |
| pub pixScale 0.111 | 0.1111 | LCOUM "a (central) scale of 0.111 arcsec per pixel"; BD03 | OK; a check of the 1998 design's internal consistency (CS98N12 lists the same 0.111) |
| pub lo 7400 / hi 9000 | 7461 / 9026 | S17 "one covering 7400 − 9000 Å targeting the Ca triplet" | Same setup as the preset (L18: "The observing setup was the same as for the spectroscopy of the Tucana III (Simon et al. 2017)"). The 7400–9000 Å is a target range for the mask, not a measured central-slit range, so the 1.5% tolerance is generous but not wrong |
| pub R ≈ 11,000, labeled "(measured)" | R_eff 11,278 | see 1.2 | UNSUPPORTED label |

### 1.2 The scored R line is not a measurement (unsupported claim)

The pub line reads `src: "Simon et al. 2017, 2020; Li et al. 2018 (measured)"`. None of the three papers says how R was obtained:
- S17 Sec. 2.1: "Both gratings produce spectra at a resolution of R ≈ 11, 000 (for a 0.7″ slit) with a dispersion of 0.19 Å pix−1."
- L18 Sec. 2.1: "producing a spectral resolution of R ∼ 11, 000 for a 0.7″ slit width"; L18 Table 1 lists "11,000" for each mask, the long slit included.
- S20 Sec. 2.1: "to produce R ≈ 11, 000 spectra from ∼ 7500 − 8900 Å".

The S17 sentence assigns R ≈ 11,000 to both gratings, and S17 used the 1200/26.7° grating in a different setup: "one covering 6300 − 7900 Å targeting Hα (primarily with the 1200/26.7◦ grating)". The model (DERIVED, `imacsvar.js`) gives R_s = 8997 for that Hα setup (λc 7100, tilt 27.46°, anamorphic 1.55) against 11,696 for the CaT setup. The LCO calculator's own slit-width formula (`var slit = skyslit * plate / ana`) gives the same geometric values. "R ≈ 11,000" is therefore a nominal, rounded figure applied to two setups whose slit-limited R differ by 30%, and no source calls the value measured. The research record already says so (round4/imacs.md: "The R values are rounded statements in the papers (no measurement method given)"); the pub line contradicts the research record.

Fix: drop "(measured)"; label the line "stated, method not given; S17 quotes the same R for the 1200/26.7° Hα setup"; score the line as q `Rs` (most likely a geometric figure) or make the line info. Effect: none on the model. The test passes either way (R_s +6.3%, R_eff +2.5%), so the line does not discriminate between geometries at the 8% tolerance.

### 1.3 Silent assumptions and research flags

- DERIVED: λc 8250.7 Å; nObj 51; anamorphic factor 0.584 (W/W′); f_col consistency checks (1648.6 mm from 9.0 px/″).
- NOT FOUND (research): as-built f_col; as-built telescope scale behind the ADC/corrector; Littrow blaze of the 150 l/mm grating (not used here); a sourced average slits per mask for general f/4 use (the 51 is from sparse dwarf-galaxy fields); a measured R with a stated method; the zero point of D11's "19.5◦ through 34.5◦" tilt range.
- Chip gaps along the dispersion are not modeled and the note does not mention the gaps. LCOUM: "The gaps between the longer sides are larger, about 1.38 mm = 18.4 arcsec (92 pixels)", and the f/4 dispersion crosses three of these (LCOUM 2.B: "running spectra across 4 CCDs and 3 chip gaps"). That is 276 px, 3.4% of the coverage; with the gaps the central-slit coverage becomes 7435–9052 Å (research, DERIVED). Low severity; worth a clause in the note.
- Note wording: "1200 l/mm reflection grating blazed 32.7° at λc ≈ 8250 Å (tilt 32.4°)" can be read as "blazed at 8250 Å". The catalog Littrow blaze is 900 nm; the in-instrument blaze peak is near 8320 Å (research, DERIVED 0.9239 × Littrow). Suggest "blazed 32.7° (900 nm Littrow; Richardson 53-*-067R), used at λc ≈ 8250 Å (tilt 32.4°)".
- Page check (screenshot `shots/imacs.png`): layout, 45° camera, lens collimator and camera, R 11,278, 0.192 Å/px, 0.111″/px, 3.68 px sampling are consistent with the sources. The "Camera focal ratio f/2.50" readout is f_cam/W′ on the expanded beam; BD03 Table 1 lists "f/2.66 (anamorphic)" for the same concept at the BD03 reference setting. Nothing to fix.

---

## 2. Magellan / LLAMAS blue, green, red (`llamasb`, `llamasg`, `llamasr`)

### 2.1 State, note and pub lines

| item | preset | source | verdict |
|---|---|---|---|
| D 6.5, F 4.0, core 110 µm → 0.873″, slit eq. 0.756″ | as stated | PG17 Sec. 3.1 "converting Magellan's native F/11 beam to an effective F/4.4"; FR20 Sec. 2.1 "95.6% of the output light falls in to the required F/4 cone of the collimator"; F20 Sec. 2.2 "110µm core" | OK (virtual convention, arithmetic checked) |
| f_col 200 mm, W 50 mm | 50 | PG17 Sec. 3.3 "simple on-axis f = 200mm sphere"; ETC llamas_green.def "F_COL 200.0", "D_BEAM 50.0" | OK (design values, 2017 concept carried into the 2024 ETC) |
| f_cam 70 mm | 70 | F20 Sec. 2.4 "(90mm vs 70mm)"; ETC "F_CAM 70.0" | OK |
| detector 2048², 13.5 µm | — | F20 Sec. 2.4 "e2v CCD 42-40 architecture (2k × 2k, 13.5µm pixels)" | OK |
| nObj 300 | 300 | F20 Sec. 3.1 "slit height of 300 fibers"; MITSPEC "4 x 300 fibers + 4 x 298 fibers" | OK |
| G 2233 / 1425 / 1070, symmetric Bragg α = β | EFFECTIVE | fitted to MITSPEC coverage "3417 – 4947 A 4634 – 7100 A 6771 A – 1 micron" | Disclosed in the name "(grating fitted)" and in the note. See 2.3 |
| ψ 35, lamB1 5000 | unused | `physics.js`: psi is "reflection only"; the slider is `only-refl` in index.html | Dead values inherited from the app default; harmless |
| pub dlpix (info) | 0.762 / 1.204 / 1.609 | pipeline arc LUT, cubic fit at pixel 1024 (DERIVED) | Correctly info. For blue the LUT's pixel 1024 is at 4070 Å, not the preset's 4222 Å (see 2.4) |
| pub "lab R 1500–2500" (info), src "pre-ship lab measurements of single fibers" | — | MITSPEC "Gray lines show measurements for individual fibers" | "pre-ship lab" is UNSUPPORTED wording, see 2.2 |

### 2.2 The R ranges are measurements, but the page does not say "lab" or "pre-ship"

MITSPEC's Spectral Resolution section says only "Gray lines show measurements for individual fibers, and the blue, green and red dashed lines indicate averages". The words "pre-ship" appear in the Throughput section and refer to the efficiency estimates: "These pre-ship estimates will be replaced by measured efficiencies on the sky following instrument commissioning." The page is dated 2024-09 (before commissioning, LCO25), so "laboratory" is a fair INFERENCE, but the pub line and research state the inference as fact. Fix the wording to "measured per fiber (MIT Specifications page, 2024-09; INFERRED pre-commissioning)".

### 2.3 New scored test available: measured R vs wavelength per arm

The three plots behind MITSPEC's ranges were not saved in round 4. They are now saved (Section 6). Each shows R vs λ for 15 groups of 20 apertures, with a linear fit printed per group (e.g. blue "y=0.8396λ + -1498.68" for Aps 141-160). Taking the median of the 14–15 group fits (excluding the one broken green fit "y=1.4661λ + -6951.77"), DERIVED in `llamasR.js`:

| arm, λ | model R_eff | measured median (group range) | model/measured |
|---|---|---|---|
| blue 4222 Å (λc) | 2080 | 2046 (1992–2129) | 1.017 |
| green 5923 Å (λc) | 1811 | 1889 (1836–1948) | 0.959 |
| red 8466 Å (λc) | 1976 | 2110 (2062–2184) | 0.936 |
| blue 3447 / 4917 Å | 1688 / 2470 | 1497 / 2575 | 1.13 / 0.96 |
| red 6836 / 9936 Å | 1587 / 2363 | 1751 / 2433 | 0.91 / 0.97 |

The fitted-grating model reproduces the measured R at each arm's center to within 7%. This is a real test (the fit used only the coverage), and the presets have no scored line at all at present. Recommend adding `RAt` lines at λc with tol 0.08 from these plots. The model's R(λ) is shallower than measured across the blue arm (1.46× vs 1.72× from end to end), a hint that the true disperser geometry (VPH grism, below) spreads β more than the symmetric-VPH fit.

### 2.4 Disperser geometry shown on the page is the fit's, and the blue band conflicts

- F20 p. 114470A-9: "The VPH gratings are implemented in-between a pair of 5mm thick fused silica plates with the prism directly bonded onto the front plate." The disperser is a VPH grism with one prism. The model is a bare VPH in air at symmetric Bragg, so the page's "Angles α = β 28.1°" and "Camera angle 56.2°" (blue; 49.9° green, 53.9° red) are artifacts of the fit, not LLAMAS's geometry. The note discloses that the "symmetric angle" is fitted, but the camera angle readout carries no caveat. The true line density is degenerate with the exit geometry: for the measured blue angular dispersion (0.762 Å/px at f_cam 70 mm), G ≈ 2235 /mm if light leaves at 28° and ≈ 2530 /mm if the light leaves near the grating normal (DERIVED, G ≈ cos β_air × angular dispersion). R is insensitive to this choice only if the anamorphic factor is near 1, which no source states. The ETC efficiency curves (saved) peak at 409, 565 and 805 nm, the Bragg wavelengths of the three gratings; the files print no line density.
- Blue coverage conflict: MITSPEC gives 3417–4947 Å, and the MIT R plots span ~3430–4900 Å, supporting the preset. The post-first-light arc LUT (llamas-pyjamas blue_peaks.csv, 15 identified lines from 3545.6 to 4657.9 Å, pixel 361–1830) puts pixel 1024 at 4070 Å, 152 Å (200 px) blueward of the preset's λc 4222 Å; this is an interpolation, not an extrapolation (cubic rms 0.24 Å, DERIVED in `arcfit.py`). Green and red agree with MITSPEC to 20–50 Å. At least one blue camera is therefore offset by ~150 Å from the published band; per-camera spread is NOT FOUND. Open question for the builders.

### 2.5 Drawing

F20 Sec. 3.3, p. 114470A-13: "Its fiber pseudo-slit, which fans out to meet the Schmidt condition, must sit inside the collimated beam at the focus of the spherical collimator mirror." PG17 Sec. 3.3: "simple on-axis f = 200mm sphere". The page draws a tilted collimator with the slit outside the beam (`shots/llamasb.png`). Hectospec and Hectochelle already use `colTilt: 0` for this geometry; LLAMAS should too. Drawing only.

### 2.6 Flags from the research

EFFECTIVE/DERIVED: G and α = β per arm, λc per arm, slit eq. 0.7557″, fiber image 2.85 px (FWHM 2.47 px), trace pitch 6.46 px, mean dispersion. NOT FOUND: VPH line density, Bragg angle, prism apex and glass, camera-collimator angle per arm; the companion optics paper (SPIE 11447-111); as-built f_col and f_cam; published Å/px; on-sky R per arm; as-built dichroic crossovers. Silent: first order (no source states the order).

---

## 3. Magellan / MagE, 1″ (`mage`)

### 3.1 State, note and pub lines

| item | preset | source | verdict |
|---|---|---|---|
| f/11.0, f_col 1094 mm, W 99.45 | — | M08 Sec. 2 "focal length of 1094 mm, giving a 99 mm collimated beam diameter at the f/11.0 focal ratio" | OK |
| f_cam 138 mm, vacuum Schmidt | 138 | M08 Sec. 2 "is placed at the prime focus of a vacuum Schmidt camera with a focal length of 138 mm" | Value OK; DRAWING wrong, see 3.3 |
| echellette 175 /mm, δ 32.3°, quasi-Littrow, θ = γ = 0 | — | M08 Sec. 2 "The 175 gr/mm reflecting grating, which is used in the quasi-Littrow configuration ... blaze angle of 32.3˚" | OK. θ = 0 is supported: model Å/px matches M08 Table 2 at the tabulated λ to ≤0.6% for orders 9–20 (`magedisp.js`), and a few degrees of θ would change the dispersion by several percent. 175.555 fits Table 2 no better (−0.6 to 0.0%) |
| prisms 46° ×2 passes + 40°, fused silica, min. deviation | — | M08 Sec. 2 "The first prism, with an apex angle of 46˚, is used in double pass and the second prism, with an apex angle of 40˚ deg, is used in single pass"; "The rotation angles of the two prisms have been adjusted" | Assumption is VALIDATED by a new source, see 3.2 |
| E2V 42-20, 2048 × 1024, 13.5 µm | — | M08 Sec. 4.1 | OK |
| λc 4150 (chosen) | — | none | Validated by PypeIt order positions (3.2) |
| note: "moved from Clay to Baade in October 2015, Rigby et al. 2018 Sec. 2.2" | — | R18 Sec. 2.2 "some observations were made after October 2015, when MagE was moved to the Baade telescope" | OK |
| note: "same f/11" | — | no source states the ratio for the Baade folded port | INFERRED (reasonable: LCOT "The principal foci are f/11") |
| pub Rs 4100 (design) | 4067 | M08 Sec. 2 "The grating provides a resolution of R=4100 for a 1 arcsec slit"; R18 "the design resolution of R ∼ 4100" | OK (+0.8% at λc 4150, −2.7% at the order-15 blaze center) |
| pub dlpixAt orders 20, 11 | 0.2313, 0.4270 | M08 Table 2 "20 3125 0.231", "11 5590 0.426" | OK |
| pub dlpixAt order 6 (info) | 0.812 | M08 Table 2 "6 9700 0.788" | Correctly info |
| pub pixScale 0.3 | 0.3084 | M08 Sec. 2 "3 pixels per arcsec"; PypeIt `platescale = 0.3` | OK |
| pub measured R 4770 (info) | 3892 | R18 Sec. 2.3 "fit each with a Gaussian ... the observations taken with the 100 slit have R = 4770 ± 8" | Correctly info; R18 also gives 2545 for 2″ vs ~2000 geometric, the same 1.2–1.3× excess seen for ESI and IFUM, which points at the Gaussian-fit method on undersampled box profiles, not at the optics |

### 3.2 New validation: as-built order positions (PypeIt)

PypeIt's MagE file (saved, line 309): `ord_spat_pos = np.array([0.316, 0.399, 0.475, 0.545, 0.609, 0.669, 0.723, 0.774, 0.823, 0.869, 0.915, 0.965])` for `np.arange(17, 5, -1)`, i.e. orders 17 to 6, as fractions of the 1024-px spatial axis (`datasec ... '[1:1024, 1:2048]'`, `specaxis = 1`). Model vs PypeIt (`ordpos.js`): order 17 at 0.314 vs 0.316, order 6 at 0.985 vs 0.965; span 6–17 is 9.28 mm vs 8.97 mm (model 3.4% stronger); adjacent spacings 1.02–1.05×. The minimum-deviation prism train and the chosen λc reproduce the as-built format to a few percent. M08 Fig. 3 (the solar spectrum with order labels) shows the same spacing pattern (46–47 px between orders 7–9, ~85 px between 17 and 18, measured from the embedded image). Recommend a scored `ySpan` line, m1 6, m2 17, value 8.97 mm, tol 0.05.

### 3.3 Drawing: the camera is a Schmidt, drawn as a lens

The page draws "camera f/1.39" as a refractive lens (`shots/mage.png`). M08 Sec. 2 and Fig. 2 describe a vacuum Schmidt with the CCD at prime focus inside the beam ("The spherical mirror is 200 mm in diameter and has a radius of curvature of 293 mm"). The explorer's `cam: "mirror"` (used for HIRES, Hectospec, Hectochelle) is the matching drawing. Drawing only.

### 3.4 Conflicts noted, no action needed

- "6.2 µm first order Littrow blaze" (M08 Sec. 2; LCOMG "6.2 micron") does not follow from 175 /mm and 32.3° (6.107 µm). M08's own Fig. 3 labels give m × λ ≈ 60,500 Å (5500 × 11, 4040 × 15, 3360 × 18; read from the figure, INFERRED as the order centers), 0.9% below the model's 61,070 Å and 2.4% below 6.2 µm. The preset does not use 6.2 µm. If the labels mark blaze centers, a cos γ of 0.991 (γ ≈ 7.5° with 175 /mm) would explain the labels; this is weak evidence and does not change R.
- The 175 /mm, 32.3° echellette is not in the 2014 Richardson catalog (the catalog's only 175 /mm ruling is "53-*-142R 175 7.6 µm 41.6°"). Whether MagE's grating is the same Milton Roy/Spectronic ruling as ESI's (175.555 /mm) is NOT FOUND.

### 3.5 Flags from the research

NOT FOUND: θ, γ; prism rotation angles; prism pass order (INFERRED from "first"/"second"); fused-silica grade (Malitson used); λ at the detector center; default binning; grating vendor. DERIVED: W 99.45; 3.24 px per 1″; 0.309″/px from the optics.

---

## 4. Keck / ESI echellette, 1″ (`esi`)

### 4.1 State, note and pub lines

| item | preset | source | verdict |
|---|---|---|---|
| D 10.95, F 13.7 | — | UCR96 Sec. 6.1 "the f/13.7 secondary"; KESP "0.725 mm/arcsec" | OK (1″ = 0.727 mm in the model) |
| f_col 2286 mm, W 166.9 | — | S02 Sec. 2.1 "focal length of 2286 mm"; UCR96 Sec. 3.1 "6.57 inches if the entire Keck aperture (from tip to tip)"; S02 "160.0-mm diameter beam" | OK; W does not affect R here |
| f_cam 308 mm, 10 elements | — | S02 Sec. 2.4 "ten lens elements in five lens groups ... effective focal length of 308 mm" | OK |
| echellette 175 /mm | 175 | S02 "Spectronics 204 × 204 mm, 175 lines/mm"; UCR96 Sec. 3.2 "175.555 lines/mm"; UCR96 Sec. 5.1.11 "a standard Spectronics (Milton-Roy) catalog item with 175.555 lines/mm"; S99 Sec. 1 "a fixed 175.6 line/mm echellette grating from Milton Roy" | ROUNDED; see 4.3 |
| prisms 2 × 50° BSL7Y, 3 passes at min. deviation | — | S02 Sec. 2.2 "two large (25 kg), 50.0◦ -angle prisms"; UCR96 Sec. 3.2 "three 50 degree prisms operating near minimum deviation" | Minimum deviation is the model's choice; the as-built format shows the assumption fails, see 4.2 |
| CCID20 4096 × 2048, 15 µm | — | KCCD "MIT-Lincoln Labs 2048 x 4096 device with 15 µm pixels" | OK |
| λc 5250 (DERIVED) | — | UCR96 Table 1 "Height (%)" column | Correct derivation, but the choice puts an extra order on the chip (4.2) |
| pub Rs 4000 (geometric) | 4100 | KECH Table 2 "1.00_arcsec 6.49 74.6 4000" (= slit px × 11.5 km/s/px) | OK, correctly scored as Rs |
| pub dlpixAt orders 15, 11, 7 | +1.3, +0.9, +0.6% | KQR wavelength solutions | OK (improves with 175.555, 4.3) |
| pub ySpan 6–15 (info) | 23.0 vs 25.3 mm | UCR96 Table 1 | Correctly info; now corroborated by the as-built PypeIt positions (4.2) |
| pub minSepArcsec 22″ | 20.9″ | S02 "The minimum order separation is 22.′′ 0" | Passes, partly by compensation: the model's 137 px separation (as-built 143 px) is converted with the central 0.152″/px; the orders involved (7–9) have 0.153–0.163″/px measured |
| pub pixScaleAt order 11 (info) | 0.154 vs 0.144 | KQR | Correctly info |

### 4.2 The page shows 11 orders and coverage from 3762 Å; ESI has 10 orders from 3900 Å (confirmed error)

The page (`shots/esi.png`) shows "Orders 6–16", "λ range 3762–10,952 Å", and order 16 drawn at the bottom of the detector. The sources:
- KOV: "In echelle mode there are ten orders on the CCD with complete wavelength coverage from 3900 Å to 10900 Å".
- KECH: "orders 6 through 15 of the cross-dispersed spectrum fall on the CCD".
- S02 Sec. 1.1: "This mode disperses the light from the 20.′′0 slit into 10 orders, from order 6 in the red to order 15 in the blue."

Cause: the model's cross-dispersion is 8.5% too weak. PypeIt's ESI file (saved, line 404) gives the as-built order centers, `return np.array([0.115, 0.245, 0.362, 0.465, 0.558, 0.642, 0.719, 0.791, 0.861, 0.933])` for `np.arange(15, 5, -1)`, as fractions of the 2048-px spatial axis (`specaxis = 0`). Orders 6 and 15 are 25.13 mm apart, matching the UCR96 design's 25.34 mm (86% and −79% of the half-chip); the model gives 23.00 mm (`ordpos.js`). Adjacent spacings are 0.86–0.98 of the as-built values, worst in the blue (orders 15–14: 230 vs 266 px; 14–13: 209 vs 240 px). Order 15 sits at 0.160 of the chip in the model vs 0.115 as built (92 px), which leaves room for order 16 at 0.036. The along-slit scale shows the same deficit: model 0.144 (order 15) to 0.164 (order 6) vs measured 0.120 to 0.168 (KQR, "Due to variable anamorphic magnification the scale along the slit varies with order", KECH). Both the larger cross-dispersion and the 1.4× scale variation indicate prisms well away from minimum deviation; their incidence angles are NOT FOUND.

Effect: none on R or dispersion. Coverage: the page claims 3762 Å for the blue end against the published 3900 Å, and one order too many. Fixes, in order of preference:
1. If the app gains a prism incidence-angle parameter, set the angles to reproduce the PypeIt positions (the model then also gets the along-slit scales).
2. Stopgap: λc 5600 Å gives orders 6–15 only and coverage 3928–10952 Å (`esilam.js`), at the cost of order 6 sitting at +70% of the half-chip (as built +87%). The note must then say why λc departs from the design derivation.
3. At minimum: add a `nOrders` pub line (value 10, KOV/KECH/S02) reported as a miss with this explanation, and state in the note that the model shows an eleventh order.

### 4.3 Groove density: 175.555 /mm is sourced and fits the dispersion better (minor error)

UCR96 gives 175.555 /mm twice (Sec. 3.2 and Sec. 5.1.11, "a standard Spectronics (Milton-Roy) catalog item"), S99 rounds to 175.6, and S02 rounds to 175. UCR96 Table 1's on-blaze wavelengths (m × λ = 60,870–60,880 Å) correspond to 175.555 at γ = 0. Against the nine KQR per-order solutions the model's Å/px residual falls from mean +0.91% (175) to +0.34% (175.555) (`esivar.js`). Effect: R_s 4100 → 4113 (+0.3%), dispersion −0.32%, blaze m × λ 61,069 → 60,876 Å. Fix: eG 175.555, and the note's "175 /mm" to "175.555 /mm (UCR96; S02 rounds to 175)". The 2014 Richardson catalog does not list this ruling, so the 1996 design report is the most precise source available.

### 4.4 Flags from the research

NOT FOUND: γ and θ ("a few degrees", "nearly in Littrow"); prism incidence angles; Epps & Miller 1998 and Sutin 1996/1997 (the latter has the slit-tilt plots, S02); a line-width measurement of R (P01's "FWHM ≈ 45 km/s" at 0.75″ has no method and is 24% sharper than geometric); default binning; default slit. DERIVED: W 166.9 mm (project convention; S02 says 160.0); λc 5250 Å; 0.1535″/px; BSL7Y Sellmeier fit. Silent: the first prism pass is placed after the echelle in the model (equivalent for an ideal system); γ = 0 (a few degrees of γ changes R by <0.5% and tilts the slit images, which the page would show).

---

## 5. Page check summary

Headless screenshots of all four instrument pages are in `shots/` (server on port 8847, stopped afterwards). Beyond the known app-wide items in the brief, the page-level findings are: ESI's eleventh order and 3762 Å blue end (4.2); LLAMAS's camera-angle and α = β readouts that belong to the fit (2.4); MagE's Schmidt camera drawn as a lens (3.3); LLAMAS's on-axis collimator drawn tilted with the slit outside the beam (2.5). IMACS shows nothing unsupported.

## 6. New sources saved (new files only)

- `rawdata/presets/imacs/Richardson_Gratings_catalog_2014_vogel-host.pdf`: Richardson Gratings catalog "Diffraction Gratings for OEM and Scientific Applications" (PDF created 2014-12-29, 34 pp.), from https://p7f.vogel.de/companies/62/84/6284b2408a15a/0500-richardson-gratings-catalog2-1-.pdf. p. 13, Table T2: "53-*-067R 1200 900 nm 32.7° 154 x 206" (IMACS CaT grating); Table T2 also lists "53-*-142R 175 7.6 µm 41.6°" (the only 175 /mm ruling). The MKS/Newport catalog URL returned HTTP 403 (automated access refused).
- `rawdata/presets/llamas/mit_llamas_specifications_llamasb_R_2024-09.png`, `..._llamasg_R_2024-09.png`, `..._llamasr_R_2024-09.png`: the R vs λ plots of the MIT Specifications page (https://sites.mit.edu/llamas/files/2024/09/llamas{b,g,r}_R.png), 15 aperture groups per arm with printed linear fits.
- `rawdata/presets/llamas/github_rasimcoe_llamas-etc_6c3b1e0/vph_wasach_{blue,green,red}_eavg.txt`: the as-built VPH efficiency curves the ETC uses (COATINGS/VPHG/ at commit 6c3b1e0); peaks at 409.2, 565.2 and 804.6 nm; no line densities.
- `rawdata/presets/mage/github_pypeit_PypeIt_c1798aa_magellan_mage.py.txt` and `rawdata/presets/esi/github_pypeit_PypeIt_c1798aa_keck_esi.py.txt`: PypeIt spectrograph definitions at commit c1798aa8 (release branch, 2026-11-08; files last changed 2026-10-16 and 2025-10-09), saved as .txt. Used: `order_spat_pos`, `orders`, `order_platescale`, `platescale`, `datasec`, `specaxis`.
- Searched without result: the LLAMAS VPH prescriptions (no later paper with an open copy; the old www.mit.edu/~rsimcoe/llamas/instrument.html page redirects to a 404 and has no Wayback snapshot); the ESI prism incidence angles (the UCO/Lick Kona 1998 prism-mounting paper is mechanical; the PostScript text did not convert cleanly and was not saved).

---

## 7. Summary

### (a) Confirmed errors, by severity

1. ESI shows 11 orders (6–16) and coverage from 3762 Å; KOV, KECH and S02 give 10 orders (6–15) from 3900 Å. Cause: minimum-deviation prisms give 8.5% too little cross-dispersion (orders 6–15 23.0 mm apart vs 25.13 mm as built, PypeIt `order_spat_pos`; 25.34 mm in the UCR96 design) and too little along-slit scale variation (0.144–0.164 vs measured 0.120–0.168″/px). Fix: prism incidence angles fitted to the PypeIt positions if the app gains such a parameter; otherwise λc 5600 Å (orders 6–15, 3928–10952 Å) with a note, or at least a scored `nOrders` = 10 reported as a miss. Effect: coverage blue end 3762 → 3928 Å; R and dispersion unchanged.
2. IMACS's scored R line is labeled "(measured)"; S17, L18 and S20 give no method, and S17 assigns the same R ≈ 11,000 to the 1200/26.7° Hα setup, whose geometric R is 9000 (vs 11,700 for the CaT setup). Fix: drop "measured", label the value as stated and nominal, score as `Rs` or info. Effect on the model: none (passes at +2.5% R_eff, +6.3% R_s).
3. ESI groove density: 175 /mm is S02's rounding of the catalog ruling 175.555 /mm (UCR96 Secs. 3.2 and 5.1.11; S99 175.6). Fix eG 175.555. Effect: R +0.3%, dispersion −0.32%, KQR residuals mean 0.91% → 0.34%.
4. LLAMAS page readouts "α = β 28.1°" and "Camera angle 56.2°" (49.9°, 53.9°) describe the bare-VPH fit; the disperser is a VPH grism with a prism bonded on the front plate (F20 p. 114470A-9). Fix: caveat in the note. No effect on R (fitted dispersion).
5. Drawings: MagE's vacuum Schmidt camera drawn as a lens (set `cam: "mirror"`; M08 Sec. 2, Fig. 2); LLAMAS's on-axis spherical collimator drawn tilted with the slit outside the beam (set `colTilt: 0`; F20 Sec. 3.3, PG17 Sec. 3.3).
6. IMACS: the three 92-px chip gaps along the dispersion (3.4% of coverage) are neither modeled nor mentioned; the note's "blazed 32.7° at λc ≈ 8250 Å" reads as an 8250 Å blaze.

### (b) Unsupported claims

- IMACS pub R "(measured)" (above).
- LLAMAS pub src "pre-ship lab measurements of single fibers": MITSPEC says "measurements for individual fibers"; "pre-ship" is in the throughput paragraph. INFERRED at best.
- MagE note "same f/11" after the move to Baade: INFERRED (no MagE source states the Baade port ratio).
- LCOUM's "1200 32.2" blaze (not used by the preset, but quoted in the research as a conflict): the Richardson catalog settles the blaze as 32.7°.

Confirmed as correct (checked, no action): IMACS ψ = 45° in the dispersion plane (LCOTC JS, table reproduction, anamorphic factor); IMACS 1200/32.7° blaze (now catalog-sourced); MagE cross-dispersion and λc placement (PypeIt order positions within 3.4%); MagE θ ≈ 0 (Table 2 dispersions to ≤0.6%); LLAMAS fitted model R at the arm centers within −6% to +2% of the newly saved measured R(λ) curves, a test worth scoring.

### (c) Open questions only the builders can answer

- LLAMAS: VPH line density, Bragg angle, prism apex and glass, and camera-collimator angle per arm; why the pipeline's blue arc LUT puts the chip center at 4070 Å against the published 3417–4947 Å band (per-camera spread?); whether the R(λ) curves are lab arc measurements.
- ESI: as-built incidence angles of both prisms (both passes of prism 1) and the out-of-plane angle γ.
- MagE: γ and θ; prism rotation angles; the grating's exact ruling (175 or the ESI catalog's 175.555 /mm) and what "6.2 µm" refers to.
- IMACS: the as-built collimator focal length and slit-plane scale behind the ADC/corrector; any measured line width for the 1200/32.7°, 0.7″ setup.

### (d) New sources saved

Richardson Gratings catalog 2014 (imacs/); MIT LLAMAS R-vs-λ plots ×3 and the ETC VPH efficiency curves ×3 (llamas/); PypeIt `magellan_mage.py` (mage/) and `keck_esi.py` (esi/) at commit c1798aa8, saved as .txt.
