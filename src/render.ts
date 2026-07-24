// Fase de render, aislada del resto del boot: arma el DOM completo de una página sin tocar
// GSAP, sessionStorage ni ninguna API de navegador.
//
// Vive separada de index.ts para que el prerender (prerender.mjs) pueda importarla en Node:
// index.ts arrastra ui/gsap-env, que registra ScrollTrigger al importarse y necesita un
// navegador real. Aquí solo entran secciones, que son constructores de DOM puros.
//
// Las animaciones NO se ejecutan en prerender a propósito: los initX() aplican
// gsap.set(el, { autoAlpha: 0 }), que serializaría el contenido con opacity:0 y
// visibility:hidden. Contenido oculto es peor que ausente para un crawler.
import type { Lang, Page, Theme } from './core/types';
import { renderNavbar } from './sections/navbar';
import { renderHero } from './sections/hero';
import { renderMountIntro } from './sections/loader';
import { renderProducts } from './sections/products';
import { renderQuote } from './sections/quote';
import { renderFaq } from './sections/faq';
import { renderContact } from './sections/contact';
import { renderQuienesHeader, renderQuienesIntro, renderEspacios } from './sections/nosotros';
import { renderContacto } from './sections/contacto';
import { renderFooter } from './sections/footer';

// Reexportados para que prerender.mjs los obtenga del mismo bundle que renderPage, sin
// necesitar un segundo punto de entrada solo para los metadatos.
export { SEO, SITE_ORIGIN, BUSINESS } from './constants/seo';
// El FAQ alimenta el schema FAQPage desde la MISMA fuente que la sección visible, así no
// pueden divergir: Google descarta el schema que no corresponde al contenido de la página.
export { FAQ } from './constants/content';

// Home: intro de mount (solo en cliente y en el primer mount) + hero + productos + cotiza +
// FAQ + contacto.
function renderHome(root: HTMLElement, lang: Lang, mountIntro: boolean): void {
  renderMountIntro(root, mountIntro);
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
const PAGE_RENDERERS: Record<Page, (root: HTMLElement, lang: Lang, mountIntro: boolean) => void> = {
  home: renderHome,
  nosotros: renderNosotros,
  contacto: renderContacto,
};

// Construye el root `.aa-landing` con navbar + página + footer y lo devuelve SIN insertarlo,
// para que el llamador decida dónde va (boot lo monta en el div del host; el prerender lo
// serializa a HTML).
export function renderPage(
  page: Page,
  lang: Lang,
  theme: Theme,
  mountIntro = false,
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'aa-landing';
  root.setAttribute('data-aa-theme', theme);
  root.setAttribute('data-aa-lang', lang);

  renderNavbar(root, lang, page);
  PAGE_RENDERERS[page](root, lang, mountIntro);
  renderFooter(root, lang);

  return root;
}
