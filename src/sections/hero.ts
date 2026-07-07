// Hero de 3 columnas. Los asides (extremos) crecen para llenar el espacio; la columna
// central (main) está capada a 800px y contiene una sub-maquetación en grid:
// heading (sin subheading) → row de CTAs → row de dos containers al 50%.
// En mobile los asides se ocultan (ver hero.css).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { button } from '../ui/button';
import { HERO } from '../constants/content';
import { IMAGES } from '../constants/assets';

export function renderHero(root: HTMLElement, lang: Lang): void {
  const t = HERO[lang];

  const section = el('section', 'aa-hero', {
    'data-aa-section-theme': 'dark',
    id: 'inicio',
  });

  const inner = el('div', 'aa-hero__inner');
  // 4 slots de imagen izquierda→derecha: aside izq, los dos blocks del split, aside der.
  // Las keys ya vienen URL-encoded desde assets.
  const asideLeft = el('div', 'aa-hero__aside');
  const asideRight = el('div', 'aa-hero__aside');
  asideLeft.style.backgroundImage = `url("${IMAGES.heroD}")`;
  asideRight.style.backgroundImage = `url("${IMAGES.heroA}")`;

  // Columna central capada a 800px, partida en dos mitades (50%/50%).
  const main = el('div', 'aa-hero__main');

  // Mitad superior (50%): heading + ctas.
  const top = el('div', 'aa-hero__top');

  // Container de heading (sin subheading).
  const headingBox = el('div', 'aa-hero__heading');
  const title = el('h1', 'aa-h-xxl');
  title.textContent = t.title;
  title.setAttribute('data-aa-split', 'mount');
  headingBox.append(title);

  // Wrapper row de CTAs (primario + secundario) debajo del heading.
  const ctas = el('div', 'aa-hero__ctas');
  ctas.setAttribute('data-aa-fade', '');
  ctas.setAttribute('data-aa-delay', '0.1');
  const ctaPrimary = button('aa-btn', t.ctaPrimary, { href: '#inicio' });
  const ctaSecondary = button('aa-btn aa-btn--ghost', t.ctaSecondary, { href: '#inicio' });
  ctas.append(ctaPrimary, ctaSecondary);

  // Mitad inferior (50%): dos containers al 50% en row.
  const split = el('div', 'aa-hero__split');
  split.setAttribute('data-aa-fade', '');
  split.setAttribute('data-aa-delay', '0.2');
  const block1 = el('div', 'aa-hero__block');
  const block2 = el('div', 'aa-hero__block');
  block1.style.backgroundImage = `url("${IMAGES.heroB}")`;
  block2.style.backgroundImage = `url("${IMAGES.heroC}")`;
  split.append(block1, block2);

  top.append(headingBox, ctas);
  main.append(top, split);
  inner.append(asideLeft, main, asideRight);
  section.append(inner);
  root.append(section);
}
