# Radio-interferometry relations for the instex Interferometer mode -- sourced

Compiled 2026-10-20 for the instex INTERFEROMETER mode (uv coverage from antenna positions, Earth-rotation tracks, gridded weights, dirty beam, dirty image). Format follows `data/telescopes/seeing.md`. Every relation carries a source key, the printed page, the saved-file page [PDF p. N] (or [PS p. N] for the PostScript thesis; HTML pages have no page), and a verbatim quote. Math is written in plain text; ' ... ' joins pieces that are not adjacent in the saved file's text (a display equation counts as its own piece). **DERIVED** marks algebra or arithmetic done here (steps shown), not printed in a source. Downloaded files are saved unmodified under `rawdata/interf/formulas/`.

How the quotes were checked (machine check at the end): the TMS chapter PDFs have a text layer, but the math fonts carry no Unicode map, so pdftotext writes '=' as 'D', '+' as 'C', drops minus signs, and turns delta into a dotless i and parentheses into '.' and '/'. TMS math was therefore transcribed from page renders (110-170 dpi) and then machine-checked on letters and digits only, with 'C' and 'D' removed from both sides ("alnum" mode), or term by term ("terms" mode: every term of three or more letters and digits between = + - , ; [ ] ( ) / must occur on the page in the same order, within a window of three times the quote length; used only for the glyph-damaged TMS math, the scans and the PostScript thesis). Neither mode can see minus signs, primes or one- and two-character exponents, so those were checked on the renders; a "terms(1)" or "terms(2)" result means the check of that equation rests mainly on the render. Prose was checked with whitespace, hyphens and dashes removed ("text" mode). The two ADS scans (BSS99, P99) have no text layer: prose was checked against tesseract OCR of 300 dpi renders (fuzzy ratio, "ocr" mode) and their equations against the renders only ("render"). The Briggs thesis is a 1995 dvips PostScript file: prose was checked against the string literals pulled out of the file by a pure-text parser, which does not run the PostScript. Its equations on pp. 58-62 were transcribed from a Ghostscript render (`gs -dSAFER`, pages 58-62 cut out of the file). Ghostscript does interpret the PostScript, so that render is the one step that ran the downloaded file; a second render was refused by the session's permission rules (see Flags). The check column says "render" where the equation itself could only be checked visually.

Page conventions: TMS ch. 2 printed = PDF + 58; ch. 3 = PDF + 88; ch. 4 = PDF + 108; ch. 10 = PDF + 484; ch. 11 = PDF + 550. BSS99 = PDF + 126. P99 = PDF + 334. ALMA12 printed = PDF. B95: [PS p. N] = printed thesis page N.

## A. Baseline geometry and Earth-rotation tracks

| id | quantity | relation | source | page | exact quote | check |
|---|---|---|---|---|---|---|
| G1 | (X, Y, Z) axes | X toward (H = 0, δ = 0); Y toward (H = −6h, δ = 0), i.e. east; Z toward the north celestial pole | TMS Sec. 4.1 | p. 109 [PDF p. 1] | "A right-handed Cartesian coordinate system is used, where X and Y are measured in a plane parallel to the Earth’s equator, X in the meridian plane ... Y toward the east, and Z toward the north pole. In terms of hour angle H and declination δ, coordinates (X, Y, Z) are measured toward (H = 0, δ = 0), (H = −6h, δ = 0), and (δ = 90°), respectively." | auto |
| G2 | (u, v, w) from the baseline | u = X sin H + Y cos H; v = −X sin δ cos H + Y sin δ sin H + Z cos δ; w = X cos δ cos H − Y cos δ sin H + Z sin δ; (X, Y, Z) in wavelengths; (H, δ) of the phase centre | TMS Eq. (4.1) | pp. 109-110 [PDF pp. 1-2] | "If (X_λ, Y_λ, Z_λ) are the components ... of D_λ in the (X, Y, Z) system, the components (u, v, w) are given by ... [u; v; w] = [sin H, cos H, 0; −sin δ cos H, sin δ sin H, cos δ; cos δ cos H, −cos δ sin H, sin δ] [X_λ; Y_λ; Z_λ] . (4.1) ... Here (H, δ) are usually the hour angle and declination of the phase reference position." | auto |
| G3 | local survey (length D, elevation E, azimuth A, latitude L) to (X, Y, Z) | X = D (cos L sin E − sin L cos E cos A); Y = D cos E sin A; Z = D (sin L sin E + cos L cos E cos A) | TMS Eq. (4.4) | p. 111 [PDF p. 3] | "the usual practice is to determine the elevation E, azimuth A, and length of the baseline by field surveying techniques. ... For latitude L, using Eqs. (4.2) and (A4.2), we obtain ... [X; Y; Z] = D [cos L sin E − sin L cos E cos A; cos E sin A; sin L sin E + cos L cos E cos A] . (4.4)" | auto |
| G4 | azimuth convention | A measured from north through east | TMS App. 4.1 | p. 146 [PDF p. 38] | "Here, azimuth is measured from north through east." | auto |
| G5 | east/north/up form of G3 | with east = D cos E sin A, north = D cos E cos A, up = D sin E: X = −north sin L + up cos L; Y = east; Z = north cos L + up sin L | **DERIVED** | -- | substitute the three ENU components into TMS Eq. (4.4) term by term; check: a horizontal baseline due east (E = 0, A = 90°) gives (X, Y, Z) = (0, D, 0), i.e. +Y, matching G1 (derived_checks.py) | derived |
| G6 | uv track (ellipse) | u² + ((v − Z cos δ0)/sin δ0)² = X² + Y²; centre (0, Z cos δ0); semi-axes √(X² + Y²) along u and sin δ0 √(X² + Y²) along v (all in wavelengths; the radicals are elided in the quote because the text layer scatters them, and were read on the render) | TMS Eq. (4.5) | p. 112 [PDF p. 4] | "(H0, δ0) be the phase reference position. Then from Eq. (4.1), we have ... u² + ((v − Z_λ cos δ0)/sin δ0)² = X_λ² + Y_λ² . (4.5) ... In the (u, v) plane, Eq. (4.5) defines an ellipse ... with the semimajor axis equal to ... and the semiminor axis equal to sin δ0 ... as in Fig. 4.4a. The ... ellipse is centered on the v axis at (u, v) = (0, Z_λ cos δ0)." | auto |
| G7 | conjugate track | each baseline also samples (−u, −v), the mirror arc | TMS Sec. 4.1 | p. 113 [PDF p. 5] | "Since V(−u, −v) = V*(u, v), any observation supplies simultaneous measurements on two arcs, which are part of the same ellipse only if Z_λ = 0." | auto |
| G8 | source elevation and azimuth | sin E = sin L sin δ + cos L cos δ cos H; cos E cos A = cos L sin δ − sin L cos δ cos H; cos E sin A = −cos δ sin H | TMS Eq. (A4.1) | p. 146 [PDF p. 38] | "For an observer at latitude L, they are, for (H, δ) to (A, E), ... sin E = sin L sin δ + cos L cos δ cos H ... cos E cos A = cos L sin δ − sin L cos δ cos H (A4.1) ... cos E sin A = −cos δ sin H ," | auto |
| G9 | sign of H in the east | H < 0 for a source east of the meridian | TMS Fig. 4.3 caption | p. 112 [PDF p. 4] | "Note that with S in the eastern half of the observer’s sky, as shown, H and ψp are negative." | auto |
| G10 | consistency of G2, G3, G8 | a unit baseline pointing at the source (E, A from G8 put into G3) gives (u, v, w) = (0, 0, 1); the G2 matrix is orthonormal; Eq. (A4.2) inverts (A4.1); w = baseline · ŝ with ŝ = (cos δ cos H, −cos δ sin H, sin δ); G6 holds | **DERIVED** | -- | derived_checks.py, 2000 random (L, H, δ): largest error 4e-15 in every test | derived |
| G11 | hour-angle rate (as printed in TMS) | dH/dt = ωe; printed value 7.29115 × 10^−15 rad s^−1 (misprint, see Flags) | TMS, text after Eq. (4.9) | p. 115 [PDF p. 7] | "where ωe = dH/dt = 7.29115 × 10^−15 rad s^−1 = ωe is the rotation velocity of the Earth with respect to the fixed stars: for greater accuracy, see Seidelmann (1992)." (sic) | auto |
| G12 | Earth rotation rate (use this) | Ω = 7.292 115 0(1) × 10^−5 rad s^−1 | IERS (EOP Product Centre table, citing IERS Numerical Standards, IAG 1999) | table 'Earth's rotation constants' | "Mean angular velocity of the Earth ... 7.292 115 0(1) ... 10 -5 rad/s ... IERS Numerical Standards" | auto |
| G13 | sidereal day from G12 | 2π/Ω = 86164.09 s | **DERIVED** | -- | 2π / 7.2921150e-5 = 86164.09 s | derived |

## B. Visibility, dirty image and dirty beam

| id | quantity | relation | source | page | exact quote | check |
|---|---|---|---|---|---|---|
| V1 | visibility, small field | V(u, v) = ∫∫ A_N(l, m) I(l, m) / √(1 − l² − m²) exp[−j2π(ul + vm)] dl dm (w term neglected) | TMS Eq. (3.9) | p. 94 [PDF p. 6] | "If l and m are small enough that the term ... can be neglected, Eq. (3.7) becomes ... V(u, v, w) ≃ V(u, v, 0) = ∫∫ A_N(l, m) I(l, m) / √(1 − l² − m²) e^(−j2π(ul+vm)) dl dm . (3.9)" | auto |
| V2 | inverse relation = van Cittert-Zernike | A_N I / √(1 − l² − m²) = ∫∫ V(u, v) exp[+j2π(ul + vm)] du dv | TMS Eq. (3.10) | p. 94 [PDF p. 6] | "and for the inverse transform, we can write ... A_N(l, m) I(l, m) / √(1 − l² − m²) = ∫∫ V(u, v) e^(j2π(ul+vm)) du dv . (3.10) ... Equation (3.10) is a form of the van Cittert–Zernike theorem, which originated in optics and is discussed in Sect. 15.1.1." | auto |
| V3 | small field with A ≈ 1 | V(u, v) = ∫∫ I(l, m) exp[−j2π(ul + vm)] dl dm | TMS Eq. (10.48) | p. 511 [PDF p. 27] | "We consider the case of the small field of view (l, m ≪ 1, A(l, m) ≃ 1), where the transform between image intensity and visibility given in Eqs. (3.7) and (3.10) can be written as ... V(u, v) = ∫ I(l, m) e^(−j2π(ul+vm)) dl dm (10.48)" | auto |
| V4 | sign convention | minus sign for sky to visibility, plus sign for the inverse | TMS ch. 3 footnote 1 | p. 91 [PDF p. 3] | "we use the negative exponent to derive the complex visibility function (or mutual coherence function) from the intensity distribution, and the positive exponent for the inverse operation." | auto |
| V11 | orientation of u, v and l, m | u toward east, v toward north; (l, m) are direction cosines along u and v | TMS Sec. 3.1.1 | pp. 91-92 [PDF pp. 3-4] | "The spacing component v is measured toward the north as defined by the plane through the origin, the source, and the pole, and u is measured toward the east. ... On Fourier transformation, the phase reference position becomes the origin of the derived intensity distribution I(l, m), where l and m are direction cosines measured with respect to the axes u and v." | auto |
| V5 | measured visibility, dirty image, dirty beam | V_meas = W w V; I_meas = I ∗∗ b0; b0 = FT of W w ("dirty beam") | TMS Eqs. (10.4)-(10.6) | p. 490 [PDF p. 6] | "The measured visibility V_meas(u, v) can be written ... V_meas(u, v) = W(u, v) w(u, v) V(u, v) , (10.4) ... where W(u, v) is the transfer function or spatial sensitivity function introduced in Sect. 5.3, and w(u, v) represents any applied weighting. The Fourier transform of Eq. (10.4) is the measured intensity distribution (i.e., the image), which is ... I_meas(l, m) = I(l, m) ∗∗ b0(l, m) , (10.5) ... where the double asterisk indicates two-dimensional convolution, and b0 is the synthesized beam, which is the Fourier transform of the weighted transfer function: ... b0(l, m) ⟷ W(u, v) w(u, v) , (10.6) ... b0(l, m) is also known as the point-source response function or the dirty beam" | auto |
| V6 | dirty image as a direct sum | I_meas(l, m) = Σ_i w_i [V(u_i, v_i) e^(+j2π(u_i l + v_i m)) + V(−u_i, −v_i) e^(−j2π(u_i l + v_i m))] | TMS Eq. (10.7) | p. 490 [PDF p. 6] | "If the antennas are identically polarized and the source is unpolarized, the direct Fourier transform of these data is represented by ... I_meas(l, m) = Σ_{i=1}^{n_d} w_i [V_meas(u_i, v_i) e^(j2π(u_i l+v_i m)) + V_meas(−u_i, −v_i) e^(−j2π(u_i l+v_i m))] . (10.7)" | auto |
| V7 | dirty image (lecture form) | I^D = ∫∫ S V′ e^(2πi(ul+vm)) du dv | BSS99 Eq. (7-2) | p. 128 [PDF p. 2] | "I^D(l, m) ≡ ∫∫ S(u, v) V′(u, v) e^(2πi(ul+vm)) du dv . (7-2)" | render |
| V8 | (prose for V7) | S = sampling function, V′ = observed visibility | BSS99 | p. 128 [PDF p. 2] | "The so-called ‘dirty image’ that results is a discrete approximation to I^D, where (from Lecture 1, Eq. 1-10) ... Here, S denotes the (u,v) sampling function and V′ the observed visibility; the prime indicates that the visibility data are noise-corrupted measurements." | auto |
| V9 | sampling function and convolution theorem | S = Σ_k δ(u − u_k, v − v_k); V^S = S V′; I^D = 𝔉(S V′) = 𝔉S ∗ 𝔉V′ | BSS99 Eqs. (7-4)-(7-7) | p. 129 [PDF p. 3] | "S(u, v) = Σ_{k=1}^{M} δ(u − u_k, v − v_k) . (7-4) ... V^S(u, v) ≡ Σ_{k=1}^{M} δ(u − u_k, v − v_k) V′(u_k, v_k) . (7-5) ... I^D = 𝔉V^S = 𝔉(SV′) . (7-6) ... I^D = 𝔉S ∗ 𝔉V′ , (7-7)" | render |
| V10 | dirty beam = FT of the sampling function | B = 𝔉S; observed brightness = true brightness ∗ B | BSS99 | p. 130 [PDF p. 4] | "So the point source response of the array, i.e., the synthesized beam, is given by B = 𝔉S ∗ δ = 𝔉S. Equation 7-7 is the familiar result (Lecture 1, Eq. 1-11) that the observed brightness is the true brightness convolved with this ‘beam’." | auto |

## C. Weighting (natural, uniform, Briggs robust)

| id | quantity | relation | source | page | exact quote | check |
|---|---|---|---|---|---|---|
| W1 | natural weighting | equal weights for equal variances (in general, weight = 1/σ²) | TMS Sec. 10.2.2 | p. 491 [PDF p. 7] | "If the data are obtained with a uniform array of antennas and receivers, and the averaging time is the same for all data points, then the variances should all be the same, and maximum signal-to-noise ratio is obtained by including all measurements with the same weight. This is known as natural weighting." | auto |
| W2 | uniform weighting | w ∝ 1/ρ(u, v), ρ = local area density of samples | TMS Sec. 10.2.2 | p. 491 [PDF p. 7] | "The area density ρσ(u, v) can be defined such that the number of points in the range u ± ½du, v ± ½dv is ρσ(u, v)du dv (Thompson and Bracewell 1974). ... With w(u, v) proportional to 1/ρσ(u, v), the effective density of the data is uniform within a circle of radius u_max determined by the maximum spacing." | auto |
| W3 | natural and uniform density weights | D_k = 1 (natural); D_k = 1/N_s(k) (uniform) | BSS99 Eqs. (7-11), (7-12) | p. 133 [PDF p. 7] | "D_k = 1 , called natural weighting, (7-11) and D_k = 1/N_s(k) , called uniform weighting, (7-12)" | render |
| W4 | (prose for W3) | N_s(k) = number (or reliability-weight sum) of samples in a box or circle of width s around sample k | BSS99 | pp. 133-134 [PDF pp. 7-8] | "where N_s(k) is the number of data points within a symmetric region of the (u, v) plane, of characteristic width s, centered on the kth data point. (s might be the radius of a circle or the width of a square.) ... In the case where different points have different reliability weights R_k, the N_s(k) is usually replaced by the total reliability weightsum in that same region." | auto |
| W5 | natural (thesis) | T_k = D_k = 1; inverse-variance weights | B95 Sec. 3.3 | p. 40 [PS p. 40] | "As with a simple weighted mean, the very best one can do from a signal-to-noise standpoint is to weight all visibility samples with their inverse variance. ... This is natural weighting, and is achieved by setting T_k = D_k = 1." | auto |
| W6 | uniform (thesis) | D_k = const / Σ_{k∈c_pq} w_k (gridded weight sum in cell pq) | B95 Eq. (3.9) (equation not visually checked, see Flags) and Eq. (3.13) limit | p. 44 [PS p. 44]; p. 59 [PS p. 59] | "This is uniform weighting, the name coming from the fact that the gridded weights are as uniform as is possible. ... Clearly when S = 0 this recovers the natural weighting D_k = const and when S → ∞ we recover uniform weighting D_k ∝ 1/Σ_k w_k." | auto |
| W7 | robust weighting, origin | gridded weight W_pq ∝ 1/(S² + 2σ²_pq) | B95 Eq. (3.12) | p. 58 [PS p. 58] | "W_pq ∝ 1/(S² + 2σ²_pq) (3.12)" | render |
| W8 | (prose for W7) | S ≫ σ: uniform; S ≪ σ: natural | B95 | p. 58 [PS p. 58] | "This is the essence of robust weighting. ... then the dirty image we are minimizing over looks very much like the dirty beam. ... approaches a constant and we recover uniform weighting. ... then we are essentially minimizing over an image of random noise, ... and we recover natural weighting." | auto |
| W9 | robust density weight | D_k = const / (S² Σ_{k∈c_pq} w_k + 2ΔS²_uw) if Σ w_k > 0, else 0 | B95 Eq. (3.13) | p. 59 [PS p. 59] | "D_k = { const / (S² Σ_{k∈c_pq} w_k + 2ΔS²_uw)   Σ_{k∈c_pq} w_k > 0 ; 0   otherwise } (3.13)" | render |
| W10 | normalized robustness R | S² = (w̄_pq)^−1 (5 · 10^−R)²; w̄_pq = (1/N_vis) Σ_{j=1}^{N_vis} Σ_{k∈c_pq} w_k | B95 Eqs. (3.15), (3.16) | p. 61 [PS p. 61] | "The definition of R is S² = (w̄_pq)^−1 (5 · 10^−R)² (3.15) where w̄_pq = (1/N_vis) Σ_{j=1}^{N_vis} Σ_{k∈c_pq} w_k (3.16)" | render |
| W11 | (prose for W10) | R = +2 near natural, R = −2 near uniform | B95 Sec. 3.6.2 | p. 61 [PS p. 61] | "The final result is a normalized robustness parameter, R, which produces something close to natural weighting (most robust against striping) at a value of R = +2, something close to uniform weighting at R = −2, and some intermediate weighting at R = 0." | auto |
| W12 | average weight, form used in code | w̄_pq ≈ Σ_{p,q} (Σ_{k∈c_pq} w_k)² / Σ_{j=1}^{N_vis} w_j | B95 Eq. (3.17) | p. 62 [PS p. 62] | "w̄_pq ≈ Σ_{p,q} (Σ_{k∈c_pq} w_k)² / Σ_{j=1}^{N_vis} w_j , (3.17)" | render |
| W13 | (prose for W12) | 3.16 averages over visibilities, not cells; 3.17 assumes equal snr weights | B95 | p. 62 [PS p. 62] | "is the average snr weight sum over visibilities, not over gridding cells. ... The SDE gridded routines actually use the simplified form ... which is derived from equation 3.16 via the additional approximation that all snr weights are equal. Either form should suffice in new implementations, though which ever choice is used should be well documented." | auto |
| W14 | natural (CASA) | w_i = ω_i = 1/σ_i²; weights summed per cell when gridded | CASA tclean docs, 'Data Weighting' | -- | "For weighting=’natural’, visibilities are weighted only by the data weights, which are calculated during filling and calibration and should be equal to the inverse noise variance on that visibility. Imaging weight \(w_i\) of sample \(\dot\imath\) is given by: \(w_i = \omega_i = \frac{1}{{\sigma_i}^2}\) ... When data is gridded into the same uv-cell for imaging, the weights are summed, and thus a higher uv density results in higher imaging weights." | auto |
| W15 | uniform (CASA) | W_k = gridded sum of ω_i in cell k; w_i = ω_i / W_k | CASA tclean docs, 'Data Weighting' | -- | "For uniform weighting, we first grid the inverse variance \(\omega_i\) for all selected data onto a grid with uv cell-size given by 2 ∕ FOV, where FOV is the specified field of view (defaults to the image field of view). This forms the gridded weights \(W_k\). The weight of the \(\dot\imath\)-th sample is then: \(w_i = \frac{\omega_i}{W_k}\)" | auto |
| W16 | Briggs robust (CASA; use this form) | w_i = ω_i / (1 + W_k f²); f² = (5 × 10^−R)² / (Σ_k W_k² / Σ_i ω_i); W_k = Σ of ω over cell k | CASA tclean docs, 'Briggs weighting' | -- | "The actual weighting scheme used is: \(w_i = \frac{\omega_i}{1 + W_k f^2}\) ... \(W_k = \Sigma_{cell=k}\,\omega_{k}\) is the weight density of a given cell \(k\) (with \(\omega_{k}\) the weight of a uv point that falls in cell \(k\)). ... \(f^2 = \frac{(5 \times 10^{-\text{R}})^2}{\frac{\Sigma_k W_k^2}{\Sigma_i \omega_i}}\); ... The robust R takes value between -2.0 (close to uniform weighting) to 2.0 (close to natural)." | auto |
| W17 | Briggs neighbourhood (CASA) | default npixels = 0 means one cell | CASA tclean docs | -- | "While for weighting=’briggs’ the default npixels=0 results in npixels=1, superuniform weighting can be approached by setting npixels=3 and robust=-2 while using Briggs (but not Briggsabs) weighting." | auto |
| W18 | CASA form from the thesis | divide Eq. (3.13) by 2ΔS²_uw: D_k = const′ / (1 + W_k f²) with W_k = Σ_{k∈c_pq} w_k and f² = S²/(2ΔS²_uw); Eq. (3.15) gives this normalized S² as (5 · 10^−R)²/w̄_pq, and Eq. (3.17) gives w̄_pq = Σ W_k² / Σ_j w_j; so w_i = ω_i D_k = ω_i/(1 + W_k f²) with f² = (5 · 10^−R)² / (Σ_k W_k² / Σ_i ω_i), i.e. W16 | **DERIVED** | -- | reading Eq. (3.15)'s normalized S² as S²/(2ΔS²_uw) is an interpretation (the thesis example on p. 61, S = (2/w_targ)^(1/2) ΔS_uw, uses the same scaling); limits: f → 0 gives w_i = ω_i (natural), f → ∞ gives w_i ∝ ω_i/W_k (uniform), as in W6 | derived |
| W19 | TMS version of robust weighting | w_ik = 1/(S² + σ²_ik); S² = (5 × 10^−R)²/w̄; w̄ = (1/n_c) Σ 1/σ²_ik (see Flags: differs from B95/CASA) | TMS Eqs. (10.12)-(10.14) | p. 495 [PDF p. 11] | "The weighting of cell (i, k) in the (u, v) plane whose visibility has an rms error of σ_ik is specified as ... w_ik = 1/(S² + σ_ik²) , ... (10.12) ... where S is a parameter defined by ... S² = (5 × 10^−R)²/w̄ . (10.13) ... R is the robustness factor, and w̄ is the average variance weighting factor over the n_c cells in the image, ... w̄ = (1/n_c) Σ 1/σ_ik² . (10.14)" | auto |

## D. Closed-form visibilities of simple sources

θ is the FWHM (Gaussian) or the diameter (disc, ring); q = √(u² + v²) in wavelengths; all amplitudes normalized to V(0) = 1.

| id | quantity | relation | source | page | exact quote | check |
|---|---|---|---|---|---|---|
| M1 | Hankel transform for circular sources | F(ρ) = 2π ∫_0^∞ f(r) J0(2πrρ) r dr, ρ = √(u² + v²) | P99 Eq. (16-20) | p. 353 [PDF p. 19] | "F(ρ) = 2π ∫_0^∞ f(r) J0(2πrρ) r dr (16-20)" | render |
| M2 | (prose for M1-M5) | expressions are for unit-flux circular components | P99 Sec. 7.2 | p. 353 [PDF p. 19] | "All the expressions are for a circularly symmetric component f(r) centered at the origin of the (l,m) coordinate system, with ... The relationship between f(r) and F(ρ) is a Hankel transform:" | auto |
| M3 | point source | V = 1 | P99 Eqs. (16-21), (16-22) | p. 353 [PDF p. 19] | "f(x, y) = δ(x, y), (16-21) ... F(u, v) = 1. (16-22)" | render |
| M4 | circular Gaussian, FWHM θ | V = exp[−(πθq)²/(4 ln 2)] = exp[−π²θ²q²/(4 ln 2)] | P99 Eqs. (16-23), (16-24) | p. 353 [PDF p. 19] | "f(r) = (1/(√(π/4 ln 2) a)) exp(−4 ln 2 r²/a²) (16-23) ... F(ρ) = exp(−(πaρ)²/(4 ln 2)) , (16-24) ... where a = full width to half-maximum intensity (FWHM)." | render |
| M5 | uniform disc, diameter θ | V = 2 J1(πθq)/(πθq) | P99 Eqs. (16-25), (16-26) | p. 353 [PDF p. 19] | "f(r) = { 4/(πa²), if r ≤ a/2 ; 0, otherwise } (16-25) ... F(ρ) = 2J1(πaρ)/(πaρ) , (16-26) ... where a = diameter." | render |
| M6 | thin ring, diameter θ | V = J0(πθq) | P99 Eqs. (16-29), (16-30) | p. 354 [PDF p. 20] | "f(r) = (1/(πa)) δ(r − a/2), (16-29) ... F(ρ) = J0(πaρ), (16-30) ... where a = diameter." | render |
| M7 | (prose for M4-M6) | a = FWHM (Gaussian) or diameter (disc, sphere, ring) | P99 | pp. 353-354 [PDF pp. 19-20] | "where a = full width to half-maximum intensity (FWHM). ... where a = diameter. ... Ring (The brightness is zero except on the circumference.)" | auto |
| M8 | Gaussian (TMS) | I = I0 exp[−r²/(2a²)], FWHM θ_G = √(8 ln 2) a; V = S0 exp[−2π²a²q²] × phase; S0 = 2π I0 a² | TMS Eqs. (10.50), (10.51) | p. 511 [PDF p. 27] | "A simple common source model is a Gaussian intensity distribution centered at position (l1, m1) with peak intensity I0 and width parameter a: ... I(l, m) = I0 exp[(−(l − l1)² − (m − m1)²)/(2a²)] , (10.50) ... which has FWHM, θG, of √(8 ln 2) a. The corresponding model visibility distribution is ... V_m(u, v) = S0 e^(−2π²a²(u²+v²)−j2π(ul1+vm1)) , (10.51) ... where S0 = 2πI0a², the total flux density." | auto |
| M9 | TMS Table 10.2 rows (delta, ring, disk, Gaussian) | ring δ(r − a): V/I0 = J0(2πaq); disk Π(r/a): V/I0 = πa² J1(2πaq)/(πaq); Gaussian: V/I0 = 2πa² e^(−2π²a²q²) | TMS Table 10.2 | p. 517 [PDF p. 33] | "Delta function δ(r) – 1 ... Ring δ(r − a) 2a J0(2πaq) 1 π²a² ... Disk Π(r/a) 2a πa² J1(2πaq)/(πaq) πa² (π²/2)a² ... Gaussian e^(−r²/2a²) √(8 ln 2) a 2πa² e^(−2π²a²q²) 2πa² 2π²a²" | render |
| M10 | normalized forms in θ | Gaussian: a = θ/√(8 ln 2) in TMS 10.51 gives 2π²a²q² = π²θ²q²/(4 ln 2); disc: a = θ/2 in TMS Table 10.2 gives J1(πθq)/(πθq/2) = 2J1(πθq)/(πθq); ring: a = θ/2 gives J0(πθq); all agree with P99 (a = θ there) | **DERIVED** | -- | derived_checks.py: numerical Hankel transforms of a θ = 1 Gaussian and disc agree with the closed forms to 6 decimals at q = 0.3-2.5; ring is analytic (2π ∫ δ(r − θ/2) J0(2πqr) r dr = πθ J0(πθq)) | derived |

## E. Fringe spacing, resolution, largest recoverable scale

| id | quantity | relation | source | page | exact quote | check |
|---|---|---|---|---|---|---|
| S1 | two-element fringe | F = cos(2πDl/λ), l = sin θ | TMS Eq. (2.3) | p. 60 [PDF p. 2] | "leaving the fringe function ... F = cos 2πντg = cos(2πDl/λ) , (2.3) ... where l = sin θ" | auto |
| S2 | fringe spacing | period in l = λ/D (projected baseline) | **DERIVED** | -- | the argument of S1 grows by 2π when l grows by λ/D; with u = D cos θ0/λ (S4) the period is 1/u rad, as in TMS Eq. (2.14), F(l) = cos(2πul) | derived |
| S3 | fringe spacing (stated) | Δθ = λ/(b sin θ) | ERA Sec. 3.7 | -- | "The fringe period Δϕ=2π corresponds to an angular shift Δθ=λ/(b sin θ)." | auto |
| S4 | spatial frequency u | u = D cos θ0/λ = ν0 D cos θ0/c (projected baseline in wavelengths) | TMS Eqs. (2.13), (2.14) | p. 66 [PDF p. 8] | "When observing a source at any position in the sky, the angular resolution of the fringes is determined by the length of the baseline projected onto a plane normal to the direction of the source. ... u is measured in wavelengths, λ, at the center frequency ν0, that is, ... u = D cos θ0/λ = ν0 D cos θ0/c . (2.13) ... F(l) = cos(2πν0τ) = cos(2πul) , (2.14)" | auto |
| S5 | resolution vs longest baseline | θ ≈ λ/b_max | ERA Sec. 3.7 | -- | "The angular resolution of an interferometer with maximum baseline b is ≈λ/b and the angular resolution of the single dish with diameter D is ≈λ/D" | auto |
| S6 | resolution vs longest baseline | θ_b ≈ 1/(D_λ)max | TMS Sec. 3.1.1 | p. 95 [PDF p. 7] | "Also, if the spatial frequencies measured are evenly distributed out to the maximum spacing, the synthesized beamwidth θb is approximately equal to (D_λ)max^−1." | auto |
| S7 | resolution, with weighting factor | θ_res ≈ k λ/L_max, k ~ 1 (0.7-1.2 by weighting); ALMA empirical θ_res ≈ 0.574 λ/L80 | ALMA12 Eqs. (3.27), (7.3), (7.4) | p. 25 [PDF p. 25]; p. 93 [PDF p. 93] | "A handy formula for the approximate resolution provided by an interferometer is: ... Interferometer Resolution = θres ≈ k λ/Lmax , (3.27) ... where k is a factor that depends on the how the visibilities are weighted during inversion (typically ∼1; see Figure 7.5) and Lmax is the longest baseline in the array. ... For commonly used weighting schemes, k is typically in the range 0.7 < k < 1.2. ... 0.574λ ... θres ≈ ... [radians] (7.4) ... where again λ is the observing wavelength in meters, and L80 is the 80th percentile projected baseline uv-distance" | auto |
| S8 | resolution vs frequency (CASA) | PSF width θ_ν = 1/u_max rad | CASA docs, 'Wide Band Imaging: UV-Coverage' | -- | "As the observing frequency increases, the angular resolution for a given distribution of antennas increases (or, conversely the width of the point spread function given by \(\theta_{\nu} = 1/{u}_{max}\) radians, decreases)." | auto |
| S9 | uniform-coverage beam numbers | disc of radius u_max: beam J1(2πlu_max)/(πlu_max), FWHM 0.705/u_max, first sidelobe 13.2% | TMS Eq. (10.8) and text | pp. 491-492 [PDF pp. 7-8] | "The beam then closely approximates the Fourier transform of a circular disk function, which, normalized to unity at the maximum, is given by ... J1(2πlu_max)/(πlu_max) , (10.8) ... The full width of the beam at half-maximum (FWHM) is 0.705 u_max^−1, and the first sidelobe response is 13.2% of the main beam." | auto |
| S10 | check of S9 | 2J1(x)/x = 0.5 at x = 2.2151, FWHM = x/(π u_max) = 0.7051/u_max; first sidelobe −0.1323 at x = 5.136 | **DERIVED** | -- | derived_checks.py (Bessel integral, bisection) | derived |
| S11 | largest scale: why | baselines shorter than a dish diameter are missing | ALMA12 Sec. 3.6 | p. 25 [PDF p. 25] | "This insensitivity arises because interferometric arrays alone cannot sample spatial frequencies lower than those sampled by a baseline equal to an antenna diameter." | auto |
| S12 | largest scale: why (ERA) | same | ERA Sec. 3.7 | -- | "Because the antenna diameters D must be smaller than the baseline b (else the antennas would overlap), the angular frequency response cannot extend to zero and the interferometer cannot detect an isotropic source" | auto |
| S13 | largest recoverable scale vs shortest baseline | θ_MRS ≈ 0.6 λ/L_min (Gaussian criterion, Wilner & Welch 1994) | ALMA12 Eq. (3.28) | p. 25 [PDF p. 25] | "As a guideline, the interferometer image has a maximum recoverable scale given roughly by (see Section 7.6 for the operational MRS definition): ... Maximum Recoverable Scale = θM RS ≈ 0.6λ/Lmin , (3.28) ... where Lmin is the minimum baseline in the array configuration. Strictly speaking, for an input Gaussian visibility distribution of FWHM θM RS , the ratio of the brightness at source center of an image made by an array with Lmin to the same made with no central hole in its visibility sampling (i.e., no zero spacing problem) is 1/e" | auto |
| S14 | largest recoverable scale (operational) | shortest baseline measures scales of λ/L_min; ALMA uses θ_MRS ≈ 0.983 λ/L5 (5th-percentile uv distance) | ALMA12 Sec. 7.6, Eq. (7.6) | p. 100 [PDF p. 100] | "It is in principle determined by the length Lmin of the shortest baseline in the array, which measures spatial scales (i.e. Fourier modes with a period) of λ/Lmin . ... ALMA uses the 5th percentile shortest baseline L5 instead of the very shortest baseline Lmin to calculate θM RS ; using simulations of configurations the following equation was empirically determined: ... 0.983 λ ... θM RS ≈ ... [radians] (7.6) ... where λ is the observing wavelength in meters, and L5 is the 5th percentile of uv-distance in meters." | auto |

## F. Bandwidth: the uv point of one baseline scales with frequency

| id | quantity | relation | source | page | exact quote | check |
|---|---|---|---|---|---|---|
| B1 | u proportional to frequency | u = B/λ = Bν/c for a fixed projected baseline B | TMS Eq. (2.13) (S4) and **DERIVED** | p. 66 [PDF p. 8] | see S4: u = ν0 D cos θ0/c, so a channel at frequency ν samples the baseline at u(ν) = u(ν0) ν/ν0 | derived |
| B2 | per-channel uv | uv range grows across the band in proportion to frequency | TMS Sec. 10.5.2 | p. 527 [PDF p. 43] | "As discussed in Sect. 6.3, for observations with a spectral line (multichannel) correlator, the visibility measured for each channel can be expressed as a function of the (u, v) values appropriate for the frequency of the channel. This corrects the chromatic aberration but causes the (u, v) range over which the visibility is measured to increase over the bandwidth in proportion to the frequency." | auto |
| B3 | multifrequency synthesis | several frequencies fill the uv plane; each frequency adds its own samples | TMS Sec. 11.6 | pp. 578-579 [PDF pp. 28-29] | "Making observations at several different radio frequencies is an effective way of improving the sampling of the visibility in the (u, v) plane. This technique is referred to as multifrequency synthesis, or bandwidth synthesis. ... Each frequency used contributes a different set of delta functions." | auto |
| B4 | uv coverage changes with frequency (CASA) | baselines are measured in wavelengths | CASA docs, 'Wide Band Imaging: UV-Coverage' | -- | "Projected baseline lengths are measured in units of the observed wavelength. Therefore the \(uv\) coverage and the imaging properties of an interferometer change with frequency." | auto |

## Flags

- **TMS misprint in the Earth rotation rate (G11).** TMS p. 115 prints "7.29115 × 10^−15 rad s^−1". The exponent should be −5, and a digit is missing: the IERS mean value is 7.292 115 0 × 10^−5 rad s^−1 (G12). Use G12. **DERIVED:** 2π/Ω = 86164.09 s.
- **TMS robust weighting (W19) differs from Briggs and CASA.** (a) TMS averages w̄ over the n_c cells, (1/n_c) Σ 1/σ²_ik. Briggs Eq. (3.16) averages over visibilities and says explicitly "not over gridding cells" (W13). CASA uses the Eq. (3.17) form Σ_k W_k² / Σ_i ω_i (W16). (b) TMS Eq. (10.12) has S² + σ²_ik. Briggs Eq. (3.12) has S² + 2σ²_pq, where σ²_pq is the variance of each of the real and imaginary parts (B95 p. 58: "σ²_pq = ⟨Re²ε_pq⟩ = ⟨Im²ε_pq⟩", render check). The same R therefore gives different weights in the two forms. For instex, use W16 (CASA), which is the same as B95 Eqs. (3.13) + (3.15) + (3.17) (W18).
- **Briggs thesis renders.** B95 Eqs. (3.12), (3.13), (3.15)-(3.17) were read from a Ghostscript render of pp. 58-62 only. A second render, of pp. 40 and 44, was blocked by the session's permission rules. As a result, Eq. (3.9), the uniform-weighting density weight on p. 44, is known only from the PostScript string text ("D k = ... const . X k 2 c pq w k X k 2 c pq w k > 0 0 otherwise (3 : 9)") and was not checked visually. The uniform limit is confirmed on the rendered p. 59 (W6).
- **TMS Table 10.2, ring row.** The row lists I(r)/I0 = δ(r − a) and V(0)/I0 = 1. The plane integral of δ(r − a) is 2πa (**DERIVED**), so this row is normalized to unit flux, unlike the other rows (the disk row has V(0)/I0 = πa²). The normalized visibility J0(2πaq) is unaffected. The table's "FWHM" column gives 2a for the ring and the disk, which is the diameter, not a half-maximum width.
- **P99 Eq. (16-23), Gaussian prefactor.** The printed prefactor, 1/(√(π/4 ln 2) a), is the 1-D normalization. In 2-D, that f(r) integrates to a √(π/(4 ln 2)), not 1. The 2-D unit-flux prefactor is 4 ln 2/(π a²) (**DERIVED**, derived_checks.py). F(ρ) in Eq. (16-24) is normalized to F(0) = 1 and is unaffected.
- **Two ALMA largest-scale rules.** ALMA12 gives θ_MRS ≈ 0.6 λ/L_min (Eq. 3.28, from a Gaussian criterion credited to Wilner & Welch 1994) and the operational θ_MRS ≈ 0.983 λ/L5 (Eq. 7.6, empirical, using the 5th-percentile uv distance). Likewise θ_res ≈ k λ/L_max with k = 0.7-1.2 (Eq. 7.3) versus the empirical 0.574 λ/L80 (Eq. 7.4). These coefficients are rules of thumb tuned to ALMA configurations. Which one instex shows for an arbitrary array is a design choice for you to make.
- **CASA uniform weighting cell.** CASA states that the weights are gridded on cells of "2 ∕ FOV" (W15). This was not checked against the CASA source code. BSS99 (p. 134 footnote) says only that in AIPS++/miriad/SDE the box is set by a field-of-view parameter, and that an AIPS box of N corresponds to an FOV of 1/N.
- **Sign conventions agree.** TMS (V1-V4) uses j and the exponent e^(−j2π(ul+vm)) for sky to visibility. BSS99 (V7) uses i, with the + sign for the inverse. Both conventions are the same.
- **CASA page version.** The CASA quotes come from the "stable" CASAdocs page (the Colab link names casadocs commit 6e142b6), fetched 2026-10-20. That page changes over time; the saved HTML is the record.

## Machine check

DERIVED numerical checks: `/private/tmp/claude-501/-Users-cconroy-memos/604f8c8c-8c13-422b-815a-7d85a29a1a3e/scratchpad/formulas_agent/derived_checks.py` (pure Python, no inputs). Quote check script: `/private/tmp/claude-501/-Users-cconroy-memos/604f8c8c-8c13-422b-815a-7d85a29a1a3e/scratchpad/formulas_agent/check_quotes.py` (pure Python, `python3 -I`; reads this file, the saved PDFs via pdftotext, the OCR text of the scans, the PostScript string literals, and the tag-stripped HTML). Results are appended below by the script run of 2026-10-20. Negative test (`neg_test.py`): one quote in each of 12 rows (G2, G8, G11, G12, M7, M8, S7, S9, S14, W1, W8, W16) was altered (a digit, a sin/cos swap, a swapped pair of matrix elements, one word); all 12 were reported FAIL, and every other row still passed.

Run 2026-10-20 (`python3 -I check_quotes.py data/interf/formulas.md . <ocr dirs> --write`). One line per row: status, where the quote was looked up, and the mode that passed for each ' ... ' piece (text > alnum > ocr > terms; see the header). RENDER-ONLY = an equation from a scan or the PostScript thesis whose transcription was checked on the page render only.

```
G1   PASS           TMS ch4 PDF p.1          2 piece(s): text, alnum
G2   PASS           TMS ch4 PDF p.1,2        4 piece(s): alnum, alnum, terms(8), alnum
G3   PASS           TMS ch4 PDF p.3          3 piece(s): text, text, terms(5)
G4   PASS           TMS ch4 PDF p.38         1 piece(s): text
G5   derived (no quote)
G6   PASS           TMS ch4 PDF p.4          7 piece(s): alnum, alnum, alnum, text, alnum, text, alnum
G7   PASS           TMS ch4 PDF p.5          1 piece(s): alnum
G8   PASS           TMS ch4 PDF p.38         4 piece(s): alnum, alnum, alnum, alnum
G9   PASS           TMS ch4 PDF p.4          1 piece(s): alnum
G10  derived (no quote)
G11  PASS           TMS ch4 PDF p.7          1 piece(s): alnum
G12  PASS           IERS HTML                4 piece(s): text, text, text, text
G13  derived (no quote)
V1   PASS           TMS ch3 PDF p.6          3 piece(s): text, text, terms(1)
V2   PASS           TMS ch3 PDF p.6          3 piece(s): text, terms(2), text
V3   PASS           TMS ch10 PDF p.27        2 piece(s): alnum, alnum
V4   PASS           TMS ch3 PDF p.3          1 piece(s): text
V11  PASS           TMS ch3 PDF p.3,4        2 piece(s): text, alnum
V5   PASS           TMS ch10 PDF p.6         7 piece(s): alnum, alnum, alnum, alnum, text, alnum, alnum
V6   PASS           TMS ch10 PDF p.6         2 piece(s): text, terms(4)
V7   PASS (+render) BSS99 OCR p.2            1 piece(s): terms(1)
V8   PASS           BSS99 OCR p.2            2 piece(s): ocr(0.92), alnum
V9   RENDER-ONLY    BSS99 OCR p.3            4 piece(s): FAIL(no terms), FAIL(no terms), FAIL(no terms), FAIL(no terms)
V10  PASS           BSS99 OCR p.4            1 piece(s): ocr(0.96)
W1   PASS           TMS ch10 PDF p.7         1 piece(s): text
W2   PASS           TMS ch10 PDF p.7         2 piece(s): alnum, alnum
W3   RENDER-ONLY    BSS99 OCR p.7            1 piece(s): FAIL(ocr best 0.78; terms 3/3 present)
W4   PASS           BSS99 OCR p.7,8          2 piece(s): ocr(0.95), ocr(0.95)
W5   PASS           B95 PS p.40              2 piece(s): text, alnum
W6   PASS           B95 PS p.44,59           2 piece(s): text, terms(4)
W7   PASS (+render) B95 PS p.58              1 piece(s): alnum
W8   PASS           B95 PS p.58              5 piece(s): text, text, text, text, text
W9   PASS (+render) B95 PS p.59              1 piece(s): terms(4)
W10  PASS (+render) B95 PS p.61              1 piece(s): terms(6)
W11  PASS           B95 PS p.61              1 piece(s): text
W12  PASS (+render) B95 PS p.62              1 piece(s): terms(2)
W13  PASS           B95 PS p.62              3 piece(s): text, text, text
W14  PASS           CASA HTML                2 piece(s): text, text
W15  PASS           CASA HTML                1 piece(s): text
W16  PASS           CASA HTML                4 piece(s): text, text, text, text
W17  PASS           CASA HTML                1 piece(s): text
W18  derived (no quote)
W19  PASS           TMS ch10 PDF p.11        7 piece(s): alnum, terms(1), text, text, alnum, alnum, terms(2)
M1   PASS (+render) P99 OCR p.19             1 piece(s): terms(1)
M2   PASS           P99 OCR p.19             2 piece(s): ocr(0.94), ocr(0.90)
M3   RENDER-ONLY    P99 OCR p.19             2 piece(s): FAIL(no terms), text
M4   RENDER-ONLY    P99 OCR p.19             3 piece(s): FAIL(ocr best 0.00; terms 1/3 present), FAIL(ocr best 0.42; terms 1/2 present), text
M5   RENDER-ONLY    P99 OCR p.19             3 piece(s): FAIL(ocr best 0.66; terms 1/2 present), FAIL(ocr best 0.33; terms 0/1 present), text
M6   RENDER-ONLY    P99 OCR p.20             3 piece(s): FAIL(no terms), FAIL(no terms), text
M7   PASS           P99 OCR p.19,20          3 piece(s): text, text, text
M8   PASS           TMS ch10 PDF p.27        5 piece(s): alnum, alnum, alnum, alnum, alnum
M9   PASS (+render) TMS ch10 PDF p.33        4 piece(s): alnum, alnum, terms(3), terms(6)
M10  derived (no quote)
S1   PASS           TMS ch2 PDF p.2          3 piece(s): text, alnum, alnum
S2   derived (no quote)
S3   PASS           ERA HTML                 1 piece(s): text
S4   PASS           TMS ch2 PDF p.8          4 piece(s): text, alnum, alnum, alnum
S5   PASS           ERA HTML                 1 piece(s): text
S6   PASS           TMS ch3 PDF p.7          1 piece(s): terms(4)
S7   PASS           ALMA12 PDF p.25,93       8 piece(s): text, text, text, text, text, text, text, text
S8   PASS           CASA HTML                1 piece(s): text
S9   PASS           TMS ch10 PDF p.7,8       3 piece(s): text, alnum, terms(6)
S10  derived (no quote)
S11  PASS           ALMA12 PDF p.25          1 piece(s): text
S12  PASS           ERA HTML                 1 piece(s): text
S13  PASS           ALMA12 PDF p.25          3 piece(s): text, text, text
S14  PASS           ALMA12 PDF p.100         6 piece(s): text, text, text, text, text, text
B1   derived (no quote)
B2   PASS           TMS ch10 PDF p.43        1 piece(s): alnum
B3   PASS           TMS ch11 PDF p.28,29     2 piece(s): alnum, text
B4   PASS           CASA HTML                1 piece(s): text
TALLY PASS: 50, PASS (+render): 7, RENDER-ONLY: 6, derived: 8
```

## Sources

| key | full reference | local file | URL |
|---|---|---|---|
| TMS | Thompson, A. R., Moran, J. M. & Swenson, G. W. Jr. 2017, *Interferometry and Synthesis in Radio Astronomy*, 3rd ed., Springer Astronomy and Astrophysics Library, doi:10.1007/978-3-319-44431-4 (open access, CC BY-NC 4.0); chapter PDFs 2, 3, 4, 10, 11 quoted | `rawdata/interf/formulas/TMS2017_ch2.pdf`, `..._ch3.pdf`, `..._ch4.pdf`, `..._ch10.pdf`, `..._ch11.pdf` | https://link.springer.com/content/pdf/10.1007/978-3-319-44431-4_4.pdf (and _2, _3, _10, _11) |
| BSS99 | Briggs, D. S., Schwab, F. R. & Sramek, R. A. 1999, "Imaging", in *Synthesis Imaging in Radio Astronomy II*, ASP Conf. Ser. 180, 127-149 (NRAO summer-school Lecture 7; ADS scan, image only) | `rawdata/interf/formulas/BriggsSchwabSramek1999_ASPC180_127.pdf` | https://articles.adsabs.harvard.edu/pdf/1999ASPC..180..127B |
| P99 | Pearson, T. J. 1999, "Non-Imaging Data Analysis", in *Synthesis Imaging in Radio Astronomy II*, ASP Conf. Ser. 180, 335-355 (Lecture 16; ADS scan, image only) | `rawdata/interf/formulas/Pearson1999_ASPC180_335.pdf` | https://articles.adsabs.harvard.edu/pdf/1999ASPC..180..335P |
| B95 | Briggs, D. S. 1995, *High Fidelity Deconvolution of Moderately Resolved Sources*, PhD thesis, New Mexico Institute of Mining and Technology; Chapter 3 "Robust Weighting" (dvips PostScript, gzip; pp. 35-168) | `rawdata/interf/formulas/Briggs1995_thesis_ch3.ps.gz` (index page: `Briggs1995_thesis_index.html`) | http://www.aoc.nrao.edu/cgi-bin/diss-manager?gzip?ch3 (from https://www.aoc.nrao.edu/dissertations/dbriggs/) |
| CASA | CASA Team, CASAdocs "Synthesis Imaging" (tclean documentation, sections 'Data Weighting' and 'Wide Band Imaging'), stable version fetched 2026-10-20 | `rawdata/interf/formulas/CASAdocs_synthesis_imaging_2026-10-20.html` | https://casadocs.readthedocs.io/en/stable/notebooks/synthesis_imaging.html |
| ALMA12 | ALMA Cycle 12 Technical Handbook, Doc 12.3 ver. 1.0 (2025-03-01), ed. P. C. Cortes, doi:10.5281/zenodo.14933753 | `rawdata/interf/formulas/ALMA_Cycle12_Technical_Handbook.pdf` | https://almascience.org/documents-and-tools/cycle12/alma-technical-handbook |
| ERA | Condon, J. J. & Ransom, S. M., *Essential Radio Astronomy* (NRAO online course text; Princeton Univ. Press 2016), Chapter 3, Sec. 3.7 "Interferometers" (HTML) | `rawdata/interf/formulas/CondonRansom_ERA_Ch3_2026-10-20.html` | https://www.cv.nrao.edu/~sransom/web/Ch3.html |
| IERS | IERS Earth Orientation Product Centre (Paris Observatory), "Useful constants" table, updated 2021-03-13, citing IERS Numerical Standards (IAG 1999) | `rawdata/interf/formulas/IERS_EOPPC_constants_2026-10-20.html` | https://hpiers.obspm.fr/eop-pc/models/constants.html |

Downloaded and saved but not quoted: TMS chapters 1, 5 and 15 (`TMS2017_ch1.pdf`, `TMS2017_ch5.pdf`, `TMS2017_ch15.pdf`; Eq. 15.7 restates V3 for the mutual coherence); Thompson, A. R. 1999, "Fundamentals of Radio Interferometry", ASPC 180, 11 (`Thompson1999_ASPC180_11.pdf`); Clark, B. G. 1999, "Coherence in Radio Astronomy", ASPC 180, 1 (`Clark1999_ASPC180_1.pdf`). The sibling ALMA record has the Cycle 13 handbook at `rawdata/interf/alma/ALMA_Cycle13_Technical_Handbook.pdf`; the Cycle 12 copy here is the one quoted.

## Not found (primary sources not obtained)

- **The Springer chapter landing pages and OAPEN.** link.springer.com answers browser-like requests with a JavaScript challenge page, and OAPEN (library.oapen.org) returns 403 to this address. The chapter PDFs came from link.springer.com/content/pdf with a plain request and are the publisher files (pdfinfo: LaTeX + Acrobat Distiller, "© The Author(s) 2017").
- **A PDF of the Briggs thesis.** Only the 1995 gzipped PostScript from NRAO was found. No PDF was found at NRAO or on ADS.
- **Wilner, D. J. & Welch, W. J. 1994, ApJ 427, 898,** the source ALMA12 cites for θ_MRS ≈ 0.6 λ/L_min, was not obtained. The 0.6 enters here only through ALMA12 Eq. (3.28).
- **A plain "largest scale = λ/B_min" statement with no coefficient** was not found in TMS. The closest are ALMA12 p. 100 ("measures spatial scales ... of λ/Lmin") and the coefficient forms in S13-S14.
- **Thompson & Bracewell 1974** (the area-density definition used in W2) and **Purcell 1973** (P99's source for the model formulas) were not obtained.
