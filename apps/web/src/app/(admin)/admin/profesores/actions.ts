'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email('Email no válido'),
  name: z.string().min(2, 'Nombre requerido (mínimo 2 caracteres)').max(100),
})

export async function inviteInstructorAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    name: (formData.get('name') as string)?.trim(),
  }

  const parsed = inviteSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const { email, name } = parsed.data

  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // Create user with just email and name
    user = await prisma.user.create({
      data: { email, name },
    })
  }

  // Check if already a member of this org
  const existingMember = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId: user.id } },
  })

  if (existingMember) {
    if (existingMember.role === 'INSTRUCTOR' && existingMember.status === 'ACTIVE') {
      return { error: 'Este usuario ya es profesor en tu organización' }
    }
    // Update existing member to INSTRUCTOR role and ACTIVE status
    await prisma.organizationMember.update({
      where: { id: existingMember.id },
      data: { role: 'INSTRUCTOR', status: 'ACTIVE' },
    })
  } else {
    // Create new membership
    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: user.id,
        role: 'INSTRUCTOR',
        status: 'ACTIVE',
      },
    })
  }

  revalidatePath('/admin/profesores')
  return { success: true }
}

const removeSchema = z.object({
  memberId: z.string().uuid('ID de miembro no válido'),
})

export async function removeInstructorAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = { memberId: formData.get('memberId') as string }
  const parsed = removeSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const { memberId } = parsed.data

  // Verify the member belongs to this org and is an instructor
  const member = await prisma.organizationMember.findFirst({
    where: { id: memberId, organizationId, role: 'INSTRUCTOR' },
  })

  if (!member) {
    return { error: 'Profesor no encontrado' }
  }

  // Check if instructor has active schedules
  const activeSchedules = await prisma.schedule.count({
    where: { instructorId: memberId, isActive: true },
  })

  if (activeSchedules > 0) {
    return { error: 'No se puede quitar: tiene horarios activos asignados. Reasígnalos primero.' }
  }

  // Set status to INACTIVE instead of deleting
  await prisma.organizationMember.update({
    where: { id: memberId },
    data: { status: 'INACTIVE' },
  })

  revalidatePath('/admin/profesores')
  return { success: true }
}
