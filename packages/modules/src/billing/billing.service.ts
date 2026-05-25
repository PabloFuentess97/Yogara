import { prisma } from '@yogara/database'
import { getStripe } from './stripe'

export const billingService = {
  async createCheckoutSession(params: {
    organizationId: string
    planId: string
    interval: 'monthly' | 'yearly'
    successUrl: string
    cancelUrl: string
  }) {
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: params.organizationId },
    })

    const plan = await prisma.subscriptionPlan.findUniqueOrThrow({
      where: { id: params.planId },
    })

    const priceId =
      params.interval === 'monthly'
        ? plan.stripePriceIdMonthly
        : plan.stripePriceIdYearly

    if (!priceId) {
      throw new Error(`Plan ${plan.name} does not have a Stripe price for ${params.interval}`)
    }

    let customerId = org.stripeCustomerId

    if (!customerId) {
      const customer = await getStripe().customers.create({
        name: org.name,
        metadata: { organizationId: org.id },
      })
      customerId = customer.id
      await prisma.organization.update({
        where: { id: org.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { organizationId: org.id, planId: plan.id },
    })

    return { url: session.url }
  },

  async createCustomerPortalSession(organizationId: string, returnUrl: string) {
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
    })

    if (!org.stripeCustomerId) {
      throw new Error('Organization does not have a Stripe customer')
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleWebhookEvent(event: { type: string; data: { object: any } }) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          metadata?: { organizationId?: string; planId?: string }
          subscription?: string
        }
        const orgId = session.metadata?.organizationId
        const planId = session.metadata?.planId
        if (orgId && planId) {
          await prisma.organization.update({
            where: { id: orgId },
            data: {
              subscriptionPlanId: planId,
              subscriptionStatus: 'ACTIVE',
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as {
          customer?: string
          status?: string
          cancel_at_period_end?: boolean
        }
        const customerId =
          typeof subscription.customer === 'string' ? subscription.customer : null
        if (!customerId) break

        const org = await prisma.organization.findUnique({
          where: { stripeCustomerId: customerId },
        })
        if (!org) break

        const statusMap: Record<string, string> = {
          active: 'ACTIVE',
          past_due: 'PAST_DUE',
          canceled: 'CANCELED',
          unpaid: 'PAST_DUE',
          trialing: 'TRIALING',
        }

        const newStatus = statusMap[subscription.status ?? ''] ?? 'ACTIVE'
        await prisma.organization.update({
          where: { id: org.id },
          data: {
            subscriptionStatus: newStatus as 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING',
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as { customer?: string }
        const customerId =
          typeof subscription.customer === 'string' ? subscription.customer : null
        if (!customerId) break

        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'CANCELED' },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as { customer?: string }
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : null
        if (!customerId) break

        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'PAST_DUE' },
        })
        break
      }
    }
  },
}
