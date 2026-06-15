/**
 * tests/integration/recomendacoes.test.js
 * =======================================
 * Testes de integração da rota GET /api/recomendacoes/:produtoId.
 *
 * Estratégia: o app Express é importado direto (sem subir servidor) e
 * exercitado com supertest. A camada de dados (models) e o cache (Redis)
 * são mockados — assim os testes rodam sem Supabase nem Redis, validando
 * apenas o comportamento HTTP da rota e sua integração com o algoritmo real
 * de Association Rules.
 */

const request = require('supertest');

// Mocka a camada de dados e o cache antes de importar o app
jest.mock('../../src/models');
jest.mock('../../src/services/cache');

const app = require('../../src/app');
const models = require('../../src/models');
const cache = require('../../src/services/cache');

/**
 * Dataset mock com padrão forte Fox Barba → Espuma.
 * Em 6 das 7 vendas com Fox Barba aparece Espuma junto → confidence alta,
 * garantindo que o algoritmo gere ao menos uma regra acima dos thresholds.
 */
const VENDAS_MOCK = [
  { id: 1, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 2, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 3, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 4, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 5, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Tonico' }] },
  { id: 6, itens: [{ nome_produto: 'Espuma' }, { nome_produto: 'Pente' }] },
  { id: 7, itens: [{ nome_produto: 'Pente' }] },
];

beforeEach(() => {
  jest.clearAllMocks();
  // Por padrão: cache sempre miss (força o caminho computado)
  cache.get.mockResolvedValue(null);
  cache.set.mockResolvedValue(undefined);
});

describe('GET /api/recomendacoes/:produtoId', () => {
  test('200 + recomendações quando há padrão', async () => {
    models.buscarVendas.mockResolvedValue(VENDAS_MOCK);

    const res = await request(app).get('/api/recomendacoes/Fox%20Barba');

    expect(res.statusCode).toBe(200);
    expect(res.body.produto).toBe('Fox Barba');
    expect(Array.isArray(res.body.recomendacoes)).toBe(true);
    expect(res.body.recomendacoes.length).toBeGreaterThan(0);
    expect(res.body.source).toBe('computado');
    // Espuma deve ser a recomendação principal
    expect(res.body.recomendacoes.map(r => r.nome)).toContain('Espuma');
  });

  test('grava resultado no cache após computar', async () => {
    models.buscarVendas.mockResolvedValue(VENDAS_MOCK);

    await request(app).get('/api/recomendacoes/Fox%20Barba');

    expect(cache.set).toHaveBeenCalledWith('rec:Fox Barba', expect.any(Object), 3600);
  });

  test('retorna do cache (source: cache) sem tocar nos models', async () => {
    cache.get.mockResolvedValue({ produto: 'Fox Barba', recomendacoes: [] });

    const res = await request(app).get('/api/recomendacoes/Fox%20Barba');

    expect(res.statusCode).toBe(200);
    expect(res.body.source).toBe('cache');
    expect(models.buscarVendas).not.toHaveBeenCalled();
  });

  test('400 quando não há vendas no banco', async () => {
    models.buscarVendas.mockResolvedValue([]);

    const res = await request(app).get('/api/recomendacoes/Fox%20Barba');

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/Nenhuma venda/);
  });

  test('200 + lista vazia para produto sem padrão', async () => {
    models.buscarVendas.mockResolvedValue(VENDAS_MOCK);

    const res = await request(app).get('/api/recomendacoes/ProdutoInexistente');

    expect(res.statusCode).toBe(200);
    expect(res.body.recomendacoes).toEqual([]);
    expect(res.body.total_recomendacoes).toBe(0);
  });

  test('500 quando models lança erro', async () => {
    models.buscarVendas.mockRejectedValue(new Error('Supabase down'));

    const res = await request(app).get('/api/recomendacoes/Fox%20Barba');

    expect(res.statusCode).toBe(500);
    expect(res.body.erro).toBe('Erro interno do servidor');
  });
});
