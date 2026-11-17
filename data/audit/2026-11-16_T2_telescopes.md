# Audit T2: telescope presets (vista, mmt, oschin, gemini, hale, tmt, lbt, blanco, sdss, mayall, rubin)

Scope: web/tpresets.js as read 2026-11-16 after the T1 edits (the eleven presets here are unchanged by them), the research records data/telescopes/<id>.md, and the saved sources under rawdata/telescopes/<id>/ (text extracted with pdftotext -layout; HTML tag-stripped; nothing executed). Quotes are from those saved files. No project file was edited and no new download was needed: every question was either settled, or shown to be open, by the saved sources. `node validate_img.js` gives 369 pass, 0 fail. Headless screenshots of the 2D and 3D views are in scratchpad/audit/shots/ (T2_*.png and the montages M1-M4.png).

Method note: where I re-opened a source for a load-bearing value the verdict says OK. Where the only support is the research file's quote from an OCR-only scan (Bowen 1961 and the 1954 Atlas for Hale and Oschin), the verdict says "research quote, not re-read".

## Cross-cutting findings

1. The plate-scale checks in validate_img.js (section 6c) are circular wherever F was derived from the plate scale (vista, mmt f/5 foci, blanco pf, hale pfw, lbt pfb/pfr, sdss, mayall pf/mosaic): the check recomputes 206265/(F D) from an F that was itself computed from the plate scale. It shows only that imager.js's paraxial two-mirror model reproduces F, not that F is published. The values themselves are sourced.
2. Nine of eleven area lines are `info: true` and compare the pupil with a number derived from the same pupil (vista, mmt, oschin, gemini, hale, rubin, blanco, sdss, lbt). Only Mayall (8.658 m2, desimodel) and TMT (633.5 m2, "28.4-meter equivalent") are scored against an external number.
3. Several pupils are drawn for historical or secondary foci with a top end that belongs to a different configuration (Blanco f/8 and Mosaic II, Mayall pre-DESI foci, MMT all foci, VISTA 4MOST). Some pupilNotes disclose this; the exceptions are listed per telescope.
4. None of the eleven holes (VISTA 1.20 m, MMT 0.898 m, Gemini 1.2 m, Hale 1.016 m, LBT 0.889 m, Blanco 1.3178 m, SDSS 1.17 m, Mayall 1.324 m) is contradicted by a saved source.

---

## VISTA 4.1 m (vista)

### Values checked

| field | preset | source (file, location, quote) | verdict |
|---|---|---|---|
| Dmirror, clear aperture | 4.10 m, 3.96 m | Sutherland 2015, Table 2: "M1 4100 3960 8094.2 -1.12979" | OK |
| R, f1 | 8.094 m, 4.0471 m | same row; f = R/2 | DERIVED-OK |
| thickness, hole | 17 cm, 1.20 m | Sec. 5: "4.10 m outer diameter with a 1.20 m diameter central hole, a thickness of 17 cm" | OK |
| "most strongly curved mirror of this size" | primaryNote | ESO mirror page: "the most highly curved mirror ever made of this size and quality" | OK |
| secondary 1.24 m, 2725.7 mm | focus text | Table 1: "M1 - M2 spacing 2725.7 mm"; Table 2: M2 1241.5 mm | OK |
| D = 3.70 m, secondary is the stop | D | Sec. 2: "the 1.24 m secondary mirror is undersized to form the aperture stop, so each detector pixel views a 3.70 m off-centre circle on the primary mirror; the envelope of these is a 3.95 m circle" | OK |
| eps 0.4405 | 1.63/3.70 | Sec. 4.2: "polished aluminium annular baffle of 1.63 m outer diameter" | DERIVED-OK, VIRCAM era |
| spider width, attachment | w 0.036, x0 +/-0.70 | Sec. 6.3: "slanted upwards, and are non-radial, joining the central barrel at two opposite points. The spiders (each 36 mm total width)"; barrel "diameter of approximately 1.4 m" | OK; x0 = half the barrel (DERIVED) |
| spider angles +/-60 deg | vanes | no source; Winkler 2026 Fig. 3 is a photograph without readable angles | INFERRED |
| VIRCAM F 3.2627, plate 17.0862, back 0.31692 | | Table 1: "System focal length (with IR corrector) 12.072 m"; Sec. 4.2: "focal plane is located 1172.6 mm below the pole of the primary mirror" | OK |
| VIRCAM field | 1.65 deg | Table 1; Sec. 4.1: "350 mm, 1.65 degree diameter flat field" | OK |
| 4MOST F 3.3114, plate 16.835 | | 4MOST User Manual 6.1.2.1: "The plate scale of the WFC is about 59.4 um/arcsec"; 59.4e-6 m x 206265 = 12.252 m | DERIVED-OK |
| 4MOST field | 2.6 deg (ESO 2.5) | UM: "nearly unvignetted image of 2.6 degrees diameter"; ESO page: "2.5-degree diameter field-of-view" | OK |
| "four lens groups, two counter-rotating ADC prisms" | secondary text | 4most.eu Subsystems: "4 lenses with 2 counter-rotating prisms" | OK |
| 4MOST focus 0.31692 D behind vertex | back | not published | UNSUPPORTED (disclosed in fieldNote) |
| area 8.452 | info | qmostetc telescope.py: "The telescope area (8.452 m2 ... ) are hardcoded" | OK; model 8.49 (0.46%) |

### Inferred, derived and not-found values

- Spider angles, +/-60 deg (INFERRED). No saved source gives them. Effect: orientation of the spikes in the PSF and the pupil panel; total vane area (4 x 36 mm x ~1.2 m) is insensitive. The page says "a rough reading of photographs".
- Obstruction for the 4MOST focus. Haynes 2014 Sec. 2.3: "The WFC optical design requires modifications to the current VISTA telescope baffles". The 4MOST baffle diameter is NOT FOUND (web search also returned none). The pupilNote cites "the 1.63 m baffle" as if general; only the code comment says VIRCAM era. Effect: the current instrument's pupil may be less obstructed than drawn.
- 4MOST focus position (NOT FOUND): the layout for the current instrument is VIRCAM's; disclosed.
- Correctors not drawn; secondary 11 mm off the real position for VIRCAM (disclosed).

### Scored checks

Plate checks pass and are circular (F from the plate scale). Area is info only (8.49 vs 8.452).

### Visual check

2D shows "obstruction e 0.44"; 3D shows the slanted pair meeting the barrel at two opposite points and no barrel or baffle annulus. The pupil panel reads like the Winkler photograph. No visible fault.

### Summary (VISTA)

(a) No confirmed numeric errors. Minor: eps and the pupilNote are VIRCAM-era values presented for the 4MOST focus.
(b) Unsupported: spider angles; 4MOST focus position; 4MOST baffle size.
(c) ESO/4MOST: the 4MOST M2 baffle diameter and the spider leg angles.
(d) New sources: none.

---

## MMT 6.5 m (mmt)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| D 6.502 m, f1 8.128 m | | mmtwfs config "diameter: 6502.4 mm"; TR35 (research quote) | OK |
| hole | 0.898 m | PISCES snippet (ADS highlight): "central hole (0.898 m) in the primary mirror"; Miller 2025 Table 1 "Central Obscruation 0.9 meters" | OK; no MMTO document gives it |
| f/5 eps | 0.264 = 1.715/6.502 | TR35 Sec. 3.2 (1715 mm overall); Sec. 2.2 gives 1688 mm clear | DERIVED-OK; baffles not included (lower bound) |
| f/9 eps 0.157 | 1.022/6.502 | TR35 | OK |
| f/15 pupil 6.37 m, eps 0.141 | | Miller 2025 Table 1: "Pupil diameter (eff. diam ext.) 6.37 meters ... Central Obscruation 0.9 meters ... Spider width (approx.) 0.1 meters"; MMTO AO page: "1.9-mm thick and 640-mm in diameter" | OK; 0.9/6.37 = 0.1413 |
| vanes: four, 45 deg, 0.12 m | pupil | mmtwfs config.py: "n_supports: 4", "support_width: 0.12 m", "support_offset: 45.0 deg"; psf.py pupil_model: theta = offset + 2 pi k/n, rays with `along > 0` | OK as the observatory code's model: rays from the center at 45, 135, 225, 315 deg |
| vane width | 0.12 m | Miller 2025: "approx. 0.1 meters"; PISCES snippet: "spider arm supports (50 mm width)" | CONFLICT |
| same vanes at every focus | pupilNote | none | INFERRED |
| f/5 corrected foci F 5.298, 5.361; plates 5.988, 5.917; backs | | TR35 table "-1794.93 f/5 spectroscopy" (line 206), 0.167 and 0.169 mm/arcsec | OK |
| f/5 bare; MMIRS uses it | | research file: "inferred, not stated" | INFERRED, and the page says so |
| fields f/9 12', f/15 5' | | TR35/ICD03 12'; MMTI 5' (ICD03 6') | OK |
| instrument status | | MMTO overview: "Hectospec & Hectochelle (unavailable)" | OK |
| area 29.75 | info | DERIVED; Megacam paper: "we account for a telescope area of 29 m2" | consistent |

### Inferred, derived and not-found values

- Vane width: the observatory's wavefront code gives 0.12 m with no cited measurement; two papers say 0.1 m and 50 mm (the latter for an uncertain telescope). Using 0.1 m changes area by about 0.2 m2 (0.7%) and leaves the spikes essentially unchanged. Orientation relative to the elevation axis: NOT FOUND.
- f/5 baffles: McLeod 2015 Fig. 10 (rendered) shows the MMT f/5 baffle as a tube with ring baffles and a top plate; "an appropriately sized obscuring disk at the center of M2". No diameters. The f/5 obstruction is a lower bound, as the page states.
- f/9 hub: NOT FOUND.
- f/5 corrector not drawn: secondary 6.23/6.25 m vs 6.18 m (disclosed).

### Scored checks

Corrected f/5 plate checks are circular. f/9 and f/15 plates (3.525, 2.159 "/mm) match the published 0.284 and 0.463 mm/arcsec.

### Visual check

f/15 2D: primary drawn at the 6.37 m pupil, secondary "obstruction e 0.14", four vanes at 45 deg in the pupil. Correct as described. No f/5 baffle ring.

### Summary (MMT)

(a) No confirmed numeric errors.
(b) Unsupported: vane width 0.12 m (papers say 0.1 m and 50 mm); the same vanes at all foci; the f/5 obstruction as the mirror alone.
(c) MMTO: spider width and orientation; f/5 cone and f/9 hub diameters.
(d) New sources: none.

---

## Oschin 48-inch Schmidt (oschin)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| D 1.2446 m (ZTF), 1.2573 m (plates) | | Dekany 2020 Table 1: "Entrance pupil diameter 1244.6 mm"; Harrington 1952: "The clear aperture in the camera is 49.5 inches (125.73 cm), giving a focal ratio of f/2.44" | OK |
| Dmirror 72 in; f1 3.062 m | | Dekany 2020: "mirror (diameter 1828 mm)", focal surface "3062 mm"; Reid 1991: "radius of curvature of 241 inches" | OK |
| ZTF F 2.46, plate 67.33 | | Dekany 2020 Table 1 "Working focal ratio 2.46"; Table 3 "Plate scale 1.01 per 15 um pixel" (206265 x 0.015/1.01 = 3.063 m, 67.33 "/mm) | OK; the model's 67.369 (0.06%) comes from rounding F = 3.062/1.2446 = 2.4603 to 2.46 |
| camera 20.2%, vanes 2.3% | | Dekany 2020: "22.5% total on axis beam obstruction, of which 2.3% is due to the 3 spider vanes"; Table 1 "22.4% on-axis, up to about 46% at field maximum" | OK |
| camera outline | octagon, window plus 19.6 mm border | Dekany 2020 3.2.3: "octagonal in plan view and 442 mm x 483 mm in size, with 595.5 mm flat-to-flat" | window sourced; border fitted to 20.2% (INFERRED) |
| vanes at 90/210/330 deg, 27.3 mm | | width DERIVED from 2.3%; angles from Smith 2014 Fig. 3 | INFERRED |
| field 5.4 deg (plates), 5.45 deg (ZTF) | | Reid 1991: "unvignetted field is of only 5.4 diameter"; Bellm 2019: "vignetting reaching 30% in the corners" | OK; ZTF 5.45 DERIVED |
| "corners lose 0.1-0.2 mag" | fieldNote | Harrington: "greatest loss due to vignetting at the corners of the plate is 0.1 magnitude"; Atlas (research quote): "less than 0.2 magnitudes" | OK |
| "under 0.5 arcsec over 6.5 deg, 3900-9000 A" | | Reid 1991 Sec. 3.1 | OK |
| singlet 3/8-inch plate glass, both sides, 4358 A (4861 A in the Atlas) | | Harrington: "selected plate glass ... figured on both sides ... correction is for lambda 4358" | OK |
| "completed in 1948" | | Palomar page | OK |
| doublet LLF6 + BK7W, Grubb Parsons, 1985 | | Reid 1991 | OK |
| plate-era holder (14-inch) and 20 mm vanes | | NOT FOUND | INFERRED, disclosed |

### Inferred, derived and not-found values

- Camera outline: window dimensions are published; the border is fitted to the published area; the 483 mm side along the CCD rows is INFERRED from Smith 2014 Fig. 3. Area is right by construction; the diffraction pattern depends on the outline.
- Single vane toward north or south: NOT FOUND. Orientation of one spike only.
- Plate-era plateholder: a 14-inch plate is a lower bound (10.2% of the pupil), so the POSS obstruction is underestimated and the plate-focus peak and FWHM are slightly optimistic.

### Scored checks

The ZTF area (0.944 m2) is 22.4% obstruction by construction: the camera and vanes were sized to the two published fractions, so the check is circular. Plate scales pass.

### Visual check

ZTF 3D: camera on a three-vane hub inside the tube, mirror larger than the stop. Pupil: round stop, octagonal block, three vanes. No fault.

### Summary (Oschin)

(a) No confirmed errors.
(b) Unsupported: plate-era vane width and holder size (disclosed); the camera border (fitted).
(c) Palomar/ZTF: the cryostat cross-section (Dekany 2020 Fig. 11 is missing from the arXiv version); the single vane's direction.
(d) New sources: none.

---

## Gemini 8.1 m (gemini)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| D 7.9 m, secondary is the stop | | Zemax GEM_F16_MK header "ENPD 7900"; SURF 4 `STOP` at the secondary | OK |
| hole 1.2 m, Dmirror 8.1 m | | Gillett 1996; Zemax obscuration radius 600 mm (two Gemini pages say 1.18 m) | OK; conflict listed |
| f1 14.402 m, plate 1.60994 | | Zemax SURF 3: CURV -3.4717e-5 (R = 28804 mm), conic -1.003825; 206265/128.12 m | OK |
| secondary 1.02 m, 12.54 m above | | Zemax SURF 4: CURV -2.38652e-4, DISZ 12542.66, conic -1.618, DIAM 511.97 (semi-diameter) | OK |
| secondary hole 168 mm | | Gillett 1996: "0.168-m diameter central hole"; Buchroeder 2001: "168 mm diameter hole" | OK |
| eps 0.164 | | NICI page: "compared to 0.164 for the telescope central obstruction" | OK |
| optical baffle 2.003 m, eps 0.2535 | | Gillett 1996: "secondary baffle position, about 2 m diameter, to block direct sky illumination" | OK (2.003 from the baffle drawing, research file) |
| vanes 10 mm | | secondary-support fact sheet: "Ultra-thin steel 10mm/.39inch thick" | OK |
| vane offset 0.214 m, +/-46.5 deg | pupil | read off a GPI pupil image; Nguyen 2022 says only "four support struts" | INFERRED |
| coating silver | | Gemini fact sheets: "protected silver" | OK |
| port distances 4.0, 2.9, 1.1 m; fields 10', 7', 12' | | Zemax GS model and ISS ICD (research file) | research quote, not re-read |

### Inferred, derived and not-found values

- Vane geometry is read off an image and turned to a horizontal line; sky orientation NOT FOUND (the pupilNote says so). Vane area (4 x 10 mm x ~3.8 m = 0.15 m2) is insensitive to the angle.
- The "1.12 m retracted baffle" in the up-looking fieldNote was not found in the text I searched; not re-verified.
- Area 47.57 m2 is DERIVED; Gemini publishes none.

### Scored checks

Plate checks pass and are circular. Area is info.

### Visual check

Side-port 3D shows the 45-degree fold below the primary; the 2D up-looking port is a Cassegrain with a small hole in the secondary. Eps 0.16 matches the 1.30 m hole in the pupil. No fault.

### Summary (Gemini)

(a) No confirmed errors.
(b) Unsupported: vane offset and angles (image read-off); the 1.12 m retracted baffle.
(c) Gemini: the spider drawing; orientation relative to the ISS.
(d) New sources: none.

---

## Hale 200-inch (hale)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| D 5.08 m, hole 40 in | | Bowen 1961 (research quote): "40-inch hole in the center" | research quote, not re-read |
| f/3.3, 660 in = 16.76 m | | Palomar Hale page: "f/3.3, focal length 660 inches or 16.76 meters"; Anderson 1948: "focal length of 666 inches (55.5 feet)" | OK; the 666 in conflict is in the research file |
| Cassegrain 41 in, f 3200 in; coude 36 and 32 in, f 6000 in | | Anderson 1948: "The Cassegrain convex, 41 inches in diameter ... focal length of 3200 inches"; "Two coude hyperboloids, 36 and 32 inches ... 6000 inches" | OK |
| thickness "24 inches at the edge" | | Bowen (research quote) 24 in; Palomar "23 1/2 inches" | OK |
| cage 72 in, eps 0.3661 | | measured pupil, Galicher 2019 Fig. 3 via hcipy: `central_obscuration_diameter = 1.86` | DERIVED from a pupil image |
| vane width 12.7 mm | | Carlotti 2014 Sec. 3.2: "the spiders of the Hale telescope ... are 0.25% thick" | OK; hcipy uses `spider_width = 2 * 0.024` m (apparent, blurred) |
| attachment boxes 0.12 m to 1.0232 m | | hcipy: `box_width = 2 * 0.0932 + central_obscuration_diameter` (0.93 + 0.0932 = 1.0232) | OK |
| Cassegrain 1.524 m behind the front surface | back 0.3 | Bowen (research quote): "forms an image about 5 feet back of the front surface" | OK |
| Cassegrain field | 12.6' | none: drawn as the circle around the 4-Shooter's 8.9' square | UNSUPPORTED (disclosed) |
| coude flat selection "one flat for objects south of +43 deg, three for northern ones" | fieldNote | Bowen Sec. 1 (research quote): "three flat mirrors are required to reflect the light around the primary mirror" | the +43 deg figure is in the research file only; not re-read |
| area 17.43 vs ~20 m2 | info | Palomar: "about 31,000 square inches or 20 square meters" (the whole mirror) | OK, disclosed |

### Inferred, derived and not-found values

- Vane width 12.7 mm (Carlotti) vs 48 mm (hcipy): the preset takes the sourced thin value. Orientation horizontal and vertical per Galicher; sky orientation NOT FOUND.
- Coude secondary and unfolded focus 13.7 m behind the primary: INFERRED from the 36-inch mirror filling the beam (p = 36/200 x 660 in = 3.0175 m). F = 30 and the plate are correct; only the schematic layout depends on it, and the page says so.
- Corrector places (0.5 m before the focus): schematic, disclosed.
- Cassegrain focal ratio 16 vs 15.7-15.8 in the DBSP papers: disclosed.

### Scored checks

Plate checks pass; the Wynne value (12.0 "/mm from 0.18" per 15 um) is circular with F. Area is info.

### Visual check

Prime 3D and Cassegrain 2D look right (cage as the central shadow, 41-inch secondary at 13.6 m). The unfolded coude drawing could mislead a viewer about the real train.

### Summary (Hale)

(a) No confirmed errors.
(b) Unsupported: Cassegrain field 12.6'; coude secondary and focus placement.
(c) Palomar: the Cassegrain unvignetted field; vane geometry in an observatory document.
(d) New sources: none.

---

## TMT 30 m (tmt)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| 492 segments | | OAD43 REQ-1-OAD-1700: "it contains 492 segments" | OK; the lattice count check passes |
| projection | flat 1.24015 m | OAD43 REQ-1-OAD-1750: "hexagons radially scaled from 492 regular hexagons with side length of approximately 0.716 m"; REQ-1-OAD-1775: "alpha ... 0.1650" | OK; pitch 0.716 x sqrt 3 = 1.2402 m DERIVED |
| gap | pupil 3.5 mm; primaryNote "2.5 mm" | REQ-1-OAD-1715: "The nominal gap between segments is 2.5mm, and each segment has a 0.5mm bevel. Therefore, the optical gap between segments is 3.5mm ... total pupil obscuration is 0.56%" | OK; the two numbers are physical gap and optical gap, not explained on the page |
| segment size, thickness | 1.44 m corners, 45 mm | Segment Overview 2009: "nominally measuring 1.44m across the corners"; TMT optics page "45 mm thick" | OK |
| empty center and first ring | rings0 2 | OAD Fig. 4-3 (image) | OK per the figure and the 492 count |
| circumscribed 30.004 m | D | DERIVED from the lattice with rcut 14.46 m; OAD requires at least 30 m | DERIVED; rcut is free in 14.30-14.62 m |
| M2 envelope 3.6 m, eps 0.11998 | | drawing TMT.TEL.GTY-0001 Rev D | FIGURE READ-OFF |
| six legs, at most 225 mm, at 30 + 60k deg | | same drawing; REQ-1-OAD-1030: "maximum of 4% obscuration due to the shadow of the secondary mirror and its support structure" | width is a maximum; angles figure-read |
| f/15 (450 m), plate 0.458366; 16.5 m back focal distance; tertiary 3.5 m above vertex | | OAD Table 4-9 (research quote) | OK |
| area 633.5 m2 | | TMT page: "collect light as efficiently as a 28.4-meter unobstructed mirror"; pi/4 x 28.4^2 = 633.47 | see below |
| 664.2 m2 | note | TIO 2024 DSC: "collecting area of 664.2 m2" | OK, the alternative |

### Inferred, derived and not-found values

- Scored area. The source gives two digits: 28.35-28.45 m is 631-636 m2, so the model's 0.01% agreement is chance within a 0.7% window, and the check's 0.5% tolerance is wider than the source's precision. The legs are drawn at their maximum width, so the model's shadow is an upper bound; the 4% shadow limit would give 643 m2. The OAD's 0.56% gap obscuration is reproduced by the 3.5 mm gap.
- rcut: free within the range that gives 492.
- Legs: width is a maximum; angles from a figure.

### Scored checks

The 492 count is a genuine lattice test. The segments-alone 655.3 m2 (0.03%) uses the same geometry as the pupil, so it is a consistency check only. The area check is weak for the reason above.

### Visual check

3D: tiled primary with the central void, six legs along the segment rows, tertiary on the elevation axis, Nasmyth focus 20 m out. Pupil panel consistent. No fault.

### Summary (TMT)

(a) No confirmed errors.
(b) Loosely supported: the "scored" 633.5 m2 (two-digit source); leg width at its maximum; leg angles from a figure.
(c) TIO: as-designed leg width and the pupil obscuration pattern (AD41).
(d) New sources: none.

---

## LBT 2 x 8.4 m (lbt)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| 8.417 m, f/1.142, hole 0.889 m, spacing 14.417 m | | LBTO Quick Facts: "Primary Spacing: 14.417 meter center-to-center Primary Physical Diameter: 8.417 meter Primary Focal Ratio: F/1.142 Central Hole Physical Diameter: 0.889 meter" | OK |
| f1 9.612 m | | 1.142 x 8.417 | DERIVED (on 8.4 m, f = 9.593 m, 0.2% less); no source gives f |
| secondary 0.911 m, 672 actuators, asphere -0.7328, F/14.72, back focal distance 3.050 m | | Quick Facts: "Mirror diameter: 0.911 m (undersized secondary) ... Asphere: -0.7328 Focal ratio of full-aperture parent: F/14.72 Back focal distance: 3.050 m" | OK |
| tertiary 64 x 50 cm, 2.25 m above vertex | | Quick Facts: "Major axis diameter: 64 cm Location: 2.25 m above primary vertex" | OK |
| pupil 8.22 m, eps 0.1108 | | Bechter 2020: "secondary mirror blocking fraction of 11%"; 0.911/8.22 = 0.1108 | DERIVED (real-ray trace) |
| f 123.90 m, F 15.073, plate 1.6648 | | 14.72 x 8.417; 123.90/8.22 | DERIVED-OK |
| struts 0.073 m, 18 deg | | Bechter 2020 Sec. 5: "a (projected) width of approximately 8% that of the secondary diameter and form an 18-degree wedge angle" | OK (0.08 x 0.911 = 0.0729) |
| two struts at +/-9 deg, "toward the outer edge of the mirror" | pupil | Bechter gives no direction; Bailey 2014: "The dark wedge at 12 o'clock is the shadow of the support arms" (frame not stated); Spalding 2018 Fig. 2 photograph (rendered) | direction INFERRED from a photograph |
| LBC-Blue F 1.45, plate 16.935 | | LBC pages; Giallongo 2008: "unvignetted FoV is 27 arcmin" | OK; F derived from the plate scale |
| LUCI 4' x 4', vignetting beyond 4.5' | | LUCI manual Sec. 8.2.1 (research quote) | OK |
| LBTI combined focus: f/15 on 22.65 m, ~340 m, 0.61 "/mm, f/41 | | arithmetic: 15 x 22.65 = 339.8 m; 206265/339.8 m = 0.607 "/mm | DERIVED, flagged as such |
| area 55 m2 | info | Green & Hill 2009: 110 m2 for both | OK |

### Inferred, derived and not-found values

- Strut direction. The pupilNote states "toward the outer edge of the mirror" as a reading of a photograph. In Spalding 2018 Fig. 2 the swing arms hang from the central top structure over each mirror, and the direction cannot be read; Bailey 2014's wedge is at 12 o'clock of an unstated frame. Direction is NOT FOUND. Effect: the pupil panel and PSF spikes of one side only; the two sides are mirror images in the drawing.
- The two rays at +/-9 deg diverge (1.27 m apart at r = 4 m), so the pupil shows a wedge outline, not a filled shadow; this is the reading of "18-degree wedge angle" in Bechter and is acceptable.
- Prime-focus obstruction: D 8.4 m with eps = the 0.889 m hole (a lower bound); the LBC body shadow is NOT FOUND, so the real prime pupil is more obstructed than drawn.
- SX at -x: Rothberg 2016 says the left side is SX; whether "left" is seen from behind the telescope or from the sky is NOT FOUND. Effect: left/right labeling only.

### Scored checks

Area info 55 vs model 51.89 (-5.7%): the 55 m2 is the mirror less its hole, the model is the 8.22 m Gregorian pupil with its 0.911 m obstruction; the page's source line says so. Plate checks for pfb/pfr are circular. The LBC pixel-scale info lines (1.4%, 1.2%) are explained as pincushion.

### Visual check

Shots T2_lbt_lbti_3d.png and T2_lbt_bgf_3d.png: two copies of the Gregorian layout 14.4 m apart with the bent focus on the baseline side; the LBTI pupil shows two discs with wedges. Consistent with the notes; strut direction unverified.

### Summary (LBT)

(a) No confirmed numeric errors.
(b) Unsupported: strut direction; prime-focus obstruction (hole only); f1 and the 8.417 m parent focal length (derived); LBTI 340 m and 0.61 "/mm (derived).
(c) LBTO: the strut geometry in the pupil; the LBC body shadow; whether SX is left from the sky.
(d) New sources: none.

---

## Blanco 4 m (blanco)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| R 21311.6 mm, conic -1.09763, 4022.9 mm, hole 1317.8 mm, used aperture 3934 mm | | NOIRLab Basic Optical Parameters: "Radius of curvature 21311.6 mm concave; Conic constant -1.09763; Mirror diameter 4022.9 mm; Central hole diam 1317.8 mm; Used clear aperture diam 3934 mm (August 00 after installation of seal ...)" | OK |
| obscuration 1651 mm, area 10.014 m2 | eps 0.4197 | same: "Central obscuration diam 1651 mm (PF cage baffle for f/8 M2); Light-collecting area 10.014 m^2" | OK; pi/4 (3.934^2 - 1.651^2) = 10.014, the cage alone |
| fins 68 mm (one 135 mm), housing to 1.01 m | pupil | Piff pupil image and optical model (strut 0.0666 m, "tuned to match DECam big donut images"); batoid DECam yaml (strut 0.019 m) | third-party models that conflict |
| DECam F 2.9833, plate 17.575 | | Flaugher 2015 2.2: "The effective focal ratio is f/3.0. The pixel scale is 56.88 um per arcsecond at the center of the focal plane and 57.12 um per arcsecond at the edge"; 17.575 "/mm is the pipeline plateScale | OK |
| DECam field | 2.2 deg | NOIRLab DECam page: "3 square degree (2.2 degree field of view)" | OK |
| Mosaic II plate | 18.0 "/mm | NOIRLab foci page: "Prime Focus f/2.87. Plate scale = 18.0 arcsec/mm" | OK |
| f/8 secondary | 1295.4 mm, 7494.25 mm, conic -5.2625, 6.56 "/mm | NOIRLab BOP and foci page | OK |
| f/14.5, f/30 secondaries | | BOP: "F/14.5 secondary: Retired! ... 8.6212e03 mm ... 4.9865e03 ... -3.044206"; "F/30 secondary: Retired! ... 9.6871e03 ... 2.1153e03 ... -2.8056" | OK; focal lengths DERIVED |
| "Cer-Vit"; "commissioned in 1974, a near twin of the Mayall" | | Flaugher 2015 Table 1 "M1 -21311.600 Cer-Vit"; NOIRLab page (research quote) | OK |

### Inferred, derived and not-found values

- DECam-era fins and housing come only from third-party codes. Piff's 67 mm fins give 0.41 m2 (4.4% of the pupil); batoid's 19 mm would give 0.11 m2. The pupilNote names Piff.
- The f/8 Cassegrain pupil carries the same housing and fins ("assumed ... not published"). The BOP says the 1651 mm cage baffle is for the f/8 M2, which supports the cage; no source says DECam stays mounted during COSMOS runs. UNSUPPORTED, disclosed.
- Mosaic II: `blocks: []` removes the housing, but eps stays 0.4197 and the DECam fins remain; the pre-DECam cage is not described in any saved source, and the fieldNote says only "Drawn without the DECam filter-changer housing". UNSUPPORTED, not disclosed beyond that.
- DECam corrector drawn as one thin lens placed so the focus lands 125 mm past the primary's focus; schematic, disclosed.

### Scored checks

Area info: the page's strip prints the model's 9.31 m2; NOIRLab's 10.014 m2 is the cage alone. The note explains the difference. Plate checks pass; pf is circular.

### Visual check

DECam 3D: the camera cylinder above the primary. f/8 2D: a long Cassegrain with a 1.295 m secondary ("obstruction e 0.42"). Pupil: cage disk with two lobes (housing) and four fins at 45 deg, as described.

### Summary (Blanco)

(a) No confirmed numeric errors.
(b) Unsupported: housing and fins at f/8 and Mosaic II; the 1.65 m cage for Mosaic II; fin width (Piff 67 mm vs batoid 19 mm).
(c) CTIO/DECam team: fin and housing dimensions; whether DECam stays in the cage at f/8.
(d) New sources: none.

---

## Sloan 2.5 m (sdss)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| R 11.25 m, conic -1.285, hole 1.17 m | | APO prescription page, Gunn 2006 (research quotes) | OK |
| stop 2.517 m | D | research: "R1258.585 mm in the Zemax ray trace; '2.52 m' in G06" | OK |
| f/2.25 on nominal 2.5 m | nominalD | 5.6249/2.5 = 2.2500 | OK |
| secondary 1.08 m, 3.645 m in front | | APO optics page (research quote) | OK |
| eps 0.5103 | | baffle tip diameter 1.2846 m (measured 1285.7 mm), 26.0% of the area: (0.6423/1.2585)^2 = 0.260 | DERIVED-OK |
| 28.6% in all, cone 2.6% | | APO baffle page: "The total obstruction, not including vanes that support the secondary, conical baffle and the central disk ..., is 28.6% on-axis and 31.8% at the field edge"; Gunn 2006 4.4.3 same | OK |
| area 3.553 | info | pi/4 x 2.517^2 x 0.714 = 3.553 | DERIVED-OK; the model gives 3.680 because the cone is not drawn |
| vanes | none drawn | Gunn 2006 3.2: "With adequate tension in the secondary vanes (see Figure 13) ... The square secondary frame is efficient at resisting this tension"; APO baffle page: "Vanes. Tension elements support the secondary assembly ... These are not modeled."; Infante-Sainz 2020: diffraction spikes "visible in individual images of stars" with "random orientation" | the note is accurate; real images have spikes |
| fps F 4.9561, plate 16.534 | | coordio defaults and Kollmeier 2026: 217.7358 mm/deg = 60.48 um/arcsec | OK |
| plug plates F 4.954; imaging 4.9376 (12.43 m) | | design files | DERIVED, disclosed |
| first light May 1998 | | Gunn 2006: "The telescope had first light in May 1998" | OK |
| "2.52 m stop masks the turned edge" | | research quote; "turned edge" is not in the text I searched | research quote, not re-read |

### Inferred, derived and not-found values

- Vanes: the tension-rod vanes along the diagonals of the square frame have no count, width or angle in the saved sources. The pupil is an annulus with no spider and the diffraction image has no spikes, where real SDSS images do. Drawing none is the honest choice; four diagonal vanes could be added once a width is sourced (Gunn 2006 Figs. 12-13 or APO drawings).
- The cone's 2.6% is not in the pupil: the strip's area (3.68 m2) is 3.6% above the sourced 3.553. A ring block of 0.129 m2 would fix it.

### Scored checks

Area is info (3.58%) for the stated reason. Plate checks pass and are circular for all three foci.

### Visual check

3D: annular pupil, secondary on a short stack, no cone. Consistent with the notes.

### Summary (SDSS)

(a) No confirmed errors. The strip's collecting area (3.68 m2) is 3.6% above the sourced 3.553 because the cone is not drawn.
(b) Unsupported: none beyond the disclosed absence of vanes.
(c) APO: number, width and angles of the secondary tension vanes; the cone cross-section.
(d) New sources: none.

---

## Mayall 4 m (mayall)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| D 3.797 m, inner mask 1.346 m | | KPNO Mayall parameters (research quote) | OK |
| Dmirror 4.0116, R 21.318 m, conic -1.09763, hole 1.324 m | | KPNO page, M24 (research quotes) | OK |
| DESI F 3.666, plate 14.819, 3.2 deg, 812 mm surface | | DESI documents (research quotes); f = 206265/14.819 = 13.920 m; 13.920/3.797 = 3.666 | OK, DERIVED |
| DESI eps 0.4741 | 1.8/3.797 | KPNO/DESI (research quote) | OK |
| vanes: four sets of three, 19 mm, 11.5 deg from the diagonal | | M24 3.7.1: "The insertion was displaced 11.5degrees from the 45degree line with pairs of vanes moving in opposite directions" | OK |
| rays from (+/-0.7505, +/-0.4967) at 51.25 deg | | hypot = 0.900 m (on the 1.8 m cage); atan(0.4967/0.7505) = 33.5 deg = 45 - 11.5 | attachment OK; ray angle 51.25 deg is a FIGURE READ-OFF |
| vane width 0.03 m | | desimodel `support_width: 0.03 m`; the vanes are 19 mm thick | disclosed |
| area 8.658 m2 | scored | KPNO/DESI Collaboration 2022; the model reproduces it to 0.00% | OK |
| pre-DESI 9.182 m2 | | pi/4 (3.797^2 - 1.651^2) | DERIVED-OK |
| Mosaic F 3.1166, 17.43 "/mm, 36' | | KPNO Mosaic (research quote) | OK |
| f/7.8 RC: 1.19 m at 7.492 m, conic -5.295; f/15: 0.743 m at 8.6345 m | | KPNO optical model (research quote) | OK |

### Inferred, derived and not-found values

- Pre-DESI foci (mosaic, cass8, cass15) draw the DESI vanes "extended inward" to the 1.651 m cage with eps 0.4348. The old spider (count, width, layout) is NOT FOUND, and the pupilNote says so. Effect: spikes and the 9.05 m2 raster area (vs 9.182 m2 published without vanes) for the historical foci are modeled.
- Cassegrain fields: NOT FOUND (null).
- The 30 mm vane width reproduces the published 8.658 m2; the check constrains the width but does not validate it independently.

### Scored checks

The only external, configuration-matched check among my telescopes (DESI top end against 8.658 m2), with the width caveat above. Plate checks pass; pf and mosaic are circular.

### Visual check

DESI 3D: the prime-focus cage with short vanes; cass15 2D: a long Cassegrain with a 0.743 m secondary. Four vane shadows at about 51 deg in the pupil. Consistent.

### Summary (Mayall)

(a) No confirmed errors.
(b) Unsupported: the pre-DESI spider; the 30 mm vane width (fitted to the published area).
(c) KPNO: the pre-DESI spider and the Cassegrain fields.
(d) New sources: none.

---

## Rubin (Simonyi) 8.4 m (rubin)

### Values checked

| field | preset | source | verdict |
|---|---|---|---|
| M1 annulus 8.36 m outside, 5.12 m inside | eps 0.612 | Rubin optical design page: "an outer clear aperture of 8.36 m and an inner diameter of 5.12 m, giving an effective collecting area of a 6.67 m filled aperture" | OK; 5.116/8.36 = 0.612 |
| M1 R 19.835 m, f1 9.9175 m | | batoid LSST yaml; no observatory document | DERIVED from a third-party model |
| M2 3.4 m, 1.8 m opening; M3 5.0 m; M3 vertex 0.234 m behind M1's | | Rubin page: "The 1.8 m diameter hole in the secondary mirror holds the camera body"; batoid | OK |
| system length | | Rubin page: "6.4 m from the vertex of the secondary mirror to the vertex of the tertiary mirror" (6.156 + 0.234 = 6.39) | OK |
| F 1.2333, plate 20.0059, field 3.5 deg | | Rubin key numbers: "Final f-ratio: f/1.233", "Field of View (FOV): 3.5 deg (9.6 deg2)"; plate scale from obs_lsst | OK |
| vanes | pupilNote: "eight 50 mm vanes in four parallel pairs 0.8 m apart" | imSim diffraction.py RUBIN_SPIDER_GEOMETRY: four `thick_lines`, normals (+/-1/sqrt2, 1/sqrt2), d = -0.4, -0.4, +0.4, +0.4, thickness 0.025; dist_thick_line = abs(abs(n.p - d) - thickness), so each line is one bar 0.05 m wide at 0.4 m from the center | geometry in the preset is right (n.p0 = -0.4 for x0 = y0 = -0.28284); the note's "eight vanes" is wrong: there are four bars in two parallel pairs 0.8 m apart; "eight" counts where they cross the annulus (4 bars x 3.268 m chord x 0.05 m = 0.654 m2, which I reproduced) |
| circles 2.558 m and 4.18 m | | imSim | OK |
| vane area 0.654 vs "~0.7 m2" | | Krabbendam 2006: "8x50mm thick structural vanes"; Science Book | OK |
| area 33.68 | info | Rubin: effective aperture 6.67 m filled (34.9 m2); key numbers "Mean effective aperture: 6.49 m (area weighted over FOV)" (33.1 m2); Science Book 35 m2 | OK; the published numbers bracket the model |
| M3 hole 1.06 m | | research quote from a 2006 drawing; Rubin page: "The hole in the tertiary mirror is used to mount equipment for maintaining precise control of ... optical alignment" | OK (size not re-read) |
| L1 1.55 m | | Rubin page: "The largest lens (L1) is 1.55 m in diameter" | OK |
| spikes rotate | pupilNote | Rubin spikes page: "Because Rubin's camera rotates between one exposure and the next, the pattern rotates relative to the sky" | OK |

### Inferred, derived and not-found values

- M1 radius, conic and mirror positions come from batoid, not an observatory document.
- The layout is a schematic Paul-Baker: validate_img.js shows f2 6.1% and f3 2.0% off the real mirrors; the fieldNote discloses the M3 vertex drawn 0.17 m in front of M1's (real: 0.23 m behind) and the focal plane at 5.23 m (real 4.43 m). This is the largest layout departure among my telescopes.
- M2 baffle diameter: NOT FOUND. The pupil is unaffected if the baffle shadow stays within 5.12 m.
- Pupil orientation: NOT FOUND (the camera rotates).

### Scored checks

Area is info (33.68 vs Science Book 35 m2, -3.8%). The Paul-Baker check passes at a loose 10% tolerance (6.1%, 2.0%). The plate check is circular (f = 10.310 m comes from the plate scale).

### Visual check

3D: the M1 annulus with the concave tertiary in its center, the secondary with four long bars above it, the camera at the focus. Consistent with the pupil.

### Summary (Rubin)

(a) One confirmed text defect (low severity): "eight 50 mm vanes in four parallel pairs" should read "four 50 mm bars, in two parallel pairs 0.8 m apart, which cross the annulus in eight segments (0.65 m2)". Source: imSim thick_lines. Effect: text only; the pupil is correct.
(b) Unsupported: M1 radius and mirror positions (batoid only); the schematic Paul-Baker layout (disclosed).
(c) Rubin: as-built M1 radius, M2 baffle diameter, spider geometry (Krabbendam's "8x50 mm" vs imSim's four bars).
(d) New sources: none.

---

## Summary (all eleven)

### (a) Confirmed errors, ranked by severity

No numeric value in the eleven presets is contradicted by a saved source. The defects below are text and presentation, ranked.

1. Rubin pupilNote: "eight 50 mm vanes in four parallel pairs" misdescribes the four bars of imSim's geometry. Fix: the wording above. Effect: text only.
2. Blanco and Mayall historical foci reuse a later top end: Blanco Mosaic II keeps eps 0.4197 and the DECam fins, and the fieldNote does not say so; Blanco f/8 and Mayall pre-DESI foci disclose the assumption. No source describes the older structures. Effect: area and spikes for those foci are modeled.
3. VISTA: eps 0.4405 (the 1.63 m VIRCAM-era baffle) is presented for the 4MOST focus; Haynes 2014 Sec. 2.3 says the baffles were modified. Effect: the current focus's obstruction may be smaller.
4. SDSS: the strip's collecting area (3.68 m2) is 3.6% above the sourced 3.553 because the cone's 2.6% is not drawn. Fix: add a ring block (0.129 m2) or note the exclusion. Effect: area readout.
5. TMT: the scored 633.5 m2 rests on a two-digit source ("28.4-meter"), so the 0.01% agreement is chance within a 0.7% window. Effect: label only.

### (b) Unsupported or misleading claims

- VISTA: spider angles +/-60 deg; 4MOST focus position and baffle.
- MMT: vane width 0.12 m (papers say 0.1 m and 50 mm); the same vanes at all foci; f/5 baffles absent.
- Oschin: plate-era vane width and holder; the camera border (fitted); the single vane's direction.
- Gemini: vane geometry read off an image; the 1.12 m retracted baffle (not re-verified).
- Hale: Cassegrain field 12.6'; coude secondary placement; Bowen quotes not re-read.
- TMT: leg width (a maximum) and angles (figure read-off).
- LBT: strut direction; prime-focus obstruction (hole only); derived f1 and LBTI values.
- Blanco: housing and fins at f/8 and Mosaic II; fin width (67 mm vs 19 mm in two models).
- SDSS: no secondary vanes drawn (their number and width are not published).
- Mayall: the pre-DESI spider; the 30 mm vane width fitted to the published area.
- Rubin: M1 radius and mirror positions from batoid only.
- Cross-cutting: plate-scale checks are circular wherever F came from the plate scale; nine area lines compare the pupil with a number derived from it.

### (c) Open questions only the builders (or observatories) could answer

- VISTA/4MOST: the M2 baffle diameter, spider leg angles, focus position.
- MMTO: spider width and orientation; f/5 cone and f/9 hub diameters.
- ZTF/Palomar: the cryostat cross-section in the beam; the single vane's direction; the plateholder outline.
- Gemini: spider offset and angles.
- Palomar: the Cassegrain unvignetted field.
- TIO: as-designed leg width; the AD41 obscuration pattern.
- LBTO: strut geometry in the pupil; the LBC body shadow; whether SX is left from the sky.
- CTIO/DECam: fin and housing dimensions; whether DECam stays in the cage at f/8.
- APO: secondary tension-vane count, width and angle; the cone cross-section.
- KPNO: the pre-DESI spider.
- Rubin: as-built M1 radius, M2 baffle diameter, spider geometry.

### (d) New sources saved

None. Every question was settled from, or shown open by, files already under rawdata/telescopes/<id>/. Working extractions are in scratchpad/audit/T2_txt/<id>/, rendered figures (Winkler 2026 Fig. 4, Megacam Fig. 10, Spalding 2018 Fig. 2) in scratchpad/audit/T2_img/, and screenshots in scratchpad/audit/shots/T2_*.png.
