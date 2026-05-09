# darvas.ch

Static personal website for Tamas Darvas, deployed to Cloudflare from GitHub.

The site includes a generated `/ai-engineer-zurich-jobs/` page with a static HTML table of AI/ML/LLM engineering job search results around Zürich.

## Project structure

```text
.
├── index.html                         # Home page
├── ai-engineer-zurich-jobs/           # Generated static jobs page
│   └── index.html
├── assets/                            # Public CSS, JS, favicons, OG images
├── data/                              # Generated job data/table cache, not deployed
├── scripts/
│   ├── scrape-ai-jobs.mjs             # Serper-based generic job scraper
│   └── build-static.mjs               # Copies deployable static files to dist/
├── test/                              # Node test suite
├── wrangler.jsonc                     # Cloudflare/Wrangler config
├── .assetsignore                      # Excludes non-public files from Worker assets
└── .github/workflows/update-ai-jobs.yml
```

## Requirements

- Node.js 24+
- npm
- Serper.dev API key for refreshing the jobs page

## Environment variables

Create a local `.env` file:

```bash
SERPER_DEV_API=your_serper_api_key
```

The scraper also accepts `SERPER_API_KEY` as a fallback.

Do not commit `.env`. It is ignored by git.

## Common commands

Run tests:

```bash
npm test
```

Refresh the AI jobs page locally:

```bash
npm run scrape:ai-jobs
```

Build static deploy artifacts:

```bash
npm run build
```

This creates `dist/` containing only public static files:

```text
dist/index.html
dist/ai-engineer-zurich-jobs/index.html
dist/assets/*
dist/robots.txt
dist/sitemap.xml
```

## AI jobs scraper

The scraper is intentionally generic and not company-specific.

It:

- queries Serper.dev / Google Search for generic role and location combinations
- searches roles such as AI Engineer, Machine Learning Engineer, LLM Engineer, Generative AI Engineer, MLOps Engineer, NLP Engineer
- targets Zürich/Zurich
- deduplicates normalized URLs
- filters irrelevant results
- generates static output

Outputs:

```text
ai-engineer-zurich-jobs/index.html        # public generated page
zurich-ai-market/index.html               # market page with refreshed snapshot facts
data/ai-engineer-zurich-jobs.json         # generated data cache
data/ai-engineer-zurich-jobs-table.html   # reusable generated HTML table
```

Useful scraper options:

```bash
npm run scrape:ai-jobs -- --max-results-per-query 10 --delay-ms 100
npm run scrape:ai-jobs -- --query "AI Engineer Zurich jobs" --max-results-per-query 5
```

## Deployment

Cloudflare deploys from GitHub.

Current intended Cloudflare settings:

```text
Build command:  npm run build
Deploy command: npx wrangler deploy
Path:           /
```

`wrangler.jsonc` points Worker assets to `dist/`:

```jsonc
"assets": {
  "directory": "dist"
}
```

This means Cloudflare deploys only the static build artifacts, not the scraper/source files.

Deployed:

- `dist/index.html`
- `dist/ai-engineer-zurich-jobs/index.html`
- `dist/assets/*`
- `dist/robots.txt`
- `dist/sitemap.xml`

Not deployed:

- `.env`
- `scripts/`
- `test/`
- `package.json`
- `.github/`
- `data/`
- git metadata

`.assetsignore` also excludes non-public files as a safety net.

## Automated job refresh

The workflow in `.github/workflows/update-ai-jobs.yml` runs daily and can also be triggered manually.

It:

1. checks out the repository
2. sets up Node.js
3. runs tests
4. runs the Serper scraper
5. commits the refreshed generated job files and the market-radar snapshot block

Add this GitHub Actions repository secret:

```text
SERPER_DEV_API
```

GitHub path:

```text
Repository → Settings → Secrets and variables → Actions → New repository secret
```

Cloudflare does not need the Serper key at runtime when using this workflow. The deployed site is static.

## Security notes

- Never put the Serper API key in frontend JavaScript.
- Do not commit `.env`.
- Keep Serper calls server-side, in GitHub Actions, local scripts, or another trusted backend.
- The public `/ai-engineer-zurich-jobs/` page is generated static HTML.

## Verification checklist

Before committing:

```bash
npm test
npm run scrape:ai-jobs
npm run build
```

Then check:

```bash
find dist -maxdepth 3 -type f | sort
```

Expected public files only: homepage, jobs page, assets, robots.txt, and sitemap.xml.
