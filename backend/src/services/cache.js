const redis = require('redis');

let client = null;
let connected = false;

async function conectar() {
  if (connected) return;

  client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

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
    console.warn('[Cache] Redis indisponivel, rodando sem cache:', err.message);
    connected = false;
  }
}

conectar();

const CACHE_TTL = 3600;

const cache = {
  get: async (key) => {
    if (!connected) return null;
    try {
      const valor = await client.get(key);
      return valor ? JSON.parse(valor) : null;
    } catch {
      return null;
    }
  },

  set: async (key, value, ttl = CACHE_TTL) => {
    if (!connected) return;
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch {
      // silencioso — cache e opcional
    }
  },

  delete: async (key) => {
    if (!connected) return;
    try {
      await client.del(key);
    } catch {
      // silencioso
    }
  },

  flush: async () => {
    if (!connected) return;
    try {
      await client.flushAll();
    } catch {
      // silencioso
    }
  },

  isConnected: () => connected,
};

module.exports = cache;
