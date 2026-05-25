'use client'

import { useState, useTransition } from 'react'
import { updateSlugAction } from './actions'

interface Props {
  slug: string
}

export function SubdomainSection({ slug }: Props) {
  const [newSlug, setNewSlug] = useState(slug)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    const formData = new FormData()
    formData.set('slug', newSlug)

    startTransition(async () => {
      const result = await updateSlugAction(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Subdominio actualizado correctamente.' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error al actualizar el subdominio.' })
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Subdominio</h2>
      <p className="text-sm text-stone-500 mb-4">
        Tu sitio web está disponible en{' '}
        <span className="font-medium text-stone-700">{slug}.yogara.app</span>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-stone-700 mb-1">
            Nuevo subdominio
          </label>
          <div className="flex items-center">
            <input
              id="slug"
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase())}
              placeholder="mi-estudio"
              className="flex-1 rounded-l-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              minLength={3}
              maxLength={30}
              required
            />
            <span className="inline-flex items-center rounded-r-lg border border-l-0 border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-500">
              .yogara.app
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-400">
            Cambiar el subdominio cambiará la URL de tu sitio web.
          </p>
          <button
            type="submit"
            disabled={isPending || newSlug === slug}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Guardando...' : 'Cambiar subdominio'}
          </button>
        </div>
      </form>
    </div>
  )
}
