export type Theme = 'light' | 'dark';
export type Lang = 'es' | 'en';

// Páginas del sitio (un solo bundle). La ruta se resuelve contra estas claves (?page= o
// data-aa-page); un valor desconocido cae a 'home'. El registro de render vive en index.ts.
export type Page = 'home' | 'nosotros' | 'contacto';
export const PAGES: readonly Page[] = ['home', 'nosotros', 'contacto'];

export interface LandingConfig {
  theme: Theme;
  lang: Lang;
}

export interface MountAttrs {
  theme: Theme;
  lang: Lang;
}
