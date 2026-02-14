import { Helmet } from 'react-helmet-async';
import { ComprarForm } from '@/components/forms/ComprarForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Search, ExternalLink, Phone, MapPin, Home } from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { CONTACTOS } from '@/lib/constants';

const FEATURED_ZONES = [
  { name: 'Ciudad de Mendoza', count: 45 },
  { name: 'Godoy Cruz', count: 32 },
  { name: 'Luján de Cuyo', count: 28 },
  { name: 'Guaymallén', count: 24 },
  { name: 'Las Heras', count: 18 },
  { name: 'Maipú', count: 15 },
];

export const Comprar = () => {
  usePageviewTracking('buy', { source: 'direct' });

  return (
    <>
      <Helmet>
        <title>Comprar Propiedad en Mendoza | Century 21 Baigorria</title>
        <meta name="description" content="Encontrá tu hogar ideal en Gran Mendoza. Casas, departamentos y terrenos en venta." />
        <meta name="keywords" content="comprar casa Mendoza, departamentos venta Mendoza, propiedades Mendoza" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/comprar" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a962] mb-4">
              <Key className="w-5 h-5" />
              <span className="font-medium">Comprar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Encontrá tu hogar ideal
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Cientos de propiedades disponibles en Gran Mendoza. 
              Contanos qué buscás y te ayudamos a encontrarla.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <ComprarForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Portal CTA */}
              <Card className="bg-[#c9a962]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">
                        Ver todas las propiedades
                      </h3>
                      <p className="text-black/70 text-sm">
                        En el portal Century 21
                      </p>
                    </div>
                  </div>
                  <p className="text-black/80 text-sm mb-4">
                    Explorá el catálogo completo de propiedades en venta 
                    filtradas por Gran Mendoza.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    <a
                      href="https://www.century21.com.ar/propiedades?ubicacion=mendoza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ir al portal Century 21
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Zones */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#c9a962]" />
                    Propiedades por zona
                  </h3>
                  <div className="space-y-2">
                    {FEATURED_ZONES.map((zone) => (
                      <div
                        key={zone.name}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-700 text-sm">{zone.name}</span>
                        <span className="text-[#c9a962] font-medium text-sm">
                          {zone.count} prop.
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="bg-[#1a1a1a]">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-[#c9a962] mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">
                    ¿Necesitás ayuda?
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Un asesor puede guiarte en la búsqueda.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#c9a962] text-[#c9a962] hover:bg-[#c9a962]/10"
                  >
                    <a href={`tel:${CONTACTOS.c21.telefono}`}>
                      {CONTACTOS.c21.telefono}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ¿Por qué comprar con Century 21 Baigorria?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Home className="w-10 h-10 text-[#c9a962] mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Amplia variedad
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Desde departamentos hasta casas y terrenos. 
                    Tenemos opciones para todos los presupuestos.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="w-10 h-10 text-[#c9a962] mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Conocimiento local
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Conocemos cada barrio de Gran Mendoza. 
                    Te asesoramos sobre la mejor zona para vos.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Key className="w-10 h-10 text-[#c9a962] mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Acompañamiento integral
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Desde la búsqueda hasta la escritura. 
                    Estamos con vos en todo el proceso.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};