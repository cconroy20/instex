# OIR spectrograph candidates for the Spectrograph mode

Audit of 2026-11-17. Scope: optical and infrared spectrographs not yet in web/presets.js. The design paper for each
candidate was found on ADS and title-checked. Numbers quoted below come from those abstracts. No candidate has been
sourced to the preset standard yet (no rawdata, no records, no layout figures checked).

## Coverage of the current set

The Spectrograph mode holds 32 instruments on 12 telescopes. Dispersers: ruled and VPH gratings, grisms, and echelles
with prism, grism or VPH cross-dispersers. Entrances: slits, fibers and slicers (KCWI, MUSE). The gaps:

- Era: no instrument designed before the 1990s.
- Facilities: no Gemini, LBT, HET, SALT, AAT, WHT, CFHT, Palomar, Lick, McDonald or LAMOST instrument; Subaru has
  only PFS and SDSS only APOGEE; no space spectrograph.
- Architecture: no coudé spectrograph, no prism as the main disperser, no immersion grating, no lenslet IFU, no
  polarimeter, no slitless spectroscopy.

## Recommended first ten

These fit the current model (grating or echelle mode, existing entrance types). The ranking weighs scientific weight
together with what each instrument adds to the explorer.

| # | Instrument | Telescope | Case for inclusion | Adds to the explorer | Design paper |
|---|---|---|---|---|---|
| 1 | ELODIE | OHP 1.93 m | The spectrograph of the 51 Peg b discovery (Mayor & Queloz 1995, 1995Natur.378..355M) | Fiber-fed echelle, tan θ = 4, prism + grism cross-disperser; R = 42,000 over 3906–6811 Å on a 1024² CCD; the predecessor of HARPS (present) | Baranne et al. 1996, 1996A&AS..119..373B |
| 2 | SDSS / BOSS spectrographs | Sloan 2.5 m | More than 1.5 million spectra for SDSS I–II and the first BAO detection; still in use | Twin fiber spectrographs with two channels, reflective collimators and refractive cameras; the BOSS upgrade (ruled to VPH gratings, 640 to 1000 fibers) makes a two-setting preset; an All-arms group | Smee et al. 2013, 2013AJ....146...32S |
| 3 | Double Spectrograph | Hale 5 m (Cassegrain) | An early dichroic double spectrograph; Oke later designed LRIS (present) | A dichroic behind the slit feeds two separate spectrographs (3200–5200 Å and 5200–10,000 Å); an All-arms group; early CCDs | Oke & Gunn 1982, 1982PASP...94..586O |
| 4 | Hamilton echelle | Shane 3 m (coudé) | The iodine-cell Doppler program (Marcy & Butler 1992, 1992PASP..104..270M; Butler et al. 1996, 1996PASP..108..500B) | Prism cross-dispersion, a large collimated beam and an f/1.67 folded Schmidt camera; R = 30,000–60,000 over 0.34–1.1 µm | Vogt 1987, 1987PASP...99.1214V |
| 5 | Hale coudé, with the Mt Wilson 100-inch coudé | Palomar 5 m; Mt Wilson 2.5 m | Bowen's paper sets out the relations between spectrograph speed and design parameters; the Mt Wilson coudé established interstellar CH and CN (Adams 1941) | Hale: a 12-inch beam, a mosaic of four gratings and five Schmidt cameras from 144 to 8.4 inches (2.3–40 Å/mm), so one collimator and grating serve several cameras (a Setting menu); Mt Wilson: three Schmidt cameras (32, 73, 114 inches) and an off-axis collimator; the Telescopes mode already draws the Hale coudé fold | Bowen 1952, 1952ApJ...116....1B; Adams 1941, 1941ApJ....93...11A |
| 6 | FAST | Tillinghast 1.5 m | CfA's workhorse for redshift surveys and supernova spectra since 1994 | Mostly reflective optics, a ~100 mm beam, a peak system efficiency of 26%; Fabricant also led Hectospec and Binospec (both present) | Fabricant et al. 1998, 1998PASP..110...79F |
| 7 | NIRSpec | JWST | The first space spectrograph in the set, and the high-redshift spectrograph of this decade | An all-reflective optical chain; a micro-shutter array over 3.6′ × 3.4′, fixed slits and an IFU; the gratings (R = 500–1340 and 1320–3600) fit now, and the R = 30–330 prism needs the prism feature below | Jakobsen et al. 2022, 2022A&A...661A..80J |
| 8 | AAOmega (with 2dF) | AAT 3.9 m | 2dFGRS on the original 2dF spectrographs; GAMA, WiggleZ and OzDES on AAOmega | A bench-mounted, dual-beam, articulating all-Schmidt design with VPH gratings, 370–950 nm, R = 1400–10,000; the articulating camera shows Bragg-angle tuning | Saunders et al. 2004, 2004SPIE.5492..389S; Sharp et al. 2006, 2006SPIE.6269E..0GS; 2dF: Lewis et al. 2002, 2002MNRAS.333..279L |
| 9 | VIRUS | HET 10 m | HETDEX; the first large-scale replication of an optical instrument | 156 identical spectrographs fed by ~35,000 fibers in 78 IFUs, R ≈ 800, 3500–5500 Å | Hill et al. 2021, 2021AJ....162..298H |
| 10 | GMOS | Gemini North and South | The Gemini workhorse optical spectrograph, with nod-and-shuffle sky subtraction | Long-slit, multi-object and IFU modes; fills the Gemini gap; 45–50% peak throughput in spectroscopic mode | Hook et al. 2004, 2004PASP..116..425H |

## Second tier

These also fit the model, with a smaller gain, mostly because a present instrument already shows the same design.

Survey spectrographs
- LAMOST low-resolution spectrographs: 16 double-beam Schmidt spectrographs with VPH gratings, 250 fibers each, a 200
  mm beam (Zhu et al. 2006, 2006SPIE.6269E..0MZ; Cui et al. 2012, 2012RAA....12.1197C). The design overlaps DESI and
  4MOST; the survey's spectrum count should be sourced if this preset goes ahead.
- WEAVE on the WHT (Jin et al. 2024, 2024MNRAS.530.2688J) and MOONS on the VLT, 0.6–1.8 µm (Cirasuolo et al. 2020,
  2020Msngr.180...10C; current status to check).

Coudé and high-resolution extremes
- McDonald 2.7 m Tull coudé: a white-pupil echelle with a fused-silica prism cross-disperser and a folded Schmidt
  camera, R ≈ 60,000 (Tull et al. 1995, 1995PASP..107..251T).
- AAT UHRF: R ≈ 10⁶, the highest resolution of any optical astronomical spectrograph, built for cool interstellar
  clouds, with a new type of image slicer (Diego et al. 1995, 1995MNRAS.272..323D). This preset would mark the upper
  limit of R in the explorer.

Extreme-precision radial velocities
- KPF on Keck (Gibson et al. 2024, 2024SPIE13096E..09G), NEID on WIYN (Schwab et al. 2016, 2016SPIE.9908E..7HS),
  CARMENES at Calar Alto (Quirrenbach et al. 2014, 2014SPIE.9147E..1FQ) and HPF on the HET (Mahadevan et al. 2012,
  2012SPIE.8446E..1SM). HARPS and ESPRESSO already show the optical design; CARMENES and HPF add the near-infrared.
  The arcoat memo flagged a proprietary KPF vendor document: use only the published SPIE papers.

Near-infrared
- Keck NIRSPEC: cryogenic, diamond-machined metal optics, R = 25,000 with a 0.4″ slit (McLean et al. 1998,
  1998SPIE.3354..566M).
- CRIRES+ on the VLT (Dorn et al. 2023, 2023A&A...671A..24D).
- SINFONI on the VLT: an AO-fed slicer IFU, 32 × 32 spaxels, R up to 3300 (Eisenhauer et al. 2003,
  2003SPIE.4841.1548E); the Genzel group's Galactic Center S-star velocities came from SINFONI.
- KMOS on the VLT, 24 deployable IFUs (Sharples et al. 2013, 2013Msngr.151...21S).

Other facility gaps
- Subaru HDS (Noguchi et al. 2002, 2002PASJ...54..855N); LBT MODS (Pogge et al. 2010, 2010SPIE.7735E..0AP); SALT RSS,
  all-transmissive with VPH gratings and fused silica, CaF₂ and NaCl optics for the ultraviolet, R = 500–12,500
  (Burgh et al. 2003, 2003SPIE.4841.1463B); HST STIS, whose CCD covers 305–1000 nm (Woodgate et al. 1998,
  1998PASP..110.1183W).

Historical workhorses with a thin optical record
- MMT Blue Channel (Angel, Hilliard & Weymann 1979, 1979SAOSR.385...87A; corrected 2026-11-18: Schmidt et al. 1989,
  1989PASP..101..713S, describes the CCD channel that became the Red Channel); Lick Kast (a Lick technical report, not in ADS); the
  CfA Z-machine of the CfA Redshift Survey (Latham 1982, 1982ASSL...92..259L) and the CfA Digital Speedometers behind
  HD 114762 b (Latham et al. 1989, 1989Natur.339...38L); Steward Medusa, commonly cited as the first fiber multi-object
  spectrograph, with 26 cluster redshifts from one exposure (Hill et al. 1980, 1980ApJ...242L..69H).
- Layouts for these may exist only as sketches or in technical reports, so each would carry the schematic tag.

## Candidates that need a new model feature

| Feature | Physics to add | Candidates |
|---|---|---|
| Prism as the main disperser | Refraction through one or more prisms near minimum deviation, with nonlinear dispersion and no orders; physics.js already traces prism trains for cross-dispersers | Slipher's prism spectrograph on the Lowell 24-inch refractor, the first nebular velocities (Slipher 1913, 1913LowOB...2...56S; 1917, 1917PAPhS..56..403S); Humason's spectrograph on the Mt Wilson 100-inch, with the f/0.59 Rayton camera objective (Rayton 1930, 1930ApJ....72...59R; Hubble & Humason 1931, 1931ApJ....74...43H; the disperser and Humason's use of the Rayton lens still need confirming); the NIRSpec prism (R = 30–330 over 0.6–5.3 µm) |
| Immersion grating | The grating equation inside a medium of index n, so a given beam size yields n times the resolving power; needs n(λ, T) for silicon | IGRINS: a silicon immersion grating with VPH cross-dispersers per arm, R = 40,000, all of H and K in one exposure (Park et al. 2014, 2014SPIE.9147E..1DP; now on Gemini, status to confirm); iSHELL on the IRTF, a white-pupil design with R up to ~80,000 (Rayner et al. 2022, 2022PASP..134a5002R) |
| Lenslet IFU entrance | Pupil images from a lenslet array, with the dispersion tilted so the short spectra interleave on the detector | TIGER (Bacon et al. 1995, 1995A&AS..113..347B); SAURON on the WHT (Bacon et al. 2001, 2001MNRAS.326...23B); OSIRIS on Keck AO, two detector rows per spectrum, R = 3800 (Larkin et al. 2006, 2006SPIE.6269E..1AL) |
| Two-beam polarimetric entrance | Ordinary and extraordinary beams side by side on the slit, or two fibers | ESPaDOnS on CFHT (Donati 2003, 2003ASPC..307...41D); PEPSI on the LBT, R = 43,000, 120,000 or 270,000, waveguide image slicers and VPH-prism cross-dispersers (Strassmeier et al. 2015, 2015AN....336..324S); a link to the polarization memo |
| Slitless spectroscopy | Resolution set by the image size; an objective prism also places the disperser ahead of the telescope | Euclid NISP grisms (design paper still to find); HST WFC3 grisms; Gaia BP/RP prisms (De Angeli et al. 2023, 2023A&A...674A...2D) and RVS (Cropper et al. 2018, 2018A&A...616A...5C); the Harvard objective-prism plates of the Henry Draper work (CfA heritage) |

The prism feature pairs Slipher (1913) and NIRSpec (2022): both used prisms for faint-galaxy spectroscopy, a century
apart.

## Outside the model

Fourier transform spectrometers (the Kitt Peak McMath-Pierce FTS behind the solar flux atlases) and Fabry-Perot
imagers (TAURUS, the RSS etalons) do not disperse light onto a detector in the explorer's sense. Griffin's
photoelectric radial-velocity spectrometer (Griffin 1967, 1967ApJ...148..465G) replaces the detector with a physical
cross-correlation mask, the principle behind CORAVEL and ELODIE's cross-correlation reduction; the explorer could draw
the mask in the detector view, as a one-off.

## Sourcing notes

- For the historical tier, Hearnshaw (2009), Astronomical Spectrographs and their History (2009ash..book.....H), is
  the best single source; the old ApJ and Lowell papers are available as ADS scans.
- The 11-17 layout audit applies: choose instruments with a published layout figure, and tag a drawing built from a
  sketch or description as schematic.
- COL_AXIS: the Schmidt designs (AAOmega, LAMOST, VIRUS, and possibly the SDSS/BOSS collimator) need the on-axis check
  before they pass validate.js.
- All-arms groups: SDSS/BOSS, the Double Spectrograph, AAOmega, LAMOST, MODS, IGRINS.
- Each sourcing brief restates the privacy rule and treats downloads as untrusted data.
