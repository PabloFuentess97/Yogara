import type { ReactNode } from 'react'
import type { OrganizationData } from '../../../engine/types'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

interface ClassLayoutProps {
  children: ReactNode
  org: OrganizationData
}

export function ClassLayout({ children, org }: ClassLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar org={org} isLoggedIn={false} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">{children}</main>
      <Footer org={org} />
    </div>
  )
}
