# SVG Explorer v0.1 — Implementation and release notes

**Build:** dependency-free JavaScript ES modules (Node.js >=20 for tests and build). Browser runtime requires an evergreen browser supporting modules, `structuredClone`, Fetch, Blob and localStorage (only when explicitly requested).

## Implemented from SVG-001 charter

| Requirement | Status | Notes |
|---|---|---|
| FR-01 claim, requirement and exclusion fields | Implemented | User-entered / sample scenarios |
| FR-02 / FR-03 applicability | Implemented | Three strict hard gates, manual rationale |
| FR-04 five cumulative levels | Implemented | Upper unknown gate caps level; missing L0 blocks |
| FR-05 model/interface minimum | Implemented | Manual active flags; no automatic dependency graph inference |
| FR-06 I×U×C | Implemented | 1–5 scale, no arbitrary risk cutoff |
| FR-07 Welch TOST | Implemented for independent groups | Full equipment equivalence explicitly excluded |
| FR-08 lifecycle obligations | Implemented as editable suggested prompts | Not a compliance database or universal testing list |
| FR-09 draft decision and gaps | Implemented | No organization approval workflow |
| FR-10 import/export and print | Implemented | Local-only save, no server or cloud sync |
| FR-11 provenance labels | Implemented | Built-in examples visibly tagged |
| FR-12 method version and draft-only output | Implemented | Method `SVG-ALG-001/0.1.0` |

## Not implemented (planned)

- Automatic V&V40 model evidence import, computational model fitting, predictive statistics and independent data validation
- Advanced DOE/RSM curve fitting and parameter-window visualizations
- Digital provenance checking, reviewer identity/approvals, electronic signatures or validation-record control
- Risk-management linkage to actual controlled hazard files
- Full physical-test requirements determination from licensed normative clauses
- Statistical modelling for paired/repeated-measure/heteroscedastic process equivalence beyond two-sample Welch TOST
- Multiplicity-adjusted family-level inference / full operating-envelope comparability
- Actual coupled uncertainty propagation, MES/ERP/QMS connector, image inspection, DES modeling, AI inference
- External expert validation and comparative study demonstrating additional user value

## Mathematical and interpretive caveats

1. The five-level ladder and I×U×C index are author-proposed heuristics, not normative ASME or ISO formulas.
2. Evidence gates record an assessor's judgment; a `PASS` entry is *not independently verified* by the software. Each PASS gate must have a nonempty evidence reference to count, but the software cannot independently verify those references. Evidence reference fields are plain text.
3. Setting a model to `inactive` removes it from the decision-specific minimum. The user must substantiate that it is not required for the claim.
4. TOST compares input sample means/SDs/n assuming independent samples; confidence intervals are calculated from Student-t numerics. A statistically established mean comparison alone does not establish a packaging process operating window, full family comparability or validated model transfer.
5. A physical task can be marked `REVIEWED` or appropriately `NOT_APPLICABLE_WITH_JUSTIFICATION` by a user; this is an internal draft tracking state, not an approved QMS decision.
6. Imported JSON is normalized and escaped for HTML output; the browser does not upload data. Avoid entering confidential information if the destination browser/device is not controlled.

## Upgrade rationale

The charter's initial technology suggestion was React/TypeScript/Vite. The project is deliberately delivered in **vanilla ES modules** so it can be deployed from GitHub Pages without installing any third-party dependencies. The deterministic engine, dataset and test suite are isolated from rendering and can be migrated to TypeScript modules later. This is an implementation-level simplification, not a change to scientific policy requirements.

## Pre-publication checklist

- Owner reviews manuscript permissions and public-facing academic credit
- Owner screens data/example text against employment and confidentiality obligations
- Independent subject matter expert checks the science and ISO/ASME traceability against licensed standards
- Validate at least 30 separate application cases plus monotonicity and negative-case sweeps, beyond current component tests
- Conduct browser interaction and accessibility testing on iPhone Safari, Android Chrome and desktop
- Choose and add an explicit software license, or retain all rights reserved intentionally
- Confirm GitHub Pages settings and successful green deployment action; verify first-load and offline behavior
