# Simulation-to-Validation Governance Explorer (SVG Explorer)

**Version 0.1.0 · research prototype · local-first static web application**

SVG Explorer turns an engineering model-use evaluation into a **traceable draft decision**: which claim the model actually supports; its proposed model-use level; active-model and interface constraints; equipment mean-comparability evidence; and packaging-development / physical-validation obligations that remain.

Based on the *author-proposed* multi-model framework presented at **EMSS 2026**, *Using Simulation Credibly in Sterile Barrier Heat-Sealing Validation: A Multi-Model Framework for Regulated Manufacturing*. The proceedings publication is pending. This application is an independent software implementation, **not** an official ASME, ISO, FDA, or journal product.

> **Safety and regulatory scope:** This is a decision-support and evidence-planning prototype. It does not validate models, validate forming/sealing/assembly processes, establish compliance with ISO 11607 / ISO 13485, make ISO 14971 risk-acceptability decisions, waive testing, authorize product release, or replace responsible human review. Example evidence assignments are interpretations and synthetic illustrations—not externally validated quality records.

## Quick start

You can open a browser locally after starting a lightweight server (no dependencies):

```bash
# Node.js 20+; no npm install required
npm run dev
# Open http://localhost:4173
```

Run the automated test suite and generate the deployable static site:

```bash
npm run verify
# Built site: ./dist/
```

Alternatively, host the repository's `index.html`, `src/`, `assets/`, `public/`, `manifest.webmanifest`, and `sw.js` from any HTTPS static host. Do not use `file://` because ES modules and service workers expect HTTP(S).

## Deploy to GitHub Pages (recommended)

1. Create an empty **new GitHub repository**, e.g. `svg-explorer` (public only after reviewing intellectual-property, data and employer-policy constraints).
2. Upload/copy the **contents** of this repository, including the hidden `.github/workflows/deploy.yml` directory; do **not** upload the ZIP alone as one file. Commit to the `main` branch.
3. In repository **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**. The included workflow tests, builds and deploys on each push to `main` (also manually from Actions).
4. After the workflow succeeds, visit the Pages URL shown in the deployment step. For a personal account and `svg-explorer` repo, the usual pattern is `https://<your-username>.github.io/svg-explorer/`—use the actual Pages URL rather than assuming it.
5. For a custom domain, configure the Pages custom-domain/DNS settings separately. No domain routing is included here.

The deployment workflow uses `actions/upload-pages-artifact@v4` and `actions/deploy-pages@v4`. Relative paths make the same static build work on root-site and project-site Pages URLs.

## What the five workflow screens do

| Screen | Inputs | Main output |
|---|---|---|
| 01 — Claim & intended use | Requirement, acceptance basis, claim, model output, output/mechanism/COU alignment | Claim-specific eligibility gate |
| 02 — Model evidence & interfaces | Model classes, active components, five cumulative evidence gates and reference IDs | Lowest supported active-path model-use level |
| 03 — Physical evidence pathway | Influence, uncertainty, consequence and lifecycle evidence status | I×U×C triage index and unresolved requirements-evidence tasks |
| 04 — Equipment transfer / TOST | Sample mean/SD/n, units, ±Δ, α, specified test domain | Pairwise independent-sample Welch TOST and transfer gate |
| 05 — Decision record | All above | Explainable draft decision, limiting dependencies, open evidence and downloadable JSON |

### Built-in illustrative scenarios

- **A — Public aggregate RSM:** reported R² 78.58% versus predicted R² 0.00% and significant lack of fit. Author-assessed L2 supports **test prioritization**, not an L3 candidate process window. Raw benchmark model fitting is not reconstructed in this version.
- **B — Strength is not integrity:** a hypothetical high-performing seal-strength model cannot establish absence of continuous leakage paths.
- **C — Coupled active path:** L3 statistical model, L1 DES, L2 interface yields L1; inactive AI component has no effect on this decision.
- **D — Synthetic equipment:** E1/E2 and E2/E3 mean equivalence established, E1/E3 not established at illustrative ±2.0 lb, so family transfer is blocked.
- **E — Positive bounded use:** L2 test prioritization permitted while packaging physical evidence remains open.

**Import/export:** Export a standalone editable scenario JSON or a draft decision-report JSON, or import either. Save locally is an *explicit opt-in* (`localStorage` in the current browser). The app has no API, telemetry or external data upload. Treat local browser storage as an uncontrolled convenience—not a validated QMS repository. Clear browser site data to remove a saved draft.

## Logic and scientific boundaries

- `g(model)` = highest **cumulative passed** L0–L4 gate. Missing/failed L0 or its evidence reference means unsupported. Any PASS gate without a reference cannot raise the supported level; an upper failed/unknown gate caps at the previously passed level. A model cannot bootstrap credibility from a user-entered numerical score.
- Claim output must be `DIRECT`, physical mechanism `FULL`, and context `WITHIN`. Partial, indirect and unknown cases block claim-specific authority and call for a narrower claim or additional evidence.
- `L_path = min(g(active models), g(active interfaces))`. Inactive components are deliberately excluded; reviewer must select the *actual* decision path.
- `P=I×U×C` with 1–5 integer scales, ranking *credibility review effort only*. No universal pass threshold, no formal ISO 14971 estimate.
- Optional independent-sample Welch TOST uses a two-sided `100(1−2α)%` confidence interval and corresponding two one-sided tests. Statistical equivalence of means at the tested condition is not full equipment/process equivalence or proof of interchangeability. Correlation, multiplicity, statistical assumptions, margin selection, instrument uncertainty, and full process operating-domain assessment remain reviewer responsibilities.
- Physical/design/QMS evidence obligations remain independent of model authority and are *suggestions requiring user scope review*, not normative test lists.

For formulas and governance traceability see [`docs/CALCULATION_SPEC.md`](docs/CALCULATION_SPEC.md), [`docs/PROJECT_CHARTER.md`](docs/PROJECT_CHARTER.md), and [`docs/STANDARDS_TRACEABILITY.md`](docs/STANDARDS_TRACEABILITY.md).

## Repository map

```text
index.html                  Browser entry point
assets/styles.css           Responsive layout + accessible focus styling
src/app.js                  Assessment UI, event handling, report display
src/engine.js               Pure deterministic policy / decision engine
src/statistics.js           Student-t CDF/quantile + Welch TOST
src/catalog.js              Author-proposed levels and evidence prompts
src/examples.js             Five labelled demo scenarios
src/io.js                   JSON import normalization / export
public/icon.svg             Application icon
sw.js                       Same-origin offline static-resource cache
scripts/serve.mjs           Local dev server (Node built-ins only)
scripts/build.mjs           Dist build (Node built-ins only)
tests/                      Scenario, property, numerical, import tests
.github/workflows/deploy.yml Automated test + build + Pages deployment
docs/                       Charter, algorithm, standards mapping, tests, notes
```

**Implementation choice:** Version 0.1 uses a zero-dependency ES-module app instead of the charter's tentative React/Vite suggestion. This deliberately reduces package supply-chain exposure and makes deployment reproducible without an install step. The domain engine is independent of the UI and can be reused in a future React/TypeScript front end without rewriting policy logic.

## Validation status

The automated suite checks 71 cases including reference scenarios, numeric TOST, cumulative gate logic, monotonicity, active-path exclusion and JSON import. The build step is deterministic and has no runtime dependencies. **Passing these tests is software conformance to the prototype specification only, not validation of the underlying governance framework or regulatory suitability.** Expert review, controlled user acceptance testing and a comparative study versus an existing V&V reporting workflow are future requirements.

## Sources and intellectual property

- Foundational manuscript: author-presented EMSS 2026 paper (citation/link can be completed when proceedings are public).
- ASME V&V 40 (2018) provides model-risk / context-of-use / evidence principles; this tool does not replace it.
- ISO 11607-1 and ISO 11607-2 (2019 with amendments), ISO 14971 (2019), ISO 13485 (2016), and applicable regulatory requirements are relevant to the evidence route.
- No copyrighted standards clauses or publisher figures are included. Confirm public-release authorization, repository ownership, any employment obligations, and your intended open-source license before making this public. **No open-source redistribution license is granted by this package until the repository owner selects one.**

See [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) and [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) for follow-on validation, known limitations and enhancements.
