'use strict';
function validate(matches) {
 if (!Array.isArray(matches) || !matches.length) throw new Error('Base de partidas vazia.');
 const ids=new Set();
 for(const m of matches){
  if(!m.id || ids.has(m.id)) throw new Error('Identificador duplicado ou ausente.');
  ids.add(m.id);
  if(!['groups','playins','playoffs'].includes(m.phase)) throw new Error('Fase inválida.');
  if(!m.team_a || !m.team_b || m.team_a===m.team_b) throw new Error('Equipes inválidas.');
  const a=m.score_a,b=m.score_b,target=m.best_of===3?2:m.best_of===5?3:NaN;
  if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a===b||Math.max(a,b)!==target||Math.min(a,b)>=target) throw new Error('Placar inválido.');
 }
 return true;
}
function analyze(matches) {
 const teams=new Map();
 const get=name=>{if(!teams.has(name)) teams.set(name,{team:name,played:0,wins:0,losses:0,maps_won:0,maps_lost:0});return teams.get(name)};
 for(const m of matches){
  for(const [name,won,lost] of [[m.team_a,m.score_a,m.score_b],[m.team_b,m.score_b,m.score_a]]){
   const t=get(name);t.played++;t.wins+=Number(won>lost);t.losses+=Number(won<lost);t.maps_won+=won;t.maps_lost+=lost;
  }
 }
 const ranking=[...teams.values()].map(t=>({...t,map_diff:t.maps_won-t.maps_lost,win_rate:100*t.wins/t.played,map_win_rate:100*t.maps_won/(t.maps_won+t.maps_lost)})).sort((a,b)=>b.win_rate-a.win_rate||b.map_diff-a.map_diff||b.wins-a.wins||a.team.localeCompare(b.team));
 return {series:matches.length,maps:matches.reduce((s,m)=>s+m.score_a+m.score_b,0),teams:teams.size,sweeps:matches.filter(m=>Math.min(m.score_a,m.score_b)===0).length,ranking};
}
if(typeof module!=='undefined') module.exports={validate,analyze};
if(typeof window!=='undefined') window.Analytics={validate,analyze};

