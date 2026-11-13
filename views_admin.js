/* ===== Painel do investidor (admin), demonstração guiada ===== */
const bars=(items,fmt)=>{const mx=Math.max(...items.map(i=>i[1]),1);return items.map(([l,v])=>`<div style="margin:6px 0"><div class="row sp sm"><span>${esc(l)}</span><b>${fmt?fmt(v):v}</b></div><div class="bar"><i style="width:${v/mx*100}%"></i></div></div>`).join('')};
function viewAPanel(){const ords=S.orders,ul=ords.reduce((a,o)=>a+o.unlocks.length,0),coins=ords.reduce((a,o)=>a+o.unlocks.reduce((b,k)=>b+(k.refunded?0:k.paid),0),0),
  withUl=ords.filter(o=>o.unlocks.length).length,withProp=Object.values(S.threads).filter(t=>lastProposal(t)).length,closed=ords.filter(o=>o.status==='fechado').length,
  city={},cat={};ords.forEach(o=>{city[o.city]=(city[o.city]||0)+1;cat[CAT(o.catId).n]=(cat[CAT(o.catId).n]||0)+1});
  const top=m=>Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<div class="ban">Números ilustrativos do protótipo (dados fictícios)</div><h2>Painel do investidor</h2>
  <div class="kpi"><div class="card"><b>${ords.length}</b><span class="mut">pedidos publicados</span></div><div class="card"><b>${ul}</b><span class="mut">desbloqueios</span></div><div class="card"><b>${fm(coins*CFG.coinValue)}</b><span class="mut">receita em moedas</span></div><div class="card"><b>${S.users.filter(u=>u.type==='maker').length}/${S.users.filter(u=>u.type==='cliente').length}</b><span class="mut">makers / clientes</span></div></div>
  <h3>Funil</h3><div class="card">${bars([['Pedidos publicados',ords.length],['Com 1+ maker interessado',withUl],['Com proposta enviada',withProp],['Fechados',closed]])}</div>
  <h3>Cidades com mais pedidos</h3><div class="card">${bars(top(city))}</div><h3>Categorias</h3><div class="card">${bars(top(cat))}</div>
  <div class="note">Meta de saúde: 2 a 3 desbloqueios por pedido (de ${CFG.maxUnlocks}). Hoje: ${ords.length?(ul/ords.length).toFixed(1):0}.</div>`}
function simRun(){const s=S.ui.sim||(S.ui.sim={mk:100,rc:80,g:10,act:60});const g=s.g/100,rows=[];let m=s.mk;for(let i=1;i<=12;i++){rows.push([i,m,m*(s.act/100)*s.rc]);m=m*(1+g)}
  const mx=Math.max(...rows.map(r=>r[2]),1),last=rows[11];
  return `<div class="kpi"><div class="card"><b>${brl(last[2])}</b><span class="mut">receita no mês 12</span></div><div class="card"><b>${brl(rows.reduce((a,r)=>a+r[2],0))}</b><span class="mut">receita em 12 meses</span></div></div>
  <div class="card" style="margin-top:12px"><svg viewBox="0 0 240 110" width="100%">${rows.map((r,i)=>{const h=r[2]/mx*90;return `<rect x="${i*20+4}" y="${100-h}" width="14" height="${h}" rx="3" fill="var(--pri)"/><text x="${i*20+11}" y="108" font-size="7" text-anchor="middle" fill="#888">${r[0]}</text>`}).join('')}</svg><div class="mut c">Receita mensal em R$ (meses 1 a 12)</div></div>
  <div class="mut">Mês 12: ${Math.round(last[1])} makers ativos. Simulação simples, não é previsão.</div>`}
function simSet(k,v){S.ui.sim[k]=+v;const o=$('#simout');if(o)o.innerHTML=simRun();const l=$('#sl_'+k);if(l)l.textContent=v}
function viewASim(){const s=S.ui.sim||(S.ui.sim={mk:100,rc:80,g:10,act:60});
  const sl=(k,l,min,max,st)=>`<label>${l}: <b id="sl_${k}">${s[k]}</b></label><input type="range" min="${min}" max="${max}" step="${st}" value="${s[k]}" oninput="simSet('${k}',this.value)">`;
  return `<h2>Simulador de receita</h2><div class="card">${sl('mk','Makers cadastrados no início',10,2000,10)}${sl('act','% de makers que compram moedas no mês',10,100,5)}${sl('rc','Recarga média por maker (R$/mês)',35,300,5)}${sl('g','Crescimento de makers por mês (%)',0,30,1)}</div><div id="simout">${simRun()}</div>`}
function viewAPitch(){const cp=[['Cronoshare','Orçamento local genérico (até 4 profissionais)','Não é especializado em 3D'],['Maker Market','Rede para lojas virtuais (produção sob demanda)','Catálogo fixo, sem pedido sob medida'],['Craftcloud / Xometry','Cotação instantânea industrial','Exige arquivo pronto, foco internacional'],['Fábrica3D / Koios 3D','Bureaus nacionais centralizados','Não abrem para makers locais']];
  return `<h2>Pitch</h2><div class="card"><b>Problema</b><p class="sm">Quem precisa de uma peça 3D não sabe qual material, quem imprime ou quanto pagar. Makers têm impressoras paradas e não acham clientes.</p></div>
  <div class="card"><b>Solução</b><p class="sm">Mande uma foto e o valor. A plataforma entende o pedido, sugere preço e conecta ao maker certo (material, equipamento e distância).</p></div>
  <div class="card"><b>Como ganha dinheiro</b><p class="sm">Makers compram moedas (Pix) para desbloquear contatos. Preço dinâmico por valor do pedido, demanda e vagas. Moedas valem ${CFG.expiryDays} dias. Empresas geram recorrência.</p></div>
  <div class="card"><b>Concorrência (pesquisa de nov/2026)</b><table>${cp.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}<br><span class="mut">${r[2]}</span></td></tr>`).join('')}</table><p class="mut">Ninguém encontrado com leads pagos por moedas e match por material e equipamento.</p></div>
  <div class="card"><b>Diferencial</b><ul class="sm"><li>Cliente sem conhecimento técnico: foto e valor bastam</li><li>Match por material, equipamento e distância</li><li>Empresas exigem equipamento (ex.: H2D) e recorrência</li><li>Estimativa de preço transparente (custo + margem 50 a 150%)</li></ul></div>
  <div class="card"><b>Roadmap</b><ol class="sm"><li>Protótipo (hoje)</li><li>MVP real: Supabase, Pix, cadastro verificado, estado de SP</li><li>Escrow, propostas, plugin de loja, 2ª região</li></ol></div>`}
function viewAMod(){return `<h2>Moderação</h2><div class="kpi"><div class="card"><b>${S.reports.length}</b><span class="mut">denúncias</span></div><div class="card"><b>${S.waitlist.length}</b><span class="mut">lista de espera (fora de SP)</span></div></div>
  ${S.reports.length?S.reports.map(r=>{const o=O(r.oid);return `<div class="card"><b>${o?esc(o.title):'(pedido removido)'}</b><div class="mut">${esc(r.reason)} · ${U(r.by)?esc(U(r.by).name):''} · ${fdate(r.t)}</div><div class="row" style="margin-top:6px">${o?`<button class="b sm r" onclick="modRemove('${r.id}','${o.id}')">Remover anúncio</button>`:''}<button class="b sm s" onclick="modDismiss('${r.id}')">Ignorar</button></div></div>`}).join(''):'<div class="card mut">Sem denúncias.</div>'}`}
function modRemove(rid,oid){S.orders=S.orders.filter(o=>o.id!==oid);S.reports=S.reports.filter(r=>r.id!==rid);save();toast('Anúncio removido');render(true)}
function modDismiss(rid){S.reports=S.reports.filter(r=>r.id!==rid);save();render(true)}

/* ---------- demonstração guiada ---------- */
const TOUR=[
 {t:'A ideia em 30 segundos',x:'Quem precisa de uma peça 3D não sabe material, nem quem imprime. Aqui basta uma foto e o valor. Makers pagam moedas para falar com o cliente.',p:null,r:'/'},
 {t:'1. Empresa publica um pedido',x:'Metalúrgica Rocha descreve o que precisa. O sistema entende, sugere preço (estimativa) e permite exigir equipamento e recorrência.',p:'c2',r:'/c/novo'},
 {t:'2. Maker novo ganha 1 desbloqueio grátis',x:'Conta nova vê pedidos pequenos com botão grátis (só chat). Para dividir contato no chat, precisa comprar o pacote mínimo.',p:'m1',r:'/m/mural'},
 {t:'3. Maker de Empresas vê o que combina',x:'Feed por compatibilidade (segmento, material ASA, equipamento H2D, distância). O que exige equipamento acima do dele aparece bloqueado.',p:'m2',r:'/m/mural'},
 {t:'4. Preço dinâmico do desbloqueio',x:'O preço muda com vagas, demanda e prazo e mostra o motivo antes de pagar. Contrato recorrente custa mais.',p:'m2',r:'/m/pedido/o4'},
 {t:'5. Chat e proposta',x:'O maker conversa e envia proposta com valor e prazo. Telefones são bloqueados no chat.',p:'m2',r:'/m/chat/o3_m2'},
 {t:'6. Cliente compara propostas',x:'O cliente vê todos os makers interessados, compara preço, prazo e nota, aceita e fecha.',p:'c2',r:'/c/pedido/o3'},
 {t:'7. Resultados do maker',x:'O maker vê quanto gastou em moedas e quanto fechou. É isso que faz ele recomprar.',p:'m2',r:'/m/painel'},
 {t:'8. Visão do investidor',x:'Funil, receita em moedas, cidades e simulador de crescimento.',p:'a1',r:'/a/painel'}];
function startTour(){S.tour={on:true,i:0};tourGo(0)}
function tourGo(i){S.tour.i=clamp(i,0,TOUR.length-1);const s=TOUR[S.tour.i];S.session=s.p;save();go(s.r)}
function endTour(){S.tour.on=false;save();render(true)}
const tourHtml=()=>{if(!S.tour||!S.tour.on)return '';const s=TOUR[S.tour.i];return `<b>${s.t}</b> <span class="mut">(${S.tour.i+1}/${TOUR.length})</span><p class="sm" style="margin:6px 0">${s.x}</p><div class="row"><button class="b sm s" onclick="tourGo(${S.tour.i-1})" ${S.tour.i===0?'disabled':''}>←</button><button class="b sm" onclick="tourGo(${S.tour.i+1})" ${S.tour.i===TOUR.length-1?'disabled':''}>Próximo →</button><button class="b sm g" onclick="endTour()">Sair</button></div>`};
function demoMenu(){modal(`<h3 style="margin-top:0">Demonstração</h3><button class="mi" onclick="closeModal();startTour()">▶ Tour guiado (9 passos)</button><div class="mut" style="margin:8px 0">Ou entre direto como:</div>${[['c1','👤 Cliente Pessoa Física'],['c2','🏢 Cliente Empresa'],['m1','🖨️ Maker Comercial (conta nova)'],['m2','🏭 Maker Empresas'],['a1','📊 Investidor (admin)']].map(([id,l])=>`<button class="mi" onclick="closeModal();loginAs('${id}')">${l}</button>`).join('')}`)}
