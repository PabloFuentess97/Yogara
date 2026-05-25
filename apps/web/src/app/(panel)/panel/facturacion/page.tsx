import { requirePanelAuth } from '@/lib/panel-auth'
import { prisma } from '@yogara/database'
import { BillingClient } from './billing-client'

export const dynamic = 'force-dynamic'

export default async function FacturacionPage() {
  const { org } = await requirePanelAuth()

  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const serializedPlans = plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    priceMonthly: Number(plan.priceMonthly),
    priceYearly: Number(plan.priceYearly),
    maxStudents: plan.maxStudents,
    maxInstructors: plan.maxInstructors,
    maxClasses: plan.maxClasses,
    sortOrder: plan.sortOrder,
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Facturación</h1>
        <p className="text-stone-600 mt-1">
          Gestiona tu plan y método de pago
        </p>
      </div>

      <BillingClient
        organizationId={org.id}
        currentPlan={
          org.subscriptionPlan
            ? {
                id: org.subscriptionPlan.id,
                name: org.subscriptionPlan.name,
                priceMonthly: Number(org.subscriptionPlan.priceMonthly),
                priceYearly: Number(org.subscriptionPlan.priceYearly),
              }
            : null
        }
        subscriptionStatus={org.subscriptionStatus}
        plans={serializedPlans}
      />
    </div>
  )
}
