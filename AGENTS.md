# Briefing para IA

Evolua este projeto como analisador determinístico e somente de leitura de SPED Fiscal.

## Escopo inicial

1. Parseie os registros necessários com número de linha.
2. Compare por chave de acesso, não apenas por número.
3. Informe divergências com regra, severidade, valores e evidência.
4. Mantenha dados de origem separados de conclusões.

## Limites

- Não altere, transmita ou retifique SPED automaticamente.
- Não use arquivos fiscais reais como fixture ou log.
- Não marque uma divergência como erro fiscal definitivo sem revisão humana.
- Preserve encoding Latin-1/Windows-1252 quando necessário e teste arquivos grandes.
