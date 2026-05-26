# Sistema de Recomendação - Quasar Barber

TCC 2026 — Association Rules para e-commerce B2B de barbershops.

## Stack
- **Backend:** Node.js 18 + Express + PostgreSQL (Supabase) + Redis
- **Frontend:** React 18 + Vite + Chart.js
- **Testes:** Jest (alvo 82%+ cobertura)

## Rodar localmente

```bash
# Backend
cd backend
npm install
cp .env.example .env   # preencher com credenciais Supabase
npm run dev            # http://localhost:3000

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

## Estrutura

```
backend/
  src/
    services/    # algoritmo de recomendação
    routes/      # endpoints REST
    database/    # schema + conexão
    config/      # constantes e configurações
  tests/
    unit/
    integration/
    fixtures/
frontend/
  src/
    components/
    pages/
    services/
dados/           # CSV e JSON histórico de vendas
tcc/             # capítulos do TCC
```

## Autor
Felipe Pereira — Quasar Barber, Codó MA