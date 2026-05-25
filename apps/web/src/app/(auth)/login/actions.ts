'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { headers } from 'next/headers'
import { prisma } from '@yogara/database'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const headersList = await headers()
  const slug = headersList.get('x-tenant-slug')

  let redirectTo = '/'
  if (!slug) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { memberships: { where: { role: 'ORG_ADMIN' }, take: 1, include: { organization: true } } },
    })
    if (user?.memberships[0]) {
      const orgSlug = user.memberships[0].organization.slug
      const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'yogara.app'
      redirectTo = `https://${orgSlug}.${domain}/admin`
    } else {
      redirectTo = '/onboarding'
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o contraseña incorrectos' }
    }
    throw error
  }
}
