'use client'

import { useState, useTransition } from 'react'
import { updateBlocksAction, removeBlockAction } from './custom-html-actions'

const BLOCKS = [
  { id: 'navbar', name: 'Navbar', description: 'Barra de navegacion — Aplica en todas las paginas' },
  { id: 'hero', name: 'Hero', description: 'Hero — Seccion principal con imagen y titulo' },
  { id: 'clases', name: 'Clases', description: 'Clases — Seccion de clases en la landing' },
  { id: 'profesores', name: 'Profesores', description: 'Profesores — Seccion del equipo' },
  { id: 'precios', name: 'Precios', description: 'Precios — Planes y membresias' },
  { id: 'testimonios', name: 'Testimonios', description: 'Testimonios — Opiniones de alumnos' },
  { id: 'contacto', name: 'Contacto', description: 'Contacto — Informacion de contacto' },
  { id: 'footer', name: 'Footer', description: 'Pie de pagina — Aplica en todas las paginas' },
] as const

interface CustomHtmlSectionProps {
  initialBlocks: Record<string, string>
}

export function CustomHtmlSection({ initialBlocks }: CustomHtmlSectionProps) {
  const [blocks, setBlocks] = useState<Record<string, string>>(initialBlocks)
  const [enabledBlocks, setEnabledBlocks] = useState<Record<string, boolean>>(() => {
    const enabled: Record<string, boolean> = {}
    for (const block of BLOCKS) {
      enabled[block.id] = !!initialBlocks[block.id]
    }
    return enabled
  })
  const [previews, setPreviews] = useState<Record<string, boolean>>({})
  const [showVariables, setShowVariables] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleToggleBlock(blockId: string) {
    setEnabledBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }))
  }

  function handleBlockChange(blockId: string, value: string) {
    setBlocks((prev) => ({
      ...prev,
      [blockId]: value,
    }))
  }

  function handleTogglePreview(blockId: string) {
    setPreviews((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }))
  }

  function handleSaveAll() {
    setMessage(null)
    const formData = new FormData()
    for (const block of BLOCKS) {
      if (enabledBlocks[block.id] && blocks[block.id]?.trim()) {
        formData.set(`block_${block.id}`, blocks[block.id])
      }
    }
    startTransition(async () => {
      const result = await updateBlocksAction(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Bloques guardados correctamente' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error desconocido' })
      }
    })
  }

  function handleRemoveBlock(blockId: string) {
    setMessage(null)
    const formData = new FormData()
    formData.set('blockId', blockId)
    startTransition(async () => {
      const result = await removeBlockAction(formData)
      if (result.success) {
        setBlocks((prev) => {
          const next = { ...prev }
          delete next[blockId]
          return next
        })
        setEnabledBlocks((prev) => ({ ...prev, [blockId]: false }))
        setMessage({ type: 'success', text: 'Bloque eliminado' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Error desconocido' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-900 text-lg">Constructor de bloques</h3>
        <p className="text-sm text-stone-500 mt-1">
          Personaliza cada seccion de tu sitio web individualmente. Los bloques que no personalices usaran el diseno del tema seleccionado.
        </p>

        {/* Variables reference (collapsible) */}
        <button
          type="button"
          onClick={() => setShowVariables(!showVariables)}
          className="mt-4 text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-medium"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showVariables ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Variables disponibles
        </button>
        {showVariables && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left px-3 py-2 font-medium text-stone-700">Variable</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-700">Descripcion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{nombre}}'}</td><td className="px-3 py-1.5 text-stone-600">Nombre del centro</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{descripcion}}'}</td><td className="px-3 py-1.5 text-stone-600">Descripcion</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{email}}'}</td><td className="px-3 py-1.5 text-stone-600">Email de contacto</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{telefono}}'}</td><td className="px-3 py-1.5 text-stone-600">Telefono</td></tr>
                <tr><td className="px-3 py-1.5 font-mono text-xs text-stone-800">{'{{direccion}}'}</td><td className="px-3 py-1.5 text-stone-600">Direccion</td></tr>
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
        )}
      </div>

      {/* Block cards */}
      {BLOCKS.map((block) => (
        <div key={block.id} className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h4 className="font-semibold text-stone-900">{block.name}</h4>
              <p className="text-sm text-stone-500">{block.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle buttons */}
              <div className="flex rounded-lg border border-stone-200 overflow-hidden text-sm">
                <button
                  type="button"
                  onClick={() => {
                    if (enabledBlocks[block.id]) handleToggleBlock(block.id)
                  }}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    !enabledBlocks[block.id]
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Tema
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!enabledBlocks[block.id]) handleToggleBlock(block.id)
                  }}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    enabledBlocks[block.id]
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Personalizado
                </button>
              </div>
            </div>
          </div>

          {enabledBlocks[block.id] && (
            <div className="mt-4 space-y-3">
              <textarea
                value={blocks[block.id] ?? ''}
                onChange={(e) => handleBlockChange(block.id, e.target.value)}
                placeholder={`<${block.id === 'navbar' ? 'nav' : block.id === 'footer' ? 'footer' : 'section'}>...</${block.id === 'navbar' ? 'nav' : block.id === 'footer' ? 'footer' : 'section'}>`}
                className="w-full min-h-[200px] p-4 rounded-lg border border-stone-200 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-y"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTogglePreview(block.id)}
                  className="px-4 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
                >
                  {previews[block.id] ? 'Ocultar vista previa' : 'Vista previa'}
                </button>
                {initialBlocks[block.id] && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    disabled={isPending}
                    className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              {previews[block.id] && blocks[block.id]?.trim() && (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <div className="bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 border-b border-stone-200">
                    Vista previa — {block.name}
                  </div>
                  <iframe
                    srcDoc={blocks[block.id]}
                    className="w-full h-[300px] bg-white"
                    sandbox="allow-same-origin"
                    title={`Vista previa ${block.name}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isPending}
          className="px-6 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando...' : 'Guardar todos los cambios'}
        </button>
      </div>
    </div>
  )
}
