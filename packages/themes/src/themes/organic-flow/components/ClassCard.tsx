import Link from 'next/link'
import type { ClassCardProps } from '../../../engine/types'

export function ClassCard({ id, name, description, durationMinutes, level, imageUrl, color }: ClassCardProps) {
  return (
    <Link
      href={`/clases/${id}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#E8D5B7]/30"
    >
      <div className="h-52 bg-[#F5F0EB] relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Decorative organic shapes */}
            <div
              className="absolute w-32 h-32 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              style={{ backgroundColor: color ?? '#5B7A5E' }}
            />
            <div
              className="absolute w-20 h-20 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] opacity-10 translate-x-10 -translate-y-5"
              style={{ backgroundColor: color ?? '#C47D4E' }}
            />
            {/* Leaf icon */}
            <svg className="relative w-10 h-10 opacity-40" style={{ color: color ?? '#5B7A5E' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
            </svg>
          </div>
        )}
        {/* Duration badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-sm text-xs font-medium text-[#2D2D2D] shadow-sm">
            {durationMinutes} min
          </span>
        </div>
        {/* Level badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1.5 rounded-2xl bg-[#5B7A5E]/90 backdrop-blur-sm text-xs font-medium text-white">
            {level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color ?? '#5B7A5E' }}
          />
          <h3 className="font-serif text-lg font-semibold text-[#2D2D2D] group-hover:text-[#5B7A5E] transition-colors">
            {name}
          </h3>
        </div>
        {description && (
          <p className="text-sm text-[#7A7A7A] line-clamp-2 leading-relaxed">{description}</p>
        )}
      </div>
    </Link>
  )
}
