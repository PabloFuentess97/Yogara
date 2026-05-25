import { prisma } from '@yogara/database'
import type { ActionResult } from '../types'

export const retirosService = {
  async listar(organizationId: string) {
    return prisma.retreat.findMany({
      where: { organizationId, deletedAt: null, status: { not: 'DRAFT' } },
      orderBy: { startDate: 'asc' },
    })
  },

  async obtenerPorSlug(slug: string, organizationId: string) {
    return prisma.retreat.findFirst({
      where: { slug, organizationId, deletedAt: null },
      include: {
        retreatBookings: {
          include: { member: { include: { user: true } } },
        },
      },
    })
  },

  async reservar(
    retreatId: string,
    memberId: string,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const retreat = await prisma.retreat.findFirst({
      where: { id: retreatId, organizationId },
    })

    if (!retreat) {
      return { success: false, error: 'Retiro no encontrado' }
    }

    if (retreat.status === 'FULL' || retreat.bookedCount >= retreat.capacity) {
      return { success: false, error: 'No quedan plazas disponibles' }
    }

    const existing = await prisma.retreatBooking.findUnique({
      where: { retreatId_memberId: { retreatId, memberId } },
    })

    if (existing) {
      return { success: false, error: 'Ya tienes una reserva para este retiro' }
    }

    const booking = await prisma.retreatBooking.create({
      data: { organizationId, retreatId, memberId },
    })

    await prisma.retreat.update({
      where: { id: retreatId },
      data: { bookedCount: { increment: 1 } },
    })

    return { success: true, data: { id: booking.id } }
  },
}
