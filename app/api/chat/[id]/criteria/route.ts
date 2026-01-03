import { createAgentUIStreamResponse, UIMessage } from 'ai'
import { establishingCriteriaAgent } from '@/server/agents/establishing-criteria'
import { createClient } from '@/server/lib/supabase/server'
import NamingSessionService from '@/server/services/naming-session'
import { NextResponse } from 'next/server'

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

export async function GET(_request: Request, ctx: RouteContext<'/api/chat/[id]/criteria'>) {
  const sessionId = (await ctx.params).id
  const user = await (await createClient()).auth.getUser()
  const userId = user.data.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await NamingSessionService.getSessionById(sessionId, userId, { messages: true })

  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json({ messages: data.messages })
}

export async function POST(request: Request, ctx: RouteContext<'/api/chat/[id]/criteria'>) {
  const sessionId = (await ctx.params).id
  const user = await (await createClient()).auth.getUser()
  const userId = user.data.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body: { message: UIMessage } = await request.json()
  const userMessage = body.message

  // Fetch existing messages
  const { data, error } = await NamingSessionService.getSessionById(sessionId, userId, { messages: true })
  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })
  }

  // Append user message to DB
  await NamingSessionService.appendMessages(sessionId, userId, [userMessage])

  const allMessages = [...data.messages, userMessage]

  return createAgentUIStreamResponse({
    agent: establishingCriteriaAgent,
    uiMessages: allMessages,
    options: {
      userId,
      sessionId,
      user_language: 'en',
    },
    onFinish: async ({ responseMessage }) => {
      // Store the assistant response to DB
      await NamingSessionService.appendMessages(sessionId, userId, [responseMessage])
    },
  })
}
