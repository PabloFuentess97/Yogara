'use client'

import { useState, useRef, useActionState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { crearComentarioAction } from './actions'

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: string
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  isLoggedIn: boolean
}

export function CommentSection({ postId, comments, isLoggedIn }: CommentSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await crearComentarioAction(formData)
      if (result.success) {
        formRef.current?.reset()
      }
      return result
    },
    undefined
  )

  const visibleComments = showAll ? comments : comments.slice(0, 2)
  const hasMore = comments.length > 2 && !showAll

  return (
    <div className="border-t border-stone-100 pt-3">
      {visibleComments.length > 0 && (
        <div className="space-y-2 mb-3">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-medium text-stone-500 shrink-0 mt-0.5">
                {comment.authorName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium text-stone-900">{comment.authorName}</span>{' '}
                  <span className="text-stone-700">{comment.content}</span>
                </p>
                <p className="text-xs text-stone-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm text-stone-500 hover:text-stone-900 mb-3"
        >
          Ver todos los comentarios
        </button>
      )}

      {isLoggedIn && (
        <form ref={formRef} action={formAction} className="flex gap-2">
          <input type="hidden" name="postId" value={postId} />

          {state?.error && (
            <p className="text-xs text-red-600">{state.error}</p>
          )}

          <input
            name="content"
            required
            placeholder="Escribe un comentario..."
            className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {pending ? '...' : 'Enviar'}
          </button>
        </form>
      )}
    </div>
  )
}
