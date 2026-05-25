import { prisma } from '@yogara/database'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ThemeUploader } from './theme-uploader'
import { ThemeList } from './theme-list'
import { ThemeAssigner } from './theme-assigner'

export const dynamic = 'force-dynamic'

export default async function TemasPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isPlatformAdmin) redirect('/panel')

  const themes = await prisma.customTheme.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { organizations: true } },
    },
  })

  const organizations = await prisma.organization.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      customThemeId: true,
      customTheme: { select: { id: true, name: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Temas Personalizados</h1>
        <p className="text-stone-600 mt-1">
          Sube temas en ZIP y asígnalos a centros
        </p>
      </div>

      <ThemeUploader />

      <ThemeList themes={themes} />

      <ThemeAssigner organizations={organizations} themes={themes} />
    </div>
  )
}
