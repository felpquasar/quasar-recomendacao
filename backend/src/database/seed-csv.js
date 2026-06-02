/**
 * seed-csv.js
 * ===========
 * Importa o CSV real de vendas (Pedidos_2026.csv) para o Supabase.
 * Lê o arquivo, agrupa itens por pedido, infere categorias dos produtos
 * e insere nas tabelas qb_clientes, qb_produtos, qb_vendas, qb_itens_venda.
 *
 * Uso:
 *   node src/database/seed-csv.js <caminho-do-csv>
 *
 * Exemplo:
 *   node src/database/seed-csv.js "C:/Users/Quasar/Downloads/Pedidos_2026 (2).csv"
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { supabase } = require('./connection');

// ── Configuração ──────────────────────────────────────────────────────────────

const CSV_PATH = process.argv[2] || path.join(__dirname, '../../../../dados/vendas-bruto.csv');

// ── Helpers ───────────────────────────────────────────────────────────────────

function inferirCategoria(nomeProduto) {
  const n = nomeProduto.toUpperCase();

  if (n.includes('PENTE') || n.includes('ESCOVINHA') || n.includes('TESOURA')) {
    return 'Acessórios';
  }

  const keywords_barba = [
    'BARBA', 'BALM', 'AFTER SHAVE', 'BALSAMO', 'BÁLSAMO',
    'PRE BARBA', 'POS BARBA', 'PÓS BARBA', 'BIGODE',
  ];

  if (keywords_barba.some((k) => n.includes(k))) {
    return 'Barba';
  }

  return 'Cabelo';
}

function parsearCSV(conteudo) {
  // Remove BOM (UTF-8 com BOM de Excel) e normaliza quebras de linha
  const linhas = conteudo
    .replace(/^﻿/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const [cabecalho, ...dados] = linhas;
  const colunas = cabecalho.split(';').map((c) => c.trim());

  return dados.map((linha) => {
    const valores = linha.split(';');
    const obj = {};
    colunas.forEach((col, i) => {
      obj[col] = (valores[i] || '').trim();
    });
    return obj;
  });
}

function agruparPorPedido(linhas) {
  const pedidos = new Map();

  for (const linha of linhas) {
    const id = linha['Pedido'];
    if (!id) continue;

    if (!pedidos.has(id)) {
      pedidos.set(id, {
        pedido_id: id,
        data: linha['Data'],
        cliente: linha['Cliente'],
        itens: [],
      });
    }

    const valorBruto = linha['Valor (R$)'] || '0';
    const valor = parseFloat(valorBruto.replace(',', '.'));
    const qtd = parseInt(linha['Qtd'] || '1', 10);

    pedidos.get(id).itens.push({
      produto: linha['Produto'],
      quantidade: qtd,
      valor_unitario: valor,
    });
  }

  return Array.from(pedidos.values());
}

// ── Seed principal ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('Lendo CSV:', CSV_PATH);

  if (!fs.existsSync(CSV_PATH)) {
    console.error('Arquivo não encontrado:', CSV_PATH);
    process.exit(1);
  }

  const conteudo = fs.readFileSync(CSV_PATH, 'utf8');
  const linhas = parsearCSV(conteudo);
  const pedidos = agruparPorPedido(linhas);

  console.log(`CSV carregado: ${linhas.length} linhas → ${pedidos.length} pedidos\n`);

  // ── 1. Extrair clientes únicos ────────────────────────────────────────────
  const clientesUnicos = [...new Set(pedidos.map((p) => p.cliente))].filter(Boolean);
  console.log(`Inserindo ${clientesUnicos.length} clientes...`);

  const { data: clientesInseridos, error: errClientes } = await supabase
    .from('qb_clientes')
    .upsert(
      clientesUnicos.map((nome) => ({ nome_loja: nome, cidade: 'Codó', estado: 'MA' })),
      { onConflict: 'nome_loja', ignoreDuplicates: false }
    )
    .select();

  if (errClientes) {
    console.error('Erro ao inserir clientes:', errClientes.message);
    process.exit(1);
  }

  const clienteMap = {};
  for (const c of clientesInseridos) clienteMap[c.nome_loja] = c.id;
  console.log(`✓ ${clientesInseridos.length} clientes prontos`);

  // ── 2. Extrair produtos únicos ────────────────────────────────────────────
  const produtosUnicos = new Map();
  for (const pedido of pedidos) {
    for (const item of pedido.itens) {
      if (!item.produto) continue;
      if (!produtosUnicos.has(item.produto)) {
        produtosUnicos.set(item.produto, {
          nome: item.produto,
          categoria: inferirCategoria(item.produto),
          preco: item.valor_unitario,
        });
      }
    }
  }

  const produtosArray = Array.from(produtosUnicos.values());
  console.log(`\nInserindo ${produtosArray.length} produtos...`);
  produtosArray.forEach((p) => console.log(`  [${p.categoria}] ${p.nome}`));

  const { data: produtosInseridos, error: errProdutos } = await supabase
    .from('qb_produtos')
    .upsert(produtosArray, { onConflict: 'nome', ignoreDuplicates: false })
    .select();

  if (errProdutos) {
    console.error('Erro ao inserir produtos:', errProdutos.message);
    process.exit(1);
  }

  const produtoMap = {};
  for (const p of produtosInseridos) produtoMap[p.nome] = p.id;
  console.log(`✓ ${produtosInseridos.length} produtos prontos`);

  // ── 3. Inserir vendas e itens ────────────────────────────────────────────
  console.log('\nInserindo vendas e itens...');

  let totalVendas = 0;
  let totalItens = 0;
  let erros = 0;

  for (const pedido of pedidos) {
    const clienteId = clienteMap[pedido.cliente];
    if (!clienteId) {
      console.warn(`  Cliente não encontrado: ${pedido.cliente}`);
      erros++;
      continue;
    }

    const valorTotal = pedido.itens.reduce(
      (acc, i) => acc + i.valor_unitario * i.quantidade,
      0
    );

    const { data: venda, error: errVenda } = await supabase
      .from('qb_vendas')
      .insert({
        cliente_id: clienteId,
        data: pedido.data || new Date().toISOString().split('T')[0],
        valor_total: parseFloat(valorTotal.toFixed(2)),
        metodo_pagamento: 'pix',
      })
      .select()
      .single();

    if (errVenda) {
      console.warn(`  Erro venda ${pedido.pedido_id}: ${errVenda.message}`);
      erros++;
      continue;
    }

    // Agrupa produtos duplicados no mesmo pedido (aumenta quantidade)
    const itensAgrupados = new Map();
    for (const item of pedido.itens) {
      const pid = produtoMap[item.produto];
      if (!pid) {
        console.warn(`  Produto não mapeado: ${item.produto}`);
        continue;
      }
      if (itensAgrupados.has(pid)) {
        itensAgrupados.get(pid).quantidade += item.quantidade;
      } else {
        itensAgrupados.set(pid, {
          venda_id: venda.id,
          produto_id: pid,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
        });
      }
    }

    const itensParaInserir = Array.from(itensAgrupados.values());

    if (itensParaInserir.length === 0) continue;

    const { error: errItens } = await supabase
      .from('qb_itens_venda')
      .insert(itensParaInserir);

    if (errItens) {
      console.warn(`  Erro itens venda ${pedido.pedido_id}: ${errItens.message}`);
      erros++;
    } else {
      totalVendas++;
      totalItens += itensParaInserir.length;
      console.log(
        `  Pedido ${pedido.pedido_id}: ${itensParaInserir.length} item(ns) — ${pedido.cliente}`
      );
    }
  }

  // ── Resumo ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────');
  console.log(`✓ ${clientesInseridos.length} clientes`);
  console.log(`✓ ${produtosInseridos.length} produtos`);
  console.log(`✓ ${totalVendas} vendas`);
  console.log(`✓ ${totalItens} itens de venda`);
  if (erros > 0) console.warn(`⚠ ${erros} erro(s) — verifique logs acima`);
  console.log('\nSeed concluído! Banco pronto para uso.');
}

seed().catch((err) => {
  console.error('Falha no seed:', err.message);
  process.exit(1);
});
