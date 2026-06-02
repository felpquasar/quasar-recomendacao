/**
 * App.jsx
 * =======
 * Componente raiz da aplicação React. Configura o roteamento client-side
 * com React Router DOM v6 e define as rotas de nível superior.
 *
 * ROTAS IMPLEMENTADAS (Semana 6):
 *   /  → Dashboard principal (gráficos + KPIs + buscador de produtos)
 *
 * ROTAS FUTURAS (Semana 7):
 *   /produtos → Listagem completa do catálogo com filtros
 *
 * POR QUE BrowserRouter?
 * Usa a History API do browser para URLs limpas (sem hash #).
 * Em produção (Vercel), é necessário configurar redirects para que
 * todas as rotas retornem index.html (SPA behavior).
 *
 * POR QUE importar CSS aqui?
 * O Vite trata imports de CSS no JS como módulos — o CSS é injetado
 * no <head> automaticamente no build. Importar no App.jsx garante
 * que o estilo global carrega antes de qualquer componente renderizar.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz → Dashboard com estatísticas + buscador de recomendações */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
