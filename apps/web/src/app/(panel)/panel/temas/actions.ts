'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { auth } from '@/lib/auth'

async function requirePlatformAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('No autenticado')
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isPlatformAdmin) throw new Error('No autorizado')
  return user
}

export async function assignThemeAction(organizationId: string, themeId: string) {
  await requirePlatformAdmin()

  await prisma.organization.update({
    where: { id: organizationId },
    data: { customThemeId: themeId },
  })

  revalidatePath('/panel/temas')
  return { success: true }
}

export async function removeThemeAction(organizationId: string) {
  await requirePlatformAdmin()

  await prisma.organization.update({
    where: { id: organizationId },
    data: { customThemeId: null },
  })

  revalidatePath('/panel/temas')
  return { success: true }
}

export async function deleteThemeAction(themeId: string) {
  await requirePlatformAdmin()

  const theme = await prisma.customTheme.findUnique({
    where: { id: themeId },
    include: { _count: { select: { organizations: true } } },
  })

  if (!theme) return { error: 'Tema no encontrado' }
  if (theme._count.organizations > 0) {
    return { error: 'No se puede eliminar un tema asignado a organizaciones' }
  }

  await prisma.customTheme.delete({ where: { id: themeId } })

  revalidatePath('/panel/temas')
  return { success: true }
}

export async function toggleThemeAction(themeId: string) {
  await requirePlatformAdmin()

  const theme = await prisma.customTheme.findUnique({ where: { id: themeId } })
  if (!theme) return { error: 'Tema no encontrado' }

  await prisma.customTheme.update({
    where: { id: themeId },
    data: { isActive: !theme.isActive },
  })

  revalidatePath('/panel/temas')
  return { success: true }
}
