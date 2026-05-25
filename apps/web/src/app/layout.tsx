import type { Metadata } from 'next'
import { Inter, Playfair_Display, Geist, DM_Serif_Display, DM_Sans, Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
})

const dmSerif = DM_Serif_Display({
  weight: '400',
  variable: '--font-dm-serif',
  subsets: ['latin'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  subsets: ['latin'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Yogara',
  description: 'Plataforma para centros de yoga y bienestar',
  manifest: '/manifest.json',
  themeColor: '#1c1917',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Yogara',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn("h-full", "antialiased", inter.variable, playfair.variable, geist.variable, dmSerif.variable, dmSans.variable, cormorant.variable, montserrat.variable, "font-sans")}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        {children}
      </body>
    </html>
  )
}
