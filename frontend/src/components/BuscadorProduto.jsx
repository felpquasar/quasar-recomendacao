/**
 * components/BuscadorProduto.jsx
 * ================================
 * Campo de busca com AUTOCOMPLETE (Semana 7) que consulta a API de
 * recomendações e repassa os resultados ao componente pai via callback.
 *
 * NOVIDADE DA SEMANA 7 — Autocomplete:
 * Resolve a armadilha da Semana 6 (a busca exigia o nome EXATO do produto).
 * Agora, conforme o usuário digita, consultamos GET /api/produtos?q= e
 * mostramos um dropdown de produtos reais. O usuário clica numa sugestão
 * e a busca de recomendações usa o nome exato — zero erro de digitação.
 *
 * PROPS:
 *   onRecomendacoes(data) → chamada com os dados da API ou null em erro
 *
 * ESTADOS INTERNOS:
 *   input       → texto digitado pelo usuário
 *   sugestoes   → produtos retornados pelo autocomplete (array)
 *   mostrarSug  → controla visibilidade do dropdown
 *   loading     → true enquanto busca recomendações (desabilita botão)
 *   erro        → mensagem de erro exibida abaixo do input
 *
 * DEBOUNCE:
 * Não consultamos a API a cada tecla — esperamos 300ms de inatividade
 * (setTimeout limpo no cleanup do useEffect). Reduz drasticamente o
 * número de requests e a carga no Supabase.
 */

import { useState, useEffect, useRef } from 'react';
import { recomendacaoService } from '../services/api';

// Tempo de espera (ms) após a última tecla antes de consultar o autocomplete
const DEBOUNCE_MS = 300;
// Mínimo de caracteres para disparar o autocomplete (alinhado ao backend)
const MIN_CHARS = 2;

export default function BuscadorProduto({ onRecomendacoes }) {
  const [input, setInput] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSug, setMostrarSug] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Ref para detectar cliques fora do componente e fechar o dropdown
  const containerRef = useRef(null);
  // Flag que impede o autocomplete de redisparar logo após uma seleção
  const selecionandoRef = useRef(false);

  /**
   * Efeito de autocomplete com debounce.
   * Dispara sempre que `input` muda. Se o usuário acabou de selecionar
   * uma sugestão (selecionandoRef), pula a busca para não reabrir o dropdown.
   */
  useEffect(() => {
    if (selecionandoRef.current) {
      selecionandoRef.current = false;
      return;
    }

    const termo = input.trim();
    if (termo.length < MIN_CHARS) {
      setSugestoes([]);
      setMostrarSug(false);
      return;
    }

    // Agenda a busca; se o usuário digitar de novo antes de 300ms, cancela
    const timer = setTimeout(async () => {
      try {
        const resp = await recomendacaoService.buscarProdutos(termo);
        setSugestoes(resp.data.produtos || []);
        setMostrarSug(true);
      } catch {
        // Falha no autocomplete não deve travar o usuário — só não sugere
        setSugestoes([]);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer); // cleanup cancela o timer anterior
  }, [input]);

  // Fecha o dropdown ao clicar fora do componente
  useEffect(() => {
    const handleClickFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMostrarSug(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  /**
   * buscar(nomeProduto)
   * Valida o input, chama a API de recomendações e repassa ao pai.
   */
  const buscar = async (nomeProduto) => {
    if (!nomeProduto.trim()) {
      setErro('Digite um produto');
      return;
    }

    setMostrarSug(false);
    setLoading(true);
    setErro('');

    try {
      const response = await recomendacaoService.obterRecomendacoes(nomeProduto.trim());
      onRecomendacoes(response.data);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao buscar recomendações');
      onRecomendacoes(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * selecionarSugestao(produto)
   * Preenche o input com o nome exato e dispara a busca imediatamente.
   */
  const selecionarSugestao = (produto) => {
    selecionandoRef.current = true; // evita reabrir o autocomplete
    setInput(produto.nome);
    setSugestoes([]);
    setMostrarSug(false);
    buscar(produto.nome);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscar(input);
    if (e.key === 'Escape') setMostrarSug(false);
  };

  return (
    <div className="buscador-container" ref={containerRef}>
      <h2>Buscar Recomendações</h2>

      <div className="busca-input-group">
        {/* Wrapper relativo para posicionar o dropdown absoluto */}
        <div className="busca-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (erro) setErro('');
            }}
            onFocus={() => { if (sugestoes.length > 0) setMostrarSug(true); }}
            onKeyDown={handleKeyDown}
            placeholder="Digite parte do nome — ex: balm, pomada, shampoo..."
            className="busca-input"
            disabled={loading}
            autoComplete="off"
          />

          {/* Dropdown de sugestões do autocomplete */}
          {mostrarSug && sugestoes.length > 0 && (
            <ul className="autocomplete-lista">
              {sugestoes.map((p) => (
                <li
                  key={p.id}
                  className="autocomplete-item"
                  onClick={() => selecionarSugestao(p)}
                >
                  <span className="autocomplete-nome">{p.nome}</span>
                  <span className="autocomplete-categoria">{p.categoria}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => buscar(input)}
          disabled={loading}
          className="busca-btn"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {erro && <div className="erro-msg">{erro}</div>}

      <p className="info-texto">
        Comece a digitar e selecione um produto na lista para ver o que os clientes costumam comprar junto.
      </p>
    </div>
  );
}
