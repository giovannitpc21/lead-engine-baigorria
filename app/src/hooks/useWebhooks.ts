import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  isActive: boolean;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventType: string;
  payload: Record<string, any>;
  responseStatus?: number;
  responseBody?: string;
  attempts: number;
  deliveredAt?: string;
  createdAt: string;
}

export const useWebhooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las configuraciones de webhooks
  const getWebhookConfigs = useCallback(async (): Promise<WebhookConfig[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('webhook_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        url: item.url,
        events: item.events || [],
        headers: item.headers || {},
        isActive: item.is_active,
        retryCount: item.retry_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva configuración de webhook
  const createWebhookConfig = useCallback(async (config: Omit<WebhookConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('webhook_configurations')
        .insert({
          name: config.name,
          url: config.url,
          events: config.events,
          headers: config.headers,
          is_active: config.isActive,
          retry_count: config.retryCount
        });

      if (supabaseError) throw supabaseError;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar configuración de webhook
  const updateWebhookConfig = useCallback(async (id: string, updates: Partial<WebhookConfig>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('webhook_configurations')
        .update({
          name: updates.name,
          url: updates.url,
          events: updates.events,
          headers: updates.headers,
          is_active: updates.isActive,
          retry_count: updates.retryCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar configuración de webhook
  const deleteWebhookConfig = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('webhook_configurations')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener deliveries de un webhook
  const getWebhookDeliveries = useCallback(async (webhookId?: string): Promise<WebhookDelivery[]> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('webhook_deliveries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (webhookId) {
        query = query.eq('webhook_id', webhookId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      return (data || []).map(item => ({
        id: item.id,
        webhookId: item.webhook_id,
        eventType: item.event_type,
        payload: item.payload,
        responseStatus: item.response_status,
        responseBody: item.response_body,
        attempts: item.attempts,
        deliveredAt: item.delivered_at,
        createdAt: item.created_at
      }));
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Probar webhook manualmente
  const testWebhook = useCallback(async (webhookId: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Obtener configuración del webhook
      const { data: config, error: configError } = await supabase
        .from('webhook_configurations')
        .select('*')
        .eq('id', webhookId)
        .single();

      if (configError || !config) {
        return { success: false, message: 'Webhook no encontrado' };
      }

      // Payload de prueba
      const testPayload = {
        event: 'test.webhook',
        timestamp: new Date().toISOString(),
        data: {
          message: 'Este es un evento de prueba',
          source: 'Grupo Baigorria Lead Engine'
        }
      };

      // Intentar enviar
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Test': 'true',
          ...config.headers
        },
        body: JSON.stringify(testPayload)
      });

      // Registrar el intento
      await supabase.from('webhook_deliveries').insert({
        webhook_id: webhookId,
        event_type: 'test.webhook',
        payload: testPayload,
        response_status: response.status,
        response_body: await response.text(),
        attempts: 1,
        delivered_at: response.ok ? new Date().toISOString() : null
      });

      if (response.ok) {
        return { success: true, message: `Webhook respondió con status ${response.status}` };
      } else {
        return { success: false, message: `Error: Status ${response.status}` };
      }
    } catch (err: any) {
      const message = err.message || 'Error desconocido';
      
      // Registrar el error
      await supabase.from('webhook_deliveries').insert({
        webhook_id: webhookId,
        event_type: 'test.webhook',
        payload: { error: true },
        response_status: 0,
        response_body: message,
        attempts: 1
      });

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getWebhookConfigs,
    createWebhookConfig,
    updateWebhookConfig,
    deleteWebhookConfig,
    getWebhookDeliveries,
    testWebhook
  };
};
