'use server'

import { revalidatePath } from 'next/cache'
import { requireStudent } from '@/lib/student-auth'
import { reservasService, membresiasService } from '@yogara/modules'
import { prisma } from '@yogara/database'
import { sendEmail, bookingConfirmedTemplate, bookingCancelledTemplate } from '@yogara/email'

export async function reservarAction(classSessionId: string) {
  const { memberId, organizationId, userId, organization } = await requireStudent()

  const membership = await membresiasService.verificarMembresiaActiva(memberId, organizationId)
  if (!membership.active) {
    return { error: 'Necesitas una membresía activa para reservar. Consulta nuestros planes.' }
  }

  const result = await reservasService.crear({ classSessionId }, memberId, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  const session = await prisma.classSession.findUnique({
    where: { id: classSessionId },
    include: {
      classType: true,
      instructor: { include: { user: true } },
      room: true,
    },
  })
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (session && user?.email) {
    const template = bookingConfirmedTemplate({
      userName: user.name ?? 'Alumno',
      className: session.classType.name,
      date: session.date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: `${session.startTime} - ${session.endTime}`,
      instructor: session.instructor?.user.name ?? 'Sin asignar',
      room: session.room?.name,
      orgName: organization.name,
    })
    sendEmail({ to: user.email, ...template }).catch(() => {})
  }

  revalidatePath('/horarios')
  revalidatePath('/reservas')
  return { success: true, bookingId: result.data.id }
}

export async function cancelarReservaAction(bookingId: string) {
  const { memberId, organizationId, userId, organization } = await requireStudent()

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, memberId, organizationId },
    include: {
      classSession: { include: { classType: true } },
    },
  })

  const result = await reservasService.cancelar({ bookingId }, memberId, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  if (booking) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.email) {
      const template = bookingCancelledTemplate({
        userName: user.name ?? 'Alumno',
        className: booking.classSession.classType.name,
        date: booking.classSession.date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: `${booking.classSession.startTime} - ${booking.classSession.endTime}`,
        orgName: organization.name,
      })
      sendEmail({ to: user.email, ...template }).catch(() => {})
    }
  }

  revalidatePath('/horarios')
  revalidatePath('/reservas')
  return { success: true }
}
