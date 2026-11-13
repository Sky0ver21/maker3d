/* ===== Roteador, cabeçalho, menus e inicialização ===== */
const ROUTES=[
 [/^\/$/,'any',()=>viewHome()],[/^\/entrar$/,'any',()=>viewLogin()],[/^\/cadastro\/cliente$/,'any',()=>viewSignupC()],[/^\/cadastro\/maker$/,'any',()=>viewSignupM()],[/^\/ajuda$/,'any',()=>viewHelp()],
 [/^\/c\/inicio$/,'c',u=>viewCHome(u)],[/^\/c\/novo$/,'c',u=>viewCNew(u)],[/^\/c\/pedidos$/,'c',u=>viewCOrders(u)],[/^\/c\/pedido\/(.+)$/,'c',(u,id)=>viewCOrder(u,id)],
 [/^\/c\/chat$/,'c',u=>viewChats(u)],[/^\/c\/chat\/(.+)$/,'c',(u,k)=>viewThread(u,k)],[/^\/c\/contatos$/,'c',u=>viewContacts(u)],[/^\/c\/conta$/,'c',u=>viewAccount(u)],[/^\/c\/notificacoes$/,'c',u=>viewNotifs(u)],
 [/^\/m\/mural$/,'m',u=>viewBoard(u)],[/^\/m\/pedido\/(.+)$/,'m',(u,id)=>viewMOrder(u,id)],[/^\/m\/contratos$/,'m',u=>viewContracts(u)],[/^\/m\/chat$/,'m',u=>viewChats(u)],[/^\/m\/chat\/(.+)$/,'m',(u,k)=>viewThread(u,k)],
 [/^\/m\/contatos$/,'m',u=>viewContacts(u)],[/^\/m\/carteira$/,'m',u=>viewWallet(u)],[/^\/m\/perfil$/,'m',u=>viewProfile(u)],[/^\/m\/painel$/,'m',u=>viewPanel(u)],[/^\/m\/calculadora$/,'m',u=>viewCalc(u)],
 [/^\/m\/conta$/,'m',u=>viewAccount(u)],[/^\/m\/notificacoes$/,'m',u=>viewNotifs(u)],
 [/^\/a\/painel$/,'a',()=>viewAPanel()],[/^\/a\/simulador$/,'a',()=>viewASim()],[/^\/a\/pitch$/,'a',()=>viewAPitch()],[/^\/a\/moderacao$/,'a',()=>viewAMod()]
];
function resolve(path,u){for(const [re,role,fn] of ROUTES){const m=path.match(re);if(!m)continue;
  if(role!=='any'){if(!u)return {redirect:'/entrar'};if(P(u)!==role)return {redirect:homeOf(u)}}
  return {html:fn(u,...m.slice(1).map(decodeURIComponent))}}
  return {html:'<div class="card"><h2>Página não encontrada</h2><button class="b" onclick="go(\'/\')">Ir para o início</button></div>'}}

function header(u){const logo=`<a class="logo" href="#${u?homeOf(u):'/'}">${BRAND.replace('3D','<b>3D</b>')}</a>`;
  if(!u)return logo+`<div class="hr"><button class="b s sm" onclick="demoMenu()">Demo</button><button class="b sm" onclick="go('/entrar')">Entrar</button></div>`;
  const n=unread(u);return logo+`<div class="hr">${u.type==='maker'?`<button class="b sm" onclick="go('/m/carteira')">🪙 ${bal(u)}</button>`:''}<button class="ib" aria-label="Notificações" onclick="go('/${P(u)}/notificacoes')">🔔${n?`<i class="dot">${n}</i>`:''}</button><button class="ib av" aria-label="Menu" onclick="menu()">${esc(u.name[0])}</button></div>`}
function menu(){const u=me();if(!u)return;const p=P(u);const L=u.type==='maker'?[['mural','🎯 Mural de pedidos'],['contratos','📄 Contratos'],['chat','💬 Chat'],['contatos','👥 Contatos'],['carteira','🪙 Carteira'],['painel','📈 Painel de resultados'],['calculadora','🧮 Calculadora'],['perfil','🛠️ Perfil técnico'],['notificacoes','🔔 Notificações'],['conta','⚙️ Conta']]
  :u.type==='admin'?[['painel','📊 Painel'],['simulador','🧮 Simulador de receita'],['pitch','🎤 Pitch'],['moderacao','🚩 Moderação']]
  :[['inicio','🏠 Início'],['novo','＋ Novo pedido'],['pedidos','📋 Meus pedidos'],['chat','💬 Propostas e chat'],['contatos','👥 Contatos'],['notificacoes','🔔 Notificações'],['conta','⚙️ Minha conta']];
  modal(`<div class="row sp"><b>${esc(u.name)}</b>${tag(typeLabel(u))}</div>${L.map(([k,l])=>`<button class="mi" onclick="closeModal();go('/${p}/${k}')">${l}</button>`).join('')}<button class="mi" onclick="closeModal();go('/ajuda')">❓ Ajuda e termos</button><button class="mi" onclick="closeModal();demoMenu()">▶ Demonstração / trocar de conta</button><button class="mi" onclick="logout()">↩ Sair</button>`)}
function bar(u,path){if(!u)return '';const it=u.type==='maker'?[['/m/mural','🎯','Mural'],['/m/contratos','📄','Contratos'],['/m/chat','💬','Chat'],['/m/carteira','🪙','Carteira'],['menu','☰','Menu']]
  :u.type==='admin'?[['/a/painel','📊','Painel'],['/a/simulador','🧮','Simulador'],['/a/pitch','🎤','Pitch'],['/a/moderacao','🚩','Moderação'],['menu','☰','Menu']]
  :[['/c/inicio','🏠','Início'],['/c/pedidos','📋','Pedidos'],['/c/novo','＋','Novo','plus'],['/c/chat','💬','Chat'],['menu','☰','Menu']];
  return it.map(([r,ic,l,c])=>`<button class="${c||''} ${path===r||(r!=='menu'&&path.indexOf(r+'/')===0)?'on':''}" onclick="${r==='menu'?'menu()':`go('${r}')`}"><span>${ic}</span>${l}</button>`).join('')}
function sidePanel(){const u=me(),ps=[['c1','👤 Cliente Pessoa Física'],['c2','🏢 Cliente Empresa'],['m1','🖨️ Maker Comercial (conta nova)'],['m2','🏭 Maker Empresas'],['a1','📊 Investidor']];
  $('#side').innerHTML=`<h1>${BRAND.replace('3D','<b>3D</b>')}</h1><p>Marketplace que conecta quem precisa de uma peça 3D ao maker certo. Protótipo ilustrativo, dados fictícios.</p>${ps.map(([id,l])=>`<button class="pbtn ${S.session===id?'on':''}" onclick="loginAs('${id}')">${l}</button>`).join('')}<button class="pbtn" onclick="startTour()">▶ Tour guiado</button><button class="pbtn" onclick="logout()">↩ Sair (página pública)</button>${S.tour&&S.tour.on?`<div class="tourbox">${tourHtml()}</div>`:''}<p><small>Dica: no celular, "Adicionar à tela inicial" instala como app.</small></p>`}

function render(keep){const sc=keep?$('#app').scrollTop:0;const path=(location.hash||'#/').slice(1)||'/';const u=me();if(u&&u.mk)expireBatches(u);
  let r;try{r=resolve(path,u)}catch(err){console.error(err);r={html:'<div class="card"><b>Ops, algo deu errado nesta tela.</b><div class="mut">'+esc(err.message)+'</div><button class="b" onclick="go(\'/\')">Voltar ao início</button></div>'}}
  if(r.redirect){location.hash=r.redirect;return}
  document.body.className=!u?'public':u.type==='maker'?'maker':u.type==='admin'?'admin':'client';
  $('#top').innerHTML=header(u);$('#app').innerHTML='<div class="ban">Protótipo ilustrativo · dados fictícios · Pix e verificações simulados</div>'+r.html+(S.tour&&S.tour.on?'<div class="tour mob">'+tourHtml()+'</div>':'');
  $('#bar').innerHTML=bar(u,path);$('#bar').style.display=u?'flex':'none';$('#app').scrollTop=sc;sidePanel();if($('#stl')&&window.STLMEM)drawSTL(window.STLMEM)}
window.addEventListener('hashchange',()=>render());
load();
if(location.search.indexOf('selftest')>-1){const s=document.createElement('script');s.src='selftest.js';document.body.appendChild(s)}else render();
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
