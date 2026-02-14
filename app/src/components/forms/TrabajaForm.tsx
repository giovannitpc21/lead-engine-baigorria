import { useState } from 'react';
import { LeadFormBase } from './LeadFormBase';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EXPERIENCIA_OPTIONS = [
  { value: 'sin-experiencia', label: 'Sin experiencia en real estate' },
  { value: 'menos-1-ano', label: 'Menos de 1 año' },
  { value: '1-3-anos', label: 'De 1 a 3 años' },
  { value: 'mas-3-anos', label: 'Más de 3 años' },
];

const INTERES_OPTIONS = [
  { value: 'asesor', label: 'Asesor inmobiliario' },
  { value: 'soi30', label: 'Programa SOI30 (Sprint Operativo Intensivo)' },
  { value: 'administracion', label: 'Administración de propiedades' },
  { value: 'marketing', label: 'Marketing inmobiliario' },
];

export const TrabajaForm = () => {
  const [extraData, setExtraData] = useState({
    experiencia: '',
    interes: '',
    mensaje: '',
  });

  const additionalFields = (
    <div className="space-y-4">
      <div className="p-4 bg-[#2c3e50]/10 rounded-lg mb-4">
        <p className="text-sm text-[#2c3e50]">
          <strong>CCB - Centro de Capacitación Baigorria</strong>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Formamos asesores inmobiliarios de excelencia. Sumate al equipo líder en Gran Mendoza.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interes">¿En qué área te interesa?</Label>
        <Select
          value={extraData.interes}
          onValueChange={(value) => setExtraData(prev => ({ ...prev, interes: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar área" />
          </SelectTrigger>
          <SelectContent>
            {INTERES_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experiencia">Experiencia en el rubro</Label>
        <Select
          value={extraData.experiencia}
          onValueChange={(value) => setExtraData(prev => ({ ...prev, experiencia: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar experiencia" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCIA_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje">Contanos sobre vos</Label>
        <Textarea
          id="mensaje"
          value={extraData.mensaje}
          onChange={(e) => setExtraData(prev => ({ ...prev, mensaje: e.target.value }))}
          placeholder="¿Por qué querés sumarte a Grupo Baigorria?"
          rows={4}
        />
      </div>

      <div className="text-xs text-gray-500">
        <p>Nota: En una próxima etapa podrás adjuntar tu CV. Por ahora, incluí los datos relevantes en el mensaje.</p>
      </div>
    </div>
  );

  return (
    <LeadFormBase
      type="trabaja-con-nosotros"
      title="Trabajá con nosotros"
      subtitle="Sumate al equipo líder de real estate en Gran Mendoza."
      additionalFields={additionalFields}
      submitLabel="Enviar postulación"
    />
  );
};
