import type { ClasesSectionProps } from '../../../engine/types'
import { ClassCard } from '../components/ClassCard'

export function ClasesSection({ org, clases }: ClasesSectionProps) {
  if (clases.length === 0) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            Nuestras Clases
          </h2>
          <p className="mt-3 text-stone-600 max-w-lg mx-auto">
            Descubre las disciplinas que ofrecemos para tu bienestar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clases.map((clase) => (
            <ClassCard key={clase.id} {...clase} />
          ))}
        </div>
      </div>
    </section>
  )
}
