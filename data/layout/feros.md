# FEROS bench layout for the 3D view

Compiled 2026-11-21 to draw the FEROS spectrograph bench as designed (IX.planLayout in web/physics.js, IX_PLANS.feros in web/presets.js). The source is the Final Design Report (Kaufer et al. 1997; `rawdata/presets/feros/ESO_FEROS_FinalDesignReport_Kaufer1997_fdr.ps.gz`), whose App. A prints the complete Zemax prescription (`Sys09.zmx`, 5 May 1997) with its coordinate breaks. Every pose below is DERIVED by chaining that prescription (the script is in the session scratchpad as `feros/zchain.js`; the method is given under Frame). The drawing is checked against the report's plan views: Fig. 3.1 (the Zemax plot, also Fig. 1.1 of the FEROS-II user manual) and Fig. 4.1 ("The FEROS complete system as seen from the top", with a 250 mm bar). Labels: SOURCED (stated, quoted), DERIVED (from the prescription), MEASURED (read from a figure).

## Frame

The prescription's global frame has z along the main collimator's axis, y in the table plane and x vertical: the slit optics, the echelle's γ, and the prism tilt about x, so these lie in the table plane, and the echelle's blaze tilts about y, so the echelle disperses perpendicular to the table. SOURCED, Sec. 4.1: "The optical axis of the spectrograph runs parallel to the optical table's surface in the whole instrument."

planLayout's bench frame puts the slit point (the end of the slit optics, surface 9) at the origin, x along +z, and z along +y (the main collimator's zone above the axis, as in the figures).

## Values

| element | value | label | source |
|---|---|---|---|
| slit optics | tilted 6.466° (surfaces 1 and 8); the slit 1500 mm from M1 | SOURCED | App. A |
| main collimator | paraboloid, R = −3000 mm (f = 1500 mm), conic −1; zone 170.3 mm off the axis on the first pass, 205.9 mm on the second | SOURCED | App. A, surfaces 10 and 16 |
| collimators | "segments of the same paraboloid with a focal length of 1500 mm and a diameter of 660 mm" | SOURCED | Sec. 3.4; Fig. 3.7 draws the main segment above the parent's center line and the transfer segment below, each 400 mm across the dispersion |
| echelle | 79 /mm, blaze 63.4°, γ = 0.6° about the vertical axis; 1700 mm from M1's vertex | SOURCED | App. A, surfaces 11–15; Sec. 3.6 |
| flat | square to the axis, 1400 mm from M1's vertex (100 mm before the intermediate focus), 240 × 15 mm | SOURCED | App. A, surface 17; Sec. 3.5 ("about 100 mm from the intermediate focus"); Fig. 3.8 |
| transfer collimator | the same paraboloid on M1's axis, vertex 200 mm behind M1's, zone 142.5 mm on the other side | DERIVED | App. A, surface 18 (1600 mm past the flat) |
| prism | LF5, 55°, faces 255 × 175 mm; entrance face at (375.0, −169.6) mm, normal 48.6° from the axis; exit face at (269.9, −210.2) mm, normal −6.4° | DERIVED | App. A, surfaces 19–22; Sec. 3.7 ("an apex angle of 55 deg working at minimum deviation") |
| camera | first vertex at (158.3, −307.4) mm, axis 221.1° (the beam turned 39.8° by the prism); 7 lenses in 5 groups; the CCD 4.5 mm behind the field lens, at (−297.8, −705.3) mm | DERIVED | App. A, surfaces 23–35 and IMA; Sec. 3.8 |

The camera radii are converted from the prescription's sign convention (light travelling toward −z, so a negative radius faces the light with its convex side) to planLayout's (R > 0 convex as seen from outside the lens): CaF2 +240.78/+622.69, PSK3 +4761.2/−139.29 cemented to FK54 +139.29/+1003.72, BK7 −313.54/+711.99, FK5 +196.00/+1020.83, LAK16A −135.64/flat cemented to the silica field lens (the dewar window; its toroidal back, cylindrical radius 230.92 mm, is drawn flat). The clear apertures are the prescription's maximum radii.

The figures agree with this layout. In the manual's Fig. 1.1 (2.72 mm per pixel from the 250 mm bar, MEASURED), the echelle's far edge lies 1836 mm from the main collimator, against 1843 mm in the layout; Fig. 4.1 and the side view of Kaufer & Pasquini 1998 (Fig. 1) show the transfer collimator beside the main one and farther from the slit, as the prescription places the transfer collimator.

## Model and drawing

The model enters the prism as an effective 56° (the as-built format, audit S7); the drawing traces the design's 55°. The model's reference wavelength, 4550 Å, lies off the blaze of order 50, so the drawn chip is centered where the model's origin lands (the echelle's blaze direction) and the camera axis is kept in the table plane, as mounted.

## Checks (validate.js section 5)

- M1's second zone lies 204.9 mm from the axis (surface 16: 205.9 mm).
- The transfer collimator's zone lies 3.4 mm from surface 18's aperture center.
- The camera's first vertex lies 0.3 mm, the axis 0.06°, and the CCD 0.9 mm from the prescription's.
- The traced foci lie within 0.76 mm of the model's; the cross-dispersion is up to 6.2% smaller, from the 55° prism against the model's 56°.
- The camera's lenses have positive edges (5.3 mm at the thinnest), and the gaps at the rims are positive except at the two cemented pairs, where they are zero.
- Over each order's free spectral range, the bundles fill the main collimator to 102% of its half-aperture, the flat to 99% and the transfer collimator to 98%.
- Reported, not scored: at the chip's long edges, the returning beam is widened by the echelle's factor cos β / cos α ≈ 1.14 and lies 250 mm past the white pupil at the prism's entrance, so the bundles reach 124% of the first lens's 77.5 mm radius in the prescription (108% of the 178 mm clear aperture that Kaufer & Pasquini 1998 give). The ideal trace vignettes there.

## Not drawn

The fiber-exit unit (the F/N relay and the image slicer), the turntable, the dewar, and the refraction inside the camera.
