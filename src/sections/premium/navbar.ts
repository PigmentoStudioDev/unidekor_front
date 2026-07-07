// Navbar fijo (premium): logo + menú + CTA. En mobile colapsa a un panel
// desplegable via hamburguesa. initNavbar() engancha el toggle y el estado
// "scrolled" (sombra al bajar) tras montar el DOM.
import type { Lang } from '../../core/types';
import { el, $ } from '../../core/dom';
import { button } from '../../ui/button';
import { NAVBAR } from '../../constants/premium-content';
import { LOGOS } from '../../constants/assets';
import { icon } from '../../ui/icons';

export function renderNavbar(root: HTMLElement, lang: Lang): void {
  const t = NAVBAR[lang];

  const nav = el('nav', 'aa-navbar', { 'data-aa-section-theme': 'light' });
  const inner = el('div', 'aa-navbar__inner');

  const logo = el('a', 'aa-navbar__logo', { href: '#inicio' });
  logo.append(el('img', undefined, { src: LOGOS.main, alt: 'Unidekor', loading: 'eager' }));

  // El CTA vive DENTRO del <ul> (último ítem) para colapsar junto con el menú en
  // mobile — si quedara fuera del panel, aparecería suelto en la barra al abrir.
  const menu = el('ul', 'aa-navbar__menu');
  t.menu.forEach((link) => {
    const item = el('li');
    const a = el('a', 'aa-navbar__link', { href: link.href });
    a.textContent = link.label;
    item.append(a);
    menu.append(item);
  });
  const ctaItem = el('li', 'aa-navbar__cta-item');
  const cta = button('aa-btn aa-navbar__cta', t.cta, { href: '#contacto' });
  ctaItem.append(cta);
  menu.append(ctaItem);

  const toggle = el('button', 'aa-navbar__toggle', { type: 'button', 'aria-label': 'Menú', 'aria-expanded': 'false' });
  toggle.innerHTML = icon('menu');

  inner.append(logo, menu, toggle);
  nav.append(inner);
  root.append(nav);
}

export function initNavbar(root: HTMLElement): void {
  const nav = $('.aa-navbar', root) as HTMLElement | null;
  const toggle = $('.aa-navbar__toggle', root) as HTMLButtonElement | null;
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-aa-open') === 'true';
    nav.setAttribute('data-aa-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.innerHTML = icon(isOpen ? 'menu' : 'close');
  });

  // Cierra el panel mobile al navegar a un anchor.
  nav.querySelectorAll('.aa-navbar__link, .aa-navbar__cta').forEach((link) => {
    link.addEventListener('click', () => {
      nav.setAttribute('data-aa-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = icon('menu');
    });
  });

  // Sombra al scrollear (deja de estar pegado al borde superior visualmente).
  const onScroll = () => {
    nav.setAttribute('data-aa-scrolled', String(window.scrollY > 8));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
