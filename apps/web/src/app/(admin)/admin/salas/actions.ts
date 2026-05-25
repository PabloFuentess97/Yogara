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

const actualizarSalaSchema = crearSalaSchema.partial().extend({
  id: z.string().uuid(),
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

export async function actualizarSalaAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    capacity: Number(formData.get('capacity')),
    description: (formData.get('description') as string) || undefined,
  }

  const parsed = actualizarSalaSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const { id, ...data } = parsed.data

  const existing = await prisma.room.findFirst({
    where: { id, organizationId },
  })

  if (!existing) {
    return { error: 'Sala no encontrada' }
  }

  await prisma.room.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/salas')
  return { success: true }
}

export async function eliminarSalaAction(id: string) {
  const { organizationId } = await requireAdmin()

  const existing = await prisma.room.findFirst({
    where: { id, organizationId },
  })

  if (!existing) {
    return { error: 'Sala no encontrada' }
  }

  await prisma.room.update({
    where: { id },
    data: { isActive: false },
  })

  revalidatePath('/admin/salas')
  return { success: true }
}
