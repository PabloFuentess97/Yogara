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
    <div className="min-h-screen flex flex-col bg-[#F5F0EB]">
      <Navbar org={org} isLoggedIn={false} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 pt-28">{children}</main>
      <Footer org={org} />
    </div>
  )
}
