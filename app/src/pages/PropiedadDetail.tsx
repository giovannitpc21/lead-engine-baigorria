import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  Bed,
  Bath,
  Ruler,
  Loader2,
  ArrowLeft,
  Phone,
  Mail,
  Share2,
  Check,
  Car,
  TreePine,
  Waves
} from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { useProperties, type Property } from '@/hooks/useProperties';
import { EXTRAS_PROPIEDAD } from '@/lib/constants';

export const PropiedadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProperty, loading } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  usePageviewTracking('property_detail', { property_id: id });

  useEffect(() => {
    if (id) {
      const loadProperty = async () => {
        const result = await getProperty(id);
        if (result.success && result.data) {
          setProperty(result.data);
        }
      };
      
      loadProperty();
    }
  }, [id, getProperty]);

  const getWhatsAppLink = () => {
    if (!property?.advisor?.whatsapp) return '#';
    const message = encodeURIComponent(
      `Hola ${property.advisor.nombre}, vi la propiedad "${property.titulo}" en ${property.departamento} y me interesa. ¿Podemos hablar?`
    );
    return `https://wa.me/${property.advisor.whatsapp}?text=${message}`;
  };

  const getExtraLabel = (value: string) => {
    const extra = EXTRAS_PROPIEDAD.find((e) => e.value === value);
    return extra?.label || value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Helmet>
          <title>Propiedad no encontrada | Century 21 Baigorria</title>
        </Helmet>
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Propiedad no encontrada</h2>
            <p className="text-gray-500 mb-4">La propiedad que buscás no existe o fue eliminada.</p>
            <Link to="/propiedades">
              <Button className="bg-[#c9a962] hover:bg-[#b8984f] text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ver todas las propiedades
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = property.imagenes?.length > 0 
    ? property.imagenes 
    : property.imagen_principal 
      ? [property.imagen_principal] 
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{property.titulo} | Century 21 Baigorria</title>
        <meta name="description" content={`${property.tipo} en ${property.departamento}. ${property.metros_cubiertos}m² - ${property.dormitorios} dormitorios. ${property.moneda} ${property.precio?.toLocaleString()}`} />
        <link rel="canonical" href={`https://grupobaigorria.com.ar/propiedad/${id}`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/propiedades" className="flex items-center gap-2 text-gray-600 hover:text-[#c9a962]">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a propiedades</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <Card className="mb-6 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={property.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Home className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-black/70 text-white capitalize">
                    {property.operacion}
                  </Badge>
                  <Badge className="bg-[#c9a962] text-black capitalize">
                    {property.tipo}
                  </Badge>
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 ${
                        activeImage === idx ? 'border-[#c9a962]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{property.titulo}</h1>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">{property.departamento}</span>
                      {property.barrio && <span>· {property.barrio}</span>}
                      <span>· {property.direccion}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#c9a962]">
                      {property.moneda} {property.precio.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-4 gap-4 py-6 border-y">
                  <div className="text-center">
                    <Ruler className="w-6 h-6 text-[#c9a962] mx-auto mb-1" />
                    <p className="text-2xl font-bold">{property.metros_cubiertos}</p>
                    <p className="text-sm text-gray-500">m² cubiertos</p>
                  </div>
                  <div className="text-center">
                    <Bed className="w-6 h-6 text-[#c9a962] mx-auto mb-1" />
                    <p className="text-2xl font-bold">{property.dormitorios}</p>
                    <p className="text-sm text-gray-500">dormitorios</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-[#c9a962] mx-auto mb-1" />
                    <p className="text-2xl font-bold">{property.banos}</p>
                    <p className="text-sm text-gray-500">baños</p>
                  </div>
                  <div className="text-center">
                    <Home className="w-6 h-6 text-[#c9a962] mx-auto mb-1" />
                    <p className="text-2xl font-bold">{property.ambientes}</p>
                    <p className="text-sm text-gray-500">ambientes</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3">Descripción</h2>
                  <p className="text-gray-600 whitespace-pre-line">{property.descripcion}</p>
                </div>

                {/* Extras */}
                {property.extras && property.extras.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Características</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.extras.map((extra) => (
                        <span
                          key={extra}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-[#c9a962]" />
                          {getExtraLabel(extra)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                  <div className="flex gap-4">
                    {property.garage && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Car className="w-5 h-5 text-[#c9a962]" />
                        <span>Garage/Cochera</span>
                      </div>
                    )}
                    {property.patio && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <TreePine className="w-5 h-5 text-[#c9a962]" />
                        <span>Patio/Jardín</span>
                      </div>
                    )}
                    {property.pileta && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Waves className="w-5 h-5 text-[#c9a962]" />
                        <span>Pileta</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-[#1a1a1a] text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">¿Te interesa esta propiedad?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Contactá directamente al asesor responsable de esta propiedad.
                </p>

                {property.advisor ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#c9a962] rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {property.advisor.nombre[0]}{property.advisor.apellido[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{property.advisor.nombre} {property.advisor.apellido}</p>
                        <p className="text-sm text-gray-400">Asesor inmobiliario</p>
                      </div>
                    </div>

                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Phone className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>

                    <a href={`tel:${property.advisor.telefono}`} className="block">
                      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                        <Phone className="w-4 h-4 mr-2" />
                        Llamar
                      </Button>
                    </a>

                    <a href={`mailto:${property.advisor.email}`} className="block">
                      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400">Asesor no asignado</p>
                    <Link to="/contacto">
                      <Button className="mt-4 bg-[#c9a962] hover:bg-[#b8984f] text-black">
                        Contactar oficina
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Compartir</h3>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: property.titulo,
                        text: `Mirá esta propiedad: ${property.titulo}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copiado al portapapeles');
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir propiedad
                </Button>
              </CardContent>
            </Card>

            {/* Reference */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">
                  Ref: {property.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Publicado: {new Date(property.fecha_publicacion).toLocaleDateString('es-AR')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};