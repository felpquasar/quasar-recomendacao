/**
 * services/validacao.js
 * =====================
 * Valida o algoritmo de Association Rules usando train/test split (80/20).
 * Calcula Precision, Recall e F1-Score para medir qualidade das recomendações.
 *
 * METODOLOGIA:
 *   80% das vendas → treino (calcular regras)
 *   20% das vendas → teste (verificar se recomendações batem com compras reais)
 *
 * MÉTRICAS:
 *   Precision = acertos / total_recomendacoes
 *               "Das recomendações feitas, quantas o cliente realmente comprou?"
 *
 *   Recall    = acertos / total_compras_reais
 *               "Das compras realizadas, quantas foram recomendadas?"
 *
 *   F1-Score  = 2 × (P × R) / (P + R)
 *               Média harmônica — penaliza sistemas com P ou R muito baixo.
 */

const { calculateAssociation } = require('./recomendacao');

class ValidadorRecomendacoes {

  /**
   * Calcula Precision para um conjunto de recomendações vs compras realizadas.
   * @param {Array} recomendacoes  - Regras filtradas: [{ consequente, ... }]
   * @param {Array} comprasRealizadas - Nomes dos produtos realmente comprados
   * @returns {number} Valor entre 0 e 1
   */
  calcularPrecision(recomendacoes, comprasRealizadas) {
    if (recomendacoes.length === 0) return 0;

    const acertos = recomendacoes.filter(rec =>
      comprasRealizadas.includes(rec.consequente)
    ).length;

    return acertos / recomendacoes.length;
  }

  /**
   * Calcula Recall para um conjunto de recomendações vs compras realizadas.
   * @param {Array} recomendacoes  - Regras filtradas: [{ consequente, ... }]
   * @param {Array} comprasRealizadas - Nomes dos produtos realmente comprados
   * @returns {number} Valor entre 0 e 1
   */
  calcularRecall(recomendacoes, comprasRealizadas) {
    if (comprasRealizadas.length === 0) return 0;

    const acertos = comprasRealizadas.filter(compra =>
      recomendacoes.some(rec => rec.consequente === compra)
    ).length;

    return acertos / comprasRealizadas.length;
  }

  /**
   * Calcula F1-Score: média harmônica entre Precision e Recall.
   * Penaliza mais quando um dos dois é muito baixo do que a média aritmética.
   * @param {number} precision
   * @param {number} recall
   * @returns {number} Valor entre 0 e 1
   */
  calcularF1Score(precision, recall) {
    if (precision === 0 && recall === 0) return 0;
    return (2 * (precision * recall)) / (precision + recall);
  }

  /**
   * Valida o algoritmo usando train/test split 80/20.
   * Para cada transação de teste: usa o primeiro produto como antecedente,
   * gera recomendações com as regras de treino, e compara com os demais
   * produtos da mesma transação (ground truth).
   *
   * @param {Array} vendas - Todas as vendas no formato de buscarVendas()
   * @returns {Object} { precision_media, recall_media, f1_media, detalhes }
   */
  validarComSplit(vendas) {
    const splitIndex = Math.floor(vendas.length * 0.8);
    const treino = vendas.slice(0, splitIndex);
    const teste = vendas.slice(splitIndex);

    // Calcula regras apenas com dados de treino
    const regras = calculateAssociation(treino, 0.30, 0.02);

    const accuracyPorTransacao = [];

    teste.forEach(transacao => {
      // Guard: ignora transações com menos de 2 itens (nada para validar)
      if (!transacao.itens || transacao.itens.length < 2) return;

      const produtosComprados = transacao.itens.map(i => i.nome_produto);
      const primeiroProduto = produtosComprados[0];
      const outrosProdutos = produtosComprados.slice(1); // ground truth

      const recomendacoes = regras.filter(r => r.antecedente === primeiroProduto);

      const precision = this.calcularPrecision(recomendacoes, outrosProdutos);
      const recall = this.calcularRecall(recomendacoes, outrosProdutos);
      const f1 = this.calcularF1Score(precision, recall);

      accuracyPorTransacao.push({
        transacao: transacao.id,
        precision,
        recall,
        f1,
      });
    });

    // Guard: sem transações válidas para testar
    if (accuracyPorTransacao.length === 0) {
      return {
        precision_media: 0,
        recall_media: 0,
        f1_media: 0,
        detalhes: { total_teste: teste.length, accuracy_por_transacao: [] },
      };
    }

    const media = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      precision_media: parseFloat(media(accuracyPorTransacao.map(m => m.precision)).toFixed(4)),
      recall_media: parseFloat(media(accuracyPorTransacao.map(m => m.recall)).toFixed(4)),
      f1_media: parseFloat(media(accuracyPorTransacao.map(m => m.f1)).toFixed(4)),
      detalhes: {
        total_treino: treino.length,
        total_teste: teste.length,
        transacoes_avaliadas: accuracyPorTransacao.length,
        accuracy_por_transacao: accuracyPorTransacao,
      },
    };
  }
}

module.exports = new ValidadorRecomendacoes();
