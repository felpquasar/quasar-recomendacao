/**
 * tests/integration/validacao.test.js
 * ===================================
 * Testes de integração da rota GET /api/validacao.
 * Usa o serviço de validação REAL (train/test split) sobre vendas mockadas;
 * apenas models e cache são mockados.
 */

const request = require('supertest');

jest.mock('../../src/models');
jest.mock('../../src/services/cache');

const app = require('../../src/app');
const models = require('../../src/models');
const cache = require('../../src/services/cache');

/**
 * 10 vendas: split 80/20 → 8 treino, 2 teste. Padrão forte Fox Barba → Espuma
 * no treino, e as transações de teste têm 2 itens (Fox Barba + Espuma) para
 * exercitar o cálculo de Precision/Recall com acerto.
 */
const VENDAS_MOCK = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }],
}));

beforeEach(() => {
  jest.clearAllMocks();
  cache.get.mockResolvedValue(null);
  cache.set.mockResolvedValue(undefined);
});

describe('GET /api/validacao', () => {
  test('200 + métricas Precision/Recall/F1', async () => {
    models.buscarVendas.mockResolvedValue(VENDAS_MOCK);

    const res = await request(app).get('/api/validacao');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('precision');
    expect(res.body).toHaveProperty('recall');
    expect(res.body).toHaveProperty('f1_score');
    expect(res.body.source).toBe('computado');
    // Padrão perfeito Fox→Espuma deve dar precision/recall = 1
    expect(res.body.precision).toBe(1);
    expect(res.body.recall).toBe(1);
  });

  test('retorna do cache quando disponível', async () => {
    cache.get.mockResolvedValue({ precision: 0.72, recall: 0.58, f1_score: 0.64 });

    const res = await request(app).get('/api/validacao');

    expect(res.body.source).toBe('cache');
    expect(res.body.precision).toBe(0.72);
    expect(models.buscarVendas).not.toHaveBeenCalled();
  });

  test('500 quando models lança erro', async () => {
    models.buscarVendas.mockRejectedValue(new Error('falha db'));

    const res = await request(app).get('/api/validacao');

    expect(res.statusCode).toBe(500);
    expect(res.body.erro).toBe('falha db');
  });
});

describe('App base', () => {
  test('GET /health retorna 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('rota inexistente retorna 404', async () => {
    const res = await request(app).get('/rota-que-nao-existe');
    expect(res.statusCode).toBe(404);
  });
});
