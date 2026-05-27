/**
 * scripts/gerar-pdf.js
 * Gera o PDF do resumo do TCC usando puppeteer-core + Chrome instalado.
 * Uso: node scripts/gerar-pdf.js
 * Saída: resumo-tcc-quasar.pdf na raiz do projeto
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML_PATH = path.join(__dirname, 'resumo-tcc.html');
const OUTPUT_PATH = path.join(__dirname, '..', 'resumo-tcc-quasar.pdf');

async function gerarPDF() {
  console.log('Gerando PDF...');

  if (!fs.existsSync(CHROME_PATH)) {
    console.error('Chrome nao encontrado em:', CHROME_PATH);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('PDF gerado:', OUTPUT_PATH);
}

gerarPDF().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
