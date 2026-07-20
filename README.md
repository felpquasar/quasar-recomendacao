# Quasar Recomendação

Sistema de recomendação de produtos via **Market Basket Analysis** (algoritmo Apriori), desenvolvido como Trabalho de Conclusão de Curso (Ciência da Computação) usando dados reais de vendas de uma distribuidora de produtos de barba/cabelo.

## Problema

Distribuidoras B2B do setor de barba/cabelo têm centenas de produtos e histórico de vendas, mas nenhuma forma sistemática de identificar quais itens costumam ser comprados juntos — decisão de cross-sell fica no "feeling" de quem atende.

## Método

- **Association Rules / Market Basket Analysis**: métricas de suporte, confiança e lift sobre as cestas de compra (pedidos) reais da Quasar Barber
- **Algoritmo Apriori** para geração das regras de associação, com suporte mínimo 0,30 e confiança mínima 0,02
- **Validação**:
  - Split 80/20 (treino/teste)
  - **LOOCV** (Leave-One-Out Cross-Validation), escondendo um produto por vez de cada cesta de teste e verificando se o modelo o recomenda de volta (top-3)

## Resultado

Sobre um dataset de 30 transações / 29 produtos únicos:

| Métrica | Valor |
|---|---|
| Regras geradas | 44 |
| Confiança média | 76,5% |
| Suporte médio | 4,4% |
| Lift médio | 12,4 |
| **LOOCV** — precisão média | 26,4% |
| **LOOCV** — recall médio | 44,4% |
| **LOOCV** — F1 médio | 31,9% |

_(36 subtestes de leave-one-out sobre 14 das 30 transações, recomendando top-3 produtos.)_

## Stack

- **Backend:** Node.js + Express + Knex, PostgreSQL/Supabase, Redis (cache)
- **Frontend:** React 18 + Vite + Chart.js
- **Testes:** Jest/Supertest, cobertura ~92% no backend

## Estrutura

```
backend/     API REST + serviço de recomendação (Apriori, validação)
frontend/    Dashboard React (visualização das regras e recomendações)
dados/       CSV de vendas (anonimizado) usado para gerar as regras
tcc/         Monografia (ABNT)
apresentacao/ Slides e roteiro de defesa
```

## Rodando localmente

```bash
# backend
cd backend && npm install && npm run dev

# frontend
cd frontend && npm install && npm run dev
```

Requer `DATABASE_URL`/credenciais Supabase em `backend/.env` (não versionado).

---

_Nomes de cliente no dataset foram anonimizados (`Cliente 01`, `Cliente 02`, ...) — os dados de produtos, quantidades e valores são reais._
