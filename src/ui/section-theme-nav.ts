// Sincroniza el tema del navbar con la sección que queda detrás de la barra al scrollear
// (patrón OSMO "Check Section Theme on Scroll"). Reusa data-aa-section-theme —ya declarado
// por cada strip para sus propios tokens— en vez de un atributo nuevo: el offset de detección
// es la mitad del alto del navbar, igual que el snippet original.
import { $, $$ } from '../core/dom';

export function initSectionThemeNav(root: HTMLElement): void {
  const nav = $<HTMLElement>('.aa-nav', root);
  if (!nav) return;

  // section/footer con tema propio; excluye el <nav> (también declara data-aa-section-theme
  // para sus propios tokens, pero no es una strip de contenido a detectar).
  const sections = $$<HTMLElement>('section[data-aa-section-theme], footer[data-aa-section-theme]', root);
  if (!sections.length) return;

  let ticking = false;
  let current: string | null = null;

  const checkTheme = (): void => {
    const offset = nav.offsetHeight / 2;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom >= offset) {
        const theme = section.getAttribute('data-aa-section-theme');
        if (theme && theme !== current) {
          nav.setAttribute('data-aa-nav-theme', theme);
          current = theme;
        }
        break;
      }
    }

    ticking = false;
  };

  const requestCheck = (): void => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(checkTheme);
  };

  window.addEventListener('scroll', requestCheck, { passive: true });
  window.addEventListener('resize', requestCheck);
  checkTheme();
}
