import fs from 'node:fs/promises';
import path from 'node:path';

const dist = 'dist';
const files = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'assets',
  'ai-engineer-zurich-jobs',
];

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
      await fs.cp(file, target, { recursive: true });
    })
  );

  console.log(`Built static site in ${path.resolve(dist)}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
