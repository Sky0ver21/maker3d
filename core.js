/* ===== Maker3D protótipo - núcleo: utilitários, configuração, regras de negócio =====
   TUDO aqui é simulação no navegador (localStorage). Na versão real vira servidor (ver comentários SERVER). */
const BRAND='Maker3D'; // nome provisório
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>'R$ '+Math.round(n).toLocaleString('pt-BR');
const fm=n=>'R$ '+Number(n).toFixed(2).replace('.',',');
const DAY=864e5;
const addDays=n=>Date.now()+n*DAY;
const fdate=t=>new Date(t).toLocaleDateString('pt-BR');
const daysLeft=t=>Math.ceil((t-Date.now())/DAY);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const uid=()=>'u'+Math.random().toString(36).slice(2,9);
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967296}
const dayKey=()=>new Date().toISOString().slice(0,10);

/* ---------- CONFIG (valores fixos do dono) ---------- */
const CFG={
  coinValue:0.10,                       // referência: R$ por moeda (500 por R$50)
  firstPack:{c:500,p:34.9},             // 1ª compra, uma vez por conta
  packs:{comercial:[{c:500,p:50},{c:1100,p:100},{c:2800,p:250}],empresas:[{c:1000,p:100},{c:2600,p:250},{c:6000,p:500}]},
  unlock:{comercial:[150,250,400],empresas:[300,500,800]}, // moedas por faixa de orçamento
  tiers:[100,400],                      // faixa 1: até R$100; faixa 2: até R$400; faixa 3: acima
  modelerDisc:0.7, recurringExtra:1.5, maxUnlocks:4, expiryDays:90,
  highValueMin:1000, highValueChance:0.25, freeMaxBudget:100, refund72:0.5,
  pricing:{machineHour:2,kwh:1.5,watts:500,markupMin:0.5,markupMax:1.5}
};
const MATERIALS={PLA:100,PETG:100,ABS:110,ASA:160,TPU:180,Resina:200,'PLA-CF':250,'PETG-CF':250,Nylon:300,PC:280};
const LEVELS=['Básico','Intermediário','Avançado','Industrial'];
const PRINTERS={ender:{n:'Ender 3 / similar',lvl:0},a1:{n:'Bambu A1 / A1 mini',lvl:0},p1s:{n:'Bambu P1S (fechada)',lvl:1},x1c:{n:'Bambu X1C (fechada)',lvl:1},resin:{n:'Resina (Mars/Saturn)',lvl:1},h2d:{n:'Bambu H2D',lvl:2},xl:{n:'Prusa XL / FDM grande',lvl:2},ind:{n:'Industrial (SLS/HP/Stratasys)',lvl:3}};
const FIN={unica:'Cor única',multi:'Multicolorido',pintado:'Aceita pintado'};
const CATS=[
 {id:'suporte',n:'Suporte / organizador',icon:'🧰',seg:'comercial',mat:'PLA',grams:60,hours:3,cx:.2,kw:['suporte','organizador','porta','gancho','prateleira','apoio','headset']},
 {id:'reposicao',n:'Peça de reposição',icon:'🔧',seg:'comercial',mat:'PETG',grams:40,hours:2.5,cx:.5,kw:['reposição','reposicao','quebrou','quebrada','substituir','tampa','botão','lavadora','geladeira']},
 {id:'miniatura',n:'Miniatura / RPG',icon:'🧙',seg:'comercial',mat:'Resina',grams:25,hours:4,cx:.8,fin:'pintado',kw:['miniatura','rpg','boneco','figura','herói','personagem','warhammer','estátua']},
 {id:'decoracao',n:'Decoração',icon:'🏺',seg:'comercial',mat:'PLA',grams:120,hours:6,cx:.4,kw:['vaso','decoração','decoracao','luminária','luminaria','enfeite','presente','litofania','display']},
 {id:'brinde',n:'Brinde / chaveiro',icon:'🔑',seg:'comercial',mat:'PLA',grams:10,hours:.6,cx:.1,fin:'multi',kw:['chaveiro','brinde','lembrança','lembranca','logo']},
 {id:'prototipo',n:'Protótipo',icon:'📐',seg:'empresa',mat:'PETG',grams:90,hours:5,cx:.6,kw:['protótipo','prototipo','teste','maquete','iot']},
 {id:'mecanica',n:'Peça mecânica',icon:'⚙️',seg:'empresa',mat:'PETG-CF',grams:80,hours:4,cx:.8,minLevel:1,kw:['engrenagem','mecânica','mecanica','bucha','eixo','mancal','engate','máquina','maquina','técnico','tecnico']},
 {id:'caixa',n:'Caixa / gabinete',icon:'📦',seg:'empresa',mat:'ASA',grams:150,hours:8,cx:.5,kw:['caixa','gabinete','case','carcaça','carcaca','enclosure','sensor','externo']},
 {id:'lote',n:'Lote industrial recorrente',icon:'🏭',seg:'empresa',mat:'PETG',grams:50,hours:2,cx:.4,rec:'mensal',kw:['lote','recorrente','série','serie','produção','producao','mensal']},
 {id:'modelagem',n:'Só modelagem 3D',icon:'✏️',seg:'comercial',mat:'PLA',grams:0,hours:0,cx:.6,demand:'modelagem',kw:['modelar','modelagem','desenhar','desenho','cad','criar o modelo']},
 {id:'outro',n:'Outro',icon:'❓',seg:'comercial',mat:'PLA',grams:70,hours:4,cx:.5,kw:[]}
];
const CAT=id=>CATS.find(c=>c.id===id)||CATS[CATS.length-1];
const CITIES=[
 {n:'São Paulo',lat:-23.55,lon:-46.63,d:1.2,r:[[1000,5999],[8000,8499]]},{n:'Campinas',lat:-22.9,lon:-47.06,d:1.15,r:[[13000,13139]]},
 {n:'Santos',lat:-23.96,lon:-46.33,d:1.0,r:[[11000,11099]]},{n:'São José dos Campos',lat:-23.22,lon:-45.9,d:1.05,r:[[12200,12249]]},
 {n:'Jundiaí',lat:-23.19,lon:-46.88,d:1.0,r:[[13200,13219]]},{n:'Piracicaba',lat:-22.73,lon:-47.65,d:.95,r:[[13400,13429]]},
 {n:'Ribeirão Preto',lat:-21.18,lon:-47.81,d:.95,r:[[14000,14119]]},{n:'Bauru',lat:-22.31,lon:-49.06,d:.9,r:[[17000,17099]]},
 {n:'Sorocaba',lat:-23.5,lon:-47.46,d:1.0,r:[[18000,18109]]}
];
const OTHERCITY={n:'Interior de SP',lat:-22.5,lon:-47.5,d:.95};
const cityOf=n=>CITIES.find(c=>c.n===n)||OTHERCITY;
function cepCity(cep){const d=String(cep||'').replace(/\D/g,'');if(d.length<8)return {bad:true};const n=parseInt(d.slice(0,5),10);
  if(n<1000||n>19999)return {out:true};const c=CITIES.find(c=>c.r.some(([a,b])=>n>=a&&n<=b));return {city:c?c.n:OTHERCITY.n}}
function distKm(a,b){const A=cityOf(a),B=cityOf(b),R=6371,rad=x=>x*Math.PI/180;
  const dl=rad(B.lat-A.lat),dn=rad(B.lon-A.lon),h=Math.sin(dl/2)**2+Math.cos(rad(A.lat))*Math.cos(rad(B.lat))*Math.sin(dn/2)**2;
  return a===b?Math.round(3+hash(a+b)*10):Math.round(2*R*Math.asin(Math.sqrt(h)))} // SERVER: ViaCEP + Maps

/* ---------- estado ---------- */
const KEY='m3d_v3';let S;
function save(){for(let i=0;i<4;i++){try{localStorage.setItem(KEY,JSON.stringify(S));return}catch(e){
  const o=S.orders.filter(o=>o.photo&&o.photo.startsWith('data:image/jpeg')).sort((a,b)=>b.photo.length-a.photo.length)[0];if(!o)return;o.photo=null;toast('Armazenamento cheio: uma foto foi removida')}}}
function load(){try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}if(!S||S.v!==3){S=seedState();save()}S.ui=S.ui||{}}
const U=id=>S.users.find(u=>u.id===id),O=id=>S.orders.find(o=>o.id===id),me=()=>S.session?U(S.session):null;
const P=u=>u.type==='maker'?'m':u.type==='admin'?'a':'c';
const mkLevel=u=>Math.max(0,...(u.mk.printers.length?u.mk.printers.map(p=>PRINTERS[p.id]?PRINTERS[p.id].lvl:0):[0]));
const nPrinters=u=>u.mk.printers.reduce((a,p)=>a+(p.n||1),0);

/* ---------- notificações ---------- */
function notify(userId,txt,link){(S.notifs[userId]=S.notifs[userId]||[]).unshift({id:uid(),t:Date.now(),txt,link,read:false})}
const unread=u=>(S.notifs[u.id]||[]).filter(n=>!n.read).length;

/* ---------- carteira (moedas com validade de 90 dias) ---------- */
const bal=u=>u.mk.batches.reduce((a,b)=>a+b.left,0);
const hist=(u,t,v)=>u.mk.history.unshift({t,v,d:Date.now()});
function expireBatches(u){if(!u.mk)return;const now=Date.now();let lost=0;u.mk.batches.forEach(b=>{if(b.exp<now&&b.left>0){lost+=b.left;b.left=0}});
  if(lost)hist(u,'Moedas expiradas (90 dias)',-lost);u.mk.batches=u.mk.batches.filter(b=>b.left>0)}
function spend(u,n){let r=n;u.mk.batches.sort((a,b)=>a.exp-b.exp).forEach(b=>{const t=Math.min(b.left,r);b.left-=t;r-=t});u.mk.batches=u.mk.batches.filter(b=>b.left>0)}
function addBatch(u,c,label){u.mk.batches.push({id:uid(),c,left:c,at:Date.now(),exp:addDays(CFG.expiryDays)});u.mk.hasBought=true;hist(u,label,c)}
function packsFor(u){const seg=u.mk.segment==='empresas'?'empresas':'comercial';const l=CFG.packs[seg].map(p=>({...p,n:p.c+' moedas'}));
  if(!u.mk.hasBought)l.unshift({c:CFG.firstPack.c,p:CFG.firstPack.p,n:'Primeira compra',first:true});return l}

/* ---------- estimador de preço (valores do dono; sempre ESTIMATIVA baseada em médias) ---------- */
function estimate({mat,grams,hours,cx=.4}){const P=CFG.pricing,kg=MATERIALS[mat]!=null?MATERIALS[mat]:100;
  const parts={mat:grams/1000*kg,mach:hours*P.machineHour,en:hours*P.watts/1000*P.kwh};const cost=parts.mat+parts.mach+parts.en;
  return {cost,parts,min:cost*(1+P.markupMin),max:cost*(1+P.markupMax),sug:cost*(1+P.markupMin+clamp(cx,0,1)*(P.markupMax-P.markupMin))}}
const DISCLAIMER='Valores estimados, calculados com base em médias. O preço final é negociado com o maker.';
function draftEstimate(d){const c=CAT(d.catId),q=Math.max(1,d.qty||1);let grams=c.grams*Math.pow(q,.92),hours=c.hours*Math.pow(q,.92);
  if(d.stl){grams=d.stl.grams*q;hours=d.stl.hours*q}
  let cx=c.cx+(d.finish==='pintado'?.2:0)+(d.finish==='multi'?.15:0)+(d.minLevel>=2?.2:0)+(d.days<=7?.15:0)+(d.segment==='empresa'?.1:0);
  const e=estimate({mat:d.material==='Não sei'?c.mat:d.material,grams,hours,cx});
  if(d.demand==='modelagem'||c.id==='modelagem'){const m=Math.max(60,e.cost*.0+80*(1+c.cx));return {cost:m/2.2,parts:e.parts,min:m,max:m*1.9,sug:m*(1.2+cx*.3),grams:0,hours:0}}
  e.grams=grams;e.hours=hours;return e}

/* ---------- leitura simples de texto livre ("IA" simulada por palavras-chave) ---------- */
function infer(text){const t=' '+String(text||'').toLowerCase()+' ';let best=null,bs=0;
  CATS.forEach(c=>{const s=c.kw.reduce((a,k)=>a+(t.includes(k)?1:0),0);if(s>bs){bs=s;best=c}});
  const out={catId:best?best.id:null};
  const mats=[['pla-cf','PLA-CF'],['petg-cf','PETG-CF'],['carbono','PETG-CF'],['petg','PETG'],[' pla','PLA'],['abs','ABS'],['asa','ASA'],['tpu','TPU'],['flex','TPU'],['nylon','Nylon'],['resina','Resina'],[' pc ','PC']];
  for(const [k,v] of mats){if(t.includes(k)){out.material=v;break}}
  if(!out.material&&/(externo|sol|chuva|ao ar livre|exterior)/.test(t))out.material='ASA';
  const SK=['cores','cor','dias','dia','horas','hora','cm','mm','m','kg','g','semanas','semana','meses','mes','mês','anos','ano','w','reais','r','x'];let qm,qre=/(\d{1,5})\s*([a-zà-ú]+)/g;while((qm=qre.exec(t))){if(SK.indexOf(qm[2])<0){out.qty=parseInt(qm[1],10);break}}
  if(/(empresa|lote|mensal|indústria|industria|fábrica|fabrica|linha de produção)/.test(t))out.segment='empresa';
  if(/(mensal|todo mês|recorrente)/.test(t))out.rec='mensal';else if(/(semanal)/.test(t))out.rec='semanal';
  if(/h2d|industrial|câmara fechada|camara fechada/.test(t))out.minLevel=/industrial/.test(t)?3:2;
  if(/(multicolor|várias cores|varias cores|3 cores)/.test(t))out.finish='multi';else if(/(pintad|pintura)/.test(t))out.finish='pintado';
  if(/(modelar|desenhar|não tenho o arquivo|nao tenho o arquivo|criar o modelo)/.test(t))out.demand='modelagem';
  return out}

/* ---------- compatibilidade (matching) ---------- */
function scoreOrder(o,u){const m=u.mk,lvl=mkLevel(u),r=[];let s=5;
  if(m.makerType==='modelador'&&o.demand!=='modelagem')return {pct:0,hidden:true,reasons:[],blocked:'Perfil modelador só vê pedidos de modelagem'};
  if(o.minLevel>lvl)return {pct:0,reasons:[],blocked:'Exige equipamento '+LEVELS[o.minLevel]+' ou superior (o seu: '+LEVELS[lvl]+')'};
  if(m.segment==='ambos'){s+=28;r.push('Você atende empresas e comercial')}
  else if((m.segment==='empresas')===(o.segment==='empresa')){s+=35;r.push('Segmento '+(o.segment==='empresa'?'empresas':'comercial')+', como você prefere')}
  else{s+=8;r.push('Segmento diferente da sua preferência')}
  if(o.material==='Não sei'){s+=14;r.push('Cliente aceita sugestão de material')}
  else if(m.materials.includes(o.material)){s+=20;r.push('Você imprime '+o.material)}else r.push('Você não listou '+o.material);
  if(o.minLevel>0){s+=15;r.push('Seu equipamento atende ('+LEVELS[lvl]+')')}else s+=10+Math.min(5,lvl*2);
  let cap=10;if(o.finish==='multi'&&!m.multi)cap-=5;if(o.finish==='pintado'&&!m.paint)cap-=5;if(o.demand==='modelagem'&&!m.model)cap-=5;s+=cap;
  if(cap===10&&(o.finish!=='unica'||o.demand==='modelagem'))r.push('Você tem a capacidade pedida');else if(cap<10)r.push('Falta uma capacidade (cores, pintura ou modelagem)');
  const d=distKm(o.city,u.city);if(d<=m.raio){s+=10-Math.min(6,d/m.raio*6);r.push('A '+d+' km, dentro do seu raio')}else r.push('A '+d+' km, fora do seu raio de '+m.raio+' km');
  if(o.rec!=='pontual'){if(m.rec){s+=5;r.push('Contrato '+o.rec+' que você aceita')}else{s-=5;r.push('Contrato '+o.rec+' (você prefere pontual)')}}else s+=3;
  return {pct:clamp(Math.round(s),5,99),reasons:r,dist:d,blocked:null}}
const isOpen=o=>o.status==='aberto'&&daysLeft(o.deadline)>=0&&o.unlocks.length<CFG.maxUnlocks;
const orderState=o=>o.status!=='aberto'?o.status:daysLeft(o.deadline)<0?'expirado':o.unlocks.length>=CFG.maxUnlocks?'lotado':'aberto';
function feed(u){const day=dayKey();let list=S.orders.filter(o=>isOpen(o)&&!o.unlocks.some(k=>k.makerId===u.id)&&!u.mk.hidden.includes(o.id)).map(o=>({o,sc:scoreOrder(o,u)}));
  list=list.filter(x=>!x.sc.hidden);const blocked=list.filter(x=>x.sc.blocked),ok=list.filter(x=>!x.sc.blocked);
  ok.forEach(x=>{x.rank=x.sc.pct+(x.o.fresh&&Date.now()-x.o.at<DAY?25:0)});ok.sort((a,b)=>b.rank-a.rank);
  const H=ok.filter(x=>x.o.bmax>=CFG.highValueMin),N=ok.filter(x=>x.o.bmax<CFG.highValueMin),out=[];
  // Regra: nos 3 primeiros do feed, 25% de chance (fixa por maker e dia) de ser um pedido REAL de alto valor
  for(let i=0;i<3&&(H.length||N.length);i++){const high=H.length&&hash(u.id+day+i)<CFG.highValueChance;out.push(high?H.shift():(N.length?N.shift():H.shift()))}
  const rest=[...H,...N].sort((a,b)=>b.rank-a.rank);return {list:[...out,...rest],blocked}}

/* ---------- preço dinâmico do desbloqueio ---------- */
function unlockPrice(o,u){const m=u.mk,tier=o.bmax<=CFG.tiers[0]?0:o.bmax<=CFG.tiers[1]?1:2,
  tab=m.segment==='ambos'?(o.segment==='empresa'?'empresas':'comercial'):m.segment,base=CFG.unlock[tab][tier],reasons=[];let mult=1;
  const left=CFG.maxUnlocks-o.unlocks.length,sl=[0,1.2,1.1,1,.9][left]||1;mult*=sl;if(left===1)reasons.push('última vaga (+20%)');else if(left===4)reasons.push('primeira vaga (-10%)');
  const c=cityOf(o.city);mult*=c.d;if(c.d>=1.1)reasons.push('alta demanda em '+o.city);else if(c.d<=.95)reasons.push('demanda mais calma em '+o.city);
  if(daysLeft(o.deadline)<=3){mult*=.85;reasons.push('prazo próximo (-15%)')}
  const cl=U(o.clientId);if(cl&&cl.verified){mult*=1.05;reasons.push('cliente verificado (+5%)')}
  mult=clamp(mult,.8,1.5);let coins=base*mult;
  if(o.rec!=='pontual'){coins*=CFG.recurringExtra;reasons.push('contrato '+o.rec+' (+50%)')}
  if(m.makerType==='modelador'){coins*=CFG.modelerDisc;reasons.push('desconto modelador (-30%)')}
  coins=Math.max(100,Math.round(coins/5)*5);
  const free=!m.hasBought&&!m.freeUsed&&o.bmax<=CFG.freeMaxBudget;return {coins,reasons,free,base,tier}}

/* ---------- contato: chat bloqueia dados externos ---------- */
const blockedText=t=>/(\d[\s.\-()]*){8,}/.test(t)||/\S+@\S+/.test(t)||/(wa\.me|whats|zap|wpp|telegram|insta|ligue|liga pra)/i.test(t);
const tkey=(oid,mid)=>oid+'_'+mid;
const getThread=(oid,mid)=>S.threads[tkey(oid,mid)]||(S.threads[tkey(oid,mid)]={oid,mid,msgs:[]});
const lastProposal=(t)=>[...t.msgs].reverse().find(m=>m.type==='proposal');

/* ---------- desbloqueio ---------- */
function doUnlock(oid,free){const u=me(),o=O(oid);if(!u||u.type!=='maker'||!o)return {ok:false,msg:'Indisponível'};
  if(!isOpen(o))return {ok:false,msg:'Pedido não está mais disponível'};if(o.unlocks.some(k=>k.makerId===u.id))return {ok:false,msg:'Você já desbloqueou'};
  const sc=scoreOrder(o,u);if(sc.blocked)return {ok:false,msg:sc.blocked};const pr=unlockPrice(o,u);
  if(free){if(!pr.free)return {ok:false,msg:'Desbloqueio grátis só para contas novas, em pedidos até R$ 100'};
    o.unlocks.push({makerId:u.id,free:true,paid:0,date:Date.now(),stage:'desbloqueado'});u.mk.freeUsed=true;hist(u,'Desbloqueio GRÁTIS (só chat): '+o.title,0)}
  else{if(bal(u)<pr.coins)return {ok:false,msg:'need',need:pr.coins};spend(u,pr.coins);o.unlocks.push({makerId:u.id,free:false,paid:pr.coins,date:Date.now(),stage:'desbloqueado'});hist(u,'Desbloqueio: '+o.title,-pr.coins)}
  notify(o.clientId,u.name+' se interessou pelo seu pedido "'+o.title+'"','/c/pedido/'+o.id);save();return {ok:true}}
const unlockOf=(o,uid)=>o.unlocks.find(k=>k.makerId===uid);

/* ---------- foto: reduz para caber no localStorage ---------- */
function resizeImage(file,max,q,cb){const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');
  c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',q))};im.onerror=()=>cb(null);im.src=fr.result};fr.onerror=()=>cb(null);fr.readAsDataURL(file)}
function placeholder(catId){const c=CAT(catId),col=c.seg==='empresa'?'#7c3aed':'#ff6a00';
  return 'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140"><rect width="200" height="140" fill="#14141b"/><circle cx="175" cy="15" r="70" fill="'+col+'" opacity=".35"/><text x="100" y="90" font-size="58" text-anchor="middle">'+c.icon+'</text></svg>')}
const photoOf=o=>o.photo||placeholder(o.catId);

/* ---------- arquivo STL: volume, peso, tempo e giro 3D (sem bibliotecas) ---------- */
function parseSTL(buf){let tris=[];const dv=new DataView(buf);const txt=new TextDecoder().decode(new Uint8Array(buf,0,Math.min(buf.byteLength,200)));
  const bin=buf.byteLength>=84&&84+dv.getUint32(80,true)*50===buf.byteLength;
  if(bin){const n=dv.getUint32(80,true);for(let i=0;i<n;i++){const o=84+i*50+12,t=[];for(let k=0;k<9;k++)t.push(dv.getFloat32(o+k*4,true));tris.push(t)}}
  else if(/^\s*solid/.test(txt)){const all=new TextDecoder().decode(new Uint8Array(buf)),re=/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g;let m,v=[];while((m=re.exec(all))){v.push(+m[1],+m[2],+m[3]);if(v.length===9){tris.push(v);v=[]}}}
  return stlInfo(tris)}
function stlInfo(tris){if(!tris.length)return null;let vol=0,mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
  tris.forEach(t=>{const[a,b,c,d,e,f,g,h,i]=t;vol+=(a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g))/6;for(let k=0;k<9;k++){const ax=k%3;mn[ax]=Math.min(mn[ax],t[k]);mx[ax]=Math.max(mx[ax],t[k])}});
  const cm3=Math.abs(vol)/1000,grams=Math.max(1,cm3*1.24*.38),hours=Math.max(.3,grams/14);
  return {tris:tris.length>1800?tris.filter((_,i)=>i%Math.ceil(tris.length/1800)===0):tris,cm3,grams,hours,size:[0,1,2].map(i=>mx[i]-mn[i]),mn,mx}}
function sampleSTL(){const n=28,R=15,H=20,tris=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,b=(i+1)/n*Math.PI*2,x1=R*Math.cos(a),y1=R*Math.sin(a),x2=R*Math.cos(b),y2=R*Math.sin(b);
  tris.push([0,0,0,x1,y1,0,x2,y2,0],[0,0,H,x2,y2,H,x1,y1,H],[x1,y1,0,x1,y1,H,x2,y2,0],[x2,y2,0,x1,y1,H,x2,y2,H])}return stlInfo(tris)}
let _stlAnim=0;
function drawSTL(info){const cv=$('#stl');if(!cv||!info)return;const g=cv.getContext('2d'),w=cv.width=cv.clientWidth*2,h=cv.height=380;const cx=(info.mn[0]+info.mx[0])/2,cy=(info.mn[1]+info.mx[1])/2,cz=(info.mn[2]+info.mx[2])/2,sc=Math.min(w,h)*.38/Math.max(...info.size,1);
  const id=++_stlAnim;let ang=0;(function f(){if(id!==_stlAnim||!$('#stl'))return;ang+=.02;g.clearRect(0,0,w,h);g.strokeStyle='#ff6a00';g.lineWidth=1;const ca=Math.cos(ang),sa=Math.sin(ang),tl=.5,ct=Math.cos(tl),st=Math.sin(tl);
    const pr=(x,y,z)=>{x-=cx;y-=cy;z-=cz;const X=x*ca-y*sa,Y=x*sa+y*ca,Z=z;return [w/2+X*sc,h/2+(Y*ct-Z*st)*sc]};
    info.tris.forEach(t=>{const a=pr(t[0],t[1],t[2]),b=pr(t[3],t[4],t[5]),c=pr(t[6],t[7],t[8]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.stroke()});requestAnimationFrame(f)})()}

/* ---------- UI utilitários ---------- */
let _tt;function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('on'),2400)}
function modal(h){const m=$('#modal');m.innerHTML='<div class="sheet">'+h+'</div>';m.classList.add('on');m.onclick=e=>{if(e.target===m)closeModal()}}
function closeModal(){const m=$('#modal');m.classList.remove('on');m.innerHTML=''}
const tag=(t,c)=>'<span class="tag '+(c||'')+'">'+t+'</span>';
const chipsHtml=(name,opts,def,key)=>'<div class="chips">'+opts.map(([v,l])=>'<label class="chip"><input type="radio" name="'+name+'" value="'+esc(v)+'" '+(String(v)===String(def)?'checked':'')+' onchange="dset(&quot;'+key+'&quot;,&quot;'+esc(v)+'&quot;)">'+l+'</label>').join('')+'</div>';
const stars=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
function go(path){if(location.hash==='#'+path)render();else location.hash=path}
