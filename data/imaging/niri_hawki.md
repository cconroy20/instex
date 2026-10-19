# Imager presets: Gemini North NIRI (f/6, f/14, f/32) and VLT UT4 HAWK-I -- sourced optical parameters

Compiled 2026-10-19 for the IMAGER mode of the instex Instrument Explorer, in the format of `data/imaging/widefield.md`. Model: telescope focus (D, F_tel) -> ideal collimator f_col (= F_tel x W) -> pupil of diameter W (cold stop) -> ideal camera f_cam -> detector; effective focal ratio = f_cam / W; pixel scale = 206265 x p / (D x F_tel x f_cam / f_col). Every number carries a source key, location and a short verbatim quote from a document saved unmodified under `rawdata/imaging/niri/` or `rawdata/imaging/hawki/`; the VLT telescope records VLTSPE, EM1, EM2 and EUT are reused by key from `data/imaging/reimagers.md` (same files). **DERIVED** marks arithmetic done here (shown). Every quote (and every alternative's quote) was machine-checked against the saved file: pdftotext -layout and -raw for PDFs; tag-stripped text, entity-unescaped raw source and raw source for HTML (incl. the ESO archive header pages); the .zmx as is. Normalisation: Unicode NFKC; curly quotes, primes, backticks, dashes, minus, soft hyphens, multiplication/micro/tilde/plus-minus signs mapped to ASCII; whitespace collapsed; a piece also passes with all whitespace removed or after joining hyphenated line breaks. ' ... ' joins non-adjacent pieces. Two ESO figures (HAWK-I_gap.gif, HAWK-I_det_def.gif) have no text layer: their values are marked as read off the figure. Result: 263 quotes checked, 0 failures. Machine-readable twin: `data/imaging/niri_hawki.json` (a `preset` object per preset).

## Completeness summary

**NIRI (three presets: f/6 main, f/14, f/32)**: telescope, pupil, detector, scales and fields complete; collimator and camera focal lengths are NOT published and are DERIVED. Gemini North: D = 7.9 m entrance pupil (Gemini's own Zemax prescription; the undersized M2 is the aperture stop, B01/G96; M1 is 8.1 m), eps = 0.164 DERIVED from the 168-mm hole in the 1024-mm M2 (0.152 from the Zemax model), Cassegrain f/16 with f_eff = 128.12 m (F = 16.22 for the 7.9-m pupil), RC with an f/1.8 primary. Focus: Cassegrain on the ISS, up-looking port at commissioning (H03 Fig. 1) and a side port behind the flat 45-deg science fold in a NOIRLab photo (image ID 20100715); current port NOT FOUND (NIRI unavailable for proposals). Optics: common BaF2/LiF collimator forming a 38-mm pupil at the cold Lyot stop (36 mm in a 2000 page) -> f_col = 616 mm DERIVED; f_cam = 228.8 / 536.8 / 1223.2 mm DERIVED from the scales (final f/6.02, 14.13, 32.19); broadband filters in the converging f/16 beam, narrow-band in the collimated beam. Detector: one Aladdin InSb 1024 x 1024, 27 um, no gaps. Validation: 0.1171 / 0.0499 / 0.0219 "/px (0.0214 with the Altair field lens), 119.9" / 51.1" / 22.4" square. Altair reproduces f/16, pupil size and position, so AO and non-AO presets share the telescope inputs.

**HAWK-I (one preset; GRAAL does not change the optics)**: telescope, focus, detector, gaps, scale and field complete; the internal pupil size W and the individual f_col / f_cam are NOT FOUND (instrument paper blocked). UT4 Nasmyth A: D = 8.0 m (Nasmyth entrance pupil), eps = 1116/8000 = 0.1395 DERIVED (DSM shell 1120 mm -> 0.140), f/15.000, f = 120,000 mm, flat elliptical M3 on the axis (explorer Nasmyth), M1 f/1.8. Optics: all-reflective reimager; the powered 404-mm entrance window images the pupil onto camera mirror M3 = cold stop; final F/4.36 (169.4 um/"), f_cam/f_col = 0.2907 DERIVED; filters directly in front of the detector. Detector: 4 HAWAII-2RG, 2048 x 2048 frames (2040 x 2040 light-sensitive), 18 um (archive header), rows [2, 2]; gaps between active areas 2.90 mm / 17.1" (x) and 2.70 mm / 16.0" (y) DERIVED from the manual's offsets (published "~15"", 2.7 mm design). Validation 0.106 "/px (0.1064 measured, 0.10643 header), 7.5' x 7.5', 16.8 Mpix.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| H03 | Hodapp, K. W., Jensen, J. B., Irwin, E. M., et al. 2003, PASP 115, 1388-1406, "The Gemini Near-Infrared Imager (NIRI)" (publisher PDF, Penta/Acrobat Distiller 2003-11-20, as archived by the ESA Planetary Science Archive; the IOP and UChicago copies refused automated download). Its text layer renders the micro sign as "m" (e.g. "27 mm pixel" = 27 um) and the double prime as "⬙"; "38 mm" (pupil) was checked on the rendered page image | `rawdata/imaging/niri/Hodapp2003_PASP115_1388_NIRI_ESA-PSA-copy.pdf` | https://archives.esac.esa.int/psa/ftp/INTERNATIONAL-ROSETTA-MISSION/EARTH_BASED/EAR-C-MULTI-2-67P-IMG-V1.0/DOCUMENT/INSTDOC/GEMINI_N_NIRI_REF_PAPER.PDF |
| GNI | Gemini Observatory, NIRI instrument home page ("Last Modified: Tuesday, March 12, 2024"; capability summary table; status "Unavailable For Proposals at Gemini North"; fetched 2026-10-19) | `rawdata/imaging/niri/gemini_niri_index.html` | https://www.gemini.edu/instrumentation/niri |
| GNCAP | Gemini Observatory, NIRI "Capability" page ("Updated January 22, 2025"; pixel scales and fields of view, field orientation by ISS port; fetched 2026-10-19) | `rawdata/imaging/niri/gemini_niri_capability.html` | https://www.gemini.edu/instrumentation/niri/capability |
| GNCOMP | Gemini Observatory, NIRI "Components" page ("Updated February 28, 2022"; detector array table, imaging filter table with wheel assignments; fetched 2026-10-19) | `rawdata/imaging/niri/gemini_niri_components.html` | https://www.gemini.edu/instrumentation/niri/components |
| GTEL | Gemini Observatory, "The Telescopes" page ("Updated July 18, 2026"; Instrument Support Structure and Optics sections; fetched 2026-10-19) | `rawdata/imaging/niri/gemini_telescopes.html` | https://www.gemini.edu/observing/telescopes-and-sites/telescopes |
| GZMX | Gemini Observatory, Gemini North telescope prescription "GN Zemax model" GEM_F16_MK.zmx ("GEMINI 8 METER RC, CURVED FIELD"; linked from the Telescopes page; fetched 2026-10-19). Surface 3 = M1, surface 4 = M2 (STOP); ENPD = entrance pupil diameter (mm); DIAM/CLAP/OBSC radii in mm | `rawdata/imaging/niri/gemini_GEM_F16_MK.zmx` | https://www.gemini.edu/sciops/instruments/optics/GEM_F16_MK.zmx |
| GSPEC | Gemini Observatory, "Specifications & Interfaces" page for instruments (ISS ports, optical interface; reached from /sciops/instruments/specifications/, which redirects to /instrumentation/future-instruments/specs-and-documents; fetched 2026-10-19) | `rawdata/imaging/niri/gemini_specs-and-documents.html` | https://www.gemini.edu/instrumentation/future-instruments/specs-and-documents |
| GALT | Gemini Observatory, ALTAIR adaptive optics home page (fetched 2026-10-19) | `rawdata/imaging/niri/gemini_altair.html` | https://www.gemini.edu/instrumentation/altair |
| G96 | Gillett, F. C., Mountain, M., Kurz, R., Simons, D. A., Smith, M., Boroson, T., "The Gemini Telescopes Project", Gemini Project Office report RPT-PS-G0064 (March 22, 1996). DESIGN-ERA values | `rawdata/imaging/niri/Gillett1996_GeminiTelescopesProject_RPT-PS-G0064.pdf` | https://webarchive.gemini.edu/documentation/webdocs/rpt/rpt-ps-g0064.pdf |
| B01 | Buchroeder, R. & Catone, J., "Periscope Design Report, Gemini North and South LGS AO", Preliminary Design Review material, Appendix T (May 24, 2001; final version) | `rawdata/imaging/niri/Buchroeder2001_GeminiLGSAO_PDR_appdxT_PeriscopeDesign.pdf` | https://webarchive.gemini.edu/documentation/webdocs/rev/mcao_pdr/appdxT_periscope_design.pdf |
| GFS | Gemini Observatory, "Instrument Fact Sheet, v. 2016B: NIRI" (Factsheet-NIRI-v1.3, PDF created 2016-09-20) | `rawdata/imaging/niri/gemini_Factsheet-NIRI-v1.3_2016B.pdf` | https://gemini.edu/sciops/instruments/factsheet/Factsheet-NIRI-v1.3.pdf |
| GWCAM | Gemini Observatory web archive, "NIRI Cameras" page ("Last update 2006 September 1; Andrew Stephens, Tom Geballe & Joe Jensen") | `rawdata/imaging/niri/gemini_webarchive_NIRICameraList.html` | https://webarchive.gemini.edu/sciops/instruments/niri/NIRICameraList.html |
| GWINT | Gemini Observatory web archive, "NIRI Introduction" page ("Last update 2006 September 1") | `rawdata/imaging/niri/gemini_webarchive_NIRIIntro.html` | https://webarchive.gemini.edu/sciops/instruments/niri/NIRIIntro.html |
| GWOPT | Gemini Observatory web archive (capture 2021-07-16 of node 10112), NIRI "Optical/Mechanical Layout" page ("NIRI Optical Overview": element-by-element optical chain) | `rawdata/imaging/niri/gemini_webarchive_node10112_NIRI_optomech_layout.html` | https://webarchive.gemini.edu/20210716-node--10112/ |
| GWCOL | Gemini web archive, NIRI Optical Overview pop-up "Collimator Lens" ("Last update August 1, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_CollimatorLens.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/CollimatorLens.html |
| GWF6 | Gemini web archive, NIRI Optical Overview pop-up "f/6 Optics" ("Last update August 3, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_f6Optics.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/f6Optics.html |
| GWF14 | Gemini web archive, NIRI Optical Overview pop-up "f/14 Optics" ("Last update August 4, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_f14Optics.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/f14Optics.html |
| GWF32 | Gemini web archive, NIRI Optical Overview pop-up "f/32 Optics" ("Last update August 4, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_f32Optics.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/f32Optics.html |
| GWPUP | Gemini web archive, NIRI Optical Overview pop-up "Pupil Mask/Filter Wheel" ("Last update August 2, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_PupilMaskWheel.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/PupilMaskWheel.html |
| GWTEL | Gemini web archive, NIRI Optical Overview pop-up "Gemini Telescope" ("Last update August 15, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_GeminiTelescope.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/GeminiTelescope.html |
| GWFW | Gemini web archive, NIRI Optical Overview pop-up "Filter Wheels" ("Last update 2005 June 8 by Andrew Stephens") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_FilterWheel.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/FilterWheel.html |
| GWDET | Gemini web archive, NIRI Optical Overview pop-up "NIR Detector" ("Last update 2006 September 1") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_NIRIDetector.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/NIRIDetector.html |
| GWPV | Gemini web archive, NIRI Optical Overview pop-up "Pupil Viewer Optics" ("Last update 2006 September 1") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_PupilViewer.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/PupilViewer.html |
| GWWIN | Gemini web archive, NIRI Optical Overview pop-up "Entrance Window" ("Last update June 27, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_EntranceWindow.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/EntranceWindow.html |
| GWFL | Gemini web archive, NIRI Optical Overview pop-up "Field Lens" ("Last update July 21, 2000; Colin Aspin") | `rawdata/imaging/niri/gemini_webarchive_niri_overview_FieldLens.html` | https://webarchive.gemini.edu/sciops/instruments/niri/overview/FieldLens.html |
| NLISS | NOIRLab image page "Gemini Instrument Support Structure + instruments" (image ID noirlab-20100715-...; "Release date: July 11, 2020"; caption gives the port of each instrument in the photo; fetched 2026-10-19) | `rawdata/imaging/niri/noirlab_20100715_gemini_ISS_instruments.html` | https://noirlab.edu/public/images/noirlab-20100715-ginirs-gn-instal-5492/ |
| G14A | Gemini Observatory web archive, "2014A Instrument Availability and Target Accessibility" (Call for Proposals 2014A) | `rawdata/imaging/niri/gemini_webarchive_2014A_instrument_availability.html` | https://webarchive.gemini.edu/20210512-sciops--observing-gemini--semester-2014a-call-proposals/2014a-instrument-availability-and-target.html |
| VLTSPE | ESO, "Requirements for VLT UT Instruments", VLT-SPE-ESO-10000-2723, Issue 1 (18.03.2005): Table 3 "Nasmyth focus optical parameters", Sec. 3.2.2 optical image quality, Sec. 3.2.4 light baffling -- SAME FILE as key VLTSPE in data/imaging/reimagers.md (FORS2 used its Table 2, Cassegrain) | `rawdata/presets/uves/VLT-SPE-ESO-10000-2723_is1_Requirements_for_VLT_UT_Instruments.pdf` | https://www.hq.eso.org/sci/facilities/develop/documents/VLT-SPE-ESO-10000-2723_is1.pdf |
| EM1 | ESO, VLT "The primary mirrors" (M1 unit) web page -- SAME FILE as key EM1 in data/imaging/reimagers.md | `rawdata/imaging/fors2/eso_vlt_ut_m1unit.html` | https://www.eso.org/sci/facilities/paranal/telescopes/ut/m1unit.html |
| EM2 | ESO, VLT "The Secondary Mirror, M2 Unit" web page (specification table of the original Dornier M2) -- SAME FILE as key EM2 in data/imaging/reimagers.md | `rawdata/imaging/fors2/eso_vlt_ut_m2unit.html` | https://www.eso.org/sci/facilities/paranal/telescopes/ut/m2unit.html |
| EUT | ESO, "The VLT 8.2-meter Unit Telescopes" web page -- SAME FILE as key EUT in data/imaging/reimagers.md | `rawdata/presets/fors2/eso_vlt_ut_telescopes.html` | https://www.eso.org/sci/facilities/paranal/telescopes/ut.html |
| EM3T | ESO, VLT "The M1 Cell and M3 Tower" web page (fetched 2026-10-19) | `rawdata/imaging/hawki/eso_vlt_ut_m1cellm3.html` | https://www.eso.org/sci/facilities/paranal/telescopes/ut/m1cellm3.html |
| E9837 | ESO public image eso9837c, "Coating and installation of UT1 mirror M3" (photo of 30 July 1998; caption describes the M3 mirror of the identical UTs; fetched 2026-10-19) | `rawdata/imaging/hawki/eso_public_image_eso9837c_UT1_M3.html` | https://www.eso.org/public/images/eso9837c/ |
| HUM | ESO, "HAWK-I User Manual", VLT-MAN-ESO-14800-3486, Issue 118 (M. Berton, F. Bian, P. Hibon, E. Valenti, R. Siebenmorgen & G. Carraro; PDF of 2026-07-11, for Period 118 Phase 1) | `rawdata/imaging/hawki/ESO_HAWKI_UserManual_VLT-MAN-ESO-14800-3486_v118.pdf` | https://www.eso.org/sci/facilities/paranal/instruments/hawki/doc/VLT-MAN-ESO-14800-3486_v118.pdf |
| EHI | ESO, HAWK-I instrument home page (summary; "Last Update: 05.07.21"; fetched 2026-10-19) | `rawdata/imaging/hawki/eso_hawki_index.html` | https://www.eso.org/sci/facilities/paranal/instruments/hawki.html |
| EHO | ESO, HAWK-I "Overview" page ("Last Update: 17.08.23"; fetched 2026-10-19) | `rawdata/imaging/hawki/eso_hawki_overview.html` | https://www.eso.org/sci/facilities/paranal/instruments/hawki/overview.html |
| EHD | ESO, HAWK-I "Instrument Description" page (GRAAL+HAWK-I GLAO mode, detector table, gap; fetched 2026-10-19) | `rawdata/imaging/hawki/eso_hawki_inst.html` | https://www.eso.org/sci/facilities/paranal/instruments/hawki/inst.html |
| EHGAP | ESO, HAWK-I figure "gap between detectors" HAWK-I_gap.gif (linked from the Instrument Description page; image only, no text layer: values were read off the figure, partly confirmed by tesseract OCR) | `rawdata/imaging/hawki/eso_hawki_img_HAWK-I_gap.gif` | https://www.eso.org/sci/facilities/paranal/instruments/hawki/img/HAWK-I_gap.gif |
| EHDET | ESO, HAWK-I figure "Detectors definition" HAWK-I_det_def.gif (quadrant layout Q4 Q3 over Q1 Q2; image only) | `rawdata/imaging/hawki/eso_hawki_img_HAWK-I_det_def.gif` | https://www.eso.org/sci/facilities/paranal/instruments/hawki/img/HAWK-I_det_def.gif |
| C05 | Casali, M., Pirard, J.-F., Kissler-Patig, M., et al. 2005, The Messenger 119, 6-8, "Wide Field Infrared Imaging on the VLT with HAWK-I" (written after the Final Design Review; DESIGN values) | `rawdata/imaging/hawki/Casali2005_Msngr119_6_HAWK-I.pdf` | http://www.eso.org/sci/publications/messenger/archive/no.119-mar05/messenger-no119-6-8.pdf |
| S11 | Siebenmorgen, R., Carraro, G., Valenti, E., et al. 2011, The Messenger 144, 9-12, "The Science Impact of HAWK-I" | `rawdata/imaging/hawki/Siebenmorgen2011_Msngr144_9_HAWK-I.pdf` | http://www.eso.org/sci/publications/messenger/archive/no.144-jun11/messenger-no144-9-12.pdf |
| A06 | Arsenault, R., et al. 2006, The Messenger 123, 11-15, "The VLT Adaptive Optics Facility Project: Adaptive Optics Modules" (GRAAL concept) | `rawdata/imaging/hawki/Arsenault2006_Msngr123_11_AOF_AOmodules.pdf` | http://www.eso.org/sci/publications/messenger/archive/no.123-mar06/messenger-no123-11-15.pdf |
| A13 | Arsenault, R., et al. 2013, The Messenger 151, 14-19, "Delivery of the Second Generation VLT Secondary Mirror (M2) Unit to ESO" (the deformable secondary mirror, DSM) | `rawdata/imaging/hawki/Arsenault2013_Msngr151_14_DSM_M2unit.pdf` | http://www.eso.org/sci/publications/messenger/archive/no.151-mar13/messenger-no151-14-19.pdf |
| A14 | Arsenault, R., et al. 2014, The Messenger 156, 2-6, "The Adaptive Optics Facility Module GRAAL on its Way to Final Validation" | `rawdata/imaging/hawki/Arsenault2014_Msngr156_2_GRAAL.pdf` | http://www.eso.org/sci/publications/messenger/archive/no.156-jun14/messenger-no156-2-6.pdf |
| A17 | Arsenault, R., et al. 2017, The Messenger 168, 8-14, "The Adaptive Optics Facility: Commissioning Progress and Results" (UT4 with the new M2 unit; HAWK-I plate scale check) | `rawdata/imaging/hawki/Arsenault2017_Msngr168_8_AOF_commissioning.pdf` | https://www.eso.org/sci/publications/messenger/archive/no.168-jun17/messenger-no168-8-14.pdf |
| HDR0 | ESO Science Archive, FITS header of HAWK-I raw science frame HAWKI.2025-01-04T01:05:24.808 (Ks, AutoJitter, OBS AOMODE = NO_AO; primary header + 4 chip extensions), as served by the archive header service (HTML) | `rawdata/imaging/hawki/eso_archive_hdr_HAWKI.2025-01-04T01-05-24.808_NO_AO.html` | https://archive.eso.org/hdr?DpId=HAWKI.2025-01-04T01:05:24.808 |
| HDR1 | ESO Science Archive, FITS header of HAWK-I raw science frame HAWKI.2025-02-07T02:23:40.299 (OBS AOMODE = GLAO, GRAAL high-order loop closed; acquisition template HAWKI_img_acq_LGS_MoveToPixel), archive header service (HTML) | `rawdata/imaging/hawki/eso_archive_hdr_HAWKI.2025-02-07T02-23-40.299_GLAO.html` | https://archive.eso.org/hdr?DpId=HAWKI.2025-02-07T02:23:40.299 |

## Gemini North / NIRI f/6 camera (main wide-field NIRI preset; seeing-limited)

**Recommended preset:** D = 7.9 m (Gemini North entrance pupil: the undersized secondary is the aperture stop; M1 is 8.1 m), eps = 0.164 (DERIVED: the 168-mm central hole in the 1024-mm M2 stop, which projects to 1.30 m in the pupil; the Zemax prescription gives 0.152), Cassegrain f/16 (f_eff = 128,120 mm, so F = 16.22 for the 7.9-m pupil; Altair reproduces the same f/16 beam), Ritchey-Chretien with an f/1.8 primary, on the ISS: up-looking port (direct Cassegrain) or a side port behind a flat 45-deg science fold. Reimaged: common collimator forming a 38-mm pupil image at the cold Lyot stop (pupil wheel) -> f_col = 16.22 x 38 = 616 mm (DERIVED; not published); f/6 camera f_cam = 229 mm (DERIVED from the pixel scale; 6 x 38 = 228 mm from the label), final f/6.02. Broadband filters sit in the converging f/16 beam before the collimator (FW1), narrow-band filters in the collimated beam (FW2). Detector: one Aladdin InSb 1024 x 1024, 27 um, rows [1], no gaps. Validate: 0.1171"/px, 119.9" square, 1.05 Mpix.

| explorer input | value |
|---|---|
| D_m | 7.9 |
| D_note | entrance pupil set by the undersized M2 (Gemini Zemax ENPD 7900); M1 is 8.1 m |
| eps | 0.164 |
| eps_note | 168-mm M2 central hole / 1024-mm M2 stop (DERIVED); 0.152 from the Zemax prescription |
| F | 16.22 |
| F_note | f_eff / 7.9 m (DERIVED); Gemini label f/16 |
| f_eff_mm | 128120 |
| telescope_type | Cassegrain (Ritchey-Chretien), Gemini North ISS; up-looking port (direct) or side port via a flat 45-deg science fold |
| focus | Cassegrain |
| primary_F | 1.8 |
| field_limit_arcmin | bottom_port_diameter: 10; side_port_diameter: 7 |
| imager | reimaged |
| W_mm | 38 |
| W_note | pupil image at the cold Lyot stop (H03, GFS); 36 mm in a 2000 web page |
| f_col_mm_DERIVED | 616.3 |
| f_cam_mm_DERIVED | 228.8 |
| effective_F_DERIVED | 6.02 |
| camera_label | f/6 |
| filters | broadband: converging f/16 beam before the collimator (FW1); narrow-band: collimated beam, tilted 5 deg (FW2); pupil wheel FW3 at the 38-mm pupil |
| chip_nx | 1024 |
| chip_ny | 1024 |
| pitch_um | 27 |
| n_chips | 1 |
| rows | [1] |
| gaps | none (single monolithic array) |
| pixel_scale_arcsec | 0.1171 |
| fov_arcsec | [119.9, 119.9] |
| total_pixels | 1048576 |
| ao | none (seeing-limited) |

### Parameters

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| telescope_aperture | 7.9 | m (entrance pupil diameter of the Gemini North prescription; the undersized secondary M2 is the aperture stop) | GZMX, header (ENPD) and surface 4 (STOP) | "ENPD 7900 ... SURF 4 STOP"<br>ALT: M2 = aperture stop (B01, Sec. 1.2 General: "the secondary mirror of the telescope, and in some cases reimage the secondary mirror, which is the aperture stop of the Gemini telescope")<br>ALT: pupil stop at M2 (IR configuration) (G96, Sec. 1 (IR configuration paragraph): "The IR configuration includes thin crosssection secondary vanes, a pupil stop at the secondary mirror")<br>ALT: 8.1 (GTEL, Optics: Primary Mirrors: "Primary Mirrors: Each mirror is an f/1.8, 8.1 m diameter, 20 cm thick meniscus") [M1 physical diameter]<br>ALT: 8.0 (G96, Sec. 1 item 1: "The optics configuration for the Gemini telescopes is that of a 8-m diameter F/1.8 primary mirror") [1996 design statement]<br>ALT: 8.2 (GWTEL, NIRI Optical Overview: Gemini Telescope: "On Gemini, science instruments are mounted at the cassegrain focus below the 8.2 meter primary mirror.") [2000 NIRI web page; conflicts with 8.1 m (GTEL) and 8 m (G96)]<br>DERIVED: 128120 mm / 16 = 8007.5 mm (the "f/16" label corresponds to 8.0 m, not to the 7.9-m IR pupil). Zemax M2 clear semi-diameter 511.97 mm (DIAM 511.969391; CLAP outer 512) images to the 3950-mm entrance-pupil semi-diameter: pupil magnification 7.715. NIRI camera names fit the 7.9-m pupil: the published pixel scales give final f/6.02, f/14.13, f/32.19 with D = 7.9 m (f/5.95, 13.95, 31.79 with 8.0 m). |
| central_obstruction | 0.164 **[DERIVED]** | linear ratio (DERIVED: 168-mm hole in the 1024-mm M2 stop) | B01, Sec. 1.2 General | "Therefore, the secondary mirror has a 168 mm diameter hole through it"<br>Note: What sets eps: the 168-mm central hole in the secondary (M2 is the aperture stop; the hole is there so IR instruments see cold sky through the periscope rather than their own reflection, B01/GTEL). The sky periscope behind the hole carries no focused light (B01: "without focused light"). No Gemini document states eps directly.<br>ALT: 0.168-m M2 hole, 1.2-m M1 hole (G96, Sec. 1 item 1: "with a 1.2 m diameter central hole made of Corning ULETM glass, together with a 1.02 m diameter, articulated, SiC secondary mirror with a 0.168-m diameter central hole")<br>ALT: 0.152 (Zemax: M1 obscuration radius 600 mm; M2 inner clear radius 77.55 mm) (GZMX, surfaces 3 (M1) and 4 (M2): "OBSC 0 600 ... CLAP 77.55 512") [600/3950 = 0.1519; 77.55/512 = 0.1515 (DERIVED). The prescription models a 155-mm M2 inner aperture, smaller than the documented 168-mm hole.]<br>ALT: 1.18-m M1 central hole (GWTEL, NIRI Optical Overview: Gemini Telescope: "The f/16 telescope beam passes through the 1.18 meter diameter central primary hole")<br>ALT: M2 sky periscope (IR) / IR baffle 1124.6 mm (GTEL, Optics: Baffles: "The IR mode (retracted) works at 3.5 arcmin with retracted diameter 1124.6mm. There is also a sky periscope at the center of the secondary mirror for IR instruments to see sky rather than the primary's central obstruction.") [1124.6/7900 = 0.142 (DERIVED): the retracted IR baffle shadow is smaller than the projected M2 hole, so it does not set eps]<br>DERIVED: 168 mm / 1023.94 mm (Zemax M2 clear diameter, 2 x 511.97) = 0.1641; the hole projects to 168 x 7.715 = 1296 mm in the 7.9-m entrance pupil, larger than the 1.2-m M1 central hole (1.2/7.9 = 0.152), the 1.0-m M2 itself and the retracted IR baffle (1124.6 mm). Alternatives: 0.168/1.02 = 0.165; 0.168/1.0 = 0.168; Zemax 0.152; 1.2/8.1 = 0.148. |
| telescope_focus | Cassegrain (Ritchey-Chretien), f/16, on the Instrument Support Structure (ISS); NIRI on the up-looking (bottom) port at commissioning, on a side port (via the flat 45-deg science fold) in a NOIRLab photo (image ID 20100715, released 2020) |  | GTEL, Instrument Support Structure; Optics | "Instruments are mounted at the Cassegrain focus on the instrument support structure (ISS). ... Telescope Optical Configuration: Ritchey-Chretien Cassegrain."<br>Note: Explorer mapping: draw a Cassegrain (convex M2, focus behind M1). On a side port a FLAT 45-deg science fold inside the ISS, below M1 (not on the elevation axis), turns the converging f/16 beam sideways; it changes neither F nor the scale, so the explorer's Nasmyth-style fold is only a drawing option. NIRI's present port is NOT FOUND (NIRI is listed as unavailable for proposals, GNI).<br>ALT: science fold = flat 45-deg mirror to a side port, or retracted for the up-looking port (GTEL, Optics: Science Fold Mirrors: "Science Fold Mirrors: These are plane mirrors at 45 degrees that reflect the converging beam near the Cassegrain focus of each telescope to an instrument mounted on one of four side-looking ports of the Instrument Support Structure (ISS) or may be retracted to allow the beam to reach the up-looking instrument on the bottom port of the ISS.")<br>ALT: ports: side Faces 3 and 5, bottom Face 1 (GSPEC, Mechanical Interfaces: Ports: "There are three ports on the ISS available for science instruments: `side looking' or 'side ports' on Faces 3 and 5, and an `upward looking' or 'bottom port' on Face 1")<br>ALT: up-looking port (commissioning, Fig. 1) (H03, p. 1389, Fig. 1 caption: "NIRI mounted on the uplooking port of the Gemini North telescope ISS.")<br>ALT: up-looking port needed for polarimetry (H03, p. 1393, Sec. 3.5: "polarimetric observations can be performed only when NIRI is mounted on the up-looking ISS port (as in Fig. 1).")<br>ALT: either port; up-looking preferred at 3-5 um (GWTEL, NIRI Optical Overview: Gemini Telescope: "It will be possible to mount NIRI on either a side-looking or upward looking port, the latter being preferred for 3-5um thermal IR observations")<br>ALT: left side port (photo, image ID 20100715, released 2020) (NLISS, caption: "and the Near-Infrared Imager (NIRI) is on the left side port.")<br>ALT: both port types in use (orientation table) (GNCAP, Field Orientation: "The NIRI field orientation is determined by which telescope port (bottom or side) NIRI is installed on, and if on the bottom port, whether or not Altair is used.")<br>ALT: Altair and GCAL occupy two side ports (G14A, Instrument availability: "At each site, the calibration unit and the Adaptive Optics system use two of the side ports, leaving two side-looking and one uplooking port for other instrumentation.") |
| telescope_focal_ratio | 16.22 **[DERIVED]** | f/# (DERIVED: f_eff / 7.9-m entrance pupil); nominal label f/16 | GTEL, Optics | "Effective Focal Lengths of Telescopes at Cassegrain Focus: 128.12 m (f/16)."<br>ALT: 16 (G96, Sec. 1 item 1: "providing an F/16 cassegrain focal plane 4 meters behind the primary mirror")<br>ALT: f/16 preserved by Altair (GALT, introduction: "Deploying ALTAIR is "transparent" for the science instrument, as it reproduces the telescope focal ratio (f/16), pupil size and pupil position.")<br>DERIVED: 128120 / 7900 = 16.218 (16.0 only for an 8.0-m pupil). Gemini quotes f/16 throughout. |
| telescope_focal_length | 128120 | mm (Cassegrain) | GTEL, Optics | "Effective Focal Lengths of Telescopes at Cassegrain Focus: 128.12 m (f/16)."<br>ALT: 1.610 "/mm (GTEL, Optics: "Plate Scale at Cassegrain: 1.610 arcsec/mm.")<br>ALT: 1.611 "/mm (GSPEC, Optical Interface: "The plate scale at focus corresponds to 1.611 arc seconds per mm.")<br>ALT: 128093 (DERIVED from the prescription) (GZMX, surfaces 3, 4: "CURV -3.47169182486e-005 ... CURV -0.0002386520929789 ... DISZ -12542.664369") [R1 = -28804.4 mm, R2 = -4190.2 mm, separation 12542.66 mm: EFL = 128,093 mm, 1.6103"/mm, focus 3996 mm behind the M1 vertex (DERIVED, paraxial two-mirror formula)]<br>DERIVED: 206264.8 / 128120 = 1.6099 "/mm. |
| primary_focal_ratio | 1.8 | f/# of M1 (drawing only) | GTEL, Optics: Primary Mirrors | "Primary Mirrors: Each mirror is an f/1.8, 8.1 m diameter"<br>ALT: R = -28804.4 mm (GZMX, surface 3 (M1): "CURV -3.47169182486e-005") [f(M1) = 14402 mm; /8.1 m = f/1.778, /7.9 m = f/1.823 (DERIVED)] |
| field_limits | 10 arcmin diameter (bottom port), 7 arcmin (side ports) | arcmin | GTEL, Optics | "Field of View at Instrument Focal Plane: Maximum 10 arcmin diameter on the bottom port, and 7 arcmin diameter on the side ports due to science fold mirror size."<br>Note: All NIRI fields (at most 2 arcmin square) lie well inside; the NIRI field is set by the detector (GNCAP footnote "For full (1024 x 1024) array"). |
| optics_type | reimaged: CaF2 entrance window -> beam splitter (pick-off) -> focal-plane mask wheel -> ZnSe field lens -> 2 folds -> filter wheel 1 (converging f/16 beam) -> BaF2/LiF collimator -> filter wheel 2 (collimated) -> pupil wheel (cold Lyot stop, 38 mm pupil) -> steering mirror -> one of three refractive cameras (f/6, f/14, f/32) -> detector |  | H03, p. 1388, Sec. 1 | "has a common collimator and cold stop, and three cameras of different focal length."<br>ALT: optical chain (GWOPT, NIRI Optical Overview: "After filter wheel #1, the beam is collimated by a collimator lens and next passes through the second filter wheel, #2, where narrow band (interference) filters will be located. Next in the optical chain is a pupil mask/filter wheel")<br>ALT: collimator = 2-element LiF/BaF2 lens, ~55 mm (GWCOL, Collimator Lens: "The NIRI collimator lens is a two element lens made of LiF and BaF2. ... They both have a diameter of ~55mm.")<br>ALT: cameras refractive, telecentric (H03, p. 1391, Sec. 3.3: "NIRI uses three cameras for the three different pixel scales. ... and are designed to be tele- centric") |
| pupil_diameter | 38 | mm (image of the Gemini pupil = M2, at the cold Lyot stop in the pupil wheel) | H03, p. 1390, Sec. 3.3 | "forming a 38 mm diameter image of the Gemini telescope pupil in the plane of the pupil wheel, where the cold Lyot stops"<br>ALT: 38 (GFS, Components: "Filter wheel #3 in the pupil plane holding the a 38 mm cold stop")<br>ALT: 36 (GWPUP, Pupil Mask/Filter Wheel: "The nominal pupil image has a diameter of 36mm.") [2000 web page; conflicts with 38 mm]<br>ALT: pupil = image of M2 (GWPV, Pupil Viewer Optics: "to produce an image of the pupil (the Gemini secondary, M2) on the near-IR detector.") |
| collimator_focal_length | 616 **[DERIVED]** | mm (DERIVED: F_tel x W; not published) | H03, p. 1390, Sec. 3.3 | "forming a 38 mm diameter image of the Gemini telescope pupil"<br>DERIVED: 16.218 x 38 = 616.3 mm (608 mm with the nominal f/16; 583.8 mm with the 36-mm pupil of GWPUP). No source gives the collimator focal length. |
| filter_location | broadband filters in filter wheel 1 in the converging f/16 beam (before the collimator, not tilted); narrow-band filters in filter wheel 2 in the collimated beam (tilted 5 deg); some filters, the cold stop and grisms in filter wheel 3 at the pupil |  | H03, p. 1390, Sec. 3.3 | "NIRI has one filter wheel in front of the collimator, i.e., in the f/16 beam, and another filter wheel in the collimated beam."<br>Note: The current filter table (GNCOMP) lists 8 filters in FW1 (J, H, K, Ks, K', L', M' ...), 10 in FW2 and 10 in FW3 (e.g. Y, HeI, Pa gamma); counts read off the table.<br>ALT: FW1 broadband, non-tilted (GFS, Components: "Field lens and then filter wheel #1. This filter wheel is for broadband non-tilted filters")<br>ALT: FW2 tilted, collimated (GFS, Components: "Filter wheel #2, holding tilted filters (to avoid reflections) in the collimated beam.")<br>ALT: FW1 uncollimated; FW2 collimated, narrow band (GWFW, Filter Wheels: "Filter wheel #1 is located immediately after the two fold mirrors and is in the uncollimated telescope beam. ... Filter wheel #2 is located after the collimator lens in the collimated beam and will hold narrow band near-IR filters")<br>ALT: three wheels (GNCOMP, Imaging Filters: "NIRI contains two filter wheels (FW1, FW2) and a pupil mask wheel (FW3)") |
| detector | Aladdin InSb (Hughes SBRC / Raytheon), 1024 x 1024, 27 um |  | GNCOMP, Detector Array table | "Aladdin InSb (Hughes SBRC) ... 1024x1024 27-micron pixels"<br>ALT: 1024 x 1024 Aladdin InSb, 27 um (GWDET, NIR Detector: "The NIRI near-IR science detector is a 1024x1024 Aladdin InSb array with 27 micron pixels")<br>ALT: Aladdin II InSb 1024 x 1024 (H03, p. 1388, abstract: "is an Aladdin II InSb 1024 # 1024 pixel device sensitive from 1.0 to 5.5") ["#" = multiplication sign in the text layer; "5.5 mm" = 5.5 um] |
| chip_format | Nx: 1024; Ny: 1024 | px | GNCOMP, Detector Array table | "1024x1024 27-micron pixels"<br>ALT: full array (GNCAP, footnote 2 to the pixel-scale table: "2 For full (1024 x 1024) array") |
| pixel_pitch | 27 | um | GNCOMP, Detector Array table | "1024x1024 27-micron pixels"<br>ALT: 27 (H03, p. 1391, Sec. 3.3: "one 27 mm pixel for each filter") [text layer renders "27 um" as "27 mm"] |
| n_chips | 1 | chip (monolithic, no gaps) | GWDET, NIR Detector | "The NIRI near-IR science detector is a 1024x1024 Aladdin InSb array"<br>Note: rows [1]; no inter-chip gaps (quadrant boundaries of the single array are read-out boundaries only). |
| camera_name | f/6 | camera label (final f-ratio on the detector) | H03, p. 1388, Sec. 1 | "The first, named f/6 after the final f-ratio on the detector"<br>Note: H03 names the f/6 camera "after the final f-ratio on the detector"; the f/14 and f/32 labels follow the same rule.<br>ALT: f/6, f/14, f/32 (GWOPT, NIRI Optical Overview: "into one of three camera lens units giving the three pixel scales available (i.e. f/6 , f/14 and f/32 giving 0.116, 0.050 and 0.022 arcseconds/pixel, respectively)") |
| camera_lens | 4-element refractive (BaF2, ZnSe, LiF, ZnS), ~80 mm diameter, 2 aspheric surfaces |  | GWF6, f/6 Optics | "The f/6 camera lens is a multi-component (4) lens of diameter ~80mm made of BaF2, ZnSe, LiF and ZnS." |
| camera_focal_length | 228.8 **[DERIVED]** | mm (DERIVED; not published) | GNCAP, Pixel Scales and Field of View table | "f/6 0.1171 119.9 x 119.9"<br>DERIVED: f_eff = 206264.8 x 0.027 mm / 0.1171" = 47,559 mm; f_cam = f_eff x W / D = 47,559 x 38 / 7900 = 228.8 mm (= f_eff x f_col / f_tel = 47,559 x 616.3 / 128120). With the label: 6 x 38 = 228 mm. |
| effective_focal_ratio | 6.02 **[DERIVED]** | final f/# (DERIVED, D = 7.9 m) | GNCAP, Pixel Scales and Field of View table | "f/6 0.1171 119.9 x 119.9"<br>DERIVED: 47,559 / 7900 = 6.020 (label f/6); 5.945 with D = 8.0 m. f_cam / f_col = 0.3712. |
| ao_use | seeing-limited only (not offered with Altair); guiding by the peripheral WFS |  | GNI, Capability Summary table | "f/6 0.117"/pixel 120"x120" not offered with AO"<br>ALT: PWFS guiding at f/6 (H03, p. 1390, Sec. 3.2: "In practice, guiding for the f/6 camera is provided by the Gemini peripheral wave-front sensors.") |

### Validation targets

| quantity | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pixel_scale | 0.1171 | arcsec/px (full array, average value) | GNCAP, Pixel Scales and Field of View table | "f/6 0.1171 119.9 x 119.9"<br>Note: GWCAM: "FOVs and pixels size can change by +/- 0.3%, depending on how and where the instrument is mounted; the above are average values."<br>ALT: 0.117 (GNI, Capability Summary table: "f/6 0.117"/pixel 120"x120"")<br>ALT: 0.1171 (GWCAM, NIRI Cameras table: "f/6 0.1171 119.9 x 119.9")<br>ALT: 0.116 (GWF6, f/6 Optics: "at a pixel scale of 0.116"/pixel and a fov of ~2'") [2000 design-era value] |
| field_of_view | 119.9 | arcsec square (full 1024 x 1024 array) | GNCAP, Pixel Scales and Field of View table | "f/6 0.1171 119.9 x 119.9"<br>ALT: 120 x 120 (GNI, Capability Summary table: "f/6 0.117"/pixel 120"x120" not offered with AO")<br>DERIVED: 1024 x 0.1171" = 119.9" |
| total_pixels | 1048576 | px | GNCOMP, Detector Array table | "1024x1024 27-micron pixels"<br>DERIVED: 1024^2 = 1,048,576 (1.05 Mpix) |

### NOT FOUND

- Collimator and camera focal lengths in mm: no source found (Hodapp et al. 1998/2000 SPIE papers paywalled). f_col = 616 mm and f_cam are DERIVED (F_tel x W and f_eff x W / D).
- Which ISS port NIRI occupies now: commissioning on the up-looking port (H03 Fig. 1), left side port in the NOIRLab photo (image ID 20100715); NIRI is listed "Unavailable For Proposals at Gemini North" (GNI) and no current port assignment was found. The Gemini Observatory Archive (which would give INPORT in the headers) refused anonymous access.
- A published central-obscuration ratio for Gemini North: eps = 0.164 is DERIVED from the 168-mm M2 hole (B01, G96) and the Zemax M2 clear aperture; the Zemax model itself gives 0.152.
- Shape and central obscuration of the NIRI cold Lyot stop (only its 38-mm size is published).

### Conflicts between sources

- Aperture: 7.9 m entrance pupil (GZMX, M2 is the stop) vs 8.1 m M1 (GTEL) vs 8 m (G96 design; 128.12 m / f/16 = 8.0075 m) vs 8.2 m (GWTEL, 2000 page, wrong for Gemini).
- Central obstruction: 168-mm M2 hole -> 0.164 (DERIVED) vs Zemax inner M2 aperture 77.55-mm radius / M1 obscuration 600-mm radius -> 0.152 vs 1.2/8.1 = 0.148; M1 hole 1.2 m (G96) vs 1.18 m (GWTEL).
- Telescope focal ratio: f/16 nominal (GTEL, G96, GALT) vs 16.22 DERIVED for the 7.9-m pupil; plate scale 1.610 "/mm (GTEL) vs 1.611 (GSPEC) vs 1.6099 DERIVED from 128.12 m vs 1.6103 from the Zemax EFL 128,093 mm.
- Pupil (cold stop) diameter: 38 mm (H03, GFS) vs 36 mm "nominal pupil image" (GWPUP, 2000).
- Pixel scales: 0.1171 / 0.0499 / 0.0219 "/px (GNCAP, GWCAM, average values, +/-0.3% with mounting) vs 0.117 / 0.050 / 0.022 (GNI, H03, GFS) vs 0.116 (f/6, GWOPT, GWF6, 2000).
- Primary diameter for f/1.8: 8.1 m (GTEL) gives f/1.778 from the Zemax radius; f/1.823 on the 7.9-m pupil (DERIVED).

### Notes

- Explorer mapping (all three presets): D = 7.9, eps = 0.164, F = 16.22 (f_eff = 128,120 mm), Cassegrain, reimaged with W = 38 mm, f_col = 616.3 mm; f_cam = 228.8 (f/6), 536.8 (f/14), 1223.2 mm (f/32), DERIVED so that the model reproduces the published scales exactly with p = 27 um. Using the camera labels instead (f_cam = 228, 532, 1216 mm) gives 0.1175, 0.0504, 0.0220 "/px (+0.3, +0.9, +0.6%).
- The f/6 and f/14 camera labels match the final focal ratios only for the 7.9-m pupil (DERIVED final f/6.02, 14.13, 32.19), which supports D = 7.9 m as the IR pupil.
- Altair (Gemini North AO) "reproduces the telescope focal ratio (f/16), pupil size and pupil position" (GALT), so the f/14 and f/32 presets keep the same telescope inputs with or without AO; only the optional Altair field lens changes the f/32 scale (0.0219 -> 0.0214 "/px).
- Side-port mounting adds the flat 45-deg science fold in the converging beam below M1 (GTEL); the up-looking port is direct. Neither changes F or the scale.
- Hodapp et al. 2003 text-layer glyphs: "um" prints as "mm" (e.g. "27 mm pixel", "5.5 mm"); the 38-mm pupil value was confirmed on the rendered page (it is millimetres).

## Gemini North / NIRI f/14 camera (with or without Altair AO)

**Recommended preset:** D = 7.9 m (Gemini North entrance pupil: the undersized secondary is the aperture stop; M1 is 8.1 m), eps = 0.164 (DERIVED: the 168-mm central hole in the 1024-mm M2 stop, which projects to 1.30 m in the pupil; the Zemax prescription gives 0.152), Cassegrain f/16 (f_eff = 128,120 mm, so F = 16.22 for the 7.9-m pupil; Altair reproduces the same f/16 beam), Ritchey-Chretien with an f/1.8 primary, on the ISS: up-looking port (direct Cassegrain) or a side port behind a flat 45-deg science fold. Reimaged: common collimator forming a 38-mm pupil image at the cold Lyot stop (pupil wheel) -> f_col = 16.22 x 38 = 616 mm (DERIVED; not published); f/14 camera f_cam = 537 mm (DERIVED from the pixel scale; 14 x 38 = 532 mm from the label), final f/14.13. Broadband filters sit in the converging f/16 beam before the collimator (FW1), narrow-band filters in the collimated beam (FW2). Detector: one Aladdin InSb 1024 x 1024, 27 um, rows [1], no gaps. Validate: 0.0499"/px, 51.1" square, 1.05 Mpix.

| explorer input | value |
|---|---|
| D_m | 7.9 |
| D_note | entrance pupil set by the undersized M2 (Gemini Zemax ENPD 7900); M1 is 8.1 m |
| eps | 0.164 |
| eps_note | 168-mm M2 central hole / 1024-mm M2 stop (DERIVED); 0.152 from the Zemax prescription |
| F | 16.22 |
| F_note | f_eff / 7.9 m (DERIVED); Gemini label f/16 |
| f_eff_mm | 128120 |
| telescope_type | Cassegrain (Ritchey-Chretien), Gemini North ISS; up-looking port (direct) or side port via a flat 45-deg science fold |
| focus | Cassegrain |
| primary_F | 1.8 |
| field_limit_arcmin | bottom_port_diameter: 10; side_port_diameter: 7 |
| imager | reimaged |
| W_mm | 38 |
| W_note | pupil image at the cold Lyot stop (H03, GFS); 36 mm in a 2000 web page |
| f_col_mm_DERIVED | 616.3 |
| f_cam_mm_DERIVED | 536.8 |
| effective_F_DERIVED | 14.13 |
| camera_label | f/14 |
| filters | broadband: converging f/16 beam before the collimator (FW1); narrow-band: collimated beam, tilted 5 deg (FW2); pupil wheel FW3 at the 38-mm pupil |
| chip_nx | 1024 |
| chip_ny | 1024 |
| pitch_um | 27 |
| n_chips | 1 |
| rows | [1] |
| gaps | none (single monolithic array) |
| pixel_scale_arcsec | 0.0499 |
| fov_arcsec | [51.1, 51.1] |
| total_pixels | 1048576 |
| ao | optional (Altair NGS/LGS, to 2.5 um) |

### Parameters

Telescope, collimator, pupil, filter and detector rows are identical to the f/6 section (same records in the JSON); only the camera rows are listed here.

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| camera_name | f/14 | camera label (final f-ratio on the detector) | H03, p. 1388, Sec. 1 | "The first, named f/6 after the final f-ratio on the detector"<br>Note: H03 names the f/6 camera "after the final f-ratio on the detector"; the f/14 and f/32 labels follow the same rule.<br>ALT: f/6, f/14, f/32 (GWOPT, NIRI Optical Overview: "into one of three camera lens units giving the three pixel scales available (i.e. f/6 , f/14 and f/32 giving 0.116, 0.050 and 0.022 arcseconds/pixel, respectively)") |
| camera_lens | 4-element refractive (BaF2, ZnSe, LiF, ZnS), ~70 mm diameter, all spherical; flat mirror after the lens |  | GWF14, f/14 Optics | "The f/14 camera lens is a multi-component (4) lens of diameter ~70mm made of BaF2, ZnSe, LiF and ZnS. All surfaces are spherical." |
| camera_focal_length | 536.8 **[DERIVED]** | mm (DERIVED; not published) | GNCAP, Pixel Scales and Field of View table | "f/14 0.0499 51.1 x 51.1"<br>DERIVED: f_eff = 206264.8 x 0.027 mm / 0.0499" = 111,606 mm; f_cam = f_eff x W / D = 111,606 x 38 / 7900 = 536.8 mm (= f_eff x f_col / f_tel = 111,606 x 616.3 / 128120). With the label: 14 x 38 = 532 mm. |
| effective_focal_ratio | 14.13 **[DERIVED]** | final f/# (DERIVED, D = 7.9 m) | GNCAP, Pixel Scales and Field of View table | "f/14 0.0499 51.1 x 51.1"<br>DERIVED: 111,606 / 7900 = 14.127 (label f/14); 13.951 with D = 8.0 m. f_cam / f_col = 0.8711. |
| ao_use | with or without Altair (AO imaging out to 2.5 um); Altair reproduces the f/16 beam, pupil size and position |  | GNI, introduction | "is available for use with NIRI f/32 for J-L' imaging and NIRI f/14 for imaging out to 2.5 microns."<br>ALT: AO via Altair (GFS, Core operating modes: "AO imaging fed by ALTAIR (with or without laser guide star), using the f/14 or f/32 camera options.") |

### Validation targets

| quantity | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pixel_scale | 0.0499 | arcsec/px (full array, average value) | GNCAP, Pixel Scales and Field of View table | "f/14 0.0499 51.1 x 51.1"<br>Note: GWCAM: "FOVs and pixels size can change by +/- 0.3%, depending on how and where the instrument is mounted; the above are average values."<br>ALT: 0.05 (GNI, Capability Summary table: "f/14 0.050"/pixel 51" x 51"")<br>ALT: 0.0499 (GWCAM, NIRI Cameras table: "f/14 0.0499 51.1 x 51.1") |
| field_of_view | 51.1 | arcsec square (full 1024 x 1024 array) | GNCAP, Pixel Scales and Field of View table | "f/14 0.0499 51.1 x 51.1"<br>ALT: 51 x 51 (GNI, Capability Summary table: "f/14 0.050"/pixel 51" x 51" no M band")<br>DERIVED: 1024 x 0.0499" = 51.1" |
| total_pixels | 1048576 | px | GNCOMP, Detector Array table | "1024x1024 27-micron pixels"<br>DERIVED: 1024^2 = 1,048,576 (1.05 Mpix) |

NOT FOUND, conflicts and notes: as in the f/6 section (shared; repeated in the JSON).

## Gemini North / NIRI f/32 camera (AO camera, with Altair)

**Recommended preset:** D = 7.9 m (Gemini North entrance pupil: the undersized secondary is the aperture stop; M1 is 8.1 m), eps = 0.164 (DERIVED: the 168-mm central hole in the 1024-mm M2 stop, which projects to 1.30 m in the pupil; the Zemax prescription gives 0.152), Cassegrain f/16 (f_eff = 128,120 mm, so F = 16.22 for the 7.9-m pupil; Altair reproduces the same f/16 beam), Ritchey-Chretien with an f/1.8 primary, on the ISS: up-looking port (direct Cassegrain) or a side port behind a flat 45-deg science fold. Reimaged: common collimator forming a 38-mm pupil image at the cold Lyot stop (pupil wheel) -> f_col = 16.22 x 38 = 616 mm (DERIVED; not published); f/32 camera f_cam = 1223 mm (DERIVED from the pixel scale; 32 x 38 = 1216 mm from the label), final f/32.19. Broadband filters sit in the converging f/16 beam before the collimator (FW1), narrow-band filters in the collimated beam (FW2). Detector: one Aladdin InSb 1024 x 1024, 27 um, rows [1], no gaps. Validate: 0.0219"/px, 22.4" square, 1.05 Mpix. With the Altair field lens: 0.0214"/px, 21.9" square.

| explorer input | value |
|---|---|
| D_m | 7.9 |
| D_note | entrance pupil set by the undersized M2 (Gemini Zemax ENPD 7900); M1 is 8.1 m |
| eps | 0.164 |
| eps_note | 168-mm M2 central hole / 1024-mm M2 stop (DERIVED); 0.152 from the Zemax prescription |
| F | 16.22 |
| F_note | f_eff / 7.9 m (DERIVED); Gemini label f/16 |
| f_eff_mm | 128120 |
| telescope_type | Cassegrain (Ritchey-Chretien), Gemini North ISS; up-looking port (direct) or side port via a flat 45-deg science fold |
| focus | Cassegrain |
| primary_F | 1.8 |
| field_limit_arcmin | bottom_port_diameter: 10; side_port_diameter: 7 |
| imager | reimaged |
| W_mm | 38 |
| W_note | pupil image at the cold Lyot stop (H03, GFS); 36 mm in a 2000 web page |
| f_col_mm_DERIVED | 616.3 |
| f_cam_mm_DERIVED | 1223.2 |
| effective_F_DERIVED | 32.19 |
| camera_label | f/32 |
| filters | broadband: converging f/16 beam before the collimator (FW1); narrow-band: collimated beam, tilted 5 deg (FW2); pupil wheel FW3 at the 38-mm pupil |
| chip_nx | 1024 |
| chip_ny | 1024 |
| pitch_um | 27 |
| n_chips | 1 |
| rows | [1] |
| gaps | none (single monolithic array) |
| pixel_scale_arcsec | 0.0219 |
| fov_arcsec | [22.4, 22.4] |
| total_pixels | 1048576 |
| pixel_scale_arcsec_with_Altair_field_lens | 0.0214 |
| fov_arcsec_with_Altair_field_lens | [21.9, 21.9] |
| ao | Altair (normal use); natural seeing also offered |

### Parameters

Telescope, collimator, pupil, filter and detector rows are identical to the f/6 section (same records in the JSON); only the camera rows are listed here.

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| camera_name | f/32 | camera label (final f-ratio on the detector) | H03, p. 1388, Sec. 1 | "The first, named f/6 after the final f-ratio on the detector"<br>Note: H03 names the f/6 camera "after the final f-ratio on the detector"; the f/14 and f/32 labels follow the same rule.<br>ALT: f/6, f/14, f/32 (GWOPT, NIRI Optical Overview: "into one of three camera lens units giving the three pixel scales available (i.e. f/6 , f/14 and f/32 giving 0.116, 0.050 and 0.022 arcseconds/pixel, respectively)") |
| camera_lens | 4-element refractive (BaF2, ZnSe, LiF, ZnS), ~60 mm diameter, all spherical; flat mirror after the lens |  | GWF32, f/32 Optics | "The f/32 camera lens is a multi-component (4) lens of diameter ~60mm made of BaF2, ZnSe, LiF and ZnS. All surfaces are spherical." |
| camera_focal_length | 1223.2 **[DERIVED]** | mm (DERIVED; not published) | GNCAP, Pixel Scales and Field of View table | "f/32 0.0219 22.4 x 22.4"<br>DERIVED: f_eff = 206264.8 x 0.027 mm / 0.0219" = 254,299 mm; f_cam = f_eff x W / D = 254,299 x 38 / 7900 = 1223.2 mm (= f_eff x f_col / f_tel = 254,299 x 616.3 / 128120). With the label: 32 x 38 = 1216 mm. |
| effective_focal_ratio | 32.19 **[DERIVED]** | final f/# (DERIVED, D = 7.9 m) | GNCAP, Pixel Scales and Field of View table | "f/32 0.0219 22.4 x 22.4"<br>DERIVED: 254,299 / 7900 = 32.190 (label f/32); 31.787 with D = 8.0 m. f_cam / f_col = 1.9849. |
| ao_use | designed for Altair (Nyquist at H); with the Altair field lens the scale becomes 0.0214"/px; natural-seeing f/32 imaging also offered (best for 2.5-5 um) |  | GNCAP, Pixel Scales and Field of View table | "f/32 + Altair Field Lens 0.0214 21.9 x 21.9"<br>ALT: Nyquist at H with Altair (H03, p. 1388, Sec. 1: "is designed to Nyquist-sample the ... diffraction pattern in the H band and will be used with the Gemini adaptive optics system")<br>ALT: natural-seeing f/32 (GFS, Core operating modes: "Natural seeing imaging with three camera options: f/32, f/14, and f/6") |

### Validation targets

| quantity | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pixel_scale | 0.0219 | arcsec/px (full array, average value) | GNCAP, Pixel Scales and Field of View table | "f/32 0.0219 22.4 x 22.4"<br>Note: GWCAM: "FOVs and pixels size can change by +/- 0.3%, depending on how and where the instrument is mounted; the above are average values."<br>ALT: 0.022 (GNI, Capability Summary table: "f/32 0.022"/pixel 22"x22"")<br>ALT: 0.0219 (GWCAM, NIRI Cameras table: "f/32 0.0219 22.4 x 22.4")<br>ALT: 0.0214 (GNCAP, Pixel Scales and Field of View table: "f/32 + Altair Field Lens 0.0214 21.9 x 21.9") [with the Altair field lens inserted (changes the input scale, not the camera): f_eff = 260,241 mm, f/32.94 (DERIVED)] |
| field_of_view | 22.4 | arcsec square (full 1024 x 1024 array) | GNCAP, Pixel Scales and Field of View table | "f/32 0.0219 22.4 x 22.4"<br>ALT: 22 x 22 (GNI, Capability Summary table: "f/32 0.022"/pixel 22"x22" best suited for 2.5")<br>DERIVED: 1024 x 0.0219" = 22.4" |
| total_pixels | 1048576 | px | GNCOMP, Detector Array table | "1024x1024 27-micron pixels"<br>DERIVED: 1024^2 = 1,048,576 (1.05 Mpix) |

NOT FOUND, conflicts and notes: as in the f/6 section (shared; repeated in the JSON).

## VLT UT4 (Yepun) / HAWK-I (Nasmyth A; seeing-limited and GRAAL GLAO modes share one optical preset)

**Recommended preset:** D = 8.0 m (Nasmyth entrance pupil, VLTSPE Table 3; M1 is 8.2 m), eps = 1116/8000 = 0.1395 DERIVED (the secondary; on UT4 since 2016 the 1120-mm deformable secondary, 0.140; 0.194 if the 1550-mm sky baffle is deployed), F = 15.000, f = 120,000 mm (582 um/", 1.718 "/mm). Telescope focus: Nasmyth A of UT4 (Yepun) -- a Ritchey-Chretien M1 (f/1.8) + M2 with a FLAT elliptical tertiary M3 on the axis turning the beam to the Nasmyth platform (the explorer's Nasmyth option). Imager: reimaged, all-reflective: the powered 404-mm entrance window forms a pupil image on camera mirror M3, which is the cold stop; fold flat M1 and a three-mirror camera (spherical M2, aspheric M3, M4) give final F/4.36 (169.4 um/"). W, f_col and f_cam are NOT published in the sources obtained; f_cam/f_col = 4.36/15 = 0.2907 (DERIVED) is all the model needs for the scale. Filters: two wheels directly in front of the detector (converging beam), 105 x 105 mm. Detector: 4 HAWAII-2RG, 2048 x 2048 frames (2040 x 2040 light-sensitive), 18 um, 2 x 2 mosaic: rows [2, 2] (Q4 Q3 over Q1 Q2), gaps between active areas 2.90 mm / 17.1" (along rows) and 2.70 mm / 16.0" (between rows), DERIVED from the manual's quadrant offsets (153 and 142 px between 2048-px frames); quadrants 2-4 tilted 0.13, 0.04, 0.03 deg. Validate: 0.106"/px (0.1064 measured, 0.10643 header), 7.5' x 7.5', cross-shaped gap ~15", 4 x 2k x 2k = 16.8 Mpix. GRAAL: identical optics and scale (GRAAL sits between the Nasmyth flange and HAWK-I, leaves the field unobstructed, and corrects with the deformable M2), so one preset covers both modes.

| explorer input | value |
|---|---|
| D_m | 8.0 |
| D_note | Nasmyth entrance pupil (VLTSPE Table 3); M1 is 8.2 m |
| eps | 0.1395 |
| eps_note | 1116-mm M2 / 8000 mm (DERIVED); DSM shell 1120 mm -> 0.140; 0.194 with the 1550-mm sky baffle |
| F | 15.0 |
| f_eff_mm | 120000 |
| telescope_type | Ritchey-Chretien, Nasmyth A focus of UT4 via a flat elliptical tertiary M3 on the axis |
| focus | Nasmyth (flat M3) |
| primary_F | 1.8 |
| field_limit_arcmin | nasmyth_total_diameter: 30; nasmyth_unvignetted_diameter: 7.15 |
| imager | reimaged (all-reflective; powered entrance window forms the pupil on camera mirror M3 = cold stop) |
| W_mm | NOT FOUND |
| W_note | NOT FOUND |
| f_col_mm | NOT FOUND |
| f_cam_mm | NOT FOUND |
| f_cam_over_f_col_DERIVED | 0.2907 |
| effective_F | 4.36 |
| f_eff_final_mm_DERIVED | 34885 |
| filters | two filter wheels directly in front of the detector (converging beam), 105 x 105 mm filters |
| chip_nx | 2040 |
| chip_ny | 2040 |
| chip_frame_px | 2048 |
| pitch_um | 18 |
| n_chips | 4 |
| rows | [2, 2] |
| gap_x_mm | 2.9 |
| gap_y_mm | 2.7 |
| gap_x_arcsec | 17.1 |
| gap_y_arcsec | 16.0 |
| gap_frame_x_px | 153 |
| gap_frame_y_px | 142 |
| quadrant_tilts_deg | Q2: 0.13; Q3: 0.04; Q4: 0.03 |
| pixel_scale_arcsec | 0.106 |
| pixel_scale_arcsec_header | 0.10643 |
| fov_arcmin | [7.5, 7.5] |
| total_pixels | 16777216 |
| graal | GRAAL (GLAO with the UT4 deformable secondary and 4 LGS) adds no optics to the science path; same preset with or without GRAAL |

### Parameters

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| telescope_aperture | 8.0 | m (Nasmyth entrance pupil diameter) | VLTSPE, Sec. 3.2.1, Table 3 (Nasmyth focus optical parameters) | "Entrance pupil diameter 8000 mm"<br>ALT: 8.2 (EUT, page title: "The VLT 8.2-meter Unit Telescopes") [M1 nominal diameter]<br>ALT: pupil set by M2 (VLTSPE, Sec. 3.2.4 (Light baffling): "The pupil is determined by the secondary mirror which is designed to cover the 8 m aperture for the Nasmyth unvignetted field of view.")<br>ALT: 8.115 (VLTSPE, Table 2 (Cassegrain): "Entrance pupil diameter 8115.0 mm") [Cassegrain value used for FORS2 (reimagers.md); not the Nasmyth value] |
| central_obstruction | 0.1395 **[DERIVED]** | linear ratio (DERIVED: M2 / Nasmyth entrance pupil) | VLTSPE, Sec. 3.2.4 (Light baffling) | "If the baffle is not used, the central obstruction is that produced by the secondary mirror alone (1116 mm diameter)."<br>Note: What sets eps: the secondary mirror (since 2016 the AOF deformable secondary, DSM, on UT4; same 1.12-m class). No source says whether HAWK-I deploys the M2 sky baffle; the bare-M2 value is recommended. No published central-obscuration value for the DSM unit was found.<br>ALT: 1116 mm (original Dornier M2) (EM2, M2 specification table: "Optical useful diameter ... 1116 mm")<br>ALT: 1120-mm DSM thin shell (UT4 since the AOF) (A13, p. 14: "thin-shell mirror, 1120 mm in diameter and 2 mm thick")<br>ALT: DSM replaces the Dornier M2 unit of UT4 (A13, p. 14: "The DSM is contained in a complete new M2 unit that will replace the actual Dornier M2 unit of UT4.")<br>ALT: DSM on UT4 from October 2016 (A17, p. 8 (Installation of new M2 unit on UT4): "On 14 October 2016, the first transport took place to UT4 and the DSM hub was brought to the telescope.")<br>ALT: 1550-mm sky baffle (if deployed) (VLTSPE, Sec. 3.2.4: "These baffles can be extended to a diameter of 1550 mm according to the needs of the instrument.")<br>DERIVED: 1116 / 8000 = 0.1395; DSM 1120 / 8000 = 0.140; with the sky baffle 1550 / 8000 = 0.194. (FORS2 at Cassegrain used 1116 / 8115 = 0.1375.) |
| telescope_focus | Nasmyth A of UT4 (Yepun): Ritchey-Chretien M1 + M2, FLAT elliptical tertiary M3 on the axis (M3 tower) turning the beam to the Nasmyth platform |  | HUM, Sec. 2.2 (Mechanics) | "HAWK-I is installed at the Nasmyth A of VLT-UT4 (Yepun), and centred on the Nasmyth adaptor"<br>ALT: Nasmyth A of UT4 (EHI, Summary: "HAWK-I is a cryogenic wide-field imager installed at the Nasmyth A focus of UT4.")<br>ALT: Nasmyth A of UT4 (S11, p. 9, Instrument overview: "installed at the Nasmyth A focus of the VLT Unit Telescope 4 (UT4)")<br>ALT: focus station 'NA', UT4 (HDR0, primary header: "TELESCOP= 'ESO-VLT-U4' ... HIERARCH ESO TEL FOCU ID = 'NA' / Telescope focus station ID")<br>ALT: M3 flat, elliptical; sends light to the Nasmyth platforms (E9837, caption: "The tertiary, elliptical and flat mirror (M3) for the UT1 has been coated ... It directs the light from the secondary mirror (M2) towards the instruments at the Nasmyth platforms.")<br>ALT: M3 on a tower through the M1 hole (EM3T, Overview: "The M3 Tower is mounted in the center of the M1 Cell and can rotate along its axis ... It supports the elliptical tertiary mirror.")<br>ALT: RC at Nasmyth (VLTSPE, Sec. 3.2.2: "The unit telescopes at Nasmyth are of classical Ritchey") |
| telescope_focal_ratio | 15.0 | f/# (Nasmyth) | VLTSPE, Table 3 | "Focal ratio 15.000" |
| telescope_focal_length | 120000 | mm (Nasmyth) | VLTSPE, Table 3 | "Focal length 120000 mm"<br>ALT: 120.000 m; 1.718 "/mm (HDR0, primary header: "HIERARCH ESO TEL FOCU LEN = 120.000 / [m] Focal length ... HIERARCH ESO TEL FOCU SCALE = 1.718 / [arcsec/mm] Focal scale")<br>ALT: 582 um/arcsec (VLTSPE, Table 3: "Image scale slightly field dependent 582 µm/arcsec")<br>ALT: plate-scale change with the new M2 unit negligible (A17, p. 9: "The plate scale change was measured at 1.00047 ± 0.0005 on the Nasmyth B guide probe, which compares to 1.00067 when measured directly on HAWK-I; these results mean that, for all practical purposes, the plate scale change is negligible.")<br>DERIVED: 206264.8 / 120000 = 1.7189 "/mm (581.8 um/"). |
| primary_focal_ratio | 1.8 | f/# of M1 (drawing only) | EM1, Sec. on test results | "fast aspheres(f/1.8 with a nominal conic constant -1.00469)"<br>ALT: R = 28800 mm (EM1, Table 3 (Radius of curvature, specification column): "Radius of curvature ... 28800 ± 100") [14400 / 8200 = f/1.756; / 8000 = f/1.80 (DERIVED)] |
| field_limits | Nasmyth field 30 arcmin total, 7.15 arcmin unvignetted (diameter); HAWK-I 7.5 arcmin square, corners slightly vignetted | arcmin | VLTSPE, Table 3 | "Object field of view total 30 arcmin unvignetted 7.15 arcmin"<br>ALT: HAWK-I corners in the vignetted Nasmyth field (-0.4%) (C05, p. 6: "The 7.5 arcminute square field results in outer corners of the HAWK-I field which will encroach slightly into the vignetted area of the Nasmyth field, resulting in 0.4% lower throughput in the field corners in all bands")<br>DERIVED: 7.5' square has a 10.6' diagonal (> 7.15' unvignetted). Nasmyth image scale 582 um/" -> the 7.5' field spans 262 mm at the Nasmyth focus. |
| optics_type | reimaged, all-reflective (plus a powered entrance window): window (404 mm clear aperture) images the telescope pupil onto camera mirror M3 = cold stop; fold flat M1; camera = spherical M2 + aspheric M3 and M4; filters just in front of the detector |  | HUM, Sec. 2.1 (Optics) | "The entrance window of the vacuum vessel is ... used to image the pupil on the M3 mirror. A cold baffle stops the light outside of the instrument"<br>Note: Not a collimator/camera pair with a collimated beam: the pupil (cold stop) is formed on camera mirror M3 by the powered window. In the explorer's ideal model it maps to a reimager with the cold stop at the pupil.<br>ALT: fold + 3-mirror camera, F/4.36 (HUM, Sec. 2.1 (Optics): "The first folding mirror (M1) is used for beam accommodation. Then the camera consists of one large spherical mirror M2 and two aspherical mirrors M3 and M4 allowing to adapt the telescope beam to the required F/4.36.")<br>ALT: pupil image at M3 = cold stop; powered window (C05, p. 7: "The window forms a pupil image at M3 which is the system cold stop.")<br>ALT: window 404 mm (C05, p. 7: "The window is very large, at 404 mm of clear aperture")<br>ALT: four mirrors, two filter wheels (HUM, HAWK-I in a Nutshell: "The light passes four mirrors and two filter wheels before hitting a mosaic of four Hawaii 2RG 2048×2048 pixels detectors.") |
| pupil_diameter | NOT FOUND | NOT FOUND (pupil image / cold stop on M3; size not published in any obtained source) | C05, p. 7 | "The window forms a pupil image at M3 which is the system cold stop."<br>Note: Kissler-Patig et al. 2008 (A&A 491, 941), the instrument paper, refused automated download (DataDome captcha); Pirard et al. 2004 and Casali et al. 2006 (SPIE) are closed access. The scale depends only on f_cam / f_col, so W affects only the drawing. |
| collimator_focal_length | NOT FOUND | NOT FOUND (would be F_tel x W = 15 x W) | HUM, Sec. 2.1 | "allowing to adapt the telescope beam to the required F/4.36" |
| camera_focal_length | NOT FOUND | NOT FOUND; ratio f_cam / f_col = 0.2907 (DERIVED) | HUM, HAWK-I in a Nutshell | "The final F-ratio is F/4.36 (1′′ on the sky correspond to 169.4µm)."<br>DERIVED: f_cam / f_col = F_final / F_tel = 4.36 / 15 = 0.2907; = 169.4 / 582 = 0.2911 from the image scales; = 34,885 / 120,000 = 0.2907 from the header scales (0.10643 "/px, 18 um). |
| effective_focal_ratio | 4.36 | final f/# | HUM, HAWK-I in a Nutshell | "The final F-ratio is F/4.36 (1′′ on the sky correspond to 169.4µm)."<br>ALT: F/4.36, 169 um/" (EHO, Overview: "The final F-ratio is F/4.36 ( 1 arcsec on the sky corresponds to169 μm on the detector)")<br>DERIVED: 169.4 um/" x 206264.8 = 34,941 mm = f/4.368 on 8.0 m; from 0.10643 "/px and 18 um: 34,885 mm = f/4.361. |
| filter_location | two 6-position filter wheels directly in front of the detector mosaic (converging beam); 105 x 105 mm filters; near-constant incidence angle over the field |  | HUM, Sec. 2.1 (Optics) | "The two filter wheels are located directly in front of the detector mosaic. The size of the filter needed to cover the whole FoV is 105×105 mm."<br>Note: The filters are NOT at the pupil (the cold stop is at M3). |
| detector | 4 x Teledyne (Rockwell) HAWAII-2RG, 2048 x 2048, 18 um, 2.5 um cutoff |  | HUM, Sec. 2.3 (Detectors) | "composed of four 2 k×2 k Hawaii 2RG arrays with 2.5 µm cutoff"<br>ALT: 2048 x 2048 HAWAII 2RG (EHI, Summary: "with a cross-shaped gap of 15" between the four HAWAII 2RG 2048x2048 pixels detectors") |
| chip_format | Nx: 2040; Ny: 2040 **[DERIVED]** | px light-sensitive (DERIVED: 2048 x 2048 frame minus a 4-px reference border) | HUM, Sec. 5.3 (Vignetting of the FoV) | "The Hawaii2RG detectors have 4 reference columns/rows around each device which are not sensitive to light."<br>ALT: 2048 x 2048 frame (HDR0, extension CHIP1.INT1: "HIERARCH ESO DET CHIP NX = 2048 / Pixels in X ... HIERARCH ESO DET CHIP NY = 2048 / Pixels in Y")<br>DERIVED: 2048 - 2 x 4 = 2040. A few further edge rows/columns are vignetted by the baffles (HUM Sec. 5.3 table: 1-8 rows/columns > 10%). |
| pixel_pitch | 18 | um | HDR0, extension CHIP1.INT1 (same in all four) | "HIERARCH ESO DET CHIP PXSPACE = 1.800E-05 / Pixel-Pixel Spacing"<br>DERIVED check: 169.4 um/" x 0.106 "/px = 17.96 um. |
| n_chips | 4 | chips (2 x 2 mosaic) | HUM, Sec. 5 (Field of view) | "The FoV of HAWK-I is defined by four Hawaii-2RG chips" |
| mosaic_rows | [2, 2] | chips per row, top to bottom, centred | HUM, Sec. 5.1, quadrant offset table | "Q1 0 0 Q2 2048 + 153 0+3 Q3 2048 + 157 2048 + 144 Q4 0+5 2048 + 142"<br>Note: Top row Q4, Q3; bottom row Q1, Q2 (default orientation: North +Y, East -X for Q1; HUM Sec. 5.1).<br>ALT: Q4 Q3 above Q1 Q2 (EHDET, figure: (read off the figure)) [figure read: top row Q4 (chip #88), Q3 (chip #79); bottom row Q1 (#66), Q2 (#78); +X right, +Y up] |
| chip_gaps | x_px_frame: 153; y_px_frame: 142; x_px_active: 161; y_px_active: 150; x_mm_active: 2.9; y_mm_active: 2.7; x_arcsec_active: 17.1; y_arcsec_active: 16.0 | px / mm / arcsec (x = along rows, y = between rows) | HUM, Sec. 5.1, quadrant offset table | "Q2 2048 + 153 0+3 Q3 2048 + 157 2048 + 144 Q4 0+5 2048 + 142"<br>ALT: ~15" (HUM, Sec. 5: "The detectors are separated by gaps of about 15")<br>ALT: 15" (EHI, Summary: "with a cross-shaped gap of 15" between the four HAWAII 2RG")<br>ALT: 2.7 mm = 15" (design) (C05, p. 7: "pact focal plane with a cross-shaped gap of 2.7 mm or 15 arcsec.")<br>ALT: 147 px nominal (header) (HDR0, extension CHIP1.INT1: "HIERARCH ESO DET CHIP XGAP = 147. / Gap after chip along x ... HIERARCH ESO DET CHIP YGAP = 147. / Gap after chip along y")<br>ALT: 155 / 158 px (x), 144 / 140 px (y) (EHGAP, figure: (read off the figure)) [read off the figure: Det1-Det2 155 px, Det4-Det3 158 px, Det1-Det4 144 px, Det2-Det3 140 px (figure has no text layer)]<br>ALT: tilts 0.13, 0.04, 0.03 deg (HUM, Sec. 5.1: "Quadrants 2,3,4 are tilted with respect to quadrant 1 by 0.13, 0.04, 0.03 degrees, respectively.")<br>DERIVED from the offset table (2048-px frames): x gap Q1-Q2 = 153 px, Q4-Q3 = 157 - 5 = 152 px; y gap Q1-Q4 = 142 px, Q2-Q3 = 144 - 3 = 141 px. Adding the 4 + 4 reference pixels gives the gap between light-sensitive areas: x 161 / 160 px, y 150 / 149 px. At 18 um and 0.1064 "/px: frame gaps 2.75 mm / 16.3" (x), 2.56 mm / 15.1" (y); active gaps 2.90 mm / 17.1" (x), 2.70 mm / 16.0" (y). Header nominal 147 px = 2.65 mm = 15.6". |

### Validation targets

| quantity | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| pixel_scale | 0.106 | arcsec/px | HUM, HAWK-I in a Nutshell | "The pixel scale is 0.106′′ /pix"<br>ALT: 0.1064 (EHO, Imaging mode: "The pixel scale is0.1064 arcsec/pix with negligible distortions (< 0.3 %)")<br>ALT: 0.10643 (HDR0, primary header (NO_AO): "HIERARCH ESO INS PIXSCALE = 0.106430 / Detector pixel scale [arcsec/pixel]")<br>ALT: 0.10643 (HDR1, primary header (GLAO): "HIERARCH ESO INS PIXSCALE = 0.106430 / Detector pixel scale [arcsec/pixel] ... HIERARCH ESO OBS AOMODE = 'GLAO' / Req. AO mode")<br>ALT: 0.106 (EHI, Summary: "The pixel scale is of 0.106".")<br>DERIVED (model): 206264.8 x 0.018 / (120000 x 0.2907) = 0.10643; from 169.4 um/": 0.018 / 0.1694 = 0.10626 "/px. |
| field_of_view | 7.5 x 7.5 | arcmin | HUM, HAWK-I in a Nutshell | "The field of view (FoV) on the sky is 7.5′ ×7.5′"<br>ALT: 7.5 x 7.5 (EHI, Summary: "The on-sky field of view is 7.5'x7.5'")<br>DERIVED: x (2 x 2048 + 153) x 0.1064" = 7.53'; y (2 x 2048 + 142) x 0.1064" = 7.52'. |
| total_pixels | 16777216 | px (4 x 2048^2; 4 x 2040^2 = 16,646,400 light-sensitive) | C05, Table 1 | "Detectors 4 × 2k × 2k"<br>DERIVED: 4 x 2048^2 = 16.78 Mpix; 4 x 2040^2 = 16.65 Mpix. |

### GRAAL (ground-layer AO) mode: optics do not differ

| evidence | source + location | verbatim quote |
|---|---|---|
| GRAAL between HAWK-I and the Nasmyth flange; FoV unaffected | S11, p. 10 | "GRAAL will be installed between HAWK-I and the Nasmyth flange. HAWK-I’s field of view is not affected by GRAAL." |
| FoV unobstructed; seeing-limited mode kept | A14, p. 3, GRAAL module background | "The original field of view of HAWK-I is left unobstructed and a seeing-limited mode is available." |
| correction by the deformable secondary | HUM, Sec. 3 | "The adaptive correction (AO) is provided by the deformable secondary mirror (DSM)" |
| GLAO with the 4 LGS and the deformable secondary | EHD, GRAAL+HAWK-I GLAO mode | "GRAAL uses the 4 LGS system and the deformable secondary mirror to correct the turbulent atmospheric at ground layer for HAWK-I." |
| same pixel scale and focal length in AO and non-AO headers | HDR1, primary header | "HIERARCH ESO TEL FOCU LEN = 120.000 / [m] Focal length" |
| LGS pick-offs outside the science field | HUM, Sec. 3.3 | "One small pick-up mirror placed with a fixed arm at 5.8′′ from the optical axis on the Nasmyth focal plane" ["5.8''" as printed; A14 places the LGS WFS 6.6 arcmin from the field centre, i.e. outside the 7.5' square field] |
| two offered modes | HUM, Sec. 9 | "no-AOF: In this case GRAAL is not used and the observation are performed in seeing limited mode." |

### NOT FOUND

- HAWK-I pupil (cold stop on M3) diameter, and therefore f_col and f_cam individually: not in the user manual, the ESO pages or the Messenger articles. The instrument paper Kissler-Patig et al. 2008 (A&A 491, 941) was blocked by the publisher (DataDome captcha); Pirard et al. 2004 and Casali et al. 2006 (SPIE) are closed access.
- Central obscuration of UT4 with the deformable secondary (DSM) unit: only the 1120-mm shell diameter (A13); eps = 1116/8000 from the 2005 VLT interface spec is recommended.
- Whether HAWK-I deploys the 1550-mm M2 sky baffle.
- Physical (mm) gap measured in the focal plane: the 2.7-mm value is the 2005 design (C05); as-built gaps are DERIVED from the manual's pixel offsets x 18 um.

### Conflicts between sources

- Gap: ~15" (HUM, EHI, EHO, C05 2.7 mm design) vs 153 / 152 px (x) and 142 / 141 px (y) between 2048-px frames (HUM offset table) vs 155 / 158 and 144 / 140 px (EHGAP figure) vs 147 px nominal (HDR0 XGAP/YGAP); between light-sensitive areas +8 px.
- Pixel scale: 0.106 (HUM, EHI, S11) vs 0.1064 (EHO) vs 0.106430 (HDR0/HDR1) vs 0.10626 DERIVED from 169.4 um/" and 18 um.
- Image scale at the detector: 169.4 um/" (HUM) vs 169 um/" (EHO); final F/4.36 (HUM, EHO) vs 4.368 DERIVED from 169.4 um/" on an 8.0-m pupil.
- Aperture: 8.0 m Nasmyth entrance pupil (VLTSPE Table 3) vs 8.2 m M1 (EUT) vs 8.115 m (Cassegrain, Table 2).
- M2: 1116 mm (Dornier M2, VLTSPE/EM2) vs 1120 mm DSM thin shell (A13; UT4 since the AOF).
- LGS pick-off radius: "5.8''" (HUM Sec. 3.3, as printed) vs 6.6 arcmin from the field centre (A14).

### Notes

- Explorer mapping: D = 8.0, eps = 0.1395, F = 15 (f = 120,000 mm), Nasmyth (flat M3), reimaged with f_cam / f_col = 0.2907 -> 0.10643 "/px at 18 um. W is not published: any W reproduces the scale (f_col = 15 W, f_cam = 4.36 W); the pupil sits on camera mirror M3, not in a collimated beam, and the filters are near the detector, not at the pupil.
- Chip format: the explorer's "active pixels" are 2040 x 2040 per chip (HAWK-I FITS frames are 2048 x 2048 including a 4-px reference border); use gaps 2.90 mm (x) / 2.70 mm (y) with 2040-px chips, or 2.75 / 2.56 mm with 2048-px frames (both DERIVED from the manual's offsets).
- GRAAL: the optics do not differ (S11, A14, HUM; identical INS PIXSCALE and TEL FOCU LEN in NO_AO and GLAO headers HDR0/HDR1), so no separate GRAAL preset is needed. The AOF deformable secondary replaced the Dornier M2 on UT4 for both modes; the plate-scale change was negligible (1.00067 on HAWK-I, A17).
- VLT UT records reused by key from data/imaging/reimagers.md: VLTSPE (here Table 3, Nasmyth, instead of Table 2), EM1 (M1 f/1.8), EM2 (M2 1116 mm), EUT (8.2 m).

