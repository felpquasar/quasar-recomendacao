/**
 * seed-csv.js
 * ===========
 * Importa o CSV real de vendas (Pedidos_2026.csv) para o Supabase.
 * Lê o arquivo, agrupa itens por pedido, infere categorias dos produtos
 * e insere nas tabelas qb_clientes, qb_produtos, qb_vendas, qb_itens_venda.
 *
 * Uso:
 *   node src/database/seed-csv.js <caminho-do-csv> [--reset]
 *
 *   --reset  Apaga TODOS os dados das tabelas qb_* antes de importar
 *            (evita duplicar vendas de um seed anterior). Use ao trocar
 *            o dataset por um novo definitivo.
 *
 * Exemplo:
 *   node src/database/seed-csv.js "../../dados/Pedidos_2026.csv" --reset
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// O seed precisa de permissão de escrita. Com RLS ativado, a anon key recebe
// "permission denied" — então usamos a service_role key (bypassa RLS) quando
// disponível. O app em runtime continua usando a anon key via connection.js.
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error(
    'SUPABASE_SERVICE_KEY ausente no .env — necessária para escrever com RLS ativo.\n' +
    'Pegue em: Supabase → Project Settings → API → service_role (secret).'
  );
  process.exit(1);
}
const supabase = createClient(process.env.SUPABASE_URL, SERVICE_KEY);

// ── Configuração ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const RESET = args.includes('--reset');
const CSV_PATH = args.find((a) => !a.startsWith('--'))
  || path.join(__dirname, '../../../../dados/vendas-bruto.csv');

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

// Converte data BR (DD/MM/AAAA) para ISO (AAAA-MM-DD) exigido pelo Postgres.
// Sem isso, o Postgres tenta interpretar como MM/DD e (a) erra quando o dia > 12
// ou (b) pior, troca dia/mês silenciosamente quando o dia <= 12.
function dataParaISO(dataBR) {
  const m = (dataBR || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return dataBR; // já em ISO ou formato inesperado — deixa o banco validar
  const [, dia, mes, ano] = m;
  return `${ano}-${mes}-${dia}`;
}

function agruparPorPedido(linhas) {
  const pedidos = new Map();

  for (const linha of linhas) {
    const id = linha['Pedido'];
    if (!id) continue;

    if (!pedidos.has(id)) {
      pedidos.set(id, {
        pedido_id: id,
        data: dataParaISO(linha['Data']),
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

// ── Reset (limpeza) ─────────────────────────────────────────────────────────────

async function resetTabelas() {
  console.log('⚠ --reset: apagando dados antigos das tabelas qb_*...');
  // Ordem respeita as FKs: itens → vendas → produtos → clientes
  const ordem = ['qb_itens_venda', 'qb_vendas', 'qb_produtos', 'qb_clientes'];
  for (const tabela of ordem) {
    const { error } = await supabase.from(tabela).delete().gt('id', 0);
    if (error) {
      console.error(`Erro ao limpar ${tabela}:`, error.message);
      process.exit(1);
    }
    console.log(`  ✓ ${tabela} limpa`);
  }
  console.log('');
}

// ── Seed principal ─────────────────────────────────────────────────────────────

async function seed() {
  if (RESET) await resetTabelas();

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
  console.log(`Processando ${clientesUnicos.length} clientes...`);

  // Busca clientes já existentes para evitar duplicatas
  const { data: clientesExistentes } = await supabase
    .from('qb_clientes')
    .select('id, nome_loja');

  const clienteMap = {};
  const existentesSet = new Set();
  for (const c of (clientesExistentes || [])) {
    clienteMap[c.nome_loja] = c.id;
    existentesSet.add(c.nome_loja);
  }

  const clientesNovos = clientesUnicos
    .filter((nome) => !existentesSet.has(nome))
    .map((nome) => ({ nome_loja: nome, cidade: 'Codó', estado: 'MA' }));

  if (clientesNovos.length > 0) {
    const { data: inseridos, error: errClientes } = await supabase
      .from('qb_clientes')
      .insert(clientesNovos)
      .select();

    if (errClientes) {
      console.error('Erro ao inserir clientes:', errClientes.message);
      process.exit(1);
    }
    for (const c of inseridos) clienteMap[c.nome_loja] = c.id;
    console.log(`✓ ${inseridos.length} novos clientes inseridos (${existentesSet.size} já existiam)`);
  } else {
    console.log(`✓ Todos os ${clientesUnicos.length} clientes já existem no banco`);
  }

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
  console.log(`\nProcessando ${produtosArray.length} produtos...`);
  produtosArray.forEach((p) => console.log(`  [${p.categoria}] ${p.nome}`));

  // Busca produtos já existentes
  const { data: produtosExistentes } = await supabase
    .from('qb_produtos')
    .select('id, nome');

  const produtoMap = {};
  const produtosExistentesSet = new Set();
  for (const p of (produtosExistentes || [])) {
    produtoMap[p.nome] = p.id;
    produtosExistentesSet.add(p.nome);
  }

  const produtosNovos = produtosArray.filter((p) => !produtosExistentesSet.has(p.nome));

  if (produtosNovos.length > 0) {
    const { data: inseridos, error: errProdutos } = await supabase
      .from('qb_produtos')
      .insert(produtosNovos)
      .select();

    if (errProdutos) {
      console.error('Erro ao inserir produtos:', errProdutos.message);
      process.exit(1);
    }
    for (const p of inseridos) produtoMap[p.nome] = p.id;
    console.log(`✓ ${inseridos.length} novos produtos inseridos (${produtosExistentesSet.size} já existiam)`);
  } else {
    console.log(`✓ Todos os ${produtosArray.length} produtos já existem no banco`);
  }

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
  console.log(`✓ ${clientesUnicos.length} clientes`);
  console.log(`✓ ${produtosArray.length} produtos`);
  console.log(`✓ ${totalVendas} vendas`);
  console.log(`✓ ${totalItens} itens de venda`);
  if (erros > 0) console.warn(`⚠ ${erros} erro(s) — verifique logs acima`);
  console.log('\nSeed concluído! Banco pronto para uso.');
}

seed().catch((err) => {
  console.error('Falha no seed:', err.message);
  process.exit(1);
});
