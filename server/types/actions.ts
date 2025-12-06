export type ErrorCode =
  | 'AUTH_REQUIRED' // User not authenticated
  | 'FORBIDDEN' // User lacks permission
  | 'VALIDATION_ERROR' // Invalid input (Zod)
  | 'NOT_FOUND' // Resource doesn't exist
  | 'CONFLICT' // Duplicate or state conflict
  | 'EXTERNAL_ERROR' // Third-party API failure
  | 'INTERNAL_ERROR' // Unexpected server error

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string; code?: ErrorCode }
