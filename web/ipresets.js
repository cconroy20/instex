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
   field, through its center), area (deg^2 of the field, gaps excluded), npix (pixels in the field), etendue
   (m^2 deg^2).  info: true marks a line printed but not scored (circular: the state was derived from the same number;
   or a different quantity from the model's).  Mosaic layouts are centered rows (top to bottom); gapsX / gapsY give
   the gap after each column / row where they differ, shiftY a shift up the chip by column, extra chips placed by hand. */
const LSST_GX = [], LSST_GY = [];
for (let i = 0; i < 14; i++) { LSST_GX.push(i % 3 === 2 ? 1.66 : 1.29); LSST_GY.push(i % 3 === 2 ? 2.48 : 2.21); }
window.IX_IPRESETS = [
  // ---------------------------------------------------------------- ground, direct (data/imaging/widefield.md, megacam_ztf_small.md)
  { id: "lsst", tel: "Rubin 8.4 m", name: "Rubin / LSSTCam",
    note: "Rubin Observatory (Simonyi Survey Telescope) with LSSTCam: a three-mirror telescope (drawn as a Cassegrain) and a three-lens corrector, the filter in the converging beam. 189 science CCDs in 21 rafts of 3 × 3; the e2v format (4096 × 4004) stands for both chip types (ITL 4072 × 4000) and the gaps are the nominal pipeline geometry (within a raft and between rafts). Central obstruction: the primary's inner clear edge (the tertiary shares the glass). The field circle takes in the whole focal plane: the 3.5° field is nominal, and the CCDs alone cover the published 9.6 deg². Sources in data/imaging/widefield.md.",
    state: { D: 8.36, eps: 0.612, F: 1.233, tel: "cass", F1: 1.19, field: 250, optics: "direct", band: "r", psf: "seeing",
             Nx: 4096, Ny: 4004, pix: 10, rows: [9, 9, 9, 15, 15, 15, 15, 15, 15, 15, 15, 15, 9, 9, 9], gapX: 1.29, gapY: 2.21, gapsX: LSST_GX, gapsY: LSST_GY },
    pub: [
      { what: "pixel scale 0.2″/px", q: "pixScale", value: 0.2, tol: 0.01, src: "Ivezić+19; F = 1.233 from the Rubin key numbers" },
      { what: "3.09 Gpix (117 × 4096 × 4004 + 72 × 4072 × 4000)", q: "npix", value: 3091504128, tol: 0.006, src: "pipeline formats (widefield.md); the model uses one format" },
      { what: "field 9.6 deg²", q: "area", value: 9.6, tol: 0.01, src: "Ivezić+19 (the CCDs' area)" },
      { what: "étendue 319 m² deg²", q: "etendue", value: 319, info: true, src: "Ivezić+19; the published figure's area and field definitions are not given" },
    ] },
  { id: "hsc", tel: "Subaru 8.2 m", name: "Subaru / Hyper Suprime-Cam",
    note: "Subaru prime focus with the seven-element Wide Field Corrector (with an atmospheric dispersion corrector). 104 science CCDs: 100 in centered rows with their long axis up the rows, and 4 turned by 90° beside the top and bottom rows; the gap between the two halves of the mosaic is narrower. The central obstruction is not published in the sources obtained, so ε is set to 0 here (the collecting area and étendue are upper limits). The field circle takes in the whole mosaic: the corrected field is 1.5° across (unvignetted to 10′, 26% vignetting at the 0.75° edge), and the outer CCDs reach past the 1.5° circle (the vignetting is not modeled). Sources in data/imaging/widefield.md.",
    state: { D: 8.2, eps: 0, F: 2.25, tel: "prime", F1: 1.83, field: 120, optics: "direct", band: "r", psf: "seeing",
             Nx: 2048, Ny: 4176, pix: 15, rows: [7, 13, 15, 15, 15, 15, 13, 7], gapX: 1.12, gapY: 4.51, gapsY: [4.51, 4.51, 4.51, 1.13, 4.51, 4.51, 4.51],
             extra: [{ x: -143.32, y: 217.375, rot: true }, { x: 143.32, y: 217.375, rot: true }, { x: -143.32, y: -217.375, rot: true }, { x: 143.32, y: -217.375, rot: true }] },
    pub: [
      { what: "pixel scale 0.168″/px", q: "pixScale", value: 0.168, info: true, src: "pipeline 11.2″/mm; circular: F = 2.25 was derived from it (published F/2.2)" },
      { what: "field 1.5° across (1.77 deg²)", q: "area", value: 1.77, info: true, src: "the corrected field's area; the model counts the 104 CCDs, which reach past it" },
      { what: "870 Mpix (104 × 2048 × 4096, as the CCDs are sold)", q: "npix", value: 872415232, info: true, src: "Subaru pages; the active format is 2048 × 4176" },
    ] },
  { id: "decam", tel: "Blanco 4 m", name: "Blanco / DECam",
    note: "Blanco prime focus with the five-element DECam corrector (the filter between the third and fourth lenses). 62 science CCDs, long axis along the rows; the field center falls in the gap between the two middle rows. The central obstruction (0.42) is the prime-focus cage baffle of the pre-DECam telescope table (no DECam-era value found). Sources in data/imaging/widefield.md.",
    state: { D: 3.934, eps: 0.42, F: 2.98, tel: "prime", F1: 2.7, field: 132, optics: "direct", band: "r", psf: "seeing",
             Nx: 4096, Ny: 2048, pix: 15, rows: [3, 4, 5, 6, 6, 7, 7, 6, 6, 5, 4, 3], gapX: 2.3, gapY: 3.0 },
    pub: [
      { what: "pixel scale 0.2637″/px", q: "pixScale", value: 0.2637, info: true, src: "pipeline 17.575″/mm; circular: F = 2.98 was derived from it (published f/3.0)" },
      { what: "field 3 deg²", q: "area", value: 3, tol: 0.1, src: "NOAO DECam pages (one significant figure)" },
      { what: "520 Mpix of science CCDs", q: "npix", value: 520093696, tol: 0.001, src: "62 × 2048 × 4096" },
    ] },
  { id: "megacam", tel: "CFHT 3.6 m", name: "CFHT / MegaCam",
    note: "CFHT prime focus with the four-lens MegaPrime corrector. 40 CCDs in four rows (9, 11, 11, 9: the four 'ears' at the ends of the two middle rows, in science use since 2015); the gap between the middle rows is narrow, the others wide. ε reproduces CFHT's published collecting area. F comes from the published 0.187″/px. Sources in data/imaging/megacam_ztf_small.md.",
    state: { D: 3.58, eps: 0.451, F: 4.16, tel: "prime", F1: 3.77, field: 90, optics: "direct", band: "r", psf: "seeing",
             Nx: 2048, Ny: 4612, pix: 13.5, rows: [9, 11, 11, 9], gapX: 0.945, gapY: 5.74, gapsY: [5.74, 0.945, 5.74] },
    pub: [
      { what: "pixel scale 0.187″/px", q: "pixScale", value: 0.187, info: true, src: "CFHT; circular: F was derived from it" },
      { what: "378 Mpix (40 × 2048 × 4612)", q: "npix", value: 377815040, tol: 0.001, src: "CFHT MegaPrime pages" },
      { what: "field 0.96° × 0.94° (36 CCDs, no ears)", q: "fieldY", value: 0.94 * 60, info: true, src: "CFHT; the published layout gives 0.987 × 1.006° for 36 CCDs" },
    ] },
  { id: "ztf", tel: "Palomar 48-inch Schmidt", name: "Palomar 48-inch / ZTF",
    note: "The Oschin Schmidt: the corrector plate is the aperture stop (1.24 m), the spherical mirror (1.83 m) is larger, and the camera sits at the focus inside the tube. 16 CCDs of 6144 × 6160; the gaps are those that reproduce the published on-sky gaps. ε is the area-equivalent of the published on-axis obscuration (cryostat and spiders, 22.4%). No corrected-field diameter is published (the corners are vignetted up to 30%), so the field circle is set wide. Sources in data/imaging/megacam_ztf_small.md.",
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
    note: "Hubble's Advanced Camera for Surveys, Wide Field Channel, modeled as direct: the channel's corrector mirrors image the pupil onto a mirror (no published pupil size), and the filters sit in the converging beam. The published f/25 describes the beam at the tilted (22°) focal surface and gives a pixel 3% too coarse here; F = 25.78 reproduces the published 0.050″/px. Two 4096 × 2048 CCDs. Sources in data/imaging/hst.md.",
    state: { D: 2.4, eps: 0.33, F: 25.78, tel: "cass", field: 10, optics: "direct", band: "I", psf: "diff",
             Nx: 4096, Ny: 2048, pix: 15, rows: [1, 1], gapX: 0.75, gapY: 0.75 },
    pub: [
      { what: "pixel scale 0.050″/px", q: "pixScale", value: 0.05, info: true, src: "ACS handbook; circular: F was derived from it" },
      { what: "field 202″", q: "fieldX", value: 202 / 60, info: true, src: "ACS handbook (the pixels are rhombic; the model's are square)" },
      { what: "16.8 Mpix", q: "npix", value: 16777216, tol: 1e-6, src: "2 × 4096 × 2048" },
    ] },
  { id: "uvis", tel: "Hubble 2.4 m", name: "HST / WFC3/UVIS",
    note: "Wide Field Camera 3, UVIS channel, modeled as direct. F = 32.5 is the design focal length (78.0 m) over D; the published f/31 describes the beam at the tilted (21°) focal surface. Two 4096 × 2051 CCDs. Sources in data/imaging/hst.md.",
    state: { D: 2.4, eps: 0.33, F: 32.5, tel: "cass", field: 10, optics: "direct", band: "V", psf: "diff",
             Nx: 4096, Ny: 2051, pix: 15, rows: [1, 1], gapX: 0.465, gapY: 0.465 },
    pub: [
      { what: "pixel scale 0.0395″/px", q: "pixScale", value: 0.0395, tol: 0.01, src: "WFC3 handbook; F from the design review's 78,000 mm" },
      { what: "16.8 Mpix", q: "npix", value: 16801792, tol: 1e-6, src: "2 × 4096 × 2051" },
    ] },
  { id: "wfc3ir", tel: "Hubble 2.4 m", name: "HST / WFC3/IR",
    note: "Wide Field Camera 3, IR channel, the one Hubble channel with a published pupil: a cold mask at the reimaged pupil (radius 7.13 mm), so the beam W = 14.26 mm. F_cam = 12.08 is the design focal length (29.0 m) over D; the published f/11 gives a pixel 10% too coarse (the 24° detector tilt). One 1014 × 1014 detector (active area of 1024 × 1024). Sources in data/imaging/hst.md.",
    state: { D: 2.4, eps: 0.33, F: 24, tel: "cass", field: 10, optics: "reimaged", W: 14.26, Fc: 12.083, band: "H", psf: "diff",
             Nx: 1014, Ny: 1014, pix: 18, rows: [1] },
    pub: [
      { what: "pixel scale 0.128″/px (geometric mean of 0.135 × 0.121)", q: "pixScale", value: 0.1278, tol: 0.01, src: "WFC3 handbook; F_cam from the design review's 29,000 mm" },
      { what: "1.03 Mpix", q: "npix", value: 1028196, tol: 1e-6, src: "1014 × 1014" },
    ] },
  { id: "euclid", tel: "Euclid 1.2 m", name: "Euclid / VIS",
    note: "Euclid's visible imager: the detectors sit at the focus of a Korsch three-mirror telescope (drawn as a Cassegrain), with no optics between; F from the as-built focal length (24.87 m). 36 CCDs of 4096 × 4132 in a 6 × 6 grid, the wide gaps between rows. ε is an estimate from the published pupil model (no ratio is published). Sources in data/imaging/space_wide.md.",
    state: { D: 1.2, eps: 0.33, F: 20.73, tel: "cass", field: 70, optics: "direct", band: "I", psf: "diff",
             Nx: 4096, Ny: 4132, pix: 12, rows: [6, 6, 6, 6, 6, 6], gapX: 1.56, gapY: 7.82 },
    pub: [
      { what: "pixel scale 0.100″/px", q: "pixScale", value: 0.1, info: true, src: "circular: F was derived from the as-built plate scale" },
      { what: "0.466 deg² of active silicon", q: "area", value: 0.466, tol: 0.01, src: "Euclid VIS paper" },
      { what: "field 0.775° × 0.697° (with gaps)", q: "fieldY", value: 0.775 * 60, tol: 0.01, src: "Euclid VIS paper" },
      { what: "609 Mpix", q: "npix", value: 609288192, tol: 1e-6, src: "36 × 4096 × 4132" },
    ] },
  { id: "roman", tel: "Roman 2.4 m", name: "Roman / WFI",
    note: "The Roman Wide Field Instrument: 18 H4RG-10 detectors (4088 × 4088 active) at the focus of a three-mirror telescope (drawn as a Cassegrain), the filters at the exit pupil in the converging beam. The detectors lie in an arc: each column shifted up to the pre-flight position (gaps from the 2022 pre-flight model). F and ε are 2015 design values. Sources in data/imaging/space_wide.md.",
    state: { D: 2.36, eps: 0.30, F: 7.9, tel: "cass", F1: 1.2, field: 90, optics: "direct", band: "H", psf: "diff",
             Nx: 4088, Ny: 4088, pix: 10, rows: [6, 6, 6], gapX: 3.43, gapY: 3.0, gapsY: [7.68, 2.98], shiftY: [30.19, 8.81, 0, 0, 8.81, 30.19] },
    pub: [
      { what: "pixel scale 0.11″/px", q: "pixScale", value: 0.11, tol: 0.012, src: "Roman WFI pages; F and D from the 2015 design" },
      { what: "0.281 deg² active", q: "area", value: 0.281, tol: 0.02, src: "Roman WFI pages" },
      { what: "300.8 Mpix", q: "npix", value: 300811392, tol: 1e-6, src: "18 × 4088 × 4088" },
    ] },
  { id: "nircamsw", tel: "JWST 6.6 m", name: "JWST / NIRCam short wavelength",
    note: "NIRCam reimages the telescope focus: a collimator, a 31 mm pupil holding the filter and pupil wheels, and a camera (here the short-wavelength channel, f/18). Two modules of 2 × 2 detectors side by side. D is the entrance pupil (the primary is 18 hexagonal segments; the model's pupil is a circular annulus, so the diffraction pattern is approximate) and ε is an estimate from the empty central segment. Sources in data/imaging/space_wide.md.",
    state: { D: 6.6, eps: 0.2, F: 19.91, tel: "cass", F1: 1.2, field: 10, optics: "reimaged", W: 31.14, Fc: 18.0, band: "Ks", psf: "diff",
             Nx: 2040, Ny: 2040, pix: 18, rows: [4, 4], gapX: 2.59, gapY: 2.59, gapsX: [2.59, 24.77, 2.59] },
    pub: [
      { what: "pixel scale 0.031″/px", q: "pixScale", value: 0.031, tol: 0.012, src: "JDox (in flight); W and f/18 from Huff 2005" },
      { what: "field 2 × 2.2′ × 2.2′ = 9.7 arcmin²", q: "area", value: 9.7 / 3600, info: true, src: "JDox; counts each module whole (gaps included)" },
      { what: "33.3 Mpix", q: "npix", value: 33292800, tol: 1e-6, src: "8 × 2040 × 2040" },
    ] },
  { id: "nircamlw", tel: "JWST 6.6 m", name: "JWST / NIRCam long wavelength",
    note: "NIRCam's long-wavelength channel shares the collimator and pupil (behind a dichroic) with a camera at f/9: one detector per module. The pupil is drawn as a circular annulus (the real one is hexagonal). Sources in data/imaging/space_wide.md.",
    state: { D: 6.6, eps: 0.2, F: 19.91, tel: "cass", F1: 1.2, field: 10, optics: "reimaged", W: 31.14, Fc: 9.0, band: "M′", psf: "diff",
             Nx: 2040, Ny: 2040, pix: 18, rows: [2], gapX: 13.39 },
    pub: [
      { what: "pixel scale 0.063″/px", q: "pixScale", value: 0.063, tol: 0.012, src: "JDox (in flight)" },
      { what: "8.3 Mpix", q: "npix", value: 8323200, tol: 1e-6, src: "2 × 2040 × 2040" },
    ] },
  // ---------------------------------------------------------------- ground, reimaged (data/imaging/reimagers.md)
  { id: "fors2sr", tel: "VLT 8.2 m", name: "VLT / FORS2 imaging, standard resolution",
    note: "FORS2 is a focal reducer: collimator 1233 mm (standard resolution), camera 280 mm, broadband filters in the collimated beam. Two 4096 × 2048 CCDs. The published field (6.8′ square) is set by the multi-object slit unit at the telescope focus, a square stop the model does not draw; the mosaic covers 8.6′. Sources in data/imaging/reimagers.md.",
    state: { D: 8.115, eps: 0.1375, F: 13.4106, tel: "cass", F1: 1.8, field: 15, optics: "reimaged", W: 91.94, Fc: 3.0454, band: "R", psf: "seeing",
             Nx: 4096, Ny: 2048, pix: 15, rows: [1, 1], gapX: 0.48, gapY: 0.48 },
    pub: [
      { what: "pixel scale 0.1259″/px (measured)", q: "pixScale", value: 0.12591, tol: 0.01, src: "FORS2 manual" },
      { what: "field 6.8′ (square stop)", q: "fieldX", value: 6.8, info: true, src: "FORS2 manual; the stop is not modeled" },
    ] },
  { id: "fors2hr", tel: "VLT 8.2 m", name: "VLT / FORS2 imaging, high resolution",
    note: "FORS2 with the high-resolution collimator (616 mm): twice the image scale of the standard collimator with the same camera, a 4.25′ field set by the CCDs. Sources in data/imaging/reimagers.md.",
    state: { D: 8.115, eps: 0.1375, F: 13.4106, tel: "cass", F1: 1.8, field: 15, optics: "reimaged", W: 45.93, Fc: 6.0958, band: "R", psf: "seeing",
             Nx: 4096, Ny: 2048, pix: 15, rows: [1, 1], gapX: 0.48, gapY: 0.48 },
    pub: [
      { what: "pixel scale 0.0632″/px (measured)", q: "pixScale", value: 0.06323, tol: 0.015, src: "FORS2 manual" },
      { what: "field 4.25′", q: "fieldX", value: 4.25, tol: 0.015, src: "FORS2 manual" },
    ] },
  { id: "imacsf2", tel: "Magellan 6.5 m", name: "Magellan / IMACS f/2 imaging",
    note: "IMACS with the f/2 camera: collimator 1648 mm, beam 150 mm, camera 356 mm; the Mosaic3 camera (2 rows of 4 CCDs) since 2017. A circular field stop of about 30′ (the camera baffles) cuts the mosaic's corners. IMACS sits on the Baade telescope's west Nasmyth platform: an f/11 Gregorian secondary, then a flat tertiary that turns the beam to the side; ε is measured on the twin telescope (Clay). Sources in data/imaging/reimagers.md.",
    state: { D: 6.5, eps: 0.29, F: 11, tel: "greg", nasmyth: true, F1: 1.25, field: 30, optics: "reimaged", W: 149.86, Fc: 2.3729, band: "r", psf: "seeing",
             Nx: 2048, Ny: 4096, pix: 15, rows: [4, 4], gapX: 1.37, gapY: 1.08 },
    pub: [
      { what: "pixel scale 0.200″/px", q: "pixScale", value: 0.2, tol: 0.01, src: "LCO IMACS pages" },
      { what: "field 670 arcmin²", q: "area", value: 670 / 3600, info: true, src: "LCO IMACS pages: the mosaic inside a 15′-radius circle, gaps included (the model excludes the gaps, about 4%)" },
    ] },
  { id: "lrisr", tel: "Keck 10 m", name: "Keck / LRIS red imaging",
    note: "LRIS images with a flat mirror in place of the grating: collimator 2000 mm, red camera 305 mm, the filters in the collimated beam. One 4k × 4k CCD since 2021. The published field (6′ × 7.8′) is set by the slit-mask area at the telescope focus, a rectangle the model does not draw; the CCD covers 9.2′. Sources in data/imaging/reimagers.md.",
    state: { D: 10.95, eps: 0.24, F: 13.66, tel: "cass", F1: 1.6, field: 15, optics: "reimaged", W: 146.41, Fc: 2.0832, band: "R", psf: "seeing",
             Nx: 4096, Ny: 4096, pix: 15, rows: [1] },
    pub: [
      { what: "pixel scale 0.135″/px", q: "pixScale", value: 0.135, tol: 0.01, src: "Keck LRIS pages" },
      { what: "field 6′ × 7.8′ (slit-mask area)", q: "fieldX", value: 6, info: true, src: "Keck LRIS pages; the stop is not modeled" },
    ] },
  { id: "mosfirei", tel: "Keck 10 m", name: "Keck / MOSFIRE imaging",
    note: "MOSFIRE images with a flat mirror on the grating turret: collimator 1813 mm, camera 250 mm, the filters in the collimated beam just before the pupil (Lyot) stop. One HAWAII-2RG (2040 × 2040 pixels used). A circular baffle (6.9′) in front of the field lens cuts the corners of the square field. Sources in data/imaging/reimagers.md and data/round4/mosfire.md.",
    state: { D: 10.95, eps: 0.24, F: 13.66, tel: "cass", F1: 1.6, field: 6.9, optics: "reimaged", W: 132.72, Fc: 1.8836, band: "Ks", psf: "seeing",
             Nx: 2040, Ny: 2040, pix: 18, rows: [1] },
    pub: [
      { what: "pixel scale 0.1798″/px", q: "pixScale", value: 0.1798, tol: 0.005, src: "McLean+12" },
      { what: "field 6.1′ square", q: "fieldX", value: 6.113, tol: 0.01, src: "McLean+12" },
    ] },
];
// Keck II / NIRC2 behind adaptive optics: three cameras on one collimator
for (const [cam, fc, ps, fov] of [["narrow", 1290, 0.009942, 10], ["medium", 647, 0.019829, 20], ["wide", 323, 0.039686, 40]]) {
  window.IX_IPRESETS.push({ id: "nirc2" + cam[0], tel: "Keck 10 m", name: "Keck / NIRC2 " + cam + " camera (adaptive optics)",
    note: "NIRC2 sits on the Keck II left Nasmyth platform (a flat tertiary turns the beam to the side), behind the adaptive-optics bench, which delivers the telescope's f/15 focal length and pupil position (the AO relay is not drawn); a collimator, a pupil-mask wheel and filter wheels in the collimated beam, and three cameras (narrow, medium, wide). One 1024 × 1024 Aladdin-3 detector of 27 µm. The internal focal lengths and the pupil size are not published: W, f_col and f_cam are estimates from the aperture masks' geometry (they leave the pixel scale and field unchanged). The Keck pupil is hexagonal; the model's is a circular annulus. Sources in data/imaging/reimagers.md.",
    state: { D: 10.95, eps: 0.24, F: 13.66, tel: "cass", nasmyth: true, F1: 1.6, field: 1, optics: "reimaged", W: 25.2, Fc: fc / 25.2, band: "Ks", psf: "diff",
             Nx: 1024, Ny: 1024, pix: 27, rows: [1] },
    pub: [
      { what: "pixel scale " + ps + "″/px", q: "pixScale", value: ps, info: true, src: "Keck NIRC2 pages; circular: f_cam was derived from it" },
      { what: "field " + fov + "″", q: "fieldX", value: fov / 60, info: true, src: "Keck NIRC2 pages" },
    ] });
}
