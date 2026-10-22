'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  emptyEquipment,
  type Criticality,
  type Equipment,
  type Subsystem
} from '@/lib/types/equipment'
import { Trash2, Plus } from 'lucide-react'
import { useId } from 'react'
import { KeyValueList } from './key-value-list'
import { MultiSelect } from './multi-select'

type Props = {
  items: Equipment[]
  subsystems: Subsystem[]
  onChange: (next: Equipment[]) => void
}

const EquipmentForm = ({ items, subsystems, onChange }: Props) => {
  const baseId = useId()

  const add = () => {
    onChange([...items, emptyEquipment()])
  }

  const update = (id: string, patch: Partial<Equipment>) => {
    onChange(items.map((eq) => (eq.id === id ? { ...eq, ...patch } : eq)))
  }

  const remove = (id: string) => {
    onChange(items.filter((eq) => eq.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} equipo{items.length === 1 ? '' : 's'} registrado
          {items.length === 1 ? '' : 's'}
        </p>
        <Button onClick={add}>
          <Plus />
          Agregar equipo
        </Button>
      </div>

      {items.length === 0 && (
        <div className="border border-dashed rounded-md p-8 text-center text-sm text-muted-foreground">
          No hay equipos. Pulsa &quot;Agregar equipo&quot; para crear uno.
        </div>
      )}

      {items.map((eq) => {
        const ids = {
          asset: `${baseId}-${eq.id}-asset`,
          name: `${baseId}-${eq.id}-name`,
          crit: `${baseId}-${eq.id}-crit`,
          plant: `${baseId}-${eq.id}-plant`,
          area: `${baseId}-${eq.id}-area`,
          system: `${baseId}-${eq.id}-system`,
          model: `${baseId}-${eq.id}-model`,
          sx: `${baseId}-${eq.id}-sx`,
          sy: `${baseId}-${eq.id}-sy`,
          sz: `${baseId}-${eq.id}-sz`
        }
        return (
          <div key={eq.id} className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {eq.asset_id || 'Nuevo equipo'}
              </h3>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => remove(eq.id)}
                aria-label="Eliminar equipo"
              >
                <Trash2 />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={ids.asset}>Asset ID</Label>
                <Input
                  id={ids.asset}
                  placeholder="MTR-101-PLANT1"
                  value={eq.asset_id}
                  onChange={(e) => update(eq.id, { asset_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={ids.name}>Nombre</Label>
                <Input
                  id={ids.name}
                  placeholder="Motor Principal de Chancadora"
                  value={eq.name}
                  onChange={(e) => update(eq.id, { name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={ids.crit}>Criticidad</Label>
              <Select
                value={eq.criticality}
                onValueChange={(v) =>
                  update(eq.id, { criticality: v as Criticality })
                }
              >
                <SelectTrigger id={ids.crit} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Alta (A)</SelectItem>
                  <SelectItem value="M">Media (M)</SelectItem>
                  <SelectItem value="B">Baja (B)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <fieldset className="border rounded-md p-3 space-y-3">
              <legend className="text-sm font-medium px-1">Taxonomía</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={ids.plant}>Planta</Label>
                  <Input
                    id={ids.plant}
                    placeholder="Planta Concentradora"
                    value={eq.taxonomy.plant}
                    onChange={(e) =>
                      update(eq.id, {
                        taxonomy: { ...eq.taxonomy, plant: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={ids.area}>Área</Label>
                  <Input
                    id={ids.area}
                    placeholder="Conminución"
                    value={eq.taxonomy.area}
                    onChange={(e) =>
                      update(eq.id, {
                        taxonomy: { ...eq.taxonomy, area: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={ids.system}>Sistema</Label>
                  <Input
                    id={ids.system}
                    placeholder="Chancado Primario"
                    value={eq.taxonomy.system}
                    onChange={(e) =>
                      update(eq.id, {
                        taxonomy: { ...eq.taxonomy, system: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
            </fieldset>

            <KeyValueList
              legend="Metadata del fabricante"
              items={eq.manufacturer}
              onChange={(next) => update(eq.id, { manufacturer: next })}
              placeholders={{ key: 'fabricante', value: 'Siemens' }}
              idPrefix={`${baseId}-${eq.id}-mfg`}
            />

            <KeyValueList
              legend="Parámetros operativos de diseño"
              items={eq.operating_params}
              onChange={(next) => update(eq.id, { operating_params: next })}
              placeholders={{ key: 'potencia_kw', value: '250' }}
              idPrefix={`${baseId}-${eq.id}-op`}
            />

            <fieldset className="border rounded-md p-3 space-y-3">
              <legend className="text-sm font-medium px-1">Geometría</legend>
              <div className="space-y-2">
                <Label htmlFor={ids.model}>Model URL</Label>
                <Input
                  id={ids.model}
                  placeholder="/assets/models/mtr_101.glb"
                  value={eq.geometry.model_url}
                  onChange={(e) =>
                    update(eq.id, {
                      geometry: { ...eq.geometry, model_url: e.target.value }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Escala</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={ids.sx} className="text-xs">
                      X
                    </Label>
                    <Input
                      id={ids.sx}
                      placeholder="1"
                      value={eq.geometry.scaleX}
                      onChange={(e) =>
                        update(eq.id, {
                          geometry: {
                            ...eq.geometry,
                            scaleX: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={ids.sy} className="text-xs">
                      Y
                    </Label>
                    <Input
                      id={ids.sy}
                      placeholder="1"
                      value={eq.geometry.scaleY}
                      onChange={(e) =>
                        update(eq.id, {
                          geometry: {
                            ...eq.geometry,
                            scaleY: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={ids.sz} className="text-xs">
                      Z
                    </Label>
                    <Input
                      id={ids.sz}
                      placeholder="1"
                      value={eq.geometry.scaleZ}
                      onChange={(e) =>
                        update(eq.id, {
                          geometry: {
                            ...eq.geometry,
                            scaleZ: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="border rounded-md p-3 space-y-3">
              <legend className="text-sm font-medium px-1">
                Subsistemas asignados
              </legend>
              <MultiSelect
                items={subsystems}
                value={eq.subsystem_ids}
                onChange={(next) => update(eq.id, { subsystem_ids: next })}
                renderItem={(s) =>
                  `${s.subsystem_id || 'Sin subsystem_id'} — ${s.name || 'Sin nombre'}`
                }
                emptyMessage="No hay subsistemas registrados. Crea uno en la pestaña Subsistemas."
              />
            </fieldset>
          </div>
        )
      })}
    </div>
  )
}

export default EquipmentForm
