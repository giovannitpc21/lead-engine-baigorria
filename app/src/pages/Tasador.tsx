import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  Home, 
  MapPin,
  Warehouse,
  TreePine,
  Store,
  Check, 
  ArrowRight,
  ArrowLeft,
  Calculator,
  Phone,
  TrendingUp,
  Loader2,
  Car,
  Droplets,
  Flame,
  Share2,
  Download
} from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { DEPARTAMENTOS, ESTADOS_PROPIEDAD } from '@/lib/constants';
import { useValuations } from '@/hooks/useValuations';
import { useLeads } from '@/hooks/useLeads';
import { useRateLimit, RATE_LIMITS } from '@/lib/rateLimiter';
import { sanitizeFormData } from '@/lib/sanitize';
import { HCaptchaWrapper } from '@/components/HCaptchaWrapper';

// Tipos de propiedad con iconos y colores
const PROPERTY_TYPES = [
  { id: 'casa', name: 'Casa / Departamento / PH', icon: Home, color: 'bg-blue-500' },
  { id: 'terreno', name: 'Terreno / Lote', icon: MapPin, color: 'bg-green-500' },
  { id: 'galpon', name: 'Galpón / Depósito', icon: Warehouse, color: 'bg-orange-500' },
  { id: 'campo', name: 'Finca / Campo', icon: TreePine, color: 'bg-emerald-500' },
  { id: 'local', name: 'Local Comercial / Oficina', icon: Store, color: 'bg-purple-500' },
];

// Subtipos de casa
const CASA_SUBTIPOS = ['Casa', 'Departamento', 'PH (Propiedad Horizontal)'];

// Servicios para terrenos
const SERVICIOS_TERRENO = ['Agua', 'Luz', 'Gas', 'Cloacas'];

// Zonificaciones
const ZONIFICACIONES = ['Residencial', 'Comercial', 'Industrial', 'Rural', 'Mixta'];

// Amenities para departamentos
const AMENITIES_DEPTO = ['Gimnasio', 'Pileta', 'SUM', 'Seguridad 24hs', 'Lavadero', 'Cocheras'];

interface FormData {
  propertyType: string;
  // Ubicación (todos)
  departamento: string;
  barrio: string;
  // Casa/Depto/PH
  casaSubtipo?: string;
  metrosCubiertos?: string;
  metrosTotales?: string;
  ambientes?: string;
  dormitorios?: string;
  banos?: string;
  estado?: string;
  garage?: boolean;
  patio?: boolean;
  patioMetros?: string;
  pileta?: boolean;
  quincho?: boolean;
  parrilla?: boolean;
  // Extras departamento
  piso?: string;
  isPenthouse?: boolean;
  amenities?: string[];
  // Terreno
  servicios?: string[];
  subdividido?: boolean;
  zonificacion?: string;
  // Galpón
  alturaLibre?: string;
  oficinas?: boolean;
  accesoCaniones?: boolean;
  // Finca/Campo
  hectareas?: string;
  viviendaMetros?: string;
  pozoAgua?: boolean;
  produccion?: string;
  // Local/Oficina
  pieCalleAltura?: string;
  vidriera?: boolean;
  // Contacto
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  notas?: string;
}

interface ValuationResult {
  valorBase: number;
  multiplicadores: { concepto: string; valor: number }[];
  valorFinal: number;
  rangoInferior: number;
  rangoSuperior: number;
  resumen: string[];
}

const INITIAL_DATA: FormData = {
  propertyType: '',
  departamento: '',
  barrio: '',
  amenities: [],
  servicios: [],
};

export const Tasador = () => {
  usePageviewTracking('valuation', { source: 'direct' });

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  
  const { checkLimit: checkCalculateLimit } = useRateLimit(
    'tasador_calcular',
    RATE_LIMITS.TASACION.maxRequests,
    RATE_LIMITS.TASACION.windowMs
  );
  
  const { checkLimit: checkContactLimit } = useRateLimit(
    'tasador_contacto',
    RATE_LIMITS.FORM_SUBMIT.maxRequests,
    RATE_LIMITS.FORM_SUBMIT.windowMs
  );
  
  const { createValuation } = useValuations();
  const { createLead, loading: leadLoading } = useLeads();

  // Precio base por m² según departamento (USD)
  const getPrecioM2 = (departamento: string, propertyType: string): number => {
    const preciosBase: Record<string, Record<string, number>> = {
      'ciudad': { casa: 1800, departamento: 1900, terreno: 720, local: 2340, galpon: 1440, campo: 15000 },
      'godoy-cruz': { casa: 1700, departamento: 1800, terreno: 680, local: 2210, galpon: 1360, campo: 14000 },
      'guaymallen': { casa: 1500, departamento: 1600, terreno: 600, local: 1950, galpon: 1200, campo: 13000 },
      'las-heras': { casa: 1400, departamento: 1500, terreno: 560, local: 1820, galpon: 1120, campo: 12000 },
      'lujan-de-cuyo': { casa: 2000, departamento: 2100, terreno: 800, local: 2600, galpon: 1600, campo: 18000 },
      'maipu': { casa: 1600, departamento: 1700, terreno: 640, local: 2080, galpon: 1280, campo: 14000 },
    };

    const type = propertyType === 'casa' && data.casaSubtipo === 'Departamento' ? 'departamento' : propertyType;
    return preciosBase[departamento]?.[type] || 1500;
  };

  // Calcular tasación
  const calcularTasacion = (): ValuationResult => {
    let valorBase = 0;
    const multiplicadores: { concepto: string; valor: number }[] = [];
    const resumen: string[] = [];

    // CASA / DEPARTAMENTO / PH
    if (data.propertyType === 'casa' && data.metrosCubiertos) {
      const precioM2 = getPrecioM2(data.departamento, 'casa');
      valorBase = precioM2 * parseFloat(data.metrosCubiertos);
      
      resumen.push(`${data.casaSubtipo || 'Propiedad'} en ${DEPARTAMENTOS.find(d => d.value === data.departamento)?.label}`);
      if (data.barrio) resumen.push(`Barrio: ${data.barrio}`);
      resumen.push(`${data.metrosCubiertos} m² cubiertos${data.metrosTotales ? ` | ${data.metrosTotales} m² totales` : ''}`);

      // Dormitorios
      if (data.dormitorios) {
        const valor = parseInt(data.dormitorios) * 5000;
        multiplicadores.push({ concepto: `${data.dormitorios} dormitorio${parseInt(data.dormitorios) > 1 ? 's' : ''}`, valor });
      }

      // Baños
      if (data.banos) {
        const valor = parseInt(data.banos) * 3000;
        multiplicadores.push({ concepto: `${data.banos} baño${parseInt(data.banos) > 1 ? 's' : ''}`, valor });
      }

      // Garage
      if (data.garage) {
        multiplicadores.push({ concepto: 'Garage', valor: 8000 });
      }

      // Pileta
      if (data.pileta) {
        multiplicadores.push({ concepto: 'Pileta', valor: 15000 });
      }

      // Patio
      if (data.patio && data.patioMetros) {
        const valor = parseFloat(data.patioMetros) * 50;
        multiplicadores.push({ concepto: `Patio ${data.patioMetros}m²`, valor });
      }

      // Quincho
      if (data.quincho) {
        multiplicadores.push({ concepto: 'Quincho', valor: 5000 });
      }

      // Estado
      if (data.estado) {
        const estadoMult: Record<string, number> = {
          'nuevo': 0.15,
          'bueno': 0,
          'regular': -0.1,
          'a-renovar': -0.25
        };
        const mult = estadoMult[data.estado] || 0;
        if (mult !== 0) {
          const valor = valorBase * mult;
          const estadoLabel = ESTADOS_PROPIEDAD.find(e => e.value === data.estado)?.label || '';
          multiplicadores.push({ concepto: estadoLabel, valor });
        }
      }

      // Piso (departamento)
      if (data.casaSubtipo === 'Departamento' && data.piso) {
        if (data.isPenthouse) {
          const valor = valorBase * 0.3;
          multiplicadores.push({ concepto: 'Penthouse', valor });
        } else {
          const pisoNum = parseInt(data.piso);
          if (pisoNum >= 8) {
            const valor = valorBase * 0.1;
            multiplicadores.push({ concepto: 'Piso alto', valor });
          } else if (pisoNum <= 2) {
            const valor = valorBase * -0.05;
            multiplicadores.push({ concepto: 'Piso bajo', valor });
          }
        }
      }

      // Amenities
      if (data.amenities && data.amenities.length > 0) {
        const valor = data.amenities.length * 2000;
        multiplicadores.push({ concepto: `${data.amenities.length} amenitie${data.amenities.length > 1 ? 's' : ''}`, valor });
      }
    }

    // TERRENO
    else if (data.propertyType === 'terreno' && data.metrosTotales) {
      const precioM2 = getPrecioM2(data.departamento, 'terreno');
      valorBase = precioM2 * parseFloat(data.metrosTotales);
      
      resumen.push(`Terreno en ${DEPARTAMENTOS.find(d => d.value === data.departamento)?.label}`);
      if (data.barrio) resumen.push(`Barrio: ${data.barrio}`);
      resumen.push(`${data.metrosTotales} m² totales`);

      // Servicios
      if (data.servicios && data.servicios.length > 0) {
        const valor = data.servicios.length * 3000;
        multiplicadores.push({ concepto: `${data.servicios.length} servicio${data.servicios.length > 1 ? 's' : ''}`, valor });
      }

      // Zonificación comercial
      if (data.zonificacion === 'Comercial') {
        const valor = valorBase * 0.2;
        multiplicadores.push({ concepto: 'Zonificación comercial', valor });
      }

      // Subdividido
      if (data.subdividido) {
        const valor = valorBase * 0.1;
        multiplicadores.push({ concepto: 'Subdividido', valor });
      }
    }

    // GALPÓN
    else if (data.propertyType === 'galpon' && data.metrosCubiertos) {
      const precioM2 = getPrecioM2(data.departamento, 'galpon');
      valorBase = precioM2 * parseFloat(data.metrosCubiertos);
      
      resumen.push(`Galpón/Depósito en ${DEPARTAMENTOS.find(d => d.value === data.departamento)?.label}`);
      if (data.barrio) resumen.push(`Barrio: ${data.barrio}`);
      resumen.push(`${data.metrosCubiertos} m² cubiertos`);

      // Altura libre
      if (data.alturaLibre && parseFloat(data.alturaLibre) >= 6) {
        const valor = valorBase * 0.15;
        multiplicadores.push({ concepto: `Altura libre ${data.alturaLibre}m`, valor });
      }

      // Oficinas
      if (data.oficinas) {
        multiplicadores.push({ concepto: 'Oficinas incluidas', valor: 10000 });
      }

      // Acceso camiones
      if (data.accesoCaniones) {
        multiplicadores.push({ concepto: 'Acceso para camiones', valor: 8000 });
      }
    }

    // FINCA / CAMPO
    else if (data.propertyType === 'campo' && data.hectareas) {
      const precioHa = getPrecioM2(data.departamento, 'campo');
      valorBase = precioHa * parseFloat(data.hectareas);
      
      resumen.push(`Finca/Campo en ${DEPARTAMENTOS.find(d => d.value === data.departamento)?.label}`);
      if (data.barrio) resumen.push(`Zona: ${data.barrio}`);
      resumen.push(`${data.hectareas} hectáreas`);

      // Vivienda
      if (data.viviendaMetros) {
        const valor = parseFloat(data.viviendaMetros) * 1200;
        multiplicadores.push({ concepto: `Vivienda ${data.viviendaMetros}m²`, valor });
      }

      // Pozo de agua
      if (data.pozoAgua) {
        multiplicadores.push({ concepto: 'Pozo de agua', valor: 15000 });
      }

      // Producción
      if (data.produccion) {
        const valor = valorBase * 0.2;
        multiplicadores.push({ concepto: `Producción: ${data.produccion}`, valor });
      }
    }

    // LOCAL COMERCIAL
    else if (data.propertyType === 'local' && data.metrosCubiertos) {
      const precioM2 = getPrecioM2(data.departamento, 'local');
      valorBase = precioM2 * parseFloat(data.metrosCubiertos);
      
      resumen.push(`Local/Oficina en ${DEPARTAMENTOS.find(d => d.value === data.departamento)?.label}`);
      if (data.barrio) resumen.push(`Barrio: ${data.barrio}`);
      resumen.push(`${data.metrosCubiertos} m² cubiertos`);

      // Pie de calle
      if (data.pieCalleAltura === 'pie_calle') {
        const valor = valorBase * 0.3;
        multiplicadores.push({ concepto: 'A pie de calle', valor });
      }

      // Vidriera
      if (data.vidriera) {
        const valor = valorBase * 0.1;
        multiplicadores.push({ concepto: 'Con vidriera', valor });
      }
    }

    // Calcular valor final
    const sumaMultiplicadores = multiplicadores.reduce((sum, m) => sum + m.valor, 0);
    const valorFinal = Math.round(valorBase + sumaMultiplicadores);
    const rangoInferior = Math.round(valorFinal * 0.9);
    const rangoSuperior = Math.round(valorFinal * 1.1);

    return {
      valorBase: Math.round(valorBase),
      multiplicadores,
      valorFinal,
      rangoInferior,
      rangoSuperior,
      resumen,
    };
  };

  const handleCalculate = async () => {
    // ✅ VERIFICAR RATE LIMIT
    const { allowed } = checkCalculateLimit();
    
    if (!allowed) {
      alert('Demasiados intentos. Esperá unos minutos antes de calcular nuevamente.');
      return;
    }

    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const resultado = calcularTasacion();
      setResult(resultado);

      // Guardar en la base de datos usando tu hook
      await createValuation({
        tipo_propiedad: data.propertyType as 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'galpon',
        departamento: data.departamento,
        barrio: data.barrio || undefined,
        metros_cubiertos: data.metrosCubiertos ? parseFloat(data.metrosCubiertos) : 0,
        metros_totales: data.metrosTotales ? parseFloat(data.metrosTotales) : undefined,
        dormitorios: data.dormitorios ? parseInt(data.dormitorios) : undefined,
        banos: data.banos ? parseInt(data.banos) : undefined,
        estado: data.estado!,
        extras: [
          ...(data.garage ? ['garage'] : []),
          ...(data.pileta ? ['pileta'] : []),
          ...(data.quincho ? ['quincho'] : []),
          ...(data.amenities || []),
        ],
        valor_minimo: resultado.rangoInferior,
        valor_maximo: resultado.rangoSuperior,
        valor_estimado: resultado.valorFinal,
        moneda: 'USD',
      });

      setStep(getTotalSteps());
    } catch (error) {
      console.error('Error al calcular:', error);
      alert('Hubo un error al calcular. Intentá de nuevo.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ VERIFICAR CAPTCHA
    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }

    // ✅ VERIFICAR RATE LIMIT
    const { allowed } = checkContactLimit();
    
    if (!allowed) {
      alert('Demasiados intentos. Esperá 1 minuto antes de enviar nuevamente.');
      return;
    }

    try {
      // ✅ SANITIZAR DATOS
      const sanitized = sanitizeFormData(
        {
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          telefono: data.telefono || '',
          notas: data.notas || '',
        },
        {
          nombre: 'text',
          apellido: 'text',
          email: 'email',
          telefono: 'phone',
          notas: 'text',
        }
      );

      const leadResult = await createLead({
        type: 'tasacion',
        nombre: sanitized.nombre,
        apellido: sanitized.apellido,
        email: sanitized.email,
        telefono: sanitized.telefono,
        tipo_propiedad: data.propertyType as 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'galpon',
        departamento: data.departamento,
        barrio: data.barrio,
        metros_cubiertos: data.metrosCubiertos ? parseFloat(data.metrosCubiertos) : undefined,
        metros_totales: data.metrosTotales ? parseFloat(data.metrosTotales) : undefined,
        dormitorios: data.dormitorios ? parseInt(data.dormitorios) : undefined,
        banos: data.banos ? parseInt(data.banos) : undefined,
        estado: data.estado as 'nuevo' | 'bueno' | 'regular' | 'a-renovar' | undefined,
        extras: [
          ...(data.garage ? ['garage'] : []),
          ...(data.pileta ? ['pileta'] : []),
          ...(data.amenities || []),
        ],
      });

      if (leadResult.success) {
        setShowContactForm(false);
        setCaptchaToken('');
        alert('¡Gracias! Un asesor se comunicará con vos para una tasación profesional.');
      } else {
        alert('Hubo un error al enviar. Intentá de nuevo.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar los datos';
      alert(errorMessage);
    }
  };

  const getTotalSteps = () => {
    if (data.propertyType === 'casa') return 5;
    return 4;
  };

  const handleNext = () => {
    if (step === 0 && !data.propertyType) {
      alert('Por favor seleccioná un tipo de propiedad');
      return;
    }
    if (step === 1 && !data.departamento) {
      alert('Por favor seleccioná un departamento');
      return;
    }

    const totalSteps = getTotalSteps();
    if (step === totalSteps - 1) {
      handleCalculate();
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderStep = () => {
    // PASO 0: TIPO DE PROPIEDAD
    if (step === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Qué tipo de propiedad querés tasar?</h2>
            <p className="text-gray-600">Seleccioná el tipo que mejor describa tu propiedad</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROPERTY_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = data.propertyType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setData({ ...data, propertyType: type.id });
                    setStep(1);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                    isSelected
                      ? 'border-[#c9a962] bg-[#c9a962]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-16 h-16 ${type.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-center font-semibold text-gray-900">{type.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // PASO 1: UBICACIÓN
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#c9a962]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">¿Dónde está ubicada?</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Departamento *</Label>
              <Select value={data.departamento} onValueChange={(val) => setData({ ...data, departamento: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((dep) => (
                    <SelectItem key={dep.value} value={dep.value}>{dep.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Barrio o Zona (opcional)</Label>
              <Input
                value={data.barrio || ''}
                onChange={(e) => setData({ ...data, barrio: e.target.value })}
                placeholder="Ej: Ciudad, Dorrego, Chacras de Coria, etc."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
            <Button
              onClick={handleNext}
              disabled={!data.departamento}
              className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // PASO 2: CARACTERÍSTICAS (según tipo)
    if (step === 2) {
      // CASA/DEPTO/PH
      if (data.propertyType === 'casa') {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Características</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Tipo *</Label>
                <RadioGroup value={data.casaSubtipo} onValueChange={(val) => setData({ ...data, casaSubtipo: val })}>
                  {CASA_SUBTIPOS.map((tipo) => (
                    <div key={tipo} className="flex items-center space-x-2">
                      <RadioGroupItem value={tipo} id={tipo} />
                      <Label htmlFor={tipo} className="cursor-pointer">{tipo}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Metros cubiertos *</Label>
                  <Input
                    type="number"
                    value={data.metrosCubiertos || ''}
                    onChange={(e) => setData({ ...data, metrosCubiertos: e.target.value })}
                    placeholder="120"
                  />
                </div>
                <div>
                  <Label>Metros totales</Label>
                  <Input
                    type="number"
                    value={data.metrosTotales || ''}
                    onChange={(e) => setData({ ...data, metrosTotales: e.target.value })}
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dormitorios *</Label>
                  <Select value={data.dormitorios} onValueChange={(val) => setData({ ...data, dormitorios: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, '6+'].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Baños *</Label>
                  <Select value={data.banos} onValueChange={(val) => setData({ ...data, banos: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, '5+'].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Estado general *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {ESTADOS_PROPIEDAD.map((estado) => (
                    <button
                      key={estado.value}
                      onClick={() => setData({ ...data, estado: estado.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        data.estado === estado.value
                          ? 'border-[#c9a962] bg-[#c9a962]/10'
                          : 'border-gray-200 hover:border-[#c9a962]/50'
                      }`}
                    >
                      <span className="font-medium text-sm">{estado.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.casaSubtipo || !data.metrosCubiertos || !data.dormitorios || !data.banos || !data.estado}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      // TERRENO
      if (data.propertyType === 'terreno') {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Características del Terreno</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Metros totales *</Label>
                <Input
                  type="number"
                  value={data.metrosTotales || ''}
                  onChange={(e) => setData({ ...data, metrosTotales: e.target.value })}
                  placeholder="500"
                />
              </div>

              <div>
                <Label>Servicios disponibles</Label>
                <div className="space-y-2 mt-2">
                  {SERVICIOS_TERRENO.map((servicio) => (
                    <div key={servicio} className="flex items-center space-x-2">
                      <Checkbox
                        id={servicio}
                        checked={data.servicios?.includes(servicio)}
                        onCheckedChange={(checked) => {
                          const newServicios = checked
                            ? [...(data.servicios || []), servicio]
                            : (data.servicios || []).filter(s => s !== servicio);
                          setData({ ...data, servicios: newServicios });
                        }}
                      />
                      <Label htmlFor={servicio} className="cursor-pointer">{servicio}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Zonificación</Label>
                <Select value={data.zonificacion} onValueChange={(val) => setData({ ...data, zonificacion: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONIFICACIONES.map((zona) => (
                      <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subdividido"
                  checked={data.subdividido}
                  onCheckedChange={(checked) => setData({ ...data, subdividido: checked as boolean })}
                />
                <Label htmlFor="subdividido" className="cursor-pointer">¿Está subdividido?</Label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.metrosTotales}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                {isCalculating ? 'Calculando...' : 'Calcular valor'}
                <Calculator className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      // GALPÓN
      if (data.propertyType === 'galpon') {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Warehouse className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Características del Galpón</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Metros cubiertos *</Label>
                <Input
                  type="number"
                  value={data.metrosCubiertos || ''}
                  onChange={(e) => setData({ ...data, metrosCubiertos: e.target.value })}
                  placeholder="500"
                />
              </div>

              <div>
                <Label>Altura libre (metros)</Label>
                <Input
                  type="number"
                  value={data.alturaLibre || ''}
                  onChange={(e) => setData({ ...data, alturaLibre: e.target.value })}
                  placeholder="6"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oficinas"
                    checked={data.oficinas}
                    onCheckedChange={(checked) => setData({ ...data, oficinas: checked as boolean })}
                  />
                  <Label htmlFor="oficinas" className="cursor-pointer">¿Tiene oficinas?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accesoCaniones"
                    checked={data.accesoCaniones}
                    onCheckedChange={(checked) => setData({ ...data, accesoCaniones: checked as boolean })}
                  />
                  <Label htmlFor="accesoCaniones" className="cursor-pointer">¿Acceso para camiones?</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.metrosCubiertos || isCalculating}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                {isCalculating ? 'Calculando...' : 'Calcular valor'}
                <Calculator className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      // FINCA/CAMPO
      if (data.propertyType === 'campo') {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Características de la Finca</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Hectáreas *</Label>
                <Input
                  type="number"
                  value={data.hectareas || ''}
                  onChange={(e) => setData({ ...data, hectareas: e.target.value })}
                  placeholder="10"
                />
              </div>

              <div>
                <Label>Vivienda (m²)</Label>
                <Input
                  type="number"
                  value={data.viviendaMetros || ''}
                  onChange={(e) => setData({ ...data, viviendaMetros: e.target.value })}
                  placeholder="150"
                />
              </div>

              <div>
                <Label>Tipo de producción</Label>
                <Input
                  value={data.produccion || ''}
                  onChange={(e) => setData({ ...data, produccion: e.target.value })}
                  placeholder="Ej: Viñedos, Frutales, etc."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pozoAgua"
                  checked={data.pozoAgua}
                  onCheckedChange={(checked) => setData({ ...data, pozoAgua: checked as boolean })}
                />
                <Label htmlFor="pozoAgua" className="cursor-pointer">¿Tiene pozo de agua?</Label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.hectareas || isCalculating}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                {isCalculating ? 'Calculando...' : 'Calcular valor'}
                <Calculator className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      // LOCAL COMERCIAL
      if (data.propertyType === 'local') {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Características del Local</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Metros cubiertos *</Label>
                <Input
                  type="number"
                  value={data.metrosCubiertos || ''}
                  onChange={(e) => setData({ ...data, metrosCubiertos: e.target.value })}
                  placeholder="80"
                />
              </div>

              <div>
                <Label>Ubicación</Label>
                <RadioGroup value={data.pieCalleAltura} onValueChange={(val) => setData({ ...data, pieCalleAltura: val })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pie_calle" id="pie_calle" />
                    <Label htmlFor="pie_calle" className="cursor-pointer">A pie de calle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="altura" id="altura" />
                    <Label htmlFor="altura" className="cursor-pointer">En altura</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vidriera"
                  checked={data.vidriera}
                  onCheckedChange={(checked) => setData({ ...data, vidriera: checked as boolean })}
                />
                <Label htmlFor="vidriera" className="cursor-pointer">¿Tiene vidriera?</Label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.metrosCubiertos || isCalculating}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                {isCalculating ? 'Calculando...' : 'Calcular valor'}
                <Calculator className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }
    }

    // PASO 3: EXTRAS (solo casa)
    if (step === 3 && data.propertyType === 'casa') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Extras y Comodidades</h2>
            <p className="text-gray-600">¿Qué más tiene tu propiedad?</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="garage"
                  checked={data.garage}
                  onCheckedChange={(checked) => setData({ ...data, garage: checked as boolean })}
                />
                <Label htmlFor="garage" className="cursor-pointer flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Garage
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="pileta"
                  checked={data.pileta}
                  onCheckedChange={(checked) => setData({ ...data, pileta: checked as boolean })}
                />
                <Label htmlFor="pileta" className="cursor-pointer flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Pileta
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="quincho"
                  checked={data.quincho}
                  onCheckedChange={(checked) => setData({ ...data, quincho: checked as boolean })}
                />
                <Label htmlFor="quincho" className="cursor-pointer flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Quincho
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="parrilla"
                  checked={data.parrilla}
                  onCheckedChange={(checked) => setData({ ...data, parrilla: checked as boolean })}
                />
                <Label htmlFor="parrilla" className="cursor-pointer flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Parrilla
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="patio"
                  checked={data.patio}
                  onCheckedChange={(checked) => setData({ ...data, patio: checked as boolean })}
                />
                <Label htmlFor="patio" className="cursor-pointer">¿Tiene patio?</Label>
              </div>
              {data.patio && (
                <div className="ml-6">
                  <Label htmlFor="patioMetros">¿Cuántos m² aprox?</Label>
                  <Input
                    id="patioMetros"
                    type="number"
                    value={data.patioMetros || ''}
                    onChange={(e) => setData({ ...data, patioMetros: e.target.value })}
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {data.casaSubtipo === 'Departamento' && (
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Características del Departamento</h3>
                
                <div>
                  <Label htmlFor="piso">¿En qué piso está?</Label>
                  <Input
                    id="piso"
                    type="number"
                    value={data.piso || ''}
                    onChange={(e) => setData({ ...data, piso: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPenthouse"
                    checked={data.isPenthouse}
                    onCheckedChange={(checked) => setData({ ...data, isPenthouse: checked as boolean })}
                  />
                  <Label htmlFor="isPenthouse" className="cursor-pointer">¿Es penthouse?</Label>
                </div>

                <div>
                  <Label>Amenities del edificio</Label>
                  <div className="space-y-2 mt-2">
                    {AMENITIES_DEPTO.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={data.amenities?.includes(amenity)}
                          onCheckedChange={(checked) => {
                            const newAmenities = checked
                              ? [...(data.amenities || []), amenity]
                              : (data.amenities || []).filter(a => a !== amenity);
                            setData({ ...data, amenities: newAmenities });
                          }}
                        />
                        <Label htmlFor={amenity} className="cursor-pointer">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
            <Button
              onClick={handleNext}
              disabled={isCalculating}
              className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  Calcular valor
                  <Calculator className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    // RESULTADO
    if (result && step === getTotalSteps()) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">¡Listo!</h2>
            <p className="text-gray-600 mt-2">Este es el valor estimado de tu propiedad</p>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Resumen</h3>
            <div className="space-y-2">
              {result.resumen.map((item, index) => (
                <p key={index} className="text-gray-700">{item}</p>
              ))}
            </div>
          </div>

          {/* Valor estimado */}
          <div className="text-center py-8 bg-[#c9a962]/10 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">VALOR ESTIMADO</p>
            <p className="text-5xl font-bold text-[#c9a962] mb-4">{formatCurrency(result.valorFinal)}</p>
            <p className="text-gray-600">
              Rango: {formatCurrency(result.rangoInferior)} - {formatCurrency(result.rangoSuperior)}
            </p>
          </div>

          {/* Desglose */}
          {result.multiplicadores.length > 0 && (
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-3">💎 Factores que aumentan el valor</h4>
              <div className="space-y-2">
                {result.multiplicadores.map((mult, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{mult.concepto}</span>
                    <span className={`font-semibold ${mult.valor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {mult.valor > 0 ? '+' : ''}{formatCurrency(mult.valor)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparables */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c9a962]" />
              Propiedades similares en la zona
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promedio en {DEPARTAMENTOS.find(d => d.value === data.departamento)?.label}</span>
                <span className="font-medium">{formatCurrency(Math.round(result.valorFinal * 0.95))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rango de mercado</span>
                <span className="font-medium">
                  {formatCurrency(Math.round(result.valorFinal * 0.8))} - {formatCurrency(Math.round(result.valorFinal * 1.2))}
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Importante:</strong> Esta es una estimación automatizada basada en datos generales del mercado. 
              Para una tasación profesional y precisa, contactá a un asesor.
            </p>
          </div>

          {/* Formulario de contacto */}
          {!showContactForm ? (
            <div className="space-y-3">
              <Button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                <Phone className="w-4 h-4 mr-2" />
                Quiero una tasación profesional
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </Button>
              </div>
              <Button variant="outline" onClick={() => { setStep(0); setData(INITIAL_DATA); setResult(null); }} className="w-full">
                Tasar otra propiedad
              </Button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Dejanos tus datos</h3>
              {captchaError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  Por favor completá la verificación de seguridad.
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="Nombre" 
                  required 
                  value={data.nombre || ''}
                  onChange={(e) => setData({ ...data, nombre: e.target.value })}
                />
                <Input 
                  placeholder="Apellido" 
                  required 
                  value={data.apellido || ''}
                  onChange={(e) => setData({ ...data, apellido: e.target.value })}
                />
              </div>
              <Input 
                type="email" 
                placeholder="Email" 
                required 
                value={data.email || ''}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <Input 
                placeholder="Teléfono" 
                required 
                value={data.telefono || ''}
                onChange={(e) => setData({ ...data, telefono: e.target.value })}
              />
              <Textarea
                placeholder="¿Cuándo preferís que te contactemos? (opcional)"
                rows={2}
                value={data.notas || ''}
                onChange={(e) => setData({ ...data, notas: e.target.value })}
              />
              <HCaptchaWrapper
                onVerify={(token) => {
                  setCaptchaToken(token);
                  setCaptchaError(false);
                }}
                onError={() => {
                  setCaptchaToken('');
                  setCaptchaError(true);
                }}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={leadLoading || !captchaToken}
                  className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
                >
                  {leadLoading ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </form>
          )}
        </div>
      );
    }

    return null;
  };

  // Si está calculando
  if (isCalculating) {
    return (
      <>
        <Helmet>
          <title>Calculando Tasación... | Grupo Baigorria</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculando tasación...</h2>
            <p className="text-gray-600">Analizando todas las características</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tasación Online Mendoza | Valorá tu Propiedad Gratis</title>
        <meta name="description" content="Tasá tu propiedad en Mendoza gratis. Valoración inmediata basada en datos reales del mercado inmobiliario." />
        <meta name="keywords" content="tasación online Mendoza, valorar casa Mendoza, tasador inmobiliario" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/tasador" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a962] mb-4">
              <Calculator className="w-5 h-5" />
              <span className="font-medium">Tasador Online</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Conocé el valor de tu propiedad
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Respondé unas simples preguntas y obtené una estimación gratuita 
              en minutos. Usamos datos actualizados del mercado inmobiliario de Gran Mendoza.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-8">
              {/* Progress */}
              {step < getTotalSteps() && step > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Paso {step} de {getTotalSteps() - 1}</span>
                    <span>{Math.round((step / (getTotalSteps() - 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a962] transition-all duration-300"
                      style={{ width: `${(step / (getTotalSteps() - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {renderStep()}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            La tasación online es una estimación aproximada basada en datos de mercado. 
            Para una valoración precisa, consultá con un profesional.
          </p>
        </div>
      </div>
    </>
  );
};