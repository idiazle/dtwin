'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type TechnicalData = {
  name: string
  value: string
}

const Page = () => {
  const [jerarquia, setJerarquia] = useState({
    industria: '',
    unidadNegocio: '',
    instalacionPlanta: '',
    seccionArea: '',
    unidadProceso: ''
  })

  const [equipmentData, setEquipmentData] = useState({
    equipmentId: '',
    equipmentName: '',
    equipmentDescription: '',
    technicalData: [] as TechnicalData[]
  })

  const [technicalData, setTechnicalData] = useState <TechnicalData[]>([{ name: '', value: '' }])

  const handleInputChange = (field: string, value: string) => {
    setJerarquia((prevJerarquia) => ({
      ...prevJerarquia,
      [field]: value
    }))
  }

  const saveData = () => {
    const dataToSave = {
      jerarquia,
      equipmentData: {
        ...equipmentData,
        technicalData
      }
    }

    console.log('Datos a guardar:', dataToSave)
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Registro de entidades (Arbol Jerarquico)</h2>
        <Label className='font-bold'>Industria</Label>
        <Input
          placeholder="Ingrese industria"
          value={
            jerarquia.industria
          }
          onChange={(e) => handleInputChange('industria', e.target.value)}
        />
        <Label className='font-bold'>Unidad de Negocio</Label>
        <Input
          placeholder="Ingrese unidad de negocio"
          value={jerarquia.unidadNegocio}
          onChange={(e) => handleInputChange('unidadNegocio', e.target.value)}
        />
        <Label className='font-bold'>Instalacion/Planta</Label>
        <Input
          placeholder="Ingrese instalacion/planta"
          value={jerarquia.instalacionPlanta}
          onChange={(e) => handleInputChange('instalacionPlanta', e.target.value)}
        />
        <Label className='font-bold'>Seccion/Area</Label>
        <Input
          placeholder="Ingrese seccion/area"
          value={jerarquia.seccionArea}
          onChange={(e) => handleInputChange('seccionArea', e.target.value)}
        />
        <Label className='font-bold'>Unidad de Proceso</Label>
        <Input
          placeholder="Ingrese unidad de proceso"
          value={jerarquia.unidadProceso}
          onChange={(e) => handleInputChange('unidadProceso', e.target.value)}
        />
      </div>

      <div className="border rounded-md p-2 mt-4">
        <h1>Registro de equipos</h1>
        <Label className='font-bold'>Codigo del equipo</Label>
        <Input
          placeholder="Ingrese codigo del equipo/TAG"
          value={equipmentData.equipmentId}
          onChange={(e) => setEquipmentData({ ...equipmentData, equipmentId: e.target.value })}
        />
        <Label className='font-bold'>Nombre del equipo</Label>
        <Input
          placeholder="Ingrese nombre del equipo"
          value={equipmentData.equipmentName}
          onChange={(e) => setEquipmentData({ ...equipmentData, equipmentName: e.target.value })}
        />
        <Label className='font-bold'>Descripcion del equipo</Label>
        <Input
          placeholder="Ingrese descripcion del equipo"
          value={equipmentData.equipmentDescription}
          onChange={(e) => setEquipmentData({ ...equipmentData, equipmentDescription: e.target.value })}
        />
        <Label className='font-bold'>Datos Tecnicos</Label>
        <button
          className="mb-2 bg-blue-500 text-white px-2 py-1 rounded"
          type="button"
          onClick={() => {
            const newTechnicalData = [...technicalData]
            newTechnicalData.push({ name: '', value: '' })
            setTechnicalData(newTechnicalData)
          }}
        >
          Agregar
        </button>
        {technicalData.map((data, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center justify-around border rounded-md p-2">
            <Label className='font-bold'>{index + 1}</Label>
            <Input
              placeholder="Nombre del dato tecnico"
              value={data?.name}
              onChange={(e) => {
                const newTechnicalData = [...technicalData]
                newTechnicalData[index].name = e.target.value
                setTechnicalData(newTechnicalData)
              }}
            />
            <Input
              placeholder="Valor del dato tecnico"
              value={data?.value}
              onChange={(e) => {
                const newTechnicalData = [...technicalData]
                newTechnicalData[index].value = e.target.value
                setTechnicalData(newTechnicalData)
              }}
            />

            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              type="button"
              onClick={() => {
                const newTechnicalData = [...technicalData]
                newTechnicalData.splice(index, 1)
                setTechnicalData(newTechnicalData)
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div>
        <h1>Subcomponentes</h1>
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        type="button"
        onClick={saveData}
      >
        Guardar
      </button>

      <div className="border rounded-md p-2">
        <h2 className="text-2xl font-bold tracking-tight">Arbol Jerarquico</h2>
        <p>Industria: {jerarquia.industria}</p>
        <p>Unidad de Negocio: {jerarquia.unidadNegocio}</p>
        <p>Instalacion/Planta: {jerarquia.instalacionPlanta}</p>
        <p>Seccion/Area: {jerarquia.seccionArea}</p>
        <p>Unidad de Proceso: {jerarquia.unidadProceso}</p>
      </div>

      <div className="border rounded-md p-2 mt-4">
        <h2 className="text-2xl font-bold tracking-tight">Datos del Equipo</h2>
        <p>Codigo del equipo: {equipmentData.equipmentId}</p>
        <p>Nombre del equipo: {equipmentData.equipmentName}</p>
        <p>Descripcion del equipo: {equipmentData.equipmentDescription}</p>
        <h3 className="text-xl font-bold tracking-tight">Datos Tecnicos</h3>
        {equipmentData.technicalData.map((data, index) => (
          <div key={index}>
            <p>Nombre: {data.name}</p>
            <p>Valor: {data.value}</p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Page