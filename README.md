# Instrument Explorer

An interactive page on spectrograph design. Set the telescope, the slit, the beam diameter and
camera, the disperser and the detector; read off the resolving power, wavelength coverage,
dispersion, sampling and pixel scale; see the instrument drawn to scale and, in grating mode, the
Sun as the spectrograph would record it, or in echelle mode the format on the detector.

Sibling of spex, ismex, ionbal, dustex and lensex. The physics follows the Via notes "Notes on
Spectrograph Design" (`~/via/docs/spectro_design/spectro_design.tex`), whose worked example
(6.5 m, 1″ slit, R2 echelle) is the first block of the validation suite.

## Layout

- **Optical layout** (left): the spectrograph from above, in the dispersion plane. Auto scale refits the drawing
  on every change; Fixed scale keeps mm per pixel (and the scale bar) fixed so the instrument visibly grows and
  shrinks; scroll zooms about the pointer and drag pans (either switches to Fixed); Reset (or double-click)
  refits. A new preset, mode or global Reset refits too. Sizes are to scale
  (collimator F_tel·W, beam W, illuminated grating length, camera focal length, detector); the
  spacing between the elements is not part of the design and is drawn short, but keeps the camera arm
  clear of the incoming beam when the camera–collimator angle allows. Blue, gray and amber beams carry
  the shortest, central and longest wavelengths that reach the detector; the camera is labeled with its
  focal ratio on the diffracted beam. Echelle mode draws the camera beam in the plane at 30° (it really
  leaves at 2θ in the plane, or 2γ out of it) and the cross-disperser across it. A mirror collimator
  folds the drawing: everything after the collimator is the unfolded drawing reflected about the mirror
  (the beam meets the drawn parabolic mirror on its curve, both coming in and going out),
  a line through (f_col, 0) tilted by τ: by default τ = ½ asin(1.3 W/d), d the collimator–grating spacing, so
  that the returning beam clears the incoming one. The **Mod layout** pop-up in the panel header holds the
  drawing-only options: Collimated beam length (collimator to grating; automatic until moved), a Fold mirror
  (Off | On) in the collimated beam with its Fold angle (how far it turns the beam, 0–360°, counterclockwise
  on the page for either collimator, the far side of 180° turning clockwise; everything beyond it is drawn
  reflected about it) and Fold position (fraction of the way from the collimator to the grating), Grating turns
  light (As drawn | Flipped: the grating tilted the other way, so it turns the light to the other side; the
  grating and everything after it reflected about the collimated beam's axis), and the Collimator tilt τ
  (mirror collimators). The Viaspec Zemax layout (technical document, bench figure) is fold 113° at 0.78 of a
  ~2.85 m collimated beam, collimator tilt 0, grating Flipped: the fold and the grating turn the light the same
  way, sending the camera back alongside the collimated beam. None changes a number. Lens and mirror are the same ideal collimator, so the switch
  changes the drawing only (a real mirror is achromatic, a real lens is not). Labels are placed last,
  each at the first of its candidate positions that does not overlap a label already placed.
- **Detector** (right panel, both modes): the chip to scale with the spectrum of every object, drawn as
  the trace of a star on the slit: a Gaussian across the dispersion with FWHM = φ / pixel scale — a band
  one σ wide drawn into an offscreen layer, blurred by σ√(11/12) with the canvas filter (so the variance is
  σ² and the profile is Gaussian to ~1%, FWHM included, with smooth tails) and added back 2.51 times to
  restore unit peak; neighboring traces add where their wings overlap and light is conserved at any zoom
  (a first version, six nested flat strokes, cut the tails off at 8% of the peak and drew hard-edged tubes), colored by wavelength (blue → pale → amber,
  fixed in absolute wavelength) with brightness following the blaze, dimmed outside each order's free
  spectral range; in grating mode wavelengths along the bottom, in echelle mode order numbers on the left
  and blaze wavelengths on the right. The objects sit at different positions along the slit: in grating
  mode spread evenly over the chip height, in echelle mode stacked within the smallest order spacing; the
  Entrance box gives the gap between neighboring spectra, in pixels and in units of the trace FWHM across the
  dispersion (the slit, or the fiber's equivalent, width imaged along the slit: φ / pixel scale; for Via, whose
  0.7″ mask narrows only the dispersion direction, the 1.2″ fiber image, entered as 1.04″). Past ~4000 traces every k-th object is drawn. Hover for λ, order, object, R,
  Å/px and blaze; scroll to zoom down to the pixel grid (the resolution element under the pointer is
  outlined), double-click to reset.
- **Results strip**: effective R (the slit-limited value in its tooltip; the visible second number was removed at Charlie's request), Δλ (Å and km/s), coverage (and the number of orders),
  Å/px, sampling given separately along the dispersion (pixels per resolution element) and across it (pixels per
  trace FWHM, the slit or fiber width imaged along the slit), the spatial ″/px, and warnings.
- **Controls**, in the order the light travels (Telescope, Entrance, Spectrograph and Detector boxes share one
  width; the Disperser box is wider): Telescope (D, F) | Entrance (slit width, number of objects; readouts: width at the focus and
  the angle θ′ = θ_g cos α/cos β the slit subtends in the beam arriving at the detector, θ_g = φD/W) |
  Spectrograph (collimator Lens | Mirror and, for a mirror, its tilt; W, camera focal ratio, camera–collimator
  angle (reflection) or γ (echelle)) | Disperser (with the grating incidence for a transmission grating) | Detector. Grating
  and Echelle each remember their own entrance, optics and detector; the telescope is shared. The state
  is kept in the URL hash. Everything fits without scrolling at 1440 × 900 and 1280 × 800.
- **Presets** (header menu, 19): Keck/LRIS red, Keck/HIRES, Magellan/MIKE red and blue, Keck/DEIMOS,
  MMT/Binospec, MMT/Hectospec, MMT/Hectochelle, GMT/G-CLEF red (design), VLT/X-Shooter UVB, VIS and NIR, ESO 3.6 m/HARPS, DESI B, R and Z arms, Via/Boombox blue
  and red (partly guessed), and Via/Viaspec. Moving any control turns the setting into Custom. Presets are
  approximate and are meant to reproduce the optical design (and so the numbers); the drawing does not follow
  the actual optical layout. The page says so in the menu's tooltip and the footer.

Removed at Charlie's request on 2026-10-16: the slit-throughput result and the seeing slider; the fiber
and λ/D entrance options and the slit length ("just have the slit case; fibers are the same basic idea;
slit height is not important"); the overview strip above the spectrum; then the solar-spectrum panel altogether (2026-10-17: "not terribly
  useful"; grating mode shows the detector again, and spex's `_norm.bin` was removed from web/); the image-slicer slider (2026-10-17). `physics.js` still takes a
number of slices N, which the validation of the notes' worked example uses. An Imaging mode (the grating
replaced by a mirror: field of view and pixel scale) is planned; an exposure-time calculator is not in v1.

## Physics and assumptions

- **Units**: lengths in mm, wavelengths in µm inside `physics.js` and Å (air) on the page, sky angles in
  arcsec.
- **Collimator**: beam-matched, f_col = W F_tel. A point (ξ, ζ) mm on the slit leaves the collimator as a
  plane wave along normalize(c + (ξ/f_col) e_x + (ζ/f_col) e_y): the optical invariant θ_g = φ D/W.
  (`physics.js` still accepts a fiber with focal-ratio degradation η and a diffraction-limited input
  φ = λ/D; the page does not offer them, but the validation of the notes' worked example uses them.)
- **Dispersers**: the vector grating equation on plane surfaces, n₂ u₂,t = n₁ u₁,t + m λ G (tangential
  components), with |u₂| = 1 fixing the normal component (same side for refraction and transmission,
  reversed for reflection); in plane, m λ/σ = sin α + sin β.
  - Grating mode, reflection: the camera–collimator angle ψ = α − β is fixed and the grating tilted to put
    λc at the detector center. Blaze wavelengths are entered in first order (as gratings are cataloged,
    e.g. 600/7500): δ = asin(λ_b/2σ).
  - Grating mode, transmission (the default since 2026-10-17; volume-phase or surface-relief/binary: the same geometry): the symmetric
    setting α = β = asin(m λc/2σ), camera at 2α, until the Grating incidence slider is moved; then α is fixed, β follows λc and the camera
    sits at α + β (presets: DESI's as-built angles).
    No efficiency envelope for transmission gratings.
  - Echelle mode: α = δ + θ, β = δ − θ at the blaze center (θ in-plane, presets only; HIRES θ = 5°), the
    beam out of the dispersion plane by γ; m λ_blaze = cos γ (sin α + sin β)/G. Cross-disperser: a
    first-order reflection grating (camera–collimator angle 10° unless a preset says otherwise), a prism
    (N passes, each at minimum deviation for λc), or a grism whose exit face carries the grating, apex set
    so that λc passes undeviated: sin A = G λc/(n − 1). The cross-disperser's dispersion plane holds the
    reference ray and the normal to the echelle dispersion.
- **Camera**: set by its focal ratio on the diffracted beam, f_cam = F_cam W' (W' = W cos β/cos α); presets
  keep their sourced focal lengths and the slider shows the ratio they imply. An ideal f tan θ lens about the axis of the reference ray (λc at the slit center; in echelle
  mode the echelle blaze direction, cross-dispersed as λc): (X, Y) = f_cam (u·x̂, u·ŷ)/(u·ẑ).
- **Everything else is measured by tracing rays**: dispersion dX/dλ by central differences; the
  monochromatic slit image is a band along the slit direction ŝ, its width set by the slit edges; the
  resolution element is the wavelength shift that moves the band by its own width, both measured normal
  to ŝ, Δλ = |e ∧ ŝ| / |(dP/dλ) ∧ ŝ| (this handles tilted lines and tilted orders alike).
  R_slit = λ/Δλ (box FWHM = slit width); R_pix = n_pix R_slit; R_diff = m N_grooves; R_eff =
  (R_slit⁻² + R_diff⁻² + R_pix⁻²)^(−1/2), Eq. (lsf) of the notes. Dispersion and sampling are per pixel
  along X. Pixel scale along the slit from dP/dζ (analytically 206265 p W/(D f_cam), with the
  cross-disperser's anamorphism when there is one). Coverage: where the slit-center trace crosses the
  detector edges (bisection), over every order that touches the chip; gaps from the union.
- **Blaze efficiency** (reflection gratings, echelles): scalar theory, facets fully lit,
  sinc²[π σ cos γ cos δ (sin(α − δ) + sin(β − δ))/λ], relative to the peak.
- **Beam footprint** (Disperser readout): the area the beam covers on the grating, W/cos α along the dispersion
  by W along the grooves — the minimum ruled area, not the grating's physical size (HIRES 1210 × 303 mm against
  its 12 × 48 in mosaic; HARPS ~800 × 208 against 840 × 214 mm).
- **Glass** (prisms, grisms; `GLASS` in physics.js): Malitson 1965 fused silica; SCHOTT N-BK7, N-FK5,
  FK5HTi, SF6; OHARA PBM 2Y and PBM 2R; Infrasil 301 and ZnSe at 105 K (NASA CHARMS temperature-dependent
  fits, Leviton et al. 2005, 2008, evaluated at the X-Shooter NIR temperature: n(1 µm) = 1.44972, 2.47697).
  Each reproduces its source's indices. Outside the range a formula was fitted over (SCHOTT ≤ 2.3 µm,
  PBM 2Y 0.326–1.129 µm, Infrasil 0.50–3.6, ZnSe 0.55–5.6, silica 0.21–3.71) the index is undefined and those
  rays do not reach the detector. Prism cross-dispersers can be a train of prisms in different glasses
  (presets: X-Shooter NIR = 35° Infrasil + 2 × 22° ZnSe, double pass), each at minimum deviation for λc.
- **Warnings**: second-order light above 6400 Å (first order, atmospheric cutoff 3200 Å); orders m ± 1
  overlapping (m ≥ 2); coverage gaps (echelle); undersampling (< 2 px); R_diff < R_slit. (A "camera faster
  than f/1" warning was removed at Charlie's request; the camera focal ratio is a Spectrograph readout and a
  label in the drawing.) The echelle readouts give the smallest order spacing ("Order gap", above 3200 Å) in pixels
  and as the longest slit that fits between orders.
- **Grating drawing**: 12 schematic grooves at the true blaze angle: each blaze facet's normal is tipped by δ
  from the grating normal toward the incoming beam (the bisector of the incident and diffracted beams; at
  Littrow it faces the collimator), the riser at right angles. (A first version drew the facets mirror-reversed
  at a fixed schematic slope; corrected 2026-10-17 after Charlie asked whether the sign was right.)
- **Left out**: aberrations, field curvature and distortion, vignetting, the cross-disperser's own blaze,
  transmission-grating (e.g. Kogelnik) efficiency, detector gaps in mosaics, detector QE (coverage can
  run past the silicon cutoff), atmospheric dispersion, slit losses and every other throughput term, the
  exposure-time calculation.

## Presets

Parameters from the instrument papers and manuals collected in `data/presets_research.md` (every value
with a document, a location and a verbatim quote; documents in `rawdata/presets/`, not in git) and, for
Via, the Via technical document (section added at the end of the same file). Presets are approximate
and are meant to reproduce the optical design of each spectrograph (beam, disperser, camera, detector, and so
the numbers); the drawing's spacings, folds, and angles come from the Mod layout options and do not follow the
actual optical layout. Mapping choices:

- **Keck** (HIRES, LRIS): D = 10.95 m at f/13.7 — Oke et al. 1995: the 11-m outer perimeter gives f/13.7
  for the 150-m focal length — and W = f_col/13.7, so that the slit angle in the beam, φ f_tel/f_col, comes
  out right. With the nominal 10 m and the 12-inch beam, HIRES's R would be 9% too high.
- **HIRES geometry**: the in-plane offset θ = 5° enters as α = δ + θ, β = δ − θ. The other sign gives
  1.00 Å/mm in order 62; this one gives 1.67, as in the manual's format table.
- **MIKE**: the injection optics turn f/11 into f/3.3 (red) and f/3.6 (blue), so F = f_col/W
  (500/150, 550/150); the plate-scale readout is then the virtual one. Quasi-Littrow angles and prism
  angles are not published: θ = γ = 0 and each prism pass at minimum deviation.
- **Fiber-fed HARPS and DESI**: entered as the slit of equal line width, φ_eq = (√3/2) × core diameter (the
  FWHM of a uniformly lit round core). F is the spectrograph's own focal ratio (HARPS f/7.5, DESI f/3.57)
  so that the collimator comes out right. HARPS's grism apex is not published: set so λc passes
  undeviated; λc = order 115, which the manual places in the gap at the center of the mosaic.
- **DESI**: as-built groove densities and angles of incidence (DESI Collaboration 2022), λc at the middle
  of each arm's band.
- **Number of objects** counts every spectrum on the detector — science, sky, fiducial and calibration fibers
  (Charlie, 2026-10-17): DESI 500 fibers per spectrograph (DESI 2022), Viaspec 660 ("Number of Fibers (incl.
  calibration)": 540 positioned + 60 fixed fiducial/sky + Th-Ar calibration; Via technical document; first
  entered as 540, the positioned fibers only) and Boombox 36 (same table), HARPS 2 (fibres A and B: object and
  sky or reference), Hectospec 300 and Hectochelle 240 fibers (all that reach each detector), G-CLEF MR 3
  (1 science + 2 sky/calibration), HIRES, MIKE and X-Shooter 1 (sky along the slit); slit masks, an average per mask: DEIMOS 129
  (DEEP2), LRIS 30 (25–35 typical in the z ~ 3 surveys); Binospec 150 is a capacity (">150 slitlets per
  mask side"), no sourced average. With DESI's 500 the spectra land 8.2 px apart, against 7.4 px within a fiber block from the
  design report (230 µm × 0.48 / 15 µm) and ~7.7 px averaged over the 121 mm slit.
- **Collimators**, from the sources: mirror for LRIS (off-axis parabola), HIRES (spherical mirrors), HARPS
  (Zerodur parabola), DESI (spherical Schmidt), Via (800 mm spherical mirror), DEIMOS (concave conic mirror)
  and X-Shooter (Maksutov-type mirror + corrector); lens for MIKE (one set of large lenses, double pass),
  Binospec (three lens groups) and Boombox (refractive triplet).
- **DEIMOS** (Keck pages; Faber's 1995 grating table): collimator 86.50 in, beam 6.33 in on the 10.95 m
  primary (f/13.67), camera 15.00 in, fixed 44.451° camera–collimator angle, 1200G at 8000 Å, 0.75″ slit,
  8192 px along the dispersion. Blaze 7500 Å, the value consistent with the listed 26.7° (the Keck table's
  7760 Å is not).
- **Binospec** (Fabricant et al. 2019; MMTO table): plane reflection gratings (not VPH), f/5.3 input,
  refractive collimator 1097 mm, camera 404 mm, fixed 45°, 600 l/mm at 36.1° incidence (λc derived), 1″.
- **Hectospec** (Fabricant et al. 2005; manuals): 270 gpm at Hα (α 22.83°, β −12.17° in this sign convention;
  fixed 35°), 250 µm (1.5″) fibers at f/5.3, mirror collimator, 259 mm beam, catadioptric camera 397 mm,
  4608 × 4096 px of 13.5 µm. **Hectochelle** (Szentgyorgyi et al. 2011; observers guide 2023): the 110 /mm R2
  echelle in ONE order (31, RV31 filter) — grating mode, order 31, 15° between the beams; camera 642.6 mm
  (guide; the paper's 0.49 reduction implies 670.6 mm). Both were decommissioned in 2026.
- **G-CLEF** (2016–18 design; red arm, MR mode): 25.4 m at f/8, one 300 µm (0.8″) fiber, OAP collimator
  2400 mm, 300 mm beam, R4 echelle 31.6 /mm in Littrow with γ = 0.75°, red VPH cross-disperser (a new
  cross-disperser type here: transmission grating, symmetric at λc). It is a white-pupil design: the
  cross-disperser works in the 200 mm transferred beam and is imaged by the true 450 mm camera, while the
  echelle direction sees the effective 675 mm; the model has one camera (675 mm), so the VPH is entered as
  480 × 450/675 = 320 /mm, which gives the same order spacing (with 480 /mm only orders down to 71 fit, not 65).
- **X-Shooter** (Vernet et al. 2011; ESO manual 2024): echelles 180 / 99.4 / 55 /mm at 41.77 / 54.0 / 46.07°,
  in-plane offset 0, γ = 2.2 / 2.0 / 1.8°; prisms 60° silica, 49° SF6, 35° Infrasil + 2 × 22° ZnSe (105 K), all
  double pass; beams 100 / 100 / 85 mm; collimator and camera focal lengths are not published — effective
  cameras 270 / 280 / 177 mm from the published camera plate scales, UVB/VIS collimators from the slit plate
  scales, NIR slit focal ratio assumed f/6.5 (drawing only); detector areas used 3000 × 1800 (15 µm),
  4096 × 2048 (15 µm), 2048 × 1024 (18 µm); slits 1.0 / 0.9 / 0.9″; λc = blaze of the middle order.
- **Boombox** (blue and red; "partly guessed" in the menu, at Charlie's choice 2026-10-17): the Via technical
  document gives the bands (3600–5900, 5700–10000 Å), the unmasked 200 µm (1.2″) fibers, a refractive-triplet
  collimator, binary transmission gratings, f/1.5 cameras and 2048 × 256 CCDs with 15 µm pixels, but not the
  prescription (the ETC reads it from `viasim`, which is not on this machine). Guessed: fiber output f/5.3 as
  for Viaspec, a 35 mm beam shared by both channels, and each grating's groove density and central
  wavelength solved so its band exactly fills the 2048 pixels: blue 2101 /mm (pitch 0.98 λc — the
  pitch ≈ wavelength condition the document gives for these binary gratings), red 1157 /mm (1.08 λc).
  Coverage matches by construction and is not scored. R and sampling do not depend on the guess (with the
  band filling the chip, n_pix = φ D F_cam/p = 3.27 and R = λ/(n_pix Δλ_band/2048)): R = 900–1500 across the
  blue band and 760–1360 across the red, against "R ≈ 1000" (reference lines).
- **Via**: Viaspec with the adopted 0.7″ slit mask, 254 mm beam, 2000 /mm binary transmission grating in
  the symmetric setting at 550 nm, f/1.62 camera (focal length 1.62 × 254 mm, derived), 9k × 9k 10 µm.
  The technical document's "254 mm beam at ±5.7 degrees" is not used (its meaning is not resolved).
  ⚠ These are Via design numbers from an internal document; deploying the page publishes them.

Validation against the published numbers (`node validate.js`, block 4). Tolerances were set from each
source's precision before comparing; a first pass missed ten checks, handled as described below the table.

| preset | result (published) |
| --- | --- |
| LRIS 600/7500 | 0.812 Å/px (0.80), 3308 Å (3275), R 1510 (7500/4.7 = 1596), 0.1352″/px (0.135) |
| HIRES, 0.861″ | R 48,151 (Keck "calculated" 48,000; measured 50,000), 0.119″/px (≈ 0.12), 0.02506 Å/px in order 62 (1.67 Å/mm × 15 µm), first coverage gap at 6420 Å (≈ 6000) |
| MIKE red, 1″ | R 18,720 (Bernstein et al. 2003: 19,000; LCO manual: 22,000), 0.1425″/px (105 µm/″), 40 orders on the chip (31–69 = 39), order spacing 5.87″ (6″) |
| MIKE blue, 1″ | R 24,448 (25,000; LCO: 28,000), 0.1297″/px (115 µm/″), orders 74–107 span 27.6 mm (29), order spacing 5.70″ (6″) |
| HARPS | R 100,230 at 5370 Å against the manual's own sampling × dispersion (105,290); 3.49 px/FWHM (3.4); 3873–6828 Å (3800–6900); orders 90–158 (89–161); 0.0142 Å/px in order 114 (0.015); order spacing 36.9 px (34.2) |
| DESI B, R, Z | R at the band edges 1865/3100, 3185/4398, 3662/4869 ("approximately" 2000–3000, 3500–4500, 4000–5500); bands on the chip |
| Via | R 14,601 (≈ 15,000), 0.1015 Å/px = 5.53 km/s (5.5), 5018–5948 Å (505–595 nm) |
| Boombox blue, red | R 1212, 1071 at the chip centers (≈ 1000; reference only, the prescription is guessed) |
| DEIMOS 1200G, 0.75″ | 0.32404 Å/px (0.324), 6673.0–9293.7 Å (6673.0–9293.8), aberration-free R 6511 (8000/1.23 = 6504), slit image 3.79 px (3.79), 0.1192″/px (0.1185) |
| Binospec 600, 1″ | 0.611 Å/px (0.61), 6000–8497 Å (6000–8480), 3.35 px per 1″ (3.32), R 3532 (3590), 0.244″/px (0.24) |
| Hectospec 270, Hα | 1.231 Å/px (1.21), 5656 Å (5770), fiber image 5.06 px across the dispersion (5.1), 0.2795″/px (reduction 3.45) |
| Hectochelle RV31 | R from the fiber-image diameter 30,329 (nominal 32,000), 156 Å per order (~150), fiber image 5.08 px (5.1), α 71.6° (72°) |
| G-CLEF red MR | reddest order 66 (65); R 27,958 vs 35,000 and the order spacing are reference lines |
| X-Shooter UVB, VIS, NIR | R × sampling (the dispersion) 32,581 / 52,204 / 19,761 (33,480 / 50,730 / 20,160); order 18 / 23 span 38.2 / 56.1 nm (38.3 / 55.3); NIR 15 orders (16) |

The first-pass misses: (1) MIKE coverage ends (orders 37–70 of the LCO standard setting) depend on the
unpublished prism angle, so the comparison was ill-posed; the order count is the well-posed test.
(2) MIKE's "minimum separation 6″" applies to the published order range; the first check took the
minimum over redder orders that are on the chip only in this setting. (3) HARPS, with λc first at the
middle of the published range, sat 3–4% off on the format; the manual's own mosaic center (order 115)
fixes it. (4) HARPS R: the measured 115,000 (ESO web page: 120,000) is 13% above the model; the manual's
own sampling × dispersion gives 105,000, which the model matches to 5%. The 115,000 is printed as a
reference line, not scored. (5) DESI's "3.4 px" (FDR) is the fiber diameter × the 0.48 magnification
(f_cam/f_col, spatial), not the FWHM; the spectral image is wider by cos α/cos β = 1.04–1.07 at DESI's
asymmetric angles, so the B, R, Z images are 3.50, 3.60, 3.64 px across (printed as reference lines).
(6) MIKE blue order spacing is the one comparison that suggests a real model gap: 27.6 mm against 29 for
orders 74–107 (4.8%, inside the 5% tolerance) — the unpublished prism angles (the model puts every pass at
minimum deviation) are the likely cause.

**X-Shooter's slit image.** The model reproduces X-Shooter's dispersion in all three arms (order spans to
0.2–1.4%, R × sampling to 2–3%) but its slit image is 15–20% wider than the manual's: R 4467 / 7609 / 4767
against 5400 / 8900 / 5600, sampling 7.3 / 6.9 / 4.1 against 6.2 / 5.7 / 3.6 px. R ∝ W/D, and every arm is off by
the same factor (~1.17), as if the beam at the echelle were ~117 / 117 / 100 mm rather than the quoted
100 / 100 / 85 mm (D'Odorico et al. 2006). The collimator focal lengths are not published, so this is not
resolved here; R, sampling and the projected pixel scale (0.164 / 0.154 / 0.245″/px, larger than the plate
scales by the prisms' anamorphism, which the minimum-deviation prisms of the model do not have) are printed
as reference lines. The UVB/VIS order counts (12, 15) are set by the dichroic crossovers, which the model does
not include, and are reference lines too. **Hectochelle and G-CLEF quote R differently**: Hectochelle's nominal
R = 32,000 is defined from the full fiber-image diameter (the model, comparing like with like, gives 30,329),
and its measured 38,000 is a reference line; G-CLEF's published R (35,000 for MR) implies a line FWHM about
0.67 of the fiber image, 20% above the model's (√3/2)-diameter FWHM. Binospec's measured R = 4200 at Hα (Fabricant et al. 2025) is 30%
above its own grating table; DEIMOS's effective R (with aberrations, 5926) is a reference line, since the
model has no aberrations.

## Verification

`node validate.js` (137 checks, all pass; reference lines printed as [INFO]):

- **The worked example of the notes**, every row of its table, from the ray trace: plate scale
  6.35″/mm, slit 158 µm, f_col 500 mm, θ_g = 65″ = 3.15 × 10⁻⁴ rad, Littrow α = β = δ = 63.4°,
  R = 2 tan δ/θ_g = 12,693 (trace to 10⁻⁷), grating length 224 mm, diffraction ceiling 7.3 × 10⁵,
  f/0.95 camera → n_pix = 2.000000, R_eff = 11,352 (the notes' 11,400), 11% Nyquist loss, W = 1.74 mm for
  the same R diffraction-limited, W = 393.9 mm and f_col 1.97 m for R = 50,000, four slices → 50,773 and
  f/3.81, 9,128 resolution elements over 3800–7800 Å, fiber with η = 1.25 → 10,155, or a 125 mm beam with
  f_col unchanged.
- **Identities**, 400 random reflection set-ups: grating equation (5 × 10⁻¹⁶), anamorphic factor
  W'/W = cos β/cos α, R = (sin α + sin β)/(θ_g cos α), n_pix = φ D F_cam/p for any α, β (the anamorphic
  factors cancel), pixel scale independent of F_tel; R independent of F_tel; the diffraction-limited
  R = 2 tan δ W/λ the same on 2.5 m and 25 m and equal to m N; transmission-grating geometry and R;
  first-order coverage and dispersion against the closed forms.
- **Blaze**: 1 at the blaze; at the edges of the free spectral range of a Littrow R2 echelle the scalar
  envelope is 0.393 (red) and 0.417 (blue), straddling the small-angle sinc²(π/2) = 0.405.
- **Echelle**: m λ_b = 2 σ sin δ cos γ; free spectral range λ/m; blaze centers on the center column;
  R = cos γ · 2 tan δ/θ_g out of plane (exact, γ = 1° and 3°); slit-image tilt atan(2 tan γ tan δ)
  (3.99°, 11.8°); grating cross-disperser order spacing ∝ λ²; prism deviation 2 asin(n sin A/2) − A and
  angular dispersion 2 sin(A/2) dn/dλ/cos i, twice for two passes; grism apex and zero deviation at λc.
- **Presets**: above.

`node uitest.js` drives the page in headless Chrome (127 checks): every slider moves the results as the
optics requires (R ∝ 1/D, ∝ W, ∝ 1/φ, independent of F_tel and the camera; sampling ∝
F_cam and ∝ 1/p; coverage ∝ 1/F_cam and ∝ N_x; at fixed F_cam the pixel scale is independent of W), the disperser switches, echelle R4 ≈ 2 × R2 and
R ∝ cos γ, the warnings, the detector in grating mode and the number of objects (20 spectra spread evenly, hover names the
object), the echelle detector (hover reads the order and wavelength, zoom to the pixel
grid, reset), the URL hash round trip, all nineteen presets and their collimator types, the one-screen layout at 1440 × 900 and
1280 × 800 (grating, transmission, echelle, prism, HARPS), the phone width, and redraw times (echelle
~20 ms, grating ~6 ms). `node shot.js "<url#hash>" out.png [w] [h]` screenshots any state.

Dev server: `python3 web/serve.py 8795`. Deploy (once a GitHub repo exists): `./deploy.sh`, as for lensex.

## Things worth knowing (found while building this)

1. **Echelle R falls as cos γ** when the camera and collimator beams are separated out of the dispersion
   plane: R = cos γ (sin α + sin β)/(θ_g cos α). The notes call this a second-order correction; it is
   0.015% at 1° and 0.55% at 6°.
2. **With a cross-disperser, the slit image is a tilted band on a tilted order.** Projecting the slit width
   onto the order direction overestimates R by 1/cos² of the order tilt (0.17% in the default echelle).
   Measured normal to the slit image, the default echelle at γ = 1° loses 0.3% in R because the tilted line
   slides along itself in the cross-dispersion.
3. **The blaze envelope of a steep echelle is asymmetric** about the blaze (0.393 vs 0.417 at the two ends
   of the free spectral range for R2), because sin β curves over the order.
4. **"10 m" is the wrong D for Keck's slit angle.** The slit angle in the beam is φ f_tel/f_col; with
   f_tel = 150 m and the f/13.7 beam set by the 11-m perimeter, the equivalent D is 10.95 m. Using 10 m
   with the 12-inch beam makes HIRES's R 9% too high.
5. **DESI's 0.48 magnification is the spatial one.** At its asymmetric grating angles the spectral image
   is 4–7% wider (cos α/cos β).
