import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { billingService } from '@yogara/modules'

export async function POST(req: NextRequest) {
  const { organizationId, organization } = await requireAdmin()
  const { planId, interval } = await req.json()

  if (!planId || !interval) {
    return NextResponse.json({ error: 'Missing planId or interval' }, { status: 400 })
  }

  const baseUrl = req.nextUrl.origin
  const result = await billingService.createCheckoutSession({
    organizationId,
    planId,
    interval,
    successUrl: `${baseUrl}/admin/configuracion?billing=success`,
    cancelUrl: `${baseUrl}/admin/configuracion?billing=cancelled`,
  })

  return NextResponse.json(result)
}
