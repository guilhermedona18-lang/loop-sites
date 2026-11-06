'use client'

import { Home, Car, Bell, Headphones } from 'lucide-react'

const items = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'veiculos', label: 'Meus Veículos', icon: Car },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'contato', label: 'Contato', icon: Headphones },
]

export function BottomNav({
  active = 'inicio',
  onChange,
}: {
  active?: string
  onChange?: (id: string) => void
}) {
  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 z-20 border-t border-border bg-card"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange?.(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
