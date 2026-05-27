/**
 * tests/unit/cache.test.js
 * ========================
 * Testes unitários para o módulo de cache Redis (services/cache.js).
 *
 * ESTRATÉGIA:
 * Os testes que dependem de Redis ativo (set/get/delete) são pulados
 * automaticamente quando o Redis não está disponível. Isso permite rodar
 * a suite em ambientes sem Redis (CI, máquinas Windows sem WSL) sem falsos
 * negativos — os testes de degradação graceful sempre rodam.
 *
 * TESTES INDEPENDENTES DE REDIS (sempre rodam):
 *   - isConnected() retorna boolean
 *   - get() sem Redis retorna null (não lança erro)
 *   - set() sem Redis não lança erro
 *
 * TESTES DEPENDENTES DE REDIS (pulam se offline):
 *   - set() + get() armazena e recupera valor
 *   - delete() remove a chave
 *
 * ISOLAMENTO:
 * Usa chave com timestamp único (CHAVE_TESTE) para não interferir com
 * dados reais no Redis. afterAll() limpa a chave de teste.
 */

const cache = require('../../src/services/cache');

describe('Serviço de Cache', () => {
  // Chave única por execução de teste para evitar colisões com dados reais
  const CHAVE_TESTE = `cache-test-${Date.now()}`;

  afterAll(async () => {
    // Limpeza: remove a chave de teste independente do resultado dos testes
    await cache.delete(CHAVE_TESTE);
  });

  // ── Testes independentes de conexão Redis ──────────────────────────────

  test('isConnected retorna boolean', () => {
    // Contrato mínimo: deve retornar true ou false, nunca undefined
    expect(typeof cache.isConnected()).toBe('boolean');
  });

  test('get retorna null para chave inexistente', async () => {
    // Comportamento esperado: chave não existe → null (não lança erro)
    const resultado = await cache.get(`chave-inexistente-${Date.now()}`);
    expect(resultado).toBeNull();
  });

  test('set sem Redis nao lanca erro', async () => {
    // Degradação graceful: set() sem conexão deve ser silencioso
    await expect(cache.set('qualquer-chave', { a: 1 })).resolves.not.toThrow();
  });

  test('get sem Redis retorna null (nao lanca erro)', async () => {
    // Degradação graceful: get() sem conexão deve retornar null silenciosamente
    await expect(cache.get('qualquer-chave')).resolves.toBe(null);
  });

  // ── Testes dependentes de Redis ativo ──────────────────────────────────

  test('set e get funcionam quando Redis disponivel', async () => {
    if (!cache.isConnected()) {
      console.warn('Redis indisponivel — teste pulado');
      return; // Pula graciosamente sem falha
    }
    const valor = { dados: 'teste', numero: 42 };
    await cache.set(CHAVE_TESTE, valor, 60); // TTL de 60s para teste
    const resultado = await cache.get(CHAVE_TESTE);
    // Verifica que o valor foi armazenado e recuperado corretamente
    expect(resultado).toEqual(valor);
  });

  test('delete remove chave do cache', async () => {
    if (!cache.isConnected()) {
      console.warn('Redis indisponivel — teste pulado');
      return;
    }
    // Garante que a chave existe antes de deletar
    await cache.set(CHAVE_TESTE, { x: 1 }, 60);
    await cache.delete(CHAVE_TESTE);
    // Após delete, get deve retornar null
    const resultado = await cache.get(CHAVE_TESTE);
    expect(resultado).toBeNull();
  });
});
