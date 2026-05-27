const { supabase } = require('../database/connection');

async function buscarVendas() {
  const { data, error } = await supabase
    .from('qb_itens_venda')
    .select(`
      venda_id,
      quantidade,
      valor_unitario,
      qb_produtos (id, nome, categoria)
    `);

  if (error) throw new Error(error.message);

  const vendasMap = {};
  for (const item of data) {
    if (!vendasMap[item.venda_id]) {
      vendasMap[item.venda_id] = { id: item.venda_id, itens: [] };
    }
    vendasMap[item.venda_id].itens.push({
      nome_produto: item.qb_produtos.nome,
      produto_id: item.qb_produtos.id,
      categoria: item.qb_produtos.categoria,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
    });
  }

  return Object.values(vendasMap);
}

async function buscarProdutos() {
  const { data, error } = await supabase
    .from('qb_produtos')
    .select('*')
    .eq('ativo', true);

  if (error) throw new Error(error.message);
  return data;
}

async function buscarProduto(nome) {
  const { data, error } = await supabase
    .from('qb_produtos')
    .select('*')
    .ilike('nome', `%${nome}%`)
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

module.exports = { buscarVendas, buscarProdutos, buscarProduto };
