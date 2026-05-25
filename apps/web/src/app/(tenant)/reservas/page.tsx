import type { Metadata } from 'next'
import { prisma } from '@yogara/database'
import { requireStudent } from '@/lib/student-auth'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'Mis Reservas',
  description: 'Gestiona tus reservas de clase',
}
import { es } from 'date-fns/locale'
import { CancelBookingButton } from './cancel-booking-button'

export default async function MisReservasPage() {
  const { memberId, organizationId } = await requireStudent()

  const now = new Date()

  const [upcoming, past] = await Promise.all([
    prisma.booking.findMany({
      where: {
        memberId,
        organizationId,
        status: { in: ['CONFIRMED', 'WAITLISTED'] },
        classSession: { date: { gte: now } },
      },
      include: {
        classSession: {
          include: {
            classType: true,
            instructor: { include: { user: true } },
            room: true,
          },
        },
      },
      orderBy: { classSession: { date: 'asc' } },
    }),
    prisma.booking.findMany({
      where: {
        memberId,
        organizationId,
        OR: [
          { status: { in: ['CHECKED_IN', 'NO_SHOW'] } },
          { classSession: { date: { lt: now } }, status: 'CONFIRMED' },
        ],
      },
      include: {
        classSession: {
          include: { classType: true },
        },
      },
      orderBy: { classSession: { date: 'desc' } },
      take: 10,
    }),
  ])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-8">
        Mis Reservas
      </h1>

      {/* Upcoming */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Próximas clases</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
            <p className="text-stone-500">No tienes reservas próximas.</p>
            <a
              href="/horarios"
              className="inline-block mt-3 text-sm font-medium text-stone-900 hover:underline"
            >
              Ver horarios y reservar
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => {
              const session = booking.classSession
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl border border-stone-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: session.classType.color ?? '#8B7355' }}
                        />
                        <h3 className="font-medium text-stone-900">{session.classType.name}</h3>
                        {booking.status === 'WAITLISTED' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                            Lista de espera
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-600">
                        {format(session.date, "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-sm text-stone-500">
                        {session.startTime} - {session.endTime}
                        {' · '}
                        {session.instructor.user.name}
                        {session.room && ` · ${session.room.name}`}
                      </p>
                    </div>
                    <CancelBookingButton bookingId={booking.id} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Historial</h2>
          <div className="space-y-2">
            {past.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    {booking.classSession.classType.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {format(booking.classSession.date, "d MMM yyyy", { locale: es })}
                  </p>
                </div>
                <span className="text-xs text-stone-400">
                  {booking.status === 'CHECKED_IN' ? 'Asistió' : booking.status === 'NO_SHOW' ? 'No asistió' : 'Completada'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
