# G-CLEF bench layout for the 3D view

Compiled 2026-11-21 to draw G-CLEF's spectrograph bench as designed (IX.planLayout in web/physics.js, IX_PLANS.gclef in web/presets.js, app.js build3dPlan). The G-CLEF team judged the schematic 3D drawing against the published optical-component layout (Leung et al. 2024, Fig. 2), which shows the same arrangement as the Zemax plans of Ben-Ami et al. 2016 (Fig. 1) and 2018 (Fig. 9). Each value has one of four labels:

- **SOURCED**: stated in a paper; the quote is given.
- **MEASURED**: read from the 2016 Fig. 1, rendered at 400 dpi (PDF page 2), at 1.28 mm per pixel.
- **DERIVED**: arithmetic from SOURCED and MEASURED values.
- **INFERRED**: a choice the sources do not fix, made to reproduce the figure.

## Sources

| key | document | local file |
|---|---|---|
| GC16D | Ben-Ami, S., et al. 2016, Proc. SPIE 9908, 9908A0, "The optical design of the G-CLEF Spectrograph" (Secs. 2.2–2.3, Fig. 1, Tables 5–8) | `rawdata/presets/gclef/gclef_cfa_2016SPIE.9908A0.pdf` |
| GC18D | Ben-Ami, S., et al. 2018, Proc. SPIE 10702, 107029K (Fig. 9, the same plan with dimensions) | `rawdata/presets/gclef/gclef_cfa_2018SPIE.107029K.pdf` |
| GC24 | Leung, M. C. H., et al. 2024, arXiv:2407.20344, Fig. 2 (the optical-component layout, a CAD rendering; also Fig. 7 of the 2023 EPRV5 poster) | `rawdata/presets/gclef/arXiv2407.20344_GCLEF_red_camera_Hartmann_2024.pdf` |

## Frame

planLayout's frame is the plane of the 2016 Fig. 1. The origin is M1's focus, where the fiber images sit; x runs along M1's axis toward M1 (the vertex at x = 2400 mm); z lies in the bench plane, positive toward the transferred beam (up in the figure); y runs across the bench, along the echelle's dispersion. The 3D Side snap shows this plane from −y, as in the figure.

## Measurement

The echelle's width, 306 mm (SOURCED, GC16D Sec. 2.2: "a 306×1200 mm mosaic"), spans 239 pixels, giving 1.28 mm per pixel. M1's axis lies at pixel row 755: the collimated beam to the echelle is centered at row 1001, and the 7.5° chief rays place that center 2 f tan(3.75°) = 315 mm (246 pixels) below the axis (DERIVED). M1's face at row 1000 lies at column 2550, which puts the vertex at column 2558 and the focus at column 683. As a check, the echelle's center (column 520) then falls at x = −209 mm, against the published −200 mm (the midplane 2600 mm from the vertex).

## Values

| element | value | label | source |
|---|---|---|---|
| fiber images | at M1's focus | SOURCED | GC16D Sec. 2.2: "The fiber end images are located on the optical axis of the collimator at its focus, 2400mm away from the surface vertex point." |
| chief rays | 7.5° from M1's axis | SOURCED | GC16D Sec. 2.2: "The chief rays are aimed at a 7.5-degree tilt with respect to the optical axis of the parabolic mirror M1." |
| M1 | paraboloid, R = 4800 mm, clear aperture 500 × 760 mm | SOURCED | GC16D Table 5 |
| echelle | midplane 2600 mm from M1's vertex; blaze 75.96°; γ = 0.75° in the plane of Fig. 1 | SOURCED | GC16D Sec. 2.2: "The location of the grating mid-plane is 2600mm away from the collimator vertex point. The grating face is tilted at 75.96°, and a true Littrow condition is slightly compromised by a 0.75° γ angle (a small clockwise rotation of the grating in the plane of Fig, 1)." |
| echelle size | 306 × 1258 mm, three facets | SOURCED | GC18D Fig. 9 ("306×1258mm"); three facets in Szentgyorgyi et al. 2016, Fig. 11. The 2016 text's 1200 mm is shorter than the 300 mm beam's 1237 mm footprint (DERIVED) |
| returning focus | 2γ f = 63 mm from the fiber, toward the grating | DERIVED | GC16D Sec. 2.2: "the refocused beam clears the slit converging to a point in-between the fiber input and the grating" |
| Mangin mirror | 40 mm before the intermediate focus; 50 × 380 mm, 25 mm thick | SOURCED | GC16D Sec. 2.2 ("intercepts the beams reflected from M1 40mm before arriving at an intermediate focus"), Table 6. The drawn box's center (pixel 722, 811) lies 20 mm from the computed position |
| M2 | R = 3200 mm (f = 1600 mm), conic −0.97, clear aperture 250 × 500 mm | SOURCED | GC16D Table 5; drawn as the paraboloid of its focal length |
| M2 face | (1655, +133) mm | MEASURED | face center at pixel (1976, 651); the computed face lies 13 mm away |
| dichroic | 15° to the transferred beam; 255 × 330 mm, 30 mm thick | SOURCED | GC16D Sec. 2.2 |
| dichroic place | (553, +173) mm | MEASURED | the plate's outline spans pixels 1083–1160 by 515–725 |
| red VPH | 480 /mm at 7300 Å, fringes tilted 3.25°, between two 20 mm plates | SOURCED | GC16D Sec. 2.2 |
| red VPH place | center 365 mm past the dichroic's center | MEASURED | pixel (837, 596); the text gives "375mm after the Dichroic back surface". The plate stands 16.7° from the figure's vertical (MEASURED); the symmetric setting at 7300 Å, turned by the fringe tilt, gives 15.9° (DERIVED) |
| red camera | 7 lenses, f = 450 mm | SOURCED | GC16D Table 7 |
| red camera place | first vertex 85 mm past the VPH's center | DERIVED | the detector MEASURED at pixel (195, 365), (−625, +499) mm, 873 mm from the VPH, less the prescription's 788 mm |
| blue grism | VPH 950 /mm, m = −1 at 4386 Å, between fused-silica prisms of 32.42° and 15.87°; 350 mm from the dichroic | SOURCED | GC16D Sec. 2.2 |
| blue grism orientation | VPH plane 3.87° from square to the beam, entrance face 36.29°, exit face −12.00° | INFERRED | solved so that 4386 Å passes undeviated, as the figure's blue camera continues the reflected beam; the light then meets the VPH at 8.6° inside the glass, near the 8.2° Bragg angle. The prisms' thicknesses (115 and 57 mm at the center) and extent are INFERRED |
| blue camera | 8 lenses, f = 450 mm | SOURCED | GC16D Table 8 |
| blue camera place | first vertex 573 mm from the dichroic | DERIVED | the detector MEASURED at pixel (1992, 102), (1676, +836) mm, 1304 mm from the dichroic, less the prescription's 731 mm |
| detectors | 95.04 × 95.04 mm (STA) or 92.4 × 92.2 mm (e2v) | SOURCED | GC16D Sec. 3: "The blue/red echellogram is imaged onto a 95.04×95.04mm (92.4×92.2mm) STA (e2V) monolithic detector"; drawn at the preset's e2v size |

The camera tables mark each radius Cx (convex) or Cc (concave). Read as seen from outside the lens, the prescriptions give each lens a positive edge (11.4 mm at the thinnest) and a positive gap at each rim (2.8 mm at the smallest); the red camera then has the expected sequence of a negative first element, CaF2 positives, flint negatives and a negative field flattener.

## Checks (validate.js section 5)

- The returning focus lies 62.7 mm from the fiber, toward the grating (2γ f = 62.9 mm).
- M2's computed face lies 13 mm, the Mangin mirror 20 mm, and the red and blue detectors 29 and 37 mm from their places in Fig. 1, on a 3.5 m bench.
- planLayout's trace of the red arm lands within 1.5 mm of the model's foci over 156 points on the 92.3 mm chip; the remaining difference comes from the VPH's fringe tilt, which the model leaves out.
- The blue orders 114–175 span −46.8 to +43.2 mm across the chip. Order 114's 5400 Å end lies 0.7 mm past the e2v chip's edge, at the dichroic's 540 nm transition, and inside the 95.04 mm STA format.
- Over each order's free spectral range, the bundles fill M1 to 87% of the half-aperture, the Mangin mirror to 88%, M2 to 101%, the dichroic to 96%, and the cameras' first lenses to 96% (red) and 91% (blue). At the chip's edges, beyond the free spectral range, the echelle's beam-width factor cos β / cos α (0.7 to 1.27 over an order) makes the returning beam 219 to 382 mm tall and would overfill M2 by 13%.

## Not drawn

The exposure meters, the cryostats, the fiber-feed hardware, the Mangin mirror's wedge (2.75°), tilt (1.375°) and cylindrical power, M2's conic, and the refraction inside the cameras.
