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
      className={`relative bg-[#1A1A1A] p-8 flex flex-col transition-all duration-500 ${
        isPopular
          ? 'border border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.15)] scale-[1.03]'
          : 'border border-[#2A2A2A] hover:border-[#D4AF37]/30'
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#D4AF37] text-[#0A0A0A] text-xs font-medium tracking-wider uppercase">
          Recomendado
        </span>
      )}

      {/* Gold corner accents for popular */}
      {isPopular && (
        <>
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />
        </>
      )}

      <h3
        className="text-xl text-[#F5F5F5] font-light tracking-wide"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        {name}
      </h3>
      {description && <p className="text-sm text-[#9CA3AF] mt-2 font-light">{description}</p>}

      <div className="my-6 pb-6 border-b border-[#2A2A2A]">
        <span className="text-4xl font-light text-[#D4AF37]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {formatPrice()}
        </span>
        <span className="text-[#9CA3AF] text-sm font-light">{formatPeriod()}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {type === 'UNLIMITED' && (
          <li className="flex items-center gap-3 text-sm text-[#9CA3AF] font-light">
            <span className="text-[#D4AF37]">&#10003;</span> Clases ilimitadas
          </li>
        )}
        {type === 'CLASS_PACK' && classLimit && (
          <li className="flex items-center gap-3 text-sm text-[#9CA3AF] font-light">
            <span className="text-[#D4AF37]">&#10003;</span> {classLimit} clases
          </li>
        )}
        {durationDays && (
          <li className="flex items-center gap-3 text-sm text-[#9CA3AF] font-light">
            <span className="text-[#D4AF37]">&#10003;</span> Valido {durationDays} dias
          </li>
        )}
        {!durationDays && type === 'CLASS_PACK' && (
          <li className="flex items-center gap-3 text-sm text-[#9CA3AF] font-light">
            <span className="text-[#D4AF37]">&#10003;</span> Sin caducidad
          </li>
        )}
        <li className="flex items-center gap-3 text-sm text-[#9CA3AF] font-light">
          <span className="text-[#D4AF37]">&#10003;</span> Acceso a comunidad
        </li>
      </ul>

      <button
        className={`w-full py-3.5 font-light text-sm tracking-wider uppercase transition-all duration-300 ${
          isPopular
            ? 'bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F5E6C8] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            : 'border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]'
        }`}
      >
        Elegir plan
      </button>
    </div>
  )
}
