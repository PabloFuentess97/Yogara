import { z } from 'zod'

export const crearClaseSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  durationMinutes: z.number().int().min(15).max(240),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  imageUrl: z.string().url().optional(),
  level: z.enum(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  sortOrder: z.number().int().default(0),
})

export const actualizarClaseSchema = crearClaseSchema.partial().extend({
  id: z.string().uuid(),
})

export type CrearClaseInput = z.infer<typeof crearClaseSchema>
export type ActualizarClaseInput = z.infer<typeof actualizarClaseSchema>
