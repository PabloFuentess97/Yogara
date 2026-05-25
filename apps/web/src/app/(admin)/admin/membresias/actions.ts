'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { membresiasService, crearMembresiaSchema } from '@yogara/modules'

export async function crearMembresiaAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    price: Number(formData.get('price')),
    durationDays: formData.get('durationDays') ? Number(formData.get('durationDays')) : undefined,
    classLimit: formData.get('classLimit') ? Number(formData.get('classLimit')) : undefined,
    description: (formData.get('description') as string) || undefined,
  }

  const parsed = crearMembresiaSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const result = await membresiasService.crearPlan(parsed.data, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/admin/membresias')
  return { success: true }
}
