import Link from 'next/link'
import { requirePanelAuth } from '@/lib/panel-auth'
import { prisma } from '@yogara/database'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { org, user } = await requirePanelAuth()
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'yogara.app'

  const dbUser = await prisma.user.findUnique({ where: { id: user.id! }, select: { isPlatformAdmin: true } })
  const isPlatformAdmin = dbUser?.isPlatformAdmin ?? false

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/panel" className="text-lg font-bold text-stone-900">
              Yogara
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/panel">Resumen</NavLink>
              <NavLink href="/panel/salas">Salas</NavLink>
              <NavLink href="/panel/apariencia">Apariencia</NavLink>
              <NavLink href="/panel/dominio">Dominio</NavLink>
              <NavLink href="/panel/facturacion">Facturación</NavLink>
              {isPlatformAdmin && <NavLink href="/panel/temas">Temas</NavLink>}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`https://${org.slug}.${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Ver mi sitio &rarr;
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
    >
      {children}
    </Link>
  )
}
