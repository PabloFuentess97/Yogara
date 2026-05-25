import type { PreciosSectionProps } from '../../../engine/types'
import { MembershipCard } from '../components/MembershipCard'

export function PreciosSection({ org, planes }: PreciosSectionProps) {
  if (planes.length === 0) return null

  return (
    <section className="relative py-24 px-6 bg-[#F5F0EB]">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0 60V40C240 10 480 50 720 20C960 -10 1200 40 1440 20V60H0Z"
            fill="#F5F0EB"
          />
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#5B7A5E]/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#C47D4E]/5 rounded-full blur-2xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
            <svg className="w-5 h-5 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D]">
            Planes y Precios
          </h2>
          <p className="mt-4 text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
            Elige el plan que mejor se adapte a tu practica y estilo de vida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {planes.map((plan, i) => (
            <MembershipCard key={plan.id} {...plan} isPopular={plan.isPopular ?? i === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
