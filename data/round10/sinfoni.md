# Round 10 (2026-11-18): VLT SINFONI, the AO-fed near-infrared image-slicer spectrometer (SPIFFI behind MACAO; id `sinfoni`)

SINFONI (SINgle Faint Object Near-IR Investigation) is the adaptive-optics module MACAO feeding the integral-field spectrometer SPIFFI (the MPE image slicer). First light July 2004 on UT4, regular service until 25 June 2019 (UT3 from Feb 2019), decommissioned end of June 2019; SPIFFI lives on as SPIFFIER inside ERIS on UT4. Same rules as rounds 1-9 (data/presets_research.md; format of data/round6/m2fs_ifum.md and data/round9/nirspec.md): every number comes from a document saved unmodified under `rawdata/presets/sinfoni/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **MEASURED** marks values read from a figure (method and scale stated); **INFERRED** marks a reading that no source states; **EFFECTIVE** marks values chosen so that the explorer reproduces published performance (none are used here: every optical value is sourced or derived). Quotes were machine-checked (126 quote pieces, 0 failures) against the `pdftotext -layout`, `-raw` and default-order text of each PDF and the tag-stripped text of each HTML page, with whitespace, case, quotes, dashes, minus signs, ligatures, the micro sign and hyphenation normalized (all punctuation is dropped on both sides); " ... " joins non-adjacent pieces. All PDFs have a clean text layer. The 8 MEASURED entries read Fig. 2 of Eisenhauer et al. 2000 and have no quote. Machine-readable twin: `data/round10/sinfoni.json`.

## Completeness summary

**Nearly complete; two gaps matter.** (1) The ruled blaze angle and the manufacturer's groove table are not published; the grating spacings (5.758, 7.747, 9.684 and 9.961 um at 80 K), the orders (2, 2, 2, 1) and the 45 deg camera-collimator angle are in George et al. 2017 (the incidence angles of its Table 2 follow from them to 0.001 deg). (2) The 2k camera's layout (five lenses and a fold, f/2.8) is described only by Kroes et al. 2008 (SPIE 7018, 'Opto-mechanical design for transmission optics in cryogenic IR instrumentation', ADS 2008SPIE.7018E..2DK), a paywalled SPIE paper that could not be fetched; its focal length is sourced (342 mm, George et al. 2017; 'approximately 350 mm', Eisenhauer et al. 2002) and confirmed to 0.1 percent by the dispersion of all four gratings, but the drawing of the camera (the 1k camera is what Fig. 2 shows) is the 1k camera's. Also not fetched: Bonnet et al. 2004, The Messenger 117, 17 (ADS 2004Msngr.117...17B; ESO's PDF link returns 404) and Iserlohe et al. 2004, SPIE 5492, 1123 (ADS 2004SPIE.5492.1123I, on-sky performance); the ESO user manual and the design papers carry the same numbers.

**On/off-axis verdict: OFF-AXIS.** The collimator is a three-mirror anastigmat of one sphere and two off-axis ellipses, 'operated 11.5 deg off-axis' (Eisenhauer et al. 2000), 'unobscured in comparison to an on-axis TMA' (Graeff 2016). The slit (the image slicer) is not in the returning beam: Fig. 2 shows the beam running slicer, M1, M2, M3, grating, camera round the bench, folding at each mirror (155, 146 and 159 deg MEASURED). colTilt 11.5 (SOURCED).

**Recommended preset: one line 'VLT / SINFONI' with six Settings, default 'K, 100 mas'** (below). The pixel scale is chosen for what the explorer represents. I found no document giving usage statistics, so 'most used' cannot be sourced; the choice is made on three sourced facts: (i) K and H+K at 100 mas are the cases where the explorer's slit-limited R lands on the measured R (4771 against 4670 measured in 2016 and 5090 at commissioning; H+K 1926 against 1940); (ii) 100 mas is the middle scale: its 38 mm beam is large enough that the model's diffraction cap does not bite (it does at 25 mas, 9.5 mm) and small enough that the measured R is not degraded as at 250 mas (K: 4070 against 4670); (iii) ESO recommends 250 mas only 'without adaptive optics' and the Galactic Center S-star work used the 25 mas scale with the K grating (Eisenhauer et al. 2005), so both are offered as Settings.

**Entered as an image slicer, as KCWI and MUSE are** (web/presets.js): slit = the slice width on the sky (0.25, 0.1 or 0.025 arcsec; 300 um on the slicer for every scale), slit length along the slices 8.0, 3.2 or 0.8 arcsec (each slice is 64 detector pixels long), spectra per detector nObj = 32 x 64 = 2048 (EM: 'one obtains 32 x 64 = 2048 spectra'). The three scales differ only in the focal ratio into the slicer: F = 17.1 x (1.78, 4.45, 17.8) = 30.44, 76.1, 304.4 on the 8115 mm Cassegrain pupil, so the collimator (2886.5 mm) sees beams of 94.8, 37.9 and 9.5 mm.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| E03 | Eisenhauer, F., Bonnet, H., Abuter, R., et al. 2003, Proc. SPIE 4841, 1548, "SINFONI - Integral Field Spectroscopy at 50 milli-arcsecond resolution with the ESO VLT" (ADS 2003SPIE.4841.1548E; title checked on ADS; arXiv:astro-ph/0306191; author reprint with SPIE permission; 10 pp; the 1k-detector and 1k-camera state of Aug 2002) | `eisenhauer2003.pdf` | https://arxiv.org/pdf/astro-ph/0306191 |
| E00 | Eisenhauer, F., Tecza, M., Mengel, S., et al. 2000, Proc. SPIE 4008, 289, "Imaging the Universe in 3D with the VLT: The Next Generation Field Spectrometer SPIFFI" (ADS 2000SPIE.4008..289E; arXiv:astro-ph/0008296; 9 pp; the optical DESIGN paper: pre-optics, slicer, TMA collimator, 1k camera, Figs 1-5) | `eisenhauer2000.pdf` | https://arxiv.org/pdf/astro-ph/0008296 |
| E02 | Eisenhauer, F., van der Werf, P., Thatte, N., et al. 2002, "Scientific Potential of Enhancing the Integral-Field Spectrometer SPIFFI with a Large Detector and High Spectral Resolution", ESO Workshop 'Scientific Drivers for ESO Future VLT/VLTI Instrumentation' (ADS 2002sdef.conf..149E; arXiv:astro-ph/0109285; the 2k-detector and 2k-camera plan, 8 pp) | `eisenhauer2002.pdf` | https://arxiv.org/pdf/astro-ph/0109285 |
| T00 | Tecza, M., Thatte, N., Eisenhauer, F., et al. 2000, Proc. SPIE 4008, 1344, "SPIFFI image slicer: revival of image slicing with plane mirrors" (ADS 2000SPIE.4008.1344T; arXiv:astro-ph/0008322; 7 pp) | `tecza2000.pdf` | https://arxiv.org/pdf/astro-ph/0008322 |
| M00 | Mengel, S., Eisenhauer, F., Tecza, M., et al. 2000, Proc. SPIE 4005, 301, "New era of spectroscopy: SINFONI NIR integral field spectroscopy at the diffraction limit of an 8-m telescope" (ADS 2000SPIE.4005..301M; arXiv:astro-ph/0008398; saved, one throughput figure cited) | `mengel2000.pdf` | https://arxiv.org/pdf/astro-ph/0008398 |
| E05 | Eisenhauer, F., Genzel, R., Alexander, T., et al. 2005, ApJ 628, 246, "SINFONI in the Galactic Center: Young Stars and Infrared Flares in the Central Light-Month" (ADS 2005ApJ...628..246E; arXiv:astro-ph/0502129; the first S-star observations: 25 mas scale, K and H+K gratings) | `eisenhauer2005.pdf` | https://arxiv.org/pdf/astro-ph/0502129 |
| G16 | George, E. M., Buron, A., Davies, R., et al. 2016, Proc. SPIE 9908, 99080G, "Making SPIFFI SPIFFIER: upgrade of the SPIFFI instrument for use in ERIS and performance analysis from the early upgrade" (ADS 2016SPIE.9908E..0GG; arXiv:1608.02457; layout Fig. 1, resolution Table 3, Jan 2016 upgrade) | `george2016.pdf` | https://arxiv.org/pdf/1608.02457 |
| G17 | George, E. M., Eisenhauer, F., Feuchtgruber, H., et al. 2017, J. Astron. Telesc. Instrum. Syst. 3, 035002, "Complex spectral line profiles resulting from cryogenic deformation of the SINFONI/SPIFFI diffraction gratings" (ADS 2017JATIS...3c5002G; arXiv:1707.08923; Table 2 holds the grating spacings, orders and incidence angles of the CODE V model) | `george2017.pdf` | https://arxiv.org/pdf/1707.08923 |
| GR | Gräff, D. 2016, "Upgrade and Characterization of the SPIFFI/SINFONI optics" (ADS 2016arXiv161204680G; arXiv:1612.04680; a Master's thesis, TU Munich/MPE, August 2016, 119 pp; Ch. 1 optical layout, Ch. 3 TMA mirrors, Ch. 4 performance; 41 MB) | `graeff2016.pdf` | https://arxiv.org/pdf/1612.04680 |
| EM | ESO SINFONI User Manual, VLT-MAN-ESO-14700-3517, Issue 103.1, 2019-03-13 (the last issue, P103; Sec. 2.2 modes, Sec. 8 AO module, Sec. 9 SPIFFI, Sec. 13 measured spectral resolution) | `eso_sinfoni_manual_P103.1.pdf` | https://www.eso.org/sci/facilities/paranal/instruments/sinfoni/doc/VLT-MAN-ESO-14700-3517-P103.1.pdf |
| EM89 | ESO SINFONI User Manual, VLT-MAN-ESO-14700-3517, Version 89, 2011-08-26 (the commissioning-era measured-resolution table, identical to Issue 103.1) | `eso_sinfoni_manual_v89.pdf` | https://www.eso.org/sci/facilities/paranal/instruments/sinfoni/doc/VLT-MAN-ESO-14700-3517_v89.pdf |
| PU | ESO, 'SINFONI post upgrade update v1.0', G. Hau and the SINFONI Instrument Operations Team, 2016-03-14 (the Dec 2015 - Jan 2016 intervention; old and new resolving power per band) | `eso_sinfoni_postupgrade_v1.pdf` | https://www.eso.org/sci/facilities/paranal/instruments/sinfoni/doc/SINFONI_Post_Upgrade_Update_v1.0.pdf |
| EH | ESO SINFONI 'History' page (decommissioned-instruments section; last update 03.10.19; saved 2026-11-18) | `eso_sinfoni_history.html` | https://www.eso.org/sci/facilities/paranal/decommissioned/sinfoni/history.html |
| EO | ESO SINFONI 'Overview' page (decommissioned-instruments section; saved 2026-11-18) | `eso_sinfoni_overview.html` | https://www.eso.org/sci/facilities/paranal/decommissioned/sinfoni/overview.html |
| VLT | ESO, 'Requirements for VLT Unit Telescope Instruments', VLT-SPE-ESO-10000-2723 Issue 1, 2005-03-18 (Table 2: the Cassegrain focus; copy shared with the UVES record) | `VLT-SPE-ESO-10000-2723_is1_Requirements_for_VLT_UT_Instruments.pdf` | https://www.eso.org/sci/facilities/develop/instruments/ (as saved under rawdata/presets/uves/) |

Saved but not cited: `eso_sinfoni_doc.html`, `eso_sinfoni_inst.html` (ESO page indexes that give the manual links). Not obtained (paywall or dead link): Kroes et al. 2008 (SPIE 7018, 2008SPIE.7018E..2DK), Bonnet et al. 2004 (Messenger 117, 17; 2004Msngr.117...17B), Iserlohe et al. 2004 (SPIE 5492, 1123; 2004SPIE.5492.1123I), Tecza et al. 2003 (SPIE 4842, 375; slicer manufacture), Bonnet et al. 2003 (SPIE 4839, 329; MACAO for SINFONI).

## Parameters


### Telescope, feed and pre-optics

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Telescope and focus | Cassegrain focus of a VLT Unit Telescope; the AO module and the SPIFFI cryostat are hung below the Cassegrain adapter |  | E03, Sec. 1, pdf p. 2 | The instrument is mounted at the Cassegrain focus, and thus exposed to varying gravity loads |
| UT of service | first light on UT4 in July 2004; moved to UT3 in Feb 2019; decommissioned end of June 2019 (last science exposures 25 June 2019) |  | EH, History page | July 2004: SINFONI saw first light at UT4. ... After moving to UT3, the system performance is very similar to that at UT4. ... 30 June 2019: SINFONI has been decommissioned at the end of June 2019. The last science observations were taken on June 25. |
| Cassegrain pupil | 8115.0 | mm | VLT, Table 2, p. 7, pdf p. 13 | Entrance pupil diameter 8115.0 mm |
| Cassegrain focal ratio | 13.4106 |  | VLT, Table 2, p. 7, pdf p. 13 | Focal ratio 13.4106 |
| Cassegrain plate scale | 528 | um/arcsec | VLT, Table 2, p. 7, pdf p. 13 | Image scale slightly field dependent 528 µm/arcsec |
| AO module beams | input f/13.4, output f/17.1 (flat M1, off-axis parabola M2, 60-electrode bimorph deformable mirror M3, off-axis parabola M4, flat M5) |  | EM, Sec. 8.1.2, pdf p. 49 | The input f/13.4 beam is folded by a first flat mirror (M1) and then collimated by an off-axis parabola (M2), creating an image of the pupil on the Deformable Mirror ... f/17.1 focus is then created by a second off-axis parabola (M4) |
| SPIFFI input focal ratio (ALT) | 17.1 |  | GR, Ch. 4, Eq. 4.1, pdf p. 56 | ALT: FSP IF F I /17.1 of the SPIFFI input beam |
| AO module | clone of the ESO MACAO curvature system, 60 elements; the IR science band is transmitted to SPIFFI and 450-950 nm goes to the wavefront sensor |  | E03, Secs 1-2, pdf p. 3 | The science beam (1.05 - 2.45 µm) is transmitted to SPIFFI, and the visible light (450 – 950 nm) is reflected towards the wavefront sensor optical path. |
| Plate scale at the SPIFFI focus | 673.3 | um/arcsec | this record | **DERIVED:** 528 um/arcsec x 17.1 / 13.4106 = 673.3 um/arcsec (the f/13.4106 Cassegrain focus re-imaged at f/17.1 by the AO module; the 8115 mm pupil is kept). |
| Pre-optics: scales | three pre-optics objectives of magnification 17.8, 4.45 and 1.78 giving 0.025, 0.1 and 0.25 arcsec per slice |  | E00, Sec. 2.2, pdf p. 4 | provide three different magnifications (17.8 x, 4.45 x, 1.78 x) with equivalent pixel scales of 0.025 arcsec/pixel, 0.1 arcsec/pixel, and 0.25 arcsec/pixel |
| Pre-optics: scales (user manual) | The choices are 250 mas, 100 mas and 25 mas |  | EM, Nutshell, p. v, pdf p. 5 | The choices are 250 mas, 100 mas and 25 mas |
| Pre-optics: slice width on the sky = slit | 0.25, 0.10 and 0.025 arcsec | arcsec | EM, Sec. 12 (OB templates), pdf p. 64 | The “Spaxel size” is the height of one of the 32 image slices on the sky, which can be 0.025, 0.1 or 0.25 arcsecs |
| Pre-optics: slice width in um at the slicer | 300 | um | E00, Sec. 2.3, pdf p. 5 | The compromise for SPIFFI is a width of 300 µm for the mirrors of the small slicer, thus providing a pseudo long slit of 307.2 mm. |
| Pre-optics: slice width in um (ALT) | 300 | um | E03, Sec. 3.4, pdf p. 9 | ALT: small slicer mirrors, which have a width of only 300 µm |
| Beam at the slicer, seeing scale | f/30 for the 0.25 arcsec slice on an 8 m telescope |  | T00, Sec. 3.1 (slicer efficiency), pdf p. 4 | input beam f-ration of f/30, corresponding to a pixel size of |
| Beam at the slicer, all scales (explorer F) | f/30.44 (250 mas), f/76.1 (100 mas), f/304.4 (25 mas) |  | this record | **DERIVED:** F_slit = 17.1 x magnification: 17.1 x 1.78 = 30.44; 17.1 x 4.45 = 76.1; 17.1 x 17.8 = 304.4. Check: slice width = phi D F / 206265 with D = 8115 mm: 0.25 arcsec -> 0.2994 mm; 0.1 -> 0.2994 mm; 0.025 -> 0.2994 mm (sourced 0.300 mm; the f/30 of T00 agrees with 30.44). |
| Pre-optics collimator focal length (2000 design) | 85.5 | mm | E00, Sec. 2.2, pdf p. 4 | With a focal length of 85.5 mm, the collimator reimages the entrance pupil on a 6.0 mm diameter cold stop. |
| Pre-optics collimator focal length (2016 replacement) | 112.7 | mm | GR, Ch. 4, below Eq. 4.1, pdf p. 56 | fCollimator = 112.7 |
| Cold (Lyot) stop | 6 mm diameter with a central obscuration the size of the secondary |  | E03, Sec. 3.3, pdf p. 7 | The stop has a diameter of 6 mm, and is equipped with a central obscuration with the equivalent size of the telescope secondary mirror. |
| Cold stop (measured free diameter) | free diameter 6.436 mm, obscuration 1.004 mm | mm | GR, Ch. 4, pdf p. 56 | the diameter of the free pupil stop of dfree = 6.436 mm and the diameter of the central obscuration dobscured = 1.004 mm |
| Pre-optics lenses | spherical lenses of barium fluoride and Schott IRG2; telecentric; two or three lenses per objective |  | E00, Sec. 2.2, pdf p. 4 | The preoptics use only spherical lenses made from barium fluoride and IRG2 from Schott. |
| Band filters | J, H, K and H+K filters in a wheel in the collimated beam before the cold stop (order sorting) |  | E03, Sec. 3.3, pdf p. 7 | Just in front of the cold stop is the motorized filter wheel, housing the four band-pass filters, which are required to suppress the unwanted diffraction orders of the gratings. |
| Field of view per scale | 8 x 8, 3 x 3 and 0.8 x 0.8 arcsec (32 slices) | arcsec | EM, Nutshell, p. v, pdf p. 5 | leading to field of views on the sky of |
| Spaxel size on the sky (across x along the slice) | 250 x 125, 100 x 50, 25 x 12.5 mas | mas | EM, Sec. 2.2 table, pdf p. 16 | 125mas×250mas ... 50mas×100mas ... 12.5mas×25mas |
| Spaxel along the slice (ALT) | each slice is imaged on 64 detector pixels, so the spaxel is 1 slice width in y and 0.5 in x |  | EM, Sec. 12 (OB templates), pdf p. 64 | ALT: so that the final spatial element measures 1 Spaxel size in y, and 0.5 Spaxel size in x |
| Slice length on the sky | 8.0, 3.2 and 0.8 arcsec | arcsec | this record | **DERIVED:** Each slice is 64 detector pixels long, i.e. 64 x 0.125 = 8.0 arcsec at 250 mas (EM: 8 x 8 arcsec field), 64 x 0.05 = 3.2 arcsec at 100 mas, 64 x 0.0125 = 0.8 arcsec at 25 mas. The manual rounds the 100 mas field to 3 x 3 arcsec; across the slices it is 32 x 0.1 = 3.2 arcsec. |
| Number of slices | 32 |  | EM, Nutshell, p. v, pdf p. 5 | The SINFONI field of view on the sky is sliced into 32 slitlets. |
| Spectra on the detector | 32 x 64 = 2048 |  | EM, Nutshell, p. v, pdf p. 5 | Each one of the 32 slitlets is imaged onto 64 pixels of the detector. Thus, one obtains 32 × 64 = 2048 spectra of the imaged region of the sky. |
| Sky spider (not offered in service) | three pairs of mirrors reflecting a sky field 19, 38, 58 arcsec away onto the slicer field (E03 quotes 15, 30, 45 arcsec) |  | EM, Sec. 9.6, pdf p. 58 | The projected distances of the sky-positions from the field centre are 19, 38, and 58 arc-seconds. |

### Image slicer

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Type | two stacks of 32 plane mirrors (small slicer at the focus, big slicer rearranging the slitlets), all Zerodur, optically contacted, cryogenic |  | E03, Sec. 3.4, pdf p. 9 | The focus of the pre-optics is located at the so-called small slicer. This part of the image slicer consists of a stack of 32 plane mirrors, which slices the image into slitlets, and separates the light from each slitlet in different directions. A second set of 32 mirrors, the so-called big slicer, collects the light and forms the pseudo-slit. |
| Pseudo-slit length | 307.2 | mm | E00, Sec. 2.3, pdf p. 5 | a width of 300 µm for the mirrors of the small slicer, thus providing a pseudo long slit of 307.2 mm |
| Pseudo-slit length (ALT) | 31 cm long pseudo-slit | mm | EM, Fig. 19 caption, pdf p. 57 | ALT: re-arranges the slitlets into a 31 cm long pseudo-slit |
| Slitlet length at the slicer | 9.6 | mm | GR, Sec. 3.3.1, pdf p. 34 | So the resulting slitlet height is 9.6 mm, corresponding to a resampled pseudo slit of 307.2 mm |
| Slit pattern | two-layer brick wall: 'the pseudo long slit will consist of two truncated slits' |  | E00, Sec. 2.3, pdf p. 5 | the mirrors of the large slicer are aligned in a brick wall pattern. There is no crosstalk at the position of the large slicer, but the pseudo long slit will consist of two truncated slits. |
| Slit width in the spectrograph | 300 | um | this record | **DERIVED:** The slit width is the small-slicer mirror width, 300 um, the same for all three scales (the pre-optics set only how many arcsec fill it); the slicer works at 1:1, since 32 x 32 x 0.3 mm = 307.2 mm. |
| Slit image on the detector | 27 um (J, H, K) and 29 um (H+K), geometric, with the grating's anamorphic factor | um | G17, Sec. 4.1, pdf p. 8 | the slit width geometrically imaged onto the detector is 27 µm using the J, H, and K band gratings and 29 µm using the H+K band grating |
| Slit image on the detector (ALT) | 1.5 pixels (27 um of 18 um pixels) | px | GR, Sec. 4.3, pdf p. 72 | ALT: The image of the one slitlet on the detector is 27µm wide due to anamorphic distortion of the grating. |
| Design FWHM of a line | about 1.6 detector pixels | px | G16, Table 3 caption, pdf p. 10 | The design FWHM of the lines in detector pixels is ∼1.6. |

### Collimator (three-mirror anastigmat)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Type | three-mirror anastigmat: one sphere and two off-axis elliptical mirrors, diamond turned |  | E00, Sec. 2.4, pdf p. 5 | The collimator of the SPIFFI spectrometer is a three mirror anastigmat. It consists of one spherical and two off-axis prolate elliptical mirrors |
| Type (ALT) | M1 concave sphere, M2 convex and M3 concave off-axis ellipses |  | GR, Sec. 1.2.2, pdf p. 17 | ALT: The TMA consists of one concave spherical mirror (M1), an off-axis oblate elliptical convex mirror (M2) and an off-axis oblate elliptical concave mirror (M3). |
| Focal length | 2886.5 | mm | E00, Sec. 2.4, pdf p. 5 | Its nominal focal length is 2886.5 mm. |
| Focal length (ALT) | 2886.5 | mm | GR, Sec. 1.2.2, pdf p. 17 | ALT: The focal length of the collimator is 2886.5 mm. |
| Focal length (CODE V model of G17) | 2873 | mm | G17, Sec. 4.1, pdf p. 8 | The light is collimated by a CODE V lens module with a focal length of 2873 mm (identical to the instrument collimator focal length |
| ON- or OFF-AXIS | OFF-AXIS: used off-axis in aperture and field, unobscured; no element stands in the returning beam |  | E00, Sec. 2.4, pdf p. 5 | The optics is operated 11.5° off-axis. |
| ON- or OFF-AXIS (ALT) | the TMA is used off-axis in aperture and field and is unobscured |  | GR, Sec. 3.1, pdf p. 30 | ALT: The TMA in SPIFFI is used off-axis both in aperture and field. The advantages of a TMA used off-axis are twofold: the system is unobscured in comparison to an on-axis TMA |
| Field along the slit | 6.092 deg for a 307.2 mm slit | deg | E00, Sec. 2.4, pdf p. 5 | large one-dimensional field of 6.092° (slit length: 307.2 mm) |
| M1 prescription | concave sphere, R = 2599.58 mm; 54 mm wide x 344 mm high | mm | GR, Sec. 3.3.1, pdf p. 34 | The radius of the mirror is R = 2599.58 mm. The reflective surface is 54 mm wide and 344 mm high. |
| M2 prescription | convex off-axis ellipse, vertex R = 1368.89 mm, conic k = 2.82; 62 mm x 148 mm | mm | GR, Sec. 3.3.2, pdf p. 36 | a central radius of R = 1368.89 mm and a conic constant of k = 2.82 |
| M3 prescription | concave off-axis ellipse, vertex R = 2648.10 mm, conic k = 6.237; stands close to the pupil | mm | GR, Sec. 3.3.3, pdf p. 41 | radius at the vertex is R = 2648.10 mm and the conic constant is 6.237 |
| Mirror spacing | M1-M2 distance equals M2-M3 distance |  | GR, Sec. 3.1, pdf p. 30 | The distance between M1 and M2 is identical to the distance between M2 and M3. |
| Mirror material and history | Al blanks, gold coated; first set 2001-2003, second set 2004-2016, new set Jan 2016 |  | G16, Sec. 3.3, pdf p. 5 | The original mirrors in SPIFFI were manufactured in the years 2001-2003. |
| Beam diameter at the grating, 250 mas scale | about 125 mm leaving the grating (1k-camera design) | mm | E00, Sec. 2.4, pdf p. 5 | the beam size at the exit of the grating is ≈ 125 mm at the 0.25 arcsec/pixel scale |
| Beam diameter on the collimator and the grating (explorer W) | 94.8 mm (250 mas), 37.9 mm (100 mas), 9.5 mm (25 mas) | mm | this record | **DERIVED:** W = f_col / F_slit = 2886.5 / 30.44 = 94.8 mm; 2886.5 / 76.1 = 37.9 mm; 2886.5 / 304.4 = 9.48 mm. Geometric beam at the grating (before the anamorphic change). At 250 mas this gives 117 mm leaving the grating in K (E00: about 125 mm for the 1k camera). |

### Gratings

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Gratings | four plane reflection gratings (J, H, K, H+K), 160 x 140 mm, directly ruled in gold on lightweighted aluminum blanks |  | E00, Sec. 2.4, pdf p. 6 | SPIFFI will have four plane gratings, covering the atmospheric J, H, K, and H & K bands. ... The size of all gratings is 160 mm x 140 mm. |
| Blank | 6061 aluminum, 160 x 140 x 20 mm, electroless NiP layer, 2-3 um gold, ruled in the gold |  | G17, Sec. 3.1, pdf p. 4 | The dimensions of the grating blanks are 160 x 140 x 20 mm. |
| Ruled directly, blazed to the band center | 'blazed to the center of its pass-band' |  | E03, Sec. 3.6, pdf p. 10 | every grating is blazed to the center of its pass- band |
| Blaze angle / blaze wavelength | NOT PUBLISHED (see INFERRED facet angle below) |  | E03, Sec. 3.6, pdf p. 10 | **INFERRED:** No groove-density, blaze-angle or manufacturer table found; the facet angle follows from the sourced geometry: t = (alpha - beta)/2 with alpha = 36.09, 35.83, 36.73, 28.58 deg and alpha + beta' = 45 deg: t = 13.59, 13.33, 14.24, 6.08 deg (J, H, K, H+K). (text: every grating is blazed to the center of its pass- band) |
| Grating spacing J (80 K) | 5.758 | um | G17, Table 2, pdf p. 9 | J 5.758 (1.10, 1.25, 1.40) -2 -36.0908 |
| Grating spacing H (80 K) | 7.747 | um | G17, Table 2, pdf p. 9 | H 7.747 (1.45, 1.65, 1.85) -2 -35.8277 |
| Grating spacing K (80 K) | 9.684 | um | G17, Table 2, pdf p. 9 | K 9.684 (1.95, 2.20, 2.45) -2 -36.7344 |
| Grating spacing H+K (80 K) | 9.961 | um | G17, Table 2, pdf p. 9 | H+K 9.961 (1.45, 1.95, 2.45) -1 -28.5817 |
| Operating temperature of the parameters | 80 K | K | G17, Table 2 caption, pdf p. 9 | All parameters in the simulation are for the 80K operating temperature. |
| Groove density | 173.67, 129.08, 103.26, 100.39 lines/mm (J, H, K, H+K) | lines/mm | this record | **DERIVED:** G = 1000 / spacing(um): 1000/5.758 = 173.67; 1000/7.747 = 129.08; 1000/9.684 = 103.26; 1000/9.961 = 100.39. |
| Orders | 2nd order for J, H, K; 1st order for H+K |  | G17, Sec. 3.1, pdf p. 4 | The gratings for J-, H-, and K-band are operated in 2nd order and the grating for the combined H+K-band in 1st order. |
| Orders (ALT) | second order J, H, K; first order H+K |  | GR, Sec. 1.2.2, pdf p. 17 | ALT: The J-, H-, and K-band gratings are operated in second order and the H+K-band grating in first order. |
| Camera-collimator angle | 45 | deg | G17, Table 2 caption, pdf p. 9 | For the gratings, (Reflection Angle - Incidence Angle) = 45 Degrees. |
| Angle of incidence | 36.09, 35.83, 36.73, 28.58 deg (J, H, K, H+K) | deg | G17, Table 2, pdf p. 9 | ALT: J 5.758 (1.10, 1.25, 1.40) -2 -36.0908 The explorer's reflection-grating equation with psi = 45 deg, the spacing, the order and lambda_c of the EM table gives alpha = 36.090, 35.829, 36.735, 28.582 deg, i.e. G17's four values to 0.001 deg. This confirms the pairing of spacing, order and lambda_c; it is a consistency check, not an independent test. |
| Grating at the pupil | gratings sit at the intermediate pupil |  | E00, Sec. 2.1, pdf p. 4 | The gratings are located at the intermediate pupil position. |
| Grating drive | wheel driven through a 1:647 gear with an inductive encoder, to 1/5 of a pixel |  | E03, Sec. 3.6, pdf p. 10 | the grating wheel is driven with a 1:647 gear, and controlled via an inductive encoder directly attached to the grating wheel |
| Design R | 4500 (J, H, K) and 2200 (H+K) in the 2k design; about 4000 and 2000 in the 2000 design |  | G16, Sec. 2.1, pdf p. 3 | with a design resolution of 4500 for the single bands and 2200 for the H+K band grating |
| Grating efficiency | average 60-80 percent (design) |  | E00, Sec. 2.4, pdf p. 6 | The average efficiency of all gratings will be around 60 % to 80 %. |

### Camera and detector

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| 2k camera (Feb 2005 on) | five lenses and a folding mirror, f/2.8, lens diameters up to 170 mm |  | EM, Sec. 9.5, pdf p. 57 | The camera is a five-lens + 1 folding mirror f/D∼1/2.8 design. |
| 2k camera (ALT) | built by ASTRON/NOVA, installed in 2005, 5 lenses and a folding mirror, f/2.8 |  | GR, Sec. 1.2.2, pdf p. 17 | ALT: The new camera, developed by ASTRON/NOVA [Kroes et al., 2008], has been installed in 2005 and consists of 5 lenses and a folding mirror. With its f/2.8 optics |
| 2k camera focal length | 342 | mm | G17, Sec. 4.1, pdf p. 8 | imaged onto the focal plane by a CODE V lens module with a focal length of 342 mm, identical to the instrument camera |
| 2k camera focal length (plan, ALT) | about 350 mm (increased from about 180 mm for the 1k camera), needs a fold mirror | mm | E02, Secs 4-5, pdf p. 7 | the focal length of the camera must be increased from approximately 180 mm to 350 mm. This simplifies the lens optics, but requires a fold mirror |
| 2k camera beam at the grating exit | 122 | mm | this record | **DERIVED:** 342 mm / 2.8 = 122 mm (compare E00's 'about 125 mm' for the 250 mas scale). |
| 1k camera (2004 to early 2005) | six lenses of BaF2 and IRG2, f/1.45, three large lenses of 160 mm |  | E03, Sec. 3.7, pdf p. 10 | The 1k-camera (Figure 7) is a six-lens system made from Barium Fluoride and Schott IRG2 glass. The diameter of the three big lenses is 160 mm. |
| 1k camera focal length and pupil | 178 mm, entrance pupil 220 mm in front of the first lens surface | mm | E00, Sec. 2.4, pdf p. 5 | The nominal focal length of the camera (figure 5) is 178 mm. |
| 1k camera pupil distance | 220 | mm | E00, Sec. 2.4, pdf p. 5 | the entrance pupil of the camera was chosen to be 220 mm in front of the first lens surface |
| Camera anamorphic correction | -0.2652 percent of anamorphic distortion |  | E00, Sec. 2.4, pdf p. 5 | The camera was optimized to correct for -0.2652 % of anamorphic distortion from the gratings |
| Detector (2k era) | Rockwell HAWAII-2RG, 2048 x 2048 | px | EM, Sec. 9.5, pdf p. 57 | SPIFFI is equipped with a Rockwell 2k×2k pixel Hawaii 2RG array |
| Detector (2k era; ESO table says 2RD) | Rockwell Hawaii 2RD (sic), upgraded Feb 2005, operated at -189 C |  | EM, Sec. 9.7, pdf p. 58 | The instrument has been upgraded since February 2005 with a science grade Rockwell Hawaii 2RD detector (2kx2k). |
| Detector (1k era) | Rockwell HAWAII-1 (1024 x 1024) until the 2k detector arrived |  | E03, Sec. 3.7, pdf p. 10 | Until the delivery of this detector, SPIFFI will be operated as a VLT guest instrument with a 1k x 1k pixel Hawaii1 detector |
| Pixel size, 2k | 18 | um | GR, Ch. 2, pdf p. 28 | The size of a detector pixel is 18 µm. |
| Pixel size, 2k (ALT) | 18 | um | G17, Sec. 4, pdf p. 12 | ALT: The detector pixel pitch is 18 µm |
| Pixel size, 1k | 18.5 | um | E02, Secs 4-5, pdf p. 7 | (18 µm vs 18.5 µm in the HAWAII |
| Dispersion direction | the band spans the 2048 pixels along the dispersion; 32 slitlets of 64 pixels across |  | EM, Nutshell, p. v, pdf p. 5 | each wavelength band fitting fully on the 2048 pixels of the Hawaii 2RG (2k×2k) detector in the dispersion direction |
| Detector temperature | -189 | C | EM, Sec. 9.7, pdf p. 58 | Operating Temperature -189 degrees Celsius |
| Cryostat | all optics and detector at 77 K in a liquid-nitrogen bath cryostat; cold volume about 1100 x 950 x 450 mm |  | E00, Sec. 3.1, pdf p. 7 | All optics and the detector of SPIFFI will be operated at 77 K in a liquid nitrogen bath cryostat. The cold volume is approximately 1100 mm x 950 mm x 450 mm. |
| Spectral dither | spectra can be offset by half a pixel for Nyquist sampling (the 1k design); the 2k detector samples in one exposure |  | E00, Sec. 4.2, pdf p. 8 | The operator can offset the spectra on the detector by 1/2 pixel, for proper Nyquist sampling of the spectra. |

### Coverage and dispersion per grating

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| J | lambda_c 1.25 um; 1.10-1.40 um; 0.15 nm/pix; FWHM ~4 pix; R ~2000 |  | EM, Sec. 2.2 table, pdf p. 16 | J 0.15nm/pix ∼4pix ∼2000 1.10 – 1.40 µm |
| H | lambda_c 1.65 um; 1.45-1.85 um; 0.20 nm/pix; FWHM ~3 pix; R ~3000 |  | EM, Sec. 2.2 table, pdf p. 16 | H 0.20nm/pix ∼3pix ∼3000 1.45 – 1.85 µm |
| K | lambda_c 2.20 um; 1.95-2.45 um; 0.25 nm/pix; FWHM ~2 pix; R ~4000 |  | EM, Sec. 2.2 table, pdf p. 16 | K 0.25nm/pix ∼2pix ∼4000 1.95 – 2.45 µm |
| H+K | lambda_c 1.95 um; 1.45-2.45 um; 0.50 nm/pix; FWHM ~2 pix; R ~1500 |  | EM, Sec. 2.2 table, pdf p. 16 | H+K 0.50nm/pix ∼2pix ∼1500 1.45 – 2.45 µm |
| Band centers | J 1.25, H 1.65, K 2.20, H+K 1.95 um | um | EM, Sec. 9.4 table, pdf p. 57 | J 1.25µm 1.10 - 1.40µm ... K 2.20µm 1.95 - 2.45µm ... H+K 1.95µm 1.45 - 2.45µm |
| Dispersion (ALT) | 0.15, 0.2, 0.25, 0.5 nm/px | nm/px | GR, Table 4.3, pdf p. 71 | ALT: J 0.15 H 0.2 K 0.25 H+K 0.5 |
| Dispersion from the sourced optics | J 1.497, H 2.013, K 2.522, H+K 5.029 A/px | A/px | this record | **DERIVED:** dlambda/dx = d cos(beta) pix / (m f_cam) with d = 5.758, 7.747, 9.684, 9.961 um, beta = 8.91, 9.17, 8.27, 16.42 deg, m = 2, 2, 2, 1, f_cam = 342 mm, pix = 18 um: 1.497, 2.013, 2.522, 5.029 A/px against 1.5, 2.0, 2.5, 5.0 (EM). This confirms f_cam = 342 mm (an f_cam of 346 mm would raise K to 2.55 A/px). |
| Coverage on the 2048 px | detector coverage J 3066, H 4122, K 5165, H+K 10300 A |  | this record | **DERIVED:** The band fits within the detector: J 3066, H 4122, K 5165, H+K 10300 A of detector coverage in the model against filter bands of 3000, 4000, 5000 and 10000 A. |

### Measured and published performance

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| R per band and scale, commissioning era (EM Sec. 13) | 250 mas / 100 mas / 25 mas: J 1870/1800/2360; H 2920/2730/5500; K 4490/5090/5950; H+K 1640/2050/2710 |  | EM, Sec. 13 table, pdf p. 80 | K 4490 5090 5950 |
| R per band and scale, commissioning era, J row | J 1870 1800 2360 |  | EM, Sec. 13 table, pdf p. 80 | J 1870 1800 2360 |
| R per band and scale, commissioning era, H row | H 2920 2730 5500 |  | EM, Sec. 13 table, pdf p. 80 | H 2920 2730 5500 |
| R per band and scale, commissioning era, H+K row | H+K 1640 2050 2710 |  | EM, Sec. 13 table, pdf p. 80 | H+K 1640 2050 2710 |
| R, commissioning era (ALT, v89) | same table in the 2011 manual |  | EM89, Sec. 13 table, pdf p. 77 | ALT: K 4490 5090 5950 |
| How these were measured | FWHM of super-sampled arc lines from the commissioning (courtesy A. Gilbert, MPE), 'simply computed from the FWHM of the arc lines' |  | EM, Sec. 13, pdf p. 80 | The spectral resolutions per band and plate-scale, when simply computed from the FWHM of the arc lines are: |
| Line FWHM in pixels, commissioning era | 250/100/25 mas: J 4.47/4.64/3.53; H 2.83/3.02/1.50; K 1.96/1.73/1.48; H+K 2.37/1.90/1.44 | px | EM, Sec. 13 table, pdf p. 80 | K 1.96 1.73 1.48 |
| Sampling remark | when the FWHM is below 2 px the R should be computed from a 2 px resolution element |  | EM, Sec. 13, pdf p. 80 | Thus, for the cases in which the FWHM is less than 2 pixels, the spectral resolution is probably to be computed from a resolution of 2 pixels |
| R after the Jan 2016 upgrade, K row | K: 25 mas FWHM 1.6 px R 5330; 100 mas 1.9 px R 4670; 250 mas 2.2 px R 4070 |  | G16, Table 3, pdf p. 10 | K 25 1.6 5330 8 100 1.9 4670 34 250 2.2 4070 17 |
| R after the upgrade, J rows | J: 25 mas 2270; 100 mas 1880; 250 mas 1960 |  | G16, Table 3, pdf p. 10 | J 25 3.7 2270 -6 100 4.4 1880 7 250 4.3 1960 5 |
| R after the upgrade, H rows | H: 25 mas 3090; 100 mas 2570; 250 mas 2710 |  | G16, Table 3, pdf p. 10 | H 25 2.7 3090 -10 100 3.2 2570 11 250 3.0 2710 11 |
| R after the upgrade, H+K rows | H+K: 25 mas 2120; 100 mas 1940; 250 mas 1730 |  | G16, Table 3, pdf p. 10 | H+K 25 1.9 2120 -6 100 2.0 1940 33 250 2.3 1730 22 |
| How Table 3 was measured | R = lambda_c / dlambda, dlambda the FWHM of Gaussian fits to arc-lamp lines at standard detector sampling, averaged over the band; error about 5 percent |  | G16, Sec. 4.2.1, pdf p. 9 | was calculated as λc /dλ, where λc is the center wavelength of the band and dλ is the FWHM of the Gaussian fit to the arc-lamp spectral lines using the standard detector sampling |
| R before and after the upgrade (ESO) | old/new: J 1940/2020, H 2320/2570, K 4110/4700, H+K 1450/1790 (the scale is not stated) |  | PU, Sec. 3.2 table, pdf p. 2 | K 4110 4700 2.3 2.0 |
| Upgrade dates | 28 Dec 2015 - 30 Jan 2016: new pre-optics collimator, new J, H, K filters, new M1-M3 collimator mirrors, new grating drive |  | PU, Sec. 2, pdf p. 1 | SINFONI was successfully upgraded and commissioned during 28 Dec 2015 |
| Nominal R in the manual summary | around 2000, 3000, 4000 in J, H, K and 1500 in H+K |  | EM, Nutshell, p. v, pdf p. 5 | a spectral resolution around 2000, 3000, 4000 in J, H, K, respectively, and 1500 in H+K |
| Galactic Center mode | K grating, 0.0125 x 0.025 arcsec pixels (the 25 mas scale), R about 4400 (FWHM 5e-4 um) |  | E05, Sec. 2 (observations), pdf p. 5 | band grating delivering a FWHM resolution of 5x10-4 µm (resolving power 4400) |
| Galactic Center mode: scale | the highest-resolution mode, 25 mas slices covering 0.8 x 0.8 arcsec |  | E05, Sec. 2 (observations), pdf p. 5 | We employed the highest resolution mode with 0.0125”x 0.025” (EW x NS) pixels fully covering a contiguous field of view |
| AO resolution at 2.2 um | 56 mas at 2.2 um in the 25 mas scale | mas | E03, Sec. 3, pdf p. 7 | the angular resolution at a wavelength of 2.2 µm is 56 mas |
| Design throughput of SPIFFI | about 32 percent, 1.1-2.45 um (design) |  | E00, Sec. 5, pdf p. 8 | The SPIFFI instrument is designed to maintain a very high optical throughput (≈ 32 %) |
| Detector read noise and dark | RON 16 e- for short DIT, 7 e- at DIT ~100 s; dark 0.15 e-/s |  | EM, Sec. 9.7, pdf p. 58 | Dark current (at -189 deg C) 0.15 e−/s |

### Layout (Fig. 2 of E00; Fig. 3.1 of GR; Fig. 1 of G16)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Layout figure 1 | E00 Fig. 2: schematic top view of the cold bench (arXiv p. 3); Fig. 1: perspective drawing (p. 2); E03 Fig. 4: photograph-style inside view |  | E00, Fig. 2 caption, pdf p. 3 | Schematic drawing of SPIFFI (top view): The drawing shows the main components of SPIFFI. The light enters the instrument from the top. |
| Layout figure 2 | GR Fig. 3.1 (thesis p. 23): scheme of the TMA with M1, M2, M3, the field plane and the pupil |  | GR, Fig. 3.1, pdf p. 31 | Scheme of the SPIFFI TMA |
| Element order | dichroic window, sky spider, 45 deg fold, pre-optics collimator, filter wheel, cold stop, optics wheel, image slicer, TMA (M1, M2, M3), grating wheel, camera, detector |  | G16, Sec. 2.1, pdf p. 2 | The light then enters the pre-optics collimator, here after a 45o |
| Collimator-to-grating in the figure (grating at the pupil) | M3 is close to the pupil, the grating just after it |  | GR, Sec. 4.3, pdf p. 69 | M3 which is close to the pupil position of the spectrometer |
| Scale bar and bench size | 10 cm bar = 100 px at 200 dpi; cold plate 1098 x 950 mm | mm | E00, Sec. 3.1 and Fig. 2, pdf p. 7 | **MEASURED:** The plate outline spans 1098 x 950 px in the 200 dpi render of Fig. 2, which equals the sourced cold volume 1100 x 950 mm at 1.00 px/mm, and the drawn 10 cm scale bar spans 100 px: two independent checks on the scale (1 px = 1 mm). (text: The cold volume is approximately 1100 mm x 950 mm x 450 mm.) |
| Slit to M1 | 147 | mm | E00, Fig. 2 | **MEASURED:** Slicer exit at (765, 195) px to the M1 face at (912, 198) px; scale 1 px = 1 mm; about +-15 mm. |
| M1 to M2 | 872 | mm | E00, Fig. 2 | **MEASURED:** (912, 198) to (125, 575) px; about +-20 mm. Fold at M1 (deviation) 155 deg. |
| M2 to M3 | 866 | mm | E00, Fig. 2 | **MEASURED:** (125, 575) to (980, 710) px; about +-20 mm; equal to M1-M2 within 1 percent, as GR states. Fold at M2 146 deg, at M3 159 deg. |
| M3 to grating center | 325 | mm | E00, Fig. 2 | **MEASURED:** (980, 710) to the center of the active grating face (661, 771) px; the face spans 150 mm (sourced 160 mm). |
| Slit to grating, unfolded | 2210 | mm | E00, Fig. 2 | **MEASURED:** 147 + 872 + 866 + 325 = 2210 mm (the TMA is shorter than its 2886.5 mm focal length). |
| Camera-collimator angle in the figure | 42 deg, +-4 (sourced 45 deg) | deg | E00, Fig. 2 | **MEASURED:** Incoming direction at the grating (toward M3) at +10.8 deg, diffracted axis (toward the camera's first lens) at +52.5 deg. |
| Grating to the camera's first lens | 216 | mm | E00, Fig. 2 | **MEASURED:** (661, 771) to (800, 590) px; agrees with the sourced 220 mm entrance-pupil distance of the 1k camera. The figure shows the 1k camera, not the 2k camera. |

### History and replacement

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| Replacement | SPIFFI is rebuilt as SPIFFIER inside ERIS on UT4 (the AO module and the dichroic entrance window change) |  | G16, Secs 5-6, pdf p. 14 | ERIS is the next-generation AO near-IR imager and spectrograph for the Cassegrain focus of the VLT UT4 |
| LGS mode ended | no laser mode from Period 103 |  | EM, Nutshell, p. v, pdf p. 5 | Since Period 103, SINFONI no longer offers the mode with the Laser Guide Star (LGS). |
| Archive | data public in the ESO archive from April 2005 |  | EH, History page | April 2005: The data taken with SINFONI are now visible from the ESO Archive. |

## Optical layout (from Fig. 2 of E00, p. 3 of the arXiv PDF; Fig. 3.1 of GR, thesis p. 23; Fig. 1 of G16)

Fig. 2 of Eisenhauer et al. 2000 is a plan view of the cold bench with a scale bar (10 cm). **Scale used for every MEASURED value: 1.00 px/mm on a 200 dpi render, from the 10 cm bar (100 px) and independently from the cold plate (1098 x 950 px against the sourced cold volume of about 1100 x 950 mm).** The figure draws the ORIGINAL 1k camera; the 2k camera (Feb 2005) replaced it. Orientation: the figure's top is the direction the light enters.

1. **Entrance (SOURCED order, MEASURED positions).** The beam from the AO module enters through the dichroic window from the top (arrow at x = 195 px), meets the sky spider's 45 deg mirror at (195, 200), and then runs along +x through the sky spider, the pre-optics collimator doublet, the filter wheel (x about 300-325 px, in the collimated beam), the 6 mm cold stop, the optics wheel (x 330-580, with the three objectives) and the image slicer (x 600-760). The pseudo-slit leaves the big slicer at (765, 195), heading +x.
2. **Collimator, a three-mirror anastigmat (SOURCED: Eisenhauer 2000 Sec. 2.4; Graeff 2016 Ch. 3).** M1 (concave sphere, R = 2599.58 mm) stands at (912, 198), 147 mm (MEASURED) from the slit, and returns the beam toward the lower left. M2 (small convex ellipse) stands at (125, 575), 872 mm from M1 (MEASURED). M3 (large concave ellipse, close to the pupil) stands at (980, 710), 866 mm from M2 (MEASURED; GR: the two distances are identical). Folds: 155 deg at M1, 146 deg at M2 and 159 deg at M3 (MEASURED; incidence angles 12.5, 17 and 10.5 deg; E00's '11.5 deg off-axis' is the field-mean). The unfolded path slit to grating is about 2210 mm (MEASURED), shorter than the 2886.5 mm focal length because the TMA is a telephoto system.
3. **Grating wheel (SOURCED: four gratings on a wheel; MEASURED positions).** The beam from M3 runs 325 mm (MEASURED) to the active grating face at (661, 771), the face a plane 160 mm x 140 mm blank (150 mm measured) with the grating at the pupil. The footprint of the beam is 118 mm in K at 250 mas (explorer, DERIVED). The other three gratings sit on the other sides of the square turret (Fig. 2).
4. **Camera.** The diffracted beam leaves at 42 +- 4 deg from the incoming one (MEASURED; 45 deg sourced) and runs 216 mm (MEASURED; 220 mm SOURCED for the 1k camera's entrance pupil) to the first camera lens. The camera axis points up and to the right in the figure; the detector sits behind the lens barrel at (960, 340). The 2k camera has five lenses and a fold mirror (EM, GR), f/2.8, 342 mm: its drawing is NOT FOUND.
5. **What the explorer draws.** One collimator mirror with a tilt, a grating and a thin lens: the TMA is a single mirror (colTilt 11.5) with the distance slit to mirror shown at f_col (SCHEMATIC for the slit side: the real folded path is 1885 mm from the slit to M3 (MEASURED), which the single-mirror drawing cannot show) and layLen 325 mm (M3 to the grating, MEASURED); camLen 220 mm (SOURCED for the 1k camera, SCHEMATIC for the 2k). The real bench folds the beam three times (M1, M2, M3, MEASURED above); the explorer has one fold mirror, so none is set and the preset builder may choose to draw M2 as the fold.

## Recommended presets (for the preset builder)

**Preset line:** `VLT / SINFONI`, tel `VLT 8.2 m`, inst `SINFONI`, default Setting `K, 100 mas`. Era: the 2k-camera, HAWAII-2RG instrument (Feb 2005 to June 2019); R values are those after the Jan 2016 upgrade (collimator mirrors, pre-optics, filters replaced), which changed R by 4-15 percent (PU). Setting names (<= 16 characters): `J, 100 mas`, `H, 100 mas`, `K, 100 mas`, `H+K, 100 mas`, `K, 250 mas`, `K, 25 mas`. The other six combinations (J and H at 250 and 25 mas, H+K at 250 and 25 mas) are in the JSON as optional.

Common state: D = 8.115 m (the Cassegrain pupil), mode grating, slit feed, col mirror, cam lens, colTilt 11.5, layLen 325, camLen 220, W = 2886.5 / F, fcam 342, reflection grating at psi = 45 deg, lamB1 from the facet angle (INFERRED, below), Nx = Ny = 2048, pix 18 um, nObj 2048, filt = the band filter. Per setting:

| Setting | F | slitW (arcsec) | W (mm) | G (/mm) | m | lamC (A) | lamB1 (A) | filt (A) |
|---|---|---|---|---|---|---|---|---|
| J, 100 mas | 76.1 | 0.1 | 37.93 | 173.671 | 2 | 12500 | 27060 | 11000-14000 |
| H, 100 mas | 76.1 | 0.1 | 37.93 | 129.082 | 2 | 16500 | 35719 | 14500-18500 |
| K, 250 mas | 30.44 | 0.25 | 94.83 | 103.263 | 2 | 22000 | 47625 | 19500-24500 |
| K, 100 mas | 76.1 | 0.1 | 37.93 | 103.263 | 2 | 22000 | 47625 | 19500-24500 |
| K, 25 mas | 304.4 | 0.025 | 9.48 | 103.263 | 2 | 22000 | 47625 | 19500-24500 |
| H+K, 100 mas | 76.1 | 0.1 | 37.93 | 100.392 | 1 | 19500 | 21107 | 14500-24500 |

lamB1 is the first-order Littrow wavelength 2 sin(t)/G of the facet angle t = (alpha - beta)/2 = 13.59, 13.33, 14.24, 6.08 deg: INFERRED from 'blazed to the center of its pass-band' and the sourced geometry (alpha + beta' = 45 deg at lamC), not published; it affects only the blaze curve and drawing, not R or the format.

**Model predictions** (explorer physics.js run on these states, slitL = 0 as in validate.js; Reff includes the diffraction term; the model's flags: 'samp' = under-sampled, 'ord' = order overlap without the filter, 'diff' = diffraction-limited footprint):

| Setting | R model | R measured 2016 (G16) | R at commissioning (EM) | A/px model | A/px published | px along slice model (arcsec) | published | range model (A) | flags |
|---|---|---|---|---|---|---|---|---|---|
| J, 250 mas | 5139 | 1960 | 1870 | 1.497 | 1.5 | 0.1269 | 0.125 | 10976-14037 | ord,samp |
| J, 100 mas | 4937 | 1880 | 1800 | 1.497 | 1.5 | 0.0507 | 0.05 | 10976-14037 | ord,samp |
| J, 25 mas | 3203 | 2270 | 2360 | 1.497 | 1.5 | 0.0127 | 0.0125 | 10976-14037 | ord,samp,diff |
| H, 250 mas | 4995 | 2710 | 2920 | 2.0126 | 2.0 | 0.1269 | 0.125 | 14451-18567 | ord,samp |
| H, 100 mas | 4671 | 2570 | 2730 | 2.0126 | 2.0 | 0.0507 | 0.05 | 14451-18567 | ord,samp |
| H, 25 mas | 2594 | 3090 | 5500 | 2.0126 | 2.0 | 0.0127 | 0.0125 | 14451-18567 | ord,samp,diff |
| K, 250 mas | 5334 | 4070 | 4490 | 2.522 | 2.5 | 0.1269 | 0.125 | 19431-24589 | ord,samp |
| K, 100 mas | 4771 | 4670 | 5090 | 2.522 | 2.5 | 0.0507 | 0.05 | 19431-24589 | ord,samp |
| K, 25 mas | 2231 | 5330 | 5950 | 2.522 | 2.5 | 0.0127 | 0.0125 | 19431-24589 | ord,samp,diff |
| H+K, 250 mas | 2108 | 1730 | 1640 | 5.0289 | 5.0 | 0.1269 | 0.125 | 14399-24683 | samp |
| H+K, 100 mas | 1926 | 1940 | 2050 | 5.0289 | 5.0 | 0.0507 | 0.05 | 14399-24683 | samp |
| H+K, 25 mas | 968 | 2120 | 2710 | 5.0289 | 5.0 | 0.0127 | 0.0125 | 14399-24683 | samp,diff |

Reading: the dispersion and the coverage agree with the published values to 1 percent in all four bands, with nothing fitted (the spacings and f_cam come from George et al. 2016/2017, the dispersion from the ESO manual). The R of K and H+K at 100 mas agrees with the measured R to 2 and 1 percent. The model is 2.6 (J) and 1.8 (H) times above the measured R: J- and H-band lines are broadened by the gratings' cryogenic deformation (George et al. 2017), which the explorer does not model. At 250 mas K is 31 percent high; at 25 mas the explorer's R is a diffraction cap that does not exist in the instrument (see Notes).

## Published performance (validation targets proposed)

Default `K, 100 mas`:

| quantity | value | tol | scored? | source and note |
|---|---|---|---|---|
| 0.25 nm/px (2.5 A/px) dispersion in K | 2.5 | 0.02 | yes | ESO SINFONI manual Sec. 2.2 table; Graeff 2016 Table 4.3 (two significant figures). Independent: the spacing and f_cam are from George et al. 2017, the dispersion from the manual. Model 2.522. |
| K coverage from 19500 A | 19500 | 0.015 | yes | ESO SINFONI manual Sec. 2.2 / 9.4 (the 1.95-2.45 um band; the model's range is the 2048 px). Model 19431. |
| K coverage to 24500 A | 24500 | 0.015 | yes | ESO SINFONI manual Sec. 2.2 / 9.4. Model 24589. |
| R = 4670 in K at 100 mas (measured, Jan 2016 and later) | 4670 | 0.08 | yes | George et al. 2016 Table 3 (lambda_c / FWHM of Gaussian fits to arc lines, error about 5 percent). Independent of the preset's inputs. Model 4771 (+2.2 percent). |
| R = 5090 in K at 100 mas (measured at commissioning) | 5090 |  | info | ESO SINFONI manual Sec. 13 (before the 2016 upgrade; the collimator mirrors then were the 2004-2016 set). Model 6 percent lower. |
| 0.05 arcsec along the slice at 100 mas | 0.05 | 0.03 | yes | ESO SINFONI manual Sec. 2.2 table (spaxel 50 mas x 100 mas). Model 0.0507; f_cam = 346 mm would give exactly 0.05. |
| design line FWHM about 1.6 px | 1.6 | 0.05 | yes | George et al. 2016 Table 3 caption. Model 1.596. |
| angle of incidence 36.73 deg at 2.2 um | 36.7344 |  | info | George et al. 2017 Table 2; a consistency check (same equation, psi = 45 deg), not a test |

`J, 100 mas`:

| quantity | value | tol | scored? | source and note |
|---|---|---|---|---|
| 0.15 nm/px | 1.5 | 0.02 | yes | ESO SINFONI manual Sec. 2.2 table |
| R = 1880 (measured, 2016) | 1880 |  | info | model 4937, 2.6 times higher: the J grating's line profile is broadened (George et al. 2017); the explorer has only the geometric slit image |

`H, 100 mas`:

| quantity | value | tol | scored? | source and note |
|---|---|---|---|---|
| 0.20 nm/px | 2.0 | 0.02 | yes | ESO SINFONI manual Sec. 2.2 table |
| R = 2570 (measured, 2016) | 2570 |  | info | model 4671, 1.8 times higher: same cause |

`H+K, 100 mas`:

| quantity | value | tol | scored? | source and note |
|---|---|---|---|---|
| 0.50 nm/px | 5.0 | 0.02 | yes | ESO SINFONI manual Sec. 2.2 table |
| R = 1940 (measured, 2016) | 1940 | 0.08 | yes | George et al. 2016 Table 3. Model 1926 (-0.7 percent) |

`K, 250 mas`:

| quantity | value | tol | scored? | source and note |
|---|---|---|---|---|
| 0.125 arcsec along the slice | 0.125 | 0.03 | yes | ESO SINFONI manual Sec. 2.2 table |
| R = 4070 (measured, 2016) | 4070 |  | info | model 5334, +31 percent: the 250 mas beam fills the collimator and the grating and meets the largest aberrations of the TMA and the grating's cryogenic deformation (George et al. 2016 attribute the 10-30 percent gains of the 2016 mirrors to the large scales) |

`K, 25 mas`:

| quantity | value | tol | scored? | source and note |
|---|---|---|---|---|
| 0.0125 arcsec along the slice | 0.0125 | 0.03 | yes | ESO SINFONI manual Sec. 2.2 table |
| R = 5330 (measured, 2016) | 5330 |  | info | model 2231, 2.4 times LOWER: the model's 9.5 mm geometric beam on the grating caps R at the diffraction limit, but the 300 um slit's own diffraction (lambda f_col / w = 21 mm at 2.2 um) fills a far larger part of the grating; the explorer cannot represent this |

**Circularity.** No value was chosen to make a published number come out: the explorer's inputs are the sourced spacing, order, psi, f_col, f_cam, pixel size and the derived F, W; the dispersion, coverage, R(K,100) and R(H+K,100) are independent tests. The only inferred input is lamB1 (blaze), which does not enter them. The 1k-to-2k history gives a second independent check: 346 mm would be implied by '64 pixels per slitlet' (64 x 18 um / 9.6 mm x 2886.5 mm), 1.3 percent above the sourced 342 mm.

## NOT FOUND

- Blaze angle or blaze wavelength of each grating, the manufacturer, the ruled area (blank 160 x 140 mm; the active footprint is an elliptical stop), the groove density at room temperature (the spacings given are the 80 K values of George et al. 2017).
- The 2k camera's optical prescription, glass list, distances and the fold position (Kroes et al. 2008; behind the SPIE paywall); only f/2.8, 342 mm, five lenses and a fold, lens diameters up to 170 mm are known.
- The pre-optics lens prescriptions (the three objectives) and the pre-optics collimator's final focal length (85.5 mm in 2000, 112.7 mm after the 2016 replacement).
- A measured throughput per band (only the 32 percent design value and relative new/old ratios; the ETC holds the rest).
- Usage statistics by pixel scale (no source found; ESO telescope-bibliography counts do not list scales).
- The M1-M2-M3 mirror spacings and tilts as numbers (only the equal spacing, the radii and conics, and 'operated 11.5 deg off-axis'); the layout values here are MEASURED from Fig. 2.

## Conflicts between sources

- **Camera focal length and speed.** 178 mm and f/1.4 (E00 design, 1k, 18.5 um pixels; E03: f/1.45) against 342 mm and f/2.8 (G17, EM, GR: the 2k camera) and 'approximately 350 mm' and f/3.1 (E02, the plan). These are two different cameras; the 2k camera is adopted (the K dispersion confirms 342 mm; 178 mm would give 4.8 A/px).
- **Collimator focal length.** 2886.5 mm (E00, GR) against 2873 mm (G17's CODE V module 'identical to the instrument collimator focal length'). 2886.5 mm adopted (the design value); a 0.5 percent difference, below any test here.
- **Detector name.** Hawaii 2RG (EM nutshell and Sec. 9.5; G16; GR) against 'Hawaii 2RD' in the same manual's Sec. 9.7 table; read as a typo for 2RG.
- **Date of the 2k upgrade.** 'since February 2005' (EM Sec. 9.7), 'installed in 2005' (G16, GR) against 'the current 2K camera that was installed in 2004' and 'mirrors installed from 2004-2016' (G16 Sec. 4.2.3). First light was July 2004 (EH) with the 1k detector, so 2005 is adopted.
- **Cassegrain focal ratio.** f/13.4106 (VLT-SPE Table 2) and f/13.4 (EM) against 'FCassegrain /14.1' in GR Sec. 4.2.1 (its own M = 23.6 uses 13.4: 17.1 x 2087.8 / (13.41 x 112.7) = 23.6, but 17.1 x 2087.8 / (14.1 x 112.7) = 22.5).
- **Pre-optics collimator and 25 mas objective.** f = 85.5 mm with magnification 17.8 (E00) against f = 112.7 mm with a 2087.8 mm objective (GR, the 2016 replacement), a magnification of 18.5, which would make the 25 mas slice 311 um instead of 300 um (4 percent); not resolved. The scale is the sourced 25 mas.
- **Slit image on the detector.** 27 um (G17, GR: 1.5 px) against 29.0 um DERIVED here from 300 um x (342/2886.5) x cos(alpha)/cos(beta) in K (28.7 um) and the 'design FWHM about 1.6 px' of G16 (28.8 um). G17's 27 um is not reproduced (6 percent).
- **Design and nominal R.** 'about 4000' (E00), 4500 and 2200 (G16 design), 'around 2000, 3000, 4000 and 1500' (EM), 'up to 3300' (E03, the 1k configuration), 4400 for the K grating at the Galactic Center (E05); the explorer's geometric R in K is 4771-5466 depending on the scale. The measured R by scale and era is in the Parameters table and varies by 30 percent with the scale.
- **Slit-image and R per scale before and after the 2016 upgrade.** EM Sec. 13 (commissioning, before the 2004-2016 collimator mirrors were replaced): K 4490, 5090, 5950; G16 Table 3 (2016): K 4070, 4670, 5330; PU: K 4110 -> 4700 (the scale is not stated). The ESO manual keeps the old table in the 2019 issue.
- **Mirror shapes.** E00 says the two elliptical mirrors are 'prolate'; E03, GR and G16 call them 'oblate' (and G16 calls M2 'prolate'); the conics k = 2.82 and 6.237 (GR) are positive. A naming difference only.
- **Sky-spider offsets.** 15, 30, 45 arcsec (E03), 19, 38, 58 arcsec (EM), 0.25, 0.5, 0.75, 1 arcmin (E00). Not used in service (EM: 'This mode is not offered').

## Notes

- **What sets the slice width on the sky.** The slice is always the 300 um small-slicer mirror; the pre-optics objective changes the sky angle that fills it (0.25, 0.1, 0.025 arcsec), so the beam into the slicer is f/30.4, f/76.1 or f/304.4. In the spectrograph the slit is therefore the same 300 um for all scales, and the geometric R is the same; the measured R differs by scale because the three beams illuminate different parts of the collimator and the grating (EM Sec. 13: 'a strong dependence of the spectral resolution on the selected pre-optics').
- **Slit diffraction at 25 mas.** At f/304 the geometric beam on the grating is 9.5 mm, but the diffraction of a 300 um slit alone at 2.2 um spreads over lambda f_col / w = 2.2e-3 x 2886.5 / 0.3 = 21 mm: the grating is lit well beyond the geometric footprint. The explorer's diffraction cap uses the geometric beam only; R(K, 25 mas) = 2231 is therefore a model artifact against the measured 5330. Do not score it.
- **Rectangular spaxels.** The spaxel is 1 slice wide and half a slice long (250 x 125, 100 x 50, 25 x 12.5 mas). The explorer's pixScale is the along-slice value (0.125, 0.05, 0.0125 arcsec per pixel); the slit width is the across-slice value.
- **Nyquist sampling.** The line FWHM is 1.6 px by design (below 2 px): the 2k detector samples it in one exposure only barely; 'spectral dither' (half-pixel offsets) is a template option (EM Sec. 12).
- **Brick-wall pseudo-slit.** The 32 slitlets form two staggered rows, 'two truncated slits' (E00); the explorer has one slit with nObj = 2048.
- **Cold optics.** All optics and the detector are at 77 K; the grating spacings of G17 are the 80 K values. The explorer takes the spacing as G with no thermal term.
- **Wheel and filters.** The order-sorting filters (J, H, K, H+K) define the coverage; the 2016 upgrade replaced J, H, K (new IRIDIAN filters) and kept the old H+K (G16 Sec. 3.2). The preset should carry filt so no order-overlap warning shows.
- **Service history.** Guest-instrument start with the 1k detector (2004); 2k detector and camera Feb 2005; the PARLA laser commissioned in March 2013, laser mode ended with P103 (2018); the deformable secondary on UT4 in Dec 2016 (SINFONI recommissioned 4 Dec 2016); January 2016 upgrade; move to UT3 in Feb 2019; decommissioned 30 June 2019 (EH).
- **Detector in the explorer.** Nx = Ny = 2048 with 18 um pixels; the 'dispersion along Nx' convention is INFERRED from 'the 2048 pixels ... in the dispersion direction' and Fig. 12 of G16 (long wavelengths at the bottom of the frame, slitlets side by side): the explorer's axes are a drawing choice, not a sourced orientation.
- **Telescope for the drawing.** The Cassegrain D = 8.115 m pupil of VLT-SPE Table 2 keeps the 528 um/arcsec scale (the same convention as FORS2 and X-Shooter in presets.js).
