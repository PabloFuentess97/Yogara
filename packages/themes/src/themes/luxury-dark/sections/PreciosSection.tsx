import type { PreciosSectionProps } from '../../../engine/types'
import { MembershipCard } from '../components/MembershipCard'

export function PreciosSection({ org, planes }: PreciosSectionProps) {
  if (planes.length === 0) return null

  return (
    <section className="py-24 px-6 bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
          <h2
            className="text-3xl md:text-5xl font-light text-[#F5F5F5] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Planes y Precios
          </h2>
          <p className="mt-4 text-[#9CA3AF] max-w-lg mx-auto font-light">
            Elige el plan que mejor se adapte a tu practica
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {planes.map((plan) => (
            <MembershipCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
