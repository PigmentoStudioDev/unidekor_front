// Trust/stats: barra de confianza con cifras reales/placeholder (ver comentario
// en premium-content.ts). Fondo oscuro sólido, sin imagen (evita depender de un
// asset más para un bloque que ya funciona bien en dark theme).
import type { Lang } from '../../core/types';
import { el } from '../../core/dom';
import { TRUST } from '../../constants/premium-content';

export function renderTrust(root: HTMLElement, lang: Lang): void {
  const t = TRUST[lang];

  const section = el('section', 'aa-trust', { 'data-aa-section-theme': 'dark' });
  const inner = el('div', 'aa-trust__inner');

  const heading = el('h2', 'aa-h-m');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');

  const stats = el('div', 'aa-trust__stats');
  stats.setAttribute('data-aa-stagger', '');
  t.stats.forEach((s) => {
    const item = el('div', 'aa-trust__stat');
    const value = el('span', 'aa-h-xxl aa-trust__value');
    value.textContent = s.value;
    const label = el('span', 'aa-p-m');
    label.textContent = s.label;
    item.append(value, label);
    stats.append(item);
  });

  inner.append(heading, stats);
  section.append(inner);
  root.append(section);
}
