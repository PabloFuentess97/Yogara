import type { ProfesoresSectionProps } from '../../../engine/types'
import { InstructorCard } from '../components/InstructorCard'

export function ProfesoresSection({ org, profesores }: ProfesoresSectionProps) {
  if (profesores.length === 0) return null

  return (
    <section className="relative py-24 px-6 bg-[#F5F0EB]">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0 60V30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0Z"
            fill="#F5F0EB"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
            <svg className="w-5 h-5 text-[#C47D4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D]">
            Nuestro Equipo
          </h2>
          <p className="mt-4 text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
            Profesionales apasionados dedicados a guiarte en tu camino
          </p>
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
