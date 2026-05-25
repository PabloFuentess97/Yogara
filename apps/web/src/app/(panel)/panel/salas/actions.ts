'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requirePanelAuth } from '@/lib/panel-auth'
import { z } from 'zod'

const crearSalaSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  capacity: z.number().int().min(1, 'La capacidad debe ser al menos 1').max(200),
  description: z.string().max(500).optional(),
})

const actualizarSalaSchema = crearSalaSchema.partial().extend({
  id: z.string().uuid(),
})

export async function crearSalaAction(formData: FormData) {
  const { org } = await requirePanelAuth()

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
    data: { ...parsed.data, organizationId: org.id },
  })

  revalidatePath('/panel/salas')
  return { success: true }
}

export async function actualizarSalaAction(formData: FormData) {
  const { org } = await requirePanelAuth()

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
    where: { id, organizationId: org.id },
  })

  if (!existing) {
    return { error: 'Sala no encontrada' }
  }

  await prisma.room.update({
    where: { id },
    data,
  })

  revalidatePath('/panel/salas')
  return { success: true }
}

export async function eliminarSalaAction(formData: FormData) {
  const { org } = await requirePanelAuth()

  const id = formData.get('id') as string
  if (!id) {
    return { error: 'ID no proporcionado' }
  }

  const existing = await prisma.room.findFirst({
    where: { id, organizationId: org.id },
  })

  if (!existing) {
    return { error: 'Sala no encontrada' }
  }

  await prisma.room.update({
    where: { id },
    data: { isActive: false },
  })

  revalidatePath('/panel/salas')
  return { success: true }
}
