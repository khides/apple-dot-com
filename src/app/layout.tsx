import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Apple',
  description: 'Apple leads the world in innovation with iPhone, iPad, Mac, Apple Watch, and more.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
