'use server'

import { z } from 'zod'
import { authenticatedAction } from '@/server/lib/actions/safe-action'
import { redirect } from 'next/navigation'
import NamingSessionService from '@/server/services/naming-session'

const CreateSessionSchema = z.object({
  plan: z.enum(['velocity', 'legacy']),
})

export const createNamingSession = authenticatedAction(CreateSessionSchema, async function createNamingSession(input, userId) {
  const { data, error } = await NamingSessionService.createSession(userId)
  if (error) {
    console.log(error)
    return { success: false, error: 'Failed to create naming session', code: 'INTERNAL_ERROR' }
  }

  redirect('/studio/' + data[0].id)
})

const GenerateNamesSchema = z.object({
  sessionId: z.string(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generateNames = authenticatedAction(GenerateNamesSchema, async function generateNames(input, userId) {
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
export const toggleFavorite = authenticatedAction(ToggleFavoriteSchema, async function authenticatedAction(input, userId) {
  // Placeholder logic
  return { isFavorite: true }
})
