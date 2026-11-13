'use strict';
(() => {
 const data=window.PLAYER_DATA;
 const el=id=>document.getElementById(id);
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=(n,d=0)=>n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
 if(!data?.players?.length){el('player-count').textContent='Não foi possível carregar os jogadores. Recarregue a página.';return;}
 const players=data.players;
 if(el('hero-roster')) el('hero-roster').innerHTML=['aspas','Asuna','lukxo'].map(name=>players.find(p=>p.name===name)).filter(Boolean).map(p=>`<div class="hero-player">${Media.portrait(p)}<span>${esc(p.name)}</span><small>${Media.logo(p.team)} ${esc(p.team)}</small></div>`).join('');
 const metrics={rating:['Rating',2],acs:['ACS',0],kd:['K/D',2],kast:['KAST',0,'%'],adr:['ADR',1],hsp:['HS',0,'%'],k:['Abates',0]};
 const value=(p,key)=>fmt(p[key],metrics[key][1])+(metrics[key][2]||'');
 const filtered=()=>players.filter(p=>(!el('player-team').value||p.team===el('player-team').value)&&p.maps>=Number(el('min-maps').value)&&p.name.toLocaleLowerCase().includes(el('player-search').value.trim().toLocaleLowerCase())).sort((a,b)=>b[el('player-sort').value]-a[el('player-sort').value]||b.maps-a.maps||a.name.localeCompare(b.name));
 for(const team of [...new Set(players.map(p=>p.team))].sort())el('player-team').add(new Option(team,team));
 function renderPlayers(){
  const rows=filtered();
  el('player-count').textContent=`${rows.length} de ${players.length} jogadores · ordem decrescente por ${metrics[el('player-sort').value][0]} · mínimo de ${el('min-maps').value} mapas`;
  el('highlights').innerHTML=rows.length?['rating','acs','kd'].map((key,i)=>{const p=[...rows].sort((a,b)=>b[key]-a[key]||b.maps-a.maps)[0];return `<article class="highlight"><span class="eyebrow">${['MAIOR RATING','MAIOR IMPACTO · ACS','MAIOR K/D'][i]}</span><div class="highlight-portrait">${Media.portrait(p)}</div><h3>${esc(p.name)}</h3><small>${Media.logo(p.team)} ${esc(p.team)} · ${p.maps} mapas</small><strong>${value(p,key)}<span>${metrics[key][0]} no recorte</span></strong></article>`;}).join(''):'';
  el('players-body').innerHTML=rows.map((p,i)=>`<tr><td class="row-number">${String(i+1).padStart(2,'0')}</td><td class="player-name">${Media.player(p)}</td><td class="agents">${p.agents.slice(0,3).map(esc).join(' · ')}</td><td>${p.maps}</td>${['rating','acs','kd','kast','adr','hsp'].map(key=>`<td>${value(p,key)}</td>`).join('')}<td><a href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Perfil de ${esc(p.name)} no VLR">VLR ↗</a></td></tr>`).join('')||'<tr><td colspan="11">Nenhum jogador encontrado. Reduza o mínimo de mapas ou limpe os filtros.</td></tr>';
 }
 for(const id of ['player-search','player-team','min-maps','player-sort'])el(id).addEventListener(id==='player-search'?'input':'change',renderPlayers);
 el('reset-players').addEventListener('click',()=>{el('player-search').value='';el('player-team').value='';el('min-maps').value='10';el('player-sort').value='rating';renderPlayers();});
 for(const id of ['compare-a','compare-b'])for(const p of [...players].sort((a,b)=>a.name.localeCompare(b.name)))el(id).add(new Option(`${p.name} · ${p.team}`,p.url));
 el('compare-a').value=(players.find(p=>p.name==='aspas')||players[0]).url;
 el('compare-b').value=(players.find(p=>p.name==='Asuna')||players[1]).url;
 function compare(){
  const a=players.find(p=>p.url===el('compare-a').value),b=players.find(p=>p.url===el('compare-b').value);
  el('comparison').innerHTML=`<div class="compare-profiles">${[a,b].map(p=>`<article class="compare-profile">${Media.portrait(p)}<div><span class="eyebrow">${Media.logo(p.team)} ${esc(p.team)}</span><h3>${esc(p.name)}</h3><p>${p.maps} mapas · ${p.rnd} rounds</p></div></article>`).join('')}</div><div class="sample"><span>${esc(a.name)} · ${a.maps} mapas / ${a.rnd} rounds</span><span>${esc(b.name)} · ${b.maps} mapas / ${b.rnd} rounds</span></div>`+(a===b?'<p class="note">Você selecionou o mesmo jogador nos dois lados.</p>':'')+Object.keys(metrics).map(key=>{const max=Math.max(a[key],b[key],1);return `<div class="comparison-row"><div class="comparison-value">${value(a,key)}<div class="track"><div class="fill" style="width:${100*a[key]/max}%"></div></div></div><span>${metrics[key][0]}</span><div class="comparison-value">${value(b,key)}<div class="track"><div class="fill" style="width:${100*b[key]/max}%"></div></div></div></div>`;}).join('');
 }
 for(const id of ['compare-a','compare-b'])el(id).addEventListener('change',compare);
 el('export-players').addEventListener('click',()=>{
  const cols=['name','team','maps','rnd','rating','acs','kd','kast','adr','hsp','k','d','a','url'];
  const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const csv=[cols.join(','),...filtered().map(p=>cols.map(k=>quote(p[k])).join(','))].join('\r\n');
  const url=URL.createObjectURL(new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='valorant-jogadores-recorte.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 const links=[...document.querySelectorAll('aside .nav')];
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'0px 0px -65% 0px',threshold:0});for(const a of links){const target=document.querySelector(a.hash);if(target)observer.observe(target);}}
 renderPlayers();compare();
})();
