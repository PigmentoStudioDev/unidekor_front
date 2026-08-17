// Form de cotización reutilizable (home + página de contacto). Devuelve solo los campos +
// submit; el heading/intro los aporta cada sección. El nombre del campo va como placeholder
// (sin label visible); aria-label preserva la accesibilidad. El submit hace POST al proxy
// en Vercel (repo unidekor-quote-api), que valida y envía el email por SMTP. La URL no es
// secreta: el proxy se defiende con CORS allowlist + honeypot + validación server-side.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { button } from '../ui/button';
import { QUOTE } from '../constants/content';

// URL absoluta del proxy en Vercel. Reemplazar tras el primer deploy de unidekor-quote-api.
const QUOTE_ENDPOINT = 'https://unidekor-quote-api.vercel.app/api/quote';

// Conversión "Envio Form Unidekor". Se dispara en el submit OK (no hay thank-you page
// donde pegar el snippet estático de Google Ads).
const ADS_CONVERSION = 'AW-18275758869/YnrFCJLfuOMcEJXmx4pE';

function trackQuoteConversion(): void {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'conversion', { send_to: ADS_CONVERSION });
}

const STATUS: Record<Lang, { sending: string; ok: string; error: string }> = {
  es: {
    sending: 'Enviando…',
    ok: 'Gracias, recibimos tu solicitud. Te contactaremos pronto.',
    error: 'No se pudo enviar. Revisa los datos e inténtalo de nuevo.',
  },
  en: {
    sending: 'Sending…',
    ok: 'Thanks, we received your request. We will contact you soon.',
    error: 'Could not send. Check the fields and try again.',
  },
};

export function renderQuoteForm(lang: Lang): HTMLFormElement {
  const t = QUOTE[lang];
  const msg = STATUS[lang];
  const form = el('form', 'aa-quote__form');

  // Honeypot: campo oculto que los humanos no ven; si llega lleno, el proxy lo trata como bot.
  const honeypot = el('input', 'aa-quote__hp', {
    type: 'text',
    name: 'website',
    tabindex: '-1',
    autocomplete: 'off',
    'aria-hidden': 'true',
  });

  const status = el('p', 'aa-quote__status', { role: 'status', 'aria-live': 'polite' });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const label = submitBtn?.querySelector<HTMLElement>('.aa-btn__text');
    const original = label?.textContent ?? t.submit;

    if (submitBtn) submitBtn.disabled = true;
    if (label) label.textContent = msg.sending;
    status.className = 'aa-quote__status';
    status.textContent = '';

    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('request_failed');
      const honeypotValue = typeof data.website === 'string' ? data.website.trim() : '';
      if (!honeypotValue) trackQuoteConversion();
      form.reset();
      status.className = 'aa-quote__status aa-quote__status--ok';
      status.textContent = msg.ok;
    } catch {
      status.className = 'aa-quote__status aa-quote__status--error';
      status.textContent = msg.error;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (label) label.textContent = original;
    }
  });

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
  form.append(honeypot, fields, submit, status);
  return form;
}
