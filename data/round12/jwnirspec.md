# Round 12 (2026-11-18): NIRSpec, the Near-Infrared Spectrograph on the James Webb Space Telescope (id `jwnirspec`)

Same rules as rounds 1-11 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/jwnirspec/`; each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so that the explorer reproduces published performance where the prescription is unpublished (the camera focal length 304.6 mm from the published pixel scale, and the G140H chip-center wavelength); **INFERRED** marks a reading that is not stated (the collimator is off-axis; psi = 0; the 33 deg equivalent prism is DERIVED); **MEASURED** is read from a figure or a measurement; **SCHEMATIC** is a layout element with no source dimensions. Quotes were machine-checked against `pdftotext -layout` and `-raw` text of the saved PDFs and the tag-stripped text of the saved JDox pages (whitespace, case, quotes, dashes, hyphenation and ligatures normalized; ' ... ' joins non-adjacent pieces): **139 quote pieces, 0 failures**. The PDFs have text layers whose arcsecond, arcminute and degree marks are lost (printed as '00', '0' or '◦ .'); quotes avoid those glyphs and the values are stated in the notes. The JDox FITS tables are binary: their rows are cited as table values and not quote-checked.

## Completeness summary

**Complete from open sources:** the telescope and feed (6.5 m, f/20 OTE, f/12.5 at the slit plane), the slit devices (MSA shutters 199 x 461 mas, the fixed slits, the IFU), the collimator's beam (about 56 mm) and type (a three-mirror anastigmat), the six gratings (ruling, blaze, order, 70 mm ruled area), the conical incidence (16.4 deg), the double-pass CaF2 prism (16.5 deg wedge, 80 mm), CaF2's cryogenic Sellmeier fit, the camera's focal ratio (f/5.67), the two H2RG detectors (18 um, 2.8 mm gap, 103 x 105 mas pixels), the coverage and R for every mode, and the JDox dispersion and R tables (a free, quantitative validation set).

**Gaps that matter:** (1) no focal lengths, tilts or distances for the three TMAs: the collimator f = 700 mm is DERIVED (12.5 x 56) and the camera f = 304.6 mm is EFFECTIVE (the published 105 mas pixel scale); the layout is a ray trace to no scale (layLen and camLen are left to the defaults); (2) the grating mount is conical (16.4 deg out of the dispersion plane) and the explorer's grating mode cannot represent it (psi = 0, dispersion -2 to -4 % of JDox); (3) the collimator's off-axis character is INFERRED from the ray trace, no source says it (deploy gate: it needs the user's call); (4) the explorer models the slit-filling case: point sources are 1.09-1.35 times higher in R in flight; (5) the prism's glass CaF2 is not in the explorer's list and needs the new entry given below.

**Paywalled or not obtained:** none of the key documents. SPIE optical-design papers (Geyl et al. 2011; Bagnasco et al. 2007; te Plate et al. 2005) and Tropf 1995 (Opt. Eng. 34, 1369, ADS 1995OptEn..34.1369T) are behind publisher walls and were not needed; they would give the TMA prescriptions the sources lack. Please supply the PDFs if wanted.

**Status:** in operation; no '(design)' tag.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| J22 | Jakobsen, P., Ferruit, P., Alves de Oliveira, C., et al. 2022, A&A 661, A80, "The Near-Infrared Spectrograph (NIRSpec) on the James Webb Space Telescope. I. Overview of the instrument and its capabilities" (ADS 2022A&A...661A..80J; title checked on ADS 2026-11-18; arXiv:2202.03305). Secs. 2.1-2.8 (optics, slit plane, collimator, dispersers, camera, detectors, coverage), Tables 1-4, Figs. 1, 2, 4, 5, 6, 10 | `rawdata/presets/jwnirspec/jakobsen2022.pdf` | https://arxiv.org/pdf/2202.03305 |
| F22 | Ferruit, P., Jakobsen, P., Giardino, G., et al. 2022, A&A 661, A81, "The Near-Infrared Spectrograph (NIRSpec) on the James Webb Space Telescope. II. Multi-object spectroscopy (MOS)" (ADS 2022A&A...661A..81F; arXiv:2202.03306). Abstract, Sec. 2.2 (MSA shutters), Sec. 3 (multiplexing) | `rawdata/presets/jwnirspec/ferruit2022.pdf` | https://arxiv.org/pdf/2202.03306 |
| B22 | Boeker, T., Arribas, S., Luetzgendorf, N., et al. 2022, A&A 661, A82, "The Near-Infrared Spectrograph (NIRSpec) on the James Webb Space Telescope. III. Integral-field spectroscopy" (ADS 2022A&A...661A..82B; arXiv:2202.03308). Sec. 2 (slicer; not used by the preset, saved for the IFU note) | `rawdata/presets/jwnirspec/boker2022_ifu.pdf` | https://arxiv.org/pdf/2202.03308 |
| BK22 | Birkmann, S. M., Ferruit, P., Giardino, G., et al. 2022, A&A 661, A83, "The Near-Infrared Spectrograph (NIRSpec) on the James Webb Space Telescope. IV. Capabilities and predicted performance for exoplanet characterization" (ADS 2022A&A...661A..83B; arXiv:2202.03309). Saved; no value taken from it | `rawdata/presets/jwnirspec/birkmann2022.pdf` | https://arxiv.org/pdf/2202.03309 |
| B23 | Boeker, T., Beck, T. L., Birkmann, S. M., et al. 2023, PASP 135, 038001, "In-orbit Performance of the Near-infrared Spectrograph NIRSpec on the James Webb Space Telescope" (ADS 2023PASP..135c8001B; arXiv:2301.13766). Sec. 2 and Fig. 1 (layout, dimensions), Sec. 3 (commissioning) | `rawdata/presets/jwnirspec/boker2023_inflight.pdf` | https://arxiv.org/pdf/2301.13766 |
| L08 | Leviton, D. B., Frey, B. J., & Madison, T. J. 2008, "Temperature-dependent refractive index of CaF2 and Infrasil 301" (ADS 2008arXiv0805.0096L; arXiv:0805.0096; NASA GSFC CHARMS; arXiv copy, 11 pages). Table 5: Sellmeier coefficients, 25-300 K, 0.40-5.6 um; Table 1: indices | `rawdata/presets/jwnirspec/leviton2008_caf2.pdf` | https://arxiv.org/pdf/0805.0096 |
| G25 | Glidic, K., et al. 2025, JWST-STScI-009239, "Verifying the NIRSpec Wavelength Calibration and Resolving Power for Multi-Object Spectroscopy" (ADS 2025jwst.rept.9239G; STScI technical report; program 6642). Sec. 5 and Table 5.1: in-flight point-source resolving powers | `rawdata/presets/jwnirspec/glidic2025_resolving_power.pdf` | https://ui.adsabs.harvard.edu/link_gateway/2025jwst.rept.9239G/PUB_PDF |
| Z26 | Zhou, H., Wang, X., Pang, Y., et al. 2026, A&A (Letter), "An empirical calibration of the spectral resolution of JWST NIRSpec PRISM" (ADS 2026arXiv261013492Z; arXiv:2610.13492v2, 12 Oct 2026). Sec. 4, Eq. 1 | `rawdata/presets/jwnirspec/zhou2026_prism_R.pdf` | https://arxiv.org/pdf/2610.13492 |
| JDF | STScI, JWST User Documentation (JDox), "NIRSpec Dispersers and Filters" (fetched 2026-11-18; Tables 1-2, text) | `rawdata/presets/jwnirspec/jdox_dispersers_filters.html` | https://jwst-docs.stsci.edu/jwst-near-infrared-spectrograph/nirspec-instrumentation/nirspec-dispersers-and-filters |
| JDP | STScI, JDox, NIRSpec prism dispersion and resolving-power table (binary FITS, 1001 rows: wavelength um, DLDS um/pixel, R; 'based on Jakobsen et al (2022)', linked from JDF; read with a scratch parser, no text layer) | `rawdata/presets/jwnirspec/jdox_jwst_nirspec_prism_disp.fits` | https://jwst-docs.stsci.edu/files/216455634/216455648/1/1762452062676/jwst_nirspec_prism_disp.fits |
| JDG | STScI, JDox, NIRSpec grating dispersion and resolving-power tables (binary FITS, same layout): jdox_jwst_nirspec_g140m_disp.fits, g140h, g235m, g235h, g395m, g395h | `rawdata/presets/jwnirspec/jdox_jwst_nirspec_g395m_disp.fits` | https://jwst-docs.stsci.edu/jwst-near-infrared-spectrograph/nirspec-instrumentation/nirspec-dispersers-and-filters (links under 'Dispersion curves for the NIRSpec dispersers') |
| JDD | STScI, JDox, "NIRSpec Detectors" (fetched 2026-11-18) | `rawdata/presets/jwnirspec/jdox_detectors.html` | https://jwst-docs.stsci.edu/jwst-near-infrared-spectrograph/nirspec-instrumentation/nirspec-detectors |
| JDS | STScI, JDox, "NIRSpec Fixed Slits" (fetched 2026-11-18; Table 1) | `rawdata/presets/jwnirspec/jdox_fixed_slits.html` | https://jwst-docs.stsci.edu/jwst-near-infrared-spectrograph/nirspec-instrumentation/nirspec-fixed-slits |
| JDO | STScI, JDox, "NIRSpec Optics" (fetched 2026-11-18) | `rawdata/presets/jwnirspec/jdox_optics.html` | https://jwst-docs.stsci.edu/jwst-near-infrared-spectrograph/nirspec-instrumentation/nirspec-optics |
| JDT | STScI, JDox, "JWST Telescope" (fetched 2026-11-18) | `rawdata/presets/jwnirspec/jdox_telescope.html` | https://jwst-docs.stsci.edu/jwst-observatory-hardware/jwst-telescope |

Also saved, not cited: jdox_instrumentation.html, jdox_msa.html, jdox_fs_ranges.html, jdox_mos_ranges.html (JDox pages whose wavelength-gap figures are images), jdox_jwst_nirspec_g140m/g140h/g235m/g235h/g395h_disp.fits (cited as JDG), birkmann2022.pdf.

## Recommended presets

One Preset-menu line, telescope group 'JWST 6.5 m' (new: D 6.5 m, telF 20), three Settings with short names (at most 16 characters), no All-arms group, no '(design)'. The explorer's F is 12.5 (the slit plane).

| id | Preset line / Setting | slit | coverage (explorer) | lamC (A) | model dispersion, R, npix at lamC | why |
|---|---|---|---|---|---|---|
| jwnirspecprism | NIRSpec / PRISM | MSA shutter 0.199 arcsec | 0.6-5.3 um (filt) | 17800 (INFERRED: sqrt(0.6 x 5.3) = 1.78 um; the dispersion changes by <0.2 % for lamC 1.5-3.0 um) | 165 A/px, R 34.6 (1.1 um), 143 (3.5 um); npix 1.89 | the instrument's signature disperser; the model reproduces JDox's dispersion curve to 1 % |
| jwnirspecg395m | NIRSpec / G395M | MSA shutter 0.199 arcsec | 2.88-5.3 um (filt) | 37000 (the blaze wavelength, SOURCED) | 17.4 A/px, R 1001; npix 1.90 | the coarsest ruling; R~1000 with the MSA, the main multiplex mode |
| jwnirspecg140h | NIRSpec / G140H | S200A1 0.193 arcsec | 0.98-1.9 um (filt and chip) | 14250 (EFFECTIVE: the midpoint of 0.98-1.87 um, Table 4) | 2.30 A/px, R 3276; npix 1.84 | the finest ruling, R~2700 with a fixed slit |

Shared state: mode grating, D 6.5, F 12.5, nObj as in the notes (prism 190, G395M 55, G140H 1), col mirror (OFF-AXIS, INFERRED: colTilt left unset so the automatic tilt applies), cam mirror, W 56 mm (SOURCED), fcam 304.6 mm (EFFECTIVE), Nx 4236 (2 x 2040 responsive + 156 gap px), Ny 2040, pix 18 um. Gratings: gType refl, m 1, psi 0 (INFERRED), tAlpha null, gLen 70 (SOURCED), lamB1 the catalog blaze wavelength (37000 and 13000 A). Prism: gType prism, gGlass 'CaF2-37K' (new, below), pA 33 (DERIVED), pN 1. filt = [long-pass cut-on, 53000 A].

| field | PRISM | G395M | G140H |
|---|---|---|---|
| slitW (arcsec) | 0.199 | 0.199 | 0.193 |
| nObj | 190 | 55 | 1 |
| G (/mm) / glass | CaF2-37K, apex 33 | 33.82 | 252.29 |
| lamB1 (A) | - | 37000 | 13000 |
| lamC (A) | 17800 | 37000 | 14250 |
| filt (A) | 6000-53000 | 28800-53000 | 9800-53000 |
| gLen (mm) | - | 70 | 70 |

Alternative for the gratings (the user's call): psi = 32.8 deg (see the Notes); not recommended as the default because it distorts the slit image and the dispersion.

## NIRSpec parameters

| parameter | value | unit | tag | source and location | verbatim quote |
|---|---|---|---|---|---|
| Status and era | in operation; commissioning concluded 185 days after launch; the preset represents the instrument as documented by JDox (2026) and the 2022 overview papers |  | SOURCED | B23, Sec. 3 | "the NIRSpec commissioning campaign successfully concluded 185 days after launch" |
|  | NOTE: No '(design)' tag. The launch date and the start of science operations are not in the saved sources and are not used. Detector, MSA and optics are the as-built flight hardware (J22 Sec. 2.6: the first detector pair and MSA were replaced before delivery). | | | | |
| Telescope aperture D | 6.5 | m | SOURCED | JDT, Primary mirror section | "act as a single mirror ~6.5 m in diameter" |
|  | ALT: JDT, Primary mirror section: "The primary mirror serves as the aperture stop for most JWST observing modes" | | | | |
|  | NOTE: The 18 hexagonal segments are not circular; 6.5 m is the effective circular size the explorer uses. The limiting pupil of the whole train is the OTE primary (B23 Sec. 2). | | | | |
| Telescope focal ratio at the OTE focus | 20 | focal ratio | SOURCED | JDT, OTE section | "The effective focal ratio of the OTE is f/20" |
|  | ALT: J22, Fig. 10 (schematic labels): "Slit Plane (f/12.5) Collimator Grating Wheel Camera Detector Array (f/5.67) Telescope Focus (f/20)" | | | | |
|  | NOTE: Telescope-group value (telF 20). NIRSpec's pick-off periscope and the foreoptics re-image this focus at a different ratio, below. | | | | |
| Focal ratio at NIRSpec's slit plane (the explorer's F) | 12.5 | focal ratio | SOURCED | J22, Sec. 2.1, p. 4 | "the chief rays of the refocused f/12.5 beams from all points in the NIRSpec field of view are perpendicular to the Slit Plane" |
|  | ALT: J22, Sec. 2.3, p. 7: "the nominally f/12.5 exit beams emerging from the slits" | | | | |
|  | NOTE: Telecentric: 'the image scale in the Slit Plane insensitive to changes in the telescope focus'. The explorer's F is this f/12.5 with D = 6.5 m (the pupil of the preset), so the slit angle and the plate scale come out right. | | | | |
| Plate scale at the slit plane | 2.539 (model, f/12.5 on 6.5 m); 2.551 (MSA, published open area); 2.552 (MSA, pitch) | arcsec/mm | DERIVED | F22, Sec. 2.2, p. 3 | "These physical sizes translate to a predicted average on-sky projection of 268 mas × 530 mas for the pitch" |
|  | ALT: F22, Sec. 2.2, p. 3: "Each shutter of the MSA has a pitch (distance between the centres of two adjacent apertures) of 105µm in the axis of dispersion" | | | | |
|  | ALT: F22, Sec. 2.2, p. 3: "open area per shutter measuring 78µm × 178µm" | | | | |
|  | NOTE: DERIVED: 206265 / (6500 mm x 12.5) = 2.5386 arcsec/mm; MSA pitch 268 mas / 105 um = 2.552 arcsec/mm; open area 199 mas / 78 um = 2.551 arcsec/mm (the model is 0.5 % low: f/12.5 is 'nominal'). Not entered; the explorer's plate scale follows D and F. | | | | |
| Pick-off mirrors and periscope | two flat mirrors, the first inside a field stop, steer the NIRSpec part of the OTE focal surface into the instrument |  | SOURCED | J22, Sec. 2, p. 2 | "preceded by a two-mirror periscope that steers the portion of the JWST focal surface sampled by its first pick-off mirror into the instrument" |
|  | NOTE: Field stop 3.6 x 3.4 arcmin (J22 Sec. 2.1 prints '30 .6×30 .4': the arcminute marks come out as '0' in the text layer; the field 3'.6 x 3'.4 is consistent with the quadrant sizes in F22 and with the MSA total). | | | | |
| Foreoptics | a three-mirror anastigmat with an eight-position filter wheel at its pupil (70 mm filters in a ~56 mm beam) and a two-mirror focus mechanism, re-imaging the tilted best-fit plane of the telescope focal sphere onto the flat slit plane (Scheimpflug) |  | SOURCED | J22, Sec. 2.1, p. 4 | "The 70 mm diameter filters are inserted in the ≃56 mm beam at the Foreoptics pupil location" |
|  | ALT: J22, Sec. 2, p. 3: "three-mirror anas-tigmats employing high-order aspherical surfaces" | | | | |
|  | ALT: JDO, Fore optics paragraph: "It re-images a portion of the curved OTE focal surface through the FWA and onto the flat aperture plane" | | | | |
|  | NOTE: Drawing note only (the explorer has no foreoptics). The field is rotated 41.5 deg relative to NIRCam (J22 Sec. 2.1). | | | | |
| Slit devices at the slit plane | MSA (four quadrants, 365 x 171 shutters), five fixed slits, IFU entrance |  | SOURCED | J22, Sec. 2.2, p. 4 | "single object long slit spectroscopy employing one of five Fixed Slits, and spatially resolved two-dimensional spectroscopy" |
|  | ALT: J22, Sec. 2.2.1, p. 4: "four quadrants of 365 × 171 individually addressable shutters" | | | | |
| MSA shutter: width and height on the sky; pitch and open area at the slit plane | 199 x 461 mas open; 78 x 178 um open; pitch 105 um (dispersion) x 204 um (spatial) |  | SOURCED | J22, Sec. 2.2.1, p. 5 | "the mean angular extent of the shutter open area on the sky is 199 mas × 461 mas" |
|  | ALT: J22, Sec. 2.2.1, p. 5: "The arrays have a shutter pitch of 105µm in the dispersion direction and 204µm in the perpendicular spatial direction" | | | | |
|  | ALT: F22, Abstract: "open areas on the sky measure 0.2000 × 0.4600 on a 0.2700 × 0.5300 pitch" | | | | |
|  | NOTE: The preset's slit width for the MSA settings is 0.199 arcsec (the mean open width; it varies 2.9 % across the field, J22 Sec. 2.2.1). The shutter is 0.461 arcsec (4.4 detector pixels) tall; three-shutter slitlets are common (F22). The explorer's slit length is not used by the presets. The shutter width 78 um projects to about two pixels: 'the micro-shutter width of 78µm projects geometrically to approximately two pixels on the detectors' (F22 Sec. 2.2). | | | | |
| Fixed slit S200A1 (used for the G140H setting) | 0.193 wide x 3.274 tall (J22 Table 1); JDox rounds to 0.2 x 3.3 | arcsec | SOURCED | J22, Table 1, p. 6 | "S200A1 193 3274" |
|  | ALT: JDS, Table 1: "S200A1 0.2 3.3" | | | | |
|  | ALT: J22, Sec. 2.2.2, p. 5: "The two workhorse slits are S200A1 and S200A2" | | | | |
|  | NOTE: Other fixed slits (J22 Table 1, mas): S200A2 194 x 3303, S400A1 395 x 3759, S1600A1 1603 x 1599, S200B1 201 x 3301. The S200 slits are 'primarily intended for kinematic studies of single extended objects in R=2700 mode' (J22 Sec. 2.2.2), so the R2700 setting uses S200A1. S200A1 and S200A2 are offset in the dispersion direction to bridge the detector gap. | | | | |
| Number of spectra on the detector (nObj) | prism MOS about 150-230 (the preset: 190, the midpoint); R=1000 MOS about 50-60 (55); fixed slit 1 | spectra | DERIVED | F22, Sec. 3.1, p. 9 | "non-overlapping low resolution galaxy spectra to be observed simultaneously in each exposure" |
|  | ALT: F22, Sec. 3.1, p. 9: "capturing n̄SP ≃50 − 60 non-overlapping intermediate resolution" | | | | |
|  | NOTE: F22's n_SP is the average number of non-overlapping spectra per MSA configuration at the target densities of existing remote-galaxy surveys; the midpoints 190 and 55 are DERIVED here (a capacity, not a fixed count). The detector holds up to four prism spectra side by side along a row (J22 Sec. 2.4). | | | | |
| IFU (not a preset) | 30 slices, each 103 mas wide x 3195 mas tall, in two columns of 15; field 3.1 x 3.2 arcsec; anamorphic: slice width sampled by two pixels |  | SOURCED | J22, Sec. 2.2.3, p. 5 | "30 separate long slit spectra of 103 mas wide and 3195 mas tall slices through the scene" |
|  | ALT: J22, Sec. 2.2.3, p. 5: "the virtual slits magnified by a factor of two in the dispersion direction such that their 103 mas widths are sampled by two pixels" | | | | |
|  | NOTE: For an explorer entry (like KCWI, MUSE) the slit would be 0.103 arcsec, nObj 30 spectra, slit length 3.195 arcsec; the IFU adds eight gold-coated reflections. Not recommended as a preset here (the MSA and fixed slits cover the instrument's main design). | | | | |
| Collimator type | a three-mirror anastigmat (TMA) of reflective, high-order aspheric mirrors; all mirrors protected silver |  | SOURCED | J22, Sec. 2, p. 3 | "The three primary optical modules of NIR-Spec are each implemented in the form of three-mirror anas-tigmats" |
|  | ALT: JDO, NIRSpec optical path: "Each are implemented as a 3-mirror anastigmat (TMA) to minimize optical aberrations" | | | | |
|  | NOTE: The explorer draws a collimator mirror (col 'mirror'), the closest drawing type: a TMA is three mirrors. The focal lengths of the three modules are not published. | | | | |
| Collimated beam diameter | 56 | mm | SOURCED | J22, Sec. 2.3, p. 7 | "into a ≃56 mm diameter parallel beam aimed at the flat disperser situated in the second pupil plane" |
|  | ALT: J22, Sec. 2.1, p. 4: "tilted by 5◦ .3 in the spatial direction in order to avoid ghosting" | | | | |
|  | NOTE: The collimator, dispersers and camera are 'all oversized' to catch the diffraction-broadened beams (J22 Sec. 2.3). The disperser stands at the second pupil, so this is the pupil's size. | | | | |
| Collimator focal length | 700 (mean of the two directions) | mm | DERIVED | J22, Sec. 2.3, p. 7 | "The Collimator focal length differs by 4% between the spatial and dispersion directions" |
|  | ALT: J22, Fig. 10 labels: "Slit Plane (f/12.5) Collimator Grating Wheel Camera Detector Array (f/5.67)" | | | | |
|  | NOTE: NOT published. DERIVED: f_col = F x W = 12.5 x 56 mm = 700 mm (the explorer's own rule, f_col = F W). The anamorphic 4 % (the focal length is shorter in the dispersion direction) is not modeled. | | | | |
| Collimator on or off axis (deploy gate) | OFF-AXIS (INFERRED: no source says it); the slit plane is not in the returning beam |  | INFERRED | J22, Fig. 1, p. 3 and Sec. 2.4, p. 8 | "the Collimator output is tilted in bulk along the spatial direction parallel to the optical bench by an angle of" |
|  | ALT: J22, Sec. 2, p. 3: "the light entering NIRSpec undergoes a total of 15 reflections before reaching the detector array" | | | | |
|  | ALT: J22, Fig. 1 caption: "Optical path through the NIRSpec instrument. The dispersion direction is out of the image." | | | | |
|  | NOTE: Evidence (read from the Fig. 1 ray trace, which is to no scale): the slit-plane beam arrives from the upper right, a fold turns it toward the collimator's three mirrors, and the collimated beam goes to the disperser on a different path with no element standing in the returning beam. No source states 'off-axis' or 'unobscured'. The explorer's default colTilt (automatic off-axis tilt) applies; do NOT set colTilt 0. The tilt is NOT FOUND.  | | | | |
| Disperser mount: grating wheel, the dispersion plane | the dispersion takes place perpendicular to the optical bench; the light path lies in the bench plane |  | SOURCED | J22, Sec. 2, p. 3 | "the dispersion takes place orthogonal to it" |
|  | NOTE: The bench plane (Fig. 1) is therefore the plane of the 'out-of-dispersion' angle gamma below; the explorer's drawing plane is the dispersion plane. | | | | |
| Gratings: ruled reflection, six on the wheel | G140M 95.40 /mm, blaze 3.5 deg, 1.3 um; G235M 56.88, 3.7 deg, 2.2 um; G395M 33.82, 3.7 deg, 3.7 um; G140H 252.29, 9.5 deg, 1.3 um; G235H 150.29, 9.7 deg, 2.2 um; G395H 89.41, 9.9 deg, 3.7 um | /mm; deg; um | SOURCED | J22, Table 3, p. 7 | "G395M 33.82 3.7 3.7" |
|  | ALT: J22, Table 3, p. 7: "G140H 252.29 9.5 1.3" | | | | |
|  | ALT: J22, Sec. 2.4, p. 7: "mechanically ruling triangular grooves having the desired blaze angle directly onto a gold layer deposited on a Zerodur substrate" | | | | |
|  | ALT: J22, Sec. 2.4, p. 7: "The gratings measure 70 mm × 70 mm in active area" | | | | |
|  | ALT: J22, Sec. 2.4, p. 7: "The six gratings are all used in the inside (negative) first order." | | | | |
|  | NOTE: First order (m = 1). 'the blaze wavelength of each grating set to the harmonic mean of the above band endpoints': DERIVED 2 x 1.0 x 1.8 / 2.8 = 1.29, 2 x 1.7 x 3.0 / 4.7 = 2.17, 2 x 2.9 x 5.0 / 7.9 = 3.67 um, matching the table's 1.3, 2.2, 3.7 um. The 70 mm active area is the grating's ruled length (gLen 70). The explorer's lamB1 takes the table's blaze wavelength. | | | | |
| Spatial incidence angle on the dispersers (conical mount) | gamma0 = 16.4 deg; the beams from the field illuminate the dispersers at 16.4 +/- 3.6 deg out of the dispersion plane | deg | SOURCED | J22, Sec. 2.4, p. 9 | "such that the beams from different field points illuminate the dispersers at spatial incidence an-gles" |
|  | ALT: J22, Sec. 2.4, p. 9: "Illuminating the gratings in this oblique γ , 0 manner gives rise to slit curvature" | | | | |
|  | NOTE: The text layer prints the angles as 'γ0 =16◦ .4' and '16◦ .4±3◦ .6'. Consequences: slit tilt 1.4-3.3 deg (R = 1000) and 3.6-7.1 deg (R = 2700), 5.8-9.6 deg opposite in sense for the prism (J22 Sec. 2.4). The explorer's grating mode has no out-of-plane angle (gamma exists only in echelle mode): see the notes. In Fig. 1 the camera and collimator axes stand 32.9 deg apart in the bench plane, MEASURED, = 2 x 16.4 deg. | | | | |
| Prism: glass, wedge, size, coating | CaF2; 16.5 deg wedge, 80 x 80 mm, double pass: the silver-coated back reflects the beam, so the beam crosses the glass twice |  | SOURCED | J22, Sec. 2.4, p. 8 | "The double-pass prism consists of an 80 mm × 80 mm" |
|  | ALT: J22, Sec. 2.4, p. 8: "wedge of CaF2 with a protected silver reflective coating deposited on its backside" | | | | |
|  | ALT: J22, Sec. 2.4, p. 8: "It produces low resolution R≃100 spectra over the complete 0.6-5.3µm range of the instrument" | | | | |
|  | ALT: J22, Sec. 2.4, p. 8: "The index of refraction of CaF2 varies strongly with wavelength in the near-IR" | | | | |
|  | NOTE: The text layer prints the wedge as '16◦ .5' (16.5 deg). 'In contrast to the grating spectra, the prism spectra are free of multiple orders and are only between 390 and 420 pixels long.' The CLEAR filter is an uncoated CaF2 plate whose cut-on, about 0.6 um, is set by the gold of the telescope mirrors. | | | | |
| Prism apex angle for the explorer (equivalent single-pass prism) | 33 | deg | DERIVED | J22, Sec. 2.4, p. 8 | "wedge of CaF2 with a protected silver reflective coating deposited on its backside" |
|  | NOTE: DERIVED: a wedge of angle w with a mirrored back, unfolded about the mirror, is a single prism of apex 2 w = 2 x 16.5 = 33 deg, crossed once (glass path front face -> back mirror -> front face = front face -> mirrored front face). The explorer's prism mode (pA = 33, pN = 1, at minimum deviation for lamC) then gives, with CaF2 at 37 K, a dispersion within 1 % of JDox's table at 0.7-5.0 um (see Published performance): this is the test of the apex, the glass and the temperature together. Not modeled: the conical (out-of-plane 16.4 deg) incidence on the prism and the bench-plane 32.8 deg between collimator and camera axes. | | | | |
| Prism operating temperature | about 37 K (the instrument); detectors about 43 K | K | SOURCED | J22, Sec. 2, p. 3 and Sec. 2.6, p. 9 | "is held at its nominal operational temperature of ∼37K" |
|  | ALT: J22, Sec. 2.6, p. 9: "is held at its operating temperature of ≃43K" | | | | |
|  | NOTE: The prism glass indices are therefore the cryogenic ones; J22 cites Tropf (1995, room-temperature-based models) only qualitatively. See the glass section. | | | | |
| Camera type | a three-mirror anastigmat (TMA), imaging not telecentric |  | SOURCED | JDO, NIRSpec optical path | "Each are implemented as a 3-mirror anastigmat (TMA) to minimize optical aberrations" |
|  | ALT: J22, Sec. 2.5, p. 9: "The imaging on the detector array is not telecentric; the converging f/5.7 beams deviate from the detector normal by up to ±9" | | | | |
|  | ALT: J22, Sec. 2.5, p. 9: "The wide Camera field of view captures the large ±7◦ .7 angular extent of the beams output by the gratings in the dispersion direction" | | | | |
|  | NOTE: Camera field: +/-7.7 deg in the dispersion direction, +/-3.6 deg spatially (J22 prints the degree marks as '◦ .'). Camera distortion is clocked opposite to the collimator's (J22 Sec. 2.5). | | | | |
| Camera focal ratio | 5.67 | focal ratio | SOURCED | J22, Fig. 10 labels, p. 14 | "Slit Plane (f/12.5) Collimator Grating Wheel Camera Detector Array (f/5.67) Telescope Focus (f/20)" |
|  | ALT: J22, Sec. 2.5, p. 9: "the converging f/5.7 beams" | | | | |
|  | NOTE: f/5.7 in Sec. 2.5 is the same quantity rounded. | | | | |
| Camera focal length | 304.6 (EFFECTIVE, from the published pixel scale); 317.5 from f/5.67 x 56 mm (DERIVED) | mm | EFFECTIVE | J22, Sec. 2.6, p. 9 | "project to an average extent on the sky of 103 mas in the dispersion direction and 105 mas in the spatial direction" |
|  | ALT: J22, Sec. 2.5, p. 9: "The focal length of the Camera is matched to the preceding optics such that the 200 mas nominal slit width projects to two pixels on the detector array" | | | | |
|  | NOTE: NOT published. EFFECTIVE: the spatial pixel scale of 105 mas on 18 um pixels fixes f_cam = pix x f_col x (plate scale at the slit plane) / (pixel scale on the sky) = 0.018 mm x 700 mm x 2.5386 arcsec/mm / 0.105 arcsec = 304.6 mm. The f/5.67 x 56 mm = 317.5 mm of the published ratio and beam is 4 % longer (the beam is 'about' 56 mm and the camera is anamorphic). Using 304.6 reproduces JDox's prism dispersion to 1 % (0.5 % rms) and the gratings' to -3 %; 317.5 would make the prism's -4 % and the gratings' -7 %. The camera's focal length differs between the two directions (anamorphic), which one number cannot carry. | | | | |
| Detector | two Teledyne H2RG HgCdTe arrays, 2048 x 2048 pixels of 18 um, NRS1 and NRS2 side by side in the dispersion direction; cutoff 5.3 um |  | SOURCED | J22, Sec. 2.6, p. 9 | "It consists of two Teledyne 2048×2048 H2RG arrays" |
|  | ALT: JDD, Detector overview: "Both SCAs are 2048 × 2048 pixels in size with an 18 μm pixel pitch and a long wavelength sensitivity cutoff of 5.3 μm" | | | | |
|  | ALT: J22, Sec. 2.6, p. 9: "The two arrays, imaginatively named NRS1 and NRS2, are mounted adjacent to each other in the dispersion direction" | | | | |
|  | NOTE: Responsive area: the outer four rows and columns of each array are reference pixels that do not respond (JDD: 'The outer 4 pixel columns and rows framing the SCA are insensitive to light'), so 2040 x 2040 responsive pixels each. | | | | |
| Detector gap | 2.8 mm = 155.6 pixels between the last and first responsive columns (JDox: about 18 arcsec on the sky) | mm | SOURCED | J22, Sec. 2.6, p. 9 | "mounted adjacent to each other in the dispersion direction leaving a 2.8 mm" |
|  | ALT: J22, Sec. 2.7, p. 10: "will therefore invariably miss a ≃ 156 pixel" | | | | |
|  | ALT: JDD, Detector overview: "separated by a physical gap that is equivalent to approximately 18" on the sky" | | | | |
|  | NOTE: DERIVED: 2.8 mm / 0.018 mm = 155.6 px (J22 says 156 px). On the sky 155.6 px x 103 mas = 16.0 arcsec (J22 prints '15″.9' as '1500 .9'); JDox says 'approximately 18 arcsec' (Conflicts). The explorer's detector is one array: Nx = 2040 + 156 + 2040 = 4236 px (the responsive width, the gap included as pixels), Ny = 2040; the gap's wavelengths are shown as covered although they are lost (R = 2700 gap 0.037, 0.062, 0.104 um for G140H, G235H, G395H, J22 Sec. 2.7). | | | | |
| Pixel scale on the sky | 103 (dispersion) x 105 (spatial) | mas/pixel | SOURCED | J22, Sec. 2.6, p. 9 | "project to an average extent on the sky of 103 mas in the dispersion direction and 105 mas in the spatial direction" |
|  | NOTE: The explorer's pixScale (along the slit) is 0.105 arcsec at f_cam = 304.6 mm. | | | | |
| Coverage: wavelength range of the instrument | 0.6-5.3 (prism and instrument); 5.3 um is the detector cutoff | um | SOURCED | J22, Sec. 2, p. 2 | "NIRSpec is designed to be capable of performing both single- and multiobject spectroscopic observations over the 0.6-5.3µm" |
|  | NOTE: Every mode lies above the explorer's 3200 A cut and below its 6 um limit: nothing is removed. | | | | |
| Order-separation filters on the filter wheel | CLEAR >0.6 (CaF2, prism); F070LP >0.7, F100LP >1.0 (G140M/H); F170LP >1.7 (G235); F290LP >2.9 (G395); F140X 0.8-2.0 and F110W 1.0-1.3 (BK7, target acquisition) | um | SOURCED | J22, Table 2, p. 7 | "F290LP >2.9 CaF2 G395M & G395H" |
|  | ALT: J22, Sec. 2.4, p. 7: "the decision was made early on to employ long-pass filters rather than finite-band filters for order separation in NIRSpec" | | | | |
|  | NOTE: Entered in the explorer as 'filt' [lo, hi] (A): the long-pass cut-on and the 5.3 um detector cutoff. Long-pass filters do not block the second order beyond twice the cut-on: 'Spectra taken in these combinations will be free of second-order contamination over exactly one octave of wavelength'. | | | | |
| Baseline modes: wavelength range, R, length | PRISM/CLEAR 0.6-5.3 um, R 30-330, 411 px; G395M/F290LP 2.88-5.20, R 728-1317, 1290 px; G140H/F100LP 0.98-1.87, R 1849-3675, 3753 px | um; px | SOURCED | J22, Table 4, p. 8 | "PRISM/CLEAR 0.6 - 5.3 30 - 330 411" |
|  | ALT: J22, Table 4, p. 8: "G395M/F290LP 2.88 - 5.20 728 - 1317 1290" | | | | |
|  | ALT: J22, Table 4, p. 8: "G140H/F100LP 0.98 - 1.87 1849 - 3675 3753" | | | | |
|  | ALT: J22, Sec. 2.4, p. 8: "an assumed spectral resolution element spanning 2.2 detector pixels in the dispersion direction" | | | | |
|  | NOTE: Computed by J22 for the S200A2 slit with a resolution element of 2.2 pixels. The 'usable' range's blue end is the 50 % throughput point of filter and disperser; its red end the wavelength where the second-order light reaches 0.1 % of the first order. Other modes in Table 4: G140M/F070LP 0.70-1.26, G140M/F100LP 0.98-1.88, G235M/F170LP 1.70-3.15, G140H/F070LP 0.70-1.26, G235H/F170LP 1.70-3.15, G395H/F290LP 2.88-5.20. | | | | |
| Prism resolving power | R about 31 near 1.1 um rising to about 330 at 5.3 um (JDox table: minimum 30.1 at 1.18 um, 323 at 5.30 um) | lambda/FWHM (2.2 px) | SOURCED | J22, Sec. 2.4, p. 8 | "the rather uneven dispersion and spectral resolution of the prism spectra ranges from a low of R≃31 near 1.1µm and steadily rises to a high of R≃330 at 5.3µm" |
|  | ALT: JDF, Figure 4 caption: "The resolving power is computed assuming a spectral resolution element size of 2.2 pixels (typically a fully illuminated aperture for the IFU, the MOS and the FS mode 200 mas slits )" | | | | |
|  | NOTE: GEOMETRIC/design value (2.2 pixels per resolution element), not measured. In-flight point-source measurements are higher (next rows). | | | | |
| In-flight resolving power, point source (MEASURED) | about 170 (PRISM), 1200 (M gratings), 3000 (H gratings) nominal; measured/expected: G140M 1.351, G235M 1.263, G395M 1.165, G140H 1.153, G235H 1.112, G395H 1.093, PRISM 1.298 | lambda/FWHM | SOURCED | G25, Sec. 5 and Table 5.1, pp. 12, 15 | "For a point source, we measure resolving powers that exceed expectations by ~20% overall" |
|  | ALT: G25, Table 5.1, p. 15: "PRISM −1/15 to +1/10 170 1.298" | | | | |
|  | ALT: G25, Sec. 5, p. 12: "finding nominal resolving powers of ~170 for the PRISM, ~1200 for the medium-resolution gratings, and ~3000 for the high-resolution gratings" | | | | |
|  | ALT: Z26, Abstract: "Our empirical calibration exceeds the pre-launch JDox values by a factor of 1.03 to 1.63, depending on source morphology" | | | | |
|  | NOTE: MEASURED from a planetary nebula (a point source) observed in three-shutter slitlets (G25) and from galaxies' [O III] (Z26). The JDox 'expected' curves assume a uniformly lit shutter, which the explorer's slit-filling model also represents; the in-flight excess is the PSF being narrower than the shutter (the telescope's wavefront is better than required). Z26 Eq. 1: R = c0 R(lambda) / sqrt(1 + (FWHM_arcsec / x0)^2) with x0 = 0.1 arcsec, c0 = 1.826 and the quintic R(lambda) (lambda in um): with the source's convolved FWHM equal to the 0.2 arcsec shutter this gives 32.2, 60.8, 140.4, 279.4 at 1.1, 2.2, 3.5, 5.0 um (DERIVED, INFERRED FWHM), within 6 % of JDox. | | | | |
| Slit diffraction: the PSF and the shutter | FWHM of the PSF in the slit plane 80 mas at 2.5 um; 170 mas at 5.3 um; the 199 mas shutter is 1.2 lambda/D at 5 um | mas | SOURCED | J22, Sec. 2.1, p. 4 and Sec. 2.6, p. 9 | "The FWHM of the PSF in the Slit Plane at a wavelength of 2.5µm is therefore 80 mas" |
|  | ALT: J22, Sec. 2.6, p. 9: "undersamples even the 170 mas FWHM of the PSF at the 5.3µm long wavelength cut-off" | | | | |
|  | ALT: J22, Sec. 3.2, p. 13: "Diffraction occurring at the MSA shutter causes the beam exiting the MSA to broaden beyond its incident f/12.5 f-ratio" | | | | |
|  | NOTE: The explorer's slit-diffraction rule (the grating lit over the slit's own diffraction lobe, 2 f_col lambda / w, when w < 2 lambda / D) starts at 3.14 um for the 0.199 arcsec shutter (2 lambda / D = 0.199 arcsec) and at 3.04 um for 0.193 arcsec (DERIVED, D = 6.5 m). At 5 um the lobe is 2 x 700 x 5e-3 / 0.078 = 90 mm, wider than the 70 mm grating: the beam overfills the ruled length, which is why gLen = 70 matters ('the light missing the over-sized grating gives rise to the second diffraction contribution to the total slit loss', J22 Sec. 3.2). Predicted point-source slit transmission 55 %-74 % (J22 Sec. 3.2). The measured line spread function FWHM per mode is NOT in the saved sources (NOT FOUND); G25 and Z26 give R. | | | | |

## Optical layout (from the published figures)

- **Source figures** (SOURCED): J22 Fig. 1 (p. 3, saved PDF p. 3): the optical path in the bench plane, a ray trace with the pick-off mirrors, foreoptics, filter wheel, focus mirrors, slit plane, collimator, disperser, camera and detector array labeled and the angle 16.4 deg marked; to no scale, no dimensions. J22 Fig. 2 and B23 Fig. 1 (right): the CAD rendering, 'The dimensions of the NIRSpec optical assembly are 1.9 m × 1.4 m × 0.7 m' (B23 Fig. 1 caption). J22 Fig. 10 (p. 14): a schematic of the optical chain with the focal ratios (f/20 at the telescope focus, f/12.5 at the slit plane, f/5.67 at the detector). The JDox 'NIRSpec Optics' page (JDO) has Fig. 3 'drawn to scale' as an image; the saved HTML has it as a raster with no text layer, and it was not read for distances here.
- **Element order (all modes)** (SOURCED): Telescope focus (f/20) -> field stop and two flat pick-off mirrors -> Foreoptics TMA (filter wheel at its pupil, then two flat focus mirrors) -> slit plane at f/12.5 (MSA, fixed slits and IFU entrance side by side) -> a fold -> Collimator TMA -> ~56 mm collimated beam to the disperser on the grating wheel at the second pupil -> Camera TMA -> detector array (NRS1 | gap | NRS2). Five plane fold mirrors in all, 15 reflections to the detector counting the disperser (J22 Sec. 2, p. 3: 'Counting the five plane fold mirrors and the disperser, the light entering NIRSpec undergoes a total of 15 reflections before reaching the detector array'); the IFU adds eight gold reflections.
- **Collimator on or off axis** (INFERRED): OFF-AXIS. No source says so; the Fig. 1 ray trace shows the slit-plane light turned by a fold into the collimator's mirrors and the collimated beam leaving on another path, nothing standing in the returning beam. The explorer's default (automatic) colTilt applies; the tilt angle is NOT FOUND.
- **Disperser geometry in the bench plane** (MEASURED): The collimated and camera beams meet the disperser at +/-16.4 deg from its normal in the bench plane: Fig. 1 shows the arc 16.4 deg between two lines and a dotted line between them (the grating normal). Method: the figure was rasterized at 800 dpi; the left (camera) line runs 11.2 deg from the vertical (80 px across 405 px), the right (collimator) line 21.7 deg (145 px across 365 px), and the dotted line 5.1 deg, the bisector: total 32.9 deg = 2 x 16.4 deg (gamma0 of Sec. 2.4, SOURCED). The text of Sec. 2.4 says the angle is out of the dispersion plane, so the explorer's grating-mode psi (an in-dispersion-plane angle) cannot carry it (see Notes).
- **Distances and sides** (SCHEMATIC): layLen (collimator to disperser) and camLen (disperser to camera) are NOT FOUND: Fig. 1 has no scale. Fig. 1's order along the bench, left to right: detector array, camera, disperser, collimator, then the slit plane and foreoptics to the right; the foreoptics and pick-off periscope extend to the upper right (the NIRSpec optical assembly is 1.9 x 1.4 m, B23). The explorer's defaults draw the layout schematically.
- **Prism in the layout** (SOURCED): The prism stands on the same wheel and in the same pupil as the gratings; the double pass means the beam enters and leaves the same face (INFERRED from 'double-pass prism ... protected silver reflective coating deposited on its backside', J22 Sec. 2.4). The explorer's prism mode treats the prism as the equivalent single 33 deg prism at minimum deviation (deviation 14.8 deg), not the fold geometry of the real wedge.

## Glass: CaF2 at 37 K (a new entry for web/physics.js GLASS)

NASA CHARMS temperature-dependent Sellmeier fit (Leviton, Frey & Madison 2008, Table 5): n^2(lambda, T) - 1 = sum_i S_i(T) lambda^2 / (lambda^2 - lambda_i(T)^2), i = 1..3, S_i(T) = sum_j S_ij T^j and lambda_i(T) = sum_j lambda_ij T^j (j = 0..4), lambda in um, valid 25 K <= T <= 300 K and 0.40-5.6 um (the paper: 'These coefficients should not be applied beyond the wavelength and temperatures ranges over which measurements were made'). Evaluated at T = 37 K (the instrument's operating temperature, J22 Sec. 2): B_i = S_i(37 K) = 1.031627, 0.013640, 4.106143 and C_i = lambda_i(37 K)^2 = 0.0054248, 0.0377409, 1267.834 um^2. Check against the paper's Table 1 (measured indices): the fit with the transcribed coefficients reproduces the 30 K and 40 K columns at 0.4, 0.6, 1.0, 2.0, 3.0, 4.0, 5.0 and 5.5 um to 5.5e-6 or better (the paper's average residual 6e-6). n(37 K) = 1.43579 (0.6 um), 1.43053 (1.1), 1.42007 (3.0), 1.39730 (5.3 um). The explorer's GLASS list does not have CaF2 (it has silica, N-BK7, ..., Infrasil and ZnSe at 105 K): this entry is new.

| i | S_i(37 K) = B_i | lambda_i(37 K) (um) | C_i = lambda_i^2 (um^2) |
|---|---|---|---|
| 1 | 1.0316274 | 0.073653 | 0.0054248 |
| 2 | 0.0136400 | 0.194270 | 0.0377409 |
| 3 | 4.1061425 | 35.60666 | 1267.834 |

Entry: `"CaF2-37K": { label: "CaF2 at 37 K", range: [0.40, 5.6], B: [1.0316274142205948, 0.0136399791696703, 4.106142512392021], C: [0.0054248106608752, 0.037740879165790525, 1267.833942847983] }` (the coefficients' source: Leviton et al. 2008 Table 5, quoted in the JSON twin; C_i are lambda_i^2 in um^2: lambda_1 = 0.073653, lambda_2 = 0.194270, lambda_3 = 35.60666 um at 37 K).

The prism's dispersion (the shape of dlambda/dpixel against wavelength) follows CaF2's, so the check against JDox's table at 0.7-5.0 um (0.995-1.011 of the table's values, with the glass at 37 K) tests this entry. Room-temperature CaF2 would shift the index by about -1.9e-3 (the 295 K column of Table 1 is 1.9e-3 below the 30 K column, e.g. 1.42925 against 1.43115 at 1.0 um): the instrument papers use the cryogenic regime; they cite Tropf 1995 only for the strong near-IR variation (J22 Sec. 2.4).

## Atmospheric cut at 3200 A (the explorer)

None. JWST has no atmosphere, and every mode lies in 0.6-5.3 um (6000-53000 A): the explorer's 3200 A cut removes 0 % of each mode, and its 6 um limit lies above the 5.3 um detector cutoff.

## Slit diffraction at 6.5 m (the explorer's slit rule)

| lambda (um) | lambda/D (arcsec) | 2 lambda/D (arcsec) | 0.199" shutter in lambda/D |
|---|---|---|---|
| 0.6 | 0.019 | 0.0381 | 10.47 |
| 1.0 | 0.0317 | 0.0635 | 6.28 |
| 2.0 | 0.0635 | 0.1269 | 3.13 |
| 3.14 | 0.0996 | 0.1993 | 2.00 |
| 5.0 | 0.1587 | 0.3173 | 1.25 |
| 5.3 | 0.1682 | 0.3364 | 1.18 |

DERIVED: lambda/D = lambda / 6.5 m x 206265. The rule (the grating lit over the lobe 2 f_col lambda / w when w < 2 lambda / D) is active above 3.14 um for the 0.199 arcsec shutter (above 3.04 um for 0.193 arcsec). The published PSF FWHM in the slit plane is 80 mas at 2.5 um and 170 mas at 5.3 um (J22 Secs. 2.1, 2.6); the 70 mm grating is overfilled by the lobe at 5 um (90 mm), so gLen 70 caps the diffraction-limited R (J22 Sec. 3.2).

## Published performance (validation targets)

| what | quantity | value | tol | source | note |
|---|---|---|---|---|---|
| prism dispersion 65.05 A/px at 0.7 um (JDox table) | dlpixAt at 7000 A | 65.05 | 0.03 | JDP (FITS row: 0.70 um -> 0.006505 um/px, R 48.9) | independent: apex 33 deg and CaF2 at 37 K are sourced; f_cam (EFFECTIVE) fixes the scale but not the shape; model 65.7 A/px |
| prism dispersion 164.5 A/px at 1.1 um | dlpixAt at 11000 A | 164.5 | 0.03 | JDP (1.10 um -> 0.016448 um/px, R 30.4) | model 165.3 A/px |
| prism dispersion 175.5 A/px at 2.2 um | dlpixAt at 22000 A | 175.5 | 0.03 | JDP (2.20 um -> 0.017546 um/px, R 57.0) | model 174.8 A/px |
| prism dispersion 115.9 A/px at 3.5 um | dlpixAt at 35000 A | 115.9 | 0.03 | JDP (3.50 um -> 0.011586 um/px, R 137.3) | model 115.4 A/px |
| prism dispersion 79.5 A/px at 5.0 um | dlpixAt at 50000 A | 79.5 | 0.03 | JDP (5.00 um -> 0.007952 um/px, R 285.8) | model 79.2 A/px |
| prism R about 31 near 1.1 um (2.2-pixel convention) | RAt at 11000 A | 30.4 | 0.15 (info) | J22 Sec. 2.4; JDP | info: the model's slit image is 1.90 px, not 2.2: model R 34.6 (Rs 35.1); the ratio 2.2/1.90 = 1.16 explains it |
| prism R about 330 at 5.3 um | RAt at 53000 A | 323.2 | 0.15 (info) | J22 Sec. 2.4 (330); JDP (323.2 at 5.30 um) | info: model R 337.8 (the diffraction lobe lowers it from Rs 378) |
| prism coverage 0.6-5.3 um | lo | 6000 | 0.01 (info) | J22 Table 4; JDF Table 2 | info: circular, the filt input [6000, 53000] sets it |
| pixel scale along the slit 0.105 arcsec | pixScale | 0.105 | 0.01 (info) | J22 Sec. 2.6 | info: circular, f_cam 304.6 mm was fitted to it (EFFECTIVE) |
| slit image width in pixels (design: 2 px for 0.2 arcsec) | npix | 2.0 | 0.07 | J22 Sec. 2.5; F22 Sec. 2.2 ('approximately two pixels') | model 1.90 px (the explorer flags it as undersampled; the real LSF is 2.2 px with the PSF) |
| G395M dispersion 17.95 A/px at 4.0 um | dlpixAt at 40000 A | 17.95 | 0.04 | JDG g395m (4.00 um -> 0.001795 um/px, R 1012.8) | model 17.42 A/px (-3.0 %): the conical mount (gamma0 16.4 deg) is not modeled; tol 4 % |
| G395M R about 1000 at 4.0 um (JDox 1013) | RAt at 40000 A | 1013 | 0.12 (info) | JDG g395m; J22 Table 4 (728-1317) | info: model R 1078 (slit image 1.90 px vs the 2.2 px convention) |
| G140H dispersion 2.355 A/px at 1.4 um | dlpixAt at 14000 A | 2.355 | 0.04 | JDG g140h (1.40 um -> 0.0002355 um/px, R 2701.7) | model 2.31 A/px (-2.1 %); the lamC 1.425 um is chosen (EFFECTIVE) to center the published range |
| G140H R about 2700 at 1.4 um (JDox 2702) | RAt at 14000 A | 2702 | 0.25 (info) | JDG g140h; J22 Table 4 (1849-3675) | info: model R 3222 (slit image 1.84 px; S200A1 0.193 arcsec) |
| G395M usable range 2.88-5.20 um | lo | 28800 | 0.01 (info) | J22 Table 4 | info: circular, filt lo = 28800 A sets it |
| G140H range 9800-18700 A (0.98-1.87 um) | hi | 18700 | 0.03 (info) | J22 Table 4 | info: model 19037 A; set by the chip window around lamC = 1.425 um (EFFECTIVE, so circular in part) |
| G140H gap width 0.037 um = 156 px x dispersion | dlpix | 2.37 | 0.04 (info) | J22 Sec. 2.7 (DERIVED: 370 A / 156 px = 2.37 A/px) | info: model 2.30 A/px (-2.8 %) |
| in-flight point-source R about 1.3 x JDox (prism), 1.17 (G395M), 1.15 (G140H) | info |  |  (info) | G25 Table 5.1 | info: MEASURED; the model is a uniformly lit shutter |

The JDox tables (JDP, JDG) are 'based on Jakobsen et al (2022)': they come from the NIRSpec team's instrument model, not independent measurements; the in-flight measurements are G25 and Z26 (info lines above).

MODEL OUTPUTS (web/physics.js, read-only run from the scratch directory, with the glass entry added by hand; slit 0.199 arcsec, 0.193 for G140H):

| Setting | lamC (A) | A/px | arcsec/px | Rs | Rd | R | npix | range (A) | alpha / beta (deg) | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| PRISM | 17800 | 165.3 (1.1 um) | 0.105 | 35.1 (1.1 um) | 200 | 34.6 | 1.89 | 6000-53000 | deviation 14.83 | undersampled |
| G395M | 37000 | 17.44 | 0.105 | 1120 | 2239 | 1001 | 1.90 | 28800-53000 | 3.59 / 3.59 | undersampled |
| G140H | 14250 | 2.304 | 0.105 | 3365 | 14362 | 3276 | 1.84 | 9800-19037 | 10.36 / 10.36 | undersampled |

Prism at other wavelengths (R / Rs / A per pixel): 0.6 um 73.0 / 73.4 / 43.1; 0.7 um 55.8 / 56.1 / 65.7; 1.1 um 34.6 / 35.1 / 165.3; 2.2 um 62.7 / 66.4 / 174.8; 3.5 um 143.4 / 160.3 / 115.4; 5.0 um 298.6 / 334.1 / 79.2; 5.3 um 337.8 / 378.0 / 74.3 (model dispersion over JDox: 1.010, 1.005, 0.996, 0.996, 0.996 at 0.7, 1.1, 2.2, 3.5, 5.0 um; the minimum R is 34.2 at 1.19 um). G395M: 17.45, 17.42, 17.34 A/px at 3, 4, 5 um (0.970, 0.971, 0.969 of JDox); G140H: 2.309, 2.314, 2.231 at 1.0, 1.4, 1.8 um (0.963, 0.979, 0.977).

## NOT FOUND

- Collimator and camera focal lengths, the three TMAs' prescriptions, the collimator's tilt or off-axis distance, and any distance along the bench (collimator to disperser, disperser to camera, fold angles and positions): not in J22, F22, B22, B23, the JDox pages read, or any free source found. Fig. 1 and Fig. 2 are to no scale (JDox Fig. 3 is 'drawn to scale' as a raster; not measured). SPIE papers on the optical design (Bagnasco et al. 2007; Geyl et al. 2011; te Plate et al. 2005) were not looked for beyond this: SPIE refuses automated access. f_col = 700 mm and f_cam = 304.6 mm (EFFECTIVE) are the explorer's equivalents.
- The dispersion-plane camera-collimator angle psi of the gratings (the published 16.4 deg is out of the dispersion plane, in the bench plane); the grating's in-plane incidence and diffraction angles; the wavelength at the detector center for each grating and slit (J22 gives only the G395H/S200A2 gap, 3.81-3.92 um, and S200A1's 3.69-3.79 um; the JDox fixed-slit gap figures are images).
- The measured line spread function FWHM in pixels per mode; the measured R for the three-shutter slitlet per setting beyond the ratios of G25 Table 5.1 and Z26's formula for the prism.
- Tropf 1995 (Opt. Eng. 34, 1369; ADS 1995OptEn..34.1369T, 'Temperature-dependent refractive index models for BaF2, CaF2, MgF2, SrF2, LiF, NaF, KCl, ZnS, and ZnSe'): a possible second source for CaF2 indices; behind a paywall (SPIE, Optical Engineering). Not needed: L08 gives the measured cryogenic fit.
- Geyl et al. 2011 and Posselt et al. 2004 / te Plate et al. 2005 / Bagnasco et al. 2007 (optical design, SiC bench) are SPIE papers; not saved. Dorner et al. 2016 (NIRSpec instrument model, SPIE 9910) would give the mapping used for JDox's tables; not saved.
- The JDox figures of wavelength ranges and gaps per slit (images) and the ETC's tables: not read; J22 Sec. 2.7 gives the main numbers.

## Conflicts between sources

- Detector gap on the sky: J22 Sec. 2.6 says 2.8 mm, which is 155.6 px x 103 mas = 16.0 arcsec (J22 prints '1500 .9', that is 15.9 arcsec); JDox says 'approximately 18" on the sky'. The explorer uses the pixel width, 156 px.
- Prism R at the red end: J22 'R≃330 at 5.3µm' vs the JDox table 323.2 at 5.30 um (321.3 at 5.285 um, 328.4 at 5.34 um); the minimum 'R≃31 near 1.1µm' vs the table 30.08 at 1.182 um. Rounding, not a conflict of substance.
- Wavelength ranges: J22 Table 4 (usable, S200A2) G395M/F290LP 2.88-5.20, G140H/F100LP 0.98-1.87 um vs JDox Table 2 2.87-5.27 and 0.97-1.89 um (nominal ranges, 'approximate').
- Camera focal length: f/5.67 x 56 mm = 317.5 mm (DERIVED from the published ratio and beam) vs 304.6 mm from the published spatial pixel scale (105 mas): 4 % apart; both depend on 'about 56 mm' and on one number standing for an anamorphic camera. The preset uses 304.6.
- Slit widths: the MSA open width is 199 mas on average (varies 2.9 % across the field); J22 Table 1 gives S200A1 as 193 mas, JDox rounds it to 0.2 arcsec. The presets use 0.199 (MSA) and 0.193 (S200A1).
- Pre-launch and in-flight R: JDox's R (2.2 pixels, uniformly lit) vs G25's point-source measurement (1.09-1.35 times JDox): different quantities, not a contradiction. Z26's empirical calibration is 1.03-1.63 times JDox depending on source size.

## Notes

- Era and status. NIRSpec is in operation on JWST (commissioning ended 185 days after launch, B23 Sec. 3); the three presets represent the as-built instrument with the replacement MSA and detectors (J22 Secs. 2.2, 2.6). No '(design)' tag. JDox tables are the 2024-2026 values ('Updates to G235H and G395H dispersion fits files', 24 Jun 2024).
- Telescope group. New group 'JWST 6.5 m': D = 6.5 m (JDox: 'a single mirror ~6.5 m in diameter'), telF = 20 (the OTE's focal ratio). Each preset's F is 12.5, the ratio of the beam the foreoptics deliver to the slit plane (the slit angle in the explorer follows D x F: 0.199 arcsec on 6.5 m at f/12.5 is 78 um at the slit plane, as published). The pupil is a 6.5 m circle: JWST's segmented, obstructed pupil is not drawn.
- Why these three. The prism is NIRSpec's most distinctive disperser (a double-pass CaF2 wedge, R 30-330 over the full 0.6-5.3 um in one exposure, free of orders) and the one the model's prism mode can represent; G395M (33.82 /mm, the coarsest ruling, R~1000 at 3-5 um) with the MSA shutter and G140H (252.29 /mm, the finest ruling, R~2700 at 1-1.8 um) with the S200A1 fixed slit span the grating family and its extremes in density, order-filter cut-on and detector use. G235M/H are intermediate and not needed. 'Most used' is not in a saved source: this choice is the brief's suggestion, justified on instrument design.
- Slits. MSA settings use the 0.199 arcsec shutter; G140H uses S200A1 (0.193 arcsec), because the R=2700 gratings are intended for the fixed slits ('The three S200 slits are primarily intended for kinematic studies of single extended objects in R=2700 mode', J22 Sec. 2.2.2) and have complicated coverage in MSA mode. All settings are slit-filling (extended-source) cases; point sources have higher R in flight (G25).
- Setting names (at most 16 characters): 'PRISM', 'G395M', 'G140H'. Preset lines: 'JWST / NIRSpec PRISM, 0.2″', 'JWST / NIRSpec G395M, 0.2″', 'JWST / NIRSpec G140H, S200A1'. One Preset-menu line (inst 'NIRSpec'), no All-arms group: NRS1 and NRS2 are two detector arrays of one channel, not two arms (no dichroic).
- The grating-mode geometry the explorer cannot represent. NIRSpec's gratings are used in a conical mount: the beams hit them 16.4 deg out of the dispersion plane (J22 Sec. 2.4), and the explorer's grating mode has no out-of-plane angle (the echelle mode has gamma). The presets use psi = 0 (Littrow in the dispersion plane) with the catalog ruling: the model's dispersion is then -3 % (G395M) and -2 to -4 % (G140H) of JDox's tables, the slit image 1.84-1.90 px (design 2). An alternative, psi = 32.8 deg (= 2 gamma0, the angle between the collimator and camera axes in Fig. 1: this reproduces the 'sin a + sin b = G lambda / cos gamma' relation for the blaze, since 2 sin t cos(psi/2) = 2 sin t cos gamma0), draws the camera at the real angle from the collimator but makes the dispersion -5.8 % to -4.1 % (G395M) and -5.5 % to +1.6 % (G140H) of JDox's, and the slit image 1.82 px (G395M) and 1.64 px (G140H) (the model's anamorphic factor, absent in the real instrument, which has dispersion-plane angles of only a few degrees). The model's output for the alternative was run for G395M and G140H; the choice is the user's. The prism has no psi: it is the equivalent 33 deg prism at minimum deviation (deviation 14.8 deg).
- Prism glass. CaF2 is not in the explorer's GLASS list: the new entry 'CaF2-37K' is given in the glass section (range 0.40-5.6 um). The prism's dispersion curve then matches JDox's (which is 'based on Jakobsen et al (2022)', so partly the same instrument model) within 1 % at 0.7-5.0 um; f_cam = 304.6 mm is EFFECTIVE (it sets the scale of that agreement, not the curve's shape).
- Detector gap and the order filter. The two arrays and the 156 px gap are one 4236 x 2040 detector here; the gap's wavelengths (about 0.037, 0.062, 0.104 um in R=2700) are shown as covered. 'filt' is the long-pass filter plus the 5.3 um detector cutoff; it hides the second-order and zero-order images that the real R=1000 detector shows (J22 Sec. 2.7). The prism's R curve is not monotonic (a minimum of about 30 at 1.2 um), which the explorer's R readout shows. The prism's nObj 190 and the M grating's 55 are capacity estimates for MSA multiplexing, not counts.
- Wavelength coverage vs the atmosphere cut. JWST has no atmosphere; all modes lie in 0.6-5.3 um: the explorer's 3200 A cut removes nothing (0 % of every mode), and its 6 um limit is above the 5.3 um cutoff.
- Slit diffraction. The rule matters for the MSA at the red end: 2 lambda / D exceeds the 0.199 arcsec shutter above 3.14 um (0.193 arcsec: 3.04 um), and the beam's lobe (90 mm at 5 um) overfills the 70 mm grating (gLen 70); the model's R at 5 um is 1275 (G395M, Rs 1513) and 299 (prism, Rs 334). This is the physical content of J22 Fig. 11's 'diffraction' loss.
- IFU. Not a preset: 0.103 arcsec x 30 slices, 3.195 arcsec long, anamorphic (the slices are sampled by 2 px). The explorer would enter slitW 0.103, nObj 30, slit length 3.195 arcsec (like KCWI/MUSE).
- Privacy and downloads. Only arXiv, ADS and STScI documentation pages were fetched; no personal detail was sent. The PDFs, HTML and FITS tables are saved unmodified; the FITS tables were read with a small scratch parser (readfits.py in the scratch directory) and are not quote-checked: their values are given as table rows.
