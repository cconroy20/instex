# Single dish: Arecibo 305-m telescope (Gregorian feed) -- illuminated aperture, beams, receivers, sky coverage, tracking, end of operations

Compiled 2026-10-20 for the instex INTERFEROMETER mode (filled-aperture comparison: uv coverage = autocorrelation of the illuminated aperture, beam = its diffraction pattern), in the record format of `data/interf/vla.md`. Every number comes from a document saved unmodified under `rawdata/interf/arecibo/`; each value carries its source key, location and a short verbatim quote. **DERIVED** marks arithmetic done here (shown). **INFERRED** marks a mapping no source states. **NOT FOUND** marks a gap. 155 quotes and 122 table cells machine-checked against the saved files' extracted text (pdftotext -layout and -raw for PDFs; tag-stripped text and entity-decoded source for HTML, the gzip-encoded NSF capture decompressed in memory): all pass (2026-10-20). Normalisation as in vla.md: Unicode NFKC; curly quotes, primes, dashes, minus, multiplication sign (to x), tilde operator and soft hyphens normalised; table-cell separators | dropped; whitespace collapsed; a quote also passes with PDF line-end hyphenation closed up or with all whitespace removed; " ... " joins non-adjacent pieces. The PDF text keeps the glyph ◦ for the degree sign and ′/′′ for arcmin/arcsec, and quotes keep them as extracted. Companion machine-readable file: `data/interf/arecibo.json`.

## Completeness summary

**Dish**: 305 m spherical cap, radius of curvature 265 m, 51 m deep, surface 2 mm rms (GUIDE). **Illuminated aperture (Gregorian)**: 213 x 237 m at zenith (GUIDE; 700 x 776 ft in the G92-03 design memo EXPP; also PHB, OSTEN), elliptical, 700 ft along the uphill-downhill (zenith-angle) direction and 776 ft transverse (EXPP), offset 47 ft downhill of the paraxial ray (EXPP; "15 m downhill", UPOV), area 39,635 m2 = a 225 m circle (EXPP, PHB), design power illumination 1 - (1 - taper)(r/R)^6 with a -7 dB edge (EXPP). With zenith angle the illuminated patch moves across the fixed sphere and spills over the uphill rim onto the ground screen at high za (BURTON, EXPP, GALFA); onset za = 14.70 deg and the gain loss vs za are DERIVED from the EXPP geometry (-0.67 dB at 19.7 deg vs the design "about 1.0 dB"). The 430-MHz line feed illuminated the full 305 m at zenith (GUIDE).

**Beams**: GUIDE Table 3 HPBW (az x za, arcmin, za < 15 deg, staff measurements) for 327, 430, lbw, sbw, sbn, sbh, cb, xb, ALFA; lbw at 1.42 GHz 3.1 x 3.5 (GUIDE, RXL). Other frequencies of measurement NOT FOUND (band centres DERIVED; cb 5 GHz and xb 9 GHz INFERRED). Measured HPBW at stated frequencies: HEILES Table 1 (430 MHz 10.9; LBW 1175/1415/1666 MHz 4.0/3.4/2.9 arcmin, Sept 2000), BURTON (LBW 1420 MHz 3.1 x 3.7), ALFALFA (ALFA 3.3 x 3.8). Relation hpbw = 1.02 lambda/D, D = 213 x 237 m, geometric mean 225 m (PHB); the Table 3 beams agree with 1.02 lambda/236.5 m (az) and 1.02 lambda/213.4 m (za) to within about 10% (DERIVED). **Sidelobes**: first-sidelobe peak 0.039-0.046 of the main beam (-14.1 to -13.4 dB DERIVED; HEILES); ALFA beam 0 first ring about -15 dB, outer beams -7 to -8 dB (ALFALFA); design -12.2 to -16 dB (EXPP).

**Sky coverage**: za 0-19.7 deg (1.06-19.7 deg tracking), Dec -1 20 to +38 02 (GUIDE); site 18 20 36.6 N, 66 45 11.1 W (geodetic), centre of curvature 497 m above MSL (GUIDE). **Tracking**: GUIDE Table 2 rise-to-set times, max 2:46 at Dec +20; DERIVED geometry reproduces the table to within 1 min except Dec +5 and +38. **Receivers**: GUIDE Table 3 (2017) and RXT (Aug 2020) ranges; instantaneous bandwidth up to 1 GHz per polarization (GUIDE). **End**: aux cable failed 10 Aug 2020 (NSFD), operations ended August 2020 (COLLOQ), decommissioning announced 19 Nov 2020 (NSFD), platform fell about 7:55 a.m. AST 1 Dec 2020 (NSFC).

## Sources

| key | document | local file | URL |
|---|---|---|---|
| GUIDE | C. Salter (NAIC), "An Astronomer's Guide to the Arecibo 305-m Telescope", last revised October 30, 2017 (18 pp.; PDF version of the Arecibo users' guide; Table 1 site and telescope, Table 2 tracking time, Table 3 available receivers). Internet Archive capture 2020-03-09 (SHA-1 matches the archive digest DVG3DRMA...). Fetched 2026-10-20 | `rawdata/interf/arecibo/naic_astronomers_guide_2017.pdf` | http://web.archive.org/web/20200309172943/http://www.naic.edu/~astro/guide/guide.pdf |
| RXT | NAIC Arecibo Observatory, "Arecibo Observatory Receivers" receiver parameter table (~astro/RXstatus/rcvrtabz.shtml), Tsys column from the last system check Wed Aug 5 2020; Internet Archive capture 2020-08-10 (identical digest ELMBXAYM... in every capture through 2023-01-19). Fetched 2026-10-20 | `rawdata/interf/arecibo/naic_rxstatus_rcvrtabz_20200810.html` | http://web.archive.org/web/20200810184337/http://www.naic.edu/~astro/RXstatus/rcvrtabz.shtml |
| RXL | NAIC Arecibo Observatory, "Arecibo Observatory L-Wide Band Receiver" status page (~astro/RXstatus/Lwide/Lwide.shtml; page footer "Last updated: Friday, 15-Feb-2008", B. M. Lewis); Internet Archive capture 2020-07-14. Fetched 2026-10-20 | `rawdata/interf/arecibo/naic_rxstatus_lwide_20200714.html` | http://web.archive.org/web/20200714213939/http://www.naic.edu:80/~astro/RXstatus/Lwide/Lwide.shtml |
| PHB | P. Perillat (NAIC), "Beam Widths vs lambda. All rcvrs, 2004" (feb 2005), system-performance page ~phil/sysperf/misc/hpbw_vs_lambda_2004.html (calibration data Mar 2004 - Feb 2005, 5 < za < 14 deg); Internet Archive capture 2020-12-05 (same digest as the 2006 captures). Fetched 2026-10-20 | `rawdata/interf/arecibo/naic_phil_hpbw_vs_lambda_2004_20201205.html` | http://web.archive.org/web/20201205083735/http://www.naic.edu/~phil/sysperf/misc/hpbw_vs_lambda_2004.html |
| EXPP | NAIC Arecibo Upgrading Program, "Expected Gregorian Performance" (memo on shaped-subreflector design G92-03, adopted 28 July 1992; Table 1 design parameters, Table 2 expected performance at ZA 15 and 20 deg, Table 3 efficiency and sidelobes), techinfo/teltech/upgrade/expperfw.htm; Internet Archive capture 2004-12-05. Fetched 2026-10-20 | `rawdata/interf/arecibo/naic_upgrade_expperfw_20041205.htm` | http://web.archive.org/web/20041205045805/http://www.naic.edu:80/techinfo/teltech/upgrade/expperfw.htm |
| UPOV | NAIC, "Arecibo Observatory Upgrading Program Overview" (dated 17 March 1997; D. Campbell, M. Davis), techinfo/teltech/upgrade/overview.htm; Internet Archive capture 2004-08-10 (same digest as the 1997 capture). Fetched 2026-10-20 | `rawdata/interf/arecibo/naic_upgrade_overview_20040810.htm` | http://web.archive.org/web/20040810194641/http://www.naic.edu:80/techinfo/teltech/upgrade/overview.htm |
| HEILES | C. Heiles, P. Perillat, M. Nolan et al., "All-Stokes Parameterization of the Main Beam and First Sidelobe for the Arecibo Radio Telescope", arXiv:astro-ph/0107349v1 (18 Jul 2001; "accepted by PASP"); Table 1 measured September 2000. Fetched 2026-10-20 | `rawdata/interf/arecibo/arxiv_astro-ph_0107349v1_heiles2001_beam.pdf` | https://arxiv.org/pdf/astro-ph/0107349v1 |
| BURTON | W. B. Burton, R. Braun, J. N. Chengalur, "Arecibo imaging of compact high-velocity clouds", arXiv:astro-ph/0102085v1 (6 Feb 2001; "accepted for publication in A&A"), Sect. 2 observations. Fetched 2026-10-20 | `rawdata/interf/arecibo/arxiv_astro-ph_0102085v1_burton2001_chvc.pdf` | https://arxiv.org/pdf/astro-ph/0102085v1 |
| ALFALFA | R. Giovanelli, M. P. Haynes, B. R. Kent et al., "The Arecibo Legacy Fast ALFA Survey: I. Science Goals, Survey Design and Strategy", arXiv:astro-ph/0508301v1 (12 Aug 2005; "to appear in Astron. J."), Sects. 1-3 (ALFA description). Fetched 2026-10-20 | `rawdata/interf/arecibo/arxiv_astro-ph_0508301v1_giovanelli2005_alfalfa.pdf` | https://arxiv.org/pdf/astro-ph/0508301v1 |
| GALFA | J. E. G. Peek, C. Heiles, "The GALFA-HI Survey: Techniques", arXiv:0810.1283v1 (2008), Sect. 8.2 ground screen. Fetched 2026-10-20 | `rawdata/interf/arecibo/arxiv_0810.1283v1_peek_heiles2008_galfa.pdf` | https://arxiv.org/pdf/0810.1283v1 |
| OSTEN | R. A. Osten, T. S. Bastian, "Wideband Spectroscopy of Two Radio Bursts on AD Leonis", arXiv:astro-ph/0509815v1 (27 Sep 2005; ApJ 637, 1016 per the arXiv record), Sect. 1. Fetched 2026-10-20 | `rawdata/interf/arecibo/arxiv_astro-ph_0509815v1_osten_bastian2006.pdf` | https://arxiv.org/pdf/astro-ph/0509815v1 |
| COLLOQ | T. Ghosh, C. Salter, "Radio Astronomy with the Arecibo 305m Telescope: In Contemporaneous Context" (Colloquium), arXiv:2604.08775v1 (dated April 13, 2026; 26 pp.), Sects. I and V. Fetched 2026-10-20 | `rawdata/interf/arecibo/arxiv_2604.08775v1_ghosh_salter2026_colloquium.pdf` | https://arxiv.org/pdf/2604.08775v1 |
| NSFC | U.S. National Science Foundation, News Release 20-011, "Arecibo Observatory's 305-meter telescope suffers collapse", December 1, 2020 (news_summ.jsp?cntn_id=301737); Internet Archive capture 2020-12-02 (on 2026-10-20 the live news_summ.jsp URL redirects to the general NSF news index, and the later slug URL .../news/arecibo-observatorys-305-meter-telescope-suffers redirects to a 404 page). Fetched 2026-10-20 | `rawdata/interf/arecibo/nsf_news_301737_collapse_20201202.html` | http://web.archive.org/web/20201202121104/https://www.nsf.gov/news/news_summ.jsp?cntn_id=301737 |
| NSFD | U.S. National Science Foundation, News Release 20-010, "NSF begins planning for decommissioning of Arecibo Observatory's 305-meter telescope due to safety concerns", November 19, 2020 (with November 24 update; news_summ.jsp?cntn_id=301674); Internet Archive capture 2020-12-03, served gzip-encoded and saved as received (.html.gz). Fetched 2026-10-20 | `rawdata/interf/arecibo/nsf_news_301674_decommission_20201203.html.gz` | http://web.archive.org/web/20201203182946/https://www.nsf.gov/news/news_summ.jsp?cntn_id=301674&org=NSF&from=news |

SHA-256 of the saved files: see the Notes section.

## Site

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| lat_deg | 18.3435 | deg (N positive) | GUIDE, Table 1, Site, Latitude | "Latitude 18◦ 20′ 36.6′′ N"<br>DERIVED: 18 + 20/60 + 36.6/3600 = 18.3435000 deg |
| lon_deg | -66.7530833 | deg (E positive; West negative) | GUIDE, Table 1, Site, Longitude (Geodetic) | "Longitude (Geodetic) 66◦ 45′ 11.1′′ W"<br>DERIVED: -(66 + 45/60 + 11.1/3600) = -66.7530833 deg |
| elev_m | 497 | m above MSL (reflector centre of curvature, not the dish surface) | GUIDE, Table 1, Site | "Elevation of reflector center of curvature 497 m (1630 ft) above MSL"<br>DERIVED: dish vertex (lowest point of the spherical cap, one radius of curvature below the centre of curvature) = 497 - 265 = 232 m above MSL; no source states the vertex or ground height |
| site_desc | karst hills of Puerto Rico, about 10 miles south of the city of Arecibo |  | GUIDE, Sect. 2 | "The Observatory lies in the karst hills of the Caribbean island of Puerto Rico, some 10 miles south of the coastal city of Arecibo." |

## Dish (primary reflector and platform)

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| dish_m | 305 | m (diameter of the spherical cap) | GUIDE, Table 1, Primary Reflector | "Diameter of Spherical cap 305 m (1000 ft)"<br>ALT (GUIDE, Sect. 2.1: "305 m (1000 ft) in diameter and 51 m (167 ft) deep")<br>ALT (NSFD, Engineering summary: "a radio dish 1,000 feet (305 meters) wide in diameter with a 900-ton instrument platform hanging 450 feet above") |
| radius_of_curvature_m | 265 | m | GUIDE, Table 1, Primary Reflector | "Radius of Curvature 265 m (870 ft)" |
| depth_m | 51 | m | GUIDE, Sect. 2.1 | "305 m (1000 ft) in diameter and 51 m (167 ft) deep" |
| surface_rms_mm | 2 | mm rms | GUIDE, Table 1, Primary Reflector | "Surface Accuracy 2 mm (rms)"<br>ALT (1992 design value) (EXPP, Forward Gain: "The sensitivity rolls off at high frequencies due to the 2.3 mm surface roughness of the primary spherical reflector.") |
| platform | 900-ton triangular platform 137 m above the reflector, on 18 cables from 3 towers |  | GUIDE, Sect. 2.1 | "Suspended 137 m (450 ft) above the reflector is a 900-ton triangular platform, supported by 18 cables suspended from 3 reinforced concrete towers." |
| aperture_blockage | platform and support cables lie in the incoming beam |  | GUIDE, Sect. 3, position switching | "with the suspended platform and a good fraction of its support cables being situated within the volume traversed by the incoming rays focused on the telescope feed"<br>ALT (design estimate) (EXPP, Constraints: "The physical blockage corresponds to approximately two percent of the 1000 foot aperture, equivalent to a circular aperture of 140 ft diameter.")<br>ALT (from the measured sidelobe/beam ratios) (HEILES, Abstract: "with the blocked area equal to about 10% of the effective area (this corresponds to 5% physical blockage)")<br>ALT (from the HPBW-vs-wavelength fit, 6-70 cm) (HEILES, Sect. 4.4: "corresponds to about 13% blockage") |
| gregorian | Gregorian dome with shaped secondary and tertiary; 0.3-10 GHz |  | GUIDE, Sect. 2.1 | "The system housed in the Gregorian dome provides continuous frequency coverage from 300 MHz to 10 GHz using a pair of shaped (secondary and tertiary) subreflectors" |

## Illuminated aperture (Gregorian) and its motion with zenith angle

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| illum_gregorian_m | [213, 237] | m x m (at zenith) | GUIDE, Table 1, Illuminated Area (at zenith), Gregorian Feeds | "Gregorian Feeds 213 × 237 m (700 × 776 ft)"<br>DERIVED: 700 ft x 0.3048 = 213.36 m; 776 ft x 0.3048 = 236.52 m<br>ALT (EXPP, Table 1, I. Geometry a): "a) Aperture size and offset: 700 ft 776 ft, 47 ft downhill offset")<br>ALT (PHB, text: "The AO dish optics is 213m by 237 m (700 by 776 feet).")<br>ALT (OSTEN, Sect. 1: "illumination area 213 m×237 m at zenith")<br>ALT (rounded) (BURTON, Sect. 2: "illuminating the primary over an area of about 210×240 meters in extent") |
| illum_orientation | smaller (700 ft = 213 m) along the uphill-downhill (zenith-angle) direction, larger (776 ft = 237 m) transverse (azimuth direction) |  | EXPP, Forward Gain | "The aperture in this design is elliptical, being larger in the transverse dimension than in the uphill-downhill direction."<br>ALT (EXPP, Table 1, coordinate definition: "x is positive towards increasing zenith angle")<br>ALT (EXPP, Table 1, I. Geometry a) 1-3: "1) uphill dimension x = +303 ft ... 2) downhill dimension x = -397 ft ... 3) transverse dimension y = 388 ft")<br>ALT (HEILES, Sect. 3.1: "Arecibo’s beam is elliptical by design; φbeam should be 90◦, meaning that the za beam is larger than the az beam.")<br>ALT (ALFALFA, Sect. 3: "The major axis of the ellipse is linked to the azimuth of the receiver, so its orientation on the sky changes with telescope configuration.")<br>NOTE: Mapping 213 m to the za direction and 237 m to the azimuth direction follows EXPP (x = increasing za; 303 + 397 = 700 ft along x, 2 x 388 = 776 ft along y). On the meridian the za direction is north-south, so ns_m = 213, ew_m = 237 at transit (INFERRED from the geometry; no source states ns/ew). |
| illum_offset | 47 | ft downhill of the paraxial ray (aperture centre at x = -47 ft) | EXPP, Table 1, I. Geometry a); Table 1 header | "a) Aperture size and offset: 700 ft 776 ft, 47 ft downhill offset"<br>DERIVED: 47 ft = 14.33 m; aperture centre (303 - 397)/2 = -47 ft<br>ALT (EXPP, Table 1, header: "via the three reflectors to the center of the aperture at x = -47 ft")<br>ALT (UPOV, Ground screen: "The newly completed Gregorian subreflector moves the illumination pattern 15 m downhill, further reducing vignetting noise.") |
| illum_area_m2 | 39635 | m2 (= 225 m circle) | EXPP, Forward Gain | "The selected dimensions are 397 feet downhill from the paraxial ray, 303 feet uphill from the paraxial ray, and 388 feet transverse, giving an illuminated area of 426,600 square feet (39,635 square meters). The illuminated area is equal to that of a 225 m diameter circle."<br>DERIVED: pi/4 x 213.36 x 236.52 = 39635 m2; sqrt(213.36 x 236.52) = 224.64 m<br>ALT (PHB, text: "The gregorian optics is designed for a 700 x 776 feet (213 x 237 meters) illumination. The geometrical mean of this is 225 meters.") |
| illum_function | {"form": "I(r) = 1 - (1 - taper) (r/R)^rolloff", "R_ft": 350, "a": "776/700", "edge_taper_db": -7, "rolloff": 6} | power illumination of the primary (design G92-03) | EXPP, Table 1, II. Aperture power illumination functions a) | "I(r) = 1 - (1 - taper) (r/R)^rolloff, where R = 350 ft and r =[x^2 + (y/a)^2] with a = 776/700: ... 9) edge taper = -7 dB ... 10) rolloff exponent = 6"<br>ALT (measured-era statement; a different definition from the -7 dB design power taper (not reconciled in the sources)) (PHB, text: "It has a geometric taper of about 9 db.")<br>ALT (EXPP, Antenna Noise c): "choose an aperture illumination which is nearly uniform over much of the area and then rolls off sharply near the edge")<br>NOTE: r is printed as [x^2 + (y/a)^2]; read as the elliptical radius sqrt((x - x0)^2 + (y/a)^2) about the aperture centre x0 = -47 ft (INFERRED: the square root and the centring are not printed). |
| illum_vs_za | different parts of the spherical primary are illuminated as the feed moves; at high za the illumination spills over the uphill rim onto the ground screen |  | BURTON, Sect. 2 | "Different sections of the spherical reflector are illuminated, however, depending on the source position. In order to minimize beam distortions and gain variations caused when the illuminated pattern spills over the edges of the primary surface, we constrained most of the observations to moderate zenith angles, less than 17◦"<br>ALT (EXPP, Forward Gain: "One of the major requirements is the reduction of vignetting at high zenith angles to keep the sensitivity high and the system temperature low. The feed design is offset so the aperture is larger downhill of the paraxial ray, moving the illumination away from the uphill edge of the primary.")<br>ALT (EXPP, Forward Gain: "At maximum zenith angle, the sensitivity will be reduced about 1.0 dB by vignetting.")<br>ALT (EXPP, Antenna Noise b): "At high zenith angles, vignetting over the edge of the primary would be a contributor, but the ground screen shields almost all of the spillover energy from the ground.")<br>ALT (EXPP, Table 2, Effective Aperture, 1400 MHz (ZA 15 vs ZA = 20): "1400 MHz \| 11 K/Jy \| 9 K/Jy")<br>ALT (GALFA, Sect. 8.2: "the ground screen is only illuminated towards the edges of our declination range, near −1◦ and 38◦")<br>ALT (UPOV, Ground screen: "addition of a screen 16 m high and 1 km long around the perimeter of the reflector")<br>ALT (COLLOQ, Sect. V: "A 50-ft-high stainless steel ground screen around the dish made the system temperature (Tsys) far less dependent on the telescope Zenith Angle by deflecting the vignetted beam onto the sky") |
| illum_line_feed_430 | 305 | m (430-MHz carriage-house line feed, at zenith) | GUIDE, Table 1, Illuminated Area (at zenith) | "430-MHz Line Feed 305 m (1000 ft)"<br>ALT (GUIDE, Sect. 2.1: "This 430-MHz feed has the unique advantage of illuminating the entire reflector (at zenith), but has a bandwidth of only 10 MHz") |

### Vignetting versus zenith angle (DERIVED model)

DERIVED: the design aperture (EXPP Table 1: x from -397 to +303 ft, y = +-388 ft, ellipse about x0 = -47 ft) is mapped onto the sphere (radius 870 ft, GUIDE) for a beam at zenith angle za; an aperture point (x, y) reflects at C - sqrt(R^2 - x^2 - y^2) s + x e_x + y e_y and lies on the dish if its angle from the downward vertical is <= the rim half-angle asin(500/870). gain_factor = (sum of field on dish / sum of field)^2 with field = sqrt(EXPP power illumination, -7 dB edge, rolloff 6), feed power fixed.

- Rim half-angle asin(500/870) = 35.080 deg; onset: DERIVED: uphill edge x = +303 ft reaches the rim when za = asin(500/870) - asin(303/870) = 35.080 - 20.382 = 14.70 deg.
- EXPP design: "about 1.0 dB" loss at maximum za; EXPP Table 2 1400 MHz 11 -> 9 K/Jy from ZA 15 to 20 = -0.87 dB (DERIVED); this simple model gives -0.67 dB at 19.7 deg.

| za (deg) | aperture area on dish (fraction) | gain factor (taper-weighted) | gain (dB) |
|---|---|---|---|
| 0 | 1.0000 | 1.0000 | 0.00 |
| 10 | 1.0000 | 1.0000 | 0.00 |
| 14 | 1.0000 | 1.0000 | 0.00 |
| 14.7 | 1.0000 | 1.0000 | 0.00 |
| 15 | 0.9980 | 0.9979 | -0.01 |
| 16 | 0.9841 | 0.9807 | -0.08 |
| 17 | 0.9655 | 0.9543 | -0.20 |
| 18 | 0.9443 | 0.9217 | -0.35 |
| 19 | 0.9214 | 0.8846 | -0.53 |
| 19.7 | 0.9048 | 0.8569 | -0.67 |

## Pointing limits and declination range

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| zenith_limit_deg | 19.7 | deg (pointing; 1.06-19.7 deg in tracking mode) | GUIDE, Table 1, Pointing Limits, Zenith Angle | "Zenith Angle 0◦ –19◦.7 (1◦.06 –19◦.7 in tracking mode)"<br>ALT (GUIDE, Sect. 2.1: "can be independently positioned anywhere up to ∼ 20◦ from the vertical")<br>ALT (HEILES, Sect. 7: "near Arecibo’s za limit of 20◦") |
| azimuth_range_deg | [0, 720] | deg | GUIDE, Table 1, Pointing Limits, Azimuth | "Azimuth 0◦ –720◦" |
| dec_range | [-1.3333, 38.0333] | deg (-1 20 < Dec < +38 02) | GUIDE, Table 1, Declination range | "Declination range −1◦ 20′ < Dec < +38◦ 02′"<br>DERIVED: lat -/+ 19.7 deg = -1.3565 / 38.0435 deg = -1 21.4 / +38 02.6 (agrees with GUIDE to 1.4 arcmin)<br>ALT (rounded/conservative) (ALFALFA, Sect. 1: "declination limits of the Arecibo telescope, −2◦ < Decl. < +38◦") |
| slew_rates | {"az_deg_per_min": 24, "za_deg_per_min": 2.4} | deg/min | GUIDE, Table 1, Slew Rates | "Azimuth 24◦ /min Zenith Angle 2◦.4/min" |
| pointing_rms_arcsec | 5 | arcsec rms | GUIDE, Table 1 | "Pointing Accuracy ∼5′′ (rms)" |

## Tracking

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| tracking_mechanism | azimuth arm (360 deg) plus Gregorian dome and carriage house moving along the arm up to ~20 deg from vertical |  | GUIDE, Sect. 2.1 | "on opposite sides of which a carriage house and a geodetic (Gregorian) dome can be independently positioned anywhere up to ∼ 20◦ from the vertical. Electric motors drive the azimuth arm, the Gregorian dome and the carriage house to point to and track any requested celestial position with millimeter precision (3 mm ∼ 5 arcsec)." |
| tracking_table_caption | Table 2 gives the rise-to-set tracking duration |  | GUIDE, Sect. 2.1 | "Celestial tracking duration (rise to set) is given in Table 2."<br>ALT (GUIDE, Table 2 heading: "Table 2: Tracking Time Declination Tracking Time (deg) (h:mm)") |

| Dec (deg) | tracking time (h:mm) | hours | DERIVED hours (za <= 19.7) | DERIVED - GUIDE (min) | verbatim row (GUIDE Table 2) |
|---|---|---|---|---|---|
| -1 | 0:31 | 0.5167 | 0.5058 | -0.7 | "–1◦ 0:31" |
| 0 | 0:58 | 0.9667 | 0.9748 | +0.5 | "0◦ 0:58" |
| 2 | 1:30 | 1.5000 | 1.4956 | -0.3 | "2◦ 1:30" |
| 5 | 2:18 | 2.3000 | 1.9785 | -19.3 | "5◦ 2:18" |
| 10 | 2:27 | 2.4500 | 2.4574 | +0.4 | "10◦ 2:27" |
| 15 | 2:42 | 2.7000 | 2.7038 | +0.2 | "15◦ 2:42" |
| 20 | 2:46 | 2.7667 | 2.7728 | +0.4 | "20◦ 2:46" |
| 25 | 2:40 | 2.6667 | 2.6643 | -0.1 | "25◦ 2:40" |
| 30 | 2:20 | 2.3333 | 2.3290 | -0.3 | "30◦ 2:20" |
| 35 | 1:35 | 1.5833 | 1.5800 | -0.2 | "35◦ 1:35" |
| 37 | 0:57 | 0.9500 | 0.9604 | +0.6 | "37◦ 0:57" |
| 38 | 0:07 | 0.1167 | 0.1997 | +5.0 | "38◦ 0:07" |

DERIVED: 2 H / 15 h, cos H = (cos 19.7 - sin(lat) sin(dec)) / (cos(lat) cos(dec)), lat = 18.34350 (the 1.06 deg tracking-mode minimum za is ignored; no table declination lies within 1.06 deg of the latitude).

## Beams

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| hpbw_relation | hpbw = K lambda / D, K = 1.02 (uniform), D = 213 x 237 m optics; geometric mean 225 m |  | PHB, text | "hpbw=K * lambda/Diameter ... For uniform illumination on a spherical dish K=1.02."<br>ALT (PHB, Fig 2 text: "The hpbw is converted to diameter using diam=1.02*lambda/hpbw (1.02 is the constant for uniform illumination).")<br>ALT (PHB, method: "The value plotted is the average hpbw (the average of the major and minor axis). The zenith angle has been limited to 5 < za < 14 degrees.")<br>ALT (HEILES, Sect. 2.4: "Arecibo’s theoretical gain, without blockage, is KperJy ≈ 11, which is equivalent to a uniformly illuminated circular aperture with radius 94 m.") |
| heiles_epoch | Sept 2000 measurements; LBW gain falls with frequency (reflector irregularities); adjustments planned for early 2001 |  | HEILES, Sect. 3 | "This is almost certainly a result of irregularities in the main reflector; a program of adjustments is planned for early 2001." |
| beam_shape_vs_uniform | main beam narrower and sidelobes higher than an unblocked uniform aperture of the same effective area (blockage) |  | HEILES, Abstract | "The main beam width is smaller and the sidelobe levels higher than for a uniformly-illuminated aperture of the same effective area." |

### GUIDE Table 3 HPBW (az x za; za below 15 deg; Arecibo staff) with the DERIVED 1.02 lambda/D check

| receiver | freq (GHz) | freq basis | FWHM az (arcmin) | FWHM za (arcmin) | mean (DERIVED) | pred az / za (DERIVED) | verbatim row (GUIDE Table 3) |
|---|---|---|---|---|---|---|---|
| 430chg | 0.43 | band centre (DERIVED) | 10 | 12 | 11 | 8.02 / 8.02 | "430chg 0.425 – 0.435 70 - 120 10 - 20 3.5 - 10 10 × 12" |
| 327 | 0.327 | band centre (DERIVED) | 14 | 15 | 14.5 | 13.59 / 15.07 | "327 0.312 – 0.342 90 + Tsky 10.5 11 14 × 15" |
| 430 | 0.43 | band centre (DERIVED) | 10 | 12 | 11 | 10.34 / 11.46 | "430 0.425 – 0.435 35 + Tsky 11 5 10 × 12" |
| lbw | 1.42 | stated by RXL: "Beam Size (at 1.42 GHz): 3.1x3.5" | 3.1 | 3.5 | 3.3 | 3.13 / 3.47 | "lbw 1.120 – 1.730 25 10.5 2.4 3.1 × 3.5" |
| sbw | 2.45 | band centre (DERIVED; measurement frequency NOT FOUND) | 1.8 | 2.0 | 1.9 | 1.81 / 2.01 | "sbw 1.800 – 3.100 32 9.5 3.4 1.8 × 2.0" |
| sbn | 2.335 | centre of 2.24-2.43 (DERIVED; two sub-ranges 2.240-2.340 and 2.330-2.430) | 1.8 | 2.0 | 1.9 | 1.90 / 2.11 | "sbn 2.240 – 2.340 25 10 2.5 1.8 × 2.0 2.330 – 2.430 25 10 2.5 1.8 × 2.0" |
| sbh | 3.5 | band centre (DERIVED; measurement frequency NOT FOUND) | 1.35 | 1.5 | 1.43 | 1.27 / 1.41 | "sbh 3.000 – 4.000 29 8.8 3.3 1.35 × 1.5" |
| cb | 5.0 | INFERRED from Table 3 note c ("At 5 GHz", attached to the SEFD entry) | 0.9 | 1.0 | 0.95 | 0.89 / 0.98 | "cb 3.850 – 6.050 31 8 3.9c 0.9 × 1.0" |
| xb | 9.0 | INFERRED from Table 3 note e ("At 9 GHz", attached to the SEFD entry) | 0.5 | 0.6 | 0.55 | 0.49 / 0.55 | "xb 8.0 – 10.0 33 4.5 7.5e 0.5 × 0.6" |
| ALFA center pixel | 1.375 | band centre (DERIVED; measurement frequency NOT FOUND) | 3.3 | 3.7 | 3.5 | 3.23 / 3.58 | "Center Pix 1.225 – 1.525 30 11 2.8 3.3 × 3.7" |
| ALFA outer pixels | 1.375 | band centre (DERIVED; measurement frequency NOT FOUND) | 3.3 | 3.7 | 3.5 | 3.23 / 3.58 | "Outer Pixs 1.225 – 1.525 30 8.5 3.5 3.3 × 3.7" |

Prediction basis: 1.02 lambda / 236.52 m (az) and 1.02 lambda / 213.36 m (za) at the listed frequency (PHB relation; per-axis mapping INFERRED from EXPP); for 430chg 1.02 lambda / 305 m. The measured 430chg beam (10 x 12) is wider than the full-dish prediction (8.0); the sources do not state the cause.

### Other measured beams

| receiver | freq (GHz) | FWHM | source + location | verbatim quote |
|---|---|---|---|---|
| lbw | 1.42 | 3.1 (az) x 3.5 (za) arcmin | RXL, 1. Basic Information | "Beam Size (at 1.42 GHz): \| 3.1x3.5 \|" |
| LBW | 1.42 | 3.1 (az) x 3.7 (za) arcmin | BURTON, Sect. 2 (citing Heiles 1999) | "The FWHM beamwidth measured with the wide L–band (LBW) feed at 1420 MHz is 3.1 × 3.7 arcmin in the azimuth and zenith–angle directions, respectively" |
| 430 (Gregorian, 430G) | 0.43 | 10.9 (average; Heiles HPBW) arcmin | HEILES, Table 1 (za 10 deg, Sept 2000) | "430G 430 B1634+269 10 .039 0.33 10.3 10.9 0.66 0.88" |
| LBW | 1.175 | 4.0 (average; Heiles HPBW) arcmin | HEILES, Table 1 (za 10 deg, Sept 2000) | "LBW 1175 B1634+269 10 .043 0.32 8.7 4.0 0.56 0.75" |
| LBW | 1.415 | 3.4 (average; Heiles HPBW) arcmin | HEILES, Table 1 (za 10 deg, Sept 2000) | "LBW 1415 B1634+269 10 .046 0.32 7.5 3.4 0.50 0.67" |
| LBW | 1.666 | 2.9 (average; Heiles HPBW) arcmin | HEILES, Table 1 (za 10 deg, Sept 2000) | "LBW 1666 B1634+269 10 .042 0.31 6.9 2.9 0.48 0.62" |
| ALFA (all 7 beams) | NOT STATED (band 1.225-1.525) | 3.3 (az) x 3.8 (za) arcmin | ALFALFA, Sect. 3 | "for which the beam sizes are 3.3′ along the azimuth direction and 3.8′ along the zenith angle directon, with small variations from one beam to the other" |

HEILES Table 1 columns: RCVR, FREQ (MHz), SOURCE, za (deg), Pn,FS, eta_FS/eta_MB, KperJy, HPBW (arcmin), eta_MB, eta_MB + eta_FS.

## Sidelobes

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| first_sidelobe_peak_frac | {"430G_0.430GHz": 0.039, "LBW_1.175GHz": 0.043, "LBW_1.415GHz": 0.046, "LBW_1.666GHz": 0.042} | fraction of main-beam peak (Pn,FS), za 10 deg, Sept 2000 | HEILES, Table 1 column Pn,FS; definition Sect. 4.1 | "The peak power in the first sidelobe, as a fraction of the peak of the main beam, is Pn,FS,U,I"<br>DERIVED: 10 log10: 0.039 -> -14.1 dB; 0.043 -> -13.7 dB; 0.046 -> -13.4 dB; 0.042 -> -13.8 dB<br>ALT (HEILES, Table 1: "LBW 1415 B1634+269 10 .046 0.32 7.5 3.4 0.50 0.67")<br>ALT (HEILES, Sect. 3: "measured during September 2000")<br>NOTE: The quoted definition carries the subscripts U,I (ideal-aperture case); Table 1 heads the same quantity Pn,FS for the observations. |
| alfa_sidelobes | {"beam0_first_ring_db": -15, "outer_beams_db": [-8, -7]} | dB below peak | ALFALFA, Sect. 3 | "with a first sidelobe ring near 15 dB below the response at beam center"<br>ALT (ALFALFA, Sect. 3: "reaching levels near 7–8 dB below peak response, on the section away from the array center") |
| design_peak_sidelobe_db | {"0.25GHz": -12.2, "0.5GHz": -13.5, "1GHz": -15.1, "5GHz": -16.0} | dB, with blockage, ZA 15 deg (design G92-03) | EXPP, Table 3 (With Blockage); Table 2 (ZA 15o column) | "With Blockage \| -12.2 dB \| -13.5 dB \| -15.1 dB \| -16 dB"<br>ALT (EXPP, Table 2, Peak Sidelobe Level (ZA 15o, ZA = 20o): "Peak Sidelobe Level \| 250 MHz \| -12.2 dB \| -11.2 dB")<br>ALT (EXPP, Sidelobe Level: "The blockage increases the first sidelobe by about 2 dB (see Table 3).") |

## Receivers and bands

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| receiver_table_scope | Table 3: name, range, Tsys, gain, SEFD, HPBW (az x za) for za below 15 deg, measured by staff |  | GUIDE, Sect. 2.2 | "The columns of the table give the receiver name, frequency range, the typical System Temperature (Tsys ), Gain, System Equivalent Flux Density (SEFD) and Half Power Beamwidth (HPBW) for zenith angles below 15◦ (as measured by Arecibo staff.)"<br>ALT (GUIDE, Table 3 header: "HPBWa,f ... Az × ZA (Arcmin)")<br>ALT (GUIDE, Table 3 note a: "The HPBW in ZA increases with zenith angle.") |
| if_bandwidth_GHz | 1.0 | GHz per polarization (maximum instantaneous, IF/fibre chain) | GUIDE, Sect. 2.3 | "providing an instantaneous bandwidth of up to 1 GHz per polarization" |
| alfa | 7 feeds (hexagon + centre), dual linear, 1225-1525 MHz; beam 0 ~11 K/Jy, beams 1-6 ~8.5 K/Jy |  | ALFALFA, Sect. 3 | "their spectral response is optimized for the range 1225–1525 MHz"<br>ALT (GUIDE, Sect. 2.2: "ALFA is a seven-feed survey instrument, covering a band of 1225-1525 MHz.")<br>ALT (ALFALFA, Sect. 3: "gain (≃ 11 K/Jy) than the peripheral beams 1–6 (gain of ≃ 8.5 K/Jy)")<br>ALT (ALFALFA, Sect. 3: "a circular pattern in the sky maps on the focal plane as an ellipse of axial ratio 1.15") |
| cbwd_note | C-band wide installed July 2017, commissioning |  | GUIDE, Table 3 note d | "The C-Band Wide receiver was installed in the Gregorian Dome in July 2017, and is cur- rently (October 30, 2017) being commissioned." |
| rxt_epoch | RXT Tsys column from the system check of Wed Aug 5 2020 |  | RXT, table header | "Tsys from last system check (Wed Aug 5 06:49 2020)" |
| lbw_feed_taper | -16 dB edge taper (new ring-loaded L-wide horn, on the tertiary) |  | RXL, 6. Technical Info | "-16 dB edge taper compared to -12 dB" |

| band | lo (GHz) | hi (GHz) | bw (GHz, DERIVED) | feed | status | source | verbatim row |
|---|---|---|---|---|---|---|---|
| 430chg | 0.425 | 0.435 | 0.01 | carriage-house 430-MHz line feed (illuminates the full 305 m at zenith) | damaged by Hurricane Maria Sept 2017 (GUIDE note g); listed DOWN/archived in RXT 2020 | GUIDE, Table 3 | "430chg 0.425 – 0.435 70 - 120 10 - 20 3.5 - 10 10 × 12" |
| 327 | 0.312 | 0.342 | 0.03 | Gregorian single pixel | available 2020 (RXT) | GUIDE, Table 3 | "327 0.312 – 0.342 90 + Tsky 10.5 11 14 × 15" |
| 430 | 0.425 | 0.435 | 0.01 | Gregorian single pixel | available 2020 (RXT) | GUIDE, Table 3 | "430 0.425 – 0.435 35 + Tsky 11 5 10 × 12" |
| lbw | 1.12 | 1.73 | 0.61 | Gregorian single pixel (L-wide) | available 2020 (RXT) | GUIDE, Table 3 | "lbw 1.120 – 1.730 25 10.5 2.4 3.1 × 3.5" |
| sbw | 1.8 | 3.1 | 1.0 | Gregorian single pixel (S-low in RXT) | available 2020 (RXT) | GUIDE, Table 3 | "sbw 1.800 – 3.100 32 9.5 3.4 1.8 × 2.0" |
| sbn | 2.24 | 2.43 | 0.19 | Gregorian single pixel (S-narrow) | available 2020 (RXT) | GUIDE, Table 3 | "sbn 2.240 – 2.340 25 10 2.5 1.8 × 2.0 2.330 – 2.430 25 10 2.5 1.8 × 2.0" |
| sbh | 3.0 | 4.0 | 1.0 | Gregorian single pixel (S-high) | available 2020 (RXT) | GUIDE, Table 3 | "sbh 3.000 – 4.000 29 8.8 3.3 1.35 × 1.5" |
| cb | 3.85 | 6.05 | 1.0 | Gregorian single pixel (C-band) | available 2020 (RXT) | GUIDE, Table 3 | "cb 3.850 – 6.050 31 8 3.9c 0.9 × 1.0" |
| cbwd | 4.0 | 8.0 | 1.0 | Gregorian single pixel (C-band wide) | commissioning Oct 2017 (GUIDE note d); not in RXT 2020 | GUIDE, Table 3 | "cbwd 4.000 – 8.000 – – – –" |
| xb | 8.0 | 10.0 | 1.0 | Gregorian single pixel (X-band) | RXT 2020: "Not available until further notice." | GUIDE, Table 3 | "xb 8.0 – 10.0 33 4.5 7.5e 0.5 × 0.6" |
| ALFA | 1.225 | 1.525 | 0.3 | Gregorian 7-feed array, beam 0 | available 2020 (RXT) | GUIDE, Table 3 | "Center Pix 1.225 – 1.525 30 11 2.8 3.3 × 3.7" |
| C-high | 5.9 | 8.1 | 1.0 | Gregorian single pixel | not in GUIDE 2017 Table 3; RXT 2020 lists it under Archived, DOWN | RXT, Receiver Parameters table, Archived section | "C-high \| 5.9-8.1 \| Dual Linear (dual beam in future) \| 2.5-7.5* \| 26-29* \| 0.75x0.65 \| DOWN" |

bw_GHz = min(hi - lo, 1 GHz) (DERIVED from the GUIDE 1 GHz per polarization IF limit); the 430chg line feed bandwidth is "only 10 MHz" (GUIDE). GUIDE Table 3 columns: receiver, freq range (GHz), Tsys (K), gain (K/Jy), SEFD (Jy), HPBW az x za (arcmin).

### RXT receiver table, August 2020 (cells re-parsed from the saved HTML)

| name | lo (GHz) | hi (GHz) | beam size as printed (arcmin) | section | verbatim row |
|---|---|---|---|---|---|
| 327 - MHz | 0.312 | 0.342 | 15x14 | available | "327 - MHz \| 0.312 - 0.342 \| Circular with Hybrid, Native Linear \| 11* \| 113* \| 15x14" |
| 430 - MHz | 0.422 | 0.442 | 12x10 | available | "430 - MHz \| 0.422 - 0.442 \| Dual Circular \| 11* \| 50* \| 12x10" |
| ALFA | 1.225 | 1.525 | 3.8x3.3 | available | "ALFA \| 1.225-1.525 \| Dual Linear \| 10* \| 30* \| 3.8x3.3" |
| L-wide | 1.15 | 1.73 | 3.5x3.1 | available | "L-wide \| 1.15 - 1.73 \| Dual Linear \| 9-11* \| 25-40* \| 3.5x3.1" |
| S-low | 1.8 | 3.1 | 2.0x1.8 | available | "S-low \| 1.8 - 3.1 \| Dual Linear \| 8* \| 40* \| 2.0x1.8" |
| S-narrow | 2.33 | 2.43 | 2.0x1.8 | available | "S-narrow \| 2.33 - 2.43 \| Dual Circular \| 10* \| 25* \| 2.0x1.8" |
| S-high | 3.0 | 4.0 | 1.5x1.35 | available | "S-high \| 3-4 \| Dual Linear \| 7-10* \| 31-37* \| 1.5x1.35" |
| C | 3.85 | 6.0 | 1.0x0.9 | available | "C \| 3.85 - 6.00 \| Dual Linear \| 4-8.5* \| 29-40* \| 1.0x0.9" |
| X | 7.8 | 10.2 | 0.57x0.5 | listed available, "Not available until further notice." | "X \| 7.8 - 10.2 \| Dual Circular \| 2.0-5.5* \| 28-32* \| 0.57x0.5 \| 178 Not available until further notice." |
| 800 - MHz | 0.705 | 0.8 | 6.3 | archived | "800 - MHz \| 0.705-0.800 \| Native Linear \| 9* \| 120* \| 6.3 \| DOWN" |
| CH 430 - MHz | 0.425 | 0.435 | 9.5x8.5 | archived | "CH 430 - MHz \| 0.425 - 0.435 \| Dual Circular \| 20* \| 120* \| 9.5x8.5 \| DOWN" |
| 610 - MHz | 0.6075 | 0.6115 | 8x7 | archived | "610 - MHz \| 0.6075 - 0.6115 \| Dual Linear \| 11* \| 102* \| 8x7 \| DOWN" |
| L-narrow | 1.28 | 1.5 | 3.6x3.4 | archived | "L-narrow \| 1.280 - 1.50 \| Dual Circular \| 8-10* \| 25-30* \| 3.6x3.4 \| DOWN" |
| C-high | 5.9 | 8.1 | 0.75x0.65 | archived | "C-high \| 5.9-8.1 \| Dual Linear (dual beam in future) \| 2.5-7.5* \| 26-29* \| 0.75x0.65 \| DOWN" |

RXT prints the larger (za) value first in every two-value row (e.g. L-wide 3.5x3.1 vs GUIDE az x za 3.1 x 3.5); the column order is not labelled (INFERRED).

## History, end of operations and collapse

| parameter | value | unit | source + location | verbatim quote |
|---|---|---|---|---|
| first_light | late 1963 |  | COLLOQ, Sect. I | "When the giant 305-m dish saw first light in late 1963" |
| construction_upgrades | built 1960-63; upgraded 1972-74 and 1992-98 |  | GUIDE, Sect. 2 | "It was constructed in 1960-63 and upgraded, first in 1972-74, and again in 1992-98." |
| gregorian_design | design G92-03 adopted 28 July 1992 |  | EXPP, Summary | "adopted the shaped subreflector design known as G92-03 at their meeting on 28 July 1992" |
| ground_screen_1993 | ground screen completed August 1993 |  | UPOV, Upgrading program components | "Installation of a Ground Screen, to reduce noise generated by radiation from the ground - completed in August 1993" |
| alfa_installed | ALFA installed April 2004 |  | GUIDE, Sect. 2.2 | "This was installed in April 2004." |
| hurricane_maria | Sept 2017 damage to the 430-MHz line feed |  | GUIDE, Table 3 note g | "The 430-MHz CH line feed was severely damaged by the passage of Hurricane Maria in Sept. 2017." |
| aux_cable_failure | 2020-08-10 | date | NSFD, Engineering summary | "On Aug. 10, 2020, an auxiliary cable failed, slipping from its socket in one of the towers and leaving a 100-foot gash in the dish below." |
| end_of_operations | August 2020 (first auxiliary-cable break) |  | COLLOQ, Sect. V | "continued apace until August 2020, when the first auxiliary-cable break suspended operations for good" |
| main_cable_break | 2020-11-06 | date | NSFD, November 19, 2020 text | "a main cable broke on the same tower Nov. 6"<br>ALT (NSFC, Background: "However, a second cable broke Nov. 6.") |
| decommission_announced | 2020-11-19 | date | NSFD, News Release 20-010, November 19, 2020 | "the U.S. National Science Foundation will begin plans to decommission the 305-meter telescope, which for 57 years has served as a world-class resource for radio astronomy, planetary, solar system and geospace research."<br>ALT (NSFD, heading: "NSF begins planning for decommissioning of Arecibo Observatory’s 305-meter telescope due to safety concerns")<br>ALT (NSFD, dateline: "November 19, 2020") |
| collapse | 2020-12-01 about 07:55 AST | date/time | NSFC, News Release 20-011, first paragraph | "The instrument platform of the 305-meter telescope at Arecibo Observatory in Puerto Rico fell at approximately 7:55 a.m. Atlantic Standard Time Dec. 1, resulting in damage to the dish and surrounding facilities."<br>ALT (NSFC, heading: "Arecibo Observatory’s 305-meter telescope suffers collapse")<br>ALT (NSFC, dateline: "December 1, 2020")<br>ALT (NSFC, investigation: "Initial findings indicate that the top section of all three of the 305-meter telescope’s support towers broke off. As the 900-ton instrument platform fell, the telescope’s support cables also dropped.")<br>ALT (NSFC, injuries: "No injuries were reported as a result of the collapse.") |

Page note (from the quotes above): The 305-m telescope stopped observing after an auxiliary cable failed on 10 August 2020; NSF announced its decommissioning on 19 November 2020, and the instrument platform fell into the dish on 1 December 2020.

## Not found

- The frequency at which GUIDE Table 3 HPBWs were measured, except lbw (1.42 GHz, RXL); cb and xb use the SEFD-note frequencies (5 and 9 GHz, INFERRED); other entries use band centres (DERIVED).
- Measured first-sidelobe levels for the S, C and X receivers (only design values, EXPP Table 3; measured values exist only for 430G and LBW in HEILES, and ALFA in ALFALFA).
- Per-receiver instantaneous bandwidths: only the 1 GHz per polarization IF limit (GUIDE Sect. 2.3) and the 10 MHz line-feed bandwidth are stated; bands[].bw_GHz is DERIVED.
- A measured gain or illuminated-area curve versus zenith angle beyond 15 deg: only qualitative statements (BURTON, EXPP) and the design table at ZA 15 and 20 deg (EXPP Table 2); the vignetting table here is DERIVED from the design geometry.
- A statement of which illuminated-aperture axis lies north-south: EXPP gives uphill-downhill (za) vs transverse; ns/ew at transit is INFERRED.
- The geodetic datum of the GUIDE latitude/longitude, and the ground or dish-vertex height (GUIDE gives the centre-of-curvature height, 497 m).
- The exact date of the last astronomical observation (COLLOQ: August 2020; RXT last system check Wed Aug 5 2020; aux cable failure Aug 10, 2020).
- Tracking-time loss inside the 1.06 deg tracking-mode minimum za (no table declination lies within 1.06 deg of the latitude).

## Conflicts

- Declination range: GUIDE -1 20 < Dec < +38 02; ALFALFA -2 < Dec < +38; DERIVED lat -/+ 19.7 deg = -1 21.4 / +38 02.6; GALFA ground-screen illumination "near -1 and 38".
- Illuminated area: 213 x 237 m (GUIDE, PHB, OSTEN; 700 x 776 ft EXPP) vs "about 210x240 meters" (BURTON, rounded).
- L-wide beam: 3.1 x 3.5 arcmin (GUIDE, RXL at 1.42 GHz; RXT 3.5x3.1) vs 3.1 x 3.7 at 1420 MHz (BURTON citing Heiles 1999) vs mean 3.4 at 1415 MHz (HEILES, Sept 2000; HEILES says reflector adjustments were planned for early 2001).
- ALFA beam: 3.3 x 3.7 (GUIDE) vs 3.3 x 3.8 (ALFALFA; RXT 3.8x3.3).
- Band edges GUIDE vs RXT: 430 0.425-0.435 vs 0.422-0.442; lbw 1.120-1.730 vs 1.15-1.73 (RXL also 1.15-1.73); cb 3.850-6.050 vs 3.85-6.00; xb 8.0-10.0 vs 7.8-10.2; sbn 2.240-2.430 vs S-narrow 2.33-2.43.
- Tracking time: GUIDE Table 2 agrees with the DERIVED rise-to-set geometry (za <= 19.7 deg) to within 1 minute except Dec +5 (GUIDE 2:18 vs DERIVED 1:59) and Dec +38 (0:07 vs 0:12; this row is sensitive to the exact za limit).
- Zenith-angle limit: 19.7 deg (GUIDE Table 1) vs "up to ~20 deg from the vertical" (GUIDE text) and "za limit of 20 deg" (HEILES).
- Ground screen height: 16 m (UPOV; GALFA) vs 50 ft = 15.24 m (COLLOQ).
- Surface accuracy: 2 mm rms (GUIDE 2017) vs 2.3 mm (EXPP, 1992 design).
- Edge taper: -7 dB primary power illumination (EXPP design) vs "geometric taper of about 9 db" (PHB); different definitions, not reconciled in the sources.
- Blockage: about 2% of the 1000-ft aperture, a 140-ft circle (EXPP design) vs 5% physical / 10% of effective area (HEILES sidelobe fit) vs 13% (HEILES HPBW-vs-wavelength fit).
- Vignetting at maximum za: EXPP "about 1.0 dB"; EXPP Table 2 at 1400 MHz 11 -> 9 K/Jy (ZA 15 -> 20) = -0.87 dB DERIVED; the DERIVED geometric model gives -0.67 dB at 19.7 deg.

## Notes

- JSON layout for the page: `site`, `dish_m`, `illuminated` (d_za_m 213.36 / d_az_m 236.52 = 700 / 776 ft; ns_m/ew_m at meridian transit, INFERRED; illumination function; vignetting model), `zenith_limit_deg`, `dec_range_deg`, `beam` (GUIDE Table 3 rows), `beam_alt`, `beam_relation`, `sidelobes`, `bands`, `rxt_2020_rows`, `tracking`, `status`; `params` holds every sourced record with quotes.
- Aperture geometry: x is along the azimuth arm, positive toward increasing za (= uphill on the dish); the aperture spans x = -397 to +303 ft about the paraxial ray and y = +-388 ft; the ellipse centre lies at x = -47 ft (EXPP). The paraxial ray is the line through the centre of curvature along the beam, so for za > 0 the illuminated patch shifts by R sin(za) across the dish, away from the source azimuth (geometry, DERIVED).
- Units: 1 ft = 0.3048 m; 700 ft = 213.36 m; 776 ft = 236.52 m; 47 ft = 14.33 m; 350 ft = 106.68 m.
- Collapse time 7:55 a.m. Atlantic Standard Time = 11:55 UTC (AST = UTC-4).
- The NSF releases are taken from Internet Archive captures made in December 2020; on 2026-10-20 the live news_summ.jsp URLs redirect to the general NSF news index. The NSFD capture was served gzip-encoded and is saved byte-for-byte as received (`.html.gz`). Archive digests (SHA-1, base32) of all saved captures match the CDX index.
- SHA-256: naic_astronomers_guide_2017.pdf 3e93f046...; naic_rxstatus_rcvrtabz_20200810.html 08fd4fb9...; naic_rxstatus_lwide_20200714.html f1525b24...; naic_phil_hpbw_vs_lambda_2004_20201205.html 7eee9e46...; naic_upgrade_expperfw_20041205.htm 052d6ceb...; naic_upgrade_overview_20040810.htm 9afb1d18...; arxiv_astro-ph_0107349v1_heiles2001_beam.pdf 2a89cb7f...; arxiv_astro-ph_0102085v1_burton2001_chvc.pdf 3fc3c874...; arxiv_astro-ph_0508301v1_giovanelli2005_alfalfa.pdf d6fce13c...; arxiv_0810.1283v1_peek_heiles2008_galfa.pdf 742327ff...; arxiv_astro-ph_0509815v1_osten_bastian2006.pdf b234ec04...; arxiv_2604.08775v1_ghosh_salter2026_colloquium.pdf 01430566...; nsf_news_301737_collapse_20201202.html d6900fc3...; nsf_news_301674_decommission_20201203.html.gz d89cf8ce....

## Machine check

155 quotes machine-checked against the saved files' extracted text: all pass; 122 table cells checked (GUIDE Table 3 beam and range cells, HEILES Table 1 frequency/HPBW/sidelobe cells, GUIDE Table 2 rows, and the RXT table re-parsed cell by cell from the saved HTML with comments removed): all match (2026-10-20). A negative test passes: seven probe quotes with one altered number each fail and two unaltered ones pass. Scripts kept outside the repository (/private/tmp/claude-501/-Users-cconroy-memos/604f8c8c-8c13-422b-815a-7d85a29a1a3e/scratchpad/arecibo_agent/check.py, with strip.py, build.py, md.py, analyze.py, negtest.py); check.py walks every src + quote pair in arecibo.json.
