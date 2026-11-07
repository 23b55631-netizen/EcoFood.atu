(function(root){
  function calculate(weight,price,reduction){
    if(![weight,price,reduction].every(Number.isFinite)||weight<0||price<0||reduction<0||reduction>100)throw new RangeError('Invalid calculation');
    return {loss:weight*price,potential:weight*price*reduction/100};
  }
  function progress(baseline,current,target){
    if(![baseline,current,target].every(Number.isFinite)||baseline<=0||current<0||target<=0||target>100)throw new RangeError('Invalid goal');
    const reduction=(baseline-current)/baseline*100;
    return {reduction,progress:Math.max(0,Math.min(100,reduction/target*100))};
  }
  const api={calculate,progress};
  if(typeof module!=='undefined')module.exports=api;else root.impactModel=api;
})(typeof window==='undefined'?{}:window);
