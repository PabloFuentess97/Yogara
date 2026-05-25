'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requirePanelAuth } from '@/lib/panel-auth'

export async function updateCustomHtmlAction(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const { org } = await requirePanelAuth()

  const html = formData.get('html') as string | null

  if (!html || html.trim() === '') {
    return { success: false, error: 'El HTML no puede estar vacío' }
  }

  const existingSettings = (org.settings as Record<string, any>) ?? {}
  const mergedSettings = { ...existingSettings, customLandingHtml: html }

  try {
    await prisma.organization.update({
      where: { id: org.id },
      data: { settings: mergedSettings },
    })
  } catch {
    return { success: false, error: 'Error al guardar el HTML personalizado' }
  }

  revalidatePath('/panel/apariencia')
  return { success: true, error: null }
}

export async function removeCustomHtmlAction(): Promise<{ success: boolean; error: string | null }> {
  const { org } = await requirePanelAuth()

  const existingSettings = (org.settings as Record<string, any>) ?? {}
  const mergedSettings = { ...existingSettings, customLandingHtml: null }

  try {
    await prisma.organization.update({
      where: { id: org.id },
      data: { settings: mergedSettings },
    })
  } catch {
    return { success: false, error: 'Error al eliminar la landing personalizada' }
  }

  revalidatePath('/panel/apariencia')
  return { success: true, error: null }
}
