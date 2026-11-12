const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const upgrades=fs.readFileSync(path.join(root,'dist','product-upgrades.js'),'utf8');
const platform=fs.readFileSync(path.join(root,'dist','platform.js'),'utf8');
const index=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');

test('official organizations and organization fields have three-language labels',()=>{
  for(const value of ['ТПП кафедрасы','ТХиПП кафедрасы','ATU INN оқу-қонақ үй кешені','АТУ кофеханасы (ЖК «Canella»)','1, 2-корпустар асхана кешені (ЖК «Искандер»)']){
    assert.match(upgrades,new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  }
  assert.match(upgrades,/building:'Building'/);
  assert.match(upgrades,/address:'Адрес'/);
  assert.match(upgrades,/inactive:'Белсенді емес'/);
  assert.match(upgrades,/id="locationManager"/);
  assert.match(upgrades,/qrPoints:'QR жинау нүктелері'/);
});

test('demo account label and published asset versions are current',()=>{
  assert.match(platform,/user@atu\.kz/);
  assert.doesNotMatch(platform,/operator@atu\.kz/);
  assert.match(index,/catalog-data\.js\?v=1/);
  assert.match(index,/pages-adapter\.js\?v=12/);
  assert.match(index,/platform\.js\?v=22/);
  assert.match(index,/product-upgrades\.js\?v=25/);
  assert.match(upgrades,/chooseOrg:'Есеп енгізілетін ұйымды таңдаңыз'/);
  assert.match(upgrades,/orgLocked:'Ұйым тіркелгіңізге бекітілген'/);
  assert.match(platform,/\['Operator','User','Administrator'\]/);
});
