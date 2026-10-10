import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const nunito = Nunito({ 
  subsets: ['vietnamese'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-nunito'
})

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
    <html lang="vi" className={`${nunito.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
