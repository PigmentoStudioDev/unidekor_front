// Contacto + mapa (port de Relume Contact 14): grid .5fr/1fr — 3 bloques de contacto
// (izq) + mapa embebido de Google Maps (der, ubicación real de Pisos UNIDEKOR).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { CONTACT } from '../constants/content';
import { icon } from '../ui/icons';

export function renderContact(root: HTMLElement, lang: Lang): void {
  const t = CONTACT[lang];

  const section = el('section', 'aa-contact', {
    'data-aa-section-theme': 'light',
    id: 'ubicacion',
  });
  const inner = el('div', 'aa-contact__inner');

  const intro = el('div', 'aa-contact__intro');
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

  const grid = el('div', 'aa-contact__grid');

  const list = el('div', 'aa-contact__list');
  list.setAttribute('data-aa-stagger', '');
  t.items.forEach((item) => {
    const block = el('div', 'aa-contact-item');
    const iconEl = el('div', 'aa-contact-item__icon');
    iconEl.innerHTML = icon(item.icon);
    const title = el('h3', 'aa-h-m');
    title.textContent = item.title;
    const description = el('p', 'aa-p-m');
    description.textContent = item.description;
    const link = el('a', 'aa-contact-item__link', { href: item.linkHref });
    link.textContent = item.linkLabel;
    block.append(iconEl, title, description, link);
    list.append(block);
  });

  // Mapa: embed real de Google Maps (ubicación de Pisos UNIDEKOR).
  const map = el('div', 'aa-contact__map');
  map.setAttribute('data-aa-fade', '');
  map.setAttribute('data-aa-delay', '0.2');
  const mapFrame = el('iframe', 'aa-contact__map-frame', {
    src: t.mapEmbedSrc,
    loading: 'lazy',
    referrerpolicy: 'strict-origin-when-cross-origin',
    allowfullscreen: '',
    title: 'Ubicación de Pisos UNIDEKOR',
  });
  const mapCaption = el('a', 'aa-contact__map-caption', { href: t.mapHref, target: '_blank', rel: 'noopener' });
  mapCaption.textContent = t.mapCaption;
  map.append(mapFrame, mapCaption);

  grid.append(list, map);
  inner.append(intro, grid);
  section.append(inner);
  root.append(section);
}
