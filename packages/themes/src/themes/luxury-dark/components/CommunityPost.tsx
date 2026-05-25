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
    <article className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 hover:border-[#D4AF37]/20 transition-all duration-300">
      {/* Author */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-[#0A0A0A] overflow-hidden flex-shrink-0 ring-1 ring-[#2A2A2A]">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-light text-[#D4AF37]">
              {authorName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-light text-[#F5F5F5] text-sm tracking-wide">{authorName}</p>
          <p className="text-xs text-[#9CA3AF]/60 font-light">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-[#9CA3AF] text-sm leading-relaxed whitespace-pre-wrap mb-5 font-light">{content}</p>

      {/* Images */}
      {imageUrls.length > 0 && (
        <div className="mb-5 overflow-hidden border border-[#2A2A2A]">
          <img src={imageUrls[0]} alt="" className="w-full h-64 object-cover opacity-90 hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-8 pt-4 border-t border-[#2A2A2A]">
        <button className={`flex items-center gap-2 text-sm font-light transition-colors duration-300 ${isLiked ? 'text-[#D4AF37]' : 'text-[#9CA3AF]/60 hover:text-[#D4AF37]'}`}>
          <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span>{likesCount}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-[#9CA3AF]/60 hover:text-[#D4AF37] font-light transition-colors duration-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
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
