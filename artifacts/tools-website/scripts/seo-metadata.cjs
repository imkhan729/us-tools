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
// Filter out third-party verification files
const files = allFiles.filter(f => !path.basename(f).startsWith('google') && !path.basename(f).startsWith('yandex'));

console.log(`[seo:metadata] Auditing metadata across ${files.length} static HTML pages...`);

const errors = [];
const titles = new Map();

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(distPublic, file).replace(/\\/g, '/');
  const is404 = file.endsWith('404.html');

  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push(`[${relPath}] Missing <title> tag`);
  } else {
    const title = titleMatch[1].trim();
    if (!is404 && titles.has(title)) {
      errors.push(`[${relPath}] Duplicate title "${title}" previously seen in ${titles.get(title)}`);
    } else {
      titles.set(title, relPath);
    }
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    errors.push(`[${relPath}] Missing meta description`);
  }

  // Single H1 check on indexable pages
  if (!is404) {
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) {
      errors.push(`[${relPath}] Expected exactly 1 H1 tag, found ${h1Count}`);
    }
  }

  // Canonical check
  if (is404) {
    if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
      errors.push(`[${relPath}] 404 page must contain noindex robots tag`);
    }
  } else {
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    if (!canonicalMatch) {
      errors.push(`[${relPath}] Missing canonical link tag`);
    } else if (!canonicalMatch[1].startsWith('https://usonlinetools.com')) {
      errors.push(`[${relPath}] Invalid canonical host: ${canonicalMatch[1]}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`[seo:metadata] FAIL: Found ${errors.length} metadata errors:`);
  errors.slice(0, 10).forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log(`[seo:metadata] PASS: All ${files.length} static pages have unique titles, descriptions, single H1s, and valid canonicals.`);
}
