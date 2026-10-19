# Imaging preset: TESS (one of the four identical cameras, modeled as a refractor) -- sourced parameters

Compiled 2026-10-19 for the instex IMAGER mode, in the format of `data/imaging/megacam_ztf_small.md`. Every number comes from a document saved unmodified under `rawdata/imaging/tess/`; each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). Quotes were machine-checked by script against the extracted text of the saved files (pdftotext -layout and -raw per page; tag-stripped HTML; the tess-point .py source as text; the FITS headers as 80-character cards), after normalising Unicode (NFKC), quotes, dashes, mu, the multiplication sign, line-end hyphens and the degree glyphs (the ring U+25E6 of the arXiv text layer and the Symbol-font private-use U+F0B0 of the Chrisp et al. text layers); ' ... ' joins non-adjacent pieces. 'PDF p.' is the page index of the saved PDF (slide number for the slide decks). Values marked IMAGE were read from figures and could not be machine-checked. Coordinates: x = along a row of chips (2 per row) = across the 24-deg width of the four-camera strip; y = between the two rows = along the 96-deg strip.

## Summary

- **TESS camera (refractor, direct):** D = 0.105 m (entrance pupil), eps = 0, F = 1.3905 DERIVED (146 mm / 105 mm; published f/1.4), f = 146.0 mm (in flight 145.95-146.04 mm); seven-element hybrid Petzval with two aspheric surfaces, long-pass coating on lens 2 (600-1000 nm, centred on I_C); 24 x 24 deg unvignetted (34 deg diagonal); 4 x MIT/LL CCID-80, 2048 x 2048 imaging px of 15 um, rows [2, 2] centred, gaps 1.74 mm (116 px, 40.9') within a row and 1.58 mm (106 px, 37.3') between rows (DERIVED from the in-flight CCD positions; published ~1.5 mm / 2 mm / 36'-41'); 21.19"/px on axis (published 21" = 0.35'), 16,777,216 px; PSF 50% EE in 1 px, 90% in 4 x 4 px.
- **Distortion (DERIVED from the in-flight radial fit, WCS-checked):** pincushion; radial pixel scale 21.20"/px on axis -> 19.55" at the edge midpoints (12 deg) -> 17.86" at the corners (16.6 deg); tangential 20.49" / 19.81"; a corner pixel covers 21% less sky. The explorer's linear scale will give 24.79 x 24.73 deg and 581 deg^2 of CCD where the sky spans 24.17 x 24.09 deg and 538 deg^2.
- **Four-camera array:** 1 x 4 strip, 24 x 96 deg = 2300 deg^2, boresights at -36, -12, +12, +36 deg from the spacecraft +Z axis, < 10' between camera fields on the centreline; 67.1 Mpx.

## Explorer preset (machine-readable copy of `tess.preset` in tess.json)

```json
{
 "mode": "direct",
 "tel": "refr",
 "telescope_type": "refractor: one TESS camera lens (seven-element f/1.4 hybrid Petzval, two aspheric surfaces) with the four-CCD mosaic at its focus; no mirrors, no central obstruction",
 "D_m": 0.105,
 "eps": 0.0,
 "F": 1.3905,
 "F_published": 1.4,
 "f_eff_mm": 146.0,
 "f_eff_inflight_mm": [
  145.948,
  145.99,
  146.007,
  146.04
 ],
 "field_circle_deg": 35.2,
 "field_circle_arcmin": 2110,
 "field_circle_note": "published: 24 x 24 deg unvignetted, 34 deg diagonal (C15). In the explorer's linear plate scale (1412.8\"/mm) the mosaic corners sit at 35.02 deg diagonal, so 35.2 deg (2110') just encloses the CCDs; the real (distorted) corners are at 33.3 deg",
 "band": "I",
 "bandpass_nm": [
  600,
  1000
 ],
 "chip": {
  "Nx": 2048,
  "Ny": 2048,
  "pitch_um": 15.0,
  "model": "MIT/LL CCID-80 (frame transfer; frame-store area masked, excluded here)"
 },
 "n_chips": 4,
 "rows": [
  2,
  2
 ],
 "gapX_mm": 1.74,
 "gapY_mm": 1.58,
 "gap_within_row": {
  "mm": 1.74,
  "px": 116,
  "arcmin": 40.9,
  "range_mm": [
   1.72,
   1.76
  ],
  "basis": "DERIVED: mean of the 8 within-row gaps of the four cameras in the in-flight focal-plane geometry (TP)"
 },
 "gap_between_rows": {
  "mm": 1.58,
  "px": 106,
  "arcmin": 37.3,
  "range_mm": [
   1.54,
   1.64
  ],
  "basis": "DERIVED: mean of the 8 between-row gaps (TP)"
 },
 "axes": "x = along a row of 2 chips = across the 24-deg width of the four-camera strip; y = between the 2 rows = along the 96-deg strip (DERIVED from the TP camera Euler angles). The optical axis falls in the cross-shaped gap at the centre of the mosaic.",
 "distortion": {
  "model": "radial: r = f tan(theta) (c1 + c2 tan^2 + c3 tan^4 + c4 tan^6 + c5 tan^8), fitted in flight (TP); pincushion relative to the distortion-free (gnomonic) mapping",
  "r_vs_ftan_percent": {
   "edge_12deg": 1.17,
   "corner_16.6deg": 2.56
  },
  "radial_scale_arcsec_per_px": {
   "centre": 21.2,
   "edge_12.04deg": 19.55,
   "corner_16.59deg": 17.86
  },
  "tangential_scale_arcsec_per_px": {
   "centre": 21.2,
   "edge_12.04deg": 20.49,
   "corner_16.59deg": 19.81
  },
  "pixel_solid_angle_arcsec2": {
   "centre": 449.4,
   "edge": 400.6,
   "corner": 353.8
  },
  "check": "SPOC WCS of Sector 1 camera 1 CCD 1 at its reference pixel (~CCD centre, 8.9 deg off axis): 20.54-20.55\"/px; TP model there 20.57\"/px (geometric mean of 20.32 radial and 20.82 tangential)"
 },
 "psf": {
  "published_ee": "50% within 15 x 15 um (1 px), 90% within 60 x 60 um (4 x 4 px) (R15 Table 1); predicted on orbit in one 15 um pixel: 55% at (0,0), 23% at (11,0), 18% at (11,11) deg (P16)",
  "gaussian_equivalent_fwhm_px": {
   "from_50pc_in_1px": 1.12,
   "from_90pc_in_4x4px": 2.42
  },
  "note": "aberration-limited; diffraction (1.22 lambda/D = 1.9\" at 786.5 nm) is negligible against 21\" pixels, so psf 'diff' would make the image far too sharp. The PSF grows from compact on axis to chevrons beyond ~6 deg (IH 7.6)"
 },
 "validate": {
  "pixel_scale_arcsec": 21.19,
  "pixel_scale_published": "21\" (0.35'); 21.19 DERIVED from 146 mm (in flight 21.186-21.199)",
  "fov_published_deg": [
   24,
   24
  ],
  "fov_linear_model_deg": [
   24.79,
   24.73
  ],
  "fov_inflight_model_deg": [
   24.17,
   24.09
  ],
  "area_active_deg2": {
   "linear_model": 581.4,
   "inflight_model": 538.0
  },
  "area_enclosing_deg2": {
   "nominal_24x24": 576,
   "inflight_model": 569
  },
  "n_pixels": 16777216,
  "four_camera_strip": "24 x 96 deg = 2300 deg^2 (R15); 4 x 16,777,216 = 67,108,864 px"
 },
 "array": {
  "n_cameras": 4,
  "layout": "1 x 4 strip, 24 x 96 deg",
  "boresight_offsets_deg": [
   -36,
   -12,
   12,
   36
  ],
  "camera_gap_arcmin": "< 10 along the camera centrelines, ~10' more at the corners (distortion)"
 },
 "pub_suggested": [
  {
   "what": "pixel scale 21″/px (0.35′)",
   "q": "pixScale",
   "value": 21.0,
   "tol": 0.01,
   "src": "Ricker+15 Table 1 (0.35 arcmin per pixel); HEASARC '21 arcseconds'; the model gives 21.19 from f = 146 mm"
  },
  {
   "what": "16.8 Mpix (4 × 2048 × 2048)",
   "q": "npix",
   "value": 16777216,
   "tol": 1e-06,
   "src": "CCID-80 imaging format (Ricker+15, Instrument Handbook)"
  },
  {
   "what": "field 24° across (nominal)",
   "q": "fieldX",
   "value": 1440,
   "info": true,
   "src": "Ricker+15; the linear model gives 24.79° (no distortion); the in-flight distorted mapping 24.17°"
  },
  {
   "what": "field 24° along the strip (nominal)",
   "q": "fieldY",
   "value": 1440,
   "info": true,
   "src": "Ricker+15; the linear model gives 24.73°; in-flight mapping 24.09°"
  },
  {
   "what": "CCD area 538 deg² (in-flight mapping, DERIVED)",
   "q": "area",
   "value": 538,
   "info": true,
   "src": "tess-point geometry (tess.md); the linear model gives 581.4 deg² because it has no distortion"
  },
  {
   "what": "étendue 4.99 m² deg² (86.6 cm² × 576 deg², DERIVED)",
   "q": "etendue",
   "value": 4.99,
   "info": true,
   "src": "nominal 24 × 24 field; no published étendue"
  }
 ],
 "flags": "F = 146/105 DERIVED (published f/1.4); gaps DERIVED from the in-flight geometry fit (published: ~1.5 mm, 2 mm, 63.482 mm array); distortion DERIVED from the fitted radial polynomial; field circle chosen for the linear model"
}
```

## Sources

| key | document | local file | URL |
|---|---|---|---|
| R15 | Ricker, G. R., Winn, J. N., Vanderspek, R., et al. 2015, JATIS 1, 014003, "Transiting Exoplanet Survey Satellite" (arXiv:1406.0151v3, 28 Oct 2014, the accepted version; arXiv title "The Transiting Exoplanet Survey Satellite"). Sec. 4 = payload, Table 1 = lens characteristics. The text layer renders the degree sign as a ring glyph ("24◦") | `rawdata/imaging/tess/Ricker2015_JATIS1_014003_TESS_arXiv1406.0151.pdf` | https://arxiv.org/pdf/1406.0151 |
| IH | Vanderspek, R., Doty, J. P., Fausnaugh, M., Villaseñor, J. N. S., Jenkins, J. M., Berta-Thompson, Z. K., Burke, C. J., Ricker, G. R., "TESS Instrument Handbook", Version 0.1 (Draft of 6 December 2018), MIT Kavli Institute; hosted at MAST. Printed page numbers differ from the PDF page index; loc gives the section and the PDF page index | `rawdata/imaging/tess/TESS_Instrument_Handbook_v0.1.pdf` | https://archive.stsci.edu/files/live/sites/mast/files/home/missions-and-data/active-missions/tess/_documents/TESS_Instrument_Handbook_v0.1.pdf |
| C15 | Chrisp, M., Clark, K., Primeau, B., Dalpiaz, M., Lennon, J. 2015, Proc. SPIE 9602, 96020C, "Optical design of the camera for Transiting Exoplanet Survey Satellite (TESS)" (MIT Lincoln Laboratory; author manuscript, 7 pp, PDF created 2015-08-12, on NASA NTRS 20150018419). The Figure 2 parameter table is an image in this version; the same table is text in C15S | `rawdata/imaging/tess/Chrisp2015_SPIE9602_0C_TESS_camera_optical_design_NTRS20150018419.pdf` | https://ntrs.nasa.gov/api/citations/20150018419/downloads/20150018419.pdf |
| C15S | Chrisp, M., Clark, K., Primeau, B., Dalpiaz, M., Lennon, J., "Optical Design of Camera for Transiting Exoplanet Survey Satellite (TESS)", SPIE Optics + Photonics presentation slides dated June 7, 2015 (slide footer "TESS PDR September 9-12, 2014"; 10 slides; NASA NTRS 20150018293). Page = slide number | `rawdata/imaging/tess/Chrisp2015_SPIE_TESS_camera_optical_design_slides_NTRS20150018293.pdf` | https://ntrs.nasa.gov/api/citations/20150018293/downloads/20150018293.pdf |
| P16 | Primeau, B., Chrisp, M., Balonek, G., Chesbrough, C., Andre, J., Clark, K., "Tolerancing, Alignment and Test of the Transiting Exoplanet Survey Satellite (TESS) Optical Assembly", SPIE Optical Engineering + Applications 2016 presentation slides (companion to Proc. SPIE 9951, 995103; 32 slides; PDF created 2016-02-18; NASA NTRS 20160010628). Page = slide number. Slide 28 ('Imaging Performance on Orbit') is a figure whose ensquared-energy labels are in the text layer | `rawdata/imaging/tess/Primeau2016_SPIE9951_03_TESS_optical_assembly_slides_NTRS20160010628.pdf` | https://ntrs.nasa.gov/api/citations/20160010628/downloads/20160010628.pdf |
| HEA | NASA HEASARC, TESS Science Support Center, "TESS Telescope Information" (telescope_information.html; fetched 2026-10-19) | `rawdata/imaging/tess/heasarc_tess_telescope_information.html` | https://heasarc.gsfc.nasa.gov/docs/tess/telescope_information.html |
| HEAT | NASA HEASARC, camera-characteristics table image on the TESS Telescope Information page (images/pages/tess_camera_specs.png, "Image Credit: MIT"; fetched 2026-10-19). An IMAGE: values read visually, not machine-checked | `rawdata/imaging/tess/heasarc_tess_camera_specs.png` | https://heasarc.gsfc.nasa.gov/docs/tess/images/pages/tess_camera_specs.png |
| TP | tess-point (C. J. Burke, A. Levine, M. Fausnaugh, R. Vanderspek et al., MIT), tess_stars2px.py VERSION 0.9.5, GitHub tessgi/tess-point commit 1bcd929d2c02042297ecb1b6299b3d95953c2c9b (2026-09-10). Its hard-coded focal-plane geometry ('from rfpg5_c1kb.txt') is the MIT POC analytic model of TESS Instrument Handbook Sec. 9.3.1, fitted in flight to bright-star positions: per camera a focal length, a radial polynomial in tan(theta) (distortion) and the position and rotation of each CCD. The file itself warns the hard-coded geometry 'is not up to date' (pixel-level accuracy) | `rawdata/imaging/tess/tesspoint_1bcd929_tess_stars2px.py` | https://raw.githubusercontent.com/tessgi/tess-point/1bcd929d2c02042297ecb1b6299b3d95953c2c9b/tess_stars2px.py |
| FFI | MAST, TESS Sector 1 SPOC calibrated full-frame image tess2018206192942-s0001-1-1-0120-s_ffic.fits (camera 1, CCD 1, 2018-07-25): the first 40320 bytes (primary and image-extension FITS headers, both ending in END) fetched by an HTTP range request (Content-Range bytes 0-40319/35547840; Last-Modified 2021-05-06); the bytes are unaltered, the pixel data are not saved | `rawdata/imaging/tess/tess2018206192942-s0001-1-1-0120-s_ffic_first40320bytes.fits` | https://archive.stsci.edu/missions/tess/ffi/s0001/2018/206/1-1/tess2018206192942-s0001-1-1-0120-s_ffic.fits |

## TESS camera (one of four identical): seven-element f/1.4 refractive lens, 105 mm entrance pupil, 146 mm focal length, 2 x 2 mosaic of MIT/LL CCID-80 CCDs (2048 x 2048, 15 um); four cameras form the 24 x 96 deg strip

**Recommended preset:** Refractor, direct. D = 0.105 m (entrance pupil, R15 'entrance pupil diameter of 10.5 cm'), eps = 0 (all-refractive), F = 1.3905 DERIVED = 146 mm / 105 mm (published f/1.4; 146 mm from IH Table 2.1 and C15S), f = 146.0 mm; in flight the four cameras fit 145.95-146.04 mm (TP). Field: 24 x 24 deg unvignetted (34 deg diagonal); field circle 35.2 deg (2110') so the linear model's mosaic corners (35.02 deg) fit. Band I (TESS 600-1000 nm, centred on I_C 786.5 nm). Detector: 4 x CCID-80, 2048 x 2048 imaging pixels of 15 um (frame stores excluded), rows [2, 2] centred; gaps DERIVED from the in-flight CCD positions: 1.74 mm (116 px, 40.9') between the two chips of a row, 1.58 mm (106 px, 37.3') between the rows (published: ~1.5 mm IH, 2 mm R15, 36'-41' on sky IH). Validate: 21.19"/px on axis (published 21" = 0.35'); 4 x 2048^2 = 16,777,216 px; field 24 x 24 deg nominal (explorer will give 24.79 x 24.73 deg and 581 deg^2 because it has no distortion; true 24.17 x 24.09 deg and 538 deg^2); PSF 50% EE in 1 px, 90% in 4 x 4 px. Distortion: pincushion, radial scale 21.20 -> 17.86"/px at the corners (-16%), pixel solid angle -21% (DERIVED from TP; WCS-checked). Four cameras: 1 x 4 strip, 24 x 96 deg = 2300 deg^2, boresights at +-12 and +-36 deg.

### Parameters

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| telescope_aperture | 0.105 | m (entrance pupil of the lens; the aperture stop is inside the lens) | R15, Sec. 4.1 (Lens Assembly), PDF p. 5 | "Each of the four identical TESS lenses is an f /1.4 custom design consisting of seven optical elements, with an entrance pupil diameter of 10.5 cm"<br>Note: The first lens element is oversized so the whole 24 x 24 deg field is unvignetted; the pupil shrinks off axis only by foreshortening.<br>ALT: 0.105 (R15, Table 1, PDF p. 7: "Entrance pupil diameter 10.5 cm")<br>ALT: 0.105 (C15S, slide 2 (parameter table; same table as C15 Fig. 2, an image): "EPD 105 mm")<br>ALT: 0.105 (P16, slide 5 (Optical Design Overview): "EPD = 105 mm")<br>ALT: 0.105 (IH, Sec. 3.1, PDF p. 17: "Each of the four identical TESS lenses is an f/1.4 custom design consisting of seven optical elements, with an entrance pupil diameter of 10.5 cm.")<br>ALT: 0.105 (HEA, Lens Assembly: "The lens assembly has a 10.5 cm diameter entrance pupil and a focal ratio f/1.4.")<br>ALT: 105.0 on axis -> ~102.6 mm at ~17 deg (IH, Sec. 3.1.1 text, PDF p. 18; Fig. 3.2 (IMAGE) on PDF p. 19: "The reduction of entrance pupil pdiameter with field angle is primarily due to geometric foreshortening and so falls off as cos(θ): this is shown in Figure 3.2.") [Fig. 3.2 read visually: 105.0 mm at 0 deg, ~104.1 at 10 deg, ~102.6 mm at ~17 deg (-2.3%); a pure cos(theta) would give 100.4 mm at 17 deg, so the plotted curve falls more slowly than the text says]<br>ALT: 0.1018 (C15S, slide 3 (Design Evolution): "Engineering Design f/1.56 ... Pupil 101.8 mm") [engineering unit (6 lenses, 22.5 x 22.5 deg), superseded by the flight design]<br>DERIVED: collecting area pi/4 x (10.5 cm)^2 = 86.59 cm^2; this equals the handbook's on-axis 'effective area of 86.6 cm2' (IH Sec. 3.1.2, quoted under notes), so that figure is the geometric pupil area. |
| central_obstruction | 0.0 | linear eps (none: an all-refractive lens has nothing in the beam) | C15, Abstract, PDF p. 1 | "The optical design of the wide field of view refractive camera, 34 degrees diagonal field, for the TESS payload is described."<br>Note: No source states an obscuration because there is none: no secondary mirror or detector sits in the incoming beam.<br>ALT: no vignetting (IH, Sec. 3.1.1, PDF p. 18: "Because the first element of the TESS lens is oversized, there is no geometric vignetting over the full FOV of the camera.") |
| telescope_focus | refractor: the detector at the focus of the camera lens (direct) |  | C15S, slide 2 (Introduction) | "Seven element hybrid Petzval design ... No vignetting ... Two aspheric surfaces"<br>ALT: hybrid Petzval (C15, Sec. 6 (Conclusion), PDF p. 6: "The hybrid Petzval design presented here, with no vignetting, proved to have the best light gathering for the given volume and weight constraints.")<br>ALT: no focus mechanism (IH, Sec. 3.1, PDF p. 18: "There is no focus mechanism in the TESS camera: the focus was set on the ground by the use of a precisely-machined shim that separates the lens from the detector assembly.")<br>ALT: aperture stop between lens 1 and lens 2 (C15, Fig. 2 (PDF p. 3): "Figure 2 Flight Camera Design and Parameters") (IMAGE) [read visually from the ray-trace drawing: the 'stop' label points to a plane just behind the first (oversized) element; no numerical stop position is published] |
| focal_ratio | 1.3905 | f/# (DERIVED: 146 mm / 105 mm; published f/1.4) | C15S, slide 2 (parameter table) | "FL, f/# 146 mm, f/1.4"<br>ALT: 1.4 (R15, Table 1, PDF p. 7: "Focal ratio (f /#) f /1.4")<br>ALT: 1.4 (IH, Table 2.1 (Sec. 2.3), PDF p. 13: "Custom 146 mm, f/1.4 lens (MIT/LL Design)")<br>ALT: 1.3900-1.3909 (DERIVED) (TP, hard-coded geometry, cameras 1-4: ""fl_cam1": 145.948116, ... "fl_cam1": 145.989933, ... "fl_cam1": 146.006602, ... "fl_cam1": 146.039793,") [in-flight focal lengths over D = 105 mm]<br>DERIVED: 146 / 105 = 1.3905; the published 'f/1.4' is this rounded. With F = 1.3905 and D = 0.105 m the explorer reproduces f = 146.0 mm (with F = 1.4 it would get f = 147.0 mm and 21.05"/px, 0.7% finer than the 146 mm design). |
| effective_focal_length | 146.0 | mm (design) | IH, Table 2.1 (Sec. 2.3), PDF p. 13 | "Custom 146 mm, f/1.4 lens (MIT/LL Design)"<br>ALT: 146.0 (C15S, slide 2: "FL, f/# 146 mm, f/1.4")<br>ALT: 146.0 (P16, slide 3 (TESS Instrument Overview): "146 mm focal length f/1.4")<br>ALT: 145.948 (TP, camera 1 parameters: ""fl_cam1": 145.948116,") [in flight, camera 1]<br>ALT: 145.99 (TP, camera 2 parameters: ""fl_cam1": 145.989933,") [camera 2 (the code labels every camera's keys _cam1)]<br>ALT: 146.007 (TP, camera 3 parameters: ""fl_cam1": 146.006602,") [camera 3]<br>ALT: 146.04 (TP, camera 4 parameters: ""fl_cam1": 146.039793,") [camera 4]<br>ALT: fitted (IH, Sec. 9.3.1 (POC Mapping), PDF p. 57: "an azimuthally-symmetric model that contains even powers of the radial angle position up to exponent order 8, the camera focal length, and parameters that specify the position and rotation of each CCD in the focal plane") [the TP numbers are this fit]<br>DERIVED: 146 mm = 105 mm x 1.3905; in flight 145.95-146.04 mm (spread 0.06%). |
| field_of_view_per_camera | 24 x 24 | deg (unvignetted image on the four-CCD mosaic) | R15, Sec. 4.1, PDF p. 5 | "Each lens forms a 24° × 24° unvignetted image on the four-CCD mosaic in its focal plane."<br>ALT: 24 x 24 (R15, Table 1, PDF p. 7: "Field of view of each lens 24° × 24°")<br>ALT: 24 x 24 (IH, Table 2.1, PDF p. 13: "Camera FOV 24° × 24°")<br>ALT: 24 x 24 nominal (IH, Sec. 8.1 (Camera FOVs), PDF p. 51: "The FOV of each camera is nominally 24° × 24°.")<br>ALT: 34 deg diagonal (C15, Abstract, PDF p. 1: "34 degrees diagonal field")<br>ALT: 24.17 x 24.09 (DERIVED, in flight) (TP, radial model + CCD positions, camera 1: ""opt_coef2_cam1": 0.24779006,") [angular width of the mosaic through the optical centre, inverting the fitted radial model at the outer CCD edges (cameras 1-4: 24.14-24.17 x 24.09-24.11 deg); corners 16.62-16.65 deg off axis (33.3 deg diagonal)]<br>ALT: 22.5 x 22.5 (C15S, slide 3 (Design Evolution): "Engineering Design f/1.56 ... Field 22.5° x 22.5°") [engineering unit only]<br>DERIVED: with a linear plate scale (206264.8/146 = 1412.8"/mm) the mosaic (61.44 mm + gap) spans (61.44 + 1.74)/146 rad = 24.79 deg along x and (61.44 + 1.58)/146 rad = 24.73 deg along y; the fitted (distorted) mapping gives 24.17 x 24.09 deg. Solid angle (TP model, numerical): 538 deg^2 on the CCDs, 569 deg^2 inside the mosaic outline (gaps included), vs 24 x 24 = 576 deg^2 nominal. |
| distortion | pincushion: r exceeds f tan(theta) by 1.17% at the field edge (12 deg) and 2.56% at the corners (16.6 deg) (DERIVED) |  | TP, hard-coded camera-1 radial coefficients | ""fl_cam1": 145.948116, "opt_coef1_cam1": 1.00000140, "opt_coef2_cam1": 0.24779006, "opt_coef3_cam1": -0.22681254, "opt_coef4_cam1": 10.78243356, "opt_coef5_cam1": -34.97817276,"<br>Note: No published document states the distortion amplitude in % or arcsec; the numbers come from the in-flight fit (TP) and agree with the SPOC WCS. The explorer's linear plate scale therefore over-states the field width by 2.6% and the CCD solid angle by 8%.<br>ALT: model form (TP, r_of_tanth(): "rfp0 = self.optcon[icam][0] * tanth ... rfp = np.sum(self.optcon[icam][1:] * np.power(tanth, 2.0 * (ii - 1))) ... return rfp0 * rfp") [r = fl tan(theta) x sum_i c_i tan^(2(i-1))(theta), i = 1..5]<br>ALT: radial polynomial (TP, module docstring: "the focal plane position is calculated using a radial polynomial model with a constant term and terms the even powers (2nd ,4th , and 8th)")<br>ALT: cameras 2-4 coefficients (TP, cameras 2-4 parameters: ""opt_coef2_cam1": 0.24069345, "opt_coef3_cam1": 0.15391120, "opt_coef4_cam1": 4.05433503, "opt_coef5_cam1": 3.43136895, ... "opt_coef2_cam1": 0.23452229, "opt_coef3_cam1": 0.33552009, "opt_coef4_cam1": 1.92009863, "opt_coef5_cam1": 12.48880182, ... "opt_coef2_cam1": 0.23920416, "opt_coef3_cam1": 0.13349450, "opt_coef4_cam1": 4.77768896, "opt_coef5_cam1": -1.75114744,") [the four cameras give the same scales to 0.2%]<br>ALT: ~10' wider camera-to-camera spacing at the corners (IH, Sec. 8.1, PDF p. 52: "The distance between adjacent cameras in the corners of the FOVs is generally ∼ 10’ larger, due to the distortion of the lenses.")<br>ALT: TAN + SIP order 5 (FFI, image-extension header (camera 1, CCD 1): "CTYPE1  = 'RA---TAN-SIP'       / Gnomonic projection + SIP distortions ... A_ORDER =                    5 / Polynomial order, axis 1")<br>ALT: 20.54-20.55"/px at the CCD-1 centre (DERIVED) (FFI, image-extension header (camera 1, CCD 1): "CRPIX1  =               1045.0 / X reference pixel ... CRPIX2  =               1001.0 / Y reference pixel ... CD1_1   =  0.00548148114044495 / Transformation matrix ... CD1_2   =   -0.001728636333271 / Transformation matrix ... CD2_1   =    0.001590247498224 / Transformation matrix ... CD2_2   =    0.005438818502496 / Transformation matrix") [independent measured check: column lengths of CD = 0.0057074, 0.0057069 deg = 20.547, 20.545"/px, sqrt(det) = 20.543"/px at FFI column 1045 (science column 1001, as science columns start at 45), row 1001, i.e. near the CCD centre 8.9 deg off axis; the TP model there gives radial 20.32, tangential 20.82, geometric mean 20.57"/px (0.1% apart). SIP terms vanish in first derivative at CRPIX, so CD is the local scale]<br>DERIVED from the camera-1 fit (cameras 2-4 within 0.2%), with 15 um pixels: on axis 21.20"/px both ways; at the edge midpoint (r = 31.5 mm, theta = 12.04 deg) radial 19.55"/px, tangential 20.49"/px, pixel solid angle 400.6 arcsec^2 (-10.9%); at the corner (r = 44.6 mm, theta = 16.59 deg) radial 17.86"/px (-15.8%), tangential 19.81"/px (-6.5%), solid angle 353.8 arcsec^2 (-21.3%). A distortion-free (gnomonic, r = f tan theta) lens would lose only cos^2 theta = 8.2% radially and cos theta = 4.2% tangentially at 16.6 deg; the distortion adds a further 8.3% (radial) and 2.5% (tangential). r / (f tan theta) - 1 = sum of the c_i terms - 1 = +0.12% at 3.9 deg, +0.46% at 7.8 deg, +1.17% at 12.0 deg, +2.56% at 16.6 deg. |
| optics_train | seven lenses in two aluminium barrels (split at lens 4/5); aspheres on lens 3 surface 2 and lens 6 surface 1; long-pass filter coating on lens 2 surface 2; all 14 surfaces AR-coated; the four-CCD mosaic at the focus, set by a shim |  | C15, Table 1 (Sec. 2.2), PDF p. 3 | "Surfaces L3, S2 and L6, S1 36 451 308"<br>Note: The explorer draws one objective lens; the real camera is a 211 mm long, 7-element lens (C15S). No lens prescription (radii, glasses, spacings) is published in the sources obtained.<br>ALT: 7 elements, 2 mild aspheres (R15, Sec. 4.1, PDF p. 5: "For ease of manufacture, all lens surfaces are spherical except for two mild aspheres.")<br>ALT: 7 lenses, 2 aspherics (C15S, slide 3 (Design Evolution): "Flight Design f/1.4 7 lenses 2 aspherics Field 24° x 24° Pupil 105 mm")<br>ALT: aspheres = surfaces 7 and 12 (of 15) (P16, slide 6 (tolerance table): "Surface 7 Asphere Tolerance: less than 0.07 microns peak to valley over any 14mm diameter subaperture (RRU met spec). Surface 12 Asphere Tolerance: less than 0.05 microns peak to valley over any 17mm diameter subaperture (RRU met spec).")<br>ALT: filter on lens 2, surface 2 (C15, Sec. 5 (Coatings), PDF p. 6: "The second surface of Lens 2 was chosen as the best location for the filter coating.")<br>ALT: 14 coated surfaces (C15, Sec. 5, PDF p. 6: "All 14 of the optical surfaces are coated to increase transmittance in the 600nm to 1000nm wavelength region.")<br>ALT: two barrels split at lens 4/5 (R15, Fig. 2 labels, PDF p. 6: "Aluminum lens barrel (splits at lens 4/5 location)")<br>ALT: field flattener + negative lenses (C15, Sec. 2.2, PDF p. 4: "In the flight design, the two negative lenses provide a correction of one third of the field curvature, with the field flattening lens taking care of the rest.")<br>ALT: transmittance 86.5% incl. filter; 9.3 kg; 17.0 cm diameter x 21.1 cm long (C15S, slide 2 (parameter table): "Transmittance 86.5% (including filter) Mass 9.3 kg Dimensions 17.0 cm diameter 21.1 cm long") |
| bandpass | [600, 1000] | nm (long-pass coating at the blue end; CCD QE at the red end) | R15, Table 1, PDF p. 7 | "Wavelength range 600–1000 nm"<br>Note: Explorer band: 'I' (its I pivot is 0.802 um) is the nearest of its bands to the published 786.5 nm centre; the band only sets lambda/D, which is negligible here.<br>ALT: [600, 1000] (R15, Sec. 4.1, PDF p. 5: "The surface of one element also has a long-pass filter coating to enforce the cutoff at 600 nm. The red limit at 1000 nm is set by the quantum-efficiency curve of the CCDs")<br>ALT: [600, 1040] (IH, Table 2.1, PDF p. 13: "Bandpass 600-1040 nm")<br>ALT: [600, 1000] (IH, Fig. 3.3 caption, PDF p. 19: "The vertical lines indicate the nominal TESS passband of 600-1000 nm.")<br>ALT: centred on I_C (786.5 nm) (HEA, Bandpass: "The TESS detector bandpass spans from 600 - 1000 nm and is centered on the traditional Cousins I-band (I_C, central wavelength = 786.5 nm).")<br>ALT: blocking < 530 nm (C15, Sec. 5, PDF p. 6: "high blocking via reflectance at wavelengths less than 530 nm and high transmittance between 600 nm and 1 micron") |
| detector | model: MIT/LL CCID-80; format_px: [2048, 2048]; pitch_um: 15 | px (imaging array, frame store excluded); um | R15, Sec. 4.2 (Detector assembly), PDF p. 6 | "Each CCID-80 consists of a 2048 × 2048 imaging array and a 2048 × 2048 frame-store region, with 15 µm square pixels."<br>ALT: [2048, 2048] (IH, Sec. 4.1.1, PDF p. 22: "The imaging array for the CCID-80 is comprised of 2048(H)×2048(V) pixels.")<br>ALT: frame store 2048 x 2068 (IH, Sec. 4.1.1, PDF p. 23: "The frame store region has dimensions 2048(H)×2068(V) pixels.") [R15 and HEA say 2048 x 2048; irrelevant to imaging (masked)]<br>ALT: +10 buffer rows/columns each side (IH, Sec. 4.1.1, PDF p. 22: "The active imaging array is surrounded by 10 extra rows and columns each on the left, right, top, and bottom sides ... The top buffer rows appear in the images, exposed to the sky.") [not counted as imaging pixels; the FFI science area is 2048 x 2048]<br>ALT: science area cols 45-2092, rows 1-2048 of the 2136 x 2078 FFI (FFI, image-extension header: "NAXIS1  =                 2136 / length of first array dimension ... NAXIS2  =                 2078 / length of second array dimension ... SCCSA   =                   45 / science col start, output A ... SCCED   =                 2092 / science col end (inclusive), output D ... SCIROWS =                    1 / science rows start ... SCIROWE =                 2048 / science rows end (inclusive)")<br>ALT: 15 (IH, Table 2.1, PDF p. 13: "Pixel Size 15 µm square")<br>ALT: 2048 x 2048, 15 um (P16, slide 29 (TESS Imager requirement table): "Detector Array 2048 x 2048 Pixel Size 15 microns")<br>DERIVED: chip active size 2048 x 15 um = 30.72 mm square. |
| n_chips | 4 | CCDs per camera | R15, Sec. 4.2, PDF p. 6 | "The focal plane consists of four back-illuminated MIT/Lincoln Lab CCID-80 devices."<br>ALT: 4 (IH, Table 2.1, PDF p. 13: "CCDs per Camera 4")<br>ALT: 2 x 2 (C15S, slide 2: "CCD 2 x 2 detector arrays 4k x 4k pixels") |
| mosaic_layout | rows_top_to_bottom: [2, 2]; rows_centered: yes; gap_x_mm: 1.74; gap_y_mm: 1.58; gap_basis: DERIVED from the in-flight CCD positions (TP) | rows; mm | TP, hard-coded camera-1 CCD origins (mm) and rotations (deg) | ""x0_ccd1_cam1": 31.573417, "y0_ccd1_cam1": 31.551637, ... "ang_ccd1_cam1": 179.980833, ... "x0_ccd2_cam1": -0.906060, "y0_ccd2_cam1": 31.536148, ... "ang_ccd2_cam1": 180.000000, ... "x0_ccd3_cam1": -31.652818, "y0_ccd3_cam1": -31.438350, ... "ang_ccd3_cam1": -0.024851, ... "x0_ccd4_cam1": 0.833161, "y0_ccd4_cam1": -31.458180, ... "ang_ccd4_cam1": 0.001488,"<br>Note: The optical axis falls in the central cross of the gaps (each CCD's inner edges lie 0.6-1.0 mm from the axis), not on silicon.<br>ALT: ~1.5 mm (IH, Sec. 4.2 (Focal Plane Array), PDF p. 25: "The four CCDs are abutted, with a ∼1.5 mm gap between them (Figure 4.6, left).")<br>ALT: 2 mm; 62 x 62 mm (R15, Sec. 4.2, PDF p. 6: "The four CCDs are abutted with a 2 mm gap, creating an effective 4096 × 4096 imaging array contained within a 62 × 62 mm square") [2 x 30.72 + 2 = 63.44 mm, not 62]<br>ALT: 2 mm (HEA, CCD Detector Assembly: "The four CCDs in each array are separated by 2mm and create an effective 4096 x 4096 pixel detector")<br>ALT: 62 x 62 mm, 95% fill factor (IH, Sec. 4.2, PDF p. 25: "The four frame-store regions create an effective 4096x4096 pixel imaging array contained within a 62 × 62 mm focal plane with a fill factor of 95%.")<br>ALT: 63 x 63 mm (IH, Sec. 2.3.1, PDF p. 13: "The focal plane array consist of four large-format backside-illuminated CCDs abutted to create a 63×63 mm detector.")<br>ALT: 63.482 mm square -> 2.042 mm gap (DERIVED) (P16, slide 29 (TESS Imager requirement table): "CCD Active Area Size 63.482 mm x 63.482 mm") [requirement; 63.482 - 2 x 30.72 = 2.042 mm; the table's 'CCD active area diagonal semi-height 44.88 mm' = 63.482/sqrt(2)]<br>ALT: 36'-41' on sky (IH, Sec. 8.1, PDF p. 51: "The gaps between the CCDs, both vertically and horizontally, subtend 36’ to 41’.")<br>ALT: square arrangement (C15, Sec. 1, PDF p. 1: "The focal planes for the cameras consist of 4 CCDs closely spaced in a square arrangement giving a frame size of 2k x 2k pixels.") ['2k x 2k' is a slip for 4k x 4k (C15 Fig. 2 and C15S: '4k x 4k pixels')]<br>DERIVED (imaging array = 30.72 mm from each CCD origin, rotated by its angle; TP mm_to_pix convention): camera 1 CCDs span x [0.84, 31.57], [-31.63, -0.91], [-31.65, -0.92], [0.83, 31.55] mm; gaps within the rows (x) 1.749 and 1.752 mm, between the rows (y) 1.535 and 1.569 mm. All four cameras: x gaps 1.722-1.761 mm (mean 1.738 mm = 115.9 px = 40.9' at 21.19"/px), y gaps 1.535-1.640 mm (mean 1.584 mm = 105.6 px = 37.3'), matching IH's 36'-41'. Mosaic outline 63.17-63.23 x 63.02-63.11 mm; fill factor 4 x 30.72^2 / (63.23 x 63.02) = 94.7% (IH: 95%). Orientation: the TP Euler angles put the four boresights along spacecraft X at -36.0, -12.0, +12.0, +36.0 deg and the focal-plane x axis along spacecraft +-Y, so x (the larger, within-row gap) runs across the 24-deg width of the strip and y (between rows) along the 96-deg strip. |
| four_camera_array | 1 x 4 strip, 24 x 96 deg |  | R15, Sec. 7.2 (Scanning strategy), PDF p. 9 | "The four cameras act as a 1 × 4 array, providing a combined FOV of 24° × 96° or 2300 square degrees"<br>ALT: 24 x 96 deg = 2300 deg^2 (R15, Table 1, PDF p. 7: "Combined field of view 24° × 96° = 2300 sq. deg.")<br>ALT: 24 x 96 deg (3200 deg^2) (HEAT, table row 'Combined field-of-view': "Combined field-of-view 24° x 96° (3200 deg²)") (IMAGE) [read visually; 3200 is inconsistent with 24 x 96 = 2304]<br>ALT: boresights at 12 and 36 deg from +Z (C15, Sec. 4 (Stray Light), PDF p. 6: "The TESS system contains four cameras, two of which are pointed at 36° to the spacecraft +Z direction and two at 12°.")<br>ALT: -36.02, -12.02, +12.01, +35.98 deg (in flight) (TP, camera Euler angles: ""ang2_cam1": -36.022035, ... "ang2_cam1": -12.017260, ... "ang2_cam1": 12.007750, ... "ang2_cam1": 35.978116,")<br>ALT: < 10' between cameras (IH, Sec. 8.1, PDF p. 51,52: "The gaps between cameras are < 10’ along ... the centerline of the cameras.")<br>ALT: rectangle on the sky (R15, Sec. 5, PDF p. 7: "The cameras are bolted onto a common plate that is attached to the spacecraft, such that their fields of view are lined up to form a rectangle measuring 24° × 96° on the sky")<br>ALT: 48 x 48 deg field of regard (C15, Sec. 1, PDF p. 1: "On the satellite are four cameras of the same optical design, arranged so that their individual 24°x 24° fields of view sum to cover a 48°x 48° field of regard.") [a 2 x 2 arrangement; contradicts the flown 1 x 4 strip (R15, IH, TP)]<br>DERIVED: camera boresights 24 deg apart (TP ang2 differences 24.005, 24.025, 23.970 deg), each 24.1-24.2 deg wide, so adjacent fields nearly abut on the centreline (IH: < 10'). Four cameras: 4 x 16,777,216 = 67,108,864 px; CCD solid angle 4 x 538 = 2152 deg^2 (TP model). |

### Published performance (validation targets)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pixel_scale | 21.19 | arcsec/px at the field centre (DERIVED: 15 um / 146 mm) | HEA, Lens Assembly | "the 50% ensquared-energy half-width is 15 micron averaged over the FOV. This corresponds to 1 detector pixel or 21 arcseconds (approx. 0.35 arcmin) on sky."<br>ALT: 21.0 (R15, Table 1, PDF p. 7: "50% within 15 × 15 µm (one pixel, or 0.35 × 0.35 arcmin)") [0.35' = 21.0"]<br>ALT: 21.0 (R15, Table 1, PDF p. 7: "90% within 60 × 60 µm (4 × 4 pixels, or 1.4 × 1.4 arcmin)") [1.4' / 4 px = 21.0"/px]<br>ALT: 21.186-21.199 (DERIVED) (TP, fl per camera: ""fl_cam1": 145.948116, ... "fl_cam1": 146.039793,") [206264.8 x 0.015 / fl]<br>ALT: 20.54 at the CCD-1 centre, 8.9 deg off axis (DERIVED) (FFI, CD matrix: "CD1_1   =  0.00548148114044495 / Transformation matrix ... CD2_2   =    0.005438818502496 / Transformation matrix") [local scale reduced by the distortion (see distortion)]<br>DERIVED: 206264.8 x 0.015 / 146 = 21.19"/px (1412.8"/mm). No source publishes the scale to better than 21"; the corner radial scale is 17.9"/px (see distortion). |
| field_of_view | x_deg: 24; y_deg: 24; area_deg2: 576 | deg per camera (nominal) | IH, Sec. 8.1, PDF p. 51 | "The FOV of each camera is nominally 24° × 24°."<br>ALT: x_deg: 24.79; y_deg: 24.73 (IH, Table 2.1, PDF p. 13 (explorer linear model with the preset gaps; DERIVED): "Custom 146 mm, f/1.4 lens (MIT/LL Design)") [(2 x 30.72 + 1.74) / 146 rad and (2 x 30.72 + 1.58) / 146 rad: what the explorer will report; 3.3% above the nominal 24 deg]<br>ALT: x_deg: 24.17; y_deg: 24.09 (TP, (in-flight distorted mapping; DERIVED): ""opt_coef2_cam1": 0.24779006,") [what the sky actually spans (camera 1)]<br>DERIVED: active (gaps excluded) solid angle per camera: 4 x 2048^2 x (21.19")^2 = 581.4 deg^2 in the explorer's linear model; 538 deg^2 in the fitted distorted mapping (cameras 1-4: 537.9-538.4). Inside the mosaic outline (gaps included): 569 deg^2 (TP) vs 576 nominal. |
| total_pixels | 16,777,216 | imaging pixels per camera (DERIVED: 4 x 2048 x 2048) | R15, Sec. 4.2, PDF p. 6 | "The four CCDs are abutted with a 2 mm gap, creating an effective 4096 × 4096 imaging array"<br>ALT: 4096 x 4096 (P16, slide 3: "CCD focal plane 4096x4096 pixels")<br>ALT: 4k x 4k (C15S, slide 2: "CCD 2 x 2 detector arrays 4k x 4k pixels")<br>DERIVED: 4 x 2048^2 = 16,777,216 = 16.8 Mpx per camera; 67.1 Mpx for the four cameras. |
| psf_ensquared_energy | 50pc_within_px: 1; 90pc_within_px: 4 | px (square box side, centred on the peak) | R15, Table 1, PDF p. 7 | "Ensquared energy 50% within 15 × 15 µm (one pixel, or 0.35 × 0.35 arcmin) 90% within 60 × 60 µm (4 × 4 pixels, or 1.4 × 1.4 arcmin)"<br>ALT: 50% EE half-width 15 um, FOV average (R15, Sec. 4.1, PDF p. 5: "At nominal focus and flight temperature (−75° C), the 50% ensquared-energy half-width is 15 µm (one pixel or 0.35 arcmin) averaged over the FOV.") [a half-width of 15 um would be a 30 x 30 um box; Table 1 says 15 x 15 um]<br>ALT: 55% / 23% / 18% in one 15 um pixel at (0,0) / (11,0) / (11,11) deg (P16, slide 28 (Imaging Performance on Orbit; predicted): "Ensquared Energy =55% ... Ensquared Energy =23% ... Ensquared Energy =18%") [field labels (0°, 0°), (11°, 0°), (11°, 11°) and '15 micron pixel' in the same figure]<br>ALT: 50% / 90% (HEAT, table row 'Ensquared energy': "50% within 15 x 15 μm (1 pix²) 90% within 60 x 60 μm (4 pix²)") (IMAGE) ['4 pix²' should be 4 x 4 px (60 um = 4 px)]<br>ALT: peak-pixel fraction 0.2-0.4 in flight (IH, Sec. 6.7.1 (Blooming), PDF p. 38: "the fraction of the total charge in the peak pixel: this value generally ranges from 0.2 to 0.4 in the TESS images.")<br>ALT: compact on axis, chevrons beyond ~6 deg (IH, Sec. 7.6 (Pixel Response Function), PDF p. 50: "near the boresights, it is more compact (and even slightly undersampled within ∼ 1° ), and spreads out into chevrons at large field angles (approximately greater than 6° ).")<br>DERIVED: for a circular Gaussian the fraction inside a centred square of side a is erf(a / (2 sqrt2 sigma))^2; 50% in a = 1 px gives sigma = 0.475 px, FWHM = 1.12 px = 23.7"; 90% in a = 4 px gives sigma = 1.03 px, FWHM = 2.42 px = 51.2". The two figures are not one Gaussian (broad wings). Diffraction: 1.22 x 786.5 nm / 0.105 m = 1.9" (negligible). |
| etendue | 4.99 | m^2 deg^2 per camera (DERIVED) | R15, Table 1, PDF p. 7 | "Entrance pupil diameter 10.5 cm"<br>DERIVED: 0.008659 m^2 x 576 deg^2 = 4.99 m^2 deg^2 per camera (nominal 24 x 24 field), 19.9 for four; with the 538 deg^2 actually on silicon, 4.66 per camera. No published etendue. |

### NOT FOUND

- A published distortion amplitude (in % or arcsec/px across the field): only the qualitative IH Sec. 8.1 statement (~10' larger camera spacing at the corners 'due to the distortion of the lenses') and the fitted coefficients in TP; all distortion numbers here are DERIVED from TP and cross-checked against one SPOC WCS.
- A pixel scale published to better than 21" (0.35'); 21.19"/px is DERIVED from the 146 mm focal length.
- As-built CCD gaps in mm from the hardware papers: only '~1.5 mm' (IH), '2 mm' (R15, HEA) and the 63.482 mm array requirement (P16); the preset gaps are DERIVED from the in-flight geometry fit (TP).
- The lens prescription (radii, glasses, thicknesses, stop position): only element count, asphere surfaces, tolerances and the Fig. 2 drawing (C15).
- Woods et al. 2016 (SPIE 9904, 'The TESS camera: modeling and measurements with deep depletion devices'), Krishnamurthy et al. 2016/2019, Balonek et al. 2017 and Wellman et al. 2019 (SPIE) were not obtained (publisher paywall; no open copy found).
- A published active (gaps-excluded) solid angle per camera; 538 deg^2 (TP) and 581.4 deg^2 (linear) are DERIVED.

### Conflicts between sources

- CCD gap: 2 mm (R15, HEA) vs ~1.5 mm (IH Sec. 4.2) vs 2.042 mm implied by the 63.482 mm array requirement (P16) vs in flight 1.72-1.76 mm within rows and 1.54-1.64 mm between rows (TP, DERIVED). On sky: 36'-41' (IH) = 1.53-1.74 mm at 1412.8"/mm, matching TP.
- Array size: 62 x 62 mm (R15, IH Sec. 4.2) vs 63 x 63 mm (IH Sec. 2.3.1) vs 63.482 mm (P16) vs 63.2 x 63.0-63.1 mm (TP). 62 mm cannot hold two 30.72 mm chips plus a 2 mm gap (63.44 mm).
- Bandpass red end: 1000 nm (R15, C15, HEA, IH Fig. 3.3) vs 1040 nm (IH Table 2.1). Filter blocking edge: 530 nm (C15), cut-on ~600 nm (R15, IH).
- Focal ratio: f/1.4 (all) vs 146 / 105 = 1.3905 (DERIVED); the published f/# is rounded.
- Combined field: 2300 deg^2 (R15) vs '3200 deg^2' (HEAT image; 24 x 96 = 2304). Field of regard '48x 48' (C15, a 2 x 2 arrangement) vs the flown 24 x 96 strip (R15, IH, TP).
- PSF: R15 Table 1 '50% within 15 x 15 um (one pixel)' vs R15 Sec. 4.1 '50% ensquared-energy half-width is 15 um' (a 30 x 30 um box if read literally); HEA repeats the half-width wording.
- Frame-store format: 2048 x 2048 (R15, HEA) vs 2048 x 2068 (IH). Not used by the preset.
- Entrance pupil off axis: IH text says it 'falls off as cos(theta)' (100.4 mm at 17 deg) but IH Fig. 3.2 shows ~102.6 mm at ~17 deg.
- C15 Sec. 1 'frame size of 2k x 2k pixels' vs '4k x 4k pixels' (C15 Fig. 2, C15S, R15 4096 x 4096): a slip.

### Notes

- Model: a refractor (objective lens, detector at its focus, direct). D = 105 mm, F = 1.3905, f = 146.0 mm, eps = 0. The real lens is a 7-element f/1.4 hybrid Petzval 211 mm long (C15S), its aperture stop behind the oversized first element (C15 Fig. 2), so the whole 24 x 24 deg field is unvignetted (IH 3.1.1).
- The explorer's linear plate scale is exact only on axis. TESS has strong pincushion distortion relative to a gnomonic mapping: the radial pixel scale falls from 21.20"/px on axis to 19.55" at the edge midpoints and 17.86" at the corners, the tangential scale to 20.49" and 19.81"; a corner pixel sees 21% less sky. Consequences for validation: the explorer will report a field 24.79 x 24.73 deg (true 24.17 x 24.09) and 581 deg^2 of CCD (true 538).
- Mosaic: 2 rows of 2 CCID-80 chips (2048 x 2048 imaging px, 15 um; frame-store halves masked), rows centred. The larger gap (1.74 mm) separates the two chips within a row, the smaller (1.58 mm) the two rows; the optical axis lies in the central cross of the gaps.
- Four cameras: boresights at -36, -12, +12, +36 deg from the spacecraft +Z axis along one line, fields nearly abutting (< 10' on the centreline), forming the 24 x 96 deg sector strip; the strip's long axis runs along the focal-plane y axis (between rows).
- PSF: aberration-limited, not diffraction-limited (lambda/D = 1.5" vs 21" pixels). Published: 50% of the energy in one pixel and 90% in 4 x 4 px (design, FOV average); predicted on orbit 55% in one pixel on axis, 23% at 11 deg, 18% at the (11, 11) deg corner direction (P16); in flight the peak pixel holds 0.2-0.4 of a star's light (IH). A Gaussian matching '50% in one pixel' has FWHM 1.12 px = 23.7" (DERIVED).
- Collecting area: pi/4 x 10.5^2 = 86.59 cm^2; IH Sec. 3.1.2 quotes 'an effective area of 86.6 cm2 on axis and a drop of 4.5% in the furthest corner of the FOV' (the first number is the geometric pupil area).

Quoted support for the notes (machine-checked):

- 86.6 cm^2 on axis, -4.5% at the corner: IH, Sec. 3.1.2, PDF p. 19: "These analyses predict an effective area of 86.6 cm2 on axis and a drop of 4.5% in the furthest corner of the FOV"
- first element oversized: IH, Sec. 3.1 Fig. 3.1 caption, PDF p. 18: "Because the first lens element is oversized, there is minimal geometric vignetting at large field angles."
- TP caveat: TP, module docstring NOTES: "hard coded focal plane geometry is not up to date and may contain inaccurate results."
- TP provenance: TP, module docstring NOTES: "Hard coded focal plane geometry parameters from rfpg5_c1kb.txt"
- TP accuracy: TP, module docstring NOTES: "Testing shows pointing with this tool should be accurate to better than a pixel"
- POC fit residuals: IH, Sec. 9.3.1, PDF p. 57: "RMS residuals between pointing model and flux weighted centroid positions are 1.3 +/- 0.06 arcsec (0.06 +/- 0.03 pixels)"
