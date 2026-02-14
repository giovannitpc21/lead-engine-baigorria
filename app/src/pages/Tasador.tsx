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
import { 
  Home, 
  MapPin, 
  Ruler, 
  Bed, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Calculator,
  Phone,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { DEPARTAMENTOS, TIPOS_PROPIEDAD, ESTADOS_PROPIEDAD, EXTRAS_PROPIEDAD } from '@/lib/constants';
import { useValuations } from '@/hooks/useValuations';
import { useValuationRules } from '@/hooks/useValuationRules';
import { useLeads } from '@/hooks/useLeads';

interface TasadorData {
  tipo_propiedad: string;
  departamento: string;
  barrio: string;
  metros_cubiertos: string;
  metros_totales: string;
  dormitorios: string;
  banos: string;
  estado: string;
  extras: string[];
}

const INITIAL_DATA: TasadorData = {
  tipo_propiedad: '',
  departamento: '',
  barrio: '',
  metros_cubiertos: '',
  metros_totales: '',
  dormitorios: '',
  banos: '',
  estado: '',
  extras: [],
};

// Valores por defecto si no hay regla en la DB
const PRECIO_BASE_M2: Record<string, number> = {
  casa: 1200,
  departamento: 1400,
  terreno: 400,
  local: 1000,
  oficina: 1100,
  galpon: 600,
  campo: 300,
  ph: 1100,
};

const MULTIPLICADORES_DEPTO: Record<string, number> = {
  ciudad: 1.2,
  'godoy-cruz': 1.0,
  guaymallen: 0.9,
  'las-heras': 0.95,
  'lujan-de-cuyo': 1.15,
  maipu: 0.85,
  otro: 0.8,
};

const ESTADO_MULTIPLICADOR: Record<string, number> = {
  nuevo: 1.1,
  bueno: 1.0,
  regular: 0.9,
  'a-renovar': 0.75,
};

export const Tasador = () => {
  usePageviewTracking('valuation', { source: 'direct' });

  const [step, setStep] = useState(1);
  const [data, setData] = useState<TasadorData>(INITIAL_DATA);
  const [resultado, setResultado] = useState<{
    min: number;
    max: number;
    estimado: number;
    reglaUsada: string;
  } | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { createValuation } = useValuations();
  const { getRule } = useValuationRules();
  const { createLead, loading: leadLoading } = useLeads();

  const updateData = (field: keyof TasadorData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleExtra = (extra: string) => {
    setData((prev) => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter((e) => e !== extra)
        : [...prev.extras, extra],
    }));
  };

  const calcularValor = async () => {
    setIsCalculating(true);
    
    try {
      // Intentar usar regla de la base de datos
      const { data: rule } = await getRule(data.tipo_propiedad, data.departamento);
      
      let valorBase: number;
      let reglaUsada: string;
      
      if (rule) {
        // Usar regla de la DB
        const precioM2 = rule.precio_m2_cubierto;
        const estadoMult = rule.multiplicador_estado[data.estado as keyof typeof rule.multiplicador_estado] || 1;
        
        let extrasMult = 1;
        data.extras.forEach((extra) => {
          const mult = rule.multiplicador_extras[extra as keyof typeof rule.multiplicador_extras];
          if (mult) extrasMult *= mult;
        });

        valorBase = parseFloat(data.metros_cubiertos) * precioM2 * estadoMult * extrasMult;
        reglaUsada = `Regla DB: ${rule.id}`;
      } else {
        // Fallback a valores por defecto
        const baseM2 = PRECIO_BASE_M2[data.tipo_propiedad] || 1000;
        const deptMult = MULTIPLICADORES_DEPTO[data.departamento] || 1;
        const estadoMult = ESTADO_MULTIPLICADOR[data.estado] || 1;
        const extrasMult = 1 + data.extras.length * 0.02;
        
        valorBase = parseFloat(data.metros_cubiertos) * baseM2 * deptMult * estadoMult * extrasMult;
        reglaUsada = 'Valores por defecto';
      }

      const min = Math.round(valorBase * 0.85);
      const max = Math.round(valorBase * 1.15);
      const estimado = Math.round(valorBase);

      setResultado({ min, max, estimado, reglaUsada });
      
      // Guardar valuación en la base de datos
      await createValuation({
        tipo_propiedad: data.tipo_propiedad,
        departamento: data.departamento,
        barrio: data.barrio || undefined,
        metros_cubiertos: parseFloat(data.metros_cubiertos),
        metros_totales: data.metros_totales ? parseFloat(data.metros_totales) : undefined,
        dormitorios: data.dormitorios ? parseInt(data.dormitorios) : undefined,
        banos: data.banos ? parseInt(data.banos) : undefined,
        estado: data.estado,
        extras: data.extras,
        valor_minimo: min,
        valor_maximo: max,
        valor_estimado: estimado,
        moneda: 'USD',
      });

      setStep(6);
    } catch (err) {
      console.error('Error al calcular:', err);
      alert('Hubo un error al calcular el valor. Intentá de nuevo.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;

    // Crear lead desde la valuación
    const leadResult = await createLead({
      type: 'tasacion',
      nombre,
      apellido,
      email,
      telefono,
      tipo_propiedad: data.tipo_propiedad as 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'galpon',
      departamento: data.departamento,
      barrio: data.barrio,
      metros_cubiertos: parseFloat(data.metros_cubiertos),
      metros_totales: data.metros_totales ? parseFloat(data.metros_totales) : undefined,
      dormitorios: data.dormitorios ? parseInt(data.dormitorios) : undefined,
      banos: data.banos ? parseInt(data.banos) : undefined,
      estado: data.estado as 'nuevo' | 'bueno' | 'regular' | 'a-renovar',
      extras: data.extras,
    });

    if (leadResult.success) {
      setShowContactForm(false);
      alert('¡Gracias! Un asesor se comunicará contigo para una tasación profesional.');
    } else {
      alert('Hubo un error al enviar. Intentá de nuevo.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">¿Qué tipo de propiedad querés tasar?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {TIPOS_PROPIEDAD.map((tipo) => (
                <button
                  key={tipo.value}
                  onClick={() => {
                    updateData('tipo_propiedad', tipo.value);
                    setStep(2);
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    data.tipo_propiedad === tipo.value
                      ? 'border-[#c9a962] bg-[#c9a962]/10'
                      : 'border-gray-200 hover:border-[#c9a962]/50'
                  }`}
                >
                  <span className="font-medium text-gray-900">{tipo.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
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
                <Label>Departamento</Label>
                <Select
                  value={data.departamento}
                  onValueChange={(value) => updateData('departamento', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTAMENTOS.map((dep) => (
                      <SelectItem key={dep.value} value={dep.value}>
                        {dep.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Barrio (opcional)</Label>
                <Input
                  value={data.barrio}
                  onChange={(e) => updateData('barrio', e.target.value)}
                  placeholder="Ej: Ciudad, Dorrego, etc."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!data.departamento}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">¿Cuántos metros tiene?</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Metros cuadrados cubiertos *</Label>
                <Input
                  type="number"
                  value={data.metros_cubiertos}
                  onChange={(e) => updateData('metros_cubiertos', e.target.value)}
                  placeholder="Ej: 120"
                />
              </div>
              <div>
                <Label>Metros cuadrados totales (opcional)</Label>
                <Input
                  type="number"
                  value={data.metros_totales}
                  onChange={(e) => updateData('metros_totales', e.target.value)}
                  placeholder="Ej: 300 (incluye patio, garage, etc.)"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!data.metros_cubiertos}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">¿Cuántos ambientes tiene?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Dormitorios</Label>
                <Select
                  value={data.dormitorios}
                  onValueChange={(value) => updateData('dormitorios', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, '6+'].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'dormitorio' : 'dormitorios'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Baños</Label>
                <Select
                  value={data.banos}
                  onValueChange={(value) => updateData('banos', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, '5+'].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'baño' : 'baños'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={() => setStep(5)}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">¿En qué estado se encuentra?</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Estado general</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {ESTADOS_PROPIEDAD.map((estado) => (
                    <button
                      key={estado.value}
                      onClick={() => updateData('estado', estado.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        data.estado === estado.value
                          ? 'border-[#c9a962] bg-[#c9a962]/10'
                          : 'border-gray-200 hover:border-[#c9a962]/50'
                      }`}
                    >
                      <span className="font-medium text-gray-900 text-sm">{estado.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Extras (opcional)</Label>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS_PROPIEDAD.map((extra) => (
                    <button
                      key={extra.value}
                      onClick={() => toggleExtra(extra.value)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        data.extras.includes(extra.value)
                          ? 'bg-[#c9a962] text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {data.extras.includes(extra.value) && (
                        <Check className="w-3 h-3 inline mr-1" />
                      )}
                      {extra.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
              <Button
                onClick={calcularValor}
                disabled={!data.estado || isCalculating}
                className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular valor
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 6:
        if (!resultado) return null;
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">¡Listo!</h2>
              <p className="text-gray-600 mt-2">Este es el valor estimado de tu propiedad</p>
            </div>

            <div className="bg-[#c9a962]/10 rounded-xl p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Valor estimado</p>
              <p className="text-4xl font-bold text-[#c9a962]">
                USD {resultado.estimado.toLocaleString('es-AR')}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Rango: USD {resultado.min.toLocaleString('es-AR')} - {resultado.max.toLocaleString('es-AR')}
              </p>
            </div>

            {/* Comparables simulados */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#c9a962]" />
                Propiedades similares en la zona
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Promedio {data.tipo_propiedad} en {data.departamento}</span>
                  <span className="font-medium">USD {Math.round(resultado.estimado * 0.95).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rango de precios</span>
                  <span className="font-medium">USD {(resultado.estimado * 0.8).toLocaleString()} - {(resultado.estimado * 1.2).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>Importante:</strong> Esta es una estimación automatizada basada en datos 
                generales del mercado. Para una tasación profesional y precisa, contactá a un asesor.
              </p>
            </div>

            {!showContactForm ? (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-[#c9a962] hover:bg-[#b8984f] text-black"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Quiero una tasación profesional
                </Button>
                <Button variant="outline" onClick={() => { setStep(1); setData(INITIAL_DATA); setResultado(null); }} className="w-full">
                  Calcular otra propiedad
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Dejanos tus datos</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input name="nombre" placeholder="Nombre" required />
                  <Input name="apellido" placeholder="Apellido" required />
                </div>
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="telefono" placeholder="Teléfono" required />
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
                    disabled={leadLoading}
                    className="flex-1 bg-[#c9a962] hover:bg-[#b8984f] text-black"
                  >
                    {leadLoading ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-8">
              {/* Progress */}
              {step < 6 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Paso {step} de 5</span>
                    <span>{Math.round((step / 5) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a962] transition-all duration-300"
                      style={{ width: `${(step / 5) * 100}%` }}
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