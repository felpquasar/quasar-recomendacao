/**
 * app.js
 * ======
 * Ponto de entrada do servidor Express. Configura middlewares globais
 * e registra todas as rotas da API REST do sistema de recomendação.
 *
 * ARQUITETURA:
 *   Cliente (React) → Vite Proxy → Express (app.js) → Routes → Services → Models → Supabase
 *
 * MIDDLEWARES:
 *   cors()         - Permite requisições cross-origin do frontend (localhost:5173)
 *                   Em produção, FRONTEND_URL deve ser o domínio real do deploy.
 *   express.json() - Parseia body JSON automaticamente para req.body
 *
 * ROTAS DISPONÍVEIS:
 *   GET /health                        → Status do servidor (uptime check)
 *   GET /api/recomendacoes/:produtoId  → Recomendações para um produto
 *   GET /api/estatisticas              → Métricas globais do sistema
 *   GET /api/validacao                 → Precision, Recall, F1 (train/test split)
 *   GET /api/produtos?q=<termo>        → Busca parcial de produtos (autocomplete)
 *
 * O servidor é iniciado em server.js (não aqui) para facilitar os testes
 * de integração com supertest, que importam o app sem subir o servidor.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recomendacoesRoutes = require('./routes/recomendacoes');
const estatisticasRoutes = require('./routes/estatisticas');
const validacaoRoutes = require('./routes/validacao');
const produtosRoutes = require('./routes/produtos');

const app = express();

// CORS restrito ao frontend configurado — evita uso indevido da API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

// Parseia JSON no corpo das requisições POST/PUT/PATCH
app.use(express.json());

/**
 * GET /health
 * Endpoint de health check para monitoramento (ex: UptimeRobot, Railway).
 * Retorna timestamp para verificar se o servidor está travado.
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas de domínio — lógica separada em arquivos de rota próprios
app.use('/api/recomendacoes', recomendacoesRoutes);
app.use('/api/estatisticas', estatisticasRoutes);
app.use('/api/validacao', validacaoRoutes);
app.use('/api/produtos', produtosRoutes);

module.exports = app;
