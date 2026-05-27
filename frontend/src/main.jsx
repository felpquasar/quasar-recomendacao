/**
 * frontend/src/main.jsx
 * =====================
 * Ponto de entrada do React. Monta o componente raiz App no elemento
 * #root do index.html e ativa o StrictMode.
 *
 * StrictMode:
 *   - Detecta efeitos colaterais inesperados renderizando componentes duas vezes
 *   - Avisa sobre APIs React depreciadas
 *   - Só ativo em desenvolvimento — sem impacto em produção
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Monta a árvore React no div#root definido em index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
