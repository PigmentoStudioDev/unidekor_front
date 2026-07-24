// Strip de productos: dos columnas (40% intro claro + 60% lista de service cards
// sobre superficie highlight). La lista remapea tokens a claro-sobre-superficie
// (ver products.css). initMotion engancha los data-aa-fade / data-aa-stagger.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { button } from '../ui/button';
import { PRODUCTS } from '../constants/content';
import { DOCS } from '../constants/assets';

export function renderProducts(root: HTMLElement, lang: Lang): void {
  const t = PRODUCTS[lang];

  const section = el('section', 'aa-products', {
    'data-aa-section-theme': 'light',
    id: 'productos',
  });
  const inner = el('div', 'aa-products__inner');

  // Columna izquierda (40%): intro.
  const intro = el('div', 'aa-products__intro');

  const heading = el('h2', 'aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');

  const sub = el('p', 'aa-p-m');
  sub.textContent = t.subheading;
  sub.setAttribute('data-aa-fade', '');
  sub.setAttribute('data-aa-delay', '0.1');

  const actions = el('div', 'aa-products__actions');
  actions.setAttribute('data-aa-fade', '');
  actions.setAttribute('data-aa-delay', '0.2');
  // Orden fiel al mockup: primary (Descargar catálogo) arriba, secondary (Cotiza ahora)
  // abajo — roles invertidos respecto al hero (ahí Cotiza es el primary).
  const download = button('aa-btn', t.ctaSecondary, {
    href: DOCS.presentation,
    download: '',
    target: '_blank',
    rel: 'noopener',
  });
  const quote = button('aa-btn aa-btn--ghost', t.ctaPrimary, { href: '#contacto' });
  actions.append(download, quote);

  intro.append(heading, sub, actions);

  // Columna derecha (60%): lista de service cards, full width, apiladas.
  const list = el('div', 'aa-products__list');
  list.setAttribute('data-aa-stagger', '');
  t.services.forEach((s) => {
    const card = el('article', 'aa-service-card');

    const title = el('h3', 'aa-h-m');
    title.textContent = s.title;

    const desc = el('p', 'aa-p-m');
    desc.textContent = s.description;

    card.append(title, desc);
    list.append(card);
  });

  inner.append(intro, list);
  section.append(inner);
  root.append(section);
}
