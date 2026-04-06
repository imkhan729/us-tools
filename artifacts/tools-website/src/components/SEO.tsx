import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: Record<string, any>;
  noindex?: boolean;
}

export function SEO({ title, description, canonical, schema, noindex = false }: SEOProps) {
  const siteName = "US Online Tools";
  const fullTitle = `${title} | ${siteName}`;
  const fallbackCanonical = "https://usonlinetools.com";
  const canonicalUrl = canonical
    ? canonical
    : typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : fallbackCanonical;
  const ogImage = "https://usonlinetools.com/opengraph.jpg";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
