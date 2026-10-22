'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  emptySubsystem,
  type Component,
  type Subsystem
} from '@/lib/types/equipment'
import { Trash2, Plus } from 'lucide-react'
import { useId } from 'react'
import { MultiSelect } from './multi-select'

type Props = {
  items: Subsystem[]
  components: Component[]
  onChange: (next: Subsystem[]) => void
}

const SubsystemForm = ({ items, components, onChange }: Props) => {
  const baseId = useId()

  const add = () => {
    onChange([...items, emptySubsystem()])
  }

  const update = (id: string, patch: Partial<Subsystem>) => {
    onChange(items.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const remove = (id: string) => {
    onChange(items.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} subsistema{items.length === 1 ? '' : 's'} registrado
          {items.length === 1 ? '' : 's'}
        </p>
        <Button onClick={add}>
          <Plus />
          Agregar subsistema
        </Button>
      </div>

      {items.length === 0 && (
        <div className="border border-dashed rounded-md p-8 text-center text-sm text-muted-foreground">
          No hay subsistemas. Pulsa &quot;Agregar subsistema&quot; para crear
          uno.
        </div>
      )}

      {items.map((sub) => {
        const idField = `${baseId}-${sub.id}-subid`
        const nameField = `${baseId}-${sub.id}-name`
        return (
          <div key={sub.id} className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {sub.subsystem_id || 'Nuevo subsistema'}
              </h3>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => remove(sub.id)}
                aria-label="Eliminar subsistema"
              >
                <Trash2 />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={idField}>Subsystem ID</Label>
                <Input
                  id={idField}
                  placeholder="SUB-ROD-01"
                  value={sub.subsystem_id}
                  onChange={(e) =>
                    update(sub.id, { subsystem_id: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={nameField}>Nombre</Label>
                <Input
                  id={nameField}
                  placeholder="Sistema de Rodamientos"
                  value={sub.name}
                  onChange={(e) => update(sub.id, { name: e.target.value })}
                />
              </div>
            </div>

            <fieldset className="border rounded-md p-3 space-y-3">
              <legend className="text-sm font-medium px-1">
                Componentes asignados
              </legend>
              <MultiSelect
                items={components}
                value={sub.component_ids}
                onChange={(next) => update(sub.id, { component_ids: next })}
                renderItem={(c) =>
                  `${c.tag || 'Sin tag'} — ${c.name || 'Sin nombre'}`
                }
                emptyMessage="No hay componentes registrados. Crea uno en la pestaña Componentes."
              />
            </fieldset>
          </div>
        )
      })}
    </div>
  )
}

export default SubsystemForm
