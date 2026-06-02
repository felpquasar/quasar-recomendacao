/**
 * routes/validacao.js
 * ===================
 * Endpoint GET /api/validacao — retorna métricas de qualidade do algoritmo
 * (Precision, Recall, F1-Score) calculadas via train/test split 80/20.
 *
 * Cache de 6 horas: o cálculo envolve rodar o algoritmo completo sobre
 * 80% do dataset para gerar regras, depois avaliar nos 20% restantes.
 * É custoso o suficiente para valer o cache longo.
 */

const express = require('express');
const router = express.Router();
const validador = require('../services/validacao');
const cache = require('../services/cache');
const { buscarVendas } = require('../models');

/**
 * GET /api/validacao
 * Retorna Precision, Recall e F1-Score do algoritmo de recomendação.
 * Usa train/test split 80/20 sobre os dados do Supabase.
 */
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'validation:metrics';

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, source: 'cache' });
    }

    const vendas = await buscarVendas();
    const metricas = validador.validarComSplit(vendas);

    const resultado = {
      timestamp: new Date().toISOString(),
      precision: metricas.precision_media,
      recall: metricas.recall_media,
      f1_score: metricas.f1_media,
      total_transacoes_treino: metricas.detalhes.total_treino,
      total_transacoes_teste: metricas.detalhes.total_teste,
      transacoes_avaliadas: metricas.detalhes.transacoes_avaliadas,
      descricao: {
        precision: 'Das recomendacoes feitas, quantas resultaram em compra?',
        recall: 'Das compras realizadas, quantas foram recomendadas?',
        f1_score: 'Media harmonica entre Precision e Recall',
      },
      source: 'computado',
    };

    // TTL de 6 horas — mudança nos dados de treino só afeta o resultado
    // quando novas vendas alteram padrões significativamente
    await cache.set(cacheKey, resultado, 21600);

    res.json(resultado);

  } catch (erro) {
    console.error('Erro ao calcular validacao:', erro);
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
