/**
 * models/index.js
 * ===============
 * Camada de acesso a dados (Data Access Layer).
 * Todas as queries ao Supabase ficam aqui, isoladas das rotas e serviços.
 * As funções retornam objetos JavaScript já normalizados para o formato
 * que o serviço de recomendação espera — as rotas não precisam saber
 * nada sobre a estrutura do banco.
 *
 * Tabelas utilizadas (prefixo qb_ para evitar conflito com outro projeto
 * que compartilha o mesmo projeto Supabase):
 *   qb_clientes   - Barbearias clientes da distribuidora
 *   qb_produtos   - Catálogo de produtos (shampoos, pomadas, etc.)
 *   qb_vendas     - Cabeçalho das vendas (data, cliente, total)
 *   qb_itens_venda - Itens de cada venda (produto, quantidade, valor)
 *   qb_regras_associacao - Regras pré-calculadas (não usadas ainda)
 */

const { supabase } = require('../database/connection');

/**
 * buscarVendas()
 * Carrega todas as transações do banco e as transforma no formato que
 * o algoritmo de Association Rules precisa: array de vendas, onde cada
 * venda tem um array de itens com o nome do produto.
 *
 * Estrutura retornada:
 *   [
 *     { id: 1, itens: [{ nome_produto: 'Fox Barba', categoria: 'Barba', ... }] },
 *     { id: 2, itens: [{ nome_produto: 'Espuma', ... }] },
 *     ...
 *   ]
 *
 * O join é feito pelo PostgREST usando a FK qb_itens_venda → qb_produtos.
 * A sintaxe "qb_produtos (id, nome, categoria)" no .select() instrui o
 * PostgREST a fazer um LEFT JOIN e incluir os campos do produto aninhados.
 *
 * O agrupamento por venda_id é feito em memória (vendasMap) porque o
 * PostgREST retorna uma linha por item, não por venda.
 */
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

  // Agrupa os itens por venda_id usando um Map para eficiência O(n)
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

  // Object.values converte o mapa em array para o algoritmo
  return Object.values(vendasMap);
}

/**
 * buscarProdutos()
 * Retorna todos os produtos ativos do catálogo.
 * Usado pelo endpoint de estatísticas para contar total_produtos.
 * O filtro ativo=true exclui produtos descontinuados.
 */
async function buscarProdutos() {
  const { data, error } = await supabase
    .from('qb_produtos')
    .select('*')
    .eq('ativo', true);

  if (error) throw new Error(error.message);
  return data;
}

/**
 * buscarProduto(nome)
 * Busca um produto pelo nome usando ILIKE (case-insensitive, parcial).
 * Retorna null se não encontrado (em vez de lançar erro) para que
 * as rotas possam distinguir "não encontrado" de "erro de banco".
 *
 * @param {string} nome - Texto de busca parcial (ex: "fox" encontra "Fox For Men Barba")
 * @returns {object|null} Produto encontrado ou null
 */
async function buscarProduto(nome) {
  const { data, error } = await supabase
    .from('qb_produtos')
    .select('*')
    .ilike('nome', `%${nome}%`)
    .limit(1)
    .single();

  // .single() lança erro se não encontrar — tratamos retornando null
  if (error) return null;
  return data;
}

/**
 * buscarProdutosPorTermo(termo, limite)
 * Busca múltiplos produtos cujo nome contém o termo (ILIKE parcial,
 * case-insensitive). Diferente de buscarProduto(), que retorna só o
 * primeiro match, esta função alimenta o autocomplete do frontend:
 * o usuário digita "balm" e recebe todos os produtos que batem.
 *
 * Ordena por nome para resultado previsível e limita a quantidade
 * para não inundar o dropdown (padrão 10).
 *
 * @param {string} termo  - Texto parcial digitado pelo usuário
 * @param {number} limite - Máximo de sugestões retornadas (padrão 10)
 * @returns {Array<object>} Lista de produtos (vazia se nada bater)
 */
async function buscarProdutosPorTermo(termo, limite = 10) {
  const { data, error } = await supabase
    .from('qb_produtos')
    .select('id, nome, categoria')
    .eq('ativo', true)
    .ilike('nome', `%${termo}%`)
    .order('nome', { ascending: true })
    .limit(limite);

  if (error) throw new Error(error.message);
  return data || [];
}

module.exports = { buscarVendas, buscarProdutos, buscarProduto, buscarProdutosPorTermo };
