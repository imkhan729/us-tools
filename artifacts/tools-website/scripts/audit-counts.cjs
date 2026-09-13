const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const toolsPath = path.join(rootDir, 'src', 'data', 'tools.ts');
const appPath = path.join(rootDir, 'src', 'App.tsx');

const source = fs.readFileSync(toolsPath, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
const sandbox = { exports: {}, module: { exports: {} }, require, console, process, __dirname: path.dirname(toolsPath), __filename: toolsPath };
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(transpiled, sandbox, { filename: toolsPath });
const toolsMod = sandbox.module.exports;

const appSource = fs.readFileSync(appPath, 'utf8');
const routeRegex = /<Route\s+path="([^"]+)"/g;
let match;
const routes = new Set();
while ((match = routeRegex.exec(appSource))) {
  routes.add(match[1]);
}

const allTools = toolsMod.DISPLAY_ALL_TOOLS || [];
const categories = toolsMod.TOOL_CATEGORIES || [];
const implemented = allTools.filter(t => t.implemented !== false);

const publicToolRoutes = [...routes].filter(r => !r.startsWith('/category/') && !r.startsWith('/about') && !r.startsWith('/privacy') && !r.startsWith('/terms') && !r.startsWith('/contact') && r !== '/' && !r.startsWith('/ar/') && !r.startsWith('/tr/') && !r.startsWith('/pt-br/') && !r.startsWith('/id/'));
const categoryRoutes = [...routes].filter(r => r.startsWith('/category/'));
const langRoutes = [...routes].filter(r => r.startsWith('/ar/') || r.startsWith('/tr/') || r.startsWith('/pt-br/') || r.startsWith('/id/'));

const redirects = [];
const redirectRegex = /<Route\s+path="([^"]+)"[^>]*>\s*<Redirect\s+to="([^"]+)"/gs;
while ((match = redirectRegex.exec(appSource))) {
  redirects.push({ from: match[1], to: match[2] });
}

console.log('=== AUDIT COUNTS ===');
console.log('Total Tool Definitions (Catalog):', allTools.length);
console.log('Implemented Tools:', implemented.length);
console.log('Total Categories:', categories.length);
console.log('Total Routes in App.tsx:', routes.size);
console.log('Public Tool Routes in App.tsx:', publicToolRoutes.length);
console.log('Category Routes in App.tsx:', categoryRoutes.length);
console.log('Language Routes (i18n):', langRoutes.length);
console.log('Redirect Routes in App.tsx:', redirects.length);
console.log('\nCategories breakdown:');
for (const cat of categories) {
  console.log(`- ${cat.name} (${cat.id}): ${cat.tools.length} tools`);
}
