import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';

const port=4317;
const root=await mkdtemp(join(tmpdir(),'ecofood-test-'));
const dataPath=join(root,'ecofood.json');
const child=spawn(process.execPath,['server.mjs'],{
  cwd:new URL('..',import.meta.url),
  env:{...process.env,ECOFOOD_PORT:String(port),ECOFOOD_DATA_PATH:dataPath},
  stdio:['ignore','pipe','pipe']
});
await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('server timeout')),5000);
  child.stdout.on('data',chunk=>{if(String(chunk).includes('EcoFood ATU server')){clearTimeout(timer);resolve()}});
  child.once('error',reject);
});

async function login(email){
  const response=await fetch(`http://127.0.0.1:${port}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password:'demo2026'})});
  assert.equal(response.status,200);
  return {cookie:response.headers.get('set-cookie').split(';')[0],state:await response.json()};
}
async function request(path,cookie,method='GET',payload){
  return fetch(`http://127.0.0.1:${port}${path}`,{method,headers:{cookie,'content-type':'application/json'},body:payload?JSON.stringify(payload):undefined});
}

test('catalogs, workflow and leadership permissions work end-to-end',async()=>{
  const operator=await login('operator@atu.kz');
  assert.equal(operator.state.organizations.length,7);
  assert.equal(operator.state.templates.length,4);
  assert.equal(operator.state.wasteTypes.length,8);

  const created=await request('/api/reports',operator.cookie,'POST',{org:'Main Canteen',date:'2026-11-07',type:'Bakery',kg:4.5,price:900,source:'Serving line',reason:'portion',status:'submitted'});
  assert.equal(created.status,201);
  const createdState=await created.json();
  const report=createdState.reports[0];
  assert.equal(report.status,'submitted');

  const reviewer=await login('reviewer@atu.kz');
  const started=await request(`/api/reports/${report.id}`,reviewer.cookie,'PATCH',{action:'startReview'});
  assert.equal(started.status,200);
  assert.equal((await started.json()).reports.find(item=>item.id===report.id).status,'review');

  const approved=await request(`/api/reports/${report.id}`,reviewer.cookie,'PATCH',{action:'approve',comment:'OK'});
  assert.equal(approved.status,200);
  assert.equal((await approved.json()).reports.find(item=>item.id===report.id).status,'approved');

  const leadership=await login('leadership@atu.kz');
  const forbidden=await request('/api/reports',leadership.cookie,'POST',{org:'Main Canteen',type:'Bakery',kg:1,price:1,source:'Serving line'});
  assert.equal(forbidden.status,403);
});

test.after(async()=>{
  child.kill();
  await rm(root,{recursive:true,force:true});
});
