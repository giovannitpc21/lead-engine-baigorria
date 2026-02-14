import { Helmet } from 'react-helmet-async';
import { ContactoForm } from '@/components/forms/ContactoForm';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Building2, Home, GraduationCap } from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { CONTACTOS } from '@/lib/constants';

export const Contacto = () => {
  usePageviewTracking('contact', { source: 'direct' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Contacto | Grupo Baigorria - Century 21, APROAM, CCB</title>
        <meta name="description" content="Contactá a Grupo Baigorria. Century 21 Baigorria, APROAM y CCB. Estamos para ayudarte." />
        <link rel="canonical" href="https://grupobaigorria.com.ar/contacto" />
      </Helmet>

      {/* Header */}
      <div className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#c9a962] mb-4">
            <Phone className="w-5 h-5" />
            <span className="font-medium">Contacto</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Estamos para ayudarte
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Escribinos por el formulario, WhatsApp o llamanos directamente. 
            Respondemos a la brevedad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <ContactoForm />
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            {/* Century 21 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#c9a962] rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Century 21 Baigorria</h3>
                    <p className="text-gray-500 text-sm">Ventas y compras</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`tel:${CONTACTOS.c21.telefono}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#c9a962]"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{CONTACTOS.c21.telefono}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://wa.me/${CONTACTOS.c21.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-[#c9a962]"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${CONTACTOS.c21.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#c9a962]"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{CONTACTOS.c21.email}</span>
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{CONTACTOS.c21.direccion}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* APROAM */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2d4a3e] rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">APROAM</h3>
                    <p className="text-gray-500 text-sm">Alquileres y administración</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`tel:${CONTACTOS.aproam.telefono}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#2d4a3e]"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{CONTACTOS.aproam.telefono}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://wa.me/${CONTACTOS.aproam.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-[#2d4a3e]"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">WhatsApp APROAM</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${CONTACTOS.aproam.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#2d4a3e]"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{CONTACTOS.aproam.email}</span>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CCB */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2c3e50] rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">CCB</h3>
                    <p className="text-gray-500 text-sm">Centro de Capacitación Baigorria</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Programa SOI30 - Sprint Operativo Intensivo 30 días
                </p>
                <a
                  href="/trabaja-con-nosotros"
                  className="text-[#2c3e50] hover:underline text-sm font-medium"
                >
                  Conocer más sobre SOI30 →
                </a>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card className="bg-[#1a1a1a] text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#c9a962]" />
                  <h3 className="font-semibold">Horario de atención</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lunes a Viernes</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sábados</span>
                    <span>9:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domingos</span>
                    <span className="text-gray-500">Cerrado</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-4">
                  WhatsApp disponible 24/7
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};