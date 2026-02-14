import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { 
  Home, 
  MapPin, 
  Search, 
  Bed,
  Bath,
  Ruler,
  Loader2,
  Star,
  Phone
} from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { useProperties, type Property } from '@/hooks/useProperties';
import { DEPARTAMENTOS, TIPOS_PROPIEDAD } from '@/lib/constants';

export const Propiedades = () => {
  usePageviewTracking('properties', { source: 'direct' });

  const { getProperties, loading } = useProperties();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    tipo: '',
    operacion: '',
    departamento: '',
    precioMin: '',
    precioMax: '',
  });

  useEffect(() => {
    const loadProperties = async () => {
      const result = await getProperties({
        tipo: filters.tipo as Property['tipo'] || undefined,
        operacion: filters.operacion as Property['operacion'] || undefined,
        departamento: filters.departamento || undefined,
        precioMin: filters.precioMin ? parseInt(filters.precioMin) : undefined,
        precioMax: filters.precioMax ? parseInt(filters.precioMax) : undefined,
        activa: true,
        limit: 50,
      });
      
      if (result.success && result.data) {
        setProperties(result.data);
      }
    };

    loadProperties();
  }, [getProperties, filters.tipo, filters.operacion, filters.departamento, filters.precioMin, filters.precioMax]);

  const handleFilter = () => {
    // Los filtros ya están actualizados en el estado, el useEffect se encargará de recargar
  };

  const clearFilters = () => {
    setFilters({
      tipo: '',
      operacion: '',
      departamento: '',
      precioMin: '',
      precioMax: '',
    });
    // El useEffect se encargará de recargar cuando cambien los filtros
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Propiedades en Venta Mendoza | Century 21 Baigorria</title>
        <meta name="description" content="Explorá nuestras propiedades en venta en Gran Mendoza. Casas, departamentos, terrenos y más." />
        <meta name="keywords" content="propiedades venta Mendoza, casas venta Mendoza, departamentos Mendoza" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/propiedades" />
      </Helmet>

      {/* Header */}
      <div className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#c9a962] mb-4">
            <Home className="w-5 h-5" />
            <span className="font-medium">Propiedades</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Encontrá tu propiedad ideal
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Explorá nuestras propiedades disponibles en Gran Mendoza. 
            Casas, departamentos, terrenos y más.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo</label>
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Todos</option>
                  {TIPOS_PROPIEDAD.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Operación</label>
                <select
                  value={filters.operacion}
                  onChange={(e) => setFilters({ ...filters, operacion: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Todas</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Zona</label>
                <select
                  value={filters.departamento}
                  onChange={(e) => setFilters({ ...filters, departamento: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Todas</option>
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Precio máx (USD)</label>
                <Input
                  type="number"
                  value={filters.precioMax}
                  onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
                  placeholder="Ej: 200000"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} className="bg-[#c9a962] hover:bg-[#b8984f] text-black flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#c9a962]" />
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron propiedades</p>
              <p className="text-gray-400 text-sm mt-2">Probá con otros filtros</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-gray-500 mb-4">
              {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <Link to={`/propiedad/${property.id}`}>
      <Card className="group hover:shadow-lg transition-shadow h-full">
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          {property.imagen_principal ? (
            <img
              src={property.imagen_principal}
              alt={property.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Home className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {property.destacada && (
            <div className="absolute top-2 left-2 bg-[#c9a962] text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3" />
              Destacada
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
            {property.operacion}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{property.tipo}</p>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{property.titulo}</h3>
            </div>
          </div>
          
          <p className="text-[#c9a962] font-bold text-xl mb-2">
            {property.moneda} {property.precio.toLocaleString()}
          </p>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span className="capitalize">{property.departamento}</span>
            {property.barrio && <span>· {property.barrio}</span>}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              {property.metros_cubiertos} m²
            </span>
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.dormitorios}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.banos}
            </span>
          </div>

          {property.advisor && (
            <div className="mt-3 pt-3 border-t flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Asesor</p>
                <p className="font-medium text-gray-900">{property.advisor.nombre} {property.advisor.apellido}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};