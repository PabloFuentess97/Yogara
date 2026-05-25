'use client'

import { useState, useTransition } from 'react'
import { addCustomDomainAction, removeCustomDomainAction } from './actions'

interface CustomDomain {
  id: string
  domain: string
  verified: boolean
  createdAt: Date
}

interface Props {
  domains: CustomDomain[]
}

export function CustomDomainSection({ domains }: Props) {
  const [newDomain, setNewDomain] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    const formData = new FormData()
    formData.set('domain', newDomain)

    startTransition(async () => {
      const result = await addCustomDomainAction(formData)
      if (result.success) {
        setNewDomain('')
        setMessage({ type: 'success', text: 'Dominio añadido. Configura el registro CNAME para verificarlo.' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error al añadir el dominio.' })
      }
    })
  }

  function handleRemove(id: string) {
    setMessage(null)

    const formData = new FormData()
    formData.set('id', id)

    startTransition(async () => {
      const result = await removeCustomDomainAction(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Dominio eliminado.' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error al eliminar el dominio.' })
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Dominio personalizado</h2>
      <p className="text-sm text-stone-500 mb-4">
        Conecta tu propio dominio para que tus alumnos accedan a tu sitio con tu marca.
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

      {/* Domain list */}
      {domains.length > 0 && (
        <div className="mb-4 space-y-2">
          {domains.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-900">{d.domain}</span>
                {d.verified ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-medium text-green-700">
                    Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Pendiente
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(d.id)}
                disabled={isPending}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add domain form */}
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-stone-700 mb-1">
            Añadir dominio
          </label>
          <input
            id="domain"
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
            placeholder="www.miestudio.com"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isPending || !newDomain}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Añadiendo...' : 'Añadir dominio'}
          </button>
        </div>
      </form>

      {/* Instructions */}
      <div className="mt-6 rounded-lg bg-stone-50 border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-900 mb-2">Instrucciones de configuración</h3>
        <p className="text-sm text-stone-600 mb-2">
          Apunta tu dominio con un registro CNAME a <span className="font-mono font-medium text-stone-800">yogara.app</span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-stone-600">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-1.5 pr-4 font-medium text-stone-700">Tipo</th>
                <th className="text-left py-1.5 pr-4 font-medium text-stone-700">Nombre</th>
                <th className="text-left py-1.5 font-medium text-stone-700">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1.5 pr-4 font-mono">CNAME</td>
                <td className="py-1.5 pr-4 font-mono">www</td>
                <td className="py-1.5 font-mono">yogara.app</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-400 mt-2">
          La verificación puede tardar hasta 24 horas después de configurar el registro DNS.
        </p>
      </div>
    </div>
  )
}
