import { redirect } from 'next/navigation'
import { auth } from './auth'
import { prisma } from '@yogara/database'

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ['ORG_ADMIN'] },
      status: 'ACTIVE',
    },
    include: {
      organization: true,
    },
  })

  if (!member) {
    redirect('/')
  }

  return {
    userId: session.user.id,
    memberId: member.id,
    organizationId: member.organizationId,
    organization: member.organization,
    role: member.role,
  }
}

export async function requireInstructorOrAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ['ORG_ADMIN', 'INSTRUCTOR'] },
      status: 'ACTIVE',
    },
    include: {
      organization: true,
    },
  })

  if (!member) {
    redirect('/')
  }

  return {
    userId: session.user.id,
    memberId: member.id,
    organizationId: member.organizationId,
    organization: member.organization,
    role: member.role,
  }
}
