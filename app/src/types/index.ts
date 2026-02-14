// Tipos de leads
export type LeadType = 'vender' | 'comprar' | 'alquilar' | 'administracion' | 'contacto' | 'trabaja-con-nosotros' | 'tasacion';
export type LeadStatus = 'nuevo' | 'contactado' | 'en-proceso' | 'cerrado' | 'descartado';

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  type: LeadType;
  status: LeadStatus;
  
  // Datos de contacto
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  whatsapp?: string;
  
  // Datos específicos por tipo
  // Vender / Tasación
  tipo_propiedad?: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'galpon';
  direccion?: string;
  departamento?: string;
  barrio?: string;
  metros_cubiertos?: number;
  metros_totales?: number;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  estado?: 'nuevo' | 'bueno' | 'regular' | 'a-renovar';
  extras?: string[];
  
  // Comprar / Alquilar
  presupuesto_min?: number;
  presupuesto_max?: number;
  zona_preferida?: string;
  
  // Trabaja con nosotros
  experiencia?: string;
  mensaje?: string;
  cv_url?: string;
  
  // Asignación
  assigned_advisor_id?: string;
  property_id?: string;
  
  // Metadata
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ip_address?: string;
  user_agent?: string;
}

// Asesores
export interface Advisor {
  id: string;
  created_at: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  whatsapp: string;
  foto_url?: string;
  especialidad?: string;
  zonas?: string[];
  activo: boolean;
  orden: number; // Para round-robin
  leads_count: number;
}

// Propiedades
export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Básicos
  titulo: string;
  descripcion: string;
  tipo: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'galpon';
  operacion: 'venta' | 'alquiler' | 'alquiler-temporal';
  
  // Ubicación
  direccion: string;
  departamento: string;
  barrio: string;
  lat?: number;
  lng?: number;
  
  // Características
  precio: number;
  moneda: 'ARS' | 'USD';
  metros_cubiertos: number;
  metros_totales?: number;
  ambientes: number;
  dormitorios: number;
  banos: number;
  estado: string;
  
  // Extras
  garage: boolean;
  patio: boolean;
  pileta: boolean;
  extras: string[];
  
  // Imágenes (URLs externas en MVP)
  imagenes: string[];
  imagen_principal?: string;
  
  // Asesor asignado
  advisor_id: string;
  
  // Estado
  activa: boolean;
  destacada: boolean;
  fecha_publicacion: string;
}

// Reglas de tasación
export interface ValuationRule {
  id: string;
  created_at: string;
  tipo_propiedad: string;
  departamento: string;
  precio_m2_cubierto: number;
  precio_m2_terreno: number;
  multiplicador_estado: {
    nuevo: number;
    bueno: number;
    regular: number;
    'a-renovar': number;
  };
  multiplicador_extras: {
    garage: number;
    patio: number;
    pileta: number;
  };
  activo: boolean;
}

// Valuaciones
export interface Valuation {
  id: string;
  created_at: string;
  tipo_propiedad: string;
  departamento: string;
  barrio?: string;
  metros_cubiertos: number;
  metros_totales?: number;
  dormitorios?: number;
  banos?: number;
  estado: string;
  extras: string[];
  valor_minimo: number;
  valor_maximo: number;
  valor_estimado: number;
  moneda: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  lead_id?: string;
}

// Eventos para webhooks
export interface WebhookEvent {
  id: string;
  created_at: string;
  event_type: 'lead.created' | 'lead.updated' | 'property.created' | 'valuation.completed';
  payload: Record<string, unknown>;
  processed: boolean;
  processed_at?: string;
  error?: string;
}

// Auth simple para MVP
export interface AdminSession {
  isAuthenticated: boolean;
  loginTime?: string;
}

// Constantes para páginas SEO
export const DEPARTMENTS = [
  'Ciudad de Mendoza',
  'Godoy Cruz',
  'Guaymallén',
  'Las Heras',
  'Luján de Cuyo',
  'Maipú'
] as const;

export const PROPERTY_TYPES = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'ph', label: 'PH' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'local', label: 'Local Comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'galpon', label: 'Galpón' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'finca', label: 'Finca' },
  { value: 'cochera', label: 'Cochera' }
] as const;