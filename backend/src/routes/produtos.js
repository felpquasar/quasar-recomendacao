/**
 * routes/produtos.js
 * ==================
 * Endpoint de busca parcial de produtos — alimenta o autocomplete do
 * frontend. Resolve a armadilha conhecida da Semana 6: a busca de
 * recomendações exigia o nome EXATO do produto. Agora o usuário digita
 * "balm" e recebe sugestões de produtos reais que pode selecionar.
 *
 * ENDPOINT: GET /api/produtos?q=<termo>
 *
 * QUERY PARAMS:
 *   q (string) - Termo parcial de busca. Mínimo 2 caracteres para evitar
 *                consultas excessivas a cada tecla digitada.
 *
 * RESPOSTA DE SUCESSO (200):
 *   {
 *     termo: "balm",
 *     total: 2,
 *     produtos: [
 *       { id, nome, categoria },
 *       ...
 *     ],
 *     source: "cache" | "computado"
 *   }
 *
 * Termo curto (< 2 chars) retorna lista vazia em vez de erro — o
 * autocomplete simplesmente não mostra sugestões enquanto o usuário
 * ainda está começando a digitar.
 *
 * CACHE: 10 min por termo. Sugestões de autocomplete mudam pouco e
 * são chamadas com alta frequência (a cada tecla) — cache reduz carga
 * no Supabase de forma significativa.
 */

const express = require('express');
const router = express.Router();
const { buscarProdutosPorTermo } = require('../models');
const cache = require('../services/cache');

const CACHE_PREFIX = 'prod:';
const MIN_TERMO = 2;

/**
 * GET /?q=<termo>
 * Retorna até 10 produtos cujo nome contém o termo (case-insensitive).
 */
router.get('/', async (req, res) => {
  try {
    const termo = (req.query.q || '').trim();

    // Termo muito curto: devolve vazio sem tocar no banco
    if (termo.length < MIN_TERMO) {
      return res.json({ termo, total: 0, produtos: [], source: 'computado' });
    }

    // Cache key normalizado em minúsculas — "Balm" e "balm" compartilham entrada
    const cacheKey = `${CACHE_PREFIX}${termo.toLowerCase()}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, source: 'cache' });
    }

    const produtos = await buscarProdutosPorTermo(termo, 10);

    const resultado = { termo, total: produtos.length, produtos };

    // Cache por 10 min (600s)
    await cache.set(cacheKey, resultado, 600);

    res.json({ ...resultado, source: 'computado' });

  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor', detalhes: erro.message });
  }
});

module.exports = router;
