export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Simplified Database type for MVP
// Using any for inserts to avoid TypeScript complexity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;

// Table row types for reference
export interface LeadRow {
  id: string;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  whatsapp: string | null;
  tipo_propiedad: string | null;
  direccion: string | null;
  departamento: string | null;
  barrio: string | null;
  metros_cubiertos: number | null;
  metros_totales: number | null;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  estado: string | null;
  extras: string[] | null;
  presupuesto_min: number | null;
  presupuesto_max: number | null;
  zona_preferida: string | null;
  experiencia: string | null;
  mensaje: string | null;
  cv_url: string | null;
  assigned_advisor_id: string | null;
  property_id: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface AdvisorRow {
  id: string;
  created_at: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  whatsapp: string;
  foto_url: string | null;
  especialidad: string | null;
  zonas: string[] | null;
  activo: boolean;
  orden: number;
  leads_count: number;
}

export interface PropertyRow {
  id: string;
  created_at: string;
  updated_at: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  operacion: string;
  direccion: string;
  departamento: string;
  barrio: string;
  lat: number | null;
  lng: number | null;
  precio: number;
  moneda: string;
  metros_cubiertos: number;
  metros_totales: number | null;
  ambientes: number;
  dormitorios: number;
  banos: number;
  estado: string;
  garage: boolean;
  patio: boolean;
  pileta: boolean;
  extras: string[];
  imagenes: string[];
  imagen_principal: string | null;
  advisor_id: string;
  activa: boolean;
  destacada: boolean;
  fecha_publicacion: string;
}

export interface WebhookEventRow {
  id: string;
  created_at: string;
  event_type: string;
  payload: Json;
  processed: boolean;
  processed_at: string | null;
  error: string | null;
}
