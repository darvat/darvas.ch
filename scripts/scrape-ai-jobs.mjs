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

export function loadDotEnv(envPath = '.env') {
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [rawKey, ...rest] = trimmed.split('=');
    const key = rawKey.trim();
    const value = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
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
        title: cleanTitle(item.title),
        link: normalizedUrl,
        snippet: cleanSnippet(item.snippet ?? ''),
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

function cleanTitle(title) {
  return String(title ?? '').replace(/\s+/g, ' ').trim();
}

function cleanSnippet(snippet) {
  return String(snippet ?? '').replace(/\s+/g, ' ').trim();
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

export function renderHtmlTable(results, { generatedAt = new Date().toISOString() } = {}) {
  const rows = results.map((job) => `        <tr>
          <td><a href="${escapeAttribute(job.link)}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtml(job.title)}</a></td>
          <td>${escapeHtml(job.snippet || 'No description available from search result.')}</td>
          <td>${escapeHtml(job.source)}</td>
        </tr>`).join('\n');

  return `<table class="jobs-table">
      <caption>AI engineering job search results around Zürich. Generated ${escapeHtml(new Date(generatedAt).toLocaleString('en-CH', { timeZone: 'Europe/Zurich' }))}.</caption>
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
  return `<!DOCTYPE html>
<html lang="en-CH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Engineer Zürich Jobs | darvas.ch</title>
  <meta name="description" content="Regularly refreshed AI engineer, machine learning engineer, LLM engineer, and generative AI jobs around Zürich, discovered via generic search queries.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://darvas.ch/ai-engineer-zurich-jobs/">
  <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
  <a class="skip-link" href="#jobs">Skip to jobs</a>
  <header class="site-header">
    <a class="brand-mark" href="/" aria-label="Tamas Darvas home"><span>TD</span></a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="/">Home</a>
      <a class="active" href="/ai-engineer-zurich-jobs/">AI Jobs</a>
    </nav>
  </header>
  <main id="jobs" class="jobs-page">
    <section class="section jobs-section">
      <div class="section-kicker">Zürich AI job market</div>
      <h1>AI Engineer Zürich Jobs</h1>
      <p class="section-lede">A generic, search-based snapshot of AI engineering roles around Zürich. Results are discovered through Serper/Google queries, deduplicated, and cached as static HTML. This is not a company-specific scraper.</p>
      <p class="jobs-meta">Found ${results.length} results. Last generated: ${escapeHtml(new Date(generatedAt).toLocaleString('en-CH', { timeZone: 'Europe/Zurich' }))}.</p>
${table}
    </section>
  </main>
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
    else if (arg === '--max-results-per-query' && next) options.maxResultsPerQuery = Number(next), i += 1;
    else if (arg === '--delay-ms' && next) options.delayMs = Number(next), i += 1;
    else if (arg === '--query' && next) options.queries = [...(options.queries ?? []), next], i += 1;
  }
  return options;
}

async function main() {
  loadDotEnv();
  const options = parseArgs(process.argv.slice(2));
  const apiKey = process.env.SERPER_DEV_API || process.env.SERPER_API_KEY;
  const generatedAt = new Date().toISOString();
  const results = await scrapeAiJobs({
    apiKey,
    queries: options.queries?.length ? options.queries : buildQueries(),
    maxResultsPerQuery: options.maxResultsPerQuery ?? DEFAULT_MAX_RESULTS_PER_QUERY,
    delayMs: options.delayMs ?? DEFAULT_DELAY_MS,
  });

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
