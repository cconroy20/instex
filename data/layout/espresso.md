# ESPRESSO bench layout for the 3D view

Compiled 2026-11-21 to draw the ESPRESSO spectrograph bench (IX_PLANS.espressob and espressor in web/presets.js). Both presets draw one bench; each models the preset's arm and traces the other arm through that arm's cross-disperser. No element coordinates and no prescription are published. The arrangement is MEASURED from the plan of the 2012 design (Spanò et al. 2012, Fig. 2), with the element sizes and prism angles of the as-built opto-mechanics (Santana Tschudi et al. 2014, Table 1). Labels: SOURCED, MEASURED, DERIVED, INFERRED.

## Sources

| key | document | local file |
|---|---|---|
| SP12 | Spanò, P., et al. 2012, Proc. SPIE 8446, 84467V, "Optical design of the ESPRESSO spectrograph": Table 1, Secs. 2–2.7, Fig. 2 (the spectrograph's layout, labeled), Fig. 4 (the cross-dispersers), Fig. 5 (the cameras) | `rawdata/presets/espresso/new_E4/Spano2012_SPIE8446_84467V_ESPRESSO_optical_design.pdf` |
| ST14 | Santana Tschudi, S., et al. 2014, Proc. SPIE 9151, 915153 (the mounts): Table 1, Sec. 1.6, Figs. 1–2 | `rawdata/presets/espresso/SantanaTschudi2014_SPIE9151_915153_ESPRESSO_mounts_UTAustin-copy.pdf` |
| AR16 | Arns, J. A. 2016, Proc. SPIE 9908, 990861 (the VPH grisms), abstract only | `rawdata/presets/espresso/ADS_API_abstract_2016SPIE.9908E..61A.json` |

## Published values

- Main collimator: "A large off-axis parabolic mirror acts as main collimator, used in double-pass" (SP12 Sec. 2); "Parabola R:6000; Off Axis:420 mm", 700 × 380 × 70 mm (ST14). Each pupil slice is a 300 × 200 mm beam at F/10 × F/15: "Main collimator will create a 300x200 mm beam onto the echelle" (SP12 Sec. 2 and Table 1).
- Echelle: "R4, 31.6 l/mm, 204x1250 mm2, 1x3 mosaic" (SP12 Table 1).
- Dichroic: "a flat dichroic mirror located after the main collimator and before the intermediate focal plane, in a long focal ratio converging beam", with "operation at 8.5 deg AOI" and 11.5° at most (SP12 Sec. 2.4). The as-built plate is 460 × 90 × 27 mm, with a rear face of R = 11,660 mm (ST14). The blue is reflected (380–525 nm) and the red transmitted.
- Field optics: a field lens in the blue arm (R1 −1176, R2 −689 mm, 290 × 55 × 33 mm) and a field mirror in the red (R = 12,580 mm, 380 × 60 × 50 mm), each "very near the intermediate focal plane" (SP12 Sec. 2.5; ST14).
- Transfer mirrors: spheres of R = 3000 mm (f = 1500 mm, the model's wpT), 320 × 165 × 50 mm (blue) and 430 × 170 × 50 mm (red); "Both collimator mirrors share the same size and curvature" (SP12 Sec. 2.5; ST14).
- Cross-dispersers: "grisms based onto slanted volume-phase holographic (VPH) gratings, coupled to entrance prisms" of 1500 /mm (blue) and 800 /mm (red) (SP12 Sec. 2.6), with "1.5X anamorphism" (SP12 Table 1). The as-built prisms are fused silica, of 22.20° and 25.25° (ST14); SP12 names FK5 or FSL5Y for the 2012 design. AR16 gives "a dispersion of 0.88 degrees/nm at the central wavelength of 438 nm" (blue) and "0.47 degrees/nm at 654.8 nm" (red), with "a single input prism to enhance the dispersion".
- Cameras: five singlets each, the last the dewar window (SP12 Sec. 2.7, Fig. 5); the blue camera 400 mm, the model's 800 mm effective camera on the 2:1 transferred beam.
- Orientation: the optical plane is neither horizontal nor vertical, and "all components are tilted" (ST14 Sec. 1.6); ST14 Fig. 2 shows the cameras on top. The Side view shows the optical plane with the cameras up, seen from the side opposite SP12 Fig. 2 (the collimator at the right).

## Layout (MEASURED from SP12 Fig. 2)

The figure was rendered at 300 dpi and measured at 2.176 mm per pixel, the scale that puts the collimator's face 2986 mm (f less the sag at the zone) from the slit. At this scale the echelle's width measures 200 mm (204 mm published), the collimator 407 mm across (380 mm in ST14), and the collimator's center 420 mm off the axis (ST14: 420 mm). Positions hold to ±15 mm. Coordinates are in mm, x along the collimator's axis from the slit and z across the bench.

| element | value | label |
|---|---|---|
| slit | the pupil slicer's image plane, at the collimator's focus | SOURCED |
| collimator's first zone | 335 mm off the axis (chief rays 6.39°) | MEASURED |
| echelle's center | 3025 mm from the collimator's vertex | MEASURED |
| off-plane angle | γ = 1.15°: the red intermediate focus 120 mm (2γf) beside the slit, on the side of the zones; the echelle box drawn tilted by ≈1° | MEASURED |
| dichroic | at (692, −194), where the returning chief ray crosses the plate; 7.8° of incidence in the figure's plane (SP12's text gives 8.5°) | MEASURED |
| field mirror | at (48, −120), the red focus | MEASURED |
| field lens | at (1458, −72) | MEASURED |
| red transfer mirror | face at (1593, 185) | MEASURED |
| blue transfer mirror | face at (2894, 159) | MEASURED |
| red cross-disperser | entrance at (920, 185) | MEASURED |
| blue cross-disperser | entrance at (2226, 178) | MEASURED |
| first lenses | 57 mm (red) and 67 mm (blue) past the grisms' exit faces | MEASURED |

At this scale the transfer mirrors lie 1575 mm (red) and 1454 mm (blue) from the field mirror and the field lens, while their focal length is 1500 mm. The drawing keeps the focal length and puts each transfer mirror 1500 mm from the intermediate focus that the mirror collimates; the faces then land 1 mm and 9 mm from the figure's.

## Cross-dispersers

No grism prescription is published. The drawing uses the published line densities on the as-built prisms, with the VPH at the Bragg angle for the central wavelength (the rays leave the fringes at the angle they meet the fringes; INFERRED) and the prism turned to widen the beam. The beam then meets the prism's entrance face at 58°, and the grism widens the beam 1.6 times, close to the stated 1.5×. Traced through the drawn grisms, the dispersion is 0.0883°/nm at 438 nm (blue) and 0.0466°/nm at 654.8 nm (red). These are AR16's 0.88 and 0.47 with the decimal point moved one place to the left; the printed values are ten times too large for the detector format (data/round5/espresso.md).

With these grisms the beam turns 56.2° (blue) and 48.1° (red). SP12 Fig. 2, drawn with the 2012 FK5 prisms, shows 47° and 41°. With a 22.2° fused-silica prism and 1500 /mm, no setting turns the blue beam less than 53°, so the as-built prisms cannot reproduce the figure's angles. The drawing follows the as-built numbers, and the cameras stand 9° (blue) and 7° (red) steeper than in the figure.

## Cameras

SP12 Fig. 5 draws both cameras: BK7HT, F2HT, BK7HT, BK7HT and fused silica in each, with the red camera's first two lenses close together. The center thicknesses, the air spaces and the diameters were MEASURED from a 300 dpi render, and the radii DERIVED from the sags, R = (h² + s²)/(2s). Fig. 5 has no scale, so each camera is scaled by the distance from the first lens's center to the detector in Fig. 2 (672 mm blue, 644 mm red). The lens shapes serve the drawing; the trace uses an ideal 400 mm lens.

## Model and drawing

- Off-plane angle: the model keeps γ = 0, so that the model's lines stand upright, as measured (Schmidt et al. 2021); the bench is drawn with the figure's 1.15°. ESPRESSO turns the slit to cancel the line tilt (SP12 Sec. 2.3: "the slit rotation to compensate for line tilt onto the detectors"), so the measured upright lines do not bound γ. The model's blaze wavelengths are kept as the reference, and the bench's γ does not shift the format on the chip.
- Beam: the model enters the two slices as one 600 mm beam (W × F = 3000 mm); the bench draws one 300 × 200 mm slice.
- Cross-disperser: the model's equivalent VPH carries half the angular dispersion of the published grism, because the real grism sits in the beam halved by the 2:1 transfer: 757 and 407 /mm, from AR16 read as above (data/round5/espresso.md). The drawn grisms spread the orders 1.9% (blue) and 0.4% (red) farther than the model. The audit of 2026-11-16 had fitted 789 and 432 /mm to the manual's order ranges. With 757 and 407 /mm the chip also holds one order at each edge (blue 116 and 162, red 77 and 118), which the dichroic and the band limits leave dark.
- Order curvature: at the chip's ends the bench curves each order ≈3 mm more than the model. The 2:1 transfer doubles the angles along the dispersion at the cross-disperser, and the grating's off-plane term grows as the square of those angles. The model's single equivalent grating sees the echelle's angles.

## Checks (validate.js section 5, benchChecks)

- The transfer mirrors lie 1 mm (red) and 9 mm (blue) from the figure's positions, and the intermediate focus 121 mm from the slit (the figure: 120 mm).
- After fitting the spread across the orders and one order curvature, the traced foci agree with the model's to 1.44 mm (blue) and 1.08 mm (red). The tolerance is 1.5 mm, since the curvature grows with the wavelength and one term cannot follow that growth; the blue residual is largest at the chip's corner, in order 162. Unfitted, the foci differ by up to 5.5 and 3.8 mm.
- The camera lenses have positive edges and clear one another.
- Over each order's free spectral range, the bundles fill the collimator to 86–87% and the dichroic to 60–85% of their half-apertures.
- Reported: the transfer mirrors fill to 109% (blue) and 105% (red) along the dispersion at the reddest order. The power of the field optics, which turns the chief rays toward the white pupil, is not traced.
- Reported: the first lenses lie 21 mm (blue) and 25 mm (red) from the figure's, the detectors 138 and 114 mm (the cameras' axes turned as above).

## Not drawn

The pupil slicer and the fiber link, the second slice, the vacuum vessel, the power of the field optics and of the dichroic's rear face, the transfer mirrors' spherical figure (drawn as paraboloids of f = 1500 mm), and the refraction inside the cameras.
