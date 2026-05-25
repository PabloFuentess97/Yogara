import type { HeroSectionProps } from '../../../engine/types'
import { Hero } from '../components/Hero'

export function HeroSection({ org }: HeroSectionProps) {
  const settings = org.settings as Record<string, unknown>

  return (
    <Hero
      org={org}
      title={(settings?.heroTitle as string) ?? `Bienvenido a ${org.name}`}
      subtitle={(settings?.heroSubtitle as string) ?? org.description ?? undefined}
      backgroundImage={settings?.heroImage as string | undefined}
    />
  )
}
