import type { ProfesoresSectionProps } from '../../../engine/types'
import { InstructorCard } from '../components/InstructorCard'

export function ProfesoresSection({ org, profesores }: ProfesoresSectionProps) {
  if (profesores.length === 0) return null

  return (
    <section className="py-20 px-6 bg-stone-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            Nuestro Equipo
          </h2>
          <p className="mt-3 text-stone-600 max-w-lg mx-auto">
            Profesionales dedicados a guiarte en tu práctica
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {profesores.map((profesor) => (
            <InstructorCard key={profesor.id} {...profesor} />
          ))}
        </div>
      </div>
    </section>
  )
}
