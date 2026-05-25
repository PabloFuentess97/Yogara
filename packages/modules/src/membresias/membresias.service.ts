import { prisma } from '@yogara/database'
import { addDays } from 'date-fns'
import type { ActionResult } from '../types'
import type { CrearMembresiaInput, AsignarMembresiaInput } from './membresias.schema'

export const membresiasService = {
  async listarPlanes(organizationId: string) {
    return prisma.membership.findMany({
      where: { organizationId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async crearPlan(
    input: CrearMembresiaInput,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const membership = await prisma.membership.create({
      data: { ...input, organizationId },
    })
    return { success: true, data: { id: membership.id } }
  },

  async asignar(
    input: AsignarMembresiaInput,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const membership = await prisma.membership.findFirst({
      where: { id: input.membershipId, organizationId },
    })

    if (!membership) {
      return { success: false, error: 'Plan de membresía no encontrado' }
    }

    const now = new Date()
    const expiresAt = membership.durationDays
      ? addDays(now, membership.durationDays)
      : null

    const userMembership = await prisma.userMembership.create({
      data: {
        organizationId,
        memberId: input.memberId,
        membershipId: input.membershipId,
        startsAt: now,
        expiresAt,
        classesRemaining: membership.classLimit,
        paymentMethod: input.paymentMethod,
        paymentReference: input.paymentReference,
      },
    })

    return { success: true, data: { id: userMembership.id } }
  },

  async verificarMembresiaActiva(memberId: string, organizationId: string) {
    const activeMembership = await prisma.userMembership.findFirst({
      where: {
        memberId,
        organizationId,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: { membership: true },
    })

    if (!activeMembership) {
      return { active: false, membership: null } as const
    }

    if (
      activeMembership.membership.type === 'CLASS_PACK' &&
      activeMembership.classesRemaining !== null &&
      activeMembership.classesRemaining <= 0
    ) {
      return { active: false, membership: activeMembership } as const
    }

    return { active: true, membership: activeMembership } as const
  },
}
