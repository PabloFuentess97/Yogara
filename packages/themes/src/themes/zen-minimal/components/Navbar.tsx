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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {brandLogoUrl && (
            <img src={brandLogoUrl} alt={brandName} className="h-8 w-8 object-contain" />
          )}
          <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">
            {brandName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/perfil"
              className="px-4 py-2 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Mi perfil
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Acceder
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-stone-100"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-stone-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-stone-100 flex gap-3">
            <Link href="/login" className="flex-1 text-center py-2 rounded-lg border border-stone-300 text-sm font-medium">
              Acceder
            </Link>
            <Link href="/registro" className="flex-1 text-center py-2 rounded-lg bg-stone-900 text-white text-sm font-medium">
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
