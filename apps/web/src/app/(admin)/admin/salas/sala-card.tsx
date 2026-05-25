'use client'

import { useState, useActionState } from 'react'
import { actualizarSalaAction, eliminarSalaAction } from './actions'

interface SalaCardProps {
  room: {
    id: string
    name: string
    capacity: number
    description: string | null
  }
}

export function SalaCard({ room }: SalaCardProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [editState, editAction, editPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await actualizarSalaAction(formData)
      if (result.success) {
        setEditing(false)
      }
      return result
    },
    undefined
  )

  const [, deleteAction, deletePending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined) => {
      const result = await eliminarSalaAction(room.id)
      return result
    },
    undefined
  )

  if (editing) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <form action={editAction} className="space-y-3">
          <input type="hidden" name="id" value={room.id} />

          {editState?.error && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {editState.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Nombre</label>
            <input
              name="name"
              required
              defaultValue={room.name}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Capacidad</label>
            <input
              name="capacity"
              type="number"
              required
              min={1}
              defaultValue={room.capacity}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Descripcion</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={room.description ?? ''}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={editPending}
              className="flex-1 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {editPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-semibold text-stone-900">{room.name}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors px-1.5 py-0.5 rounded hover:bg-stone-100"
          >
            Editar
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors px-1.5 py-0.5 rounded hover:bg-red-50"
            >
              Eliminar
            </button>
          ) : (
            <form action={deleteAction} className="inline-flex gap-1">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-stone-500 hover:text-stone-700 font-medium transition-colors px-1.5 py-0.5 rounded hover:bg-stone-100"
              >
                No
              </button>
              <button
                type="submit"
                disabled={deletePending}
                className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors px-1.5 py-0.5 rounded bg-red-50 hover:bg-red-100 disabled:opacity-50"
              >
                {deletePending ? '...' : 'Confirmar'}
              </button>
            </form>
          )}
        </div>
      </div>
      <p className="text-sm text-stone-600">Capacidad: {room.capacity} personas</p>
      {room.description && (
        <p className="text-sm text-stone-500 mt-2">{room.description}</p>
      )}
    </div>
  )
}
