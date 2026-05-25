import Link from 'next/link'
import { headers } from 'next/headers'
import { prisma } from '@yogara/database'
import { TenantHome } from './tenant-home'

export default async function HomePage() {
  const headersList = await headers()
  const slug = headersList.get('x-tenant-slug')
  const customDomain = headersList.get('x-custom-domain')

  if (slug || customDomain) {
    let org = null
    if (slug) {
      org = await prisma.organization.findFirst({ where: { slug, isActive: true } })
    } else if (customDomain) {
      const domain = await prisma.customDomain.findFirst({
        where: { domain: customDomain, verified: true },
        include: { organization: true },
      })
      org = domain?.organization ?? null
    }

    if (!org && process.env.NODE_ENV === 'development') {
      org = await prisma.organization.findFirst({ where: { isActive: true } })
    }

    if (org) {
      return <TenantHome org={org} />
    }
  }

  // Development fallback: if no tenant header but has orgs, show tenant home
  if (process.env.NODE_ENV === 'development') {
    const org = await prisma.organization.findFirst({ where: { isActive: true } })
    if (org) {
      return <TenantHome org={org} />
    }
  }

  return <MarketingHome />
}

function MarketingHome() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center bg-gradient-to-b from-stone-50 to-white">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-bold text-stone-900 mb-6">
          Encuentra tu equilibrio interior
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mb-10">
          Plataforma para centros de yoga y bienestar. Gestiona clases, alumnos, membresías y comunidad desde un solo lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
          >
            Registra tu centro
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Horarios y Reservas</h3>
            <p className="text-stone-600 text-sm">
              Gestión completa de horarios, clases y sistema de reservas con lista de espera.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">CRM de Alumnos</h3>
            <p className="text-stone-600 text-sm">
              Ficha completa de cada alumno con membresías, asistencia y notas.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="text-xl">🎨</span>
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Tu Web Única</h3>
            <p className="text-stone-600 text-sm">
              Cada centro tiene su propia web con un diseño visual completamente único.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-stone-200 text-center text-stone-500 text-sm">
        <p>© 2026 Yogara. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
