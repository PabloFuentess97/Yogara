import type { MembershipCardProps } from '../../../engine/types'

export function MembershipCard({
  name,
  description,
  price,
  currency,
  type,
  durationDays,
  classLimit,
  isPopular,
}: MembershipCardProps) {
  const formatPrice = () => {
    if (price === 0) return 'Gratis'
    return `${price}${currency === 'EUR' ? '€' : currency}`
  }

  const formatPeriod = () => {
    if (type === 'UNLIMITED' && durationDays) return `/${durationDays === 30 ? 'mes' : `${durationDays} dias`}`
    if (type === 'CLASS_PACK') return ''
    return ''
  }

  return (
    <div
      className={`relative bg-white rounded-3xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        isPopular
          ? 'border-2 border-[#5B7A5E] shadow-xl shadow-[#5B7A5E]/10 scale-[1.02]'
          : 'border border-[#E8D5B7]/50 shadow-sm hover:shadow-lg'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-2xl bg-[#5B7A5E] text-white text-xs font-medium shadow-sm">
          Mas popular
        </span>
      )}

      {/* Decorative top shape */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
        <div
          className={`absolute -top-10 -right-10 w-20 h-20 rounded-full ${
            isPopular ? 'bg-[#5B7A5E]/10' : 'bg-[#E8D5B7]/30'
          }`}
        />
      </div>

      <h3 className="font-serif text-xl font-semibold text-[#2D2D2D]">{name}</h3>
      {description && <p className="text-sm text-[#7A7A7A] mt-2 leading-relaxed">{description}</p>}

      <div className="my-6">
        <span className="text-4xl font-bold text-[#2D2D2D]">{formatPrice()}</span>
        <span className="text-[#7A7A7A] text-sm ml-1">{formatPeriod()}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {type === 'UNLIMITED' && (
          <li className="flex items-center gap-3 text-sm text-[#2D2D2D]">
            <div className="w-5 h-5 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Clases ilimitadas
          </li>
        )}
        {type === 'CLASS_PACK' && classLimit && (
          <li className="flex items-center gap-3 text-sm text-[#2D2D2D]">
            <div className="w-5 h-5 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {classLimit} clases
          </li>
        )}
        {durationDays && (
          <li className="flex items-center gap-3 text-sm text-[#2D2D2D]">
            <div className="w-5 h-5 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Valido {durationDays} dias
          </li>
        )}
        {!durationDays && type === 'CLASS_PACK' && (
          <li className="flex items-center gap-3 text-sm text-[#2D2D2D]">
            <div className="w-5 h-5 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Sin caducidad
          </li>
        )}
        <li className="flex items-center gap-3 text-sm text-[#2D2D2D]">
          <div className="w-5 h-5 rounded-full bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Acceso a comunidad
        </li>
      </ul>

      <button
        className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all ${
          isPopular
            ? 'bg-[#5B7A5E] text-white hover:bg-[#4A6A4D] shadow-sm hover:shadow-lg hover:shadow-[#5B7A5E]/20'
            : 'border-2 border-[#5B7A5E]/20 text-[#5B7A5E] hover:bg-[#5B7A5E]/5'
        }`}
      >
        Elegir plan
      </button>
    </div>
  )
}
