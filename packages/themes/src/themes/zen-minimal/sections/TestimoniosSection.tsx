import type { TestimoniosSectionProps } from '../../../engine/types'

const testimoniosDefault = [
  {
    name: 'Ana R.',
    text: 'Las clases de Hatha han transformado mi rutina matutina. El ambiente es increíblemente tranquilo.',
  },
  {
    name: 'Jorge F.',
    text: 'Empecé sin saber nada de yoga y ahora no puedo pasar un día sin mi práctica. Los profesores son excepcionales.',
  },
  {
    name: 'Sofía L.',
    text: 'La comunidad que se ha creado aquí es maravillosa. Mucho más que un centro de yoga.',
  },
]

export function TestimoniosSection({ org }: TestimoniosSectionProps) {
  const settings = org.settings as Record<string, unknown>
  const testimonios = (settings?.testimonios as typeof testimoniosDefault) ?? testimoniosDefault

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            Lo que dicen nuestros alumnos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonios.map((testimonio, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
              <p className="text-stone-600 text-sm leading-relaxed italic mb-4">
                &ldquo;{testimonio.text}&rdquo;
              </p>
              <p className="text-sm font-medium text-stone-900">{testimonio.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
