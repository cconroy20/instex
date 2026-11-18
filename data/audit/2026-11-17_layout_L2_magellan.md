Saved by the main session from the agent's final report (the agent could not write files).

# L2_magellan layout audit (REPORT.md was refused by the Write tool, so the full report is here)

Folder: /private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/L2_magellan/
Screenshots (1800x1200): `<id>_2d.png`, `<id>_3d.png` for mikered, mikeblue, mage, fire, imacs, ldss3all (3D), ldss3blue/red (2D), m2fsmgb, ifumlsb, llamasb/g/r; `llamas_arms.png`. Source figures rasterized there: `mike_fig1-02.png` (Bernstein 2003 Fig. 1, 300 dpi), `mage_p-02.png` (Marshall 2008 Fig. 2), `m2fs_fig4hires-07.png` and `m2fs_p-07.png` (Mateo 2012 Fig. 4, 400 dpi), `bigelow-03.png` (Bigelow 2003 Fig. 1), `llpg-5.png` (LLAMAS pocket guide Fig. 6). No new downloads were needed.

## Findings

### A (wrong at a glance)
**A1. LLAMAS single-arm view (llamasb/g/r): the slit is not in the returning beam.**
- 2D puts the grating 48 mm from the collimator (20 mm = 60 px; collimator x=938, grating x=795 in `llamasg_2d.png`), inside the 200 mm focal length.
- Pocket guide Fig. 6 (`llpg-5.png`): the slit plane lies inside the returning beam and the VPHG sits at about 2f. Furesz 2020 (Fig. 8 text): the grism is at "the center of curvature of the collimator", so about 400 mm.
- The All-arms view (`llamas_arms.png`) already has the grating about 410 mm out, so the two views of one instrument disagree.
- Fix: add `layLen: 400` to the LLAMAS g-state (as Hectospec uses 2f).

**A2. M2FS 3D puts the slit/detector offset in the wrong plane.**
- build3dDoublePass offsets the slit and detector 50 mm along z (sInj = 0.6 Ly + 0.025 f), the same plane in which the prism bends the beam. `theta` is ignored.
- Mateo 2012 Fig. 4 and Table 4: the prism is a triangle only in the top view, and the fiber ends sit above the CCD in the side view, which is the echelle's dispersion plane (opening about 8-10 deg).
- The 2D view is right (2 theta = 6.6 deg in the page). MIKE's 3D offset (cross-dispersion, gamma 1.7) is correct for MIKE (Bernstein Sec. 2.3).
- Smallest change: when `P.theta > 0`, offset the slit and detector along the echelle's dispersion axis (y) instead of z. The measured offset in Fig. 3 is 50-53 mm.

**A3. The M2FS order-isolating filter is drawn nowhere.**
- `filt` only changes the numbers (app.js lines 375 and 451). The real train is fibers, filter, 124 mm field lens, injection mirror, lens group (Mateo Sec. 2.2).
- Proposed: draw a thin plate beside the slit in 2D and 3D, labeled "order filter 5130-5190 A". The field lens and injection mirror stay SCHEMATIC, absent for M2FS, IFUM and MIKE.

### B (distance or angle off by more than 20 percent)
**B1. The 2D prism position is reversed for MIKE and M2FS.**
- app.js line 642 puts the prism at 0.3 of the path from the echelle, about 120 mm in front of it. The comment cites Bernstein 2003, but that paper does not say this.
- MIKE red (Fig. 1, 1.37 px/mm from the 150 mm beam): prism about 100 mm past the last lens, about 0.7 of the path in front of the echelle.
- MIKE blue: prism 2 about 140 mm past the last lens, prism 1 about 180 mm farther on.
- M2FS (Fig. 4, 500 mm = 450 px): triplet to prism 122 mm, prism to echelle center 272 mm, triplet to echelle 394 mm. The echelle distance of 400 mm is therefore MEASURED and fine.
- The 3D view already places the prism right after the lens, so 2D and 3D disagree. Uncertainty about +-10 mm.
- Proposed: use about 0.75 instead of 0.3 in app.js for dpass, or add a preset key `xdPos`.

**B2. MIKE blue is drawn as one 62 deg prism; the real instrument has two separate 38 deg fused-silica prisms.**
- Bernstein Fig. 1 caption and Sec. 2.4 say so, and there is a clear gap between them.
- Smallest change: `xPrisms` with four entries `{glass:"silica", A:38}` and `xPasses:4`. build3dDoublePass draws one physical prism per two passes. Re-run the validator, because the order spacing will shift.

**B3. FIRE collimator-to-echelle distance is about 3.5x too short.**
- 2D draws about 180 mm (100 mm = 85 px; collimator x=805, echelle x=655).
- Simcoe 2013 Table 2: Z translate 330 mm, then P1 35, gap 90, P2 35.35, gap 47, P3 24.26, gap 65 to the grating. That sums to about 627 mm (DERIVED).
- The camera entrance pupil is "27 cm before the vertex of C1" (Sec. 3.2.5). The drawn camera is about 160 mm from the echelle.
- The "spacings schematic" caption is not true for FIRE.
- Proposed: `layLen: 627` (check that the pp 2D honors it), and `xGaps: [330,90,47,65,47,70,35]` for the 3D.

**B4. IFUM draws two lenses for one lens group.**
- `ifumlsb_2d.png` shows "collimator" and "camera" lenses about 140 mm apart. The preset says it is one 500 mm group in double pass. This is the known grating-mode limit.
- The grating at about 200 mm from the lens is acceptable. Fig. 4 LoRes measures 290 mm from the triplet; text: "about 180 mm closer to the fibers" than the echelle's 394 mm, which gives 214 mm.
- Model change: allow `dpass` in grating mode. Until then tag IFUM "schematic layout: single lens drawn twice".

**B5. IMACS slit-to-grating distance is drawn about 2100 mm; Bigelow Fig. 1 measures about 1575 mm.**
- The collimator is a 650 mm singlet field lens plus a four-lens, three-group collimator forming a telephoto. This is a thin-lens simplification, and the field lens is not drawn. Rated B only if the builder measures the bench; otherwise C.

### C (smaller)
- **C1.** The 3D pp view (MagE, FIRE) draws the mirror collimator and the Schmidt mirror camera as lenses (the panel admits "mirrors drawn as lenses"). The 2D Schmidt is right: corrector, 200 mm mirror, detector in the beam.
- **C2.** MagE and FIRE 2D show one cross-disperser slab, after the echelle. Real MagE (Marshall Fig. 2): the 46 deg prism is crossed before and after the echelle. The 3D is correct: `xPre 1/xDbl 1` for MagE, and FIRE's four prisms with six passes (xPre 3, xDbl 2) match Simcoe Table 2 (P1 Infrasil single, P2 Infrasil double, P3 ZnSe double, P4 ZnSe single). Add a slab before the echelle when `xPre > 0`.
- **C3.** FIRE has a fold flat between the slit and the collimator (Table 2 surfaces 22-24). The model cannot draw a fold before the collimator. Propose `foldPre`, or tag FIRE "fold before collimator not drawn".
- **C4.** MIKE 2D draws the returning beam 4.0 deg off the incoming one. The real offset is 30 mm out of plane, and the caption discloses this. The MIKE red note says orders 37-70; the Disperser box shows 34-70.
- **C5.** LDSS-3 spacings are unsourced (schematic).
- **C6.** The LLAMAS single-arm 3D is crowded, and the slit label overlaps the detector; this should clear after A1.

## Per-preset verdicts
- **mikered, mikeblue: topology MATCHES, geometry DIFFERS (B1, B2).**
  - Lens group in double pass: SOURCED. Echelle at 400/600 mm from the stop: SOURCED, and about 354 mm from the last lens vertex MEASURED on Fig. 1.
  - Prism: 3D matches, 2D wrong (B1). Blue prism count wrong (B2).
  - Injection optics offset about 30 mm cross-dispersion (Sec. 2.3): SOURCED. Dichroic, field lens, fold mirror: SCHEMATIC.
  - No schematic tag needed.
- **mage: MATCHES.**
  - Off-axis paraboloid 1094 mm, 46 deg prism (double) plus 40 deg prism (single), Schmidt camera with the detector inside the beam, all SOURCED; the COL_AXIS "off" holds.
  - Only C1 and C2 apply. Spacings are SCHEMATIC (Fig. 2 has no scale).
- **fire: topology matches except the missing pre-collimator fold (C3); distances DIFFER (B3).**
  - OAP f 555 with 90.6 mm decenter, six prism passes and the refractive CaF2 / S-FTM-16 / CaF2 camera are SOURCED.
  - Collimator to echelle WRONG (B3).
- **imacs (f/4): MATCHES.**
  - Refractive collimator, grating at the intersection of the main and long-camera axes, camera axis about 45 deg (MEASURED from Bigelow Fig. 1, +-3 deg), no fold mirrors in grating mode, gratings for f/4 and grisms for f/2: all consistent with Dressler 2011 and Bigelow.
  - Field lens missing; B5.
- **ldss3all/blue/red: MATCHES.**
  - Straight-through: mask, collimator, filter/grism, camera, external detector (LCO manual).
  - Collimator 746.8 mm SOURCED; all other spacings SCHEMATIC.
- **m2fsmgb: 2D MATCHES, 3D DIFFERS (A2); filter missing (A3); prism 2D position wrong (B1).**
  - Echelle distance 394 mm MEASURED (+-10 mm) and the 20-23 deg echelle tilt MATCH.
  - The singlet and triplet are drawn as one thin lens (SCHEMATIC; the gap is MEASURED at 294 mm).
- **ifumlsb: DIFFERS (B4).** Missing blank filter (A3). Grating distance within about 30%.
- **llamasb/g/r: slit and on-axis 200 mm collimator MATCH; grating distance WRONG (A1).**
  - The dichroics are drawn only in All-arms. The order (690 nm first, with the slit plate embedded in it, then 475 nm) is SOURCED (Furesz Sec. 3.3). The 45 deg angle is not published (SCHEMATIC).
  - The camera f/1.4 is SOURCED. The pocket guide gives f 90 mm for the 2017 design; the model uses 70 mm, which I did not check (outside this layout audit).
  - No tag needed after the fix.

## Left SCHEMATIC and what was searched
- IMACS lens spacing beyond the measured 45 deg camera angle (Dressler 2011, Bigelow 2003, LCO manual, Carnegie spec pages).
- LDSS-3 all spacings (LCO manual, 2006 guide, 2022 handout, Allington-Smith 1994, maskgen opticdef).
- MagE spacings and prism rotations.
- FIRE spacings are sourced (Table 2) but unused by the model. The Offner relay and cold pre-slit optics are not drawn.
- LLAMAS dichroic angles (the 2017 Fig. 6 suggests roughly 35-40 deg, not measured).
- MIKE, M2FS and IFUM injection optics (field lens, mirror) and the MIKE dichroic.

## 10-line summary
1. Counts: A = 3, B = 5, C = 6. No project file was edited.
2. Worst A1: LLAMAS single-arm view has the grating 48 mm from the collimator, so the slit is not in the returning beam. Sources put the grating at about 2f (400 mm). Fix: `layLen: 400`.
3. Worst A2: M2FS 3D offsets slit and detector in the cross-dispersion plane. Mateo Figs. 3 and 4 put the offset in the echelle's dispersion plane, perpendicular to the prism's plane. The 2D is right.
4. Worst A3: the M2FS order filter is drawn nowhere. The real order is fibers, filter, field lens, injection mirror, lens group.
5. B1: the 2D prism sits 0.3 of the path from the echelle for MIKE and M2FS. Sources put it 100-120 mm past the lens, 0.7 of the path from the echelle. The 3D is right.
6. B2: MIKE blue is drawn as one 62 deg prism; the real instrument has two 38 deg prisms with a gap. Use `xPrisms` with four 38 deg entries.
7. B3: FIRE collimator to echelle is drawn about 180 mm; Simcoe Table 2 sums to about 627 mm. B4: IFUM draws two lenses for one group. B5: IMACS slit to grating is about 2100 mm drawn against about 1575 mm measured, and the field lens is missing.
8. Topology MATCHES for MIKE, MagE (3D, camera types, prism counts and passes), FIRE (six passes, 2+2 prisms, matches Table 2), IMACS f/4 (grating, 45 deg camera, no folds) and LDSS-3. COL_AXIS holds for MagE, FIRE and LLAMAS.
9. SCHEMATIC: LDSS-3 and MagE spacings, injection optics, LLAMAS dichroic angles. Only IFUM, and FIRE if the pre-collimator fold stays undrawn, need a "schematic layout" tag; the rest need no tag.
10. The full report is the text above; the Write tool refused REPORT.md. PNGs and figure crops are in the folder named at the top.