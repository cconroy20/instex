# Round 12 (2026-11-18): the CfA Digital Speedometers (Tillinghast 1.5 m, Wyeth 1.5 m, MMT; echelle plus photon-counting Reticon, 1979 to the 2000s) (id `speedometer`)

Same rules as rounds 1-11 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/speedometer/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so that the explorer reproduces a published quantity; **INFERRED** marks a reading that is not stated. Quotes were machine-checked (letters and digits only, so hyphenation, dashes, accents and ligatures do not matter) against `pdftotext -layout` and `-raw` text and, for scans, against tesseract OCR text saved beside each scan as `<bibcode>.ocr.txt`: **53 quote pieces, 0 failures** (script: scratchpad r12/speedometer/check.py). Scans without a text layer (L92, L88F, LG86, L96, S99, L98, L82B) are marked "transcribed from the scan" where the quote came from OCR; the OCR dropped or garbled symbols (the Angstrom sign, minus signs in km s-1, micro signs), so the quotes keep the OCRed words and the values are read in the Value column. Two C74 labels are drawn in Fig. 1 as image text; they were read on the page image (pdftoppm, 200 dpi) and are marked so. Page locations are journal pages found by the checker. Machine-readable twin: `data/round12/speedometer.json`.

## Completeness summary

**Complete from the papers:** the observing setup (a single echelle order centered near 5187 A, 45 A wide, recorded by a photon-counting intensified Reticon, resolution 10 km/s early and 8.3-8.5 km/s later, 1.8 km/s per pixel, dispersion about 2.1 A/mm, velocity precision 0.5-0.7 km/s, 125 m/s at best), and the optical prescription of the spectrograph it was built on: Chaffee 1974 (C74) gives the Mount Hopkins Cassegrain echelle with a drawn optical layout (Fig. 1): collimator f = 54 cm with a 56.2 mm beam, a 31.6 g/mm 4 x 8 inch Bausch and Lomb echelle, a cross-disperser, a 75 cm camera mirror, and the telescope scale at the slit. Chaffee & Latham 1982 (CL82) states that the speedometer echelle (the "Agassiz f/9 Cassegrain echelle spectrograph", Latham 1978) is an upgraded version of that Mount Hopkins echelle, and Peterson et al. 1984 (P84) gives the 2.1 A/mm dispersion of the Tillinghast and Wyeth spectrographs, which agrees with C74's dispersion scaled to 5200 A (2.06 A/mm).

**Not found (matters):** (1) the instrument papers themselves: **Latham 1985** (IAU Colloquium 88, "Stellar Radial Velocities", p. 21; ADS lists it as 1985srv..conf...21L under the wrong title and author, "Cross-Correlation Spectroscopy Using CORAVEL", M. Mayor; abstract: "This paper summarizes the instruments and techniques in use at Center for Astrophysics ... digital speedometry of stars"), **Latham 1982** ("Spectroscopy with Photon-Counting Reticons", in Instrumentation for Astronomy with Large Optical Telescopes, ASSL 92, p. 259, ADS 1982ASSL...92..259L), **Latham 1978** (Reference Manual for the Agassiz and Mt Hopkins Cassegrain Echelle Spectrographs, private distribution, 35 pp), and **Latham et al. 1989, Nature 339, 38** (1989Natur.339...38L, "The unseen companion of HD114762: a probable brown dwarf"; no free scan). None could be fetched: please supply the PDFs of Latham 1985 and Latham 1982 first. (2) The order-isolating filter, the echelle blaze angle, gamma, the detector format of the speedometer version, the Tillinghast slit width and length, and the collimator type (mirror or lens) and whether it is on its axis. (3) A layout figure of the speedometer itself; the only drawing is the 1974 photographic configuration (C74 Fig. 1).

**Recommended preset:** "Tillinghast 1.5 m / Digital Speedometer" (echelle mode): the Tillinghast speedometer is the best documented because the Mount Hopkins echelle's drawing and prescription are published for this telescope (C74, its scale at the slit is given for the 60-inch), its dispersion is sourced (P84, C84, T93), and its telescope is the one the FAST and Z-machine presets already use (D = 1.524 m, F = 10.42). The Wyeth 1.5 m differs in feed (f/13, slit 1 x 6 arcsec, a fiber-fed prototype in 1988) and the MMT in feed (six beams and an image stacker), so neither is the better preset. State: D 1.524, F 10.42, slit 1.0 arcsec (INFERRED), nObj 1, collimator 540 mm with a 56.2 mm beam, camera 750 mm, echelle 31.6 g/mm 4 x 8 inch with the EFFECTIVE tan delta = 1.65, order about 104 at 5187 A, band `filt` 5165.8-5211.2 A (the DM Vir window, L96, which isolates the single order), Reticon 15 um effective pixels. Era: 1979 to the mid 1990s (Reticon; photon-counting system of Latham 1982), and the same instruments were in use for the survey in 1997. **Setting menu:** one setting, `Mg b order`. Optional second setting if you want it: none documented.

## Sources

| key | document | local file (rawdata/presets/speedometer/) | URL |
|---|---|---|---|
| C74 | Chaffee, F. H., Jr. 1974, ApJ 189, 427, "Line spectra in interstellar clouds. I. The Perseus 2 cloud" (ADS 1974ApJ...189..427C; Sec. II.a and Fig. 1 describe the Mount Hopkins 60-inch Cassegrain echelle spectrograph, the instrument the Reticon speedometer was built on; text layer) | 1974ApJ...189..427C.pdf | https://articles.adsabs.harvard.edu/pdf/1974ApJ...189..427C |
| CL82 | Chaffee, F. H., Jr. & Latham, D. W. 1982, PASP 94, 386, "An image stacker for high-resolution spectroscopy on the Multiple Mirror Telescope" (ADS 1982PASP...94..386C; text layer) | 1982PASP...94..386C.pdf | https://articles.adsabs.harvard.edu/pdf/1982PASP...94..386C |
| L92 | Latham, D. W. 1992, ASP Conf. Ser. 32, 110, "Surveys of Spectroscopic Binaries at the Center for Astrophysics" (ADS 1992ASPC...32..110L; the best free description of the speedometers; scan WITHOUT a text layer: OCRed with tesseract, OCR text saved as 1992ASPC...32..110L.ocr.txt; quotes are transcribed from the scan) | 1992ASPC...32..110L.pdf | https://articles.adsabs.harvard.edu/pdf/1992ASPC...32..110L |
| L88F | Latham, D. W., Andersen, J., Geary, J. C., Rodrigues, O. & Stefanik, R. P. 1988, ASP Conf. Ser. 3, 269, "A fiber feed for precise radial velocity work with the CfA echelle spectrographs" (ADS 1988ASPC....3..269L; the Wyeth 1.5 m speedometer; scan, OCRed, OCR text saved as 1988ASPC....3..269L.ocr.txt) | 1988ASPC....3..269L.pdf | https://articles.adsabs.harvard.edu/pdf/1988ASPC....3..269L |
| LG86 | Latham, D. W. & Geary, J. C. 1986, IAU Symp. 118, 19, "Detector developments for small telescopes" (ADS 1986IAUS..118...19L; scan, OCRed, OCR text saved as 1986IAUS..118...19L.ocr.txt) | 1986IAUS..118...19L.pdf | https://articles.adsabs.harvard.edu/pdf/1986IAUS..118...19L |
| L96 | Latham, D. W. et al. 1996, A&A 314, 864, "Accurate mass determination for double-lined spectroscopic binaries by digital cross-correlation" (ADS 1996A&A...314..864L; scan, OCRed, OCR text saved as 1996A&A...314..864L.ocr.txt) | 1996A&A...314..864L.pdf | https://articles.adsabs.harvard.edu/pdf/1996A&A...314..864L |
| S99 | Stefanik, R. P., Latham, D. W. & Torres, G. 1999, ASP Conf. Ser. 185, 354, "Radial-velocity standard stars" (ADS 1999ASPC..185..354S; scan, OCRed, OCR text saved as 1999ASPC..185..354S.ocr.txt) | 1999ASPC..185..354S.pdf | https://articles.adsabs.harvard.edu/pdf/1999ASPC..185..354S |
| L98 | Latham, D. W. 1998, ASP Conf. Ser. 134, 178, "Low-mass companions found in a large radial-velocity survey" (ADS 1998ASPC..134..178L; scan, OCRed, OCR text saved as 1998ASPC..134..178L.ocr.txt) | 1998ASPC..134..178L.pdf | https://articles.adsabs.harvard.edu/pdf/1998ASPC..134..178L |
| P84 | Peterson, R. C. 1984 et al., ApJ 279, 237, "The blue stragglers of M 67" (ADS 1984ApJ...279..237P; text layer) | 1984ApJ...279..237P.pdf | https://articles.adsabs.harvard.edu/pdf/1984ApJ...279..237P |
| P83 | Peterson, R. C., Willmarth, D. W. & Carney, B. W. 1983, ApJ 265, 972 (ADS 1983ApJ...265..972P; saved for the Z-machine record, rawdata/presets/zmachine/) | ../zmachine/1983ApJ...265..972P.pdf | https://articles.adsabs.harvard.edu/pdf/1983ApJ...265..972P |
| PL86 | Peterson, R. C. & Latham, D. W. 1986, ApJ 305, 645, "Stellar velocity dispersions for four low-concentration globular clusters" (ADS 1986ApJ...305..645P; text layer) | 1986ApJ...305..645P.pdf | https://articles.adsabs.harvard.edu/pdf/1986ApJ...305..645P |
| C84 | Carney, B. W. & Latham, D. W. 1984, ApJ 278, 241, "The Baade-Wesselink method and the distances to RR Lyrae stars. I. The field star VY Serpentis" (ADS 1984ApJ...278..241C; text layer) | 1984ApJ...278..241C.pdf | https://articles.adsabs.harvard.edu/pdf/1984ApJ...278..241C |
| J87 | Jones, R. V. et al. 1987, ApJ 312, 254, "The Baade-Wesselink method and the distances to RR Lyrae stars. II. The field star X Arietis" (ADS 1987ApJ...312..254J; text layer) | 1987ApJ...312..254J.pdf | https://articles.adsabs.harvard.edu/pdf/1987ApJ...312..254J |
| CL87 | Carney, B. W. & Latham, D. W. 1987, AJ 93, 116, "A survey of proper-motion stars. I. UBV photometry and radial velocities" (ADS 1987AJ.....93..116C; text layer) | 1987AJ.....93..116C.pdf | https://articles.adsabs.harvard.edu/pdf/1987AJ.....93..116C |
| C87 | Carney, B. W., Laird, J. B., Latham, D. W. & Kurucz, R. L. 1987, AJ 94, 1066, "A survey of proper-motion stars. II. Extracting metallicities from high-resolution, low-S/N spectra" (ADS 1987AJ.....94.1066C; text layer) | 1987AJ.....94.1066C.pdf | https://articles.adsabs.harvard.edu/pdf/1987AJ.....94.1066C |
| C86 | Carney, B. W. & Latham, D. W. 1986, AJ 92, 60, "The kinematics of halo red giants" (ADS 1986AJ.....92...60C; text layer) | 1986AJ.....92...60C.pdf | https://articles.adsabs.harvard.edu/pdf/1986AJ.....92...60C |
| Pr88 | Pryor, C. P., Latham, D. W. & Hazen, M. L. 1988, AJ 96, 123, "A search for spectroscopic binaries in the globular cluster M3" (ADS 1988AJ.....96..123P; text layer) | 1988AJ.....96..123P.pdf | https://articles.adsabs.harvard.edu/pdf/1988AJ.....96..123P |
| L88 | Latham, D. W. et al. 1988, AJ 96, 567, "A survey of proper-motion stars. VI. Orbits for 40 spectroscopic binaries" (ADS 1988AJ.....96..567L; text layer) | 1988AJ.....96..567L.pdf | https://articles.adsabs.harvard.edu/pdf/1988AJ.....96..567L |
| T97 | Torres, G. et al. 1997, AJ 114, 2764, "The absolute dimensions of eclipsing binaries. XXII. The unevolved F-type system HS Hydrae" (ADS 1997AJ....114.2764T; text layer) | 1997AJ....114.2764T.pdf | https://articles.adsabs.harvard.edu/pdf/1997AJ....114.2764T |
| M01 | Mazeh, T. et al. 2001, MNRAS 325, 343, "Studies of multiple stellar systems - IV. The triple-lined spectroscopic system Gliese 644" (ADS 2001MNRAS.325..343M; text layer) | 2001MNRAS.325..343M.pdf | https://articles.adsabs.harvard.edu/pdf/2001MNRAS.325..343M |
| T93 | Torres, G. et al. 1993, PASP 105, 360, "The semi-regular variable FS Comae - evidence for radial oscillations" (ADS 1993PASP..105..360T; text layer) | 1993PASP..105..360T.pdf | https://articles.adsabs.harvard.edu/pdf/1993PASP..105..360T |
| S92 | Storm, J. et al. 1992, PASP 104, 168, "Radial-velocity curves for RR Lyrae stars in the globular clusters M5 and M92 obtained using synthetic spectra" (ADS 1992PASP..104..168S; MMT speedometer; text layer) | 1992PASP..104..168S.pdf | https://articles.adsabs.harvard.edu/pdf/1992PASP..104..168S |
| S98 | Sartoretti, P. et al. 1998 (CfA speedometer observations by Stefanik, Latham and collaborators), A&A 334, 592, "A search for substellar companions around nine weak-lined T Tauri stars with the Planetary Camera" (ADS 1998A&A...334..592S; text layer) | 1998A&A...334..592S.pdf | https://articles.adsabs.harvard.edu/pdf/1998A&A...334..592S |
| C94 | Carney, B. W. et al. 1994, AJ 107, 2240, "A survey of proper motion stars. XII. An expanded sample" (ADS 1994AJ....107.2240C; text layer) | 1994AJ....107.2240C.pdf | https://articles.adsabs.harvard.edu/pdf/1994AJ....107.2240C |
| L82B | Latham, D. W. & Stefanik, R. P. 1982, BAAS 14, 612, "Digital stellar speedometry" (ADS 1982BAAS...14R.612L; one-page abstract; scan, OCRed) | 1982BAAS...14R.612L.pdf | https://articles.adsabs.harvard.edu/pdf/1982BAAS...14R.612L |

Also saved (read, not quoted): 1976ARA&A..14...23C (scan, no text; Chaffee 1976 ARA&A, a 440-character text layer only), 1983ApJ...267...12C, 1985ApJ...289..556L, 1985ApJ...292..362C, 1985ApJ...298..803C, 1986AJ.....92.1100M, 1987AJ.....94.1066C, 1988ApJ...326..312J, 1989ApJ...336..178P, 1989PASP..101..594C, 1991AJ....101..625L, 1992AJ....104..774L, 1992ApJ...386..646J, 1992ASPC...32..158L, 1993AJ....105.2260P, 1993MNRAS.263..775M, 1994A&A...287..338N, 1994AJ....108.1828M, 1996ApJ...466..415M, 1997AJ....114.1206L (these repeat the setup or hold no instrument text; see the sources above for the quoted ones). The Z-machine detector sources (T79, D82, ...) are in rawdata/presets/zmachine/.

Not reachable: Latham 1985 (1985srv..conf...21L; https://ui.adsabs.harvard.edu/abs/1985srv..conf...21L; ADS has no scan), Latham 1982 (1982ASSL...92..259L), Latham et al. 1989 Nature (https://ui.adsabs.harvard.edu/abs/1989Natur.339...38L), Wyatt 1985 (1985srv..conf..123W, the reduction system), Latham 1978 (private manual).

## Telescope and feed

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Telescope | Tillinghast 1.5 m reflector, Whipple Observatory, Mount Hopkins (also the 60-inch; one of three nearly identical speedometers: Wyeth 1.5 m at Oak Ridge, Tillinghast 1.5 m, MMT) |  | SOURCED | L92, p. 111, Sec. 2 | "nearly identical digital speedometers (Latham 1985) on three different telescopes: the 1.5-m Wyeth Reflector in Harvard, Massachusetts; and the 1.5-m Tillinghast Reflector and Multiple Mirror Telescope atop Mt. Hopkins, Arizona" |
| Aperture | 1.524 (FAST/Z-machine value; no speedometer paper states it) | m | SOURCED (elsewhere) | C74, p. 428 | "At the 60-inch (1.5-m) telescope, the scale at the slit is" |
| Plate scale at the slit (Cassegrain) | 12.6 arcsec/mm = 79.4 um/arcsec (stated for the echelle spectrograph on this telescope) | arcsec/mm | SOURCED | C74, p. 428, Sec. II.a | "At the 60-inch (1.5-m) telescope, the scale at the slit is" |
| Telescope beam at the slit | f/9.6 (stated for the telescope beam matching the collimator) | f/# | SOURCED | C74, p. 428, Sec. II.a | "The f/9.6 telescope" ... "beam strikes the collimator" |
| Focal ratio, arithmetic | DERIVED: 12.6 arcsec/mm -> 79.4 um/arcsec; F = 79.4e-6 m x 206264.8 / 1.524 m = 10.75; collimator speed 540 mm / 56.2 mm = 9.6. Three values (9.6, 10.75, FAST's 10.42) disagree by up to 12 percent: see Conflicts. The explorer keeps F = 10.42, consistent with the FAST and Z-machine presets. |  | DERIVED |  |  |
| Slit (Wyeth speedometer) | 1 x 6 arcsec ('normal slit', Oak Ridge) | arcsec | SOURCED | L88F, p. 274, Sec. 4 (transcribed from the scan) | "compared to the normal slit of 1 x 6 arc-seconds" |
| Slit (Tillinghast speedometer) | width not published; the width was changed to set the resolution (10, 12 and 8 km/s in 1979-80, 1982 and 1983) |  | SOURCED (qualitative) | P84, p. 241, Sec. III.a | "The slit width set the resolution at 10 km s" |
| Slit length (Tillinghast) | NOT FOUND |  | NOT FOUND |  |  |
| Fiber feed (Wyeth only, 1988) | 13 m of 100 um Polymicro fiber, f/13 to f/7 by a lens, 1.2 arcsec on the sky, spectrograph moved to a thermal enclosure on the dome floor; a prototype, not the standard speedometer |  | SOURCED | L88F, pp. 270-273 (transcribed from the scan) | "We have chosen a 13-m length of 100-ym Polymicro fiber" ... "A lens shortly before the final focus converts the F/13 beam of the telescope to F/7" |

## Spectrograph

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Heritage | the speedometer echelle is the Mount Hopkins Cassegrain echelle (Chaffee 1974) as upgraded by Latham (1978 Reference Manual, private distribution, not obtained) |  | SOURCED | CL82, p. 386, Sec. II | "Cassegrain echelle spectrograph (Latham 1978), which is an upgraded version of the Mount Hopkins ech-" |
| Heritage (cont.) | Mount Hopkins echelle designed by Schroeder, manufactured by Optics for Industry |  | SOURCED | C74, p. 428 | "The Mount Hopkins echelle was designed by Schroeder and manufactured by Optics for Industry in Milwaukee" |
| Collimator focal length | 540 (54 cm), beam 56.2 mm (so f/9.6) | mm | SOURCED | C74, Fig. 1 (p. 428; label read from the figure image, not in the text layer: "COLLIMATOR (f = 54 cm, 56.2 mm BEAM)") | "the collimated beam then falls on" |
| Collimator beam diameter | 56.2 | mm | SOURCED | C74, p. 428, Sec. II.a | "masked for the 56.2-mm beam required" |
| Echelle | 31.6 grooves/mm, 4 x 8 inch (102 x 203 mm), Bausch & Lomb; drawing labels it '30 g/mm' | g/mm | SOURCED | C74, p. 428, Sec. II.a | "31.6-groove-per-mm Bausch and Lomb echelle grating" |
| Echelle ruled length | 203 (8 inch) with the 4-inch width across; the beam masks it to 56.2 mm. gLen in the explorer: 203 mm | mm | SOURCED (size) | C74, p. 428, Sec. II.a (4 x 8 inch read from the text layer, OCR-like garble of the inch marks) | "31.6-groove-per-mm Bausch and Lomb echelle grating" |
| Echelle blaze (tan delta) | NOT FOUND for this grating; EFFECTIVE tan delta = 1.65 (delta = 58.8 deg) fitted to 2.1 A/mm at 5200 A (see Preset values) |  | NOT FOUND / EFFECTIVE |  |  |
| Camera | focal length 750 mm (f = 75 cm); the text calls it the 'camera mirror' and 'image forming mirror', so a mirror camera (type beyond that, e.g. Schmidt or not, not stated) | mm | SOURCED | C74, Fig. 1 (p. 428; label read from the figure image: "CAMERA (f = 75 cm)") | "the cross dispersion grating, camera mirror" |
| Camera type | mirror |  | SOURCED | C74, p. 428, Sec. II.a | "the cross dispersion grating, camera mirror, and focal plane lie in a plane below the paper" |
| Cross-disperser (1974 configuration) | first-order gratings 600 l/mm (4000 A blaze), 300 l/mm (5000 A blaze), 300 l/mm (9500 A blaze); in the speedometer one order is recorded: what isolates it is NOT FOUND (a narrow-band filter or a changed cross-disperser setup: INFERRED, not stated) |  | SOURCED (1974) | C74, p. 428, Sec. II.a | "three first-order gratings are currently available : a 600-line, 4000 A blaze; a 300-line, 5000 A blaze; and a 300-line, 9500 A blaze" |
| Order recorded | a single echelle order centered near 5187 A (also 5190, 5197 and 5200 in other papers), covering 45 A | A | SOURCED | L92, p. 111, Sec. 2 | "recording digital spectra for a single echelle order centered near 5187 A and covering a wavelength range of 45 A" |
| Order recorded (alt) | MMT/1.5 m systems: 'nearly 50 A centered either at 5187 A or at 5197 A' | A | SOURCED | Pr88, p. 124, Sec. II | "spectral coverage of nearly 50 A centered either at 5187" |
| Order recorded (alt 2) | about 45 A at 2.2 A/mm centered near the Mg b lines at 5190 | A | SOURCED | C86, Sec. 2c | "The Reticon records one echelle order, covering about 45 A at a dispersion of 2.2 A mm" |
| Order number | DERIVED/INFERRED: with the EFFECTIVE delta = 58.8 deg and d = 1/31.6 mm = 31.65 um, m = 2 d sin(delta)/lambda = 2 x 316456 A x 0.855 / 5187 A = 104; free spectral range 5187/104 = 49.9 A. This matches 'nearly 50 A' and is why the window is 45-50 A (INFERRED: the window is the free spectral range, not the detector; the array, 936 x 30 um = 28 mm x 2.07 A/mm = 58 A, is longer than the window) |  | DERIVED |  |  |
| Order-isolating filter | NOT FOUND |  | NOT FOUND |  |  |
| On-axis or off-axis collimator | OFF-AXIS in the drawing: the entrance slit sits below the echelle and the cross-disperser/collimator stack, outside the returning collimated beam; the incoming cone from the slit reaches the collimator at a few degrees to the returning beam (MEASURED from Fig. 1, p. 428: the slit-to-collimator ray rises about 65 px in 655 px = 5.7 deg on the 200 dpi scan; no scale, schematic). No text states it. Collimator type (mirror or lens): NOT STATED; the drawing shows a thin tilted plate beside the cross-disperser |  | INFERRED / MEASURED | C74, Fig. 1, p. 428 | "if the entrance slit, echelle grating, and collimator are in the plane of the paper" |
| Demagnification | '1.0' stated for the 1974 photographic configuration; the drawn collimator and camera (540 and 750 mm) give 0.72 (DERIVED: 540/750). Conflict, see Conflicts |  | SOURCED | C74, p. 428, Sec. II.a | "The demagnification of the spectrograph is 1.0" |
| Flexure and temperature | Cassegrain-mounted spectrograph: large temperature effects and mechanical flexure; sky and standard stars used for the zero point each night |  | SOURCED | L92, p. 112, Sec. 2 | "suffer from large temperature effects and mechanical flexure" |

## Detector

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Detector | photon-counting intensified Reticon (the Z-machine detector, Latham 1982; dual 936-diode array) |  | SOURCED | PL86, p. 645, Sec. II | "dual photon-counting Reticon array" |
| Detector (alt) | dual linear Reticon array of 936 pixels behind a high-gain image intensifier, single echelle order about 60 A |  | SOURCED | P83, p. 974, Sec. II | "a dual linear Reticon array of 936 pixels" |
| Pixel size on the sky of velocity | 1.8 km/s per pixel (0.0311 A at 5187 A); 3 counts per 1.8 km/s pixel in a 20-minute exposure of V = 15 | km/s | SOURCED | L92, p. 113 and p. 114 | "Despite the low average count level of 3 photons per pixel" |
| Pixel size (alt) | 10 km/s is about 6 pixels (1.7 km/s); 6.5 pixels at 10 km/s (1.5 km/s); 9 km/s over 6.5 pixels at the MMT |  | SOURCED | C87, p. 1067, Sec. II | "generally cAA /A = 10 km s- \ or about 6 pixels" |
| Pixels per window | DERIVED: 45.46 A / 0.0311 A per px = 1462 px; at 15 um per px (half of the 30 um diode, as in the Z-machine) 21.9 mm; 2.07 A/mm |  | DERIVED |  |  |
| Format | 936 x 2 diodes, half-diode photon positions (1872 x 2) by analogy with the Z-machine: INFERRED; the speedometer papers give no format |  | INFERRED |  |  |
| Spectral window (exact) | 5165.77-5211.23 A (DM Vir) | A | SOURCED | L96, p. 868, Sec. 3.1 (transcribed from the scan) | "the spectral range 5165.77-5211.23" |
| Photon counting DQE | peak detective quantum efficiency about 0.11; poor ultraviolet transmission of the fiber-optic face plate |  | SOURCED | LG86, p. 26 (transcribed from the scan) | "The measured peak detective quantum efficiency (DQE) of the photon-counting Reticons is only about 0.11" |
| Dark rate | about 5 counts per second per cm^2 of first cathode at -28 C |  | SOURCED | CL82, p. 388 | "about 5 cts sec" |

## Dispersion and resolution

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Reciprocal dispersion | 2.1 A/mm at 5200 A (both spectrographs, Tillinghast and Wyeth) | A/mm | SOURCED | P84, p. 241, Sec. III.a | "given the dispersion of 2.1 A mm" |
| Reciprocal dispersion (alt) | 2.1 A/mm (centered 5200 A, 50 A); 2.2 A/mm (5190 A); 'close to 2 A/mm'; 'approximately 2 A/mm' (45 A window) | A/mm | SOURCED | C84, Sec. II.a | "a dispersion of 2.1 A mm" |
| Reciprocal dispersion (alt 2) | 2.2 A/mm centered at 5190 A, 50 A of spectrum, Wyeth | A/mm | SOURCED | J87, Sec. II.b | "at a dispersion of 2.2 A mm" |
| Reciprocal dispersion (alt 3) | approximately 2 A/mm, window about 45 A, 5187 A (Tillinghast and Wyeth) | A/mm | SOURCED | T93, p. 360, Sec. 2.1 | "At a reciprocal dispersion of approximately 2 A mm" |
| Dispersion (1974 echelle) | 1.2 A/mm at 3300 A to 1.7 A/mm at 4300 A (cross-disperser setting of the photographic setup); scaled to 5200 A: 2.06 A/mm (DERIVED, dispersion proportional to wavelength at fixed angles) | A/mm | SOURCED | C74, p. 428, Sec. II.a | "the reciprocal dispersion ranges from 1.2 A mm" |
| Resolution (typical) | 10 km/s FWHM (R = 30,000), the nominal value for the proper-motion survey | km/s | SOURCED | C94, p. 2246, Sec. 2.2 | "instrumental resolution, nominally 10 kms" |
| Resolution (later) | 8.3 km/s resolution element (R = 36,100); 8.5 km/s in HS Hya | km/s | SOURCED | M01, p. 346 | "resolution of 8.3 km" |
| Resolution (HS Hya) | 8.5 km/s | km/s | SOURCED | T97, Sec. 2 | "element of 8.5 km" |
| Resolution, DM Vir | 8.3 km/s per element, S/N 15-25 | km/s | SOURCED | L96, p. 868 (transcribed from the scan) | "corresponding to signal-to-noise ratios of 15 to 25 per resolution" |
| Resolution (MMT) | 10 km/s, about 6.5 pixels (MMT speedometer) | km/s | SOURCED | S92, Sec. 2 | "The resolution of the system corresponds to a FWHM of 10 km" |
| Resolution is slit-set | slit width set the resolution at 10, 12 and 8 km/s (1979-80, 1982, 1983) | km/s | SOURCED | P84, p. 241 | "The slit width set the resolution at 10 km s" |
| Resolving power | DERIVED: R = 299792.5 / 8.3 = 36,100 (nominal, later era); 299792.5 / 10 = 30,000 (early). Stated as FWHM in km/s, not marked as measured from arc lines |  | DERIVED |  |  |
| Check of the slit-set resolution | DERIVED/INFERRED: a 1 arcsec slit (the Wyeth value) is 79 um at the slit, x 540/750 = 57 um at the detector, 3.8 px; combined in quadrature with the 30-40 um detector resolution (T79, Z-machine record): sqrt(57^2 + 35^2) = 67 um = 0.141 A = 8.1 km/s. This reproduces the 8.3 km/s quoted: independent of the fits, but the slit width for the Tillinghast is not published |  | DERIVED |  |  |

## Velocity precision and use

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| Typical precision, single exposure | about 0.7 km/s; better than 1 km/s | km/s | SOURCED | L88, p. 567 abstract / Sec. 2 | "A typical precision for a single velocity is about 0.7 km s" |
| Precision (survey) | rms better than 0.5 km/s for late-type stars; may double for very metal-poor stars; worse than 1 km/s for hot rapid rotators | km/s | SOURCED | L92, p. 113 (transcribed from the scan) | "we routinely achieve an rms precision of better than 0.5" |
| Best single exposure | about 125 m/s estimated error (R = 73) for the dusk-sky template: 'close to the limiting precision' of the standard configuration | m/s | SOURCED | L92, p. 111 | "This must be close to the limiting precision that can be achieved for a single exposure with the standard configuration" |
| Zero-point stability | sky velocities rms 150 to 250 m/s per run; run-to-run shifts a few hundred m/s; minor planets agree with the sky to better than 100 m/s | m/s | SOURCED | L92, pp. 112-114 (transcribed from the scan) | "the rms deviation of a single sky velocity from the mean for the run is usually in the range 150 to 250" |
| Typical counts | fewer than 20 counted photons per 1.8 km/s pixel for most spectra; 15 photons per pixel for solar-type survey stars |  | SOURCED | L92, p. 114 (transcribed from the scan) | "Most of our echelle spectra have fewer than 20 counted photons per 1.8" |
| Limiting magnitude | V = 13.5 in about 15 minutes for F and later types on the 60-inch; V = 16.0 on the MMT |  | SOURCED | L82B, abstract (transcribed from the scan) | "we routinely work to V = 13.5 in about 15 minutes" |
| Fiber-feed precision (Wyeth, 1988) | about 100 m/s per exposure of several minutes at V = 8 (against about 600 m/s direct at V = 11) | m/s | SOURCED | L88F, p. 274 (transcribed from the scan) | "approaching a precision of +100 m/s for a single exposure" |
| Radial velocity window | a 45 A window holds far fewer lines than the 1500 A of CORAVEL: blending matters in double-lined spectra |  | SOURCED | L96, p. 865 (transcribed from the scan) | "the 45-A spectral window of the Center for Astrophysics (CfA) Digital Speedometers" |
| HD 114762 discovery | IAU standard star observed with the Wyeth fiber feed on 28 March 1988; residual -390 m/s; 84.2 day period found in 63 prior velocities, semi-amplitude 530 +- 90 m/s |  | SOURCED | L88F, pp. 275-276 (transcribed from the scan) | "A search for periodicity in our 63 previous velocities produced a single, highly significant period of 84.2 days" |
| Scale of the survey | 30,750 radial-velocity exposures by 4 June 1997: 14,740 Wyeth, 12,089 Tillinghast, 3,921 MMT |  | SOURCED | L98, p. 179 (transcribed from the scan) | "14,740 with the 1.5-m Wyeth Reflector at the Oak Ridge Observatory" |
| Wavelength calibration and zero point | thorium comparison before and after each exposure; twilight sky each night |  | SOURCED | CL87, p. 119, Sec. IV | "A thorium comparison spectrum was taken before and after each stellar exposure" |

## Layout (the Mount Hopkins echelle; C74 Fig. 1, p. 428; the speedometer version is the same instrument with an order filter and the Reticon)

Figure: C74 Fig. 1, "Optical schematic of Mount Hopkins echelle spectrograph", PDF page 2 (journal p. 428), a side view with the entrance slit, echelle grating and collimator in the plane of the paper and the cross-disperser, camera mirror and focal plane in a plane below the paper (text, p. 428). Read on a 200 dpi page image; the figure has NO scale bar, so distances are MEASURED against the labeled focal lengths (collimator 540 mm, camera 750 mm).

| element | position and orientation in the figure | tag |
|---|---|---|
| entrance slit | lower middle of the drawing, below the echelle's box; the telescope beam arrives from the left | SOURCED (its position relative to the others read from the figure) |
| collimator (f = 54 cm, 56.2 mm beam) | at the right end, next to the cross-disperser; the slit sits about 420 px to its left (horizontal), which is 540 mm, giving a scale of 1.29 mm/px | SOURCED (f), MEASURED (placement) |
| echelle (30 g/mm label; 31.6 g/mm in the text) | a box at the left; the collimated beam returns from the collimator to it, about 440 px (570 mm, about one collimator focal length) | MEASURED |
| cross-disperser grating | a vertical bar beside the collimator at the right, in the plane below the paper | SOURCED (existence), MEASURED (placement) |
| camera (f = 75 cm) | at the upper left, its mirror near the echelle; its focal plane at the right end, about 588 px (760 mm) from the camera mirror: this agrees with 750 mm to 1 percent, a check on the 1.29 mm/px scale | SOURCED (f), MEASURED (check) |
| focal plane | at the right end of the drawing above the collimator | MEASURED |

No fold mirrors appear in the drawing. **Collimator on or off axis:** NOT STATED. The drawing places the slit outside the beam that returns from the collimator to the echelle (the slit is below the echelle box, and the incoming cone reaches the collimator at about 5.7 deg to the returning beam, from the 65 px rise over 655 px of the slit-to-collimator ray): the gate for `colTilt` reads OFF-AXIS, with colTilt about 5.7 deg (SCHEMATIC accuracy: a hand-read angle on a sketch). The drawing does not show whether the collimator is a mirror or a lens (thin tilted plate beside the cross-disperser); the text calls the camera and the focal-plane optic "mirrors" ("camera mirror", "image forming mirror") but never the collimator, so the user decides (the Z-machine was entered as a lens by his call). The Reticon replaced the photographic plate at the focal plane; the speedometer reference manual (Latham 1978) and Latham 1985 would settle all of this.

## Preset values for the explorer

| state | value | tag | how |
|---|---|---|---|
| mode, D | echelle, 1.524 m | SOURCED | C74 (60-inch (1.5-m)); FAST/Z-machine presets |
| F | 10.42 | INFERRED | FAST's 77 um/arcsec at the same Cassegrain focus; C74's 12.6 arcsec/mm gives 10.75 and its text 'f/9.6 telescope beam' 9.6: see Conflicts |
| slitW, nObj | 1.0 arcsec, 1 | INFERRED | the Wyeth slit is 1 x 6 arcsec (L88F); the Tillinghast width is not published; the quadrature check with the 30-40 um detector resolution reproduces 8.1 km/s, against 8.3 km/s quoted |
| col, W, fcam | mirror (undetermined; his call), 56.2 mm, 750 mm; cam mirror | SOURCED | C74 Fig. 1 and p. 428 |
| collimator focal length | 540 mm; W/f gives f/9.6 | SOURCED | C74 Fig. 1; DERIVED: 540/56.2 = 9.6 |
| eG | 31.6 /mm | SOURCED | C74 p. 428 |
| eDelta (blaze) | 58.8 deg (tan 1.65) | EFFECTIVE | fitted: dlambda/dx = lambda/(2 f tan delta) = 5187/(2 x 750 x 1.65) = 2.10 A/mm, the sourced 2.1 A/mm at 5200 A (P84); circular for the dispersion; the grating's own blaze is NOT FOUND (a typical R2 echelle, tan 2, would give 1.73 A/mm: 18 percent off) |
| order | about 104 at 5187 A (FSR 49.9 A) | DERIVED | m = 2 d sin(delta)/lambda; consistent with 'nearly 50 A' (Pr88); independent of the 45 A window, which is the sourced test |
| gamma, theta | 0 (out-of-plane angle not published) | SCHEMATIC | |
| xd (cross-disperser) | the 600 l/mm, 4000 A blaze grating is the one listed for a blue setting; for the 5187 A order the speedometer's own cross-disperser is NOT FOUND: enter as a plain grating or none, with `filt` isolating the order | NOT FOUND | C74 p. 428 lists the three gratings of 1974 |
| filt | 5165.8-5211.2 A | SOURCED | L96 Sec. 3.1 (DM Vir window); the window is 45.46 A |
| Nx, Ny, pix | 1872, 2, 15 um (0.0314 A/px at the fit, against 0.0311 A sourced) | INFERRED | the Z-machine's dual 936-diode Reticon with half-diode positions (P83, PL86, T79 in the zmachine record); 1.8 km/s per pixel (L92) matches 15 um at 2.07 A/mm; the window covers 1462 px, 78 percent of the array |
| gLen | 203 mm (8 inch) | SOURCED | C74 p. 428; the beam (56.2 mm) underfills it |
| layLen, camLen, colTilt | 540 mm, 750 mm, 5.7 deg | MEASURED / SCHEMATIC | from C74 Fig. 1 against the labeled focal lengths |
| lamC | 5187 A | SOURCED | L92 |

## Published performance (validation targets)

| quantity | value | kind | source |
|---|---|---|---|
| dispersion | 2.1 A/mm at 5200 A (0.0315 A/px at 15 um); 1.8 km/s per pixel = 0.0311 A | stated; the effective blaze is fitted to it (circular); the 1.8 km/s per pixel is an independent check of the 15 um pixel | P84; L92 |
| dispersion, independent | 1.2 A/mm at 3300 A to 1.7 A/mm at 4300 A (the 1974 setup); scaled to 5200 A: 2.06 A/mm | stated for the same echelle | C74 |
| resolution | 8.3 km/s FWHM (R = 36,100) later, 10 km/s (R = 30,000) early; slit-set (10, 12, 8 km/s in 1979-83) | stated, not marked as measured from arc lines; the quadrature check gives 8.1 km/s for a 1 arcsec slit | M01; C94; P84 |
| coverage | 45 A, 5165.77-5211.23 A (about 50 A in other papers) | stated; circular for `filt` | L96; L92; Pr88 |
| order separation / FSR | DERIVED 49.9 A from the EFFECTIVE blaze | not independent | |
| velocity precision | 0.5-0.7 km/s typical; 125 m/s best (R = 73); sky rms 150-250 m/s per run | MEASURED against standards, minor planets and the sky | L92; L88 |
| limiting magnitude | V = 13.5 in 15 min (1.5 m); V = 16 (MMT) | stated | L82B |
| DQE | about 0.11 peak | stated, MEASURED | LG86 |
| throughput fiber feed (Wyeth) | 30 percent laboratory, one tenth of direct on the telescope | stated | L88F |

## NOT FOUND

Latham 1985, Latham 1982, Latham 1978 and Latham et al. 1989 (see Completeness); the order-isolating filter; the echelle blaze angle, gamma and manufacturer's tan; the speedometer's cross-disperser (if any); the speedometer detector format and pixel size (by analogy with the Z-machine only); the Tillinghast slit width and slit length; the collimator type and its on- or off-axis status; a layout drawing of the speedometer itself (only the 1974 photographic layout exists); the focal ratio at the Tillinghast Cassegrain focus (three values, see Conflicts); the cooling and image-tube details of the intensified Reticon.

## Conflicts between sources

- Focal ratio / plate scale of the telescope: C74 says "The f/9.6 telescope [beam] strikes the collimator" (that is the collimator's own 540/56.2 = 9.6) and gives 12.6 arcsec/mm at the slit, i.e. 79.4 um/arcsec, F = 10.75 for D = 1.524 m; the FAST preset uses 77 um/arcsec (F = 10.42). The speedometer-era optics may differ (a transfer or field lens could have been added between the focus and the slit). The preset keeps F = 10.42 for consistency with FAST and the Z-machine.
- Demagnification: C74 states 1.0 but the drawn collimator and camera give 540/750 = 0.72. Using the focal lengths. If the demagnification were 1.0 the camera would be 540 mm and the dispersion would then need a tan delta of 2.29, so the effective blaze depends on which is right.
- Wavelength window and dispersion: 45 A (L92, T97, M01), "about 45 A" (CL87, T93), "about 50 A" (C84, J87, Pr88), 2.0, 2.1 and 2.2 A/mm, order centers 5187, 5190, 5197 and 5200 A, resolution 10, 9, 8.5, 8.3 km/s. These are different eras, runs and spectrographs (slit width and detector alignment changed between runs, P84), not contradictions in the setup.
- Echelle groove density: 31.6 g/mm in C74's text; the drawing in the same figure labels it "30 g mm-1". The text value is used.
- Number of Reticons in the system: the 1.5 m echelle with the Z-machine detector has two rows (P83); the speedometer papers say only "photon-counting intensified Reticon detector systems" (M01).

## Notes

- Not everything in the setup is the same across the three telescopes: Wyeth: f/13 beam, slit 1 x 6 arcsec, spectrograph also fiber-fed from 1988 (a prototype: 13 m of 100 um fiber, 1.2 arcsec); MMT: six f/31.6 telescope beams, image stacker (CL82) with six 2.5 x 2.5 arcsec square apertures behind a 2.5 x 15 arcsec preslit, so about 2.5 times the slit throughput; Tillinghast: the standard slit. All three are "nearly identical" echelle spectrographs (T97).
- The explorer's coverage cut at the 3200 A atmosphere cut is irrelevant here (5187 A).
- What the model cannot represent: the single-order isolation by a filter whose bandpass is unknown, the photon-counting detector (DQE 0.11, Reticon dark rate), the Reticon's half-diode centroiding (entered as 15 um pixels), the image tube's demagnification (folded into the pixel), the thermal and flexure velocity errors (large: Cassegrain mounting), and the cross-correlation analysis that gives 0.5 km/s from an 8.3 km/s FWHM.
- HD 114762: its discovery (Latham et al. 1989) was made with this system on all three telescopes; the first sign was a -390 m/s residual of the standard star on the fiber feed (L88F) and a period of 84.2 d in the earlier velocities. The Nature paper is not available, so the discovery's own velocity precision (a quote from it) is NOT FOUND; the 0.5-0.7 km/s of L92 and L88 stand for it.
