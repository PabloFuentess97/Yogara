import Link from 'next/link'
import type { ClassCardProps } from '../../../engine/types'

export function ClassCard({ id, name, description, durationMinutes, level, imageUrl, color }: ClassCardProps) {
  return (
    <Link
      href={`/clases/${id}`}
      className="group block bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-48 bg-stone-50 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ backgroundColor: color ?? '#8B7355' }}
            />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-stone-700 shadow-sm">
            {durationMinutes} min
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color ?? '#8B7355' }} />
          <h3 className="font-semibold text-stone-900">{name}</h3>
        </div>
        {description && (
          <p className="text-sm text-stone-600 line-clamp-2 mb-3">{description}</p>
        )}
        <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">{level}</span>
      </div>
    </Link>
  )
}
