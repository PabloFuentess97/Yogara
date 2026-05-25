import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { CrearMembresiaForm } from './crear-membresia-form'

export default async function AdminMembresiasPage() {
  const { organizationId } = await requireAdmin()

  const memberships = await prisma.membership.findMany({
    where: { organizationId, isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const membershipCounts = await Promise.all(
    memberships.map(async (m) => {
      const count = await prisma.userMembership.count({
        where: {
          membershipId: m.id,
          status: 'ACTIVE',
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      })
      return { id: m.id, count }
    })
  )

  const countMap = Object.fromEntries(membershipCounts.map((c) => [c.id, c.count]))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Membresías</h1>
        <CrearMembresiaForm />
      </div>

      {memberships.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay planes de membresía creados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {memberships.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900 mb-1">{m.name}</h3>
              <p className="text-2xl font-bold text-stone-900 mb-2">
                {Number(m.price) === 0 ? 'Gratis' : (
                  <>
                    {Number(m.price)}€
                    {m.type === 'UNLIMITED' && (
                      <span className="text-sm font-normal text-stone-500">/mes</span>
                    )}
                  </>
                )}
              </p>
              <p className="text-sm text-stone-500">
                {typeLabel(m.type)}
                {m.classLimit && ` · ${m.classLimit} clases`}
                {m.durationDays && ` · ${m.durationDays} días`}
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-sm text-stone-600">{countMap[m.id] ?? 0} alumnos activos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    UNLIMITED: 'Ilimitado',
    CLASS_PACK: 'Bono',
    DROP_IN: 'Clase suelta',
    FREE_TRIAL: 'Prueba gratis',
  }
  return labels[type] ?? type
}
