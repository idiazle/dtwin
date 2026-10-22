'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MetadataEntry } from '@/lib/types/equipment'
import { Plus, Trash2 } from 'lucide-react'

type Props = {
  legend: string
  items: MetadataEntry[]
  onChange: (next: MetadataEntry[]) => void
  placeholders?: { key: string; value: string }
  idPrefix: string
  emptyMessage?: string
}

export const KeyValueList = ({
  legend,
  items,
  onChange,
  placeholders,
  idPrefix,
  emptyMessage = 'Sin entradas.'
}: Props) => {
  const add = () => onChange([...items, { key: '', value: '' }])

  const update = (index: number, field: 'key' | 'value', value: string) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <fieldset className="border rounded-md p-3 space-y-3">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-medium px-1">{legend}</legend>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus />
          Agregar
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">{emptyMessage}</p>
      )}
      {items.map((item, index) => {
        const kId = `${idPrefix}-${index}-key`
        const vId = `${idPrefix}-${index}-value`
        return (
          <div key={`${idPrefix}-${index}`} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor={kId} className="text-xs">
                Clave
              </Label>
              <Input
                id={kId}
                placeholder={placeholders?.key ?? 'clave'}
                value={item.key}
                onChange={(e) => update(index, 'key', e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor={vId} className="text-xs">
                Valor
              </Label>
              <Input
                id={vId}
                placeholder={placeholders?.value ?? 'valor'}
                value={item.value}
                onChange={(e) => update(index, 'value', e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              size="icon-sm"
              className="self-end"
              onClick={() => remove(index)}
              aria-label="Eliminar entrada"
            >
              <Trash2 />
            </Button>
          </div>
        )
      })}
    </fieldset>
  )
}
