Saved by the main session from the agent's final report (the agent could not write files).

# T2_tel layout audit (vista, mmt, blanco, sdss, mayall, rubin, oschin, gemini, hale, tmt, lbt)

Note: the Write tool refused to create REPORT.md ("subagents should return findings as text"), so the full report is below and no REPORT.md exists. Working folder: /private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/T2_tel/. Contents: png/ (76 screenshots, 2D and 3D, all 38 foci), crop/ (820x626 crops and four-up montages m2d_0..9.png, m3d_0..9.png in list.txt order), geom.js and geom_out.txt (model geometry dump per focus), luci_p11-11.png, hole_mmt_f5s_vs_f15.png. No project file was edited. I used the saved sources only (rawdata/telescopes, data/telescopes/*.md, BAT yaml); no new downloads or web searches.

## 1. Findings ranked

### A. Wrong at a glance

**A1. LBT 3D: bent foci point the wrong way on one of the two telescopes; the LBTI (center) focus points OUTWARD on SX.**
- web/tel3d.js lines 275-281 and web/tel3dgl.js lines 342-348 draw the second LBT as the SX side translated by +/-7.2085 m (`sh(q,d)` adds d to x). It is a translation, not a mirror image.
- Evidence (crop/m3d_9.png): "bgf" (side "up") draws both beams toward +x (SX inboard, correct; DX outboard, wrong). "lbti" (side "down") draws both toward -x (SX outboard, wrong; DX inboard).
- Real: Rothberg et al. 2016 (rawdata/telescopes/lbt/Rothberg2016_SPIE9906_LBTO_instruments_arXiv1608.00037.pdf), LUCI mask-exchange paragraph: "a platform on the telescope (located between the SX and DX mirrors where the bent Gregorian foci are located)". LBTI is "between the two 8.4 m primary mirrors" (LTM Sec. 2.1, lbt.md l. 183). LUCI manual Fig. 1 (PDF p. 11, luci_p11-11.png): both LUCIs inboard of their mirrors.
- Fix: mirror the +h copy about x = 0 (negate x of points and strut directions); set SX "lbti" to the inboard side (`side: "up"`, as bgf already is). The hand-set DX prime-focus strut override in preset `pfr` then becomes unnecessary.

**A2. Hale coude (f/30) drawn as a straight Cassegrain with no fold.**
- Drawn: secondary at 13.75 m, focus 13.69 m behind the vertex on the optic axis, 2 reflections. The preset's own refl "3 (one flat) or 5 (three flats)" contradicts it.
- Real: hale.md quoting Bowen 1961 Sec. 1: "The flat at the intersection of the optic and polar axes is mounted on a tube 36-inches in diameter extending up through the hole in the main mirror"; one flat south of +43 deg, three flats for northern objects. The fieldNote admits "drawn unfolded".
- Smallest change: coude focus `nasmyth: true, side: "down", a3: 0, backN: 2.694`, delete `back`. Then b = backN*D - a3 = 13.69 m, so the secondary and path length are unchanged and one flat appears at the vertex plane (a3 = 0 INFERRED). Tag the coude focus "schematic layout" (the polar-axis direction cannot be drawn in the page plane).

### B. Distance or size off by more than ~20%

**B1. Rubin camera focal plane and camera body.**
- Drawn focus 5226 mm above M1's vertex (imager.js constant 0.85 s); real 4429 mm (BAT batoid_LSST_r_yaml_fc7e155.yaml: detector z = +4.4294; rubin.md l. 119). M2-to-focus: 0.92 m drawn vs 1.73 m real (-47%).
- Camera drawn as a ~0.84 m box (geometry: camera hh 418 mm) in the M2 shadow, with M2 unbroken. Real: body ~1.6 m across and 3.5 m long, L1 (1.55 m) at 3.40 m above the vertex, through M2's 1.8 m opening (SB09 Fig. 2.8 caption; rubin.md l. 87). The fieldNote admits 5.23 vs 4.43.
- Change: per-focus `focusAt: 4.429` replacing `xFoc = -0.85*s`; draw a 1.6 m wide camera from L1 at 3.40 m up to ~6.9 m, with a 1.8 m opening in M2.

**B2. Rubin M3: too large, overlaps M1, wrong place.**
- Drawn M3 half-height 2913 mm (5.83 m) vs real 5.016 m clear (clear annulus 0.55-2.508 m, BAT); M1 inner edge 2.558 m, so the drawn M3 overlaps M1 by ~0.35 m.
- Drawn M3 vertex x3 = -167 mm (0.167 m toward the sky); real 0.2338 m behind M1's vertex (BAT M3 coordSys z: -0.2338). Error ~0.40 m, a 0.38 m step between M3 and M1 rims where the real glass is continuous (DERIVED rim heights +0.143 vs +0.165 m).
- Change: `x3: 0.234` (m behind vertex), clamp the M3 element hh to 2508 mm.

**B3. Rubin "secondary" carries a 5.12 m baffle bar.**
- layoutGeom draws baffle = eps*D/2 on the secondary: a 5.12 m grey bar at a 3.4 m M2. The M2 baffle diameter is NOT FOUND (rubin.md l. 95); 5.12 m is M3's rim (a STOP, not a baffle).
- Change: for tma "pb" draw no secondary baffle and attach the "obstruction e 0.61" caption to M3's rim.

**B4. 2D primary hole is the beam footprint, not the real hole, and it differs between foci of one telescope.**
- layoutGeom uses max ray height at 2s x 1.08 for two-mirror foci and 0 for prime or folded foci; 3D uses the preset `hole`. Drawn 2D hole diameters (mm) vs real:

| telescope | real hole | drawn 2D |
|---|---|---|
| MMT | 898 | f5s 896, f5i 633, f5b 508, f9 394, f15 282 |
| Gemini | 1200 | up 581, side 487 |
| Blanco | 1318 | cass8 583, cass14 327, cass30 401; prime 0 |
| Mayall | 1324 | cass8 322, cass15 310; prime 0 |
| SDSS | 1170 | 787, 784, 783 |
| VISTA | 1200 | wfc 844, vircam 677 |
| Hale | 1016 | cass 398, coude 754; prime 0 |
| LBT | 889 | dg 396; bgf and lbti 0; prime 0 |

- One-line change in layoutGeom: `if (P.hole > 0) hole = Math.max(hole, P.hole*500)` (pass the preset hole through curP as telapp already does for 3D).

### C. Smaller details and text

**C1. Obstruction kinds, like for like.**
- VISTA 0.4405 = BAFFLE 1.63 m at both foci (4MOST baffle unpublished, disclosed).
- MMT f/5 0.264 = MIRROR 1.715 m; f/9 0.157 = MIRROR 1.022 m; f/15 0.141 = primary's HOLE 0.898 m (hides the 0.64 m secondary). Consistent lower bounds (no baffles published). The f/15 caption "secondary obstruction e 0.14" next to a 0.64 m secondary (e 0.10) should say "primary hole".
- Blanco 0.4197 = DECam CAGE 1.65 m at all five (Mosaic II and the retired Cassegrains reuse it; disclosed).
- SDSS 0.5103 = BAFFLE tip 1.285 m at all three (cone, 2.6%, not drawn).
- Mayall DESI 0.4741 = CAGE 1.8 m; the others 0.4348 = CAGE 1.651 m.
- Gemini up and side 0.164 = periscope hole imaged (1.30 m, baffle retracted 1.1246 m); sideopt 0.2535 = BAFFLE 2.003 m. Each is the largest shadow in its configuration. The caption "e 0.16" sits beside a 1.10 m drawn secondary (e 0.14) with no bar.
- Hale 0.36/0.3661 = CAGE (72 in); TMT 0.11998 = 3.6 m M2 envelope; LBT Gregorian 0.1108 = MIRROR 0.911 m, prime 0.1058 = primary HOLE (stated lower bound; not comparable with Gregorian); Rubin 0.612 = STOP (M3 rim); Oschin ZTF drawEps 0.4494 = area-equivalent camera circle, POSS 0.3191 = plateholder lower bound.

**C2. Secondary sizes drawn vs real** (full width, mm): VISTA 1362/1328 vs 1240 (+10%/+7%); MMT f5s 1689 vs 1688, f9 1030 vs 1022, f15 676 vs 640; Blanco cass8 1305 vs 1295; SDSS 1124 vs 1080; Mayall cass8 1198 vs 1190, cass15 778 vs 743; Gemini 1099 vs 1020; Hale cass 1037 vs 1041; Rubin 3695 vs 3420 (+8%); TMT 3187 vs 3100; LBT 967 vs 911 (+6%). All within 10% (the drawn size includes field rays).

**C3. LBTI 2D caption "obstruction e 0.00".** `eps: 0` (used to leave the obstruction to the two-circle pupil) also drives the 2D caption. Real 0.1108 per mirror. Add a `drawEps: 0.1108` (key Oschin already uses).

**C4. LBT bgf and lbti in 2D: primary drawn with no hole** (tertiary in front gives hole 0); real 0.889 m (3D shows it). Covered by B4.

**C5. LBT M1-M2 spacing 10677 mm is DERIVED** (paraxial from derived f1 = 9.612 m, F 15.073, back focal distance 3.050 m). No saved LBT source states it (grepped all LBT PDFs). Back focal distance (LQF "Back focal distance: 3.050 m") and tertiary height ("Location: 2.25 m above primary vertex") are SOURCED. All three bent ports share a3 2.25 and backN, as the rule requires.

**C6. LBT struts in 3D** repeat on the same side in the unmirrored twin (fixed by A1).

**C7. Prime-focus correctors/cages (schematic, none contradicted):** Blanco DECam one lens 1.237 m before focus (real C1 1.78 m before the focal plane); Mayall DESI lens 1.49 m before the primary's focus (inside the 2.03 m corrector from 8.69 m); Hale Wynne/Ross 0.5 m before focus (SC); LBT LBC 0.93 m. Focal-plane positions are sourced (Blanco 10.78 m, Mayall 11.12 and 10.74 m, Hale 16.764 m).

## 2. Per telescope (verdict; table of elements by class: S sourced, M measured, D derived, SC schematic, W wrong)

- **VISTA (wfc, vircam): MATCHES.** M1-M2 2751/2737 mm (S 2725.7, corrector omitted); back 1172.6 mm (S; 4MOST's unpublished, SC); baffle 1.63 m (S); secondary +7-10% (D); 2D hole W (B4); corrector SC (owner's call). Images crop/m2d_0.png, crop/m3d_0.png. Change: B4.
- **MMT (f5s, f5i, f5b, f9, f15): MATCHES.** Backs 1795/1813/1850/1778/2286 mm and M1-M2 6234/6248/6178/6920/7312 mm vs TR35 (mmt.md l. 65-69, 150-153) S; secondaries D; holes W (B4). Images crop/m2d_0.png, m2d_1.png, hole_mmt_f5s_vs_f15.png. Change: B4, relabel f/15 caption.
- **Blanco (pf, pf287, cass8, cass14, cass30): MATCHES.** Prime plane 10781/10731 mm S/D; backs 1825/2439/1831 mm S; cage 1.65 m S; Mosaic II cage and the retired secondaries' sizes SC. Images crop/m2d_1.png (panel 4), m2d_2.png. Change: B4. Retired f/14.5 and f/30 could carry a "schematic layout" tag.
- **SDSS (fps, plug, img): MATCHES.** Backs 776.5/756.6/759.4 mm S; M1-M2 3636-3641 mm S; baffle 1.285 m S; hole W (B4); correctors not drawn (owner's call). Images crop/m2d_3.png, m3d_2.png.
- **Mayall (pf, mosaic, cass8, cass15): MATCHES.** Prime plane 11115/10738 mm S; backs 1814/2260 mm S; secondaries 1.20/0.78 m vs 1.19/0.743 m; cages 1.8 and 1.651 m S; holes W (B4). Images crop/m2d_3.png (panel 4), m2d_4.png.
- **Rubin (cam): topology MATCHES** (M1+M3 on one substrate, concave M3 at center, camera between M2 and M3). M1-M2 6149 vs 6156.2 mm S; M2 3.69 m vs 3.42 m D, no central opening W; baffle bar W (B3); M3 position and size W (B2); focal plane and camera W (B1). Images png/rubin_cam_2d.png, rubin_cam_3d.png. Changes B1-B3. Keep the schematic note until fixed.
- **Oschin (ztf, poss2, poss1): MATCHES.** Corrector (stop) at 6123 mm = R = 2 f1 S; focus 3062/3070 mm = R/2 S; detector/plateholder facing the mirror S; mirror drawn 1.86-1.87 m vs 1.83 m real (M, from the 5.4 deg field, disclosed); focal surface drawn flat (disclosed); obstruction ZTF 20.2% S. Images crop/m2d_5.png, m3d_5.png. No change.
- **Gemini (up, side, sideopt): MATCHES.** M1-M2 12542.5 mm S; up port 4000 mm S; science fold 2900 mm at 45 deg S (GZMS); side focus 1.1 m off axis S; baffle 2.003 m S; hole W (B4). Images crop/m2d_5.png (panel 4), m2d_6.png, m3d_6.png. Change: B4, relabel the up/side captions.
- **Hale (pf, pfw, pfr, cass, coude): prime, Wynne, Ross, Cassegrain MATCH; coude DIFFERS (A2).** Prime 16764 mm S; cage 1.83 m S; Cassegrain secondary 13637 mm and back 1524 mm S; correctors 0.5 m SC; coude secondary 13746 mm INFERRED, no flat W. Images crop/m2d_6.png (panels 3-4), m2d_7.png, m3d_7.png. Change: A2; tag coude "schematic layout".
- **TMT (nasx, nasmx): MATCHES.** M1-M2 27093.7 mm S; tertiary 3500 mm above vertex on the axis S; focus 20 m from the tertiary S (backN 0.66658*30.004 - 3.5 = 16.5 m back focal distance, S REQ-1-OAD-1015); +X down, -X up on opposite sides S; secondary 3.19 vs 3.1 m D; baffle bar 3.6 m S. Images crop/m2d_7.png (panel 4), m2d_8.png (panel 1), m3d_7.png. No change.
- **LBT (pfb, pfr, dg, bgf, lbti): 2D MATCHES; 3D twin DIFFERS (A1).** Back 3050 mm S; tertiary 2250 mm S and 0.64x0.50 m S; M1-M2 10677 mm D (C5); prime plane 9860 mm D; bent foci 5.30 m from the axis D; LBTI caption W (C3); 2D hole W (C4). Images crop/m2d_8.png, m2d_9.png, m3d_8.png, m3d_9.png. Changes A1, C3, B4. Prime-focus camera body: "schematic layout" tag.

## 3. Elements left SCHEMATIC, and what was searched
- Rubin camera body and M2 opening (sourced once drawn: SB09 Fig. 2.8); M2 baffle diameter (not in Krabbendam 2006, the Science Book, Taranto 2026 or the Rubin pages saved).
- Hale coude flat height and secondary place (only "tube through the hole" in Bowen 1961 and Anderson 1948).
- LBT M1-M2 spacing, LBC body size, swing-arm strut sides (all saved LBT PDFs grepped).
- Blanco Mosaic II top end and the retired secondaries; VISTA 4MOST baffle and corrector positions (all disclosed).
- Prime-focus corrector lenses (one thin lens each).
- No figure-based MEASURED values: only text and the BAT prescription were used; no new figures were downloaded or searched.

## 10-line summary
1. Counts: A = 2, B = 4 (B5, the LBT bgf DX copy, is part of A1), C = 7.
2. Worst 1 (A1): LBT 3D twin is a translation, not a mirror; LBTI's SX focus points outward, bgf's DX focus points outward (tel3d.js l. 275, tel3dgl.js l. 342).
3. Worst 2 (A2): Hale coude drawn with no flat; fix with nasmyth: true, a3: 0, backN: 2.694.
4. Worst 3 (B1-B3): Rubin focal plane 5.23 vs 4.43 m, camera 0.84 m box vs 1.6 x 3.5 m, M3 5.83 vs 5.0 m and 0.40 m misplaced, and a 5.12 m baffle bar on a 3.4 m M2.
5. B4: the 2D primary hole is beam-sized and differs between foci (MMT 0.28 to 0.90 m for one 0.898 m hole; Gemini 0.49-0.58 vs 1.2 m); one-line fix using P.hole.
6. Back focal distances, tertiary heights and Nasmyth/side-port distances all match sources for MMT, Blanco, SDSS, Mayall, VISTA, Gemini (4.0 m, 2.9 m fold, 1.1 m), TMT (3.5 m, 20 m) and LBT (3.050 m, 2.25 m).
7. Obstruction kinds are consistent within each telescope (cage, baffle, mirror or hole as listed in C1); MMT f/15 and Gemini captions should name the hole; LBTI caption 0.00 is wrong.
8. Oschin Schmidt (corrector at the center of curvature 6.12 m, plate at R/2, detector facing the mirror) and TMT match at a glance.
9. Schematic layout tags suggested: Hale coude, Rubin until fixed, LBT prime-focus camera, Blanco retired f/14.5 and f/30.
10. LBT M1-M2 10.68 m is derived, not sourced; no saved LBT document gives it.