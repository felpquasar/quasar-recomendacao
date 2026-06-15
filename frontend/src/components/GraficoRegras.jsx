/**
 * components/GraficoRegras.jsx
 * ============================
 * Visualização gráfica das regras de associação descobertas pelo
 * algoritmo (Semana 7). Renderiza três gráficos a partir das
 * estatísticas já carregadas pelo Dashboard:
 *
 *   1. BARRAS   → Top 10 regras por confiança (quão forte é cada padrão)
 *   2. ROSCA    → Distribuição de produtos por categoria do catálogo
 *   3. DISPERSÃO→ Lift × Support de cada regra (separa o trivial do relevante)
 *
 * POR QUE react-chartjs-2 + chart.js?
 * Chart.js é a biblioteca de gráficos mais consolidada e leve para
 * dashboards; react-chartjs-2 é o wrapper React oficial. Precisamos
 * registrar explicitamente os "controllers" e "elements" que usamos
 * (tree-shaking) — Chart.js v4 não registra nada por padrão.
 *
 * PROPS:
 *   stats → objeto retornado por GET /api/estatisticas, contendo
 *           regras_top10[], regras_scatter[] e distribuicao_categorias{}.
 *           Se ausente/vazio, o componente exibe aviso em vez de quebrar.
 *
 * PALETA: dourado #d4af37 como acento, texto escuro sobre os cards brancos
 * do dashboard (tema claro do sistema).
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Scatter } from 'react-chartjs-2';

// Registro dos módulos do Chart.js efetivamente usados (v4 exige registro manual)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Tema visual reutilizado pelos três gráficos (cards brancos → texto escuro)
const DOURADO = '#b8941f';            // dourado mais escuro para contraste sobre branco
const DOURADO_TRANSP = 'rgba(212, 175, 55, 0.7)';
const TEXTO_CLARO = '#333';           // texto escuro legível no card branco
const GRID = 'rgba(0, 0, 0, 0.08)';

// Paleta para o gráfico de rosca (uma cor por categoria)
const CORES_CATEGORIA = ['#d4af37', '#c0843c', '#8a6d3b', '#e0c068', '#a0792e', '#6b5326'];

export default function GraficoRegras({ stats }) {
  // Guard: sem dados (backend offline ou dataset vazio) → não renderiza nada
  if (!stats) return null;

  const topRegras = stats.regras_top10 || stats.regras_top5 || [];
  const scatter = stats.regras_scatter || [];
  const categorias = stats.distribuicao_categorias || {};

  // ── Gráfico 1: barras horizontais de confiança das top regras ──
  const dadosBarras = {
    labels: topRegras.map(r => `${r.antecedente} → ${r.consequente}`),
    datasets: [{
      label: 'Confiança (%)',
      data: topRegras.map(r => +(r.confidence * 100).toFixed(1)),
      backgroundColor: DOURADO_TRANSP,
      borderColor: DOURADO,
      borderWidth: 1,
    }],
  };

  const opcoesBarras = {
    indexAxis: 'y', // barras horizontais — rótulos de regra ficam legíveis
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top regras por confiança', color: DOURADO, font: { size: 15 } },
      tooltip: {
        callbacks: {
          label: ctx => ` Confiança: ${ctx.parsed.x}%`,
        },
      },
    },
    scales: {
      x: { ticks: { color: TEXTO_CLARO }, grid: { color: GRID }, max: 100 },
      y: { ticks: { color: TEXTO_CLARO, font: { size: 10 } }, grid: { color: GRID } },
    },
  };

  // ── Gráfico 2: rosca da distribuição de produtos por categoria ──
  const labelsCategoria = Object.keys(categorias);
  const dadosRosca = {
    labels: labelsCategoria,
    datasets: [{
      data: labelsCategoria.map(c => categorias[c]),
      backgroundColor: labelsCategoria.map((_, i) => CORES_CATEGORIA[i % CORES_CATEGORIA.length]),
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  const opcoesRosca = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: TEXTO_CLARO } },
      title: { display: true, text: 'Produtos por categoria', color: DOURADO, font: { size: 15 } },
    },
  };

  // ── Gráfico 3: dispersão lift × support ──
  // Cada ponto é uma regra. Support no eixo X (frequência), Lift no Y (força).
  // Regras no canto superior são as mais valiosas: relevantes e frequentes.
  const dadosScatter = {
    datasets: [{
      label: 'Regras (lift × support)',
      data: scatter.map(r => ({
        x: +(r.support * 100).toFixed(2),
        y: +r.lift.toFixed(2),
        regra: `${r.antecedente} → ${r.consequente}`,
      })),
      backgroundColor: DOURADO_TRANSP,
      borderColor: DOURADO,
      pointRadius: 6,
      pointHoverRadius: 8,
    }],
  };

  const opcoesScatter = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Lift × Support (relevância das regras)', color: DOURADO, font: { size: 15 } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const p = ctx.raw;
            return [` ${p.regra}`, ` Support: ${p.x}%  Lift: ${p.y}`];
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Support (%)', color: TEXTO_CLARO }, ticks: { color: TEXTO_CLARO }, grid: { color: GRID } },
      y: { title: { display: true, text: 'Lift', color: TEXTO_CLARO }, ticks: { color: TEXTO_CLARO }, grid: { color: GRID } },
    },
  };

  return (
    <section className="graficos-section">
      <h2 className="graficos-titulo">Análise Visual das Regras</h2>

      {topRegras.length === 0 ? (
        <p className="graficos-vazio">Sem regras suficientes para gerar gráficos. Importe mais vendas.</p>
      ) : (
        <div className="graficos-grid">
          <div className="grafico-card grafico-largo">
            <Bar data={dadosBarras} options={opcoesBarras} />
          </div>
          <div className="grafico-card">
            <Doughnut data={dadosRosca} options={opcoesRosca} />
          </div>
          <div className="grafico-card">
            <Scatter data={dadosScatter} options={opcoesScatter} />
          </div>
        </div>
      )}
    </section>
  );
}
