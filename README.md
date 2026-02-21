# Molt Code — Website

The marketing website and documentation for [Molt Code](https://moltcode.com), a free desktop application for macOS that orchestrates AI coding agents across multiple projects.

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

- **`/`** — Landing page with hero, features, how-it-works, agents, philosophy, and CTA sections
- **`/docs/what-is-moltcode`** — What is Molt Code?
- **`/docs/features`** — Features & chat organisation
- **`/docs/building-from-scratch`** — Building a product from scratch
- **`/docs/resolving-issues`** — Resolving issues with agents
- **`/docs/prds`** — Drafting PRDs with agents
- **`/docs/changelog`** — Changelog
- **`/docs/support`** — Support & contact
- **`/privacy`** — Privacy policy
- **`/terms`** — Terms of service

## ⚙️ Configuration

App-level settings (current version, download URL, GitHub link) are managed in `src/config.ts`. Update this file when releasing a new version of Molt Code.

## 🚢 Deployment

The site is deployed as a static site to Cloudflare Pages. The Wrangler configuration is in `wrangler.json` and serves the built `./dist/` directory.

```sh
npm run build
npx wrangler pages deploy dist
```
