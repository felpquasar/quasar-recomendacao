# Validação do Algoritmo de Recomendação

## Metodologia

### Train/Test Split (80/20)

Os dados históricos de vendas são divididos em dois conjuntos:

- **80% — Treino:** usado para calcular as regras de associação (Association Rules)
- **20% — Teste:** usado para avaliar se as recomendações correspondem às compras reais

Para cada transação de teste:
1. O primeiro produto da transação é usado como entrada (antecedente)
2. O algoritmo gera recomendações com as regras aprendidas no treino
3. As recomendações são comparadas com os demais produtos da mesma transação (ground truth)

---

## Métricas

### Precision (Precisão)

- **Pergunta:** "Das recomendações feitas, quantas o cliente realmente comprou?"
- **Fórmula:** `Acertos / Total de Recomendações`
- **Referência boa:** >= 60%

### Recall (Revocação)

- **Pergunta:** "Das compras realizadas, quantas foram recomendadas?"
- **Fórmula:** `Acertos / Total de Compras Realizadas`
- **Referência boa:** >= 50%

### F1-Score

- **Definição:** Média harmônica entre Precision e Recall
- **Fórmula:** `2 × (P × R) / (P + R)`
- **Por que harmônica:** Penaliza sistemas com P ou R muito desbalanceado
- **Referência boa:** >= 0.60

---

## Resultados com Dados Mock (Semana 5)

```
Precision: calculado dinamicamente via /api/validacao
Recall:    calculado dinamicamente via /api/validacao
F1-Score:  calculado dinamicamente via /api/validacao
```

> Os valores reais dependem dos dados de vendas no Supabase.
> Com dados mock sintéticos (20 transações), os resultados refletem padrões artificiais.
> Os valores do TCC devem ser gerados após substituição pelos dados reais da Quasar Barber.

---

## Endpoint

```
GET /api/validacao
```

Resposta:
```json
{
  "timestamp": "2026-06-02T...",
  "precision": 0.6667,
  "recall": 0.5833,
  "f1_score": 0.6222,
  "total_transacoes_treino": 400,
  "total_transacoes_teste": 100,
  "transacoes_avaliadas": 87,
  "source": "computado"
}
```

Cache: 6 horas (TTL = 21600s)

---

## Script CLI

Para executar a validação localmente e salvar o relatório em JSON:

```bash
cd backend
node scripts/validar-algoritmo.js
```

Output salvo em: `backend/dados/metricas-validacao.json`

---

## Interpretação

| Métrica | Aceitável | Bom | Excelente |
|---------|-----------|-----|-----------|
| Precision | 40–60% | 60–80% | > 80% |
| Recall | 30–50% | 50–70% | > 70% |
| F1-Score | 0.35–0.55 | 0.55–0.75 | > 0.75 |

Em sistemas de recomendação B2B com datasets pequenos (<500 transações),
valores na faixa "Bom" são esperados e suficientes para demonstrar valor prático.

---

## Limitação dos Dados Mock

O dataset atual em `seed.sql` foi gerado artificialmente com padrões
intencionalmente correlacionados. Isso inflaciona artificialmente as métricas.

**Ação necessária:** Substituir pelos dados reais de vendas da Quasar Barber
(exportar relatório com itens por pedido) antes de reportar as métricas finais no TCC.
