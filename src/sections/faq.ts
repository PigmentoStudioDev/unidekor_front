// FAQ (port de Relume FAQ 3): grid de 2 columnas — heading+subheading+cta (izq,
// .75fr) y acordeón "multiple" (der, 1fr). En wrap colapsa a una sola columna.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { button } from '../ui/button';
import { FAQ } from '../constants/content';

export function renderFaq(root: HTMLElement, lang: Lang): void {
  const t = FAQ[lang];

  const section = el('section', 'aa-faq', {
    'data-aa-section-theme': 'light',
    id: 'faq',
  });
  const inner = el('div', 'aa-faq__inner');

  // Columna izquierda: heading + subheading + cta.
  const intro = el('div', 'aa-faq__intro');

  const heading = el('h2', 'aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');

  const sub = el('p', 'aa-p-m');
  sub.textContent = t.subheading;
  sub.setAttribute('data-aa-fade', '');
  sub.setAttribute('data-aa-delay', '0.1');

  const cta = button('aa-btn aa-btn--ghost', t.cta, { href: '#contacto' });
  cta.setAttribute('data-aa-fade', '');
  cta.setAttribute('data-aa-delay', '0.2');

  intro.append(heading, sub, cta);

  // Columna derecha: acordeón (varias preguntas abiertas a la vez).
  const accordion = el('div', 'aa-faq__accordion');
  accordion.setAttribute('data-aa-stagger', '');
  t.items.forEach((item) => {
    const faqItem = el('div', 'aa-faq-item', { 'data-aa-accordion-item': '', 'data-aa-open': 'false' });

    const trigger = el('button', 'aa-faq-item__trigger', {
      type: 'button',
      'data-aa-accordion-trigger': '',
      'aria-expanded': 'false',
    });
    const question = el('span', 'aa-h-m');
    question.textContent = item.question;
    const icon = el('span', 'aa-faq-item__icon');
    icon.textContent = '+';
    trigger.append(question, icon);

    // Tres capas (patrón OSMO 0fr↔1fr): content (grid animado) > wrap (height:100000%,
    // fuerza el colapso real en todos los navegadores) > inner (padding).
    const content = el('div', 'aa-faq-item__content');
    const wrap = el('div', 'aa-faq-item__content-wrap');
    const contentInner = el('div', 'aa-faq-item__content-inner');
    const answer = el('p', 'aa-p-m');
    answer.textContent = item.answer;
    contentInner.append(answer);
    wrap.append(contentInner);
    content.append(wrap);

    faqItem.append(trigger, content);
    accordion.append(faqItem);
  });

  inner.append(intro, accordion);
  section.append(inner);
  root.append(section);
}
