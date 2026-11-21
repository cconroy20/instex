# UVES bench layouts for the 3D view

Compiled 2026-11-21 to draw each UVES arm as built (IX_PLANS.uvesb and uvesr in web/presets.js). No published source gives element coordinates or a prescription for the table, so the layouts are MEASURED from two plan views and scaled by published dimensions. Labels: SOURCED (stated, quoted), MEASURED (read from a figure), DERIVED (arithmetic), INFERRED (a choice the sources do not fix).

## Sources

| key | document | local file |
|---|---|---|
| DEK | Dekker, H., et al. 2000, Proc. SPIE 4008, 534 (UVES design and performance): Fig. 4 (table layout, 500 mm bar), Fig. 8 (the white-pupil mounting), Tables 5–6 | `rawdata/presets/uves/Dekker2000_SPIE4008_534_UVES_ESA-PSA-copy.pdf`; clean text from `new_E3/Dekker2000_SPIE4008-61.ps.gz` |
| KOS | Kosmalski, J. 2020, "UVES optical design" (UVES 20th-anniversary talk, ESO), slide 17: a ray trace of the table; its embedded image 2 shows the whole blue arm and the red arm's collimators | `rawdata/presets/uves/new_E3/Kosmalski2020_UVES20_OpticalTalk.pdf` |
| UM | ESO UVES User Manual, issue 117 (Secs. 2.1–2.2, Fig. 2.2) | `rawdata/presets/uves/ESO_UVES_User_Manual_Issue117_VLT-MAN-ESO-13200-1825.pdf` |
| PIPE | UVES pipeline 6.6.1, `uves_physmod_utils.c` (`cdbeam[2] = {45.336, 46.0}`, red and blue) | `rawdata/presets/uves/uves-6.6.1_pipeline_src_uves_physmod_utils.c` |
| BR | Ballester, P., & Rosa, M. R. 1997, A&AS 126, 563, "Modeling echelle spectrographs", Sec. 3.2 (the UVES red arm) | `rawdata/presets/uves/new_E4/BallesterRosa1997_AAS126_563_echelle_models.pdf` |

## Published values

- Collimators: "two off-axis parabolas and two flat mirrors" per arm, with "two 200 mm pupils" (UM Sec. 2.2.2); "an a-focal system composed of two collimators of focal length F1 = F2 = 2.0 meters" (BR Sec. 3.2).
- Echelles: 214 × 840 × 125 mm, two 408 mm rulings 14 mm apart, mounted face down; off-plane angle 0.8° (DEK Sec. 4: "The UVES collimator design allows a small off-plane angle (0.8°)"; UM Sec. 2.1), each beam's: "the beam enters at αE = −75 degrees and γE = −0.8 degrees. The output axis is oriented at βE = −75 degrees, γE′ = 0.8 degrees" (BR Sec. 3.2).
- Path: "Below the slits, the light encounters a filter wheel, passes in front of the face-down echelle before hitting a 45 degree folding mirror, and is collimated by the main collimator mirror ... A flat folding mirror, which also acts as interorder stray light baffle, directs the light to the pupil transfer collimator that re-collimates the beam and provides a second pupil at the crossdisperser grating" (DEK Sec. 4).
- Cross-dispersers: CD#2 660 /mm (blue 390), CD#3 600 /mm (red 580) (DEK Table 5; UM Table 2.2). The camera stands 46.0° (blue) and 45.336° (red) from the beam arriving at the grating (PIPE, `cdbeam`); the model uses the same angles. BR Sec. 3.2 gives the red arm's "βCD − αCD = 45.0 degrees" (45.3° in its refined model), with αCD = −30.42° and βCD = 14.58° at 804.4 nm: the incidence is the larger angle, the setting the drawing uses.
- Cameras: DEK Table 6 gives both prescriptions (blue 7 lenses, f = 360 mm; red 8 lenses in 6 groups, f = 500 mm), each from a stop 70 mm (blue) and 83 mm (red) before the first lens. A paraxial trace of each prescription (DERIVED) brings the axial beam to focus at the image and the field corner to 22.7 mm (blue) and 43.7 mm (red), against the field half-diagonals of 22.6 and 43.8 mm, which confirms the transcription. The lens apertures drawn are the trace's marginal plus chief heights. The red camera's surface 2 radius, garbled in the OCR, is −1383.25 mm; the field flatteners' cylindrical back surfaces (R = −420 mm in one direction) are drawn flat.

## Blue arm (KOS image 2)

Scale: 2.94 mm per pixel, from the echelle blank's 214 mm width (73 px) and its 840 mm length seen at the 14° grazing angle (277 px for 815 mm). The image is a plan view of the table; the bench frame is the image turned 90° (no mirror).

| element | position (mm, from M1's focus) | label |
|---|---|---|
| M1's first zone | 206 mm off M1's axis (chief rays 5.9°) | MEASURED |
| echelle's center | 1982 mm from M1 | MEASURED |
| intermediate focus | 56 mm beside the virtual slit (2γf at γ = 0.8°), on the side away from the echelle | DERIVED; the side MEASURED |
| 45° fold | 370 mm from the virtual slit along the chief ray; the slit 370 mm beyond it, its beam passing under the echelle | MEASURED |
| flat | square to M1's axis, 85 mm past the intermediate focus | MEASURED |
| transfer collimator | the footprint centered 259 mm off M1's axis, its axis toward the cross-disperser (1.7° from M1's) | MEASURED |
| cross-disperser | (−306, 197) mm | MEASURED |
| camera | first vertex 231 mm past the cross-disperser | DERIVED: the CCD 886 mm from the cross-disperser (MEASURED), less Table 6's 655 mm |

## Red arm (DEK Fig. 4)

Scale: 1.953 mm per pixel of a 400 dpi render, from the 500 mm bar (its five 100 mm intervals); at this scale the echelle's housing is 840 mm long. The scan is coarse, so positions hold to ±25 mm. The bench frame is oriented as the figure (the echelle's beam above M1's axis).

| element | position | label |
|---|---|---|
| M1's first zone | 197 mm off M1's axis (chief rays 5.6°) | MEASURED |
| echelle's center | 2041 mm from M1 | MEASURED |
| 45° fold | 350 mm from the virtual slit; the slit beyond it on the echelle's side, under the pre-slit area | MEASURED |
| flat | square to M1's axis, 74 mm past the intermediate focus | MEASURED (the orientation INFERRED from the blue arm) |
| transfer collimator | footprint 227 mm off M1's axis | MEASURED |
| cross-disperser | (−369, −215) mm, in the turret | MEASURED |
| camera | first vertex 300 mm past the cross-disperser (the front of the barrel) | MEASURED |

The cross-dispersers' sizes are not published; each is drawn at the size that holds the beams (INFERRED).

## Checks (validate.js section 5, benchChecks)

- Blue: the transfer collimator's footprint lies 21 mm and the cross-disperser 3 mm from the figure's positions; the traced foci lie within 0.12 mm of the model's.
- Red: 46 mm and 25 mm from the figure's positions (a coarse scan); the traced foci lie within 0.17 mm of the model's.
- The camera lenses have positive edges and gaps at every rim (the red camera's two cemented pairs at zero).
- Over each order's free spectral range the bundles fill the mirrors to 88–97% of their half-apertures.
- Reported: the camera's axis lies 47.7° (blue) and −45.7° (red) from M1's axis with the pipeline's and Ballester & Rosa's angles; the figures show 45.3° and −40.8°. At the cameras' first lenses the bundles reach 124% (blue) and 128% (red) of the traced clear radius, because the drawing's second pupil sits at the cross-disperser, farther from the camera than the 70–83 mm stop of Table 6.

## Not drawn

The pre-slit optics (derotator, image slicers, filters, ADC), the exposure meters, the other arm, the turrets, the cryostats, and the refraction inside the cameras.
