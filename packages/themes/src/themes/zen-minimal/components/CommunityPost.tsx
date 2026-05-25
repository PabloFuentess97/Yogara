'use client'

import type { CommunityPostProps } from '../../../engine/types'

export function CommunityPost({
  authorName,
  authorAvatar,
  content,
  imageUrls,
  likesCount,
  commentsCount,
  createdAt,
  isLiked,
}: CommunityPostProps) {
  const timeAgo = getTimeAgo(createdAt)

  return (
    <article className="bg-white rounded-2xl border border-stone-100 p-5">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden flex-shrink-0">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-medium text-stone-500">
              {authorName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-stone-900 text-sm">{authorName}</p>
          <p className="text-xs text-stone-500">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap mb-4">{content}</p>

      {/* Images */}
      {imageUrls.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img src={imageUrls[0]} alt="" className="w-full h-64 object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-stone-50">
        <button className={`flex items-center gap-1.5 text-sm ${isLiked ? 'text-red-500' : 'text-stone-500 hover:text-stone-700'} transition-colors`}>
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{likesCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors">
          <span>💬</span>
          <span>{commentsCount}</span>
        </button>
      </div>
    </article>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'Ahora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
