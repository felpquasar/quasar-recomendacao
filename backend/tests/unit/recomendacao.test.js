/**
 * tests/unit/recomendacao.test.js
 * ================================
 * Testes unitários para o módulo de serviço de recomendação (services/recomendacao.js).
 * Cobre as três funções exportadas: extrairProdutosUnicos, calculateAssociation,
 * e obterRecomendacoes.
 *
 * DADOS MOCK:
 * Usa um dataset mínimo de 5 vendas com 5 produtos para verificar a lógica
 * do algoritmo sem depender do Supabase. Os valores esperados são calculados
 * manualmente para validar o algoritmo:
 *
 *   Fox Barba aparece em 3 transações (1, 2, 3)
 *   Espuma aparece em 3 transações (1, 3, 4)
 *   Fox Barba + Espuma juntos em 2 transações (1, 3)
 *
 *   Confidence(Fox Barba → Espuma) = 2/3 = 0.6667
 *   Support(Fox Barba → Espuma)    = 2/5 = 0.4 (acima do MIN_SUPPORT de 0.02)
 *
 * ESTRATÉGIA DE COBERTURA:
 *   - Casos felizes (fluxo normal com dados válidos)
 *   - Edge cases (arrays vazios, produtos inexistentes)
 *   - Invariantes do algoritmo (ordenação, filtros de threshold)
 */

const {
  calculateAssociation,
  obterRecomendacoes,
  extrairProdutosUnicos,
} = require('../../src/services/recomendacao');

// Dataset mínimo mas representativo para testar o algoritmo
const vendas_mock = [
  { itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },      // transação 1
  { itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Tônico' }] },       // transação 2
  { itens: [{ nome_produto: 'Fox Barba' }, { nome_produto: 'Espuma' }] },       // transação 3
  { itens: [{ nome_produto: 'Espuma' }, { nome_produto: 'Condicionador' }] },   // transação 4
  { itens: [{ nome_produto: 'Pente' }] },                                        // transação 5 (produto isolado)
];

// ─────────────────────────────────────────────────────────
// Suite 1: extrairProdutosUnicos
// ─────────────────────────────────────────────────────────
describe('extrairProdutosUnicos', () => {

  test('retorna set com todos os produtos', () => {
    const produtos = extrairProdutosUnicos(vendas_mock);
    // 5 produtos únicos no mock: Fox Barba, Espuma, Tônico, Condicionador, Pente
    expect(produtos.size).toBe(5);
    expect(produtos.has('Fox Barba')).toBe(true);
    expect(produtos.has('Espuma')).toBe(true);
  });

  test('retorna set vazio para array vazio', () => {
    // Edge case: dataset sem vendas → sem produtos
    const produtos = extrairProdutosUnicos([]);
    expect(produtos.size).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────
// Suite 2: calculateAssociation
// ─────────────────────────────────────────────────────────
describe('calculateAssociation', () => {

  test('retorna array de regras', () => {
    // Verificação básica de tipo: deve retornar array, nunca undefined/null
    const regras = calculateAssociation(vendas_mock, 0.30, 0.02);
    expect(Array.isArray(regras)).toBe(true);
  });

  test('todas as regras respeitam minConfidence', () => {
    // Invariante: nenhuma regra com confidence < threshold deve passar o filtro
    const regras = calculateAssociation(vendas_mock, 0.50, 0.02);
    regras.forEach(r => {
      expect(r.confidence).toBeGreaterThanOrEqual(0.50);
    });
  });

  test('regras ordenadas por confidence decrescente', () => {
    // O algoritmo deve ordenar para que obterRecomendacoes() possa usar .slice()
    const regras = calculateAssociation(vendas_mock, 0.30, 0.02);
    for (let i = 0; i < regras.length - 1; i++) {
      expect(regras[i].confidence).toBeGreaterThanOrEqual(regras[i + 1].confidence);
    }
  });

  test('retorna array vazio para vendas vazias', () => {
    // Edge case: sem transações → sem regras possíveis
    const regras = calculateAssociation([], 0.30, 0.02);
    expect(regras).toEqual([]);
  });

  test('regra contém campos obrigatórios', () => {
    // Contrato da interface: todos os campos que o frontend e testes esperam
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

// ─────────────────────────────────────────────────────────
// Suite 3: obterRecomendacoes
// ─────────────────────────────────────────────────────────
describe('obterRecomendacoes', () => {
  // Pré-calcula regras uma vez para toda a suite (evita repetição custosa)
  const regras = calculateAssociation(vendas_mock, 0.30, 0.02);

  test('retorna no máximo topN resultados', () => {
    // Mesmo que existam mais de 3 regras para Fox Barba, .slice(0, 3) limita
    const top3 = obterRecomendacoes('Fox Barba', regras, 3);
    expect(top3.length).toBeLessThanOrEqual(3);
  });

  test('retorna apenas recomendações do produto solicitado', () => {
    // Invariante: todos os antecedentes devem ser o produto que foi passado
    const rec = obterRecomendacoes('Fox Barba', regras, 5);
    rec.forEach(r => expect(r.antecedente).toBe('Fox Barba'));
  });

  test('retorna array vazio para produto inexistente', () => {
    // Produto que não existe no dataset → zero regras → array vazio
    const rec = obterRecomendacoes('ProdutoInexistente', regras, 3);
    expect(rec).toEqual([]);
  });
});
