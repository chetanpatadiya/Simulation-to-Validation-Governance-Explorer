# Standards and regulatory traceability (non-normative)

This table maps **themes**, not exact clauses or compliance claims. Applicable published versions and company-controlled copies must be checked by qualified personnel before use in regulated activities.

| Source and edition | Verified scope | SVG mapping | Important limitation |
|---|---|---|---|
| ASME V&V 40-2018 | Risk-informed assessment of model credibility in medical devices | Consume context of use, influence/consequence, V&V evidence and credibility rationale | SVG does not implement or certify ASME V&V 40 compliance; ASME V&V 40 is not a numeric credibility formula |
| ASME VVUQ 40.1-2026 | Worked application of V&V 40 to a tibial-tray mechanical-test model | Comparative benchmark for explicit evidence records | A new report, not evidence that SVG's lifecycle premise is novel |
| ASME VVUQ 50.1-2025 | Computational model lifecycle incorporating V&V and UQ | Version/review-trigger lifecycle context | Lifecycle integration is not uniquely invented by SVG |
| FDA CM&S guidance, November 2023 | Credibility of physics-based/mechanistic CM&S in medical-device submissions | Governs relevant physical modeling credibility evidence strategy | Does not automatically extend to standalone AI/ML inspections |
| ISO 11607-1:2019 + Amd 1:2023 | Requirements for packaging materials, sterile barrier systems and packaging systems; risk management amendment | Packaging-system claim categories, design/performance evidence prompts | Does not imply that simulation can replace required physical evidence |
| ISO 11607-2:2019 + Amd 1:2023 | Development/validation of forming, sealing and assembly processes; risk management amendment | Process-validation evidence categories and transfer/review triggers | Tool cannot decide whether IQ/OQ/PQ is sufficient or mandatory in a given case |
| ISO 13485:2016, as incorporated in US FDA QMSR effective Feb. 2, 2026 | Medical device QMS, including design and development control and records | Design-input/output/V&V/change record links | Data export is not an approved QMS record without organization controls |
| ISO 14971:2019 | Medical-device risk management | Link existing hazard, hazardous situation, risk control and residual risk identifiers | I×U×C is **not** ISO 14971 risk and must never be substituted for a risk estimate |

## Claim categories for v0.1 prompt library

- Seal strength / peel behavior
- Seal integrity / continuous leak pathways
- Package-system protection during distribution/handling
- Sterilization compatibility and maintenance of sterile barrier
- Aging/storage performance
- Aseptic presentation and usability
- Sealing process window and operating capability
- Equipment-family/line transfer comparability

The user must select **the actual supported output and mechanism**, not merely a topic. For example, a high-quality seal-strength model is not automatically a predictive test for integrity; a shock/drop model does not automatically confirm aseptic presentation; and a process-window model does not itself establish a validated process.

## Sources checked November 1, 2026

- https://www.asme.org/codes-standards/find-codes-standards/assessing-credibility-of-computational-modeling-through-verification-and-validation-application-to-medical-devices
- https://www.asme.org/codes-standards/vvuq-standards
- https://www.fda.gov/regulatory-information/search-fda-guidance-documents/assessing-credibility-computational-modeling-and-simulation-medical-device-submissions
- https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-management-system-regulation-qmsr
- https://www.iso.org/standard/70799.html
- https://www.iso.org/standard/70800.html
- https://www.iso.org/standard/81823.html
- https://www.iso.org/standard/81248.html
- https://www.iso.org/standard/72704.html
- https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/results.cfm?referencenumber=11607&start_search=1
