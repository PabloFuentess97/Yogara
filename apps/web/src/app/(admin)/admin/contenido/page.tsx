import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { CrearContenidoForm } from './crear-contenido-form'
import { togglePublicadoAction, eliminarContenidoAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminContenidoPage() {
  const { organizationId } = await requireAdmin()

  const contents = await prisma.onlineContent.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: { instructor: { include: { user: true } } },
  })

  const instructors = await prisma.organizationMember.findMany({
    where: { organizationId, role: 'INSTRUCTOR', status: 'ACTIVE' },
    include: { user: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Contenido Online</h1>
        <CrearContenidoForm instructors={instructors.map(i => ({ id: i.id, name: i.user.name ?? 'Sin nombre' }))} />
      </div>

      {contents.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay contenido creado aún.</p>
          <p className="text-sm text-stone-400 mt-1">
            Sube videos para tus alumnos.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Título</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Categoría</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Nivel</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Duración</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Estado</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Vistas</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-stone-900">{content.title}</p>
                        {!content.requiresMembership && (
                          <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-green-50 text-green-700 mt-0.5">
                            Gratuito
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{content.category}</td>
                    <td className="px-4 py-3 text-stone-600">{levelLabel(content.level)}</td>
                    <td className="px-4 py-3 text-stone-600">{content.durationMinutes} min</td>
                    <td className="px-4 py-3">
                      <form action={async () => {
                        'use server'
                        await togglePublicadoAction(content.id)
                      }}>
                        <button
                          type="submit"
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            content.isPublished
                              ? 'bg-green-50 text-green-700'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {content.isPublished ? 'Publicado' : 'Borrador'}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600">{content.viewsCount}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={async () => {
                        'use server'
                        await eliminarContenidoAction(content.id)
                      }}>
                        <button
                          type="submit"
                          className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function levelLabel(level: string): string {
  const labels: Record<string, string> = {
    ALL: 'Todos',
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  }
  return labels[level] ?? level
}
