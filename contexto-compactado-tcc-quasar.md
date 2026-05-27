# Contexto Compactado — TCC Sistema de Recomendação Quasar Barber

**Data da compactação:** 26 de Maio de 2026  
**Chat original:** ~40 mensagens

---

## 1. Objetivo

Desenvolver um sistema de recomendação de produtos B2B (distribuidora → barbershops) usando Association Rules (Market Basket Analysis) como TCC de Ciência da Computação de Felipe Pereira. Seguir fielmente o roteiro semanal documentado nos arquivos `.md` do projeto. Prazo: 17 de Agosto de 2026.

---

## 2. Decisões Tomadas

- **Prefixo `qb_` em todas as tabelas:** Supabase compartilhado com outro projeto paralelo que já tem tabela `vendas` — todas as tabelas são `qb_clientes`, `qb_produtos`, `qb_vendas`, `qb_itens_venda`, `qb_regras_associacao`
- **bigint GENERATED ALWAYS AS IDENTITY (não UUID):** Supabase cria tabelas com bigint por padrão; FK de UUID para bigint causava erro — schema inteiro migrado para bigint
- **Supabase JS client (não Knex):** Knex exige DATABASE_URL com senha do postgres que o usuário não tem; usando `@supabase/supabase-js` com anon key para todas as queries
- **Seed via `seed.sql` no SQL Editor (não script Node):** PostgREST do Supabase tem cache de schema que não reconhecia colunas novas imediatamente; seed SQL direto contorna o problema
- **RLS desabilitado nas tabelas `qb_`:** RLS default do Supabase bloqueava leitura com anon key; desabilitado via `ALTER TABLE qb_* DISABLE ROW LEVEL SECURITY`
- **Dados mock no seed:** CSV de vendas da Quasar Barber (`Vendas_2026.csv`) tem formato de relatório por cliente (sem produtos por pedido) — inútil para Association Rules. Seed usa dados mock realistas. Usuário precisa exportar dados com itens por pedido quando disponível.

---

## 3. Estado Atual

**Semana 1 ✅** — Estrutura inicial commitada  
**Semana 2 ✅** — Backend npm install, Supabase configurado, React+Vite scaffolded, api.js criado, banco populado  
**Semana 3 ✅** — Algoritmo implementado, endpoint funcionando com dados reais, 10 testes unitários passando  
**Semana 4 ⏳** — Próxima: Redis cache + endpoint `/api/estatisticas`  
**Semanas 5-12 ⏳** — Não iniciadas

**Endpoint testado e funcionando:**
```
GET http://localhost:3000/api/recomendacoes/Fox%20For%20Men%20Barba
→ retorna Espuma para Barba Premium (43% confiança) + Tônico de Barba (43% confiança)
```

**Pendente antes de continuar:** commit das Semanas 2+3

---

## 4. Arquivos e Artefatos Relevantes

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `backend/.env` | Criado | Credenciais reais Supabase + config |
| `backend/src/app.js` | Atualizado | Express + CORS + rota `/api/recomendacoes` |
| `backend/src/database/connection.js` | Atualizado | Supabase JS client (não Knex) |
| `backend/src/database/schema.sql` | Atualizado | 5 tabelas `qb_` com bigint identity |
| `backend/src/database/seed.sql` | Criado | INSERT SQL p/ rodar no Supabase SQL Editor |
| `backend/src/database/seed.js` | Criado | Script Node — **NÃO USAR** (cache issue) |
| `backend/src/models/index.js` | Criado | `buscarVendas()`, `buscarProdutos()`, `buscarProduto()` |
| `backend/src/services/recomendacao.js` | Criado | `calculateAssociation()`, `obterRecomendacoes()`, `extrairProdutosUnicos()` |
| `backend/src/routes/recomendacoes.js` | Criado | `GET /:produtoId` |
| `backend/src/config/constants.js` | Existia | `MIN_CONFIDENCE=0.30`, `MIN_SUPPORT=0.02`, `TOP_N=3` |
| `backend/tests/unit/recomendacao.test.js` | Criado | 10 testes, todos passando |
| `frontend/package.json` | Criado | React 18 + Vite + Axios + React Router |
| `frontend/vite.config.js` | Criado | Proxy `/api` → `localhost:3000` |
| `frontend/index.html` | Criado | Entry point HTML |
| `frontend/src/main.jsx` | Criado | React root |
| `frontend/src/App.jsx` | Criado | Placeholder "Em desenvolvimento" |
| `frontend/src/services/api.js` | Criado | `recomendacaoService.obterRecomendacoes()` + `obterEstatisticas()` |
| `frontend/src/styles/index.css` | Criado | Reset CSS básico |
| `frontend/.env` | Criado | `VITE_API_URL=http://localhost:3000` |

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

**buscarVendas() em models/index.js — join crítico:**
```javascript
const { data, error } = await supabase
  .from('qb_itens_venda')
  .select(`
    venda_id,
    quantidade,
    valor_unitario,
    qb_produtos (id, nome, categoria)
  `);
// Agrupa por venda_id → array de { id, itens: [{nome_produto, ...}] }
```

---

## 6. Erros e Armadilhas Conhecidas

- **PostgREST schema cache:** Após criar tabelas no Supabase, o cliente JS não reconhece colunas novas imediatamente. `NOTIFY pgrst, 'reload schema'` nem sempre funciona. **Solução: usar seed.sql no SQL Editor, não script Node.**
- **FK UUID × bigint:** Supabase cria tabelas com bigint por padrão. Definir FK como UUID falha. **Solução: sempre usar bigint em todo o schema.**
- **RLS bloqueia anon key:** Novas tabelas têm RLS ativo por padrão. Reads retornam `[]` silenciosamente sem erro. **Solução: `ALTER TABLE qb_* DISABLE ROW LEVEL SECURITY`.**
- **seed.js Node script:** Criado mas não funciona (mesmo problema de cache). Ignorar — usar seed.sql.
- **CSV Vendas_2026.csv:** Formato inútil para o algoritmo (só totais por cliente, sem produtos). Precisará exportar relatório de itens por pedido quando disponível.

---

## 7. Próximos Passos

- [ ] **Commit Semanas 2+3** — mensagem: `"Semana 2-3: Setup completo + algoritmo de recomendação"`
- [ ] **Semana 4 — Redis cache:** Instalar `redis` npm, criar `src/services/cache.js`, integrar no endpoint de recomendações (cache hit/miss com TTL 1h)
- [ ] **Semana 4 — Endpoint estatísticas:** `GET /api/estatisticas` com total_vendas, total_produtos, total_regras, confianca_media, precision, recall, f1_score
- [ ] **Semana 4 — Testes de cache:** `tests/unit/cache.test.js`
- [ ] **Semana 5 — Validação do algoritmo:** Precision, Recall, F1 com train/test split real
- [ ] **Semana 6-7 — Frontend Dashboard:** Componentes BuscadorProduto, CardRecomendacao, GraficoRecomendacoes
- [ ] **Semana 8 — Testes completos:** Cobertura 80%+
- [ ] **Dados reais:** Exportar do sistema de vendas relatório com itens por pedido (quando disponível)

---

## 8. Informações Pendentes

- **Dados reais de vendas:** CSV atual não tem produtos por pedido. Quando Felipe tiver esse export, substituir seed mock por dados reais — isso melhora métricas do algoritmo pro TCC.
- **Redis:** Semana 4 usa Redis. Definir se será local ou cloud (Upstash gratuito recomendado no roteiro).

---

> **Instrução para o próximo chat:** Este arquivo contém o contexto compactado de um chat anterior sobre o TCC de Felipe Pereira — Sistema de Recomendação Quasar Barber. Use-o como base para continuar o trabalho. Não peça ao usuário para repetir informações que já estão aqui. O projeto segue o roteiro em `ROTEIRO-SEMANAS-1-4.md` (e seguintes). Semanas 2 e 3 estão completas — próximo passo é o commit e então Semana 4 (Redis cache + endpoint de estatísticas). Comece confirmando que entendeu o contexto e pergunte se quer commitar primeiro ou já seguir para o código da Semana 4.
