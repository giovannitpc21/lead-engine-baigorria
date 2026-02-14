import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lead, LeadType, LeadStatus } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export const useLeads = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear un nuevo lead
  const createLead = useCallback(async (leadData: Partial<Lead>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          status: 'nuevo',
          source: leadData.source || 'web',
        } as AnyRecord)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Crear evento para webhook
      await supabase.from('webhook_events').insert({
        event_type: 'lead.created',
        payload: data as AnyRecord,
        processed: false,
      } as AnyRecord);

      return { success: true, data: data as Lead };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear lead';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener leads con filtros
  const getLeads = useCallback(async (filters?: {
    type?: LeadType;
    status?: LeadStatus;
    advisorId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.advisorId) {
        query = query.eq('assigned_advisor_id', filters.advisorId);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      return { success: true, data: (data || []) as Lead[] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener leads';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar lead
  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        } as AnyRecord)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // Crear evento para webhook
      await supabase.from('webhook_events').insert({
        event_type: 'lead.updated',
        payload: data as AnyRecord,
        processed: false,
      } as AnyRecord);

      return { success: true, data: data as Lead };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar lead';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Asignar asesor (round-robin simple)
  const assignAdvisor = useCallback(async (leadId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener asesor activo con menor cantidad de leads
      const { data: advisors, error: advisorsError } = await supabase
        .from('advisors')
        .select('*')
        .eq('activo', true)
        .order('leads_count', { ascending: true })
        .limit(1);

      if (advisorsError) throw advisorsError;
      if (!advisors || advisors.length === 0) {
        throw new Error('No hay asesores activos disponibles');
      }

      const advisor = advisors[0] as AnyRecord;

      // Asignar lead y actualizar contador
      await supabase
        .from('leads')
        .update({ assigned_advisor_id: advisor.id } as AnyRecord)
        .eq('id', leadId);

      // Incrementar contador de leads del asesor
      await supabase
        .from('advisors')
        .update({ leads_count: (advisor.leads_count || 0) + 1 } as AnyRecord)
        .eq('id', advisor.id);

      return { success: true, advisor };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al asignar asesor';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Exportar a CSV
  const exportToCSV = useCallback((leads: Lead[]) => {
    const headers = [
      'ID',
      'Fecha',
      'Tipo',
      'Estado',
      'Nombre',
      'Apellido',
      'Email',
      'Teléfono',
      'WhatsApp',
      'Tipo Propiedad',
      'Dirección',
      'Departamento',
      'Barrio',
      'Mensaje',
      'Asesor Asignado',
    ];

    const rows = leads.map(lead => [
      lead.id,
      lead.created_at,
      lead.type,
      lead.status,
      lead.nombre,
      lead.apellido,
      lead.email,
      lead.telefono,
      lead.whatsapp || '',
      lead.tipo_propiedad || '',
      lead.direccion || '',
      lead.departamento || '',
      lead.barrio || '',
      lead.mensaje || '',
      lead.assigned_advisor_id || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, []);

  return {
    loading,
    error,
    createLead,
    getLeads,
    updateLead,
    assignAdvisor,
    exportToCSV,
  };
};
