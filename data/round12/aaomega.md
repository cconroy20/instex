# Round 12 (2026-11-18): AAT 3.9 m / AAOmega (2dF-fed bench spectrograph; id `aaomega`)

Same rules as rounds 1-11 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/aaomega/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so that the explorer reproduces published performance (none is used in this record); **INFERRED** marks a reading that is not stated; **MEASURED** marks a value read from a figure with a stated scale; layout elements are tagged SOURCED, MEASURED or SCHEMATIC. Quote check (scratch `qc.py`, comparing every quote piece with `pdftotext -layout` and `-raw` text, whitespace, case, quotes, dashes, degree and micro signs, ligatures and hyphenation normalized; ' ... ' joins non-adjacent pieces): **72 quote pieces, 0 failures**. All PDFs have a text layer. Machine-readable twin: `data/round12/aaomega.json`.

## Completeness summary

**Complete for the geometry the explorer needs, from the commissioning paper (Sharp et al. 2006) and survey papers; incomplete for the layout.** Sourced: the 2dF feed (f/3.5 corrector, 67 um/arcsec, 140 um fibers = 2.1 arcsec, 392 + 8 slots), the f/3.15 Schmidt collimator with its 190 mm pupil, the f/1.3 Schmidt cameras, the dichroic (570 nm, one in routine use; 670 nm for WiggleZ), the VPH grating table (blaze, range, angle, dispersion, nominal R), the CCDs (2k x 4k E2V, 15 um) and independent coverage, dispersion and R from GAMA, WiggleZ, OzDES, a Shapley-supercluster paper and KOALA. DERIVED: both focal lengths (f-ratio x 190 mm: 598.5 and 247 mm). **Not found:** any published layout figure or distance (Smith et al. 2004 and Saunders et al. 2004, the two SPIE design papers, are behind the SPIE paywall), the dichroic angle, and the AAT's own manual and grating calculator (the AAT web site is offline, 2026-11-18). No quantity is EFFECTIVE. The model reproduces the fiber PSF (3.34 px against 3.1-3.6 measured) and the 580V + 385R coverage to 0.2-0.9% with every input sourced.

**Deploy gate (collimator on- or off-axis): ON-AXIS, INFERRED, no sentence and no figure states it.** See the collimator row and the Layout section; the user decides.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| SH06 | Sharp, R., et al. 2006, Proc. SPIE 6269, 0G, 'Performance of AAOmega: the AAT multi-purpose fibre-fed spectrograph' (2006SPIE.6269E..0GS; arXiv:astro-ph/0606137): the primary source; Sec. 2.3 design summary, Fig. 1 (dichroic), Table 2 (gratings) | `rawdata/presets/aaomega/arxiv_astroph0606137.pdf` | https://arxiv.org/pdf/astro-ph/0606137 |
| S14 | Saunders, W. 2014, Proc. SPIE 9147, 60, 'Efficient and affordable catadioptric spectrograph designs for 4MOST and Hector' (2014SPIE.9147E..60S; arXiv:1407.0052): Table 3 gives the AAOmega grating angles; compares AAOmega's design | `rawdata/presets/aaomega/arxiv_14070052.pdf` | https://arxiv.org/pdf/1407.0052 |
| S16 | Saunders, W. 2016, Proc. SPIE 9908, 96, 'Very fast transmissive spectrograph designs for highly multiplexed fiber spectroscopy' (2016SPIE.9908E..96S; arXiv:1607.07721): the Hector design contrasted with AAOmega's obstructed collimator and cameras | `rawdata/presets/aaomega/arxiv_160707721.pdf` | https://arxiv.org/pdf/1607.07721 |
| S12 | Saunders, W. 2012, Proc. SPIE 8446, 54, 'A fast new catadioptric design for fiber-fed spectrographs' (2012SPIE.8446E..54S; arXiv:1207.7009): AAOmega design intent | `rawdata/presets/aaomega/arxiv_12077009.pdf` | https://arxiv.org/pdf/1207.7009 |
| L02 | Lewis, I. J., et al. 2002, MNRAS 333, 279, 'The Anglo-Australian Observatory 2dF facility' (2002MNRAS.333..279L; arXiv:astro-ph/0202175): the 2dF positioner, corrector, fibers (Table 1); the retired 2dF spectrographs | `rawdata/presets/aaomega/arxiv_astroph_0202175.pdf` | https://arxiv.org/pdf/astro-ph/0202175 |
| S10 | Sharp, R. & Birchall, M. N. 2010, PASA 27, 91, 'Optimal Extraction of Fibre Optic Spectroscopy' (2010PASA...27...91S; arXiv:0912.0558): AAOmega MOS mode, fiber pitch, PSF | `rawdata/presets/aaomega/arxiv_09120558.pdf` | https://arxiv.org/pdf/0912.0558 |
| H13 | Hopkins, A. M., et al. 2013, MNRAS 430, 2047, 'Galaxy And Mass Assembly (GAMA): spectroscopic analysis' (2013MNRAS.430.2047H; arXiv:1301.7127): the 580V/385R, 5700 A dichroic setup, coverage, dispersion, R | `rawdata/presets/aaomega/arxiv_13017127.pdf` | https://arxiv.org/pdf/1301.7127 |
| D11 | Driver, S. P., et al. 2011, MNRAS 413, 971, 'Galaxy and Mass Assembly (GAMA): survey diagnostics and core data release' (2011MNRAS.413..971D; arXiv:1009.0614): 580V + 385R, 5700 A dichroic, coverage, resolution | `rawdata/presets/aaomega/arxiv_10090614.pdf` | https://arxiv.org/pdf/1009.0614 |
| D10 | Drinkwater, M. J., et al. 2010, MNRAS 401, 1429, 'The WiggleZ Dark Energy Survey: survey design and first data release' (2010MNRAS.401.1429D; arXiv:0911.4246): the 570 and 670 nm dichroics, 580V + 385R, Table 6 | `rawdata/presets/aaomega/arxiv_09114246.pdf` | https://arxiv.org/pdf/0911.4246 |
| Y15 | Yuan, F., et al. 2015, MNRAS 452, 3047, 'OzDES multifibre spectroscopy for the Dark Energy Survey: first-year operation and results' (2015MNRAS.452.3047Y; arXiv:1504.03039): the 570 nm dichroic, 580V/385R, R ~ 1400, the 2014 CCD replacement | `rawdata/presets/aaomega/arxiv_150403039.pdf` | https://arxiv.org/pdf/1504.03039 |
| C17 | Childress, M. J., et al. 2017, MNRAS 472, 273, 'OzDES multifibre spectroscopy for the Dark Energy Survey: 3-yr results and first data release' (2017MNRAS.472..273C; arXiv:1708.04526): the x5700 dichroic, 580V at 4800 A, 385R at 7250 A, overlap | `rawdata/presets/aaomega/arxiv_170804526.pdf` | https://arxiv.org/pdf/1708.04526 |
| SR07 | Smith, R. J., et al. 2007, MNRAS 381, 1035, 'A deep AAOmega survey of low-luminosity galaxies in the Shapley supercluster' (2007MNRAS.381.1035S; arXiv:0707.1695): 580V and 1000R nominal FWHM and sampling | `rawdata/presets/aaomega/arxiv_07071695.pdf` | https://arxiv.org/pdf/0707.1695 |
| K26 | Ko, K., et al. 2026, MNRAS 552, 1679 (ADS bibcode 2026MNRAS.552g1679K), 'The Delegate Survey: KOALA/AAOmega-IFU spectroscopy of three nearby dwarf galaxies' (arXiv:2609.18319): KOALA feed, dichroic choices, 580V and 1000R settings | `rawdata/presets/aaomega/arxiv_260918319.pdf` | https://arxiv.org/pdf/2609.18319 |
| WD85 | Walker, D. D. & Diego, F. 1985, MNRAS 217, 355, 'Design philosophy of the forthcoming echelle spectrographs for the AAT and LPO' (1985MNRAS.217..355W): D = 3893 mm for the AAT (copied from rawdata/presets/uhrf/) | `rawdata/presets/aaomega/walker_diego_1985MNRAS.217..355W.pdf` | https://ui.adsabs.harvard.edu/link_gateway/1985MNRAS.217..355W/ADS_PDF |
| (saved, not quoted) | Also saved: Glazebrook et al. 2007, ASPC 379, 72, 'The WiggleZ Project: AAOmega and Dark Energy' (arXiv:astro-ph/0701876); Szekely et al. 2007 (arXiv:0705.3562), AAOmega D1700 globular-cluster velocities | `rawdata/presets/aaomega/arxiv_astroph0701876.pdf; arxiv_07053562.pdf` | https://arxiv.org/pdf/astro-ph/0701876 ; https://arxiv.org/pdf/0705.3562 |

## Parameters


### Telescope and feed

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| Telescope aperture D | 3.893 | m | SOURCED | WD85; L02, p. 358 (UCLES design) | "D = 3893mm (AAT)"<br>"3.9m AAT f/3.3 Prime focus" | Same D as the explorer's AAT UHRF presets (3.893 m). The AAT's focal ratio at 2dF is the corrector's f/3.5 (next row). |
| 2dF corrector focal ratio and image scale | f/3.5; 67 um per arcsec (14.9 arcsec/mm) |  | SOURCED | L02, Table 1 | "Corrector focal ratio f/3.5"<br>"Image scale 67µm/arcsec" | DERIVED check: 3.5 x 3893 mm = 13.62 m, 206 265 / 13 625 = 15.14 arcsec/mm = 66.1 um/arcsec (the printed 67 um/arcsec is 1.4% larger). The bare prime focus is f/3.3 (Table 1); the corrector sets 3.5. The input beam of every fiber is therefore f/3.5, which FRD and the corrector's non-telecentricity (up to 4 deg) widen to the f/3.15 the collimator accepts. |
| Fibers, 2dF feed | 392 science + 8 guide fibers per slit (400 slots); core 140 um, cladding 168 um, 38 m long |  | SOURCED | SH06, Secs. 2.1 and 6; L02 Sec. 3.4 | "The Polymicro Broadband fibres∗ have a nominal core diameter of 140um, cladding diameter 168um"<br>"392 science fibre spectra"<br>"eight missing spectra where the guide fibres would be" | INFERRED from the pair: the 'eight missing spectra' (Sec. 6) are the eight guide-fiber slots of a 400-slot slit. Fiber run 38 m (SH06 Sec. 2.1: 'replacement of the 8m fibre run with the 38m run'); the 2dF fibers had the same 140 um core (L02 Sec. 3.4: 'core diameter 140 µm'). Each 2dF field plate carries 400 fibers; the slit takes one plate at a time. |
| Fiber size on the sky | 2.1 arcsec mean (2.16 at the field center, 2.0 at the edge) | arcsec | SOURCED | L02, Sec. 3.4, Table 1 | "corresponding to an average diameter of 2.1 arcsec on the sky"<br>"Fibre size on sky (mean) 2.1 arcsec" | ALT D10 Sec. 4.1: 'The angular size of each fibre on the sky is 2 arc seconds'. DERIVED: 140 um / 67 um per arcsec = 2.09 arcsec. |
| Fiber input and output focal ratios | input f/3.5 (corrector); collimator accepts f/3.15 |  | SOURCED | L02; SH06, L02 Secs. 3.2, 3.5; SH06 Sec. 2.3 | "Corrector focal ratio f/3.5"<br>"f/3.15 Schmidt collimator" | The explorer's virtual convention: F = 3.15 (the collimator's ratio, the beam the fibers must fill), core angle = 140 um / (3.15 x 3893 mm) = 2.355 arcsec, entered as the slit of equal line width sqrt(3)/2 x 2.355 = 2.039 arcsec (DERIVED; as BOSS, DESI, LAMOST). L02 (for the retired 2dF spectrographs, the same f/3.15 collimator speed) states the intent: the collimator 'slightly oversized compared to the prime focus corrector focal ratio of f/3.5, to allow for some focal ratio degradation'. The fiber output ratio itself is NOT FOUND for AAOmega. |
| Number of spectra on the detector (nObj) | 392 (400 slots; 8 empty guide slots) |  | SOURCED | SH06; S10, SH06 Sec. 6; S10 Sec. 3 | "eight missing spectra where the guide fibres would be"<br>"392 science fibres are deployed on astronomical targets" | nObj = 392 for MOS (SPIRAL: 512 fibers, KOALA: 1000 lenslets, Secs. below; not entered). |
| Fiber pitch on the CCD | ~10 pixels (150 um) | px | SOURCED | S10, Sec. 3 (AAOmega MOS) | "the fibre pitch, of ∼10 pixels" | DERIVED: 392 + 8 = 400 slots x 10 px x 15 um = 60 mm of the 61.4 mm 4096-px spatial axis; the 145 mm slit (SH06) demagnified by f_cam/f_col = 0.4127 is 59.8 mm. Consistent. |

### Spectrograph optics

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| Slit length (pseudo-slit) | 145 | mm | SOURCED | SH06, Sec. 2.3 | "The design has a 145mm fibre slit" | With a field lens gelled to the slitlets ('telecentric (or more correctly, pupil-centric)'). 90 slitlets make up the full slit (SH06 Sec. 5.4). |
| Collimator type | all-Schmidt: f/3.15 spherical Schmidt collimator, with one corrector plate per arm after the dichroic |  | SOURCED | SH06, Abstract and Sec. 2.3 | "an f/3.15 Schmidt collimator, incorporating a dichroic beam-splitter"<br>"incorporating a dichroic beam-splitter upstream of the corrector (this necessitates two correctors but minimises pupil relief)" | Whether the mirror is the explorer's 'mirror' collimator: a Schmidt collimator is a reflecting (spherical mirror) collimator with a corrector plate; the papers do not say 'mirror' in so many words. INFERRED: col 'mirror' (the one-corrector-per-arm detail is not representable). |
| Collimated beam (pupil) diameter | 190 | mm | SOURCED | SH06, Abstract | "Pupil size is 190mm, determined by the competing demands of cost, obstruction losses, and maximum resolution" |  |
| Collimator focal length | 598.5 | mm | DERIVED | SH06, Abstract | "f/3.15 Schmidt collimator"<br>"Pupil size is 190mm" | DERIVED: 3.15 x 190 mm = 598.5 mm. Not stated as a length in the sources saved here (the Smith et al. 2004 and Saunders et al. 2004 SPIE papers, behind the SPIE paywall, give the prescription). ALT: the retired 2dF spectrographs used a 150 mm beam at f/3.15 = 472.5 mm (L02 Sec. 3.5), so the focal ratio is a carry-over. |
| Collimator on- or off-axis (deploy gate) | ON-AXIS (Schmidt; the slit stands in the returning beam), INFERRED; no sentence states it |  | INFERRED | SH06; S16; S14, SH06 abstract and Sec. 2.3; S16 Secs. 2 and 8; S14 Sec. 1 | "determined by the competing demands of cost, obstruction losses, and maximum resolution"<br>"AAOmega [7] suffers from complex and variable diffractive blazes, imperfectly understood but clearly caused by the detector and spider in the beam. Hence a decision was taken to have a collimator with unobstructed pupil. An off-axis Schmidt collimator works fine"<br>"Classic Schmidt designs suffer from obstruction losses caused by the detector" | VERDICT: the evidence is indirect, from three papers by the instrument's designer. (1) SH06: the pupil size trades 'obstruction losses' against resolution, so the pupil is obstructed. (2) S16 (Hector, which chose 'a collimator with unobstructed pupil' and an off-axis Schmidt 'by contrast', and says AAOmega's diffractive blazes are caused by 'the detector and spider in the beam'): the 'detector' obstruction is in the cameras; the slit-and-slitlet 'spider' obstruction is the collimator's. (3) The retired 2dF spectrographs had an off-axis Maksutov collimator 'with no central obstruction' (L02 Sec. 3.5), which AAOmega replaced with a Schmidt. A classical Schmidt collimator is on-axis by construction (slit at the focus on the mirror's axis, in front of the mirror). No drawing or sentence confirms the slit in the returning beam; the Smith 2004 and Saunders 2004 SPIE layout figures would. Recommended colTilt 0 (the user decides). |
| Dichroic position | in the collimated beam, upstream of the per-arm correctors |  | SOURCED | SH06, Sec. 2.3 | "incorporating a dichroic beam-splitter upstream of the corrector (this necessitates two correctors but minimises pupil relief)" | Split type for web/arms.js: 'collimated' (the dichroic stands in the collimated beam after the shared slit and collimator; each arm then has its own corrector, grating, camera and detector). |
| Camera type, focal ratio and focal length | f/1.3 Schmidt (doublet corrector, spherical mirror, S-YGH51 field flattener); 247 | mm | DERIVED | SH06, Abstract; Sec. 2.3 | "articulating red and blue f/1.3 Schmidt cameras"<br>"an f/1.3 Schmidt camera with a doublet corrector, spherical mirror, a field-flattening lens of S-YGH51 glass" | DERIVED: f_cam = 1.3 x 190 mm = 247 mm. (A web-search snippet of the AAT grating calculator, not saved, also gave 247 mm; not used as a source.) The detector sits inside the beam (a classical Schmidt camera: 'obstruction losses', S14 Sec. 1); the explorer's catadioptric 'mirror' camera drawing. Camera view: 8 deg off-axis angles; 230 mm aspheric doublet corrector plates (SH06 Sec. 2.3). |
| Gratings: type and mounting | VPH transmission gratings, 20 mm thick, in the 190 mm beam, interchangeable; most with slanted fringes |  | SOURCED | SH06, Secs. 2.3 and 3.3 | "The VPH gratings were made by Ralcon Development Lab"<br>"All gratings are 20mm thick"<br>"most of the AAOmega gratings have their internal refractive index fringes slanted" | The slant angles are NOT FOUND, so gTilt = 0. The grating is tilted slightly off Littrow to move the 0th-order ghost off the detector (SH06 Sec. 3.3: 'This ghost can be moved off the detector by tilting the grating'). |
| Camera articulation | each camera articulates; the camera angle sets the wavelength coverage |  | SOURCED | SH06, Sec. 3.3 | "The wavelength coverage for a particular grating angle is determined by the camera angle, which must hence be adjustable" | The range of camera angles is NOT FOUND in the saved sources. Camera-collimator angle for the preset: psi = 2 x grating angle (INFERRED: the published central wavelengths equal the Littrow wavelengths 2 sin(alpha) / G to 0.0-0.6% at all five grating angles with a published center, see the settings table). The explorer's transmission 'trans' type at its symmetric Bragg setting needs no psi. |

### Gratings (Table 2 of SH06; angles from S14 Table 3)

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| 580V | 580 /mm; blaze 450 nm; useful 370-580 nm; angle 8 deg; 0.1 nm/px; MOS R 1300 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "580V 450 370–580 210 8 0.1 1300"<br>"Grating angle 8° 8° 22.5° 20° 40° 40° 47°" | Line densities are the grating names (the 'V', 'R', 'I', 'B', 'D' suffix gives the blaze color). Littrow wavelength at 8 deg: 2 sin 8 deg / 0.580 = 4799 A (published center 4800: H13 'the 580V, centred at 4800Å'). |
| 385R | 385 /mm; blaze 700 nm; useful 560-880 nm; angle 8 deg; 0.16 nm/px; MOS R 1300 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "385R 700 560–880 320 8 0.16 1300" | Littrow at 8 deg: 7230 A (published center 7250: H13 'centred at 7250Å'). |
| 1500V | 1500 /mm; blaze 475 nm; useful 425-600 nm; angle 20-25 deg (22.5 in S14); 0.037 nm/px; MOS R 3700 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "1500V 475 425–600 75 20–25 0.037 3700" | Littrow at 22.5 deg: 5102 A. |
| 1000R | 1000 /mm; blaze 675 nm; useful 550-800 nm; angle 18-22.5 deg (20 in S14); 0.057 nm/px; MOS R 3400 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "1000R 675 550–800 110 18–22.5 0.057 3400" | Littrow at 20 deg: 6840 A (published center 6880 in K26: 'is centred at 6880 and 9200Å'; 20.1 deg). |
| 2500V | 2500 /mm; blaze 500 nm; useful 450-580 nm; angle 37.5-45 deg (40 in S14); 0.018 nm/px; MOS R 8000 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "2500V 500 450–580 35 37.5–45 0.018 8000" | Littrow at 40 deg: 5142 A. |
| 2000R | 2000 /mm; blaze 650 nm; useful 580-725 nm; angle 37.5-45 deg (40 in S14); 0.023 nm/px; MOS R 8000 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "2000R 650 580–725 45 37.5–45 0.023 8000" | Littrow at 40 deg: 6428 A. |
| 1700D | 1700 /mm; blaze 860 nm; useful 845-870 nm; angle 47 deg; 0.024 nm/px; MOS R 10000 |  | SOURCED | SH06; S14, SH06 Table 2; S14 Table 3 | "1700D 860 845–870 40 47∗ 0.024 10000"<br>"The 1700D Ca iii grating is a tuned to give maximum performance at 860nm" | Littrow at 47 deg: 8604 A. A Dickson-type thick grating for the Ca triplet; unsuitable at other angles. Not entered as a Setting (no blue partner; the explorer would show 8347-8845 A). |
| Other gratings in Table 2 | 1700B (400 nm, 18 deg), 3200B (400 nm, 37.5-45 deg), 1000I (875 nm, 22.5-25 deg), 1700I (860 nm, 37.5-45 deg) |  | SOURCED | SH06, Table 2 | "1700B 400 370–450 65 18 0.033 3500"<br>"3200B 400 360–450 25 37.5–45 0.014 8000"<br>"1000I 875 800–950 110 22.5–25 0.057 4400"<br>"1700I 860 725–900 50 37.5–45 0.028 8000" | Not entered. No published setting with a coverage for any of them in the saved sources. |
| Grating sizes (gLen) | not published | mm | NOT FOUND | SH06,  | "All gratings are 20mm thick" | gLen is left unset: the 190 mm beam at 47 deg has a 279 mm footprint (DERIVED, the explorer's Lg for 1700D), and the clear aperture is NOT FOUND. |

### Dichroics (for the All-arms view)

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| Standard dichroic (x5700): cut and which arm reflects | cross-over 570 nm; blue (< 570 nm) reflected to the blue arm, red transmitted | nm | SOURCED | SH06; C17; H13, SH06 Sec. 2.3, Sec. 5.8, Fig. 1; C17 Sec. 2; H13 Sec. 2 | "Only a single beam-splitter, with crossover at 570nm, is currently in use"<br>"We used the x5700 dichroic, which splits the arms at 5700 Å"<br>"poor dichroic performance on reflection" | INFERRED which arm reflects: SH06 Sec. 5.8 blames, for the blue arm's low sensitivity, 'poor dichroic performance on reflection', so the blue arm is the reflected one; Fig. 1 shows the transmittance curve (about 1% below the edge, 95-98% above), so the red passes. The split sits in the collimated beam. |
| Standard dichroic: transition width | about 15 nm (10% to 90%), measured at normal incidence | nm | MEASURED | SH06, Fig. 1 (p. 4) | "Response of the 570nm dichroic currently available for use with AAOmega. Note the abrupt transition region and generally smooth profile." | MEASURED from the figure (130 dpi render): 400 nm at pixel x = 399 and 1000 nm at x = 780 give 0.635 px/nm; the transmittance rises from 10% to 90% over about 10 px, 15 nm, centered near 610 nm. The curve is measured at NORMAL incidence ('Measured at Normal Incidence' in the legend), so its 50% point (about 610 nm) is not the working cross-over: the working angle shifts it to 570 nm. The explorer's w = 150 A (INFERRED to carry to the working angle, where the edge also narrows a little). |
| Dichroic angle of incidence | not published | deg | NOT FOUND | SH06, Fig. 1 | (figure; see note) | A shift from the 610 nm normal-incidence edge to 570 nm corresponds to roughly 35-40 deg for a coating of effective index ~1.8 (INFERRED, order of magnitude only). For arms.js enter noAoi: true (as LLAMAS and 4MOST HRS), with 45 deg only for the drawing. |
| Other dichroics | 670 nm cross-over (WiggleZ, from 2007 August; red 650-950 nm, blue 470-680 nm); selectable 570 or 670 nm (KOALA) | nm | SOURCED | D10; K26, D10 Sec. 4.1, Table 6; K26 Sec. 3 | "The original AAOmega dichroic beam splitter cuts over at 570 nm while the new dichroic has a cut over at 670 nm"<br>"separated into blue and red arms using a dichroic beam splitter, selectable at 570 or 670 nm" | Table 6 of D10: 570 nm (old): blue lambda_c 477, 370-580 nm; red 725, 560-850; 670 nm (new): blue 575, 470-680; red 815, 650-950. |

### Detectors

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| CCDs | one 2k x 4k E2V per arm (blue thinned 16 um silicon; red deep-depletion 40 um, low-fringing); long axis spatial; 15 um pixels |  | SOURCED | SH06; H13; Y15, SH06 Secs. 2.3, 2.3 (charge diffusion); H13 Sec. 2; Y15 Sec. 2 | "a 2K x 4K E2V CCD with the long axis in the spatial direction"<br>"The DD silicon thickness is 40µm, vs 16µm for the blue arm CCD"<br>"an extra contribution from charge diffusion of order 1 pixel (15µm)"<br>"the detectors were two 2k×4k E2V CCDs. These detectors were replaced with new, cosmetically superior and more efficient 2k×4k E2V CCDs during 2014" | Nx = 2048 along the dispersion, Ny = 4096 across, pix = 15 um. The pixel size is read from 'of order 1 pixel (15um)'. The 2014 replacement (both arms) keeps the format. CONFLICT: K26 says 'spectral dispersion occurs along the 4k axis', against SH06 (long axis spatial); the 3920-px fiber stack (10 px pitch x 392) and GAMA's 2100 A at 1 A/px settle it for 2048 along the dispersion. |

### Coverage

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| Wavelength coverage of the system | 370-950 nm (design); R = 1000-8000 MOS, 1500-10 000 IFU | nm | SOURCED | SH06, Abstract | "Wavelength coverage is 370 to 950nm and spectral resolution 1,000-8,000 in multi-Object mode, or 1,500-10,000 in IFU mode" | Blue limit set by the 38 m fibers' transmission (D10 Sec. 4.1), red limit by the CCD response. |
| IFU feeds | SPIRAL (512 fibers, Cassegrain); KOALA (1000 hexagonal microlenses, 0.7 or 1.25 arcsec sampling) |  | SOURCED | SH06; K26, SH06 abstract; K26 Sec. 3 | "the 512 fibre SPIRAL integral field unit (IFU) at Cassegrain focus"<br>"telecentric double-lenslet array comprising 1000 hexagonal microlenses" | Not entered: the explorer's fiber model has no lenslet IFU feed; SH06 notes the IFU resolution is higher, 'due to the smaller projected fibre diameter'. |

### Published performance

| parameter | value | unit | tag | source and location | verbatim quote | note |
|---|---|---|---|---|---|---|
| Fiber PSF on the CCD | FWHM 3.1-3.3 px (blue), 3.3-3.6 px (red); design 3.2 px; typical ~3.4 px | px | SOURCED | SH06; S10, SH06 Sec. 2.3, Sec. 5.10; S10 Sec. 3 | "with actual FWHM in the range 3.1-3.3 pixels"<br>"giving 3.3-3.6 pixels"<br>"The cameras deliver largely Gaussian profiles of FWHM∼3.4 CCD pixels" | DERIVED check (model): 140 um x 247 / 598.5 = 57.8 um = 3.85 px diameter; the explorer's equal-line-width slit is sqrt(3)/2 of it = 3.34 px, inside the published 3.1-3.6 px (not fitted: all inputs are sourced). |
| 580V + 385R (GAMA, OzDES, WiggleZ) dispersion, coverage and R | 580V 1.0 A/px, 2100 A, centered 4800; 385R 1.6 A/px, 3200 A, centered 7250; R ~ 1000 (blue end) to 1600 (red end); R ~ 1400 (OzDES); continuous 3700-8800 A |  | SOURCED | H13; C17; Y15, H13 Sec. 2; C17 Sec. 2; Y15 Sec. 2 | "dispersion of 1Å/pixel and gives a coverage of 2100Å"<br>"a dispersion of 1.6Å/pixel and gives a coverage of 3200Å"<br>"from R ≈ 1000 at the blue end up to R ≈ 1600"<br>"This setup provides continuous wavelength coverage from ∼ 3700Å to ∼ 8800Å"<br>"with a resolution of R∼1400" | ALT D10 Sec. 4.1: 'both providing a resolution of R ≈ 1300. This gives a dispersion of about 0.11 nm pixel−1 in the blue arm and 0.16 nm pixel−1 in the red arm'. ALT D11: '580V and 385R gratings with central wavelengths of 4800Å and 7250Å'; resolution 'about 3.5Å in the blue channel and about 5.5Å in the red channel'. |
| 580V and 1000R FWHM (Shapley), 1000R R (KOALA) | 580V 3.5 A FWHM from 3700-5800 A at 1.0 A/px; 1000R 1.9 A FWHM, ~1100 A, 0.6 A/px; 1000R R = 3400, 6280-7450 A at center 6880 A |  | SOURCED | SR07; K26, SR07 Sec. 2; K26 Sec. 3 | "delivering a nominal resolution of 3.5Å FWHM from 3700–5800 Å, sampled at 1.0Å per pixel"<br>"the nominal resolution is 1.9Å"<br>"The 1000R grating provides a resolving power of R ≃ 3400 and is centred at 6880 and 9200 Å, yielding spectral coverage over the ranges 6280–7450 Å" | Independent tests of the settings below (the angle comes from S14 Table 3, the centers and coverage from other papers). |
| Throughput | peak 21% (red) and 16% (blue) at commissioning (75% and 50% of expectation) |  | SOURCED | SH06, Sec. 5.1 | "the red arm is currently performing at 75% of the expected sensitivity (21% peak efficiency)" | A 2006 commissioning value; the blue arm improved later. Not an explorer quantity. |
| Table 2 'MOS Resolution' (design values, not arc measurements) | 580V 1300; 385R 1300; 1700B 3500; 1500V 3700; 1000R 3400; 1000I 4400; 3200B/2500V/2000R/1700I 8000; 1700D 10 000 |  | SOURCED | SH06, Table 2 | "580V 450 370–580 210 8 0.1 1300"<br>"1700D 860 845–870 40 47∗ 0.024 10000" | Which of design, geometric or measured is not stated: treated as GEOMETRIC/nominal. |
| Calibration accuracy | wavelength calibration better than a tenth of a pixel |  | SOURCED | SH06, Sec. 5.9 | "Results are currently measured to better than a tenth of a pixel" |  |

## Optical layout (from the published text; no layout figure was available)

**No layout drawing could be saved.** Sharp et al. 2006 has three figures (Fig. 1 the dichroic's transmittance, Fig. 2 two fiber PSFs, Fig. 3 a raw CCD frame) and no layout. The layout figures are in the two SPIE design papers of 2004 (Smith et al., SPIE 5492, 410, DOI 10.1117/12.551013; Saunders et al., SPIE 5492, 389, DOI 10.1117/12.550871), behind the SPIE paywall with no preprint found. Every element below is therefore SOURCED from text, and every distance SCHEMATIC.

1. **Slit unit** (SOURCED, SH06 Sec. 2.3): a 145 mm curved fiber slit built of 90 slitlets, a field lens gelled to the slitlets (making the beam pupil-centric), a flag shutter in front.
2. **Schmidt collimator** (SOURCED, f/3.15, 190 mm pupil; mirror type INFERRED): a spherical mirror, ON-AXIS by INFERENCE from the obstruction-loss statements (the slit stands in the returning beam). The dichroic follows in the collimated beam, upstream of the correctors (SOURCED).
3. **Dichroic** (SOURCED position; blue reflected INFERRED): one beam-splitter, 570 nm; the blue goes to the blue arm, the red passes to the red arm. The angle is not published (the explorer's drawing uses 45 deg, SCHEMATIC).
4. **Per-arm Schmidt corrector** (SOURCED: 'this necessitates two correctors'), then the **VPH grating** in the collimated beam (SOURCED, 20 mm thick, interchangeable, articulating), the camera angle 2 x grating angle (INFERRED).
5. **Camera** (SOURCED, f/1.3 Schmidt: doublet corrector, spherical mirror, S-YGH51 field flattener, CCD in the beam; 8 deg off-axis field angles), articulating about the grating.
6. **Detector**: one 2k x 4k E2V per arm, long axis spatial.

Suggested drawing values (drawing only): colTilt 0; layLen 1197 mm = 2 f_col, the Schmidt condition that puts the grating at the mirror's center of curvature (INFERRED, as Viaspec's 2750 mm = 2 f_col); camLen NOT FOUND (unset); cam 'mirror' (the catadioptric camera with an internal focus, as Hectospec).


## Recommended presets

Era: 2006 to the present (first light of the spectrograph November 2005; routine science from February 2006; the CCDs of both arms were replaced during 2014 with the same 2k x 4k E2V format). The explorer's preset menu offers one line per grating pair, each pair with its blue and red Setting (names below are at most 9 characters); the pairs share the 570 nm (x5700) dichroic. The 580V + 385R pair is the most used (GAMA about 300 000 spectra; WiggleZ; OzDES; the AAT's default for galaxy surveys): R ~ 1300 with continuous 3700-8800 A coverage in one exposure. The high-resolution pair is 2500V + 2000R (R ~ 8000 at 0.18 and 0.23 A/px, the Table 2 high-resolution set at 40 deg); 1500V + 1000R is the medium pair (R ~ 3400-3700, with published coverage and R for 1000R). 1700D (R ~ 10 000 at 860 nm, the Ca triplet) is left out as a Setting (a single red grating with no blue partner). The 2dF-fed MOS mode is entered; the SPIRAL and KOALA IFU feeds are not.


| id | inst (Preset menu) | Setting | G (/mm) | grating angle (deg) | camera angle psi (deg) | lamC (A) | model coverage (A) | model dispersion (A/px) | model R | why |
|---|---|---|---|---|---|---|---|---|---|---|
| aao580v | AAOmega 580V/385R | blue 580V | 580 | 8.0 | 16.0 | 4799 | 3735-5854 | 1.037 | 1387 | The GAMA, WiggleZ and OzDES blue setup (H13, D11, D10, C17): the most used AAOmega grating (the survey workhorse, about 300 000 GAMA spectra), with R ~ 1300 over 3700-5800 A. |
| aao385r | AAOmega 580V/385R | red 385R | 385 | 8.0 | 16.0 | 7230 | 5626-8819 | 1.562 | 1387 | The matching red arm (385R, centered 7250 A): the pair gives continuous 3700-8800 A at R ~ 1000-1600 with the x5700 dichroic. |
| aao1500v | AAOmega 1500V/1000R | blue 1500V | 1500 | 22.5 | 45.0 | 5102 | 4715-5480 | 0.374 | 4089 | Medium resolution (R ~ 3700, Table 2); the grating angle 22.5 deg is from S14 Table 3; no published coverage, so only its dispersion is tested. |
| aao1000r | AAOmega 1500V/1000R | red 1000R | 1000 | 20.0 | 40.0 | 6840 | 6251-7417 | 0.571 | 3593 | Medium-resolution red (R ~ 3400): coverage 6280-7450 A, 1.9 A FWHM, R 3400 published (K26, SR07), an independent test. |
| aao2500v | AAOmega 2500V/2000R | blue 2500V | 2500 | 40.0 | 80.0 | 5142 | 4947-5328 | 0.186 | 8283 | The high-resolution blue grating (R ~ 8000, 0.018 nm/px). |
| aao2000r | AAOmega 2500V/2000R | red 2000R | 2000 | 40.0 | 80.0 | 6428 | 6184-6659 | 0.233 | 8283 | The high-resolution red grating (R ~ 8000, 0.023 nm/px). |

State common to all: `mode grating, D 3.893, F 3.15, slitW 2.039, nObj 392, col mirror, colTilt 0, W 190, fcam 247, cam mirror, gType trans, gKind vph, gTilt 0, m 1, tAlpha null, Nx 2048, Ny 4096, pix 15, telF 3.5, fibAp 2.1, layLen 1197 (INFERRED), lamB1 = lamC`; lamC is the Littrow wavelength 2 sin(alpha) / G (DERIVED). slitW = sqrt(3)/2 x 140 um / (3.15 x 3893 mm) x 206 265 = 2.039 arcsec. Model values come from `web/physics.js` (scratch `model.js`).

### All-arms group (web/arms.js GROUPS)

- `"AAOmega 580V/385R"`: { split: "collimated", tree: { cut: 5700, w: 150, aoi: 45, noAoi: true, src: "SH06 Sec. 2.3, Fig. 1 (570 nm; width MEASURED, 15 nm; AOI NOT FOUND); H13/C17 x5700; blue reflected INFERRED (SH06 Sec. 5.8)", R: "aao580v", T: "aao385r" } }
- `"AAOmega 1500V/1000R"`: same tree with R: "aao1500v", T: "aao1000r" (the arms leave a gap 5480-6251 A at 5700 A)
- `"AAOmega 2500V/2000R"`: same tree with R: "aao2500v", T: "aao2000r" (gap 5328-6184 A)

Split type: `collimated` (the dichroic in the collimated beam, upstream of each arm's corrector, after one shared slit and collimator). One dichroic, cut 5700 A, width 150 A (MEASURED from SH06 Fig. 1), blue reflected (INFERRED), angle NOT FOUND (`noAoi: true`). A 670 nm dichroic (WiggleZ) also exists; not entered.

## Published performance (validation targets)

| what | quantity | value | tolerance | source and model result |
|---|---|---|---|---|
| fiber image FWHM 3.1-3.6 px (3.4 typical) | npix | 3.4 | 0.1 | SH06 Sec. 2.3, 5.10; S10: model 3.34 (-1.8%); not fitted (140 um core, f/1.3 / f/3.15) |
| 580V dispersion 1.0 A/px | dlpix | 1.0 | 0.05 | H13 Sec. 2; SH06 Table 2 (0.1 nm/px): model 1.037 (+3.7%) |
| 385R dispersion 1.6 A/px | dlpix | 1.6 | 0.05 | H13 Sec. 2; SH06 Table 2 (0.16): model 1.562 (-2.4%) |
| 580V coverage 2100 A | span | 2100 | 0.03 | H13 Sec. 2: model 2119 (+0.9%) |
| 385R coverage 3200 A | span | 3200 | 0.03 | H13 Sec. 2: model 3193 (-0.2%) |
| blue arm coverage starts ~3700 A | lo | 3700 | 0.03 | H13/C17 'continuous ... from ~3700 A to ~8800 A': model 3735 (+0.9%); 580V at 4799 A |
| red arm coverage ends ~8800 A | hi | 8800 | 0.03 | C17 Sec. 2; Y15: model 8819 (+0.2%); 385R at 7230 A |
| 580V R = lambda / 3.5 A = 1371 at 4800 A | R | 1371 | 0.05 | SR07 Sec. 2 (nominal FWHM): model 1387 (+1.2%) |
| 1000R coverage from 6280 A | lo | 6280 | 0.02 | K26 Sec. 3 (center 6880 A): model 6251 (-0.5%) |
| 1000R coverage to 7450 A | hi | 7450 | 0.02 | K26 Sec. 3: model 7417 (-0.4%) |
| 1000R R = 3400 | R | 3400 | 0.08 | K26 Sec. 3; SH06 Table 2: model 3593 (+5.7%) |
| 1000R R = 6880/1.9 A = 3621 | R | 3621 | 0.05 | SR07 Sec. 2: model 3593 (-0.8%) |
| 1500V 0.037 nm/px | dlpix | 0.37 | 0.05 | SH06 Table 2: model 0.374 (+1.1%) |
| 1000R 0.057 nm/px | dlpix | 0.57 | 0.05 | SH06 Table 2: model 0.571 (+0.1%) |
| 2500V 0.018 nm/px | dlpix | 0.18 | 0.05 | SH06 Table 2: model 0.186 (+3.4%) |
| 2000R 0.023 nm/px | dlpix | 0.23 | 0.05 | SH06 Table 2: model 0.233 (+1.1%) |
| R 1300 (580V/385R), 3700 (1500V), 8000 (2500V/2000R) MOS 'resolution' | R | info | info | SH06 Table 2: model 1387 (+7%), 4089 (+11%), 8283 (+4%): a geometric R from the full-round-fiber width; the table is nominal |
| 1700D R 10 000, 0.024 nm/px (not a Setting) | info | info | info | SH06 Table 2: a 1700D run of the same state (47 deg, 8604 A) gives R 10 585 (+5.9%), 0.244 A/px (+1.5%), coverage 8347-8845 A (the table's 'coverage 40 nm' is a usable range) |
| pixel scale along the slit: 15 um per 36.3 um on the slit = 0.542 arcsec at 67 um/arcsec | pixScale | info | info | DERIVED from L02 Table 1; the virtual F = 3.15 gives 0.611 arcsec/px (+13%), because the fibers see f/3.5 on the sky but the explorer enters them at the collimator's f/3.15 |

## NOT FOUND

- A published optical layout figure of AAOmega: Smith et al. 2004 (SPIE 5492, 410; DOI 10.1117/12.551013; 2004SPIE.5492..410S) and Saunders et al. 2004 (SPIE 5492, 389; DOI 10.1117/12.550871; 2004SPIE.5492..389S) are behind the SPIE paywall and no preprint was found; SH06 has no layout figure.
- The AAT/AAO AAOmega manual and grating calculator (aat.anu.edu.au/files/2dF-AAOmega-obs-manual_4.pdf; aat.anu.edu.au/cgi-bin/aaomega_calc.cgi): the AAT web site served only 'our website is offline awaiting patches for the recent PHP security issues' on 2026-11-18, so no manual was saved (the camera focal length 247 mm, the allowed camera-angle range 0-94.3 / 0-95.3 deg and the grating-angle range 0-49 deg, seen in a search snippet of the calculator, are therefore unverified).
- Collimator focal length and camera focal length as stated lengths (both DERIVED from f-ratio x 190 mm).
- Dichroic angle of incidence and any sentence stating that the collimator is on-axis or that the slit stands in the returning beam.
- Distances: slit to collimator, collimator to grating, grating to camera, camera angle limits; grating clear apertures (gLen); fringe slant angles.
- Fiber output focal ratio (the f/3.15 collimator speed is the design intent, L02 for the retired 2dF spectrographs and SH06).
- Camera angle used for each published setting (psi = 2 x grating angle is INFERRED from the Littrow centers).

## Conflicts between sources

- Dispersion axis of the CCDs: SH06 Sec. 2.3 'with the long axis in the spatial direction' (and 392 spectra x 10 px = 3920 px; GAMA 2100 A at 1 A/px) against K26 Sec. 3 'spectral dispersion occurs along the 4𝑘 axis'. Adopted: 2048 px along the dispersion.
- Dichroic cross-over: 570 nm (SH06, D10, Y15, K26) against '5700 A' (H13, D11, C17, 'x5700'): the same dichroic in nm and in A. D10 Table 6 gives its blue range as 370-580 nm, red 560-850 nm (overlap).
- Fiber size on the sky: 2.1 arcsec mean (L02 Table 1; 2.16 at the center, 2.0 at the edge) against 2 arcsec (D10 Sec. 4.1).
- Resolving power of 580V + 385R: 1300 (SH06 Table 2, D10), 1000-1600 across the range (H13), ~1400 (Y15 OzDES), 3.5 A FWHM blue and 5.5 A red (D11: R = 1371 and 1318).
- Grating angle 580V/385R 8 deg (SH06 Table 2 and S14 Table 3) with Littrow centers 4799 and 7230 A against published centers 4800 and 7250 A (0.0% and 0.3%); 1000R 20 deg gives 6840 against 6880 (0.6%).
- Fiber PSF FWHM: 3.2 px design, 3.1-3.3 (blue) and 3.3-3.6 (red) measured, ~3.4 typical (SH06, S10).
- 1700D coverage: SH06 Table 2 gives 40 nm; 2048 px x 0.24 A/px = 49 nm (the table lists the usable range).

## Notes

- **What the explorer cannot represent:** the field lens and curved slit, one corrector plate per arm after the dichroic (the model has a single collimator and mirror), the slanted VPH fringes and the small off-Littrow grating tilt that throws the 0th-order ghost off the CCD (gTilt = 0), the camera's detector obstruction (drawn by cam 'mirror' only), the IFU feeds (SPIRAL 512 fibers; KOALA 1000 lenslets), the 670 nm dichroic, and the real 67 um/arcsec scale (the virtual F = 3.15 gives 16.8 arcsec/mm at the slit against the true 14.9; pixScale 0.611 arcsec/px against 0.542).
- **Aperture:** D = 3.893 m, the AAT's (WD85), which the explorer's AAT UHRF presets also use; the telescope box shows f/3.5 and 2.1 arcsec (telF 3.5, fibAp 2.1); the fibers enter the collimator at f/3.15 (the virtual convention, as BOSS and LAMOST). No pupil that varies with the track.
- **Dispersion axis:** K26's 'along the 4k axis' is wrong or loosely worded; Nx = 2048.
- **Central wavelength:** lamC is the Littrow wavelength 2 sin(alpha) / G of the grating angle of S14 Table 3; the published centers (4800 and 7250 A for 580V and 385R; 6880 A for 1000R) agree to 0.0-0.6%. The camera angle is set by the center, the grating angle by the blaze; the same center can be reached at different grating angles with a different efficiency, which the explorer does not model.
- **Why the pair is the GAMA/OzDES one:** its coverage is continuous, it is the most used, and it has the most independent published numbers (H13, D11, D10, C17, Y15).
- **Papers to supply (paywalled):** Saunders, W., et al. 2004, Proc. SPIE 5492, 389, 'AAOmega: a scientific and optical overview' (2004SPIE.5492..389S, https://doi.org/10.1117/12.550871); Smith, G. A., et al. 2004, Proc. SPIE 5492, 410, 'AAOmega: a multipurpose fiber-fed spectrograph for the AAT' (2004SPIE.5492..410S, https://doi.org/10.1117/12.551013). These would give the layout figure, distances, the collimator type and on-axis statement, the dichroic angle and the camera-angle range. Also the AAT manual https://aat.anu.edu.au/files/2dF-AAOmega-obs-manual_4.pdf (site offline today).

## Decision (2026-11-18)

The collimator is entered as ON-AXIS (colTilt 0, the fiber slit in the returning beam), by the user's call: no source states it,
and the evidence above (obstruction losses from the detector and spider in the beam; Hector's unobstructed off-axis
Schmidt chosen in contrast) points that way. The COL_AXIS row in validate.js should cite this record as INFERRED.
