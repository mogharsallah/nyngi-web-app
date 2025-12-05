import { StudioLayout } from '@/components/shared'
import { createClient } from '@/server/lib/supabase/server'
import { redirect } from 'next/navigation'

// Placeholder components for chat and canvas panels
// These will be replaced with actual implementations in Epic 3
function ChatPanel() {
  return (
    <div className="h-full p-4">
      <div className="text-muted-foreground text-sm">Chat Panel</div>
    </div>
  )
}

function CanvasPanel() {
  return (
    <div className="h-full p-4">
      <div className="text-muted-foreground text-sm">Canvas Panel</div>
    </div>
  )
}

export default async function StudioRouteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }
  return (
    <StudioLayout
      chatPanel={<ChatPanel />}
      canvasPanel={
        <div className="h-full">
          <CanvasPanel />
          {children}
        </div>
      }
    />
  )
}
