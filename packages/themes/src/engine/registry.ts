import type { ThemeContract } from './types'

type ThemeModule = { default: ThemeContract }

const themeRegistry: Record<string, () => Promise<ThemeModule>> = {
  'zen-minimal': () => import('../themes/zen-minimal'),
  'organic-flow': () => import('../themes/organic-flow'),
  'luxury-dark': () => import('../themes/luxury-dark'),
}

export { themeRegistry }

export async function loadTheme(themeId: string): Promise<ThemeContract> {
  const loader = themeRegistry[themeId]
  if (!loader) {
    throw new Error(`Theme "${themeId}" no encontrado en el registro`)
  }
  const module = await loader()
  return module.default
}
