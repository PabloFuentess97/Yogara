import type { ThemeConfig } from '../../engine/types'

export const config: ThemeConfig = {
  id: 'organic-flow',
  name: 'Organic Flow',
  description: 'Estilo orgánico con formas naturales y colores tierra',
  version: '1.0.0',
  author: 'Yogara',
  preview: '/themes/organic-flow/preview.png',
  colors: {
    primary: '#5B7A5E',
    secondary: '#C47D4E',
    accent: '#E8D5B7',
    background: '#F5F0EB',
    surface: '#FFFFFF',
    text: '#2D2D2D',
    muted: '#7A7A7A',
    destructive: '#C0392B',
    success: '#27AE60',
  },
  fonts: {
    heading: 'DM Serif Display',
    body: 'DM Sans',
  },
  features: {
    hasAnimations: true,
    hasDarkMode: false,
    heroStyle: 'split',
    navStyle: 'transparent',
    footerStyle: 'full',
  },
}
