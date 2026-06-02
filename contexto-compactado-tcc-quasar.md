# Contexto Compactado — TCC Quasar Barber: Sistema de Recomendação B2B

**Data da compactação:** 02 de Junho de 2026
**Chat original:** ~20 trocas de mensagens (Semanas 5 e 6 + dados reais + docs)

---

## 1. Objetivo

Desenvolver um sistema de recomendação de produtos B2B para a Quasar Barber (distribuidora em Codó-MA) usando Association Rules (Market Basket Analysis). Stack: Node.js + Express + Supabase + Redis no backend, React 18 + Vite no frontend. TCC de Ciência da Computação — prazo 17 Ago 2026.

---

## 2. Decisões Tomadas

- **Association Rules em vez de Collaborative Filtering:** B2B com poucos clientes, sem avaliações — Association Rules funciona com só transações.
- **Supabase JS em vez de Knex:** Free tier não expõe DATABASE_URL direto — usar @supabase/supabase-js via PostgREST com anon key.
- **Tabelas com prefixo `qb_`:** Supabase compartilhado com outro projeto que já tinha tabela `vendas`.
- **bigint GENERATED ALWAYS AS IDENTITY:** UUID causava erro de tipo nas FKs.
- **RLS desabilitado:** Tabelas qb_* com RLS ativo retornavam [] silenciosamente — desabilitar via SQL Editor do Supabase.
- **Cache graceful:** Redis opcional — sem Redis, sistema funciona normalmente (get → null, set → void).
- **seed-csv.js sem upsert/onConflict:** qb_clientes não tem UNIQUE em nome_loja — script busca existentes primeiro, insere apenas novos.
- **Lifting state up no frontend:** Dashboard (pai) controla estado, BuscadorProduto faz fetch, ResultadosBusca consome via props.

---

## 3. Estado Atual

**SEMANAS 1–6 CONCLUÍDAS.** Sistema rodando localmente, dados reais importados.

| Componente | Status | Detalhe |
|---|---|---|
| Backend API | ✅ Funcional | 4 endpoints, 33 transações, 57 regras geradas |
| Frontend Dashboard | ✅ Funcional | KPI cards + busca + cards de recomendação |
| Banco Supabase | ✅ Populado | Dados reais do Pedidos_2026.csv + mock |
| Cache Redis | ✅ Graceful | Funciona sem Redis (sem crash) |
| Testes unitários | ✅ Passando | 16+ testes (recomendacao + cache + validacao) |
| Validação P/R/F1 | ✅ Implementado | Train/test 80/20 — métricas baixas por dataset pequeno |
| PDF / Documentação | ✅ Atualizado | resumo-tcc-quasar.pdf + docs/ALGORITMO-E-LOGICA.md |

**Métricas reais do sistema (Supabase):**
- 33 transações, 33 produtos únicos, 57 regras
- Confiança média: 71,09% | Support médio: 4,73%
- Top regra: QOD Shampoo → QOD Pomada (100% confiança, Lift 11.0)
- Melhor Lift: BALM → SHAMPOO PARA BARBA (Lift 16.5, 100% confiança)

**Git:** branch `master`, commit mais recente `9ba2cdd`. 10 commits à frente do origin (push pendente).

---

## 4. Arquivos e Artefatos Relevantes

| Arquivo | Status | Descrição |
|---|---|---|
| `backend/.env` | ✅ | Credenciais reais (não commitado) |
| `backend/server.js` | ✅ | Entry point — separa inicialização do app para testes |
| `backend/src/app.js` | ✅ | Express + CORS + 4 rotas registradas |
| `backend/src/config/constants.js` | ✅ | MIN_CONFIDENCE=0.30, MIN_SUPPORT=0.02, TOP_N=3 |
| `backend/src/database/connection.js` | ✅ | Cliente Supabase JS (anon key via PostgREST) |
| `backend/src/database/schema.sql` | ✅ | 5 tabelas qb_* com bigint identity e índices |
| `backend/src/database/seed.js` | ✅ | Seed com 14 transações mock |
| `backend/src/database/seed-csv.js` | ✅ NOVO | Importa CSV real — parseia ;, agrupa por pedido, infere categoria |
| `backend/src/models/index.js` | ✅ | buscarVendas() join PostgREST, buscarProdutos(), buscarProduto() |
| `backend/src/services/recomendacao.js` | ✅ | Association Rules — extrairProdutosUnicos(), calculateAssociation(), obterRecomendacoes() |
| `backend/src/services/cache.js` | ✅ | Redis graceful — get/set/delete/flush |
| `backend/src/services/validacao.js` | ✅ NOVO | Precision, Recall, F1, validarComSplit() 80/20 |
| `backend/src/routes/recomendacoes.js` | ✅ | GET /api/recomendacoes/:id — cache 1h |
| `backend/src/routes/estatisticas.js` | ✅ | GET /api/estatisticas — Promise.all, cache 30min |
| `backend/src/routes/validacao.js` | ✅ NOVO | GET /api/validacao — cache 6h |
| `backend/tests/unit/recomendacao.test.js` | ✅ | 10 testes algoritmo |
| `backend/tests/unit/cache.test.js` | ✅ | 6 testes Redis graceful |
| `backend/tests/unit/validacao.test.js` | ✅ NOVO | 8 testes P/R/F1 e split |
| `frontend/src/App.jsx` | ✅ | BrowserRouter + rota / → Dashboard |
| `frontend/src/pages/Dashboard.jsx` | ✅ NOVO | KPIs + busca + resultados (useEffect para stats) |
| `frontend/src/components/BuscadorProduto.jsx` | ✅ NOVO | Input + botão + loading/erro state |
| `frontend/src/components/CardRecomendacao.jsx` | ✅ NOVO | Barra confiança animada + support + lift |
| `frontend/src/components/ResultadosBusca.jsx` | ✅ NOVO | 3 estados: null / vazio / grid de cards |
| `frontend/src/services/api.js` | ✅ | Axios centralizado — obterRecomendacoes() + obterEstatisticas() |
| `frontend/src/styles/index.css` | ✅ | Tema preto #1a1a1a + dourado #d4af37, responsivo mobile |
| `frontend/vite.config.js` | ✅ | Proxy /api → localhost:3000 |
| `docs/ALGORITMO-E-LOGICA.md` | ✅ NOVO | Documento técnico completo (algoritmo, arquitetura, exemplos reais) |
| `scripts/resumo-tcc.html` | ✅ | HTML fonte do PDF — atualizado com Semanas 5-6 |
| `resumo-tcc-quasar.pdf` | ✅ | PDF gerado via puppeteer-core + Chrome local |
| `ROTEIRO-SEMANAS-1-4.md` | ⚠️ | Modificado localmente, não commitado (não crítico) |

---

## 5. Código e Configurações Críticas

### .env do backend
```
SUPABASE_URL=https://ylbajgyajkbacsqaphyn.supabase.co
SUPABASE_ANON_KEY=[VER backend/.env — não commitar]
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

### Como rodar o sistema
```powershell
# Terminal 1 — Backend (porta 3000)
cd C:\Users\Quasar\Desktop\quasar-recomendacao\backend
npm run dev

# Terminal 2 — Frontend (porta 5173)
cd C:\Users\Quasar\Desktop\quasar-recomendacao\frontend
npm run dev

# Browser: http://localhost:5173
```

### Importar novo CSV de vendas
```powershell
cd C:\Users\Quasar\Desktop\quasar-recomendacao\backend
npm run seed:csv -- "C:/Users/Quasar/Downloads/Pedidos_2026 (2).csv"
# Idempotente — busca existentes antes de inserir
```

### Regerar o PDF
```powershell
cd C:\Users\Quasar\Desktop\quasar-recomendacao
node scripts/gerar-pdf.js
# Lê scripts/resumo-tcc.html → gera resumo-tcc-quasar.pdf
```

### Inferência de categoria (seed-csv.js)
```javascript
// "BARBA" | "BALM" | "BALSAMO" | "AFTER SHAVE" | "BIGODE" → Barba
// "PENTE" | "ESCOVINHA" | "TESOURA" → Acessórios
// (demais) → Cabelo
```

### Endpoints disponíveis
```
GET /health                          → status + timestamp
GET /api/recomendacoes/:produtoId    → top 3 regras (cache 1h)
GET /api/estatisticas                → KPIs globais (cache 30min)
GET /api/validacao                   → Precision/Recall/F1 (cache 6h)
```

---

## 6. Erros e Armadilhas Conhecidas

- **upsert com onConflict falha em qb_clientes:** Sem UNIQUE em nome_loja — usar insert + busca prévia (já resolvido no seed-csv.js).
- **RLS bloqueia silenciosamente:** Novas tabelas Supabase com RLS ativo retornam [] sem erro. Fix: `ALTER TABLE qb_* DISABLE ROW LEVEL SECURITY`.
- **Produto duplicado no mesmo pedido (CSV):** Pedido 010 tinha mesmo produto duas vezes — seed usa Map que soma quantidade.
- **Busca exige nome exato:** Algoritmo usa nome como string key — "balm" não encontra "BALM 120ML". Semana 7 deve implementar ILIKE.
- **Redis não disponível no Windows:** Não é nativo. Sistema degrada gracefully. Alternativa: WSL2 ou Upstash (cloud gratuito).
- **PostgREST cache de schema:** Após criar tabelas novas, aguardar alguns minutos para PostgREST reconhecer colunas.
- **Métricas P/R/F1 baixas (não é bug):** Dataset tem 33 transações, só 2 com ≥2 itens para validar. Melhora com histórico completo.

---

## 7. Próximos Passos

- [ ] **Semana 7 — Gráficos Chart.js:** `npm install chart.js react-chartjs-2`; criar `GraficoRegras.jsx` com barras das top 10 regras; scatter lift vs support; distribuição por categoria.
- [ ] **Semana 7 — Busca parcial:** Endpoint `GET /api/produtos?q=balm` com ILIKE no Supabase + autocomplete no frontend.
- [ ] **Semana 7 — Dataset maior:** Importar histórico de anos anteriores para melhorar P/R/F1.
- [ ] **Semana 8 — Deploy:** Vercel (frontend) + Railway (backend) + Upstash Redis.
- [ ] **Semana 8 — Cobertura de testes:** Meta >80% via `npm run test:coverage`.
- [ ] **Semanas 9-11 — Texto TCC:** 55-60 páginas, 8 capítulos, ABNT, 5+ artigos.
- [ ] **Semana 12 — Apresentação:** 10-15 slides, ensaio, submissão à banca.
- [ ] **Git push:** 10 commits locais não enviados ao origin/master.

---

## 8. Informações Pendentes

- Histórico completo de vendas (anos anteriores) não importado — apenas Pedidos_2026.csv (19 pedidos).
- Upstash Redis não configurado — rodando sem cache persistente.
- Deploy Vercel + Railway não realizado.

---

> **Instrução para o próximo chat:** Este arquivo contém o contexto compactado do TCC de Felipe Pereira — Sistema de Recomendação Quasar Barber. Semanas 1–6 concluídas. Backend funcional (4 endpoints, dados reais no Supabase), Dashboard React implementado com KPIs e busca interativa. O próximo passo natural é a **Semana 7 (Gráficos Chart.js + busca parcial)**. Não peça ao usuário para repetir informações que já estão aqui. Confirme brevemente o contexto e pergunte por onde continuar.
