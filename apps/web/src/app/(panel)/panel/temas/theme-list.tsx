'use client'

import { deleteThemeAction, toggleThemeAction } from './actions'

interface Theme {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: { organizations: number }
}

export function ThemeList({ themes }: { themes: Theme[] }) {
  if (themes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-6 text-center text-stone-500">
        No hay temas instalados todavía
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900">Temas Instalados ({themes.length})</h2>
      </div>
      <div className="divide-y divide-stone-100">
        {themes.map((theme) => (
          <div key={theme.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-stone-900">{theme.name}</h3>
                <span className="text-xs text-stone-400 font-mono">{theme.slug}</span>
                {!theme.isActive && (
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
                    Inactivo
                  </span>
                )}
              </div>
              {theme.description && (
                <p className="text-sm text-stone-500 mt-0.5">{theme.description}</p>
              )}
              <p className="text-xs text-stone-400 mt-1">
                Usado por {theme._count.organizations} centro{theme._count.organizations !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await toggleThemeAction(theme.id)
                  window.location.reload()
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                {theme.isActive ? 'Desactivar' : 'Activar'}
              </button>
              {theme._count.organizations === 0 && (
                <button
                  onClick={async () => {
                    if (confirm(`¿Eliminar el tema "${theme.name}"?`)) {
                      await deleteThemeAction(theme.id)
                      window.location.reload()
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
