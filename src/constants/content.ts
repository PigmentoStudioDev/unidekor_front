// Contenido bilingüe centralizado. Cada sección lee su slice tipado por Lang.
// Patrón: COPY[lang] → objeto con los strings de esa sección. El copy real de Unidekor
// reemplaza estos placeholders; la SHAPE es lo que las secciones consumen.
import type { Lang } from '../core/types';

// Navbar global (sin CTA). Cada link declara `page` + `anchor`. navHref() resuelve el href
// según la página actual: misma página → ancla interna; otra página → ?page=X#anchor.
export interface NavLink {
  label: string;
  page: string;
  anchor: string;
}

export const NAV: Record<Lang, NavLink[]> = {
  es: [
    { label: 'Productos', page: 'home', anchor: 'productos' },
    { label: 'Nosotros', page: 'nosotros', anchor: 'quienes' },
    { label: 'Contacto', page: 'contacto', anchor: 'contacto' },
  ],
  en: [
    { label: 'Products', page: 'home', anchor: 'productos' },
    { label: 'About', page: 'nosotros', anchor: 'quienes' },
    { label: 'Contact', page: 'contacto', anchor: 'contacto' },
  ],
};

// En dev/preview pagePath usa ?page=; en prod se mapea a los slugs reales del host.
function pagePath(page: string): string {
  return `?page=${page}`;
}

export function navHref(link: { page: string; anchor: string }, currentPage: string): string {
  return link.page === currentPage ? `#${link.anchor}` : `${pagePath(link.page)}#${link.anchor}`;
}

// Página "¿Quiénes somos?" (nosotros.ts). Solo español; `historia` son párrafos en bold.
export interface NosotrosPageCopy {
  headerTitle: string;
  introLead: string;
  historia: string[];
  espaciosTitle: string;
}

const NOSOTROS_PAGE_ES: NosotrosPageCopy = {
  headerTitle: '¿Quiénes somos?',
  introLead:
    'Unidekor México S.A. de C.V. empresa dedicada a la importación y comercialización de pisos a la vanguardia en tecnología, desempeño y apariencia, representando en exclusiva a',
  historia: [
    'Fundada en 2012 por profesionales en el área de Pisos y Acabados Decorativos con el afán de satisfacer las necesidades que tiene el mercado mexicano de productos novedosos y de la máxima calidad.',
    'Tenemos como principal objetivo hacer llegar a todo el mercado mexicano un producto de vanguardia mundial, estableciendo una red de distribución profesional y eficiente como la que merece nuestra línea de productos.',
    'Lo que nos distingue es el equipo de especificación y distribuidores con el que contamos a nivel nacional, así como un inventario capaz de hacer frente a todo tamaño de proyecto, siempre respaldados en absoluto por nuestra proveeduría y una logística eficiente.',
  ],
  espaciosTitle: 'Espacios Unidekor',
};

export const NOSOTROS_PAGE: Record<Lang, NosotrosPageCopy> = {
  es: NOSOTROS_PAGE_ES,
  en: NOSOTROS_PAGE_ES,
};

// Página de contacto (contacto.ts): layout de 3 columnas. `channels` = WhatsApp + redes
// (redes en '#' hasta tener las cuentas). El mapa reusa CONTACT[lang].mapEmbedSrc.
export interface ContactoPageCopy {
  heading: string;
  intro: string;
  channels: { label: string; href: string }[];
  addressLabel: string;
  address: string;
}

// Redes oficiales de Unidekor. Instagram exacta (handle @unidekor_lvt). Facebook (página
// "Unidekor Mexico") y YouTube: VERIFICAR la URL exacta — placeholder por ahora.
const SOCIAL = {
  whatsapp: 'https://wa.me/525553580302',
  facebook: 'https://www.facebook.com/UnidekorMexico',
  instagram: 'https://www.instagram.com/unidekor_lvt/',
  youtube: '#',
} as const;

const CONTACTO_PAGE_ES: ContactoPageCopy = {
  heading: 'Contacto',
  intro:
    'Fundada en 2012 por profesionales en el área de Pisos y Acabados Decorativos con el afán de satisfacer las necesidades que tiene el mercado mexicano de productos novedosos y de la máxima calidad.',
  channels: [
    { label: 'WhatsApp', href: SOCIAL.whatsapp },
    { label: 'Facebook', href: SOCIAL.facebook },
    { label: 'Instagram', href: SOCIAL.instagram },
    { label: 'YouTube', href: SOCIAL.youtube },
  ],
  addressLabel: 'Nombre:',
  address:
    'Sierra Gorda 42, piso 1. Lomas de Chapultepec, Del. Miguel Hidalgo, Ciudad de México',
};

export const CONTACTO_PAGE: Record<Lang, ContactoPageCopy> = {
  es: CONTACTO_PAGE_ES,
  en: CONTACTO_PAGE_ES,
};

export interface HeroCopy {
  title: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ProductsCopy {
  heading: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  cardCta: string;
  services: ServiceItem[];
}

// El \n del title se renderiza como salto vía white-space: pre-line (ver hero.css).
export const HERO: Record<Lang, HeroCopy> = {
  es: {
    title: 'PISOS VINÍLICOS\nPARA TU NEGOCIO',
    ctaPrimary: 'COTIZA AHORA',
    ctaSecondary: 'VER PRODUCTOS',
  },
  en: {
    title: 'VINYL FLOORING\nFOR YOUR BUSINESS',
    ctaPrimary: 'GET A QUOTE',
    ctaSecondary: 'VIEW PRODUCTS',
  },
};

// Sitio solo en español: el copy se define una vez y `es`/`en` apuntan al mismo objeto
// (mantiene la shape Record<Lang> sin traducción que mantener).
const PRODUCTS_ES: ProductsCopy = {
  heading: 'PRODUCTOS PENSADOS PARA CADA NECESIDAD.',
  subheading:
    'En Unidekor contamos con una amplia variedad de pisos vinílicos, con composiciones específicas para los distintos tipos de espacios que tu proyecto puede incluir.',
  ctaPrimary: 'COTIZA AHORA',
  ctaSecondary: 'VER PRODUCTOS',
  cardCta: 'VER MÁS',
  services: [
    {
      title: 'LUJO',
      description:
        'Piso LVT de la más alta calidad. Aporta gran comodidad en cualquier espacio, con un tacto más suave y cálido al transitarlo. Ideal para espacios residenciales de lujo.',
    },
    {
      title: 'DOMÉSTICOS',
      description:
        'Piso SPC de alta durabilidad y fácil instalación. Ideal para espacios domésticos o de alto tránsito, como salas, consultorios, oficinas o negocios en general.',
    },
    {
      title: 'USO RUDO',
      description:
        'Pisos de la marca H2O Floor, con alta durabilidad, a prueba de agua y fácil mantenimiento. Ideales para espacios de alto desgaste, como gimnasios o plazas.',
    },
    {
      title: 'EXTERIORES',
      description:
        'Pisos tipo deck sintéticos, diseñados para soportar ambientes exteriores de frío y calor variables.',
    },
  ],
};

export const PRODUCTS: Record<Lang, ProductsCopy> = { es: PRODUCTS_ES, en: PRODUCTS_ES };

export interface QuoteField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder: string;
  optional?: boolean; // marca el campo como "(Opcional)" y quita el required
  options?: string[]; // solo type 'select'
}

export interface QuoteCopy {
  heading: string;
  subheading: string;
  fields: QuoteField[];
  submit: string;
}

const QUOTE_ES: QuoteCopy = {
  heading: 'COTIZA AHORA',
  subheading:
    'Compártenos los detalles de tu proyecto y recibe una cotización personalizada lo antes posible.',
  fields: [
    { name: 'nombre', type: 'text', placeholder: 'Nombre' },
    { name: 'correo', type: 'email', placeholder: 'Correo', optional: true },
    { name: 'telefono', type: 'tel', placeholder: 'Teléfono' },
    {
      name: 'tipoProyecto',
      type: 'select',
      placeholder: 'Tipo de proyecto',
      options: [
        'Residencial/Doméstico',
        'Oficinas',
        'Negocios/Tiendas',
        'Clínicas/Consultorios',
        'Gimnasios/Recreativos',
      ],
    },
    { name: 'estado', type: 'text', placeholder: 'Estado' },
    { name: 'municipio', type: 'text', placeholder: 'Municipio', optional: true },
  ],
  submit: 'ENVIAR',
};

export const QUOTE: Record<Lang, QuoteCopy> = { es: QUOTE_ES, en: QUOTE_ES };

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCopy {
  heading: string;
  subheading: string;
  cta: string;
  items: FaqItem[];
}

const FAQ_ES: FaqCopy = {
  heading: 'PREGUNTAS FRECUENTES',
  subheading:
    'Resolvemos las dudas más comunes sobre nuestros pisos vinílicos. Si no encuentras lo que buscas, contáctanos y con gusto te asesoramos.',
  cta: 'CONTACTO',
  items: [
    {
      question: '¿Cuál es la diferencia entre SPC y EPC?',
      answer:
        'El SPC tiene un núcleo rígido de piedra y polímeros, por lo que ofrece mayor estabilidad y resistencia. El EPC suele ser más ligero, flexible y cómodo al caminar, aunque su desempeño depende de la composición y calidad de cada fabricante.',
    },
    {
      question: '¿Los pisos SPC y EPC son resistentes al agua?',
      answer:
        'Sí, sus materiales no absorben fácilmente la humedad. Sin embargo, esto no significa que una instalación completa sea totalmente impermeable: el agua puede filtrarse por las uniones si permanece acumulada.',
    },
    {
      question: '¿Se pueden instalar sobre un piso existente?',
      answer:
        'Generalmente sí, siempre que la superficie esté nivelada, firme, limpia y seca. Las irregularidades pueden afectar las uniones, provocar movimiento o reducir la vida útil del piso.',
    },
    {
      question: '¿Se rayan o se dañan con muebles y uso constante?',
      answer:
        'Son resistentes a la abrasión y al uso cotidiano, pero no son indestructibles. Se recomienda usar protectores debajo de los muebles, evitar arrastrarlos y elegir una capa de uso adecuada para espacios comerciales o de alto tránsito.',
    },
    {
      question: '¿El deck sintético necesita mantenimiento?',
      answer:
        'Requiere menos mantenimiento que la madera natural. Normalmente basta con limpiarlo con agua, jabón neutro y un cepillo suave; no necesita barnices ni tratamientos frecuentes, aunque debe instalarse con ventilación y separación correctas.',
    },
    {
      question: '¿Cuál conviene para interiores y cuál para exteriores?',
      answer:
        'El SPC y EPC se utilizan principalmente en interiores residenciales y comerciales. El deck sintético está diseñado para terrazas, balcones, jardines y otras áreas exteriores expuestas al clima. Unidekor maneja estas soluciones para proyectos con distintas necesidades de diseño, resistencia e instalación.',
    },
  ],
};

export const FAQ: Record<Lang, FaqCopy> = { es: FAQ_ES, en: FAQ_ES };

export type ContactIcon = 'mail' | 'phone' | 'pin';

export interface ContactItem {
  icon: ContactIcon;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

export interface ContactCopy {
  eyebrow: string;
  heading: string;
  description: string;
  items: ContactItem[];
  mapEmbedSrc: string;
  mapHref: string;
  mapCaption: string;
}

// Ubicación real: Pisos UNIDEKOR, Lomas de Chapultepec, CDMX. El correo sigue como
// placeholder (no se ha definido uno oficial todavía).
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5100.182042422134!2d-99.2224026!3d19.4266452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d202458264a0fb%3A0x639037d849412398!2sPisos%20UNIDEKOR!5e1!3m2!1ses-419!2smx!4v1783092499587!5m2!1ses-419!2smx';
const MAP_HREF = 'https://www.google.com/maps/search/?api=1&query=Pisos+UNIDEKOR+Sierra+Gorda+42+CDMX';

export const CONTACT: Record<Lang, ContactCopy> = {
  es: {
    eyebrow: 'CONTACTO',
    heading: 'VISÍTANOS O ESCRÍBENOS',
    description:
      'Estamos para ayudarte a elegir el piso ideal para tu proyecto. Escríbenos, llámanos o visita nuestro showroom.',
    items: [
      {
        icon: 'mail',
        title: 'Correo',
        description: 'Escríbenos y te respondemos en menos de 24 horas.',
        linkLabel: 'ventas@unidekor.com',
        linkHref: 'mailto:ventas@unidekor.com',
      },
      {
        icon: 'phone',
        title: 'Teléfono',
        description: 'Abierto · Cierra a las 6 p.m.',
        linkLabel: '55 5358 0302',
        linkHref: 'tel:+525553580302',
      },
      {
        icon: 'pin',
        title: 'Showroom',
        description:
          'Sierra Gorda 42, 1er piso, Col. Lomas de Chapultepec, Miguel Hidalgo, C.P. 11000, CDMX.',
        linkLabel: 'Cómo llegar',
        linkHref: MAP_HREF,
      },
    ],
    mapEmbedSrc: MAP_EMBED_SRC,
    mapHref: MAP_HREF,
    mapCaption: 'Ver en Google Maps',
  },
  en: {
    eyebrow: 'CONTACT',
    heading: 'VISIT US OR WRITE TO US',
    description:
      'We’re here to help you choose the ideal flooring for your project. Write to us, call us, or visit our showroom.',
    items: [
      {
        icon: 'mail',
        title: 'Email',
        description: 'Write to us and we’ll reply within 24 hours.',
        linkLabel: 'sales@unidekor.com',
        linkHref: 'mailto:sales@unidekor.com',
      },
      {
        icon: 'phone',
        title: 'Phone',
        description: 'Open · Closes at 6 p.m.',
        linkLabel: '55 5358 0302',
        linkHref: 'tel:+525553580302',
      },
      {
        icon: 'pin',
        title: 'Showroom',
        description:
          'Sierra Gorda 42, 1st floor, Lomas de Chapultepec, Miguel Hidalgo, 11000, Mexico City.',
        linkLabel: 'Get directions',
        linkHref: MAP_HREF,
      },
    ],
    mapEmbedSrc: MAP_EMBED_SRC,
    mapHref: MAP_HREF,
    mapCaption: 'View on Google Maps',
  },
};

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterCopy {
  menuTitle: string;
  contactTitle: string;
  menu: FooterLink[];
  social: FooterLink[];
  legal: FooterLink[];
}

// Redes sociales y links legales van a "#" hasta tener las cuentas/páginas reales.
// "Galerías" y "Nosotros" aún no tienen sección propia: quedan en "#" por ahora.
export const FOOTER: Record<Lang, FooterCopy> = {
  es: {
    menuTitle: 'MENÚ',
    contactTitle: 'CONTACTO',
    menu: [
      { label: 'Inicio', href: '?page=home#inicio' },
      { label: 'Productos', href: '?page=home#productos' },
      { label: 'Galerías', href: '#' },
      { label: 'FAQs', href: '?page=home#faq' },
      { label: 'Nosotros', href: '?page=nosotros#quienes' },
      { label: 'Contacto', href: '?page=contacto#contacto' },
    ],
    social: [
      { label: 'Facebook', href: SOCIAL.facebook },
      { label: 'Instagram', href: SOCIAL.instagram },
      { label: 'YouTube', href: SOCIAL.youtube },
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
      { label: 'Home', href: '?page=home#inicio' },
      { label: 'Products', href: '?page=home#productos' },
      { label: 'Gallery', href: '#' },
      { label: 'FAQs', href: '?page=home#faq' },
      { label: 'About', href: '?page=nosotros#quienes' },
      { label: 'Contact', href: '?page=contacto#contacto' },
    ],
    social: [
      { label: 'Facebook', href: SOCIAL.facebook },
      { label: 'Instagram', href: SOCIAL.instagram },
      { label: 'YouTube', href: SOCIAL.youtube },
    ],
    legal: [
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Notice', href: '#' },
    ],
  },
};
