'use client'

import { useState } from 'react'
import { assignThemeAction, removeThemeAction } from './actions'

interface Org {
  id: string
  name: string
  slug: string
  customThemeId: string | null
  customTheme: { id: string; name: string } | null
}

interface Theme {
  id: string
  name: string
  slug: string
  isActive: boolean
}

export function ThemeAssigner({ organizations, themes }: { organizations: Org[]; themes: Theme[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const activeThemes = themes.filter((t) => t.isActive)

  async function handleAssign(orgId: string, themeId: string) {
    setLoading(orgId)
    if (themeId === '') {
      await removeThemeAction(orgId)
    } else {
      await assignThemeAction(orgId, themeId)
    }
    setLoading(null)
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900">Asignar Temas a Centros</h2>
      </div>
      {organizations.length === 0 ? (
        <div className="p-6 text-center text-stone-500 text-sm">
          No hay centros registrados
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {organizations.map((org) => (
            <div key={org.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-stone-900">{org.name}</h3>
                <p className="text-xs text-stone-400">{org.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={org.customThemeId ?? ''}
                  onChange={(e) => handleAssign(org.id, e.target.value)}
                  disabled={loading === org.id}
                  className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 text-stone-700 disabled:opacity-50"
                >
                  <option value="">— Tema por defecto —</option>
                  {activeThemes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
                {loading === org.id && (
                  <span className="text-xs text-stone-400">Guardando...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
