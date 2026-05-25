'use client'

import { useState, useTransition } from 'react'
import { updateThemeAction } from './actions'

const THEMES = [
  {
    id: 'zen-minimal',
    name: 'Zen Minimal',
    description: 'Limpio y sereno. Tonos neutros.',
    colors: ['#F5F5F4', '#1C1917', '#A8A29E'],
  },
  {
    id: 'organic-flow',
    name: 'Organic Flow',
    description: 'Cálido y natural. Tonos tierra.',
    colors: ['#F5F0EB', '#5C4033', '#A67B5B'],
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark',
    description: 'Sofisticado y premium. Fondo oscuro.',
    colors: ['#0A0A0A', '#C8A96E', '#1A1A1A'],
  },
]

interface Props {
  currentThemeId: string
}

export function ThemeSection({ currentThemeId }: Props) {
  const [selectedTheme, setSelectedTheme] = useState(currentThemeId)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSelect(themeId: string) {
    setSelectedTheme(themeId)
    setMessage(null)

    startTransition(async () => {
      const result = await updateThemeAction(themeId)
      if (result.success) {
        setMessage({ type: 'success', text: 'Tema actualizado correctamente.' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error al actualizar el tema.' })
        setSelectedTheme(currentThemeId)
      }
    })
  }

  return (
    <div className="mt-6 bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Tema visual</h2>
      <p className="text-sm text-stone-500 mb-4">
        Selecciona el tema que verán tus alumnos en la web pública.
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id
          return (
            <button
              key={theme.id}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(theme.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all disabled:opacity-60 ${
                isSelected
                  ? 'border-stone-900 bg-stone-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex gap-1.5">
                {theme.colors.map((color) => (
                  <div
                    key={color}
                    className="w-7 h-7 rounded-full border border-stone-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-900 text-sm">{theme.name}</p>
                <p className="text-xs text-stone-500">{theme.description}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
