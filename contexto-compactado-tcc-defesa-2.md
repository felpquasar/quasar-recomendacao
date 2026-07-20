# Contexto Compactado — TCC Quasar Recomendação: Defesa, Regras, Comentários e Execução

**Data da compactação:** 2026-06-24
**Chat original:** ~12 mensagens substantivas

---

## 1. Objetivo

Felipe (autor do TCC, sistema de recomendação B2B Quasar Barber) está se preparando p/ defesa de banca. Precisa entender e ter pronto p/ explicar: diferença produto/item no dataset, lista completa das 44 regras de associação geradas, origem dos 36 subtestes do LOOCV, código comentado p/ os arquivos-chave do algoritmo, e o sistema rodando localmente p/ testes manuais.

## 2. Decisões Tomadas

- **Comentar só 4 arquivos-chave (não todo o projeto):** `recomendacao.js`, `validacao.js`, `seed-csv.js`, `constants.js` — são os que a banca vai cobrar. Escolhido entre 4 opções de escopo via AskUserQuestion.
- **Estilo de comentário: linha-a-linha didático** (não JSDoc resumido) — escolhido p/ reforçar defesa oral.
- **`constants.js` não foi tocado** — já estava 100% comentado.
- **Fix de permissão no Supabase: GRANT SELECT** (não RLS disable, não troca p/ service key) — opção escolhida pelo usuário entre 2 alternativas. RLS já estava desabilitado; o erro era falta de GRANT para a role `anon`.
- **Modelo trocado para Sonnet 4.6** (decisão do usuário via `/model`) — visando economia de credits.

## 3. Estado Atual

- **Dataset confirmado:** 30 transações, 26 clientes, 29 produtos únicos, 52 itens de venda, 14 transações multi-item.
- **44 regras de associação geradas e validadas** rodando `calculateAssociation` localmente sobre `dados/Pedidos_2026.csv` (thresholds: minConfidence=0.30, minSupport=0.02). Bate exatamente com `dados/metricas-validacao.json` (44 regras, confiança média 76,51%, suporte médio 4,39%, lift médio 12,41).
- **36 subtestes do LOOCV explicados e confirmados no código** (`validacao.js:155-199`): soma dos produtos únicos das 14 cestas avaliáveis (cestas com <2 produtos são puladas). Contagem por cesta: 48(2)+50(2)+52(3)+55(2)+57(2)+60(3)+61(2)+62(3)+67(3)+68(2)+69(2)+74(4)+75(3)+76(3) = 36.
- **Comentários linha-a-linha adicionados** em `recomendacao.js`, `validacao.js`, `seed-csv.js` (ver seção 4). Apenas comentários — zero mudança de comportamento. Sintaxe validada com `node -c` e regras recalculadas (44 regras inalteradas) após edição.
- **Sistema rodando localmente:**
  - Backend: `http://localhost:3000` (rodando em background, ID `bvom693w6`)
  - Frontend: `http://localhost:5173` (Vite, rodando em background, ID `blbglo7cm`)
  - Supabase: erro inicial `permission denied for table qb_produtos/qb_itens_venda` — **resolvido** pelo usuário rodando `GRANT SELECT` no SQL Editor do Supabase (projeto `ylbajgyajkbacsqaphyn`).
  - Endpoints testados e funcionando após o grant: `/health` (OK), `/api/produtos?q=barba` (10 resultados), `/api/estatisticas` (retorna 44 regras, distribuição categorias Barba:12/Cabelo:15/Acessórios:2).
  - **Pendente de re-teste:** `/api/recomendacoes/:id` e `/api/validacao` — comando foi interrompido por falha temporária do classificador de segurança (model unavailable), não foi re-executado ainda.

## 4. Arquivos e Artefatos Relevantes

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `backend/src/services/recomendacao.js` | Editado (só comentários) | Core do algoritmo Apriori simplificado: `extrairProdutosUnicos`, `calculateAssociation` (duplo laço de pares, support/confidence/lift), `obterRecomendacoes` |
| `backend/src/services/validacao.js` | Editado (só comentários) | `calcularPrecision/Recall/F1Score`, `validarComSplit` (80/20), `validarLOOCV` (núcleo dos 36 subtestes) |
| `backend/src/database/seed-csv.js` | Editado (só comentários) | `inferirCategoria`, `parsearCSV` (BOM/CRLF/`;`), `dataParaISO` (DD/MM→ISO), `agruparPorPedido` |
| `backend/src/config/constants.js` | Não tocado | Já tinha JSDoc completo (ALGORITHM_CONFIG: MIN_CONFIDENCE 0.30, MIN_SUPPORT 0.02, MIN_LIFT 1.0, TOP_N 3) |
| `backend/src/database/connection.js` | Lido, não editado | Cliente Supabase usa `SUPABASE_ANON_KEY` em runtime (não a service key) |
| `backend/src/services/cache.js` | Lido, não editado | Redis com degradação graceful — sistema funciona sem Redis ativo |
| `dados/metricas-validacao.json` | Lido | Fonte oficial das métricas: 44 regras, LOOCV precision 26,39%/recall 44,44%/F1 31,94% (14 transações avaliadas, 36 subtestes, top_n=3) |
| `dados/Pedidos_2026.csv` | Lido (não editado) | CSV bruto real — usado p/ recalcular as 44 regras localmente |
| `tcc/03-metodologia.md` | Lido | Contém a definição formal produto vs item (linha 34, 36) |
| `apresentacao/perguntas-banca.md` | Aberto no IDE pelo usuário | Pode precisar incluir pergunta sobre produto/item e sobre os 36 subtestes |

## 5. Código e Configurações Críticas

**Script standalone usado p/ gerar as 44 regras fora do banco** (não faz parte do repo, ficou em `/tmp/gerar_regras.js` — útil se precisar re-rodar):
```js
const fs = require('fs');
const ROOT = 'C:/Users/Quasar/Desktop/quasar-recomendacao';
const { calculateAssociation } = require(ROOT + '/backend/src/services/recomendacao.js');

const conteudo = fs.readFileSync(ROOT + '/dados/Pedidos_2026.csv', 'utf8');
const linhas = conteudo.replace(/^﻿/, '').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').map(l=>l.trim()).filter(Boolean);
const [cab, ...dados] = linhas;
const cols = cab.split(';').map(c=>c.trim());
const rows = dados.map(l=>{const v=l.split(';');const o={};cols.forEach((c,i)=>o[c]=(v[i]||'').trim());return o;});

const pedidos = new Map();
for (const r of rows){
  const id=r['Pedido']; if(!id) continue;
  if(!pedidos.has(id)) pedidos.set(id,{id,itens:[]});
  pedidos.get(id).itens.push({nome_produto:r['Produto']});
}
const vendas = Array.from(pedidos.values());
const regras = calculateAssociation(vendas, 0.30, 0.02); // 44 regras
```

**Fix Supabase aplicado pelo usuário (SQL Editor, projeto ylbajgyajkbacsqaphyn):**
```sql
grant select on qb_produtos, qb_clientes, qb_vendas, qb_itens_venda to anon;
```

**Comandos p/ subir o sistema:**
```bash
cd backend && npm start   # porta 3000
cd frontend && npm run dev # porta 5173 (Vite)
```

## 6. Erros e Armadilhas Conhecidas

- **Não confundir 52 (itens) com 36 (subtestes LOOCV).** 52 = todas as linhas de venda (inclui 16 cestas single-item + duplicatas). 36 = só produtos únicos das 14 cestas multi-item — cestas de 1 item não geram subteste porque esconder o único produto não deixa nada como antecedente.
- **Erro `permission denied for table` no Supabase não é RLS** (RLS já estava desabilitado) — é falta de GRANT SELECT pra role `anon`. Se RLS estivesse ativo sem policy, o retorno seria array vazio `[]`, não erro de permissão.
- **Comando bash com múltiplos `curl` em paralelo falhou** por indisponibilidade temporária do classificador de segurança do Claude (`claude-opus-4-8 is temporarily unavailable`) — não é erro do sistema testado, é infraestrutura do harness. Re-tentar depois.

## 7. Próximos Passos

- [ ] Re-testar `/api/recomendacoes/:id` (ex: id 80 = Óleo Barba Spray Fox, id 64 = Óleo Barba 25M QOD) e `/api/validacao` agora que o grant foi aplicado.
- [ ] Decidir se quer a tabela das 44 regras salva em `apresentacao/44-regras.md` como anexo da defesa (foi oferecido, ainda não decidido).
- [ ] Avaliar se `apresentacao/perguntas-banca.md` precisa de entrada nova sobre produto vs item e sobre origem dos 36 subtestes (foi sugerido, não confirmado).
- [ ] Rodar testes unitários (`backend/tests/unit/validacao.test.js`) pra confirmar que os comentários adicionados não quebraram nada (oferecido, não executado).
- [ ] Continuar testes manuais do sistema no navegador (frontend já está rodando em `localhost:5173`).

## 8. Informações Pendentes

- Estimativa de custo/uso real de credits não foi calculada (`/caveman-stats` foi oferecido mas não executado).
- Não ficou definido se backend/frontend devem continuar rodando em background ou se o usuário vai encerrar ao final da sessão de testes.

---

> **Instrução para o próximo chat:** Este arquivo contém o contexto compactado de um chat anterior. Use-o como base para continuar o trabalho. Não peça ao usuário para repetir informações que já estão aqui. Comece confirmando brevemente que entendeu o contexto e pergunte por onde o usuário quer continuar.
