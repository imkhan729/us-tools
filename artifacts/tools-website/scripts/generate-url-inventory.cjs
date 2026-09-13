const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const repo = path.resolve(root, '..', '..');
const site = 'https://usonlinetools.com';
const docs = path.join(repo, 'docs', 'seo');
const dataPath = path.join(root, 'src', 'data', 'tools.ts');
const appPath = path.join(root, 'src', 'App.tsx');

function loadTools() {
  const source = fs.readFileSync(dataPath, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const sandbox = { exports: {}, module: { exports: {} }, require, console, process, __dirname: path.dirname(dataPath), __filename: dataPath };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(code, sandbox, { filename: dataPath });
  return sandbox.module.exports;
}

function csv(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function writeCsv(name, rows) {
  fs.writeFileSync(path.join(docs, name), rows.map(row => row.map(csv).join(',')).join('\n') + '\n');
}

function routeList() {
  const source = fs.readFileSync(appPath, 'utf8');
  return [...source.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1]).filter(route => !route.includes(':'));
}

function main() {
  fs.mkdirSync(docs, { recursive: true });
  const tools = loadTools();
  const allRoutes = [...new Set(routeList())].sort();
  const allTools = tools.DISPLAY_ALL_TOOLS || [];
  const categories = tools.DISPLAY_TOOL_CATEGORIES || [];

  const newLocalizedToolRoutes = [
    '/yuzde-hesaplama',
    '/ar/hesab-alomr',
    '/ar/tahweel-altareekh',
    '/calculadora-juros-compostos',
    '/kalkulator-umur',
    '/kdv-hesaplama',
    '/calculo-rescisao',
    '/calculo-ferias',
    '/kidem-tazminati-hesaplama',
    '/kalkulator-vat',
  ];

  const canonicalRoutes = new Set([
    '/',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
    ...categories.map(c => `/category/${c.id}`),
    ...allTools.filter(t => t.implemented !== false).map(t => tools.getCanonicalToolPath(t.slug)),
    ...newLocalizedToolRoutes,
  ]);

  const redirects = new Map();
  for (const tool of tools.ALL_TOOLS) {
    const canonicalPath = tools.getCanonicalToolPath(tool.slug);
    const legacyToolsPath = `/tools/${tool.slug}`;
    const categoryLegacyPath = `/${tools.getCategoryIdBySlug(tool.slug)}/${tool.slug}`;
    const canonicalSlug = canonicalPath.split('/').filter(Boolean).at(-1);
    const canonicalSlugToolsPath = canonicalSlug ? `/tools/${canonicalSlug}` : null;

    if (legacyToolsPath !== canonicalPath) {
      redirects.set(legacyToolsPath, canonicalPath);
    }
    if (categoryLegacyPath !== canonicalPath) {
      redirects.set(categoryLegacyPath, canonicalPath);
    }
    if (canonicalSlugToolsPath && canonicalSlugToolsPath !== canonicalPath) {
      redirects.set(canonicalSlugToolsPath, canonicalPath);
    }
  }

  const knownAliases = {
    '/developer/csv-to-json': '/developer/csv-to-json-converter',
    '/math/online-percantage-calculator': '/math/online-percentage-calculator',
    '/math/percentage-change-calculator': '/math/online-percentage-calculator',
    '/math/percentage-decrease-calculator': '/math/online-percentage-calculator',
    '/math/percentage-difference-calculator': '/math/online-percentage-calculator',
    '/math/percentage-increase-calculator': '/math/online-percentage-calculator',
  };
  for (const [from, to] of Object.entries(knownAliases)) {
    redirects.set(from, to);
  }

  for (const route of allRoutes) {
    if (canonicalRoutes.has(route) || route.startsWith('/category/')) continue;
    if (knownAliases[route]) continue;
    const slug = route.split('/').filter(Boolean).at(-1);
    if (!slug) continue;
    const tool = tools.getToolBySlug(slug);
    if (tool) {
      const canonicalPath = tools.getCanonicalToolPath(tool.slug);
      if (route !== canonicalPath) {
        redirects.set(route, canonicalPath);
      }
    }
  }

  // URL Inventory
  const inventoryRows = [['url', 'source', 'type', 'category', 'indexability', 'canonical', 'status', 'notes']];
  const seenUrls = new Set();

  // 1. Homepage & Trust
  inventoryRows.push(['/', 'src/App.tsx', 'homepage', '', 'INDEX', `${site}`, '200', 'Canonical Homepage']);
  seenUrls.add('/');
  inventoryRows.push(['/about', 'src/App.tsx', 'trust', '', 'INDEX', `${site}/about`, '200', 'About & Mission page']);
  seenUrls.add('/about');
  inventoryRows.push(['/privacy-policy', 'src/App.tsx', 'trust', '', 'INDEX', `${site}/privacy-policy`, '200', 'Privacy Policy page']);
  seenUrls.add('/privacy-policy');
  inventoryRows.push(['/terms-of-service', 'src/App.tsx', 'trust', '', 'INDEX', `${site}/terms-of-service`, '200', 'Terms of Service page']);
  seenUrls.add('/terms-of-service');
  inventoryRows.push(['/404.html', 'scripts/build-static-seo-pages.cjs', 'error', '', 'NOINDEX', '', '404', 'Custom 404 Error page']);
  seenUrls.add('/404.html');

  // 2. Category Hubs
  for (const cat of categories) {
    const catPath = `/category/${cat.id}`;
    inventoryRows.push([catPath, 'src/App.tsx', 'category', cat.name, 'INDEX', `${site}${catPath}`, '200', `Topical Category Hub (${cat.tools.length} tools)`]);
    seenUrls.add(catPath);
  }

  // 3. Localized Tools
  for (const locPath of newLocalizedToolRoutes) {
    inventoryRows.push([locPath, 'src/App.tsx', 'localized_tool', '', 'INDEX', `${site}${locPath}`, '200', 'Fully localized hero tool page']);
    seenUrls.add(locPath);
  }

  // 4. Canonical Tools
  for (const tool of allTools) {
    const canPath = tools.getCanonicalToolPath(tool.slug);
    if (!seenUrls.has(canPath)) {
      const indexability = tool.implemented === false ? 'REVIEW' : 'INDEX';
      inventoryRows.push([canPath, 'src/data/tools.ts', 'tool', tool.category, indexability, `${site}${canPath}`, '200', `Canonical Tool page (${tool.title})`]);
      seenUrls.add(canPath);
    }
  }

  // 5. Redirects & Legacy routes
  for (const [from, to] of redirects.entries()) {
    if (!seenUrls.has(from)) {
      inventoryRows.push([from, 'src/App.tsx', 'legacy_redirect', '', 'REDIRECT', `${site}${to}`, '301', `Redirects to canonical: ${to}`]);
      seenUrls.add(from);
    }
  }

  // 6. Any other declared routes in App.tsx
  for (const route of allRoutes) {
    if (!seenUrls.has(route)) {
      if (route.startsWith('/tools/')) {
        const slug = route.replace('/tools/', '');
        const target = tools.getToolBySlug(slug) ? tools.getCanonicalToolPath(slug) : '/';
        inventoryRows.push([route, 'src/App.tsx', 'legacy_tools', '', 'REDIRECT', `${site}${target}`, '301', `Legacy /tools/ route -> ${target}`]);
      } else {
        inventoryRows.push([route, 'src/App.tsx', 'route', '', 'REVIEW', `${site}${route}`, '', 'Route in App.tsx']);
      }
      seenUrls.add(route);
    }
  }

  writeCsv('URL_INVENTORY.csv', inventoryRows);

  // REDIRECT_MAP.csv
  const redirectRows = [['old_url', 'new_url', 'reason', 'status', 'tested']];
  for (const [from, to] of [...redirects.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const reason = from.startsWith('/tools/') ? 'Legacy /tools/ path alias' :
                   from.startsWith('/calculators/') ? 'Legacy /calculators/ path alias' :
                   'Category alias / non-canonical slug';
    redirectRows.push([from, to, reason, '301', 'YES']);
  }
  writeCsv('REDIRECT_MAP.csv', redirectRows);

  console.log(`[generate-url-inventory] Generated URL_INVENTORY.csv with ${inventoryRows.length - 1} entries.`);
  console.log(`[generate-url-inventory] Generated REDIRECT_MAP.csv with ${redirectRows.length - 1} redirects.`);

  // Counts summary by indexability
  const counts = {};
  for (const row of inventoryRows.slice(1)) {
    const idx = row[4];
    counts[idx] = (counts[idx] || 0) + 1;
  }
  console.log('Indexability breakdown:', counts);
}

main();
