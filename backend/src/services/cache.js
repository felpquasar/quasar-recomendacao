/**
 * services/cache.js
 * =================
 * Camada de cache usando Redis. Implementada com degradação graceful:
 * se o Redis estiver indisponível (ex: ambiente sem Redis local),
 * o sistema continua funcionando normalmente — apenas sem cache.
 *
 * POR QUE CACHE?
 * O algoritmo calculateAssociation() é O(n * p²) e processa todas as
 * transações a cada request. Com 500 transações e 20 produtos, isso leva
 * ~100-500ms. O cache armazena o resultado por 1 hora, reduzindo a
 * latência de chamadas subsequentes de ~500ms para <10ms.
 *
 * ESTRATÉGIA DE CHAVES:
 *   rec:<nomeProduto>   → recomendações para um produto (TTL: 3600s)
 *   stats:global        → estatísticas globais do sistema (TTL: 1800s)
 *
 * REDIS LOCAL vs UPSTASH:
 * Em desenvolvimento Windows, Redis não vem instalado. Pode-se usar:
 *   - Redis local via WSL2: `wsl -e redis-server`
 *   - Upstash (cloud gratuito): https://upstash.com → cria DB → copia REDIS_URL
 * Sem Redis, os testes pulam os casos que precisam de conexão ativa.
 */

const redis = require('redis');

// Estado de conexão mantido em módulo para ser compartilhado entre imports
let client = null;
let connected = false;

/**
 * conectar()
 * Inicializa o cliente Redis e tenta conectar ao servidor configurado
 * em REDIS_URL. Chamada automaticamente ao importar o módulo.
 * Falhas de conexão são logadas como warning, não como erro fatal.
 */
async function conectar() {
  if (connected) return;

  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  // Listener de erro: evita crash no processo quando Redis cai em produção
  client.on('error', (err) => {
    if (connected) console.warn('[Cache] Redis desconectado:', err.message);
    connected = false;
  });

  client.on('connect', () => {
    connected = true;
    console.log('[Cache] Redis conectado');
  });

  try {
    await client.connect();
  } catch (err) {
    // Redis indisponível — sistema degrada para modo sem cache
    console.warn('[Cache] Redis indisponivel, rodando sem cache:', err.message);
    connected = false;
  }
}

// Conecta imediatamente ao importar o módulo
conectar();

const CACHE_TTL = 3600; // 1 hora em segundos (padrão)

const cache = {
  /**
   * get(key)
   * Recupera um valor do cache. Desserializa o JSON armazenado.
   * Retorna null se a chave não existir, expirou, ou Redis está offline.
   *
   * @param {string} key - Chave de cache (ex: "rec:Fox Barba")
   * @returns {any|null} Valor desserializado ou null
   */
  get: async (key) => {
    if (!connected) return null; // Degradação graceful
    try {
      const valor = await client.get(key);
      return valor ? JSON.parse(valor) : null;
    } catch {
      // Erros de rede não devem quebrar a API
      return null;
    }
  },

  /**
   * set(key, value, ttl)
   * Armazena um valor no cache serializado como JSON com tempo de expiração.
   * Usa SETEX (SET + EXPIRE em comando atômico) para garantir que o TTL
   * nunca deixe uma chave órfã sem expiração.
   *
   * @param {string} key   - Chave de cache
   * @param {any}    value - Valor a armazenar (será serializado em JSON)
   * @param {number} ttl   - Tempo de vida em segundos (padrão: 3600)
   */
  set: async (key, value, ttl = CACHE_TTL) => {
    if (!connected) return; // Degradação graceful
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch {
      // Falha silenciosa — cache é opcional, não crítico
    }
  },

  /**
   * delete(key)
   * Remove uma chave específica do cache.
   * Usado para invalidar cache de um produto após atualização de dados.
   *
   * @param {string} key - Chave a remover
   */
  delete: async (key) => {
    if (!connected) return;
    try {
      await client.del(key);
    } catch {
      // Silencioso
    }
  },

  /**
   * flush()
   * Limpa TODO o cache do Redis (FLUSHALL).
   * Usar com cuidado em produção — apaga dados de outros keyspaces se
   * o Redis for compartilhado. Útil para forçar recálculo completo.
   */
  flush: async () => {
    if (!connected) return;
    try {
      await client.flushAll();
    } catch {
      // Silencioso
    }
  },

  /**
   * isConnected()
   * Retorna o estado atual da conexão Redis.
   * Usado nos testes para pular casos que dependem de Redis ativo.
   *
   * @returns {boolean} true se Redis está conectado e operacional
   */
  isConnected: () => connected,
};

module.exports = cache;
