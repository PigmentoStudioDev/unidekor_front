// Página de contacto: layout light de 3 columnas.
//   Col 1 — heading "CONTACTO" + intro + form (reusa renderQuoteForm).
//   Col 2 — canales (WhatsApp/redes) + dirección + iframe de mapa.
//   Col 3 — imagen bg cover alineada a la derecha.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { CONTACTO_PAGE, CONTACT } from '../constants/content';
import { IMAGES } from '../constants/assets';
import { renderQuoteForm } from './quote-form';

export function renderContacto(root: HTMLElement, lang: Lang): void {
  const t = CONTACTO_PAGE[lang];

  const section = el('section', 'aa-contacto', {
    'data-aa-section-theme': 'light',
    id: 'contacto',
  });
  const inner = el('div', 'aa-contacto__inner');

  // ─── Col 1: form ──────────────────────────────────────────────────────────────
  const colForm = el('div', 'aa-contacto__col aa-contacto__col--form', { 'data-reveal-group': 'mount' });
  const heading = el('h1', 'aa-contacto__heading');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', 'mount');
  const intro = el('p', 'aa-contacto__intro');
  intro.textContent = t.intro;
  colForm.append(heading, intro, renderQuoteForm(lang));

  // ─── Col 2: canales + dirección + mapa ────────────────────────────────────────
  const colInfo = el('div', 'aa-contacto__col aa-contacto__col--info', { 'data-reveal-group': 'mount' });
  const channels = el('ul', 'aa-contacto__channels');
  t.channels.forEach((c) => {
    const li = el('li');
    const a = el('a', 'aa-contacto__channel', { href: c.href, 'data-underline-link': '' });
    a.textContent = c.label;
    li.append(a);
    channels.append(li);
  });

  const address = el('div', 'aa-contacto__address');
  const addrLabel = el('span', 'aa-contacto__address-label');
  addrLabel.textContent = t.addressLabel;
  const addrText = el('p', 'aa-contacto__address-text');
  addrText.textContent = t.address;
  address.append(addrLabel, addrText);

  const mapWrap = el('div', 'aa-contacto__map');
  mapWrap.append(
    el('iframe', 'aa-contacto__map-frame', {
      src: CONTACT[lang].mapEmbedSrc,
      loading: 'lazy',
      referrerpolicy: 'no-referrer-when-downgrade',
      title: t.address,
      allowfullscreen: '',
    }),
  );

  colInfo.append(channels, address, mapWrap);

  // ─── Col 3: imagen ────────────────────────────────────────────────────────────
  const colMedia = el('div', 'aa-contacto__col aa-contacto__col--media');
  colMedia.style.backgroundImage = `url("${IMAGES.contactoMedia}")`;

  inner.append(colForm, colInfo, colMedia);
  section.append(inner);
  root.append(section);
}
