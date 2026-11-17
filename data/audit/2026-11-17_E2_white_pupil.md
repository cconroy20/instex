# E2: the white-pupil ("wp") echelles in the Echelle 3D view

Scope: HARPS, UVES blue and red, FEROS, ESPRESSO (blue, red), G-CLEF, ZShooter (six channels). Checked: README "Echelle 3D"
(wp bullet, lines 179-182), the lSub caption and labels written by build3dFolded (web/app.js lines 1143, 1262-1394), the
wpT / fcam / W / xd entries and comments in web/presets.js. No project file edited. Text extracted to the scratchpad
(.../scratchpad/e2/) only. One new source saved (see end).

Arithmetic check of the code first: fT = P.wpT; fPh = fcam * fT / fC, with fC = W * F. All six agree with their sources'
collimator focal lengths: HARPS 208 x 7.5 = 1560; UVES 200 x 10 = 2000; FEROS 136 x (1500/136) = 1500; ESPRESSO 600 x 5 = 3000;
G-CLEF 300 x 8 = 2400; ZShooter 150 x 10 = 1500. Pupil at the cross-disperser = W * fT / fC: HARPS 208, UVES 200, FEROS 136,
ESPRESSO 300 (equivalent; real ~150 x 100), G-CLEF 200, ZShooter 125 (all DERIVED; the last three match their papers).

## Per-instrument results

### HARPS (wpT 1560)
- White pupil: YES. HARPS User Manual 2.4 Sec. 2.1 (p. 4): "the collimator in triple pass mode. A white pupil configuration has
  been adopted with the cross disperser placed at the white pupil." Same wording in Pepe, Mayor & Rupprecht 2002, Messenger 110, 9
  (saved) and the ESO HARPS page: "It is a white pupil design with the grism cross disperser placed in the white pupil ... An f/2.1
  parabolic mirror serves as collimator and is used in triple pass."
- Passes: THREE (not two). Table 2.2 (manual p. 7): "Collimator mirror Zerodur ... f=1560mm, used diameter 730mm, triple pass".
  The third pass IS the transfer collimator: there is no separate transfer mirror, so f_transfer = f_col = 1560 mm (DERIVED from
  "one collimator, triple pass"). README's "its collimator's third pass" and wpT 1560 are correct. A mirror, not a lens.
- Cross-disperser: FK5 grism 257.17 /mm blazed at 480 nm, 240 x 230 x 50 mm, at the white pupil (manual Table 2.2). xd "grism" correct.
- Camera: all dioptric, f = 728 mm (Table 2.2), as built (instrument operating since 2003). Preset fcam 728, fPh = 728: correct.
  Small oddity in the source, not the preset: "f/3.3" does not equal 728/208 = f/3.5 (DERIVED); the manual's number of groups also
  differs between the manual (3 groups) and the ESO page / Messenger (6 groups). Irrelevant to the model.
- Fold flat: NOT SUPPORTED. No saved source says what folds the beam between the second and third passes (the manual's Fig. 2.1 is a
  ray plot with no labels). The drawn flat is INFERRED from the UVES pattern ("similar to UVES").
- FINDING (low-medium): build3dFolded labels the main collimator "collimator, passed twice" for every wp preset (app.js line ~1389,
  `kind === "pp" ? "collimator" : "collimator, passed twice"`) and draws a separate "transfer collimator f = 1560 mm" optic. For HARPS
  the sources say the same mirror is used a third time. The caption says "the transfer collimator matches the main one", which is
  true but does not say it is the same mirror. Fix: for HARPS label "collimator, passed three times" and call the third optic "the
  collimator's third pass" (or add a per-preset flag, e.g. wp3: true).

### UVES blue 390 (wpT 2000, fcam 360) and red 580 (wpT 2000, fcam 500)
- White pupil: YES. UVES User Manual 117 Sec. 2.1: "The design of both arms is of the white-pupil type (Baranne, 1972 ...)";
  Sec. 2.2.2: "The blue and red mirror collimators each consist of two off-axis parabolas and two flat mirrors. They are of the
  'white pupil' type and so have two 200 mm pupils: one for the echelle, and one at the crossdisperser/camera". Dekker et al. 2000
  (SPIE 4008, p. 540): "A flat folding mirror, which also acts as interorder stray light baffle, directs the light to the pupil
  transfer collimator that re-collimates the beam and provides a second pupil at the crossdisperser grating."
- Passes: main collimator TWICE, then a separate off-axis-parabola transfer collimator (a mirror). Manual Fig. 2.1 caption: "flat
  mirror, first collimator, echelle grating, first collimator, linear flat mirror, second collimator, and into the camera".
  Dekker: the white-pupil layout "needs at least 3 reflections while in UVES it was necessary to add 2 flats" (one flat before the
  collimator, one intermediate). So the fold flat is real for UVES (intermediate-spectrum flat).
- Transfer focal length: 2000 mm is NOT stated anywhere. It is DERIVED: the manual's "two 200 mm pupils" and the same f/10 beam at
  the intermediate focus force f_transfer / 10 = 200 mm, i.e. f_T = 2000 = f_col (Dekker p. 536: collimator f reduced "from 3m to
  2m" by the F/10 slit optics). Correct, but README/presets state it as if published. Mark DERIVED.
- Cross-disperser: reflection gratings on turrets at the second pupil. Manual Table 2.2: CD#2 660 /mm (370-500 nm), CD#3 600 /mm
  (420-680 nm). xd "grating" 660 and 600: correct. The camera-collimator angles (46.0, 45.336 deg) come from the pipeline physical
  model (already audited).
- Cameras: dioptric, "focal lengths of 360 and 500 mm" with "entrance apertures of 210 and 230 mm" (manual Sec. 2.2.2); Dekker Table 6
  F/1.8 (blue), F/2.5 (red), nominal pupil 200 mm. fcam 360 / 500 correct; 360/200 = f/1.8, 500/200 = f/2.5 (DERIVED).
  With fT = fC the caption prints "the transfer collimator matches the main one" and omits the camera: fine.

### FEROS (wpT 1500, fcam 410)
- White pupil: YES. FEROS Final Design Report Ch. 3 (and the ESO/LSW page): "The fibers are re-imaged on the Echelle grating through
  the first collimator, the Main Collimator. Then, the light goes back to the Main Collimator and is reflected by the Folding
  Mirror to the second collimator, the Transfer Collimator. The entrance surface of the prism crossdisperser is located near the
  pupil image and the light is finally imaged by the dioptric camera on the detector."
- Passes: main collimator twice, then a separate transfer collimator. FDR Sec. 3.4: "The collimators are two off-axis paraboloids
  in symmetrical mountings. They are segments of the same paraboloid with a focal length of 1500 mm and a diameter of 660 mm"
  (mirrors). So wpT 1500 is published. The flat "Folding Mirror" is real.
- Cross-disperser: one LF5 prism, 55 deg apex, single pass at minimum deviation, entrance face at the white pupil (FDR Sec. 3.7;
  Kaufer & Pasquini 1998 Sec. 2). Preset xd "prism", xPasses 1, xA 56 (EFFECTIVE, declared in the note): correct.
- Camera: dioptric, f = 410 mm, f/3.0, as built (FDR Sec. 3.8.2; KP98 Sec. 2.3: "an effective f/3.0 system with a focal length of
  410 mm"). fPh = 410: correct. No error found for FEROS.

### ESPRESSO (wpT 1500, fcam 800, W 600)
- White pupil: YES, "asymmetric" (Pepe et al. 2021 Sec. 3.1.5: "For each channel a specific (spherical) transfer collimator re-images
  the white pupil of the Echelle grating onto the cross-dispersers"; "The transfer collimator is a tilted sphere with a focal length
  much shorter than the main collimator; this significantly reduces the beam size on the cross-dispersers (asymmetric white pupil)").
  Megevand et al. 2014 Sec. 3.7: "The main collimator is an off-axis portion of a parabolic mirror, used in double pass".
- Passes: main collimator TWICE (one for both arms). Transfer: tilted spherical MIRRORS BTM/RTM, R 3000 mm, f = 1500 mm (EST14 Table 1
  as recorded in data/round5/espresso.md; f = R/2 DERIVED). wpT 1500 is correct; f_T/f_col = 1500/3000 = 0.5 reproduces the ~150 x 100
  mm white pupil from the 300 x 200 mm echelle beam (ER14 Sec. 2).
- Dichroic: before the intermediate spectrum (Pepe 2021: "A dichroic beamsplitter placed before the intermediate spectrum sends the
  light to the blue and the red channels"; Megevand: cut 525 nm "Immediately after these two elements"), so each arm has its own
  transfer mirror and everything from the dichroic on is arm-specific. The 3D draws one arm: fine.
- Fold element: NOT a flat. At the intermediate focus the blue arm has a field MIRROR (PM, sphere R 12580 mm) and the red arm a field
  LENS (FL, BSL7Y) (Pepe 2021 Sec. 3.1.5; EST14 Table 1). README ("a flat folds it") and the drawn "flat" do not describe ESPRESSO.
- Cross-disperser: a VPH grating cemented to an entrance prism (fused silica, apex 22.2 deg blue, 25.25 deg red; 1.5x anamorphic),
  i.e. a VPH grism, in the white pupil (Pepe 2021: "A prism cemented to the VPH lifts the residual 1:1.5 anamorphism"). Preset
  xd "vph" with an EFFECTIVE line density; the label "VPH grating" omits the prism. Acceptable as stated in the note; the 3D caption
  could say "VPH grating on a prism".
- Camera: README's "ESPRESSO 400 mm ... as built" is NOT as built. 400 mm is Pepe et al. 2014 (Astron. Nachr. 335, 8) Sec. 3.5, the
  design-phase BLUE camera: "The blue camera ... has an entrance aperture of 150x150 mm, a Focal length of 400 mm at 450 nm and a focal
  ratio of F/2.6". The red camera's focal length and the as-built values are not published (Pepe 2021 gives no number). The research
  record data/round5/espresso.md derives 755 mm effective from Pepe 2021 Table 2 (all 18 rows 749-758 mm), i.e. a physical camera
  of 755 x 1500/3000 = 377.5 mm (DERIVED), 6% shorter than 400 mm; the pixel-scale mismatch (0.467 vs published 0.49 km/s) is the
  known tension. So fPh = 400 should be labeled "design (2014, blue)" and the README's "as built" removed or qualified.
- Drawn scale: the drawing uses the unsliced EQUIVALENT beam (W = 600 mm at the echelle, 300 mm at the cross-disperser, 3000 mm
  collimator, f/5, 4 spectra). The real beam is the pupil slicer's two 300 x 200 mm slices, a 1200 mm echelle mosaic and a ~150 x 100
  mm pupil (then 150 x 150 mm after the prism). Neither the README nor the caption says the drawn pupil sizes are equivalent
  (the preset note does). Low severity; add "equivalent unsliced beam" to the ESPRESSO caption.

### G-CLEF (wpT 1600, fcam 675, W 300; 2016 design, not built)
- White pupil: YES, asymmetric. Szentgyorgyi et al. 2016 (SPIE 9908, 990822) Sec. 2: "The GCSPECT is an asymmetric white pupil design".
  Table 2 (verbatim): "Collimator focal length 2400 mm; Pupil Xfer focal length 1600 mm; Pup.Xfer Mirr./Cam. 450/1600 = Reduction
  0.2813; Camera Beam Diameter 200 mm; Camera Focal Length 450 mm; Spectrograph Beam Diameter 300 mm". wpT 1600 correct;
  450 x 2400/1600 = 675 (DERIVED) correct. The "two thirds" note (GC16D Sec. 2.2/GC18D Sec. 3: pupil-transfer focal length 2/3 of M1).
- Passes: M1 (off-axis parabola) twice; separate pupil-transfer mirror M2 (conic -0.97 ellipsoid), a mirror (data/presets_research.md,
  GC16D Table 5: "M2 3200Cc Ellipsoidal: -0.97 250x500 Pupil-Transfer Mirror").
- Fold element: a cylindrical Mangin-type fold MIRROR 40 mm before the intermediate focus ("A Mangin-type fold mirror intercepts the
  beams reflected from M1 40mm before arriving at an intermediate focus and reflects them towards the pupil-transfer mirror"),
  also field flattener. Not a flat; README/caption "flat" is a simplification.
- Cross-disperser: red = VPH grating (480 /mm, first order, optimized 7300 A) sandwiched between two 20 mm fused-silica plates,
  375 mm after the dichroic back surface, in the 200 mm beam (GC16D Sec. 2.2); blue = VPH grism. Preset xd "vph" for the red arm:
  correct. The drawing puts it exactly at the pupil; the paper places it 375 mm after the dichroic (the pupil's location is not
  stated), consistent with the "schematic spacings" caveat. The dichroic (540 nm split, 15 deg) sits between M2 and the XD and is not drawn.
- Camera: 450 mm, 7 lenses, red camera "beam diameter of 250 mm" (GC16D Sec. 2.3; the camera was reduced from 500 to 450 mm after
  PDR). It is a DESIGN value for an unbuilt instrument: README's "as built" is wrong for G-CLEF. (The 2018 papers/2023 G@M changes:
  echelle 75.6 vs 75.96, 320 x 1600 mm in 2023; focal lengths not re-checked beyond the records.)

### ZShooter (wpT 1250, fcam 270, W 150; design)
- White pupil: YES, asymmetric. ZSpec page (zshooter_zspec_optical.html, "Echelles and white-pupil relay"): "The first parabolic
  collimator has a 1,500 mm focal length and forms a 150 mm pupil on an R2 echelle. ... The return beam passes through a silica
  Mangin mirror at the intermediate white-light slit. A second, 1,250 mm collimator forms a 125 mm white pupil, reducing the aperture
  required by the channel optics. Two dichroics near that pupil divide each spectrometer into three arms. ... The cross-dispersers
  operate in first-order transmission. The working technology is VPH".
- Passes: first collimator twice (layout figure "Collimator 1 of 2" twice, per data/audit/2026-11-16_zshooter.md; the irdb throughput
  list ZShooter_v2/optics/LIST_zspec_vis_optics.dat has VIS_Col1_1 and VIS_Col1_2, two reflections, then VIS_Mangin_AR / VIS_Mangin_Mirror,
  then VIS_Col2: INFERRED that Col2 is a single reflection, i.e. a mirror; the website does not say mirror or lens).
- Fold element: a silica MANGIN MIRROR at the intermediate slit (curved, not a flat) per the page. Again not a flat.
- Cross-disperser: VPH, in the 125 mm white pupil, after the dichroics (six: B 2000, G 1100, R 625, YJ 350, H 300, K 270 /mm), correct.
- Camera: "five-element, air-spaced refractive design with 225 mm focal length at f/1.8" (ZSpec Cameras); 225/125 = f/1.8 (DERIVED).
  225 x 1500/1250 = 270 mm (DERIVED, also stated in zs-scopesim resolution-and-sampling.md: "225(1500/1250)=270 mm"). Correct, but
  it is a DESIGN value (June 2026 Zemax), so "as built" is wrong here too.

## README / caption / preset-comment claims

| claim | verdict |
|---|---|
| wp = "the collimator again forms the spectrum with the orders overlapping" | Correct for all six (UVES manual "intermediate spectrum"; Pepe 2021 "white spectrum"). |
| "a flat folds it to the transfer collimator" | True for UVES (two flats) and FEROS ("Folding Mirror"); HARPS not documented; ESPRESSO (field mirror / field lens), G-CLEF (cylindrical Mangin mirror) and ZShooter (silica Mangin mirror) fold with a curved element. Suggest "a fold mirror (a Mangin or field element in G-CLEF, ZShooter, ESPRESSO)" or leave as drawn-as-flat. |
| "HARPS 1560 mm, its collimator's third pass; UVES 2000; FEROS 1500; ESPRESSO 1500; G-CLEF 1600; ZShooter 1250" | All six values correct. UVES 2000 is DERIVED (not printed). |
| "which re-forms the pupil, where the cross-disperser stands" | Correct for all six (the XD is at the white pupil per each source; G-CLEF's is 375 mm past the dichroic, schematic). |
| "then the camera as built (f_cam x f_transfer / f_col: ESPRESSO 400, G-CLEF 450, ZShooter 225 mm)" | Arithmetic correct for all three (800 x 1500/3000, 675 x 1600/2400, 270 x 1250/1500). "As built" is WRONG for G-CLEF and ZShooter (designs) and unsupported for ESPRESSO (400 is the 2014 design value; 377.5 DERIVED from the as-built pixel sizes). Same wording in the app.js caption ("the camera as built", `fPh`) and the comment at line 1143. |
| lSub: "the transfer collimator matches the main one" (fT === fC && wpT > 0) | Prints for HARPS (same mirror), UVES and FEROS: true for all three; for HARPS it is the same mirror. |
| label "collimator, passed twice" for all wp | Wrong for HARPS (three passes). |
| README "mirrors drawn as lenses, unfolded but for the flat" | Fine. |

Also fine: the in-code comment (app.js lines 1127-1130) and preset note statements: FEROS "white-pupil collimator mirrors 1500 mm (beam 136 mm)", UVES "white-pupil collimator mirror 2000 mm, beam 200 mm", HARPS "f_col 1560 mm (208 mm beam, f/7.5)", G-CLEF "(450 mm on the 200 mm transferred beam, derived)", ZShooter "225 mm f/1.8 camera on the 125 mm white pupil". ESPRESSO preset note "camera 800 mm (the design: 400 mm x the 2:1 transfer)" correctly says design; only the README's "as built" is off.

## Summary (final-message form)

(a) Confirmed errors, ranked
1. README line 182, app.js lSub ("the camera as built") and line 1143 comment: "as built" is false for G-CLEF (2016 design, unbuilt) and ZShooter (June 2026 design), and unsupported for ESPRESSO, whose 400 mm is the 2014 design-phase blue camera (Pepe+2014 Sec. 3.5: "Focal length of 400 mm at 450 nm"); EP21 Table 2 pixel scales imply ~377.5 mm (DERIVED, data/round5/espresso.md). Fix: say "the camera of the design" (ESPRESSO: "2014 design, blue camera"), drop "as built".
2. HARPS collimator is used three times, with no separate transfer mirror (manual Sec. 2.1 and Table 2.2 "triple pass"; Pepe+2002 Messenger 110). build3dFolded labels every wp collimator "collimator, passed twice" and draws a separate transfer collimator. Fix: label HARPS "passed three times" and its third optic the collimator's third pass.
3. README and caption say a "flat" folds the intermediate spectrum: true only for UVES and FEROS; ESPRESSO has a field mirror (blue) / field lens (red), G-CLEF a cylindrical Mangin fold mirror, ZShooter a silica Mangin mirror. HARPS's fold unsourced.
4. ESPRESSO is drawn with the unsliced equivalent beam (W 600, 300 mm pupil) while the real beams are 300 x 200 and ~150 x 100 mm; caption does not say so.
5. ESPRESSO's cross-disperser is a VPH on an entrance prism (apex 22.2/25.25 deg), drawn and labeled "VPH grating".

(b) Confirmed, with source
- wpT: HARPS 1560 (manual Table 2.2, "triple pass"; collimator f = 1560 mm); UVES 2000 (DERIVED from the manual's two 200 mm pupils and Dekker 2000 "collimator focal length from 3m to 2m"); FEROS 1500 (FDR Sec. 3.4 "segments of the same paraboloid ... 1500 mm"); ESPRESSO 1500 (EST14 Table 1 R3000 spheres, EP21 Sec. 3.1.5); G-CLEF 1600 (GC16D Table 2/5); ZShooter 1250 (ZSpec "second, 1,250 mm collimator").
- All six are white-pupil designs with the cross-disperser at the white pupil; UVES, FEROS, ESPRESSO, G-CLEF, ZShooter use the main collimator twice plus a separate mirror transfer collimator.
- Cross-dispersers: HARPS FK5 grism 257.17 /mm; UVES reflection gratings 660/600 /mm; FEROS LF5 prism 55 deg single pass; ESPRESSO VPH on prism; G-CLEF red VPH 480 /mm (blue a VPH grism); ZShooter VPH.
- Cameras (focal length in mm): HARPS 728 (built), UVES 360/500 (built), FEROS 410 (built), G-CLEF 450 (design), ZShooter 225 (design), ESPRESSO 400 (design, 2014). 450 x 2400/1600 = 675 and 225 x 1500/1250 = 270 and 400 x 3000/1500 = 800 are arithmetically correct.
- Beams: HARPS 208, UVES 200, FEROS 136, G-CLEF 300 -> 200, ZShooter 150 -> 125, ESPRESSO 300 x 200 -> ~150 x 100.

(c) Unsupported / unsourced
- UVES transfer f = 2000 mm is derived, not printed. HARPS fold element between passes 2 and 3 (flat or not) not in any saved source. ZShooter second collimator is a mirror only by INFERENCE from the irdb throughput list (VIS_Col2 reflection). ESPRESSO red camera focal length and as-built camera values not published. G-CLEF XD distance from the pupil not stated (375 mm after the dichroic back surface only). HARPS camera "f/3.3" vs 728/208 = f/3.5 unexplained in the source.

(d) New source saved
- rawdata/presets/harps/new_E2/Pepe2002_Messenger110_9_HARPS_messenger-no110.pdf (Pepe, Mayor, Rupprecht 2002, Messenger 110, 9; from eso.org Messenger archive; read with pdftotext only). Confirms "triple pass", grism at the white pupil, f = 1560 mm, camera 728 mm; no fold-element detail.
