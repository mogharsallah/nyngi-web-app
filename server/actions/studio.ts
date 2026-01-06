'use server'

import { createSecureFormAction } from '@/server/lib/actions/secure-action'
import { redirect } from 'next/navigation'
import NamingSessionService from '@/server/services/naming-session'
import { logger } from '@/server/lib/logger'

export const createNamingSession = createSecureFormAction(async function createNamingSession({ userId }) {
  const { data, error } = await NamingSessionService.createSession(userId)
  if (error) {
    logger.error({ userId, error }, 'Failed to create naming session')
    throw new Error('Failed to create naming session')
  }

  redirect('/studio/' + data[0].id)
})
