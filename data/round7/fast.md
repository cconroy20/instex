# Round 7 (2026-11-17): FLWO 1.5 m Tillinghast / FAST

Same rules as rounds 1-6 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/fast/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **INFERRED** marks a reading that is not stated; **SCHEMATIC** marks a layout element with no source dimension. Quotes were machine-checked (75 quote pieces, 0 failures (pdftotext layout and raw, normalized)) against the pdftotext layout and raw text of the two PDFs, with whitespace, case, dashes, minus signs and hyphenation normalized; " ... " joins non-adjacent pieces. **Text-layer artifacts of F98 (the PASP scan)**: the degree sign is extracted as the digit 7, the minus sign as 2, the prime as 9, the double prime as 0, the micro sign as m and the exponent -1 as 21 ("357" = 35 deg, "39" = 3 arcmin, "10 .5" = 1.5 arcsec, "mm21" = mm^-1, "2309.86" = -309.86); quotes are given as extracted and read in the Notes column. Machine-readable twin: `data/round7/fast.json`.

## Completeness summary

Complete from Fabricant et al. 1998 (the design paper): telescope aperture and plate scale, slit length, collimator (off-axis paraboloid, 963 mm parent focal length, 8.5 deg off-axis, 93 mm beam), the folded Schmidt camera prescription (Table 4: 225 mm grating-to-corrector, 283.96, 309.86, 333.93 mm; 331 mm effective focal length; demagnification 2.91), gratings (300, 600, 1200 l/mm), dispersion and coverage (Table 7), the CCD. From Mink et al. 2020 (CfA archive paper): current slits, blaze wavelengths, the four common configurations with grating tilt, coverage and resolution, the FAST3 detector and the pixel scale. The camera-collimator angle (35 deg) is a design value from a table footnote and is confirmed by three published numbers (dispersions, pupil anamorphism 1.06 and 1.33). Gaps: the collimator-to-grating distance (no dimensioned layout), the Cassegrain focal ratio as a stated number (derived 10.42), blaze angles (derived), the measured resolving power (the published "Res." is geometric), and the CfA web pages (not reachable from this machine).

**Recommended preset**: Tillinghast 1.5 m (FLWO) / FAST, 300 l/mm grating (blaze 4750 A), 3.0" slit, FAST3 CCD (2688 x 512, 15 um), first order centered at 5500 A (3475-7415 A): 81% of all spectra 2006-2019 (M20 Table 1). Settings: 300 l/mm, 3.0" slit (default) (tilt 590 mil, 3475-7415 A, 7.2 A); 600 l/mm, 1.5" slit, blue (tilt 445 mil, 3540-5530 A, 1.8 A); 600 l/mm, 2.0" slit, red (tilt 752 mil, 5570-7570 A, 2.3 A); 1200 l/mm, 2.0" slit, Halpha region (tilt 850 mil, 6200-7200 A, 1.1 A). Era: Current (FAST3, since 2006 June). Optics and pixel size unchanged since 1994; earlier CCDs 2688 or 2720 x 512, 15 um.

Fit with the explorer model: (1) OFF-AXIS parabolic collimator, so colTilt is not 0 (the slit assembly clears the grating; F98 Sec. 3.4). (2) Camera is a folded Schmidt, drawn with cam "mirror"; the corrector plate is at the camera pupil 225 mm from the grating (camLen 225). (3) The 8.5 deg off-axis is the paraboloid parameter; the 35 deg camera-collimator angle sets the grating angles (alpha 22.5, beta 12.5 deg at 5500 A for 300 l/mm). (4) The 1200 l/mm setting has beta on the opposite side of the grating normal at 6563 A (alpha 41.9, beta -6.9 deg). (5) The slit is the 3.0" jaw; the 3.0" slit image is 4.9 px wide, so R ~ 760 is the geometric value.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| F98 | Fabricant, D., Cheimets, P., Caldwell, N. & Geary, J. 1998, PASP 110, 79, "The FAST Spectrograph for the Tillinghast Telescope" (bibcode 1998PASP..110...79F; 7 pp., IOP publisher PDF obtained through the ADS link gateway). The PDF text layer renders the degree sign as the digit 7, the minus sign as 2, the prime as 9, the double prime as 0, the micro sign as m and the exponent -1 as 21 (e.g. "mm21", "357" = 35 deg, "39" = 3 arcmin, "10 .5" = 1.5 arcsec); quotes below are given as extracted and each such case is read in the Notes. | `rawdata/presets/fast/Fabricant1998_PASP110_79_FAST.pdf` | https://ui.adsabs.harvard.edu/link_gateway/1998PASP..110...79F/PUB_PDF |
| M20 | Mink, J., Brown, W. R., Chilingarian, I. V., Fabricant, D., Kurtz, M. J., Moran, S., Rhee, J., Tokarz, S. & Wyatt, W. F. 2020, arXiv:2012.03470v1 (7 Dec 2020), "Center for Astrophysics Optical Infrared Science Archive I. FAST Spectrograph". Preprint as saved (journal reference not checked). | `rawdata/presets/fast/Mink2020_CAOISA_I_FAST_arXiv2012.03470.pdf` | https://arxiv.org/pdf/2012.03470 |

Not available: the CfA FLWO / Tillinghast and FAST web pages (pweb.gws.cfa.harvard.edu, tdc-www.harvard.edu): connection refused or timed out from this machine on 2026-11-17, so no web-page values are used.

## FLWO 1.5 m Tillinghast reflector / FAST (long-slit spectrograph at the Cassegrain focus; folded Schmidt camera; 300, 600, 1200 l/mm reflection gratings)

### Parameters

| parameter | value | unit | tag | source + location | verbatim quote | notes |
|---|---|---|---|---|---|---|
| telescope_aperture | 1524 | mm | SOURCED | F98, Table 2 (telescope prescription), primary mirror diameter | "Mirror 1524"<br>ALT: (F98, abstract: "1.5-m Tillinghast reflector") |  |
| telescope_plate_scale | 77 | um/arcsec | SOURCED | F98, Sec. 3.1 | "telescope scale of ∼77 mm arcsec21" | Approximate ("~77"); "mm" is the extraction of micrometers. The spherical primary has R = 27625.33 mm (Table 2, sign lost), i.e. f/9.06; the Cassegrain system is slower. |
| telescope_focal_ratio | 10.42 (effective Cassegrain focus) | f/# | DERIVED | F98, Sec. 3.1 | "telescope scale of ∼77 mm arcsec21" | DERIVED: F = 77e-6 m x 206264.8 / 1.524 m = 15.88 m / 1.524 m = 10.42. Cross-check: collimator focal length / beam = 963 / 93 = 10.35 (0.6% lower), consistent with the telescope pupil filling the collimated beam. The focal ratio itself is not stated in either source (NOT FOUND as a number). |
| corrected_field | 3 arcmin diameter (coma corrector) | arcmin | SOURCED | F98, Sec. 3.3 and Table 3 | "well corrected field about" | Extraction reads "39 in diameter" = 3 arcmin; Table 3 polychromatic rms image diameters 0.65"-1.25" for field angles 1.0-2.0 arcmin (field radius 1.5 arcmin is 0.81"). |
| coma_corrector | two fused-silica elements (4 glass-air surfaces), 966.579 mm before the focus |  | SOURCED | F98, Sec. 3.3, Table 2 | "two-element fused silica corrector design"<br>ALT: (F98, Sec. 4: "four in the coma corrector") |  |
| slit_length | 3 | arcmin | SOURCED | M20, Sec. 2.1, list of slits | "All slits are 3 arcmin long in the spatial direction"<br>ALT: (F98, abstract: "FAST has a 39-long slit") |  |
| slit_widths | 1.1, 1.5, 2.0, 3.0, 5.0 (M20); 1.0, 1.5, 2.0, 3.0, 5.0 (F98) | arcsec | CONFLICT | M20, Sec. 2.1 | "FAST has five slits with widths of 1.1, 1.5, 2.0"<br>ALT: (F98, Sec. 7: "fixed slits with widths of 10, 10 .5, 20, 30, and 50 are available") | F98 extraction: "10" = 1.0", "10 .5" = 1.5", "20" = 2.0", "30" = 3.0", "50" = 5.0" (double prime rendered as 0). The 1.0" vs 1.1" disagreement is listed under Conflicts. Slit changes are manual. |
| slit_default | 3.0 | arcsec | SOURCED | M20, Sec. 2.1; M20, Table 1, top row (81% of spectra, 2006-2019) | "Galaxy and supernova spectra are normally obtained with the 3.0 arcsec slit"<br>"300 590 3.0 3475—7415 7.2 81%" |  |
| collimator_type | off-axis parabolic mirror (parent focal length 963 mm) |  | SOURCED | F98, Sec. 3.4 | "an off-axis parabolic collimator appeared to be an attractive choice"<br>ALT: (M20, Fig. 1 caption: "reflects off of the collimator mirror at the bottom") |  |
| collimator_focal_length | 963 | mm | SOURCED | F98, Sec. 3.4 | "The focal length of the parent parabola of the FAST colli- mator is 963 mm" | The off-axis segment: the slit sits at the focus of the parent, 963 mm from the segment (INFERRED from "parent parabola"; the slit-collimator distance itself is not stated). |
| beam_diameter | 93 (design target ~100) | mm | SOURCED | F98, Sec. 3.4 | "producing a collimated beam diameter of 93 mm"<br>ALT: (F98, Sec. 3.1: "we adopted a collimated beam diameter of ∼100") |  |
| collimator_off_axis_angle | 8.5 (off-axis angle gamma of the parent parabola) | deg | SOURCED | F98, Sec. 3.4 | "A collimator off-axis angle of 87 .5 allows sufficient clearance between the slit assembly and the grating" | DERIVED: Extraction "87 .5" = 8.5 deg (7 = degree sign). Check with the quoted Schroeder blur b = 0.05 g v, v = half slit length = 1.5 arcmin ("19 .5" = 1.5 arcmin): b = 0.05 x 8.5 x 1.5 = 0.64", quoted 0.6". The 8.5 deg is the angle between the parent axis and the ray to the segment center; the chief ray is deviated by that angle, so the mirror normal is tilted by half of it (4.25 deg) from the incoming chief ray (INFERRED, same convention as the DEIMOS preset). Whether F98 means the deviation or the mirror tilt is not stated. |
| collimator_on_off_axis | OFF-AXIS (slit is NOT in the returning beam) |  | SOURCED | F98, Sec. 3.4 | "allows sufficient clearance between the slit assembly and the grating" | Verdict for the colTilt gate: off-axis; the beam leaves the collimator 8.5 deg from the incoming ray and the slit assembly clears the grating. Fig. 1 of F98 shows the slit plate at the top and the collimator mirror at the bottom with the grating beside the slit plate. |
| grating_groove_densities | 300, 600, 1200 | grooves/mm | SOURCED | M20, Sec. 2.1 | "FAST has three reflection gratings: a 300 line"<br>ALT: (F98, Sec. 7: "rently have 300 and 600 lines mm21") |  |
| grating_blaze | 300 and 600 l/mm: 4750; 1200 l/mm: 5700 | A (blaze wavelength) | SOURCED | M20, Sec. 2.1 | "blazed at 4750 Å, plus a 1200 line mm−1 grating blazed at 5700 Å"<br>ALT: (F98, Sec. 7: "gratings blazed at ∼4800") | DERIVED: Blaze angle (not published), first order, psi = 35 deg: sin(theta_B) = G lambda_B / (2 cos 17.5 deg): 300 l/mm 4.28 deg, 600 l/mm 8.59 deg, 1200 l/mm (5700 A) 21.0 deg. DERIVED. |
| grating_size | 128 x 154 (oversized) | mm | SOURCED | F98, Sec. 7 | "128 # 154" |  |
| camera_collimator_angle | 35 (design value used for Table 1) | deg | INFERRED | F98, Table 1 footnote a | "357 camera-collimator angle" | DERIVED: Extraction "357" = 35 deg. It is the design assumption of the Table 1 comparison, not stated as the as-built value; it is confirmed by three published numbers. With psi = 35 deg and f_cam = 331 mm: 300 l/mm centered 5500 A gives alpha = 22.5, beta = 12.5 deg, dispersion 1.475 A/px (Table 7: 1.47), anamorphic cos(alpha)/cos(beta) = 0.947, pupil anamorphism 1.056 (F98 Sec. 3.5.1: 1.06); 1200 l/mm at 6563 A (Table 5B center): pupil anamorphism 1.334 (published 1.33). 600 l/mm at 5500 A: 0.749 A/px (0.75); 1200 l/mm at 5500 A: 0.377 A/px (0.38). All DERIVED here. |
| grating_angles_300 | alpha 22.5, beta 12.5 (diffraction), tilt 5.0 deg from the bisector, at 5500 A | deg | DERIVED | F98, Table 1 footnote a | "357 camera-collimator angle" | DERIVED: sin(alpha)+sin(beta) = G lambda = 0.3/um x 0.55 um = 0.165; alpha = 17.5 + 4.96, beta = 17.5 - 4.96 deg (alpha > beta; the grating is tilted off the bisector by 4.96 deg). Grating tilt for other centers: M20 Appendix A. |
| camera_type | folded Schmidt: UBK-7 aspheric corrector plate, spherical primary mirror, flat fold mirror with a central hole for the CCD; the detector sits beside the fold mirror (no internal-focus obstruction by the dewar) |  | SOURCED | F98, Sec. 3.5.1; F98, Sec. 3.5.1 | "so we adopted a folded geometry"<br>"we adopted a Schmidt camera"<br>ALT: (M20, Fig. 1 caption: "imaged by a folded Schmidt camera onto a CCD detector") |  |
| camera_focal_length | 331 (effective); 350 (spherical mirror, R = 700 mm) | mm | SOURCED | F98, Sec. 3.5.1; F98, Table 4 | "The effective focal length of the camera is 331 mm, giving a demagnification of 2.91"<br>"5 ............ 700.00 333.93 Mirror 0" |  |
| camera_aperture_focal_ratio | aperture 133 mm; f/2.6 (design with 350 mm focal length, 100 mm beam) | mm; f/# | SOURCED | F98, Table 1; F98, Table 1 | "Camera F.L./aperture ................. 2.6 1.6"<br>"(mm) .............. 133 108" | DERIVED: f/2.6 = 350/133; with the effective 331 mm the as-built ratio is 331/133 = 2.5 (DERIVED). |
| camera_prescription | pupil (grating) to corrector 225.00; corrector UBK-7 8.00 thick; corrector to fold flat 283.96; fold to sphere 309.86 (sign reversed by the reflection); sphere to image 333.93; field flattener/dewar window silica R 108.28, 8.00 thick, 8.00 to image; "34 deg fold" | mm | SOURCED | F98, Table 4; F98, Table 4; F98, Table 4; F98, Table 4 | "Stop ........ Flat 225.00"<br>"3 ............ 234578.22 283.96"<br>"Flat 2309.86 Mirror 347 fold"<br>"6 ............ 108.28 8.00 Silica 0" | Table 4 extraction: "2309.86" = -309.86; "347 fold" = "34 deg fold" (the fold flat turns the beam by 34 deg is the natural reading; INFERRED, not stated). The "Stop" is the grating (camera pupil), 225 mm from the corrector plate ("camera-pupil distance of 225 mm", Table 1 footnote). |
| camera_demagnification | 2.91 |  | SOURCED | F98, Sec. 3.5.1 | "giving a demagnification of 2.91" |  |
| detector_current | 2688 x 512, 15 um pixels (FAST3: backside-illuminated UA STA520A, since 2006 June) | px; um | SOURCED | M20, Sec. 2.1; M20, Sec. 2.1 | "2688x512 UA STA520A"<br>"15 µm pixels"<br>ALT: (M20, Table 2: "FAST3 2006-06-20 2019-12-22 2688x512") |  |
| detector_1998 | 512 x 2688 pixels, 15 um (Loral, 40 mm long); FAST1/FAST2 thinned 2720 x 512 | px; um | SOURCED | F98, Sec. 3.1 | "pixel CCD with 15 mm pixels"<br>ALT: (M20, Table 2: "FAST1 1994-09-03 1998-04-18 2720x512")<br>ALT: (M20, Sec. 2.1: "all have had 15µm square") | F98 extraction splits "512 x 2688"; the 40 mm length = 2688 x 15 um ("The 40 mm length of this CCD"). Pixel size unchanged in all detectors. |
| detector_binning | 2x binning along the slit (spatial) is the normal setting |  | SOURCED | M20, Sec. 2.1 | "binning in the spatial direction" |  |
| pixel_scale_along_slit | 0.57 | arcsec/px (unbinned) | SOURCED | M20, Sec. 2.1 | "The spatial scale is always 0.57 arcsec"<br>ALT: (F98, Sec. 3.1: "sample the sky at about 00 .6") | DERIVED: 15 um x 2.91 / 77 um/arcsec = 0.567 arcsec (DERIVED); 2x binned 1.13 arcsec/px. |
| dispersion_and_coverage | 300 l/mm: 1.47 A/px, 3940 A; 600: 0.75, 2000; 1200: 0.38, 1000 (centered 5500 A) | A/px; A | SOURCED | F98, Table 7; F98, Table 7; F98, Table 7 | "300 ......... 3940 1.47 1.64"<br>"600 ......... 2000 0.75 1.55"<br>"1200 ........ 1000 0.38 1.37"<br>ALT: (M20, FITS header example, CD1_1: "CD1 1 1.47133255004883 Wavelength per pixel") | DERIVED: Last column of Table 7 = pixels per arcsec along the dispersion (header "Pixels Arcsec-1"): 1.64, 1.55, 1.37 px/arcsec. Model from the sourced pieces (f_cam 331, f_col 963, 77 um/arcsec, 15 um, psi 35 deg, centered 5500 A): 1.67, 1.58, 1.40 px/arcsec. Coverage check: 2688 px x 1.47 = 3951 A vs 3940 (M20: 3475-7415 = 3940). |
| wavelength_coverage_300 | 3475-7415 (3940 A), second order overlaps above ~6500 A | A | SOURCED | M20, Table 1; M20, Sec. 2.1 | "300 590 3.0 3475—7415 7.2 81%"<br>"Second-order light is thus present above" |  |
| grating_tilt_equations | 300: CW = 13.2 TILTPOS - 2400; 600: CW = 6.61 TILTPOS + 1600; 1200: CW = 3.29 TILTPOS + 5200 (TILTPOS in mils) | A | SOURCED | M20, Appendix A; M20, Appendix A; M20, Appendix A | "CW = 13.2"<br>"CW = 6.61"<br>"CW = 3.29" | DERIVED: Table 1 tilts: 300 l/mm 590 mil gives 5388 A (coverage center 5445); 600 l/mm 445 mil gives 4541 A (center 4535); 600 l/mm 752 mil gives 6571 A (center 6570); 1200 l/mm 850 mil (spacer, A4: 3.51 x 850 + 3850) gives 6834 A (center 6700). |
| grating_to_corrector_distance | 225 | mm | SOURCED | F98, Table 4 | "Stop ........ Flat 225.00" | Camera-pupil (grating) to corrector plate; this is camLen for the preset. |
| collimator_to_grating_distance | NOT PUBLISHED (about 963 mm INFERRED from Fig. 1) | mm | INFERRED | F98, Fig. 1 caption | "The Schmidt corrector plate is hidden behind the spherical camera mirror" | Fig. 1 (p. 80) is an unscaled isometric cutaway. The slit plate (top), the grating (top, beside the slit plate) and the collimator mirror (bottom, on the focus stage) show the slit-collimator and collimator-grating paths of about equal length, so collimator-grating ~ slit-collimator ~ 963 mm (INFERRED, SCHEMATIC; no dimension in the figure). |
| throughput | 26% peak (1996, after 2 years; telescope+spectrograph+CCD); ~35% typical peak after re-aluminization (2014) |  | SOURCED | F98, abstract | "system peak efficiency of 26%"<br>ALT: (M20, Sec. 2.2: "typically peaks around 35%") |  |
| slit_viewing | slit jaws inclined 20 deg to the input beam; guide field about 2 x 3 arcmin |  | SOURCED | F98, Sec. 6 | "jaws are inclined at 207 with respect to the input beam" | "207" = 20 deg; the field "2 0 # 3 0" = 2 arcmin x 3 arcmin. |
| object_count | 1 (long slit) |  | SOURCED | M20, Sec. 2.1 | "All slits are 3 arcmin long in the spatial direction" |  |

### Published performance (validation targets)

| quantity | value | kind | source + location | verbatim quote | notes |
|---|---|---|---|---|---|
| dispersion (300 l/mm, centered 5500 A) | 1.47 A/px | dlpix | F98, Table 7 | "300 ......... 3940 1.47 1.64" | M20 CD1_1 = 1.4713 A/px (header example) |
| dispersion (600 l/mm) | 0.75 A/px | dlpix | F98, Table 7 | "600 ......... 2000 0.75 1.55" |  |
| dispersion (1200 l/mm) | 0.38 A/px | dlpix | F98, Table 7 | "1200 ........ 1000 0.38 1.37" |  |
| coverage (300 l/mm) | 3940 A (3475-7415) | span | F98, Table 7; M20 Table 1 | "300 ......... 3940 1.47 1.64" |  |
| resolution FWHM, 300 l/mm, 3.0" slit | 7.2 A (method not stated) | FWHM | M20, Table 1 | "300 590 3.0 3475—7415 7.2 81%" | R = 5445/7.2 = 756 (DERIVED, at the coverage center; 5500/7.2 = 764). Geometric check: 3.0" x 1.64 px/arcsec x 1.47 A/px = 7.2 A, so the published resolution equals the slit-image width in Table 7 units (GEOMETRIC, not an arc-line FWHM). |
| resolution FWHM, 600 l/mm, 1.5" slit (blue) | 1.8 A | FWHM | M20, Table 1 | "600 445 1.5 3540—5530 1.8 13%" | 1.5 x 1.55 x 0.75 = 1.74 A (matches 1.8). |
| resolution FWHM, 600 l/mm, 2.0" slit (red) | 2.3 A | FWHM | M20, Table 1 | "600 752 2.0 5570—7570 2.3 2%" | 2.0 x 1.55 x 0.75 = 2.3 A. |
| resolution FWHM, 1200 l/mm, 2.0" slit | 1.1 A | FWHM | M20, Table 1 | "1200 850 2.0 6200—7200 1.1 1%" | 2.0 x 1.37 x 0.38 = 1.04 A. |
| abstract claim: 300 l/mm and 1.5" slit give 4000 A at 3 A | 3 A | FWHM | F98, abstract | "offers 4000 Å of spectral coverage at 3 Å resolution" | 1.5 x 1.64 x 1.47 = 3.6 A (the abstract is rounded; see Conflicts). |
| scale along the slit | 0.57 arcsec/px (unbinned) | pixScale | M20, Sec. 2.1 | "The spatial scale is always 0.57 arcsec" |  |
| pupil anamorphism (300; 1200 l/mm) | 1.06; 1.33 | anamorph | F98, Sec. 3.5.1 | "The pupil anamorphism is 1.06 and 1.33 with the 300" |  |
| throughput peak | 26% (1996); ~35% (2014) | throughput | F98, abstract | "system peak efficiency of 26%" |  |

### Optical layout (from the published figures)

Figures: F98 Fig. 1 (p. 80, isometric cutaway of the spectrograph with the access hatch removed; labels calibration periscope, integrating sphere, grating, slit plate, shutter, spherical camera mirror, graphite-epoxy tube, collimator mirror, focus stage, dewar), F98 Fig. 2 (p. 82, cutaway of the camera fold mirror, field flattening lens, CCD and dewar), M20 Fig. 1 (p. 2, schematic adapted from F98: "Light enters from the top, passes through the slit plate, reflects off of the collimator mirror at the bottom, is dispersed by a reflection grating, and then is imaged by a folded Schmidt camera onto a CCD detector. The CCD dewar extends to the bottom right."). None of the figures carries a scale, so nothing is MEASURED; element order and distances follow Tables 2 and 4 of F98.

Beam path: telescope coma corrector -> slit plate (top) -> down to the off-axis paraboloid collimator (bottom, on the focus stage) -> back up to the reflection grating (top, beside the slit plate) -> Schmidt corrector plate (camera pupil) -> flat fold mirror (hole in the center) -> spherical mirror -> back to a focus just past the fold flat, where the CCD sits in a dewar that extends to the lower right.

| element | tag | source |
|---|---|---|
| slit plate (fixed slits 1.1-5 arcsec wide, 3 arcmin long; polished jaws inclined 20 deg to the beam feed the guide camera) | SOURCED | F98 Sec. 6, 7; Fig. 1 (p. 80) |
| coma corrector (two fused-silica elements, 966.579 mm before the telescope focus) precedes the slit | SOURCED | F98 Table 2 |
| slit to collimator: 963 mm (slit at the focus of the parent parabola) | INFERRED | F98 Sec. 3.4 |
| collimator: off-axis paraboloid 8.5 deg off-axis, 93 mm beam; mounted on the focus stage at the bottom of the box (Fig. 1 of F98 and Fig. 1 of M20: light enters from the top, reflects off the collimator at the bottom) | SOURCED | F98 Sec. 3.4, Fig. 1; M20 Fig. 1 |
| collimator to grating: ~963 mm, grating at the top beside the slit plate, reflection grating, camera-collimator angle 35 deg | SCHEMATIC (distance); angle INFERRED from Table 1 footnote | F98 Fig. 1, Table 1 |
| grating to Schmidt corrector plate (UBK-7 aspheric, at the camera pupil): 225 mm | SOURCED | F98 Table 4 |
| corrector to flat fold mirror 283.96 mm; fold to spherical mirror (R = 700 mm) 309.86 mm; mirror back to the focus 333.93 mm, the focus lying just beyond the fold flat, whose center is bored out to pass the light to the CCD; "34 deg fold"; dewar extends to the lower right (M20 Fig. 1) | SOURCED (distances) / MEASURED not possible (no scale) | F98 Table 4, Fig. 2; M20 Fig. 1 caption |
| field flattener / dewar window (silica, R 108.28 mm, 8 mm thick) 8 mm before the CCD | SOURCED | F98 Table 4 |

### On-/off-axis verdict (deploy gate)

OFF-AXIS. F98 Sec. 3.4: "an off-axis parabolic collimator appeared to be an attractive choice. A collimator off-axis angle of 87 .5 [8.5 deg] allows sufficient clearance between the slit assembly and the grating." The slit does not stand in the returning beam. colTilt: 4.25 deg is INFERRED (half the 8.5 deg off-axis angle); F98 does not state the mirror tilt.

### NOT FOUND

- Cassegrain focal ratio of the 1.5 m as a stated number (derived 10.42 from the 77 um/arcsec plate scale; the CfA/FLWO web pages for the telescope and FAST could not be reached from this machine: connection refused/timeouts on pweb.gws.cfa.harvard.edu and tdc-www.harvard.edu)
- Collimator-to-grating distance and any scaled layout dimension (no dimensioned layout figure; Fig. 1 of F98 and Fig. 1 of M20 are unscaled schematics)
- Grating blaze angles and as-built camera-collimator angle (derived: 35 deg design value from F98 Table 1 footnote, confirmed by the published dispersions and anamorphism)
- Measured arc-line resolving power (M20 Table 1 gives "Res." in A without a method; consistent with the geometric slit width)
- Order-sorting filter details (M20: "Blocking filters are available but in practice never used")
- Collimator off-axis geometry in the plane of the dispersion: F98 does not say whether the 8.5 deg off-axis lies in or across the dispersion plane (Fig. 1 suggests the slit-collimator axis and the collimated beam both lie in the box plane; INFERRED)

### Conflicts between sources

- Slit widths: F98 Sec. 7 gives 1.0 arcsec (extracted "10") for the narrowest slit, M20 gives 1.1 arcsec. M20 is the later document; the web pages could not be checked.
- Resolution with the 1.5" slit and 300 l/mm: F98 abstract says 3 A at "4000 A" coverage; Table 7 numbers give 3.6 A and 3940 A coverage.
- Blaze of the 300 and 600 l/mm gratings: F98 "~4800 A", M20 4750 A.
- Peak throughput: 26% (F98, 1996, telescope optics dirty) vs ~35% (M20, after primary re-aluminization).
- Collimated beam: F98 abstract and Sec. 3.1 "~100 mm" vs Sec. 3.4 93 mm (the 93 mm is the as-designed value from the 963 mm parent and is used).
- CCD format: 2688 x 512 (F98, FAST3) vs 2720 x 512 (FAST1, FAST2 per M20 Table 2).
- Camera focal length: 350 mm (spherical mirror, Table 1/Table 4 R = 700 mm) vs effective 331 mm (Sec. 3.5.1); the effective value matches the demagnification 2.91 and the dispersions.

### Notes

- The model reproduces the published numbers from the sourced pieces: dispersion 1.47, 0.75, 0.38 A/px, px per arcsec 1.67, 1.58, 1.40 against 1.64, 1.55, 1.37 (Table 7; the 1200 l/mm model centered at 5500 A), pupil anamorphism 1.057 / 1.334 against 1.06 / 1.33, pixel scale 0.567 against 0.57 arcsec. These checks are DERIVED here.
- The 2.0" and 1.5" slits are the usual choice for stellar work, the 3.0" slit for galaxies and supernovae (M20).
- An atmospheric dispersion corrector has been installed since 2010 August (M20 Sec. 3); it does not change the spectrograph prescription.
- M20 Fig. 2 and F98 Fig. 4 give throughput curves (peak 35% and 26%).
