// Assets servidos desde el bucket público R2. Los <img>/background CSS no requieren
// CORS (a diferencia de las fuentes). asset() URL-encodea la key (maneja espacios,
// comas y '+' en los nombres de archivo).

const R2_BASE = 'https://pub-689bd7bf1ef94ab08b150945eac861e5.r2.dev';

const asset = (key: string): string => `${R2_BASE}/${encodeURIComponent(key)}`;

// ─── Logo ───────────────────────────────────────────────────────────────────────
export const LOGOS = {
  main: asset('unidekor-logo.webp'),
  // Wordmark blanco (para fondos oscuros: hero/footer y navbar en top0).
  light: asset('unidekor-logo.webp'),
} as const;

// ─── Documentos ─────────────────────────────────────────────────────────────────
export const DOCS = {
  presentation: asset('PRESENTACION UNIDEKOR 2026 (1).pdf'),
} as const;

// ─── Imágenes (galería / editorial) ────────────────────────────────────────────
export const IMAGES = {
  img1: asset('014dd66437318efefd2f5093651a8095_45132894294fa098a73052a8953160262c134050b0b70f4060e2ea701803a3d3.webp'),
  img2: asset('28704ef9d33d1f8b3b18cfd57d933b02_b8276b35a2128300c8686e0035233dcc0ee29902980c9b43ab198ed3607609bf.webp'),
  img3: asset('31a57f7381f4424b168e38eea3f19ee3_b57275b125f74a8f17e0b19641e4ff8739175cfbb7c15b1849de559a4f562e19.webp'),
  img4: asset('39f12741904bf92bcca637294e9ac2cd_5efbac9ff3de0d0fbd2093493ed49d4f377ed5ba426d6a5ed7bfbcab9a9d718b.webp'),
  img5: asset('41fa33678e06952828722bc789207eb2_518a0a9df56547fa6ca77b00625c485a72b9a2a18876e05c0792a8546b4a8672.webp'),
  img6: asset('4b46ac11b40d1eb000f3b783968e5f6e_2fba32efa0dc9c3c6e4406823fd6a893666da1deb0a9a47266d1d4e18eda9658.webp'),
  img7: asset('a739c73a3ec14b3b000a7d482d34c3e3_a35513527888dae1d975e49a4497f02de879a40e8e4be29a754e9905c658f06d.webp'),
  img8: asset('c93b1b7e15cb7d4076683eba3546afdc_c3562c3ced484e2595f669139561c77a249de92746c93a1b6d5f2ad5f02fddb4.webp'),
  // Hero: 4 slots izquierda→derecha (versiones nuevas en R2).
  heroA: asset('a739c73a3ec14b3b000a7d482d34c3e3_029c642f443d453378abff61e1e0d7870739114067d30233ef20184d03d21c5f.webp'),
  heroB: asset('4b46ac11b40d1eb000f3b783968e5f6e_030680ca86151c0ab6c73ebedcfe2a94139b44256d3ee96baccad33e82c8ed8f.webp'),
  heroC: asset('39f12741904bf92bcca637294e9ac2cd_59df6609690c7339300bd0b79f2085fd8e2131449859247809af5b03dd070003.webp'),
  heroD: asset('asdasfsafdsa_a8be20a0ef2fefc947dbd4b9bd1be35a72d27f670d5966392bf4699d7a06d632.webp'),
  // Sección de cotización: imagen 1:1 del slot (media) + fondo de la strip.
  contactSquare: asset('014dd66437318efefd2f5093651a8095_411e0dae564c9c2bcbc16313b873c0a2a2527c74fc24cc1ec28c3209e0c115cf.webp'),
  contactBg: asset('4b46ac11b40d1eb000f3b783968e5f6e (1)_66bd4f8994c0594748120b2c47ce3328e44b86b2b6fee5100fb53f00e796fc0b.webp'),
  // Página "¿Quiénes somos?": fondo del header, imagen de historia (rotada) y 4 espacios.
  quienesHero: asset('sdadsa.webp'),
  historia: asset('f218f6fa3d0a9f70aa70a569c3fd0178_c68abc9ce467a92bc8dcfc2a1e53b4669f86d08eb9d785d3b3f9c1cd77b138df.webp'),
  espacio1: asset('IMG_1022_8e2ab804a9123957e5738fdbf61ca096678d7b1b9f3dea5b17ccc6debd7e5638.webp'),
  espacio2: asset('IMG_1129_30ac7481794a960f354ab587827b593493f819fc4212fa563ebf71afb446abfd.webp'),
  espacio3: asset('IMG_1097_48e31ae655be33dc15914ccc972c4fcfcf3dbb644084ce9e47fb5710322d2729.webp'),
  espacio4: asset('IMG_1070_63b6a30201f927711d4719032efc647c8569bc855b14dfaf4b768df729b1b055.webp'),
  // Página de contacto: imagen de la tercera columna (cover, alineada a la derecha).
  contactoMedia: asset('41fa33678e06952828722bc789207eb2_4ccf5d22a192aca0e84961a1e47aa77bb4d67fb759a47b92480b93c4a04a4189.webp'),
  generated1: asset('ChatGPT Image 25 jun 2026, 05_03_50 p.m._49abd36a06ea980205d78b5cae497385743a15730d75e73e537b4eb7674e948a.webp'),
  generated2: asset('ChatGPT Image 25 jun 2026, 05_32_37 p.m._ab2a7d7e3c58c9dd60e6c44cc1a287623ebc82075fe56c904a20e7c27acba829.webp'),
  heroInterior: asset('modern-interior-with-couch-plants-and-wood-panel-2026-03-09-21-50-20-utc_80fc9528189fce79051cffc54a5a12f5cdbf64927323f828480e9b421219bf0d.webp'),
  woodenPlanks: asset('wooden-planks-background-with-natural-grain-textur-2026-01-08-07-01-39-utc_8719bcdbe73874f315245989ea251d99af2c6912780a17a0e9ad74d5029e0882.webp'),
} as const;

// ─── Tablas ──────────────────────────────────────────────────────────────────────
export const TABLES = {
  table1: asset('table1_4a98bd40c7855e0db3727633e305dfef967db118ff9d08e5bab8c91274a8272f.webp'),
  table2: asset('table2_5be16caa296e127bbe4255cc4df8497876fb7ba195f09190ca97454c5287e1ad.webp'),
  table3: asset('table3_67e49c481244d707cad3804e2d8062f33a0cf5c294b664d7c476d9f2680669e4.webp'),
  table4: asset('table4_d87ba7c8281040e8629bc013db6770edf9fd80f007b24e9ac6ee7313b0494019.webp'),
} as const;
