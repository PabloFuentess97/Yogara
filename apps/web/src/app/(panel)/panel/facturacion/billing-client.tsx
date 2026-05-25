'use client'

import { useState } from 'react'

type Plan = {
  id: string
  name: string
  description: string | null
  priceMonthly: number
  priceYearly: number
  maxStudents: number
  maxInstructors: number
  maxClasses: number
  sortOrder: number
}

type BillingClientProps = {
  organizationId: string
  currentPlan: {
    id: string
    name: string
    priceMonthly: number
    priceYearly: number
  } | null
  subscriptionStatus: string
  plans: Plan[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Activo', className: 'bg-green-100 text-green-700' },
  TRIALING: { label: 'Prueba', className: 'bg-blue-100 text-blue-700' },
  PAST_DUE: { label: 'Pago pendiente', className: 'bg-yellow-100 text-yellow-700' },
  CANCELED: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
  INACTIVE: { label: 'Inactivo', className: 'bg-stone-100 text-stone-600' },
}

export function BillingClient({
  organizationId,
  currentPlan,
  subscriptionStatus,
  plans,
}: BillingClientProps) {
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null)

  const status = statusConfig[subscriptionStatus] ?? statusConfig.INACTIVE

  async function handleManageBilling() {
    setLoadingPortal(true)
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          returnUrl: window.location.href,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoadingPortal(false)
    }
  }

  async function handleSelectPlan(planId: string, interval: 'monthly' | 'yearly') {
    setLoadingCheckout(`${planId}-${interval}`)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          planId,
          interval,
          successUrl: `${window.location.origin}/panel/facturacion?billing=success`,
          cancelUrl: `${window.location.origin}/panel/facturacion?billing=cancelled`,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoadingCheckout(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Current plan card */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-stone-900">
                {currentPlan ? currentPlan.name : 'Sin plan'}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            {currentPlan && (
              <p className="text-stone-500 mt-1">
                {currentPlan.priceMonthly > 0
                  ? `${currentPlan.priceMonthly.toFixed(2)} €/mes`
                  : 'Gratis'}
              </p>
            )}
          </div>

          <button
            onClick={handleManageBilling}
            disabled={loadingPortal}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-stone-300 bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingPortal ? 'Cargando...' : 'Gestionar facturación'}
          </button>
        </div>
      </div>

      {/* Available plans */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Planes disponibles</h2>

        {plans.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
            <p className="text-stone-500">No hay planes disponibles aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentPlan?.id === plan.id}
                loadingCheckout={loadingCheckout}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PlanCard({
  plan,
  isCurrentPlan,
  loadingCheckout,
  onSelect,
}: {
  plan: Plan
  isCurrentPlan: boolean
  loadingCheckout: string | null
  onSelect: (planId: string, interval: 'monthly' | 'yearly') => void
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-6 flex flex-col ${
        isCurrentPlan ? 'border-stone-400 ring-1 ring-stone-400' : 'border-stone-200'
      }`}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-stone-900">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-stone-500 mt-1">{plan.description}</p>
        )}

        <div className="mt-4 space-y-1">
          <p className="text-2xl font-bold text-stone-900">
            {plan.priceMonthly > 0 ? `${plan.priceMonthly.toFixed(2)} €` : 'Gratis'}
            {plan.priceMonthly > 0 && (
              <span className="text-sm font-normal text-stone-500">/mes</span>
            )}
          </p>
          {plan.priceYearly > 0 && (
            <p className="text-sm text-stone-500">
              o {plan.priceYearly.toFixed(2)} €/año
            </p>
          )}
        </div>

        <ul className="mt-4 space-y-2 text-sm text-stone-600">
          <li className="flex items-center gap-2">
            <CheckIcon />
            {plan.maxStudents === -1 ? 'Alumnos ilimitados' : `Hasta ${plan.maxStudents} alumnos`}
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            {plan.maxInstructors === -1
              ? 'Instructores ilimitados'
              : `Hasta ${plan.maxInstructors} instructores`}
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            {plan.maxClasses === -1 ? 'Clases ilimitadas' : `Hasta ${plan.maxClasses} clases`}
          </li>
        </ul>
      </div>

      <div className="mt-6 space-y-2">
        {isCurrentPlan ? (
          <div className="text-center text-sm font-medium text-stone-500 py-2">
            Plan actual
          </div>
        ) : (
          <>
            {plan.priceMonthly > 0 && (
              <button
                onClick={() => onSelect(plan.id, 'monthly')}
                disabled={loadingCheckout !== null}
                className="w-full px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingCheckout === `${plan.id}-monthly`
                  ? 'Cargando...'
                  : 'Elegir plan mensual'}
              </button>
            )}
            {plan.priceYearly > 0 && (
              <button
                onClick={() => onSelect(plan.id, 'yearly')}
                disabled={loadingCheckout !== null}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingCheckout === `${plan.id}-yearly`
                  ? 'Cargando...'
                  : 'Elegir plan anual'}
              </button>
            )}
            {plan.priceMonthly === 0 && plan.priceYearly === 0 && (
              <button
                onClick={() => onSelect(plan.id, 'monthly')}
                disabled={loadingCheckout !== null}
                className="w-full px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingCheckout === `${plan.id}-monthly`
                  ? 'Cargando...'
                  : 'Elegir plan'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-stone-400 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
