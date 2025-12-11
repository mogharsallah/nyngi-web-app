import { describe, it, expect, beforeEach } from 'vitest'
import { createStudioStore, defaultStudioState } from '@/components/lib/stores/studio-store'

describe('Session Store', () => {
  let store: ReturnType<typeof createStudioStore>

  beforeEach(() => {
    store = createStudioStore(defaultStudioState)
  })

  it('should initialize with default state', () => {
    const state = store.getState()
    expect(state.currentSessionPlan).toBeNull()
    expect(state.currentSessionId).toBeNull()
  })

  it('should set session plan', () => {
    store.getState().setSessionPlan('velocity')
    expect(store.getState().currentSessionPlan).toBe('velocity')

    store.getState().setSessionPlan('legacy')
    expect(store.getState().currentSessionPlan).toBe('legacy')
  })

  it('should set session id', () => {
    store.getState().setSessionId('test-session-id')
    expect(store.getState().currentSessionId).toBe('test-session-id')
  })

  it('should reset state', () => {
    store.getState().setSessionPlan('velocity')
    store.getState().setSessionId('test-session-id')

    store.getState().reset()

    const state = store.getState()
    expect(state.currentSessionPlan).toBeNull()
    expect(state.currentSessionId).toBeNull()
  })
})
