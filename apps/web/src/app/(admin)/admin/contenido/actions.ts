'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@yogara/database'

export async function crearContenidoAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const videoUrl = formData.get('videoUrl') as string
  const thumbnailUrl = (formData.get('thumbnailUrl') as string) || null
  const durationMinutes = Number(formData.get('durationMinutes') || '0')
  const category = (formData.get('category') as string) || 'General'
  const level = (formData.get('level') as string) || 'ALL'
  const instructorId = formData.get('instructorId') as string
  const requiresMembership = formData.get('requiresMembership') !== 'off'
  const isPublished = formData.get('isPublished') === 'on'

  if (!title || !videoUrl || !instructorId) {
    return { error: 'Título, URL del video e instructor son obligatorios.' }
  }

  await prisma.onlineContent.create({
    data: {
      organizationId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      durationMinutes,
      category,
      level: level as 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      instructorId,
      requiresMembership,
      isPublished,
    },
  })

  revalidatePath('/admin/contenido')
  return { success: true }
}

export async function eliminarContenidoAction(id: string) {
  const { organizationId } = await requireAdmin()

  const content = await prisma.onlineContent.findFirst({
    where: { id, organizationId },
  })

  if (!content) {
    return { error: 'Contenido no encontrado.' }
  }

  await prisma.onlineContent.delete({ where: { id } })

  revalidatePath('/admin/contenido')
  return { success: true }
}

export async function togglePublicadoAction(id: string) {
  const { organizationId } = await requireAdmin()

  const content = await prisma.onlineContent.findFirst({
    where: { id, organizationId },
  })

  if (!content) {
    return { error: 'Contenido no encontrado.' }
  }

  await prisma.onlineContent.update({
    where: { id },
    data: { isPublished: !content.isPublished },
  })

  revalidatePath('/admin/contenido')
  return { success: true }
}
