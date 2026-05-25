import Link from 'next/link'
import type { HeroProps } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'

export function Hero({ org, title, subtitle, backgroundImage }: HeroProps) {
  const settings = org.settings as Record<string, unknown>
  const ctaText = getSetting<string>(settings, 'hero.ctaText', 'Reservar clase')
  const ctaLink = getSetting<string>(settings, 'hero.ctaLink', '/horarios')
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video/Image background placeholder */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0A0A0A]">
          {/* Subtle animated gradient for video-style feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]" />
          {/* Decorative gold particles/glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#B8860B]/5 rounded-full blur-3xl" />
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0A0A0A]/70" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        {/* Decorative gold line */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-light text-[#F5F5F5] leading-tight tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-[#9CA3AF] leading-relaxed max-w-2xl mx-auto font-light">
            {subtitle}
          </p>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href={ctaLink}
            className="px-10 py-4 bg-[#D4AF37] text-[#0A0A0A] font-medium text-sm tracking-wider uppercase hover:bg-[#F5E6C8] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            {ctaText}
          </Link>
          <Link
            href="/clases"
            className="px-10 py-4 border border-[#D4AF37]/40 text-[#D4AF37] font-light text-sm tracking-wider uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300"
          >
            Explorar
          </Link>
        </div>

        {/* Bottom decorative line */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-16" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#D4AF37]/50">
        <span className="text-[10px] uppercase tracking-[0.3em] font-light">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
      </div>
    </section>
  )
}
