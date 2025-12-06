import { z } from 'zod'
import { createClient } from '@/server/lib/supabase/server'
import { logger } from '@/server/lib/logger'
import type { ActionResponse } from '@/server/types/actions'

export function authenticatedAction<TInput, TOutput>(schema: z.Schema<TInput>, handler: (input: TInput, userId: string) => Promise<TOutput>) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    const startTime = Date.now()
    const actionName = handler.name || 'anonymous_action'

    try {
      // 1. Input Validation
      const validated = schema.safeParse(input)
      if (!validated.success) {
        logger.warn({ action: actionName, error: validated.error }, 'Validation failed')
        return { success: false, error: validated.error.message, code: 'VALIDATION_ERROR' }
      }

      // 2. Auth Check
      const supabase = await createClient()
      const { data, error: authError } = await supabase.auth.getClaims()

      if (authError || !data || !data.claims.sub) {
        logger.warn({ action: actionName, error: authError }, 'Authentication required')
        return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }
      }

      const userId = data.claims.sub

      // 3. Execution
      const result = await handler(validated.data, userId)

      // 4. Logging
      logger.info({ action: actionName, userId, duration: Date.now() - startTime }, 'Action completed')

      return { success: true, data: result }
    } catch (error) {
      logger.error({ action: actionName, error }, 'Unexpected error')
      return { success: false, error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' }
    }
  }
}
