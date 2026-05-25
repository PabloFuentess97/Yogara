'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const crearSalaSchema = z.object({
  name: z.string().min(2).max(100),
  capacity: z.number().int().min(1).max(200),
  description: z.string().max(500).optional(),
})

export async function crearSalaAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    name: formData.get('name') as string,
    capacity: Number(formData.get('capacity')),
    description: (formData.get('description') as string) || undefined,
  }

  const parsed = crearSalaSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  await prisma.room.create({
    data: { ...parsed.data, organizationId },
  })

  revalidatePath('/admin/salas')
  return { success: true }
}
