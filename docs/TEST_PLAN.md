# SVG-TEST-001 — Verification and evaluation plan for v0.1

## Goal

Demonstrate that the tool performs its **stated** deterministic governance rules and preserves the EMSS paper’s limitations. The evaluation must separately measure software correctness, human decision usefulness, and scientific validity. Do not conflate them.

## A. Programmatic acceptance tests

| Test ID | Test setup | Expected |
|---|---|---|
| T01 | L0 passes, L1 absent | L0 only, no quantitative decision |
| T02 | L0+L1+L2 pass, L3 independent prediction fails | L2 cap |
| T03 | L4 passes but L3 fails | Cannot pass L4; L2 or lower |
| T04 | RSM 3, active DES 1, interface 2 | System level 1 |
| T05 | RSM 3, DES 1 explicitly inactive | DES not a level limiter |
| T06 | Active interface not assessed | BLOCKED/INCOMPLETE |
| T07 | Strong predictive seal-strength model, integrity claim | CLAIM_NOT_SUPPORTED; physical integrity evidence gap |
| T08 | COU outside validated domain | No claim-specific numerical authority |
| T09 | I=4,U=4,C=5 | Priority 80; no authorization attached |
| T10 | I or C omitted | NOT_RATED; cannot imply certainty |
| T11 | E1/E2 d=.8, n=30, s=1.5, Δ=2 | TOST mean equivalence established (per stated assumptions) |
| T12 | E1/E3 d=1.6 with same settings | 90% CI about [.95,2.25]; equivalence not established |
| T13 | All pairwise neighbors pass; bounding pair fails | Family promotion blocked |
| T14 | No equipment transfer claimed | Family-equivalence gate ignored |
| T15 | Absent physical verification links, model L4 | Physical task remains OPEN |
| T16 | Report exported/imported without revision | Reproducible decision fields and source labels |

Additional boundary tests: Δ=0; negative SD; n=1; α=0; unit mismatch; one required unknown level; changed model version; duplicated evidence IDs; cyclic active dependency graph; conflicting evidence provenance; pathological numeric values; equality of CI bound to equivalence margin; unknown reviewer policy. Aim for at least **30 named deterministic test cases**, plus a documented property test sweep.

## B. Properties to check systematically

1. Removing a successfully passed evidence gate **cannot increase** g(model).
2. Reclassifying direct output to indirect/none **cannot increase** claim authority.
3. Reclassifying full mechanism coverage to partial/none **cannot increase** claim authority.
4. Changing COU from within to outside **blocks** claim-specific authority.
5. Adding an active lower-level model/interface cannot raise L_path.
6. Removing an *inactive* model does not change L_path.
7. Failing one necessary bounding equipment comparison cannot produce a positive family-equivalence disposition.
8. Changing I/U/C changes **triage priority only**, not the evidence-gated level.
9. All model levels, claim states, task states, and evidence provenance appear in the exported audit record.
10. No engine pathway outputs `APPROVED`, `COMPLIANT`, `WAIVE_REQUIRED_TEST`, or `RELEASE_PRODUCT`.

## C. Reproduce paper examples

- Minitab public seal-strength RSM: R²=78.58%, predicted R²=0.00%, significant lack of fit; target L3 must remain capped at L2 **under the proposed paper policy**.
- E1/E2 and E2/E3 synthetic transfer comparisons: equivalent within ±2 lb at center under assumptions; E1/E3 non-equivalent *not established* (avoid the incorrect assertion that failure means proven inequivalence).
- DES limitation: data absent; architectural illustration must not be presented as a validated DES.
- AI inspection: source dataset can be cited as a demonstration; no independently trained/qualified AI inspection is claimed.

## D. Stakeholder study for differentiating contribution

**Study arms:** A — model-credibility-only review template based on existing simulation-team V&V practice, B — same model evidence with SVG requirement-to-claim-to-QMS workflow. Keep the baseline template faithful to actual practice rather than artificially weak.

**Scenarios:** Fit ≠ prediction; strength ≠ integrity; active-interface limitation; bounding-sealer transfer; a *clean* case (controls false positives); a cross-lifecycle change-control example.

**Primary endpoint:** Proportion of predetermined material gaps correctly identified (verified by an independent panel). **Secondary:** false-positive gaps, time, completeness of physical evidence action plan, cross-reviewer agreement, qualitative usability. Pre-register scoring rubric and target sample before study. Do not claim statistical superiority from convenience data.

**Evidence provenance:** only public material and clearly labelled synthetic scenarios unless separate company authorization and review are obtained.

## E. Exit criteria

- 100% of predefined safety/authority blocking assertions pass.
- Numeric TOST verified against independent statistical software/reference implementation.
- Regression fixtures and property sweep pass without exceptions or documented unresolved failures.
- Standards and evidence routing independently reviewed, with open limitations recorded.
- GitHub release includes plain-language caveats, source references and test logs.
- Scientific comparative usefulness stated as **unproven** until study completed.
