# Imager preset: 2MASS (two 1.3 m Cassegrain telescopes, three-channel J/H/Ks NICMOS3 cameras, freeze-frame scanning) -- sourced parameters

Compiled 2026-10-19 for the instex IMAGER mode, in the format of `data/imaging/widefield.md`. Every number comes from a document saved unmodified under `rawdata/imaging/2mass/`; each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). Quotes were machine-checked by script against the extracted text of the saved files (pdftotext -layout and -raw per page, each also with line-end hyphens joined or kept; tag-stripped HTML and the raw HTML source, with the NUL padding of the IRSA pages removed; the ADS JSON record raw and field by field), after normalising Unicode (NFKC), quotes, dashes, minus, primes and the acute accent the IRSA pages use as an arcsec mark, and collapsing whitespace (a quote also passes with all whitespace removed, which covers HTML `<sub>` splits such as "K s"); ' ... ' joins non-adjacent pieces. 123 quotes pass; 4 entries marked IMAGE were read from figures. S06 page numbers are journal pages (PDF page = journal page - 1162). The S06 text layer renders arcsec as "B" after a digit (2B0 = 2.0") or "00" after an integer (5700 = 57"), arcmin as "A" (8A5 = 8.5'), the degree sign as "N" (0N3 = 0.3 deg), "x" as ";" and "=" as "¼"; quotes keep those renderings.

## Summary

- **Telescopes (two, identical; Mt. Hopkins and CTIO):** D = 1.3 m (1280 mm clear), classical Cassegrain (paraboloid primary R = 5200 mm, f/2.0; hyperboloid secondary 232 mm, K = -1.847), open tube, equatorial fork. eps = 0.178 DERIVED (secondary / primary; no baffles during 2MASS). Published f/13.5 and 11.97"/mm; the plate scale gives f_eff = 17,232 mm = f/13.26 (DERIVED), and the paraxial prescription at the 527-mm native back focus reproduces 11.971"/mm, so f/13.5 is a rounded label.
- **Camera (reimaged, cryogenic, all refractive):** ZnSe window, cryogenic field stop at the Cassegrain focus, one common Infrasil collimating lens, two dichroics in the nearly collimated beam (J reflected first, H reflected by the second, Ks straight through), then six identical lenses per band forming a pupil image with a cold Lyot stop (90% of the pupil diameter) and the band filter beside it; 19 spherical CaF2/Infrasil lenses, design F/3.5. Pupil diameter W and the collimator/camera focal lengths NOT FOUND (Milligan et al. 1996 not obtained); only f_cam/f_col = 0.2405 (DERIVED).
- **Detectors:** one Rockwell NICMOS3 HgCdTe 256 x 256, 40 um, per band; three co-aligned arrays per camera (common centre within 10"), rotated ~0.3 deg. Pixel scale 1.991"/px mean (1.980-2.006 by array), so f_eff = 4144 mm and F_cam = 3.188 with D = 1.3 m (3.54 with the 1.17 m cold-stopped beam, matching the design F/3.5). Field 8.5 x 8.5 arcmin.
- **Survey:** freeze-frame scanning: the telescope scans north-south at 57"/s while the secondary tilts the other way (sawtooth) to hold each 1.3 s exposure still; 1.455 s frame cycle; step 82.6" (N) / 82.3" (S), just under 1/6 frame, so each point is seen 6 times = 7.8 s at different sub-pixel positions; tiles 504" x (6 deg + 8.5'), 273/274 frames, ~7 min; Atlas Images resampled from the 2" raw pixels to 1"/px (512 x 1024 px = 8.53' x 17.07').
- **Validation:** 1.991"/px; 8.5' field; 65,536 px per band; 10-sigma point-source limits J/H/Ks = 15.8/15.1/14.3 required, 16.42/15.48/14.81 mean achieved; frame FWHM 2.5" best, 2.6-2.8" Mt. Hopkins mean, 2.5-2.7" CTIO (typical seeing 1").
- **One preset** serves all three bands (identical optics, plate scales within 1%); preset_alt_coldstop gives the variant with the aperture set by the cold stop (D = 1.17 m).

## Explorer preset (machine-readable copy of `twomass.preset` in twomass.json)

```json
{
 "mode": "reimaged",
 "tel": "cass",
 "telescope_type": "classical Cassegrain (paraboloidal primary f/2.0, hyperboloidal secondary), 1.3 m, open tube, equatorial fork; the secondary tilts in declination for freeze-frame scanning; two identical telescopes (Mt. Hopkins, Arizona; Cerro Tololo, Chile)",
 "focus": "Cassegrain",
 "D_m": 1.3,
 "D_note": "primary mirror 1300 mm (1280 mm clear, GM20); the camera's cold Lyot stops pass 90% of the pupil diameter (1.17 m equivalent, DERIVED; see preset_alt_coldstop)",
 "eps": 0.178,
 "eps_note": "232-mm secondary / 1300-mm primary (DERIVED; 228/1280 = 0.178 from GM20); no baffles during 2MASS; the 200-mm primary hole lies inside the secondary shadow",
 "F": 13.26,
 "F_note": "f_eff / 1.3 m from the published Cassegrain plate scale 11.97\"/mm (DERIVED); published label f/13.5",
 "F_published": 13.5,
 "f_eff_cass_mm": 17232,
 "plate_scale_cass_arcsec_per_mm": 11.97,
 "primary_F": 2.0,
 "back_over_D": 0.405,
 "back_note": "native Cassegrain focus 527 mm behind the primary vertex (GM20); drawing only",
 "field_arcmin": 12.1,
 "field_note": "no telescope corrected field is published; 12.1' just encloses the 8.49' square array (diagonal 12.01'); a cryogenic field stop at the Cassegrain focus is slightly smaller than the array image",
 "imager": "reimaged (cryogenic, all-refractive, all-spherical; 1 common collimating lens + 2 dichroics + 6 lenses per band; Lyot stop and filter at a pupil image in each band)",
 "W_mm": null,
 "W_note": "NOT FOUND (pupil / Lyot-stop diameter is in Milligan et al. 1996, not obtained); the pixel scale and field do not depend on W",
 "Fc": 3.188,
 "Fc_note": "f_eff / 1.3 m with f_eff = 40 um x 206264.8 / 1.991\" = 4144 mm (DERIVED); design F/3.5 (M96) is the 90%-cold-stopped beam (4144 / 1170 = 3.54)",
 "f_eff_mm": 4144,
 "f_cam_over_f_col": 0.2405,
 "Fc_published": 3.5,
 "cold_stop": "Lyot stop diameter = 90% of the pupil image (S06)",
 "band": "Ks",
 "bands": [
  "J",
  "H",
  "Ks"
 ],
 "bands_simultaneous": "J, H, Ks imaged at once through two dichroics (J reflected first, H reflected second, Ks straight through)",
 "bandpass_50pct_um": {
  "J": [
   1.11,
   1.4
  ],
  "H": [
   1.51,
   1.79
  ],
  "Ks": [
   2.0,
   2.31
  ]
 },
 "lambda_iso_um": {
  "J": 1.235,
  "H": 1.662,
  "Ks": 2.159
 },
 "Nx": 256,
 "Ny": 256,
 "pix_um": 40,
 "n_chips": 1,
 "n_chips_note": "one NICMOS3 per band, three per camera, co-aligned (not a mosaic)",
 "rows": [
  1
 ],
 "gaps": "none (single array per band)",
 "detector": "Rockwell NICMOS3 HgCdTe, 256 x 256, 40 um, four 128 x 128 quadrants",
 "psf": "seeing",
 "seeing_arcsec": 1.0,
 "seeing_note": "S06 Sec. 2.1: a typical seeing disc is 1\" FWHM; the measured frame FWHM of 2.5-2.8\" includes the 2\" pixels",
 "pixel_scale_arcsec": 1.991,
 "pixel_scale_per_band": {
  "North": {
   "J": 1.997,
   "H": 2.006,
   "Ks": 1.984
  },
  "South": {
   "J": 1.989,
   "H": 1.992,
   "Ks": 1.98
  }
 },
 "fov_arcmin": [
  8.49,
  8.49
 ],
 "survey": {
  "technique": "freeze-frame scanning: continuous declination scan at 57\"/s; the secondary tilts against the scan (sawtooth) to hold the image still for each 1.3 s exposure, then flies back during readout/reset",
  "exposure_s": 1.3,
  "read1_s": 0.051,
  "frame_cycle_s": 1.455,
  "collect_s": 1.351,
  "step_arcsec": {
   "north": 82.6,
   "south": 82.3
  },
  "frames_per_point": 6,
  "total_exposure_s": 7.8,
  "tile": "504\" (RA) x (6 deg + 8.5') (Dec); 273 (N) / 274 (S) frames; ~7 min per scan; 59,650 tiles",
  "raw_pixel_arcsec": 1.991,
  "atlas_pixel_arcsec": 1.0,
  "atlas_image_px": [
   512,
   1024
  ],
  "atlas_image_arcmin": [
   8.53,
   17.07
  ]
 },
 "validate": {
  "pixel_scale_arcsec": 1.991,
  "fov_arcmin": [
   8.5,
   8.5
  ],
  "total_pixels_per_band": 65536,
  "limiting_mag_10sigma_required": {
   "J": 15.8,
   "H": 15.1,
   "Ks": 14.3
  },
  "limiting_mag_10sigma_mean_achieved": {
   "J": 16.42,
   "H": 15.48,
   "Ks": 14.81
  },
  "image_fwhm_arcsec": "2.5 best; 2.6-2.8 Mt. Hopkins mean; 2.5-2.7 CTIO",
  "etendue_m2deg2_DERIVED": 0.0258
 },
 "pub_suggested": [
  {
   "what": "pixel scale 1.991″/px (mean of six arrays; 1.980-2.006)",
   "q": "pixScale",
   "value": 1.991,
   "info": true,
   "src": "Skrutskie+06; circular: F_cam was derived from it"
  },
  {
   "what": "field 8.5′ × 8.5′",
   "q": "fieldX",
   "value": 8.5,
   "tol": 0.01,
   "src": "Skrutskie+06 (256 × 1.991″ = 8.49′)"
  },
  {
   "what": "field 8.5′ × 8.5′",
   "q": "fieldY",
   "value": 8.5,
   "tol": 0.01,
   "src": "Skrutskie+06"
  },
  {
   "what": "65,536 pixels per band (256 × 256)",
   "q": "npix",
   "value": 65536,
   "tol": 1e-06,
   "src": "NICMOS3 format"
  },
  {
   "what": "étendue 0.0258 m² deg² (DERIVED: 1.285 m² × 0.0200 deg²)",
   "q": "etendue",
   "value": 0.0258,
   "info": true,
   "src": "no published value; 0.0207 with the 1.17 m cold stop"
  }
 ],
 "pub_unmodelled": "design final focal ratio F/3.5 (Milligan+96; the model gives 3.19 with D = 1.3 m, 3.54 with D = 1.17 m); Cassegrain plate scale 11.97″/mm (Skrutskie+06; circular, F was derived from it)",
 "flags": "F DERIVED from the published plate scale (label f/13.5); F_cam DERIVED from the pixel scale (design F/3.5 refers to the cold-stopped beam); eps DERIVED from the secondary diameter; W, f_col, f_cam NOT FOUND (only their ratio); field circle chosen to enclose the array"
}
```

Cold-stop variant (`twomass.preset_alt_coldstop`):

```json
{
 "purpose": "variant with the aperture set by the cold Lyot stop (90% of the pupil diameter); same pixel scale and field",
 "D_m": 1.17,
 "eps": 0.198,
 "F": 14.73,
 "Fc": 3.542,
 "basis": "DERIVED: D = 0.9 x 1.3 m; eps = 0.232 / 1.17 (assumes the stop does not also mask the centre: not published); F = 17,232 / 1170; Fc = 4144 / 1170 (matches the design F/3.5 of M96)"
}
```

## Sources

| key | document | local file | URL |
|---|---|---|---|
| S06 | Skrutskie, M. F., Cutri, R. M., Stiening, R., Weinberg, M. D., Schneider, S., Carpenter, J. M., et al. 2006, AJ 131, 1163, "The Two Micron All Sky Survey (2MASS)" (publisher PDF, 21 pp.; journal pages 1163-1183 = PDF pp. 1-21). Table 1 = survey parameters; Sec. 2.2 arrays, cameras and bandpasses; Sec. 2.3 telescopes; Sec. 2.4 site conditions; Sec. 3.2 image acquisition; Sec. 3.3 tiling; Sec. 4.3 Atlas Images. Its text layer renders the arcsec glyph as "B" after a digit (2B0 = 2.0"), as "00" after an integer (5700 = 57", 100 = 1", 8300 = 83", 1000 = 10", 5000 = 50"), the arcmin glyph as "A" (8A5 = 8.5'), the degree glyph as "N" (0N3 = 0.3 deg), "x" as ";" and "=" as "1/4" (the single glyph U+00BC); the superscript minus, sigma, mu and tilde are control characters (mu restored, the others dropped in the normalised text) | `rawdata/imaging/2mass/Skrutskie2006_AJ131_1163_2MASS.pdf` | https://iopscience.iop.org/article/10.1086/498708/pdf |
| M96 | Milligan, S., Cranton, B. W., Skrutskie, M. F. 1996, Proc. SPIE 2863, 2, "Development of a three-channel SWIR camera, for ground-based astronomical imaging. (Two micron all sky survey, 2MASS)", in Current Developments in Optical Design and Engineering VI. ONLY THE ABSTRACT was obtained: the NASA ADS record (API response saved as is, fields bibcode/title/author/abstract/pub/volume/page/year/doi). The paper itself (the camera prescription) is behind the SPIE paywall and was not obtained | `rawdata/imaging/2mass/ADS_abstract_Milligan1996_SPIE2863_2.json` | https://ui.adsabs.harvard.edu/abs/1996SPIE.2863....2M/abstract |
| GM20 | Garcia-Mejia, J., Charbonneau, D., Fabricant, D., Irwin, J. M., Fata, R., Zajac, J. M., Doherty, P. E. 2020, "The Tierras Observatory: An ultra-precise photometer to characterize nearby terrestrial exoplanets", Proc. SPIE 11445 (paper 11445-168), arXiv:2012.09744v1. Sec. 2.1 describes the refurbished 2MASS North 1.3 m telescope (clear apertures, primary hole, native focus position); Sec. 6.1 says it had no baffles during 2MASS. A later user of the northern telescope, not a 2MASS document | `rawdata/imaging/2mass/GarciaMejia2020_Tierras_SPIE_arXiv2012.09744.pdf` | https://arxiv.org/pdf/2012.09744 |
| ES-TOC | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. Table of Contents: title and author list | `rawdata/imaging/2mass/irsa_2mass_explsup_explsup.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/explsup.html |
| ES-I.1 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. I.1 "2MASS Overview": last updated 2006 December 20 | `rawdata/imaging/2mass/irsa_2mass_explsup_sec1_1.new.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec1_1.new.html |
| ES-I.3 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. I.3 "Executive Summary of 2MASS All-Sky Release Data Products": last updated 2004 Sept 2 | `rawdata/imaging/2mass/irsa_2mass_explsup_sec1_3.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec1_3.html |
| ES-II.4 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. II.4 "Atlas Images": last updated 2004 Sept 2 | `rawdata/imaging/2mass/irsa_2mass_explsup_sec2_4.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec2_4.html |
| ES-III.1a | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. III.1.a "Telescopes": last updated 2018 Jul 16 (R. Stiening) | `rawdata/imaging/2mass/irsa_2mass_explsup_sec3_1a.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec3_1a.html |
| ES-III.1b | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. III.1.b "Camera and Detectors" (Tables 1-3): last updated 2008 September 3 (M. Skrutskie & R. Cutri) | `rawdata/imaging/2mass/irsa_2mass_explsup_sec3_1b.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec3_1b.html |
| ES-III.1b1 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. III.1.b1 "System Transmission": component transmission data and the camera optical configuration | `rawdata/imaging/2mass/irsa_2mass_explsup_sec3_1b1.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec3_1b1.html |
| ES-III.1c | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. III.1.c "Observatory Site Conditions": last updated 2003 Mar 04 | `rawdata/imaging/2mass/irsa_2mass_explsup_sec3_1c.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec3_1c.html |
| ES-III.2a | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. III.2.a "Scanning Strategy": last updated 2003 March 4 (M. Skrutskie) | `rawdata/imaging/2mass/irsa_2mass_explsup_sec3_2a.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec3_2a.html |
| ES-III.2b | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. III.2.b "Survey Strategy": last update 2003 March 5 (M. Skrutskie) | `rawdata/imaging/2mass/irsa_2mass_explsup_sec3_2b.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec3_2b.html |
| ES-IV.3 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. IV.3 "Atlas Image Generation": last updated 2006 October 10 (the page title still reads "Second Incremental Data Release") | `rawdata/imaging/2mass/irsa_2mass_explsup_sec4_3.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec4_3.html |
| ES-VI.1 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. VI.1 "Comparison of Achieved Performance ... with Level 1 Science Specification": last updated 2003 March 21; the sigma in "10-sigma" is an image (figures/sigma.gif), so the text reads "10-" | `rawdata/imaging/2mass/irsa_2mass_explsup_sec6_1.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec6_1.html |
| ES-VI.2 | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. VI.2 "Photometric Sensitivity" (Table 2): last updated 2005 October 12 | `rawdata/imaging/2mass/irsa_2mass_explsup_sec6_2.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec6_2.html |
| ES-VI.4a | Cutri, R. M., Skrutskie, M. F., Van Dyk, S., Beichman, C. A., Carpenter, J. M., Chester, T., et al., "Explanatory Supplement to the 2MASS All Sky Data Release and Extended Mission Products" (IPAC/Caltech web document; each page carries its own "Last Updated" date), fetched 2026-10-19. Sec. VI.4.a "Absolute Calibration" (Table 1, from Cohen et al. 2003): last updated 2008 December 28 | `rawdata/imaging/2mass/irsa_2mass_explsup_sec6_4a.html` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/sec6_4a.html |
| ESF-III.1b.2 | Explanatory Supplement figure (IMAGE; read visually, not machine-checked): Sec. III.1.b Figure 2: ray trace of the three-channel camera optics | `rawdata/imaging/2mass/figures/seciii1bf2.gif` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/figures/seciii1bf2.gif |
| ESF-III.1b.8 | Explanatory Supplement figure (IMAGE; read visually, not machine-checked): Sec. III.1.b Figure 8: projected alignment of the J, H, Ks arrays on the sky (5" scale bar) | `rawdata/imaging/2mass/figures/seciii1bf8.gif` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/figures/seciii1bf8.gif |
| ESF-III.1b.9 | Explanatory Supplement figure (IMAGE; read visually, not machine-checked): Sec. III.1.b Figure 9: integration-cycle timing vs. the secondary-mirror waveform | `rawdata/imaging/2mass/figures/seciii1bf9.jpg` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/figures/seciii1bf9.jpg |
| ESF-III.2a.1 | Explanatory Supplement figure (IMAGE; read visually, not machine-checked): Sec. III.2.a Figure 1: camera frames vs. a survey tile | `rawdata/imaging/2mass/figures/seciii2af1.jpg` | https://irsa.ipac.caltech.edu/data/2MASS/docs/releases/allsky/doc/figures/seciii2af1.jpg |

## 2MASS: two identical 1.3 m classical Cassegrain telescopes (Mt. Hopkins, CTIO), each with a cryogenic three-channel reimaging camera (J, H, Ks at once through two dichroics; one 256 x 256 NICMOS3 per band, 40 um = 2.0"); freeze-frame scanning survey

**Recommended preset:** Classical Cassegrain, reimaged. D = 1.3 m (primary; 1280 mm clear), eps = 0.178 (232-mm secondary / 1300 mm, DERIVED; no baffles during 2MASS), F = 13.26 DERIVED from the published Cassegrain plate scale 11.97"/mm (f_eff = 17,232 mm; published label f/13.5), primary f/2.0 (R = 5200 mm, paraboloid; drawing only), Cassegrain focus 527 mm behind the primary vertex (back = 0.405 D). Camera: LN2 cryostat behind a ZnSe window; a cryogenic field stop at the Cassegrain focus, one common Infrasil collimating lens, two dichroics in the nearly collimated beam (J reflected first, H reflected by the second, Ks straight through), then six lenses per band forming a pupil image with a cold Lyot stop of 90% of the pupil diameter and the band filter beside it; all 19 lenses spherical CaF2/Infrasil, design F/3.5. W (pupil diameter) NOT FOUND; F_cam = 3.188 DERIVED from 40 um at 1.991"/px (f_eff = 4144 mm; f_cam/f_col = 0.2405). Detector per band: one Rockwell NICMOS3 HgCdTe 256 x 256, 40 um; three co-aligned arrays per camera, rows [1], no gaps. Field 8.5 x 8.5 arcmin (circle 12.1' encloses it). Survey: freeze-frame scanning at 57"/s in declination, secondary sawtooth holds each 1.3 s exposure (1.455 s cycle), step 82.6" (N) / 82.3" (S), six frames per point = 7.8 s; tiles 504" x (6 deg + 8.5'), 273/274 frames; Atlas Images resampled to 1"/px (512 x 1024 px) from the 2" raw pixels. Validate: 1.991"/px (1.980-2.006 by array), 8.5' field, 10-sigma limits J/H/Ks 15.8/15.1/14.3 required, 16.42/15.48/14.81 mean achieved, image FWHM 2.5-2.8". Band: Ks (J and H identical optics; plate scales within 1%).

### Parameters (telescope, camera, detectors)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| telescope_aperture | 1.3 | m (primary mirror; two identical telescopes) | S06, Sec. 2.3, p. 1166 | "2MASS used two custom 1.3 m equatorial telescopes."<br>Note: The camera's cold Lyot stops are 90% of the pupil diameter (S06 Sec. 2.2, under cold_stop below), so the beam that reaches the detectors comes from the central 0.9 x 1.3 = 1.17 m of the primary (DERIVED, assuming the pupil image is the 1.3 m primary). The explorer preset keeps D = 1.3 m; the cold-stop variant is given as preset_alt_coldstop.<br>ALT: 1.3 (ES-III.1a, Sec. III.1.a, para. 1: "The 2MASS project was carried out with two identical 1.3-meter aperture, open-tube, equatorial fork-mount telescopes.")<br>ALT: 1300 mm primary (ES-III.1a, Sec. III.1.a.i Optics: "Primary Mirror: 1300 mm diameter, radius of curvature 5200 mm, conic constant -1.000")<br>ALT: 1.28 (GM20, Sec. 2.1, PDF p. 4: "The parabolic primary mirror has a radius of curvature of R = 5200 mm, and a clear diameter of D1,clear = 1280 mm.") [clear aperture of the northern telescope (Tierras refurbishment)]<br>ALT: 1.3 (S06, Table 1, p. 1164: "1.3 m equatorial Cassegrain")<br>DERIVED: cold-stop-limited aperture 0.9 x 1300 = 1170 mm (0.9 x 1280 = 1152 mm on the GM20 clear aperture). |
| central_obstruction | 0.178 | linear ratio (DERIVED: secondary diameter / primary diameter) | ES-III.1a, Sec. III.1.a.i Optics | "Secondary Mirror: 232 mm diameter, radius of curvature 965.7 mm, conic constant -1.847"<br>Note: What sets eps: the secondary mirror. The telescope carried no light baffles during 2MASS (GM20 Sec. 6.1), and the 200-mm primary hole (GM20) lies inside the secondary's shadow (200/1300 = 0.154). The size of the secondary cell and of its tilt (freeze-frame) mechanism is not published. Whether the cold Lyot stop also masks the centre is not published; if it trims only the outer edge, eps relative to the 1.17 m stopped beam is 232/1170 = 0.198 (DERIVED).<br>ALT: 228 mm secondary clear / 1280 mm primary clear (GM20, Sec. 2.1, PDF p. 4: "The hyperbolic (K = -1.847) secondary mirror has R = 965.7 mm, and D2,clear = 228 mm.")<br>ALT: no baffles during 2MASS (GM20, Sec. 6.1 (Telescope Baffling), PDF p. 16: "the 1.3-m telescope was not equipped with light baffles while the 2MASS and PAIRITEL projects were carried out")<br>ALT: primary hole 200 mm (GM20, Sec. 2, PDF p. 4: "Aiming for a larger FOV was impractical due to vignetting at the primary mirror hole (Dhole = 200 mm).")<br>DERIVED: 232 / 1300 = 0.1785; 228 / 1280 = 0.1781; primary hole 200 / 1300 = 0.154 (smaller, so not the limit); 232 / 1170 = 0.198 against the cold-stopped beam. |
| telescope_focus | classical Cassegrain (paraboloidal primary, hyperboloidal secondary), open tube, equatorial fork mount; the secondary is articulated in declination for freeze-frame scanning |  | S06, Sec. 2.3, p. 1166 | "For each telescope, the primary mirror, composed of Corning ultra-low expansion glass, is parabolic with a radius of curvature of 5200 mm. The secondary conic constant is 1.847 with a radius of curvature of 965.7 mm."<br>Note: Not a Ritchey-Chretien: an RC has a hyperboloidal primary, while the 2MASS primary has conic constant -1.000 (a paraboloid). In the S06 text layer the minus sign of the secondary conic is a control character (dropped from the normalised quote); ES-III.1a and GM20 print -1.847. Paraxial check (DERIVED from the published radii): with the focus 527 mm behind the primary vertex (GM20) the secondary magnification is 6.627, f = 6.627 x 2600 mm = 17,230 mm, plate scale 11.971"/mm, matching S06's 11.97"/mm; the classical-Cassegrain condition K2 = -((m+1)/(m-1))^2 = -1.847 holds at m = 6.570 (back focus 499 mm).<br>ALT: Cassegrain focus mount; articulated secondary (ES-III.1a, Sec. III.1.a, para. 1: "These telescopes have been provided with a Cassegrain focus mount for the infrared cameras and a secondary mirror, which is articulated in the declination direction.")<br>ALT: primary conic -1.000 (paraboloid) (ES-III.1a, Sec. III.1.a.i Optics: "Primary Mirror: 1300 mm diameter, radius of curvature 5200 mm, conic constant -1.000")<br>ALT: 1.3 m equatorial Cassegrain (S06, Table 1, p. 1164: "1.3 m equatorial Cassegrain") |
| focal_ratio | 13.26 | f/# at the Cassegrain focus (DERIVED: f_eff / 1.3 m from the published plate scale; published f/13.5) | S06, Sec. 2.3, p. 1166 | "These optics provide a Cassegrain focal ratio of f/13.5 and a Cassegrain plate scale of 11B97 mm"<br>Note: The two published numbers disagree by 1.8%: f/13.5 x 1.3 m = 17,550 mm would give 11.75"/mm. The paraxial prescription at the 527-mm back focus gives 11.971"/mm (telescope_focus), so the plate scale is the consistent number and f/13.5 a rounded label. The model's final pixel scale does not depend on F (only on F_cam x D).<br>ALT: 13.5 (S06, Sec. 2.2, p. 1164: "A cryogenic field stop lies at the f /13.5 telescope Cassegrain focal plane directly behind the dewar window.")<br>ALT: 13.5 (with 11.94"/mm) (GM20, Sec. 2.1, PDF p. 4: "They provide a Cassegrain focal ratio of f /13.5 and a plate scale of 11.9400 mm") [GM20 text layer: "11.9400 mm-1" = 11.94" mm^-1; 11.94"/mm gives f = 17,275 mm, f/13.29 (DERIVED)]<br>DERIVED: 206264.8 / 11.97 = 17,231.8 mm; / 1300 mm = f/13.255. From GM20: 206264.8 / 11.94 = 17,275.1 mm = f/13.289. Nominal: 13.5 x 1300 = 17,550 mm = 11.753"/mm. |
| effective_focal_length_cassegrain | 17232 | mm (DERIVED from the 11.97"/mm Cassegrain plate scale) | S06, Sec. 2.3, p. 1166 | "Cassegrain plate scale of 11B97 mm"<br>ALT: 17275 (GM20, Sec. 2.1, PDF p. 4: "a plate scale of 11.9400 mm") [11.94"/mm (DERIVED 17,275 mm)]<br>ALT: 17550 (S06, Sec. 2.3, p. 1166: "Cassegrain focal ratio of f/13.5") [13.5 x 1300 mm (DERIVED)]<br>DERIVED: 206264.8 / 11.97 = 17,231.8 mm. |
| primary_focal_ratio | 2.0 | f/# of the primary (DERIVED; drawing only) | ES-III.1a, Sec. III.1.a.i Optics | "Primary Mirror: 1300 mm diameter, radius of curvature 5200 mm"<br>DERIVED: f1 = R/2 = 2600 mm; 2600 / 1300 = f/2.00. Secondary: R = 965.7 mm, f2 = -482.85 mm (convex); at the 527-mm back focus it sits 2190 mm in front of the primary, 410 mm inside the prime focus, where the axial beam is 205 mm wide (DERIVED, paraxial; the 232-mm secondary is 13% larger). |
| cassegrain_focus_position | 527 | mm behind the primary vertex (northern telescope, native focal plane; back/D = 0.405 DERIVED) | GM20, Sec. 2.1, PDF p. 4 | "at the native focal plane, located 527 mm behind the primary vertex"<br>ALT: field stop 10 cm behind the dewar window (S06, Fig. 1 caption, p. 1165: "Light enters through the ZnSe window at right. The Cassegrain focal plane lies 10 cm behind the window at a cryogenic field stop.")<br>DERIVED: 527 / 1300 = 0.405 D. The 2MASS camera position during the survey is not published separately. |
| field | 8.5 x 8.5 (set by the arrays; the cryogenic field stop at the Cassegrain focus is slightly undersized relative to the array images) | arcmin | S06, Sec. 2.2, p. 1164 | "The field stop, located at the overlapping conjugate images of the arrays themselves, is slightly undersized relative to the array images in order to prevent light from scattering from the rough edge of the sapphire array substrate."<br>Note: No corrected or unvignetted telescope field is published for 2MASS. GM20 (Sec. 2), designing a focal reducer for the same telescope, found a field larger than about 0.5 deg impractical because of vignetting at the 200-mm primary hole. For the explorer's circular field use 12.1' (just encloses the 8.50' square array, diagonal 12.01' DERIVED).<br>DERIVED: 256 px x 1.991"/px = 509.7" = 8.49'; diagonal 720.8" = 12.01'. At the Cassegrain focus the array image is 509.7" / 11.97"/mm = 42.6 mm square (the field-stop size, approximately). |
| imager | reimaged, all refractive and cryogenic: field stop at the Cassegrain focus, one common collimating lens, two dichroics in the nearly collimated beam, then per band six lenses that form a pupil image (cold Lyot stop + filter) and reimage the sky on the array |  | M96, ADS abstract | "The low irradiance of astronomical sources, combined with background limited performance of the detectors, mandated a reimaging configuration and the enclosure of the camera optics within the cold volume."<br>ALT: one common lens + six lenses per band (S06, Sec. 2.2, p. 1165: "The first Infrasil lens, common to all bands, relays nearly collimated light to beamsplitting mirrors. Following the beam splitters, the light for each band encounters independent identical sets of six lenses, which relay images of the sky onto the three arrays.")<br>ALT: seven lenses per path (S06, Sec. 2.2, p. 1165: "path to each array traverses seven lenses.")<br>ALT: 19 elements, all spherical (M96, ADS abstract: "The final F/3.5 optical design uses fifteen CaF<SUB>2</SUB> elements and four Infrasil elements in an all-spherical configuration.") [1 common + 3 x 6 = 19 lenses (DERIVED), consistent with S06]<br>ALT: all lenses spherical, Infrasil or CaF2 (ES-III.1b, Sec. III.1.b.i: "The lenses were composed of water-free fused silica (Infrasil) or calcium fluoride. All lens surfaces were spherical.")<br>ALT: LN2 cryostat; ZnSe window (S06, Sec. 2.2, p. 1164: "A liquid nitrogen cryostat encloses all of the 2MASS optical elements and arrays with the exception of the ZnSe dewar entrance window.") |
| collimator | NOT FOUND | mm (focal length NOT FOUND) | S06, Sec. 2.2, p. 1165 | "The first Infrasil lens, common to all bands, relays nearly collimated light to beamsplitting mirrors."<br>Note: The collimator is the single Infrasil lens just behind the field stop, shared by the three bands. Its focal length and the beam diameter are in Milligan et al. (1996), which was not obtained. In the model f_col = F x W. |
| cold_stop | Lyot stop at a pupil image in each band, diameter 90% of the pupil image (pupil diameter W NOT FOUND) |  | S06, Sec. 2.2, p. 1165 | "These calcium fluoride and Infrasil lenses form pupil images at three Lyot stops adjacent to the band-limiting interference filters. The stop diameter is 90% of the pupil diameter to permit some freedom for misalignment of the three stops relative to one another."<br>Note: The pupil (Lyot-stop) diameter in mm is not in any source obtained (Milligan et al. 1996 has the prescription). The model's pixel scale and field do not depend on W (f_col = F W, f_cam = F_cam W). |
| camera_focal_ratio | 3.188 | F_cam = f_eff / D (DERIVED from the mean pixel scale with D = 1.3 m; design F/3.5 for the cold-stopped beam) | S06, Sec. 2.2, p. 1165 | "The average plate scale for all six arrays (three northern and three southern) was 1B991 pixel"<br>Note: F/3.5 (M96) is the design focal ratio of the beam at the detector. With the full 1.3 m aperture the published pixel scale implies f/3.19; with the 90% cold stop (1.17 m) it implies f/3.54, i.e. the design F/3.5 refers to the stopped beam (DERIVED consistency check).<br>ALT: 3.5 (M96, ADS abstract: "The final F/3.5 optical design uses fifteen CaF<SUB>2</SUB> elements")<br>ALT: 2.0" per 40 um pixel (ES-III.1b, Sec. III.1.b.i: "When mounted on the 2MASS telescopes ( Figure 7 ) each pixel subtended approximately 2.0" on the sky.")<br>DERIVED: f_eff = 0.040 mm x 206264.8 / 1.991 = 4143.9 mm; / 1300 = 3.188; / 1170 = 3.542. Reduction f_cam / f_col = f_eff / f_Cass = 4143.9 / 17231.8 = 0.2405. Per band (ES-III.1b Table 2): North J 1.997 -> 3.178, H 2.006 -> 3.164, Ks 1.984 -> 3.199; South J 1.989 -> 3.191, H 1.992 -> 3.186, Ks 1.980 -> 3.205 (all /1.3 m). |
| image_quality_optics | ~90% of a laboratory point source's energy within one 40 um pixel; diffraction limited over the format at Ks, nearly so at J and H (design) |  | ES-III.1b, Sec. III.1.b.i | "For a laboratory point source, the optics concentrated approximately 90% of the image's energy onto a square area defined by one 40 micron NICMOS3 pixel."<br>ALT: diffraction limited at Ks (design) (M96, ADS abstract: "The design is diffraction limited over the full format in the Ks spectral band, and is nearly so in the J and H bands.") |
| dichroic_split | J reflected by the first ("J") dichroic; H transmitted by it and reflected by the second ("H") dichroic; Ks transmitted by both (straight through) |  | ES-III.1b1, Sec. III.1.b1, "Camera optical configuration" | "J-band experiences only a reflection off of the "J-band dichroic." H-band must traverse the J-band dichroic and then experience a reflection off of the "H-band dichroic." Ks band traverses both dichroics."<br>ALT: J reflected first, Ks undeviated (S06, Fig. 1 caption, p. 1165: "Two dichroic mirrors immediately follow this common lens to split the light between the three bandpasses with the J-band light reflected first and the Ks-band light undeviated.")<br>ALT: paths in the ray trace (ES-III.1b1, Sec. III.1.b1: "In Figure 1, the straight-through light path leads to the K s array, the upper path to the J array, and the lower one to H.")<br>ALT: ray trace (IMAGE) (ESF-III.1b.2, Figure 2: "ray trace: one shared front group, a fold to each of two side channels, one straight-through channel; three array housings") (IMAGE)<br>ALT: all three arrays view the same sky (ES-III.1b, Sec. III.1.b.i: "A raytrace ( Figure 2 ) of the system shows that each array viewed the same region of the sky via beamsplitting dichroics.") |
| filters | J: [1.11, 1.4]; H: [1.51, 1.79]; Ks: [2.0, 2.31] | um, 50% transmission points of optics + camera (no atmosphere) | ES-III.1b, Sec. III.1.b.i, Table 1 | "Table 1 - 2MASS 50% Transmission ... J 1.11 - 1.40 um 1.12 - 1.36 * um H 1.51 - 1.79 um 1.51 - 1.78 um K s 2.00 - 2.31 um 2.02 - 2.30 um"<br>Note: One band-limiting interference filter per channel, next to the Lyot stop (near a pupil image, in the reimaged beam). With the atmosphere: J 1.12-1.36 (the red edge is set by H2O and CO2), H 1.51-1.78, Ks 2.02-2.30 um.<br>ALT: filters near each Lyot stop (S06, Fig. 1 caption, p. 1165: "Broadband filters near each Lyot stop primarily define the bands.")<br>ALT: filter near a pupil image (ES-III.1b, Sec. III.1.b.i: "A band-limiting interference filter located near a pupil image established the system bandpass.")<br>ALT: J: 1.235; H: 1.662; Ks: 2.159 (ES-VI.4a, Table 1 (Cohen et al. 2003 isophotal wavelengths, um; bandwidths 0.162, 0.251, 0.262 um): "J 1.235 ± 0.006 0.162 ± 0.001 ... H 1.662 ± 0.009 0.251 ± 0.002 ... K s 2.159 ± 0.011 0.262 ± 0.002")<br>ALT: J: 1.24; H: 1.66; Ks: 2.16 (ES-I.1, Sec. I.1: "capable of observing the sky simultaneously at J (1.24 µm), H (1.66 µm), and K s (2.16 µm).")<br>ALT: J: 1.25; H: 1.65; Ks: 2.16 (S06, Abstract, p. 1163: "in the near-infrared J (1.25 µm), H (1.65 µm), and Ks (2.16 µm) bandpasses")<br>ALT: Ks 2.00-2.31 um (S06, Table 1, p. 1164: "J, H, and Ks (2.00-2.31µm)") |
| detector | type: NICMOS3 HgCdTe (Rockwell); format_px: [256, 256]; pitch_um: 40 | px; um | S06, Sec. 2.2, p. 1164 | "Each 2MASS camera contains three NICMOS3 256 ; 256 HgCdTe arrays manufactured by Rockwell International Science Center, now Rockwell Scientific. These arrays have 40 µm pixel pitch and are sensitive between wavelengths of 0.8 and 2.5 µm."<br>ALT: 40 um pixel (ES-III.1b, Sec. III.1.b.i: "one 40 micron NICMOS3 pixel.")<br>ALT: 256 x 256 (ES-I.1, Sec. I.1: "Each telescope was equipped with a three-channel camera, each channel consisting of a 256×256 array of HgCdTe detectors")<br>ALT: four 128 x 128 quadrants (ES-III.1b, Sec. III.1.b.ii Electronics: "A complete readout of the array, obtained by simultaneous readout of the four independent 128x128 quadrants of the NICMOS3 device, required approximately 51 milliseconds.")<br>DERIVED: 256 x 40 um = 10.24 mm square; 65,536 px per array. |
| n_chips | 3 | arrays per camera, one per band, co-aligned on the same sky through the dichroics (not a mosaic); two cameras (north, south) | ES-III.1b, Sec. III.1.b.i | "Each 2MASS camera consisted of a liquid nitrogen cryostat ( Figure 1 ) which contained three 256x256 NICMOS3 arrays."<br>Note: For the explorer: one 256 x 256 chip, rows [1], no gaps; the three bands are identical copies. The northern H array was replaced in 1999 August with no change of plate scale.<br>ALT: H array replaced 1999, plate scale unchanged (S06, Sec. 2.2, p. 1165: "Even the H-band plate scale remained unchanged at 2B006 pixel") |
| array_registration | common centre within 10"; arrays rotated ~0.2-0.4 deg from north-south so a star crosses one or two columns in its six frames |  | ES-III.1b, Sec. III.1.b.i and Table 3 | "The x-y adjustment permitted the three arrays to have a common center to within 10""<br>ALT: registration < 200 um (< 10") (S06, Sec. 2.2, p. 1165: "which enables the relative registration of the arrays to better than <200 µm, or <1000 on the sky.")<br>ALT: North1: J 0.372, H 0.44, Ks 0.326; North2: J -0.303, H -0.42, Ks 0.265; South: J 0.225, H 0.252, Ks 0.175 (ES-III.1b, Table 3 (deg relative to N-S): "Table 3 - Array rotation angles (degrees relative to North-South) J H Ks Nscans North1 0.372+/-.020 0.440+/-.022 0.326+/-.019 15814")<br>ALT: ~0.3 deg (S06, Sec. 2.2, p. 1165: "During the survey the arrays were rotated 0N3 from the celestial coordinate system so that stars crossed one array column")<br>ALT: alignment figure (IMAGE) (ESF-III.1b.8, Figure 8: "North Array Period 1 ... North Array Period 2 ... South Array; 5" scale bar; J, H, K corners offset by a few arcsec") (IMAGE) |
| readout | gain_e_per_ADU: 8; read_noise_e_CDS: 40; full_well_e: 400000; readout_ms: 51; adc_bits: 16 | electrons; ms; bits | ES-III.1b, Sec. III.1.b.ii Electronics | "The gain of the 2MASS electronics was approximately 8 electrons per analog-to-digital count. The array bias voltage was set to 1.00 V to produce a dynamic range of 50,000 counts or 400,000 electrons. The system read noise in a doubly-correlated difference was 5 counts or 40 electrons."<br>ALT: 4.5 ADU read noise (36 e- DERIVED) (S06, Sec. 2.2, p. 1165: "with a typical readout noise level of 4.5 ADU in a doubly correlated difference image.")<br>ALT: sky noise dominates (ES-III.1b, Sec. III.1.b.ii: "In the standard 1.3 s integration, sky photon noise dominated the read noise in all three bands") |

### Survey technique: freeze-frame scanning and Atlas Images

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| freeze_frame | the telescope scans continuously in declination while tracking in hour angle; the secondary tilts opposite the scan in a sawtooth, holding the image still on the arrays for each 1.3 s exposure, then flies back while the arrays are read and reset |  | ES-III.1a, Sec. III.1.a, para. 1 | "During Survey data-taking the telescope moved continuously in declination at approximately 57´´ s -1 , while tracking in hour angle at the sidereal rate. The articulated secondary executes a sawtooth motion, which freezes the image of the sky on the focal plane during the frame exposures."<br>ALT: secondary tilts during the exposure, flies back after (S06, Sec. 3.2, p. 1167: "During a 1.3 s exposure the secondary mirror tilted smoothly to freeze the 8A5 ; 8A5 field of view relative to the focal plane despite the telescope's declination motion. Aberrations introduced by the secondary tilt were minimal compared with the system's PSF. At the end of a 1.3 s exposure the secondary rapidly tilted back to its start position, while the camera electronics read out and reset the arrays.")<br>ALT: tilts opposite the scan direction (ES-III.2a, Sec. III.2.a, para. 1: "While the entire telescope scanned in the declination direction at a constant right ascension, the telescope's secondary mirror tilted opposite the scan direction and momentarily froze the focal plane image.")<br>ALT: timing diagram (IMAGE) (ESF-III.1b.9, Figure 9: "UMASS Cycle Type 2: Telescope controls frame timing; Secondary Waveform (sawtooth); Reset, Readout, Read1 Integration, Integration time") (IMAGE)<br>DERIVED: during the 1.351 s of data collection the sky moves 57 x 1.351 = 77.0" past the telescope, i.e. 77.0 / 11.97 = 6.4 mm at the Cassegrain focus, which the secondary tilt cancels. The tilt angle of the secondary is not published. |
| scan_rate | 57 | arcsec/s in declination | S06, Sec. 3.2, p. 1167 | "Observations proceeded while the telescope scanned steadily in declination at a rate of 5700 s"<br>ALT: 57 (ES-III.2a, Sec. III.2.a: "The 2MASS arrays imaged the sky while the telescope scanned smoothly in declination at a rate of 57´´ per second.") |
| exposure_per_frame | 1.3 | s (Read_2 - Read_1 difference); plus a 51 ms Read_1 image for bright stars | S06, Sec. 2.2, p. 1166 | "The data system recorded two complete reads of the array: one immediately following the array reset and another 1.3 s later."<br>ALT: Read_2 at 1.351 s after reset (ES-VI.1, Sec. VI.1: "The first read (often referred to as "Read_1" throughout the Supplement) occurred 51 msec after array reset and represents an effective 51 msec exposure image. The second read ("Read_2") occurred 1.351 sec after reset.")<br>ALT: saturation 8-9 mag (1.3 s), 4-5 mag (51 ms) (S06, Sec. 2.2, p. 1166: "The 1.3 s duration exposures saturated for stars between 8-9 mag. The 51 ms exposure extended the unsaturated regime to sources as bright as 4 -5 mag.") |
| frame_cycle | 1.455 | s per frame (1.351 s collecting data, the rest flyback and readout) | S06, Sec. 3.2, p. 1167 | "The frame-to-frame time interval was 1.455 s, of which 1.351 s were used to collect data, with the remainder used for secondary flyback and array readout."<br>ALT: 1.455 (ES-III.2b, Sec. III.2.b.iv Time Requirements: "The integration time for a frame included: two 51 ms resets (one occurred during the secondary flyback period, the second started as the secondary began scanning), one 51 ms "Read_1" (R1) integration, and one 1.3 s "Read_2" (R2) integration. An additional 5 ms of delay was added to allow for overhead and settling. The total dwell time on the sky for a single frame is thus 1.455 s.")<br>ALT: dead time < 0.1 s; 84% of the night on sky (ES-III.2a, Sec. III.2.a: "The dead-time between frames was less than 0.1 sec, and was used for secondary flyback and array reset.")<br>DERIVED: 2 x 0.051 + 0.051 + 1.3 + 0.005 = 1.458 s from the listed pieces (ES-III.2b states 1.455 s). |
| frames_per_point | 6 | frames per sky position; 6 x 1.3 s = 7.8 s total | S06, Table 1, p. 1164 | "6 ; 1.3 s per frame = 7.8 s total"<br>ALT: 7.8 (ES-III.2a, Sec. III.2.a: "The camera imaged each point on the sky six times for a total integration time of 7.8 sec.")<br>ALT: 0 to 7 frames per Atlas pixel (ES-IV.3, Sec. IV.3: "any one pixel in the Atlas Image may represent the average of anywhere from zero to seven frames.")<br>DERIVED: 509.7" frame / 82.6" step = 6.17 (north), / 82.3" = 6.19 (south): six full apparitions, occasionally seven. |
| step_per_frame | north: 82.6; south: 82.3 | arcsec in declination per frame (just under 1/6 of the frame) | ES-III.2b, Sec. III.2.b.i Tile Definitions | "The cameras acquired 273 images of each survey tile in overlapping frames (see Sec IV.4.b Figure 1 ) with a declination step size between frames of 82.6´´ at the northern site and 274 frames with a step size of 82.3´´ at the southern site."<br>Note: The step is a non-integer number of pixels (41.5 px) and the arrays are rotated ~0.3 deg, so the six images of a star fall at different sub-pixel positions in both directions.<br>ALT: 83 (S06, Sec. 3.2, p. 1167: "scan rate thus produced an 8300 spatial offset between frames-slightly smaller than one-sixth of the camera field of view-yielding six independent")<br>ALT: north: 82.6; south: 82.3 (S06, Sec. 3.2, p. 1168: "The step size in declination was slightly different between the northern (82B6 per step) and southern (82B3 per step) hemisphere facilities.")<br>ALT: sub-pixel dithering (S06, Sec. 3.2, p. 1168: "Along the scan direction (declination) subpixel stepping was achieved by setting the telescope scan rate so that each step was a noninteger multiple of the pixel size.")<br>DERIVED: 57"/s x 1.455 s = 82.9"; 82.6 / 1.991 = 41.5 px. |
| tile | ra_width_arcsec: 504; dec_length: 6 deg + one frame (8.5'); frames: north 273, south 274; n_tiles: 59650 | arcsec; deg; frames | ES-III.2b, Sec. III.2.b.i Tile Definitions | "The right ascension width of a tile was 504´´, set by the intersection of the sky coverage of each of the three slightly offset arrays."<br>Note: Tiles overlap by ~10% in RA (~50") and by one frame in declination between declination bands; the tiles were grouped in 6-deg declination bands.<br>ALT: 6 deg + 8.5' (ES-III.2b, Sec. III.2.b.i: "The declination length of each tile was 6° plus one full frame (8.5´) to provide overlap between tiles in adjacent declination "bands".")<br>ALT: 59,650 tiles (ES-III.2b, Sec. III.2.b.i: "The sky was divided into 59,650 unique "tiles" for 2MASS operations")<br>ALT: 8.5' x 6 deg; 273/274 frames (S06, Sec. 3.3, p. 1168: "Scans consisted of 273 (northern site) or 274 (southern site) frames acquired as the telescope scanned steadily in declination. A scan covered a region of sky that was one 8A5 camera field of view wide in right ascension and 6 long in declination.")<br>ALT: 10% RA overlap (ES-III.2a, Sec. III.2.a: "Thus, all 2MASS Tiles overlap by 10% in right ascension (approximately 50´´)")<br>ALT: frames vs tile (IMAGE) (ESF-III.2a.1, Figure 1: "Right Ascension 8.5 arcmin; ~273 frames (6 degrees); Declination") (IMAGE)<br>DERIVED: 273 x 82.6" = 6.26 deg; 274 x 82.3" = 6.26 deg (6 deg + 8.5' + the partial-coverage frames at both ends). 273 x 1.455 s = 397 s = 6.6 min per scan (ES-III.2b: "approximately 7 minutes"). |
| scan_duration | 7 | min per 273-frame scan (approximately, with overhead) | ES-III.2b, Sec. III.2.b.iv Time Requirements | "A 273 frame survey scan required approximately 7 minutes (including overhead)." |
| atlas_images | pixel_arcsec: 1.0; format_px: [512, 1024]; size_arcmin: [8.53, 17.07]; overlap_px: 54; per_tile_per_band: 23 | resampled coadd of the six 1.3 s frames (raw pixel 2.0") | ES-IV.3, Sec. IV.3, para. 1 | "The reduced "Read 2-Read 1" frames for each 6°-long scan were spatially registered and combined into a series of 8.53´×17.07´ (512×1024 pixel, 1´´ per pixel) Atlas Images."<br>Note: Kernel: each 2" camera pixel is spread with a flux-preserving Gaussian smoothing kernel of width h = 0.35 (in units of the camera pixel, by the Fig. 2 caption; 0.7" if L = 2", DERIVED interpretation) onto the 1" grid; h = 0.1 was optimal for point sources, 0.35 adopted for extended sources. The best Atlas-image stars have FWHM ~2.5".<br>ALT: 1.00"/px, 512 x 1024, 54 px overlap (S06, Sec. 4.3, p. 1171: "The output Atlas Images were written to FITS standard images in 512 ; 1024 pixel (1B00 pixel")<br>ALT: common 1" grid for J, H, Ks (S06, Sec. 4.3, p. 1171: "Before frame combination, all J, H, and Ks frames were resampled on the same 1B00 pixel")<br>ALT: 23 images per tile per band (22 x 512x1024 + one 512x698) (ES-II.4, Sec. II.4: "The image data from each Tile are divided into twenty-three separate Atlas Images in each band. Twenty-two of these are 512×1024 (1"/pix) in size, and one is 512×698 (1"/pixel).")<br>ALT: kernel h = 0.35 (ES-IV.3, Sec. IV.3.ii: "Based on point sources, the optimal value for h =0.1. An empirical selection based on the pipeline performance on extended sources suggests h =0.35.")<br>ALT: kernel caption (ES-IV.3, Sec. IV.3, Figure 2 caption: "Figure 2: Gaussian kernel with h =0.35 convolved over pixel with active linear size L =1.0.")<br>ALT: raw pixel L = 2" (ES-IV.3, Sec. IV.3.ii: "where ( x j ,y j ) is the center of the j th pixel with linear scale L =2´´.")<br>DERIVED: 512" = 8.53', 1024" = 17.07'. |

### Published performance (validation targets)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pixel_scale | 1.991 | arcsec/px (mean of the six arrays); nominal 2.0 | S06, Sec. 2.2, p. 1165 | "The average plate scale for all six arrays (three northern and three southern) was 1B991 pixel"<br>ALT: North: J 1.997, H 2.006, Ks 1.984; South: J 1.989, H 1.992, Ks 1.98 (ES-III.1b, Table 2 (arcsec/px): "Table 2 - Array platescales (arcseconds per pixel) J H Ks North1 and 2 1.997 2.006 1.984 South 1.989 1.992 1.980")<br>ALT: max 2.006 (north H), min 1.980 (south Ks) (S06, Sec. 2.2, p. 1165: "with a maximum of 2B006 pixel")<br>ALT: 2.0 (ES-I.1, Sec. I.1: "near-infrared bands with a pixel size of 2.0´´.")<br>ALT: <1% between bands (ES-III.1b, Sec. III.1.b.i: "Platescale varies by <1% between the three bands.")<br>DERIVED: (1.997 + 2.006 + 1.984 + 1.989 + 1.992 + 1.980) / 6 = 1.9913. |
| field_of_view | 8.5 x 8.5 | arcmin (one frame; 256 x 1.991" = 8.49' DERIVED) | S06, Sec. 2.2, p. 1164 | "Two dichroic mirrors within each camera (Fig. 1) permit simultaneous imaging of an 8A5 ; 8A5 field"<br>ALT: tile width 504" = 8.4' (intersection of the three arrays) (ES-III.2b, Sec. III.2.b.i: "The right ascension width of a tile was 504´´")<br>ALT: 8.5' frame (ES-III.2a, Sec. III.2.a: "one camera frame (8.5´) wide in right ascension")<br>DERIVED: 256 x 1.991 = 509.7" = 8.49'; area 0.0200 deg^2. |
| limiting_magnitude_requirement | J: 15.8; H: 15.1; Ks: 14.3 | mag (Vega, 2MASS system), point sources, S/N = 10 (Level 1 requirement, \|b\| > 10 deg) | S06, Abstract, p. 1163 | "yielded a 10 point-source detection level of better than 15.8, 15.1, and 14.3 mag at the J, H, and Ks bands, respectively, for virtually the entire sky."<br>Note: The text layer drops the sigma: "10 point-source" = 10-sigma.<br>ALT: J: 15.8; H: 15.1; Ks: 14.3 (ES-VI.1, Sec. VI.1 table, Photometric sensitivity: "10- at 15.8, 15.1, 14.3 mag at J, H, K s respectively for \|b\|>10°")<br>ALT: J: 15.8; H: 15.1; Ks: 14.3 (S06, Table 1, p. 1164: "15.8, 15.1, and 14.3 mag for J, H, and Ks , respectively")<br>ALT: J: 15.0; H: 14.2; Ks: 13.5 (ES-VI.1, Sec. VI.1 table, Extended Source Catalog: "10- at J<15.0, H<14.2, K s <13.5 mag") [extended sources, 10-sigma] |
| limiting_magnitude_achieved | J: 16.42; H: 15.48; Ks: 14.81 | mag, S/N = 10 (M10), mean over all All-Sky Release tiles (no confusion) | ES-VI.2, Sec. VI.2, Table 2 | "Table 2 - M 10 Statistics for Tiles in the All-Sky Data Release Band Min Max Mean Std.Dev. J 15.787 16.951 16.422 0.135 H 14.821 16.044 15.484 0.175 K s 14.264 15.340 14.808 0.162"<br>Note: Tile-to-tile range: J 15.8-16.95, H 14.8-16.0, Ks 14.3-15.3 mag (std. dev. 0.14-0.18 mag).<br>ALT: 0.5-0.6 mag deeper than required at J and Ks, 0.3 at H (ES-VI.2, Sec. VI.2: "The average magnitudes at which SNR=10 are achieved are 0.5--0.6 mag fainter than the Survey's Level 1 Requirements in the J- and K s -bands, and 0.3 mag fainter in the H-band.") |
| image_fwhm | best: 2.5; Mt_Hopkins_mean_1997_98: 2.8; Mt_Hopkins_mean_after_1999: 2.6; CTIO: [2.5, 2.7] | arcsec FWHM measured on the 2" frames (seeing x optics x 2" pixels x sampling) | ES-III.1c, Sec. III.1.c.ii Image Quality | "The best images for the Mt. Hopkins facility have seeing of ~2.5´´ FWHM, while the average from 1997 to the 1998 monsoon shutdown was 2.8´´ FWHM."<br>Note: For the explorer's seeing input use the atmospheric FWHM (S06 Sec. 2.1 calls 1" FWHM a typical seeing disc; quoted below); the 2.5-2.8" values are what the coarse 2" pixels and sampling deliver.<br>ALT: 2.6 (ES-III.1c, Sec. III.1.c.ii: "Adjustments made at the end of the 1999 monsoon further improved the image quality, and the average seeing improved to 2.6´´ FWHM.")<br>ALT: [2.5, 2.7] (ES-III.1c, Sec. III.1.c.ii: "The CTIO facility consistently achieved ~2.5´´-2.7´´ FWHM.")<br>ALT: 2.5 (S06, Sec. 2.4, p. 1166: "camera optics, and sampling pattern combined to produce a system PSF of 2B5 under the best seeing conditions.")<br>ALT: typical seeing 1" (S06, Sec. 2.1, p. 1164: "with a typical 100 FWHM seeing disc.") |
| total_pixels | 65536 | pixels per band (one 256 x 256 array); 196,608 per camera (DERIVED) | ES-III.1b, Sec. III.1.b.i | "three 256x256 NICMOS3 arrays."<br>DERIVED: 256^2 = 65,536; x 3 = 196,608. |
| etendue | 0.0258 | m^2 deg^2 per band (DERIVED; no published value) | ES-III.1a, Sec. III.1.a.i Optics | "Primary Mirror: 1300 mm diameter ... Secondary Mirror: 232 mm diameter"<br>DERIVED: pi/4 (1.3^2 - 0.232^2) = 1.285 m^2 x (509.7"/3600)^2 = 0.02005 deg^2 -> 0.0258 m^2 deg^2; with the 90% cold stop pi/4 (1.17^2 - 0.232^2) = 1.033 m^2 -> 0.0207. |

### NOT FOUND

- Pupil (Lyot-stop) diameter W and the collimator and camera focal lengths: only their ratio follows from the plate scales (f_cam/f_col = 0.2405 DERIVED). They are in Milligan, Cranton & Skrutskie (1996, SPIE 2863, 2), which was not obtained (SPIE paywall, no open copy; only the ADS abstract). As for HAWK-I, the explorer drawing would need an assumed W (the pixel scale and field do not depend on it).
- Whether the cold Lyot stop also masks the central obscuration (affects eps for the stopped beam).
- Size of the secondary-mirror cell and of the tilt (freeze-frame) mechanism behind it, and the tilt amplitude/angle of the secondary.
- A corrected or unvignetted field of the 1.3 m telescope; the shape and exact size of the cryogenic field stop (only "slightly undersized relative to the array images").
- The 2MASS camera's own back focal distance on the telescope (only the native 527-mm focus of the northern telescope from GM20).
- Southern-telescope clear apertures (GM20 measured the northern telescope only; the telescopes are described as identical).

### Conflicts between sources

- Cassegrain focal ratio: f/13.5 (S06, GM20) vs 11.97"/mm (S06) and 11.94"/mm (GM20) plate scales, which give f/13.26 and f/13.29 with D = 1.3 m (DERIVED). The paraxial prescription at the 527-mm back focus reproduces 11.971"/mm, so f/13.5 is a rounded label.
- Final focal ratio: design F/3.5 (M96) vs 3.19 DERIVED from the pixel scale with D = 1.3 m; with the 90% cold stop (1.17 m) the pixel scale gives 3.54. Not a real conflict if F/3.5 refers to the stopped beam.
- Mirror diameters: primary 1300 mm (ES-III.1a) vs 1280 mm clear (GM20); secondary 232 mm (ES-III.1a) vs 228 mm clear (GM20). Same eps (0.178).
- Read noise per correlated double sample: 40 e- (5 counts, ES-III.1b) vs 4.5 ADU x 8 e-/ADU = 36 e- (S06, DERIVED).
- Frame timing: ES-III.2b lists two 51 ms resets + 51 ms Read_1 + 1.3 s + 5 ms = 1.458 s (DERIVED) but states 1.455 s; S06 gives 1.455 s with 1.351 s collecting.
- Frame step: 82.6" / 82.3" (ES-III.2b, S06 Sec. 3.2) vs 83" (S06 Sec. 3.2, rounded) vs 57"/s x 1.455 s = 82.9" (DERIVED).
- Array rotation: "~0.3 deg" (S06) vs the measured -0.42 to +0.44 deg per array and period (ES-III.1b Table 3; the northern J and H arrays changed sign after the 1999 H-array replacement).
- Band centres: J 1.24 / H 1.66 / Ks 2.16 um (ES-I.1) vs 1.25 / 1.65 / 2.16 (S06 abstract) vs isophotal 1.235 / 1.662 / 2.159 (Cohen et al. 2003 via ES-VI.4a).
- Optics transmission: "~70%" for the integrated optical assembly (ES-III.1b) vs "over 80%" for all lenses combined (ES-III.1b1; lenses only, so not necessarily a conflict).

### Notes

- Telescope model: Cassegrain, D = 1.3 m, eps = 0.178, F = 13.26 (published f/13.5), primary f/2.0; the explorer's "cass" type. The real primary is a paraboloid, the secondary a hyperboloid (K = -1.847): a classical Cassegrain, not a Ritchey-Chretien.
- Camera model: reimaged with an ideal collimator f_col = F W and camera f_cam = F_cam W, F_cam = 3.188. The real camera is a dioptric relay: field stop at the Cassegrain focus, one common lens that nearly collimates the beam, two dichroic beam splitters in that beam, then an identical six-lens group per band that forms a pupil image (Lyot stop + interference filter) and reimages the sky onto a NICMOS3 array. Only the reduction f_cam/f_col = 0.2405 is fixed by the published plate scales.
- Bands: the three channels are optically identical and see the same sky (common centre within 10"); per-array plate scales differ by < 1% (1.980-2.006"/px). One preset serves J, H and Ks; switching band changes only lambda.
- Cold stop: the Lyot stops are 90% of the pupil diameter, so the effective light-collecting aperture is 1.17 m (DERIVED); the design F/3.5 matches this stopped beam. preset_alt_coldstop gives the variant D = 1.17 m, eps = 0.198, F = 14.73, F_cam = 3.542.
- Freeze-frame scanning: instead of stepping and settling, the whole telescope scans steadily north-south at 57"/s while the secondary mirror tilts the other way so the image stands still on the arrays for each 1.3 s exposure; then the secondary snaps back (< 0.1 s, during reset/readout) and the next frame starts 82.6" further along, just under 1/6 of the 8.5' frame. Every point is therefore seen six times (7.8 s), at six different sub-pixel positions (non-integer step + ~0.3 deg array rotation), which the pipeline exploits to build Atlas Images on a 1" grid from 2" pixels.
- Sampling: the raw 2" pixels undersample even 1" seeing; measured frame FWHM is 2.5-2.8". The Atlas Images (1" pixels) are a kernel-smoothed coadd, not a higher-resolution optical image.

Quoted support for the notes (machine-checked):

- lenses concentrated light ~90% in one pixel: ES-III.1b, Sec. III.1.b.i: "the optics concentrated approximately 90% of the image's energy onto a square area defined by one 40 micron NICMOS3 pixel."
- sub-pixel dithering improves Atlas resolution: ES-III.2a, Sec. III.2.a: "This sub-pixel "dithering" improved the ultimate spatial resolution of the final coadded Atlas Images relative to a single undersampled image taken with 2.0´´ pixels."
- six frames per point, 7.8 s: ES-III.2a, Sec. III.2.a: "The camera imaged each point on the sky six times for a total integration time of 7.8 sec."
- cross-scan sub-pixel stepping: S06, Sec. 3.2, p. 1168: "In the cross-scan direction (right ascension) subpixel stepping was achieved by rotating the arrays such that a given star crossed a full column while the source stepped down the array."
- telescopes identical: ES-III.1a, Sec. III.1.a: "two identical 1.3-meter aperture, open-tube, equatorial fork-mount telescopes"
- camera optics detail in Milligan+96: ES-III.1b, Sec. III.1.b: "A detailed description of the 2MASS camera optical design appears in Milligan et al. (1996, SPIE Proceedings Volume 2863, p. 2)."
- identical six-lens set per band: ES-III.1b, Sec. III.1.b.i: "Each optical path had six other lenses. This set of six lenses was identical for each band."
- optical assembly transmission ~70%: ES-III.1b, Sec. III.1.b.i: "All optical elements were anti-reflection coated and the integrated optical assembly transmitted ~70% of the incident light."
- lens transmission > 80%: ES-III.1b1, Sec. III.1.b1, Camera Lens Coatings: "The total transmission for all lenses combined is over 80% (ie, 0.97 7 approximately), across each of the three camera bands."
- isophotal wavelengths (Cohen+03): ES-VI.4a, Sec. VI.4.a: "The isophotal wavelengths, bandpasses, and fluxes for zero magnitude for the three 2MASS bands from Cohen et al. (2003) are listed in Table 1 below."
- step size depends on plate scale: ES-III.2b, Sec. III.2.b.i: "The slight difference in step size results from the very small plate scale differences between the different cameras in each system and the need to obtain precise sub-pixel offsets in each of the six apparitions of a star."
