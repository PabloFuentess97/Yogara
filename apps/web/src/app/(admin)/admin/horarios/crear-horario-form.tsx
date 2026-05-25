'use client'

import { useState, useActionState } from 'react'
import { crearHorarioAction } from './actions'

interface SelectOption {
  id: string
  label: string
}

interface Props {
  classTypes: SelectOption[]
  instructors: SelectOption[]
  rooms: SelectOption[]
}

const DAY_OPTIONS = [
  { value: '0', label: 'Lunes' },
  { value: '1', label: 'Martes' },
  { value: '2', label: 'Miércoles' },
  { value: '3', label: 'Jueves' },
  { value: '4', label: 'Viernes' },
  { value: '5', label: 'Sábado' },
  { value: '6', label: 'Domingo' },
]

export function CrearHorarioForm({ classTypes, instructors, rooms }: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await crearHorarioAction(formData)
      if (result.success) {
        setOpen(false)
      }
      return result
    },
    undefined
  )

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
      >
        + Nuevo horario
      </button>
    )
  }

  const canCreate = classTypes.length > 0 && instructors.length > 0 && rooms.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-stone-200 p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Nuevo horario</h2>

        {!canCreate ? (
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Para crear un horario necesitas tener al menos un tipo de clase, un profesor y una sala.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tipo de clase</label>
              <select
                name="classTypeId"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              >
                {classTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>{ct.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Profesor</label>
              <select
                name="instructorId"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              >
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Sala</label>
              <select
                name="roomId"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Día</label>
              <select
                name="dayOfWeek"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Hora inicio</label>
                <input
                  name="startTime"
                  type="time"
                  required
                  defaultValue="09:00"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Hora fin</label>
                <input
                  name="endTime"
                  type="time"
                  required
                  defaultValue="10:00"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Capacidad</label>
              <input
                name="capacity"
                type="number"
                required
                min={1}
                defaultValue={15}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {pending ? 'Creando...' : 'Crear horario'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
