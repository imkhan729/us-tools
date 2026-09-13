const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const repo = path.resolve(root, '..', '..');
const docs = path.join(repo, 'docs', 'seo');

console.log('=== USOnlineTools Automated SEO QA Master Test Suite ===\n');

const testScripts = [
  { name: 'Metadata & Canonical Verification', script: './scripts/seo-metadata.cjs' },
  { name: 'Internal Link & 404 Check', script: './scripts/seo-links.cjs' },
  { name: 'XML Sitemap & Inventory Alignment', script: './scripts/seo-sitemap.cjs' },
  { name: 'JSON-LD Structured Data Validation', script: './scripts/seo-schema.cjs' },
  { name: 'Internationalization & hreflang Audit', script: './scripts/seo-hreflang.cjs' }
];

let failedTests = 0;
const testResults = [];

for (const test of testScripts) {
  console.log(`Running: ${test.name}...`);
  try {
    const output = execSync(`node ${test.script}`, { cwd: root, encoding: 'utf8' });
    console.log(output);
    testResults.push(`- PASS: ${test.name}`);
  } catch (err) {
    console.error(`FAIL: ${test.name}`);
    console.error(err.stdout || err.message);
    testResults.push(`- FAIL: ${test.name}`);
    failedTests++;
  }
}

// Generate AUTOMATED_AUDIT.md
const auditReport = [
  '# Automated SEO QA Audit Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `- Total Test Suites: ${testScripts.length}`,
  `- Passed Suites: ${testScripts.length - failedTests}`,
  `- Failed Suites: ${failedTests}`,
  '',
  '## Test Results',
  '',
  ...testResults,
  '',
  failedTests === 0 
    ? '### Status: ALL SEO QA CRITERIA PASSED (Ready for Pre-Deployment Audit)' 
    : '### Status: BLOCKING FAILURES DETECTED'
];

fs.writeFileSync(path.join(docs, 'AUTOMATED_AUDIT.md'), auditReport.join('\n') + '\n', 'utf8');

if (failedTests > 0) {
  console.error(`\n[seo:audit] Master SEO QA suite completed with ${failedTests} failing tests.`);
  process.exit(1);
} else {
  console.log('\n[seo:audit] ALL SEO QA CRITERIA PASSED! 0 failures.');
}
