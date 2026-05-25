import type { TestimoniosSectionProps } from '../../../engine/types'

const testimoniosDefault = [
  {
    name: 'Ana R.',
    text: 'Las clases de Hatha han transformado mi rutina matutina. El ambiente es increiblemente tranquilo y acogedor.',
    role: 'Alumna desde 2022',
  },
  {
    name: 'Jorge F.',
    text: 'Empece sin saber nada de yoga y ahora no puedo pasar un dia sin mi practica. Los profesores son excepcionales.',
    role: 'Alumno desde 2023',
  },
  {
    name: 'Sofia L.',
    text: 'La comunidad que se ha creado aqui es maravillosa. Mucho mas que un centro de yoga, es mi segundo hogar.',
    role: 'Alumna desde 2021',
  },
]

export function TestimoniosSection({ org }: TestimoniosSectionProps) {
  const settings = org.settings as Record<string, unknown>
  const testimonios = (settings?.testimonios as typeof testimoniosDefault) ?? testimoniosDefault

  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#E8D5B7]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#5B7A5E]/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
            <svg className="w-5 h-5 text-[#C47D4E]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D]">
            Lo que dicen nuestros alumnos
          </h2>
          <p className="mt-4 text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
            Historias reales de quienes han encontrado su equilibrio con nosotros
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((testimonio, i) => (
            <div
              key={i}
              className="relative bg-[#F5F0EB] rounded-3xl p-7 border border-[#E8D5B7]/30"
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-6 text-5xl font-serif text-[#5B7A5E]/15 leading-none">
                &ldquo;
              </div>

              <p className="text-[#2D2D2D] text-sm leading-relaxed mb-6 relative z-10">
                {testimonio.text}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center">
                  <span className="font-serif text-sm font-semibold text-[#5B7A5E]">
                    {testimonio.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2D2D2D]">{testimonio.name}</p>
                  {'role' in testimonio && (
                    <p className="text-xs text-[#7A7A7A]">{(testimonio as { role: string }).role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
