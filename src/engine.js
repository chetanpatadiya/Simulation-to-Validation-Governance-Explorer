import {compareEquipment} from './statistics.js';
import {LEVELS,PHASES} from './catalog.js';
export const METHOD_VERSION='SVG-ALG-001/0.1.0';
export const SCHEMA_VERSION='SVG-0.1';
const finiteScore=n=>Number.isInteger(n)&&n>=1&&n<=5;
const isLevel=n=>Number.isInteger(n)&&n>=0&&n<=4;
const trim=x=>typeof x==='string'?x.trim():'';

/** Max cumulative PASSED gate; null = L0 unsupported. Never treat NOT_APPLICABLE as PASS. */
export function supportedLevel(gates,evidenceRefs=null) {
  if(!Array.isArray(gates)||gates.length!==5)return null;
  let highest=null;
  for(let i=0;i<5;i++){if(gates[i]!=='PASS')break;if(evidenceRefs && !trim(evidenceRefs[i]))break;highest=i;}
  return highest;
}
export function priorityIndex(p){
  if(!p||![p.influence,p.uncertainty,p.consequence].every(finiteScore))return null;
  return p.influence*p.uncertainty*p.consequence;
}
export function evaluateScenario(s) {
  const gaps=[],warnings=[],path=[];
  const push=(code,message)=>gaps.push({code,message});
  const eq=compareEquipment(s?.comparability);
  const taskStatus={total:s?.obligations?.length??0,open:0,reviewed:0,unresolved:[]};
  for(const task of s?.obligations||[]){
    const resolved=task.status==='REVIEWED'||(task.status==='NOT_APPLICABLE_WITH_JUSTIFICATION'&&trim(task.rationale));
    if(resolved) taskStatus.reviewed++;
    else {taskStatus.open++;taskStatus.unresolved.push(task.title||task.id||'Unspecified evidence');}
    if(task.status==='NOT_APPLICABLE_WITH_JUSTIFICATION'&&!trim(task.rationale))push('TASK_JUSTIFICATION',`${task.title||'An evidence item'}: exclusion requires a justification.`);
  }
  if(!trim(s?.requirementId))push('REQUIREMENT_ID','A design requirement reference is missing.');
  if(!trim(s?.requirementText))push('REQUIREMENT_TEXT','Define the underlying engineering requirement.');
  if(!trim(s?.acceptanceBasis))push('ACCEPTANCE_BASIS','Acceptance basis is missing or unlinked.');
  if(!trim(s?.claim))push('CLAIM','Specify the exact claim the model is meant to support.');
  if(!trim(s?.modelOutput))push('OUTPUT','Specify the model output.');
  if(!trim(s?.alignment?.rationale))warnings.push('Claim-to-model applicability rationale is not documented.');
  if(!PHASES[s?.phase])push('LIFECYCLE_PHASE','Recognized packaging lifecycle phase required.');
  if(!isLevel(s?.requestedLevel))push('REQUESTED_LEVEL','Requested level must be 0–4.');
  if(!Array.isArray(s?.models)||s.models.length===0)push('MODELS','At least one model is required.');
  const activeModels=(Array.isArray(s?.models)?s.models:[]).filter(x=>x?.active);
  const activeInterfaces=(Array.isArray(s?.interfaces)?s.interfaces:[]).filter(x=>x?.active);
  if(!activeModels.length)push('ACTIVE_PATH','Select at least one active model.');
  for(const group of [{kind:'Model',list:activeModels},{kind:'Interface',list:activeInterfaces}])for(const component of group.list){
    const rawLevel=supportedLevel(component.gates);
    const level=supportedLevel(component.gates,component.evidenceRefs);
    if(rawLevel!==null && (level===null || level<rawLevel))push('EVIDENCE_REFERENCE',`${group.kind} ${component.id||'(unnamed)'} has a PASS gate without an evidence reference at L${level===null?0:level+1}.`);
    path.push({type:group.kind,id:component.id||'(unnamed)',level,gateStates:component.gates});
    if(level===null)push('EVIDENCE_L0',`${group.kind} ${component.id||'(unnamed)'} has no passed L0 evidence gate.`);
    else if(level<4)warnings.push(`${group.kind} ${component.id||'(unnamed)'} is capped at L${level}: ${LEVELS[level+1].name} gate is ${component.gates[level+1]||'missing'}.`);
  }
  if(s?.comparability?.enabled) {
    if(eq.status==='INVALID')push('TOST_INVALID',`Equipment analysis incomplete: ${eq.warnings.join(' ')}`);
    else if(eq.status==='NOT_ESTABLISHED')warnings.push('Mean equivalence not established for every evaluated equipment comparison.');
    if(eq.status!=='INVALID'&&eq.warnings.length)warnings.push(...eq.warnings);
  }
  const priority=priorityIndex(s?.priority);
  if(priority===null)warnings.push('Review-priority inputs are incomplete or outside the 1–5 scale. No priority index computed.');
  const base={methodVersion:METHOD_VERSION,scenarioId:s?.id||'',priority,comparison:eq,tasks:taskStatus,gaps,warnings,path,
    evidenceMax:null,proposedLevel:null,disposition:'BLOCKED_INCOMPLETE',explanation:'',scope:'Decision-support draft only. Human review and applicable physical evidence remain necessary.'};
  if(gaps.some(x=>['REQUIREMENT_ID','REQUIREMENT_TEXT','CLAIM','OUTPUT','LIFECYCLE_PHASE','REQUESTED_LEVEL','MODELS','ACTIVE_PATH','EVIDENCE_L0'].includes(x.code))) {
    base.explanation='Essential claim, requirement or active-path evidence is incomplete; no use classification is proposed.';
    return base;
  }
  const a=s?.alignment||{};
  if(a.outputAlignment!=='DIRECT'||a.mechanismCoverage!=='FULL'||a.couScope!=='WITHIN') {
    base.disposition='CLAIM_NOT_SUPPORTED_OR_REFRAME';
    base.explanation=`Claim alignment not demonstrated: output ${a.outputAlignment||'UNKNOWN'}, mechanism ${a.mechanismCoverage||'UNKNOWN'}, context ${a.couScope||'UNKNOWN'}. A narrower claim and/or independent physical evidence may be required.`;
    push('ALIGNMENT','The current model output, mechanisms or context do not fully support this claim.');
    return base;
  }
  if(s?.comparability?.transferRequired && (!s.comparability.enabled||eq.status!=='ESTABLISHED_FOR_TESTED_MEANS')){
    base.disposition='SCOPE_TRANSFER_BLOCKED';
    base.explanation='Claim requests cross-equipment transfer, but the requested mean-equivalence evidence is missing, incomplete or not established. Reframe to individual equipment or obtain justified transfer evidence.';
    push('TRANSFER','Family-level promotion is blocked. Mean equivalence at tested conditions alone never proves full-window comparability.');
    base.localOnlyEvidenceMax=path.length?Math.min(...path.map(p=>p.level)):null;
    return base;
  }
  if(!path.length || path.some(x=>x.level===null)){
    base.explanation='One or more required model/interface L0 evidence gates are unsupported.'; return base;
  }
  const max=Math.min(...path.map(x=>x.level));
  base.evidenceMax=max;
  base.proposedLevel=Math.min(max,s.requestedLevel);
  if(max<s.requestedLevel){
    base.disposition='DOWNGRADE_REQUIRED';
    const limiters=path.filter(x=>x.level===max).map(x=>`${x.type} ${x.id}`).join(', ');
    base.explanation=`L${s.requestedLevel} was requested, but the active-path maximum is L${max}. Limiting dependencies: ${limiters}. Proposed narrower use: ${LEVELS[max].use}.`;
    push('LEVEL_CAP',`Unsupported L${s.requestedLevel} request; maximum is L${max}.`);
  } else {
    base.disposition='PROPOSED_WITHIN_EVIDENCE';
    base.explanation=`The active-path evidence supports a proposed L${s.requestedLevel} model-use classification within the stated claim and context. This is not validation approval or a test waiver.`;
  }
  if(gaps.some(x=>x.code==='ACCEPTANCE_BASIS'||x.code==='TASK_JUSTIFICATION')) {
    warnings.push('Evidence/traceability gaps remain; do not treat the proposed model-use level as a completed packaging design or process-validation decision.');
  }
  return base;
}
