'use client'

import { useState } from 'react'
import { reservarAction, cancelarReservaAction } from './actions'

interface BookingButtonProps {
  sessionId: string
  bookingId?: string | null
  bookingStatus?: string | null
  spotsLeft: number
  isLoggedIn: boolean
}

export function BookingButton({
  sessionId,
  bookingId,
  bookingStatus,
  spotsLeft,
  isLoggedIn,
}: BookingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(bookingStatus)
  const [currentBookingId, setCurrentBookingId] = useState(bookingId)

  if (!isLoggedIn) {
    return (
      <a
        href="/login"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
      >
        Inicia sesión para reservar
      </a>
    )
  }

  if (status === 'CONFIRMED') {
    return (
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
          Reservado
        </span>
        <button
          onClick={async () => {
            if (!currentBookingId) return
            setLoading(true)
            setError(null)
            const result = await cancelarReservaAction(currentBookingId)
            setLoading(false)
            if (result.error) {
              setError(result.error)
            } else {
              setStatus(null)
              setCurrentBookingId(null)
            }
          }}
          disabled={loading}
          className="block text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {loading ? 'Cancelando...' : 'Cancelar reserva'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  if (status === 'WAITLISTED') {
    return (
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
          En lista de espera
        </span>
        <button
          onClick={async () => {
            if (!currentBookingId) return
            setLoading(true)
            setError(null)
            const result = await cancelarReservaAction(currentBookingId)
            setLoading(false)
            if (result.error) {
              setError(result.error)
            } else {
              setStatus(null)
              setCurrentBookingId(null)
            }
          }}
          disabled={loading}
          className="block text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {loading ? 'Cancelando...' : 'Salir de la lista'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={async () => {
          setLoading(true)
          setError(null)
          const result = await reservarAction(sessionId)
          setLoading(false)
          if (result.error) {
            setError(result.error)
          } else if (result.bookingId) {
            setStatus(spotsLeft > 0 ? 'CONFIRMED' : 'WAITLISTED')
            setCurrentBookingId(result.bookingId)
          }
        }}
        disabled={loading}
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {loading
          ? 'Reservando...'
          : spotsLeft > 0
            ? `Reservar (${spotsLeft} plazas)`
            : 'Lista de espera'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
