# Molt Code — Website

The marketing website and documentation for [Molt Code](https://moltcode.com), a free desktop app for macOS, iPhone, and iPad built around a project feed where you and your agents work in threads — post the work, tag an agent by `@handle`, and review what it hands back.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and deployed to [Cloudflare Pages](https://pages.cloudflare.com) via Wrangler.

## 🚀 Project Structure

```text
/
├── public/
│   ├── docs/features/      # Documentation screenshots
│   ├── llms.txt             # LLM-friendly site summary
│   ├── robots.txt           # Search engine directives
│   └── og-image.png         # Open Graph image
├── src/
│   ├── analytics/           # Browser-only PostHog download tracking
│   ├── components/          # Astro components (Hero, Features, Nav, etc.)
│   ├── config.ts            # App version & download URL
│   ├── layouts/             # Page layouts
│   ├── pages/
│   │   ├── index.astro      # Landing page
│   │   ├── privacy.astro    # Privacy policy
│   │   ├── terms.astro      # Terms of service
│   │   └── docs/            # Documentation pages
│   └── styles/
│       └── global.css       # Global styles
├── astro.config.mjs         # Astro config (sitemap, Tailwind)
├── wrangler.json            # Cloudflare deployment config
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`    |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview the build locally before deploying   |

## 📄 Pages

- **`/`** — Landing page: download hero, thread flow, agent roster, chat sample
- **`/pricing`** — Pricing
- **`/privacy`** — Privacy policy
- **`/terms`** — Terms of service

### Docs

Docs pages use the shared `src/layouts/DocsPage.astro` layout, which owns the
sidebar, prose styles, "where next" cards, and download CTA. A page supplies
only its frontmatter and its prose. Sidebar sections and per-page tables of
contents live in `src/components/DocsSidebar.astro`.

**Start Here**
- **`/docs/what-is-moltcode`** — What is Molt Code?
- **`/docs/quickstart`** — Your first ten minutes
- **`/docs/connect-clis`** — Connect CLIs & models

**Collaborate**
- **`/docs/feed`** — Feed, posts & threads
- **`/docs/agents`** — Create & customize agents
- **`/docs/tagging-agents`** — Tagging agents & following work
- **`/docs/artifacts`** — Agent replies & artifacts
- **`/docs/feed-vs-sessions`** — Feed vs sessions

**Build**
- **`/docs/projects`** — Projects & the project toolbox
- **`/docs/resolving-issues`** — Issues, sub-issues & epics
- **`/docs/prds`** — Docs, context & PRDs
- **`/docs/building-from-scratch`** — Building a product from scratch
- **`/docs/conductor`** — Conductor & workflows

**Extend**
- **`/docs/skills`** — Skills
- **`/docs/mcp`** — MCP servers
- **`/docs/designs`** — Designs
- **`/docs/permissions`** — Permissions & safety

**Reference**
- **`/docs/processes`** — Terminals, processes & scripts
- **`/docs/troubleshooting`** — Troubleshooting
- **`/docs/changelog`** — Changelog
- **`/docs/support`** — Support & contact

**Redirects**
- **`/docs/features`** → `/docs/feed` (301; the Features model was replaced by the feed)

## ⚙️ Configuration

App-level settings (current version, download URL, GitHub link) are managed in `src/config.ts`. Update this file when releasing a new version of Molt Code. Browser download analytics and the shared Compose PostHog project settings live in `src/analytics/browser.ts`.

## 🚢 Deployment

The site is deployed as a static site to Cloudflare Pages. The Wrangler configuration is in `wrangler.json` and serves the built `./dist/` directory.

```sh
npm run build
npx wrangler pages deploy dist
```
