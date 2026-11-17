# D1: "All arms" dichroic trees, instruments split in the collimated beam
Checked: DESI, Boombox, PFS, 4MOST LRS, 4MOST HRS, LLAMAS, KCWI (blue + KCRM). Report only; no project file edited.
Working text extractions (pdftotext) and renders are in scratchpad/audit2/t/ ; measurement scripts pfsmeas.py, pfsmeas2.py.
No new files were added to rawdata/presets/ (all sources used were already saved there, or are ADS abstracts / the project's own Via technical document).
Tags: INFERRED = my reading; DERIVED = arithmetic or measurement from a figure.

## Summary table (what arms.js says vs what the sources say)

| Instrument | Field | arms.js | Verdict |
|---|---|---|---|
| DESI | NIR-pass cut / w | 7645 / 150 | Sources disagree (see 1.1); 7595 / 250 is better supported |
| DESI | red-pass cut / w | 5795 / 270 | confirmed |
| DESI | AOI 25.4, 32.1; order; R/T; split | as coded | confirmed |
| Boombox | AOI | 45, inferred | can be settled: 22.5 deg (DERIVED from the Zemax layout) |
| Boombox | R/T | blue R, red T | confirmed by the layout (was "not published") |
| Boombox | cut | 5800 | 2026 SPIE abstract gives the channel boundary 5750 |
| PFS | cuts 6400 / 9550, w 200, order, R/T | as coded | confirmed |
| PFS | AOI | 45, 45, noAoi | can be derived from the published layout: ~29 deg (first), ~39 deg (second) |
| 4MOST LRS | all fields | as coded | confirmed; "order INFERRED" is settled |
| 4MOST HRS | all | inferred | remains unsettled (nothing public) |
| LLAMAS | cuts 6900 / 4750; order | as coded | cuts confirmed; order now settled; R/T, w, AOI still unsourced |
| KCWI/KCRM | cut 5600, R blue / T red, split | as coded | confirmed; w and AOI unpublished |

---

## 1. DESI

### 1.1 NIR-pass crossover: 7645 A / w 150 is one of two readings; the FDR and the D22 Fig. 32 caption say 747-772 nm
arms.js: "cut: 7645, w: 150 ... crossovers DERIVED as the middle of each specification gap", with D22 Sec. 7.2 "reflectance > 95% from 360 to 757 nm" and "> 95% from 772 to 980 nm" (gap 757-772, midpoint 764.5 nm, width 15 nm).
Sources:
- DESI Collaboration 2022 (arXiv:2205.10939) Sec. 7.2, p. 35: "The NIR pass dichroic transmission requirements were > 95% from 772 to 980 nm, and reflectance > 95% from 360 to 757 nm. The average incidence angle is 25.4 deg. The red pass dichroic requirements were > 95% transmission from 593 to 772 nm, and > 95% reflectance from 360 to 566 nm, and the average incidence angle is 32.1 deg."
- Same paper, Fig. 32 caption (p. 53 region): "The crossover region for the red pass dichroic is 566 - 593 nm and the crossover region for the NIR pass dichroic is 747 - 772 nm."
- Same paper, Fig. 14 caption: "Light in the NIR channel (747 - 980 nm) passes through the NIR dichroic".
- DESI FDR (arXiv:1611.00037) Part II, Sec. 5.1.3, Table 5.3: NIR Pass Dichroic: Reflection Band 360-747, Transmission Band 772-980, "Crossover Region R+T (nm) 747-772", "Crossover Width (nm) 25"; Red Pass: 360-566 / 593-747 (the FDR table prints 593-747; D22 prints 593-772), crossover 566-593, width 27.
So the 757 in D22 Sec. 7.2 is the odd one out: the FDR table (the original specification) and D22's own Fig. 14 and Fig. 32 captions all give 747. A 747-772 crossover gives cut 7595 A, w 250 A (DERIVED: midpoint 759.5 nm; width 25 nm, as the FDR states). The arms.js value is 50 A too red and its band is 100 A too narrow.
Fix: NIR node cut 7595, w 250, src "FDR Table 5.3 (747-772 nm) and D22 Fig. 32 caption; D22 Sec. 7.2 text says 757 nm". Severity: minor (50 A).
Red-pass node: 566-593 nm gives 5795 A, w 270 A (the FDR's "27 nm"): confirmed.

### 1.2 Everything else confirmed
- AOI 25.4 (NIR-pass), 32.1 (red-pass): D22 Sec. 7.2 (quoted above; "average incidence angle").
- Order: D22 Sec. 7.2, p. 34: "Light in the red and blue channel wavelength range is reflected off the NIR pass dichroic and the blue light reflects a second time off of the red pass dichroic". NIR dichroic first; it reflects blue+red, transmits NIR; red-pass reflects blue, transmits red. This matches the tree (T of the first node = desiz; R of the second = desib).
- Split location: FDR Sec. 5.1.3: "The dichroics can be placed between the fibers and the collimator or after the collimator ... We have chosen to place them after the collimator". D22 Sec. 7.2: "Collimated light is reflected directly back toward the slit." Collimated beam: correct.
- Shared controls: one slit (121 mm, 500 fibers), one f/3.57 spherical Schmidt-type collimator mirror, "approximately 140 mm" beam at the gratings (D22 p. 35; the presets use the 126 mm pupil for all three, FDR "pupil is 126 mm"). Sharing W, col, slitW, nObj, F is right. Minor note: D22 says the incident beam diameters at the gratings are approximately 140 mm, the presets carry 126 mm; not a sharing error.
- Arm ranges vs cuts: desib band 3600-5930 against the red-pass crossover 5660-5930 (566-593 nm): consistent (band edge = end of the crossover region). desir 5660-7720 and desiz 7470-9800 likewise (747 = start of the NIR crossover). No arm extends past its crossover.

## 2. Boombox (proposed Via instrument; can be settled more than arms.js says)
Sources: project's Via technical document, the Via technical document Sec. "The Boombox Spectrograph" and Fig. bb_optics = its Boombox bench layout figure (Zemax top-down layout, labelled "collimator", "dichroic", "fold mirror", "fiber slit", with a 100 mm scale bar); the earlier audit data/audit/2026-11-16_S2_desi_boombox_via.md measurements; and the 2026 SPIE paper abstracts in ADS (no arXiv or full text found; abstract only).

### 2.1 Split location, R/T: confirmed from the layout (arms.js says "which side it reflects is not published")
Technical document, Sec. Boombox: "The light from the 36 fibers is collimated using a refractive triplet and then split into the two wavelength channels with a dichroic mirror." In the rendered Boombox_bench_layout.pdf the beam leaves the triplet collimator horizontally, meets the dichroic, the blue rays reflect down-left to the blue grating, and the red rays pass straight through to a 45 deg fold mirror, then to the red grating. So: dichroic in the collimated beam (correct), reflects the blue, transmits the red (matches R: boomboxb, T: boomboxr), one dichroic only. Shared slit, collimator and 50 mm beam: right (BBL measures 49.7 mm; SPIE 14149 abstract: "refractive triplet collimator with a 264 mm focal length and a set of 75 mm focal length cameras that are six and five elements in the blue and red channels, respectively" - so both cameras are 75 mm, as the presets have; the f/5.2 fiber cone of the preset gives 260 mm, the abstract 264 mm, 1.5% apart).

### 2.2 AOI: 22.5 deg, not 45 (DERIVED); arms.js carries 45 with inferred: true
The earlier audit (S2, "Measurements from the Zemax layout") measured the dichroic face at 67.4 deg and the reflected beam reaching the blue grating at 135.0 deg (direction change). My own read of the render agrees: the face runs from about (1083, 80) to (1125, 178) px, 66.8 deg from the beam, and the reflected blue beam goes off at 45 deg below the incoming horizontal beam's reversed direction, a 135 deg change of direction. Angle of incidence = (180 - 135) / 2 = 22.5 deg (equivalently 90 - 67.4 = 22.6 deg). This is a Zemax drawing measured to about +-1 deg.
Fix: Boombox node aoi 22.5 (src: Zemax layout, technical doc Fig. bb_optics, MEASURED), drop noAoi/inferred for the angle. The drawn turn at the dichroic becomes 135 deg instead of 90 deg, matching the Zemax figure.

### 2.3 Crossover: 5750 A is better supported than 5800 A
arms.js: cut 5800, "the bands' overlap (INFERRED)". Sources: technical document: "a blue channel (3600 to 5900 A) and a red channel (5700 to 10000 A)"; Via Science Book (as quoted in the earlier audit): red 5700-10100. The 2026 SPIE paper "Optical design of Boombox" (Proc. SPIE 14149, doi 10.1117/12.3105248, ADS 2026SPIE14149E..9QP) abstract: "a two-channel design covering 3550-10100 A (blue channel: 3550-5750 A, red channel: 5750-10100 A) at a resolving power of R ~ 1000". The newer paper gives a single boundary at 5750 A, which is the dichroic crossover. Fix: cut 5750 (src SPIE 14149 abstract). Transition width: not published in anything I could reach (w 200 is unsourced). Remains inferred only in the width. I could not read the full paper, so the dichroic's actual 50%-point and transition could differ from the channel boundary.
Arm presets: boomboxb 3600-5900 and boomboxr 5700-10100 overlap the cut by +-100-150 A: consistent with a transition region.

### 2.4 What cannot be settled
Transition width; the dichroic substrate and coating; whether the red channel's fold mirror matters to the drawing (the tree has only the dichroic; the fold is a schematic detail). Grating line densities remain open (S2 audit).

## 3. PFS

### 3.1 Confirmed
- Order and R/T: Vives et al. 2014 (SPIE 9147, arXiv:1408.2827) Sec. 3: "Two dichroics split the beam: the first dichroic reflects the 'Blue' part of the spectrum and the second reflects the 'Red' while the 'NIR' is transmitted." Matches the tree.
- Split location: same paper Sec. 4: "Two dichroics are inserted in the beam ... between the collimator mirror and the Schmidt correctors (one per channel). The three Schmidt correctors are identical except for the coating". Pascal et al. 2014 Sec. 2.2: "The Entrance Unit delivers three collimated beams using a collimator mirror and three identical Schmidt correctors ... The wavebands are separated by two plates with dichroics coatings manufactured by ASAHI". Tamura et al. 2016 Sec. 4.2: "The dichroic coating to split the collimated beam in the spectrograph into the blue, red, and NIR channels". Collimated beam, after one shared slit and collimator: right.
- Crossovers 640 and 955 nm: Smee et al. 2016 (arXiv:1608.01196) abstract: "Each spectrograph module has three channels covering wavelength ranges 380 nm - 640 nm, 640 nm - 955 nm, and 955 nm - 1.26 um". (Barkhouser 2014 and the Subaru web table give the overlapping 380-650, 630-970, 940-1260 nm, whose overlap centers, 640 and 955 nm, agree.)
- Width: Tamura et al. 2016: "the requirement of the sharp transition (~20nm) between the reflection and transmission as well as the high throughput in each regime (>=95% of reflectance and >=90% of transmittance)". w 200 A: confirmed.
- Shared W (693.5 mm / f2.8), 616 fibers, one slit: right; the three cameras are the same 300 mm f/1.09 Mangin-Schmidts (Pascal 2.3: "identical Mangin mirrors for the blue and the red channel"; "almost identical" cameras, Vives 2014).
- Arm ranges vs cuts: pfsb to 6500 (cut 6400, w 200: transition 6300-6500), pfsr 6300-9700 (second cut 9550: transition 9450-9650; 9700 is 50 A past), pfsn from 9400. Consistent with the 650/630 and 970/940 nm design overlaps.

### 3.2 AOI: published in the layout figure, though not in text (arms.js: noAoi, drawn at 45 deg for both)
Vives et al. 2014 Fig. 2 (the same drawing as Pascal et al. 2014 Fig. 1), "Optical layout of one spectrograph module", shows both dichroics in a V arrangement after the collimator. I extracted the embedded raster (pdfimages) and measured: the first dichroic's face at 62 deg from the horizontal incoming beam (AOI = 90 - 62 = 28 deg); the reflected blue ray bundle leaves at 119-122 deg from the incoming direction (AOI = (180 - 120)/2 = 29-31 deg). The second dichroic's face at 52 deg from the beam (AOI 38 deg); the reflected red bundle leaves at ~102 deg (AOI ~39 deg). DERIVED, +-3 deg, from a schematic concept-design drawing (2012-2014; I could not verify against the as-built bench). Suggested: first node aoi ~29, second node aoi ~38, flagged DERIVED from Vives 2014 Fig. 2, and the README sentence that the PFS angle is not published would become "not stated in the text; read from the layout figure". This changes the drawn turns from 90 deg to ~122 deg and ~102 deg.

## 4. 4MOST LRS (all confirmed; one "inferred" is settled)
Sources: Laurent et al. 2020 (SPIE 11447, HAL-04785314) Sec. 4.2; Laurent et al. 2016 (SPIE 9908) Sec. 3.2; Disseau et al. 2022 Sec. 4.3; 4MOST User Manual v2.0 Sec. 6.1.2.6.
- Cuts, AOI, width: L20 Sec. 4.2: "Nominal transition wavelength is 706 nm+-7nm for Red Dichroic and 539 nm+-5nm for Blue Dichroic ... Transition shall be < 30 nm from 95%R to 5%R. The Angle of Incidence of Red respectively Blue dichroic is of 35.35 deg +-1 respectively 43.58 +-1 deg." L16: "tilted by 35 and 43.3 degrees respectively. The wavelength transition regions are 30nm width and are respectively centered at 539nm for the Blue dichroic and at 706nm for Red dichroic." Measured: D22 Sec. 4.3 "The first transition between the blue and green channels is 524-554 nm and the second one between the green and red channels is 691-721 nm". All match 7060/5390, w 300, 35.35/43.58.
- Order (arms.js: "the order of the two is INFERRED") is settled by the requirements in L20 Sec. 4.2: "The Red Dichroic shall reflect wavelength in the blue range (from 370 nm to 691 nm) and transmit the red range (from 721 nm to 950 nm). The Blue Dichroic shall reflect ... from 370 nm to 524 nm and transmit the red range (from 554 nm to 721 nm)." The blue dichroic's transmission band stops at 721 nm and its reflection band starts at 370 nm: it only receives 370-721 nm light, so it sits after the red dichroic, which receives the full 370-950 nm. L16 also: "reflecting each time the shorter wavelength". The tree (red dichroic first, R goes to blue dichroic) is right. DERIVED from the requirement bands; the comment can drop "INFERRED".
- Split location: L16 Sec. 3.2: "Dichroic beam splitters in front of the Schmidt corrector separate the three channels"; D22 Sec. 2: "A spherical mirror collects the F/3 light ... generates a collimating beam of 200 mm. Two dichroics split the beam into three channels". Shared 200 mm beam, mirror collimator, one slit: right. All three cameras f/1.73, 345 mm (preset identical).
- Arm ranges vs cuts: 4mostlb detector 3671-5549 vs cut 5390 (transition 5240-5540; ends at the transition's red edge), 4mostlg 5220-7229 (transition 5240-5540 / 6910-7210), 4mostlr 6884-9524: consistent with the measured 524-554 and 691-721 nm regions.

## 5. 4MOST HRS (effective optics): still inferred
Sources: Hansen et al. 2015 (AN 336, 665) Sec. 2 and Fig. 1: "After a common collimator optics, the light is split by dichroic filters into three separate channels"; Fig. 1 caption "separation into three channels by dichroics (here only the blue channel is shown)". de Jong et al. 2019 (Messenger) and the User Manual (Sec. 6.1.2.7) give only the arm bands (393-679 nm in three channels). No crossover, AOI, order, or R/T is public in what I could reach (ADS lists Sanchez 2016, SPIE 9908 90 and Seifert 2018 for the HRS design, but abstracts only; no open copy).
- Split location (after a common collimator, dichroics before the per-channel VPH and camera): supported. One shared collimator: supported by Hansen ("common collimator optics").
- Cuts 5915 and 4758 A: midpoints of the gaps between the published bands (435.5/516 and 573/610 nm). INFERRED, and honest: the real crossovers could sit anywhere in the ~800 A and ~370 A gaps (the bands are narrow: 392.6-435.5, 516-573, 610-679 nm), so the strip's drawn crossover is a placement, not a measurement. w 300 and AOI 45 are assumptions. Reflect/transmit and order are not published either (blue first, shorter wavelength reflected is the natural choice, as in the LRS and every other tree). No change possible without a source; the flags are right.

## 6. LLAMAS

### 6.1 Cuts, split, order: confirmed; order is now settled
- Furesz et al. 2020 (SPIE 11447, 114470A), Sec. 2.4 (p. 8): "The short/long pass dichroic (split at 690nm) with the embedded fiber slit is front and center ... In A second blue/green dichroic (split at 475nm), is visible behind the semi-transparent beam." Sec. 3.3: "Its fiber pseudo-slit ... must sit inside the collimated beam at the focus of the spherical collimator mirror. The first dichroic of the system must be placed at the slit." Also Sec. 2.4 ("blue (350-475nm) and green (475-690) arms", "red channel (690-975nm)"). So the 690 nm dichroic is first and holds the slit; the 475 nm dichroic is second. Order and cuts match the tree (arms.js says "the order of the reflections is INFERRED").
- The public ETC (rawdata/presets/llamas/github_rasimcoe_llamas-etc_6c3b1e0/llamas_{red,green,blue}.def) lists the element chain per arm: llamas_red.def has only DichroicRG; llamas_green.def and llamas_blue.def both have DichroicRG and DichroicBG. So red light meets only the first (690) dichroic, green and blue both meet it and then the 475 dichroic: the tree order is confirmed independently. DERIVED from the element lists.
- Split location and sharing: one spherical on-axis collimator (f 200 mm, 50 mm beam, ETC D_BEAM 50.0), slit fiber plate bonded to one half of the first dichroic: collimated beam, one slit, one collimator: right. Cameras are 70 mm in all three arms (ETC): shared telF/fibAp/col/W are right.
- Arm ranges vs cuts (MIT Specifications page): blue 3417-4947, green 4634-7100, red 6771-10000 A; overlaps 4634-4947 (center 4790) and 6771-7100 (center 6935) bracket the 4750 and 6900 cuts. The red preset runs to 10000 A against the 975 nm design edge; the page says "to 1 micron". Consistent.

### 6.2 Still unsourced
- Which side of the first dichroic is reflected (the tree has blue+green reflected to the second dichroic, red transmitted; unstated in text, consistent with the DESI-like layout and the Fig. 7 photo where the red camera lies beyond the dichroic assembly; INFERRED).
- Transition widths (w 200 A for both): not published. AOI: not published (noAoi right; the CAD views in Furesz Figs. 7, 10 and Frostig Figs. 1-2 give no measurable angle). The 2017 pocket guide's single 570 nm dichroic (two-arm concept) is superseded; FR20 and the ETC use 480 / 690 nm band edges (arms.js's 475 and 690 from F20 are the verbatim "split at" values).

## 7. KCWI blue + KCRM
- Cut and R/T: Keck KCWI specs page, Table 1: "Dichroic: Reflects light blue-ward of 560nm to the blue channel, passes light red-ward of 560nm to the red channel". Keck configurations page: "Dichroic cuts on at 5600 A, so minimal throughput below there." Primer: "the dichroic beam splitter reflects the light bluewards of 560nm to the blue channel and passes the light redwards of 560nm to the red channel optics and detector". Matches cut 5600, R kcwib, T kcrm.
- Split location: Morrissey et al. 2018 Sec. 3.1 / Fig. 2 caption: "A parallel red arm can be accommodated by replacing the FMD fold mirror with a dichroic" (FMD is after the spherical collimator and the cylindrical FM1: the Keck primer: "Light from the pupil array proceeds to a spherical collimator and then to a wavefront-correcting cylindrical fold mirror (FM1), completing the portion of the optical path common to both the red and blue channels"). So the dichroic stands in the collimated beam, after one slicer/slit and one collimator, with a 160 mm compound pupil at the grating (Fig. 2 caption). Sharing slitW (slicer), nObj, W (160 mm), col is right; the preset camera focal lengths differ only by the assumed 305 mm (already flagged in the KCRM preset note).
- Not published: transition width (w 200 is unsourced; the Keck pages give only "cuts on at 5600 A"), AOI (FMD "tilted", "FMD and FM3 ... at the same angle" in Morrissey Sec. 3.2, no number; the 3D rendered Fig. 2 cannot be measured). noAoi stands. McGurk et al. 2024 (SPIE 13096 47, ADS 2024SPIE13096E..47M) is an abstract only; no open copy.
- Side fact, not a tree error: in the blue arm a separate 248 x 220 mm red-blocking dielectric filter (Asahi, 570 nm 50% cutoff, 15 deg to the beam; Morrissey Sec. 3.2) follows FM3. The dichroic at 560 nm replaces the need for it in the dual-channel mode; the tree does not draw it. The guider dichroic (630 nm cut) upstream of the slicer is also not part of the tree and "will be redesigned" for KCRM.
- Arm ranges vs cut: kcwib BM 3500-5500 (BL 3500-5600), kcrm RL sample coverages start at 5600 A. No arm extends past the crossover.

---

## Final concise summary

(a) Confirmed errors / improvements, by severity
1. Boombox AOI: arms.js has 45 deg, inferred; the Zemax layout (technical doc Fig. bb_optics; dichroic face 67.4 deg, 135 deg turn) gives 22.5 deg (DERIVED, +-1 deg); reflect blue / transmit red is also confirmed by the layout (not "unpublished"). Fix: aoi 22.5.
2. PFS AOI: arms.js draws both dichroics at 45 deg, noAoi. The published layout (Vives 2014 Fig. 2 = Pascal 2014 Fig. 1) gives ~29 deg (first, blue-reflecting) and ~38-39 deg (second), DERIVED +-3 deg from a concept-stage figure. Fix: set both angles with a DERIVED flag.
3. Boombox crossover: 5800 (overlap midpoint, INFERRED); the 2026 SPIE paper abstract (Proc. SPIE 14149, 10.1117/12.3105248) gives the channel boundary 5750 A. Fix: 5750. Width still unsourced.
4. DESI NIR-pass crossover: 7645 / w 150 (from the D22 text's 757 nm) versus 747-772 nm in the FDR Table 5.3 and the D22 Fig. 14 and Fig. 32 captions: use 7595 / w 250 (FDR width 25 nm). 50 A.
5. LRS "order INFERRED" and LLAMAS "order INFERRED" are both settled (L20 Sec. 4.2 requirement bands; Furesz 2020 Secs. 2.4 and 3.3 plus the ETC element lists); only the comments need updating.

(b) Confirmed with source
DESI AOI 25.4/32.1, red-pass crossover 566-593 (5795 / 270), order and split location (D22 Sec. 7.2; FDR Sec. 5.1.3). PFS cuts 6400/9550 (Smee 2016), w ~20 nm (Tamura 2016), order and R/T (Vives 2014), split in the collimated beam. 4MOST LRS cuts 7060/5390, w 300, AOI 35.35/43.58, R/T, order, split (Laurent 2020 Sec. 4.2, Laurent 2016, Disseau 2022). LLAMAS cuts 6900/4750 and order (Furesz 2020, ETC defs). KCWI cut 5600, R blue / T red, split in the collimated beam at the FMD position (Keck specs, Morrissey 2018). Shared slit/collimator/W/cameras are physically right for all seven (DESI 126 mm pupil, PFS Schmidt collimator with per-arm correctors, LRS 200 mm, LLAMAS 50 mm, KCWI 160 mm pupil, Boombox 50 mm with a triplet).

(c) Still unsourced
HRS: every dichroic field (cuts INFERRED in the gaps, AOI, order, R/T, w). LLAMAS: w (both), AOI, which side of the first dichroic reflects. KCWI/KCRM: w and AOI (FMD angle). Boombox: transition width. PFS: transition widths other than the "~20 nm" requirement, and the as-built angles (the angles above come from the 2014 concept figure). The Sanchez/Seifert HRS SPIE papers, McGurk 2024 and the Boombox SPIE 14149 papers have no open full text.

(d) New sources saved
None saved to rawdata (nothing was downloaded). Citations used beyond the existing rawdata: ADS abstracts 2026SPIE14149E..9QP (Boombox optical design), 2026SPIE14149E..29F, 2026SPIE14152E..2UW, 2024SPIE13096E..47M; the project's own the Via technical document and fig/Boombox_bench_layout.pdf.
