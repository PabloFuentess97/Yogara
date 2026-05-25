import { auth } from '@/lib/auth'
import { prisma } from '@yogara/database'
import { redirect } from 'next/navigation'

export async function requirePanelAuth() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      role: 'ORG_ADMIN',
      status: 'ACTIVE',
    },
    include: {
      organization: {
        include: {
          subscriptionPlan: true,
          customDomains: true,
          rooms: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
          _count: {
            select: {
              members: { where: { status: 'ACTIVE' } },
              classSessions: true,
            },
          },
        },
      },
    },
  })

  if (!membership) redirect('/onboarding')

  return {
    user: session.user,
    org: membership.organization,
    membership,
  }
}
