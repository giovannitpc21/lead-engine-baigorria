import { Helmet } from 'react-helmet-async';
import { Building, Shield, FileText, Users, TrendingUp, CheckCircle, Phone, MessageCircle, Home, Key, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePageviewTracking } from '@/hooks/useAnalytics';

const SERVICIOS = [
  {
    icon: Users,
    title: 'Selección de inquilinos',
    description: 'Verificación completa de antecedentes, historial crediticio y referencias laborales de potenciales inquilinos.'
  },
  {
    icon: FileText,
    title: 'Contratos y garantías',
    description: 'Redacción de contratos de alquiler conforme a la ley vigente. Gestión de garantías propietarias e institucionales.'
  },
  {
    icon: Wallet,
    title: 'Cobranza de alquileres',
    description: 'Cobro puntual de alquileres y expensas. Depósito directo en tu cuenta bancaria cada mes.'
  },
  {
    icon: Home,
    title: 'Mantenimiento',
    description: 'Coordinación de reparaciones y mantenimiento preventivo. Red de proveedores confiables y precios justos.'
  },
  {
    icon: Shield,
    title: 'Protección legal',
    description: 'Asesoramiento jurídico en caso de mora o incumplimiento. Cobertura de seguro de caución opcional.'
  },
  {
    icon: TrendingUp,
    title: 'Rendimiento',
    description: 'Informes mensuales de rentabilidad. Ajustes de precio según evolución del mercado inmobiliario.'
  }
];

const PASOS = [
  { num: '01', title: 'Contacto inicial', desc: 'Nos contás sobre tu propiedad y expectativas' },
  { num: '02', title: 'Evaluación', desc: 'Visitamos y evaluamos tu propiedad' },
  { num: '03', title: 'Propuesta', desc: 'Te presentamos nuestra propuesta de administración' },
  { num: '04', title: 'Contrato', desc: 'Firmamos el contrato de administración' },
  { num: '05', title: 'Publicación', desc: 'Publicamos tu propiedad en múltiples portales' },
  { num: '06', title: 'Inquilino', desc: 'Seleccionamos y gestionamos al inquilino ideal' }
];

const TESTIMONIOS = [
  {
    text: 'APROAM me permitió alquilar mi departamento sin preocupaciones. El pago es puntual todos los meses y cualquier problema lo resuelven rápido.',
    author: 'María G.',
    role: 'Propietaria en Godoy Cruz'
  },
  {
    text: 'Llevaban años buscando una inmobiliaria confiable para administrar mis propiedades. Con APROAM encontré profesionalismo y tranquilidad.',
    author: 'Carlos R.',
    role: 'Propietario de 3 unidades'
  },
  {
    text: 'El servicio de selección de inquilinos es excelente. En 3 años nunca tuve problemas de mora ni incumplimientos.',
    author: 'Laura M.',
    role: 'Propietaria en Luján de Cuyo'
  }
];

export default function AdministracionAlquileresMendoza() {
  usePageviewTracking('administracion_alquileres_mendoza', { source: 'seo_landing' });

  // Schema.org JSON-LD
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Administración de Alquileres Mendoza',
    description: 'Administración de propiedades en alquiler en Mendoza. APROAM se encarga de todo: selección de inquilinos, cobranza, mantenimiento y protección legal.',
    provider: {
      '@type': 'RealEstateAgent',
      name: 'APROAM - Administración de Propiedades Altos de Mendoza',
      telephone: '+54 9 261 390 7452',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mendoza',
        addressRegion: 'Mendoza',
        addressCountry: 'AR'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'Mendoza'
    },
    serviceType: 'Property Management'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta la administración de alquileres?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La comisión de administración es un porcentaje del valor del alquiler mensual, generalmente entre el 8% y 12% dependiendo de los servicios incluidos. Contactanos para una cotización personalizada.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué pasa si el inquilino no paga?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'APROAM cuenta con seguro de caución que cubre hasta 12 meses de alquiler impago. Además, nuestro equipo legal gestiona los procesos de desalojo si fuera necesario.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cómo seleccionan a los inquilinos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Realizamos una verificación completa que incluye: historial crediticio, verificación laboral, referencias de alquileres anteriores y entrevista personal.'
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Administración de Alquileres Mendoza | APROAM | Gestión de Propiedades</title>
        <meta name="description" content="Administración de propiedades en alquiler en Mendoza. APROAM: selección de inquilinos, cobranza, mantenimiento y protección legal. Tranquilidad para propietarios." />
        <meta name="keywords" content="administración alquileres Mendoza, administración propiedades Mendoza, alquileres Mendoza, APROAM, inmobiliaria alquileres Mendoza" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/administracion-alquileres-mendoza" />
        <meta property="og:title" content="Administración de Alquileres Mendoza | APROAM" />
        <meta property="og:description" content="Administración profesional de propiedades en alquiler. Tranquilidad para propietarios en Mendoza." />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building className="w-4 h-4" />
              APROAM - Administración de Propiedades
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Administración de alquileres en{' '}
              <span className="text-yellow-400">Mendoza</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Nos encargamos de todo: selección de inquilinos, cobranza, mantenimiento 
              y protección legal. Vos solo recibís el alquiler en tu cuenta.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/alquilar">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
                  <Key className="w-5 h-5 mr-2" />
                  Quiero Administrar mi Propiedad
                </Button>
              </a>
              <a href="https://wa.me/5492613907452" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp APROAM
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-yellow-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-900">
            {[
              { number: '15+', label: 'Años de experiencia' },
              { number: '800+', label: 'Propiedades administradas' },
              { number: '99%', label: 'Cobranza puntual' },
              { number: '0', label: 'Preocupaciones para vos' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                <div className="text-sm font-medium opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ¿Qué incluye nuestra administración?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Un servicio completo para que vos no tengas que preocuparte por nada. 
              Nos encargamos de tu propiedad como si fuera nuestra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICIOS.map((servicio, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <servicio.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{servicio.title}</h3>
                  <p className="text-slate-600 text-sm">{servicio.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-slate-600">
              Un proceso simple y transparente para empezar a administrar tu propiedad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PASOS.map((paso, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                  {paso.num}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{paso.title}</h3>
                  <p className="text-slate-600 text-sm">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cobertura Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Cobertura en todo Gran Mendoza
              </h2>
              <p className="text-slate-600 mb-6">
                Administramos propiedades en todos los departamentos de Gran Mendoza. 
                Donde sea que esté tu propiedad, podemos ayudarte.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Ciudad de Mendoza', 'Godoy Cruz', 'Guaymallén', 'Las Heras', 'Luján de Cuyo', 'Maipú'].map((zona, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">{zona}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                ¿Por qué elegir APROAM?
              </h3>
              <ul className="space-y-4">
                {[
                  '15 años de experiencia en el mercado mendocino',
                  'Cobranza puntual garantizada',
                  'Selección rigurosa de inquilinos',
                  'Cobertura de seguro de caución',
                  'Asesoramiento legal incluido',
                  'Informes mensuales de rentabilidad'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Lo que dicen nuestros clientes
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIOS.map((test, i) => (
              <Card key={i} className="bg-white">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-6 italic">"{test.text}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{test.author}</p>
                    <p className="text-sm text-slate-500">{test.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Preguntas frecuentes
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto cuesta la administración de alquileres?',
                  a: 'La comisión de administración es un porcentaje del valor del alquiler mensual, generalmente entre el 8% y 12% dependiendo de los servicios incluidos. Contactanos para una cotización personalizada sin compromiso.'
                },
                {
                  q: '¿Qué pasa si el inquilino no paga?',
                  a: 'APROAM cuenta con seguro de caución que cubre hasta 12 meses de alquiler impago. Además, nuestro equipo legal gestiona los procesos de desalojo si fuera necesario, sin costo adicional para el propietario.'
                },
                {
                  q: '¿Cómo seleccionan a los inquilinos?',
                  a: 'Realizamos una verificación completa que incluye: historial crediticio en Veraz y similar, verificación de empleo e ingresos, referencias de alquileres anteriores, y entrevista personal. Solo aprobamos inquilinos que cumplan con todos nuestros requisitos.'
                },
                {
                  q: '¿Cuándo recibo el pago del alquiler?',
                  a: 'Los alquileres se depositan en tu cuenta bancaria entre los días 1 y 5 de cada mes. Te enviamos un informe detallado con el estado de tu propiedad y cualquier novedad.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para dejar de preocuparte por tu propiedad?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Contactanos hoy mismo y empezá a disfrutar de los beneficios de 
            una administración profesional de tu propiedad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/alquilar">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                <Key className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
            </a>
            <a href="tel:+5492613907452">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Phone className="w-5 h-5 mr-2" />
                Llamar a APROAM
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-emerald-200">
            WhatsApp: <a href="https://wa.me/5492613907452" className="underline hover:text-white">+54 9 261 390 7452</a>
          </p>
        </div>
      </section>
    </>
  );
}
