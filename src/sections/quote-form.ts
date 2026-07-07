// Form de cotización reutilizable (home + página de contacto). Devuelve solo los campos +
// submit; el heading/intro los aporta cada sección. El nombre del campo va como placeholder
// (sin label visible); aria-label preserva la accesibilidad. Sin backend aún: submit no-op.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { button } from '../ui/button';
import { QUOTE } from '../constants/content';

export function renderQuoteForm(lang: Lang): HTMLFormElement {
  const t = QUOTE[lang];
  const form = el('form', 'aa-quote__form');
  form.addEventListener('submit', (e) => e.preventDefault());

  const fields = el('div', 'aa-quote__fields');
  fields.setAttribute('data-aa-stagger', '');
  t.fields.forEach((f) => {
    const fieldId = `quote-${f.name}`;
    const wrap = el('div', 'aa-quote__field');
    const placeholder = f.optional ? `${f.placeholder} (Opcional)` : f.placeholder;

    let input: HTMLElement;
    if (f.type === 'select') {
      const select = el('select', 'aa-input aa-input--select', {
        id: fieldId,
        name: f.name,
        'aria-label': f.placeholder,
      });
      if (!f.optional) select.setAttribute('required', '');
      const ph = el('option', undefined, { value: '', disabled: '', selected: '' });
      ph.textContent = f.placeholder;
      select.append(ph);
      (f.options ?? []).forEach((opt) => {
        const o = el('option', undefined, { value: opt });
        o.textContent = opt;
        select.append(o);
      });
      input = select;
    } else if (f.type === 'textarea') {
      input = el('textarea', 'aa-input aa-input--area', {
        id: fieldId,
        name: f.name,
        rows: '4',
        placeholder,
        'aria-label': f.placeholder,
      });
      if (!f.optional) input.setAttribute('required', '');
    } else {
      input = el('input', 'aa-input', {
        id: fieldId,
        name: f.name,
        type: f.type,
        placeholder,
        'aria-label': f.placeholder,
      });
      if (!f.optional) input.setAttribute('required', '');
    }

    wrap.append(input);
    fields.append(wrap);
  });

  const submit = button('aa-btn', t.submit, { type: 'submit' });
  form.append(fields, submit);
  return form;
}
