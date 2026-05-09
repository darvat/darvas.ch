import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function createClassList() {
  const classes = new Set();

  return {
    contains(name) {
      return classes.has(name);
    },
    toggle(name, force) {
      const shouldAdd = force ?? !classes.has(name);
      if (shouldAdd) {
        classes.add(name);
      } else {
        classes.delete(name);
      }
      return shouldAdd;
    },
    remove(name) {
      classes.delete(name);
    },
  };
}

function createNavigationHarness({ language, openLabel }) {
  let toggleHandler;

  const navToggle = {
    dataset: {},
    attributes: new Map([
      ['aria-expanded', 'false'],
      ['aria-label', openLabel],
    ]),
    classList: createClassList(),
    addEventListener(type, handler) {
      if (type === 'click') {
        toggleHandler = handler;
      }
    },
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    },
    setAttribute(name, value) {
      this.attributes.set(name, String(value));
    },
  };
  const siteNav = { classList: createClassList() };
  const body = { classList: createClassList(), append() {} };

  const document = {
    body,
    documentElement: { lang: language },
    addEventListener() {},
    createElement() {
      return {};
    },
    getElementById() {
      return null;
    },
    querySelector(selector) {
      if (selector === '.nav-toggle') return navToggle;
      if (selector === '.site-nav') return siteNav;
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };

  const script = `${fs.readFileSync('assets/main.js', 'utf8')}\nApp.init();`;
  vm.runInNewContext(script, {
    document,
    window: { innerWidth: 375, addEventListener() {} },
    IntersectionObserver: class {
      observe() {}
    },
    atob(value) {
      return Buffer.from(value, 'base64').toString('binary');
    },
    setTimeout,
  });

  assert.equal(typeof toggleHandler, 'function');

  return {
    navToggle,
    clickToggle() {
      toggleHandler();
    },
  };
}

test('mobile nav keeps German aria labels after toggling', () => {
  const nav = createNavigationHarness({
    language: 'de-CH',
    openLabel: 'Navigation öffnen',
  });

  nav.clickToggle();
  assert.equal(nav.navToggle.getAttribute('aria-expanded'), 'true');
  assert.equal(nav.navToggle.getAttribute('aria-label'), 'Navigation schliessen');

  nav.clickToggle();
  assert.equal(nav.navToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(nav.navToggle.getAttribute('aria-label'), 'Navigation öffnen');
});
