import type { InstructorCardProps } from '../../../engine/types'

export function InstructorCard({ name, avatarUrl, bio }: InstructorCardProps) {
  return (
    <div className="text-center group">
      <div className="w-36 h-36 mx-auto mb-5 rounded-full overflow-hidden bg-[#1A1A1A] ring-2 ring-[#2A2A2A] group-hover:ring-[#D4AF37]/50 transition-all duration-500 relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-[#D4AF37]/50 font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {name.charAt(0)}
          </div>
        )}
        {/* Gold glow on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]" />
      </div>
      <h3
        className="text-lg text-[#F5F5F5] font-light tracking-wide"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        {name}
      </h3>
      {bio && (
        <p className="text-sm text-[#9CA3AF] mt-2 max-w-xs mx-auto font-light leading-relaxed">{bio}</p>
      )}
    </div>
  )
}
