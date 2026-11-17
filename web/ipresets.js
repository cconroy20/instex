/* Imager presets and reference constants for the Imager mode (window.IX_IPRESETS, IX_BANDS, IX_MOON_DIAM_ARCMIN,
   IX_MOFFAT_BETA).  Sources, with page references and verbatim quotes: data/imaging/*.md (constants: constants.md).
   Bands: the SVO Filter Profile Service pivot wavelength of each filter (one definition for all; Bessell & Murphy 2012
   recommend the pivot), used only for the diffraction width lambda / D.  Moon: the NSSDC Moon fact sheet's mean apparent
   diameter, 1896 arcsec.  Moffat beta: Trujillo et al. 2001, Sec. 2.4, the value for Kolmogorov turbulence. */
window.IX_BANDS = [
  { k: "U", lam: 0.3585, note: "U (Johnson-Cousins): pivot wavelength 0.3585 µm, FWHM 0.065 µm (0.328–0.393 µm); SVO Generic/Bessell.U." },
  { k: "B", lam: 0.4371, note: "B (Johnson-Cousins): pivot wavelength 0.4371 µm, FWHM 0.095 µm (0.389–0.483 µm); SVO Generic/Bessell.B." },
  { k: "V", lam: 0.5478, note: "V (Johnson-Cousins): pivot wavelength 0.5478 µm, FWHM 0.085 µm (0.501–0.587 µm); SVO Generic/Bessell.V." },
  { k: "R", lam: 0.6498, note: "R (Johnson-Cousins): pivot wavelength 0.6498 µm, FWHM 0.157 µm (0.565–0.722 µm); SVO Generic/Bessell.R." },
  { k: "I", lam: 0.802, note: "I (Johnson-Cousins): pivot wavelength 0.8020 µm, FWHM 0.154 µm (0.728–0.883 µm); SVO Generic/Bessell.I." },
  { k: "u", lam: 0.3557, note: "u (SDSS): pivot wavelength 0.3557 µm, FWHM 0.057 µm (0.330–0.386 µm); SVO SLOAN/SDSS.u." },
  { k: "g", lam: 0.4703, note: "g (SDSS): pivot wavelength 0.4703 µm, FWHM 0.118 µm (0.416–0.533 µm); SVO SLOAN/SDSS.g." },
  { k: "r", lam: 0.6176, note: "r (SDSS): pivot wavelength 0.6176 µm, FWHM 0.113 µm (0.562–0.675 µm); SVO SLOAN/SDSS.r." },
  { k: "i", lam: 0.749, note: "i (SDSS): pivot wavelength 0.7490 µm, FWHM 0.125 µm (0.692–0.817 µm); SVO SLOAN/SDSS.i." },
  { k: "z", lam: 0.8947, note: "z (SDSS): pivot wavelength 0.8947 µm, FWHM 0.100 µm (0.829–0.929 µm); SVO SLOAN/SDSS.z." },
  { k: "y", lam: 0.9628, note: "y (Pan-STARRS1): pivot wavelength 0.9628 µm, FWHM 0.067 µm (0.920–0.986 µm); SVO PAN-STARRS/PS1.y." },
  { k: "J", lam: 1.2393, note: "J (2MASS): pivot wavelength 1.2393 µm, FWHM 0.183 µm (1.164–1.347 µm); SVO 2MASS/2MASS.J." },
  { k: "H", lam: 1.6495, note: "H (2MASS): pivot wavelength 1.6495 µm, FWHM 0.258 µm (1.522–1.780 µm); SVO 2MASS/2MASS.H." },
  { k: "Ks", lam: 2.1639, note: "Ks (2MASS): pivot wavelength 2.1639 µm, FWHM 0.277 µm (2.026–2.303 µm); SVO 2MASS/2MASS.Ks." },
  { k: "L′", lam: 3.7572, note: "L′ (MKO-NIR): pivot wavelength 3.7572 µm, FWHM 0.700 µm (3.423–4.123 µm); SVO MKO/NSFCam.Lp." },
  { k: "M′", lam: 4.683, note: "M′ (MKO-NIR): pivot wavelength 4.6830 µm, FWHM 0.242 µm (4.564–4.805 µm); SVO MKO/NSFCam.Mp." },
];
window.IX_MOON_DIAM_ARCMIN = 1896 / 60;
window.IX_MOFFAT_BETA = 4.765;
/* Each preset: id, tel (the menu group: telescope and aperture), name ("Telescope / Instrument"; the menu drops the
   part before the slash), note (where the numbers come from, and what the model leaves out), state (the explorer's
   inputs; the seeing and the drawing options stay the reader's), and pub: the published values validate_img.js checks,
   { what, q, value, tol, src } with q one of pixScale (arcsec/px at the center), fieldX / fieldY (arcmin across the
   field: the full extent of the chips inside the field), area (deg^2 of the field, gaps excluded), npix (pixels in the field),
   etendue (m^2 deg^2), plateScale (arcsec/mm), collArea (m^2, the collecting area), secR (mm, the secondary mirror's
   radius of curvature).  info: true marks a line printed but not scored (circular: the state was derived from the same number;
   or a different quantity from the model's).  Mosaic layouts are centered rows (top to bottom); gapsX / gapsY give
   the gap after each column / row where they differ, shiftY a shift up the chip by column, extra chips placed by hand. */
const LSST_GX = [], LSST_GY = [];
for (let i = 0; i < 14; i++) { LSST_GX.push(i % 3 === 2 ? 1.66 : 1.29); LSST_GY.push(i % 3 === 2 ? 2.48 : 2.21); }
window.IX_IPRESETS = [
  // ---------------------------------------------------------------- ground, direct (data/imaging/widefield.md, megacam_ztf_small.md)
  { id: "lsst", tel: "Rubin 8.4 m", name: "Rubin / LSSTCam",
    note: "Rubin Observatory (Simonyi Survey Telescope) with LSSTCam: a three-mirror Paul-Baker telescope (the tertiary shares the primary's glass and sends the light back up to the camera in the secondary's shadow) and a three-lens corrector, the filter in the converging beam. 189 science CCDs in 21 rafts of 3 × 3; the e2v format (4096 × 4004) stands for both chip types (ITL 4072 × 4000) and the gaps are the nominal pipeline geometry (within a raft and between rafts). Central obstruction: the primary's inner clear edge (the tertiary shares the glass). The field circle takes in the whole focal plane: the published 3.5° field and its 9.6 deg² describe a circle, which cuts the corner CCDs; the CCDs' active area is 9.55 deg² (DERIVED). The Paul-Baker drawing is schematic (the focal plane drawn 5.23 m above the primary's vertex, really 4.43 m). Sources in data/imaging/widefield.md.",
    state: { D: 8.36, eps: 0.612, F: 1.233, tel: "pb", F1: 1.19, field: 250, optics: "direct", band: "r", psf: "seeing",
             Nx: 4096, Ny: 4004, pix: 10, rows: [9, 9, 9, 15, 15, 15, 15, 15, 15, 15, 15, 15, 9, 9, 9], gapX: 1.29, gapY: 2.21, gapsX: LSST_GX, gapsY: LSST_GY },
    pub: [
      { what: "pixel scale 0.2″/px", q: "pixScale", value: 0.2, tol: 0.01, src: "Ivezić+19; F = 1.233 from the Rubin key numbers" },
      { what: "3.09 Gpix (117 × 4096 × 4004 + 72 × 4072 × 4000)", q: "npix", value: 3091580928, tol: 0.006, src: "pipeline formats (widefield.md); the model uses one format for both chip types and so counts 8.1 Mpix (0.26%) more" },
      { what: "field 9.6 deg²", q: "area", value: 9.6, tol: 0.01, src: "Rubin key numbers (the 3.5° circle's area, π × 1.75² = 9.62 deg²); the model counts the CCDs' active area, 9.55 deg² (DERIVED), within 1% of the circle's" },
      { what: "étendue 319 m² deg²", q: "etendue", value: 319, info: true, src: "Ivezić+19; the published figure includes the camera's vignetting (LSST Science Book 2009 Sec. 2.3; mean effective aperture 6.49 m), which the model leaves out" },
    ] },
  { id: "hsc", tel: "Subaru 8.2 m", name: "Subaru / Hyper Suprime-Cam",
    note: "Subaru prime focus with the seven-element Wide Field Corrector (with an atmospheric dispersion corrector), drawn as one lens of its power that takes the primary's f/1.83 to f/2.25. 104 science CCDs: 100 in centered rows with their long axis up the rows, and 4 turned by 90° beside the top and bottom rows; the gap between the two halves of the mosaic is narrower (in rows 3–6 the three outermost columns on one side belong to the other half and sit 3.4 mm higher, not drawn). The central obstruction is not published in the sources obtained, so ε is set to 0 here (the collecting area and étendue are upper limits). The field circle takes in the whole mosaic: the corrected field is 1.5° across (unvignetted to 10′ in the text of Aihara et al. 2018, to 0.15° in their table; 26% vignetting at the 0.75° edge), and the outer CCDs reach past the 1.5° circle (the vignetting is not modeled). Sources in data/imaging/widefield.md.",
    state: { D: 8.2, eps: 0, F: 2.25, tel: "prime", F1: 1.83, corrector: { d: 1.0, label: "HSC wide-field corrector", sub: "drawn as one lens of its power" }, field: 120, optics: "direct", band: "r", psf: "seeing",
             Nx: 2048, Ny: 4176, pix: 15, rows: [7, 13, 15, 15, 15, 15, 13, 7], gapX: 1.12, gapY: 4.51, gapsY: [4.51, 4.51, 4.51, 1.13, 4.51, 4.51, 4.51],
             extra: [{ x: -143.32, y: 217.375, rot: true }, { x: 143.32, y: 217.375, rot: true }, { x: -143.32, y: -217.375, rot: true }, { x: 143.32, y: -217.375, rot: true }] },
    pub: [
      { what: "pixel scale 0.168″/px", q: "pixScale", value: 0.168, info: true, src: "pipeline 11.2″/mm; circular: F = 2.25 was derived from it (published F/2.2)" },
      { what: "field 1.5° across (1.77 deg²)", q: "area", value: 1.77, info: true, src: "the corrected field's area; the model counts the 104 CCDs, which reach past it" },
      { what: "870 Mpix (104 × 2048 × 4096, as the CCDs are sold)", q: "npix", value: 872415232, info: true, src: "Subaru pages; the active format is 2048 × 4176" },
    ] },
  { id: "decam", tel: "Blanco 4 m", name: "Blanco / DECam",
    note: "Blanco prime focus with the five-element DECam corrector (the filter between the third and fourth lenses), drawn as one lens of their power that takes the primary's f/2.7 to f/2.98. 62 science CCDs, long axis along the rows; the field center falls in the gap between the two middle rows. Two CCDs are dead or partial (N30, and S30 in 2014–2016; NOIRLab counts 60.5 useful), which the model counts. ε (0.42) is the prime-focus cage baffle of the pre-DECam telescope table and sets the diffraction pattern; the collecting area, 9.31 m², is that of the DECam-era pupil the Telescopes mode draws (the cage's shadow, the filter-changer housing and four fins; DERIVED). Sources in data/imaging/widefield.md.",
    state: { D: 3.934, eps: 0.42, collArea: 9.31, F: 2.98, tel: "prime", F1: 2.7, corrector: { d: 1.237, label: "DECam corrector", sub: "five fused-silica lenses, drawn as one lens of their power" }, field: 132, optics: "direct", band: "r", psf: "seeing",
             Nx: 4096, Ny: 2048, pix: 15, rows: [3, 4, 5, 6, 6, 7, 7, 6, 6, 5, 4, 3], gapX: 2.3, gapY: 3.0 },
    pub: [
      { what: "pixel scale 0.2637″/px", q: "pixScale", value: 0.2637, info: true, src: "pipeline 17.575″/mm; circular: F = 2.98 was derived from it (published f/3.0)" },
      { what: "field 3 deg²", q: "area", value: 3, info: true, src: "NOIRLab DECam pages (\"3 square degree (2.2 degree field of view)\", one significant figure); the model counts the active pixels (2.79 deg²), and the 2.2° circle is 3.80 deg² (DERIVED), so neither reproduces the rounded 3" },
      { what: "520 Mpix of science CCDs", q: "npix", value: 520093696, tol: 0.001, src: "62 × 2048 × 4096" },
    ] },
  { id: "megacam", tel: "CFHT 3.6 m", name: "CFHT / MegaCam",
    note: "CFHT prime focus with the four-lens MegaPrime corrector. 40 CCDs in four rows (9, 11, 11, 9: the four 'ears' at the ends of the two middle rows, in science use since 2015); the gap between the middle rows is narrow, the others wide. ε reproduces CFHT's published collecting area. F comes from CFHT's 0.187″/px at the field center (CFHT's detector page and the FITS headers give 0.185″/px, which would make F 4.20). The corrector is drawn as one lens of its power that takes the primary's f/3.77 to f/4.16, at a schematic distance (not published). No corrected-field diameter is published, so the 90′ circle is a choice that takes in all 40 CCDs; before 2015 only the central 36 were read out, and the old filters vignette the four ears. Sources in data/imaging/megacam_ztf_small.md.",
    state: { D: 3.58, eps: 0.451, F: 4.16, tel: "prime", F1: 3.77, corrector: { d: 1.0, label: "MegaPrime corrector", sub: "four lenses, drawn as one lens; distance schematic" }, field: 90, optics: "direct", band: "r", psf: "seeing",
             Nx: 2048, Ny: 4612, pix: 13.5, rows: [9, 11, 11, 9], gapX: 0.945, gapY: 5.74, gapsY: [5.74, 0.945, 5.74] },
    pub: [
      { what: "pixel scale 0.187″/px", q: "pixScale", value: 0.187, info: true, src: "CFHT; circular: F was derived from it" },
      { what: "378 Mpix (40 × 2048 × 4612)", q: "npix", value: 377815040, tol: 0.001, src: "CFHT MegaPrime pages" },
      { what: "field 0.96° × 0.94° (36 CCDs, no ears)", q: "fieldY", value: 0.94 * 60, info: true, src: "CFHT; the published layout gives 0.987 × 1.006° for 36 CCDs" },
    ] },
  { id: "ztf", tel: "Palomar 48-inch Schmidt", name: "Palomar 48-inch / ZTF",
    note: "The Oschin Schmidt: the corrector plate is the aperture stop (1.24 m), the spherical mirror (1.83 m) is larger, and the camera sits at the focus inside the tube. 16 CCDs of 6144 × 6160; the gaps (7.49 and 10.96 mm) reproduce the published on-sky gaps, while the camera papers' 386 × 395 mm mosaic implies 5.79 and 8.47 mm, which would make the field 1.4–1.6% smaller. The four guide and focus CCDs outside the science rows are not drawn. ε is the area-equivalent of the published on-axis obscuration (cryostat and spiders, 22.4%). No corrected-field diameter is published (the corners are vignetted up to 30%), so the field circle is set wide. Sources in data/imaging/megacam_ztf_small.md.",
    state: { D: 1.2446, eps: 0.473, F: 2.46, tel: "schmidt", field: 720, optics: "direct", band: "r", psf: "seeing",
             Nx: 6144, Ny: 6160, pix: 15, rows: [4, 4, 4, 4], gapX: 7.49, gapY: 10.96 },
    pub: [
      { what: "pixel scale 1.01″/px", q: "pixScale", value: 1.01, tol: 0.01, src: "Bellm+19; F and D from Dekany+20" },
      { what: "light-sensitive area 47.7 deg²", q: "area", value: 47.7, tol: 0.01, src: "Bellm+19" },
      { what: "field 7.32° across (E-W)", q: "fieldX", value: 7.32 * 60, info: true, src: "Bellm+19; the gaps were derived from the same paper's on-sky gaps" },
      { what: "605.6 Mpix", q: "npix", value: 605552640, tol: 0.001, src: "16 × 6144 × 6160" },
    ] },
  { id: "small80", tel: "80 mm refractor", name: "80 mm refractor / CMOS camera",
    note: "A typical amateur setup: an 81 mm f/5.9 apochromatic triplet with a 1.0× field flattener, and a cooled astronomy camera on the Sony IMX571 sensor (6248 × 4176 pixels of 3.76 µm). Field circle: the flattened image circle (44 mm). The makers publish no pixel scale or field; the checks are arithmetic. Sources in data/imaging/megacam_ztf_small.md.",
    state: { D: 0.081, eps: 0, F: 5.9, tel: "refr", field: 316, optics: "direct", band: "r", psf: "seeing",
             Nx: 6248, Ny: 4176, pix: 3.76, rows: [1] },
    pub: [
      { what: "1.62″/px (206265 p / f)", q: "pixScale", value: 1.6225, info: true, src: "arithmetic from the makers' numbers" },
      { what: "26.1 Mpix", q: "npix", value: 26091648, tol: 1e-6, src: "IMX571 format" },
    ] },
  // ---------------------------------------------------------------- space (data/imaging/hst.md, space_wide.md)
  { id: "acs", tel: "Hubble 2.4 m", name: "HST / ACS/WFC",
    note: "Hubble's Advanced Camera for Surveys, Wide Field Channel, modeled as direct: the channel's corrector mirrors image the pupil onto a mirror (no published pupil size), and the filters sit in the converging beam. F = 26 is Tiny Tim's f/26 (Clampin 2002 and Sirianni et al. 2005 give f/25), which reproduces the handbook's chip-center scales. The Telescope panel's focal ratio, focal length and plate scale therefore include the channel's optics: Hubble alone is f/24 with 3.58″/mm. Two 4096 × 2048 CCDs, " + "the telescope drawn from the OTA prescription (primary f/2.30, focus 1.50 m behind the vertex)" + ". Sources in data/imaging/hst.md.",
    state: { D: 2.4, eps: 0.33, F: 26.0, tel: "cass", F1: 2.30, back: 0.625, field: 10, optics: "direct", band: "I", psf: "diff",
             Nx: 4096, Ny: 2048, pix: 15, rows: [1, 1], gapX: 0.75, gapY: 0.75 },
    pub: [
      { what: "pixel scale 0.0495″/px (the four chip-center values)", q: "pixScale", value: 0.0495, tol: 0.01, src: "ACS handbook Sec. 10.4.1 (0.0493 and 0.0486 at WFC1's center, 0.0498 and 0.0503 at WFC2's, in x and y; the mean); F from Tiny Tim's f/26" },
      { what: "pixel scale 0.05″/px (nominal)", q: "pixScale", value: 0.05, info: true, src: "ACS handbook Table 3.1 (\"~0.05\")" },
      { what: "field 202″", q: "fieldX", value: 202 / 60, info: true, src: "ACS handbook (the pixels are rhombic; the model's are square)" },
      { what: "16.8 Mpix", q: "npix", value: 16777216, tol: 1e-6, src: "2 × 4096 × 2048" },
    ] },
  { id: "uvis", tel: "Hubble 2.4 m", name: "HST / WFC3/UVIS", inst: "WFC3", setting: "UVIS",
    note: "Wide Field Camera 3, UVIS channel, modeled as direct. F = 32.5 is the design focal length (78.0 m) over D; the design review also gives f/31 without reconciling the two (that f/31 describes the beam at the tilted, 21° focal surface is INFERRED). The Telescope panel's focal ratio, focal length and plate scale include the channel's optics: Hubble alone is f/24 with 3.58″/mm. Two 4096 × 2051 CCDs, " + "the telescope drawn from the OTA prescription (primary f/2.30, focus 1.50 m behind the vertex)" + ". Sources in data/imaging/hst.md.",
    state: { D: 2.4, eps: 0.33, F: 32.5, tel: "cass", F1: 2.30, back: 0.625, field: 10, optics: "direct", band: "V", psf: "diff",
             Nx: 4096, Ny: 2051, pix: 15, rows: [1, 1], gapX: 0.465, gapY: 0.465 },
    pub: [
      { what: "pixel scale 0.0395″/px", q: "pixScale", value: 0.0395, tol: 0.01, src: "WFC3 handbook; F from the design review's 78,000 mm" },
      { what: "16.8 Mpix", q: "npix", value: 16801792, tol: 1e-6, src: "2 × 4096 × 2051" },
    ] },
  { id: "wfc3ir", tel: "Hubble 2.4 m", name: "HST / WFC3/IR", inst: "WFC3", setting: "IR",
    note: "Wide Field Camera 3, IR channel, the one Hubble channel with a published pupil: the OTA's pupil is reimaged at 7.13 mm radius onto a cold mask, which is the stop. The mask passes 0.9755 of that radius and blocks 0.354 of it at the center (Hook & Stoehr 2008; an on-orbit fit gives 0.370, Biretta 2014), so D = 2.341 m and ε = 0.363 (DERIVED); F = 24.60 and W = 13.91 mm keep Hubble's f/24 beam and the 342 mm collimator. F_cam = 12.39 gives the design focal length (29.0 m). The published f/11 gives 0.141″/px: the detector's 24° tilt about one axis explains ≈ 6% of the 10% between that scale and the geometric-mean scale, and the rest is unexplained. The relay (two mirrors and a corrector plate) is drawn as an ideal collimator and camera; no source places the filter at the pupil. The active 1014 × 1014 pixels of a 1024 × 1024 array. Sources in data/imaging/hst.md.",
    state: { D: 2.341, eps: 0.363, F: 24.60, tel: "cass", F1: 2.358, back: 0.6408, field: 10, optics: "reimaged", W: 13.91, Fc: 12.39, band: "H", psf: "diff",
             Nx: 1014, Ny: 1014, pix: 18, rows: [1] },
    pub: [
      { what: "pixel scale 0.128″/px (geometric mean of 0.135 × 0.121)", q: "pixScale", value: 0.1278, tol: 0.01, src: "WFC3 handbook; F_cam from the design review's 29,000 mm" },
      { what: "1.03 Mpix", q: "npix", value: 1028196, tol: 1e-6, src: "1014 × 1014" },
    ] },
  { id: "euclid", tel: "Euclid 1.2 m", name: "Euclid / VIS",
    note: "Euclid's visible imager: the detectors sit at the focus of a Korsch three-mirror telescope with no powered optics between (a dichroic near the exit pupil and a fold mirror shape the 550–920 nm band; drawn in i); F from the focal length Cropper et al. 2025 give (24.87 m). 36 CCDs of 4096 × 4132 in a 6 × 6 grid, the wide gaps between rows. ε is an estimate from the published pupil model (no ratio is published). The primary's focal ratio is not published: F1 = 1.626 puts the drawn secondary at the published 1756 mm from the primary (DERIVED). The field lies 0.47° off the telescope's axis (Racca et al. 2016), drawn on the axis. Sources in data/imaging/space_wide.md.",
    state: { D: 1.2, eps: 0.33, F: 20.73, tel: "korsch", F1: 1.626, field: 70, optics: "direct", band: "i", psf: "diff",
             Nx: 4096, Ny: 4132, pix: 12, rows: [6, 6, 6, 6, 6, 6], gapX: 1.56, gapY: 7.82 },
    pub: [
      { what: "pixel scale 0.100″/px", q: "pixScale", value: 0.1, info: true, src: "circular: F was derived from the published plate scale" },
      { what: "0.466 deg² of active silicon", q: "area", value: 0.466, info: true, src: "DERIVED: 36 × 46.6 arcmin² (Cropper et al. 2025 Table 2); circular: the per-CCD area uses the same 120.57 µm/″ that set F" },
      { what: "field 0.775° × 0.697° (with gaps)", q: "fieldY", value: 0.775 * 60, info: true, src: "Cropper et al. 2025 Table 2 (336.6 mm at 120.57 µm/″); circular: the row gap was derived from the same 336.6 mm" },
      { what: "609 Mpix", q: "npix", value: 609288192, tol: 1e-6, src: "36 × 4096 × 4132" },
    ] },
  { id: "roman", tel: "Roman 2.4 m", name: "Roman / WFI",
    note: "The Roman Wide Field Instrument: 18 H4RG-10 detectors (4088 × 4088 active) at the focus of a three-mirror telescope (drawn as a Korsch), the filters at the exit pupil in the converging beam. The detectors lie in an arc: each column shifted up to the pre-flight position (gaps from the 2022 pre-flight model). D is the current 2.36 m aperture stop; ε is a 2015 design value, and the 2015 design's f/7.9 went with a 2.4 m aperture, so F = 7.946 is set to give the nominal 0.11″/px on the 2.36 m stop (the 2022 pre-flight model gives 0.1093 × 0.1064″/px). The focal plane is off the telescope's axis, drawn on it; the Korsch drawing's secondary (f −342 mm) differs from the Phase-B design's (−650 mm). Drawn in H (1.65 µm); the WFI's F158 filter is centered at 1.577 µm. Sources in data/imaging/space_wide.md.",
    state: { D: 2.36, eps: 0.30, F: 7.946, tel: "korsch", F1: 1.2, field: 90, optics: "direct", band: "H", psf: "diff",
             Nx: 4088, Ny: 4088, pix: 10, rows: [6, 6, 6], gapX: 3.43, gapY: 3.0, gapsY: [7.68, 2.98], shiftY: [30.19, 8.81, 0, 0, 8.81, 30.19] },
    pub: [
      { what: "pixel scale 0.11″/px", q: "pixScale", value: 0.11, info: true, src: "Roman WFI pages (nominal); circular: F was set from it" },
      { what: "0.281 deg² active", q: "area", value: 0.281, info: true, src: "Roman WFI pages: 18 × (4088 × 0.11″)², the same scale (DERIVED)" },
      { what: "300.8 Mpix", q: "npix", value: 300811392, tol: 1e-6, src: "18 × 4088 × 4088" },
    ] },
  { id: "nircamsw", tel: "JWST 6.6 m", name: "JWST / NIRCam short wavelength", inst: "NIRCam", setting: "short wavelength",
    note: "JWST is a three-mirror anastigmat (drawn as a Korsch, the tertiary and the fine-steering mirror placed schematically); NIRCam reimages the telescope focus: a collimator, a dichroic that splits the two channels, a 31 mm pupil where each channel has separate pupil and filter wheels, and a camera (here the short-wavelength channel, f/18). Two modules of 2 × 2 detectors side by side, on a field off the telescope's axis (drawn on the axis). D is the entrance pupil (the primary is 18 hexagonal segments; the model's pupil is a circular annulus, so the diffraction pattern is approximate) and ε is an estimate from the empty central segment. The annulus's area (32.8 m²) overstates the published collecting area, 25.4 m², which the page uses. Sources in data/imaging/space_wide.md.",
    state: { D: 6.6, eps: 0.2, collArea: 25.4, F: 19.91, tel: "korsch", F1: 1.2, field: 10, optics: "reimaged", W: 31.14, Fc: 18.0, band: "Ks", psf: "diff",
             Nx: 2040, Ny: 2040, pix: 18, rows: [4, 4], gapX: 2.59, gapY: 2.59, gapsX: [2.59, 24.77, 2.59] },
    pub: [
      { what: "pixel scale 0.03105″/px in flight", q: "pixScale", value: 0.03105, tol: 0.012, src: "the in-flight SIAF (pysiaf PRDOPSSOC-075): the geometric mean of XSciScale and YSciScale, averaged over the eight detectors (DERIVED); W and f/18 from Huff 2005" },
      { what: "pixel scale 0.031″/px", q: "pixScale", value: 0.031, info: true, src: "JDox (updated 2017, before launch)" },
      { what: "collecting area 25.4 m²", q: "collArea", value: 25.4, info: true, src: "JDox JWST telescope page (\"unobscured collecting area of the primary mirror\"); entered as the preset's area" },
      { what: "field 2 × 2.2′ × 2.2′ = 9.7 arcmin²", q: "area", value: 9.7 / 3600, info: true, src: "JDox; counts each module whole (gaps included)" },
      { what: "33.3 Mpix", q: "npix", value: 33292800, tol: 1e-6, src: "8 × 2040 × 2040" },
    ] },
  { id: "nircamlw", tel: "JWST 6.6 m", name: "JWST / NIRCam long wavelength", inst: "NIRCam", setting: "long wavelength",
    note: "NIRCam's long-wavelength channel shares the collimator with the short-wavelength channel; a dichroic splits the beam before the pupil, and this channel has separate pupil and filter wheels and a camera at f/9: one detector per module. The pupil is drawn as a circular annulus (the real one is hexagonal); the collecting area is the published 25.4 m². Sources in data/imaging/space_wide.md.",
    state: { D: 6.6, eps: 0.2, collArea: 25.4, F: 19.91, tel: "korsch", F1: 1.2, field: 10, optics: "reimaged", W: 31.14, Fc: 9.0, band: "M′", psf: "diff",
             Nx: 2040, Ny: 2040, pix: 18, rows: [2], gapX: 13.39 },
    pub: [
      { what: "pixel scale 0.06295″/px in flight", q: "pixScale", value: 0.06295, tol: 0.012, src: "the in-flight SIAF (pysiaf PRDOPSSOC-075): NRCA5 and NRCB5, the geometric mean of XSciScale and YSciScale (DERIVED)" },
      { what: "pixel scale 0.063″/px", q: "pixScale", value: 0.063, info: true, src: "JDox (updated 2017, before launch)" },
      { what: "8.3 Mpix", q: "npix", value: 8323200, tol: 1e-6, src: "2 × 2040 × 2040" },
    ] },
  // ---------------------------------------------------------------- ground, reimaged (data/imaging/reimagers.md)
  { id: "fors2sr", tel: "VLT 8.2 m", name: "VLT / FORS2 imaging, standard resolution", inst: "FORS2 imaging", setting: "SR collimator",
    note: "FORS2 is a focal reducer: collimator 1233 mm (standard resolution), camera 280 mm, broadband filters in the collimated beam. Two 4096 × 2048 CCDs covering 8.6′; the field (6.8′ square) is set by the multi-object slit unit at the telescope focus, drawn as a square stop on the axis (the mosaic really sits 33″ off the axis). The ideal optics give a 91.9 mm pupil and f/3.05, where ESO quotes 90 mm and f/3.13. Sources in data/imaging/reimagers.md.",
    state: { D: 8.115, eps: 0.1375, F: 13.4106, tel: "cass", F1: 1.8, field: 15, stopW: 6.8, stopH: 6.8, optics: "reimaged", W: 91.94, Fc: 3.0454, band: "R", psf: "seeing",
             Nx: 4096, Ny: 2048, pix: 15, rows: [1, 1], gapX: 0.48, gapY: 0.48 },
    pub: [
      { what: "pixel scale 0.1259″/px (measured)", q: "pixScale", value: 0.12591, tol: 0.01, src: "FORS2 manual" },
      { what: "field 6.8′ (square stop)", q: "fieldX", value: 6.8, info: true, src: "FORS2 manual; circular: the stop is entered as 6.8′ square" },
    ] },
  { id: "fors2hr", tel: "VLT 8.2 m", name: "VLT / FORS2 imaging, high resolution", inst: "FORS2 imaging", setting: "HR collimator",
    note: "FORS2 with the high-resolution collimator (616 mm): twice the image scale of the standard collimator with the same camera. The 4.25′ field is set by the CCDs, by a field-stop mask that the slit arms form (size not published) and by the camera lenses, which vignette the corners. Sources in data/imaging/reimagers.md.",
    state: { D: 8.115, eps: 0.1375, F: 13.4106, tel: "cass", F1: 1.8, field: 15, optics: "reimaged", W: 45.93, Fc: 6.0958, band: "R", psf: "seeing",
             Nx: 4096, Ny: 2048, pix: 15, rows: [1, 1], gapX: 0.48, gapY: 0.48 },
    pub: [
      { what: "pixel scale 0.0632″/px (measured on UT4, before 2004)", q: "pixScale", value: 0.06323, tol: 0.015, src: "FORS2 manual Table 4.2 (FORS2 on Yepun, HR, Pal 3; FORS2 has been on Antu, UT1, since 2004, where the SR scale is 0.1% smaller and no HR value is given)" },
      { what: "field 4.25′", q: "fieldX", value: 4.25, tol: 0.015, src: "FORS2 manual" },
    ] },
  { id: "imacsf2", tel: "Magellan 6.5 m", name: "Magellan / IMACS f/2 imaging",
    note: "IMACS with the f/2 camera: collimator 1648 mm, beam 150 mm, camera 356 mm; the Mosaic3 camera (2 rows of 4 CCDs) since 2017. A circular field stop of ≈30′ (the camera baffles) cuts the mosaic's corners. The broadband filters sit just in front of the CCDs (only narrow-band filters at the pupil). IMACS sits on the Baade telescope's west Nasmyth platform: an f/11 Gregorian secondary, then a flat tertiary that turns the beam to the side, and IMACS's own ADC corrector (not drawn; the 71.5 m focal length is the 1998 design without the corrector); ε is the twin telescope's (Clay) at f/11, set by the secondary's baffle. Sources in data/imaging/reimagers.md.",
    state: { D: 6.5, eps: 0.29, F: 11, tel: "greg", nasmyth: true, F1: 1.25, field: 30, optics: "reimaged", W: 149.86, Fc: 2.3729, filterAt: "detector", band: "r", psf: "seeing",
             Nx: 2048, Ny: 4096, pix: 15, rows: [4, 4], gapX: 1.37, gapY: 1.08 },
    pub: [
      { what: "pixel scale 0.200″/px", q: "pixScale", value: 0.2, tol: 0.01, src: "LCO IMACS pages" },
      { what: "field 656 arcmin² on the CCD pixels", q: "area", value: 656 / 3600, tol: 0.02, src: "LCO IMACS pages (\"670 sq arcmin, 656 of which are covered by CCD pixels\"): the pixels inside the 30′ circle, the model's quantity" },
    ] },
  { id: "lrisr", tel: "Keck 10 m", name: "Keck / LRIS red imaging",
    note: "LRIS images with a flat mirror in place of the grating: collimator 2000 mm, red camera 305 mm, the filters in the collimated beam. One 4k × 4k CCD since 2021, covering 9.2′; the field (6′ × 7.8′) is set by the slit-mask area at the telescope focus, drawn as a rectangular stop on the axis (the real field lies 4–10′ off the telescope's axis in the 6′ direction). Since 2007 the light also passes Keck I's Cassegrain ADC (prisms without power). D (10.95 m, the hexagonal primary's corners) sets the diffraction pattern; the collecting area is Keck's clear area at f/15, 71.5 m², from the hexagonal pupil the Telescopes mode draws (the circle would give 88.8 m²). Sources in data/imaging/reimagers.md.",
    state: { D: 10.95, eps: 0.24, collArea: 71.5, F: 13.66, tel: "cass", F1: 1.6, field: 15, stopW: 6, stopH: 7.8, optics: "reimaged", W: 146.41, Fc: 2.0832, band: "R", psf: "seeing",
             Nx: 4096, Ny: 4096, pix: 15, rows: [1] },
    pub: [
      { what: "pixel scale 0.135″/px", q: "pixScale", value: 0.135, tol: 0.01, src: "Keck LRIS detector table (Mark IV); measured for the 2009 red mosaic (Keck LRIS upgrade pages), not remeasured for the Mark IV in the saved sources" },
      { what: "field 6′ × 7.8′ (slit-mask area)", q: "fieldX", value: 6, info: true, src: "Keck LRIS pages; circular: the stop is entered as 6′ × 7.8′" },
    ] },
  { id: "mosfirei", tel: "Keck 10 m", name: "Keck / MOSFIRE imaging",
    note: "MOSFIRE images with a flat mirror on the grating turret: collimator 1813 mm, camera 250 mm, the filters in the collimated beam just before the pupil (Lyot) stop. One HAWAII-2RG (2040 × 2040 pixels used, 17.984 µm at 77 K). A circular baffle (6.9′) in front of the field lens cuts the corners of the square field. The collecting area is Keck's clear area at f/15, 71.5 m², from the hexagonal pupil (the circle of D = 10.95 m would give 88.8 m²). Sources in data/imaging/reimagers.md and data/round4/mosfire.md.",
    state: { D: 10.95, eps: 0.24, collArea: 71.5, F: 13.66, tel: "cass", F1: 1.6, field: 6.9, optics: "reimaged", W: 132.72, Fc: 1.8836, coldStop: true, band: "Ks", psf: "seeing",
             Nx: 2040, Ny: 2040, pix: 17.984, rows: [1] },
    pub: [
      { what: "pixel scale 0.1798″/px", q: "pixScale", value: 0.1798, tol: 0.005, src: "McLean+12" },
      { what: "field 6.1′ square", q: "fieldX", value: 6.113, tol: 0.01, src: "McLean+12 (2040 px × 0.1798″: the same arithmetic as the pixel scale)" },
    ] },
];
// ---------------------------------------------------------------- round 2 (2026-10-19, Charlie's picks): data/imaging/{vst_lbc,magellan,niri_hawki,tess}.md
window.IX_IPRESETS.push(
  { id: "omegacam", tel: "VST 2.6 m", name: "VST / OmegaCAM",
    note: "The VLT Survey Telescope (a modified Ritchey-Chrétien Cassegrain) with OmegaCAM behind a two-lens corrector: 32 CCDs in four rows of eight; the two wide gaps between rows hold the readout registers, the narrow middle gap separates the two halves. ε is a lower bound (set solely by the secondary; the baffles are not published). F comes from 0.2134″/px for the two-lens corrector (the 2011 manual; the THELI on-sky solution gives 0.21343; the current manual rounds to 0.213). The focus is drawn 1.20 m behind the primary's vertex, read from the manual's Fig. 2 (DERIVED). CCD 77 has not worked since 2021 (the model counts 32 CCDs). Sources in data/imaging/vst_lbc.md.",
    state: { D: 2.61, eps: 0.36, F: 5.555, tel: "cass", F1: 1.82, back: 0.459, field: 88.2, optics: "direct", band: "r", psf: "seeing",
             Nx: 2048, Ny: 4100, pix: 15, rows: [8, 8, 8, 8], gapX: 1.5, gapY: 5.64, gapsY: [5.64, 0.82, 5.64] },
    pub: [
      { what: "pixel scale 0.2134″/px", q: "pixScale", value: 0.2134, info: true, src: "OmegaCAM manual Issue 2.5 (2011; the two-lens corrector); circular: F was derived from it" },
      { what: "pixel scale 0.213″/px", q: "pixScale", value: 0.213, info: true, src: "OmegaCAM manual (2021, rounded)" },
      { what: "field 1° × 1°", q: "fieldX", value: 60, tol: 0.03, src: "ESO OmegaCAM pages" },
      { what: "268 Mpix", q: "npix", value: 268697600, tol: 1e-6, src: "32 × 2048 × 4100" },
    ] },
  { id: "lbcb", tel: "LBT 2 × 8.4 m", name: "LBT / LBC-Blue", inst: "LBC", setting: "Blue",
    note: "One of the Large Binocular Camera's two prime-focus imagers (LBC-Blue, on one of the LBT's two 8.4 m mirrors), behind a corrector of five lenses and the cryostat window (drawn as one lens of their power, which takes the primary's f/1.142 to f/1.45): three CCDs in a row and a fourth turned by 90° above the row, the optical axis on the middle chip (the mosaic drawn off center; the axis 8.36 mm above the chip's center, from the published rotator center). ε is a lower bound (the primary's central hole; the camera's shadow is not published). The corrected field is 110 mm (0.52°) across, and the circle here is set to take in the whole mosaic. Sources in data/imaging/vst_lbc.md.",
    state: { D: 8.4, eps: 0.106, F: 1.45, tel: "prime", F1: 1.142, corrector: { d: 0.93, label: "LBC-Blue corrector", sub: "five fused-silica lenses and the cryostat window, drawn as one lens" }, field: 40, optics: "direct", band: "g", psf: "seeing",
             Nx: 2048, Ny: 4608, pix: 13.5, rows: [3], gapX: 1.0, gapY: 1.03, shiftY: [-8.36, -8.36, -8.36], extra: [{ x: 0, y: 37.598, rot: true }] },
    pub: [
      { what: "pixel scale 0.2275″/px at the center (measured)", q: "pixScale", value: 0.2275, tol: 0.01, src: "Giallongo+08 Sec. 3 (the builders' measurement); F = 1.45 from the same paper. Bellini & Bedin 2010 measure 0.2297, 1% larger (next line)" },
      { what: "pixel scale 0.2297″/px near the center (measured)", q: "pixScale", value: 0.2297, tol: 0.01, src: "Bellini & Bedin 2010 (at chip 2's center, 2.3′ from the axis, calibrated on the Digitized Sky Survey); 1% above Giallongo+08's 0.2275" },
      { what: "pixel scale 0.2254″/px (field median)", q: "pixScale", value: 0.2254, info: true, src: "Giallongo+08 (the measured median; LBTO quotes 0.2255): the pincushion distortion, which the model leaves out, shrinks the scale away from the center" },
      { what: "37.7 Mpix", q: "npix", value: 37748736, tol: 1e-6, src: "4 × 2048 × 4608" },
    ] },
  { id: "lbcr", tel: "LBT 2 × 8.4 m", name: "LBT / LBC-Red", inst: "LBC", setting: "Red",
    note: "LBC-Red, the red-optimized twin of LBC-Blue on the LBT's other 8.4 m mirror (deep-depletion CCDs, a corrector of BK7 lenses and the cryostat window, drawn as one lens); the same layout of four CCDs. F comes from LBTO's 16.9″/mm (sources quote f/1.45 to f/1.47). No gaps are published for LBC-Red: the builders' LBC-Blue gaps (1.0 and 1.03 mm) are used, and the axis is 8.21 mm above the middle chip's center (the published rotator center). ε is a lower bound. Sources in data/imaging/vst_lbc.md.",
    state: { D: 8.4, eps: 0.106, F: 1.453, tel: "prime", F1: 1.142, corrector: { d: 0.93, label: "LBC-Red corrector", sub: "five BK7 lenses and the cryostat window, drawn as one lens" }, field: 40, optics: "direct", band: "i", psf: "seeing",
             Nx: 2048, Ny: 4608, pix: 13.5, rows: [3], gapX: 1.0, gapY: 1.03, shiftY: [-8.21, -8.21, -8.21], extra: [{ x: 0, y: 37.748, rot: true }] },
    pub: [
      { what: "pixel scale 0.2255″/px (field average)", q: "pixScale", value: 0.2255, info: true, src: "LBTO; an average over the distorted field; F was derived from the same page's 16.9″/mm" },
      { what: "37.7 Mpix", q: "npix", value: 37748736, tol: 1e-6, src: "4 × 2048 × 4608" },
    ] },
  { id: "megacamm", tel: "Magellan 6.5 m", name: "Magellan / Megacam (Clay)",
    note: "Megacam at the Clay telescope's f/5 Cassegrain focus (a convex secondary, not the f/11 Gregorian), behind a three-lens corrector and a field flattener that is also the dewar window: 36 CCDs in nine rows of four, long axis along the rows; within each row the gaps run wide, narrow, wide. ε is the secondary mirror's diameter (1.8 m); the secondary's baffle (size not published) and the spiders are not included, and the 29 m² McLeod et al. 2015 use for the throughput implies ε = 0.355. F comes from the published plate scale (0.169 mm/″). The 35′ corrected field is the MMT's, whose corrector is identical. No longer offered at Las Campanas. Sources in data/imaging/magellan.md.",
    state: { D: 6.5, eps: 0.28, F: 5.36, tel: "cass", F1: 1.25, field: 35, optics: "direct", band: "r", psf: "seeing",
             Nx: 4608, Ny: 2048, pix: 13.5, rows: [4, 4, 4, 4, 4, 4, 4, 4, 4], gapX: 1.01, gapY: 1.01, gapsX: [5.24, 1.01, 5.24] },
    pub: [
      { what: "pixel scale 0.08″/px", q: "pixScale", value: 0.08, info: true, src: "McLeod+15; circular: F was derived from the plate scale" },
      { what: "field 25′ × 25′", q: "fieldY", value: 25, tol: 0.03, src: "McLeod+15 (24′ in other sources, pixels alone)" },
      { what: "340 Mpix (36 × 2048 × 4608)", q: "npix", value: 339738624, info: true, src: "McLeod+15; the 35′ corrected field cuts the mosaic's corners (reaching 36′), whose pixels the model counts out" },
    ] },
  { id: "fourstar", tel: "Magellan 6.5 m", name: "Magellan / FourStar (Baade)",
    note: "FourStar on the Baade telescope's east Nasmyth platform: the f/11 Gregorian focus, turned to the side by a flat tertiary. A field-lens doublet images the primary onto a cold stop (the 130 mm pupil), and the camera works at f/3.6; the filters sit near the focal plane, just ahead of the last lens. The drawn collimator and camera are the ideal pair with the same pupil and magnification (FourStar has no collimated beam). Four HAWAII-2RG detectors (2040 × 2040 active) in a 2 × 2 grid; the published gaps range from 18″ to 24″ (2.0 mm used). Sources in data/imaging/magellan.md.",
    state: { D: 6.5, eps: 0.29, F: 11, tel: "greg", nasmyth: true, nasSide: "up", F1: 1.25, field: 20, optics: "reimaged", W: 130, Fc: 3.6, filterAt: "detector", coldStop: true, band: "Ks", psf: "seeing",
             Nx: 2040, Ny: 2040, pix: 18, rows: [2, 2], gapX: 2.0, gapY: 2.0 },
    pub: [
      { what: "pixel scale 0.159″/px", q: "pixScale", value: 0.159, tol: 0.01, src: "Persson+13; f/3.6 published" },
      { what: "field 10.8′", q: "fieldX", value: 10.8, info: true, src: "Persson+13; read as the pixels without the gap (2 × 2040 × 0.159″ = 10.81′, INFERRED); the model's field across includes the gap between the detectors" },
    ] },
);
// ---------------------------------------------------------------- previous generation (Charlie's picks, 2026-10-19): data/imaging/{poss,twomass}.md
window.IX_IPRESETS.push(
  { id: "poss1", tel: "Palomar 48-inch Schmidt", name: "Palomar 48-inch / POSS-I plates (red, E)", inst: "POSS plates", setting: "POSS-I (red, E)",
    note: "The first Palomar Observatory Sky Survey (1949-1958): 14-inch glass plates, bent to the Schmidt's curved focal surface, in the 48-inch Schmidt behind the original single-lens corrector (the aperture stop, 49.5 inches). The red plates: 103a-E emulsion behind a red Plexiglas filter (6200-6700 Å), 40-60 minutes, to ≈20.0 mag. A plate has no pixels: the emulsion's spread is taken as 30 µm, the smallest stellar images Abell (1958) gives as the limit of the 103a emulsions (INFERRED; the emulsion's 80 lines per mm would suggest less). The Digitized Sky Survey (DSS-1) later scanned glass copies of these plates in 25.3 µm steps (1.7″), 14,000 × 14,000 pixels. The field circle takes in the whole plate (unvignetted to 5.4°; the corners lose 0.1-0.2 mag). The model leaves out the single-lens corrector's chromatic blur in the red, the scanner's aperture, and the plate's bending to a sphere (0.1% in the field). The plateholder's obstruction is not published: 0.32 is the plate's own size, a lower bound. Sources in data/imaging/poss.md.",
    state: { D: 1.2573, eps: 0.32, F: 2.4417, tel: "schmidt", field: 570, optics: "direct", band: "R", psf: "seeing", depth: 20,
             det: "plate", plateMM: 355.6, grain: 30, scan: 25.2845, scanPx: 14000 },
    pub: [
      { what: "plate scale 67.19″/mm", q: "plateScale", value: 67.187, info: true, src: "Harrington 1952; circular: F was derived from it" },
      { what: "6.6° × 6.6° per plate", q: "fieldX", value: 6.6 * 60, info: true, src: "Harrington 1952; Abell 1958; circular: the plate's size times the plate scale, which set F" },
      { what: "DSS-1 scan 1.7″/px", q: "pixScale", value: 1.7, info: true, src: "STScI DSS pages (25.2845 µm steps)" },
    ] },
  { id: "poss2", tel: "Palomar 48-inch Schmidt", name: "Palomar 48-inch / POSS-II plates (red, F)", inst: "POSS plates", setting: "POSS-II (red, F)",
    note: "The second Palomar Sky Survey (1985-2002): the same telescope and 14-inch plates, with a new achromatic doublet corrector (images under 0.5″ over 6.5° from 3900 to 9000 Å) and plateholders reground to the focal surface. The red plates: IIIa-F emulsion behind an RG610 filter, 70-90 minutes, to ≈20.8 mag. The finer emulsion is taken as a spread of 10 µm: POSS-I's 30 µm scaled by the threefold resolving power Reid et al. (1991) give for IIIa-F (INFERRED; no spread is published). The Digitized Sky Survey (DSS-2) scanned the original plates in 15 µm steps (1.0″), 23,040 × 23,040 pixels, with a 42 µm Gaussian scanning spot (Lasker et al. 2008) that widens the scanned image. The obstruction is a lower bound (the plate's size; the filters sit in the plateholder). Sources in data/imaging/poss.md.",
    state: { D: 1.2573, eps: 0.32, F: 2.4417, tel: "schmidt", field: 570, optics: "direct", band: "R", psf: "seeing", depth: 20.8,
             det: "plate", plateMM: 355.6, grain: 10, scan: 15, scanPx: 23040, scanSpot: 42 },
    pub: [
      { what: "plate scale 67.19″/mm", q: "plateScale", value: 67.19, info: true, src: "Reid+91; circular: F was derived from it" },
      { what: "6.6° × 6.6° per plate", q: "fieldX", value: 6.6 * 60, info: true, src: "Reid+91; circular: the plate's size times the plate scale, which set F" },
      { what: "DSS-2 scan 1.006″/px (the plate solution)", q: "pixScale", value: 1.0062, tol: 0.01, src: "the WCS of a DSS-2 POSS-II F scan (FITS header: CD1_1 1.0073″, CD2_2 1.0051″; geometric mean)" },
      { what: "DSS-2 scan 1.0″/px", q: "pixScale", value: 1.0, info: true, src: "STScI DSS pages (\"about 1.0 arcseconds per pixel\", nominal)" },
    ] },
  { id: "twomass", tel: "2MASS 1.3 m", name: "2MASS / camera (one of three bands)",
    note: "The Two Micron All Sky Survey: two 1.3 m classical Cassegrain telescopes (Mt. Hopkins and CTIO), each with a camera that splits the beam with dichroics onto three 256 × 256 HgCdTe arrays (J, H and Ks at once; one band drawn), reimaged through cold Lyot stops that pass 90% of the pupil's diameter. The stop is the aperture here: D = 1.17 m and ε = 0.198 (the 232 mm secondary; DERIVED, assuming the stop does not also mask the center), which gives the design's f/3.5 at the arrays and a collecting area 20% below the full mirror's. F comes from the published plate scale, 11.97″/mm (Skrutskie et al. 2006 also quote f/13.5, 1.8% slower; the plate scale and the mirror prescription agree with each other). The pupil's size is not published (the reduction, 0.24, is DERIVED from the two plate scales), so W = 27 mm is the drawing's assumption. The survey scanned in declination while the secondary tilted against the scan to hold each 1.3 s exposure still, then flew back (freeze-frame scanning); each point was imaged six times, and the Atlas images were resampled to 1″ pixels. The display opens at 15.5 mag (the drawn sky is illustrative; the 10σ requirement was J 15.8, H 15.1, Ks 14.3). Sources in data/imaging/twomass.md.",
    state: { D: 1.17, eps: 0.198, F: 14.733, tel: "cass", F1: 2.222, back: 0.4504, field: 12.1, optics: "reimaged", W: 27.0, Fc: 3.542, coldStop: true, band: "Ks", psf: "seeing", depth: 15.5,
             Nx: 256, Ny: 256, pix: 40, rows: [1] },
    pub: [
      { what: "pixel scale 1.991″/px", q: "pixScale", value: 1.991, info: true, src: "Skrutskie+06; circular: F_cam was derived from it" },
      { what: "field 8.5′ × 8.5′", q: "fieldX", value: 8.5, info: true, src: "Skrutskie+06; circular: 256 px times the pixel scale that set F_cam" },
      { what: "secondary's radius of curvature 965.7 mm", q: "secR", value: 965.7, tol: 0.01, src: "2MASS Explanatory Supplement III.1a; tests F, the primary (5200 mm radius) and the back focus (527 mm, Garcia-Mejia et al. 2020) together" },
      { what: "65,536 px per band", q: "npix", value: 65536, tol: 1e-9, src: "256 × 256" },
    ] },
);
window.IX_IPRESETS.push(
  { id: "fourshooter", tel: "Palomar 200-inch", name: "Palomar 200-inch / 4-Shooter",
    note: "The 4-Shooter (installed 1983–84; the latest data in the saved sources date from 1985–89), an early CCD camera at the Hale telescope's f/16 Cassegrain focus: a four-sided pyramid at the focus (the WF/PC splitter design, the facets tilted by ≈5°; the pyramid also flattens the field, so the facets are probably powered, drawn flat) reflects each quadrant of the field back up to a separate reimaging camera (a collimator, a 4-inch filter, a small Schmidt camera at f/1.8) with an 800 × 800 TI CCD. Each CCD sees the pyramid's apex, so 20 pixels along two of the CCD's edges see no sky: the model draws the 780 × 780 pixels that do, the four quadrants abutting with ≈1″ lost along the pyramid's edges. The cameras' focal lengths and pupil are not published: f_col = 1000 mm, W = 62.5 mm and f_cam = 114 mm are the drawing's placeholders, set to give the published f/1.8 and 0.335″/px. ε is the 1961 prime-focus cage (72 inches), which carries the secondary. Sources in data/imaging/fourshooter.md.",
    state: { D: 5.08, eps: 0.36, F: 16, tel: "cass", F1: 3.3, field: 15, optics: "reimaged", split: "pyramid", W: 62.5, Fc: 1.8176, band: "r", psf: "seeing",
             Nx: 780, Ny: 780, pix: 15, rows: [2, 2], gapX: 0.045, gapY: 0.045 },
    pub: [
      { what: "pixel scale 0.335″/px", q: "pixScale", value: 0.335, info: true, src: "Porter 1984 Table I; Schneider+94; circular: F_cam was derived from it" },
      { what: "field 520″ across (2 × 780 pixels)", q: "fieldX", value: 520 / 60, tol: 0.01, src: "Postman+96 (\"∼2X780 pixels, or a width of 520″\")" },
      { what: "field 8′56″ × 8′56″ (the CCDs whole)", q: "fieldX", value: 8 + 56 / 60, info: true, src: "Porter 1984 Table I: 1600 px × 0.335″, the pixels the pyramid's apex shadows included" },
      { what: "2.43 Mpix see the sky (4 × 780 × 780; the CCDs hold 4 × 800 × 800)", q: "npix", value: 2433600, info: true, src: "Schneider+94 (20 px along two edges of each CCD see no sky); arithmetic" },
    ] },
);
// Gemini North / NIRI: one collimator and three cameras
// (f/32 with Altair's field lens: Gemini's NIRI + Altair tables use the field lens, which gives 0.0214″/px; the
// physical collimator (616.3 mm) and camera are kept, and the lens is entered as a faster beam on a smaller pupil,
// F = 16.60 and W = 37.13 mm, DERIVED from 0.0219 -> 0.0214″/px)
for (const [cam, fc, ps, fov, psf, F, W, ao] of [["f/6", 228.8, 0.1171, 119.9, "seeing", 16.22, 38, false], ["f/14", 536.8, 0.0499, 51.1, "seeing", 16.22, 38, false], ["f/32", 1223.2, 0.0214, 21.9, "diff", 16.60, 37.13, true]]) {
  window.IX_IPRESETS.push({ id: "niri" + cam.slice(2), tel: "Gemini North 8.1 m", name: "Gemini North / NIRI " + cam + " camera" + (ao ? " (Altair AO, field lens)" : ""), inst: "NIRI", setting: cam + (ao ? " (Altair AO)" : ""),
    note: "NIRI at the Gemini North Cassegrain focus: the broadband filters in the converging f/16 beam before the collimator, a 38 mm cold pupil (the Lyot stop) and three cameras (f/6, f/14, f/32), one 1024 × 1024 InSb array of 27 µm. D is the 7.9 m entrance pupil set by Gemini's deliberately undersized secondary (the primary is 8.1 m); ε from the secondary's central hole. The camera focal lengths are not published as such: they follow from the pupil and the published pixel scales. The f/6 camera was designed for wide fields, the f/14 camera for imaging in the L and M bands (Altair optional, to 2.5 µm), and the f/32 camera for the Altair adaptive optics, which reproduce the f/16 beam and pupil; " + (ao ? "this preset includes Altair's field lens, which gives 0.0214″/px (0.0219″/px without the lens). The image drawn is the diffraction limit, which Altair does not reach: Gemini's K′ Strehl ratios run 0.035–0.53. " : "the f/32 preset includes Altair. ") + "NIRI is not currently offered. Sources in data/imaging/niri_hawki.md.",
    state: { D: 7.9, eps: 0.164, F, tel: "cass", F1: 1.8, field: 7, optics: "reimaged", W, Fc: fc / W, filterAt: "converging", coldStop: true, band: "Ks", psf,
             Nx: 1024, Ny: 1024, pix: 27, rows: [1] },
    pub: [
      { what: "pixel scale " + ps + "″/px", q: "pixScale", value: ps, info: true, src: "Gemini NIRI pages" + (ao ? " (f/32 + Altair field lens)" : "") + "; circular: f_cam was derived from it" },
      { what: "field " + fov + "″", q: "fieldX", value: fov / 60, info: true, src: "Gemini NIRI pages" + (ao ? " (f/32 + Altair field lens)" : "") },
    ] });
}
window.IX_IPRESETS.push(
  { id: "hawki", tel: "VLT 8.2 m", name: "VLT / HAWK-I",
    note: "HAWK-I on UT4's Nasmyth A platform (a flat tertiary turns the f/15 beam to the side): an all-reflective reimager whose powered entrance window images the pupil onto a camera mirror that is the cold stop, working at f/4.36; the filters sit just in front of the detectors. The pupil's size is not published (only the reduction, 4.36/15), so the beam W = 100 mm is the drawing's assumption and the field angle in the beam is illustrative; the drawn collimator and camera are the ideal pair with the same pupil and magnification (HAWK-I's optics are mirrors with no collimated beam). Four HAWAII-2RG detectors (2040 × 2040 active) in a 2 × 2 grid; the gaps between the light-sensitive areas (17.1″ and 16.0″) are DERIVED from the manual's offset table, where the manual quotes ≈15″. The ground-layer adaptive optics (GRAAL) adds no optics to this path. Sources in data/imaging/niri_hawki.md.",
    state: { D: 8.0, eps: 0.1395, F: 15, tel: "cass", nasmyth: true, F1: 1.8, field: 15, optics: "reimaged", W: 100, Fc: 4.36, filterAt: "detector", coldStop: true, band: "Ks", psf: "seeing",
             Nx: 2040, Ny: 2040, pix: 18, rows: [2, 2], gapX: 2.9, gapY: 2.7 },
    pub: [
      { what: "pixel scale 0.1064″/px", q: "pixScale", value: 0.1064, tol: 0.01, src: "ESO HAWK-I pages (the FITS headers carry 0.10643); f/4.36 published" },
      { what: "field 7.5′", q: "fieldX", value: 7.5, tol: 0.015, src: "HAWK-I manual" },
    ] },
  { id: "tess", tel: "TESS 10.5 cm", name: "TESS / one camera",
    note: "One of TESS's four identical cameras: a seven-element f/1.4 lens (a refractor here) of 105 mm aperture with four CCDs at the focus, the optical axis in the gap between the chips. The lens's own aberrations set the image: the design puts ≈50% of a star's light in one pixel, averaged over the field, which the drawn profile (a Moffat) reaches with a 21″ FWHM; in flight the brightest pixel holds 20–40% of a star's light (a FWHM of ≈26–35″). The field is strongly distorted: a corner pixel covers 21% less sky than a central one, and the model's flat detector behind an ideal lens gives 12% of that, leaving out the lens's own distortion. Gaps from the in-flight focal-plane geometry; the field circle is the published 34° diagonal. Sources in data/imaging/tess.md.",
    state: { D: 0.105, eps: 0, F: 1.3905, tel: "refr", field: 2040, optics: "direct", band: "I", psf: "optics", blur: 21,
             Nx: 2048, Ny: 2048, pix: 15, rows: [2, 2], gapX: 1.74, gapY: 1.58 },
    pub: [
      { what: "pixel scale 21″/px", q: "pixScale", value: 21, tol: 0.015, src: "Ricker+15 (0.35′); HEASARC (\"21 arcseconds\"); f = 146 mm from the TESS Instrument Handbook and Chrisp+15's slides" },
      { what: "field 24° × 24°", q: "fieldX", value: 24 * 60, info: true, src: "Ricker+15; the model gives 24.4° (the in-flight geometry 24.2°; the lens's distortion is left out)" },
      { what: "16.8 Mpix per camera", q: "npix", value: 16777216, tol: 1e-6, src: "4 × 2048 × 2048" },
    ] },
);

// Keck II / NIRC2 behind adaptive optics: three cameras on one collimator
// (narrow: Service et al. 2016's 9.971 mas/px since the 2015 realignment; the Keck page's 0.009942 predates it)
for (const [cam, fc, ps, fov] of [["narrow", 1286.2, 0.009971, 10], ["medium", 647, 0.019829, 20], ["wide", 323, 0.039686, 40]]) {
  window.IX_IPRESETS.push({ id: "nirc2" + cam[0], tel: "Keck 10 m", name: "Keck / NIRC2 " + cam + " camera (adaptive optics)", inst: "NIRC2 (adaptive optics)", setting: cam + " camera",
    note: "NIRC2 sits on the Keck II left Nasmyth platform (a flat tertiary turns the beam to the side), behind the adaptive-optics bench, which delivers the telescope's f/15 focal length and pupil position (the AO relay is not drawn); a collimator, a pupil-mask wheel and filter wheels in the collimated beam, and three cameras (narrow, medium, wide). One 1024 × 1024 Aladdin-3 detector of 27 µm. The internal focal lengths and the pupil size are not published: W, f_col and f_cam are estimates from the aperture masks' geometry (they leave the pixel scale and field unchanged). The Keck pupil is hexagonal; the model's is a circular annulus for the image, and the collecting area is Keck's clear area at f/15, 71.5 m² (the circle would give 88.8 m²). The image drawn is the diffraction limit, which the adaptive optics approach only partly (no Keck Strehl ratio is in the saved sources). Sources in data/imaging/reimagers.md.",
    state: { D: 10.95, eps: 0.24, collArea: 71.5, F: 13.66, tel: "cass", nasmyth: true, nasSide: "up", F1: 1.6, field: 1, optics: "reimaged", W: 25.2, Fc: fc / 25.2, band: "Ks", psf: "diff",
             Nx: 1024, Ny: 1024, pix: 27, rows: [1] },
    pub: [
      { what: "pixel scale " + ps + "″/px", q: "pixScale", value: ps, info: true, src: (cam === "narrow" ? "Service et al. 2016 (since the 2015 realignment; the Keck page's 0.009942 is earlier)" : "Keck NIRC2 pages") + "; circular: f_cam was derived from it" },
      { what: "field " + fov + "″", q: "fieldX", value: fov / 60, info: true, src: "Keck NIRC2 pages" },
    ] });
}
