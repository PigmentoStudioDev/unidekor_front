// Visibilidad del navbar fijo — idempotente y jerárquica:
//   1. En el top (y <= TOP_THRESHOLD) → SIEMPRE visible.
//   2. Fuera del top, con gesto de scroll → down oculta / up muestra.
//   3. En el mount (sin gesto) → oculto si no estás en el top (no forzamos mostrar).
// classList.toggle(cls, bool) es idempotente: mount y scroll convergen sin pelearse.
import { $ } from '../core/dom';

const TOP_THRESHOLD = 0;

export function initNavbar(root: HTMLElement): void {
  const nav = $<HTMLElement>('.aa-nav', root);
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const setHidden = (hidden: boolean): void => {
    nav.classList.toggle('is--hidden', hidden);
  };

  // Fondo sólido solo fuera del top: transparente en y=0, opaco al scrollear.
  const setScrolled = (scrolled: boolean): void => {
    nav.classList.toggle('is--scrolled', scrolled);
  };

  // Regla 1 + 2: el top gana sobre la dirección de scroll.
  const onScroll = (): void => {
    const y = window.scrollY;
    setScrolled(y > TOP_THRESHOLD);
    if (y <= TOP_THRESHOLD) setHidden(false);
    else if (y > lastY) setHidden(true);
    else if (y < lastY) setHidden(false);
    lastY = y;
    ticking = false;
  };

  // Regla 1 + 3: en mount solo se muestra si estás en el top; scrolleado queda oculto.
  const applyMountState = (): void => {
    lastY = window.scrollY;
    setScrolled(window.scrollY > TOP_THRESHOLD);
    setHidden(window.scrollY > TOP_THRESHOLD);
  };

  // Sin loader (landing directo): doble rAF para pintar el estado oculto antes de la transition.
  requestAnimationFrame(() => requestAnimationFrame(applyMountState));

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
}
