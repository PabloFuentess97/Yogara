'use client'

import { useState } from 'react'
import { cancelarReservaAction } from './actions'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (cancelled) {
    return <span className="text-sm text-stone-400">Cancelada</span>
  }

  return (
    <div>
      <button
        onClick={async () => {
          setLoading(true)
          setError(null)
          const result = await cancelarReservaAction(bookingId)
          setLoading(false)
          if (result.error) {
            setError(result.error)
          } else {
            setCancelled(true)
          }
        }}
        disabled={loading}
        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {loading ? 'Cancelando...' : 'Cancelar'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
