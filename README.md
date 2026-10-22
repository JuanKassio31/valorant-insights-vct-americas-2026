# Valorant Insights — VCT Americas Stage 2 2026

Projeto de portfólio de Juan Kassio, desenvolvido com apoio de IA.

## Conteúdo
- **index.html**: dashboard completo, abre diretamente no navegador, sem instalação.
- **matches.csv**: base de 60 séries reais com URLs para auditar a fonte.
- **valorant-insights-codigo.zip**: código completo organizado em pastas, incluindo Python, SQL, testes, documentação, banco SQLite e relatórios.

[Baixar o código completo](./valorant-insights-codigo.zip)

O dashboard permite filtros por equipe e fase, visualização de vitórias/derrotas, aproveitamento e saldo de mapas.

## Executar o projeto completo
Extraia o ZIP. No diretório extraído:

```sh
npm start
npm test
python scripts/analyze.py
```

Node.js 18+ para o servidor. Python 3.10+ para o pipeline (sem dependências externas).
Pipeline Python executado com sucesso: 60 séries, 16 equipes, 150 mapas. Cinco testes JavaScript passaram.

## Fonte e limites
Resultados públicos do VLR.gg (evento 2977), consultados em 22/10/2026: 30 grupos, 18 play-ins, 12 playoffs.
O ranking analítico não representa classificação oficial. A base não contém estatísticas individuais, agentes ou placares de rounds.
Projeto independente, sem afiliação à Riot Games ou ao VLR.gg.
