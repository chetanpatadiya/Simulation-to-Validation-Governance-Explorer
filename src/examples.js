import {blankScenario,newComponent,newInterface,suggestedObligations,newEquipment} from './catalog.js';
const gates=level=>Array.from({length:5},(_,i)=>i<=level?'PASS':'NOT_EVALUATED');
function model(id,kind,level,active=true){const m=newComponent(id,kind,active);m.gates=gates(level);m.evidenceRefs=Array.from({length:5},(_,i)=>`DEMO-${id}-GATE-L${i} (illustrative reviewer reference only)`);m.notes='Illustrative reviewer-entered assessment — not independent model qualification.';return m;}
function base(id,title,phase,source){const s=blankScenario();Object.assign(s,{id,title,phase,provenance:source,requestedLevel:3});s.obligations=suggestedObligations(phase);s.requirementId='EXAMPLE-REQ-01';s.requirementText='Define and verify relevant sterile barrier packaging performance for the product and process.';s.acceptanceBasis='Example criteria only — replace with approved design inputs before real use.';s.alignment={outputAlignment:'DIRECT',mechanismCoverage:'FULL',couScope:'WITHIN',rationale:'Illustrative assumption confined to the described claim, output and tested domain.'};s.priority={influence:4,uncertainty:4,consequence:5,rationale:'Synthetic ordinal ratings for review-priority illustration; not a device-risk estimate.'};return s;}
const a=base('A-RSM-PREDICTION-GAP','Public benchmark: strong fit, weak prediction','process_development','PUBLIC_AGGREGATE');
a.claim='Recommend a candidate heat-sealing window using a seal-strength response surface.';
a.modelOutput='Predicted seal strength from coded temperature, dwell, pressure and material temperature.';
a.models=[model('SEAL-RSM','statistical',2)];a.models[0].gates[3]='FAIL';a.models[0].evidenceRefs[0]='EMSS 2026 manuscript Sections 1–3 (documented context)';a.models[0].evidenceRefs[1]='Minitab public response-surface DOE example (published model)';a.models[0].evidenceRefs[2]='Minitab published fit diagnostics: R² 78.58%; predicted R² 0.00%';a.models[0].notes='Published benchmark: R² 78.58%, predicted R² 0.00%, significant lack of fit. Author-proposed L2 interpretation from EMSS manuscript; not independently reproduced from raw data.';
a.changeTriggers='New material, sealing tool, factor range or new independent predictive dataset.';

const b=base('B-STRENGTH-NOT-INTEGRITY','Synthetic: strength model cannot prove leak integrity','design_verification','SYNTHETIC');
b.claim='Sterile barrier system has no continuous leak pathways.';
b.requirementText='Sterile barrier integrity must be demonstrated through relevant verified mechanisms.';
b.modelOutput='Predicted mean seal peel strength (force).';
b.alignment={outputAlignment:'INDIRECT',mechanismCoverage:'PARTIAL',couScope:'WITHIN',rationale:'Peel strength is not a direct measure of continuous seal leak paths.'};
b.models=[model('STRENGTH-RSM','statistical',3)];
b.priority={influence:5,uncertainty:3,consequence:5,rationale:'Hypothetical values for explaining scope mismatch.'};

const c=base('C-COUPLED-ACTIVE-PATH','Synthetic: interface-aware coupled model cap','process_development','SYNTHETIC');
c.claim='Recommend a candidate sealing window with operational feasibility supported by coupled process and line-flow models.';
c.modelOutput='Response-surface window combined with process execution and downtime estimates.';
c.models=[model('SEAL-RSM','statistical',3),model('LINE-DES','DES',1),model('IMAGE-AI','AI',0,false)];
c.interfaces=[{...newInterface('RSM-TO-DES'),gates:gates(2),evidenceRefs:Array.from({length:5},(_,i)=>`SYNTHETIC-INTERFACE-L${i}`),notes:'Synthetic interface evidence: verified units and benchmark, no independent end-to-end L3 evidence.'}];

const d=base('D-EQUIPMENT-FAMILY','Synthetic: bounding equipment comparison','process_validation','SYNTHETIC');
d.claim='Recommend a family-level candidate sealing condition transferable among E1, E2 and E3.';
d.modelOutput='Seal-strength mean estimate at one specified center-point condition.';
d.models=[model('SEAL-RSM','statistical',3)];
d.comparability={enabled:true,transferRequired:true,units:'lb',alpha:0.05,delta:2,conditions:'Synthetic center point only; not the full process window.',marginRationale:'Illustrative ±2.0 lb margin; not a product-based justification.',instances:[{id:'E1',mean:26,sd:1.5,n:30},{id:'E2',mean:25.2,sd:1.5,n:30},{id:'E3',mean:24.4,sd:1.5,n:30}]};

const e=base('E-L2-PLANNING','Synthetic: bounded model use for test planning','process_development','SYNTHETIC');
e.requestedLevel=2;
e.claim='Prioritize experimental sealing conditions for physical DOE.';
e.modelOutput='Relative predicted seal-strength response across the studied coded input range.';
e.models=[model('EXPLORATORY-RSM','statistical',2)];
e.priority={influence:3,uncertainty:3,consequence:3,rationale:'Illustrative review-priority entries.'};

export const examples={a,b,c,d,e};
export const EXAMPLE_LABELS={a:'A · Public RSM benchmark',b:'B · Strength ≠ integrity',c:'C · Coupled-model bottleneck',d:'D · Equipment TOST',e:'E · Acceptable L2 planning'};
export function getExample(key){return structuredClone(examples[key]||examples.a);}
