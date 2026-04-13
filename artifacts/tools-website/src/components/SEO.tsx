import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { getCanonicalToolPath, getToolBySlug } from "@/data/tools";
import {
  DEFAULT_ROBOTS,
  SITE_LOGO,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  createOrganizationSchema,
  createWebPageSchema,
  createWebsiteSchema,
  toAbsoluteUrl,
} from "@/lib/seo";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

const ogImage = SITE_OG_IMAGE;
const ogImageWidth = 1200;
const ogImageHeight = 630;

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
}
function getCanonicalPathFromLocation(pathname: string): string {
  const normalizedPath = normalizePath(pathname);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments.length >= 2) {
    const slug = segments[segments.length - 1];

    if (getToolBySlug(slug)) {
      return getCanonicalToolPath(slug);
    }
  }

  return normalizedPath;
}

function normalizeSchemaInput(schema?: Record<string, unknown> | Array<Record<string, unknown>>): Record<string, unknown>[] {
  if (!schema) return [];
  const items = Array.isArray(schema) ? schema : [schema];
  const normalized: Record<string, unknown>[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;

    const maybeGraph = (item as { "@graph"?: unknown })["@graph"];
    if (Array.isArray(maybeGraph)) {
      for (const node of maybeGraph) {
        if (node && typeof node === "object") {
          const { "@context": _context, ...rest } = node as Record<string, unknown>;
          normalized.push(rest);
        }
      }
      continue;
    }

    const { "@context": _context, ...rest } = item;
    normalized.push(rest);
  }

  return normalized;
}

export function SEO({ title, description, canonical, schema, noindex = false }: SEOProps) {
  const [location] = useLocation();
  const pathname = normalizePath(location);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? toAbsoluteUrl(canonical)
    : toAbsoluteUrl(getCanonicalPathFromLocation(pathname));
  const isCanonicalMismatch =
    normalizePath(pathname) !== normalizePath(new URL(canonicalUrl).pathname);
  const robots = noindex || isCanonicalMismatch
    ? "noindex, follow"
    : DEFAULT_ROBOTS;
  const baseSchemaGraph = [
    createWebsiteSchema(),
    createOrganizationSchema(),
    createWebPageSchema({
      canonicalUrl,
      name: fullTitle,
      description,
    }),
  ];
  const customSchema = normalizeSchemaInput(schema);
  const mergedSchema = { "@context": "https://schema.org", "@graph": [...baseSchemaGraph, ...customSchema] };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="description" content={description} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={`${SITE_NAME} preview image`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} preview image`} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="theme-color" content="#ff6b35" />
      <meta name="color-scheme" content="light dark" />
      <link rel="icon" type="image/svg+xml" href={SITE_LOGO} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <link rel="alternate" hrefLang="en-us" href={canonicalUrl} />}
      {canonicalUrl && <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />}
      <script type="application/ld+json">{JSON.stringify(mergedSchema)}</script>
    </Helmet>
  );
}
