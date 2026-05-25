import type { Metadata } from 'next'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'
import { optionalStudent } from '@/lib/student-auth'
import { startOfWeek, addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { BookingButton } from '../reservas/booking-button'

export const metadata: Metadata = {
  title: 'Horarios',
  description: 'Consulta los horarios y reserva tu plaza',
}

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default async function HorariosPage() {
  const org = await resolveTenant()
  const student = await optionalStudent()

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 7)

  const sessions = await prisma.classSession.findMany({
    where: {
      organizationId: org.id,
      date: { gte: weekStart, lt: weekEnd },
      status: 'SCHEDULED',
    },
    include: {
      classType: true,
      instructor: { include: { user: true } },
      room: true,
      ...(student && {
        bookings: {
          where: { memberId: student.memberId, status: { not: 'CANCELLED' } },
          take: 1,
        },
      }),
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  // If no sessions exist yet, fall back to showing the schedule template
  if (sessions.length === 0) {
    return <ScheduleFallback orgId={org.id} />
  }

  const byDay = Array.from({ length: 7 }, (_, i) => {
    const dayDate = addDays(weekStart, i)
    return {
      date: dayDate,
      label: DAY_NAMES[i]!,
      dateLabel: format(dayDate, "d 'de' MMM", { locale: es }),
      sessions: sessions.filter((s) => {
        const sessionDay = s.date.getDay()
        const mappedDay = sessionDay === 0 ? 6 : sessionDay - 1
        return mappedDay === i
      }),
    }
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-2">
        Horario Semanal
      </h1>
      <p className="text-stone-600 mb-8">Reserva tu plaza en las próximas clases</p>

      {/* Mobile: list */}
      <div className="md:hidden space-y-6">
        {byDay.map((day) => {
          if (day.sessions.length === 0) return null
          return (
            <div key={day.label}>
              <h3 className="font-semibold text-stone-900 mb-1">{day.label}</h3>
              <p className="text-xs text-stone-500 mb-3">{day.dateLabel}</p>
              <div className="space-y-3">
                {day.sessions.map((session) => {
                  const spotsLeft = session.capacity - session.bookedCount
                  const booking = 'bookings' in session ? (session.bookings as Array<{ id: string; status: string }>)[0] : null
                  return (
                    <div
                      key={session.id}
                      className="p-4 bg-white rounded-xl border border-stone-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: session.classType.color ?? '#8B7355' }}
                            />
                            <p className="font-medium text-stone-900">{session.classType.name}</p>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            {session.instructor.user.name}
                            {session.room && ` · ${session.room.name}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-stone-900">
                            {session.startTime} - {session.endTime}
                          </p>
                          <p className="text-xs text-stone-500">
                            {spotsLeft > 0 ? `${spotsLeft} plazas` : 'Completa'}
                          </p>
                        </div>
                      </div>
                      <BookingButton
                        sessionId={session.id}
                        bookingId={booking?.id}
                        bookingStatus={booking?.status}
                        spotsLeft={spotsLeft}
                        isLoggedIn={!!student}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-7 gap-3">
        {byDay.map((day) => (
          <div key={day.label}>
            <div className="text-center mb-2">
              <div className="text-sm font-medium text-stone-500">{day.label}</div>
              <div className="text-xs text-stone-400">{day.dateLabel}</div>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {day.sessions.map((session) => {
                const spotsLeft = session.capacity - session.bookedCount
                const booking = 'bookings' in session ? (session.bookings as Array<{ id: string; status: string }>)[0] : null
                return (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl border border-stone-200 bg-white"
                  >
                    <div
                      className="w-full h-1 rounded-full mb-2"
                      style={{ backgroundColor: session.classType.color ?? '#8B7355' }}
                    />
                    <p className="font-medium text-stone-900 text-xs">
                      {session.classType.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {session.startTime} - {session.endTime}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {session.instructor.user.name}
                    </p>
                    <p className="text-xs text-stone-400">
                      {spotsLeft > 0 ? `${spotsLeft} plazas` : 'Completa'}
                    </p>
                    <div className="mt-2">
                      <BookingButton
                        sessionId={session.id}
                        bookingId={booking?.id}
                        bookingStatus={booking?.status}
                        spotsLeft={spotsLeft}
                        isLoggedIn={!!student}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function ScheduleFallback({ orgId }: { orgId: string }) {
  const schedules = await prisma.schedule.findMany({
    where: { organizationId: orgId, isActive: true },
    include: {
      classType: true,
      instructor: { include: { user: true } },
    },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })

  if (schedules.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-2">
          Horario Semanal
        </h1>
        <p className="text-stone-500 text-center py-12">Horarios próximamente disponibles.</p>
      </div>
    )
  }

  const byDay = Array.from({ length: 7 }, (_, i) =>
    schedules.filter((s) => s.dayOfWeek === i)
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-2">
        Horario Semanal
      </h1>
      <p className="text-stone-600 mb-8">Consulta los horarios de nuestras clases</p>

      <div className="hidden md:grid grid-cols-7 gap-3">
        {DAY_NAMES.map((day, index) => (
          <div key={day}>
            <div className="text-center text-sm font-medium text-stone-500 py-2 mb-2">
              {day}
            </div>
            <div className="space-y-2 min-h-[200px]">
              {byDay[index]!.map((s) => (
                <div
                  key={s.id}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white"
                >
                  <div
                    className="w-full h-1 rounded-full mb-2"
                    style={{ backgroundColor: s.classType.color ?? '#8B7355' }}
                  />
                  <p className="font-medium text-stone-900 text-xs">{s.classType.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {s.startTime} - {s.endTime}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{s.instructor.user.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
