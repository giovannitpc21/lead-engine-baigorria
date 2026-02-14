import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Mail, User, Check, Loader2 } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import type { LeadType } from '@/types';

interface LeadFormBaseProps {
  type: LeadType;
  title: string;
  subtitle?: string;
  additionalFields?: React.ReactNode;
  onSuccess?: () => void;
  submitLabel?: string;
}

export const LeadFormBase = ({
  type,
  title,
  subtitle,
  additionalFields,
  onSuccess,
  submitLabel = 'Enviar consulta',
}: LeadFormBaseProps) => {
  const { createLead, loading } = useLeads();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    whatsapp: '',
    acepta_terminos: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acepta_terminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    const result = await createLead({
      type,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      whatsapp: formData.whatsapp || formData.telefono,
      source: 'web',
    });

    if (result.success) {
      setSubmitted(true);
      onSuccess?.();
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Gracias por contactarnos!
          </h3>
          <p className="text-gray-600">
            Hemos recibido tu consulta. Un asesor se comunicará contigo a la brevedad.
          </p>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              ¿Preferís hablar por WhatsApp?
            </p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_C21_WHATSAPP || '5492617166129'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-green-600 hover:text-green-700 font-medium"
            >
              <Phone className="w-4 h-4" />
              Escribinos por WhatsApp
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@ejemplo.com"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="261 123 4567"
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="261 123 4567"
              />
            </div>
          </div>

          {/* Campos adicionales específicos */}
          {additionalFields && (
            <div className="pt-4 border-t border-gray-200">
              {additionalFields}
            </div>
          )}

          <div className="flex items-start gap-3 pt-4">
            <Checkbox
              id="terminos"
              checked={formData.acepta_terminos}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, acepta_terminos: checked as boolean }))
              }
            />
            <Label htmlFor="terminos" className="text-sm font-normal leading-tight cursor-pointer">
              Acepto que mis datos sean utilizados para contacto comercial. 
              Leí y acepto la{' '}
              <a href="/privacidad" className="text-[#c9a962] hover:underline">
                política de privacidad
              </a>
              .
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a962] hover:bg-[#b8984f] text-black font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
