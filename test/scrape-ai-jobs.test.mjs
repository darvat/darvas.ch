import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeUrl,
  sourceFromUrl,
  isRelevantJobResult,
  mergeResults,
  renderHtmlTable,
  renderMarketSnapshotFacts,
  renderPage,
  buildQueries,
} from '../scripts/scrape-ai-jobs.mjs';

test('normalizeUrl removes tracking parameters and hash while preserving meaningful query params', () => {
  const input = 'https://www.jobs.ch/en/vacancies/?utm_source=x&location=z%C3%BCrich&term=ai%20engineer#top';
  assert.equal(normalizeUrl(input), 'https://jobs.ch/en/vacancies/?location=z%C3%BCrich&term=ai+engineer');
});

test('sourceFromUrl returns a readable advertising source', () => {
  assert.equal(sourceFromUrl('https://ch.linkedin.com/jobs/view/123?x=1'), 'ch.linkedin.com');
});

test('sourceFromUrl returns unknown for invalid URLs', () => {
  assert.equal(sourceFromUrl('not-a-url'), 'unknown');
});

test('isRelevantJobResult keeps AI engineering job results in Zurich and filters irrelevant pages', () => {
  assert.equal(isRelevantJobResult({
    title: 'Senior AI Engineer Zürich - jobs.ch',
    link: 'https://www.jobs.ch/en/vacancies/123',
    snippet: 'Build LLM and RAG systems in Zurich.',
  }), true);

  assert.equal(isRelevantJobResult({
    title: 'Apple Inc stock price',
    link: 'https://finance.example/apple',
    snippet: 'Latest share price news.',
  }), false);
});

test('mergeResults deduplicates normalized links and records source queries', () => {
  const merged = mergeResults([
    {
      query: 'AI Engineer Zurich jobs',
      results: [{ title: 'AI Engineer', link: 'https://www.example.com/job?utm_campaign=x&id=1', snippet: 'Zurich role' }],
    },
    {
      query: 'LLM Engineer Zurich jobs',
      results: [{ title: 'AI Engineer duplicate Zurich job', link: 'https://example.com/job?id=1', snippet: 'Same LLM role in Zurich' }],
    },
  ]);

  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].queries, ['AI Engineer Zurich jobs', 'LLM Engineer Zurich jobs']);
});

test('renderHtmlTable escapes untrusted result fields', () => {
  const html = renderHtmlTable([{
    title: '<script>alert(1)</script>',
    link: 'https://example.com/job',
    snippet: 'A <b>great</b> role',
    source: 'example.com',
    queries: ['AI Engineer Zurich jobs'],
  }], { generatedAt: '2026-05-07T19:00:00.000Z' });

  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /A &lt;b&gt;great&lt;\/b&gt; role/);
  assert.doesNotMatch(html, /<script>alert/);
});

test('buildQueries creates generic role/location searches, not company-specific searches', () => {
  const queries = buildQueries({ roles: ['AI Engineer'], locations: ['Zurich'], suffixes: ['jobs'] });
  assert.deepEqual(queries, ['AI Engineer Zurich jobs']);
});

test('renderPage includes SEO metadata and safe structured data', () => {
  const html = renderPage([{
    title: 'AI Engineer Zürich <script>alert(1)</script>',
    link: 'https://example.com/job',
    snippet: 'Build LLM and RAG systems around Zurich.',
    source: 'example.com',
    queries: ['AI Engineer Zurich jobs'],
  }], { generatedAt: '2026-05-07T17:18:02.455Z' });

  assert.match(html, /<link rel="canonical" href="https:\/\/darvas\.ch\/ai-engineer-zurich-jobs\/">/);
  assert.match(html, /<meta property="og:title" content="AI Engineer Zürich Jobs/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /"@type": "FAQPage"/);
  assert.match(html, /"@type": "ItemList"/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /AI Engineer Zürich &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test('renderMarketSnapshotFacts derives market page facts from generated jobs data', () => {
  const html = renderMarketSnapshotFacts([
    { title: 'AI Engineer', link: 'https://example.com/1' },
    { title: 'LLM Engineer', link: 'https://example.com/2' },
  ], { generatedAt: '2026-05-08T18:50:24.625Z' });

  assert.match(html, /2 deduplicated public results/);
  assert.match(html, /<time datetime="2026-05-08T18:50:24.625Z">2026-05-08<\/time>/);
});
