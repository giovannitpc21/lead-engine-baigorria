import { useState } from 'react';
import { LeadFormBase } from './LeadFormBase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTAMENTOS, TIPOS_PROPIEDAD } from '@/lib/constants';

export const ComprarForm = () => {
  const [extraData, setExtraData] = useState({
    tipo_propiedad: '',
    presupuesto_max: '',
    zona_preferida: '',
  });

  const additionalFields = (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">¿Qué estás buscando?</h3>
      
      <div className="space-y-2">
        <Label htmlFor="tipo_propiedad">Tipo de propiedad</Label>
        <Select
          value={extraData.tipo_propiedad}
          onValueChange={(value) => setExtraData(prev => ({ ...prev, tipo_propiedad: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_PROPIEDAD.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zona_preferida">Zona preferida</Label>
        <Select
          value={extraData.zona_preferida}
          onValueChange={(value) => setExtraData(prev => ({ ...prev, zona_preferida: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar zona" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTAMENTOS.map((dep) => (
              <SelectItem key={dep.value} value={dep.value}>
                {dep.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="presupuesto_max">Presupuesto máximo (USD)</Label>
        <Input
          id="presupuesto_max"
          type="number"
          value={extraData.presupuesto_max}
          onChange={(e) => setExtraData(prev => ({ ...prev, presupuesto_max: e.target.value }))}
          placeholder="Ej: 150000"
        />
      </div>
    </div>
  );

  return (
    <LeadFormBase
      type="comprar"
      title="Quiero comprar una propiedad"
      subtitle="Contanos qué buscás y te enviamos las mejores opciones disponibles."
      additionalFields={additionalFields}
      submitLabel="Recibir ofertas"
    />
  );
};
