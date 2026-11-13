/* Autoteste: abra index.html?selftest . Percorre todas as telas de cada persona e regras principais. */
(function(){const out=[];let bad=0;
function t(name,fn){try{const r=fn();out.push('OK  '+name+(r?' '+r:''))}catch(e){bad++;out.push('ERR '+name+' :: '+e.message+' @ '+String(e.stack||'').split('\n')[1])}}
function eq(a,b,m){if(a!==b)throw new Error((m||'')+' esperado '+b+' recebido '+a)}
localStorage.removeItem(KEY);load();
const G={c:['/c/inicio','/c/novo','/c/pedidos','/c/pedido/o1','/c/pedido/o3','/c/chat','/c/chat/o3_m2','/c/contatos','/c/conta','/c/notificacoes'],
 m:['/m/mural','/m/pedido/o4','/m/pedido/o2','/m/contratos','/m/chat','/m/chat/o3_m2','/m/contatos','/m/carteira','/m/perfil','/m/painel','/m/calculadora','/m/conta','/m/notificacoes'],
 a:['/a/painel','/a/simulador','/a/pitch','/a/moderacao'],pub:['/','/entrar','/cadastro/cliente','/cadastro/maker','/ajuda']};
[false,true].forEach(site=>[['c1','c'],['c2','c'],['m1','m'],['m2','m'],['a1','a'],[null,'pub']].forEach(([id,g])=>{FORCE_SITE=site;S.session=id;G[g].forEach(p=>t((site?'SITE ':'APP ')+(id||'pub')+' '+p,()=>{const r=resolve(p,me());if(r.redirect)throw new Error('redirect '+r.redirect);
  if(!r.html||r.html.length<20)throw new Error('vazio');const m=r.html.match(/.{0,25}(undefined|NaN|\[object|null).{0,25}/);if(m)throw new Error('texto ruim: '+m[0])}))}));FORCE_SITE=null;
['c1','c2','m1','m2','a1',null].forEach(id=>t('chrome '+id,()=>{S.session=id;const u=me();header(u);bar(u,'/x');sidePanel();if(u)menu();closeModal();demoMenu();closeModal();location.hash='#'+(u?homeOf(u):'/');render();if(!$('#app'))throw new Error('sem app')}));
FORCE_SITE=true;['c1','m2',null,'a1'].forEach(id=>t('chrome site '+id,()=>{S.session=id;location.hash='#/';render();const u=me();if(u)location.hash='#'+homeOf(u);render();if(!$('#bar'))throw new Error('sem bar')}));FORCE_SITE=null;
S.session='m1';
t('estimativa 100g PLA 5h',()=>{const e=estimate({mat:'PLA',grams:100,hours:5,cx:.5});eq(e.cost.toFixed(2),'23.75');eq(e.min.toFixed(2),'35.63');eq(e.max.toFixed(2),'59.38')});
t('cep Campinas e fora de SP',()=>{eq(cepCity('13015-000').city,'Campinas');if(!cepCity('20000-000').out)throw new Error('deveria ser fora')});
t('chat bloqueia telefone',()=>{if(!blockedText('me liga 11 99999-9999'))throw new Error('1');if(!blockedText('chama no zap'))throw new Error('2');if(blockedText('faço 100 peças em 15 dias por 250'))throw new Error('falso positivo')});
t('maker novo: grátis em pedido <=R$100',()=>{const u=U('m1');if(!unlockPrice(O('o2'),u).free)throw new Error('deveria ser grátis');if(unlockPrice(O('o3'),u).free)throw new Error('o3 não deveria ser grátis')});
t('maker sem equipamento não vê pedido H2D',()=>{const sc=scoreOrder(O('o4'),U('m1'));if(!sc.blocked)throw new Error('deveria bloquear')});
t('m2 vê o4 compatível',()=>{const sc=scoreOrder(O('o4'),U('m2'));if(sc.blocked||sc.pct<70)throw new Error('pct '+sc.pct)});
t('feed deterministico por dia',()=>{const a=feed(U('m2')).list.map(x=>x.o.id).join(),b=feed(U('m2')).list.map(x=>x.o.id).join();eq(a,b)});
t('feed: 3 primeiros com regra 25%',()=>{let hv=0,n=0;S.users.filter(u=>u.type==='maker').forEach(u=>{feed(u).list.slice(0,3).forEach(x=>{n++;if(x.o.bmax>=1000)hv++})});return hv+'/'+n+' de alto valor'});
t('desbloqueio grátis m1 em o2',()=>{S.session='m1';const r=doUnlock('o2',true);if(!r.ok)throw new Error(r.msg);if(!U('m1').mk.freeUsed)throw new Error('freeUsed');if(O('o2').unlocks.length!==1)throw new Error('unlocks')});
t('segundo grátis falha',()=>{if(doUnlock('o10',true).ok)throw new Error('não deveria')});
t('desbloqueio pago sem moedas pede carteira',()=>{eq(doUnlock('o10').msg,'need')});
t('compra mínima 34,90',()=>{const u=U('m1'),p=packsFor(u)[0];eq(p.p,34.9);eq(p.c,500);addBatch(u,p.c,'teste');eq(bal(u),500);eq(packsFor(u)[0].p,50)});
t('desbloqueio pago debita',()=>{const b=bal(U('m1')),r=doUnlock('o10');if(!r.ok)throw new Error(JSON.stringify(r));if(bal(U('m1'))>=b)throw new Error('não debitou')});
t('validade 90 dias',()=>{const u=U('m1');u.mk.batches[0].exp=Date.now()-1;expireBatches(u);eq(bal(u),0)});
t('trava de 4 desbloqueios (o14 lotado)',()=>{eq(orderState(O('o14')),'lotado')});
t('pedido expirado (o15)',()=>{eq(orderState(O('o15')),'expirado')});
t('preço dinâmico mostra motivo',()=>{const p=unlockPrice(O('o3'),U('m2'));if(!p.reasons.length||p.coins<300)throw new Error(JSON.stringify(p))});
t('publicar pedido (cliente c1)',()=>{S.session='c1';S.ui.d=null;const d=D();applyCat('suporte',true);d.title='Teste suporte';d.cep='13015-000';const e=draftEstimate(d);d.bmin=Math.round(e.min);d.bmax=Math.round(e.max);publish();if(!S.orders[0].fresh||S.orders[0].title!=='Teste suporte')throw new Error('não criou')});
t('texto livre entende ASA/mensal/empresa',()=>{const g=infer('preciso de 50 carcaças em ASA para sensor externo, uso mensal');eq(g.catId,'caixa');eq(g.material,'ASA');eq(g.qty,50);eq(g.rec,'mensal')});
t('STL de exemplo calcula volume',()=>{const i=sampleSTL();if(!(i.cm3>10&&i.cm3<20))throw new Error('cm3 '+i.cm3);return i.cm3.toFixed(1)+' cm3'});
t('proposta + aceite + bot',()=>{S.session='m2';sendProposalDirect()});
function sendProposalDirect(){const key='o4_m2';getThread('o4','m2');const o=O('o4');if(!unlockOf(o,'m2')){o.unlocks.push({makerId:'m2',free:false,paid:500,date:Date.now(),stage:'desbloqueado'})}
  const th=S.threads[key];th.msgs.push({from:'maker',type:'proposal',p:{price:2200,days:15,note:'ok',status:'pendente'},t:Date.now()});S.session='c2';propAct(key,th.msgs.length-1,'aceita');eq(unlockOf(o,'m2').stage,'negociacao')}
out.unshift(bad?'FALHAS: '+bad:'TODOS OS TESTES PASSARAM ('+out.length+')');
const pre=document.createElement('pre');pre.id='selftest';pre.textContent=out.join('\n');document.body.innerHTML='';document.body.appendChild(pre);document.title=bad?'SELFTEST FAIL':'SELFTEST OK'})();
