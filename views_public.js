/* ===== Telas públicas: home, entrar, cadastros ===== */
const homeOf=u=>u.type==='maker'?'/m/mural':u.type==='admin'?'/a/painel':'/c/inicio';
function loginAs(id){S.session=id;save();const u=U(id);go(homeOf(u))}
function logout(){closeModal();S.session=null;save();go('/')}
const typeLabel=u=>u.type==='admin'?'Painel do investidor':u.type==='maker'?'Maker '+(u.mk.makerType==='modelador'?'modelador':u.mk.segment==='empresas'?'· Empresas':u.mk.segment==='ambos'?'· Ambos':'· Comercial'):(u.kind==='empresa'?'Cliente Empresa':'Cliente Pessoa Física');

function viewHome(){if(isSite())return viewSiteHome();const U1=CFG.unlock.comercial,U2=CFG.unlock.empresas;
return `<div class="hero"><span class="tag">100% grátis para quem pede</span><h1>Sua peça 3D,<br><span>do maker certo</span></h1><p>Mande uma foto e quanto quer pagar. A gente conecta você ao maker ideal, perto de você.</p>
<div class="col"><button class="b big" onclick="go('/cadastro/cliente')">Pedir minha peça grátis</button><button class="b big w" onclick="go('/cadastro/maker')">Sou maker, quero pedidos</button><button class="b s" onclick="startTour()">▶ Ver demonstração guiada</button></div></div>
<div class="card"><h3 style="margin-top:0">Como funciona</h3>
<div class="row"><span style="font-size:26px">📸</span><div><b>1. Mande uma foto ou escolha da lista</b><div class="mut">Não sabe o material? Tudo bem, a gente sugere.</div></div></div><br>
<div class="row"><span style="font-size:26px">🎯</span><div><b>2. Makers compatíveis veem seu pedido</b><div class="mut">Por material, equipamento e distância. Até ${CFG.maxUnlocks} makers entram em contato.</div></div></div><br>
<div class="row"><span style="font-size:26px">💬</span><div><b>3. Compare propostas e feche</b><div class="mut">Converse pelo app, compare preços e escolha.</div></div></div></div>
<div class="card" id="empresas"><h3 style="margin-top:0">🏢 Para empresas</h3><ul class="sm"><li>Peça <b>previsibilidade</b>: pedidos mensais ou semanais</li><li>Exija o <b>nível de equipamento</b> (ex.: Bambu H2D, câmara fechada)</li><li>Defina materiais obrigatórios: ASA, PETG-CF, Nylon...</li><li>Nota fiscal e relatório de qualidade</li></ul><button class="b s" onclick="go('/cadastro/cliente')">Cadastrar minha empresa</button></div>
<div class="card" id="makers"><h3 style="margin-top:0">🖨️ Para makers: moedas</h3><p class="sm">Pedidos são grátis de ver. Você paga <b>moedas</b> só para falar com o cliente. Moedas valem ${CFG.expiryDays} dias.</p>
<div class="note"><b>Primeira compra: ${CFG.firstPack.c} moedas por ${fm(CFG.firstPack.p)}</b> (depois, mínimo ${fm(CFG.packs.comercial[0].p)}). Conta nova ganha 1 desbloqueio grátis só de chat.</div>
<table><tr><th>Desbloqueio</th><th>Comercial</th><th>Empresas</th></tr><tr><td>Pedido até R$ 100</td><td>${U1[0]}</td><td>${U2[0]}</td></tr><tr><td>R$ 100 a 400</td><td>${U1[1]}</td><td>${U2[1]}</td></tr><tr><td>Acima de R$ 400</td><td>${U1[2]}</td><td>${U2[2]}</td></tr></table>
<p class="mut">O preço muda com demanda, vagas e prazo, e aparece antes de pagar. Modelador paga 70%.</p><button class="b" onclick="go('/cadastro/maker')">Quero ser maker</button></div>
<h3>Categorias populares</h3><div class="catg">${CATS.slice(0,10).map(c=>`<button class="opt" onclick="go('/cadastro/cliente')"><span>${c.icon}</span>${c.n}</button>`).join('')}</div>
<h3>Perguntas frequentes</h3>
<details><summary>Quanto custa para o cliente?</summary><p class="sm">Nada. Publicar e conversar é grátis. Você só paga o maker pelo serviço combinado.</p></details>
<details><summary>Não sei qual material usar. E agora?</summary><p class="sm">Sem problema. Mande uma foto e o valor que quer pagar. O maker ajuda. Para uso externo, por exemplo, indicamos ASA.</p></details>
<details><summary>Meu telefone fica público?</summary><p class="sm">Não. Só os makers que desbloqueiam seu pedido veem seus dados de contato.</p></details>
<details><summary>Como o maker paga?</summary><p class="sm">Com moedas, compradas por Pix (simulado neste protótipo).</p></details>
<details><summary>O que é proibido?</summary><p class="sm">Armas de fogo, peças bélicas e itens ilegais. Todo anúncio tem botão de denúncia.</p></details>
<p class="mut c">Protótipo ilustrativo · dados fictícios · Pix e verificações simulados.<br><a href="#/ajuda">Ajuda e termos</a></p>`}

function viewLogin(){const ps=S.users.filter(u=>['c1','c2','m1','m2','a1'].includes(u.id)||u.mine);
return `<h2>Entrar</h2><p class="mut">Protótipo sem senha: escolha uma conta de demonstração.</p>`+ps.map(u=>`<button class="opt" onclick="loginAs('${u.id}')"><div class="row sp"><b>${esc(u.name)}</b>${tag(typeLabel(u))}</div><div class="mut">${u.type==='maker'?esc(u.city)+' · '+nPrinters(u)+' impressora(s) · nível '+LEVELS[mkLevel(u)]+(u.mk.hasBought?'':' · conta nova (1 desbloqueio grátis)'):u.type==='admin'?'Números do negócio, simulador e pitch':esc(u.city)}</div></button>`).join('')+
`<div class="row" style="margin-top:12px"><button class="b" onclick="go('/cadastro/cliente')">Criar conta de cliente</button><button class="b s" onclick="go('/cadastro/maker')">Criar conta de maker</button></div>`}

/* ---------- cadastro do cliente ---------- */
function toggleEmp(v){const e=$('#emp');if(e)e.style.display=v?'block':'none'}
function viewSignupC(){return `<h2>Cadastro rápido</h2><form class="card" onsubmit="return submitClient(event)">
<div class="chips"><label class="chip"><input type="radio" name="kind" value="pf" checked onchange="toggleEmp(false)">👤 Pessoa física</label><label class="chip"><input type="radio" name="kind" value="empresa" onchange="toggleEmp(true)">🏢 Empresa</label></div>
<label>Seu nome</label><input name="name" required placeholder="Maria Silva">
<label>WhatsApp (com DDD)</label><input name="phone" required inputmode="tel" placeholder="19999999999">
<label>E-mail (opcional)</label><input name="email" type="email">
<label>CEP</label><input name="cep" required maxlength="9" inputmode="numeric" placeholder="00000-000">
<div id="emp" style="display:none"><div class="note">Empresas podem pedir previsibilidade e exigir equipamento.</div>
<label>Razão social</label><input name="razao"><div class="g2"><div><label>CNPJ</label><input name="cnpj" placeholder="00.000.000/0000-00"></div><div><label>Ramo</label><input name="ramo"></div></div>
<label>Cargo do contato</label><input name="cargo">
<div class="g2"><div><label>Recorrência</label><select name="rec"><option value="pontual">Pontual</option><option value="mensal">Mensal</option><option value="semanal">Semanal</option></select></div><div><label>Volume/mês (peças)</label><input name="vol" type="number" min="0" value="100"></div></div>
<label>Equipamento mínimo exigido</label><select name="minLevel">${LEVELS.map((l,i)=>`<option value="${i}">${i===0?'Qualquer':i===2?'Avançado (ex.: Bambu H2D)':i===1?'Intermediário (ex.: P1S/X1C)':l}</option>`).join('')}</select>
<label>Materiais obrigatórios</label><div class="chips">${['ASA','PETG','PETG-CF','Nylon','PC','TPU','ABS'].map(m=>`<label class="chip"><input type="checkbox" name="mats" value="${m}">${m}</label>`).join('')}</div>
<label><input type="checkbox" name="nf"> Preciso de nota fiscal</label><label><input type="checkbox" name="report"> Preciso de relatório de qualidade</label></div>
<p class="mut">🔒 Seus dados de contato só aparecem para makers que desbloquearem seu pedido.</p><button class="b big full">Continuar</button></form>`}
function submitClient(e){e.preventDefault();const f=new FormData(e.target),kind=f.get('kind'),cc=cepCity(f.get('cep'));
  if(cc.bad){toast('CEP inválido');return false}
  if(kind==='empresa'&&(!f.get('razao')||String(f.get('cnpj')).replace(/\D/g,'').length!==14)){toast('Empresa: informe a razão social e um CNPJ com 14 números');return false}
  const u={id:uid(),type:'cliente',kind,name:f.get('name'),phone:f.get('phone'),email:f.get('email'),cep:f.get('cep'),city:cc.city||'',outSP:!!cc.out,verified:false,mine:true,created:Date.now()};
  if(kind==='empresa')Object.assign(u,{company:{razao:f.get('razao'),cnpj:f.get('cnpj'),ramo:f.get('ramo'),cargo:f.get('cargo')},rec:f.get('rec'),vol:+f.get('vol')||0,minLevel:+f.get('minLevel'),mats:f.getAll('mats'),nf:!!f.get('nf'),report:!!f.get('report')});
  S.users.push(u);S.session=u.id;S.ui.d=null;save();toast(cc.out?'Cadastro feito. Ainda não atendemos fora de SP.':'Cadastro feito!');go('/c/novo');return false}

/* ---------- assistente de triagem do maker (4 passos) ---------- */
function wz(){return S.ui.wz||(S.ui.wz={step:1,d:{kind:'mei',did:['impressao'],pr:{},materials:['PLA'],segment:'comercial',raio:40}})}
function viewSignupM(){const w=wz(),d=w.d,s=w.step;
let body='';
if(s===1)body=`<label>Nome do estúdio ou seu nome</label><input name="name" required value="${esc(d.name||'')}"><div class="g2"><div><label>WhatsApp</label><input name="phone" required value="${esc(d.phone||'')}"></div><div><label>E-mail</label><input name="email" type="email" value="${esc(d.email||'')}"></div></div>
<div class="g2"><div><label>CEP</label><input name="cep" required maxlength="9" value="${esc(d.cep||'')}"></div><div><label>Raio (km)</label><input name="raio" type="number" min="5" max="400" value="${d.raio}"></div></div>
<label>Você atua como</label><select name="kind"><option value="pf" ${d.kind==='pf'?'selected':''}>Pessoa física</option><option value="mei" ${d.kind==='mei'?'selected':''}>MEI</option><option value="cnpj" ${d.kind==='cnpj'?'selected':''}>Empresa (CNPJ)</option></select><label><input type="checkbox" name="nf" ${d.nf?'checked':''}> Emito nota fiscal</label>`;
if(s===2)body=`<label>O que você faz? (marque tudo)</label><div class="chips">${[['impressao','🖨️ Impressão 3D'],['modelagem','✏️ Modelagem 3D'],['pintura','🎨 Pintura / acabamento'],['projeto','📐 Projeto sob medida']].map(([v,l])=>`<label class="chip"><input type="checkbox" name="did" value="${v}" ${d.did.includes(v)?'checked':''}>${l}</label>`).join('')}</div>
<div class="g2"><div><label>Peças por mês (capacidade)</label><input name="perMonth" type="number" min="1" value="${d.perMonth||30}"></div><div><label>Anos de experiência</label><input name="exp" type="number" min="0" value="${d.exp==null?2:d.exp}"></div></div>`;
if(s===3)body=`<label>Quantas impressoras de cada tipo?</label>${Object.entries(PRINTERS).map(([id,p])=>`<div class="row sp" style="margin:4px 0"><span class="sm">${p.n} <span class="mut">(${LEVELS[p.lvl]})</span></span><input name="pr_${id}" type="number" min="0" max="50" style="width:70px" value="${d.pr[id]||0}"></div>`).join('')}
<label>Materiais que você imprime</label><div class="chips">${Object.keys(MATERIALS).map(m=>`<label class="chip"><input type="checkbox" name="materials" value="${m}" ${d.materials.includes(m)?'checked':''}>${m}</label>`).join('')}</div><label><input type="checkbox" name="multi" ${d.multi?'checked':''}> Faço impressão multicolorida (AMS/MMU)</label>`;
if(s===4)body=`<label>Que tipo de cliente você quer atender?</label>${[['comercial','🎁 Comercial','Peças pequenas e decorativas. Desbloqueio mais barato.'],['empresas','🏭 Empresas','Peças mecânicas e técnicas, mais recorrência. Desbloqueio mais caro, pedidos maiores.'],['ambos','🔀 Ambos','Você vê os dois tipos.']].map(([v,t,x])=>`<label class="opt ${d.segment===v?'on':''}" style="display:block"><input type="radio" name="segment" value="${v}" ${d.segment===v?'checked':''} onchange="this.form.querySelectorAll('.opt').forEach(o=>o.classList.remove('on'));this.parentNode.classList.add('on')" style="display:none"><b>${t}</b><div class="mut">${x}</div></label>`).join('')}
<label><input type="checkbox" name="rec" ${d.rec?'checked':''}> Aceito contratos recorrentes (mensal/semanal)</label><label>Sobre você (opcional)</label><textarea name="bio" rows="2">${esc(d.bio||'')}</textarea>`;
return `<h2>Triagem do maker</h2><div class="bar"><i style="width:${s*25}%"></i></div><p class="mut">Passo ${s} de 4 · isso melhora os pedidos que aparecem para você</p><form class="card" onsubmit="return wzNext(event)">${body}
<div class="row" style="margin-top:14px">${s>1?'<button type="button" class="b s" onclick="wzBack()">Voltar</button>':''}<button class="b" style="flex:1">${s<4?'Continuar':'Criar meu perfil'}</button></div></form>`}
function wzBack(){wz().step--;render()}
function wzNext(e){e.preventDefault();const w=wz(),d=w.d,f=new FormData(e.target),s=w.step;
  if(s===1){const cc=cepCity(f.get('cep'));if(cc.bad){toast('CEP inválido');return false}if(cc.out){toast('Por enquanto atendemos só o estado de SP. Entre na lista de espera na Ajuda.');return false}
    Object.assign(d,{name:f.get('name'),phone:f.get('phone'),email:f.get('email'),cep:f.get('cep'),city:cc.city,raio:+f.get('raio')||40,kind:f.get('kind'),nf:!!f.get('nf')})}
  if(s===2){d.did=f.getAll('did');if(!d.did.length){toast('Marque pelo menos uma opção');return false}d.perMonth=+f.get('perMonth')||30;d.exp=+f.get('exp')||0}
  if(s===3){d.pr={};Object.keys(PRINTERS).forEach(id=>{d.pr[id]=+f.get('pr_'+id)||0});d.materials=f.getAll('materials');d.multi=!!f.get('multi');
    if(d.did.includes('impressao')&&!Object.values(d.pr).some(x=>x>0)){toast('Informe pelo menos 1 impressora');return false}}
  if(s===4){d.segment=f.get('segment')||'comercial';d.rec=!!f.get('rec');d.bio=f.get('bio')||''}
  if(s<4){w.step++;render();return false}
  const onlyModel=!d.did.includes('impressao');
  const u={id:uid(),type:'maker',name:d.name,phone:d.phone,email:d.email,cep:d.cep,city:d.city,verified:false,mine:true,created:Date.now(),
    mk:{makerType:onlyModel?'modelador':'impressor',segment:d.segment,printers:Object.entries(d.pr).filter(([,n])=>n>0).map(([id,n])=>({id,n})),materials:d.materials,multi:d.multi,paint:d.did.includes('pintura'),model:d.did.includes('modelagem')||d.did.includes('projeto'),
      raio:d.raio,perMonth:d.perMonth,exp:d.exp,rec:d.rec,bio:d.bio,kind:d.kind,nf:d.nf,batches:[],history:[],hasBought:false,freeUsed:false,fav:[],hidden:[],rating:0,reviews:0,portfolio:[]}};
  S.users.push(u);S.session=u.id;S.ui.wz=null;save();toast('Perfil criado! Você ganhou 1 desbloqueio grátis (só chat).');go('/m/mural');return false}
