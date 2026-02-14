import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, MapPin, TrendingUp, CheckCircle, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { PROPERTY_TYPES } from '@/types';

const DEPARTAMENTOS_GRAN_MENDOZA = [
  'Ciudad de Mendoza',
  'Godoy Cruz',
  'Guaymallén',
  'Las Heras',
  'Luján de Cuyo',
  'Maipú'
];

export default function TasacionOnlineMendoza() {
  usePageviewTracking('tasacion_online_mendoza', { source: 'seo_landing' });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: '',
    department: '',
    coveredArea: '',
    totalArea: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    condition: '',
    garage: false,
    patio: false,
    pool: false,
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = () => {
    // Redirigir al tasador completo con datos pre-llenados
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    window.location.href = `/tasador?${params.toString()}`;
  };

  // Schema.org JSON-LD
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Tasación Online Mendoza',
    description: 'Tasá tu propiedad en Mendoza gratis. Valoración inmediata basada en datos reales del mercado inmobiliario de Gran Mendoza.',
    provider: {
      '@type': 'RealEstateAgent',
      name: 'Century 21 Baigorria',
      telephone: '+54 9 261 716 6129',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mendoza',
        addressRegion: 'Mendoza',
        addressCountry: 'AR'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'Mendoza',
      containedInPlace: {
        '@type': 'State',
        name: 'Mendoza'
      }
    },
    serviceType: 'Property Valuation'
  };

  return (
    <>
      <Helmet>
        <title>Tasación Online Mendoza | Valorá tu Propiedad Gratis | Century 21 Baigorria</title>
        <meta name="description" content="Tasá tu propiedad en Mendoza gratis. Valoración inmediata basada en datos reales del mercado inmobiliario de Gran Mendoza. Tasador online confiable." />
        <meta name="keywords" content="tasación online Mendoza, valorar casa Mendoza, tasador inmobiliario Mendoza, precio propiedad Mendoza, tasación gratis Mendoza" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/tasacion-online-mendoza" />
        <meta property="og:title" content="Tasación Online Mendoza | Valorá tu Propiedad Gratis" />
        <meta property="og:description" content="Tasá tu propiedad en Mendoza gratis. Valoración inmediata basada en datos reales del mercado." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              Tasación Online Gratis
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              ¿Cuánto vale tu propiedad en{' '}
              <span className="text-yellow-400">Mendoza</span>?
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Obtené una valoración instantánea basada en datos reales del mercado inmobiliario 
              de Gran Mendoza. Sin compromiso, 100% gratis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
                onClick={() => document.getElementById('tasador-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Valorar mi Propiedad
              </Button>
              <a href="https://wa.me/5492617166129" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '2,500+', label: 'Tasaciones realizadas' },
              { number: '98%', label: 'Precisión estimada' },
              { number: '6', label: 'Departamentos cubiertos' },
              { number: '< 2 min', label: 'Tiempo promedio' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.number}</div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="tasador-form" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Completá los datos de tu propiedad
              </h2>
              <p className="text-slate-600">
                En menos de 2 minutos tendrás una estimación del valor de tu propiedad.
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="p-6 md:p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label>¿Qué tipo de propiedad querés tasar?</Label>
                      <Select 
                        value={formData.propertyType} 
                        onValueChange={(v) => setFormData({...formData, propertyType: v})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿En qué departamento está ubicada?</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(v) => setFormData({...formData, department: v})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccionar ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTAMENTOS_GRAN_MENDOZA.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                      onClick={() => setStep(2)}
                      disabled={!formData.propertyType || !formData.department}
                    >
                      Continuar <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Metros cubiertos</Label>
                        <Input 
                          type="number" 
                          placeholder="Ej: 120"
                          className="mt-2"
                          value={formData.coveredArea}
                          onChange={(e) => setFormData({...formData, coveredArea: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Metros totales</Label>
                        <Input 
                          type="number" 
                          placeholder="Ej: 200"
                          className="mt-2"
                          value={formData.totalArea}
                          onChange={(e) => setFormData({...formData, totalArea: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Ambientes</Label>
                        <Input 
                          type="number" 
                          placeholder="Ej: 4"
                          className="mt-2"
                          value={formData.rooms}
                          onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Dormitorios</Label>
                        <Input 
                          type="number" 
                          placeholder="Ej: 3"
                          className="mt-2"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Baños</Label>
                        <Input 
                          type="number" 
                          placeholder="Ej: 2"
                          className="mt-2"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Volver
                      </Button>
                      <Button 
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                        onClick={() => setStep(3)}
                        disabled={!formData.coveredArea}
                      >
                        Continuar <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Tu nombre</Label>
                      <Input 
                        placeholder="Ej: Juan Pérez"
                        className="mt-2"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>Teléfono (WhatsApp)</Label>
                      <Input 
                        placeholder="Ej: 261 555 1234"
                        className="mt-2"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>Email (opcional)</Label>
                      <Input 
                        type="email"
                        placeholder="Ej: juan@email.com"
                        className="mt-2"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                        Volver
                      </Button>
                      <Button 
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.phone}
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        Obtener Valoración
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            ¿Por qué usar nuestro tasador online?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Basado en datos reales',
                description: 'Nuestras valuaciones se basan en transacciones reales del mercado inmobiliario de Gran Mendoza.'
              },
              {
                icon: MapPin,
                title: 'Cobertura total',
                description: 'Cobrimos todos los departamentos de Gran Mendoza: Ciudad, Godoy Cruz, Guaymallén, Las Heras, Luján y Maipú.'
              },
              {
                icon: CheckCircle,
                title: 'Sin compromiso',
                description: 'La tasación es 100% gratuita y sin compromiso. Si querés una tasación profesional, te conectamos con un asesor.'
              }
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitás una tasación profesional?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Nuestros asesores pueden visitar tu propiedad y realizar una tasación 
            oficial certificada. Contactanos ahora.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+5492617166129">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </a>
            <a href="https://wa.me/5492617166129" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
