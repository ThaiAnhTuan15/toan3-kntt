import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toán 3 Kết Nối',
  description: 'Hệ thống học tập và luyện trắc nghiệm Toán lớp 3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
