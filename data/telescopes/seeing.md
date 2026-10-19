# Kolmogorov seeing relations for the long-exposure PSF -- sourced

Compiled 2026-10-19 for the instex long-exposure PSF, computed as FT[OTF_tel(s) x OTF_atm(s)] with s the pupil separation in metres. Each value carries a source key, the printed page, the saved-PDF page [PDF p. N], and a verbatim quote. The two ADS scans (SR90, C85) have no text layer: their quotes were transcribed from page renders and checked against tesseract OCR of 300 dpi renders. T02 and M10 quotes were checked against pdftotext and a page render. Math is written in plain text; ' ... ' joins pieces that are not adjacent. **DERIVED** marks arithmetic done here, not printed in a source.

Page conventions: SR90 printed page = PDF page + 293; C85 = PDF page + 18; T02 = PDF page + 1155; M10 = PDF page + 4.

## Relations

| quantity | value | source | page | exact quote |
|---|---|---|---|---|
| phase structure function | D_phi(r) = 6.88 (r/r0)^(5/3) | SR90 Eq. (7) | p. 295 [PDF p. 2] | "For Kolmogorov turbulence at the near-field approximation, the phase structure function is given by the widely used expression (1) D_phi(xi, eta) = 6.88 (r/r_0)^5/3 (7) where r = sqrt(xi^2 + eta^2) and r_0 is Fried's seeing parameter." |
| phase structure function (same) | D_phi(r) = 6.88 (\|r\|/r0)^(5/3) | T02 Eq. (15), citing Roddier 1981 | p. 1163 [PDF p. 8] | "The standard theory based on the Kolmogorov turbulence model (Roddier 1981) leads to a relation between r0, the phase structure function D_phi(r), and the optical transfer function (OTF) T0(f) of a large telescope: D_phi(r) = 6.88(\|r\|/r0)^5/3, (15)" |
| long-exposure OTF = exp(-D/2) | T(r) = exp[-D_phi(r)/2] | SR90 Eq. (22), citing Roddier 1981 | pp. 297-298 [PDF pp. 4-5] | "It is related to the Fried seeing parameter via the atmospheric long exposure optical transfer function which, according to F. Roddier (1981), is given by T(r) = exp - D_phi(r)/2 (22) where D_phi is the phase structure function given in (7)." |
| long-exposure OTF = exp(-0.5 D) | T0(f) = exp[-0.5 D_phi(lambda f)], f in rad^-1 | T02 Eq. (16) | p. 1163 [PDF p. 8] | "T0(f) = exp[-0.5D_phi(lambda f)], (16) where f is the spatial frequency (in inverse radians) and lambda is the imaging wavelength." |
| long-exposure OTF with 3.44 printed | <M(f)> = A(f) exp{-[3.44 (lambda F f/r0)^(5/3)]}; A(f) = telescope MTF | C85 Eq. 5.2, attributed to Fried 1966 (C85 ref. 101) | p. 40 [PDF p. 22] | "Fried (101) chose to write Equation 3.18 in the form <M(f)>_t'->inf = A(f) exp{-[3.44(lambda F f/r0)^5/3]}. 5.2" (ref. 101, p. 53 [PDF p. 35]: "Fried, D. L. 1966. J. Opt. Soc. Am. 56: 1372-79") |
| OTF in pupil separation (for instex) | OTF_atm(s) = exp[-3.44 (s/r0)^(5/3)], s = lambda f (m) | **DERIVED** | -- | 0.5 x 6.88 = 3.44 (SR90 Eqs. 7 + 22; T02 Eqs. 15 + 16, with s = lambda f); C85 Eq. 5.2 prints 3.44 directly (image-plane frequency f, focal length F, so s = lambda F f) |
| r0 definition (Fried's resolution) | r0 = diameter whose diffraction-limited resolution equals the long-exposure resolution | C85 Eqs. 3.21-3.23 (Fried 1966) | p. 26 [PDF p. 8] | "Fried (101) chose to use a measure of resolution R, defined as R = integral M(f) df, 3.21 and showed that its maximum R_max could be written as R_max = (pi/4)(r0/lambda F)^2, 3.22 where r0 is used to normalize the parameter r in Equation 3.13 and is defined by D_W(r) = constant x (r/r0)^5/3. 3.23" |
| r0 definition (words) | same | M10 | p. 5 [PDF p. 1] | "It is traditionally characterised by the Fried parameter (r0) - the diameter of a telescope such that its diffraction-limited resolution equals the seeing resolution." |
| r0 from the C_N^2 profile | D_W(r) = 2.91 (2 pi/lambda)^2 r^(5/3) sec(omega) integral C_N^2 dz | C85 Eq. 5.1 | p. 36 [PDF p. 18] | "D_W(r) = 2.91(2 pi/lambda)^2 r^5/3 sec omega integral_zT^zm C_N^2(z) dz, 5.1 where omega is the angle between zenith and the viewing direction, z_T the telescope height, and z_m the height at which C_N^2 -> 0." |
| r0 from the C_N^2 profile | r0 = [0.423 k^2 sec(omega) integral C_N^2 dz]^(-3/5), k = 2 pi/lambda | **DERIVED** | -- | set C85 Eq. 5.1 equal to 6.88 (r/r0)^(5/3): 2.91/6.88 = 0.423 |
| FWHM of seeing disk | FWHM = 0.98 lambda/r0 | SR90 Eq. (23) (numerical, Dierickx 1988 software) | p. 298 [PDF p. 5] | "The FWHM of the corresponding point spread function was estimated numerically as a function of wavelength and r_0 using standard software (Dierickx, 1988): FWHM = 0.98 lambda/r_0. (23)" |
| FWHM of seeing disk | epsilon0 = 0.98 lambda/r0 | T02 Eq. (5) | p. 1158 [PDF p. 3] | "The FWHM epsilon0 of the long-exposure seeing-limited point-spread function (PSF) in large telescopes is computed with the standard formula: epsilon0 = 0.98lambda/r0 = 0.98(D/lambda)^0.2 (sigma_d^2/K)^0.6, (5)" |
| FWHM of seeing disk | epsilon0 = 0.976 lambda/r0 | M10 note 1 | p. 8 [PDF p. 4] | "The full expression for the FWHM of the Kolmorgorov PSF is epsilon0 = 0.976 lambda/r0." (sic, 'Kolmorgorov') |
| FWHM, numerical check | 0.9755 lambda/r0 | **DERIVED** (Hankel transform of exp[-3.44 u^(5/3)], pure Python, 30000-point trapezoid) | -- | agrees with M10's 0.976; 0.98 is the rounded value |
| wavelength scaling | r0 proportional to lambda^(6/5); epsilon0 proportional to lambda^(-1/5) | T02 | p. 1158 [PDF p. 3] | "Here lambda is the imaging wavelength; it is well known that r0 proportional to lambda^6/5 and epsilon0 proportional to lambda^-1/5." |
| wavelength scaling | r0 proportional to lambda^(6/5) | SR90 | p. 297 [PDF p. 4] | "the image motion varies as lambda^2 r_0^-5/3 which is independent of the wavelength (r_0 proportional to lambda^6/5)." |
| wavelength scaling | FWHM proportional to lambda^(-1/5) | SR90 Eq. (24) | p. 298 [PDF p. 5] | "FWHM proportional to lambda^-1/5 [sigma_star^2 cos gamma]^3/5. (24)" |
| wavelength scaling | r0 proportional to lambda^(6/5) | C85 Eq. 3.24 | p. 26 [PDF p. 8] | "The parameter r0 is a function of the integral in Equation 3.13 and is therefore a measure of atmospheric seeing quality, which varies as r0 proportional to lambda^6/5; 3.24" |

## Flags

- **Exact 6.88.** Fried's definition (C85 Eq. 3.22) fixes the coefficient. Setting the integral of exp[-(c/2)(s/r0)^(5/3)] over the 2-D frequency plane equal to (pi/4)(r0/lambda)^2 gives c = 2[(24/5) Gamma(6/5)]^(5/6) = 6.884 (**DERIVED**). So 6.88 and 3.44 are rounded values of 6.8839 and 3.4419.
- **Misprint in M10, p. 5 [PDF p. 1].** The article says "r 0 depends on wavelength (to the power -1/5) and airmass (to the power 3/5)". Those are the exponents for epsilon0 (FWHM proportional to lambda^-1/5 and to airmass^3/5). r0 itself goes as lambda^(6/5) (T02, SR90, C85) and as airmass^(-3/5). Use M10 only for the 0.976 coefficient and the definition in words.
- **The 0.98 is numerical, not analytic.** SR90 attributes the value to "Dierickx, P.: 1988, IMAQ 0.7, Diffraction Analysis Software Package, ESO, Nov. 1988" (SR90 reference list, p. 300 [PDF p. 7]), which is ESO software, not a paper. T02 (p. 1163) says "There is no analytic expression: the PSF must be computed numerically."
- **Half-energy diameter (not requested).** T02 Eq. (17), p. 1163, prints beta0 = 1.15 lambda/r0. The same pure-Python check gives 1.109 lambda/r0, and direct radial integration of the PSF agrees. Not investigated further. Do not use 1.15 without checking it.
- **C85 notation.** C85 writes D_W, the *wave* structure function (phase plus log-amplitude). In the near-field, weak-scintillation case used here, D_W equals the phase structure function of SR90 and T02.

## Sources

| key | full reference | local file | URL |
|---|---|---|---|
| SR90 | Sarazin, M. & Roddier, F. 1990, "The ESO differential image motion monitor", A&A 227, 294-300 (ADS scan, image only) | `rawdata/seeing/SarazinRoddier1990_AA227_294.pdf` | https://articles.adsabs.harvard.edu/pdf/1990A%26A...227..294S |
| T02 | Tokovinin, A. 2002, "From Differential Image Motion to Seeing", PASP 114, 1156-1166, doi:10.1086/342683 (publisher PDF, free to read at IOP) | `rawdata/seeing/Tokovinin2002_PASP114_1156.pdf` | https://iopscience.iop.org/article/10.1086/342683/pdf |
| C85 | Coulman, C. E. 1985, "Fundamental and applied aspects of astronomical 'seeing'", ARA&A 23, 19-57, doi:10.1146/annurev.aa.23.090185.000315 (ADS scan, image only) | `rawdata/seeing/Coulman1985_ARAA23_19.pdf` | https://articles.adsabs.harvard.edu/pdf/1985ARA%26A..23...19C |
| M10 | Martinez, P., Kolb, J., Sarazin, M. & Tokovinin, A. 2010, "On the Difference between Seeing and Image Quality: When the Turbulence Outer Scale Enters the Game", The Messenger 141, 5-8 (ADS 2010Msngr.141....5M) | `rawdata/seeing/Martinez2010_Msngr141_5.pdf` | https://www.eso.org/sci/publications/messenger/archive/no.141-sep10/messenger-no141-5-8.pdf |

## Not found (primary sources not obtained)

- **Fried, D. L. 1966, JOSA 56, 1372** (doi:10.1364/JOSA.56.001372). The Optica site returns a Radware captcha, the author-uploaded ResearchGate copy returns 403, and Semantic Scholar lists the paper as closed access. Its content enters here only through C85 (Eqs. 3.18, 3.21-3.23, 5.2, citing "Fried (101)" = Fried 1966).
- **Roddier, F. 1981, Progress in Optics 19, 281** (doi:10.1016/S0079-6638(08)70204-X). Elsevier paywall; ADS has no scan; no open copy found. Its relations enter here only through SR90 Eq. (22) and T02 Eqs. (15)-(16), both of which cite it (Roddier is an author of SR90).
- **Dierickx, P. 1992, J. Mod. Opt. 39, 569** (doi:10.1080/09500349214550551). Taylor & Francis paywall; not obtained. SR90 instead credits the 0.98 to Dierickx's 1988 ESO software.
- **Fried, D. L. 1965, JOSA 55, 1427.** Optica only (same captcha); not obtained.
