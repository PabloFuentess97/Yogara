'use client'

import { useActionState } from 'react'
import { actualizarConfigAction } from './actions'

interface Org {
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  description: string | null
  timezone: string
  slug: string
}

export function ConfigForm({ org }: { org: Org }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      return await actualizarConfigAction(formData)
    },
    undefined
  )

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Datos del centro</h2>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              Configuración guardada correctamente.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Nombre del centro
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={org.name}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={org.email}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
              <input
                name="phone"
                type="tel"
                defaultValue={org.phone ?? ''}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Dirección</label>
              <input
                name="address"
                type="text"
                defaultValue={org.address ?? ''}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Ciudad</label>
              <input
                name="city"
                type="text"
                defaultValue={org.city ?? ''}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Zona horaria</label>
              <input
                type="text"
                defaultValue={org.timezone}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={org.description ?? ''}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none"
              placeholder="Describe tu centro..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {pending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-2">Subdominio</h2>
        <p className="text-sm text-stone-500">
          Tu centro es accesible en:{' '}
          <code className="px-2 py-0.5 bg-stone-100 rounded text-stone-900">
            {org.slug}.yogara.app
          </code>
        </p>
      </div>
    </div>
  )
}
