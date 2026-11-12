const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const read=file=>fs.readFileSync(path.join(__dirname,'..','dist',file),'utf8');
const features=read('professional-features.js');
const exportsSource=read('exports.js');
const index=read('index.html');

test('operator mobile dashboard prioritizes daily work',()=>{
  assert.match(features,/mobile-operator-home/);
  assert.match(features,/todayWaste/);
  assert.match(features,/\['draft','returned'\]/);
  assert.match(features,/data-page="mobile"/);
  assert.match(features,/mySubmissions/);
});

test('form autosave restores recent drafts and announces status',()=>{
  assert.match(features,/ecofood-form-autosave-v1/);
  assert.match(features,/localStorage\.setItem/);
  assert.match(features,/7\*24\*60\*60\*1000/);
  assert.match(features,/aria-live/);
  assert.match(features,/autosaveRestored/);
});

test('analytics compares real months without inventing meal data',()=>{
  assert.match(features,/monthBefore/);
  assert.match(features,/organization-ranking/);
  assert.match(features,/targetGap/);
  assert.match(features,/topCause/);
  assert.match(features,/mealsMissing/);
  assert.match(features,/insufficient/);
});

test('operational recommendations are evidence based and carry disclaimer',()=>{
  assert.match(features,/status==='approved'/);
  assert.match(features,/operationalNote/);
  assert.match(features,/This is not legal advice/);
  assert.match(features,/overTip/);
  assert.match(features,/expiredTip/);
});

test('quarterly exports include summaries breakdowns signatures and page numbers',()=>{
  assert.match(exportsSource,/organizationBreakdown/);
  assert.match(exportsSource,/categoryBreakdown/);
  assert.match(exportsSource,/Organizations/);
  assert.match(exportsSource,/Categories/);
  assert.match(exportsSource,/approvedBy/);
  assert.match(exportsSource,/getNumberOfPages/);
  assert.match(exportsSource,/period\(reports\)/);
  assert.match(index,/exports\.js\?v=4/);
  assert.match(index,/professional-features\.js\?v=2/);
});
