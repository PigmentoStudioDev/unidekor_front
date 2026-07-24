// Secciones de la página "¿Quiénes somos?": (1) header 15vh con bg + título abajo-izq,
// (2) intro (col vacía 30% + col 70% con lead y subfila imagen/historia), (3) espacios
// (heading + grid de 4 imágenes que se expanden en hover; 1:1 en touch/wrap).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { NOSOTROS_PAGE } from '../constants/content';
import { IMAGES } from '../constants/assets';

// Header: strip corta con imagen de fondo (cover) y el título anclado abajo-izquierda.
export function renderQuienesHeader(root: HTMLElement, lang: Lang): void {
  const t = NOSOTROS_PAGE[lang];
  const section = el('section', 'aa-quienes-hero', {
    // dark: el fondo es una foto de madera, así que los fg (título + navbar, vía
    // initSectionThemeNav) tienen que ir claros para leerse encima.
    'data-aa-section-theme': 'dark',
    id: 'quienes',
  });
  section.style.backgroundImage = `url("${IMAGES.quienesHero}")`;

  const inner = el('div', 'aa-quienes-hero__inner');
  const title = el('h1', 'aa-quienes-hero__title');
  title.textContent = t.headerTitle;
  title.setAttribute('data-aa-split', 'mount');
  inner.append(title);
  section.append(inner);
  root.append(section);
}

// Intro: fila [col vacía 30%] [col 70%]. La col principal lleva el lead (uppercase) y
// debajo una subfila: imagen (rotada, encajada al padre) + 3 párrafos en bold.
export function renderQuienesIntro(root: HTMLElement, lang: Lang): void {
  const t = NOSOTROS_PAGE[lang];
  const section = el('section', 'aa-quienes-intro', { 'data-aa-section-theme': 'light' });
  const inner = el('div', 'aa-quienes-intro__inner');

  const row = el('div', 'aa-quienes-intro__row', { 'data-reveal-group': 'mount' });
  const colEmpty = el('div', 'aa-quienes-intro__col-empty');
  const colMain = el('div', 'aa-quienes-intro__col-main');

  const lead = el('p', 'aa-quienes-intro__lead');
  lead.textContent = t.introLead;

  const subrow = el('div', 'aa-quienes-intro__subrow');

  // Subslot 1: imagen rotada a la derecha, recortada al contenedor (cuadrado → rotate 90°
  // cubre sin huecos).
  const media = el('div', 'aa-quienes-intro__media');
  media.append(
    el('img', 'aa-quienes-intro__img', {
      src: IMAGES.historia,
      alt: '',
      loading: 'lazy',
      decoding: 'async',
    }),
  );

  // Subslot 2: párrafos de historia (bold vía CSS).
  const historia = el('div', 'aa-quienes-intro__historia');
  t.historia.forEach((p) => {
    const para = el('p', 'aa-quienes-intro__para');
    para.textContent = p;
    historia.append(para);
  });

  subrow.append(media, historia);
  colMain.append(lead, subrow);
  row.append(colEmpty, colMain);
  inner.append(row);
  section.append(inner);
  root.append(section);
}

// Espacios: heading izquierda + grid de 4 imágenes. En desktop con hover se expanden/
// contraen (paneles flex); en touch/wrap pasan a cuadros 1:1.
export function renderEspacios(root: HTMLElement, lang: Lang): void {
  const t = NOSOTROS_PAGE[lang];
  const section = el('section', 'aa-espacios', { 'data-aa-section-theme': 'light' });
  const inner = el('div', 'aa-espacios__inner');

  const title = el('h2', 'aa-espacios__title');
  title.textContent = t.espaciosTitle;
  title.setAttribute('data-aa-split', 'mount');

  // Orden pedido: 1022, 1129, 1097, 1070.
  const imgs = [IMAGES.espacio1, IMAGES.espacio2, IMAGES.espacio3, IMAGES.espacio4];
  const grid = el('div', 'aa-espacios__grid', { 'data-reveal-group': 'mount' });
  imgs.forEach((src) => {
    const item = el('div', 'aa-espacios__item');
    item.append(
      el('img', 'aa-espacios__img', { src, alt: '', loading: 'lazy', decoding: 'async' }),
    );
    grid.append(item);
  });

  inner.append(title, grid);
  section.append(inner);
  root.append(section);
}
