import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { CrearClaseForm } from './crear-clase-form'

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
            <div key={ct.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ct.color ?? '#8B7355' }}
                />
                <h3 className="font-semibold text-stone-900">{ct.name}</h3>
              </div>
              <p className="text-sm text-stone-600 mb-3">
                {ct.durationMinutes} min · {levelLabel(ct.level)}
              </p>
              {ct.description && (
                <p className="text-sm text-stone-500 line-clamp-2">{ct.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function levelLabel(level: string): string {
  const labels: Record<string, string> = {
    ALL: 'Todos los niveles',
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  }
  return labels[level] ?? level
}
