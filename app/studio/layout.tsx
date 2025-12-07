import { StudioLayout } from '@/components/shared'
import { createClient } from '@/server/lib/supabase/server'

// Placeholder components for chat and canvas panels
// These will be replaced with actual implementations in Epic 3
async function ChatPanel() {
  const client = await createClient()
  const user = await client.auth.getUser()
  return (
    <div className="h-full p-4">
      <div className="text-muted-foreground text-sm">Chat Panel ({user.data.user?.email})</div>
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
