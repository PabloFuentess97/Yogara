'use client'

import type { BookingButtonProps } from '../../../engine/types'

export function BookingButton({ sessionId, availableSpots, isBooked, disabled }: BookingButtonProps) {
  if (isBooked) {
    return (
      <button
        disabled
        className="w-full py-3.5 rounded-2xl bg-[#5B7A5E]/10 text-[#5B7A5E] font-medium text-sm border border-[#5B7A5E]/20 cursor-default flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Reservado
      </button>
    )
  }

  if (availableSpots <= 0) {
    return (
      <button
        disabled
        className="w-full py-3.5 rounded-2xl bg-[#F5F0EB] text-[#7A7A7A] font-medium text-sm cursor-not-allowed"
      >
        Completo — Lista de espera
      </button>
    )
  }

  return (
    <button
      disabled={disabled}
      className="w-full py-3.5 rounded-2xl bg-[#5B7A5E] text-white font-medium text-sm hover:bg-[#4A6A4D] transition-all hover:shadow-lg hover:shadow-[#5B7A5E]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
    >
      Reservar plaza · {availableSpots} disponible{availableSpots !== 1 ? 's' : ''}
    </button>
  )
}
