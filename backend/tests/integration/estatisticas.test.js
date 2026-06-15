/**
 * tests/integration/estatisticas.test.js
 * ======================================
 * Testes de integração da rota GET /api/estatisticas.
 * Models e cache mockados — valida estrutura da resposta de KPIs e
 * agregações (top5/top10/scatter/distribuição de categorias).
 */

const request = require('supertest');

jest.mock('../../src/models');
jest.mock('../../src/services/cache');

const app = require('../../src/app');
const models = require('../../src/models');
const cache = require('../../src/services/cache');

const VENDAS_MOCK = [
  { id: 1, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 2, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 3, itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { id: 4, itens: [{ nome_produto: 'Espuma' }, { nome_produto: 'Pente' }] },
];

const PRODUTOS_MOCK = [
  { id: 1, nome: 'Fox Barba', categoria: 'Barba' },
  { id: 2, nome: 'Espuma', categoria: 'Barba' },
  { id: 3, nome: 'Pente', categoria: 'Acessórios' },
];

beforeEach(() => {
  jest.clearAllMocks();
  cache.get.mockResolvedValue(null);
  cache.set.mockResolvedValue(undefined);
});

describe('GET /api/estatisticas', () => {
  test('200 + estrutura completa de métricas', async () => {
    models.buscarVendas.mockResolvedValue(VENDAS_MOCK);
    models.buscarProdutos.mockResolvedValue(PRODUTOS_MOCK);

    const res = await request(app).get('/api/estatisticas');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      total_vendas: 4,
      total_produtos: 3,
      source: 'computado',
    });
    expect(typeof res.body.confianca_media).toBe('number');
    expect(typeof res.body.support_medio).toBe('number');
    expect(Array.isArray(res.body.regras_top5)).toBe(true);
    expect(Array.isArray(res.body.regras_top10)).toBe(true);
    expect(Array.isArray(res.body.regras_scatter)).toBe(true);
    // Distribuição: 2 produtos Barba, 1 Acessórios
    expect(res.body.distribuicao_categorias).toEqual({ Barba: 2, 'Acessórios': 1 });
  });

  test('retorna do cache quando disponível', async () => {
    cache.get.mockResolvedValue({ total_vendas: 99 });

    const res = await request(app).get('/api/estatisticas');

    expect(res.body.source).toBe('cache');
    expect(res.body.total_vendas).toBe(99);
    expect(models.buscarVendas).not.toHaveBeenCalled();
  });

  test('500 quando models lança erro', async () => {
    models.buscarVendas.mockRejectedValue(new Error('falha'));
    models.buscarProdutos.mockResolvedValue(PRODUTOS_MOCK);

    const res = await request(app).get('/api/estatisticas');

    expect(res.statusCode).toBe(500);
    expect(res.body.erro).toBe('Erro interno do servidor');
  });
});
