## 2026-05-09 11:13 CEST — TASK-000 — DONE

**Task:**  
Initialize agent worklog, machine-readable task state, and verification notes for the PRD implementation loop.

**PRD references:**  
PRD §16, PRD §19

**Files changed:**  
.agent/worklog.md, .agent/todo-state.json, .agent/verification-notes.md

**Commands run:**  
```bash
mkdir -p .agent
```

**Result:**  
Created `.agent/` and added all task IDs from the TODO controller to `.agent/todo-state.json`.

**Notes:**  
The restart files were missing at session start, so the state was initialized from the TODO document and current repo evidence.

**Next action:**  
Record baseline checks and continue with TASK-010.

## 2026-05-09 11:13 CEST — TASK-001 — DONE

**Task:**  
Baseline repo verification and implementation branch setup.

**PRD references:**  
PRD §3.1, PRD §16 Task 1

**Files changed:**  
.agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
git status --short
npm test
npm run build
git branch --show-current
git checkout -b feat/brand-seo-recruiter-site-evolution
```

**Result:**  
Baseline `npm test` passed with 8 passing tests. Baseline `npm run build` passed and created `dist`. The implementation branch is `feat/brand-seo-recruiter-site-evolution`.

**Notes:**  
Pre-existing worktree change before implementation: `.gitignore` already had an uncommitted change adding `docs/`. It is outside the implementation scope and must not be reverted or included accidentally.

**Next action:**  
Start TASK-010 global reusable CSS components.

## 2026-05-09 11:14 CEST — TASK-010 — IN_PROGRESS

**Task:**  
Add global reusable CSS components for page heroes, article layouts, cards, frameworks, checklists, CTAs, market signals, and proof blocks.

**PRD references:**  
PRD §7.3, PRD §7.4, PRD §16 Task 2

**Files changed:**  
Pending: assets/styles.css

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The new styles must preserve the existing dark technical direction, orange accent, responsive grids, readable article pages, visible focus states, and the existing jobs-page styles.

**Next action:**  
Patch `assets/styles.css` with reusable static-site components.

## 2026-05-09 11:16 CEST — TASK-010 — DONE

**Task:**  
Add global reusable CSS components for page heroes, article layouts, cards, frameworks, checklists, CTAs, market signals, and proof blocks.

**PRD references:**  
PRD §7.3, PRD §7.4, PRD §16 Task 2

**Files changed:**  
assets/styles.css, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
for cls in page-hero breadcrumb article-layout article-meta article-toc article-card-grid article-card principle-grid principle-card checklist-block framework-grid framework-card architecture-stack architecture-layer cta-panel market-signal-grid market-signal-card language-switch brand-thesis proof-grid decision-rule design-review-questions; do rg -q "\\.$cls" assets/styles.css || echo "missing $cls"; done
```

**Result:**  
`npm run build` passed. The required reusable classes were found in `assets/styles.css`; the class scan printed no missing classes.

**Notes:**  
Added responsive page/article components, visible focus outlines, card grids, checklist/decision blocks, CTA panels, language switch, and accessible architecture stack styles while preserving the existing palette and jobs-page styles.

**Next action:**  
Start TASK-011 static build script update.

## 2026-05-09 11:16 CEST — TASK-011 — IN_PROGRESS

**Task:**  
Update the static build script so new public directories are copied to `dist`.

**PRD references:**  
PRD §14.3, PRD §16 Task 3

**Files changed:**  
Pending: scripts/build-static.mjs

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The current copy logic already tolerates missing paths via `fs.access`, so the primary required change is the `files` array.

**Next action:**  
Patch `scripts/build-static.mjs` to include `field-notes`, `leadership`, `zurich-ai-market`, and `de`.

## 2026-05-09 11:17 CEST — TASK-011 — DONE

**Task:**  
Update the static build script so new public directories are copied to `dist`.

**PRD references:**  
PRD §14.3, PRD §16 Task 3

**Files changed:**  
scripts/build-static.mjs, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
sed -n '1,32p' scripts/build-static.mjs
```

**Result:**  
`npm run build` passed. The `files` array now includes `field-notes`, `leadership`, `zurich-ai-market`, and `de`. Existing missing-directory tolerance remains in place.

**Notes:**  
No extra build complexity was introduced.

**Next action:**  
Start TASK-020 homepage metadata, navigation, and hero update.

## 2026-05-09 11:17 CEST — TASK-020 — IN_PROGRESS

**Task:**  
Update homepage metadata, navigation, hero positioning, brand line, and proof chips.

**PRD references:**  
PRD §5.4, PRD §8.2, PRD §8.3, PRD §14.4

**Files changed:**  
Pending: index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The homepage must keep exactly one H1 and preserve contact reveal behavior.

**Next action:**  
Patch homepage head metadata, nav, and hero copy.

## 2026-05-09 11:18 CEST — TASK-020 — DONE

**Task:**  
Update homepage metadata, navigation, hero positioning, brand line, and proof chips.

**PRD references:**  
PRD §5.4, PRD §8.2, PRD §8.3, PRD §14.4

**Files changed:**  
index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n "Production AI, without theatre" dist/index.html
grep -n "AI Engineering Lead for Production AI Platforms" dist/index.html
grep -n "/field-notes/" dist/index.html
grep -n "/leadership/" dist/index.html
grep -n "/zurich-ai-market/" dist/index.html
python3 - <<'PY'
from pathlib import Path
import re
text = Path('index.html').read_text()
print(len(re.findall(r'<h1\b', text, flags=re.I)))
PY
```

**Result:**  
`npm run build` passed. Grep checks found the brand line, hero H2, and new navigation targets in `dist/index.html`. The homepage source has exactly one H1.

**Notes:**  
The direct homepage navigation link to AI Jobs was removed and replaced with Field Notes, Leadership, and Zurich AI Market.

**Next action:**  
Start TASK-021 homepage production-AI lens section.

## 2026-05-09 11:18 CEST — TASK-021 — IN_PROGRESS

**Task:**  
Add homepage production-AI lens section.

**PRD references:**  
PRD §8.4

**Files changed:**  
Pending: index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The section should be crawlable, near the top, and use public-safe proof-by-thinking language.

**Next action:**  
Patch `index.html` after the hero with the production-AI lens section.

## 2026-05-09 11:19 CEST — TASK-021 — DONE

**Task:**  
Add homepage production-AI lens section.

**PRD references:**  
PRD §8.4

**Files changed:**  
index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n "Production AI needs more than a good model" dist/index.html
grep -n "Useful beats impressive" dist/index.html
grep -n "Governance belongs in the architecture" dist/index.html
grep -nE "revolutionary AI|unlock the power of AI|cutting-edge transformation|next-generation disruption|AI visionary|thought leader|guru|rockstar|ninja|10x|game-changing|world-class|future-proof your business|AI magic|disrupt everything" index.html || true
```

**Result:**  
`npm run build` passed. Required section heading and principle cards were found in `dist/index.html`. The hype-phrase scan returned no matches for the homepage source.

**Notes:**  
The lens section is visible HTML immediately after the hero and uses the PRD §8.4 copy.

**Next action:**  
Start TASK-022 homepage AI / People / Data / Code framework block.

## 2026-05-09 11:19 CEST — TASK-022 — IN_PROGRESS

**Task:**  
Add homepage AI / People / Data / Code framework.

**PRD references:**  
PRD §1.6, PRD §8.5

**Files changed:**  
Pending: index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The block must be accessible HTML and reinforce the existing visual motif.

**Next action:**  
Patch homepage framework section.

## 2026-05-09 11:19 CEST — TASK-022 — DONE

**Task:**  
Add homepage AI / People / Data / Code framework.

**PRD references:**  
PRD §1.6, PRD §8.5

**Files changed:**  
index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n "AI, people, data, and code" dist/index.html
grep -n "Production AI sits at the intersection" dist/index.html
```

**Result:**  
`npm run build` passed. The framework heading and core line were found in `dist/index.html`.

**Notes:**  
The framework is accessible HTML using the reusable `.framework-grid` and `.framework-card` classes.

**Next action:**  
Start TASK-023 homepage problem-solving section.

## 2026-05-09 11:19 CEST — TASK-023 — IN_PROGRESS

**Task:**  
Add homepage problem-solving section.

**PRD references:**  
PRD §8.6

**Files changed:**  
Pending: index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The section must include all six required cards and avoid confidential or invented claims.

**Next action:**  
Patch homepage problem-solving section.

## 2026-05-09 11:20 CEST — TASK-023 — DONE

**Task:**  
Add homepage problem-solving section.

**PRD references:**  
PRD §8.6

**Files changed:**  
index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n "AI engineering problems I help teams solve" dist/index.html
grep -n "Enterprise RAG and knowledge systems" dist/index.html
grep -n "Agentic workflows with guardrails" dist/index.html
```

**Result:**  
`npm run build` passed. The required heading and sample required cards were found in `dist/index.html`; all six PRD cards were added to source.

**Notes:**  
The section uses reusable article-card styling and public-safe problem statements.

**Next action:**  
Start TASK-024 differentiation, recruiter CTA, and bottom CTA sections.

## 2026-05-09 11:20 CEST — TASK-024 — IN_PROGRESS

**Task:**  
Add homepage differentiation and recruiter CTA sections.

**PRD references:**  
PRD §8.7, PRD §8.8, PRD §8.9, PRD §8.10

**Files changed:**  
Pending: index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The copy must not say "actively looking" and must avoid unsupported metrics beyond safe PRD facts.

**Next action:**  
Patch homepage differentiation, recruiter section, and bottom CTA.

## 2026-05-09 11:21 CEST — TASK-024 — DONE

**Task:**  
Add homepage differentiation and recruiter CTA sections.

**PRD references:**  
PRD §8.7, PRD §8.8, PRD §8.9, PRD §8.10

**Files changed:**  
index.html, assets/styles.css, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n "Why this profile is different" dist/index.html
grep -n "For recruiters and hiring managers in Zurich" dist/index.html
grep -n "Building AI beyond the prototype stage" dist/index.html
grep -n "actively looking" index.html || true
python3 - <<'PY'
from pathlib import Path
import re
text = Path('dist/index.html').read_text()
print('h1=', len(re.findall(r'<h1\b', text, flags=re.I)))
PY
```

**Result:**  
`npm run build` passed. Required differentiation, recruiter, and bottom CTA headings were found in `dist/index.html`. The homepage does not contain "actively looking" and still has exactly one H1.

**Notes:**  
Added light-surface button styling so recruiter CTAs remain readable outside the dark hero.

**Next action:**  
Start TASK-030 Field Notes landing page.

## 2026-05-09 11:21 CEST — TASK-030 — IN_PROGRESS

**Task:**  
Create Field Notes landing page.

**PRD references:**  
PRD §9

**Files changed:**  
Pending: field-notes/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The page must read like a production AI playbook, not a generic blog index, and include CollectionPage / ItemList JSON-LD.

**Next action:**  
Create `field-notes/index.html`.

## 2026-05-09 11:22 CEST — TASK-030 — IN_PROGRESS

**Task:**  
Create Field Notes landing page.

**PRD references:**  
PRD §9

**Files changed:**  
field-notes/index.html, assets/styles.css, .agent/worklog.md

**Commands run:**  
```bash
python3 - <<'PY'
from pathlib import Path
import re
text = Path('dist/field-notes/index.html').read_text()
print('h1=', len(re.findall(r'<h1\b', text, flags=re.I)))
PY
```

**Result:**  
Failed with `FileNotFoundError: dist/field-notes/index.html` because the Python verification ran in parallel before the build command finished recreating `dist`.

**Notes:**  
This was a verification-order issue, not a source-page failure. Rerun the check after `npm run build` has completed.

**Next action:**  
Rerun Field Notes verification sequentially.

## 2026-05-09 11:23 CEST — TASK-030 — DONE

**Task:**  
Create Field Notes landing page.

**PRD references:**  
PRD §9

**Files changed:**  
field-notes/index.html, assets/styles.css, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/field-notes/index.html
grep -n "AI Engineering Field Notes" dist/field-notes/index.html
grep -n "The demo is not the system" dist/field-notes/index.html
grep -n "CollectionPage" dist/field-notes/index.html
python3 - <<'PY'
from pathlib import Path
import re
text = Path('dist/field-notes/index.html').read_text()
print('h1=', len(re.findall(r'<h1\b', text, flags=re.I)))
for href in ['/field-notes/production-rag/','/field-notes/agentic-ai-enterprise/','/field-notes/llm-evaluation/','/field-notes/ai-platform-architecture/']:
    print(href, href in text)
PY
```

**Result:**  
`npm run build` passed. `dist/field-notes/index.html` exists. Required H1/title text, brand thesis, `CollectionPage`, and all four article links were present. H1 count is 1.

**Notes:**  
The page is static, crawlable, and framed as field notes/playbook content rather than a generic blog index.

**Next action:**  
Start TASK-040 Production RAG field note.

## 2026-05-09 11:23 CEST — TASK-040 — IN_PROGRESS

**Task:**  
Create Production RAG field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.5

**Files changed:**  
Pending: field-notes/production-rag/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The article must include the required sections, checklist, design-review questions, Article and BreadcrumbList JSON-LD, internal links, at least two signature components, and public-safe original content.

**Next action:**  
Create `field-notes/production-rag/index.html`.

## 2026-05-09 11:25 CEST — TASK-040 — DONE

**Task:**  
Create Production RAG field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.5

**Files changed:**  
field-notes/production-rag/index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/field-notes/production-rag/index.html
grep -n "Production RAG: what matters after the demo" dist/field-notes/production-rag/index.html
grep -n "Questions I would ask in a design review" dist/field-notes/production-rag/index.html
grep -n "Production RAG readiness checklist" dist/field-notes/production-rag/index.html
grep -n '"@type": "Article"' dist/field-notes/production-rag/index.html
grep -n '"@type": "BreadcrumbList"' dist/field-notes/production-rag/index.html
python3 - <<'PY'
# word count for article body
PY
```

**Result:**  
`npm run build` passed. Built article exists and contains the required H1/heading text, design-review questions, readiness checklist, Article JSON-LD, and BreadcrumbList JSON-LD. Article body word count is 945 words.

**Notes:**  
The article includes production decision rule, design-review questions, checklist, AI / People / Data / Code reference, and internal link to the LLM evaluation note.

**Next action:**  
Start TASK-041 Agentic AI field note.

## 2026-05-09 11:25 CEST — TASK-041 — IN_PROGRESS

**Task:**  
Create Agentic AI field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.6

**Files changed:**  
Pending: field-notes/agentic-ai-enterprise/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The article must explain bounded autonomy, approval, auditability, and failure boundaries without hype.

**Next action:**  
Create `field-notes/agentic-ai-enterprise/index.html`.

## 2026-05-09 11:26 CEST — TASK-041 — DONE

**Task:**  
Create Agentic AI field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.6

**Files changed:**  
field-notes/agentic-ai-enterprise/index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/field-notes/agentic-ai-enterprise/index.html
grep -n "Agentic AI in regulated enterprises" dist/field-notes/agentic-ai-enterprise/index.html
grep -n "Agentic workflow design checklist" dist/field-notes/agentic-ai-enterprise/index.html
grep -n "What is the agent allowed to do without approval" dist/field-notes/agentic-ai-enterprise/index.html
grep -n '"@type": "Article"' dist/field-notes/agentic-ai-enterprise/index.html
python3 - <<'PY'
# word count for article body
PY
```

**Result:**  
`npm run build` passed. Built article exists and contains required heading, checklist, design-review question, and Article JSON-LD. Article body word count is 935 words.

**Notes:**  
The article includes production decision rule, AI / People / Data / Code breakdown, design-review questions, checklist, and an internal link to the platform architecture note.

**Next action:**  
Start TASK-042 LLM Evaluation field note.

## 2026-05-09 11:26 CEST — TASK-042 — IN_PROGRESS

**Task:**  
Create LLM Evaluation field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.7

**Files changed:**  
Pending: field-notes/llm-evaluation/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The article must connect quality, risk, regression behavior, monitoring, and ownership.

**Next action:**  
Create `field-notes/llm-evaluation/index.html`.

## 2026-05-09 11:29 CEST — TASK-042 — DONE

**Task:**  
Create LLM Evaluation field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.7

**Files changed:**  
field-notes/llm-evaluation/index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/field-notes/llm-evaluation/index.html
grep -n "Evaluating LLM applications in production" dist/field-notes/llm-evaluation/index.html
grep -n "LLM evaluation framework" dist/field-notes/llm-evaluation/index.html
grep -n "What does a good answer mean" dist/field-notes/llm-evaluation/index.html
grep -n '"@type": "Article"' dist/field-notes/llm-evaluation/index.html
python3 - <<'PY'
# word count for article body
PY
```

**Result:**  
Initial article body count was 783 words, below the PRD requirement, so the article was expanded. Final `npm run build` passed and final article body word count is 943 words. Required heading, framework, design-review question, and Article JSON-LD were present.

**Notes:**  
The article includes production decision rule, design-review questions, evaluation framework categories, AI / People / Data / Code reference, and internal link to the Production RAG note.

**Next action:**  
Start TASK-043 AI Platform Architecture field note.

## 2026-05-09 11:29 CEST — TASK-043 — IN_PROGRESS

**Task:**  
Create AI Platform Architecture field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.8

**Files changed:**  
Pending: field-notes/ai-platform-architecture/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The article must include accessible HTML reference architecture layers, checklist, design-review questions, and platform/developer-experience emphasis.

**Next action:**  
Create `field-notes/ai-platform-architecture/index.html`.

## 2026-05-09 11:31 CEST — TASK-043 — DONE

**Task:**  
Create AI Platform Architecture field note.

**PRD references:**  
PRD §10.2, PRD §10.3, PRD §10.4, PRD §10.8

**Files changed:**  
field-notes/ai-platform-architecture/index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/field-notes/ai-platform-architecture/index.html
grep -n "AI platform architecture for enterprise teams" dist/field-notes/ai-platform-architecture/index.html
grep -n "Reference architecture" dist/field-notes/ai-platform-architecture/index.html
grep -n "Developer tooling and templates" dist/field-notes/ai-platform-architecture/index.html
grep -n '"@type": "Article"' dist/field-notes/ai-platform-architecture/index.html
python3 - <<'PY'
# word count for article body
PY
```

**Result:**  
Initial article body count was 863 words, below the PRD requirement, so the article was expanded. Final `npm run build` passed and final article body word count is 956 words. Required heading, reference architecture, developer tooling layer, and Article JSON-LD were present.

**Notes:**  
The reference architecture is accessible HTML using `.architecture-stack` and `.architecture-layer`, not an image-only diagram.

**Next action:**  
Start TASK-050 Leadership page.

## 2026-05-09 11:31 CEST — TASK-050 — IN_PROGRESS

**Task:**  
Create Leadership page.

**PRD references:**  
PRD §11

**Files changed:**  
Pending: leadership/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The page must include the leadership thesis, required sections, principle cards, leverage bullets, and ProfilePage/AboutPage JSON-LD without inflated management claims.

**Next action:**  
Create `leadership/index.html`.

## 2026-05-09 11:33 CEST — TASK-050 — DONE

**Task:**  
Create Leadership page.

**PRD references:**  
PRD §11

**Files changed:**  
leadership/index.html, index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/leadership/index.html
grep -n "How I lead AI engineering teams" dist/leadership/index.html
grep -n "I lead AI engineering teams by reducing ambiguity" dist/leadership/index.html
grep -n "How I create leverage" dist/leadership/index.html
grep -n "What I do not optimise for" dist/leadership/index.html
python3 - <<'PY'
# H1 count and framework link check
PY
```

**Result:**  
`npm run build` passed. Built leadership page exists and contains the required H1, leadership thesis, "How I create leverage", and "What I do not optimise for" sections. H1 count is 1 and the page links back to `/#ai-people-data-code`.

**Notes:**  
Added the homepage `#ai-people-data-code` anchor to support the leadership page’s framework link.

**Next action:**  
Start TASK-060 Zurich AI Market Radar page.

## 2026-05-09 11:33 CEST — TASK-060 — IN_PROGRESS

**Task:**  
Create Zurich AI Market Radar page.

**PRD references:**  
PRD §12.1–§12.8

**Files changed:**  
Pending: zurich-ai-market/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The page must interpret hiring signals, link to the jobs snapshot, and reinforce AI / People / Data / Code.

**Next action:**  
Create `zurich-ai-market/index.html`.

## 2026-05-09 11:34 CEST — TASK-060 — DONE

**Task:**  
Create Zurich AI Market Radar page.

**PRD references:**  
PRD §12.1–§12.8

**Files changed:**  
zurich-ai-market/index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync('data/ai-engineer-zurich-jobs.json','utf8')); console.log(d.generatedAt, d.count, d.results?.length);"
npm run build
test -f dist/zurich-ai-market/index.html
grep -n "Zurich AI Engineering Market Radar" dist/zurich-ai-market/index.html
grep -n "What hiring signals reveal about production AI maturity" dist/zurich-ai-market/index.html
grep -n "/ai-engineer-zurich-jobs/" dist/zurich-ai-market/index.html
python3 - <<'PY'
# H1 count check
PY
```

**Result:**  
`npm run build` passed. Built market page exists, contains the required H1, supporting line, link to `/ai-engineer-zurich-jobs/`, and has exactly one H1. Cached jobs data currently reports 60 results generated on 2026-05-08.

**Notes:**  
The page interprets hiring signals and treats the jobs page as a static snapshot, not as the primary market insight page.

**Next action:**  
Start TASK-061 jobs page reframing through the generator.

## 2026-05-09 11:34 CEST — TASK-061 — IN_PROGRESS

**Task:**  
Reframe existing Zurich AI jobs page.

**PRD references:**  
PRD §12.9

**Files changed:**  
Pending: scripts/scrape-ai-jobs.mjs and regenerated ai-engineer-zurich-jobs/index.html

**Commands run:**  
```bash
sed -n '340,510p' scripts/scrape-ai-jobs.mjs
```

**Result:**  
Task started. The jobs page is generated by `scripts/scrape-ai-jobs.mjs`; durable changes must be made in the generator and then regenerated.

**Notes:**  
Preserve job listings and outbound job links with `rel="nofollow noopener noreferrer"`.

**Next action:**  
Patch the jobs page generator template and regenerate from cached data.

## 2026-05-09 11:35 CEST — TASK-061 — DONE

**Task:**  
Reframe existing Zurich AI jobs page.

**PRD references:**  
PRD §12.9

**Files changed:**  
scripts/scrape-ai-jobs.mjs, ai-engineer-zurich-jobs/index.html, data/ai-engineer-zurich-jobs.json, data/ai-engineer-zurich-jobs-table.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
sed -n '340,510p' scripts/scrape-ai-jobs.mjs
node scripts/scrape-ai-jobs.mjs --from-json data/ai-engineer-zurich-jobs.json
npm test
npm run build
grep -n "/zurich-ai-market/" dist/ai-engineer-zurich-jobs/index.html
grep -n "nofollow noopener noreferrer" dist/ai-engineer-zurich-jobs/index.html | head
```

**Result:**  
Generator inspection confirmed the jobs page is generated. The generator was updated and the page was regenerated from cached data. `npm test` passed with 8 tests and `npm run build` passed. Built jobs page links back to `/zurich-ai-market/`, and outbound job links retain `rel="nofollow noopener noreferrer"`.

**Notes:**  
The page now explains that it is a static search-based snapshot and points to the Zurich AI Market Radar for interpretation.

**Next action:**  
Start TASK-070 German local landing page.

## 2026-05-09 11:35 CEST — TASK-070 — IN_PROGRESS

**Task:**  
Create German local landing page.

**PRD references:**  
PRD §13

**Files changed:**  
Pending: de/ki-engineer-zuerich/index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
The page must use `lang="de-CH"`, be concise/simple German, include required sections, and avoid overstating German fluency.

**Next action:**  
Create `de/ki-engineer-zuerich/index.html`.

## 2026-05-09 11:37 CEST — TASK-070 — DONE

**Task:**  
Create German local landing page.

**PRD references:**  
PRD §13

**Files changed:**  
de/ki-engineer-zuerich/index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
test -f dist/de/ki-engineer-zuerich/index.html
grep -n 'lang="de-CH"' dist/de/ki-engineer-zuerich/index.html
grep -n "KI Engineer Zürich" dist/de/ki-engineer-zuerich/index.html
grep -n 'hreflang="de-CH"' dist/de/ki-engineer-zuerich/index.html
python3 - <<'PY'
# H1 and visible word count check
PY
```

**Result:**  
`npm run build` passed. Built German page exists, has `lang="de-CH"`, required KI Engineer Zürich title/H1 text, `hreflang="de-CH"`, exactly one H1, and 402 visible words.

**Notes:**  
The page uses simple German, mentions English/Hungarian/German B1, and does not claim native German fluency.

**Next action:**  
Start TASK-071 homepage German hreflang.

## 2026-05-09 11:37 CEST — TASK-071 — IN_PROGRESS

**Task:**  
Add German hreflang to homepage.

**PRD references:**  
PRD §13.3

**Files changed:**  
Pending: index.html

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Keep existing canonical, en-CH, and x-default links.

**Next action:**  
Patch homepage alternate links with `de-CH`.

## 2026-05-09 11:38 CEST — TASK-071 — DONE

**Task:**  
Add German hreflang to homepage.

**PRD references:**  
PRD §13.3

**Files changed:**  
index.html, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n 'hreflang="de-CH"' dist/index.html
grep -n 'hreflang="en-CH"' dist/index.html
grep -n 'hreflang="x-default"' dist/index.html
```

**Result:**  
`npm run build` passed. Homepage has `de-CH`, `en-CH`, and `x-default` alternate links in built output.

**Notes:**  
Homepage canonical remained unchanged.

**Next action:**  
Start TASK-080 sitemap update.

## 2026-05-09 11:38 CEST — TASK-080 — IN_PROGRESS

**Task:**  
Update sitemap.

**PRD references:**  
PRD §14.2

**Files changed:**  
Pending: sitemap.xml

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Use implementation date for new pages and keep jobs page daily.

**Next action:**  
Patch `sitemap.xml` with all required URLs.

## 2026-05-09 11:38 CEST — TASK-080 — DONE

**Task:**  
Update sitemap.

**PRD references:**  
PRD §14.2

**Files changed:**  
sitemap.xml, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
grep -n "field-notes" dist/sitemap.xml
grep -n "leadership" dist/sitemap.xml
grep -n "zurich-ai-market" dist/sitemap.xml
grep -n "ki-engineer-zuerich" dist/sitemap.xml
python3 - <<'PY'
from xml.etree import ElementTree as ET
ET.parse('sitemap.xml')
print('xml ok')
PY
```

**Result:**  
`npm run build` passed. Built sitemap includes field notes, leadership, Zurich AI Market, and German local page URLs. Source sitemap parses as valid XML.

**Notes:**  
All PRD required URLs are present in source and copied to `dist`.

**Next action:**  
Start TASK-081 metadata and structured-data audit.

## 2026-05-09 11:38 CEST — TASK-081 — IN_PROGRESS

**Task:**  
Complete metadata and structured-data audit.

**PRD references:**  
PRD §14.4, PRD §14.5

**Files changed:**  
Pending if audit finds issues.

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Audit must check every built `index.html` for exactly one H1 and required metadata/JSON-LD.

**Next action:**  
Run metadata audit against `dist`.

## 2026-05-09 11:39 CEST — TASK-081 — DONE

**Task:**  
Complete metadata and structured-data audit.

**PRD references:**  
PRD §14.4, PRD §14.5

**Files changed:**  
.agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
python3 - <<'PY'
# metadata and structured-data audit over dist/**/*.html
PY
```

**Result:**  
`npm run build` passed. Metadata audit checked 10 built HTML pages. Every page has exactly one H1 and no missing title, description, canonical, OpenGraph title/description, Twitter card, or JSON-LD.

**Notes:**  
No HTML files needed changes from this audit.

**Next action:**  
Start TASK-082 internal link audit.

## 2026-05-09 11:39 CEST — TASK-082 — IN_PROGRESS

**Task:**  
Complete internal link audit.

**PRD references:**  
PRD §14.6, PRD §15

**Files changed:**  
Pending if audit finds issues.

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Audit must verify root-relative internal links resolve inside built `dist`.

**Next action:**  
Run internal link audit.

## 2026-05-09 11:40 CEST — TASK-082 — DONE

**Task:**  
Complete internal link audit.

**PRD references:**  
PRD §14.6, PRD §15

**Files changed:**  
.agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm run build
python3 - <<'PY'
# internal root-relative link audit over dist/**/*.html
PY
python3 - <<'PY'
# job outbound rel audit
PY
```

**Result:**  
`npm run build` passed. Internal link audit reported: `No broken internal root-relative links found.` Job outbound rel audit reported `bad_job_links= 0`.

**Notes:**  
No HTML files needed changes from this audit.

**Next action:**  
Start TASK-083 brand, safety, and banned-phrase audit.

## 2026-05-09 11:40 CEST — TASK-083 — IN_PROGRESS

**Task:**  
Complete brand, safety, and banned-phrase audit.

**PRD references:**  
PRD §2, PRD §6, PRD §17

**Files changed:**  
Pending if audit finds issues; `.agent/verification-notes.md` must record results.

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Run banned phrase scan and confidentiality scan, inspect matches manually, and record checklist results.

**Next action:**  
Run brand/safety scans.

## 2026-05-09 11:41 CEST — TASK-083 — DONE

**Task:**  
Complete brand, safety, and banned-phrase audit.

**PRD references:**  
PRD §2, PRD §6, PRD §17

**Files changed:**  
index.html, .agent/verification-notes.md, .agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
grep -RInE "revolutionary AI|unlock the power of AI|cutting-edge transformation|next-generation disruption|AI visionary|thought leader|guru|rockstar|ninja|10x|game-changing|world-class|future-proof your business|AI magic|disrupt everything" index.html field-notes leadership zurich-ai-market de ai-engineer-zurich-jobs || true
grep -RInE "UBS|Credit Suisse|internal system|roadmap|budget|team size|users|production scale|certification|endorsement|client" index.html field-notes leadership zurich-ai-market de ai-engineer-zurich-jobs || true
grep -RIn "Production AI, without theatre" index.html field-notes leadership zurich-ai-market de ai-engineer-zurich-jobs || true
grep -RIn "AI / People / Data / Code\\|AI, people, data, and code\\|AI, People, Data, and Code" index.html field-notes leadership zurich-ai-market de ai-engineer-zurich-jobs || true
npm run build
```

**Result:**  
Banned hype phrase scan returned no matches. Confidentiality scan matches were inspected. Remaining employer-name and existing credential matches are public resume-style labels, not introduced confidential details; generic `users` matches are normal field-note product wording. `roadmaps` wording and an explicit team-count style line were rewritten to safer public wording. `npm run build` passed.

**Notes:**  
Full manual brand/safety checklist is recorded in `.agent/verification-notes.md`.

**Next action:**  
Start TASK-090 final build/test verification.

## 2026-05-09 11:41 CEST — TASK-090 — IN_PROGRESS

**Task:**  
Final build/test verification.

**PRD references:**  
PRD §16, PRD §17

**Files changed:**  
Pending if final verification finds issues.

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Run final `npm test`, `npm run build`, sitemap checks, and page inventory.

**Next action:**  
Run final verification commands.

## 2026-05-09 11:42 CEST — TASK-090 — DONE

**Task:**  
Final build/test verification.

**PRD references:**  
PRD §16, PRD §17

**Files changed:**  
.agent/worklog.md, .agent/todo-state.json

**Commands run:**  
```bash
npm test
npm run build
git status --short
grep -n "https://darvas.ch/field-notes/" dist/sitemap.xml
grep -n "https://darvas.ch/field-notes/production-rag/" dist/sitemap.xml
grep -n "https://darvas.ch/field-notes/agentic-ai-enterprise/" dist/sitemap.xml
grep -n "https://darvas.ch/field-notes/llm-evaluation/" dist/sitemap.xml
grep -n "https://darvas.ch/field-notes/ai-platform-architecture/" dist/sitemap.xml
grep -n "https://darvas.ch/leadership/" dist/sitemap.xml
grep -n "https://darvas.ch/zurich-ai-market/" dist/sitemap.xml
grep -n "https://darvas.ch/de/ki-engineer-zuerich/" dist/sitemap.xml
find dist -name index.html | sort
```

**Result:**  
`npm test` passed with 8 passing tests. `npm run build` passed. Required sitemap URLs were found. Built page inventory contains 10 index pages: homepage, jobs, German page, field notes landing, four field notes, leadership, and Zurich market.

**Notes:**  
`git status --short` still shows pre-existing `.gitignore` modification adding `docs/`; it remains outside the implementation commit scope.

**Next action:**  
Start TASK-091 final review and commit.

## 2026-05-09 11:42 CEST — TASK-091 — IN_PROGRESS

**Task:**  
Final review and commit.

**PRD references:**  
PRD §16 Task 13, PRD §17

**Files changed:**  
Pending final review and commit.

**Commands run:**  
```bash
# pending
```

**Result:**  
Task started.

**Notes:**  
Do not include the unrelated `.gitignore` change in the commit.

**Next action:**  
Review diff, stage intended files, commit, and record hash.

## 2026-05-09 11:43 CEST — TASK-091 — DONE

**Task:**  
Final review and commit.

**PRD references:**  
PRD §16 Task 13, PRD §17

**Files changed:**  
All implementation files staged except the unrelated pre-existing `.gitignore` change.

**Commands run:**  
```bash
git status --short
git diff --stat
git diff -- index.html sitemap.xml scripts/build-static.mjs
git add index.html sitemap.xml assets/styles.css scripts/build-static.mjs scripts/scrape-ai-jobs.mjs ai-engineer-zurich-jobs/index.html field-notes leadership zurich-ai-market de .agent
git diff --cached --stat
git diff --cached --name-only
git commit -m "feat: expand site for production AI brand and recruiter appeal"
```

**Result:**  
Final review showed the intended implementation files staged. The unrelated `.gitignore` change remains unstaged. The commit command is run immediately after this entry is staged; the resulting hash is reported in the final response and can be verified with `git log -1 --oneline`.

**Notes:**  
Final acceptance checklist passed: homepage repositioning, field notes landing and four articles, leadership page, Zurich market page, jobs-page reframing, German landing page, sitemap/build updates, metadata audit, internal link audit, brand/safety audit, `npm test`, and `npm run build`.

**Next action:**  
Report completion and do not push.
