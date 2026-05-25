import type { ProfesoresSectionProps } from '../../../engine/types'
import { InstructorCard } from '../components/InstructorCard'

export function ProfesoresSection({ org, profesores }: ProfesoresSectionProps) {
  if (profesores.length === 0) return null

  return (
    <section className="py-24 px-6 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
          <h2
            className="text-3xl md:text-5xl font-light text-[#F5F5F5] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Nuestro Equipo
          </h2>
          <p className="mt-4 text-[#9CA3AF] max-w-lg mx-auto font-light">
            Profesionales dedicados a guiarte en tu practica
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {profesores.map((profesor) => (
            <InstructorCard key={profesor.id} {...profesor} />
          ))}
        </div>
      </div>
    </section>
  )
}
