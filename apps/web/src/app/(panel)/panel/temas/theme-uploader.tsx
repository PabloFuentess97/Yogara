'use client'

import { useState } from 'react'

export function ThemeUploader() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; theme?: any } | null>(null)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/admin/themes/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setResult(data)
      if (data.success) {
        ;(e.target as HTMLFormElement).reset()
        window.location.reload()
      }
    } catch {
      setResult({ error: 'Error de red' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="font-semibold text-stone-900 mb-4">Subir Tema</h2>

      <form onSubmit={handleUpload} className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm text-stone-600 mb-1">
            Archivo ZIP del tema
          </label>
          <input
            type="file"
            name="theme"
            accept=".zip"
            required
            className="block w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors"
        >
          {uploading ? 'Subiendo...' : 'Subir Tema'}
        </button>
      </form>

      {result?.error && (
        <p className="mt-3 text-sm text-red-600">{result.error}</p>
      )}
      {result?.success && (
        <p className="mt-3 text-sm text-green-600">
          Tema &quot;{result.theme?.name}&quot; instalado correctamente ({result.theme?.sections?.length} secciones, {result.theme?.assetsCount} assets)
        </p>
      )}

      <div className="mt-4 p-4 bg-stone-50 rounded-lg">
        <p className="text-xs font-medium text-stone-700 mb-2">Estructura del ZIP:</p>
        <pre className="text-xs text-stone-500 font-mono leading-relaxed">{`mi-tema/
├── theme.json          ← nombre, colores, fonts
├── head.html           ← Tags <head> (Tailwind CDN, fonts, CSS)
├── navbar.html         ← HTML del navbar
├── hero.html           ← HTML del hero
├── about.html          ← Sección sobre nosotros
├── clases.html         ← Sección de clases (landing)
├── profesores.html     ← Sección de profesores
├── precios.html        ← Sección de precios
├── testimonios.html    ← Sección testimonios
├── contacto.html       ← Sección contacto
├── footer.html         ← HTML del footer
├── classes-header.html ← Header página /clases
└── assets/             ← Imágenes, CSS, etc.
    ├── styles.css
    └── hero-bg.jpg`}</pre>
        <p className="text-xs text-stone-500 mt-3 font-medium">Variables disponibles:</p>
        <p className="text-xs text-stone-500 mt-1">
          <code className="bg-stone-100 px-1 rounded">{'{{nombre}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{descripcion}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{email}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{telefono}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{direccion}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{ciudad}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{logo}}'}</code>
        </p>
        <p className="text-xs text-stone-500 mt-1">
          <code className="bg-stone-100 px-1 rounded">{'{{enlace_clases}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{enlace_horarios}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{enlace_reservas}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{enlace_login}}'}</code>{' '}
          <code className="bg-stone-100 px-1 rounded">{'{{enlace_registro}}'}</code>
        </p>
        <p className="text-xs text-stone-500 mt-1">
          Assets: usa <code className="bg-stone-100 px-1 rounded">{'{{asset:archivo.jpg}}'}</code> para referenciar archivos de assets/
        </p>
      </div>
    </div>
  )
}
