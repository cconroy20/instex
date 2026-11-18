Saved by the main session from the agent's final report (the agent could not write files).

# L4_eso layout audit (REPORT.md could not be written: the tool refused report files, so the full report is here)

Working folder (F) = /private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/L4_eso/ . It holds the screenshots (F/<preset>_3d.png, F/<preset>_2d.png, F/harps.png, F/muse.png, F/fors2300v.png) and the source crops cited below. No project file was edited. Every source I used was already in rawdata, so nothing new was downloaded.

## 1. Findings ranked by builder visibility

**A (wrong at a glance): 2**

**A1. ESPRESSO: the field mirror and field lens are on the wrong arms.**
- The preset has blue = "field mirror" and red = "field lens, drawn as a fold".
- Three layout figures draw the opposite: the field MIRROR sits beside the pupil slicer on the RED path (dichroic -> field mirror -> R collimator). The field LENS sits on the BLUE path (dichroic -> field lens -> B collimator, next to the blue cross-disperser).
  - Pepe+2021 Fig. 3: rawdata/presets/espresso/Pepe2021_AA645_A96_ESPRESSO_arXiv2010.00316.pdf, PDF p.5, crop F/pepe21_fig3.png.
  - ESPRESSO User Manual P117 Fig. 5: PDF p.18, F/espman-18.png.
  - Megevand+2014 Fig. 14: PDF p.11, F/meg14_fig14.png.
- The text of Pepe+2021 Sec. 3.1.5 says the reverse ("the red field lens and the blue field mirror"). data/round5/espresso.md followed that sentence. This is a source conflict: three figures against one sentence. I recommend following the figures and flagging the conflict.
- Consequence: the drawn fold, a mirror at the intermediate focus next to the slit, is right for RED. In the blue arm the intermediate focus is far from the slit, beside the field lens, with no fold there; the transfer mirror BTM does the turning.
- Proposed: espressor e.fold3d = "field mirror"; espressob e.fold3d = "field lens, drawn as a fold". Also update the README text and the data/round5/espresso.md field_correctors row.

**A2. 4MOST HRS (all three arms, 2D view): the camera lens straddles the slit-to-collimator beam.**
- The detector ends up beside the slit (F/4mosthb_2d.png). The cause is the 89 deg camera angle from the symmetric VPH, with no dichroic fold drawn.
- In the real concept design the dichroic folds the beam before the VPH and corrector, so the camera is clear of the slit beam. Source: Hansen+2015 Fig. 1, rawdata/presets/4most/Hansen2015_AN336_665_arXiv1508.02714_HRS_blue_arm.pdf p.2, F/hansen-02.png.
- The camera angle itself (about 90 deg between beam and camera axis) agrees with the figure. I measured it by eye, +-10 deg.
- Proposed, with existing keys: foldOn true, with foldAng about 90 deg (MEASURED by eye from Hansen Fig. 1, +-15 deg) and foldPos about 0.4 of the collimator-to-grating path. Add a "schematic layout" tag.

**B (off by more than ~20%): 1**

**B1. MUSE camera speed.**
- The drawn camera is f/3.87 (258 mm). The MUSE User Manual Fig. 8 labels the real camera "Camera f/2" (PDF p.21, F/musman-021.png), and it has five lenses.
- The preset is already named "effective optics", and the focal lengths are not published, so this is class SCHEMATIC. Tag the preset "schematic layout".

**C (small details and text): 6**

- **C1. UVES (both arms): the 45 deg slit fold before the collimator is not drawn.**
  - Dekker+2000, p.540 (rawdata/presets/uves/Dekker2000_SPIE4008_534_UVES_ESA-PSA-copy.pdf): the beam "passes in front of the face-down echelle before hitting a 45 degree folding mirror, and is collimated by the main collimator mirror". The same paper says "it was necessary to add 2 flats".
  - UVES manual Fig. 2.2 (PDF p.22, F/uvesman-22.png) shows the same small flat beside the echelle.
  - The drawing has only the intermediate flat (labeled "flat", which is correct).
  - Model change: a second small fold between slit and collimator for lay3d "wp".
- **C2. X-Shooter (all three arms): two folds drawn as one.**
  - Vernet+2011 Fig. 5 labels "Folding mirror 1" (slit fold) and "Folding mirror 2" (field fold), adjacent to each other (rawdata/presets/xshooter/Vernet2011_AA536_A105_XShooter_arXiv1110.1944.pdf p.5, F/vernet_fig5.png).
  - The NIR arm has M5 (slit fold) and M8 (field mirror) (Fig. 6, F/vernet6_small.png).
  - The drawn merged element sits where the pair is, so it reads correctly; fix the label only.
  - Proposed fold3d: UVB and VIS "slit fold + field fold (one drawn)"; NIR "slit fold M5 + spherical field mirror M8 (one drawn)".
- **C3. X-Shooter collimator.** Real: a 5 deg off-axis Maksutov-type (spherical mirror plus corrector lens; in the NIR, mirrors M6 and M7 plus an Infrasil corrector). Drawn as one mirror. This is acceptable as schematic, and the note already says "Maksutov-type".
- **C4. HARPS fold.**
  - HARPS User Manual 2.4 Fig. 2.1 (PDF p.11, F/harpsman11-11.png) shows a small flat bar at the intermediate focus. This supports the drawn fold, although the text never names it.
  - Soften note3d from "not described in the sources" to "appears in Fig. 2.1 but is not described".
- **C5. 4MOST per-arm drawings omit the dichroics and the Schmidt corrector.**
  - Laurent+2016 Sec. 3.2 (rawdata/presets/4most/Laurent2016_SPIE9908_LRS_design_HAL-04785348.pdf p.3, F/lrs16-03.png): a plano off-axis asphere corrector sits in front of each VPH, and two dichroics tilted 35 and 43.3 deg fold the beam.
  - Add the corrector to the layout label and note.
- **C6. ESPRESSO** does not draw the dichroic (one arm is drawn), which is fine. The caption already says "VPH grating on a prism".

## 2. Per preset

### HARPS (harps): topology MATCHES
Screenshot F/harps_3d.png. Sources: HARPS manual 2.4 Sec. 2.1, Table 2.2, Fig. 2.1; Pepe+2002 Messenger 110 (rawdata/presets/harps/new_E2/).

| element | drawn | real | class |
|---|---|---|---|
| collimator | one mirror, passed three times | one f=1560 mm mirror, "used diameter 730mm, triple pass" (Table 2.2) | SOURCED |
| collimator axis | off ("off*") | off-axis parabola: Pepe 2002 "f/2.1 parabolic mirror ... triple pass", manual "similar to UVES", and Fig. 2.1 shows tilted-mirror geometry; a triple pass cannot be on axis | SOURCED, upgrade from INFERRED to supported |
| fold | small flat at the intermediate focus | small bar at the focus in Fig. 2.1 | MEASURED (qualitative) |
| cross-disperser | grism at the white pupil | "cross disperser placed at the white pupil", FK5 grism | SOURCED |
| camera | dioptric, 728 mm | all-dioptric, 728 mm | SOURCED |

Proposed: none required (see C4).

### UVES (uvesb, uvesr): topology DIFFERS only by the missing slit fold (C1)
Screenshots F/uvesb_3d.png and F/uvesr_3d.png.

| element | drawn | real | class |
|---|---|---|---|
| slit fold | none | 45 deg flat | WRONG by omission |
| main collimator | mirror, passed twice | off-axis parabola, two passes around the echelle | SOURCED |
| intermediate flat | "flat" | flat folding mirror and inter-order baffle | SOURCED |
| transfer collimator | separate mirror, 2.0 m | second off-axis parabola | SOURCED (focal length DERIVED, E2 audit) |
| cross-disperser | grating at the white pupil | CD#2 and CD#3 reflection gratings | SOURCED |
| camera | dioptric f/1.8 (blue), f/2.5 (red) | dioptric, 360 and 500 mm | SOURCED |

- Distances MEASURED on manual Fig. 2.2 (red arm, 110 dpi page raster):
  - Flat to transfer collimator is about 507 px, echelle to collimator about 445 px, and transfer collimator to cross-disperser about 580 px.
  - All three are within 15% of each other, consistent with the drawn 2.0 m spacings.
  - There is no dimensioned scale on the figure, so I used the shared 2 m focal length as the scale; uncertainty +-15%.
- Proposed: a pre-collimator fold for lay3d "wp". There is no key for it today.

### FEROS (feros): topology MATCHES
Screenshot F/feros_3d.png. Source: FEROS-II manual 1.4 Fig. 1.1 (rawdata/presets/feros/ESO_FEROSII-UserManual-1.4_LSO-MAN-ESO-22200-0001.pdf PDF p.10, F/ferosman-10.png) and the Sec. 2.2.2 light path.
- Order: fibre exit and image slicer, main collimator, echelle, main collimator, flat folding mirror, transfer collimator, prism, camera, CCD. The drawing has the same order, and no fold before the collimator (SOURCED).
- Collimators are off-axis paraboloids, 1500 mm (SOURCED); the prism is at the white pupil (SOURCED); the camera is dioptric (SOURCED).
- Distances MEASURED against the 250 mm scale bar, which is 62 px:
  - Collimator to echelle is about 1.67 m against 1.5 m drawn (+11%).
  - Transfer collimator to prism is about 1.33 m against 1.5 m drawn (-11%).
  - Uncertainty +-8%.
- Proposed: none.

### ESPRESSO (espressob, espressor): topology MATCHES except the field element (A1)
Screenshots F/espressob_3d.png and F/espressor_3d.png.
- The main collimator is an off-axis parabola in double pass, one for both arms (SOURCED, Megevand 2014 Sec. 3.7).
- The dichroic comes before the intermediate spectrum and is not drawn (SOURCED).
- The transfer collimators are tilted spherical mirrors, f=1500 (SOURCED); the cross-disperser is a VPH cemented to a prism (SOURCED).
- The 400 mm camera is the 2014 blue design value; the red camera focal length is not published (SCHEMATIC).
- The pupil slicer is drawn as the unsliced equivalent beam, which note3d already says (SCHEMATIC).
- The field element is WRONG (A1).

### X-Shooter (xshuvb, xshvis, xshnir): topology MATCHES, folds merged (C2)
Screenshots F/xshuvb_3d.png, F/xshvis_3d.png and F/xshnir_3d.png.
- The order is slit, fold, collimator (twice), prism (twice), echelle, field fold, camera (SOURCED, Fig. 5).
- Prisms: UVB 60 deg silica; VIS 49 deg SF6; NIR 35 deg Infrasil plus two 22 deg ZnSe. All are double pass (SOURCED).
- Cameras are lens types at f/2.73, f/2.8 and f/2.1 (SOURCED).
- The two 15 deg dichroics and the ADC are upstream of the slit and covered by All arms.

### FORS2 (fors2300v, fors2300i, fors2600b): topology MATCHES
Screenshots F/fors2300v.png and F/fors2300v_3d.png. Source: FORS2 manual P117 Fig. 2.2 and Table 2.2 (rawdata/presets/fors2/ESO_FORS2_UserManual_VLT-MAN-ESO-13100-1543_P117_3.pdf PDF p.14, F/fors2man-14.png).
- The layout is a straight in-line train with no fold: lens collimator, grism, lens camera (SOURCED).
- Table 2.2 gives "collimator focal length 1233 mm, camera focal length 280 mm" (SOURCED).
- MEASURED: slit to collimator is 403 px against a 65 px = 200 mm bar, which is 1240 mm (+0.5%).
- Proposed: none.

### MUSE (muse): topology MATCHES; camera speed schematic (B1)
Screenshots F/muse.png and F/muse_3d.png. Sources: MUSE manual Fig. 8 and Sec. 2.1.2.4.2; Cudennec+2026 ("a fully dioptric collimator, as used in MUSE and BlueMUSE"); Moralejo+2016 (three singlets plus a triplet).
- Collimator type (lens) and VPH type are SOURCED; collimator focal length and angles are effective, not published (SCHEMATIC); the camera is f/2 in the manual against f/3.87 drawn (B1).
- The slicer's 48 slits are drawn as one slit, an app-wide IFU limitation.
- Proposed: add a "schematic layout" tag.

### 4MOST LRS (4mostlb, 4mostlg, 4mostlr): topology MATCHES
Screenshots F/4mostlb_2d.png and F/4mostlb_3d.png.
- Collimator: an "Off-axis Collimator Mirror", F/3, 200 mm beam, with a Schmidt corrector per arm (SOURCED, Laurent 2016 Sec. 3.2). This confirms COL_AXIS "off" for LRS.
- VPH: Bragg angles 18.35/22.49/22.46 deg against 18.65/22.68/22.65 deg in the preset, within 0.3 deg (SOURCED).
- Camera: a three-lens dioptric f/1.73 (SOURCED).
- The dichroics and corrector are not drawn (C5). The camera angles 36.5/44.9/44.8 deg are SCHEMATIC, because the dichroic folds are not drawn.

### 4MOST HRS (4mosthb, 4mosthg, 4mosthr): camera overlaps the slit beam (A2)
Screenshots F/4mosthb_2d.png and F/4mosthb_3d.png.
- Hansen+2015 Table 1 gives "Reversed off-axis Schmidt telescope", F1.8 camera, 250 mm beam, and Haynes+2014 agrees. So COL_AXIS "off" is SOURCED.
- The real arm has dichroics, a corrector, a VPHG and a dioptric camera; the first two are not drawn.
- The as-built HRS is not public, and the 2015 concept figure has no scale. Tag all three HRS presets "schematic layout".

## 3. Elements left SCHEMATIC, and what I searched
- **HRS:** distances for slit to collimator, collimator to grating and the fold. Searched Haynes 2014, Hansen 2015, de Jong 2019 and the 4most.eu pages.
- **LRS:** dichroic and corrector spacings, and the camera geometry after the folds. Fig. 1 has no scale.
- **MUSE:** spectrograph focal lengths and angles are not published. Bacon 2010 text could not be extracted (pdftotext gave a short file), so its figures were not read.
- **ESPRESSO:** red-arm camera focal length, arm distances and pupil slicer geometry.
- **HARPS and UVES:** fold positions along the path, read by eye from Fig. 2.1 and Fig. 2.2.
- **X-Shooter:** slit-to-fold and fold-to-collimator distances. Figs. 5 and 6 have no scale.
- **COL_AXIS:** all verified "off" for LRS, HRS, UVES, FEROS, ESPRESSO and X-Shooter (UVES manual "two off-axis parabolas", FEROS manual "Off-axis Collimators", Megevand 2014 "off-axis portion of a parabolic mirror", Vernet Sec. 2.3.2 "5 deg off-axis Maksutov-type"). HARPS "off*" is upgraded to supported.
- **Tooling:** shot.js hung once when all 13 screenshots ran in one loop; individual calls with `timeout 50` worked.

## 10-line summary
1. Counts: A = 2, B = 1, C = 6 (all 19 presets covered).
2. Worst 1 (A1): ESPRESSO field mirror and field lens are on the wrong arms. Three layout figures put the mirror on the red arm and the lens on the blue; the Pepe 2021 text says the opposite. Swap the fold3d labels.
3. Worst 2 (A2): 4MOST HRS 2D camera straddles the slit beam (camera angle 89 deg, no dichroic fold). Fix with foldOn and a fold of about 90 deg; tag the preset schematic.
4. Worst 3 (B1/C1): MUSE camera is drawn f/3.87 against the real f/2 (tag schematic); UVES lacks the 45 deg slit fold before the collimator (Dekker 2000, manual Fig. 2.2).
5. X-Shooter draws the two adjacent folds (slit fold and field fold) as one element; relabel.
6. HARPS topology matches. Manual Fig. 2.1 shows a small flat at the intermediate focus (supports the fold) and off-axis, triple-pass use of one parabola (supports the "off*" call).
7. FEROS matches Fig. 1.1 of its manual; the measured distances are within 11%.
8. FORS2 matches the manual's in-line lens layout, and slit to collimator measures 1240 mm against 1233 mm.
9. LRS matches Laurent 2016 (off-axis collimator, VPH angles within 0.3 deg, f/1.73 lens camera); the corrector and dichroics are not drawn.
10. Schematic-layout tag recommended for MUSE and 4MOST HRS (3 presets).