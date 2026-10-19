# Imaging presets: Palomar Observatory Sky Surveys (POSS-I, POSS-II) on the Oschin 48-inch Schmidt, and their digitization (DSS-1, DSS-2) -- sourced parameters

Compiled 2026-10-19 for the instex IMAGER mode, in the format of `data/imaging/megacam_ztf_small.md`. Every number comes from a document saved unmodified under `rawdata/imaging/poss/` (the ZTF paper D20 is the copy already under `rawdata/imaging/ztf/`, cited by the same key as in `megacam_ztf_small.md`); each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). All quote pieces (split on ' ... ') were machine-checked by script against: tesseract 5.5.1 OCR (pdftoppm 300 dpi greyscale, --psm 1) of the ADS scans (none has a usable text layer); pdftotext -layout and -raw of the arXiv PDFs; tag-stripped HTML; the FITS header cards of the DSS cutouts; the UTF-16 plate list decoded to UTF-8. Comparison removes whitespace and table separators, joins line-end hyphenation and normalises Unicode (NFKC), quotes, dashes, mu and degree glyphs; a few pieces match only after hyphens are dropped as well (check = 'loose'). OCR quotes keep the OCR's errors; each mangled number is flagged in a note and was read off the page image. Double-quoted fragments inside notes (OCR glosses such as "{/2.44", and FITS cards of the sibling headers) were checked the same way. Values marked IMAGE (R91 Fig. 1 band ranges, the wavelength range of R91's image-quality sentence) are not machine-checkable. Result: 229 quote entries checked, 0 failures, 0 matched only loosely (hyphens dropped). Machine-readable twin: `data/imaging/poss.json` (the `preset` object of each survey is the explorer summary).

The model: the explorer draws the telescope as a Schmidt (corrector = aperture stop at the mirror's centre of curvature) and needs a PHOTOGRAPHIC PLATE detector -- one plate instead of a CCD mosaic, no pixels; the image's fineness is set by the emulsion (resolving power, smallest star image) and, for the digital versions, by the scan step and scanning spot.

## Summary

- **POSS-I (1949-1958):** D = 1.2573 m (49.5 in clear aperture at the singlet corrector = stop; D20 says 1244 mm), mirror 1828.8 mm, R = 6125.5 mm, f/2.44, 67.187"/mm -> f_eff 3070.0 mm DERIVED; eps not published (>= 0.319 DERIVED from the plate). One 14-in (355.6 mm) 1-mm glass plate bent to R ~ 3.07 m: 6.6 x 6.6 deg, unvignetted 5.4 deg (mirror walk-off gives 5.34 deg). O = 103a-O unfiltered (~4100 A), E = 103a-E + red Plexiglas 2444 (6200-6700 A); 80 lines/mm, smallest images ~30 um (2.0"); 10-15 / 40-60 min; limits 21.1 / 20.0. 936 fields, 6-deg grid, to dec -33. DSS-1 (E plates, glass copies): 25.2845 um = 1.70"/px, 14000 x 14000; O plates later at 15 um (1.0"/px).
- **POSS-II (1985-2002):** same mirror, stop, f/2.44 and 14-in plates (67.19"/mm -> 3069.9 mm DERIVED), with the 1985 Grubb Parsons achromatic doublet (D20: 1982) giving < 0.5" images over 6.5 x 6.5 deg, 3900-9000 A. J = IIIa-J + GG395 (or GG385), F = IIIa-F + RG610, N = IV-N + RG9 (~4800 / 6500 / 8500 A); 250 lines/mm, images <= 40 um (3"); 50-70 / 70-90 / 90+ min; limits 22.5 / 20.8 / 19.5. 894 fields, 5-deg grid, dec >= 0. DSS-2: 15 um = 1.0"/px (header 15.0295 x 15.0 um), 23040 x 23040, 42-um laser spot.

## Sources

| key | document | local file | URL |
|---|---|---|---|
| H52 | Harrington, R. G. 1952, PASP 64, 275, "The 48-inch Schmidt-type Telescope at Palomar Observatory". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/Harrington1952_PASP64_275_48inchSchmidt_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1952PASP...64..275H |
| R91 | Reid, I. N., Brewer, C., Brucato, R. J., et al. 1991, PASP 103, 661, "The Second Palomar Sky Survey". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images); OCR renders the arcsec mark after a digit as a stray glyph or digit ("67'19" = 67".19, "05" = 0".5, "0734" = 0".34) and B_J/R_F/I_N as "B,"/"R,"/"I," | `rawdata/imaging/poss/Reid1991_PASP103_661_SecondPalomarSkySurvey_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1991PASP..103..661R |
| A58 | Abell, G. O. 1958, ApJS 3, 211, "The Distribution of Rich Clusters of Galaxies" (Sec. II a, 'Observational Material', describes the POSS-I plates). ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images); only pp. 211-222 were OCR'd | `rawdata/imaging/poss/Abell1958_ApJS3_211_RichClusters_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1958ApJS....3..211A |
| A59 | Abell, G. O. 1959, ASP Leaflet No. 366 (Leaflets 8, 121), "The National Geographic Society-Palomar Observatory Sky Survey". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/Abell1959_ASPLeaflet366_NGS-POSS_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1959ASPL....8..121A |
| LD73 | Lund, J. M., & Dixon, R. S. 1973, PASP 85, 230, "A User's Guide to the Palomar Sky Survey". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/LundDixon1973_PASP85_230_UsersGuidePSS_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1973PASP...85..230L |
| KR77 | King, I. R., & Raff, M. I. 1977, PASP 89, 120, "Magnitude-Diameter Relations for Star Images on the Palomar Sky Survey Prints". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) (OCR renders mu as "u") | `rawdata/imaging/poss/KingRaff1977_PASP89_120_MagnitudeDiameter_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1977PASP...89..120K |
| L90 | Lasker, B. M., Sturch, C. R., McLean, B. J., et al. 1990, AJ 99, 2019, "The Guide Star Catalog. I. Astronomical Foundations and Image Processing" (the PDS scanning used for the GSC-I and, per M00/L96, the DSS-1). ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images); OCR renders mu as "w"/"z"/"p" | `rawdata/imaging/poss/Lasker1990_AJ99_2019_GSC-I_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1990AJ.....99.2019L |
| RD93 | Reid, N., & Djorgovski, S. 1993, in Sky Surveys: Protostars to Protogalaxies, ASP Conf. Ser. 43, 125, "The Second Palomar Sky Survey". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/ReidDjorgovski1993_ASPC43_125_POSS-II_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1993ASPC...43..125R |
| LP93 | Lasker, B. M., & Postman, M. 1993, ASP Conf. Ser. 43, 131, "The Digitization of the Second Palomar Sky Survey". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images); OCR renders mu as "y"/"p" and the superscript 2 as "?" | `rawdata/imaging/poss/LaskerPostman1993_ASPC43_131_POSS-II_digitization_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1993ASPC...43..131L |
| R94 | Reid, I. N. 1994, in Astronomy from Wide-Field Imaging, IAU Symp. 161, 29, "The Second Palomar Sky Survey" (one-page summary). ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/Reid1994_IAUS161_29_POSS-II_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1994IAUS..161...29R |
| L96 | Lasker, B. M., Doggett, J., McLean, B., et al. 1996, ASP Conf. Ser. 101, 88, "The Palomar-ST ScI Digitized Sky Survey (POSS-II): Preliminary Data Availability". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images); OCR renders the superscript 2 as "7" ("230407" = 23040^2) | `rawdata/imaging/poss/Lasker1996_ASPC101_88_PalomarSTScI_DSS_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1996ASPC..101...88L |
| M00 | McLean, B. J., Greene, G. R., Lattanzi, M. G., & Pirenne, B. 2000, ASP Conf. Ser. 216, 145, "The Status of the Second Generation Digitized Sky Survey and Guide Star Catalog". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/McLean2000_ASPC216_145_DSS-II_GSC-II_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/2000ASPC..216..145M |
| C87 | California Institute of Technology 1987, PASP 99, 451, "Announcement of Availability of the Second Palomar Observatory Sky Survey". ADS scan, no usable text layer; quotes are from tesseract OCR of the page images (OCR errors kept; key numbers read off the page images) | `rawdata/imaging/poss/Caltech1987_PASP99_451_POSS-II_announcement_ADSscan.pdf` | https://articles.adsabs.harvard.edu/pdf/1987PASP...99..451. |
| D98 | Djorgovski, S. G., Gal, R. R., Odewahn, S. C., et al. 1998, in Wide Field Surveys in Cosmology, XIV IAP Colloq., p. 89, "The Palomar Digital Sky Survey (DPOSS)", arXiv:astro-ph/9809187 (arXiv version; text layer renders the degree sign as "◦") | `rawdata/imaging/poss/Djorgovski1998_DPOSS_IAPColloq14_arXiv-astro-ph9809187.pdf` | https://arxiv.org/pdf/astro-ph/9809187 |
| L08 | Lasker, B. M., Lattanzi, M. G., McLean, B. J., et al. 2008, AJ 136, 735, "The Second-Generation Guide Star Catalog: Description and Properties", arXiv:0807.2522 (arXiv version; Table 1 lists every survey's plate material and scan sampling) | `rawdata/imaging/poss/Lasker2008_AJ136_735_GSC-II_arXiv0807.2522.pdf` | https://arxiv.org/pdf/0807.2522 |
| D20 | Dekany, R., Smith, R. M., Riddle, R., et al. 2020, PASP 132, 038001, "The Zwicky Transient Facility: Observing System", arXiv:2008.04923 -- the same file and key as in data/imaging/megacam_ztf_small.md (the Oschin Schmidt as it is today) | `rawdata/imaging/ztf/Dekany2020_PASP132_038001_ZTF_ObservingSystem_arXiv2008.04923.pdf` | https://arxiv.org/pdf/2008.04923 |
| SDH | STScI/MAST, "MAST DSS" home page (page stamped "Last Modified: Jul 23, 2024 17:38"; fetched 2026-10-19) | `rawdata/imaging/poss/stsci_mast_dss_index.html` | https://archive.stsci.edu/dss/ |
| SDG | STScI/MAST, DSS "Getting Started" page (page stamped "Last Modified: Jul 23, 2024 17:38"; fetched 2026-10-19) | `rawdata/imaging/poss/stsci_mast_dss_getting_started.html` | https://archive.stsci.edu/dss/getting_started.html |
| GSO | STScI Catalogs and Surveys Group, "Sky Survey overview" (SkySurveys.htm; HTTP Last-Modified 2016-06-20; fetched 2026-10-19) | `rawdata/imaging/poss/stsci_gsss_SkySurveys.htm` | https://gsss.stsci.edu/SkySurveys/SkySurveys.htm |
| GST | STScI Catalogs and Surveys Group, "Sky Survey List" (Surveys.htm: table of every digitized survey -- epoch, emulsion+filter, depth, declination zones, number of plates, scan pixel size, GSC and DSS generation; plus the MAST survey-name mapping; HTTP Last-Modified 2016-06-20; fetched 2026-10-19) | `rawdata/imaging/poss/stsci_gsss_Surveys.htm` | https://gsss.stsci.edu/SkySurveys/Surveys.htm |
| GSD | STScI Catalogs and Surveys Group, "Digitized Sky Survey - Data Organization" (DSS Description.htm; HTTP Last-Modified 2016-06-20; fetched 2026-10-19) | `rawdata/imaging/poss/stsci_gsss_DSS_Description.htm` | https://gsss.stsci.edu/SkySurveys/DSS%20Description.htm |
| GSP | STScI Catalogs and Surveys Group, SurveyPlateList.txt ("compiled from the observatory plate logs", linked from GST; one row per digitized plate: plate ID, telescope, label, survey, region, centre RA/Dec, grade, epoch, UT; UTF-16 text, 8192 rows; HTTP Last-Modified 2008-08-04; fetched 2026-10-19). Counts quoted from it are DERIVED tallies | `rawdata/imaging/poss/stsci_gsss_SurveyPlateList_UTF-16.txt` | https://gsss.stsci.edu/SkySurveys/SurveyPlateList.txt |
| HE | STScI/MAST DSS cutout, survey poss1_red (POSS-I E), 2' x 2' at M101 (14 03 12.6 +54 20 57), FITS, retrieved 2026-10-19; the header carries the plate's metadata (plate XE133, label E1409) and its scan parameters | `rawdata/imaging/poss/stsci_dss_cutout_M101_poss1_red.fits` | https://archive.stsci.edu/cgi-bin/dss_search?v=poss1_red&r=14+03+12.6&d=%2B54+20+57&e=J2000&h=2.0&w=2.0&f=fits&c=none |
| HO | STScI/MAST DSS cutout, survey poss1_blue (POSS-I O), same position, FITS header (plate XO133, label O1409; scanned at 15 um) | `rawdata/imaging/poss/stsci_dss_cutout_M101_poss1_blue.fits` | https://archive.stsci.edu/cgi-bin/dss_search?v=poss1_blue&r=14+03+12.6&d=%2B54+20+57&e=J2000&h=2.0&w=2.0&f=fits&c=none |
| HJ | STScI/MAST DSS cutout, survey poss2ukstu_blue (POSS-II J), same position, FITS header (plate XJ175, label SJ06159) | `rawdata/imaging/poss/stsci_dss_cutout_M101_poss2ukstu_blue.fits` | https://archive.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_blue&r=14+03+12.6&d=%2B54+20+57&e=J2000&h=2.0&w=2.0&f=fits&c=none |
| HF | STScI/MAST DSS cutout, survey poss2ukstu_red (POSS-II F), same position, FITS header (plate XP174, label SF05135) | `rawdata/imaging/poss/stsci_dss_cutout_M101_poss2ukstu_red.fits` | https://archive.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r=14+03+12.6&d=%2B54+20+57&e=J2000&h=2.0&w=2.0&f=fits&c=none |
| HN | STScI/MAST DSS cutout, survey poss2ukstu_ir (POSS-II N), same position, FITS header (plate XI175, label SN07392) | `rawdata/imaging/poss/stsci_dss_cutout_M101_poss2ukstu_ir.fits` | https://archive.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_ir&r=14+03+12.6&d=%2B54+20+57&e=J2000&h=2.0&w=2.0&f=fits&c=none |

## POSS-I: National Geographic Society - Palomar Observatory Sky Survey (48-inch Schmidt, original singlet corrector; 103a-O and 103a-E plates; 1949-1958) and its DSS-1 digitization

**Recommended preset:** Schmidt, plate at the prime focus inside the tube. D = 1.2573 m (49.5-in clear aperture at the corrector = the stop; H52), spherical mirror 1828.8 mm (72 in), R = 6125.5 mm (241.16 in), stop at the centre of curvature (D20). f_eff = 3070.0 mm DERIVED from the plate scale 67.187"/mm (H52; f/2.442, published f/2.44). eps NOT PUBLISHED (DERIVED lower bound 0.319 from the 14-inch plate; four vanes, D20). Detector: one 14 x 14 in (355.6 mm) glass plate, 1 mm thick, bent to the spherical focal surface (R ~ 3.07 m); 6.6 x 6.6 deg (43.56 deg2); unvignetted 5.4 deg diameter (field circle 324'; the mirror walk-off reproduces it, 5.34 deg). Bands: O = 103a-O unfiltered (lambda_eff ~4100 A, ~1100 A wide), E = 103a-E + red Plexiglas 2444 (6200-6700 A). Emulsion 80 lines/mm; smallest star images ~30 um (2.0"). Exposures 10-15 min (O), 40-60 min (E); limits O 21.1, E 20.0. Survey: 936 fields on a 6-deg grid (overlap >= 0.6 deg) to dec -33. DSS-1 (POSS-I E): 25.2845 um (1.70"/px), 14000 x 14000 px per plate; POSS-I O later at 15 um (1.0"/px, 23040 x 23040).

### Telescope

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| telescope_aperture | 1.2573 | m (clear aperture at the corrector plate = the aperture stop) | H52, p. 278 | "The clear aperture in the camera is 49.5 inches (125.73 cm), giving a focal ratio of {/2.44."<br>Note: OCR "{/2.44" = f/2.44 (page image). For a Schmidt the entrance pupil is the stop at the corrector; the mirror (72 in) is larger.<br>ALT: 1.27 (H52, p. 278: "The correcting plate, C, is of 4 inch (9.53 mm) selected plate glass with an over-all diameter of 53 inches (134.62 cm) and a usable aperture of 50 inches (127 cm).") [usable aperture of the corrector plate itself (50 in); overall 53 in (1.346 m). OCR "4 inch" = 3/8 inch (page image)]<br>ALT: 1.2573 (R91, Sec. 3: "The correcting plate has a clear aperture of 49.5 inches") [same value restated in 1991]<br>ALT: 1.244 (D20, Sec. 3.1: "singlet aspheric (nominally zero power) corrector plate in the plane of the stop (diameter 1244 mm)") [D20's figure for the ORIGINAL singlet corrector at the stop; 13 mm smaller than H52's 49.5 in -- see conflicts]<br>ALT: 1.2 (R91, Sec. 1: "48-inch (1.2-m) Oschin telescope") [nominal 48-inch name] |
| primary_mirror | diameter_mm: 1828.8; radius_of_curvature_mm: 6125.5; figure: spherical, aluminized Pyrex | mm | H52, p. 277 | "The principal objective, 4, is a concave spherical pyrex-glass mirror coated with aluminum. It has a diameter of 72 inches (182.88 cm) ... The radius of curvature is 241.16 inches (612.54 cm) and the effective focal length 121 inches (307 cm)."<br>Note: OCR "4" = A (the drawing letter). D20 records the same mirror for ZTF (cite by key).<br>ALT: diameter_mm: 1828; stop_distance_mm: 6124 (D20, Sec. 3.1: "The telescope originally consisted of a concave spherical mirror (diameter 1828 mm), an aperture stop located at the center of curvature of this mirror (6124 mm away)") [the mirror and stop geometry, unchanged since 1948; same record as megacam_ztf_small.md 'primary_mirror']<br>ALT: diameter_in: 72; radius_of_curvature_in: 241 (R91, Sec. 3: "primary mirror is of diameter 72 inches (1.8 m) with a radius of curvature of 241 inches.")<br>DERIVED: 72 in = 1828.8 mm; 241.16 in = 6125.5 mm; mirror focal length R/2 = 3062.7 mm (D20: 3062 mm). |
| stop_position | at the mirror's centre of curvature (6124 mm in front of the mirror); the corrector plate sits in the stop |  | D20, Sec. 3.1 | "an aperture stop located at the center of curvature of this mirror (6124 mm away), and a singlet aspheric (nominally zero power) corrector plate in the plane of the stop"<br>Note: H52 gives no stop distance; D20's record of the original design is used (cite D20 as in megacam_ztf_small.md).<br>ALT: conventional Schmidt (H52, p. 277: "The optical path in this instrument conforms to the conventional schmidt design.") |
| corrector | type: singlet aspheric plate, plate glass, figured on both sides; thickness_mm: 9.53; overall_diameter_mm: 1346.2; usable_diameter_mm: 1270; neutral_zone_radius_mm: 508; corrected_for_A: 4358 |  | H52, p. 278 | "The correcting plate, C, is of 4 inch (9.53 mm) selected plate glass with an over-all diameter of 53 inches (134.62 cm) and a usable aperture of 50 inches (127 cm). It is figured on both sides, the neutral zone being 20 inches (50.8 cm) from the center. The correction is for 44358."<br>Note: OCR "4 inch" = 3/8 inch and "44358" = lambda 4358 (page image).<br>ALT: figured for minimum chromatic aberration at 4358 A; image quality degrades in the near-IR (R91, Sec. 3.1: "The original corrector plate is of plate glass, figured to give the minimum chromatic aberration at \4358 (MA63). As a result, the image quality deteriorates significantly at near-infrared wavelengths")<br>ALT: UV transmission: falls off at 3600 A, ~40% at 3400 A, ~0 at 3200 A (H52, p. 278: "The transmission begins to fall off at A 3600, is about 40 percent at 4 3400, and becomes essentially zero at 4 3200.") [OCR "A"/"4" = lambda; this sets the blue end of the unfiltered 103a-O band] |
| telescope_focal_ratio | 2.44 | f/# (on the 49.5-in clear aperture) | H52, p. 278 | "The clear aperture in the camera is 49.5 inches (125.73 cm), giving a focal ratio of {/2.44."<br>ALT: 2.44 (R91, Sec. 3: "giving a focal ratio of f/2.44")<br>DERIVED: From the published plate scale: f = 206264.8 / 67.187 = 3070.0 mm; 3070.0 / 1257.3 = f/2.442. From 121 in: 3073.4 / 1257.3 = f/2.444. |
| effective_focal_length | 3.07 | m (DERIVED from the plate scale 67.187"/mm) | H52, p. 278 | "The plate scale is 1 mm = 677187."<br>Note: OCR "677187" = 67".187 (page image).<br>ALT: 3.0734 (H52, p. 277: "the effective focal length 121 inches (307 cm).") [121 in = 3073.4 mm]<br>ALT: 3.0709 (R91, Sec. 3.2: "in the case of the Oschin Schmidt, 120.9 inches (3.07 m).") [R91's focal-surface radius, 'equivalent to the focal length'; 120.9 in = 3070.9 mm]<br>ALT: 3.0627 (H52, p. 277: "The radius of curvature is 241.16 inches (612.54 cm)") [R/2 = 3062.7 mm, the mirror's paraxial focal length (D20: 3062 mm)]<br>ALT: 3.0694 (HE, FITS header (DSS): "PLTSCALE=                67.20 /Detector: Plate Scale arcsec per mm") [206264.8 / 67.20 = 3069.4 mm, the scale the DSS astrometry adopts]<br>DERIVED: 206264.8 / 67.187 = 3070.04 mm. The four published routes (3062.7, 3069.4, 3070.0-3070.9, 3073.4 mm) agree to 0.35%. |
| focal_surface | spherical, concave toward the mirror, radius = focal length (~3.07 m); plates bent to it in the plateholder |  | H52, p. 278 | "Since the focal plane is spherical the plates must be bent to the proper spherical radius while being exposed."<br>ALT: 3070.9 (R91, Sec. 3.2: "In a classical Schmidt telescope the focal plane is a spherical surface with a radius of curvature equivalent to the focal length of the telescope—in the case of the Oschin Schmidt, 120.9 inches (3.07 m). The 1-mm thick glass plates are bent to shape by the plate-holder mandrels (Harrington 1952, Fig. 4).") [radius in mm (DERIVED 120.9 in)]<br>ALT: 3058.2 (R91, Sec. 3.2: "the mandrels had been figured to a smaller radius of curvature than the focal length of the telescope—typically 120.4 inches") [the POSS-I-era mandrels as found in the late 1980s (120.4 in = 3058.2 mm); reground for POSS-II]<br>ALT: 3062 (D20, Sec. 3.1: "This design produced a focal plane of excellent image quality approximately mid-way between stop and primary mirror, having a radius of curvature of 3062 mm.") [the ZTF paper's value for the original design]<br>ALT: bend test to R = 100 in (2540 mm) for one minute before use (H52, p. 279: "Normal procedure is to bend each plate to a radius of 100 inches (254 cm) for a period of one minute before using it in the schmidt camera.") [a breakage test, tighter than the working radius] |
| central_obstruction | null (not published) | linear eps: NOT PUBLISHED | H52, p. 278 | "the ring girder and blade assembly, which supports the plateholder, B, at the center of the tube."<br>Note: No source gives the plateholder's size or an obscured fraction. What sets it: the plateholder with the bent 14-inch plate, at the focus inside the tube, held by a ring girder and vanes.<br>ALT: four vanes, in the plane of the ring girder, held the plate focus hub (D20, Sec. 4.1 (Instrument support structure): "a four-vane structure was used to support a mechanical screw driven focus hub which held the photographic plates at prime focus. The four-vane structure lay in the same plane as the telescope ring-girder") [vane width not published]<br>ALT: 0.319 (H52, p. 278: "The 48-inch schmidt camera is designed to use either 14-inch (35.56 cm) or 10-inch (25.4 cm) square glass photographic plates") [DERIVED LOWER BOUND, not a published value: the 14-inch plate alone, as an area-equivalent circle on the 49.5-in pupil]<br>DERIVED: Lower bound from the plate alone: area-equivalent diameter of a 355.6 mm square = 355.6 x sqrt(4/pi) = 401.3 mm; / 1257.3 mm = eps 0.319 (10.2% of the pupil area). The real plateholder (frame, mandrel, loading mechanism) is larger, so the true eps is larger. |
| shutter | clam-shell shutter just behind the corrector, opening to pass the full 49.5-in beam |  | H52, p. 279 | "The exposure shutter, F, is located in the upper end of the tube just behind the correcting plate. ... to accommodate the entire 49.5-inch incident beam." |

### Plate and field

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| plate_size | in: [14, 14]; mm: [355.6, 355.6]; thickness_mm: 1.0; glass: yes |  | H52, p. 278 | "The 48-inch schmidt camera is designed to use either 14-inch (35.56 cm) or 10-inch (25.4 cm) square glass photographic plates 0.040 inch (1 mm) in thickness."<br>Note: The survey used the 14-inch plates (A58, A59). 10-inch plates were the other option.<br>ALT: 355.0 (HE, FITS header (DSS): "PLTSIZEX=              355.000 /Detector: Plate X Dimension mm") [the DSS plate metadata: 355 x 355 mm]<br>ALT: 355 (L90, Sec. III a 1: "In order to facilitate the rapid mounting of Schmidt plates (355 mm square)")<br>ALT: 1-mm-thick Palomar originals (L90, Sec. III a 1: "particularly the 1-mm-thick Palomar originals, are not sufficiently flat") |
| plate_field | deg: [6.6, 6.6]; area_deg2: 43.56 | deg | H52, p. 278 | "The 14 14 inch plate, 6°6 X 6°6, covers 43.56 square degrees."<br>Note: OCR drops the multiplication sign ("14 14" = 14 x 14) and renders 6.6 as "6°6".<br>ALT: deg: [6.6, 6.6] (A58, Sec. II a: "Each of the 14 X 14-inch photographic plates employed covers a field 6°6 square")<br>ALT: deg: [6.6, 6.6] (A59, p. 1: "can cover an area of the sky 6.6 degrees square")<br>ALT: deg: [6.43, 6.43] (LD73, Sec. VII item 1: "The actual photographic area on each print ... measures 6°43 square and not 6°6 square as men- tioned in the literature.") [the exposed area on the Atlas PRINTS (6.6 deg includes the black margin)]<br>ALT: deg: [6.4, 6.4] (L90, Sec. II a (Quick V survey): "grid of 6°4 plates on 6°0 centers as in the original National Geographic Society-Palomar Observatory Sky Survey") [L90's figure for the plate field on the POSS grid]<br>ALT: deg: [6.0, 6.0] (R91, Sec. 2: "the 6° x 6° field covered by the 14-inch plates")<br>DERIVED: 355.6 mm x 67.187"/mm = 23,891" = 6.637 deg per side; area 44.05 deg2 (the published 43.56 = 6.6^2). Diagonal 502.9 mm = 9.386 deg. |
| field_unvignetted | 5.4 | deg (diameter) | A58, Sec. II a | "The non-vignetted field is 5°4 in diameter. The computed loss in limiting magni- tude because of vignetting at the extreme corners of a plate is less than 0.2 mag."<br>ALT: 5.34 (H52, p. 278: "This combination of aperture and focal ratio gives a field free of vignetting 1114 inches (28.6 cm) in diameter at the focus. The greatest loss due to vignetting at the corners of the plate is 0. 1 magnitude.") [OCR "1114" = 11 1/4 in (page image); 286 mm x 67.187"/mm = 5.338 deg (DERIVED); corner loss 0.1 mag]<br>ALT: 5.4 (R91, Sec. 3: "the unvignetted field is of only 5°4 diameter.")<br>ALT: 30 deg2 unvignetted (RD93, p. 129: "the 30 square-degree unvignetted 48-inch Schmidt fields") [inconsistent with 5.4 deg diameter (22.9 deg2, DERIVED) -- see conflicts]<br>DERIVED: Mirror walk-off only (the explorer's Schmidt geometry): a 1257.3 mm beam pivoting about the stop 6125.5 mm from a 1828.8 mm mirror stays on the mirror for tan(theta) <= (914.4 - 628.65)/6125.5 = 0.04665, theta <= 2.671 deg -> unvignetted diameter 5.34 deg, reproducing H52's 28.6 cm (5.34 deg) exactly. The plate corners (radius 4.69 deg) lose part of the beam but only 0.1-0.2 mag (H52, A58). |

### Bands (emulsion + filter)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| O | emulsion: Kodak 103a-O; filter: null (not published); lam_eff_A: 4100; passband_A: 1100 | Angstrom | R91, Sec. 2 | "with the blue plates being unfiltered 103a-O and the red _ plates combining 103a-E emulsion with a red plexiglass 2444 filter. The resultant spectral response functions (see MA63) give effective wavelengths of ~ 4100 A in the blue (with a passband of ~ 1100 A) and ~ 6500 A in the red (passband ~ 500 A)."<br>Note: Unfiltered: the blue end is set by the corrector glass and the atmosphere (H52: transmission falls off below 3600 A, ~0 at 3200 A), the red end by the 103a-O sensitivity (edge not given numerically in the sources obtained).<br>ALT: blue-sensitive Kodak 103a-O (LD73, Sec. I: "red-sensitive (Kodak 103a-E) and blue-sensitive (Kodak 103a-O) photographs")<br>ALT: 103a-O unfiltered (L08, Table 1: "XO           POSS-I O        δ ≥ −30◦        1950-58     103aO unfiltered      O        21.0          935     N/Y")<br>ALT: 103aO, no filter (HO, FITS header (DSS): "EMULSION= '103aO   '           /Detector: Emulsion ... FILTER  = '        '           /Detector: Filter")<br>DERIVED: Range implied by R91's lambda_eff -/+ passband/2: ~3550-4650 A (rough; R91's response curves are in MA63, not obtained). |
| E | emulsion: Kodak 103a-E; filter: red Plexiglas (no. 2444); range_A: [6200, 6700]; lam_eff_A: 6500 | Angstrom | A58, Sec. II a | "The red plate-filter combination has a wave-length range of \ 6200 (filter cut off) to \ 6700, with an effec- tive wave length near \ 6500."<br>Note: OCR "\" = lambda. Blue edge set by the filter, red edge by the emulsion. The 6200-6700 A band brackets H-alpha.<br>ALT: range_A: [6000, 6700]; filter: No. 160 red plexiglass (H52, p. 280: "For Eastman 103a-E spectroscopic plates used in combination with a No. 160 red plexiglass filter ... The No. 160 plexiglass filter, used with 103a-E plates, has a spectral sensitivity range from about A 6000 to A 6700, almost identical to that of a Wratten No. 29 filter.") [1952 description; filter number differs from the later sources -- see conflicts]<br>ALT: lam_eff_A: 6500; passband_A: 500; filter: red plexiglass 2444 (R91, Sec. 2: "the red _ plates combining 103a-E emulsion with a red plexiglass 2444 filter ... ~ 6500 A in the red (passband ~ 500 A).")<br>ALT: filter: red Plexiglas 2444 (LD73, Sec. I: "The red plates of the original survey were taken on Kodak 103a-E emulsion in combination with a red Plexiglas 2444 filter.")<br>ALT: filter: red plexiglass no. 2444 (L08, Table 1 note 3: "POSS-I E filter was red plexiglass no. 2444")<br>ALT: filter: plexi (HE, FITS header (DSS): "EMULSION= '103aE   '           /Detector: Emulsion ... FILTER  = 'plexi   '           /Detector: Filter") |

### Emulsion fineness

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| resolving_power | 80 | lines per mm (103a emulsions) | R91, Sec. 2 | "The 103a emulsion is a moderately coarse-grained emulsion, with a resolution of 80 lines mm“!, but with high contrast."<br>Note: OCR "mm“!" = mm^-1. 'Lines per mm' is quoted without saying whether a line pair is meant.<br>DERIVED: 1/80 mm = 12.5 um = 0.84" at 67.19"/mm. |
| smallest_star_image | 30 | um (diameter of the smallest stellar images = the emulsion's resolution limit) | A58, Sec. II a | "The smallest stellar images have a diameter of about 30 yw, about the limit of resolution of the Eastman 103a emulsions used"<br>Note: OCR "yw" = mu (page image: 30 mu).<br>ALT: diameter_um: 30; m_b: 21.1; m_r: 20.5 (KR77, Table I: "30u 21.1 20.5") [image diameter on the Atlas PRINTS (contact copies, same scale) vs magnitude: the faintest tabulated row; diameters judged 'where the image was a fairly dark gray but not quite black']<br>ALT: seeing <= 3" (A58, Sec. II a: "when the seeing disk of a stellar image was not more than 3 seconds of arc in diameter.") [survey acceptance condition]<br>DERIVED: 30 um x 67.187"/mm = 2.0". |
| grain_size | null (not published) | NOT PUBLISHED as a number in the sources obtained | R91, Sec. 2 | "The 103a emulsion is a moderately coarse-grained emulsion"<br>Note: Only qualitative ('moderately coarse-grained'); the resolving power (80 lines/mm) and the smallest image size (30 um) stand in for it. |
| contrast | [1.5, 2.0] | gamma (original plates, D-19, 5 min) | A58, Sec. II a | "All plates were developed in standard formula D-19 developer for 5 minutes; the resulting contrasts are between 1.5 and 2.0." |

### Exposure, depth, plate scale (validation targets)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| exposure_time | O_min: [10, 15]; E_min: [40, 60] | minutes | A58, Sec. II a | "They ranged from 10 to 15 minutes for the blue exposures and from 40 to 60 minutes for the red."<br>ALT: O_min: [10, 12]; E_min: [45, 60] (H52, p. 280: "Normal exposure times for Eastman 103a-O spectroscopic plates is from 10 to 12 minutes without filter. For Eastman 103a-E spectroscopic plates used in combination with a No. 160 red plexiglass filter, exposure times are from 45 to 60 minutes.")<br>ALT: O_min: 10; E_min: 45 (A59, p. 3: "usually about ten minutes for -the blue plates and about forty-five minutes for the red.")<br>ALT: O_min: 20; E_min: 40 (R91, Sec. 2: "With relatively short exposure times (20 minutes in the blue, 40 minutes in the red)") [R91's summary of MA63; disagrees with the contemporaneous sources -- see conflicts]<br>ALT: O_min: 12; E_min: 50 (HE, FITS headers (DSS), plates O1409 / E1409: "EXPOSURE=                 50.0 /Observation: Exposure Minutes") [one field's actual exposures (HO header: "EXPOSURE=                 12.0")] |
| limiting_magnitude | O: 21.1; E: 20.0 | mag (O: photographic; E: 'photored', ~Kron & Smith 1951 system); every star of that magnitude leaves a recognizable image | A58, Sec. II a | "The limiting photographic magnitude for the blue plates is 21.1, and the limiting photored magnitude for the red plates is 20.0."<br>ALT: O: 21.0; E: 20.0 (GST, survey table: "POSS-I E XE 1950-58 103aE Epg 20.0 +90:-30 936 1.0/1.7" 2 1 STScI ... POSS-I O XO 1950-58 103aO Opg 21.0 +90:-30 936 1.0" 2 2 STScI")<br>ALT: O: 21.0; E: 20.0 (L08, Table 1: "XE(3)        POSS-I E        δ ≥ −30◦        1950-58   103aE+red plexiglass    E        20.0          935     N/N")<br>ALT: 20.3 (H52, p. 280: "Limiting photographic magnitude on the 48-inch schmidt plates is 20.3.") [1952, early in the survey]<br>ALT: 21st magnitude (A59, p. 1: "images are recorded of stars of the 21st magnitude") |
| plate_scale | 67.187 | arcsec/mm | H52, p. 278 | "The plate scale is 1 mm = 677187."<br>Note: OCR "677187" = 67".187 (page image).<br>ALT: 67.19 (R91, Sec. 3: "a plate scale of 67’19 per millimeter.") [OCR "67’19" = 67".19]<br>ALT: 67.1 (A58, Sec. II a: "the image scale is thus 67.1 seconds of arc per millimeter.")<br>ALT: 67.2 (HE, FITS header (DSS): "PLTSCALE=                67.20 /Detector: Plate Scale arcsec per mm")<br>ALT: 67.14 (LD73, Sec. VII item 1: "the nominal plate scale of 67’14 mm—!.") [nominal PRINT scale; LD73 measures 67.38/66.78"/mm on the paper prints (X/Y), from paper stretch]<br>ALT: about two inches per degree (A59, p. 1: "(about two inches per degree)") [rough: 50.8 mm/deg = 70.9"/mm] |

### Survey

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| n_fields | 936 | fields (to dec -33; 1872 plates, one O + one E per field) | LD73, Sec. I | "photographs of 936 different fields of the sky yielding a total of 1872 photo- graphs."<br>ALT: 935 (R91, Sec. 2: "While this allowed coverage of the sky in only 935 plate pairs (879 to —27°)")<br>ALT: 879 (A58, Sec. II a: "The survey covers the sky from the north celestial pole down to declination —27° on 879 pairs of photographs") [the original plan (to -27 deg)]<br>ALT: 879 (A59, p. 2: "This northern three-quarters of the sky (down to declination—27°) was divided into 879 fields, each 6 degrees on a side.")<br>ALT: 936 (GST, survey table: "POSS-I E XE 1950-58 103aE Epg 20.0 +90:-30 936")<br>ALT: 935 (L08, Table 1: "XO           POSS-I O        δ ≥ −30◦        1950-58     103aO unfiltered      O        21.0          935     N/Y")<br>ALT: 935 (M00, Table 1: "POSS-I 1950-58 E 20.0 +90:—30 935")<br>ALT: E_regions: 936; E_plates: 937; O_regions: 930; O_plates: 933 (GSP, rows with Survey = POSSI-E / POSSI-O: "Palomar Schmidt") [DERIVED tallies of the plate list (STScI's digitized plates; 'XE001A'/'XE001B' are two plates of one field)] |
| field_spacing | 6.0 | deg between plate centres | R91, Sec. 2 | "The original survey was taken with a six-degree spacing between plate centers."<br>ALT: 6.0 (L08, Table 1 note: "POSS-I and Pal-QV surveys utilized a 6◦ grid of telescope pointings, with minimum plate overlap, while the other surveys used a 5◦ degree grid.")<br>ALT: overlap_deg: 0.6 (A58, Sec. II a: "The fields for the sky survey were selected to allow for an overlap of at least 0°6 along adjacent edges.")<br>ALT: small overlap, mostly vignetted (R91, Sec. 2: "allows only a small overlap between adjacent fields, with most of this overlap lying in the vignetted regions.")<br>ALT: dec_zones: -30, -24, ..., +84, +90 (21 zones, 6 deg apart) (GSP, centre declinations of the POSSI-E rows: "Palomar Schmidt") [DERIVED from the plate list (zone counts 57, 55, 60, ... 10, 2 plates)]<br>DERIVED: Overlap = plate width - spacing = 6.6 - 6.0 = 0.6 deg (= A58's figure); 6.64 - 6.0 = 0.64 deg with the DERIVED plate width. |
| sky_coverage | dec >= -33 deg (blue + red); -27 deg in the original plan; red-only Whiteoak extension to about -42/-45 deg |  | R91, Sec. 2 | "to a declination limit of —27° (Wilson 1952) but was extended to —33° ... Whiteoak further extended the survey to a declination of — 45° (or a zenith distance of 78°) using red plates only."<br>ALT: dec > -33 (LD73, Sec. I: "From 1949 to 1958, the 48-inch Palomar Schmidt telescope was used to photographically survey the entire sky above declination —33°")<br>ALT: +90 to -30 (zones) (GST, survey table: "POSS-I O XO 1950-58 103aO Opg 21.0 +90:-30 936")<br>ALT: dec >= -30 (L08, Table 1: "XE(3)        POSS-I E        δ ≥ −30◦")<br>ALT: Whiteoak extension to -42 deg, 1964/5 (R94, p. 29: "(with plates for the Whiteoak extension, to 5, = -42°, taken in 1964/5)") [OCR "5," = delta_1950]<br>ALT: Whiteoak extension to about -45 deg, red only, amber Plexiglas (LD73, Sec. I: "This series extends the southern limit of the survey to about —45° declination. Only one photograph, in red light, was taken of each field for the extension.")<br>ALT: Whiteoak extension made in 1962 (LD73, Sec. I: "In 1962, J. B. Whiteoak made a series of photographs with the Palomar Schmidt telescope") [vs 1964/5 in R94 -- see conflicts]<br>ALT: 33660 (D20, Sec. 1: "ZTF observes the same number (33,660) of square degrees as POSS") [deg2; DERIVED: the sky north of -39.2 deg; north of -33 deg is 31,860 deg2]<br>DERIVED: Sky north of dec -33: 41,253 x (1 + sin 33)/2 = 31,860 deg2; north of -30: 30,940 deg2. Lowest POSS-I E centre in GSP: -30.74 deg -> southern edge -34.1 deg. |
| dates | first_plate: 1949-11-11 (rejected); 99_percent_by: 1956-06-20; last_plate: 1958-12-10 |  | RD93, pp. 125-126 | "the first plate (rejected!) taken on November 11th, 1949. ... In fact, 99 % of the plates were taken by June 20, 1956 - and the final 1 % was not completed until Dec 10, 1958."<br>ALT: first accepted plates July 1949; completed late 1956 (R91, Sec. 2: "with the first ac- cepted plates being taken in July 1949 and the survey completed in late 1956.") [July 1949 precedes RD93's first plate (Nov 1949) -- see conflicts]<br>ALT: 1949-1958 (LD73, Sec. I: "From 1949 to 1958, the 48-inch Palomar Schmidt telescope")<br>ALT: Nov 1949 - Dec 1958 (R94, p. 29: "between November 1949 and December 1958")<br>ALT: 1950-58 (GST, survey table: "POSS-I E XE 1950-58")<br>ALT: 1950-1957 (D20, Sec. 1: "the 14-inch photographic plates used on the same telescope during the two color Palomar Optical all Sky Survey (POSS) from 1950 to 1957")<br>ALT: earliest: 1949-11-19; latest: 1958-12-10 (GSP, UT column of the POSSI-E rows: "1958-12-10T10:12:00.") [DERIVED range of the digitized plates (one row carries a mistyped epoch 2049.894 with UT 1949-11-23)] |

### Digitization (DSS-1, and the later 15-um scans)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| dss1_plates | POSS-I E (north) + SERC-J (south) make up the published DSS-1 (102 CD-ROMs, 10x lossy H-transform compression) |  | M00, Sec. 2 | "The originally published Digitized Sky Survey consisted of the Palomar POSS-I E survey and the SERC-J survey scanned at 25 micron resolution with modified PDS microdensitometers (Laidler et al. 1994)."<br>ALT: POSS-I (E) + SERC J; 10x H-transform; 102 CD-ROMs (L96, Sec. 2: "A very similar problem with earlier ST ScI scans of the POSS-I (E) and the SERC J surveys led to the development of the Digitized Sky Survey—I, based on 10X compression with loss, using the H-transform (White et al. 1992), and occupying 102 printed CD-ROMs.")<br>ALT: POSS-I E in DSS 1 (GST, survey table: "POSS-I E XE 1950-58 103aE Epg 20.0 +90:-30 936 1.0/1.7" 2 1 STScI") [DSS 1/2 column = 1]<br>ALT: DSS1 = Pal-QV (North) (GST, MAST survey mapping note: "DSS1 = Pal-QV (North), SERC-J/SERC-EJ (South) DEPRECATED & No Longer Supported") [contradicts the same page's table and M00/L96 -- see conflicts]<br>ALT: scans of glass copies (L08, Table 1 note: "Scans performed on glass copies of the S, XE and XO plates, rather than on the original plates.") |
| dss1_scan_step | 25.2845 | um (sample interval) | HE, FITS header (DSS), plate E1409 | "XPIXELSZ=              25.2845 /Scan: Pixel Size microns"<br>ALT: 25 (M00, Sec. 2: "scanned at 25 micron resolution")<br>ALT: 25 (SDG, Getting Started: "The digital images have a pixel size of either 25 microns (1.7 arcsec per pixel) or 15 microns (1.0 arcsec per pixel)")<br>ALT: 25 (GSO, overview: "a pixel size of either 25 or 15 microns (1.7 or 1.0 arcsec respectively)")<br>ALT: 25.284 (L90, Table IV (PDS scanning configuration): "Sample interval 25.284 wm") [the GSC-I configuration (Quick-V and SERC-J plates); footnote: "This parameter was 25.000 um before 5 March, 1985."; OCR "wm" = um]<br>ALT: 25 (L08, Table 1 note 3: "scanned at 25 micron sampling except 123 plates scanned at 15 micron") [123 POSS-I E plates, mostly south of -18 deg, were scanned at 15 um instead] |
| dss1_pixel_scale | 1.7 | arcsec/pixel | HE, FITS header (DSS) | "CD1_1   =        -0.0004722193 /GetImage: rotation matrix coefficient"<br>Note: The cutout's local WCS; 0.0004722193 deg = 1.700".<br>ALT: 1.7 (SDH, home page: "to a pixel scale of about 1.7 arcseconds per pixel for the POSS, SERC, and Palomar Quick-V surveys")<br>ALT: 1.7 (SDG, Getting Started: "25 microns (1.7 arcsec per pixel)")<br>ALT: 1.7 (GSD, Data Organization: "survey plate scan was either 14000x14000 (1.7" pixels) or 23040x23040 (1.0" pixels) in size.")<br>ALT: 1.7 (L90, Abstract: "The plates were digitized into 14 000 x 14 000 rasters at a 25 wm (1°77) sampling interval using modified PDS microdensitometers.") [OCR "1°77" = 1".7 (page image); GSC-I plates]<br>ALT: 1.73 (D98, Sec. 2: "1.0 arcsec instead of 1.73 arcsec used in the DSS.") [1.73" matches no plate scale x 25.28 um on the Palomar plates (1.70") -- see conflicts]<br>DERIVED: 25.2845 um x 67.20"/mm = 1.699"; x 67.187"/mm = 1.699". |
| dss1_scan_size | [14000, 14000] | pixels per plate | SDG, Getting Started | "and are 14000 x 14000 or 23040 x 23040 npixels perl side."<br>ALT: [14000, 13999] (HE, FITS header (DSS): "XPIXELS =                14000 /Scan: X Dimension ... YPIXELS =                13999 /Scan: Y Dimension")<br>ALT: pixels: [14000, 14000]; scan_size_mm: 355; volume: 400 Mbytes (L90, Table IV: "Scan size 355 mm sqpare ... Image size 14000 x 14000 pixels") [OCR "sqpare" = square]<br>ALT: pixels: [14000, 14000]; volume_GB: 0.4 (GSO, overview: "These images are 14000x14000 (0.4GB) or 23040x23040 pixels (1.1GB) in size")<br>DERIVED: 14000 x 25.2845 um = 354.0 mm = 6.61 deg at 67.20"/mm (the whole 355-mm plate). |
| dss1_aperture | 50 | um (smoothly apodized scanning aperture, GSC-I PDS configuration) | L90, Sec. III a | "In order to avoid astrometric errors due to aliasing, the plates are fil- tered through a 50 wm smoothly apodized aperture before sampling"<br>Note: OCR "wm" = um. Stated for the GSC-I scans (L90); M00 and L96 say the POSS-I E scans used the same modified PDS machines, but neither restates the aperture.<br>ALT: 25 x 60 um lower aperture, projected (L90, Table IV: "Lower aperture projected 25 wm x 60 pm") [the PDS slit as projected on the plate]<br>ALT: 25 um is 'slightly too coarse'; full extraction needs 12-18 um (L90, Sec. III a: "The adopted sample interval is 25 zm. This is slightly too coarse to extract all available information from the plates, which have image sizes as small as 40 wm (visual full width)") |
| later_15um_scans | POSS-I O: all plates at 15 um (1.0"); POSS-I E: 123 plates at 15 um |  | GST, survey table | "POSS-I O XO 1950-58 103aO Opg 21.0 +90:-30 936 1.0" 2 2 STScI"<br>Note: POSS-I O was digitized only in the second (GSC-II/DSS-2) campaign, on the GAMMA machines at 15 um; it appears in MAST as 'POSS1 Blue'.<br>ALT: x_um: 15.0295; y_um: 15.0; pixels: [23040, 23040] (HO, FITS header (DSS), plate O1409: "XPIXELS =                23040 /Scan: X Dimension ... XPIXELSZ=              15.0295 /Scan: Pixel Size microns ... YPIXELSZ=              15.0000 /Scan: Pixel Size microns")<br>ALT: POSS1 Blue = POSS-I O (GST, MAST survey mapping note: "POSS1 Blue = POSS-I O") |

### Preset object (explorer)

```json
{
 "id": "poss1",
 "name": "Palomar 48-inch Schmidt / POSS-I plates",
 "tel": "schmidt",
 "optics": "direct",
 "era": "1949-1958",
 "D_m": 1.2573,
 "D_basis": "49.5-in clear aperture at the corrector = the aperture stop (H52)",
 "eps": null,
 "eps_published": false,
 "eps_lower_bound": 0.319,
 "eps_note": "No obscuration is published. 0.319 = area-equivalent of the 14-inch plate alone (DERIVED lower bound); the plateholder is larger. Four support vanes (D20), width unpublished.",
 "F": 2.442,
 "F_published": 2.44,
 "f_eff_mm": 3070.0,
 "f_eff_basis": "206264.8 / 67.187\"/mm (H52 plate scale)",
 "mirror_D_mm": 1828.8,
 "mirror_R_mm": 6125.5,
 "stop_to_mirror_mm": 6125.5,
 "corrector": {
  "type": "singlet aspheric plate (plate glass), figured both sides",
  "usable_D_mm": 1270,
  "overall_D_mm": 1346.2,
  "thickness_mm": 9.53,
  "corrected_for_A": 4358
 },
 "focal_surface_R_mm": 3070.9,
 "focal_surface_note": "spherical, radius = focal length (R91: 120.9 in); the plate is bent to it",
 "plate_scale_arcsec_per_mm": 67.187,
 "field_unvignetted_deg": 5.4,
 "field_circle_arcmin": 324,
 "field_circle_note": "unvignetted circle (A58/R91 5.4 deg; H52 28.6 cm = 5.34 deg). The plate's corners reach 9.39 deg across (563') with only 0.1-0.2 mag loss.",
 "plate_corner_circle_arcmin": 563,
 "detector": {
  "type": "photographic_plate",
  "n_plates": 1,
  "pixels": null,
  "size_mm": [
   355.6,
   355.6
  ],
  "size_deg_published": [
   6.6,
   6.6
  ],
  "size_deg_derived": [
   6.637,
   6.637
  ],
  "area_deg2_published": 43.56,
  "thickness_mm": 1.0,
  "glass": true,
  "curved": true,
  "bent_to_radius_mm": 3070.9,
  "usable_area_deg": 6.43,
  "usable_area_note": "photographic area on the Atlas prints (LD73)",
  "emulsions": {
   "O": "Kodak 103a-O (unfiltered)",
   "E": "Kodak 103a-E + red Plexiglas 2444"
  },
  "resolving_power_lines_per_mm": 80,
  "smallest_star_image_um": 30,
  "smallest_star_image_arcsec": 2.0,
  "grain_size_um": null,
  "contrast_gamma": [
   1.5,
   2.0
  ]
 },
 "bands": [
  {
   "k": "O",
   "emulsion": "103a-O",
   "filter": null,
   "lam_eff_A": 4100,
   "passband_A": 1100,
   "range_A_derived": [
    3550,
    4650
   ],
   "blue_edge_note": "corrector transmission falls off below 3600 A, ~0 at 3200 A (H52)",
   "exposure_min": [
    10,
    15
   ],
   "mlim": 21.1,
   "mlim_system": "photographic"
  },
  {
   "k": "E",
   "emulsion": "103a-E",
   "filter": "red Plexiglas 2444",
   "lam_eff_A": 6500,
   "range_A": [
    6200,
    6700
   ],
   "exposure_min": [
    40,
    60
   ],
   "mlim": 20.0,
   "mlim_system": "photored"
  }
 ],
 "survey": {
  "n_fields": 936,
  "n_plates": 1872,
  "spacing_deg": 6.0,
  "overlap_deg": 0.6,
  "dec_south_deg": -33,
  "dec_south_original_plan_deg": -27,
  "dates": "1949-11 to 1958-12 (99% by 1956-06)"
 },
 "scans": {
  "DSS-1": {
   "plates": "POSS-I E (glass copies)",
   "step_um": 25.2845,
   "step_um_nominal": 25,
   "arcsec_per_px": 1.7,
   "npix": [
    14000,
    14000
   ],
   "scanner": "modified PDS 2020G",
   "aperture_um": 50,
   "aperture_note": "50 um smoothly apodized, documented for the GSC-I scans (L90)",
   "compression": "H-transform, 10x, lossy (102 CD-ROMs)"
  },
  "15um": {
   "plates": "POSS-I O (all) and 123 POSS-I E plates",
   "step_um": [
    15.0295,
    15.0
   ],
   "arcsec_per_px": 1.01,
   "npix": [
    23040,
    23040
   ],
   "scanner": "GAMMA (laser PDS)"
  }
 },
 "pub": [
  {
   "what": "plate scale 67.187\"/mm",
   "q": "plateScale",
   "value": 67.187,
   "info": true,
   "src": "Harrington 1952; circular: f was derived from it"
  },
  {
   "what": "f/2.44",
   "q": "F",
   "value": 2.44,
   "tol": 0.002,
   "src": "Harrington 1952"
  },
  {
   "what": "14-inch plate covers 6.6 deg",
   "q": "fieldX",
   "value": 396.0,
   "tol": 0.01,
   "src": "Harrington 1952 (DERIVED 6.637 deg)"
  },
  {
   "what": "unvignetted field 5.4 deg",
   "q": "fieldUnvignetted",
   "value": 324.0,
   "tol": 0.012,
   "src": "Abell 1958, Reid+91; mirror walk-off gives 5.34 deg"
  },
  {
   "what": "DSS-1 1.7\"/px at 25.28 um",
   "q": "scanScale",
   "value": 1.7,
   "tol": 0.005,
   "src": "DSS FITS header; STScI pages"
  }
 ]
}
```

### NOT FOUND

- The plateholder's size or any obscured fraction (no linear or area obstruction published); the vane width of the four-vane plateholder support. eps is left null; 0.319 is a DERIVED lower bound from the 14-inch plate alone.
- Numerical grain size of 103a-O/E (only 'moderately coarse-grained', 80 lines/mm, smallest images ~30 um).
- The 103a-O red cut-off and full O/E response curves (in Minkowski & Abell 1963, 'Basic Astronomical Data' p. 481, which is not on ADS full text and was not obtained; R91 cites it as MA63).
- The scanning aperture actually used for the POSS-I E DSS-1 scans (the 50 um apodized aperture is documented for the GSC-I plates); the scan-step history of the POSS-I E campaign (25.000 vs 25.284 um).
- Exposure times per plate beyond the published ranges (the GSP plate list has no exposure column; single-plate values come from DSS FITS headers).

### Conflicts between sources

- Aperture: 49.5 in = 1257.3 mm clear aperture (H52, R91) vs 1244 mm for the original singlet corrector at the stop (D20). The recommended D follows H52, the telescope's own description; H52 also gives 50 in usable / 53 in overall for the corrector glass.
- Focal length / plate scale: 67.187"/mm (H52) -> 3070.0 mm; 67.19 (R91); 67.20 (DSS headers) -> 3069.4 mm; 67.1 (A58); 121 in = 3073.4 mm (H52); R/2 = 3062.7 mm (H52 radius; D20 3062 mm). Spread 0.35%.
- Unvignetted field: 5.4 deg diameter (A58, R91) and 11.25 in = 5.34 deg (H52) vs '30 square-degree unvignetted' (RD93; a 5.4-deg circle is 22.9 deg2).
- Corner vignetting loss: 0.1 mag (H52) vs < 0.2 mag (A58).
- Plate field: 6.6 x 6.6 deg (H52, A58, A59, R91 Sec. 3) vs 6.43 deg photographic area on the prints (LD73) vs 6.4 deg (L90) vs '6 x 6 deg field' (R91 Sec. 2); DERIVED 6.64 deg for 355.6 mm at 67.187"/mm.
- Red filter: 'No. 160 red plexiglass', 6000-6700 A (H52, 1952) vs red Plexiglas 2444 (R91, LD73, L08), 6200 (filter cut-off)-6700 A (A58).
- Exposure times: O 10-12 / E 45-60 min (H52); O 10-15 / E 40-60 (A58); ~10 / ~45 (A59) vs 20 / 40 min (R91).
- Limiting magnitude: O 21.1, E 20.0 (A58) vs O 21.0 (GST, L08, M00) vs 20.3 photographic (H52, 1952).
- Number of fields: 936 fields / 1872 plates (LD73, GST) vs 935 (R91, L08, M00) vs 879 to -27 deg (A58, A59). GSP has 936 E regions but 930 O regions.
- Southern limit: -33 deg (R91, LD73) vs +90:-30 zones (GST, M00) / dec >= -30 (L08) -- the latter quote plate-centre zones (lowest centre -30.7 deg, edge ~-34 deg).
- Dates: first accepted plates July 1949 (R91) vs first plate, rejected, 11 Nov 1949 (RD93; earliest GSP plate 19 Nov 1949); end late 1956 (R91) vs 99% by June 1956 and last on 10 Dec 1958 (RD93, R94, GSP) vs 1950-58 (GST, M00) vs 1950-1957 (D20).
- Whiteoak extension: to -45 deg (R91) / 'about -45' (LD73) vs -42 deg, taken 1964/5 (R94); LD73 says the series was made in 1962.
- Which plates are DSS-1 north: POSS-I E (M00, L96, GST table) vs 'DSS1 = Pal-QV (North)' in GST's MAST mapping note (the Quick-V survey was the GSC-I plate material, L90).
- DSS-1 pixel: 25 um / 1.7" (STScI pages, M00) vs 25.2845 um (FITS header) / 25.284 um (L90 Table IV, after 5 March 1985; 25.000 before) vs 1.73" (D98).

### Notes

- Schmidt geometry for the drawing: corrector = stop at the mirror's centre of curvature, 6125 mm in front of the 1829 mm spherical mirror; the plate (bent to R ~ 3.07 m, concave toward the mirror) sits half-way, facing the mirror, in a plateholder carried by vanes from the ring girder. The mirror is oversized so that beams up to 2.67 deg off axis stay on it -- the same walk-off that the ZTF records describe (megacam_ztf_small.md, D20).
- The plate replaces the CCD mosaic: one 355.6 mm (14 in) square of 1-mm glass, no pixels and no gaps. Its fineness: ~30 um smallest star images (2.0"), emulsion resolving power 80 lines/mm; digitized later at 25.28 um (1.70", DSS-1, E plates) or 15 um (1.0", O plates and 123 E plates).
- MA63 (Minkowski & Abell 1963) is the standard POSS-I reference but has no ADS full text; every POSS-I number here comes from the documents listed above (H52 for the telescope; A58, A59, LD73 and R91, which summarises MA63, for the survey; L90, M00, L96, L08, the STScI pages and the DSS FITS headers for the scans).

## POSS-II: Second Palomar Observatory Sky Survey (Oschin Schmidt with the 1985 achromatic doublet; IIIa-J, IIIa-F, IV-N plates; 1985-2002) and its DSS-2 digitization

**Recommended preset:** As POSS-I but with the 1985 Grubb Parsons achromatic doublet corrector (LLF6 + UBK7; < 0.5" images over 6.5 x 6.5 deg from 3900 to 9000 A). D = 1.2573 m (49.5 in; R91), f/2.44, 67.19"/mm -> f_eff = 3069.9 mm DERIVED; same mirror and stop; eps NOT PUBLISHED (>= 0.319 DERIVED). Plate: 14-in, 1-mm glass vacuum-held on mandrels reground to R = 120.9 in (3.07 m); filter in the plateholder. Bands: J = IIIa-J + GG395 (~4800 A), F = IIIa-F + RG610 (~6500 A), N = IV-N + RG9 (~8500 A). Emulsion 250 lines/mm; plates rejected if images exceed 40 um (3"). Exposures 50-70 (J), 70-90 (F), 90+ (N) min; limits B_J 22.5, R_F 20.8, I_N 19.5. Survey: 894 fields on a 5-deg grid, dec >= 0. DSS-2: 15 um (1.0"/px; header 15.0295 x 15.0), 23040 x 23040 px per plate, 42-um laser spot.

### Telescope

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| telescope_aperture | 1.2573 | m (clear aperture at the corrector = the aperture stop) | R91, Sec. 3 | "The correcting plate has a clear aperture of 49.5 inches and the effective focal length of the system is 121 inches, giving a focal ratio of f/2.44"<br>Note: R91 restates the 1952 values for the telescope with the new doublet.<br>ALT: 1.2446 (D20, Table 1: "Entrance pupil diameter 1244.6 mm") [ZTF-era entrance pupil (doublet + trim plate), the record used in megacam_ztf_small.md; 1% smaller than 49.5 in -- see conflicts]<br>ALT: 1.2 (R91, Sec. 3: "The Oschin 48-inch (1.2-m) Schmidt camera") [nominal] |
| primary_mirror | diameter_mm: 1828.8; radius_of_curvature_mm: 6121.4 | mm | R91, Sec. 3 | "primary mirror is of diameter 72 inches (1.8 m) with a radius of curvature of 241 inches."<br>Note: Unchanged since 1948: H52 gives 241.16 in (6125.5 mm); D20 1828 mm and 6124 mm (megacam_ztf_small.md 'primary_mirror').<br>ALT: diameter_mm: 1828; stop_distance_mm: 6124 (D20, Sec. 3.1: "concave spherical mirror (diameter 1828 mm), an aperture stop located at the center of curvature of this mirror (6124 mm away)")<br>DERIVED: 241 in = 6121.4 mm (R91, rounded); 241.16 in = 6125.5 mm (H52). |
| corrector | type: achromatic doublet (Schott LLF6 + O'Hara BK7W = Schott UBK7), UKST design; maker: Grubb Parsons; installed: 1985 |  | R91, Sec. 3.1 | "A new achromatic corrector plate was constructed by Grubb Parsons and installed in the telescope in 1985. This lens, made to the same design as the UK Schmidt Telescope (UKST) achromat described by Wynne 1981, is a doublet in construction, combining Schott type-LLF6 glass with O'Hara BK7W (equivalent to Schott UBK7)."<br>Note: THE change from POSS-I: the singlet plate (figured for 4358 A) was replaced by an achromat so that red and near-IR images stay sharp. Its diameter and thickness are not given.<br>ALT: contact-cemented achromatic doublet, Grubb-Parsons, 1982 (D20, Sec. 3.1: "In 1982, in order to improve de- livered image quality, the original singlet aspheric plate was replaced with a contact-cemented achromatic doublet ... cated by Grubb-Parsons in the United Kingdom.") [D20 dates the swap to 1982 -- see conflicts; ZTF still uses this doublet, with a trim plate added (megacam_ztf_small.md 'optics_train')]<br>ALT: delivered mid-1985 (RD93, p. 126: "it was not until mid-1985, when Grubb Parsons delivered the new corrector, that survey plate-taking could start") |
| image_quality | image_size_arcsec_max: 0.5; wavelength_A: [3900, 9000]; field_deg: [6.5, 6.5]; circle_of_confusion_arcsec: 0.34 |  | R91, Sec. 3.1 | "The resultant image size is better than 05 for in-focus point sources over the full 6.5 x 6.5 degree field for 3900 ... For in-focus images the circle of confusion is only 0734 in diameter, and the image size is determined by the seeing disk."<br>Note: OCR "05" = 0".5 and "0734" = 0".34; the wavelength range 3900 <= lambda <= 9000 A was read from the page image (OCR garbles it).<br>ALT: astigmatic: 30 um defocus elongates images (R91, Sec. 3.1: "The corrector, however, has a significant astigmatic component. ... However, moving as little as 30 um outside the image plane leads to significant image elonga- tion") |
| telescope_focal_ratio | 2.44 | f/# | R91, Sec. 3 | "giving a focal ratio of f/2.44"<br>DERIVED: 206264.8 / 67.19 = 3069.9 mm; / 1257.3 mm = f/2.442. |
| effective_focal_length | 3.0699 | m (DERIVED from the plate scale 67.19"/mm) | R91, Sec. 3 | "giving a focal ratio of f/2.44 and a plate scale of 67’19 per millimeter."<br>Note: OCR "67’19" = 67".19 (page image).<br>ALT: 3.0734 (R91, Sec. 3: "the effective focal length of the system is 121 inches") [121 in = 3073.4 mm]<br>ALT: 3.0709 (R91, Sec. 3.2: "in the case of the Oschin Schmidt, 120.9 inches (3.07 m).") [focal-surface radius = focal length]<br>ALT: 3.0694 (HF, FITS header (DSS): "PLTSCALE=                67.20 /Detector: Plate Scale arcsec per mm") [206264.8 / 67.20]<br>DERIVED: 206264.8 / 67.19 = 3069.9 mm. |
| focal_surface | spherical, R = focal length = 120.9 in (3.07 m); plates vacuum-held on mandrels reground to that radius |  | R91, Sec. 3.2 | "In a classical Schmidt telescope the focal plane is a spherical surface with a radius of curvature equivalent to the focal length of the telescope—in the case of the Oschin Schmidt, 120.9 inches (3.07 m)."<br>ALT: vacuum hold-down to +/-15 um (R91, Sec. 3.2: "Running at a pressure of 430 mm of mercury, this forces the plate to conform to the figured mandrel to an accuracy of +15 pm.") [OCR "+15 pm" = +/-15 um]<br>ALT: mandrels reground (were 120.4 in) (R91, Sec. 3.2: "All of the mandrels have been reground to the correct radius of curvature.") |
| plateholder_and_filter | filter mounted in the plateholder, ~2 mm in front of the plate at the centre, >20 mm at the edge; nitrogen-flushed for IIIa plates; plateholder located by three points on the central spider |  | R91, Secs. 3.2-3.3 | "the plateholders cur- rently in use with the survey have the filters installed directly (as at UKST), rather than in a separate bracket in the telescope, with the clearance between plate and filter varying from ~ 2 mm at the plate center to more than 20 mm at the edge. ... The plateholder is located in position in the telescope by three defining points mounted on the central spider."<br>Note: The flat filter in front of the curved plate explains the 2 -> 20 mm clearance. |
| central_obstruction | null (not published) | linear eps: NOT PUBLISHED | R91, Sec. 3.3 | "The plateholder is located in position in the telescope by three defining points mounted on the central spider."<br>Note: As for POSS-I: no size of the plateholder (now carrying the filter) is published. DERIVED lower bound from the 14-inch plate: eps >= 0.319.<br>ALT: four-vane plateholder support (original configuration, kept until PTF) (D20, Sec. 4.1 (Instrument support structure): "a four-vane structure was used to support a mechanical screw driven focus hub which held the photographic plates at prime focus.") |

### Plate and field

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| plate_size | in: [14, 14]; mm: [355.6, 355.6]; thickness_mm: 1.0 |  | R91, Sec. 3 | "Although the 14 x 14 inch plates cover 6°6 x 6°6 on the sky, the unvignetted field is of only 5°4 diameter."<br>ALT: 1-mm glass (R91, Sec. 3.2: "The 1-mm thick glass plates are bent to shape by the plate-holder mandrels")<br>ALT: 355.0 (HF, FITS header (DSS): "PLTSIZEX=              355.000 /Detector: Plate X Dimension mm")<br>ALT: copies on 14 x 14-inch glass and 14 x 17-inch film (C87, announcement: "contact-printed first negative copies on 14 x 14-inch glass plates") |
| plate_field | deg: [6.6, 6.6] | deg | R91, Sec. 3 | "the 14 x 14 inch plates cover 6°6 x 6°6 on the sky"<br>ALT: deg: [6.5, 6.5] (R91, Sec. 3.1: "over the full 6.5 x 6.5 degree field")<br>ALT: deg: [6.5, 6.5] (D98, Sec. 2: "(6.5◦ square each with 5◦ spacings)")<br>ALT: deg: [6.5, 6.5] (SDH, home page: "The 6.5-degree x 6.5-degree plates are scanned")<br>DERIVED: 355.6 mm x 67.19"/mm = 6.637 deg. |
| field_unvignetted | 5.4 | deg (diameter) | R91, Sec. 3 | "the unvignetted field is of only 5°4 diameter."<br>Note: Same stop and mirror as POSS-I, so the same walk-off (DERIVED 5.34 deg). |

### Bands (emulsion + filter)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| J | emulsion: Kodak IIIa-J; filter: Schott GG395; lam_eff_A: 4800; range_A_image: [3550, 5850]; half_peak_A_image: [4400, 5500] | Angstrom | R91, Sec. 2 and Fig. 1 | "three passbands: blue (IIIa-J emulsion and GG395 filter —). ~ 4800 A)"<br>Note: OCR "—). ~ 4800 A" = lambda_eff ~ 4800 A (page image). Ranges marked _image were read off R91 Fig. 1 (log relative response; curves plotted down to 10% of peak), +/-50 A, not machine-checkable. Blue edge from the filter, red edge from the emulsion (R91).<br>ALT: GG385 (C87, announcement: "Illa-J + GG385") [OCR "Illa-J" = IIIa-J]<br>ALT: GG385 (R94, p. 29: "blue (IIIa-J + GG385 filter)")<br>ALT: filter: GG385; lam_A: 4800 (L96, Table 1: "Filter GG385 RG610 RG9")<br>ALT: GG385 (L08, Table 1: "XJ           POSS-II J         δ ≥ 0◦        1987-00      IIIaJ+GG385          BJ       22.5          897     Y/Y")<br>ALT: GG395 (HJ, FITS header (DSS): "FILTER  = 'GG395   '           /Detector: Filter")<br>ALT: GG395 (GST, survey table: "POSS-II J XJ 1987-98 IIIaJ +GG395 Jpg 22.5 +90:+00 897")<br>ALT: lam_eff_nm: 480 (D98, Sec. 2: "IIIa-J + GG395, λef f ∼ 480 nm") |
| F | emulsion: Kodak IIIa-F; filter: Schott RG610; lam_eff_A: 6500; range_A_image: [5900, 7150]; half_peak_A_image: [6250, 6940] | Angstrom | R91, Sec. 2 and Fig. 1 | "red (IIIa-F and RG610—),4 ~ 6500 A)"<br>Note: OCR "—),4 ~ 6500 A" = lambda_eff ~ 6500 A. Ranges from Fig. 1 (IMAGE). The J and F bands avoid Na D (R91).<br>ALT: lam_eff_nm: 650 (D98, Sec. 2: "red, IIIa-F + RG610, λef f ∼ 650 nm")<br>ALT: IIIaF + RG610 (HF, FITS header (DSS): "EMULSION= 'IIIaF   '           /Detector: Emulsion ... FILTER  = 'RG610   '           /Detector: Filter") |
| N | emulsion: Kodak IV-N (hypersensitized); filter: Schott RG9; lam_eff_A: 8500; range_A_image: [6980, 9650]; half_peak_A_image: [7630, 9210] | Angstrom | R91, Sec. 2 and Fig. 1 | "and in the near-infrared (IVN and RG9—),, ~ 8500 A)."<br>Note: OCR "—),, ~ 8500 A" = lambda_eff ~ 8500 A. Ranges from Fig. 1 (IMAGE).<br>ALT: lam_eff_nm: 850 (D98, Sec. 2: "very near-IR, IV-N + RG9, λef f ∼ 850 nm")<br>ALT: IVN + RG9 (HN, FITS header (DSS): "EMULSION= 'IVN     '           /Detector: Emulsion ... FILTER  = 'RG9     '           /Detector: Filter") |

### Emulsion fineness

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| resolving_power | 250 | lines per mm (IIIa-J, IIIa-F, IV-N) | R91, Sec. 2 | "Both the type-IIIa and the IVN emulsions have a higher contrast (photographic gamma) and have three times the resolving power, at 250 lines mm’."<br>Note: OCR "mm’" = mm^-1.<br>DERIVED: 1/250 mm = 4.0 um = 0.27" at 67.19"/mm; 3.1x the 103a's 80 lines/mm. |
| image_size_limit | 40 | um (plates rejected if star images are larger) | R91, Sec. 5 | "or if the images exceed 40 microns (3 arc seconds) in size."<br>DERIVED: 40 um x 67.19"/mm = 2.7" (R91 rounds to 3"). |
| grain_size | null (not published) | NOT PUBLISHED as a number | R91, Sec. 2 | "The smaller grain size leads to significantly higher uniformity in the sky background of the modern plates"<br>Note: Only 'finer grain' / 'smaller grain size'; no grain diameter. |
| hypersensitization_gain | IIIa: [5, 10]; IV-N: 100 | speed gain factor | R91, Sec. 4 | "The typical gain in speed obtained by these hypersensitizing techniques is a factor of 5-10 for the IIIa plates and up to a factor of 100 for the IVN plates." |

### Exposure, depth, plate scale (validation targets)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| exposure_time | J_min: [50, 70]; F_min: [70, 90]; N_min: 90+ | minutes | R91, Sec. 6 | "slightly longer exposures—90+ minutes as against 50—70 minutes for the J plates and 70-90 minutes for the F plates"<br>ALT: JF_min: [60, 70]; N_min: [80, 90] (R91, Sec. 3.4: "Given the longer exposure times of the current survey (60-70 minutes J,F; 80-90 minutes N)")<br>ALT: J plates only if the optimum exposure >= 50 min; <= 35 min on the brightest nights (R91, Sec. 5: "on the brightest nights we can tolerate no more than 35 minutes exposure time. To maintain a higher degree of uniformity, J plates are taken only if the optimum expo- sure time is at least 50 minutes.")<br>ALT: J_min: 80; F_min: 85; N_min: 70 (HJ, FITS headers (DSS), plates SJ06159 / SF05135 / SN07392: "EXPOSURE=                 80.0 /Observation: Exposure Minutes") [one field each (HF: "EXPOSURE=                 85.0"; HN: "EXPOSURE=                 70.0")] |
| limiting_magnitude | J: 22.5; F: 20.8; N: 19.5 | mag (B_J; R_F, I_N on the Cousins system), stellar, seeing <= 1.5" | R91, Sec. 5 | "Typical limiting magnitudes for the POSS II plates are ... B, (lim) = 22.5 mag ... R,(lim) = 20.8 mag , I,(lim) = 19.5 mag . ... These limits are for stellar objects in good seeing (= 1.5 are seconds) and can vary by up to +0.4 magnitude from plate to plate."<br>Note: OCR "B," = B_J, "(= 1.5 are seconds)" = (<= 1.5 arc seconds), "+0.4" = +/-0.4.<br>ALT: J: 22.5; F: 21.5; N: 19.5 (RD93, p. 126: "Limiting magnitudes for point sources are typically 22.5, 21.5 and 19.5 respectively.") [F differs -- see conflicts]<br>ALT: J: 22.5; F: 20.8; N: 19.5 (D98, Sec. 2: "Typical limiting magnitudes reached are BJ ∼ 22.5, RF ∼ 20.8, and IN ∼ 19.5")<br>ALT: J: 22.5; F: 20.8; N: 19.5 (L96, Table 1: "Limiting mag 22.5 20.8 19.5")<br>ALT: J: 22.5; F: 20.8; N: 19.5 (GST, survey table: "POSS-II F XP 1987-98 IIIaF +RG610 Fpg 20.8 +90:+00 897") |
| plate_scale | 67.19 | arcsec/mm | R91, Sec. 3 | "a plate scale of 67’19 per millimeter."<br>ALT: 67.2 (HF, FITS header (DSS): "PLTSCALE=                67.20 /Detector: Plate Scale arcsec per mm")<br>ALT: 67 (C87, announcement: "a scale of approximately 67 arcseconds per millimeter.") |

### Survey

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| n_fields | 894 | fields (each in J, F and N: 2682 plates) | R91, Sec. 2 | "we can restrict the current survey to the 894 fields north of (and including) the celestial equator. Thus, both surveys cover the 72 fields at 0° declination."<br>ALT: 894 (C87, announcement: "The survey consists of 894 fields from the north celestial pole to the equator at a spacing of 5 degrees")<br>ALT: 2682 (L96, Sec. 1: "processing of all fields in the three passbands (2682 plates total)") [= 3 x 894]<br>ALT: 897 (GST, survey table: "POSS-II J XJ 1987-98 IIIaJ +GG395 Jpg 22.5 +90:+00 897") [J and F 897, N 890]<br>ALT: 897 (L08, Table 1: "XP           POSS-II F         δ ≥ 0◦        1987-99      IIIaF+RG610          RF       20.8          897     Y/Y")<br>ALT: J_regions: 897; F_regions: 897; N_regions: 890 (GSP, rows with Survey = POSSII-J/F/N: "Oschin Schmidt - Doublet") [DERIVED tallies of the digitized plates (J 907, F 905, N 904 plates incl. retakes; the zone at dec 0 has 72-73 F plates)] |
| field_spacing | 5.0 | deg between plate centres | R91, Sec. 2 | "adopted a five-degree field spacing."<br>ALT: 5.0 (RD93, p. 126: "The photographic survey will eventually cover 894 fields spaced 5° apart")<br>ALT: 5.0 (L96, Sec. 1: "covers all of the northern sky in 894 fields on a 5°-grid")<br>ALT: about half the area covered twice per band (D98, Sec. 2: "Approximately half of the survey area is covered at least twice in each band, due to plate overlaps.")<br>DERIVED: Overlap along a declination column: 6.6 - 5.0 = 1.6 deg (6.64 - 5.0 = 1.64 deg DERIVED), vs 0.6 deg for POSS-I. |
| sky_coverage | dec >= 0 (plate centres 0 to +90 deg); the sky to dec ~ -3 deg |  | D98, Sec. 2 | "The POSS-II covers the entire northern sky (δ > −3◦ ) with 894 overlaping fields"<br>ALT: +90:+00 zones (GST, survey table: "POSS-II N XI 1987-02 IV-N +RG9 Ipg 19.5 +90:+00 890")<br>ALT: north celestial pole to the equator (C87, announcement: "from the north celestial pole to the equator")<br>DERIVED: Sky north of -3 deg: 41,253 x (1 + sin 3)/2 = 21,706 deg2. |
| dates | corrector_installed: 1985; plates: 1985/86 - 2002 |  | R91, Sec. 3.1 | "installed in the telescope in 1985."<br>ALT: survey-quality plates mostly from mid-1987 (RD93, p. 126: "Most of this work was completed by mid-1987, the point from which the majority of plates taken have been of survey quality.")<br>ALT: 1987 (R94, p. 29: "In 1987, plate-taking started for the second Palomar Sky Survey, POSS II")<br>ALT: J: 1987-98; F: 1987-98; N: 1987-02 (GST, survey table: "POSS-II F XP 1987-98")<br>ALT: J: 1987-00; F: 1987-99; N: 1989-02 (L08, Table 1: "XI           POSS-II N         δ ≥ 0◦        1989-02        IV-N +RG9          IN       19.5          897     N/Y")<br>ALT: J: 1985-09-17 to 2000-03-25; F: 1986-06-12 to 1999-11-10; N: 1988-02-08 to 2002-03-07 (GSP, UT column of the POSSII rows: "Oschin Schmidt - Doublet") [DERIVED ranges of the digitized plates] |

### Digitization (DSS-2)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| dss2_scan_step | 15.0 | um (nominal sample interval; header: 15.0295 x 15.0000) | LP93, Overview | "we adopted a 15 ym sampling interval (Laidler, et al. 1992), to be used with a 30 pm apodized aperture. With these parameters, each plate consists of an image 23040? in size, with a data volume of 1.06 Gbytes."<br>Note: OCR "15 ym" = 15 um, "30 pm" = 30 um, "23040?" = 23040^2.<br>ALT: x_um: 15.0295; y_um: 15.0 (HF, FITS header (DSS), plate SF05135: "XPIXELSZ=              15.0295 /Scan: Pixel Size microns ... YPIXELSZ=              15.0000 /Scan: Pixel Size microns") [same in the J and N headers (HJ, HN)]<br>ALT: 15 (RD93, p. 127: "The plates are being digitized with 15-micron (1 arcsec) pixels, in rasters of 23,040 square, giving about 1 GB per plate in an uncompressed form")<br>ALT: 15 (D98, Sec. 2: "The plates are scanned with 15-micron (1.0 arcsec) pixels, in rasters of 23,040 square, giving ∼ 1 GB/plate")<br>ALT: 15 (M00, Sec. 2: "we are now scanning the additional plate material at 15 microns.")<br>ALT: 15 (SDG, Getting Started: "15 microns (1.0 arcsec per pixel)") |
| dss2_pixel_scale | 1.0 | arcsec/pixel | SDH, home page | "and to about 1.0 arcseconds per pixel for the POSS-II surveys."<br>ALT: 1.007 (HF, FITS header (DSS): "CD1_1   =        -0.0002798093 /GetImage: rotation matrix coefficient") [0.0002798093 deg = 1.0073" (local WCS; CD2_2 0.0002791901 deg = 1.0051")]<br>ALT: 1.0 (LP93, Abstract: "are being digitized at 1” resolution.")<br>ALT: 1.0 (L96, Sec. 1: "the use of a 1” sampling interval")<br>ALT: 1.0 (GSD, Data Organization: "23040x23040 (1.0" pixels)")<br>DERIVED: 15.0 um x 67.20"/mm = 1.008"; 15.0295 um x 67.20 = 1.010". |
| dss2_scan_size | [23040, 23040] | pixels per plate | HF, FITS header (DSS) | "XPIXELS =                23040 /Scan: X Dimension ... YPIXELS =                23040 /Scan: Y Dimension"<br>ALT: pixels: 23040^2; GB: 1.1 (L96, Sec. 1: "The scans are of dimension 230407, which corresponds to 1.1 Gbyte per plate (for a 2.8 Tbyte survey total).") [OCR "230407" = 23040^2]<br>ALT: pixels: [23040, 23040]; GB: 1.1 (GSO, overview: "23040x23040 pixels (1.1GB)")<br>DERIVED: 23040 x 15.0 um = 345.6 mm = 6.45 deg; 23040 x 15.0295 um = 346.3 mm = 6.46 deg (at 67.20"/mm): the scan stops ~5 mm short of the 355.6-mm plate edges. |
| dss2_scanner_spot | 42 | um (laser spot, Gaussian; GAMMA machines) | L08, Sec. 3.1 | "as a 42 µm Gaussian spot. This size gives low aliasing with the adopted 15 µm sampling."<br>Note: The PDS 2020G machines rebuilt as the laser-illuminated, multichannel GAMMA 1 and 2.<br>ALT: 30 (LP93, Overview: "to be used with a 30 pm apodized aperture.") [the 1993 plan (OCR "30 pm" = 30 um) -- see conflicts]<br>ALT: laser-illuminated 5-channel (L96, Sec. 1: "were rebuilt as laser-illuminated 5-channel systems")<br>DERIVED: 42 um x 67.19"/mm = 2.8" FWHM-scale spot; 30 um = 2.0". |
| dss2_plates_scanned | original plates |  | D98, Sec. 2 | "(a) the original plates are scanned, rather than second copies"<br>ALT: compressed 10x (H-transform) (L96, Sec. 2: "The same approach and the same compression factor were adopted for the POSS-II.")<br>ALT: typically compressed by 7 (GSO, overview: "We typically compress the data by a factor of 7") |

### Preset object (explorer)

```json
{
 "id": "poss2",
 "name": "Palomar 48-inch Oschin Schmidt / POSS-II plates",
 "tel": "schmidt",
 "optics": "direct",
 "era": "1985-2002",
 "D_m": 1.2573,
 "D_basis": "49.5-in clear aperture (R91); D20 gives a 1244.6-mm entrance pupil for the ZTF era",
 "eps": null,
 "eps_published": false,
 "eps_lower_bound": 0.319,
 "eps_note": "No obscuration published; 0.319 = the 14-inch plate alone (DERIVED lower bound).",
 "F": 2.442,
 "F_published": 2.44,
 "f_eff_mm": 3069.9,
 "f_eff_basis": "206264.8 / 67.19\"/mm (R91)",
 "mirror_D_mm": 1828.8,
 "mirror_R_mm": 6125.5,
 "stop_to_mirror_mm": 6125.5,
 "corrector": {
  "type": "achromatic doublet, Schott LLF6 + O'Hara BK7W (UBK7), Grubb Parsons, UKST design",
  "installed": 1985,
  "D_mm": null,
  "image_quality": "< 0.5\" over 6.5 x 6.5 deg, 3900-9000 A; circle of confusion 0.34\"; astigmatic (30 um defocus elongates)"
 },
 "focal_surface_R_mm": 3070.9,
 "focal_surface_note": "mandrels reground to 120.9 in; vacuum hold-down +/-15 um",
 "plate_scale_arcsec_per_mm": 67.19,
 "field_unvignetted_deg": 5.4,
 "field_circle_arcmin": 324,
 "plate_corner_circle_arcmin": 563,
 "filter_in_plateholder": {
  "clearance_mm_centre": 2,
  "clearance_mm_edge": 20
 },
 "detector": {
  "type": "photographic_plate",
  "n_plates": 1,
  "pixels": null,
  "size_mm": [
   355.6,
   355.6
  ],
  "size_deg_published": [
   6.6,
   6.6
  ],
  "size_deg_alt": [
   6.5,
   6.5
  ],
  "thickness_mm": 1.0,
  "glass": true,
  "curved": true,
  "bent_to_radius_mm": 3070.9,
  "emulsions": {
   "J": "Kodak IIIa-J + GG395",
   "F": "Kodak IIIa-F + RG610",
   "N": "Kodak IV-N + RG9"
  },
  "resolving_power_lines_per_mm": 250,
  "max_star_image_um": 40,
  "max_star_image_arcsec": 2.7,
  "grain_size_um": null,
  "hypersensitization_gain": {
   "IIIa": [
    5,
    10
   ],
   "IV-N": 100
  }
 },
 "bands": [
  {
   "k": "J",
   "emulsion": "IIIa-J",
   "filter": "GG395",
   "filter_alt": "GG385",
   "lam_eff_A": 4800,
   "range_A_fig1": [
    3550,
    5850
   ],
   "half_peak_A_fig1": [
    4400,
    5500
   ],
   "exposure_min": [
    50,
    70
   ],
   "mlim": 22.5,
   "mlim_system": "B_J"
  },
  {
   "k": "F",
   "emulsion": "IIIa-F",
   "filter": "RG610",
   "lam_eff_A": 6500,
   "range_A_fig1": [
    5900,
    7150
   ],
   "half_peak_A_fig1": [
    6250,
    6940
   ],
   "exposure_min": [
    70,
    90
   ],
   "mlim": 20.8,
   "mlim_system": "R_F (Cousins-calibrated)"
  },
  {
   "k": "N",
   "emulsion": "IV-N",
   "filter": "RG9",
   "lam_eff_A": 8500,
   "range_A_fig1": [
    6980,
    9650
   ],
   "half_peak_A_fig1": [
    7630,
    9210
   ],
   "exposure_min": [
    90,
    null
   ],
   "mlim": 19.5,
   "mlim_system": "I_N (Cousins-calibrated)"
  }
 ],
 "survey": {
  "n_fields": 894,
  "n_plates": 2682,
  "spacing_deg": 5.0,
  "overlap_deg": 1.6,
  "dec_south_deg": 0,
  "dates": "1985-2002 (corrector 1985; J/F done ~1999-2000, N 2002)"
 },
 "scans": {
  "DSS-2": {
   "plates": "POSS-II J, F, N originals",
   "step_um": 15.0,
   "step_um_header": [
    15.0295,
    15.0
   ],
   "arcsec_per_px": 1.008,
   "npix": [
    23040,
    23040
   ],
   "scanner": "GAMMA 1/2 (laser-illuminated, 5-channel PDS)",
   "spot_um": 42,
   "spot_note": "Gaussian laser spot (L08); 30 um apodized aperture in the 1993 plan (LP93)",
   "volume_GB": 1.1,
   "compression": "H-transform, ~7-10x, lossy"
  }
 },
 "pub": [
  {
   "what": "plate scale 67.19\"/mm",
   "q": "plateScale",
   "value": 67.19,
   "info": true,
   "src": "Reid+91; circular: f was derived from it"
  },
  {
   "what": "f/2.44",
   "q": "F",
   "value": 2.44,
   "tol": 0.002,
   "src": "Reid+91"
  },
  {
   "what": "unvignetted field 5.4 deg",
   "q": "fieldUnvignetted",
   "value": 324.0,
   "tol": 0.012,
   "src": "Reid+91; mirror walk-off gives 5.34 deg"
  },
  {
   "what": "DSS-2 1.0\"/px at 15 um",
   "q": "scanScale",
   "value": 1.008,
   "tol": 0.01,
   "src": "STScI; DSS FITS header 15.0 um x 67.20\"/mm"
  },
  {
   "what": "emulsion 250 lines/mm = 0.27\"",
   "q": "emulsionRes",
   "value": 0.269,
   "info": true,
   "src": "Reid+91 (DERIVED conversion)"
  }
 ]
}
```

### NOT FOUND

- Diameter and thickness of the 1985 achromatic doublet (only glasses, maker and design origin).
- Plateholder size / obscured fraction and vane width (eps not published; DERIVED lower bound 0.319 from the plate).
- Numerical grain size of IIIa-J/F and IV-N (only 250 lines/mm and the 40-um image rejection limit).
- Tabulated band edges: the J/F/N ranges come from reading R91 Fig. 1 (IMAGE, +/-50 A).
- Whether the J filter was GG395 or GG385 for all plates (sources split; see conflicts).

### Conflicts between sources

- Doublet corrector date: installed 1985 (R91), delivered mid-1985 (RD93) vs 'In 1982 ... replaced' (D20).
- Aperture: 49.5 in = 1257.3 mm (R91, as in 1952) vs entrance pupil 1244.6 mm (D20 Table 1, ZTF era with the trim plate) -- 1%.
- Mirror radius: 241 in (R91, rounded) vs 241.16 in (H52) vs 6124 mm (D20).
- J filter: GG395 (R91, D98, GST, the DSS FITS header) vs GG385 (C87, R94, L96, L08).
- F limiting magnitude: 20.8 (R91, D98, L96, GST) vs 21.5 (RD93).
- Exposure times: 50-70 J / 70-90 F / 90+ N min (R91 Sec. 6) vs 60-70 J,F / 80-90 N min (R91 Sec. 3.4).
- Plate field: 6.6 x 6.6 deg (R91 Sec. 3) vs 6.5 x 6.5 deg (R91 Sec. 3.1, D98, STScI pages).
- Number of fields: 894 (R91, C87, RD93, L96, LP93) vs 897 (GST, L08; GSP has 897 J and F regions, 890 N).
- Start date: corrector 1985 and first plates Sept 1985 (GSP) vs 'In 1987, plate-taking started' (R94) vs 1987-98 (GST); end 1998-2002 by band.
- Scanning aperture: 30 um apodized aperture (LP93, the 1993 plan) vs 42 um Gaussian laser spot (L08, the GAMMA machines as used).
- DSS-2 pixel: 15 um square (LP93, RD93, D98) vs 15.0295 x 15.0000 um (FITS headers); compression 10x (L96) vs 'typically ... 7' (GSO).

### Notes

- What changed from POSS-I (R91 Sec. 3): an achromatic doublet corrector (1985) replaced the singlet plate; the plateholder mandrels were reground to R = 120.9 in and given a vacuum hold-down (+/-15 um); filters moved into the plateholders with nitrogen flushing; a stiffer defining frame (Oct 1989, flexure +/-5 um); an autoguider; a night-sky photometer and a 16-spot sensitometer. Emulsions went from 103a (80 lines/mm) to hypersensitized IIIa-J, IIIa-F and IV-N (250 lines/mm), three bands instead of two, 5-deg instead of 6-deg spacing, and dec >= 0 only. Mirror, aperture, f/2.44, plate scale and 14-inch plates are unchanged.
- ZTF records that still apply (megacam_ztf_small.md, key D20): the 1828 mm spherical mirror, the stop at its centre of curvature 6124 mm away, the 3062 mm focal-surface radius, and the Grubb-Parsons doublet itself (ZTF adds a trim plate in front of it and a flattening cryostat window; its 1244.6 mm entrance pupil is a ZTF-era value).
- The plate as detector: no pixels; the fineness is set by the emulsion (250 lines/mm = 4 um, 0.27"; star images <= 40 um = 2.7" on accepted plates) and by the scan (15 um = 1.0", with a 42 um laser spot).
