# GitHub Architecture — SVG Explorer v0.1

**Status:** implementation architecture only, not implemented software.

## Recommended stack

A local-first static web application with **React + TypeScript + Vite**, a pure TypeScript decision engine and Vitest tests. Deploy from an independent repository to GitHub Pages or Cloudflare Pages. No server, AI endpoint, or employer data integration is needed for v0.1. Keep evaluation functions independent from UI components to enable reproducible evidence and boundary testing.

## Proposed repository layout

```text
svg-explorer/
├── README.md
├── package.json
├── vite.config.ts
├── src/
│   ├── domain/types.ts
│   ├── domain/scenario-schema.ts
│   ├── engine/applicability.ts
│   ├── engine/levels.ts
│   ├── engine/active-path.ts
│   ├── engine/priority.ts
│   ├── engine/equivalence.ts
│   ├── engine/evidence-router.ts
│   ├── engine/decision.ts
│   ├── components/ClaimDefinition.tsx
│   ├── components/EvidenceAssessment.tsx
│   ├── components/ActivePathEditor.tsx
│   ├── components/ComparabilityPanel.tsx
│   ├── components/DecisionReport.tsx
│   └── export/decision-json.ts
├── public/demo/
├── tests/unit/
├── tests/regression/
├── tests/property/
├── tests/fixtures/
├── docs/
└── examples/scenarios.json
```

## Type contracts

```ts
type EvidenceState = 'PASS' | 'FAIL' | 'UNKNOWN' | 'NOT_APPLICABLE' | 'NOT_EVALUATED';
type OutputAlignment = 'DIRECT' | 'INDIRECT' | 'NONE' | 'UNKNOWN';
type MechanismCoverage = 'FULL' | 'PARTIAL' | 'NONE' | 'UNKNOWN';
type ContextScope = 'WITHIN' | 'BOUNDARY' | 'OUTSIDE' | 'UNKNOWN';
type Level = 0 | 1 | 2 | 3 | 4;
type Disposition = 'PROPOSED_WITHIN_EVIDENCE' | 'DOWNGRADE_REQUIRED'
  | 'CLAIM_NOT_SUPPORTED_OR_REFRAME' | 'SCOPE_TRANSFER_BLOCKED'
  | 'BLOCKED_INCOMPLETE';
```

No engine path may emit approval, conformity, testing waiver, process release or product release. Human review remains independent.

## Evaluation order

1. Define packaging requirement and specific engineering claim.
2. Match the model **output** to the claim and check mechanism completeness.
3. Confirm the stated context of use and scope of extrapolation.
4. Apply cumulative L0–L4 evidence gates to relevant active components.
5. Apply the interface-aware minimum rule to the active decision path.
6. Apply optional cross-equipment TOST gate only when transfer is claimed.
7. Compute I×U×C as a separate prioritization measure only.
8. Generate physical-evidence planning prompts and QMS record linkage.
9. Export explainable, versioned **draft** report with unresolved issues.

The engine must make every limiter transparent. All validation outcomes are calculated from a versioned rules configuration and explicit source-labeled inputs.

## Security, publication and IP

Client-side evaluation; local JSON input/output; no data upload or third-party analytics by default. Local browser state is not an approved QMS record. Restrict demos to public or synthetic information. Review publisher rights and employer IP before publishing manuscript-derived prose/figures. Choose an open-source license only after review.

## GitHub milestones

**M1:** Create pure-domain types, data validation, deterministic engine and 30 regression tests; independent TOST numerical cross-check and monotonicity properties.

**M2:** Build mobile-compatible UI for claim definition, evidence gates, active dependency path, evidence plan and export.

**M3:** Build optional TOST and comparative demo with public/synthetic scenarios.

**M4:** Study comparative usefulness against a faithful V&V-only baseline with independent technical review.

**M5:** Publish release tagged with disclaimers, source references, test report and method version; revisit v0.2 evidence adapters.

Prioritize **tested rules before presentation polish**. The initial release should be narrow: one engineering claim evaluated against one declared active model-dependency path.
