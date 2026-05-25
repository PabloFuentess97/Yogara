import { prisma } from '@yogara/database'
import type { ActionResult } from '../types'
import type { CrearReservaInput, CancelarReservaInput } from './reservas.schema'

export const reservasService = {
  async crear(
    input: CrearReservaInput,
    memberId: string,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const session = await prisma.classSession.findFirst({
      where: { id: input.classSessionId, organizationId },
    })

    if (!session) {
      return { success: false, error: 'Sesión de clase no encontrada' }
    }

    if (session.status !== 'SCHEDULED') {
      return { success: false, error: 'La clase no está disponible para reservas' }
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        classSessionId_memberId: {
          classSessionId: input.classSessionId,
          memberId,
        },
      },
    })

    if (existingBooking) {
      return { success: false, error: 'Ya tienes una reserva para esta clase' }
    }

    const spotsAvailable = session.capacity - session.bookedCount
    const isWaitlisted = spotsAvailable <= 0

    const booking = await prisma.booking.create({
      data: {
        organizationId,
        classSessionId: input.classSessionId,
        memberId,
        status: isWaitlisted ? 'WAITLISTED' : 'CONFIRMED',
        waitlistPosition: isWaitlisted
          ? await getNextWaitlistPosition(input.classSessionId)
          : null,
      },
    })

    if (!isWaitlisted) {
      await prisma.classSession.update({
        where: { id: input.classSessionId },
        data: { bookedCount: { increment: 1 } },
      })
    }

    return { success: true, data: { id: booking.id } }
  },

  async cancelar(
    input: CancelarReservaInput,
    memberId: string,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const booking = await prisma.booking.findFirst({
      where: { id: input.bookingId, organizationId, memberId },
    })

    if (!booking) {
      return { success: false, error: 'Reserva no encontrada' }
    }

    if (booking.status === 'CANCELLED') {
      return { success: false, error: 'La reserva ya está cancelada' }
    }

    await prisma.booking.update({
      where: { id: input.bookingId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    })

    if (booking.status === 'CONFIRMED') {
      await prisma.classSession.update({
        where: { id: booking.classSessionId },
        data: { bookedCount: { decrement: 1 } },
      })
    }

    return { success: true, data: { id: booking.id } }
  },

  async listarPorMiembro(memberId: string, organizationId: string) {
    return prisma.booking.findMany({
      where: { memberId, organizationId, status: { not: 'CANCELLED' } },
      include: {
        classSession: {
          include: { classType: true, instructor: { include: { user: true } } },
        },
      },
      orderBy: { classSession: { date: 'asc' } },
    })
  },
}

async function getNextWaitlistPosition(classSessionId: string): Promise<number> {
  const lastWaitlisted = await prisma.booking.findFirst({
    where: { classSessionId, status: 'WAITLISTED' },
    orderBy: { waitlistPosition: 'desc' },
  })
  return (lastWaitlisted?.waitlistPosition ?? 0) + 1
}
