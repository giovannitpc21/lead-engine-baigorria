import { useState, useEffect } from 'react';
import { Webhook, Plus, Edit2, Trash2, TestTube, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useWebhooks, type WebhookConfig } from '@/hooks/useWebhooks';

const EVENT_TYPES = [
  'lead.created',
  'lead.updated',
  'lead.assigned',
  'valuation.completed',
  'conversion',
  'test.webhook'
];

interface WebhookDelivery {
  responseStatus?: number;
  deliveredAt?: string;
  eventType: string;
  createdAt: string;
}

export const AdminWebhooksTab = () => {
  const {
    getWebhookConfigs,
    createWebhookConfig,
    updateWebhookConfig,
    deleteWebhookConfig,
    getWebhookDeliveries,
    testWebhook
  } = useWebhooks();

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; result: { success: boolean; message: string } } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    isActive: true,
    retryCount: 3,
    headers: {} as Record<string, string>
  });

  useEffect(() => {
    const loadData = async () => {
      const configs = await getWebhookConfigs();
      setWebhooks(configs);
      const dels = await getWebhookDeliveries();
      setDeliveries(dels);
    };
    
    loadData();
  }, [getWebhookConfigs, getWebhookDeliveries]);

  const loadData = async () => {
    const configs = await getWebhookConfigs();
    setWebhooks(configs);
    const dels = await getWebhookDeliveries();
    setDeliveries(dels);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingWebhook) {
      await updateWebhookConfig(editingWebhook.id, formData);
    } else {
      await createWebhookConfig(formData);
    }
    
    setShowForm(false);
    setEditingWebhook(null);
    setFormData({ name: '', url: '', events: [], isActive: true, retryCount: 3, headers: {} });
    loadData();
  };

  const handleEdit = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      retryCount: webhook.retryCount,
      headers: webhook.headers
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este webhook?')) {
      await deleteWebhookConfig(id);
      loadData();
    }
  };

  const handleTest = async (webhook: WebhookConfig) => {
    setTestResult({ id: webhook.id, result: { success: false, message: 'Enviando...' } });
    const result = await testWebhook(webhook.id);
    setTestResult({ id: webhook.id, result });
    loadData();
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Webhooks</h2>
          <p className="text-sm text-gray-500">
            Configura endpoints para integraciones con n8n, Zapier, Make y otros servicios.
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#c9a962] hover:bg-[#b8984f] text-black"
              onClick={() => {
                setEditingWebhook(null);
                setFormData({ name: '', url: '', events: [], isActive: true, retryCount: 3, headers: {} });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? 'Editar Webhook' : 'Nuevo Webhook'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: n8n - Leads"
                  required
                />
              </div>
              <div>
                <Label>URL del endpoint</Label>
                <Input
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://n8n.tudominio.com/webhook/xxx"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 block">Eventos a escuchar</Label>
                <div className="space-y-2">
                  {EVENT_TYPES.map(event => (
                    <label key={event} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="rounded border-gray-300"
                      />
                      <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{event}</code>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label className="cursor-pointer">Activo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Reintentos:</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.retryCount}
                    onChange={e => setFormData({ ...formData, retryCount: parseInt(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black">
                  {editingWebhook ? 'Guardar cambios' : 'Crear webhook'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Webhook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay webhooks configurados</p>
              <p className="text-sm text-gray-400 mt-1">
                Creá tu primer webhook para integrar con n8n, Zapier o Make
              </p>
            </CardContent>
          </Card>
        ) : (
          webhooks.map(webhook => (
            <Card key={webhook.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                      <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                        {webhook.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">
                      {webhook.url}
                    </code>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(webhook)}
                      disabled={testResult?.id === webhook.id && testResult.result.message === 'Enviando...'}
                    >
                      <TestTube className="w-4 h-4 mr-1" />
                      Probar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(webhook)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(webhook.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                {testResult?.id === webhook.id && (
                  <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                    testResult.result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {testResult.result.success ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">{testResult.result.message}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Entregas recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay entregas registradas</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-auto">
              {deliveries.slice(0, 20).map((delivery, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {(delivery.responseStatus ?? 0) >= 200 && (delivery.responseStatus ?? 0) < 300 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : delivery.deliveredAt ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <code className="text-sm bg-gray-200 px-2 py-0.5 rounded">{delivery.eventType}</code>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(delivery.createdAt).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={(delivery.responseStatus ?? 0) >= 200 && (delivery.responseStatus ?? 0) < 300 ? 'default' : 'destructive'}>
                    {delivery.responseStatus || 'Error'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Guía de integración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">n8n (recomendado)</h4>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Creá un workflow en n8n con trigger "Webhook"</li>
                <li>Copiá la URL del webhook de n8n</li>
                <li>Creá un webhook en esta sección con esa URL</li>
                <li>Seleccioná los eventos que querés recibir</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Zapier</h4>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Creá un Zap con trigger "Webhooks by Zapier"</li>
                <li>Seleccioná "Catch Hook"</li>
                <li>Copiá la URL y creá el webhook acá</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Make (Integromat)</h4>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Creá un scenario con módulo "Webhooks"</li>
                <li>Seleccioná "Custom webhook"</li>
                <li>Copiá la URL y creá el webhook acá</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};