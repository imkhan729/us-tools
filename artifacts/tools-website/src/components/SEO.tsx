import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: Record<string, any>;
}

export function SEO({ title, description, canonical, schema }: SEOProps) {
  const siteName = "US Online Tools";
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = canonical || "https://usonlinetools.com";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}