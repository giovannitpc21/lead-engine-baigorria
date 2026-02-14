import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home as HomeIcon, 
  Key, 
  Building, 
  TrendingUp, 
  Phone, 
  MapPin,
  Check,
  ArrowRight
} from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { CONTACTOS } from '@/lib/constants';

const SERVICES = [
  {
    icon: HomeIcon,
    title: 'Vender',
    description: 'Tasación profesional y venta rápida de tu propiedad al mejor precio.',
    link: '/vender',
    cta: 'Quiero vender',
    color: 'bg-[#c9a962]',
  },
  {
    icon: Key,
    title: 'Comprar',
    description: 'Encontrá tu hogar ideal entre cientos de propiedades disponibles.',
    link: '/comprar',
    cta: 'Ver propiedades',
    color: 'bg-[#2c3e50]',
  },
  {
    icon: Building,
    title: 'Alquilar',
    description: 'Alquileres administrados por APROAM con garantía de calidad.',
    link: '/alquilar',
    cta: 'Buscar alquiler',
    color: 'bg-[#2d4a3e]',
  },
  {
    icon: TrendingUp,
    title: 'Tasador Online',
    description: 'Conocé el valor estimado de tu propiedad en minutos.',
    link: '/tasador',
    cta: 'Tasar ahora',
    color: 'bg-[#c9a962]',
  },
];

const FEATURES = [
  'Más de 30 años de experiencia',
  'Cobertura en todo Gran Mendoza',
  'Asesores capacitados y certificados',
  'Tasación profesional gratuita',
  'Administración integral APROAM',
];

const ZONAS = [
  'Ciudad de Mendoza',
  'Godoy Cruz',
  'Guaymallén',
  'Las Heras',
  'Luján de Cuyo',
  'Maipú',
];

export const Home = () => {
  usePageviewTracking('home', { source: 'direct' });

  return (
    <>
      <Helmet>
        <title>Grupo Baigorria | Inmobiliaria en Gran Mendoza</title>
        <meta name="description" content="Century 21 Baigorria, APROAM y CCB. Venta, alquiler y administración de propiedades en Gran Mendoza. Tasación gratuita." />
        <meta name="keywords" content="inmobiliaria Mendoza, Century 21, APROAM, propiedades, tasación" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: 'Grupo Baigorria',
          description: 'Inmobiliaria en Gran Mendoza',
          telephone: '+54 9 261 716 6129',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mendoza',
            addressRegion: 'Mendoza',
            addressCountry: 'AR'
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-[#1a1a1a] text-white py-20 lg:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a962]/20 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-[#c9a962]" />
                <span className="text-[#c9a962] font-medium">Gran Mendoza, Argentina</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Tu propiedad en las{' '}
                <span className="text-[#c9a962]">mejores manos</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Grupo Baigorria: Century 21, APROAM y CCB unidos para ofrecerte 
                el mejor servicio inmobiliario de Gran Mendoza.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#c9a962] hover:bg-[#b8984f] text-black font-semibold"
                >
                  <Link to="/tasador">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Tasá gratis tu propiedad
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <a
                    href={`https://wa.me/${CONTACTOS.c21.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Hablar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Qué necesitás?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Elegí el servicio que se adapte a tus necesidades. 
                Estamos para ayudarte en cada paso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((service) => (
                <Card key={service.title} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                      <service.icon className={`w-6 h-6 ${service.color === 'bg-[#c9a962]' ? 'text-black' : 'text-white'}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {service.description}
                    </p>
                    <Link
                      to={service.link}
                      className="inline-flex items-center text-[#c9a962] font-medium hover:underline"
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  ¿Por qué elegir Grupo Baigorria?
                </h2>
                <p className="text-gray-600 mb-8">
                  Somos el grupo inmobiliario más consolidado de Gran Mendoza. 
                  Nuestra trayectoria y compromiso nos avalan.
                </p>
                <ul className="space-y-4">
                  {FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#c9a962]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[#c9a962]" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">
                  Cobertura en todo Gran Mendoza
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {ZONAS.map((zona) => (
                    <div
                      key={zona}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <MapPin className="w-4 h-4 text-[#c9a962]" />
                      <span className="text-sm">{zona}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    ¿No encontrás tu zona? Contactanos igual, 
                    probablemente también lleguemos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-[#c9a962]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-4">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-black/80 mb-8 text-lg">
              Contactanos hoy mismo y descubrí por qué somos la elección 
              de cientos de familias en Gran Mendoza.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-black hover:bg-gray-800 text-white font-semibold"
              >
                <Link to="/contacto">Contactanos</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-black text-black hover:bg-black/10"
              >
                <a
                  href={`tel:${CONTACTOS.c21.telefono}`}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Llamar ahora
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};