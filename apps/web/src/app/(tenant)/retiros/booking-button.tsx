'use client'

import { useState } from 'react'
import { reservarRetiroAction, cancelarRetiroAction } from './actions'

interface RetreatBookingButtonProps {
  retreatId: string
  bookingId?: string | null
  bookingStatus?: string | null
  spotsLeft: number
  isLoggedIn: boolean
}

export function RetreatBookingButton({
  retreatId,
  bookingId,
  bookingStatus,
  spotsLeft,
  isLoggedIn,
}: RetreatBookingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(bookingStatus)
  const [currentBookingId, setCurrentBookingId] = useState(bookingId)

  if (!isLoggedIn) {
    return (
      <a
        href="/login"
        className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
      >
        Inicia sesion para reservar
      </a>
    )
  }

  if (status === 'CONFIRMED' || status === 'PENDING') {
    return (
      <div className="space-y-2">
        <span className="inline-flex items-center justify-center w-full gap-1.5 px-6 py-3 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200">
          Reservado
        </span>
        <button
          onClick={async () => {
            if (!currentBookingId) return
            setLoading(true)
            setError(null)
            const result = await cancelarRetiroAction(currentBookingId)
            setLoading(false)
            if (result.error) {
              setError(result.error)
            } else {
              setStatus(null)
              setCurrentBookingId(null)
            }
          }}
          disabled={loading}
          className="block w-full text-center text-sm text-red-600 hover:text-red-800 disabled:opacity-50 py-1"
        >
          {loading ? 'Cancelando...' : 'Cancelar reserva'}
        </button>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>
    )
  }

  if (spotsLeft <= 0) {
    return (
      <button
        disabled
        className="w-full px-6 py-3 rounded-xl bg-stone-100 text-stone-500 font-medium text-sm cursor-not-allowed"
      >
        Sin plazas disponibles
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={async () => {
          setLoading(true)
          setError(null)
          const result = await reservarRetiroAction(retreatId)
          setLoading(false)
          if ('error' in result && result.error) {
            setError(result.error)
          } else {
            setStatus('CONFIRMED')
          }
        }}
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Reservando...' : `Reservar plaza · ${spotsLeft} disponible${spotsLeft !== 1 ? 's' : ''}`}
      </button>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}
