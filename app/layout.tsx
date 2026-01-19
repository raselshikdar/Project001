import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site-header'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'বাংলা টেক - Bengali Tech Community Platform',
  description: 'বাংলা ভাষায় প্রযুক্তি, টিপস, ট্রিকস এবং টিউটোরিয়াল। শিখুন, শেয়ার করুন এবং সমাধান খুঁজুন।',
  generator: 'v0.app',
  keywords: ['bangla tech', 'bengali technology', 'tech tutorial bengali', 'programming bangla', 'বাংলা টেক'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'বাংলা টেক - Bengali Tech Community Platform',
    description: 'বাংলা ভাষায় প্রযুক্তি, টিপস, ট্রিকস এবং টিউটোরিয়াল',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn" className="overflow-x-hidden" suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden w-full max-w-[100vw]">
        <SiteHeader />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
