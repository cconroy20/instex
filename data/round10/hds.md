# Round 10 (2026-11-18): HDS, the High Dispersion Spectrograph of the Subaru Telescope (id `hds`)

Subaru 8.2 m optical Nasmyth echelle spectrograph (first light 2000, open use 2001). Same rules as rounds 1-9 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/hds/`; each value carries the source key, location and a short verbatim quote; DERIVED marks arithmetic done here, EFFECTIVE a fitted value, INFERRED a reading that is not stated; MEASURED a value read from a figure. Quote check (machine, `pdftotext -layout` and `-raw` text of the PDFs, ADS abstract text and tag-stripped HTML; whitespace, case, quotes, dashes, hyphenation and ligatures normalized): **116 quote pieces, 0 failures.** The design paper (Noguchi et al. 2002, supplied by the user, key N02) is quoted in full; the 2014 user manual (M14) carries Table 6, the order tables and the FITS example; the 1998 SPIE abstract (N98) is the ADS abstract only.

## Completeness summary

**Complete from the open literature:** the feed (optical Nasmyth, f/12.5 into the slit per the paper, F/12.708 with image rotators, 8.2 m, 2.0 arcsec/mm), the slits (continuous 0.2-4 arcsec, 30 deg inclined; 0.4 arcsec standard, R = 90,000; image slicers), the collimator (off-axis parabola, f about 3400 mm, 272 mm beam, 5 deg off the slit axis), the echelle (31.6 /mm, R2.8, blaze 71.5 deg in the paper and 71.25 deg in the manual, 1 x 2 mosaic of two 12 x 16 inch gratings, ruled 12 x 32 inch, quasi-Littrow with a 12 deg angle), the cross-dispersers (400 and 250 /mm, 2 x 1 mosaics, first order, 45 deg turn), the camera (catadioptric, 770 mm, f/0.96 mirror of 800 mm, 610 mm correctors), the CCDs (two EEV CCD42-80, 13.5 um, 1.1 mm gap), the standard setups, two 99-order tables, a pixel-level order table, a measured instrumental profile (Table 3) and the dimensioned optical layout (Fig. 1 of the paper).

**Not found:** the camera prescription, the grating angles as numbers, the slit width of R = 160,000. **Conflicts:** blaze 71.5 / 71.25, ruled length 812.8 / 840 mm, collimator 3400 / 3300 mm (see Conflicts); the earlier gamma, pixel-scale and order-separation puzzles are resolved by the paper.

## Sources

| key | document | local file (rawdata/presets/hds/) | URL |
|---|---|---|---|
| M14 | Aoki, W., Helminiak, K. & Tajitsu, A. 2014, "Subaru Telescope High Dispersion Spectrograph (HDS) User Manual, Ver. 2.0.0" (Subaru Telescope/NAOJ, January 2014; 48 pp; the Subaru page names it V2.0.0, Oct. 2014; clean text layer; Figure 1 is the optical layout, Table 1 the system table, Table 6 the standard setups, Sec. 5.1 the order tables, Sec. 5.3 a FITS header and an ASCII order table). Page numbers below are the manual's own. | ume_v200.pdf | https://www.naoj.hawaii.edu/Instruments/HDS/ume_v200.pdf (also https://subarutelescope.org/Observing/Instruments/HDS/ume_v200.pdf) |
| T12 | Tajitsu, A., Aoki, W. & Yamamuro, T. 2012, PASJ 64, 77, "Image Slicer for the Subaru Telescope High Dispersion Spectrograph" (ADS 2012PASJ...64...77T; title checked on ADS; arXiv:1203.5568; clean text layer) | Tajitsu2012_arXiv1203.5568.pdf | https://arxiv.org/pdf/1203.5568 |
| H04 | Honda, S., Aoki, W., Kajino, T., et al. 2004, ApJS 152, 113, "Spectroscopic Studies of Extremely Metal-Poor Stars with the Subaru High Dispersion Spectrograph. I. Observational Data" (ADS 2004ApJS..152..113H; arXiv:astro-ph/0402291; used only for the slit widths and R actually used) | Honda2004_arXiv-astro-ph0402291.pdf | https://arxiv.org/pdf/astro-ph/0402291 |
| I04 | Iye, M., Karoji, H., Ando, H., et al. 2004, PASJ 56, 381, "Current Performance and On-Going Improvements of the 8.2 m Subaru Telescope" (arXiv:astro-ph/0405012; Table 2 gives the focal configurations; Sec. 3.3 describes HDS) | Iye2004_arXiv-astro-ph0405012.pdf | https://arxiv.org/pdf/astro-ph/0405012 |
| N02 | Noguchi, K., Aoki, W., Kawanomoto, S., et al. 2002, PASJ 54, 855, "High Dispersion Spectrograph (HDS) for the Subaru Telescope" (ADS 2002PASJ...54..855N; title checked on ADS; supplied by the user; 10 pages, journal pp. 855-864; text layer present; Fig. 1 is the dimensioned top and side view of the optical layout, p. 856 (PDF p. 2); Table 1 on p. 857; Secs. 2.1-2.6 pp. 857-860). Page numbers below are journal pages. | noguchi2002_pasj54_855.pdf | https://academic.oup.com/pasj/article/54/6/855/1551281 |
| N98 | Noguchi, K., Aoki, W., Kawanomoto, S., et al. 1998, Proc. SPIE 3355, 354, "High-dispersion spectrograph (HDS) for SUBARU Telescope" (ADS 1998SPIE.3355..354N; title checked on ADS). Not saved (SPIE refuses automated access); only the ADS abstract (ads_1998SPIE.3355..354N.json) is used. The design-era detector (15 um pixels) differs from the as-built 13.5 um. | ads_1998SPIE.3355..354N.json (ADS record, abstract only) | https://doi.org/10.1117/12.316771 |
| SE | Subaru Telescope, "HDS (High Dispersion Spectrograph)", About the Subaru Telescope, English page (Fast Facts) | subaru_en_hds.html | https://subarutelescope.org/en/about/instrument/hds/index.html |
| SI | Subaru Telescope, "HDS" instrument page, For Researchers and Students (observing page; current) | subaru_HDS_index.html | https://subarutelescope.org/Instruments/HDS/ |

Also saved, not quoted: ume_node6/7/8/20/21/27.html (the HTML version of the manual, same content), naoj_HDS_intro.html (a navigation page).

## HDS parameters

### Telescope and feed

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Focus | optical Nasmyth platform of the Subaru Telescope (permanent installation in a refrigerated container) |  | M14, Sec. 2.2, p. 6 | "HDS is located at one of the Nasmyth foci (the so-called Optical Nasmyth) of the Subaru Telescope" |
| Primary aperture | 8.2 | m | I04, Sec. 2.1, p. 2 | "The Subaru Telescope has an 8.2 m F/1.83 primary" |
| Optical Nasmyth with image rotator: focal length, pupil, F, plate scale | 104207.0 mm; pupil 8200 mm; F/12.708; 1.979385 arcsec/mm |  | I04, Table 2, p. 3 | "Focal length (mm) 15000 100000 104207.0 102244.5" |
| Optical Nasmyth, effective F ratio and plate scale (same row set) | F/12.708; 1.979385 arcsec/mm |  | I04, Table 2, p. 3 | "Effective F ratio 1.83 12.195 12.708 12.469" |
| Plate scale at the slit | 2.0 | arcsec/mm | M14, Sec. 3.1.3, p. 18 | "The image scale at the Nasmyth focus is 2.0 arcsec/mm, or 0.5 mm to 1 arcsec" |
| Plate scale (HDS FITS sample header, 1999) | DERIVED: FOC-LEN 104207.0 mm, F-RATIO 12.71 -> 1.979 arcsec/mm (DERIVED: 206265 / 104207 = 1.979) |  | M14, Sec. 5.3, p. 44 (sample FITS header) | "Focal length of the telescope (mm)" |
| Slit width range | 10-2000 um (0.02-4 arcsec), continuously variable |  | M14, Table 1, p. 7; Sec. 3.1.3, p. 18 | "The slit width can be set between 0.2 and 4 arcsec." |
| Slit length range | 1000-30000 um (2-60 arcsec); 60 arcsec (30 mm) in single-order long-slit mode |  | M14, Table 1, p. 7; Sec. 3.1.3, p. 19 | "The maximum slit length is 60 arcsec (30 mm)." |
| R times slit width (design relation) | slit width (mm) = 1.8e4 / R, e.g. R = 90,000 at 0.2 mm = 0.4 arcsec |  | M14, Sec. 3.1.3, p. 18 | "slit width (mm)=1.8 x 104 /resolution (R)" |
| Standard slit | 0.4 arcsec (200 um): R about 90,000 |  | M14, Sec. 2.3, p. 9 | "A standard slit width (0.4 arcsec) provides a resolving power of R" |
| Standard slit R | 90,000 (3.3 km/s) |  | M14, Sec. 2.3, p. 9 | "90,000 (3.3 km/s)" |
| Slits used in the metal-poor-star survey (commissioning) | 0.4 arcsec (200 um) -> R 90,000; 0.72 arcsec (360 um) -> R 50,000; 0.36 arcsec once |  | H04, Sec. 2.2, p. 5 | "was set to 0.4 arcsec (200 µm) or 0.72 arcsec (360 µm), which corresponds to a spectral resolving power of R ≃ 90,000 or 50,000" |
| Limiting R (two-pixel sampling) | about 165,000 (1.8 km/s) with 2 pixel (27 um) sampling |  | M14, Sec. 2.3, p. 9 | "The limiting spectral resolving power, R ~ 165,000 (1.8 km/s), is achieved with two pixel" |
| Maximum R (Subaru page) | 100,000 typical, maximum 160,000 |  | SE, Fast Facts, Specifics | "Spectral resolution: 100,000 with maximum resolving power of 160,000" |
| R with the 0.3 arcsec slit (measured on Th-Ar) | about 114,000 (115,000 quoted in the introduction) |  | T12, Sec. 3.2, p. 6; Sec. 1, p. 2 | "the resolution is 114,000 when using a 0.3 arcsec slit without the image slicer" |
| R with the 0.3 arcsec slit (alt) | 115,000 (150 um) |  | T12, Sec. 1, p. 2 | "When a slit of 0.3 arcsec (150 µm) width is applied, the resolving power is 115,000" |
| Image slicers (pre-slit, slit set to 4 arcsec when mounted) | IS#1 0.3" x 5 slices R = 110,000; IS#2 0.45" x 3, R = 80,000; IS#3 0.2" x 3, R = 165,000; all Bowen-Walraven, fused silica |  | M14, Sec. 2.4, p. 15; Sec. 3.1.3 Table 3, pp. 19-20 | "The currently available slicers allow for the effective resolving power of 110,000 (IS#1), 80,000 (IS#2) or 165,000 (IS#3)." |
| Image slicer #1 (paper) | five slices, each 0.3 arcsec x 1.5 arcsec, R = 110,000, opened to common use August 2011 |  | T12, Abstract, p. 1; Sec. 1, p. 2 | "providing five 0.3 arcsec × 1.5 arcsec images" |
| Image slicer sliced-image size | 0.3 arcsec x 7.8 arcsec per slice set; slicer sits 6.32-8.51 mm ahead of the slit; the collimator is shifted 7.3 mm to refocus |  | T12, Table 1, p. 5; Sec. 3.1, p. 5 | "This results in a shift of the collimator" |
| Spectra on the detector | INFERRED: 1 | object | M14, Sec. 3.1.3, p. 18 (slit and slicers) | "The amount of sky observed is determined by the slit length." |
| Slit length without order overlap (red cross-disperser) | 4.8" at 4000 A, 6.2" at 4500, 7.6" at 5000, 14.8" at 7000, 30.2" at 10000 A |  | M14, Table 2, p. 19 | "7000Å Red 7.4 14.8" |
| Slit length without order overlap (blue cross-disperser) | 4.4" at 3100 A, 5.8" at 3500, 7.6" at 4000, 9.8" at 4500 A |  | M14, Table 2, p. 19 | "4500Å Blue 4.9 9.8" |
| Filters before the collimator | two six-position wheels behind the slit (Free, SQ, ND1, OG530, KV408 / SC46, SC42, GG495, KV389, KV370); the collimator is re-focused for filter thickness |  | M14, Table 1, p. 7; Sec. 3.1.4, p. 20 | "The standard position of the collimator is determined for one filter with a thickness" |
| Focal ratio into the slit (design paper) | f/12.5 |  | N02, Sec. 2, p. 857 | "light from the telescope (f/12.5) enters from the left" |
| Focal ratio quoted by the manual and by Iye et al. | F/12.6 (manual, Iye text); Iye Table 2 gives F/12.708 for the optical Nasmyth with image rotators |  | M14, Sec. 2.4, p. 15 | "in the F/12.6 focal plane of the telescope" |
| Slit position angle and tilt | the slit is set about 30 deg from the horizontal (to make the slit image horizontal on the focal plane); the slit plane is tilted 15 deg from the telescope focal plane toward the slit viewer | deg | N02, Sec. 2.1, p. 857 | "The entrance slit is set at about 30" |
| Slit width and length ranges (paper) | 0.01-2 mm (0.2-4 arcsec; the paper prints 0.2 arcsec as the lower limit) wide, 1-30 mm (2-60 arcsec) long | mm | N02, Sec. 2.1, p. 857 | "Both the slit width and the slit length can be changed continuously in the ranges between 0.01 and 2mm" |
| Effect of the 30 deg slit inclination on the width | the effective width of the slit along the echelle dispersion is larger by 1/cos 30 deg = 1.155 than the mechanical width: 0.4 arcsec (mechanical) corresponds to about 3.8 pixels |  | N02, Sec. 2.5, p. 859 | "the effective width of the slit along the echelle dispersion direction is larger by" |
| Measured R (paper) | R = 100,000 at a 0.35 arcsec slit (the specification), measured on the FWHM of unsaturated Th lines; up to about 160,000 with a narrower slit (Fig. 6 gives R against slit width; the figure has no numbers in the text) |  | N02, Sec. 6.1, p. 862 | "We found that HDS achieves its specification (R = 100000 by" |
| R at 0.4 arcsec (paper) | R = 90,000 for the standard configuration with a 0.4 arcsec slit |  | N02, Abstract, p. 855 | "A standard configuration with a" |

### Collimator and beam

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Collimator type (red) | off-axis parabola |  | M14, Table 1, p. 7 | "collimator red off-axis parabola" |
| Collimator type (blue) | off-axis parabola (two collimator mirrors, blue and red, user selected) |  | M14, Table 1, p. 7; Sec. 2.2, p. 8 | "blue off-axis parabola" |
| Collimated beam diameter | 272 | mm | N02, abstract | "The collimated beam size is 272mm" |
| Collimated beam diameter (alt) | 272 | mm | SI, Introduction text | "collimated into a 272 mm-diameter beam" |
| Collimator focus shift with filters | the collimator unit slides slightly along the slit axis to refocus for the filter glass |  | M14, Sec. 2.2, p. 8 | "the collimator unit can slightly shift relative to the direction of the slit for focusing" |
| Collimator type | two off-axis parabolic mirrors (blue and red, aluminized; one overcoated for each region); user selected |  | N02, Sec. 2.2, p. 858 | "The f/12.5 light cone is collimated by either of two off-axis" |
| Collimator type (Table 1) | off-axis parabola |  | N02, Table 1, p. 857 | "collimator: off-axis parabola" |
| Collimator focal length | about 3400 mm (the manual says "3.3m away from the slit"; Fig. 1 side view dimensions the slit-to-collimator distance 3396.51 mm) | mm | N02, Sec. 2.2, p. 858 | "The collimator focal length is about 3400mm." |
| Slit-to-collimator distance (Fig. 1 dimension) | FIGURE: 3396.51 | mm | N02, Fig. 1, side view, p. 856 | "" |
| Collimator focal length (manual) | 3300 | mm | M14, Sec. 2.2, p. 8 | "The f/12 light cone is collimated into a 27cm beam with a collimator mirror mounted 3.3m away from the slit." |
| Collimator focal ratio | DERIVED: f/12.5 = 3400 / 272 (DERIVED; matches the paper's f/12.5 cone); the manual gives f/12 (3300 / 272 = 12.1) |  | N02, Sec. 2.2, p. 858 | "The f/12.5 light cone is collimated by either of two off-axis" |
| Collimator tilt (off-axis angle) | MEASURED: about 5 deg between the slit-collimator axis and the collimated beam running to the echelle: the Fig. 1 side view labels 5 deg at the cross-disperser housing and the line from the collimator to the echelle rises 4.9 deg (MEASURED, 77 px over 900 px at 300 dpi). The explorer's colTilt is half of this: 2.5 deg (INFERRED: the paper does not call this the off-axis angle) | deg | N02, Fig. 1, side view, p. 856 | "" |
| On-axis or off-axis (deploy gate) | OFF-AXIS: "The beam is collimated by an off-axis parabolic mirror"; the collimated beam leaves 5 deg from the slit axis (Fig. 1) and the slit does not stand in the returning beam |  | N02, Sec. 2, p. 857 | "The beam is collimated by an off-" |

### Echelle

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Echelle groove density | 31.6 | grooves/mm | M14, Table 1, p. 7 | "31.6 grooves/mm, blaze angle 71.25 degrees" |
| Echelle blaze angle (manual) | 71.25 | deg | M14, Table 1, p. 7 | "blaze angle 71.25 degrees" |
| Echelle blaze (alt, Subaru page) | 71.3 | deg | SI, Introduction text | "31.6 lines/mm echelle blazed at 71.3 degrees" |
| Echelle blaze (alt, the design paper) | DERIVED: R2.8 (tan theta = 2.8, theta = 70.35 deg, DERIVED: arctan 2.8) |  | N02, abstract | "R = 2.8" |
| Echelle blaze (alt, the 1998 design paper) | R2.8 |  | N98, abstract | "R-2.8" |
| Echelle angle (default) | 0.25 deg (900 arcsec) default; detector rotation -1 deg | deg | M14, Sec. 3.3, p. 26 | "Default echelle and detector rotation angles are 0.25 deg (900 asec)" |
| Mount | quasi-Littrow |  | I04, Sec. 3.3, p. 8 | "The HDS is a Nasmyth echelle spectrograph with a quasi-Littrow configuration" |
| Echelle blaze angle (design paper, Table 1) | 71.5 | deg | N02, Table 1, p. 857; Sec. 2.3, p. 858 | "blaze angle = 71" |
| Echelle blaze angle (text) | 71.5 deg; "along with the 12 deg collimator-to-cross disperser angle" it makes the beam fit a 12 x 16 inch cross-disperser mosaic | deg | N02, Sec. 2.3, p. 858 | "blaze an-gle, along with the 12" |
| Echelle ruled area | a 1 x 2 mosaic of two 12 inch by 16 inch R2.8 gratings (Richardson Grating Lab.): ruled area 12 inch by 32 inch = 304.8 mm by 812.8 mm (DERIVED; the abstract's "300 mm by 840 mm in total size" includes the blank) | mm | N02, Sec. 2.3, p. 858 | "for a ruled area of 12 inch by 32 inch" |
| Echelle mosaic | two masters aligned within 0.5 arcsec (3.5 um shift at the focal plane); not phased before the replica was made; replica of two aligned masters |  | N02, Sec. 2.3, p. 858 | "We made no attempt to phase two masters before making a replica" |
| Echelle mosaic purpose | no vignetting at the ends of the echelle when used at the blaze angle; less than 1 percent vignetting above 71.5 deg |  | N02, Sec. 2.3, p. 858 | "there is no vignetting at the ends of the echelle" |
| Echelle ruled size (abstract) | 300 mm by 840 mm in total size | mm | N02, Abstract, p. 855 | "the echelle is 300mm by 840mm in total size" |
| Beam footprint on the echelle | DERIVED: 272 / cos(71.5 deg) = 858 mm and 272 / cos(71.25 deg) = 847 mm exceed the 812.8 mm ruled length by 4-5 percent; at the R2.8 angle, 272 / cos(70.35 deg) = 809 mm fits (DERIVED). The paper claims no vignetting at the blaze angle. | mm | N02, Sec. 2.3, p. 858 | "there is no vignetting at the ends of the echelle" |
| Mounting and collimator-to-cross-disperser angle | quasi-Littrow, with a collimator-to-cross disperser angle of 12 deg | deg | N02, Sec. 2, p. 857 | "The echelle is used in a quasi-Littrow mounting with a collimator-to-cross disperser angle of 12" |
| Echelle out-of-plane angle gamma | INFERRED: 6.0 deg (INFERRED = half of the 12 deg angle; Fig. 1 top view draws the 12 deg between the slit-collimator axis and the beam from the echelle to the cross-disperser, in the plane perpendicular to the echelle dispersion, which Fig. 1 side view shows as the plane of the 71 deg incidence). It agrees with the 5.97 deg that the manual's order table requires (m x lambda_center = 59,607 nm = 2 d sin(71.25 deg) cos(gamma)), so the fit is no longer an adjustment. | deg | N02, Sec. 2, p. 857; Fig. 1 top view, p. 856 | "quasi-Littrow mounting with a collimator-to-cross disperser angle of 12" |
| Echelle spectral resolution and ghosts | the echelle alone gives R above 500,000; ghost intensity below 0.004 percent between orders 95 and 96 at 6328 A (He-Ne laser) |  | N02, Sec. 2.3, p. 858 | "The spectral resolution of the echelle is higher than R = 500000." |
| Ghost measurement | less than 0.004 percent at 6328 A (He-Ne) between the 95th and 96th orders |  | N02, Sec. 2.3, p. 858 | "The intensity is less than 0.004%" |
| Groove density choice | the 31.6 /mm ruling matches the echelle free spectral range to the 55 mm by 55 mm CCD mosaic in the red; the FSR exceeds the detector width above about 7200 A |  | N02, Sec. 2.3, p. 858 | "which matches the echelle free spectral range (FSR) to a width of" |

### Cross-dispersers and the camera

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Blue cross-disperser | 400 grooves/mm, blaze angle 4.76 deg (blazed at 4150 A); reflection grating |  | M14, Table 1, p. 7 | "400 grooves/mm, blaze angle 4.76 degrees" |
| Red cross-disperser | 250 grooves/mm, blaze angle 5.00 deg (blazed at 7000 A) |  | M14, Table 1, p. 7 | "250 grooves/mm, blaze angle 5.00 degrees" |
| Cross-disperser blazes (alt) | blue 400 lines/mm blazed at 4150 A; red 250 lines/mm blazed at 7000 A |  | SI, Introduction text | "for the blue region (400 lines/mm, blazed at 4150A)" |
| Cross-disperser selection | one of two gratings (blue, red); a plane mirror replaces them in single-order long-slit mode |  | M14, Sec. 2.2, p. 8 | "Instead of the cross dispersers, a plane mirror can be used" |
| Cross-scan angles of the standard setups | see the Settings table (arcsec, deg) |  | M14, Table 6, p. 26 | "StdBc 355-431 445-521 Blue 20020 (5.561) Free,Free" |
| Camera type | catadioptric: three corrector lenses, a spherical primary mirror and a field-flattening lens; focus by moving the detector unit |  | M14, Sec. 2.2, p. 8 | "The camera consists of three corrector lenses, a spherical primary mirror, and a field-" |
| Camera focal length | 770 | mm | M14, Table 1, p. 7 | "camera system focal length 770 mm" |
| Camera image quality (design, 1998) | 10 um images on average in a flat 60 mm focal plane, 0.30-1.1 um without refocusing |  | N98, abstract | "It delivers 10-micrometer images on average within a flat 60 mm-" |
| Detector | two EEV 42-80 CCDs, each 4100 x 2048 pixels, 13.5 um; mosaic 55 x 55 mm effective (4100 x 4096 pixels) |  | M14, Sec. 2.2, p. 9 | "A mosaic of two CCDs (EEV 42-80 CCD) is used as the detector." |
| Pixel size and format | 13.5 um; 4100 x 2048 x 2 |  | M14, Table 1, p. 7 | "EEV CCD 4100 pix" |
| Gap between the two CCDs | 1.1 | mm | M14, Sec. 2.2, p. 9 | "though a 1.1 mm gap between the two CCDs exists" |
| Effective detector | 55 mm by 55 mm (4100 by 4096 pixels) | mm | M14, Sec. 2.2, p. 9 | "the effective detector size is 55 mm by 55 mm (4100 by 4096 pixels)" |
| Detector orientation | INFERRED: dispersion along the 4100-pixel axis; the two CCDs sit side by side across the dispersion (INFERRED from Sec. 5.3: an order runs Y = 4096 -> 1, orders are stacked in X, 0.00166 nm/pixel along Y) |  | M14, Sec. 4.6, p. 35; Sec. 5.3, p. 44 | "by 4100 (dispersion direction) pixels" |
| Readout and gain | read noise 4.4 e-; gain about 1.7 e-/ADU |  | M14, Sec. 2.3, p. 12 | "The readout noise of the CCDs is 4.4" |
| Cross-disperser mosaic | each is a 2 x 1 mosaic of 12 inch by 16 inch gratings, joined along the ruling length: effective ruling length 24 inch (610 mm), ruled width 16 inch (406 mm); first order; efficiency peaks at about 3500 A (blue) and 6000 A (red) |  | N02, Sec. 2.4, pp. 858-859 | "Each cross-disperser is a 2 by 1 mosaic of 12 inch by 16 inch grat" |
| Cross-disperser order | both used in the first order |  | N02, Sec. 2.4, p. 858 | "Both are used in the first order." |
| Cross-disperser Table 1 | 250 /mm (red); 400 /mm (blue); plane mirror |  | N02, Table 1, p. 857 | "cross-disperser: 1." |
| Angle between the beam from the echelle and the beam to the camera at the cross-disperser | FIGURE: 45 deg | deg | N02, Fig. 1 top view, p. 856 (label "45") | "" |
| Cross-disperser angle (the model's xPsi) | DERIVED: xPsi = 45 deg; checked: with the grating equation sin(a)+sin(b) = G lambda at 562.334 nm and a - b = 45 deg, the order separation per nm is 0.3196 mm/nm (blue) and 0.2025 mm/nm (red) at f = 770 mm, against 0.3221 and 0.2013 from the manual's order tables (0.8 and 0.6 percent), and the grating tilt from the bisector comes out 5.4 deg (StdBc, 438 nm) and 4.3 deg (StdYb) against the Table 6 cross angles 5.56 and 4.41 deg (DERIVED; computed in this record) | deg | N02, Fig. 1 top view, p. 856 | "" |
| Camera design | catadioptric: three fused-silica corrector lenses, a spherical primary mirror and a field flattener (HIRES-like with one more corrector); all-spherical; covers a 6.5 deg field; images the whole 0.30-1.1 um range without refocusing; more than 90 percent of the rays within 10 um on a flat focal plane |  | N02, Sec. 2.5, p. 859 | "The HDS camera consists of three corrector lenses" |
| Camera focal length (paper) | 770 | mm | N02, Sec. 2.5, p. 859 | "A camera focal length of 770mm images the entrance slit" |
| Camera mirror | f/0.96, about 800 mm aperture; corrector aperture about 610 mm | mm | N02, Sec. 2.5, p. 859 | "f/0.96 camera mirror" |
| Corrector aperture | 610 | mm | N02, Sec. 2.5, p. 859 | "must be about 610mm" |
| Camera spot size | more than 90 percent of the rays within a 10 um diameter on the flat focal plane |  | N02, Sec. 2.5, p. 859 | "more than 90% of the incident rays are focused within a 10" |
| Camera focal ratio | DERIVED: 770 / 272 = f/2.83 (DERIVED; the dispersed beams are elliptical, the mirror f/0.96 collects the full 610 mm beam envelope) |  | N02, Sec. 2.5, p. 859 | "A camera focal length of 770mm images the entrance slit" |
| Pixel scale (paper) | 0.12 arcsec/pixel; 0.138 arcsec/pixel along the slit image (the 30 deg slit inclination); 0.4 arcsec mechanical = 3.8 pixels |  | N02, Sec. 2.5, p. 859 | "The pixel scale determined by the telescope focal length and the camera one is" |
| Pixel scale along the slit image | 0.138 | arcsec/pixel | N02, Sec. 2.5, p. 859 | "the effective pixel scale along the slit image on the detector is" |
| Pixel scale (Subaru page) | 0.138 arcsec/pixel |  | SE, Fast Facts, Specifics | "Pixel scale: 0.138"/pixel" |
| Pixel scale (check) | DERIVED: 2.0 arcsec/mm x 3400 / 770 x 0.0135 mm = 0.119 arcsec/pixel (DERIVED; with 3300 mm 0.116); 0.12 / cos 30 deg = 0.139 |  | N02, Sec. 2.2 and 2.5, pp. 858-859 | "The collimator focal length is about 3400mm." |
| Detector (paper) | mosaic (2 by 1) of EEV CCD42-80, 4100 x 2048 format, 13.5 um pixels, thinned, back illuminated; flat to about 10 um; read noise about 5 ADU, gain about 1.7 e-/ADU |  | N02, Sec. 2.6, p. 860 | "a mosaic (2 by 1) of EEV CCD42-80" |
| Detector (Table 1) | 4100 x 4096 pixels by 2 CCDs, 13.5 um |  | N02, Table 1, p. 857 | "detector: CCD 13.5" |
| CCD dewar | the dewar and its three spiders stand inside the chromatic beam, so are made small to limit the shadow; the support frame moves along the optical axis (5 um accuracy, focus) and rotates about it (aligns the slit image to the pixel rows) |  | N02, Sec. 2.7, p. 860 | "the CCD dewar is located in the chromatic light beams from the cross" |

### Throughput and efficiency

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Total efficiency (telescope + HDS + detector) | 13 percent at 5000-6000 A; 8 percent at 4000 A |  | N02, abstract | "is about 13% in 5000-6000Å and about 8% at 4000Å" |
| Wavelength range of one exposure | typically 1700 A (blue) and 2500 A (red) |  | M14, Sec. 2.3, p. 9 | "typically 1700 Å and 2500 Å are covered by one exposure for the blue and red setups" |
| Format stability | about 1.4 CCD pixels per degree of Nasmyth enclosure temperature; repeatability within about one pixel |  | M14, Sec. 2.3, p. 11 | "about 1.4 CCD pixels per degree" |
| Scattered light | typically 1 percent of the stellar flux at 4000 A, from reflections at the CCD and the field flattener |  | N02, Sec. 6.3, p. 863 | "The background level is typically 1% of the stellar flux at" |

### Standard setups (Table 6)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| StdUa | CCD1 310-387 nm, CCD2 400-476 nm, Blue cross-disperser and collimator, cross angle 17950 arcsec (4.986 deg), filters Free,Free |  | M14, Table 6, p. 26 | "StdUa 310-387 400-476 Blue 17950 (4.986) Free,Free" |
| StdBc | CCD1 355-431 nm, CCD2 445-521 nm, Blue cross-disperser and collimator, cross angle 20020 arcsec (5.561 deg), filters Free,Free |  | M14, Table 6, p. 26 | "StdBc 355-431 445-521 Blue 20020 (5.561) Free,Free" |
| StdYb | CCD1 414-535 nm, CCD2 559-681 nm, Red cross-disperser and collimator, cross angle 15860 arcsec (4.406 deg), filters Free,KV370 |  | M14, Table 6, p. 26 | "StdYb 414-535 559-681 Red 15860 (4.406) Free,KV370" |
| StdRa | CCD1 511-631 nm, CCD2 658-779 nm, Red cross-disperser and collimator, cross angle 18584 arcsec (5.163 deg), filters Free,SC-46 |  | M14, Table 6, p. 26 | "StdRa 511-631 658-779 Red 18584 (5.163) Free,SC-46" |
| Other standard setups | StdUb, StdBa, StdYa (blue); StdYc, StdYd, StdRb (red); StdNIRa/b/c; StdI2a, StdI2b (iodine); long-slit StdHe, StdO5, StdO6, StdHa, StdS6 (red CCD only, mirror instead of cross-disperser) |  | M14, Tables 6-7, pp. 26-27 | "StdI2b 355-476 498-618 Red 14170 (3.936) Free,Free" |
| Wavelength coverage of the instrument | 3000-10000 A (resolving power up to 165,000) |  | M14, Sec. 1, p. 5 | "The maximum resolving power of HDS is 165,000 for the optical wavelength region" |

### Order tables and dispersion (Sec. 5.1 and 5.3)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Order table columns | ORDER, WAVEMIN, WAVECEN, WAVEMAX (nm), FSR (nm), LD (nm/mm, the linear dispersion), CDMIN, CDCEN, CDMAX (mm along the cross-dispersion), ORDSEP (mm between adjacent orders); one table for the blue and one for the red cross-disperser; "An example" |  | M14, Sec. 5.1, pp. 38-40 | "ORDER WAVEMIN WAVECEN WAVEMAX FSR LD CDMIN CDCEN CDMAX ORDSEP" |
| Order 106 (blue table) | WAVEMIN 559.681, WAVECEN 562.334, WAVEMAX 564.986 nm, FSR 5.305 nm, LD 0.1239 nm/mm, CDCEN 85.403 mm, ORDSEP 1.709 mm |  | M14, Sec. 5.1, p. 38 | "106 559.681 562.334 564.986 5.305 0.1239 84.044 85.403 86.815 1.709" |
| Order 106 (red table) | WAVECEN 562.334 nm, LD 0.1239 nm/mm, CDCEN 53.590 mm, ORDSEP 1.068 mm |  | M14, Sec. 5.1, p. 39 | "106 559.681 562.334 564.986 5.305 0.1239 52.542 53.590 54.672 1.068" |
| Order 149 (blue table) | WAVECEN 400.049 nm, LD 0.0881 nm/mm, ORDSEP 0.865 mm |  | M14, Sec. 5.1, p. 37-38 | "398.707 400.049 401.392 2.685 0.0881 32.189 33.133 34.116 0.865" |
| Order 129 (red table) | WAVECEN 462.073 nm, LD 0.1018 nm/mm, CDCEN 33.402 mm, ORDSEP 0.721 mm |  | M14, Sec. 5.1, p. 39 | "129 460.282 462.073 463.864 3.582 0.1018 32.524 33.402 34.307 0.721" |
| Order 89 (red table) | WAVECEN 669.746 nm, FSR 7.525 nm, LD 0.1475 nm/mm, ORDSEP 1.515 mm |  | M14, Sec. 5.1, p. 40 | "89 665.983 669.746 673.508 7.525 0.1475 73.950 75.218 76.527 1.515" |
| Order 144 (red table) | WAVECEN 413.940 nm, LD 0.0912 nm/mm, CDCEN 23.710 mm, ORDSEP 0.579 mm |  | M14, Sec. 5.1, p. 39 | "144 412.503 413.940 415.377 2.875 0.0912 22.902 23.710 24.542 0.579" |
| Order 112 (red table) | WAVECEN 532.209 nm, LD 0.1172 nm/mm, CDCEN 47.524 mm, ORDSEP 0.957 mm |  | M14, Sec. 5.1, p. 39 | "112 529.833 532.209 534.585 4.752 0.1172 46.531 47.524 48.549 0.957" |
| Order 107 (red table) | WAVECEN 557.078 nm, CDCEN 52.532 mm |  | M14, Sec. 5.1, p. 39 | "107 554.475 557.078 559.681 5.206 0.1227 51.493 52.532 53.603 1.048" |
| Linear dispersion on the detector (FITS) | 0.00166 nm/pixel at the center wavelength 562.30 nm (= 0.1230 nm/mm; compare LD 0.1239 nm/mm at 562.334 nm) |  | M14, Sec. 5.3, p. 44 (sample header, 2000-08-21) | "C2ELT2 = 0.00166 / Size projected into a detector pixel Y" |
| Sample ASCII table: setup of the 2000 sample | red cross-disperser, centered at 562.30 nm (order 106); CCD 1 only (orders 96-118); WAV-MIN 502.06, WAV-MAX 624.63 nm; Y axis (4096 px) = dispersion, X (2148 px with 2 x 50 overscan columns) = cross-dispersion; the cross-scan angle is not stated |  | M14, Sec. 5.3, pp. 44-48 | "WAV-MIN = 502.06 / Minimum wavelength recorded (nm)" |
| Sample order 96 on CCD1 | X-MIN 70, WL-MIN 617.121 nm (Y = 4096), WL-CEN 620.876 nm (X 176, Y 2048), WL-MAX 624.630 nm (X 281, Y 1) |  | M14, Sec. 5.3, p. 48 | "96 70 4096 617.121 176 2048 620.876 281 1 624.630" |
| Sample order 106 on CCD1 | WL-MIN 558.902, WL-CEN 562.303, WL-MAX 565.703 nm; X-CEN 1064 |  | M14, Sec. 5.3, p. 48 | "106 964 4096 558.902 1064 2048 562.303 1164 1 565.703" |
| Sample order 118 on CCD1 | WL-MIN 502.065, WL-CEN 505.119, WL-MAX 508.174 nm; X-CEN 2031 |  | M14, Sec. 5.3, p. 48 | "118 1937 4096 502.065 2031 2048 505.119 2126 1 508.174" |

### Instrumental profile (Table 3 of the paper, Appendix)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Instrumental profile table | normalized Th-line profiles in km/s for slits 0.2, 0.4, 0.6, 0.8, 1.0 arcsec; the profiles approach trapezoids for slits above 0.4 arcsec |  | N02, Appendix, Table 3, Fig. 9, p. 864 | "Table 3. Instrumental profiles for given slit widths." |
| R from the FWHM of Table 3 (DERIVED) | DERIVED: FWHM by linear interpolation of the half maximum: 2.329 km/s (0.2 arcsec), 3.614 (0.4), 5.238 (0.6), 6.837 (0.8), 8.502 (1.0) km/s -> R = c / FWHM = 128,700; 82,900; 57,200; 43,850; 35,300 |  | N02, Appendix, Table 3, p. 864 | "x slit width" |

## Optical layout (from Fig. 1 of the manual, p. 7)

| item | reading | tag |
|---|---|---|
| Source figures | Noguchi et al. 2002 Fig. 1 (p. 856; PDF p. 2): "Top and side views of the HDS optical layout", a dimensioned CAD drawing (millimeters) saved in noguchi2002_pasj54_855.pdf. It supersedes the schematic Fig. 1 of the manual (ume_v200.pdf p. 7), which agrees in element order and in the scale checks of the earlier version of this record (echelle box 845 mm, beam 274 mm). | SOURCED |
| Printed dimensions (top view) | collimator to echelle 2329.9 mm (at the echelle end the 12 deg line starts); echelle to cross-disperser 2200 mm; the 45 deg between the beam from the echelle and the beam to the camera at the cross-disperser; 1100 mm from the cross-disperser to the correctors and 1704 mm from there to the camera mirror (both along the camera axis, parallel dimension lines); a 12 deg angle at the echelle between the slit-collimator axis and the beam to the cross-disperser. | SOURCED (printed on the figure) |
| Printed dimensions (side view) | slit to collimator 3396.51 mm; collimator axis 1500 mm above the floor; a 5 deg label at the cross-disperser/camera housing. | SOURCED (printed on the figure) |
| Element order | slit (30 deg inclined, filters, shutters) -> f/12.5 cone to the off-axis parabolic collimator (3396.51 mm) -> collimated beam returns to the echelle (2329.9 mm; the echelle stands near the slit) -> echelle (1 x 2 mosaic, quasi-Littrow) diffracts the beam 12 deg out of the collimator plane toward the cross-disperser (2200 mm) -> cross-disperser (2 x 1 mosaic) sends the beam 45 deg to the side to the camera -> three corrector lenses (1100 mm from the cross-disperser) -> spherical primary mirror (a further 1704 mm) -> the converging beam returns to the field flattener and CCD, which stand in front of the primary inside the incoming beam. No fold mirrors. | SOURCED (labels, text, dimensions) |
| Planes | The echelle disperses in the vertical plane (side view: the 840 mm face is seen edge-on, tilted about 22 deg from the horizontal beam, i.e. incidence about 68-71 deg from the normal); the 12 deg quasi-Littrow offset and the cross-disperser (rotating about a vertical axis in the top view, curved arrow) lie in the horizontal plane. So the 12 deg is the out-of-plane angle of the echelle (2 gamma), and the cross-disperser turns the beam 45 deg in the plane perpendicular to the echelle dispersion. | MEASURED (side view slab slope 21.7 deg) / INFERRED |
| Collimator and slit | In the side view the slit-collimator axis is horizontal and the collimated beam returns to the echelle 4.9 deg above it (MEASURED, line from the collimator to the echelle: 77 px rise over 900 px at 300 dpi), matching the printed 5 deg. This is the off-axis geometry: colTilt 2.5 deg (half of 5), INFERRED. In the top view the slit, the echelle and the collimator lie almost on one line; the slit is not in the returning beam (it stands beyond the near end of the echelle). | MEASURED / INFERRED |
| Camera | On-axis catadioptric of the Schmidt-type family: corrector triplet 1100 mm from the cross-disperser, spherical mirror about 2804 mm from it (1100 + 1704), the CCD and field flattener about 0.9-1.0 m in front of the mirror inside the beam (MEASURED, 15 percent, from the top-view drawing at 6.95 mm/px). The mirror's own focal length is about 770 mm (f/0.96 at 800 mm aperture), so the detector sits near its focus. | SOURCED (1100, 1704) / MEASURED (CCD position) |
| Drawing types for the explorer | col: mirror (off-axis parabola, colTilt 2.5); cam: mirror (catadioptric, corrector triplet + spherical mirror + flattener, internal focus like HIRES); xd: grating; layLen (collimator to echelle) 2330; camLen (cross-disperser to the correctors) 1100; nObj 1. | SOURCED / INFERRED |

**On-axis or off-axis verdict (deploy gate): OFF-AXIS.** Evidence: "collimator red off-axis parabola" and "blue off-axis parabola" (M14 Table 1, p. 7), for a 3300 mm, f/12 collimator. The echelle stands next to the slit (Fig. 1), not in the cone, and the slit is not in the returning beam. No tilt or off-axis distance is published, so use the automatic colTilt.

## Settings (recommended Setting menu)

| id | Setting menu | standard setup | cross-disperser (xG) | slit (arcsec) | lamC (A) | note |
|---|---|---|---|---|---|---|
| hdsbc | StdBc, 0.4″ | StdBc | blue (400) | 0.46 | 4380 | blue cross-disperser, collimator and setup StdBc: 355-431 and 445-521 nm; the metal-poor-star setup (H04 covered 3500-5200 A) |
| hdsyb | StdYb, 0.4″ | StdYb | red (250) | 0.46 | 5475 | red cross-disperser, KV370 in wheel 2: 414-535 and 559-681 nm, the widest single optical exposure |
| hdsua | StdUa, 0.4″ | StdUa | blue (400) | 0.46 | 3930 | near-UV: 310-387 and 400-476 nm |
| hdsra | StdRa, 0.4″ | StdRa | red (250) | 0.46 | 6450 | 511-631 and 658-779 nm (H-alpha, Li I, Ca II triplet blue end) |
| hdsbc72 | StdBc, 0.72″ | StdBc | blue (400) | 0.83 | 4380 | R about 50,000 (H04) |
| hdsbc02 | StdBc, 0.2″ | StdBc | blue (400) | 0.23 | 4380 | narrowest slit with a published profile (N02 Table 3: R = 128,700 derived); R about 160,000 needs a still narrower slit that the paper does not name |

Table 6 values (M14 p. 26): StdUa 310-387 / 400-476 nm, blue, 17950 arcsec (4.986 deg); StdBc 355-431 / 445-521, blue, 20020 (5.561); StdYb 414-535 / 559-681, red, 15860 (4.406), filter 2 KV370; StdRa 511-631 / 658-779, red, 18584 (5.163), filter 2 SC-46.

## Published performance (validation targets)

| what | quantity | value | tol | source and comment |
|---|---|---|---|---|
| R 90,000 at 0.4 arcsec mechanical (0.462 arcsec effective), design/specified | Rs  | 90000 | 0.08 | N02 abstract p. 855; M14 Sec. 2.3. The model (tan 71.25 deg, W = 272 mm, effective slit 0.462 arcsec) gives about 87,000 (GEOMETRIC) |
| R 82,900 at 0.4 arcsec, from the FWHM of the measured Th instrumental profile (Table 3) | R  | 82900 | 0.08 | N02 Table 3, Appendix p. 864 (DERIVED: FWHM 3.614 km/s; the profile wavelength is not stated) |
| R 128,700 at 0.2 arcsec from Table 3 (FWHM 2.329 km/s) | R slitW=0.231 | 128700 | 0.1 | N02 Table 3 (DERIVED) |
| R 57,200 at 0.6 arcsec, 43,850 at 0.8, 35,300 at 1.0 (Table 3) | R slitW=0.693 | 57200 | 0.1 | N02 Table 3 (DERIVED); the profiles are trapezoids at these slits |
| R 100,000 at 0.35 arcsec (specification, measured on Th lines) | Rs slitW=0.404 | 100000 | 0.1 | N02 Sec. 6.1 p. 862 |
| R 114,000 at the 0.3 arcsec slit, MEASURED on weak Th lines near 670 nm | RAt lam=6700 slitW=0.346 | 114000 | 0.06 | T12 Sec. 3.2 p. 6 |
| R up to about 160,000 with a narrower slit | Rs  | 160000 |  | N02 abstract; the slit is not given (info) |
| 0.12 arcsec/pixel (pixel scale), 0.138 along the slit image | pixScale  | 0.12 | 0.04 | N02 Sec. 2.5 p. 859 (GEOMETRIC) |
| dispersion 0.1239 nm/mm = 0.01673 A/pixel in order 106 at 5623.3 A | dlpixAt lam=5623.34 m=106 | 0.0167265 | 0.03 | M14 Sec. 5.1 pp. 38-39 (LD column, design table); FITS C2ELT2 0.00166 nm/pixel |
| dispersion 0.0881 nm/mm in order 149 at 4000.5 A | dlpixAt lam=4000.49 m=149 | 0.0118935 | 0.03 | M14 Sec. 5.1 p. 38 |
| dispersion 0.1018 nm/mm in order 129 at 4620.7 A | dlpixAt lam=4620.73 m=129 | 0.013743 | 0.03 | M14 Sec. 5.1 p. 39 |
| dispersion 0.1475 nm/mm in order 89 at 6697.5 A | dlpixAt lam=6697.46 m=89 | 0.0199125 | 0.04 | M14 Sec. 5.1 p. 40 |
| order center m = 106 at 5623.3 A and m x lambda_center = 59,607 nm for every order (with gamma = 6 deg and the 71.25 deg angle both sourced, the match is an independent test; 71.5 deg would put order 106 at 5631 A) | lamAtOrder m=106 | 5623.34 | 0.002 | M14 Sec. 5.1 WAVECEN column; N02 Sec. 2 (gamma) (info) |
| order 96 on CCD1 (red CD, 2000 sample): 6171.21-6246.30 A | ordLo m=96 | 6171.21 | 0.003 | M14 Sec. 5.3 p. 48 (centered at 562.30 nm: that center is the table's own, so the offsets from it are the test) |
| order 96 on CCD1: red end 6246.30 A | ordHi m=96 | 6246.3 | 0.003 | M14 Sec. 5.3 p. 48 |
| order 118 on CCD1: 5020.65 A (blue end) | ordLo m=118 | 5020.65 | 0.003 | M14 Sec. 5.3 p. 48 |
| order span on the chip, order 96: 75.09 A (wider than the FSR 64.7 A) | ordSpan m=96 | 75.09 | 0.04 | M14 Sec. 5.3 p. 48 |
| orders 96-118 recorded on one CCD (23 orders) | nOrders  | 23 | 0.1 | M14 Sec. 5.3 p. 48 (independent of gamma and the angle) |
| order centers 96 to 118 span 23.31 mm across the dispersion with the red cross-disperser | ySpan m1=96 m2=118 | 23.31 | 0.03 | M14 Sec. 5.1 p. 39 (CDCEN 65.385 - 42.075); needs xPsi = 45 deg (with 10 deg the model gives 22.29, 4.4 percent small) |
| order separation, orders 106-107, red cross-disperser: 1.058 mm | ySpan m1=106 m2=107 | 1.058 | 0.03 | M14 Sec. 5.1 p. 39 (CDCEN 53.590 - 52.532) |
| order separation, orders 106-107, blue cross-disperser: 1.693 mm | ySpan m1=106 m2=107 | 1.693 | 0.03 | M14 Sec. 5.1 p. 38 (CDCEN 85.403 - 83.710) |
| slit length without order overlap, blue CD, 4000 A: 7.6 arcsec (manual), 7.5 arcsec (paper) | minSepArcsec  | 7.6 | 0.15 | M14 Table 2 p. 19; N02 Sec. 3.1 p. 858 (info) |

Order tables were taken with the 2000 sample setup (red cross-disperser, centered at 562.30 nm, CCD1) for the pixel-level table (Sec. 5.3), and with the design calculation (Sec. 5.1) for the LD and ORDSEP columns: the blue-table values apply to the blue setups, the red-table values to the red setups.

## NOT FOUND

- The collimator off-axis angle as a stated number (the 5 deg between the slit axis and the collimated beam is a figure label; colTilt = 2.5 deg is INFERRED from it), the grating angles and the in-plane angles at the echelle as numbers (only the 12 deg and 45 deg labels), and the camera prescription (corrector radii, glasses, spacings; Fig. 4 is a drawing with no numbers, Fig. 5 spot diagrams only).
- A measured R at the 0.4 arcsec slit as a number in the text: the paper gives R = 90,000 (abstract) and 100,000 at 0.35 arcsec (Sec. 6.1) and plots R against slit width (Fig. 6, no values); the R in this record from Table 3 is DERIVED from the profile FWHM at an unstated wavelength.
- The slit width that gives R = 160,000 (the paper says only "a narrower slit width").
- Detector changes after 2014 (the Subaru pages in 2026 still list two EEV CCD42-80); no post-2014 manual was found.
- Usage statistics for the standard setups (no document gives how often each is used).
- The HDS format-simulator source (HDS_SPFv20.f, cited by the manual at optik2.mtk.nao.ac.jp) is a dead link; the order tables of the manual stand in for it.

## Conflicts between sources

- Echelle blaze: 71.5 deg (Noguchi et al. 2002 Table 1 and Sec. 2.3; Iye et al. 2004) / 71.25 deg (manual Table 1) / 71.3 deg (Subaru page) / R2.8 = tan 70.35 deg (the grating's R number, abstract). The manual's order table (m x lambda_center = 59,607 nm for all 99 orders) equals 2 d sin(theta) cos(6 deg) for theta = 71.25 deg (59,604 nm, order 106 at 5623.0 A against 5623.34 A) but not for 71.5 deg (59,692 nm, order 106 at 5631.3 A, 0.14 percent off, about 8 A). Recommended: eDelta = 71.25 (the value that fits the order table, as before); 71.5 is the paper's design value.
- Echelle ruled length: the abstract says "300 mm by 840 mm in total size", Sec. 2.3 says a ruled area of 12 inch by 32 inch = 304.8 x 812.8 mm (a 1 x 2 mosaic of two 12 x 16 inch gratings). Use gLen = 812.8 (ruled). The 272 mm beam at 71.25 deg has an 847 mm footprint, 4 percent longer than the ruled length, although the paper claims no vignetting at the blaze angle; the R2.8 angle (70.35 deg) would give 809 mm.
- Collimator focal length and ratio: 3400 mm, f/12.5 cone, 272 mm beam (paper: 3400 / 272 = 12.5; Fig. 1 dimension 3396.51 mm) vs 3300 mm and f/12 (manual: "3.3m away from the slit"). The paper is the design document and its pixel scale 0.12 arcsec/pixel follows from 3400 (0.119; 3300 gives 0.116), so the paper's values are used. Telescope focal ratio: f/12.5 (paper), F/12.6 (manual), F/12.708 (Iye et al. Table 2 and the HDS sample header, with the image rotators; the paper's 12.5 is close to the Table 2 value without a rotator, 12.469).
- Slit width: the 30 deg inclination of the slit widens its image along the dispersion by 1/cos 30 deg = 1.155 (paper Sec. 2.5), so 0.4 arcsec mechanical acts as 0.462 arcsec. With it, the geometric R (tan 71.25 deg, W = 272 mm) is about 87,000, against 90,000 (published) and 82,900 (Table 3 FWHM). Without it the model would give 100,000. The slit is entered as the effective width; the Setting menu names carry the mechanical width.
- Pixel scale: 0.12 arcsec/pixel (paper, along the dispersion-perpendicular direction) and 0.138 along the slit image (0.12 / cos 30 deg); the earlier worry (0.138 vs 0.1157) is resolved by the slit inclination. The Iye et al. "45 um, or 3 pixels" for 0.4 arcsec is the nominal 3.3-pixel width.
- Cross-dispersion (resolved): the order separations of the manual's tables are reproduced to 0.8 and 0.6 percent (blue, red) by f = 770 mm with a 45 deg angle between the beams at the cross-disperser (Fig. 1); the model's 4-4.5 percent shortfall comes from xPsi = 10 deg (unpublished at the time), which gives a smaller angular dispersion. Set xPsi = 45.
- Gamma and the dispersion: a 12 deg in-plane angle at the echelle (alpha - beta = 12 deg) would give a linear dispersion of 0.162 nm/mm at order 106, 31 percent above the table (0.1239); the table is reproduced (0.12395 with cos 6 deg: 0.1233, 0.5 percent) by a Littrow incidence of 71.25 deg and an out-of-plane 12 deg total (gamma = 6 deg), which also fits the drawing (the echelle disperses in the vertical plane of the side view).
- Echelle angle default: 0.25 deg (manual Sec. 3.3) vs 0.4 deg nominal (Sec. 3.1.1). Not used in the preset.
- Standard-setup wavelength ranges (Table 6) vs the orders per CCD: StdYb CCD1 414-535 nm is 33 orders (144-112) by the red table, spanning 24 mm of a 27.6 mm CCD, so three more orders would fit on CCD1. Treat the Table 6 ranges as +-3 orders.
- Detector: the 1998 design called for 15 um pixels and 2k x 4k chips (N98); the as-built detector is 13.5 um (N02, M14).

## Notes

- RECOMMENDED PRESET: HDS, StdBc and StdYb with the 0.4 arcsec slit as settings of one echelle-mode preset, id hds, named "Subaru / HDS". Why: 0.4 arcsec (200 um mechanical, R about 90,000) is the standard slit of both the paper and the manual (not an R = 45,000 or 60,000 slit); the metal-poor star survey that opened the instrument used 0.4 and 0.72 arcsec (H04); 0.72 arcsec gives R about 50,000. StdBc (355-521 nm, blue cross-disperser) covers that survey's 3500-5200 A; StdYb (414-681 nm, red cross-disperser, KV370) is the widest single optical exposure. No usage count was found: this is a judgment. StdUa and StdRa span the near-UV and the Halpha region.
- Settings (at most 16 characters): StdBc, 0.4″ (default) / StdYb, 0.4″ / StdUa, 0.4″ / StdRa, 0.4″ / StdBc, 0.72″ (R about 50,000) / StdBc, 0.2″ (narrowest published profile, R = 128,700 derived from Table 3). The R = 160,000 slit is not published.
- Era: 2014-2026 (first light 2000 July 1, open use 2001 April; image slicers from S11B, S13A, S14A; the original EEV detector). The image slicers are not modeled.
- RECOMMENDED STATE (echelle mode): D = 8.2 m; F = 12.5 (N02: 3400 mm / 272 mm = 12.5, giving W = 272 mm exactly) [alternative F = 12.708, W = 267.5]; slitW = mechanical / cos 30 deg (0.462 for 0.4; 0.831 for 0.72; 0.231 for 0.2); nObj = 1; col mirror (off-axis parabola), colTilt = 2.5 (INFERRED from the 5 deg label and the 4.9 deg drawn line); cam mirror (catadioptric: three correctors, spherical mirror, flattener); layLen = 2330 (printed 2329.9); camLen = 1100 (printed: cross-disperser to the correctors); fcam = 770; eG = 31.6; eDelta = 71.25 (fits the order table; the paper says 71.5); gamma = 6.0 (INFERRED as half of the printed 12 deg; agrees with the 5.97 deg the order table needs); theta = 0; xd grating, xG = 400 (blue) or 250 (red), xPsi = 45 (printed on Fig. 1); Nx = 4096 (dispersion), Ny = 4096 (2 x 2048 across; the 1.1 mm gap is not modeled); pix = 13.5; gLen = 812.8; lamC from the Table 6 midpoints: StdUa 3930, StdBc 4380, StdYb 5475, StdRa 6450 A (INFERRED midpoints).
- CHANGES BY THE PAPER: (1) gamma is no longer a fit: 6.0 deg = 12 deg / 2 reproduces the fitted 5.97 deg, so the order centers (m x lambda_center) and the ordLo/ordHi of the Sec. 5.3 table are independent tests for theta = 71.25 deg and gamma = 6 deg (not for 71.5 deg, which fails by 8 A); the eDelta choice between 71.25 and 71.5 is still made from this table. The 2000 sample's center wavelength (562.30 nm) is its own, so only the offsets from it are tested. (2) xPsi = 45 deg explains the order-separation shortfall. (3) gLen = 812.8 mm (ruled). (4) f_col 3400 mm and F = 12.5 replace 3300 mm and 12.708. (5) The slit enters at 1/cos 30 deg of its mechanical width.
- Independent tests that remain: LD in four orders (depends on theta, gamma, f = 770 only); ORDSEP (xPsi = 45, f = 770, sourced); the order span and 23 orders per CCD; R x slit.
- What the model cannot represent: (1) the two CCDs with a 1.1 mm (about one order) gap across the dispersion; (2) the camera as a real catadioptric system; (3) the 30 deg slit inclination (entered as a wider slit; the pixel scale along the slit image, 0.138, then differs from the model's); (4) the image slicers (IS#1 = 5 x 0.3 arcsec slices is the nearest slit entry); (5) the two collimators; (6) the 1 x 2 echelle mosaic (one length, gLen 812.8, is used; the 0.5 arcsec misalignment of the masters is ignored); (7) the out-of-plane 12 deg geometry if the explorer draws a single plane.
- Documents: Noguchi et al. 2002 (supplied) now holds the layout, the 12 deg and 45 deg angles, the camera description and the mosaic; the 1998 SPIE paper (1998SPIE.3355..354N, https://doi.org/10.1117/12.316771) remains unsaved (paywalled) and would add little.
