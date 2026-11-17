# M2FS and IFUM: the audit of 2026-11-16

Two independent audits, run after the instruments' builder found the presets wrong, re-checked every value of the presets `m2fsmgb` and `ifumlsb` against the saved sources and searched for better ones. The reports follow unchanged. The presets were corrected from them on 2026-11-16 (web/presets.js); data/round6/m2fs_ifum.md lists the statements of the original research that the audits superseded.

## Audit of the Instrument Explorer preset `m2fsmgb` (Magellan/M2FS HiRes, Mg b order)

Audited 2026-11-16. No project file was edited. New downloads were saved as new files in `rawdata/presets/m2fs/` (listed at the end). Labels: DERIVED marks arithmetic done here; MEASURED marks positions read off a source figure; INFERRED marks a conclusion not stated by any source.

Key to sources: M12 = Mateo et al. 2012 SPIE preprint ("Updated 1 March 2012", written before first light; page numbers are PDF pages). B16 = Bailey et al. 2016. JI23 = Ji et al. arXiv:2207.03499v2. W15, W16, W23 = Walker et al. 2015, 2016, 2023. P23 = Pace et al. 2023. J15 = Johnson et al. 2015. H16 = Hendricks et al. 2016. R16 = Roederer et al. 2016. AJPID = Ji's m2fs_reduction arc-line identifications (`Mg_Wide_r_id.txt`, commit 42516cc). New this audit: RGL14 = Richardson Gratings catalog (2014); J20 = Johnson et al. 2020 (ω Cen); S19, S21 = Song et al. 2019, 2021; L21 = Lim et al. (arXiv:2012.03954); BE03 = Bernstein et al. 2003 (MIKE, already in `rawdata/presets/mike/`); CTL = M2FS-Control repository.

### Main finding

The preset puts the M2FS echelle in true Littrow and assumes the 8–10° camera–collimator angle lies out of the dispersion plane. M12's own figures and text say otherwise.

- **Geometry in M12's figures.** The side views (Fig. 3, p. 6; Fig. 4 left, p. 7) show the fiber slit and injection mirror sitting above the CCD. The same views show the echelle tilted at its blaze angle, so that plane is the echelle's dispersion plane. The prism appears as a triangle only in the top view, so the cross-dispersion runs horizontally.
- **Groove density.** The best-supported value is 52.67 grooves/mm. That is Richardson catalog echelle 53-\*-417E: 69°, maximum ruled area 204 × 408 mm (RGL14, Table T3, PDF p. 19). The same ruling is MIKE's blue echelle: "R2.6 grating with 52.7 gr/mm and 69.0 deg blaze" (BE03, p. 4).
- **Angles on the grating.** With 52.67 /mm, the measured arc-line dispersion requires α ≈ 73.1° and β ≈ 66.5°. That is an in-plane opening of 6.6°, with the incoming beam steeper than the outgoing beam, as the figures show.
- **Independent checks.** M12's statement that "about 7% of the light is vignetted at the top and bottom ends" of the grating requires α ≈ 72.2–72.8°. The preset's 67° gives no vignetting at all. Measured off M12 Fig. 3, the fiber image sits ≈ 50–53 mm above the CCD center, which is ≈ 6° at f = 500 mm.
- **Effect on resolution.** With α > β, the slit image along the dispersion shrinks by cos α / cos β ≈ 0.73–0.77. The app's own physics then gives R ≈ 24,500 for the fiber-limited 180 µm slit, matching W23/P23 (R ≈ 24,000). It gives 33,100 at 95 µm, matching R16 (≈ 34,000, measured from arc lines) and J20 (≈ 32,000). The preset's Littrow geometry gives 18,100 and 24,600.

The preset's EFFECTIVE echelle (51.74 /mm at 67.0°) reproduces the dispersion by construction. It misplaces the camera, the grating angles, the vignetting and the slit-image width, so it reproduces R ≈ 18,000 for the wrong reason.

### 1. The note, state and pub lines checked against the sources

| Claim in the preset | Verdict | Evidence |
|---|---|---|
| 128 fibers per spectrograph | correct | M12 Abstract, p. 1: "each spectrograph is fed by 128 fibers"; W23 Sec. 2.2 |
| each fiber behind a 1.2″ aperture and a ball lens that images the pupil onto the core at f/3.7 | correct (the pupil image is 148 µm) | M12 Sec. 2.1, pp. 3–4: "convert the input f/11 Magellan beam to a 148 µm-diameter pupil with an effective focal ratio of f/3.7 at the input end of each fiber ... placing a 1.2 arcsec (0.46 mm) aperture 0.5 mm in front of a 2.34 mm-diameter spherical ball lens" |
| fibers deliver f/3.4 | correct | M12 p. 4: "Due to FRD, this leads to an f/3.4 output beam" and "f/3.4 ± 0.1" |
| core enters as 0.150 mm / (3.4 × 6.5 m) = 1.40″; equal-line-width slit 1.21″ | arithmetic correct (DERIVED 1.400″, 1.212″) | a modeling convention; the page shows these as if they were sky quantities (Section 6) |
| "the 180 µm slit, wider than the core" | correct as a statement; unsupported for this setup | No single-order Mg b paper states its slit (W15, W16, W23, P23, S19, S21). The 180 µm slit is JI23's multi-order MgWide/BulgeGC1 setup. |
| one lens group as collimator and camera, 500 mm, f/3.4, 147 mm beam, 1:1 | correct, incomplete | M12 Table 4, p. 7. The group is a singlet plus a triplet in one barrel, preceded by a filter, a fiber field lens and an injection (fold) mirror, and followed by a CCD field lens that is the dewar window. In HiRes the cross-dispersing prism is passed twice (Section 2). |
| "R2.6 (69°) in Mateo et al., with no groove density published" | correct for M12; misleading overall | B16 Sec. 2.2 calls the echelle "R2.0", unmentioned in the note. The vendor catalog fixes the density at 52.67 /mm for the only R2.6, 69° master of this size (Section 3). |
| entered as 51.74 /mm at 67.0°, reproducing the measured dispersion and order numbers | arithmetic confirmed; physically wrong | Section 3 re-derives the fit. The values are a Littrow equivalent with no counterpart in the hardware. |
| order 69, isolated by a filter, 5130–5190 Å used | correct | W23 Sec. 2.2: "filters selected to pass light over a single order at 5130 ≲ λ ≲ 5190 Å". Order 69 is DERIVED: m λ = 355,790 Å (AJPID) puts 5130–5190 Å in order 69. |
| the 8–10° opening angle "taken to lie across the dispersion (0 here; no source states the plane)" | wrong | M12 Figs. 3 and 4 show the plane: the fiber ends sit above the CCD in the echelle's dispersion plane (Section 2). |
| e2v CCD 4096 × 4112, 15 µm | correct | T17 Sec. 2.3; W23 (2048 × 2056 binned 2 × 2); M12 Table 4 gives the design format 4096 × 4096 |
| eight groups of 16 on a 300 µm pitch; the model spreads 128 evenly | correct; disclosed | M12 p. 4; W23 Fig. 2 caption. The measured pitch varies along the slit (Section 5). |
| "the single-order setup at Mg b that most published M2FS work uses" | unsupported | The research file says "configuration statistics across all M2FS programs NOT FOUND". W23's 74 of 92 fields is one program. LoRes surveys (JG17, N20, C18, T17) and multi-order HiRes chemistry (J15, H16, R16, JI23, J20, L21) are common too. "The best-documented M2FS setup" is supportable. |
| pub: R ≈ 18,000 "single order at Mg b, effective; the 180 µm slit" (scored, tol 5%) | mislabeled; the scored value is the outlier | The label joins two setups. W15/W16 give R ≈ 18,000 "effective" for the single order with no slit. JI23's "180µm slits, providing R ∼ 18000" is the multi-order setup and is not stated as measured. The same single-order setup gives R ≈ 24,000 in W23 and P23 and ≈ 20,000 in S19. A ratio test, independent of the echelle geometry, rules out 18,000 at 180 µm (Section 4). |
| pub: 0.0325 Å per 15 µm pixel, "so this line is a test" | value correct; the "test" is nearly circular | W23: "We bin the detector at 2 × 2 pixels, giving plate scale ∼ 0.065 Å/pixel". The angle was fitted to order 69 at 5156.4 Å in MgWide, the same order within 4 Å of this setup's center. Mark it info. |
| pub: R ≈ 24,000 in the same setup, slit not stated (info) | quotes correct; model numbers reproduced (24,581 at 95 µm; 18,080 at 180 µm) | W23 Sec. 2.2; P23 Sec. 3.2 |
| pub: fibers 300 µm (20 px) apart; measured average 31.3 px (info) | 300 µm correct; "31.3 px" needs its definition | 31.3 px is the mean tetris pitch divided by 16. The mean interval over the slit is 3813 px / 127 = 30.0 px (DERIVED, AJPID). Within groups the pitch runs 18.1–20.3 px (Section 5). |

The validator (run read-only) passes both scored lines: R 18,080 vs 18,000, and 0.032721 vs 0.0325 Å/px. Both passes follow from the choices described above.

### 2. Spectrograph layout

**Optical train in order** (M12 Sec. 2.2, p. 5; Fig. 3, p. 6; Table 4, p. 7; B16 Sec. 2.2):

1. Fiber ends on the tetrises. These follow a curved arc on the collimator's spherical image surface and are "telecentric at the mid-plane of their respective high-resolution gratings" (M12 p. 4).
2. A post-fiber slit (B16: "a slit mechanism placed just after the ends of the fibers").
3. A plane-parallel order-isolation filter, or a glass blank for parfocality. M12 (p. 9) puts the filters "in the beam just after the fiber ends". B16 puts them "just below the fiber termination surface".
4. The fiber field lens: silica, 124 mm, "only a chord used".
5. The injection mirror, which folds the beam toward the gratings "to avoid mechanical interference with the fiber ends and the camera image plane".
6. The singlet (CaF₂, 260 mm, asphere on the fiber side), then the triplet (S-LAL-7 / CaF₂ / BAK-2).
7. The cross-dispersing prism (XDP): Schott F2, apex 23.6°.
8. The echelle.
9. Back through the XDP, the triplet and the singlet, "passing just below the injection optics".
10. The CCD field lens (silica, 133 mm, "serves as CCD window"), then the CCD.

Answers to the specific questions:

- **One lens group in double pass, quasi-Littrow, 1:1, 500 mm, f/3.4, 147 mm beam.** Yes (M12 Table 4: "Camera/Collimator Focal Length 500 mm ... f/3.4 ... Scale at Detector 1:1 ... Beam Diameter 147 mm"). M12 p. 5 calls the layout "similar to the 'quasi-Littrow' layout of the MIKE and PFS spectrographs". DERIVED: 500/147 = 3.401.
- **XDP in the single-order HiRes mode.** Yes. The prism and echelle form one unit that is swapped out only for LoRes. M12 p. 5: "In LoRes mode, the echelle grating+XDP unit is replaced by a 165 mm x 220 mm standard reflection grating". M12 p. 6: "While the HiRes components—the echelle gratings and XDP—are not meant to be routinely removed". Order selection is by filter only.
- **The prism's effect is visible in the data.** The order-69 traces are tilted by dY/dX = 0.0122. That is 50 px over the 4096 px order and 23 px over 5130–5190 Å, or 1.2 fiber pitches (DERIVED, AJPID). Adjacent orders sit 28.0, 27.7 and 27.0 px apart, 1.4 fiber pitches (DERIVED, AJPID).
- **Camera–collimator angle: value.** M12 Table 4: "Quasi-Littrow Opening Angle ~8-10 deg — Varies depending on mode/gratings used."
- **Camera–collimator angle: plane.** The plane is the echelle's dispersion plane (vertical on the bench). The evidence:
  - In the HiRes side view (Fig. 4, left), the echelle is a block inclined ≈ 23° to the beam. Its face normal therefore lies ≈ 67° from the beam in that view, so the blaze tilt and the dispersion are in the side-view plane. The echelle mount moves in "elevation and azimuth" (M12 p. 7).
  - In the top view, the prism is drawn as a triangle, so the prism disperses horizontally.
  - In the same side view, and in Fig. 3 ("near the fiber ends"), the fiber slit, filter, field lens and injection mirror sit above the CCD. The return beam passes "just below the injection optics".
  - The fiber assembly looks short in Fig. 3. The 57 mm pseudo-slit therefore runs perpendicular to that view, along the cross-dispersion, as an echelle slit must.
  - The colored rays at the CCD spread vertically in the side views (wavelength along the order) and horizontally in the top view (orders and fibers).
- **Sign and size of the angle.** The fiber image lies above the CCD and the echelle face looks down toward the lenses, so the incidence angle exceeds the diffraction angle (α > β). MEASURED from Fig. 3: the injection mirror sits ≈ 60 px above the CCD center. The 61.4 mm CCD spans 70 px and the 250 mm bar ≈ 300 px, so the offset is ≈ 50–53 mm. The mirror sits ≈ 55 mm in front of the CCD, so the folded image of the fiber falls near the CCD plane. DERIVED: 50–53 mm / 500 mm ≈ 5.7–6.1°, accurate to ±1° given the figure's resolution.
- **The research file's reasoning.** The file reads "the returning beam below the injection optics" as "separated across the dispersion direction (dispersion runs along the detector rows, W23)". W23 describes the stitched image, not the orientation of the CCD on the bench, so the inference does not follow. The same INFERRED sentence is in `m2fs_ifum.json` (the `layout` entry).

Crops of the figures: `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/m2fs_img/side_view.png`, `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/m2fs_img/top_view.png` and `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/m2fs_img/fig3_zoom.png`.

### 3. The echelle's groove density

**Sources found.**

- RGL14, Table T3 "Echelle Gratings" (PDF p. 19; printed page 17). Columns: catalog number, grooves per mm, blaze angle, maximum ruled area. The only entry near R2.6 (tan 69° = 2.61) is `53-*-417E 52.67 69° 204 x 408`. The neighbors are `53-*-424E 52.67 65° 204 x 410` and `53-*-415E 52.67 63.5° 128 x 254`. The only R2-class master of this size is `53-*-411E 31.6 63.9° 204 x 408`.
- M12 p. 5: "a 200 mm x 420 mm R2.6 (69 deg blaze angle) echelle grating from the Richardson Grating Lab of Newport Corporation".
- BE03 p. 4: "The blue side uses a 6x16 inch R2.6 grating with 52.7 gr/mm and 69.0 deg blaze." The team overlaps with M2FS (Shectman, Gunnels; M2FS is "similar to the 'quasi-Littrow' layout of the MIKE ... spectrographs").
- No M2FS source states the density. The Newport/MKS online echelle table refused automated access (HTTP 403).

**The fit, re-derived from AJPID** (cubic fits over 28 fibers, at the binned chip center X = 1023.5):

| order | λ at chip center (Å) | m λ (Å) | λ/(dλ/dx) per 15 µm px |
|---|---|---|---|
| 69 | 5156.39 | 355,791 | 156,693 |
| 68 | 5232.20 | 355,790 | 156,764 |
| 67 | 5310.30 | 355,790 | 156,779 |
| 66 | 5390.76 | 355,790 | 156,891 |

Shifting the numbering by ±1 spreads m λ by 234 Å, so the order numbers come from the data and not just from the pipeline's hard-coded labels (DERIVED). These values agree with the research file to 0.15%.

**Two geometries fit the same dispersion.** The grating equation is m λ G = cos γ (sin α + sin β), and λ/(dλ/dx) = (sin α + sin β)/cos β × f/p. With f = 500 mm, the measured 156,780 per pixel requires (sin α + sin β)/cos β = 4.703.

| geometry | G (/mm) | α, β (deg) | cos α / cos β | geometric R: fiber-limited / 125 / 95 / 45 µm |
|---|---|---|---|---|
| preset, Littrow (EFFECTIVE) | 51.74 | 67.0, 67.0 | 1.00 | 18,150 / 18,860 / 24,820 / 52,390 |
| catalog 417E, in-plane, γ = 0 | 52.67 | 73.1, 66.5 | 0.730 | 24,790 / 25,770 / 33,900 / 71,570 |
| catalog 417E, γ = 2.8° (9° total opening) | 52.67 | 74.4, 66.5 | 0.709 | 25,530 / … |
| catalog 417E in Littrow | 52.67 | 69.6, 69.6 | 1.00 | gives 178,800 per px, 14% above the measured value |
| R2.0 at blaze (G set by order 69) | 50.28 | 59.8, 67.6 | 1.32 | 13,680 / 14,220 / 18,700 / 39,490 |

**Checks that separate the two geometries** (all DERIVED):

- **Vignetting.** M12 p. 5: "Due to the steep angle of incidence of the beam at this grating, about 7% of the light is vignetted at the top and bottom ends." For a uniformly filled 147 mm pupil centered on the grating, 7% loss requires α = 72.75° on a 420 mm grating, or 72.23° on the 408 mm ruled length. Results by geometry:
  - The preset's α = 67.0° makes a 376 mm footprint and vignettes 0%.
  - The catalog geometry (α = 73.1°) vignettes 8.1% (420 mm) or 9.9% (408 mm).
  - Taking α = 72.2–72.8° from the vignetting and combining it with the measured dispersion gives G = 52.56–52.63 /mm and β = 66.5–66.6°. That is an in-plane opening of 5.7–6.2° and cos α / cos β = 0.745–0.768, with no catalog input.
- **Figure geometry.** The figures independently give an in-plane opening of ≈ 6° with α > β (Section 2).
- **Blaze.** With 52.67 /mm and a 69° facet, the blaze peak in order 69 falls at 5129 Å, 27 Å (0.36 free spectral ranges) blueward of the MgWide chip center. B16 reports "a slight difference in the intended and manufactured echelle grating blaze", so the as-built facet angle is uncertain.

**B16's "R2.0".** The data exclude this label (DERIVED). The only 200 × 400 mm R2-class catalog echelle (31.6 /mm) cannot put Mg b in order 69. An R2.0 facet at 52.67 /mm (the 128 × 254 mm master) is too short for a 147 mm beam at 63°: the footprint would be 330 mm. An R2.0 geometry that matched the measured dispersion would need β > α, opposite to the figures, and would give a fiber-limited R ≈ 13,700, below every published value. The "R2.0" in B16 is most likely an error (INFERRED).

**Best-supported value.** 52.67 grooves/mm, Richardson R2.6 (69°) master 53-\*-417E (INFERRED from RGL14, M12 and BE03). Used at Mg b in order 69 with α ≈ 72.5–73.1° and β ≈ 66.5°, an in-plane quasi-Littrow opening of ≈ 6–6.6°, with α > β. The preset's 51.74 /mm at 66.99° is not a catalog density and holds only if the grating were in true Littrow.

### 4. The model's outputs vs the published values

Runs used the app's own `web/physics.js`, mapped as in `validate.js` (scripts in `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/m2fs_audit/`). The app's effective R adds slit, diffraction and pixel in quadrature and leaves out optical aberrations. M12 gives design rms spots of 8–12 µm, so all app values are upper limits.

| quantity | preset as is | catalog echelle, ψ = +6.57° (α > β) | published |
|---|---|---|---|
| α, β | 67.08°, 67.08° | 73.09°, 66.52° | 69° blaze (M12) |
| Å per pixel at the center | 0.03272 (5160 Å) | 0.03289 (5156.4 Å) | ≈ 0.0325 (W23 0.065 per 2 × 2 px); 0.03291 measured at 5156.4 Å (AJPID) |
| R, 180 µm (fiber-limited) | 18,080 | 24,480 | ≈ 18,000 (JI23, multi-order); single order with no slit stated: ≈ 18,000 (W15, W16, S21), ≈ 20,000 (S19), ≈ 24,000 (W23, P23) |
| R, 125 µm | 18,780 | 25,416 | 22,500 (J15), ≈ 28,000 (H16), ≈ 21,000 (L21, slit not stated) |
| R, 95 µm | 24,581 | 33,123 | ≈ 34,000 "measured from isolated Th or Ar emission lines" (R16); ≈ 32,000, MgWide, unbinned along the dispersion (J20) |
| R, 45 µm | 49,816 (3.0 px) | 65,053 (2.2 px geometric) | 40–60k, arc-line FWHM ≈ 3 px "subject to focus variations" (B16) |
| coverage on the chip | 5088–5222 Å | 5084–5219 Å | 5130–5190 Å used (W23); 5132–5186 (W15, W16); 5130–5192 (S19, S21) |
| order | 69 | 69 | 69 (DERIVED from m λ; JI23 for MgWide) |
| sampling | 8.66 px | 6.32 px | none published |
| trace spacing | 32.1 px, uniform | same | 18.1–20.3 px within a group; gaps of ≈ 207–227 px between groups (Section 5) |

**Ratio test, independent of the echelle model** (DERIVED). The fiber-limited line is 0.866 × 150 µm = 8.66 px and the 95 µm slit line is 6.33 px. The anamorphic factor multiplies both, and blur reduces the narrow-slit R more than the wide-slit R. Therefore R(95 µm)/R(180 µm) ≤ 8.66/6.33 = 1.37. The measured 32,000–34,000 at 95 µm (J20, R16) then requires R ≥ 23,400–24,800 at 180 µm. "180 µm → R ≈ 18,000" (JI23) cannot hold together with R16 and J20 under any echelle geometry. The 24,000 of W23/P23 can.

**Note on R16.** R16 adds "This corresponds to ≈ 6.3 pixels per resolution element". At the measured dispersion, 6.3 px would mean R ≈ 24,900 at 4530 Å, while 34,000 means 4.6 px. The 6.3 equals 95 µm / 15 µm exactly, so that sentence most likely quotes the nominal 1:1 projection (INFERRED). B16's "projects to approximately three pixels" is likewise 45 / 15.

The preset meets its scored R target only because the Littrow assumption sets the anamorphic factor to 1. With the catalog grating, the dispersion forces α > β, and the preset then reproduces W23/P23, R16 and J20, at the price of JI23's 18,000 and the "effective" 18,000–20,000 values.

### 5. Pseudo-slit and slits

- **Fibers and groups.** 128 per spectrograph in 8 tetrises of 16 (M12 p. 4: "Each shoe contains 8 tetrises, each tretris16 fibers" [sic]). The fibers lie "on a 300 µm pitch arranged along a 4.5 mm line segment" (15 × 300 µm = 4.5 mm, DERIVED). The tetrises sit on a faceted base that follows the collimator's curved image surface.
- **Pitch measured on the detector** (AJPID order-69 trace centers, R spectrograph, Nov 2017; DERIVED). By tetris 1 to 8: 20.28, 20.07, 19.95, 19.55, 19.28, 18.91, 18.45, 18.07 px, or 304 to 271 µm at 1:1. The research file quotes "19.6–20.3 px" from tetrises 1–4 only.
- **Gaps measured on the detector.** From fiber 16 of one tetris to fiber 1 of the next: 227, 221, 214, 211, 208, 208 and 207 px, ≈ 11 pitches, so ≈ 10 empty fiber positions per gap. Fiber 1 of tetris 1 to fiber 16 of tetris 8 spans 3813 px (57.2 mm of the 61.7 mm chip). B16 Fig. 1 caption: "The larger gaps in the image reflect spacing between adjacent bundles of fibers and are used to estimate the scattered light in the image."
- **Slits.** Each tetris carries its own slit assembly (M12 p. 5: "The tetrises have independent slit assemblies"), with six slits (B12 abstract: "any one of six slits"). The control software sets each of the 8 tetrises to position 1–7, "7=closed" (CTL `bin/shoeAgent.py`, master @ bae169e6503c). No source lists the six widths. Published widths are 180, 125, 95 and 45 µm. J15 quotes "180–45µm ... R=20,000–38,000, respectively (Mateo et al. 2012)", which is not in the M12 preprint (its Table 1 gives HiRes "18-34k"). R16: "spectral resolution varies by ≈ 7 per cent from one fiber tetris to another due to the alignment of the fiber tetrises with the slits."
- **Slit for R ≈ 18,000.** The 180 µm slit, in JI23's multi-order MgWide and BulgeGC1 setups.
- **Slit for R ≈ 24,000.** Not stated in any single-order Mg b paper (W15, W16, W23, P23, S19, S21). Under the catalog geometry, the fiber-limited 180 µm slit gives ≈ 24,500, so W23's value needs no narrower slit (INFERRED). Under the preset's geometry it needs ≈ 95 µm.

### 6. What a builder would object to on the page

The page with this preset (headless screenshot: `/private/tmp/claude-501/-Users-cconroy-memos/2c3f4bba-5bc0-400a-b287-224dc611d7a1/scratchpad/m2fs_audit/app_m2fs.png`) shows the following.

1. **Optical layout.** The telescope is drawn feeding a "slit 1.21″" directly in an f/3.40 cone, followed by separate collimator and camera lenses and a reflection echelle in Littrow at 67.1°. The drawing omits the fibers, the post-fiber slit, the filter, the fiber field lens, the fold mirror, the prism (double pass) and the CCD field lens. In grating mode the drawing cannot show a double pass, because `web/app.js` (line 534) sets `const dpass = ech && !!P.dpass;`. The real separation of the beams lies in the drawn plane: the fiber image sits ≈ 50 mm above the CCD, and the grating is lit at ≈ 73° and viewed at ≈ 66.5°.
2. **Telescope panel.** "f/3.40", "Focal length 22.1 m" and "Plate scale 9.33″/mm" read as properties of Magellan. Clay is f/11 (M12), and the fiber aperture is 1.2″ = 0.46 mm behind the corrector (≈ 2.6″/mm, DERIVED). The "virtual" convention is explained only in the preset file.
3. **Entrance panel.** "Slit width 1.21″" and "At the focus 130 µm wide" describe an equal-line-width equivalent. The physical entrance is a 150 µm core behind a 180 µm slit. "Spatial scale 0.140″/px" has no meaning for a fiber feed.
4. **Warning.** "orders 68 and 70 overlap: needs a filter" appears although the setup includes the filter. The real filter passes ≈ 60 Å of the ≈ 135 Å order on the chip. The readout "λ range 5088–5222 Å" is 2.2 times the used 5130–5190 Å. W23 Fig. 2: "signal outside this column range is contributed by light from adjacent orders and is not used".
5. **Disperser panel.** "Blaze angle δ 67.0°" and "Blaze efficiency at λc 99%" conflict with the published 69° blaze and B16's blaze mismatch. "Beam footprint 378 × 147 mm" conflicts with M12's ≈ 7% end vignetting on a 420 mm grating.
6. **Detector view.** 128 horizontal, evenly spaced traces lit across the full order. The real frame has eight groups of 16 at an 18–20 px pitch with ≈ 210 px gaps. The traces tilt by ≈ 50 px across the chip (the prism), light falls only within the filter band, and adjacent-order light appears at the chip ends ≈ 28 px (1.4 pitches) off each trace.
7. **Sampling.** "8.66 × 8.66 px" assumes a 1:1 square image. The fiber image is 10 px across the dispersion. Along the dispersion it is ≈ 6.3 px if the anamorphic factor is 0.73 (INFERRED).

**Fixes, if adopted.** Nothing was changed.

- State: `G: 52.67`, `lamB1: 2 * Math.sin(69 * Math.PI / 180) / 52.67 * 1e7` (354,502 Å), `psi: 6.6` (α > β), `lamC` 5160. This gives 0.0329 Å/px and Reff ≈ 24,500 at 180 µm.
- Note: replace the out-of-plane sentence with the M12 Figs. 3–4 and vignetting evidence. Add B16's "R2.0" conflict. Drop "most published".
- Pub: score R ≈ 24,000 (W23, P23). Keep 18,000 (JI23, W15, W16) as info with the ratio-test conflict. Make the Å-per-pixel line info (circular).
- Research files: correct the plane entry in `m2fs_ifum.md` and `m2fs_ifum.json`, the 18.1–20.3 px pitch range, and the definition of "31.3 px".
- Other presets: the IFUM preset shares the spectrograph. In LoRes first order at 600 /mm, a 6.6° in-plane opening changes the slit-image width by ≈ 2% (DERIVED), so IFUM is barely affected.

### Summary

**(a) Confirmed errors, with fix and source**

1. The camera–collimator angle lies in the echelle's dispersion plane, with α > β, and not across the dispersion. Source: M12 Fig. 3 (p. 6), Fig. 4 side and top views (p. 7), and the text "passing just below the injection optics" (p. 5). Fix: ψ ≈ +6–6.6°.
2. The grating is not in Littrow at 67°. M12's "about 7% of the light is vignetted" (p. 5) requires α ≈ 72.2–72.8°; the preset's 67° vignettes nothing. Fix: G = 52.67 /mm (RGL14 53-\*-417E; BE03), α ≈ 73°, β ≈ 66.5°.
3. The scored R ≈ 18,000 line splices JI23's multi-order 180 µm value onto the single-order setup. JI23's value is inconsistent with the 95 µm measurements (R16, J20) under any geometry, while W23/P23 report ≈ 24,000 for this setup. Fix: score 24,000; demote 18,000 to info.
4. The Å-per-pixel pub line is nearly circular (fitted on order 69 at 5156 Å). Fix: info.
5. Research files: the measured fiber pitch is 18.1–20.3 px, not 19.6–20.3 px (tetrises 5–8 omitted). "31.3 px average" is tetris pitch / 16; the mean interval is 30.0 px.

**(b) Unsupported claims**

- "the single-order setup at Mg b that most published M2FS work uses" (no census exists).
- "(the 180 µm slit ...)" for the single-order setup (no single-order paper states its slit).
- "no source states the plane" (M12's figures do).
- "with no groove density published", left without the B16 "R2.0" conflict or the catalog value.

**(c) Questions for the instrument builder**

1. Is the echelle Richardson 53-\*-417E, 52.67 /mm?
2. What is the as-built blaze angle, given B16's blaze mismatch?
3. At Mg b, what are the angles of incidence and diffraction on the echelle?
4. Does the 8–10° opening angle lie in the echelle's dispersion plane, and what exactly does the figure measure?
5. Is there an out-of-plane angle γ, and how large?
6. Which slit do the single-order Mg b programs use (W15, W16, W23, P23, S19)?
7. What arc-line FWHM, in pixels, does the 180 µm slit give at Mg b?
8. Was JI23's R ≈ 18,000 at 180 µm measured from arc lines?
9. What are the six slit widths?
10. What is the passband of the single-order Mg b filter?
11. At what angle of incidence does the prism sit, and how far is the prism from the echelle?
12. Why does the fiber pitch on the detector fall from 20.3 to 18.1 px across the pseudo-slit?
13. Is B16's "R2.0" an error?

**(d) New sources found** (all in `~/memos/instex/rawdata/presets/m2fs/` unless noted)

- `Richardson_Gratings_catalog_vogel.de_mirror_fetched2026-11-16.pdf`: Richardson Gratings catalog (2014), Table T3, PDF p. 19 (53-\*-417E, 52.67 /mm, 69°, 204 × 408 mm).
- `Johnson2020_omegaCen_M2FS_arXiv2004.09023.pdf`: Johnson, Dupree, Mateo, Bailey et al. 2020. MgWide, 95 µm, 1 × 2 binning, R ≈ 32,000 (p. 3).
- `Song2019_NGC419_NGC1846_M2FS_arXiv1909.02056.pdf`: single order 5130–5192 Å, "effective resolving power R ∼ 20,000"; a multi-order arm with 24 orders over 3700–5592 Å.
- `Song2021_MC_clusters_M2FS_arXiv2104.06882.pdf`: the same configuration, "a mean resolution of 18,000".
- `Lim2021_bulge_red_clump_M2FS_arXiv2012.03954.pdf`: Bulge_GC1, R ∼ 21,000.
- `github_baileyji_M2FS-Control_bae169e6503c_bin_shoeAgent.py`, `..._bin_slitController.py`, `..._conf_README`, `..._conf_m2fs_galilR.conf`: six slits plus a closed position per tetris, set independently.
- Already in the project and used here: `rawdata/presets/mike/Bernstein2003_SPIE4841_MIKE.pdf`, p. 4 ("R2.6 grating with 52.7 gr/mm and 69.0 deg blaze"; "The optical axes of the cameras are offset by about 30mm from the optical axes of the injection optics").
- Not obtainable: the Newport/MKS online echelle table (403), any LCO or University of Michigan M2FS manual (the LCO page has one sentence), and any later M2FS SPIE instrument paper with an open copy.


## Audit of the IFUM LSB preset (`ifumlsb`, web/presets.js lines 231-245)

Report only: no project file was edited. New downloads were saved as new files in `rawdata/presets/ifum/` (list in Section 6). Labels: quotes are verbatim with locations; INFERRED marks an interpretation; DERIVED marks arithmetic; MEASURED marks numbers read from a published figure or from pipeline data files.

Source keys: C25 (Crosby et al. 2025, arXiv:2412.02060), M22 (Mateo et al. 2022 SPIE 12184, ADS abstract only), M12 (Mateo et al. 2012 SPIE preprint), IFUSHOE (M2FS-Control shoe notes), SUM22 (new: "IFU-M Capabilities", CfA TAC file `IFUM_Summary_Feb2022.pdf`, created 2022-02-20, instrument-team slides), BAB (new: babnigg/IFU-M reduction pipeline, commit 3041d62), ACAD (new: academy-agents/ipdps26-ifum-academy, a Parsl port of BAB with test data, commit 801e565), CTL (new: M2FS-Control commit fd05e84).

### 1. Numbers and sentences in note, state and pub

| item in preset | verdict | evidence |
|---|---|---|
| "Mateo et al. 2022; Crosby et al. 2025" | OK | |
| "integral-field units that feed the M2FS spectrographs" | OK | M22: "fiber assemblies that feed a pair of fiber shoes that allow the fibers to be used with the twin spectrographs of M2FS" |
| "the configuration of the one refereed IFUM science paper" | partly misleading | C25 used two configurations. Table 3: 7 of 10 targets (2023) with the 80 um slit, 3 (2024) with 300 um. The preset models the minority one. C25 is still the only refereed IFUM paper found (searches 2026-11-16). |
| "360 hexagonal lenslets of 1.9″" | OK, with a definition caveat | C25 Sec. 3: "eﬀective diameter of 1.90′′ (this equals the diameter of a circle with the same area as the hexagonal elements". SUM22 p. 3 calls 1.90″ / 0.99 mm the "Spaxel Pitch". The field (17.0 x 16.3 mm for 18 x 20) gives a center spacing of 17.0/18 = 0.944 mm = 1.82″ and a row spacing of 16.3/20 = 0.815 mm = 0.866 x 0.941 (hexagonal packing); the equal-area diameter is 1.050 x 0.944 = 0.99 mm (DERIVED). So 1.90″ is the equal-area diameter and the center-to-center pitch is ~1.82″. |
| "a 32.7″ × 31.4″ field" | OK, now confirmed by the instrument team | C25 Table 2 and SUM22 p. 3 ("Field Dimension (mm) 17.0x16.3 ... (arcsec): 32.7x31.4"; "Field Area 1027"). The LCO / TAC26 "34x35" is the outlier; SUM22 p. 5 plots yet another design value ("IFU-M: 0.53, 1.05, 2.1" arcsec sampling). |
| "180 fibers per detector" | OK | C25 Sec. 3: "The two CCDs each image 180 of the ﬁbers". Missing context: C25 Fig. 1 caption: "The LSB ﬁbers are mounted in groups of 18 ﬁbers, 10 per spectrograph"; one lenslet row = one mount, rows numbered boustrophedon ("Note the zig-zag pattern of the ﬁber numbers"). |
| "lenslets image the telescope pupil onto 260 µm cores" | OK | C25 Sec. 3; M22 |
| "0.260 mm / (3.4 × 6.5 m) = 2.43″", "2.10″" | arithmetic OK | 2.4267″ and 0.866 x 2.4267 = 2.1016″ (DERIVED) |
| "the 300 µm slit, wider than the core" | OK | IFUSHOE: "SL 5. LSB on 300 um slit. 260um core, does not occult"; C25: "300-micron (full-open) slit". SUM22 (design, 2022) listed LSB slits "260, 175, 80"; as built (IFUSHOE, CTL `SLIT_NAMES`): L80, L180, L300. |
| "the fibers deliver f/3.3, and the spectrograph's f/3.4 is used" | OK in the note; WRONG in the file header | Header (line 45) says "M2FS and IFUM f/3.4 (pupil-fed fibers: f/3.4 is the fiber output ...)". For IFUM the fiber output is f/3.3 (M22: "becomes an f/3.3 output beam at the spectrographs"). |
| "500 mm lens group as collimator and camera, 147 mm beam, 1:1" | OK | M12 Table 4; C25 "1 : 1 magniﬁcation" |
| "the "blue" 600 l/mm reflection grating (blaze not published: set at λc)" | OK as stated | C25 Sec. 3. The UI then reports "Blaze efficiency at λc 100%", which has no source. |
| "e2v CCD 4096 × 4112 of 15 µm" | OK | C25 Sec. 3 (also "4096 × 4120" earlier in the same section) |
| "Central wavelength 5750 Å, the middle of 4800–6700 Å" | OK (DERIVED); grating tilt not published | |
| state: D 6.5, F 3.4, slitW 2.1015, nObj 180, W 147, fcam 500, G 600, m 1, Nx 4096, Ny 4112, pix 15 | OK per the file's conventions | lamB1 = 5750 is a placeholder (no source); psi = 0 is INFERRED (Section 5). The 1 x 2 binning of C25 is not represented. |
| pub "coverage 4800-6700 Å ... the published range is rounded and may exclude the chip's ends" | explanation weak; a better one exists | The spectral lines are strongly curved (Section 5, item 4). ACAD's wavelength solutions for the STD unit show the wavelength at a fixed column varying by 105-113 Å across the 276 fibers, so the range common to all fibers is 1896 Å of a 2009 Å single-fiber span (MEASURED). C25's 1900 Å is plausibly that common range (INFERRED). |
| pub "R ≈ 1000 with the 300 µm slit ... Crosby et al. 2025 (measured)" | "measured" UNSUPPORTED | C25 says only "delivered an eﬀective spectral resolution of 𝑅 ∼ 3600 and 𝑅 ∼ 1000"; no method, wavelength or line list. |
| pub "R ≈ 3600 with the 80 µm slit ... (measured); the geometric value ... is 2190" | "measured" UNSUPPORTED; 2190 OK (model Rs 2188, Reff 2150) | as above |
| pub "×1.3 here and ×1.6 with the 80 µm slit" | arithmetic OK | 1000/776 = 1.29, 3600/2188 = 1.65 |

Research notes (data/round6/m2fs_ifum.md, IFUM section):
- "the LSB pseudo-slit fills ~76% of the detector height (DERIVED, contiguous fibers)" is wrong in principle: cores cannot touch, and the cladding and buffer set the pitch. C25 Fig. 1 shows the 10 mounts filling ~97% of the panel height (MEASURED, Section 3); for the STD unit, ACAD's trace fits span 95.4% of 4112 px.
- The STD and HR fields "22 x 24" and "13 x 14" (LCO) are superseded by SUM22: 23.9 x 21.6″ (23 x 24 spaxels, 1.09″) and 13.9 x 14.2″ (27 x 32, 0.54″). The "LSB 1190/2.835 = 420 (360)" mismatch disappears with 1027 arcsec².
- "Fiber pitch NOT FOUND": still unpublished for LSB; partial evidence in Section 3.

### 2. The resolution puzzle

### 2.1 Facts that fix the geometry

- The dispersion is ~0.49 Å/px at 1:1, confirmed two independent ways. (i) C25 Fig. 1 (bottom left): the [O III] 4959-5007 separation (47.9 Å) spans 30-31 figure px and Hβ-4959 (97.6 Å) spans 62 px, so 1.55-1.6 Å per figure px; the 603-px panel then covers ~950 Å, "about half" of the 1900 Å band (MEASURED). (ii) ACAD's far-red STD wavelength solution: dλ/dx = 0.981 Å per 2x-binned px = 0.4905 Å/px at 8753 Å, 2009 Å per fiber (MEASURED; 600 l/mm in Littrow at 8753 Å gives 0.4824, DERIVED).
- The magnification is ~1 in both axes. M12: "Apart from the gratings and a small focus offset, the optical configurations of the HiRes and LoRes modes are identical". The quasi-Littrow opening angle is "~8-10 deg" (M12 Table 4); even split in the dispersion plane around the 9.9° Littrow angle, cos α / cos β = 0.97-1.03 (DERIVED). Moving the LoRes grating "about 180 mm closer to the fibers than the nominal telecentric surface" (M12) shifts the footprint with field angle and leaves the angles of a collimated beam unchanged. Anamorphic magnification, a different camera and the 180 mm offset are excluded.
- Binning: C25 used "1×2 pixel binning (spectral × spatial)", so the spectral axis is unbinned and binning cannot raise R.
- Near field: ACAD's flat-field trace fits for the STD unit (150 um cores) give a cross-dispersion Gaussian σ of 3.16 px, FWHM 7.45 px = 112 um (MEASURED). A uniformly lit 150 um core imaged at 1:1 gives a Gaussian-fit FWHM of 105-110 um (blur σ 0-18 um), an annulus with the Clay obstruction (ε = 0.29, data/telescopes/magellan.md) 113-117 um, and an underfilled 120 um pupil image 84-96 um (DERIVED). The output near field fills the core. The designed pupil image on an LSB fiber is 0.99 mm x 3.5/16.5 = 210 um (231 um if f/3.5 is set by the hexagon corners) inside the 260 um core (DERIVED from SUM22 "Input f-ratio (Barlow Lens) 16.5" and M22 "f/3.5"), but the STD evidence shows the fibers spread the light over the whole core. The pupil-image hypothesis is disfavored.

### 2.2 The 300 um (full-fiber) value: explained by the line-width definition

The app takes FWHM = 0.866 d for a round core (225 um for LSB). The IFUM pipeline (BAB, `ifum_utils.gauss` and `minimize_gauss_2d`) measures lines with Gaussian fits, and a least-squares Gaussian fitted to the projected-disk profile has FWHM ≈ 0.70 d (DERIVED: 182 um for 260 um). ACAD's STD far-red data test this directly (276 fibers, 9 lines, 2D Gaussian spot fits in `0722_blue_trace_fits.npz`, wavelength solution in `0722_blue_calib.npz`; parsed without numpy or pickle):

| line | λ (Å) | σ_x (2x-binned px) | Gaussian FWHM (um) | R measured | R in the app's convention (0.866 x 150 um) |
|---|---|---|---|---|---|
| 0 | 7820 | 1.61 | 114 | 2118 | 1851 |
| 3 | 8059 | 1.60 | 113 | 2187 | ~1900 |
| 8 | 8495 | 1.58 | 112 | 2322 | 1996 |

Eight of the nine lines give FWHM 111-120 um and R 2070-2340 (the line at 8363 Å is broader, probably a blend). The Gaussian-fit model of a full 150 um core with 30 um binned pixels predicts 106-108 um, and an 80 um slit 70-71 um (DERIVED), so these data are full-fiber spectra (INFERRED) and agree with the geometry once the definitions match. The measured R is 1.14-1.16 times the app's value for the same fiber.

For LSB with the 300 um slit in C25's band (Gaussian-fit FWHM 183 um, scaled by the measured/model excess of 1.03-1.09), R ≈ 900 at 5750 Å and 1040 at 6563 Å (DERIVED), which reproduces C25's "R ∼ 1000". The model's 776 follows from the FWHM convention; the physics agrees.

### 2.3 The 80 um value: not reproducible inside 4800-6700 Å

- A centered 80 um slit on a 260 um core passes a near top-hat: FWHM 79.6 um (direct) or 67-72 um (Gaussian fit). That gives R = 2150-2200 (direct) or 2400-2600 (Gaussian) at 5750 Å, and at most 2550 or 2850-3100 at 6700 Å (DERIVED). R = 3600 requires a FWHM of 48.6 um at 5750 Å or 57.6 um at 6700 Å, narrower than the slit.
- The ratio of C25's two values is 3.6, while a centered slit and a near field of at most 260 um give a width ratio of at most 2.8 (2.7 with Gaussian fits). No single magnification, dispersion or width definition fits both values.
- C25's pair scales exactly as the nominal slit widths: 1000 x 300 um = 3.0e5 and 3600 x 80 um = 2.9e5 (4% apart), although the 300 um slit does not set the line width (DERIVED). SUM22 p. 4 ("IFU-M: Features and Expected Performance") lists LSB LoRes "1000, 4000" for slits "260, 175, 80". The C25 numbers look like nominal values in the team's convention and not measurements of the 2023 data (INFERRED).
- The 80 um value does match the far red. With Gaussian-fit widths the 80 um slit gives R ≈ 3400-3700 at 8000-8500 Å (DERIVED), and the same convention puts SUM22's STD "2000" (150 um) at the far-red values that ACAD measures (2070-2340). The LoRes column of SUM22 is consistent with red-setting numbers (INFERRED).
- Slit misalignment is a weaker candidate. IFUSHOE, at the 5/15/2023 arrival two months after C25's March 2023 run: B shoe "SL4 LOW 100% LEFT & RIGHT", R shoe "slr4: too high ~50%", later "slr4: high l/r 50/20 um" (SL4 = "LSB on 80um slit"); also "gunk ... appeared on the 80um slit". An off-center slit narrows the line only when its edge reaches the edge of the fiber image (offset ≳ 100 um), which blocks ≥ 78% of the light (DERIVED). C25 reports "About 63% of the light ... was blocked"; a centered slit on a uniform 260 um core blocks 61.3%, and a 40 um offset 63.5% (DERIVED).

Verdict: the ×1.29 for the full fiber comes from the FWHM convention (Gaussian fits vs 0.866 d), supported by pipeline data. The ×1.64 for the 80 um slit has no physical explanation within C25's band; the evidence points to a nominal or red-setting value. Only the builder can confirm.

### 3. The IFU itself

| quantity | status | sources |
|---|---|---|
| LSB 360 lenslets, 18 x 20 | solid | M22, C25, SUM22, C25 Fig. 1 (18 per row, 20 rows); C25 Table 2 "20 × 18" is orientation only |
| spaxel 1.90″ | solid as an equal-area diameter; center pitch ~1.82″ (DERIVED) | C25 defines the term; SUM22 labels the same number "pitch" |
| 260 um cores, ~3.2 m long | solid | M22, C25, SUM22 |
| field 32.7 x 31.4″ (1027 arcsec²) | solid | C25, SUM22; "34x35" (LCO, TAC26) conflicts |
| 180 per detector, 10 mounts of 18, B = lower half, R = upper half | solid | C25 Sec. 3 and Fig. 1 caption |
| zig-zag | solid. Successive mounts reverse the fiber order, so the two fibers on either side of a mount boundary are sky neighbors | C25 Fig. 1 |
| pseudo-slit pitch | unpublished. C25 Fig. 1: 10 bands of ~58.5 figure rows with ~18 traces each, spanning rows 21-606 of a 602-row panel; if the panel shows the full chip height, the mean pitch is ≈ 21-22 px (315-330 um), with thin dark gaps between mounts (MEASURED, INFERRED). STD analog (ACAD): 13.85 px (208 um) within blocks, 31-35 px gaps after fibers 46, 92, 138, 184 and 230; 276 traces over 3923 px | |
| Barlow f/16.5 (LSB), f/18.0 (STD), f/30.0 (HR) | new, solid (design table) | SUM22 p. 3 |
| lenslets f/3.5 (marginal rays), fiber output f/3.3 | solid | M22 |
| designed pupil image 210-231 um on 260 um (~80-89%); STD 121-133 um on 150; HR 60-65 um on 75 | DERIVED | SUM22 + M22 |
| STD: 552, 150 um, 23 x 24, 1.09″, 23.9 x 21.6″, 12 mounts of 23 per side | solid | M22, SUM22, BAB (`mask_groups = 12`, `hex_dims = (23,24)`) |
| HR: 864, 75 um, 27 x 32, 0.54″, 13.9 x 14.2″, 16 mounts of 27 per side | solid | M22, SUM22, BAB (`mask_groups = 16`) |
| slits | as built: S80, S300, L180, L80, L300, H180 (H300 after Jan 2024) | CTL `SLIT_NAMES`; IFUSHOE. The SUM22 design list differs (LSB 260/175/80, STD 150/80, HR 75) |

### 4. The app's outputs for the preset (web/physics.js, state mapped as in validate.js `toP`)

Preset: coverage 4737.8-6751.3 Å (2013.5 Å, 6% above 1900); α = β = 9.93°; 0.4925 Å/px at 5750 Å (0.4950 at 4800, 0.4850 at 6700); line FWHM 225.3 um = 15.02 px = 7.41 Å (386 km s⁻¹); Rs 777 and Reff 776 at 5750 Å (648 at 4800, 885 at 6563, 904 at 6700); pixel term Rp 11,675; diffraction Rd 89,542; anamorphic factor 1.000; grating footprint 149 x 147 mm (M12 grating 165 x 220 mm); trace spacing 4112/180 = 22.84 px (343 um), trace FWHM 15 px, gap/FWHM 1.52; "spatial scale" 0.140″/px (virtual).
80 um slit: Rs 2188, Reff 2150 at 5750 Å (1795 at 4800, 2506 at 6700).
Variants (DERIVED): the f/3.3 core angle (2.50″) gives Reff 753; a 210 um near field 959; a 230 um near field 876.

### 5. What a builder would object to

1. The telescope panel shows Magellan as "f/3.40" with a 22.1 m focal length and 9.33″/mm, and the drawing shows that cone converging on a "slit 2.10″". The real path is f/11 Nasmyth, a Barlow to f/16.5, a hexagonal lenslet of 1.90″ (equal-area), and a pupil image on a 260 um core. The 2.10″ "slit" and the 2.43″ core angle exist only in the app's virtual convention.
2. The detector's vertical axis reads "Along the slit (″)" from -288″ to +288″, and the readout gives 0.140″/px. For a 33″ IFU that reformats the field, the coordinate along the pseudo-slit is the fiber number (one 1.90″ spaxel per trace, in zig-zag order).
3. The traces are spread evenly at 22.84 px. The real pseudo-slit holds 10 mounts of 18 per detector with gaps between mounts (C25 Fig. 1); the mean pitch is probably close to 22 px (Section 3).
4. The spectral lines are drawn straight and untilted. C25 Fig. 1 shows strongly curved lines: the authors' bracket around [O III] 5007 shifts by 50-90 figure px (80-145 Å) between the center and the ends of the pseudo-slit (MEASURED), and ACAD's STD wavelength solutions give 86-108 Å (≈ 175-220 unbinned px) between the central fiber and the end fibers at a fixed column. The classic curvature of a straight slit at 500 mm is ~16 Å with the opposite sign (DERIVED), so the shoe geometry must supply the curvature (a curved pseudo-slit; INFERRED; M12: the fiber ends "closely follow a curved arc along the spherical image surface").
5. Layout: the drawing shows two coincident lenses labeled "camera" and "collimator", a camera angle of 0°, and no fold. MSpec has an order-isolation filter or glass blank, a fiber field lens, an injection mirror ("The fold is required to avoid mechanical interference"), a CCD field lens that is also the dewar window, and a camera beam "passing just below the injection optics" (M12), which places the 8-10° opening out of the dispersion plane (INFERRED). The LoRes grating sits ~180 mm from the telecentric pupil.
6. "Blaze 5750 Å" and "Blaze efficiency at λc 100%" are placeholders presented as facts.
7. Convention for R: the app's 0.866 d FWHM gives R ~15% lower than the team's pipeline (Gaussian fits) for a full fiber.
8. The preset represents the 300 um configuration; most C25 targets used the 80 um slit, which the app shows only after the user edits the slit.

### 6. Files

New sources saved (all new files, `rawdata/presets/ifum/`):
- `cfa_tac_IFUM_Summary_Feb2022.pdf` (https://lweb.cfa.harvard.edu/files/tac/IFUM_Summary_Feb2022.pdf)
- `github_babnigg_IFU-M_3041d62_*`: README, notebook, seven .py files saved as .py.txt (https://github.com/babnigg/IFU-M)
- `github_academy-agents_ipdps26-ifum-academy_801e565_*`: README, config.py.txt, run.py.txt, tests_test_spectra.py.txt, three test .npz files (https://github.com/academy-agents/ipdps26-ifum-academy)
- `github_baileyji_M2FS-Control_fd05e84_*`: ifushoeAgent.py.txt, m2fs_galilB.conf, ifum_selector.conf, shoe notes 5.15.23 and 1.3.24

Not obtainable: the M22 full text (SPIE only; not on arXiv or NSF PAR) and Di Mille et al. 2024, SPIE 13098, 130980D, "Magellan instrumentation suite" (SPIE only). Two unrelated NSF PAR PDFs fetched during the search stay in the scratchpad (`dl1/`).

Scripts (scratchpad): `js/ifum_model.js` (app outputs); `lsf.py`, `lsf_core.py`, `lsf_run2.py`, `lsf_bin.py`, `lsf_std.py` (line-profile models); `npzread.py`, `traces.py`, `arcfit.py`, `smile.py` (pipeline data); `prof.py`, `bands.py`, `yellow.py` (C25 Fig. 1 measurements); `ifum_shot.png` (app screenshot).
