require('dotenv').config();
const { supabase } = require('./connection');

const clientes = [
  { nome_loja: 'Barbearia do João', cidade: 'Codó' },
  { nome_loja: 'Studio Corte & Barba', cidade: 'São Luís' },
  { nome_loja: 'Barbearia Clássica', cidade: 'Imperatriz' },
  { nome_loja: 'Barber Shop Premium', cidade: 'Teresina' },
];

const produtos = [
  { nome: 'Fox For Men Barba', categoria: 'Barba', preco: 89.90 },
  { nome: 'Espuma para Barba Premium', categoria: 'Barba', preco: 34.90 },
  { nome: 'Tônico de Barba', categoria: 'Barba', preco: 49.90 },
  { nome: 'Condicionador de Barba', categoria: 'Barba', preco: 39.90 },
  { nome: 'Pente de Metal Profissional', categoria: 'Acessórios', preco: 29.90 },
  { nome: 'QOD Barber Shampoo', categoria: 'Cabelo', preco: 59.90 },
  { nome: 'QOD Pomada Forte', categoria: 'Cabelo', preco: 69.90 },
  { nome: 'Beard Oil Premium', categoria: 'Barba', preco: 55.90 },
  { nome: 'Balm para Barba', categoria: 'Barba', preco: 44.90 },
  { nome: 'Tesoura Profissional', categoria: 'Acessórios', preco: 89.90 },
];

// vendas_mock: [cliente_idx, [produto_idx, ...]]
const vendas_mock = [
  [0, [0, 1]],       // Fox Barba + Espuma
  [1, [0, 2]],       // Fox Barba + Tônico
  [0, [0, 1, 2]],    // Fox Barba + Espuma + Tônico
  [2, [1, 3]],       // Espuma + Condicionador
  [1, [0, 4]],       // Fox Barba + Pente
  [3, [5, 6]],       // QOD Shampoo + QOD Pomada
  [2, [5, 6, 4]],    // QOD Shampoo + QOD Pomada + Pente
  [0, [7, 8]],       // Beard Oil + Balm
  [1, [7, 8, 0]],    // Beard Oil + Balm + Fox Barba
  [3, [4, 9]],       // Pente + Tesoura
  [2, [0, 1, 7]],    // Fox Barba + Espuma + Beard Oil
  [0, [5, 6]],       // QOD Shampoo + QOD Pomada
  [1, [3, 1]],       // Condicionador + Espuma
  [3, [0, 2, 8]],    // Fox Barba + Tônico + Balm
];

async function seed() {
  console.log('🌱 Iniciando seed de dados...\n');

  // 1. Inserir clientes
  const { data: clientesInseridos, error: errClientes } = await supabase
    .from('clientes')
    .insert(clientes)
    .select();

  if (errClientes) {
    console.error('Erro ao inserir clientes:', errClientes.message);
    process.exit(1);
  }
  console.log(`✅ ${clientesInseridos.length} clientes inseridos`);

  // 2. Inserir produtos
  const { data: produtosInseridos, error: errProdutos } = await supabase
    .from('produtos')
    .insert(produtos)
    .select();

  if (errProdutos) {
    console.error('Erro ao inserir produtos:', errProdutos.message);
    process.exit(1);
  }
  console.log(`✅ ${produtosInseridos.length} produtos inseridos`);

  // 3. Inserir vendas e itens
  let totalVendas = 0;
  let totalItens = 0;

  for (const [clienteIdx, produtosIdx] of vendas_mock) {
    const cliente = clientesInseridos[clienteIdx];
    const valorTotal = produtosIdx.reduce(
      (acc, pi) => acc + produtosInseridos[pi].preco, 0
    );

    const { data: venda, error: errVenda } = await supabase
      .from('vendas')
      .insert({
        cliente_id: cliente.id,
        data: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toISOString().split('T')[0],
        valor_total: parseFloat(valorTotal.toFixed(2)),
        metodo_pagamento: ['pix', 'cartao', 'dinheiro'][Math.floor(Math.random() * 3)],
      })
      .select()
      .single();

    if (errVenda) {
      console.error('Erro ao inserir venda:', errVenda.message);
      continue;
    }

    const itens = produtosIdx.map(pi => ({
      venda_id: venda.id,
      produto_id: produtosInseridos[pi].id,
      quantidade: 1,
      valor_unitario: produtosInseridos[pi].preco,
    }));

    const { error: errItens } = await supabase.from('itens_venda').insert(itens);
    if (errItens) {
      console.error('Erro ao inserir itens:', errItens.message);
    } else {
      totalVendas++;
      totalItens += itens.length;
    }
  }

  console.log(`✅ ${totalVendas} vendas inseridas`);
  console.log(`✅ ${totalItens} itens de venda inseridos`);
  console.log('\n🎉 Seed concluído! Banco pronto para uso.');
}

seed().catch(console.error);
