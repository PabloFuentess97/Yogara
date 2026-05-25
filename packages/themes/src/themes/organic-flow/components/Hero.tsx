import Link from 'next/link'
import type { HeroProps } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'

export function Hero({ org, title, subtitle, backgroundImage }: HeroProps) {
  const settings = org.settings as Record<string, unknown>
  const ctaText = getSetting<string>(settings, 'hero.ctaText', 'Ver horarios')
  const ctaLink = getSetting<string>(settings, 'hero.ctaLink', '/horarios')
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#F5F0EB]">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#E8D5B7]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-72 h-72 bg-[#5B7A5E]/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#C47D4E]/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 lg:pt-0">
        {/* Left side - Text */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B7A5E]/10 border border-[#5B7A5E]/20">
            <svg className="w-4 h-4 text-[#5B7A5E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
            </svg>
            <span className="text-sm font-medium text-[#5B7A5E]">{org.name}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg text-[#7A7A7A] leading-relaxed max-w-lg">
              {subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
            <Link
              href={ctaLink}
              className="px-8 py-4 rounded-2xl bg-[#5B7A5E] text-white font-medium hover:bg-[#4A6A4D] transition-all hover:shadow-lg hover:shadow-[#5B7A5E]/20 hover:-translate-y-0.5"
            >
              {ctaText}
            </Link>
            <Link
              href="/clases"
              className="px-8 py-4 rounded-2xl border-2 border-[#C47D4E]/30 text-[#C47D4E] font-medium hover:bg-[#C47D4E]/10 transition-all"
            >
              Explorar clases
            </Link>
          </div>
        </div>

        {/* Right side - Image/Shapes */}
        <div className="relative hidden lg:block">
          {backgroundImage ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-[3rem] bg-[#5B7A5E]/10 transform rotate-3" />
              <img
                src={backgroundImage}
                alt={org.name}
                className="relative w-full h-[500px] object-cover rounded-[3rem] shadow-2xl"
              />
              {/* Floating decorative card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7A7A]">Clases diarias</p>
                    <p className="text-sm font-semibold text-[#2D2D2D]">+20 sesiones</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-[500px]">
              {/* Organic blob shapes composition */}
              <div className="absolute top-8 right-8 w-64 h-64 bg-[#5B7A5E]/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-pulse" />
              <div className="absolute bottom-12 left-12 w-48 h-48 bg-[#C47D4E]/20 rounded-[60%_40%_30%_70%/50%_60%_40%_50%]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#E8D5B7]/40 rounded-[50%_50%_40%_60%/60%_40%_50%_50%]" />
              {/* Center leaf icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-12 h-12 text-[#5B7A5E]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0 80V50C360 10 720 70 1080 40C1260 25 1380 35 1440 50V80H0Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </section>
  )
}
