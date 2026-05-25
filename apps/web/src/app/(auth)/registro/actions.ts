'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@yogara/database'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { headers } from 'next/headers'
import { z } from 'zod'
import { sendEmail, welcomeTemplate } from '@yogara/email'

const registroSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email no válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export async function registroAction(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = registroSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const { name, email, password } = parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: 'Ya existe una cuenta con este email' }
  }

  const passwordHash = await hash(password, 12)

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      emailVerified: new Date(),
    },
  })

  const headersList = await headers()
  const slug = headersList.get('x-tenant-slug')
  const org = slug
    ? await prisma.organization.findUnique({
        where: { slug },
        include: { customDomains: { where: { verified: true }, take: 1 } },
      })
    : null

  const orgName = org?.name ?? 'Yogara'
  const customDomain = org?.customDomains[0]?.domain
  const loginUrl = customDomain
    ? `https://${customDomain}`
    : slug
      ? `https://${slug}.yogara.app`
      : 'https://yogara.app'

  const template = welcomeTemplate({ userName: name, orgName, loginUrl })
  sendEmail({ to: email, ...template }).catch(() => {})

  const redirectTo = slug ? '/' : '/onboarding'

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Cuenta creada. Por favor inicia sesión.' }
    }
    throw error
  }
}
