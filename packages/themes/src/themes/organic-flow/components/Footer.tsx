import Link from 'next/link'
import type { FooterProps } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'

export function Footer({ org }: FooterProps) {
  const settings = org.settings as Record<string, unknown>
  const socialMedia = getSetting<Record<string, string> | undefined>(settings, 'socialMedia', undefined)
  const contact = getSetting<Record<string, string> | undefined>(settings, 'contact', undefined)

  const email = contact?.email || org.email
  const phone = contact?.phone || org.phone
  const address = contact?.address || org.address

  return (
    <footer className="relative bg-[#2D2D2D] text-white overflow-hidden">
      {/* Wavy top divider */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0 60V30C240 0 480 50 720 30C960 10 1200 50 1440 30V60H0Z"
            fill="#F5F0EB"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-3">{org.name}</h3>
            {org.description && (
              <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                {org.description}
              </p>
            )}
            {/* Decorative leaf */}
            <svg className="mt-6 w-8 h-8 text-[#5B7A5E] opacity-60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
            </svg>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-sm font-semibold text-[#E8D5B7] uppercase tracking-wider mb-4">
              Centro
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/clases" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Clases
                </Link>
              </li>
              <li>
                <Link href="/horarios" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Horarios
                </Link>
              </li>
              <li>
                <Link href="/membresias" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/retiros" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Retiros
                </Link>
              </li>
              <li>
                <Link href="/comunidad" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Comunidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-[#E8D5B7] uppercase tracking-wider mb-4">
              Informacion
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/sobre-nosotros" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/profesores" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Profesores
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-[#E8D5B7] transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#E8D5B7] uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {address && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-[#C47D4E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{address}{org.city ? `, ${org.city}` : ''}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C47D4E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} className="hover:text-[#E8D5B7] transition-colors">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C47D4E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${phone}`} className="hover:text-[#E8D5B7] transition-colors">
                    {phone}
                  </a>
                </li>
              )}
            </ul>

            {/* Social */}
            {socialMedia && (
              <div className="mt-6 flex items-center gap-3">
                {socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#5B7A5E] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
                {socialMedia.facebook && (
                  <a
                    href={`https://facebook.com/${socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#5B7A5E] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {socialMedia.youtube && (
                  <a
                    href={`https://youtube.com/${socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#5B7A5E] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {socialMedia.whatsapp && (
                  <a
                    href={`https://wa.me/${socialMedia.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#5B7A5E] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} {org.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/privacidad" className="hover:text-white/80 transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-white/80 transition-colors">
              Terminos
            </Link>
            <Link href="/cookies" className="hover:text-white/80 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
