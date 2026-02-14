// Departamentos de Gran Mendoza
export const DEPARTAMENTOS = [
  { value: 'ciudad', label: 'Ciudad de Mendoza' },
  { value: 'godoy-cruz', label: 'Godoy Cruz' },
  { value: 'guaymallen', label: 'Guaymallén' },
  { value: 'las-heras', label: 'Las Heras' },
  { value: 'lujan-de-cuyo', label: 'Luján de Cuyo' },
  { value: 'maipu', label: 'Maipú' },
  { value: 'otro', label: 'Otro / Gran Mendoza' },
];

// Tipos de propiedad
export const TIPOS_PROPIEDAD = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'terreno', label: 'Terreno / Lote' },
  { value: 'local', label: 'Local comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'galpon', label: 'Galpón / Depósito' },
  { value: 'campo', label: 'Campo / Finca' },
  { value: 'ph', label: 'PH / Duplex' },
];

// Estados de propiedad
export const ESTADOS_PROPIEDAD = [
  { value: 'nuevo', label: 'A estrenar' },
  { value: 'bueno', label: 'Buen estado' },
  { value: 'regular', label: 'Regular' },
  { value: 'a-renovar', label: 'Para renovar' },
];

// Extras comunes
export const EXTRAS_PROPIEDAD = [
  { value: 'garage', label: 'Garage / Cochera' },
  { value: 'patio', label: 'Patio / Jardín' },
  { value: 'pileta', label: 'Pileta / Piscina' },
  { value: 'parrilla', label: 'Parrilla' },
  { value: 'aire', label: 'Aire acondicionado' },
  { value: 'calefaccion', label: 'Calefacción' },
  { value: 'seguridad', label: 'Seguridad 24hs' },
  { value: 'amenities', label: 'Amenities' },
];

// Contactos
export const CONTACTOS = {
  c21: {
    nombre: 'Century 21 Baigorria',
    telefono: '+54 9 261 716 6129',
    whatsapp: '5492617166129',
    email: 'info@c21baigorria.com',
    direccion: 'Gran Mendoza, Argentina',
  },
  aproam: {
    nombre: 'APROAM',
    telefono: '+54 9 261 390 7452',
    whatsapp: '5492613907452',
    email: 'info@aproam.com.ar',
    direccion: 'Gran Mendoza, Argentina',
  },
};

// SEO Keywords
export const SEO_KEYWORDS = {
  home: 'Grupo Baigorria, Century 21 Mendoza, APROAM, inmobiliaria Gran Mendoza',
  vender: 'vender casa Mendoza, tasación online Mendoza, vender departamento Godoy Cruz',
  comprar: 'casas en venta Mendoza, departamentos en venta Gran Mendoza, inmuebles Luján de Cuyo',
  alquilar: 'alquileres Mendoza, administración de propiedades, APROAM alquileres',
  tasador: 'tasación online Mendoza, valor propiedad Mendoza, precio m2 Mendoza',
};

// Navigation
export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/vender', label: 'Vender' },
  { href: '/comprar', label: 'Comprar' },
  { href: '/alquilar', label: 'Alquilar' },
  { href: '/tasador', label: 'Tasador' },
  { href: '/contacto', label: 'Contacto' },
];
