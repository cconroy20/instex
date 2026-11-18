# Round 10 (2026-11-18): the coudé spectrograph of the Mount Wilson 100-inch Hooker Telescope, 1935-1950s (id `mwcoude`)

Same rules as rounds 1-9 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/mwcoude/`; each value carries the source key, location and a short verbatim quote; **DERIVED**, **EFFECTIVE**, **INFERRED**, **SCHEMATIC** as in the halecoude record. Quotes were machine-checked against `pdftotext -layout` and `-raw` text (letters and digits only): **38 quote pieces, 0 failures**. The Dunham 1946 note (D46) is a scan without a text layer; it was OCRed and its quotes machine-matched against the OCR, and are marked "transcribed from the scan (p. 49)". The fractions of the grating's ruled area (4-3/8 x 5-1/2 in) were read from the scan image of Adams p. 13 because the text layer garbles them.

## Completeness summary

**Sourced:** the f/30 coudé focus (250 ft); the off-axis concave collimating mirror ("corrected to operate off its axis"; 15 ft, 6 in beam per Griffin 1964 and the original 1920s design); the Wood aluminum-on-Pyrex plane grating, 14,400 /in, ruled area 4-3/8 x 5-1/2 in, first-order red and second-order violet; the 32-in off-axis Schmidt, the 73-in Schmidt, the 108-in lens and the 114-in spherical-mirror camera, with second-order dispersions 10.4, 4.5, 3.1, 2.9 A/mm (Adams 1941 p. 13); a 20 um slit (Dunham 1946); the layout in prose (Adams p. 12); and the CH and CN identifications.

**Not found:** a measured R, the angle of incidence for the 14,400 /in grating, the 32-in and 73-in plate lengths, a scaled layout (Adams's paper has plates of spectra, no layout figure), the 1920s-1930s telescope plate scale from a primary description (taken from the 250 ft statements of Dunham 1939 and Babcock 1948), the 108-in lens's maker and aperture, the blaze angle and the slit actually used.

**Recommended preset:** "Mt Wilson 100-inch / coudé (1935-1950s, photographic)": D = 2.54 m, f/30, off-axis f = 4572 mm collimator, 152.4 mm beam, 566.9 /mm Wood grating in second order, the 32-, 73- and 114-inch cameras as Settings (`32-inch`, `73-inch`, `114-inch`), photographic plate with a 20 um effective pixel. **Era:** after the 1935 reconstruction and the 114-in mirror camera (about 1939); the CH and CN discoveries (Adams 1941) used the 32-in and later cameras. The earlier 9-ft and 15-ft instruments are not recommended.

## Sources

| key | document | local file (rawdata/presets/mwcoude/) | URL |
|---|---|---|---|
| A41 | Adams, W. S. 1941, ApJ 93, 11, "Some Results with the Coudé Spectrograph of the Mount Wilson Observatory" (ADS 1941ApJ....93...11A, title checked; 17 pp., text layer) | 1941ApJ....93...11A.pdf | https://articles.adsabs.harvard.edu/pdf/1941ApJ....93...11A |
| D46 | Dunham, T. 1946, PAAS 10, 49 (a 1940 meeting abstract), "The use of a spherical mirror camera in the coudé spectrograph of the 100-inch telescope" (ADS 1946PAAS...10...49D; scan, OCR only) | 1946PAAS...10...49D.pdf | https://articles.adsabs.harvard.edu/pdf/1946PAAS...10...49D |
| D36 | Dunham, T. 1936, PAAS 8, 110, "Schmidt spectrograph cameras" (scan; not quoted: the 4-73 in cameras under construction, a 5-in f/1.8) | 1936PAAS....8..110D.pdf | https://articles.adsabs.harvard.edu/pdf/1936PAAS....8..110D |
| D37 | Dunham, T. 1937, PASP 49, 26, "Interstellar Neutral Potassium and Neutral Calcium" (text layer) | 1937PASP...49...26D.pdf | https://articles.adsabs.harvard.edu/pdf/1937PASP...49...26D |
| D39 | Dunham, T. 1939, PASP 51, 253, "Knowledge of the Planets in 1938" (text layer; the coudé's 250 ft) | 1939PASP...51..253D.pdf | https://articles.adsabs.harvard.edu/pdf/1939PASP...51..253D |
| BA48 | Babcock, H. W. 1948, ApJ 107, 73, "A Photoelectric Guider for Astronomical Telescopes" (text layer) | 1948ApJ...107...73B.pdf | https://articles.adsabs.harvard.edu/pdf/1948ApJ...107...73B |
| G64 | Griffin, R. 1964, ApJ 139, 1387, "Resolving Power of the 100-inch Coudé Spectrograph in the Infrared" (one page only in the ADS scan; text layer) | 1964ApJ...139.1387G.pdf | https://articles.adsabs.harvard.edu/pdf/1964ApJ...139.1387G |
| B57 | Bowen 1957, PASP 69, 377 (copy in rawdata/presets/halecoude/; the 1950s Mount Wilson revisions) | ../halecoude/1957PASP...69..377B.pdf | https://articles.adsabs.harvard.edu/pdf/1957PASP...69..377B |

Not found for the 100-inch coudé: a primary description of the 1935 reconstruction beyond Adams 1941; Dunham 1968 PASA 1, 115 (a different paper, "Telescope mountings", not relevant). Hearnshaw 2009 not saved.

## Mount Wilson coudé parameters

### Telescope and feed

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Focus and focal length | coudé, effective focal length 250 ft (3000 in), i.e. f/30 on the 100-in |  | D39, p. 259 | "where the effective focal length is 250 feet" |
| Focal length (alt) | ALT: 250 ft |  | BA48, p. 73 | "The long equivalent focal length (250 feet) of the coudé optical system" |
| Plate scale at the coudé focus | 2.7066 arcsec/mm |  | DERIVED/INFERRED/NOT FOUND | DERIVED: 206265 / (3000 in x 25.4 mm/in) = 2.7066 arcsec/mm; f/30 = 3000 in / 100 in |
| Slit width | 20 um (projected on the plate with the 114-in camera) | um | D46, p. 49 (transcribed from the scan) | "clearly separated using a slit 20" |
| Slit | comparison-spectrum and step-slit projector; Bowen image slicer interchangeable by dowel pins |  | A41, p. 12 | "a slit equipped with Bowen" |

### Collimator and beam

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Collimator type and axis | concave collimating mirror corrected to operate off its axis (OFF-AXIS) |  | A41, p. 12 | "The light passing through the slit falls upon a concave collimating mirror corrected to operate off its axis" |
| Collimator return path | the beam is thrown 'backward and slightly upward in the general direction of the slit' to the grating placed just above the optical axis (the slit is not in the returning beam) |  | A41, p. 12 | "This mirror throws the parallel beam of light backward and slightly upward in the general direction of the slit to the plane grating placed just above the optical axis" |
| Collimator focal length and beam | 15 ft (180 in = 4572 mm), 6-in (152.4 mm) aperture, in the 1960s; the original 1920s prismatic autocollimator had the same 6 in and 15 ft |  | G64, p. 1387 | "The aperture of the spectrograph collimator is 6 inches" |
| Collimator focal length (alt) | ALT: 15 ft |  | G64, p. 1387 | "its focal length being 15 feet and not 12 feet" |
| Original design | autocollimating prismatic spectrograph, 6-in aperture, 15-ft focal length |  | A41, p. 11 | "Originally designed as an autocollimating prismatic spectrograph with an aperture of 6 inches and a focal length of 15 feet" |
| Collimator focal ratio | f/30 (180 in / 6 in), matching the telescope |  | DERIVED/INFERRED/NOT FOUND | DERIVED: 180 / 6 = 30. INFERRED that the 1935 off-axis mirror kept the 15 ft and 6 in: A41 does not give them; G64 does (1964) |

### Grating

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Disperser | Wood aluminum-on-Pyrex plane reflection grating, 14,400 lines/in = 566.9 /mm |  | A41, p. 13 | "a Wood aluminium on pyrex-glass grating with a ruled area of" |
| Groove density | 14,400 lines to the inch |  | A41, p. 13 | "14,400 lines to the inch" |
| Ruled area | 4-3/8 x 5-1/2 in (111 x 140 mm); read from the scan, the text layer garbles the fractions |  | A41, p. 13 (fractions read from the scan image) | "with a ruled area of" |
| Blaze | strong concentration in the red-infrared of the first order and the violet-blue of the second order; good definition in first, second and third orders |  | A41, p. 13 | "It has excellent concentration of light in the red-infrared of the first order and similar concentration in the violet-blue of the second order." |
| Orders used | blue and violet in second order, yellow and red in first |  | A41, p. 13 | "nearly all spectrograms in the blue and violet regions have been made in the second order, and those in the red and yellow in the first order" |
| Other gratings (1950s) | 900 lines/mm blazed third-order blue; 600 lines/mm first-order infrared (1960s); four gratings interchangeable |  | B57, p. 380 | "One of the new gratings is ruled with 900 lines per mm and is blazed in the third order" |
| Angle of incidence | about 16 deg (for the 600 lines/mm grating of the 1960s; not given for the 14,400/in grating) |  | G64, p. 1387 | "the angle of incidence upon the grating is about 16" |
| Scattered light | below 3300 A a diaphragm covering about half the grating is needed |  | A41, p. 13 | "below X 3300 a diaphragm covering about one-half its surface must be used" |

### Cameras

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| 32-in Schmidt | off-axis Schmidt camera, 32 in; second order 10.4 A/mm (first order about 20 A/mm) |  | A41, p. 13 | "32-inch Schmidt, second order" |
| 32-in dispersion | 1 mm = 10.4 A (second order) | A/mm | A41, p. 13 | "1 mm = 10.4 A" |
| 32-in first order | 20 A/mm in first order with the 32-in off-axis Schmidt (1937) | A/mm | D37, p. 26 | "with the 32-inch off-axis Schmidt camera" |
| 73-in Schmidt dispersion | 4.5 A/mm (second order) | A/mm | A41, p. 13 | "73-inch Schmidt, second order" |
| 108-in lens camera dispersion | 3.1 A/mm (second order); a lens of 108 in focal length (1935-1940) | A/mm | A41, p. 13 | "108-inch lens, second order" |
| 114-in camera | spherical mirror, 36 in diameter, mirror radius 19 ft (center of curvature 4 in to one side of the grating center), f/19; no corrector plate |  | D46, p. 49 (transcribed from the scan) | "The mirror, which has a diameter of 36 inches and a radius of curvature of 19 feet" |
| 114-in camera (alt) | ALT: no correcting plate required; no glass between star and plate |  | A41, p. 12 | "the operating ratio of the camera is such that no correcting plate is required" |
| 114-in focal ratio | 114 in / 6 in = f/19 |  | G64, p. 1387 | "This f/19 camera system" |
| 114-in dispersion | 2.9 A/mm (2.88 A/mm in Dunham's note), second order | A/mm | A41, p. 13 | "114-inch Schmidt, second order" |
| 114-in dispersion (alt) | ALT: 2.88 A/mm | A/mm | D46, p. 49 (transcribed from the scan) | "14,400 lines per inch is approximately 2.88" |
| Spectrum length and plate | 16 in of fully illuminated spectrum; plate 2 in wide (20-in spectrograms in the abstract) |  | D46, p. 49 (transcribed from the scan) | "The length of fully illuminated spectrum is 16 inches" |
| Later cameras | 8-in and 16-in (quartz) cameras added in the 1950s |  | B57, p. 380 | "Cameras of 8-inch and 16-inch focus, the latter with all quartz optics, are being added" |
| Layout | steel frame; slit near the acute vertex of an inverted right triangle; cameras on the horizontal base; the grating rotates to send the spectrum horizontally to the cameras or down along the optical axis |  | A41, p. 12 | "The whole structure forms approximately an inverted right triangle with the slit lying near the acute vertex" |
| Camera change | correctors and lens rest on a plate in front of the grating; the 32-in camera moves on rails; change in 2-3 minutes |  | A41, p. 12 | "requires not more than 2 or 3 minutes" |

### Detector and performance

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Plate | Cramer Hi-Speed Special plates in the blue (30-40 min exposures on alpha Boo) |  | A41, p. 14 | "Cramer Hi-Speed Special plates were used for nearly all the spectrograms" |
| Plate resolution | lines 30 um apart (0.086 A) clearly separated with a 20 um slit (114-in camera) | um | D46, p. 49 (transcribed from the scan) | "Spectral lines 30" |
| Effective pixel | 20 um (EFFECTIVE: the slit image and the plate's resolution, D46) | um | DERIVED/INFERRED/NOT FOUND |  |
| Resolution of the grating | Fe lambda 3918 components 0.099 A apart completely resolved on fast plates | A | A41, p. 13 | "complete photographic resolution even on fast plates" |
| Resolving-power limits (1964, 600 /mm grating, first order, 8500 A) | about 78,000 from the grating alone (95,000 lines) and 77,000 from the f/19 camera alone (calculated; the saved page ends before Griffin's measured value) |  | G64, p. 1387 | "The resolving power in the first order, even with a vanishingly small width of the entrance slit" |
| Reflections | six aluminum reflections including the telescope and spectrograph |  | A41, p. 13 | "six including the telescope and spectrograph" |
| Faintest star | o Ceti, m(pg) about 6.0, 5.5 h exposure with the 114-in; 32-in: magnitude 7 | mag | A41, p. 13 | "The faintest star so far observed with the highest dispersion" |
| Interstellar CH and CN | CH lines in zeta Oph found with the coudé (predicted by McKellar); CH and CN in space 'beyond reasonable doubt' |  | A41, Abstract, p. 11 | "the presence of several lines of CH, predicted by McKellar, has been established" |

### DERIVED and EFFECTIVE

- Groove spacing d = 25.4 mm / 14,400 = 1.764 um (DERIVED). Second-order dispersion K = d cos beta / (2 f). For the 114-in camera (2896 mm) with the published 2.9 A/mm: cos beta = 2.9 x 2 x 2895.6 / 17,639 = 0.952, **beta = 17.8 deg** (Dunham's 2.88 gives 19.0 deg). With the violet center 4300 A in second order: sin alpha + sin beta = 2 x 4300 / 17,639 = 0.4876, so alpha = 10.5 deg and **psi = alpha + beta = 28.3 deg (EFFECTIVE, INFERRED: the wavelength to which 2.9 A/mm refers is not stated; Griffin's 16 deg incidence is for a different grating)**; r = cos alpha / cos beta = 1.03.
- The model with those angles gives for the 32-in, 73-in, 114-in cameras 10.33, 4.53 and 2.90 A/mm against the published 10.4, 4.5 and 2.9 (the 108-in lens 3.1 is outside the Settings).

| Setting | f (in) | published K, 2nd order (A/mm) | grating-equation K with beta = 17.8 deg (A/mm) | DERIVED slit for a 20 um slit image (mm / arcsec) | DERIVED R at 4300 A |
|---|---|---|---|---|---|
| 32-inch | 32 | 10.4 | 10.33 | 0.109 / 0.295 | 20,673 |
| 73-inch | 73 | 4.5 | 4.53 | 0.048 / 0.129 | 47,778 |
| 114-inch | 114 | 2.9 | 2.90 | 0.031 / 0.083 | 74,138 |

- **Slit and pixel (EFFECTIVE).** Dunham 1946 uses a 20 um slit with the 114-in camera and resolves lines 30 um apart: the effective pixel is 20 um, and the slit image is then 20 um on the plate for every camera: slit (mm) = 0.02 f_col / (f_cam r) with f_col = 4572 mm; sky size = slit x 2.7066 arcsec/mm (f/30, 3000 in). Nx: only the 114-in's illuminated 16-in length is sourced (D46): 20,320 px (the Nx slider ends at 16,000: same trap as the Hale record; the other cameras' lengths are not found, INFERRED the same 16 in).

## Published performance (validation targets)

| quantity | value | kind | source |
|---|---|---|---|
| 2nd-order dispersion, 32 / 73 / 108-lens / 114 | 10.4 / 4.5 / 3.1 / 2.9 A/mm | published | A41 p. 13 |
| first order is about half the 2nd-order scale | 20 A/mm for the 32-in (1937) | published | A41 p. 13; D37 p. 26 |
| 114-in dispersion | 2.88 A/mm | published | D46 |
| spectrum length, 114-in camera | 16 in fully illuminated | published | D46 |
| resolution on plates | 30 um (0.086 A) separated with a 20 um slit | measured on plates | D46 |
| Fe 3918 pair | 0.099 A resolved | measured | A41 p. 13 |
| 1964: grating-limited and camera-limited R | 78,000 and 77,000 (first order, 600 /mm) | calculated | G64 |
| faintest star | o Ceti m_pg 6.0 in 5.5 h with the 114-in | observed | A41 p. 13 |

## NOT FOUND

Measured R; the 32-in and 73-in plate lengths; the angle of incidence; the 1935 collimator's aperture (taken as the original 6 in, 15 ft, G64 and A41 p. 11); the telescope-side slit position and the coudé train's mirror positions; a scaled layout (A41 has none); the slit width in common use; the blaze angle.

## Conflicts between sources

- **Collimator length:** G64 says 15 ft ("not 12 feet, as quoted in error by Kaplan et al."), so any 12 ft in the Kaplan paper is an error; A41 gives 15 ft only for the original prismatic instrument.
- **114-in dispersion:** 2.9 (A41) vs 2.88 (D46).
- **Grating angle:** incidence about 16 deg (G64, 600 /mm grating) vs the 10.5 deg derived above for the 14,400 /in grating at 4300 A: different gratings, no conflict.
- **Camera numbers:** B57 p. 380 lists "32-, 72-, and 114-inch"; A41 says 73-inch (Dunham 1936 gives 4 to 73 in). Keep 73.

## Layout evidence (Adams 1941 p. 12; no figure)

| element | tag | basis |
|---|---|---|
| slit near the acute vertex of an inverted right triangle of steel framework | SOURCED (text) | A41 p. 12 |
| concave collimating mirror "corrected to operate off its axis" at the far end, throws the beam "backward and slightly upward in the general direction of the slit" | SOURCED | A41 p. 12 |
| plane grating "just above the optical axis", rotated to send the spectrum horizontally into the cameras or "downward nearly along the optical axis" (114-in) | SOURCED | A41 p. 12 |
| Schmidt correctors and the lens on a plate "immediately in front of the grating", cameras on the base | SOURCED | A41 p. 12 |
| 114-in spherical mirror: center of curvature 4 in to one side of the grating center; plate 4 in from the center of the beam | SOURCED | D46 |
| distances (collimator to grating: about f_col, 4572 mm; grating to camera: 2 f) | SCHEMATIC / DERIVED | the grating sits near the slit end, so the path is about the collimator focal length |

**Verdict: OFF-AXIS.** The text says the beam goes "backward and slightly upward in the general direction of the slit", i.e. past it, to a grating near the slit; colTilt is not published (SCHEMATIC, small).

## Recommended explorer state
```
tel: Mount Wilson 100-inch (a Telescopes-mode record does not exist yet), D: 2.54, F: 30
g: { slitW: <EFFECTIVE above>, nObj: 1, col: "mirror", cam: "mirror", W: 152.4 (f_col 4572),
     fcam: 812.8 | 1854.2 | 2895.6, gType: "refl", G: 566.9, m: 2, lamC: 4300,
     lamB1: about 8600 (EFFECTIVE: strong in second-order violet), psi: 28.3 (EFFECTIVE),
     layLen: about 4400 (SCHEMATIC), Nx: 20320 (INFERRED), Ny: 1270, pix: 20, gLen: 111 or 140 (4-3/8 or 5-1/2 in; the sources do not say which side runs along the dispersion; R cap 126,000 or 159,000, above the plate limit) }
```
The 6-in beam's footprint at alpha = 10.5 deg is 6.1 in (DERIVED), larger than the ruled 4-3/8 in side and about the 5-1/2 in side: the grating may be the stop (INFERRED; the sources give the beam of the original instrument, not of the 1935 grating setup).

## What the explorer cannot represent

- The 114-in camera as a bare spherical mirror with the plate in the beam (no corrector, 4 in off the grating's center); the 32-in and 73-in Schmidt correctors in front of the grating; the 108-in lens.
- The grating as the stop, a diaphragm over half of it below 3300 A, and the rotating grating that sends the beam to different cameras.
- The photographic plate response, the image slicer, the step-slit calibration and the heated housing.

## Notes

- Interstellar CH and CN: Adams 1941's abstract reports CH lines in zeta Oph with higher dispersion and the molecules "beyond reasonable doubt".
