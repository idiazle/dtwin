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
import { useEquipmentRegistry } from '@/lib/equipment-registry-store'
import {
  ENTITY_TYPE_CUSTOM,
  ENTITY_TYPE_PRESETS,
  emptyEntity,
  type Entity,
  type Equipment
} from '@/lib/types/equipment'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useId, useState } from 'react'
import { MultiSelect } from './multi-select'

const NONE_VALUE = '__none__'

const isPresetType = (type: string): boolean =>
  (ENTITY_TYPE_PRESETS as readonly string[]).includes(type)

const getDepth = (all: Entity[], id: string): number => {
  let depth = 0
  let current = all.find((n) => n.id === id)
  while (current?.parent_id) {
    depth += 1
    current = all.find((n) => n.id === current?.parent_id)
  }
  return depth
}

const collectDescendantIds = (all: Entity[], rootId: string): Set<string> => {
  const result = new Set<string>()
  const queue: string[] = [rootId]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const n of all) {
      if (n.parent_id === current && !result.has(n.id)) {
        result.add(n.id)
        queue.push(n.id)
      }
    }
  }
  return result
}

const EntityForm = () => {
  const { entities, setEntities, equipments } = useEquipmentRegistry()

  const addRoot = () => {
    setEntities([...entities, emptyEntity()])
  }

  const addChild = (parentId: string) => {
    setEntities([...entities, emptyEntity(parentId)])
  }

  const updateEntity = (id: string, patch: Partial<Entity>) => {
    setEntities(entities.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  const removeEntity = (id: string) => {
    const toDelete = new Set<string>([id])
    let changed = true
    while (changed) {
      changed = false
      for (const n of entities) {
        if (
          n.parent_id &&
          toDelete.has(n.parent_id) &&
          !toDelete.has(n.id)
        ) {
          toDelete.add(n.id)
          changed = true
        }
      }
    }
    setEntities(entities.filter((e) => !toDelete.has(e.id)))
  }

  const roots = entities.filter((e) => e.parent_id === null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {entities.length} entidad{entities.length === 1 ? '' : 'es'}{' '}
          registrada{entities.length === 1 ? '' : 's'}
        </p>
        <Button onClick={addRoot}>
          <Plus />
          Agregar entidad
        </Button>
      </div>

      {entities.length === 0 && (
        <div className="border border-dashed rounded-md p-8 text-center text-sm text-muted-foreground">
          No hay entidades. Pulsa &quot;Agregar entidad&quot; para crear una.
        </div>
      )}

      {roots.map((root) => (
        <EntityTree
          key={root.id}
          entity={root}
          all={entities}
          allEquipments={equipments}
          onUpdate={updateEntity}
          onAddChild={addChild}
          onRemove={removeEntity}
        />
      ))}
    </div>
  )
}

type NodeProps = {
  entity: Entity
  all: Entity[]
  allEquipments: Equipment[]
  onUpdate: (id: string, patch: Partial<Entity>) => void
  onAddChild: (parentId: string) => void
  onRemove: (id: string) => void
}

const EntityTree = ({
  entity,
  all,
  allEquipments,
  onUpdate,
  onAddChild,
  onRemove
}: NodeProps) => {
  const baseId = useId()
  const tagField = `${baseId}-tag`
  const nameField = `${baseId}-name`
  const descField = `${baseId}-desc`
  const imageField = `${baseId}-image`
  const typeField = `${baseId}-type`
  const customTypeField = `${baseId}-custom-type`
  const parentField = `${baseId}-parent`

  const depth = getDepth(all, entity.id)
  const children = all.filter((e) => e.parent_id === entity.id)
  const [open, setOpen] = useState(true)

  const descendants = collectDescendantIds(all, entity.id)
  const parentOptions = all.filter(
    (e) => e.id !== entity.id && !descendants.has(e.id)
  )

  const typeIsPreset = isPresetType(entity.type)
  const selectValue = typeIsPreset ? entity.type : ENTITY_TYPE_CUSTOM

  return (
    <div
      className="border rounded-md p-3 space-y-2"
      style={{ marginLeft: depth * 16 }}
    >
      <div className="flex items-center gap-2">
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Contraer' : 'Expandir'}
        >
          <ChevronRight
            className={'transition-transform ' + (open ? 'rotate-90' : '')}
          />
        </Button>
        {entity.type && (
          <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
            {entity.type}
          </span>
        )}
        <div className="flex-1 font-medium">
          {entity.tag || entity.name || 'Sin tag'}
        </div>
        <Button size="sm" variant="outline" onClick={() => onAddChild(entity.id)}>
          <Plus />
          Hijo
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={() => onRemove(entity.id)}
          aria-label="Eliminar entidad"
        >
          <Trash2 />
        </Button>
      </div>

      {open && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 pl-8">
            <div className="space-y-1">
              <Label htmlFor={tagField} className="text-xs">
                Tag
              </Label>
              <Input
                id={tagField}
                placeholder="PLT-CONC"
                value={entity.tag}
                onChange={(e) => onUpdate(entity.id, { tag: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={nameField} className="text-xs">
                Nombre
              </Label>
              <Input
                id={nameField}
                placeholder="Planta Concentradora"
                value={entity.name}
                onChange={(e) => onUpdate(entity.id, { name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1 pl-8">
            <Label htmlFor={descField} className="text-xs">
              Descripción
            </Label>
            <Input
              id={descField}
              placeholder="Planta de procesamiento de minerales"
              value={entity.description}
              onChange={(e) =>
                onUpdate(entity.id, { description: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 pl-8">
            <Label htmlFor={imageField} className="text-xs">
              Imagen (URL, opcional)
            </Label>
            <Input
              id={imageField}
              placeholder="https://…/planta.png"
              value={entity.image}
              onChange={(e) => onUpdate(entity.id, { image: e.target.value })}
            />
            {entity.image && (
              // eslint-disable-next-line @next/next/no-img-element -- URL arbitraria del usuario
              <img
                src={entity.image}
                alt={entity.name || 'Imagen'}
                className="max-h-24 rounded border bg-muted object-contain"
              />
            )}
          </div>

          <div className="space-y-1 pl-8">
            <Label htmlFor={typeField} className="text-xs">
              Tipo
            </Label>
            <Select
              value={selectValue}
              onValueChange={(v) => {
                if (v === ENTITY_TYPE_CUSTOM || v == null) {
                  onUpdate(entity.id, { type: '' })
                } else {
                  onUpdate(entity.id, { type: v })
                }
              }}
            >
              <SelectTrigger id={typeField} className="w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planta">Planta</SelectItem>
                <SelectItem value="area">Área</SelectItem>
                <SelectItem value="sistema">Sistema</SelectItem>
                <SelectItem value={ENTITY_TYPE_CUSTOM}>
                  Otro (personalizado)
                </SelectItem>
              </SelectContent>
            </Select>
            {!typeIsPreset && (
              <div className="space-y-1">
                <Label htmlFor={customTypeField} className="text-xs">
                  Tipo personalizado
                </Label>
                <Input
                  id={customTypeField}
                  placeholder="sala-electrica, subestacion, etc."
                  value={entity.type}
                  onChange={(e) =>
                    onUpdate(entity.id, { type: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <div className="space-y-1 pl-8">
            <Label htmlFor={parentField} className="text-xs">
              Padre
            </Label>
            <Select
              value={entity.parent_id === null ? NONE_VALUE : entity.parent_id}
              onValueChange={(v) =>
                onUpdate(entity.id, {
                  parent_id: v === NONE_VALUE || v == null ? null : v
                })
              }
            >
              <SelectTrigger id={parentField} className="w-full">
                <SelectValue placeholder="Sin padre (raíz)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Sin padre (raíz)</SelectItem>
                {parentOptions.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.tag || 'Sin tag'} — {e.name || 'Sin nombre'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 pl-8">
            <Label className="text-xs">Equipos asignados</Label>
            <MultiSelect
              items={allEquipments}
              value={entity.equipment_ids}
              onChange={(next) => onUpdate(entity.id, { equipment_ids: next })}
              renderItem={(eq) =>
                `${eq.asset_id || 'Sin asset_id'} — ${eq.name || 'Sin nombre'}`
              }
              emptyMessage="No hay equipos registrados. Crea uno en la sección Equipos."
            />
          </div>

          {children.length > 0 && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              {children.map((child) => (
                <EntityTree
                  key={child.id}
                  entity={child}
                  all={all}
                  allEquipments={allEquipments}
                  onUpdate={onUpdate}
                  onAddChild={onAddChild}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default EntityForm
