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
    if (type === 'UNLIMITED' && durationDays) return `/${durationDays === 30 ? 'mes' : `${durationDays} días`}`
    if (type === 'CLASS_PACK') return ''
    return ''
  }

  return (
    <div
      className={`relative bg-white rounded-2xl border p-6 flex flex-col ${
        isPopular ? 'border-stone-900 shadow-xl scale-[1.02]' : 'border-stone-200'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-stone-900 text-white text-xs font-medium">
          Más popular
        </span>
      )}

      <h3 className="font-semibold text-stone-900 text-lg">{name}</h3>
      {description && <p className="text-sm text-stone-500 mt-1">{description}</p>}

      <div className="my-5">
        <span className="text-3xl font-bold text-stone-900">{formatPrice()}</span>
        <span className="text-stone-500 text-sm">{formatPeriod()}</span>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {type === 'UNLIMITED' && (
          <li className="flex items-center gap-2 text-sm text-stone-600">
            <span className="text-green-600 font-bold">✓</span> Clases ilimitadas
          </li>
        )}
        {type === 'CLASS_PACK' && classLimit && (
          <li className="flex items-center gap-2 text-sm text-stone-600">
            <span className="text-green-600 font-bold">✓</span> {classLimit} clases
          </li>
        )}
        {durationDays && (
          <li className="flex items-center gap-2 text-sm text-stone-600">
            <span className="text-green-600 font-bold">✓</span> Válido {durationDays} días
          </li>
        )}
        {!durationDays && type === 'CLASS_PACK' && (
          <li className="flex items-center gap-2 text-sm text-stone-600">
            <span className="text-green-600 font-bold">✓</span> Sin caducidad
          </li>
        )}
      </ul>

      <button
        className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
          isPopular
            ? 'bg-stone-900 text-white hover:bg-stone-800'
            : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
        }`}
      >
        Elegir plan
      </button>
    </div>
  )
}
