/**
 * constants.js
 * ============
 * Centraliza todas as constantes de configuração do sistema de recomendação.
 * Alterar os valores aqui afeta o comportamento do algoritmo e do cache
 * em todo o backend sem precisar tocar em outros arquivos.
 */

/**
 * ALGORITHM_CONFIG
 * Parâmetros do algoritmo de Association Rules (Apriori simplificado).
 *
 * MIN_CONFIDENCE (0.30 = 30%)
 *   Confiança mínima para uma regra ser aceita.
 *   Exemplo: se "Fox Barba → Espuma" tem confiança 0.43, significa que
 *   em 43% das vezes que Fox Barba foi comprado, Espuma também foi.
 *   Valor baixo demais → muitas regras fracas; alto demais → poucas regras.
 *
 * MIN_SUPPORT (0.02 = 2%)
 *   Suporte mínimo: fração de transações que contém ambos os produtos.
 *   Filtra pares que aparecem raramente no dataset (evita over-fitting).
 *
 * MIN_LIFT (1.0)
 *   Lift mínimo (não aplicado no filtro atual, reservado para evolução).
 *   Lift > 1 significa que os produtos aparecem juntos mais do que por acaso.
 *
 * TOP_N (3)
 *   Quantidade máxima de recomendações retornadas por produto.
 *   Mantido em 3 para não sobrecarregar a UI e manter relevância.
 */
const ALGORITHM_CONFIG = {
  MIN_CONFIDENCE: 0.30,
  MIN_SUPPORT: 0.02,
  MIN_LIFT: 1.0,
  TOP_N: 3,
};

/**
 * CACHE_TTL
 * Tempo de vida padrão para entradas no Redis, em segundos.
 * 3600s = 1 hora. Usado como default em cache.set() quando não especificado.
 * O endpoint de estatísticas usa TTL próprio de 1800s (30 min) por ser
 * calculado sobre dados que mudam com mais frequência.
 */
const CACHE_TTL = 3600;

module.exports = { ALGORITHM_CONFIG, CACHE_TTL };
