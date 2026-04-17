const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const toolsWebsiteRoot = path.resolve(__dirname, "..");
const toolsPath = path.join(toolsWebsiteRoot, "src", "data", "tools.ts");
const distPublicDir = path.join(toolsWebsiteRoot, "dist", "public");
const templatePath = path.join(distPublicDir, "index.html");

const SITE_NAME = "US Online Tools";
const SITE_URL = "https://usonlinetools.com";
const SITE_DESCRIPTION =
  "Free online calculators, converters, generators, and browser-based utility tools.";
const SITE_LANGUAGE = "en-US";
const SITE_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
const SITE_LOGO = `${SITE_URL}/favicon.svg`;
const SITE_TWITTER_HANDLE = "@usonlinetools";
const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

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

function ensureBuildOutput() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing build template: ${templatePath}`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "") || "/";
}

function toAbsoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
}

function normalizeSchemaTypes(typeValue) {
  if (Array.isArray(typeValue)) {
    return typeValue.filter((item) => typeof item === "string");
  }

  return typeof typeValue === "string" ? [typeValue] : [];
}

function getBreadcrumbTarget(node) {
  const itemListElement = Array.isArray(node.itemListElement) ? node.itemListElement : [];
  const lastItem = itemListElement.at(-1);

  if (!lastItem || typeof lastItem !== "object") {
    return null;
  }

  return typeof lastItem.item === "string" ? lastItem.item : null;
}

function getSchemaNodeKey(node) {
  const types = normalizeSchemaTypes(node["@type"]);
  const url = typeof node.url === "string" ? node.url : null;
  const id = typeof node["@id"] === "string" ? node["@id"] : null;
  const entityKey = url ?? (id ? id.replace(/#.*$/, "") : null);

  if (types.includes("WebSite")) {
    return `website:${entityKey ?? SITE_URL}`;
  }

  if (types.includes("Organization")) {
    return `organization:${entityKey ?? SITE_URL}`;
  }

  if (types.includes("WebPage")) {
    return `webpage:${entityKey ?? "page"}`;
  }

  if (types.includes("CollectionPage")) {
    return `collection:${entityKey ?? "collection"}`;
  }

  if (types.includes("AboutPage")) {
    return `about:${entityKey ?? "about"}`;
  }

  if (types.includes("BreadcrumbList")) {
    return `breadcrumb:${getBreadcrumbTarget(node) ?? entityKey ?? "page"}`;
  }

  if (types.includes("FAQPage")) {
    return `faq:${entityKey ?? "page"}`;
  }

  if (types.includes("HowTo")) {
    return `howto:${entityKey ?? "page"}`;
  }

  if (types.includes("SoftwareApplication") || types.includes("WebApplication")) {
    return `app:${entityKey ?? (typeof node.name === "string" ? node.name : "page")}`;
  }

  if (id) {
    return `id:${id}`;
  }

  return `node:${types.sort().join("|")}:${entityKey ?? ""}:${typeof node.name === "string" ? node.name : ""}`;
}

function dedupeSchemaNodes(nodes) {
  const deduped = new Map();

  for (const node of nodes) {
    if (!node || typeof node !== "object" || Object.keys(node).length === 0) {
      continue;
    }

    deduped.set(getSchemaNodeKey(node), node);
  }

  return Array.from(deduped.values());
}

function createOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO,
    },
    image: SITE_OG_IMAGE,
  };
}

function createWebsiteSchema(description) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description,
    inLanguage: SITE_LANGUAGE,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function createWebPageSchema(canonicalUrl, name, description) {
  return {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: SITE_OG_IMAGE,
    },
  };
}

function createBreadcrumbSchema(items) {
  const lastItem = items.at(-1)?.item;

  return {
    "@type": "BreadcrumbList",
    ...(lastItem ? { "@id": `${lastItem}#breadcrumb` } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function createCollectionPageSchema(canonicalUrl, name, description) {
  return {
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    name,
    url: canonicalUrl,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

function createWebApplicationSchema(name, canonicalUrl, description, category) {
  return {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${canonicalUrl}#webapplication`,
    name,
    url: canonicalUrl,
    description,
    applicationCategory: category,
    isAccessibleForFree: true,
    inLanguage: SITE_LANGUAGE,
    image: SITE_OG_IMAGE,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@id": `${canonicalUrl}#webpage`,
    },
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

function buildSchemaGraph({ canonicalUrl, title, description, customNodes = [] }) {
  return {
    "@context": "https://schema.org",
    "@graph": dedupeSchemaNodes([
      createWebsiteSchema(SITE_DESCRIPTION),
      createOrganizationSchema(),
      createWebPageSchema(canonicalUrl, title, description),
      ...customNodes,
    ]),
  };
}

function extractAssetTags(templateHtml) {
  const tagMatches = templateHtml.match(/<script\b[^>]*><\/script>|<link\b[^>]*>/g) ?? [];
  return tagMatches
    .filter((tag) => tag.includes("stylesheet") || tag.includes("modulepreload") || tag.startsWith("<script"))
    .join("\n    ");
}

function extractBodyContent(templateHtml) {
  const match = templateHtml.match(/<body>([\s\S]*?)<\/body>/i);
  return match ? match[1].trim() : '<div id="root"></div>';
}

function renderHtml({
  title,
  description,
  canonicalUrl,
  schemaGraph,
  assetTags,
  bodyContent,
  robots = DEFAULT_ROBOTS,
}) {
  const serializedSchema = JSON.stringify(schemaGraph).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="${SITE_LANGUAGE}">
  <head>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6438644207209483" crossorigin="anonymous"></script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="application-name" content="${SITE_NAME}" />
    <meta name="theme-color" content="#ff6b35" />
    <meta name="color-scheme" content="light dark" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${SITE_OG_IMAGE}" />
    <meta property="og:image:secure_url" content="${SITE_OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="${SITE_NAME} preview image" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${SITE_TWITTER_HANDLE}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_OG_IMAGE}" />
    <meta name="twitter:image:alt" content="${SITE_NAME} preview image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="en-us" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="x-default" href="${canonicalUrl}" />
    <link rel="icon" type="image/svg+xml" href="${SITE_LOGO}" />
    <script type="application/ld+json" data-schema-graph="primary">${serializedSchema}</script>
    ${assetTags}
  </head>
  <body>
    ${bodyContent}
    <noscript>This site works best with JavaScript enabled.</noscript>
  </body>
</html>
`;
}

function writeRouteHtml(routePath, html) {
  const normalized = normalizePath(routePath);
  const targetPath =
    normalized === "/"
      ? templatePath
      : /\.[a-z0-9]+$/i.test(normalized)
        ? path.join(distPublicDir, normalized.replace(/^\//, ""))
      : path.join(distPublicDir, normalized.replace(/^\//, ""), "index.html");

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, html);
}

function getToolApplicationCategory(categoryId) {
  switch (categoryId) {
    case "education":
      return "EducationalApplication";
    case "health":
      return "HealthApplication";
    case "image":
      return "MultimediaApplication";
    case "pdf":
      return "UtilitiesApplication";
    default:
      return "UtilityApplication";
  }
}

function getToolHeading(title) {
  return /^online\b/i.test(title) ? title : `Online ${title}`;
}

function buildRoutes(tools) {
  const routes = [];
  const homepageTools = tools.DISPLAY_ALL_TOOLS.filter((tool) => tool.implemented !== false);
  const homeDescription = `${tools.SITE_TOOL_COUNT} free online tools including calculators, converters, generators, and utilities. No signup required. 100% free at usonlinetools.com.`;

  routes.push({
    path: "/",
    title: `Free Online Tools - ${SITE_NAME}`,
    description: homeDescription,
    canonicalUrl: SITE_URL,
    schemaGraph: buildSchemaGraph({
      canonicalUrl: SITE_URL,
      title: `Free Online Tools - ${SITE_NAME}`,
      description: homeDescription,
      customNodes: [
        createCollectionPageSchema(
          SITE_URL,
          `${SITE_NAME} Home`,
          `${tools.SITE_TOOL_COUNT} free online tools including calculators, converters, generators, and utilities.`,
        ),
      ],
    }),
  });

  for (const category of tools.DISPLAY_TOOL_CATEGORIES) {
    const canonicalUrl = `${SITE_URL}/category/${category.id}`;
    const description = `${category.description}. ${category.tools.length} free online ${category.name.toLowerCase()} tools. No signup required.`;

    routes.push({
      path: `/category/${category.id}`,
      title: `${category.name} - Free Online Tools | ${SITE_NAME}`,
      description,
      canonicalUrl,
      schemaGraph: buildSchemaGraph({
        canonicalUrl,
        title: `${category.name} - Free Online Tools | ${SITE_NAME}`,
        description,
        customNodes: [
          createCollectionPageSchema(canonicalUrl, `${category.name} Tools`, description),
          createBreadcrumbSchema([
            { name: "Home", item: SITE_URL },
            { name: category.name, item: canonicalUrl },
          ]),
        ],
      }),
    });
  }

  const staticPages = [
    {
      path: "/about",
      title: `About ${SITE_NAME} | ${SITE_NAME}`,
      description:
        "Learn what US Online Tools is, how the site works, and why the calculators, converters, and generators are built for fast browser-based use.",
      customNodes: [
        {
          "@type": "AboutPage",
          name: `About ${SITE_NAME}`,
          url: `${SITE_URL}/about`,
          description:
            "Learn what US Online Tools is, how the site works, and why the calculators, converters, and generators are built for fast browser-based use.",
        },
        createBreadcrumbSchema([
          { name: "Home", item: SITE_URL },
          { name: "About", item: `${SITE_URL}/about` },
        ]),
      ],
    },
    {
      path: "/privacy-policy",
      title: `Privacy Policy | ${SITE_NAME}`,
      description:
        "Read the privacy policy for US Online Tools, including how browser-based tools process data and what limited information may be collected by hosting infrastructure.",
      customNodes: [
        createBreadcrumbSchema([
          { name: "Home", item: SITE_URL },
          { name: "Privacy Policy", item: `${SITE_URL}/privacy-policy` },
        ]),
      ],
    },
    {
      path: "/terms-of-service",
      title: `Terms of Service | ${SITE_NAME}`,
      description:
        "Review the terms of service for using US Online Tools, including acceptable use, informational disclaimers, and site availability limitations.",
      customNodes: [
        createBreadcrumbSchema([
          { name: "Home", item: SITE_URL },
          { name: "Terms of Service", item: `${SITE_URL}/terms-of-service` },
        ]),
      ],
    },
    {
      path: "/404.html",
      title: `404 - Page Not Found | ${SITE_NAME}`,
      description: "The requested page could not be found on US Online Tools.",
      robots: "noindex, follow",
      customNodes: [],
    },
  ];

  for (const page of staticPages) {
    const canonicalUrl = `${SITE_URL}${page.path}`;
    routes.push({
      path: page.path,
      title: page.title,
      description: page.description,
      robots: page.robots,
      canonicalUrl,
      schemaGraph: buildSchemaGraph({
        canonicalUrl,
        title: page.title,
        description: page.description,
        customNodes: page.customNodes,
      }),
    });
  }

  const canonicalToolPaths = Array.from(
    new Set(homepageTools.map((tool) => tools.getCanonicalToolPath(tool.slug))),
  );

  for (const canonicalPath of canonicalToolPaths) {
    const canonicalSlug = canonicalPath.split("/").filter(Boolean).at(-1);
    if (!canonicalSlug) {
      continue;
    }

    const tool =
      tools.ALL_TOOLS.find((entry) => entry.slug === canonicalSlug) ??
      tools.DISPLAY_ALL_TOOLS.find((entry) => entry.slug === canonicalSlug) ??
      tools.getToolBySlug(canonicalSlug);
    if (!tool) {
      continue;
    }

    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const categoryId = tools.getCategoryIdBySlug(canonicalSlug);
    const category = tools.DISPLAY_TOOL_CATEGORIES.find((entry) => entry.id === categoryId);
    const pageHeading = getToolHeading(tool.title);
    const pageTitle = `${pageHeading} | ${SITE_NAME}`;

    routes.push({
      path: canonicalPath,
      title: pageTitle,
      description: tool.metaDescription,
      canonicalUrl,
      schemaGraph: buildSchemaGraph({
        canonicalUrl,
        title: pageTitle,
        description: tool.metaDescription,
        customNodes: [
          createWebApplicationSchema(
            pageHeading,
            canonicalUrl,
            tool.metaDescription,
            getToolApplicationCategory(categoryId),
          ),
          createBreadcrumbSchema([
            { name: "Home", item: SITE_URL },
            ...(category
              ? [{ name: category.name, item: `${SITE_URL}/category/${category.id}` }]
              : []),
            { name: pageHeading, item: canonicalUrl },
          ]),
        ],
      }),
    });
  }

  return routes;
}

function main() {
  ensureBuildOutput();

  const tools = loadToolsModule();
  const templateHtml = fs.readFileSync(templatePath, "utf8");
  const assetTags = extractAssetTags(templateHtml);
  const bodyContent = extractBodyContent(templateHtml);
  const routes = buildRoutes(tools);

  for (const route of routes) {
    const html = renderHtml({
      title: route.title,
      description: route.description,
      canonicalUrl: route.canonicalUrl,
      schemaGraph: route.schemaGraph,
      assetTags,
      bodyContent,
      robots: route.robots,
    });

    writeRouteHtml(route.path, html);
  }

  console.log(`[build-static-seo-pages] Wrote ${routes.length} prerendered HTML files.`);
}

main();
