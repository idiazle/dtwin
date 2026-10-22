'use client'

type Identifiable = { id: string }

type Props<T extends Identifiable> = {
  items: T[]
  value: string[]
  onChange: (next: string[]) => void
  renderItem: (item: T) => string
  emptyMessage?: string
}

export function MultiSelect<T extends Identifiable>({
  items,
  value,
  onChange,
  renderItem,
  emptyMessage = 'No hay elementos disponibles.'
}: Props<T>) {
  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    )
  }

  if (items.length === 0) {
    return (
      <p className="text-xs text-muted-foreground px-1">{emptyMessage}</p>
    )
  }

  const selectedCount = value.filter((id) => items.some((i) => i.id === id))
    .length

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        {selectedCount} de {items.length} seleccionado
        {items.length === 1 ? '' : 's'}
      </p>
      <div className="space-y-1 max-h-48 overflow-y-auto border rounded-md p-2">
        {items.map((item) => {
          const checked = value.includes(item.id)
          return (
            <label
              key={item.id}
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 py-1"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(item.id)}
                className="size-4 accent-primary"
              />
              <span className={checked ? '' : 'text-muted-foreground'}>
                {renderItem(item)}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
