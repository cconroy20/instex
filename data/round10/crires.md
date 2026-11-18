# Round 10 (2026-11-18): CRIRES+, the cryogenic cross-dispersed infrared echelle of the VLT (id `crires`)

CRIRES+ (the upgrade of the CRyogenic high-resolution InfraRed Echelle Spectrograph, ESO; installed on VLT UT3 Nasmyth B in 2020, in operation since 1 October 2021; the original CRIRES ran at UT1 from 2006 to 2014). Same rules as rounds 1-9 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/crires/`; each value carries the source key, the location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so that the explorer reproduces published performance where the prescription is unpublished (fit and inputs shown); **INFERRED** marks a reading that is not stated. Conflicts are listed with both values. Quote check (`py/check.py`, pdftotext -layout and -raw, normalized): **59 quote pieces, 0 failures**; the 197 order rows of Table 20 (591 wavelength ranges) were parsed from the text layer and each range string was found in the text (0 missing); the TSV is `data/round10/crires_order_table.tsv`. The figure readings (marked MEASURED) are not quote-checked.

## Completeness summary

**Complete from the open literature:** the feed (UT3 Nasmyth B, f/15, slits 0.2 and 0.4 arcsec by 10 arcsec), the pre-slit cross-dispersion unit (off-axis parabola R = 1500 mm, 50 mm beam, six gratings 480/360/230/130/60/40 per mm, lens-triplet camera at f/8, filters, distances), the echelle (31.6 /mm, 63.5 deg blaze, R2, 400 x 200 mm, unchanged from CRIRES), the detectors (three 2048 x 2048 H2RG, 18 micron, gaps 105 and 100 px), the 29 settings with the full order table (wavelength range of every order on each of the three detectors), the pixel scale (0.056 arcsec), and measured R (OH lines) for H1582 and K2148.

**Not found:** the TMA focal length and spectrograph beam, the echelle gamma, theta and ruled size, the as-built cross-disperser gratings and their angles, and the TMA geometry (Follert 2014 and 2016, Lizon 2014 and Dorn 2016 are SPIE papers: see NOT FOUND). **The TMA focal length (1448 mm for the camera, 1400 mm for the collimator) and a 175 mm beam are EFFECTIVE**: three published facts (the 0.056 arcsec pixel scale, the dispersion of Table 20, the order spacing of Fig. 36) fix them consistently (Notes). With them the model reproduces every order of 4 settings to 0.1-0.5 nm at both ends.

**The explorer cannot yet model L and M** (physics.js LAM_MAX = 2.60 micron: orders longer than that are not followed). Y, J, H and K work as they are; L and M work in a scratch copy with LAM_MAX = 6.0 (results below), so a one-line change to the limit would add them.

## Sources

| key | document | local file (rawdata/presets/crires/) | URL |
|---|---|---|---|
| D23 | Dorn, R. J., Bristow, P., Smoker, J. V., et al. 2023, A&A 671, A24, "CRIRES+ on sky at the ESO Very Large Telescope" (ADS 2023A&A...671A..24D, title checked on ADS; arXiv:2301.08048v1). Clean text layer; Figs 1-4 and Table 1 on pp. 2-4, Table 2 p. 14 | arXiv_2301.08048.pdf | https://arxiv.org/pdf/2301.08048 |
| O14 | Oliva, E., Tozzi, A., Ferruzzi, D., et al. 2014, Proc. SPIE 9147, 91477R, "Concept and optical design of the cross-disperser module for CRIRES+" (ADS 2014SPIE.9147E..7RO; arXiv:1407.3057v1; 14 pp). The design paper of the cross-dispersion unit: Fig. 2 (layout), Table 1 (design gratings), Tables 3-14 (mirrors, filters, camera) | arXiv_1407.3057.pdf | https://arxiv.org/pdf/1407.3057 |
| UM | ESO, "CRIRES User Manual", doc. ESO-254264, version P116.1, published 2025-05-22 (109 pp; the manual of the upgraded instrument). Sec. 2.1, 3.1, 4.6 and Table 20 (the 29 settings with the order table) | CRIRES_User_Manual_P116.1.pdf | https://www.eso.org/sci/facilities/paranal/instruments/crires/doc/CRIRES_User_Manual_P116.1.pdf |
| K04 | Kaeufl, H. U., Ballester, P., Biereichel, P., et al. 2004, Proc. SPIE 5492, 1218, "CRIRES: A High Resolution Infrared Spectrograph for ESO's VLT" (ADS 2004SPIE.5492.1218K; ESO copy). The ORIGINAL CRIRES (the TMA and echelle are unchanged): Fig. 2 caption gives the 200 mm TMA beam | Kaeufl_CRIRES_SPIE_2004.pdf | https://www.eso.org/sci/facilities/paranal/instruments/crires/doc/Kaeufl_CRIRES_SPIE_2004.pdf |
| UMo | ESO, "CRIRES User Manual", VLT-MAN-ESO-14500-3486, Period 93 (original CRIRES, 0.086 arcsec pixels, 27 micron Aladdin mosaic); background only | oCRIRES_User_Manual_P93.pdf | https://www.eso.org/sci/facilities/paranal/instruments/crires/doc/VLT-MAN-ESO-14500-3486_V93.pdf |
| M114 | Moorwood, A. 2003, The Messenger 114, 5, "CRIRES Takes Shape" (ADS 2003Msngr.114....5M; ADS PUB_PDF link); the echelle scan range | Messenger114_Moorwood2003_CRIRES_Takes_Shape.pdf | https://ui.adsabs.harvard.edu/link_gateway/2003Msngr.114....5M/PUB_PDF |
| H22 | Holmberg, M. & Madhusudhan, N. 2022, AJ 164, 79, "A First Look at CRIRES+: Performance Assessment and Exoplanet Spectroscopy" (ADS 2022AJ....164...79H; arXiv:2206.10621) | arXiv_2206.10621.pdf | https://arxiv.org/pdf/2206.10621 |
| M156 | Dorn, R. J., et al. 2014, The Messenger 156, 7, "CRIRES+: Exploring the Cold Universe at High Spectral Resolution" (ADS 2014Msngr.156....7D; the whole issue saved, 28 MB). Fig. 3 labels the optical design ("Three mirror anastigmat collimator/camera"); no numbers used | Messenger156_full_issue.pdf | https://www.eso.org/sci/publications/messenger/archive/no.156-jun14/messenger-no156.pdf |
| ESO | ESO CRIRES overview web page (the upgraded CRIRES at UT3); also saved: eso_doc.html, eso_inst.html, eso_tools.html (page indexes, not quoted) | eso_crires.html | https://www.eso.org/sci/facilities/paranal/instruments/crires.html |

Also saved, not quoted: eso_doc.html, eso_inst.html, eso_tools.html (ESO page indexes). Fetched but empty (not a PDF): ADS gateway for Messenger 156 (replaced by the ESO whole-issue PDF).

## CRIRES+ parameters


### Telescope and feed

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Telescope and focus | VLT UT3, Nasmyth B focus, f/15 |  | ESO, CRIRES overview page, Summary | "It is located at the Nasmyth B focus of UT3" |
| Focus (alt) | Nasmyth focus B of Unit Telescope 3 |  | D23, Fig. 1 caption, p. 2 | ALT: "installed on Nasmyth focus B of Unit Telescope 3" |
| Input focal ratio | f/15 |  | UM, Sec. 3.1.2, p. 13 | "the beam from the f/15 focus at the new entrance slit (A) is collimated" |
| Explorer pupil rule | D = 8000 mm at f/15 (Nasmyth, as UVES and MUSE) |  | project, web/presets.js header | "Nasmyth 8000 mm at f/15" |
| Slit widths | 0.2 and 0.4 | arcsec | UM, Sec. 2.1, p. 9 | "Slit width 0.2 and 0.4 arcseconds" |
| Slit length | 10 | arcsec | UM, Sec. 2.1, p. 9 | "Slit length 10 arcseconds" |
| Slit length (alt) | spatial extent reduced from 40 to 10 arcsec |  | D23, Sec. 3.1, p. 3 | ALT: "the spatial extent of the main slit was reduced from 40 to 10 arcseconds" |
| Slit mask and place | movable mask with the 0.2 and 0.4 arcsec slits, at the f/15 focus just before the entrance window (the dichroic) |  | D23, Sec. 3.2, p. 3 | "A new entrance slit (A) was implemented at a location inside just before the entrance window" |
| Slit mask (design paper) | two interchangeable slits at the f/15 focus, each cut in a mirror that reflects the outer light to the slit viewer |  | O14, Sec. 2, p. 2 | "Two interchangeable slits (width=0.2” and 0.4”, length=10”) at the F/15 focus" |
| Slit width at the f/15 focus | 0.116 (0.2 arcsec) and 0.233 (0.4 arcsec) | mm | project, DERIVED | DERIVED: 0.2 arcsec x 8000 mm x 15 / 206265 = 0.1164 mm (f/15 on 8 m = 120 m focal length; 1 arcsec = 0.582 mm) |
| Slit image at the f/8 field stop | 0.062 for the 0.2 arcsec slit | mm | project, DERIVED | DERIVED: 0.1164 mm x 8/15 (f/15 to f/8, sourced below) = 0.0621 mm; O14 Fig. 4 uses 60 micron squares for the 0.2 arcsec slit (quote in Published performance) |
| Spectra on the detector | 1 (single object on the slit); spectropolarimetry doubles it (two oppositely polarized spectra) |  | D23, Fig. 24 caption, p. 13 | INFERRED. "resulting in two spectra with opposite polarization being recorded" |

### Pre-optics: collimator, cross-disperser, camera (the "cross-dispersion unit", before the echelle)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Pre-slit collimator type | off-axis parabola (gold, cryogenic, 66 mm clear aperture decentered by 91.7 mm) |  | O14, Sec. 2 bullet list; Table 3, p. 5 | "An off-axis parabolic mirror, which collimates the light passing through the slit" |
| Pre-slit collimator radius and conic | R = 1500 mm, conic -1.0 (parabola) |  | O14, Table 3, p. 5 | "Curvature radius 1500 ± 0.5% (goal ± 0.3%) Conic constant -1.0 Parabola" |
| Pre-slit collimator focal length | 750 | mm | O14, DERIVED from Table 3 | DERIVED: f = R/2 = 750 mm for a parabola of R = 1500 mm; 50 mm beam x f/15 = 750 mm agrees |
| Pre-slit collimated beam | 50 | mm | O14, Sec. 2, p. 2 | "The diameter of the collimated beam is 50mm" |
| Beam (alt) | collimated beam 50 mm | mm | UM, Sec. 3.1.2, p. 13 | ALT: "which creates a collimated beam with a diameter of 50 mm" |
| Fold mirrors and filter wheel | two flat mirrors (Flat1 and Flat2) with the order-sorting long-pass filter wheel between them |  | O14, Sec. 2, p. 2 | "A flat mirror (Flat1) folding the beam. • Three selectable long-pass filters mounted on a wheel" |
| Cross-disperser | six reflection gratings on a cryogenic wheel, one per band Y, J, H, K, L, M; they disperse perpendicular to the echelle |  | D23, Sec. 3.2, p. 5 | "The cross-disperser wheel contains six reflection gratings, one for each of the bands Y, J, H, K, L and M" |
| Cross-disperser grooves and blaze (design) | Y 480 /mm 14.8 deg; J 360 /mm 13.2 deg; H 230 /mm 11.0 deg; K 130 /mm 8.5 deg; L 60 /mm 6.2 deg; M 40 /mm 5.4 deg |  | O14, Table 1, p. 3 | "Y 0.96 − 1.13 50 − 59 1 14.8o 480 ... K 1.93 − 2.54 22 − 29 3 8.5o 130 ... M 3.58 − 5.50 10 − 16 5 5.4o 40" |
| Cross-disperser order | first order |  | O14, DERIVED from Table 1 | DERIVED: 2 sin(blaze) / G is the band center in first order: Y 1.065, J 1.268, H 1.659, K 2.274, L 3.60, M 4.71 micron, each at its band center (the "Orders" column of Table 1 is the echelle orders) |
| Cross-disperser as built | the as-built gratings (several off the shelf, others custom) were characterized at PTB; their groove densities are not in any paper reached here |  | O14, Sec. 3, p. 3 | "Several of the gratings parameters are quite close to those of commercial devices" |
| Order-sorter filters | three wheel filters: #1 for Y and J (RG850 glass or coated silica), #2 for H and K, #3 for L and M (CaF2); a fourth position is open |  | D23, Sec. 3.2, p. 5 | "The order-sorting filter (D) can be se-lectedfromoneofthreefilters(oranopenposition)onawheelto be appropriate to the chosen cross-disperser grating (in pairs YJ, HK, LM)" |
| Filter bands (design transmissions) | #1 960-1350 nm; #2 1470-1830 and 1950-2500 nm; #3 2900-4200 and 4500-5300 nm |  | O14, Tables 10-13, pp. 6-7 | "T>95% over 1470nm – 1830nm T>95% over 1950nm – 2500nm" |
| Cross-disperser camera type | lens triplet (BaF2, ZnSe, LiF2), achromatic 0.95-5.4 micron, fixed focus |  | O14, Sec. 5.3, Table 14, p. 8 | "A lens-triplet camera, achromatic over the full 0.95-5.4 microns range" |
| Camera speed | f/8 at the field stop |  | O14, Sec. 2, p. 2 | "The beam aperture at the focus is F/8" |
| Camera speed (alt) | f/8 focus at the field stop |  | UM, Sec. 3.1.2, p. 14 | ALT: "brings the collimated beam to an f/8 focus at the field stop" |
| Cross-disperser camera focal length | 400 | mm | O14, DERIVED | DERIVED: 50 mm beam x f/8 = 400 mm (not stated) |
| Grating-to-camera and camera-to-spectrograph distances | grating to lens 1: 330.0 mm; lens 3 to the spectrograph flat (TMA-M0): 387.3 mm; lens spacings 3.3 and 56.6 mm | mm | O14, Table 14, p. 8 | "Grating – Lens 1 330.0 Lens 3 – Mirror TMA0 387.3" |
| Spectrograph entrance flat | flat Spec-Flat1, 52 x 12 mm clear aperture, at the entrance of the TMA spectrometer; the field stop (a slightly oversized slit) sits at the f/8 focus beside it |  | O14, Table 6, p. 5 | "Spec-flat 1 mirror (at the entrance of TMA spectrometer, TMA-M0 in Fig. 6) ... Clear aperture 52 x 12 Rectangular aperture" |

### Spectrograph: TMA collimator and camera, echelle

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Spectrograph optics | three-mirror anastigmat (TMA1-3) used in double pass, first as collimator and then as camera, with the echelle on a rotating stage; unchanged from the original CRIRES |  | O14, Sec. 2, p. 2 | "The spectrometer optics, consisting of 3 mirrors (TMA1, TMA2, TMA3) used in double pass and one echelle grating mounted on a rotating stage" |
| TMA role (user manual) | TMA acts first as a collimator and then as a camera to image the spectrum on the three H2RG detectors |  | UM, Sec. 3.1.3, p. 14 | "plus a TMA (three-mirror anastigmatic) which acts first as a collimator and then as a camera" |
| Collimated beam on the echelle | 200 | mm | K04, Fig. 2 caption, p. 3 (original CRIRES, same TMA) | "The main collimator, a three-mirror anastigmat, produces a 200mm collimated beam which illuminates a R2 Echelle grating (31.6 gr/mm)" |
| TMA focal length | NOT PUBLISHED; see Notes (the dispersion table, the order spacing and the pixel scale all give 1.4 m) |  | project, NOT FOUND | EFFECTIVE (Notes) |
| Echelle groove density | 31.6 | /mm | UM, Sec. 3.1.3, p. 14 | "It consists of a 40 x 20 cm, 31.6 lines/mm, 63,5deg blaze echelle grating" |
| Echelle blaze | 63.5 (R2: tan = 2.0) | deg | UM, Sec. 3.1.3, p. 14 | "31.6 lines/mm, 63,5deg blaze echelle grating" |
| Echelle size | 400 x 200 (the mm figure is the grating size; the ruled area is not stated) | mm | UM, Sec. 3.1.3, p. 14 | "40 x 20 cm" |
| Echelle size (alt) | 40 x 20 cm, 31.6 lines/mm, 63.5 deg blaze (original CRIRES) |  | UMo, Overview table, p. xiii | ALT: "Echelle grating 40 × 20cm, 31.6 lines/mm, 63.5o blaze angle" |
| Echelle type | R2 |  | K04, Fig. 2 caption, p. 3 | ALT: "R2 Echelle grating (31.6 gr/mm)" |
| Echelle tilt range | 12 (the echelle scan range) | deg | M114, Cryomechanical System, p. 8 | "Cryogenic mechanisms are required for scanning the prism (2 deg.) and echelle grating (12 deg.)" |
| Echelle gamma (off-plane) and theta | NOT PUBLISHED |  | project, NOT FOUND |  |
| Echelle angle, two settings | H1582: 66.3 deg; K2148: 64.0 deg (not the geometric incidence angle; see Notes) | deg | UM, Sec. 4.6.8, p. 49 | "H1582 wavelength setting: minimum R = 100,000; average R = 104,800 ± 2600 (echelle grating angle 66.3°)" |
| Echelle angle, K2148 | 64.0 deg | deg | UM, Sec. 4.6.8, p. 49 | ALT: "K2148 wavelength setting: minimum R = 92,000; average R = 96,500 ± 3200 (echelle grating angle 64.0°)" |

### Detectors

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Detector mosaic | three Hawaii 2RG, 2048 x 2048 each, 6144 x 2048 in total, 18 micron pixels (111 x 37 mm), cutoff 5.3 micron |  | UM, Sec. 3.1.4, p. 14 | "span over 6144 x 2048 pixels (111mm x 37mm) at a pixel size of 18μm" |
| Detector (alt) | three Hawaii 2RG detectors with a 5.3 micron cutoff |  | D23, Abstract, p. 1 | ALT: "a new detector focal plane array of three Hawaii 2RG detectors with a 5.3 µm cutoff wavelength" |
| Gaps between detectors | 1.89 mm (105 px) between 1 and 2; 1.8 mm (100 px) between 2 and 3 |  | UM, Sec. 3.1.4, p. 14 | "The gap between detectors 1 and 2 (left and centre) is 1.89 mm, which corresponds to 105 pixels, while the gap between detectors 2 and 3 (centre and right) is 1.8 mm (100 pixels)" |
| Mosaic width including the gaps | 6349 px (114.3 mm) |  | UM, DERIVED | DERIVED: 6144 + 105 + 100 = 6349 px; 6349 x 0.018 = 114.3 mm; = 111 + 1.89 + 1.8 mm. The explorer has one chip: use Nx = 6349 (the gaps are then spanned, not removed) |
| Detector temperature | 35 | K | D23, Sec. 3.5, p. 6 | "The detectors are operated at 35 Kelvin" |
| Pixel scale along the slit | 0.056 | arcsec/px | UM, Sec. 4.6.7, p. 48 | "The pixel scale of the science detector is 56 milli-arcsec" |
| Pixel scale (alt, Holmberg+22) | 0.059 (K band) | arcsec/px | H22, Sec. 2, p. 4 | ALT: "the pixel scale in terms of an-gular size is 0.059”" |
| Slit image length on the detector | 179 px for 10 arcsec | px | UM, DERIVED | DERIVED: 10 / 0.056 = 179 px; the 10 arcsec slit is 179 px of the 2048 px height |

### Wavelength coverage and settings

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Total range | 0.95-5.3 micron (Y, J, H, K, L, M) |  | UM, Sec. 2.1, p. 9 | "Wavelength coverage 0.95 - 5.3 μm (YJHKLM bands)" |
| Number of settings | 29 fixed settings; no free settings |  | UM, Sec. 4.6.1, p. 44 | "A total of 29 different settings is required to cover the full operating range of CRIRES" |
| Setting names | the name is the band letter plus the central wavelength in nm of the setting (column 1 of Table 20) |  | UM, Sec. 4.6.1, p. 44 | "The naming convention is given by the central wavelength of the corresponding setting" |
| Setting gaps | 1356-1423 nm, 1854-1908 nm, 2527-2725 nm are never covered |  | UM, Sec. 4.6.1, p. 44 | "1356- 1423nm, 1854-1908nm, and 2527-2725nm" |
| Order tables | 197 order rows (setting, order, wavelength range on each of the three detectors) for the 29 settings |  | UM, Table 20, pp. 90-95 | "Table 20: Wavelength coverage of CRIRES settings for the three detectors" |

### Resolving power and other performance

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Resolving power, design | R about 100,000 (0.2 arcsec) and 50,000 (0.4 arcsec) |  | D23, Sec. 3.2, p. 3 | "0.2” (resolving power ∼100,000) and a 0.4” slit (resolving power ∼50,000)" |
| Minimum R guaranteed | 86,000 (0.2 arcsec) and 43,000 (0.4 arcsec) |  | UM, Sec. 3.1.1, p. 10 | "0.2” (minimum resolving power 86,000) and a 0.4” slit (minimum resolving power 43,000)" |
| R measured, H1582 | minimum 100,000; average 104,800 +- 2600 (OH sky lines, 0.2 arcsec, MEASURED) |  | UM, Sec. 4.6.8, p. 49 | "H1582 wavelength setting: minimum R = 100,000; average R = 104,800 ± 2600" |
| R measured, K2148 | minimum 92,000; average 96,500 +- 3200 (OH sky lines, 0.2 arcsec, MEASURED) |  | UM, Sec. 4.6.8, p. 49 | "K2148 wavelength setting: minimum R = 92,000; average R = 96,500 ± 3200" |
| R at the lowest echelle angles | as low as 86,000 (L3244, L3262, M4187, M4211, M4266); at least 92,000 in all other settings |  | UM, Sec. 4.6.8, p. 49 | "can exhibit minimum spectral resolving power values as low as R = 86,000 (0.2” slit)" |
| R with a good AO PSF | around 110,000 |  | UM, Sec. 4.6.8, p. 49 | "Higher resolutions - consistently around 110,000 - have been achieved for good AO corrections" |
| Dispersion, K band | about 0.9 km/s per pixel |  | H22, Sec. 2, p. 4 | "The dispersion in the K-band corresponds to around ∼0.9 km s−1 per pixel" |
| Spot size used for the design | 60 micron squares = the 0.2 arcsec slit (the circles mark the diffraction FWHM) |  | O14, Sec. 4, p. 4 | "The size of the squares is 60 microns. This corresponds to the width of the narrowest slit (0.2”)" |
| Throughput | 10-15% higher than the original CRIRES (preliminary, AO, 0.4 arcsec) |  | D23, Sec. 4.8, p. 12 | "the throughput is found to be about 10-15% higher than the original CRIRES instrument" |
| Era | in operation since 1 October 2021 (installed at UT3 early 2020); the original CRIRES ran 2006-2014 at UT1 |  | D23, Sec. 2, p. 3; Sec. 1 | "After commissioning, the CRIRES+ in-strument has been in regular operations since 1 October 2021" |

## Optical layout (from the published figures)

Figures: O14 Fig. 2 (PDF p. 3; a 3D perspective ray-trace of the whole cold bench), O14 Fig. 3 (the spectral format), D23 Fig. 2 (PDF p. 4; a schematic of the whole instrument), D23 Figs 3-4 (the CDU assembly and its CAD), UM Fig. 4 and Fig. 36 (UM p. 13; p. 49 is the H1582 mosaic, read for order spacing). Scale used for MEASURED values: O14 Fig. 2 rendered at 250 dpi (crop pixels), the grating-to-lens-1 distance of 330 mm (SOURCED, Table 14) = 281 px gives 1.17 mm/px; check: the echelle reads 345 px = 405 mm against the stated 400 mm. The figure is a perspective view, so distances along other directions are uncertain by up to about 40% (the lens group to Spec-Flat1 reads 230 mm against 387 mm sourced); every MEASURED distance below is rough.

| element (in order along the beam) | reading | tag |
|---|---|---|
| telescope f/15 focus, slit mask (0.2 and 0.4 arcsec) just before the dichroic entrance window (30 deg cone axis) | slit unit at the f/15 focus; light off the slit goes to the slit viewer (guider optics G-M1, G-M2, G-Camera) | SOURCED (D23 Sec. 3.2; O14 Sec. 2) |
| off-axis parabola (R 1500, f 750 mm), 50 mm beam | slit to parabola reads 688 mm in-plane against 753 mm expected (f + h^2/4f with h = 91.7 mm); parabola stands right of the slit | SOURCED f; MEASURED 688 mm (rough) |
| Flat1 (fold), long-pass filter, Flat2 (fold) | a W shape: parabola to Flat1 about 400 mm, Flat1 to Flat2 about 400 mm, Flat2 to the grating about 540 mm | MEASURED (rough) |
| cross-disperser reflection grating (wheel of six; the wheel axis is not drawn) | 330 mm from lens 1 | SOURCED |
| lens-triplet camera (BaF2, ZnSe, LiF2), f = 400 mm (DERIVED), f/8 | lens spacings 3.3 and 56.6 mm; lens 3 to Spec-Flat1 387.3 mm | SOURCED |
| field stop, Spec-Flat1 (52 x 12 mm) | at the f/8 focus, beside the detector end of the echelle | SOURCED |
| TMA (M1, M2, M3, double pass) collimates a beam onto the echelle (400 x 200 mm, long axis near vertical in the figure, 2.5 deg from it) | the beam from the TMA to the echelle center reads about 630 mm; echelle surface normal about 54 deg to the beam in the plane of the figure (the real incidence is 62-68 deg once the out-of-plane view is allowed for) | MEASURED (rough) |
| echelle returns the beam through the TMA (as camera) to the detector mosaic, next to the field stop | the mosaic is not drawn in O14 Fig. 2; D23 Fig. 2 draws it beside the field stop | SOURCED (D23 Fig. 2) |

**Collimator on-axis or off-axis (deploy gate): OFF-AXIS (INFERRED).** The slit is not in the returning beam. The pre-slit collimator is an off-axis parabola ("Clear aperture D=66 de-centered by 91.7", O14 Table 3). The spectrograph collimator is the TMA: the field stop and the 52 x 12 mm Spec-Flat1 stand at its entrance beside the 200 mm beam, and the detector mosaic sits next to them (D23 Fig. 2, O14 Fig. 2); a TMA that works in double pass with the focal surfaces outside the beam has no central obscuration (no source says "obscuration" or "on-axis"). The tilt is not published: SCHEMATIC, use the explorer's automatic tilt.

## Recommended preset and settings

One Preset-menu line "VLT / CRIRES+" with the 0.2 arcsec slit and these Settings (short names), each a wavelength setting of Table 20. They are the settings the sources single out; no usage statistics were found, so this is a judgment:
- **K2192** (default): the gas-cell radial-velocity setting ("most of the other RV observations were done using the AO mode as well as the gas cell and K2192 setting", D23 Sec. 4.10); the K band is the band the explorer's NIRSPEC and the other cold echelles use, so it compares directly.
- **H1582**: R measured on OH lines (UM Sec. 4.6.8), the setting of UM Fig. 36 (the mosaic picture) and the polarimetry tests (UM Table 4 uses Y1029, J1228, H1582, K2166).
- **K2148**: the second setting with a measured R, and the lowest echelle angle among the K settings.
- **Y1029** and **J1228**: the Y and J settings named in UM Table 4 and D23 Fig. 23 (J1228).
- **L3262** and **M4266**: the L and M settings at the lowest echelle angle (R as low as 86,000); the M band holds the CO fundamental. Both need LAM_MAX raised.
Setting names: "K2192, 0.2″", "H1582, 0.2″", "K2148, 0.2″", "Y1029, 0.2″", "J1228, 0.2″", "L3262, 0.2″", "M4266, 0.2″" (11 characters at most). The 0.4 arcsec slit is the same preset with slitW 0.4 (R about half, UM Sec. 4.6.8).

**Explorer state (echelle mode); EFFECTIVE values are marked, with the fits in Notes.**

| field | value | basis |
|---|---|---|
| D, F | 8.0 m, F = 8 | the f/8 field stop is the slit of the TMA spectrograph (the f/15 slit is re-imaged at f/8 by the 400 mm camera); slit 0.2 arcsec = 0.0621 mm at f/8 on 8 m (DERIVED). Do NOT enter 8000 mm at f/15: the explorer's slit would then sit before the cross-disperser |
| slitW, slitL | 0.2 arcsec, 10 arcsec | SOURCED |
| nObj | 1 | INFERRED |
| col, W | mirror (TMA, off-axis), W = 175 mm, so f_col = 8 x 175 = 1400 mm | EFFECTIVE (200 mm in K04: see Conflicts) |
| fcam, cam | 1448 mm (the TMA again), cam "mirror" (closest drawing; the TMA is all-reflective) | EFFECTIVE |
| eG, eDelta, gamma, theta | 31.6 /mm, 63.5 deg, 0, 0 | SOURCED; gamma, theta NOT FOUND (zero) |
| eTilt | per setting, to put the sourced central wavelength in the sourced order: asin(m lambda G / 2) - 63.5 deg | EFFECTIVE (table below) |
| gLen | 400 mm | SOURCED (blank size) |
| xd, xG, xPsi | "grating"; per band, the first-order groove density x 400 / 1400: Y 137.1, J 102.9, H 65.7, K 37.1, L 17.1, M 11.4 /mm; xPsi 0 | EFFECTIVE (the real XD is BEFORE the echelle, in an f/8 camera of 400 mm; its angular dispersion seen by the TMA is that of a grating of G x f_xd / f_col) |
| lamC | the setting's reference wavelength (nm) | SOURCED (UM Table 20 col. 1, e.g. 1582.339) |
| Nx, Ny, pix | 6349, 2048, 18 micron | SOURCED/DERIVED (the 205 px of gaps are spanned, not removed) |
| filt (order-sorting band) | Y [9480, 11200]; J [11160, 13560]; H [14230, 18540]; K [19080, 25270]; L [28100, 41500]; M [33400, 53000] A | the "point-source" coverage of the band (D23 Table 2, UM Table 5), which is where the filter wheel (#1 Y-J, #2 H-K, #3 L-M) and the grating blaze leave light; the filters' own transmissions are in the parameter table |

| setting | ref lambda (nm) | m_ref | echelle alpha, gamma = 0 (deg) | eTilt (deg) | xG (/mm) |
|---|---|---|---|---|---|
| Y1029 | 1029.310 | 55 | 63.44 | -0.06 | 137.1 |
| J1228 | 1228.488 | 46 | 63.24 | -0.26 | 102.9 |
| H1582 | 1582.339 | 36 | 64.16 | 0.66 | 65.7 |
| K2192 | 2192.449 | 26 | 64.24 | 0.74 | 37.1 |
| K2148 | 2147.646 | 26 | 61.92 | -1.58 | 37.1 |
| L3262 | 3262.140 | 17 | 61.19 | -2.31 | 17.1 |
| M4266 | 4265.706 | 13 | 61.18 | -2.32 | 11.4 |

## Published performance (validation targets) and what the model gives

Model values come from `IX.design` (the repository's physics.js; for L and M a scratch copy with LAM_MAX = 6.0) with the state above (script `py/final.js` in the scratch directory). "Circular" marks quantities used to fit the state.

| quantity | published | model | status |
|---|---|---|---|
| pixel scale along the slit | 0.056 arcsec/px (UM Sec. 4.6.7) | 0.0561 | circular (W is fitted to it) |
| dispersion A/px at the middle of each order | Table 20 det. 2: (hi - lo)/2047 | ratio model/table 1.000 +- 0.005 over all 29 settings' orders | fcam fitted once (global); the constancy across 29 settings, orders and 5 bands is an independent test of the grating equation and of m lambda from the table |
| order blue and red ends (ordLo, ordHi) | Table 20, det. 1 start and det. 3 end | agree to 0.1-0.5 nm at both ends for every order of Y1029, J1228, H1582, K2192, K2148, L3262, M4266 (listing below) | the setting center is fitted (the reference order's center is circular); the other orders and both ends are independent of the per-setting fit |
| R, 0.2 arcsec | min 92,000 (most settings), 86,000 (lowest angles); H1582 mean 104,800 +- 2600; K2148 mean 96,500 +- 3200 (OH lines, MEASURED) | H1582 91,286; K2148 81,492; K2192 89,951; L3262 75,620; M4266 71,871 | misses of 13-16% low: with the fitted 175 mm beam the geometric R is below the measured; with the 200 mm beam of K04 the model gives 104,000 (H1582) and 93,000 (K2148) but the pixel scale then reads 0.064. Measured R uses a narrow AO PSF that can be below the slit (UM: around 110,000). Info, not scored |
| R ratio between settings | H1582 / K2148 = 1.086 measured | 1.120 | R scales with tan(alpha); alpha from m lambda (EFFECTIVE) |
| number of orders per setting | Y1029 9; J1228 8; H1582 8; K2192 7; K2148 6; L3262 6; M4266 6 (UM Table 20, vignetted ones marked) | 10; 10; 10; 8; 9; 9; 7 | the model keeps orders whose center is on the chip within 2%, the instrument drops edge orders; info |
| order spacing, H1582 (read from UM Fig. 36, MEASURED, +-6 px) | orders 39..32 at y = 1868, 1668, 1450, 1221, 986, 728, 458, 166 px | the spacing 36-35 is 240 px (model) against 235 (read) | sets xG (EFFECTIVE), so circular |
| slit length | 10 arcsec = 179 px | 179 px | circular |
| coverage per setting | Y1029 949.6-1120.5 nm; J1228 1118.3-1326.8; H1582 1445.8-1796.4; K2192 1945.9-2501.0; K2148 1972.3-2452.2; L3262 2885.6-4003.1; M4266 3426.6-5094.7 (nm, Table 20) | within 0.5 nm per order, see listing | |
| measured through-slit gaps between detectors | 105 and 100 px (UM Sec. 3.1.4) | not modeled (one chip, Nx = 6349) | |

Order ends, model against Table 20 (nm; order: model lo-hi / table det.1 lo to det.3 hi):

- Y1029: 59: 949.7-968.6 / 949.6-968.8; 58: 966.1-985.3 / 965.9-985.5; 57: 983.0-1002.6 / 982.9-1002.8; 56: 1000.6-1020.5 / 1000.4-1020.7; 55: 1018.8-1039.1 / 1018.6-1039.2; 54: 1037.6-1058.3 / 1037.5-1058.4; 53: 1057.2-1078.3 / 1057.0-1078.4; 52: 1077.5-1099.0 / 1077.4-1099.1; 51: 1098.7-1120.5 / 1098.4-1120.5
- J1228: 50: 1118.5-1141.0 / 1118.3-1141.1; 49: 1141.4-1164.3 / 1141.2-1164.4; 48: 1165.1-1188.5 / 1164.9-1188.7; 47: 1189.9-1213.8 / 1189.7-1214.0; 46: 1215.8-1240.2 / 1215.6-1240.4; 45: 1242.8-1267.8 / 1242.6-1267.9; 44: 1271.1-1296.6 / 1270.8-1296.7; 43: 1300.6-1326.8 / 1300.4-1326.8
- H1582: 39: 1446.1-1474.0 / 1445.8-1474.2; 38: 1484.2-1512.8 / 1483.9-1513.0; 37: 1524.3-1553.7 / 1524.0-1553.8; 36: 1566.6-1596.8 / 1566.4-1597.0; 35: 1611.4-1642.5 / 1611.1-1642.6; 34: 1658.8-1690.8 / 1658.5-1690.9; 33: 1709.0-1742.0 / 1708.7-1742.0; 32: 1762.4-1775.6 / 1762.0-1796.4
- K2192: 29: 1946.2-1983.6 / 1945.9-1983.9; 28: 2015.7-2054.4 / 2015.4-2054.7; 27: 2090.3-2130.5 / 2090.1-2130.8; 26: 2170.7-2212.5 / 2170.5-2212.8; 25: 2257.6-2300.9 / 2257.3-2301.2; 24: 2351.6-2396.8 / 2351.3-2397.0; 23: 2453.9-2501.0 / 2453.4-2501.0
- K2148: 28: 1972.5-2014.4 / 1972.3-2014.7; 27: 2045.5-2089.1 / 2045.3-2089.4; 26: 2124.2-2169.4 / 2124.0-2169.7; 25: 2209.2-2256.2 / 2209.0-2256.4; 24: 2301.2-2350.2 / 2300.9-2350.3; 23: 2401.3-2452.4 / 2400.9-2452.2
- L3262: 19: 2886.0-2949.3 / 2885.6-2949.7; 18: 3046.3-3113.1 / 3046.0-3113.6; 17: 3225.5-3296.2 / 3225.1-3296.7; 16: 3427.1-3502.3 / 3426.7-3502.6; 15: 3655.6-3735.7 / 3655.0-3736.0; 14: 3916.7-4001.3 / 3915.9-4003.1
- M4266: 16: 3427.0-3502.1 / 3426.6-3502.6; 15: 3655.4-3735.6 / 3655.2-3736.2; 14: 3916.5-4002.4 / 3916.3-4003.1; 13: 4217.8-4310.3 / 4217.7-4311.1; 12: 4569.3-4669.5 / 4569.2-4670.3; 11: 4984.7-5094.0 / 4984.5-5094.7

Note the last order of H1582 (32): the table gives 1762.0 to 1796.4 nm (it extends onto det. 3); the model clips it at 1775.6 nm because the order leaves the chip in y.

## NOT FOUND

- The TMA focal length and the beam diameter of the CRIRES+ spectrograph: only the original CRIRES gives "200mm" (K04, for a different pre-slit f-ratio). Fitted values are in Notes (EFFECTIVE).
- The echelle gamma (off-plane) and theta (in-plane half-angle), and the ruled (not blank) size of the echelle.
- The as-built cross-disperser gratings (groove densities, blaze, ruled sizes): Follert et al. 2016, SPIE 9912, 99122B, "Characterizing the cross dispersion reflection gratings of CRIRES+" (ADS 2016SPIE.9912E..2BF; DOI 10.1117/12.2232569) is behind SPIE; only the design values (O14 Table 1) are used. The CDU angles per setting (the angle between incident and diffracted beams) are not published.
- The cross-disperser unit design papers behind the SPIE paywall: Follert et al. 2014, SPIE 9147, 914719, "CRIRES+: a cross-dispersed high-resolution infrared spectrograph for the ESO VLT" (ADS 2014SPIE.9147E..19F, DOI 10.1117/12.2054197); Lizon et al. 2014, SPIE 9147, 91477S (ADS 2014SPIE.9147E..7SL, DOI 10.1117/12.2054800, opto-mechanical design of the CDU); Dorn et al. 2016, SPIE 9908, 99080I (ADS 2016SPIE.9908E..0ID); Dorn et al. 2022, SPIE 12184, 121841F (ADS 2022SPIE12184E..1FD); Oliva et al. 2012, SPIE 8446, 84462N (ADS 2012SPIE.8446E..2NO). No arXiv versions exist except O14. The user can supply these PDFs.
- The collimator tilt and the fold geometry of the TMA (vertex spacings, off-axis offsets); the echelle-to-TMA distance. Only a perspective figure (O14 Fig. 2) exists.
- The vertical (cross-dispersion) position of each order on the chip as a table; only Figure 36 of UM (H1582) was read.
- Usage statistics of the settings (no source); the recommendation of settings is a judgment from the sources.

## Conflicts between sources

- Pixel scale along the slit: 0.056 arcsec/px (UM Sec. 4.6.7, current) vs 0.059 (H22, K band, from P109.4 era) vs 0.086 arcsec at 27 micron = 0.0573 at 18 micron for the original CRIRES (UMo). Use 0.056 (current manual, whose change log lists "Pixel scale of science detectors updated").
- Minimum R: 80,000 and 40,000 (H22, quoting the P109.4 manual) vs 86,000 and 43,000 (UM P116.1, after the March 2022 focus optimization) vs "minimum R = 92,000 in most settings" (UM Sec. 4.6.8, measured). Use the P116.1 values.
- Echelle angle vs the order table: the quoted angles (H1582 66.3 deg, K2148 64.0 deg) do not follow m lambda = 2 d sin(angle) cos(gamma) with one gamma: the setting centers give sin(alpha) cos(gamma) = 0.8999 (H1582, order 36 at 1582.339 nm) and 0.8824 (K2148, order 26 at 2147.646 nm), i.e. 64.2 and 61.9 deg if gamma = 0, 2.1 deg below the quoted angles in both cases (or cos(gamma) = 0.982, gamma = 10.9 deg for both). The quoted angle is an encoder angle or the model includes an unpublished offset; the explorer cannot use it. Fig. 32 of UM (K band, "echelle angle=65.5") would match K2217 (65.6 deg at gamma = 0) but the setting is not named.
- Beam on the echelle: 200 mm (K04, original CRIRES, f/7.5 pre-slit) vs about 175 mm from the pixel scale, dispersion and order spacing together (Notes). A 200 mm beam at the 63.5 deg blaze has a 447 mm footprint on a 400 mm grating; the projected size of the grating, 400 cos(63.5 deg) = 179 mm, is close to the fitted beam.
- Instrument name: the manual calls the upgraded instrument "CRIRES" and the original "oCRIRES"; papers write "CRIRES+".

## Notes

- **What the model cannot represent.** (1) The cross-disperser is BEFORE the echelle (slit, parabola, grating, lens camera, field stop, then the spectrograph); the explorer puts the cross-disperser after the echelle, so the drawing shows an equivalent grating of groove density G x 400/1400 in the TMA beam (it reproduces the order spacing, not the layout). (2) L and M need LAM_MAX > 2.6 micron. (3) The three detectors with gaps are one chip (Nx = 6349); the orders cross the gaps and the table's per-detector ranges cannot be shown. (4) The orders and slit are tilted on the detector (D23 Sec. 4.7: "spectral orders are tilted on the detector mosaic"; the slit tilt varies with wavelength); the explorer's slit image is not tilted. (5) The echelle angle is not the geometric angle. (6) The spectropolarimetry unit, the AO system and the jitter mirror are not modeled.
- **The EFFECTIVE fit of the spectrograph (TMA).** The unpublished TMA focal length f and beam W enter three published numbers, each of which gives one combination: (a) dispersion: the model at f_cam = 1600 mm gives 0.905 of the Table 20 A/px in every one of the 29 settings, so f_cam = 1600 x 0.905 = 1448 mm (the dispersion table varies by 10% across a 6144 px order, 0.0500 to 0.0451 A/px in H1582 order 36, and the model follows it); (b) pixel scale: 206265 x 0.018 mm x W / (8000 mm x f_cam) = 0.056 gives W = 175 mm (0.059 of H22 would give 184 mm); (c) order spacing: the spacing read from Fig. 36 is 1.15 times the model's with G x 0.25, so the XD seen by the TMA has G x 0.288 = G x f_xd / f_col, with f_xd = 400 mm (DERIVED) giving f_col = 1390 mm, and W x 8 = 1400 mm. The three agree on f = 1.4 m: a TMA of about f/8 x 175 mm. Because the three are fitted jointly, a 200 mm beam (K04: that was the original f/7.5 pre-slit optics, f = 1500 mm) is not excluded; it would need f_cam = 1448 mm and f_col = 1600 mm, which breaks the pixel scale (0.064 instead of 0.056).
- **Order sorting.** Order numbers: Y 59-51, J 50-42, H 39-32, K 29-23, L 20-14, M 16-11 (Table 20). The design paper's Table 1 gives 50-59, 42-50, 31-38, 22-29, 14-20, 10-16 for the bands, a little different from the as-built settings (the design echelle at its blaze, UM Table 20 with the real echelle angles).
- **Time:** the preset is the upgraded instrument (2021 onward, first light 2020). The original CRIRES (UT1, 4096 x 512 pixels of 27 micron, 40 arcsec slit, single order with a ZnSe prism pre-disperser, 2006-2014) is a different instrument and is not entered.
- **Echelle angle and R.** The slit-limited R scales with tan(alpha): with alpha from m lambda (gamma = 0) the model gives R = 91,000 (H1582, alpha 64.2) and 81,500 (K2148, alpha 61.9); the ratio 1.12 compares with 1.086 measured. The lowest echelle angles (L3244, L3262, M4187, M4211, M4266, alpha 59-61 deg here) have the lowest R in the manual, as in the model (84,000 to 76,000 at the 200 mm beam).
- **H and K cross-disperser blaze.** The design K grating (130 /mm, 8.5 deg) blazes at 2.27 micron: it favors the K2192 and K2217 settings; the H grating (230 /mm, 11 deg) at 1.66 micron.
- **Spectral resolving power definition.** UM states R for the 0.2 arcsec slit with full slit illumination; the 0.4 arcsec R is "typically better than half".

