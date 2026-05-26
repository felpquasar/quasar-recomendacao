const ALGORITHM_CONFIG = {
  MIN_CONFIDENCE: 0.30,
  MIN_SUPPORT: 0.02,
  MIN_LIFT: 1.0,
  TOP_N: 3
};

const CACHE_TTL = 3600; // 1 hora em segundos

module.exports = { ALGORITHM_CONFIG, CACHE_TTL };
