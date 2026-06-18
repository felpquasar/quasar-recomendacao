# Contexto Compactado — TCC Quasar Barber: Semana 9 (escrita Cap 1 + Cap 2)

**Data da compactação:** 2026-06-16
**Chat original:** ~12 mensagens

---

## 1. Objetivo

Iniciar a fase de escrita do TCC de Felipe Pereira (Ciência da Computação) — sistema de recomendação B2B com Association Rules para a Quasar Barber. Semana 9 do cronograma de 12 semanas: escrever Cap 1 (Introdução) e Cap 2 (Fundamentação Teórica).

## 2. Decisões Tomadas

- **Etapa atual = Semana 9:** git mostrava `5e18207 Semana 8: testes de integracao + cobertura 92%` concluída. Memória estava desatualizada ("em S8") → corrigida para "S1-8 concluídas, entrando S9".
- **Código pronto (S1-8):** backend + frontend + testes (cobertura 92%) finalizados. S9+ foco total na escrita do documento.
- **Cap 1 e Cap 2 escritos como arquivos `.md` separados** em `tcc/`, prosa ABNT, seguindo `tcc/00-ESTRUTURA.md`.
- **Fórmulas em LaTeX** (`$$...$$`) — renderiza em Markdown/Pandoc. Se editor final for Word puro, converter para imagem/MathType.
- **Citações puxadas da lista consolidada** de `tcc/REFERENCIAS.md` (23 refs ABNT).
- **Commit S9 = só texto.** PDFs dos papers (~30MB em `docs/referencias/`) ficaram fora do git via `.gitignore` (binários grandes incham histórico). Commitado: `tcc/` + `docs/notas-estudo/`.
- **`ROTEIRO-SEMANAS-1-4.md` (modificado) deixado fora do commit S9** — não é artefato de escrita S9.
- **Workflow git = direto no `master`** (convenção do repo; todos commits no master).

## 3. Estado Atual

- **Cap 1 (Introdução):** ✅ completo — `tcc/01-introducao.md`, seções 1.1–1.7. ~4 págs.
- **Cap 2 (Fundamentação Teórica):** ✅ completo — `tcc/02-fundamentacao-teorica.md`, seções 2.1–2.6. ~12 págs.
- **Commit `b5fcb18`** feito (8 arquivos, 669 inserções) e **push concluído** (`5e18207..b5fcb18 master`) para `github.com/felpquasar/quasar-recomendacao`.
- Memória do projeto atualizada (`project_context.md`).

## 4. Arquivos e Artefatos Relevantes

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `tcc/00-ESTRUTURA.md` | Versionado (existia) | Estrutura completa do TCC: tema, problema, hipótese H1/H0, objetivos, metodologia DSR, sumário 6 caps, cronograma S9-12 |
| `tcc/REFERENCIAS.md` | Versionado (existia) | 23 refs ABNT + ranking por impacto + lista alfabética consolidada |
| `tcc/01-introducao.md` | Criado (S9) | Cap 1 completo, seções 1.1–1.7 |
| `tcc/02-fundamentacao-teorica.md` | Criado (S9) | Cap 2 completo, seções 2.1–2.6 |
| `docs/notas-estudo/*` | Versionado (S9) | 3 notas: Apriori, Market Basket Analysis, Regras de associação |
| `docs/referencias/*.pdf` | **Ignorado (.gitignore)** | PDFs dos papers (~30MB) — fora do git |
| `.gitignore` | Editado (S9) | Adicionada linha `docs/referencias/` |
| `ROTEIRO-SEMANAS-1-4.md` | Modificado, NÃO commitado | Roteiro detalhado S1-4 |

## 5. Código e Configurações Críticas

**Stack:** Node.js 18 + Express + Knex + PostgreSQL (Supabase); React 18 + Vite + Chart.js + Axios; Redis (cache opcional); Jest 29 + Supertest.

**Parâmetros do algoritmo** (`backend/src/config/constants.js`): `MIN_CONFIDENCE=0.30`, `MIN_SUPPORT=0.02`, `MIN_LIFT=1.0`, `TOP_N=3`.

**Dataset:** pedidos reais 2026, 33 transações / 33 produtos únicos (importado no Supabase via `seed-csv.js`).

**Métricas/resultados esperados** (Cap 5): confiança média 71,09%, support médio 4,73%, 57 regras. Ex. regra forte: QOD Shampoo → QOD Pomada (100% conf., lift 11,0). Precision 72% / Recall 58% / F1 0,64.

## 6. Erros e Armadilhas Conhecidas

- **PDFs grandes no git:** evitar commitar `docs/referencias/` (~30MB). Já em `.gitignore`.
- **Aviso CRLF/LF:** git avisa conversão de fim de linha em arquivos `.md` no Windows — inofensivo.

## 7. Próximos Passos

- [ ] **Semana 10:** escrever Cap 3 (Metodologia) + Cap 4 (Desenvolvimento do Sistema)
- [ ] Semana 11: Cap 5 (Resultados) + Cap 6 (Conclusão) + revisão ABNT
- [ ] Semana 12: apresentação (10-15 slides) + ensaio + submissão à banca

## 8. Informações Pendentes (revisar antes de submeter)

- **Nº final do dataset:** confirmar 33 transações / 33 produtos antes do Cap 5 (usado em Cap 1 §1.6 e Cap 2).
- **Precision Moraes (2023):** valores 22,53% (digital) / 31,28% (físico) — conferir na fonte original antes de submeter.
- **Fórmulas LaTeX:** decidir formato final do documento (Markdown/Pandoc vs Word) — afeta como `$$...$$` será renderizado.
- **Dados bibliográficos:** `REFERENCIAS.md` alerta para conferir página/volume/edição/DOI de cada obra na fonte.

---

> **Instrução para o próximo chat:** Este arquivo contém o contexto compactado de um chat anterior. Use-o como base para continuar o trabalho. Não peça ao usuário para repetir informações que já estão aqui. Comece confirmando brevemente que entendeu o contexto e pergunte por onde o usuário quer continuar.
