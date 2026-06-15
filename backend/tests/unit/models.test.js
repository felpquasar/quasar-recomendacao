/**
 * tests/unit/models.test.js
 * =========================
 * Testes unitários da camada de dados (models/index.js).
 *
 * O cliente Supabase é mockado por um query builder encadeável falso
 * (makeBuilder): cada método de query (select/eq/ilike/order/limit/single)
 * retorna o próprio builder, e o builder é "thenable" — resolve para o
 * { data, error } configurado quando aguardado com await. Isso permite
 * testar a lógica de transformação/agrupamento dos models sem banco real.
 */

// Resultado que o próximo from(...).<chain> deve resolver.
// Prefixo "mock" exigido pelo jest para ser acessível dentro do factory hoisted.
let mockNextResult = { data: [], error: null };

// Mocka a conexão antes de importar os models. makeBuilder fica DENTRO do
// factory porque jest.mock é hoisted e não pode referenciar escopo externo.
jest.mock('../../src/database/connection', () => {
  /**
   * Builder encadeável e thenable que resolve para `result`.
   * Suporta `await from().select()` e cadeias longas
   * `from().select().eq().ilike().order().limit().single()`.
   */
  function makeBuilder(result) {
    const builder = {
      select: () => builder,
      eq: () => builder,
      ilike: () => builder,
      order: () => builder,
      limit: () => builder,
      single: () => builder,
      then: (resolve) => resolve(result),
    };
    return builder;
  }
  return {
    supabase: { from: jest.fn(() => makeBuilder(mockNextResult)) },
  };
});

const { supabase } = require('../../src/database/connection');
const {
  buscarVendas,
  buscarProdutos,
  buscarProduto,
  buscarProdutosPorTermo,
} = require('../../src/models');

beforeEach(() => {
  supabase.from.mockClear();
  mockNextResult = { data: [], error: null };
});

describe('buscarVendas', () => {
  test('agrupa itens por venda_id no formato do algoritmo', async () => {
    mockNextResult = {
      data: [
        { venda_id: 1, quantidade: 2, valor_unitario: 10, qb_produtos: { id: 9, nome: 'Fox Barba', categoria: 'Barba' } },
        { venda_id: 1, quantidade: 1, valor_unitario: 5, qb_produtos: { id: 8, nome: 'Espuma', categoria: 'Barba' } },
        { venda_id: 2, quantidade: 1, valor_unitario: 7, qb_produtos: { id: 7, nome: 'Pente', categoria: 'Acessórios' } },
      ],
      error: null,
    };

    const vendas = await buscarVendas();

    expect(supabase.from).toHaveBeenCalledWith('qb_itens_venda');
    expect(vendas).toHaveLength(2);
    const venda1 = vendas.find(v => v.id === 1);
    expect(venda1.itens).toHaveLength(2);
    expect(venda1.itens[0]).toMatchObject({ nome_produto: 'Fox Barba', produto_id: 9, categoria: 'Barba' });
  });

  test('lança erro quando Supabase retorna error', async () => {
    mockNextResult = { data: null, error: { message: 'connection refused' } };
    await expect(buscarVendas()).rejects.toThrow('connection refused');
  });
});

describe('buscarProdutos', () => {
  test('retorna produtos ativos', async () => {
    mockNextResult = { data: [{ id: 1, nome: 'Espuma', ativo: true }], error: null };
    const produtos = await buscarProdutos();
    expect(supabase.from).toHaveBeenCalledWith('qb_produtos');
    expect(produtos).toHaveLength(1);
  });

  test('lança erro em falha de query', async () => {
    mockNextResult = { data: null, error: { message: 'boom' } };
    await expect(buscarProdutos()).rejects.toThrow('boom');
  });
});

describe('buscarProduto', () => {
  test('retorna o produto encontrado', async () => {
    mockNextResult = { data: { id: 1, nome: 'Fox For Men Barba' }, error: null };
    const produto = await buscarProduto('fox');
    expect(produto.nome).toBe('Fox For Men Barba');
  });

  test('retorna null quando não encontra (single lança error)', async () => {
    mockNextResult = { data: null, error: { message: 'no rows' } };
    const produto = await buscarProduto('inexistente');
    expect(produto).toBeNull();
  });
});

describe('buscarProdutosPorTermo', () => {
  test('retorna lista de sugestões', async () => {
    mockNextResult = {
      data: [{ id: 1, nome: 'Balm A' }, { id: 2, nome: 'Balm B' }],
      error: null,
    };
    const produtos = await buscarProdutosPorTermo('balm', 10);
    expect(produtos).toHaveLength(2);
  });

  test('retorna array vazio quando data é null', async () => {
    mockNextResult = { data: null, error: null };
    const produtos = await buscarProdutosPorTermo('xyz');
    expect(produtos).toEqual([]);
  });

  test('lança erro em falha de query', async () => {
    mockNextResult = { data: null, error: { message: 'fail' } };
    await expect(buscarProdutosPorTermo('balm')).rejects.toThrow('fail');
  });
});
