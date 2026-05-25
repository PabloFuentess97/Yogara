import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

export default async function AdminDashboardPage() {
  const { organizationId } = await requireAdmin()

  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const [
    totalStudents,
    activeMembresias,
    sessionsThisWeek,
    bookingsToday,
    upcomingSessions,
  ] = await Promise.all([
    prisma.organizationMember.count({
      where: { organizationId, role: 'STUDENT', status: 'ACTIVE' },
    }),
    prisma.userMembership.count({
      where: {
        organizationId,
        status: 'ACTIVE',
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
    prisma.classSession.count({
      where: {
        organizationId,
        date: { gte: weekStart, lte: weekEnd },
        status: 'SCHEDULED',
      },
    }),
    prisma.booking.count({
      where: {
        organizationId,
        status: 'CONFIRMED',
        classSession: { date: { gte: todayStart, lte: todayEnd } },
      },
    }),
    prisma.classSession.findMany({
      where: {
        organizationId,
        date: { gte: todayStart },
        status: 'SCHEDULED',
      },
      include: {
        classType: true,
        instructor: { include: { user: true } },
        room: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      take: 5,
    }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Alumnos" value={totalStudents} />
        <KpiCard label="Clases esta semana" value={sessionsThisWeek} />
        <KpiCard label="Reservas hoy" value={bookingsToday} />
        <KpiCard label="Membresías activas" value={activeMembresias} />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Próximas clases</h2>
        {upcomingSessions.length === 0 ? (
          <p className="text-sm text-stone-500">No hay clases programadas próximamente.</p>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-stone-900">{session.classType.name}</p>
                  <p className="text-sm text-stone-500">
                    {session.instructor.user.name} · {session.room?.name ?? 'Sin sala'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-stone-900">
                    {session.startTime} - {session.endTime}
                  </p>
                  <p className="text-sm text-stone-500">
                    {session.bookedCount}/{session.capacity} reservas
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="text-2xl font-bold text-stone-900 mt-1">{value}</p>
    </div>
  )
}
