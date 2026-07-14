import fs from 'node:fs/promises';
import path from 'node:path';
import { replaceSiteHeaderRegions } from './site-chrome.mjs';

const dist = 'dist';
const files = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'assets',
  'desmo',
  'ai-engineer-zurich-jobs',
  'field-notes',
  'leadership',
  'zurich-ai-market',
  'de',
];

function transformHtml(html, sourcePath) {
  return replaceSiteHeaderRegions(html, sourcePath);
}

async function copyEntry(source, target) {
  const stats = await fs.stat(source);

  if (stats.isDirectory()) {
    await fs.mkdir(target, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });
    await Promise.all(entries.map((entry) => {
      return copyEntry(path.join(source, entry.name), path.join(target, entry.name));
    }));
    return;
  }

  await fs.mkdir(path.dirname(target), { recursive: true });

  if (source.endsWith('.html')) {
    const html = await fs.readFile(source, 'utf8');
    await fs.writeFile(target, transformHtml(html, source));
    return;
  }

  await fs.copyFile(source, target);
}

async function build() {
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });

  await Promise.all(
    files.map(async (file) => {
      try {
        await fs.access(file);
      } catch {
        return;
      }
      const target = path.join(dist, file);
      await copyEntry(file, target);
    })
  );

  console.log(`Built static site in ${path.resolve(dist)}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
