'use client'

import { useRef, useActionState } from 'react'
import { crearPostAction } from './actions'

export function CreatePostForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await crearPostAction(formData)
      if (result.success) {
        formRef.current?.reset()
      }
      return result
    },
    undefined
  )

  return (
    <form ref={formRef} action={formAction} className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-3">
          {state.error}
        </div>
      )}

      <textarea
        name="content"
        required
        rows={3}
        placeholder="Comparte algo con la comunidad..."
        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none"
      />

      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
          {pending ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
