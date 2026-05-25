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
    <article className="bg-white rounded-3xl border border-[#E8D5B7]/30 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-[#F5F0EB] overflow-hidden flex-shrink-0">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-serif font-medium text-[#5B7A5E]">
              {authorName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-[#2D2D2D] text-sm">{authorName}</p>
          <p className="text-xs text-[#7A7A7A]">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-[#2D2D2D] text-sm leading-relaxed whitespace-pre-wrap mb-4">{content}</p>

      {/* Images */}
      {imageUrls.length > 0 && (
        <div className="mb-4 rounded-2xl overflow-hidden">
          <img src={imageUrls[0]} alt="" className="w-full h-64 object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-[#E8D5B7]/30">
        <button
          className={`flex items-center gap-2 text-sm transition-colors ${
            isLiked ? 'text-[#C47D4E]' : 'text-[#7A7A7A] hover:text-[#C47D4E]'
          }`}
        >
          <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium">{likesCount}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#5B7A5E] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">{commentsCount}</span>
        </button>
        <button className="ml-auto text-[#7A7A7A] hover:text-[#5B7A5E] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
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
