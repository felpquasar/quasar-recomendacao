import { useState, useEffect } from 'react';
import BuscadorProduto from '../components/BuscadorProduto';
import ResultadosBusca from '../components/ResultadosBusca';
import { recomendacaoService } from '../services/api';

export default function Dashboard() {
  const [recomendacoes, setRecomendacoes] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [erroStats, setErroStats] = useState('');

  useEffect(() => {
    recomendacaoService.obterEstatisticas()
      .then((res) => setStats(res.data))
      .catch(() => setErroStats('Não foi possível carregar estatísticas'))
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Sistema de Recomendação</h1>
        <p className="subtitle">Quasar Barber — Análise Inteligente de Compras B2B</p>
      </header>

      <section className="stats-section">
        {loadingStats && <p className="stats-loading">Carregando estatísticas...</p>}
        {erroStats && <p className="stats-erro">{erroStats}</p>}
        {!loadingStats && stats && (
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-numero">{stats.total_vendas}</div>
              <div className="stat-label">Transações Analisadas</div>
            </div>
            <div className="stat-card">
              <div className="stat-numero">{stats.total_produtos}</div>
              <div className="stat-label">Produtos Únicos</div>
            </div>
            <div className="stat-card">
              <div className="stat-numero">{stats.total_regras}</div>
              <div className="stat-label">Padrões Descobertos</div>
            </div>
            <div className="stat-card destaque">
              <div className="stat-numero">
                {stats.precision != null
                  ? `${(stats.precision * 100).toFixed(1)}%`
                  : `${(stats.f1_score * 100).toFixed(1)}%`}
              </div>
              <div className="stat-label">
                {stats.precision != null ? 'Precisão' : 'F1-Score'}
              </div>
            </div>
          </div>
        )}
      </section>

      <main className="main-container">
        <BuscadorProduto onRecomendacoes={setRecomendacoes} />
        <ResultadosBusca dados={recomendacoes} />
      </main>

      <footer className="dashboard-footer">
        <p>Recomendações baseadas em Association Rules — TCC Felipe Pereira, 2026</p>
      </footer>
    </div>
  );
}
