import type { Metadata } from 'next'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'

export const metadata: Metadata = {
  title: 'Planes y Precios',
  description: 'Elige el plan que mejor se adapte a tu práctica',
}

export default async function MembresiasPage() {
  const org = await resolveTenant()

  const memberships = await prisma.membership.findMany({
    where: { organizationId: org.id, isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-2">
          Planes y Precios
        </h1>
        <p className="text-stone-600">Elige el plan que mejor se adapte a tu práctica</p>
      </div>

      {memberships.length === 0 ? (
        <p className="text-stone-500 text-center py-12">Planes próximamente disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memberships.map((plan, index) => {
            const isPopular = index === 0 && memberships.length > 1
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border p-6 ${
                  isPopular ? 'border-stone-900 shadow-lg' : 'border-stone-200'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-medium">
                    Más popular
                  </span>
                )}
                <h3 className="font-semibold text-stone-900 text-lg mb-1">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-stone-500 mb-4">{plan.description}</p>
                )}
                <div className="mb-6">
                  {Number(plan.price) === 0 ? (
                    <span className="text-3xl font-bold text-stone-900">Gratis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-stone-900">
                        {Number(plan.price)}€
                      </span>
                      {plan.type === 'UNLIMITED' && (
                        <span className="text-stone-500">/mes</span>
                      )}
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.classLimit && (
                    <li className="flex items-center gap-2 text-sm text-stone-600">
                      <span className="text-green-600">✓</span>
                      {plan.classLimit} clases
                    </li>
                  )}
                  {plan.type === 'UNLIMITED' && (
                    <li className="flex items-center gap-2 text-sm text-stone-600">
                      <span className="text-green-600">✓</span>
                      Clases ilimitadas
                    </li>
                  )}
                  {plan.durationDays && (
                    <li className="flex items-center gap-2 text-sm text-stone-600">
                      <span className="text-green-600">✓</span>
                      Válido {plan.durationDays} días
                    </li>
                  )}
                  {!plan.durationDays && plan.type === 'CLASS_PACK' && (
                    <li className="flex items-center gap-2 text-sm text-stone-600">
                      <span className="text-green-600">✓</span>
                      Sin caducidad
                    </li>
                  )}
                </ul>
                <a
                  href="/registro"
                  className={`block w-full py-2.5 rounded-lg font-medium text-sm text-center transition-colors ${
                    isPopular
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Elegir plan
                </a>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-stone-500">
          Tu primera clase es gratis.{' '}
          <a href="/registro" className="font-medium text-stone-900 hover:underline">
            Regístrate y prueba sin compromiso
          </a>
        </p>
      </div>
    </div>
  )
}
