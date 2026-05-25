import { prisma } from '@yogara/database'

export const alumnosService = {
  async listar(organizationId: string, options?: { search?: string; tag?: string }) {
    return prisma.organizationMember.findMany({
      where: {
        organizationId,
        role: 'STUDENT',
        status: 'ACTIVE',
        ...(options?.search && {
          user: {
            OR: [
              { name: { contains: options.search, mode: 'insensitive' } },
              { email: { contains: options.search, mode: 'insensitive' } },
            ],
          },
        }),
        ...(options?.tag && { tags: { has: options.tag } }),
      },
      include: {
        user: true,
        userMemberships: {
          where: { status: 'ACTIVE' },
          include: { membership: true },
        },
      },
      orderBy: { user: { name: 'asc' } },
    })
  },

  async obtenerPorId(id: string, organizationId: string) {
    return prisma.organizationMember.findFirst({
      where: { id, organizationId },
      include: {
        user: true,
        userMemberships: {
          include: { membership: true },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          include: { classSession: { include: { classType: true } } },
          orderBy: { bookedAt: 'desc' },
          take: 20,
        },
      },
    })
  },
}
