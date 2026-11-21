# HARPS bench layout for the 3D view

Compiled 2026-11-21 to draw the HARPS spectrograph bench (IX_PLANS.harps in web/presets.js). No element coordinates and no camera prescription are published. The design paper (Pepe et al. 2000) draws the 2000 design, whose collimator, camera and grism changed before HARPS was built. The arrangement therefore follows the ray trace of HARPS3, "a design copy of HARPS-N", which copies HARPS as built, scaled by HARPS's own collimator; Pepe et al. 2000 confirm the arrangement and fix the orientation of the optical plane. Labels: SOURCED, MEASURED, DERIVED, INFERRED, SCHEMATIC.

## Sources

| key | document | local file |
|---|---|---|
| H3 | Thompson, S. J., et al. 2016, Proc. SPIE 9908 (arXiv:1608.04611), Fig. 2: "Ray trace of main spectrograph optical components (design copy of HARPS-N). The light is injected at (1). The large (770mm diameter) parabolic collimating mirror (2) is used in triple pass. (3) Echelle grating, (4) flat fold mirror, (5) grism (cross-disperser) and from element (6) until the final focus are the 6 lenses of the camera objective." | `rawdata/presets/harps/new_E3/Thompson2016_HARPS3_arXiv1608.04611.pdf` |
| UM | HARPS User Manual 2.4, Sec. 2.1 and Table 2.2 | `rawdata/presets/harps/HARPS-UserManual2.4.pdf` |
| P00 | Pepe, F., et al. 2000, Proc. SPIE 4008, 582, "HARPS: a new high-resolution spectrograph for the search of extrasolar planets": Sec. 4.1, Fig. 3 (the 2000 design's ray trace, an orthographic view of the optical plane and an oblique view), Table 1 | `rawdata/presets/harps/new_E4/Pepe2000_SPIE4008_582_HARPS.pdf` |

## Published values (UM)

- Collimator: "f=1560mm, used diameter 730mm, triple pass"; beam 208 mm (f/7.5 inside the spectrograph).
- Echelle: "R4, 31.6 gr/mm blaze angle 75°, mosaic 2x1 on Zerodur monolith 840 x 214 x 125mm", "quasi-Littrow conditions (off plane angle = 0.721 deg)". The model sets the echelle 0.26° from the symmetric setting (eTilt), and so does the drawing.
- Cross-disperser: "FK5 grism, 257.17 gr/mm blazed at 480nm, 240 x 230 x 50mm", at the white pupil. The apex, 14.5°, is the project's inference from the blaze.
- Camera: "all dioptric, 6 elements in 3 groups, f=728mm"; the dewar window "also serves as field lens".
- The fold: "an intermediate spectrum is focused at the flat-folding mirror. This spectrum is reflected back to the parabolic mirror for the third and last time, to collimate the beam for cross-dispersion by the grism" (H3 Sec. 2.1.2, of HARPS-N and HARPS3).

The optical plane is vertical: "The orientation of the optical plane is vertical, the echelle grating being mounted on the top side, and the grism and the camera on the bottom side of the bench. This configuration places the main dispersion horizontally" (P00 Sec. 4.1). The Side view therefore shows HARPS from the side, the echelle above. P00's 2000 design differs from HARPS as built: a 700 mm collimator of f = 1500 mm (built: 1560 mm), an off-plane angle ε = 1.5° (2γ), a grism of 240 /mm with a 13° apex (built: 257.17 /mm), and a camera of f = 760 mm at F/3.8 (built: 728 mm). P00's Fig. 3 shows the same arrangement as H3's figure turned 180°: the collimator at one end, the echelle on one side of its axis, the fibers and the fold between, the grism and the camera on the other side. In P00's orthographic view the collimator's two zones lie 183 and 234 mm off its axis (MEASURED, scaled by the 840 mm echelle), against H3's 244 and 191 mm; the drawing follows H3, the copy of the instrument as built.

## Layout (MEASURED from H3 Fig. 2)

The figure is a shaded render, nearly orthographic: its horizontal scale (3.48 mm per pixel, from HARPS's 1560 mm focal length between the collimator's face and the injection point (1)) and its vertical scale (3.50 mm per pixel, from HARPS-N's 770 mm collimator) agree to 1%. Positions hold to ±45 mm. The bench is drawn with the echelle above, as built, and seen from the side opposite the figure's: the collimator at the right.

| element | value | label |
|---|---|---|
| the fibers | at the collimator's focus (the injection point) | SOURCED (UM) |
| collimator's first zone | 244 mm off the axis (chief rays 8.9°) | MEASURED |
| echelle's center | 1539 mm from the collimator | MEASURED |
| flat fold | at the intermediate spectrum, 2γf = 39 mm beside the fibers, turned to send the light to the collimator's third zone, 191 mm on the other side of the axis | DERIVED; the zone MEASURED; the fold's size INFERRED |
| grism | at (0, 191) mm, entered square to the beam, the grating on the exit face; the apex's side INFERRED | MEASURED |
| camera | the first group 94 mm past the grism's entrance, the detector 929 mm; six lenses in three groups, the last the dewar window | MEASURED places; the lenses SCHEMATIC |

## Checks (validate.js section 5, benchChecks)

- The flat fold lies 32 mm and the grism 37 mm from the figure's positions.
- The traced foci lie within 0.20 mm of the model's.
- The schematic lenses have positive edges and clear one another (a check of the drawing, not of the camera).
- Over each order's free spectral range the bundles fill the collimator to 75% and the fold to 89% of their half-apertures.
- Reported: the camera's axis lies 179.5° from the collimator's (the figure: 180°). The detector lands 81 mm from the figure's position: the third pass leaves the collimator 1.4° off the axis, because the flat lies 2γf from the focus.

## Not drawn

The fiber link and the exposure meter, the vacuum vessel, the camera's true lens shapes, and the refraction inside the camera.
