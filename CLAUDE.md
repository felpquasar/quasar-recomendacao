# CLAUDE.md — TCC Sistema de Recomendação (Quasar)

TCC do Felipe (Ciência da Computação, defesa ~agosto/2026): sistema de recomendação de produtos via Association Rules / Market Basket Analysis (suporte, confiança, lift; algoritmo Apriori), com dados reais da distribuidora Quasar Barber.

## Estrutura
- `backend/` — Node.js 18 + Express + Knex + PostgreSQL/Supabase (RLS ativo; tabelas com prefixo `qb_`)
- `frontend/` — React 18 + Vite + Chart.js
- `tcc/` — capítulos da monografia (ABNT)
- `apresentacao/` — slides e roteiro de defesa
- `dados/` — CSVs de vendas exportados do sistema de gestão
- `docs/FORMATO-CSV-EXPORTACAO.md` (ou na raiz) — spec do CSV de entrada; validar todo CSV novo contra ele antes do seed
- Testes: Jest/Supertest, cobertura ~92% — rodar antes de mexer no backend

## Regras deste projeto
- DADOS REAIS APENAS: nunca inserir transações fictícias no dataset (decisão do Felipe em 18/06/2026 — integridade acadêmica do TCC).
- Escrita da monografia: usar a skill /humanizer (padrão adotado pelo Felipe) e manter terminologia consistente em português (suporte, confiança, lift — não misturar "confidence"/"confiança" entre capítulos).
- Toda citação usada no texto DEVE constar da lista de referências ABNT — conferir as duas pontas ao adicionar ou remover.
- RLS: se faltar permissão em tabela `qb_*`, a solução é GRANT específico (ex.: `GRANT SELECT`), nunca desabilitar RLS.
- Scripts ad-hoc de Node: criar dentro do projeto (não em pasta temp) e usar paths Windows absolutos nos requires.

## SQL direto no banco (backend/scripts/run-sql.js)

Existe `backend/scripts/run-sql.js` (CommonJS, usa `pg` — já era dependência do Knex) que roda SQL direto no Postgres via `DATABASE_URL`, sem precisar do Felipe colar no Supabase Dashboard e devolver o resultado.

- Se `DATABASE_URL` NÃO estiver em `backend/.env`: pedir ao Felipe para configurar (ver `SETUP-SQL-DIRETO.md`) e, até lá, seguir o fluxo manual antigo.
- Se estiver configurada: usar `node scripts/run-sql.js <arquivo.sql>` ou `node scripts/run-sql.js --sql="..."` a partir de `backend/`.

## Estado da sessão
- `contexto-compactado-tcc-*.md` mais recente = onde o trabalho parou.
