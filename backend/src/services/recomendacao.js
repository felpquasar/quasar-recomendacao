function extrairProdutosUnicos(vendas) {
  const produtos = new Set();
  vendas.forEach(venda => {
    if (venda.itens && Array.isArray(venda.itens)) {
      venda.itens.forEach(item => produtos.add(item.nome_produto));
    }
  });
  return produtos;
}

function calculateAssociation(vendas, minConfidence = 0.30, minSupport = 0.02) {
  const regras = [];
  const totalTransacoes = vendas.length;

  if (totalTransacoes === 0) return regras;

  const produtos = extrairProdutosUnicos(vendas);
  const produtosArray = Array.from(produtos);

  for (let i = 0; i < produtosArray.length; i++) {
    for (let j = 0; j < produtosArray.length; j++) {
      if (i === j) continue;

      const produtoA = produtosArray[i];
      const produtoB = produtosArray[j];

      const transacoesComA = vendas.filter(v =>
        v.itens?.some(item => item.nome_produto === produtoA)
      );

      const transacoesComAeB = transacoesComA.filter(v =>
        v.itens?.some(item => item.nome_produto === produtoB)
      );

      if (transacoesComA.length === 0) continue;

      const confidence = transacoesComAeB.length / transacoesComA.length;
      const support = transacoesComAeB.length / totalTransacoes;

      if (confidence >= minConfidence && support >= minSupport) {
        const transacoesComB = vendas.filter(v =>
          v.itens?.some(item => item.nome_produto === produtoB)
        );
        const supportB = transacoesComB.length / totalTransacoes;
        const lift = supportB > 0 ? confidence / supportB : 0;

        regras.push({
          antecedente: produtoA,
          consequente: produtoB,
          confidence: parseFloat(confidence.toFixed(4)),
          support: parseFloat(support.toFixed(4)),
          lift: parseFloat(lift.toFixed(4)),
          frequencia: transacoesComAeB.length,
        });
      }
    }
  }

  return regras.sort((a, b) => b.confidence - a.confidence);
}

function obterRecomendacoes(produtoNome, regras, topN = 3) {
  return regras
    .filter(r => r.antecedente === produtoNome)
    .slice(0, topN);
}

module.exports = { calculateAssociation, obterRecomendacoes, extrairProdutosUnicos };
