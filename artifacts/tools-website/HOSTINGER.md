# Deploy US Online Tools on Hostinger (shared hosting)

This app is a **static SPA** (Vite + React). Apache only needs the **built files**—HTML, JS, CSS, and `.htaccess`—not the TypeScript source or `node_modules`.

Official repo: [github.com/imkhan729/us-tools](https://github.com/imkhan729/us-tools)

## 1. Push source to GitHub

From your machine (with [Git](https://git-scm.com/) installed):

```bash
cd /path/to/your/repo
git init
git remote add origin https://github.com/imkhan729/us-tools.git
git add .
git commit -m "Initial commit: tools website"
git branch -M main
git push -u origin main
```

Use `master` instead of `main` if that is your default branch (this workspace was on `master`).

If `origin` already exists, use `git remote set-url origin https://github.com/imkhan729/us-tools.git` instead.

Use a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) or SSH if GitHub prompts for credentials.

## 2. Build the site locally

Hostinger **shared** hosting usually **does not** run `pnpm install` / `vite build` for you. Build on your PC (or in GitHub Actions), then upload the result.

Requirements: [Node.js](https://nodejs.org/) LTS and [pnpm](https://pnpm.io/installation).

```bash
cd /path/to/your/repo
pnpm install
pnpm --filter @workspace/tools-website build
```

Output directory: **`artifacts/tools-website/dist/public/`** (contains `index.html`, `assets/`, `.htaccess`, etc.).

### One command: build + copy to `hostinger-public/`

```bash
pnpm --filter @workspace/tools-website run build:hostinger
```

This creates **`hostinger-public/`** at the **repository root** with the same files as `dist/public/`. That folder is gitignored so you do not accidentally commit large builds; use it only as a staging folder for upload or zip.

## 3. Upload to Hostinger

1. hPanel → **Files** → **File Manager** → open **`public_html`** (or the document root for your domain).
2. Delete old test files if needed (keep `.htaccess` only if you know it is safe to replace).
3. Upload **everything inside** `hostinger-public/` (or `artifacts/tools-website/dist/public/`) into `public_html`—not the parent folder name, so `index.html` sits directly in `public_html`.

Alternatively use **FTP** (FileZilla, WinSCP) with the same rule: remote `public_html` should contain `index.html` at the top level.

## 4. Git deploy on Hostinger

If hPanel **Git** pulls your repository into the account:

- Pulling the **full monorepo** does **not** make the site work by itself—the document root must still be the **built** static files.
- Practical options:
  - **A)** Do not use Git for the live site; use Git for source only and upload the build (section 3).
  - **B)** Configure deploy so the **published path** is the folder that contains `index.html` (only if Hostinger lets you set a subdirectory such as `artifacts/tools-website/dist/public`—not always available on shared plans).
  - **C)** Maintain a separate branch (e.g. `deploy`) that contains **only** the contents of `dist/public`, and point Git deploy at that branch/path (advanced).

The included **`public/.htaccess`** is copied into the build and provides **HTTPS redirect**, **301 redirects**, and **SPA fallback** to `index.html` for client-side routes.

## 5. Domain at site root (`https://yoursite.com/`)

Default Vite `base` is **`/`**. Build with:

```bash
set BASE_PATH=/
pnpm --filter @workspace/tools-website build
```

(On PowerShell: `$env:BASE_PATH="/"; pnpm --filter @workspace/tools-website build`.)

## 6. Subdirectory (`https://yoursite.com/tools/`)

1. Build with base path:

   ```bash
   set BASE_PATH=/tools/
   pnpm --filter @workspace/tools-website build
   ```

2. In the deployed `.htaccess`, set Apache **`RewriteBase`** to match (e.g. `RewriteBase /tools/`). See comments at the bottom of `public/.htaccess`.

## 7. Checklist after upload

- Open the homepage; confirm assets load (no 404 on `/assets/...`).
- Open a deep link (e.g. `/math/percentage-calculator`) and refresh—page should load (SPA fallback).
- If you see a directory listing or 404 on refresh, **`mod_rewrite`** may be off or `.htaccess` is missing—enable it in hPanel or contact support.

## 8. Optional: GitHub Actions artifact

You can add a workflow that runs `pnpm install` + `pnpm --filter @workspace/tools-website build` and attaches `dist/public` as a **workflow artifact** ZIP, then download and upload to Hostinger—useful if you do not build locally.
