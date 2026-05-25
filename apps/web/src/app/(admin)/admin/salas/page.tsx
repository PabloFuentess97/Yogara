import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { CrearSalaForm } from './crear-sala-form'

export default async function AdminSalasPage() {
  const { organizationId } = await requireAdmin()

  const rooms = await prisma.room.findMany({
    where: { organizationId, isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Salas</h1>
        <CrearSalaForm />
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay salas configuradas.</p>
          <p className="text-sm text-stone-400 mt-1">Crea una sala para poder asignarla a horarios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900 mb-1">{room.name}</h3>
              <p className="text-sm text-stone-600">Capacidad: {room.capacity} personas</p>
              {room.description && (
                <p className="text-sm text-stone-500 mt-2">{room.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
