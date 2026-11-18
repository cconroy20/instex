Saved by the main session from the agent's final report (the agent could not write files).

# L5_fiber_arms layout audit: DESI, PFS, APOGEE presets and the All arms views

REPORT.md was not written. The Write tool refused ("Subagents should return findings as text, not write report files"), so the full report is below. No project file was edited. No new downloads; everything came from rawdata/presets/.

Rasters and screenshots are in /private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/L5_fiber_arms/:
- Source figures: d22p-34.png, fdr-097.png, v14-4.png, wil-19.png, bbl-1.png, han-02.png, kc-04.png, fr-03.png, v11p-03.png.
- App screenshots: desib/desir/desiz/pfsb/pfsr/pfsn/apogee.png and arms_<armid>.png.
- Proposed-change renders: prop_pfsb.png, prop_apogee.png, prop_desiz.png.

## 1. Findings ranked by visibility

### A: wrong at a glance

**A1. PFS camera type (pfsb, pfsr, pfsn).**
- Drawn: a refractive lens camera (cam "lens"), detector behind it.
- Real: a Mangin-Schmidt catadioptric camera in every arm, detector inside the beam.
  - Vives 2014 Sec. 4: "contains just four optical elements: a two-element refractive corrector, a Mangin mirror, and a field flattening lens".
  - Pascal 2014 Sec. 4: "Red and Blue Mangin mirrors are identical, NIR is different".
  - Vives 2014 Fig. 2 shows all three Schmidt cameras with the Mangin mirror beyond the corrector.
- Fix: cam: "mirror" on the three presets. I rendered it (prop_pfsb.png) and it draws corrector, spherical mirror and in-beam detector, which is the right topology.

**A2. APOGEE grating position and two fold mirrors.**
- Drawn: grating about 275 mm from the collimator (about 0.26 f; apogee.png, 200 mm bar = 62 px), no fold.
- Real, Wilson 2019 Table 5 (as-built prescription), path lengths in mm:
  - pseudo-slit to Fold 1: 709
  - Fold 1 to collimator: 343.281 (slit-to-collimator path 1052 = f)
  - collimator back to Fold 1: 343.281
  - Fold 1 past the slit plane: 709
  - on to Fold 2: 551.6 (AOI "about 50 deg", Sec. 4.4)
  - Fold 2 to VPH: 500
- Collimator-to-VPH path = 343.3 + 709 + 551.6 + 500 = 2104 mm. That equals the cold radius 2107.2 mm, so the grating sits at the center of curvature.
- Fold Mirror 1 is hit twice (Sec. 4.3). Fig. 16 shows both folds. The camera is 6 elements, with the first lens 210 mm from the VPH exit.
- Camera deviation 109 deg matches Fig. 16 (camera points back toward the collimator side). The class is SOURCED, WRONG as drawn.
- Proposed: layLen 2104, foldOn true, foldAng 80 (180 − 2×50, same convention as Via's 112.9), foldPos 0.76 ((343.3 + 709 + 551.6)/2104).
- Fold 1 sits on the slit-to-collimator leg, which the one-fold model cannot draw. Smallest model change is an optional second fold on that leg (keys fold1On, fold1Ang, fold1Pos).
- Untested: layLen 2104 rendered (prop_apogee.png), but the fold keys I tried via the URL did not draw.

**A3. DESI collimator-to-grating distance (desib, desir, desiz).**
- Drawn: automatic, about 110 mm (desib.png: 126 mm beam = 170 px, grating 150 px from the collimator), about 0.25 f.
- Real: about 890 mm in all three arms, MEASURED from D22 Fig. 14 (d22p-34.png, 200 dpi, 1700×2200).
  - Scale from the 126 mm beam (rays 983 to 1068 px at the collimator, 85 px) is 1.48 mm/px.
  - Cross-check: slit to collimator 295 px gives 437 mm against the sourced f = 450 mm (3% off).
  - Folded path lengths: NIR 600 px = 890 mm; blue 300 + 166 + 131 px = 884 mm; red 300 + 166 + 139 px = 895 mm. Uncertainty ±5%.
- That is 2f = 900 mm, the center of curvature. It is the same Schmidt rule used for Hectospec and Viaspec.
- Proposed: layLen 900 on desib, desir, desiz.

**A4. PFS collimator-to-grating distance (pfsb, pfsr, pfsn).**
- Drawn: about 208 mm (pfsb.png, 100 mm bar = 65 px, 135 px).
- Real: about 1550 mm, MEASURED from Vives 2014 Fig. 2 (v14-4.png, 150 dpi).
  - Scale from the 248 mm beam (82 px) is 3.0 mm/px.
  - Cross-check: slit to collimator 225 px gives 675 mm against the sourced 693.5 mm (3% off).
  - Paths: NIR 510 px (1530–1570 mm); blue 320 + 204 px (1590 mm); red 400 + 118 px (1570 mm). Uncertainty ±5%.
- Vives 2012 gives collimator radius 1400 mm (f 700) with the Schmidt corrector at the center of curvature and the VPHG just after it, so the same 2f rule applies.
- Proposed: layLen 1550 on the three PFS presets.

### B: a distance, angle or feature off by more than 20% (All arms)

**B1. KCWI (All arms; also kcwib/kcrm).**
- Drawn: collimator to grating about 860 mm (215 px, 500 mm = 125 px).
- Real: 4345 mm. Morrissey 2018 Table 1 gives collimator radius 4345 mm, and the Fig. 8 caption item 8 says the pupil image forms "at the grating, which is located at the radius of the collimator".
- The path runs through three folds: FM1 (a cylinder of 675 m radius that corrects the collimator working angle), FMD (flat, tilted) and FM3 (flat, below the bench).
- FMD is the element replaced by the KCRM dichroic. The Fig. 2 caption says "A parallel red arm can be accommodated by replacing the FMD fold mirror with a dichroic", and the red arm continues straight through it. So R = blue, T = red is SOURCED.
- The dichroic's position along the path is not measurable (3D rendering).
- Proposed: layLen 4345 on kcwib/kcrm.

**B2. PFS All arms: the two reflected arms go to the same side; real is opposite sides.**
- Vives 2014 Fig. 2: dichroic 1 sends blue down-left, dichroic 2 sends red up, NIR goes straight. In arms_pfsb.png both dichroics turn the same way.
- The sense search has no override. Smallest model change is a per-node sense in GROUPS (PFS: first node −1, second +1).
- DESI's drawing already matches Fig. 14, where blue and red go to the same side and the NIR camera is also on that side.

**B3. X-Shooter All arms: missing 90 deg fold mirrors.**
- V11 Sec. 2.1: "The beams toward the UVB and VIS spectrographs are then deviated to 90° with folding mirrors" (Fig. 2, piezo mirrors 1 to 3). UVB and VIS arms run perpendicular to the telescope axis, one to each side, and the NIR goes straight on.
- The app draws the 150 deg dichroic turn, which is right for AOI 15 deg (V11 Sec. 2.2.5: "The first dichroic at an incidence angle of 15°"). It then sends the arms back toward the telescope at 30 to 45 deg from the axis, with no fold.
- Order and R/T are correct: first dichroic reflects 350–543 nm, second reflects 535–1045 nm, NIR transmitted. The 560 and 1024 nm cuts are right.
- Smallest change: an optional 90 deg arm fold after each dichroic.

**B4. Boombox All arms: red-arm fold mirror missing.**
- Via Boombox_bench_layout.pdf (bbl-1.png): dichroic, then a 45 deg fold mirror, then the red grating below it. The app draws the red beam straight to the grating.
- Blue AOI 22.5 deg is confirmed: the dichroic is tilted 22° from the beam normal in the 110 dpi raster (±1.5°), and the blue beam leaves at 45° (135° turn).
- Collimator group to dichroic is about 150 mm in the figure; the app has 130 mm.
- The dichroic order and R/T (blue reflected, red transmitted) match.

### C: smaller details and text

**C1. DESI All arms: dichroic placement.**
- Dichroic 1 is drawn about 210 mm past the slit (arms_desib.png). In the real instrument the slit head sits in a slot milled into the first dichroic, "with the center fiber tangent to the reflective surface" (FDR Sec. 5.1.1; D22 Sec. 7.2). So the dichroic is at the slit plane.
- It is about 445 mm (about f) from the collimator in Fig. 14; the app has about 660 mm.
- Order and AOI are right.
  - Order: NIR-pass first, then red-pass; blue reflects twice.
  - AOI: first dichroic measured at 25.5 deg from the beam normal. The second is consistent with a 114 deg turn, so about 33 deg, against the sourced 32.1.
- The drawn Z arm reaches 855 mm from the collimator, which happens to match the real 890.

**C2. LLAMAS All arms: source conflict on dichroic order.**
- The slit-carrying dichroic is drawn about 104 mm past the slit. Frostig 2020 Sec. 2.4 says "Light travels from the fibers in the middle of the dichroic mirror, to the collimator, back to the dichroic mirror" (fr-03.png Fig. 2), so it sits at the slit.
- The conflict: the same Frostig model has the blue camera and VPH directly off that slit-bearing dichroic ("split into the blue wavelengths, and into the camera via the VPH grating"). That implies the slit dichroic reflects blue and the 475 nm one is first.
- The 11-17 D1 audit settled 690 nm first from the ETC element lists: llamas_red.def has only DichroicRG; green and blue have DichroicRG then DichroicBG.
- I cannot settle it. Frostig's model may just be a simplification of the blue path. The MIT builders could answer in one sentence.
- The camera is 7-element all-spherical refractive (pocket guide), so the lens glyph is right.
- COL_AXIS "on" rests on the 2017 two-arm pocket guide ("simple on-axis f = 200mm sphere"); the Frostig Fig. 2 collimator looks tilted.

**C3. 4MOST.**
- LRS: off-axis collimator and a Schmidt corrector (plano off-axis asphere) per arm, in front of the VPHG after the dichroics (Laurent 2016 Sec. 3.2). The correctors are not drawn.
  - Order (red dichroic 706 nm first, blue 539 nm second), R = shorter wavelength, and AOI 35.35 and 43.58 deg are SOURCED (Laurent 2020 Sec. 4.2).
- HRS: Hansen 2015 Table 1 says "Reversed off-axis Schmidt telescope". Fig. 1 shows the first dichroic about 33 deg from the beam normal (low-resolution line drawing, ±8 deg), against the drawn 45.
  - The preset labels 45 as "not published", which is honest.

**C4. UVES.**
- The 45 deg blue AOI can move from INFERRED to DERIVED. UM117 says the beam at the mode selector is "split into a red (going straight) and blue path (reflected to the right)", a 90 deg turn.
- The preslit collimated beam with a doublet per arm matches Dekker 2000 Fig. 3.
- The white-pupil train behind each slit is not shown, which is a known limitation.

**C5. MIKE.**
- AOI 30 deg, order and R/T match Bernstein 2003: "the incidence angle of the beam is 30 degrees from normal", the dichroic is "the first optical element beyond the slit", and it "reflects the beam back towards the mounting flange".
- Each arm is, from the slit: dichroic slide, field lens, flat mirror, injection triplet, camera (Fig. 1 caption). The app draws one "injection optics" lens with no flat fold.

**C6. DESI cameras.**
- Refractive 5-lens cameras with a tilted, offset detector (FDR Sec. 5.1.3). The lens glyph and tilted detector are right.
- Camera deviation (alpha + beta) against Fig. 14:

| Arm | Drawn | Measured |
|---|---|---|
| NIR | 51.4 | about 53 |
| Red | 46.3 | about 44 |
| Blue | 30.8 | about 40 (±6) |

- Real orientation: all camera barrels tilt toward the side of the reflected branches. NIR camera is up-left at about 53 deg from the beam, red is nearly vertical, blue is up-left. The drawing matches except blue, which may be 5 to 10 deg short.

**C7. PFS angles.**
- Measured dichroic AOIs are about 30 and about 35 deg, against 29 and 38 drawn (DERIVED, ±3). The second may be 35, not 38. The first dichroic is 290 mm past the slit in Fig. 2, against 335 mm drawn.
- Schmidt correctors per arm (Pascal 2014 Sec. 2.2) are not drawn. Cam "mirror" draws one, which partly covers this.

**C8. Text.**
- Add to the notes: DESI grating "about 2f (900 mm), MEASURED from D22 Fig. 14"; PFS "about 1550 mm, MEASURED from Vives 2014 Fig. 2" and "Mangin-Schmidt camera, detector in the beam"; APOGEE the two folds and the 2104 mm path.
- COL_AXIS for KCWI can move from UNVERIFIED to "off". Morrissey 2018: FM1's cylindrical "front correction to compensate the collimator working angle".
- The memory note "DESI/PFS real camera orientation not modeled" is answered in C6 and C7.

**On-axis return with the first dichroic past the cone (11-17 drawing choice).**
- PFS agrees: dichroic 1 is about 290 mm past the slit.
- DESI and LLAMAS do not: there the first dichroic is at the slit (about 0 mm), not 100 to 200 mm past it. This is a harmless offset.

## 2. Per preset

**desib/desir/desiz: topology MATCHES, distance DIFFERS**

| Element | Drawn | Real | Class |
|---|---|---|---|
| Collimator | on-axis sphere, f 450, slit in returning beam | same (D22 Sec. 7.1, Fig. 14) | SOURCED |
| Slit to collimator | 450 | 437 | MEASURED |
| Collimator to grating | about 110 | about 890 (2f) | MEASURED, WRONG |
| Folds | none | none | MATCHES |
| Camera | one lens | 5-lens refractive, detector tilted | SCHEMATIC (type right) |

Proposed: layLen 900 on all three.

**pfsb/pfsr/pfsn: topology DIFFERS (camera type)**

| Element | Drawn | Real | Class |
|---|---|---|---|
| Collimator | on-axis f 693.5 | Schmidt, R 1400, slit in beam (Vives 2012; Pascal 2014) | SOURCED |
| Collimator to grating | about 208 | about 1550 | MEASURED, WRONG |
| Dichroics | NIR through, blue first, red second | same (Vives 2014 Sec. 3) | SOURCED |
| Corrector per arm | no | yes | SCHEMATIC |
| Camera | lens | Mangin-Schmidt, detector in beam | WRONG |

Proposed: cam "mirror", layLen 1550.

**apogee: topology DIFFERS (two folds, distance)**
- See A2. Proposed: layLen 2104, foldOn true, foldAng 80, foldPos 0.76, plus the second-fold model change.
- Camera and detectors are SCHEMATIC. The three H2RG chips are tilted individually about the spatial axis and not drawn.
- The lens glyph for a 6-element camera is right in type.

## 3. Left SCHEMATIC, and what I searched
- Lens counts and positions for DESI, APOGEE, LLAMAS and 4MOST cameras (single lens glyph).
- 4MOST HRS dichroic angles and band gaps: searched the Hansen text, the 4MOST manual and the user-manual extracts, with no angle found.
- LLAMAS dichroic angles and the order conflict: searched Furesz 2020, Frostig 2020, the pocket guide and the MIT pages. The optics paper (SPIE 11447-111) is not in rawdata.
- KCWI FMD position: Fig. 2 is an undimensioned 3D rendering.
- PFS camera distance past the grating, and PFS as-built dichroic angles (only the concept-stage Fig. 2 exists).
- Boombox grating positions: only the dichroic and fold were checked against the 110 dpi Zemax raster.

## Summary (10 lines)
1. Counts: A = 4, B = 4, C = 8 (the two sections above number them A1–A4, B1–B4, C1–C8).
2. Worst: A1, PFS cameras are drawn as refractive lenses; real ones are Mangin-Schmidt with the detector in the beam (cam "mirror" fixes it).
3. A2, APOGEE has two fold mirrors and a 2104 mm collimator-to-VPH path (Wilson Table 5), drawn as 275 mm with no fold.
4. A3 and A4: the DESI grating is at about 890 mm (drawn 110) and the PFS grating at about 1550 mm (drawn 208); both are at about 2f (layLen 900 and 1550).
5. DESI topology and dichroic order, AOI and camera orientation match Fig. 14; PFS order, R/T and AOI match within ±3 deg.
6. B1 KCWI: grating at 4345 mm through three folds, drawn 860 mm.
7. B2 PFS: reflected arms should go to opposite sides.
8. B3 X-Shooter and B4 Boombox: the 90 deg fold mirrors are missing.
9. C2 LLAMAS: Frostig's model puts the blue splitter on the slit-bearing dichroic, which conflicts with the ETC-based 690-first order.
10. Upgrades: UVES AOI to DERIVED from "reflected to the right"; KCWI COL_AXIS to "off" from the collimator working angle; MIKE and 4MOST LRS match their sources; REPORT.md was not written (tool refused), so the report is the text above.