# DEIMOS in-plane optical layout: tent mirror, grating and camera

Compiled 2026-11-16 to place the tent mirror in the instex spectrograph schematic. The documents are saved under `rawdata/presets/deimos/` (gitignored). Each value carries one of three labels:

- **SOURCED**: stated in a document; the quote is given.
- **MEASURED**: read from the vector geometry of a UCO/Lick CAD drawing. The drawings are vector PDFs, so line endpoints were extracted with PyMuPDF and converted to inches using a dimension printed on the same drawing (scripts and plots in `rawdata/presets/deimos/measurements/`).
- **COMPUTED**: ray trace or arithmetic from SOURCED values (`measurements/omodel.py`, `measurements/geom.py`, a re-implementation of the DEEP2 DEIMOS optical model).

Quotes from the 1994 PDR HTML lose the degree sign; "[°]" marks where one was restored.

## Coordinates

The frame is the one used by the DEEP2 optical model and the UCO/Lick drawings. z runs along the DEIMOS rotation axis, which coincides with the Keck optical axis at the Nasmyth focus, and increases from the focal surface toward the collimator. The origin is Datum A, the tooling ball at the focal-surface vertex on the axis (PDR App C: "At the center of this curved focal plane where it intersects the instrument's rotation axis will be a 0.75" diameter tooling ball. ... All distances will be measured relative to this front reference ball."). y lies in the dispersion plane and increases outboard toward side A, the side that holds the slitmask, the real tent mirror and the camera. The side view of `keck_deimos_layout2.png` (= Faber et al. 2003, Fig. 2) is this y–z plane, with +y up.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| D3605 | UCO/Lick drawing D3605 rev G, "Keck/DEIMOS Tent Mirror Assembly" (rev E, 8/23/00: "ADD DIMENSIONS, REF. PART"); vector PDF | `ucolick_deimos_drawing_D3605G_tent_mirror_assembly.pdf` | https://loen.ucolick.org/Deimos/PDFs/D3605G.pdf |
| D0001 | UCO/Lick drawing D0001 rev R, "Keck/DEIMOS Top Assembly"; vector PDF | `ucolick_deimos_drawing_D0001R_top_assembly.pdf` | https://loen.ucolick.org/Deimos/D0001R.pdf |
| D5150 | UCO/Lick drawing D5150 rev K, "Keck/DEIMOS Camera Mount Assembly" | `ucolick_deimos_drawing_D5150K_camera_mount.pdf` | https://loen.ucolick.org/Deimos/PDFs/D5150K.pdf |
| D4100 | UCO/Lick drawing D4100 rev AN, "Grating Slide Assembly Layout, Do Not Scale" (consulted; no optical positions used) | `ucolick_deimos_drawing_D4100AN_grating_slide_layout.pdf` | https://loen.ucolick.org/Deimos/PDFs/D4100AN.pdf |
| DMM | UCO/Lick "DEIMOS Mechanical Manual" (links to the drawings) | `ucolick_deimos_mechanical_manual.html` | https://loen.ucolick.org/Deimos/mechanical_manual.htm |
| DEEP2 | DEEP2 spec2d DEIMOS optical model, IDL (Phillips; IDL version J. Newman 2001): `sysinit.pro`, `setup.pro`, `pre_grating.pro`, `coll_angle.pro`, `mask_to_proj.pro`, `deimos.h`, `instrument.h`, `initdeimos.pro` | `deep2_spec2d_optical_model/` | https://github.com/profxj/xidl/tree/master/DEEP2/spec2d/pro/model |
| PYP | PypeIt port of the same model, class `DEIMOSOpticalModel` (`keck_deimos.py`, `opticalmodel.py`) | `deep2_spec2d_optical_model/pypeit_*.py.txt` | https://github.com/pypeit/PypeIt/blob/release/pypeit/spectrographs/keck_deimos.py |
| PHIL | A. C. Phillips, "Phillips' DEIMOS Reference Material" (last modified 11 Jul 2003) | `ucolick_phillips_deimos_reference.html` | https://www.ucolick.org/~phillips/deimos_ref/ |
| GI95 | S. M. Faber, "DEIMOS Grating Data" (Nov 2, 1995; Keck web page) | `keck_deimos_grating-info.html` | https://www2.keck.hawaii.edu/inst/deimos/grating-info.html |
| PDR2 | DEIMOS PDR (1994), Ch. 2 "Optical Design, Materials, Fabrication and Testing" | `ucolick_deimos_PDR_1994_ch2_optical_design.html` | https://loen.ucolick.org/Deimos/PDR/PDR_ch2.html |
| PDRC | DEIMOS PDR (1994), App. C, J. Osborne, "Collimating DEIMOS" | `ucolick_deimos_PDR_1994_appC_collimating.html` | https://loen.ucolick.org/Deimos/PDR/Appendix_C.html |
| CDR | DEIMOS Critical Design Review (Nov 17, 1995) | `ucolick_deimos_CDR_1995.html` | https://www.ucolick.org/~loen/Deimos/Documents/CDR.html |
| F03 | Faber, S. M., et al. 2003, Proc. SPIE 4841, 1657, "The DEIMOS spectrograph for the Keck II Telescope: integration and testing" (eScholarship copy) | `faber2003_spie4841_deimos_integration_testing.pdf` | https://escholarship.org/uc/item/84m7z4h6 |
| KTM | Keck, DEIMOS tent mirror removal and install procedures (March 2005) | `keck_deimos_tent_mirror_removal_procedure.html`, `keck_deimos_tent_mirror_install_procedure.html` | https://www2.keck.hawaii.edu/inst/deimos/tent_mirror_removal_procedure.html |
| KOV | Keck, "DEIMOS Mechanical Overview" | `keck_deimos_overview.html` | https://www2.keck.hawaii.edu/inst/deimos/overview.html |

Also saved: `keck_deimos_layout2.png` (the schematic) and `ucolick_deimos_PDR_1994_fig1.3_layout_D0300A.gif` (the 1994 double-beam concept drawing). Neither carries a scale.

## Values

### Tent mirror angle, size and position

| quantity | value | label | source, location | quote or method |
|---|---|---|---|---|
| tent mirror normal, angle from the z axis | 71.5° nominal; 71.0° in the fitted model | SOURCED | DEEP2 `sysinit.pro`; PYP `keck_deimos.py` l. 1763 | `'TNT_ANG',!dtor*double(71.5+t2)` with default `t2 = -0.5`; `instrument.h`: "TNT_ANG ... # tent mirror angle"; PYP: `self.tent_theta = np.radians(71.5-0.5)  # Tent mirror theta angle (sys.TNT_ANG)` |
| tent mirror azimuth | 90° (+0.081° fit): the normal lies in the y–z plane | SOURCED | DEEP2 `sysinit.pro`, `instrument.h` | `'TNT_PHI',!dtor*(90.+p2)`, `p2 = 0.0810`; "TNT_PHI ... # tent mirror rotation about z". In `setup.pro` these give the normal (0, sin 71.5°, cos 71.5°): toward +y and toward the collimator |
| reflecting face, inclination to the axis | 18.50° (real mirror), 18.47° (dummy) | MEASURED | D3605 side view | endpoints of the face lines; 90° − 71.5° = 18.5° agrees with the model to 0.01° |
| reflecting plane meets the axis (tent "ridge") | z = 23.000 in = 584.2 mm | SOURCED | D3605 side view, rev E dimension | "23.000" from Datum A to the fiducial; the extended face line passes through this fiducial (MEASURED, to 0.02 in) |
| ridge to collimator fiducial | 63.093 in = 1602.6 mm | SOURCED | D3605 side view | "63.093 TO FIDUCAL ON COLLIMATOR MIRROR" [sic] |
| real–dummy gap at the ridge | 0.250 in | SOURCED | D3605; PDRC §5.0 | dimension "0.250"; PDRC: "There will be a nominal 1/4" gap between them." |
| shape | a wedge: 2-in plate whose rear 5.9 in is beveled so the back face runs parallel to the axis | MEASURED + SOURCED | D3605; KTM; CDR §5.10.1 | KTM: "apply extremely gentle upward presure to the thin edge of the wedge-shaped optic"; "the glued-on block at the thick edge of the tent mirror wedge". CDR: "The front edge comes to a wedge to accommodate an opposing mirror" |
| face length, thin edge to thick end | 15.28 in = 388 mm; the face starts 0.77 in from the ridge point | MEASURED | D3605 side view | thin edge at z = 22.27 in, y = 0.25 in; thick end at z = 7.78 in, y = 5.10 in |
| thickness | 2.00 in | MEASURED + SOURCED | D3605; CDR §5.10.1 | thick-end segment 2.001 in; CDR: "The mirror has been made thick enough (2 inches)" |
| width (along x, the ridge direction) | 17.80 in at the ridge end, 9.80 in at the thick end (chamfered corners) | MEASURED | D3605 end view | outline segments; a 1.48-in gap on the axis matches CDR's "1-1/2 inch diameter hole ... around the DEIMOS axis" |
| 1994 design size | 18 in × 16 in × 2 in, 18° bevel | SOURCED | PDR2 §2.5 | "They are simple flat mirrors 18-in wide, 16-in long, and 2-in thick, made of Zerodur. There is an 18[°] bevel at one end to form the Vee." |
| tilt axis and actuator | rotation in the y–z plane moves the image along the dispersion | SOURCED | KOV; F03 p. 1664 | KOV: "flexures that allow for rotation about this axis for flexure control in the dispersion direction. Rotation is controlled by a piezo actuator at the telescope end of the mirror." F03: "a piezo-electric Y-actuator that tilts the tent mirror and moves the image along the spectral direction" |

### Distances and positions

| quantity | value | label | source, location | quote or method |
|---|---|---|---|---|
| focal surface (Datum A) to collimator vertex | 2197.1 mm = 86.50 in | SOURCED | DEEP2 `sysinit.pro`; PDRC §4.0 | "coll_zdst - Collimator Z-location (mm; default 2197.1)"; PDRC: "The distance from the slit ball and this ball will be 86.5" center-to-center." |
| same, from D3605 | 23.000 + 63.093 = 86.093 in | SOURCED (sum) | D3605 | 0.41 in short of 86.50 in; the drawing does not say where the collimator fiducial sits |
| telescope exit pupil to focal surface | 20018.4 mm | SOURCED | DEEP2 `deimos.h` | "PPLDIST 20018.4D0 # Distance to Telescope Exit Pupil (mm) (REF)" |
| grating and imaging flat sit at the collimator's pupil image | — | SOURCED | PDRC §6.2 | "This mirror is at the exit pupil formed by the collimator mirror." |
| pupil image, unfolded | 2443 mm from the collimator along the 4.5′ chief ray (z = −241.5 mm on the axis) | COMPUTED | DEEP2 model | chief rays from 3.1′ to 8.0′ cross the axis within 1 mm of z = −241.5 mm |
| grating center (pupil image folded by the tent) | y = +497 mm (19.57 in), z = −75 mm (2.96 in in front of the focal surface) | COMPUTED | from the rows above | mirror image of (y = 0, z = −241.5 mm) in the tent plane; independent of field point |
| camera axis | y = 19.57 in at z = −2.96 in; tilted 2.36° outboard going rearward | MEASURED | D0001 side view (scale from the drawing's "36.000" dimension, 1.493 pt/in) | midline of the camera barrel lines. The camera axis passes within 1 mm of the computed grating center; the measurement precision is ≈ 5 mm |
| camera first-element front vertex | z = 8.80 in, y = 20.05 in | MEASURED | D0001 side view | same scale; element 1 spans y = 14.0–26.4 in, consistent with the 11.64-in clear diameter in PDR2 §2.2.4 |
| grating center to camera first element | 299 mm (11.8 in) along the camera axis | MEASURED + COMPUTED | D0001 and the grating center above | |

D0001 is drawn close to 1/4 in = 1 ft (1.493 PDF points per drawing inch). With the scale set by the "36.000" dimension, the tent apex falls 22.86 in behind Datum A, within 0.14 in of the 23.000 in on D3605, and the slitmask form spans y = 5.0–15 in, bracketing the mask limits below.

### Fold plane, camera side and dispersion plane

| quantity | value | label | source, location | quote or method |
|---|---|---|---|---|
| grating angle convention | tilt measured in the y–z plane, + outboard | SOURCED | PHIL, "Encoder Counts vs Grating Tilts" | "grating angle (defined as the angle between grating normal and the Z-axis or rotation axis of DEIMOS, with increasing angle as the grating normal moves outboard, or +Y)" |
| imaging flat (slider 2) normal | −19.423° (tilted inboard) | SOURCED | PHIL, "Optical Model" table (2003 Mar 05) | "Mirror/2 - 0. 0. -19.423" |
| camera tilt | 2.33° nominal mechanical; 2.752° in the fitted model; azimuth 90° (y–z plane) | SOURCED | D5150 Sec. B-B and Sec. A-A; DEEP2 `instrument.h`, `sysinit.pro` | D5150: "2.33°, NOM."; "NOTE: IN THIS VIEW LENS HAS BEEN ROTATED 2.33° UP TO FLAT-ON." `instrument.h`: "CAM_ANG ... # camera angle (2.33 deg)"; `sysinit.pro`: "cam_angle - Camera angle (nom. 2.33) (deg)", default `2.752`, "cam_phi - Camera phi (nom. 90)" |
| camera tilt direction | outboard (+y) going rearward | MEASURED + SOURCED | D0001; DEEP2 `setup.pro` | barrel lines rise 2.36° toward the rear; `setup.pro` gives the camera axis (0, +sin, +cos) of the camera angle |
| camera–collimator ("spectrograph") angle | 44.451° | SOURCED | GI95, Notes | "Spectrograph angle is 44.451 deg, and imaging position is displaced by 0.472-in." and "Spectrograph angle of 44.51 degrees [sic] corresponds to middle of detector on the optical axis of the camera on the one hand and 4.5 arc min off axis from the center of the telescope FOV on the other." |
| check of the angle | 44.43° | COMPUTED | DEEP2 model | tent 71.5°, camera 2.33°, chief ray from 4.5′: the beam reaches the grating traveling 42.10° outboard of −z, the camera axis points 2.33° outboard of +z, and 42.10° + 2.33° = 44.43° |

The fold, the grating dispersion and the camera tilt all lie in the y–z plane, which is the plane of the `layout2.png` side view. The camera sits on the +y side of the axis, the same side as the slitmask and the reflecting face of the real tent mirror. Over the length of the camera (z < 0.85 m), the slit-to-collimator beam occupies y ≈ 135–390 mm (COMPUTED) and the camera y ≈ 356–671 mm (MEASURED, D0001), so in the `layout2.png` orientation the camera lies just above the incoming beam and well above the collimated beam. The camera body sets the outer edge of the field (PDR2 §2.6: "At the outer edge of the focal plane, there is a second slow cutoff due to the other edge of the tent mirror, plus a sharp cutoff of entering beams caused by the camera body and grating slide."). The grating sits outboard of the outer edge of the slitmask and 75 mm in front of the focal surface. The slit length runs along x, perpendicular to the page.

### Off-axis field and collimator geometry

| quantity | value | label | source, location | quote or method |
|---|---|---|---|---|
| collimator | rotationally symmetric conic on the instrument axis, with a central hole for the alignment sight line | SOURCED | PDRC §1.0, §4.0; PDR2 §2.3, §2.8 | "The final instrument will be concentric with its own rotation axis."; "the mechanical design allows one to sight through a hole from behind the center of the collimator mirror, through the middle of the focal plane" |
| field off the axis | collimator field radius 9.4° from the vertex | SOURCED | PDR2 §2.3 | "it must work over a field of view of radius 9.4[°] as seen from the vertex of the collimator"; "Traditional off-axis collimators do not offer this level of performance." |
| nominal field center | 4.5′ (GI95, 1995); 5′ (PDR 1994) | SOURCED | GI95 Notes; PDR2 §2.9; PDRC §7.0 | GI95: "The latter point is the nominal field field [sic] center for each DEIMOS beam." PDR2: "The instrument's "on axis" image is actually located some 5' off axis in the telescope's field of view." PDRC: "We will define the 5 arc-minute radius as the center of the FOV." |
| slitmask limits across the dispersion | 186.8″ to 479.6″ from the telescope axis (3.1′–8.0′; 135–348 mm) | SOURCED | PHIL, "Mask Design Limits" | "Y-limits: 186.8 to 479.6 (arcsec)" |
| plate scale | 0.7253 mm per arcsec | SOURCED | DEEP2 `initdeimos.pro` | `defsysv,'!MM_ARCS',0.7253` |
| mask zero point | 128.803 mm (5.071 in) from the telescope axis; mask tilt 6° | SOURCED | DEEP2 `deimos.h` | "ZPT_YM 128.803 # Dist to tel.axis, in SMCS-XXX (mm) 5.071in"; "M_ANGLE 6.00D0 # Mask angle (tilt) in degrees" |
| field-center chief ray at the collimator | 217.4 mm from the vertex (4.5′); 241.5 mm (5′) | COMPUTED | DEEP2 `coll_angle.pro` | |
| collimated chief ray, angle to the axis | 5.10° (4.5′), converging toward the axis on the way to the tent; 3.5° at 3.1′, 9.1° at 8.0′ | COMPUTED | DEEP2 `pre_grating.pro` | |

### Fold geometry by field point (COMPUTED)

Chief rays traced through the DEEP2 model with the nominal tent angle (71.5°), with the tent plane placed through z = 584.2 mm on the axis (D3605). "Up the face" is the distance along the face from the ridge point; the physical face runs from 0.77 to 16.05 in.

| field point (arcmin) | collimator → tent (mm) | tent → grating (mm) | collimator → grating (mm) | fold position (fraction) | fold (deflection) | tent hit, up the face | beam to grating, from −z |
|---|---|---|---|---|---|---|---|
| 3.1 (mask inner edge) | 1742 | 698 | 2440 | 0.714 | 44.1° | 5.3 in | 40.5° |
| 4.5 (1995 nominal center) | 1789 | 654 | 2443 | 0.732 | 47.2° | 7.2 in | 42.1° |
| 5.0 (1994 nominal center) | 1804 | 640 | 2444 | 0.738 | 48.3° | 7.8 in | 42.7° |
| 5.55 (mask midpoint) | 1821 | 625 | 2445 | 0.744 | 49.6° | 8.5 in | 43.3° |
| 8.0 (mask outer edge) | 1886 | 567 | 2453 | 0.769 | 55.1° | 11.1 in | 46.1° |

The deflection equals twice the grazing angle, 2 × (18.5° + beam angle to the axis). With the fitted tent angle (71.0°) each fold grows by 1.0°. At 4.5′ the 6.33-in beam spans 15.8 in along the face, from 0.7 in beyond the ridge to 15.1 in up the face, comparable to the 15.3-in face; PDR2 §2.6 describes vignetting by the tent edges at the inner edge of the field.

## Recommended drawing values

For the field-center chief ray at 4.5′, which is the point the 44.451° design angle refers to:

| drawing parameter | value | basis |
|---|---|---|
| tent face inclination to the instrument axis | 18.5° | SOURCED (DEEP2 TNT_ANG 71.5°); MEASURED (D3605) |
| collimated beam, angle to the axis | 5.1°, converging toward the axis | COMPUTED |
| fold angle (beam deflection at the tent) | 47° | COMPUTED from the two rows above |
| fold position, fraction of the collimator-to-grating path | 0.73 | COMPUTED |
| collimator-to-grating path | 2443 mm (collimator → tent 1789 mm, tent → grating 654 mm) | COMPUTED from SOURCED COL_DST, PPLDIST, tent plane and the pupil-image statement; cross-checked against the camera axis in D0001 |
| slit to collimator | 2197 mm | SOURCED |
| camera–collimator angle at the grating | 44.45° | SOURCED (GI95) |
| camera axis | 2.33° from the instrument axis, tilted outboard going rearward | SOURCED (D5150, DEEP2 nominal) |
| grating to camera first element | 300 mm | MEASURED (D0001) |
| camera side | outboard (+y): the slitmask side of the axis, beyond the slit-to-collimator beam (above both beams in `layout2.png`) | SOURCED convention (PHIL, DEEP2) + MEASURED (D0001, D3605) |

The estimates read by eye from `layout2.png` (fold 54°, position 0.68, path 2.7 m) differ from these values; that figure is not to scale. If the schematic draws the collimated beam parallel to the axis, an 18.5° tent produces a 37° fold; tilting the returning beam 5.1° toward the axis recovers the 47° fold at the field center.

## Not found

- No text gives the tent-to-grating or grating-to-camera distance, or the grating position. The tent-to-grating distance and grating position above are COMPUTED, and the grating-to-camera distance is MEASURED.
- Drawing D0123, which D0001 note 2 names as the optical layout ("SEE D0123 FOR CURRENT OPTICAL LAYOUT"), is not on the mechanical-manual site; the PDF directory is not listable and `D0123.pdf` and `D0123A.pdf` through `D0123T.pdf` returned nothing.
- No Zemax or Code V prescription of the spectrograph layout was found. The Epps camera report (PDR App. B) and the Sutin collimator and slitmask report (CDR appendix) are not online; the CDR HTML's Appendix section is empty.
- The location of the "fiducial on collimator mirror" in D3605 is not stated, so the 0.41-in difference between 23.000 + 63.093 in and the 86.50-in collimator distance is unresolved.
- A dashed line drawn above the real mirror in D3605, at 20.8° to the axis, carries no label; the angle matches no ray direction in the model.
- F03 Fig. 2 (identical to `layout2.png`) has no scale and was not measured. Newman et al. 2013 (DEEP2 survey paper) was not consulted; the DEEP2 optical-model code from the same team supersedes the paper's instrument summary for geometry.
- The fold angle and fold fraction depend on which field point defines the center: 4.5′ (GI95), 5′ (PDR) or 5.55′ (midpoint of the mask limits).
