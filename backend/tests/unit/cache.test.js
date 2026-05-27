const cache = require('../../src/services/cache');

describe('Serviço de Cache', () => {
  const CHAVE_TESTE = `cache-test-${Date.now()}`;

  afterAll(async () => {
    await cache.delete(CHAVE_TESTE);
  });

  test('isConnected retorna boolean', () => {
    expect(typeof cache.isConnected()).toBe('boolean');
  });

  test('get retorna null para chave inexistente', async () => {
    const resultado = await cache.get(`chave-inexistente-${Date.now()}`);
    expect(resultado).toBeNull();
  });

  test('set e get funcionam quando Redis disponivel', async () => {
    if (!cache.isConnected()) {
      console.warn('Redis indisponivel — teste pulado');
      return;
    }
    const valor = { dados: 'teste', numero: 42 };
    await cache.set(CHAVE_TESTE, valor, 60);
    const resultado = await cache.get(CHAVE_TESTE);
    expect(resultado).toEqual(valor);
  });

  test('delete remove chave do cache', async () => {
    if (!cache.isConnected()) {
      console.warn('Redis indisponivel — teste pulado');
      return;
    }
    await cache.set(CHAVE_TESTE, { x: 1 }, 60);
    await cache.delete(CHAVE_TESTE);
    const resultado = await cache.get(CHAVE_TESTE);
    expect(resultado).toBeNull();
  });

  test('set sem Redis nao lanca erro', async () => {
    await expect(cache.set('qualquer-chave', { a: 1 })).resolves.not.toThrow();
  });

  test('get sem Redis retorna null (nao lanca erro)', async () => {
    await expect(cache.get('qualquer-chave')).resolves.toBe(null);
  });
});
