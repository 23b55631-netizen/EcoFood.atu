const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const server=fs.readFileSync('server.mjs','utf8');
const ui=fs.readFileSync('dist/requirements-v2.js','utf8');
const platform=fs.readFileSync('dist/platform.js','utf8');
const data=JSON.parse(fs.readFileSync('data/ecofood.json','utf8'));

test('official five organizations and templates are seeded',()=>{
  const names=data.organizations.map(item=>item.name);
  assert.deepEqual(names,['ТПП кафедрасы','ТХиПП кафедрасы','ATU INN оқу-қонақ үй кешені','АТУ кофеханасы (ЖК «Canella»)','1, 2-корпустар асхана кешені (ЖК «Искандер»)']);
  assert.equal(data.templates.length,5);
  assert.ok(data.organizations.every(item=>item.address&&item.building&&typeof item.active==='boolean'));
});

test('three-month dataset uses entry-level units and disposal methods',()=>{
  assert.equal(new Set(data.reports.map(item=>item.period)).size,3);
  assert.equal(new Set(data.reports.map(item=>item.org)).size,5);
  assert.ok(data.reports.every(item=>item.entries.length>=2));
  assert.ok(data.reports.flatMap(item=>item.entries).every(item=>['kg','l'].includes(item.unit)&&item.disposal));
});

test('period report form supports multiple measurements and direct catalog extension',()=>{
  assert.match(ui,/data-entry-row/);
  assert.match(ui,/addBatchEntry/);
  assert.match(ui,/entry_\$\{index\}_unit/);
  assert.match(ui,/entry_\$\{index\}_disposal/);
  assert.match(ui,/saveNewWasteType/);
  assert.match(ui,/period,entries,status/);
});

test('server enforces organization scope future dates and password hashes',()=>{
  assert.match(server,/user\.role==='User'&&input\.org!==user\.org/);
  assert.match(server,/date<=new Date\(\)\.toISOString\(\)\.slice\(0,10\)/);
  assert.match(server,/scryptSync/);
  assert.match(server,/passwordHash/);
  assert.equal(data.members.some(item=>'password' in item),false);
  assert.ok(data.members.every(item=>item.passwordHash));
});

test('quarter comparison and official methodology links are visible',()=>{
  assert.match(ui,/Тоқсандарды салыстыру/);
  assert.match(ui,/т\/жыл/);
  assert.match(ui,/epa\.gov/);
  assert.match(ui,/fao\.org/);
  assert.match(ui,/sdgs\.un\.org\/goals\/goal12/);
});

test('the consolidated registry contains approved reports only',()=>{
  assert.match(platform,/return match&&item\.status==='approved'/);
  assert.doesNotMatch(platform,/id="acceptedOnly"/);
});
