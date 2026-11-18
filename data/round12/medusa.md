# Round 12 (2026-11-18): Medusa, the Steward Observatory fiber multi-object spectrograph of the 90-inch (2.3 m) telescope, 1979-1985 (id `medusa`)

Same rules as rounds 1-11 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/medusa/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so that the explorer reproduces a published quantity; **INFERRED** marks a reading that is not stated; **SCHEMATIC** marks a layout element with no source; **MEASURED** here means read from a figure (stated each time). Quotes were machine-checked against `pdftotext -layout` and `-raw` text (letters and digits only, so hyphenation, dashes, accents and ligatures do not matter): **55 quote pieces, 0 failures** (script: scratchpad r12/medusa/gen.py). The H88 quotes are "transcribed from the scan" (OCR; the page images were also read). Machine-readable twin: `data/round12/medusa.json`.

## Completeness summary

**Complete from the 1980 discovery paper (M80) and its companions:** the telescope (2.29 m, Cassegrain, plate scale 9.8 arcsec/mm, so f/9.19 DERIVED), the fibers (300 um fused silica, 3 arcsec on the sky, about 40 slit holes in a 2.5 cm line, 32 galaxy holes, three 37-fiber "nuclei" later), the spectrograph's identity (the standard Boller & Chivens Cassegrain image-tube spectrograph, "in its normal configuration"), the grating (300 l/mm blazed at 4000 A, first order), the dispersion (about 250 A/mm), the detector (the Carnegie two-stage image tube, f/1.0 transfer lens, baked IIIa-J plates; an intensified RCA CCD from 1981-82), the coverage (3900-5500 A), the resolution (15 A) and the velocity precision (about 94-100 km/s).

**Collimator on or off the axis: SOURCED for the spectrograph, from a sister paper.** HU79 (the same Boller & Chivens image-tube spectrograph, tested on the 36 inch) calls the normal collimator an "off-axis collimator mirror for an f/9 beam" with a "3 inch (7.6 cm) diameter ... nominal diameter for the spectrograph", and its Fig. 3 draws the spectrograph with a solid Schmidt camera and a two-stage RCA image tube. M80 says only that the Cassegrain spectrograph was used "in its normal configuration" with the slit replaced by a plate of holes. So OFF-AXIS is the evidence for the instrument's own collimator (no tilt angle published); the 1979 test replaced it with an on-axis paraboloid, which is not Medusa.

**Not found (matters):** the camera's focal length and the grating's ruled size and angle (the camera and the camera-collimator angle are EFFECTIVE or SCHEMATIC below), the image tube's format and the plate size, any distance in the layout, and the engineering paper. The technical descriptions of Medusa are Hill et al. 1982 (SPIE 331, 279, "Multiple Object Fiber Optic Spectroscopy", ADS 1982SPIE..331..279H) and Hill, Angel & Scott 1983 (SPIE 380, 354, "Fiber optics for astronomical spectroscopy: the Medusa Spectrograph", ADS 1983SPIE..380..354H); SPIE refuses automated access and ADS has no scan (the link gateway returned a login page), so neither was read. Also not reached: Hill 1981, Sky & Telescope 62, 20 ("Medusa - a Multiple-Object Spectrograph", 1981S&T....62...20H) and Hill's 1984 thesis (1984PhDT.........4H). The layout is therefore SCHEMATIC except for the one angle read from HU79 Fig. 3.

**Recommended preset:** "Steward 2.3 m / Medusa (1980, plates)": D = 2.29 m, F = 9 (the virtual fiber convention, F_out = 9: the spectrograph collimator is f/9 and "60% of the light exiting a given fiber is still within an f/9 beam"), 300 um fibers entered as the slit of equal line width (2.60 arcsec; the round 3.00 arcsec virtual image), nObj 40, off-axis mirror collimator 686 mm with a 76.2 mm beam, 300 l/mm blazed 4000 A first order, lamC 4700 A, a camera of 125 mm (EFFECTIVE) at psi = 40 deg, and an effective plate pixel of 20 um (EFFECTIVE) on 400 x 250 pixels. **Era:** the first photographic multi-fiber runs of 1979-1982 (December 1979 test, March 1980 Abell 1904 plate, the 1980-82 Abell cluster data). The same hardware then took an intensified RCA CCD (HN82, 1982), and the MX Spectrometer (robot arms) began commissioning on the 2.3 m in January 1985 (H88). **Setting menu:** one setting, `300/mm, 3″`.

## Sources

| key | document | local file (rawdata/presets/medusa/) | URL |
|---|---|---|---|
| M80 | Hill, J. M., Angel, J. R. P., Scott, J. S., Lindley, D. & Hintzen, P. 1980, ApJ 242, L69, "Multiple object spectroscopy: the medusa spectrograph" (ADS 1980ApJ...242L..69H, title checked on ADS; 4 text pages L69-L72 plus plates; clean text layer, two columns; the figures are photographic plates of spectra) | 1980ApJ...242L..69H.pdf | https://articles.adsabs.harvard.edu/pdf/1980ApJ...242L..69H |
| HN82 | Hintzen, P., Hill, J. M., Lindley, D., Scott, J. S. & Angel, J. R. P. 1982, AJ 87, 1656, "Medusa spectroscopy of A400, A576, A1767, and A2124" (ADS 1982AJ.....87.1656H, title checked on ADS; 12 pp.; text layer; the text-layer OCR misprints Boller as Boiler) | 1982AJ.....87.1656H.pdf | https://articles.adsabs.harvard.edu/pdf/1982AJ.....87.1656H |
| HU79 | Hubbard, E. N., Angel, J. R. P. & Gresham, M. S. 1979, ApJ 229, 1074, "Operation of a long fused silica fiber as a link between telescope and spectrograph" (ADS 1979ApJ...229.1074H, title checked on ADS; 5 pp.; text layer; Fig. 3 = schematic of the Boller & Chivens image-tube spectrograph as modified for a fiber, p. 1076) | 1979ApJ...229.1074H.pdf | https://articles.adsabs.harvard.edu/pdf/1979ApJ...229.1074H |
| H88 | Hill, J. M. 1988, ASP Conf. Ser. 3, 77, "The History of Multiobject Fiber Spectroscopy" (ADS 1988ASPC....3...77H, title checked on ADS; 16 pp.; scan WITHOUT a text layer: OCRed with tesseract, OCR text saved beside it as 1988ASPC....3...77H.ocr.txt; quotes are "transcribed from the scan"; Table 1 and Fig. 2 were also read on the page images) | 1988ASPC....3...77H.pdf | https://articles.adsabs.harvard.edu/pdf/1988ASPC....3...77H |

Not saved (no access): Hill et al. 1982, SPIE 331, 279; Hill, Angel & Scott 1983, SPIE 380, 354 (https://ui.adsabs.harvard.edu/abs/1983SPIE..380..354H); Hill 1981, S&T 62, 20; Hill 1984 thesis.

## Telescope and feed

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Telescope | Steward Observatory 90 inch (2.29 m) reflector, Kitt Peak, Cassegrain focus | m | SOURCED | M80, Abstract, p. L69 | "of the Steward 90 inch (2.29 m) telescope" |
| Aperture D | 2.29 | m | SOURCED | M80, Abstract, p. L69 | "Steward 90 inch (2.29 m) telescope" |
| Optical design | Ritchey-Chretien (wide, well-corrected field) |  | SOURCED | H88, p. 80 (transcribed from the scan) | "the 2.3 m has Ritchey ... optics which provide a wide, well-corrected field-of-view" |
| Plate scale at the Cassegrain focal plane | 9.8 | arcsec/mm | SOURCED | M80, Sec. II, p. L69 | "the plate scale is 9''8 mm-1" |
| Plate scale (alt) | 9.7 (approximate) | arcsec/mm | SOURCED | M80, Sec. IV, item 4 of the positioning-error list, p. L72 | "plate scale at the Cassegrain focus is approximately 9''7 mm-1" |
| Focal ratio of the telescope | 9.19 | f/# | DERIVED | M80 | DERIVED: F = 206265 / (9.8 arcsec/mm x 2290 mm) = 9.19 (9.29 at 9.7 arcsec/mm); no source states the Cassegrain focal ratio |
| Entrance slit position | 25 cm below the Cassegrain focal plane (spectrograph mounted on a spacer); the fiber plate sits in the focal plane |  | SOURCED | M80, Sec. II, p. L69 | "position of the entrance slit is located 25 cm below the Cassegrain focal plane" |
| Field | up to 40 objects anywhere in a 30 arcmin field (later 0.5 deg diameter) | arcmin | SOURCED | M80, Sec. I, p. L69 | "up to 40 objects anywhere in a 30" |
| Field (alt) | over 30 galaxies in a patch of sky 0.5 deg in diameter | deg | SOURCED | HN82, Sec. II, p. 1656 | "over 30 galaxies in a patch of sky 0.5 deg in diameter may be observed simulta" |

## Fibers

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Fiber type and maker | step-index, plastic-clad fused silica, Galileo Electro-Optic Corporation |  | SOURCED | M80, Sec. II, p. L70 | "step-index type, plastic-clad fused silica manufactured by Galileo Electro-Optic Corporation" |
| Fiber core | 300 | um | SOURCED | M80, Sec. II, p. L69 | "Single, fused silica fibers 300 um in diameter are located in the holes" |
| Fiber core (alt) | 300 (20 Galileo PCS fibers in Dec 1979) | um | SOURCED | H88, p. 79 (transcribed from the scan) | "an aperture plate with 20 Galileo 300 micron PCS fibers" |
| Cladding | about 150 um thick | um | SOURCED | M80, Sec. IV, item 4 of the positioning-error list, p. L72 | "diameter fibers have a coat of cladding approximately 150" |
| Fiber end on the sky | 3 | arcsec | SOURCED | M80, Sec. I, p. L69 | "Each single fiber end subtends a circle of 3" |
| Fiber end on the sky (check) | 2.94 | arcsec | DERIVED | M80 | DERIVED: 0.300 mm x 9.8 arcsec/mm = 2.94 arcsec |
| Fiber length | short (no length given; "Short lengths of fused silica fiber") |  | SOURCED | M80, Sec. I, p. L69 | "Short lengths of fiber are used to bring the light" |
| Number of fibers (1980 aperture plate) | 32 galaxy holes in the focal plate; slit plate with about 40 holes |  | SOURCED | M80, Sec. II, p. L69 | "at the locations of 32 galaxies" |
| Slit plate | about 40 holes in a line 2.5 cm long, perpendicular to the dispersion |  | SOURCED | M80, Sec. II, p. L69 | "in a line 2.5 cm long and perpendicular to the direction" |
| Number of fibers (named MEDUSA system) | three interchangeable sets ("nuclei") of 37 QSF fibers |  | SOURCED | H88, p. 80 (transcribed from the scan) | "three sets of 37 QSF" |
| Slit pitch | 625 um (40 holes in 25 mm) | um | DERIVED | M80 | DERIVED: 25 mm / 40 = 0.625 mm |
| Comparison lamp | every eighth fiber routed to a HeAr lamp (later work) |  | SOURCED | HN82, Sec. II, p. 1656 | "Every eighth fiber in the line was routed to the spectrograph HeAr comparison source" |
| Focal-ratio behavior | reasonably preserved in a fiber (authors' statement) |  | SOURCED | M80, Sec. I, p. L69 | "focal ratio is reasonably preserved in propagation down a single fiber" |
| Matching loss | the device has significant light losses (not matched to the telescope) |  | SOURCED | M80, Abstract, p. L69 | "has significant light losses because it is not ideally matched to the telescope" |
| Fiber input and output focal ratios | NOT FOUND for Medusa; the 2.3 m f/9.2 beam enters, and the spectrograph collimator is f/9 (HU79). The explorer virtual fiber uses F_out = 9 |  | INFERRED | HU79, Sec. II, p. 1075 | "replacing the normal off-axis collimator mirror for an f/9 beam" |
| Virtual-fiber angle (explorer convention) | 3.002 | arcsec | DERIVED |  | DERIVED: phi = 0.300 mm / (F_out 9 x D 2290 mm) x 206265 = 3.002 arcsec; slitW = (sqrt 3 / 2) x phi = 2.600 arcsec |
| Guiding and alignment | two 3 mm coherent image conduits (about 30 arcsec in the focal plane) and two photomultipliers each fed by two fibers on field stars |  | SOURCED | M80, Sec. II, p. L70 | "imaging bundles are 3 mm in diameter and subtend approximately" |
| Telescope beam at the fibers | f/9 ("the beam, originally f/9"): consistent with F = 9.19 (derived above) | f/# | SOURCED | M80, Sec. IV, p. L71 | "the beam, originally f/9, is broadened" |
| Fiber output vs the spectrograph acceptance | typically 60 percent of the light leaving a fiber is still within an f/9 beam (what the spectrograph gathers) |  | SOURCED | M80, Sec. IV, p. L71 | "typically, 60% of the light exiting a given fiber is still within an f/9 beam" |
| Effective aperture of a fiber | 7 square arcsec (3 arcsec diameter) | arcsec^2 | SOURCED | M80, Sec. IV, p. L71 | "The 7 square arc seconds effective aperture provided by the optical fibers" |
| Field change and exposure cost | about 40 min to change fields; a multiaperture exposure is effectively a factor of 4 slower than single-aperture |  | SOURCED | M80, Sec. IV, p. L71 | "effectively a factor of 4 slower than with the single-aperture sys" |
| Positioning | rms 0.3 arcsec per coordinate in the galaxy positions; drill error under 0.1 arcsec (10 um); up to six guide stars |  | SOURCED | M80, Sec. IV, p. L72 | "we guide on as many as six stars simultaneously" |

## Spectrograph

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Spectrograph | the standard Boller & Chivens Cassegrain spectrograph, in its normal configuration, the slit replaced by the fiber plate |  | SOURCED | M80, Sec. III, p. L70 | "Cassegrain spectrograph in its normal configuration" |
| Spectrograph (alt) | "Boiler and Chivens Cassegrain spectrograph" (sic, the text layer misprints Boller) |  | SOURCED | HN82, Sec. I, p. 1656 | "standard Boiler and Chivens Cassegrain spectrograph" |
| Same spectrograph, described | the Boller & Chivens Image Tube Spectrograph, normally used at the Cassegrain focus of the Steward 90 inch (the Hubbard et al. 1979 fiber test used it on the 36 inch) |  | SOURCED | HU79, Sec. II, p. 1074 | "Image Tube Spectrograph, normally used at the Cassegrain focus of the Steward 90 inch" |
| Collimator type and axis | OFF-AXIS mirror, for an f/9 beam (the normal collimator, replaced in the 1979 test by an on-axis paraboloid) |  | SOURCED | HU79, Sec. II, p. 1075 | "replacing the normal off-axis collimator mirror for an f/9 beam" |
| Collimator focal ratio | 9 | f/# | SOURCED | HU79, Sec. II, p. 1075 | "replacing the normal off-axis collimator mirror for an f/9 beam" |
| Beam diameter | 3 inch (7.6 cm), the nominal diameter for the spectrograph | mm | SOURCED | HU79, Sec. II, p. 1075 | "diameter area on the collimator, the nominal diameter for the spectrograph" |
| Collimator focal length | 685.8 | mm | DERIVED | HU79 | DERIVED: f_col = 9 x 76.2 mm = 685.8 mm (INFERRED: the f/9 beam fills the 3 inch nominal diameter; the modified test's 10 inch focus / f/3.3 = 3.03 inch agrees) |
| Camera type | solid Schmidt camera feeding a two-stage RCA image tube |  | SOURCED | HU79, Sec. II, p. 1075 | "imaged onto a two-stage RCA image tube by the solid Schmidt camera" |
| Camera focal length | NOT FOUND (fitted below) | mm | NOT FOUND |  |  |
| Grating | 300 grooves/mm, blazed at 4000 A, first order | l/mm | SOURCED | M80, Sec. III, p. L70 | "A 300 groove per mm grating blazed at 4000 A was used in first order" |
| Grating (alt) | 300 lines/mm, first order (same spectrograph, 36 inch test) |  | SOURCED | HU79, Sec. II, p. 1075 | "The light from the collimator was reflected by a 300 line mm-1 grating" |
| Reciprocal dispersion | about 250 A/mm | A/mm | SOURCED | M80, Sec. III, p. L70 | "producing a reciprocal dispersion of approximately 250 A mm-1" |
| Reciprocal dispersion (alt) | about 250 A/mm | A/mm | SOURCED | HN82, Sec. I, p. 1656 | "resulted in a reciprocal dispersion of about 250 A/mm" |
| Camera-collimator angle | about 40 deg, read from the schematic (angle between the collimated and the diffracted beams at the grating); SCHEMATIC | deg | MEASURED | HU79, Fig. 3, p. 1076 | "Schematic of spectrograph system modified to accept on f/3.3 beam from fiber" |
| Filters, dichroics | none |  | NOT FOUND |  |  |

## Detector

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Detector (1980) | Carnegie image-tube detector, tube-to-plate transfer lens open to f/1.0 |  | SOURCED | M80, Sec. III, p. L70 | "The Carnegie image-tube detector was operated with the tube-to-plate transfer lens open to f/1.0" |
| Image tube | two-stage tube, 33063 |  | SOURCED | HN82, Sec. I, p. 1656 | "33063 image tube camera" |
| Image tube (alt) | 2 stage RCA image tube, f/1 transfer lens, photographic plate (Fig. 3 labels) |  | SOURCED | HU79, Fig. 3, p. 1076 | "imaged onto a two-stage RCA image tube by the solid Schmidt camera" |
| Plates | IIIa-J, baked 4 hr in N2 at 65 C, unwidened spectra |  | SOURCED | M80, Sec. III, p. L70 | "baked for 4 hr in N2 at 65" |
| Later detector | an intensified RCA CCD replaced the plates (1981-82) |  | SOURCED | HN82, Sec. I, p. 1656 | "An intensified RCA CCD is now being used as the detector" |
| Plate format, tube photocathode size, grain or tube resolution | NOT FOUND |  | NOT FOUND |  |  |

## Coverage, dispersion, resolution

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Coverage (continua well exposed) | 3900 to 5500 | A | SOURCED | M80, Sec. III, p. L70 | "continua of most galaxies are well exposed from 3900 to 5500" |
| Coverage shown (Fig. 1 of H88) | 400 to 560 nm | nm | SOURCED | H88, Fig. 1 caption, p. 81 (transcribed from the scan) | "Wavelengths from 400 to 560 nm are shown" |
| Resolution | 15 A (image-tube spectra of A754, MEDUSA aperture plate); stated, not marked measured or geometric | A | SOURCED | H88, Fig. 1 caption, p. 81 (transcribed from the scan) | "These 15 Angstrom resolution spectra were obtained during a two hour exposure" |
| Velocity precision | external about 94 km/s (8 galaxies); later about 100 km/s | km/s | SOURCED | M80, Sec. III, p. L71 | "of about 94 km" |
| Velocity precision (alt) | about 100 km/s | km/s | SOURCED | HN82, Abstract, p. 1656 | "root-mean-square external errors in these velocities are about 100 km/s" |
| Spectra from one exposure | 26 galaxies, one 3 hr exposure of Abell 1904 |  | SOURCED | M80, Sec. III, p. L70 | "single 3 hr exposure of Abell 1904 which has yielded redshifts for 26 galaxies" |
| Gain over a single-slit spectrograph | sixfold reduction in the mean telescope time per galaxy |  | SOURCED | M80, Abstract, p. L69 | "a sixfold reduction in the mean telescope time per galaxy" |
| Dates | first multiobject run Dec 1979 (Abell 754); A1904 Mar 1980; MX Spectrometer commissioning began at the 2.3 m in Jan 1985 |  | SOURCED | H88, Table 1, p. 79 (transcribed from the scan) | "MX commissioning begins at Steward 2.3m" |
| Dates (alt) | Dec 1979: 20 fibers, 8 galaxies in A754 |  | SOURCED | H88, p. 79 (transcribed from the scan) | "In December 1979, Hill, Angel, Scott, Lindley" |
| Medusa name and 30 arcmin field | later in 1980 the field went to 30 arcmin square and the system was named MEDUSA |  | SOURCED | H88, p. 80 (transcribed from the scan) | "Later in 1980, the field-of-view was increased to 30 arcminutes square" |

## Preset state (what to enter in the explorer)

| state | value | tag | how |
|---|---|---|---|
| mode, D | grating, 2.29 m | SOURCED | M80 abstract |
| F | 9 | INFERRED | virtual fiber convention: the spectrograph's collimator takes an f/9 beam (HU79) and the fibers' light is gathered "within an f/9 beam" (M80 Sec. IV); the real telescope focal ratio is 9.19 (9.29 at 9.7 arcsec/mm), so the 300 um core is 2.94 arcsec on the sky against 3.00 arcsec at F = 9 (a 2 percent difference, below the plate-scale scatter 9.7-9.8) |
| slitW | 2.600 arcsec | DERIVED | (sqrt 3 / 2) x 0.300 mm / (9 x 2290 mm) x 206265; in the preset: `S3 * 0.300 / (9 * 2290) * 206264.806` |
| nObj | 40 | SOURCED | M80: about 40 slit holes (32 galaxy holes, the rest comparison); the later "nuclei" had 37 fibers (H88); the exposure of Abell 1904 gave 26 spectra |
| col, colTilt | mirror, unset (automatic off-axis tilt) | SOURCED (off-axis); tilt NOT FOUND | HU79 Sec. II "normal off-axis collimator mirror" |
| W, f_col | 76.2 mm, 685.8 mm | SOURCED beam (3 inch nominal), DERIVED f_col = 9 x 76.2 | HU79 |
| gType, G, m, lamB1 | reflection, 300 /mm, 1, 4000 A (given as 2 sin(theta_B) / G in the preset convention) | SOURCED | M80 Sec. III |
| lamC | 4700 A | DERIVED | middle of the 3900-5500 A well-exposed range (M80); circular for the coverage test |
| psi | 40 deg | MEASURED from a non-scaled schematic (angle only) | HU79 Fig. 3: the collimated beam runs vertically to the grating, the diffracted beam leaves about 37-43 deg from it (left edge ray 36.6 deg, right edge ray 42.8 deg on a 200 dpi render); with the grating drawn 15.6 deg from the horizontal this gives alpha = 15.6 deg and |beta| = 24.4 deg on the opposite side, and sin(15.6) - sin(24.4) = -0.144, i.e. 4800 A in first order for 300 l/mm, so the sketch is consistent with the grating equation; it draws the 1979 modified system, not Medusa, and the camera stands at the same angle only if the B&C geometry is unchanged |
| fcam | 125 mm | EFFECTIVE | f_cam = cos(beta) x 10^7 / (G x 250 A/mm) with beta the diffraction angle at 4700 A and psi = 40 deg (alpha, beta = 24.3, -15.7 deg): 128.4 mm if beta = 15.7 deg and 121.5 mm if beta = 24.3 deg (the explorer's convention decides; refit by running the model); 125 mm is the mean. This fits the dispersion at the PLATE, so any image-tube demagnification and the transfer lens's magnification are folded in; the camera is f/1.64 on a 76.2 mm beam, which is fast but plausible for a solid Schmidt with an image tube |
| cam | mirror (catadioptric, internal focus: the solid Schmidt's focus lies on its back face against the image tube) | INFERRED drawing choice | HU79 Fig. 3 |
| layLen, camLen | SCHEMATIC: not found; choose the explorer's default | SCHEMATIC | HU79 Fig. 3 is not to scale (its drawn 10-inch collimator focus is a factor of about 1.7 short of the drawn beam width, if 154 px is the 4-inch mirror) |
| Nx, Ny, pix | 400, 250, 20 um | EFFECTIVE | NOT FOUND (plate format, tube photocathode, resolution). The 20 um pixel follows the halecoude convention (the plate's resolution limit); 20 um x 250 A/mm = 5.0 A/px, so the 15 A resolution spans 3 px. Nx x pix = 8 mm = 2000 A, covering the 3900-5500 A well-exposed range with margin. Ny = 250 covers the 25 mm slit at the demagnification 0.182 (4.6 mm = 228 px) |
| filt | none | | a coverage cut is not published; the explorer's span is Nx x dispersion |

## Published performance (validation targets)

| quantity | value | kind | source |
|---|---|---|---|
| reciprocal dispersion | about 250 A/mm = 5.0 A/px at 20 um | nominal (the paper's own); the fcam fit input, so CIRCULAR | M80 Sec. III; HN82 Sec. I |
| resolution | 15 A (R about 310 at 4700 A) | stated for A754 image-tube spectra; not marked MEASURED or geometric (includes image tube and plate) | H88 Fig. 1 caption |
| slit-image width (independent) | model: round fiber image 54.7 um on the plate = 13.7 A full width (11.8 A FWHM-equivalent) against the stated 15 A | DERIVED from f_col = 9 x 76.2 mm and the fitted camera; the 15 A is wider because the tube and plate add their own width (not modeled); the demagnification 0.182 uses only the sourced f/9 and 3 inch and the one fit | this record |
| coverage | 3900-5500 A well exposed; 4000-5600 A shown | stated; circular for lamC | M80 Sec. III; H88 Fig. 1 |
| spectra per exposure | 26 (A1904, 3 hr), 8 (A754), 37 (A576, HN82 Fig. 1) | observed | M80; H88; HN82 |
| velocity precision | external about 94 km/s (M80, 8 galaxies), about 100 km/s (HN82); 50 km/s expected with a CCD | MEASURED against published redshifts (not modeled) | M80, HN82 |
| fiber throughput | 60 percent of fiber output inside f/9; entrance and exit losses unmeasured | MEASURED (focal ratio degradation) | M80 Sec. IV |
| scale along the slit | 625 um between holes at the slit, 114 um on the plate (5.7 px at 20 um) | DERIVED | M80 (2.5 cm, about 40 holes) and the fit above |

## NOT FOUND

- The camera focal length, the camera's focal ratio, the collimator's physical focal length (derived from f/9 x 3 inch, not stated for the 2.3 m), the camera-collimator angle for the standard configuration, the grating's ruled size, and any collimator tilt.
- The image tube's photocathode diameter, its resolution, the plate size, and the pixel or grain size of the IIIa-J emulsion in the setup. The explorer's 20 um pixel is a convention.
- Any layout figure of Medusa itself. H88 Fig. 2 draws only the fiber "nucleus" (aperture plate, galaxy-hole fibers, guide-star fibers and PMTs, image conduit, comparison lamp, row of fibers at the slit); HU79 Fig. 3 is the closest spectrograph drawing.
- Instrument throughput or efficiency of the whole system (M80 gives only the f/9 fraction and the factor-of-4 exposure penalty). The SPIE papers (Hill et al. 1982, 1983) and the 1984 thesis probably hold the efficiency, the design focal ratios and a layout; they were not reached.
- The slit length used by the spectrograph in normal single-object mode and the Cassegrain spectrograph's own manual.

## Conflicts between sources

1. **Plate scale:** M80 gives 9.8 arcsec/mm (Sec. II) and 9.7 arcsec/mm (Sec. IV, error list): F = 9.19 or 9.29. The preset's F = 9 is a convention, not either.
2. **Fiber count:** about 40 slit holes and 32 galaxy holes (M80, 1980); 20 fibers in the December 1979 test (H88); three sets of 37 (H88, the system after 1980); HN82 plates carry 37 spectra with every eighth fiber on the lamp.
3. **Fiber type:** M80 says "plastic-clad fused silica" from Galileo Electro-Optic; H88 says "QSF (Quartz et Silice)" fibers for the three nuclei and "Galileo ... PCS fibers" for the first test. Both are 300 um; whether the maker changed is not stated.
4. **Which spectrograph hardware is drawn:** HU79 describes the spectrograph on the 36 inch with a modified collimator; the statements about the standard (off-axis f/9, 3 inch, 300 l/mm) apply to the 90 inch Cassegrain spectrograph that Medusa used (HU79 names it; M80 says "normal configuration").

## Notes

- **Era and service:** first fibers at the Steward 36 inch in 1978 (HU79, H88 Table 1); first multiobject run December 1979; named MEDUSA with a 30 arcmin field later in 1980; the 3 hr Abell 1904 plate of March 1980 (26 redshifts) is the paper's showcase and is commonly cited as the first fiber multi-object spectrograph result; photographic until about 1981-82, then an intensified RCA CCD (HN82); replaced by the MX Spectrometer (32 robot arms, commissioning from January 1985, H88). The preset represents the 1980 photographic configuration.
- **Layout from HU79 Fig. 3 (p. 1076), for the description in the explorer's drawing:** fiber (or slit) head at the collimator focus, the f/9 collimator mirror at the bottom sending a collimated beam up to the grating; the grating returns the beam toward a solid Schmidt camera on the same side as the fiber head, which feeds a two-stage image tube, then an f/1 transfer lens and a photographic plate. The standard collimator is off-axis (the slit is not in the returning beam); the figure draws the 1979 on-axis modification. All distances SCHEMATIC.
- **What the explorer cannot represent:** (i) the image-tube chain: its gain, its own resolution and distortion (no figure found), and the transfer-lens relay to the plate; (ii) the photographic plate's characteristic curve and grain noise (the effective pixel is a convention, and the model's CCD noise terms do not apply); (iii) focal-ratio degradation in the fibers (60 percent of the light inside f/9; the virtual-fiber convention ignores the loss); (iv) fiber-to-fiber zero-point shifts of the spectra (poorly aligned holes: HN82; the Hg-lamp zero-point correction) and the field curvature or positioning errors; (v) the 40 spectra are spread over the 4.6 mm tube image, not the whole chip; (vi) the fibers are fed by drilled plates, not by a robot (the MX), so the number of spectra per field and the 40 min field change are not modeled.
- **Circularity:** fcam and the pixel are fit or chosen from the dispersion, so the dispersion and the number of pixels per resolution element are not independent tests. The independent tests are the fiber-image width (the model's 13.7 A full width against the stated 15 A, expected to be lower because the tube adds width) and the coverage in the Nx x dispersion span (2000 A against 1600 A well exposed).
- **Request to the user:** please supply Hill et al. 1982, SPIE 331, 279 (https://ui.adsabs.harvard.edu/abs/1982SPIE..331..279H) and Hill, Angel & Scott 1983, SPIE 380, 354 (https://ui.adsabs.harvard.edu/abs/1983SPIE..380..354H) if you want the collimator, camera and grating-angle numbers sourced instead of EFFECTIVE.
