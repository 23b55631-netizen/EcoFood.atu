const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

test('Track 1 catalog contains the 19 waste types and seven disposal methods',()=>{
  const context={window:{}};context.window=context;
  vm.runInNewContext(fs.readFileSync('dist/catalog-data.js','utf8'),context);
  const catalog=context.EcoFoodCatalog;
  assert.equal(catalog.wasteTypes.length,19);
  assert.equal(catalog.disposalCatalog.length,7);
  const cardboard=catalog.wasteTypes.find(item=>item.id==='cardboard');
  assert.equal(cardboard.co2Tbo,1164.39);
  assert.equal(cardboard.co2Recommended,6.41);
  assert.equal(cardboard.co2Saving,1157.98);
  const oil=catalog.wasteTypes.find(item=>item.id==='used-oil');
  assert.equal(oil.unit,'l');
  assert.equal(oil.co2Saving,693.8);
});

test('catalog integration uses the supplied CO2 formula and oil conversion',()=>{
  const integration=fs.readFileSync('dist/catalog-integration.js','utf8');
  assert.match(integration,/mass\/1000\*Math\.max\(0,type\.co2Tbo-actual\)/);
  assert.match(integration,/entry\.unit==='l'\?\.92:1/);
  assert.match(integration,/reference-catalog/);
  assert.match(integration,/DEFRA 2024/);
});
