'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { horariosService, crearHorarioSchema } from '@yogara/modules'

export async function crearHorarioAction(formData: FormData) {
  const { organizationId } = await requireAdmin()

  const raw = {
    classTypeId: formData.get('classTypeId') as string,
    instructorId: formData.get('instructorId') as string,
    roomId: formData.get('roomId') as string,
    dayOfWeek: Number(formData.get('dayOfWeek')),
    startTime: formData.get('startTime') as string,
    endTime: formData.get('endTime') as string,
    capacity: Number(formData.get('capacity')),
    validFrom: new Date(),
  }

  const parsed = crearHorarioSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Datos no válidos' }
  }

  const result = await horariosService.crear(parsed.data, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/admin/horarios')
  return { success: true }
}

export async function generarSesionesAction() {
  const { organizationId } = await requireAdmin()

  const result = await horariosService.generarSesiones(organizationId, 4)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/admin/horarios')
  return { success: true, count: result.data.count }
}
