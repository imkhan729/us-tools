export const SITE_NAME = "US Online Tools";
export const SITE_URL = "https://usonlinetools.com";
export const SITE_DESCRIPTION =
  "Free online calculators, converters, generators, and browser-based utility tools.";
export const SITE_LANGUAGE = "en-US";
export const SITE_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
export const SITE_LOGO = `${SITE_URL}/favicon.svg`;
export const SITE_TWITTER_HANDLE = "@usonlinetools";
export const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export type SchemaNode = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  item: string;
}

function normalizeSchemaTypes(typeValue: unknown): string[] {
  if (Array.isArray(typeValue)) {
    return typeValue.filter((item): item is string => typeof item === "string");
  }

  return typeof typeValue === "string" ? [typeValue] : [];
}

function getBreadcrumbTarget(node: SchemaNode): string | null {
  const itemListElement = Array.isArray(node.itemListElement) ? node.itemListElement : [];
  const lastItem = itemListElement.at(-1);

  if (!lastItem || typeof lastItem !== "object") {
    return null;
  }

  const item = (lastItem as SchemaNode).item;
  return typeof item === "string" ? item : null;
}

function getSchemaNodeKey(node: SchemaNode): string {
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

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function createOrganizationSchema(): SchemaNode {
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

export function createWebsiteSchema(description = SITE_DESCRIPTION): SchemaNode {
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

export function createWebPageSchema({
  canonicalUrl,
  name,
  description,
}: {
  canonicalUrl: string;
  name: string;
  description: string;
}): SchemaNode {
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

export function createBreadcrumbSchema(items: BreadcrumbItem[]): SchemaNode {
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

export function createCollectionPageSchema({
  canonicalUrl,
  name,
  description,
}: {
  canonicalUrl: string;
  name: string;
  description: string;
}): SchemaNode {
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

export function createFAQSchema(
  items: Array<{
    q: string;
    a: string;
  }>,
): SchemaNode | null {
  if (items.length === 0) {
    return null;
  }

  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function createWebApplicationSchema({
  name,
  canonicalUrl,
  description,
  category = "UtilityApplication",
}: {
  name: string;
  canonicalUrl: string;
  description: string;
  category?: string;
}): SchemaNode {
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

export function createHowToSchema({
  name,
  description,
  canonicalUrl,
  steps,
}: {
  name: string;
  description: string;
  canonicalUrl: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
}): SchemaNode | null {
  if (steps.length === 0) {
    return null;
  }

  return {
    "@type": "HowTo",
    name,
    description,
    url: canonicalUrl,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export function dedupeSchemaNodes(nodes: SchemaNode[]): SchemaNode[] {
  const deduped = new Map<string, SchemaNode>();

  for (const node of nodes) {
    if (!node || typeof node !== "object" || Object.keys(node).length === 0) {
      continue;
    }

    deduped.set(getSchemaNodeKey(node), node);
  }

  return Array.from(deduped.values());
}

export function createSchemaGraph(nodes: SchemaNode[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": dedupeSchemaNodes(nodes),
  };
}
