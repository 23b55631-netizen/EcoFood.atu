const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function storage(){const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)}}

test('GitHub Pages adapter supports login and local demo reports',async()=>{
  const context={window:{},location:{hostname:'ecofood.github.io'},localStorage:storage(),sessionStorage:storage(),console,Date,JSON,Error};
  context.window=context;
  vm.runInNewContext(fs.readFileSync('dist/catalog-data.js','utf8'),context);
  vm.runInNewContext(fs.readFileSync('dist/pages-adapter.js','utf8'),context);
  assert.equal(context.EcoFoodPages.enabled,true);
  const user=await context.EcoFoodPages.api('/api/login',{method:'POST',body:JSON.stringify({email:'user@example.invalid',password:'browser-access'})});
  assert.equal(user.user.role,'User');
  assert.equal(user.organizations.length,5);
  assert.equal(user.user.org,'1, 2-корпустар асхана кешені (ЖК «Искандер»)');
  assert.equal(user.reports.some(item=>item.id==='EF-2042'),false);
  await context.EcoFoodPages.api('/api/logout',{method:'POST',body:'{}'});
  const signedIn=await context.EcoFoodPages.api('/api/login',{method:'POST',body:JSON.stringify({email:'admin@example.invalid',password:'browser-access'})});
  assert.equal(signedIn.user.role,'Administrator');
  assert.equal(new Set(signedIn.reports.map(item=>item.date.slice(0,7))).size,3);
  assert.equal(new Set(signedIn.reports.map(item=>item.org)).size,5);
  assert.equal(signedIn.disposalMethods.length,7);
  assert.equal(signedIn.disposalCatalog.find(item=>item.code==='COMPOST').co2Factor,8.88);
  const batch={org:'АТУ кофеханасы (ЖК «Canella»)',period:'2026-11',entries:[{date:'2026-11-08',type:'Кофе сығындысы',quantity:4,unit:'kg',disposal:'Компосттау',source:'Кофе-бар',reason:'over',price:900}],status:'submitted'};
  const created=await context.EcoFoodPages.api('/api/reports',{method:'POST',body:JSON.stringify(batch)});
  assert.equal(created.reports[0].kg,4);
  assert.equal(created.reports[0].entries.length,1);
  await assert.rejects(()=>context.EcoFoodPages.api('/api/reports',{method:'POST',body:JSON.stringify(batch)}),error=>error.status===409);
  const reloaded=await context.EcoFoodPages.api('/api/state');
  assert.equal(reloaded.reports[0].status,'submitted');
  const managed=await context.EcoFoodPages.api('/api/organizations',{method:'POST',body:JSON.stringify({id:'NEW',name:'New Unit',kind:'Department',template:'TPP_FORM',deadlineDay:8,responsible:'new@atu.kz',active:true})});
  assert.ok(managed.organizations.some(item=>item.id==='NEW'));
  await assert.rejects(()=>context.EcoFoodPages.api('/api/reports',{method:'POST',body:JSON.stringify({org:'ТПП кафедрасы',period:'2026-11',entries:batch.entries,status:'draft'})}),error=>error.status===400);
  const withMember=await context.EcoFoodPages.api('/api/members',{method:'POST',body:JSON.stringify({name:'TPP Test User',email:'tpp-test@example.invalid',password:'member-access',role:'User',org:'ТПП кафедрасы',active:true})});
  assert.ok(withMember.members.some(item=>item.email==='tpp-test@example.invalid'));
  assert.equal(withMember.members.some(item=>'password' in item),false);
  await context.EcoFoodPages.api('/api/logout',{method:'POST',body:'{}'});
  const dynamicUser=await context.EcoFoodPages.api('/api/login',{method:'POST',body:JSON.stringify({email:'tpp-test@example.invalid',password:'member-access'})});
  assert.equal(dynamicUser.user.org,'ТПП кафедрасы');
  await context.EcoFoodPages.api('/api/logout',{method:'POST',body:'{}'});
  const reviewer=await context.EcoFoodPages.api('/api/login',{method:'POST',body:JSON.stringify({email:'reviewer@example.invalid',password:'browser-access'})});
  assert.equal(reviewer.user.role,'Reviewer');
});
