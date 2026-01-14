import './globals.css'

export const metadata = {
  title: '星座情侣配对',
  description: '星座情侣配对 + 7日关系日历',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
