// Split-text por palabra + ScrollTrigger (portado de ZEGM_web), sin el plugin
// SplitText de GSAP (no licenciado). Declarativo vía data-aa-split; se llama una vez
// tras el render y degrada a "todo visible" si el usuario pidió reduced-motion.
import { gsap, prefersReducedMotion } from './gsap-env';
import { $$ } from '../core/dom';

// Envuelve cada palabra dentro de `node` en <span clip><span animable>word</span></span>,
// preservando elementos inline (copy estático de confianza, recorrido recursivo).
function wrapWords(node: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];

  const walk = (parent: Node): void => {
    Array.from(parent.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
        return;
      }
      if (child.nodeType !== Node.TEXT_NODE) return;

      const text = child.textContent ?? '';
      const frag = document.createDocumentFragment();

      text.split(/(\s+)/).forEach((chunk) => {
        if (chunk === '') return;
        if (/^\s+$/.test(chunk)) {
          frag.append(document.createTextNode(chunk));
          return;
        }
        const wrap = document.createElement('span');
        wrap.className = 'aa-split-word';
        const inner = document.createElement('span');
        inner.className = 'aa-split-word-inner';
        inner.textContent = chunk;
        wrap.append(inner);
        frag.append(wrap);
        words.push(inner);
      });

      parent.replaceChild(frag, child);
    });
  };

  walk(node);
  return words;
}

export function initSplitText(root: HTMLElement): void {
  if (prefersReducedMotion) return; // el CSS deja el contenido visible por defecto

  $$<HTMLElement>('[data-aa-split]', root).forEach((node) => {
    const words = wrapWords(node);
    if (!words.length) return;

    const tween = {
      yPercent: 100,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.025,
    };

    // data-aa-split="mount": anima en el montaje, SIN ScrollTrigger. Para el hero,
    // que al ser 100vh con texto anclado abajo queda bajo la línea del trigger y
    // esperaría scroll. El resto revela en scroll (clamp() evita offsets inválidos).
    if (node.dataset.aaSplit === 'mount') {
      gsap.from(words, { ...tween, delay: 0.1 });
    } else {
      gsap.from(words, {
        ...tween,
        scrollTrigger: { trigger: node, start: 'clamp(top 85%)', once: true },
      });
    }
  });
}
