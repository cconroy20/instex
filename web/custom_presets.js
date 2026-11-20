/*
 * SAMOS custom instrument presets
 * Optical reference: SAMOS Optical Design, 2018 PDR.
 *
 * The optical geometry uses first-order design values.
 * VPH grisms are provisionally approximated as transmission
 * gratings until the grism physics is implemented correctly.
 */

(function () {
  "use strict";

  const presets = window.IX_PRESETS;

  if (!Array.isArray(presets)) {
    console.error("Instrument Explorer presets unavailable");
    return;
  }

  const template = presets.find(p => p.id === "pfsr");

  if (!template) {
    console.error("Reference template pfsr not found");
    return;
  }

  const samosModes = [
    {
      id: "samos_blue",
      setting: "Low-R Blue",
      lo: 4000,
      hi: 6000,
      R: 3137,
      G: 702.5,
      grismAngle: 37.7
    },
    {
      id: "samos_red",
      setting: "Low-R Red",
      lo: 6000,
      hi: 9500,
      R: 2791,
      G: 416.9,
      grismAngle: 35.5
    },
    {
      id: "samos_hbeta",
      setting: "High-R Hbeta",
      lo: 4504,
      hi: 5139,
      R: 9601,
      G: 1775.0,
      grismAngle: 50.0
    },
    {
      id: "samos_halpha",
      setting: "High-R Halpha",
      lo: 5988,
      hi: 7000,
      R: 8111,
      G: 1250.0,
      grismAngle: 50.0
    },
    {
      id: "samos_gaia",
      setting: "GAIA High-R (PDR option)",
      lo: 8201,
      hi: 9294,
      R: 10141,
      G: 1198.5,
      grismAngle: 39.6
    }
  ];

  // Equivalent fused-silica VPH grism apex angles.
  // Derived for the nominal central wavelengths.
  // NOT the actual SAMOS manufactured prism angles.
  // Equivalent VPH grism apex angles, using PDR materials.
  // These are NOT measured prism apex angles.
  const equivalentApex = {
    samos_blue: 18.97523,
    samos_red: 17.83319,
    samos_hbeta: 25.11836,
    samos_halpha: 25.09377,
    samos_gaia: 19.84433
  };

  const prismGlass = {
    samos_blue: "S-BSL7",
    samos_red: "S-BSL7",
    samos_hbeta: "S-NPH2",
    samos_halpha: "S-NPH2",
    samos_gaia: "ZnSe-23C"
  };

  for (const c of samosModes) {

    const lamC = (c.lo + c.hi) / 2;

    presets.push({
      id: c.id,
      tel: "SOAR 4.1 m",
      name: "SOAR / SAMOS " + c.setting,
      inst: "SAMOS (PDR 2018)",
      setting: c.setting,

      note:
        "SAMOS 2018 PDR optical design. " +
        "Off-axis Schmidt collimator, 54 mm beam; " +
        "271 mm refractive camera; Cinema-2K DMD. " +
        "PDR grism: " + c.G + " lines/mm, " +
        c.grismAngle + " degree design angle. " +
        "IMPORTANT: grism represented by an equivalent " +
        "transmission grating. Predicted performance " +
        "is not yet validated.",

      state: {
        ...template.state,

        mode: "grating",
        D: 4.1,
        F: 4.1,

        g: {
          ...template.state.g,

          slitW: 0.334,
          nObj: 1,
          fieldArcsec: 180,
          fieldArcsec: 180,

          col: "mirror",
          colTilt: null,
          W: 54,

          cam: "lens",
          fcam: 271,

          gType: "grism",
          gKind: "vph",
          gGlass: prismGlass[c.id],
          gA: equivalentApex[c.id],
          gTilt: 0,
          G: c.G,
          m: 1,

          lamC: lamC,
          lamB1: lamC,

          // Temporary reference geometry from PFS.
          // Must be replaced with actual SAMOS grism data.
          psi: template.state.g.psi,
          tAlpha: template.state.g.tAlpha,

          Nx: 4096,
          Ny: 4112,
          pix: 15,

          // SAMOS PDR nominal spectral operating band (Angstrom)
          filt: [c.lo, c.hi]
        }
      },

      pub: [
        {
          what: "PDR resolving power R = " + c.R,
          q: "R",
          value: c.R,
          info: true,
          src: "SAMOS Optical Design, PDR Table 1"
        },
        {
          what: "PDR spectral span " +
                (c.hi - c.lo) + " Angstrom",
          q: "span",
          value: c.hi - c.lo,
          info: true,
          src: "SAMOS Optical Design, PDR Table 1"
        }
      ]
    });
  }

  console.log(
    "Loaded " + samosModes.length + " SAMOS PDR presets"
  );

})();
