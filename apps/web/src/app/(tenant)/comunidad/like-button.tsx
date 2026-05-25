'use client'

import { useState } from 'react'
import { toggleLikeAction } from './actions'

interface LikeButtonProps {
  postId: string
  count: number
  liked: boolean
  isLoggedIn: boolean
}

export function LikeButton({ postId, count, liked, isLoggedIn }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked)
  const [likeCount, setLikeCount] = useState(count)
  const [loading, setLoading] = useState(false)

  if (!isLoggedIn) {
    return (
      <span className="text-sm text-stone-500">
        {likeCount} likes
      </span>
    )
  }

  return (
    <button
      onClick={async () => {
        setLoading(true)
        const result = await toggleLikeAction(postId)
        setLoading(false)
        if (result.liked !== undefined) {
          setIsLiked(result.liked)
          setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1))
        }
      }}
      disabled={loading}
      className={`text-sm transition-colors disabled:opacity-50 ${
        isLiked ? 'text-red-500 font-medium' : 'text-stone-500 hover:text-red-500'
      }`}
    >
      {isLiked ? '♥' : '♡'} {likeCount}
    </button>
  )
}
