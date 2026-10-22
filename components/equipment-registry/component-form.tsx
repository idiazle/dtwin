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
  emptyComponent,
  emptySensor,
  type Component,
  type Sensor,
  type ThresholdDirection,
  type Thresholds
} from '@/lib/types/equipment'
import { Plus, Trash2 } from 'lucide-react'
import { useId } from 'react'
import { KeyValueList } from './key-value-list'

type Props = {
  items: Component[]
  onChange: (next: Component[]) => void
}

const parseNumberOrNull = (raw: string): number | null => {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

const ComponentForm = ({ items, onChange }: Props) => {
  const update = (id: string, patch: Partial<Component>) => {
    onChange(items.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const add = () => {
    onChange([...items, emptyComponent()])
  }

  const remove = (id: string) => {
    onChange(items.filter((c) => c.id !== id))
  }

  const addSensor = (compId: string) => {
    const comp = items.find((c) => c.id === compId)
    if (!comp) return
    update(compId, { sensors: [...comp.sensors, emptySensor()] })
  }

  const updateSensor = (
    compId: string,
    sensorIdx: number,
    patch: Partial<Sensor>
  ) => {
    const comp = items.find((c) => c.id === compId)
    if (!comp) return
    const sensors = [...comp.sensors]
    sensors[sensorIdx] = { ...sensors[sensorIdx], ...patch }
    update(compId, { sensors })
  }

  const updateThreshold = (
    compId: string,
    sensorIdx: number,
    patch: Partial<Thresholds>
  ) => {
    const comp = items.find((c) => c.id === compId)
    if (!comp) return
    const sensor = comp.sensors[sensorIdx]
    updateSensor(compId, sensorIdx, {
      thresholds: { ...sensor.thresholds, ...patch }
    })
  }

  const removeSensor = (compId: string, sensorIdx: number) => {
    const comp = items.find((c) => c.id === compId)
    if (!comp) return
    update(compId, {
      sensors: comp.sensors.filter((_, i) => i !== sensorIdx)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} componente{items.length === 1 ? '' : 's'} registrado
          {items.length === 1 ? '' : 's'}
        </p>
        <Button onClick={add}>
          <Plus />
          Agregar componente
        </Button>
      </div>

      {items.length === 0 && (
        <div className="border border-dashed rounded-md p-8 text-center text-sm text-muted-foreground">
          No hay componentes. Pulsa &quot;Agregar componente&quot; para crear
          uno.
        </div>
      )}

      {items.map((comp) => (
        <ComponentCard
          key={comp.id}
          component={comp}
          onUpdate={(patch) => update(comp.id, patch)}
          onRemove={() => remove(comp.id)}
          onAddSensor={() => addSensor(comp.id)}
          onUpdateSensor={(idx, patch) => updateSensor(comp.id, idx, patch)}
          onUpdateThreshold={(idx, patch) =>
            updateThreshold(comp.id, idx, patch)
          }
          onRemoveSensor={(idx) => removeSensor(comp.id, idx)}
        />
      ))}
    </div>
  )
}

type CardProps = {
  component: Component
  onUpdate: (patch: Partial<Component>) => void
  onRemove: () => void
  onAddSensor: () => void
  onUpdateSensor: (idx: number, patch: Partial<Sensor>) => void
  onUpdateThreshold: (idx: number, patch: Partial<Thresholds>) => void
  onRemoveSensor: (idx: number) => void
}

const ComponentCard = ({
  component,
  onUpdate,
  onRemove,
  onAddSensor,
  onUpdateSensor,
  onUpdateThreshold,
  onRemoveSensor
}: CardProps) => {
  const baseId = useId()
  const tagField = `${baseId}-tag`
  const nameField = `${baseId}-name`
  const pnField = `${baseId}-pn`
  const meshField = `${baseId}-mesh`

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {component.tag || component.name || 'Nuevo componente'}
        </h3>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Eliminar componente"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={tagField}>ID de instancia</Label>
          <Input
            id={tagField}
            placeholder="COMP-ROD-LA"
            value={component.tag}
            onChange={(e) => onUpdate({ tag: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={nameField}>Nombre</Label>
          <Input
            id={nameField}
            placeholder="Rodamiento Lado Acople"
            value={component.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={pnField}>Número de parte</Label>
          <Input
            id={pnField}
            placeholder="SKF-6205-2RS"
            value={component.part_number}
            onChange={(e) => onUpdate({ part_number: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={meshField}>Mesh name</Label>
        <Input
          id={meshField}
          placeholder="Bearing_Front_Mesh"
          value={component.mesh_name}
          onChange={(e) => onUpdate({ mesh_name: e.target.value })}
        />
      </div>

      <KeyValueList
        legend="Especificaciones"
        items={component.specifications}
        onChange={(next) => onUpdate({ specifications: next })}
        placeholders={{ key: 'material', value: 'Acero SAE 52100' }}
        idPrefix={`${baseId}-spec`}
      />

      <fieldset className="border rounded-md p-3 space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium px-1">Sensores</legend>
          <Button size="sm" variant="outline" onClick={onAddSensor}>
            <Plus />
            Agregar sensor
          </Button>
        </div>
        {component.sensors.length === 0 && (
          <p className="text-xs text-muted-foreground">Sin sensores.</p>
        )}
        {component.sensors.map((sensor, idx) => (
          <SensorCard
            key={`${component.id}-s${idx}`}
            sensor={sensor}
            index={idx}
            idPrefix={`${baseId}-${idx}`}
            onUpdate={(patch) => onUpdateSensor(idx, patch)}
            onUpdateThreshold={(patch) => onUpdateThreshold(idx, patch)}
            onRemove={() => onRemoveSensor(idx)}
          />
        ))}
      </fieldset>
    </div>
  )
}

type SensorProps = {
  sensor: Sensor
  index: number
  idPrefix: string
  onUpdate: (patch: Partial<Sensor>) => void
  onUpdateThreshold: (patch: Partial<Thresholds>) => void
  onRemove: () => void
}

const SensorCard = ({
  sensor,
  index,
  idPrefix,
  onUpdate,
  onUpdateThreshold,
  onRemove
}: SensorProps) => {
  const sid = `${idPrefix}-id`
  const stype = `${idPrefix}-type`
  const smq = `${idPrefix}-mq`
  const sunit = `${idPrefix}-unit`
  const sdir = `${idPrefix}-dir`
  const sw = `${idPrefix}-w`
  const sc = `${idPrefix}-c`

  const dirValue = sensor.thresholds.direction

  return (
    <div className="border rounded-md p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Sensor {index + 1}</span>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Eliminar sensor"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={sid} className="text-xs">
            Sensor ID
          </Label>
          <Input
            id={sid}
            placeholder="VIB_MTR101_DE"
            value={sensor.sensor_id}
            onChange={(e) => onUpdate({ sensor_id: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={stype} className="text-xs">
            Tipo
          </Label>
          <Input
            id={stype}
            placeholder="vibration, temperature, pressure, flow…"
            value={sensor.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={smq} className="text-xs">
            Topic MQTT
          </Label>
          <Input
            id={smq}
            placeholder="plant1/crusher/mtr101/vib_de"
            value={sensor.topic_mqtt}
            onChange={(e) => onUpdate({ topic_mqtt: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={sunit} className="text-xs">
            Unidad
          </Label>
          <Input
            id={sunit}
            placeholder="mm/s, °C, bar…"
            value={sensor.unit}
            onChange={(e) => onUpdate({ unit: e.target.value })}
          />
        </div>
      </div>

      <fieldset className="border rounded-md p-3 space-y-3">
        <legend className="text-xs font-medium px-1">Umbrales</legend>
        <div className="space-y-1">
          <Label htmlFor={sdir} className="text-xs">
            Dirección
          </Label>
          <Select
            value={dirValue}
            onValueChange={(v) =>
              onUpdateThreshold({ direction: v as ThresholdDirection })
            }
          >
            <SelectTrigger id={sdir} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gt">
                Alerta cuando el valor sea mayor que el umbral (&gt;)
              </SelectItem>
              <SelectItem value="lt">
                Alerta cuando el valor sea menor que el umbral (&lt;)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor={sw} className="text-xs">
              Warning
            </Label>
            <Input
              id={sw}
              type="number"
              placeholder="4.5"
              value={sensor.thresholds.warning ?? ''}
              onChange={(e) =>
                onUpdateThreshold({ warning: parseNumberOrNull(e.target.value) })
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={sc} className="text-xs">
              Critical
            </Label>
            <Input
              id={sc}
              type="number"
              placeholder="7.1"
              value={sensor.thresholds.critical ?? ''}
              onChange={(e) =>
                onUpdateThreshold({
                  critical: parseNumberOrNull(e.target.value)
                })
              }
            />
          </div>
        </div>
      </fieldset>

      <KeyValueList
        legend="Metadatos del sensor"
        items={sensor.metadata}
        onChange={(next) => onUpdate({ metadata: next })}
        placeholders={{ key: 'calibracion', value: '2024-03-15' }}
        idPrefix={`${idPrefix}-meta`}
      />
    </div>
  )
}

export default ComponentForm
