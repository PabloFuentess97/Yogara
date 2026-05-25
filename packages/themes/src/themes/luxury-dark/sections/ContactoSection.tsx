'use client'

import type { ContactoSectionProps } from '../../../engine/types'

export function ContactoSection({ org }: ContactoSectionProps) {
  return (
    <section className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <div className="w-12 h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-8" />
            <h2
              className="text-3xl md:text-4xl font-light text-[#F5F5F5] tracking-wide mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Contacto
            </h2>
            <p className="text-[#9CA3AF] mb-8 font-light leading-relaxed">
              Tienes alguna pregunta? No dudes en contactarnos.
            </p>
            <div className="space-y-4 text-sm text-[#9CA3AF]">
              {org.address && (
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="font-light">{org.address}{org.city ? `, ${org.city}` : ''}</span>
                </div>
              )}
              {org.email && (
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href={`mailto:${org.email}`} className="font-light hover:text-[#D4AF37] transition-colors duration-300">
                    {org.email}
                  </a>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <a href={`tel:${org.phone}`} className="font-light hover:text-[#D4AF37] transition-colors duration-300">
                    {org.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact form */}
          <form className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] text-sm font-light placeholder-[#9CA3AF]/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] text-sm font-light placeholder-[#9CA3AF]/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300"
              />
            </div>
            <div>
              <textarea
                rows={5}
                placeholder="Tu mensaje"
                className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] text-sm font-light placeholder-[#9CA3AF]/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[#D4AF37] text-[#0A0A0A] font-medium text-sm tracking-wider uppercase hover:bg-[#F5E6C8] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
