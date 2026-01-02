import { Criteria } from '@/common/types/session'
import { db, safeDb, SelectColumns, UpdateColumns } from '@/server/lib/db'
import { namingSessions } from '@/server/lib/db/schema/public'
import { and, eq } from 'drizzle-orm/sql/expressions/conditions'

export default class NamingSessionService {
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
    )
  }
}
