const translations = [
['Demo mode: password recovery is not connected.','Демо режимінде құпиясөзді қалпына келтіру қосылмаған.','В демо восстановление пароля не подключено.'],['Demo QR resolved: MC-03','Демо QR анықталды: MC-03','Демо QR распознан: MC-03'],['Photo preview loaded locally','Фотосурет осы құрылғыда ашылды','Фото открыто на этом устройстве'],['Notifications marked as read','Хабарламалар оқылды деп белгіленді','Уведомления отмечены прочитанными'],['Point','Жинау орны','Место сбора'],['ESG demo','ESG демо','ESG демо'],
['Smart Food Waste Platform','Тамақ қалдықтарын басқару','Управление пищевыми отходами'],
['Dynamic forms with required fields, validation and drafts.','Міндетті өрістер, тексеру және сақталатын жобалар.','Обязательные поля, проверка данных и черновики.'],
['QR-assisted collection point selection and real photo preview.','QR арқылы жинау орнын таңдау және фотосурет қосу.','Выбор места сбора по QR и добавление фотографии.'],
['Traceable draft, review, approved and returned statuses.','Жоба, тексеру, қабылдау және қайтару кезеңдерін бақылау.','Контроль этапов: черновик, проверка, принятие и возврат.'],
['Campus units, responsible people and role visibility.','Кампус бөлімшелері, жауапты адамдар және рөлдер.','Подразделения кампуса, ответственные и роли.'],
['Consolidated registry with Excel-compatible and PDF output.','Бірыңғай тізілім және Excel мен PDF форматындағы есептер.','Единый реестр и отчеты в форматах Excel и PDF.'],
['Waste trends, diversion rate and transparent demo ESG KPIs.','Қалдық динамикасы, қайта бағыттау үлесі және ESG көрсеткіштері.','Динамика отходов, доля перенаправления и показатели ESG.'],
['Collect & identify','Жинау және анықтау','Сбор и идентификация'],['Register & document','Тіркеу және құжаттау','Регистрация и документирование'],['Review & approve','Тексеру және қабылдау','Проверка и принятие'],['Analyze & improve','Талдау және жақсарту','Анализ и улучшение'],
['QR identifies the location and source.','QR жинау орны мен көзін анықтайды.','QR определяет место и источник сбора.'],['A structured form records weight and evidence.','Нысанда салмақ пен дәлелдер тіркеледі.','В форме фиксируются вес и подтверждения.'],['Responsible staff verify and update status.','Жауапты қызметкер деректерді тексеріп, мәртебесін жаңартады.','Ответственный проверяет данные и обновляет статус.'],['Reports and ESG indicators support decisions.','Есептер мен ESG көрсеткіштері шешім қабылдауға көмектеседі.','Отчеты и показатели ESG помогают принимать решения.'],
['All values in this MVP are illustrative demo estimates, clearly separated from verified university performance. Production calculations require approved emission factors, measured baselines and auditable source data.','Көрсеткіштер — үлгілік есептеулер. Нақты нәтиже үшін бекітілген коэффициенттер, бастапқы өлшемдер және тексерілетін деректер қажет.','Показатели являются демонстрационными оценками. Для реальных расчетов нужны утвержденные коэффициенты, исходные измерения и проверяемые данные.'],
['Formula preview: diverted waste × category emission factor. No claim of audited impact is made.','Есептеу үлгісі: қайта бағытталған қалдық × санат коэффициенті. Бұл аудиттен өткен нәтиже емес.','Пример расчета: перенаправленные отходы × коэффициент категории. Результат не проходил аудит.'],
['Downloads the currently visible registry as a real .xlsx workbook.','Көрсетілген тізілімді нақты .xlsx файлына жүктейді.','Скачивает показанный реестр в настоящий файл .xlsx.'],['Downloads a ready PDF report with Kazakh, Russian and English text support.','Қазақ, орыс және ағылшын мәтінін қолдайтын дайын PDF есебін жүктейді.','Скачивает готовый PDF-отчёт с поддержкой казахского, русского и английского текста.'],
['Main Canteen submitted 48 kg','Негізгі асхана 48 кг тіркеді','Главная столовая зарегистрировала 48 кг'],['Record added to the consolidated registry','Жазба бірыңғай тізілімге енгізілді','Запись добавлена в единый реестр'],['Reviewer requested a clearer photo','Тексеруші анық фотосурет сұрады','Проверяющий запросил более четкое фото'],['Dormitory #2 manager role','№2 жатақхана менеджері','Менеджер общежития №2'],
['EF-2041 needs review','EF-2041 тексеруді күтуде','EF-2041 ожидает проверки'],['EF-2040 approved','EF-2040 қабылданды','EF-2040 принят'],['EF-2039 returned','EF-2039 қайтарылды','EF-2039 возвращен'],['New member invited','Жаңа қатысушы шақырылды','Приглашен новый участник'],
['Main Canteen','Негізгі асхана','Главная столовая'],['Dormitory #1','№1 жатақхана','Общежитие №1'],['Dormitory #2','№2 жатақхана','Общежитие №2'],['Training Restaurant','Оқу мейрамханасы','Учебный ресторан'],['Laboratory Block','Зертхана корпусы','Лабораторный корпус'],['Central Warehouse','Орталық қойма','Центральный склад'],
['Preparation zone','Дайындау аймағы','Зона подготовки'],['Serving line','Тарату желісі','Линия раздачи'],['Plate waste station','Табақ қалдықтарын жинау','Сбор остатков с тарелок'],['Mixed food','Аралас тағам','Смешанная пища'],['Vegetables','Көкөністер','Овощи'],['Bakery','Нан өнімдері','Выпечка'],['Dairy','Сүт өнімдері','Молочные продукты'],['Mixed','Аралас','Смешанные'],['Other','Басқа','Прочее'],
['Mark all read','Барлығын оқылды деп белгілеу','Отметить все прочитанными'],['Add organization','Ұйым қосу','Добавить организацию'],['Optional demo note','Қосымша түсініктеме','Дополнительный комментарий'],['ATU collection point QR','ATU жинау орнының QR коды','QR места сбора ATU'],['Quick capture · demo','Жылдам тіркеу · демо','Быстрая регистрация · демо'],['Not scanned','Сканерленбеген','Не отсканировано'],['Waste intensity by unit','Бөлімшелер бойынша қалдық','Отходы по подразделениям'],['ESG KPI notes','ESG көрсеткіштеріне түсініктеме','Пояснения к показателям ESG'],['Waste diversion rate','Қайта бағытталған қалдық үлесі','Доля перенаправленных отходов'],['Demonstration MVP','Демонстрациялық нұсқа','Демонстрационная версия'],['ATU University · Almaty','ATU университеті · Алматы','Университет ATU · Алматы'],
['Administrator','Әкімші','Администратор'],['Reviewer','Тексеруші','Проверяющий'],['reviewer','тексеруші','проверяющий'],['Operator','Оператор','Оператор'],['Manager','Менеджер','Менеджер'],['Observer','Бақылаушы','Наблюдатель'],['Admin','Әкімші','Администратор'],['Role','Рөл','Роль'],['Created','Тіркелді','Создано'],['Registry','Тізілім','Реестр'],['Search','Іздеу','Поиск'],['All status','Барлық мәртебе','Все статусы'],['No matching records','Жазбалар табылмады','Записи не найдены'],['demo estimate','үлгілік есеп','примерная оценка'],['demo records','демо жазба','демо записей'],['demo queue','тексеру кезегі','очередь проверки'],['active today','бүгін белсенді','активны сегодня'],['Today','Бүгін','Сегодня'],['Yesterday','Кеше','Вчера'],['total.','барлығы.','всего.'],['potential','болжам','прогноз'],['water','су','вода'],['kg','кг','кг'],['min','мин','мин'],[' h',' сағ',' ч'],[' t',' т',' т'],['demo','демо','демо']
].sort((first,second)=>second[0].length-first[0].length);
function translateText(value){
  if(state.lang==='en')return value;
  const language=state.lang==='kk'?1:2;
  return translations.reduce((text,entry)=>text.split(entry[0]).join(entry[language]),value);
}
function localizePage(){
  const walker=document.createTreeWalker(document.getElementById('app'),NodeFilter.SHOW_TEXT);
  while(walker.nextNode())walker.currentNode.textContent=translateText(walker.currentNode.textContent);
  document.querySelectorAll('input,textarea,select').forEach(control=>{
    if(control.placeholder)control.placeholder=translateText(control.placeholder);
    if(control.readOnly)control.value=translateText(control.value);
  });
  document.querySelectorAll('.field').forEach((field,index)=>{
    const label=field.querySelector('label');const control=field.querySelector('input,select,textarea');
    if(label&&control){control.id=control.id||`field-${index}`;label.htmlFor=control.id;}
  });
}
const baseRender=render;
const baseToast=toast;
toast=function(message){baseToast(translateText(message));};
render=function(){
  baseRender();
  document.querySelectorAll('select option').forEach(option=>option.value=option.value);
  const mobileNav=document.querySelector('.mobile-nav');
  if(mobileNav){const menu=document.createElement('details');menu.className='module-menu';menu.innerHTML=`<summary>${state.lang==='kk'?'Барлық бөлімдер':state.lang==='ru'?'Все разделы':'All sections'}</summary><div>${navItems()}</div>`;document.querySelector('.content').prepend(menu);menu.querySelectorAll('[data-page]').forEach(button=>button.onclick=()=>{state.page=button.dataset.page;render()});}
  document.querySelectorAll('[data-lang]').forEach(button=>button.onclick=()=>{
    const fields=Array.from(document.querySelectorAll('input,select,textarea')).filter(control=>control.type!=='file').map(control=>({key:control.name||control.id,value:control.value}));
    state.lang=button.dataset.lang;localStorage.setItem('ecofood-language',state.lang);render();
    fields.forEach(field=>{const control=Array.from(document.querySelectorAll('input,select,textarea')).find(item=>(item.name||item.id)===field.key);if(control)control.value=field.value;});
  });
  document.querySelectorAll('[data-action="return"],[data-action="approve"]').forEach(button=>button.onclick=()=>{
    if(state.role==='Operator'){toast(state.lang==='kk'?'Тексеруші рөлі қажет':state.lang==='ru'?'Нужна роль проверяющего':'Reviewer role required');return;}
    const comment=document.getElementById('reviewComment').value.trim();
    if(button.dataset.action==='return'&&!comment){document.getElementById('reviewComment').focus();toast(state.lang==='kk'?'Қайтару себебін жазыңыз':state.lang==='ru'?'Укажите причину возврата':'Enter a return reason');return;}
    const report=state.reports.find(item=>item.id===button.dataset.id);
    if(report&&report.status==='review'){report.status=button.dataset.action==='approve'?'approved':'returned';report.comment=comment;render();toast(L()[report.status]);}
  });
  const saveMobile=document.querySelector('[data-action="mobileSave"]');
  if(saveMobile)saveMobile.onclick=()=>{
    const weight=document.querySelector('.phone-body input[type="number"]');
    if(!Number.isFinite(Number(weight.value))||Number(weight.value)<=0){weight.focus();toast(L().weight);return;}
    state.reports.unshift({id:`EF-${Date.now()}`,org:'Main Canteen',date:new Date().toLocaleDateString('ru-RU'),type:'Mixed food',kg:Number(weight.value),status:'review'});state.page='submissions';render();toast(L().submit);
  };
  const filter=document.getElementById('statusFilter');const search=document.getElementById('reportSearch');
  if(search)search.oninput=()=>{filterReports();localizePage();};if(filter)filter.onchange=()=>{filterReports();localizePage();};
  const role=document.getElementById('roleSelect');if(role)role.onchange=()=>{state.role=role.value;render();};
  localizePage();
};
localizePage();
