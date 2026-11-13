'use strict';
(() => {
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const media=window.MEDIA_DATA||{players:{},teams:{}};
 const image=(url,name,kind)=>`<span class="media-image ${kind}"><span class="media-initials" aria-hidden="true">${esc(name.slice(0,2).toUpperCase())}</span>${url?`<img src="${esc(url)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="96" height="96">`:''}</span>`;
 const team=name=>media.teams[name];
 window.Media={
  portrait:p=>image(media.players[p.url]?.image,p.name,'portrait'),
  logo:name=>image(team(name)?.image,name,'team-logo'),
  team:name=>`<span class="team-identity">${image(team(name)?.image,name,'team-logo')}<span>${esc(name)}</span></span>`,
  player:p=>`<span class="player-identity">${image(media.players[p.url]?.image,p.name,'portrait')}<span class="player-copy">${esc(p.name)}<small>${image(team(p.team)?.image,p.team,'team-logo')}${esc(p.team)}</small></span></span>`
 };
 document.addEventListener('error',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.media-image'))e.target.remove();},true);
})();
