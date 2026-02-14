import { useState } from 'react';
import { LeadFormBase } from './LeadFormBase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTAMENTOS, TIPOS_PROPIEDAD } from '@/lib/constants';

export const VenderForm = () => {
  const [extraData, setExtraData] = useState({
    tipo_propiedad: '',
    direccion: '',
    departamento: '',
    barrio: '',
  });

  const additionalFields = (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Datos de la propiedad</h3>
      
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
        <Label htmlFor="direccion">Dirección aproximada</Label>
        <Input
          id="direccion"
          value={extraData.direccion}
          onChange={(e) => setExtraData(prev => ({ ...prev, direccion: e.target.value }))}
          placeholder="Ej: Calle Las Heras 1234"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento</Label>
          <Select
            value={extraData.departamento}
            onValueChange={(value) => setExtraData(prev => ({ ...prev, departamento: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
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
          <Label htmlFor="barrio">Barrio</Label>
          <Input
            id="barrio"
            value={extraData.barrio}
            onChange={(e) => setExtraData(prev => ({ ...prev, barrio: e.target.value }))}
            placeholder="Ej: Ciudad"
          />
        </div>
      </div>
    </div>
  );

  return (
    <LeadFormBase
      type="vender"
      title="Quiero vender mi propiedad"
      subtitle="Completá el formulario y te contactamos para una tasación profesional gratuita."
      additionalFields={additionalFields}
      submitLabel="Solicitar tasación gratuita"
    />
  );
};
