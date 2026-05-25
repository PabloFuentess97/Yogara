'use client'

import { useTransition, useState } from 'react'
import { updateThemeAction } from './actions'

const THEMES = [
  {
    id: 'zen-minimal',
    name: 'Zen Minimal',
    description: 'Limpio y sereno. Tonos neutros y tipografía elegante.',
    colors: ['#F5F5F4', '#1C1917', '#A8A29E'],
  },
  {
    id: 'organic-flow',
    name: 'Organic Flow',
    description: 'Cálido y natural. Tonos tierra y formas suaves.',
    colors: ['#F5F0EB', '#5C4033', '#A67B5B'],
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark',
    description: 'Sofisticado y premium. Fondo oscuro con acentos dorados.',
    colors: ['#0A0A0A', '#C8A96E', '#1A1A1A'],
  },
] as const

export function ThemeSelector({ currentThemeId }: { currentThemeId: string }) {
  const [isPending, startTransition] = useTransition()
  const [selectedId, setSelectedId] = useState(currentThemeId)
  const [showSuccess, setShowSuccess] = useState(false)

  function handleSelect(themeId: string) {
    if (themeId === selectedId) return

    setSelectedId(themeId)
    setShowSuccess(false)

    startTransition(async () => {
      const formData = new FormData()
      formData.set('themeId', themeId)
      const result = await updateThemeAction(formData)

      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => handleSelect(theme.id)}
            disabled={isPending}
            className={`bg-white rounded-xl border p-5 text-left transition-all ${
              selectedId === theme.id
                ? 'border-stone-900 ring-1 ring-stone-900'
                : 'border-stone-200 hover:border-stone-400'
            } ${isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-2 mb-3">
              {theme.colors.map((color) => (
                <span
                  key={color}
                  className="w-5 h-5 rounded-full border border-stone-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <h3 className="font-semibold text-stone-900">{theme.name}</h3>
            <p className="text-sm text-stone-500 mt-1">{theme.description}</p>
          </button>
        ))}
      </div>

      {showSuccess && (
        <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 inline-block">
          Tema actualizado correctamente
        </p>
      )}
    </div>
  )
}
