import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Yogara · Super Admin',
  description: 'Panel de administración de la plataforma Yogara',
}

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/organizaciones', label: 'Organizaciones' },
  { href: '/planes', label: 'Planes' },
  { href: '/usuarios', label: 'Usuarios' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-gray-50 font-sans">
        <aside className="hidden md:flex md:w-56 flex-col bg-gray-900 text-white">
          <div className="p-5 border-b border-gray-800">
            <h1 className="text-sm font-bold tracking-wide uppercase text-gray-300">
              Yogara Admin
            </h1>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </body>
    </html>
  )
}
