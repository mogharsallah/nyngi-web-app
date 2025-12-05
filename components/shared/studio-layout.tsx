"use client"

import { useState } from 'react'
import { cn } from '@/components/lib/utils'
import { MobileHeader } from './mobile-header'

interface StudioLayoutProps {
  chatPanel: React.ReactNode
  canvasPanel: React.ReactNode
}

export function StudioLayout({ chatPanel, canvasPanel }: StudioLayoutProps) {
  const [activeView, setActiveView] = useState<'chat' | 'canvas'>('chat')

  return (
    <>
      {/* Mobile Header with View Toggle */}
      <MobileHeader activeView={activeView} onViewChange={setActiveView} />

      {/* Main Layout Container */}
      <div className="h-screen">
        {/* Desktop/Tablet: CSS Grid split view */}
        {/* lg (≥1024px): 30%/70% | md (768-1024px): 35%/65% | mobile: hidden */}
        <div className="hidden md:grid lg:grid-cols-[30%_70%] md:grid-cols-[35%_65%] h-full">
          {/* Chat Panel */}
          <div className="border-r overflow-auto">{chatPanel}</div>

          {/* Canvas Panel */}
          <div className="overflow-auto">{canvasPanel}</div>
        </div>

        {/* Mobile: Single panel view with fixed header offset */}
        <div className="md:hidden h-full pt-[calc(env(safe-area-inset-top)+3.5rem)]">
          <div
            className={cn('h-full overflow-auto', activeView === 'chat' ? 'block' : 'hidden')}
          >
            {chatPanel}
          </div>
          <div
            className={cn('h-full overflow-auto', activeView === 'canvas' ? 'block' : 'hidden')}
          >
            {canvasPanel}
          </div>
        </div>
      </div>
    </>
  )
}
