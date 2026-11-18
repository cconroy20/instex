Saved by the main session from the agent's final report (the agent could not write files).

# I1_reimaged layout audit (18 imager presets)

REPORT.md could not be written. The Write tool refused it ("subagents should return findings as text"), so the report is below. The working folder `/private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/I1_reimaged/` holds:
- `<id>_inst.png` and `<id>_tel.png` for all 18 presets (Instrument and Telescope views).
- `geom.js`, which runs `IM.design` on each preset and prints the drawn distances (re-run it to check the numbers).
- `src/`, the source figures rasterized and cropped: `bigelow_fig1b.png`, `fors2_fig22.png`, `oke2-02.png`, `ihb-025.png`, `wfc3_ir_crop.png`, `rieke-04.png`, `s06-03.png`, `hawkium-10.png`.

No project file was edited. I made no web searches; everything comes from the saved rawdata.

## Facts about the drawing code that apply to all 18
1. The Instrument view is one unfolded straight line: focus, collimator, pupil, camera, detector. The collimator and camera are always thin lenses. It cannot draw a fold, a mirror collimator, a dichroic, a field lens, a pick-off or an AO relay (`web/imgapp.js` 513-525).
2. The camera stands `camGap` past the pupil, default 0.3 W (4 to 44 mm for every preset here except IMACS). In four real instruments it stands 270 to 630 mm past the pupil (B1 to B3).
3. In the Telescope view, every reimaged non-Korsch preset labels the telescope focus "detector" (or "detector, 4 chips" at Nasmyth). Only the Korsch case says "detector (past the reimager, not drawn)" (`imgapp.js` 754, 761).
4. The imager presets take the default Cassegrain `back` (0.2 D) and Nasmyth `a3` (0.2 D) and `backN` (0.8 D). The Telescopes mode carries per-telescope values, so the two modes disagree for the same focus (B5).

## (A) Wrong at a glance: 4

**A1. LRIS red: the collimator is drawn as a lens.** The real one is an off-axis paraboloidal mirror that reverses the beam, and the red camera sits 44 degrees off the incoming beam.
- Oke et al. 1995, p. 376: "The mirror collimator reverses the light-travel direction"; "The only practical solution for the collimator was an off-axis parabolic reflector"; the diffracted light "comes off at a 44° angle to the incoming beam and goes through a lens camera". Fig. 1 on that page shows the same layout.
- `rawdata/imaging/lris/keck_lris_collimator_tec.html`: "off-axis paraboloid ... Off-axis angle 8.91 deg ... True parabolic focal length 78.75 in".
- Path lengths agree: the real pupil returns to near the focal plane, and the drawn collimator-to-pupil distance is 2203 mm. Only the element type and the two turns are wrong.
- Not drawn: the field lens, a meniscus 100 mm inside the focal plane (f = 14,262 mm).

**A2. HAWK-I: two glass lenses are drawn, but the instrument has no collimated beam.** The chain is a powered entrance window, then four mirrors (flat fold M1, sphere M2, aspheres M3 and M4), with the cold stop on M3.
- HAWK-I User Manual Sec. 2.1 and Fig. 2: "The entrance window ... is used to image the pupil on the M3 mirror. The first folding mirror (M1)... one large spherical mirror M2 and two aspherical mirrors M3 and M4". The intro says "The light passes four mirrors and two filter wheels".
- The note admits the "ideal pair", but the drawing shows a 1.5 m "collimator" that does not exist. It needs a "schematic layout" tag.

**A3. WFC3/IR: an on-axis lens pair is drawn.** The real path has five reflections before the detector, and the pupil sits near the detector, after the powered relay.
- Handbook Fig. 2.1 and Sec. 7.3 give the chain: flat 45° pick-off mirror, channel-select flat, fold flat, hyperbola, ellipse, cold pupil mask, refractive corrector plate, filter select mechanism, detector.
- MEASURED from Fig. 2.1 at 300 dpi. The scale comes from the 14.26 mm pupil (2 x 7.13 mm, ISR 2014-10) against the 50 px beam width at the mask, which gives 0.285 mm/px. The uncertainty is about 40%.
  - The mask is about 44 mm before the detector.
  - The filter wheel is about 6 mm past the mask, so "pupil and filter" is roughly right.
  - The corrector plate is about 21 mm past the mask.
- Drawn: the camera 4 mm past the pupil and the detector 176 mm past the pupil, about 4x too far.
- The note says "no source places the filter at the pupil". Fig. 2.1 does (adjacent), so that sentence contradicts the source.
- `coldStop` is unset although the cold mask is the stop.
- The Telescope view draws the focus on axis, but the real focus is reached by the 45° pick-off in a radial bay.

**A4. 4-Shooter: the cameras are drawn as refractive lenses.** They are small Schmidt cameras with the detector inside the beam.
- `data/imaging/fourshooter.md` line 72: "collimator (not described) + small Schmidt camera, one per quadrant". Gunn 1987 line 32 also says "Cassegrain Schmidt camera".
- The pyramid at the focus, the 5° facet tilt and the filter about 1 m above the pyramid are sourced. The cameras' focal lengths and pupil are placeholders, and the note says so.

## (B) Distance or angle off by more than about 20%: 8

**B1. FORS2 camera position.** Drawn 28 mm (SR) and 14 mm (HR) past the pupil; the real camera is about 286 mm (SR) and 431 mm (HR) past it.
- MEASURED from the FORS2 User Manual Fig. 2.2 (p. 4), rasterized at 300 dpi. The "250. MM" bar spans 163 px (1.53 mm/px).
- Pupil-stop ticks to CCD: SR 370 px = 566 mm, HR 465 px = 711 mm. Subtracting the 280 mm camera focal length gives the 286 and 431 mm above, uncertainty about 10%.
- Cross-checks: the collimator-to-pupil distance in the figure is 1293 mm against 1327 mm in the model (3%), and the CCD housing height reads 77 mm against a 61.4 mm chip plus housing.
- Proposed: fors2sr `camGap: 286`; fors2hr `camGap: 431`.
- Filters at the pupil are correct: the broadband wheels are in the parallel beam.

**B2. MOSFIRE camera position.** Drawn 40 mm past the Lyot stop; SOURCED 627.5 mm.
- `data/round4/mosfire.md` line 50, quoting M10 Sec. 3.1: "The large (327.5 mm) distance from the Lyot stop to the grating, combined with the (300 mm) distance from the grating to the camera".
- Proposed: `camGap: 628`.
- Also not drawable: the 40° turn at the grating turret (MDDR Sec. 3.2.1) and the folding flat inside the collimator (M10 Sec. 3.1).

**B3. LRIS camera position.** Drawn 44 mm past the pupil; the real first surface is 269 mm from the grating.
- Oke Sec. 3 gives "a 269 mm grating-to-first-surface distance". The Fig. 2 caption gives an entrance pupil 10.64 in (270 mm) ahead of the entrance aperture.
- Proposed: `camGap: 330`, ESTIMATED as 269 mm plus about 60 mm for the principal plane.
- The red filters sit "just in front of the camera lens", about 270 mm past the pupil, not at it.

**B4. FourStar distances.** Drawn: collimator at 1430 mm, pupil at 3031 mm, detector at 3538 mm from the focus. Real: field lens at 210 to 270 mm, pupil about 1725 mm, detector about 2570 mm.
- Persson 2013 Sec. 4: "doublet field lens which forms a 130 mm diameter pupil image 27 mm in front of ... L3. L1 ... is located 210 mm behind the telescope focal plane". Table 3 gives the axial separations (summed here to about 1750 mm to L3 and about 2570 mm to the detector).
- The topology matches, and the drawn camera gap of 39 mm matches the real 27 mm.
- The "collimator" is drawn at its equivalent f_col instead of the field lens, which puts the pupil 76% too far out and the detector 38% too far.
- Smallest model change: a drawing-only `colZ` key for where the drawn collimator and pupil stand. Until then, tag "schematic layout".

**B5. Telescope-view focus differs from the Telescopes mode for the same focus.**
- niri6/14/32: back 1.58 m drawn vs 4.0 m (Gemini up-looking port, back 0.50633 D). Proposed `back: 0.5063`.
- fors2sr/hr: back 1.62 m vs 2.5 m (VLT Cassegrain, 0.30807 D). Proposed `back: 0.3081`.
- fourshooter: back 1.02 m vs 1.52 m (Hale, 0.3 D). Proposed `back: 0.3`.
- nirc2n/m/w: a3 2.19 m and focus 8.76 m from the axis, vs a3 4.0 m and 6.5 m (Keck Left Nasmyth, backN 0.5937). Proposed `a3: 4.0, backN: 0.5937`.
- hawki: a3 1.6 m, backN 0.8 and side "down", vs a3 2.5 m, backN 0.85 and side "up" (VLT Nasmyth A is east). Proposed `a3: 2.5, backN: 0.85, nasSide: "up"`.
- lrisr, mosfirei: back 2.19 m vs 2.5 m (0.2283 D), 12%, so this is a C item. Proposed `back: 0.2283`.
- Consistent with the Telescopes mode:
  - twomass: 527 mm, SOURCED.
  - wfc3ir: 1.50 m behind the vertex.
  - imacsf2 and fourstar: the Magellan defaults, with sides West down and East up.

**B6. WFC3/IR pupil-to-detector distance.** 176 mm drawn vs about 44 mm (see A3).

**B7. Dichroics and folds missing: NIRCam, 2MASS, NIRI.**
- NIRCam (Rieke 2023 Fig. 2): pick-off, coronagraph focus, first fold, collimator, dichroic (before the pupil), then per arm filter wheel and camera, plus an extra fold in the SW arm. The drawing has only collimator, pupil and camera. The pupil and filter order does match.
- 2MASS (Skrutskie 2006 Fig. 1): window, field stop, one common lens, two dichroics straight after it (J reflected first, H second, Ks straight through), then six lenses per band with the Lyot stop and filter inside the lens train.
  - The drawing shows one band on a straight line with no dichroics.
  - It puts the Lyot stop between collimator and camera, where it is actually inside the lens train.
- NIRI (saved overview pages): ZnSe field lens, two fold mirrors, filter wheel 1 in the converging beam, a two-lens collimator, filter wheel 2, the pupil wheel (36 mm), a beam-steerer flat, the camera, and an end fold. The filter-1 position in the drawing is right; the field lens and folds are absent.

**B8. AO relay not drawn: NIRC2, NIRI f/32.**
- NIRC2: the chain is the AO bench (off-axis parabola collimator, deformable mirror, off-axis parabola camera), then the NIRC2 window, focus, collimator, pupil-mask wheel, filter wheels, shutter, grism slide and one of three cameras (Observer's Manual Sec. 1.2). The NIRC2-internal order is drawn correctly; the AO bench is a documented omission in the note.
- NIRI f/32: the name says "(Altair AO, field lens)" but neither the relay nor the lens appears.
- Smallest model change: a drawing-only `relay: {label, sub}` box on the leg before the instrument focus, or the tag "schematic layout".

## (C) Smaller details and text fixes: 8
- **C1.** Telescope-view label "detector" at the telescope focus for all reimaged non-Korsch presets. It should read "focus (reimager not drawn)".
- **C2.** WFC3/IR Telescope view: the focus should be off axis (radial bay behind the pick-off).
- **C3.** Cold-stop flags.
  - wfc3ir needs `coldStop: true`; the label then reads "pupil, cold stop and filter".
  - nircamsw and nircamlw need `coldStop: true`, because the Lyot stops sit in the cold pupil wheel.
  - nirc2n/m/w could take `coldStop: true` as well (low value).
- **C4.** JWST Korsch focus at about 4 m behind the vertex in the imager vs "about 1.96 m" in the Telescopes mode. Both are labeled schematic; keep them consistent.
- **C5.** lrisr filters are drawn at the pupil but sit just before the camera, about 270 mm past it.
- **C6.** imacsf2 omits the 650 mm singlet field lens at the focus and the ADC (the note already admits the ADC).
- **C7.** LRIS field is 4 to 10 arcmin off axis (Oke p. 377); drawn on axis. The note already says so.
- **C8.** hawki note ("all-reflective reimager") is accurate, but the drawing contradicts it (A2).

## IMACS f/2 camGap 305: VERIFIED
- Source: Bigelow et al. 2003 Fig. 1 (PDF page 3, 300 dpi).
- Scale: 1.43 mm/px, from the 650 mm field-lens glass (455 px). The paper's 312 mm largest short-camera element reads 350 mm by the same scale (12% high), so the scale uncertainty is about 10%.
- Measured:
  - Collimator last lens to the axis intersection (the pupil): 210 px = 300 mm. The record says 290.
  - Pupil to the short camera's first lens: 90 px = 129 mm. The record says about 140.
  - Pupil to CCD: 475 px = 680 mm. The record says 660.
- The model has camGap + f = 305 + 356 = 661 mm, within 3% of the measurement. The f/2 camera is straight through, the f/4 is the folded one, and both match the drawing.

## Per-preset verdicts
- **DIFFERS, tag "schematic layout":** wfc3ir, nircamsw, nircamlw, lrisr, hawki, fourshooter (camera type), mosfirei (folds and camera position), twomass (dichroics), niri6/14/32 (folds, field lens, Altair), nirc2n/m/w (AO bench omitted; pupil size cannot be sourced).
- **Topology MATCHES, distances differ:** fors2sr, fors2hr (B1), fourstar (B4).
- **MATCHES, verified:** imacsf2.

## Left SCHEMATIC
Searched `rawdata/imaging/{wfc3,jwst_nircam,hawki,nirc2,niri,fourshooter,fourstar,2mass,lris,fors2}` and `rawdata/presets/{imacs,longslit_lris,mosfire,fors2}`. Only schematic figures were found, with no distances, for these elements:
- NIRCam camera spacing.
- NIRC2 internal distances.
- NIRI internal distances.
- The 4-Shooter collimator and Schmidt camera.
- HAWK-I mirror positions (manual cartoon, no scale).
- WFC3/IR beyond the crude Fig. 2.1 measurement.
- The Gemini `.zmx` file is the telescope only, not NIRI.
- Magellan Nasmyth `a3`/`backN`: the Telescopes mode already declares them schematic.

## 10-line summary
1. Counts: 4 A, 8 B, 8 C.
2. A1: LRIS red draws a lens collimator; the real one is an 8.9° off-axis paraboloid mirror that reverses the beam, with a 44° turn at the pupil (Oke 1995, p. 376).
3. A2: HAWK-I draws two glass lenses; the real instrument is a window plus four mirrors (one a fold) with the cold stop on M3 and no collimated beam.
4. A3: WFC3/IR draws an on-axis lens pair; the real path has pick-off, CSM and fold flats, hyperbola, ellipse, then the pupil mask about 44 mm from the detector (MEASURED, about 40%).
5. A4: the 4-Shooter's Schmidt cameras are drawn as refractive lenses.
6. B1 to B3: the camera should stand FORS2 SR about 286 mm and HR about 431 mm (MEASURED), MOSFIRE 627.5 mm (SOURCED) and LRIS about 270 mm or more (SOURCED) past the pupil, versus 14 to 44 mm drawn.
7. B4: FourStar's pupil is drawn at 3031 mm from the focus and the detector at 3538 mm; the real values are about 1725 mm and about 2570 mm, and the "collimator" is really a field lens at about 240 mm.
8. B5: the Telescope-view focus disagrees with the Telescopes mode for NIRI (1.58 vs 4.0 m), FORS2 (1.62 vs 2.5 m), the 4-Shooter, NIRC2 (a3 and backN) and HAWK-I (a3 and side); exact keys are listed under B5.
9. B7 and B8: the 2 dichroics (2MASS), the dichroic and folds (NIRCam), and the AO relay (NIRC2, NIRI f/32) are not drawn. Tag these as "schematic layout".
10. IMACS f/2 camGap 305 mm is VERIFIED (MEASURED 661 vs 680 mm from Bigelow Fig. 1, about 10% scale uncertainty). The code cannot draw a mirror collimator, a fold, a dichroic or a field lens, so the smallest changes are a `colKind`/`turnAt` pair, a `colZ` key and a `relay` box (details under A1, B4 and B8).