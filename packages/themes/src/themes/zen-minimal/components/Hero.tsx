import Link from 'next/link'
import type { HeroProps } from '../../../engine/types'

export function Hero({ org, title, subtitle, backgroundImage }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-white/70" />
        </div>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-stone-50" />
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-stone-600 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/horarios"
            className="px-8 py-3.5 rounded-full bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-all hover:shadow-lg"
          >
            Ver horarios
          </Link>
          <Link
            href="/clases"
            className="px-8 py-3.5 rounded-full border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors"
          >
            Nuestras clases
          </Link>
        </div>
      </div>
    </section>
  )
}
