# Instrument Explorer

An interactive page on spectrograph design. Set the telescope, the slit, the beam diameter and
camera, the disperser and the detector; read off the resolving power, wavelength coverage,
dispersion, sampling and pixel scale; see the instrument drawn to scale (in the plane of the dispersion,
along the slit, or in 3D) and the spectra as they fall on the detector.

A fourth mode, **Interferometer** (2026-10-20), is a radio array: the uv plane its baselines sample as the Earth turns,
and the synthesized beam and dirty image of a model sky. See **Interferometer mode** below.

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
  grating and everything after it reflected about the collimated beam's axis), Camera (Lens | Mirror: see below),
  Labels and marks (Show | Hide: the text,
  the W arrow, the grating normal with α and β, and the scale bar; Hide leaves the optics and the rays). The Viaspec Zemax layout (technical document, bench figure) is fold 113° at 0.78 of a
  ~2.85 m collimated beam, collimator tilt 0, grating Flipped: the fold and the grating turn the light the same
  way, sending the camera back alongside the collimated beam. None changes a number. Lens and mirror are the same ideal collimator, so the switch
  changes the drawing only (a real mirror is achromatic, a real lens is not). The Camera option in Mod layout (Lens | Mirror)
  is drawing-only as well and, like the other Mod layout options, keeps a preset's name: Mirror draws a catadioptric camera with an internal focus (HIRES, Hectospec, Hectochelle), a
  weak two-lens corrector where the lens would stand, a spherical mirror 3.3 f_cam beyond the corrector, and the focus
  1.08 f_cam in front of the mirror (the Hectospec and Hectochelle prescriptions give 3.2–3.5 and 1.07–1.08), where the
  detector, its field flattener and a dewar 0.85 L_x wide and 0.3 f_cam long sit inside the arriving beam; each
  wavelength's bundle is drawn less the dewar's shadow and returns as a hollow cone, and rays that meet the dewar
  stop there. Spatial and 3D draw the mirror camera as a lens. Presets carry layout values where the sources give
  them (presets.js header: Hectospec and Hectochelle tilt 0 with the grating at the collimator's center of curvature;
  HIRES tilt 1.75° and a 2.94 m echelle path measured from Vogt et al. Fig. 1; LRIS a 2 m path). Double pass
  (echelle mode, key e.dpass, set by the MIKE presets; no control yet): one lens is drawn as both collimator and
  camera, the echelle at the collimated beam length from that lens (MIKE 400 and 600 mm, the cameras' external stop),
  the cross-disperser near the echelle and crossed by both beams, and the returning beam drawn a few degrees off the
  incoming one so that the detector clears the slit (in the instrument the two sit side by side across the orders,
  out of the page; the caption says so). Every echelle has a 3D view (11-16, his ask): see "Echelle 3D" below. For a
  double-pass instrument (key e.view): the 3D view puts x along the lens axis, y along the echelle's dispersion and z across the
  orders (Top shows the echelle's plane, Side the cross-dispersion plane of Bernstein et al. 2003 Fig. 1); the slit
  (the image the injection optics form in the focal plane) sits 0.6 L_y + 0.025 f above the axis (31 mm for MIKE red;
  the paper gives about 30 mm) and the detector as far below; the prisms (one per two of the tracer's passes, apex
  edges along y, deep enough for both beams: MIKE red's base 248 mm against the paper's "more than 8 inches") stand at
  minimum deviation for λc, the first as near the lens as it can stand; the echelle stands at the stop distance or,
  when its near end (W tan δ / 2 toward the light) would meet the prisms, just clear of them. Every order's trace on
  the detector and the foci of the drawn bundles (three orders, three wavelengths each) come from the tracer; each
  returning bundle is traced back from its focus through the drawn prisms by Snell's law. Labels are placed last
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
  unfolded onto one axis at λc (a mirror collimator or camera drawn as a lens; the fold, flip and tilt options do not
  apply). Slit points (control at the drawing's top left): 3 fixed (the two ends of the recorded slit length,
  detector height × f_col / f_cam, and its center) or 1 free (a single point, dragged along the slit or by its
  image along the detector); colored brick (top) / gray (center) / teal (bottom), each leaving the collimator as a parallel bundle at slope −h / f_col whose
  center crosses the axis at the grating (the pupil), then imaged inverted at −h f_cam / f_col; the grating is
  seen from the side, foreshortened to W tan α with the grooves along the slit, and the detector ends carry the
  sky offsets of the slit points that land there. Echelle mode has no Spatial view (the cross-disperser bends
  the light in that plane).
- **Detector** (right panel, both modes): the chip to scale with the spectrum of every object, drawn as
  the trace of a star on the slit: a Gaussian across the dispersion with FWHM = φ / pixel scale, computed at the
  centers of the screen's device pixels (app.js drawDetector, since 11-16). The profile is widened before it is
  sampled: to at least 0.6 device px, and to 0.45 of the trace spacing where the traces are too close to resolve,
  fading out between spacings of 4.5 and 7 px. The earlier drawing (a band one σ wide, blurred by the canvas filter)
  aliased: traces 1–4 px apart beat against the pixel grid into rings and stripes when zoomed out (his question,
  11-16), and a blur after rasterizing cannot remove a beat. Each trace keeps its peak brightness, dimmed where
  neighbors overlap so that a dense band reads at one trace's brightness; traces closer than a device pixel are
  thinned to every k-th. Colored by wavelength (blue → pale → amber,
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
- **Presets** (header menu, 62, grouped by telescope): Keck/LRIS red, HIRES, ESI, KCWI blue, KCRM red, DEIMOS,
  MOSFIRE Y/J/H/K and ZShooter B/G/R/YJ/H/K (design); Magellan/MIKE red and blue, MagE, FIRE, IMACS f/4, LLAMAS
  blue/green/red (gratings fitted), LDSS-3 VPH-All/Blue/Red, M2FS HiRes (one order at Mg b) and IFUM LSB; MMT/Binospec, Hectospec and Hectochelle; GMT/G-CLEF red (design); VLT/FORS2 300V, 300I
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

**Echelle 3D** (11-16, his "what about the 3D view for echelles?"; app.js build3dEchelle and build3dFolded beside the
double-pass build3dDoublePass). Each echelle preset names its arrangement (key e.lay3d; e.wpT the transfer
collimator), read from the research records:
- "single" (HIRES, and any custom echelle): the cross-disperser after the echelle. Every direction comes from the
  tracer, turned by −γ so the collimated beam runs along x: the echelle's normal and grooves, each order's direction,
  each cross-disperser surface (physics.js now exposes S.xdStages), the camera and detector axes. The cross-disperser
  stands where the returning beam clears the arriving one (out to 0.9 of the collimated path: HIRES's beams, 10° apart
  in the echelle's plane, clear only near the collimator), and everything stays in front of the collimator.
- "pp" (MagE, ESI, FIRE): prisms between the collimator and the echelle, and a separate camera past the prisms. The keys
  e.xPre (passes before the echelle) and e.xDbl (prisms passed twice) sort the tracer's passes into prisms met only on
  the way in, prisms passed both ways, and prisms met only on the way back (2026-11-17 audit): MagE's 46° prism twice
  and its 40° prism once on the way back (Marshall et al. 2008), ESI's first prism twice and its second once on the
  way back (Sheinis et al. 2002), FIRE's first prism once on the way in, its second and third twice, its fourth once
  on the way back (Simcoe et al. 2013 Table 2). A prism met only on the way back bends the returning light the way
  the double-pass ones do, so the returning beam leaves the echelle above the arriving one and the camera stands
  on that side, at the smallest angle that keeps the prisms and the camera clear of the arriving beam. Each prism is
  turned from minimum deviation by its pass's dI, as in physics.js (ESI's −4°).
- "4c" (X-Shooter): the same prisms, then the collimator again forms the cross-dispersed spectrum below the slit; a
  fold and field mirror (a spherical one in the NIR, Vernet et al. 2011 Sec. 2.5.3) sends the spectrum to a camera,
  which re-images the spectrum on the detector.
- "wp" (HARPS, UVES, FEROS, ESPRESSO, G-CLEF, ZShooter): the collimator again forms the spectrum with the orders
  overlapping, a fold sends the light to the transfer collimator, which re-forms the pupil, where the cross-disperser stands,
  then the camera. The fold (e.fold3d) is a flat in UVES and FEROS, a field mirror (blue) or field lens (red) in
  ESPRESSO, a Mangin mirror in G-CLEF and ZShooter, and is not described for HARPS. The transfer collimators: UVES 2000
  mm, FEROS 1500, ESPRESSO 1500, G-CLEF 1600, ZShooter 1250; HARPS uses its own collimator a third time (1560 mm,
  e.wp3; drawn unfolded, as a mirror of its own). The camera drawn is f_cam × f_transfer / f_col (f_cam is the
  model's effective camera): HARPS 728, UVES 360 and 500, FEROS 410 mm as built; ESPRESSO 400 (the design value for
  the blue camera; the red one's is not published), G-CLEF 450 and ZShooter 225 mm (designs). ESPRESSO is drawn with
  the unsliced equivalent beam (600 mm at the echelle; the pupil slicer makes two 300 × 200 mm beams there), and ESPRESSO's
  cross-disperser is a VPH grating on a prism (e.xdLabel); e.note3d adds such remarks to the caption.
In the three folded arrangements each returning bundle is traced back from the tracer's focus through the drawn optics
(Snell's law in the prisms), and the central ray is aimed so that it reaches the echelle's center; the echelle (the
pupil) carries every bundle's footprint, so the drawing agrees with the Detector panel. Mirrors are drawn as lenses,
unfolded but for the fold. Where the instrument's out-of-plane angle is too small to draw, or not published, the
caption gives the angle drawn and the instrument's; spacings the sources do not give are schematic.

**All arms** (11-16, his "showing the multi-arm instruments in one shot, as opposed to having mode switches";
web/arms.js, window.ARMSAPP). For an instrument listed in arms.js GROUPS, the Setting menu ends with "All arms", which
shows the instrument's arms together with the dichroics that split the light. GROUPS holds each instrument's dichroic
tree (crossover, transition width, angle of incidence, the arm on each side, and the source) and the place of the split:
- "collimated" (DESI, Boombox, PFS, 4MOST LRS and HRS, LLAMAS, KCWI): one slit and collimator, with the dichroics in
  the collimated beam. A mirror collimator returns the beam 36° off the slit's axis, as in the one-arm view.
- "focus" (X-Shooter, MIKE): the dichroics stand in the light spreading from the telescope's focus, drawn at the
  telescope's own focal ratio (GROUPS Ftel: X-Shooter f/13.41, Vernet et al. 2011 Sec. 2.2.7; MIKE f/11, Bernstein et
  al. 2003 Sec. 2.3). X-Shooter's arms each have a relay that images the focus on the arm's own slit; MIKE has one
  slit at the focus, ahead of the dichroic (B03 Sec. 2.1, "the first optical element in MIKE beyond the slit"), and
  each arm's injection optics feed the arm's lens.
- "preslit" (UVES): the f/15 beam is collimated behind the derotator and the dichroic stands in that beam; a doublet
  in each arm focuses the light on the arm's slit at f/10 (Dekker et al. 2000 p. 536). The width of this beam is not
  published (GROUPS Wpre, schematic), and the caption says so.
A mirror collimator in an arm with its own slit folds the arm. The Optical layout draws the arms to one scale. The
angles at the dichroics (180° − 2 AOI) and at the gratings are true; a dichroic whose angle is not published (4MOST HRS,
LLAMAS, KCWI, UVES) is drawn at 45°, and the caption says so. PFS's angles (29° and 38°) are measured from a
concept-stage figure (Vives et al. 2014 Fig. 2) and Boombox's (22.5°) from the Boombox bench layout; their captions say so.
The 2026-11-17 audit (data/audit/2026-11-17_D*.md) also set DESI's first crossover to 7595 Å with a 250 Å transition
(FDR Table 5.3), Boombox's to 5750 Å (SPIE 14149 abstract), MIKE's angle to 30° (B03 Sec. 2.1), and X-Shooter's and
UVES's transition widths to the ESO manuals' (78, 255 and 350 Å). The sources do not give the direction in which each dichroic and grating turns the light, or the
distances between the elements. A small search picks these: each combination of the turning senses, then each branch
length in turn, scored by the depth of the overlaps between parts (convex pieces, separating-axis test, clearance
0.45 W) and by the size at which the drawing fills the panel. The choice holds while the design stays in the same
coarse bin, so the drawing does not jump while a slider moves. Beams past a dichroic are tinted by the band they
carry; labels go where the drawn ink is least, read back from the canvas as in the one-arm view.
The Detector panel draws the chips to one scale, with each object's spectrum, through the one-arm view's
pixel-by-pixel renderer (app.js splatTraces and makeTraces, factored out of drawDetector), in the arrangement of rows
that makes the chips largest. Below the chips a strip shows each arm's coverage with the dichroics' crossovers and
transition widths; each bar is dimmed where the dichroics send that light to another arm (X-Shooter's arm ranges are
the order extents, which run 250–410 Å past the crossovers). The stats strip gives each arm's range, resolving power and dispersion.
The controls set one arm at a time, named in the caption and marked in the strip, the layout and the chip. A click on
another arm (in the strip, the layout or the Detector panel) moves the controls to that arm and keeps the first arm's
edits. Shared controls set all arms at once: the telescope (D, F) always, for a split in the collimated beam also the
slit, the fibers and the collimator (slitW, nObj, W, col, telF, fibAp), and for MIKE the one slit (slitW, nObj); the
arms after the focus keep their own focal ratios. The link carries `arms=true` and `arm=`
(the arm the controls set), with that arm's edits; the other arms return as their presets with the shared controls
applied. Picking a single arm in the Setting menu returns to the one-arm view. uitest checks each group (the arms
designed, no overlaps, the labels inside the panel and clear of one another, the one-arm controls hidden), then the
arm switch, the shared controls and the link.

## Telescopes mode

The third header button (2026-10-19; Charlie: "start with just three: Keck, Magellan, and HST"). One telescope at one
of its foci: the Optical layout draws it to scale (the Imager's telescope drawing; Cassegrain, Gregorian, Nasmyth with
a flat tertiary, bent-Cassegrain and folded ports drawn as short Nasmyth folds), and **Pupil and image** shows the
entrance pupil beside the image of a star it makes. The pupil (web/tpupil.js) is a mask on a 1024 × 1024 grid spanning
8 D (so the image has 8 pixels per λ/D): hexagonal segments in rings around an empty center, or one mirror; less a
central obstruction, spider vanes (each pixel's coverage by a vane found exactly from the pixel's overlap with the
vane's strip: sampling quantized a 2.6 cm vane by 9%) and pads; the image is |FFT|², drawn on a log (five decades) or
linear stretch. The strip: collecting area (measured from the mask) and the equal-area circle, focal ratio and focal
length, plate scale, the diffraction FWHM (measured from the image: within 0.3% of the annular Airy FWHM); then (his
asks, 10-19) the field was dropped and then the whole strip: the Telescope box now lists the focal ratio, focal
length, plate scale and collecting area, and the Image box the diffraction-limited FWHM (the focus's field still
sets the drawing's bundles).
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
cells across the pupil), the diffraction-limited image (titled without a subtitle since 11-16, his call; the panel's
tooltip says perfect optics, no atmosphere) and the seeing-limited image (subtitle: the seeing FWHM)
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
columns out (8× faster: 30 ms for 1024²). Keck's focal ratios (his question, 10-19: the strip said f/13.7, the focus f/15): the strip divides the
focal length by the full 10.949 m outline (the beam drawn), while Keck names its foci by the nominal 10 m (KOR90 Sec.
4.1); his choice "#1": keep both, the strip's small text adds "f/15 on the nominal 10 m" (tpresets nominalD), with
the reason in the tooltip. Then (his asks, 10-19): "build the 2x2", "remove the pupil box at bottom right", "keep the angular
scale for the two images the same and fixed, with a slider bar to adjust manually": the Pupil box is gone and the
pupil-and-image panel runs the full height beside the layout and its two control boxes (a .tgrid: left column =
layout + controls, fitPanels sizes the layout). The panel is 2 x 2: the entrance pupil and the radial profiles (both
images' ring averages for the same star, relative to the diffraction-limited peak, log-log, a dashed line at the
images' edge) above, the diffraction-limited and seeing-limited images below over one field, set by the Field slider
in the panel header (0.05–5″, default 2″, link key t.field; kept across telescopes, bands and seeing). Both images
come from one grid (TP.seeingGrid: 1.5 times the field or 6 seeing FWHM, rounded up to a few sizes, 2048 cells when
the pupil needs more than 512), the diffraction-limited one from the fine grid (8 pixels per λ / D) while the field
fits inside 120 λ / D. Ten telescopes since 10-19 (his picks from a list of 32: the starter set VLT, Subaru, GMT, JWST, DKIST and
HET, and the Yerkes 40-inch), each sourced by an agent into data/telescopes/<id>.md/json with the files under
rawdata/telescopes/<id>/: VLT (8.0 m pupil at Nasmyth, 8.115 m at Cassegrain: the secondary is the stop; Nasmyth A
east drawn up, B west down; tertiary 2.5 m above the primary), Subaru (prime focus with HSC's corrector drawn as one
lens of its power, Cassegrain, optical and infrared Nasmyth; the infrared secondary is the stop, 7.95 m; the
obstruction measured only at infrared Nasmyth), GMT (seven mirrors, the outer six ellipses seen from the sky; the
truss on the central mirror only; direct Gregorian and the folded port, its flat below the primary), JWST (18
hexagons and the struts after STScI's STPSF model; the f/20 path drawn as a generic three-mirror layout, and the f/9
Cassegrain image), DKIST (off-axis: the light on one side, nothing in the beam; Gregorian f/13 and the prime focus's
heat stop), HET (a Tracker slider moves the 10 m pupil across the fixed 91-segment array: 55.9 m² centered, 32.8 m²
at 6°, as the pyHETobs geometry gives; the four-mirror corrector drawn as one lens), Yerkes 40-inch (a refractor;
its color error from Fox 1908 Table IV as a readout: 27″ of blur in B). New engine and drawing options: per-focus
pupil D, the tertiary's place a3 (negative: behind the primary), prime-focus correctors that change the focal
length, off-axis apertures, mirror spans, hexagon lattice rotation, round and elliptical segments, offset stops,
widening and bounded struts, blocking polygons. The pupil and the images were drawn upside down before (HST's pads);
+y is now up. The collecting area is geometric; each focus lists its reflections,
but no reflectivity is applied.

The ELT (ESO; under construction; added 2026-11-16 on his ask, data/telescopes/elt.md): 798 hexagonal segments
around an empty center (rings 0–4 missing), on a lattice of pitch 1.2274 m scaled to ESO's 39.146 m circumscribed
diameter, cut to a near-round outline by a new pupil option, rcut (segments whose centers lie within 18.963 m);
validate_img counts the segments (798; also Keck 36, JWST 18). Six spider arms 0.53 m wide (third-party pupil
models; ESO gives no width), so the model's 991 m² sits 1.4% above ESO's 978 m² (reference line). One Nasmyth focus
(platforms A and B are the same): 684.0 m, shown as f/17.5 on the 39.1 m drawn and f/17.75 on ESO's nominal 38.542 m
(nominalD with nominalDec 2). Drawn as a three-mirror (Korsch) layout: the focal length and plate scale are exact,
the tertiary (at the primary's vertex in the ELT) and the two fold flats M4 and M5 (drawn as one) are schematic.

Eleven more telescopes (2026-11-16, his list: "the Blanco, SDSS 2.5m, 4MOST, etc.", then MMT, Mayall and Rubin, then
Gemini, LBT, TMT, Hale and Oschin), each sourced by an agent into data/telescopes/<id>.md/json (rawdata/telescopes/<id>/)
and entered from the research file's proposed entry: VISTA (the undersized secondary is the stop: a 3.70 m pupil on
the 4.10 m mirror; Cassegrain 4MOST | VIRCAM), MMT (f/5 wide field with three correctors, f/9, f/15 adaptive with its
own 6.37 m pupil), Blanco (prime focus DECam | Mosaic II; Cassegrain f/8 and the retired f/14.5, f/30; DECam's fins and
filter-changer housing in the pupil), SDSS 2.5 m (one f/5 Cassegrain in three eras), Mayall (prime focus DESI | Mosaic;
the retired Cassegrain foci; 8.658 m² reproduced exactly), Rubin (the Paul-Baker drawing; M1 a ring around M3 in one
glass, so no baffle), Gemini (North and South as one; Cassegrain up-looking and side ports), Hale (prime focus three
ways, Cassegrain f/16, coudé f/30 drawn unfolded), Oschin 48-inch Schmidt (ZTF | POSS-II | POSS-I; the camera in the
beam), TMT (492 hexagons, validated), LBT (binocular: the layout draws one side, the 3D view both; prime focus uses the
8.4 m mirror, LBTI both, whose pupil gives a fringed image). Each new telescope's research file lists its gaps; the
inferences that reach the page are said in the notes (VISTA's and the Oschin's vane angles from photographs and
diffraction spikes, MMIRS on the bare f/5, Blanco's fin widths from the DES PSF code). 22 telescopes in all.

Focus buttons (2026-11-16, his ask, for every telescope): one button per kind of focus (each focus's kind in
web/tpresets.js: Nasmyth, Cassegrain, Folded port, Prime focus, ...) and, when the chosen kind has several foci, a row
of variants below (each focus's variant: Nasmyth West | East | East, MagAO f/16 on Magellan). Each button's tooltip
is its focus's name and note (fieldNote: the field, and what the drawing shows only schematically).

3D view (2026-11-16, his ask; Telescopes mode only, no tube or truss): the Optical layout's 2D | 3D switch (link key
t.view). web/tel3d.js lays the telescope out as the 2D drawing does (imgapp.js layoutGeom, split out of the 2D
drawing so both use one geometry; the 2D output is byte-identical to before) with a third axis added, the telescope
standing with the sky overhead. The primary is tiled from the pupil (tpupil.js tiles: hexagonal segments, GMT's
round mirrors, or one mirror), each outline lifted onto the paraboloid, with the mirror's central hole: the sourced
one (tpresets hole: Magellan 1.3 m, HST 0.6 m, VLT 1.0 m, GMT's central mirror 1.78 m) or else the largest any of
the telescope's foci needs (the 2D drawing cuts it only at a focus whose light goes through it). GMT's secondary is
tiled like its primary; the baffle (the central obstruction, where wider than the secondary) and the spider vanes and
blocks sit just above the secondary or across the prime-focus unit. The on-axis star's light is a warm translucent
sheet (and its inner edge, the obstruction's shadow), the top and bottom of the field their edges only (brick and
teal), the incoming starlight a few rays. A ray at pupil point (px, py) is traced across the axis with the field slope
and out of the page with none (ideal round optics: the two traces add), then folded as in 2D. Mirrors are silver
(JWST's gold: tpresets coating) with a specular highlight. Orbit controls as in the spectrograph's 3D view (drag to
turn, shift- or right-drag to pan, scroll to zoom, double-click to reset; snaps Top (from the sky, oriented as the
Pupil panel), Side, Oblique). uitest audits each telescope and focus: one point per star at the drawn focus, the 2D
rays retraced in the drawing's plane, the hole and the secondary large enough for the light.

## Interferometer mode

The fourth header button (2026-10-20; Charlie: "another mode - radio interferometry? UV planes and all that"; his calls:
radio only, VLA and ALMA to start, CLEAN later). An array of antennas at one site: the **Array** panel draws the
antennas on the ground (north up, east right; click an antenna to switch it off, drag one to move it, Restore puts the
array back), and **uv plane and images** is a 2 × 2 panel: the uv coverage (each sample dark blue, its mirror point
(−u, −v) pale; or the visibility amplitude of the model sky against uv distance), the synthesized (dirty) beam, the
model sky, and the dirty image, the three images over one Field (slider in the panel header), linear, each scaled to
its own peak, negative values blue, east to the left. ▶ Play runs the hour angle through the observation in six
seconds (the moment played in orange); any change stops it. Boxes: Array (configuration, elevation limit; antennas,
baselines, longest and shortest baseline), Observation (declination, duration centered on transit, band, frequency,
bandwidth; hours above the limit, elevation at transit, primary beam), Image (natural, robust or uniform weighting,
the robust parameter, the sky model and its size; the fitted beam, the peak sidelobe, the largest scale). The Array
box's Layout menu (his ask, 10-20: "distribute antenna randomly or uniformly over an area, or in various shapes (L, Y,
etc.) with the number of antenna an adjustable parameter"): As built (the configuration's pads) or a made-up layout of
2-10,000 (200 at first; 10,000 his ask, 10-20) of the array's dishes at its site, with an Antennas and a Size slider (Size = the longest baseline): Random
(uniform over a disc, no two dishes within 1.2 diameters; seeded, ↻ draws anew), Grid (square, the diagonal = Size),
Line east-west, L, T, Y and Cross (one antenna at the junction, the rest evenly along the arms), Ring; a layout too
crowded for its dishes is spread to 1.2 diameters. Concentration slider (his ask, 10-20: "would be neat if array
'concentration' was a slider"; all layouts but Ring): the n-th of m antennas out along an arm (the line, the grid's axes
from the middle) at (n / m)^p of the arm, p = 1 (even) to 2 (3 at first; his "it seems too intense", 10-20: at 3 the inner antennas
clump at the minimum spacing and 63% of an arm sits in its inner quarter, against the VLA's 45%); Random's radii go as u^(p/2) (1 = uniform over the area);
crowded inner antennas are pushed outward to 1.2 dishes, so the size holds. The VLA's W and E arms follow r ∝ n^1.716
to 0.1% over pads 2-72 (fitted to data/interf/vla.json; pad 1 and the N arm sit off the law); a 27-antenna Y snapshot
at the C size has a 41% peak sidelobe at p = 1 and 28% at p = 1.716 (the real C configuration: 27%). A regular grid's baselines are few and repeated (36 antennas: 630
baselines, 60 different), so its snapshot beam has grating lobes near the peak (88%); an even Y's snapshot sidelobe is
41% against the real VLA's 27%. No strip,
and the header note on optical presets is hidden in this mode.

Engine (web/interf.js, window.RI): ground baselines (east, north, up) turned to the equatorial X, Y, Z at the site's
latitude, (u, v) = the baseline's projection toward the source at hour angle H in wavelengths, samples dropped while the
source is below the elevation limit; 30 s steps, coarsened (with the channels across a wide band, spaced like the time
samples on the longest track) to keep at most 2 million samples. Weights: natural, uniform (1 / the count in the
sample's uv cell, mirror points included) or Briggs robust (f² = (5 × 10^−R)² / (Σ W² / Σ w)); the cell is 1/250 of the
uv extent, or 1.5 × the spacing of the samples on the longest track if coarser (so that a sparse track fills its cells).
Gridding nearest-cell, each sample and its mirror; one complex FFT gives beam + i image (W and W V are Hermitian). The
image grid spans twice the field (the sky and sidelobes do not wrap into the field), up to 1024 across (512 while a
slider moves, refined 0.28 s after it stops). The sky models (point, two points east-west, Gaussian, uniform disc, thin
ring 0.9 to 1 of the radius), times a Gaussian primary beam of the observatory's half-power width, are imaged by FFT;
the amplitude plot uses the closed forms (J1 by its one-period integral, tabulated to x = 30, asymptotic beyond). The
beam: an elliptical Gaussian fitted (least squares on ln b) to the main lobe above half the peak, on a grid of its own
(pixels 1/20 of the shortest fringe); the peak sidelobe: the largest |b| outside the main lobe (b > 0 around the
center, at most 1.5 FWHM out). The largest scale: 0.983 λ / L5, L5 the 5th-percentile ground baseline (ALMA's
definition, used for both arrays).

Arrays (web/rpresets.js, built by `node make_rpresets.js` from data/interf/*.json; sources in data/interf/*.md):
VLA (A, B, C, D from CASA's vla.*.cfg, cross-checked against NRAO's pad table to 2 mm rms; latitude of the pad table's
array center; 25 m; the 8° hard elevation limit; bands P to Q (the 4-band system is left out: under development, and the
primary-beam relation is stated from P up); the primary beam 42′ / ν(GHz), 50′ / ν(GHz) at P band). ALMA (Cycle 13,
current 1 Oct 2026 to 30 Sep 2027: the ten 12-m configurations C-1 to C-10 from CASA's alma.cycle13.N.cfg, byte-identical
to Cycles 11 and 12 and to the Science Portal's zip; these are the notional 43-antenna sets (the 50-antenna pad lists are
NOT FOUND); positions about the Technical Handbook's array location; 12 m; the 2° hardware limit (2001 Project Book:
no current value found; the Proposer's Guide asks only that a source transit above 20°); the primary beam 1.13 λ / D;
Bands 1-10 with 7.5 GHz per polarization, which the page lays out as one contiguous band about the frequency (ALMA's
basebands sit in two sidebands, so the real coverage is two separated pieces)). ALMA against its Technical Handbook:
the longest baselines match Table 7.3 exactly, the 5th and 80th percentile baselines to 2% and 1%, 0.983 λ / L5 the
maximum recoverable scales to 3%, and the robust-0.5 beam (1 h at −23°) the Handbook's 0.574 λ / L80 to 8%; the Cycle 13
resolution table's beams are 12-24% wider for C-2 to C-10 because they describe the 50-antenna configurations. Peak
sidelobes are the Handbook's order (5-20% vs 5-13%), not equal (its measuring region is not stated).
Play ▶ Hours | ▶ Antennas, a second line under the panel's title (his asks, 10-20: an antenna play "below the button for
temporal play", then "not well laid-out" for the floating button, and "a log or geometric rate, not linear in time"):
Antennas adds the antennas switched on one at a time in a fixed random order (seeded shuffle), k = 2 (N/2)^(t/6 s) (the
count grows by the same factor each second), with the observation as set; the antennas not yet added are drawn
hollow (pale blue), the uv title counts them, and the baselines grow as k (k - 1) / 2. Either animation stops the
other; any control stops both; off for a single dish. Time Play's title now gives the true hour angle (15.04° an hour).
Panel titles (his asks, 10-20): no lines under the titles, titles 15 px, the lower left "Input image"; the beam has a
Linear | Log switch under it (r.bstr; Log = |beam| over three decades, 1 to 0.001 of the peak, the sign kept in the color:
warm positive, blue negative).
Large arrays: beyond 100,000 baselines (about 450 antennas) the page draws a random, seeded 100,000 pairs (interf.js
baselines); the readout gives the true count (10,000 antennas: 49,995,000) and "drawn", the longest and shortest
baselines are exact (interf.js extremes, over all pairs, about 0.1 s at 10,000), the random layout's spacing check and
the anti-crowding pass go through a hash of cells 1.2 dishes wide. The time step then coarsens to keep 2 million samples.
Image sky (his ask, 10-20: "something much more complex, like an image of the M101 galaxy", then "as high res as
possible. so use an optical M101 image"): M101 (Hubble), the ESA/Hubble mosaic heic0602a from the full-resolution Large
JPEG (15852 × 12392 px, 0.050″) in gray, resized to 8000 px (0.099″) and turned 3.5° north-up, 8368 × 6732 px, 828.4″
wide, web/img/m101_hubble.jpg (13.3 MB, read only when chosen; read through a canvas in strips, so no canvas is larger
than 4 million pixels; kept as a pyramid, 8-bit then 16-bit 2 × 2 averages, the level for a grid the one with pixels just
below half the grid's). CC BY 4.0; the credit "Image: European Space Agency & NASA (CC BY 4.0)" is drawn on the image,
the full credit with acknowledgements is in the About dialog. Sources: data/interf/images.md. Choosing the image sets
the Size to its width and the Field to 20′. Bug found on the way (fixed, 10-20): the images' screen scale was half the
true one (the square shows the field, not the grid's 2 × field): scale bars read twice their length, the sky's points sat
at half their separation, and the beam ellipse was half size; the dirty image itself was right; uitest now checks it.
DSA-2000 (his ask, 10-20: "just do DSA-2000"; data/interf/dsa2000.md; the project is now the DSA, formerly DSA-2000):
the 1650-dish design of the Final Design Review (completed 2026) (dsa1650_P305_v2.5.6.8, from the project's sensitivity calculator, v2.0 October 2026, antennas_enu.json
about the centroid; the name keeps 2000 from the superseded 2000 x 5 m design); 6.155 m dishes, Spring Valley, Nevada
(39.554 N); one band 0.7-2.0 GHz covered at once; primary beam 3.36 deg / nu(GHz); the calculator's 20 deg limit
(mechanical limits NOT FOUND); defaults 1.35 GHz, a 21-minute pointing at dec +40. Baselines 10.2 m to 20.3 km
(1,360,425), so a random draw of 100,000; the natural zenith snapshot beam 3.05 x 2.33" PA 90.5 against the calculator's
3.03 x 2.31" PA 90.6; uniform 2.16 x 1.65" against the project PSF's 2.03 x 1.57" (uv cell not stated). Found on the
way: with the baselines a random draw, uniform weighting needs cells sqrt(total / drawn) wider (else the draw's empty
cells push uniform toward natural: 27% too wide); with that, the draw's uniform beam matches all pairs to 0.1%.
Arecibo (his ask, 10-20: "a large single dish (Arecebo)"; data/interf/arecibo.md): a single dish, interf.js aperture /
apertureGrid: the Gregorian feed's illuminated 236.5 x 213.4 m (east-west x north-south on the meridian, INFERRED)
of the 305 m reflector, taken as uniformly lit (the real illumination tapers to -7 dB at the edge; the platform and
dome block part of it), its weights the aperture's autocorrelation put straight onto the grid's cells (a lattice of
samples gridded aliased and made the beam negative); beam 1.037 lambda / D, first ring 1.73% (Airy 1.029, 1.75%), no
negative values; within 19.7 deg of the zenith (declinations -1.36 to +38.04 deg, the guide's -1.33 to +38.03); the
Gregorian receivers 327 MHz to X band (the carriage-house line feed, which lit the whole dish, left out). Beams against
the 2017 users' guide's Table 3 within 12% for each receiver (L-wide 3.18' x 3.53' vs 3.1' x 3.5'); the measured first
sidelobe is about 4.6% (blockage), the model's 1.75%. No layout, configuration, elevation limit, duration, bandwidth,
weighting or Play; the right-hand squares are "Beam" and "Map"; the largest scale "all". Collapse note in the caption.
Bug found (fixed, 10-20; his "dragging the decl slider to unphysical values creates an error"): with an extended sky
(Gaussian, disc, ring, M101) and the source below the limit, the computation returned before making the input image,
and the input-image panel threw; the image grid and the input image are now made first; uitest sweeps it.
Physics audit (10-20, his "triple check the physics here - no mistakes!!"): three independent auditors (geometry,
sampling and array data; imaging, weighting and beams; every number and sentence shown), each finding verified here.
Fixed: (1) the hour angle ran at 15 deg/h of time, now the sidereal 15.041 (IERS 7.2921150e-5 rad/s); (2) the uniform
and robust uv cell blew up for large drawn arrays over long tracks (DSA-2000, 12 h, uniform: +59% sidelobe against the
truth's -16%): the cell is now 1/250 of the longest baseline, sqrt(total/drawn) wider for a drawn set, and for a sparse
set as wide as the samples' spacing but no wider than the cell holding four samples on average; (3) the time step, the
channels (up to 512, centers of equal slices of the band) and the number of drawn pairs (20,000 to 100,000) are chosen
together within the 2-million-sample budget, snapshots included (a DSA snapshot with a band used to take 6.4 million);
(4) the band is kept within the receiver's; (5) the random draw is of distinct pairs; (6) the point skies' visibilities
are exact (a point split between pixels lost 2-4% at long spacings); (7) the amplitude plot is the sky's visibility
without the primary beam for every sky; (8) the largest scale is each observatory's own: the VLA OSS table for the VLA as
built (scaled as 1 / frequency, halved for a snapshot; it was ALMA's rule, 1.7-4.7x too small), ALMA's 0.983 lambda/L5
for ALMA and every other array or layout, and "-" with no samples; (9) false or loose text: uniform weighting does not
always lower the sidelobes (it raises them for most ALMA configurations); "no baseline shorter than a dish" holds on the
ground only (shadowing, left out, is now in the About list); the VLA C configuration's empty N1 pad, ALMA's 43 vs 50
antennas, DSA's name and 6.155 m dishes, Arecibo's measured sidelobes (3.9-4.6%) and declination range (the guide's),
each array's elevation-limit source, the field's reset, M101's frame; (10) a note on the images when samples fall beyond
the image grid's pixels; (11) beams in one unit, primary beams to two figures. Verified correct by the auditors: the
uv transform against an independent projection (20,000 random cases, 2e-10 m), the VLA and ALMA positions re-converted
from the raw files (0.5 mm), DSA-2000's beams and position angles against the project's own fits, the dirty-image
packing, normalization and orientation (an asymmetric sky; now a validation check), gridding, the Briggs form, the
sky models and J1, the single dish's Airy pattern. Left as notes: the fitted FWHM runs 0.8-1.9% above the true
half-power width (a Gaussian fit to a non-Gaussian lobe); the DSA calculator's +-2 h track model is not enforced.
Found while building: the uniform-weighted beam depends on the uv cell (an image-size choice the OSS does not state):
with the page's cell the VLA beams are 0.80-0.86 of the OSS table, approaching 0.96 with cells for an image ~3000 beams
across and 5 s sampling; natural / uniform (1.47) and snapshot / full (1.28) agree with the OSS's ~1.5 and ~1.3. The
cfg files' shortest baselines are longer than the OSS's Bmin (C: 78 m vs 35.5 m: the OSS puts one north-arm antenna on
pad N1 in C, which the cfg file does not).
Earth-scale and transit arrays (his ask, 11-16: "CHIME, CHORD, CHIME+outriggers, and VLBI, and EHT"; his calls: VLBI =
the VLBA, the EHT = the 2017 array with the M87* crescent, point-source skies for CHIME and CHORD; data/interf/vlba.md,
eht2017.md, chime.md, chord.md). Five new arrays, all built by make_rpresets.js from the records:
- VLBA: the ten stations (WGS84, the Status Summary), each with SCHED's horizon mask; NRAO's practical 10° limit; the
  ten bands (the 3 mm band at the eight stations with the receiver); primary beam 40.3′ / ν(GHz), measured at 1.38 GHz
  (Middelberg et al. 2013). Default 2 cm, dec +30°, 8 h, the core-and-jet sky.
- EHT 2017: eight stations from Paper II's X, Y, Z (phased ALMA and SMA as single stations), Paper III's SEFDs
  (baselines weighted 1 / (SEFD_i SEFD_j)), each station's own elevation limit; the reference meridian (72.2° W) puts
  the default 6.98 h track on the M87 track of 2017 April 11; uniform weighting by default (natural lets ALMA's
  baselines dominate: 43 µas). The crescent is Paper IV's test model (ring 44 µas, 1 + 2A cos, A = 0.23, peak at
  PA 150°, 10 µas blur).
- CHIME: 960 feeds (the 1,024 of the published rule, less the 64 end feeds masked), four 20 × 100 m cylinders drawn
  under the feeds; a transit array: the beam 1.0° / ν(GHz) east-west (DERIVED from 2.5° and 1.3° at the band's edges)
  by 110° north-south; the Duration slider runs to the whole crossing of the beam, θ / (15.04°/h cos δ).
- CHIME + outriggers: CHIME's 960 feeds and KKO, HCO, GBO, each outrigger phased into one station at its fitted
  position; SEFD 40,000 Jy per feed and 40,000 / N for an outrigger of N feeds (DERIVED); every baseline to an
  outrigger kept in the random draw (interf.js baselines, keep); default an FRB snapshot over the whole band.
- CHORD (under construction): the 512-dish core and the 64-dish pathfinder, read from the layout figure; 1.2 λ / D;
  reaches declinations +20° to +80° only (dishes set by hand).
Engine (interf.js): geoXYZ (WGS84 to the equatorial frame of a reference meridian), per-station horizons (staSees:
elevation, own limit, horizon mask), per-baseline weights carried by the samples (wb), the samples' time offsets (tOff,
for Play), elliptical primary beams (beamFn), the crescent, core-jet and point-source skies (skyModel2, pointsList).
The beam fit now climbs only downhill from the peak (lobe(..., down)): the EHT's main lobe joined a +59% sidelobe above
half power and the fit read 173 µas. Page (intapp.js): the Array panel draws a globe for an Earth-scale array
(orthographic, Natural Earth 1:110m land in web/land110.js, public domain; drag turns the globe, a click on a site's
name switches the site's stations), µas in the angle formats, per-array Size and Field ranges, stations up counted by
site, ranges in the hash's r.off (0-959). Checks: validate_int 105 (the VLBA's chords and NRAO's visibility table from
the horizon masks, 45 of 49 cells within 0.2 h; the EHT's longest projected spacing on April 11, 8.336 Gλ vs 8.33 in
the released data; the EHT uniform beam 23.5 × 16.6 µas, PA −1°, vs Paper IV's CLEAN beam 25.4 × 17.4 µas, PA 6°;
CHIME's transit times vs CHIME/FRB 2018; the outrigger chords; CHORD's grid), uitest 351.
Follow-ups (his asks, 11-16): for the transit arrays the Duration slider is "Time in the beam", and the Array panel's
first line says the telescope does not track ("CHIME's cylinders do not track: ... 9 min here"). "Why does the image
look nothing like the famous M87 image?": the page shows the dirty image (no deconvolution, his standing call), so a
Dirty | Smoothed switch under the bottom-right square (r.dimg) shows the sky convolved with the fitted beam instead
(interf.js smoothed: the beam's Gaussian in place of the weights), as published images are shown. The crescent is now
Paper IV's model exactly, the convolution in closed form with the scaled modified Bessel functions (Ine, tabulated
from their integrals), and its visibility in closed form (crescentVis: J0, J1 and the Gaussian taper). The amplitude
panel computes each sample's visibility: closed forms for the crescent, sums of components for the core-jet and the
point sources (compVis), bilinear interpolation of the grid for M101 (it read the nearest grid cell, 0.64 Gλ wide for
the EHT's field, so the points came out as dashes); the model's curve only for the round skies. Checks: validate_int
110 (J0 and the Bessel functions against their series; the crescent's and the core-jet's images against their
visibility formulas through the FFT, to 1e-3; the crescent's first null at J0's zero; a point smoothed by a beam is the
beam), uitest 356.
Interferometer to-do (his "yes", 11-16), first items: the DSA's tracks end ±2 h of hour angle from the transit (the
Sensitivity Calculator's model; dsa2000.json tracking.max_abs_ha_h, carried as haMax), so Duration stops at 3.99 h
of time; the uitest case that asked for 8 h now gets 3.99 h and is scored against a new dense-sampling truth (all
1,360,425 pairs at 30 s steps, streamed: 2.000″ × 1.571″, −15.2%; the same method gives 1.992″ × 1.566″, −15.5%, for
the old 8 h case, whose truth was 2.01″ × 1.55″, −16%). The tracking arrays' Duration tooltip now carries the array's
own note (the VLBA's 8 h, the EHT's April 11 track, the DSA's limit). A new sky, "M87* with its jet" (interf.js
M87, m87Vis), the EHT's default: Paper IV's synthetic M87, the crescent at I0 = 0.55 Jy (Appendix C.1, Eq. 49) and
the large-scale jet of Table 10, three elliptical Gaussians of 0.3, 0.2 and 0.1 Jy, all scaled with the ring's
diameter (44 µas). Each part is normalized by its own flux, so the jet beyond the image grid is dropped while the
crescent keeps its share (0.478). The intra-site baselines (JCMT–SMA, ALMA–APEX) see the whole 1.15 Jy, and every
baseline between sites sees only the crescent (the jet adds < 0.001). The amplitude panel drew samples within 1% of
zero spacing on the frame's left edge, where they were hidden; they are now small marks just inside the frame, so the
panel shows the drop from the total flux to the compact flux, as in the EHT's own amplitude plots. Paper IV's text
says "0.6 Jy of flux density in a compact component" while Eq. 49 sets I0 = 0.55 Jy; the page follows Eq. 49.
Shadowing (interf.js shadowOf, sample's o.shadow; the arrays of tracking dishes on one site: the VLA, ALMA, the DSA
and the made-up layouts): at each time the antennas are projected on the sky (u, v) and toward the source (w), and
two antennas within a dish diameter in (u, v), found through a hash of cells a dish wide, shadow the one farther from
the source; the shadowed antenna's baselines give no sample at that time, as the observatories flag them. The
Observation panel's Shadowed row gives the samples lost, and the About text no longer lists shadowing as left out.
Checked against the Guide to Observing with the VLA (OGS, now cited): "to guarantee no more than a single shadowed
antenna, restrict the elevations ... to >40° for D-configuration and >25° for C-configuration"; the model shadows at
most one antenna above 40° in D (none) and above 25° in C (one), at any hour angle and declination, and up to four in
D at 30–40°. Examples over 8 h: the VLA D toward −30° loses 33% of the samples, ALMA C-1 toward −70° 45%.
The VLA C configuration now has an antenna on the central pad N1, as the Status Summary's note 5 states ("an antenna
from the middle of the north arm is moved to the central pad N1"); CASA's file leaves N1 empty, and the pad vacated
is not published, so the antenna of N10, the middle of the arm's nine pads, moves (INFERRED). The shortest baseline
becomes 44.82 m (the Summary: 35.5 m); the beam checks are unchanged (natural / uniform 1.489, snapshot / full 1.269).
The transit arrays weight each sample by the beam's power toward the drifting source, exp(−4 ln 2 x² / θ_EW²) with
x = cos δ sin H: 1 at transit and 1/2 at the ends of the half-power crossing (carried in the samples' wb, with the
outriggers' SEFD weights). CHORD's grid rotation: no other saved source states the orientation (the white paper, the
SPIE and forecast papers); the page keeps the UTM sense (the text of HIG26 and the zone-11 convergence, grid north
1.99° west of true north), and the conflict with HIG26's figure stays noted in data/interf/chord.md. The header at
1100 px: the Interferometer's note keeps its width, so the Preset menu shrank to one letter; fitHeader now moves the
note under the bar when the note squeezes the menu. validate_int 116.
The transit arrays' map (11-17; a colleague's point, "the primary beam beats down those aliases", and his call that the
page be a fair show of CHIME): a transit telescope maps the sky as the sky drifts, each direction from the data taken
as the direction crosses the meridian, so each map point sees the sky through the synthesized beam times the primary
beam's east-west power pattern, and the map is the sky convolved with that product. interf.js gridEnv convolves the
gridded weights along u with the envelope's transform (envKernel: the inverse DFT of the envelope sampled on the image
grid, exact on the grid), each channel with the channel's own envelope (θ_EW ∝ 1 / ν; at most 16 channel groups). The
envelope is λ / D (the snapshot's), independent of Time in the beam: following each pixel through the transit with
beam-power weights widens the envelope (first alias 30% for 9 min, 43% for the whole transit) and gains a
signal-to-noise the page does not show. North-south the beam stays fixed, so the sky carries the north-south pattern
(R.skyPB = { ew: Infinity, ns }), and CHORD's north-south aliases keep their full height. Peak sidelobe (whole image
grid): CHIME +95% -> +19% at 600 MHz, +8% over 400-800 MHz; CHORD +78% at 900 MHz (the north-south alias), +6% over
its band. The Input image drops the east-west taper and the dashed east-west lines (CHORD: north-south half-power
lines); the Coverage panel shades each sample's strip along u (the envelope's transform). validate_int 120.

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
  R_slit = λ/Δλ (box FWHM = slit width); R_diff = m N_grooves; R_eff = (R_slit⁻² + R_diff⁻²)^(−1/2). No pixel
  term (Charlie's call, 2026-11-16, after the preset audit): the pixel does not widen a measured line (McLean et al.
  2012 measure MOSFIRE's lines at the geometric slit width), and with the term the headline R sat 4–10% below the
  published values. Published R values follow two conventions: the line's true FWHM (M2FS, MOSFIRE, 4MOST HRS,
  ZShooter: the model's R_eff) and a fitted width (X-Shooter, Binospec, DEIMOS, IFUM: a Gaussian fitted to a top-hat
  line spanning 3 px or more has 0.841 of the line's width, so R_fit = ((0.841/R_slit)² + R_diff⁻²)^(−1/2), ≈ 1.19
  R_eff; the R tooltip gives both). Two assumptions sit in these numbers: the slit is uniformly lit (a star smaller
  than the slit gives a narrower line and a higher R); R_diff is the Rayleigh limit. The results strip gives R at λc; in
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
- **ZShooter** (Keck I, design; data/round6/zshooter.md): six channels at the 0.70″ slit, from the project website
  and the project's simulator (built from the June 2026 Zemax design; the SPIE 2026 paper was not obtainable). F = 10
  (1500 mm collimator, 150 mm beam and the 530.6 µm/″ slit scale; the website's f/10.5 is not used). White pupil:
  the 225 mm cameras sit behind a second, 1250 mm collimator, so the model's camera is the effective 270 mm and each
  VPH enters as G × 225/270. Rs 17,700 against the median 18,000, 4.48 px against 4.46, orders' spans on the chip
  within 0.4–2.3% and the closest order spacing within 0.2% of the simulator. Dichroics, detector rotations
  (5–9.5°) and B's orders below 3200 Å are not modeled.
- **M2FS and IFUM** (Clay; data/round6/m2fs_ifum.md, audited 2026-11-16 in data/round6/m2fs_ifum_audit.md):
  pupil-fed fibers, so F = 3.4 (the fiber output and the collimator's ratio) and the core enters as
  core / (3.4 × 6.5 m), 1.40″ for M2FS's 150 µm and 2.43″ for IFUM LSB's 260 µm. One 500 mm lens group is
  collimator and camera (147 mm beam, 1:1). The Telescope box gives the f/11 Nasmyth focus and the 1.2″ (M2FS) and
  1.9″ (IFUM) apertures (telF, fibAp), and the F slider is labeled as the fiber output. M2FS HiRes is an echelle
  preset: Richardson's R2.6 ruling 53-*-417E, 52.67 /mm, blaze 69° (the only R2.6 of that size in the 2014 catalog;
  MIKE's blue echelle is the same ruling), crossed by the 23.6° SCHOTT F2 prism in a double pass. Mateo et al. 2012
  place the 6.6° between the beams in the echelle's dispersion plane: the camera beam passes "just below the
  injection optics", and the steep incidence vignettes 7% of the light. The layout draws the returning beam at that
  angle. The angles are set from the arc-line dispersion in Ji's reduction (α 73.2°, β 66.6°, so the echelle sits
  0.9° off its blaze, eTilt): mλ at the blaze center is 356,004 Å (355,790 measured), 0.0327 Å/px at 5160 Å
  (0.0329), and orders 69–68, 68–67 and 67–66 lie 28.3, 27.8 and 27.2 px apart (28.0, 27.7 and 27.0 measured; the
  first is scored). The anamorphic factor 0.73 narrows the fiber's image, so R = 24,960 for any slit of 150 µm or
  wider (published ≈24,000, scored) and 34,100 with the 95 µm slit (32,000–34,000 measured). The published ≈18,000
  comes from the multi-order setup and is a reference line. The order filter (filt, 5130–5190 Å) passes order 69
  and the edges of 68 and 70, and the traces sit in their groups (fgroups: 8 × 16 at 19.3 px, 214 px between
  groups, measured from Ji's trace centers). IFUM LSB: the same spectrograph in grating mode; 10 mounts of 18 per
  detector (spacings read from Crosby et al. Fig. 1); R = 785 from the FWHM of the fiber's line vs the published
  ≈1000, which a Gaussian fit to the line reproduces (FWHM 0.70 of the core vs the true 0.866). The published ≈3600 with the 80 µm slit cannot
  be reached within 4800–6700 Å and looks nominal; both values are reference lines. The first version of these
  presets used an EFFECTIVE 51.74 /mm echelle in true Littrow with the opening angle across the dispersion; the
  audit lists the superseded statements.

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

## Preset and Setting menus

An instrument with several settings (arms, channels, gratings, bands, cameras) is one line in the Preset menu, and a
Setting menu beside it, shown only for such an instrument, picks the setting (2026-11-16, his ask: the spectrograph
menu went from 62 lines to 33, the imager menu from 35 to 26). A preset carries inst (its line) and setting (its
name in the Setting menu); presets without inst are one line each. The instrument's line holds the selected
setting's preset id as its value, so the Preset menu's value and the links name the preset as before; choosing
an instrument starts at its first setting. From 861 to 1540 px the two menus share the bar's room, each up to its
own width, so the header stays on one row (uitest checks every multi-setting preset at 1280 px).

## References

The References button in the header opens a dialog with the selected preset's main references (one to three,
linked), the preset's note on where the numbers come from, and the references of the model in the current mode
(glass indices, band wavelengths, the seeing profile, the Earth's rotation rate, the M101 image credit). The
references are chosen in `data/refs_map.json`, where each one names a source by file and key in the research
tables under `data/`; `node make_refs.js` takes the links from those tables and writes `web/refs.js`. The script
fails if a reference does not resolve, if the short citation's first word or year is missing from the table's
citation, or if a preset of any mode has no reference, and deploy.sh runs `node make_refs.js --check`, so a new
preset cannot ship without a reference. Papers link to their ADS abstract pages (the map's `ads` bibcodes, 97 papers,
resolved by first author, year, volume and page and checked against the title in the source table); other links are
the documents the research used, with arXiv PDF links turned into arXiv abstract pages. Hovering over the preset menu lists the selected preset's sources.

## Verification

**The preset audit of 2026-11-16** (the reports in data/audit/ and data/round6/m2fs_ifum_audit.md). The builder of
M2FS and IFUM found their presets wrong; independent auditors then re-checked each preset against the saved sources
and searched for better ones (catalogs, pipelines' calibration files, design figures). Corrected so far:
- M2FS: the echelle is Richardson's 52.67 /mm at 69° with the 6.6° opening in the dispersion plane (was a fitted
  51.74 /mm in true Littrow), now an echelle preset with the F2 prism; R 18,080 became 24,960 (published ≈24,000).
  IFUM: the same geometry; R explained.
- 4MOST HRS: the concept camera and gratings contradicted ESO's as-built calibrations (QMOST kit 0.9.6); an effective
  441 mm camera and gratings fitted to the as-built dispersion now match the as-built coverage to 2 Å and the
  published R to 0.4–2.1% (R had been 10–18% high).
- LDSS-3 VPH-Red: 660 /mm (documented), not maskgen's fitted 665. X-Shooter: each arm's band (the dichroics) and the
  real orders (VIS and NIR recentered). DESI: λc from the measured chip ranges. Via and Boombox: the project's newer
  design documents (Boombox's 50 mm beam and drawn grating geometry; Viaspec's tech-memo design).
- Keck: the f/25 focus is 4.54 m in front of the primary (was drawn behind it); the Nasmyth and bent foci use the
  sourced tertiary height and focus distance. HST: the outer pads had been mirrored.
- New: order filters and arm bands (filt), fiber groups on the detector (fgroups), and R without the pixel term (see
  Physics). Many reference lines relabeled (design, calculated, nominal, measured) and circular checks made info.
- Smaller findings (his "fix all the smaller findings", 11-16): DESI's R and Z detectors are 4114 × 4128 (the 4128
  along the wavelength, INFERRED), now within 0.3% and 0.0% of Guy et al.'s spans. FEROS: an EFFECTIVE 56° prism
  centered on 4550 Å gives the 39 orders 25–63 (the design's 55° put parts of orders 22–24 on the chip); the CERES
  arc lines' dispersions are scored (orders 33 and 49, the model 0.7% and 1.4% finer: the camera's lateral color); the
  measured R = 48,000 is a reference line (2.2 px per FWHM, so the pixel widens the measured line). FIRE: PypeIt's
  measured dispersions scored (0.1–0.2%), and the note gives the order-center offsets. PFS: the detector maps'
  dispersions scored (0.1% and 0.4%). X-Shooter: ESO's spectral-format tables give the order spans, 15% (VIS) and 9%
  (NIR) less than the model's minimum-deviation prisms (reference lines; cause open). LDSS-3: the R lines compared at
  the wavelengths the sources quote. MOSFIRE: grooves shown to four figures (110.5 /mm), and a readout gives the blaze
  peak at the 40° angle (6.35 µm, the sources' figure) beside the slider's Littrow value. Telescopes: Keck's f/40 stop
  drawn as the serrated outline at 95.4% with a hexagonal hole (63.1 m², was 67.0), Magellan's f/5 focus from the
  MMT's identical optics, schematic distances disclosed, and notes for the VLT's stowed tertiary, DKIST's field stop,
  the ELT's thinner spider arms, GMT's and HET's and JWST's area sources. Each research record the audit overturned
  now opens with a "Superseded by the audit of 2026-11-16" section.
- Second batch (his "apply them all", 11-16): the reports of S1, S4, S5, S8 (written before the usage limit), and
  T2, X and the rest of I2 (resumed), all in data/audit/. Spectrographs:
  - MIKE: the standard settings' orders (37–70, 71–106) on the chips; the blue prisms as Bernstein et al.'s
    62° equivalent; the design order spans scored (0.2%); 52.67 /mm blue; γ out of plane (INFERRED); the as-built R
    and scales as reference lines.
  - HARPS: the grism apex from the 480 nm blaze (14.5°, a new input, xGrA); the UVES 75.04° mosaic turned to 75.3°;
    the four published order separations within 2%.
  - HIRES: scored against the measured R 50,000 and the manual's 6360 Å gap.
  - Hectochelle: camera 618.66 mm (was 642.6), the RV31 band, the H3 arc solutions scored (0.6%).
  - Hectospec: the delivered grating's 4.1° blaze, the manual's coverage table, the measured arc-line widths.
  - G-CLEF: format center 7450 Å, 0.812″ fiber, the center-spacing check, the Gaussian-fit R.
  - ESI: 175.555 /mm and the double-passed prism turned 4° from minimum deviation (INFERRED), which reproduces
    PypeIt's order positions to 13 px rms; the along-slit scale variation is still not reproduced.
  - ESPRESSO: the UVES red master's 75.04°, γ 0, the design 800 mm camera (the published pixel sizes now pass
    unfitted), cross-dispersers refit to the published orders, λc on a blaze; "(partly fitted)" dropped from the
    name (his request).
  - UVES, MUSE, KCWI, KCRM, IMACS, LLAMAS, MagE: the reports' corrections (measured R lines, sources, drawings).
  New engine inputs: xGrA (an echelle grism's apex) and a prism's dI (its rotation from minimum deviation).
  Telescopes (T2): no number contradicted; Rubin's four bars (not eight vanes), the Blanco Mosaic II focus's reused
  DECam top end, VISTA's VIRCAM-era baffle at the 4MOST focus, SDSS's undrawn cone (+3.6% in area) and TMT's two-digit
  area source are now stated.
  Arrays (X): CHIME's field ends at −11°, the CHIME/FRB catalog's limit (was a derived −5.7°); the sky north of −11°
  is 60% of the sphere, not three quarters. CHIME + outriggers phases CHIME into one station, as the VLBI forms one beam
  at the CHIME core and at each outrigger (Andrew et al. 2026): four stations and six baselines, so the random draw of
  feed pairs no longer sets the beam. The stations' SEFDs follow the radiometer equation of Lazda et al. 2026 (CHIME
  42 Jy, KKO 630 Jy, HCO and GBO 314 Jy, labeled ideal). CHORD's peak-sidelobe readout searches the whole image grid,
  so the grating lobes count (+78% at the default, was −9%), and validate_int checks the lobes' positions against
  Hopkins et al. 2026 (1.42° and 1.92° vs "about 1.4" and "about 1.9"). The EHT's station limits, read from the 2017
  tracks, are described as such; the VLBA beam, ALMA's +47° rule, Arecibo's taper and CHIME's end feeds have corrected
  notes; the point-source sky's fluxes span 1 to 100 as stated. validate_int 117.
  Imagers (I1, I2, I3): the engine gained a published collecting area where the circular annulus misstates a
  segmented or shadowed pupil (NIRCam 25.4 m² in place of 32.8; the Keck imagers 71.5 m² in place of 88.8; DECam
  9.31 m²), rectangular field stops (the slit-mask units of FORS2 and LRIS), the filter drawn where each instrument
  has it (in front of the detector for FourStar, HAWK-I and IMACS; in NIRI's converging beam), and the published scan
  formats and scanning spot of the sky-survey plates. HSC, DECam, MegaCam and both LBC cameras draw their correctors,
  so each primary is drawn at its own focal ratio. Measured values replace nominal ones where the sources allow:
  NIRCam's in-flight scales, ACS's chip-center scale, the LBC builders' center scale, the DSS-2 plate solution, the
  4-Shooter's 520″ sky field and LCO's 656 arcmin² for IMACS. WFC3/IR and 2MASS take their cold stops as the aperture,
  and the circular checks became reference lines (validate_img 301). Not applied: LBC-Blue chip 4's 1 mm offset (its
  direction in the model's frame is not settled) and HSC's obscuration (unpublished; ε = 0 stays flagged).


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
`./deploy.sh`, as for lensex; the script publishes web/ as committed at HEAD, only after `node validate.js`, `validate_img.js`, `validate_int.js` and `make_refs.js --check` pass, and
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
