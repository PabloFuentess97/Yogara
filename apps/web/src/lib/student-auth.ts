import { redirect } from 'next/navigation'
import { auth } from './auth'
import { prisma } from '@yogara/database'
import { resolveTenant } from './tenant'

export async function requireStudent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const org = await resolveTenant()

  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: org.id,
      status: 'ACTIVE',
    },
  })

  if (!member) {
    redirect('/')
  }

  return {
    userId: session.user.id,
    memberId: member.id,
    organizationId: org.id,
    organization: org,
    role: member.role,
  }
}

export async function optionalStudent() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const org = await resolveTenant()

  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: org.id,
      status: 'ACTIVE',
    },
  })

  if (!member) return null

  return {
    userId: session.user.id,
    memberId: member.id,
    organizationId: org.id,
    role: member.role,
  }
}
