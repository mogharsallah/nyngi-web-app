import { z } from 'zod'
import { createClient } from '@/server/lib/supabase/server'
import { logger } from '@/server/lib/logger'
import type { ActionResponse } from '@/server/types/actions'
import { REDIRECT_ERROR_CODE } from 'next/dist/client/components/redirect-error'

/* ============================================================
 * Shared helpers
 * ============================================================ */

async function requireAuthenticatedUser(actionName: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims?.sub) {
    logger.warn({ action: actionName, error }, 'Authentication required')
    throw new Error('AUTH_REQUIRED')
  }

  return {
    userId: data.claims.sub,
    supabase,
  }
}

function validateInput<T>(schema: z.Schema<T> | undefined, input: unknown): T {
  if (!schema) return input as T

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    throw parsed.error
  }

  return parsed.data
}

function extractFormPayload(formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    payload[key] = value
  })
  return payload
}

/* ============================================================
 * 1. RPC-style secure server action
 *    - Called from buttons / onClick
 *    - No FormData
 *    - Returns ActionResponse<T>
 * ============================================================ */

type SecureActionContext<TInput> = {
  userId: string
  supabase: Awaited<ReturnType<typeof createClient>>
  input: TInput
}

export function createSecureAction<TInput, TOutput>(handler: (ctx: SecureActionContext<TInput>) => Promise<TOutput>, schema?: z.Schema<TInput>) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    const actionName = handler.name || 'anonymous_action'
    const startTime = Date.now()

    try {
      // 1. Validate input
      const validatedInput = validateInput(schema, input)

      // 2. Auth
      const { userId, supabase } = await requireAuthenticatedUser(actionName)

      // 3. Execute
      const result = await handler({
        userId,
        supabase,
        input: validatedInput,
      })

      logger.info({ action: actionName, userId, duration: Date.now() - startTime }, 'Form action completed')

      return { success: true, data: result }
    } catch (error) {
      if ((error as Error)?.message === REDIRECT_ERROR_CODE) throw error

      if (error instanceof z.ZodError) {
        logger.warn({ action: actionName, error }, 'Validation failed')
        return { success: false, error: error.message, code: 'VALIDATION_ERROR' }
      }

      if ((error as Error)?.message === 'AUTH_REQUIRED') {
        return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }
      }

      logger.error({ action: actionName, error }, 'Unexpected error')
      return { success: false, error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' }
    }
  }
}

/* ============================================================
 * 2. Form-bound secure server action
 *    - Used with useActionState
 *    - Accepts (prevState, FormData)
 *    - Returns state
 * ============================================================ */

type SecureStatefulFormActionContext<TPayload> = {
  userId: string
  supabase: Awaited<ReturnType<typeof createClient>>
  formData: FormData
  payload: TPayload
}

export function createSecureStatefulFormAction<TPayload, TState>(
  handler: (ctx: SecureStatefulFormActionContext<TPayload>) => Promise<TState>,
  schema?: z.Schema<TPayload>
) {
  return async (_prevState: TState, formData: FormData): Promise<TState> => {
    const actionName = handler.name || 'anonymous_form_action'
    const startTime = Date.now()

    try {
      // 1. Auth
      const { userId, supabase } = await requireAuthenticatedUser(actionName)

      // 2. Extract & validate payload
      const rawPayload = extractFormPayload(formData)
      const payload = validateInput(schema, rawPayload)

      // 3. Execute
      const result = await handler({
        userId,
        supabase,
        formData,
        payload,
      })

      logger.info({ action: actionName, userId, duration: Date.now() - startTime }, 'Form action completed')

      return result
    } catch (error) {
      if ((error as Error)?.message === REDIRECT_ERROR_CODE) throw error

      logger.error({ action: actionName, error }, 'Unexpected form action error')

      return {
        success: false,
        error: error instanceof z.ZodError ? error.message : 'An unexpected error occurred',
        code: error instanceof z.ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
      } as TState
    }
  }
}

type SecureFormActionContext<TPayload> = {
  userId: string
  supabase: Awaited<ReturnType<typeof createClient>>
  formData: FormData
  payload: TPayload
}

export function createSecureFormAction<TPayload>(handler: (ctx: SecureFormActionContext<TPayload>) => Promise<void>, schema?: z.Schema<TPayload>) {
  return async (formData: FormData): Promise<void> => {
    const actionName = handler.name || 'anonymous_simple_form_action'
    const startTime = Date.now()

    try {
      // 1. Auth
      const { userId, supabase } = await requireAuthenticatedUser(actionName)

      // 2. Extract & validate payload
      const rawPayload = extractFormPayload(formData)
      const payload = validateInput(schema, rawPayload)

      // 3. Execute
      await handler({
        userId,
        supabase,
        formData,
        payload,
      })

      logger.info({ action: actionName, userId, duration: Date.now() - startTime }, 'Form action completed')
    } catch (error) {
      if ((error as Error)?.message === REDIRECT_ERROR_CODE) throw error

      logger.error({ action: actionName, error }, 'Unexpected simple form action error')
      throw error // Re-throw for error boundaries
    }
  }
}
