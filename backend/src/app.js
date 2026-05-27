const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recomendacoesRoutes = require('./routes/recomendacoes');
const estatisticasRoutes = require('./routes/estatisticas');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/recomendacoes', recomendacoesRoutes);
app.use('/api/estatisticas', estatisticasRoutes);

module.exports = app;
