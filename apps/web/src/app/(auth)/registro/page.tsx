'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { registroAction } from './actions'

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await registroAction(formData)
    },
    undefined
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      <div className="text-center mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-stone-900">
          Crear cuenta
        </h1>
        <p className="text-stone-600 mt-2 text-sm">
          Únete a tu centro de yoga favorito
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
            Nombre completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-stone-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-stone-900 hover:underline">
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}
