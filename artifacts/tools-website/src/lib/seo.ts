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

export interface ItemListEntry {
  name: string;
  item: string;
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
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function createItemListSchema(items: ItemListEntry[]): SchemaNode {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.item,
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
    name,
    url: canonicalUrl,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
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
    "@type": "WebApplication",
    name,
    url: canonicalUrl,
    description,
    applicationCategory: category,
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
