(function(){
  const enabled=location.hostname.endsWith('github.io');
  const storageKey='ecofood-atu-pages-demo-v1';
  const sessionKey='ecofood-atu-pages-user';
  const users=[
    {email:'operator@atu.kz',password:'demo2026',name:'Мадина О.',role:'Operator',org:'Main Canteen'},
    {email:'reviewer@atu.kz',password:'demo2026',name:'Айдос Ә.',role:'Reviewer',org:'ATU'},
    {email:'admin@atu.kz',password:'demo2026',name:'Әкімші',role:'Administrator',org:'ATU'},
    {email:'leadership@atu.kz',password:'demo2026',name:'Басшылық',role:'Leadership',org:'ATU'}
  ];
  const organizations=[
    {id:'MC',name:'Main Canteen',kind:'Canteen',template:'DAILY_KITCHEN',deadlineDay:5,responsible:'operator@atu.kz'},
    {id:'BC',name:'Building B Canteen',kind:'Canteen',template:'DAILY_KITCHEN',deadlineDay:5,responsible:'b-canteen@atu.kz'},
    {id:'CP',name:'Coffee Point',kind:'Coffee shop',template:'COFFEE_POINT',deadlineDay:5,responsible:'coffee@atu.kz'},
    {id:'INN',name:'ATU INN',kind:'Hotel',template:'HOSPITALITY',deadlineDay:7,responsible:'inn@atu.kz'},
    {id:'FTD',name:'Food Technology Department',kind:'Department',template:'MONTHLY_UNIT',deadlineDay:7,responsible:'foodtech@atu.kz'},
    {id:'D1',name:'Dormitory #1',kind:'Dormitory',template:'MONTHLY_UNIT',deadlineDay:7,responsible:'dorm1@atu.kz'},
    {id:'TR',name:'Training Restaurant',kind:'Restaurant',template:'DAILY_KITCHEN',deadlineDay:5,responsible:'restaurant@atu.kz'}
  ];
  const wasteTypes=[
    {id:'mixed',name:'Mixed food',recyclable:false,co2:2.5},{id:'bakery',name:'Bakery',recyclable:true,co2:2.1},
    {id:'vegetables',name:'Vegetables',recyclable:true,co2:1.8},{id:'dairy',name:'Dairy',recyclable:false,co2:3.2},
    {id:'meat',name:'Meat & fish',recyclable:false,co2:5.6},{id:'oil',name:'Cooking oil',recyclable:true,co2:3},
    {id:'coffee',name:'Coffee grounds',recyclable:true,co2:1.5},{id:'packaging',name:'Packaging',recyclable:true,co2:.9}
  ];
  const templates=[
    {id:'DAILY_KITCHEN',name:'Daily kitchen form',frequency:'daily',types:['Mixed food','Bakery','Vegetables','Dairy','Meat & fish','Cooking oil']},
    {id:'COFFEE_POINT',name:'Coffee point form',frequency:'daily',types:['Bakery','Dairy','Coffee grounds','Packaging']},
    {id:'HOSPITALITY',name:'Hospitality form',frequency:'monthly',types:['Mixed food','Bakery','Vegetables','Dairy','Packaging']},
    {id:'MONTHLY_UNIT',name:'Monthly unit form',frequency:'monthly',types:['Mixed food','Bakery','Vegetables','Coffee grounds','Packaging']}
  ];
  const seed={
    reports:[
      {id:'EF-2042',org:'Coffee Point',owner:'operator@atu.kz',date:'2026-11-07',type:'Coffee grounds',kg:12,status:'submitted',reason:'prep',price:1800,source:'Coffee bar',notes:'Morning shift',photo:'',createdAt:'2026-11-07T08:30:00.000Z',updatedAt:'2026-11-07T08:30:00.000Z'},
      {id:'EF-2041',org:'Main Canteen',owner:'operator@atu.kz',date:'2026-11-06',type:'Mixed food',kg:48,status:'review',reason:'over',price:1500,source:'Preparation zone',notes:'Lunch service',photo:'',createdAt:'2026-11-06T09:15:00.000Z',updatedAt:'2026-11-06T09:15:00.000Z'},
      {id:'EF-2040',org:'Main Canteen',owner:'operator@atu.kz',date:'2026-11-05',type:'Bakery',kg:22,status:'approved',reason:'portion',price:950,source:'Serving line',notes:'',photo:'',createdAt:'2026-11-05T10:20:00.000Z',updatedAt:'2026-11-05T12:05:00.000Z'},
      {id:'EF-2039',org:'Main Canteen',owner:'operator@atu.kz',date:'2026-11-05',type:'Vegetables',kg:31,status:'returned',reason:'prep',price:1250,source:'Preparation zone',notes:'Фотоны анық түсіріңіз',photo:'',createdAt:'2026-11-05T08:10:00.000Z',updatedAt:'2026-11-05T11:30:00.000Z'},
      {id:'EF-2038',org:'Main Canteen',owner:'operator@atu.kz',date:'2026-11-04',type:'Mixed food',kg:39,status:'approved',reason:'over',price:1600,source:'Plate waste station',notes:'',photo:'',createdAt:'2026-11-04T09:00:00.000Z',updatedAt:'2026-11-04T13:00:00.000Z'}
    ],
    events:[
      {id:'EV-0',reportId:'EF-2042',action:'submitted',actor:'operator@atu.kz',comment:'',time:'2026-11-07T08:30:00.000Z'},
      {id:'EV-1',reportId:'EF-2039',action:'returned',actor:'reviewer@atu.kz',comment:'Фотоны анық түсіріңіз',time:'2026-11-05T11:30:00.000Z'},
      {id:'EV-2',reportId:'EF-2040',action:'approved',actor:'reviewer@atu.kz',comment:'',time:'2026-11-05T12:05:00.000Z'}
    ],
    goals:[{id:'GOAL-1',org:'Main Canteen',baseline:10,current:8.8,target:15,updatedAt:'2026-11-06T08:00:00.000Z'}],
    notifications:[],
    locations:[{id:'CP-01',org:'Coffee Point',name:'Coffee bar'},{id:'MC-01',org:'Main Canteen',name:'Preparation zone'},{id:'MC-02',org:'Main Canteen',name:'Serving line'},{id:'MC-03',org:'Main Canteen',name:'Plate waste station'}]
  };
  const clone=value=>JSON.parse(JSON.stringify(value));
  function read(){try{return JSON.parse(localStorage.getItem(storageKey))||clone(seed)}catch{return clone(seed)}}
  function save(db){localStorage.setItem(storageKey,JSON.stringify(db))}
  function error(status,message){const value=new Error(message);value.status=status;throw value}
  function currentUser(){const email=sessionStorage.getItem(sessionKey);return users.find(item=>item.email===email)||null}
  function snapshot(db,user){const reports=user.role==='Operator'?db.reports.filter(item=>item.owner===user.email):db.reports;const ids=new Set(reports.map(item=>item.id));return {user:{email:user.email,name:user.name,role:user.role,org:user.org},reports,events:db.events.filter(item=>ids.has(item.reportId)),goals:db.goals,locations:db.locations,organizations,templates,wasteTypes,notifications:db.notifications}}
  function addEvent(db,report,action,user,comment=''){db.events.unshift({id:`EV-${Date.now()}`,reportId:report.id,action,actor:user.email,comment,time:new Date().toISOString()})}
  async function api(path,options={}){
    const method=options.method||'GET';const input=options.body?JSON.parse(options.body):{};let db=read();
    if(path==='/api/login'&&method==='POST'){
      const user=users.find(item=>item.email.toLowerCase()===String(input.email||'').toLowerCase()&&item.password===input.password);
      if(!user)error(401,'INVALID_CREDENTIALS');sessionStorage.setItem(sessionKey,user.email);return snapshot(db,user)
    }
    if(path==='/api/logout'){sessionStorage.removeItem(sessionKey);return {ok:true}}
    const user=currentUser();if(!user)error(401,'AUTH_REQUIRED');
    if(path==='/api/state')return snapshot(db,user);
    if(path==='/api/reports'&&method==='POST'){
      const number=Math.max(2042,...db.reports.map(item=>Number(item.id.split('-')[1])||0))+1;const now=new Date().toISOString();
      const report={...input,id:`EF-${number}`,owner:user.email,kg:Number(input.kg),price:Number(input.price||0),createdAt:now,updatedAt:now};db.reports.unshift(report);addEvent(db,report,input.status==='draft'?'created':'submitted',user);save(db);return snapshot(db,user)
    }
    if(path.startsWith('/api/reports/')&&method==='PATCH'){
      const id=decodeURIComponent(path.split('/').pop());const report=db.reports.find(item=>item.id===id);if(!report)error(404,'NOT_FOUND');
      if(input.action){const statuses={review:'review',approve:'approved',return:'returned',resubmit:'submitted'};report.status=statuses[input.action]||report.status;addEvent(db,report,input.action,user,input.comment||'')}
      else Object.assign(report,input,{kg:Number(input.kg),price:Number(input.price||0)});
      report.updatedAt=new Date().toISOString();save(db);return snapshot(db,user)
    }
    if(path==='/api/goals'&&method==='POST'){
      const goal={...input,id:`GOAL-${Date.now()}`,updatedAt:new Date().toISOString()};db.goals=db.goals.filter(item=>item.org!==goal.org);db.goals.unshift(goal);save(db);return snapshot(db,user)
    }
    if(path==='/api/notifications/read'){db.notifications.forEach(item=>item.read=true);save(db);return snapshot(db,user)}
    if(path==='/api/reminders/run'){db.notifications.unshift({id:`NT-${Date.now()}`,title:'Demo reminder',time:new Date().toISOString(),read:false});save(db);return snapshot(db,user)}
    error(404,'NOT_FOUND')
  }
  window.EcoFoodPages={enabled,api};
})();
