'use client'

import EntityForm from '@/components/equipment-registry/entity-form'

const Page = () => {
  return (
    <div className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Entidades</h1>
        <p className="text-sm text-muted-foreground">
          Registra entidades jerárquicas con tag, nombre, descripción, imagen,
          tipo (planta, área, sistema u otro) y equipos asociados. Cada entidad
          puede tener un padre ya registrado.
        </p>
      </header>

      <EntityForm />
    </div>
  )
}

export default Page
