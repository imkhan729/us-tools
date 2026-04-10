const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const toolsPath = path.join(rootDir, "src", "data", "tools.ts");
const appPath = path.join(rootDir, "src", "App.tsx");
const publicDir = path.join(rootDir, "public");
const siteUrl = "https://usonlinetools.com";
const today = new Date().toISOString().slice(0, 10);

function loadToolsModule() {
  const source = fs.readFileSync(toolsPath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
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
  vm.runInNewContext(transpiled, sandbox, { filename: toolsPath });
  return sandbox.module.exports;
}

function extractExactRoutes() {
  const source = fs.readFileSync(appPath, "utf8");
  const routes = new Set();
  const routeRegex = /<Route\s+path="([^"]+)"/g;
  let match;

  while ((match = routeRegex.exec(source))) {
    const route = match[1];
    if (!route.includes(":")) {
      routes.add(route);
    }
  }

  return routes;
}

function toUrl(pathname) {
  return `${siteUrl}${pathname === "/" ? "" : pathname}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemap(routes) {
  const urls = Array.from(routes)
    .sort((a, b) => a.localeCompare(b))
    .map((pathname) => `  <url><loc>${escapeXml(toUrl(pathname))}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nHost: usonlinetools.com\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function buildHtaccess(redirects) {
  const redirectRules = Array.from(redirects.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([from, to]) => `RewriteRule ^${from.replace(/^\//, "").replace(/\//g, "\\/")}\\/?$ ${to} [R=301,L]`)
    .join("\n");

  return `Options -Indexes\n\nRewriteEngine On\n\n# Force HTTPS\nRewriteCond %{HTTPS} !=on\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n# Canonical page redirects\n${redirectRules}\n\n# SPA fallback for client-side routing\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ /index.html [L]\n`;
}

function main() {
  const tools = loadToolsModule();
  const exactRoutes = extractExactRoutes();
  const canonicalRoutes = new Set([
    "/",
    "/about",
    "/privacy-policy",
    "/terms-of-service",
    ...tools.DISPLAY_TOOL_CATEGORIES.map((category) => `/category/${category.id}`),
    ...tools.DISPLAY_ALL_TOOLS
      .filter((tool) => tool.implemented !== false)
      .map((tool) => tools.getCanonicalToolPath(tool.slug)),
  ]);

  const redirects = new Map();

  for (const tool of tools.ALL_TOOLS) {
    const canonicalPath = tools.getCanonicalToolPath(tool.slug);
    const legacyToolsPath = `/tools/${tool.slug}`;

    if (legacyToolsPath !== canonicalPath) {
      redirects.set(legacyToolsPath, canonicalPath);
    }
  }

  for (const route of exactRoutes) {
    if (canonicalRoutes.has(route) || route.startsWith("/category/")) {
      continue;
    }

    const slug = route.split("/").filter(Boolean).at(-1);
    if (!slug) {
      continue;
    }

    const tool = tools.getToolBySlug(slug);
    if (!tool) {
      continue;
    }

    const canonicalPath = tools.getCanonicalToolPath(slug);
    if (route !== canonicalPath) {
      redirects.set(route, canonicalPath);
    }
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap(canonicalRoutes));
  fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobots());
  fs.writeFileSync(path.join(publicDir, ".htaccess"), buildHtaccess(redirects));
}

main();
