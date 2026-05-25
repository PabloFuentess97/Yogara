'use client'

import { useState, useTransition } from 'react'
import { updateCustomHtmlAction, removeCustomHtmlAction } from './custom-html-actions'

interface CustomHtmlSectionProps {
  initialHtml: string | null
}

export function CustomHtmlSection({ initialHtml }: CustomHtmlSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [html, setHtml] = useState(initialHtml ?? '')
  const [showPreview, setShowPreview] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSave() {
    setMessage(null)
    const formData = new FormData()
    formData.set('html', html)
    startTransition(async () => {
      const result = await updateCustomHtmlAction(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Landing personalizada guardada correctamente' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error desconocido' })
      }
    })
  }

  function handleRemove() {
    if (!confirm('¿Estás seguro de que quieres eliminar la landing personalizada? Se volverá a usar el tema por defecto.')) {
      return
    }
    setMessage(null)
    startTransition(async () => {
      const result = await removeCustomHtmlAction()
      if (result.success) {
        setHtml('')
        setShowPreview(false)
        setMessage({ type: 'success', text: 'Landing personalizada eliminada' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error desconocido' })
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div>
          <h3 className="font-semibold text-stone-900">Landing personalizada (HTML)</h3>
          <p className="text-sm text-stone-500 mt-0.5">
            Pega tu HTML personalizado. Usa variables como {'{{nombre}}'}, {'{{telefono}}'}, etc. para datos dinámicos.
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-5">
          {/* Variables reference table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left px-3 py-2 font-medium text-stone-700">Variable</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-700">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{nombre}}'}</td><td className="px-3 py-1.5 text-stone-600">Nombre del centro</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{descripcion}}'}</td><td className="px-3 py-1.5 text-stone-600">Descripción</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{email}}'}</td><td className="px-3 py-1.5 text-stone-600">Email de contacto</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{telefono}}'}</td><td className="px-3 py-1.5 text-stone-600">Teléfono</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{direccion}}'}</td><td className="px-3 py-1.5 text-stone-600">Dirección</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{ciudad}}'}</td><td className="px-3 py-1.5 text-stone-600">Ciudad</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{logo}}'}</td><td className="px-3 py-1.5 text-stone-600">URL del logo</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{enlace_clases}}'}</td><td className="px-3 py-1.5 text-stone-600">Link a /clases</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{enlace_horarios}}'}</td><td className="px-3 py-1.5 text-stone-600">Link a /horarios</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{enlace_reservas}}'}</td><td className="px-3 py-1.5 text-stone-600">Link a /reservas</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{enlace_login}}'}</td><td className="px-3 py-1.5 text-stone-600">Link a /login</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{enlace_registro}}'}</td><td className="px-3 py-1.5 text-stone-600">Link a /registro</td></tr>
              </tbody>
            </table>
          </div>

          {/* Textarea */}
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<html>&#10;  <body>&#10;    <h1>Bienvenido a {{nombre}}</h1>&#10;    ...&#10;  </body>&#10;</html>"
            className="w-full min-h-[400px] p-4 rounded-lg border border-stone-200 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-y"
          />

          {/* Preview */}
          {showPreview && html.trim() && (
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <div className="bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 border-b border-stone-200">
                Vista previa
              </div>
              <iframe
                srcDoc={html}
                className="w-full h-[500px] bg-white"
                sandbox="allow-same-origin"
                title="Vista previa HTML"
              />
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`px-4 py-2 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !html.trim()}
              className="px-5 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-5 py-2 rounded-lg border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
            </button>
            {initialHtml && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className="px-5 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Eliminar landing personalizada
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
