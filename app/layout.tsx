import { NextIntlClientProvider } from 'next-intl'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Nyngi - Name Your Next Great Idea',
    template: '%s | Nyngi',
  },
  description: 'Transform your business naming journey from anxiety to certainty. AI-powered name generation with real-time IP risk assessment.',
  keywords: ['business naming', 'brand name generator', 'IP risk check', 'trademark search'],
  authors: [{ name: 'Nyngi' }],
  creator: 'Nyngi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nyngi.com',
    siteName: 'Nyngi',
    title: 'Nyngi - Name Your Next Great Idea',
    description: 'Transform your business naming journey from anxiety to certainty. AI-powered name generation with real-time IP risk assessment.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyngi - Name Your Next Great Idea',
    description: 'Transform your business naming journey from anxiety to certainty. AI-powered name generation with real-time IP risk assessment.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider>
            {children}
            <ToastProvider />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
