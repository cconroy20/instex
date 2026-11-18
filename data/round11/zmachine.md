# Round 11 (2026-11-18): the CfA "Z-machine" (Reticon spectrograph of the 1.5 m Tillinghast reflector, 1978 to the 1990s) (id `zmachine`)

Same rules as rounds 1-10 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/zmachine/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so that the explorer reproduces a published quantity; **INFERRED** marks a reading that is not stated; **SCHEMATIC** marks a layout element with no source. Quotes were machine-checked against `pdftotext -layout` and `-raw` text (letters and digits only, so hyphenation, dashes, accents and ligatures do not matter): **46 quote pieces, 0 failures** (script: scratchpad r11/zmachine/gen.py). The key paper, Tonry & Davis 1979 (T79), is a scan without a text layer: it was OCRed with tesseract (OCR text saved as 1979AJ.....84.1511T.ocr.txt beside the PDF), its quotes are marked "transcribed from the scan (p. N)", and the key paragraph (p. 1512, the detector and the observing technique) was also read on the page image. In the OCR text the micro sign is lost (so "30 um" reads "30"), the double prime is lost (so 3.2 arcsec reads "3.2") and the angstrom sign reads "A"; the quotes are given as OCRed minus those symbols and the values are read in the Value column. Machine-readable twin: `data/round11/zmachine.json`.

## Completeness summary

**Complete from the survey papers (T79, D82, H83):** the detector (a dual 936-diode Reticon, diodes 375 x 30 um with no dead space, photon events located to half a diode, so two 1872-pixel spectra of 15 um effective pixels, behind a fiber-optically coupled high-gain image-tube package), the observing technique (a pair of 12.5 x 3.2 arcsec slits 30 arcsec apart, object and sky swapped), the grating (600 l/mm, first order), the dispersion (120 A/mm; 1.8 A pixels), the resolution (4.8 A FWHM, 30-40 um at the detector), the coverage (4300-6900 A) and the velocity precision (about 35-40 km/s external). The Z-machine detector also served behind the 1.5 m echelle (Peterson et al.).

**Not found (matters):** the optical prescription of the spectrograph itself. No saved source gives the collimator (type, focal length, beam diameter, on- or off-axis), the camera (type, focal length), the grating's blaze or the camera-collimator angle, the focal ratio at the focus, or any layout figure. The instrument paper, Latham 1982 (ASSL 92, 259, "Spectroscopy with Photon-Counting Reticons", ADS 1982ASSL...92..259L) is the reference that Huchra et al. 1983 and Huchra et al. 1995 cite for the system, and Davis & Latham 1979 (SPIE 172, 71, "Photon-Counting Reticon Detector", ADS 1979SPIE..172...71D) describes the detector; neither is reachable (see Sources). So the layout is SCHEMATIC throughout, and the camera, collimator and angle in the preset are EFFECTIVE values fitted to the published dispersion and slit scale.

**Recommended preset:** "Tillinghast 1.5 m / Z-machine, 600 l/mm" (the redshift-survey setup): D = 1.524 m, F = 10.42 (INFERRED from FAST's plate scale), slit 3.2 arcsec, nObj 2 (two apertures, object and sky), 600 l/mm first order, centered at 5600 A (middle of 4300-6900), detector 1872 x 2 effective pixels of 15 um (Ny = 2), band `filt` 4300-6900 A, and an EFFECTIVE camera and collimator (below). Era: the CfA Redshift Survey, spring 1978 to the early 1990s (Reticon, before the 1994 FAST CCD spectrograph that replaced it on the same telescope). **Setting menu:** one setting, `600 l/mm, 3.2″`. No other Mount Hopkins grating is documented in the saved sources (the 900 and 1200 l/mm gratings belong to the Brazilian sister system, D84, and are context only).

## Sources

| key | document | local file (rawdata/presets/zmachine/) | URL |
|---|---|---|---|
| T79 | Tonry, J. & Davis, M. 1979, AJ 84, 1511, "A survey of galaxy redshifts. I. Data reduction techniques" (ADS 1979AJ.....84.1511T, title checked on ADS; 15 pp.; scan WITHOUT a text layer: OCRed with tesseract, OCR text saved beside it as 1979AJ.....84.1511T.ocr.txt; quotes are "transcribed from the scan (p. N)"; the key page 1512 was also read on the page image) | 1979AJ.....84.1511T.pdf | https://articles.adsabs.harvard.edu/pdf/1979AJ.....84.1511T |
| D82 | Davis, M., Huchra, J., Latham, D. W. & Tonry, J. 1982, ApJ 253, 423, "A survey of galaxy redshifts. II. The large scale space distribution" (ADS 1982ApJ...253..423D; 23 pp.; text layer, two columns) | 1982ApJ...253..423D.pdf | https://articles.adsabs.harvard.edu/pdf/1982ApJ...253..423D |
| H83 | Huchra, J., Davis, M., Latham, D. & Tonry, J. 1983, ApJS 52, 89, "A survey of galaxy redshifts. IV - The data" (ADS 1983ApJS...52...89H; 31 pp.; text layer) | 1983ApJS...52...89H.pdf | https://articles.adsabs.harvard.edu/pdf/1983ApJS...52...89H |
| D84 | da Costa, L. N. et al. 1984, AJ 89, 1310, "Redshifts for 228 southern galaxies" (ADS 1984AJ.....89.1310D; 9 pp.; a SISTER system: the CfA-built photon-counting Reticon on the 60-inch of the Observatorio Astrofisico Brasileiro, not the Mount Hopkins instrument) | 1984AJ.....89.1310D.pdf | https://articles.adsabs.harvard.edu/pdf/1984AJ.....89.1310D |
| P83 | Peterson, R. C., Willmarth, D. W. & Carney, B. W. 1983, ApJ 265, 972, "The rotation of horizontal-branch stars. I. Members of the field" (ADS 1983ApJ...265..972P; Z-machine on the 1.5 m echelle) | 1983ApJ...265..972P.pdf | https://articles.adsabs.harvard.edu/pdf/1983ApJ...265..972P |
| B85 | Blair, W. P. & Kirshner, R. P. 1985, ApJ 289, 582, "Improved optical spectrophotometry of supernova remnants in M33" (ADS 1985ApJ...289..582B; Table 1 lists the Z-machine aperture, coverage and resolution) | 1985ApJ...289..582B.pdf | https://articles.adsabs.harvard.edu/pdf/1985ApJ...289..582B |
| W94 | Wells, L. A. et al. 1994, AJ 108, 2233, "The Type IA Supernova 1989B in NGC 3627 (M66)" (ADS 1994AJ....108.2233W; the Z-machine was in use on 1989 February-March) | 1994AJ....108.2233W.pdf | https://articles.adsabs.harvard.edu/pdf/1994AJ....108.2233W |
| H95 | Huchra, J. P., Geller, M. J. & Corwin, H. G. 1995, ApJS 99, 391, "The CfA Redshift Survey: Data for the NGP +36 Zone" (ADS 1995ApJS...99..391H; shows the Reticon systems were in use for the survey's last zone) | 1995ApJS...99..391H.pdf | https://articles.adsabs.harvard.edu/pdf/1995ApJS...99..391H |
| C81 | Carney, B. W. & Peterson, R. C. 1981, ApJ 251, 190, "Field population II blue stragglers" (ADS 1981ApJ...251..190C; Z-machine on the 1.5 m echelle) | 1981ApJ...251..190C.pdf | https://articles.adsabs.harvard.edu/pdf/1981ApJ...251..190C |
| F98 | Fabricant, D., Cheimets, P., Caldwell, N. & Geary, J. 1998, PASP 110, 79, "The FAST Spectrograph for the Tillinghast Telescope" (saved for the FAST preset, rawdata/presets/fast/; used here for the telescope's aperture and plate scale) | ../fast/Fabricant1998_PASP110_79_FAST.pdf | https://ui.adsabs.harvard.edu/link_gateway/1998PASP..110...79F/PUB_PDF |

Not downloaded (not reachable, or behind a publisher): **Latham, D. W. 1982, "Spectroscopy with Photon-Counting Reticons", in Instrumentation for Astronomy with Large Optical Telescopes (ASSL 92), p. 259, bibcode 1982ASSL...92..259L** (ADS holds no free scan: the articles.adsabs.harvard.edu URL returns an Access Denied page; the book is a Springer chapter, https://ui.adsabs.harvard.edu/abs/1982ASSL...92..259L); **Davis, M. & Latham, D. W. 1979, SPIE 172, 71, "Photon-Counting Reticon Detector", bibcode 1979SPIE..172...71D** (SPIE refuses automated access; https://ui.adsabs.harvard.edu/abs/1979SPIE..172...71D); Tonry & Davis 1981a and Tonry 1980 (cited by D82); Shectman & Hiltner 1976 (PASP 88, 960, the detector design the Z-machine copied; not downloaded). **Please supply the Latham 1982 chapter and the Davis & Latham 1979 paper**: they probably give the image-tube chain (demagnification, photocathode format) and may describe the spectrograph. Also not downloaded: Huchra et al. 1990 (ApJS 72, 433) is saved but only repeats "photon-counting Reticon systems"; de Lapparent, Geller & Huchra 1986 (ApJ 302, L1, "A Slice of the Universe") was fetched and holds no instrument text, so it was deleted.

## Z-machine parameters

### Telescope and feed

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Telescope aperture | 1.524 | m | SOURCED | F98, Table 2, primary mirror | "Mirror 1524" |
| Telescope aperture (alt) | 1.5 m |  | SOURCED | D82, p. 423, Introduction | "on the Mount Hopkins 1.5 m telescope" |
| Telescope | Tillinghast 1.5 m reflector, Mount Hopkins (Whipple Observatory); also called the 60-inch |  | SOURCED | H83, p. 91, Sec. III | "a moderate dispersion spectrograph on the Tillinghast 1.5 m reflector on Mount Hopkins" |
| Plate scale at the Cassegrain focus | 77 (FAST's value; the Z-machine's own is not published) | um/arcsec | INFERRED | F98, Sec. 3.1 | "telescope scale of" |
| Focal ratio at the focus | 10.42 | f/# | INFERRED | F98, Sec. 3.1 | "telescope scale of" |
| Focal ratio (arithmetic) | DERIVED: F = 77e-6 m x 206264.8 / 1.524 m = 15.88 m / 1.524 m = 10.42. Inferred because both instruments hang at the Cassegrain focus of the same telescope; no Z-machine paper states the focal ratio or the scale (NOT FOUND). A conventional f/13.5 would give 100 um/arcsec: it is NOT sourced here and the two disagree by 30 percent. |  | DERIVED |  |  |
| Entrance apertures (slits) | a pair of slits 12.5 arcsec by 3.2 arcsec, separated by 30 arcsec on the sky (one object, one sky) | arcsec | SOURCED | T79, p. 1512 (transcribed from the scan) | "We have been using a pair of slits 12.5 by 3.2 for most of our observations" |
| Slit width | 3.2 | arcsec | SOURCED | T79, p. 1512 (transcribed from the scan) | "With this slit width, the resulting spectral resolution is only slightly degraded from the detector resolution." |
| Slit length | 12.5 | arcsec | SOURCED | T79, p. 1512 (transcribed from the scan) | "slits 12.5 by 3.2" |
| Slit length (alt) | ALT: 12.6 arcsec long apertures (6 x 12.6 and 3.1 x 12.6 arcsec) in the Z-machine rows of Blair's tables | arcsec | SOURCED | B85, p. 583, Table 1 | "FLWO 1.5 m 6 x 12.6 9000 4500-7000 7" |
| Two-aperture sky subtraction | two channels, object on one and sky on the other, then swapped by moving the telescope |  | SOURCED | T79, p. 1512 (transcribed from the scan) | "an exposure of the object on one side and sky on the other side" |
| Separation of the two spectra on the sky | 30 | arcsec | SOURCED | T79, p. 1512 (transcribed from the scan) | "the projected separation between the two spectra is 30 on the sky" |
| Detector scale in the focal plane | DERIVED: the two spectra are the two 375 um rows of the dual array (no dead space), so 30 arcsec = 375 um, i.e. 12.5 um/arcsec at the Reticon (INFERRED: that the 30 arcsec equals one row height) | um/arcsec | DERIVED |  |  |
| Spectrograph demagnification | DERIVED/INFERRED: 77 / 12.5 = 6.2 (needs the inferred 77 um/arcsec); the paper says only 'the demagnification of the spectrograph' |  | DERIVED | T79, p. 1512 (transcribed from the scan) | "with the demagnification of the spectrograph" |

### Detector

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Array | dual linear photodiode array, 936 diodes by 2 (Reticon) |  | SOURCED | T79, p. 1512 (transcribed from the scan) | "The detector is a 936 by 2 diode Reticon" |
| Array (alt) | ALT: dual 936 linear Reticon array behind a high-gain image intensifier system |  | SOURCED | P83, p. 974, Sec. II | "the Z-machine, a dual linear Reticon array of 936 pixels" |
| Diode size | 375 x 30 um, no dead space | um | SOURCED | T79, p. 1512 (transcribed from the scan; read on the page image) | "The diodes of the Reticon are 375 by 30" ... "with no dead space" |
| Pixels per spectrum | 1872 (photon events located to 1/2 diode) | px | SOURCED | T79, p. 1512 (transcribed from the scan) | "diode (one pixel) and so we obtain simultaneously two 1872 pixel spectra" |
| Effective pixel size | 15 um (half a diode); format 1872 x 2 effective pixels | um | DERIVED | T79, p. 1512 | DERIVED: 30 um / 2 = 15 um. Cross-check: 120 A/mm x 0.015 mm = 1.8 A, the pixel the paper quotes (see Dispersion) |
| Intensifier | fiber-optically coupled to a high-gain image-tube package (electrostatic tubes; fiber-optic input window on the first photocathode) |  | SOURCED | T79, p. 1512 (transcribed from the scan) | "fiber optically coupled to a high-gain image-tube package" |
| Intensifier maker | Varo image intensifiers packaged at SAO; electronics copied from Shectman's design |  | SOURCED | H83, p. 91, Sec. III | "and Varo image intensifiers packaged at SAO" |
| Intensifier evolution | the system, including the intensifiers, evolved considerably after the first version (Latham 1982, not obtained) |  | SOURCED | H83, p. 91, Sec. III | "has evolved considerably since then" |
| Blue limit of the response | poor response blueward of 4000 A (fiber-optic window) | A | SOURCED | T79, p. 1512 (transcribed from the scan) | "The detector has poor response to the blue of 4000" |
| Detector resolution | 30-40 um FWHM | um | SOURCED | T79, p. 1512 (transcribed from the scan) | "Our typical resolution is 30-40" |
| Photon counting | events are located in position to half a diode; spectra accumulate in a minicomputer in real time; fixed-pattern noise is removed with incandescent-lamp exposures |  | SOURCED | T79, p. 1512 (transcribed from the scan) | "The photon counting nature of the detector enables us to examine the spectrum in real time" |
| Detector in other mode | the same detector also served behind the 1.5 m echelle (one order, about 60 A, at a time) |  | SOURCED | P83, p. 974, Sec. II | "Spectral coverage is limited to a single echelle order" |

### Disperser and spectrograph

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Grating | 600 lines/mm, first order (reflection assumed: INFERRED, not stated) | l/mm | SOURCED | T79, p. 1512 (transcribed from the scan) | "we generally use a 600 line/mm grating in first order" |
| Spectrograph type | an 'intermediate-dispersion' spectrograph at the Cassegrain focus (type of collimator and camera NOT FOUND) |  | SOURCED | D82, p. 423, Introduction | "photon-counting Reticon detector and intermediate-dispersion spectrograph (the Z-machine)" |
| Spectrograph flexure | slewing the telescope 20 deg can shift the spectrum by up to 100 km/s: the reason for comparison lamps before and after each exposure | km/s | SOURCED | T79, p. 1520 (transcribed from the scan) | "slewing the telescope 20 can shift the spectrum by as much as 100 km/sec" |
| Collimator, beam, camera, blaze, camera-collimator angle | NOT FOUND (see NOT FOUND) |  | NOT FOUND |  |  |

### Coverage, dispersion and resolution

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Coverage (usual tilt) | 4300-6900 (span 2600) | A | SOURCED | T79, p. 1512 (transcribed from the scan) | "so our usual grating tilt covers a span of 2600 A, from 4300 to 6900 A" |
| Coverage (alt, later) | ALT: 4400-7200 'adopted at Mount Hopkins' (stated by a collaborator's paper on the sister system) | A | SOURCED | D84, p. 1311, Sec. II | "in contrast to the range 4400-7200 A adopted at Mount Hopkins" |
| Dispersion | 120 | A/mm | SOURCED | T79, p. 1512 (transcribed from the scan) | "giving a dispersion of 120 A/mm, or a resolution of 4.8 A" |
| Pixel | about 1.8 | A | SOURCED | T79, p. 1516 (transcribed from the scan) | "Our pixels are about 1.8 A in size" |
| Dispersion fitted to the arc and sky lines | 23 lines between pixel 249 (4471 A) and pixel 1661 (6752 A), seventh-order polynomial, rms 0.24 A |  | SOURCED | T79, p. 1517 (transcribed from the scan) | "fitting a seventh-order polynomial to 23 lines between pixel 249, wavelength 4471 A, and pixel 1661, wavelength 6752 A" |
| Mean dispersion from that fit | DERIVED: (6752 - 4471) A / (1661 - 249) px = 1.615 A/px (= 107.7 A/mm at 15 um); see Conflicts | A/px | DERIVED |  |  |
| Resolution (FWHM) | 4.8 A at 120 A/mm; the slit image is about equal to the detector resolution | A | SOURCED | T79, p. 1512 (transcribed from the scan) | "or a resolution of 4.8" |
| Resolution (rms) | about 2 A rms (120 km/s at 5000 A); DERIVED FWHM = 2.355 x 2 = 4.7 A, consistent with 4.8 A | A | SOURCED | T79, p. 1516 (transcribed from the scan) | "our rms resolution is about 2 A (120 km/sec at 5000 A)" |
| Resolving power | DERIVED: R = 5600 / 4.8 = 1170 at the middle of the coverage (GEOMETRIC/nominal: the paper does not say the 4.8 A was measured from arc lines) |  | DERIVED |  |  |
| Slit image at the detector | DERIVED: 3.2 arcsec x 12.5 um/arcsec = 40 um (2.7 px), x 120 A/mm = 4.8 A: the slit image equals the quoted resolution (a consistency check on the inferred scale, not independent of the 12.5 um/arcsec) |  | DERIVED |  |  |
| Later setting, same detector, other resolution | Z-machine spectra of M33 remnants at 7 A resolution through 6 x 12.6 arcsec apertures, 4500-7000 A | A | SOURCED | B85, p. 583, Table 1 | "FLWO 1.5 m 6 x 12.6 9000 4500-7000 7" |

### Velocity precision

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Redshift precision (design paper) | errors often to 20 km/s; rms usually below 40 km/s | km/s | SOURCED | T79, p. 1516 (transcribed from the scan) | "we can often determine redshifts to 20 km/sec and the rms of our error is usually less than 40 km/sec" |
| External error vs 21 cm (Rood) | +-37 | km/s | SOURCED | D82, pp. 423-424, Sec. I | "our typical external redshift error is +-37 km s" |
| Typical CfA absolute error | +-38 (Rood 1982, with an internal-error correction of 10-20 percent) | km/s | SOURCED | H83, p. 91, Sec. III | "typical CfA absolute error is + 38 km s" |
| Accuracy of the survey velocities | typically 35 km/s (the CfA part of the catalog) | km/s | SOURCED | H83, abstract | "accurate to typically 35 km s" |

### Survey and history

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Volume of data | about 3000 galaxy spectra by 1983 |  | SOURCED | H83, p. 91, Sec. III | "date - 3000 galaxy spectra using a photon-counting" |
| Start of the survey observing | Spring 1978: roughly 350 galaxies observed |  | SOURCED | T79, p. 1512 (transcribed from the scan) | "In the Spring of 1978, we observed roughly 350 galaxies in this sample" |
| Throughput of the survey | about 20 galaxies per clear night |  | SOURCED | T79, p. 1512 (transcribed from the scan) | "We can observe roughly 20 galaxies per clear night" |
| Still in use | 1989: Z-machine spectra of SN 1989B; 1995: the survey's NGP +36 zone cites the photon-counting Reticon systems (Latham 1982) |  | SOURCED | W94, p. 2238, Sec. 2 | "(the so-called Z-Machine)" |
| Latham 1982 as the instrument reference | the CfA Reticon systems are described in Latham 1982 (not obtained) |  | SOURCED | H95, p. 391, Sec. 2 | "photon-counting Reticon systems (Latham 1982) on the Tillinghast Reflector (1.5 m)" |

### Sister system (context only)

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| ON 60-inch Reticon | a Cassegrain spectrograph plus an identical CfA photon-counting dual-936 Reticon: 900 l/mm, ~100 A/mm, 6 A FWHM, 3 x 12 arcsec apertures 30 arcsec apart; 1200 l/mm ~60 A/mm in a few early cases |  | SOURCED | D84, p. 1311, Sec. II | "Most observations were made using a 900-line/mm grating, giving a dispersion of 100 A/mm with a typical resolution of 6 A (FWHM)" |
| ON 60-inch detector | dual 936 Reticon coupled to a high-gain image tube, identical to the latest CfA version |  | SOURCED | D84, p. 1310, Sec. II | "dual 936 Reticon system coupled to a high-gain image tube package" |

## Preset values for the explorer

| state | value | tag | how |
|---|---|---|---|
| mode, D | grating, 1.524 m | SOURCED | F98 Table 2 |
| F | 10.42 | INFERRED | FAST's 77 um/arcsec at the same Cassegrain focus; the Z-machine's scale is NOT FOUND |
| slitW, nObj | 3.2 arcsec, 2 | SOURCED | T79 p. 1512 (pair of slits) |
| G, m, gType | 600 /mm, 1, reflection | SOURCED (reflection INFERRED) | T79 p. 1512 |
| lamC | 5600 A | DERIVED | middle of 4300-6900 A (T79); circular for the coverage test |
| lamB1 (blaze) | NOT FOUND; any value near 5000-5500 A (the explorer needs one for the efficiency curve only) | NOT FOUND | |
| Nx, Ny, pix | 1872, 2, 15 um | DERIVED | T79: 936 diodes x 2 half-diode positions; 30 um diode / 2; the two 375 um rows are the two apertures |
| psi | 20 deg | EFFECTIVE (a free choice) | NOT FOUND; with psi = 20 deg: alpha = 19.8, beta = -0.2 deg at 5600 A (sin alpha + sin beta = G lambda = 0.336); a different psi changes f_cam by under 3 percent |
| fcam | 139 mm | EFFECTIVE | f = cos(beta) / (G dlambda/dx) with dlambda/dx = 120 A/mm = 1.2e-5 mm/mm: 138.9 mm. Fitted to the sourced 120 A/mm at the 15 um pixel; this fits the dispersion at the Reticon, so any image-tube demagnification is folded in |
| collimator f, beam W | 856 mm, 82 mm | EFFECTIVE | f_col = f_cam x (77 um/arcsec) / (12.5 um/arcsec) = 856 mm, from the 30 arcsec = one 375 um row relation (INFERRED) and the inferred telescope scale; W = f_col / F = 82 mm. Circular for the slit scale (the 40 um slit image equals the quoted 4.8 A) |
| col, cam types, colTilt, layLen, camLen | SCHEMATIC: 'mirror'/'mirror', no source for any of them | SCHEMATIC | no layout figure and no prescription were found |
| filt | 4300-6900 A | SOURCED | T79 p. 1512 (the Reticon has 1872 px x 1.8 A = 3370 A, more than the usable 2600 A) |

**On-axis or off-axis collimator:** NOT FOUND. No saved source describes the collimator at all, so the deploy gate for colTilt cannot be settled from the record; the preset's drawing is SCHEMATIC and the tilt is a free choice.

## Published performance (validation targets)

| quantity | value | kind | source |
|---|---|---|---|
| dispersion | 120 A/mm = 1.8 A/px | design/nominal (the paper's own conversion); the effective-fit input, so CIRCULAR for the dispersion | T79 p. 1512, p. 1516 |
| dispersion, independent | 1.615 A/px (107.7 A/mm) mean over pixels 249-1661 | MEASURED from 23 arc and sky lines, then DERIVED here | T79 p. 1517 |
| resolution FWHM | 4.8 A (R about 1170 at 5600 A); rms 2 A | stated, not marked as measured; geometric-looking (slit image = detector resolution) | T79 p. 1512, 1516 |
| coverage | 4300-6900 A | stated; circular for lamC and filt | T79 p. 1512 |
| scale along the slit | 12.5 arcsec slits; 30 arcsec between the two apertures = one 375 um row | the 12.5 um/arcsec follows from the equality, INFERRED | T79 p. 1512 |
| redshift precision | external about 37 km/s (Rood), CfA absolute 38 km/s, 35 km/s typical | MEASURED against 21 cm redshifts | D82, H83 |
| spectra per detector | 2 (object and sky) | SOURCED | T79 |

## NOT FOUND

- The spectrograph's optical prescription: collimator type, focal length, beam diameter, on- or off-axis; camera type and focal length; grating blaze, the angle of incidence and the camera-collimator angle; the Cassegrain focal ratio and plate scale; the image tube's input-to-output demagnification and photocathode format; the slit's physical width in micrometers.
- Any layout figure or drawing of the Z-machine spectrograph (the sources are science papers; the instrument description is in Latham 1982 and Davis & Latham 1979, not obtained).
- A throughput, a quantum efficiency or a measured resolving power from arc lines.
- Whether the grating is used in reflection (assumed; a 600 l/mm grating at 120 A/mm is a reflection grating in the usual sense).
- The CfA web pages and the FLWO instrument histories.

## Conflicts between sources

1. **Pixel size vs fitted dispersion.** T79 quotes 120 A/mm and "pixels are about 1.8 A" (consistent with the 15 um pixel); the T79 pixel-wavelength fit gives 1.615 A/px between pixels 249 and 1661 (a 10 percent smaller mean pixel, 107.7 A/mm at 15 um). Either 120 A/mm is rounded, or the pixel grid is not uniform (a seventh-order polynomial was needed). D82 repeats "about 1.8 A".
2. **Coverage vs the array.** 1872 px x 1.8 A = 3370 A (3023 A at 1.615 A/px), but the usual coverage is 2600 A (4300-6900), and the later Mount Hopkins range is 4400-7200 A (D84, 2800 A). Not explained in the sources; the usable span probably follows the image tube, which is a reading, not a statement.
3. **Resolution of the Z-machine in other programs.** T79 gives 4.8 A with the 3.2 arcsec slit; B85 lists 7 A for 6 x 12.6 arcsec apertures. Different apertures and tilt, not a conflict in the instrument.
4. **Focal ratio.** None stated for the Z-machine; the preset borrows FAST's 77 um/arcsec (f/10.42). A conventional f/13.5 would change the collimator and beam in the EFFECTIVE fit (not the dispersion).

## Notes

- **Era:** the CfA Redshift Survey instrument: first light on galaxies in spring 1978 (350 galaxies that spring; T79), about 3000 spectra by 1983 (H83), still in use in 1989 (W94) and for the 1995 NGP +36 zone (H95); replaced for general use on the 1.5 m by the CCD spectrograph FAST in 1994 (F98).
- **What the explorer cannot represent:** (i) photon counting: each detected photon is located to half a diode, so there is no read noise and no bias, and the noise is Poisson on counts per pixel (the explorer's CCD noise model does not apply); (ii) the image intensifier chain: its resolution (the 30-40 um FWHM is the detector's, comparable to 2-2.7 pixels), its gain, its photocathode (S-20 with a fiber-optic window, cutting off below 4000 A) and its demagnification are folded into the single effective pixel; (iii) the fixed-pattern noise and its incandescent-lamp flat; (iv) the dual rows as two fixed apertures 30 arcsec apart (modeled as nObj = 2 and the 375 um row height as Ny = 2 effective rows); (v) the spectrograph's flexure (up to 100 km/s on a 20 deg slew), which limited the zero point.
- **Layout:** no figure gives positions. Tag every element SCHEMATIC, including whether the collimator is on- or off-axis.
- **The explorer's FAST preset:** same telescope (Tillinghast 1.5 m, D = 1.524 m, f/10.42 from 77 um/arcsec, F98). FAST replaced the Z-machine at the Cassegrain focus, so the aperture and plate scale in the Z-machine preset follow FAST's; the 375 um row height and the 30 arcsec separation (T79) are a check on that scale that the Z-machine papers themselves do not state.
- **Prescription and slit scale are circular:** the fcam and f_col fits use the dispersion and the 12.5 um/arcsec relation, so the dispersion and the 4.8 A resolution are NOT independent tests; the independent tests are the 1.615 A/px fit (T79 p. 1517; it differs from 1.8 by 10 percent), the 2600 A coverage against the 1872-pixel format, and the velocity precision (not modeled).
