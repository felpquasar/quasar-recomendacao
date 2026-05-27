const express = require('express');
const router = express.Router();
const { calculateAssociation, obterRecomendacoes } = require('../services/recomendacao');
const { buscarVendas } = require('../models');
const { ALGORITHM_CONFIG } = require('../config/constants');
const cache = require('../services/cache');

const CACHE_PREFIX = 'rec:';

router.get('/:produtoId', async (req, res) => {
  try {
    const { produtoId } = req.params;

    if (!produtoId || produtoId.trim() === '') {
      return res.status(400).json({ erro: 'produtoId é obrigatório' });
    }

    const cacheKey = `${CACHE_PREFIX}${produtoId}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${produtoId}`);
      return res.json({ ...cached, source: 'cache' });
    }

    console.log(`[CACHE MISS] ${produtoId}`);

    const vendas = await buscarVendas();

    if (!vendas || vendas.length === 0) {
      return res.status(400).json({ erro: 'Nenhuma venda encontrada no banco de dados' });
    }

    const regras = calculateAssociation(
      vendas,
      ALGORITHM_CONFIG.MIN_CONFIDENCE,
      ALGORITHM_CONFIG.MIN_SUPPORT
    );

    const recomendacoes = obterRecomendacoes(produtoId, regras, ALGORITHM_CONFIG.TOP_N);

    const resultado = {
      produto: produtoId,
      total_recomendacoes: recomendacoes.length,
      recomendacoes: recomendacoes.map(r => ({
        nome: r.consequente,
        confianca: r.confidence,
        support: r.support,
        lift: r.lift,
        descricao: `Clientes que compraram "${r.antecedente}" também compraram "${r.consequente}" (${(r.confidence * 100).toFixed(1)}% de confiança)`,
      })),
      source: 'computado',
    };

    await cache.set(cacheKey, resultado, 3600);

    res.json(resultado);

  } catch (erro) {
    console.error('Erro ao buscar recomendações:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor', detalhes: erro.message });
  }
});

module.exports = router;
