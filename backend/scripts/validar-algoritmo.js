/**
 * scripts/validar-algoritmo.js
 * ============================
 * Script CLI para executar a validação do algoritmo e exibir as métricas
 * no terminal. Também salva o resultado em dados/metricas-validacao.json
 * para uso nos relatórios do TCC.
 *
 * Uso:
 *   cd backend
 *   node scripts/validar-algoritmo.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const validador = require('../src/services/validacao');
const { buscarVendas } = require('../src/models');

async function executarValidacao() {
  console.log('Iniciando validacao do algoritmo...\n');

  const vendas = await buscarVendas();
  console.log(`Total de vendas carregadas: ${vendas.length}`);

  if (vendas.length < 5) {
    console.error('Dataset insuficiente para validacao (minimo 5 vendas).');
    process.exit(1);
  }

  const resultados = validador.validarComSplit(vendas);

  console.log('\n=== RESULTADOS DA VALIDACAO ===\n');
  console.log(`Treino:    ${resultados.detalhes.total_treino} transacoes (80%)`);
  console.log(`Teste:     ${resultados.detalhes.total_teste} transacoes (20%)`);
  console.log(`Avaliadas: ${resultados.detalhes.transacoes_avaliadas} transacoes validas\n`);
  console.log('-------------------------------------------');
  console.log(`Precision: ${(resultados.precision_media * 100).toFixed(1)}%`);
  console.log(`Recall:    ${(resultados.recall_media * 100).toFixed(1)}%`);
  console.log(`F1-Score:  ${resultados.f1_media.toFixed(4)}`);
  console.log('-------------------------------------------\n');

  // Interpreta os resultados
  const p = resultados.precision_media;
  const r = resultados.recall_media;
  const f1 = resultados.f1_media;
  console.log(`Precision ${p >= 0.6 ? 'BOM (>= 60%)' : 'ACEITAVEL (< 60%)'}`);
  console.log(`Recall    ${r >= 0.5 ? 'BOM (>= 50%)' : 'BAIXO (< 50%)'}`);
  console.log(`F1-Score  ${f1 >= 0.6 ? 'BOM (>= 0.60)' : 'ACEITAVEL (< 0.60)'}`);

  // Salva JSON para uso no TCC
  const dadosDir = path.join(__dirname, '../dados');
  if (!fs.existsSync(dadosDir)) {
    fs.mkdirSync(dadosDir, { recursive: true });
  }

  const outputPath = path.join(dadosDir, 'metricas-validacao.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    gerado_em: new Date().toISOString(),
    metodologia: 'Train/Test Split 80/20',
    ...resultados,
  }, null, 2));

  console.log(`\nRelatorio salvo em: dados/metricas-validacao.json`);
  process.exit(0);
}

executarValidacao().catch(err => {
  console.error('Erro na validacao:', err.message);
  process.exit(1);
});
