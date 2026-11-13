// Dependency-free rendering/interaction checks; does not validate browser layout.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),els={};
for(const [,id] of html.matchAll(/id="([^"]+)"/g))els[id]={value:'',innerHTML:'',textContent:'',hidden:true,events:{},options:[],add(o){this.options.push(o)},append(o){this.options.push(o)},addEventListener(e,f){this.events[e]=f}};
els['min-maps'].value='10';els['player-sort'].value='rating';
const context={console,Option:function(text,value){return {text,value}},document:{getElementById:id=>els[id],createElement:()=>({}),querySelectorAll:()=>[]},setTimeout,Blob,URL};context.window=context;
vm.createContext(context);
for(const file of ['assets/analytics.js','assets/tournament.js','data/players.js','assets/players.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
function change(id,value,event='change'){els[id].value=value;els[id].events[event]();}
assert.equal(els.error.hidden,true);assert.equal(els.series.textContent,60);
change('min-maps','1');assert.equal((els['players-body'].innerHTML.match(/<tr>/g)||[]).length,82);
change('player-search','aspas','input');assert.equal((els['players-body'].innerHTML.match(/<tr>/g)||[]).length,1);assert.match(els['players-body'].innerHTML,/aspas/);
change('player-team','100T');assert.match(els['players-body'].innerHTML,/Nenhum jogador/);
els['reset-players'].events.click();change('player-sort','acs');assert.match(els['players-body'].innerHTML.split('</tr>')[0],/OXY/);
change('compare-b',els['compare-a'].value);assert.match(els.comparison.innerHTML,/mesmo jogador/);
change('team','LOUD');assert.ok(els.series.textContent<60);els.reset.events.click();assert.equal(els.series.textContent,60);
console.log('PASS: 82 players, search, team and minimum-map filters, empty state, metric sorting, comparison, preserved series analytics.');
