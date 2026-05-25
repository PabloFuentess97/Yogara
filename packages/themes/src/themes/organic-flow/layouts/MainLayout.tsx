import type { ReactNode } from 'react'
import type { OrganizationData } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

interface MainLayoutProps {
  children: ReactNode
  org: OrganizationData
}

export function MainLayout({ children, org }: MainLayoutProps) {
  const settings = org.settings as Record<string, unknown>
  const colors = getSetting<Record<string, string> | undefined>(settings, 'colors', undefined)
  const colorVars = colors ? {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-text': colors.text,
  } : {}

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F0EB] font-[family-name:var(--font-dm-sans)]"
      style={{ '--font-serif': 'var(--font-dm-serif)', ...colorVars } as unknown as React.CSSProperties}
    >
      <Navbar org={org} isLoggedIn={false} />
      <main className="flex-1">{children}</main>
      <Footer org={org} />
    </div>
  )
}
