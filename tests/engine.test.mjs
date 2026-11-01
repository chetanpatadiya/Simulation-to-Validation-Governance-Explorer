import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateScenario,supportedLevel,priorityIndex} from '../src/engine.js';
import {getExample} from '../src/examples.js';
import {blankScenario} from '../src/catalog.js';
import {welchTost,compareEquipment,studentTCdf,studentTQuantile,regularizedBeta} from '../src/statistics.js';

const evalEx=k=>evaluateScenario(getExample(k));
function clone(x){return structuredClone(x);}
function gates(level){return Array.from({length:5},(_,i)=>i<=level?'PASS':'NOT_EVALUATED');}

test('A — public aggregate benchmark supports L2, not proposed L3',()=>{
 const e=evalEx('a');assert.equal(e.disposition,'DOWNGRADE_REQUIRED');assert.equal(e.evidenceMax,2);assert.equal(e.proposedLevel,2);assert.equal(e.priority,80);
});
test('B — seal strength cannot substantiate direct seal integrity claim',()=>{
 const e=evalEx('b');assert.equal(e.disposition,'CLAIM_NOT_SUPPORTED_OR_REFRAME');assert.equal(e.evidenceMax,null);
});
test('C — minimum of active L3 RSM, L1 DES, L2 interface = L1',()=>{
 const e=evalEx('c');assert.equal(e.evidenceMax,1);assert.equal(e.disposition,'DOWNGRADE_REQUIRED');assert.ok(e.path.some(x=>x.id==='LINE-DES'&&x.level===1));assert.ok(!e.path.some(x=>x.id==='IMAGE-AI'));
});
test('D — bounding E1–E3 comparison blocks family transfer',()=>{
 const e=evalEx('d');assert.equal(e.disposition,'SCOPE_TRANSFER_BLOCKED');assert.equal(e.comparison.status,'NOT_ESTABLISHED');assert.equal(e.localOnlyEvidenceMax,3);
 const pairs=e.comparison.pairs;assert.equal(pairs.length,3);assert.deepEqual(pairs.map(p=>p.established),[true,false,true]);
});
test('E — evidence supports requested bounded test prioritization',()=>{
 const e=evalEx('e');assert.equal(e.disposition,'PROPOSED_WITHIN_EVIDENCE');assert.equal(e.evidenceMax,2);assert.equal(e.proposedLevel,2);
});
test('inactive model never reduces path authority',()=>{
 const s=getExample('c');s.models[1].active=false;s.interfaces[0].active=false;
 const e=evaluateScenario(s);assert.equal(e.evidenceMax,3);assert.equal(e.disposition,'PROPOSED_WITHIN_EVIDENCE');
});
test('active weak interface reduces path authority',()=>{
 const s=getExample('c');s.models[1].active=false;
 const e=evaluateScenario(s);assert.equal(e.evidenceMax,2);
});
test('L0 absent is unsupported, not L0',()=>{
 const s=getExample('a');s.models[0].gates[0]='UNKNOWN';const e=evaluateScenario(s);assert.equal(e.disposition,'BLOCKED_INCOMPLETE');assert.equal(e.evidenceMax,null);
});
test('PASS status without a referenced evidence item cannot raise authority',()=>{
 const s=getExample('e');s.models[0].evidenceRefs[2]='';
 const e=evaluateScenario(s);
 assert.equal(e.evidenceMax,1);assert.ok(e.gaps.some(x=>x.code==='EVIDENCE_REFERENCE'));
});
test('missing upper gate caps at last cumulative PASS',()=>{
 const s=getExample('a');s.models[0].gates=['PASS','PASS','PASS','UNKNOWN','PASS'];assert.equal(evaluateScenario(s).evidenceMax,2);
});
test('NOT_APPLICABLE upper gate does not silently pass',()=>assert.equal(supportedLevel(['PASS','PASS','NOT_APPLICABLE','PASS','PASS']),1));
test('NOT_APPLICABLE L0 is not L0 authorization',()=>assert.equal(supportedLevel(['NOT_APPLICABLE','PASS','PASS','PASS','PASS']),null));
test('requested level 0 still requires L0 evidence',()=>{const s=getExample('e');s.requestedLevel=0;assert.equal(evaluateScenario(s).proposedLevel,0);});
test('requested above path always downgrades, no averaging',()=>{const s=getExample('e');s.requestedLevel=4;assert.equal(evaluateScenario(s).proposedLevel,2);});
test('outside context blocks even if all evidence L4',()=>{const s=getExample('e');s.models[0].gates=gates(4);s.alignment.couScope='OUTSIDE';assert.equal(evaluateScenario(s).disposition,'CLAIM_NOT_SUPPORTED_OR_REFRAME');});
test('partial mechanism blocks even if all evidence L4',()=>{const s=getExample('e');s.models[0].gates=gates(4);s.alignment.mechanismCoverage='PARTIAL';assert.equal(evaluateScenario(s).disposition,'CLAIM_NOT_SUPPORTED_OR_REFRAME');});
test('indirect output blocks even if all evidence L4',()=>{const s=getExample('e');s.models[0].gates=gates(4);s.alignment.outputAlignment='INDIRECT';assert.equal(evaluateScenario(s).disposition,'CLAIM_NOT_SUPPORTED_OR_REFRAME');});
test('unknown applicability blocks',()=>{const s=getExample('e');s.alignment.outputAlignment='UNKNOWN';assert.equal(evaluateScenario(s).disposition,'CLAIM_NOT_SUPPORTED_OR_REFRAME');});
test('transfer disabled never blocks local claims',()=>{const s=getExample('d');s.comparability.transferRequired=false;assert.equal(evaluateScenario(s).disposition,'PROPOSED_WITHIN_EVIDENCE');});
test('transfer requested without analysis blocks transfer',()=>{const s=getExample('d');s.comparability.enabled=false;assert.equal(evaluateScenario(s).disposition,'SCOPE_TRANSFER_BLOCKED');});
test('successful illustrative transfer passes mean gate, never physical task signoff',()=>{const s=getExample('d');s.comparability.instances=s.comparability.instances.slice(0,2);const e=evaluateScenario(s);assert.equal(e.disposition,'PROPOSED_WITHIN_EVIDENCE');assert.ok(e.tasks.open>0);});
test('missing requirement ID blocks the engine',()=>{const s=getExample('e');s.requirementId='';assert.equal(evaluateScenario(s).disposition,'BLOCKED_INCOMPLETE');});
test('missing acceptance basis creates explicit gap',()=>{const s=getExample('e');s.acceptanceBasis='';const e=evaluateScenario(s);assert.ok(e.gaps.some(g=>g.code==='ACCEPTANCE_BASIS'));});
test('N/A without justification remains unresolved',()=>{const s=getExample('e');s.obligations[0].status='NOT_APPLICABLE_WITH_JUSTIFICATION';s.obligations[0].rationale='';const e=evaluateScenario(s);assert.equal(e.tasks.open,s.obligations.length);assert.ok(e.gaps.some(g=>g.code==='TASK_JUSTIFICATION'));});
test('N/A with justification clears only the declared evidence task',()=>{const s=getExample('e');s.obligations[0].status='NOT_APPLICABLE_WITH_JUSTIFICATION';s.obligations[0].rationale='Not applicable after reviewer scope evaluation';const e=evaluateScenario(s);assert.equal(e.tasks.open,s.obligations.length-1);});
test('unknown review-priority values do not make passing gates fail',()=>{const s=getExample('e');s.priority.uncertainty=0;const e=evaluateScenario(s);assert.equal(e.priority,null);assert.equal(e.disposition,'PROPOSED_WITHIN_EVIDENCE');});
test('IUC exact ordinal bounds',()=>{assert.equal(priorityIndex({influence:1,uncertainty:1,consequence:1}),1);assert.equal(priorityIndex({influence:5,uncertainty:5,consequence:5}),125);assert.equal(priorityIndex({influence:2.1,uncertainty:1,consequence:5}),null);});
test('Student t CDF agrees with standard t 95% quantile df=58',()=>{const q=studentTQuantile(0.95,58);assert.ok(Math.abs(q-1.671552762453162)<1e-8);assert.ok(Math.abs(studentTCdf(q,58)-0.95)<1e-10);});
test('Welch TOST reproduces E1-E3 synthetic 90% CI',()=>{const a={mean:26,sd:1.5,n:30},b={mean:24.4,sd:1.5,n:30};const r=welchTost(a,b,2,0.05);assert.ok(Math.abs(r.df-58)<1e-8);assert.ok(Math.abs(r.ci[0]-0.9526)<0.003);assert.ok(Math.abs(r.ci[1]-2.2474)<0.003);assert.equal(r.established,false);assert.ok(Math.abs(r.pUpper-0.1530)<.004);});
test('Welch TOST reproduces E1-E2 synthetic 90% CI',()=>{const r=welchTost({mean:26,sd:1.5,n:30},{mean:25.2,sd:1.5,n:30},2,.05);assert.equal(r.established,true);assert.ok(Math.abs(r.ci[0]-0.1526)<.003);});
test('TOST rejects invalid SD, sample size, alpha, margin',()=>{for(const [a,b,d,alpha] of [ [{mean:1,sd:0,n:5},{mean:1,sd:1,n:5},1,.05],[{mean:1,sd:1,n:1},{mean:1,sd:1,n:5},1,.05],[{mean:1,sd:1,n:5},{mean:1,sd:1,n:5},0,.05],[{mean:1,sd:1,n:5},{mean:1,sd:1,n:5},1,.5]])assert.throws(()=>welchTost(a,b,d,alpha),RangeError);});
test('regularized beta boundary conditions',()=>{assert.equal(regularizedBeta(0,2,3),0);assert.equal(regularizedBeta(1,2,3),1);assert.ok(Math.abs(regularizedBeta(.5,2,2)-.5)<1e-12);});
test('blank new scenario has no authorized decision',()=>{const e=evaluateScenario(blankScenario());assert.notEqual(e.disposition,'PROPOSED_WITHIN_EVIDENCE');});

// Bounded exhaustive and randomless monotonicity / active-path sweeps.
for(let max=0;max<=4;max++){
  test(`monotonicity: increasing cumulative evidence from L${max} cannot lower maximum`,()=>{
    const s=getExample('e');s.models[0].gates=gates(max);let prev=evaluateScenario(s).evidenceMax;
    for(let k=max+1;k<=4;k++){s.models[0].gates=gates(k);const next=evaluateScenario(s).evidenceMax;assert.ok(next>=prev);prev=next;}
  });
}
for(const alignment of ['outputAlignment','mechanismCoverage','couScope']){
 test(`negative applicability sweep: ${alignment} never improves authority`,()=>{
  const s=getExample('e');const before=evaluateScenario(s);
  for(const bad of (alignment==='outputAlignment'?['INDIRECT','NONE','UNKNOWN']:alignment==='mechanismCoverage'?['PARTIAL','NONE','UNKNOWN']:['BOUNDARY','OUTSIDE','UNKNOWN'])){
   const x=clone(s);x.alignment[alignment]=bad;const after=evaluateScenario(x);assert.equal(after.evidenceMax,null);assert.equal(after.disposition,'CLAIM_NOT_SUPPORTED_OR_REFRAME');assert.ok(before.evidenceMax>after.evidenceMax||after.evidenceMax===null);
  }
 });
}
for(let i=0;i<5;i++)for(let j=0;j<5;j++){
 test(`path minimum property L${i} + L${j}`,()=>{
   const s=getExample('e');s.models=[{...s.models[0],id:'A',gates:gates(i)},{...s.models[0],id:'B',gates:gates(j)}];
   assert.equal(evaluateScenario(s).evidenceMax,Math.min(i,j));
 });
}
