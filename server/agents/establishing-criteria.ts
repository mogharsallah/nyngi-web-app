import { tool, ToolLoopAgent, stepCountIs } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { loadMarkdown } from '@/server/lib/fs/file-loader'

const instructions = loadMarkdown('server/agents/instructions/establishing-criteria/foundational-identity-v1.md')

const updateCriteriaSchema = z.object({
  phase_1_identity: z
    .object({
      core_concept: z.string().optional().describe('What the business physically does (Concrete Operations).'),
      origin_story: z.string().optional().describe('The specific moment/insight that birthed the idea.'),
      future_horizon: z.string().optional().describe('Where they will be in 5-10 years.'),
      differentiator: z.string().optional().describe('The specific "Hook" vs. baseline values.'),
    })
    .optional(),

  phase_2_market: z
    .object({
      competitors: z.string().optional().describe('Direct and Indirect competitors.'),
      risk_appetite: z.enum(['Low', 'Medium', 'High']).optional().describe('Risk tolerance: Low (Safe/Trust) vs High (Disruptive).'),
      geographic_scope: z.string().optional().describe('Local, National, or Global scope.'),
    })
    .optional(),

  phase_3_audience: z
    .object({
      demographics: z.string().optional().describe('Age, B2B/B2C, Income level.'),
      emotional_driver: z.string().optional().describe('The core feeling the customer is buying (e.g., Relief, Status).'),
    })
    .optional(),

  phase_4_tonality: z
    .object({
      sensory_verbs: z.string().optional().describe('Verbs describing sound/texture/movement.'),
      tonal_hates: z.string().optional().describe('Words or vibes the user detests.'),
    })
    .optional(),

  phase_5_logistics: z
    .object({
      sales_channel: z.string().optional().describe('Primary channel: Audio, Visual, Shelf, Search.'),
      url_constraint: z.string().optional().describe('Is exact .com match required?'),
    })
    .optional(),
})

const updateCriteriaTool = tool({
  description: 'Updates the criteria.',
  inputSchema: updateCriteriaSchema,
  outputSchema: updateCriteriaSchema,
  execute: async (input, options) => {
    // In a real implementation, this would persist the criteria to a database
    const typedContext = options.experimental_context as { userId: string }
    console.log(`Updating criteria for user: ${typedContext.userId}`, input)
    return input
  },
})

export const establishingCriteriaAgent = new ToolLoopAgent({
  model: google('gemini-3-pro-preview'),
  stopWhen: stepCountIs(6),
  callOptionsSchema: z.object({
    userName: z.string().optional(),
    userId: z.string(),
    user_language: z.string(),
  }),
  instructions,
  tools: {
    update_criteria: updateCriteriaTool,
  },
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    experimental_context: {
      userId: options.userId,
    },
    instructions:
      settings.instructions +
      `\nUser context:
- user Language: ${options.user_language}
`,
  }),
})
