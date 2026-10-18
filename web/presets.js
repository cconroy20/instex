/* Instrument presets for the Instrument Explorer.  Parameters come from the documents collected in
   rawdata/presets/ and tabulated, with page references and verbatim quotes, in data/presets_research.md,
   data/round4/*.md and data/round5/*.md (Via: ~/via/docs/technical/technical.tex and
   ~/via/docs/requirements/science_requirements.tex).  Each preset has an id, a telescope group (tel), a
   menu name ("Telescope / Instrument ..."; the menu drops the part before the slash), a note on where the
   numbers come from, the explorer state, and "pub": the published performance validate.js checks.
   pub entries: { what, q, value, tol, src } or { ..., info: true }.
     q (what the model returns):
       R          effective resolving power at the central wavelength (slit, diffraction and pixel in quadrature);
                  a MEASURED lambda / FWHM compares with R
       Rs         slit-limited resolving power, lambda / slit-image FWHM; geometric or "R x slit" figures compare with Rs
       RAt        effective R at lam (A), in the order that holds lam
       Rdiam      R from the full width of a round fiber image (Rs x sqrt 3 / 2)
       Rnpix      R x sampling = lambda / (A per pixel) at the central wavelength (the dispersion; = Rs x npix)
       dlpix, dlpixAt   A per pixel at the central wavelength; at lam (A) in order m
       kmspx      km/s per pixel at the central wavelength
       pixScale, pixScaleAt   arcsec per pixel along the slit at the central wavelength; at lam in order m
       specScale  arcsec per pixel along the dispersion (slit width / slit-image width in pixels)
       npix       pixels per slit-image FWHM;  diam: the round fiber image's full width in pixels (npix / (sqrt 3 / 2))
       lo, hi, span   coverage edges and width (A);  lam0: a grism's undeviated wavelength (A)
       mLo, mHi, nOrders   reddest and bluest echelle orders on the chip, and their number
       ordSpan    wavelength range of order m on the chip (A);  ySpan: distance across the dispersion between the
                  centers of orders m1 and m2 (mm)
       gap        start of the first coverage gap (A);  gapPx: spacing of the nObj spectra across the chip (px)
       minSepPx, minSepArcsec   smallest spacing of adjacent order centers (px; arcsec of slit), within orders m1-m2
                  when given;  alphaDeg: grating incidence angle (deg)
     tol: relative tolerance, set from the precision of the source before the comparison was run.  A miss is
     reported as an info line with its explanation, never tuned away.  info: true marks a reference line that
     is printed but not scored: circular (the state was derived from the same number), a duplicate of a scored
     line, a different quantity from the model's, a range, or a miss.
   Mapping rules (see README, "Presets"):
   - Telescope pupil D and focal ratio F set the slit's angular size; R depends on W / (phi D) and f_col = F x W.
     Keck: D = 10.95 m at f/13.7 (O95: the 11 m outer perimeter gives f/13.7 for the 150 m focal length),
     W = f_col / 13.7.  VLT pupils from VLT-SPE-ESO-10000-2723 (Tables 2-3): Nasmyth 8000 mm at f/15 (UVES, MUSE),
     Cassegrain 8115.0 mm at f/13.41 (FORS2, X-Shooter; F set so the published plate scale is kept); ESPRESSO
     keeps 8.2 m (no source gives the effective aperture of ESPRESSO's coudé feed).  MIKE: the injection optics turn
     f/11 into f/3.3 (red) and f/3.6 (blue); F = f_col / W.
   - Slits enter as their width; fibers as the slit of equal line width, phi_eq = (sqrt 3 / 2) x core angle.
     The core angle follows one of two conventions.  On-sky: the published angle with the spectrograph's own F
     (HARPS 1.0", G-CLEF 0.8", Hectospec 1.5", ESPRESSO 1.0" with its equivalent F, FEROS's sliced 1.0", Via
     1.2").  Virtual: core / (F_out x D), with F_out the focal ratio the fiber delivers to (or the collimator
     accepts from) the spectrograph, so that the collimator sees the right slit width and f_col = F x W
     (Hectochelle f/5.4, DESI f/3.57, APOGEE f/3.85, PFS f/2.8, 4MOST f/3.0, LLAMAS f/4.0, Boombox f/5.3
     guessed); this angle differs from the published on-sky size where F_out differs from the feed's ratio.
     traceW (arcsec): the width of a trace ACROSS the dispersion when it differs from the slit width (Via's
     0.7" mask narrows only the dispersion direction; across it each trace is the 1.2" fiber, entered as 1.04").
   - Collimator type (col) changes only the drawing: mirror for LRIS, HIRES, MagE, FIRE, LLAMAS, ESI, KCWI/KCRM,
     DEIMOS, Hectospec, Hectochelle, G-CLEF, ESPRESSO, UVES, X-Shooter, FEROS, HARPS, 4MOST, PFS, APOGEE, DESI and
     Via; lens for MIKE (one lens group in double pass as collimator and camera), IMACS, LDSS-3, MOSFIRE,
     Binospec, FORS2, MUSE and Boombox.  DEIMOS and Binospec gratings are plane REFLECTION gratings.
   - Number of objects (nObj) counts every spectrum on the detector: single-object slits 1 (HIRES, MIKE, MagE,
     FIRE, ESI, UVES, X-Shooter); fiber spectrographs all fibers on the slit, science, sky and calibration
     (HARPS 2, FEROS 2, ESPRESSO 4 = 2 fibers x 2 pupil slices, G-CLEF MR 3, Boombox 36, Hectochelle 240,
     APOGEE 300, Hectospec 300, LLAMAS 300 per detector, DESI 500, PFS 616, Via 660, 4MOST 824); IFUs the spaxels
     per detector (KCWI/KCRM 3330, MUSE 3600); slit masks an average per mask from published masks or surveys
     (LDSS-3 17, MOSFIRE 28, LRIS 30, FORS2 50, IMACS 51, DEIMOS 129) or, where no average was found, a capacity
     (Binospec 150).  The LRIS preset itself uses a long slit; its nObj is the mask average.
   - X-Shooter: collimator and camera focal lengths are not published; the effective ones come from the
     published slit and camera plate scales on the 8115 mm Cassegrain pupil and the published beams; the NIR
     prisms use the cryogenic (105 K) glass indices. */
(function (root) {
"use strict";
const S3 = Math.sqrt(3) / 2;
const PRESETS = [
  {
    id: "lris", tel: "Keck 10 m", name: "Keck / LRIS red, 600/7500, 1″",
    note: "Keck I LRIS red channel (Oke et al. 1995; Keck grating table): f_col 2000 mm, camera 305 mm, 44° camera–collimator angle, 600/7500 grating, 4k × 4k 15 µm. The preset uses a 1″ long slit; the preset's 30 objects are the average slit-mask load of the z ~ 3 surveys (25–35 per mask; Steidel et al. 2003, Cooke et al. 2005).",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 1, nObj: 30, col: "mirror", W: 2000 / 13.7, fcam: 305, gType: "refl", G: 600, m: 1, lamB1: 7500, lamC: 7500, psi: 44, tAlpha: null, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "dispersion 0.80 Å/px", q: "dlpix", value: 0.80, tol: 0.05, src: "Keck LRIS grating table" },
      { what: "coverage 3275 Å", q: "span", value: 3275, info: true, src: "Keck LRIS grating table (the tabulated coverage is the tabulated dispersion × 4094 px, 3275/0.80, and the page calls both calculated: this line repeats the dispersion line)" },
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
      { what: "R (calculated) 48,000 at 0.861″, slit-limited", q: "Rs", value: 48000, tol: 0.05, src: "Keck HIRES slit table, calculated column (R × slit = 40,800–41,300″ across the table's rows; measured with the red cross-disperser: 50,000)" },
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
      { what: "R 19,000 at 1″ (design, slit-limited)", q: "Rs", value: 19000, tol: 0.08, src: "Bernstein et al. 2003 (54,000 at 0.35″, the same R × slit; LCO manual: 22,000)" },
      { what: "1″ = 105 µm at the CCD", q: "pixScale", value: 15 / 105, tol: 0.08, src: "Bernstein et al. 2003" },
      { what: "orders 31–69 fit on the 30.7 mm chip across the dispersion", q: "ySpan", m1: 31, m2: 69, value: 2048 * 0.015, info: true, src: "Bernstein et al. 2003 (\"for example, orders 31 to 69\" in one setting; no span is given). The model's order centers 31 to 69 lie 31.2 mm apart, more than the chip, which holds orders 30–66 at λc 6750 Å: the model's prism disperses at least 1.6% more than MIKE's (the prism's incidence angle is not published)" },
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
      { what: "R 25,000 at 1″ (design, slit-limited)", q: "Rs", value: 25000, tol: 0.08, src: "Bernstein et al. 2003 (71,000 at 0.35″, the same R × slit; LCO manual: 28,000)" },
      { what: "1″ = 115 µm at the CCD", q: "pixScale", value: 15 / 115, tol: 0.08, src: "Bernstein et al. 2003" },
      { what: "orders 74–107 span 29 mm across the dispersion", q: "ySpan", m1: 74, m2: 107, value: 29, info: true, src: "Bernstein et al. 2003 (29 mm, given to ±0.5 mm). The model is 4.8% short, a miss at that precision; Bernstein et al. call the two 38° prisms \"the equivalent of a single 62 deg apex angle prism\", and one 62° fused-silica prism in double pass gives 29.5 mm in the model (+1.7%), so the model's four passes, each at exact minimum deviation, disperse about 6% less than that equivalent" },
      { what: "minimum order separation 6″ (orders 74-107)", q: "minSepArcsec", m1: 74, m2: 107, value: 6, tol: 0.15, src: "Bernstein et al. 2003" },
    ],
  },
  {
    id: "mage", tel: "Magellan 6.5 m", name: "Magellan / MagE, 1″",
    note: "Magellan MagE echellette (Marshall et al. 2008; LCO MagE manual; moved from Clay to Baade in October 2015, Rigby et al. 2018 Sec. 2.2; same f/11): off-axis paraboloid collimator 1094 mm (beam 99 mm), vacuum Schmidt camera 138 mm (f/1.4), 175 /mm echellette with δ = 32.3°, quasi-Littrow (angles not published: 0 here), fused-silica prisms 46° in double pass and 40° single pass (three passes, each at minimum deviation; the rotation angles are not published), E2V 42-20 2048 × 1024 of 13.5 µm. The central wavelength (4150 Å) is chosen to put orders 6–20 on the chip; the source does not give one.",
    state: { mode: "echelle", D: 6.5, F: 11.0,
      e: { slitW: 1, nObj: 1, col: "mirror", W: 1094 / 11.0, fcam: 138, eG: 175, eDelta: 32.3, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10,
           xGlass: "silica", xA: 46, xPasses: 1, xPrisms: [{ glass: "silica", A: 46 }, { glass: "silica", A: 46 }, { glass: "silica", A: 40 }], lamC: 4150, Nx: 2048, Ny: 1024, pix: 13.5 } },
    pub: [
      { what: "R = 4100 at 1″ (design)", q: "Rs", value: 4100, tol: 0.05, src: "Marshall et al. 2008; LCO MagE manual" },
      { what: "15 orders (6–20) across the 1024-px chip", q: "nOrders", value: 15, info: true, src: "Marshall et al. 2008. Not a test: λc was chosen to put orders 6–20 on the chip, and the blue end is the explorer's 3200 Å atmospheric cutoff (λc 3800 Å gives 13 orders). The count depends on the prism train only loosely: 44° + 44° + 40° also gives 15" },
      { what: "0.231 Å/px in order 20 at 3125 Å", q: "dlpixAt", lam: 3125, m: 20, value: 0.231, tol: 0.02, src: "Marshall et al. 2008 Table 2" },
      { what: "0.426 Å/px in order 11 at 5590 Å", q: "dlpixAt", lam: 5590, m: 11, value: 0.426, tol: 0.02, src: "Marshall et al. 2008 Table 2" },
      { what: "0.788 Å/px in order 6 at 9700 Å", q: "dlpixAt", lam: 9700, m: 6, value: 0.788, info: true, src: "Marshall et al. 2008 Table 2. The model is 3.0% above the table, a miss at the 2% set for the other orders. At the order's blaze center (10,180 Å) the model gives 0.787 Å/px; the table's m × λ for order 6 (58,200 Å) is 5% below that of orders 9–20 (61,200–62,500 Å), so the table's 9700 Å is probably not where the 0.788 Å/px applies" },
      { what: "0.3″/px along the slit", q: "pixScale", value: 0.3, tol: 0.04, src: "Marshall et al. 2008 (0.33 in one source)" },
      { what: "measured R = 4770 at 1″ (sky lines)", q: "R", value: 4770, info: true, src: "Rigby et al. 2018 (MegaSaura); 16% above the design value" },
    ],
  },
  {
    id: "fire", tel: "Magellan 6.5 m", name: "Magellan / FIRE echellette, 0.6″",
    note: "Magellan Baade FIRE echellette mode (Simcoe et al. 2013, Table 2 prescription): f/11, off-axis paraboloid collimator 555 mm (beam 50 mm in the papers; 555/11 = 50.45 mm entered so that f_col = 555 mm), camera 176.8 mm, R1 echellette 54.49 /mm (δ = 46°, quasi-Littrow; θ and γ not published: 0 here), cryogenic prisms Infrasil 42.6°, 28.1°, 28.1° and ZnSe 21.81° × 3 (six passes; the explorer puts them all after the echelle and at minimum deviation, while FIRE's are deliberately off it to squeeze the beam, so the cross-dispersion here is 1.4–1.8× too small), H2RG 2048 × 2048 of 18 µm; λc 1.20 µm derived.",
    state: { mode: "echelle", D: 6.5, F: 11,
      e: { slitW: 0.6, nObj: 1, col: "mirror", W: 555 / 11, fcam: 176.8, eG: 54.49, eDelta: 46, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10, xGlass: "Infrasil-105K", xA: 40, xPasses: 1,
           xPrisms: [{ glass: "Infrasil-105K", A: 42.6 }, { glass: "Infrasil-105K", A: 28.1 }, { glass: "ZnSe-105K", A: 21.81 }, { glass: "ZnSe-105K", A: 21.81 }, { glass: "Infrasil-105K", A: 28.1 }, { glass: "ZnSe-105K", A: 21.81 }],
           lamC: 12000, Nx: 2048, Ny: 2048, pix: 18 } },
    pub: [
      { what: "R = 6000 at 0.6″, the design requirement (slit-limited)", q: "Rs", value: 6000, info: true, src: "Simcoe et al. 2013 Sec. 2 (\"the requirement that a 'typical' slit deliver R = 6000\", a design figure). The paper's own prescription gives 5520 slit-limited, which the model reproduces" },
      { what: "12.5 km/s per pixel", q: "kmspx", value: 12.5, info: true, src: "Sullivan & Simcoe 2012 Sec. 3.4 (also Simcoe et al. 2011: 50 km/s over 4 px). The prescription of Simcoe et al. 2013 (R1 echellette, 176.8 mm camera, 18 µm pixels) gives 14.7 km/s/px: a conflict between the sources" },
      { what: "orders 11–32 on the chip, 0.82–2.51 µm", q: "nOrders", value: 22, info: true, src: "Simcoe et al. 2013 (the explorer's minimum-deviation prisms fit more orders: see the note)" },
      { what: "0.15″/px along the dispersion (paper) or 0.18″/px (web)", q: "specScale", value: 0.15, info: true, src: "Simcoe et al. 2013 Sec. 2 (\"a pixel pitch of 0.15″ in the spectral direction\", the design figure); MIT FIRE specifications page: 0.18. The prescription gives 0.163″/px" },
      { what: "0.12″/px (reddest order) to 0.09″/px (bluest) along the slit", q: "pixScale", value: NaN, info: true, src: "Simcoe et al. 2013 Sec. 3.2.3. FIRE's prisms compress the beam to 50 × 30 mm; the model's prisms at minimum deviation do not, so it gives the uncompressed scale" },
    ],
  },
  {
    id: "imacs", tel: "Magellan 6.5 m", name: "Magellan / IMACS f/4, 1200 l/mm, 0.7″",
    note: "Magellan Baade IMACS long (f/4) camera (Dressler et al. 2011; LCO IMACS user manual and grating-tilt calculator; collimator from the 1998 Carnegie design specification): f/11 Nasmyth, refractive collimator 1648 mm (beam 150 mm), camera 641.8 mm, fixed 45° camera–collimator angle, 1200 l/mm reflection grating blazed 32.7° at λc ≈ 8250 Å (tilt 32.4°), Mosaic 8192 × 8192 of 15 µm; 51 slits per mask (mean of 25 published dwarf-galaxy masks).",
    state: { mode: "grating", D: 6.5, F: 11.0,
      g: { slitW: 0.7, nObj: 51, col: "lens", W: 1648.46 / 11.0, fcam: 641.8, gType: "refl", G: 1200, m: 1, lamB1: 2 * Math.sin(32.7 * Math.PI / 180) / 1200 * 1e7, lamC: 8250, psi: 45, tAlpha: null,
           Nx: 8192, Ny: 8192, pix: 15 } },
    pub: [
      { what: "0.19 Å/px", q: "dlpix", value: 0.19, tol: 0.03, src: "Simon et al. 2017; Li et al. 2018" },
      { what: "R ≈ 11,000 (0.7″)", q: "R", value: 11000, tol: 0.08, src: "Simon et al. 2017, 2020; Li et al. 2018 (measured)" },
      { what: "coverage from ~7400 Å", q: "lo", value: 7400, tol: 0.015, src: "Simon et al. 2017" },
      { what: "coverage to ~9000 Å", q: "hi", value: 9000, tol: 0.015, src: "Simon et al. 2017" },
      { what: "0.111″/px", q: "pixScale", value: 0.111, tol: 0.01, src: "LCO IMACS user manual; Bigelow & Dressler 2003" },
    ],
  },
  // Magellan / LLAMAS: three arms of fiber-fed VPH spectrographs; the gratings are not published (data/round4/llamas.md)
  ...[["blue", 2233, 4222, 3417, 4947, 0.762, "1500–2500"], ["green", 1425, 5923, 4634, 7100, 1.204, "1400–2400"], ["red", 1070, 8466, 6771, 10000, 1.609, "1750–2500"]].map(([arm, G, lc, l0, l1, disp, Rlab]) => ({
    id: "llamas" + arm[0], tel: "Magellan 6.5 m", name: "Magellan / LLAMAS " + arm + " (grating fitted)",
    note: "Magellan LLAMAS IFU, " + arm + " arm (Furesz et al. 2020; MIT LLAMAS pages, exposure-time calculator and pipeline tables): lenslets turn the native f/11 into f/4.4 at the 110 µm fibers; F = 4.0 is the collimator's acceptance (the fibers keep 95.6% of the light inside f/4), so the core enters at f/4.0, 110 µm / (4.0 × 6.5 m) = 0.873″ (the sky is sampled by 0.75″ lenslets), as the slit of equal line width, 0.756″; 300 spectra per detector, on-axis spherical collimator mirror 200 mm (beam 50 mm), camera 70 mm, e2v 2048 × 2048 of 13.5 µm. The VPH line density (" + G + " /mm) and the grating's symmetric angle are NOT published: they are fitted so the published band " + l0 + "–" + l1 + " Å fills the chip.",
    state: { mode: "grating", D: 6.5, F: 4.0,
      g: { slitW: S3 * 0.110 / (4.0 * 6500) * 206264.806, nObj: 300, col: "mirror", W: 50, fcam: 70, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
           psi: 35, tAlpha: null, Nx: 2048, Ny: 2048, pix: 13.5 } },
    pub: [
      { what: disp + " Å/px at the chip center (arc tables)", q: "dlpix", value: disp, info: true, src: "llamas-pyjamas arc tables. Not a test: the line density was fitted so the published band fills the 2048 px, which fixes the mean dispersion (band / 2048 px); the center value differs from the mean only through cos β across the chip" },
      { what: "lab R " + Rlab, q: "R", value: NaN, info: true, src: "MIT LLAMAS Specifications page (pre-ship lab measurements of single fibers); R ≈ 2000 in Furesz et al. 2020" },
    ],
  })),
  // Magellan / LDSS-3: VPH grisms between two prisms (data/round5/grisms.md; geometry from Carnegie's maskgen file)
  ...[["All", 400, 16.3, "silica", 6588, 2.040, null, "4250–10000"], ["Blue", 1090, 24.0, "S-LAL7", 5150, 0.6947, 1900, "3800–6200"], ["Red", 665, 24.0, "S-LAL7", 8321, 1.1818, 1810, "6000–10000"]].map(([k, G, Ap, gl, lc, disp, Rt, band]) => ({
    id: "ldss3" + k.toLowerCase(), tel: "Magellan 6.5 m", name: "Magellan / LDSS-3 VPH-" + k + ", 0.75″",
    note: "Magellan Clay LDSS-3 with the VPH-" + k + " grism (LCO LDSS-3 pages; Carnegie maskgen instrument file; measured arc solutions): f/11, refractive collimator 746.8 mm (beam 67.9 mm, derived), camera 173.1 mm, VPH grism " + G + " /mm" + (k === "Red" ? " (maskgen's value, changed there from 660 along with alignment values \"used for fitting actual data\"; the LCO grism table gives 660)" : "") + " between two " + (gl === "silica" ? "fused-silica" : "OHARA S-LAL7") + " prisms of apex " + Ap + "° (the VPH model exactly), Fermilab CCD 4096 × 2048 of 15 µm; 17 slits per mask (mean of 35 published masks).",
    state: { mode: "grating", D: 6.5, F: 11.0,
      g: { slitW: 0.75, nObj: 17, col: "lens", W: 746.77 / 11.0, fcam: 173.076, gType: "grism", G, m: 1, lamB1: 5000, lamC: lc, psi: 35, tAlpha: null,
           gA: Ap, gGlass: gl, gKind: "vph", gTilt: 0, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "measured " + lc + " Å at the detector center", q: "lam0", value: lc, tol: 0.005, src: "LDSS-3 arc solution through the center slit (2007)" },
      { what: "measured " + disp + " Å/px at the center", q: "dlpix", value: disp, tol: 0.015, src: "LDSS-3 arc solution (2007)" },
      ...(Rt ? [{ what: "R = " + Rt + " at 0.75″", q: "Rs", value: Rt, tol: 0.06, src: "LCO grism table (λ over 4 px × Å/px)" }]
        : [{ what: "R = 860 at 0.75″ (λ over 4 px × the mean 1.89 Å/px, at 6500 Å)", q: "R", value: 860, info: true, src: "LCO grism table; the model's local dispersion at λ0 is 2.03 Å/px" }]),
      { what: "0.189″/px", q: "pixScale", value: 0.189, tol: 0.02, src: "LCO LDSS-3 pages" },
      { what: "band " + band + " Å", q: "span", value: NaN, info: true, src: "LCO grism table (filters and efficiency trim the detector's span)" },
    ],
  })),
  {
    id: "esi", tel: "Keck 10 m", name: "Keck / ESI echellette, 1″",
    note: "Keck II ESI echellette mode (Sheinis et al. 2002; 1996 design report; Keck ESI pages): off-axis paraboloid collimator 2286 mm (beam 166.9 mm at f/13.7), 10-element refractive camera 308 mm, 175 /mm echellette with δ = 32.3°, quasi-Littrow (γ is 'a few degrees', not published: 0 here), two 50° OHARA BSL7Y prisms, the first in double pass (three passes at minimum deviation), MIT/LL CCID20 4096 × 2048 of 15 µm; λc = 5250 Å from the design order positions.",
    state: { mode: "echelle", D: 10.95, F: 13.7,
      e: { slitW: 1, nObj: 1, col: "mirror", W: 2286 / 13.7, fcam: 308, eG: 175, eDelta: 32.3, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10,
           xGlass: "BSL7Y", xA: 50, xPasses: 1, xPrisms: [{ glass: "BSL7Y", A: 50 }, { glass: "BSL7Y", A: 50 }, { glass: "BSL7Y", A: 50 }], lamC: 5250, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R = 4000 at 1″ (slit × 11.5 km/s/px)", q: "Rs", value: 4000, tol: 0.04, src: "Keck ESI pages, Table 2 (geometric)" },
      { what: "0.1545 Å/px in order 15 at 4077 Å", q: "dlpixAt", lam: 4077.46, m: 15, value: 0.154482, tol: 0.02, src: "Keck ESI wavelength solutions" },
      { what: "0.2121 Å/px in order 11 at 5549 Å", q: "dlpixAt", lam: 5549.09, m: 11, value: 0.212052, tol: 0.02, src: "Keck ESI wavelength solutions" },
      { what: "0.3345 Å/px in order 7 at 8708 Å", q: "dlpixAt", lam: 8707.59, m: 7, value: 0.334496, tol: 0.02, src: "Keck ESI wavelength solutions" },
      { what: "orders 6 and 15 at +86% and −79% of the half-chip (25.3 mm apart)", q: "ySpan", m1: 6, m2: 15, value: 0.825 * 2048 * 0.015, info: true, src: "1996 ESI design report, order positions (missed the 8% tolerance set beforehand: three passes at exact minimum deviation give 23.0 mm; the design's prisms are only 'near' minimum deviation)" },
      { what: "minimum order separation 22″", q: "minSepArcsec", m1: 6, m2: 15, value: 22, tol: 0.08, src: "Sheinis et al. 2002" },
      { what: "0.144″/px along the slit in order 11 at 5549 Å (0.120 in order 15 to 0.168 in order 6)", q: "pixScaleAt", lam: 5549, m: 11, value: 0.144, info: true, src: "Keck ESI Quick Reference (measured with the MultiHoles slit). The model is 7% coarser in order 11 and varies less across the orders (0.144 in order 15 to 0.164 in order 6, against the measured 0.120 to 0.168): the scale along the slit varies with the prisms' anamorphic magnification, and the model's prisms sit at exact minimum deviation, ESI's only near it" },
    ],
  },
  {
    id: "kcwib", tel: "Keck 10 m", name: "Keck / KCWI blue BM, Medium slicer",
    note: "Keck II KCWI blue arm (Morrissey et al. 2018; Keck KCWI pages): the image slicer at the f/13.7 focus (no fore-optics), Medium slicer 0.69″ × 20.4″ slices, 24 slices (≈3330 spaxels) per detector, spherical collimator mirror (f 2172.5 mm; the explorer's beam-matched value is 2192 mm), 160 mm pupil, articulated refractive camera 304.4 mm f/1.9, BM VPH 1900 /mm at α = 30° (β = 20.8° at 4500 Å), e2v CCD231-84 4112 × 4096 of 15 µm.",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 0.69, nObj: 3330, col: "mirror", W: 160, fcam: 304.4, gType: "trans", G: 1900, m: 1, lamB1: 5000, lamC: 4500, psi: 35, tAlpha: 30, Nx: 4112, Ny: 4096, pix: 15 } },
    pub: [
      { what: "0.24 Å/px", q: "dlpix", value: 0.24, tol: 0.03, src: "Keck KCWI configuration page" },
      { what: "0.147″/px along the slices", q: "pixScale", value: 0.147, tol: 0.02, src: "Morrissey et al. 2018" },
      { what: "slit image 4.6 px (Medium slicer)", q: "npix", value: 4.6, info: true, src: "Morrissey et al. 2018 (twice the Small slicer's 2.3 px); their figure leaves out the grating's anamorphic factor cos α / cos β = 0.93, which the model includes (without it, 4.65 px)" },
      { what: "R = 4000 (Keck page) or 5000 (Morrissey et al. 2018)", q: "R", value: 4000, info: true, src: "the two sources disagree" },
    ],
  },
  {
    id: "kcrm", tel: "Keck 10 m", name: "Keck / KCRM red RL, Medium (angle derived)",
    note: "Keck II KCRM, the red arm of KCWI (Keck pages; KCWI data pipeline): the same slicer and collimator, Medium slicer 0.69″, camera 305 mm (an assumption: the KCRM camera is not published, and 305 mm is the single FCAM of the pipeline's kcwi.cfg, listed among the \"parameters that should be the same for both channels\"), RL VPH 530 /mm at α = 18.26° (NOT published: derived assuming β = α − 9° as for the blue gratings, which reproduces the published sample coverage), 4096 × 4096 of 15 µm (the exact format is not published).",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 0.69, nObj: 3330, col: "mirror", W: 160, fcam: 305, gType: "trans", G: 530, m: 1, lamB1: 5000, lamC: 8950, psi: 35, tAlpha: 18.26, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "0.92 Å/px", q: "dlpix", value: 0.92, info: true, src: "Keck KCRM configuration page. Not a test of the instrument: the line density (530 /mm) and the 305 mm camera both come from the pipeline, whose own dispersion formula uses them, so the line checks the pipeline's placeholder camera" },
      { what: "sample coverage 7070–10810 Å", q: "span", value: 10810 - 7070, info: true, src: "Keck KCRM page (the grating angle was derived from this, so it is not a test)" },
      { what: "R > 1000", q: "R", value: NaN, info: true, src: "Keck KCRM page (a lower limit only)" },
      { what: "R ≈ 1600 (RL, Medium slicer), the pipeline's assumed resolution", q: "R", value: 1600, info: true, src: "KCWI pipeline, kcwi_file_primitives.py resolution(): RL gives λ/800 FWHM for the Large slicer, halved for the Medium (used to convolve the arc atlas); the model is 33% higher" },
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
      { what: "aberration-free slit FWHM 1.23 Å (R = 6500)", q: "Rs", value: 8000 / 1.23, info: true, src: "Faber 1995 grating table, raw FWHM (1.23 Å = 3.79 px × 0.324 Å/px, so the line repeats the slit-image and dispersion lines above)" },
      { what: "slit image 3.79 px", q: "npix", value: 3.79, tol: 0.03, src: "Faber 1995 grating table, raw FWHM" },
      { what: "0.1185″/px", q: "pixScale", value: 0.1185, tol: 0.03, src: "Keck DEIMOS specifications (0.119 elsewhere)" },
      { what: "R with aberrations, 8000/1.35 Å", q: "R", value: 8000 / 1.35, info: true, src: "Faber 1995 grating table, effective FWHM (the model has no aberrations)" },
    ],
  },
  // Keck I / MOSFIRE: one reflection grating in orders 6, 5, 4, 3 for Y, J, H, K (data/round4/mosfire.md)
  ...[["Y", 6, 10373, 1.0855, 2.92, 3380, 9716, 11250], ["J", 5, 12450, 1.3028, 2.92, 3310, 11530, 13520],
      ["H", 4, 16321, 1.6269, 2.87, 3660, 14680, 18040], ["K", 3, 21760, 2.1691, 2.87, 3620, 19540, 23970]].map(([b, m, lc, disp, npx, Rm, lo, hi]) => ({
    id: "mosfire" + b.toLowerCase(), tel: "Keck 10 m", name: "Keck / MOSFIRE " + b + ", 0.7″",
    note: "Keck I MOSFIRE (McLean et al. 2012; Keck MOSFIRE pages): f/13.66 Cassegrain, six-element refractive collimator 1813 mm (beam 132.7 mm on the 10.95 m primary), camera 250 mm (reduction 7.25), 110.5 l/mm reflection grating blazed 21.93°, fixed 40° camera–collimator angle, " + b + " band in order " + m + " at λc = " + lc + " Å, HAWAII-2RG 2048 × 2048 of 18 µm; 28 slits per mask (MOSDEF average; the slit unit forms up to 46 slits from 92 bars).",
    state: { mode: "grating", D: 10.95, F: 13.66,
      g: { slitW: 0.7, nObj: 28, col: "lens", W: 1813.0 / 13.66, fcam: 250.0, gType: "refl", G: 110.5, m, lamB1: 2 * Math.sin(21.93 * Math.PI / 180) / 110.5 * 1e7, lamC: lc, psi: 40, tAlpha: null,
           Nx: 2048, Ny: 2048, pix: 18 } },
    pub: [
      { what: disp + " Å/px", q: "dlpix", value: disp, tol: 0.003, src: "McLean et al. 2012 Table 1; Keck MOSFIRE grating page" },
      { what: "0.7″ slit image " + npx + " px", q: "npix", value: npx, tol: 0.02, src: "McLean et al. 2012 Sec. 3 (geometric slit image)" },
      { what: "0.1798″/px", q: "pixScale", value: 0.1798, tol: 0.01, src: "McLean et al. 2012" },
      ...(b === "K" ? [{ what: "coverage from 19540 Å", q: "lo", value: lo, tol: 0.001, src: "McLean et al. 2012 Table 1" }, { what: "coverage to 23970 Å", q: "hi", value: hi, tol: 0.001, src: "McLean et al. 2012 Table 1" }]
        : [{ what: "coverage " + lo + "–" + hi + " Å" + (b === "H" ? "" : " (set by the order-sorting filter; the detector spans more)"), q: "span", value: hi - lo, info: true, src: "McLean et al. 2012 Table 1" }]),
      { what: "measured R = " + Rm + " (0.7″)", q: "R", value: Rm, info: true, src: "McLean et al. 2012 Sec. 3 (arc lamps). The model's effective R (slit, diffraction and pixel in quadrature) is 6–10% lower, and even the model's slit-limited R is 1–4% below the measurement: the measured lines are narrower than the geometric slit image (2.74–2.88 px on the Keck MOSFIRE grating page)" },
    ],
  })),
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
      { what: "R 3590 (1″)", q: "Rs", value: 3590, info: true, src: "MMTO grating table (the table's R is λc over 3.32 px × 0.61 Å/px, so the line repeats the slit-image and dispersion lines above)" },
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
      { what: "R = 6563/6.2 Å, from the 6.2 Å FWHM of Fabricant et al. 2005", q: "Rdiam", value: 6563 / 6.2, info: true, src: "Fabricant et al. 2005 Sec. 3.4 (\"a resolution of 6.2 Å FWHM\"). The 6.2 Å equals the 5.1-px fiber-image diameter × 1.2 Å/px, so the line repeats the diameter and dispersion lines; the model's R from the full fiber-image width agrees to 0.5%" },
      { what: "fiber images 10.2 px apart (the model spreads 300 over the chip)", q: "gapPx", value: 10.2, info: true, src: "Hectospec hardware manual" },
    ],
  },
  {
    id: "hectochelle", tel: "MMT 6.5 m", name: "MMT / Hectochelle, RV31",
    note: "MMT Hectochelle (Szentgyorgyi et al. 2011; observers guide 2023): 250 µm fibers (1.47″ at f/5.4 on 6.5 m; 1.5″ in the guide) entered as the slit of equal line width (1.27″), spherical Schmidt collimator, 254 mm beam, catadioptric camera 25.3 in (642.6 mm, observers guide; the paper's 0.49 reduction implies 670.6 mm), 110 /mm R2 echelle (64.5°) used in ONE order selected by an interference filter: order 31 with the RV31 filter (5230 Å), 15° between the beams (α 72°, β 57°), two E2V 42-90 CCDs 4608 × 2048 of 13.5 µm, 240 fibers. Decommissioned in 2026.",
    state: { mode: "grating", D: 6.5, F: 5.4,
      g: { slitW: S3 * 0.250 / (5.4 * 6500) * 206264.806, nObj: 240, col: "mirror", W: 254, fcam: 25.3 * 25.4, gType: "refl", G: 110, m: 31, lamB1: 2 * Math.sin(64.5 * Math.PI / 180) / 110 * 1e7, lamC: 5230, psi: 15, tAlpha: null,
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
    note: "G-CLEF, the 2016-2018 design (Ben-Ami et al. 2016, 2018; Szentgyorgyi et al. 2016, 2018), red arm, MR mode: one 300 µm science fiber (with 2 sky/calibration fibers), 0.8″ at the f/8 slit, entered as the slit of equal line width (0.69″); off-axis-parabola collimator 2400 mm, 300 mm beam, R4 echelle 31.6 /mm (75.96°) in Littrow, 0.75° out of plane, red VPH cross-disperser 480 /mm (first order, optimized at 7300 Å), effective camera 675 mm (450 mm on the 200 mm transferred beam, derived). White pupil: the cross-disperser sits in the 200 mm beam and is imaged by the 450 mm camera, which the model (one 675 mm camera) reproduces by entering the VPH as 480 × 450/675 = 320 /mm, the same order spacing. e2v detector 92.4 × 92.2 mm of 10 µm. Not built yet; the design has changed since.",
    state: { mode: "echelle", D: 25.4, F: 8,
      e: { slitW: S3 * 0.8, nObj: 3, col: "mirror", W: 300, fcam: 675, eG: 31.6, eDelta: 75.96, gamma: 0.75, theta: 0, xd: "vph", xG: 480 * 450 / 675, xPsi: 10,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 7300, Nx: 9240, Ny: 9220, pix: 10 } },
    pub: [
      { what: "reddest order 65", q: "mLo", value: 65, info: true, src: "Ben-Ami et al. 2016 Table 1 (orders 65–175, both arms). In the model order 65's blaze center lies 0.9 mm beyond the chip edge and only 9354–9400 Å of order 65 reaches the chip; the reddest order centered on the chip is 66. λc 7300 Å is the VPH's optimization wavelength, used here as the format center, which no source gives" },
      { what: "minimum inter-order EDGE gap 210 µm in the PRV format (8 fibers per order, 120 µm apart): center spacing here", q: "minSepPx", m1: 65, m2: 114, value: 21, info: true, src: "Ben-Ami et al. 2016" },
      { what: "R 35,000 (MR)", q: "R", value: 35000, info: true, src: "Ben-Ami et al. 2016 Table 2 (published R imply a line FWHM ~0.67 of the fiber image)" },
    ],
  },
  // VLT / FORS2: ruled grisms whose entrance faces are tilted 7.5° (data/round5/grisms.md)
  ...[["300V", 300, 21, "FK5HTi", 5849, 1.6549, 440, "4450–8700 Å (GG435)"], ["300I", 300, 26.7, "LF5", 8574, 1.6101, 660, "6000–11000 Å (OG590)"], ["600B", 600, 34, "FK5HTi", 4629, 0.7476, 780, "3300–6210 Å"]].map(([k, G, Ap, gl, lc, disp, Rm, band]) => ({
    id: "fors2" + k.toLowerCase(), tel: "VLT 8.2 m", name: "VLT / FORS2 " + k + ", 1″",
    note: "VLT FORS2 with GRIS_" + k + " (ESO FORS manual; 1995 FORS grism design; ESO pipeline calibration; VLT-SPE-ESO-10000-2723): Cassegrain entrance pupil 8115 mm (VLT-SPE Table 2: 8115.0 mm at f/13.4106), with F = 13.42 so that the plate scale is the manual's 528 µm/″; refractive collimator 1233 mm (beam 91.9 mm, derived), camera 280 mm, ruled grism " + G + " /mm on a " + (gl === "LF5" ? "LF5" : "FK5") + " prism of " + Ap + "°, its entrance face tilted 7.5° in the dispersion plane (the direction inferred from ESO's numbers: no source states it), MIT mosaic 4096 × 4096 of 15 µm (two chips; the gap is not modeled); 50 slits per MXU mask (survey average).",
    state: { mode: "grating", D: 8.115, F: 13.28 * 8.2 / 8.115,
      g: { slitW: 1.0, nObj: 50, col: "lens", W: 1233 / (13.28 * 8.2 / 8.115), fcam: 280, gType: "grism", G, m: 1, lamB1: 5000, lamC: lc, psi: 35, tAlpha: null,
           gA: Ap, gGlass: gl, gKind: "ruled", gTilt: 7.5, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "measured " + lc + " Å at the CCD center", q: "lam0", value: lc, tol: 0.005, src: "ESO pipeline master distortion table (manual: same)" },
      { what: "measured " + disp + " Å per 15 µm pixel", q: "dlpix", value: disp, tol: 0.015, src: "ESO pipeline master distortion table" },
      { what: "R = " + Rm + " at 1″", q: "R", value: Rm, tol: 0.06, src: "ESO FORS manual Table 2.4" },
      { what: "0.1259″ per unbinned pixel (measured)", q: "pixScale", value: 0.12591, tol: 0.01, src: "ESO FORS manual Table 4.2 (imaging astrometry, FORS2 on Antu with the standard-resolution collimator)" },
      { what: "band " + band, q: "span", value: NaN, info: true, src: "ESO FORS manual (order-sorting filter and the 3300 Å cut-off trim the detector's span)" },
    ],
  })),
  // VLT / ESPRESSO singleHR (1 UT), blue and red arms (data/round5/espresso.md).  The anamorphic pupil slicer cuts the
  // beam into two 300 x 200 mm slices, each carrying half the pupil along the dispersion: the whole pupil maps to an
  // equivalent round beam of 2 x 300 = 600 mm.  The cross-dispersers (a fused-silica prism plus a VPH grating) are not
  // published: an equivalent first-order VPH is estimated here.
  ...[["blue", "b", 757, 4380, [[3800.4, 161, 0.0063], [5229.7, 117, 0.0086]], 117, 161], ["red", "r", 407, 6548, [[5229.7, 117, 0.0086], [7844.5, 78, 0.0129]], 78, 117]].map(([arm, k, xG, lc, dl, m1, m2]) => ({
    id: "espresso" + k, tel: "VLT 8.2 m", name: "VLT / ESPRESSO " + arm + ", singleHR (partly fitted)",
    note: "VLT ESPRESSO " + arm + " arm, singleHR 1-UT mode (Pepe et al. 2021; ESO ESPRESSO manual; design papers): 140 µm octagonal fiber (1.0″) entered as the slit of equal line width, 4 spectra (object and sky/reference fibers, each cut in two by the pupil slicer), collimator mirror 3000 mm (off-axis parabola, double pass) with an equivalent 600 mm beam (two 300 mm slices), 31.6 /mm R4 echelle (a 3 × 1 mosaic, δ = 76°, θ = 0; γ = 4.85° inferred from the order table, which then lists blaze-center wavelengths), cross-disperser an equivalent " + xG + " /mm VPH (the real prism + VPH is not published), camera 755 mm (fitted to the pixel dispersion of Pepe et al. 2021 Table 2; the design gives 800 mm), 9232 × 9216 of 10 µm. D = 8.2 m, the primary: no source gives the effective aperture of the coudé feed (140 µm = 1.0″ at F/3.5 implies 8.25 m).",
    state: { mode: "echelle", D: 8.2, F: 5.0,
      e: { slitW: S3 * 1.0, nObj: 4, col: "mirror", W: 600, fcam: 755, eG: 31.6, eDelta: 76.0, gamma: 4.85, theta: 0, xd: "vph", xG, xPsi: 10,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: lc, Nx: 9232, Ny: 9216, pix: 10 } },
    pub: [
      { what: "R = 140,000 (singleHR)", q: "R", value: 140000, ...(k === "r" ? { info: true } : { tol: 0.06 }), src: "ESO ESPRESSO manual Table 1 (Pepe et al. 2021: 138,000 median)" + (k === "r" ? ". The red arm misses at λc 6548 Å, which sits 0.45 of a free spectral range blueward of the blaze of order 93, where the diffraction angle is smaller and the slit image narrower (3.9 px); at the blaze centers of orders 117, 100 and 78 the model gives 133,400, 133,000 and 132,200 (within 6%), as in the blue arm" : "") },
      { what: "4.5 px per resolution element", q: "npix", value: 4.5, ...(k === "r" ? { info: true } : { tol: 0.08 }), src: "ESO ESPRESSO manual Table 1 (average)" + (k === "r" ? ". The model gives 3.9 px at λc, off the blaze (see the R line); at the blaze centers of orders 117–78 it gives 4.42–4.46 px" : "") },
      ...dl.map(([l, m, v]) => ({ what: (v / 10).toFixed(5) + " nm/px at " + (l / 10).toFixed(2) + " nm (order " + m + ")", q: "dlpixAt", lam: l, m, value: v, info: true, src: "Pepe et al. 2021 Table 2. Not a test: the 755 mm camera was fitted to this table (its 18 rows give 749–758 mm)" })),
      { what: "orders " + m1 + "–" + m2, q: "nOrders", value: m2 - m1 + 1, info: true, src: "ESO ESPRESSO manual (the cross-disperser here is an estimated equivalent, so the order count is not a test)" },
    ],
  })),
  {
    id: "muse", tel: "VLT 8.2 m", name: "VLT / MUSE WFM (effective optics)",
    note: "VLT MUSE Wide Field Mode, one of the 24 identical IFU spectrographs (Bacon et al. 2010, 2017; ESO MUSE manual): Nasmyth focus of UT4, entered with the 8000 mm Nasmyth entrance pupil (VLT-SPE-ESO-10000-2723 Table 3), 0.2″ slices, 48 slices × 75 spaxels = 3600 spectra per detector, refractive collimator, one VPH grating, e2v 4112 × 4096 of 15 µm. The collimator and camera focal lengths, the beam and the VPH line density are NOT published: the EFFECTIVE values here (f_col 499.3 mm and camera 258.4 mm from the Potsdam MRS derivative; beam 66.8 mm, which makes the 0.2″ slice 2.0 px wide on the 8.0 m pupil; VPH 458.4 /mm at the symmetric setting for 7000 Å, derived from the 1.25 Å/px) reproduce the dispersion and the 2-px slice image. MUSE's fore-optics magnify the field 2× along the dispersion (across the slices) relative to along the slices; the explorer has one isotropic magnification and is set for the dispersion direction, so the explorer's spatial scale reads half the real 0.2″/px.",
    state: { mode: "grating", D: 8.0, F: 499.3 / 66.82,
      g: { slitW: 0.2, nObj: 3600, col: "lens", W: 66.82, fcam: 258.4, gType: "trans", G: 458.4, m: 1, lamB1: 5000, lamC: 7000, psi: 35, tAlpha: null, Nx: 4112, Ny: 4096, pix: 15 } },
    pub: [
      { what: "1.25 Å/px", q: "dlpix", value: 1.25, info: true, src: "ESO MUSE manual Table 1. Not a test: the effective VPH line density was derived from this value (Weilbacher et al. 2020 let the arc-line search assume a local dispersion between 1.19 and 1.31 Å/px)" },
      ...[[4650, 1609], [7000, 2737], [9350, 3506]].map(([l, r]) => ({ what: "lab R = " + r + " at " + l + " Å", q: "RAt", lam: l, value: r, info: true, src: "ESO MUSE manual Sec. 3.2, Fig. 18 table (laboratory, calibration lamps; the effective optics are stand-ins, so R is a reference here: the model lands within 3–9% across the band)" })),
      { what: "0.2″/px along the slices", q: "pixScale", value: 0.2, info: true, src: "ESO MUSE manual (the explorer gives half: the 2× anamorphic fore-optics are not modeled)" },
    ],
  },
  {
    id: "uvesb", tel: "VLT 8.2 m", name: "VLT / UVES blue 390, 1″",
    note: "VLT UVES blue arm, standard 390 nm setting with CD#2 (Dekker et al. 2000; ESO UVES manual; ESO pipeline physical model for the cross-disperser angle): 8.0 m entrance pupil at f/10 (the value that reproduces the published scales), white-pupil collimator mirror 2000 mm, beam 200 mm, R4 echelle 41.59 /mm (δ = 76.0°, θ = 0, γ = 0.8°), cross-disperser 660 /mm at a 46.0° camera–collimator angle, camera 360 mm f/1.8, EEV 3000 × 2048 of 15 µm (the illuminated part of the 2k × 4k CCD).",
    state: { mode: "echelle", D: 8.0, F: 10,
      e: { slitW: 1, nObj: 1, col: "mirror", W: 200, fcam: 360, eG: 41.59, eDelta: 76.0, gamma: 0.8, theta: 0, xd: "grating", xG: 660, xPsi: 46.0,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 3900, Nx: 3000, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R = 41,400 at 1″ (R × slit, slit-limited)", q: "Rs", value: 41400, tol: 0.06, src: "ESO UVES manual (R × slit = 41,400; the geometric 2 tan δ W / D reproduces it to 0.1%)" },
      { what: "λ/193,000 per pixel (order 120 at 3888 Å)", q: "dlpixAt", lam: 3888, m: 120, value: 3888 / 193000, tol: 0.03, src: "ESO UVES manual" },
      { what: "0.246″/px along the slit", q: "pixScale", value: 0.246, tol: 0.03, src: "ESO UVES manual" },
      { what: "coverage from 3260 Å", q: "lo", value: 3260, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 390 setting" },
      { what: "coverage to 4540 Å", q: "hi", value: 4540, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 390 setting" },
      { what: "minimum order separation ~9.6″", q: "minSepArcsec", m1: 104, m2: 142, value: 9.6, tol: 0.1, src: "ESO UVES manual Table 3.2 (CD#2 at 395 nm: 38.9 px = 9.6″; the 390 setting is not tabulated; 10″ in the manual's Table 1.1)" },
    ],
  },
  {
    id: "uvesr", tel: "VLT 8.2 m", name: "VLT / UVES red 580, 1″",
    note: "VLT UVES red arm, standard 580 nm setting with CD#3 (Dekker et al. 2000; ESO UVES manual; ESO pipeline physical model): 8.0 m entrance pupil at f/10, collimator mirror 2000 mm, beam 200 mm, R4 echelle 31.6 /mm (δ = 75.04°, θ = 0, γ = 0.8°), cross-disperser 600 /mm at 45.336°, camera 500 mm f/2.5, two 2k × 4k CCDs (4096 × 4096 of 15 µm; the 0.96 mm gap between them, where order 105 falls, is not modeled).",
    state: { mode: "echelle", D: 8.0, F: 10,
      e: { slitW: 1, nObj: 1, col: "mirror", W: 200, fcam: 500, eG: 31.6, eDelta: 75.04, gamma: 0.8, theta: 0, xd: "grating", xG: 600, xPsi: 45.336,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 5800, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "R = 38,700 at 1″ (R × slit, slit-limited)", q: "Rs", value: 38700, tol: 0.06, src: "ESO UVES manual (R × slit = 38,700; the geometric 2 tan δ W / D reproduces it to 0.3%)" },
      { what: "λ/250,000 per pixel (order 110 at 5559 Å)", q: "dlpixAt", lam: 5559, m: 110, value: 5559 / 250000, tol: 0.03, src: "ESO UVES manual" },
      { what: "0.182″/px along the slit", q: "pixScale", value: 0.182, tol: 0.03, src: "ESO UVES manual" },
      { what: "coverage from 4760 Å", q: "lo", value: 4760, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 580 setting" },
      { what: "coverage to 6840 Å", q: "hi", value: 6840, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 580 setting" },
      { what: "minimum order separation 14.1″ (580 setting)", q: "minSepArcsec", m1: 90, m2: 128, value: 14.1, tol: 0.025, src: "ESO UVES manual Table 3.2 (CD#3 at 580 nm: 77.4 px = 14.1″); Dekker et al. 2000 Fig. 9 gives 13.8″ for the same setting, so the tolerance is their 2.2% difference (the manual's Table 1.1 gives 9″ and the ESO pages 12″ for the red arm without naming a setting)" },
    ],
  },
  ...[
    ["uvb", "UVB", 8.115, 206264.8 / 3.91 / 8115, 100, [9.31, "2.7"], 180, 41.77, 2.2, { xGlass: "silica", xA: 60, xPasses: 2, xPrisms: null }, 4145, 3000, 1800, 15, 1.0,
      5400, 6.2, 0.164, 12, 18, 390.6, 428.9, "one 60° fused-silica prism in double pass"],
    ["vis", "VIS", 8.115, 206264.8 / 3.82 / 8115, 100, [8.98, "2.8"], 99.4, 54.0, 2.0, { xGlass: "SF6", xA: 49, xPasses: 2, xPrisms: null }, 7112, 4096, 2048, 15, 0.9,
      8900, 5.7, 0.154, 15, 23, 675.4, 730.7, "one 49° SCHOTT SF6 prism in double pass"],
    ["nir", "NIR", 8.115, 6.5, 85, [12.1, "2.1"], 55, 46.07, 1.8, { xGlass: "ZnSe-105K", xA: 22, xPasses: 2,
      xPrisms: [{ glass: "Infrasil-105K", A: 35 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "Infrasil-105K", A: 35 }] },
      14528, 2048, 1024, 18, 0.9, 5600, 3.6, 0.245, 16, 18, 1400.8, 1511.5, "a 35° Infrasil and two 22° ZnSe prisms in double pass, at 105 K"],
  ].map(([id, arm, D, F, W, [cs, cf], eG, dl, gam, xd, lc, Nx, Ny, pix, slit, R, npx, ps, nOrd, mT, oLo, oHi, xdTxt]) => { const fc = 206264.8 / cs / (D * 1000) * W; return {
    id: "xsh" + id, tel: "VLT 8.2 m", name: `VLT / X-Shooter ${arm}, ${slit.toFixed(1)}″`,
    note: `X-Shooter ${arm} arm (Vernet et al. 2011; ESO user manual): echelle ${eG} /mm at ${dl}°, in-plane offset 0, ${gam}° out of plane; ${xdTxt}; ${W} mm beam; mirror (Maksutov-type) collimator; camera f/${cf} (effective focal length ${fc.toFixed(1)} mm, from the published camera plate scale ${cs}″/mm and the beam on the 8115 mm Cassegrain entrance pupil, VLT-SPE-ESO-10000-2723 Table 2); detector area used ${Nx} × ${Ny} px of ${pix} µm.` +
      (id === "nir" ? " The NIR slit focal ratio is not published: f/6.5 assumed (it changes only the drawing)." : ` Slit focal ratio f/${F.toFixed(2)} from the published slit plate scale (f_col = ${(F * W).toFixed(0)} mm).`) + " Central wavelength: the blaze of the middle order.",
    state: { mode: "echelle", D, F,
      e: Object.assign({ slitW: slit, nObj: 1, col: "mirror", W, fcam: fc, eG, eDelta: dl, gamma: gam, theta: 0, xd: "prism", xG: 300, xPsi: 10, lamC: lc, Nx, Ny, pix }, xd) },
    pub: [
      { what: `R × sampling = ${R} × ${npx} = λ / (Å per pixel)`, q: "Rnpix", value: R * npx, ...(id === "vis" ? { info: true } : { tol: 0.05 }), src: "ESO X-Shooter user manual Table 13" + (id === "vis" ? ". The model is 5.1% above the table's product, a miss at the 5% set beforehand. The table's product implies 0.140 Å/px at 7112 Å, while order 23 spans 55.3 nm over the 4096 px (Vernet et al. 2011 Table 3; 0.135 Å/px on average), which the model reproduces (the order-23 line): the two sources differ by 4%" : "") },
      ...(id !== "nir" ? [{ what: `order ${mT} spans ${(oHi - oLo).toFixed(1)} nm on the detector`, q: "ordSpan", m: mT, value: (oHi - oLo) * 10, tol: 0.05, src: "Vernet et al. 2011 Table 3" }] : []),
      ...(id === "nir" ? [{ what: `${nOrd} orders on the detector`, q: "nOrders", value: nOrd, tol: 0.10, src: "Vernet et al. 2011 Table 3" }] : []),
      { what: `R ${R} (${slit.toFixed(1)}″)`, q: "R", value: R, info: true, src: "ESO X-Shooter user manual Table 13 (measured). The model's R is 16%, 14% and 14% lower in the UVB, VIS and NIR arms, because the model's slit image is 18%, 20% and 15% wider than the measured lines (next line)" },
      { what: `${npx} px per FWHM`, q: "npix", value: npx, info: true, src: "ESO X-Shooter user manual Table 13" },
      { what: `${ps}″/px along the slit (projected; prism anamorphism)`, q: "pixScale", value: ps, info: true, src: "ESO X-Shooter user manual Sec. 2.3.1" },
      ...(id !== "nir" ? [{ what: `${nOrd} orders (limited by the dichroic crossovers, not modeled)`, q: "nOrders", value: nOrd, info: true, src: "Vernet et al. 2011 Table 3" }] : []),
      ...(id === "nir" ? [{ what: `order ${mT} recorded over ${(oHi - oLo).toFixed(1)} nm`, q: "ordSpan", m: mT, value: (oHi - oLo) * 10, info: true, src: "Vernet et al. 2011 Table 3 (shorter than the dispersion x 2048 px implies)" }] : []),
    ],
  }; }),
  {
    id: "feros", tel: "MPG/ESO 2.2 m", name: "MPG 2.2 m / FEROS",
    note: "FEROS (1997 Final Design Report; Kaufer & Pasquini 1998; ESO user manual): 2.0″ fibers whose image a two-slice image slicer cuts into 1.0″-wide slits at f/11 (120 µm, 2.2 px on the detector), object and sky/calibration fibers (2 spectra), white-pupil collimator mirrors 1500 mm (beam 136 mm), R2 echelle 79 /mm (δ = 63.4°, θ = 0, γ = 0.6°), one LF5 prism of 55° in single pass at minimum deviation for 4623 Å, camera 410 mm, EEV 4096 × 2048 of 15 µm (dispersion along the long side).",
    state: { mode: "echelle", D: 2.2, F: 1500 / 136,
      e: { slitW: 1.0, nObj: 2, col: "mirror", W: 136, fcam: 410, eG: 79, eDelta: 63.4, gamma: 0.6, theta: 0, xd: "prism", xG: 300, xPsi: 10, xGlass: "LF5", xA: 55, xPasses: 1, xPrisms: null,
           lamC: 4623, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R = 48,000", q: "R", value: 48000, tol: 0.06, src: "Kaufer & Pasquini 1998; ESO FEROS manual" },
      { what: "coverage from 3560 Å", q: "lo", value: 3560, tol: 0.02, src: "ESO FEROS manual" },
      { what: "coverage to 9200 Å (orders 25–63)", q: "hi", value: 9200, info: true, src: "ESO FEROS manual (356–920 nm in 39 orders); the Final Design Report Sec. 2.2 says light \"up to 9 200 Å is in principle also available on the detector\". The model also places parts of orders 22–24 (to 10,200 Å) inside the 2048-px height, where orders 25–63 span 1968 px; the cause of the difference is not known (the model's red order spacing matches the published ~30 px)" },
      { what: "order spacing from ~30 px (orders 25–63)", q: "minSepPx", m1: 25, m2: 63, value: 30, tol: 0.1, src: "FEROS Final Design Report (30 to 100 px across the format)" },
    ],
  },
  {
    id: "harps", tel: "ESO 3.6 m", name: "ESO 3.6 m / HARPS",
    note: "HARPS (User Manual 2.4): fiber-fed, 1″ (70 µm) fibers entered as the slit of equal line width, 0.87″, at the spectrograph's own f/7.5 (the on-sky convention: the 1″ angle with the internal beam's focal ratio); R4 echelle 31.6 /mm at 75°, 0.721° out of plane, f_col 1560 mm (208 mm beam, f/7.5), FK5 grism 257.17 /mm (apex not published: set so the central wavelength passes undeviated), camera 728 mm, 4k × 4k 15 µm (chip gap not modeled). Central wavelength: order 115, which the manual places in the gap at the center of the mosaic.",
    state: { mode: "echelle", D: 3.566, F: 7.5,
      e: { slitW: S3 * 1.0, nObj: 2, col: "mirror", W: 208, fcam: 728, eG: 31.6, eDelta: 75, gamma: 0.721, theta: 0, xd: "grism", xG: 257.17, xPsi: 10,
           xGlass: "FK5HTi", xA: 40, xPasses: 1, lamC: 5316, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "R = 536.97 nm / (3.4 px x 0.0015 nm) = 105,000", q: "RAt", lam: 5369.7, value: 5369.7 / (3.4 * 0.015), info: true, src: "HARPS manual: the manual's sampling × dispersion, both scored below, so this line repeats them" },
      { what: "R 115,000 (measured)", q: "R", value: 115000, info: true, src: "HARPS manual Table 2.2 (ESO web page: 120,000)" },
      { what: "3.4 px per FWHM", q: "npix", value: 3.4, tol: 0.10, src: "HARPS manual Table 2.2 (other sources 3.2-4.1)" },
      { what: "coverage from 3800 Å", q: "lo", value: 3800, info: true, src: "HARPS manual Table 2.2. The model starts 72 Å redder: the same shortfall as the order range below" },
      { what: "coverage to 6900 Å", q: "hi", value: 6900, tol: 0.03, src: "HARPS manual Table 2.2" },
      { what: "reddest order 89", q: "mLo", value: 89, tol: 0, src: "HARPS manual Table 2.2 (an order number: exact)" },
      { what: "bluest order 161", q: "mHi", value: 161, info: true, src: "HARPS manual Table 2.2. The model's bluest order on the chip is 158: the model's order spacing runs 0.2–4.7% wider than the manual's (100.9 vs 100.7 px at order 89, 35.8 vs 34.2 px at order 161), so orders 159–161 fall past the chip's blue edge (the 81-px gap between the two CCDs, not modeled, would add to this)" },
      { what: "0.0015 nm/px in order 114 (536.97 nm)", q: "dlpixAt", lam: 5369.7, m: 114, value: 0.015, tol: 0.10, src: "HARPS manual Fig. 2.3" },
      { what: "order 160 to 161 separation 34.2 px", q: "minSepPx", m1: 160, m2: 161, value: 34.2, tol: 0.15, src: "HARPS manual Table 2.2 (the model's orders 160 and 161 lie off the chip; their spacing is taken at the blaze centers)" },
    ],
  },
  // VISTA / 4MOST: low-resolution (LRS) and high-resolution (HRS) spectrographs, three VPH arms each
  // (data/round4/4most.md).  LRS: 2016 design-review optics, confirmed by the 4MOST instrument-model (TOAD) table.
  // HRS: 2014-15 concept optics only; the camera focal length is fitted to the published bands.
  // x: LRS, the TOAD detector edges (A); HRS, the 4most.eu figure's R at lambda_c (read by eye, +/-100) and the model's percent above it and above the mean
  ...[["LRS", "blue", 1351, 18.65, 36.50, 4636, 3700, 5540, 0.308, [3671.3, 5549.4]], ["LRS", "green", 1220, 22.68, 44.86, 6254, 5240, 7210, 0.330, [5220.0, 7228.6]], ["LRS", "red", 925, 22.65, 44.82, 8243, 6910, 9500, 0.434, [6883.5, 9524.3]],
      ["HRS", "blue", 3586, null, null, 4152, 3926, 4355, 0.0720, ["19,800", 6, 5]], ["HRS", "green", 2836, null, null, 5460, 5160, 5730, 0.0958, ["19,300", 20, 15]], ["HRS", "red", 2343, null, null, 6464, 6100, 6790, 0.1137, ["20,250", 8, 9]]].map(([sp, arm, G, al, cam, lc, l0, l1, disp, x]) => {
    const lrs = sp === "LRS", W = lrs ? 200 : 250, fcol = lrs ? 600 : 750, fcam = lrs ? 345 : 375;
    return {
      id: "4most" + sp.toLowerCase()[0] + arm[0], tel: "VISTA 4.1 m (4MOST)", name: "VISTA / 4MOST " + sp + " " + arm + (lrs ? "" : " (concept optics)"),
      note: "VISTA 4MOST " + sp + " " + arm + " arm (de Jong et al. 2019; 4MOST User Manual; 4MOST spectrograph papers" + (lrs ? " and the 2023 instrument-model table" : "") + "): 85 µm fibers, 1.45″ on the sky; the explorer enters the core at the f/3.0 fiber output, 85 µm / (3.0 × 4.1 m) = 1.43″, as the slit of equal line width (1.23″); 824 spectra per detector (812 science + 12 calibration), collimator mirror " + fcol + " mm (beam " + W + " mm), VPH " + G + " /mm" + (lrs ? " at α = " + al + "°, camera at " + cam + "° to the collimator" : " at the symmetric setting") + ", camera " + fcam + " mm" + (lrs ? " (f/1.73, 2016 design review)" : " (fitted to the published bands: the HRS as-built optics are not public)") + ", 6144 × 6160 pixels of 15 µm.",
      state: { mode: "grating", D: 4.10, F: fcol / W,
        g: { slitW: S3 * 0.085 / (3.0 * 4100) * 206264.806, nObj: 824, col: "mirror", W, fcam, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
             psi: 35, tAlpha: al, Nx: 6144, Ny: 6160, pix: 15 } },
      pub: lrs ? [
        { what: disp + " Å/px at λc", q: "dlpix", value: disp, tol: 0.02, src: "4MOST instrument-model (TOAD) table, 2023" },
        { what: "detector from " + x[0] + " Å (the arm's band starts at " + l0 + " Å)", q: "lo", value: x[0], info: true, src: "4MOST TOAD table, 2023; band: Laurent et al. 2026 Sec. 2 and the 4MOST User Manual. Not a test: λc is TOAD's center wavelength and TOAD's center dispersion is scored above, so the edges follow; the dichroics set the band" },
        { what: "detector to " + x[1] + " Å (the arm's band ends at " + l1 + " Å)", q: "hi", value: x[1], info: true, src: "4MOST TOAD table, 2023 (see the line above)" },
        { what: "~3 px per resolution element (2.92 median)", q: "npix", value: 2.92, tol: 0.08, src: "Laurent et al. 2016 Sec. 4.5 (median 2.92 px); 4MOST User Manual: ~3" },
        { what: "R 4000–7700 across the LRS (mean 6500)", q: "R", value: NaN, info: true, src: "4most.eu Capabilities page; mean 6500 in de Jong et al. 2019 Table 1" },
      ] : [
        { what: disp + " Å/px at λc (instrument model)", q: "dlpix", value: disp, info: true, src: "4MOST TOAD table (the concept camera is fitted, so this is not an independent test)" },
        { what: "band " + l0 + "–" + l1 + " Å", q: "span", value: l1 - l0, info: true, src: "de Jong et al. 2019 Table 1" },
        { what: "R 18,000–21,000 across the HRS", q: "R", value: NaN, info: true, src: "4most.eu Capabilities page (mean 20,000 in de Jong et al. 2019 Table 1; TOAD ~22,500 at λc). The page's figure reads about " + x[0] + " at λc (by eye); the model's effective R is " + x[1] + "% above that and " + x[2] + "% above the 20,000 mean" },
      ],
    };
  }),
  // Subaru / PFS: blue, red (low resolution) and near-infrared arms of four identical fiber-fed VPH spectrographs
  // (data/round4/pfs.md); the medium-resolution red arm is a grism, which the explorer does not model
  ...[["blue", "b", 711.4, 7.2, 14.2, 4176, 4096, 0.7, 2500, 5000, 3800, 6500], ["red", "r", 556.7, 9.5, 16.5, 4176, 4096, 0.9, 3000, 8000, 6300, 9700],
      ["NIR", "n", 569.5, 14.9, 21.9, 4088, 4088, 0.8, 4500, 11000, 9400, 12600]].map(([arm, k, G, al, be, nx, ny, disp, Rp, lR, l0, l1]) => ({
    id: "pfs" + k, tel: "Subaru 8.2 m", name: "Subaru / PFS " + arm + " arm",
    note: "Subaru PFS " + arm + " arm (Sugai et al. 2015; Barkhouser et al. 2014 design table; Subaru/IPMU PFS pages): fibers delivering f/2.8; core 129 µm at the spectrograph (cable A; 127 µm at the focal plane, 1.12″ on the sky through the microlens; Sugai et al. 2015 Table 1), entered at f/2.8, 129 µm / (2.8 × 8.2 m) = 1.16″, as the slit of equal line width; 616 spectra per detector (600 science + 16 engineering), Schmidt collimator mirror 693.5 mm (the slit-to-collimator distance; beam 248 mm at f/2.8), VPH " + G + " /mm at α = " + al + "°, β = " + be + "° (design values), camera 300 mm f/1.09, " + nx + " × " + ny + " pixels of 15 µm.",
    state: { mode: "grating", D: 8.2, F: 2.8,
      g: { slitW: S3 * 0.129 / (2.8 * 8200) * 206264.806, nObj: 616, col: "mirror", W: 693.5 / 2.8, fcam: 300, gType: "trans", G, m: 1, lamB1: 5000,
           lamC: (Math.sin(al * Math.PI / 180) + Math.sin(be * Math.PI / 180)) / G * 1e7, psi: 35, tAlpha: al, Nx: nx, Ny: ny, pix: 15 } },
    pub: [
      { what: "~" + disp + " Å/px", q: "dlpix", value: disp, tol: 0.05, src: "Subaru/IPMU PFS parameter table (Subaru PFS page: the same)" },
      { what: "R ~" + Rp + " at " + lR + " Å", q: "RAt", lam: lR, value: Rp, info: true, src: "Subaru/IPMU PFS parameter table (\"As of July 2024\", measured before shipping). The model's fiber image (the 129 µm core) is 10–12% wider than the table's 3.0 px, so the model's R is 11–15% lower; the collimator focal length is not published and 693.5 mm is the slit-to-collimator distance; misses the 12% tolerance set beforehand in the blue and near-infrared arms" },
      { what: "3.0 px per FWHM", q: "npix", value: 3.0, info: true, src: "Subaru/IPMU PFS parameter table (FWHM over Å/px); see the R line" },
      { what: "band " + l0 + "–" + (l1) + " Å", q: "span", value: l1 - l0, info: true, src: "Subaru/IPMU PFS pages (the dichroics trim the arm's band)" },
    ],
  })),
  {
    id: "apogee", tel: "SDSS 2.5 m (APOGEE)", name: "SDSS / APOGEE-N",
    note: "APOGEE-N on the Sloan 2.5 m (Wilson et al. 2019, as-built prescription; SDSS DR16 pages): 120 µm fibers, 2.0″ on the sky at the telescope's f/5; the explorer enters the core at the f/3.85 VPH-mask stop, 120 µm / (3.85 × 2.5 m) = 2.57″, as the slit of equal line width, 2.23″; 300 spectra (≈230 science, 35 sky, 35 telluric), on-axis spherical collimator mirror 1053.6 mm (half the cold radius; beam 273.7 mm), VPH 1009.345 /mm at α = 54.061°, camera 356 mm, three H2RG 2048² of 18 µm side by side with 2.9 mm gaps (entered as 6466 px with the gaps as dead pixels; the gaps are not drawn). The detector center λc = 16158 Å is fitted to the published chip edges: the real detectors sit off the camera axis.",
    state: { mode: "grating", D: 2.5, F: 3.85,
      g: { slitW: S3 * 0.120 / (3.85 * 2500) * 206264.806, nObj: 300, col: "mirror", W: 1053.6 / 3.85, fcam: 356, gType: "trans", G: 1009.345, m: 1, lamB1: 5000, lamC: 16158,
           psi: 35, tAlpha: 54.061, Nx: 6466, Ny: 2048, pix: 18 } },
    pub: [
      { what: "coverage from 15140 Å", q: "lo", value: 15140, info: true, src: "Wilson et al. 2019 Sec. 4 (chip edges). Not a test: λc was fitted to the two outer edges" },
      { what: "coverage to 16960 Å", q: "hi", value: 16960, info: true, src: "Wilson et al. 2019 Sec. 4 (λc fitted to the edges)" },
      { what: "coverage width 1820 Å (15140–16960 Å)", q: "span", value: 1820, info: true, src: "Wilson et al. 2019 Sec. 4. Independent of the λc fit, but the width is the three chips' dispersion × 2048 px plus the two gaps, so the width repeats the three chip-center lines below" },
      ...[[15475, 0.326, "blue"], [16145, 0.283, "green"], [16715, 0.236, "red"]].map(([l, v, c]) => ({ what: v + " Å/px at the " + c + " chip's center (" + l + " Å)", q: "dlpixAt", lam: l, m: 1, value: v, tol: 0.015, src: "SDSS DR16 \"Using APOGEE Spectra\" page, central dispersion of each chip; chip centers from the edges of Wilson et al. 2019" })),
      ...[[15400, 0.326], [16100, 0.282], [16600, 0.235]].map(([l, v]) => ({ what: v + " Å/px \"at " + (l / 1e4).toFixed(2) + " µm\"", q: "dlpixAt", lam: l, m: 1, value: v, info: true, src: "Wilson et al. 2019 Table 1 (also Majewski et al. 2017). At the stated wavelengths the model is 1.0%, 2.8% and 5.9% finer; the values match the chip centers (lines above), so the wavelength labels are nominal" })),
      { what: "measured R = 22,500 (nominal; chip medians 22,000–23,700)", q: "R", value: 22500, info: true, src: "Wilson et al. 2019 (abstract; Table 1 medians). The model's effective R is 12% higher: the measured line profile is wider than the geometric fiber image, which the model does not blur" },
    ],
  },
  ...[["B", 1103.5, 11.48, 212.8, 3600, 5930, 2000, 3000], ["R", 1157.4, 18.73, 213.6, 5660, 7720, 3500, 4500], ["Z", 992.5, 21.19, 214.0, 7470, 9800, 4000, 5500]]
    .map(([arm, G, al, fc, l0, l1, r0, r1]) => ({
      id: "desi" + arm.toLowerCase(), tel: "Mayall 4 m (DESI)", name: `Mayall / DESI ${arm} arm`,
      note: `DESI ${arm} arm (DESI Collaboration 2022; Final Design Report): fiber-fed, 107 µm core, 1.585″ on the sky at the field center; the explorer enters the core at the f/3.57 collimator, 107 µm / (3.57 × 3.797 m) = 1.63″, as the slit of equal line width, 1.41″; f/3.57 collimator with a 126 mm pupil, transmission grating ${G} /mm at ${al}° incidence (as built), ${fc} mm f/1.7 camera, 4k × 4k 15 µm. Central wavelength = middle of the arm's band.`,
      state: { mode: "grating", D: 3.797, F: 3.57,
        g: { slitW: S3 * 0.107 / (3.57 * 3797) * 206264.806, nObj: 500, col: "mirror", W: 126, fcam: fc, gType: "trans", G, m: 1, lamB1: 5000, lamC: (l0 + l1) / 2,
             psi: 35, tAlpha: al, Nx: 4096, Ny: 4096, pix: 15 } },
      pub: [
        { what: `R ≈ ${r0} at ${l0} Å`, q: "RAt", lam: l0, value: r0, info: true, src: "DESI Collaboration 2022 Sec. 7.2 (\"approximately\" ${r0}–${r1} for the arm, read here as the values at the band edges). The model's effective R falls 7–9% short at the blue end of every arm and 12% short at the red end of Z; at the red ends of B and R the model is 3% above and 2% below" },
        { what: `R ≈ ${r1} at ${l1} Å`, q: "RAt", lam: l1, value: r1, info: true, src: "DESI Collaboration 2022 Sec. 7.2 (see the line above)" },
        { what: "fiber image 107 µm x 0.48 = 3.42 px (spatial magnification; the spectral image is wider by cos α / cos β)", q: "diam", value: 107 * 0.48 / 15, info: true, src: "DESI 2022 Sec. 7.2" },
        { what: `band from ${l0} Å on the chip`, q: "lo", value: l0, tol: 0.03, src: "DESI FDR" },
        { what: `band to ${l1} Å on the chip`, q: "hi", value: l1, tol: 0.03, src: "DESI FDR" },
      ],
    })),
  ...[["blue", 2101, 4848, 3600, 5900], ["red", 1157, 8011, 5700, 10000]].map(([arm, G, lc, l0, l1]) => ({
    id: "boombox" + arm[0], tel: "Via (MMT and Magellan 6.5 m)", name: `Via / Boombox ${arm} (partly guessed)`,
    note: `Boombox ${arm} channel (Via technical document): 6.5 m, 200 µm (1.2″) unmasked fibers, refractive-triplet collimator, binary transmission grating, f/1.5 camera, 2048 × 256 CCD with 15 µm pixels, band ${l0}-${l1} Å. GUESSED (the prescription is not in the document): fiber output f/5.3 as for Viaspec (the core enters at f/5.3, 200 µm / (5.3 × 6.5 m) = 1.20″, as the slit of equal line width, 1.04″), a 35 mm beam shared by both channels, and the groove density (${G} /mm) and central wavelength solved so the band exactly fills the 2048 pixels. Coverage therefore matches by construction. R and sampling depend on the guesses: the fiber image on the detector is 200 µm × f/1.5 / f/5.3, so both scale with the guessed f/5.3 (the dispersion is fixed by the documented band and pixel count).`,
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
