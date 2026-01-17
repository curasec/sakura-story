import './globals.css'
import type { Metadata } from 'next'
import { LocaleProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Sakura Story - Zodiac Compatibility',
  description: 'Zodiac compatibility analysis & 7-day relationship calendar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="scroll-smooth">
      <body className="bg-background text-text font-sans antialiased">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
