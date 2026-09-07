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

function buildUrlSet(routes) {
  const urls = Array.from(routes)
    .sort((a, b) => a.localeCompare(b))
    .map((pathname) => `  <url><loc>${escapeXml(toUrl(pathname))}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildSitemapIndex(sitemaps) {
  const entries = sitemaps
    .sort((a, b) => a.localeCompare(b))
    .map((pathname) => `  <sitemap><loc>${escapeXml(toUrl(pathname))}</loc><lastmod>${today}</lastmod></sitemap>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function buildHtaccess(redirects) {
  const redirectRules = Array.from(redirects.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([from, to]) => {
      const sourcePattern = from.replace(/^\//, "").replace(/\//g, "\\/");
      const suffix = to.endsWith("/") ? "$" : "\\/?$";
      return `RewriteRule ^${sourcePattern}${suffix} ${to} [R=301,L]`;
    })
    .join("\n");

  return `Options -Indexes\nDirectoryIndex index.html\nErrorDocument 404 /404.html\n\n<IfModule mod_headers.c>\n  <FilesMatch "\\.(?:css|js|mjs)$">\n    Header set Cache-Control "public, max-age=31536000, immutable"\n  </FilesMatch>\n  <FilesMatch "\\.(?:woff2?|ttf|otf|eot)$">\n    Header set Cache-Control "public, max-age=31536000, immutable"\n  </FilesMatch>\n  <FilesMatch "\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico)$">\n    Header set Cache-Control "public, max-age=2592000"\n  </FilesMatch>\n  <FilesMatch "^(?:robots\\.txt|sitemap(?:-[a-z0-9-]+)?\\.xml)$">\n    Header set Cache-Control "public, max-age=3600"\n  </FilesMatch>\n  <FilesMatch "^(?:index|404)\\.html$">\n    Header set Cache-Control "no-cache, must-revalidate"\n  </FilesMatch>\n</IfModule>\n\nRewriteEngine On\n\n# Force HTTPS and the non-www canonical host.\nRewriteCond %{HTTPS} !=on [OR]\nRewriteCond %{HTTP_HOST} ^www\\.usonlinetools\\.com$ [NC]\nRewriteRule ^ https://usonlinetools.com%{REQUEST_URI} [L,R=301]\n\n# Use one canonical URL format for indexed pages.\n# Most canonical tags use no trailing slash, except selected slash-canonical pages.\nRewriteCond %{REQUEST_URI} !^/calculators/ovulation-calculator/$ [NC]\nRewriteCond %{REQUEST_URI} .+/$\nRewriteRule ^(.+)/$ /$1 [R=301,L]\n\n# Canonical page redirects\n${redirectRules}\n\n# Serve prerendered clean URLs without requiring Apache's directory slash redirect.\nRewriteCond %{REQUEST_FILENAME}/index.html -f\nRewriteRule ^(.+)$ $1/index.html [L]\n\n# Serve existing files directly\nRewriteCond %{REQUEST_FILENAME} -f\nRewriteRule ^ - [L]\n\n# Return a real 404 for unknown paths instead of a soft-404 SPA fallback\nRewriteRule ^ - [R=404,L]\n`;
}

function main() {
  const tools = loadToolsModule();
  const exactRoutes = extractExactRoutes();
  const newLocalizedToolRoutes = [
    "/yuzde-hesaplama",
    "/ar/hesab-alomr",
    "/ar/tahweel-altareekh",
    "/calculadora-juros-compostos",
    "/kalkulator-umur",
    "/kdv-hesaplama",
    "/calculo-rescisao",
    "/calculo-ferias",
    "/kidem-tazminati-hesaplama",
    "/kalkulator-vat",
  ];
  const canonicalRoutes = new Set([
    "/",
    "/about",
    "/privacy-policy",
    "/terms-of-service",
    ...tools.DISPLAY_TOOL_CATEGORIES.map((category) => `/category/${category.id}`),
    ...tools.DISPLAY_ALL_TOOLS
      .filter((tool) => tool.implemented !== false)
      .map((tool) => tools.getCanonicalToolPath(tool.slug)),
    ...newLocalizedToolRoutes,
  ]);
  const staticAndCategoryRoutes = new Set([
    "/",
    "/about",
    "/privacy-policy",
    "/terms-of-service",
    ...tools.DISPLAY_TOOL_CATEGORIES.map((category) => `/category/${category.id}`),
  ]);
  const toolRoutesByCategory = new Map(
    tools.DISPLAY_TOOL_CATEGORIES.map((category) => [category.id, new Set()]),
  );

  for (const tool of tools.DISPLAY_ALL_TOOLS.filter((entry) => entry.implemented !== false)) {
    const canonicalPath = tools.getCanonicalToolPath(tool.slug);
    const categoryId = tools.getCategoryIdBySlug(canonicalPath.split("/").filter(Boolean).at(-1) ?? tool.slug);
    if (!toolRoutesByCategory.has(categoryId)) {
      toolRoutesByCategory.set(categoryId, new Set());
    }
    toolRoutesByCategory.get(categoryId).add(canonicalPath);
  }

  const redirects = new Map();

  for (const tool of tools.ALL_TOOLS) {
    const canonicalPath = tools.getCanonicalToolPath(tool.slug);
    const legacyToolsPath = `/tools/${tool.slug}`;
    const categoryLegacyPath = `/${tools.getCategoryIdBySlug(tool.slug)}/${tool.slug}`;
    const canonicalSlug = canonicalPath.split("/").filter(Boolean).at(-1);
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

  const sitemapPaths = ["/sitemap-pages.xml"];
  fs.writeFileSync(path.join(publicDir, "sitemap-pages.xml"), buildUrlSet(staticAndCategoryRoutes));
  sitemapPaths.push("/sitemap-new-tools.xml");
  fs.writeFileSync(path.join(publicDir, "sitemap-new-tools.xml"), buildUrlSet(newLocalizedToolRoutes));

  for (const [categoryId, routes] of toolRoutesByCategory.entries()) {
    if (!routes.size) {
      continue;
    }

    const filename = `sitemap-tools-${categoryId}.xml`;
    sitemapPaths.push(`/${filename}`);
    fs.writeFileSync(path.join(publicDir, filename), buildUrlSet(routes));
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemapIndex(sitemapPaths));
  fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobots());
  fs.writeFileSync(path.join(publicDir, ".htaccess"), buildHtaccess(redirects));
}

main();
