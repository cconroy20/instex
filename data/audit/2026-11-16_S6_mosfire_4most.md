# Audit S6: Keck/MOSFIRE (Y, J, H, K) and VISTA/4MOST (LRS and HRS, three arms each)

Presets audited: mosfirey, mosfirej, mosfireh, mosfirek, 4mostlb, 4mostlg, 4mostlr, 4mosthb, 4mosthg, 4mosthr (web/presets.js lines 299-318 and 532-558). Research records: data/round4/mosfire.md and data/round4/4most.md (and the .json twins). Model numbers come from `IX.design(toP(state))` exactly as in validate.js; the scripts are in the scratch folder `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/audit/s6/` (run.js, mosvar.js, hrsvar.js, edgescan.js, py/*.py). DERIVED marks arithmetic done here; INFERRED marks a conclusion drawn from indirect evidence.

The most important new evidence is a set of as-built static calibrations in the ESO QMOST pipeline kit 0.9.6 (released on the ESO ftp server 2026-11-12). Its README reads: "This directory contains static calibrations appropriate for the real instrument at the telescope, derived from data taken during the verification phase. These are not final, in particular the reference trace files are still from the lab". The wavelength maps (QMOST_WAVE_MAP_*.fits, MJD-OBS 60919) give the wavelength of each pixel of each 4MOST detector, and the reference trace files give the spatial position and width of each of the 824 fiber traces. These settle most of the 4MOST questions below.

## 1. Keck I / MOSFIRE

### 1.1 Model outputs (preset as it stands)

| band | alpha, beta (deg) | Rs | Reff | slit image (px) | A/px | detector span (A) | anamorphic |
|---|---|---|---|---|---|---|---|
| Y (m=6) | 41.465, 1.465 | 3278 | 3099 | 2.915 | 1.0856 | 9263-11481 | 1.3340 |
| J (m=5) | 41.469, 1.469 | 3279 | 3100 | 2.915 | 1.3027 | 11118-13779 | 1.3341 |
| H (m=4) | 42.572, 2.572 | 3499 | 3301 | 2.867 | 1.6273 | 14656-17980 | 1.3565 |
| K (m=3) | 42.570, 2.570 | 3498 | 3298 | 2.867 | 2.1698 | 19541-23972 | 1.3565 |

### 1.2 State values against the sources

All state values are supported. The checks that matter most:

- Camera-collimator angle psi = 40 deg in the dispersion plane. Supported by McLean et al. 2012 (M12), Sec. 3 "Grating" (p. 84460J-7): "The grating was custom ruled specifically for the MOSFIRE application in orders 3, 4, 5, and 6 with a 40° included angle and angle of incidence (AOI) of 42.6° (H and K) and 41.5° (Y and J)." The in-plane geometry is confirmed independently by the anamorphic factors, M12 Sec. 3 "Spectral Resolution" (p. 84460J-4): "The (average) anamorphic factors are 1.357 for HK mode, and 1.335 for YJ". The model gives 1.3565 and 1.3340 (cos alpha / cos beta with alpha - beta = 40 deg), within 0.1%. An out-of-plane angle would not reproduce these factors and the slit-image compression. The model's solved incidence angles (41.47 and 42.57 deg) agree with the as-built 41.5 and 42.6 deg, and Y/J and H/K each come out on one common stop (41.465 vs 41.469; 42.572 vs 42.570), as the two fixed stops require.
- Groove density 110.5 /mm, blaze 21.93 deg, orders 6/5/4/3: M12 Sec. 3 "Grating": "The grating has 110.5 lines/mm with a blaze angle of 21.93° (first order blaze of 6.35 μm)". The grating was a custom master (M10/MDDR name Newport/Richardson), so no catalog entry is needed. lamB1 = 2 sin(21.93 deg)/110.5 = 67,597 A is the Littrow value the explorer expects; in the 40 deg geometry the model's blaze peak falls at m lambda = (sin 41.93 deg + sin 1.93 deg)/110.5 mm^-1 = 6.353 um (DERIVED), the published 6.35 um.
- Camera 250 mm, pixel 18 um: NEW SOURCE. The Keck MOSFIRE data-reduction pipeline uses a physical model with these values (MosfireDRP, MOSFIRE/Wavelength.py, lines 8-11): "The wavelength is represented as a physical model of MOSFIRE using the grating equation, the size of a pixel (18 micron), and the focal length of the camera (250 mm), the lines per mm of the grating (110.5), and the order of the grating (Y: 6, J: 5, H: 4, K: 3)."; line 108: "pixelsize, focal_length = 18.0, 250e3 # micron". This adds an operational confirmation to the design value (MDDR Sec. 5.1.2.5) and the as-built 7.25 focal reduction (M12).
- Collimator 1813.0 mm (M10 Sec. 3.1, design), F = 13.66 and D = 10.95 m (M12 Sec. 3 "Imaging Plate Scale": "the Keck Cassegrain f/13.66 focal plane (nominal scale is 0.72516 mm/")"). The 0.7" slit is 0.508 mm at the CSU (M12 abstract), reproduced.
- gamma = 0: M12 Sec. 2: "Spectra are aligned along detector rows to better than 0.08°." The DRP model's only out-of-plane term is cos(scale (y - 1024)), i.e. zero for a slit at the field center.

### 1.3 Note sentences

| note text | status |
|---|---|
| "f/13.66 Cassegrain" | supported (M12 Sec. 3) |
| "six-element refractive collimator 1813 mm" | supported (M10 Sec. 3.1; design value) |
| "(beam 132.7 mm on the 10.95 m primary)" | DERIVED (1813.0/13.66), not sourced. The design papers state "a (stipulated) 125.0-mm beam diameter" with an effective f/14.50 (M10 Sec. 3.1; MDDR Sec. 5.1.2.4) and an open Lyot hole of ~138.4 mm for the full serrated primary in Y (MDDR). The value follows the explorer's D = 10.95 m convention; effect on R: the diffraction term changes Reff by less than 0.1% (DERIVED). Mark as derived in the note. |
| "camera 250 mm (reduction 7.25)" | supported (MDDR; M12; DRP) |
| "110.5 l/mm reflection grating blazed 21.93°, fixed 40° camera–collimator angle" | supported (M12) |
| "Y band in order 6 at λc = 10373 Å" (etc.) | supported (M12 Table 1) |
| "HAWAII-2RG 2048 × 2048 of 18 µm" | supported, but M12 Sec. 2 says the light is "projected onto the active detector area (2040 x 2040 pixels)". With Nx = 2040 the K span becomes 19549-23964 A (8 A in from each end); the scored K edges still pass their 0.1% tolerance. Minor. |
| "28 slits per mask (MOSDEF average; the slit unit forms up to 46 slits from 92 bars)" | supported (Kriek et al. 2015 Sec. 2.3: "an average of 28 galaxies"; M12 Sec. 2) |

The note does not say that the Y and J coverage is set by the order-sorting filters. The page shows the detector span, 9263-11,481 A for Y and 11,118-13,779 A for J; MOSFIRE records 9716-11250 A and 11530-13520 A (M12 Table 1; the ranges equal the filter half-power bands of the Keck filter page). A builder reading the page sees 44% (Y) and 34% (J) more coverage than the instrument delivers. Only the info pub line mentions this.

### 1.4 Pub lines

- dlpix (scored, 0.3%): M12 Table 1, "the linearly approximated dispersion in Å/pixel" (as built). Same setup. Model within 0.04%.
- npix 2.92/2.87 px (scored, 2%): M12's own geometric figure (0.7"/0.240 and 0.7"/0.244), a test of the anamorphic factor and scale. Same setup, correctly labeled geometric.
- pixScale 0.1798"/px (scored, 1%): measured in imaging mode (M12). The model's 18.000 um pixel gives 0.18001; M12's 17.984 um at 77 K gives 0.1798. Passes.
- K coverage 19540-23970 A (scored, 0.1%): M12 calls Table 1 "the achieved central wavelengths and observed wavelength ranges". Model 19541-23972.
- R = 3380/3310/3660/3620 (info): measured, same 0.7" slit and bands, M12 Sec. 3: "These measurements are averaged over the full 3.0' x 6.1' spectroscopic field". The explanation in the src text is incomplete; see 1.5.

### 1.5 The R miss: the model's pixel term

The model's effective R is 6.4-9.8% below the measured values at 0.7"; its slit-limited R is 0.9-4.4% below (the src text says "1–4%"; H is 4.4%). Most of the effective-R miss comes from the app's pixel term, Rp = npix x Rs added in quadrature, which lowers R by a factor 1/sqrt(1 + 1/npix^2) = 0.946 at 2.9 px. MOSFIRE's measurements contradict that term:

- M12 Sec. 3 "Spectral Resolution": "a slit corresponding to 0.6" on the sky produces 0.6/0.240 (0.244) = 2.50 (2.46) pixel slit image at the detector, which agrees well with measured line widths." M12 Table 2 lists the measured line FWHM for a 0.60" slit at the fixed focus: K 2.42, H 2.39, J 2.51, Y 2.46 px, against the geometric 2.46/2.46/2.50/2.50 px. The pixelized line is not wider than the geometric slit image. (A top-hat convolved with a one-pixel box keeps its FWHM, so adding a pixel in quadrature overestimates the width for a slit-limited line.)
- M12 also measured R at a 0.48" slit: "R = 4,960, 4,930, 5,340, and 5,280 for Y, J, H, and K respectively." Model at 0.48": Rs 4780/4781/5102/5102 (-3.6/-3.0/-4.5/-3.4%), Reff 4272/4272/4540/4534 (-13.9/-13.3/-15.0/-14.1%). The measured line FWHM implied, lambda/(R x A/px), is 1.93/1.94/1.88/1.90 px, against the geometric 2.00/2.00/1.97/1.97 px and the model's quadrature width of 2.2 px.

So at both slit widths the measured lines are 3.1-4.6% narrower than the geometric slit image (Y, H, K; J 0.9-3.1%), and the pixel term moves the model the wrong way. The src text's evidence for the narrow lines, "2.74–2.88 px on the Keck MOSFIRE grating page", cites a column that page labels only "For a nominal 0.7 arcsec slit"; the column equals lambda_c/(R x A/px) with R the measured values (3388/3318/3660/3610), so the reading is a fair INFERENCE but M12 Table 2 and the 0.48" measurement are the direct sources. The constant fractional offset at 0.7" and 0.48" suggests either a slit narrower than nominal (CSU bar edges) or a Gaussian-fit FWHM (a Gaussian fit to a pixelized top-hat gives a narrower FWHM; DERIVED from a simple simulation: 0.85-0.95 x the box width at 2.9 px, depending on the PSF). M12 does not say how the FWHM was measured. Open question for the builders.

The pixel term is an app-wide convention (the term enters Reff for each preset), not a MOSFIRE parameter error, but MOSFIRE has the cleanest data against the convention. Suggested fixes: compare the measured R with Rs in the src text and cite M12 Table 2; add the 0.48" measurement as a second info line; consider whether Reff should drop the pixel term for slit-limited (top-hat) line profiles.

### 1.6 Page check (headless Chrome, Y and K)

Resolution R = 3099 (Y) and 3298 (K), against the measured 3380 and 3620. Coverage 9263-11,481 A for Y (see 1.3). Dispersion 1.09 and 2.17 A/px, sampling 2.92 x 3.89 px: correct. The drawing shows the lens collimator, the grating lit at 41.5 deg and the camera at 40 deg: correct geometry. Two display points a builder would query: the disperser panel shows "Blaze 6.76 µm, 1st order" (the Littrow convention) where M12 and the PSR say "first order blaze of 6.35 μm" (the same blaze in the 40 deg geometry), and "Grooves 111 /mm" for 110.5 (display rounding).

## 2. VISTA / 4MOST LRS (blue, green, red)

### 2.1 Model outputs and the as-built maps

| arm | alpha, beta (deg) | Rs | Reff | npix | A/px model | A/px as-built (LRS-A / LRS-B) | detector span model | span as-built LRS-A | span as-built LRS-B |
|---|---|---|---|---|---|---|---|---|---|
| blue | 18.65, 17.85 | 5388 | 5075 | 2.81 | 0.3063 | 0.3084 / 0.3080 | 3683-5549 | 3671-5549 | 3679-5555 |
| green | 22.68, 22.17 | 6740 | 6349 | 2.81 | 0.3300 | 0.3300 / 0.3300 | 5222-7232 | 5226-7234 | 5223-7232 |
| red | 22.65, 22.17 | 6734 | 6342 | 2.81 | 0.4353 | 0.4336 / 0.4345 | 6882-9533 | 6894-9533 | 6880-9523 |

As-built values: central fiber (spatial column 3080), dispersion at spectral pixel 3072, from eso_qmost-kit-0.9.6_calib_QMOST_WAVE_MAP_LRS-A.fits and _LRS-B.fits. The as-built central wavelengths are 4635.4/6260.4/8251.9 A (LRS-A) and 4642.4/6257.9/8240.3 A (LRS-B), against the preset's TOAD values 4636/6254/8243. The LRS preset reproduces the as-built dispersion to 0.7% and the as-built detector edges to 13 A or better. The TOAD table (2023) that the preset is validated against agrees with the as-built maps to 0.1% in dispersion and 11 A in the edges, so the LRS validation stands; the pub src could cite the measured map.

### 2.2 State values and note

- 85 um fibers, 1.45" on the sky; F = 3.0 virtual core (85 um/(3.0 x 4.1 m) = 1.4254", slit of equal line width 1.2345"): supported and arithmetic correct.
- "824 spectra per detector (812 science + 12 calibration)": now settled by the ESO QMOST Pipeline User Manual 0.9.6, p. 30: "There are two additional slitlets, one at each end of the slit, each containing 6 simultaneous calibration fibres", and p. 43 (PSF product): "nfib is the number of fibres (=824)". The reference trace files contain 824 traces in 30 groups, 6 + 28 x 29 + 6, for both LRS-A and the HRS. The conflict with L16's "10 calibration fibres" is resolved in favor of 12.
- Collimator 600 mm (R = 1200 mm, L20 Sec. 4.1), beam 200 mm, camera 345 mm f/1.73 (L16 Sec. 3.4), VPH 1351/1220/925 /mm at incidence 18.65/22.68/22.65 deg (L20 Sec. 4.4, verified: "The Blue/Green/Red VPHG is used at incidence angle of 18.65° / 22.68° / 22.65° ± 1.00°"), first order (L20: "on the +1 order"), detector 6144 x 6160 x 15 um (EUSUB; trace headers "Physical active pixels in X 6144 ... Y 6160", "PSZX = 15."): supported.
- The as-built trace spacing confirms the LRS image scale: the in-slitlet fiber pitch is 6.44-6.50 px (manual p. 30: "The fibres are separated by approximately 6.5 detector pixels"), against 170 um x 345/600 / 15 um = 6.52 px (DERIVED).
- "camera at 36.50° to the collimator" (also 44.86, 44.82): DERIVED here from the grating equation at the TOAD center wavelength; no source states a camera angle, and L16 Sec. 3.4 says "Each camera has a different decenter along the spectral direction and tilt with respect to the grating". The note presents a derived number as a design fact. Effect: drawing only.

### 2.3 Pub lines

- dlpix (scored, 2%): supported, see 2.1.
- lo/hi (info): fine; as-built edges in 2.1.
- npix "~3 px per resolution element (2.92 median)" (SCORED, 8%): unlike quantities. L16 Sec. 4.5: "Including optical design itself, CCD flatness, Detector Charge Diffusion, scattered light and thermal effect, the spectral sampling is still compliant with requirements with a median value of 2.92 pixels (Figure 7). Note that is the worst case." The model's npix is the geometric slit-equivalent width only (2.81 px). The comparison passes by coincidence. A like-for-like target exists: L16 Fig. 3 caption, "The square of 49µm represents the average geometrical image of the Fibre Core on the detector", i.e. 3.27 px, which the q type "diam" compares directly (model 2.809/0.866 = 3.245 px, -0.8%). Fix: score diam against 49 um / 15 um and make the 2.92 line info.
- R "4000–7700 across the LRS (mean 6500)" (info, value NaN): the 4most.eu figure ("Average over the slit") can be read at lambda_c by pixel measurement of the saved PNG: blue 4980, green 6490, red 6640 (+/-50). Model Reff +1.9 / -2.2 / -4.5%; Rs +8.2 / +3.9 / +1.4%. These would be useful info lines; the LRS model agrees with the published resolving power.

## 3. VISTA / 4MOST HRS (blue, green, red; "concept optics")

### 3.1 Model outputs

| arm | G (/mm) | alpha = beta (deg) | f_cam | Rs | Reff | npix | A/px | detector span (A) |
|---|---|---|---|---|---|---|---|---|
| blue | 3586 | 48.11 | 375 | 22,720 | 21,038 | 2.454 | 0.0745 | 3909-4364 |
| green | 2836 | 50.74 | 375 | 24,927 | 23,079 | 2.454 | 0.0893 | 5167-5712 |
| red | 2343 | 49.22 | 375 | 23,626 | 21,873 | 2.454 | 0.1115 | 6100-6780 |

### 3.2 The as-built HRS data

From eso_qmost-kit-0.9.6_calib_QMOST_WAVE_MAP_HRS.fits (central fiber, spectral pixel 3072):

| arm | lambda_c as-built (A) | A/px as-built | model A/px (miss) | as-built detector span (A) |
|---|---|---|---|---|
| blue | 4150.05 | 0.07177 | 0.0745 (+3.8%) | 3917.9-4357.8 |
| green | 5458.61 | 0.09436 | 0.0893 (-5.4%) | 5153.9-5731.8 |
| red | 6459.83 | 0.11286 | 0.1115 (-1.2%) | 6095.2-6786.2 |

The model's green span (544 A) is 6% short of the as-built 578 A.

From eso_qmost-kit-0.9.6_calib_QMOST_REFERENCE_FIBRE_TRACE_HRS.fits and _LRS-A.fits (lab traces; both slits have the same 6 + 28 x 29 + 6 layout):

| | in-slitlet fiber pitch (px), R/G/B | median spatial FWHM (px), R/G/B |
|---|---|---|
| HRS | 6.61 / 6.71 / 6.70 | 2.78 / 2.91 / 2.83 |
| LRS-A | 6.50 / 6.48 / 6.44 | 2.72 / 2.75 / 2.76 |

### 3.3 Confirmed error: the concept camera and gratings do not describe the as-built HRS

Three independent lines of evidence:

1. Image scale. With the preset's f_cam/f_col = 375/750 = 0.50, the 170 um fiber pitch of the concept slit (Hansen et al. 2015 [H15] Table 1: "Fiber separation 170 µm") maps to 5.67 px. The as-built traces show 6.61-6.71 px, i.e. f_cam/f_col = 0.583-0.592 (DERIVED; 0.563-0.572 with Haynes et al. 2014's "fibre separation ~176µm"). The HRS spatial FWHM is 3.5% larger than the LRS one (2.84 vs 2.74 px, the same fibers), which points to the same scale, ~0.59 (INFERRED, assumes similar PSFs). The same method applied to the LRS recovers the design scale 0.575 to 1%. H15 Table 1 predicted this scale: "Camera focal ratio F1.8", "Sampling (spatial direction) 3.4 pixels", "Gap between fiber images 3.4 pixels", i.e. a 6.8 px pitch and f_cam = 1.8 x 250 = 450 mm (DERIVED). The preset follows Haynes et al. 2014 (H14) Sec. 2.5, "three ~f/1.5 (fl=340mm) cameras", whose "fl=340mm" is also the LRS concept camera's value and whose f/1.5 gives the preset's 375 mm.
2. Dispersion ratios between arms. The as-built dispersion per unit wavelength, (A/px)/lambda_c, is 1.7294e-5 (blue), 1.7287e-5 (green), 1.7471e-5 (red) per px: blue and green agree to 0.04%. In a Littrow VPH spectrograph this ratio is pix/(2 tan(alpha) f_cam), so blue and green share one tan(alpha) x f_cam. The concept gratings in Littrow at one camera focal length predict a 9.7% difference between blue and green (tan 50.73 deg / tan 48.11 deg = 1.097, DERIVED). With the concept gratings, the as-built dispersions require f_cam = 389 / 355 / 371 mm in the three arms (DERIVED; the research found the same spread from TOAD). The as-built HRS therefore does not use the concept gratings at the concept angles, unless its three cameras differ by 10%. The concept green grating was designed for a different band: H14 Sec. 2.5, "with the blue channel ~395-440nm, the green channel ~499-556nm and the red channel ~604-673nm ... three VPH gratings (3586 l/mm blue, 2836 l/mm green and 2343 l/mm red)"; the final green band is 516-573 nm, and the green arm misfits most.
3. Curvature of the wavelength map. With the dispersion at lambda_c forced to the as-built value (Littrow, G adjusted), the as-built band edges are reproduced to 1.6 A or better at f_cam = 420-440 mm, and missed by 2-7 A at 370-380 mm (edgescan.js). The method's own systematics, measured on the LRS with its known optics, are approximately -5 to -10 mm in f_cam, so the HRS estimate is f_cam ~425 +/- 15 mm (INFERRED).

Effect on the model (hrsvar.js; f_col = 750 mm kept; Littrow; G fitted to the as-built dispersion; lambda_c as built):

| arm | variant | G (/mm) | alpha (deg) | Rs | Reff | npix | A/px | span (A) |
|---|---|---|---|---|---|---|---|---|
| blue | preset | 3586 | 48.11 | 22,720 | 21,038 | 2.45 | 0.0745 | 3909-4364 |
| blue | f_cam 441 (trace scale) | 3379 | 44.52 | 20,039 | 18,932 | 2.89 | 0.07177 | 3920-4358 |
| blue | f_cam 450 (H15 F1.8) | 3344 | 43.94 | 19,638 | 18,593 | 2.94 | 0.07177 | 3920-4359 |
| green | preset | 2836 | 50.74 | 24,927 | 23,079 | 2.45 | 0.0893 | 5167-5712 |
| green | f_cam 441 | 2570 | 44.53 | 20,047 | 18,938 | 2.89 | 0.09436 | 5156-5732 |
| green | f_cam 450 | 2543 | 43.95 | 19,646 | 18,599 | 2.94 | 0.09436 | 5156-5733 |
| red | preset | 2343 | 49.22 | 23,626 | 21,873 | 2.45 | 0.1115 | 6100-6780 |
| red | f_cam 441 | 2160 | 44.23 | 19,836 | 18,736 | 2.89 | 0.11286 | 6098-6787 |
| red | f_cam 450 | 2137 | 43.65 | 19,439 | 18,401 | 2.94 | 0.11286 | 6098-6788 |

The slit-limited R hardly depends on the unknown pieces: Rs = lambda_c / (A/px x npix), and npix = (sqrt 3/2) x 85 um x (f_cam/f_col) / 15 um, so the as-built dispersion and the as-built image scale fix Rs at ~20,000 for any f_col and G (DERIVED). Against the published figure at lambda_c (20,170 / 19,980 / 20,260, see 3.4), the as-built-consistent model gives Rs -0.6 / +0.4 / -2.1% and Reff -6.1 / -5.2 / -7.5%, the same pattern as the LRS preset (the figure lies between Rs and Reff). The preset gives Reff +4.3 / +15.5 / +8.0%. The as-built-consistent geometry therefore lowers the HRS Reff by 10.0% (blue), 17.9% (green) and 14.3% (red), its green dispersion 5.4% too low, and its green coverage 6% short.

Suggested fix: f_cam = 441 mm (EFFECTIVE, from the as-built trace scale at f_col 750 mm) with G fitted to the as-built dispersion in Littrow (3379 / 2570 / 2160 /mm, alpha 44.5 / 44.5 / 44.2 deg), lambda_c = 4150.05 / 5458.61 / 6459.83 A, all marked EFFECTIVE (as the explorer does for other fitted optics); or, at minimum, keep the concept optics and state in the note that they give an R 10-18% above what the as-built data imply. Score the HRS dispersion against the as-built maps (tolerance 1%).

### 3.4 Confirmed error: the HRS R pub line misreads the figure

The pub line says "The page's figure reads about 19,800 at λc (by eye)" (blue) and "19,300" (green); presets.js line 536 gives the reading precision as "+/-100". Measured on the saved PNG (4most-eu_HRS_respower.png, gridlines located by pixel), the curves read 20,170 (blue, 415.2 nm), 19,980 (green, 546.0 nm) and 20,260 (red, 646.4 nm). Each curve has a kink at lambda_c: the published curves are drawn through three points per arm (band start, lambda_c, band end). The research record (data/round4/4most.md, hrs_R_figure) lists only the end readings (blue "~18,400 (392.6 nm) to ~21,000 (435.5 nm)", green "~17,900 (516 nm) to ~20,600 (573 nm)"); linear interpolation between those ends at lambda_c gives 19,770 and 19,320, the values in the preset. The red value, 20,250, was read at the kink and is correct.

Fix: x = ["20,170", 4, 5], ["19,980", 16, 15], ["20,260", 8, 9] for the preset as it stands (the model's Reff is +4.3% and +15.5% above the blue and green readings, not 6% and 20%; the 5/15/9% above the 20,000 mean are correct).

### 3.5 Note sentences (HRS)

- "camera 375 mm (fitted to the published bands: the HRS as-built optics are not public)": unsupported as worded. The research record derives 375 mm from H14's "~f/1.5" x 250 mm (data/round4/4most.md, hrs_camera: "'~f/1.5' x 250 mm = 375 mm (recommended)"); it was not fitted, and the model does not reproduce the published bands (green 5167-5712 against 5160-5730). The comment above the presets (presets.js line 535, "the camera focal length is fitted to the published bands") repeats the claim. The research's reason for rejecting H15's F1.8 (450 mm "cannot cover the published bands") held the concept gratings fixed; with gratings fitted to the as-built dispersion, 450 mm covers the bands (3.3).
- "VPH ... at the symmetric setting": an assumption (no source gives an HRS grating angle); order 1 is assumed (research NOT FOUND). Should be marked assumed.
- Collimator 750 mm: DERIVED (f/3 x 250 mm beam; beam on WS19 slide 20, "250 mm beam size"). The slit-limited R does not depend on f_col once the dispersion and image scale are fixed (3.3).

## 4. Summary

### (a) Confirmed errors, ranked by severity

1. 4MOST HRS, all three arms: the concept camera (375 mm, image scale 0.50) and the concept gratings in Littrow (3586/2836/2343 /mm at 48-51 deg) contradict the as-built wavelength maps and fiber traces in the ESO QMOST pipeline kit 0.9.6. Fix: f_cam = 441 mm (EFFECTIVE; trace scale 0.588 at f_col 750 mm), G = 3379/2570/2160 /mm in Littrow (alpha 44.5/44.5/44.2 deg, EFFECTIVE), lambda_c = 4150.05/5458.61/6459.83 A. Source: eso_qmost-kit-0.9.6_calib_QMOST_WAVE_MAP_HRS.fits and _REFERENCE_FIBRE_TRACE_HRS.fits; H15 Table 1 (F1.8, 3.4 px). Effect: Reff 21,038/23,079/21,873 -> 18,932/18,938/18,736 (-10/-18/-14%), Rs -> 20,039/20,047/19,836 (published figure 20,170/19,980/20,260); A/px -> as-built 0.07177/0.09436/0.11286 (from +3.8/-5.4/-1.2% off); coverage -> 3920-4358, 5156-5732, 6098-6787 A (as-built 3918-4358, 5154-5732, 6095-6786).
2. 4MOST HRS R pub line: the figure readings at lambda_c are 20,170 (blue) and 19,980 (green), not 19,800 and 19,300 (interpolated between the curve ends, missing the kink at lambda_c). Fix the x values; the stated excess becomes 4.3% and 15.5% (with the preset as it stands). Source: 4most-eu_HRS_respower.png, pixel measurement.
3. MOSFIRE, all bands, R info line: the 6.4-9.8% shortfall of the effective R comes mainly from the app's pixel-in-quadrature term, which M12 contradicts ("2.50 (2.46) pixel slit image ... which agrees well with measured line widths"; Table 2 widths 2.39-2.51 px at 0.6"). At 0.48" (M12: R = 4960/4930/5340/5280) the model's Reff is 13-15% low, Rs 3.0-4.5% low. Fix: compare with Rs in the src text, cite M12 Table 2, add the 0.48" line; reconsider the pixel term app-wide. The remaining 0.9-4.5% (measured lines narrower than the geometric slit) is open (see c).
4. 4MOST LRS, all arms: the scored npix line compares the model's geometric width (2.81 px) with L16's "worst case" sampling including CCD flatness, charge diffusion, scattered light and thermal effects (2.92 px). Fix: score q "diam" against L16 Fig. 3's "average geometrical image of the Fibre Core", 49 um = 3.27 px (model 3.245 px, -0.8%), and make the 2.92 line info.
5. MOSFIRE Y and J: the page shows the detector span (9263-11,481 and 11,118-13,779 A), 44% and 34% wider than the filter-limited coverage MOSFIRE records (9716-11250, 11530-13520 A; M12 Table 1). Fix: say in the note that the order-sorting filters set the Y and J bands.
6. MOSFIRE, all bands: Nx = 2048, but M12 gives "the active detector area (2040 x 2040 pixels)". Effect: K span 19549-23964 A (8 A in at each end); the scored K edges still pass.

### (b) Unsupported claims

- 4MOST HRS note and presets.js comment: "camera 375 mm (fitted to the published bands ...)"; the value is H14's "~f/1.5" x 250 mm, not a fit, and misses the green band.
- 4MOST HRS note: "at the symmetric setting" and order 1 are assumptions with no source; f_col 750 mm is DERIVED.
- 4MOST LRS note: "camera at 36.50° (44.86°, 44.82°) to the collimator" is DERIVED from the grating equation, while L16 says the cameras are decentered and tilted relative to the grating.
- MOSFIRE note: "beam 132.7 mm" is DERIVED (1813.0/13.66); the design states a stipulated 125.0 mm at f/14.50. Effect on R below 0.1%.
- MOSFIRE R src text: "the measured lines are narrower than the geometric slit image (2.74–2.88 px on the Keck MOSFIRE grating page)"; the Keck column is not labeled as measured (it equals lambda_c/(R x A/px)); the inference holds, but M12 Table 2 is the direct source. "1–4%" should read "1–4.5%".
- MOSFIRE page: "Blaze 6.76 µm, 1st order" (Littrow convention) beside sources that say 6.35 um (40 deg geometry); "Grooves 111 /mm" for 110.5. Display only.

### (c) Open questions for the builders

- MOSFIRE: how the M12 line FWHM was measured (Gaussian fit or direct width), and the effective CSU slit width for a nominal 0.7" slit; either explains measured lines 3-4.5% narrower than the geometric slit (3.1-4.6% in Y, H, K) at both 0.7" and 0.48". As-built grating-stop angles to 0.01 deg (the as-built lambda_c imply 41.47 and 42.57 deg against the design 41.524 and 42.614). Whether the full 2048 px or the 2040-px active area defines the published coverage.
- 4MOST HRS: the as-built VPH line densities and angles, camera and collimator focal lengths, the slit fiber pitch (170 or 176 um), the grating order and the camera-collimator angle; measured R per arm. The as-built data constrain the products (image scale ~0.59, tan(alpha) x f_cam ~434 mm in blue and green, 429 mm in red) but not each element.
- 4MOST LRS: the camera tilt and decenter per arm (the model puts lambda_c on the camera axis); the as-built VPH angles within the +/-1 deg specification.

### (d) New sources saved (all new files; nothing overwritten)

- rawdata/presets/mosfire/MosfireDRP_master_MOSFIRE_Wavelength.py: Keck MOSFIRE data-reduction pipeline, wavelength module (https://raw.githubusercontent.com/Keck-DataReductionPipelines/MosfireDRP/master/MOSFIRE/Wavelength.py; last commit to the file 36a914247c73, 2019-05-16; sha256 2022d128c98e...). Read as text only.
- rawdata/presets/4most/ESO_qmost-pipeline-manual-0.9.6.pdf: ESO QMOST Pipeline User Manual, Issue 0.9.6, 2026-11-12 (https://ftp.eso.org/pub/dfs/pipelines/kit_devel/qmost-pipeline-manual-0.9.6.pdf; sha256 1080073ad428...). Slit layout and 824 spectra per detector (pp. 30, 43); instrument table (p. 17).
- rawdata/presets/4most/eso_qmost-kit-0.9.6_calib_QMOST_WAVE_MAP_HRS.fits, _WAVE_MAP_LRS-A.fits, _WAVE_MAP_LRS-B.fits, _REFERENCE_FIBRE_TRACE_HRS.fits, _REFERENCE_FIBRE_TRACE_LRS-A.fits, _README.txt: extracted unmodified from qmost-calib-0.9.6.tar.gz inside https://ftp.eso.org/pub/dfs/pipelines/kit_devel/qmost-kit-0.9.6.tar.gz (kit sha256 5516c78a375a...; the 188 MB kit itself stays in the scratch folder dl_qmostkit/). Read with astropy in a scratch venv; nothing in the kit was executed.
