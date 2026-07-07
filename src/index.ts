// Entry point. Cada punto de montaje declara su configuración por atributos:
//   <div data-aa-mount data-aa-theme="light|dark" data-aa-lang="es|en"></div>
//   <script data-cfasync="false"
//     src="https://cdn.jsdelivr.net/gh/karenrebecag/unidekor@latest/loader.js"></script>
const _v = document.querySelector<HTMLScriptElement>('script[src*="unidekor@"]')?.src.match(/unidekor@([^/]+)/)?.[1] ?? 'dev';
console.log(`[unidekor] v${_v} loaded`);

import { type Theme, type Lang, type Page, PAGES } from './core/types';
import { initMotion } from './ui/motion';
import { initSplitText } from './ui/split-text';
import { initRevealGroup } from './ui/reveal-group';
import { watchLayoutShifts } from './ui/scroll-refresh';
import { renderNavbar } from './sections/navbar';
import { initNavbar } from './ui/navbar';
import { initNavMobile } from './ui/nav-mobile';
import { renderHero } from './sections/hero';
import { renderProducts } from './sections/products';
import { renderQuote } from './sections/quote';
import { renderFaq } from './sections/faq';
import { renderContact } from './sections/contact';
import { renderQuienesHeader, renderQuienesIntro, renderEspacios } from './sections/nosotros';
import { renderContacto } from './sections/contacto';
import { renderFooter } from './sections/footer';
import { initAccordion } from './ui/accordion';

// Scroll suave para anclas internas (#id) sin tocar CSS global del host.
function initAnchorScroll(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;
    const target = root.querySelector(`#${CSS.escape(id)}`);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function resolveTheme(raw: string | undefined): Theme {
  return raw === 'dark' ? 'dark' : 'light';
}

// El ?lang= de la URL tiene prioridad sobre el data-aa-lang del mount.
function resolveLang(raw: string | undefined): Lang {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const value = urlLang ?? raw;
  return value === 'en' ? 'en' : 'es';
}

// Página a renderizar. data-aa-page del mount (default 'home'); ?page= lo sobreescribe.
// Un valor fuera de PAGES cae a 'home' (nunca renderiza una ruta inexistente).
function resolvePage(raw: string | undefined): Page {
  const urlPage = new URLSearchParams(window.location.search).get('page');
  const value = urlPage ?? raw ?? 'home';
  return (PAGES as readonly string[]).includes(value) ? (value as Page) : 'home';
}

// Home: hero + productos + cotiza + FAQ + contacto/mapa.
function renderHome(root: HTMLElement, lang: Lang): void {
  renderHero(root, lang);
  renderProducts(root, lang);
  renderQuote(root, lang);
  renderFaq(root, lang);
  renderContact(root, lang);
}

// Nosotros ("¿Quiénes somos?"): header + intro + espacios.
function renderNosotros(root: HTMLElement, lang: Lang): void {
  renderQuienesHeader(root, lang);
  renderQuienesIntro(root, lang);
  renderEspacios(root, lang);
}

// Registro página → render. Agregar una página es una entrada más; TypeScript exige cubrir
// todas las claves de Page (exhaustividad).
const PAGE_RENDERERS: Record<Page, (root: HTMLElement, lang: Lang) => void> = {
  home: renderHome,
  nosotros: renderNosotros,
  contacto: renderContacto,
};

function boot(): void {
  const mounts = document.querySelectorAll<HTMLElement>('[data-aa-mount]');
  mounts.forEach((mount) => {
    const theme = resolveTheme(mount.dataset.aaTheme);
    const lang = resolveLang(mount.dataset.aaLang);
    const page = resolvePage(mount.dataset.aaPage);

    // Root wrapper — todo el CSS está scopeado a .aa-landing
    const root = document.createElement('div');
    root.className = 'aa-landing';
    root.setAttribute('data-aa-theme', theme);
    root.setAttribute('data-aa-lang', lang);

    // Fase de render: navbar y footer comunes; en medio, la página resuelta por el registro.
    renderNavbar(root, lang, page);
    PAGE_RENDERERS[page](root, lang);
    renderFooter(root, lang);

    mount.replaceChildren(root);

    // Fase de init: enganches de comportamiento/animación una vez montado el DOM.
    initAnchorScroll(root);
    initNavbar(root);
    initNavMobile(root);
    initSplitText(root);
    initRevealGroup(root);
    initMotion(root);
    initAccordion(root);
    watchLayoutShifts(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
