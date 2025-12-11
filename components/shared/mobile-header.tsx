'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/components/lib/utils'
import { Button } from '@/components/ui/button'

interface MobileHeaderProps {
  activeView: 'chat' | 'canvas'
  onViewChange: (view: 'chat' | 'canvas') => void
}

export function MobileHeader({ activeView, onViewChange }: MobileHeaderProps) {
  const t = useTranslations('Studio')
  const tCommon = useTranslations('Common')

  return (
    <header className="fixed top-0 left-0 right-0 md:hidden bg-background border-b z-50 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <div className="font-bold text-lg">{tCommon('appName')}</div>

        {/* View Toggle - Segmented Control */}
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('chat')}
            className={cn('min-h-11 min-w-11 px-3 py-1.5 rounded-md text-sm font-medium', activeView === 'chat' && 'bg-background shadow-sm')}
          >
            {t('chatPanel')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('canvas')}
            className={cn('min-h-11 min-w-11 px-3 py-1.5 rounded-md text-sm font-medium', activeView === 'canvas' && 'bg-background shadow-sm')}
          >
            {t('canvasPanel')}
          </Button>
        </div>

        {/* Profile Menu Placeholder */}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">U</span>
        </div>
      </div>
    </header>
  )
}
