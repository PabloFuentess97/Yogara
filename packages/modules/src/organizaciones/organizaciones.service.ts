import { prisma } from '@yogara/database'

export const organizacionesService = {
  async obtenerPorSlug(slug: string) {
    return prisma.organization.findFirst({
      where: { slug, isActive: true, deletedAt: null },
    })
  },

  async obtenerPorDominio(domain: string) {
    const customDomain = await prisma.customDomain.findFirst({
      where: { domain, verified: true },
      include: { organization: true },
    })
    return customDomain?.organization ?? null
  },

  async listarTodas() {
    return prisma.organization.findMany({
      where: { deletedAt: null },
      include: {
        subscriptionPlan: true,
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}
