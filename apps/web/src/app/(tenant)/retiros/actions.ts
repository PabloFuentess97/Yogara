'use server'

import { revalidatePath } from 'next/cache'
import { requireStudent } from '@/lib/student-auth'
import { prisma } from '@yogara/database'

export async function reservarRetiroAction(retreatId: string) {
  const { memberId, organizationId } = await requireStudent()

  const retreat = await prisma.retreat.findFirst({
    where: {
      id: retreatId,
      organizationId,
      deletedAt: null,
    },
  })

  if (!retreat) {
    return { error: 'El retiro no existe.' }
  }

  if (retreat.status !== 'PUBLISHED') {
    return { error: 'Este retiro no está disponible para reservas.' }
  }

  if (retreat.bookedCount >= retreat.capacity) {
    return { error: 'No quedan plazas disponibles en este retiro.' }
  }

  // Check if user already has a booking for this retreat
  const existingBooking = await prisma.retreatBooking.findUnique({
    where: {
      retreatId_memberId: {
        retreatId,
        memberId,
      },
    },
  })

  if (existingBooking && existingBooking.status !== 'CANCELLED') {
    return { error: 'Ya tienes una reserva para este retiro.' }
  }

  // Create booking and increment bookedCount in a transaction
  await prisma.$transaction([
    existingBooking
      ? prisma.retreatBooking.update({
          where: { id: existingBooking.id },
          data: {
            status: 'CONFIRMED',
            updatedAt: new Date(),
          },
        })
      : prisma.retreatBooking.create({
          data: {
            organizationId,
            retreatId,
            memberId,
            status: 'CONFIRMED',
            amountPaid: retreat.price,
            paymentMethod: retreat.paymentMethod,
          },
        }),
    prisma.retreat.update({
      where: { id: retreatId },
      data: {
        bookedCount: { increment: 1 },
        ...(retreat.bookedCount + 1 >= retreat.capacity && { status: 'FULL' }),
      },
    }),
  ])

  revalidatePath('/retiros')
  revalidatePath(`/retiros/${retreatId}`)
  return { success: true }
}

export async function cancelarRetiroAction(bookingId: string) {
  const { memberId, organizationId } = await requireStudent()

  const booking = await prisma.retreatBooking.findFirst({
    where: {
      id: bookingId,
      memberId,
      organizationId,
      status: { not: 'CANCELLED' },
    },
    include: { retreat: true },
  })

  if (!booking) {
    return { error: 'Reserva no encontrada.' }
  }

  // Cancel booking and decrement bookedCount in a transaction
  await prisma.$transaction([
    prisma.retreatBooking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    }),
    prisma.retreat.update({
      where: { id: booking.retreatId },
      data: {
        bookedCount: { decrement: 1 },
        ...(booking.retreat.status === 'FULL' && { status: 'PUBLISHED' }),
      },
    }),
  ])

  revalidatePath('/retiros')
  revalidatePath(`/retiros/${booking.retreatId}`)
  return { success: true }
}
