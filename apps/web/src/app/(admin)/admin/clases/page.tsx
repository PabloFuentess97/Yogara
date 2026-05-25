import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { CrearClaseForm } from './crear-clase-form'
import { ClaseCard } from './clase-card'

export const dynamic = 'force-dynamic'

export default async function AdminClasesPage() {
  const { organizationId } = await requireAdmin()

  const classTypes = await prisma.classType.findMany({
    where: { organizationId, isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Tipos de Clase</h1>
        <CrearClaseForm />
      </div>

      {classTypes.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay tipos de clase creados aún.</p>
          <p className="text-sm text-stone-400 mt-1">Crea tu primer tipo de clase para empezar a armar horarios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classTypes.map((ct) => (
            <ClaseCard
              key={ct.id}
              classType={{
                id: ct.id,
                name: ct.name,
                description: ct.description,
                durationMinutes: ct.durationMinutes,
                level: ct.level,
                color: ct.color,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
