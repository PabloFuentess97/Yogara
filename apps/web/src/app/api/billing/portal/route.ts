import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { billingService } from '@yogara/modules'

export async function POST(req: NextRequest) {
  const { organizationId } = await requireAdmin()
  const baseUrl = req.nextUrl.origin

  const result = await billingService.createCustomerPortalSession(
    organizationId,
    `${baseUrl}/admin/configuracion`,
  )

  return NextResponse.json(result)
}
