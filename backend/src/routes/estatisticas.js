const express = require('express');
const router = express.Router();
const { calculateAssociation } = require('../services/recomendacao');
const { buscarVendas, buscarProdutos } = require('../models');
const cache = require('../services/cache');

router.get('/', async (req, res) => {
  try {
    const cacheKey = 'stats:global';

    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log('[CACHE HIT] stats:global');
      return res.json({ ...cached, source: 'cache' });
    }

    console.log('[CACHE MISS] stats:global');

    const [vendas, produtos] = await Promise.all([buscarVendas(), buscarProdutos()]);
    const regras = calculateAssociation(vendas, 0.30, 0.02);

    const confiancaMedia = regras.length > 0
      ? regras.reduce((acc, r) => acc + r.confidence, 0) / regras.length
      : 0;

    const supportMedio = regras.length > 0
      ? regras.reduce((acc, r) => acc + r.support, 0) / regras.length
      : 0;

    const resultado = {
      total_vendas: vendas.length,
      total_produtos: produtos.length,
      total_regras: regras.length,
      confianca_media: parseFloat(confiancaMedia.toFixed(4)),
      support_medio: parseFloat(supportMedio.toFixed(4)),
      regras_top5: regras.slice(0, 5).map(r => ({
        antecedente: r.antecedente,
        consequente: r.consequente,
        confidence: r.confidence,
        support: r.support,
        lift: r.lift,
      })),
    };

    await cache.set(cacheKey, resultado, 1800);

    res.json({ ...resultado, source: 'computado' });

  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor', detalhes: erro.message });
  }
});

module.exports = router;
