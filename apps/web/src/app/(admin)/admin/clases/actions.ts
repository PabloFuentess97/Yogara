'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { clasesService, crearClaseSchema, actualizarClaseSchema } from '@yogara/modules'

export async function crearClaseAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('name') as string)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: (formData.get('description') as string) || undefined,
    durationMinutes: Number(formData.get('durationMinutes')),
    level: (formData.get('level') as string) || 'ALL',
    color: (formData.get('color') as string) || '#8B7355',
  }

  const parsed = crearClaseSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const result = await clasesService.crear(parsed.data, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/admin/clases')
  return { success: true }
}

export async function actualizarClaseAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    id: formData.get('id') as string,
    name: (formData.get('name') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    durationMinutes: formData.get('durationMinutes') ? Number(formData.get('durationMinutes')) : undefined,
    level: (formData.get('level') as string) || undefined,
    color: (formData.get('color') as string) || undefined,
  }

  const parsed = actualizarClaseSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const result = await clasesService.actualizar(parsed.data, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/admin/clases')
  return { success: true }
}

export async function eliminarClaseAction(id: string) {
  const { organizationId } = await requireAdmin()

  const result = await clasesService.eliminar(id, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/admin/clases')
  return { success: true }
}
