'use client'

import { useState, useActionState } from 'react'
import { inviteInstructorAction } from './actions'

export function InvitarProfesorForm() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await inviteInstructorAction(formData)
      if (result.success) {
        setOpen(false)
      }
      return result
    },
    undefined
  )

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
      >
        + Invitar profesor
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-stone-200 p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Invitar profesor</h2>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              placeholder="profesor@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              placeholder="Nombre completo"
            />
            <p className="text-xs text-stone-400 mt-1">
              Si el usuario ya existe, se usará su nombre actual.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {pending ? 'Invitando...' : 'Invitar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
