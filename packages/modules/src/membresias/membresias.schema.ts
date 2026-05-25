import { z } from 'zod'

export const crearMembresiaSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['UNLIMITED', 'CLASS_PACK', 'DROP_IN', 'FREE_TRIAL']),
  price: z.number().min(0),
  currency: z.string().default('EUR'),
  durationDays: z.number().int().min(1).optional(),
  classLimit: z.number().int().min(1).optional(),
  sortOrder: z.number().int().default(0),
})

export const asignarMembresiaSchema = z.object({
  memberId: z.string().uuid(),
  membershipId: z.string().uuid(),
  paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER', 'STRIPE', 'OTHER']),
  paymentReference: z.string().optional(),
})

export type CrearMembresiaInput = z.infer<typeof crearMembresiaSchema>
export type AsignarMembresiaInput = z.infer<typeof asignarMembresiaSchema>
