// Recalcula ScrollTrigger cuando el layout cambia DESPUÉS del refresh inicial de boot()
// — típicamente imágenes (bg y <img>) que aún no cargaron y corren el alto del documento
// al hacerlo. Sin este refresh tardío, los triggers calculados al boot quedan con offsets
// viejos y las secciones de abajo revelan en el punto de scroll equivocado.
// Portado de ZEGM_web (mismo problema de "painting" tardío).
import { ScrollTrigger } from './gsap-env';

let refreshRaf = 0;

function scheduleRefresh(): void {
  cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
}

export function watchLayoutShifts(root: HTMLElement): void {
  root.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', scheduleRefresh, { once: true });
  });

  // Última red de seguridad: fuentes / última imagen que no dispararon arriba. También
  // cubre los bg-image (que no emiten 'load') cuando terminan de decodificar cerca del
  // window load.
  window.addEventListener('load', scheduleRefresh, { once: true });
}
