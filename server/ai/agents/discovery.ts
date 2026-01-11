import { tool, ToolLoopAgent, stepCountIs, wrapLanguageModel } from 'ai'
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google'
import { z } from 'zod'
import { loadMarkdown } from '@/server/lib/fs/file-loader'
import NamingSessionService from '@/server/services/naming-session'
import { devToolsMiddleware } from '@ai-sdk/devtools'

const instructions = loadMarkdown('server/ai/instructions/discovery-v1.md')
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

/**
 * Scratchpad tool - Records internal thinking and planning
 * Called at the start of each response to persist progress tracking
 */
const scratchpadTool = tool({
  description:
    'Use this tool to record your internal thinking, track information gathered, and plan your next moves. Call this at the start of each response before replying to the user.',
  inputSchema: z.object({
    content: z.string().describe('The scratchpad content in markdown format'),
  }),
  execute: async ({ content }, options) => {
    const typedContext = options.experimental_context as AgentContext

    await NamingSessionService.updateScratchpad(typedContext.sessionId, typedContext.userId, content)

    return { success: true as const }
  },
})

// Export tools for message validation in API routes
export const discoveryAgentTools = {
  handover: handoverTool,
  scratchpad: scratchpadTool,
}

const model = wrapLanguageModel({
  model: google('gemini-3-pro-preview'),
  middleware: process.env.NODE_ENV === 'development' ? [devToolsMiddleware()] : [],
})

export const DiscoveryAgent = new ToolLoopAgent({
  providerOptions: {
    google: {} satisfies GoogleGenerativeAIProviderOptions,
  },
  model,
  stopWhen: stepCountIs(6),
  callOptionsSchema: z.object({
    userName: z.string().optional(),
    userId: z.string(),
    sessionId: z.string(),
    user_language: z.string(),
    scratchpad: z.string().optional(),
  }),
  instructions,
  tools: discoveryAgentTools,

  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    experimental_context: {
      userId: options.userId,
      sessionId: options.sessionId,
    },
    instructions: settings.instructions
      ?.toString()
      .replace('{{USER_CONTEXT}}', `- User Language: ${options.user_language}`)
      .replace('{{PREVIOUS_SCRATCHPAD}}', options.scratchpad || 'No previous scratchpad. This is the first turn.'),
  }),
})
