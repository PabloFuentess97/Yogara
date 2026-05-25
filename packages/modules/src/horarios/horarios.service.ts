import { prisma } from '@yogara/database'
import { addDays, startOfWeek, format } from 'date-fns'
import type { ActionResult } from '../types'
import type { CrearHorarioInput } from './horarios.schema'

export const horariosService = {
  async listar(organizationId: string) {
    return prisma.schedule.findMany({
      where: { organizationId, isActive: true },
      include: {
        classType: true,
        instructor: { include: { user: true } },
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  },

  async crear(
    input: CrearHorarioInput,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const schedule = await prisma.schedule.create({
      data: { ...input, organizationId },
    })

    return { success: true, data: { id: schedule.id } }
  },

  async generarSesiones(
    organizationId: string,
    semanas: number = 4,
  ): Promise<ActionResult<{ count: number }>> {
    const schedules = await prisma.schedule.findMany({
      where: { organizationId, isActive: true },
    })

    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    let count = 0

    for (const schedule of schedules) {
      for (let week = 0; week < semanas; week++) {
        const sessionDate = addDays(weekStart, week * 7 + schedule.dayOfWeek)

        if (sessionDate < today) continue
        if (schedule.validUntil && sessionDate > schedule.validUntil) continue

        const existing = await prisma.classSession.findFirst({
          where: {
            organizationId,
            scheduleId: schedule.id,
            date: sessionDate,
          },
        })

        if (existing) continue

        await prisma.classSession.create({
          data: {
            organizationId,
            scheduleId: schedule.id,
            classTypeId: schedule.classTypeId,
            instructorId: schedule.instructorId,
            roomId: schedule.roomId,
            date: sessionDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            capacity: schedule.capacity,
          },
        })
        count++
      }
    }

    return { success: true, data: { count } }
  },

  async obtenerSesionesSemana(organizationId: string, fecha: Date) {
    const weekStart = startOfWeek(fecha, { weekStartsOn: 1 })
    const weekEnd = addDays(weekStart, 7)

    return prisma.classSession.findMany({
      where: {
        organizationId,
        date: { gte: weekStart, lt: weekEnd },
        status: 'SCHEDULED',
      },
      include: {
        classType: true,
        instructor: { include: { user: true } },
        room: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
  },
}
