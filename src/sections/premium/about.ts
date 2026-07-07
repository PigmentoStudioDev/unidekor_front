// Nosotros (port de estructura Relume Layout 1): imagen (izq) + texto con
// bullets y CTA (der). Resuelve el link muerto "Nosotros" del footer.
import type { Lang } from '../../core/types';
import { el } from '../../core/dom';
import { button } from '../../ui/button';
import { ABOUT } from '../../constants/premium-content';
import { IMAGES } from '../../constants/assets';

export function renderAbout(root: HTMLElement, lang: Lang): void {
  const t = ABOUT[lang];

  const section = el('section', 'aa-about', { 'data-aa-section-theme': 'light', id: 'nosotros' });
  const inner = el('div', 'aa-about__inner');

  const media = el('div', 'aa-about__media');
  media.setAttribute('data-aa-fade', '');
  media.style.backgroundImage = `url("${IMAGES.img3}")`;

  const content = el('div', 'aa-about__content');
  const eyebrow = el('span', 'aa-eyebrow');
  eyebrow.textContent = t.eyebrow;
  const heading = el('h2', 'aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');
  const desc = el('p', 'aa-p-m');
  desc.textContent = t.description;
  desc.setAttribute('data-aa-fade', '');
  desc.setAttribute('data-aa-delay', '0.1');

  const bullets = el('ul', 'aa-about__bullets');
  t.bullets.forEach((b) => {
    const item = el('li');
    item.textContent = b;
    bullets.append(item);
  });

  const cta = button('aa-btn aa-btn--ghost', t.cta, { href: '#ubicacion' });

  content.append(eyebrow, heading, desc, bullets, cta);
  inner.append(media, content);
  section.append(inner);
  root.append(section);
}
