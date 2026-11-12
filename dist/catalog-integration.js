(function(){
  platform.disposalCatalog=[];
  const baseAcceptServer=acceptServer;
  acceptServer=function(payload){baseAcceptServer(payload);platform.disposalCatalog=payload.disposalCatalog||window.EcoFoodCatalog?.disposalCatalog||[]};

  const baseCatalogLabel=catalogLabel;
  catalogLabel=function(value){
    const type=platform.wasteTypes.find(item=>item.name===value),method=platform.disposalCatalog.find(item=>item.name===value);
    return type?.labels?.[state.lang]||method?.labels?.[state.lang]||baseCatalogLabel(value);
  };

  const methodCopy={
    kk:'CO₂ үнемі = масса (т) × (ҚТҚ коэффициенті − таңдалған тәсіл коэффициенті). Май үшін: литр × 0,92 = кг. Коэффициенттер DEFRA 2024 негізінде берілген және Қазақстан үшін бағдарлық мәндер.',
    ru:'Экономия CO₂ = масса (т) × (коэффициент ТБО − коэффициент выбранного способа). Для масла: литры × 0,92 = кг. Коэффициенты основаны на DEFRA 2024 и являются ориентировочными для Казахстана.',
    en:'CO₂ saving = mass (t) × (landfill factor − selected-method factor). For oil: litres × 0.92 = kg. Factors are based on DEFRA 2024 and are indicative for Kazakhstan.'
  };
  Object.keys(methodCopy).forEach(lang=>{px[lang].methodText=methodCopy[lang];pc[lang].methodText=methodCopy[lang]});

  const entriesOf=report=>report.entries?.length?report.entries:[{type:report.type,quantity:report.kg,unit:'kg',disposal:report.disposal}];
  function impact(reports){
    let co2=0,totalMass=0,recyclableMass=0,unavailable=0;
    reports.filter(report=>report.status==='approved').flatMap(entriesOf).forEach(entry=>{
      const type=platform.wasteTypes.find(item=>item.name===entry.type);if(!type)return;
      const mass=Number(entry.quantity||0)*(entry.unit==='l'?.92:1),method=platform.disposalCatalog.find(item=>item.name===entry.disposal);
      totalMass+=mass;if(type.recyclability==='yes')recyclableMass+=mass;
      const actual=method?.code==='TBO'?type.co2Tbo:method?.co2Factor;
      if(!Number.isFinite(type.co2Tbo)||!Number.isFinite(actual)){unavailable++;return}
      co2+=mass/1000*Math.max(0,type.co2Tbo-actual);
    });
    return{co2,totalMass,recyclableMass,share:totalMass?recyclableMass/totalMass*100:0,unavailable};
  }
  window.EcoFoodImpact={calculate:impact};

  const text={
    kk:{title:'Қалдықтар, кәдеге жарату және CO₂ анықтамалығы',subtitle:'Track 1 Excel анықтамалығы бойынша',types:'Қалдық түрлері',methods:'Кәдеге жарату тәсілдері',type:'Қалдық түрі',organizations:'Ұйымдар',category:'Санат',unit:'Өлшем',recyclable:'Қайта өңдеу',recommended:'Ұсынылған тәсіл',landfill:'ҚТҚ CO₂',newMethod:'Жаңа тәсіл CO₂',saving:'Үнем',note:'Ескерту',method:'Тәсіл',forWaste:'Қандай қалдыққа',hierarchy:'Иерархия',yes:'Иә',partial:'Ішінара',no:'Жоқ',organic:'Органикалық',secondary:'Қайталама шикізат',special:'Арнайы',mixed:'Аралас',source:'Дереккөз және шектеулер',sourceText:'UK DEFRA / BEIS, Greenhouse gas reporting: conversion factors 2024, Waste disposal бөлімі. Қайта өңдеу коэффициенттері тек тасымалдау мен өңдеуді қамтиды. ПЭТ пен алюминий үшін шыны, май үшін тамақ қалдығы/қайта өңдеу, аралас орама үшін картон коэффициенті қолданылған.',factor:'кг CO₂e/т',unavailable:'Коэффициенті жоқ жолдар'},
    ru:{title:'Справочник отходов, утилизации и CO₂',subtitle:'По справочнику Excel для Трека 1',types:'Виды отходов',methods:'Способы утилизации',type:'Вид отхода',organizations:'Организации',category:'Категория',unit:'Ед. изм.',recyclable:'Переработка',recommended:'Рекомендуемый способ',landfill:'CO₂ при ТБО',newMethod:'CO₂ нового способа',saving:'Экономия',note:'Примечание',method:'Способ',forWaste:'Для каких отходов',hierarchy:'Иерархия',yes:'Да',partial:'Частично',no:'Нет',organic:'Органические',secondary:'Вторсырьё',special:'Специальные',mixed:'Смешанные',source:'Источники и ограничения',sourceText:'UK DEFRA / BEIS, Greenhouse gas reporting: conversion factors 2024, раздел Waste disposal. Коэффициенты переработки учитывают только транспорт и переработку. Для ПЭТ и алюминия применены коэффициенты стекла, для масла — пищевых отходов/переработки, для смешанной упаковки — картона.',factor:'кг CO₂-экв/т',unavailable:'Строки без коэффициента'},
    en:{title:'Waste, disposal and CO₂ reference',subtitle:'Based on the Track 1 Excel reference',types:'Waste types',methods:'Disposal methods',type:'Waste type',organizations:'Organizations',category:'Category',unit:'Unit',recyclable:'Recyclability',recommended:'Recommended method',landfill:'Landfill CO₂',newMethod:'New-method CO₂',saving:'Saving',note:'Note',method:'Method',forWaste:'Applicable waste',hierarchy:'Hierarchy',yes:'Yes',partial:'Partial',no:'No',organic:'Organic',secondary:'Recyclables',special:'Special',mixed:'Mixed',source:'Sources and limitations',sourceText:'UK DEFRA / BEIS, Greenhouse gas reporting: conversion factors 2024, Waste disposal section. Recycling factors cover transport and processing only. Glass factors are used for PET and aluminium, food-waste/recycling factors for oil, and cardboard factors for mixed packaging.',factor:'kg CO₂e/t',unavailable:'Rows without a factor'}
  };
  const T=()=>text[state.lang]||text.kk,loc=value=>typeof value==='object'?(value[state.lang]||value.kk||''):(value||''),num=value=>Number.isFinite(value)?Number(value).toLocaleString(state.lang==='en'?'en-GB':state.lang==='ru'?'ru-RU':'kk-KZ',{maximumFractionDigits:2}):'—';
  function orgsFor(name){return platform.organizations.filter(org=>platform.templates.find(template=>template.id===org.template)?.types.includes(name)).map(org=>catalogLabel(org.name)).join(', ')}
  function category(value){const map={'Органикалық':'organic','Қайталама шикізат':'secondary','Арнайы':'special','Аралас':'mixed'};return T()[map[value]]||value}
  function referencePanel(metrics){
    const types=platform.wasteTypes.filter(item=>!String(item.id).startsWith('custom-'));
    const typeRows=types.map(item=>`<tr><td><b>${safe(catalogLabel(item.name))}</b></td><td>${safe(orgsFor(item.name))}</td><td>${safe(category(item.category))}</td><td>${safe(item.unit)}</td><td>${safe(T()[item.recyclability]||item.recyclability)}</td><td>${safe(catalogLabel(item.disposalDefault))}</td><td>${num(item.co2Tbo)}</td><td>${num(item.co2Recommended)}</td><td><b>${num(item.co2Saving)}</b></td><td>${safe(loc(item.note))}</td></tr>`).join('');
    const methodRows=platform.disposalCatalog.map(item=>`<tr><td><code>${safe(item.code)}</code></td><td><b>${safe(catalogLabel(item.name))}</b></td><td>${safe(loc(item.forWaste))}</td><td>${num(item.co2Factor)}</td><td>${item.hierarchy}</td><td>${safe(loc(item.note))}</td></tr>`).join('');
    return `<section class="card reference-catalog"><div class="card-head"><div><h3>${T().title}</h3><p class="muted">${T().subtitle} · ${types.length} ${T().types.toLowerCase()} · ${platform.disposalCatalog.length} ${T().methods.toLowerCase()}</p></div><span class="status approved">${num(metrics.co2)} kg CO₂e</span></div><details open><summary>${T().types}</summary><div class="table-scroll"><table class="data-table reference-table"><thead><tr><th>${T().type}</th><th>${T().organizations}</th><th>${T().category}</th><th>${T().unit}</th><th>${T().recyclable}</th><th>${T().recommended}</th><th>${T().landfill}<small>${T().factor}</small></th><th>${T().newMethod}<small>${T().factor}</small></th><th>${T().saving}<small>${T().factor}</small></th><th>${T().note}</th></tr></thead><tbody>${typeRows}</tbody></table></div></details><details><summary>${T().methods}</summary><div class="table-scroll"><table class="data-table reference-table"><thead><tr><th>Код</th><th>${T().method}</th><th>${T().forWaste}</th><th>CO₂ <small>${T().factor}</small></th><th>${T().hierarchy}</th><th>${T().note}</th></tr></thead><tbody>${methodRows}</tbody></table></div></details><div class="reference-source"><b>${T().source}</b><p>${T().sourceText}</p>${metrics.unavailable?`<small>${T().unavailable}: ${metrics.unavailable}</small>`:''}</div></section>`
  }

  const baseAnalytics=analyticsV2;
  analyticsV2=function(){
    const metrics=impact(state.reports),share=Math.round(metrics.share),html=baseAnalytics()
      .replace(/(<div class="esg-card green"><small>[\s\S]*?<\/small><strong>)[^<]*(<\/strong>)/,`$1${metrics.co2.toFixed(1)} kg$2`)
      .replace(/(<div class="esg-card gold"><small>[\s\S]*?<\/small><strong>)[^<]*(<\/strong><span>)[^<]*(<\/span>)/,`$1${share}%$2${metrics.recyclableMass.toFixed(1)} kg$3`);
    return `${html}${referencePanel(metrics)}`
  };
})();
