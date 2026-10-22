'use client'

import type {
  Component,
  Entity,
  Equipment,
  Subsystem
} from '@/lib/types/equipment'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react'

type State = {
  equipments: Equipment[]
  subsystems: Subsystem[]
  components: Component[]
  entities: Entity[]
}

type Setters = {
  setEquipments: (next: Equipment[]) => void
  setSubsystems: (next: Subsystem[]) => void
  setComponents: (next: Component[]) => void
  setEntities: (next: Entity[]) => void
}

const EquipmentRegistryContext = createContext<(State & Setters) | null>(null)

export const EquipmentRegistryProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [subsystems, setSubsystems] = useState<Subsystem[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [entities, setEntities] = useState<Entity[]>([])

  const value = useMemo(
    () => ({
      equipments,
      subsystems,
      components,
      entities,
      setEquipments,
      setSubsystems,
      setComponents,
      setEntities
    }),
    [equipments, subsystems, components, entities]
  )

  return (
    <EquipmentRegistryContext.Provider value={value}>
      {children}
    </EquipmentRegistryContext.Provider>
  )
}

export const useEquipmentRegistry = () => {
  const ctx = useContext(EquipmentRegistryContext)
  if (!ctx) {
    throw new Error(
      'useEquipmentRegistry must be used within EquipmentRegistryProvider'
    )
  }
  return ctx
}
