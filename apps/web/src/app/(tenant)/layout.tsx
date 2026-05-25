import type { Metadata } from 'next'
import Link from 'next/link'
import { resolveTenant } from '@/lib/tenant'
import { auth } from '@/lib/auth'
import { getCustomBlock, renderBlock } from '@/lib/render-custom-html'

export async function generateMetadata(): Promise<Metadata> {
  const org = await resolveTenant()
  return {
    title: {
      default: org.name,
      template: `%s | ${org.name}`,
    },
    description: org.description ?? `${org.name} - Centro de yoga y bienestar`,
    openGraph: {
      siteName: org.name,
      type: 'website',
    },
  }
}

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  const org = await resolveTenant()
  const session = await auth()
  const isLoggedIn = !!session?.user

  const settings = (org.settings ?? {}) as Record<string, unknown>
  const theme = org.customTheme

  // Priority: customTheme > customBlocks > default
  const navbarHtml = theme?.navbar ?? getCustomBlock(settings, 'navbar')
  const footerHtml = theme?.footer ?? getCustomBlock(settings, 'footer')
  const headHtml = theme?.headHtml ?? null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Head injection (fonts, CDN, styles) */}
      {headHtml && (
        <div dangerouslySetInnerHTML={{ __html: renderBlock(headHtml, org) }} />
      )}

      {/* Navbar */}
      {navbarHtml ? (
        <div dangerouslySetInnerHTML={{ __html: renderBlock(navbarHtml, org) }} />
      ) : (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-heading)] text-lg font-bold text-stone-900"
            >
              {org.name}
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-stone-600">
              <Link href="/clases" className="hover:text-stone-900 transition-colors">
                Clases
              </Link>
              <Link href="/horarios" className="hover:text-stone-900 transition-colors">
                Horarios
              </Link>
              <Link href="/retiros" className="hover:text-stone-900 transition-colors">
                Retiros
              </Link>
              <Link href="/contenido" className="hover:text-stone-900 transition-colors">
                On Demand
              </Link>
              <Link href="/membresias" className="hover:text-stone-900 transition-colors">
                Precios
              </Link>
              {isLoggedIn && (
                <>
                  <Link href="/comunidad" className="hover:text-stone-900 transition-colors">
                    Comunidad
                  </Link>
                  <Link href="/reservas" className="hover:text-stone-900 transition-colors">
                    Mis Reservas
                  </Link>
                </>
              )}
            </nav>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/reservas"
                  className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
                >
                  Mis Reservas
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Panel
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Acceder
              </Link>
            )}
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer */}
      {footerHtml ? (
        <div dangerouslySetInnerHTML={{ __html: renderBlock(footerHtml, org) }} />
      ) : (
        <footer className="border-t border-stone-200 bg-white py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-stone-500">&copy; 2026 {org.name}</p>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              {org.email && <span>{org.email}</span>}
              {org.phone && <span>{org.phone}</span>}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
