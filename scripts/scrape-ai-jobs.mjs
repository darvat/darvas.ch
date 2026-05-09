import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ROLES = [
  'AI Engineer',
  'Artificial Intelligence Engineer',
  'Machine Learning Engineer',
  'ML Engineer',
  'Generative AI Engineer',
  'LLM Engineer',
  'AI Software Engineer',
  'Data Scientist AI',
  'MLOps Engineer',
  'NLP Engineer',
];

const DEFAULT_LOCATIONS = ['Zurich'];
const DEFAULT_SUFFIXES = ['jobs'];
const DEFAULT_MAX_RESULTS_PER_QUERY = 10;
const DEFAULT_DELAY_MS = 250;

const TRACKING_PARAMS = /^(utm_|fbclid$|gclid$|msclkid$|igshid$|mc_cid$|mc_eid$)/i;
const AI_TERMS = /\b(ai|artificial intelligence|machine learning|ml|llm|large language model|generative ai|genai|nlp|rag|mlops|data scientist|computer vision)\b/i;
const JOB_TERMS = /\b(job|jobs|stellen|stelle|vacanc(?:y|ies)|career|careers|hiring|recruit|engineer|developer|scientist|architect|internship|praktikum)\b/i;
const LOCATION_TERMS = /\b(zurich|zürich|zuerich|switzerland|schweiz|suisse|swiss|remote)\b/i;
const NEGATIVE_TERMS = /\b(stock price|share price|course|bootcamp|degree|definition|wikipedia|news|salary guide|image|video)\b/i;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildQueries({ roles = DEFAULT_ROLES, locations = DEFAULT_LOCATIONS, suffixes = DEFAULT_SUFFIXES } = {}) {
  const seen = new Set();
  const queries = [];
  for (const role of roles) {
    for (const location of locations) {
      for (const suffix of suffixes) {
        const query = `${role} ${location} ${suffix}`.replace(/\s+/g, ' ').trim();
        const key = query.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          queries.push(query);
        }
      }
    }
  }
  return queries;
}

export function normalizeUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.hash = '';
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  const params = [...url.searchParams.entries()]
    .filter(([key]) => !TRACKING_PARAMS.test(key))
    .sort(([a], [b]) => a.localeCompare(b));
  url.search = '';
  for (const [key, value] of params) url.searchParams.append(key, value);
  return url.toString().replace(/\/$/, '');
}

export function sourceFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function combinedText(result) {
  return `${result.title ?? ''} ${result.snippet ?? ''} ${result.link ?? ''}`.toLowerCase();
}

export function isRelevantJobResult(result) {
  if (!result?.title || !result?.link) return false;
  let url;
  try {
    url = new URL(result.link);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(url.protocol)) return false;

  const text = combinedText(result);
  if (NEGATIVE_TERMS.test(text)) return false;
  return AI_TERMS.test(text) && JOB_TERMS.test(text) && LOCATION_TERMS.test(text);
}

export function mergeResults(queryResults) {
  const byUrl = new Map();
  for (const { query, results } of queryResults) {
    for (const item of results ?? []) {
      if (!isRelevantJobResult(item)) continue;
      const normalizedUrl = normalizeUrl(item.link);
      const existing = byUrl.get(normalizedUrl);
      if (existing) {
        if (!existing.queries.includes(query)) existing.queries.push(query);
        if ((item.snippet ?? '').length > (existing.snippet ?? '').length) existing.snippet = item.snippet;
        continue;
      }
      byUrl.set(normalizedUrl, {
        title: cleanText(item.title),
        link: normalizedUrl,
        snippet: cleanText(item.snippet ?? ''),
        source: sourceFromUrl(normalizedUrl),
        queries: [query],
      });
    }
  }
  return [...byUrl.values()].sort((a, b) => scoreResult(b) - scoreResult(a));
}

function scoreResult(result) {
  const text = combinedText(result);
  let score = 0;
  if (/\b(ai engineer|artificial intelligence engineer|machine learning engineer|ml engineer|llm engineer|generative ai engineer)\b/i.test(text)) score += 4;
  if (/\b(zurich|zürich|zuerich)\b/i.test(text)) score += 3;
  if (/\b(job|jobs|stellen|vacanc(?:y|ies)|hiring)\b/i.test(text)) score += 2;
  score += Math.min(result.queries?.length ?? 0, 5);
  if (/linkedin|indeed|jobs\.ch|swissdevjobs|datacareer|greenhouse|lever|workday|smartrecruiters|join\.com/i.test(result.source ?? '')) score += 1;
  return score;
}

function cleanText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

const SITE_URL = 'https://darvas.ch';
const JOBS_PATH = '/ai-engineer-zurich-jobs/';
const JOBS_URL = `${SITE_URL}${JOBS_PATH}`;
const PAGE_TITLE = 'AI Engineer Zürich Jobs | Zurich AI, ML, LLM & MLOps Roles';
const PAGE_DESCRIPTION = 'Find refreshed AI Engineer Zürich jobs, machine learning engineer roles, LLM openings, generative AI jobs and MLOps roles around Zurich, Switzerland.';

const TRACKED_ROLE_TYPES = [
  {
    name: 'AI Engineer Zürich jobs',
    description: 'Production AI systems, AI platform work, model integration, evaluation, and applied software engineering roles.',
  },
  {
    name: 'Machine Learning Engineer jobs in Zurich',
    description: 'ML engineering, model-serving, data pipelines, experimentation, and applied machine learning product roles.',
  },
  {
    name: 'LLM Engineer and Generative AI jobs',
    description: 'Large language model integration, RAG, agentic AI workflows, prompt engineering, and GenAI application roles.',
  },
  {
    name: 'MLOps, NLP and AI data science roles',
    description: 'MLOps engineering, NLP, computer vision, AI data science, and production data workflow opportunities.',
  },
];

const RELATED_SEARCHES = [
  'AI Engineer Zürich jobs',
  'AI Engineer Zurich jobs',
  'Machine Learning Engineer Zurich jobs',
  'LLM Engineer Zurich jobs',
  'Generative AI Engineer Zurich jobs',
  'MLOps Engineer Zurich jobs',
  'NLP Engineer Switzerland jobs',
  'AI Software Engineer Zurich jobs',
];

const JOBS_FAQS = [
  {
    question: 'What counts as an AI Engineer Zürich job on this page?',
    answer: 'The page tracks public search results for AI engineer, artificial intelligence engineer, machine learning engineer, ML engineer, LLM engineer, generative AI engineer, AI software engineer, data scientist AI, MLOps engineer, NLP engineer, and related Zurich AI roles.',
  },
  {
    question: 'How are the Zurich AI jobs collected?',
    answer: 'The page is generated from generic search queries, deduplicated by normalized URL, filtered for AI, engineering, job, and Zurich or Switzerland terms, and published as static HTML.',
  },
  {
    question: 'Is this a company-specific job scraper?',
    answer: 'No. It is a generic Zurich AI job market snapshot. It does not scrape one employer or one application tracking system, and each outbound result links to the original public source.',
  },
  {
    question: 'Can I apply directly from this page?',
    answer: 'Use each linked source for the final job description, employer, salary, location, contract type, application process, and whether the opening is still active.',
  },
];

function formatZurichDate(isoDate) {
  return new Date(isoDate).toLocaleString('en-CH', { timeZone: 'Europe/Zurich' });
}

function formatIsoDate(isoDate) {
  return new Date(isoDate).toISOString().slice(0, 10);
}

function renderTrackedRoles() {
  return TRACKED_ROLE_TYPES.map((role) => `        <li>
          <strong>${escapeHtml(role.name)}</strong>
          <span>${escapeHtml(role.description)}</span>
        </li>`).join('\n');
}

function renderRelatedSearches() {
  return RELATED_SEARCHES.map((search) => `<li>${escapeHtml(search)}</li>`).join('\n');
}

function renderSourceList(results) {
  const sources = [...new Set(results.map((job) => job.source).filter(Boolean))].slice(0, 14);
  return sources.map((source) => `<li>${escapeHtml(source)}</li>`).join('\n');
}

function renderFaqHtml() {
  return JOBS_FAQS.map((item) => `        <details>
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>`).join('\n');
}

function buildStructuredData(results, generatedAt) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Tamas Darvas',
        inLanguage: 'en-CH',
      },
      {
        '@type': ['CollectionPage', 'WebPage'],
        '@id': `${JOBS_URL}#webpage`,
        url: JOBS_URL,
        name: PAGE_TITLE,
        headline: 'AI Engineer Zürich Jobs',
        description: PAGE_DESCRIPTION,
        inLanguage: 'en-CH',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        datePublished: generatedAt,
        dateModified: generatedAt,
        breadcrumb: { '@id': `${JOBS_URL}#breadcrumb` },
        about: [
          { '@type': 'Thing', name: 'AI Engineer Zürich jobs' },
          { '@type': 'Thing', name: 'Machine Learning Engineer Zurich jobs' },
          { '@type': 'Thing', name: 'LLM Engineer Zurich jobs' },
          { '@type': 'Thing', name: 'Generative AI jobs Switzerland' },
          { '@type': 'Thing', name: 'MLOps Engineer Zurich jobs' },
        ],
        mainEntity: [
          { '@id': `${JOBS_URL}#job-search-results` },
          { '@id': `${JOBS_URL}#faq` },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${JOBS_URL}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Tamas Darvas',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AI Engineer Zürich Jobs',
            item: JOBS_URL,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${JOBS_URL}#job-search-results`,
        name: 'AI Engineer Zürich job search results',
        description: 'Deduplicated public AI, ML, LLM, generative AI, NLP, MLOps, and data science job search results around Zurich, Switzerland.',
        numberOfItems: results.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: results.map((job, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: job.link,
          name: job.title,
          description: job.snippet || `AI job search result from ${job.source}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${JOBS_URL}#faq`,
        mainEntity: JOBS_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}

function jsonForHtml(data) {
  return JSON.stringify(data, null, 2)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

export function renderHtmlTable(results, { generatedAt = new Date().toISOString() } = {}) {
  const rows = results.map((job) => `        <tr>
          <td><a href="${escapeAttribute(job.link)}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtml(job.title)}</a></td>
          <td>${escapeHtml(job.snippet || 'No description available from search result.')}</td>
          <td>${escapeHtml(job.source)}</td>
        </tr>`).join('\n');

  return `<table class="jobs-table">
      <caption>Current AI engineer, machine learning, LLM, generative AI and MLOps job search results around Zürich. Generated ${escapeHtml(formatZurichDate(generatedAt))}.</caption>
      <thead>
        <tr>
          <th scope="col">Job title / result</th>
          <th scope="col">Short description</th>
          <th scope="col">Advertised where</th>
        </tr>
      </thead>
      <tbody>
${rows || '        <tr><td colspan="3">No matching jobs found.</td></tr>'}
      </tbody>
    </table>`;
}

export function renderPage(results, { generatedAt = new Date().toISOString() } = {}) {
  const table = renderHtmlTable(results, { generatedAt });
  const generatedDisplay = formatZurichDate(generatedAt);
  const generatedDate = formatIsoDate(generatedAt);
  const structuredData = jsonForHtml(buildStructuredData(results, generatedAt));

  return `<!DOCTYPE html>
<html lang="en-CH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(PAGE_TITLE)}</title>
  <meta name="description" content="${escapeAttribute(PAGE_DESCRIPTION)}">
  <meta name="keywords" content="AI Engineer Zürich jobs, AI Engineer Zurich jobs, Machine Learning Engineer Zurich, LLM Engineer Zurich, Generative AI jobs Zurich, MLOps Engineer Zurich, NLP Engineer Switzerland, AI Software Engineer Zurich">
  <meta name="author" content="Tamas Darvas">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="date" content="${escapeAttribute(generatedAt)}">
  <link rel="canonical" href="${JOBS_URL}">
  <link rel="alternate" href="${JOBS_URL}" hreflang="en-ch">
  <link rel="alternate" href="${JOBS_URL}" hreflang="x-default">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${JOBS_URL}">
  <meta property="og:site_name" content="Tamas Darvas">
  <meta property="og:locale" content="en_CH">
  <meta property="og:title" content="${escapeAttribute(PAGE_TITLE)}">
  <meta property="og:description" content="${escapeAttribute(PAGE_DESCRIPTION)}">
  <meta property="og:image" content="${SITE_URL}/assets/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="AI Engineer Zürich jobs and Zurich AI engineering roles">
  <meta property="og:updated_time" content="${escapeAttribute(generatedAt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${JOBS_URL}">
  <meta name="twitter:title" content="${escapeAttribute(PAGE_TITLE)}">
  <meta name="twitter:description" content="${escapeAttribute(PAGE_DESCRIPTION)}">
  <meta name="twitter:image" content="${SITE_URL}/assets/og-image.png">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
  <meta name="theme-color" content="#101820">
  <link rel="stylesheet" href="../assets/styles.css">
  <script type="application/ld+json">
${structuredData}
  </script>
</head>
<body>
  <a class="skip-link" href="#jobs">Skip to jobs</a>
  <header class="site-header">
    <a class="brand-mark" href="/" aria-label="Tamas Darvas home"><span>TD</span></a>
    <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="site-navigation">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="site-nav" id="site-navigation" aria-label="Primary navigation">
      <a href="/">Home</a>
      <a class="active" href="${JOBS_PATH}">AI Jobs</a>
    </nav>
  </header>
  <main id="jobs" class="jobs-page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li aria-current="page">AI Engineer Zürich Jobs</li>
      </ol>
    </nav>

    <section class="section jobs-section jobs-hero">
      <div class="section-kicker">Zürich AI job market</div>
      <h1>AI Engineer Zürich Jobs</h1>
      <p class="section-lede">Find refreshed AI Engineer Zurich jobs, machine learning engineer roles, LLM openings, generative AI jobs, MLOps roles, NLP roles and AI data science opportunities around Zürich, Switzerland.</p>
      <dl class="jobs-stats" aria-label="AI jobs snapshot metadata">
        <div>
          <dt>${results.length}</dt>
          <dd>deduplicated public search results</dd>
        </div>
        <div>
          <dt>Zürich</dt>
          <dd>Zurich, Switzerland and nearby AI roles</dd>
        </div>
        <div>
          <dt><time datetime="${escapeAttribute(generatedAt)}">${escapeHtml(generatedDate)}</time></dt>
          <dd>last static page generation</dd>
        </div>
      </dl>
      <nav class="jobs-topic-links" aria-label="AI jobs page sections">
        <a href="#current-ai-jobs">Current results</a>
        <a href="#tracked-ai-roles">Tracked roles</a>
        <a href="#zurich-ai-job-sources">Sources</a>
        <a href="#ai-jobs-faq">FAQ</a>
      </nav>
    </section>

    <section class="jobs-content-section" id="ai-engineer-zurich-market" aria-labelledby="ai-engineer-zurich-market-title">
      <div class="jobs-content-grid">
        <div>
          <div class="section-kicker">Search intent match</div>
          <h2 id="ai-engineer-zurich-market-title">AI engineering jobs in Zürich, from LLM application work to production MLOps.</h2>
        </div>
        <div class="jobs-copy">
          <p>This page is built for people searching for AI Engineer Zürich jobs, AI Engineer Zurich jobs, machine learning engineer roles, LLM engineer openings, generative AI work, and MLOps opportunities in the Swiss AI market.</p>
          <p>Results are discovered through generic search queries, filtered for AI engineering and Zurich or Switzerland relevance, deduplicated by URL, and cached as static HTML so search engines can crawl the current snapshot without client-side rendering.</p>
        </div>
      </div>
    </section>

    <section class="jobs-content-section" id="tracked-ai-roles" aria-labelledby="tracked-ai-roles-title">
      <div class="section-kicker">Role coverage</div>
      <h2 id="tracked-ai-roles-title">Tracked AI, ML, LLM and MLOps roles around Zurich.</h2>
      <ul class="jobs-role-list">
${renderTrackedRoles()}
      </ul>
    </section>

    <section class="jobs-content-section" id="current-ai-jobs" aria-labelledby="current-ai-jobs-title">
      <div class="jobs-table-heading">
        <div>
          <div class="section-kicker">Current results</div>
          <h2 id="current-ai-jobs-title">Current AI Engineer Zurich job search results</h2>
        </div>
        <p class="jobs-meta">Found ${results.length} results. Last generated: <time datetime="${escapeAttribute(generatedAt)}">${escapeHtml(generatedDisplay)}</time>.</p>
      </div>
${table}
    </section>

    <section class="jobs-content-section jobs-sources" id="zurich-ai-job-sources" aria-labelledby="zurich-ai-job-sources-title">
      <div class="jobs-content-grid">
        <div>
          <div class="section-kicker">Sources and related searches</div>
          <h2 id="zurich-ai-job-sources-title">Zurich AI job sources represented in this snapshot.</h2>
          <p class="jobs-meta">Outbound links use <code>nofollow</code> because the page points to third-party job search results and job boards.</p>
        </div>
        <div>
          <h3>Sources found</h3>
          <ul class="jobs-chip-list">
${renderSourceList(results)}
          </ul>
          <h3>Related AI job searches</h3>
          <ul class="jobs-chip-list">
${renderRelatedSearches()}
          </ul>
        </div>
      </div>
    </section>

    <section class="jobs-content-section jobs-faq" id="ai-jobs-faq" aria-labelledby="ai-jobs-faq-title">
      <div class="section-kicker">FAQ</div>
      <h2 id="ai-jobs-faq-title">AI Engineer Zürich jobs FAQ</h2>
${renderFaqHtml()}
    </section>
  </main>
  <script src="../assets/main.js" defer></script>
</body>
</html>
`;
}

async function serperSearch(query, { apiKey, gl = 'ch', hl = 'en', num = DEFAULT_MAX_RESULTS_PER_QUERY } = {}) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query, gl, hl, num }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Serper request failed for "${query}": ${response.status} ${response.statusText} ${text}`);
  }

  const data = await response.json();
  return data.organic ?? [];
}

export async function scrapeAiJobs({
  apiKey,
  queries = buildQueries(),
  maxResultsPerQuery = DEFAULT_MAX_RESULTS_PER_QUERY,
  delayMs = DEFAULT_DELAY_MS,
  gl = 'ch',
  hl = 'en',
} = {}) {
  if (!apiKey) throw new Error('Missing Serper API key. Set SERPER_DEV_API or SERPER_API_KEY in .env.');
  const queryResults = [];
  for (const [index, query] of queries.entries()) {
    const results = await serperSearch(query, { apiKey, gl, hl, num: maxResultsPerQuery });
    queryResults.push({ query, results });
    if (index < queries.length - 1 && delayMs > 0) await sleep(delayMs);
  }
  return mergeResults(queryResults);
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--out' && next) options.out = next, i += 1;
    else if (arg === '--json-out' && next) options.jsonOut = next, i += 1;
    else if (arg === '--table-out' && next) options.tableOut = next, i += 1;
    else if (arg === '--from-json' && next) options.fromJson = next, i += 1;
    else if (arg === '--max-results-per-query' && next) options.maxResultsPerQuery = Number(next), i += 1;
    else if (arg === '--delay-ms' && next) options.delayMs = Number(next), i += 1;
    else if (arg === '--query' && next) options.queries = [...(options.queries ?? []), next], i += 1;
  }
  return options;
}

async function main() {
  if (fs.existsSync('.env')) process.loadEnvFile();
  const options = parseArgs(process.argv.slice(2));
  let generatedAt = new Date().toISOString();
  let results;

  if (options.fromJson) {
    const cached = JSON.parse(fs.readFileSync(options.fromJson, 'utf8'));
    generatedAt = cached.generatedAt ?? generatedAt;
    results = cached.results ?? [];
  } else {
    const apiKey = process.env.SERPER_DEV_API || process.env.SERPER_API_KEY;
    results = await scrapeAiJobs({
      apiKey,
      queries: options.queries?.length ? options.queries : buildQueries(),
      maxResultsPerQuery: options.maxResultsPerQuery ?? DEFAULT_MAX_RESULTS_PER_QUERY,
      delayMs: options.delayMs ?? DEFAULT_DELAY_MS,
    });
  }

  const out = options.out ?? 'ai-engineer-zurich-jobs/index.html';
  const jsonOut = options.jsonOut ?? 'data/ai-engineer-zurich-jobs.json';
  const tableOut = options.tableOut ?? 'data/ai-engineer-zurich-jobs-table.html';

  const page = renderPage(results, { generatedAt });
  const table = renderHtmlTable(results, { generatedAt });
  const json = JSON.stringify({ generatedAt, count: results.length, results }, null, 2);

  for (const filePath of [out, jsonOut, tableOut]) fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(out, page);
  fs.writeFileSync(jsonOut, json + '\n');
  fs.writeFileSync(tableOut, table + '\n');

  console.log(`Generated ${results.length} results`);
  console.log(`Page: ${path.resolve(out)}`);
  console.log(`JSON: ${path.resolve(jsonOut)}`);
  console.log(`Table: ${path.resolve(tableOut)}`);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
