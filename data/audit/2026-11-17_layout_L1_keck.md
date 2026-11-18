Saved by the main session from the agent's final report (the agent could not write files).

# L1_keck layout audit (lris, hires, deimos, mosfirey/j/h/k, kcwib, kcrm, esi)

REPORT.md was NOT written. The harness refused a report file, so the full report is below. No project files were edited. No new rawdata was needed.

Working folder (screenshots and rasterized source figures):
/private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/L1_keck/
- `<id>_lay.png`: 2D crops of the live drawings.
- `hires_3d_Top_c.png`, `hires_3d_Side_c.png`, `esi_3d_Top_c.png`: 3D views.
- `kcwi_p-04.png`, `kcwi_p-09.png`: Morrissey+18 Figs. 2 and 8.
- `lris_fig1-02.png`: Oke+95 Fig. 1.
- `vogt_top-03.png`, `vogt_p-03.png`, `vogt_p-08.png`: Vogt+94 Figs. 1, 2, 5.
- `esi_pub-03.png`: Sheinis+02 Fig. 1.
- `mos_ddr-046.png`: MOSFIRE DDR Fig. 13.
- `kcwib_prop210_lay.png`, `esi_prop_c.png`, `lris_prop_c.png`: renders of the proposed values.

## 1. Findings by visibility

### (A) Wrong at a glance

**A1. KCWI/KCRM: the grating is drawn ~300 mm from the collimator, unfolded. The real grating is at the collimator's radius of curvature, 4345 mm, after a fold.**
- Morrissey+18 Sec. 2: the relay is "a Schmidt camera in reverse ... the compound pupil on the grating, formed at the radius of curvature of the spectrograph collimator". The Fig. 8 caption (item 8) says the grating "is located at the radius of the collimator". Table 1 gives collimator radius 4345 mm. The virtual slit is at f = 2172 mm.
- Drawn (`kcwib_lay.png`): 160 px at 105 px per 200 mm, about 300 mm past the collimator.
- Fig. 8 measured (130 dpi, scale from slit-to-collimator 400 px = 2172 mm):
  - one in-plane fold (item 7, the cylindrical FM1) at 0.73 of the collimator-to-grating path, deviation about 150 deg (+/-6);
  - total path 855 px, which is 2.1 times slit-to-collimator against the sourced 2.0 (about 7% high);
  - FMD and FM3 are out-of-plane flats, so one in-plane fold is the right representation.
- PROPOSED, tested in `kcwib_prop210_lay.png`: `layLen: 4345, foldOn: true, foldAng: 210, foldPos: 0.73`. foldAng 210 puts the grating on the same side as the returned beam, as in Fig. 8.
- Class: distance SOURCED; fold position and angle MEASURED.

**A2. HIRES 2D: the cross-disperser is midway between echelle and camera, and the camera arm points away from the telescope. The real cross-disperser sits beside the collimators and the camera folds back toward the slit end.**
- Vogt+94 p. 365: "cross-disperser grating located below and slightly ahead of the collimators ... turns the beam 40 [deg] and into a ... prime-focus catadioptric camera".
- Fig. 1 top view (`vogt_top-03.png`): cross-disperser at x = 750 (collimators 810, slit 40). The camera arm runs up-left, back toward the telescope side, about 45 deg to the main axis. Fig. 2 (xhires schematic) agrees.
- "40 deg" is the angle between the incoming and outgoing beams, so the deviation is about 140 deg.
- Drawn 2D (`hires_lay.png`): a transmitting plate at 0.5 d2 (about 600 mm from the echelle), with the arm continuing up-right past the collimator.
- The 3D view matches Fig. 1: cross-disperser about 390 mm from the collimator plane, camera back toward the slit end. So 2D and 3D disagree.
- Model change needed: `e.xdTurn`, a deviation at a reflection cross-disperser (140 for HIRES, placed at about 0.65 of the echelle-to-camera path). The smallest form reuses `foldOn/foldAng/foldPos` on the camera arm in echelle mode.
- Class: WRONG in 2D; 3D matches.

**A3. MOSFIRE: the fold flat between the field lens and the collimator barrel is missing, and the collimator is two lens groups, not one lens.**
- McLean+12 abstract: "A folding flat following the field lens is equipped with piezo transducers".
- DDR 2007 Sec. 5.1.2.4: "The 6-element collimator contains a large CaF2 field lens separated from a second lens group. A folding flat ... will be placed between these groups."
- The DDR light-path text says the path is folded "a second time by the grating/mirror exchange turret". That second fold is the grating itself, so it is drawn correctly.
- DDR Fig. 13 (`mos_ddr-046.png`) shows the CSU, field lens, FCS mirror, collimator barrel, grating turret and camera.
- Drawn (`mosfirey_lay.png`): a straight 1.8 m run to one lens, with no fold.
- The fold angle is not published, and Fig. 13 is a perspective CAD view, so it cannot be measured. It stays SCHEMATIC.
- Model change: a pre-collimator fold for lens collimators (e.g. `foldPre`). Until then, tag the preset "schematic layout".

**A4. ESI: the echelle and prisms are drawn about 650 mm from the collimator (2D) and about 1000 mm (3D). The real path is about 2.9 m. The drawn collimator tilt is far too large.**
- Sheinis+02 Fig. 1 (`esi_pub-03.png`, 150 dpi). Scale 4.62 mm/px from the 580 mm collimator (125 px), cross-checked by slit-assembly-to-collimator 495 px = 2287 mm against the sourced f = 2286.
  - Collimator to double-pass prism 1: about 2700 mm.
  - Collimator to grating: about 2930 mm (+/-10%).
  - Text: "the exit pupil of the collimator is near the prisms".
- Tilt: the offset from light path to grating is 103 px = 476 mm over 2930 mm, a 9.2 deg turn. So the real `colTilt` is about 4.4 deg. The drawn returned beam is about 29 deg.
- PROPOSED, tested in `esi_prop_c.png`: `e.layLen: 2930, e.colTilt: 4.4`.
- Class: MEASURED.

### (B) Distance or angle off by more than about 20%

**B1. LRIS collimator tilt.**
- Drawn: automatic 2.7 deg.
- Oke+95 Fig. 1 (300 dpi, 1.338 mm/px from 2000 mm = 1495 px):
  - field centre 235 px = 314 mm (7.2') above the telescope axis;
  - grating on the telescope axis at 1946 mm along the beam, so `layLen` 2000 is confirmed to 2.7%;
  - returned beam turns 9.3 deg.
- PROPOSED: `g.colTilt: 4.65` (+/-0.5).
- Cross-check: the field lens is 243 mm tall in the figure, 5.6' against the sourced 6' (7%).

**B2. KCWI/KCRM collimator tilt, and the axis question.**
- Drawn: about 22 deg (automatic at the 300 mm path).
- Fig. 8: the chief ray returns 18.7 deg off the incoming ray, so `colTilt: 9.4` (+/-2).
- COL_AXIS is resolved as OFF: the spherical collimator is used at a "working angle" corrected by the cylindrical FM1, and Fig. 8 shows the returned beam leaving at an angle.
- Proposed validate.js entry: `[/^(kcwib|kcrm)$/, "off", "Morrissey+18 Sec. 2 and Fig. 8: working angle corrected by FM1; tilt 9.4 deg MEASURED"]`.

**B3. HIRES echelle-to-camera distance.**
- Vogt+94 Sec. 3.4: the camera is "optimized for use with an entrance pupil which lies 85.0 in ahead of the corrector" (2159 mm).
- Drawn echelle-to-corrector: about 1300 mm (-40%).
- Needs a model key (`e.camDist`).

**B4. KCRM red grating distance.**
- The red channel shares the collimator and FM1, and the dichroic FMD passes red (Keck KCWI primer).
- The red grating distance is not published. 4345 mm is INFERRED from the Schmidt condition. Mark it SCHEMATIC.

### (C) Smaller details and text fixes
- **C1. LRIS.** The field lens (100 mm inside the focal plane) is not drawn. The dichroic (30 deg, transmitting) is already noted as not drawn. The 44 deg camera angle is SOURCED and matches Fig. 1 (43.9 deg measured).
- **C2. HIRES camera spacings match Vogt+94 Fig. 5 well.**

  | spacing | drawn | Fig. 5 |
  |---|---|---|
  | corrector 1 to corrector 2 | 206 mm | 240 mm |
  | corrector to mirror | 2517 mm | 2494 mm |
  | mirror radius | 1647 mm | 1632 mm |
  | focus to mirror | 824 mm | 769 mm (7% high) |

  3D draws the camera as a lens, which is a known app limitation.
- **C3. HIRES collimator-to-echelle path, 2940 mm.**
  - Fig. 2 (not to scale) gives about 3000 mm, within 3%.
  - The Fig. 1 side view gives 2250-2480 mm, but it is foreshortened.
  - Keep 2940 and label it MEASURED, +/-15%.
- **C4. ESI 2D.**
  - 2D draws one "cross-disperser" plate in the camera arm. The real train has double-pass prism 1 before the echelle and prism 2 after it. The 3D view has this right.
  - The camera axis is drawn at 30 deg "for clarity". Fig. 1 shows about 50 deg.
  - The text "Two flat fold mirrors" refers to the mode-switch flats, which are out of the beam in echellette mode. No fold belongs in this preset.
- **C5. ESI camera ratio.** The drawn f/1.85 is beam-matched. Sheinis+02 quote f/1.07 camera and f/1.93 for the 160 mm beam. No change needed.

## 2. Per preset

**lris: topology MATCHES.**
- Mirror collimator, off-axis section of a paraboloid (Oke+95: collimator axis coincident with the telescope axis, field off axis).
- Grating at the focal plane's conjugate, lens camera on the far side from the slit.
- Wrong: collimator tilt (B1). Missing: field lens (C1).
- PROPOSED: `g.colTilt: 4.65`.

**hires: 2D DIFFERS (A2, B3); 3D MATCHES Fig. 1.**

| element | class |
|---|---|
| collimator tilt 1.75 deg | SOURCED |
| echelle in plane, 2 theta = 10 deg | SOURCED |
| collimator-to-echelle 2940 mm | MEASURED, +/-15% |
| cross-disperser placement and camera arm direction (2D) | WRONG |
| echelle-to-camera distance | WRONG (B3) |
| catadioptric camera spacings | SOURCED / MEASURED |

PROPOSED: the `xdTurn` and `camDist` model changes. Consider a "schematic layout" tag for the 2D view in the meantime.

**deimos: topology MATCHES; no change needed.**
- Compared with Faber+03 Fig. 2 (`rawdata/presets/deimos/keck_deimos_layout2.png`): slit mask at left, collimator at right, tent mirror below the axis folding up to the grating at upper left, camera above with its axis horizontal and detector toward the right.
- The tent face is about 18 deg in the figure (MEASURED by eye) against 18.5 deg drawn (data/layout/deimos.md: TNT_ANG 71.5 deg), so the geometry is SOURCED/COMPUTED and agrees.
- No "schematic layout" tag is needed.

**mosfirey/j/h/k: one drawing for all four, DIFFERS (A3).**
- Missing the FCS fold; the collimator is a field lens plus a 5-element barrel.
- The 40 deg camera-collimator angle is SOURCED (DDR).
- Tag "schematic layout".

**kcwib, kcrm: DIFFERS in distances (A1, B2).**
- The mirror collimator, pupil at the grating, VPH grating and refractive camera are right.
- KCRM shares the collimator and FM1, with the dichroic FMD passing red.
- PROPOSED, both presets: `layLen: 4345, colTilt: 9.4, foldOn: true, foldAng: 210, foldPos: 0.73`.
- Add to the KCRM note that the grating distance and fold are INFERRED from the blue channel.

**esi: element order and kinds MATCH; distances DIFFER (A4).**
- Mirror collimator, near on-axis paraboloid with the field 5' off axis (SOURCED); prism 1 double pass, echellette, prism 2, lens camera.
- PROPOSED: `e.layLen: 2930, e.colTilt: 4.4`.

## 3. Left SCHEMATIC, and what was searched
- MOSFIRE fold angle and FCS position: the DDR, PSR and McLean papers in rawdata hold only a perspective CAD view. No online search was done.
- KCRM red-arm grating distance, fold geometry and camera.
- HIRES echelle-to-cross-disperser and cross-disperser-to-corrector distances (Figs. 1 and 2 are not to scale).
- Camera-arm angles for HIRES and ESI in 2D (drawn at 30 deg "for clarity").
- Not checked: LRIS 3D, KCWI 3D.

## 10-line summary
1. Counts: A = 4, B = 4, C = 5. DEIMOS has no finding.
2. Worst (A1): KCWI/KCRM grating drawn 300 mm from the collimator; real 4345 mm (Morrissey+18 Fig. 8 caption, Table 1), via a fold at 0.73 and about 150 deg. Fix: `layLen 4345, foldOn, foldAng 210, foldPos 0.73, colTilt 9.4`.
2. (A2) HIRES 2D puts the cross-disperser mid-path with the camera pointing away from the telescope. Vogt+94 Fig. 1 and p. 365 put it beside the collimators with the camera folded back. 3D is right. Needs a new `xdTurn` model key.
3. (A4) ESI echelle and prisms are drawn 0.65 m (2D) and about 1 m (3D) from the collimator; Sheinis+02 Fig. 1 gives about 2.9 m. Collimator tilt is about 4.4 deg, not the drawn 9-29 deg.
4. (A3) MOSFIRE lacks the FCS fold flat between the field lens and the collimator barrel (McLean+12; DDR Sec. 5.1.2.4, Fig. 13). Angle not published; tag "schematic layout".
5. (B1) LRIS `colTilt` should be 4.65 deg (Oke+95 Fig. 1: 314 mm offset, 9.3 deg turn); `layLen` 2000 is confirmed (1946 mm measured).
6. KCWI/KCRM COL_AXIS resolved as OFF (working angle corrected by the cylindrical FM1; Fig. 8 tilt about 9.4 deg). Update validate.js from "unverified".
7. DEIMOS matches Faber+03 Fig. 2, including the tent mirror at about 18 deg.
8. HIRES: `colTilt` 1.75 is SOURCED. The 2940 mm path is confirmed within 3% by Fig. 2 and 16-23% low in the side view, so it stays MEASURED, +/-15%. The camera spacings match Fig. 5. The echelle-to-corrector distance is 40% short (pupil 85 in).
9. ESI 2D draws one prism plate where the real train has prism 1 double pass before the echelle and prism 2 after; 3D is right.
10. Model changes proposed: `xdTurn`, `camDist`, and a pre-collimator fold for lens collimators.