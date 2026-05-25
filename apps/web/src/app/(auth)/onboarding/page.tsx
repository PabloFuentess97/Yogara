'use client'

import { useActionState, useState } from 'react'
import { createOrganizationAction } from './actions'

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
]

export default function OnboardingPage() {
  const [selectedTheme, setSelectedTheme] = useState('zen-minimal')
  const [slug, setSlug] = useState('')

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await createOrganizationAction(formData)
    },
    undefined
  )

  const domain = 'yogara.app'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 max-w-lg w-full">
      <div className="text-center mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-stone-900">
          Crea tu centro
        </h1>
        <p className="text-stone-600 mt-2 text-sm">
          Configura tu espacio en Yogara en menos de un minuto
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
            Nombre del centro
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
            placeholder="Mi Centro de Yoga"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-stone-700 mb-1">
            Dirección web
          </label>
          <div className="flex items-center rounded-lg border border-stone-300 focus-within:ring-2 focus-within:ring-stone-900 focus-within:border-transparent overflow-hidden">
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="flex-1 px-4 py-2.5 outline-none"
              placeholder="micentro"
            />
            <span className="px-3 py-2.5 bg-stone-100 text-stone-500 text-sm border-l border-stone-300">
              .{domain}
            </span>
          </div>
          {slug && (
            <p className="text-xs text-stone-500 mt-1">
              Tu web será: <span className="font-medium">{slug}.{domain}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Tema visual
          </label>
          <div className="space-y-3">
            {THEMES.map((theme) => (
              <label
                key={theme.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? 'border-stone-900 bg-stone-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  checked={selectedTheme === theme.id}
                  onChange={() => setSelectedTheme(theme.id)}
                  className="sr-only"
                />
                <div className="flex gap-1">
                  {theme.colors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border border-stone-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-stone-900 text-sm">{theme.name}</p>
                  <p className="text-xs text-stone-500">{theme.description}</p>
                </div>
                {selectedTheme === theme.id && (
                  <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Creando...' : 'Crear mi centro'}
        </button>
      </form>
    </div>
  )
}
