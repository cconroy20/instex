/* Instrument presets for the Instrument Explorer.  Parameters come from the documents collected in
   rawdata/presets/ and tabulated, with page references and verbatim quotes, in
   data/presets_research.md (Via: ~/via/docs/technical/technical.tex and
   ~/via/docs/requirements/science_requirements.tex).  "pub" lists the published performance each
   preset is checked against in validate.js:
     q: R (effective, at the central wavelength), RAt (at lam, A), dlpix / dlpixAt (A per pixel; at
        lam and order m), pixScale (arcsec per pixel), npix (pixels per resolution element), lo, hi,
        span (coverage, A), mLo, mHi (echelle orders), gap (first coverage gap, A), minSepPx,
        minSepArcsec (smallest order spacing);
     tol: relative tolerance, set from the precision of the source before the comparison was run.
   Mapping choices (see README, "Presets"):
   - Keck: D = 10.95 m at f/13.7 (O95: the 11 m outer perimeter gives f/13.7 for the 150 m focal
     length), W = f_col / 13.7, so that f_tel = 150 m and the sourced collimator set the slit angle.
   - MIKE: the injection optics turn f/11 into f/3.3 (red) and f/3.6 (blue); F = f_col / W.
   - Fiber-fed HARPS and DESI: the slit of equal line width, phi_eq = (sqrt 3 / 2) x core diameter.
   - HARPS and DESI: F is the spectrograph's own focal ratio (fiber-fed), so f_col comes out right.
   - Collimator type (col), from the sources: mirror for LRIS (off-axis parabola, O95), HIRES (spherical
     mirrors, HIRES manual), HARPS (Zerodur parabola, user manual), DESI (spherical Schmidt mirror, FDR)
     and Via (800 mm spherical mirror, technical document), DEIMOS (concave conic mirror, CDR 1995) and
     X-Shooter (Maksutov-type mirror + corrector, Vernet et al. 2011); lens for MIKE (one set of large
     lenses used in double pass as collimator and camera, Bernstein et al. 2015), Binospec (three lens
     groups, Fabricant et al. 2019) and Boombox (refractive triplet).  It changes only the drawing.
   - DEIMOS and Binospec gratings are plane REFLECTION gratings (Binospec's are not VPH).
   - traceW (arcsec): the width of a trace ACROSS the dispersion when it differs from the slit width --
     Via's 0.7" mask narrows only the dispersion direction; across it each trace is the 1.2" fiber image,
     entered as (sqrt 3 / 2) x 1.2" = 1.04" like the other fibers.
   - Number of objects (nObj) counts every spectrum on the detector -- science, sky, fiducial and calibration
     fibers: DESI 500 fibers per spectrograph (DESI 2022), Viaspec 660 ("Number of Fibers (incl. calibration)":
     540 positioned + 60 fixed fiducial/sky + Th-Ar calibration; Via technical document) and Boombox 36 (same
     table), HARPS 2 (fibres A and B: object and sky or reference; user manual), G-CLEF MR 3 (1 science +
     2 sky/calibration, Szentgyorgyi et al. 2016 Table 3),
     HIRES, MIKE and X-Shooter 1 (single slit); slit masks, an average per mask: DEIMOS 129 (DEEP2, Newman
     et al. 2013: 128.9 over all fields, DERIVED in round 3), LRIS 30 (25-35 "typically" in the z~3 survey
     papers, Steidel et al. 2003, Cooke et al. 2005); Binospec 150 is a CAPACITY (">150 slitlets per mask
     side"), no average was found; Hectospec 300 and Hectochelle 240 fibers (Fabricant et al. 2005;
     Szentgyorgyi et al. 2011).
   - X-Shooter: collimator and camera focal lengths are not published; the effective camera focal lengths
     (270 / 280 / 177 mm) come from the published camera plate scales and beams, the UVB/VIS collimators
     from the slit plate scales; the NIR prisms use the cryogenic (105 K) glass indices. */
(function (root) {
"use strict";
const S3 = Math.sqrt(3) / 2;
const PRESETS = [
  {
    id: "lris", tel: "Keck 10 m", name: "Keck / LRIS red, 600/7500, 1″",
    note: "Keck I LRIS red channel (Oke et al. 1995; Keck grating table): f_col 2000 mm, camera 305 mm, 44° camera–collimator angle, 600/7500 grating, 4k × 4k 15 µm.",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 1, nObj: 30, col: "mirror", W: 2000 / 13.7, fcam: 305, gType: "refl", G: 600, m: 1, lamB1: 7500, lamC: 7500, psi: 44, tAlpha: null, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "dispersion 0.80 Å/px", q: "dlpix", value: 0.80, tol: 0.05, src: "Keck LRIS grating table" },
      { what: "coverage 3275 Å", q: "span", value: 3275, tol: 0.05, src: "Keck LRIS grating table" },
      { what: "R = 7500/4.7 Å FWHM (1″)", q: "R", value: 7500 / 4.7, tol: 0.10, src: "Keck LRIS grating table" },
      { what: "pixel scale 0.135″/px", q: "pixScale", value: 0.135, tol: 0.05, src: "Keck LRIS detectors page" },
    ],
  },
  {
    id: "hires", tel: "Keck 10 m", name: "Keck / HIRES red XD, 0.861″",
    note: "Keck I HIRES with the red cross-disperser (Vogt et al. 1994; HIRES manual 1994; Keck pages): R2.8 echelle 52.68 /mm at 70.5°, in plane with 2θ = 10°, 250 /mm cross-disperser turning 40°, f_col 4155 mm, camera 763 mm, 3-chip 15 µm mosaic (gaps not modeled). Central wavelength chosen, not sourced.",
    state: { mode: "echelle", D: 10.95, F: 13.7,
      e: { slitW: 0.861, nObj: 1, col: "mirror", W: 4154.7 / 13.7, fcam: 762.7, eG: 52.68, eDelta: 70.5, gamma: 0, theta: 5, xd: "grating", xG: 250, xPsi: 40,
           xGlass: "silica", xA: 40, xPasses: 1, lamC: 6000, Nx: 4096, Ny: 6144, pix: 15 } },
    pub: [
      { what: "R (calculated) 48,000 at 0.861″", q: "R", value: 48000, tol: 0.05, src: "Keck HIRES slit table (measured: 50,000)" },
      { what: "spatial scale about 0.12″/px", q: "pixScale", value: 0.12, tol: 0.10, src: "Keck HIRES binning page" },
      { what: "1.67 Å/mm in order 62 at 5748 Å (x 15 µm)", q: "dlpixAt", lam: 5748.2, m: 62, value: 1.67 * 0.015, tol: 0.03, src: "HIRES manual App. E" },
      { what: "orders outgrow the detector above ~6000 Å", q: "gap", value: 6000, tol: 0.10, src: "HIRES CCD upgrade notes" },
    ],
  },
  {
    id: "mikered", tel: "Magellan 6.5 m", name: "Magellan / MIKE red, 1″",
    note: "Magellan Clay MIKE red arm (Bernstein et al. 2003 manuscript; LCO manual): R2 echelle 52.6 /mm at 63.5°, quasi-Littrow (angles not published: 0 here), double-pass 500 mm camera/collimator at f/3.3, one 47° PBM2 prism in double pass, 2k × 4k 15 µm. Central wavelength = middle of the LCO standard setting (the prism angle is not published, so where the orders fall is not either).",
    state: { mode: "echelle", D: 6.5, F: 500 / 150,
      e: { slitW: 1, nObj: 1, col: "lens", W: 150, fcam: 500, eG: 52.6, eDelta: 63.5, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10,
           xGlass: "PBM2Y", xA: 47, xPasses: 2, lamC: 6750, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R 19,000 at 1″ (design)", q: "R", value: 19000, tol: 0.08, src: "Bernstein et al. 2003 (LCO manual: 22,000)" },
      { what: "1″ = 105 µm at the CCD", q: "pixScale", value: 15 / 105, tol: 0.08, src: "Bernstein et al. 2003" },
      { what: "orders 31-69 fill the 30.7 mm chip across the dispersion", q: "ySpan", m1: 31, m2: 69, value: 2048 * 0.015, tol: 0.10, src: "Bernstein et al. 2003 example setting (orders 31-69 on the chip)" },
      { what: "minimum order separation 6″ (orders 31-69)", q: "minSepArcsec", m1: 31, m2: 69, value: 6, tol: 0.15, src: "Bernstein et al. 2003" },
    ],
  },
  {
    id: "mikeblue", tel: "Magellan 6.5 m", name: "Magellan / MIKE blue, 1″",
    note: "Magellan Clay MIKE blue arm (Bernstein et al. 2003 manuscript): R2.6 echelle 52.7 /mm at 69.0°, quasi-Littrow (angles not published: 0 here), double-pass 550 mm camera/collimator, two 38° fused-silica prisms in double pass (four prism passes, each at minimum deviation: the prism angles are not published), 2k × 4k 15 µm. Central wavelength = middle of the LCO standard setting.",
    state: { mode: "echelle", D: 6.5, F: 550 / 150,
      e: { slitW: 1, nObj: 1, col: "lens", W: 150, fcam: 550, eG: 52.7, eDelta: 69.0, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10,
           xGlass: "silica", xA: 38, xPasses: 4, lamC: 4100, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R 25,000 at 1″ (design)", q: "R", value: 25000, tol: 0.08, src: "Bernstein et al. 2003 (LCO manual: 28,000)" },
      { what: "1″ = 115 µm at the CCD", q: "pixScale", value: 15 / 115, tol: 0.08, src: "Bernstein et al. 2003" },
      { what: "orders 74-107 span 29 mm across the dispersion", q: "ySpan", m1: 74, m2: 107, value: 29, tol: 0.05, src: "Bernstein et al. 2003" },
      { what: "minimum order separation 6″ (orders 74-107)", q: "minSepArcsec", m1: 74, m2: 107, value: 6, tol: 0.15, src: "Bernstein et al. 2003" },
    ],
  },
  {
    id: "deimos", tel: "Keck 10 m", name: "Keck / DEIMOS, 1200G, 0.75″",
    note: "Keck II DEIMOS (Keck DEIMOS pages; Faber's 1995 grating table): collimator mirror 86.50 in, beam 6.33 in (f/13.67 on the 10.95 m primary), camera 15.00 in, fixed camera–collimator angle 44.451°, 1200G at λc = 8000 Å (blaze 7500 Å, the value consistent with the listed 26.7° blaze angle), 8192 × 8192 mosaic of 15 µm pixels (CCD gaps not modeled).",
    state: { mode: "grating", D: 10.95, F: 86.50 / 6.33,
      g: { slitW: 0.75, nObj: 129, col: "mirror", W: 6.33 * 25.4, fcam: 15.00 * 25.4, gType: "refl", G: 1200, m: 1, lamB1: 7500, lamC: 8000, psi: 44.451, tAlpha: null,
           Nx: 8192, Ny: 8192, pix: 15 } },
    pub: [
      { what: "0.324 Å/px", q: "dlpix", value: 0.324, tol: 0.02, src: "Faber 1995 grating table, 1200 l/mm at 8000 Å" },
      { what: "coverage from 6673 Å", q: "lo", value: 6673.0, tol: 0.01, src: "Faber 1995 grating table" },
      { what: "coverage to 9294 Å", q: "hi", value: 9293.8, tol: 0.01, src: "Faber 1995 grating table" },
      { what: "aberration-free slit FWHM 1.23 Å (R = 6500)", q: "Rs", value: 8000 / 1.23, tol: 0.03, src: "Faber 1995 grating table, raw FWHM" },
      { what: "slit image 3.79 px", q: "npix", value: 3.79, tol: 0.03, src: "Faber 1995 grating table, raw FWHM" },
      { what: "0.1185″/px", q: "pixScale", value: 0.1185, tol: 0.03, src: "Keck DEIMOS specifications (0.119 elsewhere)" },
      { what: "R with aberrations, 8000/1.35 Å", q: "R", value: 8000 / 1.35, info: true, src: "Faber 1995 grating table, effective FWHM (the model has no aberrations)" },
    ],
  },
  {
    id: "binospec", tel: "MMT 6.5 m", name: "MMT / Binospec, 600 l/mm, 1″",
    note: "MMT Binospec (Fabricant et al. 2019; MMTO grating table): f/5.3 input, refractive collimator 1097 mm (beam 207 mm), refractive camera 404 mm, fixed 45° camera–collimator angle, 600 l/mm plane REFLECTION grating (blaze 16.0°) at 36.1° incidence (λc derived from it), e2v CCD231-84 4096 × 4112 15 µm.",
    state: { mode: "grating", D: 6.5, F: 5.3,
      g: { slitW: 1, nObj: 150, col: "lens", W: 1097 / 5.3, fcam: 404, gType: "refl", G: 600, m: 1, lamB1: 2 * Math.sin(16.0 * Math.PI / 180) / 600 * 1e7,
           lamC: (Math.sin(36.1 * Math.PI / 180) + Math.sin((36.1 - 45) * Math.PI / 180)) / 600 * 1e7, psi: 45, tAlpha: null, Nx: 4096, Ny: 4112, pix: 15 } },
    pub: [
      { what: "0.61 Å/px", q: "dlpix", value: 0.61, tol: 0.03, src: "MMTO grating table" },
      { what: "coverage from 6000 Å", q: "lo", value: 6000, tol: 0.02, src: "MMTO grating table" },
      { what: "coverage to 8480 Å", q: "hi", value: 8480, tol: 0.02, src: "MMTO grating table" },
      { what: "1″ slit = 3.32 px", q: "npix", value: 3.32, tol: 0.03, src: "MMTO grating table" },
      { what: "R 3590 (1″)", q: "Rs", value: 3590, tol: 0.05, src: "MMTO grating table" },
      { what: "0.24″/px", q: "pixScale", value: 0.24, tol: 0.03, src: "Fabricant et al. 2019; MMTO" },
      { what: "R 4200 measured at Hα (1″ longslit)", q: "RAt", lam: 6563, value: 4200, info: true, src: "Fabricant et al. 2025 (vs ~3240 implied by the table)" },
    ],
  },
  {
    id: "hectospec", tel: "MMT 6.5 m", name: "MMT / Hectospec, 270 gpm, Hα",
    note: "MMT Hectospec (Fabricant et al. 2005; Hectospec manuals): 250 µm (1.5″) fibers at f/5.3 entered as the slit of equal line width (1.30″), spherical collimator mirror, 259 mm beam, catadioptric camera 397 mm, fixed 35° camera–collimator angle, 270 gpm reflection grating (blaze 5200 Å) set up at Hα (α = 22.83°, β = −12.17°), two E2V 42-90 CCDs 4608 × 2048 of 13.5 µm (4608 along the dispersion), 300 fibers. Decommissioned in 2026.",
    state: { mode: "grating", D: 6.5, F: 5.3,
      g: { slitW: S3 * 1.5, nObj: 300, col: "mirror", W: 259, fcam: 397, gType: "refl", G: 270, m: 1, lamB1: 5200, lamC: 6563, psi: 35, tAlpha: null,
           Nx: 4608, Ny: 4096, pix: 13.5 } },
    pub: [
      { what: "1.21 Å/px", q: "dlpix", value: 1.21, tol: 0.03, src: "Hectospec observers manual (F05: 1.2)" },
      { what: "coverage 5770 Å", q: "span", value: 5770, tol: 0.05, src: "Hectospec observers manual" },
      { what: "fiber image 5.1 px along the dispersion (5.4 × 5.1 ellipse)", q: "diam", value: 5.1, tol: 0.05, src: "Fabricant et al. 2005, perfect optics" },
      { what: "reduction 3.45: 0.2795″/px (13.5 µm × 6″/mm × 3.45)", q: "pixScale", value: 0.0135 * 6 * 3.45, tol: 0.03, src: "Fabricant et al. 2005" },
      { what: "R = 6563/6.2 Å FWHM (with aberrations)", q: "R", value: 6563 / 6.2, info: true, src: "Fabricant et al. 2005" },
      { what: "fiber images 10.2 px apart (the model spreads 300 over the chip)", q: "gapPx", value: 10.2, info: true, src: "Hectospec hardware manual" },
    ],
  },
  {
    id: "hectochelle", tel: "MMT 6.5 m", name: "MMT / Hectochelle, RV31",
    note: "MMT Hectochelle (Szentgyorgyi et al. 2011; observers guide 2023): 250 µm (1.5″) fibers at f/5.4 entered as the slit of equal line width (1.30″), spherical Schmidt collimator, 254 mm beam, catadioptric camera 25.3 in (642.6 mm, observers guide; the paper's 0.49 reduction implies 670.6 mm), 110 /mm R2 echelle (64.5°) used in ONE order selected by an interference filter: order 31 with the RV31 filter (5230 Å), 15° between the beams (α 72°, β 57°), two E2V 42-90 CCDs 4608 × 2048 of 13.5 µm, 240 fibers. Decommissioned in 2026.",
    state: { mode: "grating", D: 6.5, F: 5.4,
      g: { slitW: S3 * 1.5, nObj: 240, col: "mirror", W: 254, fcam: 25.3 * 25.4, gType: "refl", G: 110, m: 31, lamB1: 2 * Math.sin(64.5 * Math.PI / 180) / 110 * 1e7, lamC: 5230, psi: 15, tAlpha: null,
           Nx: 4608, Ny: 4096, pix: 13.5 } },
    pub: [
      { what: "nominal R 32,000 at 5200 Å, from the fiber-image diameter", q: "Rdiam", value: 32000, tol: 0.08, src: "Szentgyorgyi et al. 2011" },
      { what: "~150 Å per order", q: "span", value: 150, tol: 0.10, src: "Szentgyorgyi et al. 2011" },
      { what: "fiber image 69 µm = 5.1 px along the dispersion", q: "diam", value: 5.1, tol: 0.05, src: "Szentgyorgyi et al. 2011 (124 × 69 µm ellipse)" },
      { what: "R 38,000 typical (measured)", q: "R", value: 38000, info: true, src: "Szentgyorgyi et al. 2011" },
      { what: "α 72°, β 57° at the order center", q: "alphaDeg", value: 72, tol: 0.01, src: "Szentgyorgyi et al. 2011" },
      { what: "0.04 Å/px", q: "dlpix", value: 0.04, info: true, src: "MMTO table (one figure; 642.6 mm gives 0.0336)" },
    ],
  },
  {
    id: "gclef", tel: "GMT 25.4 m", name: "GMT / G-CLEF red, MR mode (design)",
    note: "G-CLEF, the 2016-2018 design (Ben-Ami et al. 2016, 2018; Szentgyorgyi et al. 2016, 2018), red arm, MR mode: one 300 µm science fiber (with 2 sky/calibration fibers), 0.8″ at the f/8 slit, entered as the slit of equal line width (0.69″); off-axis-parabola collimator 2400 mm, 300 mm beam, R4 echelle 31.6 /mm (75.96°) in Littrow, 0.75° out of plane, red VPH cross-disperser 480 /mm (first order, optimised at 7300 Å), effective camera 675 mm (450 mm on the 200 mm transferred beam, derived). White pupil: the cross-disperser sits in the 200 mm beam and is imaged by the 450 mm camera, which the model (one 675 mm camera) reproduces by entering the VPH as 480 × 450/675 = 320 /mm, the same order spacing. e2v detector 92.4 × 92.2 mm of 10 µm. Not built yet; the design has changed since.",
    state: { mode: "echelle", D: 25.4, F: 8,
      e: { slitW: S3 * 0.8, nObj: 3, col: "mirror", W: 300, fcam: 675, eG: 31.6, eDelta: 75.96, gamma: 0.75, theta: 0, xd: "vph", xG: 480 * 450 / 675, xPsi: 10,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 7300, Nx: 9240, Ny: 9220, pix: 10 } },
    pub: [
      { what: "reddest order 65", q: "mLo", value: 65, tol: 0.03, src: "Ben-Ami et al. 2016 Table 1 (orders 65-175)" },
      { what: "minimum inter-order EDGE gap 210 µm in the PRV format (8 fibers per order, 120 µm apart): center spacing here", q: "minSepPx", m1: 65, m2: 114, value: 21, info: true, src: "Ben-Ami et al. 2016" },
      { what: "R 35,000 (MR)", q: "R", value: 35000, info: true, src: "Ben-Ami et al. 2016 Table 2 (published R imply a line FWHM ~0.67 of the fiber image)" },
    ],
  },
  ...[
    ["uvb", "UVB", 8.2, 206264.8 / 3.91 / 8200, 100, 270, 180, 41.77, 2.2, { xGlass: "silica", xA: 60, xPasses: 2, xPrisms: null }, 4145, 3000, 1800, 15, 1.0,
      5400, 6.2, 0.164, 12, 18, 390.6, 428.9, "one 60° fused-silica prism in double pass"],
    ["vis", "VIS", 8.2, 206264.8 / 3.82 / 8200, 100, 280, 99.4, 54.0, 2.0, { xGlass: "SF6", xA: 49, xPasses: 2, xPrisms: null }, 7112, 4096, 2048, 15, 0.9,
      8900, 5.7, 0.154, 15, 23, 675.4, 730.7, "one 49° SCHOTT SF6 prism in double pass"],
    ["nir", "NIR", 8.2, 6.5, 85, 177, 55, 46.07, 1.8, { xGlass: "ZnSe-105K", xA: 22, xPasses: 2,
      xPrisms: [{ glass: "Infrasil-105K", A: 35 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "Infrasil-105K", A: 35 }] },
      14528, 2048, 1024, 18, 0.9, 5600, 3.6, 0.245, 16, 18, 1400.8, 1511.5, "a 35° Infrasil and two 22° ZnSe prisms in double pass, at 105 K"],
  ].map(([id, arm, D, F, W, fc, eG, dl, gam, xd, lc, Nx, Ny, pix, slit, R, npx, ps, nOrd, mT, oLo, oHi, xdTxt]) => ({
    id: "xsh" + id, tel: "VLT 8.2 m", name: `VLT / X-Shooter ${arm}, ${slit.toFixed(1)}″`,
    note: `X-Shooter ${arm} arm (Vernet et al. 2011; ESO user manual): echelle ${eG} /mm at ${dl}°, in-plane offset 0, ${gam}° out of plane; ${xdTxt}; ${W} mm beam; mirror (Maksutov-type) collimator; camera f/${fc === 177 ? "2.1" : fc === 280 ? "2.8" : "2.7"} (effective focal length ${fc} mm, derived from the published plate scale and beam); detector area used ${Nx} × ${Ny} px of ${pix} µm.` +
      (id === "nir" ? " The NIR slit focal ratio is not published: f/6.5 assumed (it changes only the drawing)." : ` Slit focal ratio f/${F.toFixed(2)} from the published slit plate scale.`) + " Central wavelength: the blaze of the middle order.",
    state: { mode: "echelle", D, F,
      e: Object.assign({ slitW: slit, nObj: 1, col: "mirror", W, fcam: fc, eG, eDelta: dl, gamma: gam, theta: 0, xd: "prism", xG: 300, xPsi: 10, lamC: lc, Nx, Ny, pix }, xd) },
    pub: [
      { what: `R × sampling = ${R} × ${npx} (the dispersion)`, q: "Rnpix", value: R * npx, tol: 0.05, src: "ESO X-Shooter user manual Table 13" },
      ...(id !== "nir" ? [{ what: `order ${mT} spans ${(oHi - oLo).toFixed(1)} nm on the detector`, q: "ordSpan", m: mT, value: (oHi - oLo) * 10, tol: 0.05, src: "Vernet et al. 2011 Table 3" }] : []),
      ...(id === "nir" ? [{ what: `${nOrd} orders on the detector`, q: "nOrders", value: nOrd, tol: 0.10, src: "Vernet et al. 2011 Table 3" }] : []),
      { what: `R ${R} (${slit.toFixed(1)}″): the model's slit image is ~17% wider in every arm`, q: "R", value: R, info: true, src: "ESO X-Shooter user manual Table 13" },
      { what: `${npx} px per FWHM`, q: "npix", value: npx, info: true, src: "ESO X-Shooter user manual Table 13" },
      { what: `${ps}″/px along the slit (projected; prism anamorphism)`, q: "pixScale", value: ps, info: true, src: "ESO X-Shooter user manual Sec. 2.3.1" },
      ...(id !== "nir" ? [{ what: `${nOrd} orders (limited by the dichroic crossovers, not modeled)`, q: "nOrders", value: nOrd, info: true, src: "Vernet et al. 2011 Table 3" }] : []),
      ...(id === "nir" ? [{ what: `order ${mT} recorded over ${(oHi - oLo).toFixed(1)} nm`, q: "ordSpan", m: mT, value: (oHi - oLo) * 10, info: true, src: "Vernet et al. 2011 Table 3 (shorter than the dispersion x 2048 px implies)" }] : []),
    ],
  })),
  {
    id: "harps", tel: "ESO 3.6 m", name: "ESO 3.6 m / HARPS",
    note: "HARPS (User Manual 2.4): fiber-fed, 1″ (70 µm) fibers entered as the slit of equal line width, 0.87″; R4 echelle 31.6 /mm at 75°, 0.721° out of plane, f_col 1560 mm (208 mm beam, f/7.5), FK5 grism 257.17 /mm (apex not published: set so the central wavelength passes undeviated), camera 728 mm, 4k × 4k 15 µm (chip gap not modeled). Central wavelength: order 115, which the manual places in the gap at the center of the mosaic.",
    state: { mode: "echelle", D: 3.566, F: 7.5,
      e: { slitW: S3 * 1.0, nObj: 2, col: "mirror", W: 208, fcam: 728, eG: 31.6, eDelta: 75, gamma: 0.721, theta: 0, xd: "grism", xG: 257.17, xPsi: 10,
           xGlass: "FK5HTi", xA: 40, xPasses: 1, lamC: 5316, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "R = 536.97 nm / (3.4 px x 0.0015 nm) = 105,000", q: "RAt", lam: 5369.7, value: 5369.7 / (3.4 * 0.015), tol: 0.08, src: "HARPS manual: its sampling x dispersion" },
      { what: "R 115,000 (measured)", q: "R", value: 115000, info: true, src: "HARPS manual (ESO web page: 120,000)" },
      { what: "3.4 px per FWHM", q: "npix", value: 3.4, tol: 0.10, src: "HARPS manual (other sources 3.2-4.1)" },
      { what: "coverage from 3800 Å", q: "lo", value: 3800, tol: 0.03, src: "HARPS manual" },
      { what: "coverage to 6900 Å", q: "hi", value: 6900, tol: 0.03, src: "HARPS manual" },
      { what: "orders from 89", q: "mLo", value: 89, tol: 0.03, src: "HARPS manual" },
      { what: "orders to 161", q: "mHi", value: 161, tol: 0.03, src: "HARPS manual" },
      { what: "0.0015 nm/px in order 114 (536.97 nm)", q: "dlpixAt", lam: 5369.7, m: 114, value: 0.015, tol: 0.10, src: "HARPS manual Fig. 2.3" },
      { what: "order 161 to 160 separation 34.2 px", q: "minSepPx", value: 34.2, tol: 0.15, src: "HARPS manual" },
    ],
  },
  ...[["B", 1103.5, 11.48, 212.8, 3600, 5930, 2000, 3000], ["R", 1157.4, 18.73, 213.6, 5660, 7720, 3500, 4500], ["Z", 992.5, 21.19, 214.0, 7470, 9800, 4000, 5500]]
    .map(([arm, G, al, fc, l0, l1, r0, r1]) => ({
      id: "desi" + arm.toLowerCase(), tel: "Mayall 4 m (DESI)", name: `DESI ${arm} arm`,
      note: `DESI ${arm} arm (DESI Collaboration 2022; Final Design Report): fiber-fed, 107 µm core (1.63″ at the f/3.57 collimator) entered as the slit of equal line width, 1.41″; f/3.57 collimator with a 126 mm pupil, transmission grating ${G} /mm at ${al}° incidence (as built), ${fc} mm f/1.7 camera, 4k × 4k 15 µm. Central wavelength = middle of the arm's band.`,
      state: { mode: "grating", D: 3.797, F: 3.57,
        g: { slitW: S3 * 0.107 / (3.57 * 3797) * 206264.806, nObj: 500, col: "mirror", W: 126, fcam: fc, gType: "trans", G, m: 1, lamB1: 5000, lamC: (l0 + l1) / 2,
             psi: 35, tAlpha: al, Nx: 4096, Ny: 4096, pix: 15 } },
      pub: [
        { what: `R ≈ ${r0} at ${l0} Å`, q: "RAt", lam: l0, value: r0, tol: 0.15, src: "DESI 2022 (\"approximately\")" },
        { what: `R ≈ ${r1} at ${l1} Å`, q: "RAt", lam: l1, value: r1, tol: 0.15, src: "DESI 2022 (\"approximately\")" },
        { what: "fiber image 107 µm x 0.48 = 3.42 px (spatial magnification; the spectral image is wider by cos α / cos β)", q: "diam", value: 107 * 0.48 / 15, info: true, src: "DESI 2022 Sec. 7.2" },
        { what: `band from ${l0} Å on the chip`, q: "lo", value: l0, tol: 0.03, src: "DESI FDR" },
        { what: `band to ${l1} Å on the chip`, q: "hi", value: l1, tol: 0.03, src: "DESI FDR" },
      ],
    })),
  ...[["blue", 2101, 4848, 3600, 5900], ["red", 1157, 8011, 5700, 10000]].map(([arm, G, lc, l0, l1]) => ({
    id: "boombox" + arm[0], tel: "Via (MMT and Magellan 6.5 m)", name: `Via / Boombox ${arm} (partly guessed)`,
    note: `Boombox ${arm} channel (Via technical document): 6.5 m, 200 µm (1.2″) unmasked fibers entered as the slit of equal line width (1.04″), refractive-triplet collimator, binary transmission grating, f/1.5 camera, 2048 × 256 CCD with 15 µm pixels, band ${l0}-${l1} Å. GUESSED (the prescription is not in the document): fiber output f/5.3 as for Viaspec, a 35 mm beam shared by both channels, and the groove density (${G} /mm) and central wavelength solved so the band exactly fills the 2048 pixels. Coverage therefore matches by construction; R and sampling follow from the documented fiber, camera and pixels whatever the guess.`,
    state: { mode: "grating", D: 6.5, F: 5.3,
      g: { slitW: S3 * 0.2 / (5.3 * 6500) * 206264.806, nObj: 36, col: "lens", W: 35, fcam: 1.5 * 35, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
           psi: 35, tAlpha: null, Nx: 2048, Ny: 256, pix: 15 } },
    pub: [
      { what: "R ≈ 1000", q: "R", value: 1000, info: true, src: "Via technical document" },
      { what: `band ${l0} Å (guessed grating solved to fit)`, q: "lo", value: l0, info: true, src: "Via technical document" },
      { what: `band ${l1} Å (guessed grating solved to fit)`, q: "hi", value: l1, info: true, src: "Via technical document" },
    ],
  })),
  {
    id: "via", tel: "Via (MMT and Magellan 6.5 m)", name: "Via / Viaspec, 0.7″ mask",
    note: "Viaspec (Via technical document): 6.5 m at f/5.3, 660 fibers into the spectrograph (540 positioned, 60 fixed fiducial/sky, Th-Ar calibration), 200 µm (1.2″) behind the adopted 0.7″ slit mask, 254 mm beam (f/5.3 collimator), 2000 /mm binary transmission grating designed for 550 nm (used here at the symmetric setting), f/1.62 camera (focal length 1.62 × 254 mm), 9k × 9k 10 µm CCD.",
    state: { mode: "grating", D: 6.5, F: 5.3,
      g: { slitW: 0.7, traceW: S3 * 1.2, nObj: 660, col: "mirror", W: 254, fcam: 1.62 * 254, gType: "trans", G: 2000, m: 1, lamB1: 5500, lamC: 5500, psi: 35, tAlpha: null, Nx: 9216, Ny: 9216, pix: 10 } },
    pub: [
      { what: "R ≈ 15,000", q: "R", value: 15000, tol: 0.08, src: "Via technical document" },
      { what: "5.5 km/s per pixel", q: "dlpix", value: 5500 * 5.5 / 299792.458, tol: 0.05, src: "Via technical document" },
      { what: "coverage from 5050 Å", q: "lo", value: 5050, tol: 0.02, src: "Via technical document" },
      { what: "coverage to 5950 Å", q: "hi", value: 5950, tol: 0.02, src: "Via technical document" },
    ],
  },
];
root.IX_PRESETS = PRESETS;
if (typeof module !== "undefined" && module.exports) module.exports = PRESETS;
})(typeof window !== "undefined" ? window : globalThis);
