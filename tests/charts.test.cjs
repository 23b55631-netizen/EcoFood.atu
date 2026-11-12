const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const source=fs.readFileSync(path.join(__dirname,'..','dist','platform.js'),'utf8');
const chartSource=source.match(/function chartDate[\s\S]*?(?=function dashboardReports)/)?.[0];

test('charts show values calculated from entered reports',()=>{
  assert.ok(chartSource,'chart functions are present');
  const context={
    Intl,Date,Number,
    state:{lang:'en'},
    safe:value=>String(value),
    P:()=>({noRecords:'No records',submitted:'Submitted'}),
    L:()=>({trend:'Waste trend',approved:'Approved',review:'In review',returned:'Returned',draft:'Draft'}),
    Q:()=>({dataSource:'Entered reports',records:'records',dateRange:'Period'})
  };
  vm.runInNewContext(`${chartSource};result={trendSvg,statusDonut}`,context);
  const reports=[
    {date:'2026-11-04',kg:10,status:'approved'},
    {date:'2026-11-04',kg:5,status:'submitted'},
    {date:'2026-11-05',kg:7,status:'approved'}
  ];
  const trend=context.result.trendSvg(reports);
  assert.match(trend,/15\.0 kg/);
  assert.match(trend,/3 records/);
  const donut=context.result.statusDonut(reports);
  assert.match(donut,/17\.0 kg/);
  assert.match(donut,/77%/);
  assert.match(donut,/5\.0 kg/);
});
