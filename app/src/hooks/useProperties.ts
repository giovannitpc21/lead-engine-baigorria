import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'galpon' | 'campo' | 'ph';
export type PropertyOperation = 'venta' | 'alquiler' | 'alquiler-temporal';

export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  titulo: string;
  descripcion: string;
  tipo: PropertyType;
  operacion: PropertyOperation;
  direccion: string;
  departamento: string;
  barrio: string;
  lat?: number;
  lng?: number;
  precio: number;
  moneda: 'ARS' | 'USD';
  metros_cubiertos: number;
  metros_totales?: number;
  ambientes: number;
  dormitorios: number;
  banos: number;
  estado: string;
  garage: boolean;
  patio: boolean;
  pileta: boolean;
  extras: string[];
  imagenes: string[];
  imagen_principal?: string;
  advisor_id: string;
  activa: boolean;
  destacada: boolean;
  fecha_publicacion: string;
  
  // Join con advisors
  advisor?: {
    id: string;
    nombre: string;
    apellido: string;
    whatsapp: string;
    telefono: string;
    email: string;
    foto_url?: string;
  };
}

export interface PropertyInput {
  titulo: string;
  descripcion: string;
  tipo: PropertyType;
  operacion: PropertyOperation;
  direccion: string;
  departamento: string;
  barrio: string;
  lat?: number;
  lng?: number;
  precio: number;
  moneda?: 'ARS' | 'USD';
  metros_cubiertos: number;
  metros_totales?: number;
  ambientes: number;
  dormitorios: number;
  banos: number;
  estado?: string;
  garage?: boolean;
  patio?: boolean;
  pileta?: boolean;
  extras?: string[];
  imagenes?: string[];
  imagen_principal?: string;
  advisor_id: string;
  activa?: boolean;
  destacada?: boolean;
}

export const useProperties = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear propiedad
  const createProperty = useCallback(async (data: PropertyInput) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .from('properties')
        .insert({
          ...data,
          moneda: data.moneda || 'USD',
          activa: data.activa ?? true,
          destacada: data.destacada ?? false,
          fecha_publicacion: new Date().toISOString().split('T')[0],
        } as AnyRecord)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // Crear evento webhook
      await supabase.from('webhook_events').insert({
        event_type: 'property.created',
        payload: result as AnyRecord,
        processed: false,
      } as AnyRecord);

      return { success: true, data: result as Property };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear propiedad';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener propiedades con filtros
  const getProperties = useCallback(async (filters?: {
    tipo?: PropertyType;
    operacion?: PropertyOperation;
    departamento?: string;
    barrio?: string;
    precioMin?: number;
    precioMax?: number;
    activa?: boolean;
    destacada?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          advisor:advisor_id (
            id,
            nombre,
            apellido,
            whatsapp,
            telefono,
            email,
            foto_url
          )
        `)
        .order('destacada', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.tipo) query = query.eq('tipo', filters.tipo);
      if (filters?.operacion) query = query.eq('operacion', filters.operacion);
      if (filters?.departamento) query = query.eq('departamento', filters.departamento);
      if (filters?.barrio) query = query.ilike('barrio', `%${filters.barrio}%`);
      if (filters?.precioMin) query = query.gte('precio', filters.precioMin);
      if (filters?.precioMax) query = query.lte('precio', filters.precioMax);
      if (filters?.activa !== undefined) query = query.eq('activa', filters.activa);
      if (filters?.destacada) query = query.eq('destacada', true);
      if (filters?.limit) query = query.limit(filters.limit);
      if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      return { success: true, data: (data || []) as Property[] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener propiedades';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una propiedad por ID
  const getProperty = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select(`
          *,
          advisor:advisor_id (
            id,
            nombre,
            apellido,
            whatsapp,
            telefono,
            email,
            foto_url
          )
        `)
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      return { success: true, data: data as Property };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener propiedad';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar propiedad
  const updateProperty = useCallback(async (id: string, updates: Partial<PropertyInput>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        } as AnyRecord)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // Crear evento webhook
      await supabase.from('webhook_events').insert({
        event_type: 'property.updated',
        payload: data as AnyRecord,
        processed: false,
      } as AnyRecord);

      return { success: true, data: data as Property };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar propiedad';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar propiedad (soft delete)
  const deleteProperty = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('properties')
        .update({ activa: false } as AnyRecord)
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar propiedad';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle destacada
  const toggleDestacada = useCallback(async (id: string, destacada: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .update({ destacada } as AnyRecord)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      return { success: true, data: data as Property };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas
  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select('tipo, operacion, precio, activa, destacada');

      if (supabaseError) throw supabaseError;

      const properties = (data || []) as Property[];
      
      const stats = {
        total: properties.length,
        activas: properties.filter((p) => p.activa).length,
        destacadas: properties.filter((p) => p.destacada).length,
        porTipo: {} as Record<string, number>,
        porOperacion: {} as Record<string, number>,
        promedioPrecio: properties.length > 0 
          ? Math.round(properties.reduce((a, b) => a + b.precio, 0) / properties.length)
          : 0,
      };

      properties.forEach((p) => {
        stats.porTipo[p.tipo] = (stats.porTipo[p.tipo] || 0) + 1;
        stats.porOperacion[p.operacion] = (stats.porOperacion[p.operacion] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty,
    toggleDestacada,
    getStats,
  };
};
