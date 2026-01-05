import { ChatInterface } from '@/components/features/chat/chat-interface'
import { getUserId } from '@/server/lib/supabase/server'
import NamingSessionService from '@/server/services/naming-session'
import { filterScratchpadFromMessages } from '@/server/lib/stream/scratchpad-filter'

export default async function StudioChatSlot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: userId } = await getUserId()

  if (!userId) {
    return <ChatInterface sessionId={id} initialMessages={[]} />
  }

  // Service only handles data fetching
  const { data } = await NamingSessionService.getSessionById(id, userId, { messages: true })
  // Filter scratchpad content from stored messages before sending to client
  const messages = filterScratchpadFromMessages(data?.messages ?? [])

  return <ChatInterface sessionId={id} initialMessages={messages} />
}
