'use server'

import { prisma } from '@yogara/database'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const onboardingSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(30, 'El slug debe tener máximo 30 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  theme: z.enum(['zen-minimal', 'organic-flow', 'luxury-dark']),
})

export async function createOrganizationAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' }
  }

  const rawData = {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string)?.toLowerCase().trim(),
    theme: formData.get('theme') as string,
  }

  const parsed = onboardingSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const { name, slug, theme } = parsed.data

  const existing = await prisma.organization.findUnique({ where: { slug } })
  if (existing) {
    return { error: 'Ese slug ya está en uso. Elige otro.' }
  }

  const userEmail = session.user.email ?? ''

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      email: userEmail,
      themeId: theme,
      isActive: true,
      subscriptionStatus: 'TRIALING',
    },
  })

  await prisma.organizationMember.create({
    data: {
      organizationId: org.id,
      userId: session.user.id,
      role: 'ORG_ADMIN',
    },
  })

  redirect('/panel')
}
