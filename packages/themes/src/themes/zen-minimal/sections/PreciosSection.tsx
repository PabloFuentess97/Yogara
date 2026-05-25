import type { PreciosSectionProps } from '../../../engine/types'
import { MembershipCard } from '../components/MembershipCard'

export function PreciosSection({ org, planes }: PreciosSectionProps) {
  if (planes.length === 0) return null

  return (
    <section className="py-20 px-6 bg-stone-50/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            Planes y Precios
          </h2>
          <p className="mt-3 text-stone-600 max-w-lg mx-auto">
            Elige el plan que mejor se adapte a tu práctica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {planes.map((plan, i) => (
            <MembershipCard key={plan.id} {...plan} isPopular={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
