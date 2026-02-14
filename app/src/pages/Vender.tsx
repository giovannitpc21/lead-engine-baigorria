import { Helmet } from 'react-helmet-async';
import { VenderForm } from '@/components/forms/VenderForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Phone, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { CONTACTOS } from '@/lib/constants';

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Tasación gratuita',
    description: 'Conocé el valor real de tu propiedad sin compromiso.',
  },
  {
    icon: Shield,
    title: 'Seguridad garantizada',
    description: 'Operaciones respaldadas por Century 21 internacional.',
  },
  {
    icon: Clock,
    title: 'Venta rápida',
    description: 'Promedio de 45 días en cerrar operaciones.',
  },
];

const STEPS = [
  'Completás el formulario o nos llamás',
  'Visitamos tu propiedad para la tasación',
  'Definimos el precio de venta juntos',
  'Publicamos y promocionamos tu inmueble',
  'Negociamos y cerramos la operación',
];

export const Vender = () => {
  usePageviewTracking('sell', { source: 'direct' });

  return (
    <>
      <Helmet>
        <title>Vender Propiedad en Mendoza | Century 21 Baigorria</title>
        <meta name="description" content="Vendé tu casa o departamento en Mendoza con Century 21 Baigorria. Tasación gratuita y venta rápida." />
        <meta name="keywords" content="vender casa Mendoza, vender departamento Mendoza, inmobiliaria Mendoza" />
        <link rel="canonical" href="https://grupobaigorria.com.ar/vender" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a962] mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Vender</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Vendé tu propiedad al mejor precio
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Tasación profesional gratuita y el respaldo de Century 21 para 
              vender tu inmueble en Gran Mendoza.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <VenderForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Beneficios de vender con nosotros
                  </h3>
                  <div className="space-y-4">
                    {BENEFITS.map((benefit) => (
                      <div key={benefit.title} className="flex gap-3">
                        <div className="w-10 h-10 bg-[#c9a962]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-[#c9a962]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {benefit.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Steps */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    ¿Cómo funciona?
                  </h3>
                  <ol className="space-y-3">
                    {STEPS.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-[#c9a962] text-black rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-[#c9a962]">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-black mx-auto mb-3" />
                  <h3 className="font-semibold text-black mb-2">
                    ¿Preferís llamar?
                  </h3>
                  <p className="text-black/80 text-sm mb-4">
                    Hablamos ahora y empezamos el proceso.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-black text-black hover:bg-black/10"
                  >
                    <a href={`tel:${CONTACTOS.c21.telefono}`}>
                      {CONTACTOS.c21.telefono}
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Tasador */}
              <Card className="bg-[#1a1a1a]">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-[#c9a962] mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">
                    Tasador online
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Conocé un valor estimado de tu propiedad en minutos.
                  </p>
                  <Button
                    asChild
                    className="bg-[#c9a962] hover:bg-[#b8984f] text-black"
                  >
                    <Link to="/tasador">Usar tasador</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};