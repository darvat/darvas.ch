const FIELD_NOTES_LINKS = [
  { href: '/field-notes/', label: 'Overview' },
  { href: '/field-notes/production-rag/', label: 'Production RAG' },
  { href: '/field-notes/agentic-ai-enterprise/', label: 'Agentic AI' },
  { href: '/field-notes/llm-evaluation/', label: 'LLM Evaluation' },
  { href: '/field-notes/ai-platform-architecture/', label: 'AI Platform Architecture' },
];

const LEADERSHIP_LINKS = [
  { href: '/leadership/', label: 'How I Lead Teams' },
  { href: '/leadership/#leadership-thesis', label: 'Leadership Thesis' },
  { href: '/leadership/#leverage-title', label: 'How I Create Leverage' },
  { href: '/leadership/#not-optimise-title', label: 'What I Do Not Optimise For' },
];

const SITE_HEADER_REGION = /^([ \t]*)<!--\s*site-header:\s*(\{.*\})\s*-->[\s\S]*?([ \t]*)<main\b/gm;

function attrs(values) {
  return values.filter(Boolean).join(' ');
}

function activeClass(active, key) {
  return active === key ? ' class="active"' : '';
}

function renderSubmenu({ label, links, depth }) {
  const itemIndent = ' '.repeat(depth + 4);
  return [
    `${' '.repeat(depth)}<div class="nav-submenu" aria-label="${label} submenu">`,
    ...links.map((link) => `${itemIndent}<a href="${link.href}">${link.label}</a>`),
    `${' '.repeat(depth)}</div>`,
  ];
}

function renderNavItem({ key, href, label, submenuLinks, active, depth }) {
  const indent = ' '.repeat(depth);
  const linkIndent = ' '.repeat(depth + 4);
  return [
    `${indent}<div class="nav-item has-submenu">`,
    `${linkIndent}<a${activeClass(active, key)} href="${href}" aria-haspopup="true">${label}</a>`,
    ...renderSubmenu({ label, links: submenuLinks, depth: depth + 4 }),
    `${indent}</div>`,
  ];
}

function renderTopLink({ key, href, label, active, depth }) {
  return `${' '.repeat(depth)}<a${activeClass(active, key)} href="${href}">${label}</a>`;
}

function renderNavLinks({ variant, active, depth }) {
  const lines = [];

  if (variant === 'de') {
    lines.push(renderTopLink({ href: '/', label: 'English', active, depth }));
  } else {
    lines.push(renderTopLink({ key: 'profile', href: '/#profile', label: 'Profile', active, depth }));
    lines.push(renderTopLink({ key: 'experience', href: '/#experience', label: 'Experience', active, depth }));
  }

  lines.push(...renderNavItem({
    key: 'field-notes',
    href: '/field-notes/',
    label: 'Field Notes',
    submenuLinks: FIELD_NOTES_LINKS,
    active,
    depth,
  }));
  lines.push(...renderNavItem({
    key: 'leadership',
    href: '/leadership/',
    label: 'Leadership',
    submenuLinks: LEADERSHIP_LINKS,
    active,
    depth,
  }));
  lines.push(renderTopLink({
    key: 'zurich-ai-market',
    href: '/zurich-ai-market/',
    label: 'Zurich AI Market',
    active,
    depth,
  }));
  lines.push(renderTopLink({
    key: 'contact',
    href: '/#contact',
    label: variant === 'de' ? 'Kontakt' : 'Contact',
    active,
    depth,
  }));

  return lines;
}

export function renderSiteHeader({
  active = '',
  indent = '',
  reveal = false,
  variant = 'default',
} = {}) {
  const labels = variant === 'de'
    ? {
        brand: 'Tamas Darvas Startseite',
        open: 'Navigation öffnen',
        nav: 'Hauptnavigation',
      }
    : {
        brand: 'Tamas Darvas home',
        open: 'Open navigation',
        nav: 'Primary navigation',
      };

  const headerAttributes = attrs([
    'class="site-header"',
    reveal ? 'data-reveal' : '',
  ]);

  const lines = [
    `<header ${headerAttributes}>`,
    `    <a class="brand-mark" href="/" aria-label="${labels.brand}"><span>TD</span></a>`,
    `    <button class="nav-toggle" type="button" aria-label="${labels.open}" aria-expanded="false" aria-controls="site-navigation">`,
    `        <span></span>`,
    `        <span></span>`,
    `        <span></span>`,
    `    </button>`,
    `    <nav class="site-nav" id="site-navigation" aria-label="${labels.nav}">`,
    ...renderNavLinks({ variant, active, depth: 8 }),
    `    </nav>`,
    `</header>`,
  ];

  return lines.map((line) => `${indent}${line}`).join('\n');
}

export function renderSiteHeaderBlock(config = {}) {
  const indent = config.indent ?? '';
  const headerConfig = { ...config };
  delete headerConfig.indent;

  return `${[
    `${indent}<!-- site-header: ${JSON.stringify(headerConfig)} -->`,
    renderSiteHeader({ ...headerConfig, indent }),
    `${indent}<!-- /site-header -->`,
  ].join('\n')}\n`;
}

export function replaceSiteHeaderRegions(html, sourcePath = 'HTML input') {
  return html.replace(SITE_HEADER_REGION, (_match, indent, rawConfig, mainIndent) => {
    try {
      return `${renderSiteHeaderBlock({ ...JSON.parse(rawConfig), indent })}${mainIndent || indent}<main`;
    } catch (error) {
      throw new Error(`Invalid site-header marker in ${sourcePath}: ${error.message}`);
    }
  });
}
