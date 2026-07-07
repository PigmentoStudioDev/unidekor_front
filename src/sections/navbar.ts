// Navbar global (maquetación portada de ZEGM): logo izquierda + navlinks a la derecha,
// SIN CTA. En <992px los links se ocultan y aparece el burger → overlay mobile
// (initNavMobile). initNavbar controla el auto-hide en scroll.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { NAV, navHref } from '../constants/content';
import { LOGOS } from '../constants/assets';

export function renderNavbar(root: HTMLElement, lang: Lang, page: string): void {
  const nav = el('nav', 'aa-nav', { 'data-aa-section-theme': 'light' });

  // El logo lleva al home del sitio (raíz). En prod se mapea a la home real del host.
  const logo = el('a', 'aa-nav__logo', { href: '/', 'aria-label': 'Unidekor · Inicio' });
  logo.append(el('img', 'aa-nav__logo-img', { src: LOGOS.light, alt: 'Unidekor', loading: 'eager' }));

  const items = NAV[lang];

  // Links desktop (ocultos <992px). Sin CTA: todos son navlinks con subrayado animado.
  const links = el('div', 'aa-nav__links');
  items.forEach((item) => {
    const a = el('a', 'aa-nav__link', { href: navHref(item, page), 'data-underline-link': '' });
    a.textContent = item.label;
    links.append(a);
  });

  // Burger (solo <992px).
  const burger = el('button', 'aa-nav__burger', {
    type: 'button',
    'aria-label': 'Abrir menú',
    'aria-expanded': 'false',
    'aria-controls': 'aa-nav-mobile',
    'data-aa-nav-burger': '',
  });
  (['top', 'mid', 'bot'] as const).forEach((pos) =>
    burger.append(el('span', 'aa-nav__burger-line', { 'data-line': pos })),
  );

  // Overlay mobile (bajo la barra) con los mismos items apilados.
  const menu = el('div', 'aa-nav__mobile', { id: 'aa-nav-mobile', 'data-aa-nav-mobile': '' });
  const menuList = el('div', 'aa-nav__mobile-list');
  items.forEach((item) => {
    const a = el('a', 'aa-nav__mobile-link', { href: navHref(item, page), 'data-aa-nav-item': '' });
    a.textContent = item.label;
    menuList.append(a);
  });
  menu.append(menuList);

  nav.append(logo, links, burger);
  root.append(nav, menu);
}
