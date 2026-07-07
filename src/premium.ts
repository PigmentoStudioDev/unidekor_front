// Entry de la página premium (preview-premium.html). Mismo Mount Point Pattern
// que src/index.ts, distinta composición de secciones — build separado
// (dist/premium.js + dist/premium.css) para no tocar el sitio original.
import { type Theme, type Lang } from './core/types';
import { initMotion } from './ui/motion';
import { initSplitText } from './ui/split-text';
import { initRevealGroup } from './ui/reveal-group';
import { watchLayoutShifts } from './ui/scroll-refresh';
import { renderNavbar, initNavbar } from './sections/premium/navbar';
import { renderHero } from './sections/premium/hero';
import { renderTrust } from './sections/premium/trust';
import { renderProducts } from './sections/premium/products';
import { renderAbout } from './sections/premium/about';
import { renderFaq } from './sections/faq';
import { renderQuote } from './sections/quote';
import { renderContact } from './sections/contact';
import { renderFooter } from './sections/footer';
import { initAccordion } from './ui/accordion';
import { FOOTER_PREMIUM } from './constants/premium-content';

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

function resolveLang(raw: string | undefined): Lang {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const value = urlLang ?? raw;
  return value === 'en' ? 'en' : 'es';
}

function boot(): void {
  const mounts = document.querySelectorAll<HTMLElement>('[data-aa-mount]');
  mounts.forEach((mount) => {
    const theme = resolveTheme(mount.dataset.aaTheme);
    const lang = resolveLang(mount.dataset.aaLang);

    const root = document.createElement('div');
    root.className = 'aa-landing';
    root.setAttribute('data-aa-theme', theme);
    root.setAttribute('data-aa-lang', lang);

    // Orden: Nav → Hero → Confianza → Productos(imagen) → Nosotros →
    // FAQ → Cotiza → Contacto/mapa → Footer.
    renderNavbar(root, lang);
    renderHero(root, lang);
    renderTrust(root, lang);
    renderProducts(root, lang);
    renderAbout(root, lang);
    renderFaq(root, lang);
    renderQuote(root, lang);
    renderContact(root, lang);
    renderFooter(root, lang, FOOTER_PREMIUM[lang]);

    mount.replaceChildren(root);

    initAnchorScroll(root);
    initSplitText(root);
    initRevealGroup(root);
    initMotion(root);
    initAccordion(root);
    initNavbar(root);
    watchLayoutShifts(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
