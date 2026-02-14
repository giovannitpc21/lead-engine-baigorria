import { Helmet } from 'react-helmet-async';
import { AlquilarForm } from '@/components/forms/AlquilarForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Phone, Shield, FileCheck, Wrench } from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { CONTACTOS } from '@/lib/constants';

const SERVICES = [
  {
    icon: Shield,
    title: 'Garantía de alquiler',
    description: 'Garantizamos el cumplimiento del contrato para propietarios e inquilinos.',
  },
  {
    icon: FileCheck,
    title: 'Contratos digitales',
    description: 'Gestión 100% online de documentación y pagos.',
  },
  {
    icon: Wrench,
    title: 'Mantenimiento',
    description: 'Red de proveedores para reparaciones y mantenimiento.',
  },
];

export const Alquilar = () => {
  usePageviewTracking('rent', { source: 'direct' });

  return (
    <>
      <Helmet>
        <title>Alquileres en Mendoza | APROAM Administración</title>
        <meta name="description" content="Alquileres residenciales y comerciales en Gran Mendoza. Administración de propiedades APROAM." />
        <meta name="keywords" content="alquiler Mendoza, alquiler departamento Mendoza, APROAM" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/alquilar" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#2d4a3e] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a962] mb-4">
              <Building className="w-5 h-5" />
              <span className="font-medium">Alquilar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Alquilá con APROAM
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Administración de Propiedades Altos de Mendoza. 
              Especialistas en alquileres residenciales y comerciales.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <AlquilarForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* APROAM Info */}
              <Card className="bg-[#2d4a3e] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-[#c9a962]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">APROAM</h3>
                      <p className="text-gray-300 text-sm">
                        Administración de Propiedades
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Más de 15 años de experiencia administrando propiedades 
                    en Gran Mendoza con total transparencia.
                  </p>
                  <div className="space-y-2 text-sm">
                    <a
                      href={`tel:${CONTACTOS.aproam.telefono}`}
                      className="flex items-center gap-2 text-[#c9a962] hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {CONTACTOS.aproam.telefono}
                    </a>
                    <a
                      href={`https://wa.me/${CONTACTOS.aproam.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#c9a962] hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp APROAM
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Servicios APROAM
                  </h3>
                  <div className="space-y-4">
                    {SERVICES.map((service) => (
                      <div key={service.title} className="flex gap-3">
                        <div className="w-10 h-10 bg-[#2d4a3e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-5 h-5 text-[#2d4a3e]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {service.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Owner CTA */}
              <Card className="bg-[#c9a962]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-black mb-2">
                    ¿Sos propietario?
                  </h3>
                  <p className="text-black/80 text-sm mb-4">
                    Dejanos administrar tu propiedad. Garantía de cobro y cero preocupaciones.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    <a
                      href={`https://wa.me/${CONTACTOS.aproam.whatsapp}?text=Hola,%20soy%20propietario%20y%20quiero%20información%20sobre%20administración`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Consultar por administración
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info for owners */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ¿Tenés una propiedad para alquilar?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    APROAM te ofrece un servicio integral de administración: 
                    buscamos inquilinos, garantizamos el cobro, nos ocupamos 
                    de la documentación y del mantenimiento.
                  </p>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Garantía de cobro mensual',
                      'Selección de inquilinos',
                      'Contratos digitales',
                      'Mantenimiento incluido',
                      'Reportes mensuales',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 bg-[#2d4a3e] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="bg-[#2d4a3e] hover:bg-[#1f352c] text-white"
                  >
                    <a
                      href={`https://wa.me/${CONTACTOS.aproam.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contactar APROAM
                    </a>
                  </Button>
                </div>
                <div className="bg-[#2d4a3e]/10 rounded-xl p-6">
                  <div className="text-center">
                    <Building className="w-16 h-16 text-[#2d4a3e] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#2d4a3e] mb-2">
                      +500 propiedades
                    </h3>
                    <p className="text-gray-600">
                      administradas en Gran Mendoza
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};