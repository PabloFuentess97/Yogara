import { prisma } from '@yogara/database'
import type { ActionResult } from '../types'

export const comunidadService = {
  async listarPosts(organizationId: string, cursor?: string, limit = 20) {
    return prisma.communityPost.findMany({
      where: { organizationId, isVisible: true, deletedAt: null },
      include: {
        author: { include: { user: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    })
  },

  async crearPost(
    content: string,
    imageUrls: string[],
    authorId: string,
    organizationId: string,
  ): Promise<ActionResult<{ id: string }>> {
    const post = await prisma.communityPost.create({
      data: { organizationId, authorId, content, imageUrls },
    })
    return { success: true, data: { id: post.id } }
  },

  async toggleLike(
    postId: string,
    memberId: string,
    organizationId: string,
  ): Promise<ActionResult<{ liked: boolean }>> {
    const existingLike = await prisma.communityLike.findUnique({
      where: { postId_memberId: { postId, memberId } },
    })

    if (existingLike) {
      await prisma.communityLike.delete({ where: { id: existingLike.id } })
      await prisma.communityPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      })
      return { success: true, data: { liked: false } }
    }

    await prisma.communityLike.create({
      data: { organizationId, postId, memberId },
    })
    await prisma.communityPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    })
    return { success: true, data: { liked: true } }
  },
}
