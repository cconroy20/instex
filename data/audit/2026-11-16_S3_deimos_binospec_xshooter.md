# Audit S3: Keck/DEIMOS, MMT/Binospec, VLT/X-Shooter (UVB, VIS, NIR)

Presets audited: `deimos`, `binospec`, `xshuvb`, `xshvis`, `xshnir` (web/presets.js lines 284–299, 346–361, 468–501). No project file was edited. Model runs use web/physics.js through the same `toP` mapping as validate.js; the scripts are in `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/s3/` (run.js, deimos.js, bino.js, xsh_pm.js, xsh_pos.js, gfit.py, gfit2.py, readcfg.py). Labels: SOURCED (quoted), DERIVED (arithmetic or a model run), INFERRED (interpretation). No headless screenshot was taken; the page check below uses the model outputs that the page displays (S.c, S.range, S.orders, S.flags).

Model outputs of the presets as they stand:

| preset | R (eff) | Rs | npix | Å/px | ″/px | coverage (Å) | orders | flags |
|---|---|---|---|---|---|---|---|---|
| deimos | 6295 | 6511 | 3.79 | 0.3240 | 0.1192 | 6673–9294 | 1 | none |
| binospec | 3384 | 3532 | 3.35 | 0.6114 | 0.2439 | 6000–8497 | 1 | none |
| xshuvb | 4514 | 4556 | 7.30 | 0.1246 | 0.1396 | 3200–9655 | 23–8 (16) | "coverage gaps above 7022 Å" |
| xshvis | 7689 | 7772 | 6.86 | 0.1333 | 0.1346 | 5539–13414 | 29–12 (18) | "coverage gaps above 12968 Å" |
| xshnir | 4817 | 4959 | 4.14 | 0.7079 | 0.2172 | 10410–24910 | 25–11 (15) | none |

## 0. Cross-cutting finding: the measured resolving powers use other width definitions

The model's R is λ over the true FWHM of a geometric boxcar slit image (with diffraction and one pixel in quadrature). The measured resolving powers quoted for these instruments are built from fitted or second-moment line widths, which for a boxcar-dominated profile come out 12–30% narrower than the true FWHM. Once the definitions are matched, the presets reproduce the measurements to 0.4–5%. This one effect explains the X-Shooter R misses (14–16%), the Binospec "R 4200" line (27%), and a 22% gap for DEIMOS with its operational 1.0″ slit.

- Binospec (definition SOURCED). F25 Sec. 7.2: "We measured spectral resolution ... by fitting a high-resolution Solar spectrum against high signal-to-noise twilight flats using a Gauss-Hermite representation of the spectral line-spread-function (LSF)", and the quoted pairs obey R = c/(2.355 σ_inst): "R = 7000 (σinst = 18 km s−1)", "R = 5, 300 ((σinst = 24 km s−1 )". F19 Fig. 51 (p. 40) plots σ_inst with an R axis on the same relation (the R = 3000 tick sits at σ ≈ 42.5 km/s; 299792/(2.355 × 42.5) = 2995, DERIVED).
- X-Shooter (definition not stated). ESO's xsh_wavecal page (saved, see Sec. 4): "the line profiles in dispersion direction are fit at different positions along the slit to derive their positions and FWHM." The fitting function is not named. ESO QC (saved): "The spectral resolution (= resolving power) reported by the xshooter pipeline was biased by about 19% (1x1 binning UVB 1.0x11) and 15% (1x1 binning VIS 0.9x11) arc frame calibrations from begin of operations on. The pipeline arc frame recipe underestimated the spectral resolution." The quoted R values therefore depend on the measuring method at the 15–20% level.
- DEIMOS (definition not stated). N13 Table 2 footnote: "∆λ is the FWHM of an OH night-sky line."

DERIVED test (gfit.py, gfit2.py): a boxcar of width w, convolved with a Gaussian PSF of FWHM 0–2.5 px and integrated over pixels, has a least-squares Gaussian-fit FWHM of 0.83–0.88 w (for w = 7.3 px, 0.84–0.88 w) and 2.355 × rms = 0.68–0.77 w.

| case | model boxcar (px) | model R (FWHM) | model width on the source's definition | published |
|---|---|---|---|---|
| X-Shooter UVB 1.0″ | 7.30 | 4514 | Gaussian fit 6.14–6.40 px → R = Rnpix/FWHM = 5200–5420 | 6.2 px, R 5400 (XUM24 Table 13); 5440 ± 14 observed (ESO QC) |
| X-Shooter VIS 0.9″ | 6.86 | 7689 | Gaussian fit 5.78–6.06 px → R 8800–9230 | 5.7 px, R 8900 |
| X-Shooter NIR 0.9″ | 4.14 | 4817 | Gaussian fit 3.54–4.06 px → R 5050–5800 | 3.6 px, R 5600 (V11 Table 4: 4.0 px) |
| Binospec 1″ at Hα | 3.38 | 3069 | σ = 29.7 km/s (boxcar w/√12 plus the 1.24–1.28 px RMS image diameter of F19 Sec. 2.4.2) → c/(2.355σ) = 4285; 4709 without image blur | R 4200, σ ≈ 30 km/s (F25; F19 Fig. 51) |
| DEIMOS 1.0″ at 7800 Å | 5.15 | 4581 | 2.355 σ (boxcar plus the 2.1 px point-source FWHM of N13 Table 2) = 1.33 Å → R 5890 | FWHM 1.29–1.39 Å, R 5900 (N13 Table 2) |

With the PSF set to 1.5–2 px (INFERRED; no X-Shooter PSF number was sourced), the X-Shooter Gaussian-fit R values are 5280, 8965 and 5580, within 2.2%, 0.7% and 0.4% of Table 13. The Binospec σ line also tracks F19 Fig. 51 across the band (model σ 36.6, 29.7, 24.4 km/s at 530, 656, 800 nm; the figure's 600 gpm curve reads ≈38, ≈30, ≈25 km/s there, read by eye). For DEIMOS the second-moment width fits N13 and a Gaussian fit (1.49 Å, R 5240) does not, so the two surveys need not share one definition.

Consequence for the app: the page's R for slit spectrographs runs 15–25% below the "R" in observatory tables for a reason no preset parameter can fix. The note or the R readout should say so, or the app could show a second, fitted-width R. MOSFIRE's info line (measured lines 2.74–2.88 px vs a 2.92 px geometric image) shows the same effect at a smaller level and is outside this audit.

## 1. Keck II / DEIMOS (`deimos`)

### 1.1 State values

| value | preset | verdict |
|---|---|---|
| D 10.95 m, F = 86.50/6.33 = 13.665 | as set | SOURCED (KDSPEC Table 1 "Beam diameter 6.33 in for 10.95 m primary"). DEEP2 `initdeimos.pro` plate scale 0.7253 mm/″ gives f_tel = 149.6 m and F = 13.66 (DERIVED); consistent. |
| f_col 2197.1 mm (86.50 in) | W × F | SOURCED (KDSPEC; DEEP2 `sysinit.pro` "coll_zdst ... default 2197.1"). |
| f_cam 381.0 mm (15.00 in) | 381.0 | SOURCED (KDSPEC). The calibrated DEEP2 optical model uses 382.0 mm: `sysinit.pro` "if n_elements(cam_foc) eq 0 then cam_foc=382.00 ;382.73 ;382.75", and PypeIt `DEIMOSOpticalModel` "382.0, # Camera focal length in mm (sys.CAM_FOC)". Effect (DERIVED): Å/px 0.3240 → 0.3232 (−0.25%), coverage 6676.5–9290.4 Å. Negligible; worth a mention in the research record. |
| G 1200 /mm | 1200 | PypeIt `get_grating`: "if abs(ruling-1200) < 0.5: ruling = 1200.06". Effect < 0.01%. |
| psi 44.451° in the dispersion plane | as set | SOURCED (KDGINFO Notes "Spectrograph angle is 44.451 deg"); the plane is settled by data/layout/deimos.md (grating tilt, tent fold and camera tilt all in the y–z plane). Confirmed. |
| lamB1 7500 Å | 7500 | Now SOURCED three ways, and the Keck gratings page's 7760 Å is the outlier: N13 Table 2 "Grating 1200 l mm−1, gold-coated, 7500 Å blaze"; KDSPEC "1200 l/mm (7500 Å blaze; gold-coated)"; Richardson 2014 catalog (rawdata/presets/m2fs/Richardson_Gratings_catalog_vogel.de_mirror_fetched2026-11-16.pdf, Table T2 "Plane Ruled Reflectance Gratings", p. 10) "53-*-360R 1200 750 nm 26.7° 154 x 206", with the column header "Nominal Blaze Wavelength (1st Order Littrow)". The Littrow convention matches physics.js `lamB`. Blaze moves only the efficiency (0.942 at λc with 7500, 0.965 with 7760). |
| slitW 0.75″ | 0.75 | SOURCED as the 1995/1999 design nominal (KDGINFO "The slitwidth is 0.75\" on sky"; KDPRED "0.75 arcsec nominal"). The as-built page says "Design slit widths 1.0 arcsec nominal, 0.5 arcsec good seeing" (KDSPEC), and DEEP2 used "Slit width 1.0″" (N13 Table 2). The preset name states 0.75″, so this is a choice, but the measured R in the literature is for 1.0″ (Sec. 0). |
| nObj 129 | 129 | SOURCED (N13: 52,989 spectra / 411 masks, DERIVED). F03 Fig. 1: "One hundred thirty-three slitlets are included in the mask." |
| Nx = Ny = 8192, 15 µm | as set | SOURCED. N13 Table 2 adds "Blue-red gap in spectral direction 7 px", which the research listed as NOT FOUND. The note's "(CCD gaps not modeled)" is correct; the 7 px value can now be cited. |
| layout (fold 313°, 0.73, 2443 mm, colTilt −2.8°, gFlip) | drawing only | Covered by data/layout/deimos.md; not re-audited. |

### 1.2 Note

The factual statements agree with KDSPEC and KDGINFO. "blaze 7500 Å, the value consistent with the listed 26.7° blaze angle" is an inference where direct sources now exist; cite N13 Table 2, KDSPEC and the Richardson listing instead.

### 1.3 Pub lines

- The four scored lines (0.324 Å/px, 6673 Å, 9294 Å, 3.79 px) all come from KDGINFO, "Compiled by S. M. Faber, November 2, 1995", a design calculation made with the same 15.00 in camera and 44.451° angle the preset uses. The model reproduces the four values to 0.0% because the test repeats the grating-equation arithmetic (KDGINFO's own definition: "slit_width_eff [Å] = (slit_width ["] / 0.1185 ["/pix]) x (disp [Å/pix] / anamor)"). The lines are labeled with the source but should say "design calculation", and at least one measured line should be scored.
- Measured values available in saved files and not used by the preset:
  - N13 Table 2 (DEEP2, 1200 l/mm, central wavelength 7800 Å, 1.0″ slits): "Dispersion 0.33 Å px−1"; "Typical spectral range 6500-9300 Å"; "FWHM of sky line in spectral direction 1.29-1.39 Å; center best, worse at detector edges"; "Spectral resolution R ≡ λ/∆λ =5900 at 7800 Å"; "Spectrograph image quality, point source 2.1 px (field center), 2.7 px (corners)"; "Detector scale 0.1185″ px−1". N13 text: "The 1.0″ slitwidth used for all targets yields OH skylines with a FWHM of ∼ 1.3 Å". Model at λc 7800 Å: 0.3248 Å/px (+1.6% vs the rounded 0.33), coverage 6472–9098 Å.
  - F03 (Faber et al. 2003, saved as faber2003_spie4841_deimos_integration_testing.pdf), p. 1657: "The highest working spectral resolution in the red is R ≈ 6000 using a 1200-line grating, a dispersion of 0.33 Å per pixel, and a slit width of 0.75″". Fig. 1 caption (1200-line night-sky spectrum, 7100–8900 Å): "The FWHM of the spectral lines is 4 px, or 1.3 Å." The caption does not give the slit width. The preset's effective FWHM at 8000 Å is 1.27 Å = 3.92 px (DERIVED), a 2% match if the slit was 0.75″.
- With slitW = 1.0″ (DEEP2's slit) the model gives R 4581 at 7800 Å, 22% below N13's 5900; the second-moment width reproduces N13 (Sec. 0).
- "0.1185″/px": model 0.1192 (+0.6%); confirmed.

### 1.4 Page check

R 6295, 0.324 Å/px, 6673–9294 Å, 3.79 px per slit image: these match the 1995 design table for a 0.75″ slit. A builder would ask which slit the R refers to: with the as-built nominal 1.0″, the page would show R ≈ 4600–4800, below the published "R≈6000" (KDHOME) for the definitional reason of Sec. 0.

## 2. MMT / Binospec (`binospec`)

### 2.1 State values

| value | preset | verdict |
|---|---|---|
| D 6.5 m, F 5.3 | as set | SOURCED (F25 "the f/5.3 input focal ratio expected by Binospec"; 0.167 mm/″ × 206265/6500 = 5.30, DERIVED). |
| f_col 1097, f_cam 404 mm | as set | SOURCED (F19 Sec. 2.1). |
| W = 1097/5.3 = 207.0 mm | 207 | DERIVED; F19 says "~208 mm". The note writes "beam 207 mm" as if published. Trivial; write "~208 mm (F19)". |
| psi 45° in the dispersion plane | 45 | SOURCED (BDS08 Sec. 1.3 "Binospec's camera-collimator angle is 45º"; F19 Table 1 "45° fold – mirror or diffraction grating"). The MMTB table rows give α − β = 44.95–45.04° (research, DERIVED), so the angle is in the dispersion plane. Confirmed. |
| G 600, m 1, AOI 36.1°, lamC from AOI | 7241.4 Å | SOURCED (MMTB "600 1 16.0 36.1 1.22 6000-8480 0.61 3.32 3590 2490"). |
| blaze 16.0° | lamB1 = 9188 Å (Littrow) | SOURCED (MMTB; BDS08 Table 1). BDS08 Sec. 1.3 adds: "gratings that were ruled for Hectospec ... The grating blaze shown is for these existing master gratings." The Hectospec research gives that instrument's 600 gpm grating as "blazed at 6000 Å" (Littrow 10.4°, DERIVED), and F05 mentions a later "600 line grating blazed in the red". The Richardson 2014 catalog (Table T2, p. 11) lists 600 g/mm masters at 13° (750 nm), 13.9° (800 nm) and 17.5° (1 µm), none at 16.0°. Unresolved; affects the efficiency curve only. |
| Nx 4096 (dispersion) × Ny 4112, 15 µm | as set | SOURCED (F19 Table 7 "Imaging Rows 4112 ... Imaging Columns 4096"; MMTF "redder towards high x on side B"). |
| slitW 1″ | 1 | SOURCED (MMTB longslit widths). |
| nObj 150 | 150 | A capacity: MMTB "Each slit mask can hold over 150 slitlets", one mask per beam. KAR20: "120 − 150 targets using both masks" in maximal packing, which reads as 60–75 per detector (INFERRED; the research flagged the wording as ambiguous). The page shows 150 traces per CCD, twice the one survey number found. Minor. |

### 2.2 Note

The statements agree with F19, F25, BDS08 and MMTB apart from the "beam 207 mm" rounding above.

### 2.3 Pub lines

- 0.61 Å/px (model 0.6114), 6000 Å (6000.4), 8480 Å (8497.3), 3.32 px (3.354), 0.24″/px (0.2439): pass. These MMTB numbers are computed table values ("“Approx total coverage” is about 4096 pixels * A/pix"; "The resolution listed is a FWHM (R = lambda/dlambda)"), so the tests check geometry, as for DEIMOS. F19 Sec. 2.4.2 gives a measured counterpart: 0.5″ slits "produce slit images of 2.2 to 2.3 pixels (~34 µm or 0.55ʺ) FWHM", compared with a geometric 1.68 px (DERIVED), the excess being image blur.
- "R 4200 measured at Hα (1″ longslit)", info, src "Fabricant et al. 2025 (vs ~3240 implied by the table)": the line compares unlike quantities. F25's R is c/(2.355 σ) from Gauss-Hermite fits (Sec. 0); the model's RAt is λ/FWHM. On F25's definition the model gives 4285 at Hα in the 36.1° setting and 4224 in an Hα-centered setting (α = 34.80°), 2.0% and 0.6% above 4200 (DERIVED, bino.js). The research's conflict entry ("the measured value is ~30% higher") and the src text's "vs ~3240 implied by the table" misread the definition and should be replaced. The F25 sentence also gives no central wavelength for the longslit measurement.

### 2.4 Page check

R 3384 at 7241 Å, 0.611 Å/px, 6000–8497 Å, 3.35 px: these agree with MMTB. A Binospec user comparing with "R ∼ 4200 at Hα" or with F19 Fig. 51 would find the page 25–30% low; the cause is the definition, and the note does not say so.

## 3. VLT / X-Shooter (`xshuvb`, `xshvis`, `xshnir`)

### 3.1 New primary source: ESO's fitted physical-model configuration

The ESO pipeline's static calibration package xsh-calib-1.2.0 (saved, Sec. 4) holds the X-Shooter physical-model configuration tables `xs_{uvb,vis,nir}_def_{oct09,com4,aug10}.fits`, and the ESO document VLT-MAN-ESO-14650-5000 (Bristow, "X-Shooter Physical Model DRS Pipeline Implementation", Issue 0.9, 2010-04-26; saved) defines the parameters: "slit_scale (mm/arcsec) Conversion from angular position to physical position on the slit", "fcol (mm) Focal length of collimator", "fdet (mm) Focal length of camera", "sg (mm−1) Grating spacing", "mup1 (deg), nup1 (deg), taup1 (deg) Orientation of primary prism entrance surface", "mup2 ... Orientation of primary prism exit surface". The parameters are optimized to arc and nine-pinhole data ("Rays passing the entrance slit plane at a given position are focused by a collimator with a focal length that is an optimisable parameter"). Values from the aug10 tables (oct09 and com4 agree to 0.1%, except NIR slit_scale 0.5313–0.5357):

| arm | slit_scale (mm/″) | fcol (mm) | fdet (mm) | sg (/mm) | nug (°) | mug (°) | prism surfaces (°) |
|---|---|---|---|---|---|---|---|
| UVB | 0.24319 (4.112 ″/mm) | 631.84 | 261.67 | 181.668 | −42.119 | −1.381 | mup1 −47.496, mup2 59.570 |
| VIS | 0.25278 (3.956 ″/mm) | 621.40 | 276.05 | 99.486 | −54.098 | −1.656 | mup1 −48.783, mup2 49.289 (cmup1 −19.957) |
| NIR | 0.52266 (1.913 ″/mm) | 1020.05 | 175.42 | 55.734 | −46.653 | −1.737 | 25.851/−35.290, 28.126/−21.783, 28.390/−22.215 |

The parameters are fitted jointly and partly degenerate (sg trades with fdet and the grating angles), so individual values are not measurements of single components. Uses in this audit:
- Prism orientation (a silent assumption): physics.js sets each prism at minimum deviation for λc. If mup1/mup3/mup5 are the entrance-face incidence angles (INFERRED from the definitions), they lie within 0.1–0.8° of the minimum-deviation incidence at λc (UVB silica 47.25° vs 47.50; VIS SF6 47.95 vs 48.78; NIR Infrasil 25.75 vs 25.85; ZnSe 27.84 vs 28.13 and 28.39; DERIVED with the preset glasses), and mup2/mup4/mup6 lie within 0.2–0.6° of the nominal apex angles (60, 49, 35, 22, 22°). The minimum-deviation assumption is supported.
- NIR slit focal ratio: settled (Sec. 3.2).
- Slit-to-detector scale (slit_scale × fdet/fcol): UVB 0.1007 mm/″ (9.93 ″/mm on the detector, 0.149 ″/px), VIS 0.1123 (8.90 ″/mm, 0.134 ″/px), NIR 0.0899 (11.13 ″/mm, 0.200 ″/px). V11 Fig. 9 caption: "Pixel scale is ∼0.15″/pix for UVB and VIS, and ∼0.20″/pix for the NIR arm." The preset's 0.140, 0.135, 0.217 ″/px agree with the physmod scales to 6%, 1% and 9%.
- Running the explorer with the ESO values (F from slit_scale on the 8115 mm pupil, W = fcol/F, f_cam = fdet, eG = sg, eDelta = |nug|, gamma = |mug|; xsh_pm.js) gives R 4684 / 7468 / 4478, Rnpix 32474 / 52076 / 20813 (−3.0%, +2.7%, +3.2% vs Table 13), order-18/23 spans 389 / 567 Å. The fitted optics do not close the R gap either, which points to the measurement definition of Sec. 0.

### 3.2 State values

| value | preset | verdict |
|---|---|---|
| D 8.115 m, Cassegrain f/13.41 | as set | SOURCED (VLT-SPE-ESO-10000-2723 Table 2: "Entrance pupil diameter 8115.0 mm", "Focal ratio 13.4106", verified in rawdata/presets/uves/). |
| UVB/VIS F from 3.91/3.82 ″/mm | 6.501 / 6.654 | SOURCED (XUM24 Sec. 2.2.1.7 "measured plate scale at the entrance slit"). ESO physmod slit_scale gives 4.112/3.956 ″/mm (5.2% and 3.6% different); V11 Sec. 2.3.3 "the slit is 2.8 mm high (11″ at f/6.5)" gives 3.93 ″/mm (DERIVED). In this preset F and W cancel in R and npix (npix = φ/(camera plate scale × pixel), DERIVED), so the conflict affects f_col and the drawing only. |
| NIR F 6.5 "assumed" | 6.5 | Wrong. The NIR arm has no focal reducer (V11 Sec. 2.2.7 "The NIR arm is not equipped with an ADC"; V11 Sec. 2.5.1 and N08 Sec. 1: relay mirrors "re-image the Cassegrain focus on a slit inside the cryostat"). ESO physmod NIR slit_scale 0.52266 mm/″ gives f/13.28 on the 8115 mm pupil (DERIVED), close to the Cassegrain 528 µm/″ (f/13.41) of VLT-SPE-ESO-10000-2723 Table 2, and fcol = 1020.05 mm. The note's statement "The NIR slit focal ratio is not published" is superseded. Effect: drawing only in the present mapping (fcol 552.5 → 1020 mm). The physmod pair implies a 76.8 mm beam (1020.05/13.28) vs D06's "The NIR collimated beam is 85mm"; unresolved. |
| W 100 / 100 / 85 mm | as set | SOURCED (D06). |
| f_cam from 9.31 / 8.98 / 12.1 ″/mm | 273.0 / 283.0 / 178.6 mm | The UVB/VIS camera plate scales are the camera f-ratios restated on the 8.2 m aperture: 206265/(2.7 × 8200) = 9.317, 206265/(2.8 × 8200) = 8.984 ″/mm (DERIVED). They are design numbers. The preset's R and npix rest entirely on these values (DERIVED). ESO fdet: 261.7 / 276.1 / 175.4 mm. |
| echelles 180 / 99.4 / 55 /mm; 41.77 / 54.0 / 46.07°; θ = 0; γ 2.2 / 2.0 / 1.8° | as set | SOURCED (V11 Secs. 2.3.2, 2.4.2, 2.5.3). Richardson 2014 Table T3, p. 17: "53-*-149E 180 41.8° 154 x 206" matches the UVB echelle; no catalog master matches 99.4 /mm at 54° or 55 /mm at 46.07° (closest "53-*-416E 54.49 46° 102 x 102", 1.1% off in groove density and too small for the 150 mm grating of N08). The published densities stand. |
| prisms (silica 60° ×2; SF6 49° ×2; Infrasil 35° + 2 ZnSe 22°, double pass, 105 K) | as set | SOURCED; minimum deviation supported (Sec. 3.1). ESO's physical model uses the same glass data sources (Leviton fused silica, Ghosh SF6, CHARMS ZnSe and Infrasil 301; VLT-MAN-ESO-14650-5000 Sec. 2.3.1). |
| Nx × Ny, pixel | 3000×1800, 4096×2048, 2048×1024 (18 µm) | SOURCED (V11 Secs. 2.3.3, 2.4.3, 2.5.4). |
| lamC = blaze of the middle order | 4145 / 7112 / 14528 Å | SOURCED values (V11 Table 3), but the choice misplaces the format (Sec. 3.4). |

### 3.3 Note

- "echelle ... in-plane offset 0, γ° out of plane": SOURCED (V11 "The off-blaze angle is 0.0°, while the off-plane angle is 2.2°").
- "camera f/2.7 (effective focal length 273.0 mm, from the published camera plate scale 9.31″/mm ...)": arithmetic correct; the plate scale is the design f-ratio restated (Sec. 3.2).
- NIR sentence "The NIR slit focal ratio is not published: f/6.5 assumed": superseded (Sec. 3.2).
- Missing: the dichroic limits, the explorer's 3200 Å floor (UVB order 24, 293.6–322.3 nm, is absent), and the R definition. The ZShooter note already carries the first two.

### 3.4 Coverage, orders and cross-dispersion (page check)

| arm | page (model) | published (V11 Table 3 = XUM24 Table 14) |
|---|---|---|
| UVB | 3200–9655 Å; orders 23–8; flag "coverage gaps above 7022 Å" | 293.6–593.0 nm; orders 24–13 |
| VIS | 5539–13414 Å; orders 29–12; flag "coverage gaps above 12968 Å" | 525.3–1048.9 nm; orders 30–16 |
| NIR | 10410–24910 Å; orders 25–11 (order 25 partial, 10410–10722 Å) | 982.7–2480.7 nm; orders 26–11 |

Three causes:
1. Dichroics not modeled: UVB shows orders 12–8 and VIS orders 15–12, which receive no light (V11 "The dichroic crossover between UVB-VIS and VIS-NIR is at 559.5 nm and 1024 nm"). The gap flags come from these orders.
2. Centering: the blaze of the middle order sits at the detector center, while ESO's spectral-format tables (`SPECTRAL_FORMAT_TAB_VIS_NEW.fits`, `..._NIR_NEW.fits`, column XDISP_CEN) put VIS order 23 at x = 1201 of 2048 and NIR order 18 at x = 585 of 1024. VIS order 30 and NIR order 26 fall off the chip in the model. Setting lamC to the order-24 blaze in the VIS (6821 Å) gives orders 30–14, and the order-19 blaze in the NIR (13763 Å) gives orders 26–11, the published sets (DERIVED; the VIS keeps two beyond-dichroic orders, and NIR order 26 appears only over 1008–1025 nm with a 9 Å gap flag, a residue of cause 3).
3. Cross-dispersion too strong: model order-center spacings vs ESO XDISP_CEN (DERIVED, xsh_pos.js): VIS orders 16→30 span 1821 px vs 1564 px (+16%; adjacent spacing +12% at 16–17 rising to +21% at 29–30); NIR orders 11→26 span 1023 px vs 928 px (+10%; +3% at 11–12 rising to +21% at 25–26). The prisms are at minimum deviation in both models (Sec. 3.1), so the cause is open; the VIS cmup1 = −19.96° tilt and fdet 276 vs 283 mm are candidates (INFERRED).

### 3.5 Pub lines

- R × sampling (UVB 0.7%, NIR 1.8% pass; VIS 5.1% info with its explanation): a definition-independent dispersion test, correctly chosen. Confirmed.
- Order spans (UVB order 18, 378 vs 383 Å; VIS order 23, 555 vs 553 Å): pass.
- NIR "16 orders" (model 15): passes at the 10% tolerance, but the model's 15 include a partial order 25 and miss order 26 (Sec. 3.4).
- R lines (info): the explanation "because the model's slit image is 18%, 20% and 15% wider than the measured lines" restates the miss. The best-supported explanation is the width definition (Sec. 0). The src also says "Table 13 (measured)"; XUM24 says only "The resolution and pixel sampling (without binning) as a function of the slit width is given in Table 13." The measured table is V11 Table 4 ("Measured resolution and sampling as a function of slit width": 5100 / 8800 / 5600 at 6.3 / 6.0 / 4.0 px), and the ESO QC trending gives observed values (UVB 1.0″: "Observed values for 2017-10...2019-02 calibrations show 5440+-14").
- Spatial scale (info, "projected; prism anamorphism"): XUM24 Sec. 2.3.1 does say "Both slit height and width projection also vary ... due to a variable anamorphic effect introduced by the prisms (crossed twice)", and gives 0.164 / 0.154 / 0.245 ″/pix as "the projected slit height (11″) measured at the center of an order". V11 Fig. 9 (∼0.15 / ∼0.15 / ∼0.20) and the ESO physmod scales (0.149 / 0.134 / 0.200) agree with the model better than with XUM24, and the physmod prisms sit at minimum deviation. The line should cite both and leave the cause open.
- NIR order 18 "recorded over 110.7 nm" (info, model 143.9 nm): in the NIR the free spectral range (80.7 nm at order 18) is much shorter than the 2048-px detector, and ESO's NIR format table gives per-order limits short of the detector ends for orders 16–26 (order 18: YMIN 141, YMAX 1905). The V11 min/max are therefore the pipeline's order extent (INFERRED), not the detector length; the info explanation should say so.

## 4. Summary

### (a) Confirmed errors, by severity

1. X-Shooter coverage and orders (all three arms). The page shows UVB 3200–9655 Å with orders 23–8 and a false "coverage gaps above 7022 Å" warning, VIS 5539–13414 Å with orders 29–12 and a gap warning, and NIR orders 25–11; the instrument records UVB 293.6–593.0 nm (24–13), VIS 525.3–1048.9 nm (30–16), NIR 982.7–2480.7 nm (26–11) (V11 Table 3). Fix: state the dichroic limits and the 3200 Å floor in the note, set lamC to center the published orders (VIS 6821 Å, NIR 13763 Å, DERIVED), and clip or label the orders beyond the dichroics. Source for the format: ESO `SPECTRAL_FORMAT_TAB_*_NEW.fits` (XDISP_CEN). The model's order spacing is 10–16% wider than ESO's (open). Effect: coverage and order count; R and dispersion unchanged (VIS Rnpix +0.4% with the new lamC).
2. Measured-R comparisons use unlike definitions (Binospec, X-Shooter; DEIMOS has none scored). Binospec's "R 4200" is c/(2.355σ) from Gauss-Hermite fits (F25 Sec. 7.2); on that definition the preset gives 4285 at Hα (2%). X-Shooter's Table 13 widths are fitted widths (ESO xsh_wavecal); a Gaussian fit to the model's boxcar gives R 5280 / 8965 / 5580 vs 5400 / 8900 / 5600. Fix: rewrite the info explanations (remove "vs ~3240 implied by the table" and the research's 30% conflict; replace the tautological X-Shooter explanation), and tell the user in the note or the readout that published R values are fitted-width values 15–25% above the boxcar-FWHM R the page shows. Effect: none on the computed R; the page's R reads as wrong to a builder without this.
3. X-Shooter NIR slit focal ratio: f/6.5 assumed and called unpublished; ESO's physical model gives slit_scale 0.52266 mm/″ (f/13.28) and fcol 1020.05 mm, consistent with the relay of the f/13.41 Cassegrain focus (V11, N08). Fix: F = 13.28 with W = 85 mm (fcol 1129 mm), or F = 13.28 with W = 76.8 mm (fcol 1020 mm) if the physmod pair is adopted. Effect: drawing only with W = 85; with W = 76.8 and the camera scale kept, R and npix are unchanged in the preset's mapping (npix depends on the camera plate scale only).
4. DEIMOS scored lines test only the design arithmetic. The four scored values are Faber's 1995 design calculation with the preset's own f_cam and angle. Fix: label the four lines "design" and add scored measured lines: N13 Table 2 (0.33 Å/px; 6500–9300 Å typical at λc 7800 Å; R 5900 at 7800 Å with 1.0″ slits, FWHM 1.29–1.39 Å) and F03 (R ≈ 6000, 0.33 Å/px, 0.75″; Fig. 1 FWHM 4 px = 1.3 Å). Effect: none on the computed values; adds real tests (the preset passes F03 at 2% and N13 on the second-moment width at 0.2%).
5. X-Shooter info-line wording: "Table 13 (measured)" is not stated by the manual (V11 Table 4 is the measured table); the spatial-scale explanation "prism anamorphism" conflicts with V11 Fig. 9 and the ESO physmod scales; the NIR order-span explanation restates the miss. Fixes as in Sec. 3.5.
6. Binospec nObj 150 is the mask capacity; KAR20 implies 60–75 per detector in maximal packing (INFERRED). Effect: trace count in the drawing.
7. Minor refinements: DEIMOS f_cam 382.0 mm and 1200.06 /mm in the calibrated DEEP2/PypeIt model (Å/px −0.25%); Binospec "beam 207 mm" should read "~208 mm (F19)"; DEIMOS CCD gap 7 px along the dispersion now sourced (N13).

### (b) Unsupported or superseded claims

- `deimos` note: "blaze 7500 Å, the value consistent with the listed 26.7° blaze angle" is right but argued by inference; cite N13 Table 2, KDSPEC and Richardson 53-*-360R.
- `binospec` pub src: "(vs ~3240 implied by the table)"; research Conflicts: "the measured value is ~30% higher". Both misread F25's σ-based R.
- `xsh*` note: "The NIR slit focal ratio is not published" (ESO physmod gives f/13.28).
- `xsh*` pub src: "Table 13 (measured)"; "because the model's slit image is 18%, 20% and 15% wider than the measured lines" (a restatement); "(projected; prism anamorphism)" given as the cause of the 11–15% spatial-scale miss.
- research record (round 2, X-Shooter Notes): "camera f/# and plate scales" listed as sourced optics; the UVB/VIS plate scales are the design f-ratios restated.

### (c) Open questions for the builders

- DEIMOS: the slit width of F03 Fig. 1 (0.75″ or DEEP2's 1.0″); how N13 measured the 1.29–1.39 Å sky-line FWHM (the value matches 2.355 × rms of the 1.0″ slit image, and lies 22% below its true FWHM); whether the 1200G is blazed at 7500 Å or 7760 Å (Keck gratings page); the as-ruled density (PypeIt uses 1200.06 /mm).
- Binospec: the 600 gpm master's blaze angle (16.0° in MMTB/BDS08; no catalog master at 16°; Hectospec's 600 gpm is blazed at 6000 Å) and as-ruled density; the central wavelength of the F25 longslit measurement.
- X-Shooter: the fitting function behind Table 13 and the ESO QC resolving power; the origin of the 0.164 / 0.154 / 0.245 ″/pix "projected slit height" values; the 10–16% difference in cross-dispersion between a minimum-deviation trace and the ESO format tables (role of the VIS cmup1 = −19.96° tilt); NIR beam 85 mm vs 76.8 mm implied by the fitted fcol and slit scale; UVB slit scale 3.91 (manual, "measured") vs 4.11 ″/mm (physmod).

### (d) New sources saved (all in ~/memos/instex/rawdata/presets/xshooter/, new files)

- `eso_xsh_physmod_OV_fetched2026-11-16.pdf`: ESO VLT-MAN-ESO-14650-5000, "X-Shooter Physical Model DRS Pipeline Implementation", Issue 0.9, 2010-04-26 (https://ftp.eso.org/pub/dfs/pipelines/instruments/xshooter/xsh-physmod-OV.pdf).
- `eso_xsh-calib-1.2.0_fetched2026-11-16.tar.gz` (ESO pipeline static calibrations, 2010; https://ftp.eso.org/pub/dfs/pipelines/instruments/xshooter/xsh-calib-1.2.0.tar.gz) and `eso_xsh-calib-1.2.0_extracted/xsh-calib-1.2.0/cal/` with 15 FITS tables: `xs_{uvb,vis,nir}_def_{oct09,com4,aug10}.fits` (physical-model configurations) and `SPECTRAL_FORMAT_TAB_{UVB,VIS,NIR}[_NEW].fits`. Read with astropy under `python3 -I` (scratch readcfg.py).
- `eso_qc_xshooter_wavecal_qc1_fetched2026-11-16.html` (ESO QC "Wavelength solution and resolution"; the 19%/15% bias note).
- `eso_qc_xshooter_pipeline_xsh_wavecal_fetched2026-11-16.html` (xsh_wavecal description: line profiles fit for position and FWHM).
- `eso_qc_xshooter_trend_ARC_SLIT_UVB_HC_fetched2026-11-16.html` (UVB 1.0″ observed R 5440 ± 14) and `eso_qc_xshooter_trend_KPI_RP_SLIT_NIR_fetched2026-11-16.html` (resolving-power KPI text).

Saved earlier but not yet used by these presets: F03 (rawdata/presets/deimos/faber2003_spie4841_deimos_integration_testing.pdf), N13 (rawdata/presets/multiplex/Newman2013_DEEP2_survey_arXiv1203.3192v3.pdf, Table 2), the DEEP2/PypeIt optical model (rawdata/presets/deimos/deep2_spec2d_optical_model/), the Richardson 2014 catalog (rawdata/presets/m2fs/), and F19 Fig. 51 (p. 40 of the saved F19).
