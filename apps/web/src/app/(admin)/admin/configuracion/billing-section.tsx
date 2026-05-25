'use client'

import { useState } from 'react'

interface Plan {
  id: string
  name: string
  slug: string
  priceMonthly: unknown
  priceYearly: unknown
  maxStudents: number
  maxInstructors: number
  maxClasses: number
}

interface Props {
  currentPlan: Plan | null
  subscriptionStatus: string
  plans: Plan[]
  hasStripeCustomer: boolean
}

export function BillingSection({ currentPlan, subscriptionStatus, plans, hasStripeCustomer }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  const statusLabels: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'Activa', color: 'bg-green-50 text-green-700' },
    TRIALING: { label: 'Prueba', color: 'bg-blue-50 text-blue-700' },
    PAST_DUE: { label: 'Pago pendiente', color: 'bg-yellow-50 text-yellow-700' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-50 text-red-700' },
  }

  const status = statusLabels[subscriptionStatus] ?? statusLabels.TRIALING

  async function handleCheckout(planId: string, interval: 'monthly' | 'yearly') {
    setLoading(`${planId}-${interval}`)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, interval }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="mt-6 bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-4">Suscripción y facturación</h2>

      <div className="flex items-center gap-3 mb-6">
        <div>
          <p className="text-sm text-stone-500">Plan actual</p>
          <p className="text-base font-medium text-stone-900">
            {currentPlan?.name ?? 'Sin plan'}
          </p>
        </div>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      {hasStripeCustomer && (
        <button
          onClick={handlePortal}
          disabled={loading === 'portal'}
          className="mb-6 px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
        >
          {loading === 'portal' ? 'Abriendo...' : 'Gestionar facturación'}
        </button>
      )}

      {plans.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-3">Cambiar plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.id === plan.id
              return (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-4 ${isCurrent ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}
                >
                  <h4 className="font-medium text-stone-900">{plan.name}</h4>
                  <p className="text-sm text-stone-500 mt-1">
                    {Number(plan.priceMonthly)}€/mes · {Number(plan.priceYearly)}€/año
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {plan.maxStudents} alumnos · {plan.maxInstructors} profes · {plan.maxClasses} clases
                  </p>
                  {isCurrent ? (
                    <p className="mt-3 text-xs font-medium text-stone-500">Plan actual</p>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleCheckout(plan.id, 'monthly')}
                        disabled={!!loading}
                        className="flex-1 px-3 py-1.5 rounded-md bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-50"
                      >
                        {loading === `${plan.id}-monthly` ? '...' : 'Mensual'}
                      </button>
                      <button
                        onClick={() => handleCheckout(plan.id, 'yearly')}
                        disabled={!!loading}
                        className="flex-1 px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 disabled:opacity-50"
                      >
                        {loading === `${plan.id}-yearly` ? '...' : 'Anual'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
