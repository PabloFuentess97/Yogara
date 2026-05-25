import Link from 'next/link'
import type { ClassCardProps } from '../../../engine/types'

export function ClassCard({ id, name, description, durationMinutes, level, imageUrl, color }: ClassCardProps) {
  return (
    <Link
      href={`/clases/${id}`}
      className="group block bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
    >
      <div className="h-52 bg-[#111111] relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
            <div
              className="w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ backgroundColor: color ?? '#D4AF37' }}
            />
          </div>
        )}
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        {/* Duration badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 bg-[#0A0A0A]/80 backdrop-blur-sm text-[#D4AF37] text-xs font-light tracking-wide border border-[#D4AF37]/20">
            {durationMinutes} min
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: color ?? '#D4AF37' }} />
          <h3
            className="text-lg text-[#F5F5F5] font-light tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {name}
          </h3>
        </div>
        {description && (
          <p className="text-sm text-[#9CA3AF] line-clamp-2 mb-4 font-light leading-relaxed">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#D4AF37]/70 font-light uppercase tracking-[0.2em]">{level}</span>
          <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wide">
            Ver detalle &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
