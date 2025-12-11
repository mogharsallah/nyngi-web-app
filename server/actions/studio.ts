'use server'

import { z } from 'zod'
import { authenticatedAction } from '@/server/lib/actions/safe-action'
import { db } from '@/server/lib/db'
import { namingSessions } from '@/server/lib/db/schema/public'
import { redirect } from 'next/navigation'

const CreateSessionSchema = z.object({
  plan: z.enum(['velocity', 'legacy']),
})

export const createNamingSession = authenticatedAction(CreateSessionSchema, async function createNamingSession(input, userId) {
  const { plan } = input

  const [session] = await db
    .insert(namingSessions)
    .values({
      userId,
      plan,
      criteria: {}, // Initial empty criteria
    })
    .returning({ id: namingSessions.id })

  redirect('/studio/' + session.id)
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
