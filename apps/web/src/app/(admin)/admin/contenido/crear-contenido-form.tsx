'use client'

import { useState, useActionState } from 'react'
import { crearContenidoAction } from './actions'

interface Props {
  instructors: { id: string; name: string }[]
}

export function CrearContenidoForm({ instructors }: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await crearContenidoAction(formData)
      if (result.success) setOpen(false)
      return result
    },
    undefined,
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
      >
        Crear contenido
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Nuevo contenido</h2>

            {state?.error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-3">
              <input name="title" required placeholder="Título" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
              <textarea name="description" placeholder="Descripción" rows={2} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm resize-none" />
              <input name="videoUrl" required placeholder="URL del video (YouTube, Vimeo...)" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
              <input name="thumbnailUrl" placeholder="URL de miniatura (opcional)" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input name="durationMinutes" type="number" required placeholder="Duración (min)" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
                <input name="category" placeholder="Categoría" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select name="level" className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm">
                  <option value="ALL">Todos los niveles</option>
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                </select>
                <select name="instructorId" required className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm">
                  <option value="">Instructor</option>
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input type="checkbox" name="requiresMembership" defaultChecked className="rounded" />
                  Requiere membresía
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input type="checkbox" name="isPublished" className="rounded" />
                  Publicar ahora
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border border-stone-300 text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium disabled:opacity-50">
                  {pending ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
