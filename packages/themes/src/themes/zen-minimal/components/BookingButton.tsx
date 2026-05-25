'use client'

import type { BookingButtonProps } from '../../../engine/types'

export function BookingButton({ sessionId, availableSpots, isBooked, disabled }: BookingButtonProps) {
  if (isBooked) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-green-50 text-green-700 font-medium text-sm border border-green-200 cursor-default"
      >
        Reservado ✓
      </button>
    )
  }

  if (availableSpots <= 0) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-stone-100 text-stone-500 font-medium text-sm cursor-not-allowed"
      >
        Completo — Lista de espera
      </button>
    )
  }

  return (
    <button
      disabled={disabled}
      className="w-full py-3 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Reservar plaza · {availableSpots} disponible{availableSpots !== 1 ? 's' : ''}
    </button>
  )
}
