/**
 * components/BuscadorProduto.jsx
 * ================================
 * Campo de busca que consulta a API de recomendações e repassa
 * os resultados para o componente pai via callback.
 *
 * PROPS:
 *   onRecomendacoes(data) → função chamada com os dados da API
 *                           ou null em caso de erro
 *
 * ESTADOS INTERNOS:
 *   input    → texto digitado pelo usuário
 *   loading  → true enquanto aguarda resposta da API (desabilita botão)
 *   erro     → mensagem de erro exibida abaixo do input
 *
 * FLUXO DE USO:
 *   1. Usuário digita nome do produto (ex: "BALM 120ML - FOX FOR MEN")
 *   2. Pressiona Enter ou clica no botão "Buscar"
 *   3. Chama recomendacaoService.obterRecomendacoes(nome) → GET /api/recomendacoes/:id
 *   4. Em sucesso: chama onRecomendacoes(response.data)
 *   5. Em erro: chama onRecomendacoes(null) e exibe mensagem de erro
 *
 * POR QUE usar o serviço centralizado (api.js) em vez de axios direto?
 * Garante que baseURL, timeout e qualquer interceptor futuro (ex: auth header)
 * sejam aplicados automaticamente sem duplicar configuração.
 *
 * POR QUE limpar erro no onChange?
 * Melhora UX — ao começar a digitar após um erro, a mensagem desaparece
 * imediatamente, indicando que o sistema está pronto para nova tentativa.
 */

import { useState } from 'react';
import { recomendacaoService } from '../services/api';

export default function BuscadorProduto({ onRecomendacoes }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  /**
   * buscar(nomeProduto)
   * Valida o input, chama a API e repassa resultado ao pai.
   * Separado do handler para poder ser chamado tanto pelo botão
   * quanto pelo Enter no input (handleKeyDown).
   */
  const buscar = async (nomeProduto) => {
    if (!nomeProduto.trim()) {
      setErro('Digite um produto');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      // encodeURIComponent é aplicado pelo axios automaticamente via
      // o recomendacaoService — produtos com espaços e acentos funcionam
      const response = await recomendacaoService.obterRecomendacoes(nomeProduto.trim());
      onRecomendacoes(response.data); // passa dados para o Dashboard
    } catch (error) {
      // Extrai mensagem de erro do backend (campo "erro") ou usa fallback genérico
      setErro(error.response?.data?.erro || 'Erro ao buscar recomendações');
      onRecomendacoes(null); // limpa resultados anteriores
    } finally {
      // sempre restaura o botão, mesmo em caso de erro
      setLoading(false);
    }
  };

  // Permite buscar pressionando Enter no campo de texto
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscar(input);
  };

  return (
    <div className="buscador-container">
      <h2>Buscar Recomendações</h2>

      <div className="busca-input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (erro) setErro(''); // limpa erro ao digitar
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ex: BALM 120ML - FOX FOR MEN, KILLER POMADA 70G - QOD..."
          className="busca-input"
          disabled={loading} // evita múltiplas requisições simultâneas
        />

        <button
          onClick={() => buscar(input)}
          disabled={loading}
          className="busca-btn"
        >
          {/* Feedback visual de loading no próprio botão */}
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Exibe mensagem de erro apenas se houver */}
      {erro && <div className="erro-msg">{erro}</div>}

      <p className="info-texto">
        Digite o nome exato do produto para ver o que clientes costumam comprar junto.
      </p>
    </div>
  );
}
