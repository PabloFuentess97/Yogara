import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'

interface Props {
  searchParams: Promise<{ search?: string }>
}

export default async function AdminAlumnosPage({ searchParams }: Props) {
  const { organizationId } = await requireAdmin()
  const { search } = await searchParams

  const students = await prisma.organizationMember.findMany({
    where: {
      organizationId,
      role: 'STUDENT',
      status: 'ACTIVE',
      ...(search && {
        user: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    },
    include: {
      user: true,
      userMemberships: {
        where: { status: 'ACTIVE' },
        include: { membership: true },
        take: 1,
      },
    },
    orderBy: { user: { name: 'asc' } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Alumnos</h1>
        <span className="text-sm text-stone-500">{students.length} alumnos</span>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200">
          <form>
            <input
              type="search"
              name="search"
              defaultValue={search ?? ''}
              placeholder="Buscar por nombre o email..."
              className="w-full md:w-80 px-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </form>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            {search ? 'No se encontraron alumnos con esa búsqueda.' : 'No hay alumnos registrados aún.'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase">Membresía</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {students.map((member) => {
                const activeMembership = member.userMemberships[0]
                return (
                  <tr key={member.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      {member.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {member.user.email}
                    </td>
                    <td className="px-6 py-4">
                      {activeMembership ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          {activeMembership.membership.name}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-500">
                          Sin membresía
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {member.joinedAt.toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
