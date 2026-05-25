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
    <section className="relative py-24 px-6 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#E8D5B7]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#5B7A5E]/5 rounded-full blur-2xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
            <svg className="w-5 h-5 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="w-8 h-[2px] bg-[#C47D4E]/50 rounded-full" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D]">
            Contacto
          </h2>
          <p className="mt-4 text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
            Estamos aqui para ayudarte. No dudes en escribirnos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2D2D2D] mb-6">
                Visitanos
              </h3>
              <div className="space-y-5">
                {address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#5B7A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Direccion</p>
                      <p className="text-sm text-[#7A7A7A] mt-0.5">{address}{org.city ? `, ${org.city}` : ''}</p>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#C47D4E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#C47D4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Email</p>
                      <a href={`mailto:${email}`} className="text-sm text-[#7A7A7A] hover:text-[#5B7A5E] transition-colors mt-0.5 block">
                        {email}
                      </a>
                    </div>
                  </div>
                )}
                {phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#E8D5B7]/50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#C47D4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Telefono</p>
                      <a href={`tel:${phone}`} className="text-sm text-[#7A7A7A] hover:text-[#5B7A5E] transition-colors mt-0.5 block">
                        {phone}
                      </a>
                    </div>
                  </div>
                )}
                {whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#5B7A5E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#5B7A5E]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">WhatsApp</p>
                      <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#7A7A7A] hover:text-[#5B7A5E] transition-colors mt-0.5 block">
                        Enviar mensaje
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule quick info */}
            <div className="bg-[#F5F0EB] rounded-3xl p-6 border border-[#E8D5B7]/30">
              <h4 className="font-medium text-[#2D2D2D] mb-3">Horario de atencion</h4>
              <div className="space-y-2 text-sm text-[#7A7A7A]">
                <div className="flex justify-between">
                  <span>Lunes - Viernes</span>
                  <span className="text-[#2D2D2D] font-medium">7:00 - 21:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabado</span>
                  <span className="text-[#2D2D2D] font-medium">8:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-[#2D2D2D] font-medium">9:00 - 13:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-[#F5F0EB] rounded-3xl p-8 border border-[#E8D5B7]/30">
            <h3 className="font-serif text-xl font-semibold text-[#2D2D2D] mb-6">
              Envianos un mensaje
            </h3>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8D5B7]/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7A5E]/30 focus:border-[#5B7A5E] transition-all placeholder:text-[#7A7A7A]/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8D5B7]/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7A5E]/30 focus:border-[#5B7A5E] transition-all placeholder:text-[#7A7A7A]/60"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Asunto</label>
                <input
                  type="text"
                  placeholder="Como podemos ayudarte?"
                  className="w-full px-4 py-3 rounded-2xl border border-[#E8D5B7]/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7A5E]/30 focus:border-[#5B7A5E] transition-all placeholder:text-[#7A7A7A]/60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Mensaje</label>
                <textarea
                  rows={4}
                  placeholder="Cuentanos en que podemos ayudarte..."
                  className="w-full px-4 py-3 rounded-2xl border border-[#E8D5B7]/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7A5E]/30 focus:border-[#5B7A5E] transition-all resize-none placeholder:text-[#7A7A7A]/60"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#5B7A5E] text-white font-medium text-sm hover:bg-[#4A6A4D] transition-all hover:shadow-lg hover:shadow-[#5B7A5E]/20"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
