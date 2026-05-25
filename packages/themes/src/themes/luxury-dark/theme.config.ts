import type { ThemeConfig } from '../../engine/types'

export const config: ThemeConfig = {
  id: 'luxury-dark',
  name: 'Luxury Dark',
  description: 'Diseno oscuro, lujoso y elegante con detalles dorados',
  version: '1.0.0',
  author: 'Yogara',
  preview: '/themes/luxury-dark/preview.png',
  colors: {
    primary: '#D4AF37',
    secondary: '#F5E6C8',
    accent: '#B8860B',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#F5F5F5',
    muted: '#9CA3AF',
    destructive: '#EF4444',
    success: '#22C55E',
  },
  fonts: {
    heading: 'Cormorant Garamond',
    body: 'Montserrat',
  },
  features: {
    hasAnimations: true,
    hasDarkMode: true,
    heroStyle: 'video',
    navStyle: 'fixed',
    footerStyle: 'centered',
  },
}
