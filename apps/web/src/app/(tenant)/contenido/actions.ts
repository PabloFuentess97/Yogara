'use server'

import { prisma } from '@yogara/database'

export async function incrementViewAction(contentId: string) {
  await prisma.onlineContent.update({
    where: { id: contentId },
    data: { viewsCount: { increment: 1 } },
  })
}
