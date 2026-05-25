import { NextResponse } from 'next/server'
import { prisma } from '@yogara/database'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isPlatformAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const themes = await prisma.customTheme.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      previewUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { organizations: true } },
    },
  })

  return NextResponse.json({ themes })
}
