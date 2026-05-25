import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'
import { optionalStudent } from '@/lib/student-auth'
import { RetreatBookingButton } from '../booking-button'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const org = await resolveTenant()

  const retreat = await prisma.retreat.findFirst({
    where: { id, organizationId: org.id, deletedAt: null },
  })

  if (!retreat) {
    return { title: `Retiro no encontrado | ${org.name}` }
  }

  return {
    title: `${retreat.name} | ${org.name}`,
    description: retreat.shortDescription ?? retreat.description?.slice(0, 160),
  }
}

export default async function RetiroDetailPage({ params }: PageProps) {
  const { id } = await params
  const org = await resolveTenant()
  const student = await optionalStudent()

  const retreat = await prisma.retreat.findFirst({
    where: {
      id,
      organizationId: org.id,
      status: { in: ['PUBLISHED', 'FULL'] },
      deletedAt: null,
    },
  })

  if (!retreat) {
    notFound()
  }

  // Check if user has an existing booking
  let existingBooking: { id: string; status: string } | null = null
  if (student) {
    existingBooking = await prisma.retreatBooking.findUnique({
      where: {
        retreatId_memberId: {
          retreatId: retreat.id,
          memberId: student.memberId,
        },
      },
      select: { id: true, status: true },
    })
    if (existingBooking?.status === 'CANCELLED') {
      existingBooking = null
    }
  }

  const spotsLeft = retreat.capacity - retreat.bookedCount
  const startDate = retreat.startDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const endDate = retreat.endDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Calculate duration in days
  const durationMs = retreat.endDate.getTime() - retreat.startDate.getTime()
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back link */}
      <a
        href="/retiros"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver a retiros
      </a>

      {/* Hero image / Gallery placeholder */}
      <div className="rounded-2xl overflow-hidden mb-8">
        {retreat.imageUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="aspect-[4/3] md:aspect-auto md:row-span-2">
              <img
                src={retreat.imageUrls[0]}
                alt={retreat.name}
                className="w-full h-full object-cover rounded-l-2xl"
              />
            </div>
            {retreat.imageUrls.slice(1, 3).map((url, i) => (
              <div key={i} className="aspect-[4/3] hidden md:block">
                <img
                  src={url}
                  alt={`${retreat.name} - imagen ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {retreat.imageUrls.length <= 1 && (
              <div className="aspect-[4/3] hidden md:flex items-center justify-center bg-stone-100 rounded-r-2xl">
                <span className="text-stone-400 text-sm">Mas fotos proximamente</span>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[21/9] bg-stone-100 flex items-center justify-center rounded-2xl">
            <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              {retreat.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
              <span className="inline-flex items-center gap-1.5">
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
                {retreat.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                {durationDays} dia{durationDays !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">Sobre este retiro</h2>
            <div className="prose prose-stone prose-sm max-w-none">
              <p className="text-stone-600 whitespace-pre-line">{retreat.description}</p>
            </div>
          </div>

          {/* Includes */}
          {retreat.includes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-stone-900 mb-3">Incluye</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {retreat.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                    <svg
                      className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dates */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">Fechas</h2>
            <div className="bg-stone-50 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Inicio</span>
                <span className="text-sm font-medium text-stone-900 capitalize">{startDate}</span>
              </div>
              <div className="border-t border-stone-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Fin</span>
                <span className="text-sm font-medium text-stone-900 capitalize">{endDate}</span>
              </div>
            </div>
          </div>

          {/* Itinerary placeholder */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">Itinerario</h2>
            <div className="bg-stone-50 rounded-xl p-5">
              <p className="text-sm text-stone-500 text-center py-4">
                El itinerario detallado se compartira con los participantes tras la confirmacion de la reserva.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl border border-stone-200 p-6 space-y-5">
            <div>
              <span className="text-3xl font-bold text-stone-900">
                {Number(retreat.price)}{retreat.currency === 'EUR' ? '€' : retreat.currency}
              </span>
              <span className="text-stone-500 text-sm ml-1">/ persona</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Plazas</span>
                <span className="font-medium text-stone-900">
                  {spotsLeft > 0
                    ? `${spotsLeft} de ${retreat.capacity} disponible${spotsLeft !== 1 ? 's' : ''}`
                    : 'Completo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Duracion</span>
                <span className="font-medium text-stone-900">
                  {durationDays} dia{durationDays !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Ubicacion</span>
                <span className="font-medium text-stone-900">{retreat.location}</span>
              </div>
            </div>

            {/* Capacity bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>{retreat.bookedCount} reservada{retreat.bookedCount !== 1 ? 's' : ''}</span>
                <span>{retreat.capacity} plazas</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-900 rounded-full transition-all"
                  style={{ width: `${Math.min((retreat.bookedCount / retreat.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>

            <RetreatBookingButton
              retreatId={retreat.id}
              bookingId={existingBooking?.id}
              bookingStatus={existingBooking?.status}
              spotsLeft={spotsLeft}
              isLoggedIn={!!student}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
