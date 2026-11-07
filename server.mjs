import http from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { randomBytes, timingSafeEqual } from 'node:crypto';

const root=resolve(import.meta.dirname);
const publicRoot=join(root,'dist');
const dataRoot=join(root,'data');
const databasePath=resolve(process.env.ECOFOOD_DATA_PATH||join(dataRoot,'ecofood.json'));
const port=Number(process.env.ECOFOOD_PORT||4174);
const sessions=new Map();
const users=[
  {email:'operator@atu.kz',password:'demo2026',name:'Мадина О.',role:'Operator',org:'Main Canteen'},
  {email:'reviewer@atu.kz',password:'demo2026',name:'Айдос Ә.',role:'Reviewer',org:'ATU'},
  {email:'admin@atu.kz',password:'demo2026',name:'Әкімші',role:'Administrator',org:'ATU'},
  {email:'leadership@atu.kz',password:'demo2026',name:'Басшылық',role:'Leadership',org:'ATU'}
];
const organizationRegistry=[
  {id:'MC',name:'Main Canteen',kind:'Canteen',template:'DAILY_KITCHEN',deadlineDay:5,responsible:'operator@atu.kz'},
  {id:'BC',name:'Building B Canteen',kind:'Canteen',template:'DAILY_KITCHEN',deadlineDay:5,responsible:'b-canteen@atu.kz'},
  {id:'CP',name:'Coffee Point',kind:'Coffee shop',template:'COFFEE_POINT',deadlineDay:5,responsible:'coffee@atu.kz'},
  {id:'INN',name:'ATU INN',kind:'Hotel',template:'HOSPITALITY',deadlineDay:7,responsible:'inn@atu.kz'},
  {id:'FTD',name:'Food Technology Department',kind:'Department',template:'MONTHLY_UNIT',deadlineDay:7,responsible:'foodtech@atu.kz'},
  {id:'D1',name:'Dormitory #1',kind:'Dormitory',template:'MONTHLY_UNIT',deadlineDay:7,responsible:'dorm1@atu.kz'},
  {id:'TR',name:'Training Restaurant',kind:'Restaurant',template:'DAILY_KITCHEN',deadlineDay:5,responsible:'restaurant@atu.kz'}
];
const wasteTypes=[
  {id:'mixed',name:'Mixed food',recyclable:false,co2:2.5},
  {id:'bakery',name:'Bakery',recyclable:true,co2:2.1},
  {id:'vegetables',name:'Vegetables',recyclable:true,co2:1.8},
  {id:'dairy',name:'Dairy',recyclable:false,co2:3.2},
  {id:'meat',name:'Meat & fish',recyclable:false,co2:5.6},
  {id:'oil',name:'Cooking oil',recyclable:true,co2:3.0},
  {id:'coffee',name:'Coffee grounds',recyclable:true,co2:1.5},
  {id:'packaging',name:'Packaging',recyclable:true,co2:0.9}
];
const formTemplates=[
  {id:'DAILY_KITCHEN',name:'Daily kitchen form',frequency:'daily',types:['Mixed food','Bakery','Vegetables','Dairy','Meat & fish','Cooking oil']},
  {id:'COFFEE_POINT',name:'Coffee point form',frequency:'daily',types:['Bakery','Dairy','Coffee grounds','Packaging']},
  {id:'HOSPITALITY',name:'Hospitality form',frequency:'monthly',types:['Mixed food','Bakery','Vegetables','Dairy','Packaging']},
  {id:'MONTHLY_UNIT',name:'Monthly unit form',frequency:'monthly',types:['Mixed food','Bakery','Vegetables','Coffee grounds','Packaging']}
];
const now=()=>new Date().toISOString();
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
  locations:[
    {id:'CP-01',org:'Coffee Point',name:'Coffee bar'},
    {id:'MC-01',org:'Main Canteen',name:'Preparation zone'},
    {id:'MC-02',org:'Main Canteen',name:'Serving line'},
    {id:'MC-03',org:'Main Canteen',name:'Plate waste station'}
  ]
};

await mkdir(dirname(databasePath),{recursive:true});
try{await stat(databasePath)}catch{await writeFile(databasePath,JSON.stringify(seed,null,2),'utf8')}
async function loadDb(){return JSON.parse(await readFile(databasePath,'utf8'))}
async function saveDb(db){await writeFile(databasePath,JSON.stringify(db,null,2),'utf8')}
function json(response,status,payload,headers={}){response.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers});response.end(JSON.stringify(payload))}
function safeEqual(first,second){const a=Buffer.from(first);const b=Buffer.from(second);return a.length===b.length&&timingSafeEqual(a,b)}
function cookies(request){return Object.fromEntries((request.headers.cookie||'').split(';').filter(Boolean).map(item=>{const [key,...value]=item.trim().split('=');return [key,decodeURIComponent(value.join('='))]}))}
function currentUser(request){const token=cookies(request).ecofood_session;const email=token&&sessions.get(token);return users.find(user=>user.email===email)||null}
async function body(request){let raw='';for await(const chunk of request){raw+=chunk;if(raw.length>3_000_000)throw new Error('Payload too large')}return raw?JSON.parse(raw):{}}
function visibleState(db,user){
  const reports=user.role==='Operator'?db.reports.filter(report=>report.owner===user.email):db.reports;
  const reportIds=new Set(reports.map(report=>report.id));
  return {user:{email:user.email,name:user.name,role:user.role,org:user.org},reports,events:db.events.filter(event=>reportIds.has(event.reportId)),goals:db.goals,locations:db.locations,organizations:organizationRegistry,templates:formTemplates,wasteTypes,notifications:db.notifications.filter(item=>!item.recipient||item.recipient===user.email||item.role===user.role)};
}
function canEdit(user,report){return user.role==='Administrator'||(user.role==='Operator'&&report.owner===user.email&&['draft','returned'].includes(report.status))}
function addEvent(db,reportId,action,user,comment=''){db.events.unshift({id:`EV-${randomBytes(5).toString('hex')}`,reportId,action,actor:user.email,comment,time:now()})}
function notify(db,{role,recipient,title,reportId}){db.notifications.unshift({id:`NT-${randomBytes(5).toString('hex')}`,role,recipient,title,reportId,time:now(),read:false})}

async function api(request,response,url){
  if(request.method==='POST'&&url.pathname==='/api/login'){
    const input=await body(request);const user=users.find(item=>item.email.toLowerCase()===String(input.email||'').toLowerCase());
    if(!user||!safeEqual(user.password,String(input.password||'')))return json(response,401,{error:'INVALID_CREDENTIALS'});
    const token=randomBytes(32).toString('hex');sessions.set(token,user.email);const db=await loadDb();
    return json(response,200,visibleState(db,user),{'set-cookie':`ecofood_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`});
  }
  if(request.method==='POST'&&url.pathname==='/api/logout'){const token=cookies(request).ecofood_session;if(token)sessions.delete(token);return json(response,200,{ok:true},{'set-cookie':'ecofood_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'})}
  const user=currentUser(request);if(!user)return json(response,401,{error:'AUTH_REQUIRED'});
  const db=await loadDb();
  if(request.method==='GET'&&url.pathname==='/api/state')return json(response,200,visibleState(db,user));
  if(request.method==='POST'&&url.pathname==='/api/reports'){
    if(!['Operator','Administrator'].includes(user.role))return json(response,403,{error:'FORBIDDEN'});
    const input=await body(request);const kg=Number(input.kg);const price=Number(input.price);
    const reportDate=String(input.date||new Date().toISOString().slice(0,10));
    if(!input.org||!input.type||!input.source||!/^\d{4}-\d{2}-\d{2}$/.test(reportDate)||!Number.isFinite(kg)||kg<=0||kg>10000||!Number.isFinite(price)||price<0||price>10000000)return json(response,400,{error:'INVALID_REPORT'});
    const report={id:`EF-${Date.now().toString(36).toUpperCase()}`,org:String(input.org).slice(0,80),owner:user.email,date:reportDate,type:String(input.type).slice(0,60),kg,status:input.status==='draft'?'draft':'submitted',reason:String(input.reason||'unknown').slice(0,30),price,source:String(input.source).slice(0,80),notes:String(input.notes||'').slice(0,500),photo:String(input.photo||'').slice(0,2_000_000),createdAt:now(),updatedAt:now()};
    db.reports.unshift(report);addEvent(db,report.id,report.status==='draft'?'created':'submitted',user);if(report.status==='submitted')notify(db,{role:'Reviewer',title:'Жаңа есеп жіберілді',reportId:report.id});await saveDb(db);return json(response,201,visibleState(db,user));
  }
  const reportMatch=url.pathname.match(/^\/api\/reports\/([^/]+)$/);
  if(reportMatch&&request.method==='PATCH'){
    const report=db.reports.find(item=>item.id===decodeURIComponent(reportMatch[1]));if(!report)return json(response,404,{error:'NOT_FOUND'});
    const input=await body(request);const action=input.action;
    if(action==='startReview'){
      if(!['Reviewer','Administrator'].includes(user.role)||report.status!=='submitted')return json(response,403,{error:'FORBIDDEN'});
      report.status='review';report.updatedAt=now();addEvent(db,report.id,'review',user);notify(db,{recipient:report.owner,title:'Есеп тексеруге алынды',reportId:report.id});
    }else if(action==='approve'||action==='return'){
      if(!['Reviewer','Administrator'].includes(user.role)||report.status!=='review')return json(response,403,{error:'FORBIDDEN'});
      if(action==='return'&&!String(input.comment||'').trim())return json(response,400,{error:'COMMENT_REQUIRED'});
      report.status=action==='approve'?'approved':'returned';report.reviewComment=String(input.comment||'').slice(0,500);report.updatedAt=now();addEvent(db,report.id,report.status,user,report.reviewComment);notify(db,{recipient:report.owner,title:action==='approve'?'Есеп қабылданды':'Есеп түзетуге қайтарылды',reportId:report.id});
    }else{
      if(!canEdit(user,report))return json(response,403,{error:'FORBIDDEN'});
      const kg=Number(input.kg);const price=Number(input.price);if(!Number.isFinite(kg)||kg<=0||!Number.isFinite(price)||price<0)return json(response,400,{error:'INVALID_REPORT'});
      Object.assign(report,{org:String(input.org).slice(0,80),type:String(input.type).slice(0,60),kg,price,reason:String(input.reason||'unknown').slice(0,30),source:String(input.source).slice(0,80),notes:String(input.notes||'').slice(0,500),photo:String(input.photo||report.photo||'').slice(0,2_000_000),status:input.status==='draft'?'draft':'submitted',reviewComment:'',updatedAt:now()});addEvent(db,report.id,report.status==='draft'?'updated':'resubmitted',user);if(report.status==='submitted')notify(db,{role:'Reviewer',title:'Түзетілген есеп қайта жіберілді',reportId:report.id});
    }
    await saveDb(db);return json(response,200,visibleState(db,user));
  }
  if(request.method==='POST'&&url.pathname==='/api/goals'){
    if(!['Reviewer','Administrator'].includes(user.role))return json(response,403,{error:'FORBIDDEN'});const input=await body(request);const baseline=Number(input.baseline),current=Number(input.current),target=Number(input.target);if(!input.org||![baseline,current,target].every(Number.isFinite)||baseline<=0||current<0||target<=0||target>100)return json(response,400,{error:'INVALID_GOAL'});let goal=db.goals.find(item=>item.org===input.org);if(goal)Object.assign(goal,{baseline,current,target,updatedAt:now()});else db.goals.push({id:`GOAL-${Date.now()}`,org:input.org,baseline,current,target,updatedAt:now()});await saveDb(db);return json(response,200,visibleState(db,user));
  }
  if(request.method==='POST'&&url.pathname==='/api/notifications/read'){db.notifications.filter(item=>!item.recipient||item.recipient===user.email||item.role===user.role).forEach(item=>item.read=true);await saveDb(db);return json(response,200,visibleState(db,user))}
  if(request.method==='POST'&&url.pathname==='/api/reminders/run'){
    if(!['Reviewer','Administrator'].includes(user.role))return json(response,403,{error:'FORBIDDEN'});
    const period=new Date().toISOString().slice(0,7);const submitted=new Set(db.reports.filter(item=>item.date.startsWith(period)&&item.status!=='draft').map(item=>item.org));
    organizationRegistry.filter(org=>!submitted.has(org.name)).forEach(org=>notify(db,{recipient:org.responsible,title:`Есеп мерзімі: ${org.name}`,reportId:''}));
    await saveDb(db);return json(response,200,visibleState(db,user));
  }
  return json(response,404,{error:'NOT_FOUND'});
}

const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf'};
async function serve(request,response,url){let pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const target=normalize(join(publicRoot,pathname));if(!target.startsWith(publicRoot+sep))return json(response,403,{error:'FORBIDDEN'});try{const info=await stat(target);if(!info.isFile())throw new Error();response.writeHead(200,{'content-type':mime[extname(target).toLowerCase()]||'application/octet-stream','cache-control':'no-cache'});createReadStream(target).pipe(response)}catch{json(response,404,{error:'NOT_FOUND'})}}
const server=http.createServer(async(request,response)=>{try{const url=new URL(request.url,`http://${request.headers.host||'localhost'}`);if(url.pathname.startsWith('/api/'))await api(request,response,url);else await serve(request,response,url)}catch(error){console.error(error);json(response,error.message==='Payload too large'?413:500,{error:'SERVER_ERROR'})}});
server.listen(port,'127.0.0.1',()=>console.log(`EcoFood ATU server: http://127.0.0.1:${port}`));
