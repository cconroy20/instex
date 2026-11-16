/* Telescopes for the Telescopes mode (window.IX_TELESCOPES).  Sources: data/telescopes/*.md.
   All values from data/telescopes/{keck,magellan,hst}.md (2026-10-19), with page references and quotes there.
   Each telescope: id, group (menu), name, D (m), F1 (primary focal ratio), eps (default obstruction), pupil
   { kind: "circle" | "hex", D, flat, gap, rings, vanes: [{ ang, w, full }], pads: [{ r, ang, d }] }, foci:
   [{ id, name, F, design ("prime" | "cass" | "greg" | "korsch" | "pb"), nasmyth, side ("down" for a right or west
   Nasmyth platform, "up" for left or east: drawn on opposite sides), back, backN, field (arcmin), eps, refl, secondary,
   where }]; hole: the primary's central hole (m, diameter), where a source gives one (Magellan 1.3, HST 0.6, VLT 1.0, GMT's
   central mirror 1.78; data/telescopes/<id>.md); the 3D view cuts it, or else the hole the telescope's foci need;
   coating: "gold" for gold-coated mirrors (JWST), drawn gold in the 3D view. Each focus: kind (its button in the Focus row:
   Nasmyth, Cassegrain, Folded port, ...) and, where a kind has several foci, variant (its button in the row below).
   binocular: the separation (m) of two identical telescopes on one mount (the LBT): the layout draws one side, the 3D
   view both, and a focus that combines the two beams carries a two-mirror pupil. */
window.IX_TELESCOPES = [
  // Keck (I and II, one design): data/telescopes/keck.md (one design: 36 hexagonal segments of 0.9 m sides (1.8 m corner to corner,
  // 1.5588 m flat to flat) in three rings around an empty center, 7 mm non-reflecting strips between them (3 mm gaps and
  // bevels); circumscribed 10.949 m; a 2.6 m central obstruction (design; 2.48 m measured); six 25 mm vanes parallel to
  // the segment edges, toward the midpoints of the outline's sides (measured on Keck II, used for both). The primary's
  // focal length is 17.5 m (f/1.75 on the nominal 10 m); all focal ratios here are on 10.949 m, so f/15 is f/13.66.
  // nominalD: the 10 m behind the foci's names (KOR90 Sec. 4.1), shown beside the focal ratio in the strip.
  {"id": "keck", "group": "Keck 10 m", "name": "Keck 10 m", "segments": 36, "nominalD": 10, "D": 10.949, "F1": 1.5983, "eps": 0.2375, "pupil": {"kind": "hex", "D": 10.949, "flat": 1.5588, "gap": 0.007, "rings": 3, "vanes": [{"ang": 30, "w": 0.025}, {"ang": 90, "w": 0.025}, {"ang": 150, "w": 0.025}, {"ang": 210, "w": 0.025}, {"ang": 270, "w": 0.025}, {"ang": 330, "w": 0.025}]}, "primaryNote": "36 hexagonal segments (0.9 m sides), 17.5 m focal length (f/1.75 on the nominal 10 m), in three rings around an empty center. Keck I and Keck II are the same design.", "area": {"value": 71.5, "info": true, "src": "derived clear area at f/15 (data/telescopes/keck.md); the 1985 design's 76 m² is the segments alone (checked separately)"}, "segmentsArea": {"value": 76, "tol": 0.005, "src": "Nelson, Mast & Faber 1985"}, "foci": [
    {"id": "cass", "name": "Cassegrain f/15", "kind": "Cassegrain", "variant": "f/15", "F": 13.6618, "design": "cass", "back": 0.2283, "field": 20, "refl": 2, "secondary": "convex hyperboloid, 1.4 m (the tertiary stowed)", "where": "2.5 m behind the primary's vertex", "plate": 1.379},
    {"id": "nasr", "name": "Right Nasmyth f/15", "kind": "Nasmyth", "variant": "Right", "F": 13.6618, "design": "cass", "nasmyth": true, "side": "down", "field": 20, "refl": 3, "secondary": "convex hyperboloid, 1.4 m, flat tertiary", "where": "right Nasmyth platform", "plate": 1.379},
    {"id": "nasl", "name": "Left Nasmyth f/15 (AO)", "kind": "Nasmyth", "variant": "Left (AO)", "F": 13.6618, "design": "cass", "nasmyth": true, "side": "up", "field": null, "refl": "3 to the focus, about 10 to the AO output", "secondary": "convex hyperboloid, 1.4 m, flat tertiary", "where": "left Nasmyth platform, into the AO bench (output f/15)", "plate": 1.379},
    {"id": "bent", "name": "Bent Cassegrain f/15", "kind": "Bent Cassegrain", "variant": "f/15", "F": 13.6618, "design": "cass", "nasmyth": true, "backN": 0.45, "field": 5, "refl": 3, "secondary": "convex hyperboloid, 1.4 m, the tertiary turned to a port", "where": "four stations on the center section", "plate": 1.379, "fieldNote": "5′ (the 1985 design)."},
    {"id": "f25", "name": "Forward Cassegrain f/25 (Keck I, historical)", "kind": "Cassegrain", "variant": "f/25 (Keck I, historical)", "F": 22.8057, "design": "cass", "back": 0.2283, "field": 10, "refl": 2, "secondary": "a 0.53 m gold-coated chopping secondary", "where": "behind the primary (Keck I, 1993-2010)", "plate": 0.826},
    {"id": "f40", "name": "Bent Cassegrain f/40 (Keck II, historical)", "kind": "Bent Cassegrain", "variant": "f/40 (Keck II, historical)", "F": 36.0764, "design": "cass", "nasmyth": true, "backN": 0.45, "field": 10, "refl": 3, "eps": 0.2968, "pupil": {"clip": 10.445}, "secondary": "a chopping secondary, undersized to be the stop (10.445 m on the primary)", "where": "a bent-Cassegrain port (Keck II)", "plate": 0.522, "fieldNote": "10′ in the design; 186″ at the visitor port. The secondary's central hole is hexagonal (drawn round here, 3.25 m on the primary, read from a figure)."}]},
  // Magellan: data/telescopes/magellan.md (twin telescopes: f/1.25 paraboloid primaries with a 1.3 m hole; the f/11
  // Gregorian secondary and a flat rotating tertiary feed five stations, two Nasmyth platforms and three folded ports on
  // the center section). Clay stands for both (the more foci: Clay alone adds the f/5 Cassegrain and the f/16 adaptive
  // secondary). The pupil, measured on Clay: eps 0.29 is the secondary baffle (a diameter ratio); four vanes at +/-45 deg
  // from points 0.34 m off center (the hcipy Magellan model's frame, its orientation on the sky not known), 0.75 in wide,
  // two widened to 1.5 in by the MagAO cable trays (which two: the hcipy choice). Baade's vanes are not published.
  { id: "magellan", group: "Magellan 6.5 m", name: "Magellan 6.5 m", D: 6.5, F1: 1.25, eps: 0.29, hole: 1.3,
    primaryNote: "A spin-cast borosilicate honeycomb paraboloid, f/1.25, with a 1.3 m central hole. Shown: the Clay telescope; Baade is the same design without the f/5 and f/16 foci.",
    pupil: { kind: "circle", D: 6.5, vanes: [
      { ang: 45, w: 0.01905, x0: 0.34 }, { ang: -45, w: 0.01905, x0: 0.34 }, { ang: 225, w: 0.0381, x0: -0.34 }, { ang: 135, w: 0.0381, x0: -0.34 }] },
    pupilNote: "Clay's pupil: two of the four 0.75-inch vanes are widened to 1.5 inches by the cable trays of the MagAO adaptive secondary.",
    area: { value: 30.13, info: true, src: "derived from the pupil's geometry (no official value)" },
    foci: [
      { id: "nasw", name: "f/11 Nasmyth West (Gregorian)", kind: "Nasmyth", variant: "West", F: 11, plate: 2.88, design: "greg", nasmyth: true, side: "down", field: null, refl: 3, secondary: "concave (Gregorian), about 1.3 m; a flat rotating tertiary", where: "west Nasmyth platform" },
      { id: "nase", name: "f/11 Nasmyth East (Gregorian)", kind: "Nasmyth", variant: "East", F: 11, plate: 2.88, design: "greg", nasmyth: true, side: "up", field: null, refl: 3, secondary: "concave (Gregorian); a flat rotating tertiary", where: "east Nasmyth platform (a rotating port)" },
      { id: "aux", name: "f/11 folded ports (Gregorian)", kind: "Folded port", F: 11, plate: 2.88, design: "greg", nasmyth: true, backN: 0.5, field: null, refl: 3, secondary: "concave (Gregorian); the flat tertiary turned to a port on the center section", where: "three folded ports on the center section" },
      { id: "cass5", name: "f/5 Cassegrain", kind: "Cassegrain", F: 5.36, design: "cass", field: 35, eps: 0.277, refl: 2, secondary: "convex hyperboloid, 1.8 m (the f/5 secondary)", where: "behind the primary", pupilNote: "The f/5 secondary's own support vanes and baffle are not published: the f/11 vanes are drawn, and ε is the 1.8 m mirror.", fieldNote: "35′ with the Megacam corrector; f/5.2 over 14′ with the MMIRS corrector. F from the published 0.169 mm per arcsecond." },
      { id: "asm16", name: "f/16 adaptive secondary (MagAO)", kind: "Nasmyth", variant: "East, MagAO f/16", F: 16.16, design: "greg", nasmyth: true, field: null, refl: 3, secondary: "the adaptive secondary, an 85 cm concave ellipsoid (the pupil's obstruction is still the 0.29 baffle)", where: "a Nasmyth station (which side is not published: drawn on the west)" },
    ] },
  // HST: data/telescopes/hst.md (OTA Handbook 1990, Figure 4.1; x = +V2, y = +V3; whether the drawing is seen from the
  // sky or the focal plane is not stated). The two outer pads: 58.5 and 67.6 deg from -V3, taken on either side of it.
  { id: "hst", group: "Hubble 2.4 m", name: "Hubble 2.4 m", D: 2.4, F1: 2.3, eps: 0.33, space: true, hole: 0.6,
    primaryNote: "A concave hyperboloid (R = 11.04 m, f = 5.52 m) with a 600 mm central hole; as built its conic was wrong (the figuring error of about half a wave rms, from a 1.3 mm spacing error in the null corrector), corrected since 1993 inside the instruments.",
    pupil: { kind: "circle", D: 2.4,
      vanes: [{ ang: 0, w: 0.025654, full: true }, { ang: 90, w: 0.025654, full: true }],
      pads: [{ r: 1.0668, ang: 90, d: 0.150368 }, { r: 1.07188, ang: 211.5, d: 0.150368 }, { r: 1.07188, ang: 337.6, d: 0.150368 }] },
    area: { value: 3.899, src: "OTA Handbook 1990: 38990 cm² clear (45240 total, 4930 behind the central obscuration, 1320 behind the pads and spider)" },
    foci: [
      { id: "cass", name: "Cassegrain f/24", kind: "Cassegrain", F: 24, plate: 3.58, design: "cass", back: 0.625, field: 28, refl: "2 (axial bays), 3 (radial bays)",
        secondary: "convex hyperboloid, Ø 281 mm, 4.906 m from the primary (× 10.4)", where: "1.50 m behind the primary's vertex: four axial bays, and radial bays fed by pick-off mirrors",
        fieldNote: "About 28′ across; the focal surface is curved. The three Fine Guidance Sensors take quarter annuli 10′ to 14′ from the axis." },
    ] },
  // JWST: data/telescopes/jwst.md (entrance pupil seen from the sky, x = +V2, y = +V3; STScI's STPSF pupil model for
  // the segments and struts). 18 hexagons, flat sides up (the lattice turned 30 deg), in two rings around the empty
  // center: the lattice pitch 1.3235 m puts the inner ring where STPSF does (the outer ring within 0.5%); the segments
  // are 1.3074 m across the flats so the 18 have STPSF's 26.641 m^2 (seen from the sky the segments are about 1%
  // smaller than their 1.32 m along the curved mirror). The secondary hides in the central hole: no circular
  // obstruction in the pupil (drawEps 0.202 = the hole, 1.335 m, for the drawing's bundles). Struts: +V3 0.119 m with
  // two short bumps (the hinge and dampers), and two at -60 and -120 deg, 0.122 m (STPSF).
  { id: "jwst", group: "JWST 6.6 m", name: "JWST 6.6 m", D: 6.6, F1: 1.203, eps: 0, drawEps: 0.202, space: true, segments: 18, coating: "gold",
    primaryNote: "18 hexagonal beryllium segments, gold-coated, 1.32 m across the flats with 7 mm gaps, in two rings around an empty center (filled by the aft optics); radius of curvature 15.88 m (f = 7.94 m, f/1.20 on the 6.6 m entrance pupil). Six segments fold back on two wings for launch.",
    pupil: { kind: "hex", D: 6.6035, flat: 1.3235, gap: 0.0161, rings: 2, rot: 30,
      vanes: [{ ang: 90, w: 0.11887 }, { ang: -60, w: 0.12243 }, { ang: -120, w: 0.12243 },
        { ang: 90, w: 0.16519, from: 2.14627, to: 2.3645 }, { ang: 90, w: 0.13959, from: 2.48335, to: 2.54445 }] },
    pupilNote: "The pupil as STScI's STPSF model draws it, seen from the sky (+V3 up): the segments flat side up, the +V3 strut with two widenings for its hinge and dampers.",
    area: { value: 25.779, tol: 0.006, src: "STPSF pupil model, geometric clear area (DERIVED, data/telescopes/jwst.md); measured 25.44 m² with NIRCam's pupil imaging lens (McElwain et al. 2023)" },
    foci: [
      { id: "tel", name: "Telescope focus f/20 (three mirrors)", kind: "Telescope focus", F: 19.909, plate: 1.5697, design: "korsch", field: 18, refl: 4,
        secondary: "convex hyperboloid, 0.738 m, 7.17 m in front of the primary; then a concave tertiary behind the primary and a flat fine steering mirror",
        fieldNote: "≈18′ × 9′ (the instruments' fields side by side); the focal surface is curved, ≈1.96 m behind the primary's vertex. Drawn as a generic three-mirror (Korsch) layout: the focal length and plate scale are JWST's, the mirrors' places are schematic." },
      { id: "cass", name: "Cassegrain focus f/9 (intermediate)", kind: "Intermediate focus", F: 9.0, plate: 3.472, design: "cass", back: -0.2114, field: null, refl: 2,
        secondary: "convex hyperboloid, 0.738 m, 7.17 m in front of the primary",
        fieldNote: "The image the primary and secondary form 1.39 m in front of the primary's vertex, at the entrance of the aft optics; the tertiary and the fine steering mirror then re-image the light at f/20. No instrument sits here." },
    ] },
  // DKIST: data/telescopes/dkist.md. An off-axis Gregorian: the primary is a 4 m section of a 12 m parent paraboloid
  // (RoC 16 m, f = 8 m) centered 4 m from the parent's axis; a cooled 4.0 m stop ring sets the pupil, with nothing in
  // the beam. Positions along the parent's axis DERIVED for a coaxial secondary (no source gives its decenter): the
  // Gregorian focus 1.365 m in front of the parent's vertex (back = -1.365 / 4), the secondary's magnification 6.5295
  // from SPEC-0029's prescription (via Mathur 2020), so f = 52.24 m. The f/53 relay and the coude lab are not drawn.
  { id: "dkist", group: "DKIST 4 m", name: "DKIST 4 m", D: 4.0, F1: 2, eps: 0, offAxis: 4.0,
    primaryNote: "An off-axis paraboloid: a 4 m section of a 12 m parent mirror (radius of curvature 16 m, f = 8 m), its center 4 m from the parent's axis, on a 4.24 m Zerodur meniscus 75 mm thick. f/2 on the 4 m aperture.",
    pupil: { kind: "circle", D: 4.0 },
    pupilNote: "Unobstructed: off-axis, so the secondary and its support sit outside the beam (no central obstruction, no spider).",
    area: { value: 12.56, src: "Rimmele et al. 2020, Sec. 4.1: 'the full 12.56 m² collecting area'" },
    foci: [
      { id: "greg", name: "Gregorian focus f/13", kind: "Gregorian", F: 13.059, plate: 3.9487, design: "greg", back: -0.34125, field: 5, refl: 2,
        secondary: "off-axis concave ellipsoid, 0.65 m (conic −0.54), on a fast tip-tilt hexapod",
        fieldNote: "5′ at most; a 2.8′ field stop for the adaptive optics. The focal length is DERIVED (52.24 m) from the published prescription; the published focal ratio is f/13." },
      { id: "prime", name: "Prime focus f/2 (the heat stop)", kind: "Prime focus", F: 2, plate: 25.78, design: "prime", field: 5, refl: 1,
        secondary: "none here: the heat stop at prime focus passes the 5′ field", pfuLabel: "heat stop", pfuSub: "passes the central 5′; the rest of the Sun's light is rejected",
        fieldNote: "The heat stop's 5′ opening (the Sun's image here is ≈75 mm across)." },
    ] },
  // VLT: data/telescopes/vlt.md (one Unit Telescope; the four share the design). The stop is the secondary (ESO
  // instrument specification: "The pupil is determined by the secondary mirror"): the entrance pupil is 8.0 m at
  // Nasmyth and coude, 8.115 m at Cassegrain (each focus's F is on its own pupil). Vanes: hcipy's model (after ESO's
  // ERIS document): four 40 mm vanes in two pairs from points 0.524 m off the center on the diagonal; their
  // orientation relative to the Nasmyth platforms is not published. Platform A is east and B west (VLT White Book,
  // at azimuth 0): drawn up and down. The tertiary is a flat 2.5 m above the primary's vertex; the Nasmyth foci are
  // 6.8 m from the axis. The coude train (f/47.3, eight mirrors, feeding the VLTI) is not drawn.
  { id: "vlt", group: "VLT 8.2 m", name: "VLT 8.2 m", D: 8.0, Dmirror: 8.2, f1: 14.4, eps: 0.1395, hole: 1.0,
    primaryNote: "A thin Zerodur meniscus 8.2 m across (8.186 m reflecting) and 175 mm thick, shaped by 150 actuators; radius of curvature 28.8 m (f = 14.4 m). The secondary is the stop: the entrance pupil is 8.0 m at Nasmyth, 8.115 m at Cassegrain. Since 2016 UT4's secondary is deformable (the Adaptive Optics Facility).",
    pupil: { kind: "circle", D: 8.0, vanes: [
      { ang: 174.5, w: 0.04, x0: -0.3707, y0: -0.3707 }, { ang: 275.5, w: 0.04, x0: -0.3707, y0: -0.3707 },
      { ang: 354.5, w: 0.04, x0: 0.3707, y0: 0.3707 }, { ang: 95.5, w: 0.04, x0: 0.3707, y0: 0.3707 }] },
    pupilNote: "Four 40 mm vanes in two pairs, each pair meeting 0.52 m off the center (hcipy's model, after an ESO document); no vane crosses the pupil. The central obstruction is the 1.116 m secondary.",
    area: { value: 48.71, info: true, src: "DERIVED geometry at Nasmyth (no ESO value found; GRAVITY+ uses 49.26 m²)" },
    foci: [
      { id: "nasa", name: "Nasmyth A f/15 (east)", kind: "Nasmyth", variant: "A (east)", F: 15, plate: 1.7189, design: "cass", nasmyth: true, side: "up", a3: 2.5, backN: 0.85, field: 30, refl: 3,
        secondary: "convex hyperboloid, 1.116 m (beryllium); a flat elliptical tertiary 2.5 m above the primary", fieldNote: "30′ in all, 7.15′ unvignetted (the tertiary vignettes from 20′)." },
      { id: "nasb", name: "Nasmyth B f/15 (west)", kind: "Nasmyth", variant: "B (west)", F: 15, plate: 1.7189, design: "cass", nasmyth: true, side: "down", a3: 2.5, backN: 0.85, field: 30, refl: 3,
        secondary: "convex hyperboloid, 1.116 m (beryllium); a flat elliptical tertiary 2.5 m above the primary", fieldNote: "30′ in all, 7.15′ unvignetted (the tertiary vignettes from 20′)." },
      { id: "cass", name: "Cassegrain f/13.4", kind: "Cassegrain", D: 8.115, F: 13.4106, plate: 1.8953, design: "cass", back: 0.30807, eps: 0.138, field: 15, refl: 2, pupil: { D: 8.115 },
        secondary: "convex hyperboloid, 1.116 m (the tertiary turned out of the beam)", fieldNote: "15′ in all, 2.68′ unvignetted; the focus 2.5 m below the primary's vertex." },
    ] },
  // GMT: data/telescopes/gmt.md (Observatory Architecture Document 2021; hcipy's model for the truss). Seven 8.365 m
  // clear apertures: one on the axis, six tilted 13.522 deg and centered 8.71 m out on the surface, which project to
  // ellipses 8.365 x 8.133 m (radial) centered 8.657 m out (DERIVED); circumscribed 25.448 m. The 3.6 m secondary
  // baffle and a three-legged truss (hcipy: per leg two 0.119 m struts widening 1.16 deg per edge from a node at
  // 2.386 m, and one 0.115 m strut; a triangle of 4.93 m circumdiameter at the center) shadow the central mirror only.
  // The cross-section drawn runs through the central and two outer mirrors (the clear apertures, with their gaps).
  // The folded port: a flat tertiary 1.93 m above the Gregorian focus, the focus 1.93 m off the axis (DERIVED).
  { id: "gmt", group: "GMT 25.4 m", name: "GMT 25.4 m", D: 25.448, f1: 18.0, eps: 0.141, hole: 1.78,
    primaryNote: "Seven 8.4 m mirrors (8.365 m clear) on one parent surface: one on the axis and six off-axis around it, tilted 13.5°; radius of curvature 36 m (f = 18 m, f/0.71 on the 25.4 m pupil).",
    pupil: { kind: "circles", D: 25.448, segs: [
      { x: 0, y: 0, d: 8.365 }, { x: 8.6569, y: 0.0000, d: 8.365, dr: 8.1331 },
      { x: 4.3285, y: 7.4971, d: 8.365, dr: 8.1331 }, { x: -4.3284, y: 7.4971, d: 8.365, dr: 8.1331 },
      { x: -8.6569, y: 0.0000, d: 8.365, dr: 8.1331 }, { x: -4.3285, y: -7.4971, d: 8.365, dr: 8.1331 },
      { x: 4.3285, y: -7.4971, d: 8.365, dr: 8.1331 } ],
      vanes: [
        { ang: 350.17, w: 0.119, div: 1.16, x0: 0.0000, y0: -2.3860, rmax: 4.1825 },
        { ang: 189.83, w: 0.119, div: 1.16, x0: 0.0000, y0: -2.3860, rmax: 4.1825 },
        { ang: 11.2, w: 0.115, x0: 0.0500, y0: -2.4090, rmax: 4.1825 },
        { ang: 110.17, w: 0.119, div: 1.16, x0: 2.0663, y0: 1.1930, rmax: 4.1825 },
        { ang: 309.83, w: 0.119, div: 1.16, x0: 2.0663, y0: 1.1930, rmax: 4.1825 },
        { ang: 131.2, w: 0.115, x0: 2.0613, y0: 1.2478, rmax: 4.1825 },
        { ang: 230.17, w: 0.119, div: 1.16, x0: -2.0663, y0: 1.1930, rmax: 4.1825 },
        { ang: 69.83, w: 0.119, div: 1.16, x0: -2.0663, y0: 1.1930, rmax: 4.1825 },
        { ang: 251.2, w: 0.115, x0: -2.1113, y0: 1.1612, rmax: 4.1825 } ],
      blocks: [[[2.1348, 1.2325], [-2.1348, 1.2325], [0.0000, -2.4650]]] },
    pupilNote: "Seen from the sky the six outer mirrors are ellipses (8.37 × 8.13 m). The secondary's 3.6 m baffle and a three-legged truss shadow only the central mirror (the truss as hcipy models it; the pupil's orientation relative to the elevation axis is not published).",
    area: { value: 357.0, info: true, src: "GMTO Observatory Architecture Document 2021: current best estimate 357.0 m² (368 m² headline)" },
    segmentsArea: { value: 375.558, tol: 0.003, src: "the seven clear apertures, geometric (DERIVED, data/telescopes/gmt.md)" },
    mirrorSpans: [[-12.7235, -4.5904], [-4.1825, 4.1825], [4.5904, 12.7235]],
    foci: [
      { id: "dg", name: "Direct Gregorian f/8.2", kind: "Direct Gregorian", F: 8.1574, plate: 0.99362, design: "greg", back: 0.22909, field: 20, refl: 2,
        secondary: "seven 1.05 m concave adaptive segments (Gregorian, beyond the prime focus)", fieldNote: "20′ (the secondary vignettes up to 7% at the edge); the focus 5.83 m below the primary's vertex. A corrector-ADC (f/8.34 over 20′) is not drawn." },
      { id: "fp", name: "Folded port f/8.2 (flat tertiary)", kind: "Folded port", F: 8.1574, plate: 0.99362, design: "greg", nasmyth: true, a3: -3.90, backN: 0.07584, field: 3, refl: 3, focusLabel: "folded-port focus",
        secondary: "seven 1.05 m concave adaptive segments; a flat tertiary below the primary turns the beam to the side", fieldNote: "3′ unvignetted; the tertiary 3.9 m below the primary's vertex sends the focus 1.93 m off the axis (DERIVED)." },
    ] },
  // HET: data/telescopes/het.md (after the Wide Field Upgrade). A fixed spherical primary of 91 hexagons (1 m across the
  // flats, 11 mm gaps, flats at +/-y, five rings around a central one: 9.91 x 11.11 m), radius of curvature 26.164 m.
  // The 10 m pupil at the tracker moves across the array by R x the tracker's angle (+/-6 deg: +/-2.74 m; the slider
  // moves it along x); its 4.5 m central obstruction and two 0.29 m support bars (pyHETobs's approximation) move with
  // it. The Wide Field Corrector (four mirrors) is drawn as one thin lens of its power, 0.6 m before the primary's own
  // focus (schematic: the place and size are not the corrector's).
  { id: "het", group: "HET 10 m", name: "HET 10 m", D: 10.0, f1: 13.082, eps: 0.45, primarySub: "91 segments, 9.9 × 11.1 m, spherical",
    tracker: { R: 26.164, d: 10.0, range: 6, span: [-4.955, 4.955] },
    primaryNote: "A fixed spherical mirror of 91 hexagonal segments, 1 m across the flats, in an array 9.9 × 11.1 m; radius of curvature 26.164 m (f = 13.08 m). The telescope stays at 55° elevation: the tracker at the prime focus follows each star while the mirror stays put, so the 10 m pupil slides across the array.",
    pupil: { kind: "hex", D: 11.2, flat: 1.011, gap: 0.011, rings: 5, rings0: 0, rot: 30,
      vanes: [{ ang: 90, w: 0.29, full: true, x0: 1.445 }, { ang: 90, w: 0.29, full: true, x0: -1.445 }] },
    pupilNote: "The 10 m pupil over the array (pale: the rest of the mirror), with its 4.5 m central obstruction (the corrector and instrument package on the tracker) and two 0.29 m support bars (pyHETobs's approximation; the real shadows are more complex).",
    area: { value: 55.5, tol: 0.012, src: "DERIVED from the pyHETobs geometry with the tracker centered (data/telescopes/het.md)" },
    areaTrack: [[2, 49.5, 49.9], [4, 40.9, 42.1], [6, 32.8, 34.1]],
    foci: [
      { id: "pf", name: "Prime focus f/3.65 (Wide Field Corrector)", kind: "Prime focus", F: 3.65, plate: 5.651, design: "prime", field: 22, refl: 5,
        corrector: { d: 0.6, label: "Wide Field Corrector", sub: "four mirrors, drawn as one lens" },
        secondary: "none: the four-mirror Wide Field Corrector rides on the tracker", fieldNote: "22′ (18′ for science). The corrector is drawn as one lens of the same power; the lens's place and size are schematic." },
    ] },
  // Subaru: data/telescopes/subaru.md (Iye et al. 2004 Table 2: seven focus configurations). Primary 8.3 m (8.2 m
  // effective), f = 15 m. F is the focal length over the pupil of the same configuration: 8.2 m, except at the IR
  // Nasmyth focus, where the undersized IR secondary is the stop (7.95 m). The only measured pupil is the IR Nasmyth's
  // (SCExAO): obstruction 2.37 m, four 0.23 m vanes at +/-51.75 deg from points 0.661 m off the center; the same spider
  // holds every top unit, so the vanes are taken to be the same at every focus (INFERRED); the obstruction at the other
  // foci is NOT FOUND (drawn with the measured 2.37 m). The sources name the Nasmyth platforms only "optical" and
  // "infrared": drawn up and down. The Nasmyth foci's distance from the axis and the tertiary are NOT FOUND (schematic).
  // HSC's corrector is drawn as one thin lens of its power, 1 m before the primary's focus (schematic).
  { id: "subaru", group: "Subaru 8.2 m", name: "Subaru 8.2 m", D: 8.2, Dmirror: 8.3, f1: 15.0, eps: 0.289,
    primaryNote: "A thin ULE meniscus 8.3 m across (8.2 m effective) and 20 cm thick, shaped by 261 actuators; f = 15 m (f/1.83). Interchangeable top units: the prime-focus unit with HSC, or a secondary (optical or infrared) for the Cassegrain and Nasmyth foci.",
    pupil: { kind: "circle", D: 8.2, vanes: [
      { ang: 51.75, w: 0.23, x0: 0.661 }, { ang: -51.75, w: 0.23, x0: 0.661 }, { ang: 231.75, w: 0.23, x0: -0.661 }, { ang: 128.25, w: 0.23, x0: -0.661 }] },
    pupilNote: "Measured only at the infrared Nasmyth focus (the SCExAO pupil): a 2.37 m obstruction and four 0.23 m vanes that do not meet at the center. The other foci are drawn with the same obstruction and vanes (their own obstruction is not published).",
    foci: [
      { id: "pf", name: "Prime focus f/2.2 (HSC)", kind: "Prime focus", F: 2.2459, plate: 11.2, design: "prime", field: 90, refl: 1,
        corrector: { d: 1.0, label: "HSC wide-field corrector", sub: "drawn as one lens of its power" }, pfuLabel: "Hyper Suprime-Cam (HSC)",
        secondary: "none: the camera and its corrector sit at the prime focus", fieldNote: "1.5° across. The published F is 2.2 (2.25 on 8.2 m from the 18.4 m focal length); the corrector's place and size are schematic." },
      { id: "cass", name: "Cassegrain f/12.2", kind: "Cassegrain", F: 12.195, plate: 2.063, design: "cass", back: 0.36585, field: 6, refl: 2,
        secondary: "convex, 1.33 m (the optical secondary)", fieldNote: "6′; the focus 3.0 m behind the primary's vertex." },
      { id: "nsopt", name: "Optical Nasmyth f/12.5", kind: "Nasmyth", variant: "Optical", F: 12.4634, plate: 2.017, design: "cass", nasmyth: true, side: "up", field: 6, refl: 3,
        secondary: "the optical secondary (1.33 m); a flat tertiary", fieldNote: "6′ (with the image rotator: 3.5′, f/12.7, 6 reflections). Which platform is drawn on which side is a choice: the sources name the two platforms only optical and infrared." },
      { id: "nsir", name: "Infrared Nasmyth f/13.9", kind: "Nasmyth", variant: "Infrared", D: 7.95, F: 13.912, plate: 1.865, design: "cass", nasmyth: true, side: "down", eps: 0.298, field: 6, refl: 3, pupil: { D: 7.95 },
        secondary: "the infrared secondary (1.265 m): undersized, it is the stop, so the pupil is 7.95 m; a flat tertiary", fieldNote: "6′ (with the image rotator: 3.5′, f/13.6, 6 reflections). The pupil measured here: 7.92–7.95 m with a 2.37 m obstruction." },
    ] },
  // Yerkes 40-inch: data/telescopes/yerkes.md. An Alvan Clark doublet (crown in front), 40 in = 1.016 m clear,
  // f = 19.354 m at 50 F (Barnard 1917); unobstructed (a refractor: INFERRED, no source describes an obstruction).
  // color: Fox 1908 Table IV (the objective alone, plate 1): [wavelength A, distance from the best focus mm]; the blur
  // at the best focus (5732 A) is that distance times D / f (DERIVED).
  { id: "yerkes", group: "Yerkes 1.0 m", name: "Yerkes 40-inch", D: 1.016, F1: 19.049, eps: 0, refractor: true,
    primaryNote: "A two-element objective by Alvan Clark (crown in front, the glass discs by Mantois), 40 inches (1.016 m) clear; focal length 19.354 m at 50 °F (f/19.05), shorter by 17.5 mm for 45 °C of cooling. First used 21 May 1897; the largest refractor built for astronomy.",
    pupil: { kind: "circle", D: 1.016 },
    pupilNote: "A lens: nothing in the beam (no source describes an obstruction).",
    color: [[4102, 88.54], [4110, 88.01], [4227, 66.75], [4272, 60.92], [4308, 56.17], [4340, 51.34], [4383, 46.64], [4540, 32.56], [4710, 20.10], [4862, 12.60], [5184, 3.54], [5283, 2.05], [5490, 0.24], [5732, 0.00], [5893, 1.07], [6270, 5.38], [6800, 16.35]],
    foci: [
      { id: "focus", name: "Focus f/19 (visual objective)", kind: "Focus", F: 19.049, plate: 10.67, design: "refr", field: 45, refl: 0,
        secondary: "none: a doublet objective (4 refracting surfaces)", fieldNote: "The 20 × 25 cm plates covered ≈35′ × 45′ (unvignetted field not published). The lens is drawn ideal: the real one brings each color to a different focus (see the Image box)." },
    ] },
  // ELT (ESO's Extremely Large Telescope, under construction): data/telescopes/elt.md. 798 hexagonal segments, 1.45 m
  // across the corners on the mirror, 4 mm gaps: in the pupil a lattice of pitch 1.2274 m (DERIVED from ESO's
  // 19.5732 m circumscribed radius), rings 0-4 empty, and the segments whose centers lie within 18.963 m (rcut, DERIVED:
  // 798 segments, and 588 without rings 5-9, both ESO counts). The empty center is the obstruction (eps 0; drawEps 0.283,
  // the hole across the corners, for the drawing). Six spider arms (ESO), 0.53 m wide along the segment rows (third-party
  // pupil models; ESO gives no width). Nasmyth: 684.022 m, f/17.75 on ESO's nominal 38.542 m pupil (nominalD), f/17.47 on
  // the 39.146 m drawn; drawn as a three-mirror (Korsch) layout, the mirrors' places schematic.
  { id: "elt", group: "ELT 39 m", name: "ELT 39 m", D: 39.146, f1: 34.35, eps: 0, drawEps: 0.283, nominalD: 38.542, nominalDec: 2,
    primaryNote: "798 hexagonal segments, 1.45 m across the corners with 4 mm gaps, in six identical sectors of 133 around an empty center (no segment in the center or the four rings around the center); radius of curvature 68.7 m (f = 34.35 m, f/0.88 on the 39.1 m pupil). Under construction on Cerro Armazones.",
    pupil: { kind: "hex", D: 39.146, flat: 1.2274, gap: 0.004, rings: 17, rings0: 5, rot: 30, rcut: 18.963,
      vanes: [30, 90, 150, 210, 270, 330].map(ang => ({ ang, w: 0.53 })) },
    pupilNote: "Seen in ESO's primary-mirror frame (flat-topped segments): six spider arms along the rows of segments, 0.53 m wide (a third-party model; ESO publishes no width). The pupil's orientation on the sky is not published.",
    area: { value: 978, info: true, src: "ESO, ELT facts page (the lattice drawn here, with 0.53 m vanes: 991.5 m², DERIVED)" },
    segments: 798, segmentsArea: { value: 1041.13, tol: 0.002, src: "ESO's 798 segments on the lattice pitch, the gaps closed (data/telescopes/elt.md)" },
    foci: [
      { id: "nas", name: "Nasmyth f/17.75", kind: "Nasmyth", F: 17.474, plate: 0.30155, design: "korsch", nasmyth: true, field: 10, refl: 5,
        secondary: "convex, 4.25 m, 30.8 m above the primary; then a concave 4.0 m tertiary at the primary's vertex, the flat adaptive M4 (2.4 m) and the flat tip-tilt M5 (2.7 × 2.2 m)",
        where: "Nasmyth platforms A and B, on either side of the tube (the same focus)",
        fieldNote: "10′ unvignetted (a hole in M4 sets the limit); the focal surface is curved (radius 9.9 m), 27.2 m from M5 along the elevation axis. Drawn as a three-mirror (Korsch) layout: the focal length and plate scale are the ELT's; the tertiary (really at the primary's vertex) and the one fold flat (really M4 above the primary and M5 in the central tower) are schematic." },
    ] },
  // VISTA: data/telescopes/vista.md (Sutherland et al. 2015; VIRCAM/VISTA User Manual; 4MOST documents). A 4.10 m f/1
  // hyperboloid primary (R 8094.2 mm, 1.20 m hole) and a 1.24 m convex secondary 2725.7 mm above the primary; the undersized
  // secondary is the stop, so the on-axis entrance pupil is a 3.70 m circle on the primary (D; Dmirror 4.10). eps: the
  // 1.63 m baffle around the secondary (VIRCAM era; 4MOST's baffle not published). Spider: four 36 mm legs in two pairs
  // meeting the ~1.4 m central barrel at opposite points on the altitude axis (x0 +/-0.70 m); the angles (+/-60 deg) are a
  // rough reading of photographs (INFERRED). One Cassegrain focus with each instrument's own corrector, not drawn
  // (imager.js draws a corrector only at prime focus): 4MOST (current) 59.4 um/arcsec, the 4MOST focus placed at VIRCAM's
  // 1.1726 m behind the vertex (not published); VIRCAM (2009-2023) 12.072 m. (The bare test focus of the research file is
  // left out: a commissioning setup.)
  { id: "vista", group: "VISTA 4.1 m", name: "VISTA 4.1 m", D: 3.70, Dmirror: 4.10, f1: 4.0471, eps: 0.4405, hole: 1.20,
  primaryNote: "A Zerodur meniscus 4.10 m across (3.96 m clear) and 17 cm thick with a 1.20 m central hole: a hyperboloid with radius of curvature 8.094 m (f = 4.05 m, f/0.99 on 4.1 m), the most strongly curved mirror of this size. The 1.24 m secondary is undersized and is the stop, so each point of the field uses a 3.70 m circle of the primary.",
  pupil: { kind: "circle", D: 3.70, vanes: [
    { ang: 60, w: 0.036, x0: 0.70 }, { ang: -60, w: 0.036, x0: 0.70 }, { ang: 120, w: 0.036, x0: -0.70 }, { ang: 240, w: 0.036, x0: -0.70 }] },
  pupilNote: "On the axis: the 3.70 m circle of the primary that the undersized secondary passes, less the 1.63 m baffle around the secondary and four 36 mm spider legs in two pairs, which leave the central barrel at opposite points on the altitude axis (horizontal here). The legs' angles (±60°) are a rough reading of photographs. Off the axis the 3.70 m circle shifts across the primary by up to 0.12 m.",
  area: { value: 8.452, info: true, src: "4MOST exposure-time calculator (qmostetc 2.6.1), hard-coded; the pupil drawn here: 8.49 m² (DERIVED, data/telescopes/vista.md)" },
  foci: [
    { id: "wfc", name: "Cassegrain f/3.3 (4MOST corrector)", kind: "Cassegrain", variant: "4MOST", F: 3.3114, plate: 16.835, design: "cass", back: 0.31692, field: 156, refl: 2,
      secondary: "convex hyperboloid, 1.24 m (the stop), 2.73 m above the primary; then 4MOST's Wide Field Corrector, four lens groups with two counter-rotating ADC prisms (not drawn)",
      where: "behind the primary, on the Cassegrain rotator: the 2436-fiber positioner on a curved focal surface 535 mm across",
      fieldNote: "2.6° nearly unvignetted (ESO's pages give 2.5°); the fibers cover a hexagon of 4.1–4.2 deg². F and the plate scale come from the published 59.4 µm per arcsecond (12.25 m, f/3.31 on the 3.70 m pupil). The corrector is not drawn, and the focus is placed where VIRCAM's was (1.17 m behind the primary's vertex): 4MOST's is not published." },
    { id: "vircam", name: "Cassegrain f/3.25 (VIRCAM, 2009–2023)", kind: "Cassegrain", variant: "VIRCAM (2009–2023)", F: 3.2627, plate: 17.0862, design: "cass", back: 0.31692, field: 99, refl: 2,
      secondary: "convex hyperboloid, 1.24 m (the stop), 2.73 m above the primary; then the camera's vacuum window and three fused-silica corrector lenses (not drawn)",
      where: "1.17 m behind the primary's vertex, inside the VIRCAM cryostat on the Cassegrain rotator",
      fieldNote: "1.65° (a flat field 350 mm across); the telescope is unvignetted to 2°. The corrector lenses are not drawn: without them the drawing puts the secondary 2.737 m above the primary (2.726 m in the telescope) for the same 12.072 m focal length." },
  ] },
  // MMT: data/telescopes/mmt.md (TR35, the 1999 optical specification: a paraboloid of R = 16256 mm, f/1.25, 6.502 m, with
  // three convex hyperboloidal secondaries, each giving a separate Cassegrain focus behind the primary). The pupil: four 0.12 m
  // vanes from the center at 45 deg (the MMTO wavefront-sensor code mmtwfs; orientation relative to the elevation axis
  // not published), the same for all three secondaries (INFERRED). The obstruction per focus: the f/5 mirror (1.715 m; the
  // baffles unmeasured), the f/9 mirror (1.022 m), and at f/15 the primary's 0.898 m hole: the undersized adaptive
  // secondary is the stop there, a 6.37 m pupil. The f/5 corrector is not drawn (the corrected foci put the secondary
  // 49-64 mm high).
  { id: "mmt", group: "MMT 6.5 m", name: "MMT 6.5 m", D: 6.502, f1: 8.128, eps: 0.264, hole: 0.898,
    primaryNote: "A spin-cast borosilicate honeycomb paraboloid from the Steward Observatory Mirror Lab, 6.5 m across (6502 mm clear), radius of curvature 16.256 m (f = 8.128 m, f/1.25), with a 0.9 m central hole. Three interchangeable secondaries, each giving its own Cassegrain focus: f/5 (1.7 m), f/9 (1.0 m) and the f/15 adaptive secondary (0.64 m).",
    pupil: { kind: "circle", D: 6.502, vanes: [
      { ang: 45, w: 0.12 }, { ang: 135, w: 0.12 }, { ang: 225, w: 0.12 }, { ang: 315, w: 0.12 }] },
    pupilNote: "Four 0.12 m vanes from the center, at 45° to the axes (the observatory's own wavefront-sensor model; the vanes' orientation relative to the elevation axis is not published). The central obstruction changes with the secondary: the 1.7 m f/5 mirror, the 1.0 m f/9 mirror, or at f/15 the primary's 0.9 m hole.",
    area: { value: 29.75, info: true, src: "DERIVED at f/5 from the 1.715 m secondary and four 0.12 m vanes (no official value; the f/5 baffles are not included): data/telescopes/mmt.md" },
    foci: [
      { id: "f5s", name: "f/5 Cassegrain, spectroscopic corrector (ADC)", kind: "f/5 wide field", variant: "Spectroscopic corrector", F: 5.298, plate: 5.988, design: "cass", back: 0.27606, field: 60, refl: 2,
        secondary: "convex hyperboloid, 1.7 m (Zerodur), 6.18 m above the primary; then the wide-field corrector: three fused-silica lenses and counter-rotating ADC prisms", where: "1.795 m behind the primary's vertex, on a curved telecentric focal surface 0.6 m across (Binospec; formerly Hectospec and Hectochelle)",
        fieldNote: "1° corrected, with atmospheric dispersion compensation from 1 to 2 airmasses. F comes from the published 0.167 mm per arcsecond. The corrector is not drawn, so the drawing places the secondary 6.23 m above the primary (6.18 m in the telescope)." },
      { id: "f5i", name: "f/5 Cassegrain, imaging corrector", kind: "f/5 wide field", variant: "Imaging corrector", F: 5.361, plate: 5.917, design: "cass", back: 0.27877, field: 30, refl: 2,
        secondary: "convex hyperboloid, 1.7 m (Zerodur), 6.18 m above the primary; then the wide-field corrector in its imaging form (no ADC prisms)", where: "1.813 m behind the primary's vertex, on a flat focal surface (Megacam; not available in 2026)",
        fieldNote: "0.5° corrected on a flat focal surface (Megacam: 35′). F comes from the published 0.169 mm per arcsecond. The corrector is not drawn, so the drawing places the secondary 6.25 m above the primary (6.18 m in the telescope)." },
      { id: "f5b", name: "f/5 Cassegrain, bare (MMIRS)", kind: "f/5 wide field", variant: "No corrector (MMIRS)", F: 5.146, plate: 6.164, design: "cass", back: 0.28448, field: 14, refl: 2,
        secondary: "convex hyperboloid, 1.7 m (Zerodur), 6.18 m above the primary; no telescope corrector", where: "1.850 m behind the primary's vertex",
        fieldNote: "Bare, the focus is sharp only near the axis (0.5″ rms over 5′); MMIRS brings its own CaF₂ doublet corrector (f/5.2 over 14′); that MMIRS uses the bare focus is inferred, not stated by a source. F and the plate scale are paraxial values from the 1999 prescription (quoted as f/5.16, 0.162 mm per arcsecond)." },
      { id: "f9", name: "f/9 Cassegrain", kind: "f/9", F: 9.0, plate: 3.525, design: "cass", back: 0.27345, eps: 0.157, field: 12, refl: 2,
        secondary: "convex hyperboloid, 1.02 m (Hextek lightweighted borosilicate), 6.92 m above the primary", where: "1.778 m behind the primary's vertex, below the f/9 top box (Blue and Red Channel spectrographs, SPOL)",
        fieldNote: "12′ unvignetted (13′ in the observatory's description). The obstruction drawn is the 1.02 m mirror; the f/9 baffle is not published." },
      { id: "f15", name: "f/15 adaptive secondary", kind: "f/15 adaptive", D: 6.37, F: 15.0, plate: 2.159, design: "cass", back: 0.35887, eps: 0.141, field: 5, refl: 2, pupil: { D: 6.37 },
        secondary: "the adaptive secondary: a convex Zerodur shell 0.64 m across and 1.9 mm thick on 336 actuators, 7.31 m above the primary; undersized, so the secondary is the stop (6.37 m on the primary)", where: "2.286 m behind the primary's vertex (MAPS, ARIES, MMTPol, MIRAC-5)",
        fieldNote: "5′ at most (6′ unvignetted in the 2003 interface document). The adaptive secondary is the stop: the pupil is 6.37 m, and the obstruction is the primary's 0.9 m hole, which hides the 0.64 m secondary." },
    ] },
  // Blanco: data/telescopes/blanco.md (the research file's proposed entry; kind and variant added for the focus buttons).
  {"id": "blanco", "group": "Blanco 4 m", "name": "Blanco 4 m", "D": 3.934, "Dmirror": 4.0229, "f1": 10.6558, "eps": 0.4197, "hole": 1.3178, "primaryNote": "A Cer-Vit hyperboloid (conic −1.098) 4.02 m across with a 1.32 m central hole; radius of curvature 21.31 m (f = 10.66 m, f/2.7). A seal at the edge leaves a 3.934 m clear aperture. Commissioned in 1974 on Cerro Tololo, a near twin of the Mayall 4 m.", "pupil": {"kind": "circle", "D": 3.934, "vanes": [{"ang": 45, "w": 0.068}, {"ang": 135, "w": 0.068}, {"ang": 225, "w": 0.135}, {"ang": 315, "w": 0.068}], "blocks": [[[0.8786, -0.459], [0.8786, -0.3937], [0.902, -0.3556], [0.932, -0.3048], [0.955, -0.254], [0.975, -0.2032], [0.991, -0.1524], [1.001, -0.1016], [1.006, -0.0508], [1.0119, 0.0], [1.006, 0.0508], [1.001, 0.1016], [0.991, 0.1524], [0.975, 0.2032], [0.955, 0.254], [0.932, 0.3048], [0.902, 0.3556], [0.8786, 0.3937], [0.8786, 0.459], [-0.8786, 0.459], [-0.8786, 0.3937], [-0.902, 0.3556], [-0.932, 0.3048], [-0.955, 0.254], [-0.975, 0.2032], [-0.991, 0.1524], [-1.001, 0.1016], [-1.006, 0.0508], [-1.0119, 0.0], [-1.006, -0.0508], [-1.001, -0.1016], [-0.991, -0.1524], [-0.975, -0.2032], [-0.955, -0.254], [-0.932, -0.3048], [-0.902, -0.3556], [-0.8786, -0.3937], [-0.8786, -0.459]]]}, "pupilNote": "The pupil since DECam, in the frame of the DES pupil model (Piff): the 1.65 m shadow of the prime-focus cage, the filter-changer housing that sticks out on two sides to 1.01 m from the center, and the four fins that hold the cage, 68 mm wide (one 135 mm). The pupil's orientation on the sky is not published.", "area": {"value": 10.014, "info": true, "src": "NOIRLab, Blanco Basic Optical Parameters: the 3.934 m aperture less the 1651 mm obscuration (the fins and the filter-changer housing not included; the pupil drawn here: 9.31 m², DERIVED)"}, "foci": [{"id": "pf", "name": "Prime focus f/3 (DECam)", "kind": "Prime focus", "variant": "DECam", "F": 2.9833, "plate": 17.575, "design": "prime", "field": 132, "refl": 1, "corrector": {"d": 1.237, "label": "DECam corrector", "sub": "five fused-silica lenses, drawn as one lens of their power"}, "pfuLabel": "Dark Energy Camera (DECam)", "pfuSub": "62 science CCDs over a 2.2° field", "secondary": "none: the camera and its five-lens corrector sit at the prime focus, on a hexapod in the prime-focus cage", "where": "the prime-focus cage: the focal plane 10.78 m above the primary's vertex", "fieldNote": "2.2° across (3 deg²). F from the 17.575″/mm plate scale (f/3.0 published). The lens is placed so that the drawn focus falls 125 mm past the primary's own focus, as the real focal plane does; the lens's size is schematic (the real corrector runs from C1, 980 mm across and 1.78 m before the primary's focus, to the focal plane)."}, {"id": "pf287", "name": "Prime focus f/2.87 (Mosaic II, historical)", "kind": "Prime focus", "variant": "f/2.87 (Mosaic II, historical)", "F": 2.9129, "plate": 18.0, "design": "prime", "field": 36, "refl": 1, "pupil": {"blocks": []}, "corrector": {"d": 1.0, "label": "triplet corrector and ADC", "sub": "drawn as one lens of their power"}, "pfuLabel": "Mosaic II imager", "pfuSub": "eight 2k × 4k CCDs, 36′ × 36′", "secondary": "none: a three-lens corrector and an atmospheric dispersion corrector at the prime focus", "where": "the earlier prime-focus cage (until 2012)", "fieldNote": "36′ × 36′ (Mosaic II, 0.27″ pixels); the corrected field is not published. F from the 18.0″/mm plate scale (f/2.87 on the nominal 4 m). The lens's place and size are schematic. Drawn without the DECam filter-changer housing."}, {"id": "cass8", "name": "Cassegrain f/8", "kind": "Cassegrain", "variant": "f/8", "F": 7.984, "plate": 6.567, "design": "cass", "back": 0.4639, "field": 40, "refl": 2, "secondary": "convex hyperboloid, 1.295 m clear (conic −5.26), 7.494 m in front of the primary, on the front of the prime-focus cage", "where": "the Cassegrain cage with its rotator and offset guider, 1.82 m behind the primary's vertex", "pupilNote": "The pupil since DECam: the camera stays in the cage behind the f/8 secondary, so the DECam filter-changer housing is assumed to shadow this focus too (not published).", "fieldNote": "40′ at the Hydra fiber plate; COSMOS uses 10′. F and the focus position are DERIVED from the published mirrors (f/7.8 on the 4.02 m mirror; 6.56″/mm published)."}, {"id": "cass14", "name": "Cassegrain f/14.5 (retired)", "kind": "Cassegrain", "variant": "f/14.5 (retired)", "F": 14.724, "plate": 3.561, "design": "cass", "back": 0.62, "field": null, "refl": 2, "pupil": {"blocks": []}, "secondary": "convex hyperboloid (radius of curvature 4.99 m, conic −3.04), 8.621 m in front of the primary; its size is not published", "where": "behind the primary, 2.44 m from the vertex", "fieldNote": "Retired. F, the plate scale and the focus position are DERIVED from the published prescription (f/14.4 on the 4.02 m mirror); the obstruction and fins of this configuration are not published (those of f/8 drawn)."}, {"id": "cass30", "name": "Cassegrain f/30 (retired)", "kind": "Cassegrain", "variant": "f/30 (retired)", "F": 32.207, "plate": 1.628, "design": "cass", "back": 0.4655, "field": null, "refl": 2, "pupil": {"blocks": []}, "secondary": "convex hyperboloid (radius of curvature 2.12 m, conic −2.81), 9.687 m in front of the primary; its size is not published", "where": "behind the primary, 1.83 m from the vertex", "fieldNote": "Retired. F is DERIVED from the published prescription: f/31.5 on the 4.02 m mirror, not the nominal f/30 (an undersized secondary acting as the stop would explain the name, but its size is not published)."}]},
  // SDSS: data/telescopes/sdss.md (the research file's proposed entry; kind and variant added for the focus buttons).
  {"id": "sdss", "group": "Sloan 2.5 m", "name": "Sloan 2.5 m (SDSS)", "D": 2.517, "f1": 5.6249, "eps": 0.5103, "hole": 1.17, "nominalD": 2.5, "primaryNote": "A Hextek borosilicate honeycomb mirror, nearly hyperbolic (conic −1.285), radius of curvature 11.25 m (f = 5.62 m, f/2.25 on the nominal 2.5 m), with a 1.17 m central hole; a 2.52 m stop just above the mirror masks the turned edge of the mirror. A modified Ritchey-Chrétien with a 1.08 m secondary only 3.6 m away and two transmitting correctors gives a 3° field at f/5. First light May 1998 at Apache Point Observatory, New Mexico.", "pupil": {"kind": "circle", "D": 2.517}, "pupilNote": "On axis the inner edge is the 1.285 m tip of the secondary's baffle (26.0% of the area); a cone hung between the mirrors blocks another 2.6% (28.6% in all; not drawn). The secondary's support vanes run along the diagonals of the square secondary frame, but their number and width are not published, so none are drawn.", "area": {"value": 3.553, "info": true, "src": "DERIVED: the 2.517 m pupil less the 28.6% obstruction on axis (Siegmund et al., SDSS technical note 19980215); the vanes and wires not included"}, "foci": [{"id": "fps", "name": "Cassegrain f/5 (SDSS-V robots)", "kind": "Cassegrain", "variant": "SDSS-V robotic fibers", "F": 4.9561, "plate": 16.534, "design": "cass", "back": 0.3085, "field": 180, "refl": 2, "secondary": "convex hyperboloid, 1.08 m (conic −11.98), 3.645 m in front of the primary; then the three-lens SDSS-V corrector (fused silica, 730 to 680 mm), the first lens just above the primary's vertex", "where": "the Cassegrain rotator: 500 robotic fiber positioners for BOSS and APOGEE on a focal surface of radius 9.20 m, 0.776 m behind the primary's vertex", "fieldNote": "3° across. F from the 217.7358 mm/° plate scale of the SDSS-V software (60.48 µm/″); 2″ fibers. In use since 2021. The three corrector lenses are not drawn."}, {"id": "plug", "name": "Cassegrain f/5 (plug plates, historical)", "kind": "Cassegrain", "variant": "Plug plates (to 2020)", "F": 4.954, "plate": 16.542, "design": "cass", "back": 0.3006, "field": 180, "refl": 2, "secondary": "convex hyperboloid, 1.08 m, 3.644 m in front of the primary; the Gascoigne corrector at the primary's vertex and a thin aspheric spectroscopic corrector 87 mm before the focus", "where": "the Cassegrain rotator: drilled plug plates bent to the focal surface, 0.757 m behind the primary's vertex", "fieldNote": "3° across (1.5° at 327.4 mm from the center). F from the design image height at 30′; 3″ fibers for SDSS, 2″ for BOSS and APOGEE. The two correctors are not drawn."}, {"id": "img", "name": "Cassegrain f/5 (imaging camera, historical)", "kind": "Cassegrain", "variant": "Imaging camera", "F": 4.9376, "plate": 16.596, "design": "cass", "back": 0.3017, "field": 180, "refl": 2, "secondary": "convex hyperboloid, 1.08 m, 3.646 m in front of the primary; the Gascoigne corrector and the camera's thick aspheric corrector, which carries the filters", "where": "the Cassegrain rotator: the 54-CCD drift-scan camera, the focus 0.759 m behind the primary's vertex", "fieldNote": "3° across (2.72° photometric, 3.02° astrometric). F from the 12.43 m focal length of the 1995 design (60.4 µm/″ published). Used in the early years of SDSS. The two correctors are not drawn."}]},
  // Mayall: data/telescopes/mayall.md (the research file's proposed entry).
  {"id": "mayall", "group": "Mayall 4 m", "name": "Mayall 4 m", "D": 3.797, "Dmirror": 4.0116, "f1": 10.659, "eps": 0.4741, "hole": 1.324, "primaryNote": "A fused-quartz hyperboloid (conic −1.098, the Ritchey–Chrétien primary) 4.01 m across and 61 cm thick, with a 1.324 m central hole; radius of curvature 21.318 m (f = 10.66 m, f/2.8 on the 3.797 m mask). Masks set the pupil at 3.797 m outside and 1.346 m inside. Since 2019 the telescope carries the DESI corrector and fiber focal plane at the prime focus; the Cassegrain foci were retired in 2018.", "pupil": {"kind": "circle", "D": 3.797, "vanes": [{"ang": 51.25, "w": 0.03, "x0": 0.7505, "y0": 0.4967}, {"ang": 128.75, "w": 0.03, "x0": -0.7505, "y0": 0.4967}, {"ang": 231.25, "w": 0.03, "x0": -0.7505, "y0": -0.4967}, {"ang": 308.75, "w": 0.03, "x0": 0.7505, "y0": -0.4967}]}, "pupilNote": "DESI's top end, seen from the sky with north up and east right: the 1.8 m cage and four sets of three vanes, the three of each set one above another, so each set casts one shadow. The vanes leave the cage 11.5° from the diagonals, toward the east–west line, so that the cage resists roll. Each vane is 19 mm thick; drawn 30 mm wide, the width desimodel uses for the published 8.658 m².", "area": {"value": 8.658, "src": "KPNO Mayall parameters; DESI Collaboration 2022: 8.658 m² with DESI (the 3.797 m aperture less the 1.8 m cage and four 30 mm vanes, as desimodel computes the area); 9.182 m² before DESI (1.651 m cage, vanes not subtracted)"}, "foci": [{"id": "pf", "name": "Prime focus f/3.9 (DESI corrector)", "kind": "Prime focus", "variant": "DESI", "F": 3.666, "plate": 14.819, "design": "prime", "field": 192, "refl": 1, "corrector": {"d": 1.49, "label": "DESI corrector", "sub": "six lenses (two form the ADC), drawn as one lens of their power"}, "pfuLabel": "DESI focal plane", "pfuSub": "5,020 robotic fiber positioners", "secondary": "none: the six-lens corrector and the fiber focal plane sit in the prime-focus cage", "fieldNote": "3.2° across, on a convex focal surface 812 mm across (radius 4.98 m). f/3.68 on axis and 3.86 averaged over the field (13.92 m focal length on axis: f/3.67 on the 3.797 m pupil). The corrector (C1 1.14 m across, 8.69 m above the primary, 2.03 m long) is drawn as one lens 1.49 m before the primary's focus, which puts the focus at the real focal surface, 11.12 m from the primary."}, {"id": "mosaic", "name": "Prime focus f/3.1 (Mosaic corrector, historical)", "kind": "Prime focus", "variant": "Mosaic (historical)", "F": 3.1166, "plate": 17.43, "design": "prime", "field": 51, "eps": 0.4348, "refl": 1, "pupil": {"vanes": [{"ang": 51.25, "w": 0.03, "x0": 0.7013, "y0": 0.4354}, {"ang": 128.75, "w": 0.03, "x0": -0.7013, "y0": 0.4354}, {"ang": 231.25, "w": 0.03, "x0": -0.7013, "y0": -0.4354}, {"ang": 308.75, "w": 0.03, "x0": 0.7013, "y0": -0.4354}]}, "pupilNote": "Before DESI the prime-focus cage was 1.651 m across. The spider of that era is not published: DESI's four vanes are drawn, extended inward to the smaller cage.", "corrector": {"d": 0.72, "label": "Mosaic corrector (4mPFC)", "sub": "four fused-silica lenses and a Risley-prism ADC, drawn as one lens of their power"}, "pfuLabel": "Mosaic CCD camera", "pfuSub": "8k × 8k, 36′ × 36′", "secondary": "none: the corrector and the Mosaic camera sat in the 1.651 m prime-focus cage", "fieldNote": "36′ × 36′ (51′ diagonal), flat and unvignetted; 17.43″/mm at the center and 16.39″/mm at the corner (f/3.14 on the 3.76 m clear aperture of the design, f/3.12 on 3.797 m). The corrector is drawn as one lens 0.72 m before the primary's focus, which puts the focus at the design's focal surface, 10.74 m from the primary. Used until February 2018 (Mosaic-3)."}, {"id": "cass8", "name": "Cassegrain f/7.8 (Ritchey–Chrétien, historical)", "kind": "Cassegrain", "variant": "f/7.8 (historical)", "F": 8.2325, "plate": 6.5986, "design": "cass", "back": 0.4778, "field": null, "eps": 0.4348, "refl": 2, "pupil": {"vanes": [{"ang": 51.25, "w": 0.03, "x0": 0.7013, "y0": 0.4354}, {"ang": 128.75, "w": 0.03, "x0": -0.7013, "y0": 0.4354}, {"ang": 231.25, "w": 0.03, "x0": -0.7013, "y0": -0.4354}, {"ang": 308.75, "w": 0.03, "x0": 0.7013, "y0": -0.4354}]}, "pupilNote": "Before DESI the prime-focus cage was 1.651 m across. The spider of that era is not published: DESI's four vanes are drawn, extended inward to the smaller cage.", "secondary": "convex hyperboloid (conic −5.295), 1.19 m across, 7.492 m from the primary, carried in the prime-focus cage on the flip ring", "fieldNote": "Named f/7.8 for the 4.0 m mirror (31.26 m focal length; f/8.23 on the 3.797 m pupil). The focus lies 1.814 m behind the primary's vertex, 152 mm past the instrument rotator. The field is not published (KPNO's optical model traces 5′; the Risley-prism ADC passes 298″). Retired in 2018, when DESI replaced the flip ring."}, {"id": "cass15", "name": "Cassegrain f/15 (infrared, historical)", "kind": "Cassegrain", "variant": "f/15 infrared (historical)", "F": 15.054, "plate": 3.6085, "design": "cass", "back": 0.5953, "field": null, "eps": 0.4348, "refl": 2, "pupil": {"vanes": [{"ang": 51.25, "w": 0.03, "x0": 0.7013, "y0": 0.4354}, {"ang": 128.75, "w": 0.03, "x0": -0.7013, "y0": 0.4354}, {"ang": 231.25, "w": 0.03, "x0": -0.7013, "y0": -0.4354}, {"ang": 308.75, "w": 0.03, "x0": 0.7013, "y0": -0.4354}]}, "pupilNote": "Before DESI the prime-focus cage was 1.651 m across. The spider of that era is not published: DESI's four vanes are drawn, extended inward to the smaller cage.", "secondary": "convex hyperboloid (conic −3.090), 0.743 m across, 8.635 m from the primary (the flip-in infrared secondary)", "fieldNote": "57.16 m focal length (f/15.05 on the 3.797 m pupil). In KPNO's optical model the 0.743 m secondary is the stop, with an entrance pupil 3.883 m across, larger than the 3.797 m mask. The focus lies 2.26 m behind the primary's vertex, 599 mm past the instrument rotator. The field is not published (the model traces 5′). Retired in 2018."}]},
  // Rubin: data/telescopes/rubin.md (the research file's proposed entry).
  {"id": "rubin", "group": "Rubin 8.4 m", "name": "Rubin (Simonyi) 8.4 m", "D": 8.36, "Dmirror": 8.4, "f1": 9.9175, "eps": 0.612, "primaryNote": "M1 and M3 share one 8.4 m monolith of Ohara E6 glass. M1 is the outer annulus, 8.36 m clear outside and 5.12 m inside, with a radius of curvature of 19.835 m (f = 9.92 m, f/1.19); the 5.0 m M3 fills the center (radius of curvature 8.34 m), with the M3 vertex 0.23 m below M1's. A hole through the center of M3 (1.06 m across in a 2006 drawing) holds alignment equipment.", "pupil": {"kind": "circle", "D": 8.36, "vanes": [{"ang": 135, "w": 0.05, "full": true, "x0": -0.28284, "y0": -0.28284}, {"ang": 45, "w": 0.05, "full": true, "x0": 0.28284, "y0": -0.28284}, {"ang": 135, "w": 0.05, "full": true, "x0": 0.28284, "y0": 0.28284}, {"ang": 45, "w": 0.05, "full": true, "x0": -0.28284, "y0": 0.28284}]}, "pupilNote": "An annulus 8.36 m across with a 5.12 m hole (M3 fills the center of the glass), crossed by eight 50 mm vanes in four parallel pairs 0.8 m apart, which hold M2 and the camera (imSim's model; the Science Book puts the vanes' area at ~0.7 m²). The orientation relative to the elevation axis is not published; the camera rotates between exposures, so the spikes turn on the sky.", "area": {"value": 33.68, "info": true, "src": "DERIVED: the 8.36/5.116 m annulus (34.33 m²) less eight 50 mm vane segments (0.65 m²; the Science Book's ~0.7 m²); the Science Book quotes 35 m² on axis"}, "foci": [{"id": "cam", "name": "LSSTCam focus f/1.23 (three mirrors)", "kind": "Camera focus", "F": 1.2333, "plate": 20.0059, "design": "pb", "field": 210, "refl": 3, "secondary": "convex 3.4 m with a 1.8 m central opening for the camera, 6.16 m above M1's vertex; then the concave 5.0 m M3 at the center of the primary's glass", "fieldNote": "3.5° across (9.6 deg²) on a flat 64 cm focal plane, behind three fused-silica lenses (L1 1.55 m) and a filter, not drawn. Drawn as the explorer's Paul–Baker layout: the focal length and plate scale are Rubin's and the M1–M2 spacing matches (6.15 m drawn, 6.16 m real); the real M3 vertex lies 0.23 m behind M1's vertex (drawn 0.17 m in front), and the real focal plane lies 4.43 m above M1's vertex (drawn 5.23 m)."}]},
  // Oschin 48-inch Schmidt (Palomar): data/telescopes/oschin.md (Harrington 1952; Reid et al. 1991; Smith et al. 2014;
  // Dekany et al. 2016, 2020; Bellm et al. 2019; Palomar's pages). A Schmidt: the stop is the corrector at the spherical
  // mirror's center of curvature (6.12 m), the focus halfway, inside the tube. D: ZTF's 1244.6 mm entrance pupil (the plate
  // foci: 49.5 in = 1.2573 m); Dmirror 72 in; f1 = R/2. ZTF pupil (seen from the mirror, CCD rows along x = east-west): the
  // camera as an octagon (the 483 x 442 mm window with a 19.6 mm border: the published 20.2%) and three radial vanes at
  // 90/210/330 deg, 27.3 mm wide (the published 2.3%; angles from Smith et al. 2014 Fig. 3 and ZTF's six spikes; whether
  // the single vane points north or south is not known). drawEps 0.4494 = the camera's area-equivalent circle, for the
  // drawing. Plate foci: the plateholder as the 14-inch plate (a lower bound; drawEps 0.3191) and four flat vanes along
  // north-south and east-west (the POSS spikes), 20 mm wide (INFERRED). field: the unvignetted field (5.4 deg; ZTF 5.45
  // deg DERIVED), so the drawn mirror (1.86-1.87 m) matches the real 1.83 m.
  { id: "oschin", group: "Oschin Schmidt 1.2 m", name: "Oschin 48-inch Schmidt", D: 1.2446, Dmirror: 1.8288, f1: 3.062, eps: 0, drawEps: 0.4494,
    primaryNote: "A spherical Pyrex mirror, aluminized, 72 inches (1.83 m) across with a 6.12 m radius of curvature (f = 3.06 m). The stop is the corrector plate 6.12 m in front, at the mirror's center of curvature; the mirror is larger than the stop so that the beams of stars up to 2.7° off the axis fall wholly on the mirror. Completed in 1948.",
    pupil: { kind: "circle", D: 1.2446,
      vanes: [{ ang: 90, w: 0.0273 }, { ang: 210, w: 0.0273 }, { ang: 330, w: 0.0273 }],
      blocks: [[[0.2611, 0.1877], [0.2082, 0.2406], [-0.2082, 0.2406], [-0.2611, 0.1877], [-0.2611, -0.1877], [-0.2082, -0.2406], [0.2082, -0.2406], [0.2611, -0.1877]]] },
    pupilNote: "The ZTF era, seen from the mirror with the CCD rows horizontal (east–west): the 1.245 m stop less the camera's shadow and three 27 mm spider vanes. The camera is drawn as the octagonal cryostat window (483 × 442 mm) with a 20 mm border, the size that blocks the published 20.2% of the pupil; the vane width blocks the published 2.3%. One vane runs north–south; whether toward north or south is not published.",
    area: { value: 0.944, info: true, src: "DERIVED from Dekany et al. 2020 (22.4% of the 1244.6 mm pupil obscured on axis); the drawn camera and vanes were sized to the published fractions (data/telescopes/oschin.md)" },
    foci: [
      { id: "ztf", name: "Prime focus f/2.46 (ZTF camera, 2017–)", kind: "Prime focus", variant: "ZTF (2017–)", F: 2.46, plate: 67.33, design: "schmidt", field: 327, refl: 1,
        pfuLabel: "ZTF camera", pfuSub: "the cryostat in the beam: 20% of the pupil",
        secondary: "none (one mirror): at the stop, the 1985 achromatic doublet and the ZTF trim plate, an air-spaced triplet drawn as one plate of no power; at the focus, a filter, the cryostat window and a field flattener over each CCD (not drawn)",
        where: "inside the tube, halfway between the corrector and the mirror, facing the mirror: the cryostat on a hexapod and a three-vane spider",
        fieldNote: "The mosaic covers 7.32° × 7.50° on the sky (47.7 deg² of silicon); drawn is the 5.45° over which the whole beam stays on the mirror (derived), and the mosaic's corners lose up to 30% of the light. The focal surface is a sphere of 3.06 m radius, drawn flat: the cryostat window flattens the curvature to a 7 m radius, and a field-flattener lens over each CCD and a faceted cold plate remove the rest." },
      { id: "poss2", name: "Prime focus f/2.44 (POSS-II plates, 1985–2000)", kind: "Prime focus", variant: "POSS-II (1985–2000)", D: 1.2573, F: 2.4417, plate: 67.19, design: "schmidt", field: 324, eps: 0, drawEps: 0.3191, refl: 1,
        pupil: { D: 1.2573, vanes: [{ ang: 0, w: 0.02, full: true }, { ang: 90, w: 0.02, full: true }], blocks: [[[0.1778, 0.1778], [-0.1778, 0.1778], [-0.1778, -0.1778], [0.1778, -0.1778]]] },
        pupilNote: "The photographic era: the 1.257 m (49.5-inch) clear aperture of the corrector less the plateholder at the center of the tube and four flat vanes along north–south and east–west (the directions of the plates' diffraction spikes). Neither the holder's size nor the vanes' width is published: the holder is drawn as the 14-inch plate (a lower bound) and the vanes 20 mm wide (a rough reading of a photograph).",
        pfuLabel: "plateholder", pfuSub: "a 14-inch plate on a curved mandrel",
        secondary: "none (one mirror): at the stop, the 50-inch achromatic doublet of 1985 (Schott LLF6 and O'Hara BK7W, by Grubb Parsons), drawn as one plate; the filter sits in the plateholder (not drawn)",
        where: "inside the tube, halfway between the corrector and the mirror, facing the mirror: the plateholder on a four-vane focus hub",
        fieldNote: "The 14-inch plates cover 6.6° × 6.6°; drawn is the 5.4° unvignetted field, and the plate corners lose 0.1–0.2 mag. The achromatic doublet gives images under 0.5″ over 6.5° from 3900 to 9000 Å. The 1 mm glass plates were held by vacuum on mandrels figured to the spherical focal surface (radius 3.07 m), drawn flat." },
      { id: "poss1", name: "Prime focus f/2.44 (POSS-I plates, 1949–1958)", kind: "Prime focus", variant: "POSS-I (1949–1958)", D: 1.2573, F: 2.4417, plate: 67.187, design: "schmidt", field: 324, eps: 0, drawEps: 0.3191, refl: 1,
        pupil: { D: 1.2573, vanes: [{ ang: 0, w: 0.02, full: true }, { ang: 90, w: 0.02, full: true }], blocks: [[[0.1778, 0.1778], [-0.1778, 0.1778], [-0.1778, -0.1778], [0.1778, -0.1778]]] },
        pupilNote: "The photographic era: the 1.257 m (49.5-inch) clear aperture of the corrector less the plateholder at the center of the tube and four flat vanes along north–south and east–west (the directions of the plates' diffraction spikes). Neither the holder's size nor the vanes' width is published: the holder is drawn as the 14-inch plate (a lower bound) and the vanes 20 mm wide (a rough reading of a photograph).",
        pfuLabel: "plateholder", pfuSub: "a 14-inch plate bent to the focal surface",
        secondary: "none (one mirror): at the stop, the original singlet plate of 3/8-inch plate glass, figured on both sides",
        where: "inside the tube, halfway between the corrector and the mirror, facing the mirror: the plateholder on a four-vane focus hub",
        fieldNote: "The 14-inch plates cover 6.6° × 6.6°; drawn is the 5.4° unvignetted field, and the plate corners lose 0.1–0.2 mag. The singlet corrector was figured for blue light (4358 Å in Harrington 1952; 4861 Å in the 1954 Atlas), so the image quality degrades in the red and near-infrared. The 1 mm glass plates were bent in the plateholder to the spherical focal surface (radius 3.07 m), drawn flat." },
    ] },
  // Gemini (North and South, one design): data/telescopes/gemini.md (Gemini Observatory pages, Zemax models and drawings; Gillett
  // et al. 1996; GPI papers). An 8.1 m f/1.8 thin ULE meniscus (f = 14.402 m, 1.2 m hole) and a 1.02 m convex secondary 12.54 m
  // above the primary; the undersized secondary is the stop, so the entrance pupil is 7.9 m (D; Dmirror 8.1). eps 0.164: the 168 mm
  // hole in the secondary (a periscope behind the hole shows infrared instruments cold sky), 1.30 m in the pupil; with the optical baffle
  // extended (2.003 m) eps is 0.2535 (the third focus). Spider: four 10 mm vanes in two pairs meeting 0.214 m off the center, +/-46.5
  // deg from the line through the meeting points (read off a GPI pupil image and turned so that line is horizontal; the orientation
  // on the sky is not published). One focal station, the f/16 Cassegrain on the Instrument Support Structure: the up-looking port 4.0 m
  // behind the primary's vertex, or a side port by the 45-deg science fold 2.9 m behind the vertex (the focus 1.1 m off the axis).
  // coating "silver" is proposed (the 3D view draws only "gold").
  { id: "gemini", group: "Gemini 8.1 m", name: "Gemini 8.1 m", D: 7.9, Dmirror: 8.1, f1: 14.402, eps: 0.164, hole: 1.2, coating: "silver",
  primaryNote: "A thin ULE meniscus 8.1 m across and 20 cm thick with a 1.2 m central hole: a hyperboloid with f = 14.40 m (f/1.8), shaped by 120 actuators. The 1.02 m secondary is undersized and is the stop, so the entrance pupil is 7.9 m. All mirrors carry protected silver. Gemini North (Maunakea) and Gemini South (Cerro Pachón) are the same design.",
  pupil: { kind: "circle", D: 7.9, vanes: [
    { ang: 46.5, w: 0.01, x0: 0.214 }, { ang: -46.5, w: 0.01, x0: 0.214 }, { ang: 133.5, w: 0.01, x0: -0.214 }, { ang: 226.5, w: 0.01, x0: -0.214 }] },
  pupilNote: "The 7.9 m pupil set by the secondary, less the secondary's 168 mm central hole (1.30 m in the pupil), through which a periscope shows infrared instruments cold sky, and four 10 mm vanes in two pairs (read off a pupil image from the Gemini Planet Imager; the pattern's orientation on the sky is not published).",
  area: { value: 47.57, info: true, src: "DERIVED from the pupil drawn here (data/telescopes/gemini.md); Gemini publishes no collecting area" },
  foci: [
    { id: "up", name: "Cassegrain f/16, up-looking port", kind: "Cassegrain", variant: "Up-looking port", F: 16.2177, plate: 1.60994, design: "cass", back: 0.50633, field: 10, refl: 2,
      secondary: "convex hyperboloid, 1.02 m (the stop) with a 168 mm central hole, 12.54 m above the primary",
      where: "the up-looking (bottom) port of the Instrument Support Structure, 4.0 m behind the primary's vertex",
      fieldNote: "10′ on this port. F is the published 128.12 m over the 7.9 m pupil (Gemini quotes f/16). The infrared configuration: the deployable baffle around the secondary retracted (1.12 m)." },
    { id: "side", name: "Cassegrain f/16, side port", kind: "Cassegrain", variant: "Side port", F: 16.2177, plate: 1.60994, design: "cass", nasmyth: true, a3: -2.9, backN: 0.13924, field: 7, refl: 3, focusLabel: "side-port focus",
      secondary: "convex hyperboloid, 1.02 m (the stop); then the flat science fold at 45°, 2.9 m behind the primary's vertex",
      where: "a side-looking port of the Instrument Support Structure, 1.1 m from the axis",
      fieldNote: "7′, set by the science fold's size. The infrared configuration (baffle retracted)." },
    { id: "sideopt", name: "Cassegrain f/16, side port, optical baffle", kind: "Cassegrain", variant: "Side port, optical baffle", F: 16.2177, plate: 1.60994, design: "cass", nasmyth: true, a3: -2.9, backN: 0.13924, field: 7, eps: 0.2535, refl: 3, focusLabel: "side-port focus",
      secondary: "convex hyperboloid, 1.02 m, with the deployable baffle extended to 2.0 m; then the flat science fold at 45°",
      where: "a side-looking port of the Instrument Support Structure, 1.1 m from the axis",
      fieldNote: "7′ (the extended baffle passes 12′). The baffle, 2.003 m across, blocks direct sky light for optical instruments and sets ε = 0.254; the periscope in the secondary is shuttered." },
  ] },
  // Hale 200-inch: data/telescopes/hale.md (Bowen 1961; Anderson 1948; Palomar pages; hcipy's pupil after Galicher et al. 2019).
  // A 5.08 m f/3.3 paraboloid (660 in) with a 40-inch hole; no undersized stop, so D is the mirror. eps 0.3661: the 1.86 m shadow
  // of the 72-inch prime-focus cage and the secondaries in the measured pupil (0.36 at the prime foci: the cage by itself). Spider:
  // four radial vanes, 0.25% of D (12.7 mm, Carlotti et al. 2014; hcipy 48 mm), with 0.12 m attachment boxes to 1.0232 m (hcipy).
  // Prime focus bare (f/3.3), with the Wynne corrector (WaSP, 0.18" per 15 um pixel: f/3.384) and with Ross's f/3.6 corrector
  // (correctors drawn as one lens 0.5 m before the focus, schematic); Cassegrain f/16 1.524 m behind the primary; coude f/30 drawn
  // unfolded as a Cassegrain, the secondary placed by the 36-inch coude mirror filling the beam (INFERRED).
  { id: "hale", group: "Hale 5.1 m", name: "Hale 200-inch", D: 5.08, F1: 3.3, eps: 0.3661, hole: 1.016,
  primaryNote: "A ribbed Pyrex paraboloid 200 inches (5.08 m) across with a 40-inch central hole, 24 inches thick at the edge and aluminized; focal length 660 inches (16.76 m, f/3.3). The observer rides in a 72-inch cage at the prime focus, whose lower part also carries the Cassegrain and coudé secondaries.",
  pupil: { kind: "circle", D: 5.08, vanes: [
    { ang: 0, w: 0.0127 }, { ang: 90, w: 0.0127 }, { ang: 180, w: 0.0127 }, { ang: 270, w: 0.0127 },
    { ang: 0, w: 0.12, to: 1.0232 }, { ang: 90, w: 0.12, to: 1.0232 }, { ang: 180, w: 0.12, to: 1.0232 }, { ang: 270, w: 0.12, to: 1.0232 }] },
  pupilNote: "The whole 5.08 m mirror, less the 1.86 m shadow of the prime-focus cage and the secondaries (as measured in a pupil image through PALM-3000; the cage is 72 inches) and four radial vanes, 0.25% of the aperture wide, with short wide attachments at the cage.",
  area: { value: 17.43, info: true, src: "DERIVED from the pupil drawn here (data/telescopes/hale.md); Palomar quotes ~20 m² for the whole mirror" },
  foci: [
    { id: "pf", name: "Prime focus f/3.3 (no corrector)", kind: "Prime focus", variant: "f/3.3, no corrector", F: 3.3, plate: 12.304, design: "prime", field: 2.6, eps: 0.36, refl: 1, pfuLabel: "observer's cage", pfuSub: "72 inches across, ε 0.36",
      secondary: "none: the observer's cage sits at the prime focus (the secondaries swung aside)",
      fieldNote: "The bare paraboloid gives good images over less than half an inch (2.6′); plates were taken behind a corrector." },
    { id: "pfw", name: "Prime focus f/3.38 (Wynne corrector; WaSP)", kind: "Prime focus", variant: "Wynne corrector (WaSP, LFC)", F: 3.3836, plate: 12, design: "prime", field: 24, eps: 0.36, refl: 1, corrector: { d: 0.5, label: "Wynne corrector", sub: "drawn as one lens of the same power" }, pfuLabel: "WaSP in the cage", pfuSub: "6144 × 6160 CCD, 0.18″ per pixel",
      secondary: "none: the camera and the corrector in the cage",
      fieldNote: "24′ (unvignetted to 22′ with the LFC). F and the plate scale come from WaSP's 0.18″ per 15 µm pixel (LFC: 0.175″ at the center); the corrector's place and size are schematic." },
    { id: "pfr", name: "Prime focus f/3.6 (Ross corrector, 1950s)", kind: "Prime focus", variant: "Ross corrector f/3.6 (1950s)", F: 3.6, plate: 11.279, design: "prime", field: 14.3, eps: 0.36, refl: 1, corrector: { d: 0.5, label: "Ross corrector", sub: "drawn as one lens of the same power" }, pfuLabel: "plateholder in the cage",
      secondary: "none: photographic plates behind F. E. Ross's corrector in the cage",
      fieldNote: "A field ~3 inches (14.3′) across; a second Ross lens gave f/4.7. The corrector's place and size are schematic." },
    { id: "cass", name: "Cassegrain f/16", kind: "Cassegrain", F: 16, plate: 2.5377, design: "cass", back: 0.3, field: 12.6, refl: 2,
      secondary: "convex hyperboloid, 41 inches (1.04 m), in the lower part of the cage, 13.6 m above the primary",
      where: "about 5 feet (1.52 m) behind the primary's front surface",
      fieldNote: "The telescope's Cassegrain field is not published: drawn 12.6′, the circle around the 4-Shooter's 8.9′ square. The DBSP documents give f/15.7–15.8." },
    { id: "coude", name: "Coudé f/30", kind: "Coudé", F: 30, plate: 1.35344, design: "cass", back: 2.694, field: null, refl: "3 (one flat) or 5 (three flats)",
      secondary: "convex hyperboloid, 36 or 32 inches, in the cage; then a 36 × 53 inch flat at the intersection of the optic and polar axes",
      where: "the coudé room south of the telescope, down the polar axis",
      fieldNote: "Drawn unfolded, as a Cassegrain: the flat (one for objects south of +43°, three for northern ones) sends the beam down the polar axis. The secondary's place is taken from the 36-inch mirror filling the beam, so the drawn focus, 13.7 m behind the primary, is schematic." },
  ] },
  // TMT (a design): data/telescopes/tmt.md (Observatory Architecture Document TIO.SEN.DRD.05.002.CCR43, 2026-01-10; the
  // pupil obscuration drawing TIO.TEL.GTY-0001 Rev D, printed in OAD CCR34). 492 segments: in projection regular hexagons
  // of side 0.716 m (pitch 1.24015 m) with 3.5 mm optical gaps, flat-topped in the elevation frame (rot 30); the center
  // and the first lattice ring are empty (rings0 2), and the segments whose centers lie within 14.46 m (rcut; any cut from
  // 14.30 to 14.62 m) number 492: circumscribed 30.004 m. M1 R = 60 m (f1 30 m). The 3.6 m M2 envelope (eps) and six legs
  // at most 225 mm wide along the rows of segments. Ritchey-Chretien, 450 m (f/15 on the nominal 30 m); the flat tertiary
  // on the elevation axis, 3.5 m above the primary's vertex, sends the beam to a Nasmyth focus 20 m from the axis.
  { id: "tmt", group: "TMT 30 m", name: "TMT 30 m", D: 30.004, f1: 30.0, eps: 0.11998, nominalD: 30,
    primaryNote: "492 hexagonal segments, 1.44 m across the corners and 45 mm thick, with 2.5 mm gaps, in six identical sectors of 82 around an empty center (no segment at the center or in the ring around the center); a hyperboloid with radius of curvature 60 m (f = 30 m, f/1). A design (2026); the preferred site is Maunakea.",
    pupil: { kind: "hex", D: 30.004, flat: 1.24015, gap: 0.0035, rings: 13, rings0: 2, rot: 30, rcut: 14.46,
      vanes: [30, 90, 150, 210, 270, 330].map(ang => ({ ang, w: 0.225 })) },
    pupilNote: "Seen in the telescope's elevation frame (+X to the right, toward the +X Nasmyth platform): the 3.6 m envelope of the secondary and six legs at most 225 mm wide along the rows of segments, as in the design drawing. The pupil's orientation on the sky is not published.",
    area: { value: 633.5, tol: 0.005, src: "TMT web page: 'as efficiently as a 28.4-meter unobstructed mirror' (633.5 m²); the Detailed Science Case gives 664.2 m² (data/telescopes/tmt.md)" },
    segments: 492, segmentsArea: { value: 655.30, tol: 0.003, src: "492 regular hexagons of side 0.716 m (OAD), the gaps closed (DERIVED, data/telescopes/tmt.md)" },
    foci: [
      { id: "nasx", name: "Nasmyth +X f/15 (WFOS)", kind: "Nasmyth", variant: "+X (WFOS)", F: 14.998, plate: 0.458366, design: "cass", nasmyth: true, side: "down", a3: 3.5, backN: 0.66658, field: 20, refl: 3,
        secondary: "convex hyperboloid, 3.1 m, 27.09 m above the primary; a flat elliptical tertiary (3.5 × 2.5 m) on the elevation axis, 3.5 m above the primary's vertex",
        where: "the +X Nasmyth platform: WFOS at the 0° position, on the elevation axis",
        fieldNote: "20′ unobstructed (15′ unvignetted by the secondary and tertiary); the focal surface is curved (radius 3.01 m), 20 m from the tertiary. The 450 m is f/15 on the nominal 30 m and f/14.998 on the 30.004 m drawn here." },
      { id: "nasmx", name: "Nasmyth −X f/15 (NFIRAOS)", kind: "Nasmyth", variant: "−X (NFIRAOS)", F: 14.998, plate: 0.458366, design: "cass", nasmyth: true, side: "up", a3: 3.5, backN: 0.66658, field: 20, refl: 3,
        secondary: "convex hyperboloid, 3.1 m, 27.09 m above the primary; a flat elliptical tertiary (3.5 × 2.5 m) on the elevation axis, 3.5 m above the primary's vertex",
        where: "the −X Nasmyth platform: NFIRAOS (feeding IRIS and MODHIS) at the 174.5° position, the alignment and phasing system at 180°",
        fieldNote: "20′ unobstructed (15′ unvignetted by the secondary and tertiary); the focal surface is curved (radius 3.01 m), 20 m from the tertiary. NFIRAOS passes on an f/15 beam to its instruments (not drawn)." },
    ] },
  // LBT: data/telescopes/lbt.md (LBTO quick facts; Rothberg et al. 2016; the LBTI, LUCI, MODS and PEPSI documents). Two
  // 8.417 m f/1.142 paraboloids with 0.889 m holes on one mount, centers 14.417 m apart (SX at -x, DX at +x); one side is
  // drawn (SX). f1 = 1.142 x 8.417 m = 9.612 m (DERIVED: no source gives the focal length). At the Gregorian foci the
  // undersized 0.911 m adaptive secondary is the stop: an 8.22 m pupil (AO papers; a real-ray trace of the quick-facts
  // prescription gives 8.22-8.27 m), eps 0.1108. f/14.72 on the 8.417 m parent = 123.90 m (F 15.073 on 8.22 m), back focal
  // distance 3.050 m; the tertiary 2.25 m above the primary, so the bent foci lie 5.30 m from the axis (DERIVED). Struts: the
  // secondary and tertiary swing arms, ~8% of the secondary wide (0.073 m), an 18 deg wedge (Bechter et al. 2020), drawn as
  // two struts at +/-9 deg on the outer side of the mirror (direction INFERRED from a photograph). Prime focus: the primary
  // is the stop (8.4 m, as the LBC papers use); the LBC body's shadow is not published (eps = the 0.889 m hole, a lower
  // bound). The LBTI focus holds both mirrors in a per-focus pupil (kind "circles"); the combined focus is in the fieldNote.
  { id: "lbt", binocular: 14.417, group: "LBT 2 × 8.4 m", name: "LBT 2 × 8.4 m", D: 8.22, Dmirror: 8.417, f1: 9.612, eps: 0.1108, hole: 0.889,
    primaryNote: "Two spin-cast borosilicate honeycomb paraboloids, 8.417 m across with 0.889 m central holes, f/1.142 (f = 9.6 m), on one alt-azimuth mount with their centers 14.4 m apart. Each side is a separate telescope; the left one (SX) is drawn. The adaptive secondary, a 0.911 m concave shell, is undersized: at the Gregorian foci the secondary is the stop and the pupil is 8.22 m.",
    pupil: { kind: "circle", D: 8.22, vanes: [{ ang: 171, w: 0.073, from: 0.4555 }, { ang: 189, w: 0.073, from: 0.4555 }] },
    pupilNote: "One side (SX) at the Gregorian foci: the 8.22 m pupil set by the undersized secondary, the secondary's 0.91 m shadow, and two 73 mm struts of the swing arms that meet at the center 18° apart (their direction, toward the outer edge of the mirror, is a reading of a photograph).",
    area: { value: 55.0, info: true, src: "half of the 110 m² of the two mirrors (Green & Hill 2009; the 8.417 m mirror less the 0.889 m hole: 55.02 m², DERIVED); the 8.22 m Gregorian pupil drawn here: 51.9 m² (data/telescopes/lbt.md)" },
    foci: [
      { id: "pfb", name: "Prime focus f/1.45 (LBC-Blue, SX)", kind: "Prime focus", variant: "LBC-Blue (SX)", D: 8.4, F: 1.45, plate: 16.935, design: "prime", eps: 0.1058, field: 27, refl: 1,
        pupil: { D: 8.4 }, corrector: { d: 0.93, label: "LBC-Blue corrector", sub: "five fused-silica lenses and the cryostat window, drawn as one lens" }, pfuLabel: "LBC-Blue camera",
        secondary: "none: the camera and its corrector ride on the prime-focus swing arm",
        fieldNote: "27′ unvignetted (the corrected field is 110 mm across). F and the plate scale come from the corrector's 12.18 m focal length on 8.4 m. The LBC body's shadow is not published: ε is the primary's 0.889 m hole, a lower bound." },
      { id: "pfr", name: "Prime focus f/1.45 (LBC-Red, DX)", kind: "Prime focus", variant: "LBC-Red (DX)", D: 8.4, F: 1.4530, plate: 16.9, design: "prime", eps: 0.1058, field: 27, refl: 1,
        pupil: { D: 8.4, vanes: [{ ang: -9, w: 0.073, from: 0.4555 }, { ang: 9, w: 0.073, from: 0.4555 }] },
        corrector: { d: 0.93, label: "LBC-Red corrector", sub: "five BK7 lenses and the cryostat window, drawn as one lens" }, pfuLabel: "LBC-Red camera",
        secondary: "none: the camera and its corrector ride on the prime-focus swing arm",
        fieldNote: "27′ (the corrected field is 108.2 mm across). F comes from the published 16.9″ per mm (12.2 m on 8.4 m). The right side (DX): the struts lie toward +x. The LBC body's shadow is not published: ε is the primary's hole." },
      { id: "dg", name: "Direct Gregorian f/15 (MODS)", kind: "Direct Gregorian", F: 15.073, plate: 1.6648, design: "greg", back: 0.37105, field: 6, refl: 2,
        secondary: "the adaptive secondary: a concave 0.911 m shell with 672 actuators, undersized (the stop)",
        where: "3.05 m behind the primary's vertex, straight through the primary's hole (MODS1 on SX, MODS2 on DX)",
        fieldNote: "6′ × 6′ (MODS); the infrared field is unvignetted to 4′. f/15 is nominal: 123.9 m (f/14.72 on the 8.417 m parent) is f/15.07 on the 8.22 m pupil." },
      { id: "bgf", name: "Front bent Gregorian f/15 (LUCI)", kind: "Bent Gregorian", variant: "Front (LUCI)", F: 15.073, plate: 1.6648, design: "greg", nasmyth: true, side: "up", a3: 2.25, backN: 0.64477, field: 4, refl: 3,
        secondary: "the adaptive secondary (0.911 m, the stop); a flat tertiary, 64 × 50 cm, 2.25 m above the primary",
        where: "the front bent Gregorian station (LUCI1 on SX, LUCI2 on DX); drawn in the plane of the baseline",
        fieldNote: "4′ × 4′ (LUCI); the tertiary vignettes beyond 4.5′ from the axis. The focus 5.30 m from the axis is DERIVED (the tertiary's 2.25 m plus the 3.05 m back focal distance)." },
      { id: "lbti", name: "Center bent Gregorian f/15 (LBTI, both mirrors)", kind: "Bent Gregorian", variant: "Center (LBTI, both mirrors)", F: 15.073, plate: 1.6648, design: "greg", nasmyth: true, side: "down", a3: 2.25, backN: 0.64477, eps: 0, field: 1, refl: 3,
        pupil: { kind: "circles", D: 22.637, segs: [{ x: -7.2085, y: 0, d: 8.22, hole: 0.911 }, { x: 7.2085, y: 0, d: 8.22, hole: 0.911 }],
          vanes: [{ ang: 171, w: 0.073, from: 0.4555, x0: -7.2085 }, { ang: 189, w: 0.073, from: 0.4555, x0: -7.2085 },
            { ang: -9, w: 0.073, from: 0.4555, x0: 7.2085 }, { ang: 9, w: 0.073, from: 0.4555, x0: 7.2085 }] },
        pupilNote: "Both mirrors, centers 14.42 m apart and 22.64 m from edge to edge: the image of a star is the single-mirror pattern crossed by fringes along the baseline, three bright fringes within the core.",
        secondary: "the adaptive secondaries of both sides (0.911 m, the stops); flat tertiaries 2.25 m above the primaries",
        where: "between the two primaries: the LBTI beam combiner, with entrance windows at the two f/15 foci",
        fieldNote: "The beam combiner reimages the two f/15 foci onto one focal plane with an f/15 envelope: f/15 on the 22.65 m baseline (≈340 m, 0.61″ per mm), f/41 for each mirror. NOMIC: 0.018″ per 30 µm pixel; LMIRCam images the combined focus at 1:1, 10.7 mas per pixel over ≈22″. The phased field is of order 1′. Drawn: one side's f/15 focus at the entrance window." },
    ] },
];
