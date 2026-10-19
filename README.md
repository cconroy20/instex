# Instrument Explorer

An interactive page on spectrograph design. Set the telescope, the slit, the beam diameter and
camera, the disperser and the detector; read off the resolving power, wavelength coverage,
dispersion, sampling and pixel scale; see the instrument drawn to scale (in the plane of the dispersion,
along the slit, or in 3D) and the spectra as they fall on the detector.

A second mode, **Imager** (the Spectrograph | Imager switch in the header, 2026-10-19), does the same for
imaging: a telescope (prime focus, Cassegrain, Schmidt or refractor) feeding a detector mosaic directly or
through a reimager (collimator, pupil and filter, camera); read off the pixel scale, field, sampling and étendue;
see the telescope or the instrument drawn to scale and the detector plane (the mosaic on a synthetic sky). See **Imager mode** below.

Sibling of spex, ismex, ionbal, dustex and lensex. The physics follows the Via notes "Notes on
Spectrograph Design" (`~/via/docs/spectro_design/spectro_design.tex`), whose worked example
(6.5 m, 1″ slit, R2 echelle) is the first block of the validation suite.

## Layout

- **Optical layout** (left): the spectrograph from above, in the dispersion plane. Auto scale refits the drawing
  on every change; Fixed scale keeps mm per pixel (and the scale bar) fixed so the instrument visibly grows and
  shrinks; scroll zooms about the pointer and drag pans (either switches to Fixed); Refit (or double-click)
  refits. A new preset, mode or Reset all (header: the whole instrument back to the defaults) refits too. A
  caption beside the scale bar says what the view simplifies (echelle: the camera arm drawn at 30°) or how to
  steer it (3D, Spatial with one free point); Labels Hide hides the caption too. Sizes are to scale
  (collimator F_tel·W, beam W, illuminated grating length, camera focal length, detector); the
  spacing between the elements is not part of the design and is drawn short, but keeps the camera arm
  clear of the incoming beam when the camera–collimator angle allows. Blue, gray and amber beams carry
  the shortest, central and longest wavelengths that reach the detector; the camera is labeled with its
  focal ratio on the diffracted beam. Echelle mode draws the camera beam in the plane at 30° (an echelle works near
  Littrow, so the true beams lie almost on top of each other: 2θ apart in the plane, or 2γ out of it; the caption
  says which) and the cross-disperser across it. A mirror collimator
  folds the drawing: everything after the collimator is the unfolded drawing reflected about the mirror
  (the beam meets the drawn parabolic mirror on its curve, both coming in and going out),
  a line through (f_col, 0) tilted by τ: by default τ = ½ asin(1.3 W/d), d the collimator–grating spacing, so
  that the returning beam clears the incoming one. The **Mod layout** pop-up in the panel header holds the
  drawing-only options: Collimated beam length (collimator to grating; automatic until moved), the Collimator
  tilt τ just below it (mirror collimators), a Fold mirror
  (Off | On) in the collimated beam with its Fold angle (how far it turns the beam, 0–360°, counterclockwise
  on the page for either collimator, the far side of 180° turning clockwise; everything beyond it is drawn
  reflected about it) and Fold position (fraction of the way from the collimator to the grating), Grating turns
  light (As drawn | Flipped: the grating tilted the other way, so it turns the light to the other side; the
  grating and everything after it reflected about the collimated beam's axis), Labels and marks (Show | Hide: the text,
  the W arrow, the grating normal with α and β, and the scale bar; Hide leaves the optics and the rays). The Viaspec Zemax layout (technical document, bench figure) is fold 113° at 0.78 of a
  ~2.85 m collimated beam, collimator tilt 0, grating Flipped: the fold and the grating turn the light the same
  way, sending the camera back alongside the collimated beam. None changes a number. Lens and mirror are the same ideal collimator, so the switch
  changes the drawing only (a real mirror is achromatic, a real lens is not). Labels are placed last
  (2026-10-18): each candidate position is scored by what is already drawn under the label, read back from the
  canvas (darkness × opacity over 2 × 2 px cells through a summed-area table; pale beam and glass tints count a
  little), by any overlap with a label already placed (heavily), and by its rank in the label's own list; a label
  with no clear spot of its own takes one on rings around its element (24, 38, 54 px) with a thin leader line, and
  the marks' labels (W, α, β) are left out when they cannot find room. The scale bar and caption stay at the
  panel's lower left (Charlie's call: not following the drawing), and the layout panel takes about 62% of the width when the detector chip is wide (2:1 or more).
- **3D** (third layout view, grating mode; 2026-10-17): the dispersion-plane drawing with the slit direction as a
  third axis, in an orthographic view with orbit controls (as in CAD viewers and three.js's OrbitControls): a
  sideways drag spins about the slit axis without limit, an up-down drag tilts from straight over to straight
  under (no roll), a release coasts to a stop; right- or shift-drag pans, scroll zooms, double-click resets;
  snaps: Top = the Spectral view, Side = looking along the dispersion plane, Oblique. Beams are solids: the surface swept by
  each bundle's circular pupil (cone to the collimator, tube through the collimated beam, tube to the camera,
  cone to the focus), translucent, shaded by the angle to a fixed light and outlined by its silhouette (the
  lengthwise edges where the surface turns from the viewer, found for each view) and a faint ring where it
  meets each optic; lenses are discs with rims, the
  grating, fold mirror and detector are plates. Three slit points (top, center,
  bottom) each send a bundle (20 rays around the edge of the circular pupil) that leaves the collimator sloping by
  −z/f_col along the slit and crosses the axis at the grating (the pupil); after the grating each ray follows
  the traced 3-D direction (the tracer's slit coordinate is −z) to its focus. Rays colored by wavelength (three,
  plasma) or by slit position (brick/gray/teal). The grating's grooves are drawn along the slit; the detector
  carries each slit point's spectrum and arrows for λ and the slit direction. Drawn back to front as translucent
  faces (no hidden-surface removal; a redraw takes ~3 ms); no scale bar (foreshortened). Echelle mode to follow.
- **About** (header, beside Reset all): a dialog with the notes on the model (ideal optics, ray-traced numbers, how R
  is combined, what the presets reproduce), closed by ×, Esc or a click outside; the page's foot keeps only the
  credit line (2026-10-18, at Charlie's request).
- **Expand** (the diagonal-arrows icon at the lower right of the layout panel): the layout fills the window, for
  playing with the drawing directly; the same button (now arrows pointing in) or Esc returns it to the page.
- **Spectral | Spatial** (layout panel header, grating mode). Spectral is the plane of the dispersion described
  above: white light as gray rays, then seven wavelengths as colored rays (matplotlib plasma 0.04–0.80, indigo
  short to orange-gold long, lightness rising) meeting at their foci on the detector, with the W arrow, the
  grating normal with α and β, and each element's key number. Spatial is the plane that holds the slit length,
  unfolded onto one axis at λc (a mirror collimator drawn as a lens; the fold, flip and tilt options do not
  apply). Slit points (control at the drawing's top left): 3 fixed (the two ends of the recorded slit length,
  detector height × f_col / f_cam, and its center) or 1 free (a single point, dragged along the slit or by its
  image along the detector); colored brick (top) / gray (center) / teal (bottom), each leaving the collimator as a parallel bundle at slope −h / f_col whose
  center crosses the axis at the grating (the pupil), then imaged inverted at −h f_cam / f_col; the grating is
  seen from the side, foreshortened to W tan α with the grooves along the slit, and the detector ends carry the
  sky offsets of the slit points that land there. Echelle mode has no Spatial view (the cross-disperser bends
  the light in that plane).
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
  outlined), double-click or the Reset zoom button (shown only while zoomed) to reset. While the pointer is off
  the traces, the panel's header holds the key: the color ramp (0.32–0.88 µm, fixed in absolute wavelength),
  "brightness: blaze" where there is a blaze, and in echelle mode "faint: outside the FSR". A lone trace narrower
  than a screen pixel (grating mode, objects far apart) is drawn at σ = 0.55 px so that one star shows on the
  whole chip; zooming in reaches the true width.
- **Results strip** (restyled 2026-10-17 at Charlie's request): one row, a card centered above the panels (the headline numbers, right under the header) on a
  pale tint of the accent color, five figures with a label each: Resolution ("R =" and R in the same dark type as the other figures, then Δλ in Å and in km/s,
  muted; "resolving power and resolution are both resolution"), λ range (the orders' count is in the Disperser box, gaps raise a warning), Dispersion,
  Spatial scale, Sampling, λ × spatial; warnings as chips at the right end, folded into one "n warnings" chip
  (the list in its tooltip) when they do not fit. No dots between numbers. On a phone the row scrolls sideways.
- **Controls**, in the order the light travels (Telescope, Entrance, Spectrograph and Detector boxes share one
  width; the Disperser box is wider): Telescope (D, F) | Entrance (slit width, number of objects; readouts: width at the focus and
  the angle θ′ = θ_g cos α/cos β the slit subtends in the beam arriving at the detector, θ_g = φD/W) |
  Spectrograph (collimator Lens | Mirror; W, camera focal ratio, camera–collimator angle (reflection) or γ
  (echelle)) | Disperser (Grating | Echelle in the box header; the grating kind, Reflection | Transmission | Grism,
  with the grating incidence for a transmission grating and the apex, glass and Ruled | VPH for a grism) | Detector. Grating
  and Echelle each remember their own entrance, optics and detector; the telescope is shared. The state
  is kept in the URL hash, written a moment after the last change; a link edited by hand is followed, and a value
  of the wrong kind in the link (a negative size, an unknown glass) is ignored. A preset whose instrument the link
  changes loads as Custom. Everything fits without scrolling at 1440 × 900 and 1280 × 800 (every preset is checked
  at the smaller size): the layout and detector panels take the height the window has left after the header, the
  results strip and the controls (2026-10-18), so they grow wherever the controls are short.
- **Presets** (header menu, 54, grouped by telescope): Keck/LRIS red, HIRES, ESI, KCWI blue, KCRM red, DEIMOS and
  MOSFIRE Y/J/H/K; Magellan/MIKE red and blue, MagE, FIRE, IMACS f/4, LLAMAS blue/green/red (gratings fitted) and
  LDSS-3 VPH-All/Blue/Red; MMT/Binospec, Hectospec and Hectochelle; GMT/G-CLEF red (design); VLT/FORS2 300V, 300I
  and 600B, ESPRESSO blue and red, MUSE (effective optics), UVES blue and red, X-Shooter UVB, VIS and NIR; ESO
  3.6 m/HARPS; Subaru/PFS blue, red and NIR; Mayall/DESI B, R and Z; VISTA/4MOST LRS and HRS blue/green/red (HRS
  concept optics); SDSS/APOGEE-N; MPG 2.2 m/FEROS; Via/Boombox blue and red (partly guessed), and Via/Viaspec. Moving any control turns the setting into Custom. Presets are
  approximate and are meant to reproduce the optical design (and so the numbers); the drawing does not follow
  the actual optical layout. The page says so in the menu's tooltip and the footer.

Removed at Charlie's request on 2026-10-16: the slit-throughput result and the seeing slider; the fiber
and λ/D entrance options and the slit length ("just have the slit case; fibers are the same basic idea;
slit height is not important"); the overview strip above the spectrum; then the solar-spectrum panel altogether (2026-10-17: "not terribly
  useful"; grating mode shows the detector again, and spex's `_norm.bin` was removed from web/); the image-slicer slider (2026-10-17). `physics.js` still takes a
number of slices N, which the validation of the notes' worked example uses. An Imaging mode (the grating
replaced by a mirror: field of view and pixel scale) is planned; an exposure-time calculator is not in v1.

## Telescopes mode

The third header button (2026-10-19; Charlie: "start with just three: Keck, Magellan, and HST"). One telescope at one
of its foci: the Optical layout draws it to scale (the Imager's telescope drawing; Cassegrain, Gregorian, Nasmyth with
a flat tertiary, bent-Cassegrain and folded ports drawn as short Nasmyth folds), and **Pupil and image** shows the
entrance pupil beside the image of a star it makes. The pupil (web/tpupil.js) is a mask on a 1024 × 1024 grid spanning
8 D (so the image has 8 pixels per λ/D): hexagonal segments in rings around an empty center, or one mirror; less a
central obstruction, spider vanes (each pixel's coverage by a vane found exactly from the pixel's overlap with the
vane's strip: sampling quantized a 2.6 cm vane by 9%) and pads; the image is |FFT|², drawn on a log (five decades) or
linear stretch. The strip: collecting area (measured from the mask) and the equal-area circle, focal ratio and focal
length, plate scale, the diffraction FWHM (measured from the image: within 0.3% of the annular Airy FWHM), field.
Telescopes (web/tpresets.js; sources data/telescopes/{keck,magellan,hst}.md), one menu line each: Keck 10 m (Keck I
and II as one, the same design: 36 segments of 0.9 m sides, a 2.6 m obstruction, six 25 mm vanes; Cassegrain, both
Nasmyths, bent Cassegrain, and the historical f/25 of Keck I and f/40 of Keck II, whose undersized secondary is the
stop), Magellan 6.5 m (Clay, the twin with more foci: f/11 Gregorian Nasmyth West and East and the folded ports, the f/5
Cassegrain and the f/16 adaptive secondary; four vanes from points 0.34 m off center, two widened to 1.5 in by the MagAO
cable trays), Hubble 2.4 m (the OTA Handbook's pupil: 3.899 m² clear, reproduced exactly). Charlie (10-19): the two
Nasmyth platforms are drawn on opposite sides (right or West folds down the page, left or East up; IM option nasSide,
also set on the Imager's FourStar and NIRC2); no instruments are listed at the ports. Links to the old keck1, keck2,
baade and clay entries open the merged telescope. Pupil and image (10-19, his asks: "those are just diffraction-limited, right? should be made
clear in the panel"; "why is the pupil image so fuzzy"; "should include a version with an atmosphere side-by-side"):
three images, the entrance pupil (drawn from its own raster at the screen's resolution: the FFT grid has only 128
cells across the pupil), the diffraction-limited image ("perfect optics, no atmosphere") and the seeing-limited image
(TP.seeingPSF: the telescope's transfer function, the transform of its diffraction-limited image, times the
Kolmogorov long-exposure transfer function exp[−3.44 (s/r0)^(5/3)], r0 = 0.976 λ / seeing, transformed back
(sources in data/telescopes/seeing.md: 3.44 = 6.88/2 from Sarazin & Roddier 1990 and Tokovinin 2002, printed by
Coulman 1985 after Fried 1966; 0.976 from Martinez et al. 2010, the unrounded form of their 0.98); the grid
puts the pupil at most 512 cells across so the autocorrelation does not wrap, and the image shows 4 FWHM). The seeing
slider (Image box, 0.1–4″, default 0.8″, link key t.see) is the FWHM at the band's wavelength (λ only enters the
diffraction, as in the Imager). Readouts: the seeing-limited FWHM (measured) and the peak relative to the
diffraction-limited image of the same star. HST's seeing-limited image is labeled "if on the ground". Checked
against an independent 1-D Hankel transform for a round pupil (FWHM and peak within 0.05%), the seeing → 0 limit
(the Airy FWHM) and the large-telescope limit (the seeing set). The FFT now tabulates its twiddles and copies
columns out (8× faster: 30 ms for 1024²). The collecting area is geometric; each focus lists its reflections,
but no reflectivity is applied.

## Imager mode

Charlie's calls (2026-10-19): a mode of its own behind a header switch (its layout, controls and presets differ
from the spectrograph's), presets of real imaging instruments, direct imagers included, a pedagogical page first.
The "focal ratio is speed" lesson (signal per pixel from an extended source ∝ (p/F)²) belongs in a separate memo,
not on the page. The band's wavelength enters only the diffraction width.

- **Engine** (`web/imager.js`, window.IM): every optic is an ideal thin element acting on the ray slope
  t = tan θ (t′ = t − h/f), so a star images to one point at f_eff tan θ and the chain is exact. Telescopes:
  prime focus, Cassegrain (primary f/F1, convex secondary placed for the magnification F/F1 with the focus a set
  distance behind the primary; F1 and that distance are drawing options), Gregorian (a concave secondary beyond
  the prime focus, s = (m f1 + b)/(m − 1); Magellan), either one with its focus Axial (behind the primary) or
  Nasmyth (a flat tertiary 0.2 D in front of the primary turns the beam to the side; drawing only: a flat fold
  changes no number; IMACS on Magellan Baade and NIRC2 on Keck II, Charlie's review 2026-10-19), three-mirror
  (Korsch: Euclid, Roman, JWST; Paul-Baker: Rubin; the drawing fixes where the mirrors sit and the secondary's
  and tertiary's focal lengths are solved to give F and put the image at the drawn focus; the Paul-Baker
  defaults land within 6% of Rubin's mirrors), Schmidt (the aperture stop at the
  corrector, at the mirror's center of curvature, so the mirror is larger than the aperture and the exit
  pupil lies past the focus), refractor. Reimaged: collimator f_col = F W one focal length past the focus, the
  pupil (where the bundles cross) at f_col + f_col²/L past the collimator (L the exit pupil's distance before the
  focus), the camera f_cam = F_cam W just past the pupil; the effective focal ratio is F_cam. Mosaic: centered
  rows (top to bottom) of one chip format, with optional gaps per column and row, a shift per column (Roman's
  arc) and chips placed by hand (HSC's four turned chips). The field circle (a telescope's corrected field or an
  instrument's field stop) cuts the mosaic: the field is the chips inside the circle, its solid angle exact
  (rectangles under f tan θ) for whole chips and summed on a grid for cut ones. PSF: seeing (Moffat β = 4.765,
  Trujillo+01, with the diffraction width in quadrature), the optics' own blur (the same profile; TESS, whose
  lenses set the image), or diffraction (the annular Airy pattern, J1 by the trapezoid rule on its integral
  representation).
- **Optical layout**: Telescope (the whole telescope folded as built, light from the left) or Instrument
  (from the telescope focus on, unfolded). Three field points (top, center and bottom of the field: brick,
  gray, teal) each send an annular bundle (the central obstruction's shadow inside). Heights: To scale |
  Stretched (Instrument view only; heights × the largest of 1, 1.5, 2, 3, 4, 5, 6, 8, 10 … that fits the panel,
  stated in the caption; the field-angle arc drawn at the angle on the page and labeled with the true angle).
- **Detector plane** (the right panel; "Sky" until Charlie's rename, 2026-10-19): a synthetic, seeded field of
  stars and galaxies, the same at every scale: one-magnitude slices on their own grids of tiles (about twelve
  objects a tile), plus one fixed 20 mag target star near the center (1.7″, 1.1″) so that small
  diffraction-limited fields show the Airy rings. A **Depth** slider in the panel header (16–29 mag, default 25;
  his ask) sets the faintest magnitude drawn, a stand-in for exposure time; a view too wide to draw that many
  objects one by one (about 15,000) stops at the magnitude that fits, and the readout says so ("27.0 mag (21.7
  here)"). Brightness is flux per max(detector pixel, screen pixel), so zooming in turns into the
  pixelated image without a jump; white is the peak of a star 4 mag brighter than the depth drawn; each
  object is drawn out to where it falls below half the stretch's knee, with a tapered edge. Zoomed in past
  2.5 screen pixels per detector pixel, each star is integrated over the pixels. Optional full-Moon outline
  (1896″, NSSDC).
- **Constants** (data/imaging/constants.md): band wavelengths are the SVO pivot wavelengths; Moffat β; the
  Moon; the annular Airy FWHM checked against an independent table.
- **Presets, round 2** (Charlie's picks, 2026-10-19; data/imaging/{vst_lbc,magellan,niri_hawki,tess}.md): VST
  OmegaCAM, LBT LBC-Blue and LBC-Red (three CCDs and a turned fourth, the axis on the middle chip), Magellan
  Megacam (Clay f/5 Cassegrain) and FourStar (Baade f/11 Gregorian Nasmyth, reimaged through a 130 mm cold
  pupil), Gemini NIRI f/6, f/14, f/32 (the 7.9 m pupil of the undersized secondary), VLT HAWK-I (UT4 Nasmyth; the
  pupil size is not published, so W = 100 mm is the drawing's assumption), TESS (one camera, an optics blur of
  24″; the strong distortion is left out). Ten presets in this round, 31 in all.
- **Previous generation** (Charlie's picks, 2026-10-19; data/imaging/{poss,twomass,fourshooter}.md): the Palomar
  Sky Surveys on plates (POSS-I red E plates, POSS-II red F plates), the 2MASS camera, and the Palomar 200-inch
  4-Shooter. Two new features: a **photographic plate** detector (Detector: CCD | Plate; one square plate with no
  pixels, drawn as the negative the survey prints show, with value-noise grain of the emulsion's spread fixed on the
  plate; the emulsion's spread adds in quadrature to the image; the pixel-based numbers use the later scan's step,
  DSS-1 25.3 µm and DSS-2 15 µm; a preset may set the display depth to its plates' limit), and a **pyramid splitter**
  (Optics: Split: One camera | Pyramid (4); the 4-Shooter's flat pyramid, facets tilted 5°, reflects each quadrant
  back 10° off the axis to its own camera, centered on that quadrant, so each camera takes one chip's
  half-diagonal; the Instrument view draws two of the four arms, the Telescope view a box at the focus). The
  4-Shooter's and 2MASS's internal focal lengths and pupils are not published: placeholders, flagged in the notes.
- **Presets** (web/ipresets.js, the first 21; sources data/imaging/{widefield,megacam_ztf_small,hst,space_wide,reimagers}.md,
  documents in rawdata/imaging/): LSSTCam, HSC, DECam, MegaCam, ZTF, an 80 mm refractor with a CMOS camera,
  ACS/WFC, WFC3/UVIS, WFC3/IR (reimaged through the published cold-mask pupil), Euclid VIS, Roman WFI, NIRCam
  short and long wavelength (reimaged), FORS2 (standard and high resolution), IMACS f/2, LRIS red, MOSFIRE,
  NIRC2 narrow, medium and wide. Things worth knowing: HST's published focal ratios (f/25, f/31, f/11) give
  pixels 3–10% too coarse because the detectors tilt 21–24°, so the presets use the focal lengths that reproduce
  the scales (the design values for WFC3); the nominal fields of LSSTCam (3.5°) and HSC (1.5°) are smaller than
  the mosaics, whose CCDs the published areas and pixel counts count whole; NIRC2's internal optics are not
  published (W, f_col and f_cam are estimates from the aperture masks; they leave the scale unchanged); HSC's
  central obstruction is not published (ε = 0 in the preset); square and rectangular field stops (FORS2's
  slit unit, LRIS's slit-mask area) are not modeled; the JWST and Keck pupils are hexagonal, the model's annular.
- **Checks**: `node validate_img.js` (ideal imaging, scales, the Cassegrain and Schmidt geometry, the pupil
  position and beam angle tan φ = (D/W) tan θ, mosaic geometry and field areas against brute-force sums, the
  Airy pattern, and every preset against the published pixel scales, fields, areas and pixel counts; 131 pass,
  plus [INFO] lines for the circular or differently defined ones). deploy.sh runs it too.

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
  - Grating mode, grism (2026-10-17): the camera sits on the collimator axis, so the wavelength at the detector
    center is the undeviated λ0, fixed by the grism (the λc slider is hidden). Ruled: a prism of glass n(λ) and
    apex A entered square to the beam, the grating on the hypotenuse, m G λ0 = (n − 1) sin A. VPH: the grating
    layer square to the beam between two prisms of apex A whose outer faces refract the beam to the Bragg angle
    and back, m G λ0 = 2 n sin(A − t), sin t = sin A / n. Both are traced surface by surface, the glass index
    following the wavelength; validate.js checks λ0, the straight-through axial ray and, for the ruled grism,
    the dispersion (m G − sin A dn/dλ)/cos A to 1e-6. A ruled grism's entrance face may be tilted by ε (FORS2:
    7.5°): m G λ0 = n sin(A − ε′) − sin(A − ε), sin ε′ = sin ε/n, the beam on the grating W cos ε′/(cos ε cos(A − ε′)).
    λ0 is found by scanning the glass's valid range for the fixed point and bisecting (the root nearest λc when
    there are several); a grism with none in range is reported, not drawn. Choosing Grism sets A so that λ0 starts
    at the current λc (and leaving Grism restores the grating's grooves); switching Ruled | VPH keeps λ0.
  - Echelle mode: α = δ + θ, β = δ − θ at the blaze center (θ in-plane, presets only; HIRES θ = 5°), the
    beam out of the dispersion plane by γ; m λ_blaze = cos γ (sin α + sin β)/G. Cross-disperser: a
    first-order reflection grating (camera–collimator angle 10° unless a preset says otherwise), a VPH grating
    in first order at the Bragg setting for λc, a prism
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
  (R_slit⁻² + R_diff⁻² + R_pix⁻²)^(−1/2), Eq. (lsf) of the notes. Three assumptions sit in these numbers: the
  slit is uniformly lit (a star smaller than the slit gives a narrower line and a higher R); R_diff is the
  Rayleigh limit; the quadrature sum treats each term as a Gaussian. The results strip gives R at λc; in
  echelle mode R varies along an order, and at the blaze center without a cross-disperser R_slit = cos γ · 2 tan δ/θ_g
  (a cross-disperser tilts the orders under lines tilted by γ, which moves R by a few tenths of a percent at γ = 1°,
  ~1.5% more at 6°: item 2 of "Things worth knowing"). Dispersion and sampling are per pixel
  along X. Pixel scale along the slit from dP/dζ (analytically 206265 p W/(D f_cam), with the
  cross-disperser's anamorphism when there is one). Coverage: where the slit-center trace crosses the
  detector edges (bisection), over every order that touches the chip, bounded by the atmospheric cutoff
  (3200 Å) and by 2.6 µm (an edge still on the chip there is the limit); gaps from the union. An echelle order
  is kept if any part lands on the chip, even when the order's blaze lies outside the prism glass's valid range.
- **Blaze efficiency** (reflection gratings, echelles): scalar theory, facets fully lit,
  sinc²[π σ cos γ cos δ (sin(α − δ) + sin(β − δ))/λ], relative to the peak.
- **Beam footprint** (Disperser readout): the area the beam covers on the grating, W/cos α along the dispersion
  by W along the grooves — the minimum ruled area, not the grating's physical size (HIRES 1210 × 303 mm against
  its 12 × 48 in mosaic; HARPS ~800 × 208 against 840 × 214 mm).
- **Glass** (prisms, grisms; `GLASS` in physics.js): Malitson 1965 fused silica; SCHOTT N-BK7, N-FK5,
  FK5HTi, N-BAK2, LF5, SF6; OHARA PBM 2Y, PBM 2R, BSL7Y and S-LAL7; Infrasil 301 and ZnSe at 105 K (NASA CHARMS
  temperature-dependent fits, Leviton et al. 2005, 2008, evaluated at the X-Shooter NIR temperature: n(1 µm) =
  1.44972, 2.47697). Each reproduces its source's indices. Outside the wavelengths the glass's datasheet tabulates
  (SCHOTT from 0.28–0.37 µm, by glass, to 2.33 µm; PBM 2Y and BSL7Y 0.326–1.129 µm; PBM 2R and S-LAL7
  0.365–2.325 µm; Infrasil 0.50–3.6, ZnSe 0.55–5.6, silica 0.21–3.71) the index is undefined and those rays do
  not reach the detector. Prism cross-dispersers can be a train of prisms in different glasses
  (presets: X-Shooter NIR = 35° Infrasil + 2 × 22° ZnSe, double pass), each at minimum deviation for λc.
- **Warnings** (each explained in a tooltip): orders m ± 1 overlapping (grating mode, m ≥ 2; the
  first-order "second-order light needs a filter" warning was removed at Charlie's request, 2026-10-17); adjacent
  echelle orders closer than one trace width (the slit image's extent across the dispersion, projected onto the
  order spacing); coverage gaps (echelle); no orders on the detector; undersampling (< 2 px); R_diff < R_slit. (A "camera faster
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
A 2026-10-17 audit turned 35 scored checks into reference lines: checks the preset was fitted to (circular),
checks that repeat two others (R = n_pix × dispersion), and misses that loose tolerances had hidden. R
comparisons now name which R they mean: the slit-limited R_slit for design values quoted at a slit width,
the effective R for measured ones. "(ref.)" marks a reference line in the table.

| preset | result (published) |
| --- | --- |
| LRIS 600/7500 | 0.812 Å/px (0.80), 3308 Å (3275), R 1510 (7500/4.7 = 1596), 0.1352″/px (0.135) |
| HIRES, 0.861″ | R_slit 49,417 (Keck "calculated" 48,000; measured 50,000), 0.119″/px (≈ 0.12), 0.02506 Å/px in order 62 (1.67 Å/mm × 15 µm), first coverage gap at 6420 Å (≈ 6000) |
| MIKE red, 1″ | R_slit 18,938 (Bernstein et al. 2003: 19,000; LCO manual: 22,000), 0.1425″/px (105 µm/″), orders 31–69 span 31.2 mm against the 30.7 mm chip (ref.; the model holds 30–66), order spacing 5.87″ (6″) |
| MIKE blue, 1″ | R_slit 24,681 (25,000; LCO: 28,000), 0.1297″/px (115 µm/″), orders 74–107 span 27.6 mm (29 ± 0.5; ref.: one 62° prism, which Bernstein et al. call equivalent, gives +1.7%), order spacing 5.70″ (6″) |
| HARPS | R 100,230 at 5370 Å against the manual's own sampling × dispersion (105,290; ref.); 3.49 px/FWHM (3.4); 3873–6844 Å (3800 ref., 6900); orders 89–158 (89, 161 ref.: the model's order spacing is 0.2–4.7% wider); 0.0142 Å/px in order 114 (0.015); orders 160–161 35.8 px apart (34.2) |
| DESI B, R, Z | R at the band edges 1865/3100, 3185/4398, 3662/4869 ("approximately" 2000–3000, 3500–4500, 4000–5500; ref.); bands on the chip |
| Via | R 14,601 (≈ 15,000), 0.1015 Å/px = 5.53 km/s (5.5), 5018–5948 Å (505–595 nm) |
| Boombox blue, red | R 1212, 1071 at the chip centers (≈ 1000; reference only, the prescription is guessed) |
| DEIMOS 1200G, 0.75″ | 0.32404 Å/px (0.324), 6673.0–9293.7 Å (6673.0–9293.8), aberration-free R 6511 (8000/1.23 = 6504), slit image 3.79 px (3.79), 0.1192″/px (0.1185) |
| Binospec 600, 1″ | 0.611 Å/px (0.61), 6000–8497 Å (6000–8480), 3.35 px per 1″ (3.32), R 3532 (3590), 0.244″/px (0.24) |
| Hectospec 270, Hα | 1.231 Å/px (1.21), 5656 Å (5770), fiber image 5.06 px across the dispersion (5.1), 0.2795″/px (reduction 3.45), R from the fiber diameter × dispersion 1054 (6563/6.2 Å = 1058; ref.) |
| Hectochelle RV31 | R from the fiber-image diameter 30,967 (nominal 32,000), 156 Å per order (~150), fiber image 5.08 px (5.1), α 71.6° (72°) |
| G-CLEF red MR | reddest order 66 (65); R 27,958 vs 35,000 and the order spacing are reference lines |
| X-Shooter UVB, VIS, NIR | R × sampling (the dispersion) 33,255 / 53,341 / 20,522 (33,480 / 50,730 (ref.: the table's product conflicts by 4% with the order-23 length, which the model matches) / 20,160); order 18 / 23 span 37.8 / 55.5 nm (38.3 / 55.3); NIR 15 orders (16) |

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

**Round 4 (2026-10-17): MagE, IMACS, LLAMAS, ESI, MOSFIRE, PFS, 4MOST.** Sources and quotes in
`data/round4/*.md` and `*.json` (documents in `rawdata/presets/<instrument>/`, not in git). Mapping choices
and findings: (1) MOSFIRE uses one 110.5 l/mm grating in orders 6/5/4/3 for Y/J/H/K at a fixed 40°
camera–collimator angle; the blaze enters as the Littrow value (67,597 Å; the published "6.35 µm" is the blaze
in the 40° geometry). Dispersion matches to 0.05%, the 0.7″ slit image to 0.2%, K coverage to 2 Å; the
measured R is 1–5% above the aberration-free slit image (reference lines); the Y and J ranges are set by the
order-sorting filters. 28 objects per mask is the MOSDEF average. (2) MagE and ESI are echellettes with prism
cross-dispersers, quasi-Littrow (no published θ or γ: 0 here). MagE's three fused-silica passes put exactly 15
orders on the 1024-px chip (its central wavelength, unpublished, is chosen to place them as orders 6–20); its
per-order dispersion matches the paper's table to 0.1–3%. ESI needs OHARA BSL7Y (added to the glass list from
the data sheet, valid to 1.13 µm); its per-order dispersion matches to 0.6–1.3%, but orders 6 and 15 land
23.0 mm apart against the design report's 25.3 mm (9%, a reference line: the model puts every prism pass at
exact minimum deviation). (3) IMACS f/4 with the 1200 l/mm grating reproduces 0.19 Å/px, R ≈ 11,000, the
coverage and 0.111″/px (the camera focal length and fixed 45° angle come from LCO's grating-tilt calculator).
(4) LLAMAS's VPH line densities are NOT published: they are fitted so each arm's published band fills the chip,
and the independent test is the pipeline's arc-table dispersion (matched to 0–2%). (5) PFS: the
medium-resolution red arm is a grism, which the model does not do, and is left out; the b, r, n arms match
the dispersion, but the fiber image comes out 8–10% wider than the table's 3.0 px (R 9–14% low; reference
lines) — the collimator focal length is not published, and 693.5 mm is the slit-to-collimator distance.
(6) 4MOST LRS reproduces the 4MOST instrument-model (TOAD) table's Å/px to 0.5% and its band edges to 0.5%;
the HRS optics are 2014–15 concept values with a camera focal length fitted to the bands, so its numbers are
reference lines only and the presets say "concept optics". The fiber-fed instruments enter as the slit of
equal line width, (√3/2) × core, which is also the FWHM of a uniformly lit round core seen along one axis.

**Round 5 (2026-10-17): UVES, ESPRESSO, MUSE, KCWI/KCRM, APOGEE, FIRE, FEROS, and grisms for LDSS-3 and
FORS2.** Sources in `data/round5/*.md` and `*.json`. (1) UVES blue 390 / red 580 (the standard DIC1 setting) use
the 8.0 m entrance pupil at f/10 (Nasmyth; MUSE too), the value that reproduces the published scales; the Cassegrain
instruments (X-Shooter, FORS2) use the 8.115 m pupil at f/13.41 (VLT-SPE-ESO-10000-2723 Table 2; X-Shooter's
cameras recomputed to hold the published plate scales, R +1.05% in every arm); the
cross-disperser angles come from ESO's pipeline physical model. R, dispersion, scale and coverage match to
0.2–3%. (2) ESPRESSO: the pupil slicer's two 300 mm slices map to an equivalent 600 mm round beam; the camera
(755 mm) comes from the published pixel dispersion; γ = 4.85° is inferred from the order table, whose
wavelengths are then blaze centers (dispersion matched to 0.1–0.9%). The cross-dispersers (prism + VPH) are
not published: an equivalent VPH is used, so the order count is a reference line; the red arm's R and sampling
miss (6%, 14%) and are reference lines too. (3) MUSE's spectrograph prescription is not public: the preset
uses EFFECTIVE optics that reproduce the dispersion and the 2-px slice image, and the 2× anamorphic fore-optics
are not modeled (the spatial scale reads 0.1″/px against the real 0.2″/px). (4) KCWI blue (BM, Medium slicer)
is fully sourced; Morrissey et al.'s 4.6 px slice image leaves out the anamorphic factor 0.93 (reference line).
KCRM's grating angle is derived from the published coverage. (5) APOGEE-N (Wilson et al. 2019 prescription):
the three H2RGs enter as one 6466-px row with the gaps as dead pixels; λc is fitted to the chip edges (all six
within 3 Å); the measured R (22,500) is 25% below the slit-limited model, because the measured line profile is
wider than the fiber image. (6) FIRE's prisms are deliberately off minimum deviation (the explorer's are not), so
its cross-dispersion is 1.4–1.8× too small here; its measured R (6000) exceeds the paper's own prescription.
FEROS (image slicer: 1.0″ slices from the 2.0″ fiber, LF5 prism) matches R, the blue coverage and the order
spacing. (7) Grisms: LDSS-3's VPH grisms fit the VPH-grism model exactly (Carnegie maskgen geometry; centers
within 27 Å, dispersion within 0.5% of the measured arcs); FORS2's ruled grisms have entrance faces tilted 7.5°
(1995 design paper; the direction inferred from ESO's numbers), with which centers match to 10 Å and
dispersion to 0.2–0.9%. New glasses: OHARA S-LAL7, SCHOTT LF5 and N-BAK2. (8) Detector rendering: traces packed
closer than their own width (IFU spaxels) are dimmed so the sum keeps one trace's brightness, and traces denser
than the screen can show are thinned and widened (zooming in restores them).

## Verification

`node validate.js` (262 checks, all pass; 130 reference lines printed as [INFO]):

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
- **Grisms**: λ0 for ruled and VPH grisms against m G λ0 = (n − 1) sin A and 2 n sin(A − t), the
  straight-through axial ray, the ruled grism's dispersion (m G − sin A dn/dλ)/cos A, the tilted-entrance form
  with the lit length and beam width.
- **Edge cases from the 2026-10-17 audit** (ten of these checks fail on the engine from before the fixes): coverage bounded
  at 3200 Å and 2.6 µm with edges where the trace crosses the chip; the order-overlap warning; glass indices
  undefined outside their tabulated ranges; a grism root at the edge of the glass's range, and one with
  no root rejected; tilted prisms in PBM 2R, PBM 2Y and FK5HTi; MIKE's order 30, whose blaze lies outside
  the prism glass's range, kept.
- **Presets**: above.

`node uitest.js` drives the page in headless Chrome (228 checks): every slider moves the results as the
optics requires (R ∝ 1/D, ∝ W, ∝ 1/φ, independent of F_tel and the camera; sampling ∝
F_cam and ∝ 1/p; coverage ∝ 1/F_cam and ∝ N_x; at fixed F_cam the pixel scale is independent of W), the disperser
switches, echelle R4 ≈ 2 × R2 and R ∝ cos γ (to the line-tilt coupling), and the controls no other check moves,
each against a closed form (blaze δ = asin(m G λ_b/2); m λ_b ∝ 1/G_echelle at fixed R; chip height N_y p; VPH
cross-disperser order gaps ∝ λ²; prism apex and glass; the grism's glass through the grism equation; Ruled | VPH keeping
λ0); the warnings, the detector in grating mode and the number of objects (20 spectra spread evenly, hover names
the object), the echelle detector (hover reads the order and wavelength, zoom to the pixel grid, reset); the URL
hash (a round trip of all 63 keys set away from their defaults, malformed values ignored, a hand-edited link followed,
300 rapid changes ending in a matching link, a changed preset loading as Custom); the regressions of the
2026-10-17 audit (grism switching, slider ranges widening to preset values, Expand and Exit, Esc and outside
clicks, the 3D coast and snaps); all presets and their collimator types, the one-screen layout at 1440 × 900 and
1280 × 800 (every preset at the smaller size), the phone width, and redraw times (echelle ~20 ms, grating ~6 ms).
`node shot.js "<url#hash>" out.png [w] [h]` screenshots any state.

Dev server: `python3 web/serve.py 8795`. Live at https://cconroy20.github.io/instex/ (repo cconroy20/instex). Deploy:
`./deploy.sh`, as for lensex; the script publishes web/ as committed at HEAD, only after `node validate.js` passes, and
refuses while web/ has uncommitted or untracked changes.

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
