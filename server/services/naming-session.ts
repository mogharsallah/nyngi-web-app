import type { UIMessage } from 'ai'
import { db, safeDb, SelectColumns, UpdateColumns } from '@/server/lib/db'
import { namingSessions } from '@/server/lib/db/schema/public'
import { and, desc, eq, sql } from 'drizzle-orm'
import { merge } from 'es-toolkit'
import { Criteria } from '@/common/types/session'
import { DeepPartial } from '@/common/types/utils'

export default class NamingSessionService {
  static async getUserSessions(userId: string, columns?: SelectColumns<'namingSessions'>) {
    return safeDb(
      db.query.namingSessions.findMany({
        where: eq(namingSessions.userId, userId),
        columns,
        orderBy: [desc(namingSessions.updatedAt)],
      })
    )
  }

  static async getSessionById(sessionId: string, userId: string, columns?: SelectColumns<'namingSessions'>) {
    return safeDb(
      db.query.namingSessions.findFirst({
        where: and(eq(namingSessions.id, sessionId), eq(namingSessions.userId, userId)),
        columns,
      })
    )
  }

  static async createSession(userId: string) {
    return safeDb(
      db
        .insert(namingSessions)
        .values({
          userId,
          plan: 'velocity',
          criteria: {}, // Initial empty criteria
        })
        .returning({ id: namingSessions.id })
    )
  }

  static async updateSession(sessionId: string, userId: string, payload: UpdateColumns<'namingSessions'>) {
    return safeDb(
      db
        .update(namingSessions)
        .set({ ...payload, updatedAt: new Date() })
        .where(and(eq(namingSessions.id, sessionId), eq(namingSessions.userId, userId)))
        .returning({ id: namingSessions.id })
    )
  }

  static async updateCriteria(sessionId: string, userId: string, criteria: DeepPartial<Criteria>) {
    const existingCriteriaResult = await this.getSessionById(sessionId, userId, { criteria: true })
    if (!existingCriteriaResult.success) {
      return { data: null, error: existingCriteriaResult.error }
    }

    const existingCriteria = existingCriteriaResult.data?.criteria || {}
    const mergedCriteria = merge(existingCriteria, criteria)

    const { data, error } = await safeDb(
      db
        .update(namingSessions)
        .set({ criteria: sql`${namingSessions.criteria} || ${JSON.stringify(mergedCriteria)}::jsonb`, updatedAt: new Date() })
        .where(and(eq(namingSessions.id, sessionId), eq(namingSessions.userId, userId)))
        .returning({ criteria: namingSessions.criteria })
    )
    if (error) {
      return { data: null, error }
    }
    return { data: data[0], error: null }
  }

  static async appendMessages(sessionId: string, userId: string, newMessages: UIMessage[]) {
    // Get existing messages to check for duplicates
    const existingResult = await this.getSessionById(sessionId, userId, { messages: true })
    if (!existingResult.success || !existingResult.data) {
      return { data: null, error: existingResult.error || new Error('Session not found') }
    }

    const existingMessages = existingResult.data.messages || []
    const existingIds = new Set(existingMessages.map((msg) => msg.id))

    // Filter out messages that already exist
    const uniqueNewMessages = newMessages.filter((msg) => !existingIds.has(msg.id))

    // If no new unique messages, skip the update
    if (uniqueNewMessages.length === 0) {
      return { data: null, error: null }
    }

    return safeDb(
      db
        .update(namingSessions)
        .set({
          messages: sql`${namingSessions.messages} || ${JSON.stringify(uniqueNewMessages)}::jsonb`,
          updatedAt: new Date(),
        })
        .where(and(eq(namingSessions.id, sessionId), eq(namingSessions.userId, userId)))
    )
  }
}
