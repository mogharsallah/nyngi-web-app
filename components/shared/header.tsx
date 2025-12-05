"use client"

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations('Navigation')
  const tCommon = useTranslations('Common')

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="font-bold text-lg">
          {tCommon('appName')}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/studio"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('studio')}
          </Link>
          <Link
            href="/reports"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('reports')}
          </Link>
          <Link
            href="/orders"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('orders')}
          </Link>
        </nav>

        {/* User Menu Placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}
