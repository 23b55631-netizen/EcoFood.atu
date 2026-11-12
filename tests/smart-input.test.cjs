const test=require('node:test');
const assert=require('node:assert/strict');
const {classifyFeatures}=require('../dist/smart-input.js');

test('photo helper prioritizes clear file-name evidence',()=>{
  assert.equal(classifyFeatures({name:'coffee-grounds.jpg',red:180,green:170,blue:160}).type,'Coffee grounds');
  assert.equal(classifyFeatures({name:'nan-bread.png',red:20,green:160,blue:20}).type,'Bakery');
});

test('photo helper provides conservative colour-based suggestions',()=>{
  const vegetables=classifyFeatures({name:'photo.jpg',red:70,green:150,blue:65});
  assert.equal(vegetables.type,'Vegetables');
  assert.ok(vegetables.confidence<80);
  const mixed=classifyFeatures({name:'photo.jpg',red:140,green:120,blue:150});
  assert.equal(mixed.type,'Mixed food');
  assert.ok(mixed.confidence<=50);
});
