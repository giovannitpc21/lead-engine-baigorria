import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

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

export interface ValuationInput {
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
  moneda?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  lead_id?: string;
}

export const useValuations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear una nueva valuación
  const createValuation = useCallback(async (data: ValuationInput) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .from('valuations')
        .insert({
          ...data,
          moneda: data.moneda || 'USD',
        } as AnyRecord)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // Crear evento webhook
      await supabase.from('webhook_events').insert({
        event_type: 'valuation.completed',
        payload: result as AnyRecord,
        processed: false,
      } as AnyRecord);

      return { success: true, data: result as Valuation };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar valuación';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener valuaciones con filtros
  const getValuations = useCallback(async (filters?: {
    tipo_propiedad?: string;
    departamento?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('valuations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.tipo_propiedad) {
        query = query.eq('tipo_propiedad', filters.tipo_propiedad);
      }
      if (filters?.departamento) {
        query = query.eq('departamento', filters.departamento);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      return { success: true, data: (data || []) as Valuation[] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener valuaciones';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas de valuaciones
  const getValuationStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('valuations')
        .select('tipo_propiedad, departamento, valor_estimado');

      if (supabaseError) throw supabaseError;

      const valuations = (data || []) as Valuation[];
      
      // Calcular promedios por tipo
      const byType: Record<string, { count: number; avg: number }> = {};
      const byDept: Record<string, { count: number; avg: number }> = {};

      valuations.forEach((v) => {
        if (!byType[v.tipo_propiedad]) {
          byType[v.tipo_propiedad] = { count: 0, avg: 0, total: 0 } as { count: number; avg: number; total: number };
        }
        (byType[v.tipo_propiedad] as { count: number; avg: number; total: number }).count++;
        (byType[v.tipo_propiedad] as { count: number; avg: number; total: number }).total += v.valor_estimado;
        (byType[v.tipo_propiedad] as { count: number; avg: number; total: number }).avg = 
          (byType[v.tipo_propiedad] as { count: number; avg: number; total: number }).total / 
          (byType[v.tipo_propiedad] as { count: number; avg: number; total: number }).count;

        if (!byDept[v.departamento]) {
          byDept[v.departamento] = { count: 0, avg: 0, total: 0 } as { count: number; avg: number; total: number };
        }
        (byDept[v.departamento] as { count: number; avg: number; total: number }).count++;
        (byDept[v.departamento] as { count: number; avg: number; total: number }).total += v.valor_estimado;
        (byDept[v.departamento] as { count: number; avg: number; total: number }).avg = 
          (byDept[v.departamento] as { count: number; avg: number; total: number }).total / 
          (byDept[v.departamento] as { count: number; avg: number; total: number }).count;
      });

      // Limpiar propiedad total del resultado
      const cleanByType: Record<string, { count: number; avg: number }> = {};
      const cleanByDept: Record<string, { count: number; avg: number }> = {};

      Object.keys(byType).forEach((k) => {
        cleanByType[k] = { count: byType[k].count, avg: Math.round(byType[k].avg) };
      });
      Object.keys(byDept).forEach((k) => {
        cleanByDept[k] = { count: byDept[k].count, avg: Math.round(byDept[k].avg) };
      });

      return {
        success: true,
        data: {
          total: valuations.length,
          byType: cleanByType,
          byDept: cleanByDept,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Exportar a CSV
  const exportToCSV = useCallback((valuations: Valuation[]) => {
    const headers = [
      'ID',
      'Fecha',
      'Tipo',
      'Departamento',
      'Barrio',
      'M2 Cubiertos',
      'M2 Totales',
      'Dormitorios',
      'Baños',
      'Estado',
      'Extras',
      'Valor Min',
      'Valor Max',
      'Valor Estimado',
      'Moneda',
      'Nombre',
      'Email',
      'Teléfono',
    ];

    const rows = valuations.map((v) => [
      v.id,
      v.created_at,
      v.tipo_propiedad,
      v.departamento,
      v.barrio || '',
      v.metros_cubiertos,
      v.metros_totales || '',
      v.dormitorios || '',
      v.banos || '',
      v.estado,
      (v.extras || []).join(', '),
      v.valor_minimo,
      v.valor_maximo,
      v.valor_estimado,
      v.moneda,
      v.nombre ? `${v.nombre} ${v.apellido || ''}` : '',
      v.email || '',
      v.telefono || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `valuaciones_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, []);

  return {
    loading,
    error,
    createValuation,
    getValuations,
    getValuationStats,
    exportToCSV,
  };
};
