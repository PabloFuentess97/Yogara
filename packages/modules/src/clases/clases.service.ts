import { prisma } from '@yogara/database'
import type { ActionResult } from '../types'
import type { CrearClaseInput, ActualizarClaseInput } from './clases.schema'

export const clasesService = {
  async listar(organizationId: string) {
    return prisma.classType.findMany({
      where: { organizationId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async obtenerPorId(id: string, organizationId: string) {
    return prisma.classType.findFirst({
      where: { id, organizationId },
    })
  },

  async obtenerPorSlug(slug: string, organizationId: string) {
    return prisma.classType.findFirst({
      where: { slug, organizationId },
    })
  },

  async crear(
    input: CrearClaseInput,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const existing = await prisma.classType.findFirst({
      where: { organizationId, slug: input.slug },
    })

    if (existing) {
      return { success: false, error: 'Ya existe una clase con ese slug' }
    }

    const classType = await prisma.classType.create({
      data: { ...input, organizationId },
    })

    return { success: true, data: { id: classType.id } }
  },

  async actualizar(
    input: ActualizarClaseInput,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const { id, ...data } = input

    const existing = await prisma.classType.findFirst({
      where: { id, organizationId },
    })

    if (!existing) {
      return { success: false, error: 'Tipo de clase no encontrado' }
    }

    await prisma.classType.update({
      where: { id },
      data,
    })

    return { success: true, data: { id } }
  },

  async eliminar(
    id: string,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const existing = await prisma.classType.findFirst({
      where: { id, organizationId },
    })

    if (!existing) {
      return { success: false, error: 'Tipo de clase no encontrado' }
    }

    await prisma.classType.update({
      where: { id },
      data: { isActive: false },
    })

    return { success: true, data: { id } }
  },
}
