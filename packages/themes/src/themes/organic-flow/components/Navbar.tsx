'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { NavbarProps } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'

export function Navbar({ org, isLoggedIn }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const settings = org.settings as Record<string, unknown>
  const brandLogoUrl = getSetting<string>(settings, 'brand.logoUrl', '') || org.logoUrl
  const brandName = getSetting<string>(settings, 'brand.name', '') || org.name

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/clases', label: 'Clases' },
    { href: '/horarios', label: 'Horarios' },
    { href: '/retiros', label: 'Retiros' },
    { href: '/membresias', label: 'Precios' },
    { href: '/comunidad', label: 'Comunidad' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-[#E8D5B7]/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          {brandLogoUrl && (
            <img src={brandLogoUrl} alt={brandName} className="h-9 w-9 object-contain rounded-full" />
          )}
          <span className="font-serif text-xl font-bold text-[#2D2D2D] tracking-tight">
            {brandName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-[#2D2D2D]/70 hover:text-[#5B7A5E]'
                  : 'text-[#2D2D2D]/80 hover:text-[#5B7A5E]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/perfil"
              className="px-5 py-2.5 rounded-2xl text-sm font-medium text-[#5B7A5E] hover:bg-[#5B7A5E]/10 transition-colors"
            >
              Mi perfil
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-2xl text-sm font-medium text-[#2D2D2D] hover:bg-[#E8D5B7]/30 transition-colors"
              >
                Acceder
              </Link>
              <Link
                href="/registro"
                className="px-5 py-2.5 rounded-2xl bg-[#5B7A5E] text-white text-sm font-medium hover:bg-[#4A6A4D] transition-colors shadow-sm"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-2xl hover:bg-[#E8D5B7]/30 transition-colors"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6 text-[#2D2D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-[#E8D5B7]/30 px-6 py-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 px-4 rounded-2xl text-[#2D2D2D] font-medium hover:bg-[#E8D5B7]/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#E8D5B7]/30 flex gap-3">
            <Link
              href="/login"
              className="flex-1 text-center py-3 rounded-2xl border border-[#5B7A5E]/30 text-sm font-medium text-[#5B7A5E]"
            >
              Acceder
            </Link>
            <Link
              href="/registro"
              className="flex-1 text-center py-3 rounded-2xl bg-[#5B7A5E] text-white text-sm font-medium"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
