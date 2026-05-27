/**
 * routes/recomendacoes.js
 * =======================
 * Rota principal da API: retorna recomendações de produtos usando
 * Association Rules calculadas sobre o histórico de vendas.
 *
 * ENDPOINT: GET /api/recomendacoes/:produtoId
 *
 * PARÂMETRO:
 *   produtoId (URL-encoded) - Nome do produto para buscar recomendações.
 *   Exemplo: GET /api/recomendacoes/Fox%20For%20Men%20Barba
 *
 * FLUXO COM CACHE:
 *   1. Monta cache key: "rec:<produtoId>"
 *   2. Verifica Redis → se hit, retorna imediatamente com source: 'cache'
 *   3. Se miss: busca vendas → calcula regras → filtra top N
 *   4. Armazena resultado no Redis (TTL: 1h)
 *   5. Retorna com source: 'computado'
 *
 * RESPOSTA DE SUCESSO (200):
 *   {
 *     produto: "Fox For Men Barba",
 *     total_recomendacoes: 2,
 *     recomendacoes: [
 *       { nome, confianca, support, lift, descricao },
 *       ...
 *     ],
 *     source: "cache" | "computado"
 *   }
 *
 * RESPOSTAS DE ERRO:
 *   400 - produtoId vazio ou sem vendas no banco
 *   500 - Erro interno (Supabase down, bug no algoritmo)
 */

const express = require('express');
const router = express.Router();
const { calculateAssociation, obterRecomendacoes } = require('../services/recomendacao');
const { buscarVendas } = require('../models');
const { ALGORITHM_CONFIG } = require('../config/constants');
const cache = require('../services/cache');

// Prefixo de chave Redis para isolar namespace de recomendações
const CACHE_PREFIX = 'rec:';

/**
 * GET /:produtoId
 * Handler principal da rota de recomendações.
 * Usa async/await com try/catch para capturar erros de Supabase ou
 * do algoritmo sem crashar o processo do servidor.
 */
router.get('/:produtoId', async (req, res) => {
  try {
    const { produtoId } = req.params;

    // Validação básica — Express roteia até aqui mas o param pode estar vazio
    if (!produtoId || produtoId.trim() === '') {
      return res.status(400).json({ erro: 'produtoId é obrigatório' });
    }

    const cacheKey = `${CACHE_PREFIX}${produtoId}`;

    // Tenta retornar do cache antes de qualquer I/O pesado
    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${produtoId}`);
      return res.json({ ...cached, source: 'cache' });
    }

    console.log(`[CACHE MISS] ${produtoId}`);

    // Busca todas as vendas do Supabase (join qb_itens_venda + qb_produtos)
    const vendas = await buscarVendas();

    if (!vendas || vendas.length === 0) {
      return res.status(400).json({ erro: 'Nenhuma venda encontrada no banco de dados' });
    }

    // Executa o algoritmo de Association Rules com os thresholds configurados
    const regras = calculateAssociation(
      vendas,
      ALGORITHM_CONFIG.MIN_CONFIDENCE, // 0.30
      ALGORITHM_CONFIG.MIN_SUPPORT      // 0.02
    );

    // Filtra apenas as regras onde o antecedente é o produto solicitado
    const recomendacoes = obterRecomendacoes(produtoId, regras, ALGORITHM_CONFIG.TOP_N);

    // Formata a resposta enriquecendo com descrição legível para o frontend
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

    // Persiste no Redis por 1 hora — próxima chamada para o mesmo produto será instantânea
    await cache.set(cacheKey, resultado, 3600);

    res.json(resultado);

  } catch (erro) {
    console.error('Erro ao buscar recomendações:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor', detalhes: erro.message });
  }
});

module.exports = router;
