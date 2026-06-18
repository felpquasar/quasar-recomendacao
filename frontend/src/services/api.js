/**
 * frontend/src/services/api.js
 * ============================
 * Cliente HTTP centralizado para comunicação com o backend Express.
 * Usa axios com configuração de baseURL e timeout para todas as requisições.
 *
 * POR QUE CENTRALIZAR?
 * Em vez de criar instâncias axios em cada componente, um único cliente
 * garante: baseURL consistente, timeout padrão, e um ponto único para
 * adicionar interceptors (ex: headers de auth, retry logic) no futuro.
 *
 * PROXY DO VITE:
 * Em desenvolvimento, o Vite proxy redireciona /api/* para localhost:3000.
 * Em produção, VITE_API_URL deve apontar para o domínio real do backend.
 *
 * SERVIÇOS DISPONÍVEIS:
 *   recomendacaoService.obterRecomendacoes(produtoId)
 *     → GET /api/recomendacoes/:produtoId
 *     → Retorna { produto, total_recomendacoes, recomendacoes[], source }
 *
 *   recomendacaoService.obterEstatisticas()
 *     → GET /api/estatisticas
 *     → Retorna { total_vendas, total_produtos, total_regras, regras_top5[] }
 */

import axios from 'axios';

// Lê a URL base do backend das variáveis de ambiente do Vite
// Em dev: http://localhost:3000 | Em prod: URL do deploy (ex: Railway)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Instância axios com configuração global
const api = axios.create({
  baseURL: API_URL,
  // Timeout configurável via .env — padrão 10s para evitar requests pendurados
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

/**
 * recomendacaoService
 * Agrupa todos os endpoints relacionados a recomendações e estatísticas.
 * encodeURIComponent() é necessário para produtos com espaços e acentos
 * no nome (ex: "Fox For Men Barba" → "Fox%20For%20Men%20Barba").
 */
export const recomendacaoService = {
  // Busca recomendações para um produto específico pelo nome
  obterRecomendacoes: (produtoId) =>
    api.get(`/api/recomendacoes/${encodeURIComponent(produtoId)}`),

  // Busca métricas globais do sistema (total de vendas, produtos, regras)
  obterEstatisticas: () =>
    api.get('/api/estatisticas'),

  // Busca parcial de produtos para o autocomplete (GET /api/produtos?q=)
  // Usa o parâmetro params do axios para montar a query string com encoding correto
  buscarProdutos: (termo) =>
    api.get('/api/produtos', { params: { q: termo } }),

  // Métricas de qualidade do algoritmo (Precision, Recall, F1) via LOOCV
  obterValidacao: () =>
    api.get('/api/validacao'),
};

export default api;
