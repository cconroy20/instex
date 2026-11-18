# Round 11 (2026-11-18): the MMT Spectrograph's Blue Channel, long slit on the 6.5 m MMT (id `bluechannel`)

Same rules as rounds 1-10 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/bluechannel/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **MEASURED** marks a value read from a figure (method stated); **INFERRED** marks a reading that is not stated; **SCHEMATIC** marks a layout element with no source. Quotes were machine-checked against `pdftotext -layout` and `-raw` text and tag-stripped HTML (letters and digits only): **46 quote pieces, 0 failures** (script: scratchpad r11/bluechannel/quotes.py). The 1979 report (A79) has no text layer: its quotes were matched against tesseract OCR and are marked "transcribed from the scan (p. N)"; two figure labels in a GIF were read by eye and are marked as such.

**IMPORTANT, read first: the paper named in the brief is not about the Blue Channel.** Schmidt, Weymann & Foltz 1989 (PASP 101, 713) describes the *CCD channel*, which is today's **Red Channel** (95 mm = 3.75 in. beam, 152 mm Schmidt camera, SF6 cross-dispersing prism; the MMTO overview calls the Red Channel "a 3.75″ beam spectrograph"). It mentions the Blue Channel in four places (150 mm beam, f/1.5 folded Schmidt camera, TIRP, Reticon). The Blue Channel itself is described by Angel, Hilliard & Weymann 1979 (A79), and its current gratings, CCD and slits by the MMTO pages. The Red Channel has been unavailable since a CCD glow and the detector page says "Decommissioned as of ~ 2019"; it would be a separate preset (S89 gives its optics fully). A Blue Channel preset is the right one for the explorer: it is the instrument in service.

## Completeness summary

**Complete (sourced or fitted to a published table):** telescope and f/9 feed, slit widths and lengths, the 150 mm beam, the off-axis parabolic collimator and the 70 deg fold at the TIRP, the camera-collimator angle (30 deg), the folded Schmidt camera and its focal length (250.4 mm), the detector (2688 x 512, 15 um), all eight grating settings with blaze, order, anamorphic factor, dispersion, coverage, R. **A global check:** with psi = 30 deg and f_cam = 250.4 mm, the grating equation reproduces the MMTO table's anamorphic factors (6 of 6), dispersions (8 of 8, within 1%) and coverages (within 1%), and the blaze angles (6 of 6) from the blaze wavelengths. The table's blaze wavelengths are center wavelengths in the 30 deg geometry; this makes the table an independent test of the geometry only for the dispersions and anamorphic factors, which the preset does not use as inputs (the inputs are f_cam from A79 and psi from A79).

**Not found:** an as-built collimator focal length (derived 1350 mm = f/9 x 150 mm; the table implies 1380 mm), the ruled size of the gratings, the camera aperture and prescription, a scaled layout drawing, measured arc-line R for each grating.

**Recommended preset:** "MMT / Blue Channel, 500 l/mm, 1″" as the default of an instrument with a Setting menu: `300`, `500`, `800`, `832 2nd`, `832 1st`, `1200` (and `600 2nd` or `600 1st` if wanted). Why these: the observatory table lists 300, 500, 800, 600, 832, 1200; PypeIt (2023) built wavelength templates for 300, 500, 800, 832 (both orders) and 1200 and not 600, which is the only evidence of use I found (no usage statistics are published; this is a judgment). 300 gives the widest coverage (5268 A) and lowest R (740), 500 and 800 the middle, 832 in the second order and 1200 the highest resolution (R about 3300 to 3800). **Era:** the 6.5 m converted MMT (D = 6.5 m, f/9). The 1989 paper (written before the conversion) says "both the blue and CCD channels will see immediate service on the upgraded telescope" and expects an f/9 Cassegrain focus; the observatory page says the instrument "mounts to the standard MMT f/9 top box". The Blue Channel's optics are those of 1979: the 9.86 in. camera and the 30 deg angle of A79 reproduce today's grating table. The detector is the current ITL/STA0520A (2688 x 512), not the 1980s Reticon.

## Sources

| key | document | local file (rawdata/presets/bluechannel/) | URL |
|---|---|---|---|
| S89 | Schmidt, G. D., Weymann, R. J. & Foltz, C. B. 1989, PASP 101, 713, "A Moderate-Resolution, High-Throughput CCD Channel for the MMT Spectrograph" (ADS 1989PASP..101..713S; title checked on ADS; text layer). NOTE: this paper describes the CCD channel, which became the RED Channel; it describes the Blue Channel only in passing. | 1989PASP..101..713S.pdf | https://articles.adsabs.harvard.edu/pdf/1989PASP..101..713S |
| A79 | Angel, J. R. P., Hilliard, R. L. & Weymann, R. J. 1979, SAO Special Report 385, p. 87, "An Optical Spectrograph for the MMT" (ADS 1979SAOSR.385...87A; title checked on ADS; the original design of the Blue Channel; scan WITHOUT a text layer, OCRed with tesseract, quotes marked "transcribed from the scan"; Table 2 is a rotated page, OCRed after rotation) | 1979SAOSR.385...87A.pdf | https://articles.adsabs.harvard.edu/pdf/1979SAOSR.385...87A |
| MD | MMT Observatory, Blue Channel Details page (grating table, optical layout figure, echellette text), retrieved 2026-11-18 | bc_details.html | https://www.mmto.org/instrument-suite/blue-red-channel-spectrographs/blue-channel-details/ |
| MO | MMT Observatory, Blue & Red Channel Spectrographs overview page, retrieved 2026-11-18 | bc_overview.html | https://www.mmto.org/instrument-suite/blue-red-channel-spectrographs/ |
| MA | MMT Observatory, Aperture Plates and Filters page, retrieved 2026-11-18 | bc_apertures.html | https://www.mmto.org/instrument-suite/blue-red-channel-spectrographs/aperture-plates-and-filters/ |
| MC | MMT Observatory, Blue and Red Channel detector information (ITL data), retrieved 2026-11-18 | bc_detector.html | https://www.mmto.org/instrument-suite/blue-red-channel-spectrographs/blue-and-red-channel-detector-information/ |
| PY | PypeIt documentation, MMT Blue Channel (templates for 300, 500, 800, 832 1st and 2nd order, 1200 gpm; used only as evidence of which gratings are in use) | pypeit_mmt_bluechannel.rst.txt | https://pypeit.readthedocs.io/en/state/_sources/spectrographs/mmt_bluechannel.rst.txt |
| LAY | MMTO optical layout figure of the Blue Channel (GIF, 549 x 345 px, no scale bar) | bclayout.gif | http://www.mmto.org/wp-content/uploads/2020/03/bclayout.gif |
| BLZ | MMTO theoretical blaze functions (PDF; saved, not used) | bcblaze.pdf | http://www.mmto.org/wp-content/uploads/2020/03/bcblaze.pdf |

Not downloaded: the Blue Channel's own manual and MMT Technical Reports (not found online; "Operation of the MMT Spectrograph: version 4", Foltz & Ouellette 1988, 1988omsv.book.....F, is on ADS without a scan); the MMTO count-rate and throughput tables (not needed). Please supply Foltz & Ouellette 1988 if it exists in your files: it would settle the collimator focal length and the grating cells.

## Parameters


### Telescope and feed

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| Aperture (6.5 m era) | 6.5 | m | SOURCED | S89, p. 713, Abstract and p. 721 (Future Plans) | single-mirror telescope of ~ 6.5-m aperture |
| Focal ratio at the instrument | f/9 |  | SOURCED | S89, p. 721 (Future Plans) | upgrade envision an //9 Cassegrain focus |
| ALT: focal ratio (observatory page, current) |  |  | ALT | MO, Overview page | mounts to the standard MMT f/9 top box |
| ALT: focal ratio (the 1989 six-mirror telescope) |  |  | ALT | S89, p. 714, Sec. 2.1 | combined beam requires a monochromatic camera focal |
| ALT: f/9 in the 1979 design |  |  | ALT | A79, p. 89 (Sec. 2), transcribed from the scan | a single image from a point source is produced which is contained |
| Plate scale at the slit | 3.526 | arcsec/mm | DERIVED |  | 206265 / (6.5 m x 9 x 1000 mm/m) = 3.526 arcsec/mm. The six-mirror telescope's f/9 plate scale was 3.6 arcsec/mm (S89 p. 714: "Cassegrain image scale of 3.6 arc sec mm-1"; A79 Table 2: slit "2.0 x 3.6 (.558 x 1.000 mm)" gives 3.58). |
| Sky scale on the detector, unbinned | 0.3 | arcsec/px | SOURCED | MA, Slit Length paragraph | nominal unbinned scale of 0.3″/pixel |
| Slit widths | 0.75, 1.00, 1.25, 1.50, 2.00, 3.50, 3.75 (20-in. long only), 5.00 | arcsec | SOURCED | MA, Standard Slits table | Slit Width (arcsec) 180″ Length 20″ Length 9″ Length |
| Slit length (long slits) and unvignetted length | 180 (plate); about 150 unvignetted | arcsec | SOURCED | MA, Slit Length paragraph | The unvignetted slit is about 150 arcsec long |
| Aperture plates tilted to the axis | 12.5 | deg | SOURCED | MA, Aperture Plates paragraph | The aperture plates are tilted 12.5° with respect to the optical axis |
| Slit plates and filters are shared with the Red Channel | yes |  | SOURCED | MA, first line | used for both Blue and Red Channel |

### Collimator and beam

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| Collimated beam diameter | 150 | mm | SOURCED | S89, p. 714, Sec. 2.1 | provides a 150-mm diameter collimated beam and 40-mm focal-plane format |
| ALT: beam diameter (1979 design) |  |  | ALT | A79, p. 104, Sec. 3.5, transcribed from the scan | we are led to choose a beam diameter of 150 mm |
| Collimator type | off-axis parabolic mirror (6-inch beam) |  | SOURCED | A79, Fig. 1 label and caption, p. 90, transcribed from the scan | off axis parabolic collimator |
| ALT: collimator, caption of Fig. 1 |  |  | ALT | A79, p. 90, transcribed from the scan | off-axis 6-inch collimator |
| ALT: the collimator in the current layout drawing is a single mirror (figure label read by eye, not machine-checked) |  |  | ALT | bclayout.gif, label 'Collimator' |  |
| Fold ahead of the collimator (the slit beam turns to the collimator) | about 70 deg, by the total-internal-reflection prism (TIRP) when the Blue Channel is used alone | deg | SOURCED | A79, p. 110, Sec. 4.2, transcribed from the scan | the beam from the slit is deflected some 70° by the dichroic mirror or internally reflecting prism |
| ALT: the TIRP replaced the dichroic in the built instrument |  |  | ALT | S89, p. 714, Sec. 2.1 | total internal reflection prism (TIRP; see Fig. 1) to feed the blue colli- |
| Collimator focal length | 1350 | mm | DERIVED |  | f = (f/9) x 150 mm = 1350 mm. NOT FOUND as a stated value: the beam fills the f/9 cone of the telescope, so the collimator is f/9. Cross-check: the observatory table's 1 arcsec slit is 3.43 pixels wide before the anamorphic factor (6.47 A / 1.96 A/px / 0.96 = 3.44; the same 3.43 for the other gratings), which gives 0.2915 arcsec/px and f_col = 1380 mm, 2% longer; the table's 0.3 arcsec/px is rounded. |
| Collimator on- or off-axis | OFF-AXIS (tilt about 3.5 deg, MEASURED, +-2 deg) | deg | MEASURED |  | Quoted: "off axis parabolic collimator" (A79 Fig. 1) and "off-axis 6-inch collimator" (caption). MEASURED from the observatory layout drawing (bclayout.gif, 549 x 345 px, no scale; read at 3x): the ray from the TIRP to the collimator makes 21 deg with the horizontal, the beam from the collimator to the grating 29 deg, so the two differ by 7.6 deg; the mirror tilt is half of that, 3.8 deg (rounded to 3.5 for the stated reading error). The slit does NOT stand in the returning beam: the TIRP is off to the side of the collimated beam in the drawing. |
| Collimator-to-grating distance (layLen) | 1085 (range 975 to 1365) | mm | MEASURED |  | MEASURED from bclayout.gif: 821 px from the collimator center to the grating center, scaled so that the slit-to-collimator path (TIRP leg 552 px + slit leg 470 px = 1022 px) equals f_col = 1350 mm (1.32 mm/px). Scaling by the 150 mm beam (123 px across the collimator) gives 975 mm. The 1979 side view (A79 Fig. 1, scale in feet, 132 px/ft) gives 591 px = 1365 mm, and scaled by f_col as above 1245 mm. The drawings are schematic; the spread is the uncertainty. |
| Fold position | 0.57 of the slit-to-collimator path measured from the collimator (TIRP about 0.43 from the slit) |  | MEASURED |  | MEASURED from bclayout.gif: collimator leg 552 px, slit leg 470 px, fraction 552/1022 = 0.54; A79 Fig. 1: 890 mm of 1480 = 0.60. Mean 0.57. |

### Gratings and geometry

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| Gratings in service | 300, 500, 800, 600, 832, 1200 /mm, plus the 240 /mm echellette |  | SOURCED | MD, Blue Channel Gratings table | Grating (lines/mm) Blaze (order/λ Å) Blaze Angle(°) Anamorphic Mag R (@ Blaze, 1″ slit) Resolution (Å) Dispersion (Å/pix) Coverage |
| Gratings resident at one time | 3 |  | SOURCED | MO, Blue Channel paragraph | Three gratings can be resident in the spectrograph at any one time |
| Grating type | plane ruled reflection gratings, used in first or second order |  | SOURCED | MD, Blaze column (order/blaze wavelength) | 832 2nd/3900 19.7 0.83 3830 1.02 0.36 968 |
| Camera-collimator angle psi (alpha - beta) | 30 | deg | SOURCED | A79, p. 104, Sec. 3.5, transcribed from the scan | We have therefore selected a camera-collimator angle of 30° |
| ALT: angle (Table 2) |  |  | ALT | A79, p. 109, Table 2, transcribed from the scan | Camera-Collimator included angle: 30° |
| psi confirmed from the as-built table | 30 | deg | DERIVED |  | DERIVED: with the blaze wavelength of the table taken as the grating's center wavelength at psi = 30 deg, (alpha+beta)/2 = asin(m G lam_B / (2 cos 15 deg)) equals the table's blaze angle for every grating (300: 4.27 vs 4.30; 500: 8.05 vs 8.05; 800: 9.65 vs 9.67; 600: 17.35 vs 17.4; 832: 19.63 vs 19.7; 1200: 17.46 vs 17.5 deg), and cos(alpha)/cos(beta) equals the table's anamorphic factor (0.961 vs 0.96, 0.927 vs 0.93, 0.913 vs 0.91, 0.846 vs 0.85, 0.826 vs 0.83, 0.845 vs 0.84). So the table's blaze wavelengths are the center wavelengths in a 30 deg geometry, and the 1979 angle holds today. |

### Camera

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| Camera type | folded Schmidt (corrector, spherical mirror, folding flat with a hole, CCD at the flat) |  | SOURCED | S89, p. 714, Sec. 2.1 | practical for a folded Schmidt design |
| ALT: camera layout in the current drawing (figure label read by eye, not machine-checked) |  |  | ALT | bclayout.gif, label 'CCD Dewar and Folded Schmidt Camera' |  |
| Camera effective focal length | 250.4 (9.86 in.) | mm | SOURCED | A79, p. 109, Table 2, transcribed from the scan (design value) | Camera effective focal length: 9.86 inches |
| Camera focal length confirmed by the as-built dispersions | 250 | mm | DERIVED |  | DERIVED: dispersion = 15 um x cos(beta) / (m G f_cam). With f_cam = 250.4 mm, psi = 30 deg and the table's blaze wavelengths, the formula gives 1.962, 1.189, 0.745, 0.499, 0.997, 0.359, 0.718 and 0.499 A/px for the 300, 500, 800, 600 (2nd, 1st), 832 (2nd, 1st) and 1200; the table gives 1.96, 1.19, 0.75, 0.50, 1.00, 0.36, 0.72, 0.50 (all within 1%). |
| Camera focal ratio | about f/1.5 (monochromatic), F = 1.67 for the 150 mm beam |  | SOURCED | S89, p. 714, Sec. 2.1 | ratio (-//1.5) which was practical for a folded Schmidt |
| ALT: the camera needs to be fast (1979 design) |  |  | ALT | A79, p. 104, Sec. 3.5, transcribed from the scan | there is a broad maximum in the required focal ratio of about |
| Camera field of view | +-4.5 deg (40 mm format) | deg | SOURCED | A79, p. 109, Table 2, transcribed from the scan | Field of view: + 4.5° (40 mm photocathode) |
| Grating-to-camera distance (camLen), drawing only | 300 | mm | MEASURED |  | MEASURED from bclayout.gif: grating center to the camera corrector, about 225 px x 1.32 mm/px (scale as above). Schematic: the camera is drawn in plan beside the collimated beam. |

### Detector

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| CCD | ITL/STA STA0520A, 2688 x 512 pixels, 15 x 15 um (SN 3735) |  | SOURCED | MC, Blue Channel detector block | Pixels: 2688×512 15×15 microns |
| ALT: CCD in the overview |  |  | ALT | MO, Blue Channel paragraph | The current detector is a highly-optimized ITL/STA 2688×512 CCD |
| Dispersion direction | along the 2688 columns (coverage 'for the full 2688 columns'); 512 rows along the slit (512 x 0.3 = 154 arcsec) |  | SOURCED | MD, footnote a of the gratings table | Coverage is for the full 2688 columns |
| Read noise, gain | 2.45 e-; 2.20 e-/DN (gain 1) and 1.12 (gain 2) |  | SOURCED | MC, Blue Channel detector block | Noise ≈ 2.45 e- |
| Earlier Blue Channel detector (1989) | dual 1024-element Reticon photon-counting array, 40 mm format |  | SOURCED | S89, p. 714, Sec. 2.1 | dual 1024 element Reticon array operating in a centroiding |

### Wavelength coverage

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| Instrument range | 3200-8000 | A | SOURCED | MO, Blue Channel paragraph | optimized for spectroscopy in the range from 3200-8000 Å |
| Coverage per setting | see the grating table (968 to 5268 A on 2688 columns) |  | SOURCED | MD, Blue Channel Gratings table | Coverage is for the full 2688 columns. |
| Resolution quoted | as high as 30 km/s |  | SOURCED | MO, Blue Channel paragraph | A number of gratings are available giving resolution as high as 30 km/sec |

### Published performance

| parameter | value | unit | tag | source + location | verbatim quote / derivation |
|---|---|---|---|---|---|
| Slit-limited R, 1 arcsec slit, best grating (1989) | 8000 (0.5 A) |  | SOURCED | S89, p. 714, Sec. 2.1 | producing slit-limited resolutions as high as 8000 (0.5 A for a 1 arc sec wide slit) |
| Table value R at blaze, 300 /mm, 1st/4800 | 740; resolution 6.47 A; 1.96 A/px |  | SOURCED | MD, Blue Channel Gratings table | 300 1st/4800 4.30 0.96 740 6.47 1.96 5268 |
| 500 /mm, 1st/5410 | 1430; 3.79 A; 1.19 A/px; 3198 A |  | SOURCED | MD, Blue Channel Gratings table | 500 1st/5410 8.05 0.93 1430 3.79 1.19 3198 |
| 800 /mm, 1st/4050 | 1730; 2.34 A; 0.75 A/px; 2016 A |  | SOURCED | MD, Blue Channel Gratings table | 800 1st/4050 9.67 0.91 1730 2.34 0.75 2016 |
| 600 /mm, 2nd/4800 and 1st/9630 | 3310 (3330); 1.45 (2.90) A; 0.50 (1.00) A/px |  | SOURCED | MD, Blue Channel Gratings table | 600 2nd/4800 17.4 0.85 3310 1.45 0.50 1344 1st/9630 17.4 0.85 3330 2.90 1.00 2688 |
| 832 /mm, 2nd/3900 and 1st/7790 | 3830; 1.02 (2.04) A; 0.36 (0.72) A/px; 968 (1935) A |  | SOURCED | MD, Blue Channel Gratings table | 832 2nd/3900 19.7 0.83 3830 1.02 0.36 968 1st/7790 19.7 0.83 3830 2.04 0.72 1935 |
| 1200 /mm, 1st/4830 | 3340; 1.45 A; 0.50 A/px; 1344 A |  | SOURCED | MD, Blue Channel Gratings table | 1200 1st/4830 17.5 0.84 3340 1.45 0.50 1344 |
| How the table's R is made (GEOMETRIC, not measured) | R = blaze wavelength / resolution; resolution = (1 arcsec slit in px) x A/px |  | DERIVED |  | The R column is lam_B / Resolution (300: 4800/6.47 = 742; 1200: 4830/1.45 = 3331); the resolution is 3.43 px x anamorphic factor x A/px (300: 3.43 x 0.96 x 1.96 = 6.45). It is a slit-limited number, an ideal image, not a measurement. |
| Measured line width, 1 arcsec slit, low-resolution grating | 2.8 px (Gaussian FWHM of a comparison line); 3.2 px for the Red Channel | px | SOURCED | MA, Standard Slits table, 'Blue FWHM (pixels)' column | 1.00 √ √ √ 2.8 3.2 |
| What the measured widths used | a low-resolution grating, anamorphic factor near 1, no binning |  | SOURCED | MA, text above the slit table | In both cases a low-resolution grating was used, so the anamorphic factor is near unity |
| Slit width series (FWHM, px) | 0.75: 2.6; 1.00: 2.8; 1.25: 3.1; 1.5: 3.6; 2.0: 4.5; 3.5: 7.9; 5.0: 11.5 | px | SOURCED | MA, Standard Slits table | 3.50 √ √ √ 7.9 10.0 |
| Echellette (the 240 /mm 6 x 10 in. grating) | orders 8-17, 3100-7000 A, 10 arcsec slit; R about 10,000 for a 1 arcsec slit in a perfect instrument; measured 30 to 60 km/s |  | SOURCED | MD, Cross Dispersed Echellette Mode | a 6″ x 10″, custom-ruled, 240 g/mm grating which can be used in orders 8-17 simultaneously |
| ALT: echellette measured |  |  | ALT | MD, Cross Dispersed Echellette Mode | The resulting resolution varied from about 30 to 60 km/sec |

## Optical layout (from the published figures)

Figures: **LAY** (MMTO optical-layout GIF, the current instrument, side view, no scale) and **A79 Fig. 1** (p. 90, the 1979 design side view with a scale in feet, 132 px/ft on the 200 dpi scan; its red channel and dichroic did not survive in this form). S89 Fig. 1 (p. 715) shows the whole spectrograph with both channels from a perspective view; it is a sketch.

Element order, as drawn in LAY (the light travels down from the top box): the aperture wheel (slit plate, tilted 12.5 deg, SOURCED), two filter wheels and the shutter, then the folding prism (TIRP, SOURCED) at the center of the housing, which turns the beam about 70 deg (SOURCED, A79 p. 110; MEASURED 69 deg in LAY: 200 px rise over 552 px of travel) toward the off-axis parabolic collimator at the lower left. The collimator returns the collimated beam up and to the right, past the TIRP (not through it: the TIRP stands outside the returning beam), to the grating turret at the upper right (three grating cells; SOURCED). The grating diffracts the beam back to the left (horizontally, in the drawing) into the folded Schmidt camera and CCD dewar at the left. The camera axis and the collimator axis make psi = 30 deg at the grating (SOURCED, with the A79 camera-collimator angle). The red channel takes the beam straight on through the open TIRP position (the arrow "To Red Channel").

- **Verdict on the collimator: OFF-AXIS.** SOURCED: "off axis parabolic collimator" (A79 Fig. 1) and "off-axis 6-inch collimator" (A79 caption). The TIRP is beside the returning beam, not in it, so the slit is not obscured; colTilt about 3.5 deg MEASURED (+-2 deg). Explorer: col "mirror", colTilt 3.5 (not 0, not auto).
- Slit-to-collimator path: TIRP leg 470 px + collimator leg 552 px (MEASURED); the fold sits at about 0.57 of that path from the collimator (preFold at 70 deg deviation, Spectral view). The path is f_col = 1350 mm (DERIVED); the 1979 drawing gives 1480 mm, 10% longer.
- Collimator-to-grating, layLen: 1085 mm MEASURED (975 to 1365 mm depending on the scale used; see the table). The pupil is on the grating (A79: collimator pupil at the grating is not stated for the Blue Channel; the red channel statement in S89 does not apply). Grating-to-camera, camLen: 300 mm MEASURED, schematic.
- The camera is a folded Schmidt: corrector, spherical mirror at the back, a folding flat with a hole next to the CCD; the CCD sits inside the camera (A79: "the folding flat must be as close as possible to the photocathode"; a stand-alone dewar in the built instrument, S89 p. 714). Explorer: cam "mirror" (catadioptric, internal focus).
- SCHEMATIC: the housing outline, grating-turret details, the red-channel path. Not drawn: the 20 in. echellette prism and camera rotation (separate mode).

## Conflicts between sources and judgment calls

1. **Camera focal length: 250.4 mm vs 228 mm.** A79 Table 2 (design): 9.86 in. = 250.4 mm; the as-built dispersions need 250 mm (fit above). S89 p. 716 says the Red camera (152 mm) is "basically a 2:3 scale model of the folded Schmidt in blue channel", which would give 228 mm; 228 mm fails the MMTO dispersions by 9%. Used: 250.4 mm.
2. **Camera speed.** S89: "(-//1.5)" monochromatic; with f = 250.4 mm and a 150 mm beam the ratio is f/1.67. A79's own design uses a corrector of 9.5 in. aperture. Drawing only; not an input.
3. **Plate scale: 0.3 vs 0.286 arcsec/px.** MMTO rounds to 0.3; f/9 and the 1350 mm collimator give 0.286; the table's slit widths imply 0.2915. The model's slit image is 2% wider (in pixels) than the table's.
4. **Measured vs table FWHM.** A 1 arcsec slit measures 2.8 px FWHM (MA, low-resolution grating, anamorphic near 1) but the table's resolution is 3.30 px for the 300 /mm grating (3.43 x 0.96): the measured line is 15% narrower than the geometric slit image (a Gaussian fit to a non-Gaussian profile; MA says so). A measured R at the 300 grating is about 875, not 740.
5. **Detector.** The Blue Channel had a Reticon in 1989 (S89); the table and slit data are for the 2688 x 512 CCD; the earlier Loral/Reticon eras are not represented.
6. **The brief's paper.** S89 is the Red Channel paper (see the top).

## Notes for the explorer's model

- Mode grating, mirror collimator, reflection gratings, orders 1 and 2; D = 6.5, F = 9, slit 1 arcsec, nObj 1, W = 150 mm, fcam = 250.4, psi = 30, Nx = 2688, Ny = 512, pix = 15 um; lamC = the table's blaze wavelength, lamB1 = 2 sin(blaze)/G (first-order Littrow wavelength, Angstrom; check the presets.js convention for m = 2). The JSON holds all eight settings with alpha, beta and the pub lines (dispersion, span, npix: all inputs-independent checks; R is info).
- The explorer's pupil is the full 6.5 m; the MMT Blue Channel beam is the whole f/9 beam, so there is no pupil issue.
- The model cannot represent: the cross-dispersed echellette mode (a quartz prism and a rotated camera; the Blue Channel prism is fused silica, from A79's design, not confirmed for the built instrument), the 20 or 9 arcsec echellette slits, the vignetting by the filter wheels along the slit, the folded Schmidt's central hole (about 14 to 16 % loss, A79 p. 105 text), and the TIRP's reflection loss.
- gLen (ruled length) is NOT FOUND: the beam on the grating is 150 / cos(alpha) = 183 mm at alpha = 34.6 deg; standard 6-in. gratings are about 154 mm long, so the 832 and 1200 settings may be grating-limited. Not entered.
