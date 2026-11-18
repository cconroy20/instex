# Round 10 (2026-11-18): the coudé spectrograph of the Palomar 200-inch Hale Telescope, photographic era (id `halecoude`)

Same rules as rounds 1-9 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/halecoude/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value chosen so that the explorer reproduces a published quantity; **INFERRED** marks a reading that is not stated; **SCHEMATIC** marks a layout element with no source. Quotes were machine-checked against `pdftotext -layout` and `-raw` text (letters and digits only, so hyphenation, dashes and ligatures do not matter): **42 quote pieces, 0 failures** (script: scratchpad r10/halecoude/quotes.py). Scanned sources without a text layer (O52, B61) were OCRed with tesseract and the quotes machine-matched against the OCR; they are marked "transcribed from the scan (p. N)". The ruled size of the gratings (5-1/2 x 7 in) was read from the scan image because the text layer garbles the fraction.

## Completeness summary

**Complete from Bowen 1952 (B52):** the f/30 coudé feed (500 ft), the 12-inch collimated beam, the off-axis mirror collimator of 30 ft focal length, the mosaic of four 10,000 /in gratings (5-1/2 x 7 in each, blazed third-order violet and second-order red), the 30 deg angle of incidence with all camera axes normal to the grating, and Table 2 for the five cameras (focal length, focal ratio, mirror diameter, usable plate length, dispersion in third and second order, limiting magnitude). The grating equation reproduces every Table 2 dispersion to 2-3 per cent (DERIVED below), which also confirms that the cameras sit at a diffraction angle of about 0 deg and the mosaic is used at 10,000 /in.

**Not found:** a slit width actually used (Bowen assumes only a slit image of A = 0.02 mm); the blaze angle; the mosaic's arrangement of the four gratings; any measured resolving power; any scaled plan of the coudé room (the only figure is a photograph without scale, Fig. 1); the collimator-to-grating and slit-to-collimator distances; the emulsion; the later grating changes (Oke 1980, behind the NSF report link); and the 1960s-70s detector history.

**Recommended preset:** "Hale 200-inch / coudé spectrograph (1950-1960s, photographic)": D = 5.08 m, f/30, off-axis f = 9144 mm collimator, 304.8 mm beam, 393.7 /mm reflection grating used at alpha = 30 deg in the third order (violet, 4300 A; the second-order red, 6350 A, is the same hardware), camera axis normal to the grating (psi = 30 deg), photographic plate with an effective 20 um pixel. **Era:** the photographic era (1950 to the 1960s). It is the classic coudé of its day, and the one Bowen's table describes; image tubes and electronic detectors changed the instrument later and are not sourced here (Oke 1980 is the pointer).

**Setting menu (short names, one preset per camera):** `144-inch` (2.3 A/mm), `72-inch` (4.6), `36-inch` (9), `18-inch` (18), `8.4-inch` (39 A/mm; the aplanatic-sphere camera). Each in third order, 4300 A. The second order is the same camera with m = 2 (3.4, 6.8, 14, 27, 59 A/mm).

## Sources

| key | document | local file (rawdata/presets/halecoude/) | URL |
|---|---|---|---|
| B52 | Bowen, I. S. 1952, ApJ 116, 1, "The Spectrographic Equipment of the 200-INCH Hale Telescope" (ADS 1952ApJ...116....1B, title checked on ADS; 9 pp., clean text layer; Fig. 1 a photograph on p. 7 (PDF), Fig. 2 sample spectra) | 1952ApJ...116....1B.pdf | https://articles.adsabs.harvard.edu/pdf/1952ApJ...116....1B |
| B57 | Bowen, I. S. 1957, PASP 69, 377, "Instrumentation at the Mount Wilson and Palomar Observatories" (ADS 1957PASP...69..377B; text layer) | 1957PASP...69..377B.pdf | https://articles.adsabs.harvard.edu/pdf/1957PASP...69..377B |
| B61 | Bowen, I. S. 1961, in Telescopes (Stars and Stellar Systems I), "The 200-inch Hale Telescope" (ADS 1961tele.book....1B; scan, OCR only; copy of the file in rawdata/telescopes/hale/) | 1961tele.book....1B.pdf | https://articles.adsabs.harvard.edu/pdf/1961tele.book....1B |
| O52 | Bowen, I. S. 1952, The Observatory 72, 129, "Some new tools of the astronomer" (Halley Lecture; ADS 1952Obs....72..129B; scan, OCR only) | 1952Obs....72..129B.pdf | https://articles.adsabs.harvard.edu/pdf/1952Obs....72..129B |

Not downloaded (no free scan or behind a bot check): Oke, J. B. 1980, "New Gratings For the Palomar 5-Meter Hale Telescope Coude Spectrograph" (1980nsf....7724738O; ADS gives a link page, not a scan); Bowen, I. S. 1962, "Spectrographs", Astronomical Techniques, ch. 2 (1962aste.book...34B; no scan); Bowen 1955, Vistas in Astronomy 1, 400 (1955VA......1..400B; no scan); Hearnshaw 2009, Astronomical Spectrographs and their History (a Cambridge UP book; a copy turned up on a university course site, which I did not download because it is not a legal open copy).  B61 (p. 13) says the optical details are listed in chapter 10 of Volume 2 of that series (not saved). Please supply Oke 1980, the Bowen 1962 chapter and Hearnshaw 2009 if you want the later history and a coudé-room drawing.

Bowen's Schmidt-camera theory chapter (1961tele.book...44B) was downloaded and deleted as not relevant.

## Hale coudé spectrograph parameters

### Telescope and feed

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Focus and focal ratio | coudé f/30, effective focal length 6000 in (500 ft) |  | O52, p. 132 (transcribed from the scan) | "effective focal length of the coudé arrangement is 500 feet corresponding to a focal ratio of 30" |
| Focal ratio (alt) | ALT: f/30 |  | B52, p. 4 | "Since the coudé optics of the 200-inch telescope operate at" |
| Plate scale at the coudé focus | 1.3534 arcsec/mm |  | DERIVED/INFERRED/NOT FOUND | DERIVED: 206265 / (6000 in x 25.4 mm/in) = 1.3534 arcsec/mm (the explorer's Hale telescope record, data/telescopes/hale.md, gives 1.35344) |
| Aperture | D = 5.08 m (200 in) |  | DERIVED/INFERRED/NOT FOUND | The explorer's Hale telescope record (data/telescopes/hale.md); the coudé secondaries and flats add obstruction not modeled here. |
| Reflections to the slit | at least 5 aluminum reflections (telescope plus coudé train), 4 glass-air surfaces, 1 diffraction |  | B57, p. 381 | "Before reaching the plate the light undergoes a minimum of five reflections at aluminum surfaces plus one diffraction at the grating and passes a minimum of four glass-air surfaces." |
| Slit width actually used | NOT FOUND |  | DERIVED/INFERRED/NOT FOUND | Bowen assumes a slit-image width A = 0.02 mm at the plate; no slit width in arcsec or mm is published in the sources saved. |
| Slit-image width at the plate (design) | A = 0.02 mm | mm | B52, p. 3 | "If we also assume A = 0.02 mm and r = cos 30" |
| Meaning of A | slit image set about equal to the plate's resolution limit |  | B52, p. 1 | "Width of slit image permissible at the plate, usually set about equal to limit of resolution of plate." |
| Spectrum width (widening) | W = 0.1 mm assumed for faint stars | mm | B52, p. 3 | "it is usually necessary to accept a value of W of 0.1 mm or even less" |
| Seeing assumed in the speed estimates | beta = 6e-6 rad (about 1.2 arcsec; the text garbles the exponent in the scan text layer, the arcsec value is DERIVED) | rad | B52, p. 3 | "good average seeing at these observatories" |

### Collimator and beam

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Collimator type, focal length, axis | off-axis mirror, f = 30 ft = 360 in = 9144 mm |  | B52, p. 5 | "a focal length of ... 30 feet is required for the off-axis mirror collimator" |
| Beam diameter | d = 12 in = 304.8 mm |  | B52, Abstract, p. 1 | "a spectrograph has been constructed having a 12-inch aperture collimator beam" |
| Beam diameter (alt) | ALT: 12 in |  | B57, p. 379 | "An aperture of 12 inches was adopted for the collimator beam of the large coudé" |
| Collimator focal ratio | f/30 (= 360 in / 12 in), matching the telescope: the slit is filled by the f/30 beam |  | DERIVED/INFERRED/NOT FOUND | DERIVED: 360 / 12 = 30 |
| Why the beam is 12 in | gratings of the 100-inch coudé limit the beam to 6 in; the 200-inch needs d proportional to D for speed |  | B52, p. 4 | "these gratings limit the maximum beam size to 6 inches" |

### Grating mosaic

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Disperser | composite of four matched plane reflection gratings (a mosaic) |  | B52, Abstract, p. 1 | "As dispersing element, a composite of four matched gratings is used" |
| Groove density | 10,000 lines per inch = 393.7 /mm |  | B52, p. 4 | "ruled on the Mount Wilson ruling engine with 10,000 lines per inch" |
| Blaze | third-order violet and second-order red (blaze angle not given); 60-70 per cent of the light in the blazed order |  | B52, p. 4 | "were blazed in the third-order violet and second-order red, 60-70 per cent of the incident light going into the one blazed order" |
| Ruled size of each grating | 5.5 x 7 in (139.7 x 177.8 mm) |  | B52, p. 4 (5-1/2 read from the scan image) | "each having a ruled surface of" |
| Mosaic arrangement | NOT FOUND (2 x 2 implied); INFERRED: 14 in along the dispersion |  | DERIVED/INFERRED/NOT FOUND | INFERRED: the beam footprint on the grating is 12/cos 30 = 13.86 in along the dispersion (B52 p. 5 gives 13.8 in); two 7 in gratings side by side cover 14 in. The alternative (2 x 5.5 = 11 in along the dispersion) would cap R below the footprint; the sources do not say. |
| Resolving power of the gratings | far above the plate's |  | B52, p. 4 | "The resolving power of each individual grating is therefore considerably greater than that of the photographic plate." |
| Phasing | lines of the four gratings need not be in phase: the spectra only have to coincide within the plate's resolution |  | B52, p. 4 | "it is not necessary to mount the gratings so that the ruled lines of the four gratings are in phase with one another" |
| Angle of incidence | alpha = 30 deg; camera axes normal to the grating |  | B52, p. 5 | "mounted to have their axes normal to the grating, while the collimator beam has an angle of incidence on the grating of 30" |
| Anamorphic factor r | r = cos 30 deg (diffraction near normal) |  | B52, p. 3 | "If we also assume A = 0.02 mm and r = cos 30" |
| Gratings of other beams (not used for the coudé) | 3-in prime-focus spectrograph: 7500 and 15,000 lines/in, second-order violet blaze |  | B52, p. 7 | "gratings of 7500 and 15,000 lines per inch with the blaze in the second-order violet are used" |

### Cameras

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Camera set | five cameras, focal lengths 144, 72, 36, 18 and 8.4 in |  | B52, Abstract, p. 1 | "a series of five cameras with focal lengths ranging from 144 to 8.4 inches and yielding dispersions of 2.3 to 40 A/mm" |
| Table 2: focal length (in) | 144 / 72 / 36 / 18 / 8.4 | in | B52, Table 2, p. 6 | "144 72 36 18 8.4" |
| Table 2: focal ratio | 12 / 6 / 3 / 1.5 / 0.7 |  | B52, Table 2, p. 6 | "12 6 3 1.5 0.7" |
| Table 2: mirror diameter (in) | 48 / 36 / 30 / 20 / 20 | in | B52, Table 2, p. 6 | "48 36 30 20 20" |
| Table 2: usable plate length (in) | 22 / 16 / 12 / 6 / 0.68 | in | B52, Table 2, p. 6 | "22 16 12 6 0.68" |
| Table 2: dispersion, 3rd order (violet) | 2.3 / 4.6 / 9 / 18 / 39 | A/mm | B52, Table 2, p. 6 | "2.3 4.6 9 18 39" |
| Table 2: dispersion, 2nd order (red) | 3.4 / 6.8 / 14 / 27 / 59 | A/mm | B52, Table 2, p. 6 | "3.4 6.8 14 27 59" |
| Camera type, 144 in | spherical mirror, center of curvature at the grating; f/12, no corrector |  | B52, p. 5 | "This makes use of the Schmidt principle by having a mirror placed with its center of curvature at the grating." |
| Camera type, 72, 36 and 18 in | Schmidt cameras; corrector plate of slightly less than half strength within a few mm of the grating, light passing it twice |  | B52, p. 5 | "a corrector plate of slightly less than half-strength is placed parallel to, and within a very few millimeters of, the grating" |
| Camera type, 8.4 in | the 18-in Schmidt plus an aplanatic fused-quartz sphere (radius 2.5 in) against which the plate sits; focal length 18/n^2 |  | B52, p. 6 | "with a sphere of optical quality fused quartz having a radius of 2.5 inches" |
| Flat field of the 8.4-in camera | 17 mm diameter: 670 A (3rd order blue) or 1000 A (2nd order red) per exposure |  | B52, p. 6 | "a well-corrected flat field 17 mm in diameter was attained, thereby providing a range for one exposure of 670 A in the third-order blue spectrum or 1000 A in the second-order red spectrum" |
| Plate position and format | plateholders on the camera axis, between grating and mirror; plates 1 in wide |  | B52, p. 5 | "They are therefore designed to take rather narrow plates 1 inch in width." |
| Plate position (on axis) | on axis (an on-axis plateholder obstructs the returning beam) |  | B52, p. 5 | "all plateholders are mounted on axis" |
| Camera mirror distance from the grating | 2 f = 288 in (7315 mm) for the 144-in camera (the mirror radius R = 2 f; plate at f) |  | DERIVED/INFERRED/NOT FOUND | DERIVED from 'center of curvature at the grating' (B52 p. 5) and f = R/2 for a spherical mirror; the sources do not state the distance |
| Total throughput | less than 20 per cent in the best case; 5 to 10 per cent in practice |  | B57, p. 381 | "the efficiency is less than 20 percent" |

### Detector (photographic plate)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Plate | photographic plate (emulsion not named in the saved sources), 1 in wide, 22 / 16 / 12 / 6 / 0.68 in usable length |  | B52, Table 2, p. 6 | "22 16 12 6 0.68" |
| Effective pixel | 20 um (EFFECTIVE: the plate's resolution limit, A) | um | B52, p. 1 and p. 3 | "usually set about equal to limit of resolution of plate" |
| Era of the preset | photographic, installed July 1950 (Palomar coudé); image tubes and detectors came later (not sourced) |  | O52, p. 139 (transcribed from the scan) | "installation of the large coudé spectrograph in July 1950" |
| Later gratings | NOT FOUND in a saved source: Oke 1980, 'New Gratings For the Palomar 5-Meter Hale Telescope Coude Spectrograph' (1980nsf....7724738O): no free scan |  | DERIVED/INFERRED/NOT FOUND |  |

### Published performance (validation targets)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Dispersion range | 2.3-40 A/mm (abstract); 2.3-38 A/mm (B57, B61): Table 2's 39 A/mm is the 8.4-in camera, 3rd order |  | B57, p. 379 | "These yield dispersions of 2.3 to 38 A/mm." |
| Dispersion (alt) | ALT: 2.3-38 A/mm |  | B61, p. 13 (transcribed from the scan) | "The spectrograph for higher dispersions (2.3-38 A/mm) is located at the coudé focus" |
| Limiting photographic magnitude (one night) | 7.5 / 9.8 / 11.9-12.0 / 13.4-14.3 / 15.0-16.6 (widened to 0.1 mm / unwidened) | mag | B52, Table 2, p. 6 | "Widened to 0.1 mm 7.5 9.8 11.9 13.4 15.0" |
| Highest dispersion vs Rowland | 2.3 A/mm is about half Rowland's (solar spectrum) |  | O52, p. 136 (transcribed from the scan) | "The highest dispersion of 2-3 A per mm is about half that used by Rowland" |
| Measured resolving power | NOT FOUND (Bowen quotes only the plate limit) |  | DERIVED/INFERRED/NOT FOUND |  |

### DERIVED: the grating equation against Table 2

Groove spacing d = 25.4 mm / 10,000 = 2.54 um (DERIVED). With the collimator beam at alpha = 30 deg and the camera axis normal to the grating (beta about 0), m lambda = d (sin alpha + sin beta) = 1.27 um: **m = 3 gives 4233 A, m = 2 gives 6350 A**, the "third-order violet and second-order red" of B52 p. 4 (INFERRED to be the same geometry). The linear dispersion K = d cos beta / (m f): for the 144-in camera 25,400 A / (3 x 3657.6 mm) = 2.31 A/mm (Table 2: 2.3); for the others see the table. The model's chosen center, 4300 A in the third order, needs beta = 0.45 deg (alpha = 30 deg), r = cos 30 / cos beta = 0.866 (B52 assumes cos 30 deg for r on p. 3).

| Setting | f (in / mm) | published K, 3rd (2nd) order, A/mm | grating-equation K, 3rd (2nd) | plate (in) | DERIVED slit for a 20 um slit image (mm / arcsec) | DERIVED R at 4300 A, 3rd order | Nx x Ny at 20 um |
|---|---|---|---|---|---|---|---|
| 144-inch | 144 / 3657.6 | 2.3 (3.4) | 2.31 (3.47) | 22 | 0.058 / 0.078 | 92,883 | 27940 x 1270 |
| 72-inch | 72 / 1828.8 | 4.6 (6.8) | 4.63 (6.94) | 16 | 0.115 / 0.156 | 46,441 | 20320 x 1270 |
| 36-inch | 36 / 914.4 | 9 (14) | 9.26 (13.89) | 12 | 0.231 / 0.313 | 23,221 | 15240 x 1270 |
| 18-inch | 18 / 457.2 | 18 (27) | 18.52 (27.78) | 6 | 0.462 / 0.625 | 11,610 | 7620 x 1270 |
| 8.4-inch | 8.4 / 213.4 | 39 (59) | 39.68 (59.52) | 0.68 | 0.990 / 1.340 | 5,418 | 864 x 864 |

Published Table 2 values (B52, p. 6): 3rd order 2.3 / 4.6 / 9 / 18 / 39, 2nd order 3.4 / 6.8 / 14 / 27 / 59 A/mm. The derived values agree to 1-3 per cent (the 8.4-in camera's effective focal length is taken as 8.4 in; B52 gives 18/n^2 = 8.4). The 36-in and 18-in table values are rounded to integers.

### EFFECTIVE slit and pixel (the choices the explorer needs)

- **Slit.** No slit width is published. B52 uses a slit image of A = 0.02 mm (p. 3, "usually set about equal to the limit of resolution of the plate"). The explorer's slit width follows from it: slit (mm at the f/30 focus) = A f_col / (f_cam r), with f_col = 9144 mm, r = 0.866, and the sky size = slit x 1.3534 arcsec/mm: **0.078, 0.156, 0.313, 0.625, 1.34 arcsec** for the 144, 72, 36, 18, 8.4-in cameras (EFFECTIVE, circular with the resolution limit). The narrow values are not what observers used on the faintest stars (B52 case I narrows the slit only in the cases where the seeing image is larger than the plate resolution); a seeing-matched slit of 1 arcsec would widen the images by 13x on the 144-in camera, so the explorer's R would fall to about 7,000. Say so in the preset note and consider the 1.0 arcsec slit as a variant.
- **Pixel.** 20 um, the plate's resolution limit (A = 0.02 mm, B52 p. 3). The effective Nx = usable plate length / 0.02 mm: 27,940 (144-in), 20,320, 15,240, 7,620, 864 (8.4-in, a 17 mm field); Ny = 1270 (1-in plates; 864 for the 17 mm field). **The explorer's Nx slider ends at 16,000 (log range 2.709-4.204): the 144-in and 72-in plates exceed it.** Options: raise the slider's maximum, or use 40 um pixels (twice the limit; 13,970 and 10,160 px) for these two settings. The plate limit and 20 um grain scale come from the same sentence in B52; Slipher's preset uses the same convention.

## Published performance (validation targets)

| quantity | value | kind | source |
|---|---|---|---|
| dispersion, 144-in camera, 3rd order | 2.3 A/mm | published (design) | B52 Table 2, p. 6 |
| dispersions of the other cameras, 3rd order | 4.6, 9, 18, 39 A/mm | published (design) | B52 Table 2 |
| dispersions, 2nd order | 3.4, 6.8, 14, 27, 59 A/mm | published (design) | B52 Table 2 |
| range of dispersion | 2.3-40 (B52 abstract), 2.3-38 A/mm (B57 p. 379, B61 p. 13) | published | see Conflicts |
| coverage per plate, 8.4-in camera | 670 A (3rd order blue), 1000 A (2nd order red) | published | B52 p. 6 |
| coverage, 144-in camera (DERIVED) | 22 in x 2.3 A/mm = 1290 A (3rd order) | derived | Table 2 |
| spectral resolution at the plate | 0.02 mm (about 0.046 A at 2.3 A/mm; R about 93,000 at 4300 A, DERIVED) | derived from A, not measured | B52 p. 3 |
| limiting magnitude, one night | 7.5 / 9.8 / 11.9 / 13.4 / 15.0 (widened to 0.1 mm) | calculated, "confirmed by observations to date" | B52 Table 2 |
| plate scale along the slit | 1.3534 arcsec/mm at the focus | derived | f = 6000 in |
| collimator-to-camera angle | 30 deg | sourced | B52 p. 5 |

## NOT FOUND

- Slit width and length actually used; a measured resolving power for any camera; the blaze angle (Bowen gives orders only); the arrangement of the four gratings in the mosaic (2 x 2 inferred); the emulsion and plate type; distances (slit to collimator, collimator to grating, grating to each mirror: the last follows from R = 2f); a scaled drawing of the coudé room and the optical train (the coudé flat or flats, the slit room and the spectrograph); the 1960s-70s history (image tubes, Oke's new gratings of 1980, the end of service); the flat's height.

## Conflicts between sources

- **Highest dispersion:** 2.3 to **40** A/mm (B52 abstract) vs 2.3 to **38** A/mm (B57 p. 379; B61 p. 13) vs **39** A/mm for the 8.4-in camera in B52 Table 2 and **40** A/mm in O52 (p. 136). Keep Table 2 (39) as the setting's value.
- **Ruled size:** B52 p. 4 gives 5-1/2 x 7 in; O52 (OCR) reads "54 by 7 inches" (OCR loses the fraction). Taken as 5-1/2 x 7.
- **Coudé focal ratio:** all sources f/30; O52 says "500 feet" (6000 in) for the focal length.
- **Slit images:** none.

## Layout evidence (published figures)

The only published picture is B52 Fig. 1 (PDF p. 7): a photograph, rotated 90 deg on the page and without a scale, of the "short-focus camera of the coudé spectrograph. A, grating mount; B, corrector plate. Mirrors: C, 18-inch, D, 36-inch. Plateholder mounts: E, 18-inch; F, 36-inch; G, 72-inch; H, aplanatic sphere." It shows the grating mount with the corrector plate in front of it, the 18-in and 36-in camera mirrors beside it and the plateholders on their own mounts; the 72-in and 144-in cameras are "moved out of the way". Fig. 2 is sample spectra. No plan, distances or angles can be MEASURED from it, so all distances are DERIVED or SCHEMATIC.

| element | tag | basis |
|---|---|---|
| f/30 beam from the coudé flat(s) to the slit | SOURCED (f/30) | B52 p. 4; O52 p. 132 |
| slit at the f/30 focus | SCHEMATIC | the slit position is not described; B52 gives only the f/30 focus |
| off-axis mirror collimator, f = 30 ft, 12-in beam | SOURCED | B52 p. 5 |
| grating mosaic at alpha = 30 deg to the collimator beam | SOURCED | B52 p. 5 |
| camera axes normal to the grating, so camera-collimator angle psi = 30 deg | SOURCED / DERIVED | B52 p. 5 |
| corrector plate within a few mm of the grating, parallel to it (light through it twice) | SOURCED | B52 p. 5 |
| camera mirror at 2 f from the grating (center of curvature at the grating); plate on axis at f | DERIVED | B52 p. 5 |
| collimator-to-grating distance | SCHEMATIC | not published (the grating stands in a collimated beam) |

**Collimator on- or off-axis verdict: OFF-AXIS.** Quote: "a focal length of ... 30 feet is required for the off-axis mirror collimator" (B52 p. 5). The returning beam passes beside the slit; colTilt is not published (set it by the explorer's automatic off-axis tilt, SCHEMATIC).

## Recommended explorer state (per setting; for web/presets.js)

```
tel: "Hale 200-inch" (tpreset id hale; coudé f/30), D: 5.08, F: 30
g: { slitW: <EFFECTIVE slit above>, nObj: 1, col: "mirror", cam: "mirror",
     W: 304.8 (f_col = F x W = 9144 mm), fcam: 3657.6 | 1828.8 | 914.4 | 457.2 | 213.36,
     gType: "refl", G: 393.7, m: 3, lamB1: 13148 (INFERRED, blaze 15 deg: Littrow 2 d sin 15 / 1),
     lamC: 4300, psi: 30, layLen: SCHEMATIC (e.g. 2 x f_col is not required: use 2000-4000 mm),
     camLen: 2 x fcam (mirror at the center of curvature, DERIVED),
     Nx: 27940 | 20320 | 15240 | 7620 | 864, Ny: 1270 (864 for 8.4-inch), pix: 20 (um),
     gLen: 355.6 (INFERRED, 14 in; the beam footprint is 350.5 mm, so it does not cap R) }
```
The blaze wavelength lamB1 is EFFECTIVE: Bowen gives only the orders, and 13,148 A (first-order equivalent of a 15 deg blaze, 4383 A in the third order and 6574 A in the second) is the Littrow blaze that matches "third-order violet, second-order red"; the explorer's efficiency curve is therefore not a published quantity.

Suggested pub entries (all from Table 2, B52 p. 6): dlpixAt in third order at 4300 A for each camera: 0.02 mm x 2.3 / 4.6 / 9 / 18 / 39 A/mm = 0.046 / 0.092 / 0.18 / 0.36 / 0.78 A per 20 um pixel (tol 0.04, since the table's integers carry 1-3 per cent); the same in second order at 6350 A (0.068 / 0.136 / 0.28 / 0.54 / 1.18 A/px); span for the 8.4-in camera 670 A (third-order blue) and 1000 A (second-order red) on a 17 mm field. Mark R and the slit as info (circular).

## What the explorer cannot represent

- The four-grating mosaic (matched, not phased) as a single grating; its footprint (14 x 11 in) is not the beam's circle.
- The Schmidt corrector double-passed within millimeters of the grating (a half-strength plate used before and after the grating), the aplanatic quartz sphere of the 8.4-in camera, and the 144-in camera as a bare spherical mirror: all drawn as a generic mirror camera.
- On-axis plateholders in the returning beam (obscuration), the 1-in plate width and the narrow 17 mm field of the 8.4-in camera.
- Plate characteristics (grain, contrast, reciprocity), spectrum widening to 0.1 mm, the coudé flats and the image rotation of the coudé focus, the image slicer and the thermal housing.

## Notes

- Why a mosaic: the speed of a spectrograph in case I (Bowen's formula 1) grows as d^2 and the largest single gratings that could be ruled then limited the beam to 6 in; four 5-1/2 x 7 in gratings let d = 12 in (B52 p. 4).
- The plates were narrow (1 in) because "all plateholders are mounted on axis" (B52 p. 5).
- The 3-inch prime-focus spectrograph of the same paper (1.4 and 2.8 in cameras, 85-750 A/mm) is a separate instrument and not part of this record.
