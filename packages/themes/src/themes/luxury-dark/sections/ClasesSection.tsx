import type { ClasesSectionProps } from '../../../engine/types'
import { ClassCard } from '../components/ClassCard'

export function ClasesSection({ org, clases }: ClasesSectionProps) {
  if (clases.length === 0) return null

  return (
    <section className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
          <h2
            className="text-3xl md:text-5xl font-light text-[#F5F5F5] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Nuestras Clases
          </h2>
          <p className="mt-4 text-[#9CA3AF] max-w-lg mx-auto font-light">
            Descubre las disciplinas que ofrecemos para tu bienestar
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
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
