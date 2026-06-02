/**
 * components/ResultadosBusca.jsx
 * ================================
 * Renderiza o resultado de uma busca de recomendações.
 * Gerencia três estados distintos da UI:
 *
 *   1. dados === null → nenhuma busca foi feita ainda → não renderiza nada
 *   2. dados.total_recomendacoes === 0 → produto sem padrões de compra
 *   3. dados.total_recomendacoes > 0 → exibe grid de cards
 *
 * PROPS:
 *   dados → null | objeto retornado por GET /api/recomendacoes/:id:
 *   {
 *     produto: "BALM 120ML - FOX FOR MEN",
 *     total_recomendacoes: 3,
 *     recomendacoes: [{ nome, confianca, support, lift, descricao }],
 *     source: "cache" | "computado"
 *   }
 *
 * POR QUE o componente não faz a requisição à API diretamente?
 * Segue o padrão de "lifting state up" do React:
 * BuscadorProduto (filho) → faz fetch
 * Dashboard (pai) → mantém o estado em recomendacoes
 * ResultadosBusca (filho) → consome o estado via props
 * Isso desacopla a lógica de busca da exibição e facilita testar cada parte.
 *
 * POR QUE exibir o badge "(cache)"?
 * Transparência para o usuário sobre a origem dos dados.
 * Útil durante o TCC para demonstrar o funcionamento do Redis —
 * segunda busca do mesmo produto aparece com "(cache)".
 */

import CardRecomendacao from './CardRecomendacao';

export default function ResultadosBusca({ dados }) {
  // Estado 1: nenhuma busca feita ainda — não ocupa espaço na UI
  if (!dados) return null;

  // Estado 2: produto encontrado mas sem padrões de compra no dataset
  if (dados.total_recomendacoes === 0) {
    return (
      <div className="sem-resultados">
        <h3>Nenhuma recomendação encontrada</h3>
        <p>
          Não há padrões de compra suficientes para "{dados.produto}".
          Isso pode indicar que o produto raramente é comprado junto com outros,
          ou que o dataset ainda tem poucas transações para este produto.
        </p>
      </div>
    );
  }

  // Estado 3: recomendações encontradas — exibe grid de cards
  return (
    <div className="resultados-container">

      {/* Cabeçalho com nome do produto consultado */}
      <h2>
        Recomendações para: <strong>{dados.produto}</strong>
      </h2>

      {/* Linha de resumo com contagem e indicador de cache */}
      <p className="info-resumo">
        {dados.total_recomendacoes} recomendação(ões) encontrada(s)
        {dados.source === 'cache' && (
          // Badge verde exibido quando o resultado veio do Redis, não do cálculo
          <span className="badge-cache"> (cache)</span>
        )}
      </p>

      {/*
        Grid responsivo de cards.
        CSS usa auto-fit + minmax(270px, 1fr) para ajustar colunas
        automaticamente: 3 colunas no desktop, 1 coluna no mobile.
      */}
      <div className="cards-grid">
        {dados.recomendacoes.map((rec, idx) => (
          <CardRecomendacao
            key={idx}       // índice como key é aceitável — lista não é reordenada
            recomendacao={rec}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
