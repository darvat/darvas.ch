import fs from 'node:fs/promises';
import path from 'node:path';
import { replaceSiteHeaderRegions } from './site-chrome.mjs';

const SKIPPED_DIRS = new Set(['.git', 'dist', 'node_modules']);

async function listHtmlFiles(dir = '.') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIPPED_DIRS.has(entry.name)) continue;
      files.push(...await listHtmlFiles(path.join(dir, entry.name)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

async function syncSiteChrome() {
  const files = await listHtmlFiles();
  const changed = [];

  for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    const updated = replaceSiteHeaderRegions(html, file);
    if (updated === html) continue;

    await fs.writeFile(file, updated);
    changed.push(file);
  }

  if (changed.length) {
    console.log(`Synced shared site chrome in ${changed.length} files:`);
    changed.forEach((file) => console.log(`- ${file}`));
    return;
  }

  console.log('Shared site chrome already in sync');
}

syncSiteChrome().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
