'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requirePanelAuth } from '@/lib/panel-auth'

const VALID_THEMES = ['zen-minimal', 'organic-flow', 'luxury-dark'] as const

export async function updateThemeAction(formData: FormData) {
  const { org } = await requirePanelAuth()

  const themeId = formData.get('themeId') as string

  if (!VALID_THEMES.includes(themeId as (typeof VALID_THEMES)[number])) {
    return { error: 'Tema no válido' }
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: { themeId },
  })

  revalidatePath('/panel/apariencia')
  return { success: true }
}
