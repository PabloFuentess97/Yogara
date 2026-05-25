'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const configSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
})

export async function actualizarConfigAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    address: (formData.get('address') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
  }

  const parsed = configSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  await prisma.organization.update({
    where: { id: organizationId },
    data: parsed.data,
  })

  revalidatePath('/admin/configuracion')
  return { success: true }
}
