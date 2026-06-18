/**
 * pages/Dashboard.jsx
 * ====================
 * Página principal do sistema de recomendação. Exibe:
 *   - 4 KPI cards com métricas do algoritmo (vindas do backend)
 *   - Buscador de produtos para consultar recomendações
 *   - Grid de cards com os resultados da busca
 *
 * FLUXO DE DADOS:
 *   1. Ao montar, busca GET /api/estatisticas para os KPI cards
 *   2. Usuário digita produto → BuscadorProduto chama GET /api/recomendacoes/:id
 *   3. ResultadosBusca recebe os dados via estado local (recomendacoes)
 *
 * POR QUE useEffect para as stats?
 * As estatísticas são carregadas uma única vez ao montar o componente
 * (array de dependências vazio []). Não precisam ser recarregadas a cada
 * busca de produto — são dados agregados do dataset inteiro.
 *
 * ESTADO LOCAL:
 *   recomendacoes  → resultado da última busca (null = nenhuma busca feita)
 *   stats          → dados do /api/estatisticas (null enquanto carrega)
 *   loadingStats   → controla skeleton de loading dos KPI cards
 *   erroStats      → exibe mensagem se Supabase estiver offline
 */

import { useState, useEffect } from 'react';
import BuscadorProduto from '../components/BuscadorProduto';
import ResultadosBusca from '../components/ResultadosBusca';
import GraficoRegras from '../components/GraficoRegras';
import { recomendacaoService } from '../services/api';

export default function Dashboard() {
  const [recomendacoes, setRecomendacoes] = useState(null);
  const [stats, setStats] = useState(null);
  const [validacao, setValidacao] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [erroStats, setErroStats] = useState('');

  // Carrega estatísticas globais ao montar a página
  useEffect(() => {
    recomendacaoService.obterEstatisticas()
      .then((res) => setStats(res.data))
      .catch(() => setErroStats('Não foi possível carregar estatísticas. Verifique se o backend está rodando.'))
      .finally(() => setLoadingStats(false));

    // Métricas de qualidade (F1 via LOOCV) — carregadas em paralelo
    recomendacaoService.obterValidacao()
      .then((res) => setValidacao(res.data))
      .catch(() => setValidacao(null));
  }, []); // [] = executa só uma vez, na montagem

  return (
    <div className="dashboard-page">

      {/* ── Cabeçalho ── */}
      <header className="dashboard-header">
        <h1>Sistema de Recomendação</h1>
        <p className="subtitle">Quasar Barber — Análise Inteligente de Compras B2B</p>
      </header>

      {/* ── KPI Cards ── */}
      {/* Exibidos apenas após o carregamento das estatísticas do backend */}
      <section className="stats-section">
        {loadingStats && <p className="stats-loading">Carregando estatísticas...</p>}
        {erroStats && <p className="stats-erro">{erroStats}</p>}
        {!loadingStats && stats && (
          <div className="stats-container">

            {/* Total de transações usadas pelo algoritmo */}
            <div className="stat-card">
              <div className="stat-numero">{stats.total_vendas}</div>
              <div className="stat-label">Transações Analisadas</div>
            </div>

            {/* Total de produtos únicos no catálogo */}
            <div className="stat-card">
              <div className="stat-numero">{stats.total_produtos}</div>
              <div className="stat-label">Produtos Únicos</div>
            </div>

            {/* Regras de associação que passaram nos thresholds (confidence ≥ 30%, support ≥ 2%) */}
            <div className="stat-card">
              <div className="stat-numero">{stats.total_regras}</div>
              <div className="stat-label">Padrões Descobertos</div>
            </div>

            {/* F1-Score — métrica de qualidade do algoritmo (LOOCV, ver Cap. 3.6) */}
            <div className="stat-card destaque">
              <div className="stat-numero">
                {validacao && validacao.f1_score != null
                  ? validacao.f1_score.toFixed(2)
                  : '—'}
              </div>
              <div className="stat-label">F1-Score (LOOCV)</div>
            </div>
          </div>
        )}
      </section>

      {/* ── Área principal: busca + resultados ── */}
      <main className="main-container">
        {/*
          BuscadorProduto recebe um callback onRecomendacoes.
          Quando o usuário busca, o componente chama setRecomendacoes
          com os dados retornados pela API — isso re-renderiza ResultadosBusca.
        */}
        <BuscadorProduto onRecomendacoes={setRecomendacoes} />

        {/* Só renderiza se recomendacoes !== null (após pelo menos uma busca) */}
        <ResultadosBusca dados={recomendacoes} />

        {/* Gráficos das regras de associação (Semana 7) — usa as mesmas stats */}
        {!loadingStats && stats && <GraficoRegras stats={stats} />}
      </main>

      {/* ── Rodapé informativo ── */}
      <footer className="dashboard-footer">
        <p>Recomendações baseadas em Association Rules — TCC Felipe Pereira, 2026</p>
      </footer>
    </div>
  );
}
