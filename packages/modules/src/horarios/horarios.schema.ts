import { z } from 'zod'

export const crearHorarioSchema = z.object({
  classTypeId: z.string().uuid(),
  instructorId: z.string().uuid(),
  roomId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  capacity: z.number().int().min(1).max(100),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date().optional(),
})

export const actualizarHorarioSchema = crearHorarioSchema.partial().extend({
  id: z.string().uuid(),
})

export type CrearHorarioInput = z.infer<typeof crearHorarioSchema>
export type ActualizarHorarioInput = z.infer<typeof actualizarHorarioSchema>
