import type { Metadata } from 'next'
import { prisma } from '@yogara/database'
import { resolveTenant } from '@/lib/tenant'
import { optionalStudent } from '@/lib/student-auth'

export const metadata: Metadata = {
  title: 'Comunidad',
  description: 'Comparte tu práctica con la comunidad',
}
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { CreatePostForm } from './create-post-form'
import { LikeButton } from './like-button'
import { CommentSection } from './comment-section'

export const dynamic = 'force-dynamic'

export default async function ComunidadPage() {
  const org = await resolveTenant()
  const student = await optionalStudent()

  const posts = await prisma.communityPost.findMany({
    where: { organizationId: org.id, isVisible: true, deletedAt: null },
    include: {
      author: { include: { user: true } },
      comments: {
        where: { isVisible: true, deletedAt: null },
        include: { author: { include: { user: true } } },
        orderBy: { createdAt: 'asc' },
        take: 5,
      },
      ...(student && {
        likes: {
          where: { memberId: student.memberId },
          take: 1,
        },
      }),
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    take: 20,
  })

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-stone-900 mb-2">
        Comunidad
      </h1>
      <p className="text-stone-600 mb-8">Comparte tu práctica con la comunidad</p>

      {student && <CreatePostForm />}

      {!student && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 text-center mb-6">
          <p className="text-stone-500 text-sm">
            <a href="/login" className="font-medium text-stone-900 hover:underline">
              Inicia sesión
            </a>{' '}
            para participar en la comunidad.
          </p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">Aún no hay publicaciones. ¡Sé el primero!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const hasLiked = 'likes' in post && Array.isArray(post.likes) && post.likes.length > 0
            return (
              <article
                key={post.id}
                className="bg-white rounded-xl border border-stone-200 p-5"
              >
                {post.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium mb-2">
                    Fijado
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
                    {post.author.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {post.author.user.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-stone-700 whitespace-pre-line mb-4">{post.content}</p>

                <div className="flex items-center gap-4 mb-3">
                  <LikeButton
                    postId={post.id}
                    count={post._count.likes}
                    liked={hasLiked}
                    isLoggedIn={!!student}
                  />
                  <span className="text-sm text-stone-500">
                    {post._count.comments} comentarios
                  </span>
                </div>

                <CommentSection
                  postId={post.id}
                  comments={post.comments.map((c) => ({
                    id: c.id,
                    content: c.content,
                    authorName: c.author.user.name,
                    createdAt: c.createdAt.toISOString(),
                  }))}
                  isLoggedIn={!!student}
                />
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
