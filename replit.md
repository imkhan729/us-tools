# Utility Hub – Tools Website

## Overview

pnpm workspace monorepo using TypeScript. Single deployable application: the **US Online Tools** website.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: Wouter
- **Animations**: Framer Motion

## Structure

```text
Utility-Hub/
├── artifacts/
│   └── tools-website/      # US Online Tools — main application
│       ├── src/
│       │   ├── App.tsx             # Route definitions
│       │   ├── data/tools.ts       # Tools registry (single source of truth)
│       │   ├── pages/              # Page components
│       │   │   ├── Home.tsx
│       │   │   ├── CategoryPage.tsx
│       │   │   ├── PercentageCalculator.tsx
│       │   │   └── tools/          # Individual tool pages
│       │   ├── components/         # Layout, SEO, ThemeProvider, etc.
│       │   └── index.css           # Tailwind + global styles
│       ├── public/                 # Static assets
│       ├── vite.config.ts
│       └── package.json
├── pnpm-workspace.yaml     # Workspace config + catalog versions
├── tsconfig.base.json      # Shared TypeScript options
├── tsconfig.json           # Root TypeScript project references
└── package.json            # Root package + Windows native binaries
```

## Root Scripts

- `pnpm run build` — typecheck + build all packages
- `pnpm run typecheck` — typecheck tools-website

## Application: `artifacts/tools-website` (`@workspace/tools-website`)

React + Vite frontend — **US Online Tools** (usonlinetools.com). 130+ free online tools in 9 categories.

- **Design**: Orange (#FF6B35) primary, teal (#00D4AA) secondary, yellow (#FFD23F) accent. Bold editorial style, dark/light mode via ThemeProvider.
- **Routing**: Wouter. Routes: `/` (Home), `/tools/:slug` (individual tool pages), `/category/:id` (category pages).
- **Tools registry**: `src/data/tools.ts` — single source of truth. Exports `TOOL_CATEGORIES`, `ALL_TOOLS`, `getToolBySlug()`, `getRelatedTools()`.
- **Category pages**: `/category/:id` — each has its own color theme, stats bar, full tool grid, breadcrumb, "Browse Other Categories" section.
- **Search**: Full-width search bar with category filter pills.
- **SEO**: Each tool page has `<SEO>` component with title, meta description, structured data, breadcrumbs.
- Key files: `src/pages/Home.tsx`, `src/pages/CategoryPage.tsx`, `src/components/Layout.tsx`, `src/data/tools.ts`, `src/App.tsx`, `src/index.css`.

## Dev Server

```bash
MSYS_NO_PATHCONV=1 PORT=3000 BASE_PATH=/ pnpm --filter @workspace/tools-website dev
```
