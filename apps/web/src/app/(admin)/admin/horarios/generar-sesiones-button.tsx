'use client'

import { useActionState } from 'react'
import { generarSesionesAction } from './actions'

export function GenerarSesionesButton() {
  const [state, formAction, pending] = useActionState(
    async () => {
      return await generarSesionesAction()
    },
    undefined as { success?: boolean; count?: number; error?: string } | undefined
  )

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
      >
        {pending ? 'Generando...' : 'Generar sesiones (4 sem)'}
      </button>
      {state?.success && (
        <span className="ml-2 text-sm text-green-600">
          {state.count} sesiones creadas
        </span>
      )}
      {state?.error && (
        <span className="ml-2 text-sm text-red-600">{state.error}</span>
      )}
    </form>
  )
}
