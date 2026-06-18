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

  /**
   * validarLOOCV(vendas, topN)
   * Leave-One-Out Cross-Validation — adequada para datasets pequenos.
   *
   * Em vez de um único split 80/20, faz N rodadas: em cada rodada, uma
   * transação fica de fora (teste) e o algoritmo treina com TODAS as outras.
   * Assim cada transação é usada como teste exatamente uma vez e o modelo
   * sempre treina com o máximo de dados disponível (N-1 transações).
   *
   * Caso de teste por transação (modo "esconder 1 produto"):
   *   Para cada transação de teste com k >= 2 produtos, esconde 1 produto por
   *   vez e mostra os k-1 restantes como antecedentes. O algoritmo recomenda
   *   topN produtos; verifica-se se o produto escondido estava entre eles.
   *   Cada transação de k itens gera k sub-testes.
   *
   * @param {Array}  vendas - Todas as vendas no formato de buscarVendas()
   * @param {number} topN   - Máximo de recomendações por sub-teste (padrão 3)
   * @returns {Object} { precision_media, recall_media, f1_media, detalhes }
   */
  validarLOOCV(vendas, topN = 3) {
    const subTestes = [];

    for (let k = 0; k < vendas.length; k++) {
      const transacao = vendas[k];
      const itens = transacao.itens || [];
      // Produtos únicos da transação (a mesma cesta pode repetir produto)
      const produtos = [...new Set(itens.map(i => i.nome_produto))];
      if (produtos.length < 2) continue; // precisa de >=2 para esconder 1 e mostrar >=1

      // Treina com TODAS as transações menos a atual (leave-one-out)
      const treino = vendas.filter((_, idx) => idx !== k);
      const regras = calculateAssociation(treino, 0.30, 0.02);

      // Esconde cada produto por vez
      for (let h = 0; h < produtos.length; h++) {
        const escondido = produtos[h];
        const mostrados = produtos.filter((_, idx) => idx !== h);
        const mostradosSet = new Set(mostrados);

        // Recomendações: regras cujo antecedente está entre os mostrados e
        // cujo consequente o cliente ainda não tem na cesta visível.
        const candidatas = regras
          .filter(r => mostradosSet.has(r.antecedente) && !mostradosSet.has(r.consequente))
          .sort((a, b) => b.confidence - a.confidence);

        // Deduplica por consequente (mantém a de maior confidence) e pega topN
        const vistos = new Set();
        const recomendacoes = [];
        for (const r of candidatas) {
          if (vistos.has(r.consequente)) continue;
          vistos.add(r.consequente);
          recomendacoes.push(r);
          if (recomendacoes.length >= topN) break;
        }

        // Ground truth = o produto escondido
        const groundTruth = [escondido];
        const precision = this.calcularPrecision(recomendacoes, groundTruth);
        const recall = this.calcularRecall(recomendacoes, groundTruth);
        const f1 = this.calcularF1Score(precision, recall);

        subTestes.push({ transacao: transacao.id, escondido, precision, recall, f1 });
      }
    }

    if (subTestes.length === 0) {
      return {
        precision_media: 0,
        recall_media: 0,
        f1_media: 0,
        detalhes: { total_transacoes: vendas.length, sub_testes: 0, accuracy_por_subteste: [] },
      };
    }

    const media = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const transacoesAvaliadas = new Set(subTestes.map(s => s.transacao)).size;

    return {
      precision_media: parseFloat(media(subTestes.map(s => s.precision)).toFixed(4)),
      recall_media: parseFloat(media(subTestes.map(s => s.recall)).toFixed(4)),
      f1_media: parseFloat(media(subTestes.map(s => s.f1)).toFixed(4)),
      detalhes: {
        total_transacoes: vendas.length,
        transacoes_avaliadas: transacoesAvaliadas,
        sub_testes: subTestes.length,
        top_n: topN,
        accuracy_por_subteste: subTestes,
      },
    };
  }
}

module.exports = new ValidadorRecomendacoes();
