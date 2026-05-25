import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const org = await resolveTenant()
  return {
    title: `Retiros | ${org.name}`,
    description: `Descubre los retiros de yoga y bienestar de ${org.name}`,
  }
}

export default async function RetirosPage() {
  const org = await resolveTenant()

  const retreats = await prisma.retreat.findMany({
    where: {
      organizationId: org.id,
      status: { in: ['PUBLISHED', 'FULL'] },
      deletedAt: null,
    },
    orderBy: { startDate: 'asc' },
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-stone-900 mb-3">
          Retiros
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto">
          Experiencias inmersivas para profundizar en tu practica y reconectar contigo
        </p>
      </div>

      {retreats.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay retiros disponibles en este momento.</p>
          <p className="text-sm text-stone-400 mt-1">
            Vuelve pronto para descubrir nuevas experiencias.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retreats.map((retreat) => {
            const spotsLeft = retreat.capacity - retreat.bookedCount
            const isFull = retreat.status === 'FULL' || spotsLeft <= 0
            return (
              <Link
                key={retreat.id}
                href={`/retiros/${retreat.id}`}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                  {retreat.imageUrls.length > 0 ? (
                    <img
                      src={retreat.imageUrls[0]}
                      alt={retreat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-stone-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                      </svg>
                    </div>
                  )}
                  {isFull && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Completo
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-stone-900 text-lg mb-1 group-hover:text-stone-700 transition-colors">
                    {retreat.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-sm text-stone-500 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <span>{retreat.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-stone-500 mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <span>
                      {retreat.startDate.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      -{' '}
                      {retreat.endDate.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-lg font-bold text-stone-900">
                      {Number(retreat.price)}{retreat.currency === 'EUR' ? '€' : retreat.currency}
                    </span>
                    <span className="text-sm text-stone-500">
                      {isFull
                        ? 'Sin plazas'
                        : `${spotsLeft} plaza${spotsLeft !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
