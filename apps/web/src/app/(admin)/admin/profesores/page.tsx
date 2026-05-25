import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminProfesoresPage() {
  const { organizationId } = await requireAdmin()

  const instructors = await prisma.organizationMember.findMany({
    where: { organizationId, role: 'INSTRUCTOR', status: 'ACTIVE' },
    include: {
      user: true,
      instructedSchedules: {
        where: { isActive: true },
        include: { classType: true },
      },
    },
    orderBy: { user: { name: 'asc' } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Profesores</h1>
        <span className="text-sm text-stone-500">{instructors.length} profesores</span>
      </div>

      {instructors.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay profesores registrados.</p>
          <p className="text-sm text-stone-400 mt-1">
            Los profesores se añaden asignando el rol de instructor a un miembro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-medium text-sm">
                  {instructor.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{instructor.user.name}</h3>
                  <p className="text-xs text-stone-500">{instructor.user.email}</p>
                </div>
              </div>
              {instructor.instructedSchedules.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {[...new Set(instructor.instructedSchedules.map((s) => s.classType.name))].map(
                    (name) => (
                      <span
                        key={name}
                        className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700"
                      >
                        {name}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
