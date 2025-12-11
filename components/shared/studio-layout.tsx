'use client'

interface StudioLayoutProps {
  chatPanel: React.ReactNode
  canvasPanel: React.ReactNode
}

export function StudioLayout({ chatPanel }: StudioLayoutProps) {
  return <div className="h-screen">{chatPanel}</div>
  // const [activeView, setActiveView] = useState<'chat' | 'canvas'>('chat')
  // return (
  //   <>
  //     {/* Mobile Header with View Toggle */}
  //     <MobileHeader activeView={activeView} onViewChange={setActiveView} />

  //     {/* Main Layout Container */}
  //     <div className="h-screen">
  //       {/* Desktop/Tablet: CSS Grid split view */}
  //       {/* lg (≥1024px): 70%/30% | md (768-1024px): 65%/35% | mobile: hidden */}
  //       <div className="hidden md:grid lg:grid-cols-[70%_30%] md:grid-cols-[65%_35%] h-full">
  //         {/* Canvas Panel */}
  //         <div className="border-r overflow-auto">{canvasPanel}</div>

  //         {/* Chat Panel */}
  //         <div className="overflow-auto">{chatPanel}</div>
  //       </div>

  //       {/* Mobile: Single panel view with fixed header offset */}
  //       <div className="md:hidden h-full pt-[calc(env(safe-area-inset-top)+3.5rem)]">
  //         <div className={cn('h-full overflow-auto', activeView === 'chat' ? 'block' : 'hidden')}>{chatPanel}</div>
  //         <div className={cn('h-full overflow-auto', activeView === 'canvas' ? 'block' : 'hidden')}>{canvasPanel}</div>
  //       </div>
  //     </div>
  //   </>
  // )
}
