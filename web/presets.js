/* Instrument presets for the Instrument Explorer.  Parameters come from the documents collected in
   rawdata/presets/ and tabulated, with page references and verbatim quotes, in data/presets_research.md,
   data/round4/*.md and data/round5/*.md (Via: ~/via/docs/technical/technical.tex and
   ~/via/docs/requirements/science_requirements.tex).  Each preset has an id, a telescope group (tel), a
   menu name ("Telescope / Instrument ..."; the menu drops the part before the slash), a note on where the
   numbers come from, the explorer state, and "pub": the published performance validate.js checks.
   An instrument with several settings (arms, channels, gratings, bands) is one line in the Preset menu (inst) and its
   presets are picked in the Setting menu beside it (setting); presets without inst are one line each.
   pub entries: { what, q, value, tol, src } or { ..., info: true }.
     q (what the model returns):
       R          effective resolving power at the central wavelength (slit and diffraction in quadrature; no pixel term);
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
                  when given;  alphaDeg: grating incidence angle (deg);  devDeg: a prism train's deviation of λc (deg)
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
     (Hectochelle f/5.4, M2FS f/3.4 (pupil-fed fibers: f/3.4 is the fiber output and the collimator's ratio), IFUM
     f/3.4 (the collimator's ratio; the fibers deliver f/3.3), DESI f/3.57, APOGEE f/3.85, PFS f/2.8, 4MOST f/3.0, LLAMAS f/4.0, Boombox f/5.2
     from the fiber cone in its Zemax layout); this angle differs from the published on-sky size where F_out differs from the feed's ratio.
     traceW (arcsec): the width of a trace ACROSS the dispersion when it differs from the slit width (Via's
     0.7" mask narrows only the dispersion direction; across it each trace is the 1.2" fiber, entered as 1.04").
   - Collimator type (col) changes only the drawing: mirror for LRIS, HIRES, MagE, FIRE, LLAMAS, ESI, KCWI/KCRM,
     DEIMOS, ZShooter, Hectospec, Hectochelle, G-CLEF, ESPRESSO, UVES, X-Shooter, FEROS, HARPS, 4MOST, PFS, APOGEE,
     DESI and Via; lens for MIKE and M2FS/IFUM (one lens group in double pass as collimator and camera), IMACS,
     LDSS-3, MOSFIRE, Binospec, FORS2, MUSE and Boombox.  DEIMOS and Binospec gratings are plane REFLECTION gratings.
   - Camera type (cam) changes only the drawing as well: a catadioptric mirror camera with an internal focus (a
     corrector, a spherical mirror, the detector and its dewar inside the beam) for HIRES (Vogt et al. 1994),
     Hectospec (Fabricant et al. 2005; hardware manual) and Hectochelle (Szentgyorgyi et al. 2011); a lens elsewhere.
   - Layout values (drawing only, from the sources' layouts): Hectospec and Hectochelle are Schmidt-geometry benches,
     an on-axis spherical collimator (tilt 0, the fiber slit inside the returning beam) with the grating at the
     mirror's center of curvature, 2749 mm (hardware manual, as-built Zemax prescription) and 2737 mm (Szentgyorgyi
     et al. 2011, Table 2) from the collimator.  ON-AXIS COLLIMATORS ARE SET EXPLICITLY (colTilt 0); left unset, a
     mirror collimator gets the automatic off-axis tilt, so check the source for every new mirror-collimator preset.
     On-axis, with the slit in the returning beam: Hectospec, Hectochelle, LLAMAS (pocket guide: "simple on-axis f =
     200mm sphere"), APOGEE (Wilson et al. 2019: "on-axis uncorrected Schmidt camera for a collimator"), PFS (Vives et
     al. 2012; Pascal et al. 2014: a Schmidt collimator "at the expense of the central obscuration"), DESI (DESI 2022
     Sec. 7.1: the light passes "a slot in the NIR dichroic" and is "reflected directly back toward the fiber slit
     array") and Viaspec (the Zemax layout of the Via technical document; the Via team).  Viaspec's fold mirror
     (deviation 112.9 deg, at 0.78 of the path) and the 2750 mm collimator-to-grating path are MEASURED from that
     layout, scaled by the 1375 mm slit-to-collimator distance (the path measures 2730 mm; 2750 = 2 f_col, the
     Schmidt condition that puts the pupil on the grating).  HIRES tilts its spherical collimator by 1.75 deg (Vogt et al. 1994)
     and the collimator-to-echelle path, 2940 mm, is MEASURED from the side view of Vogt et al. Fig. 1, scaled by
     the 4155 mm slit-to-collimator distance; the LRIS red grating sits near the telescope focal plane (Oke et al.
     1995), so the collimator-to-grating path is set to f_col, 2000 mm.
   - The layout audit of 2026-11-17 (data/audit/2026-11-17_layout_*.md) added, each in the preset's note with its source:
     grating distances (layLen) for DESI 900 (2 f_col, MEASURED from DESI 2022 Fig. 14), PFS 1550 (MEASURED, Vives et
     al. 2014 Fig. 2), LLAMAS 400 (the center of curvature, Furesz et al. 2020), KCWI/KCRM 4345 (Morrissey et al. 2018
     Table 1) with the fold FM1 (foldAng 210 at 0.73, colTilt 9.4, MEASURED from Fig. 8), APOGEE 2104 (Wilson et al.
     2019 Table 5) with both folds, ESI 2930 and colTilt 4.4 (MEASURED, Sheinis et al. 2002 Fig. 1), FIRE 627 (Simcoe et
     al. 2013 Table 2), G-CLEF 2650 and ZShooter 1500 (MEASURED from their layouts), 4MOST HRS 1730 with colTilt 7.7 and
     the dichroic's 145 deg turn (MEASURED, Hansen et al. 2015 Fig. 1); LRIS colTilt 4.65 (MEASURED, Oke et al. 1995
     Fig. 1). camLen (drawing only: disperser to the camera, the thin lens or a mirror camera's corrector): Viaspec 658
     (the detector 1068 mm past the grating, MEASURED from the Zemax layout), Binospec 811 (1215 past the grating,
     Fabricant et al. 2019), Boombox 267 and 229 (the bench layout), HIRES 2159 (85.0 inches, Vogt et al. 1994 Sec. 3.4).
     foldLabel names a fold that is a dichroic (Boombox blue, 4MOST HRS). preFoldOn / preFoldAng / preFoldPos: a flat
     between the slit and the collimator, its distance from the collimator as a fraction of f_col (APOGEE's Fold Mirror
     1: 90 deg at 343.281 / 1052 mm; Spectral view only). filtShow draws the order filter beside the slit (M2FS,
     Hectochelle); xDraw gives the prisms a double-pass 3D view draws where the model uses an equivalent prism (MIKE
     blue). PFS's cameras are catadioptric (cam "mirror").
   - Double pass (dpass, echelle mode, drawing only): MIKE's one lens group is both collimator and camera, the
     prisms are crossed twice and the echelle stands 400 mm (red) and 600 mm (blue) from the lens, the cameras'
     external stop (Bernstein et al. 2003, Sec. 2.2).
   - DEIMOS (data/layout/deimos.md): the flat tent mirror in the collimated beam folds the beam 47 deg toward the
     slit-mask side (face 18.5 deg to the axis: DEEP2 optical model TNT_ANG 71.5 deg, tent drawing D3605; the beam
     arrives 5.1 deg off the axis from the 4.5' field center) at 0.73 of a 2443 mm collimator-to-grating path, the
     grating standing at the collimator's pupil image; the fold, the 0.73 and the 2443 mm are COMPUTED from those
     sourced pieces and checked against the camera axis on drawing D0001.  The collimator tilt, -2.8 deg, is half the
     5.7 deg between the incoming chief ray and the returned beam (the slit lies off the collimator's axis, the
     returned beam passes inboard of the slit mask); the grating is Flipped so that the camera sits outboard of the
     slit mask, as in the Keck layout drawing.
   - Number of objects (nObj) counts every spectrum on the detector: single-object slits 1 (HIRES, MIKE, MagE,
     FIRE, ESI, UVES, X-Shooter, ZShooter); fiber spectrographs all fibers on the slit, science, sky and calibration
     (HARPS 2, FEROS 2, ESPRESSO 4 = 2 fibers x 2 pupil slices, G-CLEF MR 3, Boombox 36, M2FS 128, Hectochelle 240,
     APOGEE 300, Hectospec 300, LLAMAS 300 per detector, DESI 500, PFS 616, Via 660, 4MOST 824); IFUs the spaxels
     per detector (IFUM LSB 180, KCWI/KCRM 3330, MUSE 3600); slit masks an average per mask from published masks or surveys
     (LDSS-3 17, MOSFIRE 28, LRIS 30, FORS2 50, IMACS 51, DEIMOS 129) or, where no average was found, a capacity
     (Binospec 150).  The LRIS preset itself uses a long slit; its nObj is the mask average.
   - Order filter (filt, grating mode: [lo, hi] in Å): a single-order setup isolated by a filter (M2FS); only the
     filter's band reaches the detector and the neighboring orders are blocked, so no overlap warning.
   - Fiber groups (fgroups: [fibers per group, pitch, gap], µm on the detector, center to center; the gap from the
     last fiber of one group to the first of the next): the traces drawn as the fibers sit on the pseudo-slit
     (M2FS 8 x 16, measured; IFUM LSB 10 x 18, read from a figure), in place of an even spread.
   - X-Shooter: collimator and camera focal lengths are not published; the effective ones come from the
     published slit and camera plate scales on the 8115 mm Cassegrain pupil and the published beams; the NIR
     prisms use the cryogenic (105 K) glass indices. */
(function (root) {
"use strict";
const S3 = Math.sqrt(3) / 2;
const PRESETS = [
  {
    id: "lris", tel: "Keck 10 m", name: "Keck / LRIS red, 600/7500, 1″",
    note: "Keck I LRIS red channel (Oke et al. 1995; Keck grating table): f_col 2000 mm, camera 305 mm, 44° camera–collimator angle, 600/7500 grating, 4k × 4k 15 µm (the LBNL \"Mark IV\" CCD installed in 2021, which replaced the 1995 2048 × 2048 detector). The beam is entered as 2000/13.7 = 146 mm, which keeps the collimator and the plate scale (Oke et al. 1995 Sec. 3 call it \"the 141 mm collimated beam\"). The preset uses a 1″ long slit; the preset's 30 objects are the average slit-mask load of the z ~ 3 surveys (25–35 per mask; Steidel et al. 2003, Cooke et al. 2005). The collimator turns the beam 9.3° from the arriving light, a 4.65° tilt (MEASURED from Oke et al. 1995, Fig. 1).",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 1, nObj: 30, col: "mirror", colTilt: 4.65, layLen: 2000, W: 2000 / 13.7, fcam: 305, gType: "refl", G: 600, m: 1, lamB1: 7500, lamC: 7500, psi: 44, tAlpha: null, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "dispersion 0.80 Å/px", q: "dlpix", value: 0.80, tol: 0.05, src: "Keck LRIS grating table" },
      { what: "coverage 3275 Å", q: "span", value: 3275, info: true, src: "Keck LRIS grating table (the tabulated coverage is the tabulated dispersion × 4094 px, 3275/0.80, and the page calls both calculated: this line repeats the dispersion line)" },
      { what: "R = 7500/4.7 Å FWHM (1″)", q: "R", value: 7500 / 4.7, info: true, src: "Keck LRIS grating table. The table does not say the red FWHMs are measured (its dispersions are \"calculated and are not measured values\") and gives no wavelength; the same 4.7 Å is listed for the 600/5000, 600/7500 and 600/10000 gratings, and the model's slit width falls from 5.2 Å at 5000 Å to 4.6 Å at 10,000 Å, so 4.7 Å matches the geometry near 9000 Å" },
      { what: "pixel scale 0.135″/px", q: "pixScale", value: 0.135, tol: 0.05, src: "Keck LRIS detectors page" },
    ],
  },
  {
    id: "hires", tel: "Keck 10 m", name: "Keck / HIRES red XD, 0.861″",
    note: "Keck I HIRES with the red cross-disperser (Vogt et al. 1994; HIRES manual 1994; Keck pages): R2.8 echelle 52.68 /mm at 70.5°, in plane with 2θ = 10°, 250 /mm cross-disperser turning 40°, f_col 4155 mm, camera 763 mm, 3-chip 15 µm mosaic (gaps not modeled). Central wavelength 6043 Å, the blaze of order 59, so that the results strip is evaluated at the chip's center (no source gives a standard setting's center). The camera's corrector is drawn 2159 mm (85.0 inches) past the echelle, the distance at which the camera's entrance pupil lies ahead of the corrector (Vogt et al. 1994, Sec. 3.4). Since a warm-up in August 2026 the three chips cannot all be read at once (Keck HIRES news, September 2026), and Keck plans to decommission HIRES no earlier than the end of 2027B (Keck instrument availability, November 2026).",
    state: { mode: "echelle", D: 10.95, F: 13.7,
      e: { slitW: 0.861, nObj: 1, col: "mirror", cam: "mirror", colTilt: 1.75, layLen: 2940, camLen: 2159, W: 4154.7 / 13.7, fcam: 762.7, eG: 52.68, eDelta: 70.5, gamma: 0, theta: 5, xd: "grating", xG: 250, xPsi: 40,
           xGlass: "silica", xA: 40, xPasses: 1, lamC: 6043, Nx: 4096, Ny: 6144, pix: 15 } },
    pub: [
      { what: "R 50,000 at 0.861″ (measured: red cross-disperser, ThAr lines near 5240 Å)", q: "RAt", lam: 5240, value: 50000, tol: 0.05, src: "Keck HIRES \"Available Slits and Resolutions\" table, deckers B5/C1–C3, \"Resolution (measured+)\": \"Using Red cross-disperser. Average of 4 Th/Ar lines near 5240 A\"" },
      { what: "R (calculated) 48,000 at 0.861″, slit-limited", q: "Rs", value: 48000, info: true, src: "Keck HIRES slit table, calculated column (R × slit = 40,800–41,300″ across the rows). The column uses the HIRES manual's de-projection factor 1/8.715 (12.02″/mm), while the same sentence of the manual gives 12.44″/mm, which the geometry reproduces: 3.5% higher R (DERIVED, audit S1)" },
      { what: "spatial scale about 0.12″/px", q: "pixScale", value: 0.12, tol: 0.10, src: "Keck HIRES binning page" },
      { what: "1.67 Å/mm in order 62 at 5748 Å (x 15 µm)", q: "dlpixAt", lam: 5748.2, m: 62, value: 1.67 * 0.015, tol: 0.03, src: "HIRES manual App. E" },
      { what: "orders outgrow the detector above ≈ 6360 Å", q: "gap", value: 6360, tol: 0.02, src: "HIRES manual (1994) App. E: the free spectral range of order 57 (6252 Å) is 60.41 mm and of order 56 (6364 Å) 61.49 mm long, so the orders first exceed the 61.44 mm mosaic near 6360 Å (DERIVED); the Keck HIRES page says coverage is complete shortward of 6200 Å, and the user notes give about 6000 Å" },
      { what: "orders outgrow the detector above ~6000 Å", q: "gap", value: 6000, info: true, src: "HIRES CCD upgrade notes (\"longward of about 6000 Angstroms\"; approximate)" },
    ],
  },
  {
    id: "mikered", tel: "Magellan 6.5 m", name: "Magellan / MIKE red, 1″", inst: "MIKE", setting: "red, 1″",
    note: "Magellan Clay MIKE red arm (Bernstein et al. 2003 manuscript; Bernstein et al. 2015; LCO manual): R2 echelle 52.6 /mm at 63.5° (Bernstein et al. 2003's wavelengths require 52.6; the 2014 Richardson catalog lists the 63.5° master at 52.67 /mm), quasi-Littrow with the camera axis about 30 mm from the injection optics' axis, out of the dispersion plane (γ ≈ 1.7°, INFERRED from Bernstein et al. 2003 Fig. 1 and Sec. 2.3; θ = 0), double-pass 500 mm camera/collimator at f/3.3, one 47° PBM2 prism in double pass, 2k × 4k 15 µm. Central wavelength 6100 Å puts the LCO standard setting's orders (37–70, 4900–9300 Å) on the chip. The preset reproduces the 2002 design (R 19,000 at 1″, 105 µm per arcsecond); Bernstein et al. 2015 Table 1 gives the as-built instrument R 22,000 (FWHM, 1.0″ slit) and 7.5 px per arcsecond, for reasons not published.",
    state: { mode: "echelle", D: 6.5, F: 500 / 150,
      e: { slitW: 1, nObj: 1, col: "lens", dpass: true, layLen: 400, W: 150, fcam: 500, eG: 52.6, eDelta: 63.5, gamma: 1.7, theta: 0, xd: "prism", xG: 300, xPsi: 10,
           xGlass: "PBM2Y", xA: 47, xPasses: 2, lamC: 6100, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R 19,000 at 1″ (design, slit-limited)", q: "Rs", value: 19000, tol: 0.08, src: "Bernstein et al. 2003 (54,000 at 0.35″, the same R × slit; LCO manual: 22,000)" },
      { what: "1″ = 105 µm at the CCD", q: "pixScale", value: 15 / 105, tol: 0.08, src: "Bernstein et al. 2003" },
      { what: "orders 32–68: centers 29.27 mm apart across the dispersion (design)", q: "ySpan", m1: 32, m2: 68, value: 29.27, tol: 0.02, src: "Bernstein et al. 2003 Fig. 6, the design echellogram, digitized on the plotted axis (±0.05 mm per order line; audit S1)" },
      { what: "orders 37–70 in the standard setting", q: "mHi", value: 70, tol: 0, src: "LCO MIKE manual Sec. 8B.2 (\"Orders 37 – 70 ... 9300-4900 Å\"); Bernstein et al. 2015: 4900–9500 Å. The chip also holds parts of orders 34–36 (to 9960 Å; the manual's red range runs to 10,000 Å)" },
      { what: "coverage from 4900 Å", q: "lo", value: 4900, tol: 0.02, src: "LCO MIKE manual Sec. 8B.2 (the standard setting)" },
      { what: "R 22,000 at 1″ (as built)", q: "R", value: 22000, info: true, src: "Bernstein et al. 2015 Table 1 (\"Resolution (FWHM; 1.0′′ slit)\"); LCO manual. The model, which follows the 2002 design, is 13% lower; the method of the measurement is not published" },
      { what: "7.5 px per arcsecond along the slit (as built)", q: "pixScale", value: 1 / 7.5, info: true, src: "Bernstein et al. 2015 Table 1; the measured slit lengths (their Fig. 3) are 4.5–7% longer than the model's design scale" },
      { what: "minimum order separation 6″ (orders 31-69)", q: "minSepArcsec", m1: 31, m2: 69, value: 6, tol: 0.15, src: "Bernstein et al. 2003" },
    ],
  },
  {
    id: "mikeblue", tel: "Magellan 6.5 m", name: "Magellan / MIKE blue, 1″", inst: "MIKE", setting: "blue, 1″",
    note: "Magellan Clay MIKE blue arm (Bernstein et al. 2003 manuscript; Bernstein et al. 2015; LCO manual): R2.6 echelle 52.67 /mm at 69.0° (Richardson's master 53-*-417E, the same ruling as M2FS's; Bernstein et al. 2003's wavelengths require 52.67), quasi-Littrow with the camera axis about 30 mm from the injection optics' axis, out of the dispersion plane (γ ≈ 1.6°, INFERRED; θ = 0), double-pass 550 mm camera/collimator, two 38° fused-silica prisms in double pass, entered as \"the equivalent of a single 62 deg apex angle prism\" (Bernstein et al. 2003) in double pass, 2k × 4k 15 µm. Central wavelength 3900 Å puts the LCO standard setting's orders (71–106, 3350–5000 Å) on the chip. The preset reproduces the 2002 design (R 25,000 at 1″, 115 µm per arcsecond); Bernstein et al. 2015 Table 1 gives the as-built instrument R 28,000 (FWHM, 1.0″ slit) and 8.2 px per arcsecond, and calls the blue echelle R2.4 (the 2002 design paper, R2.6).",
    state: { mode: "echelle", D: 6.5, F: 550 / 150,
      e: { slitW: 1, nObj: 1, col: "lens", dpass: true, layLen: 600, W: 150, fcam: 550, eG: 52.67, eDelta: 69.0, gamma: 1.6, theta: 0, xd: "prism", xDraw: [{ glass: "silica", A: 38 }, { glass: "silica", A: 38 }], xG: 300, xPsi: 10,
           xGlass: "silica", xA: 62, xPasses: 2, lamC: 3900, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R 25,000 at 1″ (design, slit-limited)", q: "Rs", value: 25000, tol: 0.08, src: "Bernstein et al. 2003 (71,000 at 0.35″, the same R × slit; LCO manual: 28,000)" },
      { what: "1″ = 115 µm at the CCD", q: "pixScale", value: 15 / 115, tol: 0.08, src: "Bernstein et al. 2003" },
      { what: "orders 74–107: centers 29.21 mm apart across the dispersion (design)", q: "ySpan", m1: 74, m2: 107, value: 29.21, tol: 0.02, src: "Bernstein et al. 2003 Fig. 6, digitized (audit S1); the text gives 29 mm. Four passes of the two 38° prisms, each at minimum deviation, gave 5% less: the equivalent prism Bernstein et al. state reproduces the design" },
      { what: "orders 71–106 in the standard setting", q: "mHi", value: 106, tol: 0, src: "LCO MIKE manual Sec. 8B.2 (\"Orders 71-106 ... 5000 – 3350 Å\"); the chip also holds part of order 70" },
      { what: "R 28,000 at 1″ (as built)", q: "R", value: 28000, info: true, src: "Bernstein et al. 2015 Table 1; LCO manual. The model, which follows the 2002 design, is 12% lower; the method of the measurement is not published" },
      { what: "8.2 px per arcsecond along the slit (as built)", q: "pixScale", value: 1 / 8.2, info: true, src: "Bernstein et al. 2015 Table 1" },
      { what: "minimum order separation 6″ (orders 74-107)", q: "minSepArcsec", m1: 74, m2: 107, value: 6, tol: 0.15, src: "Bernstein et al. 2003" },
    ],
  },
  {
    id: "mage", tel: "Magellan 6.5 m", name: "Magellan / MagE, 1″",
    note: "Magellan MagE echellette (Marshall et al. 2008; LCO MagE manual; moved from Clay to Baade in October 2015, Rigby et al. 2018 Sec. 2.2; f/11 assumed at Baade, INFERRED): off-axis paraboloid collimator 1094 mm (beam 99 mm), vacuum Schmidt camera 138 mm (f/1.4), 175 /mm echellette with δ = 32.3°, quasi-Littrow (angles not published: 0 here), fused-silica prisms 46° in double pass and 40° single pass (three passes, each at minimum deviation; the rotation angles are not published), E2V 42-20 2048 × 1024 of 13.5 µm. The central wavelength (4150 Å) is chosen to put orders 6–20 on the chip; the source does not give one.",
    state: { mode: "echelle", D: 6.5, F: 11.0,
      e: { lay3d: "pp", xPre: 1, xDbl: 1, slitW: 1, nObj: 1, col: "mirror", cam: "mirror", W: 1094 / 11.0, fcam: 138, eG: 175, eDelta: 32.3, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10,
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
    note: "Magellan Baade FIRE echellette mode (Simcoe et al. 2013, Table 2 prescription): f/11, off-axis paraboloid collimator 555 mm (beam 50 mm in the papers; 555/11 = 50.45 mm entered so that f_col = 555 mm), camera 176.8 mm, R1 echellette 54.49 /mm (δ = 46°, quasi-Littrow; θ and γ not published: 0 here), cryogenic prisms Infrasil 42.6°, 28.1°, 28.1° and ZnSe 21.81° × 3 (six passes; the explorer puts all six passes after the echelle and at minimum deviation, while FIRE's prisms sit deliberately off minimum deviation to squeeze the beam, so the cross-dispersion here is 1.35–1.53× too small, 1.43× over orders 11–31, by PypeIt's measured order positions; the passes before the echelle also shift each order along the dispersion, so the real order centers sit up to 151 px (order 31) and 66 px (order 11) from the model's, INFERRED), H2RG 2048 × 2048 of 18 µm; λc 1.20 µm derived. The echelle stands 627 mm from the collimator (the axial spacings of Simcoe et al. 2013, Table 2); the cold pre-slit optics (two flats and an Offner relay) and an 11.65 mm flat 85 mm past the slit, turned out of the page (Table 2), are not drawn.",
    state: { mode: "echelle", D: 6.5, F: 11,
      e: { lay3d: "pp", xPre: 3, xDbl: 2, slitW: 0.6, nObj: 1, col: "mirror", layLen: 627, W: 555 / 11, fcam: 176.8, eG: 54.49, eDelta: 46, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10, xGlass: "Infrasil-105K", xA: 40, xPasses: 1,
           xPrisms: [{ glass: "Infrasil-105K", A: 42.6 }, { glass: "Infrasil-105K", A: 28.1 }, { glass: "ZnSe-105K", A: 21.81 }, { glass: "ZnSe-105K", A: 21.81 }, { glass: "Infrasil-105K", A: 28.1 }, { glass: "ZnSe-105K", A: 21.81 }],
           lamC: 12000, Nx: 2048, Ny: 2048, pix: 18 } },
    pub: [
      { what: "R = 6000 at 0.6″, the design requirement (slit-limited)", q: "Rs", value: 6000, info: true, src: "Simcoe et al. 2013 Sec. 2 (\"the requirement that a 'typical' slit deliver R = 6000\", a design figure; no measured R found). The model gives 5520 at the order center and 5780 at the red end of an order" },
      { what: "12.5 km/s per pixel", q: "kmspx", value: 12.5, info: true, src: "Sullivan & Simcoe 2012 Sec. 3.4 (also Simcoe et al. 2011: 50 km/s over 4 px). The sampling falls along each order from 16.9 to 12.3 km/s/px (PypeIt's arc solution); 12.5 describes the red end of an order, where the model gives 12.4. At the order centers the arcs give 14.7–15.0 and the model 14.7" },
      ...[[16, 16501.0, 0.8114], [22, 11968.4, 0.5919]].map(([m, l, v]) => ({ what: v + " Å/px in order " + m + " at " + l + " Å (measured)", q: "dlpixAt", lam: l, m, value: v, tol: 0.02, src: "PypeIt's archived FIRE wavelength solution (magellan_fire_echelle.fits, commit c1798aa), at the middle of the order's 2040 px (DERIVED)" })),
      { what: "orders 11–32 on the chip, 0.82–2.51 µm", q: "nOrders", value: 22, info: true, src: "Simcoe et al. 2013 (the explorer's minimum-deviation prisms fit more orders: see the note)" },
      { what: "0.15″/px along the dispersion (paper) or 0.18″/px (web)", q: "specScale", value: 0.15, info: true, src: "Simcoe et al. 2013 Sec. 2 (\"a pixel pitch of 0.15″ in the spectral direction\", the design figure); MIT FIRE specifications page: 0.18. The scale varies along each order: the model gives 0.163″/px at the order center, 0.144″ at the red end (the paper's figure) and ≈ 0.18″ at the blue end (the web's)" },
      { what: "0.12″/px (reddest order) to 0.09″/px (bluest) along the slit", q: "pixScale", value: NaN, info: true, src: "Simcoe et al. 2013 Sec. 3.2.3. FIRE's prisms compress the beam to 50 × 30 mm; the model's prisms at minimum deviation do not, so it gives the uncompressed scale" },
    ],
  },
  {
    id: "imacs", tel: "Magellan 6.5 m", name: "Magellan / IMACS f/4, 1200 l/mm, 0.7″",
    note: "Magellan Baade IMACS long (f/4) camera (Dressler et al. 2011; LCO IMACS user manual and grating-tilt calculator; collimator from the 1998 Carnegie design specification): f/11 Nasmyth, refractive collimator 1648 mm (beam 150 mm), camera 641.8 mm, fixed 45° camera–collimator angle, 1200 l/mm reflection grating with a 32.7° blaze angle, tilted 32.4° for λc ≈ 8250 Å, Mosaic 8192 × 8192 of 15 µm (eight 2k × 4k chips; the spectra cross three gaps of 92 px, 1.38 mm, that the model leaves out, 3.4% of the coverage: with the gaps the central slit covers 7435–9052 Å); 51 slits per mask (mean of 25 published dwarf-galaxy masks).",
    state: { mode: "grating", D: 6.5, F: 11.0,
      g: { slitW: 0.7, nObj: 51, col: "lens", W: 1648.46 / 11.0, fcam: 641.8, gType: "refl", G: 1200, m: 1, lamB1: 2 * Math.sin(32.7 * Math.PI / 180) / 1200 * 1e7, lamC: 8250, psi: 45, tAlpha: null,
           Nx: 8192, Ny: 8192, pix: 15 } },
    pub: [
      { what: "0.19 Å/px", q: "dlpix", value: 0.19, tol: 0.03, src: "Simon et al. 2017; Li et al. 2018" },
      { what: "R ≈ 11,000 (0.7″), as stated", q: "Rs", value: 11000, info: true, src: "Simon et al. 2017, 2020; Li et al. 2018: a rounded statement with no method given (Simon et al. 2017 quote the same R for the 1200/26.7° Hα setup, whose slit-limited R is ≈ 9000); 11,000 equals λ over 4 px × 0.19 Å/px at 8250 Å, which suggests a nominal 4-pixel width; not scored" },
      { what: "coverage from ~7400 Å", q: "lo", value: 7400, tol: 0.015, src: "Simon et al. 2017" },
      { what: "coverage to ~9000 Å", q: "hi", value: 9000, tol: 0.015, src: "Simon et al. 2017" },
      { what: "0.111″/px", q: "pixScale", value: 0.111, tol: 0.01, src: "LCO IMACS user manual; Bigelow & Dressler 2003" },
    ],
  },
  // Magellan / LLAMAS: three arms of fiber-fed VPH spectrographs; the gratings are not published (data/round4/llamas.md)
  ...[["blue", 2233, 4222, 3417, 4947, 0.762, "1500–2500"], ["green", 1425, 5923, 4634, 7100, 1.204, "1400–2400"], ["red", 1070, 8466, 6771, 10000, 1.609, "1750–2500"]].map(([arm, G, lc, l0, l1, disp, Rlab]) => ({
    id: "llamas" + arm[0], tel: "Magellan 6.5 m", name: "Magellan / LLAMAS " + arm + " (grating fitted)", inst: "LLAMAS (gratings fitted)", setting: arm,
    note: "Magellan LLAMAS IFU, " + arm + " arm (Furesz et al. 2020; Frostig et al. 2020 for the f/4.4 to f/4.0 conversion and the 95.6%; the 2017 pocket guide for the 200 mm collimator; MIT LLAMAS pages, exposure-time calculator and pipeline tables): lenslets turn the native f/11 into f/4.4 at the 110 µm fibers; F = 4.0 is the collimator's acceptance (the fibers keep 95.6% of the light inside f/4), so the core enters at f/4.0, 110 µm / (4.0 × 6.5 m) = 0.873″ (the sky is sampled by 0.75″ lenslets), as the slit of equal line width, 0.756″; 300 spectra per detector, on-axis spherical collimator mirror 200 mm (beam 50 mm), camera 70 mm, e2v 2048 × 2048 of 13.5 µm. The VPH line density (" + G + " /mm) and the grating's symmetric angle are NOT published: they are fitted so the published band " + l0 + "–" + l1 + " Å fills the chip. The real disperser is a VPH grism, a prism bonded on the grating's front plate (Furesz et al. 2020), so the page's grating angles and camera angle describe the bare-VPH fit, not the instrument. The collimator is an on-axis sphere with the fiber slit inside the beam at its focus, and the VPH grating stands at the mirror's center of curvature, 400 mm away (Furesz et al. 2020; drawn so).",
    state: { mode: "grating", D: 6.5, F: 4.0,
      g: { slitW: S3 * 0.110 / (4.0 * 6500) * 206264.806, nObj: 300, col: "mirror", colTilt: 0, layLen: 400, W: 50, fcam: 70, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
           psi: 35, tAlpha: null, Nx: 2048, Ny: 2048, pix: 13.5 } },
    pub: [
      { what: disp + " Å/px at the chip center (arc tables)", q: "dlpix", value: disp, info: true, src: "llamas-pyjamas arc tables. Not a test: the line density was fitted so the published band fills the 2048 px, which fixes the mean dispersion (band / 2048 px); the center value differs from the mean only through cos β across the chip" },
      { what: "lab R " + Rlab, q: "R", value: NaN, info: true, src: "MIT LLAMAS Specifications page (lab measurements for individual fibers); R ≈ 2000 in Furesz et al. 2020" },
    ],
  })),
  // Magellan / LDSS-3: VPH grisms between two prisms (data/round5/grisms.md; geometry from Carnegie's maskgen file).
  // Audited 2026-11-16 (data/audit/): VPH-Red is the documented 660 /mm (maskgen's 665 belongs with the 0.46% smaller
  // camera scale that Carnegie's COSMOS pipeline applies; with the 173.1 mm camera the 2007 arc lines fit 660).
  ...[["All", 400, 16.3, "silica", 6588, 2.040, null, "4250–10000"], ["Blue", 1090, 24.0, "S-LAL7", 5150, 0.6947, 1900, "3800–6200"], ["Red", 660, 24.0, "S-LAL7", 8321, 1.1818, 1810, "6000–10000"]].map(([k, G, Ap, gl, lc, disp, Rt, band]) => ({
    id: "ldss3" + k.toLowerCase(), tel: "Magellan 6.5 m", name: "Magellan / LDSS-3 VPH-" + k + ", 0.75″", inst: "LDSS-3", setting: "VPH-" + k + ", 0.75″",
    note: "Magellan Clay LDSS-3 with the VPH-" + k + " grism (LCO LDSS-3 pages; Carnegie maskgen instrument file; arc solutions measured in 2007 on the earlier STA0500A chip, of the same 15 µm pixels): f/11, collimator 746.8 mm (refractive, inferred from LCO's note that the pupil position depends on wavelength; beam 67.9 mm, derived), camera 173.1 mm (maskgen; Carnegie's COSMOS pipeline scales the image by 0.3–0.5%), VPH grism " + G + " /mm" + (k === "Red" ? " (the LCO grism table, the 2006 users guide and the 2022 handout; maskgen changes it to 665 along with alignment values \"used for fitting actual data\", and COSMOS pairs 665 with a 0.46% smaller camera scale; COSMOS gives 8350 Å as the undeviated wavelength)" : "") + " between two " + (gl === "silica" ? "fused-silica" : "OHARA S-LAL7") + " prisms of apex " + Ap + "° (the VPH model exactly), Fermilab CCD 4096 × 2048 of 15 µm; 17 slits per mask (mean of 35 published masks on the earlier chip; LDSS-3C masks hold 20–25, Khullar et al. 2019).",
    state: { mode: "grating", D: 6.5, F: 11.0,
      g: { slitW: 0.75, nObj: 17, col: "lens", W: 746.77 / 11.0, fcam: 173.076, gType: "grism", G, m: 1, lamB1: 5000, lamC: lc, psi: 35, tAlpha: null,
           gA: Ap, gGlass: gl, gKind: "vph", gTilt: 0, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "measured " + lc + " Å at the detector center", q: "lam0", value: lc, tol: 0.005, src: "LDSS-3 arc solution through the center slit (2007)" },
      { what: "measured " + disp + " Å/px at the center", q: "dlpix", value: disp, tol: 0.015, src: "LDSS-3 arc solution (2007)" },
      ...(Rt ? [{ what: "R = " + Rt + " at 0.75″ at " + (k === "Blue" ? "5200" : "8500") + " Å", q: "RAt", lam: k === "Blue" ? 5200 : 8500, value: Rt, tol: 0.06, src: "LCO grism table (λ over 4 px × Å/px), quoted at " + (k === "Blue" ? "5200" : "8500") + " Å (Stevenson et al. 2016 Table 1; the LDSS-3 user guide gives the dispersions at the same wavelengths); compared at that wavelength" }]
        : [{ what: "R = 860 at 0.75″ (λ over 4 px × 1.89 Å/px, at 6500 Å)", q: "RAt", lam: 6500, value: 860, info: true, src: "LCO grism table and Stevenson et al. 2016 Table 1 (R for a 4-px slit). The 2007 arcs measure 2.035 Å/px at 6500 Å, so the published R is ≈ 7% high; the model's slit-limited R at 6500 Å is 796" }]),
      { what: "0.189″/px", q: "pixScale", value: 0.189, tol: 0.02, src: "LCO LDSS-3 pages" },
      { what: "band " + band + " Å", q: "span", value: NaN, info: true, src: "LCO grism table (filters and efficiency trim the detector's span)" },
    ],
  })),
  // Magellan / M2FS and IFUM (data/round6/m2fs_ifum.md; audited 2026-11-16, data/round6/m2fs_ifum_audit.md).
  // Pupil-fed fibers: a ball lens behind each aperture images the primary onto the core at f/3.7, and the fibers deliver
  // f/3.4, the ratio of the spectrograph's 500 mm collimator on its 147 mm beam; so F = 3.4 and the core enters as
  // core / (3.4 × 6.5 m), the "virtual" convention. The echelle is Richardson's R2.6 ruling of 52.67 /mm (the only
  // R2.6 of the size in the 2014 catalog), blazed at 69°; the 6.6° between the beams lies in its dispersion plane (the
  // camera beam passes just below the injection optics, Mateo et al. 2012), set from the measured arc-line dispersion;
  // Mateo et al. 2012 Table 4 gives the quasi-Littrow opening angle as "~8-10 deg, varies depending on mode/gratings used".
  {
    id: "m2fsmgb", tel: "Magellan 6.5 m", name: "Magellan / M2FS HiRes, Mg b order",
    note: "Magellan M2FS (Mateo et al. 2012; Walker et al. 2023) in the single-order HiRes setup at Mg b of the dwarf-galaxy surveys (Walker et al. 2015, 2016, 2023). Clay's f/11 Nasmyth focus holds 128 fibers per spectrograph, each behind a 1.2″ aperture and a ball lens that images the telescope pupil onto the 150 µm core at f/3.7; the fibers deliver f/3.4, so the core enters as 0.150 mm / (3.4 × 6.5 m) = 1.40″, and the slit of equal line width as 1.21″ (the core sets the line for any slit of 150 µm or wider). One lens group serves as collimator and camera (500 mm, f/3.4, 147 mm beam, 1:1): the light passes the Schott F2 cross-dispersing prism (23.6°), meets the echelle, and returns through the prism and the lens, passing just below the injection optics, so the 6.6° between the beams lies in the echelle's dispersion plane. Echelle: Richardson's R2.6 ruling of 52.67 /mm, blazed 69°, 204 × 408 mm (the only R2.6 of that size in the 2014 catalog; MIKE's blue echelle is the same ruling), met at α = 73.2° and left at β = 66.6°: the beams' bisector sits 0.9° from the blaze, the angle set from the measured dispersion of the arc lines in Ji's published reduction (m2fs_reduction). Mateo et al. report 7% of the light vignetted by the steep incidence, and the anamorphic factor cos α / cos β ≈ 0.73 narrows the fiber's image. An order-isolating filter passes 5130–5190 Å, so each fiber shows order 69 and, at the chip's ends, the parts of orders 68 and 70 inside the filter's band. e2v CCD 4096 × 4112 of 15 µm. The fibers sit in eight groups of 16 on a 300 µm pitch (Mateo et al.); on the detector the spectra are 18.1–20.3 px apart within a group (19.3 on average) and 207–227 px from one group to the next (214 on average), measured from the trace centers in Ji's reduction.",
    state: { mode: "echelle", D: 6.5, F: 3.4,
      e: { slitW: S3 * 0.150 / (3.4 * 6500) * 206264.806, nObj: 128, col: "lens", dpass: true, W: 147, fcam: 500, eG: 52.67, eDelta: 69, gamma: 0, theta: 3.3, eTilt: 0.9,
           xd: "prism", xG: 300, xPsi: 10, xGlass: "F2", xA: 23.6, xPasses: 2, xPrisms: null, lamC: 5160, Nx: 4096, Ny: 4112, pix: 15,
           filt: [5130, 5190], filtShow: true, fgroups: [16, 290, 3206], telF: 11, fibAp: 1.2 } },
    pub: [
      { what: "R ≈ 24,000 in the single-order Mg b setup", q: "R", value: 24000, info: true, src: "Walker et al. 2023; Pace et al. 2023 (slit not stated; the core sets the line for any slit of 150 µm or wider). With the 95 µm slit Roederer et al. 2016 measured R ≈ 34,000 from arc lines and Johnson et al. 2020 give ≈ 32,000; the model gives 33,400 there. Ji et al. 2023 give R ≈ 18,000 with 180 µm slits. Not scored: the 24,000 states neither the slit nor the method" },
      { what: "orders 69 and 68 28.0 px apart (measured)", q: "minSepPx", m1: 68, m2: 69, value: 28.0, tol: 0.03, src: "Ji's reduction (the arc lines' trace centers, MgWide setup): 28.0, 27.7 and 27.0 px for orders 69–68, 68–67, 67–66, against the model's 28.3, 27.8, 27.2. Tests the prism, which no fit set" },
      { what: "R ≈ 18,000–20,000", q: "R", value: 18000, info: true, src: "Walker et al. 2015, 2016 and Song et al. 2019, 2021 (slit not stated); Ji et al. 2023 (180 µm slits, R ∼ 18,000, in the multi-order MgWide setup, not stated as measured). Below what the 95 µm measurements allow for any slit of 150 µm or wider (R ≥ 23,400 by the ratio of line widths)" },
      { what: "≈0.065 Å per 2 × 2-binned pixel (0.0325 Å per 15 µm pixel)", q: "dlpix", value: 0.065 / 2, info: true, src: "Walker et al. 2023. A reference line, since the angle between the beams was set from the arc lines' dispersion in this order" },
      { what: "spectra 18.1–20.3 px apart within a group of 16", q: "gapPx", value: 19.3, info: true, src: "Ji's reduction (trace centers, order 69); an input of the preset" },
    ],
  },
  {
    id: "ifumlsb", tel: "Magellan 6.5 m", name: "Magellan / IFUM LSB, 600 l/mm",
    note: "Magellan IFUM (Mateo et al. 2022; Crosby et al. 2025), the integral-field units that feed the M2FS spectrographs, here the LSB unit: 360 hexagonal lenslets (1.90″ equal-area diameter, 1.82″ between centers; a 32.7″ × 31.4″ field) and 180 fibers per detector, in 10 mounts of 18 with one lenslet row per mount, in a zig-zag order (Crosby et al. 2025, Fig. 1). The lenslets image the telescope pupil onto 260 µm cores, and the fibers deliver f/3.3; entered at the spectrograph's f/3.4, the core is 0.260 mm / (3.4 × 6.5 m) = 2.43″, and the slit of equal line width 2.10″ (the 300 µm full-open slit, which the core fills). Crosby et al. used this slit for 3 of their 10 targets and the 80 µm slit for the other 7. M2FS spectrograph: 500 mm lens group as collimator and camera, 147 mm beam, 1:1, with the 6.6° between the beams in the dispersion plane, as for M2FS; the \"blue\" 600 l/mm reflection grating (blaze not published: set at λc); e2v CCD 4096 × 4112 of 15 µm. Central wavelength 5750 Å, the middle of the published 4800–6700 Å. The fiber pitch is not published; 21.5 px within a mount and 35 px between mounts are read from Crosby et al.'s Fig. 1, where the 10 mounts fill ≈ 97% of the detector.",
    state: { mode: "grating", D: 6.5, F: 3.4,
      g: { slitW: S3 * 0.260 / (3.4 * 6500) * 206264.806, nObj: 180, col: "lens", W: 147, fcam: 500, gType: "refl", G: 600, m: 1, lamB1: 5750, lamC: 5750, psi: 6.6, tAlpha: null,
           Nx: 4096, Ny: 4112, pix: 15, fgroups: [18, 322, 525], telF: 11, fibAp: 1.9 } },
    pub: [
      { what: "coverage 4800–6700 Å", q: "span", value: 1900, info: true, src: "Crosby et al. 2025: the range common to all the fibers. The lines curve by 105–113 Å across the pseudo-slit (the IFUM pipeline's wavelength solutions for the STD unit), so one fiber covers ≈ 2010 Å, as here, and all the fibers together ≈ 1900 Å" },
      { what: "R ≈ 1000 with the 300 µm slit", q: "R", value: 1000, info: true, src: "Crosby et al. 2025 (method not stated); the IFUM team's 2022 expected-performance table gives 1000. The model's value is the FWHM of the fiber's line (0.866 of the core); a Gaussian fitted to that line, as the team's pipeline does, is 0.70 of the core, which gives ≈ 970" },
      { what: "R ≈ 3600 with the 80 µm slit", q: "R", value: 3600, info: true, src: "Crosby et al. 2025 (method not stated); the 2022 table gives 4000. An 80 µm slit cannot make lines narrower than 80 µm; the model gives ≈ 2200, and ≈ 2600 from a Gaussian fit. The two published values scale as the nominal slit widths (1000 × 300 ≈ 3600 × 80), so they look like nominal values" },
    ],
  },
  {
    id: "esi", tel: "Keck 10 m", name: "Keck / ESI echellette, 1″",
    note: "Keck II ESI echellette mode (Sheinis et al. 2002; 1996 design report; Keck ESI pages): off-axis paraboloid collimator 2286 mm (beam 166.9 mm at f/13.7), 10-element refractive camera 308 mm, 175.555 /mm echellette (the 1996 design report, a catalog ruling; Sheinis et al. 2002 round to 175) with δ = 32.3°, quasi-Littrow (γ is published only as 'a few degrees': 0 here), two 50° OHARA BSL7Y prisms, the first in double pass. The prisms sit \"near\" minimum deviation (their angles are not published): the double-passed prism is entered turned 4° toward smaller incidence (INFERRED), which reproduces the ten as-built order positions of the PypeIt pipeline to 13 px rms (at exact minimum deviation the orders lay 8.5% too close together, and an eleventh order fit on the chip). The measured scale along the slit varies 1.4× across the orders, which this rotation does not reproduce. MIT/LL CCID20 4096 × 2048 of 15 µm; λc = 5250 Å from the design order positions. The prisms and the echellette stand ≈2.9 m from the collimator, whose tilt is 5.0° (\"the collimator is off axis by 5.0 degrees\", the 1996 ESI design report; Sheinis et al. 2002, Fig. 1, measures a 9.2° turn of the returned beam). ESI was hibernated in July 2026, and Keck plans to decommission ESI at the end of semester 2027A unless a need emerges (Keck instrument availability, November 2026).",
    state: { mode: "echelle", D: 10.95, F: 13.7,
      e: { lay3d: "pp", xPre: 1, xDbl: 1, note3d: "the echelle's angle is given only as \"a few degrees off Littrow\" (ESI design report)", slitW: 1, nObj: 1, col: "mirror", colTilt: 5.0, layLen: 2930, W: 2286 / 13.7, fcam: 308, eG: 175.555, eDelta: 32.3, gamma: 0, theta: 0, xd: "prism", xG: 300, xPsi: 10,
           xGlass: "BSL7Y", xA: 50, xPasses: 1, xPrisms: [{ glass: "BSL7Y", A: 50, dI: -4 }, { glass: "BSL7Y", A: 50 }, { glass: "BSL7Y", A: 50, dI: -4 }], lamC: 5250, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R = 4000 at 1″ (slit × 11.5 km/s/px)", q: "Rs", value: 4000, tol: 0.04, src: "Keck ESI pages, Table 2 (geometric)" },
      { what: "0.1545 Å/px in order 15 at 4077 Å", q: "dlpixAt", lam: 4077.46, m: 15, value: 0.154482, tol: 0.02, src: "Keck ESI wavelength solutions" },
      { what: "0.2121 Å/px in order 11 at 5549 Å", q: "dlpixAt", lam: 5549.09, m: 11, value: 0.212052, tol: 0.02, src: "Keck ESI wavelength solutions" },
      { what: "0.3345 Å/px in order 7 at 8708 Å", q: "dlpixAt", lam: 8707.59, m: 7, value: 0.334496, tol: 0.02, src: "Keck ESI wavelength solutions" },
      { what: "orders 6 and 15: centers 25.13 mm apart (as built)", q: "ySpan", m1: 6, m2: 15, value: (0.933 - 0.115) * 2048 * 0.015, tol: 0.02, src: "PypeIt keck_esi.py order_spat_pos (commit c1798aa): orders 15 to 6 at 0.115 ... 0.933 of the 2048-px axis (the 1996 design report: 25.34 mm). Not independent of the prism rotation, which was set to match these positions; the line keeps the fit from drifting" },
      { what: "ten orders, 6–15, from 3900 Å", q: "lo", value: 3900, info: true, src: "Keck ESI pages (\"ten orders on the CCD with complete wavelength coverage from 3900 Å to 10900 Å\"); Sheinis et al. 2002. The model also puts the edge of order 16 on the chip, from 3834 Å" },
      { what: "minimum order separation 22″", q: "minSepArcsec", m1: 6, m2: 15, value: 22, info: true, src: "Sheinis et al. 2002. The model's order spacing in pixels matches PypeIt's as-built positions, but its scale along the slit in the red orders is 17% below the measured one (see the line below), so the separation in arcseconds comes out 13% short; PypeIt's spacings with the measured scales give ≈ 23″ (DERIVED)" },
      { what: "0.144″/px along the slit in order 11 at 5549 Å (0.120 in order 15 to 0.168 in order 6)", q: "pixScaleAt", lam: 5549, m: 11, value: 0.144, info: true, src: "Keck ESI Quick Reference (measured with the MultiHoles slit). The scale along the slit varies with the prisms' anamorphic magnification: the model gives 0.121 in order 15, 0.131 in order 11 and 0.140 in order 6, against the measured 0.120, 0.144 and 0.168; the single rotation that reproduces the order positions does not reproduce this 1.4× variation (the prisms' real angles are not published)" },
    ],
  },
  {
    id: "kcwib", tel: "Keck 10 m", name: "Keck / KCWI blue BM, Medium slicer", inst: "KCWI", setting: "blue (BM)",
    note: "Keck II KCWI blue arm (Morrissey et al. 2018; Keck KCWI pages): the image slicer at the f/13.7 focus (no fore-optics), Medium slicer 0.69″ × 20.4″ slices, 24 slices (≈3330 spaxels) per detector, spherical collimator mirror (f 2172.5 mm; the explorer's beam-matched value is 2192 mm), 160 mm pupil, articulated refractive camera 304.4 mm f/1.9, BM VPH 1900 /mm at α = 30° (β = 20.8° at 4500 Å), e2v CCD231-84 4096 × 4112 of 15 µm (Morrissey et al. 2018; which axis carries the dispersion is INFERRED). The grating stands at the collimator's radius of curvature, 4345 mm along the path (Morrissey et al. 2018, Table 1 and Fig. 8), after the cylindrical fold FM1 that corrects the collimator's working angle; the fold's place (0.73 of the path) and the collimator's 9.4° tilt are MEASURED from Fig. 8.",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 0.69, nObj: 3330, col: "mirror", colTilt: 9.4, layLen: 4345, foldOn: true, foldAng: 210, foldPos: 0.73, W: 160, fcam: 304.4, gType: "trans", G: 1900, m: 1, lamB1: 5000, lamC: 4500, psi: 35, tAlpha: 30, Nx: 4112, Ny: 4096, pix: 15 } },
    pub: [
      { what: "0.24 Å/px", q: "dlpix", value: 0.24, tol: 0.03, src: "Keck KCWI configuration page" },
      { what: "0.147″/px along the slices", q: "pixScale", value: 0.147, tol: 0.02, src: "Morrissey et al. 2018" },
      { what: "slit image 4.6 px (Medium slicer)", q: "npix", value: 4.6, info: true, src: "Morrissey et al. 2018 Sec. 3.6 (\"nearly Nyquist sampled at 2.3 pixels\" for the Small slicer, a prediction without the calculation; twice for the Medium). 0.35″ / 0.147″ per px = 2.38 px, × the anamorphic factor 0.927 = 2.21 px (DERIVED): 2.3 lies between, and the source does not say which" },
      { what: "R ≈ 4300 at 4500 Å (the small slicer's lab curve, halved for the Medium slicer)", q: "RAt", lam: 4500, value: 4300, tol: 0.08, src: "Morrissey et al. 2018 Fig. 26 (\"Laboratory-measured spectral resolution of KCWI using the small slicer\"): BM ≈ 8300–8800 at 4500 Å, read from the plot; Sec. 5.1: \"The measured resolution is slit-limited for all medium and large slicer configurations, which would scale the results in the Figure by factors of 0.5 and 0.25\" (DERIVED: 4150–4400)" },
      { what: "R = 4000 (Keck page) or 5000 (Morrissey et al. 2018 Table 3)", q: "R", value: 4000, info: true, src: "two nominal tables with exact factor-of-2 steps between slicers; the measured lab curve is the line above" },
    ],
  },
  {
    id: "kcrm", tel: "Keck 10 m", name: "Keck / KCRM red RL, Medium (angle derived)", inst: "KCWI", setting: "red (KCRM, RL)",
    note: "Keck II KCRM, the red arm of KCWI (Keck pages; KCWI data pipeline): the same slicer and collimator, Medium slicer 0.69″, camera 305 mm (an assumption: the KCRM camera is not published, and 305 mm is the single FCAM of the pipeline's kcwi.cfg, listed among the \"parameters that should be the same for both channels\"), RL VPH 530 /mm at α = 18.26° (NOT published: derived assuming β = α − 9° as for the blue gratings, which reproduces the published sample coverage), an LBNL CCD of 15 µm pixels taken as 4114 × 4128 with the 4128 along the dispersion (INFERRED: PypeIt's RL template holds 4128 spectral pixels, and the same LBNL format serves PFS and DESI; Keck says only \"LBNL 4kx4k\"). PypeIt's measured dispersion, 0.918 Å/px at 8247 Å, fixes f_cam / cos β = 308.3 mm, consistent with the 305 mm camera. The red channel shares the collimator and the fold FM1, with a dichroic in place of the blue channel's fold FMD (Morrissey et al. 2018, Fig. 2); the grating distance and the fold are drawn as the blue channel's (INFERRED).",
    state: { mode: "grating", D: 10.95, F: 13.7,
      g: { slitW: 0.69, nObj: 3330, col: "mirror", colTilt: 9.4, layLen: 4345, foldOn: true, foldAng: 210, foldPos: 0.73, W: 160, fcam: 305, gType: "trans", G: 530, m: 1, lamB1: 5000, lamC: 8950, psi: 35, tAlpha: 18.26, Nx: 4128, Ny: 4114, pix: 15 } },
    pub: [
      { what: "0.92 Å/px", q: "dlpix", value: 0.92, info: true, src: "Keck KCRM configuration page. Not a test of the instrument: the line density (530 /mm) and the 305 mm camera both come from the pipeline, whose own dispersion formula uses them, so the line checks the pipeline's placeholder camera" },
      { what: "sample coverage 7070–10810 Å", q: "span", value: 10810 - 7070, info: true, src: "Keck KCRM page (the grating angle was derived from this, so it is not a test)" },
      { what: "0.918 Å/px at 8247 Å (measured)", q: "dlpixAt", lam: 8247, m: 1, value: 0.918, tol: 0.02, src: "PypeIt's KCRM RL arc-line template (commit c1798aa): 1.8356 Å per binned pixel at 8247 Å, binned 2 (DERIVED). Tests the assumed 305 mm camera with the derived grating angle" },
      { what: "R > 1000", q: "R", value: NaN, info: true, src: "Keck KCRM page (a lower limit only)" },
      { what: "R ≈ 1600 (RL, Medium slicer), the pipeline's assumed resolution", q: "R", value: 1600, info: true, src: "KCWI pipeline, kcwi_file_primitives.py resolution(): RL gives λ/800 FWHM for the Large slicer, halved for the Medium (used to convolve the arc atlas); the model is 36% higher" },
    ],
  },
  {
    id: "deimos", tel: "Keck 10 m", name: "Keck / DEIMOS, 1200G, 0.75″",
    note: "Keck II DEIMOS (Keck DEIMOS pages; Faber's 1995 grating table; Newman et al. 2013): collimator mirror 86.50 in, beam 6.33 in (f/13.67 on the 10.95 m primary), camera 15.00 in, fixed camera–collimator angle 44.451°, 1200G at λc = 8000 Å (blaze 7500 Å: Newman et al. 2013 Table 2, the Keck specifications page and the Richardson catalog's 53-*-360R, 1200 /mm blazed 26.7°; the Keck gratings page's 7760 Å is the outlier), 8192 × 8192 mosaic of 15 µm pixels (CCD gaps not modeled; the blue–red gap is 7 px, Newman et al. 2013 Table 2). This is the original detector: Keck plans to commission a new science detector in February–April 2027 (Keck instrument availability, November 2026).",
    state: { mode: "grating", D: 10.95, F: 86.50 / 6.33,
      g: { slitW: 0.75, nObj: 129, col: "mirror", colTilt: -2.8, layLen: 2443, foldOn: true, foldAng: 313, foldPos: 0.73, gFlip: true, W: 6.33 * 25.4, fcam: 15.00 * 25.4, gType: "refl", G: 1200, m: 1, lamB1: 7500, lamC: 8000, psi: 44.451, tAlpha: null,
           Nx: 8192, Ny: 8192, pix: 15 } },
    pub: [
      { what: "0.33 Å/px", q: "dlpix", value: 0.33, tol: 0.03, src: "Newman et al. 2013 Table 2 (DEEP2, the 1200G at 7800 Å)" },
      { what: "0.324 Å/px (design)", q: "dlpix", value: 0.324, info: true, src: "Faber 1995 grating table, 1200 l/mm at 8000 Å: computed with the same camera and angle as the preset, so a reference line" },
      { what: "coverage from 6673 Å (design)", q: "lo", value: 6673.0, info: true, src: "Faber 1995 grating table (a reference line, as above)" },
      { what: "coverage to 9294 Å (design)", q: "hi", value: 9293.8, info: true, src: "Faber 1995 grating table (a reference line, as above)" },
      { what: "aberration-free slit FWHM 1.23 Å (R = 6500)", q: "Rs", value: 8000 / 1.23, info: true, src: "Faber 1995 grating table, raw FWHM (1.23 Å = 3.79 px × 0.324 Å/px, so the line repeats the slit-image and dispersion lines above)" },
      { what: "slit image 3.79 px (design)", q: "npix", value: 3.79, info: true, src: "Faber 1995 grating table, raw FWHM (a reference line, as above)" },
      { what: "R ≈ 6000 at 0.75″ (working value)", q: "R", value: 6000, info: true, src: "Faber et al. 2003, Sec. 1 (\"The highest working spectral resolution in the red is R ~ 6000 using a 1200-line grating ... and a slit width of 0.75″\"); Fig. 1's caption gives lines of 4 px FWHM, 1.3 Å, without the slit. The model's line is 3.79 px wide" },
      { what: "R 5900 at 7800 Å with the 1.0″ slit (measured)", q: "RAt", lam: 7800, value: 5900, info: true, src: "Newman et al. 2013 Table 2 (FWHM 1.29–1.39 Å). Not this preset's slit; the measured FWHM equals 2.355 × the rms width, which for the model's 1.0″ line is 1.33 Å, 22% below the line's true FWHM" },
      { what: "0.1185″/px", q: "pixScale", value: 0.1185, tol: 0.03, src: "Keck DEIMOS specifications (0.119 elsewhere)" },
      { what: "R with aberrations, 8000/1.35 Å", q: "R", value: 8000 / 1.35, info: true, src: "Faber 1995 grating table, effective FWHM (the model has no aberrations)" },
    ],
  },
  // Keck I / MOSFIRE: one reflection grating in orders 6, 5, 4, 3 for Y, J, H, K (data/round4/mosfire.md)
  // The order-sorting filters: Y and J set the coverage (McLean et al. 2012 Table 1, the central-slit ranges); H and K
  // are wider than the detector (the Keck filter table's center ± FWHM / 2). Audited 2026-11-16: data/audit/.
  ...[["Y", 6, 10373, 1.0855, 2.92, 3380, 9716, 11250, [9716, 11250], 4960], ["J", 5, 12450, 1.3028, 2.92, 3310, 11530, 13520, [11530, 13520], 4930],
      ["H", 4, 16321, 1.6269, 2.87, 3660, 14680, 18040, [14665, 18075], 5340], ["K", 3, 21760, 2.1691, 2.87, 3620, 19540, 23970, [19205, 24035], 5280]].map(([b, m, lc, disp, npx, Rm, lo, hi, filt, R48]) => ({
    id: "mosfire" + b.toLowerCase(), tel: "Keck 10 m", name: "Keck / MOSFIRE " + b + ", 0.7″", inst: "MOSFIRE", setting: b + ", 0.7″",
    note: "Keck I MOSFIRE (McLean et al. 2012; Keck MOSFIRE pages): f/13.66 Cassegrain, six-element refractive collimator 1813 mm (the beam, 132.7 mm, follows from the f/13.66 focus on the explorer's 10.95 m pupil; the design states 125 mm), camera 250 mm (reduction 7.25), 110.5 l/mm reflection grating blazed 21.93°, fixed 40° camera–collimator angle in the dispersion plane, " + b + " band in order " + m + " at λc = " + lc + " Å, isolated by the " + b + " order-sorting filter" + (b === "Y" || b === "J" ? ", which sets the coverage" : "") + "; HAWAII-2RG 2048 × 2048 of 18 µm (2040 × 2040 active; McLean et al.'s coverage follows the full 2048); 28 slits per mask (MOSDEF average; the slit unit forms up to 46 slits from 92 bars). The fold flat between the field lens and the collimator's lens group (McLean et al. 2012) is not drawn: its angle is not published.",
    state: { mode: "grating", D: 10.95, F: 13.66,
      g: { slitW: 0.7, nObj: 28, col: "lens", W: 1813.0 / 13.66, fcam: 250.0, gType: "refl", G: 110.5, m, lamB1: 2 * Math.sin(21.93 * Math.PI / 180) / 110.5 * 1e7, lamC: lc, psi: 40, tAlpha: null,
           Nx: 2048, Ny: 2048, pix: 18, filt } },
    pub: [
      { what: disp + " Å/px", q: "dlpix", value: disp, tol: 0.003, src: "McLean et al. 2012 Table 1; Keck MOSFIRE grating page" },
      { what: "0.7″ slit image " + npx + " px", q: "npix", value: npx, tol: 0.02, src: "McLean et al. 2012 Sec. 3 (geometric slit image)" },
      { what: "0.1798″/px", q: "pixScale", value: 0.1798, tol: 0.01, src: "McLean et al. 2012" },
      ...(b === "K" ? [{ what: "coverage from 19540 Å", q: "lo", value: lo, tol: 0.001, src: "McLean et al. 2012 Table 1" }, { what: "coverage to 23970 Å", q: "hi", value: hi, tol: 0.001, src: "McLean et al. 2012 Table 1" }]
        : [{ what: "coverage " + lo + "–" + hi + " Å" + (b === "H" ? "" : " (set by the order-sorting filter; the detector spans more)"), q: "span", value: hi - lo, info: true, src: "McLean et al. 2012 Table 1" }]),
      { what: "measured R = " + Rm + " (0.7″)", q: "Rs", value: Rm, info: true, src: "McLean et al. 2012 Sec. 3 (arc lamps), compared with the model's slit-limited R, 1–4.5% lower. McLean et al. Table 2 gives measured line widths with a 0.6″ slit of 2.39–2.51 px, against the geometric 2.46–2.50 px: the pixel does not widen the lines" },
      { what: "measured R = " + R48 + " (0.48″)", q: "Rs", value: R48, info: true, src: "McLean et al. 2012 Sec. 3. Not this preset's slit: the model's slit-limited R at 0.48″ is 3.0–4.5% lower (4780, 4781, 5102, 5102 for Y, J, H, K)" },
    ],
  })),
  // Keck I / ZShooter, the 2026 design (data/round6/zshooter.md): six channels at the 0.70″ slit.  White pupil: each
  // 225 mm camera sees the slit through the 1500 mm collimator and a second, 1250 mm collimator, so the model's one
  // camera is the EFFECTIVE 225 × 1500/1250 = 270 mm, and each VPH enters as G × 225/270 (the G-CLEF convention).
  // Validation targets from the project's simulator (an analytical planar model of the June 2026 Zemax design, its
  // detector placements set by hand): the closest pair of orders (scored), one order's span on the chip (a reference
  // line: the span is 2048 px times the same closed-form dispersion). Audited 2026-11-16: data/audit/2026-11-16_zshooter.md.
  ...[
    // id, channel, passband (nm), echelle /mm, VPH /mm, lamC (A, the blaze of order mC), mC, Ny, orders (lo, hi),
    // span of order mC on the chip (A), closest order pair (mS, mS + 1) and spacing (px)
    ["b", "B", "310–430", 50.15, 2000, 3668.5, 99, 4096, 85, 118, 3713.1 - 3619.9, 117, 81.5],
    ["g", "G", "430–650", 50.15, 1100, 5420.7, 67, 4096, 56, 85, 5485.7 - 5347.1, 84, 85.7],
    ["r", "R", "650–980", 50.15, 625, 8254.2, 44, 4096, 37, 56, 8366.3 - 8158.5, 55, 112.1],
    ["yj", "YJ", "960–1340", 24, 350, 11326.9, 67, 2048, 57, 80, 11463.9 - 11173.3, 79, 63.6],
    ["h", "H", "1470–1830", 24, 300, 16497.9, 46, 2048, 42, 51, 16719.5 - 16303.3, 50, 136.2],
    ["k", "K", "1990–2450", 24, 270, 22320.7, 34, 2048, 31, 38, 22587.9 - 22017.1, 37, 225.5],
  ].map(([id, arm, band, eG, xG, lamC, mC, Ny, mLo, mHi, span, mS, sep]) => ({
    id: "zsh" + id, tel: "Keck 10 m", name: `Keck / ZShooter ${arm}, 0.7″ (design)`, inst: "ZShooter (design)", setting: `${arm}, 0.7″`,
    note: `ZShooter ${arm} channel (${band} nm, orders ${arm === "H" ? "42–51 in the Zemax design, 41–51 on the website" : mLo + "–" + mHi}), the design on the ZShooter website (2026) and in the project's simulator, an analytical model of the June 2026 Zemax design. Keck I right Nasmyth focus, relayed to f/10.5 (the website); entered as f/10, which gives the website's 530.6 µm/″ slit scale on the explorer's 10.95 m pupil (f/10.5 gives the same scale on a 10.42 m pupil); 0.70″ × 10″ slit; parabolic collimator 1500 mm; R2 echelle ${eG === 50.15 ? "50.15 /mm (the Zemax design; 50 on the website)" : eG + " /mm"} at 65.6°. A 0.6° out-of-plane tilt separates the returning beam from the slit (the website); entered as γ = +0.6°, though the sign, and whether 0.6° is the grating's tilt or the angle between the beams, are not published (the choice moves R by 0.7%); the in-plane angle is not published (0 here). VPH cross-disperser ${xG} /mm; a 225 mm f/1.8 camera on the 125 mm white pupil, entered as the effective 270 mm camera with the VPH as ${(xG * 225 / 270).toFixed(1)} /mm; ${Ny === 4096 ? "a 2048 × 4096 qCCD of 15 µm" : "a 2048 × 2048 HgCdTe LmAPD of 15 µm (the website's target; the Zemax image field fits 18 µm pixels)"}, the dispersion along the 2048-px axis. Central wavelength: the blaze of order ${mC}, the order the simulator places nearest the detector's center. Not modeled: the dichroics that bound the passband (partial orders beyond the passband appear on the chip), the detector's rotation (5–9.5°) and offset${arm === "B" ? ", and the orders below the explorer's 3200 Å limit (the passband starts at 3100 Å)" : ""}. Not built yet. The echelle stands ≈1.5 m from the collimator (MEASURED from the integrated layout against the layout's 1 m scale bar).`,
    state: { mode: "echelle", D: 10.95, F: 10.0,
      e: { lay3d: "wp", wpT: 1250, fold3d: "Mangin mirror", layLen: 1500, slitW: 0.70, nObj: 1, col: "mirror", W: 150, fcam: 270, eG, eDelta: 65.6, gamma: 0.6, theta: 0, xd: "vph", xG: xG * 225 / 270, xPsi: 10,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC, Nx: 2048, Ny, pix: 15 } },
    pub: [
      { what: "R ≈ 18,000 at 0.70″ (geometric, the median over the six channels)", q: "Rs", value: 18000, info: true, src: "ZShooter website, spectrograph design and performance pages. The per-channel ranges quoted there (15,700–21,100) hold the slit image fixed at 4.46 px while the dispersion varies; the project's performance reconciliation (zs-scopesim, docs/performance-reconciliation.md) gives 17,500–18,000 once the slit image follows the dispersion" },
      { what: "0.70″ slit image 4.46 px", q: "npix", value: 4.46, info: true, src: "ZShooter website, spectrograph design page; simulator. A reference line: computed from the same slit scale, focal lengths and pixel that set the 270 mm camera" },
      { what: "0.157″/px along the slit", q: "pixScale", value: 0.157, info: true, src: "ZShooter website, spectrograph design page. A reference line, from the same inputs as the slit image" },
      { what: `order ${mC} spans ${span.toFixed(1)} Å on the chip`, q: "ordSpan", m: mC, value: span, info: true, src: "ZShooter data reduction pipeline configuration (the simulator's trace model from the Zemax rulings and angles). A reference line: the span is 2048 px times the same closed-form dispersion" },
      { what: `orders ${mS} and ${mS + 1} ${sep} px apart, the closest pair`, q: "minSepPx", m1: mS, m2: mS + 1, value: sep, info: true, src: "ZShooter simulator, selected geometry (centers of the full-slit order footprints): the project's own model, not a publication, so the line is not scored" },
      { what: "3.78 km/s per pixel at the blaze", q: "kmspx", value: 3.78, info: true, src: "derived from the published blaze, beam and camera (c × pixel / (2 tan δ × 270 mm)); the model's trace repeats the closed form" },
      { what: `${mHi - mLo + 1} orders, ${mLo}–${mHi}`, q: "nOrders", value: mHi - mLo + 1, info: true, src: (arm === "H" ? "The Zemax design (via the simulator); the website gives 41–51, 11 orders. " : "ZShooter website, spectrograph design page. ") + "A reference line: the dichroics that bound the passband are not modeled, so the chip also shows partial orders beyond the passband" + (arm === "B" ? ", and the explorer stops at 3200 Å" : "") },
    ],
  })),
  {
    id: "binospec", tel: "MMT 6.5 m", name: "MMT / Binospec, 600 l/mm, 1″",
    note: "MMT Binospec (Fabricant et al. 2019; MMTO grating table): f/5.3 input, refractive collimator 1097 mm (beam ≈ 208 mm, Fabricant et al. 2019), refractive camera 404 mm, fixed 45° camera–collimator angle, 600 l/mm plane REFLECTION grating (blaze 16.0°) at 36.1° incidence (λc derived from the incidence angle), e2v CCD231-84 4096 × 4112 15 µm; 150 slits per mask is the mask's capacity (in maximal packing 60–75 spectra fall on each detector, inferred). The detector stands ≈1215 mm past the grating (Fabricant et al. 2019: 2.9 m from the mask to the detector, 1685 mm of the path to the grating); the three fold mirrors are not drawn.",
    state: { mode: "grating", D: 6.5, F: 5.3,
      g: { slitW: 1, nObj: 150, col: "lens", camLen: 811, W: 1097 / 5.3, fcam: 404, gType: "refl", G: 600, m: 1, lamB1: 2 * Math.sin(16.0 * Math.PI / 180) / 600 * 1e7,
           lamC: (Math.sin(36.1 * Math.PI / 180) + Math.sin((36.1 - 45) * Math.PI / 180)) / 600 * 1e7, psi: 45, tAlpha: null, Nx: 4096, Ny: 4112, pix: 15 } },
    pub: [
      { what: "0.61 Å/px", q: "dlpix", value: 0.61, tol: 0.03, src: "MMTO grating table" },
      { what: "coverage from 6000 Å", q: "lo", value: 6000, tol: 0.02, src: "MMTO grating table" },
      { what: "coverage to 8480 Å", q: "hi", value: 8480, tol: 0.02, src: "MMTO grating table" },
      { what: "1″ slit = 3.32 px", q: "npix", value: 3.32, tol: 0.03, src: "MMTO grating table" },
      { what: "R 3590 (1″)", q: "Rs", value: 3590, info: true, src: "MMTO grating table (the table's R is λc over 3.32 px × 0.61 Å/px, so the line repeats the slit-image and dispersion lines above)" },
      { what: "0.24″/px", q: "pixScale", value: 0.24, tol: 0.03, src: "Fabricant et al. 2019; MMTO" },
      { what: "R 4200 measured at Hα (1″ longslit)", q: "RAt", lam: 6563, value: 4200, info: true, src: "Fabricant et al. 2025 Sec. 7.2, R = c / (2.355 σ_inst) from Gauss–Hermite fits: a fitted width, narrower than the line's true FWHM that the model and the MMTO table use. A fit to the model's line in that definition gives ≈ 4290 (the audit, data/audit/)" },
    ],
  },
  {
    id: "hectospec", tel: "MMT 6.5 m", name: "MMT / Hectospec, 270 gpm, Hα",
    note: "MMT Hectospec (Fabricant et al. 2005; Hectospec manuals): 250 µm (1.5″) fibers at f/5.3 entered as the slit of equal line width (1.30″), spherical collimator mirror, 259 mm beam, catadioptric camera 397 mm, fixed 35° camera–collimator angle, 270 gpm reflection grating set up at Hα (α = 22.83°, β = −12.17°), blazed at 4.1° (Richardson's test sheet of the delivered grating, MR192-1-1-1: 5296 Å in Littrow, measured in the 35° geometry; the manuals give 5200 Å), two E2V 42-90 CCDs 4608 × 2048 of 13.5 µm (4608 along the dispersion), 300 fibers. Decommissioned in 2026.",
    state: { mode: "grating", D: 6.5, F: 5.3,
      g: { slitW: S3 * 1.5, nObj: 300, col: "mirror", cam: "mirror", colTilt: 0, layLen: 2749, W: 259, fcam: 397, gType: "refl", G: 270, m: 1, lamB1: 2 * Math.sin(4.1 * Math.PI / 180) / 270 * 1e7, lamC: 6563, psi: 35, tAlpha: null,
           Nx: 4608, Ny: 4096, pix: 13.5 } },
    pub: [
      { what: "1.21 Å/px", q: "dlpix", value: 1.21, tol: 0.03, src: "Hectospec observers manual (F05: 1.2). The manual does not say where on the chip; the model gives 1.231 at Hα and 1.210 at 4500 Å" },
      { what: "coverage 5660 Å (the manual's table: 4488–8664 Å on a 3400-px format, × 4608/3400)", q: "span", value: 5660, tol: 0.01, src: "Hectospec observers manual Sec. 3.3 table (\"The spectral coverages in this table refer to the nominal 3400 pixel format\"; \"full spectral coverage is ~1.35 times that shown\"); the model on a 3400-px format gives 4486.6–8665.5 Å" },
      { what: "coverage 5770 Å", q: "span", value: 5770, info: true, src: "Hectospec observers manual introduction; inconsistent with the manual's own table (5660 Å, the line above)" },
      ...[[4500, 5.8], [7000, 5.0]].map(([l, fw]) => ({ what: "R = " + Math.round(l / fw) + " at " + l + " Å (arc-line FWHM " + fw + " Å, measured)", q: "RAt", lam: l, value: l / fw, tol: 0.10, src: "Hectospec observers manual Sec. 3.3 (\"as measured with arc lines\": 5.8 Å near 4500 Å, 5.0 Å near 7000 Å). The measured width falls 14% from blue to red, which an ideal camera with a fixed fiber image cannot reproduce: the model's FWHM is the same at both" })),
      { what: "fiber image 5.1 px along the dispersion (5.4 × 5.1 ellipse)", q: "diam", value: 5.1, tol: 0.05, src: "Fabricant et al. 2005, perfect optics" },
      { what: "reduction 3.45: 0.2795″/px (13.5 µm × 6″/mm × 3.45; the 6″/mm DERIVED from 250 µm = 1.5″)", q: "pixScale", value: 0.0135 * 6 * 3.45, tol: 0.03, src: "Fabricant et al. 2005" },
      { what: "R = 6563/6.2 Å, from the 6.2 Å FWHM of Fabricant et al. 2005", q: "Rdiam", value: 6563 / 6.2, info: true, src: "Fabricant et al. 2005 Sec. 3.4 (\"a resolution of 6.2 Å FWHM\"). The 6.2 Å equals the 5.1-px fiber-image diameter × 1.2 Å/px, so the line repeats the diameter and dispersion lines; the model's R from the full fiber-image width agrees to 0.5%" },
      { what: "fiber images 10.2 px apart (the model spreads 300 over the chip)", q: "gapPx", value: 10.2, info: true, src: "Hectospec hardware manual" },
    ],
  },
  {
    id: "hectochelle", tel: "MMT 6.5 m", name: "MMT / Hectochelle, RV31",
    note: "MMT Hectochelle (Szentgyorgyi et al. 2011; observers guide 2023): 250 µm fibers (1.5″ in the paper and the guide; 1.47″ DERIVED at f/5.4 on 6.5 m) entered as the slit of equal line width (1.27″), spherical Schmidt collimator 1371.6 mm, 254 mm beam, catadioptric camera 618.66 mm (the observers guide's App. E table, \"Corrected Camera Focal Length 618.658\"; the published prescription traces to 619–621 mm; the guide's 25.3 in and the paper's 0.49 reduction are reproduced by neither the prescription nor the measured dispersion), 110 /mm R2 echelle (64.5°) used in ONE order selected by an interference filter: order 31 with the RV31 filter (5230 ± 80 Å, the band entered), 15° between the beams (α 72°, β 57° at the blaze center; RV31 runs off the blaze, α 71.56° at the measured chip center 5229 Å), two E2V 42-90 CCDs 4608 × 2048 of 13.5 µm, 240 fibers. Decommissioned in 2026.",
    state: { mode: "grating", D: 6.5, F: 5.4,
      g: { slitW: S3 * 0.250 / (5.4 * 6500) * 206264.806, nObj: 240, col: "mirror", cam: "mirror", colTilt: 0, layLen: 2737, W: 254, fcam: 618.658, gType: "refl", G: 110, m: 31, lamB1: 2 * Math.sin(64.5 * Math.PI / 180) / 110 * 1e7, lamC: 5230, psi: 15, tAlpha: null,
           Nx: 4608, Ny: 4096, pix: 13.5, filt: [5150, 5310], filtShow: true } },
    pub: [
      { what: "0.03507 Å/px at the chip center, 5229 Å (measured)", q: "dlpixAt", lam: 5229, m: 31, value: 0.03507, tol: 0.02, src: "H3 survey ThAr wavelength solutions of RV31 frames (HSRED, 13 nights 2017–2019; Conroy et al. 2019), the central 40 fibers (DERIVED, audit S4). The ideal camera lacks the prescription's pincushion, so the model's dispersion at the chip ends runs 3–4% coarser" },
      { what: "chip from 5147.7 Å (measured)", q: "lo", value: 5147.7, tol: 0.001, src: "H3 survey ThAr wavelength solutions (audit S4); Conroy et al. 2019 Sec. 3: \"5150Å−5300Å\". The filter's half-maximum points (5149–5303 Å, the guide's Fig. 34) lie within 5 Å of the chip ends" },
      { what: "chip to 5307.0 Å (measured)", q: "hi", value: 5307.0, tol: 0.001, src: "H3 survey ThAr wavelength solutions (audit S4)" },
      { what: "nominal R 32,000 at 5200 Å, from the fiber-image diameter", q: "Rdiam", value: 32000, info: true, src: "Szentgyorgyi et al. 2011: the blaze-center closed form (sin 72° + sin 57°) / cos 72° × 1371.6 / 0.250 = 31,780 (DERIVED); geometric, not measured. RV31 runs off the blaze, where the model gives ≈ 31,000" },
      { what: "fiber image 69 µm = 5.1 px along the dispersion", q: "diam", value: 5.1, info: true, src: "Szentgyorgyi et al. 2011 (124 × 69 µm ellipse), from the paper's 0.49 demagnification, which its own Table 2 contradicts (0.452 gives 64 µm = 4.75 px, DERIVED); the corrected camera gives 4.8 px" },
      { what: "line FWHM 3.4–4.2 px (measured)", q: "npix", value: 3.8, info: true, src: "Szentgyorgyi et al. 2011 Sec. 3.4 (\"As measured on full-resolution frames, the FWHM of spectral features varies by 10%, i.e., between 3.4 and 4.2 pixels\"): R 35,500–43,800 with the measured 0.0351 Å/px. The model's 4.15 px is the true FWHM of the round fiber's image; a Gaussian fitted to the same profile gives ≈ 0.81 of that, 3.4 px" },
      { what: "R ≈ 23,000 in the H3 setup, binned 3 in wavelength", q: "R", value: 23000, info: true, src: "Conroy et al. 2019, Sec. 3.1 (\"This setup delivers a resolution of R ≈ 23,000 over the (single order) wavelength range 5150Å–5300Å\", the data binned by three in the wavelength direction); Walker et al. 2023 give R ≈ 32,000; Szentgyorgyi et al. 2011 Table 1 gives a resolution element of 6 pixels, R ≈ 24,800 at the measured 0.0351 Å/px" },
      { what: "R 38,000 typical", q: "R", value: 38000, info: true, src: "Szentgyorgyi et al. 2011 (\"A typical resolution of 38,000 is achieved\", the close of a geometric argument, not stated as measured); the observers guide gives ~34,000, MMTO 32,000–40,000" },
      { what: "α 72°, β 57° (the blaze center)", q: "alphaDeg", value: 72, info: true, src: "Szentgyorgyi et al. 2011 Sec. 3.3: blaze-center angles; at the RV31 center the model gives 71.58° (71.56° at the measured 5229 Å)" },
      { what: "0.04 Å/px", q: "dlpix", value: 0.04, info: true, src: "MMTO table (one figure); measured 0.0351 Å/px (the line above)" },
    ],
  },
  {
    id: "gclef", tel: "GMT 25.4 m", name: "GMT / G-CLEF red, MR mode (design)",
    note: "G-CLEF, the 2016 design (Ben-Ami et al. 2016; Szentgyorgyi et al. 2016; the 2018 papers print a 75.6° echelle and an STA detector), red arm, MR mode: one 300 µm science fiber (with 2 sky/calibration fibers), 800 µm at the f/8 slit after the 8/3 relay (0.812″, DERIVED; \"0.8″\" in the papers), entered as the slit of equal line width (0.70″); off-axis-parabola collimator 2400 mm, 300 mm beam, R4 echelle 31.6 /mm (75.96°) in Littrow, 0.75° out of plane, red VPH cross-disperser 480 /mm (first order, optimized at 7300 Å), effective camera 675 mm (450 mm on the 200 mm transferred beam, derived). White pupil: the cross-disperser sits in the 200 mm beam and is imaged by the 450 mm camera, which the model (one 675 mm camera) reproduces by entering the VPH as 480 × 450/675 = 320 /mm, the same order spacing. e2v detector 92.4 × 92.2 mm of 10 µm (the CCD290-99, 9232 × 9216, INFERRED; which axis carries the dispersion is not published). The format is centered on the blaze of order 82, 7487 Å (INFERRED: the red echellogram of Ben-Ami et al. 2016 Fig. 15 holds orders 65 to ≈ 112 within the detector; no source gives the center). This is the GMT design's MR mode; on the Magellan Clay telescope (G@M, where commissioning was planned for 2027 as of 2024, before the GMT in the 2030s; Hartmann et al. 2024) the same spectrograph offers MR at 1.12″ (R 100,000) and HR at 0.8″ (R 140,000) with other fibers (the 2023 G@M poster, Table 1). The as-built red cross-disperser is a VPH grism, whose prescription is not published. The echelle's midplane stands 2600 mm from the collimator's vertex and the fiber images on the collimator's axis at its focus, with the chief rays tilted 7.5° to that axis (Furesz et al. 2014, Sec. 2.1; Ben-Ami et al. 2016, Sec. 2.2).",
    state: { mode: "echelle", D: 25.4, F: 8,
      e: { lay3d: "wp", wpT: 1600, fold3d: "Mangin mirror", layLen: 2600, colTilt: 3.75, xdLabel: "VPH grating (as built: a VPH grism)",
           camEq: "equivalent of 450 mm on a 200 mm beam", xdEq: "equivalent of 480 /mm", feedLabel: "fibers (f/3 to f/8 converter)",
           dichLabel: "540 nm, the red transmitted", dichBefore: 390, dichTilt: 15,
           note2d: "This view is the white-pupil design's single-pass equivalent, with the 0.81″ fiber image entered as a 0.70″ slit of equal line width; the 3D view draws the Mangin fold, transfer mirror and dichroic.",
           note3d: "the Mangin fold is drawn at ≈104° for clarity (≈166° in the instrument, whose relay runs back beside the main beam: Furesz et al. 2014, Fig. 1); the 7-lens camera is drawn as one lens", slitW: S3 * 0.800 / (8 * 25400) * 206264.806, nObj: 3, col: "mirror", W: 300, fcam: 675, eG: 31.6, eDelta: 75.96, gamma: 0.75, theta: 0, xd: "vph", xG: 480 * 450 / 675, xPsi: 10,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 7487, Nx: 9232, Ny: 9216, pix: 10 } },
    pub: [
      { what: "reddest order 65", q: "mLo", value: 65, info: true, src: "Ben-Ami et al. 2016 Table 1 (orders 65–175, both arms). With the format centered on 7487 Å the whole of order 65 is on the chip, with part of order 64 (the dichroic and the 950 nm limit are not modeled)" },
      { what: "order centers 105 px apart at orders 112–113 (210 µm + 7 × 120 µm)", q: "minSepPx", m1: 65, m2: 113, value: 105, info: true, src: "Ben-Ami et al. 2016 Sec. 3 and Fig. 16 (\"a minimum inter-order separation of 210µm ... and a minimum intra-order separation of 120µm\"); read as center-to-center distances, the order centers lie 7 × 120 + 210 = 1050 µm apart, which the model reproduces (and 3.14 mm at order 65, read from Fig. 16); the paper does not say whether the separations are center-to-center or gaps between the 75 µm fiber images, which would give 112.5 px; reference, not scored" },
      { what: "R 35,000 (MR)", q: "R", value: 35000, info: true, src: "Ben-Ami et al. 2016 Table 2. The G-CLEF papers quote R from a Gaussian fitted to the line (Furesz et al. 2014 Table 5: MR's FWHM of 3.68 pixels binned 3 × 3, 166 µm with that design's 15 µm pixels, at R 35,000, 0.66 of the design's 250 µm geometric image; Fig. 7 shows a Gaussian-fit width); a Gaussian fitted to a round fiber's line gives 0.70 of the fiber's width against the true FWHM's 0.866, which rescales the model's R to ≈ 34,000" },
    ],
  },
  // VLT / FORS2: ruled grisms whose entrance faces are tilted 7.5° (data/round5/grisms.md)
  ...[["300V", 300, 21, "FK5HTi", 5849, 1.6549, 440, "4450–8700 Å (GG435)"], ["300I", 300, 26.7, "LF5", 8574, 1.6101, 660, "6000–11000 Å (OG590)"], ["600B", 600, 34, "FK5HTi", 4629, 0.7476, 780, "3300–6210 Å"]].map(([k, G, Ap, gl, lc, disp, Rm, band]) => ({
    id: "fors2" + k.toLowerCase(), tel: "VLT 8.2 m", name: "VLT / FORS2 " + k + ", 1″", inst: "FORS2", setting: k + ", 1″",
    note: "VLT FORS2 with GRIS_" + k + " (ESO FORS manual; 1995 FORS grism design; ESO pipeline calibration; VLT-SPE-ESO-10000-2723): Cassegrain entrance pupil 8115 mm at f/13.4106 (VLT-SPE Table 2), which gives the manual's 528 µm/″; refractive collimator 1233 mm (beam 91.9 mm, derived), camera 280 mm, ruled grism " + G + " /mm on a " + (gl === "LF5" ? "LF5" : "FK5") + " prism of " + Ap + "°, the prism's entrance face tilted 7.5° in the dispersion plane (the direction inferred from ESO's numbers; no source states the direction), MIT mosaic 4096 × 4096 of 15 µm (two chips; the gap is not modeled; ESO reads spectra binned 2 × 2, FORS manual Sec. 2.7.1, and the preset shows the unbinned pixels); 50 slits per MXU mask (survey average).",
    state: { mode: "grating", D: 8.115, F: 13.4106,
      g: { slitW: 1.0, nObj: 50, col: "lens", W: 1233 / 13.4106, fcam: 280, gType: "grism", G, m: 1, lamB1: 5000, lamC: lc, psi: 35, tAlpha: null,
           gA: Ap, gGlass: gl, gKind: "ruled", gTilt: 7.5, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "measured " + lc + " Å at the CCD center", q: "lam0", value: lc, tol: 0.005, src: "ESO pipeline master distortion table (the manual's Table 2.4: 5849, 8575 and 4627 Å)" },
      { what: "measured " + disp + " Å per 15 µm pixel", q: "dlpix", value: disp, tol: 0.015, src: "ESO pipeline master distortion table" },
      { what: "R = " + Rm + " at 1″ (calculated)", q: "Rs", value: Rm, tol: 0.06, src: "ESO FORS manual Table 2.4, values the caption calls conservative; λ over 8 px × the tabulated Å/px reproduces the three values. Compared with the model's slit-limited R" },
      { what: "0.1259″ per unbinned pixel (measured)", q: "pixScale", value: 0.12591, tol: 0.01, src: "ESO FORS manual Table 4.2 (imaging astrometry, FORS2 on Antu with the standard-resolution collimator)" },
      { what: "band " + band, q: "span", value: NaN, info: true, src: "ESO FORS manual (order-sorting filter and the 3300 Å cut-off trim the detector's span)" },
    ],
  })),
  // VLT / ESPRESSO singleHR (1 UT), blue and red arms (data/round5/espresso.md).  The anamorphic pupil slicer cuts the
  // beam into two 300 x 200 mm slices, each carrying half the pupil along the dispersion: the whole pupil maps to an
  // equivalent round beam of 2 x 300 = 600 mm.  The cross-dispersers (a fused-silica prism plus a VPH grating) are not
  // published: an equivalent first-order VPH is estimated here.
  // Audited 2026-11-16 (data/audit/): the echelle is the UVES red master MR160 (75.04°), γ 0 (not published; the measured line
  // tilt, the design 800 mm camera; the equivalent cross-dispersers refit to the published order ranges.
  ...[["blue", "b", 789, 4529, [[3800.4, 161, 0.0063], [5229.7, 117, 0.0086]], 117, 161, 135], ["red", "r", 432, 6575, [[5229.7, 117, 0.0086], [7844.5, 78, 0.0129]], 78, 117, 93]].map(([arm, k, xG, lc, dl, m1, m2, mc]) => ({
    id: "espresso" + k, tel: "VLT 8.2 m", name: "VLT / ESPRESSO " + arm + ", singleHR", inst: "ESPRESSO", setting: arm + ", singleHR",
    note: "VLT ESPRESSO " + arm + " arm, singleHR 1-UT mode (Pepe et al. 2021; ESO ESPRESSO manual; design papers): 140 µm octagonal fiber (1.0″) entered as the slit of equal line width, 4 spectra (object and sky/reference fibers, each cut in two by the pupil slicer), collimator mirror 3000 mm (off-axis parabola, double pass) with an equivalent 600 mm beam (two 300 mm slices), 31.6 /mm R4 echelle replicated from the UVES red master MR160 (Mégevand et al. 2014), so δ = 75.04° (the UVES manual; the ESPRESSO papers' 76° is the nominal R4 label), θ = 0, γ = 0 (not published), camera 800 mm (the blue camera's 400 mm, Pepe et al. 2014 Sec. 3.5, × the 2:1 transfer, DERIVED from the mirror radii; the red camera's focal length is not published and is taken equal), cross-disperser an equivalent " + xG + " /mm VPH (EFFECTIVE: the real prism + VPH is not published; fitted so the chip holds the manual's orders " + m1 + "–" + m2 + "), 9232 × 9216 of 10 µm. Central wavelength: the blaze of order " + mc + ", nearest the chip center. D = 8.2 m, the primary: no source gives the effective aperture of the coudé feed (140 µm = 1.0″ at F/3.5 implies 8.25 m). At the intermediate focus the red arm has a field mirror and the blue arm a field lens, as in the layout figures (Pepe et al. 2021, Fig. 3; the User Manual, Fig. 5; Mégevand et al. 2014, Fig. 14); the text of Pepe et al. 2021, Sec. 3.1.5, names them the other way round.",
    state: { mode: "echelle", D: 8.2, F: 5.0,
      e: { lay3d: "wp", wpT: 1500, fold3d: k === "r" ? "field mirror" : "field lens, drawn as a fold", xdLabel: "VPH grating on a prism",
           note3d: "the beam is drawn as the unsliced equivalent (600 mm at the echelle); the pupil slicer makes two 300 × 200 mm beams there, and the camera's " + (k === "b" ? "400 mm is the design value (Pepe et al. 2014)" : "focal length is not published"),
           slitW: S3 * 1.0, nObj: 4, col: "mirror", W: 600, fcam: 800, eG: 31.6, eDelta: 75.04, gamma: 0, theta: 0, xd: "vph", xG, xPsi: 10,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: lc, Nx: 9232, Ny: 9216, pix: 10 } },
    pub: [
      { what: "R = 140,000 (singleHR, measured)", q: "R", value: 140000, info: true, src: "ESO ESPRESSO manual Table 1; Pepe et al. 2021 Sec. 4.1.2: 138,000 median, from the FWHM of ThAr lines, which are partly resolved, so \"(safe) lower limits\". The model's R is the line's true FWHM; a Gaussian fitted to a round core's line gives 0.70 of the core against the true 0.866 (DERIVED), so a fitted R can sit up to 24% above the model's (the fitting function is not stated; INFERRED). The same grating family in HARPS shows the same gap" },
      { what: "4.5 px per resolution element (expected, design)", q: "npix", value: 4.5, tol: 0.08, src: "ESO ESPRESSO manual Table 1; Pepe et al. 2021 Sec. 3.2.2: \"the value expected at the center of an extracted echelle order\"" },
      ...dl.map(([l, m, v]) => ({ what: (v / 10).toFixed(5) + " nm/px at " + (l / 10).toFixed(2) + " nm (order " + m + ")", q: "dlpixAt", lam: l, m, value: v, tol: 0.02, src: "Pepe et al. 2021 Table 2 (the design camera, not fitted)" })),
      { what: "orders " + m1 + "–" + m2, q: "nOrders", value: m2 - m1 + 1, info: true, src: "ESO ESPRESSO manual Tables 7–8. Not a test: the equivalent cross-disperser was fitted to this range" },
    ],
  })),
  {
    id: "muse", tel: "VLT 8.2 m", name: "VLT / MUSE WFM (effective optics)",
    note: "VLT MUSE Wide Field Mode, one of the 24 identical IFU spectrographs (Bacon et al. 2010, 2017; ESO MUSE manual): Nasmyth focus of UT4, entered with the 8000 mm Nasmyth entrance pupil (VLT-SPE-ESO-10000-2723 Table 3), 0.2″ slices, 48 slices × 75 spaxels = 3600 spectra per detector (DERIVED: the 15″ slice in 0.2″ spaxels), refractive collimator, one VPH grating, e2v 4112 × 4096 of 15 µm. The collimator and camera focal lengths, the beam and the VPH line density are NOT published: the EFFECTIVE values here (f_col 499.3 mm and camera 258.4 mm, DERIVED from the Potsdam MRS derivative's 118 mm slit, 61.44 mm chip and 0.52 magnification (Moralejo et al. 2016); beam 66.81 mm, which makes the 0.2″ slice 2.0 px wide on the 8.0 m pupil, the design's slice image (Bacon et al. 2006; the manual's measured sampling is 2.5 px per resolution element); VPH 458.4 /mm at the symmetric setting for 7000 Å, derived from the 1.25 Å/px) reproduce the dispersion and the 2-px slice image. MUSE's fore-optics magnify the field 2× along the dispersion (across the slices) relative to along the slices; the explorer has one isotropic magnification and is set for the dispersion direction, so the explorer's spatial scale reads half the real 0.2″/px.",
    state: { mode: "grating", D: 8.0, F: 499.3 / 66.81,
      g: { slitW: 0.2, nObj: 3600, col: "lens", W: 66.81, fcam: 258.4, gType: "trans", G: 458.4, m: 1, lamB1: 5000, lamC: 7000, psi: 35, tAlpha: null, Nx: 4112, Ny: 4096, pix: 15 } },
    pub: [
      { what: "1.25 Å/px", q: "dlpix", value: 1.25, info: true, src: "ESO MUSE manual Table 1. Not a test: the effective VPH line density was derived from this value (Weilbacher et al. 2020 let the arc-line search assume a local dispersion between 1.19 and 1.31 Å/px)" },
      ...[[4650, 1609], [7000, 2737], [9350, 3506]].map(([l, r]) => ({ what: "lab R = " + r + " at " + l + " Å", q: "RAt", lam: l, value: r, info: true, src: "ESO MUSE manual Sec. 3.2, Fig. 18 table (laboratory, calibration lamps; the effective optics are stand-ins, so R is a reference here: the model lands within 3–9% across the band)" })),
      { what: "0.2″/px along the slices", q: "pixScale", value: 0.2, info: true, src: "ESO MUSE manual (the explorer gives half: the 2× anamorphic fore-optics are not modeled)" },
    ],
  },
  {
    id: "uvesb", tel: "VLT 8.2 m", name: "VLT / UVES blue 390, 1″", inst: "UVES", setting: "blue 390, 1″",
    note: "VLT UVES blue arm, standard 390 nm setting with CD#2 (Dekker et al. 2000; ESO UVES manual; ESO pipeline physical model for the cross-disperser angle): 8.0 m entrance pupil at f/10 (the value that reproduces the published scales), white-pupil collimator mirror 2000 mm, beam 200 mm, R4 echelle 41.59 /mm (δ = 76.0°, θ = 0, γ = 0.8°), cross-disperser 660 /mm at a 46.0° camera–collimator angle, camera 360 mm f/1.8, EEV 2048 × 3000 of 15 µm (a 2048 × 4096 CCD read out windowed: the UVES manual Table 2.3). The off-plane angle tilts the lines by 8°; UVES rotates its slit by 7° to cancel the tilt (Dekker et al. 2000), which the page does not, so the drawn lines are tilted. The 45° flat between the slit and the collimator (Dekker et al. 2000) is not drawn.",
    state: { mode: "echelle", D: 8.0, F: 10,
      e: { lay3d: "wp", wpT: 2000, slitW: 1, nObj: 1, col: "mirror", W: 200, fcam: 360, eG: 41.59, eDelta: 76.0, gamma: 0.8, theta: 0, xd: "grating", xG: 660, xPsi: 46.0,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 3900, Nx: 3000, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R = 41,400 at 1″ (R × slit, slit-limited)", q: "Rs", value: 41400, tol: 0.06, src: "ESO UVES manual (R × slit = 41,400; the geometric 2 tan δ W / D reproduces it to 0.1%)" },
      { what: "λ/193,000 per pixel (order 120 at 3888 Å)", q: "dlpixAt", lam: 3888, m: 120, value: 3888 / 193000, tol: 0.03, src: "ESO UVES manual" },
      { what: "0.246″/px along the slit", q: "pixScale", value: 0.246, tol: 0.03, src: "ESO UVES exposure-time calculator, 390 setting (\"Medium pixel scale in Y (spatial) direction: 0.246 arcsec/pix\"); the manual's Table 1.1 rounds to 0.25″" },
      { what: "R ≈ 45,000 at 1.0″ (measured median, blue)", q: "R", value: 45000, info: true, src: "Dekker et al. 2000 Fig. 14, the median FWHM of hundreds of ThAr lines, averaged over the 342 and 437 nm settings (read from the plot, ±1000). The model's R is 10% lower; a Gaussian fitted to a slit's top-hat line reads up to 1/0.84 = 1.19 times the geometric R" },
      { what: "coverage from 3260 Å", q: "lo", value: 3260, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 390 setting" },
      { what: "coverage to 4540 Å", q: "hi", value: 4540, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 390 setting" },
      { what: "minimum order separation 9.35″ (orders 141–142, 38 px)", q: "minSepArcsec", m1: 104, m2: 142, value: 9.35, tol: 0.03, src: "ESO UVES exposure-time calculator, 390 setting, spectral-format table: orders 141 and 142 at y = 64 and 26 px, 38 px × 0.246″ (DERIVED). The manual's Table 3.2 gives 9.6″ for a 395 nm setting, its Table 1.1 10″" },
    ],
  },
  {
    id: "uvesr", tel: "VLT 8.2 m", name: "VLT / UVES red 580, 1″", inst: "UVES", setting: "red 580, 1″",
    note: "VLT UVES red arm, standard 580 nm setting with CD#3 (Dekker et al. 2000; ESO UVES manual; ESO pipeline physical model): 8.0 m entrance pupil at f/10, collimator mirror 2000 mm, beam 200 mm, R4 echelle 31.6 /mm (δ = 75.04°, θ = 0, γ = 0.8°), cross-disperser 600 /mm at 45.336°, camera 500 mm f/2.5, two 2k × 4k CCDs (4096 × 4096 of 15 µm; the 0.96 mm gap between the chips, where order 105 falls, is not modeled). The model's orders 106–128 span 1.3% more than the exposure-time calculator's, so order 128 (from 4727 Å in the calculator) falls just off the chip and the coverage starts at 4806 Å. The lines are drawn tilted by the off-plane angle (6°); UVES rotates its slit to cancel the tilt. The 45° flat between the slit and the collimator (Dekker et al. 2000) is not drawn.",
    state: { mode: "echelle", D: 8.0, F: 10,
      e: { lay3d: "wp", wpT: 2000, slitW: 1, nObj: 1, col: "mirror", W: 200, fcam: 500, eG: 31.6, eDelta: 75.04, gamma: 0.8, theta: 0, xd: "grating", xG: 600, xPsi: 45.336,
           xGlass: "silica", xA: 40, xPasses: 1, xPrisms: null, lamC: 5800, Nx: 4096, Ny: 4096, pix: 15 } },
    pub: [
      { what: "R = 38,700 at 1″ (R × slit, slit-limited)", q: "Rs", value: 38700, tol: 0.06, src: "ESO UVES manual (R × slit = 38,700; the geometric 2 tan δ W / D reproduces it to 0.3%)" },
      { what: "λ/250,000 per pixel (order 110 at 5559 Å)", q: "dlpixAt", lam: 5559, m: 110, value: 5559 / 250000, tol: 0.03, src: "ESO UVES manual" },
      { what: "0.182″/px along the slit", q: "pixScale", value: 0.182, tol: 0.03, src: "ESO UVES exposure-time calculator, 580 setting, and the pipeline's physical model; the manual's Table 1.1 rounds to 0.18″" },
      { what: "R ≈ 44,000 at 1.0″ (measured median, red)", q: "R", value: 44000, info: true, src: "Dekker et al. 2000 Fig. 14 (ThAr line FWHMs, averaged over the 580 and 860 nm settings; read from the plot, ±1000). The model's R is 15% lower; a Gaussian fit to a slit's line reads up to 1.19 times the geometric R, and the pipeline's physical model sets the red echelle 0.47° below its facet angle, which would lower the chip-center R by up to 3% further (audit S8)" },
      { what: "coverage from 4760 Å", q: "lo", value: 4760, tol: 0.015, src: "ESO UVES manual Table 3.1 (rounded); the exposure-time calculator's order 128 starts at 4726.9 Å, which the model misses (see the note)" },
      { what: "coverage to 6840 Å", q: "hi", value: 6840, tol: 0.015, src: "ESO UVES manual / exposure-time calculator, 580 setting" },
      { what: "minimum order separation 14.1″ (580 setting)", q: "minSepArcsec", m1: 90, m2: 128, value: 14.1, tol: 0.025, src: "ESO UVES manual Table 3.2 (CD#3 at 580 nm: 77.4 px = 14.1″); Dekker et al. 2000 Fig. 9 gives 13.8″ for the same setting, so the tolerance is their 2.2% difference (the manual's Table 1.1 gives 9″ and the ESO pages 12″ for the red arm without naming a setting)" },
    ],
  },
  ...[
    // Audited 2026-11-16 (data/audit/): each arm's band (the dichroics), the orders the real detector holds (VIS and NIR
    // recentered: the blaze of the middle order pushed VIS order 30 and NIR order 26 off the chip), the NIR slit ratio
    // from ESO's physical model, and the published R as fitted line widths.
    ["uvb", "UVB", 8.115, 206264.8 / 3.91 / 8115, 100, [9.31, "2.7"], 180, 41.77, 2.2, { xGlass: "silica", xA: 60, xPasses: 2, xPrisms: null }, 4145, 3000, 1800, 15, 1.0,
      5400, 6.2, 0.164, 12, 18, 390.6, 428.9, "one 60° fused-silica prism in double pass", [2936, 5930], "24–13"],
    ["vis", "VIS", 8.115, 206264.8 / 3.82 / 8115, 100, [8.98, "2.8"], 99.4, 54.0, 2.0, { xGlass: "SF6", xA: 49, xPasses: 2, xPrisms: null }, 6821, 4096, 2048, 15, 0.9,
      8900, 5.7, 0.154, 15, 23, 675.4, 730.7, "one 49° SCHOTT SF6 prism in double pass", [5253, 10489], "30–16"],
    ["nir", "NIR", 8.115, 0.52266 * 206264.8 / 8115, 85, [12.1, "2.1"], 55, 46.07, 1.8, { xGlass: "ZnSe-105K", xA: 22, xPasses: 2,
      xPrisms: [{ glass: "Infrasil-105K", A: 35 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "ZnSe-105K", A: 22 }, { glass: "Infrasil-105K", A: 35 }] },
      13763, 2048, 1024, 18, 0.9, 5600, 3.6, 0.245, 16, 18, 1400.8, 1511.5, "a 35° Infrasil and two 22° ZnSe prisms in double pass, at 105 K", [9827, 24807], "26–11"],
  ].map(([id, arm, D, F, W, [cs, cf], eG, dl, gam, xd, lc, Nx, Ny, pix, slit, R, npx, ps, nOrd, mT, oLo, oHi, xdTxt, band, ords]) => { const fc = 206264.8 / cs / (D * 1000) * W; return {
    id: "xsh" + id, tel: "VLT 8.2 m", name: `VLT / X-Shooter ${arm}, ${slit.toFixed(1)}″`, inst: "X-Shooter", setting: `${arm}, ${slit.toFixed(1)}″`,
    note: `X-Shooter ${arm} arm (Vernet et al. 2011; ESO user manual): echelle ${eG} /mm at ${dl}°, in-plane offset 0, ${gam}° out of plane; ${xdTxt}; ${W} mm beam (D'Odorico et al. 2006); mirror (Maksutov-type) collimator; camera f/${cf} (effective focal length ${fc.toFixed(1)} mm, from the published camera plate scale ${cs}″/mm and the beam on the 8115 mm Cassegrain entrance pupil, VLT-SPE-ESO-10000-2723 Table 2); detector area used ${Nx} × ${Ny} px of ${pix} µm.` +
      (id === "nir" ? ` Slit focal ratio f/${F.toFixed(2)} from the slit scale of ESO's physical model, 0.52266 mm/″ on the 8115 mm pupil (relay mirrors re-image the Cassegrain focus); the model's fitted collimator, 1020 mm, implies a 76.8 mm beam against the design's 85 mm, which the preset keeps (unresolved; the focal ratio changes only the drawing).` : ` Slit focal ratio f/${F.toFixed(2)} from the published slit plate scale (f_col = ${(F * W).toFixed(0)} mm).`) + ` The arm's band, ${band[0] / 10}–${band[1] / 10} nm with orders ${ords} (Vernet et al. 2011 Table 3; ESO's spectral-format tables), is the range recorded on the detector (the dichroics cross over at 559.5 and 1024 nm); orders outside the band are dropped.` + (id === "uvb" ? " The explorer stops at 3200 Å, so order 24 (293.6–322.3 nm) is missing. Central wavelength: the blaze of the middle order as Vernet et al. 2011 Table 3 lists it (4145 Å; the model's echelle constants put that order's blaze at 4109 Å, 4.3 mm from the chip's center)." : ` Central wavelength ${lc} Å, which puts orders ${ords} on the chip, as ESO's spectral-format tables place them.`),
    state: { mode: "echelle", D, F,
      e: Object.assign({ lay3d: "4c", fold3d: id === "nir" ? "fold M5 and spherical field mirror M8, drawn as one" : "folding mirrors 1 and 2, drawn as one", slitW: slit, nObj: 1, col: "mirror", W, fcam: fc, eG, eDelta: dl, gamma: gam, theta: 0, xd: "prism", xG: 300, xPsi: 10, lamC: lc, Nx, Ny, pix, filt: band }, xd) },
    pub: [
      { what: `R × sampling = ${R} × ${npx} = λ / (Å per pixel)`, q: "Rnpix", value: R * npx, info: true, src: "ESO X-Shooter user manual Table 13; the measured values of Vernet et al. 2011 Table 4 give " + { uvb: "5100 × 6.3 = 32,130", vis: "8800 × 6.0 = 52,800", nir: "5600 × 4.0 = 22,400" }[id] + ", and the two printed tables differ by " + { uvb: "4%", vis: "4%", nir: "11%" }[id] + ", so the line is not scored" + (id === "vis" ? ". The model is 5.6% above Table 13's product and 1.4% above Table 4's. The table's product implies 0.140 Å/px at 7112 Å, while order 23 spans 55.3 nm over the 4096 px (Vernet et al. 2011 Table 3; 0.135 Å/px on average), which the model reproduces (the order-23 line): the two sources differ by 4%" : "") },
      ...(id !== "nir" ? [{ what: `order ${mT} spans ${(oHi - oLo).toFixed(1)} nm on the detector`, q: "ordSpan", m: mT, value: (oHi - oLo) * 10, tol: 0.05, src: "Vernet et al. 2011 Table 3" }] : []),
      ...(id === "nir" ? [{ what: `${nOrd} orders on the detector`, q: "nOrders", value: nOrd, tol: 0.10, src: "Vernet et al. 2011 Table 3" }] : []),
      { what: `R ${R} (${slit.toFixed(1)}″)`, q: "R", value: R, info: true, src: "ESO X-Shooter user manual Table 13 (the manual does not say how R was measured; Vernet et al. 2011 Table 4 prints the measured 5100, 8800 and 5600 at these slits; ESO's quality-control pages fit the arc lines' profiles, and note that the pipeline's R was biased by 19% in the UVB and 15% in the VIS). A Gaussian fitted to the model's top-hat line gives R ≈ 5420, 9240 and 5890 (the page's tooltip), against 5400, 8900 and 5600; the true FWHM of the line gives 16%, 13% and 12% less than the table" },
      { what: `${npx} px per FWHM`, q: "npix", value: npx, info: true, src: "ESO X-Shooter user manual Table 13" },
      { what: `${ps}″/px along the slit`, q: "pixScale", value: ps, info: true, src: "ESO X-Shooter user manual Sec. 2.3.1 (the projected slit height). Vernet et al. 2011 Fig. 9 caption (≈ 0.15, 0.15, 0.20″/px) and ESO's physical-model scales (0.149, 0.134, 0.200) agree with the model better than the manual's 0.164, 0.154, 0.245" },
      ...(id !== "nir" ? [{ what: `${nOrd} orders (limited by the dichroic crossovers, not modeled)`, q: "nOrders", value: nOrd, info: true, src: "Vernet et al. 2011 Table 3" }] : []),
      ...(id === "nir" ? [{ what: `order ${mT} recorded over ${(oHi - oLo).toFixed(1)} nm`, q: "ordSpan", m: mT, value: (oHi - oLo) * 10, info: true, src: "Vernet et al. 2011 Table 3 (shorter than the dispersion x 2048 px implies; the published limits look like the pipeline's order limits, INFERRED)" }] : []),
      // (the cross-dispersion against ESO's spectral-format tables: the model's is 10-16% stronger, cause open)
      ...(id !== "uvb" ? [(([a, b, px]) => ({ what: `orders ${a} to ${b}: centers ${px} px apart across the dispersion`, q: "ySpan", m1: a, m2: b, value: px * pix / 1000, info: true, src: "ESO's spectral-format table for the pipeline (xsh-calib-1.2.0, SPECTRAL_FORMAT_TAB_" + arm + "_NEW.fits, XDISP_CEN; value in mm). The model's cross-dispersion is " + (id === "vis" ? "15" : "9") + "% stronger, the excess growing toward the blue orders (audit S3). ESO's physical model also sets the prisms near minimum deviation, and its fitted camera focal length explains ≈ 2.5% of the excess; the cause is open" }))(id === "vis" ? [16, 30, 1564] : [11, 26, 928])] : []),
    ],
  }; }),
  {
    id: "feros", tel: "MPG/ESO 2.2 m", name: "MPG 2.2 m / FEROS",
    note: "FEROS (1997 Final Design Report; Kaufer & Pasquini 1998; ESO user manual): 2.0″ fibers whose image a two-slice image slicer cuts into 1.0″-wide slits at f/11 (120 µm, 2.2 px on the detector), object and sky/calibration fibers (2 spectra), white-pupil collimator mirrors 1500 mm (beam 136 mm), R2 echelle 79 /mm (δ = 63.4°, θ = 0, γ = 0.6°), one LF5 prism of 55° in single pass at minimum deviation for 4623 Å (entered as an EFFECTIVE 56°, centered on 4550 Å, so that the chip holds the 39 orders 25–63 FEROS records; the design's 55° put parts of orders 22–24 on the chip too), camera 410 mm, EEV 4096 × 2048 of 15 µm (dispersion along the long side). The camera is not corrected for lateral color (Kaufer & Pasquini 1998 Sec. 2.3; Final Design Report Sec. 3.8.2), so its focal length runs from ≈ 407 mm in the red to ≈ 403 mm in the blue (DERIVED from the CERES arc lines; the design table gives 410 mm); with one focal length the model's dispersion is 0.7–1.8% too fine (the CERES pipeline's arc lines).",
    state: { mode: "echelle", D: 2.2, F: 1500 / 136,
      e: { lay3d: "wp", wpT: 1500, slitW: 1.0, nObj: 2, col: "mirror", W: 136, fcam: 410, eG: 79, eDelta: 63.4, gamma: 0.6, theta: 0, xd: "prism", xG: 300, xPsi: 10, xGlass: "LF5", xA: 56, xPasses: 1, xPrisms: null,
           lamC: 4550, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: "R = 48,000 (measured)", q: "R", value: 48000, info: true, src: "Kaufer et al. 1999 (\"The measured spectral resolving power of FEROS is R = 48,000 corresponding to 2.2 pixels of 15 µm\"); ESO FEROS manual. A line only 2.2 px wide is widened by the pixels when measured; the page's R leaves the pixel out (51,100, +6%), and the pixel in quadrature would give ≈ 46,600 (−3%), so the measurement sits between the two. The model's dispersion is also 0.7–1.8% too fine (the camera's lateral color), which raises its R by as much. The geometry is scored by the measured dispersions below" },
      { what: "coverage from 3560 Å", q: "lo", value: 3560, tol: 0.02, src: "ESO FEROS manual" },
      { what: "coverage to 9200 Å (orders 25–63)", q: "hi", value: 9200, info: true, src: "ESO FEROS manual (356–920 nm in 39 orders); the Final Design Report Sec. 2.2 says light \"up to 9 200 Å is in principle also available on the detector\". With the design's 55° prism the model also placed parts of orders 22–24 (to 10,200 Å) on the chip; the as-built format needs ≈2–4% more cross-dispersion (audit S7, DERIVED), so the prism is entered as an EFFECTIVE 56° and λc 4550 Å centers the 39 orders 25–63. Order 25 reaches 9000 Å in the model" },
      ...[[33, 6867.3, 0.06265], [49, 4626.6, 0.04237]].map(([m, l, v]) => ({ what: v + " Å/px in order " + m + " at " + l + " Å (measured)", q: "dlpixAt", lam: l, m, value: v, tol: 0.02, src: "CERES pipeline (Brahm et al. 2017; commit 72a95b2), the FEROS ThAr line list for order " + m + ": a cubic fit to the identified lines' pixel positions (DERIVED, audit S7). The camera has no lateral-color correction, so the model's dispersion runs 0.7% (red) to 1.8% (blue) finer" })),
      { what: "order spacing from ~30 px (orders 25–63)", q: "minSepPx", m1: 25, m2: 63, value: 30, tol: 0.1, src: "FEROS Final Design Report (30 to 100 px across the format)" },
    ],
  },
  {
    id: "harps", tel: "ESO 3.6 m", name: "ESO 3.6 m / HARPS",
    note: "HARPS (User Manual 2.4; ESO HARPS pages): fiber-fed, 1″ (70 µm) fibers entered as the slit of equal line width, 0.87″, at the spectrograph's own f/7.5 (the on-sky convention: the 1″ angle with the internal beam's focal ratio; octagonal fibers since June 2015, User Manual Sec. 4.7, whose line profile the round-core factor approximates); R4 echelle 31.6 /mm, \"a copy of the UVES mosaic\" (ESO), so the facets at UVES's 75.04° and the grating turned 0.26° to Littrow at 75.3° at the chip center (the exposure-time calculator's central-column m λ, 61.215 µm; DERIVED), 0.721° out of plane, f_col 1560 mm (208 mm beam, f/7.5), FK5 grism 257.17 /mm \"blazed at 480nm\", so an apex of 14.5° (DERIVED, with the groove facet equal to the apex, INFERRED), camera 728 mm, two 2k × 4k CCDs of 15 µm with the 1215 µm gap between them counted in the height (4177 px; the gap itself is not drawn). Central wavelength: order 115 (5323 Å at the central column), which the manual places in the gap at the center of the mosaic. The model's R is the geometric FWHM of the line. This is the 2003–2026 detector: in May–June 2026 ESO replaced the two-CCD mosaic with a monolithic detector of the same pixel count and size, with new electronics, a Stirling cooler and a new pipeline (ESO, HARPS Upgrade 2026, updated October 2026).",
    state: { mode: "echelle", D: 3.566, F: 7.5,
      e: { lay3d: "wp", wpT: 1560, wp3: true, fold3d: "fold", note3d: "the fold between the second and third passes appears in the HARPS User Manual's Fig. 2.1 but is not described in the text", slitW: S3 * 1.0, nObj: 2, col: "mirror", W: 208, fcam: 728, eG: 31.6, eDelta: 75.04, eTilt: 0.26, gamma: 0.721, theta: 0, xd: "grism", xG: 257.17, xGrA: 14.5, xPsi: 10,
           xGlass: "FK5HTi", xA: 40, xPasses: 1, lamC: 5323, Nx: 4096, Ny: 4177, pix: 15 } },
    pub: [
      { what: "R = 536.97 nm / (3.4 px x 0.0015 nm) = 105,000", q: "RAt", lam: 5369.7, value: 5369.7 / (3.4 * 0.015), info: true, src: "HARPS manual: the manual's sampling × dispersion, both scored below, so this line repeats them" },
      { what: "R 115,000 (measured)", q: "R", value: 115000, info: true, src: "HARPS manual Table 2.2 (ESO web page: 120,000 with 4.1 px per FWHM; Mayor et al. 2003: 115,000 at 3.2 px). The sources disagree on the sampling (3.2–4.1 px); the model's 3.49 px agrees with the manual's 3.4. A Gaussian fitted to a pixel-sampled round fiber's line about 4 px wide returns a FWHM 0.71–0.77 of the core instead of the geometric 0.866, which would raise a fitted R by 13–19% from the model's geometry (audit S1, numerical test; no source states the method)" },
      { what: "3.4 px per FWHM", q: "npix", value: 3.4, tol: 0.10, src: "HARPS manual Table 2.2 (other sources 3.2-4.1)" },
      { what: "coverage from 3800 Å", q: "lo", value: 3800, tol: 0.02, src: "HARPS manual Table 2.2" },
      { what: "coverage to 6900 Å", q: "hi", value: 6900, tol: 0.03, src: "HARPS manual Table 2.2" },
      { what: "reddest order 89", q: "mLo", value: 89, tol: 0, src: "HARPS manual Table 2.2 (an order number: exact)" },
      { what: "bluest order 161", q: "mHi", value: 161, info: true, src: "HARPS manual Table 2.2. The model's bluest order on the chip is 160: its order spacing runs −0.9% to +2% of the manual's (99.8 vs 100.7 px at orders 89–90, 34.9 vs 34.2 px at 160–161), so order 161 falls just past the blue edge" },
      { what: "0.0015 nm/px in order 114 (536.97 nm)", q: "dlpixAt", lam: 5369.7, m: 114, value: 0.015, tol: 0.10, src: "HARPS manual Fig. 2.3" },
      ...[[89, 90, 100.7], [114, 115, 62.7], [116, 117, 60.7], [160, 161, 34.2]].map(([a, b, v]) => ({ what: "order " + a + " to " + b + " separation " + v + " px", q: "minSepPx", m1: a, m2: b, value: v, info: true, src: "HARPS manual Table 2.2, which gives the separation at orders 89, 114, 116 and 161 without saying from which neighbor or where along the order (read here as the next order, at the blaze centers). The 14.5° apex from the 480 nm blaze reproduces all four to ≤2% (the apex set by λc, 16.2°, gave up to 4.7%); not scored because the reading is not stated" })),
    ],
  },
  // VISTA / 4MOST: low-resolution (LRS) and high-resolution (HRS) spectrographs, three VPH arms each
  // (data/round4/4most.md).  LRS: 2016 design-review optics, confirmed by the 4MOST instrument-model (TOAD) table.
  // HRS: the as-built optics are not public. Audited 2026-11-16 (data/audit/): ESO's QMOST pipeline kit 0.9.6 carries
  // the as-built wavelength maps and fiber traces, so the HRS camera is the EFFECTIVE 441 mm that puts the concept
  // slit's 170 µm fiber separation at the as-built 6.6–6.7 px (the fiber images are 3.5% wider than the LRS's, the same
  // scale), and each VPH is EFFECTIVE, fitted at the symmetric setting to the as-built dispersion at the as-built λc.
  // x: LRS, the TOAD detector edges (A); HRS, the as-built edges (A) and the 4most.eu figure's R at lambda_c
  ...[["LRS", "blue", 1351, 18.65, 36.50, 4636, 3700, 5540, 0.308, [3671.3, 5549.4]], ["LRS", "green", 1220, 22.68, 44.86, 6254, 5240, 7210, 0.330, [5220.0, 7228.6]], ["LRS", "red", 925, 22.65, 44.82, 8243, 6910, 9500, 0.434, [6883.5, 9524.3]],
      ["HRS", "blue", 3379, null, null, 4150.05, 3926, 4355, 0.07177, [3917.9, 4357.8, 20170]], ["HRS", "green", 2570, null, null, 5458.61, 5160, 5730, 0.09436, [5153.9, 5731.8, 19980]], ["HRS", "red", 2160, null, null, 6459.83, 6100, 6790, 0.11286, [6095.2, 6786.2, 20260]]].map(([sp, arm, G, al, cam, lc, l0, l1, disp, x]) => {
    const lrs = sp === "LRS", W = lrs ? 200 : 250, fcol = lrs ? 600 : 750, fcam = lrs ? 345 : 441;
    return {
      id: "4most" + sp.toLowerCase()[0] + arm[0], tel: "VISTA 4.1 m", name: "VISTA / 4MOST " + sp + " " + arm + (lrs ? "" : " (effective optics)"), inst: "4MOST " + sp + (lrs ? "" : " (effective optics)"), setting: arm,
      note: "VISTA 4MOST " + sp + " " + arm + " arm (de Jong et al. 2019; 4MOST User Manual; 4MOST spectrograph papers" + (lrs ? " and the 2023 instrument-model table" : "") + "): 85 µm fibers, 1.45″ on the sky; the explorer enters the core at the f/3.0 fiber output, 85 µm / (3.0 × 4.1 m) = 1.43″, as the slit of equal line width (1.23″); 824 spectra per detector (812 science + 12 calibration), collimator mirror " + fcol + " mm (beam " + W + " mm" + (lrs ? ")" : ", the concept design's)") + ", VPH " + G + " /mm" + (lrs ? " at α = " + al + "°, camera at " + cam + "° to the collimator" : " at the symmetric setting") + ", camera " + fcam + " mm" + (lrs ? " (f/1.73, 2016 design review)" : ". The HRS as-built optics are not public: the camera is the effective focal length that places the concept slit's 170 µm fiber separation at the 6.6–6.7 px of the as-built fiber traces, and the VPH the effective line density that gives the as-built dispersion at the as-built central wavelength (ESO's QMOST pipeline calibrations, 2026)") + ", 6144 × 6160 pixels of 15 µm." + (lrs ? "" : " The collimator's 7.7° tilt, the 1730 mm path to the grating and the dichroic's 145° turn at 0.52 of that path are read from the blue arm's concept-design schematic, which has no scale (Hansen et al. 2015, Fig. 1, scaled here by the 750 mm collimator; drawing only); the green and red arms are drawn the same way."),
      state: { mode: "grating", D: 4.10, F: fcol / W,
        g: { slitW: S3 * 0.085 / (3.0 * 4100) * 206264.806, nObj: 824, col: "mirror", ...(lrs ? {} : { colTilt: 7.7, layLen: 1730, foldOn: true, foldAng: 215, foldPos: 0.52, foldLabel: "dichroic", gFlip: true }), W, fcam, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
             psi: 35, tAlpha: al, Nx: 6144, Ny: 6160, pix: 15 } },
      pub: lrs ? [
        { what: disp + " Å/px at λc", q: "dlpix", value: disp, tol: 0.02, src: "4MOST instrument-model (TOAD) table, 2023" },
        { what: "detector from " + x[0] + " Å (the arm's band starts at " + l0 + " Å)", q: "lo", value: x[0], info: true, src: "4MOST TOAD table, 2023; band: Laurent et al. 2026 Sec. 2 and the 4MOST User Manual. Not a test: λc is TOAD's center wavelength and TOAD's center dispersion is scored above, so the edges follow; the dichroics set the band" },
        { what: "detector to " + x[1] + " Å (the arm's band ends at " + l1 + " Å)", q: "hi", value: x[1], info: true, src: "4MOST TOAD table, 2023 (see the line above)" },
        { what: "~3 px per resolution element (2.92 median)", q: "npix", value: 2.92, info: true, src: "Laurent et al. 2016 Sec. 4.5 (median 2.92 px, a worst case including the CCD and scattered light; the model's line is geometry only); 4MOST User Manual: ~3. The geometric fiber image in Laurent et al. Fig. 3 is 49 µm, 3.27 px; the model's is 3.25 px" },
        { what: "R 4000–7700 across the LRS (mean 6500)", q: "R", value: NaN, info: true, src: "4most.eu Capabilities page; mean 6500 in de Jong et al. 2019 Table 1" },
      ] : [
        { what: disp + " Å/px at λc (as built)", q: "dlpix", value: disp, info: true, src: "ESO QMOST pipeline kit 0.9.6, QMOST_WAVE_MAP_HRS (the center fiber). A reference line: the VPH is fitted to this dispersion" },
        { what: "detector from " + x[0] + " Å", q: "lo", value: x[0], tol: 0.001, src: "ESO QMOST pipeline kit 0.9.6, QMOST_WAVE_MAP_HRS (the center fiber's first pixel). Tests the change of dispersion across the chip, which the fit does not set" },
        { what: "detector to " + x[1] + " Å", q: "hi", value: x[1], tol: 0.001, src: "ESO QMOST pipeline kit 0.9.6, QMOST_WAVE_MAP_HRS (the center fiber's last pixel)" },
        { what: "R ≈ " + x[2].toLocaleString("en-US") + " at λc", q: "Rs", value: x[2], info: true, src: "4most.eu Capabilities page, the figure's R curve at λc (read from the curve; the figure does not say how R is defined). ESO's exposure-time-calculator table (qmostetc 2.6.1, the TOAD file's Resolution table) prints R = 22,565, 22,416 and 22,447 at the arms' λc, 11–12% higher, and defines R no better, so the line is not scored. Compared with the model's slit-limited R. The mean over the HRS is 20,000 (de Jong et al. 2019 Table 1)" },
        { what: "band " + l0 + "–" + l1 + " Å", q: "span", value: l1 - l0, info: true, src: "de Jong et al. 2019 Table 1" },
      ],
    };
  }),
  // Subaru / PFS: blue, red (low resolution) and near-infrared arms of four identical fiber-fed VPH spectrographs
  // (data/round4/pfs.md); the medium-resolution red arm is a grism, which the explorer does not model
  ...[["blue", "b", 711.4, 7.2, 14.2, 4176, 4096, 0.7, 2500, 5000, 3800, 6500], ["red", "r", 556.7, 9.5, 16.5, 4176, 4096, 0.9, 3000, 8000, 6300, 9700],
      ["NIR", "n", 569.5, 14.9, 21.9, 4088, 4088, 0.8, 4500, 11000, 9400, 12600]].map(([arm, k, G, al, be, nx, ny, disp, Rp, lR, l0, l1]) => ({
    id: "pfs" + k, tel: "Subaru 8.2 m", name: "Subaru / PFS " + arm + " arm", inst: "PFS", setting: arm + " arm",
    note: "Subaru PFS " + arm + " arm (Sugai et al. 2015; Barkhouser et al. 2014 design table; Subaru/IPMU PFS pages): fibers delivering f/2.8; core 129 µm at the spectrograph (cable A; 127 µm at the focal plane, 1.12″ on the sky through the microlens; Sugai et al. 2015 Table 1), entered at f/2.8, 129 µm / (2.8 × 8.2 m) = 1.16″, as the slit of equal line width; 616 spectra per detector (600 science + 16 engineering), on-axis Schmidt collimator mirror 693.5 mm (the slit-to-collimator distance; beam 248 mm at f/2.8; the slit stands in the returning beam), VPH " + G + " /mm at α = " + al + "°, β = " + be + "° (design values), camera 300 mm (f/1.09 on the design pupil of the f/2.5 collimator, Sugai et al. 2015 Table 1; the f/2.8 fiber beam fills 248 mm of that pupil), " + nx + " × " + ny + " pixels of 15 µm. The grating stands ≈1550 mm from the collimator (MEASURED from the unscaled Vives et al. 2014, Fig. 2), just past the Schmidt corrector, which stands at the center of curvature of the R = 1400 mm collimating mirror (Vives et al. 2012), and each camera is a Mangin-Schmidt with the detector inside the beam (Vives et al. 2014; Pascal et al. 2014).",
    state: { mode: "grating", D: 8.2, F: 2.8,
      g: { slitW: S3 * 0.129 / (2.8 * 8200) * 206264.806, nObj: 616, col: "mirror", colTilt: 0, layLen: 1550, cam: "mirror", W: 693.5 / 2.8, fcam: 300, gType: "trans", G, m: 1, lamB1: 5000,
           lamC: (Math.sin(al * Math.PI / 180) + Math.sin(be * Math.PI / 180)) / G * 1e7, psi: 35, tAlpha: al, Nx: nx, Ny: ny, pix: 15 } },
    pub: [
      { what: "~" + disp + " Å/px", q: "dlpix", value: disp, info: true, src: "Subaru/IPMU PFS parameter table (Subaru PFS page: the same); one significant figure, so a reference line" + (k === "n" ? " (the NIR detector map in the pipeline's data is a simulation, so no measured test)" : ": the measured detector map below tests the dispersion") },
      ...(k === "n" ? [] : [k === "b" ? [5189, 0.682] : [8054, 0.865]].map(([l, v]) => ({ what: v + " Å/px at " + l + " Å (measured, central fiber)", q: "dlpixAt", lam: l, m: 1, value: v, tol: 0.02, src: "PFS detector map fitted to spectrograph module 3's arcs (drp_pfs_data commit 04512fe, " + k + "3, calibDate 2022-11-15): the central fiber at the middle row (DERIVED, audit S7). The design gratings and angles reproduce the map to 0.1–0.5% along the chip" }))),
      { what: "R ~" + Rp + " at " + lR + " Å", q: "RAt", lam: lR, value: Rp, info: true, src: "Subaru/IPMU PFS parameter table (\"As of July 2024\", measured before shipping). The measured trace spacing (6.16–6.21 px per 213.93 µm fiber pitch, the 2022 detector maps) confirms the 0.433 magnification of the 300 mm camera on the 693.5 mm collimator, so the 129 µm core images to 55.8 µm and the model's R is 7–11% lower. The PFS exposure-time calculator adopts an effective fiber image of 47.0 µm, which reproduces the table's R to −0.6%, +4.4% and 0.0%" },
      { what: "3.0 px per FWHM", q: "npix", value: 3.0, info: true, src: "Subaru/IPMU PFS parameter table (FWHM over Å/px); see the R line" },
      { what: "band " + l0 + "–" + (l1) + " Å", q: "span", value: l1 - l0, info: true, src: "Subaru/IPMU PFS pages (the dichroics trim the arm's band)" },
    ],
  })),
  {
    id: "apogee", tel: "SDSS 2.5 m", name: "SDSS / APOGEE-N",
    note: "APOGEE-N on the Sloan 2.5 m (Wilson et al. 2019, as-built prescription; SDSS DR16 pages): 120 µm fibers, 2.0″ on the sky at the telescope's f/5; the explorer enters the core at the f/3.85 VPH-mask stop, 120 µm / (3.85 × 2.5 m) = 2.57″, as the slit of equal line width, 2.23″; 300 spectra (≈230 science, 35 sky, 35 telluric), on-axis spherical collimator mirror 1053.6 mm (half the cold radius; beam 273.7 mm), VPH 1009.345 /mm at α = 54.061°, camera 356 mm, three H2RG 2048² of 18 µm side by side with 2.9 mm gaps (entered as 6466 px with the gaps as dead pixels; the gaps are not drawn). The detector center λc = 16158 Å is fitted to the published chip edges: the real detectors sit off the camera axis. The VPH grating stands 2104 mm from the collimator along the folded path, at the mirror's center of curvature (Wilson et al. 2019, Table 5); the drawing has both fold mirrors: the first, 343 mm from the collimator, which the light meets on the way to the collimator and again on the way back, and the second, at 50° incidence (Sec. 4.4), as in Wilson et al. 2019, Fig. 16.",
    state: { mode: "grating", D: 2.5, F: 3.85,
      g: { slitW: S3 * 0.120 / (3.85 * 2500) * 206264.806, nObj: 300, col: "mirror", colTilt: 0, layLen: 2104, preFoldOn: true, preFoldAng: 90, preFoldPos: 0.3263, foldOn: true, foldAng: 280, foldPos: 0.76, W: 1053.6 / 3.85, fcam: 356, gType: "trans", G: 1009.345, m: 1, lamB1: 5000, lamC: 16158,
           psi: 35, tAlpha: 54.061, Nx: 6466, Ny: 2048, pix: 18 } },
    pub: [
      { what: "coverage from 15140 Å", q: "lo", value: 15140, info: true, src: "Wilson et al. 2019 Sec. 4 (chip edges). Not a test: λc was fitted to the two outer edges" },
      { what: "coverage to 16960 Å", q: "hi", value: 16960, info: true, src: "Wilson et al. 2019 Sec. 4 (λc fitted to the edges)" },
      { what: "coverage width 1820 Å (15140–16960 Å)", q: "span", value: 1820, info: true, src: "Wilson et al. 2019 Sec. 4. Independent of the λc fit, but the width is the three chips' dispersion × 2048 px plus the two gaps, so the width repeats the three chip-center lines below" },
      ...[[15475, 0.326, "blue"], [16145, 0.283, "green"], [16715, 0.236, "red"]].map(([l, v, c]) => ({ what: v + " Å/px at the " + c + " chip's center (" + l + " Å)", q: "dlpixAt", lam: l, m: 1, value: v, tol: 0.015, src: "SDSS DR16 \"Using APOGEE Spectra\" page, central dispersion of each chip; chip centers from the edges of Wilson et al. 2019" })),
      ...[[15400, 0.326], [16100, 0.282], [16600, 0.235]].map(([l, v]) => ({ what: v + " Å/px \"at " + (l / 1e4).toFixed(2) + " µm\"", q: "dlpixAt", lam: l, m: 1, value: v, info: true, src: "Wilson et al. 2019 Table 1 (also Majewski et al. 2017). At the stated wavelengths the model is 1.0%, 2.8% and 5.9% coarser; the values match the chip centers (lines above), so the wavelength labels are nominal" })),
      { what: "measured R = 22,500 (average; chip medians 22,800, 23,700, 22,000)", q: "R", value: 22500, info: true, src: "Nidever et al. 2015 Sec. 6.2 (the measured average, with 10–20% variations across the detectors); Wilson et al. 2019 Table 1 (the chip medians). At the chip centers the model is 18%, 19% and 32% above the medians: the measured line-spread function (2.01, 2.44, 3.14 px; Majewski et al. 2017 Table 2) is 14–30% wider than the geometric fiber image, which the model does not blur" },
    ],
  },
  // DESI: audited 2026-11-16 (data/audit/). λc places the chip on the ranges Guy et al. 2023 Fig. 14 shows for each camera
  // ("The full wavelength range accessible for each camera"), read from the figure's vector paths; one λc per arm fits
  // both edges to 8–20 Å. Camera focal lengths: the FDR's budgeted design values.
  ...[["B", 1103.5, 11.48, 212.8, 3600, 5930, 2000, 3000, 4809, 3561, 5996], ["R", 1157.4, 18.73, 213.6, 5660, 7720, 3500, 4500, 6768, 5631, 7823], ["Z", 992.5, 21.19, 214.0, 7470, 9800, 4000, 5500, 8712, 7413, 9907]]
    .map(([arm, G, al, fc, l0, l1, r0, r1, lc, c0, c1]) => ({
      id: "desi" + arm.toLowerCase(), tel: "Mayall 4 m", name: `Mayall / DESI ${arm} arm`, inst: "DESI", setting: `${arm} arm`,
      note: `DESI ${arm} arm (DESI Collaboration 2022; Final Design Report; Guy et al. 2023): fiber-fed, 107 µm core, 1.585″ on the sky at the field center; the explorer enters the core at the f/3.57 collimator, 107 µm / (3.57 × 3.797 m) = 1.63″, as the slit of equal line width, 1.41″; on-axis f/3.57 spherical collimator with a 126 mm pupil (the light reaches the mirror through a slot in the first dichroic and returns toward the slit), transmission grating ${G} /mm at ${al}° incidence (as built), ${fc} mm f/1.7 camera (the Final Design Report's budgeted value), ${arm === "B" ? "4096 × 4096" : "4114 × 4128 (Guy et al. 2023: rows along the wavelength; the 4128 taken as the rows, INFERRED)"} pixels of 15 µm. Central wavelength ${lc} Å, which places the chip on the range Guy et al. 2023 measure for the ${arm} camera, ${c0}–${c1} Å; the dichroics trim the band to ${l0}–${l1} Å. The grating stands ≈900 mm from the collimator, at the mirror's center of curvature (twice the 450 mm focal length that the printed f/3.57 and 126 mm pupil give, DESI Final Design Report Sec. 5.1.2; consistent with DESI Collaboration 2022, Fig. 14).`,
      state: { mode: "grating", D: 3.797, F: 3.57,
        g: { slitW: S3 * 0.107 / (3.57 * 3797) * 206264.806, nObj: 500, col: "mirror", colTilt: 0, layLen: 900, W: 126, fcam: fc, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
             psi: 35, tAlpha: al, Nx: arm === "B" ? 4096 : 4128, Ny: arm === "B" ? 4096 : 4114, pix: 15 } },
      pub: [
        { what: `R ≈ ${r0} at ${l0} Å`, q: "RAt", lam: l0, value: r0, info: true, src: `DESI Collaboration 2022 Sec. 7.2 ("approximately" ${r0}–${r1} for the arm, an approximate range, read here at the band edges). Guy et al. 2023 Fig. 13 measures the PSF's FWHM along the dispersion, 2.8–3.3 px; the model's fiber image is 2–6% wider, so the model's R runs 2–6% below the measured` },
        { what: `R ≈ ${r1} at ${l1} Å`, q: "RAt", lam: l1, value: r1, info: true, src: "DESI Collaboration 2022 Sec. 7.2 (see the line above)" },
        { what: "fiber image 107 µm x 0.48 = 3.42 px (spatial magnification; the spectral image is wider by cos α / cos β)", q: "diam", value: 107 * 0.48 / 15, info: true, src: "DESI 2022 Sec. 7.2" },
        { what: `the camera's range spans ${c1 - c0} Å (${c0}–${c1} Å)`, q: "span", value: c1 - c0, tol: 0.01, src: "Guy et al. 2023 Fig. 14 (read from the figure's vector paths, ±5 Å). Tests the dispersion: λc is set from the same edges, so only the span is independent" },
        { what: `chip from ${c0} Å`, q: "lo", value: c0, info: true, src: "Guy et al. 2023 Fig. 14 (λc is set from the edges)" },
        { what: `design band ${l0}–${l1} Å (the dichroics)`, q: "span", value: l1 - l0, info: true, src: "DESI Final Design Report Sec. 5.1" },
      ],
    })),
  // Boombox: audited 2026-11-16 (data/audit/). The Via Science Book (2026) gives the 50 mm beam; the Zemax layout in the
  // Via technical document (with its own 200 mm scale bar) gives the blue arm's geometry, incidence 19.2° and symmetric
  // at mid-band, so 1385 /mm (INFERRED); the drawing's red arm (incidence 24.8°) cannot reach the documented 5700–10100 Å
  // with a 70–75 mm camera, so the red grating (857 /mm) is solved to span that band (an open question for the designers).
  ...[["blue", 1384.7, 4750, 3600, 5900, 19.2], ["red", 857.0, 7981, 5700, 10100, null]].map(([arm, G, lc, l0, l1, al]) => ({
    id: "boombox" + arm[0], tel: "Via (MMT and Magellan 6.5 m)", name: `Via / Boombox ${arm} (partly inferred)`, inst: "Boombox (partly inferred)", setting: arm,
    note: `Boombox ${arm} channel (Via technical document; Via Science Book, 2026): 6.5 m, 200 µm (1.2″) unmasked fibers, refractive-triplet collimator, a 50 mm collimated beam, binary transmission grating, f/1.5 camera (75 mm on the 50 mm beam, DERIVED; ≈ 70–72 mm in the Zemax layout), 2048 × 256 CCD with 15 µm pixels, band ${l0}–${l1} Å. The fiber cone in the Zemax layout is f/5.2 (collimator ≈ 260 mm); the core enters at f/5.2, 200 µm / (5.2 × 6.5 m) = 1.22″, as the slit of equal line width, 1.06″. ` + (arm === "blue" ? `The grating is not documented: the layout shows the beam meeting the grating at 19.2° (MEASURED), taken as symmetric at mid-band (INFERRED), which gives ${G.toFixed(0)} /mm at 4750 Å; the chip then reaches past both ends of the band, as drawn.` : `The grating is not documented, and the layout's red arm (incidence 24.8°) cannot reach the documented band with a 70–75 mm camera; the grating here (${G.toFixed(0)} /mm, symmetric) is solved so that the chip spans 5700–10100 Å.`) + ` R ≈ 1000 is the team's nominal figure (an input to the Via exposure-time calculator); the documents do not say how this R is defined; if, as for Viaspec's unmasked R = 9000, the full fiber diameter sets the width (INFERRED), the figure is 15% below the explorer's line FWHM. The drawn layout follows the Boombox Zemax layout of the Via technical document: the dichroic${arm === "blue" ? " reflects the blue light by 135°" : " passes the red light to a 90° fold mirror"}, the grating stands 343 mm from the collimator and the detector ${arm === "blue" ? 342 : 304} mm past the grating.`,
    state: { mode: "grating", D: 6.5, F: 5.2,
      g: { slitW: S3 * 0.2 / (5.2 * 6500) * 206264.806, nObj: 36, col: "lens", layLen: 343, camLen: arm === "blue" ? 267 : 229, foldOn: true, foldAng: arm === "blue" ? 225 : 270, foldPos: arm === "blue" ? 0.42 : 0.64, foldLabel: arm === "blue" ? "dichroic" : "", gFlip: true, W: 50, fcam: 75, gType: "trans", G, m: 1, lamB1: 5000, lamC: lc,
           psi: 35, tAlpha: al, Nx: 2048, Ny: 256, pix: 15 } },
    pub: [
      { what: "R ≈ 1000 (nominal)", q: "R", value: 1000, info: true, src: "Via technical document; Via Science Book. If the full fiber diameter sets the width, as for Viaspec's unmasked R = 9000 (INFERRED), 15% less than the explorer's" },
      { what: `band from ${l0} Å`, q: "lo", value: l0, info: true, src: "Via technical document; Via Science Book" + (arm === "red" ? " (the red grating is solved to this band)" : "") },
      { what: `band to ${l1} Å`, q: "hi", value: l1, info: true, src: (arm === "red" ? "Via Science Book (10100 Å; the technical document gives 10000 Å); the red grating is solved to this band" : "Via technical document; Via Science Book") },
    ],
  })),
  {
    id: "via", tel: "Via (MMT and Magellan 6.5 m)", name: "Via / Viaspec, 0.7″ mask",
    // Audited 2026-11-16 (data/audit/): the design of the Viaspec spectral-resolution tech memo (rev 3, 2024) and the
    // Viaspec vital-stats table: collimator 1375 mm, camera EFL 409.881 mm, grating at 33.57° with the camera tilted
    // 33.57° to the grating (camera axis at 5530 Å); the 120 µm slit mask of the Via Science Book (2026).
    note: "Viaspec (Via technical document; Via Science Book, 2026; Viaspec resolution tech memo, rev. 3): 6.5 m, fibers delivering f/5.3, 660 fibers into the spectrograph (540 positioned, 60 fixed fiducial/sky, 60 carrying argon lamp lines; the Science Book's table gives 600), 200 µm (1.2″) behind the 120 µm slit mask, on-axis Schmidt collimator 1375 mm (f/5.41 on the 254 mm beam; the explorer enters the mask at that ratio, 0.70″) with the slit standing in the returning beam; a plano fold mirror turns the beam 113° toward the grating, which stands at the pupil, 2750 mm (twice the focal length) from the collimator (the fold's angle and position MEASURED from the Zemax layout of the Via technical document); 2000 /mm binary transmission grating tilted 33.57°, with the camera tilted 33.57° to the grating, so the camera axis is at 5530 Å, camera 409.88 mm (f/1.61), 9216 × 9232 CCD290 of 10 µm (entered as 9216 × 9216). The memo's ±5.7° is the field along the slit. The detector stands 1068 mm past the grating (MEASURED from the same Zemax layout).",
    state: { mode: "grating", D: 6.5, F: 1375 / 254,
      g: { slitW: 0.120 / (1375 / 254 * 6500) * 206264.806, traceW: S3 * 0.2 / (1375 / 254 * 6500) * 206264.806, nObj: 660, col: "mirror", colTilt: 0, layLen: 2750, foldOn: true, foldAng: 112.9, foldPos: 0.78, gFlip: true, camLen: 658, W: 254, fcam: 409.881, gType: "trans", G: 2000, m: 1, lamB1: 5500, lamC: 5530, psi: 35, tAlpha: 33.57, Nx: 9216, Ny: 9216, pix: 10 } },
    pub: [
      { what: "R ≈ 15,000 (design)", q: "Rs", value: 15000, tol: 0.08, src: "Via technical document; the designer's table gives 15,116 at 0.70″ (the mask image with a Gaussian optical blur, no pixels)" },
      { what: "5.5 km/s per pixel", q: "dlpix", value: 5500 * 5.5 / 299792.458, tol: 0.05, src: "Via technical document" },
      { what: "coverage from 5050 Å", q: "lo", value: 5050, info: true, src: "Via technical document: the instrument's band, 505–595 nm; the tech memo spreads 5050–5950 Å over 88.85 mm of the 92.16 mm chip, so the chip's edges lie beyond the band; reference, not scored" },
      { what: "coverage to 5950 Å", q: "hi", value: 5950, info: true, src: "Via technical document: the instrument's band (see the line above); reference, not scored" },
    ],
  },
  // Round 7 (data/round7/*.md, 2026-11-17): FAST, the Hamilton echelle, the Palomar Double Spectrograph, the SDSS and
  // BOSS spectrographs, ELODIE and Slipher's spectrograph.
  // FAST (data/round7/fast.md): the beam is entered as 963 / 10.42 = 92.4 mm, which keeps the collimator and the plate
  // scale; lambda_c is the middle of each setup's published coverage (Mink et al. Table 1).
  ...[
    { k: "300", G: 300, lamB1: 4750, slit: 3.0, lamC: 5445, set: "300 l/mm, 3.0″", disp: 1.47, cov: [3475, 7415], res: 7.2 },
    { k: "600b", G: 600, lamB1: 4750, slit: 1.5, lamC: 4535, set: "600 l/mm blue, 1.5″", disp: 0.75, cov: [3540, 5530], res: 1.8 },
    { k: "600r", G: 600, lamB1: 4750, slit: 2.0, lamC: 6570, set: "600 l/mm red, 2.0″", disp: 0.75, cov: [5570, 7570], res: 2.3 },
    { k: "1200", G: 1200, lamB1: 5700, slit: 2.0, lamC: 6700, set: "1200 l/mm, 2.0″", disp: 0.38, cov: [6200, 7200], res: 1.1 },
  ].map(c => ({
    id: "fast" + c.k, tel: "Tillinghast 1.5 m", name: "Tillinghast 1.5 m / FAST, " + c.set, inst: "FAST", setting: c.set,
    note: "FAST on the 1.5 m Tillinghast reflector, the CfA spectrograph for redshift surveys and supernova spectra since 1994 (Fabricant et al. 1998; Mink et al. 2020, whose Table 1 gives the four standard setups): an off-axis parabolic collimator (963 mm, 8.5° off axis), a 93 mm beam, gratings of 300, 600 and 1200 /mm, a folded Schmidt camera (331 mm effective) and a 2688 × 512 CCD of 15 µm pixels (since 2006). The telescope's f/10.42 is derived from the 77 µm per arcsec plate scale. The 35° camera–collimator angle is the design value of Fabricant et al. Table 1; with that angle the model reproduces the published dispersions and the pupil anamorphism (1.06 and 1.33). The collimator's tilt (4.25°, half the off-axis angle) and its distance from the grating are inferred (data/round7/fast.md); the camera's corrector stands 225 mm past the grating.",
    state: { mode: "grating", D: 1.524, F: 10.42,
      g: { slitW: c.slit, nObj: 1, col: "mirror", colTilt: 4.25, layLen: 963, camLen: 225, cam: "mirror", W: 963 / 10.42, fcam: 331, gType: "refl", G: c.G, m: 1, lamB1: c.lamB1, lamC: c.lamC, psi: 35, tAlpha: null, Nx: 2688, Ny: 512, pix: 15 } },
    pub: [
      { what: c.disp + " Å/px", q: "dlpix", value: c.disp, tol: 0.03, src: "Fabricant et al. 1998 Table 7 (15 µm pixels; two decimals)" },
      { what: "0.57″/px along the slit", q: "pixScale", value: 0.57, tol: 0.02, src: "Mink et al. 2020 Sec. 2.1 (\"always 0.57 arcsec\")" },
      { what: `coverage ${c.cov[0]}–${c.cov[1]} Å`, q: "span", value: c.cov[1] - c.cov[0], info: true, src: "Mink et al. 2020 Table 1 (the dispersion × 2688 px: repeats the dispersion line)" },
      { what: `resolution ${c.res} Å`, q: "Rs", value: c.lamC / c.res, info: true, src: "Mink et al. 2020 Table 1: the slit width × 1.64 px per arcsec × the dispersion, a geometric width that repeats those lines" },
    ],
  })),
  // The Hamilton echelle (data/round7/hamilton.md): F = f_col / W = 7475.4 / 208.4; the echelle (31.5 /mm, delta 64.7,
  // theta 5.5) and the prism apex (43.4 deg, two prisms) are the values that reproduce the user's guide's table of orders; the band
  // (filt) is that table's, orders 163 to 57 (their free spectral ranges, DERIVED), since the CCD would otherwise show
  // orders past silicon's limit
  ...[
    { k: "", set: "2k CCD (1994–98)", Nx: 2048, Ny: 2048, pix: 15, era: "the CCD of 1994–1998, 2048 × 2048 pixels of 15 µm, on which the planet search measured R = 64,000" },
    { k: "4k", set: "4k CCD (2012–)", Nx: 4096, Ny: 4096, pix: 12, era: "the CCD in use from 2012, 4096 × 4096 pixels of 12 µm, which holds all 107 orders" },
  ].map(c => ({
    id: "hamilton" + c.k, tel: "Shane 3 m", name: "Shane 3 m / Hamilton, " + c.set, inst: "Hamilton", setting: c.set,
    note: "The Hamilton echelle at the coudé focus of the Lick Shane 3 m (Vogt 1987; Lick user's guide), the spectrograph of the Lick iodine-cell planet search (Marcy & Butler 1992; Butler et al. 1996), here with " + c.era + ". An off-axis parabolic collimator (7475.4 mm) turns the beam 11°; a 208.4 mm beam, an R2 echelle (204 × 408 mm), two UBK7 prisms in series and a folded Schmidt camera (508.3 mm, f/1.67). The model uses 31.5 /mm and a 43.4° prism apex, which reproduce the user's guide's table of orders (the echelle is listed at 31.6 /mm and the prisms at 44.8°); Schott N-BK7 stands in for the discontinued UBK7 (indices within 6e-5). The collimator-to-echelle (5.4 m) and echelle-to-camera (2.5 m) distances are measured from Vogt's Fig. 1. The published dispersion needs the beam to meet the echelle at 70°, where a 208 mm beam would overfill the 408 mm echelle; the sources do not resolve this (data/round7/hamilton.md).",
    state: { mode: "echelle", D: 3.05, F: 7475.4 / 208.4,
      e: { slitW: 1.2, nObj: 1, col: "mirror", cam: "mirror", colTilt: 5.5, layLen: 5400, camLen: 2500, W: 208.4, fcam: 508.3, eG: 31.5, eDelta: 64.7, gamma: 0, theta: 5.5, xd: "prism", xGlass: "N-BK7", xA: 43.4, xPasses: 2, lamC: 5500, Nx: c.Nx, Ny: c.Ny, pix: c.pix,
           filt: [3495, 10113], gLen: 408 } },
    pub: [
      ...(c.k === "" ? [{ what: "R = 64,000 (median of Th-Ar lines, 1.2″)", q: "R", value: 64000, tol: 0.1, src: "Fischer et al. 2014 Sec. 3.2 (measured; no wavelength given)" },
        { what: "≈2.0 px per FWHM at 1.2″", q: "npix", value: 2.0, info: true, src: "Lick user's guide, Quick Reference (\"~ 2.0 pixels\"; not stated as measured)" }] : []),
      { what: "R ≈ 60,000 at 6000 Å (1.2″)", q: "RAt", lam: 6000, value: 60000, info: true, src: "Lick user's guide, Quick Reference (not stated as measured)" },
      ...[[163, 3505.4, 1.96], [100, 5713.8, 3.20], [88, 6492.9, 3.63], [57, 10024.1, 5.61]].map(([m, l, d]) => ({ what: `${d} Å/mm in order ${m} (blaze ${l.toLocaleString("en-US")} Å)`, q: "dlpixAt", lam: l, m, value: d * c.pix / 1000, tol: 0.03, src: "Lick user's guide, Table of Orders" })),
      { what: "orders 163 to 57 span 28.5 mm across the dispersion", q: "ySpan", m1: 57, m2: 163, value: 28.51, tol: 0.03, src: "Lick user's guide, Table of Orders (the sum of the order separations; Vogt 1987 Table I gives 28.86 mm)" },
      { what: "smallest order separation ≈6″", q: "minSepArcsec", m1: 57, m2: 163, value: 6.0, tol: 0.12, src: "Goodrich & Veilleux 1988 Sec. I (\"6-11 arc seconds\" between orders)" },
    ],
  })),
  // The Palomar Double Spectrograph (data/round7/dbsp.md): F = 15.83 keeps the 91-inch collimator with the 146 mm beam
  // and both published pixel scales
  ...[
    { k: "b", set: "blue, 600/4000", G: 600, lamB1: 4000, lamC: 4400, psi: 38.5, fcam: 228.6, cam: "mirror", camLen: null, ps: 0.389, dl: [4000, 72, "72 Å/mm (Palomar specifications; the overview gives 71)"] },
    { k: "r", set: "red, 316/7500", G: 316, lamB1: 7500, lamC: 7500, psi: 35.0, fcam: 304.8, cam: "lens", camLen: 340, ps: 0.293, dl: [7500, 102, "102 Å/mm (Palomar specifications and overview)"] },
  ].map(c => ({
    id: "dbsp" + c.k, tel: "Hale 5.1 m", name: "Hale 5.1 m / Double Spectrograph " + c.set + ", D55, 1″", inst: "Double Spectrograph", setting: c.set,
    note: "The Double Spectrograph at the Cassegrain focus of the Hale 5 m (Oke & Gunn 1982; Palomar DBSP pages): a dichroic behind the slit, here the D55, divides the light between two separate spectrographs, each with a coaxial folded-Cassegrain collimator (2311 mm, 146 mm beam) that the light enters through a hole in its primary. Blue: the 600/4000 grating and the folded Schmidt camera (9 inches, f/1.5). Red: the 316/7500 grating and a lens camera (12 inches, since 1995). The telescope's f/15.83 keeps the collimator and both published pixel scales; the grating pair and the D55 are a common published choice (data/round7/dbsp.md), and λc 4400 Å in the blue is a choice. The collimator is drawn as one mirror on the axis; its secondary and the hole in the primary are not drawn.",
    state: { mode: "grating", D: 5.08, F: 15.83,
      g: { slitW: 1, nObj: 1, col: "mirror", colTilt: 0, cam: c.cam, layLen: 880, camLen: c.camLen, W: 146, fcam: c.fcam, gType: "refl", G: c.G, m: 1, lamB1: c.lamB1, lamC: c.lamC, psi: c.psi, tAlpha: null, Nx: 4096, Ny: 2048, pix: 15 } },
    pub: [
      { what: c.ps + "″/px along the slit", q: "pixScale", value: c.ps, tol: 0.01, src: "Palomar DBSP technical specifications (Kirby & Rahmer 2011 Table 1: the same)" },
      { what: c.dl[1] + " Å/mm at the blaze", q: "dlpixAt", lam: c.dl[0], m: 1, value: c.dl[1] * 0.015, tol: 0.03, src: c.dl[2] },
    ],
  })),
  // The SDSS and BOSS spectrographs (data/round7/boss.md): the fibers enter at the collimator's f/3.95 (631.95 mm over
  // the 160 mm beam), the explorer's virtual convention (as APOGEE); the grisms as single prisms (BOSS's 3.5 deg VPH
  // tilt and unequal prisms are not modeled); the dichroic belongs to the All-arms view (arms.js)
  ...[
    { k: "bossb", inst: "BOSS", arm: "blue", core: 0.120, ap: 2.0, n: 500, G: 520, gA: 14.0, glass: "BSL7Y", kind: "vph", camLen: 180, Nx: 4096, pix: 15, fg: [20, 98.75, 237.0] },
    { k: "bossr", inst: "BOSS", arm: "red", core: 0.120, ap: 2.0, n: 500, G: 400, gA: 17.8, glass: "N-BK7", kind: "vph", camLen: 190, Nx: 4096, pix: 15, fg: [20, 98.75, 237.0] },
    { k: "sdssb", inst: "SDSS-I/II", arm: "blue", core: 0.180, ap: 3.0, n: 320, G: 640, gA: 37.0, glass: "N-BK7", kind: "ruled", camLen: 177, Nx: 2048, pix: 24, fg: [20, 148.1, 198.6], lam0: 4960 },
    { k: "sdssr", inst: "SDSS-I/II", arm: "red", core: 0.180, ap: 3.0, n: 320, G: 440, gA: 39.5, glass: "N-BK7", kind: "ruled", camLen: 184, Nx: 2048, pix: 24, fg: [20, 148.1, 198.6], lam0: 7400 },
  ].map(c => ({
    id: c.k, tel: "SDSS 2.5 m", name: "SDSS / " + c.inst + " " + c.arm + " arm", inst: c.inst, setting: c.arm + " arm",
    note: (c.inst === "BOSS" ? "The BOSS spectrographs on the Sloan 2.5 m, since 2009 (Smee et al. 2013): two identical spectrographs of 500 fibers each, 120 µm cores (2″ on the sky at f/5), VPH grisms (blue 520 /mm, red 400 /mm) and 4k × 4k CCDs of 15 µm pixels."
      : "The original SDSS spectrographs, 1999–2008 (Smee et al. 2013): two spectrographs of 320 fibers each, 180 µm cores (3″ on the sky at f/5), replicas of ruled gratings on right-angle BK7 prisms (blue 640 /mm, red 440 /mm) and 2048 × 2048 CCDs of 24 µm pixels.")
      + " A one-dimensional Schmidt collimator (631.95 mm, 160 mm beam) stands on the axis, the slit plate in the returning beam; a dichroic at " + (c.inst === "BOSS" ? "6050" : "6000") + " Å sends the blue light to one camera and the red to the other; the cameras are 240 mm f/1.5 lenses. The fiber enters at the collimator's f/3.95 as the slit of equal line width. The grating to camera distance is derived from the camera prescription (data/round7/boss.md).",
    state: { mode: "grating", D: 2.5, F: 3.95,
      g: { slitW: S3 * c.core / (3.95 * 2500) * 206264.806, nObj: c.n, col: "mirror", colTilt: 0, layLen: 1263.9, cam: "lens", camLen: c.camLen, W: 160, fcam: 240, gType: "grism", G: c.G, m: 1, lamB1: 5000, lamC: c.lam0 || (c.arm === "blue" ? 4947 : 8059), psi: 35, tAlpha: null,
           gA: c.gA, gGlass: c.glass, gKind: c.kind, gTilt: 0, Nx: c.Nx, Ny: c.Nx, pix: c.pix, fgroups: c.fg, telF: 5, fibAp: c.ap } },
    pub: [
      ...(c.k === "sdssr" ? [{ what: "zero deviation at 7400 Å", q: "lam0", value: 7400, tol: 0.005, src: "Smee et al. 2013 Sec. 2.3.5" }] : []),
      ...(c.k === "sdssb" ? [{ what: "zero deviation at 4960 Å", q: "lam0", value: 4960, info: true, src: "Smee et al. 2013 Sec. 2.3.5. The model's N-BK7 grism gives 4909 Å (1% short); the index of the replica's resin layer is not published" }] : []),
      { what: "fiber image " + (c.inst === "BOSS" ? "45 µm = 3.0 px" : "67.5 µm = 2.8 px"), q: "diam", value: c.inst === "BOSS" ? 3.0 : 67.5 / 24, info: true, src: "Smee et al. 2013 (the design's spot-diagram circle, not a measured image)" },
      ...(c.k === "bossb" ? [[3700, 1560], [6000, 2270]] : c.k === "bossr" ? [[6000, 1850], [9000, 2650]] : []).map(([l, r]) => ({ what: `R = ${r.toLocaleString("en-US")} at ${l.toLocaleString("en-US")} Å`, q: "RAt", lam: l, value: r, info: true, src: "SDSS-IV BOSS spectrograph page. The model is 11–13% lower: its R uses the geometric width of the round fiber image, where the published values come from Gaussian fits to arc lines (Smee et al. 2013 Sec. 4.1)" })),
    ],
  })),
  // ELODIE (data/round7/elodie.md): the 300 um entrance image at the f/15 collimator entered as the slit of equal line
  // width (the virtual convention); the echelle's 31.78 /mm at gamma 0 is EFFECTIVE (the paper prints "31"); the
  // camera's 300 mm is the equivalent focal length for the main dispersion; the white pupil (75 mm from 102 mm, so a
  // transfer collimator of 1530 x 75 / 102 = 1125 mm, DERIVED) only in the 3D drawing; the grism's "crown" as N-BK7
  {
    id: "elodie", tel: "OHP 1.93 m", name: "OHP 1.93 m / ELODIE",
    note: "ELODIE on the 1.93 m telescope of the Observatoire de Haute-Provence, 1993–2006, the spectrograph of the discovery of 51 Peg b (Baranne et al. 1996; Mayor & Queloz 1995): two fibers (star and sky or thorium) behind 2″ holes at the f/15 Cassegrain focus, an R4 echelle (408 × 102 mm) in a 102 mm beam from an off-axis collimator, a white pupil of 75 mm, a cross-disperser made of an F2 prism (40°) and a crown grism (150 /mm, 8.63°), and a 1024 × 1024 CCD of 24 µm pixels; R = 42,000 over 3906–6811 Å in 67 orders. The echelle's groove density, 31.78 /mm, is fitted to the order numbers of Baranne et al. Fig. 3 (the paper prints \"31\"); the grism's crown glass is modeled by N-BK7; the camera's 300 mm is the equivalent focal length the paper gives for the main dispersion (the cross-dispersion has 225 mm in a footnote, which does not reproduce Fig. 3). With these the model spaces the orders 14% wider than Fig. 3 at the red end and 11% narrower at the blue end (data/round7/elodie.md).",
    state: { mode: "echelle", D: 1.93, F: 15,
      e: { lay3d: "wp", wpT: 1530 * 75 / 102, xdLabel: "prism + grism", slitW: S3 * 0.300 / (15 * 1930) * 206264.806, nObj: 2, col: "mirror", layLen: 1530, W: 102, fcam: 300, cam: "lens",
           eG: 31.78, eDelta: 75.964, gamma: 0, theta: 0, eTilt: 0, xd: "prism", xGlass: "F2", xA: 40, xPasses: 1, xPrisms: [{ glass: "F2", A: 40 }],
           xGrism: { G: 150, A: 8.63, glass: "N-BK7" }, lamC: 4964, Nx: 1024, Ny: 1024, pix: 24 } },
    pub: [
      { what: "R ≈ 42,000 (thorium lines, 7.0–7.4 km/s FWHM)", q: "R", value: 42000, info: true, src: "Baranne et al. 1996 Sec. 4 (measured, pixel included; the model's R has no pixel term)" },
      { what: "geometric R ≈ 38,800 at 4964 Å (the 60 µm image's full width)", q: "Rdiam", value: 38800, tol: 0.08, src: "Baranne et al. 1996 Sec. 2.4 (\"about 40000\" from the 60 µm image of the hole; 38,800 from 60 µm × 2.133 Å/mm, DERIVED)" },
      { what: "2.1–2.25 px per FWHM", q: "npix", value: 2.2, tol: 0.1, src: "Baranne et al. 1996 Sec. 4 (measured)" },
      ...[[4964, 123, 0.0512], [6939, 88, 0.0715], [3915, 156, 0.0401]].map(([l, m, v]) => ({ what: `${v} Å/px at ${l} Å (order ${m})`, q: "dlpixAt", lam: l, m, value: v, info: true, src: "Baranne et al. 1996 Fig. 3 (DERIVED from the printed positions). A miss: the model is 3.2–3.6% low at all three. The paper gives the blaze both as tan θ = 4 (76.0°, used here) and as 75° (Fig. 1), which give 3.4% low and 3.7% high; an equivalent camera of 290 mm instead of 300 would also match" })),
      { what: "orders 123–124 14.2 px apart", q: "minSepPx", m1: 123, m2: 124, value: 14.2, tol: 0.05, src: "Baranne et al. 1996 Fig. 3 (0.341 mm, DERIVED)" },
      { what: "orders 88 to 157 span 24.95 mm", q: "ySpan", m1: 88, m2: 157, value: 24.95, tol: 0.03, src: "Baranne et al. 1996 Fig. 3 (DERIVED)" },
      { what: "orders 88–89 17.0 px apart", q: "minSepPx", m1: 88, m2: 89, value: 17.0, info: true, src: "Baranne et al. 1996 Fig. 3 (0.407 mm, DERIVED). A miss, 14% wide: with N-BK7 for the unnamed crown, the model spaces the red orders wider and the blue orders closer than Fig. 3" },
      { what: "orders 156–157 16.8 px apart", q: "minSepPx", m1: 156, m2: 157, value: 16.8, info: true, src: "Baranne et al. 1996 Fig. 3 (0.404 mm, DERIVED). A miss, 10% close (see the line above)" },
      { what: "coverage from 3906 Å", q: "lo", value: 3906, info: true, src: "Baranne et al. 1996 Fig. 2 caption (OHP: 3895 Å). A miss of 1.2%, from the order spacing: the format sits about one order bluer on the chip" },
      { what: "coverage to 6811 Å", q: "hi", value: 6811, info: true, src: "Baranne et al. 1996 Fig. 2 caption (OHP: 6815 Å). A miss of 1.5% (see the line above)" },
      { what: "orders 156 to 90 (67)", q: "nOrders", value: 67, info: true, src: "Baranne et al. 1996 Fig. 2 caption. The model holds 68 orders, 158 to 91 (see the coverage lines)" },
    ],
  },
  // V. M. Slipher's spectrograph on the Lowell 24-inch Clark refractor (round 7, data/round7/slipher.md): a prism
  // spectrograph (gType "prism").  The objective: 61 cm, 983 cm focal length (Slipher 1904, p. 2), F = 983 / 61; the
  // Brashear collimator lens 489.1 mm (1904, p. 2), entered as the beam 489.1 / F = 30.35 mm (the lens's aperture is
  // 30.5 mm).  The detector is a photographic plate, entered with 20 µm "pixels" near the plates' resolving limit
  // (EFFECTIVE; the stellar plates resolve 0.25 Å at 11.4 Å/mm, 0.022 mm).  The nebular plates are the part Slipher
  // measured, F to H (6.7 x 1.9 mm, INFERRED in the record), the red edge set at F; the two-prism plate is longer by the
  // ratio of the model's dispersions at 4415 Å (2.09, DERIVED).  The prism glasses are modern stand-ins (INFERRED).
  ...[
    { k: "1", setting: "1 prism, nebulae", A: 64, n: 1, glass: "N-SF15", lamC: 4303.2, Nx: 335, Ny: 95, fcam: 82.55, slit: 0.06 * 489.1 / 82.55,
      note: "Slipher's spectrograph on the Lowell 24-inch refractor, as used for the first velocities of spiral nebulae (Slipher 1913, 1915, 1917; the instrument: Slipher 1904). Sourced: the 61 cm f/16.1 objective, the Brashear collimator lens (489.1 mm), one 64° prism of \"very dense\" glass, a Voigtländer camera lens of about f/2.5, and about 140 Å/mm in the violet with an equivalent slit width of 0.06 mm. Inferred (data/round7/slipher.md): the camera focal length, 82.55 mm, read from \"3¼-inch\"; the slit, 7.46″, from the 0.06 mm slit image; and the glass, modeled by Schott N-SF15, whose data sheet tabulates indices only to 4047 Å, so the spectrum stops there although Slipher measured to H (3968 Å). The detector is the measured part of the plate, F to H; the 20 µm pixels stand for the plate's grain. M31's four plates gave −300 km/s, a shift of 0.031 mm on the plate at Hγ, after exposures of 6 h 50 min to three nights.",
      pub: [
        { what: "≈140 Å/mm in the violet (2.8 Å per 20 µm)", q: "dlpixAt", lam: 4415, m: 1, value: 2.8, info: true, src: "Slipher 1917 (Proc. Am. Phil. Soc. 56), p. 405: \"about 140 A per mm\" in the violet; no wavelength given, and the dispersion runs from 97 Å/mm at 4102 Å to 218 Å/mm at F in the model. A reference line at 4415 Å, the middle of F to H" },
        { what: "R ≈ 520 at Hγ (0.06 mm × 140 Å/mm = 8.4 Å)", q: "RAt", lam: 4340, value: 517, info: true, src: "data/round7/slipher.md (DERIVED from the equivalent slit width and the dispersion, the numbers that set the slit: circular)" },
      ] },
    { k: "2", setting: "2 prisms, nebulae", A: 64.5, n: 2, glass: "N-SF15", lamC: 4262.6, Nx: 700, Ny: 95, fcam: 82.55, slit: 0.06 * 489.1 / 82.55,
      note: "Slipher's nebular spectrograph with two 64.5° prisms, as on the 35-hour plate of NGC 1068 in November 1917 (Slipher 1917, Lowell Obs. Bull. 3, 59); two prisms served for two of the 25 nebulae of the 1917 list. The rest as the one-prism setting: the camera focal length, the slit and the glass (Schott N-SF15) are inferred (data/round7/slipher.md). The plate is drawn F to H, longer than the one-prism plate by the ratio of the dispersions.",
      pub: [
        { what: "≈70 Å/mm (half the one-prism dispersion)", q: "dlpixAt", lam: 4415, m: 1, value: 1.4, info: true, src: "data/round7/slipher.md (DERIVED, rough: 140 Å/mm halved for two prisms; no published value)" },
      ] },
    { k: "3", setting: "3 prisms, stars", A: 62 + 52 / 60, n: 3, glass: "SF2", lamC: 4340, Nx: 3810, Ny: 2540, fcam: 471.4, slit: 0.02,
      note: "The Lowell spectrograph as Brashear delivered it for stellar velocities (Slipher 1904, 1905): three prisms of Jena O 102 dense silicate flint, 62°52′, at minimum deviation, the 489.1 mm collimator lens, the long camera (471.4 mm) and a 0.02 mm slit (0.42″). The glass is modeled by Schott SF2, which matches Slipher's measured indices of the three prisms after a constant offset (data/round7/slipher.md, INFERRED). The plate is the 2 × 3-inch holder's; the 20 µm pixels stand for the plate's resolving limit, 0.25 Å at Hγ on the most rapid plates.",
      pub: [
        { what: "11.4 Å/mm at Hγ (long camera)", q: "dlpixAt", lam: 4340, m: 1, value: 11.4 * 0.02, tol: 0.05, src: "Slipher 1904 (ApJ 20, 1), p. 15, measured on the plates" },
        { what: "total deviation ≈176°", q: "devDeg", value: 176, tol: 0.02, src: "Slipher 1904 (ApJ 20, 1): the three prisms turn the beam back beside the collimator (data/round7/slipher.md)" },
      ] },
  ].map(c => ({
    id: "slipher" + c.k, tel: "Lowell 0.61 m", name: "Lowell 24-inch / Slipher's spectrograph, " + c.setting, inst: "Slipher's spectrograph", setting: c.setting,
    note: c.note,
    state: { mode: "grating", D: 0.61, F: 983 / 61,
      g: { slitW: c.slit / 9830 * 206264.806, nObj: 1, col: "lens", cam: "lens", W: 489.1 / (983 / 61), fcam: c.fcam, gType: "prism", gGlass: c.glass, pA: c.A, pN: c.n, lamC: c.lamC, Nx: c.Nx, Ny: c.Ny, pix: 20 } },
    pub: c.pub,
  })),
  // Round 8 (data/round8/*.md, 2026-11-17): the Tull coude, UHRF, LAMOST, WEAVE and MOONS.
  // The Tull coude (data/round8/tull.md): F = f_col / W = 6140 / 190; the white pupil (the pupil mirror's f = 3316 mm)
  // only in the 3D drawing; the 3D view's collimator is one mirror (the Cassegrain's secondary is not drawn)
  ...[
    { k: "23e2", set: "TS23 E2, 1.2″", slit: 1.2, fcam: 775, eG: 52.6759, eD: 65.293, lamC: 4718.6, pub: [
      { what: "R = 60,000 (slit #4, the design's 2 pixels)", q: "R", value: 60000, tol: 0.06, src: "MacQueen 2025 orientation, Sec. 1.10 (geometric, not measured)" },
      { what: "R × slit = 70,734″ (58,945 at 1.20″)", q: "Rs", value: 70734 / 1.2, tol: 0.03, src: "Tull's grating tables (1995), header \"R.phi = 70734 arcsec\"" },
      ...[[4718.62, 73, 0.03744], [5938.95, 58, 0.04713], [8611.48, 40, 0.06834]].map(([l, m, v]) => ({ what: `${v} Å/px in order ${m}`, q: "dlpixAt", lam: l, m, value: v, tol: 0.02, src: "MacQueen 2025 orientation, p. 9 dispersion table (Å/mm × 0.024 mm)" })),
      { what: "66 orders, 98 to 33", q: "nOrders", value: 66, tol: 0.05, src: "MacQueen 2025 orientation, Sec. 1.6" },
      { what: "0.56″/px along the dispersion", q: "specScale", value: 0.56, tol: 0.03, src: "TS2 user manual, p. 1 (23.388″/mm × 0.024 mm, Tull's tables)" },
      { what: "0.4465″/px along the slit", q: "pixScale", value: 0.4465, tol: 0.03, src: "Tull's grating tables: 18.605″/mm vertical × 0.024 mm (DERIVED)" },
      { what: "smallest order separation 23.1 px (orders 45–46)", q: "minSepPx", m1: 33, m2: 98, value: 23.1, tol: 0.06, src: "MacQueen 2025 orientation, p. 9 (10.32″ step, DERIVED in px)" },
      { what: "echelle incidence 68.29°", q: "alphaDeg", value: 68.29, tol: 0.01, src: "MacQueen 2025 orientation, p. 9 (\"aE 68.29 deg computed\")" },
      { what: "prism train deviation 58.188°", q: "devDeg", value: 58.188, tol: 0.01, src: "Tull's grating tables, header \"TOTAL DEVIATION = 58.188 Degrees\"" },
    ] },
    { k: "21e2", set: "TS21 E2, 0.6″", slit: 0.59, fcam: 3316, eG: 52.6759, eD: 65.293, lamC: 4718.6, pub: [
      { what: "R = 120,000 from a laser line, 1.57 px FWHM", q: "R", value: 120000, info: true, src: "Tull et al. 1995 Sec. 5.1 (measured with the TI CCD of 15.24 µm pixels and a narrow slit: another detector and slit, so not scored)" },
    ] },
    { k: "21e1", set: "TS21 E1, 0.3″", slit: 0.34, fcam: 3316, eG: 79.0139, eD: 63.9, lamC: 4718.6, pub: [
      { what: "R = 175,000 (Th-Ar, 145 µm slit)", q: "R", value: 175000, info: true, src: "Rb in the ISM (arXiv:0910.2288) Sec. 2: measured; the geometric value is 194,000" },
    ] },
  ].map(c => ({
    id: "tull" + c.k, tel: "McDonald 2.7 m", name: "McDonald 2.7 m / Tull coudé, " + c.set, inst: "Tull coudé", setting: c.set,
    note: "The Tull cross-dispersed echelle at the coudé focus of the McDonald 2.7 m Harlan J. Smith telescope (Tull et al. 1995; the McDonald TS2 manual and Tull's grating tables), here " + c.set + ". A Cassegrain collimator (6140 mm, 190 mm beam) with the slit in its primary's housing, an echelle (E2: 52.68 /mm, 65.3°; E1: 79.01 /mm, 63.9°) worked 3° from Littrow in the page, two 30° fused-silica prisms passed twice, a white pupil (pupil mirror 3316 mm), and the folded Schmidt camera of 775 mm at the F3 focus (TS23) or the 3316 mm F1 focus (TS21); the TK3 CCD, 2048 × 2048 pixels of 24 µm. The element spacings are measured from the paper's unscaled sketch (data/round8/tull.md); the 190 mm beam overfills the 408 mm echelle, which vignettes 7%.",
    state: { mode: "echelle", D: 2.718, F: 6140 / 190,
      e: { lay3d: "wp", wpT: 3316, layLen: 10700, colTilt: 0, slitW: c.slit, nObj: 1, col: "mirror", W: 190, fcam: c.fcam, cam: "mirror", eG: c.eG, eDelta: c.eD, gamma: 0, theta: 3.0,
           xd: "prism", xGlass: "silica", xA: 30, xPasses: 4, lamC: c.lamC, Nx: 2048, Ny: 2048, pix: 24, gLen: 408 } },
    pub: c.pub,
  })),
  // UHRF (data/round8/uhrf.md): one lens in double pass is collimator and first camera element; the collimator (9212 mm),
  // the beam (245.6 mm) and the camera are EFFECTIVE, from the published slit projection and dispersion; the cross-
  // disperser is entered as an EFFECTIVE 471 /mm (the 1200 /mm grating in a beam compressed 0.39x); the band (filt) is
  // order 97's free spectral range, the single order the chip records
  ...[
    { k: "1m", set: "R 940k", fcam: 10339, pub: [
      { what: "R = 940,000 (1.0M, measured)", q: "R", value: 940000, tol: 0.1, src: "UCL coudé echelle manual (Stathakis et al. 2000), Sec. 1.1; laser tests gave 990,000 (Diego et al. 1995) and the E2V 845,000 (2006)" },
      { what: "0.030″/px along the slit", q: "pixScale", value: 0.030, tol: 0.05, src: "UCL coudé echelle manual, Sec. 1.4 (Tek, unbinned)" },
      { what: "0.13858 Å/mm in order 97", q: "dlpixAt", lam: 5909.27, m: 97, value: 0.13858 * 0.024, info: true, src: "UCL coudé echelle manual, Appendix A3 (Diego's theoretical format; the camera is fitted to this line: circular)" },
      { what: "orders 97–98 29.65 mm apart", q: "ySpan", m1: 97, m2: 98, value: 29.65, info: true, src: "UCL coudé echelle manual, Appendix A3 (the cross-disperser is fitted to this line: circular)" },
    ] },
    { k: "06", set: "R 600k", fcam: 6203, pub: [
      { what: "R ≈ 750,000 (0.6M, preliminary laser test)", q: "R", value: 750000, info: true, src: "Diego et al. 1995 / UCL manual: nominal 6 × 10⁵, measured 7.5 × 10⁵ in a preliminary test. The focal reducer shrinks the slit image and the dispersion alike, so the model's R (no pixel term) does not change; the measured R falls as the image approaches the pixel" },
    ] },
    { k: "03", set: "R 300k", fcam: 3102, pub: [
      { what: "R ≈ 319,000 (0.3M with the slicer)", q: "R", value: 319286, info: true, src: "AAO UHRF cookbook, instrumental tests of 1998 (MITLL2 CCD, another detector). Pixel-limited: the slit image is under a pixel, which the model's R (no pixel term) does not include" },
    ] },
  ].map(c => ({
    id: "uhrf" + c.k, tel: "AAT 3.9 m", name: "AAT 3.9 m / UHRF, " + c.set, inst: "UHRF", setting: c.set,
    note: "The Ultra-High-Resolution Facility at the coudé focus of the 3.9 m Anglo-Australian Telescope, 1992–2010s, the highest resolving power of any optical astronomical spectrograph, built for cool interstellar clouds (Diego et al. 1995; the UCL coudé echelle manual): a confocal image slicer of 35 slices of 30 µm (entered as the 0.042″ slit), an R2 echelle of 31.6 /mm worked 1° from Littrow, a single fused-silica lens in double pass as collimator and first camera element, a cross-disperser grating after the echelle, and the Tektronix CCD of 1024 × 1024 pixels of 24 µm (1994–2000). The modes 1.0M, 0.6M and 0.3M differ by focal reducers before the detector. The collimator, the beam and the camera are effective values fitted to the published slit projection and dispersion; the cross-disperser is an effective 471 /mm (data/round8/uhrf.md). The chip records 2–15 Å of a 60 Å order: the band is set to order 97 at Na D.",
    state: { mode: "echelle", D: 3.893, F: 37.5,
      e: { slitW: 0.0424, nObj: 1, col: "lens", dpass: true, cam: "lens", layLen: 250, W: 245.6, fcam: c.fcam, eG: 31.6, eDelta: 64.95, gamma: 0, theta: 1.0, eTilt: 0,
           xd: "grating", xG: 471, xPsi: 13, lamC: 5890, filt: [5878.8, 5939.7], Nx: 1024, Ny: 1024, pix: 24, gLen: 408 } },
    pub: c.pub,
  })),
  // LAMOST (data/round8/lamost.md): the fibers enter at the f/4 collimator (the virtual convention), the 2/3 slit mask as
  // the slit of equal line width; D = 4 m nominal (the effective aperture runs 3.6-4.9 m with pointing)
  ...[
    { k: "b", set: "blue", G: 813, tA: 8.17, lamC: 4804, layLen: 1780, disp: 0.57, rl: 4750 },
    { k: "r", set: "red", G: 548, tA: 8.63, lamC: 7405, layLen: 1750, disp: 0.84, rl: 7350 },
  ].map(c => ({
    id: "lamost" + c.k, tel: "LAMOST 4 m", name: "LAMOST / LRS " + c.set + " arm", inst: "LAMOST LRS", setting: c.set,
    note: "The LAMOST low-resolution spectrographs (Cui et al. 2012; Huang et al. 2020; Xiong et al. 2011), 16 of them behind the 4 m reflecting Schmidt telescope (f/5), with 250 fibers of 320 µm (3.3″) each and the largest stellar survey by number of spectra (12.6 million low-resolution spectra in DR12): an on-axis Schmidt collimator (800 mm, 200 mm beam; the slit on the axis in Cui et al. Fig. 30(b)), a dichroic, VPH gratings (blue 813 /mm, red 548 /mm, as measured), f/1.3 Schmidt cameras and 4136 × 4096 CCDs of 12 µm. The camera's 250 mm is derived from the published dispersions; the element spacings are measured from Cui et al. Fig. 30(b). The survey's 2/3 slit mask is entered as the slit (R ≈ 1800 in the data headers; Cui et al. give 1500).",
    state: { mode: "grating", D: 4.0, F: 4.0,
      g: { slitW: S3 * (2 / 3) * 0.320 / (4 * 4000) * 206264.806, nObj: 250, col: "mirror", colTilt: 0, layLen: c.layLen, W: 200, cam: "mirror", camLen: 185, fcam: 250, gType: "trans", G: c.G, m: 1, lamB1: c.lamC, lamC: c.lamC,
           psi: 35, tAlpha: c.tA, Nx: 4136, Ny: 4096, pix: 12, telF: 5, fibAp: 3.3 } },
    pub: [
      { what: c.disp + " Å/px", q: "dlpix", value: c.disp, tol: 0.03, src: "LAMOST CCD camera page; Huang et al. 2020 Sec. 3" },
      { what: "R ≈ 1800 at " + c.rl + " Å (2/3 slit)", q: "RAt", lam: c.rl, value: 1800, tol: 0.08, src: "LAMOST DR12 low-resolution data description (SLIT_MOD)" },
      { what: "R = 1500 (2/3 slit)", q: "RAt", lam: c.rl, value: 1500, info: true, src: "Cui et al. 2012 Table 4: a conflict with the data headers' 1800" },
    ],
  })),
  // WEAVE (data/round8/weave.md): the fibers enter at the f/3.1 collimator (the virtual convention); the VPH angles from
  // Bianco et al. 2018 Table 1 (the camera at alpha + beta); the camera's 342 mm is its f/1.8 on the 190 mm beam
  ...[
    { k: "lrb", mode: "LR", set: "blue", G: 1385.2, a: 22.72, lamC: 4900, disp: 0.30, r: 5000 },
    { k: "lrr", mode: "LR", set: "red", G: 875.9, a: 19.82, lamC: 7750, disp: 0.48, r: 5000 },
    { k: "hrg", mode: "HR", set: "green", G: 3056.9, a: 54.46, lamC: 5130, disp: 0.09, r: 20000, miss: 0.047 },
    { k: "hrr", mode: "HR", set: "red", G: 2430.7, a: 51.59, lamC: 6450, disp: 0.11, r: 20000 },
    { k: "hrb", mode: "HR", set: "blue", G: 3579.6, a: 54.43, lamC: 4380, disp: 0.076, r: 20000, miss: 0.058 },
  ].map(c => ({
    id: "weave" + c.k, tel: "WHT 4.2 m", name: "WHT / WEAVE " + c.mode + " " + c.set, inst: "WEAVE (" + c.mode + ")", setting: c.set,
    note: "WEAVE at the prime focus of the 4.2 m William Herschel Telescope (Jin et al. 2024; ING instrument pages; Bianco et al. 2018 for the gratings): about 960 fibers of 85 µm (1.3″) at the f/2.8 corrected focus, delivering f/3.1 to an off-axis catadioptric collimator (190 mm beam), a dichroic at 5900 Å, VPH gratings in each arm (LR: R ≈ 5000; HR: R ≈ 20,000, the camera swung to the larger angle), f/1.8 lens cameras and 6k × 6k CCD mosaics (8192 × 6144 pixels of 15 µm used). The large IFU has taken science data since 2023; the multi-object mode was in science verification in 2026. The camera's 342 mm is its f/1.8 on the beam; the element spacings are measured from the ING layout (data/round8/weave.md).",
    state: { mode: "grating", D: 4.2, F: 3.1,
      g: { slitW: S3 * 0.085 / (3.1 * 4200) * 206264.806, nObj: 960, col: "mirror", colTilt: 6.9, layLen: 1350, W: 190, cam: "lens", fcam: 342, gType: "trans", G: c.G, m: 1, lamB1: c.lamC, lamC: c.lamC,
           psi: 35, tAlpha: c.a, Nx: 8192, Ny: 6144, pix: 15, telF: 2.8, fibAp: 1.3 } },
    pub: [
      c.miss ? { what: c.disp + " Å/px", q: "dlpix", value: c.disp, info: true, src: "ING WEAVE instrumental overview. A miss: the model is " + Math.round(c.miss * 100) + "% high with Bianco et al.'s angles; ING calls the gratings Littrow, which would match: the sources conflict (data/round8/weave.md)" }
        : { what: c.disp + " Å/px", q: "dlpix", value: c.disp, tol: 0.03, src: "ING WEAVE instrumental overview" },
      { what: "R ≈ " + c.r.toLocaleString("en-US") + " (nominal)", q: "Rdiam", value: c.r, info: true, src: "Jin et al. 2024; ING (nominal, not measured; the model's R here from the full width of the round fiber image)" },
    ],
  })),
  // MOONS (data/round8/moons.md), not yet in science operation (first light 2026; commissioning): design values. The
  // fibers (158 um, f/3.5 out) enter at the collimator (the virtual convention); the gratings are EFFECTIVE equivalent VPH
  // gratings fitted to the design R and dispersion (the line densities and prisms are not published), except HR H
  // (1056 /mm at 53 deg, a secondary source); the trace groups' gap is INFERRED
  ...[
    { k: "ri", mode: "LR", set: "RI", G: 768, a: 22.0, lamC: 8010, camLen: 370, r: 4500 },
    { k: "yj", mode: "LR", set: "YJ", G: 540, a: 13.2, lamC: 11420, camLen: 340, r: 4300 },
    { k: "h", mode: "LR", set: "H", G: 576, a: 21.4, lamC: 16260, camLen: 420, r: 6800 },
    { k: "hri", mode: "HR", set: "RI", G: 1396, a: 30.3, lamC: 8310, camLen: 370, r: 9100 },
    { k: "hyj", mode: "HR", set: "YJ", G: 540, a: 13.2, lamC: 11420, camLen: 340, r: 4300 },
    { k: "hh", mode: "HR", set: "H", G: 1056, a: 53.0, lamC: 15815, camLen: 420, r: 18800 },
  ].map(c => ({
    id: "moons" + c.k, tel: "VLT 8.2 m", name: "VLT / MOONS " + c.mode + " " + c.set + " (design)", inst: "MOONS " + c.mode + " (design)", setting: c.set,
    note: "MOONS for a VLT Nasmyth focus (Cirasuolo et al. 2020; Oliva et al. 2014, 2016; Black et al. 2022; Guinouard et al. 2020): about 1000 fibers of 158 µm (1.2″) feeding two cryogenic spectrographs of 512 fibers each, an on-axis spherical collimator (265 mm beam), two dichroics splitting RI, YJ and H, catadioptric f/0.95 cameras and 4k × 4k detectors (a CCD in RI, H4RG-15 arrays in YJ and H). First light came in 2026; the instrument is in commissioning, so these are design values. " + (c.k === "hh" ? "The H grating, 1056 /mm at 53°, comes from a secondary source; " : "The grating is an effective equivalent VPH grating, fitted to the design R and dispersion (the line densities, angles and prisms are not published); ") + "the trace groups' gap is inferred (data/round8/moons.md).",
    state: { mode: "grating", D: 8.0, F: 3.5,
      g: { slitW: S3 * 0.158 / (3.5 * 8000) * 206264.806, nObj: 512, col: "mirror", colTilt: 0, layLen: 1930, W: 265, cam: "mirror", camLen: c.camLen, fcam: 251.75, gType: "trans", G: c.G, m: 1, lamB1: c.lamC, lamC: c.lamC,
           psi: 35, tAlpha: c.a, Nx: 4096, Ny: 4096, pix: 15, fgroups: [16, 108, 108], telF: 15, fibAp: 1.2 } },
    pub: [
      { what: "R = " + c.r.toLocaleString("en-US") + " (design)", q: "R", value: c.r, info: true, src: "Oliva et al. 2016 Table 1 (design; the grating was fitted to it: circular)" },
      ...(c.set === "YJ" ? [{ what: "measured R ≈ 4000; images 2.5–2.7 px FWHM", q: "npix", value: 2.6, info: true, src: "Black et al. 2022 (Fig. 11 caption; laboratory tests): the model's geometric fiber image is wider than the measured core of the line" }] : []),
    ],
  })),
];
root.IX_PRESETS = PRESETS;
if (typeof module !== "undefined" && module.exports) module.exports = PRESETS;
})(typeof window !== "undefined" ? window : globalThis);
