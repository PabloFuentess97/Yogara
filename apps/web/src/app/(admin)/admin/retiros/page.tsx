import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'

export default async function AdminRetirosPage() {
  const { organizationId } = await requireAdmin()

  const retreats = await prisma.retreat.findMany({
    where: { organizationId, deletedAt: null },
    orderBy: { startDate: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Retiros</h1>
        <span className="text-sm text-stone-500">{retreats.length} retiros</span>
      </div>

      {retreats.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay retiros creados.</p>
          <p className="text-sm text-stone-400 mt-1">
            Los retiros son experiencias inmersivas de varios días.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {retreats.map((retreat) => (
            <div key={retreat.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-stone-900">{retreat.name}</h3>
                <StatusBadge status={retreat.status} />
              </div>
              {retreat.description && (
                <p className="text-sm text-stone-600 line-clamp-2 mb-3">{retreat.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-stone-500">
                <span>
                  {retreat.startDate.toLocaleDateString('es-ES')} -{' '}
                  {retreat.endDate.toLocaleDateString('es-ES')}
                </span>
                <span>{retreat.bookedCount}/{retreat.capacity} plazas</span>
              </div>
              {retreat.price && (
                <p className="text-sm font-medium text-stone-900 mt-2">
                  {Number(retreat.price)}€
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'bg-stone-100 text-stone-600',
    PUBLISHED: 'bg-green-50 text-green-700',
    FULL: 'bg-amber-50 text-amber-700',
    COMPLETED: 'bg-blue-50 text-blue-700',
    CANCELLED: 'bg-red-50 text-red-700',
  }
  const labels: Record<string, string> = {
    DRAFT: 'Borrador',
    PUBLISHED: 'Publicado',
    FULL: 'Completo',
    COMPLETED: 'Finalizado',
    CANCELLED: 'Cancelado',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  )
}
