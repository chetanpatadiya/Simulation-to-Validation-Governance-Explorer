# Project Charter — Simulation-to-Validation Governance Explorer

**Project ID:** SVG-001  
**Charter version:** 0.1 (design baseline)  
**Date:** November 1, 2026  
**Provenance:** Extension of author-presented EMSS 2026 multi-model sterile-barrier validation research; manuscript awaiting publication.  
**Decision status:** Proposed — not yet independently reviewed or validated.

## 1. Executive purpose

**Problem.** The verification and validation evidence that establishes model credibility does not, by itself, provide a packaging-development team with an explicit, auditable route from a specific predicted output to the design requirement, physical performance claim, acceptance evidence, process-validation activity, and future change-control trigger. Teams may consequently over-rely on a credible model for an unsupported claim or under-utilize modeling where it could responsibly guide testing.

**Product.** A lightweight, transparent browser-based SVG Explorer that accepts a decision and active model/evidence network, assesses the maximum *proposed* model-use level, flags claim-to-mechanism and context-of-use mismatches, orders credibility review tasks, and generates a requirements–evidence–QMS traceability table and physical-evidence action plan.

**Positioning.** A **workflow-level bridge** between established model credibility assessment (notably ASME V&V 40), packaging design/performance requirements (ISO 11607-1), process validation (ISO 11607-2), risk management (ISO 14971), and QMS design and development records (ISO 13485 / current FDA QMSR). It does not assert primacy over any standard or framework, nor does it establish compliance.

## 2. Research question and hypothesis

**Research question:** Does a requirements-to-claim-to-model-to-evidence governance workflow surface relevant boundary, interface, and residual physical-validation gaps that an otherwise adequate model-centered V&V assessment does not express in a packaging team’s decision records?

**Testable hypothesis:** Under identical synthetic/public scenarios and identical model evidence, trained reviewers using SVG Explorer identify more unsupported model-to-claim transfers and omitted physical evidence obligations than reviewers using a model-credibility-only reporting template, without an unacceptable increase in time or false alarms. This is a hypothesis to evaluate, **not** an established advantage.

## 3. Unique contribution — comparison against existing methods

| Capability | Existing standard's primary emphasis | SVG Explorer implementation target |
|---|---|---|
| Context of use, model influence, decision consequence, credibility evidence | ASME V&V 40; FDA CM&S guidance for applicable model classes | **Import/reference** conclusions; no homemade replacement credibility score |
| Model lifecycle | ASME VVUQ 50.1-2025 covers computational-model lifecycle | Track model-version and evidence re-evaluation at *specific packaging decisions* |
| Single physical/mechanistic model application | ASME VVUQ 40.1-2026 worked example | Extend traceability to heterogeneous active-path models, interface evidence, equipment transfer |
| Packaging-system functional requirements | ISO 11607-1 | Connect claim mechanism to material/SBS/performance and physical testing |
| Packaging forming/sealing/assembly process validation | ISO 11607-2 | Route model use to process-validation tasks, including equipment, operating window, and process evidence |
| Device risk management | ISO 14971 | Link to *existing* hazard/risk references; do not compute product risk from I×U×C |
| Documentation/change controls | ISO 13485 / QMSR | Export claim → evidence → approved limitation → task → record → re-review trigger |

**Novelty claim boundaries:** Specific integration and operationalization is the contribution. Context of use, V&V, risk-informed credibility, V-model/design control, and model lifecycle are established ideas. Any claimed incremental superiority requires a comparative human study.

## 4. Intended users and decisions

**Users:** packaging engineers, simulation specialists, quality/validation engineers, R&D design assurance, technical reviewers. **Owner of decision:** human engineer/quality function under applicable organizational procedures.

**Supported decisions in v0.1:**

1. Can this model be used for engineering exploration, test prioritization, candidate-window recommendation, or bounded monitored support?
2. Is the stated **claim** actually predicted or supported by the model output and mechanism?
3. Which models and interfaces are **active** for this specific decision, and what is the conservative system-use cap?
4. Can model evidence be transferred across equipment in the presence of an adequately justified equivalence margin and test?
5. Which design and process-validation evidence categories remain unresolved, and to which QMS records should they trace?

**Excluded:** regulatory submissions, automated process signoff, product release, waiver of ISO 11607 testing, prediction of sterility/integrity from seal-strength alone, formal ISO 14971 risk acceptability decisions, autonomous AI inspection qualification, and direct employer-system integrations.

## 5. Conceptual decision graph

Requirement → Engineering claim → Output alignment → Mechanism coverage → Context-of-use applicability → Active model(s) and interface(s) → Verified evidence → Proposed maximum model-use level → Remaining physical activities → QMS record / change-control trigger.

A model may be credible for predicting seal *strength* but be incapable of answering a claim about seal *integrity*. This is not an inadequacy of the model; it is a misalignment of **claim and output**. The UI must state this explicitly and recommend reframing the claim rather than treating a partial mechanism as an acceptable numeric score.

## 6. Lifecycle integration — illustrative, not normative

| Lifecycle phase | Typical question | Model's plausible role | Physical/QMS evidence still needed |
|---|---|---|---|
| Design inputs / use case | What function must package perform under use and distribution? | Hypothesis and sensitivity screening | Approved design inputs; risk references; acceptance definition |
| Material/SBS selection | How do candidate materials and seal geometries behave? | Rank options, identify critical factors | Material/specification evidence and relevant physical evaluation |
| Design optimization | What conditions deserve DOE coverage? | DOE planning, candidate settings | Physical testing; appropriate design verification |
| Design verification / packaging-system performance | Does package meet defined requirements (e.g. integrity, strength, distribution, aging)? | Support test planning or specific subclaims within qualified COU | Independent evidence for each required functional claim; integrity is not inferable from strength alone |
| Packaging process validation | Can forming/sealing/assembly reliably meet defined criteria? | Recommend candidate process window, compare process instances | Organizationally appropriate IQ/OQ/PQ and other process evidence as applicable; approved protocols and reports |
| Transfer and ongoing production | Does evidence remain valid on other equipment or after changes? | Compare equipment, monitoring and change screening | Transfer evidence, process controls, revalidation decisions, change controls |

Test selection, sample size, equivalence margins and acceptance criteria require product/process-specific rationale. The tool generates **candidate evidence categories**, not universal test requirements.

## 7. v0.1 design requirements

**FR-01** Human-entered decision, requirement ID, claim statement, model output and exclusions.  
**FR-02** Explicit output alignment (direct / indirect / none) and mechanism coverage (full / partial / absent / unknown), separately documented.  
**FR-03** Model applicability check (inside COU / boundary / outside / unknown), with evidence and rationale.  
**FR-04** Evidence-gated L0–L4 evaluation, cumulative and explainable.  
**FR-05** Active decision-path selector and interface-aware minimum rule; inactive models never cap the decision.  
**FR-06** Ordinal I×U×C *review-priority index* only, with separate display from model authority.  
**FR-07** Optional two-independent-sample Welch TOST for equipment comparability with documented, pre-set equivalence margin.  
**FR-08** User-selected lifecycle phase plus curated evidence-obligation prompts.  
**FR-09** Output: supported maximum model-use level, requested-use disposition, claim-scope limitations, open gaps, suggested test/records, re-evaluation triggers.  
**FR-10** Local JSON import/export, deterministic printable decision report, no background upload.  
**FR-11** Provenance labels: *real/public/synthetic/user-entered*, plus analysis assumptions.  
**FR-12** All outputs contain method and policy version; decisions remain draft until human review.

## 8. Nonfunctional and ethical requirements

Offline-ready static web application (PWA optional); accessible and responsive on mobile; tests run without network; no scoring black box; no hard-coded claims of compliance; optional AI and DES support via evidence questionnaires only; explicit uncertainty and incomplete-data states; no employer-identifiable data; no copyrighted standard text copied into source.

## 9. Release approach

| Release | Capability | Explicit boundary |
|---|---|---|
| v0.1 — **Decision governance MVP** | One claim per scenario, multiple manually entered models/interfaces; L0–L4 gating; IUC review ranking; simple TOST; traceability export; 3–4 public/synthetic fixtures | No automated standard conformance, no DOE refitting, no system uncertainty propagation |
| v0.2 — **Evidence adapters** | Import DOE/RSM summaries and independent performance metrics; fit/prediction diagnostics; multiple claims and equipment condition comparisons | Input datasets require independent review; no automatic qualification |
| v0.3 — **Engineering pathway integration** | Detailed package-development workflow, risk linkages, verification matrix, IQ/OQ/PQ planning checklists, revision/evidence dependency history | No direct validated QMS write-back |
| v0.4 — **Architecture credibility** | Shared-data/correlation checks; interface sensitivity; coupled uncertainty with suitable methodology; DES and AI-specific evidence adapters | Requires separately established methods by model type |
| v1.0 — **Reviewed governance tool** | External engineer/quality pilot, inter-rater study, comparative analysis, validated software test baseline, policy configuration and documented change management | Still no regulatory approval or autonomous process-release authority |

## 10. Acceptance gates

**Technical:** All evidence decisions are deterministic; downward changes in applicability/evidence cannot increase supported authority; inactive model exclusions are honored; bounding equipment transfer is blocked when equivalence is not demonstrated; uncertain inputs do not silently pass; all decision paths have explanations; 30 regression fixtures and a systematic monotonicity property sweep are performed and logged.

**Scientific:** Replicate EMSS benchmark distinction (R² 78.58%, predicted R² 0%, L2), synthetic bounding-equipment TOST failure, and interface-limited coupled scenario; prominently mark assumptions and gaps.

**Comparative evidence:** A pilot compares current model-credibility templates with SVG Explorer on identical scenarios; predefined measurements: unsupported claim detection, omitted-physical-evidence detection, false-positive gaps, time-to-review, inter-reviewer agreement. Neither method declared superior before testing.

**Compliance:** Standards mapping is verified by qualified reviewers with appropriately licensed standards; tool report says *supporting evidence-planning artifact*, not validation record approval.

## 11. Risks / mitigations

- **Overclaiming novelty:** compare with V&V 40, VVUQ 40.1, VVUQ 50.1; focus on packaging claim/decision workflow and run comparative study.
- **False precision:** ordinal priority multiplication is a ranking convention only, with no validity cutoffs.
- **Inappropriate transfer of authority:** strict output/mechanism/applicability hard gates, no averaging, no waiver outcomes.
- **Treating AI inspection as covered by FDA 2023 physics-based CM&S guidance:** type-specific policy and explicit exclusion.
- **IP/data leakage:** synthetic/public-only, local-first processing, reviewed citations/license before release.
- **Publication timing/copyright:** link/cite EMSS paper once available, do not republish publisher-owned figures without permission.

## 12. First stakeholder demonstration

Use three cases: (A) good in-sample RSM fit / poor predictive performance → test prioritization only; (B) apparently strong seal-strength model asked to prove leak integrity → claim blocked despite credibility; (C) individually credible component models with weak active interface or unestablished cross-sealer comparability → architecture promotion blocked. Display current model assessment **alongside** the incremental requirements-to-evidence traceability result.

**Success criterion:** a skeptical simulation specialist should be able to agree that SVG Explorer consumes, rather than duplicates, their V&V 40 conclusion and adds auditable packaging decision outputs that were otherwise scattered across planning, validation and QMS records.

**Status:** Design charter complete; no implemented calculator or completed comparative validation implied.
