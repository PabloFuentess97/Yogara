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
      className="min-h-screen flex flex-col bg-[#F5F0EB] font-[family-name:var(--font-dm-sans)]"
      style={{ '--font-serif': 'var(--font-dm-serif)' } as React.CSSProperties}
    >
      <Navbar org={org} isLoggedIn={false} />
      <main className="flex-1">{children}</main>
      <Footer org={org} />
    </div>
  )
}
