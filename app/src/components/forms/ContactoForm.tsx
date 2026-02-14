import { useState } from 'react';
import { LeadFormBase } from './LeadFormBase';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MOTIVOS_CONTACTO = [
  { value: 'consulta-general', label: 'Consulta general' },
  { value: 'tasacion', label: 'Tasación profesional' },
  { value: 'administracion', label: 'Administración de propiedad' },
  { value: 'reclamo', label: 'Reclamo/Sugerencia' },
  { value: 'otro', label: 'Otro' },
];

export const ContactoForm = () => {
  const [extraData, setExtraData] = useState({
    motivo: '',
    mensaje: '',
  });

  const additionalFields = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo de contacto</Label>
        <Select
          value={extraData.motivo}
          onValueChange={(value) => setExtraData(prev => ({ ...prev, motivo: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar motivo" />
          </SelectTrigger>
          <SelectContent>
            {MOTIVOS_CONTACTO.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          value={extraData.mensaje}
          onChange={(e) => setExtraData(prev => ({ ...prev, mensaje: e.target.value }))}
          placeholder="Contanos en qué podemos ayudarte..."
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <LeadFormBase
      type="contacto"
      title="Contactanos"
      subtitle="Estamos para ayudarte. Dejanos tu consulta."
      additionalFields={additionalFields}
      submitLabel="Enviar mensaje"
    />
  );
};
