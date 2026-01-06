import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/server/lib/supabase/server'
import { createNamingSession } from '@/server/actions/studio'
import NamingSessionService from '@/server/services/naming-session'
import { SessionList } from '@/components/features/sessions/session-list'
import { EmptyState } from '@/components/features/sessions/empty-state'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const { data: sessions } = await NamingSessionService.getUserSessions(user.id, {
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Naming Sessions</h1>
          <p className="text-muted-foreground mt-2">Manage and continue your brand naming projects</p>
        </div>
        <form action={createNamingSession}>
          <Button type="submit" size="lg">
            New Session
          </Button>
        </form>
      </div>

      {!sessions || sessions.length === 0 ? <EmptyState /> : <SessionList sessions={sessions} />}
    </div>
  )
}
