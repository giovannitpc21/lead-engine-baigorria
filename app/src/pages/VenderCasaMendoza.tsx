import { Helmet } from 'react-helmet-async';
import { Home, TrendingUp, Shield, Clock, Users, CheckCircle, ArrowRight, Phone, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePageviewTracking } from '@/hooks/useAnalytics';

const VENTAJAS = [
  {
    icon: TrendingUp,
    title: 'Máximo valor de venta',
    description: 'Estrategia de precio basada en análisis de mercado para obtener el mejor precio en el menor tiempo.'
  },
  {
    icon: Users,
    title: 'Red de compradores',
    description: 'Acceso a nuestra base de más de 5,000 compradores activos buscando propiedades en Mendoza.'
  },
  {
    icon: Shield,
    title: 'Seguridad jurídica',
    description: 'Acompañamiento legal en todo el proceso. Revisión de documentación y escrituración.'
  },
  {
    icon: Clock,
    title: 'Venta en 90 días',
    description: 'Nuestro promedio de venta es de 90 días, gracias a nuestra estrategia de marketing digital.'
  }
];

const PROCESO = [
  { step: 1, title: 'Tasación gratuita', desc: 'Valoramos tu propiedad sin cargo' },
  { step: 2, title: 'Fotos profesionales', desc: 'Sesión de fotos y video 360°' },
  { step: 3, title: 'Publicación', desc: 'Publicamos en 15+ portales' },
  { step: 4, title: 'Visitas', desc: 'Coordinamos y acompañamos visitas' },
  { step: 5, title: 'Negociación', desc: 'Te representamos en la negociación' },
  { step: 6, title: 'Escrituración', desc: 'Acompañamiento hasta la escritura' }
];

export default function VenderCasaMendoza() {
  usePageviewTracking('vender_casa_mendoza', { source: 'seo_landing' });

  // Schema.org JSON-LD
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Vender Casa en Mendoza',
    description: 'Vendé tu casa en Mendoza con Century 21 Baigorria. Tasación gratuita, fotos profesionales y venta en 90 días promedio.',
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
      name: 'Mendoza'
    },
    serviceType: 'Real Estate Selling'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuánto tarda en venderse una casa en Mendoza?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En Century 21 Baigorria, nuestro promedio de venta es de 90 días. Esto depende del precio, ubicación y estado de la propiedad.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta vender una casa con Century 21?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La comisión es un porcentaje del valor de venta, acordado al momento de la firma del contrato. La tasación y fotos profesionales son gratuitas.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué documentación necesito para vender mi casa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Necesitás el título de propiedad, DNI del titular, y constancia de impuestos al día. Nuestro equipo te ayuda con toda la documentación.'
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Vender Casa en Mendoza | Century 21 Baigorria | Venta en 90 Días</title>
        <meta name="description" content="Vendé tu casa en Mendoza con Century 21 Baigorria. Tasación gratuita, fotos profesionales, publicación en 15+ portales. Venta en 90 días promedio." />
        <meta name="keywords" content="vender casa Mendoza, vender departamento Mendoza, inmobiliaria Mendoza, Century 21 Baigorria, tasación gratis Mendoza" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/vender-casa-mendoza" />
        <meta property="og:title" content="Vender Casa en Mendoza | Century 21 Baigorria" />
        <meta property="og:description" content="Vendé tu casa en Mendoza. Tasación gratis, fotos profesionales, venta en 90 días promedio." />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" />
              Especialistas en Mendoza
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Vendé tu casa en{' '}
              <span className="text-yellow-400">Mendoza</span> al mejor precio
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Tasación gratuita, fotos profesionales y publicación en 15+ portales. 
              Vendemos tu propiedad en un promedio de 90 días.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/vender">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
                  <FileText className="w-5 h-5 mr-2" />
                  Quiero Vender mi Casa
                </Button>
              </a>
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
      <section className="py-12 bg-yellow-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-900">
            {[
              { number: '90', label: 'Días promedio de venta' },
              { number: '500+', label: 'Propiedades vendidas' },
              { number: '15+', label: 'Portales de publicación' },
              { number: '5,000+', label: 'Compradores activos' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                <div className="text-sm font-medium opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ¿Por qué vender con Century 21 Baigorria?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Somos la inmobiliaria líder en Gran Mendoza con más de 15 años de experiencia 
              ayudando a familias a vender sus propiedades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VENTAJAS.map((ventaja, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ventaja.icon className="w-7 h-7 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{ventaja.title}</h3>
                  <p className="text-slate-600 text-sm">{ventaja.description}</p>
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
              ¿Cómo vendemos tu casa?
            </h2>
            <p className="text-slate-600">
              Un proceso simple y transparente para vender tu propiedad sin preocupaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROCESO.map((paso, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm h-full">
                  <div className="w-10 h-10 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                    {paso.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{paso.title}</h3>
                  <p className="text-sm text-slate-600">{paso.desc}</p>
                </div>
                {i < PROCESO.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zonas Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Vendemos propiedades en todo Gran Mendoza
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Ciudad de Mendoza', 'Godoy Cruz', 'Guaymallén', 'Las Heras', 'Luján de Cuyo', 'Maipú'].map((zona, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4 text-center">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-slate-700">{zona}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Preguntas frecuentes
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto tarda en venderse una casa en Mendoza?',
                  a: 'En Century 21 Baigorria, nuestro promedio de venta es de 90 días. Esto depende del precio, ubicación y estado de la propiedad. Las propiedades bien precadas se venden más rápido.'
                },
                {
                  q: '¿Cuánto cuesta vender una casa con Century 21?',
                  a: 'La comisión es un porcentaje del valor de venta, acordado al momento de la firma del contrato. La tasación inicial, fotos profesionales y publicación en portales son gratuitas.'
                },
                {
                  q: '¿Qué documentación necesito para vender mi casa?',
                  a: 'Necesitás el título de propiedad, DNI del titular, y constancia de impuestos al día (municipal, inmobiliario, etc.). Nuestro equipo te ayuda con toda la documentación necesaria.'
                },
                {
                  q: '¿Publican en portales inmobiliarios?',
                  a: 'Sí, publicamos tu propiedad en más de 15 portales incluyendo Zonaprop, MercadoLibre, Properati, y nuestro sitio web. También hacemos marketing en redes sociales.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para vender tu casa?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Completá el formulario y un asesor se contactará en menos de 24 horas 
            para coordinar una tasación gratuita.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/vender">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                <FileText className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
            </a>
            <a href="tel:+5492617166129">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Phone className="w-5 h-5 mr-2" />
                Llamar
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
