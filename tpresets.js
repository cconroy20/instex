/* Telescopes for the Telescopes mode (window.IX_TELESCOPES).  Sources: data/telescopes/*.md.
   All values from data/telescopes/{keck,magellan,hst}.md (2026-10-19), with page references and quotes there.
   Each telescope: id, group (menu), name, D (m), F1 (primary focal ratio), eps (default obstruction), pupil
   { kind: "circle" | "hex", D, flat, gap, rings, vanes: [{ ang, w, full }], pads: [{ r, ang, d }] }, foci:
   [{ id, name, F, design ("prime" | "cass" | "greg" | "korsch" | "pb"), nasmyth, side ("down" for a right or west
   Nasmyth platform, "up" for left or east: drawn on opposite sides), back, backN, field (arcmin), eps, refl, secondary,
   where }]. */
window.IX_TELESCOPES = [
  // Keck (I and II, one design): data/telescopes/keck.md (one design: 36 hexagonal segments of 0.9 m sides (1.8 m corner to corner,
  // 1.5588 m flat to flat) in three rings around an empty center, 7 mm non-reflecting strips between them (3 mm gaps and
  // bevels); circumscribed 10.949 m; a 2.6 m central obstruction (design; 2.48 m measured); six 25 mm vanes parallel to
  // the segment edges, toward the midpoints of the outline's sides (measured on Keck II, used for both). The primary's
  // focal length is 17.5 m (f/1.75 on the nominal 10 m); all focal ratios here are on 10.949 m, so f/15 is f/13.66.
  // nominalD: the 10 m behind the foci's names (KOR90 Sec. 4.1), shown beside the focal ratio in the strip.
  {"id": "keck", "group": "Keck 10 m", "name": "Keck 10 m", "nominalD": 10, "D": 10.949, "F1": 1.5983, "eps": 0.2375, "pupil": {"kind": "hex", "D": 10.949, "flat": 1.5588, "gap": 0.007, "rings": 3, "vanes": [{"ang": 30, "w": 0.025}, {"ang": 90, "w": 0.025}, {"ang": 150, "w": 0.025}, {"ang": 210, "w": 0.025}, {"ang": 270, "w": 0.025}, {"ang": 330, "w": 0.025}]}, "primaryNote": "36 hexagonal segments (0.9 m sides), 17.5 m focal length (f/1.75 on the nominal 10 m), in three rings around an empty center. Keck I and Keck II are the same design.", "area": {"value": 71.5, "info": true, "src": "derived clear area at f/15 (data/telescopes/keck.md); the 1985 design's 76 m² is the segments alone (checked separately)"}, "segmentsArea": {"value": 76, "tol": 0.005, "src": "Nelson, Mast & Faber 1985"}, "foci": [
    {"id": "cass", "name": "Cassegrain f/15", "F": 13.6618, "design": "cass", "back": 0.2283, "field": 20, "refl": 2, "secondary": "convex hyperboloid, 1.4 m (the tertiary stowed)", "where": "2.5 m behind the primary's vertex", "plate": 1.379},
    {"id": "nasr", "name": "Right Nasmyth f/15", "F": 13.6618, "design": "cass", "nasmyth": true, "side": "down", "field": 20, "refl": 3, "secondary": "convex hyperboloid, 1.4 m, flat tertiary", "where": "right Nasmyth platform", "plate": 1.379},
    {"id": "nasl", "name": "Left Nasmyth f/15 (AO)", "F": 13.6618, "design": "cass", "nasmyth": true, "side": "up", "field": null, "refl": "3 to the focus, about 10 to the AO output", "secondary": "convex hyperboloid, 1.4 m, flat tertiary", "where": "left Nasmyth platform, into the AO bench (output f/15)", "plate": 1.379},
    {"id": "bent", "name": "Bent Cassegrain f/15", "F": 13.6618, "design": "cass", "nasmyth": true, "backN": 0.45, "field": 5, "refl": 3, "secondary": "convex hyperboloid, 1.4 m, the tertiary turned to a port", "where": "four stations on the center section", "plate": 1.379, "fieldNote": "5′ (the 1985 design)."},
    {"id": "f25", "name": "Forward Cassegrain f/25 (Keck I, historical)", "F": 22.8057, "design": "cass", "back": 0.2283, "field": 10, "refl": 2, "secondary": "a 0.53 m gold-coated chopping secondary", "where": "behind the primary (Keck I, 1993-2010)", "plate": 0.826},
    {"id": "f40", "name": "Bent Cassegrain f/40 (Keck II, historical)", "F": 36.0764, "design": "cass", "nasmyth": true, "backN": 0.45, "field": 10, "refl": 3, "eps": 0.2968, "pupil": {"clip": 10.445}, "secondary": "a chopping secondary, undersized to be the stop (10.445 m on the primary)", "where": "a bent-Cassegrain port (Keck II)", "plate": 0.522, "fieldNote": "10′ in the design; 186″ at the visitor port. The secondary's central hole is hexagonal (drawn round here, 3.25 m on the primary, read from a figure)."}]},
  // Magellan: data/telescopes/magellan.md (twin telescopes: f/1.25 paraboloid primaries with a 1.3 m hole; the f/11
  // Gregorian secondary and a flat rotating tertiary feed five stations, two Nasmyth platforms and three folded ports on
  // the center section). Clay stands for both (the more foci: Clay alone adds the f/5 Cassegrain and the f/16 adaptive
  // secondary). The pupil, measured on Clay: eps 0.29 is the secondary baffle (a diameter ratio); four vanes at +/-45 deg
  // from points 0.34 m off center (the hcipy Magellan model's frame, its orientation on the sky not known), 0.75 in wide,
  // two widened to 1.5 in by the MagAO cable trays (which two: the hcipy choice). Baade's vanes are not published.
  { id: "magellan", group: "Magellan 6.5 m", name: "Magellan 6.5 m", D: 6.5, F1: 1.25, eps: 0.29,
    primaryNote: "A spin-cast borosilicate honeycomb paraboloid, f/1.25, with a 1.3 m central hole. Shown: the Clay telescope; Baade is the same design without the f/5 and f/16 foci.",
    pupil: { kind: "circle", D: 6.5, vanes: [
      { ang: 45, w: 0.01905, x0: 0.34 }, { ang: -45, w: 0.01905, x0: 0.34 }, { ang: 225, w: 0.0381, x0: -0.34 }, { ang: 135, w: 0.0381, x0: -0.34 }] },
    pupilNote: "Clay's pupil: two of the four 0.75-inch vanes are widened to 1.5 inches by the cable trays of the MagAO adaptive secondary.",
    area: { value: 30.13, info: true, src: "derived from the pupil's geometry (no official value)" },
    foci: [
      { id: "nasw", name: "f/11 Nasmyth West (Gregorian)", F: 11, plate: 2.88, design: "greg", nasmyth: true, side: "down", field: null, refl: 3, secondary: "concave (Gregorian), about 1.3 m; a flat rotating tertiary", where: "west Nasmyth platform" },
      { id: "nase", name: "f/11 Nasmyth East (Gregorian)", F: 11, plate: 2.88, design: "greg", nasmyth: true, side: "up", field: null, refl: 3, secondary: "concave (Gregorian); a flat rotating tertiary", where: "east Nasmyth platform (a rotating port)" },
      { id: "aux", name: "f/11 folded ports (Gregorian)", F: 11, plate: 2.88, design: "greg", nasmyth: true, backN: 0.5, field: null, refl: 3, secondary: "concave (Gregorian); the flat tertiary turned to a port on the center section", where: "three folded ports on the center section" },
      { id: "cass5", name: "f/5 Cassegrain", F: 5.36, design: "cass", field: 35, eps: 0.277, refl: 2, secondary: "convex hyperboloid, 1.8 m (the f/5 secondary)", where: "behind the primary", pupilNote: "The f/5 secondary's own support vanes and baffle are not published: the f/11 vanes are drawn, and ε is the 1.8 m mirror.", fieldNote: "35′ with the Megacam corrector; f/5.2 over 14′ with the MMIRS corrector. F from the published 0.169 mm per arcsecond." },
      { id: "asm16", name: "f/16 adaptive secondary (MagAO)", F: 16.16, design: "greg", nasmyth: true, field: null, refl: 3, secondary: "the adaptive secondary, an 85 cm concave ellipsoid (the pupil's obstruction is still the 0.29 baffle)", where: "a Nasmyth station (which side is not published: drawn on the west)" },
    ] },
  // HST: data/telescopes/hst.md (OTA Handbook 1990, Figure 4.1; x = +V2, y = +V3; whether the drawing is seen from the
  // sky or the focal plane is not stated). The two outer pads: 58.5 and 67.6 deg from -V3, taken on either side of it.
  { id: "hst", group: "Hubble 2.4 m", name: "Hubble 2.4 m", D: 2.4, F1: 2.3, eps: 0.33, space: true,
    primaryNote: "A concave hyperboloid (R = 11.04 m, f = 5.52 m) with a 600 mm central hole; as built its conic was wrong (the figuring error of about half a wave rms, from a 1.3 mm spacing error in the null corrector), corrected since 1993 inside the instruments.",
    pupil: { kind: "circle", D: 2.4,
      vanes: [{ ang: 0, w: 0.025654, full: true }, { ang: 90, w: 0.025654, full: true }],
      pads: [{ r: 1.0668, ang: 90, d: 0.150368 }, { r: 1.07188, ang: 211.5, d: 0.150368 }, { r: 1.07188, ang: 337.6, d: 0.150368 }] },
    area: { value: 3.899, src: "OTA Handbook 1990: 38990 cm² clear (45240 total, 4930 behind the central obscuration, 1320 behind the pads and spider)" },
    foci: [
      { id: "cass", name: "Cassegrain f/24", F: 24, plate: 3.58, design: "cass", back: 0.625, field: 28, refl: "2 (axial bays), 3 (radial bays)",
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
  { id: "jwst", group: "JWST 6.6 m", name: "JWST 6.6 m", D: 6.6, F1: 1.203, eps: 0, drawEps: 0.202, space: true,
    primaryNote: "18 hexagonal beryllium segments, gold-coated, 1.32 m across the flats with 7 mm gaps, in two rings around an empty center (filled by the aft optics); radius of curvature 15.88 m (f = 7.94 m, f/1.20 on the 6.6 m entrance pupil). Six segments fold back on two wings for launch.",
    pupil: { kind: "hex", D: 6.6035, flat: 1.3235, gap: 0.0161, rings: 2, rot: 30,
      vanes: [{ ang: 90, w: 0.11887 }, { ang: -60, w: 0.12243 }, { ang: -120, w: 0.12243 },
        { ang: 90, w: 0.16519, from: 2.14627, to: 2.3645 }, { ang: 90, w: 0.13959, from: 2.48335, to: 2.54445 }] },
    pupilNote: "The pupil as STScI's STPSF model draws it, seen from the sky (+V3 up): the segments flat side up, the +V3 strut with two widenings for its hinge and dampers.",
    area: { value: 25.779, tol: 0.006, src: "STPSF pupil model, geometric clear area (DERIVED, data/telescopes/jwst.md); measured 25.44 m² with NIRCam's pupil imaging lens (McElwain et al. 2023)" },
    foci: [
      { id: "tel", name: "Telescope focus f/20 (three mirrors)", F: 19.909, plate: 1.5697, design: "korsch", field: 18, refl: 4,
        secondary: "convex hyperboloid, 0.738 m, 7.17 m in front of the primary; then a concave tertiary behind the primary and a flat fine steering mirror",
        fieldNote: "About 18′ × 9′ (the instruments' fields side by side); the focal surface is curved, about 1.96 m behind the primary's vertex. Drawn as a generic three-mirror (Korsch) layout: the focal length and plate scale are JWST's, the mirrors' places are schematic." },
      { id: "cass", name: "Cassegrain focus f/9 (intermediate)", F: 9.0, plate: 3.472, design: "cass", back: -0.2114, field: null, refl: 2,
        secondary: "convex hyperboloid, 0.738 m, 7.17 m in front of the primary",
        fieldNote: "The image the primary and secondary form 1.39 m in front of the primary's vertex, at the entrance of the aft optics; the tertiary and fine steering mirror re-image it at f/20. No instrument sits here." },
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
      { id: "greg", name: "Gregorian focus f/13", F: 13.059, plate: 3.9487, design: "greg", back: -0.34125, field: 5, refl: 2,
        secondary: "off-axis concave ellipsoid, 0.65 m (conic −0.54), on a fast tip-tilt hexapod",
        fieldNote: "5′ at most; a 2.8′ field stop for the adaptive optics. The focal length is DERIVED (52.24 m) from the published prescription; the published focal ratio is f/13." },
      { id: "prime", name: "Prime focus f/2 (the heat stop)", F: 2, plate: 25.78, design: "prime", field: 5, refl: 1,
        secondary: "none here: the heat stop at prime focus passes the 5′ field", pfuLabel: "heat stop", pfuSub: "passes the central 5′; the rest of the Sun's light is rejected",
        fieldNote: "The heat stop's 5′ opening (the Sun's image here is about 75 mm across)." },
    ] },
  // VLT: data/telescopes/vlt.md (one Unit Telescope; the four share the design). The stop is the secondary (ESO
  // instrument specification: "The pupil is determined by the secondary mirror"): the entrance pupil is 8.0 m at
  // Nasmyth and coude, 8.115 m at Cassegrain (each focus's F is on its own pupil). Vanes: hcipy's model (after ESO's
  // ERIS document): four 40 mm vanes in two pairs from points 0.524 m off the center on the diagonal; their
  // orientation relative to the Nasmyth platforms is not published. Platform A is east and B west (VLT White Book,
  // at azimuth 0): drawn up and down. The tertiary is a flat 2.5 m above the primary's vertex; the Nasmyth foci are
  // 6.8 m from the axis. The coude train (f/47.3, eight mirrors, feeding the VLTI) is not drawn.
  { id: "vlt", group: "VLT 8.2 m", name: "VLT 8.2 m", D: 8.0, Dmirror: 8.2, f1: 14.4, eps: 0.1395,
    primaryNote: "A thin Zerodur meniscus 8.2 m across (8.186 m reflecting) and 175 mm thick, shaped by 150 actuators; radius of curvature 28.8 m (f = 14.4 m). The secondary is the stop: the entrance pupil is 8.0 m at Nasmyth, 8.115 m at Cassegrain. Since 2016 UT4's secondary is deformable (the Adaptive Optics Facility).",
    pupil: { kind: "circle", D: 8.0, vanes: [
      { ang: 174.5, w: 0.04, x0: -0.3707, y0: -0.3707 }, { ang: 275.5, w: 0.04, x0: -0.3707, y0: -0.3707 },
      { ang: 354.5, w: 0.04, x0: 0.3707, y0: 0.3707 }, { ang: 95.5, w: 0.04, x0: 0.3707, y0: 0.3707 }] },
    pupilNote: "Four 40 mm vanes in two pairs, each pair meeting 0.52 m off the center (hcipy's model, after an ESO document); no vane crosses the pupil. The central obstruction is the 1.116 m secondary.",
    area: { value: 48.71, info: true, src: "DERIVED geometry at Nasmyth (no ESO value found; GRAVITY+ uses 49.26 m²)" },
    foci: [
      { id: "nasa", name: "Nasmyth A f/15 (east)", F: 15, plate: 1.7189, design: "cass", nasmyth: true, side: "up", a3: 2.5, backN: 0.85, field: 30, refl: 3,
        secondary: "convex hyperboloid, 1.116 m (beryllium); a flat elliptical tertiary 2.5 m above the primary", fieldNote: "30′ in all, 7.15′ unvignetted (the tertiary vignettes from 20′)." },
      { id: "nasb", name: "Nasmyth B f/15 (west)", F: 15, plate: 1.7189, design: "cass", nasmyth: true, side: "down", a3: 2.5, backN: 0.85, field: 30, refl: 3,
        secondary: "convex hyperboloid, 1.116 m (beryllium); a flat elliptical tertiary 2.5 m above the primary", fieldNote: "30′ in all, 7.15′ unvignetted (the tertiary vignettes from 20′)." },
      { id: "cass", name: "Cassegrain f/13.4", D: 8.115, F: 13.4106, plate: 1.8953, design: "cass", back: 0.30807, eps: 0.138, field: 15, refl: 2, pupil: { D: 8.115 },
        secondary: "convex hyperboloid, 1.116 m (the tertiary turned out of the beam)", fieldNote: "15′ in all, 2.68′ unvignetted; the focus 2.5 m below the primary's vertex." },
    ] },
  // GMT: data/telescopes/gmt.md (Observatory Architecture Document 2021; hcipy's model for the truss). Seven 8.365 m
  // clear apertures: one on the axis, six tilted 13.522 deg and centered 8.71 m out on the surface, which project to
  // ellipses 8.365 x 8.133 m (radial) centered 8.657 m out (DERIVED); circumscribed 25.448 m. The 3.6 m secondary
  // baffle and a three-legged truss (hcipy: per leg two 0.119 m struts widening 1.16 deg per edge from a node at
  // 2.386 m, and one 0.115 m strut; a triangle of 4.93 m circumdiameter at the center) shadow the central mirror only.
  // The cross-section drawn runs through the central and two outer mirrors (the clear apertures, with their gaps).
  // The folded port: a flat tertiary 1.93 m above the Gregorian focus, the focus 1.93 m off the axis (DERIVED).
  { id: "gmt", group: "GMT 25.4 m", name: "GMT 25.4 m", D: 25.448, f1: 18.0, eps: 0.141,
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
      { id: "dg", name: "Direct Gregorian f/8.2", F: 8.1574, plate: 0.99362, design: "greg", back: 0.22909, field: 20, refl: 2,
        secondary: "seven 1.05 m concave adaptive segments (Gregorian, beyond the prime focus)", fieldNote: "20′ (the secondary vignettes up to 7% at the edge); the focus 5.83 m below the primary's vertex. A corrector-ADC (f/8.34 over 20′) is not drawn." },
      { id: "fp", name: "Folded port f/8.2 (flat tertiary)", F: 8.1574, plate: 0.99362, design: "greg", nasmyth: true, a3: -3.90, backN: 0.07584, field: 3, refl: 3, focusLabel: "folded-port focus",
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
      { id: "pf", name: "Prime focus f/3.65 (Wide Field Corrector)", F: 3.65, plate: 5.651, design: "prime", field: 22, refl: 5,
        corrector: { d: 0.6, label: "Wide Field Corrector", sub: "four mirrors, drawn as one lens" },
        secondary: "none: the four-mirror Wide Field Corrector rides on the tracker", fieldNote: "22′ (18′ for science). The corrector is drawn as one lens of its power; its place and size are schematic." },
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
      { id: "pf", name: "Prime focus f/2.2 (HSC)", F: 2.2459, plate: 11.2, design: "prime", field: 90, refl: 1,
        corrector: { d: 1.0, label: "HSC wide-field corrector", sub: "drawn as one lens of its power" }, pfuLabel: "Hyper Suprime-Cam (HSC)",
        secondary: "none: the camera and its corrector sit at the prime focus", fieldNote: "1.5° across. The published F is 2.2 (2.25 on 8.2 m from the 18.4 m focal length); the corrector's place and size are schematic." },
      { id: "cass", name: "Cassegrain f/12.2", F: 12.195, plate: 2.063, design: "cass", back: 0.36585, field: 6, refl: 2,
        secondary: "convex, 1.33 m (the optical secondary)", fieldNote: "6′; the focus 3.0 m behind the primary's vertex." },
      { id: "nsopt", name: "Optical Nasmyth f/12.5", F: 12.4634, plate: 2.017, design: "cass", nasmyth: true, side: "up", field: 6, refl: 3,
        secondary: "the optical secondary (1.33 m); a flat tertiary", fieldNote: "6′ (with the image rotator: 3.5′, f/12.7, 6 reflections). Which platform is drawn on which side is a choice: the sources name them only optical and infrared." },
      { id: "nsir", name: "Infrared Nasmyth f/13.9", D: 7.95, F: 13.912, plate: 1.865, design: "cass", nasmyth: true, side: "down", eps: 0.298, field: 6, refl: 3, pupil: { D: 7.95 },
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
      { id: "focus", name: "Focus f/19 (visual objective)", F: 19.049, plate: 10.67, design: "refr", field: 45, refl: 0,
        secondary: "none: a doublet objective (4 refracting surfaces)", fieldNote: "The 20 × 25 cm plates covered about 35′ × 45′ (unvignetted field not published). The lens is drawn ideal: the real one brings each color to its own focus (see the Image box)." },
    ] },
];
