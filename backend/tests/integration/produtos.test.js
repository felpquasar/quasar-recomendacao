/**
 * tests/integration/produtos.test.js
 * ==================================
 * Testes de integração da rota GET /api/produtos?q=<termo> (autocomplete).
 * Models e cache mockados.
 */

const request = require('supertest');

jest.mock('../../src/models');
jest.mock('../../src/services/cache');

const app = require('../../src/app');
const models = require('../../src/models');
const cache = require('../../src/services/cache');

const RESULTADO_MOCK = [
  { id: 1, nome: 'Balm Pós-Barba', categoria: 'Barba' },
  { id: 2, nome: 'Balm Hidratante', categoria: 'Cabelo' },
];

beforeEach(() => {
  jest.clearAllMocks();
  cache.get.mockResolvedValue(null);
  cache.set.mockResolvedValue(undefined);
});

describe('GET /api/produtos', () => {
  test('200 + produtos para termo válido', async () => {
    models.buscarProdutosPorTermo.mockResolvedValue(RESULTADO_MOCK);

    const res = await request(app).get('/api/produtos?q=balm');

    expect(res.statusCode).toBe(200);
    expect(res.body.termo).toBe('balm');
    expect(res.body.total).toBe(2);
    expect(res.body.produtos).toHaveLength(2);
    expect(res.body.source).toBe('computado');
    expect(models.buscarProdutosPorTermo).toHaveBeenCalledWith('balm', 10);
  });

  test('termo curto (<2 chars) retorna vazio sem tocar no banco', async () => {
    const res = await request(app).get('/api/produtos?q=b');

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.produtos).toEqual([]);
    expect(models.buscarProdutosPorTermo).not.toHaveBeenCalled();
  });

  test('sem query param retorna vazio', async () => {
    const res = await request(app).get('/api/produtos');

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(0);
  });

  test('retorna do cache quando disponível', async () => {
    cache.get.mockResolvedValue({ termo: 'balm', total: 5, produtos: [] });

    const res = await request(app).get('/api/produtos?q=balm');

    expect(res.body.source).toBe('cache');
    expect(res.body.total).toBe(5);
    expect(models.buscarProdutosPorTermo).not.toHaveBeenCalled();
  });

  test('500 quando models lança erro', async () => {
    models.buscarProdutosPorTermo.mockRejectedValue(new Error('falha'));

    const res = await request(app).get('/api/produtos?q=balm');

    expect(res.statusCode).toBe(500);
    expect(res.body.erro).toBe('Erro interno do servidor');
  });
});
