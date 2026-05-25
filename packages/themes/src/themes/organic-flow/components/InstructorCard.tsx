import type { InstructorCardProps } from '../../../engine/types'

export function InstructorCard({ name, avatarUrl, bio }: InstructorCardProps) {
  return (
    <div className="group text-center">
      {/* Avatar with organic shape */}
      <div className="relative w-36 h-36 mx-auto mb-5">
        <div className="absolute inset-0 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] bg-[#E8D5B7]/50 group-hover:bg-[#5B7A5E]/20 transition-colors duration-500 transform group-hover:rotate-6 transition-transform" />
        <div className="absolute inset-2 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] overflow-hidden bg-[#F5F0EB]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-[#5B7A5E]">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <h3 className="font-serif text-lg font-semibold text-[#2D2D2D] group-hover:text-[#5B7A5E] transition-colors">
        {name}
      </h3>
      {bio && (
        <p className="text-sm text-[#7A7A7A] mt-2 max-w-xs mx-auto leading-relaxed">{bio}</p>
      )}
    </div>
  )
}
