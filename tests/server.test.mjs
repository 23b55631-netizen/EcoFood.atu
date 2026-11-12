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
let serverErrors='';child.stderr.on('data',chunk=>{serverErrors+=String(chunk)});
await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('server timeout')),5000);
  child.stdout.on('data',chunk=>{if(String(chunk).includes('EcoFood ATU server')){clearTimeout(timer);setTimeout(resolve,50)}});
  child.once('error',reject);
});

async function login(email,password='demo2026'){
  let response;try{response=await fetch(`http://127.0.0.1:${port}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})})}catch(error){throw new Error(`${error.message}; cause=${error.cause?.code||error.cause?.message||'unknown'}; server=${serverErrors||'no stderr'}; exited=${child.exitCode}`)}
  assert.equal(response.status,200);
  return {cookie:response.headers.get('set-cookie').split(';')[0],state:await response.json()};
}
async function request(path,cookie,method='GET',payload){
  return fetch(`http://127.0.0.1:${port}${path}`,{method,headers:{cookie,'content-type':'application/json'},body:payload?JSON.stringify(payload):undefined});
}

test('four-role workflow works end-to-end',async()=>{
  const user=await login('user@atu.kz');
  assert.equal(user.state.organizations.length,5);
  assert.ok(user.state.organizations.some(item=>item.name==='ТПП кафедрасы'));
  assert.ok(user.state.organizations.some(item=>item.name==='АТУ кофеханасы (ЖК «Canella»)'));
  assert.ok(user.state.organizations.some(item=>item.name==='ATU INN оқу-қонақ үй кешені'));
  assert.equal(user.state.templates.length,5);
  assert.ok(user.state.wasteTypes.length>=19);
  assert.equal(user.state.disposalMethods.length,7);
  assert.equal(user.state.disposalCatalog.find(item=>item.code==='COMPOST').co2Factor,8.88);
  const reviewerSeed=await login('reviewer@atu.kz');
  assert.equal(new Set(reviewerSeed.state.reports.map(item=>item.date.slice(0,7))).size,3);
  assert.equal(new Set(reviewerSeed.state.reports.map(item=>item.org)).size,5);
  assert.equal(user.state.reports.some(item=>item.id==='EF-2042'),false);

  const invalidCatalog=await request('/api/reports',user.cookie,'POST',{org:'ТПП кафедрасы',period:'2026-11',entries:[{date:'2026-11-07',type:'Орама қалдықтары',quantity:1,unit:'kg',disposal:'Қайта өңдеу',source:'Оқу зертханасы',reason:'prep',price:100}],status:'draft'});
  assert.equal(invalidCatalog.status,400);

  const batch={org:'1, 2-корпустар асхана кешені (ЖК «Искандер»)',period:'2026-11',entries:[{date:'2026-11-07',type:'Көкөніс қабықтары',quantity:4.5,unit:'kg',disposal:'Компосттау',source:'2-корпус асханасы',reason:'prep',price:900},{date:'2026-11-08',type:'Пайдаланылған май',quantity:2,unit:'l',disposal:'Пайдаланылған майды арнайы ұйымға тапсыру',source:'2-корпус асханасы',reason:'prep',price:300}],status:'submitted'};
  const created=await request('/api/reports',user.cookie,'POST',batch);
  assert.equal(created.status,201);
  const createdState=await created.json();
  const report=createdState.reports[0];
  assert.equal(report.status,'submitted');
  assert.equal(report.entries.length,2);
  assert.equal(report.kg,4.5);
  assert.equal(report.liters,2);

  const duplicate=await request('/api/reports',user.cookie,'POST',batch);
  assert.equal(duplicate.status,409);

  const reviewer=await login('reviewer@atu.kz');
  const started=await request(`/api/reports/${report.id}`,reviewer.cookie,'PATCH',{action:'startReview'});
  assert.equal(started.status,200);
  const startedReport=(await started.json()).reports.find(item=>item.id===report.id);
  assert.equal(startedReport.status,'review');
  assert.equal(startedReport.reviewer,'reviewer@atu.kz');

  const approved=await request(`/api/reports/${report.id}`,reviewer.cookie,'PATCH',{action:'approve',comment:'OK'});
  assert.equal(approved.status,200);
  assert.equal((await approved.json()).reports.find(item=>item.id===report.id).status,'approved');

  const admin=await login('admin@atu.kz');
  const managed=await request('/api/organizations',admin.cookie,'POST',{id:'NEW',name:'New Unit',kind:'Department',template:'TPP_FORM',deadlineDay:8,responsible:'new@atu.kz',active:true});
  assert.equal(managed.status,200);
  assert.ok((await managed.json()).organizations.some(item=>item.id==='NEW'));
  const adminReloaded=await login('admin@atu.kz');
  assert.ok(adminReloaded.state.organizations.some(item=>item.id==='NEW'));
  assert.ok(adminReloaded.state.locations.some(item=>item.org==='New Unit'));

  const memberResponse=await request('/api/members',admin.cookie,'POST',{name:'TPP Test User',email:'tpp-test@atu.kz',password:'secure2026',role:'User',org:'ТПП кафедрасы',active:true});
  assert.equal(memberResponse.status,200);
  const memberState=await memberResponse.json();
  assert.ok(memberState.members.some(item=>item.email==='tpp-test@atu.kz'));
  assert.equal(memberState.members.some(item=>'password' in item),false);
  assert.equal(memberState.members.some(item=>'passwordHash' in item),false);
  const dynamicUser=await login('tpp-test@atu.kz','secure2026');
  assert.equal(dynamicUser.state.user.org,'ТПП кафедрасы');

  const customTypeName='Пилоттық тағам қалдығы';
  const customType=await request('/api/waste-types',user.cookie,'POST',{name:customTypeName,org:'Басқа ұйым',unit:'kg',disposalDefault:'Компосттау',recyclable:true,co2:1.2});
  assert.equal(customType.status,200);
  const userReloaded=await login('user@atu.kz');
  assert.ok(userReloaded.state.wasteTypes.some(item=>item.name===customTypeName));
  assert.ok(userReloaded.state.templates.find(item=>item.id==='ISK_FORM').types.includes(customTypeName));
  const customReport=await request('/api/reports',userReloaded.cookie,'POST',{org:'1, 2-корпустар асхана кешені (ЖК «Искандер»)',period:'2026-11',entries:[{date:'2026-11-09',type:customTypeName,quantity:1.4,unit:'kg',disposal:'Компосттау',source:'2-корпус асханасы',reason:'prep',price:200}],status:'draft'});
  assert.equal(customReport.status,201);

  const locationUpdate=await request('/api/locations',admin.cookie,'POST',{id:'ISK-02',name:'2-корпус жабық нүктесі',org:'1, 2-корпустар асхана кешені (ЖК «Искандер»)',active:false});
  assert.equal(locationUpdate.status,200);
  const reloadedAdmin=await login('admin@atu.kz');
  assert.equal(reloadedAdmin.state.locations.find(item=>item.id==='ISK-02').active,false);
  const scopedUser=await login('user@atu.kz');
  assert.equal(scopedUser.state.locations.some(item=>item.id==='ISK-02'),false);
  const inactivePointReport=await request('/api/reports',scopedUser.cookie,'POST',{org:'1, 2-корпустар асхана кешені (ЖК «Искандер»)',period:'2026-11',entries:[{date:'2026-11-10',type:customTypeName,quantity:1,unit:'kg',disposal:'Компосттау',source:'2-корпус жабық нүктесі',reason:'prep',price:0}],status:'draft'});
  assert.equal(inactivePointReport.status,400);
  const locationCreate=await request('/api/locations',admin.cookie,'POST',{id:'ISK-03',name:'Асхана QR нүктесі 3',org:'1, 2-корпустар асхана кешені (ЖК «Искандер»)',active:true});
  assert.equal(locationCreate.status,200);
  const refreshedUser=await login('user@atu.kz');
  assert.ok(refreshedUser.state.locations.some(item=>item.id==='ISK-03'));
  const deniedLocation=await request('/api/locations',refreshedUser.cookie,'POST',{id:'BAD-01',name:'Рұқсатсыз нүкте',org:'1, 2-корпустар асхана кешені (ЖК «Искандер»)',active:true});
  assert.equal(deniedLocation.status,403);

  const leadership=await login('leadership@atu.kz');
  assert.equal(leadership.state.user.role,'Leadership');
  const denied=await request('/api/reports',leadership.cookie,'POST',batch);
  assert.equal(denied.status,403);
});

test.after(async()=>{
  child.kill();
  await rm(root,{recursive:true,force:true});
});
