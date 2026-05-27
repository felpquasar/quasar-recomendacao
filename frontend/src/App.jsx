import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
