import { prisma } from '@yogara/database'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminComunidadPage() {
  const { organizationId } = await requireAdmin()

  const [posts, totalPosts, totalComments] = await Promise.all([
    prisma.communityPost.findMany({
      where: { organizationId },
      include: {
        author: { include: { user: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.communityPost.count({ where: { organizationId } }),
    prisma.communityComment.count({ where: { organizationId } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Comunidad</h1>
        <div className="flex items-center gap-4 text-sm text-stone-500">
          <span>{totalPosts} publicaciones</span>
          <span>{totalComments} comentarios</span>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No hay publicaciones en la comunidad.</p>
          <p className="text-sm text-stone-400 mt-1">
            Los alumnos podrán compartir experiencias y conectar entre sí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
                  {post.author.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{post.author.user.name}</p>
                  <p className="text-xs text-stone-500">
                    {post.createdAt.toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-stone-700 line-clamp-3">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
                <span>{post._count.likes} likes</span>
                <span>{post._count.comments} comentarios</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
