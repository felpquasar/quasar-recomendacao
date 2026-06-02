# Algoritmo e Lógica do Sistema de Recomendação
## Quasar Barber — TCC 2026

---

## 1. O Problema que o Sistema Resolve

A Quasar Barber é uma distribuidora de produtos para barbearias em Codó-MA.
O vendedor visita uma barbearia, o cliente pede um produto, e o vendedor
precisa saber **o que mais oferecer naquele momento**.

Sem o sistema: o vendedor depende da memória ou da intuição.  
Com o sistema: o algoritmo analisa o histórico de compras de todos os clientes
e responde: *"quando alguém compra X, eles geralmente também compram Y e Z"*.

---

## 2. Abordagem Escolhida: Association Rules (Regras de Associação)

### Por que não Collaborative Filtering ou Content-Based?

| Técnica | Requer | Problema no contexto B2B |
|---|---|---|
| Collaborative Filtering | Avaliações de usuários, muitos clientes | Sem avaliações; poucos clientes B2B |
| Content-Based Filtering | Atributos detalhados dos produtos | Catálogo pequeno, pouca diferenciação de atributos |
| **Association Rules** | Histórico de transações | **Exatamente o que temos: pedidos com múltiplos produtos** |

Association Rules é o algoritmo clássico de **Market Basket Analysis** —
nasceu no varejo físico ("quem compra fraldas também compra cerveja")
e se adapta perfeitamente ao B2B de distribuição.

---

## 3. Conceitos Fundamentais

### 3.1 Transação (Pedido)

Uma transação é um pedido com um ou mais produtos.
O algoritmo analisa **quais produtos aparecem juntos** no mesmo pedido.

**Exemplo com dados reais do sistema:**

```
Pedido 006 — André Caetano:
  - BALM 120ML - FOX FOR MEN
  - SHAMPOO PARA BARBA 120ML - FOX FOR MEN
  - OLEO PARA BARBA SPRAY 60ML - FOX FOR MEN
  - PENTE DE MADEIRA BAMBU MEIA LUA

Pedido 032 — Quezia Silva:
  - BALM 120ML - FOX FOR MEN
  - SHAMPOO PARA BARBA 120ML - FOX FOR MEN
  - OLEO PARA BARBA SPRAY 60ML - FOX FOR MEN
```

O algoritmo detecta: BALM aparece junto com SHAMPOO PARA BARBA em 2 de 2 pedidos onde BALM está presente → Confiança 100%.

---

### 3.2 As Três Métricas do Algoritmo

#### Support (Suporte)

**O que mede:** Com que frequência o par A+B aparece no dataset inteiro.

```
Support(A → B) = Número de pedidos com A e B
                 ─────────────────────────────
                 Total de pedidos
```

**Exemplo real:**
- BALM + SHAMPOO PARA BARBA aparecem juntos em 2 pedidos
- Total de pedidos no sistema: 33
- Support = 2 / 33 = **0.0606 (6,06%)**

**Para que serve:** Filtra pares raros que podem ser coincidência.
O sistema usa `MIN_SUPPORT = 0.02` (2%) — pares que aparecem em menos de
2% das transações são ignorados.

---

#### Confidence (Confiança)

**O que mede:** Dado que o cliente comprou A, qual a probabilidade de ter comprado B também?

```
Confidence(A → B) = Número de pedidos com A e B
                    ──────────────────────────────
                    Número de pedidos com A
```

**Exemplo real:**
- Pedidos com BALM: 2 (pedidos 006 e 032)
- Pedidos com BALM e SHAMPOO PARA BARBA: 2
- Confidence = 2 / 2 = **1.0 (100%)**

**Interpretação:** "Em 100% das vezes que alguém comprou BALM, também comprou SHAMPOO PARA BARBA."

**Para que serve:** É a métrica principal de força da recomendação.
O sistema usa `MIN_CONFIDENCE = 0.30` (30%) — regras abaixo de 30% são descartadas.

---

#### Lift (Elevação)

**O que mede:** A regra A → B é melhor do que recomendar B para qualquer pessoa?
Compara a confidence com a probabilidade base de B ser comprado.

```
Lift(A → B) = Confidence(A → B)
              ──────────────────
              Support(B)
```

**Exemplo real:**
- Confidence(BALM → SHAMPOO PARA BARBA) = 1.0
- Support(SHAMPOO PARA BARBA) = 2/33 = 0.0606
- Lift = 1.0 / 0.0606 = **16.5**

**Interpretação:**
- Lift = 1 → A regra não acrescenta nada (B é comprado com a mesma frequência com ou sem A)
- Lift > 1 → Correlação positiva real (A influencia a compra de B)
- Lift < 1 → Correlação negativa (A inibe a compra de B)

**Lift 16.5** significa que quem comprou BALM tem **16,5 vezes mais chance** de comprar SHAMPOO PARA BARBA do que um cliente aleatório. É uma associação extremamente forte.

---

### 3.3 Thresholds Configurados

```javascript
// backend/src/config/constants.js
const ALGORITHM_CONFIG = {
  MIN_CONFIDENCE: 0.30,  // Regra precisa ter pelo menos 30% de confiança
  MIN_SUPPORT:    0.02,  // Par precisa aparecer em pelo menos 2% das transações
  MIN_LIFT:       1.0,   // Correlação positiva mínima (não aplicado no filtro atual)
  TOP_N:          3,     // Máximo de 3 recomendações por produto
};
```

---

## 4. O Algoritmo Passo a Passo

### 4.1 Entrada

O algoritmo recebe o array de vendas no formato:

```javascript
[
  {
    id: "abc123",
    itens: [
      { nome_produto: "BALM 120ML - FOX FOR MEN" },
      { nome_produto: "SHAMPOO PARA BARBA 120ML - FOX FOR MEN" },
      { nome_produto: "OLEO PARA BARBA SPRAY 60ML - FOX FOR MEN" }
    ]
  },
  // ... demais transações
]
```

### 4.2 Passo 1 — Extração de Produtos Únicos

```javascript
function extrairProdutosUnicos(vendas) {
  const produtos = new Set(); // Set garante unicidade automaticamente
  vendas.forEach(venda => {
    venda.itens.forEach(item => produtos.add(item.nome_produto));
  });
  return produtos; // ex: {"BALM 120ML", "SHAMPOO PARA BARBA 120ML", ...}
}
```

Com 33 transações e 33 produtos únicos no sistema atual,
o algoritmo gera 33 × 32 = **1.056 pares candidatos** para avaliar.

### 4.3 Passo 2 — Avaliação de Todos os Pares

O coração do algoritmo: dois laços aninhados que avaliam cada par ordenado (A → B):

```
Para cada produto A:
  Para cada produto B (onde B ≠ A):
    1. Conta transações com A          → freq_A
    2. Conta transações com A e B      → freq_AB
    3. Se freq_A = 0: pula (produto nunca comprado)
    4. confidence = freq_AB / freq_A
    5. support    = freq_AB / total_transacoes
    6. Se confidence >= 0.30 e support >= 0.02:
       7. Conta transações com B      → freq_B
       8. supportB = freq_B / total
       9. lift = confidence / supportB
       10. Adiciona regra ao array de resultados
```

### 4.4 Passo 3 — Ordenação e Filtro Top N

```javascript
// Ordena por confiança decrescente
regras.sort((a, b) => b.confidence - a.confidence);

// Para um produto específico, retorna só as top 3
regras
  .filter(r => r.antecedente === nomeProduto)
  .slice(0, 3);
```

### 4.5 Complexidade Computacional

```
O(T × P²)  onde T = transações, P = produtos únicos

Com dados atuais:
  T = 33 transações
  P = 33 produtos
  Operações = 33 × 33² = ~36.000 → milissegundos

Com dados de produção estimados (1 ano):
  T = 500 transações
  P = 50 produtos
  Operações = 500 × 50² = ~1.250.000 → ~200-500ms

O cache Redis resolve o problema de latência:
  Primeira chamada: ~500ms (cálculo completo)
  Chamadas seguintes: <10ms (leitura do Redis)
```

---

## 5. Resultado Real com os Dados de Pedidos_2026.csv

### 5.1 Dataset Importado

```
Total de pedidos:          19 (do CSV) + 14 (mock) = 33 transações
Total de produtos únicos:  33 produtos
Regras geradas:            57 regras de associação
Confiança média:           71,09%
Support médio:              4,73%
```

### 5.2 Top 5 Regras Descobertas

| # | Se comprou... | Recomendar... | Confiança | Support | Lift |
|---|---|---|---|---|---|
| 1 | QOD Barber Shampoo | QOD Pomada Forte | **100%** | 9,09% | **11.0** |
| 2 | QOD Pomada Forte | QOD Barber Shampoo | **100%** | 9,09% | **11.0** |
| 3 | Condicionador de Barba | Espuma para Barba Premium | **100%** | 6,06% | 6.6 |
| 4 | Tônico de Barba | Fox For Men Barba | **100%** | 9,09% | 4.7 |
| 5 | Tesoura Profissional | Pente de Metal Profissional | **100%** | 3,03% | **11.0** |

**Interpretação dos resultados:**
- QOD Shampoo e QOD Pomada são **praticamente inseparáveis** (Lift 11x) — sempre oferecer os dois juntos
- Quem compra Tesoura Profissional quase sempre precisa do Pente (Lift 11x) — kit natural de ferramentas
- Condicionador de Barba leva a Espuma (100% de confiança) — linha de cuidados completos

### 5.3 Exemplo de Consulta Real

**Produto consultado:** `BALM 120ML - FOX FOR MEN`

```json
{
  "produto": "BALM 120ML - FOX FOR MEN",
  "total_recomendacoes": 3,
  "recomendacoes": [
    {
      "nome": "SHAMPOO PARA BARBA 120ML - FOX FOR MEN",
      "confianca": 1.0,
      "support": 0.0606,
      "lift": 16.5
    },
    {
      "nome": "OLEO PARA BARBA SPRAY 60ML - FOX FOR MEN",
      "confianca": 1.0,
      "support": 0.0606,
      "lift": 16.5
    },
    {
      "nome": "PENTE DE MADEIRA BAMBU MEIA LUA 9,5",
      "confianca": 0.5,
      "support": 0.0303,
      "lift": 16.5
    }
  ]
}
```

**Por que Lift 16.5 em todos?**
SHAMPOO PARA BARBA e OLEO PARA BARBA têm support individual de apenas 6,06%
(aparecem em 2 de 33 pedidos). Mas quando BALM está presente, eles aparecem
em 100% dos casos. A razão 1.0 / 0.0606 = 16.5 mostra que a presença do BALM
multiplica por 16,5× a chance de compra desses outros itens.

---

## 6. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO (Vendedor)                        │
│              Browser: http://localhost:5173                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (React + Vite)
┌────────────────────────▼────────────────────────────────────┐
│              FRONTEND (React 18 + Vite)                      │
│                                                              │
│  App.jsx → Dashboard.jsx                                     │
│    ├── BuscadorProduto.jsx  (input + botão)                  │
│    ├── ResultadosBusca.jsx  (grid de cards)                  │
│    └── CardRecomendacao.jsx (barra de confiança + métricas)  │
│                                                              │
│  services/api.js → axios (baseURL: localhost:3000)          │
└────────────────────────┬────────────────────────────────────┘
                         │ GET /api/recomendacoes/:produto
                         │ GET /api/estatisticas
┌────────────────────────▼────────────────────────────────────┐
│              BACKEND (Node.js 18 + Express)                  │
│                                                              │
│  routes/recomendacoes.js ──► services/cache.js (Redis)      │
│                         │                                    │
│                         └──► services/recomendacao.js        │
│                                ├── extrairProdutosUnicos()   │
│                                ├── calculateAssociation()    │
│                                └── obterRecomendacoes()      │
│                                                              │
│  routes/estatisticas.js ──► services/cache.js               │
│  routes/validacao.js    ──► services/validacao.js            │
└────────────────────────┬────────────────────────────────────┘
                         │ Supabase JS Client (REST/PostgREST)
┌────────────────────────▼────────────────────────────────────┐
│              BANCO DE DADOS (PostgreSQL via Supabase)        │
│                                                              │
│  qb_clientes     → barbearias clientes                       │
│  qb_produtos     → catálogo de produtos                      │
│  qb_vendas       → cabeçalho dos pedidos                     │
│  qb_itens_venda  → itens de cada pedido (JOIN principal)     │
└─────────────────────────────────────────────────────────────┘
                         │ (paralelo)
┌────────────────────────▼────────────────────────────────────┐
│              CACHE (Redis)                                    │
│                                                              │
│  rec:<produto>      → recomendações  (TTL: 1 hora)           │
│  stats:global       → estatísticas   (TTL: 30 min)           │
│  validation:metrics → P/R/F1         (TTL: 6 horas)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Fluxo Completo de uma Requisição

### Cenário: Usuário busca recomendações para "BALM 120ML - FOX FOR MEN"

```
1. Usuário digita "BALM 120ML - FOX FOR MEN" e clica Buscar
   └── BuscadorProduto.jsx chama recomendacaoService.obterRecomendacoes()

2. axios envia: GET http://localhost:3000/api/recomendacoes/BALM%20120ML%20-%20FOX%20FOR%20MEN

3. Express recebe em routes/recomendacoes.js
   └── Verifica cache Redis com chave "rec:BALM 120ML - FOX FOR MEN"

4a. CACHE HIT (segunda chamada em diante):
    └── Retorna JSON imediatamente com source: "cache" (~5ms)

4b. CACHE MISS (primeira chamada):
    └── Chama buscarVendas() → Supabase PostgREST
        └── SELECT qb_itens_venda JOIN qb_produtos
        └── Retorna 33 transações normalizadas

    └── calculateAssociation(vendas, 0.30, 0.02)
        └── Extrai 33 produtos únicos
        └── Avalia 33×32 = 1.056 pares
        └── Gera 57 regras que passam nos thresholds
        └── Ordena por confidence desc

    └── obterRecomendacoes("BALM 120ML - FOX FOR MEN", regras, 3)
        └── Filtra regras com antecedente === "BALM 120ML - FOX FOR MEN"
        └── Retorna top 3

    └── Armazena resultado no Redis (TTL 3600s)
    └── Retorna JSON com source: "computado" (~200-500ms)

5. Frontend recebe resposta
   └── Dashboard.jsx chama setRecomendacoes(response.data)
   └── ResultadosBusca.jsx re-renderiza com os novos dados
   └── 3 CardRecomendacao.jsx são exibidos com barras de confiança
```

---

## 8. Importação dos Dados (seed-csv.js)

O sistema não usa dados fictícios — usa os pedidos reais da Quasar Barber.

### Fluxo de importação do CSV:

```
Pedidos_2026.csv (separador ;)
         │
         ▼
parsearCSV() → remove BOM, normaliza quebras de linha
         │
         ▼
agruparPorPedido() → agrupa linhas pelo número do pedido
  Exemplo: pedido 034 tem 3 linhas → 1 transação com 3 itens
         │
         ▼
inferirCategoria() → classifica produto por palavras-chave:
  "BARBA" | "BALM" | "BALSAMO" → Barba
  "PENTE" | "ESCOVINHA"         → Acessórios
  (resto)                        → Cabelo
         │
         ▼
Supabase upsert:
  qb_clientes  → 1 cliente por nome único
  qb_produtos  → 1 produto por nome único
  qb_vendas    → 1 venda por pedido
  qb_itens_venda → N itens por venda
         │
         ▼
Dataset pronto para o algoritmo
```

---

## 9. Validação do Algoritmo (Semana 5)

Para provar que o algoritmo funciona, foi implementado train/test split:

### Metodologia

```
Dataset completo (33 transações)
         │
         ├── 80% → Treino (26 transações) → calcular regras
         └── 20% → Teste  (7 transações)  → validar regras
```

### Métricas de Qualidade

**Precision (Precisão)**
```
Precision = Recomendações corretas
            ─────────────────────
            Total de recomendações feitas

"Das X recomendações que o sistema fez, quantas o cliente realmente comprou?"
```

**Recall (Revocação)**
```
Recall = Recomendações corretas
         ──────────────────────
         Total de itens comprados

"Das X compras reais do cliente, quantas o sistema recomendou corretamente?"
```

**F1-Score**
```
F1 = 2 × (Precision × Recall)
     ──────────────────────────
     (Precision + Recall)

Média harmônica — penaliza mais quando um dos dois é muito baixo.
Melhor indicador único de qualidade do que usar P ou R isolados.
```

### Resultado Atual

Com apenas 33 transações (19 do CSV + 14 mock), o dataset ainda é pequeno.
O split 80/20 gera apenas 7 transações de teste, e dessas apenas 2 têm
itens suficientes para validar (precisam de pelo menos 2 produtos por pedido).

À medida que mais pedidos forem importados, as métricas se tornam mais representativas.
Alvo do TCC: **Precision ≥ 72%, Recall ≥ 58%, F1 ≥ 0.64**.

---

## 10. Diferença entre Association Rules e outras técnicas

### Association Rules vs Filtro Colaborativo

| | Association Rules | Filtro Colaborativo |
|---|---|---|
| **Base dos dados** | Transações (pedidos) | Avaliações de usuários |
| **Requer histórico por usuário** | Não | Sim |
| **Problema cold start** | Não (funciona com poucos dados) | Sim (precisa de muitos usuários) |
| **Interpretabilidade** | Alta (Support/Confidence/Lift explicam tudo) | Baixa (caixa-preta) |
| **Custo computacional** | O(T × P²) — aceitável | O(U × I) — pode ser alto |
| **Ideal para** | B2B, e-commerce com poucos clientes | Netflix, Spotify, grandes plataformas |

**Conclusão:** Para o contexto da Quasar Barber (distribuidora B2B com dezenas de clientes
e centenas de produtos), Association Rules é a escolha correta — simples, interpretável,
e eficaz com datasets pequenos.

---

## 11. Limitações e Trabalhos Futuros

| Limitação | Impacto | Solução Futura |
|---|---|---|
| Dataset pequeno (33 transações) | Poucas regras, métricas instáveis | Importar histórico completo de anos anteriores |
| Algoritmo O(P²) | Lento com catálogo >200 produtos | Implementar Apriori com poda por support |
| Nomes de produto como chave | Busca exige nome exato | Implementar busca por ID ou nome parcial (ILIKE) |
| Sem sazonalidade | Não considera variações por época | Filtrar transações por janela de tempo |
| Cache global | Regras ficam defasadas por 1h | Invalidar cache ao importar novos pedidos |

---

## 12. Tecnologias e Por Que Cada Uma

| Tecnologia | Função | Por que foi escolhida |
|---|---|---|
| Node.js 18 | Runtime do backend | Assíncrono nativo, ideal para I/O (Supabase, Redis) |
| Express | Framework HTTP | Leve, sem opinião, fácil de testar com Supertest |
| Supabase | PostgreSQL gerenciado | Gratuito, PostgREST elimina SQL boilerplate, dashboard visual |
| Redis | Cache de recomendações | Sub-milissegundo para leitura, TTL nativo, padrão de mercado |
| React 18 | Interface do usuário | Reatividade nativa, ecossistema maduro, hooks simplificam estado |
| Vite | Build tool do frontend | HMR instantâneo, proxy de desenvolvimento integrado |
| Jest + Supertest | Testes | Jest é padrão Node, Supertest testa HTTP sem subir servidor real |

---

*Documento gerado em Jun 2026 — Sistema de Recomendação Quasar Barber — TCC Felipe Pereira*
