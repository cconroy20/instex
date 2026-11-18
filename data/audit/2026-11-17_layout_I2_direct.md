Saved by the main session from the agent's final report (the agent could not write files).

# I2_direct layout audit (17 direct imager presets)

NOTE: the Write tool refused to create REPORT.md ("return findings as text"), so the full report is below. The caller can save it as `I2_direct/REPORT.md` if wanted. No project file was edited. Working folder: /private/tmp/claude-501/-Users-cconroy-memos/e68fd597-1b64-4e94-b35e-e11122dfd278/scratchpad/audit_layout/I2_direct/. It holds the screenshots `<id>_tel.png` and `<id>_inst.png` for all 17 presets and the scripts `geom.js` and `geom2.js`, which run design() from web/imager.js. It also holds source rasters (`acsihb-029.png`, `wfc3fig-025.png`, `tess_chrisp-2.png`, `tess_chrisp-5.png`) and extracted texts (`fl.txt`, `eu_Racca201.txt`, `ro18.txt`, `zd20.txt`, `lbc08.txt`, `ch15.txt`, `acs_ihb.txt`, `wfc3_ihb.txt`).

How the direct drawing works (web/imgapp.js layoutGeom):
- The telescope view draws the telescope from the preset's design, plus a prime-focus-unit box (half-height = max(eps·D/2, 0.6 × mosaic height)), one thin "corrector" lens for prime foci, and the detector. It draws no filter and no dewar window.
- The instrument view draws a filter plate at a fixed `0.35·lin` before the focus, with `lin = min(zF, 1.6·F·H0)`. This rule is unsourced and the same for every direct preset. The corrector appears there only as a kink in the rays.
- Secondary and hole sizes come from the bundle footprint, not from the real mirrors.

## 1. Findings ranked by visibility

### (A) wrong at a glance (4)

**A1. WFC3/UVIS (uvis).**
- Drawn as an axial Cassegrain focus on the telescope axis.
- Real: WFC3 sits in a radial bay. "On-axis light coming from the HST optical telescope assembly (OTA) is intercepted by the flat 45° WFC3 pick-off mirror (POM)" (WFC3 IHB Sec. 2.1, p. 23).
- Fig. 2.1 (p. 24) then gives: POM, fold flat, M1 (hyperbola), corrector mirror (anamorphic asphere), SOFA filters, shutter, 4k × 4k CCD (tilted 21°).
- The drawing also shows an f/32.5 cone leaving the secondary, which Hubble never makes (f/24, then the relay).
- Fix: `nasmyth:true` with a negative `a3`, a 45° flat behind the primary (imager.js already supports a3<0), plus a drawing-only label "WFC3 relay not drawn".
- The POM distance is NOT FOUND (data/telescopes/hst.md lists it as a gap), so it would be schematic. Tag the preset "schematic layout".

**A2. ACS/WFC (acs).**
- Drawn as an axial focus with the detector on axis.
- Real: the instrument is in an axial bay (IHB 3.1), but the WFC channel is a three-silver-mirror relay: OTA beam, IM1, IM2 (small, at the pupil image), IM3, filter wheels, detector (IHB Fig. 3.2, Sec. 3.3.2). The detector is tilted 22° (IHB 1.1.3).
- The filters sit in the converging beam after IM3, which matches the instrument view.
- Fix: relay label box and a "schematic layout" tag.

**A3. Euclid VIS (euclid).**
- Drawn as a Korsch with one fold flat after the tertiary, labeled "a hole passes the light to the tertiary".
- Real (Racca+16 Sec. 3.2, Fig. 8, Table 5): M1, M2, two fold mirrors FoM1 and FoM2 "between M2 and M3", then M3, the dichroic at the exit pupil (Ø117 mm), then FoM3 to the VIS focal plane.
- The drawing has one fold instead of three, the fold on the wrong side of M3, and no dichroic.
- The drawn M2 is 158 mm; the real M2 is Ø350 mm.
- Fix: caption "FoM1/FoM2 before M3, dichroic, FoM3 not drawn", a korsch-specific fold label, and a "schematic layout" tag.

**A4. Roman WFI (roman).**
- Same drawing as Euclid.
- Real (Pasquale+18 Sec. 4.1): PM and SM make an intermediate focus. F1 is a pickoff for an off-axis section of the field, and F2 folds it back toward the axis. The tertiary mirror (R 1643 mm) is in the aft optics, then the exit pupil, element wheel and FPA.
- So two folds come before the tertiary and none after.
- The drawn SM f is −342 mm, against −650 mm real (R 1299.6; known).
- Same fix as A3.

### (B) distance or size off by more than ~20% (9)

**B1. Magellan Megacam (megacamm) was not updated with the 11-17 Magellan fix.**
- The preset has no `back`, so the default 0.2 D puts the focus 1.30 m behind the vertex. Telescopes mode (focus `cass5`) uses `back: 0.27877`, which is 1.81 m: −28%.
- The preset `eps: 0.28` is the bare 1.8 m mirror. Telescopes mode uses 0.343 including baffles, derived from McLeod's 29 m² (the preset note itself gives 0.355). The f/11 baffle is 0.29, so this is the same unlike-for-like comparison already fixed elsewhere.
- Drawn primary hole: 592 mm. Real: 1.3 m.
- Fix: `back: 0.27877`. For eps, use a drawing-only value or recompute F and the area.

**B2. Oschin Schmidt mirror (ztf, poss1, poss2).**
- The drawing widens the mirror to catch the off-axis bundles and labels it Ø2.09 m (ZTF) and Ø2.01 m (POSS).
- Real: 1828 mm (72 in; Dekany+20 Sec. 3.1; Harrington 1952), so the drawing is 14% (ZTF) and 10% (POSS) too wide.
- The real mirror clips corner beams: "vignetting of over 30%" (Dekany+20 Sec. 3.2).
- Fix: a `Dmirror: 1.8288` key in imager state, as Telescopes mode has.

**B3. HSC prime-focus unit (hsc).**
- The box is labeled "obstruction ε 0.00" and drawn 0.63 m tall.
- Real: "fully assembled WFC has a diameter of 970 mm and a height of 1.7 m" (HSC project page); data/telescopes/subaru.md gives lower bounds eps ≥ 0.127.
- Fix: `pfuSub:"camera and WFC barrel 0.97 m, obstruction not published"` (the key exists at imgapp.js:717) and a drawing-only box height. Keep `eps:0` for the numbers.

**B4. ZTF instrument view.**
- The filter is drawn 554 mm before the detector.
- Real: "The distance between filter and convex window vertex is 5 mm" (Dekany+20 Sec. 3.2). The filter is 450 × 490 mm and mounted "immediately in front of the dewar window". Behind it come the meniscus window, per-CCD field flatteners and the CCD plate.

**B5. Instrument-view filter rule, checked per preset.**
- DECam: drawn 0.67 m, real about 0.58 m (Flaugher+15 Table 1: 13 mm filter, then 578 mm to the focus). MATCHES within 15%.
- LBC: 74 mm, filter wheels "between the last two lenses" (Giallongo+08, LBTO). Plausible.
- Euclid: 1.73 m, but VIS has NO filter. The band comes from the dichroic and the FoM coatings (Racca Sec. 3.2). WRONG; drop it or relabel.
- TESS: 49 mm, but there is no filter element. The long-pass is a coating on lens 2 surface 2 (Chrisp+15 Secs. 2.1 and 5). WRONG in kind.
- ACS and UVIS: 0.9 m and 1.1 m, no published distance. SCHEMATIC.

**B6. Rubin camera and M2 (lsst).**
- The camera is drawn as a 0.84 × 0.29 m box in front of an unbroken M2.
- Real (rubin.md, BAT, ROD): M2 has a 1.8 m central opening that holds the camera (~1.6 m × 3.5 m). L1 is 1.55 m across. The focal plane is 4.43 m above M1 (drawn 5.23 m, already in the note).
- Drawn M3: 5.9 m, measured from the screenshot (scale bar 2 m = 133 px). Real: 5.0 m, so +17%.
- Drawn M2: 3.76 m against 3.4 m, +10%.
- Fix: draw the M2 opening and a 1.6 m camera body.

**B7. Primary hole sizes in the Imager drawing.** The drawing sizes the hole to the returning beam only.

| Preset | Drawn hole | Real hole |
|---|---|---|
| ACS | 137 mm | 600 mm |
| UVIS | 124 mm | 600 mm |
| Magellan | 592 mm | 1.3 m |
| VST | 544 mm | 600 mm (OK, −9%) |

Fix: honor a `hole` key.

**B8.** Euclid M2 is 2.2× too small (see A3).

**B9. LBC corrector (lbcb, lbcr).**
- MEASURED from the LBTO optics drawing (`lbto_scienceops_lbc_optics_Screen-Shot-2016-07-22-at-11.45.07-AM.png`, 400 × 350 px).
- Scale: L1 = 810 mm = 188 px (4.3 mm/px). Cross-check: L2 = 400 mm = 98 px. Uncertainty about ±0.1 m, low confidence.
- L1 is about 0.74 m before the array and the whole corrector is 0.74 m long. The drawn lens is 1.18 m before the focal plane, so it sits about 0.4 m ahead of the real L1. The drawn lens diameter (0.9 m) does match L1 (810 mm).

### (C) smaller details and text fixes (8)

- **C1.** The corrector is drawn as one lens, with a size set by the beam. That gives roughly 0.6 m against L1 0.82 m (HSC), 0.29 m against 0.81 m (CFHT), and about 0.5 m against 0.98 m (DECam). SCHEMATIC, noted for CFHT.
- **C2.** The ZTF corrector is an air-spaced triplet: the 1982 doublet plus a 1348 mm trim plate (Dekany Table 1). POSS-I has a single lens and POSS-II a doublet (Reid+91). All are drawn as one plate.
- **C3.** The Schmidt boxes carry the label "prime-focus unit and detector". Use `pfuLabel` ("camera in the tube", "plateholder").
- **C4.** The ZTF/POSS camera box size follows eps (0.473 and 0.32, the latter a lower bound).
- **C5.** TESS has seven lenses (hybrid Petzval, big air gap between lenses 5 and 6, stop inside, hood baffle). It is drawn as one biconvex lens. SCHEMATIC.
- **C6.** The 80 mm refractor's triplet is drawn as one lens. The Flat GT flattener (2 elements, optical length 20.4 mm, back focus 55 mm) is missing, and the drawn "filter" at 52 mm has no counterpart.
- **C7.** The korsch fold label "a hole passes the light to the tertiary" is JWST-specific and contradicted for Euclid and Roman.
- **C8.** OmegaCAM's two-lens corrector, filter and window are not drawn in the telescope view (Cassegrain correctors are the owner's call).

## 2. Per preset

### lsst
Topology MATCHES for the mirrors; the camera and corrector detail DIFFERS.

| Element | Drawn | Real | Class | Evidence |
|---|---|---|---|---|
| M1–M2 | 6168 mm | 6.156 m | SOURCED | rubin.md, BAT |
| M3 vertex | 0.167 m in front | 0.234 m behind | WRONG (known) | rubin.md |
| Focal plane | 5.23 m | 4.43 m | WRONG (known) | BAT |
| M2 | 3.76 m, no opening | 3.4 m, 1.8 m opening | WRONG | rubin.md |
| M3 | 5.9 m (measured) | 5.0 m | WRONG | ROD |
| Camera | 0.84 × 0.29 m | 1.6 × 3.5 m | WRONG | rubin.md |
| L1–L3, filter | not drawn | present | SCHEMATIC | widefield.md |

Fix: draw the M2 opening and a 1.6 m camera body.

### hsc
Topology MATCHES.

| Element | Drawn | Real | Class |
|---|---|---|---|
| Corrector | one lens, 1.23 m before focus, Ø0.6 m | 5 lenses + ADC in a 1.65 m barrel, L1 Ø820 mm | SCHEMATIC |
| Prime-focus unit | 0.63 m box, "ε 0.00" | WFC 0.97 m × 1.7 m | WRONG (B3) |
| F1 | 15.0 m | 15 m | SOURCED |
| Filter | 0.67 m before focus | distance NOT FOUND | SCHEMATIC |

Fix: B3 label and box. Tag "schematic" for the corrector only.

### decam
Topology MATCHES; the cleanest preset of the group.
- Corrector: SOURCED/DERIVED from Flaugher Table 1 (C1 at 8875 mm, focus 1906 mm beyond; blanco.md).
- Filter: 0.67 m drawn against 0.58 m real, SOURCED, within 15%.
- Prime-focus unit: 1.65 m, SOURCED (NOIRLab 1651 mm).
- No change.

### megacam (CFHT)
Topology MATCHES.
- Primary focus: SOURCED (13497 mm drawn against 13533 mm, CFHT manual and `om-primefoc.gif`).
- Corrector: one lens, SCHEMATIC (noted). Real: 4 lenses, 1.9 m tall, L1 81 cm.
- Obstruction: SOURCED. The 80,216 cm² area gives the drawn 8.02 m², and the CFHT specs page models the prime focus as two circles of 67.5 cm radius with a 30 cm bridge.
- No change.

### ztf
The Schmidt topology MATCHES: stop and corrector at 2f, camera at the focus inside the tube. The corrector DIFFERS (triplet).
- Stop: 1244 mm at 6124 mm. SOURCED.
- Focus: halfway, radius 3062 mm. SOURCED.
- Mirror: Ø2.09 m drawn, real 1828 mm. WRONG (B2).
- Filter in the instrument view: WRONG (B4).
- Fix: `Dmirror`, `pfuLabel`, a filter-gap key, and name the corrector "doublet + trim plate".

### small80
Topology MATCHES; the flattener is omitted.
- Focal length 478 mm and f/5.9: SOURCED (William Optics GT81).
- Fix: `filterAt:"none"` or a relabel. Tag "schematic layout".

### acs
Topology DIFFERS (A2).
- Telescope: M2 at 4949 mm against 4906 mm real (+0.9%), focus 1.50 m. SOURCED.
- Secondary: Ø265 mm drawn, Ø281 mm real. SOURCED.
- Hole: 137 mm drawn, 600 mm real. WRONG.
- Relay: IM1–IM3 and the 22° tilt are missing. WRONG.
- Bay: axial, SOURCED; the real aperture is a few arcmin off axis.

### uvis
Topology DIFFERS (A1).
- Telescope numbers as for ACS; M2 at 5056 mm (+3.1%) because F = 32.5 drives the cone.
- Fix as in A1. Tag "schematic layout".

### euclid
Topology DIFFERS (A3).
- M1–M2 1756 mm: SOURCED (Racca Table 5).
- M2 158 mm against 350 mm: WRONG.
- M3 position: NOT FOUND, SCHEMATIC.
- Folds: WRONG. Dichroic: missing.
- Filter in the instrument view: WRONG.
- Field offset 0.47°: SOURCED (already in the note).
- Tag "schematic layout".

### roman
Topology DIFFERS (A4).
- PM R 5671.1342 mm (f = 2835.6 mm, f/1.2): SOURCED (Pasquale+18).
- SM: WRONG (known).
- Folds: WRONG.
- Tertiary position: SCHEMATIC.
- Tag "schematic layout".

### omegacam
Topology MATCHES.
- M1 R 9509 mm: SOURCED.
- Focus 1.20 m behind the vertex: MEASURED by the earlier audit (manual Fig. 2).
- Secondary: 924 mm drawn, 938 mm real.
- Hole: 544 mm against 600 mm (−9%).
- Corrector, filter and window: SCHEMATIC.
- eps 0.36 is a mirror value and a lower bound, consistent with the note. No change.

### lbcb, lbcr
Topology MATCHES.
- Primary f/1.142: SOURCED.
- Corrector: MEASURED, see B9.
- Filter wheels: kind SOURCED (Giallongo+08).
- Obstruction: SCHEMATIC lower bound, noted.

### megacamm
Topology MATCHES; focus and obstruction DIFFER from the fixed Telescopes mode (B1).
- M1 f/1.25: SOURCED.
- M2: SCHEMATIC (real 1.8 m; spacing NOT FOUND).
- Focus: WRONG against the Telescopes mode.
- Hole: WRONG.
- eps: WRONG against the Telescopes mode.
- Corrector (3 lenses behind the M1 vertex plus a 48 mm flattener window): SCHEMATIC, owner's call.
- Fix: `back: 0.27877` and the eps decision.

### poss1, poss2
Topology MATCHES.
- Mirror label Ø2.01 m: WRONG (B2).
- Box label: C3.
- Filter: real filter sits against the plate (poss2 note says "the filters sit in the plateholder"), drawn 486 mm ahead (the B4 rule). SCHEMATIC.

### tess
Matches in kind (refractor with the detector at the focus); seven elements are drawn as one. See C5 and B5. Tag "schematic layout".

## 3. Left SCHEMATIC, and what was searched
- Thin-lens equivalent position and size of multi-lens correctors (HSC, CFHT, LBC). Searched the Subaru HSC pages, Aihara+18, the CFHT components page and the LBTO figure. No prescriptions beyond DECam's, which blanco.md already used.
- HST pick-off and relay positions (hst.md gap; the ACS and WFC3 figures have no scale).
- Euclid M3, FoM and dichroic positions. Racca Figs. 8 and 11 are block schematics. Gaspar-Venancio 2014 and 2023 are in rawdata but were not searched beyond the Racca text, and may hold a to-scale layout.
- Roman M1–M2 spacing and fold positions (Pasquale gives radii and topology only).
- Magellan f/5 secondary spacing and focus (Szentgyorgyi 2012 is paywalled).
- Instrument-view filter distance for all presets except DECam and ZTF.

## 10-line summary
1. Counts: A = 4, B = 9, C = 8.
2. Worst 1: UVIS is drawn as an axial focus, but WFC3 is in a radial bay behind a 45° pick-off mirror, with fold, M1, corrector mirror, SOFA and a tilted CCD all missing. ACS is likewise missing its IM1–IM3 relay.
3. Worst 2: Euclid and Roman show one fold after M3. Real: two folds before M3 plus a dichroic and FoM3 (Euclid), and F1 and F2 before the tertiary (Roman). Euclid's M2 is 2.2× too small and its instrument view shows a filter that does not exist.
4. Worst 3: the Magellan Megacam preset still has the pre-fix f/5 focus (1.30 m against 1.81 m) and the bare-mirror eps 0.28 against 0.343; the primary hole is 0.59 m against 1.3 m.
5. Oschin Schmidt mirrors are labeled Ø2.0–2.1 m (real 1.83 m), and the ZTF filter is drawn 0.55 m ahead of the focal plane (real 5 mm before the window).
6. The HSC prime-focus box says "obstruction ε 0.00" while the real WFC barrel is 0.97 m × 1.7 m.
7. Rubin's camera and M2 are wrong: the 1.8 m M2 opening is not drawn and the camera is a small box (real ~1.6 × 3.5 m).
8. The HST primary hole is drawn at 0.13 m (real 0.6 m).
9. DECam and CFHT match their sources; OmegaCAM matches.
10. Tag "schematic layout": uvis, acs, euclid, roman, tess, small80, and (corrector only) hsc, lsst. The REPORT.md file could not be written (Write refused); the report is in this message.