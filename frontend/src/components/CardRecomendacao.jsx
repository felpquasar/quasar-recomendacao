/**
 * components/CardRecomendacao.jsx
 * =================================
 * Card visual que exibe uma única regra de associação retornada pela API.
 * Mostra o produto recomendado e as métricas do algoritmo de forma visual.
 *
 * PROPS:
 *   recomendacao → objeto da API:
 *     { nome, confianca, support, lift, descricao }
 *   index → posição na lista (0-based), usado para exibir "#1", "#2", "#3"
 *
 * MÉTRICAS EXIBIDAS:
 *   Confiança  → barra de progresso colorida + valor percentual
 *                "Em X% das vezes que o cliente comprou A, também comprou B"
 *   Support    → percentual de transações que contêm ambos os produtos
 *   Lift       → fator de correlação. Lift > 1 = associação real (não aleatória)
 *
 * POR QUE barra de progresso para confiança?
 * Confiança é a métrica mais importante para o usuário final (vendedor).
 * A barra dá noção visual imediata da força da recomendação —
 * 75% vs 35% é mais fácil de ler visualmente do que dois números.
 *
 * POR QUE support e lift como texto simples?
 * São métricas técnicas para o TCC — importantes para a banca avaliar
 * a qualidade do algoritmo, mas secundárias para o vendedor no dia a dia.
 *
 * GRADIENTE DA BARRA:
 * Vai de dourado (#d4af37) a laranja (#ff6b35) — segue o tema Quasar Barber.
 * A largura é definida inline pois depende do valor dinâmico de confiancaPct.
 */

export default function CardRecomendacao({ recomendacao, index }) {
  // Converte confiança de decimal (0-1) para percentual com 1 casa decimal
  const confiancaPct = (recomendacao.confianca * 100).toFixed(1);

  // Lift pode ser ausente em versões antigas do backend — fallback para "—"
  const liftFormatado = recomendacao.lift?.toFixed(2) ?? '—';

  return (
    <div className="card-recomendacao">

      {/* Cabeçalho: badge com posição no ranking + nome do produto */}
      <div className="card-header">
        <span className="card-numero">#{index + 1}</span>
        <span className="card-titulo">{recomendacao.nome}</span>
      </div>

      <div className="card-metricas">

        {/* Barra de progresso da confiança — métrica principal */}
        <div className="metrica">
          <label>Confiança</label>
          <div className="barra-progresso">
            {/*
              width em % = confiança * 100.
              Exemplo: confiança 0.75 → barra ocupa 75% do container.
              Transição CSS (0.4s ease) anima a barra ao renderizar o card.
            */}
            <div
              className="barra-valor"
              style={{ width: `${confiancaPct}%` }}
            />
          </div>
          <span className="valor">{confiancaPct}%</span>
        </div>

        {/* Support e Lift em linha — métricas complementares */}
        <div className="metrica-row">
          <span>Support: <strong>{(recomendacao.support * 100).toFixed(1)}%</strong></span>
          <span>Lift: <strong>{liftFormatado}</strong></span>
        </div>
      </div>

      {/* Descrição gerada pelo backend: "Clientes que compraram A também compraram B (X%)" */}
      <p className="card-descricao">{recomendacao.descricao}</p>
    </div>
  );
}
