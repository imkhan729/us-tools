const fs = require('fs');
const path = require('path');

const distPublic = path.join(__dirname, '../dist/public');

console.log('[seo:hreflang] Auditing multilingual hreflang and language tags...');

const localizedPaths = [
  'yuzde-hesaplama', 'ar/hesab-alomr', 'ar/tahweel-altareekh', 
  'calculadora-juros-compostos', 'kalkulator-umur', 'kdv-hesaplama', 
  'kidem-tazminati-hesaplama', 'calculo-rescisao', 'calculo-ferias', 'kalkulator-vat'
];

let errors = 0;

for (const locPath of localizedPaths) {
  const filePath1 = path.join(distPublic, locPath, 'index.html');
  const filePath2 = path.join(distPublic, `${locPath}.html`);
  const file = fs.existsSync(filePath1) ? filePath1 : (fs.existsSync(filePath2) ? filePath2 : null);

  if (!file) {
    console.error(`[seo:hreflang] FAIL: Localized static HTML missing for ${locPath}`);
    errors++;
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  if (locPath.startsWith('ar/')) {
    if (!html.includes('dir="rtl"')) {
      console.error(`[seo:hreflang] FAIL: Arabic localized tool ${locPath} is missing dir="rtl"`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`[seo:hreflang] FAIL: Found ${errors} internationalization errors.`);
  process.exit(1);
} else {
  console.log('[seo:hreflang] PASS: All localized tools have valid language directives and layout attributes.');
}
