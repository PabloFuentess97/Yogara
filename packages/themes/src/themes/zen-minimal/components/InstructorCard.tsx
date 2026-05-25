import type { InstructorCardProps } from '../../../engine/types'

export function InstructorCard({ name, avatarUrl, bio }: InstructorCardProps) {
  return (
    <div className="text-center group">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-stone-100 ring-4 ring-stone-50 group-hover:ring-stone-200 transition-all">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-stone-400">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-stone-900">{name}</h3>
      {bio && <p className="text-sm text-stone-600 mt-1 max-w-xs mx-auto">{bio}</p>}
    </div>
  )
}
