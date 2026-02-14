import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export interface ValuationRule {
  id: string;
  created_at: string;
  tipo_propiedad: string;
  departamento: string;
  precio_m2_cubierto: number;
  precio_m2_terreno?: number;
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
    parrilla: number;
    aire: number;
    calefaccion: number;
    seguridad: number;
    amenities: number;
  };
  activo: boolean;
}

export interface ValuationRuleInput {
  tipo_propiedad: string;
  departamento: string;
  precio_m2_cubierto: number;
  precio_m2_terreno?: number;
  multiplicador_estado?: {
    nuevo: number;
    bueno: number;
    regular: number;
    'a-renovar': number;
  };
  multiplicador_extras?: {
    garage: number;
    patio: number;
    pileta: number;
    parrilla: number;
    aire: number;
    calefaccion: number;
    seguridad: number;
    amenities: number;
  };
  activo?: boolean;
}

// Multiplicadores por defecto
const DEFAULT_ESTADO_MULTIPLICADORES = {
  nuevo: 1.1,
  bueno: 1.0,
  regular: 0.9,
  'a-renovar': 0.75,
};

const DEFAULT_EXTRAS_MULTIPLICADORES = {
  garage: 1.02,
  patio: 1.02,
  pileta: 1.03,
  parrilla: 1.01,
  aire: 1.01,
  calefaccion: 1.01,
  seguridad: 1.02,
  amenities: 1.02,
};

export const useValuationRules = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las reglas
  const getRules = useCallback(async (filters?: {
    tipo_propiedad?: string;
    departamento?: string;
    activo?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('valuation_rules')
        .select('*')
        .order('departamento', { ascending: true })
        .order('tipo_propiedad', { ascending: true });

      if (filters?.tipo_propiedad) {
        query = query.eq('tipo_propiedad', filters.tipo_propiedad);
      }
      if (filters?.departamento) {
        query = query.eq('departamento', filters.departamento);
      }
      if (filters?.activo !== undefined) {
        query = query.eq('activo', filters.activo);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      return { success: true, data: (data || []) as ValuationRule[] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener reglas';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una regla específica
  const getRule = useCallback(async (tipo_propiedad: string, departamento: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('valuation_rules')
        .select('*')
        .eq('tipo_propiedad', tipo_propiedad)
        .eq('departamento', departamento)
        .eq('activo', true)
        .single();

      if (supabaseError) throw supabaseError;
      return { success: true, data: data as ValuationRule };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener regla';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva regla
  const createRule = useCallback(async (input: ValuationRuleInput) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('valuation_rules')
        .insert({
          ...input,
          multiplicador_estado: input.multiplicador_estado || DEFAULT_ESTADO_MULTIPLICADORES,
          multiplicador_extras: input.multiplicador_extras || DEFAULT_EXTRAS_MULTIPLICADORES,
          activo: input.activo ?? true,
        } as AnyRecord)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      return { success: true, data: data as ValuationRule };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear regla';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar regla
  const updateRule = useCallback(async (id: string, updates: Partial<ValuationRuleInput>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('valuation_rules')
        .update(updates as AnyRecord)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      return { success: true, data: data as ValuationRule };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar regla';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar regla (soft delete)
  const deleteRule = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('valuation_rules')
        .update({ activo: false } as AnyRecord)
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar regla';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular valor usando reglas
  const calculateValue = useCallback(async (
    tipo_propiedad: string,
    departamento: string,
    metros_cubiertos: number,
    estado: string,
    extras: string[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener regla aplicable
      const { data: rule } = await getRule(tipo_propiedad, departamento);

      if (!rule) {
        // Usar valores por defecto si no hay regla específica
        const baseM2 = 1000; // Valor base genérico
        const estadoMult = DEFAULT_ESTADO_MULTIPLICADORES[estado as keyof typeof DEFAULT_ESTADO_MULTIPLICADORES] || 1;
        const extrasMult = 1 + extras.length * 0.02;
        
        const valorBase = metros_cubiertos * baseM2 * estadoMult * extrasMult;
        
        return {
          success: true,
          data: {
            min: Math.round(valorBase * 0.85),
            max: Math.round(valorBase * 1.15),
            estimado: Math.round(valorBase),
            reglaUsada: 'default',
          },
        };
      }

      // Calcular con la regla
      const precioM2 = rule.precio_m2_cubierto || 1000;
      const estadoMult = rule.multiplicador_estado[estado as keyof typeof rule.multiplicador_estado] || 1;
      
      // Calcular multiplicador de extras
      let extrasMult = 1;
      extras.forEach((extra) => {
        const mult = rule.multiplicador_extras[extra as keyof typeof rule.multiplicador_extras];
        if (mult) extrasMult *= mult;
      });

      const valorBase = metros_cubiertos * precioM2 * estadoMult * extrasMult;

      return {
        success: true,
        data: {
          min: Math.round(valorBase * 0.85),
          max: Math.round(valorBase * 1.15),
          estimado: Math.round(valorBase),
          reglaUsada: rule.id,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al calcular valor';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [getRule]);

  return {
    loading,
    error,
    getRules,
    getRule,
    createRule,
    updateRule,
    deleteRule,
    calculateValue,
    DEFAULT_ESTADO_MULTIPLICADORES,
    DEFAULT_EXTRAS_MULTIPLICADORES,
  };
};
