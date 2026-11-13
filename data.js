/* ===== Dados de exemplo (fictícios) - cidades do estado de São Paulo ===== */
function seedState(){
  const mk=p=>Object.assign({makerType:'impressor',segment:'comercial',printers:[{id:'a1',n:1}],materials:['PLA'],multi:false,paint:false,model:false,raio:40,perMonth:30,exp:2,rec:false,bio:'',kind:'mei',nf:false,batches:[],history:[],hasBought:false,freeUsed:false,fav:[],hidden:[],rating:4.7,reviews:10,portfolio:[]},p);
  const cl=(id,name,city,cep,extra)=>Object.assign({id,type:'cliente',kind:'pf',name,phone:'119'+String(90000000+Math.floor(hash(id)*9999999)),email:'',cep,city,verified:hash(id)>.4,bot:true,created:Date.now()-30*DAY},extra||{});
  const users=[
    cl('c1','Marina Costa','Campinas','13015-000',{bot:false,verified:true,phone:'19991110001',email:'marina@email.com'}),
    cl('c2','Roberto Rocha','Jundiaí','13210-000',{bot:false,verified:true,kind:'empresa',phone:'11999990002',email:'compras@metalurgicarocha.com.br',company:{razao:'Metalúrgica Rocha Ltda',cnpj:'12.345.678/0001-90',ramo:'Metalurgia',cargo:'Compras'},minLevel:1,rec:'mensal',vol:300,mats:['ASA','ABS'],nf:true,report:true}),
    cl('c3','Ana Paula Souza','São Paulo','01310-100'),cl('c4','Carlos Mendes','Sorocaba','18035-000'),
    cl('c5','Loja Brindes Já','Piracicaba','13400-100',{kind:'empresa',company:{razao:'Brindes Já ME',cnpj:'98.765.432/0001-10',ramo:'Brindes',cargo:'Sócio'}}),
    cl('c6','Tech IoT Labs','Campinas','13083-000',{kind:'empresa',company:{razao:'Tech IoT Labs SA',cnpj:'11.222.333/0001-44',ramo:'Eletrônica',cargo:'Engenharia'}}),
    cl('c7','Fábrica Santini','Ribeirão Preto','14015-000',{kind:'empresa',company:{razao:'Santini Indústria',cnpj:'55.666.777/0001-88',ramo:'Máquinas',cargo:'Manutenção'}}),
    cl('c8','Julia Ramos','Santos','11010-000'),
    cl('c9','Visão Industrial','São José dos Campos','12210-000',{kind:'empresa',company:{razao:'Visão Industrial Ltda',cnpj:'33.444.555/0001-66',ramo:'Visão computacional',cargo:'P&D'}}),
    cl('c10','Pedro Alves','Bauru','17010-000'),cl('c11','Casa & Estilo','São Paulo','04538-000',{kind:'empresa',company:{razao:'Casa e Estilo Ltda',cnpj:'77.888.999/0001-22',ramo:'Varejo',cargo:'Compras'}}),
    cl('c12','Controle Max','Jundiaí','13201-000',{kind:'empresa',company:{razao:'Controle Max Automação',cnpj:'44.555.666/0001-33',ramo:'Automação',cargo:'Engenharia'}}),
    {id:'m1',type:'maker',name:'Studio Layer',phone:'19988880001',email:'contato@studiolayer.com',cep:'13015-500',city:'Campinas',verified:false,created:Date.now()-2*DAY,
      mk:mk({segment:'comercial',printers:[{id:'a1',n:2},{id:'p1s',n:1}],materials:['PLA','PETG','Resina'],multi:true,paint:true,model:false,raio:60,bio:'Peças decorativas, miniaturas e brindes.',rating:0,reviews:0})},
    {id:'m2',type:'maker',name:'Indústria 3D Campinas',phone:'19988880002',email:'comercial@industria3d.com',cep:'13035-000',city:'Campinas',verified:true,created:Date.now()-120*DAY,
      mk:mk({segment:'empresas',kind:'cnpj',nf:true,printers:[{id:'h2d',n:2},{id:'x1c',n:3},{id:'p1s',n:2}],materials:['PLA','PETG','ABS','ASA','PETG-CF','Nylon'],multi:true,paint:false,model:true,raio:120,perMonth:400,exp:5,rec:true,bio:'Produção técnica e lotes recorrentes para indústria.',rating:4.9,reviews:38,hasBought:true,
        batches:[{id:'b1',c:700,left:420,at:addDays(-84),exp:addDays(6)},{id:'b2',c:1000,left:780,at:addDays(-20),exp:addDays(70)}],
        history:[{t:'Compra 1.000 moedas',v:1000,d:addDays(-20)},{t:'Desbloqueio: Lote de buchas de nylon',v:-220,d:addDays(-18)},{t:'Compra 700 moedas',v:700,d:addDays(-84)}]})},
    {id:'m3',type:'maker',name:'Oficina do Ricardo',phone:'11977770003',email:'',cep:'01310-100',city:'São Paulo',verified:true,created:Date.now()-200*DAY,mk:mk({segment:'comercial',printers:[{id:'a1',n:3}],materials:['PLA','PETG'],multi:true,paint:true,rating:4.6,reviews:21,hasBought:true})},
    {id:'m4',type:'maker',name:'Layer SP',phone:'11977770004',email:'',cep:'04538-000',city:'São Paulo',verified:true,created:Date.now()-150*DAY,mk:mk({segment:'ambos',printers:[{id:'p1s',n:2},{id:'resin',n:1}],materials:['PLA','PETG','Resina'],multi:true,paint:true,model:true,rating:4.8,reviews:44,hasBought:true})},
    {id:'m5',type:'maker',name:'PrintLab Sorocaba',phone:'15977770005',email:'',cep:'18035-000',city:'Sorocaba',verified:true,created:Date.now()-90*DAY,mk:mk({segment:'empresas',kind:'cnpj',printers:[{id:'x1c',n:4},{id:'xl',n:1}],materials:['PLA','PETG','ABS','ASA','PETG-CF'],rec:true,raio:90,rating:4.7,reviews:19,hasBought:true})},
    {id:'m6',type:'maker',name:'Maker Ribeirão',phone:'16977770006',email:'',cep:'14015-000',city:'Ribeirão Preto',verified:false,created:Date.now()-60*DAY,mk:mk({segment:'comercial',printers:[{id:'ender',n:2}],materials:['PLA'],rating:4.3,reviews:6,hasBought:true})},
    {id:'m7',type:'maker',name:'Fábrica Aditiva Santos',phone:'13977770007',email:'',cep:'11010-000',city:'Santos',verified:true,created:Date.now()-300*DAY,mk:mk({segment:'empresas',kind:'cnpj',printers:[{id:'ind',n:2},{id:'h2d',n:1}],materials:['ABS','ASA','Nylon','PC','PETG-CF'],rec:true,raio:200,rating:4.9,reviews:57,hasBought:true})},
    {id:'a1',type:'admin',name:'Investidor (admin)',phone:'',email:'',cep:'',city:'',verified:true,created:Date.now()}
  ];
  const byId=id=>users.find(u=>u.id===id);
  const ord=(id,cid,title,cat,desc,o)=>{const c=CAT(cat),u=byId(cid),d=Object.assign({id,clientId:cid,title,desc,photo:null,catId:cat,segment:u.kind==='empresa'?'empresa':c.seg,material:c.mat,qty:1,finish:c.fin||'unica',demand:c.demand||'arquivo',minLevel:c.minLevel||0,rec:'pontual',bmin:50,bmax:100,days:10,cep:u.cep,city:u.city,status:'aberto',unlocks:[],at:Date.now()-Math.floor(hash(id)*4)*DAY,fresh:false,files:[]},o);
    d.deadline=addDays(d.days);delete d.days;const tier=d.bmax<=100?0:d.bmax<=400?1:2;
    d.unlocks=(o.ul||[]).map(x=>{const m=byId(x[0]),seg=m.mk.segment==='empresas'||(m.mk.segment==='ambos'&&d.segment==='empresa')?'empresas':'comercial';
      return {makerId:x[0],free:false,paid:CFG.unlock[seg][tier],date:Date.now()-(x[2]||1)*DAY,stage:x[1]||'desbloqueado',value:x[3]||0}});delete d.ul;return d};
  const orders=[
    ord('o1','c1','Suporte de headset para mesa','suporte','Suporte para mesa de escritório, altura de 25 cm.',{qty:2,bmin:30,bmax:80,days:10,files:['suporte.stl'],ul:[['m3'],['m4']]}),
    ord('o2','c1','Vaso geométrico em 3 cores','decoracao','Vaso decorativo para sala, quero em 3 cores.',{finish:'multi',material:'PETG',bmin:60,bmax:100,days:7}),
    ord('o3','c2','Lote de 200 engates plásticos em ABS','mecanica','Peça técnica para linha de montagem. Fornecimento mensal.',{material:'ABS',qty:200,minLevel:1,rec:'mensal',bmin:1200,bmax:2000,days:30,files:['engate.step','desenho.pdf'],ul:[['m5'],['m2','negociacao',1]]}),
    ord('o4','c2','Carcaças em ASA para sensor externo','caixa','Carcaça para uso externo (sol e chuva). Precisa de acabamento bom.',{material:'ASA',qty:50,minLevel:2,rec:'mensal',bmin:1500,bmax:3000,days:20,ul:[['m7']]}),
    ord('o5','c3','Miniaturas de RPG (8 unid.) pintadas','miniatura','Preciso modelar e imprimir 8 heróis, já pintados.',{material:'Resina',qty:8,finish:'pintado',demand:'modelagem',bmin:250,bmax:400,days:20,ul:[['m4']]}),
    ord('o6','c4','Peça de reposição de lavadora (tenho foto)','reposicao','Quebrou a trava da porta. Só tenho a foto da peça.',{material:'Não sei',demand:'foto',bmin:40,bmax:90,days:12}),
    ord('o7','c5','Chaveiros com logo (500 un.)','brinde','Brinde para evento, 2 cores.',{qty:500,finish:'multi',bmin:400,bmax:900,days:15,ul:[['m4']]}),
    ord('o8','c6','Protótipo de gabinete IoT','prototipo','Preciso de 3 unidades para teste de bancada.',{qty:3,material:'PETG',bmin:150,bmax:300,days:8,files:['gabinete.stl']}),
    ord('o9','c7','Engrenagens em nylon (30 un.)','mecanica','Substituição de engrenagens de máquina antiga.',{material:'Nylon',qty:30,minLevel:2,bmin:800,bmax:1500,days:25,ul:[['m5']]}),
    ord('o10','c8','Luminária litofania','decoracao','Litofania com foto da família.',{qty:4,bmin:120,bmax:250,days:9}),
    ord('o11','c9','Suporte técnico PETG-CF para câmera de linha','mecanica','Suportes rígidos para câmeras industriais. Fornecimento semanal.',{material:'PETG-CF',qty:120,minLevel:2,rec:'semanal',bmin:2000,bmax:4500,days:40,files:['suporte_cam.step']}),
    ord('o12','c10','Modelar peça a partir de foto','modelagem','Não tenho o arquivo. Preciso desenhar a peça e imprimir.',{demand:'modelagem',bmin:80,bmax:200,days:14}),
    ord('o13','c11','Displays de loja decorados','decoracao','10 displays em PLA, cores da marca.',{qty:10,finish:'multi',bmin:300,bmax:600,days:11,ul:[['m4'],['m6'],['m3']]}),
    ord('o14','c12','Cases ASA para dispositivos industriais','caixa','Cases com furação para conectores. Mensal.',{material:'ASA',qty:100,minLevel:1,rec:'mensal',bmin:1800,bmax:2600,days:28,ul:[['m5'],['m7'],['m6'],['m3']]}),
    ord('o15','c3','Organizador de bancada','suporte','Organizador para ferramentas pequenas.',{bmin:40,bmax:90,days:-2}),
    ord('o16','c4','Lote de buchas de nylon','mecanica','Lote antigo, já fechado.',{material:'Nylon',qty:60,minLevel:1,bmin:1800,bmax:2500,days:-5,status:'fechado',ul:[['m2','fechado',30,2400]]}),
    ord('o17','c8','Carcaça ASA externa','caixa','Pedido antigo, já fechado.',{material:'ASA',qty:20,bmin:1200,bmax:2000,days:-9,status:'fechado',ul:[['m2','fechado',22,1800]]}),
    ord('o18','c9','Suportes PETG-CF','mecanica','Pedido antigo, já fechado.',{material:'PETG-CF',qty:80,minLevel:1,bmin:2500,bmax:3500,days:-12,status:'fechado',ul:[['m2','fechado',40,3200]]}),
    ord('o19','c6','Peças de ventilação ABS','mecanica','Pedido antigo: cliente escolheu outro maker.',{material:'ABS',qty:40,bmin:900,bmax:1500,days:-6,status:'fechado',ul:[['m2','perdido',33]]})
  ];
  const m=(from,text,days)=>({from,type:'text',text,t:addDays(-(days||1))});
  const pr=(price,dd,note,status,days)=>({from:'maker',type:'proposal',p:{price,days:dd,note,status},t:addDays(-(days||1))});
  const threads={
    o1_m3:{oid:'o1',mid:'m3',msgs:[m('maker','Olá Marina! Tenho Bambu A1, faço em PLA em 2 dias.',2),m('client','Oi! Quanto fica?',2),pr(70,3,'PLA preto, 2 unidades, retirada em SP','pendente',1)]},
    o1_m4:{oid:'o1',mid:'m4',msgs:[pr(85,2,'PETG resistente, acabamento fino','pendente',1)]},
    o3_m5:{oid:'o3',mid:'m5',msgs:[m('maker','Bom dia! Atendemos lotes de ABS. Podemos emitir nota fiscal.',2),pr(1650,12,'200 unidades, ABS, entrega em 12 dias','pendente',1)]},
    o3_m2:{oid:'o3',mid:'m2',msgs:[m('maker','Olá! Temos H2D e X1C, ABS com câmara fechada para qualidade constante. Nota fiscal inclusa.',1),pr(1480,10,'200 un., ABS, NF, contrato mensal com desconto','pendente',1)]},
    o4_m7:{oid:'o4',mid:'m7',msgs:[pr(2400,18,'50 carcaças em ASA, acabamento alisado','pendente',1)]}
  };
  const notifs={m2:[{id:'n1',t:Date.now()-3600e3,txt:'Novo pedido compatível: Carcaças em ASA para sensor externo (96%)',link:'/m/pedido/o4',read:false},{id:'n2',t:Date.now()-7200e3,txt:'Suas moedas (700) expiram em 6 dias. Use antes!',link:'/m/carteira',read:false}],
    c2:[{id:'n3',t:Date.now()-5400e3,txt:'Indústria 3D Campinas enviou uma proposta: R$ 1.480',link:'/c/pedido/o3',read:false}],
    c1:[{id:'n4',t:Date.now()-9000e3,txt:'Oficina do Ricardo enviou uma proposta: R$ 70',link:'/c/pedido/o1',read:false}]};
  return {v:3,users,orders,threads,notifs,reports:[{id:'r1',oid:'o15',by:'m4',reason:'Anúncio parece duplicado',t:Date.now()-DAY}],waitlist:[],session:null,ui:{},tour:{on:false,i:0}};
}
