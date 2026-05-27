const {
  calculateAssociation,
  obterRecomendacoes,
  extrairProdutosUnicos,
} = require('../../src/services/recomendacao');

const vendas_mock = [
  { itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Tônico' }] },
  { itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },
  { itens: [{ nome_produto: 'Espuma' }, { nome_produto: 'Condicionador' }] },
  { itens: [{ nome_produto: 'Pente' }] },
];

describe('extrairProdutosUnicos', () => {
  test('retorna set com todos os produtos', () => {
    const produtos = extrairProdutosUnicos(vendas_mock);
    expect(produtos.size).toBe(5);
    expect(produtos.has('Fox Barba')).toBe(true);
    expect(produtos.has('Espuma')).toBe(true);
  });

  test('retorna set vazio para array vazio', () => {
    const produtos = extrairProdutosUnicos([]);
    expect(produtos.size).toBe(0);
  });
});

describe('calculateAssociation', () => {
  test('retorna array de regras', () => {
    const regras = calculateAssociation(vendas_mock, 0.30, 0.02);
    expect(Array.isArray(regras)).toBe(true);
  });

  test('todas as regras respeitam minConfidence', () => {
    const regras = calculateAssociation(vendas_mock, 0.50, 0.02);
    regras.forEach(r => {
      expect(r.confidence).toBeGreaterThanOrEqual(0.50);
    });
  });

  test('regras ordenadas por confidence decrescente', () => {
    const regras = calculateAssociation(vendas_mock, 0.30, 0.02);
    for (let i = 0; i < regras.length - 1; i++) {
      expect(regras[i].confidence).toBeGreaterThanOrEqual(regras[i + 1].confidence);
    }
  });

  test('retorna array vazio para vendas vazias', () => {
    const regras = calculateAssociation([], 0.30, 0.02);
    expect(regras).toEqual([]);
  });

  test('regra contém campos obrigatórios', () => {
    const regras = calculateAssociation(vendas_mock, 0.30, 0.02);
    if (regras.length > 0) {
      expect(regras[0]).toHaveProperty('antecedente');
      expect(regras[0]).toHaveProperty('consequente');
      expect(regras[0]).toHaveProperty('confidence');
      expect(regras[0]).toHaveProperty('support');
      expect(regras[0]).toHaveProperty('lift');
    }
  });
});

describe('obterRecomendacoes', () => {
  const regras = calculateAssociation(vendas_mock, 0.30, 0.02);

  test('retorna no máximo topN resultados', () => {
    const top3 = obterRecomendacoes('Fox Barba', regras, 3);
    expect(top3.length).toBeLessThanOrEqual(3);
  });

  test('retorna apenas recomendações do produto solicitado', () => {
    const rec = obterRecomendacoes('Fox Barba', regras, 5);
    rec.forEach(r => expect(r.antecedente).toBe('Fox Barba'));
  });

  test('retorna array vazio para produto inexistente', () => {
    const rec = obterRecomendacoes('ProdutoInexistente', regras, 3);
    expect(rec).toEqual([]);
  });
});
