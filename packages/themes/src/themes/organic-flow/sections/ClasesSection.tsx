import type { ClasesSectionProps } from '../../../engine/types'
import { ClassCard } from '../components/ClassCard'

export function ClasesSection({ org, clases }: ClasesSectionProps) {
  if (clases.length === 0) return null

  return (
    <section className="relative py-24 px-6 bg-white">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0 60V20C240 50 480 0 720 30C960 60 1200 10 1440 40V60H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
            <svg className="w-5 h-5 text-[#5B7A5E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
            </svg>
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D]">
            Nuestras Clases
          </h2>
          <p className="mt-4 text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
            Descubre las disciplinas que ofrecemos para nutrir tu cuerpo, mente y espiritu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clases.map((clase) => (
            <ClassCard key={clase.id} {...clase} />
          ))}
        </div>
      </div>
    </section>
  )
}
