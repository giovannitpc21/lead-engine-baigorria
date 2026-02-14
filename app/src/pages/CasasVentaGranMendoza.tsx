import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Home, Bed, Bath, Maximize, Phone, MessageCircle, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePageviewTracking, useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/lib/supabase';

interface Property {
  id: string;
  title: string;
  location: string;
  department: string;
  price: number;
  coveredArea: number;
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  operationType: string;
  advisorPhone?: string;
}

const DEPARTAMENTOS = ['Todos', 'Ciudad', 'Godoy Cruz', 'Guaymallén', 'Las Heras', 'Luján de Cuyo', 'Maipú'];

export default function CasasVentaGranMendoza() {
  usePageviewTracking('casas_venta_gran_mendoza', { source: 'seo_landing' });
  const { trackClick } = useAnalytics();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('Todos');

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .eq('is_active', true)
          .eq('operation_type', 'venta')
          .order('is_featured', { ascending: false })
          .limit(12);

        if (selectedDept !== 'Todos') {
          query = query.ilike('department', `%${selectedDept}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error('Error loading properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProperties();
  }, [selectedDept]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Schema.org JSON-LD
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Casas en Venta Gran Mendoza',
    description: 'Encontrá casas y departamentos en venta en Gran Mendoza. Las mejores propiedades en Ciudad, Godoy Cruz, Guaymallén, Las Heras, Luján de Cuyo y Maipú.',
    url: 'https://grupobaigorria.com.ar/casas-venta-gran-mendoza',
    itemListElement: properties.map((prop, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: prop.title,
        description: `${prop.bedrooms} dormitorios, ${prop.bathrooms} baños, ${prop.coveredArea}m² cubiertos`,
        url: `https://grupobaigorria.com.ar/propiedad/${prop.id}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: prop.department,
          addressRegion: 'Mendoza',
          addressCountry: 'AR'
        },
        offers: {
          '@type': 'Offer',
          price: prop.price,
          priceCurrency: 'ARS'
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Casas en Venta Gran Mendoza | Century 21 Baigorria | Propiedades 2025</title>
        <meta name="description" content="Encontrá casas y departamentos en venta en Gran Mendoza. Propiedades en Ciudad, Godoy Cruz, Guaymallén, Las Heras, Luján de Cuyo y Maipú. Century 21 Baigorria." />
        <meta name="keywords" content="casas venta Mendoza, departamentos venta Mendoza, propiedades Gran Mendoza, inmobiliaria Mendoza, casas Godoy Cruz, departamentos Luján de Cuyo" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/casas-venta-gran-mendoza" />
        <meta property="og:title" content="Casas en Venta Gran Mendoza | Century 21 Baigorria" />
        <meta property="og:description" content="Encontrá tu próxima casa en Gran Mendoza. Propiedades en todos los departamentos." />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" />
              Propiedades Actualizadas
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Casas en venta en{' '}
              <span className="text-yellow-400">Gran Mendoza</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Encontrá tu próxima casa en Ciudad, Godoy Cruz, Guaymallén, Las Heras, 
              Luján de Cuyo o Maipú. Las mejores propiedades del mercado.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/comprar">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
                  <Filter className="w-5 h-5 mr-2" />
                  Buscador Avanzado
                </Button>
              </a>
              <a href="https://wa.me/5492617166129" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Asesoramiento
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-slate-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">
              <Filter className="w-4 h-4 inline mr-1" />
              Filtrar por departamento:
            </span>
            {DEPARTAMENTOS.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDept === dept
                    ? 'bg-yellow-500 text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-8 bg-slate-200 rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No hay propiedades disponibles
              </h3>
              <p className="text-slate-500 mb-6">
                En este momento no tenemos propiedades en {selectedDept}. 
                Contactanos para conocer nuevas opciones.
              </p>
              <a href="https://wa.me/5492617166129" target="_blank" rel="noopener noreferrer">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-600">
                  Mostrando <span className="font-semibold">{properties.length}</span> propiedades
                  {selectedDept !== 'Todos' && ` en ${selectedDept}`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(prop => (
                  <Card key={prop.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={prop.images?.[0] || '/placeholder-property.jpg'}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-yellow-500 text-slate-900">
                        Venta
                      </Badge>
                      {prop.images && prop.images.length > 1 && (
                        <Badge className="absolute top-3 right-3 bg-slate-900/80 text-white">
                          +{prop.images.length - 1} fotos
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{prop.title}</h3>
                      <p className="text-sm text-slate-500 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {prop.department}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                        {prop.bedrooms > 0 && (
                          <span className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {prop.bedrooms}
                          </span>
                        )}
                        {prop.bathrooms > 0 && (
                          <span className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {prop.bathrooms}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Maximize className="w-4 h-4 mr-1" />
                          {prop.coveredArea}m²
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-slate-900">
                          {formatPrice(prop.price)}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <a 
                          href={`/propiedad/${prop.id}`} 
                          className="flex-1"
                          onClick={() => trackClick('property_detail', { propertyId: prop.id })}
                        >
                          <Button variant="outline" className="w-full">
                            Ver más
                          </Button>
                        </a>
                        <a 
                          href={`https://wa.me/${prop.advisorPhone || '5492617166129'}?text=Hola, me interesa la propiedad: ${encodeURIComponent(prop.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick('whatsapp_property', { propertyId: prop.id })}
                        >
                          <Button className="bg-green-500 hover:bg-green-600 text-white">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-10">
                <a href="/propiedades">
                  <Button variant="outline" size="lg">
                    Ver todas las propiedades
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Zonas Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            ¿Dónde querés comprar?
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Tenemos propiedades en todos los departamentos de Gran Mendoza. 
            Elegí la zona que más se adapte a tus necesidades.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Ciudad de Mendoza', desc: 'El corazón de la provincia. Excelente conectividad y servicios.', properties: '120+' },
              { name: 'Godoy Cruz', desc: 'Zona comercial con gran desarrollo. Ideal para familias.', properties: '85+' },
              { name: 'Guaymallén', desc: 'Barrios residenciales tranquilos. Buena relación precio-calidad.', properties: '95+' },
              { name: 'Las Heras', desc: 'Cercanía a la montaña. Perfecto para amantes de la naturaleza.', properties: '70+' },
              { name: 'Luján de Cuyo', desc: 'Zona vitivinícola. Paisajes únicos y alta plusvalía.', properties: '60+' },
              { name: 'Maipú', desc: 'Desarrollo industrial y residencial. Excelente inversión.', properties: '55+' }
            ].map((zona, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedDept(zona.name)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-slate-900">{zona.name}</h3>
                    <Badge variant="secondary">{zona.properties} propiedades</Badge>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{zona.desc}</p>
                  <button 
                    className="text-yellow-600 text-sm font-medium flex items-center hover:underline"
                    onClick={() => setSelectedDept(zona.name)}
                  >
                    Ver propiedades <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿No encontraste lo que buscás?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Contanos qué tipo de propiedad estás buscando y te avisamos cuando 
            tengamos opciones que se adapten a tus necesidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/comprar">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                <Filter className="w-5 h-5 mr-2" />
                Buscador Avanzado
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