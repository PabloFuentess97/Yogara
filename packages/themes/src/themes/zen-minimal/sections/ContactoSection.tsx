import type { ContactoSectionProps } from '../../../engine/types'
import { getSetting } from '../../../engine/settings'

export function ContactoSection({ org }: ContactoSectionProps) {
  const settings = org.settings as Record<string, unknown>
  const contact = getSetting<Record<string, string> | undefined>(settings, 'contact', undefined)
  const whatsapp = getSetting<string>(settings, 'socialMedia.whatsapp', '')

  const email = contact?.email || org.email
  const phone = contact?.phone || org.phone
  const address = contact?.address || org.address

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
              {address && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">📍</span>
                  <span>{address}{org.city ? `, ${org.city}` : ''}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <span>✉️</span>
                  <a href={`mailto:${email}`} className="hover:text-stone-900 transition-colors">
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <a href={`tel:${phone}`} className="hover:text-stone-900 transition-colors">
                    {phone}
                  </a>
                </div>
              )}
              {whatsapp && (
                <div className="flex items-center gap-3">
                  <span>💬</span>
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">
                    WhatsApp
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
