// Hero premium: card con contenido sobre una imagen de fondo full-bleed (patrón
// Relume Header 88). padding-top compensa el navbar fijo.
import type { Lang } from '../../core/types';
import { el } from '../../core/dom';
import { button } from '../../ui/button';
import { HERO_PREMIUM } from '../../constants/premium-content';
import { IMAGES } from '../../constants/assets';

export function renderHero(root: HTMLElement, lang: Lang): void {
  const t = HERO_PREMIUM[lang];

  const section = el('section', 'aa-hero-p', { 'data-aa-section-theme': 'dark', id: 'inicio' });
  section.style.backgroundImage = `url("${IMAGES.heroInterior}")`;

  const inner = el('div', 'aa-hero-p__inner');
  const card = el('div', 'aa-hero-p__card');

  const eyebrow = el('span', 'aa-eyebrow');
  eyebrow.textContent = t.eyebrow;

  const title = el('h1', 'aa-h-xxl');
  title.textContent = t.title;
  title.setAttribute('data-aa-split', 'mount');

  const subtitle = el('p', 'aa-p-l');
  subtitle.textContent = t.subtitle;
  subtitle.setAttribute('data-aa-fade', '');
  subtitle.setAttribute('data-aa-delay', '0.1');

  const actions = el('div', 'aa-hero-p__actions');
  actions.setAttribute('data-aa-fade', '');
  actions.setAttribute('data-aa-delay', '0.2');
  const primary = button('aa-btn', t.ctaPrimary, { href: '#contacto' });
  const secondary = button('aa-btn aa-btn--ghost', t.ctaSecondary, { href: '#productos' });
  actions.append(primary, secondary);

  card.append(eyebrow, title, subtitle, actions);
  inner.append(card);
  section.append(inner);
  root.append(section);
}
