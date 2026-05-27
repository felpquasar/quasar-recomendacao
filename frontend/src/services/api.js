import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

export const recomendacaoService = {
  obterRecomendacoes: (produtoId) =>
    api.get(`/api/recomendacoes/${encodeURIComponent(produtoId)}`),
  obterEstatisticas: () =>
    api.get('/api/estatisticas'),
};

export default api;
