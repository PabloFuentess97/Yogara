import type { ReactNode } from 'react'
import type { OrganizationData } from '../../../engine/types'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

interface MainLayoutProps {
  children: ReactNode
  org: OrganizationData
}

export function MainLayout({ children, org }: MainLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#0A0A0A] font-[family-name:var(--font-montserrat)]"
      style={{ '--font-serif': 'var(--font-cormorant)' } as React.CSSProperties}
    >
      <Navbar org={org} isLoggedIn={false} />
      <main className="flex-1">{children}</main>
      <Footer org={org} />
    </div>
  )
}
