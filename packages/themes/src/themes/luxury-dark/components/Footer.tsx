import Link from 'next/link'
import type { FooterProps } from '../../../engine/types'

export function Footer({ org }: FooterProps) {
  const settings = org.settings as Record<string, unknown>
  const socialMedia = settings?.socialMedia as Record<string, string> | undefined

  return (
    <footer className="border-t border-[#D4AF37]/10 bg-[#0A0A0A]">
      {/* Gold decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Brand */}
          <h3
            className="text-3xl font-light text-[#D4AF37] tracking-wider mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {org.name}
          </h3>
          {org.description && (
            <p className="text-sm text-[#9CA3AF] max-w-md mx-auto font-light leading-relaxed">
              {org.description}
            </p>
          )}

          {/* Navigation */}
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-8">
            <Link href="/clases" className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-light">
              Clases
            </Link>
            <Link href="/horarios" className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-light">
              Horarios
            </Link>
            <Link href="/membresias" className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-light">
              Precios
            </Link>
            <Link href="/retiros" className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-light">
              Retiros
            </Link>
          </nav>

          {/* Contact info */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#9CA3AF]">
            {org.email && <span>{org.email}</span>}
            {org.phone && <span>{org.phone}</span>}
            {org.address && <span>{org.address}{org.city ? `, ${org.city}` : ''}</span>}
          </div>

          {/* Social */}
          {socialMedia?.instagram && (
            <div className="mt-6 text-sm text-[#D4AF37]/70">
              @{socialMedia.instagram.replace('@', '')}
            </div>
          )}

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-[#D4AF37]/5">
            <p className="text-xs text-[#9CA3AF]/60 tracking-wide">
              &copy; {new Date().getFullYear()} {org.name}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
