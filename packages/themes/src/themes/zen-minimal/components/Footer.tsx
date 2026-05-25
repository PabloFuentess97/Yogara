import Link from 'next/link'
import type { FooterProps } from '../../../engine/types'

export function Footer({ org }: FooterProps) {
  const settings = org.settings as Record<string, unknown>
  const socialMedia = settings?.socialMedia as Record<string, string> | undefined

  return (
    <footer className="border-t border-stone-100 bg-stone-50/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">{org.name}</h3>
            {org.description && (
              <p className="text-sm text-stone-600 max-w-sm">{org.description}</p>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-3">Centro</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/clases" className="hover:text-stone-900 transition-colors">Clases</Link></li>
              <li><Link href="/horarios" className="hover:text-stone-900 transition-colors">Horarios</Link></li>
              <li><Link href="/membresias" className="hover:text-stone-900 transition-colors">Precios</Link></li>
              <li><Link href="/retiros" className="hover:text-stone-900 transition-colors">Retiros</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              {org.email && <li>{org.email}</li>}
              {org.phone && <li>{org.phone}</li>}
              {org.address && <li>{org.address}</li>}
              {org.city && <li>{org.city}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} {org.name}. Todos los derechos reservados.
          </p>
          {socialMedia && (
            <div className="flex items-center gap-4 text-sm text-stone-500">
              {socialMedia.instagram && <span>@{socialMedia.instagram.replace('@', '')}</span>}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
