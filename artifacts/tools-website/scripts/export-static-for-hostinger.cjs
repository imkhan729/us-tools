/**
 * Copies Vite production output (dist/public) to ../../hostinger-public at the repo root
 * so you can upload that folder's *contents* to Hostinger public_html, or commit only that
 * folder on a deploy branch if your Git workflow requires it.
 *
 * Prerequisite: pnpm run build (or pnpm run build:hostinger from package.json).
 */

const fs = require("fs");
const path = require("path");

const toolsWebsiteRoot = path.resolve(__dirname, "..");
const distPublic = path.join(toolsWebsiteRoot, "dist", "public");
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, "hostinger-public");

function rmrf(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

if (!fs.existsSync(distPublic) || !fs.statSync(distPublic).isDirectory()) {
  console.error("[export-static-for-hostinger] Missing build output. Run first:");
  console.error("  pnpm --filter @workspace/tools-website build");
  console.error("Expected directory:", distPublic);
  process.exit(1);
}

rmrf(outDir);
fs.mkdirSync(outDir, { recursive: true });
copyRecursive(distPublic, outDir);

console.log("[export-static-for-hostinger] Copied static site to:");
console.log(" ", outDir);
console.log("");
console.log("Next: upload everything *inside* that folder to Hostinger public_html (not the folder name itself).");
