/** Pure numerical routines. No external libraries or network access. */
const LANCZOS = [0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];

export function logGamma(z) {
  if (!Number.isFinite(z) || z <= 0) throw new RangeError('Gamma argument must be positive and finite');
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI*z)) - logGamma(1-z);
  z -= 1;
  let x=LANCZOS[0];
  for(let j=1;j<LANCZOS.length;j++) x+=LANCZOS[j]/(z+j);
  const t=z+7.5;
  return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);
}
function betaContinuedFraction(a,b,x) {
  const eps=3e-14, fpMin=1e-300;
  let qab=a+b, qap=a+1, qam=a-1;
  let c=1, d=1-qab*x/qap;
  if(Math.abs(d)<fpMin) d=fpMin;
  d=1/d;
  let h=d;
  for(let m=1;m<=300;m++) {
    const m2=2*m;
    let aa=m*(b-m)*x/((qam+m2)*(a+m2));
    d=1+aa*d; if(Math.abs(d)<fpMin)d=fpMin;
    c=1+aa/c; if(Math.abs(c)<fpMin)c=fpMin;
    d=1/d; h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
    d=1+aa*d; if(Math.abs(d)<fpMin)d=fpMin;
    c=1+aa/c; if(Math.abs(c)<fpMin)c=fpMin;
    d=1/d; const delta=d*c; h*=delta;
    if(Math.abs(delta-1)<eps) return h;
  }
  throw new Error('Incomplete beta continued fraction did not converge');
}
/** Regularized incomplete beta I_x(a,b) for positive a,b and 0≤x≤1. */
export function regularizedBeta(x,a,b) {
  if(!(x>=0 && x<=1 && a>0 && b>0) || ![x,a,b].every(Number.isFinite)) throw new RangeError('Invalid beta input');
  if(x===0)return 0;
  if(x===1)return 1;
  const bt=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));
  return Math.min(1,Math.max(0,x<(a+1)/(a+b+2) ? bt*betaContinuedFraction(a,b,x)/a : 1-bt*betaContinuedFraction(b,a,1-x)/b));
}
/** Student t cumulative distribution F(t; degrees of freedom). */
export function studentTCdf(t,df) {
  if(!Number.isFinite(df) || df<=0 || Number.isNaN(t))throw new RangeError('Invalid Student t arguments');
  if(t===Infinity)return 1;
  if(t===-Infinity)return 0;
  if(t===0)return 0.5;
  const tail=0.5*regularizedBeta(df/(df+t*t),df/2,0.5);
  return t<0 ? tail : 1-tail;
}
/** Quantile via bisection, only upper half needed for TOST CI. */
export function studentTQuantile(p,df) {
  if(!(p>0 && p<1 && df>0) || !Number.isFinite(df))throw new RangeError('Invalid Student t quantile arguments');
  if(p===0.5)return 0;
  if(p<0.5)return -studentTQuantile(1-p,df);
  let lo=0,hi=1;
  while(studentTCdf(hi,df)<p) {hi*=2;if(hi>1e12)throw new Error('Quantile search failed');}
  for(let i=0;i<110;i++) {const mid=(lo+hi)/2;if(studentTCdf(mid,df)<p)lo=mid;else hi=mid;}
  return (lo+hi)/2;
}
const positive=x=>Number.isFinite(x)&&x>0;
/**
 * Welch TOST for two independent groups; testing mean equivalence only.
 * Throws on invalid input, never reports "equivalent" for incomplete data.
 */
export function welchTost(a,b,delta,alpha=0.05) {
  if(!a || !b || ![a.mean,b.mean].every(Number.isFinite) ||
    ![a.sd,b.sd].every(positive) || ![a.n,b.n].every(x=>Number.isInteger(x)&&x>=2) ||
    !positive(delta) || !Number.isFinite(alpha) || alpha<=0 || alpha>=0.5) {
    throw new RangeError('TOST needs finite means, SD>0, integer n>=2, Δ>0 and 0<α<0.5');
  }
  const v1=a.sd*a.sd/a.n, v2=b.sd*b.sd/b.n;
  const se=Math.sqrt(v1+v2);
  const df=(v1+v2)**2/(v1*v1/(a.n-1)+v2*v2/(b.n-1));
  const difference=a.mean-b.mean;
  const critical=studentTQuantile(1-alpha,df);
  const ci=[difference-critical*se,difference+critical*se];
  const pLower=1-studentTCdf((difference+delta)/se,df);
  const pUpper=studentTCdf((difference-delta)/se,df);
  const established=pLower<alpha && pUpper<alpha;
  return {difference,se,df,ci,pLower,pUpper,alpha,delta,established};
}
export function compareEquipment(config) {
  if(!config?.enabled) return {enabled:false, required:false, status:'NOT_REQUESTED',pairs:[],warnings:[]};
  const items=config.instances;
  if(!Array.isArray(items)||items.length<2||items.length>12) return {enabled:true, required:Boolean(config.transferRequired),status:'INVALID',pairs:[],warnings:['Provide 2–12 equipment instances.']};
  const pairs=[], warnings=[];
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
    try {
      const result=welchTost(items[i],items[j],config.delta,config.alpha);
      pairs.push({a:items[i].id,b:items[j].id,...result});
    } catch(e){warnings.push(`${items[i].id||i} / ${items[j].id||j}: ${e.message}`);}
  }
  const conditions=(config.conditions||'').trim();
  if(!conditions)warnings.push('Conditions and tested domain are not documented.');
  if(!String(config.marginRationale||'').trim())warnings.push('Equivalence margin rationale has not been documented.');
  const status=warnings.length || pairs.length!==items.length*(items.length-1)/2?'INVALID':pairs.every(x=>x.established)?'ESTABLISHED_FOR_TESTED_MEANS':'NOT_ESTABLISHED';
  return {enabled:true,required:Boolean(config.transferRequired),status,pairs,warnings,scope:'Statistical mean equivalence at the stated test conditions only; not full operating-window or regulatory qualification.'};
}
