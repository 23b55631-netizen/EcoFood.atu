const campusCopy={
  kk:{university:'АЛМАТЫ ТЕХНОЛОГИЯЛЫҚ УНИВЕРСИТЕТІ',tag:'Ақылды кампус · Тұрақты ATU',title:'Университет кешенінің тамақ қалдықтарын цифрлық басқару жүйесі',pledge:'Тамақ қалдықтарын бірге азайтайық!',tracks:'Негізгі бағыт',roles:'Демо рөл',languages:'Интерфейс тілі',purpose:'Тұрақты кампусқа бағытталған',mission:'ATU-дың тұрақты кампусы үшін',goals:['Тамақ қалдықтарын азайту','Қайта өңдеуді арттыру','Ресурстарды ұқыпты пайдалану','Өлшенетін ESG мақсаттарына жету'],caption:'ATU · 2-корпус',footer:'Университеттің тамақ қалдықтарын басқару жүйесі',show:'Құпиясөзді көрсету',hide:'Құпиясөзді жасыру'},
  ru:{university:'АЛМАТИНСКИЙ ТЕХНОЛОГИЧЕСКИЙ УНИВЕРСИТЕТ',tag:'Умный кампус · Устойчивый ATU',title:'Цифровая система управления пищевыми отходами университетского комплекса',pledge:'Сократим пищевые отходы вместе!',tracks:'Основных направлений',roles:'Демо-роли',languages:'Языка интерфейса',purpose:'Для устойчивого кампуса',mission:'Для устойчивого кампуса ATU',goals:['Сокращение пищевых отходов','Развитие переработки','Бережное использование ресурсов','Достижение измеримых целей ESG'],caption:'ATU · Корпус 2',footer:'Система управления пищевыми отходами университета',show:'Показать пароль',hide:'Скрыть пароль'},
  en:{university:'ALMATY TECHNOLOGICAL UNIVERSITY',tag:'Smart Campus · Sustainable ATU',title:'Digital food waste management for the university campus',pledge:'Let’s reduce food waste together!',tracks:'Core tracks',roles:'Demo roles',languages:'Interface languages',purpose:'Built for a sustainable campus',mission:'For a sustainable ATU campus',goals:['Reduce food waste','Increase recycling','Use resources responsibly','Reach measurable ESG goals'],caption:'ATU · Building 2',footer:'University food waste management system',show:'Show password',hide:'Hide password'}
};
const campus=()=>campusCopy[state.lang];
campusCopy.kk.caption='Б корпусы — Фуркат к-сі, 348/4';
campusCopy.ru.caption='Корпус Б — ул. Фурката, 348/4';
campusCopy.en.caption='Building B — Furkat Street, 348/4';
function leaf(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M28 3C10 1 2 10 5 22c7 5 21 1 23-19Z" fill="currentColor"/><path d="M3 29 23 9" stroke="white" stroke-width="1.6" fill="none"/></svg>';}
brand=function(){return `<div class="brand unified-brand"><img class="unified-logo" src="assets/ecofood-atu-transparent.png" alt="ATU · EcoFood — Sustainable Campus"></div>`;};
const trackPaths=['M7 3h10l6 6v20H7z M17 3v7h6','M10 2h12v28H10z M14 26h4','M16 3v10M7 23v-6h18v6 M13 3h6v6h-6z M3 23h8v7H3z M21 23h8v7h-8z','M3 11 16 3l13 8 M5 13v14M12 13v14M20 13v14M27 13v14M2 29h28','M4 29V18h5v11M14 29V10h5v19M24 29V3h5v26','M16 3v13h13 M12 4a13 13 0 1 0 16 16'];
landing=function(){return `<div class="campus-landing"><nav class="public-nav">${brand()}<div class="public-links"><a href="#about">${L().about}</a><a href="#features">${L().features}</a><a href="#workflow">${L().workflow}</a>${langSwitch()}<button class="btn btn-blue" data-action="login">${L().login}</button></div></nav><main><section class="campus-hero" id="about"><img class="campus-photo" src="assets/campus.jpg" alt="${campus().caption}"><div class="hero-ribbon"></div><div class="hero-blue"></div><div class="campus-hero-copy"><span class="campus-tag">${campus().tag}</span><h1>EcoFood <span>ATU</span></h1><h2>${campus().title}</h2><p>${L().heroText}</p><div class="hero-actions"><button class="btn btn-primary" data-action="login">${L().login} <span>→</span></button><a class="btn btn-outline" href="#features">▷ ${L().explore}</a></div></div><div class="campus-pledge"><span>♻</span><strong>${campus().pledge}</strong></div><small class="photo-credit">${campus().caption}</small></section><section class="campus-overview"><div class="campus-stats"><div><span>⌂</span><p><strong>6</strong>${campus().tracks}</p></div><div><span>♧</span><p><strong>3</strong>${campus().roles}</p></div><div><span>◎</span><p><strong>3</strong>${campus().languages}</p></div><div>${leaf()}<p><strong>ESG</strong>${campus().purpose}</p></div></div><section id="features"><h2>${L().featureTitle}</h2><div class="feature-grid">${features().map((feature,index)=>`<article class="feature-card"><svg class="track-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="${trackPaths[index]}"/></svg><div><h3>${L()[feature.k]}</h3><p>${translateText(feature.d)}</p></div><button data-action="login" aria-label="${L()[feature.k]}">→</button></article>`).join('')}</div></section><section class="campus-mission" id="workflow"><div class="mission-symbol">${leaf()}<span>♻</span></div><div><h2>${campus().mission}</h2><ul>${campus().goals.map(goal=>`<li><span>✓</span>${goal}</li>`).join('')}</ul></div><a class="btn btn-green" href="#features">${L().features} →</a></section></section></main><footer class="campus-footer">${brand()}<p>${campus().footer}</p><small>© 2026 EcoFood ATU · ${L().demoData}</small></footer></div>`;};
const previousCampusLogin=login;
login=function(){return previousCampusLogin().replace('<h1>',`<div class="login-identity">${brand()}</div><h1>`);};
const previousCampusRender=render;
render=function(){
  previousCampusRender();
  const footer=document.querySelector('.campus-footer');
  if(footer){
    const addressCopy={kk:['Университет мекенжайы','Б корпусы — Фуркат к-сі, 348/4'],ru:['Адрес университета','Корпус Б — ул. Фурката, 348/4'],en:['University address','Building B — Furkat Street, 348/4']}[state.lang];
    const address=document.createElement('address');
    address.className='campus-address';
    const label=document.createElement('small');label.textContent=addressCopy[0];
    const link=document.createElement('a');link.textContent=addressCopy[1]+' (2GIS)';link.href='https://2gis.kz/almaty/search/'+encodeURIComponent('Фурката 348/4');link.target='_blank';link.rel='noopener noreferrer';
    address.append(label,link);footer.append(address);
  }
  const campusPhoto=document.querySelector('.campus-photo');
  if(campusPhoto)campusPhoto.src='assets/campus-rooftop.jpg';
  document.querySelectorAll('.mobile-brand').forEach(image=>{image.src='assets/ecofood-atu-transparent.png';image.alt='ATU · EcoFood';});
  const password=document.querySelector('#loginForm input[name="password"]');
  if(password){
    const button=document.createElement('button');button.type='button';button.className='password-toggle';button.textContent=campus().show;button.setAttribute('aria-pressed','false');
    button.onclick=()=>{const visible=password.type==='password';password.type=visible?'text':'password';button.textContent=visible?campus().hide:campus().show;button.setAttribute('aria-pressed',String(visible));};password.after(button);
  }
};
render();
