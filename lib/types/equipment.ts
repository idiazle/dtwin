export type Criticality = 'A' | 'M' | 'B'

export type MetadataEntry = { key: string; value: string }

export type Taxonomy = {
  plant: string
  area: string
  system: string
}

export type Geometry = {
  model_url: string
  scaleX: string
  scaleY: string
  scaleZ: string
}

export type ThresholdDirection = 'gt' | 'lt'

export type Thresholds = {
  warning: number | null
  critical: number | null
  direction: ThresholdDirection
}

export type Sensor = {
  sensor_id: string
  type: string
  topic_mqtt: string
  unit: string
  thresholds: Thresholds
  metadata: MetadataEntry[]
}

export type Equipment = {
  id: string
  asset_id: string
  name: string
  criticality: Criticality
  taxonomy: Taxonomy
  manufacturer: MetadataEntry[]
  operating_params: MetadataEntry[]
  geometry: Geometry
  subsystem_ids: string[]
}

export type Subsystem = {
  id: string
  subsystem_id: string
  name: string
  component_ids: string[]
}

export type Component = {
  id: string
  tag: string
  name: string
  part_number: string
  mesh_name: string
  specifications: MetadataEntry[]
  sensors: Sensor[]
}

export const emptyThresholds = (): Thresholds => ({
  warning: null,
  critical: null,
  direction: 'gt'
})

export const emptySensor = (): Sensor => ({
  sensor_id: '',
  type: '',
  topic_mqtt: '',
  unit: '',
  thresholds: emptyThresholds(),
  metadata: []
})

const defaultManufacturer = (): MetadataEntry[] => [
  { key: 'fabricante', value: '' },
  { key: 'modelo', value: '' },
  { key: 'numero_serie', value: '' },
  { key: 'anio_fabricacion', value: '' },
  { key: 'fecha_puesta_marcha', value: '' }
]

const defaultOperatingParams = (): MetadataEntry[] => [
  { key: 'potencia_kw', value: '' },
  { key: 'potencia_hp', value: '' },
  { key: 'velocidad_rpm', value: '' },
  { key: 'tension_v', value: '' },
  { key: 'amperaje_a', value: '' },
  { key: 'caudal', value: '' },
  { key: 'presion', value: '' },
  { key: 'capacidad', value: '' }
]

export const emptyEquipment = (): Equipment => ({
  id: crypto.randomUUID(),
  asset_id: '',
  name: '',
  criticality: 'M',
  taxonomy: { plant: '', area: '', system: '' },
  manufacturer: defaultManufacturer(),
  operating_params: defaultOperatingParams(),
  geometry: { model_url: '', scaleX: '1', scaleY: '1', scaleZ: '1' },
  subsystem_ids: []
})

export const emptySubsystem = (): Subsystem => ({
  id: crypto.randomUUID(),
  subsystem_id: '',
  name: '',
  component_ids: []
})

const defaultSpecifications = (): MetadataEntry[] => [
  { key: 'material', value: '' },
  { key: 'peso_kg', value: '' },
  { key: 'dimensiones', value: '' }
]

export const emptyComponent = (): Component => ({
  id: crypto.randomUUID(),
  tag: '',
  name: '',
  part_number: '',
  mesh_name: '',
  specifications: defaultSpecifications(),
  sensors: []
})

export const ENTITY_TYPE_PRESETS = ['planta', 'area', 'sistema'] as const
export type EntityTypePreset = (typeof ENTITY_TYPE_PRESETS)[number]
export const ENTITY_TYPE_CUSTOM = 'otro'

export type Entity = {
  id: string
  tag: string
  name: string
  description: string
  image: string
  type: string
  parent_id: string | null
  equipment_ids: string[]
}

export const emptyEntity = (parent_id: string | null = null): Entity => ({
  id: crypto.randomUUID(),
  tag: '',
  name: '',
  description: '',
  image: '',
  type: '',
  parent_id,
  equipment_ids: []
})
