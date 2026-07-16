// Footer minimal (inspirado en la proporción de grid de Relume Footer 15, ajustado
// 1:1 al diseño de referencia): wordmark grande a la izquierda + 2 columnas de
// links a la derecha (Menú / Contacto). Sin bloque de dirección ni barra legal aparte.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { FOOTER, type FooterCopy } from '../constants/content';
import { LOGOS } from '../constants/assets';

function renderLinkColumn(title: string, links: { label: string; href: string }[]): HTMLElement {
  const column = el('div', 'aa-footer__column');
  const heading = el('span', 'aa-eyebrow');
  heading.textContent = title;
  const list = el('ul', 'aa-footer__list');
  links.forEach((link) => {
    const item = el('li');
    const a = el('a', 'aa-footer__link', { href: link.href });
    a.textContent = link.label;
    item.append(a);
    list.append(item);
  });
  column.append(heading, list);
  return column;
}

// copy opcional: permite reusar el mismo footer con contenido distinto.
export function renderFooter(root: HTMLElement, lang: Lang, copy?: FooterCopy): void {
  const t = copy ?? FOOTER[lang];

  const footer = el('footer', 'aa-footer', { 'data-aa-section-theme': 'dark' });
  const inner = el('div', 'aa-footer__inner');

  const logo = el('img', 'aa-footer__logo', { src: LOGOS.light, alt: 'Unidekor', loading: 'lazy' });

  const nav = el('div', 'aa-footer__nav');
  nav.append(
    renderLinkColumn(t.menuTitle, t.menu),
    renderLinkColumn(t.contactTitle, [...t.social, ...t.legal]),
  );

  inner.append(logo, nav);
  footer.append(inner);
  root.append(footer);
}
