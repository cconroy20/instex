# Round 11 (2026-11-18): Boombox, the Via Project's two-channel R ~ 1000 fiber spectrograph, rebuilt from its optical-design paper (id `boombox`)

Same rules as rounds 1-10 (data/presets_research.md): every number comes from a document saved unmodified under `rawdata/presets/boombox/` (the paper) and `rawdata/presets/via/` (the Via overview); each value carries the source key, location and a short verbatim quote; **DERIVED** marks arithmetic done here from sourced values (shown); **EFFECTIVE** marks a value fitted so the explorer reproduces a published number (one is used, the red channel's lambda_c, flagged); **INFERRED** marks a reading that is not stated; layout elements are tagged SOURCED, MEASURED or SCHEMATIC. The paper is a SUBMITTED SPIE manuscript, not yet published, so the quotes are short and nothing was sent to any external service. Quote check (`python3 -I build.py`, comparing every quote piece with `pdftotext -layout` and `-raw` text, and the page of each paper quote with that page's text): **69 quote pieces, 0 failures**. Figures 1, 2 and 4 are raster images in the PDF, so their labels and the geometry read from them are MEASURED with the figure's own scale bar and are not machine-checkable.

This record SUPERSEDES the Boombox section of data/presets_research.md and the audit of 2026-11-16 (data/audit/2026-11-16_S2_desi_boombox_via.md), whose gratings, camera, fiber ratio and band edges were INFERRED or measured from an earlier Zemax drawing.

## Completeness summary

**Settled by the paper:** the fibers (36, 200 um, 1.2 arcsec, f/5.3 output, 13.6 mm slit, 0.2 mm gaps), the collimator (refractive split triplet, 264 mm, 50 mm beam, 300 mm pupil relief), the dichroic (5750 A, 22 deg, 95 A transition, blue reflected, 10 mm fused silica), both gratings (ion-etched binary transmission; 1516 and 836 /mm), both cameras (75 mm, f/1.5, 6 and 5 elements), the detector (CCD261-04, 2048 x 263, 15 um), the bands, R ~ 1000 and the throughput.

**Not in the paper (gaps that matter):** (1) the grating angles of incidence and diffraction (only the layout figure shows them; MEASURED here); (2) the diffraction order (first, INFERRED); (3) the red channel's camera-axis wavelength: the figure's geometry gives 7600 A, which leaves the chip 340 A short of 10100 A, so lambda_c is EFFECTIVE (7970 A) and the red coverage test is circular; (4) the definition of R ~ 1000 (no dispersion, no measured R: the instrument is not yet built); (5) the grating size (gLen) and the telescope's focal ratio at the fibers (DERIVED 5.29).

**Status:** under construction, commissioning in 2027 (abstract; Sec. 4): mark the presets "(design)".

## Sources

| key | document | local file | URL |
|---|---|---|---|
| P26 | Piotrowski, J. J., Frostig, D., Mueller, M., et al. 2026, "Optical design of Boombox: a high-throughput optical spectrograph on dual-hemisphere 6.5-meter telescopes", SUBMITTED SPIE paper (Ground-based and Airborne Instrumentation for Astronomy XI), manuscript dated 2026-07-19, 9 pp. NOT YET PUBLISHED: quotes are kept short | `rawdata/presets/boombox/Boombox_Design_ATI_2026_20260719_submitted.pdf` | (none: manuscript supplied by the Via team; Figs. 1-2 and 4 are raster images, so figure labels are not machine-checkable) |
| VO | The Via Collaboration 2026, "The Via Project: Overview of the Science, Instrument, and Survey", arXiv:2606.18332 (the earlier source for the 36 fibers, bands 3600-5900 / 5700-10100 and the 2048 x 256 CCD). Sec. 2.4, Figs. 13, 15, 16 | `rawdata/presets/via/via_project_overview_arXiv2606.18332.pdf` | https://arxiv.org/abs/2606.18332 |

## Parameters

| parameter | value | unit | tag | source + location | verbatim quote |
|---|---|---|---|---|---|
| **Telescope and feed** | | | | | |
| Telescopes | 6.5 m MMT and Magellan Clay (one Boombox on each) |  | SOURCED | P26 Table 1, p. 2 | "6.5-m MMT & Magellan Clay"<br>NOTE: "Two Boombox spectrographs, one for each telescope" (Sec. 3.3, p. 9) [checked below]. Boombox drives the pointing 10% of the 500-night survey. |
| Fibers per spectrograph | 36 |  | SOURCED | P26 Abstract; Sec. 1, p. 1 | "36 dedicated optical fibers"<br>NOTE: of the 636 the Via fiber positioning system routes; no sky or calibration fibers are counted in the paper's 36 (nObj 36 stays).<br>ALT (VO, Sec. 2.4): "accepting 36 fibers from the focal plane" |
| Fiber core | 200 | um | SOURCED | P26 Table 1, p. 2 | "Fiber core diameter 200 µm (1.2′′ on-sky)"<br>NOTE: unmasked (no slit mask) in the older sources. |
| Fiber on-sky size | 1.2 | arcsec | SOURCED | P26 Table 1, p. 2 | "1.2′′ on-sky" |
| Fiber output (collimator input) focal ratio | 5.3 |  | SOURCED | P26 Sec. 2.1; Fig. 2 caption, p. 3 | "collimating the f/5.3 output of the fibers into a 50 mm diameter beam"<br>NOTE: the old preset used f/5.2 (measured from a Zemax drawing). |
| Telescope focal ratio into the fibers (explorer F) | 5.28 |  | DERIVED | P26 Table 1; Sec. 2.1, p. 2 | "Fiber core diameter 200 µm"<br>NOTE: NOT stated. 200 um = 1.2 arcsec on 6.5 m gives F = 0.2 mm / (1.2/206265 x 6500 mm) = 5.29, equal to the f/5.3 fiber output (no focal-ratio degradation claimed). The preset uses F = f_col/W = 264/50 = 5.28, which keeps the collimator at exactly 264 mm and the slit at 1.202 arcsec (full core). Plate scale 200 um / 1.2 arcsec = 167 um/arcsec (DERIVED). |
| Slit length (fiber slit) | 13.6 | mm | SOURCED | P26 Sec. 2.4, p. 5 | "The fiber slit length is 13.6 mm"<br>NOTE: 36 fibers; pitch (13.6 - 0.2)/35 = 0.383 mm if 13.6 mm is the outer extent (DERIVED, INFERRED reading), a gap of 0.18 mm, matching the quoted 'about 200 um'.<br>ALT (P26, Sec. 2.1): "the 13.6 mm slit length" |
| Gap between fibers on the slit | 0.2 | mm | SOURCED | P26 Sec. 2.4, p. 5 | "A non-illuminated gap is left between each fiber of about 200 µm"<br>NOTE: on the chip: fiber image 200 x 0.284 = 56.8 um = 3.8 px; pitch 0.383 x 0.284 = 109 um = 7.3 px (DERIVED); the as-built EE95 limit 24.6 um is 'half the gap between spectra' (Sec. 3), so the gap is 49.2 um (consistent with 109 - 56.8 = 52 um). |
| System (collimator x camera) magnification | 0.28 |  | SOURCED | P26 Sec. 2.4, p. 5 | "the system magnification (collimator and camera) is 0.28×"<br>NOTE: 75/264 = 0.284 (DERIVED check). |
| Spectra on the detector, chip height | 36 spectra on 3.95 mm |  | SOURCED | P26 Sec. 1, p. 2 | "squeezes 36 spectra onto a compact detector (3.95 mm tall)"<br>NOTE: 263 rows x 15 um = 3.945 mm. |
| **Collimator** | | | | | |
| Collimator type | refractive split triplet, spherical surfaces (CL1 CaF2, CL2 BSM51Y, CL3 S-FPL55) |  | SOURCED | P26 Sec. 2.1; Fig. 2 and caption, p. 3 | "The collimator is a refractive design"<br>NOTE: Fig. 2 labels CL1 CaF2, CL2 BSM51Y, CL3 S-FPL55 (figure text, not machine-checkable). col = "lens". ON-AXIS in the lens sense: the fiber slit sits on the triplet's axis in Fig. 2 (a refractive collimator has no obscuration and no tilt); no colTilt applies.<br>ALT (P26, Sec. 2.1, p. 4): "when coupled with CaF2 and BSM51Y elements"<br>ALT (P26, Sec. 2): "No aspheric surfaces are used in the spectrograph design" |
| Collimator focal length | 264 | mm | SOURCED | P26 Sec. 2.1; Table 2, p. 3 | "The effective focal length of the split triplet collimator is 264 mm"<br>NOTE: the old preset had ~260 mm (f/5.2 on 50 mm).<br>ALT (P26, Table 2): "Collimator focal length = 264 mm"<br>ALT (P26, Abstract): "triplet collimator with a 264 mm focal length" |
| Collimated beam diameter | 50 | mm | SOURCED | P26 Table 1; Table 2, p. 2 | "Collimated beam diameter 50 mm"<br>NOTE: 264/50 = f/5.28.<br>ALT (P26, Table 2): "Entrance pupil diameter = 50 mm" |
| Collimator field along the slit | +-1.5 | deg | SOURCED | P26 Sec. 2.1, p. 3 | "creating collimated beams spanning ±1.5 degrees"<br>NOTE: 13.6 mm / 264 mm = 2.95 deg total (DERIVED check). |
| Collimator pupil relief (collimator to grating/pupil) | 300 | mm | SOURCED | P26 Sec. 2.1; Table 2; Fig. 2 caption, p. 3 | "The collimator is a refractive design with 300 mm of pupil relief"<br>NOTE: '>= 300 mm' in Table 2. The pupil falls on the etched face of each grating (Sec. 2.1, p. 4).<br>ALT (P26, Fig. 2 caption): "forms a pupil image 300 mm to the right of the lens assembly" |
| **Dichroic** | | | | | |
| Dichroic crossover | 5750 | A | SOURCED | P26 Sec. 2, p. 2 | "divided in wavelength at 5750 Å into blue and red arms using a dichroic beamsplitter"<br>NOTE: Asahi Spectral; 'lying blue of the Na I D doublet'.<br>ALT (P26, Sec. 2.2): "The crossover wavelength for the spectrograph is 5750 Å" |
| Dichroic angle of incidence | 22 | deg | SOURCED | P26 Sec. 2.2, p. 4 | "is designed to work at a tilt angle of 22"<br>NOTE: the older arms.js entry (22.5 deg, MEASURED from the bench layout) is confirmed. Measured from Fig. 1 here: the plate stands 21.5 deg from the beam normal and the blue beam is turned 137.3 deg (180 - 2 x 21.4). |
| Dichroic transition width (90% R to 90% T) | 95 | A | SOURCED | P26 Sec. 2.2, p. 4 | "The transition region from 90% reflection to 90% transmission is approximately 95 Å"<br>NOTE: the old arms.js entry used 200 A (unpublished then). |
| Dichroic substrate | fused silica, 10 mm thick |  | SOURCED | P26 Sec. 2.2, p. 4 | "is made of fused silica, and is 10 mm thick" |
| Dichroic performance | R 99.4% (3550-5650 A), T 99.2% (5850-10100 A) |  | SOURCED | P26 Sec. 2.2, p. 4 | "achieving an average reflectivity of 99.4% from 3550 Å to 5650 Å and an average transmission of 99.2% from 5850 Å to 10100 Å"<br>NOTE: THE BLUE CHANNEL IS REFLECTED, the red transmitted (reflection quoted over the blue range, transmission over the red). Fig. 1: the red light continues straight to a fold mirror. |
| Channel overlap at the dichroic | blue 3550-5850, red 5650-10100 | A | SOURCED | P26 Sec. 2; Table 2, p. 2 | "The blue channel covers 3550 Å to 5850 Å and the red channel covers 5650 Å to 10100 Å"<br>NOTE: 'with spectral overlap accounting for the crossover region of the dichroic' (the nominal bands are 3550-5750 and 5750-10100). |
| Dichroic position | in the collimated beam, after the collimator, ahead of both gratings |  | MEASURED | P26 Fig. 1 (p. 3), p. 3 | "split in wavelength at the dichroic beamsplitter"<br>NOTE: dichroic center 113 mm past the triplet's last vertex along the beam (scale bar, Fig. 1). |
| **Gratings** | | | | | |
| Grating type | ion-etched binary transmission (master), Plymouth Grating Laboratory; not VPH |  | SOURCED | P26 Abstract; Sec. 2.3, p. 1 | "ion-etched binary transmission gratings from Plymouth Grating Laboratory"<br>NOTE: gType "trans"; gKind not vph.<br>ALT (P26, Sec. 2.3, p. 4): "We chose binary gratings for Boombox" |
| Blue grating line density | 1516 | /mm | SOURCED | P26 Table 1; Sec. 2.3, p. 2 | "1 516 ln/mm"<br>NOTE: the old preset's 1385 /mm was INFERRED from a measured 19.2 deg incidence and is 9% low.<br>ALT (P26, Sec. 2.3, p. 4): "The blue channel uses a 1 516 line/mm grating" |
| Red grating line density | 836 | /mm | SOURCED | P26 Table 1; Sec. 2.3, p. 2 | "836 ln/mm"<br>NOTE: the old preset's 857 /mm was solved to span 5700-10100 A and is 2.5% high.<br>ALT (P26, Sec. 2.3, p. 4): "the red channel uses an 836 line/mm grating" |
| Grating position | at the aperture stop = the collimator's pupil, etched face |  | SOURCED | P26 Sec. 2.3; Sec. 2.1, p. 4 | "The diffraction grating is placed at the aperture stop"<br>NOTE: so layLen = collimator to grating = the pupil distance.<br>ALT (P26, Sec. 2.1, p. 4): "produces a sharp, achromatic pupil on the etched face of each transmission grating" |
| Diffraction order | 1 |  | INFERRED | P26 Sec. 2.3 (not stated), p. 4 | "Boombox uses moderate dispersion gratings to achieve R ≈ 1 000 in both wavelength channels"<br>NOTE: the paper never names the order; first order is the only one that fits the geometry (Gm lambda = 0.73 and 0.63 at the drawn angles). |
| Grating angles (alpha incidence / beta diffraction) | NOT in the text |  | NOT FOUND | P26 - | NOTE: see the MEASURED values from Fig. 1 under Layout. |
| **Cameras** | | | | | |
| Camera type | refractive, spherical surfaces; blue 6 elements, red 5 elements |  | SOURCED | P26 Abstract; Sec. 2.4; Fig. 4, p. 1 | "a set of 75 mm focal length cameras that are six and five elements in the blue and red channels"<br>NOTE: cam = "lens". A color-correcting split doublet, positive elements, and one (red) or two (blue) menisci; both are made of 5 unique lenses (BL3 and BL4 identical); CaF2, fused silica and i-line glasses in the blue.<br>ALT (P26, Sec. 2.4, p. 5): "one (red channel) or two (blue channel) aplanatic-type meniscus lenses" |
| Camera focal length | 75 | mm | SOURCED | P26 Sec. 2.4; Table 2, p. 5 | "This sets the effective focal lengths of the cameras to 75 mm"<br>NOTE: the old preset's 75 mm was DERIVED from f/1.5 x 50 mm; it is now sourced (the 70-72 mm of the Zemax drawing was a measurement error).<br>ALT (P26, Table 2): "Camera focal length = 75 mm" |
| Camera focal ratio | 1.5 |  | SOURCED | P26 Sec. 2.4, p. 5 | "corresponding to a focal ratio of f/1.5"<br>NOTE: 75/50 = 1.50. |
| Camera pupil relief | >= 40 | mm | SOURCED | P26 Sec. 2.3; Table 2, p. 4 | "modest pupil relief from the camera (> 40 mm)"<br>NOTE: the grating and its mount sit at the camera's entrance pupil. |
| Detector tilt (focus vs wavelength) | blue 1.61, red 1.57 | deg | SOURCED | P26 Sec. 2.4, p. 6 | "The blue channel detector is nominally tilted"<br>NOTE: tilt about the spatial axis; the model does not draw it.<br>ALT (P26, Sec. 2.4): "the red channel detector is tilted by 1.57" |
| **Detectors** | | | | | |
| Detector | e2v CCD261-04 in a Teledyne LANSIS 261 camera, both channels |  | SOURCED | P26 Sec. 2.5, p. 6 | "an e2v CCD261-04 detector"<br>NOTE: deep-depleted, 'high broadband quantum efficiency and wide aspect ratio'. |
| Format | 2048 x 263 | px | SOURCED | P26 Sec. 2.5, p. 6 | "The CCD array is 2048 × 263 pixels with a 15 µm pixel pitch"<br>NOTE: CONFLICT: 263 rows (the paper; 3.945 mm = the paper's 3.95 mm) versus 256 (Via overview; its 3.96 mm = 264 rows). The explorer's old Ny 256 follows the overview; the paper is newer and matches its own 3.95 mm.<br>ALT (VO, Sec. 2.4, p. 22): "2048 × 256 pixels with 15 µm pitch for an active area of 30.72 × 3.96 mm" |
| Pixel pitch | 15 | um | SOURCED | P26 Table 2; Sec. 2.5, p. 3 | "Pixel pitch = 15.0 µm" |
| **Bands, R, throughput** | | | | | |
| Wavelength range, blue | 3550-5750 (nominal) / 3550-5850 (design with overlap) | A | SOURCED | P26 Abstract; Table 1; Table 2, p. 2 | "3550 Å – 5750 Å"<br>NOTE: CONFLICT with the older preset (3600-5900, from the Via overview).<br>ALT (P26, Table 2): "Wavelength range (blue) 3550 Å – 5850 Å"<br>ALT (VO, Sec. 2.4): "a blue channel (3600 to 5900 Å)" |
| Wavelength range, red | 5750-10100 (nominal) / 5650-10100 (design with overlap) | A | SOURCED | P26 Abstract; Table 1; Table 2, p. 2 | "5750 Å – 10100 Å"<br>NOTE: the older preset's 5700 lower edge and 10100 upper edge: the upper edge is confirmed.<br>ALT (P26, Table 2): "Wavelength range (red) 5650 Å – 10100 Å"<br>ALT (VO, Sec. 2.4): "a red channel (5700 to 10100 Å)" |
| Resolving power | R ~ 1000, both channels |  | SOURCED (a design target) | P26 Abstract; Table 1; Sec. 2.3, p. 1 | "at a resolving power of R ≈ 1 000"<br>NOTE: no definition, no wavelength, no per-channel measurement (the instrument is not built). See the model check for what the geometry gives.<br>ALT (P26, Sec. 2.3, p. 4): "to achieve R ≈ 1 000 in both wavelength channels" |
| Average throughput, without the telescope | blue 42%, red 45% |  | SOURCED | P26 Table 1; Sec. 3.2, p. 8 | "the Boombox blue channel has an average throughput of 42% and the red channel has an average throughput of 45%"<br>NOTE: includes fibers, collimator, dichroic, grating, camera and CCD QE (Fig. 6).<br>ALT (VO, Sec. 2.4): "peaks around 40% in the blue channel and 43% in the red channel" |
| Image quality (geometric, nominal design) | blue RMS radius 4.6 um, EE95 8.8 um (max 12.6); red 3.8 um, 8.8 um (max 13.8) |  | SOURCED | P26 Sec. 3.1; Fig. 5, p. 6 | "The blue channel has an average RMS spot radius of 4.6 µm and an average EE95% radius of 8.8 µm"<br>NOTE: requirement EE95 <= 15 um (1 px) design, 24.6 um as built (Table 2).<br>ALT (P26, Sec. 3.1): "The PSF is dominated by aberrations, but well-matched to the pixel sampling at the detector" |
| Status | being built; commissioning in 2027 |  | SOURCED | P26 Abstract; Sec. 4, p. 1 | "an expected commissioning date in 2027"<br>NOTE: so the preset is marked (design) (as G-CLEF and ZShooter).<br>ALT (P26, Sec. 4): "currently in the detailed design phase" |

## Layout (Figs. 1, 2 and 4)

| element | tag | measurement | figure / evidence |
|---|---|---|---|
| Scale | SOURCED/MEASURED | Fig. 1 (left, p. 3) carries a 200 mm scale bar: 431.7 px between the end-cap centers of the embedded 3807 x 1735 px image = 2.158 px/mm. Checks: the drawn slit tick is 28 px = 13.0 mm (text: 13.6 mm); the five collimated rays span 111 px = 51 mm (text: 50 mm). Scale uncertainty about 3%, positions about +-3 mm. | Figure 1: scale bar '200 mm' |
| Order of elements (Fig. 1, top view, one on-axis field point) | SOURCED (caption) + MEASURED | fiber slit -> collimator triplet (CL1 CaF2, CL2 BSM51Y, CL3 S-FPL55) -> dichroic -> [blue: reflected down-left to the blue grating -> blue camera (axis horizontal, detector at the far left)] / [red: transmitted straight to a 45 deg fold mirror that turns it down -> red grating -> red camera (axis down-left, detector at the bottom)]. | Fig. 1 caption: Light is injected into the instrument at the fiber slit, split in wavelength at the dichroic beamsplitter, dispersed by the transmission grating, and imaged by each camera lens |
| Fiber slit to collimator | MEASURED | slit to the first lens (CL1 front vertex) 252 mm; the triplet is 81 mm long (CL1 front to CL3 back); slit to the last vertex 333 mm. Fig. 2 (p. 4, own 100 mm scale bar) shows the f/5.3 cone and the 300 mm pupil relief. | Fig. 1, Fig. 2 |
| Fiber slit orientation | SOURCED | the slit is perpendicular to the page in Fig. 1 (Via overview Fig. 15 caption: 'The fiber slit is defined perpendicular to the page'); spectra run along the dispersion in the page plane. | VO Fig. 15 |
| Collimator to dichroic to grating | MEASURED + SOURCED | CL3 last vertex to the dichroic center 113 mm; dichroic to the BLUE grating center 214 mm (path 328 mm from the vertex); dichroic to the fold mirror 66 mm and fold to the RED grating 129 mm (path 309 mm). The text's 300 mm pupil relief is measured from the lens assembly: the drawn paths run 3-9% longer (scale uncertainty and the Fig. 1 prescription predates the glass substitution). Preset: layLen = 300 + 40 (half the triplet) = 340 mm (DERIVED), both arms. | Fig. 1; Fig. 2 caption (300 mm) |
| Dichroic fold | SOURCED (22 deg) + MEASURED | plate line at 68.6 deg to the beam axis (AOI 21.4 deg); blue beam leaves at 137.25 deg to the incoming beam (Hough fit of 4 rays), the red continues straight. Preset blue foldAng = 360 - (180 - 2 x 22) = 224 deg (the old one was 225), foldPos 0.45 = (40 + 113)/340 (DERIVED). | Sec. 2.2; Fig. 1 |
| Red fold mirror | MEASURED | flat at 45 deg turning the red beam 90 deg to the SAME side as the blue (both turn clockwise on the page), 66 mm past the dichroic; foldAng 270, foldPos 0.65 = (40 + 113 + 66)/340 (the old 0.64). | Fig. 1 |
| Blue grating | MEASURED | substrate faces 65.1 deg to the page's horizontal; beam incidence alpha = 17.9 deg (beam at 42.75 deg below horizontal, normal at 24.9 deg); camera axis horizontal, so diffraction beta = 24.9 deg on the other side of the normal; camera-collimator angle (alpha + beta, the explorer's psi) = 42.8 deg. First order: lambda at the camera axis = (sin 17.9 + sin 24.9)/1.516 = 4800 A (INFERRED). +-0.5 deg. | Fig. 1 |
| Red grating | MEASURED | substrate faces 16.5 deg to the page's horizontal; the beam arrives vertically, so alpha = 16.5 deg; the detector center lies 332 mm along a line 37 deg from the incoming beam (the detector plane is perpendicular to it within 0.6 deg), so beta = 20.5 deg and psi = 37.1 deg (+-1 deg); lambda at the camera axis = (sin 16.5 + sin 20.5)/0.836 = 7600 A (INFERRED). THIS DOES NOT REACH THE BAND (see the model check). | Fig. 1 |
| Grating to detector | MEASURED | blue: grating center to the detector surface 362 mm, so camLen (the explorer's disperser-to-camera drawing distance = detector distance - f_cam) = 362 - 75 = 287 mm; red: 332 mm, camLen 257 mm. The old values were 267 and 229 (342 and 304 mm to the detector). | Fig. 1 |
| Camera drawings | SOURCED | Fig. 4 (p. 6) shows the 6-element blue camera and the 5-element red camera, after the glass substitution; the camera lengths scale with the 75 mm focal length. | Fig. 4 caption |
| Mechanical (not modeled) | SOURCED | Fig. 1 (right): the opto-mechanical rendering shows the fiber input and back-illumination system on the top, the LANSIS 261 cameras on focus stages, in a pentagonal enclosure scaled to the Zemax layout. | Fig. 1 caption |

**On-/off-axis verdict (deploy gate):** the collimator is a refractive triplet: the fiber slit stands at its focus on its axis, with no obscuration, no returning beam and no tilt (Fig. 2: "Light emanates from the fibers on the left into a f/5.3 cone of light, is collimated by the split triplet"). The drawing therefore uses col = "lens" and no colTilt.

## Model check (web/physics.js design(), read-only; script model.js / final.js)

Inputs from the paper: D 6.5 m, F = 264/50 = 5.28, a slit of equal line width to the 200 um core (0.866 x 1.202 = 1.041 arcsec, the explorer's convention), W = 50 mm, f_col 264 mm (reproduced by the model), f_cam 75 mm, 2048 x 263 of 15 um, first-order binary transmission gratings, alpha MEASURED (blue 17.85 deg, red 16.5 deg).

| case | result |
|---|---|
| blue, 1516 /mm, alpha 17.85, lambda_c 4800 (from the figure's beta 24.9) | R 1165, 1.197 A/px (79.8 A/mm), 3543-5944 A, 3.44 px line width, alpha 17.85, beta 24.91, psi 42.76 |
| red, 836 /mm, alpha 16.5, lambda_c 7600 (from the figure's beta 20.5) | R 1010, 2.240 A/px (149.3 A/mm), 5268-9761 A, 3.36 px line width, alpha 16.50, beta 20.57, psi 37.07 |
| red, lambda_c 7970 (EFFECTIVE, chip fitted to 5650-10100) | R 1059, 2.211 A/px (147.4 A/mm), 5659-10095 A, 3.40 px line width, alpha 16.50, beta 22.47, psi 38.97 |
| old blue preset (1385 /mm, alpha 19.2, 4750 A, Ny 256) | R 1061, 1.364 A/px (90.9 A/mm), 3333-6070 A, 3.28 px line width, alpha 19.20, beta 19.20, psi 38.40 |
| old red preset (857 /mm symmetric, 7981 A, Ny 256) | R 1109, 2.193 A/px (146.2 A/mm), 5700-10100 A, 3.28 px line width, alpha 20.00, beta 20.00, psi 40.00 |

Against the paper:
- **Dispersion** (not published; DERIVED): the paper's 75 mm camera and 15 um pixels give 1.20 A/px (80 A/mm) in the blue and 2.21-2.24 A/px (147-149 A/mm) in the red. The old blue preset's 1.364 A/px was 14% too coarse (its 1385 /mm).
- **Coverage:** blue from the figure's geometry alone (alpha and beta MEASURED, 1516 /mm): **3543-5944 A against the paper's 3550-5850 A (Table 2) and 3550-5750 A (nominal)**: the blue edge is reproduced to 7 A (0.2%) and the chip reaches 94 A past the design edge (a test independent of any fit, given the measured angles). Red from the geometry alone: 5268-9761 A, **short of 5650-10100 A by 382 A at the blue end and 339 A at the red end** (the chip spans 4440-4490 A depending on lambda_c, essentially the 4450 A band, so the center is pinned: lambda_c 7970 A, EFFECTIVE, gives 5659-10095 A, circular). The 1.4-1.9 deg gap between the figure's beta and the beta that centers the band is within the figure-reading error (the detector tilt is 1.6 deg) but cannot be closed from the paper: ask the designers for the red grating's alpha and the chip-center wavelength.
- **R:** the paper gives only R ~ 1000. The model's equal-line-width R is 1165 (blue, 4800 A) and 1059 (red, 7970 A) at 3.4 px. With the full 200 um core as the width (3.79 px, the Via team's convention for unmasked fibers: data/audit/2026-11-16_S2) R = 1058 (blue, 4800 A) and 951 (red, 7970 A), so R ~ 1000 is the full-core figure. The equal-line-width figure is 10-11% above it (the old note estimated 15%).
- **Sampling:** 200 um x 0.284 = 56.8 um = 3.8 px per fiber (3.4 px in the model's line width); the geometric EE95 is 8.8 um (0.6 px), "well-matched to the pixel sampling".

## NOT FOUND

- Grating angles of incidence and diffraction, groove profile and blaze/peak efficiency wavelength in the text (Fig. 3 gives the design efficiency curves only as an image), the ruled/clear size of the gratings, the diffraction order (INFERRED first).
- The telescope focal ratio at the fiber input, FRD at the output (the f/5.3 is the output), the fiber type and length.
- Per-channel dispersion, a measured or geometric R, the wavelength at the camera axis, the chip's wavelength range.
- Sky/calibration fibers on the Boombox slit (the paper counts 36 science fibers), and the slit's fiber pitch (13.6 mm total, DERIVED 0.383 mm).
- Which of Figs. 1 and 4 matches the final glass: Fig. 1 is "prior to glass substitution"; Fig. 4 shows the cameras after it. The collimator's final glass is described in the text.

## Conflicts between sources

| item | paper (P26) | older source | note |
|---|---|---|---|
| blue band | 3550-5750 nominal, 3550-5850 design | 3600-5900 (VO Sec. 2.4; the old preset) | the paper is newer |
| red band | 5750-10100 nominal, 5650-10100 design | 5700-10100 (VO; the old preset); 10000 (Via technical document) | the upper edge 10100 is confirmed |
| CCD rows | 2048 x 263 (3.95 mm) | 2048 x 256 (VO: 3.96 mm = 264 rows; the old preset Ny 256) | the paper's own pair of numbers is consistent (263 x 15 um = 3.945 mm) |
| fiber output ratio | f/5.3 | f/5.2 (Zemax drawing, MEASURED), f/5.23 (audit) | paper sourced |
| collimator | 264 mm (f/5.28) | about 260 mm (measured from the drawing) | paper sourced |
| camera | 75 mm | 70-72 mm in the Zemax drawing (the preset's 75 mm was DERIVED) | the drawing was wrong by 4-7% |
| blue grating | 1516 /mm | 1385 /mm (INFERRED from incidence 19.2 deg, symmetric) | the old inference assumed the grating symmetric at mid-band; the drawing is not (alpha 17.9, beta 24.9) |
| red grating | 836 /mm | 857 /mm (solved to span the band); the old drawing's incidence 24.8 deg | the new figure shows alpha 16.5 deg |
| throughput | blue 42%, red 45% (average, no telescope) | VO: peaks about 40% / 43%; mean 41% | same data, different statistic |
| dichroic AOI | 22 deg | 22.5 deg (measured from the bench layout) | confirmed to 0.5 deg |

## Notes

- **Preset names:** "Via / Boombox blue (design)" and "Via / Boombox red (design)"; inst "Boombox (design)"; settings "blue" and "red".
- **All-arms tree for web/arms.js GROUPS** (rename the key "Boombox (partly inferred)" to "Boombox (design)"; the dichroic's angle is now sourced, so the group's "note" line is dropped): `{ split: "collimated", tree: { cut: 5750, w: 95, aoi: 22, src: "Piotrowski et al. 2026 (submitted) Sec. 2.2: crossover 5750 A, tilt 22 deg, 90%R-90%T transition 95 A; blue reflected", R: "boomboxb", T: { fold: 45, rel: 1, src: "Piotrowski et al. 2026 Fig. 1: 45 deg fold mirror turning the red the same way as the blue", to: "boomboxr" } } }`. Split type: the collimated-beam split (the dichroic stands after the collimator, 113 mm past it, with the pupil on the gratings).
- **Is "(partly inferred)" droppable?** Yes for the optical prescription: collimator, camera, both groove densities, dichroic (cut, angle, width, side), detector and bands are now SOURCED. What remains is flagged in the note and the pub entries, not the name: the grating angles (MEASURED from Fig. 1), the diffraction order (INFERRED), the red lambda_c (EFFECTIVE) and R's definition. The "(design)" tag replaces it (construction, commissioning 2027).
- **Recommended preset values** (both arms, F = 5.28, D = 6.5, slitW = S3 x 0.2/(5.28 x 6500) x 206264.8 = 1.041 arcsec, nObj 36, col "lens", layLen 340, W 50, fcam 75, gType "trans", m 1, Nx 2048, Ny 263, pix 15, gFlip true, psi 35 unused, lamB1 5000): blue G 1516, tAlpha 17.85, lamC 4800, camLen 287, foldAng 224, foldPos 0.45, foldLabel "dichroic"; red G 836, tAlpha 16.5, lamC 7970 (EFFECTIVE), camLen 257, foldAng 270, foldPos 0.65. Validation targets (pub): R ~ 1000 (info), blue band lo 3550 (tol 0.01, tests the geometry), blue band hi 5850 (info: the chip passes it by 94 A), red lo 5650 and hi 10100 (info: circular, lambda_c is fitted), throughput 42% and 45% (info).
- **Image-quality figure (geometric, Fig. 5)** and tolerance results (Monte Carlo meets EE95 <= 24.6 um 99.4% of the time) are in the paper and not modeled.

## The design team's grating angles (2026-11-18)

Supplied by the Boombox design team on 2026-11-18, after this record was built; they replace the angles MEASURED from
Fig. 1 above (blue 17.9 / 24.9 deg, red 16.5 / 20.5 deg):

| grating | angle of incidence | angle of diffraction | camera-axis wavelength, first order (DERIVED) |
|---|---|---|---|
| blue, 1516 /mm | 18 deg | 24.48 deg | (sin 18 + sin 24.48) / 1.516 um^-1 = 4772 A |
| red, 836 /mm | 16.5 deg | 22.976 deg | (sin 16.5 + sin 22.976) / 0.836 um^-1 = 8066 A |

The explorer (web/physics.js, F 5.28, W 50 mm, f_cam 75 mm, 2048 x 263 of 15 um) then puts the blue chip at 3512-5921 A
and the red at 5762-10181 A, against the paper's Table 2 bands of 3550-5850 and 5650-10100 A, which include the
dichroic's overlap. The red chip starts 112 A above 5650 A: the band edges are compared as references, not scored. The
red channel's central wavelength is no longer EFFECTIVE. R with the full 200 um core as the line's width: 1004 (blue),
928 (red); with the equal-line-width slit: 1159 and 1072.

