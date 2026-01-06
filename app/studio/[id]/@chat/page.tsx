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
  const filteredMessages = filterScratchpadFromMessages(data?.messages ?? [])

  // Deduplicate messages by ID (keep first occurrence)
  const seenIds = new Set<string>()
  const uniqueMessages = filteredMessages.filter((msg) => {
    if (seenIds.has(msg.id)) {
      return false
    }
    seenIds.add(msg.id)
    return true
  })

  return <ChatInterface sessionId={id} initialMessages={uniqueMessages} />
}
