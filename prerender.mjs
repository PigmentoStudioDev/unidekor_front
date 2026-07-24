// Prerender: ejecuta la fase de render en Node y hornea el DOM resultante dentro del div de
// montaje de cada HTML, para que un crawler que no ejecuta JavaScript reciba la página entera.
//
// Por qué existe: el bundle inyecta todo en cliente, así que el HTML servido era
// `<div data-aa-mount></div>` y nada más. Googlebot lo renderiza con retraso y sin garantías;
// los crawlers de IA (GPTBot, PerplexityBot, ClaudeBot) directamente no ejecutan JS, así que
// para ellos el sitio estaba vacío.
//
// Solo corre `renderPage` (src/render.ts). NUNCA los initX(): esos aplican
// gsap.set(el, { autoAlpha: 0 }) y serializarían el contenido con opacity:0 + visibility:hidden.
// En cliente, boot() vuelve a renderizar sobre el mismo módulo y engancha las animaciones.
import * as esbuild from 'esbuild';
import { parseHTML } from 'linkedom';

// Globals que el código de secciones espera del navegador. Se instalan antes de importar el
// bundle de render; ningún módulo toca el DOM en su cuerpo, solo dentro de funciones.
const DOM_GLOBALS = [
  'document',
  'HTMLElement',
  'Element',
  'Node',
  'DocumentFragment',
  'CSSStyleDeclaration',
];

function installGlobals(win) {
  for (const key of DOM_GLOBALS) {
    if (win[key] !== undefined) globalThis[key] = win[key];
  }
}

// Empaqueta src/render.ts para Node una sola vez. De ahí salen tanto renderPage como los
// metadatos SEO, así el prerender no necesita un segundo punto de entrada.
async function loadRenderer() {
  const result = await esbuild.build({
    entryPoints: ['src/render.ts'],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: ['es2022'],
    write: false,
    logLevel: 'silent',
  });

  const code = result.outputFiles[0].text;
  const url = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
  return import(url);
}

// Escribe una etiqueta de <head> reemplazando la que ya exista, para que el prerender sea
// idempotente si un HTML de preview ya trae la suya.
function upsertMeta(document, selector, attrs) {
  const existing = document.head.querySelector(selector);
  if (existing) existing.remove();
  const tag = document.createElement(attrs.rel ? 'link' : 'meta');
  for (const [key, value] of Object.entries(attrs)) tag.setAttribute(key, value);
  document.head.appendChild(tag);
}

// Hornea title, description, canonical, Open Graph y Twitter Card desde src/constants/seo.ts.
// El canonical apunta al dominio público aunque la página se sirva desde Vercel: es lo que
// evita que el deploy compita con el sitio real por contenido duplicado.
function injectHead(document, seo, origin) {
  const url = `${origin}${seo.path}`;

  const title = document.querySelector('title') ?? document.head.appendChild(document.createElement('title'));
  title.textContent = seo.title;

  upsertMeta(document, 'meta[name="description"]', { name: 'description', content: seo.description });
  upsertMeta(document, 'link[rel="canonical"]', { rel: 'canonical', href: url });

  upsertMeta(document, 'meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta(document, 'meta[property="og:title"]', { property: 'og:title', content: seo.title });
  upsertMeta(document, 'meta[property="og:description"]', { property: 'og:description', content: seo.description });
  upsertMeta(document, 'meta[property="og:url"]', { property: 'og:url', content: url });
  upsertMeta(document, 'meta[property="og:locale"]', { property: 'og:locale', content: 'es_MX' });

  upsertMeta(document, 'meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta(document, 'meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
  upsertMeta(document, 'meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
}

// robots.txt permisivo a propósito, incluso en el deploy de Vercel: Googlebot necesita poder
// descargar /loader.js y /assets/ para renderizar el sitio montado en el host. De la duplicación
// se encarga el canonical, no un Disallow. Los crawlers de IA se listan explícitamente porque
// no ejecutan JavaScript y dependen por completo del HTML prerenderizado.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
];

function buildRobots(origin) {
  const agents = ['*', ...AI_BOTS].map((ua) => `User-agent: ${ua}\nAllow: /`).join('\n\n');
  return `${agents}\n\nSitemap: ${origin}/sitemap.xml\n`;
}

function buildSitemap(seo, origin) {
  const urls = Object.values(seo)
    .map(({ path }) => `  <url>\n    <loc>${origin}${path}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// JSON-LD. LocalBusiness identifica la entidad en todas las páginas; FAQPage solo donde el
// FAQ existe de verdad (home), porque Google descarta el schema sin contenido que lo respalde.
// FAQPage es además el de mayor rendimiento para motores generativos: da pares
// pregunta/respuesta ya estructurados, listos para citar.
function buildSchema(page, seo, origin, business, faq) {
  const graph = [
    {
      '@type': 'LocalBusiness',
      '@id': `${origin}/#business`,
      name: business.name,
      legalName: business.legalName,
      url: origin,
      telephone: business.telephone,
      email: business.email,
      foundingDate: business.foundingDate,
      address: { '@type': 'PostalAddress', ...business.address },
    },
    {
      '@type': 'WebPage',
      '@id': `${origin}${seo.path}`,
      url: `${origin}${seo.path}`,
      name: seo.title,
      description: seo.description,
      inLanguage: 'es-MX',
      isPartOf: { '@id': `${origin}/#business` },
    },
  ];

  if (page === 'home' && faq?.items?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function injectSchema(document, schema) {
  const existing = document.head.querySelector('script[type="application/ld+json"]');
  if (existing) existing.remove();
  const tag = document.createElement('script');
  tag.setAttribute('type', 'application/ld+json');
  tag.textContent = JSON.stringify(schema);
  document.head.appendChild(tag);
}

export async function createPrerenderer() {
  const { renderPage, SEO, SITE_ORIGIN, BUSINESS, FAQ } = await loadRenderer();

  // Se exponen ya construidos para que el build solo los escriba a disco.
  const robots = buildRobots(SITE_ORIGIN);
  const sitemap = buildSitemap(SEO, SITE_ORIGIN);

  // prerender: devuelve el HTML de entrada con el div de montaje ya relleno y el <head>
  // horneado. Si el archivo no declara mount, se devuelve intacto (p. ej. la página de
  // documentación, que no monta el bundle).
  function prerender(html, { page, lang, theme }) {
    const { document } = parseHTML(html);
    const mount = document.querySelector('[data-aa-mount]');
    if (!mount) return html;

    // parseHTML crea un documento nuevo por página: los globals se reinstalan para que el
    // renderer construya nodos que pertenezcan a ESTE documento.
    installGlobals(document.defaultView ?? { document });
    globalThis.document = document;

    mount.innerHTML = renderPage(page, lang, theme).outerHTML;
    injectHead(document, SEO[page], SITE_ORIGIN);
    injectSchema(document, buildSchema(page, SEO[page], SITE_ORIGIN, BUSINESS, FAQ[lang]));
    return document.toString();
  }

  return { prerender, robots, sitemap };
}
