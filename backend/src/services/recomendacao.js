/**
 * services/recomendacao.js
 * ========================
 * Coração do TCC: implementação do algoritmo de Association Rules
 * (versão simplificada do Apriori) para recomendação de produtos B2B.
 *
 * CONCEITO — Market Basket Analysis:
 * Dado um histórico de transações (vendas), o algoritmo encontra padrões
 * do tipo "quem compra A tende a comprar B". Para cada par de produtos
 * (A → B), calcula três métricas:
 *
 *   Support    = freq(A ∩ B) / total_transações
 *                Quão comum é esse par no dataset. Filtra pares raros.
 *
 *   Confidence = freq(A ∩ B) / freq(A)
 *                Dado que A foi comprado, qual a probabilidade de B
 *                também ter sido comprado? É a força da regra.
 *
 *   Lift       = confidence(A→B) / support(B)
 *                Lift > 1 significa correlação positiva (não é coincidência).
 *                Lift = 1 significa independência. Lift < 1 = correlação negativa.
 *
 * COMPLEXIDADE:
 *   O algoritmo é O(n * p²) onde n = transações e p = produtos únicos.
 *   Com ~500 transações e ~20 produtos: ~200.000 operações — aceitável.
 *   Para datasets maiores (>10.000 transações, >100 produtos) seria necessário
 *   usar o Apriori com poda por suporte mínimo para reduzir o espaço de busca.
 *   O cache Redis (Semana 4) mitiga o custo recalculando apenas 1x por hora.
 */

/**
 * extrairProdutosUnicos(vendas)
 * Percorre todas as vendas e coleta os nomes de produtos únicos em um Set.
 * Um Set garante unicidade automaticamente — não precisa checar duplicatas.
 *
 * @param {Array} vendas - Array de objetos { id, itens: [{ nome_produto }] }
 * @returns {Set<string>} Conjunto de nomes de produtos únicos
 */
function extrairProdutosUnicos(vendas) {
  const produtos = new Set();
  vendas.forEach(venda => {
    // Guard: ignora vendas malformadas sem array de itens
    if (venda.itens && Array.isArray(venda.itens)) {
      venda.itens.forEach(item => produtos.add(item.nome_produto));
    }
  });
  return produtos;
}

/**
 * calculateAssociation(vendas, minConfidence, minSupport)
 * Algoritmo principal: gera todas as regras A → B que atendem aos
 * thresholds mínimos de confiança e suporte.
 *
 * FLUXO:
 *   1. Extrai produtos únicos → lista de candidatos
 *   2. Para cada par (A, B) onde A ≠ B:
 *      a. Conta transações com A (freq_A)
 *      b. Conta transações com A e B (freq_AB)
 *      c. Calcula confidence = freq_AB / freq_A
 *      d. Calcula support = freq_AB / total
 *      e. Se ambos >= threshold, calcula lift e adiciona regra
 *   3. Ordena por confidence decrescente
 *
 * @param {Array}  vendas        - Transações no formato de buscarVendas()
 * @param {number} minConfidence - Confiança mínima (padrão: 0.30)
 * @param {number} minSupport    - Suporte mínimo (padrão: 0.02)
 * @returns {Array} Regras ordenadas por confidence desc:
 *   [{ antecedente, consequente, confidence, support, lift, frequencia }]
 */
function calculateAssociation(vendas, minConfidence = 0.30, minSupport = 0.02) {
  const regras = [];
  const totalTransacoes = vendas.length;

  // Guard: dataset vazio retorna array vazio sem processamento
  if (totalTransacoes === 0) return regras;

  const produtos = extrairProdutosUnicos(vendas);
  const produtosArray = Array.from(produtos);

  // Duplo laço gera todos os pares ordenados (A→B ≠ B→A)
  for (let i = 0; i < produtosArray.length; i++) {
    for (let j = 0; j < produtosArray.length; j++) {
      if (i === j) continue; // Produto não recomenda a si mesmo

      const produtoA = produtosArray[i]; // antecedente (o que foi comprado)
      const produtoB = produtosArray[j]; // consequente (o que recomendar)

      // Filtra transações que contêm o produto A
      const transacoesComA = vendas.filter(v =>
        v.itens?.some(item => item.nome_produto === produtoA)
      );

      // Das transações com A, filtra as que também têm B
      const transacoesComAeB = transacoesComA.filter(v =>
        v.itens?.some(item => item.nome_produto === produtoB)
      );

      // Evita divisão por zero se o produto A nunca apareceu
      if (transacoesComA.length === 0) continue;

      // Métricas principais
      const confidence = transacoesComAeB.length / transacoesComA.length;
      const support = transacoesComAeB.length / totalTransacoes;

      // Aplica filtros de threshold — descarta regras fracas
      if (confidence >= minConfidence && support >= minSupport) {
        // Lift exige o support isolado de B para o cálculo
        const transacoesComB = vendas.filter(v =>
          v.itens?.some(item => item.nome_produto === produtoB)
        );
        const supportB = transacoesComB.length / totalTransacoes;

        // Lift = confidence / P(B) — valores > 1 indicam associação real
        const lift = supportB > 0 ? confidence / supportB : 0;

        regras.push({
          antecedente: produtoA,
          consequente: produtoB,
          confidence: parseFloat(confidence.toFixed(4)),
          support: parseFloat(support.toFixed(4)),
          lift: parseFloat(lift.toFixed(4)),
          frequencia: transacoesComAeB.length, // count absoluto (útil para debug)
        });
      }
    }
  }

  // Ordena por confidence desc para que obterRecomendacoes() só precise .slice()
  return regras.sort((a, b) => b.confidence - a.confidence);
}

/**
 * obterRecomendacoes(produtoNome, regras, topN)
 * Filtra as regras pré-calculadas para um produto específico e retorna
 * as topN melhores recomendações (já ordenadas por confidence desc pelo
 * calculateAssociation).
 *
 * Separar este passo do cálculo permite reaproveitar o mesmo array de
 * regras para múltiplos produtos sem recalcular — útil para batch queries.
 *
 * @param {string} produtoNome - Nome exato do produto antecedente
 * @param {Array}  regras      - Output de calculateAssociation()
 * @param {number} topN        - Máximo de recomendações (padrão: 3)
 * @returns {Array} Top N regras onde antecedente === produtoNome
 */
function obterRecomendacoes(produtoNome, regras, topN = 3) {
  return regras
    .filter(r => r.antecedente === produtoNome)
    .slice(0, topN);
}

module.exports = { calculateAssociation, obterRecomendacoes, extrairProdutosUnicos };
