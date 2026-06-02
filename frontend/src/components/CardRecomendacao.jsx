export default function CardRecomendacao({ recomendacao, index }) {
  const confiancaPct = (recomendacao.confianca * 100).toFixed(1);
  const liftFormatado = recomendacao.lift?.toFixed(2) ?? '—';

  return (
    <div className="card-recomendacao">
      <div className="card-header">
        <span className="card-numero">#{index + 1}</span>
        <span className="card-titulo">{recomendacao.nome}</span>
      </div>

      <div className="card-metricas">
        <div className="metrica">
          <label>Confiança</label>
          <div className="barra-progresso">
            <div
              className="barra-valor"
              style={{ width: `${confiancaPct}%` }}
            />
          </div>
          <span className="valor">{confiancaPct}%</span>
        </div>

        <div className="metrica-row">
          <span>Support: <strong>{(recomendacao.support * 100).toFixed(1)}%</strong></span>
          <span>Lift: <strong>{liftFormatado}</strong></span>
        </div>
      </div>

      <p className="card-descricao">{recomendacao.descricao}</p>
    </div>
  );
}
