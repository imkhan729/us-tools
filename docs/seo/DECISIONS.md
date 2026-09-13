# SEO Decisions

1. Preserve existing canonical URLs and calculator behavior.
2. Use `https://usonlinetools.com` as the canonical host and the standard slashless route convention (e.g., `/:category/:slug`) unless a route explicitly requires otherwise.
3. Internal linking rule: All internal links across components, tool headers, and related tool cards must target canonical paths directly using `getCanonicalToolPath(tool.slug)`, preventing internal redirect hops.
4. Redirect rules: All 637 legacy aliases, `/tools/:slug` paths, and category moves must redirect with HTTP 301 directly to the single canonical destination with 0 multi-hop chains.
5. Canonical tag rules: Every indexable HTML page must include exactly one self-referencing canonical `<link rel="canonical" href="...">`. 404 and noindexed pages must never emit a canonical link.
6. Treat the ten localized routes in the existing progress log as prior verified work, not as permission to weaken or overwrite their content.
7. Do not invent Search Console, analytics, keyword-volume, ranking, review, author, or citation data.
8. Do not remove pages until indexing, usage, backlinks, and intent evidence exist.
9. Keep local, packaged, pushed, and live states distinct in every verification report.

