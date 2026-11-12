(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.EcoFoodSmartInput=api;
})(typeof window!=='undefined'?window:null,function(){
  const keywordRules=[
    {type:'Coffee grounds',words:['coffee','cafe','espresso','кофе','кофей','кофе қалдығы']},
    {type:'Bakery',words:['bread','bakery','bun','pastry','нан','выпеч','хлеб']},
    {type:'Vegetables',words:['vegetable','salad','greens','fruit','көкөніс','овощ','фрукт']},
    {type:'Dairy',words:['milk','dairy','cheese','yogurt','сүт','молок','сыр']}
  ];

  function classifyFeatures({name='',red=128,green=128,blue=128}={}){
    const normalized=String(name).toLowerCase();
    const keyword=keywordRules.find(rule=>rule.words.some(word=>normalized.includes(word)));
    if(keyword)return{type:keyword.type,confidence:86,reason:'filename'};
    const max=Math.max(red,green,blue),min=Math.min(red,green,blue),spread=max-min;
    if(green>red*1.08&&green>blue*1.12)return{type:'Vegetables',confidence:68,reason:'dominant-green'};
    if(red>105&&green>70&&blue<95&&red>blue*1.35)return{type:'Bakery',confidence:61,reason:'warm-brown'};
    if(red+green+blue>650&&spread<38)return{type:'Dairy',confidence:57,reason:'light-neutral'};
    if(red+green+blue<235&&spread<55)return{type:'Coffee grounds',confidence:60,reason:'dark-neutral'};
    return{type:'Mixed food',confidence:48,reason:'mixed-colours'};
  }

  function classifyFile(file){
    return new Promise((resolve,reject)=>{
      if(!file||!String(file.type||'').startsWith('image/'))return reject(new Error('image-required'));
      const image=new Image();
      const url=URL.createObjectURL(file);
      image.onload=()=>{
        try{
          const canvas=document.createElement('canvas');
          canvas.width=32;canvas.height=32;
          const context=canvas.getContext('2d',{willReadFrequently:true});
          context.drawImage(image,0,0,32,32);
          const pixels=context.getImageData(0,0,32,32).data;
          let red=0,green=0,blue=0,count=0;
          for(let index=0;index<pixels.length;index+=16){
            if(pixels[index+3]<80)continue;
            red+=pixels[index];green+=pixels[index+1];blue+=pixels[index+2];count++;
          }
          resolve(classifyFeatures({name:file.name,red:red/Math.max(count,1),green:green/Math.max(count,1),blue:blue/Math.max(count,1)}));
        }catch(error){reject(error)}finally{URL.revokeObjectURL(url)}
      };
      image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('image-read-failed'))};
      image.src=url;
    });
  }

  return{classifyFeatures,classifyFile};
});
