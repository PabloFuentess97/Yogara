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

// All branding field keys that map to nested objects
const NESTED_PREFIXES = [
  'brand',
  'hero',
  'colors',
  'sections.about',
  'contact',
  'socialMedia',
  'seo',
] as const

function setNestedValue(obj: Record<string, any>, path: string, value: string) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}
    }
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
}

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

export async function updateBrandingAction(formData: FormData) {
  const { org } = await requirePanelAuth()

  // Build a nested object from all form fields
  const newSettings: Record<string, any> = {}

  // All known field paths
  const fieldPaths = [
    'brand.logoUrl',
    'brand.name',
    'heroTitle',
    'heroSubtitle',
    'heroImage',
    'hero.ctaText',
    'hero.ctaLink',
    'colors.primary',
    'colors.secondary',
    'colors.accent',
    'colors.background',
    'colors.text',
    'sections.about.title',
    'sections.about.description',
    'sections.about.imageUrl',
    'contact.address',
    'contact.phone',
    'contact.email',
    'contact.mapUrl',
    'socialMedia.instagram',
    'socialMedia.facebook',
    'socialMedia.youtube',
    'socialMedia.whatsapp',
    'seo.title',
    'seo.description',
  ]

  for (const path of fieldPaths) {
    const value = formData.get(path) as string | null
    if (value !== null) {
      setNestedValue(newSettings, path, value)
    }
  }

  // Merge with existing settings (don't lose data like testimonios, etc.)
  const existingSettings = (org.settings as Record<string, any>) ?? {}
  const mergedSettings = deepMerge(existingSettings, newSettings)

  await prisma.organization.update({
    where: { id: org.id },
    data: { settings: mergedSettings },
  })

  revalidatePath('/panel/apariencia')
  return { success: true }
}
