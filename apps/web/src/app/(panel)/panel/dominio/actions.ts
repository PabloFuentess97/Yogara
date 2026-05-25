'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requirePanelAuth } from '@/lib/panel-auth'
import { z } from 'zod'

const slugSchema = z
  .string()
  .min(3, 'El subdominio debe tener al menos 3 caracteres')
  .max(30, 'El subdominio no puede tener más de 30 caracteres')
  .regex(
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    'Solo letras minúsculas, números y guiones (no puede empezar ni terminar con guión)'
  )

const domainSchema = z
  .string()
  .min(4, 'El dominio no es válido')
  .max(253, 'El dominio es demasiado largo')
  .regex(
    /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/,
    'Introduce un dominio válido (ej: miweb.com)'
  )

export async function updateSlugAction(formData: FormData) {
  const { org } = await requirePanelAuth()

  const raw = (formData.get('slug') as string)?.trim().toLowerCase()
  const parsed = slugSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Subdominio no válido' }
  }

  const newSlug = parsed.data

  if (newSlug === org.slug) {
    return { error: 'El subdominio es el mismo que el actual' }
  }

  const existing = await prisma.organization.findUnique({
    where: { slug: newSlug },
  })

  if (existing) {
    return { error: 'Este subdominio ya está en uso' }
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: { slug: newSlug },
  })

  revalidatePath('/panel/dominio')
  return { success: true }
}

export async function addCustomDomainAction(formData: FormData) {
  const { org } = await requirePanelAuth()

  const raw = (formData.get('domain') as string)?.trim().toLowerCase()
  const parsed = domainSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dominio no válido' }
  }

  const domain = parsed.data

  const existing = await prisma.customDomain.findUnique({
    where: { domain },
  })

  if (existing) {
    return { error: 'Este dominio ya está registrado' }
  }

  await prisma.customDomain.create({
    data: {
      domain,
      organizationId: org.id,
      verified: false,
    },
  })

  revalidatePath('/panel/dominio')
  return { success: true }
}

export async function removeCustomDomainAction(formData: FormData) {
  const { org } = await requirePanelAuth()

  const id = formData.get('id') as string

  if (!id) {
    return { error: 'ID de dominio no proporcionado' }
  }

  const existing = await prisma.customDomain.findFirst({
    where: { id, organizationId: org.id },
  })

  if (!existing) {
    return { error: 'Dominio no encontrado' }
  }

  await prisma.customDomain.delete({
    where: { id },
  })

  revalidatePath('/panel/dominio')
  return { success: true }
}
