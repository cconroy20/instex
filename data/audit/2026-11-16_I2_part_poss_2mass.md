# Audit part: poss1, poss2, twomass (web/ipresets.js lines 244-272)

Scope: the three "previous generation" presets only. Research records data/imaging/poss.md (+ .json) and
data/imaging/twomass.md (+ .json); sources under rawdata/imaging/poss/, rawdata/imaging/2mass/ and the ZTF paper
rawdata/imaging/ztf/Dekany2020_... (key D20). Source keys follow the research records (H52 Harrington 1952, A58 Abell
1958, R91 Reid+91, L90 Lasker+90, L08 Lasker+08, LP93, HE/HF = DSS FITS headers; S06 Skrutskie+06, ES-* = 2MASS
Explanatory Supplement pages, GM20 Garcia-Mejia+20, M96 Milligan+96 abstract).

How checked: I re-ran tesseract OCR (300 dpi) on H52, R91, A58 and L90 pages and grepped pdftotext of S06, L08 and D20,
and read the DSS FITS header cards with `python3 -I`. Model numbers come from IM.design on each preset's state and on
variants (script: scratchpad/audit/poss2m.js). `node validate_img.js`: all poss1/poss2/twomass lines pass (369 pass, 0
fail). No project file was edited. No headless screenshot was taken.

---

## poss1: Palomar 48-inch / POSS-I plates (red, E)

### 1. Values verified

| state / note item | value | source and location (verbatim) | verdict |
|---|---|---|---|
| D | 1.2573 m | H52 p. 278 (OCR, PDF p. 4): "The clear aperture in the camera is 49.5 inches (125.73 cm), giving a focal ratio of {/2.44." | matches H52 (but see conflict below) |
| F | 2.4417 | H52 p. 278: "The plate scale is 1 mm = 677187." (= 67".187/mm); 206264.8 / 67.187 / 1257.3 = 2.4417 (DERIVED) | arithmetic correct; model plate 67.188"/mm |
| tel | schmidt, stop at the corrector | D20 Sec. 3.1: "an aperture stop located at the center of curvature of this mirror (6124 mm away), and a singlet aspheric (nominally zero power) corrector plate in the plane of the stop (diameter 1244 mm)" | supported |
| plateMM | 355.6 mm | H52 p. 278: "either 14-inch (35.56 cm) or 10-inch (25.4 cm) square glass photographic plates 0.040 inch (1 mm) in thickness" | supported (DSS header PLTSIZEX = 355.000) |
| scan | 25.2845 um | HE header: "XPIXELSZ= 25.2845 /Scan: Pixel Size microns" | supported |
| depth | 20 | A58 Sec. II a: "the limiting photored magnitude for the red plates is 20.0" | supported |
| band | R (pivot 0.6498 um) | A58 Sec. II a: "wave-length range of \ 6200 (filter cut off) to \ 6700, with an effective wave length near \ 6500" | adequate (diffraction only) |
| field | 570' (whole plate; diagonal 563') | note explains; H52 "greatest loss due to vignetting at the corners of the plate is 0. 1 magnitude"; A58 "less than 0.2 mag" | supported |
| "1949-1958" | | RD93 pp. 125-126 (first plate Nov 1949, last 10 Dec 1958); LD73 "From 1949 to 1958" | supported |
| "bent to the Schmidt's curved focal surface" | | H52 p. 278: "Since the focal plane is spherical the plates must be bent to the proper spherical radius while being exposed." | supported |
| "103a-E emulsion behind a red Plexiglas filter (6200-6700 A), 40-60 minutes, to about 20.0 mag" | | A58 Sec. II a (PDF p. 2, OCR re-checked): "from 40 to 60 minutes for the red"; R91 p. 662: "red plexiglass 2444 filter" | supported |
| "80 lines per mm" | | R91 p. 662: "with a resolution of 80 lines mm-1, but with high contrast" | supported (the conversion is not, see 2) |
| "unvignetted to 5.4 deg; the corners lose 0.1-0.2 mag" | | A58: "The non-vignetted field is 5°4 in diameter ... less than 0.2 mag"; H52: "0. 1 magnitude" | supported |
| "DSS-1 ... 25.3 um steps (1.7")" | | HE header XPIXELSZ 25.2845; CD1_1 = -0.0004722193 deg = 1.700" | supported (model 1.6988") |

Model check: f_eff 3069.9 mm, plate 67.188"/mm, scan 1.6988"/px, field 6.629 deg, area 43.90 deg2, collecting area
1.114 m2, emulsion spread 0.840", star FWHM 1.31" (19.5 um) at 1" seeing.

### 2. Errors found

**E1 (moderate). The emulsion spread, 12.5 um (0.84"), contradicts the one source that states the 103a emulsion's own
image limit.** The note says "the emulsion's resolving power (80 lines per mm) is taken as a spread of 12.5 um (one line
pair, derived)". The arithmetic (1/80 mm) is derived; treating a resolving-power period as the FWHM of the emulsion's
spread is an assumption that no source makes (INFERRED, not DERIVED). The saved sources give the emulsion-limited image
size directly:
- A58 Sec. II a (ApJS 3, 212; OCR re-checked): "The smallest stellar images have a diameter of about 30 µ, about the
  limit of resolution of the Eastman 103a emulsions used".
- KR77 Table I: the faintest tabulated images on the Atlas prints are 30 um ("30u 21.1 20.5").
- poss.md itself records "smallest_star_image 30 um (2.0")" as the emulsion fineness and says the grain size is NOT
  PUBLISHED; the 12.5 um value appears only in ipresets.js.
With 12.5 um the model's smallest possible image (seeing to zero) is 12.6 um, less than half the published limit.
Fix: grain 30 (INFERRED: A58's minimum image diameter taken as the emulsion-limited FWHM), and say so in the note; or
keep 12.5 and call it an assumption. Effect of 30 um: emulsion spread 0.84" to 2.02"; star FWHM at 1" seeing 1.31"
(19.5 um) to 2.25" (33.5 um); at 2" seeing 2.17" to 2.84". The DSS-1 "undersampled" flag stays on, which agrees with
L90 (PDF p. 7, OCR): "The adopted sample interval is 25 µm. This is slightly too coarse to extract all available
information from the plates, which have image sizes as small as 40 µm (visual full width)".

**E2 (low-moderate). The scored check "6.6 deg x 6.6 deg per plate" is circular.** fieldX = 2 atan(177.8 mm / f_eff),
with the plate size an input and f_eff set from the plate scale (already flagged circular). H52 computed its 6.6 deg from
the same two numbers ("The 14 14 inch plate, 6°6 X 6°6, covers 43.56 square degrees. The plate scale is 1 mm = 67".187").
By the file's own header convention ("info: true marks a line ... circular") it should be info. It passes only because
6.6 is a rounding of 6.637.

**E3 (low). The scan's pixel count shown is not DSS-1's.** imager.js sets Nx = Ny = round(plateMM / scan) = 14,064, so
the page reports a 14,064 x 14,064 scan (197.8 Mpix). Published: 14,000 x 14,000 (SDG "14000 x 14000 or 23040 x 23040";
L90 Table IV "Image size 14000 x 14000 pixels"; HE header XPIXELS = 14000, YPIXELS = 13999), i.e. 354.0 mm of the plate.
Effect: +0.5% in pixels per side, +0.9% in total. Fix: a scan-format input (scanPx) or a note.

### 3. Unsupported or misleading note text

- "the Digitized Sky Survey (DSS-1) later scanned these plates": DSS-1 scanned glass copies. L08 Table 1 note: "Scans
  performed on glass copies of the S, XE and XO plates, rather than on the original plates." Also "scanned at 25 micron
  sampling except 123 plates scanned at 15 micron, mostly south of -18°" (L08 Table 1 note 3). Suggested: "scanned glass
  copies of these plates".
- "(one line pair, derived)": the conversion is an assumption (see E1); "derived" overstates it.
- The note does not say what the model leaves out (the ipresets header asks for it): the singlet corrector's chromatic
  blur in the red (R91 p. 663: "figured to give the minimum chromatic aberration at λ4358 ... the image quality
  deteriorates significantly at near-infrared wavelengths"), the scanning aperture (L90: "filtered through a 50 µm
  smoothly apodized aperture before sampling", documented for the GSC-I scans), and the flat f tan(theta) mapping of a
  plate that was bent to a sphere (model 6.629 deg across vs 355.6 x 67.187 / 3600 = 6.637 deg: -0.12%, negligible).

### 4. DERIVED / INFERRED / NOT FOUND items

| item | status | what I found | best value and effect |
|---|---|---|---|
| eps 0.32 | lower bound (plate's area-equivalent circle, 0.319 DERIVED) | H52 names the "ring girder and blade assembly, which supports the plateholder" with no size; D20 Sec. 4.1: "a four-vane structure was used to support a mechanical screw driven focus hub which held the photographic plates at prime focus"; no width or holder size in any saved source | unsettled; labeled correctly as a lower bound |
| D 1.2573 m | published (H52; restated by R91) | conflicts with D20: the original singlet at the stop had "diameter 1244 mm"; the ZTF preset uses 1.2446 m on the same telescope | unsettled (see open questions). If 1244.6 mm with F 2.4667: plate scale unchanged, collecting area 1.114 to 1.092 m2 (-2.0%) |
| grain 12.5 um | assumption (see E1) | A58 30 um | 30 um (INFERRED) |
| scan 25.2845 um | published (header) | L90 Table IV "25.284 µm", "25.000 µm before 5 March, 1985" | fine |
| plate field mapping | silent assumption (flat, gnomonic) | the plate is bent to R = 3.07 m (R91 Sec. 3.2) | -0.12% in field; negligible |

### 5. Scored checks

| check | config | measurement? | model | verdict |
|---|---|---|---|---|
| plate scale 67.19"/mm (info) | POSS-I | published design value | 67.188 | circular, correctly info |
| 6.6 x 6.6 deg (scored, 1%) | POSS-I | arithmetic of input plate x circular plate scale | 397.76' (+0.44%) | circular: should be info (E2) |
| DSS-1 1.7"/px (info) | DSS-1, E plates | nominal; header WCS 1.700" is a plate solution | 1.6988 (-0.07%) | fine |

### 6. Open questions for the builders

- The plateholder's outer size and the vane width (sets eps; only the lower bound is known).
- The stop diameter in the plate era: 49.5 in (H52, R91) or 1244 mm (D20)?
- What image spread to adopt for 103a emulsions (A58's 30 um minimum image vs the 80 lines/mm period).

---

## poss2: Palomar 48-inch / POSS-II plates (red, F)

### 1. Values verified

| state / note item | value | source and location (verbatim) | verdict |
|---|---|---|---|
| D, F | 1.2573 m, 2.4417 | R91 p. 663 (OCR re-checked): "The correcting plate has a clear aperture of 49.5 inches and the effective focal length of the system is 121 inches, giving a focal ratio of f/2.44 and a plate scale of 67".19 per millimeter." | matches R91 (R91 restates H52; see D conflict) |
| plateMM | 355.6 | R91 p. 663: "Although the 14 x 14 inch plates cover 6°6 x 6°6 on the sky, the unvignetted field is of only 5°4 diameter." | supported |
| scan | 15 um | LP93: "we adopted a 15 µm sampling interval"; HF header XPIXELSZ = 15.0295, YPIXELSZ = 15.0000 | supported |
| depth | 20.8 | R91 Sec. 5: "R_F(lim) = 20.8 mag"; L96, D98, GST agree (RD93 says 21.5) | supported |
| "(1985-2002)" | | corrector "installed in the telescope in 1985" (R91 p. 663); GSP plate dates 1985-09-17 to 2002-03-07 (DERIVED tallies in poss.md); L08 "1987-00 / 1987-99 / 1989-02" | supported |
| "images under 0.5" over 6.5 deg from 3900 to 9000 A" | | R91 p. 663: "The resultant image size is better than 0".5 for in-focus point sources over the full 6.5 x 6.5 degree field for 3900 ≤ λ ≤ 9000A" | supported |
| "plateholders reground to the focal surface" | | R91 p. 664: "All of the mandrels have been reground to the correct radius of curvature ... The refigured plateholders deviate by no more than ~15 µm" | supported (mandrels) |
| "IIIa-F emulsion behind an RG610 filter, 70-90 minutes, to about 20.8 mag" | | R91 p. 662: "red (IIIa-F and RG610, λ ~ 6500 A)"; R91 p. 666: "70-90 minutes for the F plates" (R91 p. 664 says "60-70 minutes J,F") | supported (internal R91 conflict on exposure) |
| "250 lines per mm" | | R91 p. 662: "three times the resolving power, at 250 lines mm-1" | supported (the conversion is not) |
| "DSS-2 scanned these plates in 15 um steps (1.0")" | | HF header SURVEY = 'POSSII-F', 15.0295 x 15.0 um, 23040 x 23040; D98: "the original plates are scanned, rather than second copies"; L08 Table 1 note: originals for POSS-II (copies only for S, XE, XO) | supported |

Model check: scan 1.0078"/px, Nx 23,707, emulsion spread 0.269", star FWHM 1.04" (15.5 um) at 1" seeing, 0.85" at the
reader's default 0.8" seeing (sampling 0.84 scan px: the "undersampled" flag fires).

### 2. Errors found

**E4 (moderate). The 4 um spread (0.27") has no source, and it makes the page say the DSS-2 scan undersamples the
image, which the scan's designers say it does not.** As for POSS-I, "taken as a spread of 4 um (derived)" equates the
250 lines/mm period with a FWHM. No saved source gives an IIIa-F spread. What the sources do give: R91 p. 666 rejects
plates "if the images exceed 40 microns (3 arc seconds) in size"; L90 says Schmidt survey plates "have image sizes as
small as 40 µm (visual full width)"; L08 Sec. 3.1 says the DSS-2 scanner spot "imaged on the plate as a 42 µm Gaussian
spot. This size gives low aliasing with the adopted 15 µm sampling." With 4 um and seeing below about 2", the model
flags "the scan undersamples the image" for every DSS-2 view (sampling 0.84 px at 0.8", 1.03 px at 1"), contradicting
L08. Fix: label the 4 um as an assumption; a less arbitrary choice is A58's 30 um scaled by R91's "three times the
resolving power", about 10 um (INFERRED); and either model the scanning spot or say in the note that the DSS-2 images
include a 42 um scanning spot the model leaves out. Effect of 10 um: emulsion spread 0.27" to 0.67"; star FWHM at 1"
seeing 1.04" to 1.21".

**E5 (low-moderate). Both scored checks are circular or nominal.**
- "6.6 x 6.6 deg per plate" (fieldX, 1%): same circularity as E2.
- "DSS-2 scan 1.0"/px" (pixScale, 1%): the model's 1.0078" is 15 um (input) x 67.19"/mm (the circular plate scale);
  "1.0" is the nominal figure ("about 1.0 arcseconds per pixel", SDH). It passes at +0.78% only because the tolerance is
  1%. The measured value is the plate solution in the HF header: CD1_1 = -0.0002798093 deg = 1.0073", CD2_2 =
  0.0002791901 deg = 1.0051" (model +0.05% and +0.27%). Score against 1.007" or mark info.

**E6 (low). Scan pixel count.** The page shows a 23,707 x 23,707 scan (562 Mpix); DSS-2 plates are 23,040 x 23,040
(530.8 Mpix: LP93 "each plate consists of an image 23040² in size"; HF header XPIXELS = YPIXELS = 23040), covering
345.6 mm of the 355.6 mm plate. Effect: +2.9% per side, +5.9% in pixels.

### 3. Unsupported or misleading note text

- "(derived)" for the 4 um spread: an assumption (E4).
- The note omits the scanning spot (42 um Gaussian, L08), which dominates the fineness of DSS-2 images at good seeing,
  and the corrector's in-focus circle of confusion (R91 p. 663: "only 0".34 in diameter").
- "The obstruction is a lower bound (the plate's size)": fine, but in POSS-II the filter sits in the plateholder
  (R91 p. 664: "the plateholders currently in use with the survey have the filters installed directly"), so the holder
  is at least the filter's size; still unpublished.

### 4. DERIVED / INFERRED / NOT FOUND items

Same as poss1 for eps, D and the flat-plate mapping. Additional:
- D 1.2573 for POSS-II: R91 p. 663 restates H52's numbers in a paragraph that begins from Harrington ("Harrington 1952
  has described the optical and mechanical characteristics of the telescope in its original incarnation"); no
  independent measurement of the doublet's clear aperture is in the saved sources (poss.md NOT FOUND: "Diameter and
  thickness of the 1985 achromatic doublet"). D20 Table 1 gives "Entrance pupil diameter 1244.6 mm" (ZTF era, with the
  trim plate). Unsettled.
- Cross-mode note (outside my scope, one line): web/tpresets.js labels the same focus "POSS-II plates, 1985-2000",
  while ipresets says 1985-2002 (the N plates ran to 2002, L08 "1989-02").

### 5. Scored checks

| check | config | measurement? | model | verdict |
|---|---|---|---|---|
| plate scale 67.19"/mm (info) | POSS-II | published | 67.188 | circular, correctly info |
| 6.6 x 6.6 deg (scored) | POSS-II | arithmetic | +0.45% | circular: info (E5) |
| DSS-2 1.0"/px (scored) | DSS-2, F plates | nominal; header WCS 1.0073"/1.0051" is a plate solution | 1.0078 (+0.78%) | arithmetic; score against the header or info (E5) |

### 6. Open questions for the builders

- Clear aperture of the 1985 doublet as mounted (49.5 in or D20's 1244.6 mm).
- The plateholder-with-filter outline and vane width.
- An image spread for IIIa-F appropriate for the "Image size" readout.

---

## twomass: 2MASS / camera (one of three bands)

### 1. Values verified

| state / note item | value | source and location (verbatim) | verdict |
|---|---|---|---|
| D | 1.3 m | S06 Sec. 2.3 p. 1166: "2MASS used two custom 1.3 m equatorial telescopes."; ES-III.1a: "Primary Mirror: 1300 mm diameter, radius of curvature 5200 mm, conic constant -1.000" | supported (GM20 clear aperture 1280 mm) |
| eps | 0.178 | ES-III.1a: "Secondary Mirror: 232 mm diameter, radius of curvature 965.7 mm, conic constant -1.847" (232/1300 DERIVED) | secondary only (see 3) |
| F | 13.26 | S06 p. 1166: "Cassegrain plate scale of 11".97 mm-1" (206264.8 / 11.97 / 1300 = 13.255 DERIVED) | model plate 11.966"/mm |
| F1 | 2.0 | R1 = 5200 mm / 2 / 1300 (DERIVED) | supported |
| back | 0.405 | GM20 Sec. 2.1: "at the native focal plane, located 527 mm behind the primary vertex" (northern telescope as refurbished for Tierras) | drawing only |
| Independent check | | the model's secondary comes out at f2 = -482.5 mm, R2 = 965.1 mm vs the published 965.7 mm (-0.06%) | confirms F = 13.26 with F1 2.0 and back 0.405; F = 13.5 would need R2 = 947 mm (-1.9%) at the same back focus, or a 588 mm back focus with R2 = 965.7 (DERIVED, paraxial) |
| Fc | 3.188 | S06 p. 1165: "The average plate scale for all six arrays (three northern and three southern) was 1".991 pixel-1"; 40 um x 206264.8 / 1.991 / 1300 = 3.188 (DERIVED) | arithmetic correct; model 1.9908"/px |
| Nx, Ny, pix | 256, 256, 40 um | S06 p. 1164: "three NICMOS3 256 x 256 HgCdTe arrays ... These arrays have 40 µm pixel pitch" | supported |
| "two 1.3 m classical Cassegrain telescopes (Mt. Hopkins and CTIO)" | | S06 p. 1166: "the primary mirror ... is parabolic with a radius of curvature of 5200 mm. The secondary conic constant is -1.847"; ES-III.1a: "two identical 1.3-meter aperture, open-tube, equatorial fork-mount telescopes" | supported ("classical" follows from the conics) |
| "splits the beam with dichroics onto three 256 x 256 HgCdTe arrays (J, H and Ks at once)" | | S06 Fig. 1 caption: "Two dichroic mirrors immediately follow this common lens to split the light between the three bandpasses" | supported |
| "reimaged through a cold Lyot stop" | | S06 p. 1165: "form pupil images at three Lyot stops adjacent to the band-limiting interference filters. The stop diameter is 90% of the pupil diameter" | supported (but see E7) |
| "each 1.3 s exposure", "imaged six times", "resampled to 1" pixels" | | S06 Table 1 "6 x 1.3 s per frame = 7.8 s total"; ES-IV.3 "(512x1024 pixel, 1'' per pixel) Atlas Images" | supported |
| "10 sigma: J 15.8, H 15.1, Ks 14.3 required" | | ES-VI.1: "10-σ at 15.8, 15.1, 14.3 mag at J, H, K s respectively for \|b\|>10°" (Level 1 specification) | supported |

Model: f_tel 17,238 mm, collimator 397.8 mm, camera 95.6 mm, reduction 0.2404, field 8.494', collecting area 1.285 m2,
etendue 0.0258 m2 deg2, star FWHM 1.06" at 1" seeing (0.53 px, flagged undersampled; consistent with S06's 2" pixels).

### 2. Errors found

**E7 (moderate). The cold Lyot stop passes only 90% of the pupil diameter; the model and the note ignore it.** S06
p. 1165: "The stop diameter is 90% of the pupil diameter". With the primary as the pupil, the beam that reaches the
arrays comes from the central 1.17 m (DERIVED). Consequences in the page:
- collecting area 1.285 m2 vs 1.033 m2 with the stop (-20%, assuming the stop does not also mask the center, which is
  NOT FOUND); etendue 0.0258 vs 0.0207 m2 deg2;
- the reimager's "Effective focal ratio f/3.19" vs the published design "The final F/3.5 optical design" (M96 abstract),
  which matches the stopped beam (4144 mm / 1170 mm = 3.54, DERIVED). The page shows the camera focal ratio 9% too fast.
Fix: either adopt the research record's preset_alt_coldstop (D 1.17, eps 0.198, F 14.73, Fc 3.542; same pixel scale
and field, but the drawn telescope becomes 1.17 m), or keep D = 1.3 m and add to the note that the Lyot stops pass the
central 90% of the pupil, so the light-collecting area is about 20% smaller than shown and the beam at the arrays is
F/3.5 as designed.

**E8 (low). The scored "field 8.5' x 8.5'" is circular.** fieldX = 256 x the pixel scale, and F_cam was derived from
the same S06 pixel scale (the 1.991" line is itself flagged circular). Should be info. The "65,536 px per band" check is
arithmetic on the input format (it says so).

### 3. Unsupported or misleading note text

- "the secondary tilted back to hold each 1.3 s exposure still": inverted. S06 p. 1167: "During a 1.3 s exposure the
  secondary mirror tilted smoothly to freeze the 8'.5 x 8'.5 field of view ... At the end of a 1.3 s exposure the
  secondary rapidly tilted back to its start position, while the camera electronics read out and reset the arrays."
  ES-III.2a: "the telescope's secondary mirror tilted opposite the scan direction". Suggested: "the secondary tilted
  against the scan to hold each 1.3 s exposure still, then flew back".
- "(the usual f/13.5 is a rounded label)": unsupported; 13.26 does not round to 13.5. Supported statement: S06 gives
  f/13.5 and 11.97"/mm in one sentence, and they differ by 1.8%; the plate scale (and GM20's 11.94"/mm) and the
  published mirror prescription at GM20's 527 mm back focus agree with f/13.26 (see the R2 check above).
- "(only the reduction, 0.24)": presented as published; it is DERIVED (4144 / 17,232 = 0.2405 from the two published
  plate scales).
- eps is not mentioned: 0.178 is the secondary mirror alone, a lower bound (the secondary's cell and the freeze-frame
  tilt mechanism are not published; GM20 Sec. 6.1 says the telescope had no baffles during 2MASS).
- "The display opens at 15.5 mag, near the survey's limits": for the Ks band drawn, 15.5 is 1.2 mag beyond the Ks
  requirement (14.3) and 0.7 mag beyond the mean achieved 10-sigma limit (ES-VI.2 Table 2: Ks mean 14.808). The drawn
  sky's magnitudes are illustrative (imgapp.js skyObjects comment), so this is cosmetic.

### 4. DERIVED / INFERRED / NOT FOUND items

| item | status | what I found | best value and effect |
|---|---|---|---|
| F 13.26 | DERIVED from 11.97"/mm | confirmed by the model's secondary radius (965.1 vs 965.7 mm) | keep |
| Fc 3.188 | DERIVED from the six-array mean 1.991" | the Ks band is drawn; ES-III.1b Table 2: Ks 1.984 (North), 1.980 (South) | Ks mean 1.982" gives Fc 3.202, field 8.457' (-0.4%); minor |
| W 30 mm | assumption (labeled) | Milligan+96 (the prescription) is behind the SPIE paywall; a web search found no open copy | unsettled; affects only the drawing and the collimator/camera focal lengths shown (397.8 / 95.6 mm) |
| back 0.405 | GM20 (the Tierras-era northern telescope) | the 2MASS camera's own back focus is not published | drawing only |
| eps 0.178 | DERIVED (secondary only) | no cell/tilt-mechanism size | lower bound |
| field 12.1' | chosen to enclose the array | S06 p. 1164: the field stop "is slightly undersized relative to the array images"; ES-III.2b: tile width 504" set by the three arrays' overlap | fine for drawing; the true field is slightly under 8.49' |
| cold stop eps | NOT FOUND whether the Lyot stop masks the center | | 0.198 relative to 1.17 m if not |

### 5. Scored checks

| check | config | measurement? | model | verdict |
|---|---|---|---|---|
| pixel scale 1.991" (info) | mean of six arrays, all bands | measured (astrometric) | 1.9908 | circular, correctly info; Ks-only would be 1.982 |
| field 8.5' (scored, 1%) | one frame | arithmetic of 256 px x circular scale | 8.494' (-0.07%) | circular: info (E8) |
| 65,536 px (scored) | one array | format arithmetic | 65,536 | trivial, labeled as such |

Suggested non-circular check to add: the secondary radius of curvature 965.7 mm (ES-III.1a) against the model's
secondary (965.1 mm, -0.06%), which tests F, F1 and back together.

### 6. Open questions for the builders

- The pupil (Lyot stop) diameter and the collimator and camera focal lengths (Milligan+96).
- Whether the Lyot stop also masks the central obscuration.
- The shadow of the secondary's cell and tilt mechanism.
- The 2MASS camera's back focal distance on the telescope, and why S06 quotes f/13.5 beside 11.97"/mm.

---

## New sources saved

None. Web searches for Kodak 103a / IIIa emulsion MTF or spread-function data (Kodak P-315 and similar) and for an open
copy of Milligan et al. 1996 (the 2MASS camera prescription) found nothing obtainable. Working files (not sources):
scratchpad/audit/ocr/ (tesseract OCR of H52, R91, A58 and L90 pages), scratchpad/audit/s06.txt, l08.txt, d20.txt,
scratchpad/audit/poss2m.js (model variants).
