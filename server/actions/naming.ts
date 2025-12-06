'use server'

import { z } from 'zod'
import { authenticatedAction } from '@/server/lib/actions/safe-action'

const CreateSessionSchema = z.object({
  industry: z.string(),
  description: z.string(),
  tone: z.string().optional(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSession = authenticatedAction(CreateSessionSchema, async (input, userId) => {
  // Placeholder logic
  return { sessionId: 'placeholder-session-id' }
})

const GenerateNamesSchema = z.object({
  sessionId: z.string(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generateNames = authenticatedAction(GenerateNamesSchema, async (input, userId) => {
  // Placeholder logic
  return [
    { name: 'NovusArc', rationale: 'Latin for New Arch' },
    { name: 'Vividly', rationale: 'Evokes brightness' },
  ]
})

const ToggleFavoriteSchema = z.object({
  nameId: z.string(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const toggleFavorite = authenticatedAction(ToggleFavoriteSchema, async (input, userId) => {
  // Placeholder logic
  return { isFavorite: true }
})
