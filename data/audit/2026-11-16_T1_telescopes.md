# Audit T1: telescope presets (magellan, hst, jwst, dkist, vlt, gmt, het, subaru, yerkes, elt, keck)

Auditor: Claude (Opus 5.5), 2026-11-16. Repository ~/memos/instex at a349ad5 (web/tpresets.js as committed). No project file was edited. Working files (text extractions, page renders, a node script) are in the scratchpad under `audit/txt/`, `audit/shots/T1_*.png` and `audit/keck40.js`.

Method. For each preset I read the entry in web/tpresets.js, the research record data/telescopes/<id>.md (and grepped the .json twin), and checked the values and note sentences against the saved sources (pdftotext, `python3 -I` for HTML, page renders for figures and scans). I recomputed the drawn geometry with the formulas of web/imager.js `design()`: for a two-mirror focus the secondary sits at s = (m f1 − b)/(m + 1) (Cassegrain) or (m f1 + b)/(m − 1) (Gregorian), m = F/F1, b = back·D, and at a Nasmyth or folded focus b = backN·D − a3 with defaults a3 = 0.2 D and backN = 0.8 when the preset gives none (telapp.js passes `a3: f.a3` and `backN: f.backN` straight through). `node validate_img.js` passes for all eleven telescopes. Screenshots were taken with shot.js against my own server on port 8873 (stopped afterward).

Severity: ERROR (wrong against a source), UNSUPPORTED (no source supports the statement), MISLEADING (true in part but the page misleads), NOTE (minor or a disclosed choice worth revisiting).

---

## Keck 10 m (keck)

### Findings

1. **ERROR: the f/25 forward Cassegrain focus is drawn behind the primary; it lay 4.54 m in front of the vertex.** Preset `f25`: `back: 0.2283` (2.50 m behind the vertex), `where: "behind the primary (Keck I, 1993-2010)"`.
   - KOTN163 (rawdata/telescopes/keck/keck_KOTN163_prescriptions.html, "f/25 Secondary Parameters"): "Back focal distance e(m) -4.538 ... Final focal length f(m) 250.000 ... Primary-sec. Distance d(m) 16.640457".
   - KTG02 Sec. 3.1.3 (quoted in data/telescopes/keck.md): "An f/25 chopping secondary mirror, which forms a focus near the intersection of the telescope optical axis and the elevation axis"; Sec. 3.2.3: the instruments "are mounted at the forward end of the Forward Cassegrain Module (FCM)".
   - The research record itself says "focus near the elevation axis 4.5 m in front of the primary vertex".
   - Effect: the 2D and 3D layouts send the f/25 beam through the primary's hole to a focus 2.5 m below the mirror (screenshot T1_keck_t_focus_f25.png), and the drawn secondary sits at 16.19 m, 2.7% short of 16.640 m (DERIVED: m = 22.8057/1.5983 = 14.269, s = (14.269 × 17500 − 2500)/15.269 = 16190 mm).
   - Fix: `back: -0.4145` (= −4.538/10.949), giving s = 16651 mm (+0.07%, DERIVED); `where: "the Forward Cassegrain Module, 4.54 m in front of the primary's vertex, near the elevation axis (Keck I, 1993-2010)"`.

2. **ERROR: the Nasmyth tertiary and foci are placed by the code's defaults, not by the sources, and the drawn f/15 secondary moves 0.42 m.** Preset `nasr`, `nasl`: no `a3`, no `backN`, so the tertiary is drawn 0.2 D = 2.19 m above the vertex and the focus 0.8 D = 8.76 m from the axis. The unfolded focus then lies 6.57 m behind the vertex, and s = (8.5477 × 17500 − 6569)/9.5477 = 14979 mm (DERIVED), 2.7% short of KOTN163's 15.395 m.
   - KOTN163: "Back focal distance e(m) 2.5000 ... Primary-sec. Dist d(m) 15.394985".
   - KTG02 Sec. 3.2.2: "With a (flat) tertiary mirror mounted on the elevation axis"; KOR90 Table 11-2: "Elevation axis to mirror vertex 4.00m".
   - KRBC Sec. 2 (keck_RBC_Manual_f40_bentCass.html): "The distance from the tertiary to the optimal focal plane is 6.500 m" (the f/40 focus is parfocal with f/15, KTG02 Sec. 3.1.4). 4.00 + 2.50 = 6.50 m (DERIVED; the research record derives the same).
   - Effect: in the 2D layout (T1_keck_t_focus_nasr.png) the tertiary sits at roughly half its true height and the Nasmyth focus 35% too far from the axis.
   - Fix: `a3: 4.0, backN: 0.5937` on `nasr` and `nasl` (b = 2.5 m; s = 15405 mm, +0.07%).

3. **ERROR (layout): the bent Cassegrain stations use `backN: 0.45` (4.93 m from the axis) with the default tertiary height 2.19 m.** Sources as in finding 2: tertiary on the elevation axis 4.0 m above the vertex, tertiary to focus 6.500 m (KRBC, stated for the f/40 bent-Cassegrain port). The drawn secondary distance comes out right only because the two errors cancel (b = 4.927 − 2.190 = 2.737 m; s = 15380 mm). Fix: `a3: 4.0, backN: 0.5937` on `bent` and `f40`.

4. **MISLEADING: the f/40 stop is drawn as a circle; the source shows a shrunken copy of the serrated hexagonal outline.** Preset `f40`: `pupil: { clip: 10.445 }` (a round stop 0.954 × 10.949 m). KRBC Sec. 2: "The secondary mirror ... is undersized by about 95.4% (see Figure 4) and is therefore the stop for the system"; Figure 4 (RBC_Manual_figures/RBC_Manual-4.jpg, viewed) draws the secondary's edge (heavy line) as a serrated hexagon-of-hexagons just inside the primary's image. The research record says the same: "outline = shrunk image of the serrated primary (KRBC Fig. 4)".
   - Effect (DERIVED with web/tpupil.js, eps 0.2968, vanes omitted; scratchpad audit/keck40.js): full pupil 68.94 m², round clip 67.44 m² (−2.2%), serrated outline scaled by 0.954 62.11 m² (−9.9%). The page shows 67.0 m² at f/40 (screenshot T1_keck_f40_3d.png), ≈ 6-8% too much, and the outer edge (which sets the diffraction pattern's six-fold structure) has the wrong shape.
   - The central hole of the same figure is a flat-topped hexagon, 0.1501 m corner to corner on the 0.5058 m pupil image, i.e. 3.25 m corner to corner on the primary (DERIVED). The preset draws a 3.25 m circle (8.30 m² against 6.86 m² for the hexagon); the fieldNote says "3.25 m on the primary" without "corner to corner".
   - Fix: a stop option in tpupil.js that tests the point against the hex outline scaled by 0.954 (the inPupil hex test with x/0.954, y/0.954, gaps closed), and a hexagonal central block (`blocks`) of 3.25 m corner to corner; or keep the circle and say in the fieldNote that the real stop is serrated and ≈ 7% smaller in area.

5. **MISLEADING (label): the bent-Cassegrain foci are labeled "Nasmyth focus".** web/imgapp.js line 645 hard-codes the tertiary sub-label "to the Nasmyth focus", and line 687 and tel3d.js line 158 fall back to "Nasmyth focus" when `focusLabel` is absent. Keck `bent` and `f40` give no `focusLabel`, so the 3D view of the f/40 bent-Cassegrain port reads "Nasmyth focus" (T1_keck_f40_3d.png). Fix: `focusLabel: "bent Cassegrain focus"` on both, and use `P.focusLabel` in the tertiary sub-label.

6. NOTE: the f/25 secondary was undersized with an oversized central hole (KTG02 Sec. 3.1.4: "The f/25 and f/40 secondary mirrors are undersized and have central holes"), but the factor and the hole are NOT FOUND, so the f/25 pupil is drawn as the full f/15 pupil (eps 0.24). The tooltip does not say so. Suggest a fieldNote sentence: "The f/25 secondary was undersized and had an oversized central hole (sizes not published); the f/15 pupil is drawn."

### Values marked DERIVED, INFERRED or NOT FOUND, and silent assumptions

| item | preset value | status and best-supported value |
|---|---|---|
| flat-to-flat 1.5588 m | DERIVED √3 × 0.900 | equals KOTN163's first-ring radius "1.55885"; OK |
| F1 1.5983 (f1 = 17.50 m) | DERIVED 17.5/10.949 | KTG02 "focal length, 17.5 m"; KOTN163 R = 34.974 m gives 17.487 m (0.07%); OK |
| F on 10.949 m (13.66, 22.81, 36.08) | DERIVED | from 149.583, 249.7, 395.0 m; OK |
| eps 0.2375 (2.6 m) | design value | 2.48 m measured (L21), 2.65 m (CPSF); disclosed |
| vanes at 30, 90, ... deg | figure read-off of L21 Fig. 1 | consistent with KOR90 Sec. 7.3 ("parallel" to the segment cracks); orientation relative to the elevation axis and the Nasmyth platforms NOT FOUND (silent) |
| Keck I pupil = Keck II pupil | INFERRED | disclosed in the comment; no Keck I measurement found |
| f/40 clip 10.445 m, hole 3.25 m | DERIVED from KRBC | shape wrong (finding 4) |
| f/25 stop and hole | NOT FOUND | drawn as f/15 (finding 6) |
| nasl reflections "about 10" | DERIVED (Keck II 10, Keck I 9) | OK |
| Nasmyth/bent tertiary height | silent default 2.19 m | 4.00 m (KOR90 Table 11-2, design; the only figure found) |
| Nasmyth/bent focus distance from the axis | silent default 8.76 m / 4.93 m | 6.50 m (KRBC; DERIVED for f/15) |
| f/25 focus position | 2.5 m behind (wrong) | 4.538 m in front (KOTN163) |

### Scored checks

- `area` 71.5 (info) is the DERIVED clear area; fine as info.
- `segmentsArea` 76 (tol 0.5%): KOR90 Table 11-1 "Effective collecting area 76m²", which KOR90 Sec. 5.1 identifies with the bare array ("The total area of the array is 75.8m²"); the check compares the gap-free lattice (75.79 m²), the matching configuration. OK.
- Segment count 36: a real test. Plate checks: circular (F was set from the published focal lengths), pass.

### Pupil, 2D, 3D

The pupil (pointy-topped segments, vanes along the gaps, 2.6 m disk) matches L21 Fig. 1 as read in the record. The 2D Nasmyth layout shows the tertiary at ≈ 2.2 m and the focus ≈ 8.8 m off axis (finding 2). The f/25 drawing passes the beam through the central hole (finding 1). The f/40 3D view labels the bent-Cassegrain port "Nasmyth focus" (finding 5).

---

## Magellan 6.5 m (magellan)

### Findings

1. **ERROR (contradiction on the page): the f/16 focus button says "East" while the tooltip says the side is unknown and the focus is drawn on the west side.** Preset `asm16`: `variant: "East, MagAO f/16"`, `where: "a Nasmyth station (which side is not published: drawn on the west)"`, and no `side` (default "down", the side of `nasw`). The research record: "Nasmyth platform (side NOT FOUND)"; MZ14 calls the station "the folded Nasmyth port (NAS)" without a side. Screenshot T1_magellan_asm16.png shows the "East, MagAO f/16" button with the focus drawn below the axis, as for West. I found no source that settles the side (saved PDFs Close 2018, Morzinski 2014, Kopon 2010 and the LCO MagAO page; one web search). Fix: `variant: "MagAO f/16"`, or settle the side and set `side` to match.

2. **NOTE (silent default, better value available by inference): the f/5 Cassegrain focus position.** Preset `cass5` has no `back`, so the focus is drawn 0.2 D = 1.30 m behind the vertex and the f/5 secondary at s = (4.288 × 8125 − 1300)/5.288 = 6343 mm (DERIVED). M15 Sec. 3.1 (quoted in data/telescopes/magellan.md): "The f/5 optics at the MMT and Magellan Clay telescopes are essentially identical"; the MMT's TR35 prescription (data/telescopes/mmt.md, f/5 imaging row) puts the secondary 6184.4 mm above the vertex and the focus 1812.5 mm behind it. Suggest `back: 0.279` (INFERRED from the MMT), giving s = 6246 mm, within 1% of the MMT spacing.

3. **NOTE (silent defaults): the Nasmyth and folded-port geometry.** `nasw`, `nase`, `asm16`: tertiary 0.2 D = 1.30 m above the vertex, focus 0.8 D = 5.20 m from the axis; `aux`: `backN: 0.5` (3.25 m). No source in the record gives either distance (D11 says only "a rotatable tertiary, just above the primary mirror"). The drawn f/11 spacing (s = 9667 mm, DERIVED) and the f/16 spacing (9133 mm) follow from these choices and have no source to check against. The comment should say the distances are schematic, as the Subaru comment does.

4. **MISLEADING (label): the folded ports are labeled "Nasmyth focus" and "tertiary (flat) to the Nasmyth focus"** (same code path as Keck finding 5). Fix: `focusLabel: "folded-port focus"` on `aux`.

5. NOTE: `field: null` at the f/11 foci, although CS98N9 gives "field of view: 30 arc-min dia." with the corrector and BD03 "unvignetted fields with a diameter of 24 arcmin". The corrector is on Baade only (the preset shows Clay), so null is defensible; a fieldNote would help.

### DERIVED, INFERRED, NOT FOUND, silent assumptions

| item | preset | status |
|---|---|---|
| eps 0.29 | MXP51, M18, L26 (Clay) | OK; Baade value NOT FOUND (comment says so) |
| vanes ±45° from x0 ±0.34 m, widths 0.75/1.5 in | hcipy make_magellan_aperture | which pair is widened: hcipy's choice (disclosed); orientation on the sky NOT FOUND (disclosed) |
| f/5 eps 0.277 (1.8 m mirror) | DERIVED | baffle and f/5 spider NOT FOUND (disclosed in pupilNote) |
| F 5.36 | DERIVED from 0.169 mm/″ (M15) | OK |
| F 16.16 | K10 "F/16.16 focal plane" | OK |
| area 30.13 | DERIVED | info only; OK |
| tertiary height, Nasmyth and folded-port distances | silent defaults | NOT FOUND (finding 3) |
| f/5 focus position | silent default 1.30 m | 1.81 m INFERRED from the MMT (finding 2) |
| f/16 side | "East" in the button, west in the drawing | NOT FOUND (finding 1) |

### Scored checks

Area is info. Plate 2.88″/mm checks pass (CS98N9 "2.88 arc-sec/mm" against F = 11, 0.17%). No other scored checks.

### Pupil, 2D, 3D

The pupil matches the hcipy model. The 2D Gregorian layout is internally consistent; its distances are schematic (finding 3).

---

## Hubble 2.4 m (hst)

### Findings

1. **ERROR: the two outer pads are mirrored.** Preset pads: `{ r: 1.07188, ang: 211.5 }` and `{ r: 1.07188, ang: 337.6 }`, i.e. 58.5° from −V3 on the −V2 side and 67.6° on the +V2 side.
   - OTAHB Figure 4.1 (Burrows 1990, p. 36, PDF p. 42 of rawdata/imaging/hst/Burrows1990_HST_OTA_Handbook_v1.0_NTRS19920008265.pdf; rendered and viewed): +V2 to the right, +V3 up; the arc labeled 58.5° runs from the −V3 vane to the lower-right (+V2) pad, the arc labeled 67.6° to the lower-left (−V2) pad.
   - The research record's own `tpupil_format_OTAHB_fig41` gives `ang: -31.5` and `ang: -157.6` (= 328.5° and 202.4°), and its pad table: "pad on the +V2 side ... angle_from_minus_V3_deg: 58.5", "pad on the -V2 side ... 67.6".
   - Tiny Tim (TTACS, quoted in the record) agrees on the side of the 58.5° pad: "-0.4615 0.7555 0.065 = OTA Pad 2" (V3, V2) = 58.6° from −V3 on the +V2 side.
   - Effect: the pupil (T1_hst_t_focus_cass.png) shows the left pad lower than the right one, the reverse of Figure 4.1, and the diffraction image is the mirror image. The area check cannot see this (the pads' area is unchanged).
   - Fix: `ang: 328.5` and `ang: 202.4`; the comment's "taken on either side of it" should name the sides (58.5° on +V2, 67.6° on −V2).

2. NOTE: primaryNote "about half a wave rms". PRIMOTA says "about one-half wave of spherical aberration" without "rms"; L12 gives "rms wavefront error estimates range from 253 [40] to 277 nm", ≈ λ/2 at 0.5-0.55 µm (DERIVED). Supported; "about" could read "≈". "Corrected since 1993 inside the instruments": PRIMOTA "remedied by corrective optics installed for the science instruments (SIs) during the first servicing mission in December 1993" (COSTAR then sat in an axial bay; the wording is acceptable for 2026, when "all onboard instruments have internal corrective optics").

### Verified

D 2.4, F1 2.3 (L12 "f/2.3"), eps 0.33 (Fig. 4.1 "396.0"), vanes 25.654 mm full (Fig. 4.1), +V3 pad at 1066.8 mm, pad diameter 150.368 mm, hole 0.6 m (L12), F 24, plate 3.58 (PRIMOTA), back 0.625 (OTAHB Table 2.1 "Vertex Back Focus 1500.129 mm"), drawn s = (10.435 × 5520 − 1500)/11.435 = 4906 mm against "Spacing 4906.071 mm" (DERIVED), field 28′ (L12), FGS quarter annuli 10′-14′ (FGSIHB). Area 3.899 m² reproduces OTAHB's 38990 cm² (a real, published check).

### DERIVED, INFERRED, NOT FOUND

| item | status |
|---|---|
| viewing sense of Figure 4.1 (sky or focal plane) | NOT FOUND; disclosed in the comment |
| reflections 2 (axial) / 3 (radial) | DERIVED; disclosed in the record, not on the page |

### Pupil, 2D, 3D

The 2D layout (spacing 4.906 m, focus 1.50 m behind the vertex) matches OTAHB. Only the pads are wrong.

---

## JWST 6.6 m (jwst)

### Findings

1. **MISLEADING (low): the drawn segment gaps are 16.1 mm; the note says 7 mm.** Preset pupil `flat: 1.3235, gap: 0.0161`; primaryNote "1.32 m across the flats with 7 mm gaps". MC23 Sec. 3.1: "Each of the 18 primary mirror segments are 1.32 m (flat-to-flat) separated by 7 mm gaps"; the STPSF polygons have gaps of 7.61-7.67 mm (DERIVED in the record). The comment explains the choice: regular hexagons on the 1.3235 m pitch with 16.1 mm gaps reproduce STPSF's 26.641 m² of segment area (the STPSF segments are not regular and are ≈1% smaller in projection). Effect: the gap diffraction is ≈2× too strong; with 7.65 mm gaps the segment area would be ≈27.0 m² (+1.3%, DERIVED). Either choice is defensible; the pupilNote should state the drawn gap width.

2. NOTE: the scored area 25.779 m² (tol 0.6%) is the STPSF geometric clear area (DERIVED), which the gap was tuned to match; the measured value is 25.44 m² (MC23 Sec. 5.4), 1.3% less. The check tests the tuning, not a publication; the src says so.

### Verified

F 19.909 = 131.4/6.6 (MC23 "f/20 with an effective focal length of 131.4 m"); plate 1.5697 (DERIVED); RoC 15.88 m (MC23 Table 2 "15879.7"); secondary 0.738 m, 7.17 m (MC23 Table 2 "7169.0 ... 738"); f/9 intermediate focus: back −0.2114 gives s = (7.481 × 7940 + 1395)/8.481 = 7168 mm (DERIVED) against 7169.0, and the focus 1.39 m in front of the vertex (DERIVED in the record from MC23's 59.4 m EFL); struts at −60° and −120° (STPSF azimuths 150° and 210° from +V3); 18 segments; focal surface ≈1.96 m behind the vertex (G06).

### DERIVED, INFERRED, NOT FOUND

| item | status |
|---|---|
| pitch 1.3235, gap 0.0161 | DERIVED tuning (finding 1) |
| Korsch layout | schematic, disclosed: tertiary drawn 0.35 D = 2.31 m behind the vertex (MC23: 0.796 m); one fold flat 0.79 m behind (the real FSM is 1.048 m in front); focus 0.6 D past the flat |
| strut widths | STPSF only (no paper states them); disclosed |

### Scored checks

Segment count 18: real. Area: see finding 2. Plates circular.

---

## DKIST 4 m (dkist)

No errors found.

- Off-axis geometry: `F1: 2, offAxis: 4.0` matches OH16 Table 1 ("Radius of Curvature, RoC (mm) 16000", "Off-axis Distance (mm) 4000") and R20.
- Gregorian `back: -0.34125` (−1.365 m) gives s = (6.5295 × 8000 − 1365)/5.5295 = 9200 mm (DERIVED), the M2 vertex position the record derives from SPEC-0029 (via M20) for a coaxial M2. The coaxial assumption is DERIVED, but the record shows that it reproduces HS17's angles of incidence (14.04°, 11.84°, exit 4.39°); I regard it as well supported.
- Zerodur: OH16 Table 1 "Material ... Zerodur (SCHOTT)"; R20 "The Zerodur mirror". 4.24 m (R20) against 4200 mm (OH16 Table 1); the preset follows R20.
- NOTE: fieldNote "a 2.8′ field stop for the adaptive optics". NUT: "2.8 arcmin (all instruments)", "5 arcmin (Cryo-NIRSP only)". Suggest "a 2.8′ field stop for the instruments fed by the adaptive optics; 5′ for Cryo-NIRSP".
- Scored: area 12.56 m² (R20) against the unobstructed 4 m circle; trivially true. Plate checks circular.

---

## VLT 8.2 m (vlt)

No errors found.

- Cassegrain: F1 = 14.4/8.115, F 13.4106, back 0.30807 (2.50 m) give s = 12425 mm (DERIVED) against VLT White Book Fig. 3.12 "12426.95" (vertex to M2, figure read-off in the record).
- Nasmyth: `a3: 2.5`, `backN: 0.85` (6.8 m) give s = 12397 mm (DERIVED) against 9896 mm above the elevation axis + 2500 mm = 12396 mm (EUT drawing).
- Primary note (175 mm, 150 actuators, R 28.8 m, 8.186 m reflecting), hole 1.0 m, M3 2.5 m above the vertex, fields 15′/2.68′ and 30′/7.15′, pupils 8.115/8.0 m: match WB and SPEC as quoted in data/telescopes/vlt.md.
- NOTE: the Cassegrain pupil omits the stowed-M3 shadow. M20 Fig. 1 caption (UT4): "a bump to the lower right due to the M3 mirror"; the hcipy UT4 model draws a 1.070 m square. Its size for UT1-UT3 is NOT FOUND. The `cass` fieldNote says "the tertiary turned out of the beam" without mentioning the shadow; one sentence would fix that.
- NOTE: the vane frame relative to Nasmyth A and B is NOT FOUND (disclosed). K21's "rotated by 81.8 deg clockwise" is the rotation of their plot, not an orientation.
- Scored: area is info (48.71 DERIVED). Plates circular.

---

## GMT 25.4 m (gmt)

No errors found.

- Direct Gregorian: s = (11.533 × 18000 + 5830)/10.533 = 20262 mm (DERIVED) against CoDR 2006 "M1-M2 separation, S 20.290 meters" (0.14%; current value NOT FOUND); focus 5.83 m below the vertex (OAD Sec. 3.1.1).
- Folded port: `a3: -3.90, backN: 0.07584` reproduce OAD Sec. 3.1.2 ("M3 ... 1930 mm from focus").
- Truss: I checked the preset's strut angles and start points against hcipy `make_gmt_aperture` (rawdata/telescopes/gmt/hcipy_ee20b03_aperture_realistic.py, lines 1041-1063): with `grid.shifted(p)` moving the origin to −p and `rotated(θ)` pointing the strut along −θ, the hcipy struts land at 350.17°/189.83° and 11.2° from the nodes (0, −2.386) and (0.05, −2.409), as in the preset.
- NOTE: hcipy states its numbers carry "Small corrections ... from internal GMTO files" (center segment 8.293 m, off-axis 8.350 m, gap 0.447 m); the preset uses the OAD's 8.365 m for all seven. The OAD is the better public source; the difference is a choice.
- NOTE: `segmentsArea` src says "DERIVED", but OAD Table 4-29 prints the same number ("On-Axis Collecting 320.601 375.558"). The src can cite the OAD.
- Scored: segmentsArea 375.558 against the gap-free model (375.51), the matching configuration. Area 357.0 info.

---

## HET 10 m (het)

No errors found.

- R 26.164 m, 91 segments with apothem 0.5 m and 11 mm gaps, five rings around a center segment, flats at ±y with the 11.11 m span along y: pyHETobs (PHP, PHU) as quoted in the record. The `rot: 30` lattice puts the segment columns along y, as pyHETobs does.
- Bars 0.29 m at |x| = 1.30-1.59 m, eps 0.45, F 3.65, plate 5.65″/mm, field 22′ (18′ science): MDO, H21, K21.
- NOTE: "1 m across the flats" in primaryNote rests on pyHETobs's apothem; the observatory says "Hexagonal, 1m diameter" (MDO), undefined. The record discloses this; the page does not.
- NOTE: the scored area 55.5 m² (tol 1.2%) and the `areaTrack` ranges are DERIVED rasters of the same pyHETobs geometry; the checks compare two rasters of one model. K21's "8.5 m" equivalent at track center (56.7 m², DERIVED) agrees within 1.5%.
- The Wide Field Corrector is drawn as one lens 0.6 m before the prime focus (schematic, disclosed).

---

## Subaru 8.2 m (subaru)

### Findings

1. **ERROR: the optical Nasmyth focus is credited to the 1.33 m Cassegrain secondary; it has its own 1.40 m secondary.** Preset `nsopt`: `secondary: "the optical secondary (1.33 m); a flat tertiary"`.
   - Iye et al. 2004 (rawdata/telescopes/subaru/Iye2004_PASJ56_381_SubaruPerformance_arXiv0405012.pdf, Table 1, PDF p. 3): "M2(Opt/Cass) 1330 -5524.297 -1.917322232 -12652.174 / M2(Opt/Nas) 1400 -5877.420 -1.865055214 -12484.300".
   - Iye Sec. 2.1: "The optical Nasmyth focus utilizes a dedicated secondary mirror to cover a 4′ field of view".
   - The research record's foci table also lists "M2 Opt/Nas: convex hyperboloid, 1.400 m".
   - Fix: `secondary: "the optical Nasmyth secondary (a dedicated mirror, 1.40 m); a flat tertiary"`. The primaryNote ("a secondary (optical or infrared) for the Cassegrain and Nasmyth foci") should read "one of three secondaries (optical Cassegrain 1.33 m, optical Nasmyth 1.40 m, infrared 1.265 m)".

2. NOTE: Iye's text says the optical Nasmyth secondary covers "a 4′ field of view", while Iye Table 2 gives 6′ without the rotator and 3.5′ with it. The preset uses the table (6′). The conflict is not in the record's Conflicts section.

3. NOTE (silent defaults, small effect): the Nasmyth foci use the default tertiary height (0.2 D) and distance (0.8 D). The unfolded back focus then comes out 4.92 m (optical) and 4.77 m (infrared) against Iye Table 2's "Back focus (mm) ... 4600 ... 4992.6" for the configurations drawn, and the drawn secondaries sit at 12450 and 12639 mm against 12491 and 12612 mm (DERIVED from Iye Tables 1-2; 0.2-0.3%). The comment discloses that the Nasmyth distance and tertiary are NOT FOUND. Setting `backN·D − a3` to 4.600 m (`nsopt`) and 4.9926 m (`nsir`) would make the drawn spacings match Iye exactly while keeping the schematic tertiary.

### Verified

Cassegrain s = (6.6667 × 15000 − 3000)/7.6667 = 12652 mm (DERIVED) equals Iye Table 1's "-12652.174"; F values and plates (12.195/2.063, 12.4634/2.017, 13.912/1.865 on 7.9475 m) equal Iye Table 2; HSC F 2.2459 (18.4 m); 6′ fields; eps 0.298 at the IR Nasmyth (2.369/7.9475).

### DERIVED, INFERRED, NOT FOUND

| item | status |
|---|---|
| vanes at all foci = the IR Nasmyth measurement | INFERRED (same spider, I04); disclosed |
| obstruction at the prime, Cassegrain and optical Nasmyth foci | NOT FOUND; drawn 2.37 m; disclosed. A web search (LSST DMTN-064 on HSC donuts) found no published HSC pupil dimensions |
| Nasmyth distance and tertiary | NOT FOUND; schematic; disclosed (finding 3) |
| platform sides | NOT FOUND ("optical"/"infrared" only); disclosed |
| HSC corrector as one lens 1 m before focus | schematic; disclosed |

### Scored checks

Plates only (circular, pass). No area check (no official area).

---

## Yerkes 40-inch (yerkes)

1. **UNSUPPORTED (low): primaryNote "the largest refractor built for astronomy".** The saved sources support "largest of its time": H97 p. 41, "an increase in aperture of but four inches over the largest equatorial refractor hitherto constructed"; P93 (1893), "is the largest refracting telescope in the world". No saved source makes the present-tense claim. Fix: "the largest refractor of its time".

2. **Verified: the color curve.** I rendered Fox (1908) Table IV (p. 251, PDF p. 15 of Fox1908_ApJ27_237_InvestigationFortyInchObjective_ADSscan.pdf, 260 dpi) and read the Arcturus "Mean" column. All 17 preset pairs equal the readings minus 445.28 mm (the 5732 Å minimum), including the 4110 Å row, which Fox prints between 4227 and 4102 Å.

3. Verified: D 1.016 m (HE99 "40 inches"), f 19.354 m at 50 °F (B17), −17.5 mm for 45 °C of cooling (HE99), first observations 21 May 1897 (HC97), Mantois discs (H97), crown in front (B17). Plate 10.67″/mm (B17 "1″ = 0.0937 mm") against the model's 10.658 (0.12%; the check passes). The 45′ field is the long side of the 20 × 25 cm plates (S10), a disclosed choice. The unobstructed pupil is INFERRED and disclosed.

---

## ELT 39 m (elt)

No errors found.

- Lattice pitch 1.2274 m DERIVED from ESO's circumscribed radius 19.5732 m; rcut 18.963 m DERIVED to give 798 segments and 588 without rings 5-9 (both ESO counts); the record shows the inner-edge fit wants 1.2432 m, so the drawn hole (9.29 m flats) is ≈1.3% smaller than ESO 2011's 9.417 m. Disclosed in the record.
- ESO's "about 1.45 metres in size (corner-to-corner)" on the curved mirror against 1.413 m corner to corner implied by the drawn pitch: the record attributes the difference to foreshortening; the primaryNote quotes 1.45 m. Acceptable with the "on the mirror" wording already in the comment.
- Nasmyth: F 17.474 on 39.146 m = 684.022 m; plate 0.30155 (R18 0.3016); 10′ unvignetted, focal surface radius 9.9 m, 27.2 m from M5; mirror sizes and positions as in the record. The Korsch drawing is schematic and the fieldNote says so.
- NOTE: the pupilNote omits A24 (Sec. 2): "five of the six spider arms will be made slightly thinner thanks to the latest evolution in the design of the ELT spider arms" (widths NOT FOUND). One clause would cover this.
- NOTE: vane width 0.53 m (AnisoCADO) against 0.5 m (M26) and 0.4 m (hcipy, H19 figure); disclosed as third-party.
- Scored: segment count 798 (real; reproduces ESO's count by construction of rcut); segmentsArea 1041.13 DERIVED (gap-free lattice, matching configuration); area 978 info (model 991.4, +1.4%).

---

## Seeing model (data/telescopes/seeing.md; web/tpupil.js)

The two constants match their sources: K_OTF = 3.44 (half of 6.88, SR90 Eqs. 7 and 22, T02 Eqs. 15-16; C85 Eq. 5.2 prints 3.44) and K_FWHM = 0.976 (M10 note 1; the record's Hankel transform gives 0.9755). validate_img.js checks the 2D image against an independent Hankel transform at three settings (pass). NOTE: the model is pure Kolmogorov (infinite outer scale). M10, which the record cites for 0.976, is about the outer scale making large-telescope images smaller than the DIMM seeing; the Image box could say that its "Seeing FWHM" is the Kolmogorov value.

---

## Cross-cutting code issue

- web/imgapp.js line 645 labels each flat tertiary "to the Nasmyth focus", and line 687 and web/tel3d.js line 158 fall back to "Nasmyth focus". Foci in this group that are not Nasmyth foci: Keck `bent` and `f40` (bent Cassegrain), Magellan `aux` (folded ports), GMT `fp` (has `focusLabel: "folded-port focus"`, but the tertiary's sub-label still says "to the Nasmyth focus"). Fix: pass `P.focusLabel` into the tertiary sub-label and add `focusLabel` to the Keck and Magellan entries.

---

## Summary

### (a) Confirmed errors, ranked by severity

1. **Keck f/25 focus on the wrong side of the primary.** `back: 0.2283` → `-0.4145`; `where` → "the Forward Cassegrain Module, 4.54 m in front of the primary's vertex, near the elevation axis". Source: KOTN163 "Back focal distance e(m) -4.538", "Primary-sec. Distance d(m) 16.640457"; KTG02 Secs. 3.1.3 and 3.2.3. Effect: the f/25 beam is drawn through the primary's hole to a focus 2.5 m below the mirror, and the secondary is drawn 2.7% too close (16.19 against 16.64 m).
2. **Keck Nasmyth and bent-Cassegrain geometry left at the code defaults.** `nasr`, `nasl`, `bent`, `f40`: add `a3: 4.0, backN: 0.5937`. Sources: KOR90 Table 11-2 "Elevation axis to mirror vertex 4.00m"; KTG02 Sec. 3.2.2 tertiary "mounted on the elevation axis"; KRBC "The distance from the tertiary to the optimal focal plane is 6.500 m"; KOTN163 back focal distance 2.5000 m. Effect: the tertiary is drawn at 2.19 m instead of 4.0 m; the Nasmyth focus 8.76 m from the axis instead of 6.5 m, which also pulls the Nasmyth secondary 0.42 m (2.7%) toward the primary; the bent-Cassegrain focus 4.93 m from the axis instead of 6.5 m.
3. **HST pads mirrored.** Pad angles 211.5° and 337.6° → 202.4° and 328.5°. Source: OTAHB Figure 4.1 (58.5° on the +V2 side, 67.6° on the −V2 side), the research record's own tpupil-format entry (−31.5°, −157.6°), and Tiny Tim's pad table. Effect: the pupil and the diffraction image are mirror images of the published pupil; the area check cannot detect this.
4. **Subaru optical Nasmyth secondary.** `nsopt.secondary` "the optical secondary (1.33 m)" → "the optical Nasmyth secondary (a dedicated mirror, 1.40 m)"; primaryNote to name three secondaries. Source: Iye et al. 2004 Table 1 ("M2(Opt/Nas) 1400") and Sec. 2.1 ("utilizes a dedicated secondary mirror"). Effect: wrong text in the focus tooltip and summary.
5. **Magellan f/16 button says "East"; the side is unpublished and the drawing puts it west.** `asm16.variant` → "MagAO f/16" (or settle the side and set `side`). Source: the record ("side NOT FOUND"); MZ14 names only "the folded Nasmyth port (NAS)". Effect: a visible contradiction between the button and the layout.
6. **Keck f/40 stop drawn round.** The undersized f/40 secondary is a shrunken serrated hexagonal outline (KRBC Fig. 4) with a hexagonal hole 3.25 m corner to corner. Fix: scale the hex outline by 0.954 as the stop and draw the hole as a hexagon, or say in the fieldNote that the drawn circle overstates the area. Effect: the f/40 pupil is drawn with ≈ 67 m² against ≈ 62-63 m² (DERIVED), and the outer edge has the wrong shape.

### (b) Unsupported or misleading claims

- Yerkes primaryNote: "the largest refractor built for astronomy" (sources support only "largest of its time", H97, P93).
- Labels "Nasmyth focus" and "tertiary (flat) to the Nasmyth focus" on bent-Cassegrain and folded-port foci (Keck `bent`, `f40`; Magellan `aux`; GMT `fp` sub-label).
- JWST primaryNote "7 mm gaps" while the pupil is drawn with 16.1 mm gaps (a disclosed tuning in the code comment, not on the page).
- Keck f/25 drawn with the full f/15 pupil although the f/25 secondary was undersized with an oversized hole (KTG02 Sec. 3.1.4); the tooltip does not say so.
- Magellan f/5 Cassegrain focus position and the Magellan Nasmyth/folded-port distances: code defaults with no source and no "schematic" disclosure (the f/5 position is better taken from the "essentially identical" MMT f/5 optics, M15: back ≈ 0.279 D).
- Subaru Nasmyth back focus: defaults give 4.92/4.77 m against Iye's 4.600/4.9926 m (0.2-0.3% effect on the drawn spacing; disclosed as schematic).
- VLT Cassegrain pupil without the stowed-M3 shadow, with no mention in the tooltip.
- ELT pupilNote omits the newer design with five thinner arms (A24).
- DKIST fieldNote "a 2.8′ field stop for the adaptive optics" (NUT: 2.8′ for all instruments, 5′ for Cryo-NIRSP).
- Scored checks that test a DERIVED number against the model that produced it: JWST area 25.779 (tuned; measured 25.44), HET area 55.5 and areaTrack (pyHETobs rasters). All plate-scale checks are circular. GMT `segmentsArea` is labeled DERIVED but is printed in OAD Table 4-29.

### (c) Open questions only the builders (or observatories) could answer

- Magellan: which Nasmyth platform carried MagAO's f/16 station; the tertiary height and the Nasmyth and folded-port focus distances; the f/5 baffle and spider; which two Clay vanes carry the 1.5-inch cable trays; the pupil's orientation relative to the elevation axis.
- Keck: the as-built elevation-axis height (only KOR90's 1985 design value of 4.00 m found); the f/25 secondary's undersizing and hole; the f/40 chopper's extra vanes; the spider orientation relative to the Nasmyth platforms.
- Subaru: the central obstruction at the prime, Cassegrain and optical Nasmyth foci; the Nasmyth focus distance from the axis; which platform is east.
- VLT: the stowed-M3 shadow at UT1-UT3 Cassegrain; the spider orientation relative to Nasmyth A and B.
- HST: whether OTAHB Figure 4.1 shows the pupil from the sky or from the focal plane (this decides the handedness on the sky, separately from finding (a)3, which is about matching the figure).
- ELT: the spider widths (five thinner arms), the pupil orientation on the sky, which platform faces east.
- GMT: the current M1-M2 separation and the pupil orientation relative to the elevation axis.

### (d) New sources saved

None. I downloaded no files. Two web searches (MagAO Nasmyth side; Subaru prime-focus pupil) and one page read (LSST DMTN-064, https://dmtn-064.lsst.io/) found nothing quotable, so nothing was saved to rawdata/. Renders and text extractions used for this audit are in the scratchpad: `audit/txt/otahb_p42-42.png` (OTAHB Figure 4.1), `audit/txt/fox_a.png` (Fox Table IV, Arcturus columns), `audit/txt/iye.txt`, and screenshots `audit/shots/T1_keck_t_focus_nasr.png`, `T1_keck_t_focus_f25.png`, `T1_keck_f40_3d.png`, `T1_hst_t_focus_cass.png`, `T1_magellan_asm16.png`.
