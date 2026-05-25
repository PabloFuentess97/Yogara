'use client'

import { useTransition, useState } from 'react'
import { updateBrandingAction } from './actions'

interface BrandingEditorProps {
  initialSettings: Record<string, any>
}

function getNestedValue(obj: Record<string, any>, path: string): string {
  const keys = path.split('.')
  let current: any = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return ''
    current = current[key]
  }
  return current ?? ''
}

function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string
  description: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl border border-stone-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div>
          <h3 className="font-semibold text-stone-900">{title}</h3>
          <p className="text-sm text-stone-500 mt-0.5">{description}</p>
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
      {isOpen && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

function TextInput({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  defaultValue: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
      />
    </div>
  )
}

function TextAreaInput({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 3,
}: {
  label: string
  name: string
  defaultValue: string
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none"
      />
    </div>
  )
}

function ColorInput({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue: string
}) {
  const [color, setColor] = useState(defaultValue || '#000000')

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          name={name}
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="#000000"
          className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export function BrandingEditor({ initialSettings }: BrandingEditorProps) {
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setShowSuccess(false)
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateBrandingAction(formData)
      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Section 1: Marca */}
      <CollapsibleSection
        title="Marca"
        description="Logo y nombre visible de tu estudio"
        defaultOpen={true}
      >
        <TextInput
          label="URL del logo"
          name="brand.logoUrl"
          defaultValue={getNestedValue(initialSettings, 'brand.logoUrl')}
          placeholder="https://ejemplo.com/logo.png"
        />
        <TextInput
          label="Nombre visible"
          name="brand.name"
          defaultValue={getNestedValue(initialSettings, 'brand.name')}
          placeholder="Mi Estudio de Yoga"
        />
      </CollapsibleSection>

      {/* Section 2: Hero */}
      <CollapsibleSection
        title="Hero"
        description="Sección principal de tu página de inicio"
      >
        <TextInput
          label="Título principal"
          name="heroTitle"
          defaultValue={getNestedValue(initialSettings, 'heroTitle')}
          placeholder="Bienvenido a nuestro estudio"
        />
        <TextAreaInput
          label="Subtítulo"
          name="heroSubtitle"
          defaultValue={getNestedValue(initialSettings, 'heroSubtitle')}
          placeholder="Encuentra tu equilibrio interior..."
        />
        <TextInput
          label="URL imagen de fondo"
          name="heroImage"
          defaultValue={getNestedValue(initialSettings, 'heroImage')}
          placeholder="https://ejemplo.com/hero.jpg"
        />
        <TextInput
          label="Texto del botón principal"
          name="hero.ctaText"
          defaultValue={getNestedValue(initialSettings, 'hero.ctaText') || 'Ver horarios'}
          placeholder="Ver horarios"
        />
        <TextInput
          label="Link del botón"
          name="hero.ctaLink"
          defaultValue={getNestedValue(initialSettings, 'hero.ctaLink') || '/horarios'}
          placeholder="/horarios"
        />
      </CollapsibleSection>

      {/* Section 3: Colores */}
      <CollapsibleSection
        title="Colores"
        description="Paleta de colores personalizada para tu sitio"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorInput
            label="Color primario"
            name="colors.primary"
            defaultValue={getNestedValue(initialSettings, 'colors.primary')}
          />
          <ColorInput
            label="Color secundario"
            name="colors.secondary"
            defaultValue={getNestedValue(initialSettings, 'colors.secondary')}
          />
          <ColorInput
            label="Color acento"
            name="colors.accent"
            defaultValue={getNestedValue(initialSettings, 'colors.accent')}
          />
          <ColorInput
            label="Color fondo"
            name="colors.background"
            defaultValue={getNestedValue(initialSettings, 'colors.background')}
          />
          <ColorInput
            label="Color texto"
            name="colors.text"
            defaultValue={getNestedValue(initialSettings, 'colors.text')}
          />
        </div>
      </CollapsibleSection>

      {/* Section 4: Secciones */}
      <CollapsibleSection
        title="Secciones"
        description="Contenido de la sección Sobre nosotros"
      >
        <TextInput
          label="Título"
          name="sections.about.title"
          defaultValue={getNestedValue(initialSettings, 'sections.about.title')}
          placeholder="Sobre nosotros"
        />
        <TextAreaInput
          label="Descripción"
          name="sections.about.description"
          defaultValue={getNestedValue(initialSettings, 'sections.about.description')}
          placeholder="Somos un estudio dedicado a..."
        />
        <TextInput
          label="URL de imagen"
          name="sections.about.imageUrl"
          defaultValue={getNestedValue(initialSettings, 'sections.about.imageUrl')}
          placeholder="https://ejemplo.com/about.jpg"
        />
      </CollapsibleSection>

      {/* Section 5: Contacto */}
      <CollapsibleSection
        title="Contacto"
        description="Información de contacto de tu estudio"
      >
        <TextInput
          label="Dirección"
          name="contact.address"
          defaultValue={getNestedValue(initialSettings, 'contact.address')}
          placeholder="Calle Principal 123, Madrid"
        />
        <TextInput
          label="Teléfono"
          name="contact.phone"
          defaultValue={getNestedValue(initialSettings, 'contact.phone')}
          placeholder="+34 600 000 000"
        />
        <TextInput
          label="Email"
          name="contact.email"
          defaultValue={getNestedValue(initialSettings, 'contact.email')}
          placeholder="info@miestudio.com"
        />
        <TextInput
          label="URL Google Maps embed"
          name="contact.mapUrl"
          defaultValue={getNestedValue(initialSettings, 'contact.mapUrl')}
          placeholder="https://www.google.com/maps/embed?..."
        />
      </CollapsibleSection>

      {/* Section 6: Redes sociales */}
      <CollapsibleSection
        title="Redes sociales"
        description="Tus perfiles en redes sociales"
      >
        <TextInput
          label="Instagram"
          name="socialMedia.instagram"
          defaultValue={getNestedValue(initialSettings, 'socialMedia.instagram')}
          placeholder="@miestudio"
        />
        <TextInput
          label="Facebook"
          name="socialMedia.facebook"
          defaultValue={getNestedValue(initialSettings, 'socialMedia.facebook')}
          placeholder="https://facebook.com/miestudio"
        />
        <TextInput
          label="YouTube"
          name="socialMedia.youtube"
          defaultValue={getNestedValue(initialSettings, 'socialMedia.youtube')}
          placeholder="https://youtube.com/@miestudio"
        />
        <TextInput
          label="WhatsApp"
          name="socialMedia.whatsapp"
          defaultValue={getNestedValue(initialSettings, 'socialMedia.whatsapp')}
          placeholder="+34 600 000 000"
        />
      </CollapsibleSection>

      {/* Section 7: SEO */}
      <CollapsibleSection
        title="SEO"
        description="Optimización para motores de búsqueda"
      >
        <TextInput
          label="Título SEO"
          name="seo.title"
          defaultValue={getNestedValue(initialSettings, 'seo.title')}
          placeholder="Mi Estudio de Yoga | Clases y Horarios"
        />
        <TextAreaInput
          label="Meta descripción"
          name="seo.description"
          defaultValue={getNestedValue(initialSettings, 'seo.description')}
          placeholder="Descubre nuestras clases de yoga, pilates y meditación..."
          rows={2}
        />
      </CollapsibleSection>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors ${
            isPending ? 'opacity-60 cursor-wait' : 'hover:bg-stone-800'
          }`}
        >
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {showSuccess && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            Cambios guardados correctamente
          </p>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
