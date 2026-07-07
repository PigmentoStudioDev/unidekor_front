// Botón animado (patrón Button 016 de OSMO): estructura de 3 capas — inner (texto
// clipeado) + text (roll en hover) + bg (swap de color). El estilo/animación vive
// en components.css; aquí solo se arma el DOM.
//
// className lleva las clases completas (aa-btn + modificadores, p. ej.
// 'aa-btn aa-btn--ghost'). Si attrs trae href → <a>; si no → <button type="button">.
import { el } from '../core/dom';

export function button(
  className: string,
  label: string,
  attrs: Record<string, string> = {},
): HTMLElement {
  const node: HTMLElement =
    'href' in attrs ? el('a', className, attrs) : el('button', className, { type: 'button', ...attrs });

  const inner = el('span', 'aa-btn__inner');
  const text = el('span', 'aa-btn__text');
  text.textContent = label;
  inner.append(text);

  node.append(inner, el('span', 'aa-btn__bg'));
  return node;
}
