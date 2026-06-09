import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'Salsawala Studios | Dance & Fitness Classes in Kolkata',
    template: '%s | Salsawala Studios Kolkata',
  },
  description:
    'Kolkata\'s premier dance studio near Park Street. 15+ dance styles including Salsa, Bachata, Kizomba, Hip-Hop, Contemporary & more. Expert instructors, flexible schedules, all levels welcome.',
  keywords: [
    'dance classes Kolkata',
    'salsa dance Kolkata',
    'bachata classes',
    'kizomba Kolkata',
    'hip hop dance classes',
    'dance studio Park Street',
    'Salsawala Studios',
    'dance fitness Kolkata',
  ],
  authors: [{ name: 'Salsawala Studios' }],
  creator: 'Salsawala Studios',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.salsawalastudios.com',
    title: 'Salsawala Studios | Dance & Fitness Classes in Kolkata',
    description: 'Kolkata\'s premier dance studio. 15+ dance styles, expert instructors, all levels welcome.',
    siteName: 'Salsawala Studios',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salsawala Studios | Dance & Fitness Classes in Kolkata',
    description: 'Kolkata\'s premier dance studio. 15+ dance styles, expert instructors, all levels welcome.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#C41E3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-dark text-white antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
