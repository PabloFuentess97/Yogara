import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/alumnos', label: 'Alumnos', icon: '👥' },
  { href: '/admin/clases', label: 'Clases', icon: '🧘' },
  { href: '/admin/horarios', label: 'Horarios', icon: '📅' },
  { href: '/admin/membresias', label: 'Membresías', icon: '💳' },
  { href: '/admin/retiros', label: 'Retiros', icon: '🏔️' },
  { href: '/admin/contenido', label: 'Contenido', icon: '🎬' },
  { href: '/admin/profesores', label: 'Profesores', icon: '🧑‍🏫' },
  { href: '/admin/salas', label: 'Salas', icon: '🏠' },
  { href: '/admin/comunidad', label: 'Comunidad', icon: '💬' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { organization } = await requireAdmin()

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-stone-200">
        <div className="p-6 border-b border-stone-200">
          <Link href="/" className="block">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-stone-900 truncate">
              {organization.name}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Panel de administración</p>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Buscar..."
              className="w-64 px-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-stone-500 hover:text-stone-900">
              Ver sitio
            </Link>
            <div className="w-8 h-8 rounded-full bg-stone-300" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
