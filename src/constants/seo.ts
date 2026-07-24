// Metadatos por página. Viven aquí y no repartidos en los HTML de preview para que el copy
// siga teniendo una sola fuente: el prerender (prerender.mjs) los hornea en el <head> de cada
// archivo durante el build.
//
// Las descripciones salen del copy real del sitio (content.ts) y del que ya usa el WordPress
// en producción. Ninguna está inventada.
import type { Page } from '../core/types';

export interface PageSeo {
  title: string;
  description: string;
  // Ruta canónica en el dominio público, no en el deploy de Vercel.
  path: string;
}

// Dominio público del sitio. El canonical apunta SIEMPRE aquí, aunque la página se sirva desde
// el deploy de Vercel: así el preview no compite con el sitio real por contenido duplicado.
export const SITE_ORIGIN = 'https://unidekor.com.mx';

// Datos del negocio para el JSON-LD de LocalBusiness. Todos salen del copy real de content.ts
// y del sitio en producción; ninguno es inventado. Si cambia la dirección o el teléfono, se
// actualiza aquí y en content.ts (el schema y lo visible deben coincidir, o Google lo descarta).
export const BUSINESS = {
  name: 'Unidekor',
  legalName: 'Unidekor México S.A. de C.V.',
  telephone: '+52-55-5358-0302',
  email: 'ventas@unidekor.com',
  foundingDate: '2012',
  address: {
    streetAddress: 'Sierra Gorda 42, 1er piso, Col. Lomas de Chapultepec',
    addressLocality: 'Miguel Hidalgo',
    addressRegion: 'Ciudad de México',
    postalCode: '11000',
    addressCountry: 'MX',
  },
} as const;

export const SEO: Record<Page, PageSeo> = {
  home: {
    title: 'Pisos vinílicos para negocios y espacios comerciales | Unidekor',
    description:
      'Importamos y comercializamos pisos vinílicos a la vanguardia en tecnología, desempeño y apariencia, con composiciones específicas para cada tipo de espacio.',
    path: '/',
  },
  nosotros: {
    title: '¿Quiénes somos? | Unidekor México',
    description:
      'Unidekor México, fundada en 2012 por profesionales en Pisos y Acabados Decorativos. Red de distribución nacional e inventario para proyectos de todo tamaño.',
    path: '/nosotros',
  },
  contacto: {
    title: 'Contacto y cotizaciones | Unidekor',
    description:
      'Cotiza tu proyecto de pisos vinílicos con Unidekor. Déjanos tus datos y te contactamos para platicar de las necesidades de tu espacio.',
    path: '/contacto',
  },
};
