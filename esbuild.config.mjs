import * as esbuild from 'esbuild';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { createPrerenderer } from './prerender.mjs';

const dev = process.argv.includes('--watch') || process.argv.includes('--serve');

// Self-hosted fonts: las @font-face apuntan a ./fonts/… relativo al CSS, así que deben vivir
// junto a él (dist/assets). Autohospedadas y no en R2 porque un @font-face cross-origin sin
// cabeceras CORS falla, y el bundle corre en dominios host que no controlamos.
if (existsSync('src/fonts')) cpSync('src/fonts', 'dist/assets/fonts', { recursive: true });

// Estáticos de raíz (favicons + webmanifest): se sirven desde / en el deploy. El host que
// monta el bundle controla su propio <head>, así que esto aplica al sitio en Vercel.
if (existsSync('public')) cpSync('public', 'dist', { recursive: true });

// Hash solo en prod (cache inmutable). En dev los nombres son estables para que el loader y
// la página de preview los enlacen sin recalcular el hash en cada rebuild.
const options = {
  entryPoints: { landing: 'src/index.ts', styles: 'src/styles/landing.css' },
  outdir: 'dist/assets',
  entryNames: dev ? '[name]' : '[name].[hash]',
  bundle: true,
  format: 'esm',
  target: ['es2019'],
  minify: !dev,
  sourcemap: true,
  metafile: true,
  logLevel: 'info',
  // Conserva las URLs de fuentes literales (./fonts/...) en vez de empaquetarlas.
  external: ['*.woff2', '*.otf', '*.ttf'],
};

// El loader es el único contrato con el host: un <script> sin versión que mantener. Se
// regenera en cada build con los nombres hasheados ya resueltos, así los bundles se cachean
// como inmutables y aun así el host recibe el build nuevo. Reemplaza el pin de tag + purga
// que exigía jsDelivr.
function writeLoader(js, css) {
  const src = `(function () {
  if (window.__aaUnidekor) return;
  window.__aaUnidekor = true;

  var self = document.currentScript || document.querySelector('script[src*="loader.js"]');
  var base = self ? self.src.replace(/\\/loader\\.js.*$/, '') : '';

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = base + '/assets/${css}';
  document.head.appendChild(css);

  var js = document.createElement('script');
  js.type = 'module';
  js.setAttribute('data-cfasync', 'false');
  js.src = base + '/assets/${js}';
  document.head.appendChild(js);
})();
`;
  mkdirSync('dist', { recursive: true });
  writeFileSync('dist/loader.js', src);
}

// `src` es la ruta en el repo y `dest` la del deploy: las páginas viven bajo preview/ pero se
// sirven desde la raíz de dist. `page` indica qué página del bundle hornear dentro de su div de
// montaje (ver prerender.mjs); sin `page` se copia tal cual, como la documentación, que no monta
// el bundle. Con cleanUrls de Vercel (vercel.json), nosotros.html queda servida en /nosotros.
const STATIC_PAGES = [
  { src: 'preview/index.html', dest: 'index.html', page: 'home' },
  { src: 'preview/nosotros.html', dest: 'nosotros.html', page: 'nosotros' },
  { src: 'preview/contacto.html', dest: 'contacto.html', page: 'contacto' },
  { src: 'docs/how-to-install.html', dest: 'docs/how-to-install.html' },
];

async function copyStaticPages() {
  const { prerender, robots, sitemap } = await createPrerenderer();

  for (const { src, dest, page } of STATIC_PAGES) {
    const out = `dist/${dest}`;
    mkdirSync(dirname(out), { recursive: true });
    const html = readFileSync(src, 'utf8');
    writeFileSync(out, page ? prerender(html, { page, lang: 'es', theme: 'light' }) : html);
  }

  writeFileSync('dist/robots.txt', robots);
  writeFileSync('dist/sitemap.xml', sitemap);
}

// Con metafile, toma los nombres hasheados de los ENTRY outputs (ignora .map y chunks, que
// no tienen entryPoint).
function hashedNames(metafile) {
  let js, css;
  for (const [file, meta] of Object.entries(metafile.outputs)) {
    if (!meta.entryPoint) continue;
    if (file.endsWith('.js')) js = basename(file);
    else if (file.endsWith('.css')) css = basename(file);
  }
  return { js, css };
}

if (dev) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  writeLoader('landing.js', 'styles.css');
  await copyStaticPages();
  if (process.argv.includes('--serve')) {
    const { host, port } = await ctx.serve({ servedir: 'dist', port: Number(process.env.PORT) || 8770 });
    console.log(`dev server: http://${host}:${port}/`);
  } else {
    console.log('watching src/...');
  }
} else {
  const { metafile } = await esbuild.build(options);
  const { js, css } = hashedNames(metafile);
  writeLoader(js, css);
  await copyStaticPages();
}
