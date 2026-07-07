// Acordeón tipo "multiple": cada item se abre/cierra independiente (no exclusivo).
// El alto se anima con grid-template-rows 0fr↔1fr (ver accordion en faq.css), así
// no hace falta medir scrollHeight ni tocar GSAP para el collapse.
import { $$ } from '../core/dom';

export function initAccordion(root: HTMLElement): void {
  $$('[data-aa-accordion-item]', root).forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-aa-accordion-trigger]');
    trigger?.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-aa-open') === 'true';
      item.setAttribute('data-aa-open', String(!isOpen));
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}
