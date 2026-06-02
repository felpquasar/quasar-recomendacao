import { useState } from 'react';
import { recomendacaoService } from '../services/api';

export default function BuscadorProduto({ onRecomendacoes }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const buscar = async (nomeProduto) => {
    if (!nomeProduto.trim()) {
      setErro('Digite um produto');
      return;
    }

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
            if (erro) setErro('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Fox For Men Barba, QOD Shampoo..."
          className="busca-input"
          disabled={loading}
        />

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
        Digite o nome de um produto para ver o que clientes costumam comprar junto.
      </p>
    </div>
  );
}
