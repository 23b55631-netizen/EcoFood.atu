const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function storage(){const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)}}

test('GitHub Pages adapter supports login and local demo reports',async()=>{
  const context={window:{},location:{hostname:'ecofood.github.io'},localStorage:storage(),sessionStorage:storage(),console,Date,JSON,Error};
  context.window=context;
  vm.runInNewContext(fs.readFileSync('dist/pages-adapter.js','utf8'),context);
  assert.equal(context.EcoFoodPages.enabled,true);
  const signedIn=await context.EcoFoodPages.api('/api/login',{method:'POST',body:JSON.stringify({email:'admin@atu.kz',password:'demo2026'})});
  assert.equal(signedIn.user.role,'Administrator');
  const created=await context.EcoFoodPages.api('/api/reports',{method:'POST',body:JSON.stringify({org:'Main Canteen',date:'2026-11-08',type:'Bakery',source:'Serving line',kg:4,price:900,status:'submitted'})});
  assert.equal(created.reports[0].kg,4);
  const reloaded=await context.EcoFoodPages.api('/api/state');
  assert.equal(reloaded.reports[0].status,'submitted');
});
