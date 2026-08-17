// Entry point. Cada punto de montaje declara su configuración por atributos:
//   <div data-aa-mount data-aa-theme="light|dark" data-aa-lang="es|en"></div>
//   <script data-cfasync="false" src="https://<proyecto>.vercel.app/loader.js"></script>

import { type Theme, type Lang, type Page, PAGES } from './core/types';
import { renderPage } from './render';
import { initMotion } from './ui/motion';
import { initSplitText } from './ui/split-text';
import { initRevealGroup } from './ui/reveal-group';
import { watchLayoutShifts } from './ui/scroll-refresh';
import { initNavbar } from './ui/navbar';
import { initSectionThemeNav } from './ui/section-theme-nav';
import { initNavMobile } from './ui/nav-mobile';
import { initMountIntro } from './ui/loader';
import { initAccordion } from './ui/accordion';

// Scroll suave para anclas internas (#id) sin tocar CSS global del host.
function scrollToId(root: HTMLElement, id: string): boolean {
  if (!id) return false;
  const target = root.querySelector(`#${CSS.escape(id)}`);
  if (!target) return false;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function initAnchorScroll(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;
    if (scrollToId(root, id)) e.preventDefault();
  });
}

// El mount reemplaza el DOM después del hash nativo del navegador: sin esto, llegar
// a /nuevo-home/#contacto (u otra ancla) deja la página arriba.
function scrollToLocationHash(root: HTMLElement): void {
  scrollToId(root, window.location.hash.slice(1));
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

// La intro de mount corre SOLO en el primer mount de la sesión: sessionStorage → una vez
// por pestaña. En visitas repetidas a home dentro de la sesión el hero monta sin overlay.
// Si no está disponible (modo privado, etc.) se muestra por defecto.
function shouldPlayMountIntro(): boolean {
  try {
    if (sessionStorage.getItem('aa-mount-shown')) return false;
    sessionStorage.setItem('aa-mount-shown', '1');
    return true;
  } catch {
    return true;
  }
}

function boot(): void {
  const mounts = document.querySelectorAll<HTMLElement>('[data-aa-mount]');
  mounts.forEach((mount) => {
    const theme = resolveTheme(mount.dataset.aaTheme);
    const lang = resolveLang(mount.dataset.aaLang);
    const page = resolvePage(mount.dataset.aaPage);

    // Fase de render (src/render.ts): el mismo módulo que usa el prerender, así el DOM del
    // cliente y el del HTML estático no pueden divergir. La intro de mount solo aquí.
    // Con hash (p. ej. #contacto) no se reproduce la intro: el usuario ya pidió una ancla.
    const hash = window.location.hash.slice(1);
    const root = renderPage(
      page,
      lang,
      theme,
      page === 'home' && !hash && shouldPlayMountIntro(),
    );

    mount.replaceChildren(root);

    // Fase de init: enganches de comportamiento/animación una vez montado el DOM.
    // Mount intro: solo home. Sin overlay (visita repetida) hace no-op internamente.
    if (page === 'home') initMountIntro(root);
    initAnchorScroll(root);
    scrollToLocationHash(root);
    initNavbar(root);
    initSectionThemeNav(root);
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
