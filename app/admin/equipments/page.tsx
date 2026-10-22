'use client'

import ComponentForm from '@/components/equipment-registry/component-form'
import EquipmentForm from '@/components/equipment-registry/equipment-form'
import SubsystemForm from '@/components/equipment-registry/subsystem-form'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { useEquipmentRegistry } from '@/lib/equipment-registry-store'

const Page = () => {
  const {
    equipments,
    subsystems,
    components,
    setEquipments,
    setSubsystems,
    setComponents
  } = useEquipmentRegistry()

  return (
    <div className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Registro de Equipos
        </h1>
        <p className="text-sm text-muted-foreground">
          Da de alta equipos, subsistemas y componentes. Los datos viven en
          memoria y se comparten con la sección de jerarquías.
        </p>
      </header>

      <Tabs defaultValue="equipos">
        <TabsList>
          <TabsTrigger value="equipos">
            Equipos ({equipments.length})
          </TabsTrigger>
          <TabsTrigger value="subsistemas">
            Subsistemas ({subsystems.length})
          </TabsTrigger>
          <TabsTrigger value="componentes">
            Componentes ({components.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipos" className="mt-4">
          <EquipmentForm
            items={equipments}
            subsystems={subsystems}
            onChange={setEquipments}
          />
        </TabsContent>

        <TabsContent value="subsistemas" className="mt-4">
          <SubsystemForm
            items={subsystems}
            components={components}
            onChange={setSubsystems}
          />
        </TabsContent>

        <TabsContent value="componentes" className="mt-4">
          <ComponentForm items={components} onChange={setComponents} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
