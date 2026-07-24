// Visibilidad del navbar fijo — idempotente y jerárquica:
//   1. En el top (y <= TOP_THRESHOLD) → SIEMPRE visible.
//   2. Fuera del top, con gesto de scroll → down oculta / up muestra.
//   3. En el mount (sin gesto) → oculto si no estás en el top (no forzamos mostrar).
// classList.toggle(cls, bool) es idempotente: mount y scroll convergen sin pelearse.
// El tema (color de texto/logo) NO se maneja aquí: lo resuelve initSectionThemeNav
// (ui/section-theme-nav.ts) leyendo la sección que queda detrás de la barra.
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

  // Regla 1 + 2: el top gana sobre la dirección de scroll.
  const onScroll = (): void => {
    const y = window.scrollY;
    if (y <= TOP_THRESHOLD) setHidden(false);
    else if (y > lastY) setHidden(true);
    else if (y < lastY) setHidden(false);
    lastY = y;
    ticking = false;
  };

  // Regla 1 + 3: en mount solo se muestra si estás en el top; scrolleado queda oculto.
  const applyMountState = (): void => {
    lastY = window.scrollY;
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
