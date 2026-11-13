# Valorant Insights — VCT Americas Stage 2 2026

Dashboard de portfólio de Juan Kassio, desenvolvido com apoio de IA.

**[Abrir dashboard](https://juankassio31.github.io/valorant-insights-vct-americas-2026/)**

## Recursos
- 82 jogadores: rating, ACS, K/D, KAST, ADR, HS%, abates, mapas e agentes principais.
- Busca por nome, filtro por equipe e amostra mínima; ordenação por métrica.
- Comparação entre dois jogadores com indicação do tamanho das amostras.
- Exportação CSV do recorte de jogadores.
- 60 séries: filtros por fase/equipe, ranking analítico e resultados auditáveis.
- Layout responsivo, navegação por teclado e estados sem resultados.

## Executar
Abra `index.html` ou execute `python -m http.server 8000` e acesse http://localhost:8000.
Sem instalação, dependências de frontend, API externa em tempo de execução ou build. Compatível com GitHub Pages.

## Estrutura
- `index.html`: estrutura acessível da página.
- `assets/styles.css`: layout e estilos responsivos.
- `assets/players.js`: filtros, comparação e exportação.
- `assets/analytics.js`: cálculos de equipes.
- `assets/tournament.js`: séries existentes e sua interface.
- `data/players.json`, `data/players.js`, `data/players.csv`: snapshot auditável; JS permite abrir o site diretamente pelo arquivo.
- `scripts/import_players.py`: importação validada do HTML da fonte com Python padrão.
- `tests/logic.cjs`: testes de lógica sem dependências (`node tests/logic.cjs`).
- `tests/smoke.cjs`: testes de integração com Playwright (dependência apenas de desenvolvimento).
- `valorant-insights-codigo.zip`: arquivo histórico da primeira versão; o código atual está neste repositório.

## Fonte e limites
Jogadores: https://www.vlr.gg/event/stats/2977, consulta em **13/11/2026**. Snapshot do torneio completo, todos os mapas e lados; não é atualização ao vivo. As equipes são as do evento, não necessariamente os elencos atuais. Até três agentes principais são exibidos conforme a tabela da fonte. Métricas preservam o arredondamento publicado pelo VLR.

Séries: base anterior de 60 confrontos, consultada em 22/10/2026: 30 grupos, 18 play-ins, 12 playoffs. Mantida nesta atualização.

Os filtros de jogadores e de séries são independentes: os agregados individuais não contêm detalhamento por fase. Rating usa a metodologia do VLR, não uma fórmula própria. Amostras, papéis e adversários distintos limitam comparações; o padrão exclui jogadores com menos de 10 mapas. Rankings descritivos não são classificação oficial.

Para atualizar jogadores, salve o HTML da página de estatísticas e rode:
```sh
python scripts/import_players.py /caminho/stats.html
```
Revise a quantidade e os dados antes de publicar; respeite os termos e limites da fonte.

Projeto independente, sem afiliação à Riot Games ou ao VLR.gg.
