"""Import an archived VLR event stats HTML, without third-party dependencies.
Usage: python scripts/import_players.py /path/to/stats.html
Fetch manually from https://www.vlr.gg/event/stats/2977 respecting source terms.
"""
import re, json, sys, html, csv
from pathlib import Path
from datetime import date
ROOT=Path(__file__).resolve().parents[1]
def clean(s): return html.unescape(re.sub('<[^>]+>', '', s)).strip()
def parse(source):
    players=[]
    for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>',source,re.S):
        name=re.search(r'class="st-pl-name[^"]*">(.*?)</div>',row,re.S)
        if not name: continue
        team=re.search(r'class="st-pl-country">(.*?)</div>',row,re.S)
        href=re.search(r'href="(/player/[^\"]+)"',row)
        p={'name':clean(name[1]),'team':clean(team[1]) if team else '—','url':'https://www.vlr.gg'+href[1]}
        p['agents']=list(dict.fromkeys(re.findall(r'/agents/([\w-]+)\.png',row)))
        for attrs,value in re.findall(r'<td\b([^>]*)>(.*?)</td>',row,re.S):
            col=re.search(r'data-col="([^"]+)"',attrs)
            if col and col[1] in ['maps','rnd','rating','acs','kd','kast','adr','kpr','apr','hsp','k','d','a','fk','fd']:
                p[col[1]]=float(clean(value).replace('%',''))
        required={'maps','rnd','rating','acs','kd','kast','adr','hsp','k','d','a'}
        if not required <= p.keys(): raise ValueError('Missing statistics for '+p['name'])
        if p['maps']<=0 or p['rnd']<=0 or not 0<=p['kast']<=100: raise ValueError('Invalid stats')
        players.append(p)
    if not players or len({p['url'] for p in players})!=len(players): raise ValueError('Empty or duplicate players')
    return players
if __name__=='__main__':
    players=parse(Path(sys.argv[1]).read_text())
    data={'event':'VCT Americas Stage 2 2026','source':'https://www.vlr.gg/event/stats/2977','retrieved_on':str(date.today()),'scope':'Todas as fases, mapas e lados; elenco do evento, não elenco atual.','players':players}
    (ROOT/'data/players.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'data/players.js').write_text('window.PLAYER_DATA = '+json.dumps(data,ensure_ascii=False)+';\n')
    with (ROOT/'data/players.csv').open('w',newline='') as f:
        cols=['name','team','maps','rnd','rating','acs','kd','kast','adr','hsp','k','d','a','url']
        w=csv.DictWriter(f,fieldnames=cols,extrasaction='ignore');w.writeheader();w.writerows(players)
    print(f'Imported {len(players)} players')
