// Products premium (port de estructura Relume Layout 618): intro arriba, luego
// grid de items con imagen+heading+descripción (a diferencia del Products original,
// que es texto puro) — usa las 4 imágenes de muestra reales (table1-4).
import type { Lang } from '../../core/types';
import { el } from '../../core/dom';
import { button } from '../../ui/button';
import { PRODUCTS_PREMIUM } from '../../constants/premium-content';

export function renderProducts(root: HTMLElement, lang: Lang): void {
  const t = PRODUCTS_PREMIUM[lang];

  const section = el('section', 'aa-products-p', { 'data-aa-section-theme': 'light', id: 'productos' });
  const inner = el('div', 'aa-products-p__inner');

  const intro = el('div', 'aa-products-p__intro');
  const eyebrow = el('span', 'aa-eyebrow');
  eyebrow.textContent = t.eyebrow;
  const heading = el('h2', 'aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');
  const desc = el('p', 'aa-p-m');
  desc.textContent = t.description;
  desc.setAttribute('data-aa-fade', '');
  desc.setAttribute('data-aa-delay', '0.1');
  intro.append(eyebrow, heading, desc);

  const grid = el('div', 'aa-products-p__grid');
  grid.setAttribute('data-aa-stagger', '');
  t.items.forEach((item) => {
    const card = el('article', 'aa-product-card');
    const media = el('div', 'aa-product-card__media');
    media.style.backgroundImage = `url("${item.image}")`;
    const title = el('h3', 'aa-h-m');
    title.textContent = item.title;
    const description = el('p', 'aa-p-m');
    description.textContent = item.description;
    card.append(media, title, description);
    grid.append(card);
  });

  const actions = el('div', 'aa-products-p__actions');
  const primary = button('aa-btn', t.ctaPrimary, { href: '#contacto' });
  const secondary = button('aa-btn aa-btn--ghost', t.ctaSecondary, { href: '#nosotros' });
  actions.append(primary, secondary);

  inner.append(intro, grid, actions);
  section.append(inner);
  root.append(section);
}
