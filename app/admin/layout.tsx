'use client'

import { EquipmentRegistryProvider } from '@/lib/equipment-registry-store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const NAV = [
  { href: '/admin/equipments', label: 'Equipos' },
  { href: '/admin/entidades', label: 'Entidades' }
] as const

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <EquipmentRegistryProvider>
      <div className="flex flex-col min-h-full">
        <header className="border-b">
          <div className="p-4 flex items-center gap-6">
            <Link href="/admin/equipments" className="font-semibold tracking-tight">
              DTwin Admin
            </Link>
            <nav className="flex gap-2">
              {NAV.map((item) => {
                const active =
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      'px-3 py-1 rounded-md text-sm transition-colors ' +
                      (active
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </EquipmentRegistryProvider>
  )
}
