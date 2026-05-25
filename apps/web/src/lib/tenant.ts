import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { prisma } from '@yogara/database'

const includeCustomTheme = {
  customTheme: {
    select: {
      id: true,
      name: true,
      slug: true,
      config: true,
      navbar: true,
      hero: true,
      about: true,
      clases: true,
      profesores: true,
      precios: true,
      testimonios: true,
      contacto: true,
      footer: true,
      classesHeader: true,
      headHtml: true,
    },
  },
}

export async function resolveTenant() {
  const headersList = await headers()
  const slug = headersList.get('x-tenant-slug')
  const customDomain = headersList.get('x-custom-domain')

  if (slug) {
    const org = await prisma.organization.findFirst({
      where: { slug, isActive: true },
      include: includeCustomTheme,
    })
    if (!org) notFound()
    return org
  }

  if (customDomain) {
    const domain = await prisma.customDomain.findFirst({
      where: { domain: customDomain, verified: true },
      include: { organization: { include: includeCustomTheme } },
    })
    if (!domain || !domain.organization.isActive) notFound()
    return domain.organization
  }

  // Development fallback: use the first active org
  if (process.env.NODE_ENV === 'development') {
    const org = await prisma.organization.findFirst({
      where: { isActive: true },
      include: includeCustomTheme,
    })
    if (org) return org
  }

  notFound()
}
