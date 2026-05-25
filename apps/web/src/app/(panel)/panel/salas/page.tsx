import { requirePanelAuth } from '@/lib/panel-auth'
import { SalaForm } from './sala-form'
import { SalaCard } from './sala-card'

export const dynamic = 'force-dynamic'

export default async function PanelSalasPage() {
  const { org } = await requirePanelAuth()

  const rooms = org.rooms

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Salas</h1>
        <SalaForm />
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay salas configuradas.</p>
          <p className="text-sm text-stone-400 mt-1">Crea una sala para poder asignarla a horarios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <SalaCard
              key={room.id}
              room={{
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                description: room.description,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
