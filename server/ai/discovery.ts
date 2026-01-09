import { tool, ToolLoopAgent, stepCountIs, wrapLanguageModel } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { loadMarkdown } from '@/server/lib/fs/file-loader'
import NamingSessionService from '@/server/services/naming-session'
import { devToolsMiddleware } from '@ai-sdk/devtools'

const instructions = loadMarkdown('server/agents/instructions/discovery-v0.md')
interface AgentContext {
  userId: string
  sessionId: string
}

/**
 * Handover tool - Transfers session to brainstorming phase
 * Requires user approval before execution
 */
const handoverTool = tool({
  description:
    'Transfers the session to the brainstorming phase. Call this when you believe you have extracted all meaningful information, the user explicitly indicates they want to stop or move forward, or you have reached a natural conclusion point in the interview. This action requires user approval.',
  inputSchema: z.object({}),
  needsApproval: true,
  execute: async ({ summary }, options) => {
    const typedContext = options.experimental_context as AgentContext

    // Update session status to brainstorming
    const { error } = await NamingSessionService.updateSession(typedContext.sessionId, typedContext.userId, {
      status: 'brainstorming',
    })

    if (error) {
      return { success: false as const, error: 'Failed to transition session to brainstorming phase' }
    }

    return {
      success: true as const,
      message: 'Successfully transitioned to brainstorming phase',
      summary,
      next_phase: 'brainstorming',
    }
  },
})

// Export tools for message validation in API routes
export const discoveryAgentTools = {
  handover: handoverTool,
}

const model = wrapLanguageModel({
  model: google('gemini-3-pro-preview'),
  middleware: process.env.NODE_ENV === 'development' ? [devToolsMiddleware()] : [],
})

export const DiscoveryAgent = new ToolLoopAgent({
  model,
  stopWhen: stepCountIs(6),
  callOptionsSchema: z.object({
    userName: z.string().optional(),
    userId: z.string(),
    sessionId: z.string(),
    user_language: z.string(),
  }),
  instructions,
  tools: discoveryAgentTools,

  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    experimental_context: {
      userId: options.userId,
      sessionId: options.sessionId,
    },
    instructions: settings.instructions?.toString().replace(
      '{{USER_CONTEXT}}',
      `
- User Language: ${options.user_language}
`
    ),
  }),
})
