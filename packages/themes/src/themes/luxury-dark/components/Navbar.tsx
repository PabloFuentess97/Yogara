'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { NavbarProps } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'

export function Navbar({ org, isLoggedIn }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const settings = org.settings as Record<string, unknown>
  const brandLogoUrl = getSetting<string>(settings, 'brand.logoUrl', '') || org.logoUrl
  const brandName = getSetting<string>(settings, 'brand.name', '') || org.name

  const links = [
    { href: '/clases', label: 'Clases' },
    { href: '/horarios', label: 'Horarios' },
    { href: '/retiros', label: 'Retiros' },
    { href: '/membresias', label: 'Precios' },
    { href: '/comunidad', label: 'Comunidad' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {brandLogoUrl && (
            <img src={brandLogoUrl} alt={brandName} className="h-9 w-9 object-contain" />
          )}
          <span
            className="text-2xl font-light tracking-wider text-[#D4AF37]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {brandName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-300 font-light tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/perfil"
              className="px-5 py-2.5 text-sm font-light text-[#D4AF37] hover:text-[#F5E6C8] transition-colors tracking-wide"
            >
              Mi perfil
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-light text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors tracking-wide"
              >
                Acceder
              </Link>
              <Link
                href="/registro"
                className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-sm font-light tracking-wide hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all duration-300"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#D4AF37]"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/10 px-6 py-6 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-[#9CA3AF] hover:text-[#D4AF37] font-light tracking-wide uppercase text-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#D4AF37]/10 flex gap-3">
            <Link
              href="/login"
              className="flex-1 text-center py-3 text-sm font-light text-[#9CA3AF] border border-[#333333] tracking-wide"
            >
              Acceder
            </Link>
            <Link
              href="/registro"
              className="flex-1 text-center py-3 text-sm font-light bg-[#D4AF37] text-[#0A0A0A] tracking-wide"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
