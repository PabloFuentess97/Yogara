import { z } from 'zod'

export const crearReservaSchema = z.object({
  classSessionId: z.string().uuid(),
})

export const cancelarReservaSchema = z.object({
  bookingId: z.string().uuid(),
})

export const checkInSchema = z.object({
  checkInCode: z.string().min(1),
})

export type CrearReservaInput = z.infer<typeof crearReservaSchema>
export type CancelarReservaInput = z.infer<typeof cancelarReservaSchema>
export type CheckInInput = z.infer<typeof checkInSchema>
