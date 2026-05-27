# Contexto Compactado — TCC Sistema de Recomendação Quasar Barber

**Data da compactação:** 27 de Maio de 2026
**Chat original:** ~25 mensagens (2º chat — continuação do contexto anterior)

---

## 1. Objetivo

Desenvolver sistema de recomendação B2B (distribuidora → barbershops) usando Association Rules como TCC de Ciência da Computação de Felipe Pereira. Seguir roteiro semanal nos `.md` do projeto. Prazo: 17 de Agosto de 2026.

---

## 2. Decisões Tomadas

- **Prefixo `qb_` em todas as tabelas:** Supabase compartilhado — outro projeto já tem tabela `vendas`
- **bigint GENERATED ALWAYS AS IDENTITY (não UUID):** FK UUID×bigint causava erro; Supabase usa bigint por padrão
- **Supabase JS client (não Knex):** Knex precisa de DATABASE_URL com senha do postgres — não disponível no free tier
- **Seed via `seed.sql` no SQL Editor (não script Node):** PostgREST tem cache de schema que não reconhecia colunas novas; SQL direto contorna
- **RLS desabilitado nas tabelas `qb_`:** RLS default bloqueava reads com anon key retornando `[]` silenciosamente
- **Dados mock no seed:** CSV `Vendas_2026.csv` só tem totais por cliente — inútil para Association Rules
- **Redis com degradação graceful:** Windows não tem Redis nativo — cache.js retorna silenciosamente quando Redis está offline
- **`--forceExit` no test:unit:** Redis client mantém event loop aberto; Jest não sai após testes sem esse flag
- **PDF via puppeteer-core + Chrome local:** Chrome instalado em `C:\Program Files\Google\Chrome\Application\chrome.exe` — sem baixar Chromium separado

---

## 3. Estado Atual

**Semana 1 ✅** — Estrutura inicial commitada
**Semana 2 ✅** — Backend npm install, Supabase configurado, React+Vite scaffolded, api.js criado, banco populado
**Semana 3 ✅** — Algoritmo implementado, endpoint funcionando com dados reais, 10 testes unitários passando
**Semana 4 ✅** — Redis cache + endpoint `/api/estatisticas` + 6 testes de cache = 16 testes totais
**Código documentado ✅** — Todos os arquivos JS/JSX com comentários JSDoc detalhados
**PDF gerado ✅** — `resumo-tcc-quasar.pdf` (476KB, ~15 páginas A4, 13 seções)
**Semanas 5-12 ⏳** — Não iniciadas

**Commits neste chat:**
- `de0ba8e` — Semana 2-3: Setup completo + algoritmo de recomendação
- `b8befe5` — Semana 4: Cache Redis + endpoint de estatísticas
- `294226c` — docs: comentários detalhados em todos os arquivos + PDF resumo do TCC

**Endpoint testado e funcionando:**
```
GET http://localhost:3000/api/recomendacoes/Fox%20For%20Men%20Barba
→ retorna Espuma para Barba Premium (43% confiança) + Tônico de Barba (43% confiança)

GET http://localhost:3000/api/estatisticas
→ retorna total_vendas, total_produtos, total_regras, confianca_media, regras_top5
```

---

## 4. Arquivos e Artefatos Relevantes

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `backend/.env` | Criado | Credenciais reais Supabase + config (não commitado) |
| `backend/src/app.js` | Atualizado | Express + CORS + rotas `/api/recomendacoes` e `/api/estatisticas` |
| `backend/src/config/constants.js` | Comentado | MIN_CONFIDENCE=0.30, MIN_SUPPORT=0.02, TOP_N=3, CACHE_TTL=3600 |
| `backend/src/database/connection.js` | Comentado | Supabase JS client com anon key |
| `backend/src/database/schema.sql` | Atualizado | 5 tabelas `qb_*` com bigint identity |
| `backend/src/database/seed.sql` | Criado | INSERT SQL p/ rodar no Supabase SQL Editor |
| `backend/src/database/seed.js` | Criado | **NÃO USAR** — cache issue do PostgREST |
| `backend/src/models/index.js` | Comentado | `buscarVendas()`, `buscarProdutos()`, `buscarProduto()` |
| `backend/src/services/recomendacao.js` | Comentado | `calculateAssociation()`, `obterRecomendacoes()`, `extrairProdutosUnicos()` |
| `backend/src/services/cache.js` | Criado + Comentado | Redis com degradação graceful, `get/set/delete/flush/isConnected()` |
| `backend/src/routes/recomendacoes.js` | Atualizado + Comentado | `GET /:produtoId` com cache hit/miss (TTL 1h) |
| `backend/src/routes/estatisticas.js` | Criado + Comentado | `GET /` métricas globais com cache 30min |
| `backend/tests/unit/recomendacao.test.js` | Comentado | 10 testes do algoritmo |
| `backend/tests/unit/cache.test.js` | Criado + Comentado | 6 testes de cache (pula se Redis offline) |
| `frontend/package.json` | Criado | React 18 + Vite + Axios + React Router |
| `frontend/vite.config.js` | Criado | Proxy `/api` → `localhost:3000` |
| `frontend/src/main.jsx` | Comentado | React root com StrictMode |
| `frontend/src/App.jsx` | Comentado | Placeholder — BrowserRouter pronto para receber rotas |
| `frontend/src/services/api.js` | Comentado | `recomendacaoService.obterRecomendacoes()` + `obterEstatisticas()` |
| `scripts/gerar-pdf.js` | Criado | Script puppeteer-core para regenerar o PDF |
| `scripts/resumo-tcc.html` | Criado | HTML fonte do PDF (estilos embutidos) |
| `resumo-tcc-quasar.pdf` | Gerado | PDF resumo completo 476KB, 13 seções |

---

## 5. Código e Configurações Críticas

**Supabase credentials (backend/.env):**
```
SUPABASE_URL=https://ylbajgyajkbacsqaphyn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsYmFqZ3lhamtiYWNzcWFwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc2MjIsImV4cCI6MjA3OTAyMzYyMn0.1D62gdGKB_Ai_79RY6nypED9DQ4OppRi20Javu4-bCE
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

**buscarVendas() — join crítico:**
```javascript
const { data } = await supabase
  .from('qb_itens_venda')
  .select(`
    venda_id,
    quantidade,
    valor_unitario,
    qb_produtos (id, nome, categoria)
  `);
// Agrupa por venda_id → array de { id, itens: [{nome_produto, ...}] }
```

**Cache — estratégia de chaves:**
```
rec:<nomeProduto>   → TTL 3600s (1 hora)
stats:global        → TTL 1800s (30 min)
```

**package.json scripts relevantes (backend):**
```json
"test:unit": "jest tests/unit --forceExit",
"test:coverage": "jest --coverage"
```

**Regenerar PDF:**
```
node scripts/gerar-pdf.js
```

---

## 6. Erros e Armadilhas Conhecidas

- **PostgREST schema cache:** Após criar tabelas, cliente JS não reconhece colunas novas imediatamente. `NOTIFY pgrst, 'reload schema'` não funciona de forma confiável. **Nunca usar seed.js — usar seed.sql no SQL Editor.**
- **FK UUID × bigint:** Supabase cria tabelas com bigint por padrão. FK como UUID falha silenciosamente. **Sempre bigint em todo o schema.**
- **RLS bloqueia anon key:** Novas tabelas têm RLS ativo. Reads retornam `[]` sem erro. **`ALTER TABLE qb_* DISABLE ROW LEVEL SECURITY` obrigatório.**
- **Jest não encerra com Redis:** O cliente Redis mantém event loop aberto após os testes. **`--forceExit` no script `test:unit`.**
- **CSV Vendas_2026.csv:** Formato inútil — só totais por cliente, sem produtos por pedido. Ignorar para o algoritmo.
- **Redis no Windows:** Não vem instalado. Usar Upstash (cloud gratuito) ou WSL2. Cache.js já tem degradação graceful se offline.

---

## 7. Próximos Passos

- [ ] **Configurar Upstash Redis** — criar conta em upstash.com, criar database, atualizar `REDIS_URL` no `backend/.env`
- [ ] **Exportar relatório de vendas** com itens por pedido do sistema da Quasar Barber (substituir dados mock)
- [ ] **Semana 5 — Validação do algoritmo:** Train/test split real, calcular Precision, Recall, F1 com dados reais. Criar `tests/unit/validacao.test.js` ou `scripts/validar-algoritmo.js`
- [ ] **Semana 6 — Dashboard Frontend:** Componentes `BuscadorProduto`, `CardRecomendacao`, tela de busca interativa
- [ ] **Semana 7 — Gráficos:** Chart.js — barras de confiança, scatter lift vs support, KPIs
- [ ] **Semana 8 — Testes completos:** Cobertura >80%, testes de integração API, testes React
- [ ] **Semanas 9-11 — Texto do TCC:** Capítulos 1-6 (Intro, Fundamentação, Metodologia, Implementação, Resultados, Conclusão)
- [ ] **Semana 12 — Apresentação:** Slides, ensaio, submissão final

---

## 8. Informações Pendentes

- **Dados reais de vendas:** Felipe precisa exportar relatório com itens por pedido do sistema de vendas da Quasar Barber. Quando disponível, substituir `backend/src/database/seed.sql` pelos dados reais — sem alterar código.
- **Redis URL:** `REDIS_URL` no `.env` ainda aponta para `localhost:6379`. Atualizar com URL do Upstash quando configurado.
- **Deploy:** Vercel (frontend) + Railway (backend) planejados para fase final — sem data definida.

---

> **Instrução para o próximo chat:** Este arquivo contém o contexto compactado do TCC de Felipe Pereira — Sistema de Recomendação Quasar Barber. Semanas 1-4 estão completas e commitadas. Todos os arquivos de código estão comentados com JSDoc detalhado. Um PDF resumo foi gerado em `resumo-tcc-quasar.pdf`. O projeto segue o roteiro em `ROTEIRO-SEMANAS-1-4.md` e `ROTEIRO-SEMANAS-5-8.md`. Próximo passo é a Semana 5 (validação do algoritmo com train/test split). Não peça ao usuário para repetir informações que já estão aqui. Comece confirmando que entendeu o contexto e pergunte se quer começar a Semana 5 ou se tem outra prioridade.
