import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@yogara/database'
import { ConfigForm } from './config-form'
import { BillingSection } from './billing-section'

export const dynamic = 'force-dynamic'

export default async function AdminConfiguracionPage() {
  const { organization, organizationId } = await requireAdmin()

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    include: { subscriptionPlan: true },
  })

  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Configuración</h1>
      <ConfigForm org={organization} />
      <BillingSection
        currentPlan={org.subscriptionPlan}
        subscriptionStatus={org.subscriptionStatus}
        plans={plans}
        hasStripeCustomer={!!org.stripeCustomerId}
      />
    </div>
  )
}
