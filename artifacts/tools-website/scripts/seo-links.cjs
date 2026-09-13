const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
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

const files = getHtmlFiles(distPublic);
console.log(`[seo:links] Auditing internal links across ${files.length} static HTML files...`);

let totalLinksChecked = 0;
const errors = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(distPublic, file).replace(/\\/g, '/');
  
  const linkMatches = html.matchAll(/href=["'](\/[^"'#?]*)/g);
  for (const match of linkMatches) {
    const target = match[1];
    totalLinksChecked++;

    if (target === '/' || target.startsWith('/assets/') || target.startsWith('/images/')) {
      continue;
    }

    const cleanTarget = target.replace(/^\//, '');
    const targetHtml1 = path.join(distPublic, cleanTarget, 'index.html');
    const targetHtml2 = path.join(distPublic, `${cleanTarget}.html`);
    const targetDir = path.join(distPublic, cleanTarget);

    if (!fs.existsSync(targetHtml1) && !fs.existsSync(targetHtml2) && !fs.existsSync(targetDir)) {
      errors.push(`[${relPath}] Broken link to -> ${target}`);
    }
  }
}

console.log(`[seo:links] Checked ${totalLinksChecked} internal link references.`);
if (errors.length > 0) {
  console.error(`[seo:links] FAIL: Found ${errors.length} broken internal links:`);
  errors.slice(0, 10).forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log(`[seo:links] PASS: Zero broken internal links detected.`);
}
