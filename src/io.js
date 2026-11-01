import {blankScenario} from './catalog.js';
const knownStates=new Set(['PASS','FAIL','UNKNOWN','NOT_APPLICABLE','NOT_EVALUATED']);
function safeStr(v,max=2000){return typeof v==='string'?v.slice(0,max):'';}
function num(v,fallback){return typeof v==='number'&&Number.isFinite(v)?v:fallback;}
const bool=v=>v===true;
function component(obj={}){return {id:safeStr(obj.id,80),kind:safeStr(obj.kind,30),active:bool(obj.active),gates:Array.from({length:5},(_,i)=>knownStates.has(obj.gates?.[i])?obj.gates[i]:'NOT_EVALUATED'),evidenceRefs:Array.from({length:5},(_,i)=>safeStr(obj.evidenceRefs?.[i],300)),notes:safeStr(obj.notes)};}
/** Import exact supported properties only; no prototype pollution or external references. */
export function normalizeImport(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Expected a scenario JSON object.');
  if(raw.schemaVersion!=='SVG-0.1')throw new Error('Only SVG-0.1 scenario JSON is supported.');
  if(!Array.isArray(raw.models)||raw.models.length>40||!Array.isArray(raw.interfaces)||raw.interfaces.length>40||!Array.isArray(raw.obligations)||raw.obligations.length>50)throw new Error('Malformed or oversized model/interface/obligation list.');
  const s=blankScenario();
  for(const k of ['id','title','requirementId','requirementText','acceptanceBasis','claim','modelOutput','changeTriggers','exclusions'])s[k]=safeStr(raw[k]);
  s.provenance=['SYNTHETIC','PUBLIC_AGGREGATE','USER_ENTERED'].includes(raw.provenance)?raw.provenance:'USER_ENTERED';
  s.phase=safeStr(raw.phase,60);
  s.requestedLevel=num(raw.requestedLevel,NaN);
  s.alignment={outputAlignment:safeStr(raw.alignment?.outputAlignment,25),mechanismCoverage:safeStr(raw.alignment?.mechanismCoverage,25),couScope:safeStr(raw.alignment?.couScope,25),rationale:safeStr(raw.alignment?.rationale)};
  s.priority={influence:num(raw.priority?.influence,NaN),uncertainty:num(raw.priority?.uncertainty,NaN),consequence:num(raw.priority?.consequence,NaN),rationale:safeStr(raw.priority?.rationale)};
  s.models=raw.models.map(component);s.interfaces=raw.interfaces.map(component);
  s.obligations=raw.obligations.map(x=>({id:safeStr(x.id,80),title:safeStr(x.title,300),category:safeStr(x.category,120),status:safeStr(x.status,45),recordRef:safeStr(x.recordRef,300),rationale:safeStr(x.rationale)}));
  const c=raw.comparability||{};
  if(c.instances && (!Array.isArray(c.instances)||c.instances.length>12))throw new Error('Too many equipment instances; limit is 12.');
  s.comparability={enabled:bool(c.enabled),transferRequired:bool(c.transferRequired),delta:num(c.delta,NaN),alpha:num(c.alpha,NaN),units:safeStr(c.units,30),conditions:safeStr(c.conditions),marginRationale:safeStr(c.marginRationale),instances:(c.instances||[]).map(x=>({id:safeStr(x.id,80),mean:num(x.mean,NaN),sd:num(x.sd,NaN),n:num(x.n,NaN)}))};
  return s;
}
export function downloadJson(name,object){
  const bytes=JSON.stringify(object,null,2);
  const blob=new Blob([bytes],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name.replace(/[^a-z0-9_.-]/gi,'_');a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
export function reportDocument(s,e){
  return {reportType:'DRAFT_MODEL_USE_EVIDENCE_ROUTING',createdAt:new Date().toISOString(),appVersion:'0.1.0',methodVersion:e.methodVersion,scenario:s,evaluation:e,disclaimer:'Not a compliant/validated QMS record; not a test waiver, product release, or approval. All claims must undergo human review and applicable physical verification/validation.'};
}
