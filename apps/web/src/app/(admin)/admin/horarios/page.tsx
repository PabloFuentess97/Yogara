import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { CrearHorarioForm } from './crear-horario-form'
import { GenerarSesionesButton } from './generar-sesiones-button'

export const dynamic = 'force-dynamic'

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default async function AdminHorariosPage() {
  const { organizationId } = await requireAdmin()

  const [schedules, classTypes, instructors, rooms] = await Promise.all([
    prisma.schedule.findMany({
      where: { organizationId, isActive: true },
      include: {
        classType: true,
        instructor: { include: { user: true } },
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    }),
    prisma.classType.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    }),
    prisma.organizationMember.findMany({
      where: { organizationId, role: 'INSTRUCTOR', status: 'ACTIVE' },
      include: { user: true },
    }),
    prisma.room.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const byDay = Array.from({ length: 7 }, (_, i) =>
    schedules.filter((s) => s.dayOfWeek === i)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Horarios</h1>
        <div className="flex items-center gap-3">
          {schedules.length > 0 && <GenerarSesionesButton />}
          <CrearHorarioForm
          classTypes={classTypes.map((ct) => ({ id: ct.id, label: ct.name }))}
          instructors={instructors.map((i) => ({ id: i.id, label: i.user.name }))}
          rooms={rooms.map((r) => ({ id: r.id, label: `${r.name} (${r.capacity})` }))}
        />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        {schedules.length === 0 ? (
          <p className="text-center text-sm text-stone-500 py-8">
            No hay horarios configurados. Crea tipos de clase, profesores y salas primero.
          </p>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {DAY_LABELS.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-stone-500 uppercase">
                {day}
              </div>
            ))}

            {byDay.map((daySchedules, dayIndex) => (
              <div key={dayIndex} className="space-y-2 min-h-[100px]">
                {daySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-2 rounded-lg border text-xs"
                    style={{
                      backgroundColor: `${schedule.classType.color ?? '#8B7355'}10`,
                      borderColor: `${schedule.classType.color ?? '#8B7355'}40`,
                    }}
                  >
                    <p className="font-medium text-stone-900">{schedule.classType.name}</p>
                    <p className="text-stone-600">{schedule.startTime}</p>
                    <p className="text-stone-500 truncate">
                      {schedule.instructor.user.name}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
