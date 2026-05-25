'use client'

import { useActionState } from 'react'
import { removeInstructorAction } from './actions'

export function QuitarProfesorButton({ memberId, name }: { memberId: string; name: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const confirmed = window.confirm(`¿Seguro que quieres quitar a ${name} como profesor?`)
      if (!confirmed) return undefined
      return removeInstructorAction(formData)
    },
    undefined
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="memberId" value={memberId} />
      {state?.error && (
        <p className="text-xs text-red-600 mb-1">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50"
      >
        {pending ? 'Quitando...' : 'Quitar'}
      </button>
    </form>
  )
}
