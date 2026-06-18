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
    // Leave-One-Out Cross-Validation: protocolo adequado ao dataset reduzido,
    // aproveita todas as transações como teste (ver Cap. 3.6 do TCC).
    const metricas = validador.validarLOOCV(vendas);

    const resultado = {
      timestamp: new Date().toISOString(),
      metodo: 'LOOCV (Leave-One-Out Cross-Validation)',
      precision: metricas.precision_media,
      recall: metricas.recall_media,
      f1_score: metricas.f1_media,
      total_transacoes: metricas.detalhes.total_transacoes,
      transacoes_avaliadas: metricas.detalhes.transacoes_avaliadas,
      sub_testes: metricas.detalhes.sub_testes,
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
