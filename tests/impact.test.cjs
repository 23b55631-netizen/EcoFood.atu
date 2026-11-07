const test=require('node:test');
const assert=require('node:assert/strict');
const model=require('../dist/impact-model.js');
test('cost and potential savings remain distinct',()=>{
  assert.deepEqual(model.calculate(10,1500,20),{loss:15000,potential:3000});
  assert.deepEqual(model.calculate(0,1500,20),{loss:0,potential:0});
});
test('reject invalid financial assumptions',()=>{
  for(const values of [[-1,1500,10],[1,NaN,10],[1,10,101],[Infinity,10,10]])assert.throws(()=>model.calculate(...values),RangeError);
});
test('progress shows deterioration and caps target achievement',()=>{
  assert.deepEqual(model.progress(10,12,10),{reduction:-20,progress:0});
  assert.deepEqual(model.progress(10,8,10),{reduction:20,progress:100});
  assert.throws(()=>model.progress(0,1,10),RangeError);
});
