# US Online Tools

Free online calculators and utilities (React, TypeScript, Vite). Source lives under `artifacts/tools-website/`.

## GitHub

Upstream / publishing remote: [github.com/imkhan729/us-tools](https://github.com/imkhan729/us-tools)

## Develop

```bash
pnpm install
pnpm --filter @workspace/tools-website dev
```

## Build

```bash
pnpm --filter @workspace/tools-website build
```

## Hostinger shared hosting

Apache needs the **built** static files, not this repo’s source. See **[artifacts/tools-website/HOSTINGER.md](./artifacts/tools-website/HOSTINGER.md)** for GitHub push steps, `build:hostinger`, and uploading to `public_html`.

Quick copy for upload after build:

```bash
pnpm --filter @workspace/tools-website run build:hostinger
```

Then upload the **contents** of `hostinger-public/` (repo root) into Hostinger `public_html`.
