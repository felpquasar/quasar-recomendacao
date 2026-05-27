/**
 * routes/estatisticas.js
 * ======================
 * Endpoint de métricas globais do sistema de recomendação.
 * Fornece dados para o dashboard do frontend (gráficos, KPIs).
 *
 * ENDPOINT: GET /api/estatisticas
 *
 * FLUXO:
 *   1. Verifica cache Redis (chave: "stats:global", TTL: 30min)
 *   2. Se miss: carrega vendas + produtos em paralelo (Promise.all)
 *   3. Executa calculateAssociation() sobre todas as vendas
 *   4. Computa métricas agregadas (totais, médias, top5 regras)
 *   5. Armazena em cache e retorna
 *
 * TTL de 30min (em vez de 1h das recomendações) porque as estatísticas
 * agregadas podem mudar com novas vendas e precisam ser mais atuais
 * para o dashboard monitorar o sistema em tempo quase-real.
 *
 * RESPOSTA DE SUCESSO (200):
 *   {
 *     total_vendas: 150,
 *     total_produtos: 20,
 *     total_regras: 47,
 *     confianca_media: 0.4823,
 *     support_medio: 0.0812,
 *     regras_top5: [{ antecedente, consequente, confidence, support, lift }],
 *     source: "cache" | "computado"
 *   }
 */

const express = require('express');
const router = express.Router();
const { calculateAssociation } = require('../services/recomendacao');
const { buscarVendas, buscarProdutos } = require('../models');
const cache = require('../services/cache');

/**
 * GET /
 * Retorna as métricas globais do sistema de recomendação.
 * Promise.all() para buscar vendas e produtos em paralelo — economiza
 * ~50% do tempo de I/O comparado a awaits sequenciais.
 */
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'stats:global';

    // Cache hit → retorna imediatamente sem processar
    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log('[CACHE HIT] stats:global');
      return res.json({ ...cached, source: 'cache' });
    }

    console.log('[CACHE MISS] stats:global');

    // Busca paralela: vendas e produtos ao mesmo tempo (2 requests ao Supabase)
    const [vendas, produtos] = await Promise.all([buscarVendas(), buscarProdutos()]);

    // Executa o algoritmo sobre todas as vendas com thresholds padrão
    const regras = calculateAssociation(vendas, 0.30, 0.02);

    // Calcula médias — guard para dataset vazio (evita NaN)
    const confiancaMedia = regras.length > 0
      ? regras.reduce((acc, r) => acc + r.confidence, 0) / regras.length
      : 0;

    const supportMedio = regras.length > 0
      ? regras.reduce((acc, r) => acc + r.support, 0) / regras.length
      : 0;

    const resultado = {
      total_vendas: vendas.length,          // Total de transações no dataset
      total_produtos: produtos.length,       // Total de produtos ativos no catálogo
      total_regras: regras.length,           // Regras que passaram nos thresholds
      confianca_media: parseFloat(confiancaMedia.toFixed(4)),
      support_medio: parseFloat(supportMedio.toFixed(4)),
      // Top 5 regras para exibir no dashboard (já ordenadas por confidence)
      regras_top5: regras.slice(0, 5).map(r => ({
        antecedente: r.antecedente,
        consequente: r.consequente,
        confidence: r.confidence,
        support: r.support,
        lift: r.lift,
      })),
    };

    // Cache por 30 min (1800s) — mais curto que recomendações para refletir novas vendas
    await cache.set(cacheKey, resultado, 1800);

    res.json({ ...resultado, source: 'computado' });

  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor', detalhes: erro.message });
  }
});

module.exports = router;
