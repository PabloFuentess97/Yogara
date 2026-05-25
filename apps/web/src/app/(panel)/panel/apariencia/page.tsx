import { requirePanelAuth } from '@/lib/panel-auth'
import { ThemeSelector } from './theme-selector'
import { BrandingEditor } from './branding-editor'
import { CustomHtmlSection } from './custom-html-section'

export const dynamic = 'force-dynamic'

export default async function AparienciaPage() {
  const { org } = await requirePanelAuth()

  const settings = (org.settings as Record<string, any>) ?? {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Apariencia</h1>
        <p className="text-stone-600 mt-1">
          Personaliza el tema visual y el contenido de tu sitio web
        </p>
      </div>

      {/* Theme Selector */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Tema</h2>
        <ThemeSelector currentThemeId={org.themeId} />
      </div>

      {/* Branding Editor */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Contenido y marca</h2>
        <BrandingEditor initialSettings={settings} />
      </div>

      {/* Block-based Custom HTML */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Landing personalizada</h2>
        <CustomHtmlSection initialBlocks={(settings.customBlocks as Record<string, string>) ?? {}} />
      </div>
    </div>
  )
}
