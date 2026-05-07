import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const files = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'assets',
  'ai-engineer-zurich-jobs',
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const target = path.join(dist, file);
  fs.cpSync(file, target, { recursive: true });
}

console.log(`Built static site in ${path.resolve(dist)}`);
