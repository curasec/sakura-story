import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sakura Story - 星座情侣配对',
  description: '星座情侣配对 + 7日关系日历',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-background text-text font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
