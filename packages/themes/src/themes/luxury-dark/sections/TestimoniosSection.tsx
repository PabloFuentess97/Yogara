import type { TestimoniosSectionProps } from '../../../engine/types'

const testimoniosDefault = [
  {
    name: 'Ana R.',
    text: 'Las clases de Hatha han transformado mi rutina matutina. El ambiente es increiblemente tranquilo.',
  },
  {
    name: 'Jorge F.',
    text: 'Empece sin saber nada de yoga y ahora no puedo pasar un dia sin mi practica. Los profesores son excepcionales.',
  },
  {
    name: 'Sofia L.',
    text: 'La comunidad que se ha creado aqui es maravillosa. Mucho mas que un centro de yoga.',
  },
]

export function TestimoniosSection({ org }: TestimoniosSectionProps) {
  const settings = org.settings as Record<string, unknown>
  const testimonios = (settings?.testimonios as typeof testimoniosDefault) ?? testimoniosDefault

  return (
    <section className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
          <h2
            className="text-3xl md:text-5xl font-light text-[#F5F5F5] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Lo que dicen nuestros alumnos
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((testimonio, i) => (
            <div
              key={i}
              className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 hover:border-[#D4AF37]/30 transition-all duration-500 relative"
            >
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 left-6 text-5xl text-[#D4AF37]/10 leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                &ldquo;
              </span>

              <p className="text-[#9CA3AF] text-sm leading-relaxed font-light italic mt-6 mb-6">
                &ldquo;{testimonio.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#D4AF37]/40" />
                <p className="text-sm font-light text-[#D4AF37] tracking-wide">{testimonio.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
