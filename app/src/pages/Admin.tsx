import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { useLeads } from '@/hooks/useLeads';
import { useValuations, type Valuation } from '@/hooks/useValuations';
import { useValuationRules, type ValuationRule } from '@/hooks/useValuationRules';
import { useProperties, type Property, type PropertyInput } from '@/hooks/useProperties';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  LogOut, 
  Download, 
  Users, 
  TrendingUp, 
  Phone, 
  Loader2,
  Search,
  Eye,
  Calculator,
  Settings,
  Plus,
  Trash2,
  Edit,
  Home,
  Star,
  Check,
  BarChart3,
  Webhook
} from 'lucide-react';
import { AdminAnalyticsTab } from '@/components/AdminAnalyticsTab';
import { AdminWebhooksTab } from '@/components/AdminWebhooksTab';
import type { Lead, LeadType, LeadStatus } from '@/types';
import { DEPARTAMENTOS, TIPOS_PROPIEDAD, EXTRAS_PROPIEDAD } from '@/lib/constants';

const TYPE_LABELS: Record<LeadType, string> = {
  vender: 'Vender',
  comprar: 'Comprar',
  alquilar: 'Alquilar',
  administracion: 'Administración',
  contacto: 'Contacto',
  'trabaja-con-nosotros': 'Trabaja con nosotros',
  tasacion: 'Tasación',
};

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  nuevo: { label: 'Nuevo', color: 'bg-blue-100 text-blue-800' },
  contactado: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-800' },
  'en-proceso': { label: 'En proceso', color: 'bg-purple-100 text-purple-800' },
  cerrado: { label: 'Cerrado', color: 'bg-green-100 text-green-800' },
  descartado: { label: 'Descartado', color: 'bg-gray-100 text-gray-800' },
};

const LoginForm = ({ onLogin }: { onLogin: (password: string) => boolean }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    setError(!success);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c9a962] rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Grupo Baigorria</h1>
            <p className="text-gray-500 mt-2">Ingresá tu contraseña para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">Contraseña incorrecta</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#c9a962] hover:bg-[#b8984f] text-black font-semibold"
            >
              Ingresar
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            MVP - Auth simple. En producción usar Supabase Auth.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== LEADS LIST ====================
const LeadsList = () => {
  const { getLeads, exportToCSV, loading } = useLeads();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<{
    type?: LeadType;
    status?: LeadStatus;
    search?: string;
  }>({});

  const loadLeads = async () => {
    const result = await getLeads({
      type: filter.type,
      status: filter.status,
    });
    if (result.success && result.data) {
      setLeads(result.data);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.type, filter.status]);

  const filteredLeads = leads.filter((lead) => {
    if (!filter.search) return true;
    const search = filter.search.toLowerCase();
    return (
      lead.nombre.toLowerCase().includes(search) ||
      lead.apellido.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.telefono.includes(search)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar leads..."
            value={filter.search || ''}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <select
          value={filter.type || ''}
          onChange={(e) => setFilter({ ...filter, type: e.target.value as LeadType || undefined })}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={filter.status || ''}
          onChange={(e) => setFilter({ ...filter, status: e.target.value as LeadStatus || undefined })}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <Button
          variant="outline"
          onClick={() => exportToCSV(filteredLeads)}
          disabled={filteredLeads.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Total leads</p>
            <p className="text-2xl font-bold">{leads.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Nuevos</p>
            <p className="text-2xl font-bold text-blue-600">
              {leads.filter((l) => l.status === 'nuevo').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">En proceso</p>
            <p className="text-2xl font-bold text-purple-600">
              {leads.filter((l) => l.status === 'en-proceso').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Cerrados</p>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter((l) => l.status === 'cerrado').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay leads para mostrar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contacto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(lead.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {lead.nombre} {lead.apellido}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="text-gray-600">{lead.email}</p>
                    <p className="text-gray-500">{lead.telefono}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">
                      {TYPE_LABELS[lead.type] || lead.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_LABELS[lead.status]?.color || 'bg-gray-100'
                    }`}>
                      {STATUS_LABELS[lead.status]?.label || lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== VALUATIONS LIST ====================
const ValuationsList = () => {
  const { getValuations, getValuationStats, exportToCSV, loading } = useValuations();
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<string, { count: number; avg: number }>;
    byDept: Record<string, { count: number; avg: number }>;
  } | null>(null);

  const loadData = async () => {
    const [valResult, statsResult] = await Promise.all([
      getValuations({ limit: 100 }),
      getValuationStats(),
    ]);
    
    if (valResult.success && valResult.data) {
      setValuations(valResult.data);
    }
    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Total valuaciones</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Promedio USD</p>
              <p className="text-2xl font-bold text-[#c9a962]">
                {stats.total > 0 
                  ? Math.round(Object.values(stats.byType).reduce((a, b) => a + b.avg * b.count, 0) / stats.total).toLocaleString()
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => exportToCSV(valuations)}
          disabled={valuations.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
        </div>
      ) : valuations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay valuaciones para mostrar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Propiedad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ubicación</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">M2</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Valor Estimado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {valuations.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(v.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 capitalize">{v.tipo_propiedad}</p>
                    <p className="text-xs text-gray-500">{v.dormitorios} dorm · {v.banos} baños</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {v.departamento}
                    {v.barrio && <span className="text-gray-400"> · {v.barrio}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {v.metros_cubiertos} m²
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#c9a962]">
                      USD {v.valor_estimado.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {v.valor_minimo.toLocaleString()} - {v.valor_maximo.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {v.nombre ? (
                      <>
                        <p className="text-gray-600">{v.nombre} {v.apellido}</p>
                        <p className="text-gray-500">{v.telefono}</p>
                      </>
                    ) : (
                      <span className="text-gray-400">Sin contacto</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== VALUATION RULES ====================
const ValuationRulesManager = () => {
  const { getRules, createRule, updateRule, deleteRule, loading } = useValuationRules();
  const [rules, setRules] = useState<ValuationRule[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ValuationRule | null>(null);
  const [formData, setFormData] = useState({
    tipo_propiedad: '',
    departamento: '',
    precio_m2_cubierto: '',
    precio_m2_terreno: '',
  });

  const loadRules = async () => {
    const result = await getRules();
    if (result.success && result.data) {
      setRules(result.data);
    }
  };

  useEffect(() => {
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      tipo_propiedad: formData.tipo_propiedad,
      departamento: formData.departamento,
      precio_m2_cubierto: parseFloat(formData.precio_m2_cubierto),
      precio_m2_terreno: formData.precio_m2_terreno ? parseFloat(formData.precio_m2_terreno) : undefined,
    };

    if (editingRule) {
      await updateRule(editingRule.id, data);
    } else {
      await createRule(data);
    }

    setIsDialogOpen(false);
    setEditingRule(null);
    setFormData({ tipo_propiedad: '', departamento: '', precio_m2_cubierto: '', precio_m2_terreno: '' });
    loadRules();
  };

  const handleEdit = (rule: ValuationRule) => {
    setEditingRule(rule);
    setFormData({
      tipo_propiedad: rule.tipo_propiedad,
      departamento: rule.departamento,
      precio_m2_cubierto: rule.precio_m2_cubierto.toString(),
      precio_m2_terreno: rule.precio_m2_terreno?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta regla?')) {
      await deleteRule(id);
      loadRules();
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          {rules.length} reglas configuradas
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#c9a962] hover:bg-[#b8984f] text-black"
              onClick={() => {
                setEditingRule(null);
                setFormData({ tipo_propiedad: '', departamento: '', precio_m2_cubierto: '', precio_m2_terreno: '' });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva regla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Editar regla' : 'Nueva regla de valoración'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tipo de propiedad</Label>
                <select
                  value={formData.tipo_propiedad}
                  onChange={(e) => setFormData({ ...formData, tipo_propiedad: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Seleccionar</option>
                  {TIPOS_PROPIEDAD.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Departamento</Label>
                <select
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Seleccionar</option>
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Precio por m² cubierto (USD)</Label>
                <Input
                  type="number"
                  value={formData.precio_m2_cubierto}
                  onChange={(e) => setFormData({ ...formData, precio_m2_cubierto: e.target.value })}
                  placeholder="Ej: 1200"
                  required
                />
              </div>
              <div>
                <Label>Precio por m² de terreno (USD, opcional)</Label>
                <Input
                  type="number"
                  value={formData.precio_m2_terreno}
                  onChange={(e) => setFormData({ ...formData, precio_m2_terreno: e.target.value })}
                  placeholder="Ej: 400"
                />
              </div>
              <Button type="submit" className="w-full bg-[#c9a962] hover:bg-[#b8984f] text-black">
                {editingRule ? 'Guardar cambios' : 'Crear regla'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
        </div>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay reglas configuradas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Departamento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio m² cubierto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio m² terreno</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm capitalize">{rule.tipo_propiedad}</td>
                  <td className="px-4 py-3 text-sm">{rule.departamento}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    USD {rule.precio_m2_cubierto.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {rule.precio_m2_terreno 
                      ? `USD ${rule.precio_m2_terreno.toLocaleString()}` 
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={rule.activo ? 'default' : 'secondary'}>
                      {rule.activo ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== PROPERTIES MANAGER ====================
const PropertiesManager = () => {
  const { getProperties, getStats, createProperty, updateProperty, deleteProperty, toggleDestacada, loading } = useProperties();
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    activas: number;
    destacadas: number;
    promedioPrecio: number;
    porTipo: Record<string, number>;
    porOperacion: Record<string, number>;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyInput>>({
    titulo: '',
    descripcion: '',
    tipo: 'casa',
    operacion: 'venta',
    direccion: '',
    departamento: '',
    barrio: '',
    precio: 0,
    moneda: 'USD',
    metros_cubiertos: 0,
    metros_totales: 0,
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    estado: 'bueno',
    garage: false,
    patio: false,
    pileta: false,
    extras: [],
    imagenes: [],
    imagen_principal: '',
    advisor_id: '',
    activa: true,
    destacada: false,
  });

  const loadData = async () => {
    const [propResult, statsResult] = await Promise.all([
      getProperties({ limit: 100 }),
      getStats(),
    ]);
    
    if (propResult.success && propResult.data) {
      setProperties(propResult.data);
    }
    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProperty) {
      await updateProperty(editingProperty.id, formData);
    } else {
      await createProperty(formData as PropertyInput);
    }

    setIsDialogOpen(false);
    setEditingProperty(null);
    resetForm();
    loadData();
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'casa',
      operacion: 'venta',
      direccion: '',
      departamento: '',
      barrio: '',
      precio: 0,
      moneda: 'USD',
      metros_cubiertos: 0,
      metros_totales: 0,
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      estado: 'bueno',
      garage: false,
      patio: false,
      pileta: false,
      extras: [],
      imagenes: [],
      imagen_principal: '',
      advisor_id: '',
      activa: true,
      destacada: false,
    });
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      titulo: property.titulo,
      descripcion: property.descripcion,
      tipo: property.tipo,
      operacion: property.operacion,
      direccion: property.direccion,
      departamento: property.departamento,
      barrio: property.barrio,
      precio: property.precio,
      moneda: property.moneda,
      metros_cubiertos: property.metros_cubiertos,
      metros_totales: property.metros_totales,
      ambientes: property.ambientes,
      dormitorios: property.dormitorios,
      banos: property.banos,
      estado: property.estado,
      garage: property.garage,
      patio: property.patio,
      pileta: property.pileta,
      extras: property.extras,
      imagenes: property.imagenes,
      imagen_principal: property.imagen_principal,
      advisor_id: property.advisor_id,
      activa: property.activa,
      destacada: property.destacada,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
      await deleteProperty(id);
      loadData();
    }
  };

  const toggleExtra = (extra: string) => {
    const currentExtras = formData.extras || [];
    setFormData({
      ...formData,
      extras: currentExtras.includes(extra)
        ? currentExtras.filter((e) => e !== extra)
        : [...currentExtras, extra],
    });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Activas</p>
              <p className="text-2xl font-bold text-green-600">{stats.activas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Destacadas</p>
              <p className="text-2xl font-bold text-[#c9a962]">{stats.destacadas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Venta</p>
              <p className="text-2xl font-bold">{stats.porOperacion.venta || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Alquiler</p>
              <p className="text-2xl font-bold">{stats.porOperacion.alquiler || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          {properties.length} propiedades mostradas
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#c9a962] hover:bg-[#b8984f] text-black"
              onClick={() => {
                setEditingProperty(null);
                resetForm();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva propiedad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProperty ? 'Editar propiedad' : 'Nueva propiedad'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Título</Label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: Casa moderna en Ciudad"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Descripción</Label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción detallada de la propiedad..."
                    className="w-full border rounded-md px-3 py-2 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Property['tipo'] })}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    {TIPOS_PROPIEDAD.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Operación</Label>
                  <select
                    value={formData.operacion}
                    onChange={(e) => setFormData({ ...formData, operacion: e.target.value as Property['operacion'] })}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                    <option value="alquiler-temporal">Alquiler temporal</option>
                  </select>
                </div>
                <div>
                  <Label>Precio</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                      placeholder="150000"
                      required
                      className="flex-1"
                    />
                    <select
                      value={formData.moneda}
                      onChange={(e) => setFormData({ ...formData, moneda: e.target.value as 'ARS' | 'USD' })}
                      className="border rounded-md px-3 py-2 w-24"
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Asesor ID</Label>
                  <Input
                    value={formData.advisor_id}
                    onChange={(e) => setFormData({ ...formData, advisor_id: e.target.value })}
                    placeholder="UUID del asesor"
                    required
                  />
                </div>
                <div>
                  <Label>Departamento</Label>
                  <select
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Barrio</Label>
                  <Input
                    value={formData.barrio}
                    onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                    placeholder="Ej: Ciudad"
                  />
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Calle Las Heras 1234"
                    required
                  />
                </div>
                <div>
                  <Label>Metros cubiertos</Label>
                  <Input
                    type="number"
                    value={formData.metros_cubiertos}
                    onChange={(e) => setFormData({ ...formData, metros_cubiertos: parseFloat(e.target.value) })}
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <Label>Metros totales</Label>
                  <Input
                    type="number"
                    value={formData.metros_totales}
                    onChange={(e) => setFormData({ ...formData, metros_totales: parseFloat(e.target.value) })}
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label>Ambientes</Label>
                  <Input
                    type="number"
                    value={formData.ambientes}
                    onChange={(e) => setFormData({ ...formData, ambientes: parseInt(e.target.value) })}
                    placeholder="4"
                    required
                  />
                </div>
                <div>
                  <Label>Dormitorios</Label>
                  <Input
                    type="number"
                    value={formData.dormitorios}
                    onChange={(e) => setFormData({ ...formData, dormitorios: parseInt(e.target.value) })}
                    placeholder="3"
                    required
                  />
                </div>
                <div>
                  <Label>Baños</Label>
                  <Input
                    type="number"
                    value={formData.banos}
                    onChange={(e) => setFormData({ ...formData, banos: parseInt(e.target.value) })}
                    placeholder="2"
                    required
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="nuevo">A estrenar</option>
                    <option value="bueno">Buen estado</option>
                    <option value="regular">Regular</option>
                    <option value="a-renovar">Para renovar</option>
                  </select>
                </div>
                <div>
                  <Label>URL Imagen principal</Label>
                  <Input
                    value={formData.imagen_principal}
                    onChange={(e) => setFormData({ ...formData, imagen_principal: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Extras */}
              <div>
                <Label className="mb-2 block">Extras</Label>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS_PROPIEDAD.map((extra) => (
                    <button
                      key={extra.value}
                      type="button"
                      onClick={() => toggleExtra(extra.value)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        (formData.extras || []).includes(extra.value)
                          ? 'bg-[#c9a962] text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {(formData.extras || []).includes(extra.value) && (
                        <Check className="w-3 h-3 inline mr-1" />
                      )}
                      {extra.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                  />
                  <span className="text-sm">Activa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.destacada}
                    onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                  />
                  <span className="text-sm">Destacada</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.garage}
                    onChange={(e) => setFormData({ ...formData, garage: e.target.checked })}
                  />
                  <span className="text-sm">Garage</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.patio}
                    onChange={(e) => setFormData({ ...formData, patio: e.target.checked })}
                  />
                  <span className="text-sm">Patio</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.pileta}
                    onChange={(e) => setFormData({ ...formData, pileta: e.target.checked })}
                  />
                  <span className="text-sm">Pileta</span>
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#c9a962] hover:bg-[#b8984f] text-black">
                {editingProperty ? 'Guardar cambios' : 'Crear propiedad'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay propiedades para mostrar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Propiedad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ubicación</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Asesor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50 ${!p.activa ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    {p.destacada && <Star className="w-4 h-4 text-[#c9a962] fill-[#c9a962]" />}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.titulo}</p>
                    <p className="text-xs text-gray-500 capitalize">{p.tipo} · {p.operacion}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.departamento}
                    {p.barrio && <span className="text-gray-400"> · {p.barrio}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#c9a962]">
                      {p.moneda} {p.precio.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{p.metros_cubiertos} m²</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {p.advisor ? (
                      <>
                        <p className="text-gray-600">{p.advisor.nombre} {p.advisor.apellido}</p>
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.activa && <Badge variant="default" className="text-xs">Activa</Badge>}
                      {p.destacada && <Badge variant="secondary" className="text-xs bg-[#c9a962]">Destacada</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleDestacada(p.id, !p.destacada)}
                      >
                        <Star className={`w-4 h-4 ${p.destacada ? 'text-[#c9a962] fill-[#c9a962]' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN ADMIN ====================
export const Admin = () => {
  const { isAuthenticated, isLoading, login, logout } = useAdmin();
  
  usePageviewTracking('admin', { source: 'direct' });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#c9a962] rounded flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold">Admin Grupo Baigorria</span>
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="leads">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="leads">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="valuations">
              <Calculator className="w-4 h-4 mr-2" />
              Valuaciones
            </TabsTrigger>
            <TabsTrigger value="properties">
              <Home className="w-4 h-4 mr-2" />
              Propiedades
            </TabsTrigger>
            <TabsTrigger value="rules">
              <Settings className="w-4 h-4 mr-2" />
              Reglas
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadsList />
          </TabsContent>

          <TabsContent value="valuations">
            <ValuationsList />
          </TabsContent>

          <TabsContent value="rules">
            <ValuationRulesManager />
          </TabsContent>

          <TabsContent value="properties">
            <PropertiesManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsTab />
          </TabsContent>

          <TabsContent value="webhooks">
            <AdminWebhooksTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};