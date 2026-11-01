# Technical specification — SVG Explorer calculation and decision engine

**Spec ID:** SVG-ALG-001 | **Version:** 0.1-draft | **Date:** 2026-11-01

## 1. Guiding premise

This is **not a weighted scoring calculator** for establishing model credibility, medical-device risk acceptability, or ISO compliance. Its primary calculation is a **deterministic, explainable, gated decision** over claims, models, interfaces, and evidence. Only the explicitly author-proposed **I×U×C prioritization index** and optional **Welch TOST equivalence check** output numerical results.

Inputs are reviewer-supplied assessments and evidence references. The calculation produces a **proposed decision-support summary** and recommended follow-up, not an autonomous approved engineering decision. All numeric and qualitative thresholds used by stakeholders must be established outside the software and recorded.

## 2. Data model (one scenario / one decision claim in v0.1)

| Object | Required fields | Notes |
|---|---|---|
| `decision` | id, lifecycle_phase, claim, requested_level, rationale | One specific question rather than global model qualification |
| `requirement` | reference_id, statement, acceptance_basis_ref | Link to actual specification; blank acceptance basis → unresolved |
| `model` | id, class (`mechanistic`, `statistical`, `DES`, `AI`, `other`), output, evidence gates, supported_level | Each model evaluated for a specific COU; do not conflate FDA scope |
| `claim_alignment` | `output_alignment`, `mechanism_coverage`, rationale, `cou_scope` | Each is a **hard gate**, not a contribution to a numeric score |
| `dependency` | upstream id, downstream id, `active`, interface id | The reviewer explicitly defines the active path in v0.1 |
| `interface` | id, active, evidence gates, supported_level | Unit/definition, synchronization, assumption and covariance/lineage checks |
| `review_priority` | influence I, uncertainty U, consequence C ∈ {1..5}, evidence | Ordinal priority heuristic; separate from authority |
| `comparability` | comparison scope, margin Δ, alpha, n1/n2, means, SDs, source | TOST optional, *not* sole qualification of equipment family |
| `physical_evidence` | evidence category, planned/available/accepted, record ref, justification | Requirements-based, editable, no automation that waives tasks |
| `traceability` | claim, model output, evidence ref, action, QMS record, trigger | Exportable audit-ready **draft**, not QMS-approved record |

**State classes must distinguish** `PASS`, `FAIL`, `UNKNOWN`, `NOT_APPLICABLE`, and `NOT_EVALUATED`; absence of evidence never means pass. Model-level rank is not a proxy for formal risk acceptability.

## 3. Author-proposed evidence ladder — cumulative gates

Let `g(m)` be the maximum **demonstrated** model-use level for model `m`, using its specific claim and context of use:

| Level | Cumulative evidence gate | Permitted *model* role (bounded) |
|---|---|---|
| **L0 — Understanding** | Purpose, structure, assumptions and exclusions documented | Conceptual hypothesis only; no quantitative quality decision |
| **L1 — Exploration** | L0 + equations/code/logic and implementation verification | Compare options for exploratory engineering |
| **L2 — Test prioritization** | L1 + comparison against reference/benchmark/pilot/historical evidence, limitations and uncertainty characterized | Choose/prioritize physical test conditions, not independently declare final process window |
| **L3 — Candidate-window recommendation** | L2 + predefined acceptable predictive performance on independent/held-out data; uncertainty/boundary characterization; equipment transfer evidence if applicable | Propose a candidate for **physical confirmation**, never waive it |
| **L4 — Monitored decision support** | L3 + controlled prospective monitoring, drift and data governance, review triggers | Ongoing human-governed model-assisted support within qualified intended use |

**Formalization:** for cumulative Boolean/tri-state gates `G0…G4`, take

`g(m) = max({k in {0,1,2,3,4} : G0 through Gk are PASS})`.

If G0 fails or evidence is missing, return **UNSUPPORTED / NOT_ASSESSED** instead of silently substituting L0. A failed higher gate cannot be bypassed; L4 requires *all* L0–L3 gates. The numerical level is **author-defined governance**, not a V&V 40 requirement or an empirically calibrated credibility value.

The same ordinal levels can be used for interfaces with **interface-specific evidence definitions** (e.g. L1 interface code/units checked; L2 benchmarked data exchange with characterized uncertainty; L3 independent end-to-end validation and boundary checks; L4 monitoring/version-control of that interface). This interface policy is proposed and must be reviewed before use.

## 4. First-class claim applicability gates

Before computing any claim-specific permitted authority:

1. **Output alignment:** `DIRECT`, `INDIRECT`, `NONE`, or `UNKNOWN`. Direct means the result numerically or qualitatively addresses the *specific* outcome, not a surrogate outcome.
2. **Mechanism coverage:** `FULL`, `PARTIAL`, `NONE`, or `UNKNOWN`. Full means the significant mechanisms necessary for the stated claim are covered *for the use case*; it does not mean the whole system is modeled.
3. **Context of use:** `WITHIN`, `BOUNDARY`, `OUTSIDE`, or `UNKNOWN`, supported by valid ranges, population/process conditions, factors, measurement methods and exclusions.
4. **Physical/organizational authority:** There is **no automatic process release or test waiver** even if all model evidence reaches L4. Approved QMS procedures and independent evidence still govern decisions.

Policy for v0.1:

- If output is `NONE`/`UNKNOWN`, mechanism `NONE`/`UNKNOWN`, or COU `OUTSIDE`/`UNKNOWN`: **claim not supported**; show narrower candidate claim if possible. No numeric level applies to this claim.
- If output is `INDIRECT`, mechanism `PARTIAL`, or COU `BOUNDARY`: **claim requires reframe or independent mechanism-specific evidence**; do not automatically classify it as L2 or L3. Reviewer can create a narrower, valid claim and rerun assessment.
- Only when output=`DIRECT`, mechanism=`FULL`, COU=`WITHIN` proceed to calculate an authority bound for that *specific* claim.

This gate is the critical differentiation from re-scoring model credibility. In particular, modeled seal strength does **not** establish absence of continuous leak paths or a sterile-barrier integrity claim.

## 5. Active-path model and interface authority

For decision `d`, let `A(d)` be **only** active model components necessary for that decision, and `E(d)` the active interfaces transferring information among them. Then:

`L_path(d) = min( { g(m) : m in A(d) } ∪ { g(e) : e in E(d) } )`.

The active set may contain a *single* model and no interfaces; in that case L_path is its supported level. A model that is present in the broad digital-twin architecture but **not used** for the specific claim must not cap L_path. If an active component or interface has an `UNSUPPORTED` state, return **BLOCKED / INCOMPLETE**, not an arbitrary number.

Let `L_requested ∈ {0…4}` and a separate, *preapproved organization-specific* policy bound `L_policy` where such policy is supplied. Then:

`L_evidence_max = L_path(d)` (only after applicability gates pass),

`L_proposed = min(L_requested, L_evidence_max [, L_policy])`.

`Disposition = PROPOSED_WITHIN_EVIDENCE` if `L_requested <= L_evidence_max` and mandatory gates pass; otherwise `DOWNGRADE_REQUIRED` or `CLAIM_NOT_SUPPORTED`.

**IMPORTANT:** `L_proposed` is only a *proposed model-use classification*; *no claim is approved* until an accountable human reviewer signs off under applicable QMS governance. An absent `L_policy` does not imply an organizational approval.

## 6. Ordinal credibility-work prioritization — not safety risk

For scenario `s`, the published EMSS proposal uses:

`P(s) = I(s) × U(s) × C(s)` with integer `I,U,C ∈ {1,2,3,4,5}`.

- `I`: degree to which a model influences the candidate decision (1 negligible; 5 highly determinative)
- `U`: uncertainty *relevant to that scenario* (1 low/well understood; 5 high, unknown, or extrapolative)
- `C`: consequence of an incorrect **model-supported engineering decision** (1 limited; 5 severe impact on an inappropriate quality decision)

Range is **1–125**. This is an ordinal-scale product used **only for review-order prioritization**, not a probability, statistically meaningful interval, ISO 14971 product risk score, credibility score or pass threshold. There are **no absolute “green/yellow/red” P cutoffs** in v0.1. Show inputs, definitions, assumption rationale, and sortable score. Incompletely specified I/C yields `NOT_RATED`; unknown uncertainty may be tagged U=5 for *triage only*, explicitly flagged as a conservative placeholder and never used to pass a gate.

**Example (illustrative, not from EMSS dataset):** I=4, U=4, C=5 ⇒ `P=80`. This prioritizes review; it does not downgrade L3 to L2, or authorise/waive any validation work.

## 7. Optional equipment-comparability module — Welch TOST, two independent samples

Input: prespecified **domain-justified** symmetric equivalence bound ±Δ (same units as outcome), acceptable α (e.g. 0.05), two sample sizes n1,n2 ≥2, means x̄1 and x̄2, SDs s1,s2 > 0. Assumptions: independent samples, an outcome where mean equivalence is relevant, adequate distributional assumptions and measurement capability. Real studies also require assessment of boundary coverage and variability, not only center-point means.

`d = x̄1 − x̄2`

`SE = sqrt(s1²/n1 + s2²/n2)`

`ν = (s1²/n1+s2²/n2)² / [ (s1²/n1)²/(n1−1) + (s2²/n2)²/(n2−1) ]` (Welch–Satterthwaite degrees of freedom)

`CI_(1−2α) = [d − t_(1−α,ν) SE, d + t_(1−α,ν) SE]`

`p_lower = 1 − F_t((d + Δ)/SE; ν)` for `H0: d ≤ −Δ`

`p_upper = F_t((d − Δ)/SE; ν)` for `H0: d ≥ +Δ`

`Equivalent means established` only when **both** one-sided p-values < α (equivalently, the corresponding two-sided 100(1−2α)% confidence interval is strictly inside (−Δ,+Δ)). For two-sided 90% CI use α=0.05. For asymmetric margins, paired comparisons, repeated measures, mixed effects, or non-normal outcomes, defer to later modules / formal statistical review.

**Family transfer gate:** For all *prespecified bounding and decision-relevant* comparisons, equivalence must be established within the measured operating domain to use this one module as supporting evidence. If **any** required bounding comparison fails, mark `FAMILY_EQUIVALENCE_NOT_ESTABLISHED`. This does **not** prove inequivalence. The model may remain eligible for a narrower *individual-equipment* claim.

**Published EMSS synthetic demonstration (not real equipment):** n1=n2=30, SD1=SD2=1.5 lb, E1 vs E3 mean difference 1.6 lb, Δ=2.0 lb, α=0.05. SE≈0.387 lb, df≈58; 90% CI≈[0.95,2.25] lb, which crosses +2.0 lb ⇒ **equivalence not established**. For E1/E2 and E2/E3, d=0.8 lb gives CI≈[0.15,1.45] lb ⇒ establishes mean equivalence for those pairs only. Pairwise transitivity **cannot** be assumed; E1–E3 is the bounding failure. Any such finding concerns the tested center point, not the full process window.

## 8. Optional RSM/DOE evidence adapter (display-only v0.1; statistical fitting planned for v0.2)

General second-order coded-factor response surface:

`ŷ(x) = β0 + Σ βi xi + Σ βii xi² + Σ_(i<j) βij xi xj`.

The paper uses the following **public, reported** Minitab benchmark coefficients:

`ŷ = 28.44 + 1.685T − 1.719D + 1.481P + 1.060M − 2.662T² − 2.476D² − 5.81TD`, coded factors T=hot-bar temperature, D=dwell, P=pressure, M=material temperature.

The published benchmark states R²=78.58% and predicted R²=0.00% with significant lack of fit. `R²=1−SSE/SST`; `predicted R² = 1−PRESS/SST` (where PRESS is based on out-of-sample/leave-one-out prediction). Published **aggregate** values are entered as supplied; they cannot be regenerated from coefficient values alone without the observations, residuals and model-fitting details. No inference should be drawn about integrity, sterilization maintenance, or validated process limits from this strength surface.

**Worked governance result:** requested L3 candidate-window recommendation; despite acceptable-looking in-sample R², independent predictive gate is not met, so model remains **L2 test-prioritization only**. Physical validation remains necessary regardless of level.

## 9. Lifecycle evidence routing engine

Each claim carries `requirement_id`, `mechanism_id`, `lifecycle_phase`, `model_id`, `evidence_id`, and `record_id`. The selected phase loads **editable candidate obligations**; none may be marked fulfilled merely by a model level:

| Phase | Suggested evidence categories | Record examples |
|---|---|---|
| Design requirements and risk | Approved claims/requirements; intended use; acceptance basis; risk file linkage | Design input matrix; risk cross-reference |
| Material/SBS design | Material suitability, compatibility and required packaging functions | Design output/material assessment |
| Design verification | Packaging-system claims (strength, integrity, distribution/storage/sterilization, aging and presentation as relevant) | Verification protocol/results; traceability matrix |
| Process development | Parameter range, process-window investigation, DOE results and applicability | DOE report; engineering assessment |
| Packaging process validation | Qualification of forming/sealing/assembly processes and controls as relevant; physical evidence | Approved IQ/OQ/PQ strategy, records and reports as applicable |
| Transfer/change monitoring | Equipment comparability, control limits, data drift and re-evaluation | Change-control assessment; monitoring plan |

Task status is `REQUIRED_BY_REVIEWER`, `PLANNED`, `EVIDENCE_LINKED`, `REVIEWED`, `NOT_APPLICABLE_WITH_JUSTIFICATION`, or `OPEN`. **No blanket automatic assertion that every named test is required**; actual scope depends on product, process, route to market, and validated organizational procedures.

## 10. Decision-engine algorithm (reference pseudocode)

```text
function evaluate(decision, models, interfaces, claims, physicalTasks):
    require well_formed_identifiers_and_evidence_provenance()
    record = init_draft_record(method_version="SVG-ALG-001/0.1")
    record.priority = compute_I_times_U_times_C_for_triage_only()
    record.lifecycleTasks = suggest_tasks_by_phase_and_claim()

    if claim.output_alignment != DIRECT
       or claim.mechanism_coverage != FULL
       or claim.cou_scope != WITHIN:
         record.disposition = CLAIM_NOT_SUPPORTED_OR_REFRAME
         record.proposedAuthority = NOT_APPLICABLE
         return record_with_explicit_gaps_and_physical_tasks()

    active_models = models_on_declared_active_decision_path(decision)
    active_interfaces = interfaces_on_declared_active_decision_path(decision)
    if active_models is empty:
         return BLOCKED_INCOMPLETE("No active claim-supporting model")
    if missing_or_unverified_required_evidence(active_models, active_interfaces):
         mark_missing_as_unsupported_or_cap_to_lower_cumulative_gate()
    if comparability_required_and_not_established_for_transfer():
         return SCOPE_TRANSFER_BLOCKED_WITH_INDIVIDUAL_SCOPE_OPTION()

    g = map(evidence_level_for_cumulative_gates, active_models + active_interfaces)
    if any required g is UNSUPPORTED:
         return BLOCKED_INCOMPLETE("Active-path evidence unsupported")
    record.L_evidence_max = min(g)
    record.L_proposed = min(decision.requested_level, record.L_evidence_max,
                            explicitly_configured_policy_cap_if_any)
    record.disposition = (decision.requested_level <= record.L_proposed)
                            ? PROPOSED_WITHIN_EVIDENCE
                            : DOWNGRADE_REQUIRED
    record.approved = false  // never assigned true by software
    return record_with_explainable_limiting_gates_and_remaining_tasks()
```

**Clarification:** Missing evidence for an *upper* level caps to the last fully passed lower level. Unsupported L0 or an unusable active dependency blocks claim authority. Scope-transfer gates apply to a *family-level transferred claim*, not to unrelated local decisions. If an applicable policy cap is lower than requested, it must be reported even if scientific evidence is sufficient.

## 11. Output panel specification

**Panel A — Model-use decision:** Requested level / evidence-supported maximum / proposed use / owner review pending / explicit exclusions.

**Panel B — Scope and claim fitness:** output alignment; mechanism coverage; context boundaries; missing mechanisms; recommended narrower claim.

**Panel C — Evidence priority:** I,U,C and P with their definitions, sortable outstanding credibility questions, no risk color/approval claims.

**Panel D — Lifecycle evidence plan:** pending design inputs/verification/process validation; physical tasks remain regardless of L4; link to existing QMS records; task status.

**Panel E — Audit export:** scenario ID, date/version, source classification, evidence identifiers, gates passed/failed/unknown, active path, limiting element, reviewer name optional, decision status *draft*, change triggers, no sensitive data by default.

## 12. Worked examples / expected outcomes

**A — Misleading model fit:** One RSM with benchmark comparison and poor prediction; `g(RSM)=2`; requested level 3 → `DOWNGRADE_REQUIRED`, `L_evidence_max=2`, permitted test prioritization, physical confirmation required.

**B — Wrong mechanism:** Same model `g=3` (hypothetically improved independent seal-strength performance), but claim is “sterile barrier integrity established.” Since model output=seal strength and mechanism=partial for integrity, `CLAIM_NOT_SUPPORTED_OR_REFRAME` irrespective of g; require appropriate integrity evidence, no model-level numerical pass.

**C — Active coupled architecture:** RSM g=3, DES g=1, active interface g=2, requested 3 → `L_path=min(3,1,2)=1`. If DES is provably *inactive* for the specific decision, RSM alone could be evaluated independently, subject to scope/evidence. Model inventory should not impose a system-wide minimum.

**D — Equipment family:** E1/E2 TOST establishes equivalence, E2/E3 establishes equivalence, but E1/E3 90% CI [0.95,2.25] fails within ±2.0; no family-level promotion; individual equipment evaluations remain possible.

## 13. Error conditions and explainability

All scores/ranks require definitions and data source; negative SD, Δ≤0, n<2, α≤0 or α≥0.5 cause validation errors. Mixed units, undefined claimed response, absent requirement linkage, non-independent evidence claimed independent, and COU extrapolation fail or flag before rank calculation. Never turn a failed or unknown comparison into equivalent. Every numerical answer links to formula version and input units. Pre-filled demo values always visibly marked **synthetic/public**, never a default compliance threshold.

## 14. Validation of the calculator itself

Deterministic unit tests for ordinal range, TOST and cumulative level; regression tests against EMSS cases; property tests for monotonicity and active-path dependence; numerical cross-check against trusted scipy/R equivalence calculations; independent expert review of lifecycle mapping; human study against model-centered template; browser/offline compatibility; and JSON schema round-trip tests. Document test data provenance and software version. Passing software tests validates engine implementation to its specification, **not** the scientific validity of the author-proposed ladder/index or the suitability of any model for regulated use.
