import { requirePanelAuth } from '@/lib/panel-auth'
import { ThemeSelector } from './theme-selector'

export const dynamic = 'force-dynamic'

export default async function AparienciaPage() {
  const { org } = await requirePanelAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Apariencia</h1>
        <p className="text-stone-600 mt-1">
          Personaliza el tema visual de tu sitio web
        </p>
      </div>

      <ThemeSelector currentThemeId={org.themeId} />
    </div>
  )
}
