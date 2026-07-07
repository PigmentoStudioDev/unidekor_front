// Contenido de la página premium (preview-premium.html). Separado de content.ts
// para no inflar el archivo del sitio original — mismo patrón COPY[lang].
import type { Lang } from '../core/types';
import type { FooterCopy } from './content';
import { TABLES } from './assets';

// ─── Navbar ───────────────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarCopy {
  menu: NavLink[];
  cta: string;
}

export const NAVBAR: Record<Lang, NavbarCopy> = {
  es: {
    menu: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Productos', href: '#productos' },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contacto', href: '#contacto' },
    ],
    cta: 'COTIZA AHORA',
  },
  en: {
    menu: [
      { label: 'Home', href: '#inicio' },
      { label: 'Products', href: '#productos' },
      { label: 'About', href: '#nosotros' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contacto' },
    ],
    cta: 'GET A QUOTE',
  },
};

// ─── Hero (premium: card sobre bg image) ───────────────────────────────────────────
export interface HeroPremiumCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

// Headline adaptado del real (unidekor.com.mx: "PISOS DE ALTA TECNOLOGÍA") — más
// distintivo que un genérico "pisos premium"; el subtítulo suma el diferenciador
// real de distribución exclusiva en México.
export const HERO_PREMIUM: Record<Lang, HeroPremiumCopy> = {
  es: {
    eyebrow: 'UNIDEKOR',
    title: 'Pisos de alta tecnología',
    subtitle:
      'Importamos y distribuimos en exclusiva para México los pisos vinílicos de mayor innovación del mercado mundial, con acabados que igualan la belleza de la madera y la piedra natural.',
    ctaPrimary: 'COTIZA AHORA',
    ctaSecondary: 'VER PRODUCTOS',
  },
  en: {
    eyebrow: 'UNIDEKOR',
    title: 'High-technology flooring',
    subtitle:
      'We import and exclusively distribute in Mexico the most innovative vinyl flooring in the world market, with finishes that match the beauty of natural wood and stone.',
    ctaPrimary: 'GET A QUOTE',
    ctaSecondary: 'VIEW PRODUCTS',
  },
};

// ─── Trust / stats ──────────────────────────────────────────────────────────────────
export interface StatItem {
  value: string;
  label: string;
}

export interface TrustCopy {
  heading: string;
  stats: StatItem[];
}

// Los 3 datos son reales: reseñas (Google Maps, Pisos UNIDEKOR), años de experiencia
// (fundada en 2012, unidekor.com.mx) y distribución exclusiva (mismo sitio).
export const TRUST: Record<Lang, TrustCopy> = {
  es: {
    heading: 'La confianza de cientos de clientes en CDMX',
    stats: [
      { value: '3,829', label: 'Reseñas en Google' },
      { value: '+14', label: 'Años de experiencia' },
      { value: '100%', label: 'Distribución exclusiva en México' },
    ],
  },
  en: {
    heading: 'Trusted by hundreds of clients in Mexico City',
    stats: [
      { value: '3,829', label: 'Google reviews' },
      { value: '+14', label: 'Years of experience' },
      { value: '100%', label: 'Exclusive distribution in Mexico' },
    ],
  },
};

// ─── Products (premium: con imagen por categoría) ──────────────────────────────────
export interface PremiumServiceItem {
  image: string;
  title: string;
  description: string;
}

export interface ProductsPremiumCopy {
  eyebrow: string;
  heading: string;
  description: string;
  items: PremiumServiceItem[];
  ctaPrimary: string;
  ctaSecondary: string;
}

// Copy alineado con PRODUCTS (content.ts) — misma info, con imagen de muestra por línea.
export const PRODUCTS_PREMIUM: Record<Lang, ProductsPremiumCopy> = {
  es: {
    eyebrow: 'PRODUCTOS',
    heading: 'Productos pensados para cada necesidad',
    description:
      'Del acabado más elegante al piso que aguanta el uso más rudo: encuentra la opción ideal para tu espacio.',
    items: [
      { image: TABLES.table1, title: 'LUJO', description: 'Acabados premium con la calidez de la madera real, sin sus cuidados.' },
      { image: TABLES.table2, title: 'DOMÉSTICOS', description: 'Cómodos, fáciles de limpiar y pensados para el día a día.' },
      { image: TABLES.table3, title: 'USO RUDO', description: 'Aguantan el paso constante de oficinas y comercios.' },
      { image: TABLES.table4, title: 'EXTERIOR', description: 'Resisten sol, lluvia y humedad sin perder su color.' },
    ],
    ctaPrimary: 'COTIZA AHORA',
    ctaSecondary: 'CONOCE MÁS',
  },
  en: {
    eyebrow: 'PRODUCTS',
    heading: 'Products designed for every need',
    description:
      'From the most elegant finish to flooring that withstands the toughest use: find the ideal option for your space.',
    items: [
      { image: TABLES.table1, title: 'LUXURY', description: 'Premium finishes with the warmth of real wood, without the upkeep.' },
      { image: TABLES.table2, title: 'RESIDENTIAL', description: 'Comfortable, easy to clean and built for everyday life.' },
      { image: TABLES.table3, title: 'HEAVY DUTY', description: 'They handle the constant foot traffic of offices and stores.' },
      { image: TABLES.table4, title: 'OUTDOOR', description: 'They resist sun, rain and humidity without losing their color.' },
    ],
    ctaPrimary: 'GET A QUOTE',
    ctaSecondary: 'LEARN MORE',
  },
};

// ─── Nosotros ───────────────────────────────────────────────────────────────────────
export interface AboutCopy {
  eyebrow: string;
  heading: string;
  description: string;
  bullets: string[];
  cta: string;
}

// Historia y diferenciadores extraídos de unidekor.com.mx (fundación 2012, misión,
// distribución exclusiva, red nacional) — reemplaza el copy inventado anterior.
export const ABOUT: Record<Lang, AboutCopy> = {
  es: {
    eyebrow: 'NOSOTROS',
    heading: 'Distribución exclusiva de pisos de alta tecnología en México',
    description:
      'Fundada en 2012 por especialistas en pisos y acabados decorativos, Unidekor importa y distribuye en exclusiva para toda la República Mexicana los pisos vinílicos de mayor innovación tecnológica del mercado mundial. Nuestro objetivo: llevar a cada proyecto, sin importar su tamaño, un producto a la vanguardia global.',
    bullets: [
      'Distribución exclusiva en toda la República Mexicana',
      'Equipo de especificación y red de distribuidores a nivel nacional',
      'Inventario propio para proyectos de cualquier tamaño',
    ],
    cta: 'CONOCE NUESTRO SHOWROOM',
  },
  en: {
    eyebrow: 'ABOUT US',
    heading: 'Exclusive distribution of high-technology flooring in Mexico',
    description:
      'Founded in 2012 by specialists in flooring and decorative finishes, Unidekor imports and exclusively distributes throughout Mexico the most technologically innovative vinyl flooring in the world market. Our goal: to bring every project, regardless of size, a globally cutting-edge product.',
    bullets: [
      'Exclusive distribution across Mexico',
      'Nationwide specification team and distributor network',
      'In-house inventory for projects of any size',
    ],
    cta: 'VISIT OUR SHOWROOM',
  },
};


// ─── Footer (premium: Nosotros apunta a una sección real; sin Galería) ────────────
export const FOOTER_PREMIUM: Record<Lang, FooterCopy> = {
  es: {
    menuTitle: 'MENÚ',
    contactTitle: 'CONTACTO',
    menu: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Productos', href: '#productos' },
      { label: 'FAQs', href: '#faq' },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Contacto', href: '#contacto' },
    ],
    social: [
      { label: 'Facebook', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'TikTok', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
    legal: [
      { label: 'Términos y Condiciones', href: '#' },
      { label: 'Aviso de privacidad', href: '#' },
    ],
  },
  en: {
    menuTitle: 'MENU',
    contactTitle: 'CONTACT',
    menu: [
      { label: 'Home', href: '#inicio' },
      { label: 'Products', href: '#productos' },
      { label: 'FAQs', href: '#faq' },
      { label: 'About', href: '#nosotros' },
      { label: 'Contact', href: '#contacto' },
    ],
    social: [
      { label: 'Facebook', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'TikTok', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
    legal: [
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Notice', href: '#' },
    ],
  },
};
