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

// 1. Verify master sitemap.xml contains all 430 canonical URLs directly
const masterContent = fs.readFileSync(masterSitemapPath, 'utf8');
const directUrls = new Set([...masterContent.matchAll(/<loc>(https:\/\/usonlinetools\.com[^<]*)<\/loc>/g)].map(m => m[1]));

console.log(`[seo:sitemap] Total unique canonical URLs directly in sitemap.xml: ${directUrls.size}`);

let directDiscrepancies = 0;
for (const u of indexUrls) {
  if (!directUrls.has(u)) {
    console.error(`[seo:sitemap] Missing canonical URL in direct sitemap.xml: ${u}`);
    directDiscrepancies++;
  }
}

// 2. Verify sitemap-index.xml and sub-sitemaps
const sitemapIndexPath = path.join(distPublic, 'sitemap-index.xml');
if (fs.existsSync(sitemapIndexPath)) {
  const indexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
  const subSitemaps = [...indexContent.matchAll(/<loc>(https:\/\/usonlinetools\.com\/[^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`[seo:sitemap] Found ${subSitemaps.length} sub-sitemaps in sitemap-index.xml.`);
  
  for (const subUrl of subSitemaps) {
    const filename = subUrl.replace('https://usonlinetools.com/', '');
    const subFile = path.join(distPublic, filename);
    if (!fs.existsSync(subFile)) {
      console.error(`[seo:sitemap] Sub-sitemap ${filename} does not exist in dist/public`);
      directDiscrepancies++;
    }
  }
}

// 3. Verify legacy sitemap aliases exist
const legacySitemaps = ['sitemap-new-tools.xml', 'sitemap-tools-new.xml', 'sitemap-pages.xml'];
for (const leg of legacySitemaps) {
  const legPath = path.join(distPublic, leg);
  if (!fs.existsSync(legPath)) {
    console.error(`[seo:sitemap] Legacy sitemap alias ${leg} is missing.`);
    directDiscrepancies++;
  }
}

if (directDiscrepancies > 0) {
  console.error(`[seo:sitemap] FAIL: Found ${directDiscrepancies} sitemap discrepancies.`);
  process.exit(1);
} else {
  console.log(`[seo:sitemap] PASS: Master sitemap.xml contains all ${directUrls.size} canonical URLs directly in <urlset>, plus sub-sitemaps and legacy aliases verified 100%.`);
}
