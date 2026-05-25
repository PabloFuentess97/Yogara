import type { ThemeConfig } from '../../engine/types'

export const config: ThemeConfig = {
  id: 'zen-minimal',
  name: 'Zen Minimal',
  description: 'Diseño minimalista con mucho whitespace y líneas limpias',
  version: '1.0.0',
  author: 'Yogara',
  preview: '/themes/zen-minimal/preview.png',
  colors: {
    primary: '#8B7355',
    secondary: '#D4C5B0',
    accent: '#C4956A',
    background: '#FAFAF8',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#6B7280',
    destructive: '#DC2626',
    success: '#16A34A',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
  },
  features: {
    hasAnimations: true,
    hasDarkMode: false,
    heroStyle: 'fullscreen',
    navStyle: 'sticky',
    footerStyle: 'minimal',
  },
}
