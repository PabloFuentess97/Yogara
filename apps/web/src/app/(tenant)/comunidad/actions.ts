'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@yogara/database'
import { requireStudent } from '@/lib/student-auth'
import { comunidadService } from '@yogara/modules'
import { z } from 'zod'

const postSchema = z.object({
  content: z.string().min(1).max(2000),
})

const commentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

export async function crearPostAction(formData: FormData) {
  const { memberId, organizationId } = await requireStudent()

  const parsed = postSchema.safeParse({
    content: formData.get('content') as string,
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Contenido no válido' }
  }

  const result = await comunidadService.crearPost(
    parsed.data.content,
    [],
    memberId,
    organizationId,
  )

  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/comunidad')
  return { success: true }
}

export async function toggleLikeAction(postId: string) {
  const { memberId, organizationId } = await requireStudent()

  const result = await comunidadService.toggleLike(postId, memberId, organizationId)
  if (!result.success) {
    return { error: result.error }
  }

  revalidatePath('/comunidad')
  return { success: true, liked: result.data.liked }
}

export async function crearComentarioAction(formData: FormData) {
  const { memberId, organizationId } = await requireStudent()

  const parsed = commentSchema.safeParse({
    postId: formData.get('postId') as string,
    content: formData.get('content') as string,
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Comentario no válido' }
  }

  await prisma.communityComment.create({
    data: {
      organizationId,
      postId: parsed.data.postId,
      authorId: memberId,
      content: parsed.data.content,
    },
  })

  await prisma.communityPost.update({
    where: { id: parsed.data.postId },
    data: { commentsCount: { increment: 1 } },
  })

  revalidatePath('/comunidad')
  return { success: true }
}
