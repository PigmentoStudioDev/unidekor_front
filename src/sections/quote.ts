// Strip de cotización (theme dark, port de estructura Relume Contact 7): bg image
// de la strip completa detrás; encima, dos bloques con el MISMO peso visual —
// panel sólido para el form (con label+input, no solo placeholder) y la imagen de
// producto llenando su columna — en vez del form flotando transparente sobre la foto.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { QUOTE } from '../constants/content';
import { IMAGES } from '../constants/assets';
import { renderQuoteForm } from './quote-form';

export function renderQuote(root: HTMLElement, lang: Lang): void {
  const t = QUOTE[lang];

  const section = el('section', 'aa-quote', {
    'data-aa-section-theme': 'dark',
    id: 'contacto',
  });
  // Fondo de la strip como capa <img> (no background-image) para poder rotarlo 90°.
  const bg = el('img', 'aa-quote__bg', {
    src: IMAGES.contactBg,
    alt: '',
    'aria-hidden': 'true',
    loading: 'lazy',
    decoding: 'async',
  });
  section.append(bg);

  const inner = el('div', 'aa-quote__inner');

  // Columna izquierda: panel sólido (no transparente) — separa el form de la bg
  // image para que el texto sea legible sin depender de qué haya detrás.
  // Sin backend aún: se evita el submit real.
  const panel = el('div', 'aa-quote__panel');
  const form = renderQuoteForm(lang);

  // El heading/intro son propios de esta strip → se anteponen al form compartido.
  const heading = el('h2', 'aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');

  const sub = el('p', 'aa-p-m');
  sub.textContent = t.subheading;
  sub.setAttribute('data-aa-fade', '');
  sub.setAttribute('data-aa-delay', '0.1');

  form.prepend(sub);
  form.prepend(heading);
  panel.append(form);

  // Columna derecha: imagen de producto 1:1 (ver quote.css).
  const media = el('div', 'aa-quote__media');
  media.style.backgroundImage = `url("${IMAGES.contactSquare}")`;
  media.setAttribute('data-aa-fade', '');
  media.setAttribute('data-aa-delay', '0.1');

  inner.append(panel, media);
  section.append(inner);
  root.append(section);
}
