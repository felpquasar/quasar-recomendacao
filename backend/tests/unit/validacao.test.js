/**
 * tests/unit/validacao.test.js
 * ============================
 * Testes unitários para o serviço de validação do algoritmo.
 * Verifica Precision, Recall, F1-Score e o pipeline de train/test split.
 * Todos os testes usam dados mockados — sem I/O de rede.
 */

const validador = require('../../src/services/validacao');

// Fixtures reutilizadas nos testes
const recomendacoes = [
  { antecedente: 'A', consequente: 'Espuma' },
  { antecedente: 'A', consequente: 'Tonico' },
  { antecedente: 'A', consequente: 'Pente' },
];

const comprasRealizadas = ['Espuma', 'Condicionador'];

// Vendas sintéticas para testar o validarComSplit
const vendasMock = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  itens: [
    { nome_produto: 'Produto A' },
    { nome_produto: 'Produto B' },
    { nome_produto: 'Produto C' },
  ],
}));

describe('Servico de Validacao', () => {

  describe('calcularPrecision', () => {
    test('retorna valor entre 0 e 1', () => {
      const p = validador.calcularPrecision(recomendacoes, comprasRealizadas);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    });

    test('retorna 0 quando sem recomendacoes', () => {
      expect(validador.calcularPrecision([], comprasRealizadas)).toBe(0);
    });

    test('retorna 1 quando todas as recomendacoes acertam', () => {
      const recs = [{ consequente: 'Espuma' }, { consequente: 'Condicionador' }];
      expect(validador.calcularPrecision(recs, ['Espuma', 'Condicionador'])).toBe(1);
    });

    test('calcula corretamente com 1 acerto de 3', () => {
      // recomendacoes tem 3 itens, comprasRealizadas tem 'Espuma' que bate
      const p = validador.calcularPrecision(recomendacoes, comprasRealizadas);
      expect(p).toBeCloseTo(1 / 3, 5);
    });
  });

  describe('calcularRecall', () => {
    test('retorna valor entre 0 e 1', () => {
      const r = validador.calcularRecall(recomendacoes, comprasRealizadas);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    });

    test('retorna 0 quando sem compras realizadas', () => {
      expect(validador.calcularRecall(recomendacoes, [])).toBe(0);
    });

    test('retorna 1 quando todas as compras foram recomendadas', () => {
      const recs = [{ consequente: 'Espuma' }, { consequente: 'Condicionador' }];
      expect(validador.calcularRecall(recs, ['Espuma', 'Condicionador'])).toBe(1);
    });

    test('calcula corretamente com 1 acerto de 2 compras', () => {
      // comprasRealizadas tem 2 itens, 'Espuma' foi recomendado
      const r = validador.calcularRecall(recomendacoes, comprasRealizadas);
      expect(r).toBeCloseTo(1 / 2, 5);
    });
  });

  describe('calcularF1Score', () => {
    test('retorna 0 quando precision e recall sao 0', () => {
      expect(validador.calcularF1Score(0, 0)).toBe(0);
    });

    test('retorna valor entre 0 e 1', () => {
      const f1 = validador.calcularF1Score(0.5, 0.7);
      expect(f1).toBeGreaterThanOrEqual(0);
      expect(f1).toBeLessThanOrEqual(1);
    });

    test('retorna 1 quando precision e recall sao 1', () => {
      expect(validador.calcularF1Score(1, 1)).toBe(1);
    });

    test('media harmonica e menor que media aritmetica quando P != R', () => {
      const p = 0.8;
      const r = 0.2;
      const f1 = validador.calcularF1Score(p, r);
      const mediaAritmetica = (p + r) / 2;
      expect(f1).toBeLessThan(mediaAritmetica);
    });
  });

  describe('validarComSplit', () => {
    test('retorna objeto com as tres metricas', () => {
      const resultado = validador.validarComSplit(vendasMock);
      expect(resultado).toHaveProperty('precision_media');
      expect(resultado).toHaveProperty('recall_media');
      expect(resultado).toHaveProperty('f1_media');
    });

    test('metricas estao entre 0 e 1', () => {
      const resultado = validador.validarComSplit(vendasMock);
      expect(resultado.precision_media).toBeGreaterThanOrEqual(0);
      expect(resultado.precision_media).toBeLessThanOrEqual(1);
      expect(resultado.recall_media).toBeGreaterThanOrEqual(0);
      expect(resultado.recall_media).toBeLessThanOrEqual(1);
      expect(resultado.f1_media).toBeGreaterThanOrEqual(0);
      expect(resultado.f1_media).toBeLessThanOrEqual(1);
    });

    test('split e 80/20', () => {
      const resultado = validador.validarComSplit(vendasMock);
      expect(resultado.detalhes.total_treino).toBe(16); // 80% de 20
      expect(resultado.detalhes.total_teste).toBe(4);   // 20% de 20
    });

    test('retorna zeros quando dataset muito pequeno', () => {
      const resultado = validador.validarComSplit([]);
      expect(resultado.precision_media).toBe(0);
      expect(resultado.recall_media).toBe(0);
      expect(resultado.f1_media).toBe(0);
    });
  });

});
