import './globals.css'

export const metadata = {
  title: '星座关系说明书',
  description: '星座关系说明书 + 7日关系日历',
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
