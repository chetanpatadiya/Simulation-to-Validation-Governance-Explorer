export const LEVELS=[
  {name:'Understanding', model:'Purpose, structure, assumptions and exclusions documented',interface:'Purpose, transfer semantics and exclusions documented',use:'Hypotheses and conceptual mapping'},
  {name:'Engineering exploration',model:'Logic, equations, code and implementation verified',interface:'Units, definitions, routing and code verified',use:'Compare alternatives during exploration'},
  {name:'Test prioritization',model:'Benchmark/pilot/reference comparison and limitations characterized',interface:'Data exchange benchmarked and uncertainty characterized',use:'Prioritize physical test conditions'},
  {name:'Candidate recommendation',model:'Independent predictive acceptance, boundary behavior and uncertainty characterized',interface:'End-to-end interface independently checked at boundaries',use:'Propose candidate conditions for physical confirmation'},
  {name:'Monitored support',model:'Prospective monitoring, drift governance and review triggers',interface:'Live interface monitoring and controlled changes',use:'Ongoing controlled support within intended use'}
];
export const PHASES={
  design_inputs:'Design inputs and risk',
  materials:'Material / SBS design',
  design_verification:'Design verification',
  process_development:'Process development',
  process_validation:'Packaging process validation',
  transfer_monitoring:'Transfer and lifecycle monitoring'
};
/** Suggested topics, not automatic or universal requirements. */
const task=(id,title,category)=>({id,title,category,status:'OPEN',recordRef:'',rationale:''});
export function suggestedObligations(phase){
  const sets={
    design_inputs:[task('req','Link approved packaging requirements and acceptance basis','Requirements'),task('risk','Link existing ISO 14971 risk-file evaluation','Risk linkage')],
    materials:[task('suitability','Evaluate packaging material and SBS suitability','Design evidence'),task('compatibility','Evaluate required material/process/device compatibility','Design evidence')],
    design_verification:[task('strength','Assess strength or opening-performance claims where relevant','Physical verification'),task('integrity','Assess sterile barrier integrity mechanisms where relevant','Physical verification'),task('distribution','Evaluate distribution/storage/sterilization effects as applicable','Physical verification'),task('aging','Evaluate aging and lifetime evidence as applicable','Physical verification')],
    process_development:[task('doe','Physical DOE / process-window investigation','Process development'),task('limits','Confirm candidate settings and relevant boundary conditions','Process development')],
    process_validation:[task('iq','Review equipment/installation qualification applicability','Process qualification'),task('oq','Review operational qualification and worst-case process limits','Process qualification'),task('pq','Review performance qualification and routine reproducibility','Process qualification')],
    transfer_monitoring:[task('transfer','Review site/equipment comparability and scope','Transfer'),task('change','Document change-control and model re-evaluation triggers','Change control'),task('monitor','Assess process/model monitoring and drift controls','Monitoring')]
  };
  return structuredClone(sets[phase]||sets.process_development);
}
export const EVIDENCE_STATES=['PASS','FAIL','UNKNOWN','NOT_EVALUATED','NOT_APPLICABLE'];
export const TASK_STATES=['OPEN','PLANNED','EVIDENCE_LINKED','REVIEWED','NOT_APPLICABLE_WITH_JUSTIFICATION'];
export const SOURCES=['SYNTHETIC','PUBLIC_AGGREGATE','USER_ENTERED'];
export const MODEL_TYPES=['statistical','mechanistic','DES','AI','other'];
export function newComponent(id='MODEL',kind='statistical',active=true){return {id,kind,active,gates:['NOT_EVALUATED','NOT_EVALUATED','NOT_EVALUATED','NOT_EVALUATED','NOT_EVALUATED'],evidenceRefs:['','','','',''],notes:''};}
export function newInterface(id='INTERFACE'){return {id,active:true,gates:['NOT_EVALUATED','NOT_EVALUATED','NOT_EVALUATED','NOT_EVALUATED','NOT_EVALUATED'],evidenceRefs:['','','','',''],notes:''};}
export function newEquipment(id){return {id,mean:26,sd:1.5,n:30};}
export function blankScenario(){return {
 schemaVersion:'SVG-0.1',id:'NEW-DECISION',title:'New packaging model-use assessment',provenance:'USER_ENTERED',phase:'process_development',
 requirementId:'',requirementText:'',acceptanceBasis:'',claim:'',modelOutput:'',requestedLevel:2,
 alignment:{outputAlignment:'UNKNOWN',mechanismCoverage:'UNKNOWN',couScope:'UNKNOWN',rationale:''},
 priority:{influence:3,uncertainty:3,consequence:3,rationale:''},
 models:[newComponent('MODEL-1')],interfaces:[],
 comparability:{enabled:false,transferRequired:false,delta:2,alpha:0.05,units:'lb',conditions:'',marginRationale:'',instances:[newEquipment('E1'),newEquipment('E2')]},
 obligations:suggestedObligations('process_development'),changeTriggers:'Material, tooling, equipment, data, algorithm or acceptance-criterion changes',exclusions:'No test waiver, product release or autonomous compliance decision.'
};}
