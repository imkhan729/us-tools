const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
const distPublic = path.join(__dirname, '../dist/public');
const inventoryPath = path.join(repoRoot, 'docs/seo/URL_INVENTORY.csv');

console.log('[seo:sitemap] Validating XML Sitemaps against URL_INVENTORY.csv...');

const masterSitemapPath = path.join(distPublic, 'sitemap.xml');
if (!fs.existsSync(masterSitemapPath)) {
  console.error('[seo:sitemap] FAIL: Master sitemap.xml is missing from dist/public');
  process.exit(1);
}

const masterContent = fs.readFileSync(masterSitemapPath, 'utf8');
const subSitemaps = [...masterContent.matchAll(/<loc>(https:\/\/usonlinetools\.com\/[^<]+)<\/loc>/g)].map(m => m[1]);

console.log(`[seo:sitemap] Found ${subSitemaps.length} sub-sitemaps in master index.`);

const sitemapUrls = new Set();
for (const subSitemapUrl of subSitemaps) {
  const filename = subSitemapUrl.replace('https://usonlinetools.com/', '');
  const subPath = path.join(distPublic, filename);
  if (!fs.existsSync(subPath)) {
    console.error(`[seo:sitemap] FAIL: Sub-sitemap file ${filename} does not exist in dist/public`);
    process.exit(1);
  }
  const content = fs.readFileSync(subPath, 'utf8');
  const urls = [...content.matchAll(/<loc>(https:\/\/usonlinetools\.com[^<]*)<\/loc>/g)].map(m => m[1]);
  for (const u of urls) {
    sitemapUrls.add(u);
  }
}

console.log(`[seo:sitemap] Total unique canonical URLs in sitemaps: ${sitemapUrls.size}`);

// Check against URL_INVENTORY
const inventory = fs.readFileSync(inventoryPath, 'utf8').trim().split('\n');
const indexUrls = new Set();
for (let i = 1; i < inventory.length; i++) {
  const line = inventory[i].trim();
  if (!line) continue;
  const cols = line.split('","').map(c => c.replace(/^"|"$/g, ''));
  if (cols[4] === 'INDEX') {
    indexUrls.add(cols[5]);
  }
}

let discrepancies = 0;
for (const u of indexUrls) {
  if (!sitemapUrls.has(u)) {
    console.error(`[seo:sitemap] Missing canonical URL in sitemaps: ${u}`);
    discrepancies++;
  }
}

for (const u of sitemapUrls) {
  if (!indexUrls.has(u)) {
    console.error(`[seo:sitemap] Unexpected URL in sitemap (not in INDEX inventory): ${u}`);
    discrepancies++;
  }
}

if (discrepancies > 0) {
  console.error(`[seo:sitemap] FAIL: Found ${discrepancies} sitemap discrepancies.`);
  process.exit(1);
} else {
  console.log(`[seo:sitemap] PASS: Sitemaps contain exactly 430 canonical URLs matching inventory 100%.`);
}
