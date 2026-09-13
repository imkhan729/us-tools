const fs = require('fs');
const path = require('path');

const distPublic = path.join(__dirname, '../dist/public');

function getHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = getHtmlFiles(distPublic);
const files = allFiles.filter(f => !path.basename(f).startsWith('google') && !path.basename(f).startsWith('yandex'));

console.log(`[seo:schema] Validating JSON-LD schema graphs across ${files.length} static HTML pages...`);

let validSchemas = 0;
let totalNodes = 0;
let errors = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(distPublic, file).replace(/\\/g, '/');

  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length === 0) {
    console.error(`[${relPath}] Missing JSON-LD script tag`);
    errors++;
    continue;
  }

  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (!parsed['@context'] || !parsed['@graph']) {
        console.error(`[${relPath}] Invalid JSON-LD schema graph structure`);
        errors++;
      } else {
        validSchemas++;
        totalNodes += parsed['@graph'].length;
      }
    } catch (e) {
      console.error(`[${relPath}] Syntax error parsing JSON-LD: ${e.message}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`[seo:schema] FAIL: Found ${errors} JSON-LD schema errors.`);
  process.exit(1);
} else {
  console.log(`[seo:schema] PASS: Successfully validated ${validSchemas} JSON-LD graphs containing ${totalNodes} schema nodes with 0 syntax errors.`);
}
