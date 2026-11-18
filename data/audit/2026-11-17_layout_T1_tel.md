# T1_tel layout audit (keck, magellan, hst, jwst, dkist, vlt, gmt, het, subaru, yerkes, elt)

Saved by the main session from the agent's final message (the agent's Write call was refused).
Screenshots: T1_tel/s/<tel>_<focus>_2d.png and _3d.png; Magellan f/11 West 2D: T1_tel/mag_nasw_2d.png.
Geometry dump: T1_tel/geo.js (runs imager.js design() on each focus with telapp.js params). No downloads saved.

## 1. Findings, ranked

### (A) wrong at a glance
A1. JWST "Telescope focus f/20" (jwst/tel). Drawn (generic "korsch"): concave tertiary 0.35 D = 2.31 m BEHIND the
vertex, a flat 0.12 D = 0.79 m behind the vertex turning the beam 90 deg, focus 0.6 D = 3.96 m to the side. Real:
tertiary 0.796 m behind the vertex (MC23 Table 2: "Tertiary 3016.2 concave -0.6595 -796.3 0 -0.19 728x517",
data/telescopes/jwst.md l.86); fine steering mirror 1.048 m IN FRONT of the vertex ("Fine Steering flat 1047.8 0
-2.36 172.5", l.87); no 90 deg fold, the beam returns along the axis to a focal surface ~1.96 m behind the vertex (G06
design, jwst.md l.97). MEASURED on Gardner 2006 Fig. 32 (rawdata/telescopes/jwst/
jdox_jwst-telescope_fig2_OTE_diagram_from_Gardner_2006_Fig_32.png, 1200 px wide; scale 105.6 px/m from M2 at
7.17 m = 757 px, cross-check 110.6 px/m from the 6.6 m primary, 3.5% apart): tertiary 0.7 m behind, FSM 1.07 m in
front, Cassegrain focus 1.46 m in front (sourced 1.39), focal surface 1.4 m behind, +/- ~0.1 m; beams zig-zag a few
degrees off axis, no right angle. WRONG. The fieldNote already calls the mirror places "schematic".

A2. ELT Nasmyth (elt/nas): a five-mirror design drawn as a four-mirror generic Korsch. Drawn: M2 at 30.91 m (real
30.83), concave M3 13.7 m BEHIND the vertex, one flat 4.7 m behind the vertex turning 90 deg, focus 23.5 m to the
side. Real (elt.md; EM23, EMIR, R18, C12): M3 4.0 m concave "at the vertex of M1"; intermediate f/4.4 focus at the M4
hole; M4 flat 2.4 m, 13.5 m above the vertex (in FRONT of the primary), tilted 7.75 deg; M5 flat 2.7 x 2.2 m in the
central tower folding the beam along the elevation axis; focus 27.2 m from M5 (R18 BFD 27200 mm); M4-M5 7.328 m (R18)
or 10.0 m (C12). M3 13.7 m off, M4 on the wrong side, M5 missing, no intermediate focus, focus 23.5 vs 27.2 m (14%).
Preset text says "tertiary at the primary's vertex" while the figure labels it "behind the primary" at 14 m;
reflections "5" vs 4 drawn. WRONG.

### (B) more than 20% off
None measured. B1 (flagged risk): Magellan Nasmyth and folded geometry is SCHEMATIC with unknown error: tertiary
1.30 m above the vertex, focus 5.20 m from the axis (defaults 0.2 D, 0.8 D). Not published (magellan.md says so);
searched MagAO-X PDR A1 and 5.1, Kopon 2010, Morzinski 2014, Close 2018, Schechter 2003, LCO pages, ADS JSONs, web
(Shectman 1994, Shectman & Johns 2003 abstracts only). PDR 5.1 Table 4 "Dbeam" (M-2 1.36, M-3 1.1) cannot be a beam
diameter (would put M3 7-8 m above the vertex at f/11). nasw/nase/aux consistent (s 9.67 m, a3 1.30 m, focus 5.20 m).

### (C) smaller details and text
C1. Subaru Nasmyth back focus vs focal ratio. Iye 2004 Table 2: "Back focus (mm) NA 3000 4992.6 4600 3000 4600
4992.6"; "Effective F ratio 12.195 12.708 12.469 12.373 13.612 13.917". Preset F 12.4634 = no-rotator optical
(back 4600; drawn 4.92 m, 7% off); F 13.912 = no-rotator IR (back 4992.6; drawn 4.77 m, 4.5% off). Cause: default
backN/a3. M2 spacings right (optical Nasmyth 12.45 vs 12484.3 mm, Table 1; Cassegrain 12.65 vs 12652.174 mm).
C2. Subaru Nasmyth tertiary height and focus distance NOT FOUND (default a3 1.64 m; focus 6.56/6.36 m). Subaru web
figure (rawdata/telescopes/subaru/subaru_old_Introduction_img_telescope_foci1_e.jpg): optical Nasmyth right platform,
IR left, seen from the front; app draws optical "up", IR "down" (a choice; not contradicted).
C3. Subaru eps 0.289 (2.37 m) measured only at the IR Nasmyth (SCExAO); reused at PF, Cassegrain, optical Nasmyth
(different top units). Tag the others schematic.
C4. Obstruction kinds: Keck f/15 0.2375 design central obstruction 2.6 m (secondary + baffle); Keck f/40 0.2968 stop;
Magellan f/11, f/16 0.29 secondary baffle (C18M); Magellan f/5 0.343 baffles DERIVED (29 m^2); HST 0.33 baffle +
secondary shadow; GMT 0.141 3.6 m secondary baffle; HET 0.45 4.5 m WFC shadow; VLT 0.1395/0.138 M2 as stop ("the
pupil is determined by the secondary mirror", no conventional baffles: correct); JWST drawEps 0.202 is the central
HOLE (2D label "secondary obstruction e 0.20" misleading; real secondary 0.738 m, e = 0.112); ELT drawEps 0.283 also
the central HOLE (label misleading). Relabel JWST/ELT "central hole".
C5. Magellan f/16 ASM drawn at M1-M2 9.13 vs 9.67 m at f/11: DERIVED and consistent (same primary f 8.125 m and same
focus 3.90 m behind the vertex; a Gregorian of F 16.16 must stand 0.54 m closer). MagAO-X PDR A1 p.4 draws the f/11.02
and f/16.16 focal planes ~100 mm apart, same station. Suggest a tooltip (INFERRED). Side unknown (Lucas 2026 puts
MagAO-X nominally on NASE; that is MagAO-X, not MagAO); "West" arbitrary.
C6. HET: the four-mirror WFC (M2/M3 1 m concave, M4 convex 0.23 m, M5 0.9 m; H21 Sec. 3.3) drawn as one lens 0.6 m
before the focus in a ~1.1 x 4.5 m box; declared schematic; 55 deg elevation not drawn.
C7. GMT: secondary one disc with a three-leg truss (real: seven 1.05 m segments); M1-M2 20.26 vs 20.290 m (CoDR 2006
Table 6-1; current NOT FOUND); folded port matches the OAD ("at 45° incidence angle 1930 mm from focus"; focus 1.93 m
off axis, 3.90 m below the vertex); 3D primary shows seven ellipses.
C8. DKIST: Gregorian M2 drawn coaxial (M20: real decentre 0.594 m, DERIVED); M1-M2 9.20 m DERIVED (SPEC-0029 via the
Mathur thesis); prime focus heat stop 8.0 m matches.
C9. Keck f/25 reuses the f/15 eps; the real 0.53 m secondary has a central hole and is the stop (fieldNote says so);
focus 4.54 m in front of the vertex (KOTN163 -4.538 m) matches.
C10. Yerkes: ideal lens at 19.35 m, no tube or cell. MATCHES.

## 2. Per preset
keck (cass, nasr, nasl, bent, f25, f40): MATCHES. M1-M2 f/15 15.41 vs 15.394985 m (KOTN163); Cassegrain back 2.50 m
(KOTN163); tertiary 4.0 m above vertex (KOR90 Table 11-4); Nasmyth/bent focus 6.50 m from axis (KRBC Sec. 2: tertiary
to focus 6.500 m); sides right "down", left (AO) "up" (KTG02); f/40 M1-M2 16.65 vs 16.640 m (KRBC); f/25 back -4.538 m;
36 hexagons. No changes.
magellan (nasw, nase, aux, cass5, asm16): topology MATCHES; geometry SCHEMATIC (f/11 M1-M2 9.67 DERIVED; tertiary
1.30 SCHEMATIC, "just above the primary" D11; focus 5.20 SCHEMATIC; f/16 9.13 DERIVED; f/5 6.25 m, back 1.81 m
INFERRED from MMT-identical optics; eps baffle kind). Schematic tag on Nasmyth, folded and f/16 foci. No key changes.
hst (cass): MATCHES (M1-M2 4.906, back 1.50, secondary 0.281, hole 0.6 SOURCED; radial bays not drawn, text says so).
jwst: cass MATCHES (7.17 m; focus 1.395 m in front; measured 1.46). tel DIFFERS (A1). Model change: replace fixed
korsch constants (0.9 f1, 0.35 D, 0.12 D, 0.6 D, 90 deg fold) by a per-telescope block, e.g.
tma: { s: 7.169, x3: 0.7963, xFlat: -1.0478, fold: 0, zFocus: 1.96 } (m; x3 behind vertex, xFlat negative = in front).
dkist (greg, prime): MATCHES; positions DERIVED/SCHEMATIC (C8).
vlt (nasa, nasb, cass): MATCHES. M1-M2 12.396 (Nasmyth) / 12.427 (Cass) SOURCED (WB Fig. 3.16, EM2); tertiary 2.5 m
(WB Sec. 2.2); Nasmyth focus 6.8 m from axis (WB Fig. 3.16); Cass focus 2.5 m behind; A east "up", B west "down".
gmt (dg, fp): MATCHES; direct Gregorian focus 5.83 m behind vertex SOURCED (OAD). See C7.
het (pf): MATCHES; corrector SCHEMATIC (C6).
subaru (pf, cass, nsopt, nsir): MATCHES; Nasmyth SCHEMATIC (C1-C3); Cass back 3.00, M1-M2 12.65 SOURCED (Iye 2004).
Fix C1 with a3 1.64 m kept: nsopt backN = (4.600 + 1.64)/8.2 = 0.761; nsir backN = (4.9926 + 1.59)/7.95 = 0.828.
yerkes: MATCHES.
elt (nas): DIFFERS (A2). Model change: a five-mirror "elt5" design: M2 30.83 m (EM23); M3 at the vertex; M4 flat
13.5 m in front of the vertex with the intermediate focus at its hole (back -0.345 D, C12 Fig. 1; elt.md l.94); M5
flat 7.328 m further (R18) turning 90 deg; final focus 27.2 m from M5 (R18). Interim text fix: say the drawn tertiary
and fold are not the ELT's M3-M5 positions.

## 3. Left SCHEMATIC
Magellan tertiary height and Nasmyth/folded focus distance; Subaru Nasmyth tertiary and focus distance; HET WFC
position and size; DKIST M2 decentre; GMT current M1-M2; Keck as-built tertiary size; MagAO side.

## Summary
2 A, 1 B (flagged unknown), 10 C. Worst: JWST telescope focus (A1); ELT as a four-mirror Korsch (A2); Magellan
Nasmyth geometry unsourced (B1). Verified within 1%: Keck (6 foci), VLT (3), HST, GMT, Subaru M1-M2, DKIST (derived).
Foci sharing a secondary share a3/backN everywhere in the group. Model changes needed: per-telescope TMA geometry
(JWST), a five-mirror "elt5" design.
