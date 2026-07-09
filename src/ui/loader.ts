// Timeline de la mount intro (look del GIF de Kram, calidad de motion tipo Osmo):
// campo claro opaco → barra que crece a tarjeta → wobble → el color de marca inunda
// desde el centro → wipe POR CELDA que replica la grilla del hero y descubre cada
// container de forma independiente. GSAP centralizado + CustomEase.
import { gsap, prefersReducedMotion } from './gsap-env';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
// Ease firma (Osmo/token --aa-ease cubic-bezier(0.625,0.05,0,1)): el wipe de salida lee
// igual que el resto de las transiciones del sitio.
CustomEase.create('aa-mount-ease', 'M0,0 C0.625,0.05 0,1 1,1');

// Celdas visibles del hero, ordenadas izq→der (top→bottom como desempate) para que el
// stagger del reveal barra en esa dirección. Filtra las ocultas (asides en mobile → 0x0).
function heroCells(root: HTMLElement): HTMLElement[] {
  const asides = Array.from(root.querySelectorAll<HTMLElement>('.aa-hero__aside'));
  const top = root.querySelector<HTMLElement>('.aa-hero__top');
  const blocks = Array.from(root.querySelectorAll<HTMLElement>('.aa-hero__block'));
  const cells = [asides[0], top, blocks[0], blocks[1], asides[1]].filter(
    (c): c is HTMLElement => !!c && c.offsetWidth > 0 && c.offsetHeight > 0,
  );
  return cells.sort((a, b) => {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    return ra.left - rb.left || ra.top - rb.top;
  });
}

// ¿Las celdas tapizan el viewport? Solo entonces el reveal por celda no deja huecos:
// asides visibles (desktop) → 5 celdas edge-to-edge; o main a ancho completo (mobile).
function cellsCoverViewport(root: HTMLElement): boolean {
  const leftAside = root.querySelector<HTMLElement>('.aa-hero__aside');
  const main = root.querySelector<HTMLElement>('.aa-hero__main');
  if (leftAside && leftAside.offsetWidth > 0) return true;
  return !!main && main.offsetWidth >= window.innerWidth - 2;
}

// Panel oscuro fijo sobre una celda (inflado 0.5px por lado para evitar hairlines entre
// celdas adyacentes). Se retira con scaleX→0 descubriendo la celda debajo.
function makeCellPanel(cell: HTMLElement): HTMLElement {
  const r = cell.getBoundingClientRect();
  const panel = document.createElement('div');
  panel.className = 'aa-mount__panel';
  panel.style.left = `${r.left - 0.5}px`;
  panel.style.top = `${r.top - 0.5}px`;
  panel.style.width = `${r.width + 1}px`;
  panel.style.height = `${r.height + 1}px`;
  return panel;
}

export function initMountIntro(root: HTMLElement): void {
  const container = root.querySelector<HTMLElement>('[data-aa-mount]');
  // Sin overlay (visita repetida en la sesión): nada que animar, el hero ya es visible.
  if (!container) return;

  const cover = container.querySelector<HTMLElement>('[data-aa-mount-cover]');
  const card = container.querySelector<HTMLElement>('[data-aa-mount-card]');
  const mark = container.querySelector<HTMLElement>('.aa-mount__mark');

  // Al terminar (o sin animación): retira el overlay, libera el scroll y suelta las capas
  // de compositor (will-change permanente en paneles full-bleed consume memoria GPU).
  const finish = (): void => {
    container.classList.remove('is--active');
    container.style.display = 'none';
    if (cover) cover.style.willChange = 'auto';
    if (card) card.style.willChange = 'auto';
  };

  if (prefersReducedMotion || !cover || !card) {
    finish();
    return;
  }

  // Reveal por celda solo si las celdas tapizan el viewport; si no (banda 800–991px),
  // cae al wipe único del cover. Los paneles se miden AHORA (hero en reposo, scroll
  // bloqueado) y quedan ocultos hasta el flood.
  const perCell = cellsCoverViewport(root);
  const cells = perCell ? heroCells(root) : [];
  const panels = cells.map(makeCellPanel);
  panels.forEach((p) => container.append(p));
  if (panels.length) gsap.set(panels, { autoAlpha: 0, transformOrigin: 'right center' });
  // Solo las celdas de imagen (asides/blocks) hacen el settle de scale al revelarse; la
  // central es texto (escalarla deformaría el heading).
  const imageCells = cells.filter(
    (c) => c.classList.contains('aa-hero__aside') || c.classList.contains('aa-hero__block'),
  );

  // timeScale > 1: comprime la timeline sin tocar proporciones (staggers/overlaps intactos).
  const tl = gsap.timeline({ onComplete: finish });
  tl.timeScale(1.1);

  // ─── Emerge: barra fina que se ensancha a tarjeta (inicio del GIF) ───────────────
  tl.from(card, { scaleX: 0.28, scaleY: 0.7, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0);

  // Mark entra cuando la tarjeta ya tiene ancho (evita ver el wordmark aplastado en la barra).
  if (mark) {
    tl.from(mark, { yPercent: 60, opacity: 0, duration: 0.6, ease: 'expo.out' }, 0.38);
  }

  // ─── Wobble: rotación juguetona con settle ───────────────────────────────────────
  tl.to(card, { rotate: -7, duration: 0.2, ease: 'power2.out' }, 0.72)
    .to(card, { rotate: 4, duration: 0.16, ease: 'power1.inOut' })
    .to(card, { rotate: 0, duration: 0.26, ease: 'back.out(2)' });

  // ─── Flood: el color de marca inunda desde el centro con leve rotación (como el GIF).
  // Radius morph (detalle is--scaling de Osmo): arranca redondeado como tarjeta y se
  // cuadra a 0 al llenar → snap crisp. ──────────────────────────────────────────────
  tl.fromTo(
    cover,
    { scale: 0, rotate: -8, borderRadius: '1.4em' },
    { scale: 1, rotate: 0, borderRadius: '0em', duration: 0.8, ease: 'expo.inOut' },
    1.25,
  );
  tl.to(card, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.3);
  if (mark) tl.to(mark, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.3);

  // Handoff en el flood-complete: el cover oscuro cubre todo → hago visibles los paneles
  // (mismo color, tapizan las mismas celdas: cambio invisible), vuelvo el campo claro
  // transparent y oculto el cover. Así el wipe siguiente descubre el hero, no el overlay.
  tl.set(container, { backgroundColor: 'transparent' }, 2.05);

  if (panels.length) {
    tl.set(panels, { autoAlpha: 1 }, 2.05);
    tl.set(cover, { autoAlpha: 0 }, 2.05);
    // ─── Reveal por celda: cada panel se retira (scaleX→0) escalonado desde el centro
    // hacia afuera (stagger from:'center', estilo Osmo) → primero la columna central. ─
    tl.to(
      panels,
      { scaleX: 0, duration: 0.75, ease: 'aa-mount-ease', stagger: { each: 0.09, from: 'center' } },
      2.05,
    );
    // Settle de las celdas de imagen: un scale sutil (1.05→1) mientras se descubren, con
    // el mismo ritmo desde el centro. clearProps deja el hero sin transform residual.
    if (imageCells.length) {
      tl.from(
        imageCells,
        {
          scale: 1.05,
          duration: 0.9,
          ease: 'expo.out',
          transformOrigin: 'center',
          clearProps: 'transform',
          stagger: { each: 0.09, from: 'center' },
        },
        2.05,
      );
    }
  } else {
    // Fallback (celdas no tapizan): wipe único del cover, descubriendo el hero de un bloque.
    tl.to(cover, { xPercent: 100, duration: 0.85, ease: 'aa-mount-ease' }, 2.05);
  }
}
