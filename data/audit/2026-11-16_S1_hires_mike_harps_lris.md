# Audit S1: presets hires, mikered, mikeblue, harps, lris

Auditor scope: web/presets.js entries `hires`, `mikered`, `mikeblue`, `harps`, `lris`; research in data/presets_research.md (HIRES, MIKE, HARPS, LRIS, glass sections) and data/presets_sources.json; sources under rawdata/presets/. No project file was edited. Scratch scripts and renders: /private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/s1/ (run.js, variant.js, mikecmp.js, harps.js with a patched copy physics_mod.js, digitizing scripts, screenshots in shots/).

Conventions: DERIVED = arithmetic from sourced numbers; INFERRED = a reading of a figure or an engineering inference, not stated in a source; "model" = `IX.design(toP(state))` as in validate.js.

Model outputs as shipped (lamC of each preset):

| preset | Reff | Rs | Å/px | ″/px | coverage (Å) | orders |
|---|---|---|---|---|---|---|
| hires | 48,151 | 49,417 | 0.0280 | 0.119 | 3693–8341 | 43–97 |
| mikered | 18,720 | 18,938 | 0.0541 | 0.143 | 5126–11,290 | 30–66 |
| mikeblue | 24,448 | 24,681 | 0.0229 | 0.130 | 3426–5609 | 63–103 |
| harps | 99,820 | 103,889 | 0.0146 | 0.247 | 3872–6844 | 89–158 |
| lris | 1510 | 1530 | 0.812 | 0.135 | 5857–9166 | 1 |

---

## 1. Magellan / MIKE red and blue (`mikered`, `mikeblue`)

### 1.1 Values in `state` and `note` checked against B03, B15, LCOM

Confirmed against the sources: D 6.5 m; f/11 telescope converted to F/3.3 (red) and F/3.6 (blue) (B03 Sec. 2.3, "The conversion from F/11 (telescope output) to F/3.3 and F/3.6"); 150 mm pupil (B03 Sec. 2.2, "Both cameras have a 150 mm diameter pupil"); 500 and 550 mm camera/collimators (B03 Sec. 2.4); red R2 52.6 /mm at 63.5° and blue R2.6 52.7 /mm at 69.0° (B03 Sec. 2.4); PBM2 47° prism and two 38° fused-silica prisms (B03 Sec. 2.4); 2k × 4k 15 µm detectors (B03 Sec. 5; LCOM Basics); external stop 400/600 mm (B03 Sec. 2.2) for the drawing.

Problems:

(a) Central wavelength puts the wrong orders on the chip (both arms). The note says "Central wavelength = middle of the LCO standard setting (the prism angle is not published, so where the orders fall is not either)." The values 6750 and 4100 Å are the geometric means of the LCO end wavelengths (DERIVED: √(4900 × 9300) = 6751 Å; √(3350 × 5000) = 4093 Å); the note does not say so. Because the prism spreads the blue orders more than the red, the chip center of a prism-dispersed echellogram sits blueward of that mean, and the model shows orders 30–66 (5126–11,290 Å) for the red arm and 63–103 (3426–5609 Å) for the blue arm. The LCO manual publishes the orders on the chip in the standard setting: LCOM Sec. 8B.2, "As of May 2004, the standard grating settings and corresponding wavelength coverage are as follows: ... Orders 71-106 Orders 37 – 70 5000 – 3350 Å 9300-4900 Å"; B15 Sec. 2, "delivers complete wavelength coverage from 3350–5000 Å (blue) and 4900–9500 Å (red)". The displayed red range runs past the instrument's maximum (LCOM Basics: "Wavelength range* | 3200-5000 | 4900-10000"), and the blue range runs 600 Å past the 4950 Å dichroic. The parenthetical in the note is therefore wrong: the order range on the chip is published even though the prism angle is not.
- Fix (DERIVED by scanning lamC in the model): red lamC ≈ 6100 Å gives orders 34–70, 4838–9962 Å; blue lamC ≈ 3900 Å with the equivalent prism of item (c) gives orders 70–106, 3336–5044 Å. Score mLo/mHi or lo/hi against LCOM Sec. 8B.2.
- Effect: Reff 18,720 → 18,984 (red), 24,448 → 24,626 (blue), from the change of central wavelength; dispersion at the center 0.0541 → 0.0440 Å/px (red), 0.0229 → 0.0201 Å/px (blue).

(b) The red `ySpan` info line gives a wrong explanation. The line says the model's prism "disperses at least 1.6% more than MIKE's". B03 Figure 6 (design echellograms, p. 7) plots the order positions. Digitized at 600 dpi on the plotted axis ticks (21.0 px/mm; ±0.05 mm per line), the red panel has 46 order lines at X = 0, orders 32–77, with Y(32) = 0.67 mm, Y(68) = 29.94 mm, Y(69) = 31.08 mm, Y(77) = 41.19 mm. The design's own centers for orders 31–69 therefore lie ≈31.0 mm apart (Y(31) extrapolated by one 0.62–0.67 mm spacing), also more than the 30.72 mm chip. The model spans 31.22 mm (+0.6%); over orders 32–68 the figure gives 29.27 mm and the model 29.42 mm (+0.5%). Over 32–77 the model is +1.6% (41.17 vs 40.52 mm), and the shape differs: 4-order spacing 32→36 is 2.53 mm (figure) vs 2.48 (model), 72→76 is 5.19 vs 5.40. The order identification is fixed by the figure's labels, whose right-hand wavelengths equal 34.028 µm/m (e.g. "10634" for order 32, "4477" for order 76).
- Fix: replace the info line with a scored ySpan for orders 32–68 = 29.27 mm (B03 Fig. 6, digitized; tolerance 2%), model +0.5%.

(c) Blue cross-disperser: the four minimum-deviation passes miss the published format by 5.5%. B03 Fig. 6 (blue panel, 34 lines, orders 74–107) gives Y(107) − Y(74) = 29.21 mm, matching B03 Sec. 2.4: "The spacing between orders 74 to 107 (central wavelength 3313A) is 29mm, which just fits onto the CCD (~31mm wide)." The model gives 27.62 mm (−5.4%), short at both ends (74→78: 2.69 vs 2.93 mm; 102→106: 4.04 vs 4.19 mm). B03 Sec. 2.4 gives the equivalent explicitly: "Two fused silica prisms with 38 deg apex angles provide the equivalent of a single 62 deg apex angle prism on this side." One 62° fused-silica prism in double pass (xA 62, xPasses 2) gives 29.49 mm (+1.0% vs Fig. 6), 74→78 2.84 mm, 102→106 4.35 mm, and 37 orders on the chip.
- Fix: model the blue cross-disperser as the published equivalent, or keep the four passes and state the −5.4% miss as the scored result. Effect: the chip holds orders 70–106 (lamC 3900 Å), close to LCOM's 71–106; R unchanged.

(d) Blue echelle groove density: 52.7 → 52.67 /mm. B03 Sec. 2.4: "MIKE uses one replicated echelle grating from Richardson Grating Lab on each side." The Richardson Gratings catalog (2014; saved by another auditor as rawdata/presets/m2fs/Richardson_Gratings_catalog_vogel.de_mirror_fetched2026-11-16.pdf, Table T3 "Echelle Gratings", p. 17) lists "53-*-417E 52.67 69° 204 x 408", the only 69° master at this ruling, consistent with B03's "6x16 inch R2.6". B03's own blue wavelengths require 52.67: 2 sin 69°/52.67 mm⁻¹ = 35.450 µm gives order 74 at 4790.6 Å (text: "number 74 at 4790A"), order 107 at 3313.1 Å ("3313A"), order 110 at 3222.7 Å ("3222A"), and reproduces all nine Fig. 6 labels (4791, 4545, 4323, 4122, 3939, 3771, 3617, 3476, 3344 Å); 52.7 /mm gives 35.430 µm and misses each label by 2–3 Å (DERIVED).
- Effect: order wavelengths +0.06% (+2.3 Å at 4100 Å); R and dispersion unchanged.
- Red arm, unresolved: B03 Fig. 6 labels and the text ("number 31, centered at 10977A") require 2 sin 63.5°/52.6 = 34.028 µm, so the design used 52.6 /mm. The 2014 catalog lists "53-*-415E 52.67 63.5° 128 x 254", whose maximum ruled area is smaller than B03's "6x12 inch R2 grating". Whether the red grating is a 52.67 /mm replica cannot be settled from these documents; the effect is ≤0.13% in wavelength.

(e) Resolution and pixel scale are the 2002 design values; the as-built values differ, and the page does not say so. The pub line "R 19,000 at 1″ (design, slit-limited)" is correctly labeled and is the right comparison for Rs (B03 Sec. 2.4: "Both camera designs form images with >95% encircled energy within 1 pixel (15µm), so resolution is limited by slit size"). The builders' 2015 paper and the observatory manual give: B15 Table 1, "Resolution (FWHM; 1.0′′ slit) 28,000 22,000", "focal ratio (effective) F/3.9 F/3.6", "scale at CCD 8.2 pix/′′ (0.12′′/pix) 7.5 pix/′′ (0.13′′/pix)"; LCOM Basics gives the same. B15 Fig. 3 (p. 7) plots the measured length of the 5″ slit vs. order: read by eye, 18.1 (order 40) to 19.8 (order 70) binned-by-2 pixels on the red side and 19.8 (order 75) to 21.3 (order 110) on the blue side. The model gives 17.2–18.4 (red) and 18.9–20.3 (blue) in the same units, 4.5–7% short; the model's 7% (red) and 8% (blue) variation along the format matches B15's "the slit length in pixels changes by about 10% over each echelle spectrogram". The page therefore shows R = 18,720 and 0.143″/px for MIKE red where the observatory's numbers are 22,000 and 0.13″/px.
- Fix: say in the note that the model reproduces the B03 design (R 19,000/25,000; 105/115 µm per arcsec), and add info lines for B15 Table 1 (R 22,000/28,000 FWHM; 7.5/8.2 pix/″) with the misses (−15% and −13% in R; −5% to −7% in slit length). Possible causes are in Sec. 6 (open questions); none is sourced.

(f) Quasi-Littrow geometry: the offset lies out of the dispersion plane. The note says "quasi-Littrow (angles not published: 0 here)". B03 Fig. 1 (p. 2, rendered at 600 dpi) draws each arm in the plane that contains the prism's apex angle, the cross-dispersion plane, with the grating "drawn as a mirror"; the injection triplet and flat mirror sit above the camera axis (red) and below the axis (blue) in that plane, beside the CCD. B03 Sec. 2.3: "The optical axes of the cameras are offset by about 30mm from the optical axes of the injection optics." B15 Sec. 2: "the quasi-littrow configuration of the grating causes the slits to be tilted along the orders", the signature of an out-of-plane angle. LCOM Sec. 8B.2 also separates the grating "Azimuth" (selects the orders on the chip, i.e. moves the format across the dispersion) from the "Elevation" ("center the free spectral range"). INFERRED: the offset is an out-of-plane angle γ ≈ ½ atan(30/500) = 1.7° (red) and ½ atan(30/550) = 1.6° (blue), with θ = 0. The page caption already says the slit "sits beside the detector out of the page" while the preset sets γ = 0, an internal inconsistency.
- Effect of γ = 1.7°: Reff −0.3% (18,931 vs 18,984 at lamC 6100); the line tilt of B15 appears. For comparison, the same 1.7° placed in plane (θ) would raise Rs by 6.4% (20,390), so an in-plane reading would not explain item (e) either.

(g) The `mikeblue` UI state: xPasses 4 has no matching button; the disperser panel shows "1 pass | 2 passes" with neither selected.

### 1.2 `pub` lines

- mikered "R 19,000 at 1″ (design, slit-limited)": same setup (1″), design, Rs; model 18,938 (−0.3%). OK as a design check; see item (e).
- mikered "1″ = 105 µm at the CCD": B03 Sec. 2.4 "(1arcsec = 105µm on the red side, 115µm on the blue side)"; also the lab test in B03 Sec. 6, 0.37″ apertures "image to a diameter of 2.8 pixels on the blue side and 2.6 pixels on the red side" (DERIVED 105/114 µm per arcsec). Design value; as-built differs (item e).
- mikered ySpan 31–69 (info): explanation wrong (item b).
- mikered minSepArcsec 6″: B03 Sec. 2.4 "Minimum order separation is 6 arcsec on both the red and blue sides"; model 5.87″. OK.
- mikeblue R 25,000, 115 µm, minSep 6″: same comments; model 24,681, 0.1297″/px, 5.70″.
- mikeblue ySpan 74–107 = 29 mm (info): the explanation is correct; B03 Fig. 6 gives 29.21 mm (item c).

---

## 2. ESO 3.6 m / HARPS (`harps`)

### 2.1 Values checked against HUM, ESOD, M03, R04

Confirmed: D 3.566 m (E36 "M1 Diameter | 3.566 m"); f_col 1560 mm, beam 208 mm, internal f/7.5 (HUM Table 2.2); echelle "R4, 31.6 gr/mm blaze angle 75◦" (HUM Table 2.2); "off plane angle = 0.721 deg" (HUM Sec. 2.1, p. 4; the sentence is garbled, read as γ); camera 728 mm; grism 257.17 /mm FK5; 2 × (2k × 4k) 15 µm; fibers 70 µm = 1″; 2 spectra. The fiber convention (1″ × √3/2 at f/7.5, i.e. a 130 µm image at the collimator focus, DERIVED 3566 × 7.5 × 4.848×10⁻⁶ mm) equals the étendue-conserving image of the 70 µm core fed at f/4.05; no source gives the fiber image size at the spectrograph entrance.

Problems:

(a) Grism apex: a sourced inference exists. The note says "apex not published: set so the central wavelength passes undeviated", which gives A = 16.2° for λc 5316 Å. HUM Table 2.2 and ESOD give "FK5 grism, 257.17 gr/mm blazed at 480nm". For the standard grism, whose groove facet angle equals the prism apex, the blaze wavelength is the undeviated wavelength, m G λ = (n − 1) sin A, so A = asin(0.25717 × 0.480/(n_FK5(480 nm) − 1)) = 14.5° with n = 1.49264 from the FK5HTi Sellmeier (DERIVED; the facet-equals-apex design is INFERRED). The model cannot use this angle at present, because physics.js computes the grism apex from lamC in echelle mode (`sA = Gx * lamC / (nC - 1)`). With a patched copy (apex as input, scratchpad physics_mod.js):

| order pair | HUM Table 2.2 (px) | model A = 16.2° | model A = 14.5° |
|---|---|---|---|
| 89–90 | 100.7 | 100.9 (+0.2%) | 99.6 (−1.1%) |
| 114–115 | 62.7 | 63.7 (+1.6%) | 62.6 (−0.2%) |
| 116–117 | 60.7 | 61.7 (+1.6%) | 60.7 (0.0%) |
| 160–161 | 34.2 | 35.8 (+4.7%) | 34.8 (+1.8%) |

- Effect: span of orders 89–161 62.51 mm (14.5°) vs 63.63 mm (16.2°). With the 81-px chip gap included in the detector height (HUM Sec. 2.8 "Chip to chip gap 1215 ± 45 µm"; ESOD "a field of 62.7x61.4mm is actually used"), coverage becomes 3816–6898 Å and orders 89–160, vs published 380–690 nm and orders 89–161 (now 3872–6844 Å, 89–158). R is unchanged.
- Fix: allow the grism apex as an input in echelle mode, set A = 14.5° (DERIVED/INFERRED as above), and include the gap in Ny (4177 px) or add a gap.

(b) Echelle geometry at the chip center. ESOD: "The echelle grating, a copy of the UVES mosaic, is operated in quasi-Littrow condition." The UVES red echelle is 31.6 /mm at 75.04° (UVES User Manual Issue 117, Table 2.2, "Red 31.6 2.100.000 0.0900 75.04◦ 63", quoted in data/round5/uves.md; same 214 × 840 × 125 mm monolith). The HARPS ETC table (HUM Fig. 2.3, "Wavelength of central column") gives m λ = 61.211–61.220 µm at the central column for orders 89–161 (DERIVED, e.g. 114 × 536.97 nm), 0.14% above the model's blaze center (61.130 µm for 75°, γ 0.721°). Littrow at the central column with α = β = 75.3° reproduces m λ = 61.215 µm and the ETC's per-pixel bins at three orders within their rounding (order 89: 0.01861 Å/px vs "0.0019" nm; 114: 0.01451 vs "0.0015"; 116: 0.01425 vs "0.0014"); the shipped model puts 536.97 nm 7.7 mm off center with 0.01422 Å/px, and the ETC's two-digit bins bound the chip-center angle to 75.07–75.31° (DERIVED from orders 114 and 116).
- Fix (minor): eDelta 75.3° as the chip-center angle (facet 75.04°), lamC 5323 Å (61.2146 µm/115). Effect: Rs 103,889 → 106,100, Reff 99,820 → 101,929 (+2.1%); dispersion at the center −2%; the pub line "0.0015 nm/px in order 114" goes from −5.2% to −3.3%.

(c) The R info line carries no explanation of the 13% miss. The page shows R = 99,820; the line "R 115,000 (measured)" is info only. The sources disagree among themselves: HUM Table 2.2 gives 3.4 px per FWHM, and 3.4 px × the ETC's 0.0015 nm gives 105,000 (the preset's own first info line); M03 gives "R=115,000. At this resolution each spectral element is still sampled by 3.2 CCD pixels" (DERIVED 3.2 × 0.01482 Å at 536.97 nm gives 113,000); R04 3.5 px; ESOD "RS=120,000 (measured)" with "4.1 px per FWHM". The model's 3.49 px and Rs 103,900 agree with HUM's sampling and R04. A possible cause, not sourced: a Gaussian fit to a pixel-sampled projected disk 4 px across returns FWHM ≈ 0.71–0.77 d instead of the geometric 0.866 d (numerical test, scratchpad gfit2.py), which would raise a fitted "measured" R by 13–19%, to 117,000–124,000 from the model's geometry.
- Fix: write the explanation into the info line and, in the note, state that the model's R follows the geometric FWHM.

(d) The 2015 octagonal fibers (HUM Sec. 4.7, "On June 1st, 2015, a new set of non-circular, octagonal optical fibres") are not mentioned; the round-core √3/2 factor applies to the original fibers. Small effect; a line in the note suffices.

### 2.2 `pub` lines

- "3.4 px per FWHM" (npix, scored): HUM Table 2.2; model 3.49 (+2.8%). Same setup.
- "coverage to 6900 Å" (scored), "reddest order 89" (scored), "coverage from 3800 Å" and "bluest order 161" (info): HUM Table 2.2; the misses are explained in the lines and largely removed by item (a).
- "0.0015 nm/px in order 114 (536.97 nm)" (scored, tol 10%): HUM Fig. 2.3 is an ETC calculation rounded to two significant digits (±3%); model −5.2%; see item (b).
- "order 160 to 161 separation 34.2 px" (scored, tol 15%): HUM Table 2.2; model +4.7% now, +1.8% with A = 14.5°.

---

## 3. Keck I / HIRES (`hires`)

### 3.1 Values checked against V94, HM94, KHD06, KUN08, Keck pages

Confirmed: echelle 52.68 /mm, 70.5°, "The collimator-to-camera angle (2θ) is 10.0°" (HM94 p. 17); in-plane (V94 Sec. 3: "The echelle is used in-plane with a collimator-to-camera angle of 10°"); f_col 4.1547 m, camera 0.7627 m (HM94 App. E header); cross-disperser 250 /mm, "The collimator–to–camera angle is 40°" (HM94 p. 21); 3-chip 2048 × 4096, 15 µm mosaic with orders along the 4096 axis (KHD06 Sec. 1.1, 2.0); D 10.95 m at f/13.7 (O95).

The sign of θ was checked, because the model's R depends strongly on the sign (θ = −5° gives Rs 30,000). The model's choice α = δ + θ > β is supported by two sources:
- V94 Sec. 3.3: the cross-disperser mosaic has "the effective length of each ruling is 24" ... This geometry nicely matches the anamorphic beam from the echelle." Only α > β expands the beam (model W′ = 502 mm, within the 610 mm ruling; α < β would shrink the beam to 183 mm).
- HM94 Sec. 4: "the de-projection factor ... is about 1/8.715 which results in a scale of about 12.44 arcsecs/mm at the CCD in the echelle dispersion direction." DERIVED: 1.3789684″/mm × (4.1547/0.7627) / (cos 75.5°/cos 65.5°) = 7.512/0.6038 = 12.44″/mm, exact for δ = 70.5°, θ = 5°, α > β.

The model also reproduces HM94 App. E: dispersion in order 62 (1.6704 vs 1.67 Å/mm), order separations within 1.7% (e.g. order 119: 0.510 vs 0.510 mm; order 36: 5.23 vs 5.32 mm), and the spatial scale (order 62: 14.583″/1.836 mm = 7.94″/mm, DERIVED; model 7.93″/mm).

Problems (all minor):

(a) The scored R line uses the calculated column, while the same table gives a measurement in the preset's own setup. KSLIT (Keck "Available Slits and Resolutions"): deckers B5/C1–C3, 0.861″, "Resolution (measured+)" 50,000, footnote "+ Using Red cross-disperser. Average of 4 Th/Ar lines near 5240 A." The model gives Reff 48,618 at 5241 Å in order 68 (−2.8%). The research record recommended this line.
- Fix: score "R 50,000 measured, red XD, ThAr near 5240 Å" with q RAt, lam 5240; keep the calculated line as info.
- The 3% excess of the model's Rs over the calculated 48,000 has a sourced explanation: the calculated column has R × slit = 41,330″ (72,000 × 0.574), which corresponds to 12.01″/mm at 1.67 Å/mm in order 62, i.e. HM94's "1/8.715" factor (1.3789684 × 8.715 = 12.02″/mm); the geometry, and HM94's own "12.44 arcsecs/mm" in the same sentence, give 3.5% higher R (DERIVED). The two numbers in that HM94 sentence disagree by 3.5%.

(b) The gap line uses an approximate statement when a same-setup calculation exists. KUN08 item 16: "the free spectral range does exceed the size of the detector longward of about 6000 Angstroms." HM94 App. E gives the FSR length per order: "57 6252.4 ... 60.41" and "56 6364.0 ... 61.49" (LENGTH, mm), so the FSR first exceeds the 61.44 mm chip at ≈6360 Å (DERIVED). The model's first gap starts at 6420 Å (+0.9% vs App. E; +7% vs KUN08).
- Fix: score the gap against App. E (6360 Å, tol 2%) and keep KUN08 as info.

(c) lamC 6000 Å lies near the blue edge of order 59's free spectral range (5991–6093 Å, blaze 6043 Å), so the readouts at the central wavelength are off-blaze (dispersion 0.0280 Å/px vs 0.0262 at the blaze). The note discloses that the value is chosen; 6043 Å (order 59 blaze) or 5748 Å (App. E's order 62) would show blaze values.

(d) V94 Sec. 3.3 gives the ruling as "52.676 grmm1" (OCR), HM94 52.68: a 0.008% difference, no effect.

(e) PypeIt (new source, keck_hires.py) uses `platescale = 0.135` for the mosaic and 0.2160 for the Tek CCD. Keck's binning page ("Detector pixels project to about 0.12 arcseconds"), HM94 Table 3 (DERIVED 0.191″ per 24 µm) and App. E (7.94″/mm) agree with the model's 0.119″/px; the PypeIt value appears to be a rough setting and does not change the conclusion.

### 3.2 `pub` lines

- "R (calculated) 48,000 at 0.861″, slit-limited" (Rs): calculated column; model +3.0%; see item (a).
- "spatial scale about 0.12″/px": KBIN and KUN08 item 11; model 0.119.
- "1.67 Å/mm in order 62 at 5748 Å": HM94 App. E is the format program's calculation for the same optics (Tek era, δ 70.4°); model 0.0%.
- "orders outgrow the detector above ~6000 Å": see item (b).

---

## 4. Keck I / LRIS red (`lris`)

### 4.1 Values checked against O95, KLD, KLDET

Confirmed: f_col 2000 mm and camera 305 mm (O95 Sec. 2: "The collimator focal length was then set at 2000 mm and the camera focal length at 305 mm"); "The diffracted light from the red grating comes off at a 44° angle to the incoming beam" (O95 Sec. 1–2); grating near the telescope focal plane ("proceeds to a plane reflection grating which is located near the focal plane of the telescope"), used for layLen; plate scale 1.375″/mm (O95 Sec. 2), reproduced by D × F = 150 m; detector "LBNL 4k x 4k ... 15 µm pixels ... (Mark IV, installed in May 2021)" and "Plate scale | 0.135"/pix" (KLDET); 600/7500 grating (KLD).

Further support found:
- The sign of the 44° (α = 36.0°, β = −8.0°, beam expanded by 1.22) agrees with O95's camera design: "A 139.7X195.6 mm elliptical entrance pupil was used which represents the anticipated worst-case anamorphic grating magnification factor of 1.4", and "the anamorphic factor associated with a distribution of 3900-7000 Å light across the detector would be approximately 1.2". The opposite sign would give 0.663 Å/px against the published 0.80 (DERIVED).
- Blaze: Richardson catalog Table T2 (p. 10–11 of the same catalog) lists "53-*-350R 600 750 nm 13° 154 x 206", the standard 152 × 203 mm size of O95 Sec. 2; the model's δ = 13.0° (Littrow from 7500 Å) matches.
- Dispersion: PypeIt's archived arc solution for this grating (new source, reid_arxiv keck_lris_red_R600_7500, 7170 px, 4315–10,027 Å) has 0.803 Å/px at 7500 Å (DERIVED from the wave column; the binning and grating tilt of the template are not recorded). Model 0.812 (+1.1%).
- The 30-object note: Steidel et al. 2003 Sec. 3: "A typical slit mask included an average of 15–20 z ∼ 3 LBG candidates ... (∼ 10 − 15 additional slits per mask)"; Cooke et al. 2005: "Typically, each slitmask was able to include 25 − 35 objects". Supported.

Problems (minor):

(a) The FWHM behind the scored R line has unclear provenance. KLD says: "Dispersion and wavelength coverage are calculated and are not measured values." The FWHM column is not described for the red side (the blue-side text says its FWHMs were measured with internal lamps), lists the same 4.7 Å for 600/5000, 600/7500 and 600/10000, and states no wavelength. The pub line treats 4.7 Å as λ/R at 7500 Å. The geometric slit FWHM of the model varies from 5.18 Å (5000 Å) to 4.90 Å (7500 Å) to 4.58 Å (10,000 Å) (DERIVED, cos α/(G f_col) × 0.727 mm); 4.7 Å corresponds to the 600 /mm geometry near 9000 Å. Model Reff 1510 vs 1596 (−5.4%, within the 10% tolerance).
- Fix: note in the src that the FWHM is not stated as measured and has no stated wavelength; keep tol 10% or make the line info.

(b) W = 2000/13.7 = 146 mm, while O95 Sec. 3 gives "The 141 mm collimated beam". The convention f_col = F × W requires 146 mm to keep f_col 2000 mm and the plate scale; W = 141 would change Rs and the pixel scale by 3.5%. No change recommended; a phrase in the note would prevent a builder from reading 146 mm as an error.

### 4.2 `pub` lines

- "dispersion 0.80 Å/px" (scored): KLD, calculated; model +1.5%.
- "coverage 3275 Å" (info): correctly explained as 0.80 × 4094.
- "R = 7500/4.7" (scored): item (a).
- "pixel scale 0.135″/px" (scored): KLDET; model 0.1352.

---

## 5. Page check (headless Chrome, server on port 8847, screenshots in scratchpad s1/shots/)

Readouts match the model numbers above. Items an instrument builder would question (beyond the known app-wide issues, not re-reported):
- MIKE red shows "λ range 5126–11,290 Å" and orders 30–66; MIKE blue shows 3426–5609 Å (Sec. 1, item a).
- MIKE shows R = 18,720 / 24,448 and 0.143 / 0.130″/px against the observatory's 22,000 / 28,000 and 0.13 / 0.12″/px (Sec. 1, item e).
- MIKE telescope panel: "Focal ratio f/3.33", "Focal length 21.7 m", "Plate scale 9.52″/mm", "At the focus 105 µm wide". Magellan's Nasmyth focus is f/11 with 346.77 µm per arcsec (IMACS node9; LCOT "The principal foci are f/11 at the two Nasmyth locations"). This is the mechanism of the known fiber f-ratio issue, but MIKE is a slit instrument with injection optics; if the known-issue list covers only fiber instruments, MIKE belongs on the list.
- "Camera focal ratio" shows the diffracted-beam ratio f_cam/W′: HIRES f/1.52 (V94 Sec. 3.4: "This camera is an f/1.0 (polychromatic) prime focus catadioptric system"), HARPS f/3.50 (HUM Table 2.2 "f=728mm, f/3.3"), LRIS f/1.71 (O95 "(under-filled) f/1.56"). A builder reads these as wrong camera f-numbers; a label such as "beam f-ratio at the camera" would remove the conflict.
- MIKE drawing caption says the slit "sits beside the detector out of the page" while the γ control reads 0.0° (Sec. 1, item f).
- MIKE blue: prism-pass toggle shows neither "1 pass" nor "2 passes" for xPasses 4.
- References dialog lists fewer sources than the notes and pub lines cite: hires lacks KSLIT, KBIN, KUN08; lris lacks KLDET, Steidel et al. 2003, Cooke et al. 2005; mikered/mikeblue lack B15; harps lacks ESOD (the 120,000 source) (data/refs_map.json, spec).
- HARPS state carries xA: 40 and xPsi: 10, unused in grism mode (the panel shows the computed apex 16.2°); harmless, but xA would become meaningful with the fix in Sec. 2, item a.

---

## 6. Summary

### (a) Confirmed errors, ranked by severity

1. MIKE red and blue: the central wavelengths (geometric means of the LCO end wavelengths) put orders 30–66 and 63–103 on the chips, showing 5126–11,290 Å and 3426–5609 Å, where LCOM Sec. 8B.2 gives orders 37–70 (4900–9300 Å) and 71–106 (3350–5000 Å) for the standard setting. Fix: lamC ≈ 6100 Å (red) and ≈ 3900 Å (blue, with fix 3), scored against LCOM's order ranges. Effect: coverage 4838–9962 Å (orders 34–70) and 3336–5044 Å (orders 70–106); R +1.4% / +0.7%; central dispersion 0.0440 / 0.0201 Å/px. The note's "where the orders fall is not [published]" is wrong.
2. MIKE as-built performance absent from the page: the model (= B03 design) shows R 18,720 / 24,448 and 0.143 / 0.130″/px; B15 Table 1 and LCOM give R 22,000 / 28,000 (FWHM, 1.0″) and 7.5 / 8.2 pix/″, and B15 Fig. 3 gives slit lengths 4.5–7% longer than the model's. Fix: state in the note that the preset reproduces the design, add B15 info lines with the misses (R −15% / −13%).
3. MIKE blue cross-disperser: four minimum-deviation passes give 27.62 mm for orders 74–107 vs 29.21 mm (B03 Fig. 6) and 29 mm (B03 text). Fix: B03's stated equivalent, one 62° fused-silica prism in double pass (29.49 mm, +1.0%). Effect: the chip holds 37 orders (70–106) instead of 40.
4. HARPS grism apex: "blazed at 480nm" (HUM Table 2.2, ESOD) with the standard grism condition gives A = 14.5° (DERIVED; facet = apex INFERRED), vs 16.2° from λc. Order separations move from +0.2/+1.6/+1.6/+4.7% to −1.1/−0.2/0.0/+1.8% of HUM Table 2.2; with the 1215 µm chip gap in the detector height, coverage 3816–6898 Å and orders 89–160 (published 380–690 nm, 89–161). Requires a physics change (grism apex as an input in echelle mode).
5. MIKE red ySpan info line: the claim that the model's prism disperses ≥1.6% more than MIKE's is contradicted by B03 Fig. 6 (design centers of orders 31–69 ≈31.0 mm apart; model 31.22 mm, +0.6%). Fix: score ySpan 32–68 = 29.27 mm (model +0.5%).
6. MIKE blue echelle 52.7 → 52.67 /mm (Richardson Table T3 53-*-417E "52.67 69°"; B03's own wavelengths and Fig. 6 labels require 52.67). Effect +0.06% in wavelength; R unchanged.
7. HARPS R info line lacks the explanation of the 13% miss required by the presets.js header; HUM's own 3.4 px × 0.0015 nm gives 105,000, and the model agrees with HUM's sampling (3.49 px).
8. HARPS chip-center angle: the ETC central-column m λ (61.215 µm, HUM Fig. 2.3) and bins imply Littrow at 75.3° at the chip center; the echelle is a copy of the UVES 75.04° mosaic (ESOD; UVES UM117 Table 2.2). Fix: eDelta 75.3°, lamC 5323 Å. Effect: Reff +2.1% (101,929); central dispersion −2%.
9. HIRES R line scored against the calculated column while the measured red-XD value exists for the same decker (KSLIT: 50,000, ThAr near 5240 Å). Model 48,618 at 5241 Å (−2.8%). The +3% vs the calculated column follows from the calculated column's use of HM94's 1/8.715 factor (12.02″/mm) instead of the 12.44″/mm the geometry gives.
10. HIRES gap line: KUN08's "about 6000 Angstroms" vs HM94 App. E's FSR length reaching 61.44 mm at ≈6360 Å (DERIVED); model 6420 Å (+0.9% vs App. E).
11. LRIS R line: the 4.7 Å FWHM has no stated wavelength and is not stated as measured (KLD); the model's −5.4% is within tolerance, but the src should say so.

### (b) Unsupported or misleading claims

- MIKE note: "Central wavelength = middle of the LCO standard setting (the prism angle is not published, so where the orders fall is not either)": the middle is a geometric mean, and the orders on the chip are published (LCOM Sec. 8B.2).
- MIKE note: "quasi-Littrow (angles not published: 0 here)": B03 Fig. 1, B03 Sec. 2.3 and B15 Sec. 2 indicate an out-of-plane offset, γ ≈ 1.6–1.7° (INFERRED); effect on R −0.3%; the page caption already describes the slit as out of the page.
- MIKE red pub info explanation (item a5).
- HARPS note: "apex not published: set so the central wavelength passes undeviated": the 480 nm blaze supports 14.5°.
- HARPS note does not mention the 2015 octagonal fibers (HUM Sec. 4.7).
- Page labels: MIKE telescope f/3.33 and 9.52″/mm; camera f-ratios that are beam ratios (Sec. 5).
- HIRES, LRIS, HARPS notes: no unsupported sentences found; the HARPS "order 115 ... in the gap" is implied by HUM Table 2.2 (red chip 89–114, blue chip 116–161) and not stated outright.

### (c) Open questions only the builders can answer

- MIKE (Bernstein, Shectman): how were the LCOM/B15 resolutions (22,000/28,000 at 1.0″, 65,000/83,000 at 0.35″) measured, given the design's 19,000/25,000 and the stated slit-limited images? Candidates, none sourced: a Gaussian fit to a 7-px top-hat line returns FWHM ≈ 0.85 w (scratchpad gfit.py), which would raise a fitted R by ≈17%; slit widths narrower than labeled; an in-plane angle (θ = 1.7° raises R by only 6%, so an in-plane angle would have to be ≈4°).
- MIKE: as-built injection focal ratio (B15 "effective" F/3.6 and F/3.9 vs B03 F/3.3 and F/3.6), and whether the larger as-built slit scale comes from the injection optics or from prism anamorphism.
- MIKE: the quasi-Littrow angles (γ, θ), the prism incidence angles, and the red echelle ruling (52.6 vs catalog 52.67 /mm at 63.5°).
- HARPS (Geneva/ESO team): grism apex and facet angle; the measurement method behind 115,000 (HUM) and 120,000 (ESOD) and the inconsistent sampling values (3.2/3.4/3.5/4.1 px); the fiber-exit magnification (image size at the spectrograph entrance).
- HIRES (Vogt): which of the two numbers in HM94 Sec. 4 (1/8.715 or 12.44″/mm) holds, and whether today's red cross-disperser is the 1994 250 /mm mosaic with the 4.3° as-made blaze (post-2004 Keck pages say only "red-blazed").
- LRIS (Keck): whether the red-grating FWHM column (4.7 Å for the 600 /mm gratings) is measured, and at what wavelength.

### (d) New sources saved (new files only)

- rawdata/presets/hires/github_pypeit_PypeIt_c1798aa8aa_keck_hires.py (PypeIt release branch, commit c1798aa8aa; detector platescale 0.135/0.2160, XDISPERS handling, RED97 note)
- rawdata/presets/longslit_lris/github_pypeit_PypeIt_c1798aa8aa_keck_lris.py (same commit; LRIS red platescale 0.135, Mark4 date 2021-04-22)
- rawdata/presets/longslit_lris/github_pypeit_PypeIt_c1798aa8aa_reid_arxiv_keck_lris_red_R600_7500_ArCdHgKrNeXeZn.fits (PypeIt archived arc solution for the 600/7500 grating; 0.803 Å/px at 7500 Å)
- Used but saved by another auditor: rawdata/presets/m2fs/Richardson_Gratings_catalog_vogel.de_mirror_fetched2026-11-16.pdf (Tables T2 and T3); rawdata/presets/uves/ (UVES echelle 75.04°, via data/round5/uves.md).
- Digitized B03 Fig. 6 order positions (mm at X = 0), for reuse: red, orders 32→77: 0.67 1.34 1.96 2.58 3.20 3.82 4.48 5.10 5.77 6.46 7.15 7.82 8.49 9.20 9.92 10.63 11.40 12.16 12.92 13.71 14.54 15.35 16.16 17.02 17.88 18.78 19.69 20.64 21.55 22.55 23.55 24.55 25.60 26.65 27.70 28.80 29.94 31.08 32.28 33.47 34.66 35.90 37.19 38.52 39.85 41.19; blue, orders 74→107: 0.67 1.42 2.12 2.86 3.60 4.35 5.09 5.84 6.63 7.42 8.21 9.00 9.84 10.67 11.51 12.40 13.23 14.12 15.00 15.93 16.81 17.74 18.67 19.65 20.58 21.56 22.53 23.56 24.58 25.60 26.67 27.70 28.77 29.88.
