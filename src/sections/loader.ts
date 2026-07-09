// Mount intro (marca → flood → reveal) del primer mount de home. Markup del overlay;
// la timeline vive en src/ui/loader.ts (initMountIntro). El wordmark emerge como
// tarjeta, hace wobble, el color de marca inunda desde el centro y el panel se retira.
import { el } from '../core/dom';
import { LOGOS } from '../constants/assets';

// showOverlay: gateado por sessionStorage en index.ts (una vez por pestaña). El hero se
// renderiza SIEMPRE — el overlay solo lo cubre durante la intro, no es su fuente.
export function renderMountIntro(root: HTMLElement, showOverlay: boolean): void {
  if (!showOverlay) return;

  // container conserva data-aa-mount/is--active: el scroll-lock (mount-intro.css) y el
  // finish() de initMountIntro dependen de ellos.
  const container = el('div', 'aa-mount is--active', { 'data-aa-mount': '' });

  // cover: panel clay full-bleed que inunda desde el centro y luego se retira (reveal).
  const cover = el('div', 'aa-mount__cover', { 'data-aa-mount-cover': '' });

  // card: tarjeta portrait que emerge con el mark y hace el wobble antes del flood.
  const card = el('div', 'aa-mount__card', { 'data-aa-mount-card': '' });
  const mark = el('div', 'aa-mount__mark');
  mark.append(
    el('img', 'aa-mount__mark-img', {
      // LOGOS.light ya es el wordmark blanco → legible sobre el panel clay sin filtro.
      src: LOGOS.light,
      alt: 'unidekor',
      loading: 'eager',
      decoding: 'async',
      fetchpriority: 'high',
    }),
  );
  card.append(mark);

  container.append(cover, card);
  root.append(container);
}
