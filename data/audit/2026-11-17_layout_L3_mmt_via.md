Saved by the main session from the agent's final report (the agent could not write files).

# L3_mmt_via layout audit

REPORT.md was NOT written to disk. The write was blocked because subagents may not write report files, so the full report is below. Screenshots and source rasters are in /private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/L3_mmt_via/.

Files in that folder:
- App screenshots: s_via, s3d_via, s3d_via_top, s_boomboxb, s_boomboxr, arms_bb, s_hectospec, s3d_hectospec, s_hectochelle, s_binospec, s3d_binospec, e3d_gclef, e3d_gclef_top, e3d_zshb, e3d_zshb_top (all .png).
- Source rasters: via-1.png (Zemax Via layout), bb-1.png (Zemax Boombox layout), hhm39-050.png (Hectospec Hardware Manual Fig. 39), s11p-04.png (Hectochelle Fig. 2), b19p-03.png (Binospec Figs. 1-2), gc12-06.png, gc14-10.png (G-CLEF layouts).
- ZShooter layout image: ~/memos/instex/rawdata/presets/zshooter/zshooter__images_integrated-layout.png.
- Text dumps of the papers (f05.txt, hhm.txt, hom.txt, s11.txt, b19.txt, gc_*.txt).

No project file was edited. Distances are read from rasters against a known scale (about ±5-10%). Hectospec, Hectochelle and Binospec distances come exactly from their prescription tables.

## 1. Findings by visibility

### A (wrong at a glance)
- **A1. Boombox All-arms view has no fold in the red arm.**
  - The Zemax layout (bb-1.png) transmits the red beam through the dichroic, then turns it 90 deg with a 45 deg flat before the red grating.
  - web/arms.js even says "the red transmitted to a fold mirror", but arms_bb.png runs the red beam straight from dichroic to grating.
  - The single-arm spectrograph views (s_boomboxb/r) show no dichroic and no fold at all, so they look like a one-channel instrument.
- **A2. Hectospec and Hectochelle 3D/Spatial draw the catadioptric camera as a plain lens** (s3d_hectospec.png).
  - The real camera is a corrector pair plus a spherical mirror with the detector inside the beam.
  - README line 57 documents this. It counts as A only by the brief's rubric; if the owner accepts it, it drops to C. The 2D view is right.

### B (off by more than ~20%)
- **B1. G-CLEF 3D: collimator-to-echelle is drawn about 1.04 m; the source gives about 2.65 m.**
  - Drawn: e3d_gclef_top.png, slit-to-collimator 357 px = 2400 mm, collimator-to-echelle 155 px.
  - Real: G-CLEF SPIE 9147 Fig. 8 puts the collimator at 2400 mm from the slit and the echelle center at 555 px, about 2650 mm. SPIE 8446 Fig. 3 gives about 2830 mm.
  - The drawing footnote calls this spacing schematic, but it is in the sources.
- **B2. ZShooter 3D (all six channels): collimator-to-echelle is drawn about 0.53 m; the layout image gives about 1.5 m (1.5-1.7 m allowing for foreshortening).**
  - Measured on the integrated-layout PNG: 730 px against the 1 m bar at 485 px.
  - The echelle stands beside the Mangin and white-light slit.
- **B3. Via: grating-to-detector is drawn 812 mm, real 1068 mm (24% short).**
  - Scale: the slit-to-collimator distance of 1375 mm equals 1375 px. The 500 mm bar agrees to 2%.
  - The real camera has six elements (technical.tex line 355). Its first element stands about 240 mm after the grating.
  - The drawing has one thin lens at 409 mm.
- **B4. Boombox 2D: the camera arm is far too short in both channels.**
  - Collimator-to-grating is drawn about 56 mm; the bench layout gives about 343 mm (144 + 199 mm in blue, 144 + 76 + 124 mm in red).
  - Grating-to-detector is drawn 153 mm; real is 342 mm (blue) and 304 mm (red).
- **B5. Boombox red camera angle is drawn 40.0 deg; the bench layout gives 48.6 deg.**
  - The preset note already flags the red grating as an open question. The blue angle checks (38.4 drawn, 38 real).
- **B6. Binospec: grating-to-detector is drawn about 870 mm, real about 1215 mm (28% short).**
  - Real value: the Fig. 1 caption gives 2.9 m total. The Table 1 path to the grating is 1685 mm, so the camera arm is about 1215 mm.
- **B7. Binospec has three real fold mirrors and the drawing has none.**
  - Two periscope flats sit under the slit mask. A 90 deg fold (Table 1 surface 21) stands between collimator groups 2 and 3, at about 1001 of the 1685 mm path.
  - The model puts a fold only between collimator and grating, so it cannot place this one.
- **B8 (marginal). Hectospec corrector is drawn about 735 mm from the grating; the prescription gives 546 mm (first surface) and about 620 mm (pair center).**
  - Source: HOM07 Sec. 3.2.2, surface 6 thickness 546.100.
  - Mirror (real 1828 mm, drawn about 1930) and detector (real 1399 mm, drawn about 1500) are within 8%.

### C (smaller)
- **C1. Hectochelle: the order-sorting filter pair is not drawn.** S11 Fig. 2 labels "Fiber Slit & Order Separating Filter", and the text puts the filters "in the parallel return beam" directly in front of the shutter.
- **C2. Hectospec and Hectochelle are mirror images of their published layouts** (Fig. 39 and Fig. 2). Physically equivalent. `gFlip:true` would reproduce the figures' handedness.
- **C3. Dichroics are missing in the echelle 3D views.** ZShooter has two near the white pupil, splitting each spectrometer into three arms. G-CLEF has one at the white pupil (SPIE 8446: the pupil forms "on a dichroic").
- **C4. ZShooter's COL_AXIS "off*" (INFERRED) can now be settled.**
  - zshooter_zspec_optical.html says: "The first parabolic collimator has a 1,500 mm focal length ... A 0.6° out-of-plane tilt separates the returning dispersed beam from the entrance slit."
  - That is near-on-axis use, tilt-separated, like UVES. I suggest the class "on (tilt-separated)".
  - The 3D drawing is unaffected (its footnote already discloses the exaggerated 8.6 deg separation).
- **C5. Every multi-element collimator or camera is one thin-lens glyph.** Schematic by design, but it causes B3, B4 and B6.
- **C6. No text errors found** in the Via, Hectospec, Hectochelle or Boombox notes against their sources.
- **C7. G-CLEF echelle size (1237×300 mm drawn vs 1200×300 mm triple mosaic) is fine.** With B1 fixed the proportions will match the stated 1.7×3.6 m footprint.

**Counts: A 2 (one is a documented limitation), B 8 (one marginal), C 7.**

## 2. Per preset

**Via (id via): topology MATCHES; the camera arm is short.**
- Independently re-measured from ViaSpec_bench_layout.pdf, scale set by slit-to-collimator = 1375 mm:
  - Fold deviation is 112.6 deg (preset 112.9).
  - Collimator to fold hit is 2153 mm and fold to grating 605 mm, total 2758 mm (preset path 2750), fold at 0.78.
  - The beam-to-camera angle is 67.3 deg (app 67.1) and the grating plane is 34.7 deg from vertical (preset 33.57).
  - gFlip side and the vertical detector match.
- The collimator is on-axis (technical.tex: "800 mm diameter spherical mirror ... pupil image on the face of the grating").
- Camera arm: B3. The 3D view is consistent with the 2D.
- Proposed: no change to sourced keys. Add a `camLen` drawing key (mm from disperser to the camera glyph, replacing the automatic d2 at app.js ~630-633). For Via, put the thin lens near the effective principal plane, about 660 mm from the grating.

**Boombox blue and red (ids boomboxb, boomboxr): topology DIFFERS.**
- Source: Boombox_bench_layout.pdf and technical.tex line 420. The fiber-cone check passes (258 mm slit-to-collimator, preset 260).
- What matches:
  - Dichroic AOI is 22.5 deg, turning the blue 135 deg, in the All-arms view.
  - Blue camera angle is 38 deg.
- What differs:
  - Red fold missing (A1).
  - Collimator-to-grating and grating-to-detector distances (B4).
  - Red camera angle (B5).
  - Single lens in place of a triplet and multi-element cameras (schematic).
- Proposed:
  - In arms.js, add a flat 90 deg fold between the dichroic and red grating, 76 mm after the dichroic and 124 mm before the grating, on the same side as the blue camera.
  - In the preset, `layLen: 343` plus a `camLen` key.
  - State in the caption that the drawn red angle is not the bench's.
- Keep the "(partly inferred)" tag.

**Hectospec (id hectospec): topology MATCHES.**
- Verified against Hardware Manual Fig. 39 and the HOM07 Zemax table:
  - On-axis spherical collimator with the slit on the axis line; the same figure shows the fiber feed at y = 400 on the 412 line.
  - Collimator to grating is 2748.8 mm (preset 2749).
  - Camera angle is 35 deg.
  - The camera is catadioptric with a two-lens corrector and the detector inside the beam.
  - No fold mirrors.
- Only the corrector distance is off (B8). Handedness is a mirror image (C2).
- Proposed: optional `gFlip:true`. No schematic tag needed.

**Hectochelle (id hectochelle): MATCHES except the missing filter (C1).**
- S11 Table 2 distances all agree within about 5%:
  - Corrector at 2032-2130 mm (drawn about 2133 mm).
  - Mirror at 4264 mm (drawn about 4090 mm).
  - Detector at 3575 mm (drawn about 3400 mm).
- Collimator 2737 mm and the 15 deg camera angle are SOURCED. The slit is on the collimator axis in Fig. 2.
- The slit is curved (R 1371.6 mm), which the model cannot draw; the effect is small.
- Proposed: a thin filter glyph next to the slit when `filt` is set. No schematic tag.

**Binospec (id binospec): topology DIFFERS** (three folds missing, B7; multi-group lenses as one glyph).
- The 45 deg camera-collimator angle is SOURCED (BDS08).
- Collimator distances are fine (lens at about 1073 mm vs group centers at 1000-1260 mm; lens-to-grating 420 mm vs about 475 mm).
- Proposed:
  - Allow `foldPos` below 0 (fold on the slit side of the lens) so a 90 deg fold can be drawn, or as a stopgap `foldOn:true, foldAng:90, foldPos:0.35`.
  - Add `camLen` (B6).
  - Note the missing periscope pair in the preset text.

**G-CLEF red (id gclef): 3D topology matches except the dichroic.**
- The sequence matches: Mangin fold at the slit, off-axis paraboloid collimator 2400 mm in double pass, echelle, M2 1600 mm (drawn 1.60 m; Fig. 8 gives 1660 mm), VPH, camera.
- COL_AXIS "off" is right (SPIE 8446: "diced out of a 1094 mm parent parabola").
- Problems: spacing (B1) and the missing dichroic (C3).
- Proposed: `e.layLen: 2650`. Keep the "(design)" tag.

**ZShooter b, g, r, yj, h, k (ids zshb ... zshk): topology MATCHES.**
- The sequence matches: 1500 mm collimator, R2 echelle, Mangin at the white-light slit, 1250 mm transfer collimator, VPH, 225 mm camera.
- The 0.6 deg tilt is sourced, with the drawn exaggeration disclosed.
- Problems: spacing (B2) and no dichroics (C3).
- Collimator axis: settled as in C4.
- Proposed: `e.layLen: 1500`. Keep the "(design)" tag.

## 3. Left schematic, and what I searched
- **Schematic elements:**
  - Single thin-lens glyphs for all multi-element collimators and cameras.
  - Lens-camera arm length, which the model sets automatically.
  - Binospec's periscope pair and second beam.
  - Boombox per-arm triplet.
  - Hectochelle's curved slit.
  - ZShooter's three-channel fan-out and detector rotation.
  - G-CLEF blue arm.
- **Searched:**
  - technical.tex, plus the Via and Boombox Zemax PDFs rasterized.
  - Hectospec hardware and observers manuals.
  - Hectochelle PASP paper.
  - Binospec PASP paper.
  - Five G-CLEF SPIE papers.
  - ZShooter site dumps and layout PNG.
- **Not found:**
  - A Binospec Zemax view of the grating arm; only the 3D CAD of Fig. 2 exists.
  - A scaled G-CLEF drawing; distances are taken from the stated 2400 mm and 1600 mm and the 1.7×3.6 m footprint.
  - ZShooter distances in text; they come from the layout image against its 1 m bar.

## Summary (10 lines)
1. L3_mmt_via: 2 A, 8 B (one marginal), 7 C findings.
2. A1: the Boombox All-arms view lacks the red-arm 90 deg fold, and the single-arm view has no dichroic (bench layout bb-1.png, technical.tex line 420).
3. A2: the Hectospec and Hectochelle 3D views draw the catadioptric camera as a lens (documented in README line 57).
4. B1/B2: the echelle sits too near the collimator in the 3D views. G-CLEF is about 1.0 m drawn against about 2.65 m real; ZShooter about 0.53 m against about 1.5 m. Fix with `e.layLen` 2650 and 1500.
5. B3/B4/B6: lens-camera arms are 24-55% short (Via 812 vs 1068 mm; Boombox 153 vs 342 mm and collimator-to-grating 56 vs 343 mm; Binospec 870 vs 1215 mm). A `camLen` drawing key would fix all.
6. B5/B7/B8: Boombox red camera angle 40 vs 48.6 deg; Binospec's three fold mirrors missing; Hectospec corrector 735 vs 546-620 mm.
7. Via independently re-measured: fold 112.6 deg, path 2758 mm, fold at 0.78, and camera angle 67.3 deg all match the preset.
8. Hectospec and Hectochelle topology, collimator on-axis, 2749/2737 mm and the 35/15 deg angles all match their sources. Hectochelle's order-sorting filter is not drawn.
9. ZShooter's COL_AXIS "off*" can be settled from the website: a 0.6 deg out-of-plane tilt on the 1500 mm collimator means near-on-axis, tilt-separated use.
10. Worst three: B1/B2 echelle spacing, B4 Boombox arm lengths plus A1 red-arm fold, B3/B6 single-lens camera arms.
