const impactCopy={
  kk:{title:'Қалдықты азайту',sub:'Себептер, шығын және өлшенетін мақсаттар',reason:'Қалдық себебі',over:'Артық дайындалды',portion:'Порция үлкен',expired:'Сақтау мерзімі өтті',prep:'Дайындау қалдығы',unknown:'Белгісіз',price:'Өнім бағасы (₸/кг)',weight:'Қалдық салмағы (кг)',rate:'Азайту болжамы (%)',loss:'Қалдықтың есептелген құны',potential:'Ықтимал үнем',estimate:'Болжам: салмақ × енгізілген баға. Бұл нақты қол жеткізілген үнем емес.',goal:'Мақсат және прогресс',baseline:'Бастапқы қалдық (кг / 100 порция)',current:'Қазіргі қалдық (кг / 100 порция)',target:'Азайту мақсаты (%)',save:'Мақсатты сақтау',saved:'Сақталды',history:'Өзгерістер тарихы',empty:'Әзірге жазба жоқ',local:'Демо: деректер осы браузерде сақталады. Сервермен синхрондау жоқ.',failed:'Сақтау мүмкін болмады. Деректер тек ашық бетте қалады.',advice:'Дерекке негізделген ұсыныс',noData:'Ұсыныс алу үшін қалдық себебі көрсетілген есеп қосыңыз.',overTip:'Дайындалатын көлемді сұраныспен салыстырып, шағын партиямен дайындауды сынаңыз.',portionTip:'Порция өлшемін тексеріп, шағын порция таңдауын сынаңыз.',expiredTip:'Қор айналымын және жарамдылық мерзімдерін қайта қараңыз.',prepTip:'Дайындау кезінде өнім шығынын өлшеп, технологиялық картаны тексеріңіз.',created:'Есеп тіркелді',approved:'Есеп қабылданды',returned:'Есеп қайтарылды',goalSaved:'Мақсат жаңартылды',change:'Нақты азаю',localRole:'Рөл ауыстыру — тек демо. Серверлік рұқсат тексеруі жоқ.',all:'Барлық жазба',reviewer:'Тексеруші',operator:'Оператор',invalid:'Өрістердегі мәндерді тексеріңіз',unit:'кг',calculator:'Үнем калькуляторы'},
  ru:{title:'Сокращение отходов',sub:'Причины, стоимость и измеримые цели',reason:'Причина отходов',over:'Избыточное приготовление',portion:'Большая порция',expired:'Истек срок хранения',prep:'Отходы подготовки',unknown:'Не указано',price:'Цена продукта (₸/кг)',weight:'Вес отходов (кг)',rate:'Прогноз сокращения (%)',loss:'Расчетная стоимость отходов',potential:'Возможная экономия',estimate:'Прогноз: вес × введенная цена. Это не фактически достигнутая экономия.',goal:'Цель и прогресс',baseline:'Исходные отходы (кг / 100 порций)',current:'Текущие отходы (кг / 100 порций)',target:'Цель сокращения (%)',save:'Сохранить цель',saved:'Сохранено',history:'История изменений',empty:'Пока нет записей',local:'Демо: данные сохраняются в этом браузере. Синхронизации с сервером нет.',failed:'Не удалось сохранить. Данные останутся только на открытой странице.',advice:'Рекомендация по данным',noData:'Добавьте отчет с причиной отходов для получения рекомендации.',overTip:'Сравните объем приготовления со спросом и попробуйте готовить небольшими партиями.',portionTip:'Проверьте размер порций и попробуйте предложить маленькую порцию.',expiredTip:'Пересмотрите оборот запасов и контроль сроков годности.',prepTip:'Измерьте потери при подготовке и проверьте технологическую карту.',created:'Отчет создан',approved:'Отчет принят',returned:'Отчет возвращен',goalSaved:'Цель обновлена',change:'Фактическое сокращение',localRole:'Смена роли — только демо. Серверной проверки доступа нет.',all:'Все записи',reviewer:'Проверяющий',operator:'Оператор',invalid:'Проверьте значения полей',unit:'кг',calculator:'Калькулятор экономии'},
  en:{title:'Waste reduction',sub:'Causes, cost and measurable goals',reason:'Waste reason',over:'Overproduction',portion:'Large portion',expired:'Expired stock',prep:'Preparation waste',unknown:'Unspecified',price:'Product price (₸/kg)',weight:'Waste weight (kg)',rate:'Expected reduction (%)',loss:'Calculated waste cost',potential:'Potential savings',estimate:'Estimate: weight × entered price. This is not realized savings.',goal:'Goal and progress',baseline:'Baseline waste (kg / 100 meals)',current:'Current waste (kg / 100 meals)',target:'Reduction target (%)',save:'Save goal',saved:'Saved',history:'Change history',empty:'No records yet',local:'Demo: data is saved in this browser. No server synchronization.',failed:'Could not save. Data remains only on this open page.',advice:'Data-based recommendation',noData:'Add a report with a waste reason to get a recommendation.',overTip:'Compare production with demand and try preparing smaller batches.',portionTip:'Check serving sizes and try offering a smaller portion.',expiredTip:'Review stock rotation and expiry tracking.',prepTip:'Measure preparation losses and review the recipe specification.',created:'Report created',approved:'Report approved',returned:'Report returned',goalSaved:'Goal updated',change:'Actual reduction',localRole:'Role switching is demo-only. No server authorization is enforced.',all:'All records',reviewer:'Reviewer',operator:'Operator',invalid:'Check the field values',unit:'kg',calculator:'Savings calculator'}
};
const impactStorage='ecofood.local.v1';
const impactState={events:[],goal:{baseline:10,current:10,target:10}};
const copy=()=>impactCopy[state.lang];
function escapeContent(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}
function storeImpact(){
  try{localStorage.setItem(impactStorage,JSON.stringify({reports:state.reports,events:impactState.events,goal:impactState.goal,lang:state.lang,settings:state.settings}));return true;}
  catch{toast(copy().failed);return false;}
}
try{
  const saved=JSON.parse(localStorage.getItem(impactStorage)||'null');
  if(saved&&Array.isArray(saved.reports)&&saved.reports.every(report=>typeof report.id==='string'&&Number.isFinite(report.kg)&&report.kg>=0)){
    state.reports=saved.reports;impactState.events=Array.isArray(saved.events)?saved.events:[];
    if(saved.goal){impactModel.progress(saved.goal.baseline,saved.goal.current,saved.goal.target);impactState.goal=saved.goal;}
    if(impactCopy[saved.lang])state.lang=saved.lang;
  }
}catch{}
function eventEntry(action,subject,detail=''){
  impactState.events.unshift({action,subject,detail,role:state.role,time:new Date().toISOString()});
}
function numberField(name,label,value,min=0,max=''){
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="number" required min="${min}" ${max!==''?`max="${max}"`:''} step="any" value="${value}"></div>`;
}
function impactPage(){
  const totals={};state.reports.filter(report=>report.status==='approved').forEach(report=>{if(['over','portion','expired','prep'].includes(report.reason))totals[report.reason]=(totals[report.reason]||0)+report.kg;});
  const leading=Object.keys(totals).sort((first,second)=>totals[second]-totals[first])[0];
  const goal=impactState.goal;
  return `${intro(copy().title,copy().sub)}<div class="demo-note">${copy().local}</div><div class="settings-grid impact-grid"><section class="card"><h3>${copy().calculator}</h3><form id="calculatorForm">${numberField('calcWeight',copy().weight,10)}${numberField('calcPrice',copy().price,1500)}${numberField('calcRate',copy().rate,10,0,100)}</form><div id="calculation" aria-live="polite"></div><p class="muted">${copy().estimate}</p></section><section class="card"><h3>${copy().goal}</h3><form id="goalForm">${numberField('baseline',copy().baseline,goal.baseline,.001)}${numberField('current',copy().current,goal.current)}${numberField('target',copy().target,goal.target,.001,100)}<button class="btn btn-blue">${copy().save}</button></form><div id="goalProgress" aria-live="polite"></div></section><section class="card"><h3>${copy().advice}</h3><p>${leading?copy()[`${leading}Tip`]:copy().noData}</p>${Object.entries(totals).map(([reason,weight])=>`<div class="setting-row"><span>${copy()[reason]}</span><strong>${weight.toFixed(1)} ${copy().unit}</strong></div>`).join('')}<small class="muted">${L().approved}</small></section><section class="card"><h3>${copy().history}</h3><div class="impact-history">${impactState.events.length?impactState.events.map(event=>`<article class="impact-event"><strong>${escapeContent(copy()[event.action]||event.action)}</strong><p>${escapeContent(event.subject)} · ${escapeContent(copy()[event.role==='Operator'?'operator':'reviewer'])}</p><time>${escapeContent(new Date(event.time).toLocaleString(state.lang==='kk'?'kk-KZ':state.lang==='ru'?'ru-RU':'en-GB'))}</time><p>${escapeContent(event.detail)}</p></article>`).join(''):`<p class="muted">${copy().empty}</p>`}</div></section></div>`;
}
function updateCalculation(){
  const form=document.getElementById('calculatorForm');if(!form)return;
  const output=document.getElementById('calculation');
  if(!form.checkValidity()){output.textContent=copy().invalid;return;}
  const result=impactModel.calculate(Number(form.calcWeight.value),Number(form.calcPrice.value),Number(form.calcRate.value));
  const money=value=>new Intl.NumberFormat(state.lang==='en'?'en-GB':state.lang==='ru'?'ru-RU':'kk-KZ',{style:'currency',currency:'KZT',maximumFractionDigits:0}).format(value);
  output.innerHTML=`<div class="setting-row"><span>${copy().loss}</span><strong>${money(result.loss)}</strong></div><div class="setting-row"><span>${copy().potential}</span><strong>${money(result.potential)}</strong></div>`;
}
function updateGoal(){
  const result=impactModel.progress(impactState.goal.baseline,impactState.goal.current,impactState.goal.target);
  document.getElementById('goalProgress').innerHTML=`<p>${copy().change}: <strong>${result.reduction.toFixed(1)}%</strong></p><progress value="${result.progress}" max="100" aria-label="${copy().goal}"></progress>`;
}
const previousPageContent=pageContent;
pageContent=function(){return state.page==='impact'?impactPage():previousPageContent();};
const previousNavItems=navItems;
navItems=function(){return previousNavItems()+`<button class="nav-item ${state.page==='impact'?'active':''}" data-page="impact"><span class="nav-icon">↘</span>${copy().title}</button>`;};
for(const language of ['kk','ru','en'])t[language].impact=impactCopy[language].title;
const previousImpactRender=render;
render=function(){
  previousImpactRender();
  document.querySelectorAll('.demo-chip').forEach(element=>element.textContent=copy().local);
  const form=document.getElementById('wasteForm');
  if(form){
    const fields=document.createElement('div');fields.className='form-grid';fields.innerHTML=`<div class="field"><label for="reason">${copy().reason}</label><select id="reason" name="reason" required>${['over','portion','expired','prep','unknown'].map(reason=>`<option value="${reason}">${copy()[reason]}</option>`).join('')}</select></div>${numberField('price',copy().price,0)}`;form.querySelector('.form-grid').append(fields);
    const submit=status=>{
      if(!form.reportValidity())return;
      const data=new FormData(form);const weight=Number(data.get('kg'));const price=Number(data.get('price'));
      if(!Number.isFinite(weight)||weight<=0||!Number.isFinite(price)||price<0){toast(copy().invalid);return;}
      const report={id:`EF-${crypto.randomUUID().slice(0,8)}`,org:data.get('org'),date:new Date().toLocaleDateString('ru-RU'),type:data.get('type'),kg:weight,status,reason:data.get('reason'),price,source:data.get('source'),notes:data.get('notes')};
      state.reports.unshift(report);eventEntry('created',report.id);storeImpact();state.page='impact';render();
    };
    form.onsubmit=event=>{event.preventDefault();submit('review');};form.querySelector('[data-action="draft"]').onclick=()=>submit('draft');
  }
  document.querySelectorAll('[data-action="approve"],[data-action="return"],[data-action="mobileSave"]').forEach(button=>{
    const previousClick=button.onclick;button.onclick=event=>{
      const before=state.reports.map(report=>({id:report.id,status:report.status}));previousClick(event);
      state.reports.forEach(report=>{const old=before.find(item=>item.id===report.id);if(!old)eventEntry('created',report.id);else if(old.status!==report.status)eventEntry(report.status,report.id,report.comment);});storeImpact();
    };
  });
  const settings=document.getElementById('roleSelect');if(settings){const note=document.createElement('p');note.className='demo-note';note.textContent=copy().localRole;settings.closest('.card').append(note);}
  const calculator=document.getElementById('calculatorForm');if(calculator){calculator.oninput=updateCalculation;calculator.onsubmit=event=>event.preventDefault();updateCalculation();updateGoal();}
  const goalForm=document.getElementById('goalForm');if(goalForm)goalForm.onsubmit=event=>{event.preventDefault();if(!goalForm.reportValidity())return;impactState.goal={baseline:Number(goalForm.elements.namedItem('baseline').value),current:Number(goalForm.elements.namedItem('current').value),target:Number(goalForm.elements.namedItem('target').value)};eventEntry('goalSaved','',`${impactState.goal.baseline} → ${impactState.goal.current}; ${impactState.goal.target}%`);const saved=storeImpact();render();if(saved)toast(copy().saved);};
};
render();
