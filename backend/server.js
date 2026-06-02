/**
 * server.js
 * =========
 * Ponto de entrada da aplicação Node.js. Responsável apenas por:
 *   1. Carregar variáveis de ambiente do arquivo .env
 *   2. Importar o app Express configurado em src/app.js
 *   3. Iniciar o servidor HTTP na porta configurada
 *
 * POR QUE server.js separado de app.js?
 * Separar inicialização (server.js) da configuração (app.js) permite
 * que os testes de integração com Supertest importem o app sem subir
 * o servidor — o Supertest cria seu próprio servidor temporário.
 * Se tudo estivesse em um arquivo, cada teste abriria uma porta real.
 *
 * PORTA:
 *   Configurada via variável de ambiente PORT (Railway, Heroku, etc.)
 *   Fallback para 3000 em ambiente local de desenvolvimento.
 */

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
