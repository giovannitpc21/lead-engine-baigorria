import { Helmet } from 'react-helmet-async';
import { TrabajaForm } from '@/components/forms/TrabajaForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Target, Users, TrendingUp, Award, Phone, Check } from 'lucide-react';
import { usePageviewTracking } from '@/hooks/useAnalytics';
import { CONTACTOS } from '@/lib/constants';

const BENEFITS = [
  {
    icon: Target,
    title: 'Capacitación constante',
    description: 'Acceso al programa SOI30 y formación continua con los mejores.',
  },
  {
    icon: Users,
    title: 'Equipo de alto rendimiento',
    description: 'Trabajá junto a los asesores más exitosos de Mendoza.',
  },
  {
    icon: TrendingUp,
    title: 'Comisiones competitivas',
    description: 'El mejor plan de comisiones de la región.',
  },
  {
    icon: Award,
    title: 'Carrera profesional',
    description: 'Oportunidades de crecimiento dentro del grupo.',
  },
];

const SOI30_STEPS = [
  { day: 'Día 1-5', title: 'Fundamentos', desc: 'Bases del negocio inmobiliario' },
  { day: 'Día 6-15', title: 'Práctica', desc: 'Acompañamiento en campo real' },
  { day: 'Día 16-25', title: 'Especialización', desc: 'Técnicas de cierre y negociación' },
  { day: 'Día 26-30', title: 'Lanzamiento', desc: 'Primeras operaciones propias' },
];

export const TrabajaConNosotros = () => {
  usePageviewTracking('careers', { source: 'direct' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Trabajá con Nosotros | Grupo Baigorria - Programa SOI30</title>
        <meta name="description" content="Sumate al equipo líder de Mendoza. Programa SOI30 - Sprint Operativo Intensivo 30 días." />
        <link rel="canonical" href="https://grupobaigorria.com.ar/trabaja-con-nosotros" />
      </Helmet>

      {/* Header */}
      <div className="bg-[#2c3e50] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#c9a962] mb-4">
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Trabajá con nosotros</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sumate al equipo líder
          </h1>
          <p className="text-gray-300 max-w-2xl">
            En Grupo Baigorria formamos asesores inmobiliarios de excelencia. 
            Con o sin experiencia, tenemos un lugar para vos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <TrabajaForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  ¿Por qué unirte?
                </h3>
                <div className="space-y-4">
                  {BENEFITS.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3">
                      <div className="w-10 h-10 bg-[#2c3e50]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-[#2c3e50]" />
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

            {/* SOI30 */}
            <Card className="bg-[#2c3e50] text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-[#c9a962]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Programa SOI30</h3>
                    <p className="text-gray-300 text-sm">
                      Sprint Operativo Intensivo
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  En 30 días te convertís en asesor inmobiliario productivo. 
                  Formación teórica + práctica real.
                </p>
                <div className="space-y-2">
                  {SOI30_STEPS.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="text-[#c9a962] font-medium w-16">
                        {step.day}
                      </span>
                      <div>
                        <span className="font-medium">{step.title}</span>
                        <span className="text-gray-400 text-xs block">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-[#c9a962]">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-black mx-auto mb-3" />
                <h3 className="font-semibold text-black mb-2">
                  ¿Tenés dudas?
                </h3>
                <p className="text-black/80 text-sm mb-4">
                  Llamanos y te contamos más sobre las oportunidades.
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
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ¿Qué buscamos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Actitud proactiva',
                desc: 'Ganas de aprender y crecer en el rubro inmobiliario.',
              },
              {
                title: 'Orientación a resultados',
                desc: 'Enfoque en objetivos y cumplimiento de metas.',
              },
              {
                title: 'Habilidades comunicacionales',
                desc: 'Capacidad de relacionarte con diferentes personas.',
              },
              {
                title: 'Disponibilidad full-time',
                desc: 'Dedicación completa a la actividad.',
              },
              {
                title: 'Movilidad propia',
                desc: 'Contar con vehículo para visitas a propiedades.',
              },
              {
                title: 'Responsabilidad',
                desc: 'Compromiso con los clientes y el equipo.',
              },
            ].map((req) => (
              <Card key={req.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#c9a962] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{req.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{req.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};