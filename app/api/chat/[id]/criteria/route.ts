import { createAgentUIStreamResponse, createIdGenerator, UIMessage, validateUIMessages, TypeValidationError, smoothStream } from 'ai'
import { DiscoveryAgent, discoveryAgentTools } from '@/server/ai/agents/discovery'
import { createClient } from '@/server/lib/supabase/server'
import NamingSessionService from '@/server/services/naming-session'
import { NextResponse } from 'next/server'
import { logger } from '@/server/lib/logger'

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

export async function POST(request: Request, ctx: RouteContext<'/api/chat/[id]/criteria'>) {
  const sessionId = (await ctx.params).id
  const user = await (await createClient()).auth.getUser()
  const userId = user.data.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body: { message: UIMessage } = await request.json()
  const userMessage = body.message

  // Fetch existing messages and scratchpad
  const { data, error } = await NamingSessionService.getSessionById(sessionId, userId, { messages: true, scratchpad: true })
  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })
  }

  // Append user message to DB
  await NamingSessionService.appendMessages(sessionId, userId, [userMessage])

  const allMessages = [...data.messages, userMessage]

  // TODO: Improve caching.

  // Validate messages against agent tools
  // Type assertion needed because validateUIMessages expects Tool<unknown, unknown>
  // but our tools are typed more specifically
  let validatedMessages: UIMessage[]
  try {
    validatedMessages = await validateUIMessages({
      messages: allMessages,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: discoveryAgentTools as any,
    })
  } catch (validationError) {
    if (validationError instanceof TypeValidationError) {
      logger.warn({ sessionId, error: validationError }, 'Message validation failed, using unvalidated messages')
      // Fall back to unvalidated messages for backwards compatibility
      validatedMessages = allMessages
    } else {
      throw validationError
    }
  }

  return createAgentUIStreamResponse({
    agent: DiscoveryAgent,
    uiMessages: validatedMessages,
    options: {
      userId,
      sessionId,
      user_language: 'en',
      scratchpad: data.scratchpad ?? undefined,
    },
    experimental_transform: smoothStream({}),
    // Server-side message ID generation for persistence consistency
    generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
    onFinish: async ({ responseMessage }) => {
      // Store the assistant response to DB
      await NamingSessionService.appendMessages(sessionId, userId, [responseMessage])
    },
  })
}
