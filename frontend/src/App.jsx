/**
 * frontend/src/App.jsx
 * ====================
 * Componente raiz da aplicação React. Configura o roteamento client-side
 * com React Router DOM e define as rotas de nível superior.
 *
 * ESTADO ATUAL (Semana 2):
 * Placeholder visual enquanto o dashboard completo é desenvolvido nas
 * Semanas 6-7. A estrutura de BrowserRouter + Routes já está pronta
 * para receber novos componentes sem refatorar.
 *
 * ROTAS PLANEJADAS (Semanas 6-7):
 *   /          → Dashboard principal (gráficos + KPIs)
 *   /buscar    → Buscador de produtos com cards de recomendação
 *   /produtos  → Listagem completa do catálogo
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz: placeholder até o dashboard ser implementado na Semana 6 */}
        <Route path="/" element={
          <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>🎯 Sistema de Recomendação - Quasar Barber</h1>
            <p>Em desenvolvimento... (Semana 2 ✅)</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
