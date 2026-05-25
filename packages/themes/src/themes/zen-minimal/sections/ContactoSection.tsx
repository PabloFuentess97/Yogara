import type { ContactoSectionProps } from '../../../engine/types'

export function ContactoSection({ org }: ContactoSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">
              Contacto
            </h2>
            <p className="text-stone-600 mb-6">
              ¿Tienes alguna pregunta? No dudes en contactarnos.
            </p>
            <div className="space-y-3 text-sm text-stone-700">
              {org.address && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">📍</span>
                  <span>{org.address}{org.city ? `, ${org.city}` : ''}</span>
                </div>
              )}
              {org.email && (
                <div className="flex items-center gap-3">
                  <span>✉️</span>
                  <a href={`mailto:${org.email}`} className="hover:text-stone-900 transition-colors">
                    {org.email}
                  </a>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <a href={`tel:${org.phone}`} className="hover:text-stone-900 transition-colors">
                    {org.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                rows={4}
                placeholder="Tu mensaje"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
