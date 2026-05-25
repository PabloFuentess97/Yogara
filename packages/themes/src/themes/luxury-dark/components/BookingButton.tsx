'use client'

import type { BookingButtonProps } from '../../../engine/types'

export function BookingButton({ sessionId, availableSpots, isBooked, disabled }: BookingButtonProps) {
  if (isBooked) {
    return (
      <button
        disabled
        className="w-full py-3.5 bg-[#22C55E]/10 text-[#22C55E] font-light text-sm border border-[#22C55E]/20 cursor-default tracking-wide"
      >
        Reservado
      </button>
    )
  }

  if (availableSpots <= 0) {
    return (
      <button
        disabled
        className="w-full py-3.5 bg-[#1A1A1A] text-[#9CA3AF]/50 font-light text-sm border border-[#2A2A2A] cursor-not-allowed tracking-wide"
      >
        Completo — Lista de espera
      </button>
    )
  }

  return (
    <button
      disabled={disabled}
      className="w-full py-3.5 bg-[#D4AF37] text-[#0A0A0A] font-medium text-sm tracking-wider uppercase hover:bg-[#F5E6C8] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-[#D4AF37]"
    >
      Reservar plaza &middot; {availableSpots} disponible{availableSpots !== 1 ? 's' : ''}
    </button>
  )
}
