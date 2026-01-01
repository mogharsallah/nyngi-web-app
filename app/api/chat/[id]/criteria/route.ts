import { convertToModelMessages } from 'ai'
import { and, eq } from 'drizzle-orm'
import { establishingCriteriaAgent } from '@/server/agents/establishing-criteria'
import { db } from '@/server/lib/db'
import { namingSessions } from '@/server/lib/db/schema/public'
import { createClient } from '@/server/lib/supabase/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(request: Request, ctx: RouteContext<'/api/chat/[id]/criteria'>) {
  const sessionId = (await ctx.params).id
  const user = await (await createClient()).auth.getUser()

  const { messages } = await request.json()

  const session = await db
    .select()
    .from(namingSessions)
    .where(and(eq(namingSessions.id, sessionId), eq(namingSessions.userId, user.data.user!.id)))
    .limit(1)
    .then((rows) => rows[0])

  if (!session) {
    return { success: false, error: 'Session not found', code: 'NOT_FOUND' }
  }

  const result = await establishingCriteriaAgent.stream({
    messages: await convertToModelMessages(messages),
    options: {
      userId: user.data.user!.id,
      user_language: 'en', // Default to English; in real use, get from user settings
    },
  })

  return result.toUIMessageStreamResponse()
}
