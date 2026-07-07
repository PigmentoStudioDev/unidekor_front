import * as esbuild from 'esbuild';
import { cpSync, existsSync } from 'node:fs';

// Self-hosted fonts: copia src/fonts → dist/fonts si existen. Las @font-face referencian
// ./fonts/... (relativo a dist/landing.css), así que deben vivir junto al CSS.
if (existsSync('src/fonts')) cpSync('src/fonts', 'dist/fonts', { recursive: true });

// Bundle TS + GSAP + CSS hacia dist/. jsDelivr sirve el tag versionado.
const shared = {
  bundle: true,
  format: 'esm',
  target: ['es2019'],
  logLevel: 'info',
};

const jsOptions = {
  ...shared,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/landing.js',
  minify: true,
  sourcemap: true,
};

const cssOptions = {
  ...shared,
  entryPoints: ['src/styles/landing.css'],
  outfile: 'dist/landing.css',
  minify: true,
  // Conserva las URLs de fuentes literales (./fonts/...) en vez de empaquetarlas.
  external: ['*.woff2', '*.otf', '*.ttf'],
};

// Página premium (preview-premium.html): mismo sistema de marca (tokens/fuentes
// compartidos vía @import en premium.css), bundle separado para no tocar landing.js/css.
const premiumJsOptions = {
  ...shared,
  entryPoints: ['src/premium.ts'],
  outfile: 'dist/premium.js',
  minify: true,
  sourcemap: true,
};

const premiumCssOptions = {
  ...cssOptions,
  entryPoints: ['src/styles/premium.css'],
  outfile: 'dist/premium.css',
};

const watch = process.argv.includes('--watch');
const serve = process.argv.includes('--serve');

if (watch || serve) {
  const [jsCtx, cssCtx, premiumJsCtx, premiumCssCtx] = await Promise.all([
    esbuild.context(jsOptions),
    esbuild.context(cssOptions),
    esbuild.context(premiumJsOptions),
    esbuild.context(premiumCssOptions),
  ]);
  await Promise.all([jsCtx.watch(), cssCtx.watch(), premiumJsCtx.watch(), premiumCssCtx.watch()]);
  if (serve) {
    // Solo un contexto abre el servidor HTTP (sirve todo el servedir, incluye ambos bundles).
    const { host, port } = await jsCtx.serve({ servedir: '.', port: Number(process.env.PORT) || 8770 });
    console.log(`dev server: http://${host}:${port}`);
  } else {
    console.log('watching src/...');
  }
} else {
  await Promise.all([
    esbuild.build(jsOptions),
    esbuild.build(cssOptions),
    esbuild.build(premiumJsOptions),
    esbuild.build(premiumCssOptions),
  ]);
}
