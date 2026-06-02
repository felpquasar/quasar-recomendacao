import CardRecomendacao from './CardRecomendacao';

export default function ResultadosBusca({ dados }) {
  if (!dados) return null;

  if (dados.total_recomendacoes === 0) {
    return (
      <div className="sem-resultados">
        <h3>Nenhuma recomendação encontrada</h3>
        <p>Não há padrões de compra suficientes para "{dados.produto}".</p>
      </div>
    );
  }

  return (
    <div className="resultados-container">
      <h2>
        Recomendações para: <strong>{dados.produto}</strong>
      </h2>

      <p className="info-resumo">
        {dados.total_recomendacoes} recomendação(ões) encontrada(s)
        {dados.source === 'cache' && <span className="badge-cache"> (cache)</span>}
      </p>

      <div className="cards-grid">
        {dados.recomendacoes.map((rec, idx) => (
          <CardRecomendacao key={idx} recomendacao={rec} index={idx} />
        ))}
      </div>
    </div>
  );
}
