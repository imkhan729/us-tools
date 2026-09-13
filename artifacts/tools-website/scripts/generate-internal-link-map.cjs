const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const repo = path.resolve(root, '..', '..');
const toolsPath = path.join(root, 'src', 'data', 'tools.ts');
const docsDir = path.join(repo, 'docs', 'seo');

function loadTools() {
  const source = fs.readFileSync(toolsPath, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const sandbox = {
    exports: {},
    module: { exports: {} },
    require,
    console,
    process,
    __dirname: path.dirname(toolsPath),
    __filename: toolsPath,
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(code, sandbox, { filename: toolsPath });
  return sandbox.module.exports;
}

function csv(val) {
  return '"' + String(val ?? '').replace(/"/g, '""') + '"';
}

function main() {
  const toolsModule = loadTools();
  const allTools = toolsModule.DISPLAY_ALL_TOOLS || [];
  const categories = toolsModule.DISPLAY_TOOL_CATEGORIES || [];

  const rows = [
    [
      'source_url',
      'source_title',
      'page_type',
      'category',
      'parent_hub_url',
      'breadcrumb_trail',
      'companion_cluster_urls',
      'target_depth'
    ]
  ];

  // Homepage
  rows.push([
    'https://usonlinetools.com',
    'US Online Tools - Free Fast Online Utilities',
    'homepage',
    'root',
    '',
    'Home',
    categories.map(c => 'https://usonlinetools.com/category/' + c.id).join(' | '),
    '0'
  ]);

  // Categories
  for (const cat of categories) {
    const catUrl = 'https://usonlinetools.com/category/' + cat.id;
    const toolUrls = cat.tools.map(t => 'https://usonlinetools.com' + toolsModule.getCanonicalToolPath(t.slug));
    rows.push([
      catUrl,
      cat.name + ' Tools',
      'category_hub',
      cat.id,
      'https://usonlinetools.com',
      'Home > ' + cat.name,
      toolUrls.slice(0, 8).join(' | '),
      '1'
    ]);
  }

  // Tools
  for (const tool of allTools) {
    if (tool.implemented === false) continue;
    const toolCanonical = 'https://usonlinetools.com' + toolsModule.getCanonicalToolPath(tool.slug);
    const catId = toolsModule.getCategoryIdBySlug(tool.slug);
    const cat = categories.find(c => c.id === catId);
    const parentHub = 'https://usonlinetools.com/category/' + catId;
    const related = toolsModule.getRelatedTools(tool.slug, tool.category, 6);
    const companionUrls = related.map(r => 'https://usonlinetools.com' + toolsModule.getCanonicalToolPath(r.slug));

    rows.push([
      toolCanonical,
      tool.title,
      'tool_page',
      catId,
      parentHub,
      'Home > ' + (cat ? cat.name : catId) + ' > ' + tool.title,
      companionUrls.join(' | '),
      '2'
    ]);
  }

  const csvContent = rows.map(r => r.map(csv).join(',')).join('\n') + '\n';
  fs.writeFileSync(path.join(docsDir, 'INTERNAL_LINK_MAP.csv'), csvContent, 'utf8');
  console.log('Wrote INTERNAL_LINK_MAP.csv with ' + (rows.length - 1) + ' entries.');
}

main();
