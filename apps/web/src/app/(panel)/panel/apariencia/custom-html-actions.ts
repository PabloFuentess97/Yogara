'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requirePanelAuth } from '@/lib/panel-auth'

export async function updateBlocksAction(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const { org } = await requirePanelAuth()

  const blockIds = ['navbar', 'hero', 'clases', 'profesores', 'precios', 'testimonios', 'contacto', 'footer']
  const customBlocks: Record<string, string> = {}

  for (const blockId of blockIds) {
    const value = formData.get(`block_${blockId}`) as string | null
    if (value && value.trim() !== '') {
      customBlocks[blockId] = value.trim()
    }
  }

  const existingSettings = (org.settings as Record<string, any>) ?? {}
  const mergedSettings = { ...existingSettings, customBlocks }

  try {
    await prisma.organization.update({
      where: { id: org.id },
      data: { settings: mergedSettings },
    })
  } catch {
    return { success: false, error: 'Error al guardar los bloques personalizados' }
  }

  revalidatePath('/panel/apariencia')
  return { success: true, error: null }
}

export async function removeBlockAction(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const { org } = await requirePanelAuth()

  const blockId = formData.get('blockId') as string | null
  if (!blockId) {
    return { success: false, error: 'Block ID requerido' }
  }

  const existingSettings = (org.settings as Record<string, any>) ?? {}
  const existingBlocks = existingSettings.customBlocks ?? {}

  const { [blockId]: _removed, ...remainingBlocks } = existingBlocks
  const mergedSettings = { ...existingSettings, customBlocks: remainingBlocks }

  try {
    await prisma.organization.update({
      where: { id: org.id },
      data: { settings: mergedSettings },
    })
  } catch {
    return { success: false, error: 'Error al eliminar el bloque' }
  }

  revalidatePath('/panel/apariencia')
  return { success: true, error: null }
}

// Keep backward compatibility
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
