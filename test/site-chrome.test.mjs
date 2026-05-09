import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { renderSiteHeader, replaceSiteHeaderRegions } from '../scripts/site-chrome.mjs';

const TEMPLATED_HEADER_PAGES = [
  'index.html',
  'field-notes/index.html',
  'field-notes/production-rag/index.html',
  'field-notes/agentic-ai-enterprise/index.html',
  'field-notes/llm-evaluation/index.html',
  'field-notes/ai-platform-architecture/index.html',
  'leadership/index.html',
  'zurich-ai-market/index.html',
  'de/ki-engineer-zuerich/index.html',
];

test('renderSiteHeader renders shared dropdown navigation with active section', () => {
  const html = renderSiteHeader({ active: 'field-notes' });

  assert.match(html, /<a class="active" href="\/field-notes\/" aria-haspopup="true">Field Notes<\/a>/);
  assert.match(html, /aria-label="Field Notes submenu"/);
  assert.match(html, /href="\/field-notes\/llm-evaluation\/">LLM Evaluation<\/a>/);
  assert.match(html, /aria-label="Leadership submenu"/);
  assert.match(html, /href="\/leadership\/#leverage-title">How I Create Leverage<\/a>/);
});

test('renderSiteHeader preserves German page navigation labels', () => {
  const html = renderSiteHeader({ variant: 'de' });

  assert.match(html, /aria-label="Tamas Darvas Startseite"/);
  assert.match(html, /aria-label="Navigation öffnen"/);
  assert.match(html, /aria-label="Hauptnavigation"/);
  assert.match(html, /<a href="\/">English<\/a>/);
  assert.match(html, /<a href="\/#contact">Kontakt<\/a>/);
  assert.doesNotMatch(html, /href="\/#profile">Profile<\/a>/);
});

test('hand-authored pages use synced shared site header blocks', () => {
  for (const page of TEMPLATED_HEADER_PAGES) {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /<!-- site-header: \{.*\} -->\s*<header class="site-header"/, page);
    assert.match(html, /<!-- \/site-header -->/, page);
    assert.equal(replaceSiteHeaderRegions(html, page), html, page);
  }
});
